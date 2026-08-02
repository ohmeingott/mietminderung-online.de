import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

/**
 * Guards the shape of the favicon against Google's SERP requirements.
 *
 * This is worth a test because the failure is silent and slow: the site keeps
 * building and every browser keeps showing the icon in its tab, while Google
 * quietly drops it from the results and shows the generic globe instead. The
 * previous container carried a 256px entry, which is what caused exactly that.
 */

const ROOT = join(import.meta.dirname, "..", "..");

/** The entry sizes declared in the .ico's directory, in file order. */
function icoEntrySizes(file: Buffer): number[] {
  assert.equal(file.readUInt16LE(0), 0, "ICONDIR reserved field must be 0");
  assert.equal(file.readUInt16LE(2), 1, "ICONDIR type must be 1 (icon)");

  const count = file.readUInt16LE(4);
  assert.ok(count > 0, "the container declares no entries");

  return Array.from({ length: count }, (_, i) => {
    const record = 6 + i * 16;
    const width = file.readUInt8(record);
    const height = file.readUInt8(record + 1);
    // A stored 0 means 256 - the field is one byte and 256 does not fit.
    assert.equal(width, height, `entry ${i} is not square`);

    const length = file.readUInt32LE(record + 8);
    const offset = file.readUInt32LE(record + 12);
    assert.ok(offset + length <= file.length, `entry ${i} runs past the end of the file`);

    return width || 256;
  });
}

describe("favicon.ico", () => {
  const ico = readFileSync(join(ROOT, "public", "favicon.ico"));

  it("has the entries layout.tsx declares", () => {
    // Kept in step with the `sizes` attribute in src/app/layout.tsx by hand;
    // both are written by scripts/generate-brand-assets.ts and this file.
    assert.deepEqual(icoEntrySizes(ico), [16, 32, 48]);
  });

  it("tops out at a size Google will accept", () => {
    /*
     * Google only displays a favicon that is square and a multiple of 48px, and
     * it takes the largest entry in the container. Anything above 48 here has to
     * be a multiple of 48 too, so 64, 128 and 256 are all disqualifying.
     */
    const largest = Math.max(...icoEntrySizes(ico));
    assert.equal(largest % 48, 0, `largest entry is ${largest}px, not a multiple of 48`);
  });
});
