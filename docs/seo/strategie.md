# SEO-Strategie mietminderung-online.de

Stand: 1. August 2026

> **Umsetzungsstand.** Abschnitt 2 und 4.1 sind erledigt: der Briefversand hat
> eine eigene Landingpage, und die Mehrsprachigkeit ist auf URL-Routen mit
> vollständigem `hreflang` umgestellt. Ebenfalls erledigt: Speed Insights,
> Vorbereitung der Search-Console-Verifizierung, zwei neue Ratgeberartikel.
> Offen und **nicht** von uns umsetzbar: die Urteilsrecherche (4.4 / 5.1) —
> siehe den Hinweis dort.

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

### 4.1 Mehrsprachigkeit indexierbar machen — ✅ umgesetzt

**Problem (behoben).** Die Seite ist vollständig in sieben Sprachen übersetzt: Deutsch,
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

**Was umgesetzt wurde.**

1. Die Sprache ist ein Routensegment: `/en`, `/tr`, `/uk`, `/ru`, `/ar`, `/pl`.
   Deutsch bleibt auf der bloßen Wurzel — **keine einzige bestehende URL ist
   umgezogen**, was die Bedingung dafür war, dass die Umstellung die bereits
   rankenden Seiten nicht anfassen kann.
2. `/tr` und `/tr/faq` werden statisch vorgerendert und liefern Türkisch im
   ausgelieferten HTML, ohne dass ein Crawler JavaScript ausführen muss.
   Nachgeprüft: null deutsche Rückstände auf der türkischen Seite.
3. Vollständiges, reziprokes `hreflang` — sieben Sprachen plus `x-default` auf
   die deutsche Fassung, sowohl im `<head>` als auch in der Sitemap, weil Google
   beide als dasselbe Signal wertet und Übereinstimmung sie festigt.
4. `LanguageSwitcher` sind jetzt echte `<Link>`s. Die Sprache wird **nirgends**
   mehr gespeichert: eine gespeicherte Präferenz, die die URL überstimmt, ist
   genau der Weg, auf dem ein Besucher auf `/tr` Deutsch zu sehen bekommt und
   ein Crawler eine andere Seite ausgeliefert bekommt als die indexierte.
5. **Keine automatische Weiterleitung** nach `Accept-Language`, aus demselben
   Grund.
6. Übersetzte `<title>`/`description` pro Sprache, als eigene SEO-Texte statt
   als Übersetzung des deutschen Titels — jeder Markt formuliert die Suchanfrage
   anders („kira indirimi“, „zniżka czynszu“).
7. Sprachreine Navigation: Auf `/tr` verschwinden Ratgeber, Tabelle und
   Versandseite aus Kopf- und Fußzeile. Sie existieren nur auf Deutsch, und ein
   Link dorthin würde Leser wie Crawler aus der Sprache herausführen, in der die
   Seite zu sein behauptet. Ein e2e-Test hält das fest.
8. Die Rechtstexte gibt es unter jedem Sprachpräfix (`/tr/impressum` …) — mit
   **deutschem Text**, denn nur die deutsche Fassung ist rechtsverbindlich, und
   das steht auch als Hinweis darauf. Ohne diese Routen wäre der
   Impressums-Link, den § 5 DDG auf jeder Seite verlangt, eine Einbahnstraße aus
   dem Türkischen ins Deutsche gewesen. Sie stehen auf `noindex`: siebenmal
   identischer deutscher Text gehört nicht siebenmal in den Index.

**Zwei bewusste Kompromisse.**

- **`<html lang>` wird weiterhin clientseitig gesetzt.** Serverseitig ginge das
  nur mit einem Root-Layout pro Sprache über Route Groups, und das verträgt sich
  nicht mit dem globalen `not-found.tsx`. Der Verlust ist gering: Google leitet
  die Sprache aus dem Inhalt ab, nicht aus diesem Attribut, und `hreflang` —
  das serverseitig und pro Sprache ausgeliefert wird — ist das Signal, das die
  Übersetzungen tatsächlich adressiert. Betroffen ist Assistenztechnologie beim
  ersten Rendern, weshalb der Effekt weiterhin läuft.
- **Ein Sprachwechsel mitten im Formular setzt die Antworten zurück**, weil er
  jetzt eine Navigation ist. Das ist der Preis dafür, dass jede Übersetzung
  verlinkbar, teilbar und indexierbar ist. Er trifft einen seltenen Fall und ist
  nach zwei Fragen wieder aufgeholt.

**Was das noch nicht ist.** Übersetzt sind Startseite und FAQ — also der
Rechner, der Mängelkatalog und der Briefgenerator. Die 58 Mangelseiten, die
Ratgeber und die Tabelle bleiben Deutsch. Wenn die Sprachversionen Traffic
bringen, ist die Übersetzung der 15 wichtigsten Mangelseiten der logische
nächste Schritt — dann existiert die Infrastruktur bereits.

### 4.2 Search Console und Bing Webmaster Tools einrichten — vorbereitet, Rest bei euch

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

Die Codeseite ist vorbereitet: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` und
`NEXT_PUBLIC_BING_SITE_VERIFICATION` setzen die jeweiligen Meta-Tags, sobald ihr
sie in den Produktions-Umgebungsvariablen hinterlegt (siehe `.env.example`).
Ohne Wert wird kein Tag ausgegeben — ein leeres Token würde die Verifizierung
scheitern lassen statt nichts zu tun. **Setzt sie nur auf Produktion**, nicht auf
Preview-Deployments.

Wo möglich ist die DNS-TXT-Methode trotzdem die bessere: Sie deckt alle
Subdomains und Protokolle ab und überlebt ein Deployment, das die Variablen
verliert.

### 4.3 Core Web Vitals messen, bevor wir optimieren — ✅ Messung installiert

`@vercel/speed-insights` ist eingebunden und sammelt ab dem nächsten Deployment
Felddaten. Erst messen, dann handeln — insbesondere:

- LCP der Startseite (der Wizard ist eine große Client-Komponente).
- INP beim Durchklicken der Mängelauswahl.
- CLS beim Nachladen der Inter-Schrift.

Sobald zwei bis drei Wochen Daten vorliegen, lohnt der Blick. Ein naheliegender
Hebel ist dann, `Hero`, `HowItWorks` und `InfoSection` zu Server-Komponenten zu
machen — sie sind nur deshalb `"use client"`, weil sie `t()` brauchen, und seit
die Sprache aus der Route kommt, ließe sich das serverseitig auflösen. Das
verkleinert das Client-Bundle der wichtigsten Seite der Domain. Vorher messen,
ob es sich lohnt.

### 4.4 Gerichtsurteile als strukturierte Daten — bewusst nicht umgesetzt

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

> **Warum das hier nicht mit umgesetzt wurde.** Aktenzeichen sind überprüfbare
> Tatsachenbehauptungen über konkrete Gerichtsentscheidungen. Sie lassen sich
> nicht aus dem Gedächtnis rekonstruieren, und ein plausibel aussehendes, aber
> erfundenes Aktenzeichen auf einer Rechtsseite wäre schlimmer als gar keine
> Quelle: Es würde Leser in die Irre führen, die sich darauf verlassen, und
> beim ersten Nachprüfen die Glaubwürdigkeit der ganzen Domain kosten. Das ist
> ein Schritt, der eine Recherche in den Urteilsdatenbanken braucht — mit
> nachgelesenen Entscheidungen, nicht mit generierten. Sobald die Daten
> vorliegen, ist die technische Seite eine Stunde Arbeit.

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

| Thema | Status |
| --- | --- |
| „Zugang Einschreiben Beweis“ | ✅ Neuer Ratgeber `/ratgeber/maengelanzeige-zustellen`: Vergleichstabelle aller Zustellwege, warum das Übergabe-Einschreiben die schlechtere Wahl ist, an wen zugestellt werden muss. Das ist unser Verkaufsargument als Sachinformation. |
| „Vermieter reagiert nicht auf Mängelanzeige“ | ✅ Neuer Ratgeber `/ratgeber/vermieter-reagiert-nicht`: Minderung, Zurückbehaltung, Selbstvornahme nach § 536a Abs. 2 BGB, Klage, fristlose Kündigung — mit den Risiken jeder Stufe. Die Folgefrage nach unserem Produkt. |
| „Mängelanzeige Vorlage / Muster zum Download“ | Offen. `maengelanzeige-schreiben` deckt den Begriff teilweise ab; eine eigene Seite mit echtem Download wäre besser. Unsere Antwort ist ohnehin stärker als eine Word-Datei — wir füllen sie aus und verschicken sie. |
| „Mietminderung selbst schreiben oder machen lassen“ | Offen. Vergleichsseite mit Kaufabsicht, führt direkt auf den Versand. |
| „Mietminderung Frist / wie lange rückwirkend“ | Offen. Teilweise durch `mietminderung-rueckwirkend` abgedeckt. |
| Saisonales | Offen. Heizungsthemen von Oktober bis April vorbereiten, Baulärm und Hitze für den Sommer. Zwei Monate vorher veröffentlichen, nicht mittendrin. |

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

Erledigt: Versand-Landingpage, strukturierte Daten für den Versand,
Mehrsprachigkeit auf URL-Routen mit `hreflang`, Speed Insights, zwei
Ratgeberartikel, Vorbereitung der Verifizierungs-Tags.

Als Nächstes:

1. **Search Console und Bing Webmaster Tools einrichten** — eine Stunde, danach
   ist alles Weitere messbar. Der Code wartet nur noch auf die Tokens.
2. **Sitemap einreichen** und nach zwei Wochen prüfen, ob `/tr`, `/en` und die
   übrigen Sprachfassungen tatsächlich indexiert werden. Das ist die eine Zahl,
   die sagt, ob sich der Umbau gelohnt hat.
3. **Urteilsrecherche für die Top-15-Mängel** (5.1) — keine Codeabhängigkeit,
   und der Inhalt, den kein Wettbewerber ohne dieselbe Arbeit kopiert.
4. **Juristische Prüfinstanz benennen** (5.2) — braucht Vorlauf, früh anfangen.
5. **Restliche Inhaltsseiten** (5.3), beginnend mit „Muster/Vorlage“.
6. **Verlinkungen und Datengeschichte** (5.4).

Wenn die Sprachfassungen Traffic bringen: die 15 wichtigsten Mangelseiten
übersetzen. Die Infrastruktur dafür steht seit 4.1.
