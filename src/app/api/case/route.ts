import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withinRateLimit } from "@/lib/rateLimit";
import { generateConfirmToken, hashToken, tokensConfigured } from "@/lib/tokens";
import { validateCaseSubmission } from "@/lib/validate";
import { confirmEmail } from "@/lib/email/templates";
import { emailConfigured, sendEmail } from "@/lib/email/send";
import { absoluteUrl } from "@/lib/site";

/**
 * Creates a case in `pending_confirmation` and sends the double-opt-in
 * confirmation email. The case only becomes active after the user clicks
 * the confirm link (POST /api/case/confirm); unconfirmed rows are purged
 * after 7 days by the cron.
 *
 * Failure is surfaced, never swallowed: if the confirmation email cannot
 * be sent, the row is deleted again and the client gets a 5xx so the UI
 * can offer a retry.
 */
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    if (!sql || !emailConfigured() || !tokensConfigured()) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    if (!(await withinRateLimit("case", request, 5, 3600))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const result = validateCaseSubmission(await request.json());
    if (!result.ok) {
      return NextResponse.json(
        { error: "validation", field: result.field },
        { status: 400 },
      );
    }
    const v = result.value;

    // Re-submitting with the same address supersedes an unconfirmed case
    // (acts as "resend the confirmation email").
    await sql`
      delete from cases
      where lower(tenant_email) = ${v.tenantEmail}
        and status = 'pending_confirmation'
    `;

    const confirmToken = generateConfirmToken();

    const rows = (await sql`
      insert into cases (
        tenant_name, tenant_email, tenant_city, tenant_plz, locale,
        bruttowarmmiete_eur, minderung_min, minderung_max, minderung_typical,
        deadline_date, eligibility_answers, maengel, defect_count,
        consent_reminder_at, consent_reminder_version,
        confirm_token_hash
      ) values (
        ${v.tenantName}, ${v.tenantEmail}, ${v.tenantCity}, ${v.tenantPlz}, ${v.locale},
        ${v.bruttowarmmiete}, ${v.minderungMin}, ${v.minderungMax}, ${v.minderungTypical},
        ${v.deadlineDate}, ${JSON.stringify(v.eligibilityAnswers)}::jsonb,
        ${JSON.stringify(v.maengel)}::jsonb, ${v.maengel.length},
        now(), ${v.consentVersion},
        ${hashToken(confirmToken)}
      )
      returning id, created_at
    `) as Array<{ id: string; created_at: string }>;
    const caseId = rows[0].id;

    await sql`
      insert into case_emails (case_id, email_type)
      values (${caseId}, 'confirm')
    `;

    const requestDate = new Date().toISOString().slice(0, 10);
    const sent = await sendEmail({
      to: v.tenantEmail,
      email: confirmEmail({
        requestDate,
        confirmUrl: absoluteUrl(
          `/fall/bestaetigen?t=${encodeURIComponent(confirmToken)}`,
        ),
      }),
    });

    if (!sent.ok) {
      await sql`delete from cases where id = ${caseId}`;
      return NextResponse.json({ error: "email_failed" }, { status: 502 });
    }

    await sql`
      update case_emails
      set sent_at = now(), resend_message_id = ${sent.id ?? null}
      where case_id = ${caseId} and email_type = 'confirm'
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("case create error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
