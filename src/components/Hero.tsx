"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle, FileText, ArrowRight, Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function Hero() {
  const { t, locale, setLocale, locales, localeInfo } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prominent language selector */}
        <div className="flex justify-end mb-6">
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-sm font-medium text-gray-700"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-lg">{localeInfo.flag}</span>
              <span>{localeInfo.label}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-50">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {t("hero.selectLang")}
                </div>
                {locales.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLocale(l.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      locale === l.code ? "text-blue-700 font-semibold bg-blue-50" : "text-gray-700"
                    }`}
                  >
                    <span className="text-lg">{l.flag}</span>
                    <span>{l.label}</span>
                    {locale === l.code && <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {t("hero.title1")}{" "}
            <span className="text-blue-700">{t("hero.title2")}</span>{" "}
            {t("hero.title3")}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pruefung"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-700 text-white text-lg font-semibold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/25 hover:shadow-xl hover:shadow-blue-700/30"
            >
              <CheckCircle className="w-5 h-5" />
              {t("hero.cta1")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#maengelanzeige"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-800 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-700 transition-all"
            >
              <FileText className="w-5 h-5" />
              {t("hero.cta2")}
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              {t("hero.trust1")}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              {t("hero.trust2")}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              {t("hero.trust3")}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
