import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const siteUrl = "https://mietminderung.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mietminderung Online — Prüfen Sie Ihr Recht auf Mietminderung",
  description:
    "Kostenlos prüfen ob Sie Anspruch auf Mietminderung haben. Berechnen Sie die Höhe und erstellen Sie eine rechtssichere Mängelanzeige für Ihren Vermieter.",
  keywords:
    "Mietminderung, Mängelanzeige, Mietrecht, Miete mindern, Wohnungsmangel, Mietminderung berechnen",
  openGraph: {
    title: "Mietminderung Online — Prüfen Sie Ihr Recht auf Mietminderung",
    description:
      "Kostenlos prüfen ob Sie Anspruch auf Mietminderung haben. Berechnen Sie die Höhe und erstellen Sie eine rechtssichere Mängelanzeige.",
    url: siteUrl,
    siteName: "Mietminderung Online",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mietminderung Online — Prüfen Sie Ihr Recht auf Mietminderung",
    description:
      "Kostenlos prüfen ob Sie Anspruch auf Mietminderung haben. Berechnen Sie die Höhe und erstellen Sie eine rechtssichere Mängelanzeige.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#1e40af",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.className}>
      <body className="antialiased">
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
