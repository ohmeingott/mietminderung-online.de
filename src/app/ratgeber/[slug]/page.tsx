import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import ContentFooter from "@/components/content/ContentFooter";
import ContentHeader from "@/components/content/ContentHeader";
import JsonLd from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
import {
  getRatgeberBySlug,
  ratgeberArtikel,
  type RatgeberArtikel,
  type RatgeberSection,
} from "@/data/ratgeber";
import { slugify } from "@/lib/slug";
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
  return ratgeberArtikel.map((artikel) => ({ slug: artikel.slug }));
}

type Params = Promise<{ slug: string }>;

function crumbsFor(artikel: RatgeberArtikel): Crumb[] {
  return [
    { name: "Startseite", path: "/" },
    { name: "Ratgeber", path: "/ratgeber" },
    { name: artikel.navLabel, path: `/ratgeber/${artikel.slug}` },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const artikel = getRatgeberBySlug(slug);
  if (!artikel) return {};

  return buildMetadata({
    title: artikel.metaTitle,
    description: artikel.description,
    path: `/ratgeber/${artikel.slug}`,
    keywords: artikel.keywords,
    type: "article",
    publishedTime: artikel.published,
    modifiedTime: artikel.updated,
  });
}

function SectionBody({ section }: { section: RatgeberSection }) {
  return (
    <>
      {section.paragraphs?.map((text) => (
        <p key={text} className="text-ink-700 leading-relaxed mb-4">
          {text}
        </p>
      ))}

      {section.bullets && (
        <ul className="my-5 space-y-2">
          {section.bullets.map((item) => (
            <li key={item} className="flex gap-3 text-ink-700">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600"
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.ordered && (
        <ol className="my-5 space-y-3">
          {section.ordered.map((item, i) => (
            <li key={item} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {i + 1}
              </span>
              <span className="pt-0.5 text-ink-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      )}

      {section.table && (
        <div className="my-6 overflow-x-auto rounded-card border border-ink-200">
          <table className="w-full min-w-[520px] text-sm">
            {section.table.caption && (
              <caption className="bg-paper-sunken px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                {section.table.caption}
              </caption>
            )}
            <thead className="bg-paper-sunken text-ink-600">
              <tr>
                {section.table.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="px-4 py-3 text-left font-semibold"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 bg-paper-raised">
              {section.table.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, ci) =>
                    ci === 0 ? (
                      <th
                        key={cell}
                        scope="row"
                        className="px-4 py-3 text-left font-medium text-ink-900 align-top"
                      >
                        {cell}
                      </th>
                    ) : (
                      <td key={cell} className="px-4 py-3 text-ink-600 align-top">
                        {cell}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.code && (
        <pre className="my-6 overflow-x-auto rounded-card bg-ink-900 p-5 text-xs sm:text-sm leading-relaxed text-ink-100">
          <code>{section.code}</code>
        </pre>
      )}

      {section.note && (
        <div className="my-6 rounded-card border-l-4 border-caution-600 bg-caution-50 p-5">
          <p className="text-sm leading-relaxed text-caution-600">{section.note}</p>
        </div>
      )}
    </>
  );
}

export default async function RatgeberPage({ params }: { params: Params }) {
  const { slug } = await params;
  const artikel = getRatgeberBySlug(slug);
  if (!artikel) notFound();

  const andere = ratgeberArtikel.filter((a) => a.slug !== artikel.slug);
  const sectionIds = artikel.sections.map((s) => slugify(s.heading));

  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          articleSchema({
            headline: artikel.title,
            description: artikel.description,
            path: `/ratgeber/${artikel.slug}`,
            datePublished: artikel.published,
            dateModified: artikel.updated,
            section: "Mietrecht",
          }),
          faqSchema(artikel.faqs),
          breadcrumbSchema(crumbsFor(artikel))
        )}
      />

      <ContentHeader />

      <main className="bg-paper-sunken">
        <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
            <div className="[&_a]:text-brand-200 [&_a:hover]:text-white [&_span]:text-brand-100">
              <Breadcrumbs crumbs={crumbsFor(artikel)} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {artikel.title}
            </h1>
            <p className="mt-5 text-lg text-brand-100 leading-relaxed">
              {artikel.lead}
            </p>
            <p className="mt-6 text-sm text-brand-200">
              {artikel.readingMinutes} Min. Lesezeit · Zuletzt aktualisiert am{" "}
              <time dateTime={artikel.updated}>26. Juli 2026</time>
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Inhaltsverzeichnis */}
          <nav
            aria-label="Inhaltsverzeichnis"
            className="mb-12 rounded-card border border-ink-200 bg-paper-raised p-6"
          >
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500 mb-4">
              Inhalt
            </h2>
            <ol className="space-y-2">
              {artikel.sections.map((section, i) => (
                <li key={section.heading}>
                  <a
                    href={`#${sectionIds[i]}`}
                    className="text-sm text-brand-700 hover:underline"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="text-sm text-brand-700 hover:underline">
                  Häufige Fragen
                </a>
              </li>
            </ol>
          </nav>

          <article className="space-y-12">
            {artikel.sections.map((section, i) => (
              <section
                key={section.heading}
                id={sectionIds[i]}
                className="scroll-mt-24"
              >
                <h2 className="text-2xl font-bold text-ink-900 mb-4">
                  {section.heading}
                </h2>
                <SectionBody section={section} />
              </section>
            ))}

            <section id="faq" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-ink-900 mb-6">
                Häufige Fragen
              </h2>
              <div className="space-y-3">
                {artikel.faqs.map((faq) => (
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
                      <p className="text-ink-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section className="rounded-card bg-gradient-to-br from-brand-800 to-brand-600 p-8 sm:p-12 text-center text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Mängelanzeige in 3 Minuten erstellen
              </h2>
              <p className="text-brand-100 mb-8 max-w-xl mx-auto">
                Anspruch prüfen, Minderungsquote berechnen und ein fertiges
                Schreiben mit allen Pflichtangaben nach § 536c BGB erhalten.
                Kostenlos und ohne Registrierung.
              </p>
              <Button href="/#pruefung" variant="onDark">
                Jetzt kostenlos starten
              </Button>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mb-6">
                Weitere Ratgeber
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {andere.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/ratgeber/${a.slug}`}
                      className="block rounded-card border border-ink-200 bg-paper-raised px-5 py-4 text-sm font-medium text-ink-800 hover:border-brand-400 hover:text-brand-700 transition-all"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <p className="border-t border-ink-200 pt-6 text-xs leading-relaxed text-ink-500">
              Dieser Beitrag dient der allgemeinen Information und stellt keine
              Rechtsberatung dar. Trotz sorgfältiger Recherche kann keine Gewähr
              für Richtigkeit, Vollständigkeit und Aktualität übernommen werden.
              Bei konkreten rechtlichen Fragen wenden Sie sich an einen
              Mieterverein oder einen Fachanwalt für Mietrecht.
            </p>
          </article>
        </div>
      </main>

      <ContentFooter />
    </>
  );
}
