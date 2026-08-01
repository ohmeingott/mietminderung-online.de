/**
 * One-off helper that pulls the real Inter letterforms out of the font binary
 * and prints them as SVG path data.
 *
 * The "MO" monogram has to be resolution independent (it ships as an SVG
 * favicon) and it must not depend on a font being installed wherever the SVG is
 * rendered. Setting the letters as `<text>` fails that test: a standalone SVG
 * falls back to whatever sans-serif the OS has, so the tab icon would look
 * different on every platform. Outlines sidestep that entirely.
 *
 * Writes src/lib/brandMarkGlyphs.ts, which src/lib/brandMark.ts lays out. This
 * is deliberately a run-by-hand step - the generated module is committed, so
 * nothing at build or request time touches the network.
 *
 *   npx tsx scripts/extract-inter-glyphs.ts
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

/** Google serves an uncompressed TrueType instance to legacy user agents, which
 *  saves us from having to undo WOFF2's brotli + glyf transforms by hand. */
const CSS_URL = "https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap";
const LEGACY_UA = "Mozilla/4.0";

const LETTERS = ["M", "O"] as const;

type Table = { offset: number; length: number };

function readTables(buf: Buffer): Map<string, Table> {
  const numTables = buf.readUInt16BE(4);
  const tables = new Map<string, Table>();
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16;
    tables.set(buf.toString("ascii", rec, rec + 4), {
      offset: buf.readUInt32BE(rec + 8),
      length: buf.readUInt32BE(rec + 12),
    });
  }
  return tables;
}

/** Maps a unicode codepoint to a glyph id via the format 4 cmap subtable. */
function glyphIdFor(buf: Buffer, cmap: Table, codepoint: number): number {
  const numSubtables = buf.readUInt16BE(cmap.offset + 2);
  let best = -1;
  for (let i = 0; i < numSubtables; i++) {
    const rec = cmap.offset + 4 + i * 8;
    const platform = buf.readUInt16BE(rec);
    const encoding = buf.readUInt16BE(rec + 2);
    const subtable = cmap.offset + buf.readUInt32BE(rec + 4);
    // Windows BMP (3,1) is the one every font ships; (0,x) Unicode is a fallback.
    if ((platform === 3 && encoding === 1) || platform === 0) best = subtable;
  }
  if (best < 0) throw new Error("no usable cmap subtable");
  if (buf.readUInt16BE(best) !== 4) throw new Error("cmap subtable is not format 4");

  const segCountX2 = buf.readUInt16BE(best + 6);
  const segCount = segCountX2 / 2;
  const endCodes = best + 14;
  const startCodes = endCodes + segCountX2 + 2;
  const idDeltas = startCodes + segCountX2;
  const idRangeOffsets = idDeltas + segCountX2;

  for (let s = 0; s < segCount; s++) {
    const end = buf.readUInt16BE(endCodes + s * 2);
    if (codepoint > end) continue;
    const start = buf.readUInt16BE(startCodes + s * 2);
    if (codepoint < start) return 0;

    const delta = buf.readInt16BE(idDeltas + s * 2);
    const rangeOffset = buf.readUInt16BE(idRangeOffsets + s * 2);
    if (rangeOffset === 0) return (codepoint + delta) & 0xffff;

    const glyphAddr = idRangeOffsets + s * 2 + rangeOffset + (codepoint - start) * 2;
    const glyphId = buf.readUInt16BE(glyphAddr);
    return glyphId === 0 ? 0 : (glyphId + delta) & 0xffff;
  }
  return 0;
}

type Point = { x: number; y: number; onCurve: boolean };

/** Decodes one simple glyph into its closed contours. */
function readContours(buf: Buffer, glyphStart: number): Point[][] {
  const numContours = buf.readInt16BE(glyphStart);
  if (numContours < 0) throw new Error("composite glyphs are not supported");

  let p = glyphStart + 10; // skip numContours + the bounding box
  const endPts: number[] = [];
  for (let i = 0; i < numContours; i++, p += 2) endPts.push(buf.readUInt16BE(p));
  const numPoints = endPts[endPts.length - 1] + 1;

  p += 2 + buf.readUInt16BE(p); // skip the hinting instructions

  const flags: number[] = [];
  while (flags.length < numPoints) {
    const flag = buf[p++];
    flags.push(flag);
    // Bit 3 means "the next byte says how many more times to repeat this flag".
    if (flag & 0x08) {
      let repeat = buf[p++];
      while (repeat-- > 0) flags.push(flag);
    }
  }

  // Coordinates are stored as deltas, x for every point then y for every point.
  const readCoords = (shortBit: number, sameBit: number): number[] => {
    const values: number[] = [];
    let value = 0;
    for (const flag of flags) {
      if (flag & shortBit) {
        const delta = buf[p++];
        value += flag & sameBit ? delta : -delta;
      } else if (!(flag & sameBit)) {
        value += buf.readInt16BE(p);
        p += 2;
      }
      values.push(value);
    }
    return values;
  };
  const xs = readCoords(0x02, 0x10);
  const ys = readCoords(0x04, 0x20);

  const contours: Point[][] = [];
  let start = 0;
  for (const end of endPts) {
    const contour: Point[] = [];
    for (let i = start; i <= end; i++) {
      contour.push({ x: xs[i], y: ys[i], onCurve: (flags[i] & 0x01) !== 0 });
    }
    contours.push(contour);
    start = end + 1;
  }
  return contours;
}

/**
 * Emits SVG path data. TrueType curves are quadratic, so they map onto `Q`
 * directly - the only wrinkle is that consecutive off-curve points imply an
 * on-curve point at their midpoint, and a contour may start off-curve.
 */
function contoursToPath(contours: Point[][], project: (p: Point) => [number, number]): string {
  const out: string[] = [];
  const fmt = (n: number) => (Math.round(n * 100) / 100).toString();

  for (const contour of contours) {
    if (contour.length === 0) continue;

    let points = contour;
    if (!points[0].onCurve) {
      const last = points[points.length - 1];
      const first = points[0];
      const startPoint: Point = last.onCurve
        ? last
        : { x: (first.x + last.x) / 2, y: (first.y + last.y) / 2, onCurve: true };
      points = [startPoint, ...points];
    }

    const [sx, sy] = project(points[0]);
    out.push(`M${fmt(sx)} ${fmt(sy)}`);

    let i = 1;
    while (i <= points.length) {
      const point = points[i % points.length];
      if (point.onCurve) {
        const [x, y] = project(point);
        out.push(`L${fmt(x)} ${fmt(y)}`);
        i++;
        continue;
      }
      const next = points[(i + 1) % points.length];
      const end: Point = next.onCurve
        ? next
        : { x: (point.x + next.x) / 2, y: (point.y + next.y) / 2, onCurve: true };
      const [cx, cy] = project(point);
      const [ex, ey] = project(end);
      out.push(`Q${fmt(cx)} ${fmt(cy)} ${fmt(ex)} ${fmt(ey)}`);
      i += next.onCurve ? 2 : 1;
    }
    out.push("Z");
  }
  return out.join("");
}

async function main() {
  const css = await fetch(CSS_URL, { headers: { "User-Agent": LEGACY_UA } }).then((r) => r.text());
  const ttfUrl = css.match(/url\((https:\/\/[^)]+\.ttf)\)/)?.[1];
  if (!ttfUrl) throw new Error(`no .ttf url in the Google Fonts css:\n${css}`);

  const ttf = await fetch(ttfUrl);
  const buf = Buffer.from(new Uint8Array(await ttf.arrayBuffer()));
  const tables = readTables(buf);
  for (const name of ["head", "cmap", "loca", "glyf"]) {
    if (!tables.has(name)) throw new Error(`font is missing the ${name} table`);
  }

  const head = tables.get("head")!;
  const unitsPerEm = buf.readUInt16BE(head.offset + 18);
  const longLoca = buf.readInt16BE(head.offset + 50) === 1;
  const loca = tables.get("loca")!;
  const glyf = tables.get("glyf")!;

  console.log(`source: ${ttfUrl}`);
  console.log(`unitsPerEm: ${unitsPerEm}, loca format: ${longLoca ? "long" : "short"}\n`);

  const emitted: string[] = [];

  for (const letter of LETTERS) {
    const gid = glyphIdFor(buf, tables.get("cmap")!, letter.codePointAt(0)!);
    if (gid === 0) throw new Error(`no glyph for ${letter}`);

    const at = (index: number) =>
      longLoca
        ? buf.readUInt32BE(loca.offset + index * 4)
        : buf.readUInt16BE(loca.offset + index * 2) * 2;
    const start = glyf.offset + at(gid);
    if (at(gid) === at(gid + 1)) throw new Error(`${letter} has no outline`);

    const contours = readContours(buf, start);
    const xMin = buf.readInt16BE(start + 2);
    const yMin = buf.readInt16BE(start + 4);
    const xMax = buf.readInt16BE(start + 6);
    const yMax = buf.readInt16BE(start + 8);

    // Normalise to a 1000-unit em, x anchored at the glyph's left edge and y
    // left on the baseline, so the letters can be positioned by baseline the
    // way type actually sets. Round letters overshoot the cap line at both
    // ends, so aligning by bounding box instead would visibly misregister the
    // O against the M. Font space is y-up and SVG is y-down, hence the flip.
    const scale = 1000 / unitsPerEm;
    const path = contoursToPath(contours, (p) => [(p.x - xMin) * scale, -p.y * scale]);

    const fmt = (n: number) => Number((n * scale).toFixed(2));
    console.log(
      `${letter}: ${fmt(xMax - xMin)} wide, ${fmt(yMax - yMin)} tall; ` +
        `top ${fmt(-yMax)}, bottom ${fmt(-yMin)} relative to the baseline`
    );

    emitted.push(
      `/** Advance-box width of the ${letter}, per 1000-unit em. */\n` +
        `export const ${letter}_WIDTH = ${fmt(xMax - xMin)};\n\n` +
        `export const ${letter}_PATH =\n  "${path}";`
    );

    if (letter === "M") {
      // The M sits flat on the baseline, so its height is the cap height for
      // the pair. The O is drawn taller on purpose and overshoots it.
      emitted.push(`/** Cap height, per 1000-unit em. */\nexport const CAP_HEIGHT = ${fmt(yMax - yMin)};`);
    }
  }

  const out = join(process.cwd(), "src/lib/brandMarkGlyphs.ts");
  writeFileSync(
    out,
    `/**\n` +
      ` * GENERATED FILE - do not edit by hand.\n` +
      ` * Regenerate with: npx tsx scripts/extract-inter-glyphs.ts\n` +
      ` *\n` +
      ` * Inter ExtraBold outlines for the "MO" monogram, normalised to a\n` +
      ` * 1000-unit em with x at the glyph's left edge and y on the baseline.\n` +
      ` * Outlines rather than <text> so the SVG favicon renders identically\n` +
      ` * everywhere, with no dependency on an installed font.\n` +
      ` */\n\n` +
      emitted.join("\n\n") +
      "\n",
    "utf8"
  );
  console.log(`\nwrote ${out}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
