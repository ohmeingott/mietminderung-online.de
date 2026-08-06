"use client";

import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n/LanguageContext";
import { DEFAULT_LOCALE, localeHref } from "@/i18n/routing";
import { PRODUKTE } from "@/lib/ebrief/produkte";
import { VERSAND_PATH } from "@/lib/seo";

/**
 * The homepage section that says the quiet part out loud: this site does not
 * only tell you whether you have a claim, it puts the letter in the post.
 *
 * Written against the `dispatch.*` keys the wizard's own dispatch card already
 * carries in all seven languages, so the offer reads the same wherever the
 * visitor meets it and no sentence had to be translated twice. That matters
 * more here than on most sections: for someone who does not write German
 * fluently, having us produce and post a formal letter to a landlord is worth
 * more than it is to a native speaker, not less.
 *
 * A client component, but still server-rendered into the initial HTML like any
 * other - the crawlable text is unaffected.
 *
 * Prices come from `PRODUKTE`, the record the checkout charges from.
 */

/**
 * Prices are always shown in German formatting, matching `VersandKarte`: the
 * amount is charged in euros by a German operator, and a locale-specific
 * rendering would make the figure here and the figure on the Stripe page look
 * like different numbers.
 */
const euro = (cent: number) =>
  (cent / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export default function VersandTeaser() {
  const { t, locale, dir, steuerhinweis } = useTranslation();
  const home = localeHref(locale, "/");

  const optionen = [
    {
      titel: t("dispatch.brief"),
      preis: euro(PRODUKTE.brief.preisCent),
      text: t("dispatch.subtitle"),
    },
    {
      titel: t("dispatch.einschreiben"),
      preis: euro(PRODUKTE.einwurfEinschreiben.preisCent),
      text: t("dispatch.einschreibenHint"),
    },
  ];

  return (
    <section
      id="versenden"
      className="scroll-mt-24 border-y border-ink-200 bg-paper-sunken py-16 sm:py-24"
      aria-labelledby="versenden-titel"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              {t("versand.teaser.eyebrow")}
            </p>
            <h2
              id="versenden-titel"
              className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-4xl"
            >
              {t("dispatch.title")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
              {t("dispatch.subtitle")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              {t("dispatch.freeStays")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={`${home === "/" ? "" : home}/#pruefung`}>
                {t("hero.cta1")}
              </Button>
              {/*
                The detail page is German-only, so it is offered only to German
                readers. Sending a Turkish visitor from a Turkish page into a
                German one is a worse answer than not offering the link.
              */}
              {locale === DEFAULT_LOCALE && (
                <Button href={VERSAND_PATH} variant="secondary">
                  {t("versand.teaser.more")}
                </Button>
              )}
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {optionen.map((option) => (
              <li
                key={option.titel}
                className="rounded-card border border-ink-200 bg-paper-raised p-5 sm:p-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-bold text-ink-900 sm:text-lg">
                    {option.titel}
                  </h3>
                  <p
                    className="shrink-0 text-lg font-extrabold text-brand-700"
                    dir={dir === "rtl" ? "ltr" : undefined}
                  >
                    {option.preis}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {option.text}
                </p>
              </li>
            ))}
            <li className="text-xs leading-relaxed text-ink-400">
              {steuerhinweis}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
