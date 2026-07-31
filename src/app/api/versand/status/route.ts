import { NextResponse } from "next/server";
import { getJob } from "@/lib/ebrief/client";
import { ebriefKonfiguriert } from "@/lib/ebrief/token";
import { DISTRIBUTED_STATUSES, hatStatus } from "@/lib/ebrief/types";
import { pruefeZugang, versandTokenKonfiguriert } from "@/lib/versandToken";
import { clientIp, rateLimit } from "@/lib/rateLimit";

/** Generous: the browser polls this while eBrief works through the commit. */
const LIMIT_PRO_STUNDE = 240;
const STUNDE_MS = 60 * 60 * 1000;

/**
 * The four states the UI actually distinguishes. eBrief's sixteen job
 * statuses describe its own pipeline; the browser only needs to know whether
 * to keep polling, show the address warning, offer the payment step, or give
 * up.
 */
export type VersandStatus = "laeuft" | "bereit" | "adresse_warnung" | "fehler";

/**
 * Maps an eBrief job status onto the UI state.
 *
 * Kept separate from the handler so the mapping can be exercised on its own —
 * it is the substance of this route and cannot be checked against the live API.
 *
 * The parameter is a plain string because that is what the API specification
 * declares: `JobStatus` is a nullable free string, not an enum, so a status
 * outside the sixteen this codebase knows is possible and so is none at all.
 *
 * Note that everything unrecognised — including a missing status — falls
 * through to "laeuft": the commit is asynchronous on eBrief's side, so an
 * unfamiliar status is far more likely to be a stage of that pipeline than a
 * terminal state, and claiming "fehler" for a job that is merely still working
 * would be the worse mistake.
 */
export function versandStatus(
  ebriefStatus: string | null | undefined
): VersandStatus {
  if (typeof ebriefStatus !== "string") return "laeuft";

  // eBrief could not verify the address and wants a human decision. Must be
  // checked before anything else — this is the whole reason the job is
  // committed before payment.
  if (ebriefStatus === "USER_CONFIRMATION_REQUESTED") return "adresse_warnung";

  if (
    ebriefStatus.startsWith("ERROR") ||
    ebriefStatus === "ROLLEDBACK" ||
    // Terminal like the other two: a deleted job never becomes "bereit", so
    // reporting it as still working would leave the browser polling forever.
    ebriefStatus === "USER_DELETED"
  ) {
    return "fehler";
  }

  if (
    ebriefStatus === "COMPLETED_DOCUMENTS_PROCESS" ||
    ebriefStatus === "USER_WAIT_FOR_SHOPPING" ||
    // Already distributed jobs count as ready too: the address check is long
    // settled, and this route must not report a printed letter as pending.
    hatStatus(ebriefStatus, DISTRIBUTED_STATUSES)
  ) {
    return "bereit";
  }

  return "laeuft";
}

/**
 * Polled by the browser while eBrief works through the commit it was handed by
 * POST /api/versand/vorbereiten. Answers with the UI state, the raw eBrief
 * status (for logs and support) and the id of the first document, which the
 * later address-confirmation step needs for POST /Docs/confirmation.
 *
 * Requires the capability token issued by the prepare route: the jobId alone
 * is a small sequential integer, and without the token anyone could count
 * upwards and watch every job in the account.
 *
 * Everything returned to the client is an error slug, never prose — the site
 * ships in six languages and the UI translates the slugs via src/i18n.
 */
export async function GET(request: Request) {
  // No credentials, or no secret to check tokens with, means the site simply
  // keeps working as a free download.
  if (!ebriefKonfiguriert() || !versandTokenKonfiguriert()) {
    return NextResponse.json(
      { fehler: "versand_nicht_konfiguriert" },
      { status: 503 }
    );
  }

  const zugang = pruefeZugang(request);
  if (!zugang.ok) {
    return NextResponse.json(
      { fehler: zugang.fehler },
      { status: zugang.status }
    );
  }

  // Namespaced: the limiter is keyed by string alone, so a bare IP would put
  // the polling done here into the same bucket as the far tighter preview
  // limit and starve it.
  if (!rateLimit(`status:${clientIp(request)}`, LIMIT_PRO_STUNDE, STUNDE_MS)) {
    return NextResponse.json({ fehler: "zu_viele_anfragen" }, { status: 429 });
  }

  const { jobId } = zugang;
  try {
    const job = await getJob(jobId);
    return NextResponse.json(
      {
        status: versandStatus(job.JobStatus),
        ebriefStatus: job.JobStatus ?? null,
        docId: job.Documents?.[0]?.Id ?? null,
      },
      // The point of polling is to see the next status, not a cached one.
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("eBrief status query failed", { jobId, err });
    return NextResponse.json({ fehler: "ebrief_fehler" }, { status: 502 });
  }
}
