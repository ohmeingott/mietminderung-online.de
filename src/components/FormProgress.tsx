"use client";

import { Check } from "lucide-react";

interface FormProgressProps {
  /** Short label per phase, in order. */
  steps: string[];
  /** Index of the phase the user is currently in. */
  currentStep: number;
  /**
   * Fraction (0–1) of the current phase already completed, for phases made up
   * of several screens. Phases without sub-screens leave this at 0.
   */
  subProgress?: number;
  /** Renders every segment as filled: the user has nothing left to do. */
  complete?: boolean;
}

/**
 * Segmented progress rail: one bar per phase, the active one filling up as the
 * user works through its screens. Replaces separate question/step counters:
 * the segments themselves communicate how far along the form is.
 */
export default function FormProgress({
  steps,
  currentStep,
  subProgress = 0,
  complete = false,
}: FormProgressProps) {
  const fillOf = (index: number) => {
    if (complete || index < currentStep) return 1;
    if (index > currentStep) return 0;
    return Math.min(Math.max(subProgress, 0), 1);
  };

  const percent = Math.round(
    (steps.reduce((sum, _, i) => sum + fillOf(i), 0) / steps.length) * 100,
  );

  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${steps[currentStep]}, ${percent}%`}
    >
      <ol className="flex gap-2">
        {steps.map((label, i) => {
          const done = complete || i < currentStep;
          const active = !complete && i === currentStep;

          return (
            <li key={label} className="min-w-0 flex-1">
              <div
                className={`mb-1.5 hidden items-center gap-1 text-xs sm:flex ${
                  active
                    ? "font-semibold text-brand-700"
                    : done
                      ? "text-ink-500"
                      : "text-ink-400"
                }`}
              >
                {done && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                <span className="truncate">{label}</span>
              </div>
              <div
                className={`h-1.5 w-full overflow-hidden rounded-full ${
                  active ? "bg-brand-100" : "bg-ink-200"
                }`}
              >
                <div
                  className="progress-fill h-full rounded-full bg-brand-600"
                  style={{ width: `${fillOf(i) * 100}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      {/* Truncated labels would hurt most on the phase the user is actually in,
          so mobile shows only that one, at full width. */}
      <p className="mt-2.5 text-center text-sm font-medium text-brand-700 sm:hidden">
        {steps[complete ? steps.length - 1 : currentStep]}
      </p>
    </div>
  );
}
