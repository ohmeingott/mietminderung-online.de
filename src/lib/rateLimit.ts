import { createHash } from "crypto";
import { getDb } from "@/lib/db";

/**
 * Two limiters live here, because the two callers have genuinely different
 * needs and were built independently:
 *
 * - `rateLimit` counts in process memory. The dispatch routes use it, and
 *   they must keep working when no database is configured at all — dispatch
 *   depends on eBrief and Stripe, not on Postgres.
 * - `withinRateLimit` counts in Postgres. The case-storage routes use it,
 *   they already require the database, and a shared counter is the stronger
 *   guard on serverless.
 *
 * Unifying them is worth doing, but not inside a merge: moving dispatch onto
 * the database limiter would make it fail open whenever the database is
 * absent, which is precisely the configuration dispatch is meant to survive.
 */

/* -------------------------------------------------------------------------
 * In-process limiter — dispatch routes
 * ---------------------------------------------------------------------- */

/**
 * Best-effort limiting in process memory. On Fluid Compute several requests
 * share an instance but there are several instances, so this is not a hard
 * guard — it only slows down obvious hammering. A hard limit would need an
 * external counter, which is not worth it here because nothing is printed and
 * nothing is billed before distribution.
 */
interface Eintrag {
  /** Timestamps of the accepted requests still inside the window. */
  zeiten: number[];
  /**
   * When the newest of those timestamps leaves its window — from then on the
   * entry carries no information and can be dropped. Stored per entry instead
   * of recomputed while sweeping so that callers using different windows
   * cannot expire each other's keys.
   */
  verfaelltAm: number;
}

const treffer = new Map<string, Eintrag>();

/**
 * Timestamps are only filtered when the same key is read again, so a key
 * nobody revisits is never reclaimed: every crawler, scanner and one-off
 * visitor would hold an entry for the life of the instance. This sweep is
 * what actually bounds the map. It runs at most once a minute, so it stays
 * cheap even when every entry is still live and nothing gets deleted.
 */
const AUFRAEUM_INTERVALL_MS = 60 * 1000;
let letzteAufraeumung = 0;

function raeumeAuf(jetzt: number): void {
  letzteAufraeumung = jetzt;
  for (const [schluessel, eintrag] of treffer) {
    if (jetzt >= eintrag.verfaelltAm) treffer.delete(schluessel);
  }
}

export function rateLimit(schluessel: string, limit: number, fensterMs: number): boolean {
  const jetzt = Date.now();
  if (jetzt - letzteAufraeumung >= AUFRAEUM_INTERVALL_MS) raeumeAuf(jetzt);

  const bisher = (treffer.get(schluessel)?.zeiten ?? []).filter(
    (t) => jetzt - t < fensterMs
  );

  if (bisher.length >= limit) {
    // The rejected request is deliberately not recorded: being blocked must
    // not extend the block, or a client polling steadily would never recover.
    treffer.set(schluessel, {
      zeiten: bisher,
      verfaelltAm: bisher[bisher.length - 1] + fensterMs,
    });
    return false;
  }

  bisher.push(jetzt);
  treffer.set(schluessel, { zeiten: bisher, verfaelltAm: jetzt + fensterMs });
  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unbekannt";
}

/* -------------------------------------------------------------------------
 * Postgres-backed limiter — case storage routes
 * ---------------------------------------------------------------------- */

/**
 * Fixed-window rate limiting backed by Postgres (in-memory state does not
 * survive serverless invocations). The bucket key contains only a salted,
 * truncated hash of the IP; rows are purged after 24 h by the cron, so no
 * lasting IP storage occurs.
 */
function clientIpHash(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  const salt = process.env.RATE_LIMIT_SALT || "";
  return createHash("sha256").update(`${ip}${salt}`).digest("hex").slice(0, 16);
}

/**
 * Returns true when the request is within the limit. Fails open when the
 * database is unavailable — the calculator must never break because the
 * limiter is down.
 */
export async function withinRateLimit(
  route: string,
  request: Request,
  maxHits: number,
  windowSeconds: number,
): Promise<boolean> {
  const sql = getDb();
  if (!sql) return true;
  const windowStart =
    Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds;
  const key = `${route}:${clientIpHash(request)}:${windowStart}`;
  try {
    const rows = (await sql`
      insert into rate_limits (bucket_key)
      values (${key})
      on conflict (bucket_key) do update set hits = rate_limits.hits + 1
      returning hits
    `) as Array<{ hits: number }>;
    return (rows[0]?.hits ?? 1) <= maxHits;
  } catch {
    return true;
  }
}
