import { NextRequest, NextResponse } from "next/server";

const EBRIEF_API_URL =
  process.env.EBRIEF_API_URL || "https://api.ebrief.de";
const EBRIEF_USERNAME = process.env.EBRIEF_USERNAME || "";
const EBRIEF_PASSWORD = process.env.EBRIEF_PASSWORD || "";

async function getEbriefToken(): Promise<string> {
  const credentials = Buffer.from(
    `${EBRIEF_USERNAME}:${EBRIEF_PASSWORD}`
  ).toString("base64");

  const response = await fetch(
    `${EBRIEF_API_URL}/oauth2/token/generateBearerToken`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`eBrief auth failed: ${response.status}`);
  }

  const data = await response.json();
  return data.token || data.access_token || data;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pdfBase64, notificationEmail } = body;

    if (!pdfBase64) {
      return NextResponse.json(
        { error: "PDF-Daten sind erforderlich." },
        { status: 400 }
      );
    }

    if (!EBRIEF_USERNAME || !EBRIEF_PASSWORD) {
      return NextResponse.json(
        { error: "eBrief-Zugangsdaten sind nicht konfiguriert." },
        { status: 500 }
      );
    }

    // Step 1: Get Bearer Token
    const token = await getEbriefToken();

    // Step 2: Create a single-file job
    const pdfBuffer = Buffer.from(pdfBase64, "base64");

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
        IsTracking: "true", // Einschreiben
        NotificationMail: notificationEmail || "",
        AdressCheck: "true",
        SilentConfirm: "false",
        EnvelopeFormat: "DIN_LANG",
        Franking: "tiny",
      })
    );

    const jobResponse = await fetch(`${EBRIEF_API_URL}/jobs/singleFiles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!jobResponse.ok) {
      const errText = await jobResponse.text();
      console.error("eBrief job creation failed:", errText);
      return NextResponse.json(
        { error: "Brief-Auftrag konnte nicht erstellt werden." },
        { status: 500 }
      );
    }

    const job = await jobResponse.json();
    const jobId = job.id || job.Id || job.jobId;

    // Step 3: Commit the job
    const commitResponse = await fetch(`${EBRIEF_API_URL}/jobs/${jobId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "COMMIT" }),
    });

    if (!commitResponse.ok) {
      const errText = await commitResponse.text();
      console.error("eBrief commit failed:", errText);
      return NextResponse.json(
        { error: "Brief-Auftrag konnte nicht bestätigt werden." },
        { status: 500 }
      );
    }

    // Step 4: Distribute (send to printer)
    const distResponse = await fetch(`${EBRIEF_API_URL}/jobs/distribution`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId }),
    });

    if (!distResponse.ok) {
      const errText = await distResponse.text();
      console.error("eBrief distribution failed:", errText);
      return NextResponse.json(
        { error: "Brief konnte nicht zum Druck freigegeben werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      jobId,
      message: "Brief wurde erfolgreich zum Versand übergeben.",
    });
  } catch (err) {
    console.error("Send letter error:", err);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
