import Link from "next/link";
import { DEFAULT_LOCALE, localeHref } from "@/i18n/routing";
import type { Locale } from "@/i18n/translations";
import type { Crumb } from "@/lib/seo";

/**
 * Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted by
 * the page itself so both stay in sync — which is why both take the German
 * `crumb.path` and the locale, rather than pre-resolved URLs that could drift
 * apart.
 */
export default function Breadcrumbs({
  crumbs,
  locale = DEFAULT_LOCALE,
}: {
  crumbs: Crumb[];
  locale?: Locale;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-ink-700 font-medium" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link
                    href={localeHref(locale, crumb.path)}
                    className="hover:text-brand-700 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                  <span aria-hidden="true" className="text-ink-300">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
