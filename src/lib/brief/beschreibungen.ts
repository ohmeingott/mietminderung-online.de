/**
 * What gets sent to the language model, and how its answers find their way
 * back to the right defect.
 *
 * Split out of the route so the index arithmetic is testable. Descriptions are
 * keyed by position here, and the letter generator was already bitten once by
 * position-keying: removing a defect shifted every description up by one.
 */

export interface MangelInput {
  label: string;
  /**
   * Sent by the client and deliberately not put into the prompt: the letter
   * already prints "(Raum: …)" and "(besteht seit …)" next to the defect, and
   * a model told about them repeats them inside the description too.
   */
  raum: string;
  seit: string;
  beschreibung: string;
}

/** Longest a single defect description may be, to bound prompt size. */
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MAX_MAENGEL = 30;

/**
 * The defects worth rewriting: the ones the tenant actually described.
 *
 * An empty description used to be handed to the model with the instruction to
 * invent "eine kurze, allgemeine Beschreibung" from the defect type. That is
 * how a letter came to say a wasps' nest had been found "im Bereich der
 * Mietwohnung" — a sentence nobody wrote, that names no place, and that a
 * landlord cannot act on. In a formal notice an invented description is worse
 * than none: the defect label alone is at least true.
 *
 * So they are not sent at all. Nothing to invent from, nothing to invent.
 */
export function zuUeberarbeiten(maengel: MangelInput[]): number[] {
  return maengel
    .map((m, i) => (m.beschreibung.trim() === "" ? -1 : i))
    .filter((i) => i >= 0);
}

/** The user message, listing only the defects that carry a description. */
export function baueAnfrage(
  maengel: MangelInput[],
  indizes: number[],
): string {
  return indizes
    .map((index, position) => {
      const m = maengel[index];
      const text = m.beschreibung.trim().slice(0, MAX_DESCRIPTION_LENGTH);
      return `Mangel ${position + 1}: "${m.label}"\nBeschreibung: ${text}`;
    })
    .join("\n\n");
}

/**
 * True when the model returned exactly one string per defect we asked about.
 * Anything else and the caller falls back to the tenant's own words.
 */
export function istGueltigeAntwort(
  antworten: unknown,
  erwartet: number,
): antworten is string[] {
  return (
    Array.isArray(antworten) &&
    antworten.length === erwartet &&
    antworten.every((a) => typeof a === "string")
  );
}

/**
 * Puts the rewritten texts back where they came from.
 *
 * Defects that were never sent keep their own (empty) description, so the
 * letter prints the defect label alone rather than someone else's sentence.
 * A rewrite that comes back blank is discarded in favour of the original —
 * losing the tenant's own words to an over-eager model would be the worst
 * outcome of the whole feature.
 */
export function verteileAntworten(
  maengel: MangelInput[],
  indizes: number[],
  antworten: string[],
): string[] {
  const ergebnis = maengel.map((m) => m.beschreibung);
  indizes.forEach((index, position) => {
    const neu = antworten[position]?.trim();
    if (neu) ergebnis[index] = neu;
  });
  return ergebnis;
}
