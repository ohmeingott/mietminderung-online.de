"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Scale,
  Trash2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "@/i18n/LanguageContext";
import type { CaseSummary } from "@/types/case";

const formatDateDe = (isoDate: string) => {
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
};

type Answer = "behoben" | "teilweise" | "keine";

const STATUS_TO_ANSWER: Record<string, Answer | undefined> = {
  responded: "behoben",
  partly_resolved: "teilweise",
  no_response: "keine",
};

/**
 * The single manage surface for a saved case, reached from the email
 * links: one-click landlord-response answers, per-answer guidance, the
 * lawyer teaser, and consent withdrawal (= hard delete, two clicks so a
 * prefetching mail scanner can never wipe a case).
 */
export default function StatusClient() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const token = searchParams.get("t") || "";
  const deepLink = searchParams.get("a");

  const [summary, setSummary] = useState<CaseSummary | null>(null);
  const [pageState, setPageState] = useState<"loading" | "ready" | "invalid">(
    token ? "loading" : "invalid",
  );
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [answerSaved, setAnswerSaved] = useState(false);
  const [actionError, setActionError] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/case/summary?t=${encodeURIComponent(token)}`,
        );
        if (cancelled) return;
        if (!res.ok) {
          setPageState("invalid");
          return;
        }
        const data = (await res.json()) as CaseSummary;
        setSummary(data);
        const existing = STATUS_TO_ANSWER[data.status];
        if (existing) setAnswer(existing);
        setPageState("ready");
      } catch {
        if (!cancelled) setPageState("invalid");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const submitAnswer = async (value: Answer) => {
    if (busy) return;
    setBusy(true);
    setActionError(false);
    try {
      const res = await fetch("/api/case/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action: value }),
      });
      if (res.ok) {
        setAnswer(value);
        setAnswerSaved(true);
      } else {
        setActionError(true);
      }
    } catch {
      setActionError(true);
    } finally {
      setBusy(false);
    }
  };

  const handleWithdraw = async () => {
    if (busy) return;
    setBusy(true);
    setActionError(false);
    try {
      const res = await fetch("/api/case/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) setDeleted(true);
      else setActionError(true);
    } catch {
      setActionError(true);
    } finally {
      setBusy(false);
    }
  };

  const answerButton = (value: Answer, label: string, testid: string) => {
    const active = answer === value;
    return (
      <button
        type="button"
        data-testid={testid}
        onClick={() => submitAnswer(value)}
        disabled={busy}
        aria-pressed={active}
        className={`inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full border px-6 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto ${
          active
            ? "border-brand-700 bg-brand-700 text-white"
            : deepLink === value && !answer
              ? "border-brand-500 bg-brand-100 text-brand-800 hover:bg-brand-200"
              : "border-brand-300 bg-paper-raised text-brand-700 hover:bg-brand-100"
        }`}
      >
        {label}
      </button>
    );
  };

  const guidance =
    answer === "behoben"
      ? {
          title: t("case.statusResolvedTitle"),
          text: t("case.statusResolvedText"),
          link: { href: "/ratgeber/mietminderung-rueckwirkend" },
        }
      : answer === "teilweise"
        ? {
            title: t("case.statusPartlyTitle"),
            text: t("case.statusPartlyText"),
            link: { href: "/ratgeber/mietminderung-fehler" },
          }
        : answer === "keine"
          ? {
              title: t("case.statusNoneTitle"),
              text: t("case.statusNoneText"),
              link: null,
            }
          : null;

  const showLawyerTeaser =
    (answer === "keine" || answer === "teilweise") &&
    summary !== null &&
    !summary.lawyerConsent;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised p-6 shadow-[var(--shadow-raise)] sm:p-10">
            {deleted ? (
              <div data-testid="withdraw-success" className="text-center">
                <CheckCircle2
                  className="mx-auto h-12 w-12 text-signal-600"
                  aria-hidden
                />
                <h1 className="mt-4 text-xl font-bold text-ink-900 sm:text-2xl">
                  {t("case.deletedTitle")}
                </h1>
                <p className="mt-3 text-ink-600">{t("case.deletedText")}</p>
                <Link
                  href="/"
                  className="mt-6 inline-block text-sm text-ink-500 transition-colors hover:text-ink-800"
                >
                  {t("common.backHome")}
                </Link>
              </div>
            ) : pageState === "loading" ? (
              <p className="text-center text-ink-500">{t("case.statusLoading")}</p>
            ) : pageState === "invalid" ? (
              <div data-testid="case-status-invalid" className="text-center">
                <AlertTriangle
                  className="mx-auto h-12 w-12 text-caution-600"
                  aria-hidden
                />
                <p className="mt-4 text-ink-600">{t("case.statusInvalid")}</p>
                <Link
                  href="/"
                  className="mt-6 inline-block text-sm text-ink-500 transition-colors hover:text-ink-800"
                >
                  {t("common.backHome")}
                </Link>
              </div>
            ) : (
              <div data-testid="case-status-result">
                <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">
                  {t("case.statusTitle")}
                </h1>
                {summary && (
                  <dl className="mt-4 grid grid-cols-1 gap-2 rounded-[var(--radius-field)] border border-ink-200 bg-paper-sunken p-4 text-sm text-ink-700 sm:grid-cols-2">
                    <div>
                      <dt className="font-medium text-ink-500">
                        {t("case.statusDeadline")}
                      </dt>
                      <dd className="mt-0.5 font-semibold">
                        {formatDateDe(summary.deadlineDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-ink-500">
                        {t("case.statusQuota")}
                      </dt>
                      <dd className="mt-0.5 font-semibold">
                        ca. {summary.minderungTypical} %
                      </dd>
                    </div>
                  </dl>
                )}

                <h2 className="mt-7 font-bold text-ink-900">
                  {t("case.statusQuestion")}
                </h2>
                <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  {answerButton(
                    "behoben",
                    t("case.statusAnswerResolved"),
                    "status-responded",
                  )}
                  {answerButton(
                    "teilweise",
                    t("case.statusAnswerPartly"),
                    "status-partly",
                  )}
                  {answerButton(
                    "keine",
                    t("case.statusAnswerNone"),
                    "status-no-response",
                  )}
                </div>

                {actionError && (
                  <p className="mt-3 text-sm text-alert-600">
                    {t("case.statusError")}
                  </p>
                )}

                {answerSaved && guidance && (
                  <div className="mt-6 rounded-[var(--radius-field)] border border-brand-200 bg-brand-50 p-4">
                    <p className="font-semibold text-ink-900">
                      {t("case.statusThanks")} {guidance.title}
                    </p>
                    <p className="mt-1.5 text-sm text-ink-600">{guidance.text}</p>
                    {guidance.link && (
                      <Link
                        href={guidance.link.href}
                        data-testid="case-status-guide-link"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 underline hover:text-brand-800"
                      >
                        {t("case.statusGuideLink")}
                        <ArrowRight
                          className="h-3.5 w-3.5 rtl:rotate-180"
                          aria-hidden
                        />
                      </Link>
                    )}
                  </div>
                )}

                {showLawyerTeaser && (
                  <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-field)] border border-signal-600/20 bg-signal-50 p-4">
                    <Scale
                      className="mt-0.5 h-5 w-5 shrink-0 text-signal-600"
                      aria-hidden
                    />
                    <div>
                      <p className="text-sm text-ink-700">
                        {t("case.statusLawyerTeaser")}
                      </p>
                      <Link
                        href={`/fall/anwalt?t=${encodeURIComponent(token)}`}
                        data-testid="case-status-lawyer-link"
                        className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-signal-600 underline hover:text-signal-700"
                      >
                        {t("case.statusLawyerLink")}
                        <ArrowRight
                          className="h-3.5 w-3.5 rtl:rotate-180"
                          aria-hidden
                        />
                      </Link>
                    </div>
                  </div>
                )}

                <div className="mt-10 border-t border-ink-200 pt-6">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-ink-700">
                    <Trash2 className="h-4 w-4" aria-hidden />
                    {t("case.deleteTitle")}
                  </h2>
                  <p className="mt-1.5 text-sm text-ink-500">
                    {t("case.deleteText")}
                  </p>
                  {deleteArmed ? (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-alert-600">
                        {t("case.deleteConfirmText")}
                      </p>
                      <button
                        type="button"
                        data-testid="case-withdraw-confirm"
                        onClick={handleWithdraw}
                        disabled={busy}
                        className="mt-3 inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-alert-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-alert-600/90 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {t("case.deleteConfirmButton")}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      data-testid="case-withdraw"
                      onClick={() => setDeleteArmed(true)}
                      className="mt-3 inline-flex min-h-[2.75rem] items-center gap-2 rounded-full border border-ink-300 px-5 text-sm font-semibold text-ink-600 transition-colors hover:border-alert-600 hover:text-alert-600"
                    >
                      {t("case.deleteButton")}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
