import type { Locale } from "../translations";
import tr from "./tr";
import uk from "./uk";
import ru from "./ru";
import ar from "./ar";
import pl from "./pl";

/**
 * Translations for content that lives in `src/data/maengel.ts` - defect
 * categories, defect labels/descriptions and FAQ entries.
 *
 * German is intentionally absent: the data file already holds the German
 * source text, which `tc()` uses as the fallback. That keeps a single source
 * of truth for the German wording.
 */
export const contentTranslations: Partial<Record<Locale, Record<string, string>>> = {
  tr,
  uk,
  ru,
  ar,
  pl,
};

/** Key for a defect category label. */
export const katKey = (kategorieId: string) => `kat.${kategorieId}`;
/** Key for a defect label. */
export const mangelLabelKey = (mangelId: string) => `m.${mangelId}.l`;
/** Key for a defect description. */
export const mangelDescKey = (mangelId: string) => `m.${mangelId}.d`;
/** Key for a FAQ question. */
export const faqQuestionKey = (index: number) => `faq.q${index}`;
/** Key for a FAQ answer. */
export const faqAnswerKey = (index: number) => `faq.a${index}`;
