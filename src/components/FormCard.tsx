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
  padded = true,
  footer,
  children,
}: FormCardProps) {
  return (
    <div
      /*
       * No `overflow` at all. The card used to clip so the progress bar would
       * pick up its rounded corners, but any non-visible overflow - `hidden`
       * and, measurably in Chromium, `clip` too - makes a `position: sticky`
       * descendant resolve against this box instead of the viewport. The box
       * never scrolls, so sticky never activates and the footer silently sits
       * below the fold on every long screen.
       *
       * The two children that touch the edges round themselves instead: the
       * progress bar its top corners, the action bar its bottom ones.
       */
      className={`relative rounded-card border border-ink-200 bg-paper-raised shadow-[var(--shadow-raise)] ${className}`}
    >
      {/*
       * The progress bar paints inside a clip layer rather than rounding its
       * own corners. It is six pixels tall and the card's corner is twenty:
       * CSS scales a radius down to the box that carries it, so the strip
       * could only ever manage a six-pixel corner and visibly overhung the
       * card's arc at both ends. This layer carries the card's own geometry -
       * inset by the 1px border, hence the `calc` - so the strip is cut along
       * the real corner.
       *
       * Absolutely positioned, so it is the containing block of nothing and
       * cannot become the scroll box a `position: sticky` descendant resolves
       * against. That is the whole reason the card itself may not clip.
       */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[calc(var(--radius-card)-1px)]">
        <FormProgress completed={completed} total={total} label={label} />
      </div>
      {/* Holds the height the bar no longer takes in flow. */}
      <div className="h-1 sm:h-1.5" aria-hidden />
      <div
        className={padded ? `p-5 sm:p-10 ${contentClassName}` : contentClassName}
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
          className="safe-bottom sticky bottom-0 z-10 flex items-center justify-between gap-3 rounded-b-card border-t border-ink-200 bg-paper-raised/95 px-5 py-3 backdrop-blur-sm sm:px-10 sm:py-4"
        >
          {footer}
        </div>
      )}
    </div>
  );
}
