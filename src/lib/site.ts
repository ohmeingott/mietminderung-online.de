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
