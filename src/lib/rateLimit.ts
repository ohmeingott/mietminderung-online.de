import { createHash } from "crypto";
import { getDb } from "@/lib/db";

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
