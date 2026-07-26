import type { MetadataRoute } from "next";
import { ratgeberArtikel } from "@/data/ratgeber";
import { alleMaengel, kategorieIndex } from "@/lib/mangelIndex";
import { absoluteUrl } from "@/lib/site";

/**
 * Content changes when the underlying data changes, not on every deploy, so a
 * fixed review date keeps `lastModified` honest across rebuilds.
 */
const CONTENT_REVIEWED = new Date("2026-07-26");

export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: CONTENT_REVIEWED,
      changeFrequency: "weekly",
      priority: 1.0,
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
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: CONTENT_REVIEWED,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...core, ...kategorien, ...maengel, ...ratgeber, ...legal];
}
