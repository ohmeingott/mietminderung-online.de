import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";

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

    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-Mail ist erforderlich." },
        { status: 400 }
      );
    }

    // Save to database (upsert to avoid duplicates)
    await prisma.emailSubscriber.upsert({
      where: { email },
      update: { name: name || undefined },
      create: { email, name: name || null },
    });

    // Also forward to Google Sheets if configured (optional, for backwards compatibility)
    const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (sheetUrl) {
      fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => {
        console.error("Google Sheets sync error (non-critical):", err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save email error:", err);
    return NextResponse.json(
      { error: "Fehler beim Speichern." },
      { status: 500 }
    );
  }
}
