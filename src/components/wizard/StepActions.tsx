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

const NEXT_BASE =
  "inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full px-6 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40";

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
          className="inline-flex min-h-[3rem] items-center gap-2 rounded-full px-2 text-sm text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {backLabel}
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
