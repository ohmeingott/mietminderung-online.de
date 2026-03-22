/**
 * In-memory idempotency store to prevent duplicate operations.
 * In production, replace with Redis or a database-backed store.
 */

interface IdempotencyEntry {
  result: unknown;
  createdAt: number;
}

const store = new Map<string, IdempotencyEntry>();

const TTL_MS = 60 * 60 * 1000; // 1 hour

// Cleanup expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.createdAt > TTL_MS) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Check if a request with this key was already processed.
 * Returns the cached result if found, or null.
 */
export function getIdempotentResult(key: string): unknown | null {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() - entry.createdAt > TTL_MS) {
    store.delete(key);
    return null;
  }

  return entry.result;
}

/**
 * Store the result of a processed request for deduplication.
 */
export function setIdempotentResult(key: string, result: unknown): void {
  store.set(key, { result, createdAt: Date.now() });
}
