"use client";

import Image from "next/image";
import Link from "next/link";
import { ratgeberArtikel } from "@/data/ratgeber";
import { useTranslation } from "@/i18n/LanguageContext";

const serviceLinks = [
  { href: "/#pruefung", key: "nav.check" },
  { href: "/#maengelanzeige", key: "nav.letter" },
  { href: "/#so-funktionierts", key: "nav.how" },
  { href: "/faq", key: "nav.faq" },
] as const;

/**
 * German-only content routes, like the legal pages. They carry the site's
 * internal linking, so they stay in the footer on every page.
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

const legalLinks = [
  { href: "/impressum", key: "footer.imprint" },
  { href: "/datenschutz", key: "footer.privacy" },
  { href: "/nutzungsbedingungen", key: "footer.terms" },
  { href: "/widerruf", key: "footer.withdrawal" },
] as const;

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-950 text-brand-200">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Image
                src="/logo.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 brightness-0 invert"
              />
              <span className="text-lg font-bold text-white">
                Mietminderung<span className="text-brand-300">.online</span>
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

          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="mb-4 text-sm font-semibold text-white">
              {t("footer.legal")}
            </h2>
            <ul className="space-y-1">
              {legalLinks.map((link) => (
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
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} mietminderung.online — {t("footer.rights")}
          </p>
          <p>{t("footer.noLegal")}</p>
        </div>
      </div>
    </footer>
  );
}
