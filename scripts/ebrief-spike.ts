/**
 * One-off staging spike for the eBrief job lifecycle.
 *
 * The whole "pay before we print" design for physical-post dispatch rests on
 * one assumption: a job that is committed but never distributed is not
 * printed and not invoiced. This script walks the lifecycle up to (but NOT
 * including) distribution against the real eBrief API, so that assumption
 * can be checked before more code is built on top of it.
 *
 * MUST be run against the eBrief STAGING environment (EBRIEF_BASE_URL should
 * point at staging, or be left unset so the client falls back to the
 * staging default — see src/lib/ebrief/token.ts). This script deliberately
 * never calls `distribute`, so nothing it does should cause a letter to be
 * printed or a charge to be raised.
 *
 * ABORT CRITERION for whoever runs this: watch the per-poll status log after
 * the commit step. If the job jumps straight to a `DISTRIBUTION_*` or
 * `BILLING_COMPLETED` status right after the commit (i.e. before any
 * `confirmDocs`/`distribute` call from this script — which never happens),
 * that means eBrief prints immediately on commit and the "pay before
 * distribution" design does not hold. Stop and revisit the design; do not
 * continue building the payment flow on this assumption.
 *
 * Usage:
 *   npx tsx scripts/ebrief-spike.ts <path-to-test.pdf>
 */
import * as fs from "node:fs";

import {
  addFile,
  commitJob,
  createJob,
  deleteJob,
  getFileWithMark,
  getJob,
  getPrice,
} from "../src/lib/ebrief/client";
import { ebriefBaseUrl } from "../src/lib/ebrief/token";
import { DISTRIBUTED_STATUSES, type EbriefJob } from "../src/lib/ebrief/types";

const POLL_ATTEMPTS = 30;
const POLL_INTERVAL_MS = 2000;

/** Statuses at which polling should stop and the lifecycle has reached a
 * meaningful checkpoint short of distribution. */
const STOP_STATUSES = [
  "COMPLETED_DOCUMENTS_PROCESS",
  "USER_CONFIRMATION_REQUESTED",
  "USER_WAIT_FOR_SHOPPING",
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error("Usage: npx tsx scripts/ebrief-spike.ts <path-to-test.pdf>");
    process.exit(1);
    return;
  }

  // Log which environment is actually being hit before doing anything else,
  // so a staging/live mixup is obvious from the very first line of output.
  const baseUrl = ebriefBaseUrl();
  console.log(`eBrief base URL in use: ${baseUrl}`);

  // Refuse to run anywhere but staging. This script exists precisely because
  // we do not yet know whether committing a job already triggers printing —
  // so pointing it at live is the one mistake that could produce a real,
  // billed letter. A log line is not enough of a safeguard for that.
  if (!baseUrl.includes("staging")) {
    console.error(
      `Refusing to run against a non-staging URL: ${baseUrl}. ` +
        "Set EBRIEF_BASE_URL to the staging host, or leave it unset."
    );
    process.exit(1);
    return;
  }

  // Step 1: create an empty job. Attributes match a plain, untracked,
  // non-duplex, non-color letter with no silent confirmation.
  const job = await createJob({
    IsDuplex: "false",
    IsColor: "false",
    IsTracking: "false",
    SilentConfirm: "false",
  });
  console.log(`Created job: Id=${job.Id} Status=${job.Status}`);

  // Step 2: upload the test PDF as the job's single document.
  const pdfBuffer = fs.readFileSync(pdfPath);
  const base64Content = pdfBuffer.toString("base64");
  await addFile(job.Id, "spike.pdf", base64Content);
  console.log(`Uploaded ${pdfPath} as spike.pdf (${pdfBuffer.length} bytes)`);

  // Step 3: commit the job. This is the point at which eBrief starts
  // processing the document. It is NOT the point at which it is printed —
  // that requires a separate, explicit `distribute` call, which this script
  // never makes.
  await commitJob(job.Id);
  console.log(`Committed job ${job.Id}`);

  // Step 4: poll job status until it reaches a meaningful checkpoint, an
  // error, or the attempt budget is exhausted. Every iteration logs the
  // status so the abort criterion above is visible without extra tooling.
  // Kept outside the loop so the address check below can use whatever the
  // last poll saw, whichever way the loop ended.
  let letzterJob: EbriefJob | undefined;

  for (let attempt = 1; attempt <= POLL_ATTEMPTS; attempt++) {
    const polledJob = await getJob(job.Id);
    letzterJob = polledJob;
    const docCount = polledJob.Documents?.length ?? 0;
    console.log(
      `[poll ${attempt}/${POLL_ATTEMPTS}] Status=${polledJob.Status} Documents=${docCount}`
    );

    if (DISTRIBUTED_STATUSES.includes(polledJob.Status)) {
      console.warn(
        `ABORT CRITERION MET: job reached distributed status "${polledJob.Status}" ` +
          "without this script ever calling distribute. eBrief appears to print " +
          "on commit — the payment-before-distribution design does not hold."
      );
      break;
    }

    if (
      STOP_STATUSES.includes(polledJob.Status) ||
      polledJob.Status.startsWith("ERROR")
    ) {
      console.log(`Reached stable state: ${polledJob.Status}`);
      console.log(JSON.stringify(polledJob.Documents ?? [], null, 2));
      break;
    }

    if (attempt < POLL_ATTEMPTS) {
      await sleep(POLL_INTERVAL_MS);
    }
  }

  // Step 4b: fetch eBrief's own rendering with the address zone it detected
  // marked up, and write it next to the uploaded PDF. This is the only way to
  // see whether our address block lands where eBrief actually looks — the
  // layout was measured from the spacing template, but never confirmed
  // against the reader that has to find it.
  const docId = letzterJob?.Documents?.[0]?.Id;
  if (docId === undefined) {
    console.warn(
      "No document id on the job — cannot check what eBrief read as the address."
    );
  } else {
    try {
      const markiert = await getFileWithMark(docId);
      const markPfad = `${pdfPath.replace(/\.pdf$/i, "")}-eBrief-markiert.pdf`;
      fs.writeFileSync(markPfad, Buffer.from(markiert));
      console.log(
        `Wrote ${markPfad} — open it and check the marked zone sits on the recipient address.`
      );
    } catch (error) {
      console.warn("Could not fetch the marked file:", error);
    }
  }

  // Step 5: look up the purchase prices for a plain letter vs. a registered
  // (tracked) letter — the two options the payment flow needs to price.
  const priceLetter = await getPrice({
    pages: 2,
    isColor: false,
    isDuplex: false,
    isTracking: false,
  });
  console.log("Price (plain letter, isTracking=false):");
  console.log(JSON.stringify(priceLetter, null, 2));

  const priceRegistered = await getPrice({
    pages: 2,
    isColor: false,
    isDuplex: false,
    isTracking: true,
  });
  console.log("Price (registered letter, isTracking=true):");
  console.log(JSON.stringify(priceRegistered, null, 2));

  // Step 6: delete the job. Per the eBrief docs, a deleted job is not
  // printed, distributed, or invoiced — this is the cleanup step that keeps
  // this spike from leaving billable jobs sitting on staging.
  await deleteJob(job.Id);
  console.log(
    `Deleted job ${job.Id}. Per the eBrief docs, a deleted job is not printed, ` +
      "distributed, or invoiced."
  );

  // NOTE: `distribute` is intentionally never called anywhere in this script.
  // Distribution is the action that triggers printing and billing, and the
  // entire point of this spike is to observe the lifecycle without ever
  // crossing that line.
}

main().catch((error) => {
  console.error("eBrief spike failed:", error);
  process.exit(1);
});
