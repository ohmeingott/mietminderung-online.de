# Postversand der Mängelanzeige über die eBrief-API

**Datum:** 2026-07-30
**Status:** abgestimmt, bereit für die Planung

## Ziel

Nutzer sollen ihre fertige Mängelanzeige am Ende des bestehenden Flows direkt
als physischen Brief oder als Einschreiben an den Vermieter schicken können,
statt das PDF herunterzuladen, auszudrucken und selbst zur Post zu bringen. Der
Versand ist kostenpflichtig und wird per Stripe bezahlt.

Der kostenlose Download bleibt unverändert bestehen. Der Postversand ist eine
zusätzliche Option in Schritt 4, kein Ersatz.

## Anbieter

[eBrief](https://www.ebrief.de) (Druck und Zustellung über die PIN AG).

- LIVE: `https://api.ebrief.de`
- STAGING: `https://api.staging.ebrief.de`

Ein Konto samt Staging-Zugang liegt vor.

### Authentifizierung

`GET /oauth2/token/generateBearerToken` mit `Authorization: Basic <base64(user:pass)>`
liefert das Token im Feld `GenerateBearerTokenResult`. Es ist **7 Tage** gültig.
Alle weiteren Aufrufe tragen `Authorization: Bearer <token>`.

Achtung: Die Doku beschreibt den Endpunkt an einer Stelle als POST, das
Codebeispiel verwendet aber `method: "GET"`. Der Spike klärt das praktisch;
der Client implementiert GET mit Fallback auf POST bei 405.

### Relevante Endpunkte

| Endpunkt | Zweck |
|---|---|
| `POST /jobs` | Leeren Job anlegen (Status `UNPROCESSED`) |
| `POST /jobs/{jobId}/singleFiles` | Dokument in den Job laden (`Document.FileName`, `Document.FileContent` als Base64) |
| `PUT /jobs/{jobId}` | Commit, Body `{ "IsRollback": false }` — eBrief liest jetzt die Adresse aus und erzeugt Dokumente |
| `GET /jobs/{jobId}` | Status und erzeugte Dokumente abfragen |
| `POST /prices` | Preis berechnen |
| `POST /docs/confirmation` | Dokument mit Warnung bestätigen, Body `{ "Ids": [docId] }` |
| `POST /jobs/distribution` | Druck und Versand auslösen, Body `{ "Ids": [jobId] }` |
| `DELETE /jobs/{jobId}` | Job verwerfen |
| `POST /Jobs/searchJobDetails` | Jobs nach Filtern suchen (für Cleanup) |

### Drei Eigenheiten der API, die das Design prägen

**`POST /jobs/singleFiles` (ohne `jobId`) druckt sofort.** Die Doku dazu:
„it doesn't require to be confirmed and distributed in order to be proceeded
for printing. When Job is created with this endpoint then it is going to be
scheduled for printing right away. Expected job status after creating is
`BILLING_COMPLETED` or `DISTRIBUTION_COMPLETED`". Dieser Endpunkt darf für
unseren Ablauf **nicht** verwendet werden — der Brief wäre vor der Zahlung
gedruckt. Wir nutzen ausschließlich die vierstufige Variante aus der Tabelle
oben.

**Die Empfängeradresse wird aus dem PDF gelesen**, nicht als JSON übergeben.
Das Anschriftenfeld muss deshalb exakt an der von eBrief vorgegebenen Position
stehen (siehe Abstandsvorlage weiter unten). Der aktuelle Brief in
`src/lib/generatePdf.ts` erfüllt das nicht — er setzt reinen Fließtext ab 30 mm
oberem Rand.

**Ein committeter Job wird nicht automatisch versendet.** Erst
`POST /jobs/distribution` löst Druck und Zustellung aus, und die Abrechnung
folgt erst danach (`BILLING_COMPLETED` kommt nach `DISTRIBUTION_COMPLETED`).
Zu `USER_DELETED` heißt es ausdrücklich: „It will not be printed, distributed,
or invoiced." Ein Job, der zwischen Commit und Distribution gelöscht wird,
kostet also nichts. Das ist die Grundlage für den Zahlungsablauf.

**Ungeklärt bleibt** nur, ob es ein Limit für die Anzahl offener, nicht
distribuierter Jobs pro Konto gibt. Die Doku sagt dazu nichts. Das Risiko ist
gering und wird durch den Cleanup-Cron und das Rate Limit abgefedert.

## Einschreiben

Verfügbar, und zwar über das Job-Attribut `IsTracking: "true"`.

Der Nachweis ergibt sich aus drei Quellen: Die deutsche Preisseite führt
„Einschreiben" mit **+2,75 € netto / +3,27 € brutto** (national). Die englische
Preisseite listet beim identischen Preis „eTracked Letter". Die offizielle
Abstandsvorlage hat eine eigene Seite mit der Überschrift „Specifications for
eTracked letter". Es handelt sich um dasselbe Produkt.

**Einschränkung, die ins UI gehört:** Die deutsche Seite formuliert „Als
**Einwurf**-Einschreiben versenden (Aufpreis)". Es ist also kein
Übergabe-Einschreiben mit Unterschrift des Empfängers. Für die Mängelanzeige
ist das Einwurf-Einschreiben die übliche Variante, beweisrechtlich aber
schwächer. Das UI benennt das Produkt korrekt als „Einwurf-Einschreiben" und
weist auf den Unterschied hin, statt pauschal „Einschreiben" zu versprechen.

## Ablauf

```
Browser (Maengelanzeige, Schritt 4)
   │  Brieftext + Unterschrift + Adressdaten + Produktwahl (kein PDF)
   ▼
POST /api/versand/vorbereiten
   ├─ generatePdf() serverseitig, Layout nach eBrief-Abstandsvorlage
   ├─ eBrief POST /jobs                          → jobId
   ├─ eBrief POST /jobs/{jobId}/singleFiles      → PDF als Base64
   ├─ eBrief PUT  /jobs/{jobId}  {IsRollback:false}  → Commit, Adressprüfung läuft
   └─ eBrief POST /prices                        → Einkaufspreis (Plausibilitätscheck)
   ◄── { jobId, produkt, preisCent, seiten }
   │
GET /api/versand/status?jobId=…   (Polling)
   └─► "bereit" | "adresse_warnung" | "fehler"
   │
POST /api/versand/checkout
   └─► Stripe Checkout Session, metadata.jobId
   │
   ▼ Redirect zu Stripe, Zahlung
   │
POST /api/stripe/webhook  (checkout.session.completed)
   ├─ Signatur prüfen
   ├─ GET /jobs/{jobId} → schon distribuiert? dann überspringen (Idempotenz)
   └─ POST /jobs/distribution  {Ids: [jobId]}
```

Das PDF wird **serverseitig** erzeugt. Der Client schickt nur Text, Unterschrift
und Adressdaten. Damit sitzt das Anschriftenfeld garantiert an der richtigen
Stelle, und es lässt sich uns kein beliebiges Fremd-PDF zum Drucken
unterschieben.

Der Verkaufspreis kommt aus unserem Produktkatalog, nicht aus `/prices`.
`/prices` dient der Kontrolle: Weicht der Einkaufspreis stark vom erwarteten ab
(etwa weil der Brief mehr Seiten hat als gedacht), brechen wir ab, statt mit
Verlust zu versenden.

### Job-Status-Webhook als spätere Verbesserung

eBrief bietet einen Webhook für Job-Statusänderungen an; die URL muss beim
Support hinterlegt werden. Das wäre der sauberere Weg statt Polling in
`/api/versand/status`. Wir starten mit Polling, weil es keine Absprache
erfordert, und stellen später um.

## Warum Zahlung zwischen Commit und Distribution

Die Alternative wäre, das fertige PDF bis zum Zahlungseingang bei uns
zwischenzulagern (etwa in Vercel Blob) und den Job erst im Webhook anzulegen.
Dagegen sprechen zwei Dinge:

1. Wir würden ein Dokument mit Name, Anschrift und Unterschrift des Nutzers in
   unserer eigenen Infrastruktur ablegen. Das ist vermeidbarer
   Datenschutz-Aufwand.
2. Der Nutzer erführe erst **nach** der Zahlung, ob eBrief die
   Vermieteradresse akzeptiert.

Beim gewählten Ablauf hält eBrief das Dokument, die Adressprüfung passiert vor
der Zahlung, und der Fehlerfall „bezahlt, aber nicht versendet" schrumpft auf
einen einzigen idempotenten API-Aufruf zusammen, den Stripe bei Bedarf bis zu
drei Tage lang wiederholt.

## Persistenz

Keine eigene Datenbank.

- **Stripe** ist das Auftragsregister (Session, Betrag, Zeitpunkt, E-Mail).
- **eBrief** hält das Dokument und den Sendungsstatus.
- Die Versandbestätigung erhält der Nutzer über das Job-Attribut
  `NotificationMail`, das wir mit seiner E-Mail-Adresse belegen. Die Rechnung
  kommt von Stripe.

Wir speichern nichts.

## Module

| Datei | Aufgabe |
|---|---|
| `src/lib/ebrief/token.ts` | Bearer-Token beschaffen und im Modul-Scope cachen; proaktive Erneuerung nach 6 Tagen, zusätzlich einmaliger Retry bei HTTP 401 |
| `src/lib/ebrief/client.ts` | Typisierter Client: `createJob`, `addFile`, `commitJob`, `getJob`, `getPrice`, `confirmDocs`, `distribute`, `deleteJob`, `searchJobs` |
| `src/lib/ebrief/produkte.ts` | Produktkatalog mit eBrief-Attributen und Verkaufspreisen |
| `src/lib/briefPdf.ts` | Versand-Layout nach eBrief-Abstandsvorlage (siehe unten) |
| `src/lib/generatePdf.ts` | unverändert für den kostenlosen Download |
| `src/app/api/versand/vorbereiten/route.ts` | PDF bauen, Job anlegen, Datei hochladen, committen, Preis prüfen |
| `src/app/api/versand/status/route.ts` | eBrief-Job-Status auf drei UI-Zustände abbilden |
| `src/app/api/versand/checkout/route.ts` | Stripe Checkout Session erzeugen |
| `src/app/api/stripe/webhook/route.ts` | Signatur prüfen, Distribution auslösen |
| `src/app/api/cron/ebrief-cleanup/route.ts` | unbezahlte Jobs älter als 24 h löschen |
| `src/components/Maengelanzeige.tsx` | Versand-Karte in Schritt 4 |

Das Versand-Layout kommt in eine **eigene Datei** statt als Option in
`generatePdf.ts`. Die beiden Layouts haben unterschiedliche Anforderungen
(freie Zonen, eingebettete Schrift, kein Adresskopf im Fließtext), und der
kostenlose Download soll von Änderungen am Versandlayout nicht betroffen sein.

### Produktkatalog

```ts
export const PRODUKTE = {
  brief: {
    id: "brief",
    preisCent: 249,          // Einkauf laut Preisliste: 0,88 € brutto
    ebrief: { IsDuplex: "false", IsColor: "false", IsTracking: "false" },
  },
  einwurfEinschreiben: {
    id: "einwurfEinschreiben",
    preisCent: 699,          // Einkauf laut Preisliste: 0,88 € + 3,27 € = 4,15 € brutto
    ebrief: { IsDuplex: "false", IsColor: "false", IsTracking: "true" },
  },
} as const;
```

Die Verkaufspreise sind Startwerte und noch nicht betriebswirtschaftlich
festgelegt; sie werden hier zentral gepflegt, nicht im UI verstreut. Die
Einkaufspreise stammen von der eBrief-Preisseite (Standardbrief bis 3 Blatt,
s/w, einseitig, national) und dienen als Kalkulationsgrundlage.

**Die eBrief-`Attributes` sind Strings.** Die Doku warnt ausdrücklich: „'string'
type fields with value 'false' are not boolean and should be used as a string
'false'!". In `POST /prices` sind dieselben Felder dagegen echte Booleans. Der
Client kapselt diese Inkonsistenz, damit sie sich nicht durch den Code zieht.

### Layout nach eBrief-Abstandsvorlage

Die offizielle Vorlage liegt unter
`docs/ebrief/PIN_eBrief_Abstandsvorlage_A4_2026_EN.pdf` im Repo. Maße für A4
(210 × 297 mm):

| Element | Maß |
|---|---|
| Linker Textrand | 25 mm |
| Textbeginn | 111 mm von oben |
| Anschriftenfeld | 85 mm breit × 27 mm hoch |
| Absenderzeile über der Anschrift | 6 pt, einzeilig |
| Sicherheitsabstand zum Seitenrand | 3 mm |
| Adressschrift | serifenlos (Arial, Frutiger, Helvetica, Univers), 10–12 pt, regular |
| Zeilenabstand in der Adresse | 0,5–2,5 mm |
| Zeichenabstand in der Adresse | 0,2–0,4 mm |
| Auflösung eingebetteter Grafiken | mind. 150 dpi, max. 300 dpi |

Weitere Vorgaben aus der Vorlage:

- **Schriften müssen vollständig eingebettet sein.** jsPDF nutzt standardmäßig
  die PDF-Standardschrift Helvetica, die *nicht* eingebettet wird. Für das
  Versand-PDF muss deshalb eine TTF per `addFont` registriert werden. Das ist
  der unauffälligste Fallstrick der ganzen Integration.
- Keine großen Grafikelemente näher als 3 cm an Adresse, oberem, unterem oder
  seitlichem Rand. Betrifft die Unterschrift, die entsprechend platziert wird.
- Transparenzen und Formularfelder werden automatisch entfernt.
- Der linke Bereich neben dem Anschriftenfeld trägt einen von eBrief gedruckten
  DataMatrix-Code zur Seitensortierung und bleibt frei.

**Beim Einwurf-Einschreiben** (`IsTracking: "true"`) kommt laut Seite 2 der
Vorlage eine zusätzliche PIN-AG-Codierzone unmittelbar über dem
Anschriftenfeld hinzu, die als „No text zone" ausgewiesen ist. Dort darf auch
die Absenderzeile nicht stehen. Das Layout berücksichtigt das produktabhängig.

Der Brieftext enthält im Versand-Layout keinen eigenen Adresskopf mehr, damit
die Anschrift nicht doppelt erscheint.

## Fehlerbehandlung

| Fall | Verhalten |
|---|---|
| eBrief bei „vorbereiten" nicht erreichbar | Fehlermeldung in der Versand-Karte, kostenloser Download bleibt sichtbar, kein Stripe-Aufruf |
| Adressprüfung meldet Warnung (`USER_CONFIRMATION_REQUESTED`) | UI zeigt die Warnung, Nutzer korrigiert (alter Job wird per `DELETE` verworfen, neuer angelegt) oder bestätigt bewusst via `POST /docs/confirmation` |
| Einkaufspreis weicht stark vom kalkulierten ab | Abbruch mit Hinweis, Job wird gelöscht, kein Stripe-Aufruf |
| Nutzer bricht die Zahlung ab | Job bleibt committet, aber undistribuiert liegen; Cron räumt nach 24 h auf |
| Webhook schlägt fehl | Stripe wiederholt bis zu 3 Tage. `console.error` mit `jobId` und Stripe-Session-ID landet in den Vercel Runtime Logs; fehlgeschlagene Zustellungen sind zusätzlich im Stripe-Dashboard sichtbar. (Im Projekt ist kein Sentry eingebunden.) |
| Webhook läuft doppelt | `GET /jobs/{jobId}`: ist der Status bereits `DISTRIBUTION_*` oder weiter, wird übersprungen und 200 zurückgegeben |

### `SilentConfirm` bleibt `false`

Mit `SilentConfirm: "true"` würde eBrief Adresswarnungen stillschweigend
bestätigen und der Brief ginge an eine Adresse, die die Prüfung beanstandet hat.
Wir zeigen die Warnung stattdessen im UI und lassen den Nutzer entscheiden.
`AdressCheck` bleibt beim Default `true`.

### Missbrauchsschutz

`/api/versand/vorbereiten` legt bei jedem Aufruf einen Job bei eBrief an. Die
Route bekommt deshalb ein Rate Limit pro IP (10 Aufrufe pro Stunde). Da vor der
Distribution nichts gedruckt und nichts berechnet wird, ist der Schaden bei
Missbrauch auf API-Rauschen begrenzt, das der Cleanup-Cron abräumt.

## Environment-Variablen

| Variable | Zweck |
|---|---|
| `EBRIEF_BASE_URL` | `https://api.staging.ebrief.de` bzw. `https://api.ebrief.de` |
| `EBRIEF_USER` | Basic-Auth-Benutzer |
| `EBRIEF_PASSWORD` | Basic-Auth-Passwort |
| `STRIPE_SECRET_KEY` | Stripe API-Key |
| `STRIPE_WEBHOOK_SECRET` | Signaturprüfung des Webhooks |
| `CRON_SECRET` | schützt die Cleanup-Route |

`.env.example` wird entsprechend ergänzt. Der dortige Hinweis „The site is
download-only and completely free — there is no paid service and therefore no
payment or postal-dispatch configuration." wird ersetzt.

## Tests

**Staging-Spike** (`scripts/ebrief-spike.ts`, manuell auszuführen): läuft den
Lebenszyklus einmal gegen `api.staging.ebrief.de` durch — Token holen (GET vs.
POST klären), leeren Job anlegen, Datei hochladen, committen, Status pollen,
Preis abfragen, Job löschen. Prüft praktisch nach, dass ein committeter Job ohne
Distribution kostenfrei bleibt, und dient danach als Referenz für die echten
Feldnamen und Statusübergänge. Der Spike distribuiert bewusst nichts.

**Layout-Prüfung**: Das erzeugte Versand-PDF wird einmal gegen die
Abstandsvorlage gelegt (beide A4, Vorlage als Hintergrundebene), um
Anschriftenfeld und freie Zonen visuell zu verifizieren. Danach genügt der
`GET /docs/{docId}/fileWithMark`-Endpunkt, der die von eBrief erkannte
Adresszone markiert zurückgibt.

**Playwright-E2E** mit gestubbten `/api/versand/*`-Routen: Happy Path bis zum
Stripe-Redirect, Adresswarnung, abgebrochene Zahlung, eBrief nicht erreichbar.
Die bestehende E2E-Suite unter `e2e/` wird erweitert, nicht ersetzt.

**Keine Unit-Tests**: Das Projekt hat aktuell keinen Unit-Test-Runner. Für
diese Integration führen wir keinen ein — die Logik in Client und Routen ist
dünn, und der Spike deckt die Vertragsannahmen gegenüber eBrief ab.

## Bewusst nicht im Umfang

- Eigene Datenbank und Sendungsverfolgung im Nutzerkonto
- Nutzerkonten überhaupt
- Übergabe-Einschreiben mit Empfängerunterschrift (bietet eBrief nicht an)
- Mehrere Empfänger pro Sendung, Anlagen, Farbdruck, C4-Umschläge
- Job-Status-Webhook von eBrief (später, erfordert Absprache mit dem Support)
