import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mangelKategorien } from "../data/maengel";
import { generateBriefText } from "./brief/generateBriefText";
import { versandPdfBase64 } from "./briefPdf";

/**
 * A 4×2 pixel PNG. The point is not the picture but that one is set at all —
 * and where.
 */
const UNTERSCHRIFT =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAAEElEQVR4nGNgYGD4j4ZRBQB7pgf5fzpslgAAAABJRU5ErkJggg==";

function mangel(id: string) {
  for (const kategorie of mangelKategorien) {
    const treffer = kategorie.maengel.find((m) => m.id === id);
    if (treffer) return treffer;
  }
  throw new Error(`Unbekannter Mangel im Test: ${id}`);
}

/** Real catalogue data, so the letters are as long as real ones. */
function brief(mangelIds: string[], angezeigt = "nein"): string {
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
    antworten: { angezeigt },
    frist: new Date(2026, 10, 20),
    heute: new Date(2026, 10, 17),
  });
}

function seiten(text: string, mitUnterschrift: boolean): number {
  return versandPdfBase64({
    text,
    absenderZeile: "Erika Mustermann, Musterstraße 10, 50676 Köln",
    empfaenger: [
      "Hausverwaltung Beispiel GmbH",
      "Vermieterstraße 5",
      "50667 Köln",
    ],
    ...(mitUnterschrift ? { signatureDataUrl: UNTERSCHRIFT } : {}),
  }).seiten;
}

const IDS = ["heizung_total", "schimmel_stark", "wasserschaden", "kakerlaken"];

describe("versandPdfBase64 — Unterschrift", () => {
  /*
   * The signature belongs in the gap between "Mit freundlichen Grüßen" and the
   * typed name. It used to be appended after the whole text — below the name,
   * which is not where a German letter puts it — and because a full
   * Mängelanzeige ends near the foot of the page, the edge rule then threw it
   * onto a second sheet carrying nothing else.
   *
   * Tested through the page count, because that is the consequence that hurts:
   * eBrief bills per sheet and prints single-sided, so the stray sheet was
   * postage paid for a picture. Every letter below cost two sheets signed
   * before this was fixed.
   */
  it("keeps the common letter on one sheet, signature and all", () => {
    // One and two defects are the everyday cases.
    assert.equal(seiten(brief(IDS.slice(0, 1)), true), 1);
    assert.equal(seiten(brief(IDS.slice(0, 2)), true), 1);
  });

  it("never lets the signature cost more than the one sheet it needs", () => {
    // Longer letters do run onto a second sheet — but that sheet carries the
    // rest of the letter, not a lone signature, and there is never a third.
    for (const angezeigt of ["nein", "muendlich", "ja"]) {
      for (const anzahl of [1, 2, 3, 4]) {
        const text = brief(IDS.slice(0, anzahl), angezeigt);
        const ohne = seiten(text, false);
        const mit = seiten(text, true);
        assert.ok(
          mit <= ohne + 1,
          `${anzahl} Mängel/${angezeigt}: ${ohne} Blatt ohne, ${mit} mit`
        );
      }
    }
  });

  it("leaves the unsigned letter exactly as long as it was", () => {
    // The room for the signature is made at render time and only when there is
    // one. Reserving it in the letter text would have cost a sheet here.
    for (const anzahl of [1, 2, 3, 4]) {
      assert.equal(seiten(brief(IDS.slice(0, anzahl)), false), 1);
    }
  });

  it("still renders a document, header and all", () => {
    const ergebnis = versandPdfBase64({
      text: brief(IDS.slice(0, 2)),
      absenderZeile: "Erika Mustermann, Musterstraße 10, 50676 Köln",
      empfaenger: ["Hausverwaltung Beispiel GmbH", "50667 Köln"],
      signatureDataUrl: UNTERSCHRIFT,
    });
    assert.ok(ergebnis.base64.length > 1000);
    assert.equal(ergebnis.kopfErkannt, true);
    assert.equal(ergebnis.datumErkannt, true);
    assert.equal(ergebnis.absenderGekuerzt, false);
  });

  it("falls back to the end of the text when the letter was rewritten", () => {
    // The user may edit the letter freely, and a rewritten one may carry no
    // gap at all. That must still produce a signed PDF, not a crash.
    const ergebnis = versandPdfBase64({
      text: "Betreff: Mängelanzeige\n\nSehr geehrte Damen und Herren,\nes tropft.\nErika Mustermann",
      absenderZeile: "Erika Mustermann, Musterstraße 10, 50676 Köln",
      empfaenger: ["Hausverwaltung Beispiel GmbH", "50667 Köln"],
      signatureDataUrl: UNTERSCHRIFT,
    });
    assert.ok(ergebnis.base64.length > 1000);
    assert.equal(ergebnis.seiten, 1);
  });
});
