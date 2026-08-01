/**
 * Renders sample letters through the real dispatch generator, for the address
 * spacing check PIN AG offers before the first live send.
 *
 * Deliberately the production code path (`versandPdfBase64`), not a mock: the
 * point of the check is to have PIN AG look at the exact bytes their system
 * will receive. Two cases are written — a typical address and one that nearly
 * fills the 85 × 27 mm field — so the check covers the range rather than one
 * comfortable example.
 *
 *   npx tsx scripts/testsendung-pdf.ts <ausgabeverzeichnis>
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { versandPdfBase64 } from "../src/lib/briefPdf";

const ziel = process.argv[2] ?? ".";
mkdirSync(ziel, { recursive: true });

function brief(params: {
  mieter: string;
  strasse: string;
  ort: string;
  vermieter: string[];
  betreff: string;
  maengel: string;
}): string {
  return `${params.mieter}
${params.strasse}
${params.ort}

${params.vermieter.join("\n")}

Köln, den 31.07.2026

Betreff: ${params.betreff}

Sehr geehrte Damen und Herren,

hiermit zeige ich Ihnen an, dass sich in der von mir angemieteten Wohnung folgende Mängel befinden:

${params.maengel}

Ich fordere Sie auf, die oben genannten Mängel umgehend, jedoch bis spätestens zum 14.08.2026 zu beseitigen.

Das mir zustehende Mietminderungsrecht gemäß § 536 Abs. 1 BGB behalte ich mir vor. Rein vorsorglich erkläre ich, dass die bereits gezahlte Miete für den Monat Juli 2026 sowie künftige Mietzahlungen unter dem Vorbehalt der Rückforderung geleistet werden.

Sollten die Mängel nicht fristgerecht beseitigt werden, behalte ich mir weitere rechtliche Schritte vor, insbesondere Schadensersatz gemäß § 536a BGB sowie die Durchführung einer Ersatzvornahme gemäß § 536a Abs. 2 BGB.

Termine zur Mängelbeseitigung können Sie gerne mit mir telefonisch vereinbaren. Sie erreichen mich tagsüber unter der Rufnummer 0221 1234567.

Mit freundlichen Grüßen

${params.mieter}`;
}

const faelle = [
  {
    datei: "01-typischer-fall.pdf",
    beschreibung: "Typische Anschrift, einseitig",
    absenderZeile: "Anna Beispiel, Musterweg 12, 50667 Köln",
    empfaenger: ["Hausverwaltung Muster GmbH", "Musterstraße 5", "50667 Köln"],
    text: brief({
      mieter: "Anna Beispiel",
      strasse: "Musterweg 12",
      ort: "50667 Köln",
      vermieter: ["Hausverwaltung Muster GmbH", "Musterstraße 5", "50667 Köln"],
      betreff: "Mängelanzeige für die Wohnung Musterweg 12, 50667 Köln",
      maengel:
        "1. Schimmel an der Wand (Raum: Schlafzimmer) (besteht seit Mai 2026)\n   An der Außenwand hinter dem Bett bildet sich seit Wochen schwarzer Schimmel.\n\n2. Heizung fällt aus (Raum: Wohnzimmer) (besteht seit Juni 2026)\n   Die Heizung wird nur noch handwarm und heizt den Raum nicht auf.",
    }),
  },
  {
    datei: "02-lange-anschrift.pdf",
    beschreibung:
      "Anschrift am oberen Ende dessen, was in das 85 × 27 mm Feld passt",
    absenderZeile:
      "Dr. Maximiliane Charlotte von Beispielhausen, Oberer Lindenbergweg 148a, 51065 Köln-Mülheim",
    empfaenger: [
      "Immobilienverwaltung Rheinbogen GmbH & Co. KG",
      "z. Hd. Frau Dr. Katharina Schmidt-Wittgenstein",
      "Konrad-Adenauer-Ufer 128b",
      "50668 Köln",
    ],
    text: brief({
      mieter: "Dr. Maximiliane Charlotte von Beispielhausen",
      strasse: "Oberer Lindenbergweg 148a",
      ort: "51065 Köln-Mülheim",
      vermieter: [
        "Immobilienverwaltung Rheinbogen GmbH & Co. KG",
        "z. Hd. Frau Dr. Katharina Schmidt-Wittgenstein",
        "Konrad-Adenauer-Ufer 128b",
        "50668 Köln",
      ],
      betreff:
        "Mängelanzeige für die Wohnung Oberer Lindenbergweg 148a, 51065 Köln-Mülheim, Wohnung 4b",
      maengel:
        "1. Undichte Fenster (Raum: gesamte Wohnung) (besteht seit April 2026)\n   Bei Regen dringt Wasser an den Fensterrahmen ein; die Dichtungen sind spröde.",
    }),
  },
];

for (const fall of faelle) {
  const ergebnis = versandPdfBase64({
    text: fall.text,
    absenderZeile: fall.absenderZeile,
    empfaenger: fall.empfaenger,
  });
  const pfad = join(ziel, fall.datei);
  writeFileSync(pfad, Buffer.from(ergebnis.base64, "base64"));
  console.log(
    `${fall.datei}  ${ergebnis.seiten} Seite(n)  ` +
      `Kopf erkannt: ${ergebnis.kopfErkannt}  ` +
      `Datum erkannt: ${ergebnis.datumErkannt}  ` +
      `Absender gekürzt: ${ergebnis.absenderGekuerzt}`
  );
}
