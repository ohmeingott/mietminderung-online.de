import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { jsonLdGraph, organizationSchema, websiteSchema } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

const defaultTitle =
  "Mietminderung Online: Prüfen Sie Ihr Recht auf Mietminderung";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the layout paint into the iOS safe areas; globals.css pads them back.
  viewportFit: "cover",
  themeColor: siteConfig.themeColor,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  // Every page supplies its own complete, SERP-width-optimised title via
  // buildMetadata(), so no title template is applied here.
  title: defaultTitle,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Mietminderung",
    "Mietminderung berechnen",
    "Mietminderungstabelle",
    "Mängelanzeige",
    "Mietmangel",
    "Miete mindern",
    "Mietrecht",
    "Wohnungsmangel",
    "§ 536 BGB",
  ],
  authors: [{ name: siteConfig.publisher.name }],
  creator: siteConfig.publisher.name,
  publisher: siteConfig.publisher.name,
  category: "Mietrecht",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: defaultTitle,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteConfig.description,
  },
  // No `icons` block: src/app/{favicon.ico,icon.svg,apple-icon.png} are file
  // conventions, so Next emits the <link> tags itself. Declaring them here as
  // well took priority and emitted a second, conflicting set.
  manifest: "/site.webmanifest",
  /**
   * Search Console / Bing verification tokens, supplied per environment.
   *
   * Read from the environment rather than hardcoded so a preview deployment
   * never claims ownership of the production property, and so the tokens can
   * be rotated without a code change. Both are omitted entirely when unset —
   * an empty `content` attribute fails verification rather than doing nothing.
   */
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
    ? {
        verification: {
          ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
            ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
            : {}),
          ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
            ? {
                other: {
                  "msvalidate.01":
                    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
                },
              }
            : {}),
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * `lang`/`dir` are the server-rendered defaults; `LanguageProvider` corrects
   * them on the client from the locale in the URL.
   *
   * They cannot be set on the server from here: this is the single root layout,
   * and it has no access to the `[locale]` param of a nested segment. Setting
   * it properly needs one root layout per locale via route groups, which in
   * turn conflicts with the global `not-found.tsx`. The cost is small and
   * bounded — Google determines page language from the content, not from this
   * attribute, and `hreflang` (which *is* server-rendered, per locale) is the
   * signal that actually targets the translations. What is affected is
   * assistive technology on first paint, which is why the effect runs.
   */
  return (
    <html lang={siteConfig.lang} dir="ltr" className={inter.variable}>
      <body className="font-sans antialiased">
        <JsonLd data={jsonLdGraph(organizationSchema(), websiteSchema())} />
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
        {/*
          Core Web Vitals from real visits. Lab numbers say little about a page
          whose heaviest work is a client-side wizard on a mid-range phone, and
          field data is what Search Console ranks on.
        */}
        <SpeedInsights />
      </body>
    </html>
  );
}
