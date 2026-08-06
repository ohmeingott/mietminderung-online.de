import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { RATGEBER_SLUGS, alleUebersetztenPfade, lokalerPfad } from "./pfade";
import { localeHref, splitLocalePath, DEFAULT_LOCALE } from "./routing";
import { locales } from "./translations";

/**
 * The round trip is the property that matters. Every link the site renders
 * goes through `localeHref`, every request comes back through
 * `splitLocalePath`, and a page is only reachable if the two agree. A slug
 * that translates one way but not back is a 404 that no type checks.
 */
describe("localeHref / splitLocalePath round trip", () => {
  const pfade = [
    "/",
    "/faq",
    "/impressum",
    "/datenschutz",
    "/nutzungsbedingungen",
    "/widerruf",
    ...alleUebersetztenPfade(),
  ];

  for (const { code } of locales) {
    for (const pfad of pfade) {
      it(`${code}: ${pfad}`, () => {
        const url = localeHref(code, pfad);
        const { locale, basePath } = splitLocalePath(url);

        assert.equal(locale, code);
        assert.equal(basePath, pfad);
      });
    }
  }
});

describe("localeHref", () => {
  it("leaves German paths untouched", () => {
    // The property that made the locale-prefix change safe in the first
    // place: not a single German URL moves.
    assert.equal(localeHref("de", "/"), "/");
    assert.equal(localeHref("de", "/ratgeber"), "/ratgeber");
    assert.equal(
      localeHref("de", "/ratgeber/maengelanzeige-schreiben"),
      "/ratgeber/maengelanzeige-schreiben",
    );
  });

  it("translates segment and slug together", () => {
    assert.equal(
      localeHref("tr", "/ratgeber/maengelanzeige-schreiben"),
      "/tr/rehber/ayip-bildirimi-yazma",
    );
    assert.equal(localeHref("tr", "/ratgeber"), "/tr/rehber");
  });

  it("keeps the German path for pages whose URL is not translated", () => {
    // The FAQ and the legal texts exist under every prefix but keep their
    // German path. Translating those would be a second, pointless mapping.
    assert.equal(localeHref("tr", "/faq"), "/tr/faq");
    assert.equal(localeHref("tr", "/impressum"), "/tr/impressum");
  });

  it("falls back to the language's homepage for untranslated pages", () => {
    // Someone on a German-only defect page who picks Turkish gets the Turkish
    // homepage, not a prefixed URL that does not exist.
    assert.equal(localeHref("tr", "/mietminderung/heizung"), "/tr");
    assert.equal(localeHref("tr", "/versand"), "/tr");
  });
});

describe("splitLocalePath", () => {
  it("treats unprefixed paths as German", () => {
    assert.deepEqual(splitLocalePath("/ratgeber"), {
      locale: DEFAULT_LOCALE,
      basePath: "/ratgeber",
    });
  });

  it("maps a translated URL back to its German path", () => {
    assert.deepEqual(splitLocalePath("/ru/рекомендации"), {
      locale: "ru",
      basePath: "/ratgeber",
    });
  });

  it("passes through a prefixed path it has no mapping for", () => {
    // This is what keeps /tr/faq and /tr/impressum working without an entry
    // in pfade.ts, and what makes an unknown path 404 as itself rather than
    // silently resolving to something else.
    assert.deepEqual(splitLocalePath("/tr/faq"), {
      locale: "tr",
      basePath: "/faq",
    });
    assert.deepEqual(splitLocalePath("/tr/gibt-es-nicht"), {
      locale: "tr",
      basePath: "/gibt-es-nicht",
    });
  });
});

describe("slug table", () => {
  it("covers every locale for every guide", () => {
    for (const [deutsch, slugs] of Object.entries(RATGEBER_SLUGS)) {
      for (const { code } of locales) {
        const slug = (slugs as Record<string, string>)[code];
        assert.ok(slug, `${deutsch} is missing a ${code} slug`);
        assert.ok(
          !slug.includes("/") && !slug.includes(" "),
          `${deutsch} has an unusable ${code} slug: "${slug}"`,
        );
      }
    }
  });

  it("produces a distinct URL per guide in every locale", () => {
    // A duplicate would make one of the two guides unreachable. pfade.ts
    // throws at module load, so this test also proves that guard is wired up.
    for (const { code } of locales) {
      const urls = alleUebersetztenPfade().map((p) => lokalerPfad(code, p));
      assert.equal(new Set(urls).size, urls.length, `duplicate ${code} URL`);
    }
  });
});
