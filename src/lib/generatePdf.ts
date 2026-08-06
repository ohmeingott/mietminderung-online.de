import jsPDF from "jspdf";
import { findeUnterschriftsluecke } from "./brief/unterschriftsstelle";

export interface LetterPdfOptions {
  /** The letter body exactly as the user sees it in the preview. */
  text: string;
  /** PNG data URL of the drawn signature, if the user made one. */
  signatureDataUrl?: string;
}

const PAGE_WIDTH_MM = 210;
const MARGIN_LEFT_MM = 25;
const MARGIN_RIGHT_MM = 25;
const MAX_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_LEFT_MM - MARGIN_RIGHT_MM;
const LINE_HEIGHT_MM = 5.5;
const FIRST_LINE_Y_MM = 30;
const PAGE_BREAK_Y_MM = 272;
/**
 * Larger than in the dispatch layout (src/lib/briefPdf.ts), which has to keep
 * the letter on one billed sheet. This page is downloaded, not posted, and has
 * room to spare.
 */
const SIGNATURE_WIDTH_MM = 50;
const SIGNATURE_HEIGHT_MM = 20;

/**
 * Clearance between the foot of the signature and the baseline of the typed
 * name. A baseline is the foot of the glyphs, not their top: without this the
 * name's ascenders would reach up into the image.
 */
const SIGNATURE_CLEARANCE_MM = 3.5;

/**
 * How much the signature gap has to grow, in mm.
 *
 * The letter already leaves a blank line between the closing and the name;
 * only the shortfall is added, so a letter the user has rewritten with a
 * generous gap of its own is not stretched any further.
 */
function missingGapSpace(lines: string[], gap: number): number {
  let blanks = 0;
  while (gap + blanks < lines.length && lines[gap + blanks].trim() === "") {
    blanks++;
  }
  return Math.max(
    0,
    SIGNATURE_HEIGHT_MM + SIGNATURE_CLEARANCE_MM - blanks * LINE_HEIGHT_MM
  );
}

/**
 * Renders the letter from the text the user actually reviewed and edited, so
 * the PDF is always what they saw on screen. Rebuilding it from the form data
 * would silently drop their manual changes.
 */
export function generatePdf({ text, signatureDataUrl }: LetterPdfOptions): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let y = FIRST_LINE_Y_MM;

  const newPage = () => {
    doc.addPage();
    y = 25;
  };

  const lines = text.split("\n");

  /*
   * Where the signature belongs: in the gap between "Mit freundlichen Grüßen"
   * and the typed name, which is where a German letter puts it. It used to be
   * appended after the whole text, and so ended up below the name.
   *
   * The room is made here, at render time, and only when there is a signature
   * to put in it — the same way the dispatch layout does it, and with the same
   * gap-finder, so the two cannot drift apart. Finding no gap means the user
   * rewrote the letter past recognition, and the image goes at the end.
   */
  const gap = signatureDataUrl ? findeUnterschriftsluecke(lines) : -1;
  const extraGapSpace = gap === -1 ? 0 : missingGapSpace(lines, gap);

  /** Set once the walk reaches the gap; the page break can fall in between. */
  let signatureSpot: { page: number; y: number } | null = null;

  // Blank lines in the source text are meaningful paragraph breaks, so walk the
  // text line by line rather than letting jsPDF collapse it.
  for (let index = 0; index < lines.length; index++) {
    const paragraph = lines[index];

    if (index === gap) {
      // Take the break before the gap rather than through it: an image split
      // across two pages is worse than a closing left at the foot of one.
      if (y + SIGNATURE_HEIGHT_MM + SIGNATURE_CLEARANCE_MM > PAGE_BREAK_Y_MM) {
        newPage();
      }
      signatureSpot = { page: doc.getCurrentPageInfo().pageNumber, y };
      y += extraGapSpace;
    }

    if (paragraph.trim() === "") {
      y += LINE_HEIGHT_MM;
      if (y > PAGE_BREAK_Y_MM) newPage();
      continue;
    }

    for (const line of doc.splitTextToSize(paragraph, MAX_WIDTH_MM)) {
      if (y > PAGE_BREAK_Y_MM) newPage();
      doc.text(line, MARGIN_LEFT_MM, y);
      y += LINE_HEIGHT_MM;
    }
  }

  if (signatureDataUrl) {
    if (signatureSpot) {
      // The page is set explicitly: were the break to fall between the gap and
      // the name, the image would otherwise land on the wrong one.
      const current = doc.getCurrentPageInfo().pageNumber;
      doc.setPage(signatureSpot.page);
      doc.addImage(
        signatureDataUrl,
        "PNG",
        MARGIN_LEFT_MM,
        signatureSpot.y,
        SIGNATURE_WIDTH_MM,
        SIGNATURE_HEIGHT_MM
      );
      doc.setPage(current);
    } else {
      if (y + SIGNATURE_HEIGHT_MM > PAGE_BREAK_Y_MM) newPage();
      y += LINE_HEIGHT_MM;
      doc.addImage(
        signatureDataUrl,
        "PNG",
        MARGIN_LEFT_MM,
        y,
        SIGNATURE_WIDTH_MM,
        SIGNATURE_HEIGHT_MM
      );
    }
  }

  return doc;
}
