import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import ContentFooter from "@/components/content/ContentFooter";
import ContentHeader from "@/components/content/ContentHeader";
import JsonLd from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
import { ratgeberArtikel } from "@/data/ratgeber";
import { absoluteUrl } from "@/lib/site";
import {
  breadcrumbSchema,
  buildMetadata,
  jsonLdGraph,
  type Crumb,
} from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Startseite", path: "/" },
  { name: "Ratgeber", path: "/ratgeber" },
];

export const metadata: Metadata = buildMetadata({
  title: "Mietminderung Ratgeber: Anleitungen, Muster und Fristen",
  description:
    "Alles zur Mietminderung verständlich erklärt: Mängelanzeige schreiben, Minderung berechnen, unter Vorbehalt zahlen und häufige Fehler vermeiden.",
  path: "/ratgeber",
  keywords: [
    "Mietminderung Ratgeber",
    "Mietrecht Mieter",
    "Mietminderung Anleitung",
    "Mängelanzeige Muster",
  ],
});

export default function RatgeberHub() {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          {
            "@type": "CollectionPage",
            name: "Mietminderung Ratgeber",
            description:
              "Anleitungen und Muster rund um Mietminderung und Mängelanzeige.",
            url: absoluteUrl("/ratgeber"),
            inLanguage: "de-DE",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: ratgeberArtikel.length,
              itemListElement: ratgeberArtikel.map((artikel, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: artikel.title,
                url: absoluteUrl(`/ratgeber/${artikel.slug}`),
              })),
            },
          },
          breadcrumbSchema(crumbs)
        )}
      />

      <ContentHeader />

      <main className="bg-paper-sunken">
        <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
            <div className="[&_a]:text-brand-200 [&_a:hover]:text-white [&_span]:text-brand-100">
              <Breadcrumbs crumbs={crumbs} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Ratgeber Mietminderung
            </h1>
            <p className="mt-5 text-lg text-brand-100 max-w-3xl leading-relaxed">
              Von der ersten Mängelanzeige bis zur Rückforderung zu viel
              gezahlter Miete: Diese Anleitungen erklären Schritt für Schritt
              und ohne Fachjargon, wie Sie Ihr Recht als Mieter nach deutschem
              Mietrecht durchsetzen.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
          <section>
            <h2 className="sr-only">Alle Ratgeber-Artikel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ratgeberArtikel.map((artikel) => (
                <article
                  key={artikel.slug}
                  className="flex flex-col rounded-card border border-ink-200 bg-paper-raised p-6 hover:border-brand-400 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-bold text-ink-900">
                    <Link
                      href={`/ratgeber/${artikel.slug}`}
                      className="hover:text-brand-700 transition-colors"
                    >
                      {artikel.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm text-ink-600 leading-relaxed grow">
                    {artikel.description}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-ink-400">
                    <span>{artikel.readingMinutes} Min. Lesezeit</span>
                    <span aria-hidden="true">·</span>
                    <span>{artikel.faqs.length} beantwortete Fragen</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-card border border-ink-200 bg-paper-raised p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">
              Sie suchen die Quote für einen konkreten Mangel?
            </h2>
            <p className="text-ink-700 leading-relaxed">
              Die Ratgeber erklären das Verfahren. Wie viel Prozent Minderung
              bei Ihrem konkreten Mangel anerkannt sind, steht in der
              Mängelübersicht: Dort ist jeder Mangel einzeln aufgeschlüsselt,
              inklusive Rechner und Nachweis-Checkliste.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/mietminderung" size="sm">
                Mängel A–Z
              </Button>
              <Button href="/mietminderungstabelle" variant="secondary" size="sm">
                Mietminderungstabelle
              </Button>
              <Button href="/faq" variant="secondary" size="sm">
                Häufige Fragen
              </Button>
            </div>
          </section>
        </div>
      </main>

      <ContentFooter />
    </>
  );
}
