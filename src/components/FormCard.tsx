"use client";

import FormProgress from "@/components/FormProgress";

interface FormCardProps {
  /** Screens the user has finished. */
  completed: number;
  /** Screens that make up the whole form. */
  total: number;
  /** Names the current position for assistive technology. */
  label: string;
  /** Extra classes for the card itself, e.g. an entry animation. */
  className?: string;
  /** Extra classes for the padded content area, e.g. a narrower max width. */
  contentClassName?: string;
  /** Chapter name shown above the content, e.g. "Anspruch prüfen". */
  chapter?: string;
  /** Position inside the chapter, e.g. "Schritt 3 von 7". */
  stepText?: string;
  /**
   * Set false for screens that run their own panes to the card edge, such as
   * the two-pane defect picker. The screen then owns its padding.
   */
  padded?: boolean;
  /**
   * The step controls. They live on the card rather than inside each screen so
   * that all screens get the same chrome and the same sticky behaviour.
   */
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * A form card that carries its own progress bar on the top edge and its step
 * controls on the bottom one.
 *
 * Both forms on the landing page build their screens from this, so the bar can
 * never drift apart between them and the letter reads as the next chapter of
 * one journey rather than a second kind of tool.
 */
export default function FormCard({
  completed,
  total,
  label,
  className = "",
  contentClassName = "",
  chapter,
  stepText,
  padded = true,
  footer,
  children,
}: FormCardProps) {
  return (
    <div
      /*
       * `overflow-clip`, not `overflow-hidden`. Both clip to the rounded
       * corners, but `hidden` establishes a scroll container - and a
       * `position: sticky` descendant then sticks to a box that never
       * scrolls, which reads as if sticky were simply ignored. `clip`
       * establishes no such container, so the footer below sticks to the
       * viewport as intended.
       */
      className={`overflow-clip rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised shadow-[var(--shadow-raise)] ${className}`}
    >
      <FormProgress completed={completed} total={total} label={label} />
      {chapter && (
        /*
         * Chapter and position, not "Schritt 11 von 14". The bar above still
         * measures the whole journey; this says where that is in words, which
         * is the part a reader can act on without being put off by the count.
         */
        <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-10 sm:pt-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {chapter}
          </span>
          {stepText && (
            <span className="text-xs tabular-nums text-ink-500">{stepText}</span>
          )}
        </div>
      )}
      <div
        className={
          padded
            ? `p-5 sm:p-10 ${chapter ? "pt-4 sm:pt-5" : ""} ${contentClassName}`
            : contentClassName
        }
      >
        {children}
      </div>
      {footer && (
        /*
         * A sibling of the content, not a child of it: the bar then needs no
         * negative margins to cancel the padding, and because it stays in
         * flow it can never cover the last field.
         */
        <div
          data-testid="wizard-actions"
          className="safe-bottom sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-ink-200 bg-paper-raised/95 px-5 py-3 backdrop-blur-sm sm:px-10 sm:py-4"
        >
          {footer}
        </div>
      )}
    </div>
  );
}
