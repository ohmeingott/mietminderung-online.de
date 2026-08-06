import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { hatRatgeber } from "@/i18n/ratgeber";
import { DEFAULT_LOCALE, localeHref } from "@/i18n/routing";
import { ts } from "@/i18n/server";
import type { Locale } from "@/i18n/translations";
import { VERSAND_PATH } from "@/lib/seo";

/**
 * The navigation of the language the page is served in.
 *
 * Same rule as `Header.tsx`: a link is offered only where the page behind it
 * exists in that language. The defect pages, the table and the dispatch page
 * are still German-only, so a Turkish reader is not dropped into a German
 * page. The guides are the first content route that leaves that group — they
 * appear for every language that has at least one of them, which is why the
 * check is `hatRatgeber` and not `locale === DEFAULT_LOCALE`.
 */
function navLinksFor(locale: Locale) {
  const links: { href: string; label: string }[] = [];

  if (locale === DEFAULT_LOCALE) {
    links.push(
      { href: "/mietminderung", label: "Mängel A–Z" },
      { href: "/mietminderungstabelle", label: "Mietminderungstabelle" },
      { href: VERSAND_PATH, label: "Brief versenden" },
    );
  }

  if (hatRatgeber(locale)) {
    links.push({
      href: localeHref(locale, "/ratgeber"),
      label: ts(locale, "nav.guide"),
    });
  }

  links.push({
    href: localeHref(locale, "/faq"),
    label: ts(locale, "nav.faq"),
  });

  return links;
}

/**
 * Static, server-rendered header for the content pages. Deliberately plain
 * <Link> markup so every crawler sees the internal link graph without JS.
 */
export default function ContentHeader({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const navLinks = navLinksFor(locale);
  const home = localeHref(locale, "/");

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href={home} className="flex items-center gap-2 shrink-0">
            <BrandMark className="w-9 h-9" />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-ink-900">
              Mietminderung<span className="text-brand-600">-online</span>
            </span>
          </Link>

          <nav aria-label={ts(locale, "nav.primary")} className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-ink-600 hover:text-brand-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button
            href={`${home}#pruefung`}
            size="sm"
            className="shrink-0 max-sm:px-4"
          >
            {ts(locale, "nav.cta")}
          </Button>
        </div>

        <nav aria-label={ts(locale, "nav.mobile")} className="md:hidden pb-3">
          <ul className="flex items-center gap-4 overflow-x-auto text-sm">
            {navLinks.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  className="font-medium text-ink-600 hover:text-brand-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
