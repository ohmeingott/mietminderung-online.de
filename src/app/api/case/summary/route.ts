import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withinRateLimit } from "@/lib/rateLimit";
import { verifyManageToken } from "@/lib/tokens";

/**
 * Minimal render data for /fall/status. Deliberately echoes no name and no
 * email — the person holding the manage link already knows them.
 */
export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    if (!(await withinRateLimit("summary", request, 60, 3600))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const caseId = verifyManageToken(request.nextUrl.searchParams.get("t"));
    if (!caseId) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 410 });
    }

    const rows = (await sql`
      select status, deadline_date, created_at, minderung_typical,
             monthly_saving_eur, consent_lawyer_at
      from cases
      where id = ${caseId}
    `) as Array<{
      status: string;
      deadline_date: string;
      created_at: string;
      minderung_typical: number;
      monthly_saving_eur: string;
      consent_lawyer_at: string | null;
    }>;

    if (rows.length === 0) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 410 });
    }
    const row = rows[0];

    return NextResponse.json({
      status: row.status,
      deadlineDate: String(row.deadline_date).slice(0, 10),
      createdAt: String(row.created_at).slice(0, 10),
      minderungTypical: row.minderung_typical,
      monthlySaving: Number(row.monthly_saving_eur),
      lawyerConsent: row.consent_lawyer_at !== null,
    });
  } catch (err) {
    console.error("case summary error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
