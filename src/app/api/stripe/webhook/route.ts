import { NextResponse } from "next/server";
import { confirmDocs, distribute, getJob } from "@/lib/ebrief/client";
import { DISTRIBUTED_STATUSES } from "@/lib/ebrief/types";
import { PRODUKTE, istProduktId } from "@/lib/ebrief/produkte";
import { stripe, stripeKonfiguriert } from "@/lib/stripe";

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

type Wiederholung = "webhook_retry" | "zweite_zahlung" | "unbekannt";

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
 * step in the whole dispatch flow: POST /jobs/distribution has eBrief print,
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
 *     asking eBrief rather than by remembering. It is a check, not a lock: two
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
 * still processes the documents fails here and succeeds on a later retry.
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

    if (DISTRIBUTED_STATUSES.includes(job.Status)) {
      const art = artDerWiederholung(jobId, session.id);
      const daten = {
        eventId: event.id,
        eventTyp: event.type,
        sessionId: session.id,
        paymentIntent: paymentIntentId(session),
        amountTotal: session.amount_total,
        jobId,
        ebriefStatus: job.Status,
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

    if (job.Status === "USER_CONFIRMATION_REQUESTED") {
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
