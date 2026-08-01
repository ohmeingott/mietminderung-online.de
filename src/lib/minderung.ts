import type { Mangel } from "@/data/maengel";

export interface Quote {
  min: number;
  max: number;
  typical: number;
}

/** Percentage by which the actual floor area falls short of the agreed area. */
export function wohnflaechenAbweichung(
  vereinbart: number,
  tatsaechlich: number,
): number | null {
  if (!Number.isFinite(vereinbart) || !Number.isFinite(tatsaechlich)) {
    return null;
  }
  if (vereinbart <= 0 || tatsaechlich <= 0) return null;
  return ((vereinbart - tatsaechlich) / vereinbart) * 100;
}

/**
 * Reduction for a floor-area shortfall.
 *
 * Up to and including 10 % the shortfall counts as an insignificant impairment
 * (§ 536 Abs. 1 Satz 3 BGB) and there is no reduction at all. Above it the rent
 * drops by the *full* deviation, not by the part exceeding the threshold - the
 * 10 % mark is an entry threshold, not a deductible (BGH VIII ZR 144/09,
 * following VIII ZR 295/03). So this is a computed figure, never a range.
 */
export function wohnflaechenQuote(abweichung: number): number {
  if (!Number.isFinite(abweichung) || abweichung <= 10) return 0;
  return Math.min(Math.round(abweichung * 10) / 10, 100);
}

export interface QuotenKontext {
  /** Result of `wohnflaechenAbweichung`, or null while the areas are unknown. */
  wohnflaecheAbweichung?: number | null;
}

/**
 * The range to use for a defect. Everything comes from the static table except
 * the floor-area entry, whose quota is derived from the areas the user entered.
 */
export function effektiveQuote(
  mangel: Mangel,
  kontext: QuotenKontext = {},
): Quote {
  const statisch: Quote = {
    min: mangel.minderung_min,
    max: mangel.minderung_max,
    typical: mangel.minderung_typical,
  };

  if (mangel.berechnet === "wohnflaeche") {
    const abweichung = kontext.wohnflaecheAbweichung;
    if (abweichung == null) return statisch;
    const quote = wohnflaechenQuote(abweichung);
    return { min: quote, max: quote, typical: quote };
  }

  return statisch;
}

/**
 * Combine several defects into one figure.
 *
 * Courts do not add the individual quotas up. They ask how far the flat as a
 * whole has lost its fitness for use (§ 536 Abs. 1 BGB), and the result is
 * regularly *below* the sum. We approximate that: the largest quota counts in
 * full, every further one at half weight. That is still an estimate, but it no
 * longer produces the 100 % pile-ups a plain sum ran into.
 */
export function gesamtQuote(quoten: number[]): number {
  if (quoten.length === 0) return 0;
  const absteigend = [...quoten].sort((a, b) => b - a);
  const summe =
    absteigend[0] + absteigend.slice(1).reduce((acc, q) => acc + q / 2, 0);
  return Math.min(Math.round(summe), 100);
}

/** Plain sum of the individual quotas - shown only as an upper orientation. */
export function summeEinzelquoten(quoten: number[]): number {
  return Math.min(
    Math.round(quoten.reduce((acc, q) => acc + q, 0)),
    100,
  );
}
