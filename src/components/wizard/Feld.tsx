"use client";

import { useWizard } from "@/components/wizard/WizardContext";

export const INPUT_CLASSES =
  "w-full min-h-[3rem] rounded-[var(--radius-field)] border border-ink-300 bg-paper-raised px-4 py-3 text-ink-900 transition-colors placeholder:text-ink-300 focus:border-brand-500 focus:outline-none";

interface FeldProps {
  /**
   * A stable, language-independent identifier used for the DOM id and the test
   * id, so selectors keep working when the labels are translated.
   */
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
  autoComplete?: string;
  /** Shown under the field to explain why it is being asked for. */
  hint?: string;
}

export function Feld({
  name,
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
  autoComplete,
  hint,
}: FeldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
        {required && <span className="text-alert-600"> *</span>}
      </label>
      <input
        id={name}
        data-testid={name}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-describedby={hint ? `${name}-hint` : undefined}
        className={INPUT_CLASSES}
      />
      {hint && (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-ink-500">
          {hint}
        </p>
      )}
    </div>
  );
}

interface ScreenHeadingProps {
  title: string;
  description?: string;
  /** Renders as h2; sub-blocks inside a screen use h3. */
  children?: React.ReactNode;
}

/**
 * The heading of the current screen.
 *
 * Focus moves here on every screen change, which is how a screen reader is
 * told that the card now holds something else. `tabIndex={-1}` makes it
 * focusable programmatically without adding a tab stop.
 */
export function ScreenHeading({ title, description, children }: ScreenHeadingProps) {
  const { ueberschriftRef } = useWizard();
  return (
    <>
      <h2
        ref={ueberschriftRef}
        tabIndex={-1}
        data-testid="screen-heading"
        className="text-lg font-bold text-ink-900 outline-none sm:text-xl"
      >
        {title}
      </h2>
      {description && <p className="mt-1.5 text-sm text-ink-500 sm:text-base">{description}</p>}
      {children}
    </>
  );
}
