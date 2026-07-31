import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Capability tokens for a dispatch job.
 *
 * eBrief hands out small sequential job ids, and the two GET routes under
 * /api/versand are unauthenticated. Without a token, walking the integers
 * would reveal every job in the account and — via the address preview — the
 * letters themselves, which carry the tenant's name and address, the
 * landlord's address, the defect description and the signature.
 *
 * So POST /api/versand/vorbereiten issues a token for the job it just created
 * and the GET routes refuse to answer without it. The token is an HMAC, not a
 * lookup key: no server-side store is needed, which matters because the app
 * runs on Fluid Compute where a request may land on any instance.
 *
 * The expiry is inside the signed payload, so a leaked URL stops working on
 * its own and a client that edits the timestamp to buy more time only breaks
 * the signature.
 */

/** Generous for a checkout flow, short enough that a leaked link goes stale. */
const GUELTIGKEIT_MS = 60 * 60 * 1000;

/**
 * Without a secret no token can be signed or checked. Callers must treat this
 * as "dispatch is not configured" and refuse the request — a check that
 * silently passes everything when unconfigured is worse than no check at all.
 */
export function versandTokenKonfiguriert(): boolean {
  return Boolean(process.env.VERSAND_TOKEN_SECRET);
}

function geheimnis(): string {
  const wert = process.env.VERSAND_TOKEN_SECRET;
  // Unreachable behind versandTokenKonfiguriert(), but throwing beats signing
  // with an empty key if a future caller forgets the gate.
  if (!wert) throw new Error("VERSAND_TOKEN_SECRET is not set");
  return wert;
}

/** The jobId is bound into the payload, so a token cannot be reused for another job. */
function signatur(jobId: number, ablauf: number): string {
  return createHmac("sha256", geheimnis())
    .update(`${jobId}.${ablauf}`)
    .digest("hex");
}

export function versandToken(jobId: number, jetzt = Date.now()): string {
  const ablauf = jetzt + GUELTIGKEIT_MS;
  return `${ablauf}.${signatur(jobId, ablauf)}`;
}

function tokenGueltig(jobId: number, token: string, jetzt: number): boolean {
  const trenner = token.indexOf(".");
  if (trenner < 0) return false;

  const ablaufRoh = token.slice(0, trenner);
  const gegeben = token.slice(trenner + 1);
  if (!/^\d+$/.test(ablaufRoh)) return false;

  const ablauf = Number(ablaufRoh);
  if (!Number.isSafeInteger(ablauf)) return false;

  const erwartet = Buffer.from(signatur(jobId, ablauf), "utf8");
  const geliefert = Buffer.from(gegeben, "utf8");
  // timingSafeEqual throws on differing lengths. Returning early here leaks
  // nothing: the signature is a fixed-width hex digest, so its length is
  // public and carries no secret.
  if (erwartet.length !== geliefert.length) return false;
  if (!timingSafeEqual(erwartet, geliefert)) return false;

  // Only now is the expiry trustworthy — it was just covered by the signature.
  return jetzt < ablauf;
}

/** Accepts a positive integer id only — "0", "-1", "1.5" and "1e3" are not ids. */
function parseId(wert: string | null): number | null {
  if (wert === null || !/^\d+$/.test(wert)) return null;
  const id = Number(wert);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export type ZugangsPruefung =
  | { ok: true; jobId: number }
  | { ok: false; fehler: "jobId_ungueltig" | "token_ungueltig"; status: number };

/**
 * The whole entry check for a dispatch GET route: a well-formed jobId plus a
 * live token issued for exactly that job. Shared so the status route and the
 * address preview cannot drift apart — a gap between them would put the
 * letter PDF back within reach of anyone counting upwards.
 */
export function pruefeZugang(request: Request): ZugangsPruefung {
  const params = new URL(request.url).searchParams;

  const jobId = parseId(params.get("jobId"));
  if (jobId === null) {
    return { ok: false, fehler: "jobId_ungueltig", status: 400 };
  }

  const token = params.get("token");
  if (!token || !tokenGueltig(jobId, token, Date.now())) {
    return { ok: false, fehler: "token_ungueltig", status: 403 };
  }

  return { ok: true, jobId };
}
