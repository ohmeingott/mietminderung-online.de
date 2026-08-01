import type { MetadataRoute } from "next";
import { ratgeberArtikel } from "@/data/ratgeber";
import {
  DEFAULT_LOCALE,
  localeHref,
  PREFIXED_LOCALES,
  TRANSLATED_PATHS,
} from "@/i18n/routing";
import { locales } from "@/i18n/translations";
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

/** The full hreflang cluster for a path that exists in every language. */
function sprachAlternativen(path: string) {
  return {
    languages: Object.fromEntries(
      locales
        .map((l) => [l.code, absoluteUrl(localeHref(l.code, path))])
        .concat([["x-default", absoluteUrl(localeHref(DEFAULT_LOCALE, path))]]),
    ),
  };
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

  const ratgeber: MetadataRoute.Sitemap = ratgeberArtikel.map((artikel) => ({
    url: absoluteUrl(`/ratgeber/${artikel.slug}`),
    lastModified: new Date(artikel.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

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

  return [...core, ...uebersetzt, ...kategorien, ...maengel, ...ratgeber, ...legal];
}
