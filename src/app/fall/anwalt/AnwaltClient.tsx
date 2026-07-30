"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, Scale } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "@/i18n/LanguageContext";
import { LAWYER_REFERRAL_CONSENT_VERSION } from "@/lib/consent";

type PageState = "idle" | "working" | "success" | "invalid" | "error";

/**
 * The SECOND, separate consent (gesonderte Einwilligung): only this page
 * permits sharing the case with a partner lawyer. Its own unticked
 * checkbox and its own versioned consent text — deliberately not merged
 * into the reminder opt-in.
 */
export default function AnwaltClient() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const token = searchParams.get("t") || "";
  const [checked, setChecked] = useState(false);
  const [state, setState] = useState<PageState>(token ? "idle" : "invalid");

  const handleSubmit = async () => {
    if (!checked || state === "working") return;
    setState("working");
    try {
      const res = await fetch("/api/case/lawyer-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          consentVersion: LAWYER_REFERRAL_CONSENT_VERSION,
        }),
      });
      if (res.ok) setState("success");
      else if (res.status === 410) setState("invalid");
      else setState("error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised p-6 shadow-[var(--shadow-raise)] sm:p-10">
            {state === "success" ? (
              <div data-testid="lawyer-consent-success" className="text-center">
                <CheckCircle2
                  className="mx-auto h-12 w-12 text-signal-600"
                  aria-hidden
                />
                <h1 className="mt-4 text-xl font-bold text-ink-900 sm:text-2xl">
                  {t("case.lawyerSuccessTitle")}
                </h1>
                <p className="mt-3 text-ink-600">{t("case.lawyerSuccessText")}</p>
              </div>
            ) : state === "invalid" ? (
              <div data-testid="lawyer-consent-invalid" className="text-center">
                <AlertTriangle
                  className="mx-auto h-12 w-12 text-caution-600"
                  aria-hidden
                />
                <p className="mt-4 text-ink-600">{t("case.lawyerInvalid")}</p>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <Scale
                    className="mt-1 h-8 w-8 shrink-0 text-brand-700"
                    aria-hidden
                  />
                  <div>
                    <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">
                      {t("case.lawyerTitle")}
                    </h1>
                    <p className="mt-2 text-ink-600">{t("case.lawyerIntro")}</p>
                  </div>
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    data-testid="case-lawyer-consent-checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-ink-600">
                    {t("case.lawyerConsent")}{" "}
                    <Link
                      href="/datenschutz"
                      className="font-medium text-brand-700 underline hover:text-brand-800"
                    >
                      {t("case.optinPrivacy")}
                    </Link>
                  </span>
                </label>

                {state === "error" && (
                  <p className="mt-3 text-sm text-alert-600">
                    {t("case.statusError")}
                  </p>
                )}

                <button
                  type="button"
                  data-testid="case-lawyer-consent-submit"
                  onClick={handleSubmit}
                  disabled={!checked || state === "working"}
                  className="mt-6 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-signal-600 px-7 text-base font-semibold text-white shadow-[var(--shadow-raise)] transition-colors hover:bg-signal-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  {state === "working"
                    ? t("case.lawyerWorking")
                    : t("case.lawyerSubmit")}
                </button>
              </>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-sm text-ink-500 transition-colors hover:text-ink-800"
              >
                {t("common.backHome")}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
