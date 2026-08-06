import {
  alleUebersetztenPfade,
  deutscherPfad,
  lokalerPfad,
} from "./pfade";
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
 * The pages that exist in every language *under the same path*.
 *
 * The guides also exist in every language, but their URL is translated too, so
 * they live in `pfade.ts` and reach this module through
 * `UEBERSETZTE_INHALTSPFADE` below. The split is not cosmetic: these two paths
 * are identical in every language and can be written as literals, the guides
 * are not.
 *
 * The defect pages and the dispatch page are still German-only — their content
 * lives in `src/data/*.ts` with no translation yet. The legal texts are a
 * separate case handled by `LEGAL_PATHS`. Declaring a locale variant of a page
 * that has none would point `hreflang` and the language switcher at URLs that
 * 404.
 */
export const TRANSLATED_PATHS = ["/", "/faq"] as const;

export type TranslatedPath = (typeof TRANSLATED_PATHS)[number];

/**
 * The German paths of pages that exist in every language under a *translated*
 * URL — today the guides, later the defect pages.
 *
 * Callers keep using the German path as the page's identity and let
 * `localeHref` produce the localized URL; nothing outside `pfade.ts` needs to
 * know what the Turkish slug is.
 */
export const UEBERSETZTE_INHALTSPFADE: readonly string[] =
  alleUebersetztenPfade();

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

/** Every German path that has a per-locale URL, for whatever reason. */
const PREFIXABLE_PATHS: readonly string[] = [
  ...TRANSLATED_PATHS,
  ...LEGAL_PATHS,
  ...UEBERSETZTE_INHALTSPFADE,
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
 *
 * Translated URLs are mapped back to the German path they stand for, so
 * "/tr/rehber/ayip-bildirimi-yazma" comes out as `{ locale: "tr", basePath:
 * "/ratgeber/maengelanzeige-schreiben" }`. A path with no known translation is
 * returned unchanged — that is what keeps "/tr/faq" and "/tr/impressum"
 * working without an entry in `pfade.ts`.
 */
export function splitLocalePath(pathname: string): {
  locale: Locale;
  basePath: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first) && first !== DEFAULT_LOCALE) {
    const rest = segments.slice(1).join("/");
    const lokal = rest ? `/${rest}` : "/";
    return { locale: first, basePath: deutscherPfad(first, lokal) ?? lokal };
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
 *
 * `basePath` is always the German path. Pages whose URL is translated as well
 * are looked up in `pfade.ts`; everything else keeps its German path under the
 * prefix, which is what the legal texts and the FAQ do.
 */
export function localeHref(locale: Locale, basePath: string): string {
  if (locale === DEFAULT_LOCALE) return basePath;
  if (!PREFIXABLE_PATHS.includes(basePath)) return `/${locale}`;
  if (basePath === "/") return `/${locale}`;
  return `/${locale}${lokalerPfad(locale, basePath) ?? basePath}`;
}
