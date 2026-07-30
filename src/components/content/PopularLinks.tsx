import Link from "next/link";
import { ratgeberArtikel } from "@/data/ratgeber";
import { alleMaengel, kategorieIndex, topMaengel } from "@/lib/mangelIndex";

/**
 * Static internal-link hub on the landing page. The homepage carries the most
 * authority, so this is where the category, defect and guide pages are linked
 * from - server-rendered, no JavaScript required to crawl it.
 */
export default function PopularLinks() {
  const top = topMaengel(10);

  return (
    <section className="py-20 bg-gray-50" aria-labelledby="maengel-uebersicht">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="maengel-uebersicht"
            className="text-3xl sm:text-4xl font-bold text-gray-900"
          >
            Mietminderung nach Mangelart
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Wie viel Prozent stehen Ihnen bei Ihrem Mangel zu?{" "}
            {alleMaengel.length} Mangelarten mit den von deutschen Gerichten
            anerkannten Minderungsquoten, jeweils mit Rechner und
            Nachweis-Checkliste.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">
              Alle Kategorien
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {kategorieIndex.map(({ kategorie, seo, maengel }) => {
                const min = Math.min(
                  ...maengel.map((m) => m.mangel.minderung_min)
                );
                const max = Math.max(
                  ...maengel.map((m) => m.mangel.minderung_max)
                );
                return (
                  <li key={seo.slug}>
                    <Link
                      href={`/mietminderung/${seo.slug}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-blue-400 hover:shadow-sm transition-all"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {kategorie.label}
                      </span>
                      <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                        {min}–{max} %
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/mietminderungstabelle"
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
              >
                Zur kompletten Mietminderungstabelle
              </Link>
              <Link
                href="/mietminderung"
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
              >
                Mängel A–Z
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">
                Häufig gesucht
              </h3>
              <ul className="space-y-2">
                {top.map(({ mangel, path }) => (
                  <li key={path}>
                    <Link
                      href={path}
                      className="flex items-center justify-between gap-3 text-sm text-gray-700 hover:text-blue-700 transition-colors"
                    >
                      <span>Mietminderung {mangel.label}</span>
                      <span className="shrink-0 text-xs font-bold text-gray-400">
                        {mangel.minderung_typical} %
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">
                Ratgeber
              </h3>
              <ul className="space-y-2">
                {ratgeberArtikel.map((artikel) => (
                  <li key={artikel.slug}>
                    <Link
                      href={`/ratgeber/${artikel.slug}`}
                      className="text-sm text-gray-700 hover:text-blue-700 transition-colors"
                    >
                      {artikel.navLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
