"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useWizard } from "@/components/wizard/WizardContext";
import { SCREEN } from "@/components/wizard/screens";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * The number the whole check exists to produce.
 *
 * It used to be the end of one tool and the start of another. It is now the
 * hinge of a single journey: the progress bar carries straight on past it,
 * which is the strongest signal available that nothing new is beginning.
 */
export default function ErgebnisScreen() {
  const {
    selectedMaengel,
    quoteFuer,
    quoteMin,
    quoteMax,
    quoteTypisch,
    ersparnisMin,
    ersparnisMax,
    ersparnisTypisch,
    mangelLabel,
    ueberschriftRef,
    gehZu,
  } = useWizard();
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-signal-50">
          <CheckCircle2 className="h-8 w-8 text-signal-600" aria-hidden />
        </div>
        <h2
          ref={ueberschriftRef}
          tabIndex={-1}
          data-testid="screen-heading"
          className="text-xl font-bold text-ink-900 outline-none sm:text-2xl"
        >
          {t("check.resultTitle")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-field)] border border-brand-200 bg-brand-50 p-5 text-center">
          <p className="text-sm font-medium text-brand-600">{t("check.reductionRate")}</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-brand-800 sm:text-4xl">
            {quoteTypisch}%
          </p>
          <p className="mt-1 text-xs text-brand-500 tabular-nums">
            ({t("check.range")}: {quoteMin}–{quoteMax}%)
          </p>
          {selectedMaengel.length > 1 && (
            <p className="mt-2 text-xs leading-relaxed text-brand-600">
              {t("check.gesamtbetrachtungHint")}
            </p>
          )}
        </div>
        <div className="rounded-[var(--radius-field)] border border-signal-600/20 bg-signal-50 p-5 text-center">
          <p className="text-sm font-medium text-signal-700">{t("check.monthlySavings")}</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-signal-700 sm:text-4xl">
            {ersparnisTypisch.toFixed(0)} €
          </p>
          <p className="mt-1 text-xs text-signal-600 tabular-nums">
            ({t("check.range")}: {ersparnisMin.toFixed(0)}–{ersparnisMax.toFixed(0)} €)
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-field)] border border-caution-600/20 bg-caution-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caution-600" aria-hidden />
        <p className="text-sm text-caution-600">
          <strong>{t("common.note")}:</strong> {t("check.disclaimer")}
        </p>
      </div>

      <div className="mt-7">
        <h3 className="mb-3 font-semibold text-ink-800">{t("check.yourDefects")}</h3>
        <ul className="divide-y divide-ink-200 overflow-hidden rounded-[var(--radius-field)] border border-ink-200">
          {selectedMaengel.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3 bg-paper-raised px-4 py-3"
            >
              <span className="text-sm text-ink-700">{mangelLabel(m)}</span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-brand-700">
                ca. {quoteFuer(m).typical}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/*
        What the next chapter actually produces. These five lines used to sit
        in a teaser section further down the page whose only button sent the
        reader back up here - so they were read before the check, by people who
        could not yet act on them. They belong at the moment of commitment.
      */}
      <div className="mt-7 rounded-[var(--radius-field)] border border-ink-200 bg-paper-sunken p-5">
        {/* `check.nextStep` is not shown alongside it: in every locale that
            string opens with the same "the next step is..." the heading
            already makes, and the bullets say the rest. */}
        <h3 className="text-base font-semibold text-ink-900">{t("check.nextStepTitle")}</h3>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-signal-600" aria-hidden />
              <span className="text-sm text-ink-700">{t(`teaser.feat${i}`)}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => gehZu(SCREEN.MAENGEL)}
        className="mx-auto mt-5 block min-h-[2.75rem] text-sm text-ink-500 transition-colors hover:text-ink-800"
      >
        {t("check.editDefects")}
      </button>
    </>
  );
}
