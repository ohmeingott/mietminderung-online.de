import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import HomeCheckFlow from "@/components/HomeCheckFlow";
import InfoSection from "@/components/InfoSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PopularLinks from "@/components/content/PopularLinks";
import { faqs } from "@/data/maengel";
import { alleMaengel } from "@/lib/mangelIndex";
import {
  buildMetadata,
  faqSchema,
  jsonLdGraph,
  webApplicationSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mietminderung berechnen & Mängelanzeige erstellen — kostenlos",
  description: `Kostenlos prüfen, ob Sie die Miete mindern dürfen: Quote für ${alleMaengel.length} Wohnungsmängel berechnen und in 3 Minuten eine Mängelanzeige nach § 536c BGB erstellen.`,
  path: "/",
  keywords: [
    "Mietminderung",
    "Mietminderung berechnen",
    "Mietminderung prüfen",
    "Mängelanzeige erstellen",
    "Miete mindern",
    "Mietminderungstabelle",
  ],
});

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLdGraph(webApplicationSchema(), faqSchema(faqs))} />

      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <HowItWorks />
          <HomeCheckFlow />
          <InfoSection />
          <PopularLinks />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
