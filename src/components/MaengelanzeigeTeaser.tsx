"use client";

import { ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function MaengelanzeigeTeaser() {
  const { t } = useTranslation();

  const features = [
    t("teaser.feat1"),
    t("teaser.feat2"),
    t("teaser.feat3"),
    t("teaser.feat4"),
    t("teaser.feat5"),
  ];

  return (
    <section
      id="maengelanzeige"
      className="border-y border-ink-200 bg-paper-sunken py-16 sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised p-6 text-center shadow-[var(--shadow-raise)] sm:p-10">
          <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-signal-50">
            <FileText className="h-8 w-8 text-signal-600" aria-hidden />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            {t("teaser.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-ink-600 sm:text-lg">
            {t("teaser.desc")}
          </p>

          <ul className="mx-auto mt-7 max-w-sm space-y-3 text-start">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-signal-600"
                  aria-hidden
                />
                <span className="text-sm text-ink-700 sm:text-base">{feature}</span>
              </li>
            ))}
          </ul>

          <a
            href="#pruefung"
            className="group mt-8 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-full bg-brand-700 px-7 text-base font-semibold text-white shadow-[var(--shadow-raise)] transition-colors hover:bg-brand-800 sm:w-auto"
          >
            {t("teaser.cta")}
            <ArrowRight
              className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180"
              aria-hidden
            />
          </a>
        </div>
      </div>
    </section>
  );
}
