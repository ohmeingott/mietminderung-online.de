/**
 * Writes a realistic sample letter through the real dispatch layout, so the
 * staging spike can upload something eBrief's address reader is actually
 * meant to cope with. Uploading the spacing template instead would exercise
 * the job lifecycle but tell us nothing about whether our address field is
 * found where eBrief looks for it.
 *
 * Usage: npx tsx scripts/spike-testbrief.ts [output.pdf]
 */
import { writeFileSync } from "node:fs";
import { generateVersandPdf } from "../src/lib/briefPdf";

const ZIEL = process.argv[2] ?? "spike-testbrief.pdf";

// Put your own postal address in as the recipient before running the spike —
// staging should not post anything, but if it ever does, it should reach you.
const doc = generateVersandPdf({
  text: `Musterstadt, den 30.07.2026

Betreff: Mängelanzeige — Wohnung Beispielweg 12, 12345 Musterstadt

Sehr geehrte Damen und Herren,

hiermit zeige ich Ihnen an, dass sich in der von mir angemieteten Wohnung folgende Mängel befinden:

1. Heizungsausfall (Raum: Wohnzimmer) — besteht seit 01.07.2026
   Die Heizung bleibt kalt, die Raumtemperatur liegt tagsüber bei 16 °C.

2. Feuchtigkeit und Schimmel (Raum: Schlafzimmer)
   An der Außenwand hat sich großflächig Schimmel gebildet.

Ich fordere Sie auf, die genannten Mängel bis spätestens zum 13.08.2026 zu beseitigen.

Das mir zustehende Mietminderungsrecht gemäß § 536 Abs. 1 BGB behalte ich mir vor.

Mit freundlichen Grüßen

Erika Mustermann`,
  absenderZeile: "Erika Mustermann, Beispielweg 12, 12345 Musterstadt",
  empfaenger: [
    "Hausverwaltung Mustermann GmbH",
    "Verwaltungsstraße 8",
    "12347 Musterstadt",
  ],
});

writeFileSync(ZIEL, Buffer.from(doc.output("arraybuffer")));
console.log(`Written: ${ZIEL}`);
