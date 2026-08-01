"use client";

import { Check } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * The three benefits, as chips below the wizard card.
 *
 * They used to sit in the hero, above the first question, where they pushed the
 * form down the page and competed with it for the first read. Below the card
 * they cost the form nothing and answer the question a reader asks before
 * investing the first answer: what is this going to cost me. That is why the
 * free chip leads and carries the accent — the rest is reassurance.
 */
export default function TrustChips() {
  const { t } = useTranslation();

  const chips = [t("hero.trust1"), t("hero.trust2"), t("hero.trust3")];

  return (
    <ul
      data-testid="trust-chips"
      className="mt-5 flex flex-wrap items-center justify-center gap-2"
    >
      {chips.map((chip, i) => (
        <li
          key={chip}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium sm:text-sm ${
            i === 0
              ? "border-signal-600/20 bg-signal-50 text-signal-700"
              : "border-ink-200 bg-paper-raised text-ink-600"
          }`}
        >
          <Check
            className={`h-3.5 w-3.5 shrink-0 ${
              i === 0 ? "text-signal-600" : "text-ink-400"
            }`}
            aria-hidden
          />
          {chip}
        </li>
      ))}
    </ul>
  );
}
