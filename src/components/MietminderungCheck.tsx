"use client";

import { useState, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Info,
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
} from "lucide-react";
import {
  eligibilityQuestions,
  mangelKategorien,
  type MangelKategorie,
  type Mangel,
} from "@/data/maengel";
import { useTranslation } from "@/i18n/LanguageContext";

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

export default function MietminderungCheck({ onComplete }: MietminderungCheckProps) {
  const [step, setStep] = useState(0);
  const [eligibilityStep, setEligibilityStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedKategorie, setSelectedKategorie] = useState<MangelKategorie | null>(null);
  const [selectedMaengel, setSelectedMaengel] = useState<Mangel[]>([]);
  const [bruttowarmmiete, setBruttowarmmiete] = useState("");
  const [isNotEligible, setIsNotEligible] = useState(false);
  const [notEligibleQuestionId, setNotEligibleQuestionId] = useState("");
  const { t } = useTranslation();

  const handleEligibilityAnswer = useCallback(
    (questionId: string, value: string, eligible: boolean | null) => {
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);

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
    [answers, eligibilityStep]
  );

  const toggleMangel = (mangel: Mangel) => {
    setSelectedMaengel((prev) =>
      prev.find((m) => m.id === mangel.id)
        ? prev.filter((m) => m.id !== mangel.id)
        : [...prev, mangel]
    );
  };

  const totalMin = selectedMaengel.reduce((sum, m) => sum + m.minderung_min, 0);
  const totalMax = Math.min(
    selectedMaengel.reduce((sum, m) => sum + m.minderung_max, 0),
    100
  );
  const totalTypical = Math.min(
    selectedMaengel.reduce((sum, m) => sum + m.minderung_typical, 0),
    100
  );
  const rent = parseFloat(bruttowarmmiete) || 0;
  const savingsMin = (rent * totalMin) / 100;
  const savingsMax = (rent * totalMax) / 100;
  const savingsTypical = (rent * totalTypical) / 100;

  const handleComplete = () => {
    const result: CheckResult = {
      eligible: true,
      selectedMaengel,
      totalMinderungMin: totalMin,
      totalMinderungMax: totalMax,
      totalMinderungTypical: totalTypical,
      bruttowarmmiete: rent,
    };
    onComplete?.(result);
  };

  // Not eligible screen
  if (isNotEligible) {
    return (
      <section id="pruefung" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t("check.notEligibleTitle")}
            </h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              {t(`eq.reason.${notEligibleQuestionId}`) !== `eq.reason.${notEligibleQuestionId}`
                ? t(`eq.reason.${notEligibleQuestionId}`)
                : t("eq.reason.default")}
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">
                  <strong>Hinweis:</strong> {t("check.notEligibleHint")}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsNotEligible(false);
                setAnswers({});
                setEligibilityStep(0);
                setStep(0);
              }}
              className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors"
            >
              {t("check.tryAgain")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pruefung" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t("check.title")}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t("check.subtitle")}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>
              {step === 0
                ? `${t("check.question")} ${eligibilityStep + 1} ${t("check.of")} ${eligibilityQuestions.length}`
                : step === 1
                ? t("check.selectDefects")
                : step === 2
                ? t("check.enterRent")
                : t("check.result")}
            </span>
            <span>
              {t("check.step")} {step + 1} {t("check.of")} 4
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="progress-fill bg-blue-600 h-2 rounded-full"
              style={{
                width: `${
                  step === 0
                    ? ((eligibilityStep + 1) / eligibilityQuestions.length) * 25
                    : step === 1
                    ? 25 + (selectedMaengel.length > 0 ? 25 : 0)
                    : step === 2
                    ? 75
                    : 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Step 0: Eligibility Questions */}
        {step === 0 && (
          <div className="animate-fade-in-up bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t(`eq.${eligibilityQuestions[eligibilityStep].id}.q`)}
                </h3>
                <p className="text-gray-500">
                  {t(`eq.${eligibilityQuestions[eligibilityStep].id}.desc`)}
                </p>
              </div>

              <div className="space-y-3">
                {eligibilityQuestions[eligibilityStep].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleEligibilityAnswer(
                        eligibilityQuestions[eligibilityStep].id,
                        option.value,
                        option.eligible
                      )
                    }
                    className="w-full text-left px-6 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4 group"
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500 shrink-0" />
                    <span className="text-gray-700 font-medium">
                      {t(`eq.${eligibilityQuestions[eligibilityStep].id}.${option.value}`)}
                    </span>
                  </button>
                ))}
              </div>

              {eligibilityStep > 0 && (
                <button
                  onClick={() => setEligibilityStep(eligibilityStep - 1)}
                  className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("check.back")}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Select Defects */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t("check.whichDefects")}
              </h3>
              <p className="text-gray-500 mb-6">
                {t("check.whichDefectsDesc")}
              </p>

              {/* Category grid */}
              {!selectedKategorie && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {mangelKategorien.map((kat) => {
                    const Icon = iconMap[kat.icon] || Info;
                    const hasSelected = selectedMaengel.some((m) =>
                      kat.maengel.find((km) => km.id === m.id)
                    );
                    return (
                      <button
                        key={kat.id}
                        onClick={() => setSelectedKategorie(kat)}
                        className={`card-hover relative p-4 rounded-xl border-2 text-center transition-all ${
                          hasSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {hasSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                        <Icon className="w-7 h-7 mx-auto mb-2 text-gray-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          {kat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Defects within category */}
              {selectedKategorie && (
                <div>
                  <button
                    onClick={() => setSelectedKategorie(null)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("check.allCategories")}
                  </button>
                  <h4 className="font-semibold text-gray-800 mb-4">
                    {selectedKategorie.label}
                  </h4>
                  <div className="space-y-2">
                    {selectedKategorie.maengel.map((mangel) => {
                      const isSelected = selectedMaengel.find(
                        (m) => m.id === mangel.id
                      );
                      return (
                        <button
                          key={mangel.id}
                          onClick={() => toggleMangel(mangel)}
                          className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? "bg-blue-600 border-blue-600"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                                  )}
                                </div>
                                <span className="font-medium text-gray-800">
                                  {mangel.label}
                                </span>
                              </div>
                              <p className="mt-1 ml-8 text-sm text-gray-500">
                                {mangel.description}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm font-bold text-blue-700">
                                {mangel.minderung_min}–{mangel.minderung_max}%
                              </span>
                              <div className="text-xs text-gray-400">{t("check.approxReduction")}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selected summary */}
              {selectedMaengel.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-blue-800">
                      {selectedMaengel.length} {t("check.selected")}
                    </span>
                    <span className="text-sm font-bold text-blue-700">
                      ca. {totalMin}–{totalMax}% {t("check.approxReduction")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMaengel.map((m) => (
                      <span
                        key={m.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-blue-200"
                      >
                        {m.label}
                        <button
                          onClick={() => toggleMangel(m)}
                          className="ml-1 text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => {
                    setStep(0);
                    setEligibilityStep(eligibilityQuestions.length - 1);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("check.back")}
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={selectedMaengel.length === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("check.next")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Rent input */}
        {step === 2 && (
          <div className="animate-fade-in-up bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12">
            <div className="max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t("check.rentTitle")}
              </h3>
              <p className="text-gray-500 mb-6">
                {t("check.rentDesc")}
              </p>

              <div className="relative mb-6">
                <input
                  type="number"
                  value={bruttowarmmiete}
                  onChange={(e) => setBruttowarmmiete(e.target.value)}
                  placeholder={t("check.rentPlaceholder")}
                  className="w-full px-5 py-4 text-2xl font-semibold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 pr-14"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-400 font-medium">
                  €
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div className="text-sm text-gray-600">
                    {t("check.rentInfo")}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("check.back")}
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!bruttowarmmiete || rent <= 0}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("check.showResult")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t("check.resultTitle")}
                </h3>
              </div>

              {/* Result cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200">
                  <div className="text-sm text-blue-600 font-medium mb-1">
                    {t("check.reductionRate")}
                  </div>
                  <div className="text-3xl font-bold text-blue-800">
                    {totalTypical}%
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    ({t("check.range")}: {totalMin}–{totalMax}%)
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 text-center border border-emerald-200">
                  <div className="text-sm text-emerald-600 font-medium mb-1">
                    {t("check.monthlySavings")}
                  </div>
                  <div className="text-3xl font-bold text-emerald-800">
                    {savingsTypical.toFixed(0)} €
                  </div>
                  <div className="text-xs text-emerald-500 mt-1">
                    ({t("check.range")}: {savingsMin.toFixed(0)}–{savingsMax.toFixed(0)} €)
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-amber-800">
                    <strong>Hinweis:</strong> {t("check.disclaimer")}
                  </div>
                </div>
              </div>

              {/* Selected defects */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-3">
                  {t("check.yourDefects")}
                </h4>
                <div className="space-y-2">
                  {selectedMaengel.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{m.label}</span>
                      <span className="text-sm font-semibold text-blue-700">
                        ca. {m.minderung_typical}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next steps */}
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  {t("check.nextStep")}
                </p>
                <button
                  onClick={handleComplete}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/25"
                >
                  {t("check.createLetter")}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-4 block mx-auto text-sm text-gray-500 hover:text-gray-700"
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
