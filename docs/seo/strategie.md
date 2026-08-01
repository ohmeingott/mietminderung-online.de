# SEO-Strategie mietminderung-online.de

Stand: 1. August 2026

Dieses Dokument beschreibt, wo die Seite technisch steht, was in diesem Schritt
umgesetzt wurde und was als Nächstes den größten Unterschied macht. Es ist in
zwei Hälften geteilt: **technische Aufgaben** (Code) und **Aufgaben für uns**
(Inhalte, Recherche, Öffentlichkeitsarbeit). Die zweite Hälfte ist die
wichtigere. Die Technik ist weitgehend erledigt; was fehlt, ist Substanz, die
sonst niemand hat.

---

## 1. Ausgangslage

Das technische Fundament ist überdurchschnittlich gut und braucht keine
Grundsanierung:

- Kanonische URLs, `robots.txt` und Sitemap kommen aus **einer** Quelle
  (`src/lib/site.ts`) und werden von `e2e/seo.spec.ts` gegen Abweichungen
  abgesichert. Das ist der Fehler, der eine Domain komplett aus dem Index
  wirft, und er kann hier nicht mehr unbemerkt passieren.
- 58 Mangelseiten, 13 Kategorieseiten, 6 Ratgeber und die Mietminderungstabelle
  sind statisch vorgerendert, intern dicht verlinkt und tragen jeweils
  Article-, FAQPage- und BreadcrumbList-Markup.
- Metadaten laufen ausnahmslos über `buildMetadata()`. Eine Seite kann Canonical,
  Open Graph oder Robots-Direktiven gar nicht vergessen.

Die zwei realen Lücken waren:

1. **Das Produkt war unsichtbar.** Die Seite rankte für „wie viel Mietminderung
   bei Schimmel“ und für nichts, was jemand sucht, der sich bereits entschieden
   hat: „Mängelanzeige versenden lassen“, „Einwurf-Einschreiben online“,
   „Brief an Vermieter ohne Drucker“. Genau diese Suchanfragen tragen die
   Kaufabsicht — und der einzige Ort, an dem der Versand vorkam, war ein Schritt
   in einem Client-Wizard ohne eigene URL. Was keine URL hat, kann nicht ranken.
2. **Sieben Sprachen, null indexierbare Übersetzungen.** Siehe Abschnitt 4.1 —
   das ist mit Abstand der größte ungenutzte Hebel.

---

## 2. In diesem Schritt umgesetzt

| Änderung | Warum |
| --- | --- |
| Neue Seite `/maengelanzeige-versenden` | Erste indexierbare Landingpage für den bezahlten Versand: Preise, Ablauf, Zugangsnachweis, 8 FAQ-Einträge. Zielt auf „Mängelanzeige versenden lassen“, „Einwurf-Einschreiben online versenden“, „Zugangsnachweis Mängelanzeige“. |
| `versandServiceSchema()` | `Service`-Knoten mit beiden `Offer`s. Preise werden aus `PRODUKTE` gelesen — derselben Quelle, aus der der Checkout abrechnet, damit die ausgezeichneten und die berechneten Preise nicht auseinanderlaufen können. |
| Korrektur am `WebApplication`-Knoten | Der trug `price: "0"` und listete gleichzeitig „Versand per E-Mail oder Brief“ als Feature. Das las sich als „wir verschicken kostenlos“. Der Versand ist jetzt ein eigener Knoten mit echten Preisen; die Feature-Liste beschreibt nur noch, was tatsächlich gratis ist. Zusätzlich stand dort ein E-Mail-Versand, den es nie gab. |
| Homepage-Abschnitt `VersandTeaser` | Server-gerendert, deutschsprachig, mit beiden Preisen. Trägt das Vokabular „Mängelanzeige versenden“ auf die Seite mit der meisten Autorität und verlinkt intern dorthin. |
| Verlinkung in Header, Footer, Content-Header/-Footer und der Sidebar aller 58 Mangelseiten | Der Versand ist jetzt von jeder Seite aus einen Klick entfernt — für Nutzer wie für Crawler. |
| `nav.send` in allen sieben Sprachen | Der Navigationspunkt fehlt in keiner Sprachfassung. |
| `contactPoint` im Organization-Markup | E-Mail als belegter Kontaktkanal. Bewusst ohne `telephone`: eine Nummer, die es nicht gibt, wäre erfunden. |
| Robots-Politik für Antwortmaschinen | `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` usw. ausdrücklich erlaubt. Ändert heute nichts (die `*`-Gruppe erlaubt sie ohnehin), hält aber die Entscheidung fest, damit sie später nicht versehentlich pauschal blockiert werden. |
| Metadaten für die 404-Seite | `noindex` zusätzlich zum 404-Status, für den Fall, dass ein Proxy den Status auf 200 umschreibt. |
| 4 neue e2e-Tests | Sichern ab, dass die Versandseite in der Sitemap steht, dass beide Preise im JSON-LD stehen und mit `PRODUKTE` übereinstimmen, und dass der Gratis-Knoten nie wieder den bezahlten Versand mitbewirbt. |

Alle 156 e2e-Tests laufen grün, Build und Lint sind sauber.

---

## 3. Was Nutzer jetzt sehen

Die Frage aus dem Auftrag — ob den Leuten klar wird, dass sie hier nicht nur
prüfen, sondern den Brief auch abschicken lassen können — beantwortet die Seite
an vier Stellen:

1. **Hero-Subline** (bestand bereits): „Auf Wunsch direkt per Brief oder
   Einschreiben verschicken.“
2. **Neuer Homepage-Abschnitt** „Wir verschicken Ihre Mängelanzeige an den
   Vermieter“ mit beiden Preisen und dem Argument, warum es überhaupt zählt.
3. **Navigationspunkt „Brief versenden“** in Kopf- und Fußzeile, in allen
   Sprachen.
4. **Eigene Landingpage**, auf die auch alle 58 Mangelseiten aus der Sidebar
   verlinken.

Der Ton bleibt dabei durchgehend: prüfen und erstellen ist kostenlos, bezahlt
wird nur der Versand und nur, wer ihn will. Das ist ehrlich und nimmt der
Preisnennung die Abschreckung.

---

## 4. Technische Roadmap

### 4.1 Mehrsprachigkeit indexierbar machen — mit Abstand Priorität 1

**Problem.** Die Seite ist vollständig in sieben Sprachen übersetzt: Deutsch,
Englisch, Türkisch, Ukrainisch, Russisch, Arabisch, Polnisch — UI *und*
Mängelkatalog, 220 UI-Schlüssel und 153 Inhaltsschlüssel pro Sprache. Diese
Arbeit ist bezahlt und fertig. Und sie bringt **null** organischen Traffic:

- Die Sprache liegt im `localStorage`, nicht in der URL.
- Es gibt genau eine URL pro Seite, und die liefert serverseitig immer Deutsch.
- Es gibt kein `hreflang`. Google weiß nicht, dass die Übersetzungen existieren.
- Das `lang`-Attribut wird erst clientseitig umgeschrieben; der Crawler sieht
  `lang="de"`.

Kurz: Wir haben sechs Übersetzungen im Schrank liegen, die niemand finden kann.

**Warum das der größte Hebel ist.** Der deutsche Markt für Mietrechtsinhalte
ist hart umkämpft — Mieterverein, anwalt.de, Fachverlage, dutzende
Anwaltskanzleien mit Content-Marketing. Der Markt für *türkischsprachige*
Erklärungen zur Mietminderung in Deutschland ist praktisch leer. Dasselbe gilt
für Ukrainisch, Arabisch und Russisch. Millionen Menschen in Deutschland mieten
Wohnungen und informieren sich lieber in ihrer Erstsprache über eine
Rechtsfrage, bei der es auf Nuancen ankommt. Für diese Zielgruppen ist die
Hemmschwelle, einen formalen deutschen Brief an den Vermieter aufzusetzen,
zudem besonders hoch — was den bezahlten Versand für sie *wertvoller* macht als
für deutsche Muttersprachler. Das ist die Nische, in der wir ohne echte
Konkurrenz auf Platz 1 stehen können.

**Umsetzung.**

1. Locale als Routensegment: `/en/...`, `/tr/...`, `/uk/...`. Deutsch bleibt auf
   der Wurzel ohne Präfix, damit keine einzige bestehende URL umzieht — das ist
   die Bedingung, unter der das Projekt risikolos ist.
2. `generateStaticParams` über die Locales; die Seiten sind ohnehin statisch.
3. `alternates.languages` in `buildMetadata()` füllen, inklusive `x-default` auf
   die deutsche Fassung. Das ist eine Ergänzung an einer einzigen Stelle, weil
   alle Seiten durch diese Funktion laufen.
4. `<html lang>` und `dir` serverseitig aus dem Routensegment setzen statt im
   Effekt.
5. `LanguageSwitcher` wird von einem `localStorage`-Schalter zu echten `<Link>`s
   auf die Sprachvariante derselben Seite.
6. **Keine automatische Weiterleitung** anhand von `Accept-Language`. Sie
   verhindert, dass Crawler die anderen Fassungen überhaupt sehen, und ist der
   klassische Weg, sich die eigene Mehrsprachigkeit kaputtzumachen. Die
   gespeicherte Präferenz darf höchstens einen Hinweisbanner auslösen.
7. Übersetzte Metadaten (Title/Description) pro Sprache — hier entsteht die
   eigentliche Textarbeit, weil die 220 UI-Schlüssel die SEO-Titel noch nicht
   enthalten.

**Nebeneffekt, der für sich schon lohnt.** `Hero`, `HowItWorks` und
`InfoSection` sind heute nur deshalb `"use client"`, weil sie `t()` brauchen.
Kommt die Sprache aus der Route, können sie Server-Komponenten werden. Das holt
sie aus dem Client-Bundle und hilft LCP und INP auf der wichtigsten Seite der
Domain.

**Aufwand:** geschätzt 2–4 Tage. **Erwarteter Ertrag:** der mit Abstand größte
Posten dieser Liste.

### 4.2 Search Console und Bing Webmaster Tools einrichten

Ohne Search Console arbeiten wir blind: keine Daten zu Impressionen,
Positionen, Indexierungsproblemen oder Core Web Vitals aus Felddaten. Konkret:

- Property für `mietminderung-online.de` anlegen (Domain-Property per
  DNS-TXT-Eintrag, damit alle Subdomains und Protokolle abgedeckt sind).
- `sitemap.xml` einreichen.
- Bing Webmaster Tools ebenfalls — Bing speist ChatGPTs Websuche.
- Danach monatlich prüfen: welche Seiten sind indexiert, welche nicht, und
  warum nicht.

Das ist eine Stunde Arbeit und die Voraussetzung dafür, dass alles Weitere
messbar wird.

### 4.3 Core Web Vitals messen, bevor wir optimieren

Vercel Analytics ist installiert, Speed Insights noch nicht. Erst messen, dann
handeln — insbesondere:

- LCP der Startseite (der Wizard ist eine große Client-Komponente).
- INP beim Durchklicken der Mängelauswahl.
- CLS beim Nachladen der Inter-Schrift.

Wenn 4.1 umgesetzt ist, wird ein Teil davon ohnehin besser. Danach neu messen.

### 4.4 Gerichtsurteile als strukturierte Daten

Auf keiner der 58 Mangelseiten steht heute ein einziges Aktenzeichen —
`src/data/seoContent.ts` enthält keins, und auch die Vorrecherche in
`RESEARCH_MIETMINDERUNG.md` nennt nur drei Gerichte und keine Aktenzeichen. Die
Belegarbeit steht also noch vollständig aus. Wenn pro Mangel ein bis drei
konkrete Entscheidungen mit Gericht, Datum und Aktenzeichen genannt werden,
entsteht:

- Inhalt, den kein Wettbewerber ohne dieselbe Recherchearbeit kopieren kann,
- ein starkes E-E-A-T-Signal (nachprüfbare Quellen statt Prozentzahlen aus dem
  Nichts),
- und genau die Art von zitierfähigem Detail, das Antwortmaschinen aufgreifen.

Technisch: Feld `urteile` in `src/data/seoContent.ts` ergänzen, im
`articleSchema` über `citation` ausgeben, auf der Seite als Quellenblock
rendern. Der Aufwand liegt fast vollständig in der Recherche (siehe 5.1), nicht
im Code.

### 4.5 Kleinere technische Punkte

- **Sitemap-Datumsangaben:** `lastModified` ist ein handgepflegtes Datum. Sobald
  Urteile pro Mangel gepflegt werden, sollte das Datum aus den Daten kommen.
- **OG-Bilder pro Kategorie:** existieren für die Mangelseiten, fehlen für
  Kategorie- und Ratgeberseiten.
- **`Speakable`-Markup** für die Kernaussage jeder Mangelseite (Sprachassistenten).
- **404-Monitoring:** nach dem i18n-Umbau auf tote interne Links prüfen; der
  bestehende Test „no link points at a dead route“ deckt bereits die Startseite ab.

---

## 5. Aufgaben für uns (keine Programmierarbeit)

### 5.1 Urteilsrecherche — die wichtigste inhaltliche Aufgabe

Für jeden der 58 Mängel ein bis drei echte Entscheidungen sammeln: Gericht,
Datum, Aktenzeichen, zugesprochene Quote, ein Satz zum Sachverhalt. Quellen:
Mietrechtsentscheidungen der Amtsgerichte, `openjur.de`, `dejure.org`, die
Urteilssammlungen der Mietervereine.

Warum das so viel wert ist: Unsere Prozentspannen stehen aktuell ohne Beleg da.
Jeder Wettbewerber hat auch Prozentspannen. Wer daneben „AG Köln, Urteil vom
…, Az. …“ schreibt, hat etwas, das man nicht in zehn Minuten nachbaut — und was
Google seit den Helpful-Content-Updates ausdrücklich belohnt.

**Empfehlung:** mit den 15 meistgesuchten Mängeln anfangen (Schimmel,
Heizungsausfall, Lärm, Wasserschaden, Ungeziefer), nicht mit allen 58 auf
einmal.

### 5.2 Verantwortliche Person für die Rechtsinhalte benennen

Google bewertet YMYL-Inhalte („Your Money or Your Life“ — Rechts- und
Finanzthemen gehören dazu) strenger als alles andere. Ein Impressum mit drei
GbR-Gesellschaftern reicht dafür nicht. Was hilft:

- Eine Autoren- oder Redaktionsseite: Wer schreibt und prüft diese Inhalte,
  welche Qualifikation hat diese Person?
- Idealerweise eine Kooperation mit einer Anwältin oder einem Anwalt für
  Mietrecht, die/der die Inhalte gegenzeichnet. Das lässt sich dann als
  `author`/`reviewedBy` auszeichnen und auf den Seiten sichtbar machen
  („Juristisch geprüft von … am …“).
- Alternativ eine Kooperation mit einem Mieterverein.

Das ist Vertrauensarbeit, nicht Technik — aber es ist bei YMYL-Themen die
Grenze zwischen Seite 1 und Seite 3.

### 5.3 Inhaltliche Lücken schließen

Themen mit Suchvolumen, die wir noch nicht bedienen:

| Thema | Warum |
| --- | --- |
| „Mängelanzeige Vorlage / Muster zum Download“ | Sehr hohes Volumen. Unsere Antwort ist besser als eine Word-Datei (wir füllen sie aus und verschicken sie) — aber wir ranken für den Begriff nicht, weil wir ihn nicht bedienen. |
| „Mietminderung selbst schreiben oder machen lassen“ | Vergleichsseite. Klassische Seite mit Kaufabsicht, führt direkt auf den Versand. |
| „Vermieter reagiert nicht auf Mängelanzeige“ | Die Folgefrage nach unserem Produkt. Wer sie stellt, hat den Brief geschickt und braucht den nächsten Schritt. |
| „Mietminderung Frist / wie lange rückwirkend“ | Teilweise im Ratgeber abgedeckt, verdient eine eigene Seite. |
| „Zugang Einschreiben Beweis“ | Genau unser Verkaufsargument, bisher nur ein Absatz. |
| Saisonales | Heizungsthemen von Oktober bis April vorbereiten, Baulärm und Hitze für den Sommer. Zwei Monate vorher veröffentlichen, nicht mittendrin. |

**Was wir bewusst nicht tun:** Städteseiten („Mietminderung Berlin“,
„Mietminderung München“ …). Der Inhalt wäre auf allen 300 Seiten identisch, weil
Mietrecht Bundesrecht ist. Das ist die Definition von Doorway Pages und wird
seit Jahren abgestraft.

### 5.4 Verlinkungen und Bekanntheit

- **Mietervereine, Verbraucherzentralen, Studierendenwerke, Sozialberatungen:**
  Diese Stellen verlinken Werkzeuge, die ihren Ratsuchenden helfen. Ein
  kostenloser Rechner mit kostenlosem PDF ist genau das. Direkt anschreiben.
- **Datengeschichte für die Presse:** Aus unserem Datensatz lässt sich eine
  Auswertung bauen — „Bei welchen Mängeln sprechen deutsche Gerichte die
  höchsten Minderungen zu?“ Solche Stücke werden von Regionalpresse und
  Verbrauchermagazinen aufgegriffen und verlinkt. Das ist der ehrlichste Weg
  zu guten Backlinks.
- **Foren und Communities** (Reddit r/de, r/Mietrecht, Facebook-Mietergruppen):
  nur mit echten, hilfreichen Antworten. Linkspam schadet dort mehr, als er
  nützt.
- **Bewertungen einsammeln** — aber nur echte. Sobald es genug davon gibt, kann
  `AggregateRating` ausgezeichnet werden und Sterne erscheinen in den
  Suchergebnissen. Erfundene Bewertungen sind ein manueller Abstrafungsgrund und
  wettbewerbsrechtlich angreifbar; das kommt für uns nicht in Frage.

### 5.5 Sichtbarkeit in KI-Antworten

Ein wachsender Teil der Nutzer fragt ChatGPT oder Perplexity statt Google. Diese
Systeme zitieren bevorzugt Inhalte, die klar strukturiert, mit Quellen belegt
und eindeutig formuliert sind. Was wir dafür tun:

- Die Crawler sind ausdrücklich erlaubt (erledigt, siehe Abschnitt 2).
- Konkrete Zahlen und Quellen statt vager Formulierungen (siehe 5.1).
- Fragen als Überschriften formulieren, Antwort im ersten Absatz darunter — das
  Format, das zitiert wird. Die FAQ-Blöcke machen das bereits richtig.
- Regelmäßig selbst testen: „Wie viel Mietminderung bei Schimmel?“ in ChatGPT
  und Perplexity eingeben und schauen, wer zitiert wird und warum.

---

## 6. Messung

Ohne diese vier Zahlen ist jede weitere Diskussion Geschmackssache:

| Kennzahl | Quelle | Rhythmus |
| --- | --- | --- |
| Indexierte Seiten vs. Seiten in der Sitemap | Search Console | monatlich |
| Impressionen und Klicks je Seitentyp (Mangel / Ratgeber / Versand) | Search Console | monatlich |
| Conversion-Rate Prüfung → PDF → bezahlter Versand | Vercel Analytics + Stripe | monatlich |
| Core Web Vitals (Felddaten) | Search Console / Speed Insights | vierteljährlich |

Besonders aufschlussreich wird die dritte Zeile: Sie sagt, ob die Versandseite
tatsächlich Käufe bringt oder nur Besuche.

---

## 7. Reihenfolge

1. **Search Console einrichten** — eine Stunde, danach ist alles messbar.
2. **Urteilsrecherche für die Top-15-Mängel** — parallel, keine Codeabhängigkeit.
3. **Mehrsprachigkeit indexierbar machen** (4.1) — der große technische Posten.
4. **Fehlende Inhaltsseiten** (5.3), beginnend mit „Muster/Vorlage“ und
   „selbst schreiben oder machen lassen“.
5. **Juristische Prüfinstanz benennen** (5.2) — braucht Vorlauf, früh anfangen.
6. **Verlinkungen und Datengeschichte** (5.4).
