"use client";

import { AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useWizard } from "@/components/wizard/WizardContext";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * The dead end.
 *
 * Replaces the card entirely rather than sitting inside it: there is no
 * progress left to measure, and a bar above a "no" reads as a promise the
 * screen is not keeping.
 */
export default function NichtBerechtigt() {
  const { state, neuStarten, ueberschriftRef } = useWizard();
  const { t } = useTranslation();

  const grundKey = `eq.reason.${state.notEligibleQuestionId}`;
  const grund = t(grundKey) !== grundKey ? t(grundKey) : t("eq.reason.default");

  return (
    <div className="mx-auto max-w-2xl rounded-card border border-ink-200 bg-paper-raised p-6 text-center shadow-[var(--shadow-raise)] sm:p-10">
      <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-alert-50">
        <XCircle className="h-8 w-8 text-alert-600" aria-hidden />
      </div>
      <h2
        ref={ueberschriftRef}
        tabIndex={-1}
        data-testid="screen-heading"
        className="text-xl font-bold text-ink-900 outline-none sm:text-2xl"
      >
        {t("check.notEligibleTitle")}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-ink-600">{grund}</p>

      <div className="mt-6 flex items-start gap-3 rounded-field border border-caution-600/20 bg-caution-50 p-4 text-start">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caution-600" aria-hidden />
        <p className="text-sm text-caution-600">
          <strong>{t("common.note")}:</strong> {t("check.notEligibleHint")}
        </p>
      </div>

      <Button type="button" onClick={neuStarten} className="mt-7">
        {t("check.tryAgain")}
      </Button>
    </div>
  );
}
