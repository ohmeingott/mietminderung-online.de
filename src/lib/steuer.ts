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
