import { timingSafeEqual } from "node:crypto";

/**
 * The authorisation gate in front of every cron route.
 *
 * Vercel Cron sends exactly `Authorization: Bearer <CRON_SECRET>`. Compared
 * over the whole header value in constant time, the same way
 * src/lib/versandToken.ts compares its signatures.
 *
 * One copy rather than one per route, for the same reason the checkout route
 * borrows `pruefeZugang` instead of re-implementing the HMAC check: a second
 * copy is free to drift, and these routes are only out of reach as long as
 * every one of them agrees on what a valid call looks like. An empty secret
 * authorises nothing — callers refuse before they get here, but a gate that
 * waves everything through when unconfigured is worth ruling out twice.
 *
 * Requires the nodejs runtime: node:crypto does not exist on the edge runtime.
 */
export function cronAutorisiert(request: Request, secret: string): boolean {
  if (!secret) return false;

  const kopf = request.headers.get("authorization");
  if (!kopf) return false;

  const erwartet = Buffer.from(`Bearer ${secret}`, "utf8");
  const geliefert = Buffer.from(kopf, "utf8");
  // timingSafeEqual throws on differing lengths. Returning early leaks the
  // length of the secret, not its content.
  if (erwartet.length !== geliefert.length) return false;
  return timingSafeEqual(erwartet, geliefert);
}
