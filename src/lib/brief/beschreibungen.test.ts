import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  baueAnfrage,
  istGueltigeAntwort,
  verteileAntworten,
  zuUeberarbeiten,
  type MangelInput,
} from "./beschreibungen";

function mangel(beschreibung: string, label = "Schimmel"): MangelInput {
  return { label, raum: "", seit: "", beschreibung };
}

describe("zuUeberarbeiten", () => {
  it("picks only the defects the tenant described", () => {
    const maengel = [mangel("Schwarze Flecken an der Wand."), mangel("")];
    assert.deepEqual(zuUeberarbeiten(maengel), [0]);
  });

  it("treats whitespace as no description", () => {
    assert.deepEqual(zuUeberarbeiten([mangel("   \n  ")]), []);
  });

  it("keeps every one when all are described", () => {
    assert.deepEqual(zuUeberarbeiten([mangel("a"), mangel("b")]), [0, 1]);
  });
});

describe("baueAnfrage", () => {
  it("numbers the defects consecutively, not by their original position", () => {
    // The model answers in the order it was asked; a gap in the numbering
    // would invite it to return a gap too.
    const maengel = [mangel(""), mangel("Die Heizung bleibt kalt."), mangel("")];
    const anfrage = baueAnfrage(maengel, zuUeberarbeiten(maengel));
    assert.ok(anfrage.startsWith("Mangel 1:"));
    assert.ok(!anfrage.includes("Mangel 2:"));
  });

  it("sends no empty description into the prompt", () => {
    const maengel = [mangel(""), mangel("Der Aufzug steht.")];
    const anfrage = baueAnfrage(maengel, zuUeberarbeiten(maengel));
    assert.ok(!anfrage.includes("(keine Beschreibung)"));
    assert.ok(anfrage.includes("Der Aufzug steht."));
  });
});

describe("istGueltigeAntwort", () => {
  it("accepts one string per asked defect", () => {
    assert.ok(istGueltigeAntwort(["a", "b"], 2));
  });

  it("rejects a wrong length, a wrong type and a non-array", () => {
    assert.ok(!istGueltigeAntwort(["a"], 2));
    assert.ok(!istGueltigeAntwort(["a", 5], 2));
    assert.ok(!istGueltigeAntwort("a", 1));
    assert.ok(!istGueltigeAntwort(undefined, 1));
  });
});

describe("verteileAntworten", () => {
  it("puts each rewrite back on its own defect", () => {
    // The bug this arithmetic has to avoid: an answer landing one defect off,
    // so the mould text appears under the broken lift.
    const maengel = [
      mangel("", "Aufzug"),
      mangel("Flecken im Bad.", "Schimmel"),
      mangel("", "Heizung"),
      mangel("Bleibt kalt.", "Heizung"),
    ];
    const indizes = zuUeberarbeiten(maengel);
    const ergebnis = verteileAntworten(maengel, indizes, [
      "SCHIMMEL-NEU",
      "HEIZUNG-NEU",
    ]);
    assert.deepEqual(ergebnis, ["", "SCHIMMEL-NEU", "", "HEIZUNG-NEU"]);
  });

  it("leaves an undescribed defect empty rather than inventing one", () => {
    // The letter then prints the defect label alone, which is at least true.
    const maengel = [mangel("")];
    assert.deepEqual(verteileAntworten(maengel, [], []), [""]);
  });

  it("keeps the tenant's own words when the rewrite comes back blank", () => {
    const maengel = [mangel("Es tropft von der Decke.")];
    assert.deepEqual(verteileAntworten(maengel, [0], ["   "]), [
      "Es tropft von der Decke.",
    ]);
  });

  it("never returns fewer descriptions than there are defects", () => {
    const maengel = [mangel("a"), mangel(""), mangel("c")];
    const ergebnis = verteileAntworten(maengel, [0, 2], ["A", "C"]);
    assert.equal(ergebnis.length, maengel.length);
  });
});
