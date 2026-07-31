import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withinRateLimit } from "@/lib/rateLimit";
import { hashToken, isPlausibleConfirmToken } from "@/lib/tokens";

/**
 * Double-opt-in confirmation. Only ever called from an explicit button
 * click on /fall/bestaetigen — never on page load, so link-prefetching
 * mail scanners cannot confirm an opt-in.
 *
 * Unknown tokens get a generic 410 (no enumeration signal).
 */
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    if (!(await withinRateLimit("confirm", request, 20, 3600))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const { token } = (await request.json()) as { token?: unknown };
    if (!isPlausibleConfirmToken(token)) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 410 });
    }

    const rows = (await sql`
      update cases
      set status = 'active',
          consent_reminder_confirmed_at = now(),
          confirm_token_hash = null
      where confirm_token_hash = ${hashToken(token)}
        and status = 'pending_confirmation'
      returning id, deadline_date
    `) as Array<{ id: string; deadline_date: string }>;

    if (rows.length === 0) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 410 });
    }

    return NextResponse.json({ ok: true, deadlineDate: rows[0].deadline_date });
  } catch (err) {
    console.error("case confirm error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
