import { ebriefBaseUrl, getToken, invalidateToken } from "./token";
import type {
  EbriefEnvelope,
  EbriefFileResponse,
  EbriefJobDetails,
  EbriefJobListe,
  EbriefPriceResult,
  EbriefSearchJob,
  EbriefSearchResponse,
  JobStatus,
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
 *
 * Paths are spelled as the specification spells them, capitals included
 * (`/Jobs`, `/Docs`, `/Prices`). Lowercase was tolerated by staging in the
 * first spike run, but tolerated is not documented.
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
 *
 * What comes back is `Result`, which for most endpoints is NOT the payload but
 * a wrapper around it. Every caller below unwraps its own shape explicitly, so
 * that the expected shape is readable at the call site.
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
  if (parsed.Result === undefined || parsed.Result === null) {
    throw new EbriefError(
      `eBrief ${init.method} ${path} returned an envelope without a Result`,
      status,
      text
    );
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

/**
 * `Result.Jobs[0]`, or a hard failure.
 *
 * The job endpoints answer with a LIST and put the one job we asked about at
 * its head. An empty list means eBrief accepted the request but told us
 * nothing about the job; reading `undefined.Id` three lines later — which is
 * how the first spike run failed — hides where that came from, so it is
 * reported here instead.
 *
 * The status is 0 because there is no failing HTTP status to report: the
 * request itself succeeded, it is the body that is unusable.
 */
function ersterJob<T>(
  liste: EbriefJobListe<T>,
  method: string,
  path: string
): T {
  const job = liste?.Jobs?.[0];
  if (job === undefined || job === null) {
    throw new EbriefError(
      `eBrief ${method} ${path} returned no job in Result.Jobs`,
      0,
      JSON.stringify(liste)
    );
  }
  return job;
}

export interface JobAttributes {
  IsDuplex: string;
  IsColor: string;
  IsTracking: string;
  NotificationMail?: string;
  SilentConfirm: string;
}

/** `POST /Jobs` → `Result.Jobs[0]` is a `JobDetailsInfo`. */
export async function createJob(
  attributes: JobAttributes
): Promise<EbriefJobDetails> {
  const result = await call<EbriefJobListe<EbriefJobDetails>>("/Jobs", {
    method: "POST",
    body: { Attributes: attributes },
  });
  return ersterJob(result, "POST", "/Jobs");
}

/**
 * `POST /Jobs/{id}/singleFiles`. Answers with the job, which no caller needs —
 * the status that matters comes from the poll after the commit.
 */
export function addFile(
  jobId: number,
  fileName: string,
  base64Content: string
): Promise<void> {
  return callVoid(`/Jobs/${jobId}/singleFiles`, {
    method: "POST",
    body: { Document: { FileName: fileName, FileContent: base64Content } },
  });
}

/** `PUT /Jobs/{id}` with `IsRollback: false` is the commit. */
export function commitJob(jobId: number): Promise<void> {
  return callVoid(`/Jobs/${jobId}`, { method: "PUT", body: { IsRollback: false } });
}

/** `GET /Jobs/{id}` → `Result.Jobs[0]` is a `JobDetailsInfo`. */
export async function getJob(jobId: number): Promise<EbriefJobDetails> {
  const result = await call<EbriefJobListe<EbriefJobDetails>>(`/Jobs/${jobId}`, {
    method: "GET",
  });
  return ersterJob(result, "GET", `/Jobs/${jobId}`);
}

/**
 * `POST /Jobs/distribution` — the irreversible one. Answers with a
 * `SimpleJobInfo` (`JobId`, not `Id`), which nothing here reads: whether the
 * letter is on its way is answered by the job status on the next `getJob`,
 * not by the shape of this response.
 */
export function distribute(jobId: number): Promise<void> {
  return callVoid("/Jobs/distribution", { method: "POST", body: { Ids: [jobId] } });
}

/** `POST /Docs/confirmation` — releases documents held by the address check. */
export function confirmDocs(docIds: number[]): Promise<void> {
  return callVoid("/Docs/confirmation", { method: "POST", body: { Ids: docIds } });
}

/** `DELETE /Jobs/{id}`. Answers with a `SimpleJobInfo` that nothing reads. */
export function deleteJob(jobId: number): Promise<void> {
  return callVoid(`/Jobs/${jobId}`, { method: "DELETE" });
}

export interface JobSuchergebnis {
  jobs: EbriefSearchJob[];
  /** `Result.ResultMetadata.TotalCount`: how many the filter matched in total. */
  gesamt?: number;
}

/**
 * The request body of the job search, per `RequestJobInfo`.
 *
 * What the spec does NOT say is what the filters compare against — DateFrom and
 * DateTo are described only as "Job date (from/to)", with no word on which of a
 * job's dates that is. Callers must therefore treat the filter as a narrowing
 * convenience, never as proof of a job's age.
 *
 * `JobStatus` is `string[]` on the wire; it is narrowed to `JobStatus[]` here so
 * that a filter can only be built from statuses this codebase knows.
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
 * `POST /Jobs/searchJobDetails` puts its jobs in `Result.ResponseDetails` — a
 * different place and a different shape (`JobInfo`, with `DateCreatedUnix`)
 * than every other job endpoint.
 *
 * A `ResponseDetails` that is absent or null is an empty result, and says so.
 * A `ResponseDetails` that is present but not an array is not: it means the
 * response is not what the specification describes, and the caller deletes
 * jobs based on what this returns, so it raises rather than reporting "no jobs
 * to do anything about". Entries without a numeric `Id` are dropped, because
 * nothing can be done with a job that cannot be addressed.
 */
export async function searchJobs(
  filter: JobSuchFilter = {}
): Promise<JobSuchergebnis> {
  const pfad = "/Jobs/searchJobDetails";
  const result = await call<EbriefSearchResponse>(pfad, {
    method: "POST",
    body: filter,
  });

  const gesamt = result.ResultMetadata?.TotalCount;
  const details = result.ResponseDetails;
  if (details === undefined || details === null) return { jobs: [], gesamt };
  if (!Array.isArray(details)) {
    throw new EbriefError(
      `eBrief POST ${pfad} returned a Result.ResponseDetails that is not a list`,
      0,
      JSON.stringify(result)
    );
  }

  return {
    jobs: details.filter(
      (job): job is EbriefSearchJob =>
        typeof (job as { Id?: unknown })?.Id === "number"
    ),
    gesamt,
  };
}

/**
 * Price lookup. `POST /Prices` is the one endpoint that puts its payload
 * directly in `Result`, with no list around it.
 *
 * Unlike the job attributes, this endpoint expects real booleans — the API is
 * inconsistent here, so the conversion is contained in this one place. `Pages`
 * is documented as the number of LOGICAL pages, i.e. pages of the file we
 * upload, not sheets of paper.
 */
export function getPrice(opts: {
  pages: number;
  isColor: boolean;
  isDuplex: boolean;
  isTracking: boolean;
}): Promise<EbriefPriceResult> {
  return call<EbriefPriceResult>("/Prices", {
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
        // Enum in the spec: National | International.
        Region: "National",
      },
    },
  });
}

/** eBrief's own rendering of a document, with whatever type eBrief sent. */
export interface MarkierteDatei {
  bytes: ArrayBuffer;
  /** For the `Content-Type` header, derived from what eBrief reported. */
  contentType: string;
  fileName: string;
}

const TYP_NACH_ENDUNG: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  tif: "image/tiff",
  tiff: "image/tiff",
};

function contentTypeFuer(fileType: string | null | undefined, fileName: string): string {
  const endung = (fileType || fileName.split(".").pop() || "")
    .replace(/^\./, "")
    .toLowerCase();
  return TYP_NACH_ENDUNG[endung] ?? "application/octet-stream";
}

/**
 * eBrief's own rendering of the first page with the address zone it detected
 * marked up — the only way to see whether our address block lands where eBrief
 * actually looks.
 *
 * Per the specification this is NOT a raw file download: it answers with the
 * usual JSON envelope carrying a `FileResponseInfo`, whose `FileContent` is
 * base64 and whose summary says PNG ("Get Document First side Image with Stamp
 * by Document ID in PNG Format"). The previous version handed the JSON straight
 * to the browser as `application/pdf`.
 *
 * Because that cannot be checked without credentials, the body is read as bytes
 * and the JSON path is taken only if it actually starts with a `{`; anything
 * else is passed through unchanged with the type eBrief declared. Both readings
 * therefore produce a usable file, and neither corrupts the other's.
 *
 * Shares the same 401-retry tolerance as every other call (the `retryOn401`
 * flag bounds this to a single retry).
 */
export async function getFileWithMark(
  docId: number,
  retryOn401 = true
): Promise<MarkierteDatei> {
  const pfad = `/Docs/${docId}/FileWithMark`;
  const token = await getToken();
  const res = await fetch(`${ebriefBaseUrl()}${pfad}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401 && retryOn401) {
    invalidateToken();
    return getFileWithMark(docId, false);
  }

  if (!res.ok) {
    throw new EbriefError(`eBrief GET ${pfad} failed`, res.status);
  }

  const roh = await res.arrayBuffer();
  if (roh.byteLength === 0) {
    throw new EbriefError(`eBrief GET ${pfad} returned an empty body`, res.status);
  }

  // First non-whitespace byte. `{` means the documented JSON envelope; a raw
  // file starts with its own magic bytes (%PDF, \x89PNG) and never with one.
  const ersteZeichen = new Uint8Array(roh, 0, Math.min(8, roh.byteLength));
  const istJson = ersteZeichen.find((b) => b > 0x20) === 0x7b;

  if (!istJson) {
    const kopfTyp = res.headers.get("content-type")?.split(";")[0]?.trim();
    return {
      bytes: roh,
      contentType: kopfTyp || "application/octet-stream",
      fileName: `dokument-${docId}`,
    };
  }

  const parsed = parseEnvelope<EbriefFileResponse>(
    new TextDecoder().decode(roh),
    "GET",
    pfad,
    res.status
  );
  if (parsed.ErrorMessage) {
    throw new EbriefError(parsed.ErrorMessage, res.status);
  }

  const inhalt = parsed.Result?.FileContent;
  if (!inhalt) {
    throw new EbriefError(
      `eBrief GET ${pfad} returned no FileContent`,
      0,
      JSON.stringify(parsed.Result)
    );
  }

  const fileName = parsed.Result?.FileName || `dokument-${docId}`;
  // Copied out of the Buffer rather than handed over as-is: `Buffer.from`
  // returns a view into a shared pool for small payloads, whose `.buffer`
  // holds unrelated bytes as well.
  const dekodiert = Buffer.from(inhalt, "base64");
  return {
    bytes: dekodiert.buffer.slice(
      dekodiert.byteOffset,
      dekodiert.byteOffset + dekodiert.byteLength
    ) as ArrayBuffer,
    contentType: contentTypeFuer(parsed.Result?.FileType, fileName),
    fileName,
  };
}
