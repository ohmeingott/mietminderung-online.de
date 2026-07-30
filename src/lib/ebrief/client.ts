import { ebriefBaseUrl, getToken, invalidateToken } from "./token";
import type {
  EbriefEnvelope,
  EbriefJob,
  JobStatus,
  PriceResult,
} from "./types";

export class EbriefError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: string
  ) {
    super(message);
    this.name = "EbriefError";
  }
}

/**
 * The single place that talks to eBrief. A 401 can mean the cached token was
 * invalidated server-side, so retry once with a fresh one before giving up.
 * Returns the raw response text (which may be empty) so the two callers
 * below can decide separately whether an empty body is acceptable.
 */
async function request(
  path: string,
  init: { method: string; body?: unknown },
  retryOn401 = true
): Promise<{ status: number; text: string }> {
  const token = await getToken();
  const res = await fetch(`${ebriefBaseUrl()}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  if (res.status === 401 && retryOn401) {
    invalidateToken();
    return request(path, init, false);
  }

  const text = await res.text();
  if (!res.ok) {
    throw new EbriefError(`eBrief ${init.method} ${path} failed`, res.status, text);
  }

  return { status: res.status, text };
}

/**
 * Parses the envelope, guarding against a 2xx response that isn't actually
 * JSON (e.g. an HTML proxy error page) — without this, a bad gateway would
 * surface as a bare "Unexpected token <" with no indication it came from eBrief.
 */
function parseEnvelope<T>(
  text: string,
  method: string,
  path: string,
  status: number
): EbriefEnvelope<T> {
  try {
    return JSON.parse(text) as EbriefEnvelope<T>;
  } catch {
    throw new EbriefError(
      `eBrief ${method} ${path} returned a non-JSON body`,
      status,
      text
    );
  }
}

/**
 * For endpoints whose payload the caller actually needs. An empty body is
 * treated as a failure — returning `undefined` typed as `T` would let a
 * blank response masquerade as a real object and blow up later at whatever
 * property the caller reads first, with no trace back to eBrief.
 */
async function call<T>(
  path: string,
  init: { method: string; body?: unknown }
): Promise<T> {
  const { status, text } = await request(path, init);

  if (!text) {
    throw new EbriefError(
      `eBrief ${init.method} ${path} returned an empty body`,
      status
    );
  }

  const parsed = parseEnvelope<T>(text, init.method, path, status);
  if (parsed.ErrorMessage) {
    throw new EbriefError(parsed.ErrorMessage, status, text);
  }
  return parsed.Result;
}

/**
 * For endpoints whose result the caller doesn't need (e.g. "commit this job").
 * An empty body is fine here, but if the API DOES send one back, it must
 * still be parsed and checked for `ErrorMessage` — a failure reported in the
 * envelope must not be swallowed just because the caller ignores the result.
 */
async function callVoid(
  path: string,
  init: { method: string; body?: unknown }
): Promise<void> {
  const { status, text } = await request(path, init);
  if (!text) return;

  const parsed = parseEnvelope<unknown>(text, init.method, path, status);
  if (parsed.ErrorMessage) {
    throw new EbriefError(parsed.ErrorMessage, status, text);
  }
}

export interface JobAttributes {
  IsDuplex: string;
  IsColor: string;
  IsTracking: string;
  NotificationMail?: string;
  SilentConfirm: string;
}

export function createJob(attributes: JobAttributes): Promise<EbriefJob> {
  return call<EbriefJob>("/jobs", { method: "POST", body: { Attributes: attributes } });
}

export function addFile(
  jobId: number,
  fileName: string,
  base64Content: string
): Promise<void> {
  return callVoid("/jobs/" + jobId + "/singleFiles", {
    method: "POST",
    body: { Document: { FileName: fileName, FileContent: base64Content } },
  });
}

export function commitJob(jobId: number): Promise<void> {
  return callVoid(`/jobs/${jobId}`, { method: "PUT", body: { IsRollback: false } });
}

export function getJob(jobId: number): Promise<EbriefJob> {
  return call<EbriefJob>(`/jobs/${jobId}`, { method: "GET" });
}

export function distribute(jobId: number): Promise<void> {
  return callVoid("/jobs/distribution", { method: "POST", body: { Ids: [jobId] } });
}

export function confirmDocs(docIds: number[]): Promise<void> {
  return callVoid("/docs/confirmation", { method: "POST", body: { Ids: docIds } });
}

export function deleteJob(jobId: number): Promise<void> {
  return callVoid(`/jobs/${jobId}`, { method: "DELETE" });
}

/**
 * A job as the search returns it. Deliberately looser than `EbriefJob`: the
 * only field this codebase has actually seen from `/jobs/{id}` is guaranteed
 * here, everything else is `unknown` and must be validated by the caller. The
 * search response has never been observed, so typing its `Status` as
 * `JobStatus` would be a claim, not a fact.
 */
export type EbriefSuchJob = { Id: number } & Record<string, unknown>;

export interface JobSuchergebnis {
  jobs: EbriefSuchJob[];
  /**
   * The `Result` was neither an array nor a recognised wrapper, so nothing
   * could be read out of it. Reported rather than returned as an empty list:
   * "the shape is not what we assumed" must not look like "there is nothing
   * to do".
   */
  formUnbekannt: boolean;
}

/** Wrapper keys under which the job array might sit, most plausible first. */
const JOB_LISTEN_FELDER = ["Jobs", "JobDetails", "Items", "Results", "Details"];

function istSuchJob(wert: unknown): wert is EbriefSuchJob {
  return (
    typeof wert === "object" &&
    wert !== null &&
    typeof (wert as { Id?: unknown }).Id === "number"
  );
}

function leseSuchergebnis(result: unknown): JobSuchergebnis {
  if (Array.isArray(result)) {
    return { jobs: result.filter(istSuchJob), formUnbekannt: false };
  }

  if (typeof result === "object" && result !== null) {
    const obj = result as Record<string, unknown>;
    for (const feld of JOB_LISTEN_FELDER) {
      const wert = obj[feld];
      if (!Array.isArray(wert)) continue;
      return { jobs: wert.filter(istSuchJob), formUnbekannt: false };
    }
  }

  return { jobs: [], formUnbekannt: true };
}

/**
 * The documented request body of the job search: a status filter, a date range
 * in ISO 8601, and pagination. Field names and nesting are taken verbatim from
 * the API documentation's own code sample.
 *
 * What the docs do NOT say is what the filters compare against — DateFrom and
 * DateTo are described only as "Start/End date for filtering jobs", with no
 * word on which of a job's dates that is. Callers must therefore treat the
 * filter as a narrowing convenience, never as proof of a job's age.
 */
export interface JobSuchFilter {
  JobStatus?: JobStatus[];
  DateFrom?: string;
  DateTo?: string;
  Paging?: { PageNumber: number; PageSize: number };
}

/**
 * Job search, used by the cleanup cron and by nothing else.
 *
 * The request body is documented (see JobSuchFilter). The RESPONSE is not: the
 * docs describe it as "Result object — Main result object" and show no sample,
 * so neither the wrapper around the job array nor the fields on a job are
 * known. Hence the defensive reader above — `Result` is accepted both as a bare
 * array and as a wrapper object, anything else is reported as `formUnbekannt`
 * rather than silently read as "no jobs", and entries without a numeric `Id`
 * are dropped because nothing can be done with a job we cannot address.
 *
 * The path is spelled as the docs spell it, capital J included, even though
 * every other path in this file is lowercase.
 */
export async function searchJobs(
  filter: JobSuchFilter = {}
): Promise<JobSuchergebnis> {
  const result = await call<unknown>("/Jobs/searchJobDetails", {
    method: "POST",
    body: filter,
  });
  return leseSuchergebnis(result);
}

/**
 * Price lookup. Unlike the job attributes, this endpoint expects real
 * booleans — the API is inconsistent here, so the conversion is contained
 * in this one place.
 */
export function getPrice(opts: {
  pages: number;
  isColor: boolean;
  isDuplex: boolean;
  isTracking: boolean;
}): Promise<PriceResult> {
  return call<PriceResult>("/prices", {
    method: "POST",
    body: {
      Amount: 1,
      Attributes: {
        Pages: opts.pages,
        IsDuplex: opts.isDuplex,
        IsColor: opts.isColor,
        IsTracking: opts.isTracking,
        PaperType: "",
        EnvelopeType: "",
        EnvelopeFormat: "",
        RecycledPaper: false,
        Region: "National",
      },
    },
  });
}

/**
 * Raw PDF bytes with the address zone that eBrief detected marked up.
 * Shares the same 401-retry tolerance as every other call: the cached token
 * may have been invalidated server-side, so we refresh and try once more
 * before giving up (the `retryOn401` flag bounds this to a single retry).
 */
export async function getFileWithMark(
  docId: number,
  retryOn401 = true
): Promise<ArrayBuffer> {
  const token = await getToken();
  const res = await fetch(`${ebriefBaseUrl()}/docs/${docId}/fileWithMark`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401 && retryOn401) {
    invalidateToken();
    return getFileWithMark(docId, false);
  }

  if (!res.ok) {
    throw new EbriefError("fileWithMark failed", res.status);
  }
  return res.arrayBuffer();
}

export type { EbriefJob, JobStatus };
