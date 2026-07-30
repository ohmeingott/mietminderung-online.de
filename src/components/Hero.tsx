"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * Compact hero: title, one benefit line and the trust chips. The interactive
 * check follows directly below, so the hero carries no CTAs of its own.
 */
export default function Hero() {
  const { t } = useTranslation();

  const trust = [t("hero.trust1"), t("hero.trust2"), t("hero.trust3")];

  return (
    <section className="relative overflow-hidden pt-24 pb-4 sm:pt-28 sm:pb-6">
      {/* Background: warm paper, dotted grid, one soft brand wash */}
      <div className="paper-grid absolute inset-0 -z-10" aria-hidden />
      <div
        className="absolute inset-x-0 -top-40 -z-10 h-[36rem] bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-brand-100)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-[1.75rem] font-bold leading-[1.15] tracking-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]">
            {t("hero.title1")}{" "}
            <span className="text-brand-600">{t("hero.title2")}</span>{" "}
            {t("hero.title3")}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
            {t("hero.subtitle")}
          </p>

          {/* Trust row — wraps to two lines on narrow screens instead of clipping */}
          <ul className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-sm text-ink-500">
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-signal-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
