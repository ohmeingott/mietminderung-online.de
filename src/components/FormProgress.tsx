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
 * It rounds nothing itself. A radius is scaled down to the box that carries
 * it, and this box is six pixels tall against a twenty-pixel card corner — so
 * whatever it asked for, it got a near-square end that overhung the card's
 * arc. `FormCard` puts it in a clip layer with the card's own geometry
 * instead, which cuts it along the real corner. Do not render it loose.
 *
 * Standing on its own between the headline and the card it read as a divider
 * rather than as part of the form, which is why it lives on the card itself.
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
      className="h-1 w-full bg-ink-200 sm:h-1.5"
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
