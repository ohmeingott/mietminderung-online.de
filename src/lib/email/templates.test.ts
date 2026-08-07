import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bestellbestaetigungEmail,
  nachfassEmail,
  sendungsmeldungEmail,
  widerrufBestaetigungEmail,
  widerrufMeldungEmail,
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

/**
 * Die Sendungsnummer in der Bestellbestätigung.
 *
 * Sie stand bisher nur in der Zustellmeldung, und die geht erst raus, wenn
 * eBrief die Zustellung meldet. Wer den Aufpreis für die Nachvollziehbarkeit
 * bezahlt hat, hatte damit ausgerechnet während der Tage nichts in der Hand,
 * an denen er nachsehen möchte.
 */
describe("bestellbestaetigungEmail mit Sendungsnummer", () => {
  const MIT_STAND = {
    ...BESTELLUNG,
    stand: {
      shipmentNumber: "PIN123456789DE",
      trackingUrl: "https://tracking.example/PIN123456789DE",
    },
  };

  function teile(mail: { html: string; text: string }): [string, string][] {
    return [
      ["html", mail.html],
      ["text", mail.text],
    ];
  }

  it("nennt Nummer und Verfolgungslink in beiden Teilen", () => {
    for (const [teil, inhalt] of teile(bestellbestaetigungEmail(MIT_STAND))) {
      assert.match(inhalt, /PIN123456789DE/, teil);
      assert.match(inhalt, /tracking\.example/, teil);
    }
  });

  it("sagt dazu, dass die Verfolgung erst später anläuft", () => {
    // Ohne diesen Satz klickt der Kunde am Bestelltag ins Leere und hält den
    // Versand womöglich für gescheitert — die Nummer ist beim Barcode nur
    // reserviert, erfasst ist die Sendung erst später.
    for (const [teil, inhalt] of teile(bestellbestaetigungEmail(MIT_STAND))) {
      assert.match(inhalt, /erst aktiv/, teil);
    }
  });

  it("hält die Nummer aus dem Rechnungsteil heraus", () => {
    // § 14 Abs. 4 UStG zählt Rechnungsangaben auf; eine Sendungsnummer gehört
    // nicht dazu und hat zwischen Netto und Gesamtpreis nichts zu suchen.
    const { html } = bestellbestaetigungEmail(MIT_STAND);
    const rechnungsteil = html.slice(0, html.indexOf("Wie es weitergeht"));
    assert.doesNotMatch(rechnungsteil, /PIN123456789DE/);
  });

  it("lässt den Block ganz weg, wenn eBrief noch nichts hat", () => {
    // Der einfache Brief bekommt nie eine Nummer, und beim Einschreiben kann
    // sie im Moment des Webhooks noch fehlen. Dann muss die Mail aussehen wie
    // vorher — nicht wie eine mit einer leeren Zeile darin.
    const ohne = bestellbestaetigungEmail(BESTELLUNG);
    const leer = bestellbestaetigungEmail({
      ...BESTELLUNG,
      stand: { shipmentNumber: null, trackingUrl: null },
    });
    assert.equal(leer.text, ohne.text);
    assert.equal(leer.html, ohne.html);
    assert.doesNotMatch(ohne.text, /Sendungsnummer/);
  });

  it("nennt keinen Link, wenn eBrief nur die Nummer liefert", () => {
    // Beide Felder sind einzeln optional. Eine Zeile "Sendungsverfolgung:"
    // ohne Ziel wäre schlechter als keine. Geprüft wird die Zeile und nicht
    // das Wort: Der Hinweissatz darunter enthält es ebenfalls, und der gehört
    // dorthin.
    const { text } = bestellbestaetigungEmail({
      ...BESTELLUNG,
      stand: { shipmentNumber: "PIN123456789DE", trackingUrl: null },
    });
    assert.match(text, /^Sendungsnummer: PIN123456789DE$/m);
    assert.doesNotMatch(text, /^Sendungsverfolgung:/m);
  });

  it("spricht nicht von einem Link, wenn keiner dabei ist", () => {
    // Ein Satz über einen Link, den die Mail nicht enthält, liest sich wie
    // ein zweiter Fehler.
    const { text } = bestellbestaetigungEmail({
      ...BESTELLUNG,
      stand: { shipmentNumber: "PIN123456789DE", trackingUrl: null },
    });
    assert.doesNotMatch(text, /\bLink\b/);
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

describe("widerrufBestaetigungEmail", () => {
  const ANGABEN = {
    email: "mieterin@beispiel.de",
    name: "Maria Musterfrau",
    auftragsnummer: "40123",
    anmerkung: "Bitte um Rückruf.",
    eingegangenAm: "04.08.2026, 14:00 MESZ",
  };

  it("gives back the content of the declaration, not just the receipt", () => {
    // § 356a Abs. 4 BGB: the confirmation carries "den Inhalt der
    // Widerrufserklärung sowie das Datum und die Uhrzeit ihres Eingangs".
    // Acknowledging receipt alone does not satisfy that — this mail is the
    // durable medium on which the consumer later has to be able to prove what
    // they declared.
    const mail = widerrufBestaetigungEmail(ANGABEN);
    for (const teil of beideTeile(mail)) {
      assert.match(teil, /Hiermit widerrufe ich/);
      assert.match(teil, /Postversand der Mängelanzeige/);
      assert.match(teil, /04\.08\.2026/);
      assert.match(teil, /14:00/);
      assert.match(teil, /Maria Musterfrau/);
      assert.match(teil, /40123/);
      assert.match(teil, /mieterin@beispiel\.de/);
      assert.match(teil, /Bitte um Rückruf/);
    }
  });

  it("copes when only the email address was given", () => {
    // A withdrawal must not fail on a missing order number, so the form only
    // requires the address. A line reading "Name:" with nothing behind it, or
    // a literal "undefined", is worse than a line saying nothing was given.
    const mail = widerrufBestaetigungEmail({
      email: "mieterin@beispiel.de",
      name: "",
      auftragsnummer: "",
      anmerkung: "",
      eingegangenAm: "04.08.2026, 14:00 MESZ",
    });
    for (const teil of beideTeile(mail)) {
      assert.doesNotMatch(teil, /undefined|null/);
      assert.match(teil, /nicht angegeben/);
    }
  });

  it("does not promise a refund it cannot make", () => {
    // Once the right has expired there is nothing to give back. A sentence
    // that leaves this open creates an expectation the operator cannot meet.
    const mail = widerrufBestaetigungEmail(ANGABEN);
    assert.match(mail.text, /§ 356 Absatz 5 Nummer 2 BGB/);
    assert.match(mail.text, /erloschen/i);
  });
});

describe("widerrufMeldungEmail", () => {
  it("carries everything the operator needs to act", () => {
    const mail = widerrufMeldungEmail({
      email: "mieterin@beispiel.de",
      name: "",
      auftragsnummer: "40123",
      anmerkung: "",
      eingegangenAm: "04.08.2026, 14:00 MESZ",
    });
    for (const teil of beideTeile(mail)) {
      assert.match(teil, /mieterin@beispiel\.de/);
      assert.match(teil, /40123/);
      assert.match(teil, /04\.08\.2026/);
    }
    assert.match(mail.subject, /Widerruf/);
  });

  it("says plainly what was not given", () => {
    // The form requires only an address, so most of these will be empty most
    // of the time. A bare "Name:" or a literal "undefined" in the operator's
    // copy is how a withdrawal gets mistaken for a malformed submission.
    const mail = widerrufMeldungEmail({
      email: "mieterin@beispiel.de",
      name: "",
      auftragsnummer: "",
      anmerkung: "",
      eingegangenAm: "04.08.2026, 14:00 MESZ",
    });
    for (const teil of beideTeile(mail)) {
      assert.doesNotMatch(teil, /undefined|null/);
      assert.match(teil, /nicht angegeben/);
      assert.match(teil, /Postversand der Mängelanzeige/);
    }
  });
});
