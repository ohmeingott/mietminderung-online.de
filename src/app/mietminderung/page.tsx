import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import ContentFooter from "@/components/content/ContentFooter";
import ContentHeader from "@/components/content/ContentHeader";
import JsonLd from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
import { alleMaengel, kategorieIndex, topMaengel } from "@/lib/mangelIndex";
import { absoluteUrl, siteConfig } from "@/lib/site";
import {
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  jsonLdGraph,
  type Crumb,
} from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Startseite", path: "/" },
  { name: "Mietminderung nach Mangel", path: "/mietminderung" },
];

const faqs = [
  {
    question: "Bei welchen Mängeln kann ich die Miete mindern?",
    answer: `Grundsätzlich bei jedem erheblichen Mangel, der die Tauglichkeit der Wohnung zum vertragsgemäßen Gebrauch mindert, vom Heizungsausfall über Schimmel und Lärm bis zum Ungeziefer. Diese Übersicht listet ${siteConfig.mangelCount} Mangelarten in ${kategorieIndex.length} Kategorien mit den jeweils anerkannten Minderungsquoten.`,
  },
  {
    question: "Wie finde ich die richtige Minderungsquote für meinen Fall?",
    answer:
      "Wählen Sie die Kategorie, die zu Ihrem Mangel passt, und öffnen Sie die passende Mangelart. Dort finden Sie die Spanne der von Gerichten anerkannten Quoten, einen Rechner für Ihre Bruttowarmmiete sowie eine Checkliste, wie Sie den Mangel nachweisen.",
  },
  {
    question: "Was ist, wenn mehrere Mängel gleichzeitig vorliegen?",
    answer:
      "Gerichte addieren die Einzelquoten nicht, sondern bewerten in einer Gesamtbetrachtung, wie stark die Wohnung insgesamt in ihrer Tauglichkeit beeinträchtigt ist. Die Summe der Tabellenwerte ist deshalb nur eine grobe Obergrenze; die zuerkannte Gesamtquote liegt regelmäßig darunter und kann 100 Prozent nie überschreiten.",
  },
  {
    question: "Sind die angegebenen Prozentwerte verbindlich?",
    answer:
      "Nein. Es handelt sich um Orientierungswerte aus Gerichtsentscheidungen zu vergleichbaren Fällen. Jeder Einzelfall wird individuell bewertet; die tatsächliche Höhe hängt von Art, Dauer, Intensität und Ausmaß der Beeinträchtigung ab.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `Mietminderung nach Mangelart: ${siteConfig.mangelCount} Mängel mit Quoten`,
  description: `Alle Wohnungsmängel mit anerkannten Minderungsquoten: ${siteConfig.mangelCount} Mangelarten in ${kategorieIndex.length} Kategorien, jeweils mit Rechner und Mängelanzeige-Vorlage.`,
  path: "/mietminderung",
  keywords: [
    "Mietminderung Mängel",
    "Mietminderung Liste",
    "Wohnungsmängel Übersicht",
    "Mietminderung Prozent Tabelle",
    "Mietmangel",
  ],
});

export default function MietminderungHub() {
  const top = topMaengel(12);

  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          {
            "@type": "CollectionPage",
            name: "Mietminderung nach Mangelart",
            description:
              "Alle Wohnungsmängel mit den von Gerichten anerkannten Minderungsquoten, gegliedert nach Kategorien.",
            url: absoluteUrl("/mietminderung"),
            inLanguage: "de-DE",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: kategorieIndex.length,
              itemListElement: kategorieIndex.map((k, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: k.kategorie.label,
                url: absoluteUrl(`/mietminderung/${k.seo.slug}`),
              })),
            },
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
              Mietminderung nach Mangelart
            </h1>
            <p className="mt-5 text-lg text-brand-100 max-w-3xl leading-relaxed">
              Wie viel Prozent Mietminderung stehen Ihnen zu? Diese Übersicht
              führt {alleMaengel.length} Wohnungsmängel in{" "}
              {kategorieIndex.length} Kategorien auf. Zu jedem Mangel finden Sie
              die Spanne der von deutschen Gerichten anerkannten Quoten, eine
              Nachweis-Checkliste und einen Rechner für Ihre Bruttowarmmiete.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/#pruefung" variant="onDark" size="sm">
                Anspruch kostenlos prüfen
              </Button>
              <Button href="/mietminderungstabelle" variant="onDarkGhost" size="sm">
                Zur Mietminderungstabelle
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-ink-900 mb-6">
              Mangelkategorien
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {kategorieIndex.map(({ kategorie, seo, maengel }) => {
                const min = Math.min(...maengel.map((m) => m.mangel.minderung_min));
                const max = Math.max(...maengel.map((m) => m.mangel.minderung_max));
                return (
                  <Link
                    key={seo.slug}
                    href={`/mietminderung/${seo.slug}`}
                    className="group flex flex-col rounded-card border border-ink-200 bg-paper-raised p-6 hover:border-brand-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
                        {kategorie.label}
                      </h3>
                      <span className="shrink-0 rounded-field bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                        {min}–{max} %
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-ink-600 leading-relaxed grow">
                      {seo.intro.split(". ")[0]}.
                    </p>
                    <span className="mt-4 text-xs font-medium text-ink-400">
                      {maengel.length} Mangelarten
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink-900 mb-2">
              Mängel mit den höchsten Minderungsquoten
            </h2>
            <p className="text-ink-600 mb-6">
              Diese Mängel treffen die Bewohnbarkeit am härtesten, und die
              Gerichte bewerten sie entsprechend hoch.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {top.map(({ mangel, path, kategorie }) => (
                <li key={path}>
                  <Link
                    href={path}
                    className="flex h-full flex-col justify-between gap-2 rounded-card border border-ink-200 bg-paper-raised px-4 py-4 hover:border-brand-400 hover:shadow-sm transition-all"
                  >
                    <span className="text-sm font-semibold text-ink-900">
                      {mangel.label}
                    </span>
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs text-ink-400">
                        {kategorie.label}
                      </span>
                      <span className="rounded-field bg-signal-50 px-2 py-1 text-xs font-bold text-signal-700">
                        bis {mangel.minderung_max} %
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-card border border-ink-200 bg-paper-raised p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">
              So funktioniert die Mietminderung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-ink-700 leading-relaxed">
              <p>
                Nach § 536 BGB ist die Miete kraft Gesetzes gemindert, sobald ein
                erheblicher Mangel die Tauglichkeit der Wohnung zum
                vertragsgemäßen Gebrauch beeinträchtigt. Sie brauchen dafür
                weder eine Genehmigung des Vermieters noch einen Gerichtsbeschluss.
              </p>
              <p>
                Durchsetzen lässt sich der Anspruch allerdings erst, wenn der
                Vermieter von dem Mangel weiß. Deshalb ist die Mängelanzeige
                nach § 536c BGB der entscheidende erste Schritt: Ihr Datum ist
                zugleich der Stichtag Ihres Anspruchs.
              </p>
              <p>
                Berechnungsgrundlage ist die Bruttowarmmiete, also die Kaltmiete
                zuzüglich aller Nebenkostenvorauszahlungen. Wer irrtümlich von
                der Kaltmiete ausgeht, mindert deutlich weniger als ihm zusteht.
              </p>
              <p>
                Um das Risiko einer fristlosen Kündigung wegen Zahlungsrückstands
                auszuschließen, empfiehlt sich zunächst die Zahlung unter
                Vorbehalt mit späterer Rückforderung.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/ratgeber/maengelanzeige-schreiben" size="sm">
                Mängelanzeige schreiben
              </Button>
              <Button href="/ratgeber/mietminderung-berechnen" variant="secondary" size="sm">
                Mietminderung berechnen
              </Button>
              <Button href="/ratgeber/mietminderung-ausschluss" variant="secondary" size="sm">
                Wann keine Minderung gilt
              </Button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink-900 mb-6">
              Häufige Fragen
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
        </div>
      </main>

      <ContentFooter />
    </>
  );
}
