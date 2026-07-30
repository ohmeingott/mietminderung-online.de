import { NextResponse } from "next/server";
import {
  addFile,
  commitJob,
  createJob,
  deleteJob,
  getPrice,
} from "@/lib/ebrief/client";
import { ebriefKonfiguriert } from "@/lib/ebrief/token";
import { PRODUKTE, istProduktId } from "@/lib/ebrief/produkte";
import { AnschriftZuLangError, versandPdfBase64 } from "@/lib/briefPdf";
import type { VersandPdfErgebnis } from "@/lib/briefPdf";
import { clientIp, rateLimit } from "@/lib/rateLimit";

const LIMIT_PRO_STUNDE = 10;
const STUNDE_MS = 60 * 60 * 1000;

/**
 * What the price sanity check assumes the letter costs to buy. A Mängelanzeige
 * that runs longer than this is still priced as two pages here — see the note
 * at the check itself.
 */
const ANGENOMMENE_SEITEN = 2;

/**
 * The body is untrusted JSON, so every field is `unknown` rather than a
 * declared string — a number where a name belongs would otherwise pass the
 * check below and only blow up inside the PDF layout.
 */
interface Anschrift {
  name?: unknown;
  strasse?: unknown;
  plz?: unknown;
  ort?: unknown;
}

interface VorbereitenBody {
  produktId?: unknown;
  text?: unknown;
  signatureDataUrl?: unknown;
  mieter?: Anschrift & { email?: unknown };
  vermieter?: Anschrift;
}

/** A usable value: a string with something other than whitespace in it. */
function gefuellt(wert: unknown): wert is string {
  return typeof wert === "string" && wert.trim() !== "";
}

/**
 * Prepares an eBrief job up to and including the commit: the job exists and
 * eBrief's address check runs while the user can still correct things, but
 * nothing is printed and nothing is billed until POST /jobs/distribution,
 * which only happens later in the Stripe webhook.
 *
 * Everything returned to the client is an error slug, never prose — the site
 * ships in six languages and the UI translates the slugs via src/i18n.
 */
export async function POST(request: Request) {
  // No credentials means the site simply keeps working as a free download.
  if (!ebriefKonfiguriert()) {
    return NextResponse.json(
      { fehler: "versand_nicht_konfiguriert" },
      { status: 503 }
    );
  }

  if (!rateLimit(clientIp(request), LIMIT_PRO_STUNDE, STUNDE_MS)) {
    return NextResponse.json({ fehler: "zu_viele_anfragen" }, { status: 429 });
  }

  let body: VorbereitenBody;
  try {
    body = (await request.json()) as VorbereitenBody;
  } catch {
    return NextResponse.json({ fehler: "unvollstaendig" }, { status: 400 });
  }

  const { produktId, text, mieter, vermieter } = body ?? {};

  if (
    !istProduktId(produktId) ||
    !gefuellt(text) ||
    !gefuellt(mieter?.name) ||
    !gefuellt(mieter.strasse) ||
    !gefuellt(mieter.plz) ||
    !gefuellt(mieter.ort) ||
    !gefuellt(mieter.email) ||
    !gefuellt(vermieter?.name) ||
    !gefuellt(vermieter.strasse) ||
    !gefuellt(vermieter.plz) ||
    !gefuellt(vermieter.ort)
  ) {
    return NextResponse.json({ fehler: "unvollstaendig" }, { status: 400 });
  }

  const produkt = PRODUKTE[produktId];
  const istEinschreiben = produkt.ebrief.IsTracking === "true";

  // Built before the first eBrief call, so a rejected address leaves no job
  // behind that would have to be cleaned up.
  let pdf: VersandPdfErgebnis;
  try {
    pdf = versandPdfBase64({
      text,
      signatureDataUrl: gefuellt(body.signatureDataUrl)
        ? body.signatureDataUrl
        : undefined,
      absenderZeile: `${mieter.name}, ${mieter.strasse}, ${mieter.plz} ${mieter.ort}`,
      empfaenger: [
        vermieter.name,
        vermieter.strasse,
        `${vermieter.plz} ${vermieter.ort}`,
      ],
    });
  } catch (err) {
    if (err instanceof AnschriftZuLangError) {
      return NextResponse.json({ fehler: "anschrift_zu_lang" }, { status: 422 });
    }
    // Anything else here is a malformed input the validation above cannot
    // see, most plausibly a broken signature data URL. Report a slug rather
    // than letting the framework answer with an untranslatable 500.
    console.error("Dispatch PDF could not be generated", err);
    return NextResponse.json({ fehler: "pdf_fehler" }, { status: 500 });
  }

  let jobId: number | undefined;
  try {
    const job = await createJob({
      ...produkt.ebrief,
      // Address warnings must surface instead of being waved through — with
      // "true" eBrief would post to an address its own check objected to.
      SilentConfirm: "false",
      NotificationMail: mieter.email,
    });
    jobId = job.Id;

    await addFile(jobId, "maengelanzeige.pdf", pdf.base64);
    await commitJob(jobId);

    // Sanity check: if the purchase price is above what the user pays, do not
    // send rather than print at a loss. The page count is an assumption, so
    // this catches a price list change, not an unusually long letter.
    const preis = await getPrice({
      pages: ANGENOMMENE_SEITEN,
      isColor: false,
      isDuplex: false,
      isTracking: istEinschreiben,
    });
    if (preis.TotalPrice === undefined) {
      // Nothing to compare against. Not a reason to refuse the letter, but it
      // means the guard below silently did nothing, so leave a trace.
      console.error("eBrief price response carried no TotalPrice", { jobId });
    }
    const einkaufCent = Math.round((preis.TotalPrice ?? 0) * 100);
    if (einkaufCent > produkt.preisCent) {
      console.error("eBrief purchase price above sale price", {
        jobId,
        einkaufCent,
        verkaufCent: produkt.preisCent,
      });
      // Logged first and swallowed here on purpose: a failing cleanup must not
      // turn the price rejection into a generic eBrief error.
      await deleteJob(jobId).catch((deleteErr) => {
        console.error("eBrief job could not be deleted", { jobId, deleteErr });
      });
      return NextResponse.json({ fehler: "preis_unplausibel" }, { status: 409 });
    }

    return NextResponse.json({
      jobId,
      produktId,
      preisCent: produkt.preisCent,
      // So the UI can warn about what the letter parse had to infer.
      hinweise: {
        kopfErkannt: pdf.kopfErkannt,
        datumErkannt: pdf.datumErkannt,
        absenderGekuerzt: pdf.absenderGekuerzt,
      },
    });
  } catch (err) {
    console.error("eBrief prepare failed", { jobId, err });
    if (jobId !== undefined) {
      // Do not leave half-finished jobs lying around; the delete is best
      // effort, its own failure must not mask the original one.
      await deleteJob(jobId).catch((deleteErr) => {
        console.error("eBrief job could not be deleted", {
          jobId,
          deleteErr,
        });
      });
    }
    return NextResponse.json({ fehler: "ebrief_fehler" }, { status: 502 });
  }
}
