import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import LegalPage, { NumberedSections } from "@/components/LegalPage";
import { gesellschafterListe, site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Datenschutzerklärung | Mietminderung-online",
  description: `Datenschutzerklärung von ${site.name}: welche Daten wir verarbeiten, auf welcher Rechtsgrundlage und welche Rechte Sie nach DSGVO haben.`,
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
            Vertreten durch die Gesellschafter: {gesellschafterListe}
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
            beschriebenen optionalen Funktionen aktiv auslösen. Das gilt
            insbesondere für den kostenpflichtigen Postversand: Erst wenn Sie
            ihn auslösen, verlassen der Brieftext und die Anschriften Ihren
            Browser.
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
      heading: "Reichweitenmessung: Vercel Web Analytics",
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
      heading: "Hosting: Vercel",
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
      heading: "KI-Textverbesserung: Google Gemini",
      body: (
        <>
          <p>
            Wenn Sie im Schritt „Mängel beschreiben“ auf „Vorschau anzeigen“
            klicken, werden die von Ihnen eingegebenen{" "}
            <strong>Mangelbeschreibungen</strong> (Bezeichnung des Mangels, Raum,
            Zeitraum, Freitext) an die Gemini-API der{" "}
            <strong>Google Ireland Limited</strong>, Gordon House, Barrow Street,
            Dublin 4, Irland übermittelt. Dort werden sie sprachlich geglättet
            und, falls Sie in einer anderen Sprache geschrieben haben, ins
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
            übermitteln möchten, insbesondere keine Gesundheitsdaten oder Daten
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
      heading: "Postversand der Mängelanzeige (kostenpflichtig)",
      body: (
        <>
          <p>
            Nur wenn Sie den kostenpflichtigen Postversand auslösen, verlässt
            Ihre Mängelanzeige den Browser. Übermittelt werden dann{" "}
            <strong>
              der vollständige Brieftext, Ihr Name und Ihre Anschrift, Name und
              Anschrift Ihres Vermieters, Ihre E-Mail-Adresse für die
              Versandbestätigung sowie Ihre Unterschrift
            </strong>
            , sofern Sie eine gezeichnet haben. Ohne diese Angaben lässt sich
            kein Brief drucken und zustellen.
          </p>
          <p>
            Empfänger ist die <strong>PIN AG</strong>, Alt-Moabit 91, 10559
            Berlin, die für uns als Auftragsverarbeiterin nach Art. 28 DSGVO
            tätig wird. Sie setzt für Druck und Kuvertierung ihrerseits folgende
            Unterauftragnehmer ein: BC Directgroup GmbH (Rigistraße 9, 12277
            Berlin), Möller Druck &amp; Verlag GmbH (Zeppelinstraße 9, 16356
            Ahrensfelde) und ODS – Office Data Service GmbH (Ehrenbergstraße
            16A, 10245 Berlin).
          </p>
          <ul>
            <li>
              <strong>Zweck:</strong> Druck, Kuvertierung, Frankierung und
              postalische Zustellung Ihrer Mängelanzeige
            </li>
            <li>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
              (Erfüllung des von Ihnen geschlossenen Versandvertrags)
            </li>
            <li>
              <strong>Ort der Verarbeitung:</strong> ausschließlich innerhalb
              der EU bzw. des EWR
            </li>
            <li>
              <strong>Speicherdauer:</strong> Haben Sie den Versand begonnen,
              aber nicht bezahlt, wird der Auftrag nach spätestens 24 Stunden
              automatisch gelöscht. Versendete Aufträge werden von der PIN AG
              spätestens 28 Tage nach Beendigung der Leistungserbringung
              gelöscht; davon unberührt bleiben gesetzliche
              Aufbewahrungspflichten für Rechnungsbelege.
            </li>
          </ul>
          <p>
            Eine <strong>Pseudonymisierung findet nicht statt</strong>: Namen
            und Anschriften müssen im Klartext vorliegen, weil ein Brief sonst
            nicht zugestellt werden kann. Wir selbst speichern weder den
            Brieftext noch die Anschriften; wir führen keine Datenbank über
            Ihren Vorgang.
          </p>
        </>
      ),
    },
    {
      heading: "Zahlungsabwicklung: Stripe",
      body: (
        <>
          <p>
            Die Bezahlung des Postversands wickelt die{" "}
            <strong>Stripe Payments Europe, Limited</strong>, 1 Grand Canal
            Street Lower, Grand Canal Dock, Dublin, Irland ab. Sie werden dafür
            auf eine von Stripe betriebene Bezahlseite weitergeleitet.
          </p>
          <ul>
            <li>
              <strong>Was dort anfällt:</strong> Ihre Zahlungsdaten geben Sie
              unmittelbar bei Stripe ein. Wir erhalten sie nicht und speichern
              sie nicht — uns erreicht nur die Information, ob eine Zahlung
              erfolgreich war, sowie der Betrag und eine Vorgangsnummer.
            </li>
            <li>
              <strong>Zweck:</strong> Abwicklung Ihrer Zahlung und Zuordnung zum
              richtigen Briefauftrag
            </li>
            <li>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
            </li>
            <li>
              <strong>Speicherdauer:</strong> Der Zahlungsvorgang bleibt bei
              Stripe im Rahmen der handels- und steuerrechtlichen
              Aufbewahrungsfristen gespeichert.
            </li>
          </ul>
          <p>
            Stripe kann Daten an die Muttergesellschaft in den USA übermitteln.
            Einzelheiten:{" "}
            <a
              href="https://stripe.com/de/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              stripe.com/de/privacy
            </a>
            .
          </p>
        </>
      ),
    },
    {
      heading: "E-Mails zu Ihrem Versandauftrag: Resend",
      body: (
        <>
          <p>
            Wenn Sie den Postversand bezahlt haben, schreiben wir Ihnen
            höchstens dreimal — über{" "}
            <strong>Resend (Plus Five Five, Inc.)</strong>, dessen Zustellung
            über die europäische Infrastruktur (Region Irland) läuft:
          </p>
          <ul>
            <li>
              die <strong>Bestellbestätigung</strong> unmittelbar nach der
              Zahlung, zu der wir gesetzlich verpflichtet sind (§ 312f BGB);
            </li>
            <li>
              beim Einwurf-Einschreiben die <strong>Zustellmeldung</strong>,
              sobald die Post die Zustellung meldet — mit Sendungsnummer und
              Verfolgungslink. Beim einfachen Brief entfällt sie, weil er keine
              Sendungsverfolgung hat;
            </li>
            <li>
              vierzehn Tage nach der Bestellung eine{" "}
              <strong>Erinnerung</strong> mit Hinweisen zum weiteren Vorgehen.
              Danach folgt nichts mehr; ein Newsletter- oder Werbeversand findet
              nicht statt.
            </li>
          </ul>
          <ul>
            <li>
              <strong>Übermittelt werden:</strong> die E-Mail-Adresse, die Sie
              bei der Bezahlung angegeben haben, sowie der Inhalt der jeweiligen
              E-Mail — gewählte Versandart, gezahlter Betrag, Vorgangsnummer,
              die Widerrufsbelehrung und bei der Zustellmeldung die
              Sendungsnummer nebst Zeitpunkt. Der Text Ihrer Mängelanzeige, die
              gemeldeten Mängel und die Anschrift Ihres Vermieters sind{" "}
              <strong>nicht</strong> Teil dieser E-Mails.
            </li>
            <li>
              <strong>Zweck:</strong> Erfüllung der gesetzlichen
              Bestätigungspflicht bei Fernabsatzverträgen, Nachweis über den
              Sendungsweg und Information über den weiteren Verlauf
            </li>
            <li>
              <strong>Rechtsgrundlage:</strong> für die Bestätigung Art. 6
              Abs. 1 lit. c DSGVO (rechtliche Verpflichtung) sowie Art. 6 Abs. 1
              lit. b DSGVO (Vertragserfüllung), für die Zustellmeldung lit. b —
              die Sendungsverfolgung ist Teil der bezahlten Leistung —, für die
              Erinnerung Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
              Der Erinnerung können Sie jederzeit formlos widersprechen
              (Art. 21 DSGVO), eine Antwort auf eine unserer E-Mails genügt.
            </li>
            <li>
              <strong>Speicherdauer:</strong> Resend protokolliert den Versand
              für einen begrenzten Zeitraum, um Zustellprobleme nachvollziehen
              zu können. Ein Werbe- oder Newsletterversand findet nicht statt.
            </li>
          </ul>
          <p>
            Resend ist ein US-Unternehmen; soweit im Einzelfall Daten in die USA
            übermittelt werden, stützt sich die Übermittlung auf
            Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO. Wir
            verwenden weder Öffnungs- noch Klickverfolgung. Einzelheiten:{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              resend.com/legal/privacy-policy
            </a>
            .
          </p>
        </>
      ),
    },
    {
      heading: "Widerruf über die Schaltfläche (§ 356a BGB)",
      body: (
        <>
          <p>
            Auf unserer <Link href="/widerruf">Widerrufsseite</Link> stellen wir eine
            Schaltfläche „Vertrag widerrufen“ bereit, über die Sie den
            kostenpflichtigen Postversand online widerrufen können. Dazu sind
            wir seit dem 19. Juni 2026 gesetzlich verpflichtet.
          </p>
          <ul>
            <li>
              <strong>Verarbeitet werden:</strong> Ihre E-Mail-Adresse
              (Pflichtangabe, weil wir Ihnen den Eingang bestätigen müssen),
              auf freiwilliger Basis Ihr Name, die Auftragsnummer und eine
              Anmerkung, sowie der Zeitpunkt des Eingangs nach Datum und
              Uhrzeit.
            </li>
            <li>
              <strong>Zweck:</strong> Entgegennahme Ihrer Widerrufserklärung,
              die gesetzlich vorgeschriebene Bestätigung des Eingangs auf einem
              dauerhaften Datenträger und die Abwicklung des Widerrufs.
            </li>
            <li>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. c DSGVO —
              die Verarbeitung erfüllt eine rechtliche Verpflichtung aus
              § 356a BGB. Soweit es um die Rückabwicklung des Vertrags geht,
              zusätzlich Art. 6 Abs. 1 lit. b DSGVO.
            </li>
            <li>
              <strong>Empfänger:</strong> Resend als Auftragsverarbeiter für
              den Versand beider E-Mails — der Meldung an uns und der
              Bestätigung an Sie, siehe den vorstehenden Abschnitt. Die Meldung
              geht in unserem eigenen Postfach ein, das über{" "}
              <strong>Google Workspace (Google Ireland Limited)</strong> läuft;
              Google verarbeitet die Nachricht deshalb als Auftragsverarbeiter
              mit. Eine Weitergabe an den Druckdienstleister oder an die Post
              findet nicht statt.
            </li>
            <li>
              <strong>Speicherdauer:</strong> Ihre Erklärung erreicht uns als
              E-Mail und bleibt im E-Mail-Postfach des Verantwortlichen,
              solange wir sie zum Nachweis der ordnungsgemäßen Abwicklung
              benötigen — praktisch für die Dauer der handels- und
              steuerrechtlichen Aufbewahrungsfristen. Eine gesonderte
              Datenbank führen wir dafür nicht; in der Anwendung selbst wird
              die Erklärung nicht gespeichert.
            </li>
          </ul>
          <p>
            Sie können Ihren Widerruf stattdessen jederzeit formlos per E-Mail
            an <a href={mailto}>{site.operator.email}</a> erklären. Dann
            verarbeiten wir nur, was Sie uns dabei selbst mitteilen.
          </p>
        </>
      ),
    },
    {
      heading: "Lokale Speicherung im Browser",
      body: (
        <>
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
          <p>
            Während Sie die Prüfung und die Mängelanzeige ausfüllen, halten wir
            Ihren Zwischenstand im <code>sessionStorage</code> Ihres Browsers
            unter dem Schlüssel <code>mangelflow</code> fest. Darin stehen Ihre
            Antworten auf die Anspruchsfragen, die gewählten Mängel, Ihre Miete,
            Ihre Beschreibungen, die Anschriften von Ihnen und Ihrem Vermieter,
            die gewählte Frist sowie eine von Ihnen gezeichnete Unterschrift.
            Diese Daten <strong>verlassen Ihr Gerät nicht</strong> und werden
            nicht an uns übertragen. Sie dienen ausschließlich dazu, dass Ihr
            Entwurf einen versehentlichen Neuladen der Seite oder den Wechsel zur
            Bezahlseite übersteht, und sind damit für den von Ihnen gewünschten
            Dienst unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Der{" "}
            <code>sessionStorage</code> wird von Ihrem Browser{" "}
            <strong>automatisch geleert, sobald Sie den Tab schließen</strong>;
            ein neuer Tab beginnt stets ohne Ihre Daten. Sie können den Eintrag
            außerdem jederzeit über die Einstellungen Ihres Browsers löschen.
          </p>
        </>
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
                  <td>KI-Textverbesserung</td>
                  <td>Irland (EU)</td>
                </tr>
                <tr>
                  <td>PIN AG</td>
                  <td>Druck und Zustellung beim Postversand</td>
                  <td>Deutschland (EU)</td>
                </tr>
                <tr>
                  <td>
                    BC Directgroup GmbH, Möller Druck &amp; Verlag GmbH, ODS –
                    Office Data Service GmbH
                  </td>
                  <td>Druckdienstleister der PIN AG (Unterauftragnehmer)</td>
                  <td>Deutschland (EU)</td>
                </tr>
                <tr>
                  <td>Stripe Payments Europe, Limited</td>
                  <td>Zahlungsabwicklung beim Postversand</td>
                  <td>Irland (EU)</td>
                </tr>
                <tr>
                  <td>Resend (Plus Five Five, Inc.)</td>
                  <td>
                    Versand der E-Mails zu Ihrem Versandauftrag und Ihrer
                    Widerrufserklärung
                  </td>
                  <td>USA (Versand über Irland)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Eine darüber hinausgehende Weitergabe Ihrer Daten an Dritte findet
            nicht statt — mit einer Ausnahme: Widerrufen Sie über die
            Schaltfläche oder formlos per E-Mail, landet Ihre Erklärung in
            unserem eigenen Postfach, das über Google Workspace (Google Ireland
            Limited) läuft. Google verarbeitet die Nachricht dabei als
            Auftragsverarbeiter mit. Wir verkaufen keine Daten und betreiben
            keine Werbe- oder Profilbildung.
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
