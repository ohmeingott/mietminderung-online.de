import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Impressum — Mietminderung Online",
  description:
    "Impressum und Anbieterkennzeichnung von mietminderung.online gemäß § 5 DDG: Betreiber, Anschrift, Kontakt und Haftungshinweise.",
  path: "/impressum",
});

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 mb-8"
        >
          &larr; Zurück zur Startseite
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">
          Impressum
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Angaben gemäß § 5 DDG
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Paul Ohm
              <br />
              Holzgasse 8
              <br />
              50676 Köln
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Kontakt
            </h2>
            <p className="text-gray-700 leading-relaxed">
              E-Mail:{" "}
              <a
                href="mailto:pjhohm@gmail.com"
                className="text-blue-700 hover:underline"
              >
                pjhohm@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Haftung für Inhalte
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach
              Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
              hinweisen.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon
              unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
              Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
              Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden
              wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Haftung für Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
              wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
              überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
              jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
              zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
              derartige Links umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Urheberrecht
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              Downloads und Kopien dieser Seite sind nur für den privaten,
              nicht kommerziellen Gebrauch gestattet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Keine Rechtsberatung
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Die auf dieser Webseite bereitgestellten Informationen dienen
              ausschließlich der allgemeinen Information und stellen keine
              Rechtsberatung dar. Trotz sorgfältiger Recherche können wir keine
              Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der
              Inhalte übernehmen. Die Minderungsquoten basieren auf
              Gerichtsurteilen und dienen lediglich als Orientierungswerte. Bei
              konkreten rechtlichen Fragen empfehlen wir die Beratung durch
              einen Mieterverein oder Rechtsanwalt.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
