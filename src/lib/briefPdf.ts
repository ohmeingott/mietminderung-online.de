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
 */
const LINKER_RAND_MM = 25;
const RECHTER_RAND_MM = 20;
const SEITENBREITE_MM = 210;
const TEXTBREITE_MM = SEITENBREITE_MM - LINKER_RAND_MM - RECHTER_RAND_MM;

const ABSENDERZEILE_Y_MM = 45;
const ANSCHRIFT_Y_MM = 55;
const ANSCHRIFT_BREITE_MM = 85;
const TEXTSTART_Y_MM = 111;

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
  /**
   * For a registered letter a PIN AG coding zone sits above the address
   * field and must stay free of text, so the sender line is dropped.
   */
  istEinschreiben: boolean;
}

/**
 * The generated letter text already carries an address header (tenant,
 * landlord, date). In the dispatch layout the address goes into the address
 * field, so leaving the header in the body would print it twice. The subject
 * line is the reliable anchor: in DIN 5008 it follows the address anyway.
 */
export function entferneAdresskopf(text: string): string {
  const zeilen = text.split("\n");
  const index = zeilen.findIndex((zeile) => /^\s*Betreff:/i.test(zeile));
  return index === -1 ? text : zeilen.slice(index).join("\n");
}

function registriereSchrift(doc: jsPDF): void {
  doc.addFileToVFS("DejaVuSans.ttf", DEJAVU_SANS_REGULAR_BASE64);
  doc.addFont("DejaVuSans.ttf", SCHRIFT, "normal");
  doc.setFont(SCHRIFT, "normal");
}

export function generateVersandPdf(opts: VersandPdfOptions): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registriereSchrift(doc);

  // Sender line in 6 pt above the address field. On a registered letter the
  // PIN AG coding zone occupies that strip, so the line is dropped.
  if (!opts.istEinschreiben) {
    doc.setFontSize(6);
    doc.text(opts.absenderZeile, LINKER_RAND_MM, ABSENDERZEILE_Y_MM, {
      maxWidth: ANSCHRIFT_BREITE_MM,
    });
  }

  // Address field: 10 pt, comfortably inside 85 × 27 mm.
  doc.setFontSize(10);
  let anschriftY = ANSCHRIFT_Y_MM;
  for (const zeile of opts.empfaenger) {
    doc.text(zeile, LINKER_RAND_MM, anschriftY, { maxWidth: ANSCHRIFT_BREITE_MM });
    anschriftY += ZEILENHOEHE_MM;
  }

  doc.setFontSize(10);
  let y = TEXTSTART_Y_MM;

  const neueSeite = () => {
    doc.addPage();
    y = FOLGESEITE_START_Y_MM;
  };

  // Blank lines are meaningful paragraph breaks, so walk the text line by
  // line rather than letting jsPDF collapse it.
  for (const absatz of entferneAdresskopf(opts.text).split("\n")) {
    if (absatz.trim() === "") {
      y += ZEILENHOEHE_MM;
      if (y > SEITENUMBRUCH_Y_MM) neueSeite();
      continue;
    }
    for (const zeile of doc.splitTextToSize(absatz, TEXTBREITE_MM)) {
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

/** Base64 without the data-URL prefix — exactly what eBrief expects in FileContent. */
export function versandPdfBase64(opts: VersandPdfOptions): string {
  return generateVersandPdf(opts).output("datauristring").split(",")[1];
}
