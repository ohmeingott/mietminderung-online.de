import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { site, postVersandEnabled } from "@/lib/site";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung — Mietminderung Online",
  description:
    "Widerrufsrecht und Muster-Widerrufsformular für kostenpflichtige Leistungen von mietminderung.online.",
  alternates: { canonical: "/widerruf" },
  robots: { index: true, follow: true },
};

export default function Widerruf() {
  return (
    <LegalPage
      title="Widerrufsbelehrung"
      intro="Ihr gesetzliches Widerrufsrecht als Verbraucher."
      updated={site.legalVersion}
    >
      {!postVersandEnabled && (
        <LegalSection heading="Derzeit keine kostenpflichtigen Leistungen">
          <p>
            Alle Funktionen von {site.name} sind aktuell kostenlos. Da kein
            entgeltlicher Vertrag zustande kommt, besteht derzeit kein
            gesetzliches Widerrufsrecht — es gibt nichts zu widerrufen.
          </p>
          <p>
            Sobald wir eine kostenpflichtige Leistung anbieten, gilt die
            nachfolgende Belehrung. Sie ist hier bereits einsehbar, damit Sie
            die Bedingungen vorab kennen.
          </p>
        </LegalSection>
      )}

      <LegalSection heading="Widerrufsrecht">
        <p>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
          diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage
          ab dem Tag des Vertragsabschlusses.
        </p>
        <p>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
        </p>
        <address>
          {site.operator.name}
          <br />
          {site.operator.street}
          <br />
          {site.operator.zip} {site.operator.city}
          <br />
          E-Mail:{" "}
          <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>
        </address>
        <p>
          mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter
          Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu
          widerrufen, informieren. Sie können dafür das beigefügte
          Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben
          ist.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung
          über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist
          absenden.
        </p>
      </LegalSection>

      <LegalSection heading="Folgen des Widerrufs">
        <p>
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen,
          die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit
          Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie
          eine andere Art der Lieferung als die von uns angebotene, günstigste
          Standardlieferung gewählt haben), unverzüglich und spätestens binnen
          vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
          Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
        </p>
        <p>
          Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie
          bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit
          Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall
          werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
        </p>
        <p>
          Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist
          beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen,
          der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der
          Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags
          unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum
          Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.
        </p>
      </LegalSection>

      <LegalSection heading="Vorzeitiges Erlöschen des Widerrufsrechts">
        <p>
          Ihr Widerrufsrecht erlischt bei einem Vertrag über die Erbringung von
          Dienstleistungen vorzeitig, wenn wir die Dienstleistung vollständig
          erbracht haben und Sie
        </p>
        <ul>
          <li>
            vor Beginn der Ausführung ausdrücklich zugestimmt haben, dass wir mit
            der Ausführung vor Ablauf der Widerrufsfrist beginnen, und
          </li>
          <li>
            Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung
            mit Beginn der Ausführung des Vertrags Ihr Widerrufsrecht verlieren
            (§ 356 Abs. 4 BGB).
          </li>
        </ul>
        <p>
          Beim Postversand bedeutet das: Sobald der Brief gedruckt und der
          Deutschen Post übergeben wurde, ist die Leistung vollständig erbracht
          und ein Widerruf nicht mehr möglich. Wir holen diese Zustimmung und
          Bestätigung deshalb ausdrücklich im Bestellvorgang ein.
        </p>
      </LegalSection>

      <LegalSection heading="Muster-Widerrufsformular">
        <p>
          (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses
          Formular aus und senden Sie es zurück.)
        </p>
        <div className="rounded-[var(--radius-field)] border border-ink-200 bg-paper-sunken p-5 text-sm leading-relaxed">
          <p>
            An {site.operator.name}, {site.operator.street}, {site.operator.zip}{" "}
            {site.operator.city}, E-Mail:{" "}
            <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>
          </p>
          <p className="mt-3">
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen
            Vertrag über den Kauf der folgenden Waren (*) / die Erbringung der
            folgenden Dienstleistung (*)
          </p>
          <p className="mt-3">— Bestellt am (*) / erhalten am (*)</p>
          <p className="mt-3">— Name des/der Verbraucher(s)</p>
          <p className="mt-3">— Anschrift des/der Verbraucher(s)</p>
          <p className="mt-3">
            — Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)
          </p>
          <p className="mt-3">— Datum</p>
          <p className="mt-4 text-ink-500">(*) Unzutreffendes streichen.</p>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
