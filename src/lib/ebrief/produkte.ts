/**
 * Sale prices are final prices. The operator is a small business under
 * § 19 UStG and may not state VAT — see src/lib/steuer.ts.
 *
 * The purchase prices exist for calculation only and are never displayed.
 * Without input tax deduction the gross price is what is really paid.
 */
export interface Produkt {
  id: ProduktId;
  /** Final price in cents that the user pays. */
  preisCent: number;
  /** Gross purchase price in cents per the eBrief price list, standard letter up to 3 sheets. */
  einkaufBruttoCent: number;
  /** Job attributes. eBrief expects strings here, not booleans. */
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
