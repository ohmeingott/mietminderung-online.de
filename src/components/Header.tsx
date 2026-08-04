"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n/LanguageContext";
import { DEFAULT_LOCALE, localeHref } from "@/i18n/routing";
import type { Locale } from "@/i18n/translations";
import { VERSAND_PATH } from "@/lib/seo";
import BrandMark from "./BrandMark";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * The navigation of the language currently being served.
 *
 * Kept to four entries at most. The German row used to carry seven, and with
 * the wordmark, the language switcher and the CTA beside it that does not fit
 * the 1088 px this container leaves at the width the CTA appears at — the
 * button was clipped. What went is what the row said twice: `#pruefung` is
 * where the CTA already points, and `#maengelanzeige` is the same wizard one
 * anchor further down. The FAQ moved to the footer, which lists it for every
 * language anyway.
 *
 * What is left is what a link can reach and a button cannot: the dispatch
 * page, the section explaining the service, and the two content routes.
 */
function navLinksFor(locale: Locale) {
  // "/" + "#x" is "/#x"; "/tr" + "#x" is "/tr#x". No trailing slash on either,
  // which would cost a redirect hop before the anchor resolves.
  const home = localeHref(locale, "/");
  const anchor = (hash: string) => `${home}${hash}`;

  // The dispatch page, the defect table and the guides are German-only
  // content, so they are offered only to German readers rather than dropping a
  // Turkish visitor into a German page.
  if (locale === DEFAULT_LOCALE) {
    return [
      { href: VERSAND_PATH, key: "nav.send" },
      { href: anchor("#so-funktionierts"), key: "nav.how" },
      { href: "/mietminderungstabelle", key: "nav.table" },
      { href: "/ratgeber", key: "nav.guide" },
    ];
  }

  // Strip the same three from a locale and one link would be left standing.
  // These rows were never the ones that overflowed, so the check anchor and
  // the FAQ stay where there is room for them.
  return [
    { href: anchor("#pruefung"), key: "nav.check" },
    { href: anchor("#so-funktionierts"), key: "nav.how" },
    { href: localeHref(locale, "/faq"), key: "nav.faq" },
  ];
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, locale } = useTranslation();
  const navLinks = navLinksFor(locale);
  const homeHref = localeHref(locale, "/");
  const checkHref = `${homeHref}#pruefung`;

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
            href={homeHref}
            className="flex shrink-0 items-center gap-2"
            aria-label="Mietminderung-online"
          >
            <BrandMark className="h-9 w-9" />
            <span className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
              Mietminderung
              <span className="text-brand-500">-online</span>
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

            <Button href={checkHref} size="sm" className="max-xl:hidden whitespace-nowrap">
              {t("nav.cta")}
            </Button>

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
            <Button href={checkHref} className="mt-3 w-full" onClick={() => setMobileOpen(false)}>
              {t("nav.cta")}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
