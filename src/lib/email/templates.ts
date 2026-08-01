import { absoluteUrl, site, siteConfig } from "@/lib/site";
import {
  erloeschenHinweis,
  musterWiderrufsformular,
  widerrufsbelehrung,
} from "@/lib/widerrufstext";

/**
 * Transactional email, German only — the same reasoning the legal pages use:
 * this confirms a contract governed by German law, and only the German version
 * is the binding one. See the notice LegalPage shows to non-German visitors.
 *
 * Plain single-column HTML with inline styles, plus a text part for every mail:
 * a confirmation that renders as a blank rectangle in a strict client has not
 * been "zur Verfügung gestellt" in any sense that would satisfy § 312f BGB.
 */

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const INK = "#1a1816";
const MUTED = "#6b655c";
/** Border of the subordinate legal block — visible, but never a headline. */
const RULE = "#e7e2da";

/** German currency formatting, from the amount Stripe actually charged. */
export function euroFromCent(cent: number): string {
  return (cent / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function layout(bodyHtml: string, footerHtml: string): string {
  return `<div style="background:#fbfaf8;padding:24px 12px;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px 28px;font-family:Arial,Helvetica,sans-serif;color:${INK};font-size:15px;line-height:1.6;">
    ${bodyHtml}
  </div>
  <div style="max-width:600px;margin:0 auto;padding:20px 28px;font-family:Arial,Helvetica,sans-serif;color:${MUTED};font-size:12px;line-height:1.6;">
    ${footerHtml}
  </div>
</div>`;
}

/**
 * The provider block. Art. 246a EGBGB wants the trader identifiable in the
 * confirmation itself, not only via a link — hence the full postal address
 * rather than a "see our Impressum".
 */
function identityFooterHtml(): string {
  const o = site.operator;
  return `${o.name} — Inhaber: ${o.owner}, ${o.street}, ${o.zip} ${o.city}, ${o.country}<br>
E-Mail: <a href="mailto:${o.email}" style="color:${MUTED};">${o.email}</a> · <a href="${absoluteUrl("/impressum")}" style="color:${MUTED};">Impressum</a> · <a href="${absoluteUrl("/datenschutz")}" style="color:${MUTED};">Datenschutz</a><br>
Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 Abs. 1 Nr. 1 VSBG).<br>
Hinweis: Unsere E-Mails sind keine Rechtsberatung.`;
}

function identityFooterText(): string {
  const o = site.operator;
  return [
    `${o.name} — Inhaber: ${o.owner}, ${o.street}, ${o.zip} ${o.city}, ${o.country}`,
    `E-Mail: ${o.email}`,
    `Impressum: ${absoluteUrl("/impressum")} · Datenschutz: ${absoluteUrl("/datenschutz")}`,
    "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 Abs. 1 Nr. 1 VSBG).",
    "Hinweis: Unsere E-Mails sind keine Rechtsberatung.",
  ].join("\n");
}

/** What the customer bought, in the words the confirmation should use. */
export const PRODUKTBEZEICHNUNG: Record<string, string> = {
  brief: "Postversand Ihrer Mängelanzeige als Brief",
  einwurfEinschreiben:
    "Postversand Ihrer Mängelanzeige als Einwurf-Einschreiben",
};

/**
 * The order date, as the Muster-Widerrufsformular's "Bestellt am" wants it.
 *
 * Pinned to Europe/Berlin: the webhook runs on a UTC host, and a payment made
 * at 00:30 German time would otherwise be confirmed as having been ordered the
 * day before — on the very form the customer copies the date from, and next to
 * a fourteen-day deadline that runs from exactly that day.
 */
function bestelldatum(zeitpunkt: Date): string {
  return zeitpunkt.toLocaleDateString("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Who we are, in one sentence.
 *
 * The customer bought at mietminderung-online.de, the sender is "Mietminderung
 * Online", replies go to a different domain, and the Widerrufsbelehrung names a
 * third thing again. Each one is correct; together, unexplained, they have the
 * exact shape of a phishing mail. Built from `site` rather than written out, so
 * the pending correction of the operator's legal form lands here too.
 */
function anbieterSatz(): string {
  const o = site.operator;
  return `${siteConfig.name} ist ein Angebot der ${o.name}: Wir betreiben ${site.name}, deshalb steht dieser Name auch in der Widerrufsbelehrung unten, und Antworten auf diese E-Mail erreichen uns unter ${o.email}.`;
}

/**
 * What we can actually stand behind about the timing.
 *
 * There used to be a promise here that payment received Mo–Fr before 14:30 was
 * printed and franked the same day. Nothing sourced it, and the first live
 * order refuted it: paid at 21:58, handed to print at 22:00 the same evening.
 * A performance promise to consumers that we cannot support is worse than no
 * promise, so this says only what the dispatch flow guarantees by construction
 * — the webhook releases the job the moment the payment is confirmed — and
 * leaves delivery to the carrier, without naming a day.
 */
const ABLAUF_SAETZE: readonly string[] = [
  "Wir haben Ihre Mängelanzeige unmittelbar nach Ihrer Zahlung zum Druck übergeben. Gedruckt, kuvertiert und frankiert wird sie von unserem Druckdienstleister, die Zustellung übernimmt anschließend die PIN AG.",
  "Auf die Zustelldauer haben wir keinen Einfluss, ein bestimmter Zustelltag wird nicht geschuldet. Sie müssen nichts weiter tun.",
] as const;

/**
 * The order confirmation for the paid postal dispatch.
 *
 * Carries what § 312f Abs. 2 und 3 BGB together with Art. 246a EGBGB require on
 * a durable medium: the service, the total price actually paid, who the trader
 * is, the full Widerrufsbelehrung with the model form, and the confirmation of
 * the § 356 Abs. 4 declaration made at the order.
 *
 * It doubles as the Eingangsbestätigung under § 312i Abs. 1 Nr. 3 BGB, which is
 * why the webhook sends it as soon as the payment is confirmed rather than when
 * the letter is actually posted.
 *
 * Ordered for the reader, not for the statute: what they bought, what happens
 * next, and only then the mandatory notices, gathered into one block that is
 * marked as such and set smaller and muted. Nothing in that block is optional —
 * the first customer read a mail that looked like a withdrawal leaflet with an
 * invoice attached, which is a layout problem and is fixed by weight, not by
 * deletion.
 */
export function bestellbestaetigungEmail(params: {
  /** Catalogue id; falls back to a neutral wording if it is unknown. */
  produktId: string;
  /** What Stripe actually charged, in cents. */
  betragCent: number;
  /**
   * The eBrief job id. Deliberately not the Stripe session id: that is 66
   * characters of `cs_live_…` the customer cannot read back over the phone,
   * and it is not what the operator searches by. The job id is short, it is
   * what eBrief's own interface is keyed on, and the dispatch log ties it back
   * to the session and the payment intent for anything that needs Stripe.
   */
  referenz: string;
  /** When the payment completed — the "Bestellt am" of the model form. */
  bestelltAm: Date;
}): RenderedEmail {
  const leistung =
    PRODUKTBEZEICHNUNG[params.produktId] ?? "Postversand Ihrer Mängelanzeige";
  const betrag = euroFromCent(params.betragCent);
  const datum = bestelldatum(params.bestelltAm);

  const belehrungHtml = widerrufsbelehrung
    .map((p) => `<p style="margin:0 0 10px;">${escapeHtml(p)}</p>`)
    .join("");
  const formularHtml = musterWiderrufsformular
    .map((zeile) => `<p style="margin:0 0 6px;">${escapeHtml(zeile)}</p>`)
    .join("");

  const bodyHtml = `
<h1 style="margin:0 0 16px;font-size:20px;">Ihre Bestellung ist bei uns eingegangen</h1>
<p style="margin:0 0 12px;">vielen Dank. Wir haben Ihre Zahlung erhalten und bestätigen Ihnen hiermit den Vertrag.</p>
<p style="margin:0 0 20px;color:${MUTED};font-size:13px;">${escapeHtml(anbieterSatz())}</p>

<table style="width:100%;border-collapse:collapse;margin:0 0 12px;font-size:15px;">
  <tr><td style="padding:6px 0;color:${MUTED};">Leistung</td><td style="padding:6px 0;text-align:right;">${escapeHtml(leistung)}</td></tr>
  <tr><td style="padding:6px 0;color:${MUTED};">Gesamtpreis</td><td style="padding:6px 0;text-align:right;font-weight:600;">${betrag}</td></tr>
  <tr><td style="padding:6px 0;color:${MUTED};">Auftragsnummer</td><td style="padding:6px 0;text-align:right;font-weight:600;">${escapeHtml(params.referenz)}</td></tr>
  <tr><td style="padding:6px 0;color:${MUTED};">Bestellt am</td><td style="padding:6px 0;text-align:right;">${escapeHtml(datum)}</td></tr>
</table>
<p style="margin:0 0 24px;color:${MUTED};font-size:13px;">Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher nicht ausgewiesen.</p>

<h2 style="margin:0 0 8px;font-size:16px;">Wie es weitergeht</h2>
${ABLAUF_SAETZE.map((s) => `<p style="margin:0 0 12px;">${escapeHtml(s)}</p>`).join("")}
<p style="margin:0 0 4px;">Bei Fragen antworten Sie einfach auf diese E-Mail — bitte nennen Sie dabei die Auftragsnummer ${escapeHtml(params.referenz)}.</p>

<div style="margin:32px 0 0;border-top:1px solid ${RULE};padding-top:20px;color:${MUTED};font-size:12px;line-height:1.55;">
  <h2 style="margin:0 0 8px;font-size:13px;color:${MUTED};">Pflichtangaben zu Ihrem Widerrufsrecht</h2>
  <p style="margin:0 0 14px;">Diese Angaben müssen wir Ihnen zusammen mit der Bestätigung übermitteln (§ 312f BGB) — sie sind Pflichttext, keine Aufforderung an Sie.</p>

  <p style="margin:0 0 6px;font-weight:600;color:${MUTED};">Widerrufsbelehrung</p>
  ${belehrungHtml}
  <p style="margin:0 0 14px;font-weight:600;">${escapeHtml(erloeschenHinweis)}</p>

  <p style="margin:0 0 6px;font-weight:600;color:${MUTED};">Muster-Widerrufsformular</p>
  <p style="margin:0 0 10px;">Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular verwenden — vorgeschrieben ist es nicht. Ihre Bestellung datiert vom ${escapeHtml(datum)}; dieses Datum gehört in das Feld „Bestellt am“.</p>
  <div style="background:#fbfaf8;border-radius:8px;padding:14px;">${formularHtml}</div>

  <p style="margin:14px 0 0;">Ihr Widerrufsrecht auch online: <a href="${absoluteUrl("/widerruf")}" style="color:${MUTED};">${absoluteUrl("/widerruf")}</a></p>
</div>`;

  const text = [
    "Ihre Bestellung ist bei uns eingegangen",
    "",
    "vielen Dank. Wir haben Ihre Zahlung erhalten und bestätigen Ihnen hiermit den Vertrag.",
    "",
    anbieterSatz(),
    "",
    `Leistung: ${leistung}`,
    `Gesamtpreis: ${betrag}`,
    `Auftragsnummer: ${params.referenz}`,
    `Bestellt am: ${datum}`,
    "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher nicht ausgewiesen.",
    "",
    "WIE ES WEITERGEHT",
    ...ABLAUF_SAETZE,
    `Bei Fragen antworten Sie einfach auf diese E-Mail — bitte nennen Sie dabei die Auftragsnummer ${params.referenz}.`,
    "",
    "—————————————————————————————",
    "PFLICHTANGABEN ZU IHREM WIDERRUFSRECHT",
    "Diese Angaben müssen wir Ihnen zusammen mit der Bestätigung übermitteln (§ 312f BGB) — sie sind Pflichttext, keine Aufforderung an Sie.",
    "",
    "Widerrufsbelehrung",
    ...widerrufsbelehrung,
    erloeschenHinweis,
    "",
    "Muster-Widerrufsformular",
    `Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular verwenden — vorgeschrieben ist es nicht. Ihre Bestellung datiert vom ${datum}; dieses Datum gehört in das Feld „Bestellt am“.`,
    ...musterWiderrufsformular,
    "",
    `Ihr Widerrufsrecht auch online: ${absoluteUrl("/widerruf")}`,
    "",
    identityFooterText(),
  ].join("\n");

  return {
    subject: `Ihre Bestellung bei ${site.name} — ${leistung}`,
    html: layout(bodyHtml, identityFooterHtml()),
    text,
  };
}
