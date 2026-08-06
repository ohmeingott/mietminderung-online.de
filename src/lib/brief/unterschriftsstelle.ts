/**
 * Where in the letter the signature belongs.
 *
 * The letter generator deliberately keeps blank lines between "Mit
 * freundlichen Grüßen" and the typed name. This file finds them.
 *
 * It exists because the same spot is looked for twice — in the dispatch PDF
 * (src/lib/briefPdf.ts) and in the free download (src/lib/generatePdf.ts) —
 * and both had the same bug independently: each appended the image at the end
 * of the text, which in a German letter puts the signature *below* the name
 * instead of above it. In the dispatch PDF the edge rule then threw it onto a
 * second, otherwise empty sheet, which eBrief bills for.
 *
 * Deliberately without any dependency. Both callers pull in jsPDF, and a
 * preview rendering the finished letter in the browser must be able to place
 * the signature the same way without dragging jsPDF and its embedded 500 kB
 * font into the client bundle.
 */

/**
 * Index of the first blank line of the last blank block before the last
 * written line, or -1 when there is none.
 *
 * The callers remember the Y position at that line and set the image there,
 * without touching the flow of the text.
 */
export function findeUnterschriftsluecke(zeilen: string[]): number {
  const letzteTextzeile = zeilen.findLastIndex((z) => z.trim() !== "");
  // Nothing written, or written on the very first line: either way there is no
  // room above it that the generator could have kept free.
  if (letzteTextzeile <= 0) return -1;

  let i = letzteTextzeile - 1;
  while (i >= 0 && zeilen[i].trim() === "") i--;

  // At least one blank line has to lie between, otherwise the name follows the
  // closing directly and there is no gap to fill.
  return i < letzteTextzeile - 1 ? i + 1 : -1;
}
