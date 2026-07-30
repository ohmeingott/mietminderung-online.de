import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import ContentFooter from "@/components/content/ContentFooter";
import ContentHeader from "@/components/content/ContentHeader";
import JsonLd from "@/components/JsonLd";
import { alleMaengel, kategorieIndex } from "@/lib/mangelIndex";
import { absoluteUrl } from "@/lib/site";
import {
  articleSchema,
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  jsonLdGraph,
  type Crumb,
} from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Startseite", path: "/" },
  { name: "Mietminderungstabelle", path: "/mietminderungstabelle" },
];

const faqs = [
  {
    question: "Was ist eine Mietminderungstabelle?",
    answer:
      "Eine Mietminderungstabelle fasst zusammen, welche Minderungsquoten deutsche Gerichte bei bestimmten Wohnungsmängeln zugesprochen haben. Sie hilft bei der Frage, um wie viel Prozent der Bruttowarmmiete Sie mindern können. Verbindlich ist sie nicht, denn jeder Einzelfall wird individuell bewertet.",
  },
  {
    question: "Von welcher Miete wird die Minderung berechnet?",
    answer:
      "Von der Bruttowarmmiete, also der Nettokaltmiete zuzüglich aller Betriebs- und Heizkostenvorauszahlungen. Der Bundesgerichtshof hat das mit Urteil vom 6. April 2005 (Az. XII ZR 225/03) entschieden. Wer von der Kaltmiete rechnet, mindert deutlich weniger, als ihm zusteht.",
  },
  {
    question: "Sind die Prozentwerte in der Tabelle verbindlich?",
    answer:
      "Nein. Es handelt sich um Orientierungswerte aus Gerichtsentscheidungen zu vergleichbaren Fällen. Die tatsächliche Höhe hängt von Art, Dauer, Intensität und Ausmaß der Beeinträchtigung ab. Kein Gericht ist an die Werte anderer Entscheidungen gebunden.",
  },
  {
    question: "Was muss ich tun, bevor ich die Tabelle anwende?",
    answer:
      "Zeigen Sie den Mangel unverzüglich schriftlich beim Vermieter an (§ 536c BGB) und setzen Sie eine konkret datierte Frist zur Beseitigung. Ohne Mängelanzeige besteht in der Regel kein durchsetzbarer Minderungsanspruch.",
  },
  {
    question: "Was passiert, wenn ich zu viel mindere?",
    answer:
      "Entsteht ein Zahlungsrückstand von zwei Monatsmieten, kann der Vermieter das Mietverhältnis fristlos kündigen (§ 543 Abs. 2 Nr. 3 BGB). Sicherer ist es, die volle Miete zunächst unter Vorbehalt zu zahlen und den zu viel gezahlten Betrag später zurückzufordern.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `Mietminderungstabelle 2026: ${alleMaengel.length} Mängel mit Prozentsätzen`,
  description: `Die vollständige Mietminderungstabelle: ${alleMaengel.length} Wohnungsmängel mit den von Gerichten anerkannten Minderungsquoten, von Schimmel über Heizungsausfall bis Lärm.`,
  path: "/mietminderungstabelle",
  keywords: [
    "Mietminderungstabelle",
    "Mietminderung Tabelle",
    "Mietminderung Prozent",
    "Mietminderungstabelle 2026",
    "Minderungsquoten Übersicht",
  ],
  type: "article",
  publishedTime: "2026-03-06",
  modifiedTime: "2026-07-26",
});

export default function MietminderungstabellePage() {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          articleSchema({
            headline: "Mietminderungstabelle 2026",
            description: `Vollständige Übersicht der Minderungsquoten für ${alleMaengel.length} Wohnungsmängel, gegliedert nach Kategorien.`,
            path: "/mietminderungstabelle",
            datePublished: "2026-03-06",
            dateModified: "2026-07-26",
            section: "Mietrecht",
          }),
          {
            "@type": "ItemList",
            name: "Mietminderungstabelle",
            numberOfItems: alleMaengel.length,
            itemListElement: alleMaengel.map((entry, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${entry.mangel.label}: ${entry.mangel.minderung_min}–${entry.mangel.minderung_max} % Mietminderung`,
              url: absoluteUrl(entry.path),
            })),
          },
          faqSchema(faqs),
          breadcrumbSchema(crumbs)
        )}
      />

      <ContentHeader />

      <main className="bg-gray-50">
        <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
            <div className="[&_a]:text-blue-200 [&_a:hover]:text-white [&_span]:text-blue-100">
              <Breadcrumbs crumbs={crumbs} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Mietminderungstabelle 2026
            </h1>
            <p className="mt-5 text-lg text-blue-100 max-w-3xl leading-relaxed">
              {alleMaengel.length} Wohnungsmängel mit den von deutschen
              Gerichten anerkannten Minderungsquoten, sortiert nach{" "}
              {kategorieIndex.length} Kategorien. Alle Prozentangaben beziehen
              sich auf die Bruttowarmmiete.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
          {/* Sprungnavigation */}
          <nav aria-label="Kategorien" className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">
              Direkt zur Kategorie
            </h2>
            <ul className="flex flex-wrap gap-2">
              {kategorieIndex.map(({ kategorie, seo }) => (
                <li key={seo.slug}>
                  <a
                    href={`#${seo.slug}`}
                    className="inline-flex rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
                  >
                    {kategorie.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section className="rounded-2xl border-l-4 border-blue-600 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              So lesen Sie die Tabelle
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Die Spalte <strong>Spanne</strong> zeigt den Bereich, in dem sich
              Gerichtsentscheidungen zu vergleichbaren Fällen bewegen. Die Spalte{" "}
              <strong>typisch</strong> nennt einen häufig angesetzten
              Ausgangswert. Welcher Wert im Einzelfall angemessen ist, hängt von
              Dauer, Intensität und Ausmaß der Beeinträchtigung ab. Im Zweifel
              sollten Sie eher konservativ mindern oder{" "}
              <Link
                href="/ratgeber/miete-unter-vorbehalt-zahlen"
                className="text-blue-700 font-medium hover:underline"
              >
                unter Vorbehalt zahlen
              </Link>
              .
            </p>
          </section>

          {kategorieIndex.map(({ kategorie, seo, maengel }) => (
            <section key={seo.slug} id={seo.slug} className="scroll-mt-24">
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {kategorie.label}
                </h2>
                <Link
                  href={`/mietminderung/${seo.slug}`}
                  className="text-sm font-medium text-blue-700 hover:underline"
                >
                  Alle Details zu {kategorie.label} &rarr;
                </Link>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full min-w-[640px] text-sm">
                  <caption className="sr-only">
                    Minderungsquoten für Mängel der Kategorie {kategorie.label}
                  </caption>
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left font-semibold">
                        Mangel
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-semibold">
                        Beschreibung
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                        Spanne
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                        typisch
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {maengel.map(({ mangel, path }) => (
                      <tr key={path} className="hover:bg-blue-50/40 transition-colors">
                        <th scope="row" className="px-4 py-3 text-left align-top">
                          <Link
                            href={path}
                            className="font-semibold text-blue-700 hover:underline"
                          >
                            {mangel.label}
                          </Link>
                        </th>
                        <td className="px-4 py-3 align-top text-gray-600">
                          {mangel.description}
                        </td>
                        <td className="px-4 py-3 align-top text-right whitespace-nowrap font-medium text-gray-900">
                          {mangel.minderung_min}–{mangel.minderung_max} %
                        </td>
                        <td className="px-4 py-3 align-top text-right whitespace-nowrap">
                          <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                            {mangel.minderung_typical} %
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          <section className="rounded-2xl bg-gradient-to-br from-blue-800 to-blue-600 p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ihre Minderung automatisch berechnen
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Wählen Sie Ihre Mängel aus, geben Sie Ihre Bruttowarmmiete ein,
              und erhalten Sie sofort die Minderungsquote sowie eine fertige
              Mängelanzeige zum Versenden.
            </p>
            <Link
              href="/#pruefung"
              className="inline-flex rounded-xl bg-white px-8 py-3.5 font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
            >
              Kostenlos berechnen
            </Link>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Häufige Fragen zur Mietminderungstabelle
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-gray-200 bg-white"
                >
                  <summary className="cursor-pointer list-none px-5 py-4 marker:hidden flex items-center justify-between gap-4">
                    <h3 className="text-base font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-gray-400 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-200 pt-6">
            Alle Prozentangaben sind Orientierungswerte aus Gerichtsentscheidungen
            zu vergleichbaren Fällen und stellen keine Rechtsberatung dar. Ein
            Anspruch in dieser Höhe lässt sich daraus nicht ableiten. Bei
            konkreten rechtlichen Fragen wenden Sie sich an einen Mieterverein
            oder einen Fachanwalt für Mietrecht. Zuletzt geprüft am 26. Juli 2026.
          </p>
        </div>
      </main>

      <ContentFooter />
    </>
  );
}
