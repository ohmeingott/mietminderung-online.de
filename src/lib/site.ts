/**
 * Central site configuration.
 *
 * The canonical host is read from NEXT_PUBLIC_SITE_URL so that preview
 * deployments never emit canonicals/sitemaps pointing at the wrong origin.
 * Falls back to the production domain.
 */

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://mietminderung.online";

export const siteConfig = {
  /** Canonical origin, never with a trailing slash. */
  url: rawSiteUrl.replace(/\/+$/, ""),
  name: "Mietminderung Online",
  brand: "mietminderung.online",
  lang: "de",
  locale: "de_DE",
  themeColor: "#1e40af",
  description:
    "Kostenlos prüfen, ob Sie Anspruch auf Mietminderung haben. Minderungsquote berechnen und rechtssichere Mängelanzeige für den Vermieter erstellen — in wenigen Minuten, ohne Anwalt.",
  /** Operator details — kept in sync with /impressum. */
  publisher: {
    name: "Paul Ohm",
    streetAddress: "Holzgasse 8",
    postalCode: "50676",
    addressLocality: "Köln",
    addressCountry: "DE",
    email: "pjhohm@gmail.com",
  },
  /** Number of distinct defect types covered by the calculator. */
  mangelCount: 58,
} as const;

/** Build an absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return `${siteConfig.url}/`;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
