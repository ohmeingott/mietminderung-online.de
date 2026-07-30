import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import LegalPage, { NumberedSections } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Datenschutzerklärung — Mietminderung Online",
  description:
    "Datenschutzerklärung von mietminderung.online: welche Daten wir verarbeiten, auf welcher Rechtsgrundlage und welche Rechte Sie nach DSGVO haben.",
  path: "/datenschutz",
});

const mailto = `mailto:${site.operator.email}`;

export default function Datenschutz() {
  const sections = [
    {
      heading: "Verantwortlicher",
      body: (
        <>
          <address>
            {site.operator.name}
            <br />
            {site.operator.street}
            <br />
            {site.operator.zip} {site.operator.city}
            <br />
            E-Mail: <a href={mailto}>{site.operator.email}</a>
          </address>
          <p>
            Ein Datenschutzbeauftragter ist nicht bestellt, da die
            Voraussetzungen des Art. 37 DSGVO bzw. § 38 BDSG nicht vorliegen.
          </p>
        </>
      ),
    },
    {
      heading: "Grundsatz: Verarbeitung überwiegend im Browser",
      body: (
        <>
          <p>
            Dieser Dienst ist so gebaut, dass so wenig Daten wie möglich unseren
            Server erreichen. Die Anspruchsprüfung, die Berechnung der
            Minderungsquote sowie das Erzeugen und Herunterladen der
            Mängelanzeige (PDF, Textdatei) laufen{" "}
            <strong>vollständig in Ihrem Browser</strong> ab. Ihre Angaben zu
            Ihrer Person, Ihrer Wohnung und Ihrem Vermieter werden dabei{" "}
            <strong>nicht an uns übertragen</strong> und von uns nicht
            gespeichert.
          </p>
          <p>
            Eine Übermittlung findet nur statt, wenn Sie eine der unten
            beschriebenen optionalen Funktionen aktiv auslösen.
          </p>
        </>
      ),
    },
    {
      heading: "Aufruf der Webseite (Server-Logs)",
      body: (
        <>
          <p>
            Beim Aufruf der Seite verarbeitet unser Hoster technisch notwendige
            Verbindungsdaten: IP-Adresse, Datum und Uhrzeit, angeforderte
            Ressource, Referrer, Browsertyp und Betriebssystem. Diese Daten sind
            erforderlich, um die Seite auszuliefern und die Systemsicherheit zu
            gewährleisten.
          </p>
          <ul>
            <li>
              <strong>Zweck:</strong> Auslieferung der Webseite,
              Betriebssicherheit, Abwehr von Missbrauch
            </li>
            <li>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse am sicheren Betrieb)
            </li>
            <li>
              <strong>Speicherdauer:</strong> Löschung durch den Hoster nach
              kurzer Zeit, spätestens nach 30 Tagen
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Reichweitenmessung — Vercel Web Analytics",
      body: (
        <>
          <p>
            Wir nutzen <strong>Vercel Web Analytics</strong> der Vercel Inc., 340
            S Lemon Ave #4133, Walnut, CA 91789, USA, um zu verstehen, welche
            Seiten aufgerufen werden und wie viele Besucher der Dienst hat.
          </p>
          <p>
            Vercel Web Analytics setzt <strong>keine Cookies</strong> und
            speichert oder liest keine Informationen auf Ihrem Endgerät. Es wird
            kein geräteübergreifendes Profil gebildet und keine Wiedererkennung
            über die Sitzung hinaus vorgenommen. Aus IP-Adresse, User-Agent und
            der aufgerufenen Seite wird serverseitig ein Hashwert gebildet, der
            täglich wechselt und danach nicht mehr zugeordnet werden kann; die
            IP-Adresse selbst wird nicht gespeichert.
          </p>
          <ul>
            <li>
              <strong>Zweck:</strong> statistische Auswertung der Nutzung,
              Verbesserung des Angebots
            </li>
            <li>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse an einer datensparsamen
              Reichweitenmessung). Eine Einwilligung nach § 25 Abs. 1 TDDDG ist
              nicht erforderlich, da keine Informationen auf Ihrem Endgerät
              gespeichert oder ausgelesen werden.
            </li>
            <li>
              <strong>Speicherdauer:</strong> aggregierte Statistiken; der
              tagesbezogene Hash wird nach 24 Stunden unbrauchbar
            </li>
          </ul>
          <p>
            Weitere Informationen:{" "}
            <a
              href="https://vercel.com/docs/analytics/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              vercel.com/docs/analytics/privacy-policy
            </a>
            .
          </p>
        </>
      ),
    },
    {
      heading: "Hosting — Vercel",
      body: (
        <p>
          Diese Webseite wird bei der <strong>Vercel Inc.</strong> (USA)
          betrieben; die Auslieferung erfolgt über Rechenzentren in Frankfurt am
          Main (Region <code>fra1</code>). Mit Vercel besteht ein
          Auftragsverarbeitungsvertrag nach Art. 28 DSGVO. Soweit im Einzelfall
          Daten in die USA übermittelt werden, stützt sich die Übermittlung auf
          Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO sowie auf die
          Zertifizierung von Vercel unter dem EU-US Data Privacy Framework.
        </p>
      ),
    },
    {
      heading: "KI-Textverbesserung — Google Gemini",
      body: (
        <>
          <p>
            Wenn Sie im Schritt „Mängel beschreiben“ auf „Vorschau anzeigen“
            klicken, werden die von Ihnen eingegebenen{" "}
            <strong>Mangelbeschreibungen</strong> (Bezeichnung des Mangels, Raum,
            Zeitraum, Freitext) an die Gemini-API der{" "}
            <strong>Google Ireland Limited</strong>, Gordon House, Barrow Street,
            Dublin 4, Irland übermittelt. Dort werden sie sprachlich geglättet
            und — falls Sie in einer anderen Sprache geschrieben haben — ins
            Deutsche übersetzt.
          </p>
          <ul>
            <li>
              <strong>Nicht übermittelt werden:</strong> Ihr Name, Ihre
              Anschrift, Ihre Telefonnummer, Ihre E-Mail-Adresse, die Daten Ihres
              Vermieters und Ihre Unterschrift.
            </li>
            <li>
              <strong>Zweck:</strong> Verbesserung und Übersetzung der von Ihnen
              verfassten Mangelbeschreibung
            </li>
            <li>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
              (Durchführung der von Ihnen angeforderten Leistung)
            </li>
            <li>
              <strong>Speicherdauer:</strong> Wir speichern die Texte nicht.
              Google verarbeitet über die kostenpflichtige Gemini-API
              übermittelte Inhalte nicht zum Training seiner Modelle und löscht
              sie nach kurzer Zeit.
            </li>
          </ul>
          <p>
            Bitte geben Sie in das Freitextfeld keine Angaben ein, die Sie nicht
            übermitteln möchten — insbesondere keine Gesundheitsdaten oder Daten
            Dritter. Ist der Dienst nicht konfiguriert oder nicht erreichbar,
            wird Ihr Text unverändert übernommen. Weitere Informationen:{" "}
            <a
              href="https://ai.google.dev/gemini-api/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              ai.google.dev/gemini-api/terms
            </a>
            .
          </p>
        </>
      ),
    },
    {
      heading: "E-Mail-Verteiler (freiwilliges Opt-in)",
      body: (
        <>
          <p>
            Im Formular können Sie freiwillig ankreuzen, dass wir Sie über
            Neuigkeiten informieren dürfen. Nur dann werden{" "}
            <strong>Ihr Name und Ihre E-Mail-Adresse</strong> zusammen mit dem
            Zeitpunkt der Anmeldung an einen von uns betriebenen
            Google-Sheets-Webhook (Google Ireland Limited) übermittelt und dort
            gespeichert.
          </p>
          <ul>
            <li>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO
              (Einwilligung)
            </li>
            <li>
              <strong>Speicherdauer:</strong> bis zum Widerruf Ihrer Einwilligung
            </li>
            <li>
              <strong>Widerruf:</strong> jederzeit formlos per E-Mail an{" "}
              <a href={mailto}>{site.operator.email}</a>. Die Rechtmäßigkeit der
              bis zum Widerruf erfolgten Verarbeitung bleibt unberührt.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Lokale Speicherung im Browser",
      body: (
        <p>
          Wir speichern Ihre gewählte Sprache (z. B. „de“, „tr“) im{" "}
          <code>localStorage</code> Ihres Browsers unter dem Schlüssel{" "}
          <code>locale</code>. Diese Speicherung ist unbedingt erforderlich, um
          den von Ihnen ausdrücklich gewünschten Dienst in der gewählten Sprache
          bereitzustellen (§ 25 Abs. 2 Nr. 2 TDDDG); eine Einwilligung ist dafür
          nicht erforderlich. Es werden keine <strong>Cookies</strong> gesetzt.
          Sie können den Eintrag jederzeit über die Einstellungen Ihres Browsers
          löschen.
        </p>
      ),
    },
    {
      heading: "Empfänger und Drittlandtransfer",
      body: (
        <>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Empfänger</th>
                  <th>Zweck</th>
                  <th>Sitz</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vercel Inc.</td>
                  <td>Hosting, Reichweitenmessung</td>
                  <td>USA (Auslieferung EU/Frankfurt)</td>
                </tr>
                <tr>
                  <td>Google Ireland Limited</td>
                  <td>KI-Textverbesserung, E-Mail-Verteiler</td>
                  <td>Irland (EU)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Eine darüber hinausgehende Weitergabe Ihrer Daten an Dritte findet
            nicht statt. Wir verkaufen keine Daten und betreiben keine Werbe-
            oder Profilbildung.
          </p>
        </>
      ),
    },
    {
      heading: "Ihre Rechte",
      body: (
        <>
          <p>Sie haben uns gegenüber jederzeit folgende Rechte:</p>
          <ul>
            <li>
              <strong>Auskunft</strong> über die zu Ihrer Person verarbeiteten
              Daten (Art. 15 DSGVO)
            </li>
            <li>
              <strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)
            </li>
            <li>
              <strong>Löschung</strong> (Art. 17 DSGVO)
            </li>
            <li>
              <strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)
            </li>
            <li>
              <strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)
            </li>
            <li>
              <strong>Widerspruch</strong> gegen Verarbeitungen auf Grundlage von
              Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)
            </li>
            <li>
              <strong>Widerruf</strong> einer erteilten Einwilligung mit Wirkung
              für die Zukunft (Art. 7 Abs. 3 DSGVO)
            </li>
          </ul>
          <p>
            Zur Ausübung genügt eine formlose Nachricht an{" "}
            <a href={mailto}>{site.operator.email}</a>.
          </p>
        </>
      ),
    },
    {
      heading: "Beschwerderecht",
      body: (
        <>
          <p>
            Unbeschadet anderweitiger Rechtsbehelfe haben Sie das Recht, sich bei
            einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Für
            uns zuständig ist:
          </p>
          <address>
            Landesbeauftragte für Datenschutz und Informationsfreiheit
            Nordrhein-Westfalen
            <br />
            Kavalleriestraße 2–4
            <br />
            40213 Düsseldorf
            <br />
            <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener noreferrer">
              www.ldi.nrw.de
            </a>
          </address>
        </>
      ),
    },
    {
      heading: "Erforderlichkeit der Bereitstellung",
      body: (
        <p>
          Die Bereitstellung Ihrer Daten ist weder gesetzlich noch vertraglich
          vorgeschrieben. Ohne Angaben zu Ihrer Person und Ihrem Vermieter kann
          allerdings keine Mängelanzeige erzeugt werden. Eine automatisierte
          Entscheidungsfindung einschließlich Profiling nach Art. 22 DSGVO findet
          nicht statt; die angezeigte Minderungsquote ist eine unverbindliche
          Orientierung und keine Entscheidung mit rechtlicher Wirkung.
        </p>
      ),
    },
    {
      heading: "Änderungen dieser Erklärung",
      body: (
        <p>
          Wir passen diese Datenschutzerklärung an, wenn sich unsere
          Datenverarbeitung oder die rechtlichen Rahmenbedingungen ändern. Es
          gilt jeweils die auf dieser Seite veröffentlichte Fassung.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Datenschutzerklärung"
      intro="Informationen zur Verarbeitung personenbezogener Daten nach Art. 13 DSGVO."
      updated={site.legalVersion}
    >
      <NumberedSections sections={sections} />
    </LegalPage>
  );
}
