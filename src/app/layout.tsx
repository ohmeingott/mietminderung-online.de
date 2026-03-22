import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const siteUrl = "https://mietminderung.online";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
