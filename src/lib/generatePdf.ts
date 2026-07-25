import jsPDF from "jspdf";

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
const SIGNATURE_WIDTH_MM = 50;
const SIGNATURE_HEIGHT_MM = 20;

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

  // Blank lines in the source text are meaningful paragraph breaks, so walk the
  // text line by line rather than letting jsPDF collapse it.
  for (const paragraph of text.split("\n")) {
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

  return doc;
}

/** Base64 payload without the `data:` prefix, for the postal dispatch API. */
export function generatePdfBase64(options: LetterPdfOptions): string {
  return generatePdf(options).output("datauristring").split(",")[1];
}
