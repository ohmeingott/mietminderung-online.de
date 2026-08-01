"use client";

import StepActions from "@/components/wizard/StepActions";
import { useWizard } from "@/components/wizard/WizardContext";
import { ANZAHL_ANSPRUCHSFRAGEN, SCREEN } from "@/components/wizard/screens";
import { eligibilityQuestions } from "@/data/maengel";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * The step controls for whichever screen is showing.
 *
 * Kept in one place so the `data-testid`s stay a single, readable table. They
 * are the ones the suite has always driven - `check-next`, `check-submit`,
 * `letter-next` and the rest - and preserving them is what let the two
 * components merge without rewriting thirty tests.
 */
export default function FooterActions() {
  const {
    state,
    gehZu,
    zurueck,
    weiter,
    zurueckZurFrage,
    bestaetigeAntwort,
    selectedMaengel,
    miete,
    mieterValid,
    vermieterValid,
    starteAnreicherung,
  } = useWizard();
  const { t } = useTranslation();
  const { screen } = state;

  if (screen < ANZAHL_ANSPRUCHSFRAGEN) {
    const frage = eligibilityQuestions[state.eligibilityStep];
    const gewaehlt = state.antworten[frage.id];
    const option = frage.options.find((o) => o.value === gewaehlt);
    return (
      <StepActions
        backTestId={screen > 0 ? "check-eq-back" : undefined}
        backLabel={t("check.back")}
        onBack={screen > 0 ? zurueckZurFrage : undefined}
        /*
         * Only ever seen by someone who chose with the keyboard, or who came
         * back to a question they had already answered. A pointer answer has
         * already moved on by the time this could render.
         */
        nextTestId="check-eq-next"
        nextLabel={t("check.next")}
        onNext={
          option
            ? () => bestaetigeAntwort(frage.id, option.value, option.eligible)
            : undefined
        }
      />
    );
  }

  switch (screen) {
    case SCREEN.MAENGEL:
      return (
        <StepActions
          backTestId="check-back"
          backLabel={t("check.back")}
          // Back into the questions lands on the last one, not the first.
          onBack={() => gehZu(ANZAHL_ANSPRUCHSFRAGEN - 1)}
          nextTestId="check-next"
          nextLabel={t("check.next")}
          onNext={weiter}
          nextDisabled={selectedMaengel.length === 0}
        />
      );

    case SCREEN.MIETE:
      return (
        <StepActions
          backTestId="check-back"
          backLabel={t("check.back")}
          onBack={zurueck}
          nextTestId="check-submit"
          nextLabel={t("check.showResult")}
          onNext={weiter}
          nextDisabled={!state.bruttowarmmiete || miete <= 0}
        />
      );

    case SCREEN.ERGEBNIS:
      return (
        <StepActions
          backTestId="check-back"
          backLabel={t("check.back")}
          onBack={zurueck}
          nextTestId="check-create-letter"
          nextLabel={t("check.createLetter")}
          onNext={weiter}
        />
      );

    case SCREEN.MIETER:
      return (
        <StepActions
          backTestId="letter-back"
          backLabel={t("check.back")}
          onBack={zurueck}
          nextTestId="letter-next"
          nextLabel={t("check.next")}
          onNext={weiter}
          nextDisabled={!mieterValid}
        />
      );

    case SCREEN.VERMIETER:
      return (
        <StepActions
          backTestId="letter-back"
          backLabel={t("check.back")}
          onBack={zurueck}
          nextTestId="letter-next"
          nextLabel={t("check.next")}
          onNext={weiter}
          nextDisabled={!vermieterValid}
        />
      );

    case SCREEN.BESCHREIBUNG:
      return (
        <StepActions
          backTestId="letter-back"
          backLabel={t("check.back")}
          onBack={zurueck}
          nextTestId="letter-preview"
          nextLabel={t("letter.toDeadline")}
          onNext={() => {
            // Fired without awaiting: the rewrite runs while the reader picks
            // a deadline, so the wait for it disappears.
            starteAnreicherung();
            weiter();
          }}
        />
      );

    case SCREEN.FRIST:
      return (
        <StepActions
          backTestId="letter-back"
          backLabel={t("check.back")}
          onBack={zurueck}
          nextTestId="letter-frist-next"
          nextLabel={t("letter.showPreview")}
          onNext={weiter}
        />
      );

    case SCREEN.VORSCHAU:
      return (
        <StepActions
          backTestId="letter-back"
          backLabel={t("check.back")}
          onBack={zurueck}
          nextTestId="letter-delivery"
          nextLabel={t("letter.deliveryOptions")}
          onNext={weiter}
        />
      );

    default:
      return (
        <StepActions
          backTestId="letter-back"
          backLabel={t("letter.backPreview")}
          onBack={zurueck}
        />
      );
  }
}
