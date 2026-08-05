import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { cronAutorisiert } from "@/lib/cronAuth";
import { getJob } from "@/lib/ebrief/client";
import { ebriefKonfiguriert } from "@/lib/ebrief/token";
import { emailConfigured, sendEmail } from "@/lib/email/send";
import { nachfassEmail, sendungsmeldungEmail } from "@/lib/email/templates";
import { HERKUNFT, istFremd } from "@/lib/herkunft";
import { stripe, stripeKonfiguriert } from "@/lib/stripe";
import {
  formatiereEreignisZeitpunkt,
  hatSendungsverfolgung,
  nachfassFaellig,
  sendungsstand,
} from "@/lib/versandNachlauf";

/**
 * The daily follow-up: the delivery notice, and the reminder two weeks on.
 *
 * This route is why the surcharge for the Einwurf-Einschreiben is honest. The
 * interface has always returned a `ShipmentNumber` and a `TrackingUrl`; until
 * this existed, nothing read them, so a tenant paid for traceability and
 * received nothing they could hold on to.
 *
 * **Stripe is the order record.** There is no database, and that is a decision
 * rather than a gap: a table of names, addresses and the fact that these people
 * are in a dispute with their landlord would be a body of personal data to
 * protect for ever. Stripe has the payment anyway, knows the email address
 * anyway, and already carries the job id in the metadata. What is missing is
 * only a note of which mail has gone out — and that fits in the same metadata.
 *
 * So nothing is stored in Stripe that would not be there regardless: an order
 * number and two ticks. The defects, the landlord's address and the letter
 * itself stay out of it.
 *
 * The run is repeatable: every mail is noted only after it has been sent, and a
 * noted mail is never sent again. A second run on the same day does nothing.
 *
 * Explicit nodejs runtime, because cronAutorisiert uses node:crypto — the same
 * reason as the cleanup route next door.
 */

export const runtime = "nodejs";

/** How far back to look. After 30 days every order here is done with. */
const FENSTER_TAGE = 30;

/** Notes in the Stripe metadata. */
const GESENDET = "1";
const FELD_SENDUNG = "sendungsmailGesendet";
const FELD_NACHFASS = "nachfassGesendet";

export async function GET(request: Request) {
  // No secret, no run. This route sends email to customers, and nobody who
  // merely knows the URL may be able to trigger that. A gate that waves
  // everything through when unconfigured is worse than no gate at all — the
  // same reasoning as in the cleanup route.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("CRON_SECRET is not set — the dispatch follow-up refuses to run");
    return NextResponse.json({ fehler: "cron_nicht_konfiguriert" }, { status: 503 });
  }
  if (!cronAutorisiert(request, secret)) {
    console.error("Unauthorised call to the dispatch follow-up cron");
    return NextResponse.json({ fehler: "nicht_autorisiert" }, { status: 401 });
  }

  // A deployment without Stripe, eBrief or Resend is the free download and
  // nothing else. It has no orders to follow up on, and that is not a failure:
  // a 503 here would have the cron report red every night on a healthy
  // deployment.
  if (!stripeKonfiguriert() || !ebriefKonfiguriert() || !emailConfigured()) {
    console.log("Dispatch is not configured — follow-up skipped");
    return NextResponse.json({
      status: "uebersprungen",
      grund: "versand_nicht_konfiguriert",
    });
  }

  const jetzt = new Date();
  const seit = Math.floor((jetzt.getTime() - FENSTER_TAGE * 86_400_000) / 1000);

  let gepruefte = 0;
  let sendungsmails = 0;
  let nachfassmails = 0;
  let unzustellbare = 0;
  let fremde = 0;
  const fehler: string[] = [];

  for await (const sitzung of stripe().checkout.sessions.list({
    created: { gte: seit },
    limit: 100,
  })) {
    if (sitzung.payment_status !== "paid") continue;

    /*
     * Is this order even ours?
     *
     * The Stripe account is shared with widerspruch-krankengeld.de, Stripe
     * cannot filter by metadata, and every eBrief job id resolves in both
     * systems. Unfiltered, this run would tell somebody who appealed against a
     * sickness benefit decision that their Mängelanzeige had been delivered.
     *
     * Written as a REQUIREMENT of our own marker, and deliberately not as the
     * rejection of a foreign one that the webhook uses. The two cases are not
     * alike: there, an unmarked session is a paid letter that would otherwise
     * never be posted, so "unknown" has to pass. Here, an unmarked session
     * costs its owner nothing but a mail they were never promised, while a
     * wrong guess sends a stranger a mail about a letter that is not theirs.
     * Orders from before the marker existed therefore get no follow-up, and
     * they age out of the 30-day window within a month either way.
     */
    if (sitzung.metadata?.herkunft !== HERKUNFT) {
      fremde += 1;
      continue;
    }

    const jobId = leseJobId(sitzung.metadata?.jobId);
    if (jobId === undefined) continue;

    const email = sitzung.customer_details?.email ?? sitzung.customer_email;
    if (!email) continue;

    gepruefte += 1;
    const referenz = String(jobId);
    const bestelltAm = new Date(sitzung.created * 1000);

    // 1. The delivery notice, as soon as eBrief has one.
    //
    // Only for the tracked product: the plain letter is sent with
    // `IsTracking: "false"`, so eBrief reports no shipment number and no
    // delivery event for it. Asking anyway would spend a request per order on a
    // question that can only ever be answered "nothing known".
    if (
      sitzung.metadata?.[FELD_SENDUNG] !== GESENDET &&
      hatSendungsverfolgung(sitzung.metadata?.produktId)
    ) {
      try {
        const job = await getJob(jobId);

        // The second check, on the thing itself rather than on the label we
        // attached to the payment — the same order of trust as in the webhook.
        // If our session points at a job that demonstrably belongs to the
        // sibling service, payment and letter have come apart and no mail may
        // go out about either.
        if (istFremd(job.Attributes?.Reference)) {
          console.error(
            "Follow-up skipped: the eBrief job belongs to another service",
            { jobId, sessionId: sitzung.id, referenz: job.Attributes?.Reference }
          );
          continue;
        }

        const stand = sendungsstand(job);

        if (stand.unzustellbar) {
          // The worst outcome this service has: the landlord never received the
          // letter, so they never learnt of the defect, the deadline never
          // started and the rent reduction has no date to run from.
          //
          // Deliberately no customer mail. Telling somebody their letter came
          // back is only half a message without saying what happens next, and
          // there is no such policy yet — inventing one inside an email would
          // be a contractual statement made by a cron job. The asymmetry
          // settles it: the plain letter produces no event at all, so a mail
          // here would exist for the 6,99 € product and not for the 2,49 € one,
          // where exactly the same thing happens in silence. Until that is
          // decided, this is an operator's job, and this line is how it reaches
          // them.
          unzustellbare += 1;
          console.error(
            "UNDELIVERABLE: eBrief reports the Mängelanzeige as returned — the deadline never started, contact the customer by hand",
            {
              jobId,
              sessionId: sitzung.id,
              empfaenger: email,
              ereignis: stand.letztesEreignis,
              zeitpunkt: stand.ereignisZeitpunkt,
            }
          );
        }

        if (stand.zugestellt) {
          const ergebnis = await sendEmail({
            to: email,
            email: sendungsmeldungEmail({
              referenz,
              stand: {
                shipmentNumber: stand.shipmentNumber,
                trackingUrl: stand.trackingUrl,
                ereignisZeitpunkt: formatiereEreignisZeitpunkt(stand.ereignisZeitpunkt),
              },
            }),
          });
          // Noted only once the mail has been accepted. Otherwise the run tries
          // again tomorrow — a mail one day late is better than one that never
          // comes, which is the failure this whole route exists to fix.
          if (ergebnis.ok) {
            await vermerke(sitzung, FELD_SENDUNG);
            sendungsmails += 1;
            console.log("Delivery notice sent", {
              jobId,
              messageId: ergebnis.id ?? null,
            });
          } else {
            fehler.push(`sendungsmeldung ${jobId}: Resend hat die Nachricht abgelehnt`);
          }
        }
      } catch (err) {
        // One order must not abort the run: everybody behind it would go
        // without their mail.
        fehler.push(`sendungsmeldung ${jobId}: ${fehlertext(err)}`);
        console.error("Delivery notice failed", { jobId, err });
      }
    }

    // 2. The reminder, independent of the delivery state and of the product:
    // it is about the defect, not about the postage.
    if (
      sitzung.metadata?.[FELD_NACHFASS] !== GESENDET &&
      nachfassFaellig(bestelltAm, jetzt)
    ) {
      try {
        const ergebnis = await sendEmail({ to: email, email: nachfassEmail({ referenz }) });
        if (ergebnis.ok) {
          await vermerke(sitzung, FELD_NACHFASS);
          nachfassmails += 1;
        } else {
          fehler.push(`nachfassen ${jobId}: Resend hat die Nachricht abgelehnt`);
        }
      } catch (err) {
        fehler.push(`nachfassen ${jobId}: ${fehlertext(err)}`);
        console.error("Reminder failed", { jobId, err });
      }
    }
  }

  const zusammenfassung = {
    status: "ok" as const,
    gepruefte,
    sendungsmails,
    nachfassmails,
    unzustellbare,
    /** Paid sessions belonging to the sibling service, or predating the marker. */
    fremde,
    fehler,
  };

  console.log("Dispatch follow-up finished", zusammenfassung);
  return NextResponse.json(zusammenfassung);
}

/**
 * Metadata values are free-form strings set by whoever created the session, so
 * the id is parsed rather than trusted — the same reading the webhook uses.
 */
function leseJobId(wert: string | undefined): number | undefined {
  if (typeof wert !== "string") return undefined;
  const roh = wert.trim();
  if (!/^\d+$/.test(roh)) return undefined;
  const zahl = Number(roh);
  return Number.isSafeInteger(zahl) && zahl > 0 ? zahl : undefined;
}

/**
 * Ticks one box in the session metadata without losing the others.
 *
 * A failure here is louder than it looks: the mail has gone out, so a tick that
 * does not stick means the same mail again tomorrow, and every day until the
 * order leaves the 30-day window. That is why it is logged as an error rather
 * than folded into the per-order error list alone.
 */
async function vermerke(
  sitzung: Stripe.Checkout.Session,
  feld: string
): Promise<void> {
  try {
    await stripe().checkout.sessions.update(sitzung.id, {
      metadata: { ...(sitzung.metadata ?? {}), [feld]: GESENDET },
    });
  } catch (err) {
    console.error(
      "URGENT: the follow-up mail was sent but could not be noted in Stripe — it will be sent again tomorrow",
      { sessionId: sitzung.id, feld, err }
    );
    throw err;
  }
  // Kept in step locally, so the second tick in the same run does not overwrite
  // the first.
  sitzung.metadata = { ...(sitzung.metadata ?? {}), [feld]: GESENDET };
}

function fehlertext(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
