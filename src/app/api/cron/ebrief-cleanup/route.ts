import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { EbriefError, deleteJob, searchJobs } from "@/lib/ebrief/client";
import type { JobSuchFilter } from "@/lib/ebrief/client";
import { ebriefKonfiguriert } from "@/lib/ebrief/token";
import { DISTRIBUTED_STATUSES, hatStatus } from "@/lib/ebrief/types";
import type { EbriefSearchJob, JobStatus } from "@/lib/ebrief/types";

/**
 * Explicit because the authorisation gate uses node:crypto's timingSafeEqual,
 * which does not exist on the edge runtime. Getting this wrong would break the
 * only thing standing between a stranger and a route that deletes jobs.
 */
export const runtime = "nodejs";

/**
 * Reaps eBrief jobs that were prepared but never paid for.
 *
 * POST /api/versand/vorbereiten creates and commits a job BEFORE payment, so
 * eBrief's address check can run while the user can still correct things.
 * Every user who then abandons the flow leaves a committed job behind. Those
 * cost nothing — eBrief bills on distribution, and the docs say of USER_DELETED
 * "It will not be printed, distributed, or invoiced" — but they accumulate, and
 * the docs do not say whether there is a cap on open jobs per account.
 *
 * This route deletes things at a third party, so every rule below is written to
 * fail towards "leave it alone". The failure that matters is deleting a job
 * somebody is about to pay for, or one already on its way: the first takes
 * money for a letter that can no longer be posted, the second is unrecoverable.
 * A job left behind for another night costs nothing at all.
 */

/** A checkout that has been running for a day is not a checkout in progress. */
const MINDESTALTER_MS = 24 * 60 * 60 * 1000;

/** The page size the API documentation's own example uses. */
const SEITENGROESSE = 200;
/**
 * Upper bound on pages fetched in one run, i.e. 5000 jobs. Reached only if the
 * account has an enormous backlog, in which case the run reports that it was
 * truncated and the next night continues — the alternative, an unbounded loop
 * against a third-party API inside a serverless function, is worse.
 *
 * A backlog that large would also outlast the function timeout, since the
 * deletes below run one at a time. That is survivable rather than something to
 * engineer around: every completed delete has already taken effect at eBrief
 * and leaves the candidate set, so a run cut short simply resumes tomorrow. The
 * cost of a truncated run is a day of delay, never a wrong deletion.
 */
const MAX_SEITEN = 25;

/**
 * Sanity bounds on a parsed timestamp. Anything outside them counts as
 * unreadable rather than believed:
 *
 *  - Below the floor sits, among other things, a value in epoch SECONDS read
 *    as milliseconds (1.8e9 ms is January 1970). That misreading would make
 *    every job look decades old and delete the lot, so it must produce an
 *    "unknown", not an "age".
 *  - Above the ceiling the timestamp lies more than a day in the future, which
 *    no creation date legitimately does. Ordinary clock skew of a few hours is
 *    tolerated and simply yields a negative age, i.e. "too young".
 */
const FRUEHESTER_ZEITSTEMPEL = Date.UTC(2020, 0, 1);
const ZUKUNFTS_TOLERANZ_MS = 24 * 60 * 60 * 1000;

/**
 * The only statuses this route will delete: everything strictly before
 * distribution, plus the dead ends that can never reach it.
 *
 * An allow-list rather than a deny-list, typed as JobStatus[] so a renamed
 * status breaks the build. The rule is "not distributed and not already
 * deleted"; this is that rule plus one, because a status eBrief adds later
 * would satisfy a deny-list by default and be deleted. A status we have never
 * heard of is far more likely to be a new stage of dispatch than a new kind of
 * abandoned draft, so it must not be assumed harmless.
 *
 * Doubles as the `JobStatus` filter sent to the search, which is what keeps the
 * paging below from being clogged by jobs that are not candidates at all.
 */
const LOESCHBARE_STATUSES: JobStatus[] = [
  "UNPROCESSED",
  "COMMITTED",
  "PROCESSING_DOCUMENTS_PREPARE",
  "COMPLETED_DOCUMENTS_PREPARE",
  "PROCESSING_DOCUMENTS_PROCESS",
  "COMPLETED_DOCUMENTS_PROCESS",
  "USER_CONFIRMATION_REQUESTED",
  "USER_WAIT_FOR_SHOPPING",
  "ERROR_DOCUMENT",
  "ERROR_GENERAL",
  "ROLLEDBACK",
];

/**
 * Vercel Cron sends exactly `Authorization: Bearer <CRON_SECRET>`. Compared
 * over the whole header value in constant time, the same way
 * src/lib/versandToken.ts compares its signatures.
 */
function autorisiert(request: Request, secret: string): boolean {
  const kopf = request.headers.get("authorization");
  if (!kopf) return false;

  const erwartet = Buffer.from(`Bearer ${secret}`, "utf8");
  const geliefert = Buffer.from(kopf, "utf8");
  // timingSafeEqual throws on differing lengths. Returning early leaks the
  // length of the secret, not its content.
  if (erwartet.length !== geliefert.length) return false;
  return timingSafeEqual(erwartet, geliefert);
}

type Zeiteinheit = "sekunden" | "millisekunden";
type Alter =
  | { bekannt: true; ms: number; einheit: Zeiteinheit }
  | { bekannt: false };

/**
 * The age of a job, or the admission that it could not be established.
 *
 * The search response dates a job with `DateCreatedUnix`, described in the
 * specification only as "Job created DateTime (in Unix format)" — an int64 with
 * no word on whether it counts seconds or milliseconds, and Unix time is
 * written both ways. Both readings are tried and the first one that lands
 * inside the sanity bounds above wins; the two cannot both fit, since a
 * seconds value read as milliseconds falls in 1970 and a milliseconds value
 * read as seconds falls tens of thousands of years from now.
 *
 * Never guesses beyond that. A job whose age is unknown is left alone, because
 * "how old is this" is the only thing separating an abandoned draft from a
 * checkout the user is in the middle of.
 */
function alterVonJob(job: EbriefSearchJob, jetzt: number): Alter {
  const roh = job.DateCreatedUnix;
  if (typeof roh !== "number" || !Number.isFinite(roh)) return { bekannt: false };

  const lesarten: { einheit: Zeiteinheit; zeit: number }[] = [
    { einheit: "sekunden", zeit: roh * 1000 },
    { einheit: "millisekunden", zeit: roh },
  ];

  for (const { einheit, zeit } of lesarten) {
    if (zeit < FRUEHESTER_ZEITSTEMPEL) continue;
    if (zeit > jetzt + ZUKUNFTS_TOLERANZ_MS) continue;
    return { bekannt: true, ms: jetzt - zeit, einheit };
  }
  return { bekannt: false };
}

/**
 * "The API did not like this request body." Deliberately not every 4XX: a 401
 * or 429 says nothing about the filters, and retrying those without filters
 * would just spend a second call on the same refusal.
 */
const ABLEHNUNG_STATUSES = [400, 404, 415, 422];

function istFilterAblehnung(err: unknown): boolean {
  return err instanceof EbriefError && ABLEHNUNG_STATUSES.includes(err.status);
}

interface Sammlung {
  jobs: EbriefSearchJob[];
  seiten: number;
  /** True once every job the search can show has been seen. */
  vollstaendig: boolean;
  /** Why collection stopped — carried into the response for the operator. */
  grund: "letzte_seite" | "seitenlimit" | "paging_wirkungslos";
  /** The filtered search was refused and a bare paged search was used instead. */
  filterAbgelehnt: boolean;
  /** `ResultMetadata.TotalCount` from the first page, for comparison. */
  gesamtLautApi?: number;
}

/**
 * Collects the candidate jobs, reading only — nothing is deleted until every
 * page has been fetched.
 *
 * That separation is deliberate: deleting while paging would shift the result
 * set under the cursor (a deleted job leaves the JobStatus filter, so page 2
 * would silently skip as many jobs as page 1 removed) and the run would only
 * ever reap half its backlog.
 *
 * Three assumptions and what happens when each is wrong:
 *
 *  1. `Paging` works as documented. If the API ignores it, page 2 comes back
 *     identical to page 1; that is detected (no new ids) and collection stops
 *     with `paging_wirkungslos` rather than looping MAX_SEITEN times over the
 *     same rows. The run still processes what it saw.
 *  2. `JobStatus` and `DateTo` filter what we think they filter. Neither is
 *     trusted: every job is re-checked against LOESCHBARE_STATUSES and its own
 *     timestamp before deletion, so a filter that selects the wrong jobs costs
 *     a wasted page, not a wrong deletion. If the API refuses the filters
 *     outright (4XX), one bare paged search is tried instead, so a cleanup does
 *     not stop working because of a filter it never needed.
 *  3. The response is shaped as the specification describes. If it is not, the
 *     client raises rather than reporting an empty page, and the caller turns
 *     that into a failed run — a cleanup that sees nothing must not read like a
 *     cleanup with nothing to do.
 */
async function sammleKandidaten(stichtag: string): Promise<Sammlung> {
  const jobs: EbriefSearchJob[] = [];
  const gesehen = new Set<number>();
  let filterAbgelehnt = false;
  let seiten = 0;
  let gesamtLautApi: number | undefined;

  for (let seite = 1; seite <= MAX_SEITEN; seite++) {
    const filter: JobSuchFilter = {
      Paging: { PageNumber: seite, PageSize: SEITENGROESSE },
      ...(filterAbgelehnt
        ? {}
        : { JobStatus: LOESCHBARE_STATUSES, DateTo: stichtag }),
    };

    let ergebnis;
    try {
      ergebnis = await searchJobs(filter);
    } catch (err) {
      if (!filterAbgelehnt && istFilterAblehnung(err)) {
        // The filters are documented but unverified against the live API.
        // Rather than let the whole cleanup die on one of them, drop them and
        // retry this page unfiltered; the per-job checks were always the real
        // safeguard.
        console.error(
          "eBrief rejected the filtered job search — retrying without filters",
          { seite, err }
        );
        filterAbgelehnt = true;
        seite--;
        continue;
      }
      throw err;
    }

    seiten = seite;
    if (gesamtLautApi === undefined) gesamtLautApi = ergebnis.gesamt;

    const neu = ergebnis.jobs.filter((job) => !gesehen.has(job.Id));
    for (const job of neu) {
      gesehen.add(job.Id);
      jobs.push(job);
    }

    // A short page is the end of the result set. So is an empty one.
    if (ergebnis.jobs.length < SEITENGROESSE) {
      return {
        jobs,
        seiten,
        vollstaendig: true,
        grund: "letzte_seite",
        filterAbgelehnt,
        gesamtLautApi,
      };
    }
    // A full page that added nothing new means Paging had no effect; asking for
    // page 3 would only fetch page 1 again.
    if (neu.length === 0) {
      return {
        jobs,
        seiten,
        vollstaendig: false,
        grund: "paging_wirkungslos",
        filterAbgelehnt,
        gesamtLautApi,
      };
    }
  }

  return {
    jobs,
    seiten,
    vollstaendig: false,
    grund: "seitenlimit",
    filterAbgelehnt,
    gesamtLautApi,
  };
}

export async function GET(request: Request) {
  // No secret, no run. An authorisation check that waves everything through
  // when unconfigured is worse than no check at all, and this route deletes
  // things — the same reasoning as versandTokenKonfiguriert() in the dispatch
  // routes.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("CRON_SECRET is not set — eBrief cleanup refuses to run");
    return NextResponse.json(
      { fehler: "cron_nicht_konfiguriert" },
      { status: 503 }
    );
  }

  if (!autorisiert(request, secret)) {
    console.error("Unauthorised call to the eBrief cleanup cron");
    return NextResponse.json({ fehler: "nicht_autorisiert" }, { status: 401 });
  }

  // A deployment without eBrief credentials is download-only. It has no jobs to
  // clean up and that is not a failure — an error here would have the cron
  // report red every night on a perfectly healthy deployment.
  if (!ebriefKonfiguriert()) {
    console.log("eBrief is not configured — cleanup skipped");
    return NextResponse.json({
      status: "uebersprungen",
      grund: "ebrief_nicht_konfiguriert",
    });
  }

  const jetzt = Date.now();
  const stichtag = new Date(jetzt - MINDESTALTER_MS).toISOString();

  let sammlung: Sammlung;
  try {
    sammlung = await sammleKandidaten(stichtag);
  } catch (err) {
    // Nothing was inspected, so nothing can be said about the backlog. Report
    // the failure rather than an empty success.
    console.error("eBrief job search failed — cleanup aborted", { err });
    return NextResponse.json({ fehler: "ebrief_fehler" }, { status: 502 });
  }

  let geloescht = 0;
  let zuJung = 0;
  let alterUnbekannt = 0;
  let fehlgeschlagen = 0;
  let geschuetzt = 0;
  let statusUnbekannt = 0;

  for (const job of sammlung.jobs) {
    const status = job.JobStatus;

    // Conditions 1 and 2 — not distributed, not already USER_DELETED — hold by
    // construction, since neither appears in LOESCHBARE_STATUSES. They are
    // named again here only to sort them into the right counter: a job on its
    // way is a normal sight, a status nobody recognises deserves its own
    // number. `JobStatus` is a free string in the specification, so "no status
    // at all" and "a status added after this code was written" are both
    // possible and both mean: leave it alone.
    if (!hatStatus(status, LOESCHBARE_STATUSES)) {
      const bekanntGeschuetzt =
        hatStatus(status, DISTRIBUTED_STATUSES) || status === "USER_DELETED";
      if (bekanntGeschuetzt) geschuetzt++;
      else statusUnbekannt++;
      continue;
    }

    // Condition 3 — old enough, and provably so. No readable timestamp means no
    // deletion: never delete something whose age could not be established, no
    // matter what the server-side DateTo filter appeared to promise.
    const alter = alterVonJob(job, jetzt);
    if (!alter.bekannt) {
      alterUnbekannt++;
      continue;
    }
    if (alter.ms < MINDESTALTER_MS) {
      zuJung++;
      continue;
    }

    // Best-effort per job: one refusal from eBrief must not abort the run and
    // leave the rest of the backlog to tomorrow.
    try {
      await deleteJob(job.Id);
      geloescht++;
      console.log("Abandoned eBrief job deleted", {
        jobId: job.Id,
        status,
        alterStunden: Math.round(alter.ms / (60 * 60 * 1000)),
        zeitEinheit: alter.einheit,
      });
    } catch (err) {
      fehlgeschlagen++;
      console.error("Abandoned eBrief job could not be deleted", {
        jobId: job.Id,
        status,
        err,
      });
    }
  }

  const zusammenfassung = {
    status: "ok" as const,
    geloescht,
    zuJung,
    alterUnbekannt,
    fehlgeschlagen,
    geschuetzt,
    statusUnbekannt,
    geprueft: sammlung.jobs.length,
    seiten: sammlung.seiten,
    /** What the search itself said the filter matched, for comparison. */
    gesamtLautApi: sammlung.gesamtLautApi ?? null,
    /**
     * Whether this run saw the whole backlog. "unbekannt" is a real answer,
     * not a placeholder: a cleanup that only ever sees the first page is a
     * cleanup that does not work, and the operator has to be able to tell.
     */
    vollstaendigkeit: sammlung.vollstaendig ? "vollstaendig" : "unbekannt",
    abbruchgrund: sammlung.grund,
    filterAbgelehnt: sammlung.filterAbgelehnt,
  };

  if (sammlung.grund === "paging_wirkungslos") {
    console.error(
      "eBrief searchJobDetails ignored the Paging parameter — the cleanup only ever sees one page",
      zusammenfassung
    );
  }

  // A handful of undatable jobs is noise. A large share of them means
  // DateCreatedUnix is absent or in a unit neither reading recognises, the
  // cleanup is quietly deleting nothing, and a human needs to know.
  if (alterUnbekannt > 0 && alterUnbekannt * 2 >= sammlung.jobs.length) {
    console.error(
      "Most eBrief jobs carried no readable DateCreatedUnix — the cleanup is not working",
      zusammenfassung
    );
  }

  console.log("eBrief cleanup finished", zusammenfassung);
  return NextResponse.json(zusammenfassung);
}
