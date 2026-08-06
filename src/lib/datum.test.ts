// Pin the process to a zone that is NOT the one under test, before anything
// reads a date. Node re-reads TZ on assignment, so this decides what
// `toLocaleString` falls back to when no `timeZone` is passed.
//
// Without this the suite is a no-op on the machines it runs on most: on a
// developer's machine in Germany the fallback zone IS Europe/Berlin, so
// deleting `timeZone` from formatiereZeitpunkt — the regression these tests
// exist to catch — produces identical output and every assertion still
// passes. Under UTC the two diverge by an hour or two, and the tests bite.
process.env.TZ = "UTC";

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatiereZeitpunkt } from "./datum";

/**
 * These tests check exactly one thing: that a point in time appears in German
 * local time and not in the server's.
 *
 * The fixed UTC instants only prove anything once the process is not itself
 * in Berlin time, which is what the `TZ` assignment above is for. Together
 * they fail wherever the suite runs if the explicit zone is ever removed.
 */
describe("formatiereZeitpunkt", () => {
  it("converts summer time to German local time", () => {
    // 4.8.2026, 12:00 UTC → 14:00 in Berlin (CEST, UTC+2).
    const ausgabe = formatiereZeitpunkt(new Date("2026-08-04T12:00:00Z"));
    assert.match(ausgabe, /04\.08\.2026/);
    assert.match(ausgabe, /14:00/);
  });

  it("converts winter time to German local time", () => {
    // 15.1.2026, 12:00 UTC → 13:00 in Berlin (CET, UTC+1).
    const ausgabe = formatiereZeitpunkt(new Date("2026-01-15T12:00:00Z"));
    assert.match(ausgabe, /15\.01\.2026/);
    assert.match(ausgabe, /13:00/);
  });

  it("takes the German calendar day, not the server's", () => {
    // 4.8.2026, 22:30 UTC is already 5.8. at 00:30 in Berlin.
    const ausgabe = formatiereZeitpunkt(new Date("2026-08-04T22:30:00Z"));
    assert.match(ausgabe, /05\.08\.2026/);
    assert.match(ausgabe, /00:30/);
  });

  it("names the time zone, so the time can be checked", () => {
    // § 356a Abs. 4 BGB requires the time of receipt. A time without a zone is
    // only half the answer at a deadline.
    const ausgabe = formatiereZeitpunkt(new Date("2026-08-04T12:00:00Z"));
    assert.match(ausgabe, /MESZ|MEZ|GMT|UTC/);
  });
});
