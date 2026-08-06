/**
 * The operator is a GbR under the small-business rule of § 19 UStG. Stating
 * tax would be harmful under § 14c UStG: the stated amount would have to be
 * remitted even though it may not be collected in the first place.
 *
 * Switching to standard taxation only needs STEUERMODUS=regel.
 */
export type Steuermodus = "kleinunternehmer" | "regel";

export function steuermodus(): Steuermodus {
  return process.env.STEUERMODUS === "regel" ? "regel" : "kleinunternehmer";
}

/**
 * Under the small-business rule Stripe must not assume any tax behaviour at
 * all — undefined leaves the amount standing as the final price.
 */
export function stripeTaxBehavior(): "inclusive" | undefined {
  return steuermodus() === "regel" ? "inclusive" : undefined;
}

/** The standard rate. Catalogue prices are gross under either mode. */
export const UMSATZSTEUERSATZ = 19;

export interface Steueraufteilung {
  /** What the customer paid — the catalogue price, unchanged. */
  bruttoCent: number;
  /** The net amount the tax is computed on (§ 14 Abs. 4 Nr. 8 UStG). */
  nettoCent: number;
  /** The tax contained in the gross amount. */
  steuerCent: number;
}

/**
 * Splits a gross amount into net and tax.
 *
 * Gross rather than net is the input because that is what Stripe charges:
 * `tax_behavior: "inclusive"` leaves the catalogue price untouched and treats
 * the tax as contained in it. Switching the mode therefore changes what the
 * invoice states, never what the customer pays.
 *
 * The tax is rounded and the net is the remainder, so the three figures the
 * invoice prints next to each other always add up. Deriving both by rounding
 * independently would produce invoices that are off by a cent.
 */
export function umsatzsteuerAusBrutto(bruttoCent: number): Steueraufteilung {
  const steuerCent = Math.round(
    (bruttoCent * UMSATZSTEUERSATZ) / (100 + UMSATZSTEUERSATZ),
  );
  return { bruttoCent, nettoCent: bruttoCent - steuerCent, steuerCent };
}

/*
 * The four sentences that state something about VAT to a customer: the terms,
 * the FAQ and the price block of the dispatch landing page, and the invoice in
 * the order confirmation. They live here rather than at their four call sites
 * so that switching STEUERMODUS cannot leave one of them behind — a price
 * quoted without the tax it is charged with is misleading under §§ 5, 5a UWG,
 * and an invoice that denies a tax that was collected misses the particulars
 * § 14 Abs. 4 UStG requires.
 *
 * The small-business branch repeats the sentence that is live today word for
 * word: the site sells in that mode, so introducing the switch must not change
 * a character of what customers currently read. Under § 34a Satz 1 Nr. 5 UStDV
 * the exemption has to be named expressly, which is why each of those variants
 * carries § 19 UStG.
 */

/** Terms of use, under the price list. */
export function steuerhinweisAgb(): string {
  return steuermodus() === "kleinunternehmer"
    ? "Es handelt sich um Endpreise; gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher auch nicht ausgewiesen."
    : "Es handelt sich um Endpreise einschließlich 19 % Umsatzsteuer.";
}

/** The "Was kostet der Versand" answer, which also feeds the FAQ schema. */
export function steuerhinweisFaq(): string {
  return steuermodus() === "kleinunternehmer"
    ? "Das sind Endpreise, weitere Kosten entstehen nicht. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."
    : "Das sind Endpreise einschließlich 19 % Umsatzsteuer, weitere Kosten entstehen nicht.";
}

/** The note under the two price cards on the dispatch landing page. */
export function steuerhinweisPreisblock(): string {
  return steuermodus() === "kleinunternehmer"
    ? "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."
    : "Die Preise sind Endpreise einschließlich 19 % Umsatzsteuer.";
}

/**
 * The invoice line in the order confirmation.
 *
 * In standard taxation this only names the rate; the amounts it applies to are
 * printed as their own rows next to the total, because § 14 Abs. 4 Nr. 8 UStG
 * wants the net amount and the tax amount, not a sentence about them.
 */
export function steuerhinweisRechnung(): string {
  return steuermodus() === "kleinunternehmer"
    ? "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher nicht ausgewiesen."
    : "Im Gesamtpreis sind 19 % Umsatzsteuer enthalten.";
}
