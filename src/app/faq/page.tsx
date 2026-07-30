import type { Metadata } from "next";
import { faqs } from "@/data/maengel";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  jsonLdGraph,
  type Crumb,
} from "@/lib/seo";
import FAQPageContent from "./FAQPageContent";

const crumbs: Crumb[] = [
  { name: "Startseite", path: "/" },
  { name: "Häufige Fragen", path: "/faq" },
];

export const metadata: Metadata = buildMetadata({
  title: "Mietminderung FAQ: Die wichtigsten Fragen & Antworten",
  description:
    "Antworten auf die wichtigsten Fragen zur Mietminderung: Wie hoch darf sie sein, ab wann gilt sie und muss der Vermieter zustimmen? Erklärt auf Basis des BGB.",
  path: "/faq",
  keywords: [
    "Mietminderung FAQ",
    "Mietminderung Fragen",
    "Mietminderung wie hoch",
    "Mietminderung Vermieter zustimmen",
    "Mietminderung ab wann",
  ],
});

export default function FAQPage() {
  // The structured data stays German - it is indexed against the German
  // canonical URL, whatever UI language the visitor has selected.
  return (
    <>
      <JsonLd data={jsonLdGraph(faqSchema(faqs), breadcrumbSchema(crumbs))} />
      <FAQPageContent faqs={faqs} />
    </>
  );
}
