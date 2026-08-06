import { faqs } from "@/data/maengel";
import { contentTranslations, faqAnswerKey, faqQuestionKey } from "./content";
import { DEFAULT_LOCALE } from "./routing";
import { locales, translations, type Locale } from "./translations";

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

/**
 * The writing direction of `locale`, for server-rendered pages.
 *
 * `<html dir>` is German and left-to-right for every page and is corrected on
 * the client — see the reasoning in `src/app/layout.tsx`. For the Arabic guides
 * that correction arrives too late to be harmless: direction decides how the
 * page is laid out, not only how a screen reader announces it, so until the
 * effect runs the article is left-aligned and mirrored the wrong way, and a
 * crawler never sees it corrected at all.
 *
 * Marking the subtree instead of the document keeps the root layout untouched
 * and fixes it where it is actually rendered.
 */
export function richtung(locale: Locale): "rtl" | "ltr" {
  return locales.find((l) => l.code === locale)?.dir ?? "ltr";
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
