import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen — Mietminderung Online",
  description: "Nutzungsbedingungen von mietminderung.online",
};

export default function Nutzungsbedingungen() {
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
          Nutzungsbedingungen
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. Geltungsbereich
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Diese Nutzungsbedingungen gelten für die Nutzung der Webseite
              mietminderung.online (nachfolgend „Webseite"), betrieben von Paul
              Ohm, Holzgasse 8, 50676 Köln. Mit der Nutzung der Webseite
              erklären Sie sich mit diesen Bedingungen einverstanden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. Leistungsbeschreibung
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Die Webseite bietet einen kostenlosen Online-Rechner zur
              Einschätzung möglicher Mietminderungsansprüche sowie die
              Möglichkeit, eine Mängelanzeige zu erstellen. Sämtliche Dienste
              der Webseite sind kostenlos und erfordern keine Registrierung.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. Keine Rechtsberatung
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Die auf dieser Webseite bereitgestellten Informationen,
              Berechnungen und generierten Dokumente dienen ausschließlich der
              allgemeinen Information und stellen{" "}
              <strong>keine Rechtsberatung</strong> dar. Die angezeigten
              Minderungsquoten basieren auf veröffentlichten Gerichtsurteilen
              und dienen lediglich als Orientierungswerte. Jeder Einzelfall wird
              von Gerichten individuell beurteilt.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Wir empfehlen dringend, bei konkreten rechtlichen Fragen einen
              Mieterverein oder Rechtsanwalt zu konsultieren. Die Nutzung der
              Webseite begründet kein Mandatsverhältnis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. Haftungsbeschränkung
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Die Inhalte der Webseite werden mit größtmöglicher Sorgfalt
              erstellt. Dennoch übernehmen wir keine Gewähr für die Richtigkeit,
              Vollständigkeit und Aktualität der bereitgestellten Informationen
              und Berechnungen. Die Nutzung der Webseite erfolgt auf eigenes
              Risiko.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Eine Haftung für Schäden, die durch die Nutzung der auf dieser
              Webseite bereitgestellten Informationen, Berechnungen oder
              Dokumente entstehen, ist — soweit gesetzlich zulässig —
              ausgeschlossen. Dies gilt insbesondere für Schäden, die aus einer
              zu hohen oder unberechtigten Mietminderung resultieren.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. Dateneingabe und Datenschutz
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Für die Nutzung des Mietminderungsrechners und die Erstellung
              einer Mängelanzeige geben Sie personenbezogene Daten ein (z.B.
              Name, Adresse). Diese Daten werden ausschließlich zur Erstellung
              des gewünschten Dokuments verwendet und nicht dauerhaft
              gespeichert, sofern Sie nicht ausdrücklich eine Speicherung
              (z.B. E-Mail-Versand) anfordern.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. Urheberrecht
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Die auf dieser Webseite veröffentlichten Inhalte unterliegen dem
              deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung oder
              Verbreitung außerhalb der Grenzen des Urheberrechts bedarf der
              schriftlichen Zustimmung des Betreibers. Die erstellten
              Mängelanzeigen dürfen von den Nutzern frei für den eigenen
              Gebrauch verwendet werden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Verfügbarkeit
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Wir bemühen uns um eine möglichst unterbrechungsfreie
              Verfügbarkeit der Webseite. Ein Anspruch auf ständige
              Verfügbarkeit besteht jedoch nicht. Wartungsarbeiten,
              technische Störungen oder höhere Gewalt können zu
              vorübergehenden Ausfällen führen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              8. Änderungen der Nutzungsbedingungen
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Wir behalten uns vor, diese Nutzungsbedingungen jederzeit zu
              ändern. Die jeweils aktuelle Fassung ist auf dieser Seite
              einsehbar. Durch die fortgesetzte Nutzung der Webseite nach einer
              Änderung erklären Sie sich mit den neuen Bedingungen
              einverstanden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              9. Anwendbares Recht
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand
              ist, soweit gesetzlich zulässig, Köln.
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-4 border-t border-gray-100">
            Stand: März 2026
          </p>
        </div>
      </div>
    </div>
  );
}
