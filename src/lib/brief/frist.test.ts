import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mangelKategorien } from "../../data/maengel";
import { mangelSeo } from "../../data/seoContent";
import {
  FRIST_OPTIONEN,
  alsIsoDatum,
  formatiereDatum,
  fristDatum,
  fristVorschlag,
  tageZwischen,
} from "./frist";

/** Pulls a defect out of the catalogue by id, so the tests use real data. */
function mangel(id: string) {
  for (const kategorie of mangelKategorien) {
    const treffer = kategorie.maengel.find((m) => m.id === id);
    if (treffer) return treffer;
  }
  throw new Error(`Unbekannter Mangel im Test: ${id}`);
}

describe("fristVorschlag", () => {
  it("snaps an urgent defect onto the shortest option", () => {
    // heizung_total carries fristTage: 3, dringend: true.
    const { tage, dringend, treiber } = fristVorschlag([mangel("heizung_total")]);
    assert.equal(tage, 3);
    assert.equal(dringend, true);
    assert.equal(treiber?.id, "heizung_total");
  });

  it("gives an ordinary defect the ordinary deadline", () => {
    const { tage, dringend } = fristVorschlag([mangel("aufzug_defekt")]);
    assert.equal(tage, 14);
    assert.equal(dringend, false);
  });

  it("takes the shortest deadline when several defects are selected", () => {
    // One letter carries one deadline, so the most urgent defect sets it.
    const { tage, treiber } = fristVorschlag([
      mangel("aufzug_defekt"), // 14
      mangel("heizung_total"), // 3
    ]);
    assert.equal(tage, 3);
    assert.equal(treiber?.id, "heizung_total");
  });

  it("flags urgency even when the urgent defect is not the driver", () => {
    const { dringend } = fristVorschlag([mangel("heizung_teilweise")]);
    assert.equal(dringend, true);
  });

  it("never proposes a deadline shorter than the shortest option", () => {
    // Some catalogue entries carry a single day, which no posted letter can
    // meet - the post alone takes longer than that.
    const einTag = Object.entries(mangelSeo).find(([, seo]) => seo.fristTage === 1);
    assert.ok(einTag, "Erwartet mindestens einen Mangel mit fristTage: 1");
    const { tage } = fristVorschlag([mangel(einTag[0])]);
    assert.equal(tage, FRIST_OPTIONEN[0]);
  });

  it("falls back to fourteen days for an empty selection", () => {
    const { tage, treiber, dringend } = fristVorschlag([]);
    assert.equal(tage, 14);
    assert.equal(treiber, null);
    assert.equal(dringend, false);
  });

  it("ignores a defect that carries no catalogue entry", () => {
    const erfunden = {
      id: "gibt_es_nicht",
      label: "Erfunden",
      minderung_min: 1,
      minderung_max: 2,
      minderung_typical: 1,
      description: "",
    };
    const { tage } = fristVorschlag([erfunden, mangel("heizung_total")]);
    assert.equal(tage, 3);
  });

  it("only ever proposes an offered option", () => {
    for (const kategorie of mangelKategorien) {
      for (const m of kategorie.maengel) {
        const { tage } = fristVorschlag([m]);
        assert.ok(
          (FRIST_OPTIONEN as readonly number[]).includes(tage),
          `${m.id} ergab ${tage}, was keine angebotene Option ist`
        );
      }
    }
  });
});

describe("fristDatum", () => {
  it("adds whole days", () => {
    assert.equal(formatiereDatum(fristDatum(new Date(2026, 10, 17), 3)), "20.11.2026");
  });

  it("rolls over a month boundary", () => {
    assert.equal(formatiereDatum(fristDatum(new Date(2026, 10, 28), 7)), "05.12.2026");
  });

  it("rolls over a year boundary", () => {
    assert.equal(formatiereDatum(fristDatum(new Date(2026, 11, 30), 3)), "02.01.2027");
  });

  it("handles a leap day", () => {
    assert.equal(formatiereDatum(fristDatum(new Date(2028, 1, 27), 3)), "01.03.2028");
  });

  it("survives the end of German summer time", () => {
    // 25.10.2026 is the changeover. A UTC-based implementation lands a day out.
    assert.equal(formatiereDatum(fristDatum(new Date(2026, 9, 24), 3)), "27.10.2026");
  });

  it("survives the start of German summer time", () => {
    assert.equal(formatiereDatum(fristDatum(new Date(2026, 2, 28), 3)), "31.03.2026");
  });

  it("does not mutate the date it was given", () => {
    const ab = new Date(2026, 10, 17);
    fristDatum(ab, 14);
    assert.equal(ab.getDate(), 17);
  });
});

describe("alsIsoDatum", () => {
  it("pads month and day", () => {
    assert.equal(alsIsoDatum(new Date(2026, 0, 5)), "2026-01-05");
  });

  it("stays on the local day rather than drifting to UTC", () => {
    // toISOString() on a local midnight east of Greenwich yields the day before.
    assert.equal(alsIsoDatum(new Date(2026, 6, 1)), "2026-07-01");
  });
});

describe("tageZwischen", () => {
  it("counts whole days across a DST change", () => {
    assert.equal(tageZwischen(new Date(2026, 9, 24), new Date(2026, 9, 27)), 3);
  });

  it("counts zero for the same day", () => {
    assert.equal(tageZwischen(new Date(2026, 9, 24, 8), new Date(2026, 9, 24, 23)), 0);
  });
});

describe("the catalogue itself", () => {
  it("gives every defect a usable deadline", () => {
    // mangelIndex.ts throws at build time for a *missing* entry, but a
    // fristTage of 0 would ship a letter demanding repair "by today".
    for (const kategorie of mangelKategorien) {
      for (const m of kategorie.maengel) {
        const seo = mangelSeo[m.id];
        assert.ok(seo, `${m.id} hat keinen SEO-Eintrag`);
        assert.ok(
          Number.isInteger(seo.fristTage) && seo.fristTage >= 1 && seo.fristTage <= 30,
          `${m.id} hat fristTage: ${seo.fristTage}`
        );
      }
    }
  });
});
