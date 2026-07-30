"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * Top of the merged hero/check block: the page's only headline, one short
 * benefit line and the trust chips. The interactive check renders directly
 * below and shares this section's background, so the two read as one unit.
 * The hero carries no heading or CTA of its own beyond the h1.
 */
export default function Hero() {
  const { t } = useTranslation();

  const trust = [t("hero.trust1"), t("hero.trust2"), t("hero.trust3")];

  return (
    <section className="relative pt-20 pb-0 sm:pt-24">
      {/* Background: warm paper, dotted grid, one soft brand wash. Both layers
          start at the section top and bleed downwards past it, so the check
          below sits on the same surface instead of a visible seam. */}
      <div
        className="hero-bleed paper-grid absolute inset-x-0 top-0 -z-10 h-[calc(100%+20rem)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(65%_55%_at_50%_0%,var(--color-brand-100)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-[1.75rem] font-bold leading-[1.15] tracking-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]">
            {t("hero.title1")}{" "}
            <span className="text-brand-600">{t("hero.title2")}</span>{" "}
            {t("hero.title3")}
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-ink-600 sm:text-lg">
            {t("hero.subtitle")}
          </p>

          {/* Trust row - wraps to two lines on narrow screens instead of clipping */}
          <ul className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.8125rem] text-ink-500 sm:text-sm">
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
