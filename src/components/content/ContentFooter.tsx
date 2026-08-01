import Link from "next/link";
import { kategorieIndex } from "@/lib/mangelIndex";
import { ratgeberArtikel } from "@/data/ratgeber";
import { VERSAND_PATH } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/**
 * Static footer with a broad internal link block. This is the main hub that
 * distributes crawl budget across the category and guide pages.
 */
export default function ContentFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="text-xl font-bold text-white">
              Mietminderung<span className="text-blue-400">-online</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Kostenlos prüfen, ob Sie die Miete mindern dürfen, die
              Minderungsquote berechnen und eine rechtssichere Mängelanzeige
              erstellen, ohne Anwalt und ohne Registrierung.
            </p>
            <Link
              href="/#pruefung"
              className="inline-flex mt-6 px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              Mietminderung prüfen
            </Link>
            <p className="mt-4 text-sm">
              Fertige Mängelanzeige?{" "}
              <Link
                href={VERSAND_PATH}
                className="font-medium text-blue-400 hover:text-white transition-colors"
              >
                Wir versenden sie an den Vermieter
              </Link>
              .
            </p>
          </div>

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

          <div>
            <h2 className="text-sm font-semibold text-white mb-4">Ratgeber</h2>
            <ul className="space-y-2">
              {ratgeberArtikel.map((artikel) => (
                <li key={artikel.slug}>
                  <Link
                    href={`/ratgeber/${artikel.slug}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {artikel.navLabel}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="text-sm font-semibold text-white mt-8 mb-4">
              Rechtliches
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/impressum"
                  className="text-sm hover:text-white transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-sm hover:text-white transition-colors"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/nutzungsbedingungen"
                  className="text-sm hover:text-white transition-colors"
                >
                  Nutzungsbedingungen
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} {siteConfig.brand}
          </p>
          <p className="text-xs">
            Keine Rechtsberatung, alle Angaben ohne Gewähr.
          </p>
        </div>
      </div>
    </footer>
  );
}
