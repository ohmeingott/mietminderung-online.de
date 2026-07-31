import { absoluteUrl, site } from "@/lib/site";
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

const BRAND = "#1e40af";
const INK = "#1a1816";
const MUTED = "#6b655c";

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
 * The order confirmation for the paid postal dispatch.
 *
 * Carries what § 312f Abs. 2 und 3 BGB together with Art. 246a EGBGB require on
 * a durable medium: the service, the total price actually paid, who the trader
 * is, when the letter goes out, the full Widerrufsbelehrung with the model
 * form, and the confirmation of the § 356 Abs. 4 declaration made at the order.
 *
 * It doubles as the Eingangsbestätigung under § 312i Abs. 1 Nr. 3 BGB, which is
 * why the webhook sends it as soon as the payment is confirmed rather than when
 * the letter is actually posted.
 */
export function bestellbestaetigungEmail(params: {
  /** Catalogue id; falls back to a neutral wording if it is unknown. */
  produktId: string;
  /** What Stripe actually charged, in cents. */
  betragCent: number;
  /** Stripe's session id — the reference a support request can be found by. */
  referenz: string;
}): RenderedEmail {
  const leistung =
    PRODUKTBEZEICHNUNG[params.produktId] ?? "Postversand Ihrer Mängelanzeige";
  const betrag = euroFromCent(params.betragCent);

  const belehrungHtml = widerrufsbelehrung
    .map((p) => `<p style="margin:0 0 12px;">${escapeHtml(p)}</p>`)
    .join("");
  const formularHtml = musterWiderrufsformular
    .map((zeile) => `<p style="margin:0 0 8px;">${escapeHtml(zeile)}</p>`)
    .join("");

  const bodyHtml = `
<h1 style="margin:0 0 16px;font-size:20px;">Ihre Bestellung ist bei uns eingegangen</h1>
<p style="margin:0 0 16px;">vielen Dank. Wir haben Ihre Zahlung erhalten und bestätigen Ihnen hiermit den Vertrag.</p>

<table style="width:100%;border-collapse:collapse;margin:0 0 20px;font-size:15px;">
  <tr><td style="padding:6px 0;color:${MUTED};">Leistung</td><td style="padding:6px 0;text-align:right;">${escapeHtml(leistung)}</td></tr>
  <tr><td style="padding:6px 0;color:${MUTED};">Gesamtpreis</td><td style="padding:6px 0;text-align:right;font-weight:600;">${betrag}</td></tr>
  <tr><td style="padding:6px 0;color:${MUTED};">Referenz</td><td style="padding:6px 0;text-align:right;">${escapeHtml(params.referenz)}</td></tr>
</table>
<p style="margin:0 0 20px;color:${MUTED};font-size:13px;">Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher nicht ausgewiesen.</p>

<h2 style="margin:24px 0 8px;font-size:16px;">Wie es weitergeht</h2>
<p style="margin:0 0 16px;">Ihre Mängelanzeige geht jetzt in den Druck. Sendungen, deren Zahlung montags bis freitags bis 14:30 Uhr eingeht, werden in der Regel noch am selben Tag gedruckt und frankiert, andernfalls am folgenden Werktag. Die Zustellung übernimmt anschließend die PIN AG.</p>

<h2 style="margin:24px 0 8px;font-size:16px;">Widerrufsbelehrung</h2>
${belehrungHtml}
<p style="margin:0 0 12px;"><strong>${escapeHtml(erloeschenHinweis)}</strong></p>

<h2 style="margin:24px 0 8px;font-size:16px;">Muster-Widerrufsformular</h2>
<p style="margin:0 0 12px;">Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular verwenden — vorgeschrieben ist es nicht.</p>
<div style="background:#fbfaf8;border-radius:8px;padding:16px;font-size:14px;">${formularHtml}</div>

<p style="margin:24px 0 0;">Bei Fragen antworten Sie einfach auf diese E-Mail.</p>
<p style="margin:16px 0 0;">${button(absoluteUrl("/widerruf"), "Widerrufsrecht online ansehen")}</p>`;

  const text = [
    "Ihre Bestellung ist bei uns eingegangen",
    "",
    "vielen Dank. Wir haben Ihre Zahlung erhalten und bestätigen Ihnen hiermit den Vertrag.",
    "",
    `Leistung: ${leistung}`,
    `Gesamtpreis: ${betrag}`,
    `Referenz: ${params.referenz}`,
    "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher nicht ausgewiesen.",
    "",
    "WIE ES WEITERGEHT",
    "Ihre Mängelanzeige geht jetzt in den Druck. Sendungen, deren Zahlung montags bis freitags bis 14:30 Uhr eingeht, werden in der Regel noch am selben Tag gedruckt und frankiert, andernfalls am folgenden Werktag. Die Zustellung übernimmt anschließend die PIN AG.",
    "",
    "WIDERRUFSBELEHRUNG",
    ...widerrufsbelehrung,
    erloeschenHinweis,
    "",
    "MUSTER-WIDERRUFSFORMULAR",
    "Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular verwenden — vorgeschrieben ist es nicht.",
    ...musterWiderrufsformular,
    "",
    `Widerrufsrecht online: ${absoluteUrl("/widerruf")}`,
    "Bei Fragen antworten Sie einfach auf diese E-Mail.",
    "",
    identityFooterText(),
  ].join("\n");

  return {
    subject: `Ihre Bestellung bei ${site.name} — ${leistung}`,
    html: layout(bodyHtml, identityFooterHtml()),
    text,
  };
}

function button(href: string, label: string, color = BRAND): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:999px;margin:4px 0;">${label}</a>`;
}
