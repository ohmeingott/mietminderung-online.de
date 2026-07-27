import Link from "next/link";
import type { Metadata } from "next";
import { faqs } from "@/data/maengel";
import { ratgeberArtikel } from "@/data/ratgeber";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import ContentFooter from "@/components/content/ContentFooter";
import {
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  jsonLdGraph,
  type Crumb,
} from "@/lib/seo";
import FAQPageClient from "./FAQPageClient";

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
  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={jsonLdGraph(faqSchema(faqs), breadcrumbSchema(crumbs))} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <div className="[&_a]:text-blue-200 [&_a:hover]:text-white [&_span]:text-blue-100">
            <Breadcrumbs crumbs={crumbs} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Häufige Fragen zur Mietminderung
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl">
            Alles, was Sie über Mietminderung wissen müssen — verständlich
            erklärt, basierend auf deutschem Mietrecht und aktueller
            Rechtsprechung.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        {/* What is this website / why it's great */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 mb-4">
              <svg
                className="w-6 h-6 text-blue-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Was ist mietminderung.online?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Wir sind Deutschlands kostenloser Online-Service für
              Mietminderung. In wenigen Minuten prüfen Sie, ob Sie Anspruch auf
              eine Mietminderung haben, berechnen die Höhe und erstellen eine
              rechtssichere Mängelanzeige — ohne Anwalt und ohne versteckte
              Kosten.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 mb-4">
              <svg
                className="w-6 h-6 text-emerald-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Warum mietminderung.online?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Weil Mietrecht kompliziert ist, Ihr Recht aber einfach sein
              sollte. Unsere Minderungsquoten basieren auf über 60 realen
              Gerichtsurteilen. Wir erklären alles in klarer Sprache — auf
              Deutsch, Türkisch, Ukrainisch, Russisch, Arabisch und Polnisch.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-100 mb-4">
              <svg
                className="w-6 h-6 text-violet-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Was kann ich hier tun?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Prüfen Sie Ihren Anspruch mit unserem Schritt-für-Schritt-Check,
              berechnen Sie die Minderungshöhe anhand Ihrer Bruttowarmmiete und
              erstellen Sie eine fertige Mängelanzeige — als PDF, per E-Mail
              oder als echten Brief direkt an Ihren Vermieter.
            </p>
          </div>
        </div>

        {/* Features highlight */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            So unterstützt Sie mietminderung.online
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Kostenlose Anspruchsprüfung",
                desc: "Beantworten Sie wenige Fragen und erfahren Sie sofort, ob Sie mindern dürfen. Kein Login, keine Registrierung.",
              },
              {
                title: "Über 60 Mängelkategorien",
                desc: "Von Schimmel über Heizungsausfall bis Baulärm — alle Quoten basieren auf echten deutschen Gerichtsurteilen.",
              },
              {
                title: "Rechtssichere Mängelanzeige",
                desc: "Wir generieren ein professionelles Schreiben mit allen Pflichtangaben nach § 536c BGB — fertig zum Versenden.",
              },
              {
                title: "Versand per Brief, E-Mail oder PDF",
                desc: "Laden Sie Ihre Mängelanzeige als PDF herunter, senden Sie sie per E-Mail oder als echten Brief per Post.",
              },
              {
                title: "KI-gestützte Textverbesserung",
                desc: "Beschreiben Sie Ihren Mangel in eigenen Worten — unsere KI macht daraus eine juristisch klare Formulierung.",
              },
              {
                title: "6 Sprachen verfügbar",
                desc: "Die gesamte Anwendung ist auf Deutsch, Türkisch, Ukrainisch, Russisch, Arabisch und Polnisch verfügbar.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/#pruefung"
              className="inline-flex px-8 py-3.5 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-700/25"
            >
              Jetzt kostenlos Mietminderung prüfen
            </Link>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
            Alle Fragen & Antworten
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Fundiert beantwortet auf Basis des deutschen Mietrechts (BGB)
          </p>

          <FAQPageClient faqs={faqs} />
        </div>

        {/* CTA bottom */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-600 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ihre Frage war nicht dabei?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Nutzen Sie unseren kostenlosen Mietminderungs-Check auf der
            Startseite. In wenigen Schritten erfahren Sie, ob und wie viel Sie
            mindern können.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#pruefung"
              className="inline-flex justify-center px-8 py-3.5 bg-white text-blue-800 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Zum Mietminderungs-Check
            </Link>
            <Link
              href="/mietminderungstabelle"
              className="inline-flex justify-center px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Zur Mietminderungstabelle
            </Link>
          </div>
        </div>

        {/* Weiterführende Themen */}
        <div className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
            Weiterführende Ratgeber
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Detaillierte Anleitungen zu den wichtigsten Schritten
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratgeberArtikel.map((artikel) => (
              <li key={artikel.slug}>
                <Link
                  href={`/ratgeber/${artikel.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow-sm transition-all"
                >
                  <span className="font-semibold text-gray-900">
                    {artikel.title}
                  </span>
                  <span className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {artikel.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <ContentFooter />
    </div>
  );
}
