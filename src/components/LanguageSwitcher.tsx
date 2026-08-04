"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * The single language control for the whole site. Renders as a compact chip in
 * the header; on small screens the label collapses to the flag so the header
 * stays on one line.
 *
 * The options are links, not buttons. The language is a URL now, so switching
 * has to be navigation — that is what makes each translation shareable,
 * linkable and indexable. On a German-only page (the legal texts, the dispatch
 * page) `hrefFor` points at that language's homepage rather than at a prefixed
 * URL that does not exist.
 */
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { t, locale, locales, localeInfo, hrefFor } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        data-testid="language-switcher"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t("hero.selectLang")}
        className="flex h-11 items-center gap-2 rounded-full border border-ink-200 bg-paper-raised px-3 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700 sm:px-4"
      >
        <Globe className="h-4 w-4 text-brand-500" aria-hidden />
        <span className="text-base leading-none">{localeInfo.flag}</span>
        <span className="hidden sm:inline">{localeInfo.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          aria-label={t("hero.selectLang")}
          className="animate-fade-in absolute end-0 top-full z-50 mt-2 min-w-[13rem] overflow-hidden rounded-card border border-ink-200 bg-paper-raised py-1.5 shadow-[var(--shadow-float)]"
        >
          <li className="px-4 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
            {t("hero.selectLang")}
          </li>
          {locales.map((l) => (
            <li key={l.code}>
              <Link
                href={hrefFor(l.code)}
                hrefLang={l.code}
                lang={l.code}
                data-testid={`locale-${l.code}`}
                aria-current={locale === l.code ? "true" : undefined}
                onClick={() => setOpen(false)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm transition-colors hover:bg-brand-50 ${
                  locale === l.code
                    ? "bg-brand-50 font-semibold text-brand-700"
                    : "text-ink-700"
                }`}
              >
                <span className="text-base leading-none">{l.flag}</span>
                <span className="flex-1">{l.label}</span>
                {locale === l.code && (
                  <Check className="h-4 w-4 text-brand-600" aria-hidden />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
