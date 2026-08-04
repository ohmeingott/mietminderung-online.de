import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HERKUNFT, istFremd } from "./herkunft";

/**
 * This function helps decide whether a letter goes out. Its defining quirk is
 * that "I don't know" does NOT count as foreign — otherwise every job and
 * session created before the marker existed would strand, and this service is
 * live.
 */
describe("istFremd", () => {
  it("recognises another service's marker", () => {
    assert.equal(istFremd("widerspruch-krankengeld"), true);
  });

  it("lets our own marker through", () => {
    assert.equal(istFremd(HERKUNFT), false);
  });

  it("does not treat a missing marker as foreign", () => {
    // The case that matters most. Everything already in flight is unmarked,
    // and it is unproven whether eBrief returns the reference at all.
    assert.equal(istFremd(undefined), false);
    assert.equal(istFremd(null), false);
    assert.equal(istFremd(""), false);
  });

  it("takes the marker literally", () => {
    // No trimming, no case folding: whoever sets it sets it exactly. A near
    // match is a foreign one.
    assert.equal(istFremd(" mietminderung-online"), true);
    assert.equal(istFremd("Mietminderung-Online"), true);
  });

  it("keeps the marker stable", () => {
    // It sits in the Stripe metadata of live sessions and in the eBrief
    // attributes of existing jobs. Changing it makes both unreadable.
    assert.equal(HERKUNFT, "mietminderung-online");
  });
});
