import { getRatgeberBySlug } from "@/data/ratgeber";
import type { RatgeberSlug } from "@/i18n/pfade";
import { ratgeberSlugsFuer, ratgeberText } from "@/i18n/ratgeber";
import { localeHref } from "@/i18n/routing";
import { ts } from "@/i18n/server";
import type { Locale } from "@/i18n/translations";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  jsonLdGraph,
  type Crumb,
} from "./seo";
import { absoluteUrl } from "./site";

/**
 * Structured data for the guide pages, in the language the page is served in.
 *
 * Shared between the German routes and the localized resolver so both describe
 * themselves identically — same shape, same crumb trail, each at its own URLs.
 * A schema emitted in one language on a page rendered in another describes a
 * page that does not exist.
 */

/** The German paths of the hub's crumb trail. */
export function hubCrumbs(locale: Locale): Crumb[] {
  return [
    { name: ts(locale, "common.home"), path: "/" },
    { name: ts(locale, "nav.guide"), path: "/ratgeber" },
  ];
}

/** The German paths of an article's crumb trail. */
export function artikelCrumbs(
  locale: Locale,
  slug: RatgeberSlug,
  navLabel: string,
): Crumb[] {
  return [...hubCrumbs(locale), { name: navLabel, path: `/ratgeber/${slug}` }];
}

export function hubSchema(locale: Locale) {
  const slugs = ratgeberSlugsFuer(locale);

  return jsonLdGraph(
    {
      "@type": "CollectionPage",
      name: ts(locale, "ratgeber.hubTitle"),
      description: ts(locale, "ratgeber.hubLead"),
      url: absoluteUrl(localeHref(locale, "/ratgeber")),
      inLanguage: locale === "de" ? "de-DE" : locale,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: slugs.length,
        itemListElement: slugs.map((slug, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: ratgeberText(locale, slug)?.title ?? slug,
          url: absoluteUrl(localeHref(locale, `/ratgeber/${slug}`)),
        })),
      },
    },
    breadcrumbSchema(hubCrumbs(locale), locale),
  );
}

export function artikelSchemaFor(locale: Locale, slug: RatgeberSlug) {
  const text = ratgeberText(locale, slug);
  const quelle = getRatgeberBySlug(slug);
  if (!text || !quelle) return null;

  return jsonLdGraph(
    articleSchema({
      headline: text.title,
      description: text.description,
      path: `/ratgeber/${slug}`,
      datePublished: quelle.published,
      dateModified: quelle.updated,
      section: "Mietrecht",
      locale,
    }),
    faqSchema(text.faqs),
    breadcrumbSchema(artikelCrumbs(locale, slug, text.navLabel), locale),
  );
}
