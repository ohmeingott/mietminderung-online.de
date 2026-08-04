# Design-System durchsetzen: die Naht zwischen Content- und Produkt-Layer schließen

**Datum:** 2026-08-04
**Status:** Entwurf, freigegeben zur Planung

## Problem

Die Webapp wirkt stellenweise uneinheitlich. Die Ursache ist nicht ein fehlendes
Design-System — `globals.css` enthält ein durchdachtes Token-Set (`brand`, `ink`,
`paper`, `signal`, `caution`, `alert`, dazu Radius- und Schatten-Tokens) und es
wird 430-mal benutzt. Daneben stehen 403 rohe Tailwind-Palettenklassen.

Entscheidend ist, wie sich diese 403 verteilen: **nicht verstreut, sondern als
saubere architektonische Naht.** Keine einzige Datei mischt beide Systeme.

| Layer | Dateien | rohe Klassen | Token-Klassen |
|---|---|---|---|
| SEO/Content | 12 | 403 | 0 |
| Produkt/Funnel/Shell | 33 | 0 | 430 |

Es sind zwei Code-Generationen mit klarer Trennlinie. Der Nutzer überquert sie
auf jeder Reise: SEO-Seite → CTA → Wizard.

### Die 12 Content-Dateien

```
src/app/mietminderung/[kategorie]/[mangel]/page.tsx    73 rohe Klassen
src/app/maengelanzeige-versenden/page.tsx              65
src/app/ratgeber/[slug]/page.tsx                       50
src/app/mietminderung/page.tsx                         45
src/app/mietminderungstabelle/page.tsx                 42
src/app/mietminderung/[kategorie]/page.tsx             38
src/app/ratgeber/page.tsx                              26
src/components/content/PopularLinks.tsx                22
src/components/content/MinderungRechner.tsx            22
src/components/content/ContentHeader.tsx                9
src/components/content/ContentFooter.tsx                7
src/components/content/Breadcrumbs.tsx                  4
```

### Woraus der sichtbare Bruch besteht

1. **Fläche.** `<body>` ist warmes `paper` `#fbfaf8`. Darauf liegen im
   Content-Layer 44× `bg-white` und 13× `bg-gray-50` `#f9fafb` — kühl,
   blaustichig. Warmer Grund, kalte Panels.
2. **Text.** `ink-900` `#1a1816` (warm, R>G>B) im Produkt-Layer gegen 51×
   `gray-900` ≈ `#101828` (blaustichig) im Content-Layer.
3. **Form.** Derselbe primäre CTA ist im Produkt-Layer eine Pille
   (`rounded-full`), im Content-Layer ein `rounded-xl`-Rechteck und an dritter
   Stelle `rounded-lg`. Dazu vier Polsterungen: `px-8 py-3.5`, `px-6 py-3`,
   `px-5 py-2.5`, `min-h-[3rem] px-6`.
4. **Radien.** Der Produkt-Layer fährt auf zwei Formen (Token-Radius 48×,
   `rounded-full` 36×, 5 Ausreißer). Der Content-Layer auf fünf ad hoc:
   `xl` 33×, `2xl` 20×, `lg` 14×, `full` 7×, `md` 5×.

### Zwei verworfene Annahmen

Beide stammen aus einer früheren Analyse und halten der Prüfung nicht stand:

- **`text-blue-700` gegen `text-brand-700` ist kein optischer Defekt.** Die
  `brand`-Skala ist wertidentisch mit Tailwinds `blue`
  (`--color-brand-700: oklch(48.8% 0.243 264.376)` = `blue-700`), und
  `globals.css:9` sagt das ausdrücklich. Die 45 `text-blue-700` rendern exakt
  dieselben Pixel. Reines Benennungsproblem, null visuelle Wirkung.
- **Schatten sind kein Problem.** 13 Schatten-Verwendungen in der gesamten App.
  Eine Schattenskala löst nichts, was existiert.

Der einzige echte Farbdefekt ist **warm gegen kühl**: `ink`/`paper` gegen
`gray`/`white`.

## Ziel

Die Naht schließen und verhindern, dass sie neu entsteht. Der Produkt-Layer ist
das Ziel — er ist bereits diszipliniert, tokenisiert und umfasst die Mehrheit
der Dateien. Die 12 Content-Dateien ziehen nach.

## Nicht-Ziele

- Keine Field-, Card-, Callout-, Badge- oder Stack-Primitiven. Nur Button, weil
  nur der CTA nachweislich in drei Formen existiert.
- Keine Schattenskala.
- Keine Container- oder Spacing-Normierung (9 `max-w`-Werte, gemischte `py`).
  Real, aber eine eigene Aufgabe.
- Keine visuellen Regressionstests in diesem Schritt.
- Keine inhaltlichen oder strukturellen Änderungen an den SEO-Seiten.

## Entwurf

### 1. Farb-Mapping

Mechanisch über die 12 Dateien. Stufe für Stufe, weil die Skalen bereits
aufeinander liegen — die vorhandenen Paare belegen das (`border-gray-200` 40× im
Content-Layer, `border-ink-200` 39× im Produkt-Layer).

| von | nach | sichtbar |
|---|---|---|
| `blue-N` (alle Utilities) | `brand-N` | nein, wertidentisch |
| `gray-N` (alle Utilities) | `ink-N` | ja — der Kern der Änderung |
| `bg-white` als Kartenfläche | `bg-paper-raised` | nein — `--color-paper-raised` ist `#ffffff` |
| `bg-gray-50` als Sektionsfläche | `bg-paper-sunken` | ja, minimal |
| `bg-white/10`, `border-white/30`, `text-white` | unverändert | nein |
| `bg-white` als CTA auf dunklem Band | entfällt → `<Button variant="onDark">` | ja |
| `bg-amber-50 border-amber-400 text-amber-900` | `bg-caution-50 border-caution-600 text-caution-600` | ja |
| `bg-emerald-50 border-emerald-100 text-emerald-700/800` | `bg-signal-50 border-signal-600/20 text-signal-700` | ja |

**Keine neuen Tokens nötig.** Die `signal`/`caution`/`alert`-Skalen haben nur
`50`, `600`, `700` — die fehlenden Rahmenstufen löst der Produkt-Layer bereits
über Alpha (`border-caution-600/20`, `VersandKarte.tsx:487`). Diese Konvention
wird übernommen. Einzige Ausnahme: der 4px-Akzentbalken der Hinweis-Box
(`border-l-4`) nimmt `border-caution-600` voll, weil `/20` bei 4px nicht liest.

`bg-white` braucht Einzelfallprüfung, kein blindes Ersetzen: Kartenfläche →
`paper-raised`, CTA auf dunklem Band → Button-Komponente, Alpha-Overlay → bleibt.

### 2. Radien

Der Content-Layer übernimmt die zwei Token-Radien des Produkt-Layers:

| Rolle | Token | bisher im Content-Layer |
|---|---|---|
| Karten, Panels, Sektionsboxen | `rounded-card` (1.25rem) | `rounded-xl`, `rounded-2xl` |
| Felder, Chips, kleine Kacheln, Badges | `rounded-field` (0.75rem) | `rounded-lg`, `rounded-md` |
| Buttons, Pills, Punkte | `rounded-full` | teils schon `rounded-full` |

Die Zuordnung erfolgt nach Rolle, nicht nach bisherigem Wert — ein
`rounded-xl`-Chip wird `rounded-field`, eine `rounded-xl`-Karte wird
`rounded-card`.

Zusätzlich im **Produkt-Layer**: die 48 `rounded-[var(--radius-card)]` bzw.
`rounded-[var(--radius-field)]` werden auf die Kurzform `rounded-card` /
`rounded-field` verkürzt. Tailwind 4 erzeugt diese Utilities aus dem
`--radius-*`-Namespace automatisch; die Änderung ist garantiert pixelgleich.

### 3. Button-Primitive

Neue Datei `src/components/ui/Button.tsx`. Die vier Varianten sind aus dem
tatsächlichen Bestand destilliert, nicht erfunden:

```tsx
type ButtonProps = {
  variant?: "primary" | "secondary" | "onDark" | "onDarkGhost"  // default: primary
  size?: "md" | "sm"                                            // default: md
  href?: string          // gesetzt → next/link, sonst <button>
}
```

```
Basis    inline-flex items-center justify-center gap-2 rounded-full
         font-semibold transition-colors

md       min-h-[3rem] px-6
sm       min-h-[2.75rem] px-5 text-sm

                                                        Produkt  Content  Summe
primary       bg-brand-700 text-white hover:bg-brand-800      9       5      14
secondary     border border-ink-200 bg-paper-raised
              text-ink-800 hover:border-brand-300
              hover:text-brand-700                            6       5      11
onDark        bg-paper-raised text-brand-800
              hover:bg-brand-50                               1       7       8
onDarkGhost   border border-white/25 text-white
              hover:bg-white/10                               1       2       3
                                                                           ----
                                                             17      19      36
```

`sm` ist mit `min-h-[2.75rem]` (44px) angesetzt, nicht mit 40px: das trifft
`Header.tsx:117` (`h-11`) pixelgenau und hebt die `px-5 py-2.5`-Buttons des
Content-Layers von 40px auf die 44px-Mindestgröße für Touch-Ziele.

`disabled` erbt die vorhandene Konvention aus `VersandKarte.tsx:627`:
`disabled:cursor-not-allowed disabled:opacity-60`.

Dass vier Varianten reichen, ist geprüft und nicht geschätzt: alle 36 Fundstellen
fallen ohne Rest hinein. Der deutlichste Beleg ist
`components/content/PopularLinks.tsx:71` — `border-gray-200 bg-white
text-gray-700 hover:border-blue-400 hover:text-blue-700` ist Zeichen für Zeichen
der neutrale `secondary` des Produkt-Layers, nur in rohen Farben geschrieben.
Beide Layer haben dieselben vier Rollen unabhängig voneinander entwickelt.

Betroffen sind 20 Dateien. Drei Konsolidierungen ändern sichtbar das Aussehen —
das ist beabsichtigt und der Punkt der Übung:

1. Die 19 Content-CTAs werden vom Rechteck zur Pille.
2. Die vier Polsterungsvarianten fallen auf zwei (`md` / `sm`).
3. Die zwei Brand-Outline-Buttons in `FertigScreen.tsx:73` und `:82`
   (`border-brand-300 text-brand-700 hover:bg-brand-100`) gehen im neutralen
   `secondary` auf, das an vier anderen Stellen bereits die Mehrheit stellt.

### 4. Guardrail

`no-restricted-syntax` in `eslint.config.mjs`, angewandt auf `src/**/*.{ts,tsx}`.
Zwei Selektoren, weil Klassen hier als 859 String-Literale und 25
Template-Literale vorliegen (es gibt keinen `cn()`-Helper):

- `JSXAttribute[name.name='className'] Literal[value=/…/]`
- `JSXAttribute[name.name='className'] TemplateElement[value.raw=/…/]`

Blockiert:

- jede rohe Palette mit numerischer Stufe: `gray`, `slate`, `zinc`, `neutral`,
  `stone`, `blue`, `sky`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`,
  `rose`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`,
  `teal`, `cyan` — über alle Utility-Präfixe
- nacktes `bg-white` ohne Alpha-Modifier (Flächen gehören zu `paper-*`);
  `bg-white/10` und Ähnliches bleiben erlaubt

Fehlermeldung nennt die erlaubten Tokens. Kein neues Paket. Hängt an
`npm run lint`, das bereits in `npm run verify` steckt.

## Reihenfolge

Jeder Schritt ist für sich lauffähig und einzeln zurückdrehbar:

1. `Button.tsx` anlegen und die 17 Fundstellen im **Produkt-Layer** darauf
   umstellen (9 `primary`, 6 `secondary`, 1 `onDark`, 1 `onDarkGhost`). Rein
   struktureller Schritt, keine Pixeländerung außer den zwei
   `FertigScreen`-Buttons.
2. Produkt-Layer: 48 Arbitrary-Radien auf `rounded-card` / `rounded-field`
   kürzen. Pixelgleich.
3. Content-Layer, Datei für Datei: Farben mappen, Radien nach Rolle zuordnen,
   CTAs auf `Button` umstellen. Große Dateien zuerst, weil dort die Muster
   auftreten, die sich in den kleinen wiederholen.
4. ESLint-Regel scharfschalten. Erst jetzt, weil sie vorher die eigene
   Migration blockieren würde.

## Verifikation

- `npm run lint` — muss nach Schritt 4 grün sein, bei null rohen Paletten
- `npm run test:unit`
- `npm run build`
- `npm run test:e2e` — die neun vorhandenen Playwright-Specs decken Wizard,
  Navigation, FAQ, Legal, i18n, SEO und Versand ab; sie fangen strukturelle
  Regressionen der CTA-Umstellung
- Gegenprobe von Hand: `grep` auf rohe Paletten muss 0 liefern
- Sichtprüfung des Übergangs SEO-Seite → CTA → Wizard auf einer Content-Seite
  pro Typ (Mangel-Seite, Ratgeber-Artikel, Kategorie, Tabelle)

## Risiken

- **SEO-Seiten tragen Traffic.** Die Änderungen sind rein visuell — kein Markup
  wird umgebaut, keine Überschriftenhierarchie, keine Links, kein strukturierter
  Datensatz. Die `seo.spec.ts` sichert das ab.
- **`bg-white` ist mehrdeutig** (Fläche, CTA, Overlay). Deshalb Einzelfallprüfung
  statt Suchen-und-Ersetzen; die ESLint-Regel fängt Übersehenes.
- **Die Pillenform ist eine Geschmacksentscheidung.** Sie folgt der Mehrheit
  (36 gegen 7 im Bestand) und ist an einer Stelle zentral umkehrbar, sobald
  alle CTAs durch `Button` laufen — das ist der eigentliche Gewinn der
  Komponente.
