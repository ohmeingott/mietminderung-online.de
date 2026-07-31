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
  children: React.ReactNode;
}

/**
 * A form card that carries its own progress bar on the top edge.
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
  children,
}: FormCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised shadow-[var(--shadow-raise)] ${className}`}
    >
      <FormProgress completed={completed} total={total} label={label} />
      <div className={`p-5 sm:p-10 ${contentClassName}`}>{children}</div>
    </div>
  );
}
