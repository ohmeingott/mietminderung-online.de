import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withinRateLimit } from "@/lib/rateLimit";
import { verifyManageToken } from "@/lib/tokens";
import { LAWYER_REFERRAL_CONSENT_VERSION } from "@/lib/consent";

/**
 * The second, separate consent: permits sharing the case with a partner
 * lawyer. Only recorded from the explicit checkbox + button on
 * /fall/anwalt; the server rejects stale consent-text versions so a cached
 * old page can never record consent under superseded wording.
 */
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    if (!(await withinRateLimit("lawyer", request, 20, 3600))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const { token, consentVersion } = (await request.json()) as {
      token?: unknown;
      consentVersion?: unknown;
    };
    const caseId = verifyManageToken(token);
    if (!caseId) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 410 });
    }
    if (consentVersion !== LAWYER_REFERRAL_CONSENT_VERSION) {
      return NextResponse.json({ error: "stale_consent" }, { status: 400 });
    }

    const rows = (await sql`
      update cases
      set status = 'lawyer_requested',
          consent_lawyer_at = now(),
          consent_lawyer_version = ${LAWYER_REFERRAL_CONSENT_VERSION}
      where id = ${caseId}
        and status in ('active','reminder_sent','responded','partly_resolved','no_response')
      returning id
    `) as Array<{ id: string }>;

    if (rows.length === 0) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 410 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("lawyer consent error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
