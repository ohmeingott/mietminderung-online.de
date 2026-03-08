"use client";

import Image from "next/image";
import { useTranslation } from "@/i18n/LanguageContext";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Mietminderung.online Logo" width={32} height={32} className="w-8 h-8 brightness-0 invert" />
              <span className="text-xl font-bold text-white">
                Mietminderung<span className="text-blue-400">.online</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              {t("footer.service")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#pruefung"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("nav.check")}
                </a>
              </li>
              <li>
                <a
                  href="#maengelanzeige"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("nav.letter")}
                </a>
              </li>
              <li>
                <a
                  href="#so-funktionierts"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("nav.how")}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("nav.faq")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/impressum"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("footer.imprint")}
                </a>
              </li>
              <li>
                <a
                  href="/datenschutz"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a
                  href="/nutzungsbedingungen"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("footer.terms")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} mietminderung.online — {t("footer.rights")}
            </p>
            <p className="text-xs">
              {t("footer.noLegal")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
