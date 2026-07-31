const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** One hour of headroom so no call ever hits an expiring token. */
const REFRESH_MARGIN_MS = 60 * 60 * 1000;

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cached: CachedToken | null = null;
/** Keeps concurrent requests from each firing their own token request. */
let inFlight: Promise<string> | null = null;

export function ebriefBaseUrl(): string {
  return process.env.EBRIEF_BASE_URL || "https://api.staging.ebrief.de";
}

export function ebriefKonfiguriert(): boolean {
  return Boolean(process.env.EBRIEF_USER && process.env.EBRIEF_PASSWORD);
}

/**
 * The docs describe this endpoint as POST, but the official code sample uses
 * GET. We try GET and fall back to POST on 405.
 */
async function fetchToken(): Promise<string> {
  const user = process.env.EBRIEF_USER;
  const password = process.env.EBRIEF_PASSWORD;
  if (!user || !password) throw new Error("eBrief credentials missing");

  const url = `${ebriefBaseUrl()}/oauth2/token/generateBearerToken`;
  const headers = {
    Authorization: `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`,
    "Content-Type": "application/json",
  };

  let res = await fetch(url, { method: "GET", headers });
  if (res.status === 405) res = await fetch(url, { method: "POST", headers });

  if (!res.ok) {
    throw new Error(`eBrief token request failed: ${res.status}`);
  }

  const body = (await res.json()) as {
    GenerateBearerTokenResult?: string;
    Result?: string;
  };
  const token = body.GenerateBearerTokenResult ?? body.Result;
  if (!token) throw new Error("eBrief token response contained no token");
  return token;
}

export async function getToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt - REFRESH_MARGIN_MS) {
    return cached.token;
  }
  if (inFlight) return inFlight;

  inFlight = fetchToken()
    .then((token) => {
      cached = { token, expiresAt: Date.now() + TOKEN_TTL_MS };
      return token;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/** After a 401, fetch once more — the token may have been invalidated server-side. */
export function invalidateToken(): void {
  cached = null;
}
