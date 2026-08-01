import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import ContentFooter from "@/components/content/ContentFooter";
import ContentHeader from "@/components/content/ContentHeader";
import JsonLd from "@/components/JsonLd";
import { PRODUKTE } from "@/lib/ebrief/produkte";
import {
  articleSchema,
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  jsonLdGraph,
  versandServiceSchema,
  VERSAND_PATH,
  type Crumb,
} from "@/lib/seo";

/**
 * The landing page for the chargeable half of the product.
 *
 * The site was findable for "wie viel Mietminderung bei X" and invisible for
 * everything a tenant searches once they have decided to act — "Mängelanzeige
 * versenden lassen", "Einschreiben online verschicken", "Brief an Vermieter
 * ohne Drucker". Those are the queries with intent behind them, and the only
 * page that answered them was a step inside a client-side wizard that has no
 * URL of its own and therefore cannot rank.
 *
 * Every figure on this page is read from `PRODUKTE`, the record the checkout
 * charges from. A price that lives here as a hardcoded string is a price that
 * silently goes stale.
 */

const LAST_UPDATED = "2026-08-01";
const PUBLISHED = "2026-08-01";

const crumbs: Crumb[] = [
  { name: "Startseite", path: "/" },
  { name: "Mängelanzeige versenden", path: VERSAND_PATH },
];

/** German final-price formatting, the same rendering the checkout card uses. */
const euro = (cent: number) =>
  (cent / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

const briefPreis = euro(PRODUKTE.brief.preisCent);
const einschreibenPreis = euro(PRODUKTE.einwurfEinschreiben.preisCent);

const faqs = [
  {
    question: "Kann ich meine Mängelanzeige hier direkt versenden lassen?",
    answer: `Ja. Sie erstellen die Mängelanzeige kostenlos im Online-Check, und statt sie nur herunterzuladen, können Sie sie von uns drucken und per Post an Ihren Vermieter senden lassen. Als Brief kostet das ${briefPreis}, als Einwurf-Einschreiben ${einschreibenPreis}. Sie brauchen weder Drucker noch Briefmarke und müssen nicht zur Post.`,
  },
  {
    question: "Was kostet der Versand der Mängelanzeige?",
    answer: `Der Brief kostet ${briefPreis}, das Einwurf-Einschreiben ${einschreibenPreis}. Das sind Endpreise, weitere Kosten entstehen nicht. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet. Das Erstellen der Mängelanzeige und der PDF-Download bleiben in jedem Fall kostenlos.`,
  },
  {
    question: "Brief oder Einwurf-Einschreiben — was ist besser?",
    answer:
      "Das hängt davon ab, wie sehr Sie auf einen Zugangsnachweis angewiesen sind. Beim Einwurf-Einschreiben wird der Einwurf in den Briefkasten dokumentiert, Sie haben also einen Beleg dafür, dass die Sendung zugestellt wurde. Beim einfachen Brief haben Sie diesen Nachweis nicht. Weil die Mietminderung praktisch erst ab Kenntnis des Vermieters greift, ist der Zugangsnachweis im Streitfall die entscheidende Frage.",
  },
  {
    question: "Ist das Einwurf-Einschreiben ein Einschreiben mit Unterschrift?",
    answer:
      "Nein. Beim Einwurf-Einschreiben wird dokumentiert, dass die Sendung in den Briefkasten des Empfängers eingeworfen wurde. Es ist kein Übergabe-Einschreiben, bei dem der Empfänger persönlich unterschreibt. Für die Mängelanzeige ist der dokumentierte Einwurf der praktikablere Weg: Ein Übergabe-Einschreiben, das der Vermieter nicht abholt, gilt gerade nicht als zugegangen.",
  },
  {
    question: "Wann wird der Brief verschickt?",
    answer:
      "Nach Ihrer Zahlung wird die Mängelanzeige gedruckt und in die Zustellung gegeben. Eine Bestätigung erhalten Sie per E-Mail an die Adresse, die Sie beim Versand angegeben haben. Sie müssen dafür nichts weiter tun.",
  },
  {
    question: "Muss ich die Mängelanzeige unterschreiben?",
    answer:
      "Die Mängelanzeige ist auch ohne Unterschrift wirksam, § 536c BGB schreibt keine bestimmte Form vor. Sie können im Online-Check trotzdem direkt am Bildschirm unterschreiben; die Unterschrift wird dann mitgedruckt.",
  },
  {
    question: "Kann ich den Versand widerrufen?",
    answer:
      "Damit wir sofort mit dem Druck beginnen dürfen, bestätigen Sie beim Bezahlen ausdrücklich den sofortigen Versandbeginn. Ihr Widerrufsrecht erlischt nach § 356 Abs. 4 BGB in dem Moment, in dem der Brief gedruckt und in die Zustellung gegeben ist. Solange Sie den Bezahlvorgang abbrechen, wird nichts versendet und nichts berechnet.",
  },
  {
    question: "Wird meine Mängelanzeige bei Ihnen gespeichert?",
    answer:
      "Nein. Der Brieftext wird für den Druckauftrag verarbeitet und danach nicht dauerhaft aufbewahrt; auch im Browser wird er nicht gespeichert. Wenn Sie ihn behalten möchten, laden Sie das PDF vor dem Versand herunter — der kostenlose Download bleibt Ihnen in jedem Fall erhalten.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `Mängelanzeige versenden lassen: Brief ab ${briefPreis}`,
  description: `Mängelanzeige online erstellen und von uns an den Vermieter schicken lassen — als Brief (${briefPreis}) oder als Einwurf-Einschreiben mit Zustellnachweis (${einschreibenPreis}). Ohne Drucker, ohne Briefmarke.`,
  path: VERSAND_PATH,
  keywords: [
    "Mängelanzeige versenden",
    "Mängelanzeige versenden lassen",
    "Mängelanzeige Einschreiben",
    "Einwurf-Einschreiben online versenden",
    "Brief an Vermieter online verschicken",
    "Mängelanzeige zustellen",
    "Zugangsnachweis Mängelanzeige",
    "Brief online versenden ohne Drucker",
  ],
  type: "article",
  publishedTime: PUBLISHED,
  modifiedTime: LAST_UPDATED,
});

const schritte = [
  {
    title: "Anspruch prüfen",
    text: "Beantworten Sie ein paar Fragen zu Mietvertrag und Mangel. Der Check sagt Ihnen, ob eine Minderung überhaupt in Betracht kommt und wie hoch die Quote typischerweise ausfällt.",
  },
  {
    title: "Mängelanzeige erstellen",
    text: "Aus Ihren Angaben entsteht ein vollständiges Schreiben mit allen Pflichtangaben nach § 536c BGB: Mangelbeschreibung, Fristsetzung und Vorbehalt der Minderung.",
  },
  {
    title: "Versandart wählen",
    text: `Brief für ${briefPreis} oder Einwurf-Einschreiben für ${einschreibenPreis}. Wir prüfen vorab, ob die Anschrift des Vermieters zustellbar ist, und melden uns, wenn etwas nicht stimmt.`,
  },
  {
    title: "Wir drucken und verschicken",
    text: "Nach der Zahlung geht die Mängelanzeige in den Druck und anschließend in die Zustellung. Die Bestätigung kommt per E-Mail.",
  },
];

export default function MaengelanzeigeVersendenPage() {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          versandServiceSchema(),
          articleSchema({
            headline: "Mängelanzeige versenden lassen",
            description:
              "Mängelanzeige online erstellen und als Brief oder Einwurf-Einschreiben an den Vermieter senden lassen, mit dokumentiertem Einwurf als Zugangsnachweis.",
            path: VERSAND_PATH,
            datePublished: PUBLISHED,
            dateModified: LAST_UPDATED,
            section: "Mietrecht",
          }),
          faqSchema(faqs),
          breadcrumbSchema(crumbs)
        )}
      />

      <ContentHeader />

      <main className="bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
            <div className="[&_a]:text-blue-200 [&_a:hover]:text-white [&_span]:text-blue-100 [&_ol]:text-blue-200">
              <Breadcrumbs crumbs={crumbs} />
            </div>

            <p className="text-sm font-semibold text-blue-200 uppercase tracking-wide">
              Nicht nur prüfen — erledigen
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Mängelanzeige versenden lassen
            </h1>
            <p className="mt-5 text-lg text-blue-100 max-w-3xl leading-relaxed">
              Sie können hier nicht nur nachsehen, ob Ihnen eine Mietminderung
              zusteht. Sie erstellen die Mängelanzeige kostenlos — und wenn Sie
              möchten, drucken wir sie und geben sie an Ihren Vermieter zur
              Post. Ohne Drucker, ohne Briefmarke, ohne Gang zum Briefkasten.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/#pruefung"
                className="inline-flex justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
              >
                Kostenlos prüfen und Schreiben erstellen
              </Link>
              <Link
                href="#preise"
                className="inline-flex justify-center rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Versandarten und Preise
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <article className="lg:col-span-2 space-y-12">
              {/* Warum der Zugang zählt */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Warum es auf den Zugang beim Vermieter ankommt
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Die Mietminderung tritt nach § 536 BGB kraft Gesetzes ein. In
                  der Praxis können Sie sie aber erst ab dem Zeitpunkt
                  durchsetzen, zu dem Ihr Vermieter von dem Mangel weiß.
                  Maßgeblich ist deshalb nicht, wann Sie die Mängelanzeige
                  geschrieben haben, sondern wann sie bei ihm angekommen ist.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Genau daran scheitern viele Fälle. Der Vermieter bestreitet,
                  je etwas erhalten zu haben, und der Mieter kann das Gegenteil
                  nicht belegen. Eine E-Mail ohne Empfangsbestätigung und ein
                  einfacher Brief helfen dann nicht weiter. Wer den Zugang
                  nachweisen kann, verhandelt aus einer völlig anderen Position.
                </p>
                <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-5">
                  <p className="text-sm text-amber-900 leading-relaxed">
                    <strong className="font-semibold">Wichtig: </strong>
                    Ein Übergabe-Einschreiben, das der Vermieter nicht abholt,
                    gilt gerade nicht als zugegangen — der
                    Benachrichtigungszettel im Briefkasten reicht dafür nicht.
                    Beim Einwurf-Einschreiben
                    wird der Einwurf selbst dokumentiert, die Sendung landet also
                    tatsächlich im Briefkasten und das ist belegt.
                  </p>
                </div>
              </section>

              {/* Preise */}
              <section id="preise" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Versandarten und Preise
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Beide Varianten enthalten Druck, Kuvertierung, Porto und
                  Einlieferung. Es sind Endpreise; weitere Kosten entstehen
                  nicht.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-bold text-gray-900">
                      Als Brief
                    </h3>
                    <p className="mt-1 text-3xl font-extrabold text-blue-800">
                      {briefPreis}
                    </p>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                      Wir drucken die Mängelanzeige und geben sie als
                      Standardbrief zur Post. Der schnelle Weg, wenn Sie
                      hauptsächlich Zeit und den Gang zur Post sparen wollen.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-blue-600 bg-white p-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        Als Einwurf-Einschreiben
                      </h3>
                      <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                        mit Nachweis
                      </span>
                    </div>
                    <p className="mt-1 text-3xl font-extrabold text-blue-800">
                      {einschreibenPreis}
                    </p>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                      Zusätzlich wird der Einwurf in den Briefkasten des
                      Vermieters dokumentiert. Die Variante, die Sie im
                      Streitfall vorzeigen können. Kein Übergabe-Einschreiben
                      mit Unterschrift des Empfängers.
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                  Gemäß § 19 UStG wird keine Umsatzsteuer berechnet. Das
                  Erstellen der Mängelanzeige und der Download als PDF sind und
                  bleiben kostenlos — der Versand ist ein Angebot, kein
                  Pflichtprogramm.
                </p>
              </section>

              {/* Ablauf */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  So läuft der Versand ab
                </h2>
                <ol className="space-y-4">
                  {schritte.map((schritt, i) => (
                    <li
                      key={schritt.title}
                      className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <div className="pt-0.5">
                        <h3 className="font-semibold text-gray-900">
                          {schritt.title}
                        </h3>
                        <p className="mt-1 text-gray-700 leading-relaxed">
                          {schritt.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Was im Brief steht */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Was in der Mängelanzeige steht
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Das Schreiben enthält die Angaben, ohne die eine Mängelanzeige
                  ihren Zweck verfehlt:
                </p>
                <ul className="space-y-2">
                  {[
                    "Ihre Anschrift, die Anschrift des Vermieters und die genaue Bezeichnung der Mietsache",
                    "eine konkrete Beschreibung des Mangels, nicht nur seine Bezeichnung",
                    "eine datierte Frist zur Beseitigung, damit der Vermieter weiß, bis wann er handeln muss",
                    "der ausdrückliche Vorbehalt der Mietminderung für die Dauer des Mangels",
                    "der Hinweis auf § 536c BGB, nach dem Sie den Mangel unverzüglich anzeigen müssen",
                  ].map((punkt) => (
                    <li key={punkt} className="flex gap-3 text-gray-700">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                      />
                      <span className="leading-relaxed">{punkt}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  Was eine Mängelanzeige leisten muss und welche Formulierungen
                  sich bewährt haben, steht ausführlich im Ratgeber:{" "}
                  <Link
                    href="/ratgeber/maengelanzeige-schreiben"
                    className="text-blue-700 font-medium hover:underline"
                  >
                    Mängelanzeige schreiben — Muster und Pflichtangaben
                  </Link>
                  .
                </p>
              </section>

              {/* FAQ */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Häufige Fragen zum Versand
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

              <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-200 pt-6">
                Diese Seite informiert über einen Versanddienst und ersetzt
                keine Rechtsberatung. Ob eine Mietminderung in Ihrem Fall
                berechtigt ist und in welcher Höhe, entscheidet sich am
                Einzelfall. Zuletzt geprüft am 1. August 2026.
              </p>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl bg-blue-700 p-6 text-white">
                <h2 className="text-lg font-bold">In 3 Minuten erledigt</h2>
                <p className="mt-2 text-sm text-blue-100 leading-relaxed">
                  Anspruch prüfen, Mängelanzeige erstellen, versenden lassen —
                  in einem Durchgang. Kostenlos und ohne Registrierung; bezahlt
                  wird nur der Versand, wenn Sie ihn wollen.
                </p>
                <Link
                  href="/#pruefung"
                  className="mt-5 inline-flex w-full justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
                >
                  Jetzt kostenlos prüfen
                </Link>
                <dl className="mt-6 space-y-3 border-t border-white/20 pt-5 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-blue-100">Brief</dt>
                    <dd className="font-bold">{briefPreis}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-blue-100">Einwurf-Einschreiben</dt>
                    <dd className="font-bold">{einschreibenPreis}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-blue-100">Prüfung &amp; PDF</dt>
                    <dd className="font-bold">kostenlos</dd>
                  </div>
                </dl>
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
                      Mängelanzeige schreiben: Muster &amp; Pflichtangaben
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ratgeber/mietminderung-berechnen"
                      className="text-blue-700 hover:underline"
                    >
                      Mietminderung berechnen: Formel &amp; Beispiele
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
                      href="/mietminderungstabelle"
                      className="text-blue-700 hover:underline"
                    >
                      Komplette Mietminderungstabelle
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/widerruf"
                      className="text-blue-700 hover:underline"
                    >
                      Widerrufsbelehrung
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
