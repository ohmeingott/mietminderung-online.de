import { NextResponse } from "next/server";
import { formatiereZeitpunkt } from "@/lib/datum";
import { emailConfigured, sendEmail } from "@/lib/email/send";
import {
  widerrufBestaetigungEmail,
  widerrufMeldungEmail,
  type Widerrufsangaben,
} from "@/lib/email/templates";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { site } from "@/lib/site";

/**
 * Receives a withdrawal declaration under § 356a BGB.
 *
 * Deliberately undemanding in what it checks: a withdrawal is a unilateral
 * declaration that takes effect on receipt. Letting it fail on a missing order
 * number would be legally wrong and practically shabby — what matters is that
 * the declaration reaches us. An email address is therefore enough; everything
 * else helps with matching it to an order but is not a precondition.
 *
 * Everything returned to the client is a slug, never prose. This route is only
 * reached from the German withdrawal page, but the convention holds across the
 * codebase and the page renders the wording itself.
 */

export const runtime = "nodejs";

const STUNDE_MS = 60 * 60 * 1000;
/** Generous: a person retrying a failed submission must not be locked out. */
const LIMIT_PRO_STUNDE = 10;

/** Trimmed and capped — a free-text field is not a place to accept a novel. */
function feld(wert: unknown): string {
  return typeof wert === "string" ? wert.trim().slice(0, 500) : "";
}

export async function POST(request: Request) {
  // Without a mail provider there is no way to record the receipt and no way
  // to confirm it. Saying so is the only honest answer — the page then points
  // the user at the email address, which is an equally effective declaration.
  if (!emailConfigured()) {
    return NextResponse.json(
      { fehler: "widerruf_nicht_konfiguriert" },
      { status: 503 }
    );
  }

  if (!rateLimit(`widerruf:${clientIp(request)}`, LIMIT_PRO_STUNDE, STUNDE_MS)) {
    return NextResponse.json({ fehler: "zu_viele_anfragen" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ fehler: "unvollstaendig" }, { status: 400 });
  }

  const email = feld(body?.email);
  if (!email.includes("@")) {
    return NextResponse.json({ fehler: "email_fehlt" }, { status: 400 });
  }

  const angaben: Widerrufsangaben = {
    email,
    name: feld(body?.name),
    auftragsnummer: feld(body?.auftragsnummer),
    anmerkung: feld(body?.anmerkung),
    // § 356a Abs. 4 BGB requires the date AND the time of receipt — in German
    // local time, not the server's. See src/lib/datum.ts.
    eingegangenAm: formatiereZeitpunkt(new Date()),
  };

  // To the operator first. This mail is the record that the withdrawal
  // arrived; it has to go out even if the customer's confirmation fails.
  const gemeldet = await sendEmail({
    to: site.operator.email,
    email: widerrufMeldungEmail(angaben),
  });

  if (!gemeldet.ok) {
    // Without it there is no proof the withdrawal reached us. The user has to
    // learn that and be able to choose another channel.
    console.error("[widerruf] notifying the operator failed");
    return NextResponse.json({ fehler: "zustellung" }, { status: 502 });
  }

  // The confirmation to the person who withdrew. If it fails the withdrawal
  // has still been validly received, so this is not an error to the outside —
  // the operator has the declaration either way and can follow up by hand.
  const bestaetigt = await sendEmail({
    to: email,
    email: widerrufBestaetigungEmail(angaben),
  });
  if (!bestaetigt.ok) {
    console.error("[widerruf] confirming to the consumer failed");
  }

  return NextResponse.json({ empfangen: true });
}
