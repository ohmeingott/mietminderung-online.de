"use client";

import { ClipboardCheck, Calculator, FileText, Send } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const colorClasses: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-200" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-200" },
  violet: { bg: "bg-violet-100", text: "text-violet-700", ring: "ring-violet-200" },
  amber: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200" },
};

const stepIcons = [ClipboardCheck, Calculator, FileText, Send];
const stepColors = ["blue", "emerald", "violet", "amber"];

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { title: t("how.s1.title"), description: t("how.s1.desc") },
    { title: t("how.s2.title"), description: t("how.s2.desc") },
    { title: t("how.s3.title"), description: t("how.s3.desc") },
    { title: t("how.s4.title"), description: t("how.s4.desc") },
  ];

  return (
    <section id="so-funktionierts" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t("how.title")}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t("how.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const colors = colorClasses[stepColors[index]];
            const Icon = stepIcons[index];
            return (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-gray-300" />
                )}
                <div className="card-hover relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center h-full">
                  <div className="text-xs font-bold text-gray-400 mb-4">
                    {t("how.step")} {index + 1}
                  </div>
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${colors.bg} ring-4 ${colors.ring} mb-5`}
                  >
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
