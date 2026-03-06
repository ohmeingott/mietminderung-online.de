# KI-Anreicherung der Mangelbeschreibungen - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance user-written defect descriptions with Claude Haiku before generating the Mängelanzeige letter, keeping the existing template intact.

**Architecture:** New API route `/api/enhance-beschreibung` calls Claude Haiku to rephrase defect descriptions in formal legal German. Called when transitioning from wizard step 2→3. Fallback to original text on error.

**Tech Stack:** `@anthropic-ai/sdk`, Claude Haiku (`claude-haiku-4-5-20251001`), Next.js API route

---

### Task 1: Install Anthropic SDK

**Files:**
- Modify: `package.json`

**Step 1: Install the dependency**

Run: `npm install @anthropic-ai/sdk`

**Step 2: Verify installation**

Run: `npm ls @anthropic-ai/sdk`
Expected: Shows installed version

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @anthropic-ai/sdk dependency"
```

---

### Task 2: Create the API route

**Files:**
- Create: `src/app/api/enhance-beschreibung/route.ts`

**Step 1: Create the API route file**

```typescript
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
- Sachlicher, formeller Ton (kein emotionaler oder umgangssprachlicher Stil)
- Präzise Beschreibung des Mangels und seiner Auswirkungen auf die Wohnqualität
- Erwähne den betroffenen Raum und den Zeitraum, falls angegeben
- 2-4 Sätze pro Mangel
- Keine Rechtsberatung, keine Paragraphen-Verweise (die stehen bereits im Brief-Template)
- Keine Erfindungen — nur was der Mieter beschrieben hat, sachlich umformulieren
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
      // No API key configured — return originals
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

    // Parse JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // Fallback: return originals
      return NextResponse.json({
        beschreibungen: maengel.map((m) => m.beschreibung),
      });
    }

    const beschreibungen = JSON.parse(jsonMatch[0]) as string[];

    // Ensure we have the right number of results
    if (beschreibungen.length !== maengel.length) {
      return NextResponse.json({
        beschreibungen: maengel.map((m) => m.beschreibung),
      });
    }

    return NextResponse.json({ beschreibungen });
  } catch {
    // On any error, return originals from request body
    try {
      const body = await request.clone().json();
      return NextResponse.json({
        beschreibungen: (body.maengel || []).map(
          (m: MangelInput) => m.beschreibung
        ),
      });
    } catch {
      return NextResponse.json(
        { error: "Interner Fehler." },
        { status: 500 }
      );
    }
  }
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors (or only pre-existing ones)

**Step 3: Commit**

```bash
git add src/app/api/enhance-beschreibung/route.ts
git commit -m "feat: add /api/enhance-beschreibung API route with Claude Haiku"
```

---

### Task 3: Integrate into Maengelanzeige wizard

**Files:**
- Modify: `src/components/Maengelanzeige.tsx` (lines 649-651 — the step 2→3 transition button, plus new state)

**Step 1: Add enhancing state and handler**

Add after the existing state declarations (around line 93, after `postError` state):

```typescript
const [enhancing, setEnhancing] = useState(false);
```

Add a new function after `generateBriefText` (around line 185):

```typescript
const enhanceBeschreibungen = async () => {
  setEnhancing(true);
  try {
    const res = await fetch("/api/enhance-beschreibung", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        maengel: selectedMaengel.map((m, i) => ({
          label: m.label,
          raum: mangelDetails[i]?.raum || "",
          seit: mangelDetails[i]?.seit || "",
          beschreibung: mangelDetails[i]?.beschreibung || "",
        })),
      }),
    });
    const data = await res.json();
    if (data.beschreibungen && Array.isArray(data.beschreibungen)) {
      const updated = mangelDetails.map((d, i) => ({
        ...d,
        beschreibung: data.beschreibungen[i] || d.beschreibung,
      }));
      setMangelDetails(updated);
    }
  } catch {
    // Silently fall back to original descriptions
  } finally {
    setEnhancing(false);
    setStep(3);
  }
};
```

**Step 2: Replace the "Vorschau anzeigen" button handler**

Change the button at line 649-655 from:

```tsx
<button
  onClick={() => setStep(3)}
  className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors"
>
  Vorschau anzeigen
  <ArrowRight className="w-4 h-4" />
</button>
```

To:

```tsx
<button
  onClick={enhanceBeschreibungen}
  disabled={enhancing}
  className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-60"
>
  {enhancing ? (
    <>
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Brief wird erstellt...
    </>
  ) : (
    <>
      Vorschau anzeigen
      <ArrowRight className="w-4 h-4" />
    </>
  )}
</button>
```

**Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/components/Maengelanzeige.tsx
git commit -m "feat: integrate Claude Haiku enhancement into wizard step 2→3 transition"
```

---

### Task 4: Add environment variable and verify end-to-end

**Files:**
- Create: `.env.local` (if not exists, add `ANTHROPIC_API_KEY`)
- Modify: `.env.example` or document in CLAUDE.md

**Step 1: Add API key to .env.local**

Add to `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

**Step 2: Manual end-to-end test**

Run: `npm run dev`

Test flow:
1. Select a defect in the checker
2. Fill in tenant + landlord data (steps 0-1)
3. In step 2, write a casual description like "schimmel an der wand seit wochen, stinkt und sieht eklig aus"
4. Click "Vorschau anzeigen"
5. Verify: spinner shows "Brief wird erstellt...", then preview shows a formal, sachlich description
6. Verify: the rest of the letter template is unchanged (addresses, legal clauses, etc.)

**Step 3: Test fallback (no API key)**

Remove ANTHROPIC_API_KEY from `.env.local`, restart dev server. Verify the wizard still works and shows original descriptions.

**Step 4: Commit**

```bash
git add .env.example CLAUDE.md
git commit -m "docs: add ANTHROPIC_API_KEY to env configuration"
```
