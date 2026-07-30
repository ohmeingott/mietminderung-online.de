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
