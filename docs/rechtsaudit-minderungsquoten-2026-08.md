# Rechtsaudit: Minderungsquoten und Rechtsrahmen

**Stand:** 01.08.2026
**Prüfgegenstand:** `src/data/maengel.ts` (58 Mängel), Berechnungslogik in `src/components/MietminderungCheck.tsx`, Rechtsaussagen in `src/data/ratgeber.ts`, `src/data/seoContent.ts`, `src/app/mietminderungstabelle/page.tsx`
**Methode:** Sechs parallele Rechercheläufe gegen die veröffentlichte deutsche Rechtsprechung
**Status:** Umgesetzt. Die Befunde dieses Berichts sind in Daten, Rechner und Texte eingeflossen — siehe Abschnitt 8.

> **Offener Punkt für die Abnahme:** Die Zahlenempfehlungen konnten nicht an Urteilsvolltexten verifiziert werden (Abschnitt 0). Sie sind umgesetzt, weil so entschieden wurde, stehen aber weiterhin unter anwaltlichem Prüfvorbehalt. Dieser Bericht ist die Prüfliste dafür.

---

## 0. Verifikationsvorbehalt — bitte zuerst lesen

Die Egress-Policy der Rechercheumgebung hat den Zugriff auf **sämtliche juristischen Primärquellen** blockiert (HTTP 403 auf dejure.org, openjur.de, rechtsprechung-im-internet.de, bundesgerichtshof.de, haufe.de, kostenlose-urteile.de, mietrecht.com, mieterbund.de — sogar auf gesetze-im-internet.de). Gegengeprüft: auch ein Abruf des Gesetzestextes von § 536 BGB scheiterte mit 403.

**Konsequenz:** Kein einziges Aktenzeichen in diesem Bericht wurde im Urteilsvolltext verifiziert. Die Belege stammen aus Suchmaschinen-Zusammenfassungen von Rechtsportalen. Wo Gericht, Datum und Aktenzeichen über mehrere unabhängige Quellen konsistent waren, ist das vermerkt; alles andere ist als unbestätigt gekennzeichnet.

**Daraus folgt für die Umsetzung:** Dieser Bericht ist eine **priorisierte Prüfliste**, keine Freigabe. Die Zahlenempfehlungen sollten vor Übernahme in `maengel.ts` anwaltlich oder über juris/beck-online gegengeprüft werden. Die unter Abschnitt 1 genannten **strukturellen und methodischen Befunde** sind davon unabhängig — sie ergeben sich aus dem Code selbst bzw. aus gefestigter, mehrfach bestätigter BGH-Rechtsprechung und sind belastbar.

**Warum das zählt:** Die Detailseiten behaupten für jeden der 58 Mängel wörtlich *„Gerichte haben bei diesem Mangel Minderungsquoten zwischen X und Y Prozent anerkannt"* (`src/app/mietminderung/[kategorie]/[mangel]/page.tsx:44` und `:206`). Das ist eine harte Tatsachenbehauptung über Rechtsprechung, 58-fach indexiert. Jede Spanne muss belegbar sein.

---

## 1. Systemische Befunde (unabhängig von Einzelquoten)

Diese sechs Punkte wiegen schwerer als jede einzelne Prozentzahl.

### 1.1 Die Addition mehrerer Mängel bildet die Rechtslage nicht ab — höchstes Risiko

`MietminderungCheck.tsx:113–123` summiert die Einzelquoten und deckelt bei 100 %:

```ts
const totalTypical = Math.min(
  selectedMaengel.reduce((sum, m) => sum + m.minderung_typical, 0),
  100,
);
```

Die Rechtsprechung nimmt bei mehreren gleichzeitigen Mängeln keine Addition vor, sondern eine **Gesamtbetrachtung**: Maßgeblich ist nach § 536 Abs. 1 BGB der Grad, in dem die Tauglichkeit der Mietsache **als Ganzes** beeinträchtigt ist. Der Ratgeber (`ratgeber.ts:273`) erklärt die Addition zum Grundsatz und die Gesamtbetrachtung zur Ausnahme — rechtlich ist es umgekehrt.

Drei konkrete Fehlerquellen:

1. **Sich ausschließende Mängel sind kombinierbar.** `toggleMangel` erlaubt jede Kombination. Ein Nutzer kann `heizung_total` (80) + `heizung_teilweise` (30) + `heizung_unzureichend` (15) wählen → Summe 125 → gedeckelt auf 100 %. Die drei schließen einander logisch aus.
2. **Überlappende Mängel doppeln.** Undichtes *und* nicht schließbares Fenster; Küche komplett *und* Küchengeräte; Baugerüst *und* Baulärm — die Rechtsprechung bewertet das einmal.
3. **Der Deckel kaschiert den Fehler.** `Math.min(…, 100)` macht aus einer absurden Summe eine plausibel aussehende Zahl. Gerade die Fälle mit dem größten Rechenfehler wirken für den Nutzer am unauffälligsten.

Die ausgegebene Quote fließt direkt in die generierte Mängelanzeige (`Maengelanzeige.tsx`). Eine zu hohe Quote führt in den Zahlungsverzug — siehe 1.2.

### 1.2 Das Kündigungsrisiko ist zu günstig dargestellt

An fünf Stellen (`maengel.ts:726`, `ratgeber.ts:352`, `:665`, `:734`, `mietminderungstabelle/page.tsx:47`) heißt es, der Vermieter dürfe bei einem Rückstand von **zwei Monatsmieten** fristlos kündigen. § 543 Abs. 2 Satz 1 Nr. 3 BGB kennt aber zwei Alternativen, und die Website nennt nur die zweite:

- **Buchst. a:** Verzug an **zwei aufeinanderfolgenden Terminen** mit der Miete *oder einem nicht unerheblichen Teil*. Was „nicht unerheblich" heißt, definiert § 569 Abs. 3 Nr. 1 Satz 1 BGB: **mehr als eine Monatsmiete**. Nach BGH, Urteil vom 08.12.2021 – VIII ZR 32/20 genügt die Summe der beiden Teilbeträge, sobald sie eine Monatsmiete übersteigt — praktisch eine Monatsmiete plus einen Cent.
- **Buchst. b:** über mehr als zwei Termine ein Rückstand in Höhe von zwei Monatsmieten.

Die Website halbiert damit das tatsächliche Risiko. Auch das Rechenbeispiel in `ratgeber.ts:353` („wer fünf Monate 40 % einbehält …") ist zu beruhigend: Bereits nach drei Monaten liegt der Rückstand über einer Monatsmiete.

Zwei weitere Lücken an derselben Stelle:

- **Rechtsirrtum:** BGH, Urteil vom 11.07.2012 – VIII ZR 138/11 hat die frühere Privilegierung des Wohnraummieters beim unverschuldeten Rechtsirrtum ausdrücklich aufgegeben; es gelten strenge Maßstäbe. Wer sich bei der Quote im Graubereich bewegt, handelt fahrlässig. — Bemerkenswert: In derselben Entscheidung empfiehlt der BGH selbst die **Zahlung unter Vorbehalt**. Das ist genau der Rat der Website, und er ist damit höchstrichterlich abgesegnet. Dieses Argument wird derzeit verschenkt.
- **Schonfristzahlung (§ 569 Abs. 3 Nr. 2 BGB) fehlt vollständig.** Sie heilt nur die **fristlose**, nicht die hilfsweise erklärte **ordentliche** Kündigung. Der BGH hat das zuletzt mit Urteilen vom 23.10.2024 – VIII ZR 106/23 und VIII ZR 177/23 gegen die abweichende Berliner Linie bestätigt. Praktisch: Wer zu Unrecht mindert, nachzahlt und meint, es sei erledigt, kann die Wohnung trotzdem verlieren.

### 1.3 Der Umweltmangel-Vorbehalt („Bolzplatz-Doktrin") fehlt

Nach gefestigter BGH-Rechtsprechung sind nachträglich erhöhte Immissionen von einem **fremden Nachbargrundstück** ohne Beschaffenheitsvereinbarung **kein Mangel**, wenn der Vermieter sie nach § 906 BGB entschädigungslos hinnehmen muss:

| Entscheidung | Kernaussage |
|---|---|
| BGH, 19.12.2012 – VIII ZR 152/12 | Verkehrslärm 46 → 62 dB(A) über 18 Monate: kein Mangel, wenn ortsüblich |
| BGH, 29.04.2015 – VIII ZR 197/14 | Grundsatzentscheidung Nachbargrundstück / § 906 BGB; Kinderlärm zusätzlich § 22 Abs. 1a BImSchG |
| BGH, 29.04.2020 – VIII ZR 31/18 | überträgt die Doktrin ausdrücklich auf **Baulärm und -schmutz vom Nachbargrundstück** |
| BGH, 24.11.2021 – VIII ZR 258/19 | Bestätigung; Vorinstanz hatte 15 % zugesprochen, BGH hob auf |

Unser Eintrag `baulaerm_haus` wirft „im Haus" und „Nachbarhaus" in **eine** Position mit typisch 25 %. Für den Nachbarhaus-Fall sind das im Regelfall **0 %**. Das Gleiche gilt für `strassenlaerm` (Untergrenze 5 % statt 0 %) und teilweise `gastronomie`.

Gegenströmung, die wir transparent machen sollten, aber nicht als „die Rechtslage" darstellen dürfen: Die Berliner Instanzgerichte weichen weiter ab (LG Berlin II, 20.06.2024 – 67 S 78/24: pauschal 20 %).

### 1.4 „Ohne Mängelanzeige kein Anspruch" ist rechtlich falsch begründet

Die Website sagt an mehreren Stellen, die Mängelanzeige sei **Voraussetzung** der Minderung (`translations.ts:123`, `maengel.ts:688`, `:711`, `mietminderungstabelle/page.tsx:42`). Das trifft nicht zu:

- Die Minderung tritt nach § 536 Abs. 1 BGB **kraft Gesetzes** ein, sobald der Mangel vorliegt. Eine Erklärung oder Zustimmung ist nicht nötig.
- § 536c Abs. 2 Satz 2 Nr. 1 BGB führt nur **„soweit"** zum Rechtsverlust, wie der Vermieter *gerade wegen* der fehlenden Anzeige nicht abhelfen konnte — und gar nicht, wenn er den Mangel ohnehin kannte.
- § 536c Abs. 1 BGB erfasst zudem nur Mängel, die sich „im Laufe der Mietzeit" zeigen. Für **anfängliche** Mängel (z. B. falsche Wohnflächenangabe) ist die Norm nicht einschlägig.

Die Website widerspricht sich hier selbst: Der Eignungsfilter `angezeigt` (`maengel.ts:684–694`) setzt für **alle** Antwortoptionen `eligible: true` — also auch für „noch nicht gemeldet". Das ist richtig. Der Beschreibungstext direkt darüber sagt das Gegenteil.

Die praktische Empfehlung („zeigen Sie den Mangel sofort schriftlich an") bleibt der beste Rat. Falsch ist nur die Begründung — und sie schreckt Nutzer ab, denen für die Vergangenheit noch ein Rückforderungsanspruch zusteht.

### 1.5 Die Eignungsfragen greifen zu früh und zu grob

Die Fragen `erheblich` und `mangel_bekannt` laufen **vor** der Mangelauswahl (`MietminderungCheck.tsx:194–200`) und brechen bei negativer Antwort den gesamten Funnel ab.

- § 536b BGB sperrt die Rechte nur wegen **dieses einen** Mangels — der Nutzer darf wegen anderer Mängel selbstverständlich mindern. Zum Zeitpunkt der Frage hat er aber noch gar keinen Mangel ausgewählt.
- Die Frage `mangel_bekannt` knüpft an „bei Einzug" an. § 536b Satz 1 knüpft an den **Vertragsschluss**, Satz 3 an die **Annahme** — das können Monate auseinanderliegen.
- **§ 536b Satz 2 fehlt vollständig:** Bei grob fahrlässiger Unkenntnis bleiben die Rechte erhalten, wenn der Vermieter den Mangel **arglistig verschwiegen** hat. Das ist der zentrale Rettungsanker für Mieter.
- Die Abbruchseite („kein Anspruch") ist sachlich falsch: Der **Erfüllungsanspruch auf Mangelbeseitigung aus § 535 Abs. 1 Satz 2 BGB** bleibt bestehen.

### 1.6 Kein Ergebnis „0 %" möglich

Jeder der 58 Einträge hat `minderung_min > 0`. Die Erheblichkeitsschwelle des § 536 Abs. 1 Satz 3 BGB kommt im Rechner nicht vor, obwohl zahlreiche gefundene Entscheidungen genau daran scheitern (u. a. AG Berlin-Mitte 27 C 30/12 zur Wohnungstür; LG Berlin 67 S 173/04 zu Silberfischen; LG Berlin 63 S 194/06 zum Baugerüst; AG Leipzig 164 C 6049/04 zur Dachgeschosshitze). Das überzeichnet die Erwartungshaltung systematisch.

---

## 2. Die zwei methodisch falschen Einträge

### 2.1 `wohnflaeche_10` — der gravierendste Einzelbefund

**Ist:** 10–30 %, typisch 15 %. **Verdict: methodisch falsch.**

Nach gefestigter BGH-Rechtsprechung ist die Minderung bei Wohnflächenabweichung keine Schätzgröße, sondern **exakt der Prozentsatz der Abweichung**:

- **BGH, 24.03.2004 – VIII ZR 295/03 / VIII ZR 133/03:** Abweichung von mehr als 10 % begründet den Mangel; auf eine konkrete Nutzungsbeeinträchtigung kommt es nicht an.
- **BGH, 10.03.2010 – VIII ZR 144/09:** Maßgeblich ist der Prozentsatz, um den die vereinbarte Fläche unterschritten ist — **nicht** eine um die Toleranzschwelle verminderte Abweichung. Der „ca."-Zusatz gibt keinen zusätzlichen Spielraum.
- **BGH, 17.10.2023 – VIII ZR 61/23:** jüngste Bestätigung (49,18 m² vereinbart / 43,3 m² tatsächlich = 11,96 % → Mangel).

Bei 12 % Abweichung mindert sich die Miete also um **12 %**, nicht um 2 % und nicht um einen geschätzten Wert. Vier Fehler in unserer Abbildung:

1. Bei exakt 10,0 % Abweichung muss **0 %** herauskommen — die Schwelle muss überschritten sein. Wir geben 10 % aus.
2. Eine Obergrenze von 30 % existiert nicht. Bei 40 % Abweichung sind es 40 %.
3. Ein „typischer Wert" ist bei einer rechnerisch determinierten Größe bedeutungslos.
4. Der Eintrag ist nicht mit anderen Mängeln addierbar — was der Rechner aber tut.

**Bemerkenswert:** `seoContent.ts:178` beschreibt es intern bereits richtig („die Miete mindert sich im Verhältnis der Abweichung"). Der Rechner folgt dem nur nicht. Der Widerspruch steht also schon im eigenen Content.

**Empfehlung:** Aus der Mängelliste herausnehmen und durch ein eigenes Eingabefeld ersetzen (vereinbarte / tatsächliche m²), Minderung = Abweichung. Notlösung, falls kurzfristig nicht umsetzbar: `min: 10.01, max: 40, typical: 12`.

Zwei Abgrenzungen, die wir zusätzlich sauber darstellen sollten und die im Netz massenhaft verwechselt werden:
- BGH, 18.11.2015 – VIII ZR 266/14 hat die 10-%-Toleranz **nur für Mieterhöhungen** aufgegeben. Für die Minderung gilt sie unverändert.
- Der Folgesatz in `seoContent.ts:178` („Fehlt weniger, müssen Sie konkret darlegen …") ist irreführend: Unterhalb der Schwelle ist die Beeinträchtigung nach § 536 Abs. 1 Satz 3 BGB unerheblich, unabhängig vom Vortrag.

### 2.2 `hitze_dach` — stellt die Rechtslage invers dar

**Ist:** 10–25 %, typisch 15 %, Label „Extreme Hitze im Sommer (über 26 °C)". **Verdict: methodisch falsch und zu hoch.**

Maßstab ist **nicht die Temperatur**, sondern ob das Gebäude beim sommerlichen Wärmeschutz dem **zur Errichtungszeit** geltenden Stand der Technik entsprach (DIN 4108-2). 26 °C ist ein arbeitsmedizinischer Behaglichkeitswert, keine Mangelschwelle.

- AG Hamburg, 10.05.2006 – 46 C 108/04: **20 %** — aber in einer **Neubau**wohnung (Bj. 1998), tags ~30 °C, nachts >25 °C, *und* die Wärmeschutzbestimmungen der Bauzeit waren verletzt.
- AG Leipzig – 164 C 6049/04: **0 %** — im **Dachgeschoss** muss mit sommerlicher Aufheizung gerechnet werden; wer in Kenntnis dessen anmietet, verliert das Recht nach § 536b BGB.

Der Eintrag stellt die Lage damit genau umgekehrt dar: Ausgerechnet im Dachgeschoss ist die Minderung regelmäßig ausgeschlossen, der einzige Erfolgsfall war ein Neubau.

**Empfehlung:** 0–20 %, typisch 10 %; Temperaturangabe aus dem Label entfernen; Pflichthinweis auf den Baujahr-Maßstab und § 536b BGB.

### 2.3 `stellplatz_nicht_nutzbar` — ungeklärte Bezugsgröße

Die Rechtslage unterscheidet zwingend:

- **Einheitlicher Mietvertrag** → Minderung der Gesamtmiete, realistisch 2–10 %.
- **Getrennte Verträge** → Minderung **nur der Stellplatzmiete**. AG Frankfurt, 12.07.2024 – 33052 C 89/24 spricht 50 % zu — aber 50 % von z. B. 60 € Stellplatzmiete, nicht der Wohnungsmiete.

Werden Tabellenwerte aus dem zweiten Fall auf die Wohnungsmiete angewendet, entsteht ein um Faktor 10–20 überhöhter Betrag. Nach AG Köln – 201 C 193/18 entfällt die Minderung zudem ganz, wenn ein zumutbarer Ersatzstellplatz gestellt wird → Untergrenze muss 0 % sein.

---

## 3. Gesamttabelle aller 58 Einträge

Legende Priorität: **K** = kritisch · **H** = hoch · **M** = mittel · **N** = niedrig · **–** = keine Änderung nötig

### Heizung & Warmwasser

| id | ist (min/max/typ) | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `heizung_total` | 70/100/80 | Untergrenze zu hoch + Beschreibung falsch | 50/100/70 | **H** |
| `heizung_teilweise` | 20/50/30 | zu hoch, Flächenbezug fehlt | 5/30/15 (ggf. splitten) | **H** |
| `heizung_unzureichend` | 10/20/15 | Spanne zu eng | 5/30/15 | M |
| `warmwasser_total` | 10/30/15 | korrekt | unverändert | – |
| `warmwasser_vorlauf` | 3/10/5 | Zahlen korrekt, **Beschreibung falsch** | Zahlen halten, Text korrigieren | M |
| `heizung_geraeusche` | 10/17/12 | Max unbelegt (kein Urteil spricht 17 % zu) | 5/25/10 | M |

**Beschreibungsfehler `heizung_total`:** „Raumtemperatur unter 18 °C" ist der anerkannte **Nachtabsenkungs**- bzw. Nebenraumwert. Geschuldet sind tagsüber (ca. 6–23 Uhr) **20–22 °C** in Wohnräumen. Bei 18 °C liegt ein Mangel vor, aber gerade *kein* Totalausfall — dafür stehen 10–25 %, nicht 80 %. Nutzer werden hier systematisch in eine viel zu hohe Quote geführt.

**Beschreibungsfehler `warmwasser_vorlauf`:** Gerichte messen in **Litern bzw. Sekunden**, nicht in Minuten (Maßstab AG Schöneberg 102 C 55/94: 45 °C innerhalb ~10 Sekunden bzw. nach max. 5 Litern). Wer 5 Minuten wartet, liegt bei **10 %** — am oberen Rand, nicht beim Typwert 5 %. Beschreibung und Zahl passen nicht zusammen.

### Feuchtigkeit & Schimmel

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `schimmel_leicht` | 5/10/8 | Spanne zu eng | 5/15/10 | **H** |
| `schimmel_stark` | 20/50/30 | Obergrenze zu niedrig | 20/80/35 | **H** |
| `feuchtigkeit_wand` | 5/15/10 | vermischt Flecken und Durchfeuchtung | 5/30/12 (ggf. splitten) | M |
| `wasserschaden` | 20/50/30 | Untergrenze zu hoch | 10/50/25 | M |
| `trocknungsgeraete` | 30/100/50 | Untergrenze zu hoch | 15/100/40 | M |
| `feuchter_keller` | 5/10/7 | korrekt | 3/10/5 + § 536b-Hinweis | N |

**Wichtig für beide Schimmel-Einträge:** BGH, 05.12.2018 – VIII ZR 271/17 und VIII ZR 67/18: **Wärmebrücken in Außenwänden sind kein Sachmangel**, wenn der Bauzustand den zur Errichtungszeit geltenden Vorschriften entsprach. Dieser Hinweis fehlt und erzeugt bei Altbau-Nutzern systematisch falsche Erwartungen. Achtung: Diese Entscheidung wird im Netz massenhaft falsch als Beweislast-Urteil zugunsten des Mieters wiedergegeben — das ist sie nicht.

### Lärm & Ruhestörung

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `baulaerm_haus` | 10/40/25 | **Label vermengt entgegengesetzte Rechtsfälle** | **aufteilen:** eigenes Haus 5/60/20 · Nachbargrundstück 0/20/5 | **K** |
| `strassenlaerm` | 5/15/10 | Umweltmangel-Vorbehalt fehlt | 0/15/8 | **H** |
| `nachbarlaerm` | 10/20/15 | Spanne zu eng | 5/30/10 | M |
| `gastronomie` | 10/30/20 | Spanne zu eng, § 536b fehlt | 5/40/20 | M |
| `aufzug_laerm` | 5/10/7 | plausibel, aber **schwach belegt** | belassen (opt. max 15) | N |

Zu `aufzug_laerm`: Es wurde **keine** Entscheidung mit konkreter Quote speziell für Aufzugs*lärm* gefunden. Die in Suchergebnissen danebenstehenden Entscheidungen (AG Charlottenburg 2 C 484/89; AG Bremen 10 C 300/86) betreffen den **Ausfall** des Aufzugs. Intern als unbelegt kennzeichnen.

Nützlicher Zusatz für die Seite: Nach BGH VIII ZR 155/11 und VIII ZR 226/16 ist ein detailliertes **Lärmprotokoll nicht erforderlich** — Art, ungefähre Zeit, Dauer und Häufigkeit genügen der Darlegungslast. Die Beweislast bleibt beim Mieter.

### Ungeziefer & Schädlinge

Durchgängiger Befund: **systematisch zu niedrig gedeckelt.** Die Obergrenzen von 10–25 % bilden nur leichte bis mittlere Fälle ab.

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `kakerlaken` | 10/25/15 | Max zu niedrig | 10/70/20 | **H** |
| `ratten` | 10/25/15 | Spanne an beiden Enden falsch | **aufteilen:** Wohnung 20/80/40 · Hof/Keller 2/20/10 | **H** |
| `maeuse` | 5/10/8 | zu niedrig | 10/30/15 | **H** |
| `bettwanzen` | 10/25/20 | deutlich zu niedrig | 20/70/40 | **H** |
| `silberfische` | 5/20/10 | korrekt | 5/20/15 + Erheblichkeitshinweis | N |
| `wespen` | 5/15/10 | **keine Quoten-Rechtsprechung auffindbar** | 5/20/10, intern als unbelegt markieren | N |

Belege für die größten Abweichungen: AG Stuttgart, 30.03.2021 – 35 C 5509/19 (**60 %** Bettwanzen, Einschleppung über Gepäck gehört zum vertragsgemäßen Gebrauch); AG Dülmen, 15.11.2012 – 3 C 128/12 (**80 %** Ratten in der Wohnung); AG Frankfurt, 12.05.2021 – 33 C 390/21 (93) (**20 %** Mäuse); AG Tempelhof-Kreuzberg, 06.11.2013 – 15 C 60/13 (**mind. 70 %** Kakerlaken).

Zu `silberfische`: Als Mangel gelten sie erst ab etwa 10–15 Tieren täglich. Vereinzelte Tiere (2–4) begründen keine Minderung.

Zu `wespen`: Die gesamte auffindbare Rechtsprechung betrifft die **Kostentragung**, nicht die Minderung. Praktisch relevanter als die Quote wären zwei Hinweise — der Vermieter trägt die Beseitigungskosten (Umlage unzulässig), und Hornissen/Wildbienen sind nach § 44 BNatSchG geschützt, die Entfernung braucht eine Ausnahmegenehmigung.

Übergreifend fehlt in allen sechs Einträgen der Vorbehalt zum **Verursachungsbeitrag des Mieters**.

### Fenster & Türen

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `fenster_undicht` | 5/20/10 | korrekt, typ leicht hoch | 5/20/8 | N |
| `fenster_oeffnen` | 5/15/10 | korrekt (Max unbelegt) | unverändert | – |
| `fenster_schliessen` | 5/15/10 | korrekt | unverändert | – |
| `tuer_abschliessbar` | 5/25/10 | **zu hoch, Faktor 2–5** | 3/10/5 | **H** |
| `klingel_defekt` | 1/3/2 | zu niedrig | 1/5/3 | N |

Zu `tuer_abschliessbar`: Die Rechtsprechung liegt durchgängig bei 3–5 % (AG Köln 153 C 3204/76; LG Berlin 61 S 171/80). Für 25 % wurde kein Beleg gefunden. Der einzige 10-%-Fund betraf eine *undichte* Haustür mit Zugluft — das gehört sachlich zu `fenster_undicht`.

### Bad & Sanitär

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `toilette_defekt` | 15/80/50 | **Zweit-WC-Differenzierung fehlt** | 20/80/50 + **neuer Eintrag** Zweit-WC 3/10/5 | **H** |
| `dusche_defekt` | 5/15/10 | Spanne zu eng | 3/33/10 (besser splitten) | M |
| `wasserdruck_niedrig` | 3/5/4 | korrekt | unverändert | – |
| `bad_belueftung` | 5/10/7 | Beleglage zu dünn | 3/10/5 + „innenliegendes Bad" | M |
| `spuelung_defekt` | 5/15/10 | leicht zu hoch | 3/15/7 | N |

Zu `toilette_defekt`: Das Label ist neutral formuliert, die Beschreibung nennt „die einzige Toilette". Ein Nutzer mit zweitem WC wählt den Eintrag und bekommt mindestens 15 % — die einschlägige Rechtsprechung liegt dort bei rund 7 % (AG Nidda 1 C 600/82). Faktor 2 bis 7 zu hoch. Anmerkung zur Belegqualität: Die 80 % beruhen auf **einer** Berliner Entscheidung von 1988, die seither durch alle Tabellen kopiert wird; die typischen 50 % stammen aus einem Fall, in dem Küche **und** WC ausfielen.

Zu `dusche_defekt`: Reale Bandbreite 3–33 %. Unsere Spanne schneidet beide Enden ab — insbesondere den praktisch wichtigsten Fall, dass die Dusche die einzige Waschmöglichkeit ist (AG Köln 206 C 85/95: 33,33 %).

### Küche & Geräte

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `herd_defekt` | 2/5/3 | **korrekt** (bestbelegter Eintrag) | Zahlen halten + Voraussetzung | M |
| `kuehlschrank_defekt` | 5/10/7 | zu hoch, **unbelegt** | 2/5/3 | **H** |
| `spuelmaschine_defekt` | 3/5/5 | zu hoch, **unbelegt** | 1/3/2 | **H** |
| `kueche_komplett` | 20/100/50 | Obergrenze rechtlich nicht haltbar | 15/60/30 | **H** |

**Fehlende Voraussetzung in der ganzen Kategorie:** Ein Gerätedefekt ist nur dann ein Mangel, wenn das Gerät **mitvermietet** ist (Einbauküche laut Vertrag). Hat der Mieter es selbst eingebracht: 0 %. Der Rechner fragt das nicht ab und produziert damit in einer relevanten Zahl von Fällen rechtlich falsche Ergebnisse. Empfehlung: Pflichtabfrage „Ist das Gerät laut Mietvertrag mitvermietet?" mit Ausgabe 0 % bei „Nein".

Zu `kuehlschrank_defekt`/`spuelmaschine_defekt`: Für beide wurde **keine einzige** Entscheidung mit konkreter Quote gefunden; die kursierenden „5–10 %" sind redaktionelle Schätzungen. Zusätzlich intern inkonsistent — der Kühlschrank (7 %) wird mehr als doppelt so hoch bewertet wie der Herd (3 %), obwohl der Herd funktional wichtiger ist und für ihn eine gefestigte Rechtsprechung existiert.

Zu `kueche_komplett`: 100 % setzt nach § 536 Abs. 1 Satz 1 BGB die **vollständige** Aufhebung der Gebrauchstauglichkeit voraus, also Unbewohnbarkeit der ganzen Wohnung. Eine unbenutzbare Küche erreicht das nicht. Der einzige 100-%-Beleg betrifft einen Totalausfall der gesamten Wohnungsinfrastruktur.

### Aufzug

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `aufzug_defekt` | 5/20/10 | korrekt | 3/20/10 | N |
| `aufzug_hoch` | 15/50/20 | Max nicht belegbar | 10/25/18 | **H** |

Zu `aufzug_hoch`: Gezielt nach Quoten über 20 % gesucht — **keine** Entscheidung gefunden, die für reinen Aufzugsausfall mehr zusprach. Selbst 10. Etage im Hochhaus (AG Berlin-Mitte 10 C 24/07) und gehbehinderter Mieter (AG München 473 C 24103/15) enden bei 20 %. Ergänzend: Die subjektive Situation des Mieters wird nur berücksichtigt, wenn sie **Vertragsinhalt** geworden ist.

### Elektrik & Technik

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `strom_komplett` | 50/100/80 | korrekt | Zahlen halten + Zeitanteil-Hinweis | M |
| `treppenhaus_licht` | 5/10/5 | zu hoch | 1/10/3 | M |
| `internet_ausfall` | 5/10/7 | **korrekt, sehr gut kalibriert** | unverändert | – |
| `kabel_defekt` | 5/10/7 | zu hoch | 1/10/3 | M |

Zu `internet_ausfall`: Die Einschränkung im Label ist juristisch tragend und muss bleiben. Ein **Telefon**anschluss gilt als Mindeststandard, ein **Internet**anschluss nicht automatisch. Ergänzen: „Eine langsame Verbindung begründet keine Minderung."

Zu `kabel_defekt`: Seit Wegfall des Nebenkostenprivilegs (Juli 2024) ist der Kabelanschluss in vielen Verträgen gar nicht mehr Teil der Mietsache — dann gibt es überhaupt keine Minderung.

### Wohnfläche & Raumqualität

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `wohnflaeche_10` | 10/30/15 | **methodisch falsch** (Abschnitt 2.1) | eigenes m²-Eingabefeld | **K** |
| `hitze_dach` | 10/25/15 | **methodisch falsch** (Abschnitt 2.2) | 0/20/10 + Label ändern | **H** |
| `undichtes_dach` | 15/30/20 | Untergrenze zu hoch | 10/30/20 | N |

Zu `undichtes_dach`: AG Charlottenburg, 01.03.2018 – 210 C 375/17 liefert eine brauchbare Staffelung — **10 %** allein für das Risiko künftigen Wassereintritts, **+5 %** für vorhandene Wasserflecken, 25–30 % bei aktiv tropfendem Wasser.

### Balkon, Terrasse & Außenbereiche

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `balkon_nicht_nutzbar` | 3/10/5 | **korrekt** | unverändert | – |
| `terrasse_nicht_nutzbar` | 5/15/10 | korrekt | unverändert (opt. max 20) | – |
| `keller_nicht_nutzbar` | 5/10/7 | zu hoch | 2/10/5 | M |
| `stellplatz_nicht_nutzbar` | 5/10/7 | **Bezugsgröße ungeklärt** (Abschnitt 2.3) | 0/10/4 + Vertragsabfrage | **H** |
| `baugeruest` | 5/15/10 | zu hoch | 0/10/5 | M |

Zu `baugeruest`: AG Wiesbaden, 25.06.2012 – 93 C 2696/11 hat vorbildlich aufgeschlüsselt — **3 %** für das Gerüst als solches, +5 % für Auf-/Abbau, +20 % für Bohren/Schweißen/Hämmern. Die hohen Tabellenwerte (20–40 %) stammen also überwiegend aus dem **Lärm**, nicht aus dem Gerüst. Wenn wir Baulärm als eigene Position führen, darf er hier nicht eingepreist sein.

### Gesundheitsgefahren

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `asbest` | 10/50/20 | **Differenzierung fehlt** | aufteilen: gebunden/unbeschädigt 0/10/5 · beschädigt 10/50/20 | **H** |
| `legionellen` | 10/25/15 | Spanne zu eng | 10/50/15 (+ opt. Duschverbot 50/100/75) | M |
| `bleirohre` | 10/15/12 | **zu hoch** | 5/10/8 | **H** |
| `formaldehyd` | 20/50/30 | fast korrekt | 25/56/30 | N |

Zu `asbest`: Das bloße Vorhandensein fest gebundenen, unbeschädigten Asbests begründet regelmäßig **keinen** Mangel. Entscheidend ist Beschädigung bzw. begründete Freisetzungsbesorgnis (LG Berlin 65 S 419/10: 10 %; LG Berlin 18 S 133/15: 20 %, dort genügt bereits das Austreten einzelner Fasern ohne Grenzwertüberschreitung). Unsere Beschreibung „Asbest wurde gefunden" löst die Quote zu früh aus. — Zur Frage, ob 50 % zu niedrig sei: Es wurde **kein** veröffentlichtes Minderungsurteil über 50 % gefunden; die kursierende Aussage „bis 100 % möglich" ist eine abstrakte Ableitung aus § 536 BGB, keine Entscheidung.

Zu `bleirohre`: Sämtliche auffindbaren Entscheidungen liegen bei 5–10 % — unser *Minimum* entspricht dem, was Gerichte als *Maximum* zusprechen. Selbst bei vierfacher Grenzwertüberschreitung nur 10 %.

Aktuelle Grenzwerte für den Ratgeberteil:
- **Blei:** 0,010 mg/l seit 01.12.2013, in der TrinkwV 2023 beibehalten; **ab 12.01.2028 halbiert auf 0,005 mg/l**. Wichtig und tagesaktuell: Bleileitungen mussten nach TrinkwV 2023 **bis zum 12.01.2026** entfernt oder ersetzt sein — diese Frist ist abgelaufen. Wer heute noch Bleileitungen hat, ist ohne Verlängerungsbescheid im Verzug.
- **Legionellen:** technischer Maßnahmenwert **100 KBE/100 ml**. Bereits die Überschreitung begründet den Mangel; eine konkrete Gesundheitsgefahr ist nicht erforderlich (AG Köln 201 C 177/17; LG Berlin 67 S 17/21).
- **Formaldehyd:** Innenraum-Richtwert 0,1 mg/m³. Seit **06.08.2026** gelten über die EU-Verordnung 2023/1464 erstmals verbindliche Emissionsgrenzwerte (62 µg/m³ für Holzwerkstoffe, 80 µg/m³ sonstige Produkte) — guter aktueller Aufhänger für den Ratgeber.

### Geruchsbelästigung

| id | ist | Verdict | Empfehlung | Prio |
|---|---|---|---|---|
| `abwasser_geruch` | 10/20/15 | **typ über der BGH-Linie** | 5/25/10 | **H** |
| `muell_geruch` | 5/10/7 | **korrekt** (bestkalibriert) | unverändert | – |
| `gewerbe_geruch` | 5/20/10 | fast korrekt | 5/25/10 | N |

Zu `abwasser_geruch`: BGH, 04.09.2018 – VIII ZR 100/18 ist die Leitentscheidung und liegt bei **10 %**. Besonders aussagekräftig LG Berlin, 01.03.2018 – 67 S 342/17: Dort forderten die Mieter genau die 15 %, die wir als „typisch" ausgeben — und bekamen 10 %.

---

## 4. Falsch- und Fantasiezitate, die nicht übernommen werden dürfen

Bei der Recherche sind mehrere im Netz kursierende Zitate aufgefallen, die nachweislich falsch sind. Sie stehen aktuell **nicht** in unserem Code — sollten aber auch künftig nicht hineingelangen.

| Kursierendes Zitat | Problem |
|---|---|
| „BGH, 12.07.2023 – VIII ZR 34/22" und „BGH, 10.10.2023 – VIII ZR 143/22" (angeblich: Minderung auch bei Nachbarbaulärm) | **Mutmaßlich frei erfunden.** Nur auf einem einzigen Kanzlei-Blog auffindbar, der nach KI-generiertem Content aussieht. Keine Treffer in Rechtsdatenbanken; widersprechen zudem der BGH-Linie. |
| „BGH VIII ZR 173/03 = 15 % bei Schabenbefall" | Das Urteil existiert, betrifft aber **Bereicherungsausgleich nach Forderungsabtretung**, nicht Mietrecht. |
| „BGH, 12.12.2012 – VIII ZR 181/12 = 10 % Baugerüst" | Betrifft den **Schönheitsreparaturen-Zuschlag** nach § 28 Abs. 4 II. BV. |
| „BGH, 22.12.2009 – 5 Cv362/05" (Asbest) | Aktenzeichenform für den BGH **formal unmöglich**. |
| „AG Eutin, Juni 2018, 100 % Asbest" | Kein Aktenzeichen auffindbar; betrifft inhaltlich Ersatzunterkunftskosten. |
| „LG Frankfurt (Oder) 15 S 112/17 = 50 % Warmwasser" | Existiert (29.11.2018), betrifft aber das **komplette Abstellen der Wasserversorgung**. |
| „AG Münster 8 C 749/94 = 20 % Müllgeruch" | Betrifft **Hundekot und Hundeurin** im Treppenhaus. |
| „AG Neukölln 16 C 395/16 = 60 % Bettwanzen" | Betrifft die **Kostentragung** für den Kammerjäger und ging **zugunsten des Vermieters** aus. |
| „AG Neukölln 9 C 613/87" (100 % Elektrik) | Korrektes Aktenzeichen ist **15 C 23/87**. |
| „BGH VIII ZR 205/03" / „VIII ZR 256/13" (Wohnfläche) | Existieren so nicht. Gemeint sind VIII ZR 295/03, VIII ZR 133/03, VIII ZR 44/03 bzw. VIII ZR 256/09. |

---

## 5. Prüfung der bestehenden Zitate und Normverweise im Code

Im gesamten Repository steht **genau ein** Aktenzeichen, an vier Stellen: BGH, 06.04.2005 – XII ZR 225/03 (`ratgeber.ts:232`, `:310`, `mietminderungstabelle/page.tsx:32`, `translations.ts:204`).

**Ergebnis: existiert, Datum und Aktenzeichen korrekt, Inhalt trifft die Aussage** (BGHZ 163, 1 = NJW 2005, 1713). Aber: Der Fall betraf **Gewerberaum** — der XII. Zivilsenat ist der Gewerbemietsenat. Für eine Wohnraum-Website ist das der schwächere Beleg.

**Fehlt und sollte ergänzt werden:**

| Belegbedarf | Einschlägige Entscheidung |
|---|---|
| Bruttomiete als Bemessungsgrundlage bei **Wohnraum** | BGH, 20.07.2005 – **VIII ZR 347/04** |
| Minderung wirkt auf die Betriebskostenabrechnung durch | BGH, 13.04.2011 – VIII ZR 223/10 |
| 10-%-Grenze Wohnfläche | BGH, 24.03.2004 – VIII ZR 133/03; 10.11.2010 – VIII ZR 306/09 |
| BGH empfiehlt selbst die Zahlung unter Vorbehalt | BGH, 11.07.2012 – VIII ZR 138/11 |
| Rückforderung trotz vorbehaltloser Zahlung | BGH, 04.09.2018 – VIII ZR 100/18 |
| Keine Verwirkung analog § 536b BGB | BGH, 16.07.2003 – VIII ZR 274/02 |

**Fehlende Normverweise:** § 569 Abs. 3 Nr. 1 BGB (Erheblichkeit des Rückstands), § 569 Abs. 3 Nr. 2 BGB (Schonfristzahlung), § 573 Abs. 2 Nr. 1 BGB (ordentliche Kündigung), § 812 BGB und § 814 BGB (Rückforderung), §§ 195, 199 BGB (Verjährung) — Letztere werden inhaltlich korrekt beschrieben, aber nirgends benannt.

**Zwei unbelegte Aussagen im Code:**

1. **`ratgeber.ts:578` — „weniger als etwa ein Prozent der Jahresmiete" als Erheblichkeitsmaßstab.** Dafür wurde keine mietrechtliche Fundstelle gefunden. Die geläufigen Prozentsätze (6–8 % der Jahresmiete) betreffen **Kleinreparaturklauseln**, eine andere Frage. Die Erheblichkeit nach § 536 Abs. 1 Satz 3 BGB bemisst sich nach der **Gebrauchsbeeinträchtigung**, nicht nach Beseitigungskosten. → streichen.

2. **Die „6-Monats-Verwirkung" an sieben Stellen** (`ratgeber.ts:425`, `:470`, `:491`, `:522`, `:590`, `:713`, `maengel.ts:756`) — dargestellt als geltender Richtwert der Rechtsprechung. Diese Regel stammt aus der Rechtsprechung zu **§ 539 BGB a. F.** und ist seit der Mietrechtsreform 2001 überholt. Nach BGH, 16.07.2003 – VIII ZR 274/02 führt vorbehaltlose Zahlung in Kenntnis des Mangels **nicht** analog § 536b BGB zum Rechtsverlust und begründet allenfalls in Ausnahmefällen eine Verwirkung nach § 242 BGB (Zeit- **und** Umstandsmoment kumulativ). Der Ratgeber erklärt diese Dogmatik in `ratgeber.ts:471` sogar korrekt — nennt aber im selben Atemzug die Sechs-Monats-Zahl als Richtwert und in der Tabelle `:489–493` als feste Frist. Das ist der stärkste Abschreckungsfaktor der Website und beruht auf aufgehobenem Recht.

**Ebenfalls zu entschärfen:** „Rückwirkend mindern geht meistens nicht" (`ratgeber.ts:444`, `:453`, `maengel.ts:736`) ist zu ungünstig. Weil die Minderung kraft Gesetzes eintritt, ist die Überzahlung nach § 812 BGB kondizierbar; § 814 BGB greift nur bei **positiver Kenntnis der Rechtslage**, nicht bei Kenntnis des Mangels. Der praktisch häufigste Fall — der Mieter wusste nicht, dass die Minderung automatisch eintritt — fehlt in der Aufzählung `ratgeber.ts:457–463` ganz.

---

## 6. Priorisierte Handlungsliste

### Sofort — Rechtsrisiko für Nutzer
1. **Addition entschärfen** (`MietminderungCheck.tsx:113–123`): sich ausschließende Mängel im UI sperren; Ergebnis als „Summe der Einzelrichtwerte, nicht die erwartbare Gesamtquote" beschriften; Warnhinweis ab zwei ausgewählten Mängeln.
2. **Kündigungsschwelle korrigieren** an allen fünf Fundstellen: § 543 Abs. 2 Satz 1 Nr. 3 Buchst. a i. V. m. § 569 Abs. 3 Nr. 1 BGB, mit BGH VIII ZR 32/20.
3. **Schonfristzahlung aufnehmen** — samt der Einschränkung, dass sie die ordentliche Kündigung nicht heilt (BGH VIII ZR 106/23, VIII ZR 177/23).
4. **`wohnflaeche_10` auf Berechnung umstellen** (Abschnitt 2.1).
5. **`kueche_komplett` von 100 % herunternehmen** — der Wert lädt zu einer Minderung ein, die die fristlose Kündigung auslösen kann.

### Kurzfristig — inhaltliche Richtigkeit
6. `baulaerm_haus` aufteilen und den Umweltmangel-Vorbehalt aufnehmen (Abschnitt 1.3).
7. „Mängelanzeige ist Voraussetzung" → „entscheidend für die Durchsetzung" (6 Fundstellen).
8. 6-Monats-Verwirkung streichen bzw. auf § 242 BGB umstellen (7 Fundstellen).
9. `ratgeber.ts:578` streichen (1 % der Jahresmiete, unbelegt).
10. Beschreibungen korrigieren: `heizung_total` (18 °C), `warmwasser_vorlauf` (Minuten → Sekunden/Liter), `asbest` („gefunden" → „beschädigt/Freisetzung"), `hitze_dach` (Label).
11. Fehlende Voraussetzungen ergänzen: Küchengeräte mitvermietet; Zweit-WC; innenliegendes Bad; Stellplatz-Vertragsstruktur; BGH-Wärmebrücken bei Schimmel.
12. § 536b-Abfrage auf Vertragsschluss/Annahme umstellen, Satz 2 (Arglist) aufnehmen, Abbruchseite durch Hinweis auf den fortbestehenden Erfüllungsanspruch ersetzen.

### Mittelfristig
13. Quoten-Rekalibrierung nach Abschnitt 3 — **nach anwaltlicher Gegenprüfung**.
14. Eignungsfragen `erheblich` und `mangel_bekannt` **hinter** die Mangelauswahl verschieben.
15. Belege ergänzen (Abschnitt 5) — dient zugleich der inhaltlichen Autorität der Seite.
16. Prüfen, ob der Rechner Wohn- von Gewerberaum abgrenzt (§ 536 Abs. 4 BGB gilt nur für Wohnraum).

---

## 7. Bilanz

| Kategorie | Anzahl |
|---|---|
| Einträge geprüft | 58 |
| Keine Änderung nötig | 12 |
| Rekalibrierung empfohlen | ~35 |
| Aufteilung empfohlen | 5 (`baulaerm_haus`, `ratten`, `toilette_defekt`, `asbest`, `dusche_defekt`) |
| Methodisch fehlerhaft | 3 (`wohnflaeche_10`, `hitze_dach`, `stellplatz_nicht_nutzbar`) |
| Beschreibung sachlich falsch | 4 (`heizung_total`, `warmwasser_vorlauf`, `asbest`, `hitze_dach`) |
| Ohne auffindbare Rechtsprechung | 4 (`kuehlschrank_defekt`, `spuelmaschine_defekt`, `wespen`, `aufzug_laerm`) |

**Erkennbares Muster:** Zu hohe Werte häufen sich bei **Neben- und Gemeinschaftsflächen** (Keller, Baugerüst, Treppenhaus, Kabel, Wohnungstür), zu niedrige durchgängig bei **Ungeziefer**. Beides deutet auf dieselbe Ursache hin: Gängige Mietminderungstabellen listen Kombinationsfälle (Gerüst + Lärm, Küche + WC) als Einzelpositionen und decken bei Ungeziefer nur leichte Fälle ab.

**Zur Altersstruktur der Belege:** Der zitierbare Kanon stammt ganz überwiegend aus 1975–2005. Das ist kein Rechercheversäumnis, sondern strukturell — Bagatellmängel werden selten ausgeurteilt. Bemerkenswert ist aber, dass die wenigen auffindbaren Entscheidungen ab 2020 durchweg am unteren Rand oder in der Mitte der Tabellenwerte liegen. Ein Trend zu höheren Quoten ist nicht erkennbar.

---

## 8. Umsetzungsstand

Alle Befunde dieses Berichts sind umgesetzt. Was konkret geändert wurde:

### Rechner (`MietminderungCheck.tsx`, `src/lib/minderung.ts`)

- **Keine Addition mehr.** Die neue Funktion `gesamtQuote` bildet die Gesamtbetrachtung ab: Der höchste Einzelwert zählt voll, jeder weitere zur Hälfte. Weiterhin bei 100 % gedeckelt.
- **Ausschlussgruppen.** `Mangel.excludes` verhindert, dass sich logisch ausschließende Mängel gleichzeitig auswählen lassen. Gesetzt für: Heizung total/teilweise/unzureichend, Schimmel leicht/stark, Ratten Wohnung/Umfeld, Toilette einzige/Zweit-WC, Dusche einzige/mit Badewanne, Asbest beschädigt/gebunden, Aufzug normal/hohes Stockwerk, Küche komplett gegen die Einzelgeräte, Baulärm eigenes Haus/Nachbargrundstück, undichtes gegen nicht schließbares Fenster.
- **Wohnfläche wird gerechnet, nicht geschätzt.** Wird der Eintrag gewählt, erscheinen zwei m²-Felder. Bis einschließlich 10 % Abweichung gibt der Rechner **0 %** aus, darüber exakt die Abweichung (`wohnflaechenQuote`).
- **Hinweis auf die Gesamtbetrachtung** erscheint ab zwei ausgewählten Mängeln, in der Auswahl und im Ergebnis.

### Eignungsfragen (`maengel.ts`)

- `mangel_bekannt` knüpft jetzt an **Vertragsschluss/Übernahme** statt an „Einzug“, nennt § 536b Satz 1–3 und hat eine neue Option für **arglistiges Verschweigen**. „Ja, ohne Vorbehalt“ bricht den Funnel nicht mehr ab (`eligible: null`), weil § 536b nur diesen einen Mangel sperrt.
- `erheblich` → „gering“ bricht ebenfalls nicht mehr ab: Mehrere Bagatellmängel können die Schwelle zusammen überschreiten, und zum Zeitpunkt der Frage ist noch kein Mangel gewählt.
- `angezeigt` sagt jetzt korrekt, dass die Minderung kraft Gesetzes eintritt und die Anzeige der Durchsetzung dient.

### Quoten und Beschreibungen (`maengel.ts`)

Alle Quoten aus Abschnitt 3 sind übernommen. Fünf Einträge wurden aufgeteilt, mit je eigener SEO-Seite:

| Neu | Quote |
|---|---|
| `baulaerm_nachbar` — Baulärm vom Nachbargrundstück | 0/20/5 |
| `ratten_umfeld` — Ratten in Keller, Hof oder Garten | 2/20/10 |
| `toilette_zweit_wc` — Toilette defekt, zweites WC vorhanden | 3/10/5 |
| `dusche_einzige` — einzige Dusch-/Bademöglichkeit ausgefallen | 15/35/25 |
| `asbest_gebunden` — Asbest fest gebunden und unbeschädigt | 0/10/5 |

Die vier sachlich falschen Beschreibungen sind korrigiert (`heizung_total`, `warmwasser_vorlauf`, `asbest`, `hitze_dach`), ebenso die fehlenden Voraussetzungen (Küchengeräte mitvermietet, innenliegendes Bad, Stellplatz-Vertragsstruktur, § 536b beim Keller, BGH-Wärmebrücken beim Schimmel).

### Rechtstexte

- **Kündigungsschwelle** an allen Fundstellen auf § 543 Abs. 2 Satz 1 Nr. 3 Buchst. a i. V. m. § 569 Abs. 3 Nr. 1 BGB korrigiert (eine Monatsmiete an zwei Terminen).
- **Schonfristzahlung** neu aufgenommen, samt der Einschränkung auf die fristlose Kündigung.
- **6-Monats-Verwirkung** an allen sieben Fundstellen entfernt bzw. auf § 242 BGB mit Zeit- und Umstandsmoment umgestellt.
- **„1 % der Jahresmiete“** als Erheblichkeitsmaßstab gestrichen.
- **Rückforderung** um §§ 812, 814 BGB ergänzt; „meistens nicht“ korrigiert.
- **Bemessungsgrundlage** nennt jetzt VIII ZR 347/04 für Wohnraum, XII ZR 225/03 nur noch ergänzend.
- **Wohnflächen-Passage** korrigiert, inklusive der Abgrenzung zur aufgegebenen 10-%-Regel bei Mieterhöhungen.
- **„Gerichte haben anerkannt“** auf den 63 Detailseiten zu „veröffentlichte Mietminderungstabellen nennen … Orientierungswerte, kein Gericht ist daran gebunden“ abgeschwächt. Für die Wohnfläche erscheint stattdessen die Rechenregel.

### Bekannte Lücke

Die **lokalisierten Mangel-Beschreibungen** in en, tr, uk, ru, ar und pl wurden nur dort nachgezogen, wo sich die deutsche Aussage rechtlich materiell geändert hat (12 Einträge, alle geänderten FAQ-Antworten, alle Eignungsfragen). Die übrigen Beschreibungen sind noch die alten Übersetzungen und geben die neuen Vorbehalte nicht wieder. Ein vollständiger Übersetzungsdurchlauf über `src/i18n/content/*.ts` steht aus.
