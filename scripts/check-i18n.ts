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

if (failures) {
  console.error(`\n${failures} i18n problem(s) found.`);
  process.exit(1);
}
console.log("\n✓ All locales complete.");
