# Lokalisierung der Ratgeber-Routen

Stand: 2026-08-06 · Status: freigegeben

## Ziel

Die acht Ratgeber-Artikel erscheinen in allen sechs Fremdsprachen unter
übersetzten URLs. Der Umbau legt zugleich das Routing-Fundament, auf dem die
Mängelseiten später ohne weitere Routen-Chirurgie folgen können.

Umfang: 8 Artikel × 6 Sprachen = 48 Artikelübersetzungen, 432 Strings je
Sprache, rund 280.000 Zeichen.

## Entscheidungen

| Frage | Entscheidung |
| --- | --- |
| URL-Form | Übersetzte Pfade *und* Slugs (`/tr/rehber/kusur-bildirimi-yazma`) |
| Sprachumfang | Alle sechs (en, tr, ar, ru, pl, uk) |
| Übersetzung | Maschinell erzeugt, mit sichtbarem Hinweis veröffentlicht |
| Fachbegriffe | Deutsches Original in Klammern, Paragraphen unverändert |
| Slug-Schrift | Landessprache, auch kyrillisch und arabisch |

## Architektur

### Routing

Auf `[locale]`-Ebene liegt heute `faq/` (statisch) und `[rechtstext]/`
(dynamisch). Ein übersetzter Ratgeber-Index wie `/tr/rehber` ist ein einzelnes
Segment und würde von `[rechtstext]` gefangen, das `dynamicParams = false` hat
und 404t, ohne durchzufallen. Zwei dynamische Geschwister auf einer Ebene
erlaubt Next.js nicht.

`[rechtstext]/` wird deshalb durch **`src/app/[locale]/[...pfad]/page.tsx`**
ersetzt: ein Catch-all, der den lokalisierten Pfad über die Mapping-Tabelle auf
den deutschen `basePath` zurückführt und an den passenden Renderer delegiert.
`faq/` bleibt als statisches Segment unangetastet und gewinnt weiterhin gegen
den Catch-all.

Begründung für die Catch-all-Form statt eines generalisierten Einzelsegments:
Die Mängelseiten sind zwei bis drei Segmente tief. Mit `[segment]/[slug]` wären
`[slug]` und `[kategorie]` beim nächsten Schritt erneut dynamische Geschwister
— dieselbe Kollision noch einmal. Der Catch-all nimmt beliebige Tiefe.

Die Rechtstexte ziehen unverändert in den Resolver um: `index: false`,
deutscher Body, kein `hreflang`. Die Begründung aus dem Kopf von
`[locale]/[rechtstext]/page.tsx` wandert mit.

### Pfad-Mapping

Neue Datei `src/i18n/pfade.ts`. Der **deutsche Pfad bleibt die Identität**;
übersetzt wird nur an den Rändern:

- `localeHref(locale, basePath)` übersetzt beim Erzeugen einer URL
- `splitLocalePath(pathname)` bildet den lokalisierten Pfad auf den deutschen
  `basePath` zurück

Beide behalten ihre Signatur. `TRANSLATED_PATHS` wird von einem flachen Array
zu einer Struktur, die pro Locale ein Segment und pro Artikel einen Slug kennt.

### Datenmodell

Pro Locale eine Datei `src/i18n/ratgeber/<locale>.ts` mit Artikelobjekten, die
die Struktur von `RatgeberArtikel` spiegeln, verschlüsselt nach deutschem Slug.

Die übersetzten Slugs liegen **nicht** dort, sondern in `pfade.ts`. Ein Slug ist
eine Routing-Tatsache, kein Inhalt: So beantworten Router, `generateStaticParams`
und `check:i18n` die Frage „welche URLs existieren", ohne 280.000 Zeichen
Artikeltext in den Modulgraphen zu ziehen.

Eine Sprache ist entweder gar nicht vorhanden (noch nicht begonnen) oder
vollständig. Halb übersetzte Sprachen erzeugen kaputte `hreflang`-Cluster und
deutschen Text unter fremdsprachiger URL; `check:i18n` lässt diesen Zustand
nicht durch, und Routen werden nur für Sprachen erzeugt, die den Artikel
tatsächlich haben.

Das bestehende flache `Record<string, string>` ist für den Mängelkatalog
richtig, für Langtexte aber gefährlich: Ein eingefügter Absatz im deutschen
Original verschiebt stillschweigend jeden Folge-Key in sechs Sprachen. Bei
Texten mit Fristen und Paragraphen ist das ein Fehler, den niemand sieht.

Nicht übersetzt werden `readingMinutes`, `published`, `updated` — das sind
Fakten über den Artikel, nicht über die Sprache. Sie kommen weiter aus der
deutschen Quelle.

### Kennzeichnung

Jede lokalisierte Ratgeber-Seite trägt eine Notiz im Stil der Rechtstexte:
maschinell übersetzt, deutsche Fassung maßgeblich, Link auf das Original.
Fachbegriffe führen das deutsche Original in Klammern mit
(`kusur bildirimi (Mängelanzeige)`); Paragraphenangaben wie `§ 536c BGB`
bleiben unverändert.

### SEO-Oberfläche

- `hreflang`: vollständiger reziproker Satz über alle sieben Sprachen
- `sitemap.ts`: alle lokalisierten Ratgeber-URLs mit Alternates
- Canonical: die übersetzte URL, nicht die deutsche Form
- `Article`-Schema in der Sprache der Seite

## Absicherung

`scripts/check-i18n.ts` bekommt eine Strukturprüfung:

- alle acht Slugs je Locale vorhanden
- gleiche Anzahl Sections je Artikel
- gleiche Absatz-, Bullet- und Ordered-Zahl je Section
- gleiche Tabellendimensionen
- Slugs je Locale kollisionsfrei

Das ist die Prüfung, die den Ausfall aus „Datenmodell" unmöglich macht. Sie
läuft bereits in `npm run verify`.

Dazu ein Playwright-Test, der pro Locale eine Ratgeber-URL aufruft und
Canonical sowie `hreflang` verifiziert.

## Reihenfolge

Der Übersetzungstext ist rund 90 % der Arbeit. Deshalb:

1. Routing, Pfad-Mapping, Datenmodell, Prüfskript vollständig
2. Türkisch als erste Sprache komplett — daran zeigt sich, ob Struktur,
   Sitemap, `hreflang` und Prüfung tragen
3. Die restlichen fünf Sprachen als reine Textarbeit gegen ein verifiziertes
   Gerüst

## Bewusst nicht enthalten

- Lokalisierung der Mängelseiten (folgt später auf diesem Fundament)
- Übersetzung der Rechtstexte (bleibt deutsch, siehe Begründung im Resolver)
- Englisch bevorzugt behandeln — alle sechs Sprachen gelten gleich
