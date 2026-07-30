import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import ContentFooter from "@/components/content/ContentFooter";
import ContentHeader from "@/components/content/ContentHeader";
import JsonLd from "@/components/JsonLd";
import MinderungRechner from "@/components/content/MinderungRechner";
import {
  alleMaengel,
  getMangelBySlug,
  minderungsBetrag,
  verwandteMaengel,
  type MangelEntry,
} from "@/lib/mangelIndex";
import {
  articleSchema,
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  jsonLdGraph,
  type Crumb,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return alleMaengel.map((entry) => ({
    kategorie: entry.kategorieSeo.slug,
    mangel: entry.seo.slug,
  }));
}

type Params = Promise<{ kategorie: string; mangel: string }>;

const LAST_UPDATED = "2026-07-26";

/** Page-specific FAQ, derived from the defect's own data. */
function buildFaqs(entry: MangelEntry) {
  const { mangel, seo, kategorie } = entry;
  return [
    {
      question: `Wie viel Mietminderung ist bei „${mangel.label}“ möglich?`,
      answer: `Gerichte haben bei diesem Mangel Minderungsquoten zwischen ${mangel.minderung_min} und ${mangel.minderung_max} Prozent der Bruttowarmmiete anerkannt; ein häufig angesetzter Wert liegt bei etwa ${mangel.minderung_typical} Prozent. Das sind Orientierungswerte aus Einzelfällen, keine festen Größen. Die konkrete Höhe hängt von Dauer, Intensität und Ausmaß der Beeinträchtigung ab.`,
    },
    {
      question: `Ab wann kann ich wegen ${mangel.label.toLowerCase()} die Miete mindern?`,
      answer: `Die Minderung tritt nach § 536 BGB kraft Gesetzes ein, praktisch aber erst ab dem Zeitpunkt, zu dem der Vermieter von dem Mangel weiß. Maßgeblich ist deshalb der Zugang Ihrer Mängelanzeige. Setzen Sie darin eine Frist von etwa ${seo.fristTage} ${seo.fristTage === 1 ? "Tag" : "Tagen"} zur Beseitigung.`,
    },
    {
      question: `Muss der Vermieter der Mietminderung zustimmen?`,
      answer: `Nein. Die Mietminderung tritt automatisch ein, sobald ein erheblicher Mangel vorliegt und Sie ihn angezeigt haben. Eine Genehmigung ist nicht erforderlich. Klauseln im Wohnraummietvertrag, die das Minderungsrecht ausschließen, sind nach § 536 Abs. 4 BGB unwirksam.`,
    },
    {
      question: `Wie weise ich den Mangel „${mangel.label}“ nach?`,
      answer: `${seo.dokumentation[0]}. Ergänzend gilt: ${seo.dokumentation[1]?.toLowerCase() ?? "dokumentieren Sie den Mangel fortlaufend mit Datum"}. Denken Sie daran, dass der Mieter das Vorliegen des Mangels beweisen muss. Fangen Sie mit der Dokumentation deshalb am ersten Tag an.`,
    },
    {
      question: `Zählt „${mangel.label}“ zur Kategorie ${kategorie.label}?`,
      answer: `Ja. Weitere Mängel dieser Kategorie mit ihren jeweiligen Minderungsquoten finden Sie in der Übersicht zu ${kategorie.label} sowie in unserer vollständigen Mietminderungstabelle.`,
    },
  ];
}

function crumbsFor(entry: MangelEntry): Crumb[] {
  return [
    { name: "Startseite", path: "/" },
    { name: "Mietminderung nach Mangel", path: "/mietminderung" },
    { name: entry.kategorie.label, path: `/mietminderung/${entry.kategorieSeo.slug}` },
    { name: entry.mangel.label, path: entry.path },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { kategorie, mangel } = await params;
  const entry = getMangelBySlug(kategorie, mangel);
  if (!entry) return {};

  const { mangel: m, seo } = entry;
  // Kept short enough that Google shows the full title (~69 chars worst case)
  // and the full description (~166 chars worst case).
  return buildMetadata({
    title: `Mietminderung bei ${m.label}: ${m.minderung_min}–${m.minderung_max} %`,
    description: `Wie viel Mietminderung bei ${m.label}? ${m.minderung_min}–${m.minderung_max} % der Bruttowarmmiete sind anerkannt, typisch ${m.minderung_typical} %. Mit Rechner und Muster-Mängelanzeige.`,
    path: entry.path,
    keywords: [...seo.keywords, "Mietminderung", "Mietminderungstabelle"],
    type: "article",
    publishedTime: "2026-03-06",
    modifiedTime: LAST_UPDATED,
    // This route ships its own per-defect opengraph-image.tsx.
    ogImage: null,
  });
}

export default async function MangelPage({ params }: { params: Params }) {
  const { kategorie: kategorieSlug, mangel: mangelSlug } = await params;
  const entry = getMangelBySlug(kategorieSlug, mangelSlug);
  if (!entry) notFound();

  const { mangel, seo, kategorie, kategorieSeo } = entry;
  const faqs = buildFaqs(entry);
  const verwandte = verwandteMaengel(entry, 6);
  const beispielMieten = [700, 900, 1200, 1500];

  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          articleSchema({
            headline: `Mietminderung bei ${mangel.label}`,
            description: `Minderungsquote, Nachweisführung und Vorgehen bei ${mangel.label}. Mit Rechner und Muster-Mängelanzeige.`,
            path: entry.path,
            datePublished: "2026-03-06",
            dateModified: LAST_UPDATED,
            section: kategorie.label,
          }),
          faqSchema(faqs),
          breadcrumbSchema(crumbsFor(entry))
        )}
      />

      <ContentHeader />

      <main className="bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
            <div className="[&_a]:text-blue-200 [&_a:hover]:text-white [&_span]:text-blue-100 [&_ol]:text-blue-200">
              <Breadcrumbs crumbs={crumbsFor(entry)} />
            </div>

            <p className="text-sm font-semibold text-blue-200 uppercase tracking-wide">
              {kategorie.label}
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Mietminderung bei {mangel.label}
            </h1>
            <p className="mt-5 text-lg text-blue-100 max-w-3xl leading-relaxed">
              {seo.intro}
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-xl">
              <div className="rounded-xl bg-white/10 backdrop-blur px-4 py-3">
                <dt className="text-xs text-blue-200">Minimum</dt>
                <dd className="text-2xl font-extrabold">
                  {mangel.minderung_min}&nbsp;%
                </dd>
              </div>
              <div className="rounded-xl bg-white px-4 py-3 text-blue-800">
                <dt className="text-xs font-semibold text-blue-600">Typisch</dt>
                <dd className="text-2xl font-extrabold">
                  {mangel.minderung_typical}&nbsp;%
                </dd>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur px-4 py-3">
                <dt className="text-xs text-blue-200">Maximum</dt>
                <dd className="text-2xl font-extrabold">
                  {mangel.minderung_max}&nbsp;%
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <article className="lg:col-span-2 space-y-12">
              {/* Was ist der Mangel */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Wann liegt der Mangel „{mangel.label}“ vor?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {mangel.description} Ein Mangel im Sinne des § 536 Abs. 1 BGB
                  liegt vor, wenn der tatsächliche Zustand der Wohnung negativ
                  vom vertraglich geschuldeten abweicht und die Tauglichkeit zum
                  vertragsgemäßen Gebrauch dadurch mehr als unerheblich gemindert
                  ist.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Typische Anzeichen
                </h3>
                <ul className="space-y-2">
                  {seo.symptome.map((symptom) => (
                    <li key={symptom} className="flex gap-3 text-gray-700">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                      />
                      <span className="leading-relaxed">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Höhe */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Wie viel Mietminderung ist bei {mangel.label} möglich?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Bei {mangel.label.toLowerCase()} bewegen sich die von Gerichten
                  anerkannten Minderungsquoten zwischen{" "}
                  <strong>{mangel.minderung_min} %</strong> und{" "}
                  <strong>{mangel.minderung_max} %</strong> der Bruttowarmmiete.
                  Als Ausgangswert wird häufig etwa{" "}
                  <strong>{mangel.minderung_typical} %</strong> angesetzt.
                  Berechnungsgrundlage ist stets die Bruttowarmmiete, also
                  Kaltmiete zuzüglich aller Nebenkostenvorauszahlungen.
                </p>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <caption className="sr-only">
                      Beispielrechnung: Minderungsbetrag bei {mangel.label} nach
                      Höhe der Bruttowarmmiete
                    </caption>
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left font-semibold">
                          Bruttowarmmiete
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold">
                          bei {mangel.minderung_min} %
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold">
                          bei {mangel.minderung_typical} %
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold">
                          bei {mangel.minderung_max} %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {beispielMieten.map((miete) => (
                        <tr key={miete}>
                          <th
                            scope="row"
                            className="px-4 py-3 text-left font-medium text-gray-900"
                          >
                            {miete} €
                          </th>
                          <td className="px-4 py-3 text-right text-gray-600">
                            {minderungsBetrag(miete, mangel.minderung_min)} €
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                            {minderungsBetrag(miete, mangel.minderung_typical)} €
                          </td>
                          <td className="px-4 py-3 text-right text-gray-600">
                            {minderungsBetrag(miete, mangel.minderung_max)} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Beträge gerundet, pro Monat. Besteht der Mangel nicht den
                  ganzen Monat, wird tagegenau abgerechnet:{" "}
                  <Link
                    href="/ratgeber/mietminderung-berechnen"
                    className="text-blue-700 hover:underline"
                  >
                    zur Berechnungsformel
                  </Link>
                  .
                </p>
              </section>

              {/* Nachweis */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  So dokumentieren Sie den Mangel richtig
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Das Vorliegen des Mangels muss im Streitfall der Mieter
                  beweisen. Fangen Sie mit der Dokumentation deshalb sofort an,
                  nicht erst, wenn es Ärger gibt.
                </p>
                <ol className="space-y-3">
                  {seo.dokumentation.map((schritt, i) => (
                    <li key={schritt} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-gray-700 leading-relaxed">
                        {schritt}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Vorgehen */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  In fünf Schritten zur Mietminderung
                </h2>
                <ol className="space-y-4">
                  {[
                    "Mangel dokumentieren: Fotos, Protokolle und Zeugen sichern, bevor sich der Zustand ändert.",
                    `Mängelanzeige schreiben und dem Vermieter nachweisbar zustellen, mit einer Frist von etwa ${seo.fristTage} ${seo.fristTage === 1 ? "Tag" : "Tagen"} zur Beseitigung.`,
                    "Miete zunächst unter Vorbehalt zahlen, um einen Zahlungsrückstand und damit das Kündigungsrisiko zu vermeiden.",
                    `Minderungsquote bestimmen. Bei diesem Mangel sind etwa ${mangel.minderung_typical} % ein üblicher Ausgangswert; im Zweifel bleiben Sie besser darunter.`,
                    "Nach Beseitigung des Mangels den zu viel gezahlten Betrag zurückfordern und die Minderung einstellen.",
                  ].map((schritt, i) => (
                    <li
                      key={schritt}
                      className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="pt-1 text-gray-700 leading-relaxed">
                        {schritt}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Rechtliches */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Rechtsgrundlage und wichtiger Hinweis
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {kategorieSeo.rechtliches}
                </p>
                <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-5">
                  <p className="text-sm text-amber-900 leading-relaxed">
                    <strong className="font-semibold">Wichtig: </strong>
                    {seo.hinweis}
                  </p>
                </div>
              </section>

              {/* FAQ - answers always in the DOM for indexing */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Häufige Fragen zu {mangel.label}
                </h2>
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-xl border border-gray-200 bg-white"
                    >
                      <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-gray-900 marker:hidden flex items-center justify-between gap-4">
                        <h3 className="text-base font-semibold">
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
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* Verwandte Mängel */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Verwandte Mängel und ihre Minderungsquoten
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {verwandte.map((rel) => (
                    <li key={rel.path}>
                      <Link
                        href={rel.path}
                        className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-blue-400 hover:shadow-sm transition-all"
                      >
                        <span className="text-sm font-medium text-gray-800">
                          {rel.mangel.label}
                        </span>
                        <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                          {rel.mangel.minderung_min}–{rel.mangel.minderung_max} %
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  Alle Kategorien im Überblick:{" "}
                  <Link
                    href={`/mietminderung/${kategorieSeo.slug}`}
                    className="text-blue-700 font-medium hover:underline"
                  >
                    {kategorie.label}
                  </Link>{" "}
                  ·{" "}
                  <Link
                    href="/mietminderungstabelle"
                    className="text-blue-700 font-medium hover:underline"
                  >
                    komplette Mietminderungstabelle
                  </Link>
                </p>
              </section>

              <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-200 pt-6">
                Die genannten Prozentwerte sind Orientierungswerte aus
                Gerichtsentscheidungen zu vergleichbaren Fällen. Jeder Einzelfall
                wird individuell bewertet; ein Anspruch in dieser Höhe lässt sich
                daraus nicht ableiten. Diese Seite ersetzt keine Rechtsberatung.
                Zuletzt geprüft am 26. Juli 2026.
              </p>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <MinderungRechner
                min={mangel.minderung_min}
                max={mangel.minderung_max}
                typical={mangel.minderung_typical}
                label={mangel.label}
              />

              <div className="rounded-2xl bg-blue-700 p-6 text-white">
                <h2 className="text-lg font-bold">Mängelanzeige erstellen</h2>
                <p className="mt-2 text-sm text-blue-100 leading-relaxed">
                  Prüfen Sie in wenigen Minuten Ihren Anspruch und erstellen Sie
                  ein fertiges Schreiben mit allen Pflichtangaben nach § 536c
                  BGB. Kostenlos und ohne Registrierung.
                </p>
                <Link
                  href="/#pruefung"
                  className="mt-5 inline-flex w-full justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
                >
                  Jetzt kostenlos prüfen
                </Link>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Weiterlesen
                </h2>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <Link
                      href="/ratgeber/maengelanzeige-schreiben"
                      className="text-blue-700 hover:underline"
                    >
                      Mängelanzeige schreiben: Muster & Pflichtangaben
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ratgeber/mietminderung-berechnen"
                      className="text-blue-700 hover:underline"
                    >
                      Mietminderung berechnen: Formel & Beispiele
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ratgeber/miete-unter-vorbehalt-zahlen"
                      className="text-blue-700 hover:underline"
                    >
                      Miete unter Vorbehalt zahlen
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ratgeber/mietminderung-ausschluss"
                      className="text-blue-700 hover:underline"
                    >
                      Wann die Mietminderung ausgeschlossen ist
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <ContentFooter />
    </>
  );
}
