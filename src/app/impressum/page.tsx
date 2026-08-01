import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { gesellschafterListe, site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Impressum | Mietminderung-online",
  description: `Impressum und Anbieterkennzeichnung von ${site.name} gemäß § 5 DDG: Betreiber, Anschrift, Kontakt und Haftungshinweise.`,
  path: "/impressum",
});

export default function Impressum() {
  return (
    <LegalPage
      title="Impressum"
      intro="Anbieterkennzeichnung nach § 5 DDG und § 18 Abs. 2 MStV."
      updated={site.legalVersion}
    >
      <LegalSection heading="Diensteanbieter">
        <address>
          {site.operator.name}
          <br />
          Vertretungsberechtigte Gesellschafter: {gesellschafterListe}
          <br />
          {site.operator.street}
          <br />
          {site.operator.zip} {site.operator.city}
          <br />
          {site.operator.country}
        </address>
      </LegalSection>

      <LegalSection heading="Kontakt">
        <p>
          E-Mail:{" "}
          <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>
        </p>
        <p>
          Anfragen beantworten wir in der Regel innerhalb von zwei Werktagen.
          Eine Telefonnummer halten wir nicht vor; die Kontaktaufnahme per
          E-Mail ermöglicht eine unmittelbare und effiziente Kommunikation im
          Sinne des § 5 Abs. 1 Nr. 2 DDG.
        </p>
      </LegalSection>

      {/* Natural persons, not the company: the provision asks who is answerable
          for the content, and a GbR cannot be. All three partners, because all
          three represent the company and none of them stands in for the
          others. */}
      <LegalSection heading="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <address>
          {site.operator.partners.map((partner) => (
            <span key={partner}>
              {partner}
              <br />
            </span>
          ))}
          {site.operator.street}
          <br />
          {site.operator.zip} {site.operator.city}
        </address>
      </LegalSection>

      <LegalSection heading="Verbraucherstreitbeilegung">
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen (§ 36 Abs. 1 Nr. 1 VSBG).
        </p>
        <p>
          Die frühere Online-Streitbeilegungsplattform (OS-Plattform) der
          Europäischen Kommission wurde zum 20. Juli 2025 eingestellt; ein Link
          dorthin ist daher nicht mehr vorgesehen.
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Inhalte">
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine
          rechtswidrige Tätigkeit hinweisen.
        </p>
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
          Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
          von entsprechenden Rechtsverletzungen werden wir diese Inhalte
          umgehend entfernen.
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Links">
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
          Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
          Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
        </p>
        <p>
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne
          konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
          Bekanntwerden von Rechtsverletzungen werden wir derartige Links
          umgehend entfernen.
        </p>
      </LegalSection>

      <LegalSection heading="Urheberrecht">
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
          jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
          sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </p>
        <p>
          Die mit diesem Dienst erzeugte Mängelanzeige dürfen Sie uneingeschränkt
          für eigene Zwecke verwenden, weitergeben und verändern.
        </p>
      </LegalSection>

      <LegalSection heading="Keine Rechtsberatung">
        <p>
          Die auf dieser Webseite bereitgestellten Informationen dienen
          ausschließlich der allgemeinen Information und stellen{" "}
          <strong>keine Rechtsberatung</strong> im Sinne des
          Rechtsdienstleistungsgesetzes (RDG) dar. Es werden keine
          Rechtsdienstleistungen im Einzelfall erbracht; die Erstellung der
          Mängelanzeige erfolgt vollautomatisiert anhand Ihrer eigenen Angaben.
        </p>
        <p>
          Die Minderungsquoten beruhen auf veröffentlichten Gerichtsurteilen und
          sind reine Orientierungswerte. Bei konkreten rechtlichen Fragen
          empfehlen wir die Beratung durch einen Mieterverein oder eine
          Rechtsanwältin bzw. einen Rechtsanwalt.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
