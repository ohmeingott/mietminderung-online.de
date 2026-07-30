import { absoluteUrl, site } from "@/lib/site";

/**
 * The three case emails, German only (like the letter itself: the binding
 * language of the service is German). Plain single-column HTML with inline
 * styles plus a text part for every mail.
 *
 * Legal constraints baked in:
 *  - The double-opt-in confirmation mail is strictly advertising-free
 *    (BGH I ZR 164/09; OLG München 29 U 1682/12).
 *  - Every mail identifies the operator (address block) and carries the
 *    withdrawal/deletion link.
 */

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export function formatDateDe(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
}

const BRAND = "#1e40af";
const INK = "#1a1816";
const MUTED = "#6b655c";

function button(href: string, label: string, color = BRAND): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:999px;margin:4px 0;">${label}</a>`;
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

function identityFooterHtml(): string {
  const o = site.operator;
  return `${site.name} — Inhaber: ${o.name}, ${o.street}, ${o.zip} ${o.city}, ${o.country}<br>
E-Mail: <a href="mailto:${o.email}" style="color:${MUTED};">${o.email}</a> · <a href="${absoluteUrl("/impressum")}" style="color:${MUTED};">Impressum</a> · <a href="${absoluteUrl("/datenschutz")}" style="color:${MUTED};">Datenschutz</a><br>
Hinweis: Unsere E-Mails sind keine Rechtsberatung.`;
}

function identityFooterText(): string {
  const o = site.operator;
  return [
    `${site.name} — Inhaber: ${o.name}, ${o.street}, ${o.zip} ${o.city}, ${o.country}`,
    `E-Mail: ${o.email}`,
    `Impressum: ${absoluteUrl("/impressum")} · Datenschutz: ${absoluteUrl("/datenschutz")}`,
    "Hinweis: Unsere E-Mails sind keine Rechtsberatung.",
  ].join("\n");
}

function reminderFooter(optinDate: string, manageUrl: string): {
  html: string;
  text: string;
} {
  const why = `Warum erhalte ich diese E-Mail? Sie haben am ${optinDate} auf ${site.name} Erinnerungen zu Ihrer Mängelanzeige angefordert und Ihre E-Mail-Adresse bestätigt.`;
  const stop = `Keine weiteren E-Mails erhalten und Fall löschen:`;
  return {
    html: `<strong>${why}</strong><br><br>${stop} <a href="${manageUrl}" style="color:${MUTED};">${manageUrl}</a><br><br>${identityFooterHtml()}`,
    text: `${why}\n${stop} ${manageUrl}\n\n${identityFooterText()}`,
  };
}

// ---------------------------------------------------------------- 1: double opt-in

export function confirmEmail(params: {
  requestDate: string; // ISO
  confirmUrl: string;
}): RenderedEmail {
  const datum = formatDateDe(params.requestDate);
  const subject = "Bitte bestätigen Sie Ihre E-Mail-Adresse";

  const body = `
<p>Guten Tag,</p>
<p>Sie haben am ${datum} auf ${site.name} darum gebeten, Erinnerungs-E-Mails zu einer Mängelanzeige zu erhalten. Dafür benötigen wir Ihre Bestätigung.</p>
<p style="text-align:center;margin:28px 0;">${button(params.confirmUrl, "E-Mail-Adresse bestätigen")}</p>
<p>Falls der Button nicht funktioniert, öffnen Sie bitte diesen Link:<br>
<a href="${params.confirmUrl}" style="color:${BRAND};word-break:break-all;">${params.confirmUrl}</a></p>
<p>Der Link ist 7 Tage gültig. Erst nach Ihrer Bestätigung speichern wir Ihren Fall dauerhaft und senden Erinnerungen.</p>
<p>Sie haben diese Anfrage nicht gestellt? Dann ignorieren Sie diese E-Mail einfach — die Daten der Anfrage werden automatisch gelöscht und Sie erhalten keine weiteren Nachrichten.</p>
<p>Mit freundlichen Grüßen<br>${site.name}</p>`;

  const text = [
    "Guten Tag,",
    "",
    `Sie haben am ${datum} auf ${site.name} darum gebeten, Erinnerungs-E-Mails zu einer Mängelanzeige zu erhalten. Dafür benötigen wir Ihre Bestätigung.`,
    "",
    `E-Mail-Adresse bestätigen: ${params.confirmUrl}`,
    "",
    "Der Link ist 7 Tage gültig. Erst nach Ihrer Bestätigung speichern wir Ihren Fall dauerhaft und senden Erinnerungen.",
    "",
    "Sie haben diese Anfrage nicht gestellt? Dann ignorieren Sie diese E-Mail einfach — die Daten der Anfrage werden automatisch gelöscht und Sie erhalten keine weiteren Nachrichten.",
    "",
    `Mit freundlichen Grüßen\n${site.name}`,
    "",
    "--",
    identityFooterText(),
  ].join("\n");

  return {
    subject,
    html: layout(body, identityFooterHtml()),
    text,
  };
}

// ---------------------------------------------------------------- 2: status query

export function reminderEmail(params: {
  tenantName: string;
  createdDate: string; // ISO
  deadlineDate: string; // ISO
  optinDate: string; // ISO
  mangelLabels: string[];
  quotaTypical: number;
  statusUrl: string;
  manageUrl: string;
}): RenderedEmail {
  const frist = formatDateDe(params.deadlineDate);
  const erstellt = formatDateDe(params.createdDate);
  const subject = "Hat Ihr Vermieter reagiert?";
  const liste = params.mangelLabels.join(", ");
  const footer = reminderFooter(formatDateDe(params.optinDate), params.manageUrl);

  const body = `
<p>Guten Tag ${params.tenantName},</p>
<p>am ${erstellt} haben Sie mit ${site.name} eine Mängelanzeige erstellt. Die darin gesetzte Frist ist am ${frist} abgelaufen — Zeit für einen kurzen Blick auf den Stand.</p>
<div style="background:#f0f5ff;border:1px solid #d6e2ff;border-radius:8px;padding:16px;margin:20px 0;">
  <strong>Ihr Fall im Überblick</strong><br>
  Mängel: ${liste}<br>
  Minderungsquote (Orientierung): ca. ${params.quotaTypical} %<br>
  Frist an den Vermieter: ${frist}
</div>
<p>Wie ist der Stand? Ein Klick genügt — Sie müssen nichts weiter ausfüllen:</p>
<p style="text-align:center;margin:24px 0;">
  ${button(`${params.statusUrl}&a=behoben`, "Mängel behoben", "#0f6b4f")}<br>
  ${button(`${params.statusUrl}&a=teilweise`, "Teilweise behoben")}<br>
  ${button(`${params.statusUrl}&a=keine`, "Keine Reaktion")}
</p>
<p>Je nach Antwort zeigen wir Ihnen direkt, was jetzt sinnvoll ist — von „zu viel gezahlte Miete zurückfordern“ bis „nächste Schritte, wenn nichts passiert“.</p>
<p style="color:${MUTED};font-size:13px;">Hinweis: Die Minderungsquote basiert auf typischen Gerichtsurteilen und dient als Orientierung.</p>
<p>Mit freundlichen Grüßen<br>Ihr Team von ${site.name}</p>`;

  const text = [
    `Guten Tag ${params.tenantName},`,
    "",
    `am ${erstellt} haben Sie mit ${site.name} eine Mängelanzeige erstellt. Die darin gesetzte Frist ist am ${frist} abgelaufen — Zeit für einen kurzen Blick auf den Stand.`,
    "",
    "Ihr Fall im Überblick",
    `Mängel: ${liste}`,
    `Minderungsquote (Orientierung): ca. ${params.quotaTypical} %`,
    `Frist an den Vermieter: ${frist}`,
    "",
    "Wie ist der Stand? Ein Klick genügt:",
    `Mängel behoben:    ${params.statusUrl}&a=behoben`,
    `Teilweise behoben: ${params.statusUrl}&a=teilweise`,
    `Keine Reaktion:    ${params.statusUrl}&a=keine`,
    "",
    "Hinweis: Die Minderungsquote basiert auf typischen Gerichtsurteilen und dient als Orientierung.",
    "",
    `Mit freundlichen Grüßen\nIhr Team von ${site.name}`,
    "",
    "--",
    footer.text,
  ].join("\n");

  return { subject, html: layout(body, footer.html), text };
}

// ---------------------------------------------------------------- 3: lawyer offer

export function lawyerOfferEmail(params: {
  tenantName: string;
  createdDate: string; // ISO
  optinDate: string; // ISO
  anwaltUrl: string;
  manageUrl: string;
}): RenderedEmail {
  const erstellt = formatDateDe(params.createdDate);
  const subject = "Keine Reaktion vom Vermieter? Das können Sie jetzt tun";
  const footer = reminderFooter(formatDateDe(params.optinDate), params.manageUrl);

  const body = `
<p>Guten Tag ${params.tenantName},</p>
<p>auf Ihre Mängelanzeige vom ${erstellt} hat Ihr Vermieter offenbar nicht reagiert. Das ist ärgerlich — aber Sie sind nicht machtlos.</p>
<p><strong>Was jetzt möglich ist:</strong></p>
<ul>
  <li>Miete weiterhin unter Vorbehalt zahlen und die Mängel dokumentieren (Fotos, Datum, Zeugen)</li>
  <li>Eine Nachfrist setzen und weitere Schritte ankündigen</li>
  <li>Den Fall rechtlich prüfen lassen</li>
</ul>
<p>Wenn Sie möchten, kann ein Anwalt für Mietrecht Ihren Fall <strong>kostenlos und unverbindlich</strong> einschätzen: Lohnt sich das weitere Vorgehen? Wie hoch kann die Minderung sein? Was ist der nächste sinnvolle Schritt?</p>
<p style="text-align:center;margin:24px 0;">${button(params.anwaltUrl, "Kostenlose Ersteinschätzung ansehen")}</p>
<p>Wichtig: Mit dem Klick beauftragen Sie nichts und geben keine Daten weiter. Sie sehen zuerst, wie die Ersteinschätzung abläuft und welche Angaben übermittelt würden — und entscheiden dann in Ruhe, ob Sie zustimmen.</p>
<p>Wenn Sie keine Unterstützung wünschen, ist das völlig in Ordnung — dies ist die letzte Erinnerung zu Ihrem Fall.</p>
<p>Mit freundlichen Grüßen<br>Ihr Team von ${site.name}</p>`;

  const text = [
    `Guten Tag ${params.tenantName},`,
    "",
    `auf Ihre Mängelanzeige vom ${erstellt} hat Ihr Vermieter offenbar nicht reagiert. Das ist ärgerlich — aber Sie sind nicht machtlos.`,
    "",
    "Was jetzt möglich ist:",
    "- Miete weiterhin unter Vorbehalt zahlen und die Mängel dokumentieren (Fotos, Datum, Zeugen)",
    "- Eine Nachfrist setzen und weitere Schritte ankündigen",
    "- Den Fall rechtlich prüfen lassen",
    "",
    "Wenn Sie möchten, kann ein Anwalt für Mietrecht Ihren Fall kostenlos und unverbindlich einschätzen.",
    `Kostenlose Ersteinschätzung ansehen: ${params.anwaltUrl}`,
    "",
    "Wichtig: Mit dem Klick beauftragen Sie nichts und geben keine Daten weiter. Sie entscheiden erst auf der verlinkten Seite, ob Sie zustimmen.",
    "",
    "Wenn Sie keine Unterstützung wünschen, ist das völlig in Ordnung — dies ist die letzte Erinnerung zu Ihrem Fall.",
    "",
    `Mit freundlichen Grüßen\nIhr Team von ${site.name}`,
    "",
    "--",
    footer.text,
  ].join("\n");

  return { subject, html: layout(body, footer.html), text };
}
