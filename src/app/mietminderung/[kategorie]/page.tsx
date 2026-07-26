import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import ContentFooter from "@/components/content/ContentFooter";
import ContentHeader from "@/components/content/ContentHeader";
import JsonLd from "@/components/JsonLd";
import {
  getKategorieBySlug,
  kategorieIndex,
  type KategorieEntry,
} from "@/lib/mangelIndex";
import { absoluteUrl } from "@/lib/site";
import {
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  jsonLdGraph,
  type Crumb,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return kategorieIndex.map((entry) => ({ kategorie: entry.seo.slug }));
}

type Params = Promise<{ kategorie: string }>;

function crumbsFor(entry: KategorieEntry): Crumb[] {
  return [
    { name: "Startseite", path: "/" },
    { name: "Mietminderung nach Mangel", path: "/mietminderung" },
    { name: entry.kategorie.label, path: `/mietminderung/${entry.seo.slug}` },
  ];
}

function buildFaqs(entry: KategorieEntry) {
  const quoten = entry.maengel.map((m) => m.mangel);
  const min = Math.min(...quoten.map((m) => m.minderung_min));
  const max = Math.max(...quoten.map((m) => m.minderung_max));
  const hoechster = [...entry.maengel].sort(
    (a, b) => b.mangel.minderung_max - a.mangel.minderung_max
  )[0];

  return [
    {
      question: `Wie viel Mietminderung ist bei Mängeln der Kategorie ${entry.kategorie.label} möglich?`,
      answer: `Die anerkannten Minderungsquoten in dieser Kategorie reichen von ${min} bis ${max} Prozent der Bruttowarmmiete. Die höchste Quote entfällt auf „${hoechster.mangel.label}“ mit bis zu ${hoechster.mangel.minderung_max} Prozent. Maßgeblich sind stets Dauer, Intensität und Ausmaß der Beeinträchtigung im Einzelfall.`,
    },
    {
      question: `Welche Mängel gehören zur Kategorie ${entry.kategorie.label}?`,
      answer: `Diese Kategorie umfasst ${entry.maengel.length} Mangelarten: ${entry.maengel
        .map((m) => m.mangel.label)
        .join(", ")}.`,
    },
    {
      question: "Was muss ich tun, bevor ich die Miete mindere?",
      answer:
        "Zeigen Sie den Mangel unverzüglich schriftlich beim Vermieter an (§ 536c BGB) und setzen Sie eine konkret datierte Frist zur Beseitigung. Erst ab Kenntnis des Vermieters ist die Minderung praktisch durchsetzbar. Zahlen Sie im Zweifel zunächst unter Vorbehalt weiter, um einen Zahlungsrückstand zu vermeiden.",
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { kategorie } = await params;
  const entry = getKategorieBySlug(kategorie);
  if (!entry) return {};

  const quoten = entry.maengel.map((m) => m.mangel);
  const min = Math.min(...quoten.map((m) => m.minderung_min));
  const max = Math.max(...quoten.map((m) => m.minderung_max));

  return buildMetadata({
    title: `Mietminderung ${entry.seo.titel}: ${min}–${max} % | Alle Quoten`,
    description: `Mietminderung bei ${entry.seo.titel}: ${entry.maengel.length} Mangelarten mit Quoten von ${min} bis ${max} % der Bruttowarmmiete — mit Rechner und Mängelanzeige-Vorlage.`,
    path: `/mietminderung/${entry.seo.slug}`,
    keywords: entry.seo.keywords,
  });
}

export default async function KategoriePage({ params }: { params: Params }) {
  const { kategorie: slug } = await params;
  const entry = getKategorieBySlug(slug);
  if (!entry) notFound();

  const faqs = buildFaqs(entry);
  const sortiert = [...entry.maengel].sort(
    (a, b) => b.mangel.minderung_typical - a.mangel.minderung_typical
  );
  const andereKategorien = kategorieIndex.filter(
    (k) => k.seo.slug !== entry.seo.slug
  );

  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          {
            "@type": "CollectionPage",
            name: `Mietminderung bei ${entry.seo.titel}`,
            description: entry.seo.intro,
            url: absoluteUrl(`/mietminderung/${entry.seo.slug}`),
            inLanguage: "de-DE",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: entry.maengel.length,
              itemListElement: sortiert.map((m, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${m.mangel.label} — ${m.mangel.minderung_min}–${m.mangel.minderung_max} % Mietminderung`,
                url: absoluteUrl(m.path),
              })),
            },
          },
          faqSchema(faqs),
          breadcrumbSchema(crumbsFor(entry))
        )}
      />

      <ContentHeader />

      <main className="bg-gray-50">
        <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
            <div className="[&_a]:text-blue-200 [&_a:hover]:text-white [&_span]:text-blue-100">
              <Breadcrumbs crumbs={crumbsFor(entry)} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Mietminderung bei {entry.seo.titel}
            </h1>
            <p className="mt-5 text-lg text-blue-100 max-w-3xl leading-relaxed">
              {entry.seo.intro}
            </p>
            <p className="mt-6 text-sm text-blue-200">
              {entry.maengel.length} Mangelarten · Quoten von{" "}
              {Math.min(...entry.maengel.map((m) => m.mangel.minderung_min))} % bis{" "}
              {Math.max(...entry.maengel.map((m) => m.mangel.minderung_max))} %
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Alle Mängel dieser Kategorie im Überblick
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortiert.map(({ mangel, path, seo }) => (
                <Link
                  key={path}
                  href={path}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {mangel.label}
                    </h3>
                    <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      {mangel.minderung_min}–{mangel.minderung_max} %
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {mangel.description}
                  </p>
                  <span className="mt-3 text-xs font-medium text-gray-400">
                    Frist zur Beseitigung: ca. {seo.fristTage}{" "}
                    {seo.fristTage === 1 ? "Tag" : "Tage"}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Rechtliche Einordnung
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {entry.seo.rechtliches}
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Voraussetzung für jede Minderung ist eine Mängelanzeige nach
              § 536c BGB. Erst ab Kenntnis des Vermieters ist der Anspruch
              praktisch durchsetzbar — wie Sie diese Anzeige korrekt
              formulieren und nachweisbar zustellen, lesen Sie im{" "}
              <Link
                href="/ratgeber/maengelanzeige-schreiben"
                className="text-blue-700 font-medium hover:underline"
              >
                Ratgeber zur Mängelanzeige
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Häufige Fragen zu {entry.seo.titel}
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

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Weitere Mangelkategorien
            </h2>
            <ul className="flex flex-wrap gap-2">
              {andereKategorien.map((k) => (
                <li key={k.seo.slug}>
                  <Link
                    href={`/mietminderung/${k.seo.slug}`}
                    className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
                  >
                    {k.kategorie.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-blue-800 to-blue-600 p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Prüfen Sie Ihren Anspruch in 3 Minuten
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Wählen Sie Ihre Mängel aus, geben Sie Ihre Bruttowarmmiete ein und
              erhalten Sie eine fertige Mängelanzeige — kostenlos, ohne
              Registrierung.
            </p>
            <Link
              href="/#pruefung"
              className="inline-flex rounded-xl bg-white px-8 py-3.5 font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
            >
              Mietminderung jetzt prüfen
            </Link>
          </section>
        </div>
      </main>

      <ContentFooter />
    </>
  );
}
