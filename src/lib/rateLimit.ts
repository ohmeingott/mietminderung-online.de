/**
 * Best-effort limiting in process memory. On Fluid Compute several requests
 * share an instance but there are several instances, so this is not a hard
 * guard — it only slows down obvious hammering. A hard limit would need an
 * external counter, which is not worth it here because nothing is printed and
 * nothing is billed before distribution.
 */
const treffer = new Map<string, number[]>();

export function rateLimit(schluessel: string, limit: number, fensterMs: number): boolean {
  const jetzt = Date.now();
  const bisher = (treffer.get(schluessel) ?? []).filter((t) => jetzt - t < fensterMs);
  if (bisher.length >= limit) {
    treffer.set(schluessel, bisher);
    return false;
  }
  bisher.push(jetzt);
  treffer.set(schluessel, bisher);
  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unbekannt";
}
