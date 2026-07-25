import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#122741",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `lang`/`dir` are the server-rendered defaults; LanguageProvider updates
  // them on the client once a stored language preference is read.
  return (
    <html lang="de" dir="ltr" className={inter.variable}>
      <body className="font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
