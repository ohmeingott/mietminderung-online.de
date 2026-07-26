"use client";

import { useState } from "react";
import Link from "next/link";
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
          <p className="mt-4 text-lg text-gray-600">{t("faq.subtitle")}</p>
        </div>

        {/* Answers stay mounted so crawlers index them; only the height animates. */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`home-faq-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={`home-faq-${index}`}
                  className={`grid transition-all duration-200 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors"
          >
            Alle Fragen &amp; Antworten anzeigen
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </Link>
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
