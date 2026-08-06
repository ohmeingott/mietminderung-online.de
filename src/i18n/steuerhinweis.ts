import type { Steuermodus } from "@/lib/steuer";

/**
 * The tax note of the dispatch card, per tax mode.
 *
 * It is the one VAT statement of the product that is translated, because it
 * sits inside the wizard right above the pay button — where a Turkish or Polish
 * reader decides to buy. Both variants therefore exist in every locale, and
 * check:i18n keeps them there.
 *
 * Two keys rather than one sentence assembled at runtime: the small-business
 * variant has to name § 19 UStG expressly (§ 34a Satz 1 Nr. 5 UStDV) while the
 * standard-taxation variant has to name the rate the price contains (§§ 5, 5a
 * UWG). Those are different sentences in every language, not one sentence with
 * a hole in it.
 */
export const STEUERHINWEIS_SCHLUESSEL = {
  kleinunternehmer: "dispatch.taxNote",
  regel: "dispatch.taxNoteRegel",
} as const;

export function steuerhinweisSchluessel(modus: Steuermodus): string {
  return STEUERHINWEIS_SCHLUESSEL[modus];
}
