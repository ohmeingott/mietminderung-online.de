import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mietminderung Online — Prüfen Sie Ihr Recht auf Mietminderung",
  description:
    "Kostenlos prüfen ob Sie Anspruch auf Mietminderung haben. Berechnen Sie die Höhe und erstellen Sie eine rechtssichere Mängelanzeige für Ihren Vermieter.",
  keywords:
    "Mietminderung, Mängelanzeige, Mietrecht, Miete mindern, Wohnungsmangel, Mietminderung berechnen",
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
      </body>
    </html>
  );
}
