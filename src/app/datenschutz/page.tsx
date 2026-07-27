import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Datenschutzerklärung — Mietminderung Online",
  description:
    "Datenschutzerklärung von mietminderung.online: welche Daten wir verarbeiten, auf welcher Rechtsgrundlage und welche Rechte Sie nach DSGVO haben.",
  path: "/datenschutz",
});

export default function Datenschutz() {
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
          Datenschutzerklärung
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. Verantwortlicher
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Paul Ohm
              <br />
              Holzgasse 8
              <br />
              50676 Köln
              <br />
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
              2. Überblick der Verarbeitungen
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Diese Webseite ermöglicht es Mietern, die Höhe einer möglichen
              Mietminderung zu berechnen und eine Mängelanzeige an den Vermieter
              zu erstellen. Dabei werden personenbezogene Daten ausschließlich
              zur Erbringung des jeweiligen Dienstes verarbeitet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. Welche Daten wir erheben
            </h2>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">
              a) Mängelanzeige-Formular
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Wenn Sie eine Mängelanzeige erstellen, geben Sie folgende Daten
              ein:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
              <li>Name, Anschrift, Wohnungsnummer</li>
              <li>Telefonnummer, E-Mail-Adresse</li>
              <li>Name und Anschrift des Vermieters</li>
              <li>Beschreibung der Mängel (Raum, Zeitpunkt, Details)</li>
              <li>Digitale Unterschrift (optional)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              Diese Daten werden <strong>nicht auf unserem Server gespeichert</strong>.
              Sie werden ausschließlich in Ihrem Browser verarbeitet, um den
              Brief zu erzeugen. Eine Speicherung erfolgt nur dann, wenn Sie
              sich aktiv für eine der Versandoptionen (E-Mail oder Post)
              entscheiden — in diesem Fall werden die Daten an den jeweiligen
              Dienstleister übermittelt (siehe Abschnitt 5).
            </p>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">
              b) Mietminderungs-Rechner
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Die Eingabe der Bruttowarmmiete und Auswahl der Mängel erfolgt
              ausschließlich in Ihrem Browser. Es werden keine Daten an unseren
              Server übertragen.
            </p>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">
              c) Newsletter / E-Mail-Opt-in
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Wenn Sie im Formular dem Erhalt von Informationen zustimmen
              (Opt-in-Checkbox), werden Ihre E-Mail-Adresse und Ihr Name an
              einen externen Dienst übermittelt. Rechtsgrundlage ist Ihre
              Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können diese
              jederzeit widerrufen, indem Sie uns per E-Mail kontaktieren.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. Rechtsgrundlagen
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>
                <strong>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</strong>{" "}
                Newsletter-Opt-in, optionaler E-Mail-Versand, optionaler
                Postversand.
              </li>
              <li>
                <strong>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung):</strong>{" "}
                Verarbeitung Ihrer Daten zur Erstellung und zum Versand der
                Mängelanzeige.
              </li>
              <li>
                <strong>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse):</strong>{" "}
                Technisch notwendige Verarbeitung für den Betrieb der Webseite.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. Drittanbieter und Datenübermittlung
            </h2>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">
              a) E-Mail-Versand — Resend
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Wenn Sie die Mängelanzeige per E-Mail versenden, nutzen wir den
              Dienst <strong>Resend</strong> (Resend, Inc., USA). Dabei werden
              Ihre E-Mail-Adresse, Ihr Name und der Briefinhalt an Resend
              übermittelt. Die Übermittlung in die USA erfolgt auf Grundlage von
              Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).
            </p>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">
              b) Postversand — eBrief.de
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Wenn Sie die Mängelanzeige per Post versenden, wird das generierte
              PDF an <strong>eBrief.de</strong> übermittelt. eBrief druckt den
              Brief und versendet ihn postalisch an die Adresse Ihres
              Vermieters. Es werden der Briefinhalt sowie die Empfängeradresse
              übermittelt.
            </p>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">
              c) KI-Textverbesserung — Anthropic
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Zur optionalen Verbesserung der Mängelbeschreibungen nutzen wir
              die API von <strong>Anthropic</strong> (Anthropic, PBC, USA).
              Dabei werden die von Ihnen eingegebenen Mängelbeschreibungen (ohne
              Ihren Namen oder Ihre Adresse) an Anthropic übermittelt. Anthropic
              verarbeitet diese Daten nicht für eigene Trainingszwecke. Die
              Übermittlung in die USA erfolgt auf Grundlage von
              Standardvertragsklauseln.
            </p>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">
              d) Hosting — Vercel
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Diese Webseite wird bei <strong>Vercel Inc.</strong> (USA)
              gehostet. Bei jedem Seitenaufruf werden technisch bedingt
              Server-Logdaten erhoben (IP-Adresse, Zeitpunkt, angefragte Seite,
              Browser-Typ). Diese Daten werden von Vercel automatisch erhoben
              und nach kurzer Zeit gelöscht.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. Lokale Speicherung (localStorage)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Wir speichern Ihre Spracheinstellung (z.B. &bdquo;de&ldquo;,
              &bdquo;tr&ldquo;) im
              localStorage Ihres Browsers. Dies ist technisch notwendig, damit
              die Webseite in Ihrer bevorzugten Sprache angezeigt wird. Es
              werden keine Cookies gesetzt und keine Tracking-Daten erhoben.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Keine Cookies, kein Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Diese Webseite verwendet keine Cookies, keine Analyse-Tools
              (z.B. Google Analytics) und keine Tracking-Pixel. Es findet kein
              Nutzer-Tracking statt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              8. Ihre Rechte nach DSGVO
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Sie haben jederzeit das Recht auf:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
              <li>
                <strong>Auskunft</strong> über die zu Ihrer Person gespeicherten
                Daten (Art. 15 DSGVO)
              </li>
              <li>
                <strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)
              </li>
              <li>
                <strong>Löschung</strong> Ihrer Daten (Art. 17 DSGVO)
              </li>
              <li>
                <strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)
              </li>
              <li>
                <strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)
              </li>
              <li>
                <strong>Widerspruch</strong> gegen die Verarbeitung (Art. 21
                DSGVO)
              </li>
              <li>
                <strong>Widerruf</strong> einer erteilten Einwilligung mit
                Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter{" "}
              <a
                href="mailto:pjhohm@gmail.com"
                className="text-blue-700 hover:underline"
              >
                pjhohm@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              9. Beschwerderecht
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
              zu beschweren. Die für uns zuständige Aufsichtsbehörde ist:
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Landesbeauftragte für Datenschutz und Informationsfreiheit
              Nordrhein-Westfalen
              <br />
              Kavalleriestr. 2–4
              <br />
              40213 Düsseldorf
              <br />
              <a
                href="https://www.ldi.nrw.de"
                className="text-blue-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.ldi.nrw.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              10. Aktualität dieser Datenschutzerklärung
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Stand: März 2026. Wir behalten uns vor, diese Datenschutzerklärung
              bei Änderungen unserer Datenverarbeitung oder bei neuen
              gesetzlichen Anforderungen anzupassen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
