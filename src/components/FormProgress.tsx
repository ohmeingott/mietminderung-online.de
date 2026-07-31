"use client";

interface FormProgressProps {
  /** Screens the user has finished. */
  completed: number;
  /** Screens that make up the whole form. */
  total: number;
  /**
   * Names the current position for assistive technology, which has no bar to
   * look at. Not rendered.
   */
  label: string;
}

/**
 * The top edge of a form card, filling as the user works through the form.
 *
 * Render it as the first child of the card, which needs `overflow-hidden` so
 * the bar picks up the rounded corners. Standing on its own between the
 * headline and the card it read as a divider rather than as part of the form,
 * which is why it lives on the card itself.
 *
 * It measures screens, not phases. A phase-based bar crawls through a phase
 * built of several screens and then jumps, which reads as if answering did
 * nothing. Both forms on the landing page use it, so the letter reads as the
 * next chapter of one journey rather than a second kind of tool.
 */
export default function FormProgress({
  completed,
  total,
  label,
}: FormProgressProps) {
  const done = Math.min(Math.max(completed, 0), Math.max(total, 0));
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div
      className="h-1 w-full overflow-hidden bg-ink-200"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${label}, ${percent}%`}
    >
      <div
        className="progress-fill h-full rounded-e-full bg-brand-600"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
