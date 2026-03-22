import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { withRetry, isRetryableError } from "@/lib/retry";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: max 5 emails per IP per hour
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`send-email:${clientIp}`, {
      windowMs: 60 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "E-Mail-Service ist nicht konfiguriert." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const body = await request.json();
    const { to, mieterName, pdfBase64 } = body;

    if (!to || !pdfBase64) {
      return NextResponse.json(
        { error: "E-Mail-Adresse und PDF sind erforderlich." },
        { status: 400 }
      );
    }

    const datum = new Date().toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Send email with retry for transient failures
    const { data, error } = await withRetry(
      async () => {
        const result = await resend.emails.send({
          from:
            process.env.RESEND_FROM_EMAIL ||
            "Mietminderung.online <noreply@mietminderung.online>",
          to: [to],
          subject: `Ihre Mängelanzeige vom ${datum}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1e40af;">Ihre Mängelanzeige</h2>
              <p>Guten Tag${mieterName ? ` ${mieterName}` : ""},</p>
              <p>anbei finden Sie Ihre Mängelanzeige als PDF-Datei. Bitte drucken Sie den Brief aus und senden Sie ihn an Ihren Vermieter — am besten per <strong>Einwurf-Einschreiben</strong>.</p>

              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <h3 style="color: #0369a1; margin-top: 0;">Wichtige Hinweise:</h3>
                <ul style="color: #334155; line-height: 1.8;">
                  <li>Versenden Sie die Mängelanzeige <strong>nachweisbar</strong> (Einwurf-Einschreiben empfohlen)</li>
                  <li>Bewahren Sie eine Kopie und den Einlieferungsbeleg auf</li>
                  <li>Zahlen Sie die Miete <strong>unter Vorbehalt</strong> weiter (im Überweisungszweck vermerken)</li>
                  <li>Dokumentieren Sie den Mangel weiterhin mit Fotos und Protokollen</li>
                </ul>
              </div>

              <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
                Diese E-Mail wurde automatisch von mietminderung.online erstellt. Die bereitgestellten Informationen stellen keine Rechtsberatung dar.
              </p>
            </div>
          `,
          attachments: [
            {
              filename: `Maengelanzeige_${datum.replace(/\./g, "-")}.pdf`,
              content: pdfBase64,
            },
          ],
        });

        if (result.error) {
          throw new Error(result.error.message || "Resend API error");
        }
        return result;
      },
      {
        maxRetries: 2,
        initialDelayMs: 1000,
        timeoutMs: 30000,
        retryOn: isRetryableError,
      }
    );

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "E-Mail konnte nicht gesendet werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
