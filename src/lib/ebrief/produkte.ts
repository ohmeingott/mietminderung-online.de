/**
 * Sale prices are final prices. The operator is a small business under
 * § 19 UStG and may not state VAT — see src/lib/steuer.ts.
 *
 * Purchase prices deliberately do not live here. They are tiered — a base
 * price for the first sheet plus a surcharge per further sheet — so a single
 * constant per product can only ever be right for a one-page letter, and real
 * defect notices run longer. The margin is reasoned about in
 * docs/ebrief/preiskalkulation.md, and the guard in
 * /api/versand/vorbereiten asks eBrief for the price of the actual job rather
 * than trusting a figure kept here.
 */
export interface Produkt {
  id: ProduktId;
  /** Final price in cents that the user pays. */
  preisCent: number;
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
    ebrief: { IsDuplex: "false", IsColor: "false", IsTracking: "false" },
  },
  einwurfEinschreiben: {
    id: "einwurfEinschreiben",
    preisCent: 699,
    ebrief: { IsDuplex: "false", IsColor: "false", IsTracking: "true" },
  },
};

export function istProduktId(value: unknown): value is ProduktId {
  return value === "brief" || value === "einwurfEinschreiben";
}
