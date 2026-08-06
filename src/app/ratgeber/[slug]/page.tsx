import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import RatgeberArtikelView from "@/components/ratgeber/RatgeberArtikelView";
import { getRatgeberBySlug, ratgeberArtikel } from "@/data/ratgeber";
import { istRatgeberSlug } from "@/i18n/pfade";
import { ratgeberLocales } from "@/i18n/ratgeber";
import { DEFAULT_LOCALE } from "@/i18n/routing";
import { artikelSchemaFor } from "@/lib/ratgeberSchema";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return ratgeberArtikel.map((artikel) => ({ slug: artikel.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const artikel = getRatgeberBySlug(slug);
  if (!artikel || !istRatgeberSlug(artikel.slug)) return {};

  return buildMetadata({
    title: artikel.metaTitle,
    description: artikel.description,
    path: `/ratgeber/${artikel.slug}`,
    keywords: artikel.keywords,
    type: "article",
    publishedTime: artikel.published,
    modifiedTime: artikel.updated,
    /**
     * The German original has to name the translations, or the cluster is
     * one-sided and Google ignores it. Only the languages that actually have
     * this guide are listed, which is why it is derived per article.
     */
    alternateLocales: ratgeberLocales(artikel.slug),
  });
}

export default async function RatgeberPage({ params }: { params: Params }) {
  const { slug } = await params;
  const artikel = getRatgeberBySlug(slug);
  if (!artikel || !istRatgeberSlug(artikel.slug)) notFound();

  const schema = artikelSchemaFor(DEFAULT_LOCALE, artikel.slug);

  return (
    <>
      {schema && <JsonLd data={schema} />}
      <RatgeberArtikelView
        locale={DEFAULT_LOCALE}
        slug={artikel.slug}
        updated={artikel.updated}
        readingMinutes={artikel.readingMinutes}
      />
    </>
  );
}
