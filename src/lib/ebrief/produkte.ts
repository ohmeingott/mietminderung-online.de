/**
 * Verkaufspreise sind Endpreise. Der Betreiber ist Kleinunternehmer nach
 * § 19 UStG und darf keine Umsatzsteuer ausweisen — siehe src/lib/steuer.ts.
 *
 * Die Einkaufspreise dienen nur der Kalkulation und werden nicht angezeigt.
 * Ohne Vorsteuerabzug ist der Bruttopreis der real gezahlte Preis.
 */
export interface Produkt {
  id: ProduktId;
  /** Endpreis in Cent, den der Nutzer zahlt. */
  preisCent: number;
  /** Einkaufspreis brutto in Cent laut eBrief-Preisliste, Standardbrief bis 3 Blatt. */
  einkaufBruttoCent: number;
  /** Job-Attribute. eBrief erwartet hier Strings, keine Booleans. */
  ebrief: {
    IsDuplex: "true" | "false";
    IsColor: "true" | "false";
    IsTracking: "true" | "false";
  };
}

export type ProduktId = "brief" | "einwurfEinschreiben";

export const PRODUKTE: Record<ProduktId, Produkt> = {
  brief: {
    id: "brief",
    preisCent: 249,
    einkaufBruttoCent: 88,
    ebrief: { IsDuplex: "false", IsColor: "false", IsTracking: "false" },
  },
  einwurfEinschreiben: {
    id: "einwurfEinschreiben",
    preisCent: 699,
    einkaufBruttoCent: 415,
    ebrief: { IsDuplex: "false", IsColor: "false", IsTracking: "true" },
  },
};

export function istProduktId(value: unknown): value is ProduktId {
  return value === "brief" || value === "einwurfEinschreiben";
}
