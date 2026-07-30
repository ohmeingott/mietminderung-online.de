import { site } from "@/lib/site";
import type { RenderedEmail } from "@/lib/email/templates";

/**
 * Minimal Resend client via plain fetch — one endpoint, no SDK dependency.
 * Env is read inside the function (CI builds without secrets). Callers must
 * treat `ok: false` as a real failure and surface it; sends are never
 * fire-and-forget.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(params: {
  to: string;
  email: RenderedEmail;
  /** Withdrawal URL — becomes the RFC 8058 List-Unsubscribe target. */
  unsubscribeUrl?: string;
}): Promise<{ ok: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false };

  const from =
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    `Mietminderung Online <erinnerung@mietminderung.online>`;

  const headers: Record<string, string> = {};
  if (params.unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${params.unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        reply_to: site.operator.email,
        subject: params.email.subject,
        html: params.email.html,
        text: params.email.text,
        ...(Object.keys(headers).length ? { headers } : {}),
      }),
    });
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch {
    return { ok: false };
  }
}
