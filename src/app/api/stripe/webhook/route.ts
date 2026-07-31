import { NextResponse } from "next/server";
import { confirmDocs, distribute, getJob } from "@/lib/ebrief/client";
import {
  DISTRIBUTED_STATUSES,
  VOR_VERTEILUNG_STATUSES,
  hatStatus,
} from "@/lib/ebrief/types";
import type { JobStatus } from "@/lib/ebrief/types";
import { PRODUKTE, istProduktId } from "@/lib/ebrief/produkte";
import { stripe, stripeKonfiguriert } from "@/lib/stripe";
import { emailConfigured, sendEmail } from "@/lib/email/send";
import { bestellbestaetigungEmail } from "@/lib/email/templates";

/**
 * Explicit, because the signature check depends on it: constructEvent hashes
 * synchronously with node:crypto. On the edge runtime it would need
 * constructEventAsync instead, and the mistake would only show up as every
 * delivery failing in production — after money has been taken.
 */
export const runtime = "nodejs";

/**
 * Which Checkout session caused the dispatch of a job in THIS process.
 *
 * Used for one thing only: the wording of the log line when a payment arrives
 * for a job that is already on its way. It never decides whether to dispatch —
 * the eBrief job status does that, and it is the only source of truth that
 * survives a cold start. A serverless instance forgets this map at will, so an
 * unknown job is reported as unknown rather than as harmless.
 */
const versendetVonSession = new Map<number, string>();
/** Bounded so a long-lived instance cannot grow this without end. */
const MAX_ERINNERTE_JOBS = 500;

function merkeVersand(jobId: number, sessionId: string): void {
  if (versendetVonSession.has(jobId)) return;
  if (versendetVonSession.size >= MAX_ERINNERTE_JOBS) {
    // Map iterates in insertion order, so this evicts the oldest entry.
    const aeltester = versendetVonSession.keys().next().value;
    if (aeltester !== undefined) versendetVonSession.delete(aeltester);
  }
  versendetVonSession.set(jobId, sessionId);
}

/**
 * Jobs eBrief will never post: it failed on them, or they were deleted or
 * rolled back. Distribution cannot be retried into success from any of these,
 * so a payment for such a job is money taken for a letter that will not exist.
 *
 * Listed explicitly and typed as JobStatus rather than matched on a prefix, so
 * that a renamed status breaks the build instead of quietly falling through.
 * Like every list of eBrief statuses in this codebase it is subject to the
 * spelling doubt that `COMITTED` established — a misspelt `ERROR_GENERAL` would
 * not be recognised here. That misses only the chance to stop the retries
 * early: an unrecognised status does not dispatch either way, because
 * dispatching needs a positive match against VOR_VERTEILUNG_STATUSES.
 */
const ENDGUELTIG_GESCHEITERTE_STATUSES: JobStatus[] = [
  "ERROR_DOCUMENT",
  "ERROR_GENERAL",
  "USER_DELETED",
  "ROLLEDBACK",
];

type Wiederholung = "webhook_retry" | "zweite_zahlung" | "unbekannt";

/**
 * Sends the order confirmation § 312f Abs. 2 und 3 BGB owes the customer, and
 * which doubles as the Eingangsbestätigung under § 312i Abs. 1 Nr. 3 BGB.
 *
 * Deliberately unable to fail the request. It runs after `distribute`, and by
 * then the letter is irreversibly on its way: answering 500 because an email
 * did not go out would have Stripe retry a dispatch that already happened, for
 * three days. So every failure is swallowed and logged loudly instead — the
 * duty is real, and a missing confirmation needs a human, not a retry.
 *
 * The narrow gap this leaves: if the process dies between `distribute` and this
 * call, Stripe's retry finds the job already distributed and returns early, so
 * no confirmation is ever sent. Sending from that branch too would mean a
 * duplicate confirmation on every ordinary webhook retry, which is the worse
 * everyday behaviour. The log line below is what closes the gap by hand.
 */
async function sendeBestellbestaetigung(kontext: {
  empfaenger: string | null | undefined;
  produktId: string | undefined;
  betragCent: number | null;
  referenz: string;
  jobId: number;
  eventId: string;
}): Promise<void> {
  const { empfaenger, betragCent, jobId, eventId, referenz } = kontext;

  if (!emailConfigured()) {
    console.error(
      "NO ORDER CONFIRMATION SENT: Resend is not configured — § 312f BGB requires one, send it by hand",
      { jobId, eventId, referenz, empfaenger: empfaenger ?? null }
    );
    return;
  }
  // Checkout collects the address, so this is close to impossible — but the
  // confirmation is owed, and a silent skip would hide that it was not sent.
  if (!empfaenger || betragCent === null) {
    console.error(
      "NO ORDER CONFIRMATION SENT: the paid session carried no email address or no amount — send it by hand",
      { jobId, eventId, referenz, empfaenger: empfaenger ?? null, betragCent }
    );
    return;
  }

  try {
    const ergebnis = await sendEmail({
      to: empfaenger,
      email: bestellbestaetigungEmail({
        produktId: kontext.produktId ?? "",
        betragCent,
        referenz,
      }),
    });
    if (!ergebnis.ok) {
      console.error(
        "NO ORDER CONFIRMATION SENT: Resend refused the message — § 312f BGB requires one, send it by hand",
        { jobId, eventId, referenz, empfaenger }
      );
      return;
    }
    console.log("Order confirmation sent", {
      jobId,
      eventId,
      messageId: ergebnis.id ?? null,
    });
  } catch (err) {
    console.error(
      "NO ORDER CONFIRMATION SENT: sending threw — § 312f BGB requires one, send it by hand",
      { jobId, eventId, referenz, empfaenger, err }
    );
  }
}

function artDerWiederholung(jobId: number, sessionId: string): Wiederholung {
  const bekannt = versendetVonSession.get(jobId);
  if (bekannt === undefined) return "unbekannt";
  return bekannt === sessionId ? "webhook_retry" : "zweite_zahlung";
}

/**
 * Metadata values are free-form strings set by whoever created the session, so
 * the id is parsed rather than trusted: only a plain positive integer, which is
 * what eBrief job ids are and what /api/versand/checkout writes there.
 */
function leseJobId(wert: string | undefined): number | undefined {
  if (typeof wert !== "string") return undefined;
  const roh = wert.trim();
  if (!/^\d+$/.test(roh)) return undefined;
  const zahl = Number(roh);
  return Number.isSafeInteger(zahl) && zahl > 0 ? zahl : undefined;
}

/** `payment_intent` is either the id or the expanded object; we only log the id. */
function paymentIntentId(session: {
  payment_intent: string | { id: string } | null;
}): string | null {
  const pi = session.payment_intent;
  if (pi === null) return null;
  return typeof pi === "string" ? pi : pi.id;
}

/**
 * The point where money becomes a physical letter, and the only irreversible
 * step in the whole dispatch flow: POST /Jobs/distribution has eBrief print,
 * frank and post the Mängelanzeige, and bill us for it. Everything before it —
 * creating the job, uploading the PDF, committing it — can be undone by
 * deleting the job.
 *
 * Three things guard it, in this order:
 *  1. the Stripe signature, without which anyone who knows the URL could have
 *     letters posted at our expense;
 *  2. `payment_status === "paid"`, because `checkout.session.completed` also
 *     fires for payments that have not settled;
 *  3. the eBrief job status, which is the closest thing to a lock this project
 *     has — there is no database, so "already distributed" is answered by
 *     asking eBrief rather than by remembering. The question is put the
 *     positive way round: the job must report a status we recognise as sitting
 *     before distribution, so a status we cannot place — unknown, new,
 *     misspelt or missing — never turns into a second letter. It is a check,
 *     not a lock: two
 *     deliveries for the same job arriving at the same instant could both read
 *     a not-yet-distributed status. Stripe delivers a given event serially and
 *     the checkout route's idempotency key keeps one job to one session, so
 *     this needs concurrent deliveries for one job — the day that stops being
 *     true, this needs real storage, not a tighter read.
 *
 * Failures after the payment answer 500 on purpose: Stripe then retries for up
 * to three days, which is the only thing standing between a transient eBrief
 * outage and a customer who paid for a letter that was never sent. That also
 * covers the job that is merely not ready yet — a payment landing while eBrief
 * still processes the documents fails here and succeeds on a later retry. A
 * job that has failed for good is the exception: it answers 200 so the retries
 * stop, and says so in one findable log line.
 *
 * Nothing here is rate-limited. The signature is the gate, and dropping
 * deliveries under a burst would turn a Stripe retry storm into unsent mail.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  // Without the secret no delivery can be authenticated, and an unauthenticated
  // caller must never be able to trigger printing. Failing closed is the whole
  // point: this is the one misconfiguration that would otherwise let a stranger
  // spend our money. Answering 503 also makes Stripe retry, so deliveries that
  // arrive during a misconfiguration are not lost.
  if (!stripeKonfiguriert() || !secret) {
    console.error(
      "Stripe webhook is not configured — no letter can be dispatched",
      {
        stripeKey: stripeKonfiguriert(),
        webhookSecret: Boolean(secret),
      }
    );
    return NextResponse.json(
      { fehler: "versand_nicht_konfiguriert" },
      { status: 503 }
    );
  }

  const signatur = request.headers.get("stripe-signature");
  if (!signatur) {
    console.error("Stripe webhook without a stripe-signature header");
    return NextResponse.json({ fehler: "signatur_fehlt" }, { status: 400 });
  }

  // The raw bytes, not request.json(): the signature covers the exact body
  // Stripe sent, and a parse-and-restringify would silently change it (key
  // order, number formatting) and fail every verification.
  const roh = await request.text();

  let event;
  try {
    event = stripe().webhooks.constructEvent(roh, signatur, secret);
  } catch (err) {
    // Either a forgery or a secret that does not match the endpoint. Both look
    // the same from here and both must be refused.
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ fehler: "signatur_ungueltig" }, { status: 400 });
  }

  // The two events that can mean "this letter is paid for". Stripe sends
  // `completed` when the Checkout session finishes, which for a delayed
  // notification method (e.g. Klarna, SEPA debit) happens while the payment is
  // still pending; the money is only confirmed later with
  // `async_payment_succeeded`. Both are handled, and both are re-checked
  // against `payment_status` below — the event type alone never authorises a
  // letter. Everything else is acknowledged and ignored: a non-2xx would have
  // Stripe retry events we will never act on.
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ empfangen: true });
  }

  // Narrowed by the check above, so no cast is needed and a future change to
  // the event list cannot quietly hand us the wrong object shape.
  const session = event.data.object;

  // `completed` arrives for delayed-notification methods while the payment is
  // still pending; Stripe's own guidance is to wait for
  // `async_payment_succeeded` in that case. Dispatching here would post a
  // letter that may never be paid for.
  if (session.payment_status !== "paid") {
    console.log("Stripe checkout session not paid — no dispatch", {
      eventId: event.id,
      eventTyp: event.type,
      sessionId: session.id,
      paymentStatus: session.payment_status,
      jobId: session.metadata?.jobId ?? null,
    });
    return NextResponse.json({ empfangen: true });
  }

  const jobId = leseJobId(session.metadata?.jobId);
  if (jobId === undefined) {
    // 200, not an error: Stripe would retry this for three days and no retry
    // can repair a session that never carried a usable job id. The log is the
    // only way anyone learns about it, so it carries everything needed to find
    // the payment in the dashboard and refund it by hand.
    console.error("Paid Stripe session without a usable jobId — no dispatch", {
      eventId: event.id,
      eventTyp: event.type,
      sessionId: session.id,
      paymentIntent: paymentIntentId(session),
      amountTotal: session.amount_total,
      metadata: session.metadata,
    });
    return NextResponse.json({ empfangen: true });
  }

  const produktId = session.metadata?.produktId;

  // Sanity check only. The amount cannot have been manipulated by the client —
  // it came from our own catalogue when the session was created — so a mismatch
  // means the catalogue changed between session creation and payment. The
  // customer paid what was correct at the time; refusing to post their letter
  // over our own price change would punish them for it.
  if (istProduktId(produktId)) {
    const erwartet = PRODUKTE[produktId].preisCent;
    if (session.amount_total !== erwartet) {
      console.warn("Paid amount differs from the catalogue price", {
        eventId: event.id,
        sessionId: session.id,
        jobId,
        produktId,
        amountTotal: session.amount_total,
        katalogCent: erwartet,
      });
    }
  } else {
    console.warn("Paid Stripe session without a known produktId", {
      eventId: event.id,
      sessionId: session.id,
      jobId,
      produktId: produktId ?? null,
    });
  }

  try {
    const job = await getJob(jobId);
    const jobStatus = job.JobStatus;

    if (hatStatus(jobStatus, DISTRIBUTED_STATUSES)) {
      const art = artDerWiederholung(jobId, session.id);
      const daten = {
        eventId: event.id,
        eventTyp: event.type,
        sessionId: session.id,
        paymentIntent: paymentIntentId(session),
        amountTotal: session.amount_total,
        jobId,
        ebriefStatus: jobStatus,
        wiederholung: art,
      };

      if (art === "webhook_retry") {
        // The same Checkout session that already dispatched this job, delivered
        // again. Nothing to do and nothing to refund.
        console.log("Stripe webhook retry for an already dispatched job", daten);
      } else {
        // Either a second payment for a letter that can only be posted once, or
        // a retry this process has no memory of. Both are worth a human look,
        // so both are loud.
        //
        // Deliberately NOT refunded automatically: a refund moves real customer
        // money, and an auto-refund misfiring on a legitimate payment is a
        // worse failure than a rare manual one. The fields above are what the
        // operator needs to find the payment in the Stripe dashboard and decide.
        console.error(
          art === "zweite_zahlung"
            ? "SECOND PAYMENT for an already dispatched job — refund by hand, do not resend"
            : "Payment for an already dispatched job — check in Stripe whether this was a second payment and refund by hand",
          daten
        );
      }

      return NextResponse.json({ empfangen: true });
    }

    if (hatStatus(jobStatus, ENDGUELTIG_GESCHEITERTE_STATUSES)) {
      // 200, so Stripe stops. The 500-and-retry below is right while a failure
      // might still be transient — those retries are the only protection
      // against "paid but not posted". It is wrong here: no retry can revive a
      // deleted or errored job, so three days of identical deliveries would
      // bury the one log line that matters under its own repetitions, and the
      // case most in need of a human would be the hardest to notice.
      //
      // Not refunded automatically, for the same reason as the second-payment
      // case above: this line carries everything the refund needs, so it can be
      // issued from the log alone.
      console.error(
        "PAID BUT UNSENDABLE: the eBrief job failed or is gone, the letter will never be posted — refund by hand",
        {
          eventId: event.id,
          eventTyp: event.type,
          sessionId: session.id,
          paymentIntent: paymentIntentId(session),
          amountTotal: session.amount_total,
          jobId,
          ebriefStatus: jobStatus,
        }
      );
      return NextResponse.json({ empfangen: true });
    }

    /**
     * The gate. Everything above answers a question about a status we
     * recognise; this is the one that decides whether money becomes a physical
     * letter, and it asks positively: distribute only for a status positively
     * known to sit BEFORE distribution.
     *
     * Everything else lands here — an unknown string, a status eBrief adds
     * later, a spelling we have not seen, and no status at all (`JobStatus` is
     * a nullable free string in the specification, and the live API has already
     * answered `COMITTED` where it documents `COMMITTED`). The deny-list this
     * replaced would have read every one of those as "not distributed yet" and
     * posted a second letter for a job already on its way — irreversible, and
     * billed by eBrief either way.
     *
     * 500, so Stripe retries on its own backoff for up to three days. Weighed
     * against the alternative:
     *
     *  - 200 stops the retries and drops a paid letter on the floor. Nothing
     *    else in this system knows the customer paid — there is no database —
     *    so the console line below would be the only trace, and a line nobody
     *    greps for is a refund nobody issues. That is the outcome to rule out.
     *  - 500 keeps the delivery alive, and here the retries are not futile.
     *    The two likely causes of an unrecognised status are a new intermediate
     *    stage of eBrief's pipeline, which the job leaves by itself, and a new
     *    spelling of a state we do know, which a human adds to
     *    VOR_VERTEILUNG_STATUSES and deploys well inside the three-day window.
     *    In both cases a later delivery dispatches correctly and nobody has to
     *    replay a payment by hand.
     *  - It is also what fetches the human: a Stripe endpoint that keeps
     *    answering 5xx is flagged in the dashboard and mailed to the account
     *    owner. A 200 raises nothing anywhere.
     *
     * The price is repetition — on the order of a dozen deliveries per affected
     * payment. That is deliberate, and the same treatment every other "paid but
     * not sent yet" failure gets here. Suppressing the retries is only right
     * for a failure known to be permanent, which is exactly what the terminal
     * branch above is for; a status nobody recognises is by definition not
     * known to be permanent.
     */
    if (!hatStatus(jobStatus, VOR_VERTEILUNG_STATUSES)) {
      console.error(
        "URGENT: unrecognised eBrief job status — payment received, letter NOT dispatched, Stripe will retry",
        {
          eventId: event.id,
          eventTyp: event.type,
          sessionId: session.id,
          paymentIntent: paymentIntentId(session),
          amountTotal: session.amount_total,
          jobId,
          ebriefStatus: jobStatus ?? null,
        }
      );
      return NextResponse.json(
        { fehler: "unbekannter_job_status" },
        { status: 500 }
      );
    }

    if (jobStatus === "USER_CONFIRMATION_REQUESTED") {
      // eBrief could not verify the recipient address and is holding the job;
      // distribute would not move it. The user was shown the warning in the UI
      // and paid anyway, which is the acknowledgement eBrief is waiting for.
      const docIds = (job.Documents ?? [])
        .map((doc) => doc.Id)
        .filter((id): id is number => typeof id === "number");

      if (docIds.length === 0) {
        // Not something to shrug off: the job cannot be released, so the letter
        // stays unsent while the money is taken. Thrown so it lands in the
        // urgent log below and Stripe keeps retrying.
        throw new Error(
          `eBrief job ${jobId} awaits confirmation but reports no documents`
        );
      }

      console.log("Confirming eBrief address warning before dispatch", {
        jobId,
        docIds,
        eventId: event.id,
      });
      await confirmDocs(docIds);
    }

    await distribute(jobId);
    merkeVersand(jobId, session.id);

    console.log("Letter dispatched", {
      jobId,
      eventId: event.id,
      eventTyp: event.type,
      sessionId: session.id,
      produktId: produktId ?? null,
    });

    // After the dispatch, never before: a confirmation for a letter that then
    // fails to go out would be a contract confirmed and not performed. Cannot
    // throw — see the function's own comment.
    await sendeBestellbestaetigung({
      empfaenger: session.customer_details?.email,
      produktId,
      betragCent: session.amount_total,
      referenz: session.id,
      jobId,
      eventId: event.id,
    });

    return NextResponse.json({ empfangen: true });
  } catch (err) {
    // The customer has paid and no letter has gone out. 500 makes Stripe retry
    // for up to three days, which will carry the dispatch through a transient
    // eBrief outage on its own; if it does not, this line is the only trace
    // anyone will ever have.
    console.error(
      "URGENT: payment received but the letter was NOT dispatched — Stripe will retry",
      {
        jobId,
        eventId: event.id,
        eventTyp: event.type,
        sessionId: session.id,
        paymentIntent: paymentIntentId(session),
        amountTotal: session.amount_total,
        err,
      }
    );
    return NextResponse.json({ fehler: "versand_fehler" }, { status: 500 });
  }
}
