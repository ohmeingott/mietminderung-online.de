"use client";

import { ArrowRight, HelpCircle } from "lucide-react";
import type { FAQ } from "@/data/maengel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import FAQAccordion from "@/components/FAQAccordion";
import { useTranslation } from "@/i18n/LanguageContext";
import { localeHref } from "@/i18n/routing";

export default function FAQPageContent({ faqs }: { faqs: FAQ[] }) {
  const { t, locale } = useTranslation();
  // Both CTAs must stay inside the language the visitor is reading.
  const home = localeHref(locale, "/");

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16">
          <div className="paper-grid absolute inset-0 -z-10" aria-hidden />
          <div
            className="absolute inset-x-0 -top-40 -z-10 h-[30rem] bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-brand-100)_0%,transparent_70%)]"
            aria-hidden
          />
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1.5 text-xs font-medium text-brand-700 sm:text-sm">
              <HelpCircle className="h-3.5 w-3.5" aria-hidden />
              {t("faq.badge")}
            </span>
            <h1 className="mt-5 text-[1.75rem] font-bold leading-[1.15] tracking-tight text-ink-900 sm:text-5xl">
              {t("faqpage.allTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-ink-600 sm:text-lg">
              {t("faq.subtitle")}
            </p>
          </div>
        </section>

        <section className="pb-16 sm:pb-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <FAQAccordion faqs={faqs} />

            <div className="mt-12 rounded-card border border-ink-200 bg-paper-sunken p-6 sm:p-8">
              <h2 className="text-base font-bold text-ink-900 sm:text-lg">
                {t("faq.legal.title")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {t("faq.legal.text")}
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-card bg-brand-900 p-6 text-center sm:p-10">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                {t("faqpage.cta.title")}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-brand-200 sm:text-base">
                {t("faqpage.cta.desc")}
              </p>
              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
                <Button href={`${home}#pruefung`} variant="onDark">
                  {t("hero.cta1")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </Button>
                <Button href={home} variant="onDarkGhost">
                  {t("common.backHome")}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
