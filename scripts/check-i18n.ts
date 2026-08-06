/**
 * Verifies that every locale carries the full set of UI and content keys.
 * Run with `npm run check:i18n` - exits non-zero when something is missing.
 */
import { translations, locales, type Locale } from "../src/i18n/translations";
import {
  contentTranslations,
  faqAnswerKey,
  faqQuestionKey,
  katKey,
  mangelDescKey,
  mangelLabelKey,
} from "../src/i18n/content";
import { mangelKategorien, faqs } from "../src/data/maengel";
import { getRatgeberBySlug } from "../src/data/ratgeber";
import { RATGEBER_SLUGS, lokalerPfad } from "../src/i18n/pfade";
import {
  alleRatgeberSlugs,
  ratgeberAbdeckung,
  ratgeberSlugsFuer,
  ratgeberUebersetzung,
} from "../src/i18n/ratgeber";
import type { RatgeberSectionText } from "../src/i18n/ratgeber/typen";
import { slugify } from "../src/lib/slug";

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.error(`  ✗ ${msg}`);
};

// --- UI strings --------------------------------------------------------------
const deKeys = Object.keys(translations.de);
console.log(`UI keys (de): ${deKeys.length}\n`);

for (const l of locales) {
  if (l.code === "de") continue;
  const dict = translations[l.code];
  const missing = deKeys.filter((k) => !(k in dict));
  const extra = Object.keys(dict).filter((k) => !deKeys.includes(k));
  console.log(`${l.code} - UI: ${Object.keys(dict).length} keys`);
  if (missing.length) fail(`${l.code}: missing UI keys - ${missing.join(", ")}`);
  if (extra.length) fail(`${l.code}: unknown UI keys - ${extra.join(", ")}`);
}

// --- Content strings (defect catalogue + FAQ) --------------------------------
const expectedContentKeys: string[] = [];
for (const kat of mangelKategorien) {
  expectedContentKeys.push(katKey(kat.id));
  for (const m of kat.maengel) {
    expectedContentKeys.push(mangelLabelKey(m.id), mangelDescKey(m.id));
  }
}
faqs.forEach((_, i) => {
  expectedContentKeys.push(faqQuestionKey(i), faqAnswerKey(i));
});

console.log(`\nContent keys expected: ${expectedContentKeys.length}\n`);

for (const l of locales) {
  if (l.code === "de") continue; // German lives in src/data/maengel.ts
  const dict = contentTranslations[l.code as Locale];
  if (!dict) {
    fail(`${l.code}: no content translation file`);
    continue;
  }
  const missing = expectedContentKeys.filter((k) => !(k in dict));
  const extra = Object.keys(dict).filter((k) => !expectedContentKeys.includes(k));
  console.log(`${l.code} - content: ${Object.keys(dict).length} keys`);
  if (missing.length) fail(`${l.code}: missing content keys - ${missing.join(", ")}`);
  if (extra.length) fail(`${l.code}: stale content keys - ${extra.join(", ")}`);
}

// --- Guides: structure, not just presence -----------------------------------
/**
 * The guides are long-form legal prose, so the risk is not a missing key but a
 * drifting one: a paragraph added to the German source and not to a
 * translation shifts everything after it. Comparing the shape catches that,
 * which flat key dictionaries never could.
 */
const deutscheSlugs = alleRatgeberSlugs();
console.log(`\nRatgeber articles (de): ${deutscheSlugs.length}\n`);

// Every German article needs a routing entry, or it can never be published.
for (const artikel of deutscheSlugs) {
  if (!(artikel in RATGEBER_SLUGS)) {
    fail(`ratgeber: "${artikel}" has no slug entry in src/i18n/pfade.ts`);
  }
}

function laengen(section: RatgeberSectionText) {
  return {
    paragraphs: section.paragraphs?.length ?? 0,
    bullets: section.bullets?.length ?? 0,
    ordered: section.ordered?.length ?? 0,
    note: section.note ? 1 : 0,
    code: section.code ? 1 : 0,
    tabelleKopf: section.table?.head.length ?? 0,
    tabelleZeilen: section.table?.rows.length ?? 0,
  };
}

for (const l of locales) {
  if (l.code === "de") continue;

  const { vorhanden, gesamt } = ratgeberAbdeckung(l.code as Locale);
  const stand = vorhanden === gesamt ? "complete" : `${vorhanden}/${gesamt}`;
  console.log(`${l.code} - ratgeber: ${stand}`);

  for (const slug of ratgeberSlugsFuer(l.code as Locale)) {
    const quelle = getRatgeberBySlug(slug);
    const ziel = ratgeberUebersetzung(l.code as Locale, slug);
    if (!quelle || !ziel) continue;

    const wo = `${l.code}/${slug}`;

    if (ziel.sections.length !== quelle.sections.length) {
      fail(
        `${wo}: ${ziel.sections.length} sections, German source has ${quelle.sections.length}`,
      );
      continue;
    }
    if (ziel.faqs.length !== quelle.faqs.length) {
      fail(
        `${wo}: ${ziel.faqs.length} FAQ entries, German source has ${quelle.faqs.length}`,
      );
    }

    quelle.sections.forEach((deSection, i) => {
      const a = laengen(deSection);
      const b = laengen(ziel.sections[i]);
      for (const key of Object.keys(a) as (keyof typeof a)[]) {
        if (a[key] !== b[key]) {
          fail(`${wo}: section ${i + 1} has ${b[key]} ${key}, German has ${a[key]}`);
        }
      }
    });

    for (const feld of ["navLabel", "title", "metaTitle", "description", "lead"] as const) {
      if (!ziel[feld]?.trim()) fail(`${wo}: "${feld}" is empty`);
    }

    /**
     * Headings are not just text: `slugify(heading)` is the section's `id` and
     * the target of every link in the table of contents. An empty one produces
     * an empty anchor, and two that slugify alike produce duplicate ids — both
     * break navigation silently on a page nobody on the team can proofread.
     */
    const ids = ziel.sections.map((s) => slugify(s.heading));
    ziel.sections.forEach((section, i) => {
      if (!section.heading?.trim()) fail(`${wo}: section ${i + 1} has no heading`);
      else if (!ids[i]) fail(`${wo}: section ${i + 1} slugifies to an empty id`);
    });
    if (new Set(ids).size !== ids.length) {
      fail(`${wo}: two sections slugify to the same anchor id`);
    }

    for (const [i, faq] of ziel.faqs.entries()) {
      if (!faq.question?.trim() || !faq.answer?.trim()) {
        fail(`${wo}: FAQ ${i + 1} has an empty question or answer`);
      }
    }
  }
}

// A duplicate URL would make one of the two guides unreachable. pfade.ts throws
// on construction, so reaching this means the guard is intact — it is checked
// here as well because the failure is silent in a way nothing else would show.
for (const l of locales) {
  const urls = deutscheSlugs.map((slug) =>
    lokalerPfad(l.code as Locale, `/ratgeber/${slug}`),
  );
  if (new Set(urls).size !== urls.length) {
    fail(`${l.code}: two guides resolve to the same URL`);
  }
}

if (failures) {
  console.error(`\n${failures} i18n problem(s) found.`);
  process.exit(1);
}
console.log("\n✓ All locales complete.");
