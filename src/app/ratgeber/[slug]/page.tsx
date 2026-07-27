import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import ContentFooter from "@/components/content/ContentFooter";
import ContentHeader from "@/components/content/ContentHeader";
import JsonLd from "@/components/JsonLd";
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
        <p key={text} className="text-gray-700 leading-relaxed mb-4">
          {text}
        </p>
      ))}

      {section.bullets && (
        <ul className="my-5 space-y-2">
          {section.bullets.map((item) => (
            <li key={item} className="flex gap-3 text-gray-700">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
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
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {i + 1}
              </span>
              <span className="pt-0.5 text-gray-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      )}

      {section.table && (
        <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[520px] text-sm">
            {section.table.caption && (
              <caption className="bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                {section.table.caption}
              </caption>
            )}
            <thead className="bg-gray-50 text-gray-600">
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
            <tbody className="divide-y divide-gray-100 bg-white">
              {section.table.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, ci) =>
                    ci === 0 ? (
                      <th
                        key={cell}
                        scope="row"
                        className="px-4 py-3 text-left font-medium text-gray-900 align-top"
                      >
                        {cell}
                      </th>
                    ) : (
                      <td key={cell} className="px-4 py-3 text-gray-600 align-top">
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
        <pre className="my-6 overflow-x-auto rounded-xl bg-gray-900 p-5 text-xs sm:text-sm leading-relaxed text-gray-100">
          <code>{section.code}</code>
        </pre>
      )}

      {section.note && (
        <div className="my-6 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-5">
          <p className="text-sm leading-relaxed text-amber-900">{section.note}</p>
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

      <main className="bg-gray-50">
        <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
            <div className="[&_a]:text-blue-200 [&_a:hover]:text-white [&_span]:text-blue-100">
              <Breadcrumbs crumbs={crumbsFor(artikel)} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {artikel.title}
            </h1>
            <p className="mt-5 text-lg text-blue-100 leading-relaxed">
              {artikel.lead}
            </p>
            <p className="mt-6 text-sm text-blue-200">
              {artikel.readingMinutes} Min. Lesezeit · Zuletzt aktualisiert am{" "}
              <time dateTime={artikel.updated}>26. Juli 2026</time>
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Inhaltsverzeichnis */}
          <nav
            aria-label="Inhaltsverzeichnis"
            className="mb-12 rounded-2xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">
              Inhalt
            </h2>
            <ol className="space-y-2">
              {artikel.sections.map((section, i) => (
                <li key={section.heading}>
                  <a
                    href={`#${sectionIds[i]}`}
                    className="text-sm text-blue-700 hover:underline"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="text-sm text-blue-700 hover:underline">
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.heading}
                </h2>
                <SectionBody section={section} />
              </section>
            ))}

            <section id="faq" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Häufige Fragen
              </h2>
              <div className="space-y-3">
                {artikel.faqs.map((faq) => (
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
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-gradient-to-br from-blue-800 to-blue-600 p-8 sm:p-12 text-center text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Mängelanzeige in 3 Minuten erstellen
              </h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Anspruch prüfen, Minderungsquote berechnen und ein fertiges
                Schreiben mit allen Pflichtangaben nach § 536c BGB erhalten —
                kostenlos und ohne Registrierung.
              </p>
              <Link
                href="/#pruefung"
                className="inline-flex rounded-xl bg-white px-8 py-3.5 font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
              >
                Jetzt kostenlos starten
              </Link>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Weitere Ratgeber
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {andere.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/ratgeber/${a.slug}`}
                      className="block rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-800 hover:border-blue-400 hover:text-blue-700 transition-all"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <p className="border-t border-gray-200 pt-6 text-xs leading-relaxed text-gray-500">
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
