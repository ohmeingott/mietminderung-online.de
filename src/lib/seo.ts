import type { Metadata } from "next";
import { PRODUKTE } from "./ebrief/produkte";
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

/** Canonical route of the dispatch landing page. */
export const VERSAND_PATH = "/maengelanzeige-versenden";

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
      // The real dimensions of the generated lock-up. These were previously
      // declared as 512x512 for a file that was 1024x1024.
      width: 2060,
      height: 248,
    },
    description: siteConfig.description,
    /**
     * The registered name including the legal form, next to the brand `name`
     * above. schema.org keeps them apart, and § 5 DDG is about this one.
     */
    legalName: siteConfig.publisher.name,
    email: siteConfig.publisher.email,
    /**
     * The GbR's partners, one `Person` node each. `member` and not `founder`:
     * founding is a claim about history that we have no source for, whereas
     * membership is exactly what a Gesellschafter is. This used to be a single
     * `founder` carrying the company name as if it were a person.
     */
    member: siteConfig.publisher.partners.map((name) => ({
      "@type": "Person",
      name,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.publisher.streetAddress,
      postalCode: siteConfig.publisher.postalCode,
      addressLocality: siteConfig.publisher.addressLocality,
      addressCountry: siteConfig.publisher.addressCountry,
    },
    /**
     * The same address the Impressum names, as a contact point. Only the email
     * is listed: it is the one channel the operator actually answers on, and a
     * `telephone` field would have to be invented to exist.
     */
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.publisher.email,
      areaServed: "DE",
      availableLanguage: ["de", "en"],
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
    knowsLanguage: ["de", "en", "tr", "uk", "ru", "ar", "pl"],
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
    inLanguage: ["de", "en", "tr", "uk", "ru", "ar", "pl"],
    description:
      "Kostenloser Online-Check für die Mietminderung: Anspruch prüfen, Minderungsquote für über 58 Wohnungsmängel berechnen und eine rechtssichere Mängelanzeige nach § 536c BGB erstellen.",
    /**
     * The check, the calculation and the PDF download are free, and this offer
     * covers exactly those. The paid postal dispatch is a separate node
     * (`versandServiceSchema`) rather than a feature of this one — folded in
     * here it would sit under `price: "0"` and advertise a service that costs
     * money as free.
     */
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description:
        "Anspruchsprüfung, Minderungsberechnung und Mängelanzeige als PDF — kostenlos und ohne Registrierung.",
    },
    featureList: [
      "Anspruch auf Mietminderung prüfen",
      "Minderungsquote nach Mangelart berechnen",
      "Mängelanzeige als PDF erstellen und herunterladen",
      "Verfügbar in sieben Sprachen",
    ],
    /** Named, not inlined: the dispatch is chargeable and stands on its own. */
    relatedLink: absoluteUrl(VERSAND_PATH),
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/* ------------------------------------------------------------------ *
 * The paid dispatch service
 * ------------------------------------------------------------------ */

export const VERSAND_SERVICE_ID = `${siteConfig.url}/#versandservice`;

/** Cents to the plain decimal string schema.org's `price` expects. */
function schemaPrice(cent: number): string {
  return (cent / 100).toFixed(2);
}

/**
 * The chargeable half of the product: we print the defect notice and hand it
 * to the postal service.
 *
 * Prices come from `PRODUKTE`, the same record the checkout charges from, so
 * the figure Google shows can never drift away from the figure billed.
 *
 * No `priceSpecification.valueAddedTaxIncluded`: the operator is a small
 * business under § 19 UStG and levies no VAT at all, so neither `true` (there
 * is tax in this price) nor `false` (tax comes on top) would be true. The
 * amounts below are the final prices.
 */
export function versandServiceSchema() {
  return {
    "@type": "Service",
    "@id": VERSAND_SERVICE_ID,
    name: "Mängelanzeige drucken und an den Vermieter versenden",
    serviceType: "Postversand einer Mängelanzeige",
    url: absoluteUrl(VERSAND_PATH),
    description:
      "Mängelanzeige online erstellen und von uns drucken und per Post an den Vermieter senden lassen — als Brief oder als Einwurf-Einschreiben mit dokumentiertem Einwurf. Ohne Drucker, Briefmarke und Gang zur Post.",
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "Country", name: "Deutschland" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl(VERSAND_PATH),
      availableLanguage: ["de", "en", "tr", "uk", "ru", "ar", "pl"],
    },
    offers: [
      {
        "@type": "Offer",
        name: "Mängelanzeige als Brief versenden",
        description:
          "Wir drucken die Mängelanzeige und geben sie als Standardbrief zur Post.",
        price: schemaPrice(PRODUKTE.brief.preisCent),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: absoluteUrl(VERSAND_PATH),
      },
      {
        "@type": "Offer",
        name: "Mängelanzeige als Einwurf-Einschreiben versenden",
        description:
          "Wie der Brief, zusätzlich wird der Einwurf in den Briefkasten des Vermieters dokumentiert. Kein Übergabe-Einschreiben mit Unterschrift des Empfängers.",
        price: schemaPrice(PRODUKTE.einwurfEinschreiben.preisCent),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: absoluteUrl(VERSAND_PATH),
      },
    ],
    isRelatedTo: { "@id": `${siteConfig.url}/#webapp` },
  };
}

/** Wrap one or more schema nodes into a single @graph document. */
export function jsonLdGraph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
