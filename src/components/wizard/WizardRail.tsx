"use client";

import { Check } from "lucide-react";
import { useWizard } from "@/components/wizard/WizardContext";
import { ANZAHL_ANSPRUCHSFRAGEN, SCREEN } from "@/components/wizard/screens";
import { formatiereDatum } from "@/lib/brief/frist";
import { useTranslation } from "@/i18n/LanguageContext";

interface Phase {
  key: string;
  von: number;
  bis: number;
}

/** Five phases, not fourteen screens. Fourteen is a number people leave over. */
const PHASEN: Phase[] = [
  { key: "wizard.phase1", von: 0, bis: ANZAHL_ANSPRUCHSFRAGEN - 1 },
  { key: "wizard.phase2", von: SCREEN.MAENGEL, bis: SCREEN.MIETE },
  { key: "wizard.phase3", von: SCREEN.ERGEBNIS, bis: SCREEN.ERGEBNIS },
  { key: "wizard.phase4", von: SCREEN.MIETER, bis: SCREEN.FRIST },
  { key: "wizard.phase5", von: SCREEN.VORSCHAU, bis: SCREEN.FERTIG },
];

/**
 * The wide-screen companion column.
 *
 * Two jobs that are each only half a column's worth on their own: a phase list
 * that carries the first five screens, where there is no data to show yet, and
 * a running summary that carries the last six, where the phase name alone says
 * nothing new. Together the column is never empty and never redundant.
 *
 * Hidden below `lg`. On a phone the running total already lives in the defect
 * screen's own summary, and a second copy would just cost thumb-scroll.
 */
export default function WizardRail({ className = "" }: { className?: string }) {
  const { state, selectedMaengel, quoteTypisch, ersparnisTypisch, fristTage, gehZu, mangelLabel } =
    useWizard();
  const { t } = useTranslation();

  const { screen } = state;
  const zeigeZahlen = selectedMaengel.length > 0 && screen !== SCREEN.ERGEBNIS;

  return (
    <aside aria-labelledby="wizard-rail-heading" className={`hidden lg:block ${className}`}>
      <h2 id="wizard-rail-heading" className="sr-only">
        {t("wizard.railHeading")}
      </h2>

      <nav aria-label={t("wizard.progressNav")}>
        <ol className="space-y-0.5">
          {PHASEN.map((phase, i) => {
            const fertig = screen > phase.bis;
            const aktuell = screen >= phase.von && screen <= phase.bis;
            const label = t(phase.key);

            if (fertig) {
              return (
                <li key={phase.key}>
                  <button
                    type="button"
                    onClick={() => gehZu(phase.von)}
                    className="flex w-full items-center gap-3 rounded-[var(--radius-field)] px-3 py-2.5 text-start transition-colors hover:bg-paper-sunken"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-800">
                      {label}
                    </span>
                    <span className="sr-only">, {t("wizard.stateDone")}</span>
                  </button>
                </li>
              );
            }

            if (aktuell) {
              return (
                <li
                  key={phase.key}
                  aria-current="step"
                  className="relative flex items-center gap-3 rounded-[var(--radius-field)] bg-brand-50 px-3 py-2.5 before:absolute before:inset-y-1 before:start-0 before:w-1 before:rounded-full before:bg-brand-600"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-brand-600 text-[0.625rem] font-bold tabular-nums text-brand-700">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-brand-800">
                    {label}
                  </span>
                  <span className="sr-only">, {t("wizard.stateCurrent")}</span>
                </li>
              );
            }

            // Plain list items, not disabled buttons: a disabled control is
            // either an empty focus stop or skipped entirely, and it promises
            // an affordance that is not there.
            return (
              <li
                key={phase.key}
                className="flex items-center gap-3 rounded-[var(--radius-field)] px-3 py-2.5"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink-200 text-[0.625rem] font-bold tabular-nums text-ink-300">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink-400">{label}</span>
                <span className="sr-only">, {t("wizard.statePending")}</span>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-6 border-t border-ink-200 pt-5">
        {selectedMaengel.length === 0 ? (
          <ul className="space-y-2">
            {["wizard.trust1", "wizard.trust2", "wizard.trust3"].map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-ink-500">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal-600" aria-hidden />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
              {t("wizard.summaryTitle")}
            </p>
            {zeigeZahlen && (
              <dl className="mt-3 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <dt className="text-sm text-ink-500">{t("wizard.sumQuote")}</dt>
                  {/*
                    A regular space before the unit, deliberately. The result
                    card is asserted with an exact "80%" / "800 €" scoped to
                    this whole section, and a second node reading the same
                    would be a strict-mode violation on desktop only.
                  */}
                  <dd className="text-lg font-bold tabular-nums text-brand-700">
                    {quoteTypisch} %
                  </dd>
                </div>
                {ersparnisTypisch > 0 && (
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-sm text-ink-500">{t("wizard.sumSaving")}</dt>
                    <dd className="text-lg font-bold tabular-nums text-signal-700">
                      −{ersparnisTypisch.toFixed(0)} €
                    </dd>
                  </div>
                )}
                {screen >= SCREEN.FRIST && (
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-sm text-ink-500">{t("wizard.sumDeadline")}</dt>
                    <dd className="text-sm font-semibold tabular-nums text-ink-800">
                      {formatiereDatum(
                        new Date(new Date().setDate(new Date().getDate() + fristTage))
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            )}
            <ul className="mt-4 space-y-1.5">
              {selectedMaengel.map((m) => (
                <li key={m.id} className="flex items-start gap-2 text-xs leading-relaxed text-ink-600">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-600" aria-hidden />
                  <span className="min-w-0">{mangelLabel(m)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </aside>
  );
}
