/**
 * Database-backed idempotency store to prevent duplicate operations.
 * Uses PostgreSQL via Prisma for persistence across server restarts
 * and multiple serverless instances.
 */

import { prisma } from "./db";

const TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check if a request with this key was already processed.
 * Returns the cached result if found, or null.
 */
export async function getIdempotentResult(key: string): Promise<unknown | null> {
  const entry = await prisma.idempotencyKey.findUnique({
    where: { key },
  });

  if (!entry) return null;

  if (new Date() > entry.expiresAt) {
    await prisma.idempotencyKey.delete({ where: { key } }).catch(() => {});
    return null;
  }

  return entry.result;
}

/**
 * Store the result of a processed request for deduplication.
 */
export async function setIdempotentResult(key: string, result: unknown): Promise<void> {
  await prisma.idempotencyKey.upsert({
    where: { key },
    update: { result: result as object, expiresAt: new Date(Date.now() + TTL_MS) },
    create: {
      key,
      result: result as object,
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  });
}

/**
 * Remove expired idempotency keys. Call periodically (e.g. via cron).
 */
export async function cleanupExpiredKeys(): Promise<number> {
  const { count } = await prisma.idempotencyKey.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return count;
}
