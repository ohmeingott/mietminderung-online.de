/**
 * Central site configuration.
 *
 * `operator` is the single source of truth for who runs this site — the legal
 * pages read it directly, and `siteConfig.publisher` re-exposes the same record
 * under schema.org field names for the JSON-LD emitters. Change it here and
 * both the Impressum and the structured data follow.
 *
 * The canonical host is read from NEXT_PUBLIC_SITE_URL so that preview
 * deployments never emit canonicals/sitemaps pointing at the wrong origin.
 * Falls back to the production domain.
 */

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://mietminderung-online.de";

/** Canonical origin, never with a trailing slash. */
const siteUrl = rawSiteUrl.replace(/\/+$/, "");

const operator = {
  name: "Paul Ohm",
  street: "Holzgasse 8",
  zip: "50676",
  city: "Köln",
  country: "Deutschland",
  /** ISO 3166-1 alpha-2, for structured data. */
  countryCode: "DE",
  email: "pjhohm@gmail.com",
} as const;

/** Operator details and legal metadata used across the legal pages. */
export const site = {
  url: siteUrl,
  name: "mietminderung-online.de",
  operator,
  /** Court venue for merchant disputes. */
  venue: "Köln",
  /** Shown as "Stand:" on the legal documents. */
  legalVersion: "Juli 2026",
} as const;

export const siteConfig = {
  url: siteUrl,
  name: "Mietminderung-online.de",
  /** Wordmark without the TLD, as shown in the header and footer logos. */
  brand: "Mietminderung-online",
  lang: "de",
  locale: "de_DE",
  themeColor: "#1e40af",
  description:
    "Kostenlos prüfen, ob Sie Anspruch auf Mietminderung haben. Minderungsquote berechnen und rechtssichere Mängelanzeige für den Vermieter erstellen — in wenigen Minuten, ohne Anwalt.",
  /** The same operator record, under the schema.org names the JSON-LD needs. */
  publisher: {
    name: operator.name,
    streetAddress: operator.street,
    postalCode: operator.zip,
    addressLocality: operator.city,
    addressCountry: operator.countryCode,
    email: operator.email,
  },
  /** Number of distinct defect types covered by the calculator. */
  mangelCount: 58,
} as const;

/** Build an absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return `${siteConfig.url}/`;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
