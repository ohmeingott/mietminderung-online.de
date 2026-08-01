import type { Mangel } from "@/data/maengel";
import { mangelSeo } from "@/data/seoContent";

/**
 * How long the landlord gets to fix the defect.
 *
 * The catalogue in `seoContent.ts` carries a per-defect `fristTage` between 1
 * and 30 that until now only the SEO pages read, while the letter hard-coded
 * fourteen days for a burst pipe and for a squeaky balcony door alike. These
 * are the deadlines the user can actually pick; the suggestion below snaps the
 * catalogue value onto one of them.
 */
export const FRIST_OPTIONEN = [3, 7, 14, 21] as const;

export type FristOption = (typeof FRIST_OPTIONEN)[number];

/** Used when a defect carries no catalogue entry, which should not happen. */
export const FRIST_STANDARD: FristOption = 14;

export interface FristVorschlag {
  tage: FristOption;
  /** The defect that produced the suggestion, for naming it in the UI. */
  treiber: Mangel | null;
  /** True when any selected defect is flagged urgent. */
  dringend: boolean;
}

/**
 * The shortest deadline among the selected defects wins.
 *
 * One letter carries one deadline, so a selection of "heating completely dead"
 * (3 days) plus "damp cellar" (21) has to be answered in three: a deadline the
 * most urgent defect cannot live with is no deadline at all.
 */
export function fristVorschlag(maengel: Mangel[]): FristVorschlag {
  let kleinsteTage = Number.POSITIVE_INFINITY;
  let treiber: Mangel | null = null;
  let dringend = false;

  for (const mangel of maengel) {
    const seo = mangelSeo[mangel.id];
    if (!seo) continue;
    if (seo.dringend) dringend = true;
    if (seo.fristTage < kleinsteTage) {
      kleinsteTage = seo.fristTage;
      treiber = mangel;
    }
  }

  if (!Number.isFinite(kleinsteTage)) {
    return { tage: FRIST_STANDARD, treiber: null, dringend: false };
  }

  // The largest offered option that still fits, with the shortest as a floor:
  // the catalogue has entries of one day, and "one day" is not a deadline a
  // letter can credibly set once the post has taken two.
  const passend = FRIST_OPTIONEN.filter((option) => option <= kleinsteTage);
  return {
    tage: passend.length ? (Math.max(...passend) as FristOption) : FRIST_OPTIONEN[0],
    treiber,
    dringend,
  };
}

/** Local midnight `n` days from `ab`, free of any timezone arithmetic. */
export function fristDatum(ab: Date, tage: number): Date {
  const datum = new Date(ab.getFullYear(), ab.getMonth(), ab.getDate());
  datum.setDate(datum.getDate() + tage);
  return datum;
}

/**
 * The letter is German whatever the interface language is, so the date in it
 * is too. Using the active locale here would put Arabic-Indic digits into a
 * letter addressed to a German landlord.
 */
export function formatiereDatum(datum: Date): string {
  return datum.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** `YYYY-MM-DD` in local time, for the `min`/`max` of a date input. */
export function alsIsoDatum(datum: Date): string {
  const monat = String(datum.getMonth() + 1).padStart(2, "0");
  const tag = String(datum.getDate()).padStart(2, "0");
  return `${datum.getFullYear()}-${monat}-${tag}`;
}

/** Whole days between two dates, ignoring the time of day. */
export function tageZwischen(von: Date, bis: Date): number {
  const a = Date.UTC(von.getFullYear(), von.getMonth(), von.getDate());
  const b = Date.UTC(bis.getFullYear(), bis.getMonth(), bis.getDate());
  return Math.round((b - a) / 86_400_000);
}
