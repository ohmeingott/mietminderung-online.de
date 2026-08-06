import Link from "next/link";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import ContentFooter from "@/components/content/ContentFooter";
import ContentHeader from "@/components/content/ContentHeader";
import { Button } from "@/components/ui/Button";
import { getRatgeberBySlug } from "@/data/ratgeber";
import { ratgeberSlugsFuer, ratgeberText } from "@/i18n/ratgeber";
import { DEFAULT_LOCALE, localeHref } from "@/i18n/routing";
import { ts } from "@/i18n/server";
import type { Locale } from "@/i18n/translations";
import { hubCrumbs } from "@/lib/ratgeberSchema";

export default function RatgeberHubView({ locale }: { locale: Locale }) {
  const slugs = ratgeberSlugsFuer(locale);
  const home = localeHref(locale, "/");

  return (
    <>
      <ContentHeader locale={locale} />

      <main className="bg-paper-sunken">
        <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
            <div className="[&_a]:text-brand-200 [&_a:hover]:text-white [&_span]:text-brand-100">
              <Breadcrumbs crumbs={hubCrumbs(locale)} locale={locale} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {ts(locale, "ratgeber.hubTitle")}
            </h1>
            <p className="mt-5 text-lg text-brand-100 max-w-3xl leading-relaxed">
              {ts(locale, "ratgeber.hubLead")}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
          {locale !== DEFAULT_LOCALE && (
            <div className="rounded-card border-l-4 border-caution-600 bg-caution-50 p-5">
              <p className="text-sm leading-relaxed text-caution-600">
                {ts(locale, "ratgeber.translated")}{" "}
                <Link
                  href="/ratgeber"
                  hrefLang={DEFAULT_LOCALE}
                  className="font-medium underline underline-offset-2"
                >
                  {ts(locale, "ratgeber.translatedLink")}
                </Link>
              </p>
            </div>
          )}

          <section>
            <h2 className="sr-only">{ts(locale, "ratgeber.allArticles")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {slugs.map((slug) => {
                const text = ratgeberText(locale, slug);
                // `readingMinutes` is a fact about the article, not the
                // language, so it keeps coming from the German source.
                const quelle = getRatgeberBySlug(slug);
                if (!text || !quelle) return null;

                return (
                  <article
                    key={slug}
                    className="flex flex-col rounded-card border border-ink-200 bg-paper-raised p-6 hover:border-brand-400 hover:shadow-md transition-all"
                  >
                    <h3 className="text-lg font-bold text-ink-900">
                      <Link
                        href={localeHref(locale, `/ratgeber/${slug}`)}
                        className="hover:text-brand-700 transition-colors"
                      >
                        {text.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm text-ink-600 leading-relaxed grow">
                      {text.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-ink-400">
                      <span>
                        {quelle.readingMinutes}{" "}
                        {ts(locale, "ratgeber.readingMinutes")}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {text.faqs.length}{" "}
                        {ts(locale, "ratgeber.questionCount")}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/*
            The defect pages this block points at are German-only, so it is
            offered to German readers alone rather than sending everyone else
            to pages they cannot read. It returns for a language once those
            pages are translated.
          */}
          {locale === DEFAULT_LOCALE && (
            <section className="rounded-card border border-ink-200 bg-paper-raised p-6 sm:p-10">
              <h2 className="text-2xl font-bold text-ink-900 mb-4">
                {ts(locale, "ratgeber.quoteTitle")}
              </h2>
              <p className="text-ink-700 leading-relaxed">
                {ts(locale, "ratgeber.quoteText")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/mietminderung" size="sm">
                  Mängel A–Z
                </Button>
                <Button
                  href="/mietminderungstabelle"
                  variant="secondary"
                  size="sm"
                >
                  Mietminderungstabelle
                </Button>
                <Button
                  href={localeHref(locale, "/faq")}
                  variant="secondary"
                  size="sm"
                >
                  {ts(locale, "nav.faq")}
                </Button>
              </div>
            </section>
          )}

          {locale !== DEFAULT_LOCALE && (
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
          )}
        </div>
      </main>

      <ContentFooter locale={locale} />
    </>
  );
}
