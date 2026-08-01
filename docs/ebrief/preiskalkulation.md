# Preis- und Margenkalkulation Postversand

Grundlage für die Verkaufspreise in `src/lib/ebrief/produkte.ts`. Wer dort eine
Zahl ändert, ändert sie auch in den AGB — die Seite liest aus demselben
Katalog — und sollte vorher hier nachrechnen.

**Stand:** Juli 2026 · **Einkaufspreise:** öffentlicher Preiskatalog unter
[ebrief.de/de/preise](https://www.ebrief.de/de/preise), abgeglichen mit
Anlage 1 zum Dienstleistungsvertrag (Kundennummer D01039646)

---

## Einkauf

Alle Positionen national, schwarz-weiß, einseitig. Brutto = netto + 19 % USt.

| Position | netto | brutto |
|---|---:|---:|
| Standardbrief, inkl. 1 Blatt, bis 20 g (max. 3 Blatt) | 0,74 € | 0,88 € |
| je zusätzliches Blatt | 0,04 € | 0,05 € |
| Kompaktbrief, inkl. 4 Blatt, bis 50 g | 1,03 € | 1,23 € |
| eEinschreiben (Aufschlag) | 2,75 € | 3,27 € |
| Monatliche Grundgebühr | 0,00 € | 0,00 € |

Der Online-Katalog liegt beim Standardbrief zwei Cent netto über der
Preisliste 01/2025 (0,72 €), die dem Vertrag als Anlage 1 beiliegt. Maßgeblich
ist der jeweils aktuelle Katalog — A.2.2 des Vertrags erlaubt PIN AG die
Änderung der Anlage mit vier Wochen Vorlauf.

Diese Einkaufspreise stehen **nur hier**, nicht im Code. `produkte.ts` führt
allein den Verkaufspreis. Ein einzelner Einkaufswert je Produkt könnte immer
nur für den einblättrigen Brief stimmen — die Staffelung oben zeigt, warum —
und ein falscher Wert, den kein Programmteil liest, wird trotzdem irgendwann
geglaubt. Bis Juli 2026 stand er dort und war mit 0,88 € genau das: der
Bestfall, als Regelfall gelesen.

Die Absicherung zur Laufzeit braucht ihn nicht: `/api/versand/vorbereiten`
fragt `POST /Prices` nach dem Preis des tatsächlichen Auftrags, mit der real
gerenderten Seitenzahl.

Die zweite Frage an PIN AG hat sich damit ebenfalls erledigt: Der Preis für
die getrackte Variante steht mit 2,75 € netto fest. Offen bleibt allein die
**Produktbezeichnung** — dazu unten.

**Wir drucken einseitig** (`IsDuplex: "false"` in `produkte.ts`). Jede
gerenderte Seite ist damit ein eigenes Blatt, und jedes begonnene Blatt wird
voll berechnet. Die naheliegende Annahme, ein Blatt fasse zwei Seiten, gilt
nur bei beidseitigem Druck und stand hier zeitweise falsch.

Seit der Layoutanpassung (Zeilenabstand 5,0 mm, Umbruch bei 280 mm) passt eine
Mängelanzeige mit ein bis drei Mängeln auf **eine** Seite, also ein Blatt. Ab
vier Mängeln werden es zwei. Wer eine Unterschrift zeichnet, bekommt in jedem
Fall ein zweites Blatt: Die Signatur wird auf eine neue Seite geschoben, wenn
sie nicht 30 mm über dem Umbruch beginnt.

| Mängel | Seiten | Blätter | Produkt |
|---:|---:|---:|---|
| 1–3 | 1 | 1 | Standardbrief |
| 4–5 | 2 | 2 | Standardbrief + 1 Zusatzblatt |
| mit Unterschrift | +1 | +1 | ein Blatt mehr als oben |

Aus dem Standardbrief fällt die Anzeige erst ab dem vierten Blatt.

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
| Einkauf (brutto, 1 Blatt — der Regelfall) | 0,88 € | 4,15 € |
| **Rohmarge** | **1,61 €** | **2,84 €** |
| Rohmarge in % | 64,7 % | 40,6 % |

Die Zeile „1 Blatt" ist der Regelfall, nicht der einzige Fall — was ein Blatt
mehr kostet, steht unter [Mehrblättrige Briefe](#mehrblättrige-briefe).

**Der erste echte Auftrag bestätigt die Staffelung.** Am 31.07.2026 rechnete
eBrief für einen zweiblättrigen Brief ab:

| Artikel | Brutto |
|---|---:|
| eBrief-Standard inkl. 1 Blatt s/w Simplex | 0,88 € |
| Zusatzblatt s/w Simplex | 0,05 € |
| **Summe** | **0,93 €** |

Das deckt sich mit dem Katalog auf den Cent. Der Brief trug eine Unterschrift —
genau der Fall, der laut Tabelle oben ein zweites Blatt erzwingt.

### Zahlungsgebühren fehlen in dieser Rechnung

Der Katalog kennt nur den eBrief-Einkauf. Die Stripe-Gebühr ist die zweite
variable Kostenposition, und bei diesen Beträgen ist sie nicht klein: Für
europäische Karten fallen typischerweise **1,5 % + 0,25 €** an, außerhalb
Europas mehr.

Auf die Gebühr kommen 19 % obendrauf, die nicht abziehbar sind — siehe
[Reverse Charge](#reverse-charge-auf-die-stripe-gebühren) unten.

| | Brief | Einwurf-Einschreiben |
|---|---:|---:|
| Verkaufspreis | 2,49 € | 6,99 € |
| eBrief (brutto) | −0,88 € | −4,15 € |
| Stripe (1,5 % + 0,25 €) | −0,29 € | −0,35 € |
| Reverse-Charge-USt darauf (19 %) | −0,05 € | −0,07 € |
| **Deckungsbeitrag** | **1,27 €** | **2,42 €** |

Beim Brief frisst die Zahlungsabwicklung damit **21 % der Rohmarge**,
überwiegend durch die Fixgebühr von 25 Cent. Das ist der Grund, warum ein
Preis unter etwa 2 € wirtschaftlich nicht funktioniert, und warum ein
Mengenrabatt bei eBrief die Rechnung weniger verbessert, als es die
Prozentzahl vermuten lässt.

## Mehrblättrige Briefe

Einseitiger Druck, eine Seite ist ein Blatt.

| Seiten | Blätter | Produkt | Einkauf brutto | Rohmarge Brief |
|---:|---:|---|---:|---:|
| 1 | 1 | Standardbrief | 0,88 € | 1,61 € |
| 2 | 2 | Standardbrief | 0,93 € | 1,56 € |
| 3 | 3 | Standardbrief | 0,98 € | 1,51 € |
| 4 | 4 | Kompaktbrief | 1,23 € | 1,26 € |

Bis in den Kompaktbrief hinein trägt sich der Preis. Die Absicherung dagegen,
dass ein sehr langer Brief unter den Einkaufspreis rutscht, sitzt in
`POST /api/versand/vorbereiten`: Die Route fragt vor dem Checkout den realen
Preis mit der tatsächlich gerenderten Seitenzahl ab und bricht mit
`preis_unplausibel` ab, statt mit Verlust zu drucken.

Die Preisantwort liefert laut Schema `TotalSumBrutto` und `TotalSumNetto` als
Doubles **in Euro** — nicht in Cent (`src/lib/ebrief/types.ts`).

## Offene Vorbehalte

**Die 250er-Schwelle hat sich erledigt.** Der öffentliche Katalog nennt die
Preise ohne Mindestmenge und eine monatliche Grundgebühr von 0,00 €. Die
Überschrift „ab 250 Sendungen pro Monat" auf der Vertragsanlage beschreibt das
Geschäftskundensegment, nicht eine Bedingung für den Preis.

**Was `IsTracking` produziert, ist weiterhin unbelegt** — und das ist keine
Preisfrage mehr, sondern eine Frage der Produktzusage. Der Code setzt
`IsTracking: "true"` und die Oberfläche verkauft das Ergebnis ausdrücklich als
**Einwurf-Einschreiben, nicht als Übergabe-Einschreiben mit Unterschrift**.
Dieselbe Zusage steht in den AGB. Der Katalog nennt das Produkt „eEinschreiben"
und beschreibt es mit „Sendungsverfolgung und Zustellnachweis"; die englische
Fassung spricht von einem „eTracked Letter". Beides schließt ein
Übergabe-Einschreiben nicht sicher aus.

Das ist der Punkt, an dem eine falsche Annahme teuer wird: Ein Mieter, der für
den Zugangsnachweis zahlt, bekommt entweder die dokumentierte Einlieferung
oder nicht — und die Zusage steht in einem Vertragstext. Die Testsendung an
PIN AG ist die Gelegenheit, das verbindlich klären zu lassen.

**Preisänderungen sind vertraglich zulässig.** Nach A.2.2 des
Dienstleistungsvertrags darf PIN AG die Preisliste mit vier Wochen Vorlauf
ändern. Widerspruch ist binnen zwei Wochen möglich, berechtigt die Gegenseite
dann aber zur Kündigung. Jede Änderung gehört gegen diese Tabelle gerechnet.

## Umsatzsteuer

Recherchestand Juli 2026, keine Steuerberatung. Die Punkte unten gehören
einmal von einer Steuerberatung bestätigt — insbesondere die Einordnung der
Stripe-Gebühr, die international uneinheitlich beurteilt wird.

### Reverse Charge auf die Stripe-Gebühren

Stripe rechnet seine Gebühren seit dem 1. Juli 2025 über die Stripe Payments
Europe Ltd. aus **Irland** ab, bei innergemeinschaftlichen B2B-Leistungen ohne
Umsatzsteuerausweis. Der Leistungsort liegt nach § 3a Abs. 2 UStG in
Deutschland, der Leistungsempfänger schuldet die Steuer nach § 13b UStG.

Anders als bei PayPal greift die Steuerbefreiung für Finanzdienstleistungen
hier **nicht**: Stripe gilt umsatzsteuerlich als Zahlungsabwickler, nicht als
Finanzdienstleister. Die Gebühr trägt also Umsatzsteuer.

Für Kleinunternehmer bedeutet das die ungünstige Kombination: Die Steuer ist
geschuldet, ein Vorsteuerabzug steht nicht zu. Die 19 % sind echte Kosten und
stehen deshalb oben in der Deckungsbeitragsrechnung.

**Die USt-IdNr. gehört bei Stripe hinterlegt.** Ohne sie behandelt Stripe das
Konto als Privatkunden und stellt 23 % irische Umsatzsteuer in Rechnung — die
ebenfalls nicht abziehbar wäre und höher liegt als die deutschen 19 %. Die
Zuteilung einer USt-IdNr. kostet den Kleinunternehmerstatus nicht: Wer
§ 19 Abs. 1 UStG erfüllt, bleibt Kleinunternehmer, auch mit USt-IdNr.

### Meldepflicht

Nach § 18 Abs. 4a UStG muss auch ein Kleinunternehmer eine
Umsatzsteuer-Voranmeldung abgeben für jeden Zeitraum, in dem er nach § 13b
UStG Steuerschuldner geworden ist — Frist ist der 10. Tag des Folgemonats. Da
Stripe monatlich abrechnet, entsteht diese Pflicht ab dem ersten
Verkaufsmonat dauerhaft.

Sie besteht allerdings **schon heute**, unabhängig vom Postversand: Vercel
(USA) und Google Ireland (Gemini-API) lösen dieselbe Rechtsfolge aus. Der
Verkaufsstart schafft die Pflicht also nicht, er macht sie nur sichtbar.

### Kleinunternehmer bleiben oder zur Regelbesteuerung wechseln?

Bei Verkauf an Verbraucher ist die Kleinunternehmerregelung die bessere
Variante, weil die Umsatzsteuer beim Endkunden nicht durchgereicht werden
kann, sondern die Marge kürzt:

| je Brief | Kleinunternehmer | Regelbesteuerung |
|---|---:|---:|
| Erlös nach USt | 2,49 € | 2,09 € |
| eBrief | −0,88 € (brutto) | −0,72 € (netto) |
| Stripe inkl. USt-Effekt | −0,34 € | −0,29 € (abziehbar) |
| **Deckungsbeitrag** | **1,27 €** | **1,08 €** |

Der Vorsteuerabzug wiegt den Erlösverlust nicht auf. Beim Einschreiben ist der
Abstand mit 2,42 € gegen 2,05 € noch deutlicher.

Relevant wird der Wechsel erst beim Überschreiten der Grenzen aus § 19 UStG
(seit 2025: 25 000 € Vorjahr, 100 000 € laufendes Jahr). Dann schaltet
`STEUERMODUS=regel` den Code um — die Verkaufspreise müssten in diesem Zug
angehoben werden, sonst sinkt die Marge um die oben gezeigte Differenz.
