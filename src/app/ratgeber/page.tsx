import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import RatgeberHubView from "@/components/ratgeber/RatgeberHubView";
import { hatRatgeber } from "@/i18n/ratgeber";
import { DEFAULT_LOCALE, PREFIXED_LOCALES } from "@/i18n/routing";
import { hubSchema } from "@/lib/ratgeberSchema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mietminderung Ratgeber: Anleitungen, Muster und Fristen",
  description:
    "Alles zur Mietminderung verständlich erklärt: Mängelanzeige schreiben, Minderung berechnen, unter Vorbehalt zahlen und häufige Fehler vermeiden.",
  path: "/ratgeber",
  keywords: [
    "Mietminderung Ratgeber",
    "Mietrecht Mieter",
    "Mietminderung Anleitung",
    "Mängelanzeige Muster",
  ],
  // Reciprocal with the localized hubs, limited to the languages that have
  // guides at all.
  alternateLocales: [DEFAULT_LOCALE, ...PREFIXED_LOCALES.filter(hatRatgeber)],
});

export default function RatgeberHub() {
  return (
    <>
      <JsonLd data={hubSchema(DEFAULT_LOCALE)} />
      <RatgeberHubView locale={DEFAULT_LOCALE} />
    </>
  );
}
