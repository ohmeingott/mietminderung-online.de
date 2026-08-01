import { faqs } from "@/data/maengel";
import { contentTranslations, faqAnswerKey, faqQuestionKey } from "./content";
import { DEFAULT_LOCALE } from "./routing";
import { translations, type Locale } from "./translations";

/**
 * Translation lookups for server components.
 *
 * `useTranslation()` needs the React context and therefore a client component.
 * Page metadata and JSON-LD are produced on the server, before any of that
 * exists, so they read the same dictionaries directly. Same data, same
 * fallback order — German, then the key itself.
 */

/** Translate a UI string key in `locale`. */
export function ts(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations[DEFAULT_LOCALE][key] ?? key;
}

/** Translate a content string, falling back to the German source text. */
export function tcs(
  locale: Locale,
  key: string,
  germanFallback: string,
): string {
  if (locale === DEFAULT_LOCALE) return germanFallback;
  return contentTranslations[locale]?.[key] ?? germanFallback;
}

/**
 * The FAQ catalogue in `locale`.
 *
 * The FAQPage structured data has to be in the language of the page carrying
 * it. Emitting the German questions on /tr would describe a page that does not
 * exist — the visible accordion there is Turkish.
 */
export function localizedFaqs(locale: Locale) {
  return faqs.map((faq, i) => ({
    question: tcs(locale, faqQuestionKey(i), faq.question),
    answer: tcs(locale, faqAnswerKey(i), faq.answer),
  }));
}
