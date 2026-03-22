"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, locale, setLocale, locales, localeInfo } = useTranslation();
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      {/* Language bar — prominent at the top */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1 py-1.5">
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all min-h-[36px] flex items-center ${
                  locale === l.code
                    ? "bg-white/25 text-white"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="mr-1">{l.flag}</span>
                <span className="hidden sm:inline">{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Mietminderung-online Logo" width={44} height={44} className="w-11 h-11" />
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Mietminderung<span className="text-blue-600">-online</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#pruefung"
              className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
            >
              {t("nav.check")}
            </a>
            <a
              href="#maengelanzeige"
              className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
            >
              {t("nav.letter")}
            </a>
            <a
              href="#so-funktionierts"
              className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
            >
              {t("nav.how")}
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
            >
              {t("nav.faq")}
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Compact language dropdown for desktop nav area */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-blue-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>{localeInfo.flag}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[160px] z-50">
                  {locales.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLocale(l.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 ${
                        locale === l.code ? "text-blue-700 font-semibold bg-blue-50" : "text-gray-700"
                      }`}
                    >
                      <span>{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#pruefung"
              className="px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              {t("nav.cta")}
            </a>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2 pt-4">
              <a
                href="#pruefung"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.check")}
              </a>
              <a
                href="#maengelanzeige"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.letter")}
              </a>
              <a
                href="#so-funktionierts"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.how")}
              </a>
              <a
                href="#faq"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.faq")}
              </a>
              <a
                href="#pruefung"
                className="mx-4 mt-2 px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg text-center hover:bg-blue-800"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.cta")}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
