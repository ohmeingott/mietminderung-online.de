"use client";

import { ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { faqs } from "@/data/maengel";
import { useTranslation } from "@/i18n/LanguageContext";
import { localeHref } from "@/i18n/routing";
import FAQAccordion from "./FAQAccordion";

/** Number of questions shown on the landing page before linking to /faq. */
const PREVIEW_COUNT = 6;

export default function FAQSection() {
  const { t, locale } = useTranslation();

  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 sm:text-sm">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden />
            {t("faq.badge")}
          </span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {t("faq.title")}
          </h2>
          <p className="mt-3 text-base text-ink-600 sm:text-lg">{t("faq.subtitle")}</p>
        </div>

        <div className="mt-8 sm:mt-12">
          <FAQAccordion faqs={faqs.slice(0, PREVIEW_COUNT)} />
        </div>

        <div className="mt-8 text-center">
          {/* The FAQ exists in every language, so this stays inside the one
              the visitor is reading. */}
          <Button href={localeHref(locale, "/faq")} variant="secondary" size="sm">
            {t("faq.showAll")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </Button>
        </div>

        <div className="mt-12 rounded-[var(--radius-card)] border border-ink-200 bg-paper-sunken p-6 sm:p-8">
          <h3 className="text-base font-bold text-ink-900 sm:text-lg">
            {t("faq.legal.title")}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            {t("faq.legal.text")}
          </p>
        </div>
      </div>
    </section>
  );
}
