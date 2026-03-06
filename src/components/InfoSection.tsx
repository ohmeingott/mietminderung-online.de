"use client";

import {
  Scale,
  ShieldCheck,
  Clock,
  AlertTriangle,
  BookOpen,
  Gavel,
} from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const cards = [
  { icon: Scale, color: "blue", titleKey: "info.c1.title", descKey: "info.c1.desc" },
  { icon: ShieldCheck, color: "emerald", titleKey: "info.c2.title", descKey: "info.c2.desc" },
  { icon: BookOpen, color: "violet", titleKey: "info.c3.title", descKey: "info.c3.desc" },
  { icon: Gavel, color: "amber", titleKey: "info.c4.title", descKey: "info.c4.desc" },
  { icon: AlertTriangle, color: "red", titleKey: "info.c5.title", descKey: "info.c5.desc" },
  { icon: Clock, color: "cyan", titleKey: "info.c6.title", descKey: "info.c6.desc" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  violet: "bg-violet-100 text-violet-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  cyan: "bg-cyan-100 text-cyan-700",
};

export default function InfoSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t("info.title")}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t("info.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => {
            const [bgClass, textClass] = colorMap[card.color].split(" ");
            return (
              <div key={i} className="card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${bgClass} mb-5`}>
                  <card.icon className={`w-7 h-7 ${textClass}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {t(card.titleKey)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(card.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
