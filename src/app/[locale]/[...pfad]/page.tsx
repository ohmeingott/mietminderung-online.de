import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Datenschutz from "@/app/datenschutz/page";
import Impressum from "@/app/impressum/page";
import Nutzungsbedingungen from "@/app/nutzungsbedingungen/page";
import Widerruf from "@/app/widerruf/page";
import JsonLd from "@/components/JsonLd";
import RatgeberArtikelView from "@/components/ratgeber/RatgeberArtikelView";
import RatgeberHubView from "@/components/ratgeber/RatgeberHubView";
import { getRatgeberBySlug } from "@/data/ratgeber";
import { istRatgeberSlug, lokalerPfad, type RatgeberSlug } from "@/i18n/pfade";
import {
  hatRatgeber,
  ratgeberLocales,
  ratgeberSlugsFuer,
  ratgeberText,
} from "@/i18n/ratgeber";
import {
  DEFAULT_LOCALE,
  isLocale,
  LEGAL_PATHS,
  PREFIXED_LOCALES,
  splitLocalePath,
} from "@/i18n/routing";
import { ts } from "@/i18n/server";
import type { Locale } from "@/i18n/translations";
import { artikelSchemaFor, hubSchema } from "@/lib/ratgeberSchema";
import { buildMetadata } from "@/lib/seo";

/**
 * Every localized page whose URL is not a fixed segment.
 *
 * This is a catch-all rather than a set of named routes because the localized
 * URLs differ per language: `/tr/rehber` and `/ru/рекомендации` are the same
 * page, and Next.js cannot name a route segment dynamically. It replaces the
 * former `[rechtstext]` route, which occupied the single dynamic slot at this
 * level and would have swallowed `/tr/rehber` — one dynamic segment matching
 * another's URL, then 404ing on it because `dynamicParams` is false.
 *
 * A catch-all rather than a single `[segment]` for the same reason, one step
 * ahead: the defect pages are two and three segments deep, so `[segment]/
 * [slug]` would put `[slug]` and `[kategorie]` in the same collision next
 * time. Arbitrary depth costs nothing here and settles the question once.
 *
 * `faq/` stays a static sibling and keeps winning against this route — Next
 * resolves static segments before dynamic ones and both before a catch-all.
 *
 * Resolution runs through `splitLocalePath`, so the mapping from a localized
 * URL back to its German identity lives in `src/i18n/pfade.ts` and nowhere
 * else. This file only decides what to render for the German path that comes
 * back.
 */
/**
 * `true`, and not by preference.
 *
 * With `dynamicParams = false` Next answers any path outside the generated
 * param list with `NoFallbackError`, and its param matching does not survive a
 * non-ASCII segment: every Cyrillic and Arabic guide URL was built, written to
 * disk, and then answered 404 — encoded or decoded made no difference. All
 * eight Russian pages existed and none of them could be opened.
 *
 * Leaving it dynamic costs a function invocation for paths that do not exist.
 * It does not weaken the routing: `aufloesen` accepts only the canonical
 * localized URL of a known page and returns `null` for everything else, so an
 * unknown path still ends in `notFound()`. The generated pages remain static;
 * this only changes what happens to requests that miss them.
 */
export const dynamicParams = true;

const RECHTSTEXTE = {
  impressum: { Component: Impressum, title: "Impressum" },
  datenschutz: { Component: Datenschutz, title: "Datenschutzerklärung" },
  nutzungsbedingungen: {
    Component: Nutzungsbedingungen,
    title: "Nutzungsbedingungen & AGB",
  },
  widerruf: { Component: Widerruf, title: "Widerrufsbelehrung" },
} as const;

type Rechtstext = keyof typeof RECHTSTEXTE;

// Guards the two lists against drifting apart: every legal path the router
// knows about needs an entry here, or the footer links to a 404.
for (const path of LEGAL_PATHS) {
  if (!(path.slice(1) in RECHTSTEXTE)) {
    throw new Error(`No component registered for legal path "${path}"`);
  }
}

/**
 * The localized URL of a German path, split into route segments.
 *
 * The segments are percent-encoded. Next registers a statically generated
 * route under exactly the string `generateStaticParams` returns, while a
 * browser sends the path encoded — so a Cyrillic or Arabic segment handed over
 * decoded produced a manifest key of "/ru/рекомендации" that no incoming
 * request for "/ru/%D1%80..." could ever match. Every one of those pages was
 * built and then answered 404.
 *
 * `aufloesen` decodes again before looking the path up, so the mapping table
 * keeps working in readable text.
 */
function segmenteFuer(locale: Locale, deutscherPfad: string): string[] {
  const lokal = lokalerPfad(locale, deutscherPfad) ?? deutscherPfad;
  return lokal.split("/").filter(Boolean).map(encodeURIComponent);
}

/** Reverses `segmenteFuer`. Latin segments pass through unchanged. */
function dekodiere(pfad: string[]): string {
  return pfad
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        // A malformed escape can only come from a hand-typed URL; leaving it
        // as-is makes the lookup miss and the route 404, which is right.
        return segment;
      }
    })
    .join("/");
}

export function generateStaticParams() {
  return PREFIXED_LOCALES.flatMap((locale) => {
    const legal = LEGAL_PATHS.map((path) => ({
      locale,
      pfad: [path.slice(1)],
    }));

    // Only the guides this language actually has. A route generated for a
    // missing translation would render the German text under a translated URL.
    const ratgeber = hatRatgeber(locale)
      ? [
          { locale, pfad: segmenteFuer(locale, "/ratgeber") },
          ...ratgeberSlugsFuer(locale).map((slug) => ({
            locale,
            pfad: segmenteFuer(locale, `/ratgeber/${slug}`),
          })),
        ]
      : [];

    return [...legal, ...ratgeber];
  });
}

type Params = Promise<{ locale: string; pfad: string[] }>;

type Ziel =
  | { art: "rechtstext"; locale: Locale; slug: Rechtstext }
  | { art: "ratgeberHub"; locale: Locale }
  | { art: "ratgeberArtikel"; locale: Locale; slug: RatgeberSlug };

/**
 * What a localized URL resolves to.
 *
 * The German `basePath` is the identity of the page, so resolution is a lookup
 * on that and never on the localized segments themselves.
 */
function aufloesen(locale: string, pfad: string[]): Ziel | null {
  if (!isLocale(locale) || locale === DEFAULT_LOCALE) return null;

  const angefragt = `/${dekodiere(pfad)}`;
  const { basePath } = splitLocalePath(`/${locale}${angefragt}`);

  /**
   * The requested URL has to be the canonical localized form of that page, not
   * merely something that resolves to it. Without this check
   * `/tr/ratgeber/maengelanzeige-schreiben` — the German slug under a Turkish
   * prefix — renders the Turkish article as well, and the page competes with a
   * duplicate of itself for the same content.
   *
   * The static param list used to hide this: a path it did not contain simply
   * never reached the resolver. Since the list can no longer be the gate (see
   * `dynamicParams`), the rule belongs here, where it is checked on every
   * request rather than only on the ones somebody thought to generate.
   */
  const kanonisch = lokalerPfad(locale, basePath) ?? basePath;
  if (angefragt !== kanonisch) return null;

  if (basePath.slice(1) in RECHTSTEXTE) {
    return { art: "rechtstext", locale, slug: basePath.slice(1) as Rechtstext };
  }

  if (basePath === "/ratgeber") {
    return hatRatgeber(locale) ? { art: "ratgeberHub", locale } : null;
  }

  const slug = basePath.startsWith("/ratgeber/") ? basePath.slice(10) : null;
  if (slug && istRatgeberSlug(slug) && ratgeberSlugsFuer(locale).includes(slug)) {
    return { art: "ratgeberArtikel", locale, slug };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, pfad } = await params;
  const ziel = aufloesen(locale, pfad);
  if (!ziel) return {};

  if (ziel.art === "rechtstext") {
    /**
     * `index: false` on purpose. The content is byte-identical German across
     * seven URLs; the German original is the one that belongs in the index,
     * and these exist for people, not for crawlers. For the same reason they
     * carry no `hreflang`: there is nothing to alternate between.
     */
    return buildMetadata({
      title: `${RECHTSTEXTE[ziel.slug].title} | Mietminderung Online`,
      description:
        "Die rechtlichen Informationen zu Mietminderung Online. Nur die deutsche Fassung ist rechtsverbindlich.",
      path: `/${ziel.slug}`,
      locale: ziel.locale,
      index: false,
    });
  }

  if (ziel.art === "ratgeberHub") {
    return buildMetadata({
      title: ts(ziel.locale, "ratgeber.hubTitle"),
      description: ts(ziel.locale, "ratgeber.hubLead"),
      path: "/ratgeber",
      locale: ziel.locale,
      // Only the languages that have guides. A cluster naming a URL that 404s
      // is worse than no cluster at all.
      alternateLocales: [
        DEFAULT_LOCALE,
        ...PREFIXED_LOCALES.filter(hatRatgeber),
      ],
    });
  }

  const text = ratgeberText(ziel.locale, ziel.slug);
  const quelle = getRatgeberBySlug(ziel.slug);
  if (!text || !quelle) return {};

  return buildMetadata({
    title: text.metaTitle,
    description: text.description,
    path: `/ratgeber/${ziel.slug}`,
    keywords: text.keywords,
    type: "article",
    publishedTime: quelle.published,
    modifiedTime: quelle.updated,
    locale: ziel.locale,
    alternateLocales: ratgeberLocales(ziel.slug),
  });
}

/**
 * The legal texts render the German page component unchanged — these texts
 * describe a contract under German law and only the German wording is binding,
 * so translating them would produce a version nobody could rely on.
 * `LegalPage` already prints exactly that note whenever the locale is not
 * German.
 *
 * What these routes buy is the chrome: header, footer and navigation stay in
 * the language the visitor is reading. Without them the Impressum link in the
 * footer — which § 5 DDG requires on every page — would be a one-way door out
 * of Turkish and into German with no way back.
 */
export default async function LokalisierteSeite({
  params,
}: {
  params: Params;
}) {
  const { locale, pfad } = await params;
  const ziel = aufloesen(locale, pfad);
  if (!ziel) notFound();

  if (ziel.art === "rechtstext") {
    const { Component } = RECHTSTEXTE[ziel.slug];
    return <Component />;
  }

  if (ziel.art === "ratgeberHub") {
    return (
      <>
        <JsonLd data={hubSchema(ziel.locale)} />
        <RatgeberHubView locale={ziel.locale} />
      </>
    );
  }

  const quelle = getRatgeberBySlug(ziel.slug);
  if (!quelle) notFound();

  const schema = artikelSchemaFor(ziel.locale, ziel.slug);

  return (
    <>
      {schema && <JsonLd data={schema} />}
      <RatgeberArtikelView
        locale={ziel.locale}
        slug={ziel.slug}
        updated={quelle.updated}
        readingMinutes={quelle.readingMinutes}
      />
    </>
  );
}
