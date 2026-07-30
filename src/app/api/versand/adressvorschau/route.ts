import { NextResponse } from "next/server";
import { getFileWithMark } from "@/lib/ebrief/client";
import { ebriefKonfiguriert } from "@/lib/ebrief/token";

/** Accepts a positive integer id only — "0", "-1", "1.5" and "1e3" are not ids. */
function parseId(wert: string | null): number | null {
  if (wert === null || !/^\d+$/.test(wert)) return null;
  const id = Number(wert);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/**
 * Streams eBrief's own rendering of the document back to the browser, with the
 * address zone it detected marked up. That is what lets the user see, before
 * paying, whether eBrief read the right address — especially after
 * /api/versand/status has reported "adresse_warnung".
 *
 * The docId comes from that same status response. Errors are slugs, never
 * prose — the site ships in six languages and the UI translates them.
 */
export async function GET(request: Request) {
  // No credentials means the site simply keeps working as a free download.
  if (!ebriefKonfiguriert()) {
    return NextResponse.json(
      { fehler: "versand_nicht_konfiguriert" },
      { status: 503 }
    );
  }

  const docId = parseId(new URL(request.url).searchParams.get("docId"));
  if (docId === null) {
    return NextResponse.json({ fehler: "docId_ungueltig" }, { status: 400 });
  }

  try {
    const pdf = await getFileWithMark(docId);
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        // A letter carrying the user's own address has no business in any
        // cache between here and the browser.
        "Cache-Control": "no-store",
        "Content-Length": String(pdf.byteLength),
      },
    });
  } catch (err) {
    console.error("eBrief address preview failed", { docId, err });
    return NextResponse.json({ fehler: "ebrief_fehler" }, { status: 502 });
  }
}
