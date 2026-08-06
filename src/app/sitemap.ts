import type { MetadataRoute } from "next";
import { getRatgeberBySlug } from "@/data/ratgeber";
import {
  alleRatgeberSlugs,
  hatRatgeber,
  ratgeberLocales,
  ratgeberSlugsFuer,
} from "@/i18n/ratgeber";
import {
  DEFAULT_LOCALE,
  localeHref,
  PREFIXED_LOCALES,
  TRANSLATED_PATHS,
} from "@/i18n/routing";
import { locales, type Locale } from "@/i18n/translations";
import { alleMaengel, kategorieIndex } from "@/lib/mangelIndex";
import { VERSAND_PATH } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

/**
 * Content changes when the underlying data changes, not on every deploy, so a
 * fixed review date keeps `lastModified` honest across rebuilds.
 */
const CONTENT_REVIEWED = new Date("2026-07-26");

/**
 * The dispatch landing page is newer than the last review of the defect
 * catalogue, so it carries its own date. Handing it `CONTENT_REVIEWED` would
 * claim it was last touched before it existed.
 */
const VERSAND_REVIEWED = new Date("2026-08-01");

/**
 * The hreflang cluster for a path, over `nur` or over every language.
 *
 * Google treats sitemap alternates and the on-page `<link rel="alternate">` as
 * the same signal, so this list has to match what the page emits — which for
 * the guides is only the languages that actually have them.
 */
function sprachAlternativen(path: string, nur?: readonly Locale[]) {
  const codes = (nur ?? locales.map((l) => l.code)) as readonly Locale[];
  return {
    languages: Object.fromEntries(
      codes
        .map((code) => [code, absoluteUrl(localeHref(code, path))])
        .concat([["x-default", absoluteUrl(localeHref(DEFAULT_LOCALE, path))]]),
    ),
  };
}

/** Every language that has at least one guide, German first. */
function ratgeberSprachen(): Locale[] {
  return [DEFAULT_LOCALE, ...PREFIXED_LOCALES.filter(hatRatgeber)];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: CONTENT_REVIEWED,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: sprachAlternativen("/"),
    },
    {
      url: absoluteUrl(VERSAND_PATH),
      lastModified: VERSAND_REVIEWED,
      changeFrequency: "monthly",
      // The only page that describes what we sell, so it ranks second only to
      // the calculator itself.
      priority: 0.9,
    },
    {
      url: absoluteUrl("/mietminderungstabelle"),
      lastModified: CONTENT_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/mietminderung"),
      lastModified: CONTENT_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/ratgeber"),
      lastModified: CONTENT_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: sprachAlternativen("/ratgeber", ratgeberSprachen()),
    },
    {
      url: absoluteUrl("/faq"),
      lastModified: CONTENT_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: sprachAlternativen("/faq"),
    },
  ];

  const kategorien: MetadataRoute.Sitemap = kategorieIndex.map((entry) => ({
    url: absoluteUrl(`/mietminderung/${entry.seo.slug}`),
    lastModified: CONTENT_REVIEWED,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const maengel: MetadataRoute.Sitemap = alleMaengel.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: CONTENT_REVIEWED,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  /**
   * The six non-German versions of the pages that are translated.
   *
   * Each entry declares the whole `hreflang` cluster it belongs to. Google
   * treats sitemap alternates and on-page `<link rel="alternate">` as the same
   * signal, and having both agree is what makes the cluster stick.
   */
  const uebersetzt: MetadataRoute.Sitemap = PREFIXED_LOCALES.flatMap((locale) =>
    TRANSLATED_PATHS.map((path) => ({
      url: absoluteUrl(localeHref(locale, path)),
      lastModified: CONTENT_REVIEWED,
      changeFrequency: "weekly" as const,
      // Below the German originals: same content, smaller audience per page,
      // and the German pages are the ones carrying the internal links.
      priority: path === "/" ? 0.8 : 0.6,
      alternates: sprachAlternativen(path),
    })),
  );

  const ratgeber: MetadataRoute.Sitemap = alleRatgeberSlugs().map((slug) => ({
    url: absoluteUrl(`/ratgeber/${slug}`),
    lastModified: new Date(getRatgeberBySlug(slug)?.updated ?? CONTENT_REVIEWED),
    changeFrequency: "monthly",
    priority: 0.7,
    alternates: sprachAlternativen(`/ratgeber/${slug}`, ratgeberLocales(slug)),
  }));

  /**
   * The guides under a locale prefix — the hub plus whatever articles that
   * language has. Availability is per article, so a language part-way through
   * translation lists exactly what exists rather than promising the rest.
   */
  const ratgeberUebersetzt: MetadataRoute.Sitemap = PREFIXED_LOCALES.filter(
    hatRatgeber,
  ).flatMap((locale) => [
    {
      url: absoluteUrl(localeHref(locale, "/ratgeber")),
      lastModified: CONTENT_REVIEWED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: sprachAlternativen("/ratgeber", ratgeberSprachen()),
    },
    ...ratgeberSlugsFuer(locale).map((slug) => ({
      url: absoluteUrl(localeHref(locale, `/ratgeber/${slug}`)),
      lastModified: new Date(
        getRatgeberBySlug(slug)?.updated ?? CONTENT_REVIEWED,
      ),
      changeFrequency: "monthly" as const,
      // Below the German original: same content, smaller audience per page,
      // and the German pages carry the internal links.
      priority: 0.6,
      alternates: sprachAlternativen(
        `/ratgeber/${slug}`,
        ratgeberLocales(slug),
      ),
    })),
  ]);

  const legal: MetadataRoute.Sitemap = [
    "/impressum",
    "/datenschutz",
    "/nutzungsbedingungen",
    "/widerruf",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: CONTENT_REVIEWED,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    ...core,
    ...uebersetzt,
    ...kategorien,
    ...maengel,
    ...ratgeber,
    ...ratgeberUebersetzt,
    ...legal,
  ];
}
