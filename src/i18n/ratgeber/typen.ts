import type { RatgeberSlug } from "../pfade";
import type { Locale } from "../translations";

/**
 * A guide article in one non-German language.
 *
 * The shape mirrors `RatgeberArtikel` in `src/data/ratgeber.ts` rather than
 * flattening into the `Record<string, string>` dictionaries the defect
 * catalogue uses. That format is right for short labels keyed by a stable id,
 * and wrong here: these keys would have to be positional, so inserting one
 * paragraph into the German source would silently shift every following
 * translation in six languages. On texts that carry deadlines, percentages and
 * statute references, that is a failure nobody would see. Parallel objects put
 * the structure itself under the structural check in `scripts/check-i18n.ts`.
 *
 * `readingMinutes`, `published` and `updated` are deliberately absent. They are
 * facts about the article, not about the language, and keep coming from the
 * German source.
 */
export interface RatgeberSectionText {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: string[];
  table?: { caption?: string; head: string[]; rows: string[][] };
  note?: string;
  code?: string;
}

export interface RatgeberText {
  navLabel: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  lead: string;
  sections: RatgeberSectionText[];
  faqs: { question: string; answer: string }[];
}

/**
 * One language's guides, keyed by the German slug.
 *
 * Partial on purpose, but only as a build-time state: a language is either
 * absent entirely (not started) or complete. `check:i18n` fails a language
 * that has some articles and not others, because a half-translated language
 * is the one state that produces broken `hreflang` clusters and pages that
 * are German inside a Turkish URL.
 */
export type RatgeberUebersetzung = Partial<Record<RatgeberSlug, RatgeberText>>;

/** The locales a given guide is published in, German always included. */
export type VerfuegbareLocales = readonly Locale[];
