"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepActionsProps {
  backTestId?: string;
  backLabel?: string;
  onBack?: () => void;
  nextTestId?: string;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
  /** Replaces the arrow, e.g. with a spinner. */
  nextIcon?: React.ReactNode;
  /** Emphasises the last forward step of the whole journey. */
  nextTone?: "brand" | "signal";
}

/*
 * Smaller type and tighter padding on a phone. At 393 px the back control and
 * the gap leave roughly 260 px for this button, and "Jetzt Mängelanzeige
 * erstellen" at the desktop size wrapped onto three lines.
 */
const NEXT_BASE =
  "inline-flex min-h-[3rem] min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:flex-initial sm:px-6 sm:text-base";

/**
 * The step controls, rendered into the card's footer.
 *
 * One element per control, restyled by breakpoint rather than duplicated: a
 * `lg:hidden` twin next to a `hidden lg:block` one would give two nodes the
 * same `data-testid`, and Playwright's strict mode rejects the second match.
 */
export default function StepActions({
  backTestId,
  backLabel,
  onBack,
  nextTestId,
  nextLabel,
  onNext,
  nextDisabled = false,
  nextIcon,
  nextTone = "brand",
}: StepActionsProps) {
  const ton =
    nextTone === "signal"
      ? "bg-signal-600 hover:bg-signal-700"
      : "bg-brand-700 hover:bg-brand-800";

  return (
    <>
      {/* Always rendered, so the primary keeps its place when there is no
          back control - it must not slide to the start of the row. */}
      {onBack ? (
        <button
          type="button"
          data-testid={backTestId}
          data-wizard-back=""
          onClick={onBack}
          className="inline-flex min-h-[3rem] min-w-[3rem] shrink-0 items-center justify-center gap-2 rounded-full px-2 text-sm text-ink-500 transition-colors hover:text-ink-800 sm:justify-start"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {/*
            Icon only on a phone. The word costs about sixty pixels that the
            primary needs to stay on one line, and the arrow carries the
            meaning on its own - the label stays for screen readers.
          */}
          <span className="hidden sm:inline">{backLabel}</span>
          <span className="sr-only sm:hidden">{backLabel}</span>
        </button>
      ) : (
        <span />
      )}

      {onNext && (
        <button
          type="button"
          data-testid={nextTestId}
          data-wizard-primary=""
          onClick={onNext}
          disabled={nextDisabled}
          className={`${NEXT_BASE} ${ton}`}
        >
          {nextLabel}
          {nextIcon ?? <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />}
        </button>
      )}
    </>
  );
}
