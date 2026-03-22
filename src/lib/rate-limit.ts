/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach per IP address.
 */

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter(
      (t) => now - t < 5 * 60 * 1000
    );
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(identifier) || { timestamps: [] };

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter(
    (t) => now - t < options.windowMs
  );

  if (entry.timestamps.length >= options.maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = oldestInWindow + options.windowMs - now;
    return { allowed: false, retryAfterMs };
  }

  entry.timestamps.push(now);
  store.set(identifier, entry);
  return { allowed: true, retryAfterMs: 0 };
}

export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
