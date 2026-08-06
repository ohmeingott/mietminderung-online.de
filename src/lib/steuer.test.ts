import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  UMSATZSTEUERSATZ,
  steuerhinweisAgb,
  steuerhinweisFaq,
  steuerhinweisPreisblock,
  steuerhinweisRechnung,
  steuermodus,
  stripeTaxBehavior,
  umsatzsteuerAusBrutto,
} from "./steuer";

/**
 * Runs `fn` with STEUERMODUS set to `modus` and restores the environment
 * afterwards.
 *
 * Every helper in steuer.ts reads the variable when it is called rather than
 * when the module is loaded, which is what makes both modes testable in one
 * process — and is also the property this file guards: a helper that captured
 * the mode at import time would pass the first mode and fail the second.
 */
function imModus<T>(modus: string | undefined, fn: () => T): T {
  const vorher = process.env.STEUERMODUS;
  if (modus === undefined) delete process.env.STEUERMODUS;
  else process.env.STEUERMODUS = modus;
  try {
    return fn();
  } finally {
    if (vorher === undefined) delete process.env.STEUERMODUS;
    else process.env.STEUERMODUS = vorher;
  }
}

describe("steuermodus", () => {
  it("fällt ohne gesetzte Variable auf den Kleinunternehmer zurück", () => {
    // Das Produkt ist live und verkauft ohne Umsatzsteuer. Ein Tippfehler in
    // der Variablen darf nicht in die Regelbesteuerung kippen.
    assert.equal(
      imModus(undefined, steuermodus),
      "kleinunternehmer",
    );
    assert.equal(imModus("", steuermodus), "kleinunternehmer");
    assert.equal(imModus("Regel", steuermodus), "kleinunternehmer");
  });

  it("schaltet nur bei genau »regel« um", () => {
    assert.equal(imModus("regel", steuermodus), "regel");
  });

  it("lässt Stripe im Kleinunternehmermodus ohne Steuerverhalten rechnen", () => {
    assert.equal(imModus("kleinunternehmer", stripeTaxBehavior), undefined);
    assert.equal(imModus("regel", stripeTaxBehavior), "inclusive");
  });
});

describe("umsatzsteuerAusBrutto", () => {
  it("rechnet die Steuer aus dem Endpreis heraus", () => {
    // Stripe bucht »inclusive«: der Katalogpreis ist der Bruttobetrag.
    // 6,99 € · 19/119 = 1,1160… €
    assert.deepEqual(umsatzsteuerAusBrutto(699), {
      bruttoCent: 699,
      nettoCent: 587,
      steuerCent: 112,
    });
    assert.deepEqual(umsatzsteuerAusBrutto(249), {
      bruttoCent: 249,
      nettoCent: 209,
      steuerCent: 40,
    });
  });

  it("hält Netto plus Steuer exakt auf dem gezahlten Betrag", () => {
    // Auf der Rechnung stehen alle drei Zahlen nebeneinander. Eine Rundung,
    // die um einen Cent danebenliegt, ist eine Rechnung, die nicht aufgeht.
    for (let brutto = 1; brutto <= 2000; brutto++) {
      const { nettoCent, steuerCent } = umsatzsteuerAusBrutto(brutto);
      assert.equal(nettoCent + steuerCent, brutto, `Brutto ${brutto}`);
    }
  });

  it("nennt den Satz, mit dem gerechnet wurde", () => {
    assert.equal(UMSATZSTEUERSATZ, 19);
  });
});

/**
 * Die vier Sätze, die dem Kunden gegenüber eine Aussage über die
 * Umsatzsteuer treffen. Geprüft wird für beide Modi dasselbe Paar von
 * Bedingungen: im Kleinunternehmermodus die Befreiung nach § 19 UStG und
 * kein Steuerausweis (ein ausgewiesener Betrag wäre nach § 14c UStG
 * geschuldet), im Regelmodus der Hinweis auf den enthaltenen Steuersatz und
 * keine Berufung mehr auf § 19 UStG (§§ 5, 5a UWG).
 */
const HINWEISE: ReadonlyArray<[string, () => string]> = [
  ["Nutzungsbedingungen", steuerhinweisAgb],
  ["FAQ", steuerhinweisFaq],
  ["Preisblock", steuerhinweisPreisblock],
  ["Rechnung", steuerhinweisRechnung],
];

describe("Steuerhinweise", () => {
  for (const [ort, hinweis] of HINWEISE) {
    it(`beruft sich im Kleinunternehmermodus (${ort}) auf § 19 UStG`, () => {
      const satz = imModus("kleinunternehmer", hinweis);
      assert.match(satz, /§ 19 UStG/);
      assert.doesNotMatch(satz, /19 %|MwSt|zzgl\./i);
    });

    it(`weist im Regelmodus (${ort}) 19 % Umsatzsteuer aus`, () => {
      const satz = imModus("regel", hinweis);
      assert.match(satz, /19 % Umsatzsteuer/);
      assert.doesNotMatch(satz, /§ 19 UStG/);
    });
  }

  it("hält den Wortlaut des Kleinunternehmermodus fest", () => {
    // Das Produkt verkauft heute in diesem Modus. Diese vier Sätze stehen so
    // auf der Webseite und in der Bestellbestätigung; die Umstellung auf
    // steuermodus() darf an ihnen kein Zeichen ändern.
    assert.equal(
      imModus("kleinunternehmer", steuerhinweisAgb),
      "Es handelt sich um Endpreise; gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher auch nicht ausgewiesen.",
    );
    assert.equal(
      imModus("kleinunternehmer", steuerhinweisFaq),
      "Das sind Endpreise, weitere Kosten entstehen nicht. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.",
    );
    assert.equal(
      imModus("kleinunternehmer", steuerhinweisPreisblock),
      "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.",
    );
    assert.equal(
      imModus("kleinunternehmer", steuerhinweisRechnung),
      "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher nicht ausgewiesen.",
    );
  });

  it("nennt im Regelmodus überall den Endpreis als solchen", () => {
    // §§ 5, 5a UWG: Der Preis muss als Endpreis erkennbar bleiben, sonst
    // liest er sich als Nettopreis mit Aufschlag.
    for (const [ort, hinweis] of HINWEISE) {
      if (ort === "Rechnung") continue; // dort steht der Gesamtbetrag daneben
      assert.match(imModus("regel", hinweis), /Endpreis/, ort);
    }
  });
});
