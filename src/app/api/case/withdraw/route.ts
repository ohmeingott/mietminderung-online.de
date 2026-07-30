import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withinRateLimit } from "@/lib/rateLimit";
import { verifyManageToken } from "@/lib/tokens";

/**
 * Consent withdrawal (Art. 7 Abs. 3 DSGVO) = immediate hard delete
 * (Art. 17). Idempotent and enumeration-safe: always 200, whether or not
 * the token matched anything.
 */
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    if (!(await withinRateLimit("withdraw", request, 30, 3600))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const { token } = (await request.json()) as { token?: unknown };
    const caseId = verifyManageToken(token);
    if (caseId) {
      await sql`delete from cases where id = ${caseId}`;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("case withdraw error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
