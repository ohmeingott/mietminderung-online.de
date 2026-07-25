"use client";

import { useState, useCallback } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Bug,
  Check,
  CheckCircle2,
  CookingPot,
  DoorOpen,
  Droplets,
  HeartPulse,
  Info,
  Maximize,
  ShowerHead,
  Thermometer,
  TreePine,
  Volume2,
  Wind,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import {
  eligibilityQuestions,
  mangelKategorien,
  type MangelKategorie,
  type Mangel,
} from "@/data/maengel";
import { useTranslation } from "@/i18n/LanguageContext";
import { katKey, mangelDescKey, mangelLabelKey } from "@/i18n/content";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Thermometer,
  Droplets,
  Volume2,
  Bug,
  DoorOpen,
  ShowerHead,
  CookingPot,
  ArrowUpDown,
  Zap,
  Maximize,
  TreePine,
  HeartPulse,
  Wind,
};

interface CheckResult {
  eligible: boolean | null;
  selectedMaengel: Mangel[];
  totalMinderungMin: number;
  totalMinderungMax: number;
  totalMinderungTypical: number;
  bruttowarmmiete: number;
}

interface MietminderungCheckProps {
  onComplete?: (result: CheckResult) => void;
}

const cardClasses =
  "rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised shadow-[var(--shadow-raise)]";

export default function MietminderungCheck({
  onComplete,
}: MietminderungCheckProps) {
  const [step, setStep] = useState(0);
  const [eligibilityStep, setEligibilityStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedKategorie, setSelectedKategorie] =
    useState<MangelKategorie | null>(null);
  const [selectedMaengel, setSelectedMaengel] = useState<Mangel[]>([]);
  const [bruttowarmmiete, setBruttowarmmiete] = useState("");
  const [isNotEligible, setIsNotEligible] = useState(false);
  const [notEligibleQuestionId, setNotEligibleQuestionId] = useState("");
  const { t, tc } = useTranslation();

  const handleEligibilityAnswer = useCallback(
    (questionId: string, value: string, eligible: boolean | null) => {
      setAnswers({ ...answers, [questionId]: value });

      if (eligible === false) {
        setIsNotEligible(true);
        setNotEligibleQuestionId(questionId);
        return;
      }

      if (eligibilityStep < eligibilityQuestions.length - 1) {
        setEligibilityStep(eligibilityStep + 1);
      } else {
        setStep(1);
      }
    },
    [answers, eligibilityStep],
  );

  const toggleMangel = (mangel: Mangel) => {
    setSelectedMaengel((prev) =>
      prev.find((m) => m.id === mangel.id)
        ? prev.filter((m) => m.id !== mangel.id)
        : [...prev, mangel],
    );
  };

  const mangelLabel = (m: Mangel) => tc(mangelLabelKey(m.id), m.label);
  const mangelDesc = (m: Mangel) => tc(mangelDescKey(m.id), m.description);

  const totalMin = Math.min(
    selectedMaengel.reduce((sum, m) => sum + m.minderung_min, 0),
    100,
  );
  const totalMax = Math.min(
    selectedMaengel.reduce((sum, m) => sum + m.minderung_max, 0),
    100,
  );
  const totalTypical = Math.min(
    selectedMaengel.reduce((sum, m) => sum + m.minderung_typical, 0),
    100,
  );
  const rent = parseFloat(bruttowarmmiete) || 0;
  const savingsMin = (rent * totalMin) / 100;
  const savingsMax = (rent * totalMax) / 100;
  const savingsTypical = (rent * totalTypical) / 100;

  const handleComplete = () => {
    onComplete?.({
      eligible: true,
      selectedMaengel,
      totalMinderungMin: totalMin,
      totalMinderungMax: totalMax,
      totalMinderungTypical: totalTypical,
      bruttowarmmiete: rent,
    });
  };

  // ---------------------------------------------------------------- not eligible
  if (isNotEligible) {
    const reasonKey = `eq.reason.${notEligibleQuestionId}`;
    return (
      <section id="pruefung" className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className={`${cardClasses} p-6 text-center sm:p-10`}>
            <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-alert-50">
              <XCircle className="h-8 w-8 text-alert-600" aria-hidden />
            </div>
            <h3 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {t("check.notEligibleTitle")}
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-ink-600">
              {t(reasonKey) !== reasonKey
                ? t(reasonKey)
                : t("eq.reason.default")}
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-field)] border border-caution-600/20 bg-caution-50 p-4 text-start">
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-caution-600"
                aria-hidden
              />
              <p className="text-sm text-caution-600">
                <strong>{t("common.note")}:</strong>{" "}
                {t("check.notEligibleHint")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsNotEligible(false);
                setAnswers({});
                setEligibilityStep(0);
                setStep(0);
              }}
              className="mt-7 inline-flex min-h-[3rem] items-center rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800"
            >
              {t("check.tryAgain")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const progressPercent =
    step === 0
      ? ((eligibilityStep + 1) / eligibilityQuestions.length) * 25
      : step === 1
        ? 25 + (selectedMaengel.length > 0 ? 25 : 0)
        : step === 2
          ? 75
          : 100;

  const question = eligibilityQuestions[eligibilityStep];

  return (
    <section id="pruefung" className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {t("check.title")}
          </h2>
          <p className="mt-3 text-base text-ink-600 sm:text-lg">
            {t("check.subtitle")}
          </p>
        </div>

        {/* Progress */}
        <div className="mt-8 sm:mt-10">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs text-ink-500 sm:text-sm">
            <span className="truncate">
              {step === 0
                ? `${t("check.question")} ${eligibilityStep + 1} ${t("check.of")} ${eligibilityQuestions.length}`
                : step === 1
                  ? t("check.selectDefects")
                  : step === 2
                    ? t("check.enterRent")
                    : t("check.result")}
            </span>
            <span className="shrink-0 tabular-nums">
              {t("check.step")} {step + 1} {t("check.of")} 4
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-ink-200"
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-fill h-full rounded-full bg-brand-600"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* -------------------------------------------------- step 0: eligibility */}
        {step === 0 && (
          <div className={`animate-fade-in-up mt-6 ${cardClasses} p-5 sm:p-10`}>
            <div className="mx-auto max-w-xl">
              <h3 className="text-lg font-bold text-ink-900 sm:text-xl">
                {t(`eq.${question.id}.q`)}
              </h3>
              <p className="mt-2 text-sm text-ink-500 sm:text-base">
                {t(`eq.${question.id}.desc`)}
              </p>

              <div className="mt-6 space-y-2.5">
                {question.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    data-testid={`eq-${question.id}-${option.value}`}
                    onClick={() =>
                      handleEligibilityAnswer(
                        question.id,
                        option.value,
                        option.eligible,
                      )
                    }
                    className="group flex w-full items-center gap-3.5 rounded-[var(--radius-field)] border border-ink-200 bg-paper-raised px-4 py-3.5 text-start transition-colors hover:border-brand-400 hover:bg-brand-50 sm:px-5"
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border-2 border-ink-300 transition-colors group-hover:border-brand-500"
                      aria-hidden
                    />
                    <span className="text-sm font-medium text-ink-800 sm:text-base">
                      {t(`eq.${question.id}.${option.value}`)}
                    </span>
                  </button>
                ))}
              </div>

              {eligibilityStep > 0 && (
                <button
                  type="button"
                  data-testid="check-eq-back"
                  onClick={() => setEligibilityStep(eligibilityStep - 1)}
                  className="mt-5 inline-flex min-h-[2.75rem] items-center gap-2 text-sm text-ink-500 transition-colors hover:text-ink-800"
                >
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
                  {t("check.back")}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------- step 1: select defects */}
        {step === 1 && (
          <div className={`animate-fade-in-up mt-6 ${cardClasses} p-5 sm:p-10`}>
            <h3 className="text-lg font-bold text-ink-900 sm:text-xl">
              {t("check.whichDefects")}
            </h3>
            <p className="mt-1.5 text-sm text-ink-500 sm:text-base">
              {t("check.whichDefectsDesc")}
            </p>

            {!selectedKategorie && (
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {mangelKategorien.map((kat) => {
                  const Icon = iconMap[kat.icon] || Info;
                  const selectedCount = kat.maengel.filter((km) =>
                    selectedMaengel.some((m) => m.id === km.id),
                  ).length;
                  return (
                    <button
                      key={kat.id}
                      type="button"
                      data-testid={`kategorie-${kat.id}`}
                      onClick={() => setSelectedKategorie(kat)}
                      className={`card-hover relative flex min-h-[6.5rem] flex-col items-center justify-center gap-2 rounded-[var(--radius-field)] border p-3 text-center transition-colors ${
                        selectedCount > 0
                          ? "border-brand-500 bg-brand-50"
                          : "border-ink-200 bg-paper-raised hover:border-brand-300"
                      }`}
                    >
                      {selectedCount > 0 && (
                        <span className="absolute end-2 top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[0.625rem] font-bold text-white">
                          {selectedCount}
                        </span>
                      )}
                      <Icon
                        className={`h-6 w-6 ${selectedCount > 0 ? "text-brand-600" : "text-ink-400"}`}
                      />
                      <span className="text-xs font-medium leading-tight text-ink-700 sm:text-sm">
                        {tc(katKey(kat.id), kat.label)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedKategorie && (
              <div className="mt-6">
                <button
                  type="button"
                  data-testid="check-all-categories"
                  onClick={() => setSelectedKategorie(null)}
                  className="mb-4 inline-flex min-h-[2.75rem] items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-800"
                >
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
                  {t("check.allCategories")}
                </button>
                <h4 className="mb-3 font-semibold text-ink-800">
                  {tc(katKey(selectedKategorie.id), selectedKategorie.label)}
                </h4>
                <div className="space-y-2">
                  {selectedKategorie.maengel.map((mangel) => {
                    const isSelected = selectedMaengel.some(
                      (m) => m.id === mangel.id,
                    );
                    return (
                      <button
                        key={mangel.id}
                        type="button"
                        data-testid={`mangel-${mangel.id}`}
                        onClick={() => toggleMangel(mangel)}
                        aria-pressed={isSelected}
                        className={`w-full rounded-[var(--radius-field)] border px-4 py-3.5 text-start transition-colors ${
                          isSelected
                            ? "border-brand-500 bg-brand-50"
                            : "border-ink-200 bg-paper-raised hover:border-brand-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                              isSelected
                                ? "border-brand-600 bg-brand-600"
                                : "border-ink-300"
                            }`}
                            aria-hidden
                          >
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 text-white" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                              <span className="font-medium text-ink-900">
                                {mangelLabel(mangel)}
                              </span>
                              <span className="shrink-0 text-sm font-bold tabular-nums text-brand-700">
                                {mangel.minderung_min}–{mangel.minderung_max}%
                              </span>
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-ink-500">
                              {mangelDesc(mangel)}
                            </span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedMaengel.length > 0 && (
              <div className="mt-6 rounded-[var(--radius-field)] border border-brand-200 bg-brand-50 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-brand-800">
                    {selectedMaengel.length} {t("check.selected")}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-brand-700">
                    ca. {totalMin}–{totalMax}% {t("check.approxReduction")}
                  </span>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {selectedMaengel.map((m) => (
                    <li key={m.id}>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-paper-raised py-1 ps-3 pe-1 text-xs font-medium text-ink-700">
                        {mangelLabel(m)}
                        <button
                          type="button"
                          data-testid={`remove-${m.id}`}
                          onClick={() => toggleMangel(m)}
                          aria-label={`${mangelLabel(m)} entfernen`}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-alert-50 hover:text-alert-600"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                data-testid="check-back"
                onClick={() => {
                  setStep(0);
                  setEligibilityStep(eligibilityQuestions.length - 1);
                }}
                className="inline-flex min-h-[3rem] items-center gap-2 text-sm text-ink-500 transition-colors hover:text-ink-800"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
                {t("check.back")}
              </button>
              <button
                type="button"
                data-testid="check-next"
                onClick={() => setStep(2)}
                disabled={selectedMaengel.length === 0}
                className="inline-flex min-h-[3rem] items-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("check.next")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------- step 2: rent input */}
        {step === 2 && (
          <div className={`animate-fade-in-up mt-6 ${cardClasses} p-5 sm:p-10`}>
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-bold text-ink-900 sm:text-xl">
                {t("check.rentTitle")}
              </h3>
              <p className="mt-1.5 text-sm text-ink-500 sm:text-base">
                {t("check.rentDesc")}
              </p>

              <div className="relative mt-6">
                <label htmlFor="bruttowarmmiete" className="sr-only">
                  {t("check.rentTitle")}
                </label>
                <input
                  id="bruttowarmmiete"
                  data-testid="rent-input"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={bruttowarmmiete}
                  onChange={(e) => setBruttowarmmiete(e.target.value)}
                  placeholder={t("check.rentPlaceholder")}
                  className="h-16 w-full rounded-[var(--radius-field)] border border-ink-300 bg-paper-raised px-5 pe-14 text-2xl font-semibold text-ink-900 tabular-nums transition-colors placeholder:font-normal placeholder:text-ink-300 focus:border-brand-500 focus:outline-none"
                />
                <span
                  className="pointer-events-none absolute end-5 top-1/2 -translate-y-1/2 text-xl font-medium text-ink-400"
                  aria-hidden
                >
                  €
                </span>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-field)] bg-paper-sunken p-4">
                <Info
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-500"
                  aria-hidden
                />
                <p className="text-sm text-ink-600">{t("check.rentInfo")}</p>
              </div>

              <div className="mt-7 flex items-center justify-between gap-3">
                <button
                  type="button"
                  data-testid="check-back"
                  onClick={() => setStep(1)}
                  className="inline-flex min-h-[3rem] items-center gap-2 text-sm text-ink-500 transition-colors hover:text-ink-800"
                >
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
                  {t("check.back")}
                </button>
                <button
                  type="button"
                  data-testid="check-submit"
                  onClick={() => setStep(3)}
                  disabled={!bruttowarmmiete || rent <= 0}
                  className="inline-flex min-h-[3rem] items-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("check.showResult")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------- step 3: result */}
        {step === 3 && (
          <div className={`animate-fade-in-up mt-6 ${cardClasses} p-5 sm:p-10`}>
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-signal-50">
                <CheckCircle2 className="h-8 w-8 text-signal-600" aria-hidden />
              </div>
              <h3 className="text-xl font-bold text-ink-900 sm:text-2xl">
                {t("check.resultTitle")}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[var(--radius-field)] border border-brand-200 bg-brand-50 p-5 text-center">
                <p className="text-sm font-medium text-brand-600">
                  {t("check.reductionRate")}
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-brand-800 sm:text-4xl">
                  {totalTypical}%
                </p>
                <p className="mt-1 text-xs text-brand-500 tabular-nums">
                  ({t("check.range")}: {totalMin}–{totalMax}%)
                </p>
              </div>
              <div className="rounded-[var(--radius-field)] border border-signal-600/20 bg-signal-50 p-5 text-center">
                <p className="text-sm font-medium text-signal-700">
                  {t("check.monthlySavings")}
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-signal-700 sm:text-4xl">
                  {savingsTypical.toFixed(0)} €
                </p>
                <p className="mt-1 text-xs text-signal-600 tabular-nums">
                  ({t("check.range")}: {savingsMin.toFixed(0)}–
                  {savingsMax.toFixed(0)} €)
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-field)] border border-caution-600/20 bg-caution-50 p-4">
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-caution-600"
                aria-hidden
              />
              <p className="text-sm text-caution-600">
                <strong>{t("common.note")}:</strong> {t("check.disclaimer")}
              </p>
            </div>

            <div className="mt-7">
              <h4 className="mb-3 font-semibold text-ink-800">
                {t("check.yourDefects")}
              </h4>
              <ul className="divide-y divide-ink-200 overflow-hidden rounded-[var(--radius-field)] border border-ink-200">
                {selectedMaengel.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-3 bg-paper-raised px-4 py-3"
                  >
                    <span className="text-sm text-ink-700">
                      {mangelLabel(m)}
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-brand-700">
                      ca. {m.minderung_typical}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 text-center">
              <p className="text-ink-600">{t("check.nextStep")}</p>
              <button
                type="button"
                data-testid="check-create-letter"
                onClick={handleComplete}
                className="mt-5 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-full bg-signal-600 px-7 text-base font-semibold text-white shadow-[var(--shadow-raise)] transition-colors hover:bg-signal-700 sm:w-auto"
              >
                {t("check.createLetter")}
                <ArrowRight
                  className="h-4.5 w-4.5 rtl:rotate-180"
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mx-auto mt-3 block min-h-[2.75rem] text-sm text-ink-500 transition-colors hover:text-ink-800"
              >
                {t("check.editDefects")}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
