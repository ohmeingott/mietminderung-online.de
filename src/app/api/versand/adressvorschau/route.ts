import { NextResponse } from "next/server";
import { getFileWithMark, getJob } from "@/lib/ebrief/client";
import { ebriefKonfiguriert } from "@/lib/ebrief/token";
import { pruefeZugang, versandTokenKonfiguriert } from "@/lib/versandToken";
import { clientIp, rateLimit } from "@/lib/rateLimit";

/**
 * Tight. Unlike the status route this is not polled — the user opens the
 * preview, looks at it, and maybe reloads it a couple of times.
 */
const LIMIT_PRO_STUNDE = 20;
const STUNDE_MS = 60 * 60 * 1000;

/**
 * Streams eBrief's own rendering of the document back to the browser, with the
 * address zone it detected marked up (per the API specification an image of the
 * first page, not a PDF). That is what lets the user see, before paying,
 * whether eBrief read the right address — especially after
 * /api/versand/status has reported "adresse_warnung".
 *
 * Deliberately takes the signed jobId and resolves the document itself rather
 * than accepting a docId: this route hands out the letter, which carries the
 * tenant's name and address, the landlord's address, the defect description
 * and the signature. A free-form docId parameter would leave all of that
 * reachable by counting upwards, no matter how well the jobId were protected.
 *
 * Errors are slugs, never prose — the site ships in six languages and the UI
 * translates them.
 */
export async function GET(request: Request) {
  // No credentials, or no secret to check tokens with, means the site simply
  // keeps working as a free download.
  if (!ebriefKonfiguriert() || !versandTokenKonfiguriert()) {
    return NextResponse.json(
      { fehler: "versand_nicht_konfiguriert" },
      { status: 503 }
    );
  }

  const zugang = pruefeZugang(request);
  if (!zugang.ok) {
    return NextResponse.json(
      { fehler: zugang.fehler },
      { status: zugang.status }
    );
  }

  // Namespaced, so the status route's polling cannot eat this allowance —
  // the limiter is keyed by string alone and would otherwise share a bucket.
  if (!rateLimit(`vorschau:${clientIp(request)}`, LIMIT_PRO_STUNDE, STUNDE_MS)) {
    return NextResponse.json({ fehler: "zu_viele_anfragen" }, { status: 429 });
  }

  const { jobId } = zugang;
  try {
    const job = await getJob(jobId);
    const docId = job.Documents?.[0]?.Id;
    if (docId === undefined) {
      // eBrief has not produced the document yet. Not an error — the UI should
      // keep polling the status route and offer the preview once it is there.
      return NextResponse.json({ fehler: "kein_dokument" }, { status: 404 });
    }

    const datei = await getFileWithMark(docId);
    return new NextResponse(datei.bytes, {
      headers: {
        // Whatever eBrief sent, not what we hoped for: the specification
        // describes this endpoint as returning a PNG of the first page, so
        // declaring "application/pdf" here would hand the browser a file it
        // refuses to display.
        "Content-Type": datei.contentType,
        // A letter carrying the user's own address has no business in any
        // cache between here and the browser.
        "Cache-Control": "no-store",
        "Content-Length": String(datei.bytes.byteLength),
      },
    });
  } catch (err) {
    console.error("eBrief address preview failed", { jobId, err });
    return NextResponse.json({ fehler: "ebrief_fehler" }, { status: 502 });
  }
}
