import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cronAutorisiert } from "./cronAuth";

/**
 * The gate in front of both cron routes. One of them deletes jobs at eBrief,
 * the other sends email to customers — neither may be triggerable by anyone who
 * merely knows the URL.
 */
function anfrage(header?: string): Request {
  return new Request("https://mietminderung-online.de/api/cron/versand-nachlauf", {
    headers: header === undefined ? {} : { authorization: header },
  });
}

describe("cronAutorisiert", () => {
  it("lets the header Vercel Cron actually sends through", () => {
    assert.equal(cronAutorisiert(anfrage("Bearer geheim"), "geheim"), true);
  });

  it("refuses a wrong secret of the same length", () => {
    assert.equal(cronAutorisiert(anfrage("Bearer geheiX"), "geheim"), false);
  });

  it("refuses a secret of a different length", () => {
    // timingSafeEqual throws on differing lengths, so this path has to be
    // handled rather than left to blow up inside the route.
    assert.equal(cronAutorisiert(anfrage("Bearer geheimer"), "geheim"), false);
    assert.equal(cronAutorisiert(anfrage("Bearer geh"), "geheim"), false);
  });

  it("refuses a missing or malformed header", () => {
    assert.equal(cronAutorisiert(anfrage(), "geheim"), false);
    assert.equal(cronAutorisiert(anfrage(""), "geheim"), false);
    assert.equal(cronAutorisiert(anfrage("geheim"), "geheim"), false);
    assert.equal(cronAutorisiert(anfrage("Basic geheim"), "geheim"), false);
  });

  it("never waves anything through for an empty secret", () => {
    // Callers check for the secret first, but a gate that authorises everything
    // when unconfigured is the one failure mode worth ruling out twice.
    assert.equal(cronAutorisiert(anfrage("Bearer "), ""), false);
    assert.equal(cronAutorisiert(anfrage(), ""), false);
  });
});
