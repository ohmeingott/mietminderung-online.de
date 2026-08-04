"use client";

import { Info } from "lucide-react";
import { ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { useTranslation } from "@/i18n/LanguageContext";

export default function MieteScreen() {
  const { state, setBruttowarmmiete } = useWizard();
  const { t } = useTranslation();

  return (
    <>
      <ScreenHeading title={t("check.rentTitle")} description={t("check.rentDesc")} />

      <div className="relative mt-6">
        <label htmlFor="bruttowarmmiete" className="sr-only">
          {t("check.rentTitle")}
        </label>
        <input
          id="bruttowarmmiete"
          data-testid="rent-input"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={state.bruttowarmmiete}
          onChange={(e) => setBruttowarmmiete(e.target.value)}
          placeholder={t("check.rentPlaceholder")}
          className="h-16 w-full rounded-field border border-ink-300 bg-paper-raised px-5 pe-14 text-2xl font-semibold text-ink-900 tabular-nums transition-colors placeholder:font-normal placeholder:text-ink-300 focus:border-brand-500 focus:outline-none"
        />
        <span
          className="pointer-events-none absolute end-5 top-1/2 -translate-y-1/2 text-xl font-medium text-ink-400"
          aria-hidden
        >
          €
        </span>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-field bg-paper-sunken p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden />
        <p className="text-sm text-ink-600">{t("check.rentInfo")}</p>
      </div>
    </>
  );
}
