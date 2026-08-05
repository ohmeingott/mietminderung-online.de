import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { EbriefJobDetails } from "./ebrief/types";
import {
  NACHFASS_TAGE,
  formatiereEreignisZeitpunkt,
  hatSendungsverfolgung,
  nachfassFaellig,
  sendungsstand,
} from "./versandNachlauf";

function job(dokumente: EbriefJobDetails["Documents"]): EbriefJobDetails {
  return { Id: 4711, Documents: dokumente };
}

describe("sendungsstand", () => {
  it("reads number, link and event out of the document", () => {
    const stand = sendungsstand(
      job([
        {
          Id: 1,
          ShipmentNumber: "0100819941060737",
          TrackingUrl: "https://sendungsstatus.pin-ag.de/tracking?sendung=0100819941060737",
          LastEvent: "DOCUMENT_DELIVERED",
          TimestampLastEvent: "2026-06-30T12:18:42.7732569+02:00",
        },
      ])
    );
    assert.equal(stand.shipmentNumber, "0100819941060737");
    assert.match(stand.trackingUrl ?? "", /pin-ag\.de/);
    assert.equal(stand.letztesEreignis, "DOCUMENT_DELIVERED");
    assert.equal(stand.zugestellt, true);
    assert.equal(stand.unzustellbar, false);
  });

  it("does not take another event for a delivery", () => {
    const stand = sendungsstand(job([{ Id: 1, LastEvent: "DOCUMENT_IN_DELIVERY" }]));
    assert.equal(stand.zugestellt, false);
  });

  it("does not take an unknown event for a delivery", () => {
    // Listed positively, for the same reason as the job statuses: an email
    // claiming a delivery that did not happen is worse than one that arrives a
    // day late. This is the mail a tenant may lean on in a dispute.
    const stand = sendungsstand(job([{ Id: 1, LastEvent: "DOCUMENT_SOMETHING_NEW" }]));
    assert.equal(stand.zugestellt, false);
    assert.equal(stand.unzustellbar, false);
  });

  it("recognises a letter that came back", () => {
    // DOCUMENT_SENT_BACK means the landlord never received it, so the deadline
    // in the letter never started running. Nobody is emailed about it — the
    // run logs it and a human decides. See the route.
    const stand = sendungsstand(job([{ Id: 1, LastEvent: "DOCUMENT_SENT_BACK" }]));
    assert.equal(stand.unzustellbar, true);
    assert.equal(stand.zugestellt, false);
  });

  it("copes without documents", () => {
    const leer = sendungsstand(job([]));
    assert.equal(leer.shipmentNumber, null);
    assert.equal(leer.zugestellt, false);
    assert.equal(sendungsstand(job(null)).zugestellt, false);
    assert.equal(sendungsstand({ Id: 4711 }).zugestellt, false);
  });

  it("takes the document with a shipment number, not simply the first", () => {
    const stand = sendungsstand(
      job([
        { Id: 1 },
        {
          Id: 2,
          ShipmentNumber: "0100819941060751",
          LastEvent: "DOCUMENT_DELIVERED",
        },
      ])
    );
    assert.equal(stand.shipmentNumber, "0100819941060751");
  });

  it("counts empty strings as missing", () => {
    // A mail reading "Sendungsnummer:" with nothing behind it is worse than one
    // without the line.
    const stand = sendungsstand(
      job([{ Id: 1, ShipmentNumber: "   ", TrackingUrl: "", LastEvent: "  " }])
    );
    assert.equal(stand.shipmentNumber, null);
    assert.equal(stand.trackingUrl, null);
    assert.equal(stand.letztesEreignis, null);
  });
});

describe("hatSendungsverfolgung", () => {
  it("is true for the tracked product", () => {
    assert.equal(hatSendungsverfolgung("einwurfEinschreiben"), true);
  });

  it("is false for the plain letter", () => {
    // The plain letter carries IsTracking: "false", so eBrief reports no
    // shipment number and no delivery event for it. There is nothing to report
    // and no reason to ask eBrief about it every night.
    assert.equal(hatSendungsverfolgung("brief"), false);
  });

  it("is false for anything that is not a product", () => {
    assert.equal(hatSendungsverfolgung(undefined), false);
    assert.equal(hatSendungsverfolgung(""), false);
    assert.equal(hatSendungsverfolgung("einschreiben"), false);
  });
});

describe("formatiereEreignisZeitpunkt", () => {
  it("shows a timestamp with an offset in German local time", () => {
    // What the staging capture actually contains, seven fractional digits and
    // all: "2026-06-30T12:18:42.7732569+02:00".
    assert.equal(
      formatiereEreignisZeitpunkt("2026-06-30T12:18:42.7732569+02:00"),
      "30.06.2026 um 12:18 Uhr"
    );
  });

  it("converts UTC into German local time", () => {
    assert.equal(
      formatiereEreignisZeitpunkt("2026-08-06T09:14:00Z"),
      "06.08.2026 um 11:14 Uhr"
    );
  });

  it("passes a timestamp without a zone through unchanged", () => {
    // Without an offset the value is ambiguous, and JavaScript would read it as
    // the server's local time — which on Vercel is UTC, so a delivery at 09:14
    // German time would be reported as 09:14 having happened at 11:14. Better
    // an unlovely string than a wrong hour in the one mail about timing.
    const roh = "2026-08-06T09:14:00";
    assert.equal(formatiereEreignisZeitpunkt(roh), roh);
  });

  it("passes something unparseable through unchanged", () => {
    assert.equal(formatiereEreignisZeitpunkt("demnächst"), "demnächst");
  });

  it("stays null when there is nothing to format", () => {
    assert.equal(formatiereEreignisZeitpunkt(null), null);
  });
});

describe("nachfassFaellig", () => {
  const bestellt = new Date(2026, 7, 4);

  it("is not due on the day of the order", () => {
    assert.equal(nachfassFaellig(bestellt, new Date(2026, 7, 4)), false);
  });

  it("is not due one day before the deadline", () => {
    const kurzDavor = new Date(2026, 7, 4 + NACHFASS_TAGE - 1);
    assert.equal(nachfassFaellig(bestellt, kurzDavor), false);
  });

  it("is due after the deadline", () => {
    const danach = new Date(2026, 7, 4 + NACHFASS_TAGE);
    assert.equal(nachfassFaellig(bestellt, danach), true);
  });

  it("waits for the deadline the letter itself sets", () => {
    // FRIST_STANDARD in src/lib/brief/frist.ts is fourteen days, and the
    // deadline options are 3/7/14/21. Reminding at fourteen days after the
    // order puts the mail at the end of the ordinary deadline — the point at
    // which "has anything happened?" is a question worth asking — instead of
    // while the tenant is still waiting for the post.
    assert.equal(NACHFASS_TAGE, 14);
  });
});
