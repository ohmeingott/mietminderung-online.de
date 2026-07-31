/**
 * Retention rules, enforced by the daily cron (/api/cron) and disclosed in
 * the Datenschutzerklärung. Change a value here and the policy text must
 * change with it — they are asserted together in e2e/legal.spec.ts.
 */

/** Unconfirmed opt-ins (no double-opt-in click) are deleted after 7 days. */
export const PURGE_UNCONFIRMED_AFTER_DAYS = 7;

/** Reminder email goes out this many days after the letter deadline. */
export const REMINDER_AFTER_DEADLINE_DAYS = 2;

/** Lawyer-offer email goes out this many days after the reminder. */
export const LAWYER_OFFER_AFTER_REMINDER_DAYS = 7;

/** "Landlord responded" cases close after 30 days. */
export const CLOSE_RESPONDED_AFTER_DAYS = 30;

/**
 * Cases stuck in partly_resolved/no_response (no lawyer consent) close
 * after 90 days — no open-ended retention of personal data.
 */
export const CLOSE_STALE_AFTER_DAYS = 90;

/** Closed cases are hard-deleted 6 months after closing. */
export const PURGE_CLOSED_AFTER_DAYS = 183;

/** Lawyer-referral cases keep a longer paper trail: 12 months. */
export const PURGE_LAWYER_AFTER_DAYS = 365;

/** Anonymous funnel events are deleted after 90 days. */
export const PURGE_FUNNEL_EVENTS_AFTER_DAYS = 90;

/** Rate-limit buckets (transient IP hashes) are deleted after 24 hours. */
export const PURGE_RATE_LIMITS_AFTER_HOURS = 24;
