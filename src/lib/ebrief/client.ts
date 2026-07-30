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
 */
async function call<T>(
  path: string,
  init: { method: string; body?: unknown },
  retryOn401 = true
): Promise<T> {
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
    return call<T>(path, init, false);
  }

  const text = await res.text();
  if (!res.ok) {
    throw new EbriefError(`eBrief ${init.method} ${path} failed`, res.status, text);
  }

  if (!text) return undefined as T;

  const parsed = JSON.parse(text) as EbriefEnvelope<T>;
  if (parsed.ErrorMessage) {
    throw new EbriefError(parsed.ErrorMessage, res.status, text);
  }
  return parsed.Result;
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
): Promise<unknown> {
  return call("/jobs/" + jobId + "/singleFiles", {
    method: "POST",
    body: { Document: { FileName: fileName, FileContent: base64Content } },
  });
}

export function commitJob(jobId: number): Promise<unknown> {
  return call(`/jobs/${jobId}`, { method: "PUT", body: { IsRollback: false } });
}

export function getJob(jobId: number): Promise<EbriefJob> {
  return call<EbriefJob>(`/jobs/${jobId}`, { method: "GET" });
}

export function distribute(jobId: number): Promise<unknown> {
  return call("/jobs/distribution", { method: "POST", body: { Ids: [jobId] } });
}

export function confirmDocs(docIds: number[]): Promise<unknown> {
  return call("/docs/confirmation", { method: "POST", body: { Ids: docIds } });
}

export function deleteJob(jobId: number): Promise<unknown> {
  return call(`/jobs/${jobId}`, { method: "DELETE" });
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

/** Raw PDF bytes with the address zone that eBrief detected marked up. */
export async function getFileWithMark(docId: number): Promise<ArrayBuffer> {
  const token = await getToken();
  const res = await fetch(`${ebriefBaseUrl()}/docs/${docId}/fileWithMark`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new EbriefError("fileWithMark failed", res.status);
  }
  return res.arrayBuffer();
}

export type { EbriefJob, JobStatus };
