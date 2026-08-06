import {
  getRatgeberBySlug,
  ratgeberArtikel,
  type RatgeberArtikel,
} from "@/data/ratgeber";
import { istRatgeberSlug, type RatgeberSlug } from "../pfade";
import { DEFAULT_LOCALE } from "../routing";
import { locales, type Locale } from "../translations";
import type { RatgeberText, RatgeberUebersetzung } from "./typen";

export type { RatgeberText, RatgeberSectionText } from "./typen";

/**
 * The translated guides, by locale.
 *
 * German is absent on purpose: `src/data/ratgeber.ts` holds the German source
 * and is the fallback, the same arrangement the defect catalogue uses. A
 * locale missing from this map has no guides published yet, and its routes are
 * simply not generated — see `ratgeberLocales()`.
 */
const uebersetzungen: Partial<Record<Locale, RatgeberUebersetzung>> = {};

/** Every locale a given guide is actually published in, German first. */
export function ratgeberLocales(slug: RatgeberSlug): Locale[] {
  return locales
    .map((l) => l.code)
    .filter(
      (code) =>
        code === DEFAULT_LOCALE || uebersetzungen[code]?.[slug] !== undefined,
    );
}

/** Every locale that has the full set of guides, German first. */
export function vollstaendigeLocales(): Locale[] {
  return locales.map((l) => l.code).filter(istVollstaendig);
}

/** Whether `locale` carries every guide the German source defines. */
export function istVollstaendig(locale: Locale): boolean {
  if (locale === DEFAULT_LOCALE) return true;
  const dict = uebersetzungen[locale];
  if (!dict) return false;
  return alleRatgeberSlugs().every((slug) => dict[slug] !== undefined);
}

/**
 * The German slugs of every guide.
 *
 * Derived from the German source rather than from the slug table, so that a
 * guide added to `src/data/ratgeber.ts` without a routing entry shows up as a
 * gap in `check:i18n` instead of quietly never being published.
 */
export function alleRatgeberSlugs(): RatgeberSlug[] {
  return ratgeberArtikel.map((a) => a.slug).filter(istRatgeberSlug);
}

/**
 * A guide's text in `locale`, falling back to the German source.
 *
 * The fallback exists for type safety at the call site, not as a publishing
 * strategy: routes are only generated for locales that actually have the
 * article, so a visitor never reaches a page that would use it.
 */
export function ratgeberText(locale: Locale, slug: RatgeberSlug): RatgeberText | null {
  const deutsch = getRatgeberBySlug(slug);
  if (!deutsch) return null;

  if (locale === DEFAULT_LOCALE) return alsText(deutsch);
  const uebersetzt = uebersetzungen[locale]?.[slug];
  return uebersetzt ?? alsText(deutsch);
}

/** The translatable subset of a German article. */
function alsText(artikel: RatgeberArtikel): RatgeberText {
  return {
    navLabel: artikel.navLabel,
    title: artikel.title,
    metaTitle: artikel.metaTitle,
    description: artikel.description,
    keywords: artikel.keywords,
    lead: artikel.lead,
    sections: artikel.sections,
    faqs: artikel.faqs,
  };
}
