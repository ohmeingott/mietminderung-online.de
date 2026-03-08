import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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

    await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        timestamp: new Date().toISOString(),
      }),
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
