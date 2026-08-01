import { locales, type Locale } from "./translations";

/**
 * Where each language lives in the URL space.
 *
 * The site is fully translated into seven languages — UI *and* the defect
 * catalogue — but for a long time the selected language lived in
 * `localStorage`. That meant one URL per page, always serving German to a
 * crawler, and no `hreflang` anywhere. Six complete translations existed and
 * none of them could be found.
 *
 * The locale is now a route segment. German stays on the bare root so that not
 * a single existing URL moves — the one property that makes this change
 * risk-free for the pages that already rank.
 */

export const DEFAULT_LOCALE: Locale = "de";

/** Every locale that is served behind a `/xx/` prefix. German is not. */
export const PREFIXED_LOCALES: Locale[] = locales
  .map((l) => l.code)
  .filter((code) => code !== DEFAULT_LOCALE);

/**
 * The pages that exist in every language.
 *
 * The defect pages, the guides, the dispatch page and the legal texts are
 * German-only: their content lives in `src/data/*.ts` and has no translation,
 * and the legal texts describe a contract under German law where a translation
 * would not be the binding version. Declaring a locale variant of those would
 * point `hreflang` and the language switcher at URLs that 404.
 */
export const TRANSLATED_PATHS = ["/", "/faq"] as const;

export type TranslatedPath = (typeof TRANSLATED_PATHS)[number];

/**
 * The legal texts, which exist under every locale prefix but keep a German
 * body.
 *
 * They are reachable from the footer of every page — § 5 DDG requires the
 * Impressum to be — so without a locale variant, one click from the Turkish
 * homepage would drop the visitor into German chrome and strand them there.
 * The prefixed versions keep the surrounding site in their language and say,
 * in a note, that only the German wording is binding.
 *
 * The body is not translated and never will be: these texts describe a
 * contract under German law, and a translation would not be the binding
 * version. They therefore carry no `hreflang` and stay out of the index —
 * see src/app/[locale]/[rechtstext]/page.tsx.
 */
export const LEGAL_PATHS = [
  "/impressum",
  "/datenschutz",
  "/nutzungsbedingungen",
  "/widerruf",
] as const;

export type LegalPath = (typeof LEGAL_PATHS)[number];

/** Every path that has a per-locale URL, for whatever reason. */
const PREFIXABLE_PATHS: readonly string[] = [
  ...TRANSLATED_PATHS,
  ...LEGAL_PATHS,
];

export function isLocale(value: string): value is Locale {
  return locales.some((l) => l.code === value);
}

export function isTranslatedPath(path: string): path is TranslatedPath {
  return (TRANSLATED_PATHS as readonly string[]).includes(path);
}

export function isLegalPath(path: string): path is LegalPath {
  return (LEGAL_PATHS as readonly string[]).includes(path);
}

/**
 * Split a pathname into the locale it is served in and the German path it
 * translates: "/tr/faq" → `{ locale: "tr", basePath: "/faq" }`.
 *
 * Unprefixed paths are German, which is also the right answer for the
 * German-only routes — "/impressum" is `{ locale: "de", basePath:
 * "/impressum" }`.
 */
export function splitLocalePath(pathname: string): {
  locale: Locale;
  basePath: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first) && first !== DEFAULT_LOCALE) {
    const rest = segments.slice(1).join("/");
    return { locale: first, basePath: rest ? `/${rest}` : "/" };
  }

  return { locale: DEFAULT_LOCALE, basePath: pathname || "/" };
}

/**
 * The URL of `basePath` in `locale`.
 *
 * A path with no translation falls back to that language's homepage rather
 * than to a prefixed URL that does not exist. This is what the language
 * switcher on the legal pages does: someone reading the Impressum who picks
 * Turkish gets the Turkish homepage, not a 404.
 */
export function localeHref(locale: Locale, basePath: string): string {
  if (locale === DEFAULT_LOCALE) return basePath;
  if (!PREFIXABLE_PATHS.includes(basePath)) return `/${locale}`;
  return basePath === "/" ? `/${locale}` : `/${locale}${basePath}`;
}
