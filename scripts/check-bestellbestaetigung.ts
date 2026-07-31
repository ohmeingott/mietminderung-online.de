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
 * address, the delivery timing, the full Widerrufsbelehrung, the model form,
 * and the confirmation of the § 356 Abs. 4 declaration. Both parts are checked
 * — a mail whose text/plain alternative is empty is what a strict client shows.
 */
import { bestellbestaetigungEmail } from "../src/lib/email/templates";
import {
  erloeschenHinweis,
  musterWiderrufsformular,
  widerrufsbelehrung,
} from "../src/lib/widerrufstext";
import { site } from "../src/lib/site";

const mail = bestellbestaetigungEmail({
  produktId: "einwurfEinschreiben",
  betragCent: 699,
  referenz: "cs_test_referenz",
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

// Art. 246a § 1 Abs. 1 Nr. 1, 4 EGBGB — service and total price.
beideTeile("die Leistungsbeschreibung", "Einwurf-Einschreiben");
beideTeile("den gezahlten Gesamtpreis", "6,99");

// § 19 UStG — the note that replaces a VAT line. Its absence would leave the
// price looking like a net amount; an "inkl. MwSt." would be owed under § 14c.
beideTeile("den § 19-Hinweis", "§ 19 UStG");
if (/mwst/i.test(mail.text) || /inkl\.\s*\d+\s*%/i.test(mail.text)) {
  fehler.push("Text-Teil weist Umsatzsteuer aus, obwohl § 19 UStG gilt");
}

// Art. 246a § 1 Abs. 1 Nr. 2 — who the trader is, in the mail itself.
beideTeile("den Anbieternamen", site.operator.name);
beideTeile("den Inhaber", site.operator.owner);
beideTeile("die Anschrift", site.operator.street);
beideTeile("die Kontaktadresse", site.operator.email);

// Leistungszeit: the cut-off the terms and the withdrawal page also state.
beideTeile("den Annahmeschluss", "14:30");

// § 312f Abs. 2 i. V. m. Art. 246a § 1 Abs. 2 — the notice, in full.
for (const absatz of widerrufsbelehrung) {
  beideTeile("einen Absatz der Widerrufsbelehrung", absatz.slice(0, 60));
}
for (const zeile of musterWiderrufsformular) {
  beideTeile("eine Zeile des Muster-Widerrufsformulars", zeile.slice(0, 40));
}

// § 312f Abs. 3 — the confirmation of the early-start declaration.
beideTeile("die § 356-Bestätigung", erloeschenHinweis.slice(0, 60));

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
