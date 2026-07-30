import type { Mangel } from "@/data/maengel";

/**
 * Result of the eligibility check + calculator, handed from
 * MietminderungCheck to HomeCheckFlow to Maengelanzeige. Single source of
 * truth — do not re-declare this shape locally in components.
 */
export interface CheckResult {
  eligible: boolean | null;
  selectedMaengel: Mangel[];
  totalMinderungMin: number;
  totalMinderungMax: number;
  totalMinderungTypical: number;
  bruttowarmmiete: number;
  eligibilityAnswers: Record<string, string>;
}

/** One defect as stored with a saved case. */
export interface CaseMangel {
  id: string;
  /** German catalogue label — re-resolved server-side from the id. */
  label: string;
  quotaMin: number;
  quotaMax: number;
  quotaTypical: number;
  raum: string;
  seit: string;
  beschreibung: string;
}

/**
 * Body of POST /api/case. Deliberately excludes the signature, the
 * landlord's data, the tenant's street address and phone number — the
 * server must never receive them.
 */
export interface CaseSubmission {
  tenant: {
    name: string;
    email: string;
    city: string;
    plz: string;
  };
  locale: string;
  consentVersion: string;
  case: {
    bruttowarmmiete: number;
    /** ISO date (yyyy-mm-dd) — the Frist printed in the letter. */
    deadlineDate: string;
    eligibilityAnswers: Record<string, string>;
    maengel: Array<{
      id: string;
      raum: string;
      seit: string;
      beschreibung: string;
    }>;
  };
}

export type CaseStatus =
  | "pending_confirmation"
  | "active"
  | "reminder_sent"
  | "responded"
  | "partly_resolved"
  | "no_response"
  | "lawyer_requested"
  | "closed";

/** Response of GET /api/case/summary — minimal render data, no PII echo. */
export interface CaseSummary {
  status: CaseStatus;
  deadlineDate: string;
  createdAt: string;
  minderungTypical: number;
  monthlySaving: number;
  lawyerConsent: boolean;
}
