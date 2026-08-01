import { eligibilityQuestions } from "@/data/maengel";

/**
 * The fourteen screens of the one wizard.
 *
 * Until now this was two components in two page sections with two progress
 * bars, and committing to the letter threw the reader down a screen height
 * into a second card that started again at nought. It is one card now, and
 * these are its screens.
 */
export const SCREEN = {
  /** Five eligibility questions, one per screen. */
  ANSPRUCH: 0,
  MAENGEL: 5,
  MIETE: 6,
  ERGEBNIS: 7,
  MIETER: 8,
  VERMIETER: 9,
  BESCHREIBUNG: 10,
  FRIST: 11,
  VORSCHAU: 12,
  FERTIG: 13,
} as const;

export const ANZAHL_ANSPRUCHSFRAGEN = eligibilityQuestions.length; // 5
export const LETZTER_SCHRITT = SCREEN.FERTIG; // 13

/**
 * Chapters, not screens.
 *
 * "Schritt 11 von 14" is a true statement that makes people leave. Two named
 * chapters with their own short counts say the same thing without the number
 * that frightens. The bar itself still measures all fourteen, so the two
 * readings never contradict each other.
 */
export type Kapitel = "pruefung" | "brief" | "keins";

export interface KapitelPosition {
  kapitel: Kapitel;
  /** 1-based position inside the chapter, or 0 when it has no counter. */
  schritt: number;
  gesamt: number;
}

export function kapitelPosition(screen: number): KapitelPosition {
  if (screen <= SCREEN.MIETE) {
    return { kapitel: "pruefung", schritt: screen + 1, gesamt: SCREEN.MIETE + 1 };
  }
  if (screen === SCREEN.ERGEBNIS) {
    return { kapitel: "keins", schritt: 0, gesamt: 0 };
  }
  if (screen <= SCREEN.FRIST) {
    return {
      kapitel: "brief",
      schritt: screen - SCREEN.ERGEBNIS,
      gesamt: SCREEN.FRIST - SCREEN.ERGEBNIS,
    };
  }
  return { kapitel: "keins", schritt: 0, gesamt: 0 };
}

/**
 * The `aria-valuetext` label for a screen. These keys already exist in all
 * seven locales - they were the two components' phase labels - so reusing
 * them costs no translation and keeps the bar named for screen readers.
 */
export function screenLabelKey(screen: number): string {
  if (screen < ANZAHL_ANSPRUCHSFRAGEN) return "check.phase.eligibility";
  switch (screen) {
    case SCREEN.MAENGEL:
      return "check.phase.defects";
    case SCREEN.MIETE:
      return "check.phase.rent";
    case SCREEN.ERGEBNIS:
      return "check.result";
    case SCREEN.MIETER:
      return "letter.step.data";
    case SCREEN.VERMIETER:
      return "letter.step.landlord";
    case SCREEN.BESCHREIBUNG:
      return "letter.step.defects";
    case SCREEN.FRIST:
      return "letter.step.frist";
    case SCREEN.VORSCHAU:
      return "letter.step.preview";
    default:
      return "letter.step.send";
  }
}
