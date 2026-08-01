"use client";

import { Check, ChevronRight } from "lucide-react";
import { useWizard } from "@/components/wizard/WizardContext";
import { ANZAHL_ANSPRUCHSFRAGEN, SCREEN } from "@/components/wizard/screens";
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
 * Where you are, in one line above the card.
 *
 * Deliberately small. The wizard's own progress bar on the card's top edge
 * measures all fourteen screens; this only names the five chapters, so the two
 * readings never contradict each other and neither shouts.
 *
 * Below 768 px the labels would not fit five across - "Mängel & Miete" alone is
 * wider than a fifth of 393 px - so there the row is dots and connectors, with
 * the current chapter named underneath. Nothing is lost: the name you need is
 * the one you are standing on.
 *
 * Above that the steps size themselves by their label rather than taking a
 * fifth of the row each, so a longer name like "Download oder Versand" is
 * spelled out instead of being cut off by a column that ignores it.
 */
export default function WizardStepper() {
  const { state, gehZu } = useWizard();
  const { t } = useTranslation();
  const { screen } = state;

  const aktuellerIndex = PHASEN.findIndex((p) => screen >= p.von && screen <= p.bis);

  return (
    <nav aria-label={t("wizard.progressNav")} className="mb-3 sm:mb-4">
      <ol className="flex items-center">
        {PHASEN.map((phase, i) => {
          const fertig = screen > phase.bis;
          const aktuell = i === aktuellerIndex;
          const label = t(phase.key);

          const kreis = (
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-bold tabular-nums transition-colors ${
                fertig
                  ? "bg-brand-600 text-white"
                  : aktuell
                    ? "border-2 border-brand-600 text-brand-700"
                    : "border border-ink-200 text-ink-300"
              }`}
            >
              {fertig ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
            </span>
          );

          const text = (
            <span
              className={`hidden truncate text-xs md:block ${
                aktuell ? "font-semibold text-brand-700" : fertig ? "text-ink-600" : "text-ink-400"
              }`}
            >
              {label}
            </span>
          );

          return (
            <li
              key={phase.key}
              aria-current={aktuell ? "step" : undefined}
              className={`flex min-w-0 items-center gap-2 ${i === 0 ? "" : "flex-auto"}`}
            >
              {/* The connector belongs to the step it leads into, so the row
                  distributes evenly without a wrapper per gap. It is an arrow
                  rather than a rule: a rule joins two things and says nothing
                  about which comes first, and this row is an order. It sits at
                  the end of its gap so it points at the step it leads into
                  instead of floating between two. */}
              {i > 0 && (
                <span
                  aria-hidden
                  className={`flex min-w-4 flex-1 justify-end ${
                    fertig || aktuell ? "text-brand-400" : "text-ink-300"
                  }`}
                >
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0 rtl:rotate-180"
                    strokeWidth={2.5}
                  />
                </span>
              )}
              {fertig ? (
                <button
                  type="button"
                  onClick={() => gehZu(phase.von)}
                  className="flex min-w-0 items-center gap-2 rounded-full transition-opacity hover:opacity-70"
                >
                  {kreis}
                  {text}
                  <span className="sr-only">, {t("wizard.stateDone")}</span>
                </button>
              ) : (
                /* Not a disabled button: a disabled control is either an empty
                   focus stop or skipped entirely, and it promises an
                   affordance that is not there. */
                <span className="flex min-w-0 items-center gap-2">
                  {kreis}
                  {text}
                  <span className="sr-only">
                    , {aktuell ? t("wizard.stateCurrent") : t("wizard.statePending")}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-2 text-xs font-semibold text-brand-700 md:hidden">
        {t(PHASEN[Math.max(aktuellerIndex, 0)].key)}
      </p>
    </nav>
  );
}
