"use client";

import Link from "next/link";
import { ratgeberArtikel } from "@/data/ratgeber";
import { useTranslation } from "@/i18n/LanguageContext";
import { DEFAULT_LOCALE, localeHref } from "@/i18n/routing";
import type { Locale } from "@/i18n/translations";
import { VERSAND_PATH } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import BrandMark from "./BrandMark";

/** Same rule as the header: locale-aware where a translation exists. */
function serviceLinksFor(locale: Locale) {
  const home = localeHref(locale, "/");
  const shared = [
    { href: `${home}#pruefung`, key: "nav.check" },
    { href: `${home}#maengelanzeige`, key: "nav.letter" },
  ];
  const dispatch = [{ href: VERSAND_PATH, key: "nav.send" }];
  const rest = [
    { href: `${home}#so-funktionierts`, key: "nav.how" },
    { href: localeHref(locale, "/faq"), key: "nav.faq" },
  ];

  return locale === DEFAULT_LOCALE
    ? [...shared, ...dispatch, ...rest]
    : [...shared, ...rest];
}

/**
 * German-only content routes. They carry the site's internal linking, so they
 * stay in the footer on every German page — but they are hidden on the locale
 * routes, where every one of them would be a link out of the visitor's
 * language.
 */
const contentLinks = [
  { href: "/mietminderungstabelle", label: "Mietminderungstabelle" },
  { href: "/mietminderung", label: "Mängel A–Z" },
  { href: "/ratgeber", label: "Ratgeber" },
  ...ratgeberArtikel.map((artikel) => ({
    href: `/ratgeber/${artikel.slug}`,
    label: artikel.navLabel,
  })),
] as const;

/**
 * The legal texts keep a German body but exist under every locale prefix, so
 * following one of these links never throws the visitor out of the language
 * they are reading. See src/app/[locale]/[rechtstext]/page.tsx.
 */
const legalLinks = [
  { path: "/impressum", key: "footer.imprint" },
  { path: "/datenschutz", key: "footer.privacy" },
  { path: "/nutzungsbedingungen", key: "footer.terms" },
  { path: "/widerruf", key: "footer.withdrawal" },
] as const;

export default function Footer() {
  const { t, locale } = useTranslation();
  const serviceLinks = serviceLinksFor(locale);
  const showGermanContent = locale === DEFAULT_LOCALE;

  return (
    <footer className="bg-brand-950 text-brand-200">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div
          className={`grid grid-cols-2 gap-x-6 gap-y-10 ${
            showGermanContent ? "md:grid-cols-5" : "md:grid-cols-4"
          }`}
        >
          <div className="col-span-2">
            <div className="mb-4 flex items-center gap-2">
              {/* Brand blue has too little contrast on the navy footer, so the
                  mark runs in its inverse colourway. */}
              <BrandMark
                className="h-8 w-8"
                tileClassName="fill-white"
                letterClassName="fill-brand-800"
              />
              <span className="text-lg font-bold text-white">
                Mietminderung<span className="text-brand-300">-online</span>
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed">{t("footer.desc")}</p>
          </div>

          <nav aria-labelledby="footer-service">
            <h2 id="footer-service" className="mb-4 text-sm font-semibold text-white">
              {t("footer.service")}
            </h2>
            <ul className="space-y-1">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[2.25rem] items-center text-sm transition-colors hover:text-white"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {showGermanContent && (
            <nav aria-labelledby="footer-content">
              <h2 id="footer-content" className="mb-4 text-sm font-semibold text-white">
                Ratgeber &amp; Tabellen
              </h2>
              <ul className="space-y-1">
                {contentLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-[2.25rem] items-center text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="mb-4 text-sm font-semibold text-white">
              {t("footer.legal")}
            </h2>
            <ul className="space-y-1">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={localeHref(locale, link.path)}
                    className="inline-flex min-h-[2.25rem] items-center text-sm transition-colors hover:text-white"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.brand} · {t("footer.rights")}
          </p>
          <p>{t("footer.noLegal")}</p>
        </div>
      </div>
    </footer>
  );
}
