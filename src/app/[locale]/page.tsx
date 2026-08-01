import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeView from "@/components/HomeView";
import JsonLd from "@/components/JsonLd";
import { isLocale, PREFIXED_LOCALES } from "@/i18n/routing";
import { localizedFaqs, ts } from "@/i18n/server";
import { DEFAULT_LOCALE } from "@/i18n/routing";
import {
  buildMetadata,
  faqSchema,
  jsonLdGraph,
  versandServiceSchema,
  webApplicationSchema,
} from "@/lib/seo";

/**
 * The landing page in the six non-German languages.
 *
 * German is served from the bare root, so this segment never generates a
 * `/de` route - that would be a duplicate of `/` under a second URL.
 * `dynamicParams = false` means anything that is not one of the six locales
 * 404s rather than rendering an empty homepage: without it, `/nonsense` would
 * match this segment.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === DEFAULT_LOCALE) return {};

  return buildMetadata({
    title: ts(locale, "seo.home.title"),
    description: ts(locale, "seo.home.description"),
    // The German path; `buildMetadata` prefixes it for the locale.
    path: "/",
    locale,
    alternateLocales: true,
  });
}

export default async function LocaleHome({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === DEFAULT_LOCALE) notFound();

  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          webApplicationSchema(),
          versandServiceSchema(),
          // The FAQ markup has to match the language of the page carrying it.
          faqSchema(localizedFaqs(locale))
        )}
      />
      <HomeView locale={locale} />
    </>
  );
}
