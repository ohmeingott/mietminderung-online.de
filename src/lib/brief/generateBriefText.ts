import type { Mangel } from "@/data/maengel";
import { formatiereDatum } from "@/lib/brief/frist";

export interface MieterDaten {
  name: string;
  strasse: string;
  plz: string;
  ort: string;
  telefon: string;
  email: string;
  wohnungNr: string;
}

/**
 * Who the letter is addressed to. "firma" is the default and covers both a
 * company and a private landlord whose form of address the tenant does not
 * know — in both cases "Sehr geehrte Damen und Herren" is the correct thing to
 * write, so nothing is lost by leaving it alone.
 */
export type Anrede = "frau" | "herr" | "firma";

export interface VermieterDaten {
  name: string;
  strasse: string;
  plz: string;
  ort: string;
  /** Absent on drafts started before this field existed; treated as "firma". */
  anrede?: Anrede;
}

export interface MangelDetail {
  beschreibung: string;
  seit: string;
  raum: string;
}

export interface BriefDaten {
  mieter: MieterDaten;
  vermieter: VermieterDaten;
  /** In the order the user picked them; that order numbers the letter. */
  maengel: Mangel[];
  /**
   * Keyed by `mangel.id`, never by position. Keying by index silently moved
   * every description up by one whenever a defect was removed further up the
   * list, so the mould paragraph ended up under the broken-lift heading.
   */
  details: Record<string, MangelDetail>;
  /** Answers to the eligibility questions, keyed by question id. */
  antworten: Record<string, string>;
  /** The day the defects have to be fixed by. */
  frist: Date;
  /** Injectable so tests are not at the mercy of the calendar. */
  heute?: Date;
}

function aktuellerMonat(heute: Date): string {
  return heute.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

/**
 * Academic titles belong in the salutation, everything else in front of the
 * name does not. "Dr." is kept because leaving it out reads as a slight;
 * "Herrn", "Frau" and the like would only be repeated by the salutation.
 */
const TITEL = /^(dr\.?|prof\.?|dipl\.-?\w*\.?|herrn?|frau)$/i;

/**
 * Name particles that belong to the surname. Splitting on the last word alone
 * would turn "Anna von der Heide" into "Sehr geehrte Frau Heide" — wrong, and
 * wrong in a way the recipient notices immediately.
 */
const NAMENSZUSATZ =
  /^(von|vom|van|de|del|della|di|da|dos|zu|zum|zur|ten|ter|le|la|of|der|den|dem|auf|im|in)$/i;

/**
 * The surname, as a German salutation uses it — never the first name, because
 * "Sehr geehrte Frau Ursula Fehrenbach" is not how anyone writes.
 *
 * Returns null when nothing usable is left, and the caller then falls back to
 * the neutral form rather than addressing an empty string.
 */
export function nachnameFuerAnrede(name: string): string | null {
  const woerter = name.trim().split(/\s+/).filter(Boolean);
  while (woerter.length > 1 && TITEL.test(woerter[0])) woerter.shift();
  if (woerter.length === 0) return null;
  if (woerter.length === 1) return woerter[0];

  // Walk left from the last word for as long as particles precede it.
  let start = woerter.length - 1;
  while (start > 1 && NAMENSZUSATZ.test(woerter[start - 1])) start--;
  return woerter.slice(start).join(" ");
}

/**
 * The opening line.
 *
 * It used to read "Sehr geehrte/r <voller Name>," for everyone, which is both
 * unidiomatic and the single clearest sign that a letter came out of a
 * generator — the first line the landlord reads. A company addressed that way
 * ("Sehr geehrte/r Hausverwaltung Muster GmbH,") looked worse still.
 */
export function anredeZeile(vermieter: VermieterDaten): string {
  const nachname =
    vermieter.anrede === "frau" || vermieter.anrede === "herr"
      ? nachnameFuerAnrede(vermieter.name)
      : null;

  if (nachname === null) return "Sehr geehrte Damen und Herren,";
  return vermieter.anrede === "frau"
    ? `Sehr geehrte Frau ${nachname},`
    : `Sehr geehrter Herr ${nachname},`;
}

/**
 * The sentence that records an earlier report.
 *
 * The check asks whether the landlord already knows (`eq.angezeigt`) and the
 * answer used to be thrown away, so the letter read like a first notice even
 * when it was the third. Saying so matters twice over: § 536c BGB turns on the
 * notice having been given, and a documented earlier report is what puts the
 * landlord in default that much sooner.
 */
function vorgeschichte(antworten: Record<string, string>): string {
  switch (antworten.angezeigt) {
    case "muendlich":
      return "Auf die genannten Mängel hatte ich Sie bereits mündlich hingewiesen. Eine Beseitigung ist bislang nicht erfolgt.";
    case "ja":
      return "Auf die genannten Mängel hatte ich Sie bereits schriftlich hingewiesen. Eine Beseitigung ist bislang nicht erfolgt.";
    default:
      return "";
  }
}

/** Records a reservation made at move-in, which keeps § 536b BGB from biting. */
function vorbehaltBeiEinzug(antworten: Record<string, string>): string {
  return antworten.mangel_bekannt === "ja_vorbehalt"
    ? "Der Mangel war mir bei Vertragsschluss bekannt; ich habe mir meine Rechte insoweit ausdrücklich vorbehalten."
    : "";
}

/**
 * Builds the letter.
 *
 * Always German, whatever the interface language is: it is addressed to a
 * German landlord and quotes the BGB. Only the surrounding UI is translated.
 *
 * A pure function on purpose — it used to be a `useCallback` closed over five
 * pieces of component state with an `exhaustive-deps` suppression to keep the
 * linter quiet, which made the letter impossible to test without a browser.
 */
export function generateBriefText({
  mieter,
  vermieter,
  maengel,
  details,
  antworten,
  frist,
  heute = new Date(),
}: BriefDaten): string {
  const mangelTexte = maengel
    .map((mangel, i) => {
      const detail = details[mangel.id];
      let text = `${i + 1}. ${mangel.label}`;
      if (detail?.raum) text += ` (Raum: ${detail.raum})`;
      if (detail?.seit) text += ` (besteht seit ${detail.seit})`;
      if (detail?.beschreibung) text += `\n   ${detail.beschreibung}`;
      return text;
    })
    .join("\n\n");

  const wohnung = mieter.wohnungNr ? `, Wohnung ${mieter.wohnungNr}` : "";

  // Built as a list so an omitted paragraph leaves no blank gap behind.
  const absaetze = [
    anredeZeile(vermieter),
    "hiermit zeige ich Ihnen an, dass sich in der von mir angemieteten Wohnung folgende Mängel befinden:",
    mangelTexte,
    vorgeschichte(antworten),
    vorbehaltBeiEinzug(antworten),
    `Ich fordere Sie auf, die oben genannten Mängel umgehend, jedoch bis spätestens zum ${formatiereDatum(frist)} zu beseitigen.`,
    `Das mir zustehende Mietminderungsrecht gemäß § 536 Abs. 1 BGB behalte ich mir vor. Rein vorsorglich erkläre ich, dass die bereits gezahlte Miete für den Monat ${aktuellerMonat(heute)} sowie künftige Mietzahlungen unter dem Vorbehalt der Rückforderung geleistet werden.`,
    "Sollten die Mängel nicht fristgerecht beseitigt werden, behalte ich mir weitere rechtliche Schritte vor, insbesondere Schadensersatz gemäß § 536a BGB sowie die Durchführung einer Ersatzvornahme gemäß § 536a Abs. 2 BGB.",
    // Only offered when there is a number to call. It used to print the
    // literal "[Telefonnummer]" into an otherwise finished letter.
    mieter.telefon
      ? `Termine zur Mängelbeseitigung können Sie gerne mit mir telefonisch vereinbaren. Sie erreichen mich tagsüber unter der Rufnummer ${mieter.telefon}.`
      : "Termine zur Mängelbeseitigung können Sie gerne schriftlich mit mir vereinbaren.",
    "Mit freundlichen Grüßen",
    mieter.name,
  ].filter(Boolean);

  return `${mieter.name}
${mieter.strasse}
${mieter.plz} ${mieter.ort}

${vermieter.name}
${vermieter.strasse}
${vermieter.plz} ${vermieter.ort}

${mieter.ort}, den ${formatiereDatum(heute)}

Betreff: Mängelanzeige für die Wohnung ${mieter.strasse}, ${mieter.plz} ${mieter.ort}${wohnung}

${absaetze.join("\n\n")}`;
}
