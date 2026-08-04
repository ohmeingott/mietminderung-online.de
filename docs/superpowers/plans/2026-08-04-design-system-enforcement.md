# Design-System-Durchsetzung: Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die 12 SEO-Content-Dateien auf das vorhandene Design-Token-Set umstellen, alle 36 Buttons durch eine Komponente ersetzen und den Rückfall per ESLint-Regel technisch unmöglich machen.

**Architecture:** Die App besteht aus zwei Code-Generationen mit sauberer Naht — 12 Content-Dateien fahren ausschließlich auf rohen Tailwind-Paletten, 33 Produkt-Dateien ausschließlich auf Tokens. Keine Datei mischt. Der Produkt-Layer ist das Ziel; der Content-Layer zieht nach. Die ESLint-Regel läuft von Anfang an als `warn` mit, damit jeder Schritt eine messbare Zahl hat, und wird zuletzt auf `error` gestellt.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, ESLint 9 (Flat Config), Playwright.

**Spec:** `docs/superpowers/specs/2026-08-04-design-system-enforcement-design.md`

---

## Dateistruktur

**Neu:**
- `src/components/ui/Button.tsx` — die einzige Primitive. Vier Varianten, zwei Größen, rendert `<button>` oder `next/link`.
- `scripts/migrate-tokens.sh` — mechanische Farbersetzung pro Datei. Wird in Task 16 wieder gelöscht.

**Geändert:**
- `eslint.config.mjs` — Guardrail, Task 1 (`warn`) und Task 15 (`error`).
- 17 Produkt-Dateien — Buttons und Radien-Kurzform (Tasks 3–5).
- 12 Content-Dateien — Farben, Radien, Buttons (Tasks 6–14).

**Reihenfolge der Content-Dateien:** eine kleine Datei zuerst als Pilot
(`Breadcrumbs.tsx`, 4 Fundstellen), um Mapping und Skript an geringem Risiko zu
prüfen. Danach absteigend nach Größe. Das weicht bewusst von der Spec ab, die
"große zuerst" sagt — der Pilot kostet zehn Minuten und verhindert, dass ein
Mapping-Fehler zuerst in der 520-Zeilen-Datei auffällt.

**Referenz-Mapping** (gilt für alle Content-Tasks):

| von | nach |
|---|---|
| `bg-gray-50` | `bg-paper-sunken` |
| `bg-white` (ohne Alpha) | `bg-paper-raised` — identische Farbe, `--color-paper-raised` ist `#ffffff` |
| `-blue-N` | `-brand-N` — wertidentisch, keine Pixeländerung |
| `-gray-N` | `-ink-N` |
| `bg-amber-50` / `border-amber-400` / `text-amber-900` | `bg-caution-50` / `border-caution-600` / `text-caution-600` |
| `bg-emerald-50` / `border-emerald-100` / `text-emerald-700` / `text-emerald-800` | `bg-signal-50` / `border-signal-600/20` / `text-signal-700` / `text-signal-700` |
| `rounded-xl` / `rounded-2xl` an Karten, Panels, Sektionsboxen | `rounded-card` |
| `rounded-lg` / `rounded-md` / `rounded-xl` an Chips, Feldern, kleinen Kacheln | `rounded-field` |
| `bg-white/10`, `border-white/30`, `text-white` | unverändert |

Die Radien-Zuordnung erfolgt **nach Rolle, nicht nach altem Wert**. Ein
`rounded-xl`-Chip wird `rounded-field`, eine `rounded-xl`-Karte wird
`rounded-card`.

### Überschreiben von Button-Basisklassen (in Task 3 gelernt)

`BASE_CLASSES` setzt `inline-flex`, `SIZE_CLASSES` setzt `px-*`. Beide sind
unpräfixiert. Eine ebenfalls unpräfixierte Klasse in `className` gewinnt
**nicht** — bei gleicher Spezifität entscheidet die Reihenfolge im generierten
Stylesheet, nicht die Reihenfolge im `className`-String. `<Button
className="hidden">` bleibt also sichtbar, `<Button className="px-4">` behält
`px-6`.

Media-Varianten stehen im generierten CSS hinter ihrer Basisklasse und gewinnen
deshalb. Der Weg ist also `max-*`:

| Original | in `<Button>` |
|---|---|
| `hidden … xl:inline-flex` | `className="max-xl:hidden"` |
| `px-4 … sm:px-6` | `className="max-sm:px-4"` |
| `px-4 … sm:px-5` | `className="max-sm:px-4"` bei `size="sm"` |

Gemessen an der kompilierten Tailwind-4-Ausgabe (iframes mit 375/1000/1400px):
Header-CTA `display: none` unter `xl`, `inline-flex` darüber; Versand-Button
`padding-left` 16px unter `sm`, 24px darüber — beides exakt wie im Original.

Im Bestand tritt das nur an drei Buttons auf: `Header.tsx:117`,
`VersandKarte.tsx:627` (beide in Task 3 erledigt) und `ContentHeader.tsx:46`
(`px-4 sm:px-5`, Task 14).

---

### Task 1: ESLint-Guardrail als `warn` einziehen

Die Regel kommt zuerst, nicht zuletzt: sie liefert jedem folgenden Task eine
Messzahl. Als `warn` bricht sie den Build nicht, `npm run lint` bleibt grün.

**Files:**
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Baseline messen**

```bash
npx eslint src 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `0` — die Regel existiert noch nicht.

- [ ] **Step 2: Regel einfügen**

In `eslint.config.mjs` direkt nach `...nextTs,` einfügen:

```js
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\b(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b/]",
          message:
            "Rohe Tailwind-Palette. Nutze die Design-Tokens: brand-* ink-* paper* signal-* caution-* alert-*.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] TemplateElement[value.raw=/\\b(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b/]",
          message:
            "Rohe Tailwind-Palette im Template-Literal. Nutze die Design-Tokens.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\bbg-white(?![\\w/-])/]",
          message:
            "bg-white als Flaeche -> bg-paper-raised (identische Farbe). Alpha wie bg-white/10 ist erlaubt.",
        },
        {
          selector:
            "VariableDeclarator[id.name=/class/i] Literal[value=/\\b(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b/]",
          message: "Rohe Tailwind-Palette in Klassen-Konstante. Nutze die Design-Tokens.",
        },
        {
          selector:
            "VariableDeclarator[id.name=/class/i] TemplateElement[value.raw=/\\b(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b/]",
          message: "Rohe Tailwind-Palette in Klassen-Konstante. Nutze die Design-Tokens.",
        },
      ],
    },
  },
```

- [ ] **Step 3: Regel verifizieren**

```bash
npx eslint src 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `344`.

Verteilung zur Kontrolle (die Regel zählt `className`-Knoten, nicht einzelne
Klassen — ein Attribut mit drei rohen Farben ist ein Treffer):

```
69  src/app/mietminderung/[kategorie]/[mangel]/page.tsx
63  src/app/maengelanzeige-versenden/page.tsx
41  src/app/ratgeber/[slug]/page.tsx
36  src/app/mietminderungstabelle/page.tsx
34  src/app/mietminderung/page.tsx
32  src/app/mietminderung/[kategorie]/page.tsx
19  src/components/content/MinderungRechner.tsx
17  src/app/ratgeber/page.tsx
16  src/components/content/PopularLinks.tsx
 6  src/components/content/ContentHeader.tsx
 5  src/components/content/ContentFooter.tsx
 4  src/components/content/Breadcrumbs.tsx
 1  src/app/faq/FAQPageContent.tsx          <- bg-white, wird in Task 4 zum Button
 1  src/components/wizard/screens/VorschauScreen.tsx  <- bg-white, Task 5
```

- [ ] **Step 4: Lint bleibt grün**

```bash
npm run lint
```

Erwartet: exit 0, Warnungen aber keine Fehler.

- [ ] **Step 5: Commit**

```bash
git add eslint.config.mjs
git commit -m "Mach rohe Tailwind-Paletten sichtbar

Als Warnung, nicht als Fehler: die Migration braucht die Regel als
Fortschrittsanzeige, bevor sie als Sperre taugt.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Button-Komponente anlegen

**Files:**
- Create: `src/components/ui/Button.tsx`

- [ ] **Step 1: Komponente schreiben**

Diese Fassung ist gegen `npx tsc --noEmit` und `npx eslint` geprüft (0 Fehler,
0 Warnungen).

```tsx
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "onDark" | "onDarkGhost";
type Size = "md" | "sm";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const SIZES: Record<Size, string> = {
  md: "min-h-[3rem] px-6",
  sm: "min-h-[2.75rem] px-5 text-sm",
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-800",
  secondary:
    "border border-ink-200 bg-paper-raised text-ink-800 hover:border-brand-300 hover:text-brand-700",
  onDark: "bg-paper-raised text-brand-800 hover:bg-brand-50",
  onDarkGhost: "border border-white/25 text-white hover:bg-white/10",
};

type Styling = {
  variant?: Variant;
  size?: Size;
  /** Nur Layout: Breite, Außenabstand, Ausrichtung. Keine Farben, keine Radien. */
  className?: string;
  children: ReactNode;
};

type AsLink = Styling & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;

type AsButton = Styling & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const cls = [BASE, SIZES[size], VARIANTS[variant], className]
    .filter(Boolean)
    .join(" ");

  if (typeof rest.href === "string") {
    return (
      <Link {...rest} href={rest.href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button {...(rest as ComponentPropsWithoutRef<"button">)} className={cls}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Typen und Lint prüfen**

```bash
npx tsc --noEmit
```

Erwartet: keine Ausgabe.

```bash
npx eslint src/components/ui/Button.tsx
```

Erwartet: exit 0, keine Ausgabe.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Button.tsx
git commit -m "Gib den Buttons einen Ort

Vier Varianten und zwei Groessen, destilliert aus den 36 vorhandenen
Fundstellen. Nichts davon ist erfunden - PopularLinks.tsx:71 ist bereits
Zeichen fuer Zeichen der neutrale secondary, nur in rohen Farben.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Produkt-Layer, die 9 `primary`-Buttons

Reiner Strukturschritt. Keine Pixeländerung: die Klassen dieser neun Stellen
sind bereits genau das, was `VARIANTS.primary` erzeugt.

**Files:**
- Modify: `src/app/error.tsx:29`
- Modify: `src/app/not-found.tsx:32`
- Modify: `src/app/versand/VersandErgebnis.tsx:103`
- Modify: `src/components/Header.tsx:117` (Größe `sm`), `src/components/Header.tsx:161`
- Modify: `src/components/VersandKarte.tsx:627`
- Modify: `src/components/VersandTeaser.tsx:80`
- Modify: `src/components/wizard/screens/FertigScreen.tsx:64`
- Modify: `src/components/wizard/screens/NichtBerechtigt.tsx:46`

- [ ] **Step 1: Import ergänzen und ersetzen**

In jeder der acht Dateien `import { Button } from "@/components/ui/Button";`
ergänzen. Muster der Ersetzung, hier `VersandTeaser.tsx:80`:

```tsx
// vorher
<Link
  href={checkHref}
  className="inline-flex min-h-[3rem] items-center justify-center rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800"
>
  {t("versand.teaser.cta")}
</Link>

// nachher
<Button href={checkHref}>{t("versand.teaser.cta")}</Button>
```

Besonderheiten:

- `Header.tsx:117` ist `h-11 ... px-5 text-sm` → `<Button href={checkHref} size="sm" className="hidden sm:inline-flex">`. Die Sichtbarkeitsklassen bleiben in `className`, `h-11` entfällt (`size="sm"` liefert `min-h-[2.75rem]` = 44px, derselbe Wert).
- `VersandKarte.tsx:627` ist ein echtes `<button>` mit `disabled` → `<Button type="submit" disabled={...} className="mt-3 w-full">`. `disabled:cursor-not-allowed disabled:opacity-60` steckt in `BASE` und entfällt hier.
- `NichtBerechtigt.tsx:46` behält `className="mt-7"`.

Regel: In `className` bleiben nur Layout-Klassen (`mt-*`, `w-full`, `hidden`,
`sm:*`). Farben, Radien, Polsterung und `font-semibold` entfallen ersatzlos.

- [ ] **Step 2: Prüfen**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Erwartet: tsc ohne Ausgabe, lint exit 0, build erfolgreich.

- [ ] **Step 3: Restbestand kontrollieren**

```bash
grep -rn 'rounded-full bg-brand-700' src --include='*.tsx'
```

Erwartet: keine Ausgabe außer `src/components/ui/Button.tsx`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Fuehr die neun Primaerbuttons durch die Komponente

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Produkt-Layer, die restlichen 8 Buttons

**Files:**
- Modify: `src/app/error.tsx:35`, `src/app/not-found.tsx:38` (secondary)
- Modify: `src/components/VersandTeaser.tsx:92`, `src/components/FAQSection.tsx:39` (secondary)
- Modify: `src/components/wizard/screens/FertigScreen.tsx:73`, `:82` (secondary, **ändert sichtbar**)
- Modify: `src/app/faq/FAQPageContent.tsx:65` (onDark), `:72` (onDarkGhost)
- Modify: `src/app/versand/VersandErgebnis.tsx:111` (Ternary primary/secondary)

- [ ] **Step 1: Ersetzen**

```tsx
// error.tsx:35 / not-found.tsx:38 / VersandTeaser.tsx:92 — unverändert im Aussehen
<Button href="/" variant="secondary">{...}</Button>

// FAQSection.tsx:39 — behält gap und Icon als children
<Button href={faqHref} variant="secondary" size="sm">
  {t("faq.cta")} <ArrowRight className="h-4 w-4" aria-hidden />
</Button>

// FAQPageContent.tsx:65
<Button href="/#pruefung" variant="onDark">{...}</Button>

// FAQPageContent.tsx:72
<Button href="/mietminderungstabelle" variant="onDarkGhost">{...}</Button>
```

`VersandErgebnis.tsx:111` ist ein Ternary, der je nach Erfolgsfall zwischen den
Klassen von `primary` und `secondary` umschaltet. Er wird zu:

```tsx
<Button href="/" variant={erfolg ? "primary" : "secondary"}>
  {t("common.backHome")}
</Button>
```

`FertigScreen.tsx:73` und `:82` tragen heute
`border-brand-300 bg-paper-raised text-brand-700 hover:bg-brand-100` und gehen im
neutralen `secondary` auf (`border-ink-200 text-ink-800`). **Das ist die eine
beabsichtigte sichtbare Änderung dieses Tasks** — beide werden zu
`<Button variant="secondary">`. Sie ist in der Spec abgenommen.

- [ ] **Step 2: Prüfen**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

- [ ] **Step 3: Der `bg-white`-Treffer in FAQPageContent muss weg sein**

```bash
npx eslint src/app/faq/FAQPageContent.tsx 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `0` (vorher `1`).

- [ ] **Step 4: Wizard-Strecke testen**

```bash
npm run test:e2e -- wizard.spec.ts faq.spec.ts
```

Erwartet: alle Tests grün.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Zieh die restlichen Produktbuttons nach

Die beiden Brand-Outline-Buttons in FertigScreen gehen im neutralen
secondary auf, der an vier anderen Stellen bereits die Mehrheit stellt.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Produkt-Layer, Radien-Kurzform

Tailwind 4 erzeugt aus dem `--radius-*`-Namespace automatisch `rounded-*`.
`--radius-card` und `--radius-field` liegen bereits in `globals.css:62-63`, also
funktionieren `rounded-card` und `rounded-field` heute schon. Garantiert
pixelgleich.

**Files:**
- Modify: 48 Fundstellen über den Produkt-Layer verteilt
- Modify: `src/components/wizard/screens/VorschauScreen.tsx:117` (`bg-white`)

- [ ] **Step 1: Baseline**

```bash
grep -rc 'rounded-\[var(--radius-' src --include='*.tsx' | grep -v ':0' | awk -F: '{s+=$2} END {print s}'
```

Erwartet: `48`.

- [ ] **Step 2: Ersetzen**

```bash
grep -rl 'rounded-\[var(--radius-' src --include='*.tsx' \
  | xargs sed -i '' -e 's/rounded-\[var(--radius-card)\]/rounded-card/g' \
                    -e 's/rounded-\[var(--radius-field)\]/rounded-field/g'
```

- [ ] **Step 3: `bg-white` in VorschauScreen**

Zeile 117: `bg-white` → `bg-paper-raised`. `--color-paper-raised` ist `#ffffff`,
die Briefvorschau bleibt also exakt weiß.

- [ ] **Step 4: Prüfen**

```bash
grep -rc 'rounded-\[var(--radius-' src --include='*.tsx' | grep -v ':0'
```

Erwartet: keine Ausgabe.

```bash
npm run lint && npm run build
```

- [ ] **Step 5: Der Produkt-Layer ist jetzt sauber**

```bash
npx eslint src/components src/app/faq src/app/versand src/app/error.tsx src/app/not-found.tsx 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `0`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Kuerz die Radien auf die Kurzform

rounded-[var(--radius-card)] -> rounded-card. Tailwind 4 erzeugt die
Utility aus dem --radius-*-Namespace, der Wert ist derselbe.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Migrationsskript anlegen

Die vier mechanischen Ersetzungen sind in allen zwölf Content-Dateien
identisch. Ein Skript statt zwölfmal dieselben vier `sed`-Aufrufe.

**Files:**
- Create: `scripts/migrate-tokens.sh`

- [ ] **Step 1: Skript schreiben**

```bash
#!/usr/bin/env bash
# Mechanische Farbmigration Content-Layer -> Design-Tokens.
# Nur die eindeutigen Faelle. Radien, Buttons und die Semantikfarben
# (amber/emerald) brauchen Urteil und bleiben Handarbeit.
#
# Reihenfolge ist wichtig: bg-gray-50 muss vor der allgemeinen
# gray-Regel laufen, sonst wird daraus bg-ink-50 statt bg-paper-sunken.
set -euo pipefail

for f in "$@"; do
  [ -f "$f" ] || { echo "nicht gefunden: $f" >&2; exit 1; }
  perl -pi -e '
    s/\bbg-gray-50\b/bg-paper-sunken/g;
    s/\bbg-white\b(?![\/\w-])/bg-paper-raised/g;
    s/-blue-(\d{2,3})\b/-brand-$1/g;
    s/-gray-(\d{2,3})\b/-ink-$1/g;
  ' "$f"
  echo "migriert: $f"
done
```

- [ ] **Step 2: Ausführbar machen und an einer Kopie testen**

```bash
chmod +x scripts/migrate-tokens.sh
cp src/components/content/Breadcrumbs.tsx /tmp/probe.tsx
./scripts/migrate-tokens.sh /tmp/probe.tsx
diff src/components/content/Breadcrumbs.tsx /tmp/probe.tsx
```

Erwartet: Diff zeigt ausschließlich Farbklassen-Ersetzungen, kein verändertes
Markup, kein veränderter Text.

- [ ] **Step 3: Commit**

```bash
git add scripts/migrate-tokens.sh
git commit -m "Leg das Migrationsskript an

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Pilot — `Breadcrumbs.tsx`

Kleinste Datei, 4 Treffer. Prüft Mapping und Skript an geringem Risiko.

**Files:**
- Modify: `src/components/content/Breadcrumbs.tsx`

- [ ] **Step 1: Baseline**

```bash
npx eslint src/components/content/Breadcrumbs.tsx 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `4`.

- [ ] **Step 2: Skript laufen lassen**

```bash
./scripts/migrate-tokens.sh src/components/content/Breadcrumbs.tsx
```

- [ ] **Step 3: Diff lesen**

```bash
git diff src/components/content/Breadcrumbs.tsx
```

Jede Zeile muss eine reine Farbklassen-Ersetzung sein. Die Datei hat laut
Zählung 0 Radien-Fundstellen und 0 Buttons — es bleibt nichts von Hand zu tun.

- [ ] **Step 4: Prüfen**

```bash
npx eslint src/components/content/Breadcrumbs.tsx 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `0`.

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Stell die Breadcrumbs auf Tokens um

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: `mietminderung/[kategorie]/[mangel]/page.tsx`

Größte Datei: 69 Treffer, 38 `gray`, 31 `blue`, 7 `bg-white`, 13 Radien,
1 Button.

**Files:**
- Modify: `src/app/mietminderung/[kategorie]/[mangel]/page.tsx`

- [ ] **Step 1: Baseline**

```bash
npx eslint 'src/app/mietminderung/[kategorie]/[mangel]/page.tsx' 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `69`.

- [ ] **Step 2: Mechanische Farben**

```bash
./scripts/migrate-tokens.sh 'src/app/mietminderung/[kategorie]/[mangel]/page.tsx'
```

- [ ] **Step 3: Semantikfarben von Hand**

Zeile 352–353, die Hinweis-Box:

```tsx
// vorher
<div className="my-6 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-5">
  <p className="text-sm leading-relaxed text-amber-900">{...}</p>

// nachher
<div className="my-6 rounded-card border-l-4 border-caution-600 bg-caution-50 p-5">
  <p className="text-sm leading-relaxed text-caution-600">{...}</p>
```

Zeile 268, Tabellenzelle: `text-emerald-700` → `text-signal-700`.

- [ ] **Step 4: Radien nach Rolle**

13 Fundstellen. Karten, Panels und Sektionsboxen → `rounded-card`. Chips,
Badges und kleine Kacheln (u. a. Zeile 333 `h-8 w-8`, Zeile 407 `px-2 py-1
text-xs`) → `rounded-field`. Punkte (Zeile 195 `h-1.5 w-1.5 rounded-full`)
bleiben `rounded-full`.

```bash
grep -n 'rounded-\(xl\|2xl\|lg\|md\)' 'src/app/mietminderung/[kategorie]/[mangel]/page.tsx'
```

- [ ] **Step 5: Der Button**

`import { Button } from "@/components/ui/Button";` ergänzen.

Zeile 462 — `rounded-xl bg-paper-raised px-5 py-3 text-sm font-semibold
text-brand-800` auf dunklem Band → `<Button href="/#pruefung" variant="onDark"
size="sm" className="mt-5 w-full">`.

Nicht verwechseln: Zeile 450 ist das umgebende Band (`rounded-2xl bg-brand-700
p-6`) und wird in Step 4 zu `rounded-card` — kein Button.

- [ ] **Step 6: Prüfen**

```bash
npx eslint 'src/app/mietminderung/[kategorie]/[mangel]/page.tsx' 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `0`.

```bash
npx tsc --noEmit
npm run build
```

- [ ] **Step 7: SEO-Struktur unverändert**

```bash
npm run test:e2e -- seo.spec.ts navigation.spec.ts
```

Erwartet: grün. Diese Specs sichern, dass Überschriftenhierarchie, Links und
strukturierte Daten unangetastet sind.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Stell die Mangel-Seite auf Tokens um

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: `maengelanzeige-versenden/page.tsx`

63 Treffer, 30 `gray`, 32 `blue`, 7 `bg-white`, 12 Radien, 3 Buttons.

**Files:**
- Modify: `src/app/maengelanzeige-versenden/page.tsx`

- [ ] **Step 1: Baseline**

```bash
npx eslint src/app/maengelanzeige-versenden/page.tsx 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `63`.

- [ ] **Step 2: Mechanische Farben**

```bash
./scripts/migrate-tokens.sh src/app/maengelanzeige-versenden/page.tsx
```

- [ ] **Step 3: Semantikfarben**

Zeile 210–211, Hinweis-Box:

```tsx
<div className="... rounded-card border-l-4 border-caution-600 bg-caution-50 p-5">
  <p className="text-sm leading-relaxed text-caution-600">{...}</p>
```

- [ ] **Step 4: Radien nach Rolle**

12 Fundstellen. Zeile 254 (`px-2 py-1 text-xs font-bold`) und Zeile 289
(`h-8 w-8`) sind Chips → `rounded-field`. Zeile 386 (`rounded-2xl bg-brand-700
p-6`) ist ein Band → `rounded-card`. Zeile 325 (`h-1.5 w-1.5`) bleibt
`rounded-full`.

- [ ] **Step 5: Die 3 Buttons**

`import { Button } from "@/components/ui/Button";` ergänzen.

- Zeile 174 → `<Button href="/#pruefung" variant="onDark" size="sm" className="w-full sm:w-auto">`
- Zeile 180 → `<Button href="/mietminderungstabelle" variant="onDarkGhost" size="sm" className="w-full sm:w-auto">`
- Zeile 395 → `<Button href="/#pruefung" variant="onDark" size="sm" className="mt-5 w-full">`

Nicht verwechseln: Zeile 289 (`h-8 w-8`) und Zeile 254 (`px-2 py-1 text-xs`)
sehen wie Buttons aus, sind aber Zähler-Chips. Sie bekommen in Step 4
`rounded-field` und bleiben sonst unangetastet.

- [ ] **Step 6: Prüfen**

```bash
npx eslint src/app/maengelanzeige-versenden/page.tsx 2>&1 | grep -c no-restricted-syntax
npx tsc --noEmit
npm run build
```

Erwartet: `0`, keine tsc-Ausgabe, Build grün.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Stell die Versand-Landingpage auf Tokens um

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: `ratgeber/[slug]/page.tsx`

41 Treffer, 28 `gray`, 19 `blue`, 5 `bg-white`, 8 Radien, 1 Button.

**Files:**
- Modify: `src/app/ratgeber/[slug]/page.tsx`

- [ ] **Step 1: Baseline**

```bash
npx eslint 'src/app/ratgeber/[slug]/page.tsx' 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `41`.

- [ ] **Step 2: Mechanische Farben**

```bash
./scripts/migrate-tokens.sh 'src/app/ratgeber/[slug]/page.tsx'
```

- [ ] **Step 3: Semantikfarben**

Zeile 149–150, Hinweis-Box:

```tsx
<div className="my-6 rounded-card border-l-4 border-caution-600 bg-caution-50 p-5">
  <p className="text-sm leading-relaxed text-caution-600">{section.note}</p>
```

- [ ] **Step 4: Radien nach Rolle**

8 Fundstellen. Zeile 75 (`h-1.5 w-1.5`) bleibt `rounded-full`. Zeile 100 und 110
sind Inhalts-Chips → `rounded-field`. Der Rest sind Karten → `rounded-card`.

- [ ] **Step 5: Der Button**

Zeile 287 → `<Button href="/#pruefung" variant="onDark">Jetzt kostenlos starten</Button>`.
`px-8 py-3.5` entfällt; `size="md"` liefert `min-h-[3rem] px-6`.

- [ ] **Step 6: Prüfen**

```bash
npx eslint 'src/app/ratgeber/[slug]/page.tsx' 2>&1 | grep -c no-restricted-syntax
npm run build
npm run test:e2e -- seo.spec.ts
```

Erwartet: `0`, Build grün, Tests grün.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Stell die Ratgeber-Artikel auf Tokens um

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11: `mietminderungstabelle/page.tsx`

36 Treffer, 22 `gray`, 18 `blue`, 5 `bg-white`, 7 Radien, 1 Button.

**Files:**
- Modify: `src/app/mietminderungstabelle/page.tsx`

- [ ] **Step 1: Baseline**

```bash
npx eslint src/app/mietminderungstabelle/page.tsx 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `36`.

- [ ] **Step 2: Mechanische Farben**

```bash
./scripts/migrate-tokens.sh src/app/mietminderungstabelle/page.tsx
```

- [ ] **Step 3: Semantikfarben**

Zeile 210, Tabellen-Chip: `bg-emerald-50` → `bg-signal-50`, `text-emerald-700`
→ `text-signal-700`.

- [ ] **Step 4: Radien nach Rolle**

7 Fundstellen. Der Chip in Zeile 210 (`px-2 py-1 text-xs`) → `rounded-field`.
Karten und die Tabellen-Umrandung → `rounded-card`.

- [ ] **Step 5: Der Button**

Zeile 233 → `<Button href="/#pruefung" variant="onDark">`.

- [ ] **Step 6: Prüfen**

```bash
npx eslint src/app/mietminderungstabelle/page.tsx 2>&1 | grep -c no-restricted-syntax
npm run build
```

Erwartet: `0`, Build grün.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Stell die Mietminderungstabelle auf Tokens um

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 12: `mietminderung/page.tsx`

34 Treffer, 24 `gray`, 19 `blue`, 5 `bg-white`, 11 Radien, 5 Buttons.

**Files:**
- Modify: `src/app/mietminderung/page.tsx`

- [ ] **Step 1: Baseline**

```bash
npx eslint src/app/mietminderung/page.tsx 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `34`.

- [ ] **Step 2: Mechanische Farben**

```bash
./scripts/migrate-tokens.sh src/app/mietminderung/page.tsx
```

- [ ] **Step 3: Semantikfarben**

Zeile 179: `bg-emerald-50` → `bg-signal-50`, `text-emerald-700` →
`text-signal-700`.

- [ ] **Step 4: Radien nach Rolle**

11 Fundstellen. Zeile 141 (`px-2.5 py-1 text-xs font-bold`) ist ein Chip →
`rounded-field`. Karten → `rounded-card`.

- [ ] **Step 5: Die 5 Buttons**

`import { Button } from "@/components/ui/Button";` ergänzen.

- Zeile 108 → `<Button href="/#pruefung" variant="onDark" size="sm">`
- Zeile 114 → `<Button href="/mietminderungstabelle" variant="onDarkGhost" size="sm">` (`border-2` wird zu `border`, das ist die Variante)
- Zeile 220 → `<Button href="/#pruefung" size="sm">`
- Zeile 226 → `<Button href="/ratgeber/mietminderung-berechnen" variant="secondary" size="sm">`
- Zeile 232 → `<Button href="/ratgeber/mietminderung-ausschluss" variant="secondary" size="sm">`

- [ ] **Step 6: Prüfen**

```bash
npx eslint src/app/mietminderung/page.tsx 2>&1 | grep -c no-restricted-syntax
npx tsc --noEmit
npm run build
```

Erwartet: `0`, keine tsc-Ausgabe, Build grün.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Stell die Mietminderungs-Uebersicht auf Tokens um

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 13: `mietminderung/[kategorie]/page.tsx`

32 Treffer, 19 `gray`, 19 `blue`, 5 `bg-white`, 6 Radien, 1 Button.

**Files:**
- Modify: `src/app/mietminderung/[kategorie]/page.tsx`

- [ ] **Step 1: Baseline**

```bash
npx eslint 'src/app/mietminderung/[kategorie]/page.tsx' 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `32`.

- [ ] **Step 2: Mechanische Farben**

```bash
./scripts/migrate-tokens.sh 'src/app/mietminderung/[kategorie]/page.tsx'
```

- [ ] **Step 3: Radien nach Rolle**

6 Fundstellen. Zeile 163 (`px-2.5 py-1 text-xs font-bold`) ist ein Chip →
`rounded-field`. Karten → `rounded-card`.

- [ ] **Step 4: Der Button**

Zeile 259 → `<Button href="/#pruefung" variant="onDark">`.

- [ ] **Step 5: Prüfen**

```bash
npx eslint 'src/app/mietminderung/[kategorie]/page.tsx' 2>&1 | grep -c no-restricted-syntax
npm run build
```

Erwartet: `0`, Build grün.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Stell die Kategorieseiten auf Tokens um

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 14: Die fünf kleinen Content-Dateien

`MinderungRechner.tsx` (19), `ratgeber/page.tsx` (17), `PopularLinks.tsx` (16),
`ContentHeader.tsx` (6), `ContentFooter.tsx` (5). Zusammen 63 Treffer.

**Files:**
- Modify: `src/components/content/MinderungRechner.tsx`
- Modify: `src/app/ratgeber/page.tsx`
- Modify: `src/components/content/PopularLinks.tsx`
- Modify: `src/components/content/ContentHeader.tsx`
- Modify: `src/components/content/ContentFooter.tsx`

- [ ] **Step 1: Baseline**

```bash
npx eslint src/components/content/MinderungRechner.tsx src/app/ratgeber/page.tsx \
  src/components/content/PopularLinks.tsx src/components/content/ContentHeader.tsx \
  src/components/content/ContentFooter.tsx 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `63`.

- [ ] **Step 2: Mechanische Farben**

```bash
./scripts/migrate-tokens.sh \
  src/components/content/MinderungRechner.tsx \
  src/app/ratgeber/page.tsx \
  src/components/content/PopularLinks.tsx \
  src/components/content/ContentHeader.tsx \
  src/components/content/ContentFooter.tsx
```

- [ ] **Step 3: Semantikfarben in MinderungRechner**

Zeile 90–94:

```tsx
// vorher
<div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
  <dt className="text-xs font-medium text-emerald-800 uppercase tracking-wide">
  <dd className="mt-1 text-2xl font-extrabold text-emerald-700">

// nachher
<div className="rounded-card border border-signal-600/20 bg-signal-50 p-4">
  <dt className="text-xs font-medium text-signal-700 uppercase tracking-wide">
  <dd className="mt-1 text-2xl font-extrabold text-signal-700">
```

- [ ] **Step 4: Radien nach Rolle**

- `MinderungRechner.tsx`: 4 Fundstellen. Das Eingabefeld Zeile 56
  (`rounded-xl border-2`) → `rounded-field`. Ergebniskacheln → `rounded-card`.
- `ratgeber/page.tsx`: 5 Fundstellen, Artikelkarten → `rounded-card`.
- `PopularLinks.tsx`: 4 Fundstellen. Zeile 53 (`px-2 py-1 text-xs font-bold`)
  ist ein Chip → `rounded-field`. Rest → `rounded-card`.
- `ContentHeader.tsx` und `ContentFooter.tsx`: je 1, beide an Buttons — werden
  in Step 5 ersetzt und verschwinden dabei.

- [ ] **Step 5: Die 7 Buttons**

`import { Button } from "@/components/ui/Button";` in den vier betroffenen
Dateien ergänzen.

- `ratgeber/page.tsx:124` → `<Button href="/#pruefung" size="sm">`
- `ratgeber/page.tsx:130` → `<Button href="/mietminderungstabelle" variant="secondary" size="sm">`
- `ratgeber/page.tsx:136` → `<Button href="/faq" variant="secondary" size="sm">`
- `PopularLinks.tsx:65` → `<Button href="/#pruefung" size="sm">`
- `PopularLinks.tsx:71` → `<Button href={...} variant="secondary" size="sm">` — das ist die Stelle, die bereits vor der Migration Zeichen für Zeichen der neutrale `secondary` war
- `ContentHeader.tsx:46` → `<Button href="/#pruefung" size="sm" className="shrink-0">`
- `ContentFooter.tsx:27` → `<Button href="/#pruefung" size="sm" className="mt-6">`

- [ ] **Step 6: Prüfen**

```bash
npx eslint src 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `0` — die gesamte Codebasis ist jetzt sauber.

```bash
npx tsc --noEmit
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Stell die letzten Content-Komponenten auf Tokens um

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 15: Guardrail scharfschalten

**Files:**
- Modify: `eslint.config.mjs`
- Delete: `scripts/migrate-tokens.sh`

- [ ] **Step 1: Voraussetzung prüfen**

```bash
npx eslint src 2>&1 | grep -c no-restricted-syntax
```

Erwartet: `0`. Falls nicht: nicht weitermachen, erst die offenen Stellen
migrieren.

- [ ] **Step 2: Auf `error` stellen**

In `eslint.config.mjs` das erste Element des `no-restricted-syntax`-Arrays von
`"warn"` auf `"error"` ändern. Sonst nichts.

- [ ] **Step 3: Regel beißt jetzt — gegenprüfen**

```bash
printf 'export const P = () => <p className="text-gray-900">x</p>;\n' > src/__probe.tsx
npx eslint src/__probe.tsx; echo "exit=$?"
rm src/__probe.tsx
```

Erwartet: ein Fehler mit der Token-Meldung, `exit=1`.

- [ ] **Step 4: Migrationsskript löschen**

```bash
rm scripts/migrate-tokens.sh
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Mach den Rueckfall unmoeglich

Die Regel steht auf error. Rohe Paletten brechen ab jetzt den Lint, und
npm run verify laeuft ueber npm run lint.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 16: Gesamtverifikation

**Files:** keine

- [ ] **Step 1: Volle Prüfkette**

```bash
npm run verify
```

Erwartet: exit 0. Die Kette ist `lint → check:i18n → check:mail → test:unit →
build → test:e2e`.

- [ ] **Step 2: Gegenprobe von Hand**

```bash
grep -rhoE '\b(bg|text|border|ring|from|to|via|divide|placeholder|accent|fill|stroke)-(gray|blue|slate|zinc|neutral|stone|red|green|amber|yellow|orange|emerald|indigo|sky|teal|rose|purple|violet|cyan|lime|fuchsia|pink)-[0-9]{2,3}' src --include='*.tsx' --include='*.ts' | wc -l
```

Erwartet: `0`. (Ausgangswert war 403.)

- [ ] **Step 3: Radien zählen**

```bash
grep -rhoE '\brounded(-[a-z0-9]+)*' src --include='*.tsx' | sort | uniq -c | sort -rn
```

Erwartet: nur noch `rounded-full`, `rounded-card`, `rounded-field` und
vereinzelte Sonderfälle wie `rounded-e-full` in `FormProgress.tsx`. Keine
`rounded-xl`, `-2xl`, `-lg`, `-md` mehr.

- [ ] **Step 4: Buttons zählen**

```bash
grep -rc 'from "@/components/ui/Button"' src --include='*.tsx' | grep -v ':0' | wc -l
```

Erwartet: `20` Dateien.

- [ ] **Step 5: Naht von Hand ansehen**

Dev-Server starten und je eine Seite pro Typ durchklicken, mit besonderem Blick
auf den Übergang Content-Seite → CTA → Wizard:

```bash
npm run dev
```

- `/mietminderung/schimmel/schimmel-im-schlafzimmer` (Mangel-Seite)
- `/ratgeber/mietminderung-berechnen` (Artikel)
- `/mietminderung/schimmel` (Kategorie)
- `/mietminderungstabelle` (Tabelle)

Zu prüfen: Textfarbe warm statt blaustichig, Kartenflächen warm statt kühl,
CTAs als Pille in einheitlicher Größe, Hinweis- und Positiv-Boxen in den
Signalfarben.

- [ ] **Step 6: Abschluss-Commit, falls noch etwas offen war**

```bash
git status --porcelain
```

Erwartet: leer.
