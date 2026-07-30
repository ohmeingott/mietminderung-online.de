import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./site";

interface BuildMetadataInput {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/mietminderung/heizung-warmwasser". */
  path: string;
  keywords?: string[];
  /** Set to false for utility pages that should stay out of the index. */
  index?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /**
   * Social preview image. Next's file-based `opengraph-image` convention only
   * applies to the segment that declares it and is not inherited by nested
   * routes, so every page gets the site-wide image by default. Pass `null` on
   * routes that ship their own `opengraph-image` file, so Next can inject it.
   */
  ogImage?: string | null;
}

const DEFAULT_OG_IMAGE = {
  url: absoluteUrl("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: "Mietminderung Online: Prüfen Sie Ihr Recht auf Mietminderung",
};

/**
 * Single source of truth for page metadata: canonical URL, robots directives,
 * Open Graph and Twitter cards are derived here so no page can forget them.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  index = true,
  type = "website",
  publishedTime,
  modifiedTime,
  ogImage,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);

  const images =
    ogImage === null
      ? undefined
      : ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : [DEFAULT_OG_IMAGE];

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: url },
    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}

/* ------------------------------------------------------------------ *
 * JSON-LD builders
 * ------------------------------------------------------------------ */

export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    alternateName: siteConfig.brand,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
      width: 512,
      height: 512,
    },
    description: siteConfig.description,
    email: siteConfig.publisher.email,
    founder: { "@type": "Person", name: siteConfig.publisher.name },
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.publisher.streetAddress,
      postalCode: siteConfig.publisher.postalCode,
      addressLocality: siteConfig.publisher.addressLocality,
      addressCountry: siteConfig.publisher.addressCountry,
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
    knowsLanguage: ["de", "tr", "uk", "ru", "ar", "pl"],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "de-DE",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqSchema(entries: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

interface ArticleSchemaInput {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  section?: string;
}

export function articleSchema({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  section,
}: ArticleSchemaInput) {
  return {
    "@type": "Article",
    headline,
    description,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    datePublished,
    dateModified,
    inLanguage: "de-DE",
    ...(section ? { articleSection: section } : {}),
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** The rent-reduction check itself, described as a free web application. */
export function webApplicationSchema() {
  return {
    "@type": "WebApplication",
    "@id": `${siteConfig.url}/#webapp`,
    name: "Mietminderungs-Check & Mängelanzeige-Generator",
    url: absoluteUrl("/"),
    applicationCategory: "LegalService",
    operatingSystem: "Alle Betriebssysteme mit Webbrowser",
    browserRequirements: "Erfordert JavaScript",
    inLanguage: ["de", "tr", "uk", "ru", "ar", "pl"],
    description:
      "Kostenloser Online-Check für die Mietminderung: Anspruch prüfen, Minderungsquote für über 58 Wohnungsmängel berechnen und eine rechtssichere Mängelanzeige nach § 536c BGB erstellen.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    featureList: [
      "Anspruch auf Mietminderung prüfen",
      "Minderungsquote nach Mangelart berechnen",
      "Mängelanzeige als PDF erstellen",
      "Versand per E-Mail oder Brief",
      "Verfügbar in sechs Sprachen",
    ],
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** Wrap one or more schema nodes into a single @graph document. */
export function jsonLdGraph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
