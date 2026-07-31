import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withinRateLimit } from "@/lib/rateLimit";

/**
 * Anonymous funnel events. What is stored: event name, UI locale, and a
 * random session UUID that exists only in the page's memory (never in a
 * cookie or localStorage — no § 25 TDDDG storage access). What is NOT
 * stored: IP, user agent, referrer, or any case reference. The user agent
 * is inspected once to drop obvious bots, then discarded.
 *
 * Always answers 204 — tracking must never surface errors to the user.
 */

const VALID_EVENTS = new Set([
  "check_started",
  "eligibility_done",
  "defects_selected",
  "rent_entered",
  "result_viewed",
  "letter_started",
  "letter_completed",
  "pdf_downloaded",
  "case_saved",
]);

const VALID_LOCALES = new Set(["de", "en", "tr", "ru", "uk", "ar", "pl"]);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const BOT_PATTERN = /bot|crawl|spider|headless|lighthouse|preview/i;

const MAX_EVENTS_PER_SESSION = 40;

export async function POST(request: NextRequest) {
  const done = new NextResponse(null, { status: 204 });
  try {
    const sql = getDb();
    if (!sql) return done;

    const ua = request.headers.get("user-agent") || "";
    if (BOT_PATTERN.test(ua)) return done;

    if (!(await withinRateLimit("track", request, 60, 3600))) return done;

    const body = (await request.json()) as {
      event?: unknown;
      sessionId?: unknown;
      locale?: unknown;
    };
    const event = String(body.event ?? "");
    const sessionId = String(body.sessionId ?? "").toLowerCase();
    const locale = String(body.locale ?? "");
    if (
      !VALID_EVENTS.has(event) ||
      !UUID_PATTERN.test(sessionId) ||
      !VALID_LOCALES.has(locale)
    ) {
      return done;
    }

    await sql`
      insert into funnel_events (session_id, event, locale)
      select ${sessionId}, ${event}, ${locale}
      where (select count(*) from funnel_events where session_id = ${sessionId})
            < ${MAX_EVENTS_PER_SESSION}
    `;
    return done;
  } catch {
    return done;
  }
}
