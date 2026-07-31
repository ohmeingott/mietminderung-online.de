"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, BellRing, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";
import { CASE_SAVE_CONSENT_VERSION } from "@/lib/consent";
import { track } from "@/lib/track";
import type { CaseSubmission } from "@/types/case";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface CaseOptInCardProps {
  defaultEmail: string;
  tenantName: string;
  tenantCity: string;
  tenantPlz: string;
  bruttowarmmiete: number;
  /** ISO yyyy-mm-dd — must equal the Frist printed in the letter. */
  deadlineDateIso: string;
  /** German-formatted deadline for display (dd.mm.yyyy). */
  deadlineDateDisplay: string;
  eligibilityAnswers: Record<string, string>;
  maengel: Array<{ id: string; raum: string; seit: string; beschreibung: string }>;
}

type SubmitState = "idle" | "submitting" | "success" | "error" | "rate_limited";

/**
 * Opt-in card on the delivery step: save the case + reminder emails when
 * the landlord's deadline expires. Strictly optional (Art. 7 Abs. 4 DSGVO
 * Koppelungsverbot — downloads never depend on it), unchecked by default
 * (Art. 7 Abs. 2), and never fire-and-forget: failures surface with a
 * retry button.
 */
export default function CaseOptInCard(props: CaseOptInCardProps) {
  const { t, locale } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState(props.defaultEmail);
  const [state, setState] = useState<SubmitState>("idle");

  const emailValid = EMAIL_PATTERN.test(email);
  const canSubmit = checked && emailValid && state !== "submitting";

  const withDeadline = (text: string) =>
    text.replace("{frist}", props.deadlineDateDisplay);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setState("submitting");

    const body: CaseSubmission = {
      tenant: {
        name: props.tenantName,
        email,
        city: props.tenantCity,
        plz: props.tenantPlz,
      },
      locale,
      consentVersion: CASE_SAVE_CONSENT_VERSION,
      case: {
        bruttowarmmiete: props.bruttowarmmiete,
        deadlineDate: props.deadlineDateIso,
        eligibilityAnswers: props.eligibilityAnswers,
        maengel: props.maengel,
      },
    };

    try {
      const res = await fetch("/api/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        track("case_saved", locale);
        setState("success");
      } else if (res.status === 429) {
        setState("rate_limited");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div
        data-testid="case-optin-success"
        className="mt-6 rounded-[var(--radius-field)] border border-signal-600/20 bg-signal-50 p-5"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-signal-600"
            aria-hidden
          />
          <div>
            <p className="font-semibold text-ink-900">
              {t("case.optinSuccessTitle")}
            </p>
            <p className="mt-1.5 text-sm text-ink-600">
              {t("case.optinSuccessText").replace("{email}", email)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="case-optin-card"
      className="mt-6 rounded-[var(--radius-field)] border border-brand-200 bg-brand-50 p-5"
    >
      <div className="flex items-start gap-3">
        <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden />
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-ink-900">{t("case.optinTitle")}</h4>
          <p className="mt-1.5 text-sm text-ink-600">
            {withDeadline(t("case.optinPitch"))}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink-600">
            {[
              withDeadline(t("case.optinBenefit1")),
              t("case.optinBenefit2"),
              t("case.optinBenefit3"),
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                  aria-hidden
                />
                {benefit}
              </li>
            ))}
          </ul>

          <label className="mt-4 block text-sm font-medium text-ink-700">
            {t("case.optinEmailLabel")}
            <input
              type="email"
              data-testid="case-optin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full min-h-[3rem] rounded-[var(--radius-field)] border border-ink-300 bg-paper-raised px-4 py-3 text-ink-900 transition-colors placeholder:text-ink-300 focus:border-brand-500 focus:outline-none"
              dir="ltr"
            />
          </label>

          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              data-testid="case-optin-checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-ink-600">
              {t("case.optinConsent")}{" "}
              <Link
                href="/datenschutz"
                data-testid="case-optin-privacy-link"
                className="font-medium text-brand-700 underline hover:text-brand-800"
              >
                {t("case.optinPrivacy")}
              </Link>
            </span>
          </label>

          {(state === "error" || state === "rate_limited") && (
            <div
              data-testid="case-optin-error"
              className="mt-4 flex items-start gap-3 rounded-[var(--radius-field)] border border-alert-600/20 bg-alert-50 p-4"
            >
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-alert-600"
                aria-hidden
              />
              <p className="text-sm text-alert-600">
                <strong>{t("case.optinErrorTitle")}</strong>{" "}
                {state === "rate_limited"
                  ? t("case.optinErrorRate")
                  : t("case.optinErrorText")}
              </p>
            </div>
          )}

          <button
            type="button"
            data-testid="case-optin-submit"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="mt-4 inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {state === "submitting"
              ? t("case.optinSubmitting")
              : state === "error" || state === "rate_limited"
                ? t("case.optinRetry")
                : t("case.optinSubmit")}
          </button>
        </div>
      </div>
    </div>
  );
}
