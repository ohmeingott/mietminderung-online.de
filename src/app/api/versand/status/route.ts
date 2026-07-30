import { NextResponse } from "next/server";
import { getJob } from "@/lib/ebrief/client";
import { ebriefKonfiguriert } from "@/lib/ebrief/token";
import { DISTRIBUTED_STATUSES } from "@/lib/ebrief/types";
import type { JobStatus } from "@/lib/ebrief/types";

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
 * Note that everything unrecognised falls through to "laeuft": the commit is
 * asynchronous on eBrief's side, so an unfamiliar status is far more likely to
 * be a stage of that pipeline than a terminal state, and claiming "fehler" for
 * a job that is merely still working would be the worse mistake.
 */
export function versandStatus(ebriefStatus: JobStatus): VersandStatus {
  // eBrief could not verify the address and wants a human decision. Must be
  // checked before anything else — this is the whole reason the job is
  // committed before payment.
  if (ebriefStatus === "USER_CONFIRMATION_REQUESTED") return "adresse_warnung";

  if (ebriefStatus.startsWith("ERROR") || ebriefStatus === "ROLLEDBACK") {
    return "fehler";
  }

  if (
    ebriefStatus === "COMPLETED_DOCUMENTS_PROCESS" ||
    ebriefStatus === "USER_WAIT_FOR_SHOPPING" ||
    // Already distributed jobs count as ready too: the address check is long
    // settled, and this route must not report a printed letter as pending.
    DISTRIBUTED_STATUSES.includes(ebriefStatus)
  ) {
    return "bereit";
  }

  return "laeuft";
}

/** Accepts a positive integer id only — "0", "-1", "1.5" and "1e3" are not ids. */
function parseId(wert: string | null): number | null {
  if (wert === null || !/^\d+$/.test(wert)) return null;
  const id = Number(wert);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/**
 * Polled by the browser while eBrief works through the commit it was handed by
 * POST /api/versand/vorbereiten. Answers with the UI state, the raw eBrief
 * status (for logs and support) and the id of the first document, which
 * /api/versand/adressvorschau needs to render the marked-up preview.
 *
 * Everything returned to the client is an error slug, never prose — the site
 * ships in six languages and the UI translates the slugs via src/i18n.
 */
export async function GET(request: Request) {
  // No credentials means the site simply keeps working as a free download.
  if (!ebriefKonfiguriert()) {
    return NextResponse.json(
      { fehler: "versand_nicht_konfiguriert" },
      { status: 503 }
    );
  }

  const jobId = parseId(new URL(request.url).searchParams.get("jobId"));
  if (jobId === null) {
    return NextResponse.json({ fehler: "jobId_ungueltig" }, { status: 400 });
  }

  try {
    const job = await getJob(jobId);
    return NextResponse.json(
      {
        status: versandStatus(job.Status),
        ebriefStatus: job.Status,
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
