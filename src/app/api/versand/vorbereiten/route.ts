import { NextResponse } from "next/server";
import {
  addFile,
  commitJob,
  createJob,
  deleteJob,
  getPrice,
} from "@/lib/ebrief/client";
import { ebriefKonfiguriert } from "@/lib/ebrief/token";
import { versandToken, versandTokenKonfiguriert } from "@/lib/versandToken";
import { PRODUKTE, istProduktId } from "@/lib/ebrief/produkte";
import { AnschriftZuLangError, versandPdfBase64 } from "@/lib/briefPdf";
import type { VersandPdfErgebnis } from "@/lib/briefPdf";
import { clientIp, rateLimit } from "@/lib/rateLimit";

const LIMIT_PRO_STUNDE = 10;
const STUNDE_MS = 60 * 60 * 1000;

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

/** eBrief job attributes are strings; the price endpoint wants real booleans. */
function janein(wert: "true" | "false"): boolean {
  return wert === "true";
}

/**
 * Best-effort cleanup of a job that must not go out. Its own failure is
 * logged and swallowed: it must never replace the error that led here, nor
 * turn a specific refusal into a generic one.
 */
async function verwerfeJob(jobId: number): Promise<void> {
  try {
    await deleteJob(jobId);
  } catch (deleteErr) {
    console.error("eBrief job could not be deleted", { jobId, deleteErr });
  }
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
  // No credentials, or no secret to sign the job tokens with, means the site
  // simply keeps working as a free download. Refusing without the secret is
  // deliberate: the follow-up routes are only safe because of the token, so a
  // job that cannot be handed one must not be created in the first place.
  if (!ebriefKonfiguriert() || !versandTokenKonfiguriert()) {
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
    // send rather than print at a loss. Every input mirrors what the job was
    // actually created with — the real rendered page count, because a long
    // Mängelanzeige can run past the three-sheet standard-letter bracket where
    // the price steps up sharply, and the catalogue's own attributes, so that
    // a future colour or duplex product cannot be priced as mono simplex.
    const preis = await getPrice({
      pages: pdf.seiten,
      isColor: janein(produkt.ebrief.IsColor),
      isDuplex: janein(produkt.ebrief.IsDuplex),
      isTracking: janein(produkt.ebrief.IsTracking),
    });
    if (preis.TotalPrice === undefined) {
      // Nothing to compare against. Not a reason to refuse the letter, but it
      // means the guard below silently did nothing, so leave a trace.
      console.error("eBrief price response carried no TotalPrice", { jobId });
    }
    // ASSUMPTION, NOT YET VERIFIED AGAINST THE LIVE API: TotalPrice is euros,
    // so cents are ×100. If it is already cents, every letter is rejected as
    // "preis_unplausibel" (8800 vs 249) and the feature looks broken rather
    // than misconfigured — hence the raw envelope in the rejection log below,
    // which settles the unit on the first staging run.
    const einkaufCent = Math.round((preis.TotalPrice ?? 0) * 100);
    if (einkaufCent > produkt.preisCent) {
      console.error("eBrief purchase price above sale price", {
        jobId,
        seiten: pdf.seiten,
        einkaufCent,
        verkaufCent: produkt.preisCent,
        // Raw, so the euros-vs-cents question is answerable from the log alone.
        preisRoh: preis,
      });
      // Logged before the cleanup runs, so the numbers survive even if the
      // delete fails.
      await verwerfeJob(jobId);
      return NextResponse.json({ fehler: "preis_unplausibel" }, { status: 409 });
    }

    return NextResponse.json({
      jobId,
      // Capability token for GET /api/versand/status and
      // /api/versand/adressvorschau — those routes are unauthenticated and
      // eBrief's job ids are small sequential integers, so without it the
      // letters would be reachable by counting upwards.
      token: versandToken(jobId),
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
    // Do not leave a half-finished job behind. Nothing was distributed, so it
    // costs nothing, but it would otherwise linger until something reaps it.
    if (jobId !== undefined) await verwerfeJob(jobId);
    return NextResponse.json({ fehler: "ebrief_fehler" }, { status: 502 });
  }
}
