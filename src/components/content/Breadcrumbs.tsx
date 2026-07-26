import Link from "next/link";
import type { Crumb } from "@/lib/seo";

/**
 * Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted by
 * the page itself so both stay in sync.
 */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-gray-700 font-medium" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.path}
                    className="hover:text-blue-700 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                  <span aria-hidden="true" className="text-gray-300">
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
