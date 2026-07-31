/**
 * The shapes eBrief actually sends, taken from the OpenAPI specification
 * (docs/ebrief/swagger-staging-2026-07-31.json, summarised in
 * docs/ebrief/API-SCHEMA.md) rather than from the HTML documentation, which
 * shows no example of a job or document object anywhere.
 *
 * The API has THREE job representations and they are not field-compatible:
 *
 *   JobDetailsInfo  Id / JobStatus / DateCreated     POST,GET,PUT /Jobs, singleFiles
 *   SimpleJobInfo   JobId / JobStatus / CreatedAt    POST /Jobs/distribution, DELETE
 *   JobInfo         Id / JobStatus / DateCreatedUnix POST /Jobs/searchJobDetails
 *
 * They are modelled separately below, on purpose. Merging them into one type
 * would mean declaring fields that a given endpoint never sends, which is
 * exactly the mistake that made the first spike run fail.
 */

/**
 * The job statuses named in the prose documentation, section "Possible Job
 * Statuses".
 *
 * The specification does NOT model `JobStatus` as an enum — it is a nullable
 * free string. So this union is "the values we recognise", never "the values
 * that can arrive", and the wire types below type the field as `string` to
 * keep that distinction visible at every call site. Use `hatStatus` to compare.
 */
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
export const DISTRIBUTED_STATUSES: readonly JobStatus[] = [
  "DISTRIBUTION_READY_FOR",
  "DISTRIBUTION_COMPLETED",
  "BILLING_COMPLETED",
  "JOB_COMPLETED",
];

/**
 * Whether a status off the wire is one of the listed known statuses.
 *
 * Exists because the wire field is a nullable free string while our lists are
 * `JobStatus[]`: without this, every comparison would need a cast, and a cast
 * is precisely how an unknown status would end up being treated as a known
 * one. Absent, null or unrecognised all answer `false`, so every caller has to
 * decide for itself what to do with a status it does not know — which is the
 * decision that matters here.
 */
export function hatStatus(
  status: string | null | undefined,
  liste: readonly JobStatus[]
): boolean {
  return (
    typeof status === "string" && (liste as readonly string[]).includes(status)
  );
}

/** `Rest.Common.CoreResultCodes`. */
export type EbriefResultCode =
  | "None"
  | "Ok"
  | "NotFound"
  | "Conflict"
  | "Unauthorized"
  | "UnknownError"
  | "BadRequest"
  | "Forbidden";

/** Every response from the API is wrapped in this envelope. */
export interface EbriefEnvelope<T> {
  Result?: T | null;
  ResultCode?: EbriefResultCode;
  ErrorMessage?: string | null;
}

/**
 * `ResponseJobInfo` / `SimpleResponseJobInfo`: the job endpoints do not put the
 * job in `Result`, they put a LIST there and the job is its first entry.
 */
export interface EbriefJobListe<T> {
  Jobs?: T[] | null;
}

/** `AddressDocumentInfo` — what eBrief read out of the uploaded PDF. */
export interface EbriefAddressInfo {
  ExtractedTextFromDocument?: string | null;
  Street?: string | null;
  HouseNumber?: string | null;
  Zip?: string | null;
  City?: string | null;
  Country?: string | null;
}

/** `ArticleInfo` — one priced line item. */
export interface EbriefArticleInfo {
  PriceBrutto?: number;
  PriceNetto?: number;
  Vat?: number;
  Type?: string | null;
  ArticleNumber?: string | null;
  ArticleName?: string | null;
}

/**
 * `DocumentDetailsInfo` — the document as the job endpoints report it.
 * Note `DocumentStatus`, not `Status`, and `AddressInformation` with two d's
 * (the search response spells the same field `AdressInformation`).
 */
export interface EbriefDocumentDetails {
  Id: number;
  DocumentStatus?: string | null;
  AddressInformation?: EbriefAddressInfo | null;
  Articles?: EbriefArticleInfo[] | null;
  NumberPagesLogical?: number;
  NumberPagesPhysical?: number;
  PriceBrutto?: number;
  PriceNetto?: number;
  Vat?: number;
  DocumentFileName?: string | null;
  LastEvent?: string | null;
  TimestampLastEvent?: string | null;
  ShipmentNumber?: string | null;
  TrackingUrl?: string | null;
  DocumentErrorCode?: string | null;
}

/**
 * `JobDetailsInfo` — the job as `POST /Jobs`, `GET /Jobs/{id}`,
 * `PUT /Jobs/{id}` and `POST /Jobs/{id}/singleFiles` report it, at
 * `Result.Jobs[0]`.
 */
export interface EbriefJobDetails {
  Id: number;
  /** Free string in the spec — compare with `hatStatus`, never with a cast. */
  JobStatus?: string | null;
  /** ISO 8601. The search response calls the same thing `DateCreatedUnix`. */
  DateCreated?: string;
  Documents?: EbriefDocumentDetails[] | null;
  JobFiles?: unknown[] | null;
  /** The price of THIS job, once eBrief has processed it. Euros, not cents. */
  PriceBrutto?: number;
  PriceNetto?: number;
  Vat?: number;
  StatusCodeMessage?: string | null;
  StatusCodeMessageInfo?: string | null;
  Attributes?: Record<string, string> | null;
  CustomerNumber?: string | null;
  CustomerName?: string | null;
}

/**
 * `SimpleJobInfo` — what `POST /Jobs/distribution` and `DELETE /Jobs/{id}`
 * return at `Result.Jobs[0]`. Deliberately kept apart from `EbriefJobDetails`:
 * the id is called `JobId` here and there are no documents at all.
 *
 * Nothing in this codebase reads it — both callers only need to know that the
 * request was accepted — but it is modelled so that anyone reaching for
 * `.Id` on a distribute response finds out from the type that there isn't one.
 */
export interface EbriefSimpleJob {
  JobId: number;
  JobStatus?: string | null;
  CreatedAt?: string;
  TotalDocumentsCount?: number;
  CustomerNumber?: string | null;
  CustomerName?: string | null;
}

/** `DocumentInfo` — the document as the SEARCH reports it. */
export interface EbriefSearchDocument {
  Id: number;
  DocumentStatus?: string | null;
  /** Yes, one d: the search response spells this field differently. */
  AdressInformation?: EbriefAddressInfo | null;
  NumberPagesLogical?: number;
  NumberPagesPhysical?: number;
  PriceBrutto?: number;
  PriceNetto?: number;
  Vat?: number;
  DocumentFileName?: string | null;
  ShipmentNumber?: string | null;
  DocumentErrorCode?: string | null;
}

/**
 * `JobInfo` — the job as `POST /Jobs/searchJobDetails` reports it, in
 * `Result.ResponseDetails[]`. Its creation date is a Unix integer under a
 * different name than the one `EbriefJobDetails` uses.
 */
export interface EbriefSearchJob {
  Id: number;
  JobStatus?: string | null;
  /** Unix time. The spec does not say whether seconds or milliseconds. */
  DateCreatedUnix?: number;
  Documents?: EbriefSearchDocument[] | null;
  TotalDocumentsCount?: number;
  PriceBrutto?: number;
  PriceNetto?: number;
  Vat?: number;
  StatusCodeMessage?: string | null;
  StatusCodeMessageInfo?: string | null;
  Reference?: string | null;
  AdditionalReference?: string | null;
}

/** `ResponseJobInfoOld` — the envelope payload of the job search. */
export interface EbriefSearchResponse {
  ResponseDetails?: EbriefSearchJob[] | null;
  ResultMetadata?: { TotalCount?: number } | null;
}

/**
 * `ResponsePriceInfo` — the payload of `POST /Prices`, sitting directly in
 * `Result` with no list around it.
 *
 * There is no `TotalPrice`. The sums are doubles split brutto/netto, i.e.
 * euros — the "might be cents" question is answered by the schema itself.
 */
export interface EbriefPriceResult {
  TotalSumBrutto?: number;
  TotalSumNetto?: number;
  TotalSumVat?: number;
  TotalSumShipmentBrutto?: number;
  TotalSumShipmentNetto?: number;
  TotalSumShipmentVat?: number;
  Prices?: EbriefArticleInfo[] | null;
}

/** `FileResponseInfo` — a file, base64-encoded inside the usual envelope. */
export interface EbriefFileResponse {
  FileName?: string | null;
  FileType?: string | null;
  FileContent?: string | null;
  FileSize?: number;
}
