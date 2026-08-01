import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { faqs } from "@/data/maengel";
import { DEFAULT_LOCALE, isLocale, PREFIXED_LOCALES } from "@/i18n/routing";
import { localizedFaqs, ts } from "@/i18n/server";
import { buildMetadata, faqSchema, jsonLdGraph } from "@/lib/seo";
import FAQPageContent from "@/app/faq/FAQPageContent";

/** The FAQ page in the six non-German languages. See ../page.tsx. */
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
    title: ts(locale, "seo.faq.title"),
    description: ts(locale, "seo.faq.description"),
    path: "/faq",
    locale,
    alternateLocales: true,
  });
}

export default async function LocaleFAQ({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === DEFAULT_LOCALE) notFound();

  return (
    <>
      {/*
        No BreadcrumbList here. The German page carries one because it sits
        under a German "Startseite" crumb; the locale pages have no localized
        trail to describe, and a crumb naming the German homepage on a Turkish
        page would point at a different-language URL.

        The markup gets the translated strings; the component gets the German
        source and translates itself, because `FAQAccordion` looks each entry
        up by index through `tc()` and falls back to what it is handed.
      */}
      <JsonLd data={jsonLdGraph(faqSchema(localizedFaqs(locale)))} />
      <FAQPageContent faqs={faqs} />
    </>
  );
}
