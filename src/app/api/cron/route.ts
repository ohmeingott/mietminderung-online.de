import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createManageToken, tokensConfigured } from "@/lib/tokens";
import { lawyerOfferEmail, reminderEmail } from "@/lib/email/templates";
import { emailConfigured, sendEmail } from "@/lib/email/send";
import { absoluteUrl } from "@/lib/site";
import {
  CLOSE_RESPONDED_AFTER_DAYS,
  CLOSE_STALE_AFTER_DAYS,
  LAWYER_OFFER_AFTER_REMINDER_DAYS,
  PURGE_CLOSED_AFTER_DAYS,
  PURGE_FUNNEL_EVENTS_AFTER_DAYS,
  PURGE_LAWYER_AFTER_DAYS,
  PURGE_RATE_LIMITS_AFTER_HOURS,
  PURGE_UNCONFIRMED_AFTER_DAYS,
  REMINDER_AFTER_DEADLINE_DAYS,
} from "@/lib/retention";

interface CaseRow {
  id: string;
  tenant_name: string;
  tenant_email: string;
  status: string;
  created_at: string;
  deadline_date: string;
  minderung_typical: number;
  maengel: Array<{ label: string }>;
  consent_reminder_confirmed_at: string;
}

const isoDate = (value: string) => String(value).slice(0, 10);

/**
 * Daily housekeeping (Vercel Cron, see vercel.json). Every step is
 * idempotent — email sends are guarded by the unique claim row in
 * case_emails — and each step is isolated so one failure cannot block the
 * rest. Vercel calls this with `Authorization: Bearer ${CRON_SECRET}`.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const report = {
    purgedUnconfirmed: 0,
    remindersSent: 0,
    lawyerOffersSent: 0,
    closed: 0,
    purged: 0,
    errors: [] as string[],
  };

  // 1. Double opt-in never confirmed -> no consent -> delete.
  try {
    const rows = (await sql`
      delete from cases
      where status = 'pending_confirmation'
        and created_at < now() - make_interval(days => ${PURGE_UNCONFIRMED_AFTER_DAYS})
      returning id
    `) as Array<{ id: string }>;
    report.purgedUnconfirmed = rows.length;
  } catch (err) {
    report.errors.push(`purge_unconfirmed: ${String(err)}`);
  }

  // 2. Deadline reminder ("Hat Ihr Vermieter reagiert?").
  if (emailConfigured() && tokensConfigured()) {
    try {
      const due = (await sql`
        select id, tenant_name, tenant_email, status, created_at, deadline_date,
               minderung_typical, maengel, consent_reminder_confirmed_at
        from cases
        where status = 'active'
          and deadline_date <= current_date - ${REMINDER_AFTER_DEADLINE_DAYS}
        limit 100
      `) as CaseRow[];

      for (const row of due) {
        const claimed = (await sql`
          insert into case_emails (case_id, email_type)
          values (${row.id}, 'reminder')
          on conflict (case_id, email_type) do nothing
          returning id
        `) as Array<{ id: number }>;
        if (claimed.length === 0) continue;

        const manageToken = createManageToken(row.id);
        if (!manageToken) break;
        const statusUrl = absoluteUrl(
          `/fall/status?t=${encodeURIComponent(manageToken)}`,
        );

        const sent = await sendEmail({
          to: row.tenant_email,
          unsubscribeUrl: statusUrl,
          email: reminderEmail({
            tenantName: row.tenant_name,
            createdDate: isoDate(row.created_at),
            deadlineDate: isoDate(row.deadline_date),
            optinDate: isoDate(row.consent_reminder_confirmed_at),
            mangelLabels: row.maengel.map((m) => m.label),
            quotaTypical: row.minderung_typical,
            statusUrl,
            manageUrl: statusUrl,
          }),
        });

        if (sent.ok) {
          await sql`
            update case_emails
            set sent_at = now(), resend_message_id = ${sent.id ?? null}
            where case_id = ${row.id} and email_type = 'reminder'
          `;
          await sql`
            update cases set status = 'reminder_sent' where id = ${row.id}
          `;
          report.remindersSent += 1;
        } else {
          // Drop the claim so the next run retries.
          await sql`
            delete from case_emails
            where case_id = ${row.id} and email_type = 'reminder' and sent_at is null
          `;
        }
      }
    } catch (err) {
      report.errors.push(`reminders: ${String(err)}`);
    }

    // 3. Lawyer offer: a week after the reminder, unless the landlord fixed
    //    everything. No click at all counts as "no response".
    try {
      const due = (await sql`
        select c.id, c.tenant_name, c.tenant_email, c.status, c.created_at,
               c.deadline_date, c.minderung_typical, c.maengel,
               c.consent_reminder_confirmed_at
        from cases c
        join case_emails e
          on e.case_id = c.id and e.email_type = 'reminder' and e.sent_at is not null
        where c.status in ('reminder_sent', 'partly_resolved', 'no_response')
          and e.sent_at < now() - make_interval(days => ${LAWYER_OFFER_AFTER_REMINDER_DAYS})
        limit 100
      `) as CaseRow[];

      for (const row of due) {
        const claimed = (await sql`
          insert into case_emails (case_id, email_type)
          values (${row.id}, 'lawyer_offer')
          on conflict (case_id, email_type) do nothing
          returning id
        `) as Array<{ id: number }>;
        if (claimed.length === 0) continue;

        const manageToken = createManageToken(row.id);
        if (!manageToken) break;
        const t = encodeURIComponent(manageToken);

        const sent = await sendEmail({
          to: row.tenant_email,
          unsubscribeUrl: absoluteUrl(`/fall/status?t=${t}`),
          email: lawyerOfferEmail({
            tenantName: row.tenant_name,
            createdDate: isoDate(row.created_at),
            optinDate: isoDate(row.consent_reminder_confirmed_at),
            anwaltUrl: absoluteUrl(`/fall/anwalt?t=${t}`),
            manageUrl: absoluteUrl(`/fall/status?t=${t}`),
          }),
        });

        if (sent.ok) {
          await sql`
            update case_emails
            set sent_at = now(), resend_message_id = ${sent.id ?? null}
            where case_id = ${row.id} and email_type = 'lawyer_offer'
          `;
          if (row.status === "reminder_sent") {
            await sql`
              update cases set status = 'no_response'
              where id = ${row.id} and status = 'reminder_sent'
            `;
          }
          report.lawyerOffersSent += 1;
        } else {
          await sql`
            delete from case_emails
            where case_id = ${row.id} and email_type = 'lawyer_offer' and sent_at is null
          `;
        }
      }
    } catch (err) {
      report.errors.push(`lawyer_offers: ${String(err)}`);
    }
  }

  // 4. Close finished/stale cases.
  try {
    const closed = (await sql`
      update cases
      set status = 'closed'
      where (status = 'responded'
             and status_changed_at < now() - make_interval(days => ${CLOSE_RESPONDED_AFTER_DAYS}))
         or (status in ('partly_resolved', 'no_response')
             and status_changed_at < now() - make_interval(days => ${CLOSE_STALE_AFTER_DAYS}))
      returning id
    `) as Array<{ id: string }>;
    report.closed = closed.length;
  } catch (err) {
    report.errors.push(`close: ${String(err)}`);
  }

  // 5. Retention purges.
  try {
    const purgedClosed = (await sql`
      delete from cases
      where status = 'closed'
        and status_changed_at < now() - make_interval(days => ${PURGE_CLOSED_AFTER_DAYS})
      returning id
    `) as Array<{ id: string }>;
    const purgedLawyer = (await sql`
      delete from cases
      where status = 'lawyer_requested'
        and status_changed_at < now() - make_interval(days => ${PURGE_LAWYER_AFTER_DAYS})
      returning id
    `) as Array<{ id: string }>;
    report.purged = purgedClosed.length + purgedLawyer.length;
    await sql`
      delete from funnel_events
      where created_at < now() - make_interval(days => ${PURGE_FUNNEL_EVENTS_AFTER_DAYS})
    `;
    await sql`
      delete from rate_limits
      where window_start < now() - make_interval(hours => ${PURGE_RATE_LIMITS_AFTER_HOURS})
    `;
  } catch (err) {
    report.errors.push(`purges: ${String(err)}`);
  }

  return NextResponse.json(report);
}
