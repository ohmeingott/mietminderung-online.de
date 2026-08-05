import { PRODUKTE, istProduktId } from "@/lib/ebrief/produkte";
import type { EbriefJobDetails } from "@/lib/ebrief/types";

/**
 * What is read out of the eBrief response after the letter has gone out.
 *
 * Deliberately no "Einlieferungsbeleg": there is none. The interface returns a
 * shipment number, a tracking link and events with a timestamp — the only
 * document it offers (`FileWithMark`) is a PNG of the letter with the address
 * marked, an artefact for us to check against and not evidence for the tenant.
 *
 * The distinction is not cosmetic. "Beleg" sounds like something one keeps and
 * produces; exactly that combination of Einlieferungsbeleg and shipment status
 * is what the Bundesarbeitsgericht held insufficient in 2 AZR 68/24. What we
 * can actually deliver is therefore what it is called.
 */
export interface Sendungsstand {
  shipmentNumber: string | null;
  trackingUrl: string | null;
  /** The last event eBrief reported, e.g. `DOCUMENT_DELIVERED`. */
  letztesEreignis: string | null;
  /** Its timestamp, exactly as eBrief sends it. */
  ereignisZeitpunkt: string | null;
  /** True once eBrief has reported the delivery. */
  zugestellt: boolean;
  /** True once eBrief has reported the letter as undeliverable. */
  unzustellbar: boolean;
}

/**
 * The events that mean a delivery.
 *
 * Listed positively, for the same reason as the job statuses in
 * src/lib/ebrief/types.ts: an unknown event must not pass for a delivery. The
 * mail this decides is one a tenant may lean on when the landlord disputes
 * having heard of the defect, so a delivery claimed but not made is far worse
 * than a mail that arrives a day later.
 */
const ZUGESTELLT_EREIGNISSE = ["DOCUMENT_DELIVERED"] as const;

/**
 * The events that mean the letter came back.
 *
 * Nobody is emailed about this — see the cron route for why — but the run has
 * to be able to tell the case apart in order to log it: an undeliverable letter
 * means the landlord never learnt of the defect, so the deadline never started
 * and the rent reduction has no date to run from. That is the one outcome where
 * the tenant is worse off than if they had never bought anything.
 */
const UNZUSTELLBAR_EREIGNISSE = ["DOCUMENT_SENT_BACK"] as const;

export function sendungsstand(job: EbriefJobDetails): Sendungsstand {
  // One job carries exactly one document here — a Mängelanzeige is a letter.
  // Still, take the first one WITH a shipment number rather than blindly
  // `Documents[0]`: an empty entry would otherwise produce an empty state.
  const dokumente = job.Documents ?? [];
  const dokument =
    dokumente.find((d) => d.ShipmentNumber?.trim()) ?? dokumente[0] ?? null;

  const letztesEreignis = dokument?.LastEvent?.trim() || null;

  return {
    shipmentNumber: dokument?.ShipmentNumber?.trim() || null,
    trackingUrl: dokument?.TrackingUrl?.trim() || null,
    letztesEreignis,
    ereignisZeitpunkt: dokument?.TimestampLastEvent?.trim() || null,
    zugestellt: ZUGESTELLT_EREIGNISSE.some((e) => e === letztesEreignis),
    unzustellbar: UNZUSTELLBAR_EREIGNISSE.some((e) => e === letztesEreignis),
  };
}

/**
 * Whether this product produces anything to report at all.
 *
 * Only `einwurfEinschreiben` is sent with `IsTracking: "true"`, and eBrief's own
 * documentation limits both `DOCUMENT_DELIVERED` and `DOCUMENT_SENT_BACK` to
 * trackable shipments. For the plain letter there is no shipment number, no
 * link and no delivery event — asking eBrief about it every night would cost a
 * request per order and could only ever answer "nothing known".
 *
 * Reads the catalogue rather than a second list of ids, so a product that gains
 * or loses tracking is handled by the change to the catalogue alone.
 */
export function hatSendungsverfolgung(produktId: string | undefined): boolean {
  return istProduktId(produktId) && PRODUKTE[produktId].ebrief.IsTracking === "true";
}

/**
 * Whether the raw timestamp names its own time zone.
 *
 * `TimestampLastEvent` is an unconstrained string in the specification. The
 * staging capture shows an offset (`…+02:00`), but "shows" is not "guarantees",
 * and without one JavaScript reads the value as the server's local time — UTC
 * on Vercel. A delivery at 09:14 German time would then be reported as having
 * happened at 09:14 in a mail whose whole subject is when something happened.
 */
function tragtZeitzone(roh: string): boolean {
  return /([zZ]|[+-]\d{2}:?\d{2})$/.test(roh);
}

/**
 * The event timestamp as a German reader expects it, or the raw value.
 *
 * Falls back to the raw string rather than dropping the line or guessing: an
 * unlovely `2026-08-06T09:14:00` is still true, while a converted hour that was
 * never in the data is not.
 */
export function formatiereEreignisZeitpunkt(roh: string | null): string | null {
  if (!roh) return null;
  if (!tragtZeitzone(roh)) return roh;

  const zeitpunkt = new Date(roh);
  if (Number.isNaN(zeitpunkt.getTime())) return roh;

  const datum = zeitpunkt.toLocaleDateString("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const uhrzeit = zeitpunkt.toLocaleTimeString("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datum} um ${uhrzeit} Uhr`;
}

/**
 * When the reminder goes out.
 *
 * Fourteen days, because that is the deadline the letter itself sets by
 * default: FRIST_STANDARD in src/lib/brief/frist.ts is fourteen days and the
 * options offered are 3, 7, 14 and 21. A reminder at fourteen days lands at the
 * end of the ordinary deadline — late enough that "has the landlord done
 * anything?" is a real question, early enough that the tenant can still act on
 * the answer.
 *
 * A shorter deadline the tenant chose is not known here. There is no database,
 * and the deadline lives in the letter, not in the payment; putting it into the
 * Stripe metadata would mean taking a date from the browser and mailing on it.
 * The reminder is therefore written so that it works whether the deadline has
 * just expired or expired a week ago.
 */
export const NACHFASS_TAGE = 14;

/** True once at least `NACHFASS_TAGE` have passed since the order. */
export function nachfassFaellig(bestelltAm: Date, jetzt: Date): boolean {
  const vergangen = (jetzt.getTime() - bestelltAm.getTime()) / 86_400_000;
  return vergangen >= NACHFASS_TAGE;
}
