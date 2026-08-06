import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  nachfassEmail,
  sendungsmeldungEmail,
  widerrufBestaetigungEmail,
  widerrufMeldungEmail,
} from "./templates";

/**
 * The two follow-up mails.
 *
 * The order confirmation is guarded by scripts/check-bestellbestaetigung.ts,
 * which asserts what § 312f BGB obliges it to carry. These two owe nothing
 * statutory — what they owe is that they do not claim more than the eBrief
 * interface actually delivers, and that is what is asserted here.
 */

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
