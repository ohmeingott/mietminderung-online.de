"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { faqs } from "@/data/maengel";
import { useTranslation } from "@/i18n/LanguageContext";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useTranslation();

  return (
    <section id="faq" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            {t("faq.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t("faq.title")}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t("faq.subtitle")}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 animate-fade-in-up">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legal disclaimer */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            {t("faq.legal.title")}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t("faq.legal.text")}
          </p>
        </div>
      </div>
    </section>
  );
}
