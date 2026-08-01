import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Datenschutz from "@/app/datenschutz/page";
import Impressum from "@/app/impressum/page";
import Nutzungsbedingungen from "@/app/nutzungsbedingungen/page";
import Widerruf from "@/app/widerruf/page";
import { DEFAULT_LOCALE, isLocale, LEGAL_PATHS, PREFIXED_LOCALES } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

/**
 * The legal texts under a locale prefix.
 *
 * The body is the German page component, rendered unchanged — these texts
 * describe a contract under German law and only the German wording is binding,
 * so translating them would produce a version nobody could rely on.
 * `LegalPage` already prints exactly that note whenever the locale is not
 * German.
 *
 * What these routes buy is the chrome: header, footer and navigation stay in
 * the language the visitor is reading. Without them the Impressum link in the
 * footer — which § 5 DDG requires on every page — would be a one-way door out
 * of Turkish and into German with no way back.
 *
 * They are `index: false` on purpose. The content is byte-identical German
 * across seven URLs; the German original is the one that belongs in the index,
 * and these exist for people, not for crawlers. For the same reason they carry
 * no `hreflang`: there is nothing to alternate between.
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
const KNOWN: readonly string[] = LEGAL_PATHS.map((p) => p.slice(1));
for (const slug of KNOWN) {
  if (!(slug in RECHTSTEXTE)) {
    throw new Error(`No component registered for legal path "/${slug}"`);
  }
}

export function generateStaticParams() {
  return PREFIXED_LOCALES.flatMap((locale) =>
    (Object.keys(RECHTSTEXTE) as Rechtstext[]).map((rechtstext) => ({
      locale,
      rechtstext,
    })),
  );
}

type Params = Promise<{ locale: string; rechtstext: string }>;

function lookup(locale: string, rechtstext: string) {
  if (!isLocale(locale) || locale === DEFAULT_LOCALE) return null;
  const entry = RECHTSTEXTE[rechtstext as Rechtstext];
  return entry ? { ...entry, locale } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, rechtstext } = await params;
  const entry = lookup(locale, rechtstext);
  if (!entry) return {};

  return buildMetadata({
    title: `${entry.title} | Mietminderung Online`,
    description:
      "Die rechtlichen Informationen zu Mietminderung Online. Nur die deutsche Fassung ist rechtsverbindlich.",
    path: `/${rechtstext}`,
    locale: entry.locale,
    index: false,
  });
}

export default async function LokalisierterRechtstext({
  params,
}: {
  params: Params;
}) {
  const { locale, rechtstext } = await params;
  const entry = lookup(locale, rechtstext);
  if (!entry) notFound();

  const { Component } = entry;
  return <Component />;
}
