"use client";

import { Calculator, ClipboardCheck, FileText, Send } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const stepIcons = [ClipboardCheck, Calculator, FileText, Send];

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { title: t("how.s1.title"), description: t("how.s1.desc") },
    { title: t("how.s2.title"), description: t("how.s2.desc") },
    { title: t("how.s3.title"), description: t("how.s3.desc") },
    { title: t("how.s4.title"), description: t("how.s4.desc") },
  ];

  return (
    <section id="so-funktionierts" className="border-y border-ink-200 bg-paper-sunken py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {t("how.title")}
          </h2>
          <p className="mt-3 text-base text-ink-600 sm:mt-4 sm:text-lg">
            {t("how.subtitle")}
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <li
                key={step.title}
                className="card-hover relative flex gap-4 rounded-card border border-ink-200 bg-paper-raised p-5 sm:flex-col sm:gap-0 sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-field bg-brand-50 text-brand-600 sm:mb-5">
                  <Icon className="h-5.5 w-5.5" aria-hidden />
                </div>
                <div>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
                    {t("how.step")} {index + 1}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-ink-900 sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
