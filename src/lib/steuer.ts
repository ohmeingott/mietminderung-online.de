/**
 * Der Betreiber ist eine GbR unter der Kleinunternehmerregelung. Ein
 * Steuerausweis wäre nach § 14c UStG schädlich: die ausgewiesene Steuer
 * müsste abgeführt werden, obwohl sie nicht erhoben werden darf.
 *
 * Beim Wechsel zur Regelbesteuerung genügt STEUERMODUS=regel.
 */
export type Steuermodus = "kleinunternehmer" | "regel";

export function steuermodus(): Steuermodus {
  return process.env.STEUERMODUS === "regel" ? "regel" : "kleinunternehmer";
}

/**
 * Stripe darf im Kleinunternehmerfall keinerlei Steuerverhalten annehmen —
 * undefined lässt den Betrag unverändert als Endpreis stehen.
 */
export function stripeTaxBehavior(): "inclusive" | undefined {
  return steuermodus() === "regel" ? "inclusive" : undefined;
}
