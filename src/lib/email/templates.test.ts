import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bestellbestaetigungEmail,
  nachfassEmail,
  sendungsmeldungEmail,
} from "./templates";

/**
 * The three mails of the paid dispatch.
 *
 * What § 312f BGB obliges the order confirmation to carry is guarded by
 * scripts/check-bestellbestaetigung.ts; what is asserted here is the one thing
 * about it that has two correct answers — the VAT statement, which follows
 * STEUERMODUS and must be right in either mode. The two follow-up mails owe
 * nothing statutory: what they owe is that they do not claim more than the
 * eBrief interface actually delivers.
 */

/** A payment late on a German summer evening — 21:58 CEST is 19:58 UTC. */
const BESTELLUNG = {
  produktId: "einwurfEinschreiben",
  betragCent: 699,
  referenz: "40123",
  bestelltAm: new Date("2026-07-31T19:58:00Z"),
};

/** Renders the confirmation with STEUERMODUS set, then restores the env. */
function mailImModus(modus: string | undefined) {
  const vorher = process.env.STEUERMODUS;
  if (modus === undefined) delete process.env.STEUERMODUS;
  else process.env.STEUERMODUS = modus;
  try {
    return bestellbestaetigungEmail(BESTELLUNG);
  } finally {
    if (vorher === undefined) delete process.env.STEUERMODUS;
    else process.env.STEUERMODUS = vorher;
  }
}

/**
 * The confirmation in `modus`, as labelled parts.
 *
 * Both of them, always — a confirmation whose text/plain alternative is
 * missing the invoice is what a strict mail client shows the customer. The
 * label rides along so a failure names the part it came from.
 */
function bestaetigungTeile(modus: string): [string, string][] {
  const mail = mailImModus(modus);
  return [
    ["HTML-Teil", mail.html],
    ["Text-Teil", mail.text],
  ];
}

describe("bestellbestaetigungEmail im Kleinunternehmermodus", () => {
  it("nennt die Steuerbefreiung ausdrücklich", () => {
    // § 34a Satz 1 Nr. 5 UStDV, nach dem BMF-Schreiben vom 18.3.2025 auch auf
    // Kleinbetragsrechnungen.
    for (const [teil, inhalt] of bestaetigungTeile("kleinunternehmer")) {
      assert.match(
        inhalt,
        /Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher nicht ausgewiesen\./,
        teil,
      );
    }
  });

  it("weist keinen Steuerbetrag aus", () => {
    // Ein ausgewiesener Betrag wäre nach § 14c Abs. 1 UStG geschuldet, auch
    // wenn er nie vereinnahmt wurde.
    for (const [teil, inhalt] of bestaetigungTeile("kleinunternehmer")) {
      assert.doesNotMatch(inhalt, /19 %|MwSt|zzgl\.|Nettobetrag/i, teil);
    }
  });

  it("zeigt den gezahlten Betrag als Gesamtpreis", () => {
    for (const [teil, inhalt] of bestaetigungTeile("kleinunternehmer")) {
      assert.match(inhalt, /Gesamtpreis/, teil);
      assert.match(inhalt, /6,99/, teil);
    }
  });

  it("bleibt der Modus ohne gesetzte Variable", () => {
    // Der Live-Betrieb hängt daran: ohne STEUERMODUS keine Steueraussage.
    assert.equal(mailImModus(undefined).text, mailImModus("kleinunternehmer").text);
  });
});

describe("bestellbestaetigungEmail im Regelmodus", () => {
  it("weist Steuersatz und Steuerbetrag aus", () => {
    // § 14 Abs. 4 Nr. 8 UStG: der anzuwendende Steuersatz und der auf das
    // Entgelt entfallende Steuerbetrag. 6,99 € brutto = 5,87 € + 1,12 €.
    for (const [teil, inhalt] of bestaetigungTeile("regel")) {
      assert.match(inhalt, /Umsatzsteuer 19 %/, teil);
      assert.match(inhalt, /1,12/, teil);
    }
  });

  it("nennt das Entgelt, auf das sich die Steuer bezieht", () => {
    for (const [teil, inhalt] of bestaetigungTeile("regel")) {
      assert.match(inhalt, /Nettobetrag/, teil);
      assert.match(inhalt, /5,87/, teil);
    }
  });

  it("beruft sich nicht mehr auf § 19 UStG", () => {
    // Die Aussage wäre falsch, sobald Stripe die Steuer tatsächlich einzieht.
    for (const [teil, inhalt] of bestaetigungTeile("regel")) {
      assert.doesNotMatch(inhalt, /§ 19 UStG/, teil);
      assert.match(inhalt, /Im Gesamtpreis sind 19 % Umsatzsteuer enthalten\./, teil);
    }
  });

  it("lässt den gezahlten Gesamtpreis unverändert", () => {
    // tax_behavior ist "inclusive": der Katalogpreis bleibt der Endpreis, die
    // Steuer steckt darin. Der Kunde zahlt in beiden Modi dasselbe.
    for (const [teil, inhalt] of bestaetigungTeile("regel")) {
      assert.match(inhalt, /Gesamtpreis/, teil);
      assert.match(inhalt, /6,99/, teil);
    }
  });
});

const STAND = {
  shipmentNumber: "0100819941060737",
  trackingUrl: "https://sendungsstatus.pin-ag.de/tracking?sendung=0100819941060737",
  ereignisZeitpunkt: "30.06.2026 um 12:18 Uhr",
};

/** Both parts of a mail — a client showing text/plain must see it all too. */
function beideTeile(mail: { html: string; text: string }): string[] {
  return [mail.html, mail.text];
}

describe("sendungsmeldungEmail", () => {
  it("names shipment number, tracking link and time in both parts", () => {
    const mail = sendungsmeldungEmail({ referenz: "40123", stand: STAND });
    for (const teil of beideTeile(mail)) {
      assert.match(teil, /0100819941060737/);
      assert.match(teil, /sendungsstatus\.pin-ag\.de/);
      assert.match(teil, /30\.06\.2026/);
      assert.match(teil, /40123/);
    }
  });

  it("copes when eBrief filled in only some of it", () => {
    // A line reading "Sendungsnummer:" with nothing behind it, or worse a
    // literal "null", is worse than no line at all.
    const mail = sendungsmeldungEmail({
      referenz: "40123",
      stand: { shipmentNumber: null, trackingUrl: null, ereignisZeitpunkt: null },
    });
    for (const teil of beideTeile(mail)) {
      assert.doesNotMatch(teil, /null|undefined/);
      assert.match(teil, /zugestellt/i);
    }
  });

  it("does not speak of an Einlieferungsbeleg", () => {
    // There is none. eBrief returns a shipment number, a link and events; its
    // only document is a PNG of the letter with the address marked — an
    // artefact for us to check against, not evidence for the tenant.
    const mail = sendungsmeldungEmail({ referenz: "40123", stand: STAND });
    for (const teil of [...beideTeile(mail), mail.subject]) {
      assert.doesNotMatch(teil, /Einlieferungsbeleg/i);
    }
    assert.doesNotMatch(mail.subject, /Beleg|Nachweis/i);
  });

  it("promises no proof of receipt", () => {
    // BAG 2 AZR 68/24 held the combination of Einlieferungsbeleg and shipment
    // status insufficient. This mail is the shipment status, so it must not be
    // sold as the thing that case rejected.
    const mail = sendungsmeldungEmail({ referenz: "40123", stand: STAND });
    for (const teil of beideTeile(mail)) {
      assert.doesNotMatch(teil, /Zugangsnachweis|rechtssicher|gerichtsfest|beweist/i);
      assert.match(teil, /kann kein Postprodukt erbringen/);
    }
  });

  it("says what the delivery means for the deadline", () => {
    const mail = sendungsmeldungEmail({ referenz: "40123", stand: STAND });
    for (const teil of beideTeile(mail)) {
      assert.match(teil, /Frist/);
    }
  });
});

describe("nachfassEmail", () => {
  it("names the order and both directions the case can have taken", () => {
    const mail = nachfassEmail({ referenz: "40123" });
    for (const teil of beideTeile(mail)) {
      assert.match(teil, /40123/);
      assert.match(teil, /beseitigt/i);
      assert.match(teil, /§ 536a BGB/);
    }
  });

  it("warns against reducing too much", () => {
    // The site's own caution: two months of arrears are grounds for termination
    // without notice, and this mail is the one that arrives after the tenant
    // has had a fortnight to start reducing.
    const mail = nachfassEmail({ referenz: "40123" });
    for (const teil of beideTeile(mail)) {
      assert.match(teil, /§ 543 Abs\. 2 Nr\. 3 BGB/);
    }
  });

  it("points outwards for advice", () => {
    // We do not advise. Anyone who needs help should know where to go, which is
    // also the cleanest line to draw under the RDG.
    const mail = nachfassEmail({ referenz: "40123" });
    for (const teil of beideTeile(mail)) {
      assert.match(teil, /Mieterverein|Fachanwält/);
    }
  });

  it("says why it arrived and that nothing further follows", () => {
    // An unexpected mail two weeks after the order has the shape of a phishing
    // attempt unless it says why it exists.
    const mail = nachfassEmail({ referenz: "40123" });
    for (const teil of beideTeile(mail)) {
      assert.match(teil, /letzte E-Mail/);
    }
  });
});
