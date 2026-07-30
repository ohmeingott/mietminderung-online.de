import { mangelKategorien, type Mangel } from "@/data/maengel";
import { CASE_SAVE_CONSENT_VERSION } from "@/lib/consent";
import type { CaseMangel, CaseSubmission } from "@/types/case";

/**
 * Hand-rolled validation for POST /api/case (repo style: no zod). The
 * server never trusts client numbers: defect labels and quotas are
 * re-resolved from the catalogue by id, totals are recomputed and clamped.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const VALID_LOCALES = new Set(["de", "tr", "ru", "uk", "ar", "pl"]);

const mangelById = new Map<string, Mangel>(
  mangelKategorien.flatMap((k) => k.maengel.map((m) => [m.id, m])),
);

const MAX_MAENGEL = 30;
const MAX_FREITEXT = 2000;
const MAX_SHORT_TEXT = 120;

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export interface ValidatedCase {
  tenantName: string;
  tenantEmail: string;
  tenantCity: string;
  tenantPlz: string;
  locale: string;
  consentVersion: string;
  bruttowarmmiete: number;
  minderungMin: number;
  minderungMax: number;
  minderungTypical: number;
  deadlineDate: string;
  eligibilityAnswers: Record<string, string>;
  maengel: CaseMangel[];
}

export type ValidationResult =
  | { ok: true; value: ValidatedCase }
  | { ok: false; field: string };

export function validateCaseSubmission(body: unknown): ValidationResult {
  const b = body as Partial<CaseSubmission> | null;
  if (!b || typeof b !== "object") return { ok: false, field: "body" };

  const tenant = b.tenant;
  if (!tenant || typeof tenant !== "object") {
    return { ok: false, field: "tenant" };
  }

  const tenantName = cleanText(tenant.name, MAX_SHORT_TEXT);
  if (!tenantName) return { ok: false, field: "tenant.name" };

  const tenantEmail = cleanText(tenant.email, 254).toLowerCase();
  if (!EMAIL_PATTERN.test(tenantEmail)) {
    return { ok: false, field: "tenant.email" };
  }

  const tenantCity = cleanText(tenant.city, MAX_SHORT_TEXT);
  const tenantPlz = cleanText(tenant.plz, 5);
  if (tenantPlz && !/^\d{5}$/.test(tenantPlz)) {
    return { ok: false, field: "tenant.plz" };
  }

  const locale = typeof b.locale === "string" ? b.locale : "";
  if (!VALID_LOCALES.has(locale)) return { ok: false, field: "locale" };

  if (b.consentVersion !== CASE_SAVE_CONSENT_VERSION) {
    return { ok: false, field: "consentVersion" };
  }

  const c = b.case;
  if (!c || typeof c !== "object") return { ok: false, field: "case" };

  const rent = Number(c.bruttowarmmiete);
  if (!Number.isFinite(rent) || rent <= 0 || rent > 100000) {
    return { ok: false, field: "case.bruttowarmmiete" };
  }

  const deadlineDate = typeof c.deadlineDate === "string" ? c.deadlineDate : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadlineDate)) {
    return { ok: false, field: "case.deadlineDate" };
  }
  const deadlineMs = Date.parse(`${deadlineDate}T12:00:00Z`);
  const dayMs = 24 * 60 * 60 * 1000;
  if (
    Number.isNaN(deadlineMs) ||
    deadlineMs < Date.now() - 2 * dayMs ||
    deadlineMs > Date.now() + 31 * dayMs
  ) {
    return { ok: false, field: "case.deadlineDate" };
  }

  const answersInput =
    c.eligibilityAnswers && typeof c.eligibilityAnswers === "object"
      ? c.eligibilityAnswers
      : {};
  const eligibilityAnswers: Record<string, string> = {};
  for (const [key, value] of Object.entries(answersInput).slice(0, 10)) {
    eligibilityAnswers[cleanText(key, 60)] = cleanText(value, 60);
  }

  if (!Array.isArray(c.maengel) || c.maengel.length === 0) {
    return { ok: false, field: "case.maengel" };
  }
  if (c.maengel.length > MAX_MAENGEL) {
    return { ok: false, field: "case.maengel" };
  }

  const seen = new Set<string>();
  const maengel: CaseMangel[] = [];
  for (const item of c.maengel) {
    const id = typeof item?.id === "string" ? item.id : "";
    const catalogue = mangelById.get(id);
    if (!catalogue || seen.has(id)) return { ok: false, field: "case.maengel" };
    seen.add(id);
    maengel.push({
      id,
      label: catalogue.label,
      quotaMin: catalogue.minderung_min,
      quotaMax: catalogue.minderung_max,
      quotaTypical: catalogue.minderung_typical,
      raum: cleanText(item.raum, MAX_SHORT_TEXT),
      seit: cleanText(item.seit, MAX_SHORT_TEXT),
      beschreibung: cleanText(item.beschreibung, MAX_FREITEXT),
    });
  }

  const clamp = (n: number) => Math.min(Math.round(n), 100);
  const minderungMin = clamp(maengel.reduce((s, m) => s + m.quotaMin, 0));
  const minderungMax = clamp(maengel.reduce((s, m) => s + m.quotaMax, 0));
  const minderungTypical = clamp(
    maengel.reduce((s, m) => s + m.quotaTypical, 0),
  );

  return {
    ok: true,
    value: {
      tenantName,
      tenantEmail,
      tenantCity,
      tenantPlz,
      locale,
      consentVersion: CASE_SAVE_CONSENT_VERSION,
      bruttowarmmiete: Math.round(rent * 100) / 100,
      minderungMin,
      minderungMax,
      minderungTypical,
      deadlineDate,
      eligibilityAnswers,
      maengel,
    },
  };
}
