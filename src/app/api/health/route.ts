import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/retry";

interface ServiceStatus {
  name: string;
  status: "ok" | "error" | "unconfigured";
  responseTimeMs?: number;
  error?: string;
}

async function checkService(
  name: string,
  checkFn: () => Promise<void>
): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await checkFn();
    return { name, status: "ok", responseTimeMs: Date.now() - start };
  } catch (err) {
    return {
      name,
      status: "error",
      responseTimeMs: Date.now() - start,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function GET() {
  const services: ServiceStatus[] = [];

  // Check Anthropic API
  if (process.env.ANTHROPIC_API_KEY) {
    services.push(
      await checkService("anthropic", async () => {
        const res = await fetchWithTimeout("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1,
            messages: [{ role: "user", content: "hi" }],
          }),
          timeoutMs: 10000,
        });
        if (!res.ok && res.status !== 400) {
          throw new Error(`Status ${res.status}`);
        }
      })
    );
  } else {
    services.push({ name: "anthropic", status: "unconfigured" });
  }

  // Check Resend
  if (process.env.RESEND_API_KEY) {
    services.push(
      await checkService("resend", async () => {
        const res = await fetchWithTimeout("https://api.resend.com/domains", {
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
          timeoutMs: 10000,
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
      })
    );
  } else {
    services.push({ name: "resend", status: "unconfigured" });
  }

  // Check eBrief
  if (process.env.EBRIEF_USERNAME && process.env.EBRIEF_PASSWORD) {
    const ebriefUrl = process.env.EBRIEF_API_URL || "https://api.ebrief.de";
    services.push(
      await checkService("ebrief", async () => {
        const credentials = Buffer.from(
          `${process.env.EBRIEF_USERNAME}:${process.env.EBRIEF_PASSWORD}`
        ).toString("base64");
        const res = await fetchWithTimeout(
          `${ebriefUrl}/oauth2/token/generateBearerToken`,
          {
            headers: {
              Authorization: `Basic ${credentials}`,
              "Content-Type": "application/json",
            },
            timeoutMs: 10000,
          }
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
      })
    );
  } else {
    services.push({ name: "ebrief", status: "unconfigured" });
  }

  // Check Google Sheets webhook
  if (process.env.GOOGLE_SHEET_WEBHOOK_URL) {
    services.push({ name: "google-sheets", status: "ok" });
  } else {
    services.push({ name: "google-sheets", status: "unconfigured" });
  }

  const allOk = services.every((s) => s.status !== "error");

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      services,
    },
    { status: allOk ? 200 : 503 }
  );
}
