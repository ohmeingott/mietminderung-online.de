/**
 * Guards the contents of the order confirmation email.
 *
 * Playwright cannot reach this mail — it is rendered in a webhook and never in
 * a browser — so the one thing standing between an edit and a confirmation
 * that no longer satisfies § 312f BGB is this script. It runs in `npm run
 * verify` next to check:i18n.
 *
 * Asserted is the presence of what the statute names, not the wording: the
 * service, the price actually charged, the trader's identity and postal
 * address, the order date, the full Widerrufsbelehrung, the model form, and the
 * confirmation of the § 356 Abs. 4 declaration. Both parts are checked — a mail
 * whose text/plain alternative is empty is what a strict client shows.
 *
 * Since the first live order it also guards three things that are not about
 * completeness but about what the mail must NOT do: promise a print cut-off
 * nothing supports, show the customer a Stripe session id as their reference,
 * and leave the legal block sitting on top of what the customer actually
 * bought. All three were real, all three are cheap to reintroduce, and none of
 * them would fail any other check in this repository.
 */
import {
  bestellbestaetigungEmail,
  euroFromCent,
} from "../src/lib/email/templates";
import {
  UMSATZSTEUERSATZ,
  steuermodus,
  umsatzsteuerAusBrutto,
} from "../src/lib/steuer";
import {
  erloeschenHinweis,
  musterWiderrufsformular,
  widerrufsbelehrung,
} from "../src/lib/widerrufstext";
import { site, siteConfig } from "../src/lib/site";

/** A payment late on a German summer evening — 21:58 CEST is 19:58 UTC. */
const BESTELLT_AM = new Date("2026-07-31T19:58:00Z");

const mail = bestellbestaetigungEmail({
  produktId: "einwurfEinschreiben",
  betragCent: 699,
  referenz: "40123",
  bestelltAm: BESTELLT_AM,
});

const fehler: string[] = [];

function beideTeile(bezeichnung: string, erwartet: string): void {
  if (!mail.html.includes(erwartet)) {
    fehler.push(`HTML-Teil enthält ${bezeichnung} nicht: "${erwartet.slice(0, 60)}…"`);
  }
  if (!mail.text.includes(erwartet)) {
    fehler.push(`Text-Teil enthält ${bezeichnung} nicht: "${erwartet.slice(0, 60)}…"`);
  }
}

/**
 * Both parts must put `frueher` before `spaeter`, and must contain both.
 *
 * Case-insensitive on purpose: the text part shouts its headings in capitals
 * where the HTML part uses an <h2>, and the point being guarded is the order of
 * the sections, not their typography.
 */
function reihenfolge(frueher: string, spaeter: string): void {
  for (const [teil, inhalt] of [
    ["HTML-Teil", mail.html.toLowerCase()],
    ["Text-Teil", mail.text.toLowerCase()],
  ] as const) {
    const a = inhalt.indexOf(frueher.toLowerCase());
    const b = inhalt.indexOf(spaeter.toLowerCase());
    if (a === -1 || b === -1) {
      fehler.push(`${teil}: "${frueher}" oder "${spaeter}" fehlt ganz`);
    } else if (a > b) {
      fehler.push(`${teil}: "${frueher}" steht hinter "${spaeter}"`);
    }
  }
}

/** Like `beideTeile`, but blind to the text part's capitalised headings. */
function beideTeileEgalGross(bezeichnung: string, erwartet: string): void {
  const gesucht = erwartet.toLowerCase();
  if (!mail.html.toLowerCase().includes(gesucht)) {
    fehler.push(`HTML-Teil enthält ${bezeichnung} nicht: "${erwartet}"`);
  }
  if (!mail.text.toLowerCase().includes(gesucht)) {
    fehler.push(`Text-Teil enthält ${bezeichnung} nicht: "${erwartet}"`);
  }
}

// Art. 246a § 1 Abs. 1 Nr. 1, 4 EGBGB — service and total price.
beideTeile("die Leistungsbeschreibung", "Einwurf-Einschreiben");
beideTeile("den gezahlten Gesamtpreis", "6,99");

// The tax statement, in whichever mode STEUERMODUS puts us. Under § 19 UStG a
// missing note would leave the price looking like a net amount and an "inkl.
// MwSt." would be owed under § 14c; under standard taxation § 14 Abs. 4 Nr. 8
// UStG wants the rate and the tax amount, and the § 19 claim becomes false.
if (steuermodus() === "kleinunternehmer") {
  beideTeile("den § 19-Hinweis", "§ 19 UStG");
  if (/mwst/i.test(mail.text) || /inkl\.\s*\d+\s*%/i.test(mail.text)) {
    fehler.push("Text-Teil weist Umsatzsteuer aus, obwohl § 19 UStG gilt");
  }
} else {
  const { nettoCent, steuerCent } = umsatzsteuerAusBrutto(699);
  beideTeile("den Steuersatz", `Umsatzsteuer ${UMSATZSTEUERSATZ} %`);
  beideTeile("den Steuerbetrag", euroFromCent(steuerCent));
  beideTeile("das Entgelt", euroFromCent(nettoCent));
  if (mail.text.includes("§ 19 UStG")) {
    fehler.push("Text-Teil beruft sich auf § 19 UStG, obwohl regelbesteuert wird");
  }
}

// Art. 246a § 1 Abs. 1 Nr. 2 — who the trader is, in the mail itself.
beideTeile("den Anbieternamen", site.operator.name);
// A GbR is only identified once its representatives are named, so all three
// partners have to survive edits to the footer, not just the first one.
for (const partner of site.operator.partners) {
  beideTeile("einen vertretungsberechtigten Gesellschafter", partner);
}
beideTeile("die Anschrift", site.operator.street);
beideTeile("die Kontaktadresse", site.operator.email);

// Who the trader is in relation to the shop. The sender name, the domain, the
// reply-to and the withdrawal address are four different strings; unexplained,
// that is the shape of a phishing mail rather than of a confirmation.
beideTeile("den Anbieterbezug (Marke)", siteConfig.name);
beideTeile("den Anbieterbezug (Domain)", site.name);

// Art. 246a § 1 Abs. 1 Nr. 4 EGBGB — the date of the order, which the model
// form asks the customer to fill in and the withdrawal period runs from.
beideTeile("das Bestelldatum", "31.07.2026");

// No performance promise we cannot source. The 14:30 cut-off was stated here
// until the first live order contradicted it (paid 21:58, handed to print
// 22:00 the same evening). Nothing may put a clock time back into this mail.
for (const teil of [
  ["HTML-Teil", mail.html],
  ["Text-Teil", mail.text],
] as const) {
  if (/\b\d{1,2}[:.]\d{2}\s*Uhr/i.test(teil[1])) {
    fehler.push(`${teil[0]} nennt wieder eine Uhrzeit als Zusage`);
  }
}

// The reference is the eBrief job id, not the Checkout session id: 66
// characters of `cs_live_…` are unreadable over the phone and are not what a
// support request is looked up by.
beideTeile("die Auftragsnummer", "40123");
for (const teil of [
  ["HTML-Teil", mail.html],
  ["Text-Teil", mail.text],
] as const) {
  if (/\bcs_(live|test)_/.test(teil[1])) {
    fehler.push(`${teil[0]} zeigt dem Kunden eine Stripe-Session-Id`);
  }
}

// § 312f Abs. 2 i. V. m. Art. 246a § 1 Abs. 2 — the notice, in full.
for (const absatz of widerrufsbelehrung) {
  beideTeile("einen Absatz der Widerrufsbelehrung", absatz.slice(0, 60));
}
for (const zeile of musterWiderrufsformular) {
  beideTeile("eine Zeile des Muster-Widerrufsformulars", zeile.slice(0, 40));
}

// § 312f Abs. 3 — the confirmation of the early-start declaration.
beideTeile("die § 356-Bestätigung", erloeschenHinweis.slice(0, 60));

// The order the customer reads in. Every part below is legally required and
// none of it may be dropped, but the first live customer's complaint was that
// the mail read as a withdrawal leaflet with an order buried in it. What was
// bought comes first, what happens next second, the mandatory notices last.
const PFLICHTBLOCK = "Pflichtangaben zu Ihrem Widerrufsrecht";
// The first paragraph of the notice, anchored on its own words rather than on
// the heading: "Widerrufsbelehrung" is also mentioned in the opening sentence
// that explains who we are, and matching that would prove nothing.
const BELEHRUNG_BEGINN = widerrufsbelehrung[0].slice(0, 40);

reihenfolge("Gesamtpreis", "Wie es weitergeht");
reihenfolge("Wie es weitergeht", PFLICHTBLOCK);
reihenfolge(PFLICHTBLOCK, BELEHRUNG_BEGINN);
reihenfolge("Gesamtpreis", BELEHRUNG_BEGINN);
reihenfolge(BELEHRUNG_BEGINN, musterWiderrufsformular[0]);

// The legal block has to announce itself, or it is just more text.
beideTeileEgalGross("die Überschrift des Pflichtangaben-Blocks", PFLICHTBLOCK);

if (!mail.subject.trim()) fehler.push("Betreff ist leer");
if (mail.text.trim().length < 500) {
  fehler.push("Text-Teil ist verdächtig kurz — enthält er die Belehrung?");
}

if (fehler.length > 0) {
  console.error("Bestellbestätigung unvollständig:\n");
  for (const f of fehler) console.error(`  ✗ ${f}`);
  console.error(
    `\n${fehler.length} Problem(e). Die Mail erfüllt § 312f BGB so nicht.`
  );
  process.exit(1);
}

console.log("✓ Bestellbestätigung enthält alle Pflichtangaben.");
