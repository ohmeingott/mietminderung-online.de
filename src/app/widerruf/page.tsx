import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Widerrufsrecht | Mietminderung Online",
  description: `Alle Funktionen von ${site.name} sind kostenlos. Mangels entgeltlichem Vertrag besteht derzeit kein gesetzliches Widerrufsrecht.`,
  path: "/widerruf",
});

export default function Widerruf() {
  return (
    <LegalPage
      title="Widerrufsrecht"
      intro="Warum es hier derzeit nichts zu widerrufen gibt."
      updated={site.legalVersion}
    >
      <LegalSection heading="Keine kostenpflichtigen Leistungen">
        <p>
          Sämtliche Funktionen von {site.name} sind kostenlos: die Prüfung, die
          Berechnung der Minderungsquote und die Erstellung der Mängelanzeige,
          die Sie als PDF oder Textdatei herunterladen. Es gibt kein
          kostenpflichtiges Angebot, keinen Bestellvorgang und keine
          Zahlungsdaten.
        </p>
        <p>
          Da zwischen Ihnen und uns <strong>kein entgeltlicher Vertrag</strong>{" "}
          zustande kommt, entsteht auch kein gesetzliches Widerrufsrecht nach
          §§ 312g, 355 BGB. Es gibt schlicht nichts zu widerrufen.
        </p>
      </LegalSection>

      <LegalSection heading="Versand erfolgt durch Sie selbst">
        <p>
          Wir versenden keine Briefe. Die fertige Mängelanzeige laden Sie herunter
          und schicken sie selbst an Ihren Vermieter, am besten nachweisbar per
          Einwurf-Einschreiben.
        </p>
      </LegalSection>

      <LegalSection heading="Sollten wir später etwas kostenpflichtig anbieten">
        <p>
          Falls wir künftig eine kostenpflichtige Leistung einführen, erhalten Sie
          vor jeder Bestellung eine vollständige Widerrufsbelehrung samt
          Muster-Widerrufsformular, und diese Seite wird entsprechend ersetzt. Bis
          dahin gilt: alles kostenlos, nichts zu widerrufen.
        </p>
        <p>
          Fragen dazu beantworten wir gern unter{" "}
          <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
