# mietminderung-online.de

Ein kostenloser Online-Dienst, mit dem Mieterinnen und Mieter in Deutschland
prüfen können, ob ihnen eine Mietminderung zusteht, die Höhe berechnen und eine
rechtssichere Mängelanzeige nach § 536c BGB erzeugen — in sechs Sprachen.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4
- `@google/genai` — Gemini Flash für die Textverbesserung
- `jspdf` · `signature_pad` · `lucide-react`
- Playwright für End-to-End-Tests

## Setup

```bash
npm install
cp .env.example .env.local   # Werte eintragen (alle optional für die Basisfunktion)
npm run dev
```

Die App läuft auf <http://localhost:3000>. Ohne konfigurierte Keys funktioniert
alles bis auf die KI-Textverbesserung — die fällt dann auf den Originaltext
zurück, der Brief wird trotzdem erzeugt.

## Scripts

| Befehl                | Zweck                                                 |
| --------------------- | ----------------------------------------------------- |
| `npm run dev`         | Entwicklungsserver                                    |
| `npm run build`       | Produktions-Build                                     |
| `npm start`           | Produktionsserver                                     |
| `npm run lint`        | ESLint                                                |
| `npm run check:i18n`  | Prüft alle Locales auf fehlende UI- und Content-Keys  |
| `npm run test:e2e`    | Playwright-Suite (Desktop + Mobile)                   |
| `npm run test:e2e:ui` | Playwright im UI-Modus                                |
| `npm run verify`      | lint → i18n → build → e2e                             |

## Projektstruktur

```
src/
  app/
    page.tsx                    Startseite (Check + Mängelanzeige)
    faq/                        Alle Fragen & Antworten
    impressum/ datenschutz/     Rechtstexte
    nutzungsbedingungen/ widerruf/
    api/
      enhance-beschreibung/     Gemini-Textverbesserung
  components/                   UI-Komponenten
  data/maengel.ts               Mängelkatalog, Prüffragen, FAQ (deutsche Quelle)
  i18n/
    translations.ts             UI-Strings, 6 Sprachen
    content/                    Übersetzungen für Mängelkatalog und FAQ
    LanguageContext.tsx         Sprachwahl, RTL, localStorage
  lib/
    generatePdf.ts              PDF-Erzeugung
    site.ts                     Betreiberdaten und Feature-Flags
e2e/                            Playwright-Tests
scripts/check-i18n.ts           Locale-Vollständigkeitsprüfung
```

## Sprachen

Deutsch, Türkisch, Ukrainisch, Russisch, Arabisch (RTL) und Polnisch.

Deutsche Texte sind die Quelle: UI-Strings in `src/i18n/translations.ts`,
Mängelkatalog und FAQ in `src/data/maengel.ts`. Übersetzungen des Katalogs
liegen in `src/i18n/content/<locale>.ts` und werden über `tc(key, fallback)`
aufgelöst, das bei fehlender Übersetzung auf den deutschen Quelltext zurückfällt.

Nach jeder Änderung an den Daten `npm run check:i18n` ausführen — das Skript
meldet fehlende und verwaiste Keys.

**Der erzeugte Brief bleibt immer deutsch**, unabhängig von der gewählten
Sprache: Empfänger ist ein deutscher Vermieter. Fremdsprachige Eingaben werden
von Gemini ins Deutsche übersetzt.

## Rechtstexte

Impressum, Datenschutzerklärung, AGB und Widerrufsbelehrung sind bewusst nur
auf Deutsch verfügbar — nur diese Fassung ist rechtsverbindlich. Betreiberdaten
stehen zentral in `src/lib/site.ts`.

Prüfung, Berechnung und die erzeugte Mängelanzeige zum Herunterladen sind
**kostenlos** und bleiben es. Daneben gibt es genau **eine kostenpflichtige
Leistung**: den Postversand der Mängelanzeige über eBrief/PIN AG, bezahlt über
Stripe. Der Mieter bleibt Absender und Unterzeichner.

Weil damit ein Fernabsatzvertrag zustande kommt, hängt an dieser einen Leistung
das Widerrufsrecht: zwei getrennte Erklärungen vor der Bestellung nach
§ 356 Abs. 5 Nr. 2 BGB und die Schaltfläche „Vertrag widerrufen" auf
`/widerruf` nach § 356a BGB. Die Texte stehen an einer Stelle, in
`src/lib/widerrufstext.ts`, und `src/lib/widerrufstext.test.ts` hält die
Anforderungen als ausführbare Prüfung fest. Der Stand der anwaltlichen Prüfung
liegt in [docs/ANWALTLICHE_PRUEFUNG.md](./docs/ANWALTLICHE_PRUEFUNG.md).

## Deployment

Vercel, Region `fra1`. Sicherheits-Header und Cache-Regeln stehen in
`vercel.json`. Umgebungsvariablen siehe `.env.example`.
