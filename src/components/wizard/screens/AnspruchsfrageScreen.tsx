"use client";

import { ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { eligibilityQuestions } from "@/data/maengel";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * One eligibility question per screen.
 *
 * A real radio group, not buttons with a decorative circle: the previous
 * version never rendered the chosen state, so coming back through *Zurück*
 * showed five blank options and no hint of what had been answered.
 *
 * A pointer answer still advances immediately - that is what makes the first
 * five screens feel like five seconds. Keyboard selection does not, because
 * arrowing through a radio group must be allowed to explore.
 */
export default function AnspruchsfrageScreen() {
  const { state, waehleAntwort, bestaetigeAntwort } = useWizard();
  const { t } = useTranslation();

  const frage = eligibilityQuestions[state.eligibilityStep];
  const gewaehlt = state.antworten[frage.id];

  return (
    <>
      <ScreenHeading title={t(`eq.${frage.id}.q`)} description={t(`eq.${frage.id}.desc`)} />

      <div
        role="radiogroup"
        aria-label={t(`eq.${frage.id}.q`)}
        className="mt-6 space-y-2.5"
      >
        {frage.options.map((option) => {
          const aktiv = gewaehlt === option.value;
          return (
            <label
              key={option.value}
              data-testid={`eq-${frage.id}-${option.value}`}
              /*
               * `detail > 0` is a real tap or click. Keyboard activation of
               * the radio does not click the label, so arrowing through the
               * group records a choice without acting on it - which matters
               * most on the questions where one option ends the flow.
               */
              onClick={(e) => {
                if (e.detail > 0) bestaetigeAntwort(frage.id, option.value, option.eligible);
              }}
              className={`group flex w-full cursor-pointer items-center gap-3.5 rounded-[var(--radius-field)] border px-4 py-3.5 text-start transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500 sm:px-5 ${
                aktiv
                  ? "border-brand-500 bg-brand-50"
                  : "border-ink-200 bg-paper-raised hover:border-brand-400 hover:bg-brand-50"
              }`}
            >
              <input
                type="radio"
                name={frage.id}
                value={option.value}
                checked={aktiv}
                className="sr-only"
                onChange={() => waehleAntwort(frage.id, option.value)}
              />
              <span
                aria-hidden
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                  aktiv ? "border-brand-600" : "border-ink-300 group-hover:border-brand-500"
                }`}
              >
                {aktiv && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
              </span>
              <span className="text-sm font-medium text-ink-800 sm:text-base">
                {t(`eq.${frage.id}.${option.value}`)}
              </span>
            </label>
          );
        })}
      </div>
    </>
  );
}
