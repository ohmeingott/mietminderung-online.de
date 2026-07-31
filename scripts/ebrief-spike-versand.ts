/**
 * Second staging spike — the one that actually sends.
 *
 * The first spike established that a committed job stops at
 * USER_WAIT_FOR_SHOPPING and is not printed. That is also the only status
 * `POST /Jobs/payment` accepts, which leaves one question open: does our Stripe
 * webhook's `POST /Jobs/distribution` work from there, or is eBrief's own
 * shopping step required first?
 *
 * This script answers it by trying distribution first — exactly what the
 * webhook does — and only reaching for payment if that fails. The status after
 * each attempt is what settles it.
 *
 * UNLIKE the first spike, this one DOES distribute. On the staging system that
 * should not produce a physical letter, but that is an expectation, not a
 * certainty: use a recipient address you control.
 *
 * MUST run against staging; it refuses anything else.
 *
 * Usage: npx tsx scripts/ebrief-spike-versand.ts <path-to-test.pdf>
 */
import * as fs from "node:fs";

import {
  addFile,
  commitJob,
  createJob,
  distribute,
  getJob,
  payJob,
} from "../src/lib/ebrief/client";
import { ebriefBaseUrl } from "../src/lib/ebrief/token";
import type { EbriefJobDetails } from "../src/lib/ebrief/types";

const POLL_ATTEMPTS = 30;
const POLL_INTERVAL_MS = 2000;
const SHOPPING = "USER_WAIT_FOR_SHOPPING";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Polls until the status stops changing, printing every transition. */
async function pollBis(
  jobId: number,
  bisStatus: (status: string) => boolean,
  label: string
): Promise<EbriefJobDetails | undefined> {
  let letzter: EbriefJobDetails | undefined;
  let vorherigerStatus = "";
  for (let versuch = 1; versuch <= POLL_ATTEMPTS; versuch++) {
    const job = await getJob(jobId);
    letzter = job;
    const status = job.JobStatus ?? "";
    if (status !== vorherigerStatus) {
      console.log(`  [${label} ${versuch}] JobStatus=${status}`);
      vorherigerStatus = status;
    }
    if (bisStatus(status)) return job;
    if (versuch < POLL_ATTEMPTS) await sleep(POLL_INTERVAL_MS);
  }
  return letzter;
}

async function main(): Promise<void> {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error("Usage: npx tsx scripts/ebrief-spike-versand.ts <path-to-test.pdf>");
    process.exit(1);
    return;
  }

  const baseUrl = ebriefBaseUrl();
  console.log(`eBrief base URL in use: ${baseUrl}`);
  if (!baseUrl.includes("staging")) {
    console.error(
      `Refusing to run against a non-staging URL: ${baseUrl}. This script ` +
        "distributes, which on the live system prints and bills a real letter."
    );
    process.exit(1);
    return;
  }

  const job = await createJob({
    IsDuplex: "false",
    IsColor: "false",
    IsTracking: "false",
    SilentConfirm: "false",
  });
  console.log(`Created job ${job.Id}`);

  await addFile(job.Id, "spike.pdf", fs.readFileSync(pdfPath).toString("base64"));
  await commitJob(job.Id);
  console.log("Uploaded and committed. Waiting for the job to come to rest...");

  const bereit = await pollBis(
    job.Id,
    (s) => s === SHOPPING || s === "COMPLETED_DOCUMENTS_PROCESS" || s.startsWith("ERROR"),
    "warten"
  );
  const statusVorVersand = bereit?.JobStatus ?? "";
  console.log(`Resting status: ${statusVorVersand}`);

  if (statusVorVersand.startsWith("ERROR")) {
    console.error("Job is in an error state; not attempting to send.");
    process.exit(1);
    return;
  }

  // Attempt 1: exactly what the Stripe webhook does today.
  console.log("\n=== Attempt 1: POST /Jobs/distribution (what the webhook does) ===");
  let distributionOk = false;
  try {
    await distribute(job.Id);
    distributionOk = true;
    console.log("  distribute() returned without error");
  } catch (error) {
    console.log(`  distribute() FAILED: ${String(error)}`);
  }

  const nachVerteilung = await pollBis(
    job.Id,
    (s) => s !== statusVorVersand,
    "nach distribute"
  );
  const statusNachVerteilung = nachVerteilung?.JobStatus ?? "";
  console.log(`  Status after distribute: ${statusNachVerteilung}`);

  const verteilungHatGewirkt =
    distributionOk && statusNachVerteilung !== statusVorVersand;

  if (verteilungHatGewirkt) {
    console.log(
      "\nRESULT: distribution works straight from " +
        `${statusVorVersand}. The webhook needs no payment step.`
    );
  } else {
    // Attempt 2: eBrief's own shopping step, then distribution again.
    console.log("\n=== Attempt 2: POST /Jobs/payment, then distribution ===");
    try {
      await payJob(job.Id);
      console.log("  payJob() returned without error");
    } catch (error) {
      console.log(`  payJob() FAILED: ${String(error)}`);
    }

    const nachZahlung = await pollBis(
      job.Id,
      (s) => s !== statusVorVersand,
      "nach payment"
    );
    console.log(`  Status after payment: ${nachZahlung?.JobStatus}`);

    try {
      await distribute(job.Id);
      console.log("  distribute() after payment returned without error");
    } catch (error) {
      console.log(`  distribute() after payment FAILED: ${String(error)}`);
    }

    const endstand = await pollBis(
      job.Id,
      (s) => s.startsWith("DISTRIBUTION") || s === "BILLING_COMPLETED" || s === "JOB_COMPLETED",
      "endstand"
    );
    console.log(`  Final status: ${endstand?.JobStatus}`);
    console.log(
      "\nRESULT: distribution alone was not enough — the webhook must call " +
        "payJob() before distribute()."
    );
  }

  // The job is deliberately NOT deleted: on a distributed job that would either
  // fail or hide what happened, and the point of this run is the trail it left.
  console.log(`\nJob ${job.Id} left in place for inspection.`);
}

main().catch((error) => {
  console.error("eBrief dispatch spike failed:", error);
  process.exit(1);
});
