"use client";

import { FileText, ArrowRight, CheckCircle } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function MaengelanzeigeTeaser() {
  const { t } = useTranslation();

  return (
    <section id="maengelanzeige" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
            <FileText className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("teaser.title")}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            {t("teaser.desc")}
          </p>

          <div className="space-y-4 text-left max-w-md mx-auto mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-gray-700">{t("teaser.feat1")}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-gray-700">{t("teaser.feat2")}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-gray-700">{t("teaser.feat3")}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-gray-700">{t("teaser.feat4")}</span>
            </div>
          </div>

          <a
            href="#pruefung"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-700 text-white text-lg font-semibold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/25"
          >
            {t("teaser.cta")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
