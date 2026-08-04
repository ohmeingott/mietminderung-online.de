import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import ContentFooter from "@/components/content/ContentFooter";
import ContentHeader from "@/components/content/ContentHeader";
import JsonLd from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
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
      "Von der Bruttowarmmiete, also der Nettokaltmiete zuzüglich aller Betriebs- und Heizkostenvorauszahlungen. Für die Wohnraummiete hat der Bundesgerichtshof das mit Urteil vom 20. Juli 2005 entschieden (Az. VIII ZR 347/04). Wer von der Kaltmiete rechnet, mindert deutlich weniger, als ihm zusteht.",
  },
  {
    question: "Sind die Prozentwerte in der Tabelle verbindlich?",
    answer:
      "Nein. Es handelt sich um Orientierungswerte aus Gerichtsentscheidungen zu vergleichbaren Fällen. Die tatsächliche Höhe hängt von Art, Dauer, Intensität und Ausmaß der Beeinträchtigung ab. Kein Gericht ist an die Werte anderer Entscheidungen gebunden.",
  },
  {
    question: "Was muss ich tun, bevor ich die Tabelle anwende?",
    answer:
      "Zeigen Sie den Mangel unverzüglich schriftlich beim Vermieter an (§ 536c BGB) und setzen Sie eine konkret datierte Frist zur Beseitigung. Die Minderung entsteht zwar kraft Gesetzes auch ohne Anzeige; ohne sie verlieren Sie das Recht aber insoweit, als der Vermieter gerade deshalb nicht abhelfen konnte, und Sie stehen im Streitfall ohne Nachweis da.",
  },
  {
    question: "Was passiert, wenn ich zu viel mindere?",
    answer:
      "Das Risiko beginnt früher als oft angenommen: Schon ein Rückstand von mehr als einer Monatsmiete an zwei aufeinanderfolgenden Terminen berechtigt zur fristlosen Kündigung (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a i. V. m. § 569 Abs. 3 Nr. 1 BGB). Eine spätere Nachzahlung heilt nur die fristlose, nicht die hilfsweise erklärte ordentliche Kündigung. Sicherer ist es, die volle Miete zunächst unter Vorbehalt zu zahlen und den zu viel gezahlten Betrag später zurückzufordern.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `Mietminderungstabelle 2026: ${alleMaengel.length} Mängel mit Prozentsätzen`,
  description: `Die vollständige Mietminderungstabelle: ${alleMaengel.length} Wohnungsmängel mit Minderungsquoten aus der Rechtsprechung, von Schimmel über Heizungsausfall bis Lärm.`,
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

      <main className="bg-paper-sunken">
        <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
            <div className="[&_a]:text-brand-200 [&_a:hover]:text-white [&_span]:text-brand-100">
              <Breadcrumbs crumbs={crumbs} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Mietminderungstabelle 2026
            </h1>
            <p className="mt-5 text-lg text-brand-100 max-w-3xl leading-relaxed">
              {alleMaengel.length} Wohnungsmängel mit den aus deutschen
              Gerichtsentscheidungen abgeleiteten Minderungsquoten, sortiert nach{" "}
              {kategorieIndex.length} Kategorien. Alle Prozentangaben beziehen
              sich auf die Bruttowarmmiete.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
          {/* Sprungnavigation */}
          <nav aria-label="Kategorien" className="rounded-card border border-ink-200 bg-paper-raised p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500 mb-4">
              Direkt zur Kategorie
            </h2>
            <ul className="flex flex-wrap gap-2">
              {kategorieIndex.map(({ kategorie, seo }) => (
                <li key={seo.slug}>
                  <a
                    href={`#${seo.slug}`}
                    className="inline-flex rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:border-brand-400 hover:text-brand-700 transition-colors"
                  >
                    {kategorie.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section className="rounded-card border-l-4 border-brand-600 bg-paper-raised p-6">
            <h2 className="text-lg font-bold text-ink-900 mb-2">
              So lesen Sie die Tabelle
            </h2>
            <p className="text-ink-700 leading-relaxed">
              Die Spalte <strong>Spanne</strong> zeigt den Bereich, in dem sich
              Gerichtsentscheidungen zu vergleichbaren Fällen bewegen. Die Spalte{" "}
              <strong>typisch</strong> nennt einen häufig angesetzten
              Ausgangswert. Welcher Wert im Einzelfall angemessen ist, hängt von
              Dauer, Intensität und Ausmaß der Beeinträchtigung ab. Im Zweifel
              sollten Sie eher konservativ mindern oder{" "}
              <Link
                href="/ratgeber/miete-unter-vorbehalt-zahlen"
                className="text-brand-700 font-medium hover:underline"
              >
                unter Vorbehalt zahlen
              </Link>
              .
            </p>
          </section>

          {kategorieIndex.map(({ kategorie, seo, maengel }) => (
            <section key={seo.slug} id={seo.slug} className="scroll-mt-24">
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                <h2 className="text-2xl font-bold text-ink-900">
                  {kategorie.label}
                </h2>
                <Link
                  href={`/mietminderung/${seo.slug}`}
                  className="text-sm font-medium text-brand-700 hover:underline"
                >
                  Alle Details zu {kategorie.label} &rarr;
                </Link>
              </div>

              <div className="overflow-x-auto rounded-card border border-ink-200">
                <table className="w-full min-w-[640px] text-sm">
                  <caption className="sr-only">
                    Minderungsquoten für Mängel der Kategorie {kategorie.label}
                  </caption>
                  <thead className="bg-paper-sunken text-ink-600">
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
                  <tbody className="divide-y divide-ink-100 bg-paper-raised">
                    {maengel.map(({ mangel, path }) => (
                      <tr key={path} className="hover:bg-brand-50/40 transition-colors">
                        <th scope="row" className="px-4 py-3 text-left align-top">
                          <Link
                            href={path}
                            className="font-semibold text-brand-700 hover:underline"
                          >
                            {mangel.label}
                          </Link>
                        </th>
                        <td className="px-4 py-3 align-top text-ink-600">
                          {mangel.description}
                        </td>
                        <td className="px-4 py-3 align-top text-right whitespace-nowrap font-medium text-ink-900">
                          {mangel.minderung_min}–{mangel.minderung_max} %
                        </td>
                        <td className="px-4 py-3 align-top text-right whitespace-nowrap">
                          <span className="rounded-field bg-signal-50 px-2 py-1 text-xs font-bold text-signal-700">
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

          <section className="rounded-card bg-gradient-to-br from-brand-800 to-brand-600 p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ihre Minderung automatisch berechnen
            </h2>
            <p className="text-brand-100 mb-8 max-w-xl mx-auto">
              Wählen Sie Ihre Mängel aus, geben Sie Ihre Bruttowarmmiete ein,
              und erhalten Sie sofort die Minderungsquote sowie eine fertige
              Mängelanzeige zum Versenden.
            </p>
            <Button href="/#pruefung" variant="onDark">
              Kostenlos berechnen
            </Button>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink-900 mb-6">
              Häufige Fragen zur Mietminderungstabelle
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-card border border-ink-200 bg-paper-raised"
                >
                  <summary className="cursor-pointer list-none px-5 py-4 marker:hidden flex items-center justify-between gap-4">
                    <h3 className="text-base font-semibold text-ink-900">
                      {faq.question}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-ink-400 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="border-t border-ink-100 px-5 py-4">
                    <p className="text-ink-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <p className="text-xs text-ink-500 leading-relaxed border-t border-ink-200 pt-6">
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
