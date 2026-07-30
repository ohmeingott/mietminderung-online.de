/**
 * Central site configuration.
 *
 * `operator` is the single source of truth for who runs this site - the legal
 * pages read it directly, and `siteConfig.publisher` re-exposes the same record
 * under schema.org field names for the JSON-LD emitters. Change it here and
 * both the Impressum and the structured data follow.
 *
 * The canonical host is read from NEXT_PUBLIC_SITE_URL so that preview
 * deployments never emit canonicals/sitemaps pointing at the wrong origin.
 * Falls back to the production domain.
 */

/**
 * The live production origin. Everything else - canonical tags, the sitemap,
 * robots.txt, the JSON-LD and the brand name shown in the footer and the legal
 * pages - is derived from this one value, so the site can never advertise a
 * host it is not actually served from.
 */
const PRODUCTION_URL = "https://mietminderung-online.de";

/**
 * Reject anything that is not a bare origin. A silently wrong value here is the
 * worst kind of bug: the site keeps building and serving, but every canonical
 * points somewhere else and Google drops the domain from its index. Failing the
 * build is the cheaper outcome.
 */
function toOrigin(value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be an absolute URL like "${PRODUCTION_URL}", got "${value}".`,
    );
  }

  const isLocal =
    parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  if (parsed.protocol !== "https:" && !isLocal) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must use https, got "${value}". Only localhost may use http.`,
    );
  }
  if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be an origin without a path, query or hash, got "${value}".`,
    );
  }

  // `origin` is normalised and never carries a trailing slash.
  return parsed.origin;
}

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_URL;

/** Canonical origin, never with a trailing slash. */
const siteUrl = toOrigin(rawSiteUrl);

/** Host only - the brand is the domain, so it follows the canonical origin. */
const siteHost = new URL(siteUrl).host;

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
  name: siteHost,
  operator,
  /** Court venue for merchant disputes. */
  venue: "Köln",
  /** Shown as "Stand:" on the legal documents. */
  legalVersion: "August 2026",
} as const;

export const siteConfig = {
  url: siteUrl,
  name: "Mietminderung Online",
  brand: siteHost,
  lang: "de",
  locale: "de_DE",
  themeColor: "#1e40af",
  description:
    "Kostenlos prüfen, ob Sie Anspruch auf Mietminderung haben. Minderungsquote berechnen und rechtssichere Mängelanzeige für den Vermieter erstellen, in wenigen Minuten und ohne Anwalt.",
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
