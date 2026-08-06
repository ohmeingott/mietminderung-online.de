import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findeUnterschriftsluecke } from "./unterschriftsstelle";

/**
 * This function decides where the signature lands, in both PDFs. The letter
 * body below is shaped the way generateBriefText emits it: the closing, the
 * blank block kept free for the signature, then the typed name.
 */
const ZEILEN = [
  "Betreff: Mängelanzeige für die Wohnung Beispielweg 12, 50667 Köln",
  "",
  "Sehr geehrte Damen und Herren,",
  "",
  "hiermit zeige ich Ihnen an, dass sich in der von mir angemieteten Wohnung folgende Mängel befinden:",
  "",
  "Mit freundlichen Grüßen",
  "",
  "",
  "",
  "",
  "Maria Schmitz",
];

describe("findeUnterschriftsluecke", () => {
  it("finds the blank lines between the closing and the name", () => {
    assert.equal(findeUnterschriftsluecke(ZEILEN), 7);
    assert.equal(ZEILEN[6], "Mit freundlichen Grüßen");
    assert.equal(ZEILEN[7], "");
  });

  it("takes the LAST blank block, not the first", () => {
    // A letter is mostly blank blocks. Picking any but the one before the last
    // written line would put the signature in the middle of the text.
    assert.ok(findeUnterschriftsluecke(ZEILEN) > 5);
  });

  it("reports -1 when nothing separates the last two lines", () => {
    // The user is free to rewrite the letter, and a rewritten one may carry no
    // gap at all. The callers then fall back to placing the image at the end.
    assert.equal(findeUnterschriftsluecke(["Eine Zeile", "Noch eine"]), -1);
  });

  it("reports -1 for an empty or single-line text", () => {
    assert.equal(findeUnterschriftsluecke([]), -1);
    assert.equal(findeUnterschriftsluecke(["Nur eine Zeile"]), -1);
  });

  it("reports -1 when there is no written line at all", () => {
    assert.equal(findeUnterschriftsluecke(["", "", ""]), -1);
  });

  it("ignores trailing blank lines when locating the last written line", () => {
    // splitTextToSize and hand-editing both leave trailing newlines behind.
    // Anchoring on them would find the gap after the name instead of before.
    const zeilen = ["Mit freundlichen Grüßen", "", "", "Maria Schmitz", "", ""];
    assert.equal(findeUnterschriftsluecke(zeilen), 1);
  });

  it("treats a line of spaces as blank", () => {
    assert.equal(findeUnterschriftsluecke(["Gruß", "   ", "\t", "Name"]), 1);
  });
});
