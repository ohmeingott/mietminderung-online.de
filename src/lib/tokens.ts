import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

/**
 * Two token kinds secure the email links (server-only module):
 *
 * CONFIRM tokens (double opt-in) are single-use 256-bit random values; only
 * the SHA-256 digest is stored, and it is nulled after the click.
 *
 * MANAGE tokens (status buttons, withdrawal) are stateless HMAC signatures
 * over the case id — `<uuid>.<sig>` — so the daily cron can mint fresh
 * links for reminder emails without storing any reversible secret in the
 * database. Deleting the case row revokes all its links; a database leak
 * without the env secret yields nothing clickable.
 */

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function generateConfirmToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Shape check before hitting the database — rejects garbage cheaply. */
export function isPlausibleConfirmToken(token: unknown): token is string {
  return typeof token === "string" && /^[A-Za-z0-9_-]{40,50}$/.test(token);
}

function manageSecret(): string | null {
  return process.env.CASE_TOKEN_SECRET || null;
}

export function tokensConfigured(): boolean {
  return manageSecret() !== null;
}

function signCaseId(caseId: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`manage:${caseId}`)
    .digest("base64url");
}

export function createManageToken(caseId: string): string | null {
  const secret = manageSecret();
  if (!secret) return null;
  return `${caseId}.${signCaseId(caseId, secret)}`;
}

/** Returns the case id when the signature checks out, otherwise null. */
export function verifyManageToken(token: unknown): string | null {
  const secret = manageSecret();
  if (!secret || typeof token !== "string" || token.length > 120) return null;
  const dot = token.indexOf(".");
  if (dot === -1) return null;
  const caseId = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!UUID_PATTERN.test(caseId)) return null;
  const expected = signCaseId(caseId, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return caseId;
}
