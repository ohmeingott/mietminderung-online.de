import { NextRequest, NextResponse } from "next/server";
import { withRetry, fetchWithTimeout, isRetryableError } from "@/lib/retry";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getIdempotentResult, setIdempotentResult } from "@/lib/idempotency";
import crypto from "crypto";

const EBRIEF_API_URL =
  process.env.EBRIEF_API_URL || "https://api.ebrief.de";
const EBRIEF_USERNAME = process.env.EBRIEF_USERNAME || "";
const EBRIEF_PASSWORD = process.env.EBRIEF_PASSWORD || "";

async function getEbriefToken(): Promise<string> {
  const credentials = Buffer.from(
    `${EBRIEF_USERNAME}:${EBRIEF_PASSWORD}`
  ).toString("base64");

  return withRetry(
    async () => {
      const response = await fetchWithTimeout(
        `${EBRIEF_API_URL}/oauth2/token/generateBearerToken`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
          timeoutMs: 15000,
        }
      );

      if (!response.ok) {
        const status = response.status;
        if (status >= 500 || status === 429) {
          throw new Error(`eBrief auth failed (retryable): ${status}`);
        }
        throw new Error(`eBrief auth failed: ${status}`);
      }

      const data = await response.json();
      return data.token || data.access_token || data;
    },
    {
      maxRetries: 2,
      initialDelayMs: 1000,
      timeoutMs: 20000,
      retryOn: isRetryableError,
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: max 3 letter sends per IP per hour
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`send-letter:${clientIp}`, {
      windowMs: 60 * 60 * 1000,
      maxRequests: 3,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut.",
          retryAfterMs: rateCheck.retryAfterMs,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { pdfBase64, notificationEmail, idempotencyKey } = body;

    if (!pdfBase64) {
      return NextResponse.json(
        { error: "PDF-Daten sind erforderlich." },
        { status: 400 }
      );
    }

    // Idempotency check: prevent duplicate letter sends
    const dedupKey =
      idempotencyKey ||
      crypto
        .createHash("sha256")
        .update(pdfBase64.slice(0, 1000) + (notificationEmail || ""))
        .digest("hex");

    const cachedResult = await getIdempotentResult(dedupKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    if (!EBRIEF_USERNAME || !EBRIEF_PASSWORD) {
      return NextResponse.json(
        { error: "eBrief-Zugangsdaten sind nicht konfiguriert." },
        { status: 500 }
      );
    }

    // Step 1: Get Bearer Token (with retry)
    const token = await getEbriefToken();

    // Step 2: Create a single-file job (with retry)
    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    const jobId = await withRetry(
      async () => {
        const formData = new FormData();
        formData.append(
          "file",
          new Blob([pdfBuffer], { type: "application/pdf" }),
          "Maengelanzeige.pdf"
        );
        formData.append(
          "attributes",
          JSON.stringify({
            IsDuplex: "false",
            IsColor: "false",
            IsTracking: "true",
            NotificationMail: notificationEmail || "",
            AdressCheck: "true",
            SilentConfirm: "false",
            EnvelopeFormat: "DIN_LANG",
            Franking: "tiny",
          })
        );

        const jobResponse = await fetchWithTimeout(
          `${EBRIEF_API_URL}/jobs/singleFiles`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
            timeoutMs: 30000,
          }
        );

        if (!jobResponse.ok) {
          const errText = await jobResponse.text();
          console.error("eBrief job creation failed:", errText);
          if (jobResponse.status >= 500 || jobResponse.status === 429) {
            throw new Error(`Retryable: ${jobResponse.status}`);
          }
          throw new Error(
            `Brief-Auftrag konnte nicht erstellt werden (${jobResponse.status}).`
          );
        }

        const job = await jobResponse.json();
        return job.id || job.Id || job.jobId;
      },
      {
        maxRetries: 2,
        initialDelayMs: 2000,
        timeoutMs: 45000,
        retryOn: (err) =>
          isRetryableError(err) ||
          (err instanceof Error && err.message.startsWith("Retryable")),
      }
    );

    // Step 3: Commit the job (with retry)
    await withRetry(
      async () => {
        const commitResponse = await fetchWithTimeout(
          `${EBRIEF_API_URL}/jobs/${jobId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: "COMMIT" }),
            timeoutMs: 15000,
          }
        );

        if (!commitResponse.ok) {
          const errText = await commitResponse.text();
          console.error("eBrief commit failed:", errText);
          throw new Error(`Commit failed: ${commitResponse.status}`);
        }
      },
      { maxRetries: 2, initialDelayMs: 1000, retryOn: isRetryableError }
    );

    // Step 4: Distribute (with retry)
    await withRetry(
      async () => {
        const distResponse = await fetchWithTimeout(
          `${EBRIEF_API_URL}/jobs/distribution`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ jobId }),
            timeoutMs: 15000,
          }
        );

        if (!distResponse.ok) {
          const errText = await distResponse.text();
          console.error("eBrief distribution failed:", errText);
          throw new Error(`Distribution failed: ${distResponse.status}`);
        }
      },
      { maxRetries: 2, initialDelayMs: 1000, retryOn: isRetryableError }
    );

    const result = {
      success: true,
      jobId,
      message: "Brief wurde erfolgreich zum Versand übergeben.",
    };

    // Cache result for idempotency
    await setIdempotentResult(dedupKey, result);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Send letter error:", err);
    const message =
      err instanceof Error && !err.message.startsWith("Retryable")
        ? err.message
        : "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
