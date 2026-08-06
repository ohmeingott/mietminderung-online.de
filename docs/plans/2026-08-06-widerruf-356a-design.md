# Widerrufsrecht auf den Stand seit 19.6.2026 — Design

**Stand:** 6. August 2026
**Betrifft:** § 356 Abs. 5 Nr. 2 BGB (zwei Erklärungen), § 356a BGB (Widerrufsbutton)

## Warum

Der Dienst ist live und nimmt Zahlungen an. Das Widerrufsrecht steht im Code auf
dem Stand vor dem 19.6.2026:

1. **Der Widerrufsbutton nach § 356a BGB fehlt vollständig.** `/widerruf` ist
   eine reine Textseite; es gibt keine Schaltfläche, kein Formular und keine
   Route `/api/widerruf`.
2. **Der Checkout verlangt eine Erklärung statt zwei** und zitiert durchgehend
   § 356 Abs. 4 BGB. Seit dem 19.6.2026 ist die Vorschrift § 356 Abs. 5 Nr. 2
   BGB und verlangt zwei getrennte Erklärungen: das ausdrückliche Verlangen nach
   sofortigem Beginn (lit. a) und davon getrennt die Bestätigung der Kenntnis
   vom Erlöschen (lit. c).

Nach **EuGH C-97/22** führt eine fehlerhafte Widerrufsbelehrung zum
vollständigen Vergütungsverlust: Die Leistung ist erbracht, das Geld muss
zurück, Wertersatz gibt es nicht. Anders als beim RDG, wo eine Abmahnung droht,
steht hier jeder einzelne Umsatz auf dem Spiel — rückwirkend für alle Verkäufe
seit dem 19.6.2026.

Vorlage ist das Schwesterprojekt `widerspruch-krankengeld.de`, das auf der neuen
Rechtslage gebaut ist. Es wird portiert, nicht kopiert: andere E-Mail-Infra-
struktur, sieben Sprachen, englische Codekommentare.

## Was dieses Design nicht umfasst

- **Preisaufspaltung nach EuGH C-641/19.** Das Schwesterprojekt trennt
  Erstellung und Versand vertraglich (`spaltePreis`, `PORTO_CENT`). Hier ist das
  nicht Teil des Befunds und wird nicht mitgezogen. Als offene Frage im
  Prüfungsdokument vermerkt.
- **Übersetzung der Rechtstexte.** `/widerruf` bleibt deutsch, wie alle
  Rechtstexte unter `src/app/[locale]/[rechtstext]`. Nur die deutsche Fassung
  ist verbindlich; `LegalPage` druckt diesen Hinweis bereits.
- **Eine prominentere Platzierung als der bestehende Footer-Link.** Der Footer
  verlinkt `/widerruf` von jeder Seite aus; die Schaltfläche steht dort oben.
  Ein zweiter Footer-Eintrag „Vertrag widerrufen" wurde erwogen und verworfen.

---

## 1. Die zwei Erklärungen im Checkout

### Texte

`dispatch.consent` wird durch zwei Keys ersetzt. Zwei getrennte, nicht
vorbelegte Kästchen über dem Bestellbutton — beide zusammen in einem Häkchen
erfüllen die Norm nicht, und eine vorangekreuzte Erklärung ist keine Erklärung.

**`dispatch.consentStart`** — § 356 Abs. 5 Nr. 2 lit. a BGB:

> Ich verlange ausdrücklich, dass Sie mit dem Druck und dem Versand meiner
> Mängelanzeige vor Ablauf der Widerrufsfrist beginnen.

**`dispatch.consentExpiry`** — § 356 Abs. 5 Nr. 2 lit. c BGB:

> Mir ist bekannt, dass mein Widerrufsrecht erlischt, sobald Sie die Leistung
> vollständig erbracht haben — sobald der Brief also gedruckt und in die
> Zustellung gegeben ist. Diese Kenntnis bestätige ich hiermit.

Beide Texte leben als exportierte Konstanten in `src/lib/widerrufstext.ts`
(`erklaerungSofortigerBeginn`, `erklaerungErloeschen`) und sind die deutsche
Fassung in `translations.ts`. Zwei Quellen für denselben Satz driften; die
Konstanten sind das, worauf die Tests und die Bestellbestätigung zugreifen.

`dispatch.consentLink` bleibt unverändert.

### Sieben Sprachen

Beide Keys brauchen einen Eintrag in de, en, tr, uk, ru, ar, pl — `npm run
check:i18n` bricht sonst ab. Der bestehende Fehlertext
`dispatch.error.zustimmung_fehlt` spricht von „dem sofortigen Versandbeginn" und
wird auf beide Erklärungen umformuliert, in allen sieben Sprachen.

Die Übersetzungen entstehen nach bestem Wissen und gehören vor dem Merge
gegengelesen: Es sind rechtlich wirkende Erklärungen, keine UI-Beschriftungen.

### Datenfluss

`src/components/VersandKarte.tsx`:

```
const [zustimmung, setZustimmung] = useState(false)
```

wird zu zwei Zuständen, `verlangtSofortigenBeginn` und `kenntErloeschen`. Der
Bestellbutton bleibt gesperrt, solange nicht beide gesetzt sind. Die Kästchen
tragen `data-testid="dispatch-consent-start"` und
`data-testid="dispatch-consent-expiry"`; das bisherige `dispatch-consent`
verschwindet, und mit ihm die drei e2e-Stellen, die es anklicken
(`e2e/versand.spec.ts:68`, `:140`, `e2e/wizard.spec.ts:411`).

`bezahlen()` trägt beide Flags statt des einen. Der Request-Body wird von
`{ zustimmung: boolean }` zu:

```ts
{ verlangtSofortigenBeginn: boolean, kenntErloeschen: boolean }
```

`src/app/api/versand/checkout/route.ts` prüft beide einzeln mit `!== true` und
antwortet mit demselben Slug `zustimmung_fehlt`. Ein zweiter Slug wäre
präziser, aber die UI lässt den Fall nicht entstehen — sieben Übersetzungen für
eine Meldung, die nur ein manipulierter Client sieht, sind es nicht wert.

### Stripe-Metadaten

Es gibt keine Datenbank; Stripe ist die Bestellakte. Eine Zustimmung, die nur in
einer React-Checkbox lebte, kann im Streitfall niemand vorlegen. Bisher:

```ts
widerrufZustimmung: "356-4-BGB"
```

Künftig zwei Einträge, weil es zwei Erklärungen sind und beide einzeln
nachweisbar sein müssen:

```ts
widerrufVerlangen: "356-5-2-a-BGB",
widerrufErloeschen: "356-5-2-c-BGB",
```

Weiterhin Konstanten und keine Zeitstempel: Stripe weist einen wiederverwendeten
Idempotency-Key mit abweichenden Parametern zurück, ein Zeitstempel pro Request
würde also jeden legitimen Retry in einen `checkout_fehler` verwandeln. Die
Erstellungszeit der Session beantwortet das „wann" nah genug.

---

## 2. Belehrung und Fundstellen

### Neuer Absatz in `widerrufsbelehrung`

Eingefügt hinter dem Absatz zur „eindeutigen Erklärung", vor dem Absatz zur
Fristwahrung:

> Sie können Ihr Widerrufsrecht auch online ausüben: über die Schaltfläche
> „Vertrag widerrufen" unter mietminderung-online.de/widerruf. Wir bestätigen
> Ihnen den Eingang unverzüglich per E-Mail; die Bestätigung enthält den Inhalt
> Ihrer Widerrufserklärung sowie Datum und Uhrzeit ihres Eingangs.

Die Adresse steht als Literal im Text und kommt **nicht** aus
`absoluteUrl("/widerruf")`: `site.url` folgt `NEXT_PUBLIC_SITE_URL`, und eine
Belehrung, die in der Bestellbestätigung eine Preview-Domain nennt, führt den
Verbraucher an eine Adresse, die es nicht mehr gibt. `send.ts` hardcodet die
Absenderadresse aus demselben Grund.

### `erloeschenHinweis`

> Sie haben vor der Bestellung ausdrücklich verlangt, dass wir mit dem Druck und
> dem Versand vor Ablauf der Widerrufsfrist beginnen, und davon getrennt
> bestätigt, dass Ihnen bekannt ist, dass Ihr Widerrufsrecht mit der
> vollständigen Erbringung erlischt. Bis zu diesem Zeitpunkt können Sie
> widerrufen, danach erlischt es nach § 356 Absatz 5 Nummer 2 BGB.

### Der Wertersatz-Absatz bleibt

Absatz 5 der Belehrung (anteilige Vergütung bei Widerruf während der Ausführung)
ist der amtliche Mustertext und widerspricht dem Erlöschen nicht — er greift für
die Zeitspanne davor. Das Schwesterprojekt hat ihn weggelassen. Die Abweichung
wird nicht stillschweigend angeglichen, sondern als ausdrückliche Frage im
Prüfungsdokument gestellt.

### Alle Fundstellen von § 356 Abs. 4

| Datei | Was |
| --- | --- |
| `src/lib/widerrufstext.ts:39,45` | Kommentar und `erloeschenHinweis` |
| `src/app/api/versand/checkout/route.ts:268` | Kommentar an der Prüfung |
| `src/app/api/versand/checkout/route.ts:371,387` | Kommentar und Metadatenwert |
| `src/app/maengelanzeige-versenden/page.tsx:82` | Fließtext, nennt zusätzlich künftig beide Erklärungen |
| `src/app/widerruf/page.tsx:67` | Fließtext |
| `src/lib/email/templates.ts:141` | Kommentar am Bestellbestätigungs-Template |
| `src/i18n/translations.ts:327` | Kommentar |

`site.legalVersion` steigt von „Juli 2026" auf „August 2026" — die Rechtstexte
ändern sich, und das Datum steht auf jeder Rechtstextseite.

---

## 3. Der Widerrufsbutton nach § 356a BGB

### Komponente

`src/app/widerruf/WiderrufButton.tsx`, Client-Komponente, eingebunden in
`src/app/widerruf/page.tsx` oberhalb von „Wofür diese Belehrung gilt". Die Seite
bleibt eine Server-Komponente; `LegalPage` nimmt sie als Children entgegen.

Drei Zustände:

1. **Geschlossen** — Schaltfläche „Vertrag widerrufen" plus ein Satz darunter,
   dass das Widerrufsrecht erloschen ist, wenn der Brief bereits zur Post
   gegeben wurde.
2. **Formular** — die Angaben nach Abs. 2, abgeschlossen mit „Widerruf
   bestätigen".
3. **Gesendet** — Bestätigung im UI, mit dem Hinweis, dass die Frist mit dem
   Absenden gewahrt ist und eine Bestätigung per E-Mail folgt.

Beide Beschriftungen sind gesetzlich vorgegeben und werden nicht umformuliert.
Ein Kommentar im Code sagt das, damit es niemand aus stilistischen Gründen
„verbessert".

### Felder

| Feld | Pflicht | Warum |
| --- | --- | --- |
| E-Mail-Adresse | ja | Der Kontaktweg nach Abs. 2 und die Adresse, an die die Bestätigung geht |
| Name | nein | Abs. 2 nennt ihn, aber ein Widerruf darf nicht daran scheitern |
| Auftragsnummer | nein | Zuordnung; steht in der Bestellbestätigung |
| Anmerkung | nein | freiwillig |

Die Vertragsbezeichnung nach Abs. 2 wird nicht abgefragt, sondern gesetzt: Es
gibt genau eine kostenpflichtige Leistung, „Postversand der Mängelanzeige". Sie
steht sichtbar im Formular und wörtlich in der Bestätigung.

Der Button ist deutsch, wie die übrige Seite. Er wird über
`src/components/ui/Button.tsx` gebaut, nicht handgestrickt; die Kästchen und
Felder verwenden die Design-Tokens (`brand-*`, `ink-*`, `paper*`). Rohe
Tailwind-Paletten sind per `no-restricted-syntax` in `eslint.config.mjs`
verboten — die Klassen aus der Vorlage (`border-accent`, `bg-accent-wash`)
existieren hier nicht und werden übersetzt, nicht übernommen.

---

## 4. Route und Bestätigung

### `POST /api/widerruf`

`src/app/api/widerruf/route.ts`, `runtime = "nodejs"`.

Bewusst anspruchslos in der Prüfung: Ein Widerruf ist eine einseitige
empfangsbedürftige Erklärung. Ihn an einer fehlenden Auftragsnummer scheitern zu
lassen wäre rechtlich falsch und praktisch schäbig — maßgeblich ist, dass die
Erklärung uns erreicht.

Ablauf:

1. Rate-Limit `widerruf:<ip>`, 10 pro Stunde, über das bestehende
   `src/lib/rateLimit.ts`. Eigener Namensraum, sonst teilt sich der Widerruf
   einen Eimer mit dem Status-Polling.
2. Body parsen; nur die E-Mail ist Pflicht und muss ein `@` enthalten. Alle
   Freitextfelder werden getrimmt und auf 500 Zeichen gekappt.
3. Eingangszeitpunkt über `formatiereZeitpunkt(new Date())`.
4. **Meldung an den Betreiber zuerst.** Diese Mail ist der Eingangsnachweis.
   Scheitert sie, gibt es keinen Beleg, dass der Widerruf ankam — dann 502 und
   im UI der Hinweis, stattdessen eine E-Mail zu schreiben, die als Erklärung
   genauso wirksam ist.
5. **Bestätigung an den Erklärenden.** Scheitert sie, ist der Widerruf trotzdem
   wirksam eingegangen, also kein Fehler nach außen.

### Die Bestätigung ist der dauerhafte Datenträger

§ 356a Abs. 4 BGB schreibt vor, was darin stehen muss: den Inhalt der
Widerrufserklärung sowie Datum und Uhrzeit ihres Eingangs. **Der Inhalt wird
deshalb vollständig zurückgegeben und nicht nur bestätigt** — auf dieser Mail
muss der Verbraucher später belegen können, was er wann erklärt hat. „Ihr
Widerruf ist eingegangen" allein erfüllt die Norm nicht.

Umgesetzt als neues Template `widerrufBestaetigungEmail` in
`src/lib/email/templates.ts`, mit HTML- und Textteil wie alle Mails hier: eine
Bestätigung, die in einem strengen Client als leeres Rechteck erscheint, ist
nicht zur Verfügung gestellt worden. Versand über `sendEmail`.

Inhalt: Eingangszeitpunkt, die Widerrufserklärung im Wortlaut, die
Vertragsbezeichnung, die vom Nutzer gemachten Angaben, und ein Absatz dazu, was
nun passiert — Erstattung, wenn der Brief noch nicht zur Post gegeben war;
andernfalls die Auskunft, dass das Widerrufsrecht nach § 356 Abs. 5 Nr. 2 BGB
erloschen ist und wir uns trotzdem melden.

### Der Zeitstempel

Neues Modul `src/lib/datum.ts` mit einer Funktion:

```ts
const ZEITZONE = "Europe/Berlin";

export function formatiereZeitpunkt(datum: Date): string
```

`toLocaleString("de-DE")` ohne `timeZone` nimmt die Zeitzone des Servers, und
die ist auf Vercel UTC — im Sommer zwei Stunden daneben. An einer Fristgrenze
ist das keine Kleinigkeit. Die Ausgabe nennt die Zeitzone mit
(`timeZoneName: "short"`), weil eine Uhrzeit ohne Zeitzone nur die halbe Angabe
ist.

`src/lib/datum.test.ts` prüft an **festen UTC-Zeitpunkten**, damit die Tests auch
auf einem Rechner in Köln durchfallen, wenn jemand die Zeitzone entfernt:

- `2026-08-04T12:00:00Z` → `04.08.2026`, `14:00` (MESZ)
- `2026-01-15T12:00:00Z` → `15.01.2026`, `13:00` (MEZ)
- Ausgabe enthält eine Zeitzonenangabe

---

## 5. Datenschutzerklärung

Neuer Abschnitt in `src/app/datenschutz/page.tsx`: die Schaltfläche nach
§ 356a BGB, die dort verarbeiteten Daten (Name, Auftragsnummer, E-Mail-Adresse,
Eingangszeitpunkt, freiwillige Anmerkung), Zweck (Entgegennahme und Bestätigung
der Widerrufserklärung), Rechtsgrundlage **Art. 6 Abs. 1 lit. c DSGVO** —
die Verarbeitung erfüllt eine rechtliche Verpflichtung —, Empfänger (Resend als
Auftragsverarbeiter) und Speicherdauer.

`docs/datenschutz/verarbeitungsverzeichnis.md` bekommt den passenden Eintrag;
dort steht bereits ein Verweis auf „Nachweis der Erklärung nach § 356 Abs. 4
BGB", der mitzuziehen ist.

---

## 6. Tests

| Datei | Prüft |
| --- | --- |
| `src/lib/widerrufstext.test.ts` | neu — die Anforderungen als ausführbare Prüfung, portiert aus `widerruf.test.ts` des Schwesterprojekts |
| `src/lib/datum.test.ts` | neu — deutsche Ortszeit an festen UTC-Zeitpunkten |
| `e2e/widerruf.spec.ts` | neu — Schaltfläche vorhanden, Formular öffnet, „Widerruf bestätigen" sendet |
| `e2e/versand.spec.ts`, `e2e/wizard.spec.ts` | angepasst — zwei Kästchen statt einem, Bestellbutton bleibt gesperrt, solange nur eines gesetzt ist |
| `src/lib/email/templates.test.ts` | ergänzt — die Bestätigung enthält Wortlaut, Datum und Uhrzeit |

`widerrufstext.test.ts` hält im Kern fest:

- Die Texte nennen § 356 Abs. 5 Nr. 2 BGB und **nirgends** § 356 Abs. 4.
- Die beiden Erklärungen sind nicht identisch, lit. a verlangt ausdrücklich,
  lit. c bestätigt Kenntnis vom Erlöschen.
- Die Belehrung nennt Frist, Beginn, Adressat, die Schaltfläche „Vertrag
  widerrufen", die Adresse `/widerruf` und die Zusage „Datum und Uhrzeit".
- Sie beruft sich nicht auf die Kundenspezifikations-Ausnahme
  (§ 312g Abs. 2 Nr. 1 BGB) — die gilt nur für Waren, nicht für
  Dienstleistungen, und sie hier zu nennen wäre selbst eine falsche Belehrung.

Vor dem PR läuft `npm run verify` (lint, check:i18n, check:mail, unit, build,
e2e) vollständig durch.

---

## 7. `docs/ANWALTLICHE_PRUEFUNG.md`

Fokussiert auf das Widerrufsrecht, nicht das ganze Produkt. Aufbau:

1. Was der Dienst tut und was kostenpflichtig ist
2. Die beiden Erklärungen — Wortlaut im Anhang, Frage: tragen sie lit. a und c?
3. Die Belehrung — Frage: trägt sie, und **trägt der Wertersatz-Absatz**, den
   das Schwesterprojekt weglässt?
4. Der Widerrufsbutton — Platzierung, Formular, Bestätigung nach Abs. 4
5. Offene Fragen: Preisaufspaltung nach EuGH C-641/19, die hier nicht
   umgesetzt ist; Rückwirkung für Verkäufe seit dem 19.6.2026
6. Anhang mit allen Texten im Wortlaut und den Dateipfaden

Gefragt ist eine Ja/Nein-Bewertung mit Begründung, kein Gutachten. Wo etwas
nicht trägt, hilft ein Vorschlag für die tragfähige Fassung mehr als eine
Warnung.

---

## Vorbehalte

- **Der Gesetzesstand ist nicht verifiziert.** Der Wissensstand des Modells
  endet vor dem 19.6.2026. Diese Umsetzung folgt der Angabe im Auftrag und dem
  Schwesterprojekt. Die anwaltliche Prüfung ersetzt sie nicht — sie ist der
  Grund, warum das Prüfungsdokument Teil dieser Änderung ist.
- **Sechs Übersetzungen rechtlich wirkender Erklärungen** entstehen ohne
  muttersprachliche Prüfung und gehören vor dem Merge gegengelesen.
- **Die Änderung wirkt nicht rückwirkend.** Verkäufe zwischen dem 19.6.2026 und
  dem Deployment bleiben mit der alten Belehrung dokumentiert. Wie damit
  umzugehen ist, ist eine Frage an die anwaltliche Prüfung, keine an den Code.

## Reihenfolge

1. `src/lib/datum.ts` + Test — alles Weitere hängt am Zeitstempel
2. `src/lib/widerrufstext.ts`: Konstanten, neuer Belehrungsabsatz,
   `erloeschenHinweis` + `widerrufstext.test.ts`
3. Checkout: `VersandKarte.tsx`, `checkout/route.ts`, `translations.ts` × 7,
   e2e angepasst
4. Button: `WiderrufButton.tsx`, `widerruf/page.tsx`, `api/widerruf/route.ts`,
   Template + Tests, `e2e/widerruf.spec.ts`
5. Restliche Fundstellen, `legalVersion`, Datenschutz, Verarbeitungsverzeichnis
6. `docs/ANWALTLICHE_PRUEFUNG.md`
7. `npm run verify`, PR gegen `main`
