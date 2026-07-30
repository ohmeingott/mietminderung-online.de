"use client";

/**
 * Anonymous funnel tracking. The session id is generated per page load and
 * lives only in this module's memory — it is never written to cookies or
 * localStorage (no § 25 TDDDG storage access) and dies with the page.
 * Failures are silently ignored; automated browsers (Playwright) are
 * skipped so e2e runs never pollute the data.
 */

export type FunnelEvent =
  | "check_started"
  | "eligibility_done"
  | "defects_selected"
  | "rent_entered"
  | "result_viewed"
  | "letter_started"
  | "letter_completed"
  | "pdf_downloaded"
  | "case_saved";

let sessionId: string | null = null;
const seen = new Set<string>();

export function track(event: FunnelEvent, locale: string): void {
  try {
    if (typeof window === "undefined") return;
    if (navigator.webdriver) return;
    if (!sessionId) {
      if (typeof crypto === "undefined" || !crypto.randomUUID) return;
      sessionId = crypto.randomUUID();
    }
    // Each step is only interesting once per page load.
    if (seen.has(event)) return;
    seen.add(event);

    const payload = JSON.stringify({ event, sessionId, locale });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Tracking must never break the app.
  }
}
