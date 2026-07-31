# Preis- und Margenkalkulation Postversand

Grundlage für die Verkaufspreise in `src/lib/ebrief/produkte.ts`. Wer dort eine
Zahl ändert, ändert sie auch in den AGB — die Seite liest aus demselben
Katalog — und sollte vorher hier nachrechnen.

**Stand:** Juli 2026 · **Einkaufspreise:** Preisliste eBrief Geschäftskunden
01/2025, Anlage 1 zum Dienstleistungsvertrag (Kundennummer D01039646)

---

## Einkauf

Alle Positionen national. Brutto = netto + 19 % USt.

| Position | netto | brutto |
|---|---:|---:|
| Standardbrief, inkl. 1 Blatt, bis 20 g (max. 3 Blatt) | 0,72 € | 0,86 € |
| je zusätzliches Blatt | 0,04 € | 0,05 € |
| Kompaktbrief, inkl. 4 Blatt, bis 50 g | 1,03 € | 1,23 € |
| eEinschreiben (Aufschlag) | 2,75 € | 3,27 € |

Ein **Blatt** sind zwei bedruckte Seiten. Jedes begonnene Blatt wird voll
berechnet. Eine typische Mängelanzeige belegt ein bis zwei Seiten, also ein
Blatt; erst ab sieben Seiten fällt sie aus dem Standardbrief heraus.

### Warum brutto gerechnet wird

Der Betreiber ist Kleinunternehmer nach § 19 UStG. Ohne Vorsteuerabzug ist der
Bruttopreis der tatsächlich gezahlte Preis — die 19 % sind Kosten, kein
durchlaufender Posten. Alle Margen unten rechnen deshalb mit brutto.

Umgekehrt darf auf den Verkaufspreis keine Umsatzsteuer ausgewiesen werden:
Ein Ausweis wäre nach § 14c UStG geschuldet, obwohl er nicht erhoben werden
darf. Das erzwingt `stripeTaxBehavior()` in `src/lib/steuer.ts`, das unter
`kleinunternehmer` bewusst `undefined` liefert.

## Verkauf und Marge

| | Brief | Einwurf-Einschreiben |
|---|---:|---:|
| Verkaufspreis | 2,49 € | 6,99 € |
| Einkauf (brutto, 1 Blatt) | 0,88 € | 4,15 € |
| **Rohmarge** | **1,61 €** | **2,84 €** |
| Rohmarge in % | 64,7 % | 40,6 % |

Die im Code hinterlegten Einkaufspreise (`einkaufBruttoCent` 88 bzw. 415)
liegen jeweils zwei Cent über der exakten Umrechnung (0,857 € bzw. 4,129 €).
Das ist ein Puffer und darf so bleiben — er wirkt in die sichere Richtung.

### Zahlungsgebühren fehlen in dieser Rechnung

Der Katalog kennt nur den eBrief-Einkauf. Die Stripe-Gebühr ist die zweite
variable Kostenposition, und bei diesen Beträgen ist sie nicht klein: Für
europäische Karten fallen typischerweise **1,5 % + 0,25 €** an, außerhalb
Europas mehr.

| | Brief | Einwurf-Einschreiben |
|---|---:|---:|
| Verkaufspreis | 2,49 € | 6,99 € |
| eBrief (brutto) | −0,88 € | −4,15 € |
| Stripe (1,5 % + 0,25 €) | −0,29 € | −0,36 € |
| **Deckungsbeitrag** | **1,32 €** | **2,48 €** |

Beim Brief frisst die Zahlungsgebühr damit **18 % der Rohmarge**, überwiegend
durch die Fixgebühr von 25 Cent. Das ist der Grund, warum ein Preis unter
etwa 2 € wirtschaftlich nicht funktioniert, und warum ein Mengenrabatt bei
eBrief die Rechnung weniger verbessert, als es die Prozentzahl vermuten lässt.

## Mehrblättrige Briefe

| Seiten | Blätter | Produkt | Einkauf brutto | Marge Brief |
|---:|---:|---|---:|---:|
| 1–2 | 1 | Standardbrief | 0,88 € | 1,61 € |
| 3–4 | 2 | Standardbrief | 0,93 € | 1,56 € |
| 5–6 | 3 | Standardbrief | 0,98 € | 1,51 € |
| 7–8 | 4 | Kompaktbrief | 1,23 € | 1,26 € |

Bis in den Kompaktbrief hinein trägt sich der Preis. Die Absicherung dagegen,
dass ein sehr langer Brief unter den Einkaufspreis rutscht, sitzt in
`POST /api/versand/vorbereiten`: Die Route fragt vor dem Checkout den realen
Preis mit der tatsächlich gerenderten Seitenzahl ab und bricht mit
`preis_unplausibel` ab, statt mit Verlust zu drucken.

Die Preisantwort liefert laut Schema `TotalSumBrutto` und `TotalSumNetto` als
Doubles **in Euro** — nicht in Cent (`src/lib/ebrief/types.ts`).

## Offene Vorbehalte

Zwei Punkte können die Einkaufsseite noch verschieben. Beide sind bei PIN AG
angefragt, beide noch unbeantwortet.

**Die 250er-Schwelle.** Die Preisliste trägt im Kopf „Geschäftskunden ab 250
Sendungen pro Monat". Zum Start liegt das Volumen darunter. Ob dieselben
Konditionen gelten, ist unbestätigt. Beim Brief wäre selbst ein deutlicher
Aufschlag verkraftbar; beim Einschreiben ist die Marge dünner und reagiert
empfindlich.

**Welches Produkt `IsTracking` ist.** Der Code setzt `IsTracking: "true"` und
verkauft das Ergebnis als Einwurf-Einschreiben. Die Preisliste führt ein
„eEinschreiben" zu 2,75 € netto, die englische Dokumentation spricht von einem
„eTracked Letter". Ob das dasselbe Produkt zum selben Preis ist, ist unbelegt.
Sollte es teurer sein, ist die Marge von 2,48 € die erste Zahl, die kippt.

**Preisänderungen sind vertraglich zulässig.** Nach A.2.2 des
Dienstleistungsvertrags darf PIN AG die Preisliste mit vier Wochen Vorlauf
ändern. Widerspruch ist binnen zwei Wochen möglich, berechtigt die Gegenseite
dann aber zur Kündigung. Jede Änderung gehört gegen diese Tabelle gerechnet.

## Steuerlich zu klären

Zwei Punkte für die Steuerberatung, bevor der Verkauf startet:

- **Reverse Charge auf die Stripe-Gebühren.** Stripe rechnet aus Irland ohne
  Umsatzsteuer ab. Der Leistungsempfänger schuldet die Steuer nach § 13b UStG,
  und § 19 Abs. 1 UStG nimmt Kleinunternehmer davon nicht aus — ein
  Vorsteuerabzug steht ihnen aber nicht zu. Das wäre eine zusätzliche
  Kostenposition von 19 % auf die Gebühren und setzt eine USt-IdNr. voraus.
- **Die Kleinunternehmergrenze.** Bei Überschreiten der Umsatzgrenze fällt die
  Regelbesteuerung an. `STEUERMODUS=regel` schaltet das im Code um, aber die
  Verkaufspreise müssten dann neu gerechnet werden: Aus 2,49 € brutto würden
  2,09 € netto, während der Vorsteuerabzug im Gegenzug den Einkauf um 19 %
  verbilligt.
