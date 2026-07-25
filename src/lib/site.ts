/**
 * Single source of truth for operator details used across the legal pages.
 * Update here and every legal document follows.
 */
export const site = {
  url: "https://mietminderung.online",
  name: "mietminderung.online",
  operator: {
    name: "Paul Ohm",
    street: "Holzgasse 8",
    zip: "50676",
    city: "Köln",
    country: "Deutschland",
    email: "pjhohm@gmail.com",
  },
  /** Court venue for merchant disputes. */
  venue: "Köln",
  /** Shown as "Stand:" on the legal documents. */
  legalVersion: "Juli 2026",
} as const;

/**
 * Paid postal dispatch is opt-in and switched off by default. The legal pages
 * read the same flag so their statements about prices, contract formation and
 * the right of withdrawal always match what the site actually offers.
 */
export const postVersandEnabled =
  process.env.NEXT_PUBLIC_ENABLE_POST_VERSAND === "true";

/** Gross price of one postal dispatch, in euro. */
export const POST_VERSAND_PREIS = "4,99 €";
