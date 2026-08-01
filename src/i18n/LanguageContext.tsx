"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { translations, locales, type Locale, type LocaleInfo } from "./translations";
import { contentTranslations } from "./content";
import { DEFAULT_LOCALE, localeHref, splitLocalePath } from "./routing";

interface LanguageContextType {
  locale: Locale;
  /** Translate a UI string key. Falls back to German, then to the key itself. */
  t: (key: string) => string;
  /**
   * Translate a content string (defect catalogue, FAQ). Falls back to the
   * German source text that lives in `src/data/maengel.ts`.
   */
  tc: (key: string, germanFallback: string) => string;
  localeInfo: LocaleInfo;
  locales: LocaleInfo[];
  dir: "rtl" | "ltr";
  /** The German path this page translates, e.g. "/faq". */
  basePath: string;
  /** URL of the current page in another language. */
  hrefFor: (locale: Locale) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

/* --------------------------------------------------------------------------
   The selected language is the URL, and nothing else.

   It used to live in localStorage, which meant the server always rendered
   German and the translation only appeared after hydration - invisible to
   every crawler, and unlinkable. Reading it from the pathname instead means
   /tr is server-rendered in Turkish, can be linked, shared and indexed, and
   needs no client state at all.

   Nothing is persisted on purpose. A stored preference that silently
   overrides the URL is how a visitor ends up on /tr reading German, and how a
   crawler fetching /tr gets a different page than the one it indexed.
-------------------------------------------------------------------------- */

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { locale, basePath } = splitLocalePath(pathname ?? "/");

  const localeInfo = useMemo(
    () => locales.find((l) => l.code === locale) ?? locales[0],
    [locale],
  );

  // Keep the document in sync so screen readers, hyphenation and RTL layout
  // follow the served language. The server-rendered `lang` is German for every
  // route; see the note in src/app/layout.tsx.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeInfo.dir ?? "ltr";
  }, [locale, localeInfo]);

  const t = useCallback(
    (key: string): string =>
      translations[locale]?.[key] ?? translations[DEFAULT_LOCALE][key] ?? key,
    [locale],
  );

  const tc = useCallback(
    (key: string, germanFallback: string): string => {
      if (locale === DEFAULT_LOCALE) return germanFallback;
      return contentTranslations[locale]?.[key] ?? germanFallback;
    },
    [locale],
  );

  const hrefFor = useCallback(
    (target: Locale) => localeHref(target, basePath),
    [basePath],
  );

  const value = useMemo(
    () => ({
      locale,
      t,
      tc,
      localeInfo,
      locales,
      dir: localeInfo.dir ?? ("ltr" as const),
      basePath,
      hrefFor,
    }),
    [locale, t, tc, localeInfo, basePath, hrefFor],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
