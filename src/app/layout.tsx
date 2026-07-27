import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { Analytics } from "@vercel/analytics/react";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { jsonLdGraph, organizationSchema, websiteSchema } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const defaultTitle =
  "Mietminderung Online — Prüfen Sie Ihr Recht auf Mietminderung";

export const viewport: Viewport = {
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.lang} className={inter.className}>
      <body className="antialiased">
        <JsonLd data={jsonLdGraph(organizationSchema(), websiteSchema())} />
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
