import {
  getRatgeberBySlug,
  ratgeberArtikel,
  type RatgeberArtikel,
} from "@/data/ratgeber";
import { istRatgeberSlug, type RatgeberSlug } from "../pfade";
import { DEFAULT_LOCALE } from "../routing";
import { locales, type Locale } from "../translations";
import ar from "./ar";
import en from "./en";
import pl from "./pl";
import ru from "./ru";
import tr from "./tr";
import uk from "./uk";
import type { RatgeberText, RatgeberUebersetzung } from "./typen";

export type { RatgeberText, RatgeberSectionText } from "./typen";

/**
 * The translated guides, by locale.
 *
 * German is absent on purpose: `src/data/ratgeber.ts` holds the German source
 * and is the fallback, the same arrangement the defect catalogue uses.
 *
 * Availability is per article, not per language. A guide is published in a
 * language as soon as that language has it, and `hreflang` is computed per
 * article anyway, so a language part-way through translation produces correct
 * clusters rather than broken ones. `check:i18n` enforces that whatever *is*
 * present matches the German structure, and reports the coverage per language
 * so a half-finished language is visible rather than silent.
 */
const uebersetzungen: Partial<Record<Locale, RatgeberUebersetzung>> = {
  ar,
  en,
  pl,
  ru,
  tr,
  uk,
};

/** Every locale a given guide is published in, German first. */
export function ratgeberLocales(slug: RatgeberSlug): Locale[] {
  return locales
    .map((l) => l.code)
    .filter(
      (code) =>
        code === DEFAULT_LOCALE || uebersetzungen[code]?.[slug] !== undefined,
    );
}

/** The guides published in `locale`, in the German source's order. */
export function ratgeberSlugsFuer(locale: Locale): RatgeberSlug[] {
  if (locale === DEFAULT_LOCALE) return alleRatgeberSlugs();
  const dict = uebersetzungen[locale];
  if (!dict) return [];
  return alleRatgeberSlugs().filter((slug) => dict[slug] !== undefined);
}

/** Whether `locale` has any guide at all — drives the navigation links. */
export function hatRatgeber(locale: Locale): boolean {
  return ratgeberSlugsFuer(locale).length > 0;
}

/** How many of the German guides `locale` carries. Used by `check:i18n`. */
export function ratgeberAbdeckung(locale: Locale): {
  vorhanden: number;
  gesamt: number;
} {
  return {
    vorhanden: ratgeberSlugsFuer(locale).length,
    gesamt: alleRatgeberSlugs().length,
  };
}

/** The raw translation for a guide, or `undefined` if it has none. */
export function ratgeberUebersetzung(
  locale: Locale,
  slug: RatgeberSlug,
): RatgeberText | undefined {
  return uebersetzungen[locale]?.[slug];
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
export function ratgeberText(
  locale: Locale,
  slug: RatgeberSlug,
): RatgeberText | null {
  const deutsch = getRatgeberBySlug(slug);
  if (!deutsch) return null;

  if (locale === DEFAULT_LOCALE) return alsText(deutsch);
  return uebersetzungen[locale]?.[slug] ?? alsText(deutsch);
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
