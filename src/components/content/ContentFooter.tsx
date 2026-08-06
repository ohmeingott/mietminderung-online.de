import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  hatRatgeber,
  ratgeberSlugsFuer,
  ratgeberText,
} from "@/i18n/ratgeber";
import { DEFAULT_LOCALE, localeHref } from "@/i18n/routing";
import { ts } from "@/i18n/server";
import type { Locale } from "@/i18n/translations";
import { kategorieIndex } from "@/lib/mangelIndex";
import { VERSAND_PATH } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/**
 * Static footer with a broad internal link block. On the German pages this is
 * the main hub that distributes crawl budget across the category and guide
 * pages.
 *
 * Under a locale prefix the category block is dropped rather than translated.
 * Those pages are German-only, so every one of the thirteen links would have
 * to fall back to the language's homepage — thirteen identical links that go
 * nowhere useful. The crawl-budget argument does not apply there either: the
 * German footer already does that job, and the localized guides link to each
 * other. When the defect pages get translated they come back on their own.
 */
export default function ContentFooter({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const istDeutsch = locale === DEFAULT_LOCALE;
  const home = localeHref(locale, "/");
  const zeigtRatgeber = hatRatgeber(locale);

  const ratgeberLinks = zeigtRatgeber
    ? ratgeberSlugsFuer(locale).map((slug) => ({
        slug,
        href: localeHref(locale, `/ratgeber/${slug}`),
        label: ratgeberText(locale, slug)?.navLabel ?? slug,
      }))
    : [];

  return (
    <footer className="bg-ink-900 text-ink-400 pt-16 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 gap-10 mb-12 ${
            istDeutsch ? "md:grid-cols-4" : "md:grid-cols-2"
          }`}
        >
          <div>
            <Link href={home} className="text-xl font-bold text-white">
              Mietminderung<span className="text-brand-400">-online</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              {ts(locale, "footer.desc")}
            </p>
            <Button href={`${home}#pruefung`} size="sm" className="mt-6">
              {ts(locale, "nav.check")}
            </Button>
            {istDeutsch && (
              <p className="mt-4 text-sm">
                Fertige Mängelanzeige?{" "}
                <Link
                  href={VERSAND_PATH}
                  className="font-medium text-brand-400 hover:text-white transition-colors"
                >
                  Wir versenden sie an den Vermieter
                </Link>
                .
              </p>
            )}
          </div>

          {istDeutsch && (
            <div className="md:col-span-2">
              <h2 className="text-sm font-semibold text-white mb-4">
                Mietminderung nach Mangelart
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {kategorieIndex.map(({ seo, kategorie }) => (
                  <li key={seo.slug}>
                    <Link
                      href={`/mietminderung/${seo.slug}`}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {kategorie.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            {zeigtRatgeber && (
              <>
                <h2 className="text-sm font-semibold text-white mb-4">
                  {ts(locale, "nav.guide")}
                </h2>
                <ul className="space-y-2">
                  {ratgeberLinks.map((link) => (
                    <li key={link.slug}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2
              className={`text-sm font-semibold text-white mb-4 ${
                zeigtRatgeber ? "mt-8" : ""
              }`}
            >
              {ts(locale, "footer.legal")}
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href={localeHref(locale, "/impressum")}
                  className="text-sm hover:text-white transition-colors"
                >
                  {ts(locale, "footer.imprint")}
                </Link>
              </li>
              <li>
                <Link
                  href={localeHref(locale, "/datenschutz")}
                  className="text-sm hover:text-white transition-colors"
                >
                  {ts(locale, "footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={localeHref(locale, "/nutzungsbedingungen")}
                  className="text-sm hover:text-white transition-colors"
                >
                  {ts(locale, "footer.terms")}
                </Link>
              </li>
              {/*
                § 356a Abs. 1 BGB wants the withdrawal button permanently
                available. The button itself lives at the top of /widerruf, so
                what makes it permanently available is that every page links
                there — and these seven content pages did not, because this
                footer carried only three of the four legal links that
                src/components/Footer.tsx has.
              */}
              <li>
                <Link
                  href="/widerruf"
                  className="text-sm hover:text-white transition-colors"
                >
                  Widerrufsrecht
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} {siteConfig.brand}
          </p>
          <p className="text-xs">{ts(locale, "footer.noLegal")}</p>
        </div>
      </div>
    </footer>
  );
}
