import type { Metadata } from "next";
import { faqs } from "@/data/maengel";
import FAQPageContent from "./FAQPageContent";

export const metadata: Metadata = {
  title: "Häufige Fragen zur Mietminderung — Mietminderung Online",
  description:
    "Antworten auf die wichtigsten Fragen rund um Mietminderung, Mängelanzeige und Ihre Rechte als Mieter. Kostenlos, verständlich und rechtssicher erklärt.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Häufige Fragen zur Mietminderung — Mietminderung Online",
    description:
      "Antworten auf die wichtigsten Fragen rund um Mietminderung, Mängelanzeige und Ihre Rechte als Mieter.",
    url: "https://mietminderung.online/faq",
    siteName: "Mietminderung Online",
    locale: "de_DE",
    type: "website",
  },
};

export default function FAQPage() {
  // JSON-LD stays German — it is indexed against the German canonical URL.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQPageContent faqs={faqs} />
    </>
  );
}
