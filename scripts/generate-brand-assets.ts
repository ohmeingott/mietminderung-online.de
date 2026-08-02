/**
 * Renders every brand raster from the single geometry source in
 * src/lib/brandMark.ts.
 *
 *   npm run brand:assets            regenerate all assets
 *   npm run brand:assets -- --preview   write a contact sheet to review sizes
 *
 * There is no image-processing dependency in this project, so rasterising is
 * done by screenshotting the SVG in the Chromium that Playwright already ships
 * for the e2e suite, and the .ico container is packed by hand below.
 *
 * Output is committed. Nothing at build or request time runs this.
 */

import { chromium, type Browser } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  BRAND_MARK_ON_DARK,
  BRAND_MARK_ON_LIGHT,
  BRAND_MARK_SIZE,
  brandMarkSvg,
} from "../src/lib/brandMark";

const ROOT = process.cwd();

/** Playwright's own config falls back to this too when the pinned build is absent. */
const CHROMIUM = "/opt/pw-browsers/chromium";

const WORDMARK = { lead: "Mietminderung", suffix: "-online" };
/** Matches the header: ink-900 for the name, brand-500 for the domain suffix. */
const WORDMARK_COLOURS = { lead: "#1a1816", suffix: "#3b82f6" };

/**
 * Optical correction for the 16px and 32px favicon entries. At 16px each glyph
 * is about five pixels wide, and at the standard proportions the O's counter
 * closes up and the M's middle vertex turns to mush. Running the letters larger
 * against a tighter corner radius reopens both. Sizes at or above 48px use the
 * standard proportions - this variant is visibly heavy there.
 */
const SMALL_SIZE_VARIANT = { radius: 88, letterScale: 1.18 };
const SMALL_SIZES = new Set([16, 32]);

const markForIcoEntry = (size: number) =>
  brandMarkSvg({
    ...BRAND_MARK_ON_LIGHT,
    ...(SMALL_SIZES.has(size) ? SMALL_SIZE_VARIANT : {}),
  });

/* ------------------------------------------------------------------ *
 * Rasterising
 * ------------------------------------------------------------------ */

async function renderSvg(browser: Browser, svg: string, size: number): Promise<Buffer> {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<style>html,body{margin:0;padding:0;background:transparent}` +
      `svg{display:block;width:${size}px;height:${size}px}</style>${svg}`
  );
  const png = await page.screenshot({ omitBackground: true, type: "png" });
  await page.close();
  return png;
}

/** Pulls raw RGBA back out of a PNG, which the .ico's DIB entries need. */
async function toRgba(browser: Browser, png: Buffer, size: number): Promise<Buffer> {
  const page = await browser.newPage();
  const data = await page.evaluate(
    async ({ dataUrl, size }) => {
      const img = new Image();
      img.src = dataUrl;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      return Array.from(ctx.getImageData(0, 0, size, size).data);
    },
    { dataUrl: `data:image/png;base64,${png.toString("base64")}`, size }
  );
  await page.close();
  return Buffer.from(data);
}

/* ------------------------------------------------------------------ *
 * ICO container
 * ------------------------------------------------------------------ */

/**
 * A 32bpp BITMAPINFOHEADER image, as an .ico entry expects it: no file header,
 * the height field doubled to cover the notional AND mask, and the pixel rows
 * stored bottom-up in BGRA.
 */
function encodeDib(rgba: Buffer, size: number): Buffer {
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0); // biSize
  header.writeInt32LE(size, 4); // biWidth
  header.writeInt32LE(size * 2, 8); // biHeight: image + mask
  header.writeUInt16LE(1, 12); // biPlanes
  header.writeUInt16LE(32, 14); // biBitCount
  header.writeUInt32LE(0, 16); // biCompression = BI_RGB

  const xor = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    const srcRow = (size - 1 - y) * size * 4; // bottom-up
    const dstRow = y * size * 4;
    for (let x = 0; x < size * 4; x += 4) {
      xor[dstRow + x] = rgba[srcRow + x + 2]; // B
      xor[dstRow + x + 1] = rgba[srcRow + x + 1]; // G
      xor[dstRow + x + 2] = rgba[srcRow + x]; // R
      xor[dstRow + x + 3] = rgba[srcRow + x + 3]; // A
    }
  }

  // 1bpp AND mask, rows padded to 4 bytes. Left zeroed: with 32bpp entries the
  // alpha channel carries transparency and decoders ignore this, but the bytes
  // still have to be present and correctly sized or the entry is malformed.
  const maskRow = Math.ceil(size / 32) * 4;
  const and = Buffer.alloc(maskRow * size);

  header.writeUInt32LE(xor.length + and.length, 20); // biSizeImage
  return Buffer.concat([header, xor, and]);
}

type IcoEntry = { size: number; payload: Buffer };

function packIco(entries: IcoEntry[]): Buffer {
  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type: icon
  dir.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const records = entries.map(({ size, payload }) => {
    const rec = Buffer.alloc(16);
    rec.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    rec.writeUInt8(size >= 256 ? 0 : size, 1);
    rec.writeUInt8(0, 2); // palette size
    rec.writeUInt8(0, 3); // reserved
    rec.writeUInt16LE(1, 4); // colour planes
    rec.writeUInt16LE(32, 6); // bits per pixel
    rec.writeUInt32LE(payload.length, 8);
    rec.writeUInt32LE(offset, 12);
    offset += payload.length;
    return rec;
  });

  return Buffer.concat([dir, ...records, ...entries.map((e) => e.payload)]);
}

/** Re-reads what we just wrote and fails loudly if it is not a valid container. */
function assertValidIco(buf: Buffer, expected: number[]) {
  if (buf.readUInt16LE(0) !== 0 || buf.readUInt16LE(2) !== 1) throw new Error("bad ICONDIR");
  const count = buf.readUInt16LE(4);
  if (count !== expected.length) throw new Error(`expected ${expected.length} entries, got ${count}`);
  for (let i = 0; i < count; i++) {
    const rec = 6 + i * 16;
    const size = buf.readUInt8(rec) || 256;
    if (size !== expected[i]) throw new Error(`entry ${i}: expected ${expected[i]}px, got ${size}`);
    const length = buf.readUInt32LE(rec + 8);
    const offset = buf.readUInt32LE(rec + 12);
    if (offset + length > buf.length) throw new Error(`entry ${i} runs past the end of the file`);
  }
}

/* ------------------------------------------------------------------ *
 * Wordmark lock-up
 * ------------------------------------------------------------------ */

/** A full UA string, or Google Fonts serves TTF rather than woff2. */
const MODERN_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Inter, inlined as a data URI so the render never depends on the page itself
 * reaching gstatic. Google splits the family across unicode-range subsets; the
 * wordmark is plain ASCII, so only the latin one is needed.
 */
async function interWoff2(weight: number): Promise<string> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`,
    { headers: { "User-Agent": MODERN_UA } }
  ).then((r) => r.text());

  const url = css.match(/\/\*\s*latin\s*\*\/[^}]*?url\((https:\/\/[^)]+\.woff2)\)/)?.[1];
  if (!url) throw new Error(`no latin woff2 for Inter ${weight} in:\n${css.slice(0, 400)}`);

  const font = await fetch(url);
  const bytes = Buffer.from(new Uint8Array(await font.arrayBuffer()));
  return `data:font/woff2;base64,${bytes.toString("base64")}`;
}

/**
 * The full lock-up: mark plus wordmark, on transparency. Used for the
 * schema.org Organization logo and anywhere the brand needs to appear as a
 * single image.
 */
async function renderLockup(browser: Browser): Promise<Buffer> {
  const font = await interWoff2(700);
  const mark = brandMarkSvg(BRAND_MARK_ON_LIGHT);

  const page = await browser.newPage({
    viewport: { width: 1400, height: 400 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`
    <style>
      @font-face {
        font-family: 'Inter';
        font-weight: 700;
        font-style: normal;
        src: url(${font}) format('woff2');
      }
      html, body { margin: 0; padding: 0; background: transparent; }
      #lockup {
        display: inline-flex; align-items: center; gap: 40px; padding: 24px;
        font-family: 'Inter'; font-weight: 700; font-size: 168px;
        letter-spacing: -0.02em; line-height: 1; white-space: nowrap;
      }
      #lockup svg { display: block; width: 200px; height: 200px; }
      .lead { color: ${WORDMARK_COLOURS.lead}; }
      .suffix { color: ${WORDMARK_COLOURS.suffix}; }
    </style>
    <div id="lockup">
      ${mark}
      <span><span class="lead">${WORDMARK.lead}</span><span class="suffix">${WORDMARK.suffix}</span></span>
    </div>
  `);
  await page.evaluate(() => document.fonts.ready);
  const png = await page.locator("#lockup").screenshot({ omitBackground: true });
  await page.close();
  return png;
}

/* ------------------------------------------------------------------ *
 * Preview contact sheet
 * ------------------------------------------------------------------ */

async function renderPreview(browser: Browser): Promise<Buffer> {
  const light = brandMarkSvg(BRAND_MARK_ON_LIGHT);
  const dark = brandMarkSvg(BRAND_MARK_ON_DARK);
  const at = (svg: string, px: number) =>
    svg.replace(`width="${BRAND_MARK_SIZE}" height="${BRAND_MARK_SIZE}"`, `width="${px}" height="${px}"`);

  // Rasterise the small sizes for real, then blow the bitmaps up with nearest
  // neighbour. Scaling the vector instead would just re-render it smoothly and
  // hide exactly the pixel-grid problems this sheet exists to catch.
  const zooms: string[] = [];
  for (const px of [16, 32]) {
    const raster = await renderSvg(browser, markForIcoEntry(px), px);
    zooms.push(`<div class="col"><span>${px}px as shipped, 8x</span>
      <img class="zoom" width="${px * 8}" height="${px * 8}"
           src="data:image/png;base64,${raster.toString("base64")}"></div>`);
  }

  const page = await browser.newPage({
    viewport: { width: 1180, height: 400 },
    deviceScaleFactor: 2,
  });
  await page.setContent(`
    <style>
      body { margin:0; background:#fbfaf8; font:12px/1.4 system-ui; padding:28px;
             display:flex; gap:30px; align-items:flex-end; }
      .col { display:flex; flex-direction:column; gap:10px; align-items:center; }
      .navy { background:#172554; padding:14px; border-radius:10px; }
      .zoom { image-rendering: pixelated; }
      svg { display:block; }
    </style>
    <div class="col"><span>180</span>${at(light, 180)}</div>
    <div class="col"><span>48</span>${at(light, 48)}</div>
    <div class="col"><span>32</span>${at(light, 32)}</div>
    <div class="col"><span>16</span>${at(light, 16)}</div>
    ${zooms.join("")}
    <div class="col"><span>footer navy</span><div class="navy">${at(dark, 32)}</div></div>
  `);
  const png = await page.screenshot();
  await page.close();
  return png;
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

function write(relative: string, data: Buffer | string) {
  const path = join(ROOT, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
  const size = typeof data === "string" ? Buffer.byteLength(data) : data.length;
  console.log(`  ${relative.padEnd(34)} ${(size / 1024).toFixed(1)} KB`);
}

async function main() {
  const preview = process.argv.includes("--preview");
  const browser = await chromium.launch({ executablePath: CHROMIUM });

  try {
    if (preview) {
      write("brand-preview.png", await renderPreview(browser));
      console.log("\npreview only, no assets written");
      return;
    }

    console.log("brand assets:");

    /*
     * Everything lands in public/ and nothing in src/app/. The app/ file
     * convention appends a version query to the emitted <link href> and derives
     * the `sizes` attribute from the file itself, and neither is what Google's
     * SERP favicon crawler wants to see. Serving from public/ keeps the URLs
     * bare and stable and leaves `sizes` for layout.tsx to declare.
     */

    // Vector favicon. Modern browsers prefer this over the .ico.
    write("public/icon.svg", brandMarkSvg(BRAND_MARK_ON_LIGHT));

    /*
     * .ico for legacy browsers, all three entries as DIB for the widest
     * compatibility.
     *
     * 48 is the largest on purpose. Google only shows a favicon whose size is a
     * multiple of 48px, and it reads the largest entry in the container, so the
     * 256px PNG entry this used to carry disqualified the whole file. The SVG
     * above is what actually serves high-DPI browser tabs, so nothing needs the
     * .ico to go above 48.
     */
    const icoSizes = [16, 32, 48];
    const entries: IcoEntry[] = [];
    for (const size of icoSizes) {
      const png = await renderSvg(browser, markForIcoEntry(size), size);
      entries.push({ size, payload: encodeDib(await toRgba(browser, png, size), size) });
    }
    const ico = packIco(entries);
    assertValidIco(ico, icoSizes);
    write("public/favicon.ico", ico);

    // Touch icon: full-bleed square, iOS rounds it itself and composites onto
    // black, so it must not carry its own corners or transparency.
    write(
      "public/apple-touch-icon.png",
      await renderSvg(browser, brandMarkSvg({ ...BRAND_MARK_ON_LIGHT, radius: 0 }), 180)
    );

    // 192 is 4x48, so this doubles as the PNG favicon Google is offered in
    // layout.tsx next to the .ico and the SVG.
    write("public/icon-192.png", await renderSvg(browser, brandMarkSvg(BRAND_MARK_ON_LIGHT), 192));
    write("public/icon-512.png", await renderSvg(browser, brandMarkSvg(BRAND_MARK_ON_LIGHT), 512));
    write(
      "public/icon-maskable-512.png",
      await renderSvg(
        browser,
        brandMarkSvg({ ...BRAND_MARK_ON_LIGHT, radius: 0, letterScale: 0.72 }),
        512
      )
    );

    write("public/logo.png", await renderLockup(browser));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
