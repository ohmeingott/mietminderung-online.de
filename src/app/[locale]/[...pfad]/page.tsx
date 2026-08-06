import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Datenschutz from "@/app/datenschutz/page";
import Impressum from "@/app/impressum/page";
import Nutzungsbedingungen from "@/app/nutzungsbedingungen/page";
import Widerruf from "@/app/widerruf/page";
import {
  DEFAULT_LOCALE,
  isLocale,
  LEGAL_PATHS,
  PREFIXED_LOCALES,
  splitLocalePath,
} from "@/i18n/routing";
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
export const dynamicParams = false;

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

export function generateStaticParams() {
  return PREFIXED_LOCALES.flatMap((locale) =>
    LEGAL_PATHS.map((path) => ({ locale, pfad: [path.slice(1)] })),
  );
}

type Params = Promise<{ locale: string; pfad: string[] }>;

/**
 * What a localized URL resolves to.
 *
 * The German `basePath` is the identity of the page, so resolution is a lookup
 * on that and never on the localized segments themselves.
 */
function aufloesen(locale: string, pfad: string[]) {
  if (!isLocale(locale) || locale === DEFAULT_LOCALE) return null;

  const { basePath } = splitLocalePath(`/${locale}/${pfad.join("/")}`);

  const rechtstext = RECHTSTEXTE[basePath.slice(1) as Rechtstext];
  if (rechtstext) return { art: "rechtstext" as const, locale, ...rechtstext };

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

  /**
   * `index: false` on purpose. The content is byte-identical German across
   * seven URLs; the German original is the one that belongs in the index, and
   * these exist for people, not for crawlers. For the same reason they carry
   * no `hreflang`: there is nothing to alternate between.
   */
  return buildMetadata({
    title: `${ziel.title} | Mietminderung Online`,
    description:
      "Die rechtlichen Informationen zu Mietminderung Online. Nur die deutsche Fassung ist rechtsverbindlich.",
    path: `/${pfad.join("/")}`,
    locale: ziel.locale,
    index: false,
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

  const { Component } = ziel;
  return <Component />;
}
