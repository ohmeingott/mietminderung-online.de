import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

interface MangelInput {
  label: string;
  raum: string;
  seit: string;
  beschreibung: string;
}

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `Du bist ein juristischer Textassistent für Mängelanzeigen im deutschen Mietrecht.

Aufgabe: Formuliere die vom Mieter eingegebene Mangelbeschreibung zu einem sachlichen, präzisen Text um, der in eine formelle Mängelanzeige gemäß § 536 BGB passt.

Regeln:
- Falls die Beschreibung in einer Fremdsprache (Türkisch, Russisch, Ukrainisch, Arabisch, Polnisch oder andere) verfasst ist, übersetze sie zunächst ins Deutsche
- Sachlicher, formeller Ton (kein emotionaler oder umgangssprachlicher Stil)
- Präzise Beschreibung des Mangels und seiner Auswirkungen auf die Wohnqualität
- Erwähne den betroffenen Raum und den Zeitraum, falls angegeben
- 2-4 Sätze pro Mangel
- Keine Rechtsberatung, keine Paragraphen-Verweise (die stehen bereits im Brief-Template)
- Keine Erfindungen — nur was der Mieter beschrieben hat, sachlich umformulieren
- Falls die Beschreibung leer ist, erstelle anhand des Mangel-Typs eine kurze, allgemeine Beschreibung
- Gib genau eine umformulierte Beschreibung pro Mangel zurück, in der Reihenfolge der Eingabe`;

/** Longest a single defect description may be, to bound prompt size. */
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_MAENGEL = 30;

export async function POST(request: Request) {
  let maengel: MangelInput[] = [];

  try {
    const body = (await request.json()) as { maengel?: MangelInput[] };
    maengel = Array.isArray(body.maengel) ? body.maengel : [];

    if (maengel.length === 0) {
      return NextResponse.json(
        { error: "Keine Mängel angegeben." },
        { status: 400 }
      );
    }

    if (maengel.length > MAX_MAENGEL) {
      return NextResponse.json(
        { error: "Zu viele Mängel angegeben." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // No key configured — hand the user's own text back unchanged.
      return NextResponse.json({
        beschreibungen: maengel.map((m) => m.beschreibung),
        fallback: true,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const userMessage = maengel
      .map((m, i) => {
        const raum = m.raum ? ` (Raum: ${m.raum})` : "";
        const seit = m.seit ? ` (seit: ${m.seit})` : "";
        const text = (m.beschreibung || "").slice(0, MAX_DESCRIPTION_LENGTH);
        return `Mangel ${i + 1}: "${m.label}"${raum}${seit}\nBeschreibung: ${
          text || "(keine Beschreibung)"
        }`;
      })
      .join("\n\n");

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            beschreibungen: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "Eine umformulierte Beschreibung pro Mangel, in der Reihenfolge der Eingabe.",
            },
          },
          required: ["beschreibungen"],
        },
      },
    });

    const parsed = JSON.parse(response.text ?? "{}") as {
      beschreibungen?: unknown;
    };
    const beschreibungen = parsed.beschreibungen;

    const isValid =
      Array.isArray(beschreibungen) &&
      beschreibungen.length === maengel.length &&
      beschreibungen.every((b) => typeof b === "string");

    if (!isValid) {
      return NextResponse.json({
        beschreibungen: maengel.map((m) => m.beschreibung),
        fallback: true,
      });
    }

    return NextResponse.json({ beschreibungen });
  } catch (err) {
    console.error("Gemini enhance error:", err);
    // Never block the user's letter on an AI failure — return their own text.
    return NextResponse.json({
      beschreibungen: maengel.map((m) => m.beschreibung),
      fallback: true,
    });
  }
}
