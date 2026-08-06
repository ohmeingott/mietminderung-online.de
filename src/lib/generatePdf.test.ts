import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mangelKategorien } from "../data/maengel";
import { generateBriefText } from "./brief/generateBriefText";
import { generatePdf } from "./generatePdf";

/** A 4×2 pixel PNG — the point is that an image is set, and where. */
const UNTERSCHRIFT =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAAEElEQVR4nGNgYGD4j4ZRBQB7pgf5fzpslgAAAABJRU5ErkJggg==";

function mangel(id: string) {
  for (const kategorie of mangelKategorien) {
    const treffer = kategorie.maengel.find((m) => m.id === id);
    if (treffer) return treffer;
  }
  throw new Error(`Unbekannter Mangel im Test: ${id}`);
}

function brief(mangelIds: string[]): string {
  return generateBriefText({
    mieter: {
      name: "Erika Mustermann",
      strasse: "Musterstraße 10",
      plz: "50676",
      ort: "Köln",
      telefon: "0176 12345678",
      email: "erika@beispiel.de",
      wohnungNr: "",
    },
    vermieter: {
      name: "Hausverwaltung Beispiel GmbH",
      strasse: "Vermieterstraße 5",
      plz: "50667",
      ort: "Köln",
    },
    maengel: mangelIds.map(mangel),
    details: {},
    antworten: { angezeigt: "nein" },
    frist: new Date(2026, 10, 20),
    heute: new Date(2026, 10, 17),
  });
}

const IDS = ["heizung_total", "schimmel_stark", "wasserschaden", "kakerlaken"];

describe("generatePdf — Unterschrift", () => {
  /*
   * The free download had the dispatch PDF's bug independently: the image was
   * appended after the whole text, which put the signature below the typed
   * name. This page is not billed per sheet, so the cost is only that the
   * letter looks wrong — which is the whole point of a letter the tenant hands
   * to a landlord.
   */
  it("does not push the signature onto a page of its own", () => {
    for (const anzahl of [1, 2, 3, 4]) {
      const text = brief(IDS.slice(0, anzahl));
      const ohne = generatePdf({ text }).getNumberOfPages();
      const mit = generatePdf({
        text,
        signatureDataUrl: UNTERSCHRIFT,
      }).getNumberOfPages();
      assert.equal(mit, ohne, `${anzahl} Mängel: die Unterschrift kostet eine Seite`);
    }
  });

  it("still renders without a signature", () => {
    const doc = generatePdf({ text: brief(IDS.slice(0, 2)) });
    assert.ok(doc.output("datauristring").length > 1000);
  });

  it("falls back to the end of the text when the letter was rewritten", () => {
    const doc = generatePdf({
      text: "Sehr geehrte Damen und Herren,\nes tropft.\nErika Mustermann",
      signatureDataUrl: UNTERSCHRIFT,
    });
    assert.equal(doc.getNumberOfPages(), 1);
  });
});
