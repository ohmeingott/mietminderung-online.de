"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { href: "/#pruefung", key: "nav.check" },
  { href: "/#maengelanzeige", key: "nav.letter" },
  { href: "/#so-funktionierts", key: "nav.how" },
  { href: "/faq", key: "nav.faq" },
  { href: "/mietminderungstabelle", key: "nav.table" },
  { href: "/ratgeber", key: "nav.guide" },
] as const;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled || mobileOpen
          ? "border-b border-ink-200/70 bg-paper/90 backdrop-blur-md"
          : "border-b border-transparent bg-paper/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="Mietminderung-online.de"
          >
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              // The logo ships with a white background; multiply blends it into
              // the warm paper surface instead of showing a white tile.
              className="h-9 w-9 mix-blend-multiply"
              priority
            />
            <span className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
              Mietminderung-online
              <span className="text-brand-500">.de</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Hauptnavigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm font-medium text-ink-600 transition-colors hover:text-brand-700"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <Link
              href="/#pruefung"
              className="hidden h-11 items-center whitespace-nowrap rounded-full bg-brand-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 xl:inline-flex"
            >
              {t("nav.cta")}
            </Link>

            <button
              type="button"
              className="-me-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="animate-fade-in border-t border-ink-200/70 bg-paper lg:hidden"
        >
          <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6" aria-label="Hauptnavigation mobil">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-[3rem] items-center rounded-xl px-3 text-base font-medium text-ink-700 transition-colors hover:bg-ink-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/#pruefung"
              className="mt-3 flex min-h-[3rem] items-center justify-center rounded-full bg-brand-700 px-5 text-base font-semibold text-white transition-colors hover:bg-brand-800"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav.cta")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
