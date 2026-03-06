# Design: KI-Anreicherung der Mangelbeschreibungen

## Zusammenfassung

Die Mangelbeschreibungen im Mängelanzeige-Brief werden durch Claude Haiku stilistisch aufgewertet. Der Brief bleibt template-basiert — nur die Beschreibungstexte werden angereichert (sachlich, juristisch klar, Musterbrief-konform).

## Architektur

```
User-Beschreibung (Schritt 2 im Wizard)
  → POST /api/enhance-beschreibung
  → Claude Haiku API (System-Prompt: Musterbrief-Stil)
  → Angereicherte Beschreibungen
  → Einsetzen in bestehendes Brief-Template
  → generateBriefText / generatePdf wie bisher
```

## Neue API-Route: POST /api/enhance-beschreibung

**Input:**
```json
{
  "maengel": [
    {
      "label": "Schimmelbildung (leicht)",
      "raum": "Schlafzimmer",
      "seit": "Januar 2026",
      "beschreibung": "An der Wand hinter dem Bett ist Schimmel"
    }
  ]
}
```

**Output:**
```json
{
  "beschreibungen": [
    "An der Außenwand hinter dem Bett im Schlafzimmer hat sich seit Januar 2026 sichtbarer Schimmelbefall gebildet. Der Schimmel erstreckt sich über die betroffene Wandfläche und stellt eine erhebliche Beeinträchtigung der Wohnqualität sowie ein potenzielles Gesundheitsrisiko dar."
  ]
}
```

**Verarbeitung:**
- Anthropic SDK (`@anthropic-ai/sdk`)
- Modell: `claude-haiku-4-5-20251001`
- System-Prompt hält Stil strikt am Musterbrief
- Alle Mängel in einer Request (günstiger, schneller)
- Fallback: Bei API-Fehler Original-Beschreibungen verwenden

## System-Prompt (Entwurf)

```
Du bist ein juristischer Textassistent für Mängelanzeigen im deutschen Mietrecht.

Aufgabe: Formuliere die vom Mieter eingegebene Mangelbeschreibung zu einem sachlichen,
präzisen Text um, der in eine formelle Mängelanzeige gemäß § 536 BGB passt.

Regeln:
- Sachlicher, formeller Ton (kein emotionaler oder umgangssprachlicher Stil)
- Präzise Beschreibung des Mangels und seiner Auswirkungen auf die Wohnqualität
- Erwähne den betroffenen Raum und den Zeitraum, falls angegeben
- 2-4 Sätze pro Mangel
- Keine Rechtsberatung, keine Paragraphen-Verweise (die stehen bereits im Template)
- Keine Erfindungen — nur was der Mieter beschrieben hat, sachlich umformulieren
```

## Integration in den Wizard

Die Anreicherung erfolgt beim Übergang von Schritt 2 (Mangeldetails) zu Schritt 3 (Vorschau). Der User sieht in der Vorschau den angereicherten Text im vollständigen Brief.

## Erweiterbarkeit: Muttersprache (später)

Gleiche Route, zusätzliches Feld `sprache: "tr" | "ar" | "uk" | ...`. Der System-Prompt wird erweitert um: "Der Mieter hat die Beschreibung in [Sprache] verfasst. Übersetze und integriere den Text sachlich ins Deutsche."

## Kosten

- ~200-500 Token pro Mangel (Input + Output)
- Haiku: $0.80/1M Input, $4/1M Output
- Pro Brief (3 Mängel): ~$0.002-0.005
- Vernachlässigbar im Verhältnis zu eBrief.de (4,99€/Brief)

## Umgebungsvariablen

- `ANTHROPIC_API_KEY` — API-Key für Claude Haiku
