"use client";

import { ArrowRight, CheckCircle2, FileText, Scale } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function Hero() {
  const { t } = useTranslation();

  const stats = [
    { value: "§ 536", label: t("hero.stat1label") },
    { value: t("hero.stat2"), label: t("hero.stat2label") },
    { value: t("hero.stat3"), label: t("hero.stat3label") },
  ];

  const trust = [t("hero.trust1"), t("hero.trust2"), t("hero.trust3")];

  return (
    <section className="relative overflow-hidden pt-24 pb-14 sm:pt-32 sm:pb-20">
      {/* Background: warm paper, dotted grid, one soft brand wash */}
      <div className="paper-grid absolute inset-0 -z-10" aria-hidden />
      <div
        className="absolute inset-x-0 -top-40 -z-10 h-[36rem] bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-brand-100)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1.5 text-xs font-medium text-brand-700 sm:text-sm">
            <Scale className="h-3.5 w-3.5" aria-hidden />
            {t("hero.badge")}
          </span>

          <h1 className="mt-6 text-[2rem] font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-[3.5rem]">
            {t("hero.title1")}{" "}
            <span className="text-brand-600">{t("hero.title2")}</span>{" "}
            {t("hero.title3")}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
            {t("hero.subtitle")}
          </p>

          {/* CTAs — full width and thumb-reachable on phones */}
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <a
              href="#pruefung"
              className="group inline-flex min-h-[3.25rem] items-center justify-center gap-2.5 rounded-full bg-brand-700 px-7 text-base font-semibold text-white shadow-[var(--shadow-raise)] transition-colors hover:bg-brand-800"
            >
              {t("hero.cta1")}
              <ArrowRight
                className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180"
                aria-hidden
              />
            </a>
            <a
              href="#maengelanzeige"
              className="inline-flex min-h-[3.25rem] items-center justify-center gap-2.5 rounded-full border border-ink-200 bg-paper-raised px-7 text-base font-semibold text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <FileText className="h-4.5 w-4.5" aria-hidden />
              {t("hero.cta2")}
            </a>
          </div>

          {/* Trust row — wraps to two lines on narrow screens instead of clipping */}
          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-sm text-ink-500">
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-signal-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Stat strip */}
        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-3 divide-x divide-ink-200 overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised rtl:divide-x-reverse sm:mt-16">
          {stats.map((stat) => (
            <div key={stat.label} className="px-3 py-5 text-center sm:px-6 sm:py-6">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-xl font-bold tracking-tight text-brand-700 sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 block text-[0.6875rem] leading-snug text-ink-500 sm:text-sm">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
