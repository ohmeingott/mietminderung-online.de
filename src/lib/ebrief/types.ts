/** Status values per the eBrief docs, section "Possible Job Statuses". */
export type JobStatus =
  | "UNPROCESSED"
  | "COMMITTED"
  | "PROCESSING_DOCUMENTS_PREPARE"
  | "COMPLETED_DOCUMENTS_PREPARE"
  | "PROCESSING_DOCUMENTS_PROCESS"
  | "COMPLETED_DOCUMENTS_PROCESS"
  | "USER_CONFIRMATION_REQUESTED"
  | "USER_WAIT_FOR_SHOPPING"
  | "DISTRIBUTION_READY_FOR"
  | "DISTRIBUTION_COMPLETED"
  | "BILLING_COMPLETED"
  | "JOB_COMPLETED"
  | "ERROR_DOCUMENT"
  | "ERROR_GENERAL"
  | "USER_DELETED"
  | "ROLLEDBACK";

/** From these statuses on, printing is under way and must not be triggered again. */
export const DISTRIBUTED_STATUSES: JobStatus[] = [
  "DISTRIBUTION_READY_FOR",
  "DISTRIBUTION_COMPLETED",
  "BILLING_COMPLETED",
  "JOB_COMPLETED",
];

export interface EbriefDoc {
  Id: number;
  Status?: string;
}

export interface EbriefJob {
  Id: number;
  Status: JobStatus;
  Documents?: EbriefDoc[];
  CreatedAt?: string;
}

/** Every response from the API is wrapped in this envelope. */
export interface EbriefEnvelope<T> {
  Result: T;
  ResultCode?: string;
  ErrorMessage?: string | null;
}

export interface PriceResult {
  TotalPrice?: number;
  TotalNetPrice?: number;
  [key: string]: unknown;
}
