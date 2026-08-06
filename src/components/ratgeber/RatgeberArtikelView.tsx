import Link from "next/link";
import ContentFooter from "@/components/content/ContentFooter";
import ContentHeader from "@/components/content/ContentHeader";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import type { RatgeberSlug } from "@/i18n/pfade";
import { ratgeberSlugsFuer, ratgeberText } from "@/i18n/ratgeber";
import type { RatgeberSectionText } from "@/i18n/ratgeber/typen";
import { DEFAULT_LOCALE, localeHref } from "@/i18n/routing";
import { ts } from "@/i18n/server";
import type { Locale } from "@/i18n/translations";
import { artikelCrumbs } from "@/lib/ratgeberSchema";
import { slugify } from "@/lib/slug";

function SectionBody({ section }: { section: RatgeberSectionText }) {
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
                    ),
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

export default function RatgeberArtikelView({
  locale,
  slug,
  updated,
  readingMinutes,
}: {
  locale: Locale;
  slug: RatgeberSlug;
  updated: string;
  readingMinutes: number;
}) {
  const text = ratgeberText(locale, slug);
  if (!text) return null;

  const sectionIds = text.sections.map((s) => slugify(s.heading));
  const andere = ratgeberSlugsFuer(locale).filter((s) => s !== slug);
  const home = localeHref(locale, "/");

  /**
   * Formatted for the reader's language rather than written out. The previous
   * German page printed a fixed "26. Juli 2026" next to a `dateTime` read from
   * the data, so any article with a different `updated` would have shown a
   * date that was not its own.
   */
  const datum = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(updated),
  );

  return (
    <>
      <ContentHeader locale={locale} />

      <main className="bg-paper-sunken">
        <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
            <div className="[&_a]:text-brand-200 [&_a:hover]:text-white [&_span]:text-brand-100">
              <Breadcrumbs
                crumbs={artikelCrumbs(locale, slug, text.navLabel)}
                locale={locale}
              />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {text.title}
            </h1>
            <p className="mt-5 text-lg text-brand-100 leading-relaxed">
              {text.lead}
            </p>
            <p className="mt-6 text-sm text-brand-200">
              {readingMinutes} {ts(locale, "ratgeber.readingMinutes")} ·{" "}
              {ts(locale, "ratgeber.updatedOn")}{" "}
              <time dateTime={updated}>{datum}</time>
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {locale !== DEFAULT_LOCALE && (
            /*
             * The same statement the legal pages make, for the same reason:
             * this text is about German law, and only the German wording can
             * be relied on. The link out is not decoration — it is the version
             * a reader can take to a landlord or a court.
             */
            <div className="mb-10 rounded-card border-l-4 border-caution-600 bg-caution-50 p-5">
              <p className="text-sm leading-relaxed text-caution-600">
                {ts(locale, "ratgeber.translated")}{" "}
                <Link
                  href={`/ratgeber/${slug}`}
                  hrefLang={DEFAULT_LOCALE}
                  className="font-medium underline underline-offset-2"
                >
                  {ts(locale, "ratgeber.translatedLink")}
                </Link>
              </p>
            </div>
          )}

          <nav
            aria-label={ts(locale, "ratgeber.toc")}
            className="mb-12 rounded-card border border-ink-200 bg-paper-raised p-6"
          >
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500 mb-4">
              {ts(locale, "ratgeber.toc")}
            </h2>
            <ol className="space-y-2">
              {text.sections.map((section, i) => (
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
                  {ts(locale, "ratgeber.faqHeading")}
                </a>
              </li>
            </ol>
          </nav>

          <article className="space-y-12">
            {text.sections.map((section, i) => (
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
                {ts(locale, "ratgeber.faqHeading")}
              </h2>
              <div className="space-y-3">
                {text.faqs.map((faq) => (
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

            <section className="rounded-card bg-gradient-to-br from-brand-800 to-brand-600 p-8 sm:p-12 text-center text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                {ts(locale, "ratgeber.cta.title")}
              </h2>
              <p className="text-brand-100 mb-8 max-w-xl mx-auto">
                {ts(locale, "ratgeber.cta.text")}
              </p>
              <Button href={`${home}#pruefung`} variant="onDark">
                {ts(locale, "ratgeber.cta.button")}
              </Button>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mb-6">
                {ts(locale, "ratgeber.more")}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {andere.map((s) => (
                  <li key={s}>
                    <Link
                      href={localeHref(locale, `/ratgeber/${s}`)}
                      className="block rounded-card border border-ink-200 bg-paper-raised px-5 py-4 text-sm font-medium text-ink-800 hover:border-brand-400 hover:text-brand-700 transition-all"
                    >
                      {ratgeberText(locale, s)?.title ?? s}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <p className="border-t border-ink-200 pt-6 text-xs leading-relaxed text-ink-500">
              {ts(locale, "ratgeber.disclaimer")}
            </p>
          </article>
        </div>
      </main>

      <ContentFooter locale={locale} />
    </>
  );
}
