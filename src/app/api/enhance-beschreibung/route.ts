import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

interface MangelInput {
  label: string;
  raum: string;
  seit: string;
  beschreibung: string;
}

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
- Gib NUR die umformulierten Beschreibungen zurück, als JSON-Array von Strings
- Die Reihenfolge muss der Eingabe entsprechen`;

export async function POST(request: Request) {
  try {
    const { maengel } = (await request.json()) as { maengel: MangelInput[] };

    if (!maengel || !Array.isArray(maengel) || maengel.length === 0) {
      return NextResponse.json(
        { error: "Keine Mängel angegeben." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        beschreibungen: maengel.map((m) => m.beschreibung),
      });
    }

    const client = new Anthropic({ apiKey });

    const userMessage = maengel
      .map(
        (m, i) =>
          `Mangel ${i + 1}: "${m.label}"${m.raum ? ` (Raum: ${m.raum})` : ""}${m.seit ? ` (seit: ${m.seit})` : ""}\nBeschreibung: ${m.beschreibung || "(keine Beschreibung)"}`
      )
      .join("\n\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({
        beschreibungen: maengel.map((m) => m.beschreibung),
      });
    }

    const beschreibungen = JSON.parse(jsonMatch[0]) as string[];

    if (beschreibungen.length !== maengel.length) {
      return NextResponse.json({
        beschreibungen: maengel.map((m) => m.beschreibung),
      });
    }

    return NextResponse.json({ beschreibungen });
  } catch {
    return NextResponse.json({
      beschreibungen: [],
      fallback: true,
    });
  }
}
