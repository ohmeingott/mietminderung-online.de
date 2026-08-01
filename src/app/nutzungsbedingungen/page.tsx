import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import LegalPage, { NumberedSections } from "@/components/LegalPage";
import { site } from "@/lib/site";
import { PRODUKTE } from "@/lib/ebrief/produkte";

export const metadata: Metadata = buildMetadata({
  title: "Nutzungsbedingungen & AGB | Mietminderung Online",
  description: `Nutzungsbedingungen und AGB von ${site.name}: kostenloser Mietminderungs-Check, Mängelanzeige-Generator, kostenpflichtiger Postversand, Haftung und Gerichtsstand.`,
  path: "/nutzungsbedingungen",
});

/**
 * The prices in the terms come from the same catalogue the checkout charges
 * from. A hand-typed figure here would be a price the customer was shown and
 * not the one taken — and the terms are exactly the document that would be
 * held against us in that dispute.
 */
const preis = (cent: number) =>
  (cent / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export default function Nutzungsbedingungen() {
  const sections = [
    {
      heading: "Geltungsbereich und Anbieter",
      body: (
        <>
          <p>
            Diese Nutzungsbedingungen gelten für die Nutzung der Webseite{" "}
            {site.name} (nachfolgend „Webseite“), betrieben von{" "}
            {site.operator.name}, {site.operator.street}, {site.operator.zip}{" "}
            {site.operator.city} (nachfolgend „wir“). Sie gelten in der bei
            Nutzung gültigen Fassung.
          </p>
          <p>
            Abweichende Bedingungen des Nutzers werden nicht Vertragsbestandteil,
            es sei denn, wir stimmen ihrer Geltung ausdrücklich in Textform zu.
          </p>
        </>
      ),
    },
    {
      heading: "Leistungsbeschreibung",
      body: (
        <>
          <p>Die Webseite stellt Ihnen folgende Funktionen zur Verfügung:</p>
          <ul>
            <li>
              eine schrittweise <strong>Prüfung</strong>, ob die Voraussetzungen
              einer Mietminderung vorliegen könnten,
            </li>
            <li>
              eine <strong>Berechnung</strong> einer möglichen Minderungsquote
              anhand veröffentlichter Gerichtsurteile,
            </li>
            <li>
              die <strong>Erstellung</strong> einer Mängelanzeige, die Sie als
              PDF oder Textdatei herunterladen, kopieren und selbst versenden
              können,
            </li>
            <li>
              eine optionale, automatisierte{" "}
              <strong>sprachliche Überarbeitung</strong> Ihrer Mangelbeschreibung
              durch ein KI-Sprachmodell, einschließlich Übersetzung ins Deutsche.
            </li>
          </ul>
          <p>
            <strong>
              Diese Funktionen sind und bleiben kostenlos und erfordern keine
              Registrierung.
            </strong>{" "}
            Sie können die Mängelanzeige jederzeit herunterladen und selbst an
            Ihren Vermieter versenden.
          </p>
          <p>
            Darüber hinaus bieten wir als einzige kostenpflichtige Leistung den{" "}
            <strong>Postversand der Mängelanzeige</strong> an. Die Einzelheiten
            regelt der folgende Abschnitt.
          </p>
        </>
      ),
    },
    {
      heading: "Kostenpflichtiger Postversand",
      body: (
        <>
          <p>
            Auf Ihren Wunsch lassen wir die von Ihnen erstellte Mängelanzeige
            drucken, kuvertieren, frankieren und an die von Ihnen angegebene
            Anschrift Ihres Vermieters zustellen. Mit dem Druck und der
            Zustellung beauftragen wir die PIN AG, Alt-Moabit 91, 10559 Berlin.
          </p>
          <p>
            <strong>Vertragsschluss.</strong> Sie wählen die Versandart, geben
            die Erklärung zum vorzeitigen Leistungsbeginn ab und gelangen über
            die Schaltfläche zur Bezahlung auf die Seite unseres
            Zahlungsdienstleisters. Der Vertrag kommt zustande, sobald Ihre
            Zahlung dort erfolgreich abgeschlossen ist. Vorher wird nichts
            gedruckt und nichts berechnet.
          </p>
          <p>
            <strong>Preise.</strong> Der Versand als Brief kostet{" "}
            {preis(PRODUKTE.brief.preisCent)}, der Versand als
            Einwurf-Einschreiben{" "}
            {preis(PRODUKTE.einwurfEinschreiben.preisCent)}, jeweils je Sendung
            einschließlich Druck, Kuvertierung, Porto und Zustellung innerhalb
            Deutschlands. Es handelt sich um Endpreise; gemäß § 19 UStG wird
            keine Umsatzsteuer berechnet und daher auch nicht ausgewiesen.
          </p>
          <p>
            <strong>Ausführung.</strong> Unmittelbar nach Ihrer Zahlung geben
            wir die Sendung zum Druck. Gedruckt, kuvertiert und frankiert wird
            sie dort; die Zustellung erfolgt anschließend durch das beauftragte
            Postunternehmen. Auf den Zeitpunkt des Drucks und auf die
            Zustelldauer haben wir keinen Einfluss; ein bestimmter Druck- oder
            Zustelltag wird nicht geschuldet.
          </p>
          <p>
            <strong>Einwurf-Einschreiben.</strong> Beim Einwurf-Einschreiben
            wird der Einwurf in den Briefkasten dokumentiert. Es handelt sich
            nicht um ein Übergabe-Einschreiben mit Unterschrift des Empfängers.
          </p>
          <p>
            <strong>Ihre Angaben.</strong> Wir versenden den Text und die
            Anschrift so, wie Sie sie eingegeben und in der Vorschau bestätigt
            haben. Eine inhaltliche Prüfung findet nicht statt. Für eine falsche
            oder unvollständige Empfängeranschrift können wir nicht einstehen;
            ein deshalb nicht zustellbarer Brief begründet keinen
            Erstattungsanspruch.
          </p>
          <p>
            <strong>Widerrufsrecht.</strong> Als Verbraucher steht Ihnen ein
            gesetzliches Widerrufsrecht zu. Die Einzelheiten und die Bedingungen
            seines vorzeitigen Erlöschens finden Sie in unserer{" "}
            <Link href="/widerruf">Widerrufsbelehrung</Link>.
          </p>
        </>
      ),
    },
    {
      heading: "Keine Rechtsberatung",
      body: (
        <>
          <p>
            Die auf dieser Webseite bereitgestellten Informationen, Berechnungen
            und erzeugten Dokumente dienen ausschließlich der allgemeinen
            Information und stellen <strong>keine Rechtsberatung</strong> dar. Es
            werden keine Rechtsdienstleistungen im Sinne des § 2 RDG erbracht;
            die Erstellung der Mängelanzeige erfolgt vollautomatisiert anhand
            Ihrer eigenen Eingaben, ohne rechtliche Prüfung Ihres Einzelfalls.
          </p>
          <p>
            Die angezeigten Minderungsquoten beruhen auf veröffentlichten
            Gerichtsurteilen und sind reine Orientierungswerte. Jeder Einzelfall
            wird von Gerichten individuell beurteilt; Abweichungen nach oben und
            unten sind möglich und häufig.
          </p>
          <p>
            Wir empfehlen ausdrücklich, vor einer Minderung der Miete einen
            Mieterverein oder eine Rechtsanwältin bzw. einen Rechtsanwalt zu
            konsultieren. Die Nutzung der Webseite begründet kein Mandats- oder
            Beratungsverhältnis.
          </p>
        </>
      ),
    },
    {
      heading: "Ihre Verantwortung",
      body: (
        <>
          <p>
            Sie sind für die Richtigkeit und Vollständigkeit Ihrer Angaben
            verantwortlich. Prüfen Sie die erzeugte Mängelanzeige vor dem Versand
            sorgfältig. Sie können den Text vor dem Herunterladen vollständig
            bearbeiten. Sie tragen die Entscheidung, ob, in welcher Höhe und ab
            wann Sie die Miete mindern.
          </p>
          <p>
            Bitte geben Sie keine Daten Dritter ein, zu deren Verwendung Sie
            nicht berechtigt sind, und nutzen Sie den Dienst nicht für
            rechtswidrige Zwecke oder in einer Weise, die den Betrieb
            beeinträchtigt (automatisierte Massenabfragen, Umgehung von
            Schutzmaßnahmen).
          </p>
        </>
      ),
    },
    {
      heading: "Haftung",
      body: (
        <>
          <p>
            Wir haften unbeschränkt für Schäden aus der Verletzung des Lebens,
            des Körpers oder der Gesundheit sowie für Schäden, die auf Vorsatz
            oder grober Fahrlässigkeit beruhen, ferner nach dem
            Produkthaftungsgesetz und im Umfang einer von uns übernommenen
            Garantie.
          </p>
          <p>
            Bei der leicht fahrlässigen Verletzung wesentlicher Vertragspflichten
            (also solcher Pflichten, deren Erfüllung die ordnungsgemäße
            Durchführung des Vertrags überhaupt erst ermöglicht und auf deren
            Einhaltung Sie regelmäßig vertrauen dürfen) ist unsere Haftung auf
            den bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden
            begrenzt. Im Übrigen ist die Haftung für leichte Fahrlässigkeit
            ausgeschlossen.
          </p>
          <p>
            Für die kostenlosen Funktionen der Webseite haften wir nach den
            gesetzlichen Vorschriften über die Schenkung nur für Vorsatz und
            grobe Fahrlässigkeit. Insbesondere übernehmen wir keine Gewähr dafür,
            dass eine Minderung in der berechneten Höhe rechtlich durchsetzbar
            ist.
          </p>
        </>
      ),
    },
    {
      heading: "Verfügbarkeit",
      body: (
        <p>
          Wir bemühen uns um eine möglichst unterbrechungsfreie Verfügbarkeit,
          schulden diese für die kostenlosen Funktionen jedoch nicht.
          Wartungsarbeiten, technische Störungen oder höhere Gewalt können zu
          vorübergehenden Ausfällen führen.
        </p>
      ),
    },
    {
      heading: "Urheberrecht",
      body: (
        <p>
          Die Inhalte dieser Webseite unterliegen dem deutschen Urheberrecht.
          Vervielfältigung, Bearbeitung oder Verbreitung außerhalb der Grenzen
          des Urheberrechts bedürfen unserer schriftlichen Zustimmung. Die von
          Ihnen erzeugte Mängelanzeige dürfen Sie uneingeschränkt für eigene
          Zwecke verwenden, verändern und weitergeben.
        </p>
      ),
    },
    {
      heading: "Datenschutz",
      body: (
        <p>
          Wie wir mit Ihren Daten umgehen, beschreibt unsere{" "}
          <Link href="/datenschutz">Datenschutzerklärung</Link>. Kurz gefasst: Ihre
          Eingaben zur Mängelanzeige werden im Browser verarbeitet und erreichen
          unseren Server nur, wenn Sie eine optionale Funktion aktiv auslösen.
        </p>
      ),
    },
    {
      heading: "Änderungen",
      body: (
        <p>
          Wir können diese Nutzungsbedingungen mit Wirkung für die Zukunft
          ändern, etwa bei einer Änderung des Leistungsumfangs oder der
          Rechtslage. Für bereits geschlossene Verträge gilt die bei
          Vertragsschluss vereinbarte Fassung.
        </p>
      ),
    },
    {
      heading: "Schlussbestimmungen",
      body: (
        <>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
            UN-Kaufrechts. Sind Sie Verbraucher mit gewöhnlichem Aufenthalt in
            einem anderen EU-Staat, bleiben die zwingenden
            Verbraucherschutzvorschriften dieses Staates unberührt.
          </p>
          <p>
            Gerichtsstand ist {site.venue}, sofern Sie Kaufmann, juristische
            Person des öffentlichen Rechts oder öffentlich-rechtliches
            Sondervermögen sind. Für Verbraucher gelten die gesetzlichen
            Gerichtsstände.
          </p>
          <p>
            Wir sind nicht bereit und nicht verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen (§ 36 Abs. 1 Nr. 1 VSBG).
          </p>
          <p>
            Sollte eine Bestimmung unwirksam sein, bleibt die Wirksamkeit der
            übrigen Bestimmungen unberührt.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalPage
      title="Nutzungsbedingungen und AGB"
      intro={`Bedingungen für die Nutzung von ${site.name}.`}
      updated={site.legalVersion}
    >
      <NumberedSections sections={sections} />
    </LegalPage>
  );
}
