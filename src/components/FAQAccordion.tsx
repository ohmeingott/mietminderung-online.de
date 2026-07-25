"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/data/maengel";
import { useTranslation } from "@/i18n/LanguageContext";
import { faqAnswerKey, faqQuestionKey } from "@/i18n/content";

/**
 * Shared accordion for the landing-page FAQ preview and the full /faq page.
 * `indexOffset` keeps translation keys aligned when a slice of `faqs` is passed.
 */
export default function FAQAccordion({
  faqs,
  indexOffset = 0,
}: {
  faqs: FAQ[];
  indexOffset?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { tc } = useTranslation();
  const baseId = useId();

  return (
    <ul className="divide-y divide-ink-200 overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised">
      {faqs.map((faq, index) => {
        const key = index + indexOffset;
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <li key={key}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start transition-colors hover:bg-paper-sunken sm:px-6 sm:py-5"
              >
                <span className="font-semibold text-ink-900">
                  {tc(faqQuestionKey(key), faq.question)}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="animate-fade-in px-5 pb-5 sm:px-6"
              >
                <p className="border-t border-ink-200 pt-4 leading-relaxed text-ink-600">
                  {tc(faqAnswerKey(key), faq.answer)}
                </p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
