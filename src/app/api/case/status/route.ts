import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withinRateLimit } from "@/lib/rateLimit";
import { verifyManageToken } from "@/lib/tokens";

const ACTION_TO_STATUS: Record<string, string> = {
  behoben: "responded",
  teilweise: "partly_resolved",
  keine: "no_response",
};

/**
 * One-click landlord-response status from the reminder email. Users may
 * correct themselves (e.g. "keine" then later "behoben"), so transitions
 * between the three answer states are allowed; pending/lawyer/closed
 * states are never overwritten.
 */
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    if (!(await withinRateLimit("status", request, 30, 3600))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const { token, action } = (await request.json()) as {
      token?: unknown;
      action?: unknown;
    };
    const caseId = verifyManageToken(token);
    if (!caseId) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 410 });
    }
    const nextStatus = ACTION_TO_STATUS[String(action)];
    if (!nextStatus) {
      return NextResponse.json({ error: "validation" }, { status: 400 });
    }

    const rows = (await sql`
      update cases
      set status = ${nextStatus}::case_status
      where id = ${caseId}
        and status in ('active','reminder_sent','responded','partly_resolved','no_response')
      returning status
    `) as Array<{ status: string }>;

    if (rows.length === 0) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 410 });
    }

    return NextResponse.json({ ok: true, status: rows[0].status });
  } catch (err) {
    console.error("case status error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
