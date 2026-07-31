import { neon } from "@neondatabase/serverless";

/**
 * Neon Postgres access, server-side only. The client is constructed lazily
 * inside the accessor — never at module scope — because CI builds and runs
 * e2e without DATABASE_URL, and Next collects route metadata at build time.
 * Callers must handle `null` (database not configured) gracefully.
 */

export type Sql = ReturnType<typeof neon>;

let cached: Sql | null = null;

export function getDb(): Sql | null {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  if (!cached) cached = neon(url);
  return cached;
}
