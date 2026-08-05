import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mangelKategorien } from "../../data/maengel";
import {
  generateBriefText,
  type Anrede,
  type BriefDaten,
} from "./generateBriefText";

function mangel(id: string) {
  for (const kategorie of mangelKategorien) {
    const treffer = kategorie.maengel.find((m) => m.id === id);
    if (treffer) return treffer;
  }
  throw new Error(`Unbekannter Mangel im Test: ${id}`);
}

const MIETER = {
  name: "Erika Mustermann",
  strasse: "Musterstraße 10",
  plz: "50676",
  ort: "Köln",
  telefon: "0176 12345678",
  email: "erika@beispiel.de",
  wohnungNr: "",
};

const VERMIETER = {
  name: "Hausverwaltung Beispiel GmbH",
  strasse: "Vermieterstraße 5",
  plz: "50667",
  ort: "Köln",
};

function brief(overrides: Partial<BriefDaten> = {}): string {
  return generateBriefText({
    mieter: MIETER,
    vermieter: VERMIETER,
    maengel: [mangel("heizung_total")],
    details: {},
    antworten: { angezeigt: "nein" },
    frist: new Date(2026, 10, 20),
    heute: new Date(2026, 10, 17),
    ...overrides,
  });
}

describe("generateBriefText", () => {
  it("carries the addresses, the date and the subject line", () => {
    const text = brief();
    assert.match(text, /^Erika Mustermann\nMusterstraße 10\n50676 Köln/);
    assert.ok(text.includes("Hausverwaltung Beispiel GmbH"));
    assert.ok(text.includes("Köln, den 17.11.2026"));
    assert.ok(
      text.includes("Betreff: Mängelanzeige für die Wohnung Musterstraße 10, 50676 Köln")
    );
  });

  it("names the flat number only when there is one", () => {
    assert.ok(!brief().includes("Wohnung ,"));
    const mitNummer = brief({ mieter: { ...MIETER, wohnungNr: "3. OG links" } });
    assert.ok(mitNummer.includes("Köln, Wohnung 3. OG links"));
  });

  it("states the chosen deadline, and only once", () => {
    const text = brief({ frist: new Date(2026, 11, 24) });
    assert.ok(text.includes("bis spätestens zum 24.12.2026 zu beseitigen"));
    assert.equal(text.match(/24\.12\.2026/g)?.length, 1);
    assert.ok(!text.includes("20.11.2026"));
  });

  it("quotes the paragraphs the letter rests on", () => {
    const text = brief();
    for (const paragraf of ["§ 536 Abs. 1 BGB", "§ 536a BGB", "§ 536a Abs. 2 BGB"]) {
      assert.ok(text.includes(paragraf), `${paragraf} fehlt`);
    }
  });

  it("attributes each description to its own defect, not to a position", () => {
    // The bug this keying replaces: removing the first of two defects shifted
    // every description up one, so the lift text appeared under the mould.
    const text = brief({
      maengel: [mangel("aufzug_defekt"), mangel("schimmel_leicht")],
      details: {
        aufzug_defekt: { raum: "Treppenhaus", seit: "seit Mai", beschreibung: "AUFZUG-MARKER" },
        schimmel_leicht: { raum: "Bad", seit: "seit April", beschreibung: "SCHIMMEL-MARKER" },
      },
    });
    const aufzug = text.indexOf("AUFZUG-MARKER");
    const schimmel = text.indexOf("SCHIMMEL-MARKER");
    assert.ok(aufzug > -1 && schimmel > -1);
    // Numbering follows the selection order; the text follows the id.
    assert.match(text, /1\. Aufzug[\s\S]{0,120}AUFZUG-MARKER/);
    assert.match(text, /2\. .*Schimmel[\s\S]{0,120}SCHIMMEL-MARKER/);
    assert.ok(aufzug < schimmel);
  });

  it("leaves out a detail that was not filled in", () => {
    const text = brief({ details: { heizung_total: { raum: "", seit: "", beschreibung: "" } } });
    assert.ok(!text.includes("(Raum: )"));
    assert.ok(!text.includes("(besteht seit )"));
  });

  it("mentions an earlier verbal report", () => {
    const text = brief({ antworten: { angezeigt: "muendlich" } });
    assert.ok(text.includes("bereits mündlich hingewiesen"));
  });

  it("mentions an earlier written report", () => {
    const text = brief({ antworten: { angezeigt: "ja" } });
    assert.ok(text.includes("bereits schriftlich hingewiesen"));
  });

  it("says nothing about an earlier report when there was none", () => {
    const text = brief({ antworten: { angezeigt: "nein" } });
    assert.ok(!text.includes("hingewiesen"));
    // The baseline letter must be unchanged for the common case.
    assert.ok(text.includes("hiermit zeige ich Ihnen an"));
  });

  it("records a reservation made at move-in", () => {
    const text = brief({ antworten: { angezeigt: "nein", mangel_bekannt: "ja_vorbehalt" } });
    assert.ok(text.includes("ausdrücklich vorbehalten"));
    assert.ok(!brief().includes("ausdrücklich vorbehalten"));
  });

  it("offers a phone appointment only when a number was given", () => {
    assert.ok(brief().includes("unter der Rufnummer 0176 12345678"));
    const ohne = brief({ mieter: { ...MIETER, telefon: "" } });
    // It used to print the literal placeholder into a finished letter.
    assert.ok(!ohne.includes("[Telefonnummer]"));
    assert.ok(ohne.includes("schriftlich mit mir vereinbaren"));
  });

  it("names the month the reservation covers", () => {
    assert.ok(brief().includes("für den Monat November 2026"));
  });

  it("never leaks a placeholder or a broken value", () => {
    for (const antwort of ["nein", "muendlich", "ja"]) {
      for (const bekannt of ["nein", "ja_vorbehalt"]) {
        for (const telefon of ["", "030 123456"]) {
          const text = brief({
            antworten: { angezeigt: antwort, mangel_bekannt: bekannt },
            mieter: { ...MIETER, telefon },
            maengel: [mangel("heizung_total"), mangel("aufzug_defekt")],
          });
          for (const gift of ["undefined", "null", "NaN", "[object Object]", "\n\n\n"]) {
            assert.ok(!text.includes(gift), `"${gift}" in der Variante ${antwort}/${bekannt}`);
          }
        }
      }
    }
  });

  it("stays German with a date in German digits", () => {
    // The interface can be Arabic; the letter goes to a German landlord.
    const text = brief();
    assert.ok(text.includes("Mit freundlichen Grüßen"));
    assert.match(text, /bis spätestens zum \d{2}\.\d{2}\.\d{4}/);
  });

  describe("Anrede", () => {
    const an = (vermieter: Partial<typeof VERMIETER> & { anrede?: Anrede }) =>
      brief({ vermieter: { ...VERMIETER, ...vermieter } });

    it("addresses a company neutrally", () => {
      assert.ok(an({}).includes("Sehr geehrte Damen und Herren,"));
    });

    it("never writes the old slash form", () => {
      // The first line the landlord reads, and the clearest sign a letter came
      // out of a generator. It must not come back for any combination.
      for (const anrede of [undefined, "firma", "frau", "herr"] as const) {
        assert.ok(
          !an({ name: "Ursula Fehrenbach", anrede }).includes("Sehr geehrte/r"),
          `Schrägstrichform bei anrede=${anrede}`,
        );
      }
    });

    it("uses the surname, never the first name", () => {
      const text = an({ name: "Ursula Fehrenbach", anrede: "frau" });
      assert.ok(text.includes("Sehr geehrte Frau Fehrenbach,"));
      assert.ok(!text.includes("Frau Ursula"));
    });

    it("declines the male form correctly", () => {
      assert.ok(
        an({ name: "Klaus Meier", anrede: "herr" }).includes(
          "Sehr geehrter Herr Meier,",
        ),
      );
    });

    it("keeps name particles with the surname", () => {
      // "Sehr geehrte Frau Heide" would be wrong in a way the recipient
      // notices at once.
      assert.ok(
        an({ name: "Anna von der Heide", anrede: "frau" }).includes(
          "Sehr geehrte Frau von der Heide,",
        ),
      );
    });

    it("drops a preceding Frau or Herrn but keeps a doctorate", () => {
      assert.ok(
        an({ name: "Frau Ursula Fehrenbach", anrede: "frau" }).includes(
          "Sehr geehrte Frau Fehrenbach,",
        ),
      );
      assert.ok(
        an({ name: "Dr. Klaus Meier", anrede: "herr" }).includes(
          "Sehr geehrter Herr Meier,",
        ),
      );
    });

    it("copes with a single-word name", () => {
      assert.ok(
        an({ name: "Fehrenbach", anrede: "frau" }).includes(
          "Sehr geehrte Frau Fehrenbach,",
        ),
      );
    });

    it("falls back to the neutral form rather than addressing nobody", () => {
      // An empty name cannot happen through the form, which requires it — but
      // "Sehr geehrte Frau ," is the kind of line that reaches a real landlord
      // once and is remembered.
      assert.ok(
        an({ name: "   ", anrede: "frau" }).includes(
          "Sehr geehrte Damen und Herren,",
        ),
      );
    });
  });
});
