import type { Metadata } from "next";
import HomeView from "@/components/HomeView";
import JsonLd from "@/components/JsonLd";
import { faqs } from "@/data/maengel";
import { DEFAULT_LOCALE } from "@/i18n/routing";
import { alleMaengel } from "@/lib/mangelIndex";
import {
  buildMetadata,
  faqSchema,
  jsonLdGraph,
  versandServiceSchema,
  webApplicationSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mietminderung berechnen & Mängelanzeige senden (kostenlos prüfen)",
  description: `Kostenlos prüfen, ob Sie die Miete mindern dürfen: Quote für ${alleMaengel.length} Wohnungsmängel berechnen, Mängelanzeige nach § 536c BGB erstellen und direkt an den Vermieter senden lassen.`,
  path: "/",
  keywords: [
    "Mietminderung",
    "Mietminderung berechnen",
    "Mietminderung prüfen",
    "Mängelanzeige erstellen",
    "Mängelanzeige versenden lassen",
    "Miete mindern",
    "Mietminderungstabelle",
  ],
  alternateLocales: true,
});

export default function Home() {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          webApplicationSchema(),
          versandServiceSchema(),
          faqSchema(faqs)
        )}
      />
      <HomeView locale={DEFAULT_LOCALE} />
    </>
  );
}
