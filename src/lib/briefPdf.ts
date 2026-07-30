import jsPDF from "jspdf";
import { DEJAVU_SANS_REGULAR_BASE64 } from "./fonts/dejaVuSans";

/**
 * Layout per the official eBrief spacing template (A4, 210 × 297 mm).
 * eBrief reads the recipient address out of the PDF — if it does not sit in
 * the address field, the letter is not delivered.
 *
 * The free download keeps using src/lib/generatePdf.ts. The two layouts are
 * deliberately separate: only this one needs an embedded font and clear zones
 * kept free for machine reading.
 *
 * Every vertical position below was measured out of
 * docs/ebrief/PIN_eBrief_Abstandsvorlage_A4_2026_EN.pdf rather than taken
 * from DIN 5008 — the template is neither Form A nor Form B, and the
 * DIN Form B positions put the recipient name inside the coding stripe.
 */
const LINKER_RAND_MM = 25;
const RECHTER_RAND_MM = 20;
const SEITENBREITE_MM = 210;
const TEXTBREITE_MM = SEITENBREITE_MM - LINKER_RAND_MM - RECHTER_RAND_MM;
const RECHTE_TEXTKANTE_MM = SEITENBREITE_MM - RECHTER_RAND_MM;

/**
 * The template reserves a PIN AG coding stripe at 53.0–59.5 mm that has to
 * stay free of text. The sender line sits above it and the address field
 * below it, so the stripe is kept clear by the fixed geometry alone. That is
 * why this layout is identical for a plain and for a registered ("eTracked")
 * letter and needs no flag to tell them apart.
 */
const ABSENDERZEILE_Y_MM = 50;

/** Address field of the template: x 25.37–110.24 mm, y 63.0–89.8 mm. */
const ANSCHRIFT_Y_MM = 67;
const ANSCHRIFT_BREITE_MM = 85;
const ANSCHRIFT_FELD_UNTERKANTE_MM = 89.8;

/**
 * Deliberately tighter than the body's line height: the address has to fit
 * into the 27 mm field, whereas the body is set for readability.
 */
const ANSCHRIFT_ZEILENHOEHE_MM = 5;

/** Descender allowance below the last address baseline at 10 pt. */
const ANSCHRIFT_UNTERLAENGE_MM = 1;

/**
 * A baseline, not a block top. The template marks the start of the text at
 * 111 mm; at 10 pt the ascent is about 3.3 mm, so a baseline of 114 mm puts
 * the top of the first line on that mark.
 */
const TEXTSTART_Y_MM = 114;

const ZEILENHOEHE_MM = 5.5;
const SEITENUMBRUCH_Y_MM = 272;
const FOLGESEITE_START_Y_MM = 25;

const UNTERSCHRIFT_BREITE_MM = 50;
const UNTERSCHRIFT_HOEHE_MM = 20;

const SCHRIFT = "DejaVuSans";

export interface VersandPdfOptions {
  /** The letter text exactly as the user confirmed it in the preview. */
  text: string;
  absenderZeile: string;
  empfaenger: string[];
  signatureDataUrl?: string;
}

export interface Brieftext {
  /**
   * The date line lifted out of the header, e.g. "Köln, den 30.07.2026", or
   * null when the text carries none. Never invented: an undated Mängelanzeige
   * is weak, but a wrong date is worse.
   */
  datum: string | null;
  /** The letter from the subject line onwards. */
  koerper: string;
  /**
   * A "Betreff:" anchor was found, so the address header could be stripped.
   * False means the user rewrote the letter and the body may repeat the
   * address. That is ugly, not undeliverable — eBrief reads the address
   * field this layout fills independently — so it is reported, not thrown.
   */
  kopfErkannt: boolean;
}

/**
 * What the layout had to infer from the freely edited letter text, so the
 * calling route can decide policy instead of guessing. The address overflow
 * throws because it makes the letter undeliverable; everything here is
 * merely worth warning about.
 */
export interface VersandBefund {
  /** See Brieftext.kopfErkannt. */
  kopfErkannt: boolean;
  /** A date line was recovered from the header and rendered. */
  datumErkannt: boolean;
  /**
   * The sender line did not fit on one line and was truncated. It is the
   * return address for undeliverable mail, so silently cutting it is the
   * same class of mistake as silently dropping the date.
   */
  absenderGekuerzt: boolean;
}

export function leererBefund(): VersandBefund {
  return { kopfErkannt: false, datumErkannt: false, absenderGekuerzt: false };
}

export interface VersandPdfErgebnis extends VersandBefund {
  /** Base64 without the data-URL prefix — what eBrief expects in FileContent. */
  base64: string;
}

/**
 * Thrown when the recipient address does not fit the template's 27 mm
 * address field, which eBrief would reject.
 *
 * The message is an English developer diagnostic for logs only. The site
 * ships in six languages (see src/i18n/translations.ts), so a message thrown
 * from here can never be shown to a user — the calling route catches this
 * type, maps it to its own error code, and the UI translates that.
 * The measurements are exposed so callers branch on numbers, not on prose.
 */
export class AnschriftZuLangError extends Error {
  constructor(
    /** Number of lines the address occupies after wrapping. */
    readonly zeilen: number,
    /** How far down the page the rendered address reaches, in mm. */
    readonly unterkanteMm: number,
    /** Where the address field ends, in mm from the top of the page. */
    readonly feldUnterkanteMm: number
  ) {
    super(
      `Recipient address does not fit the eBrief address field: ${zeilen} ` +
        `lines reach ${unterkanteMm.toFixed(1)} mm, the field ends at ` +
        `${feldUnterkanteMm} mm.`
    );
    this.name = "AnschriftZuLangError";
  }
}

/** Matches the "<Ort>, den DD.MM.YYYY" line the letter generator emits. */
const DATUMSZEILE = /^\s*\S.*,\s+den\s+\d{1,2}\.\d{1,2}\.\d{4}\s*$/;

/** Longest header line still plausible as a hand-reformatted date. */
const DATUM_FALLBACK_MAXLAENGE = 60;

/**
 * A four-digit year, deliberately not any run of four digits: a German
 * postcode is five digits, so "40477 Düsseldorf" must not qualify as a date.
 */
const JAHRESZAHL = /\b(?:19|20)\d{2}\b/;

/** German month names and the usual abbreviations. */
const MONATSNAME =
  /\b(?:jan(?:uar)?|feb(?:ruar)?|m(?:ärz|är|rz|aerz)|apr(?:il)?|mai|jun[i]?|jul[i]?|aug(?:ust)?|sep(?:t|tember)?|okt(?:ober)?|nov(?:ember)?|dez(?:ember)?)\b/i;

/**
 * Whether a discarded header line could plausibly be the user's date line.
 * Requiring a year or a month name rather than merely a digit matters: a
 * postcode printed where the date belongs reads as a malformed letter, and
 * it would make datumErkannt useless to the caller exactly when it counts.
 */
function istDatumsKandidat(zeile: string): boolean {
  return (
    zeile.length <= DATUM_FALLBACK_MAXLAENGE &&
    (JAHRESZAHL.test(zeile) || MONATSNAME.test(zeile))
  );
}

/**
 * Finds the date among the header lines that are about to be discarded.
 *
 * The strict pattern above is the primary match. Users edit the letter
 * freely, though, so a date reformatted as "31. Juli 2026" or
 * "Düsseldorf, 30.07.2026" would otherwise be thrown away silently. The
 * fallback therefore keeps the last non-empty header line when it looks
 * like a date, per istDatumsKandidat.
 *
 * Nothing is invented: whatever is rendered is the user's own line, and
 * only ever a line from before the subject anchor, which is discarded
 * either way. A body line can never be picked up.
 */
function findeDatum(kopfZeilen: string[]): string | null {
  const streng = [...kopfZeilen].reverse().find((zeile) => DATUMSZEILE.test(zeile));
  if (streng) return streng.trim();

  const letzte = [...kopfZeilen].reverse().find((zeile) => zeile.trim() !== "");
  if (!letzte) return null;

  const kandidat = letzte.trim();
  return istDatumsKandidat(kandidat) ? kandidat : null;
}

/**
 * The generated letter text carries an address header (tenant, landlord,
 * date). In the dispatch layout the address goes into the address field, so
 * leaving the header in the body would print it twice. The subject line is
 * the reliable anchor: in DIN 5008 it follows the address anyway.
 *
 * The date is the one part of that header worth keeping — it is what dates
 * the Frist — so it is returned separately and re-rendered above the subject
 * instead of being dropped along with the rest.
 */
export function zerlegeBrieftext(text: string): Brieftext {
  const zeilen = text.split("\n");
  const index = zeilen.findIndex((zeile) => /^\s*Betreff:/i.test(zeile));

  // No anchor means the user rewrote the letter. Post it as it stands rather
  // than refusing: a repeated address block is cosmetic, and the address
  // field is filled from opts.empfaenger regardless.
  if (index === -1) return { datum: null, koerper: text, kopfErkannt: false };

  return {
    datum: findeDatum(zeilen.slice(0, index)),
    koerper: zeilen.slice(index).join("\n"),
    kopfErkannt: true,
  };
}

function registriereSchrift(doc: jsPDF): void {
  doc.addFileToVFS("DejaVuSans.ttf", DEJAVU_SANS_REGULAR_BASE64);
  doc.addFont("DejaVuSans.ttf", SCHRIFT, "normal");
  doc.setFont(SCHRIFT, "normal");
}

function umbrich(doc: jsPDF, text: string, breiteMm: number): string[] {
  return doc.splitTextToSize(text, breiteMm) as string[];
}

/**
 * Cuts a string down to a single rendered line. The sender line must not
 * wrap: a second line would run straight into the PIN coding stripe below.
 */
function kuerzeAufEineZeile(
  doc: jsPDF,
  text: string,
  breiteMm: number
): { zeile: string; gekuerzt: boolean } {
  const zeilen = umbrich(doc, text, breiteMm);
  if (zeilen.length <= 1) return { zeile: text, gekuerzt: false };

  let gekuerzt = zeilen[0];
  while (gekuerzt.length > 0 && doc.getTextWidth(`${gekuerzt}…`) > breiteMm) {
    gekuerzt = gekuerzt.slice(0, -1);
  }
  return { zeile: `${gekuerzt}…`, gekuerzt: true };
}

/**
 * `befund` is an optional out-parameter rather than a second return value so
 * that the jsPDF instance stays the return type callers already build on.
 * Construct it with leererBefund().
 */
export function generateVersandPdf(
  opts: VersandPdfOptions,
  befund?: VersandBefund
): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registriereSchrift(doc);

  // Measure everything that can fail before drawing anything, so a rejected
  // address never leaves a half-rendered document behind. Wrapping and
  // truncation both depend on the current font size, hence the two passes.
  doc.setFontSize(10);
  const anschriftZeilen = opts.empfaenger.flatMap((zeile) =>
    umbrich(doc, zeile, ANSCHRIFT_BREITE_MM)
  );
  const anschriftUnterkante =
    ANSCHRIFT_Y_MM +
    (anschriftZeilen.length - 1) * ANSCHRIFT_ZEILENHOEHE_MM +
    ANSCHRIFT_UNTERLAENGE_MM;
  // An address that overflows the 27 mm field is one eBrief would reject, so
  // it is better to fail loudly here than to post an undeliverable letter.
  if (anschriftUnterkante > ANSCHRIFT_FELD_UNTERKANTE_MM) {
    throw new AnschriftZuLangError(
      anschriftZeilen.length,
      anschriftUnterkante,
      ANSCHRIFT_FELD_UNTERKANTE_MM
    );
  }

  doc.setFontSize(6);
  const absender = kuerzeAufEineZeile(
    doc,
    opts.absenderZeile,
    ANSCHRIFT_BREITE_MM
  );

  const { datum, koerper, kopfErkannt } = zerlegeBrieftext(opts.text);

  if (befund) {
    befund.kopfErkannt = kopfErkannt;
    befund.datumErkannt = datum !== null;
    befund.absenderGekuerzt = absender.gekuerzt;
  }

  // Sender line in 6 pt: inside the envelope window, above the coding stripe.
  doc.text(absender.zeile, LINKER_RAND_MM, ABSENDERZEILE_Y_MM);

  // Address field, 10 pt, using the lines measured above.
  doc.setFontSize(10);
  let anschriftY = ANSCHRIFT_Y_MM;
  for (const zeile of anschriftZeilen) {
    doc.text(zeile, LINKER_RAND_MM, anschriftY);
    anschriftY += ANSCHRIFT_ZEILENHOEHE_MM;
  }

  let y = TEXTSTART_Y_MM;

  const neueSeite = () => {
    doc.addPage();
    y = FOLGESEITE_START_Y_MM;
  };

  if (datum) {
    // DIN 5008 puts the date right-aligned above the subject, separated from
    // it by a blank line.
    doc.text(datum, RECHTE_TEXTKANTE_MM, y, { align: "right" });
    y += 2 * ZEILENHOEHE_MM;
  }

  // Blank lines are meaningful paragraph breaks, so walk the text line by
  // line rather than letting jsPDF collapse it.
  for (const absatz of koerper.split("\n")) {
    if (absatz.trim() === "") {
      y += ZEILENHOEHE_MM;
      if (y > SEITENUMBRUCH_Y_MM) neueSeite();
      continue;
    }
    for (const zeile of umbrich(doc, absatz, TEXTBREITE_MM)) {
      if (y > SEITENUMBRUCH_Y_MM) neueSeite();
      doc.text(zeile, LINKER_RAND_MM, y);
      y += ZEILENHOEHE_MM;
    }
  }

  if (opts.signatureDataUrl) {
    // The template forbids large graphics within 3 cm of the page edge.
    if (y + UNTERSCHRIFT_HOEHE_MM > SEITENUMBRUCH_Y_MM - 30) neueSeite();
    y += ZEILENHOEHE_MM;
    doc.addImage(
      opts.signatureDataUrl,
      "PNG",
      LINKER_RAND_MM,
      y,
      UNTERSCHRIFT_BREITE_MM,
      UNTERSCHRIFT_HOEHE_MM
    );
  }

  return doc;
}

/**
 * Returns the PDF alongside what the parse found, so the calling route can
 * warn about a missing header, a missing date or a truncated return address
 * instead of those facts being absorbed here.
 */
export function versandPdfBase64(opts: VersandPdfOptions): VersandPdfErgebnis {
  const befund = leererBefund();
  const doc = generateVersandPdf(opts, befund);
  return {
    base64: doc.output("datauristring").split(",")[1],
    ...befund,
  };
}
