"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/data/maengel";

export default function FAQPageClient({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
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
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
