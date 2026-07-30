"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, MailCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "@/i18n/LanguageContext";

type ConfirmState = "idle" | "working" | "success" | "invalid" | "error";

/**
 * Double-opt-in landing page. Confirmation happens ONLY on the explicit
 * button click — never on page load — so link-prefetching email scanners
 * cannot confirm an opt-in the user never made.
 */
export default function ConfirmClient() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const token = searchParams.get("t") || "";
  const [state, setState] = useState<ConfirmState>(token ? "idle" : "invalid");

  const handleConfirm = async () => {
    setState("working");
    try {
      const res = await fetch("/api/case/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
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
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <div className="rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised p-6 shadow-[var(--shadow-raise)] sm:p-10">
            {state === "success" ? (
              <div data-testid="confirm-success" className="text-center">
                <CheckCircle2
                  className="mx-auto h-12 w-12 text-signal-600"
                  aria-hidden
                />
                <h1 className="mt-4 text-xl font-bold text-ink-900 sm:text-2xl">
                  {t("case.confirmSuccessTitle")}
                </h1>
                <p className="mt-3 text-ink-600">{t("case.confirmSuccessText")}</p>
                <p className="mt-3 text-sm text-ink-500">
                  {t("case.confirmDeleteHint")}
                </p>
              </div>
            ) : state === "invalid" ? (
              <div data-testid="confirm-error" className="text-center">
                <AlertTriangle
                  className="mx-auto h-12 w-12 text-caution-600"
                  aria-hidden
                />
                <p className="mt-4 text-ink-600">{t("case.confirmInvalid")}</p>
              </div>
            ) : (
              <div className="text-center">
                <MailCheck
                  className="mx-auto h-12 w-12 text-brand-700"
                  aria-hidden
                />
                <h1 className="mt-4 text-xl font-bold text-ink-900 sm:text-2xl">
                  {t("case.confirmTitle")}
                </h1>
                <p className="mt-3 text-ink-600">{t("case.confirmIntro")}</p>
                {state === "error" && (
                  <p className="mt-3 text-sm text-alert-600">
                    {t("case.statusError")}
                  </p>
                )}
                <button
                  type="button"
                  data-testid="confirm-button"
                  onClick={handleConfirm}
                  disabled={state === "working"}
                  className="mt-6 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-signal-600 px-7 text-base font-semibold text-white shadow-[var(--shadow-raise)] transition-colors hover:bg-signal-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  {state === "working"
                    ? t("case.confirmWorking")
                    : t("case.confirmButton")}
                </button>
              </div>
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
