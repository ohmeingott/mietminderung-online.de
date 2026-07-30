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
