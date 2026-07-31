"use client";

import { useTranslation } from "@/i18n/LanguageContext";

/**
 * The hero is a headline and nothing else. The check begins immediately below
 * it, so every additional line here is a line the user reads instead of
 * answering the first question.
 */
export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-20 pb-2 sm:pt-24 sm:pb-3">
      {/* Background: warm paper, dotted grid, one soft brand wash */}
      <div className="paper-grid absolute inset-0 -z-10" aria-hidden />
      <div
        className="absolute inset-x-0 -top-40 -z-10 h-[36rem] bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-brand-100)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-[1.75rem] font-bold leading-[1.15] tracking-tight text-ink-900 sm:text-[2.125rem] lg:text-[2.5rem]">
            {t("hero.title1")}{" "}
            <span className="text-brand-600">{t("hero.title2")}</span>{" "}
            {t("hero.title3")}
          </h1>
        </div>
      </div>
    </section>
  );
}
