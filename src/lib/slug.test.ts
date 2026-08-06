import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ratgeberArtikel } from "@/data/ratgeber";
import { slugify } from "./slug";

/**
 * These slugs are anchor ids on the guide pages: the table of contents links
 * to them and readers deep-link into them. Two properties matter — the German
 * ones must never change, and every language must get a usable id at all.
 */
describe("slugify", () => {
  it("keeps the German transliteration it has always had", () => {
    // Changing any of these would break existing deep links into the guides.
    assert.equal(slugify("Mängelanzeige schreiben"), "maengelanzeige-schreiben");
    assert.equal(slugify("Größe & Maß"), "groesse-mass");
    assert.equal(slugify("Fehler 10: Selbst beseitigen"), "fehler-10-selbst-beseitigen");
  });

  it("produces a non-empty id for every German heading", () => {
    for (const artikel of ratgeberArtikel) {
      for (const section of artikel.sections) {
        const id = slugify(section.heading);
        assert.ok(id, `${artikel.slug}: "${section.heading}" slugified to nothing`);
      }
    }
  });

  it("gives German articles distinct ids per article", () => {
    for (const artikel of ratgeberArtikel) {
      const ids = artikel.sections.map((s) => slugify(s.heading));
      assert.equal(new Set(ids).size, ids.length, `${artikel.slug} has duplicate anchors`);
    }
  });

  it("keeps non-Latin scripts instead of dropping them", () => {
    // The bug this guards against: with an ASCII-only character class every
    // Cyrillic heading became "", so a whole page shared one empty anchor.
    assert.equal(
      slugify("Почему уведомление незаменимо"),
      "почему-уведомление-незаменимо",
    );
    assert.equal(slugify("Розрахунок зниження"), "розрахунок-зниження");

    // Arabic keeps its letters; NFD drops the combining hamza, so "الإخطار"
    // normalises to "الاخطار". What matters is that the word stays one token
    // — before the fix the mark became a separator and split it.
    assert.equal(slugify("لماذا الإخطار ضروري"), "لماذا-الاخطار-ضروري");
  });

  it("still strips punctuation and collapses separators", () => {
    assert.equal(slugify("§ 536c BGB: Frist!"), "536c-bgb-frist");
    assert.equal(slugify("  --- a  b ---  "), "a-b");
  });

  it("returns an empty string only for input with no letters or digits", () => {
    assert.equal(slugify("§§ —— !?"), "");
    assert.equal(slugify(""), "");
  });
});
