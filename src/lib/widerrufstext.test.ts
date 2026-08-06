import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  erklaerungErloeschen,
  erklaerungSofortigerBeginn,
  erloeschenHinweis,
  musterWiderrufsformular,
  vertragsbezeichnung,
  widerrufsbelehrung,
  widerrufserklaerungSatz,
} from "./widerrufstext";

/**
 * The most expensive failure mode in the product.
 *
 * Under EuGH C-97/22 a faulty withdrawal notice costs the FULL remuneration:
 * the letter is out, the money goes back, no compensation for value is owed.
 * These tests hold on to what the research produced. They do not replace the
 * lawyer's review, but they stop anyone quietly removing a requirement.
 */

/** Every string a consumer is shown about withdrawal, in one haystack. */
const ALLE_TEXTE = [
  erklaerungSofortigerBeginn,
  erklaerungErloeschen,
  ...widerrufsbelehrung,
  erloeschenHinweis,
  ...musterWiderrufsformular,
  widerrufserklaerungSatz,
].join("\n");

describe("the two separate declarations — § 356 Abs. 5 Nr. 2 BGB", () => {
  it("cites the version in force since 19.6.2026", () => {
    // Until 18.6.2026 it was § 356 Abs. 4 BGB. Citing the old version instructs
    // the consumer about a provision that no longer exists in that form.
    assert.match(ALLE_TEXTE, /§ 356 Absatz 5 Nummer 2 BGB|§ 356 Abs\. 5 Nr\. 2 BGB/);
    assert.doesNotMatch(ALLE_TEXTE, /§ 356 Abs\.? ?4|§ 356 Absatz 4/);
  });

  it("requests the early start expressly", () => {
    // lit. a: the consumer's express request.
    assert.match(erklaerungSofortigerBeginn, /verlange ausdrücklich/i);
    assert.match(erklaerungSofortigerBeginn, /vor Ablauf der Widerrufsfrist/i);
  });

  it("confirms knowledge of the expiry separately", () => {
    // lit. c: a declaration of its own, not the same one. Two boxes, not one.
    assert.match(erklaerungErloeschen, /bekannt/i);
    assert.match(erklaerungErloeschen, /erlischt/i);
    assert.notEqual(erklaerungSofortigerBeginn, erklaerungErloeschen);
  });

  it("does not invoke the custom-specification exemption", () => {
    // § 312g Abs. 2 Nr. 1 BGB covers goods, not services. Naming it here would
    // itself be a faulty instruction.
    assert.doesNotMatch(ALLE_TEXTE, /Kundenspezifikation|nach Ihren Vorgaben angefertigt/i);
  });
});

describe("widerrufsbelehrung", () => {
  const text = widerrufsbelehrung.join("\n");

  it("names period, start and addressee", () => {
    assert.match(text, /vierzehn Tagen/);
    assert.match(text, /Vertragsschluss/i);
    assert.match(text, /eindeutige[nr]? Erklärung/i);
  });

  it("names the withdrawal button under § 356a BGB", () => {
    // Mandatory since 19.6.2026, even where the right expires within minutes.
    assert.match(text, /Vertrag widerrufen/);
  });

  it("names the address where the button is to be found", () => {
    // "On our withdrawal page" helps nobody reading the notice as an email. It
    // has to be an address that can be typed into a browser.
    assert.match(text, /mietminderung-online\.de\/widerruf/);
  });

  it("announces the confirmation under § 356a Abs. 4 BGB", () => {
    // Whoever withdraws must know they get a record — and what is in it.
    assert.match(text, /Datum und Uhrzeit/i);
  });

  it("explains the expiry on full performance", () => {
    assert.match(`${text}\n${erloeschenHinweis}`, /vollständig/i);
    assert.match(erloeschenHinweis, /erlischt/i);
  });
});

describe("the declaration returned in the confirmation", () => {
  it("is a complete withdrawal declaration on its own", () => {
    // § 356a Abs. 4 BGB: the confirmation carries the CONTENT of the
    // declaration. This sentence is that content.
    assert.match(widerrufserklaerungSatz, /Hiermit widerrufe ich/i);
    assert.ok(widerrufserklaerungSatz.includes(vertragsbezeichnung));
  });
});

describe("musterWiderrufsformular", () => {
  it("carries the entries of the official model", () => {
    const text = musterWiderrufsformular.join("\n");
    assert.match(text, /hiermit widerrufe/i);
    assert.match(text, /Name des\/der Verbraucher/i);
    assert.match(text, /Datum/);
  });
});
