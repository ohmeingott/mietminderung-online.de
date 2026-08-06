import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { locales, translations } from "./translations";
import { STEUERHINWEIS_SCHLUESSEL, steuerhinweisSchluessel } from "./steuerhinweis";

describe("steuerhinweisSchluessel", () => {
  it("wählt den Schlüssel zum Steuermodus", () => {
    assert.equal(
      steuerhinweisSchluessel("kleinunternehmer"),
      "dispatch.taxNote",
    );
    assert.equal(steuerhinweisSchluessel("regel"), "dispatch.taxNoteRegel");
  });
});

/**
 * Der Hinweis steht in der Versandkarte unmittelbar über dem Bezahlen-Button —
 * die sichtbarste Preisangabe des Produkts, und die einzige, die in sieben
 * Sprachen existiert. Geprüft wird sprachunabhängig: im Kleinunternehmermodus
 * die ausdrückliche Befreiung nach § 19 UStG (§ 34a Satz 1 Nr. 5 UStDV), im
 * Regelmodus der Steuersatz und keine Berufung mehr auf § 19 UStG.
 */
describe("Steuerhinweis in allen Sprachen", () => {
  for (const { code } of locales) {
    it(`nennt im Kleinunternehmermodus (${code}) § 19 UStG`, () => {
      const satz = translations[code][STEUERHINWEIS_SCHLUESSEL.kleinunternehmer];
      assert.ok(satz, `${code}: Schlüssel fehlt`);
      assert.match(satz, /§ 19 UStG/);
    });

    it(`nennt im Regelmodus (${code}) den Steuersatz`, () => {
      const satz = translations[code][STEUERHINWEIS_SCHLUESSEL.regel];
      assert.ok(satz, `${code}: Schlüssel fehlt`);
      assert.match(satz, /19/);
      assert.doesNotMatch(satz, /§ 19/);
    });
  }
});
