"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { translations, locales, type Locale, type LocaleInfo } from "./translations";
import { contentTranslations } from "./content";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
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
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "locale";
const DEFAULT_LOCALE: Locale = "de";

/* --------------------------------------------------------------------------
   The selected language lives in localStorage, which React treats as an
   external store. Reading it through useSyncExternalStore keeps the server
   render deterministic ("de") while the client picks up the stored value
   during hydration - without a setState-in-effect cascade.
-------------------------------------------------------------------------- */

let cachedLocale: Locale | null = null;
const listeners = new Set<() => void>();

function readStoredLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    return saved && translations[saved] ? saved : DEFAULT_LOCALE;
  } catch {
    // Storage disabled (private mode, blocked cookies) - fall back to German.
    return DEFAULT_LOCALE;
  }
}

function getSnapshot(): Locale {
  cachedLocale ??= readStoredLocale();
  return cachedLocale;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Keep other tabs of the site in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedLocale = readStoredLocale();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function writeLocale(next: Locale) {
  cachedLocale = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not persisting is acceptable - the language still applies for this visit.
  }
  listeners.forEach((l) => l());
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keep the document in sync so screen readers, hyphenation and RTL layout
  // follow the selected language.
  useEffect(() => {
    const info = locales.find((l) => l.code === locale) || locales[0];
    document.documentElement.lang = locale;
    document.documentElement.dir = info.dir || "ltr";
  }, [locale]);

  const setLocale = useCallback((next: Locale) => writeLocale(next), []);

  const t = useCallback(
    (key: string): string =>
      translations[locale]?.[key] ?? translations[DEFAULT_LOCALE][key] ?? key,
    [locale]
  );

  const tc = useCallback(
    (key: string, germanFallback: string): string => {
      if (locale === DEFAULT_LOCALE) return germanFallback;
      return contentTranslations[locale]?.[key] ?? germanFallback;
    },
    [locale]
  );

  const localeInfo = locales.find((l) => l.code === locale) || locales[0];

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t,
        tc,
        localeInfo,
        locales,
        dir: localeInfo.dir || "ltr",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
