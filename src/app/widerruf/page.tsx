import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { site } from "@/lib/site";
import {
  erloeschenHinweis,
  musterWiderrufsformular,
  widerrufsbelehrung,
} from "@/lib/widerrufstext";

export const metadata: Metadata = buildMetadata({
  title: "Widerrufsrecht | Mietminderung Online",
  description: `Widerrufsbelehrung und Muster-Widerrufsformular für den kostenpflichtigen Postversand der Mängelanzeige über ${site.name}.`,
  path: "/widerruf",
});

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

      {/*
        Rendered from src/lib/widerrufstext.ts, which the order confirmation
        email reads as well. The notice has to be identical in both places —
        two hand-maintained copies drift, and nobody notices until a customer
        withdraws and the versions disagree about the deadline.
      */}
      <LegalSection heading="Widerrufsbelehrung">
        {widerrufsbelehrung.map((absatz) => (
          <p key={absatz.slice(0, 40)}>{absatz}</p>
        ))}
      </LegalSection>

      <LegalSection heading="Vorzeitiges Erlöschen des Widerrufsrechts">
        <p>
          Damit Ihr Brief noch am selben Werktag in den Druck geht, müssen wir
          mit der Ausführung vor Ablauf der Widerrufsfrist beginnen. Deshalb
          bitten wir Sie vor der Bestellung um Ihre ausdrückliche Zustimmung
          dazu und um die Bestätigung, dass Sie Ihr Widerrufsrecht mit der
          vollständigen Erbringung verlieren.
        </p>
        <p>{erloeschenHinweis}</p>
        <p>
          Vollständig erbracht ist die Leistung, sobald Ihr Brief gedruckt,
          kuvertiert, frankiert und in die Zustellung gegeben wurde. In der
          Praxis erfolgt der Druck bei einem Zahlungseingang montags bis
          freitags bis 14:30 Uhr noch am selben Tag, andernfalls am folgenden
          Werktag.
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
          {musterWiderrufsformular.map((zeile) => (
            <p key={zeile.slice(0, 40)}>{zeile}</p>
          ))}
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
