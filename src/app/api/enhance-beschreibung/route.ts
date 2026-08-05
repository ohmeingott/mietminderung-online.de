import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import {
  MAX_MAENGEL,
  baueAnfrage,
  istGueltigeAntwort,
  verteileAntworten,
  zuUeberarbeiten,
  type MangelInput,
} from "@/lib/brief/beschreibungen";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/**
 * The instructions the first printed letter argued against.
 *
 * That letter said a heating failure "führt zu einer erheblichen
 * Beeinträchtigung der Raumtemperatur und der allgemeinen Wohnqualität" and
 * that a wasps' nest had been found "im Bereich der Mietwohnung". Neither
 * sentence carried information the defect label did not already carry, and
 * neither told the landlord where to send anyone. Three rules produced that:
 *
 *  - "2-4 Sätze pro Mangel" made padding mandatory when the tenant had written
 *    one clear sentence, and those extra lines are what pushed the letter onto
 *    a second sheet;
 *  - "Auswirkungen auf die Wohnqualität" asked for the filler sentence by name;
 *  - "falls die Beschreibung leer ist, erstelle … eine allgemeine
 *    Beschreibung" contradicted "keine Erfindungen" three lines above, and the
 *    invention won. Empty descriptions no longer reach the model at all — see
 *    zuUeberarbeiten in src/lib/brief/beschreibungen.ts.
 *
 * A Mängelanzeige is read by someone deciding whether to send a tradesman. Its
 * job is to say what is broken and where, not to sound legal.
 */
const SYSTEM_PROMPT = `Du bist ein Textassistent für Mängelanzeigen im deutschen Mietrecht.

Aufgabe: Bringe die Beschreibung des Mieters in eine sachliche Form, die in eine formelle Mängelanzeige passt. Du formulierst um, du schreibst nicht neu.

Regeln:
- Ist die Beschreibung fremdsprachig (Türkisch, Russisch, Ukrainisch, Arabisch, Polnisch oder andere), übersetze sie zuerst ins Deutsche.
- Sachlicher Ton, keine Umgangssprache, keine Ausrufezeichen.
- So kurz wie möglich: höchstens zwei Sätze, lieber einer. Ist die Eingabe ein Satz, bleibt es ein Satz.
- Füge nichts hinzu. Keine Folgen, keine Bewertungen, keine Wendungen wie "beeinträchtigt die Wohnqualität", "stellt eine erhebliche Beeinträchtigung dar" oder "potenzielle Gefahr". Was der Mieter nicht geschrieben hat, steht nicht im Brief.
- Bleib konkret. Übernimm Orts- und Zeitangaben genau so, wie sie dastehen, und verallgemeinere sie nicht: aus "im Schlafzimmer hinter dem Schrank" darf nicht "im Bereich der Wohnung" werden.
- Raum und Zeitpunkt stehen bereits an anderer Stelle im Brief. Wiederhole sie nicht.
- Keine Paragraphen, keine Rechtsberatung.
- Gib genau eine Beschreibung pro Mangel zurück, in der Reihenfolge der Eingabe.`;

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

    const indizes = zuUeberarbeiten(maengel);
    if (indizes.length === 0) {
      // Nobody described anything. Calling the model here would only produce
      // sentences out of defect labels, which is what this route no longer
      // does — and it would cost a request to say nothing.
      return NextResponse.json({
        beschreibungen: maengel.map((m) => m.beschreibung),
        fallback: true,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // No key configured - hand the user's own text back unchanged.
      return NextResponse.json({
        beschreibungen: maengel.map((m) => m.beschreibung),
        fallback: true,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: baueAnfrage(maengel, indizes),
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

    if (!istGueltigeAntwort(parsed.beschreibungen, indizes.length)) {
      return NextResponse.json({
        beschreibungen: maengel.map((m) => m.beschreibung),
        fallback: true,
      });
    }

    return NextResponse.json({
      beschreibungen: verteileAntworten(maengel, indizes, parsed.beschreibungen),
    });
  } catch (err) {
    console.error("Gemini enhance error:", err);
    // Never block the user's letter on an AI failure - return their own text.
    return NextResponse.json({
      beschreibungen: maengel.map((m) => m.beschreibung),
      fallback: true,
    });
  }
}
