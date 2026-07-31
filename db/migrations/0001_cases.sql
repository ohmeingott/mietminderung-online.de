-- Case storage for the opt-in reminder feature (mietminderung-online.de).
-- Apply in the Neon SQL editor (or psql) against the project database.
--
-- Data-minimization invariants enforced here and in the API layer:
--   * no street address, no phone number, no signature, no landlord data
--   * tokens are stored only as SHA-256 digests
--   * funnel events carry no IP, no user agent, no case reference

create type case_status as enum (
  'pending_confirmation',  -- created, waiting for the double-opt-in click
  'active',                -- confirmed; waiting for the letter deadline
  'reminder_sent',         -- deadline reminder email went out
  'responded',             -- user: landlord fixed the defects
  'partly_resolved',       -- user: landlord fixed some defects
  'no_response',           -- user clicked "no reaction" or cron timeout
  'lawyer_requested',      -- second consent given -> may be shared with partner lawyer
  'closed'                 -- terminal; purged after the retention period
);
-- Withdrawal (Art. 7(3)/17 DSGVO) and expiry are HARD DELETES, not statuses.

create table cases (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  status            case_status not null default 'pending_confirmation',
  status_changed_at timestamptz not null default now(),

  -- tenant (minimized)
  tenant_name   text not null check (char_length(tenant_name) between 1 and 120),
  tenant_email  text not null check (char_length(tenant_email) <= 254),
  tenant_city   text not null default '' check (char_length(tenant_city) <= 120),
  tenant_plz    text not null default '' check (tenant_plz ~ '^[0-9]{0,5}$'),
  locale        text not null check (locale in ('de','en','tr','ru','uk','ar','pl')),

  -- case data
  bruttowarmmiete_eur numeric(8,2) not null check (bruttowarmmiete_eur between 0 and 100000),
  minderung_min       smallint not null check (minderung_min between 0 and 100),
  minderung_max       smallint not null check (minderung_max between 0 and 100),
  minderung_typical   smallint not null check (minderung_typical between 0 and 100),
  monthly_saving_eur  numeric(8,2) generated always as
                      (round(bruttowarmmiete_eur * minderung_typical / 100.0, 2)) stored,
  deadline_date       date not null,
  eligibility_answers jsonb not null default '{}'::jsonb,
  -- array of { id, label, quotaMin, quotaMax, quotaTypical, raum, seit, beschreibung }
  maengel             jsonb not null,
  defect_count        smallint not null check (defect_count between 1 and 58),

  -- consent records (Art. 7(1) DSGVO)
  consent_reminder_at           timestamptz not null,
  consent_reminder_version      text not null,
  consent_reminder_confirmed_at timestamptz,
  consent_lawyer_at             timestamptz,
  consent_lawyer_version        text,

  -- double-opt-in token, stored as SHA-256 hex digest only; nulled after
  -- confirmation. Manage/withdraw links are stateless HMAC signatures over
  -- the case id (see src/lib/tokens.ts) — nothing to store here.
  confirm_token_hash text unique
);

create index cases_status_idx      on cases (status);
create index cases_deadline_idx    on cases (deadline_date) where status = 'active';
create index cases_email_lower_idx on cases (lower(tenant_email));

-- At most one email per type per case: the claim row is the idempotency lock.
create table case_emails (
  id                bigint generated always as identity primary key,
  case_id           uuid not null references cases (id) on delete cascade,
  email_type        text not null check (email_type in ('confirm','reminder','lawyer_offer')),
  claimed_at        timestamptz not null default now(),
  sent_at           timestamptz,
  resend_message_id text,
  unique (case_id, email_type)
);

-- Anonymous funnel events: deliberately NO ip, NO user agent, NO case id.
create table funnel_events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  session_id uuid not null,
  event      text not null check (event in (
    'check_started','eligibility_done','defects_selected','rent_entered',
    'result_viewed','letter_started','letter_completed','pdf_downloaded','case_saved')),
  locale     text not null check (locale in ('de','en','tr','ru','uk','ar','pl'))
);
create index funnel_events_created_idx on funnel_events (created_at);
create index funnel_events_session_idx on funnel_events (session_id);

-- Fixed-window rate limiting; bucket_key = '<route>:<salted-ip-hash>:<window>'.
-- Rows older than 24 h are purged by the cron, so IP hashes never persist.
create table rate_limits (
  bucket_key   text primary key,
  window_start timestamptz not null default now(),
  hits         integer not null default 1
);

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  if new.status is distinct from old.status then
    new.status_changed_at = now();
  end if;
  return new;
end $$;

create trigger cases_updated_at before update on cases
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Dashboard views: the Neon console is the case-review UI, these make it
-- one click. Query e.g.:  select * from promising_cases;
-- ---------------------------------------------------------------------------

create view cases_overview as
select
  created_at::date                       as created,
  status,
  locale,
  tenant_name,
  tenant_email,
  tenant_plz,
  tenant_city,
  bruttowarmmiete_eur                    as miete_eur,
  minderung_typical                      as quote_pct,
  monthly_saving_eur                     as ersparnis_eur,
  defect_count,
  deadline_date,
  (consent_lawyer_at is not null)        as anwalt_ok,
  round(monthly_saving_eur * defect_count) as promise_score,
  id
from cases
order by created_at desc;

create view promising_cases as
select *
from cases_overview
where status in ('no_response', 'partly_resolved', 'lawyer_requested')
order by promise_score desc;

create view funnel_summary as
select
  event,
  locale,
  count(*)                                   as events,
  count(distinct session_id)                 as sessions,
  min(created_at)::date                      as first_seen,
  max(created_at)::date                      as last_seen
from funnel_events
where created_at > now() - interval '30 days'
group by event, locale
order by event, locale;
