import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/retry";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: max 5 email saves per IP per hour
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`save-email:${clientIp}`, {
      windowMs: 60 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen." },
        { status: 429 }
      );
    }

    const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (!sheetUrl) {
      return NextResponse.json(
        { error: "Google Sheet webhook not configured." },
        { status: 500 }
      );
    }

    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-Mail ist erforderlich." },
        { status: 400 }
      );
    }

    await fetchWithTimeout(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        timestamp: new Date().toISOString(),
      }),
      timeoutMs: 10000,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save email error:", err);
    return NextResponse.json(
      { error: "Fehler beim Speichern." },
      { status: 500 }
    );
  }
}
