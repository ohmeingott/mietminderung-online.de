import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Widerrufsrecht | Mietminderung Online",
  description: `Widerrufsbelehrung und Muster-Widerrufsformular für den kostenpflichtigen Postversand der Mängelanzeige über ${site.name}.`,
  path: "/widerruf",
});

/** Postal address of the operator, on one line, for the withdrawal form. */
const anschrift = `${site.operator.name}, ${site.operator.street}, ${site.operator.zip} ${site.operator.city}`;

export default function Widerruf() {
  return (
    <LegalPage
      title="Widerrufsrecht"
      intro="Widerrufsbelehrung für den kostenpflichtigen Postversand."
      updated={site.legalVersion}
    >
      <LegalSection heading="Wofür diese Belehrung gilt">
        <p>
          Die Prüfung, die Berechnung der Minderungsquote und die Erstellung der
          Mängelanzeige sind kostenlos. Für diese Funktionen kommt kein
          entgeltlicher Vertrag zustande, und es besteht daher auch kein
          gesetzliches Widerrufsrecht — es gibt nichts zu widerrufen.
        </p>
        <p>
          Diese Belehrung gilt für die eine kostenpflichtige Leistung, die wir
          anbieten: den <strong>Postversand Ihrer Mängelanzeige</strong>. Dabei
          lassen wir das von Ihnen erstellte Schreiben drucken, kuvertieren,
          frankieren und an Ihren Vermieter zustellen.
        </p>
      </LegalSection>

      <LegalSection heading="Widerrufsbelehrung">
        <p>
          <strong>Widerrufsrecht.</strong> Sie haben das Recht, binnen vierzehn
          Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die
          Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
        </p>
        <p>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns —{" "}
          {site.operator.name}, {site.operator.street}, {site.operator.zip}{" "}
          {site.operator.city},{" "}
          <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a> —
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
        <p>
          <strong>Folgen des Widerrufs.</strong> Wenn Sie diesen Vertrag
          widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten
          haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
          zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses
          Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir
          dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion
          eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas
          anderes vereinbart; in keinem Fall werden Ihnen wegen dieser
          Rückzahlung Entgelte berechnet.
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
          Damit Ihr Brief noch am selben Werktag in den Druck geht, müssen wir
          mit der Ausführung vor Ablauf der Widerrufsfrist beginnen. Deshalb
          bitten wir Sie vor der Bestellung um Ihre ausdrückliche Zustimmung
          dazu und um die Bestätigung, dass Sie Ihr Widerrufsrecht mit der
          vollständigen Erbringung verlieren.
        </p>
        <p>
          Ihr Widerrufsrecht <strong>erlischt</strong> nach § 356 Abs. 4 BGB,
          sobald wir die Dienstleistung vollständig erbracht haben — also sobald
          Ihr Brief gedruckt, kuvertiert, frankiert und in die Zustellung
          gegeben wurde. Bis zu diesem Zeitpunkt können Sie widerrufen; danach
          nicht mehr. In der Praxis erfolgt der Druck bei einem Zahlungseingang
          bis 14:30 Uhr an Werktagen noch am selben Tag, andernfalls am
          folgenden Werktag.
        </p>
        <p>
          Wenn Sie diese Zustimmung nicht erteilen möchten, können Sie die
          Mängelanzeige jederzeit kostenlos herunterladen und selbst versenden.
        </p>
      </LegalSection>

      <LegalSection heading="Muster-Widerrufsformular">
        <p>
          Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses
          Formular aus und senden Sie es zurück. Sie können es auch formlos per
          E-Mail tun.
        </p>
        <div className="rounded-[var(--radius-field)] border border-ink-200 bg-paper-sunken p-4 text-sm leading-relaxed">
          <p>An {anschrift}</p>
          <p>E-Mail: {site.operator.email}</p>
          <p className="mt-3">
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen
            Vertrag über die Erbringung der folgenden Dienstleistung:
            Postversand einer Mängelanzeige
          </p>
          <p className="mt-3">Bestellt am (*)/erhalten am (*): ______________</p>
          <p>Name des/der Verbraucher(s): ______________</p>
          <p>Anschrift des/der Verbraucher(s): ______________</p>
          <p className="mt-3">
            Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
            ______________
          </p>
          <p>Datum: ______________</p>
          <p className="mt-3">(*) Unzutreffendes streichen.</p>
        </div>
      </LegalSection>

      <LegalSection heading="Fragen">
        <p>
          Fragen zum Widerruf beantworten wir gern unter{" "}
          <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
