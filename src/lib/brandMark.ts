/**
 * The "MO" monogram - the single source of geometry for the brand mark.
 *
 * Everything that draws the mark reads from here: the <BrandMark> component in
 * the headers and footer, the SVG favicon and every PNG that
 * scripts/generate-brand-assets.ts rasterises, and the social cards. They can
 * therefore never drift apart.
 *
 * The letterforms are real Inter ExtraBold outlines (see brandMarkGlyphs.ts),
 * matching the wordmark that sits next to the mark in the header.
 */

import { CAP_HEIGHT, M_PATH, M_WIDTH, O_PATH, O_WIDTH } from "./brandMarkGlyphs";

/** Side of the square canvas the mark is drawn on. */
export const BRAND_MARK_SIZE = 512;

/** Corner radius, ~22% of the side - rounder than a card, squarer than iOS. */
export const BRAND_MARK_RADIUS = 112;

export const BRAND_MARK_VIEWBOX = `0 0 ${BRAND_MARK_SIZE} ${BRAND_MARK_SIZE}`;

/**
 * Gap between the two letters, per 1000-unit em. Tighter than Inter's natural
 * fit: a monogram should read as one shape rather than as two set letters.
 */
const LETTER_GAP = 50;

/**
 * Share of the tile's width the letter block spans. The binding constraint is
 * legibility at 16x16, where each glyph is only about five pixels wide, so the
 * letters run wide and the padding is thinner than a logo would normally take.
 */
const LETTER_BLOCK_RATIO = 0.74;

const BLOCK_WIDTH = M_WIDTH + LETTER_GAP + O_WIDTH;
const SCALE = (BRAND_MARK_SIZE * LETTER_BLOCK_RATIO) / BLOCK_WIDTH;

const ORIGIN_X = (BRAND_MARK_SIZE - BLOCK_WIDTH * SCALE) / 2;

/**
 * Caps are centred on the cap height, not on the glyph bounding boxes. The O is
 * cut slightly taller than the M at both ends so that a round letter does not
 * look small beside a flat one; centring on its bounding box would cancel that
 * correction out and visibly misregister the pair.
 */
const BASELINE_Y = (BRAND_MARK_SIZE + CAP_HEIGHT * SCALE) / 2;

const round = (n: number, places = 3) => Number(n.toFixed(places));

/** Places the em-space letter paths into tile coordinates. */
export const BRAND_MARK_LETTERS_TRANSFORM = `translate(${round(ORIGIN_X, 2)} ${round(
  BASELINE_Y,
  2
)}) scale(${round(SCALE, 5)})`;

/** Horizontal offset of the O within the letter block, in em space. */
export const BRAND_MARK_O_OFFSET = round(M_WIDTH + LETTER_GAP, 2);

export const BRAND_MARK_M_PATH = M_PATH;
export const BRAND_MARK_O_PATH = O_PATH;

export type BrandMarkColours = {
  /** Fill of the rounded tile. */
  tile: string;
  /** Fill of the MO letterforms. */
  letters: string;
};

/**
 * The mark on light surfaces: brand blue tile, white letters. Also the browser
 * tab and app icon.
 */
export const BRAND_MARK_ON_LIGHT: BrandMarkColours = {
  tile: "#1d4ed8",
  letters: "#ffffff",
};

/**
 * The mark on dark surfaces - the navy footer and the blue social cards. Blue
 * on navy has far too little contrast, so the colourway inverts rather than
 * being recoloured by a CSS filter.
 */
export const BRAND_MARK_ON_DARK: BrandMarkColours = {
  tile: "#ffffff",
  letters: "#1d4ed8",
};

export type BrandMarkOptions = BrandMarkColours & {
  /**
   * Corner radius of the tile. Pass 0 for a full-bleed square: iOS and Android
   * launchers apply their own mask, and an icon that rounds its own corners
   * first ends up with the background showing through at the edges.
   */
  radius?: number;
  /**
   * Scales the letters about the centre of the tile without moving the tile.
   * Below 1 for the maskable PWA icon, where a launcher may crop to a circle
   * and only the middle ~80% of the canvas is guaranteed to survive.
   */
  letterScale?: number;
};

/**
 * A standalone SVG document for the mark, for contexts that cannot render the
 * React component: the generated icon.svg, the rasteriser, and the social cards
 * (satori cannot resolve relative URLs, so it gets this inlined as a data URI).
 */
export function brandMarkSvg({
  tile,
  letters,
  radius = BRAND_MARK_RADIUS,
  letterScale = 1,
}: BrandMarkOptions): string {
  const size = BRAND_MARK_SIZE;
  const mid = size / 2;

  let glyphs =
    `<g transform="${BRAND_MARK_LETTERS_TRANSFORM}" fill="${letters}">` +
    `<path d="${BRAND_MARK_M_PATH}"/>` +
    `<path d="${BRAND_MARK_O_PATH}" transform="translate(${BRAND_MARK_O_OFFSET} 0)"/>` +
    `</g>`;

  if (letterScale !== 1) {
    glyphs =
      `<g transform="translate(${mid} ${mid}) scale(${round(letterScale, 5)}) ` +
      `translate(${-mid} ${-mid})">${glyphs}</g>`;
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BRAND_MARK_VIEWBOX}" ` +
    `width="${size}" height="${size}" role="img" aria-label="Mietminderung-online">` +
    `<rect x="0" y="0" width="${size}" height="${size}" rx="${round(radius, 2)}" fill="${tile}"/>` +
    glyphs +
    `</svg>`
  );
}

/** The mark as a `data:` URI, for `<img>` tags that cannot fetch a relative URL. */
export function brandMarkDataUri(colours: BrandMarkColours): string {
  const svg = brandMarkSvg(colours);
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}
