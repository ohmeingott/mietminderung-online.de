# Postversand der Mängelanzeige über die eBrief-API

**Datum:** 2026-07-30
**Status:** abgestimmt, bereit für die Planung

## Ziel

Nutzer sollen ihre fertige Mängelanzeige am Ende des bestehenden Flows direkt
als physischen Brief an den Vermieter schicken können, statt das PDF
herunterzuladen, auszudrucken und selbst zur Post zu bringen. Der Versand ist
kostenpflichtig und wird per Stripe bezahlt.

Der kostenlose Download bleibt unverändert bestehen. Der Postversand ist eine
zusätzliche Option in Schritt 4, kein Ersatz.

## Anbieter

[eBrief](https://www.ebrief.de) (Druck und Zustellung über die PIN AG).

- LIVE: `https://api.ebrief.de`
- STAGING: `https://api.staging.ebrief.de`

Ein Konto samt Staging-Zugang liegt vor.

### Authentifizierung

`POST /oauth2/token/generateBearerToken` mit Base64-kodierten Basic-Auth-Daten
liefert ein Bearer-Token, das **7 Tage** gültig ist. Alle weiteren Aufrufe
tragen `Authorization: Bearer <token>`.

### Relevante Endpunkte

| Endpunkt | Zweck |
|---|---|
| `POST /jobs/singleFiles` | Job mit einem Dokument anlegen (PDF als Base64 in `Document.FileContent`) |
| `PUT /jobs/{jobId}` | Job zur Verarbeitung freigeben (Commit) |
| `GET /jobs/{jobId}` | Status abfragen |
| `POST /prices` | Preis für eine Sendung berechnen |
| `POST /docs/confirmation` | Dokument mit Warnung bestätigen |
| `POST /jobs/distribution` | Druck und Versand auslösen |
| `DELETE /jobs/{jobId}` | Job verwerfen |
| `POST /Jobs/searchJobDetails` | Jobs nach Filtern suchen (für Cleanup) |

### Zwei Eigenheiten der API, die das Design prägen

**Die Empfängeradresse wird aus dem PDF gelesen**, nicht als JSON übergeben:
„The address of the document is read and compared with the address database."
Das Anschriftenfeld muss deshalb an der von DIN 5008 vorgesehenen Position
stehen und die Barcode-Zone frei bleiben. Der aktuelle Brief in
`src/lib/generatePdf.ts` erfüllt das nicht — er setzt reinen Fließtext ab 30 mm
oberem Rand.

**Ein committeter Job wird nicht automatisch versendet.** Erst
`POST /jobs/distribution` löst Druck und Zustellung aus. Das trennt
Vorbereitung und Versand sauber und ist die Grundlage für den unten
beschriebenen Zahlungsablauf.

## Offener Punkt: Einschreiben

Die öffentliche API-Dokumentation kennt kein Einschreiben. Es gibt lediglich
das Job-Attribut `IsTracking` (Sendungsverfolgung) — das ist beweisrechtlich
**kein** Einschreiben und darf im UI auch nicht so genannt werden.

Gerade bei der Mängelanzeige ist der Zugangsnachweis der eigentliche Grund,
warum ein Mieter überhaupt zum Einschreiben greift. Wir bauen den
Produktkatalog deshalb von Anfang an zweistufig, schalten das Einschreiben aber
erst frei, wenn eBrief bestätigt hat, dass es über die API buchbar ist und
unter welchem Attribut. Bis dahin ist die Option im UI sichtbar, aber
deaktiviert, mit dem Hinweis, dass ein Einschreiben derzeit nur persönlich bei
der Post aufgegeben werden kann.

Zu klären mit support@ebrief.de:

1. Sind Einschreiben, Einwurf-Einschreiben oder Rückschein über die API
   buchbar? Wenn ja, unter welchem Feld in `Attributes`?
2. Bleibt ein committeter Job, der nie distribuiert wird, kostenfrei?
3. Gibt es ein Limit für offene, nicht distribuierte Jobs?

Frage 2 ist die einzige Annahme im Design, die den Ablauf umwerfen würde. Sie
wird zusätzlich im Staging-Spike praktisch geprüft (siehe Tests).

## Ablauf

```
Browser (Maengelanzeige, Schritt 4)
   │  Brieftext + Unterschrift + Adressdaten (kein PDF)
   ▼
POST /api/versand/vorbereiten
   ├─ generatePdf() serverseitig, DIN 5008 mit Anschriftenfeld
   ├─ eBrief POST /jobs/singleFiles → PUT /jobs/{jobId}
   └─ eBrief POST /prices
   ◄── { jobId, preisBrutto, seiten }
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
   ├─ GET /jobs/{jobId} → bereits distribuiert? dann überspringen
   └─ POST /jobs/distribution
```

Das PDF wird **serverseitig** erzeugt. Der Client schickt nur Text, Unterschrift
und Adressdaten. Damit sitzt das Anschriftenfeld garantiert an der richtigen
Stelle, und es lässt sich uns kein beliebiges Fremd-PDF zum Drucken unterschieben.

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
| `src/lib/ebrief/client.ts` | Typisierter Client: `createJob`, `commitJob`, `getJob`, `getPrice`, `confirmDocs`, `distribute`, `deleteJob`, `searchJobs` |
| `src/lib/ebrief/produkte.ts` | Produktkatalog mit eBrief-Attributen und Verkaufspreisen |
| `src/lib/generatePdf.ts` | erweitert um optionalen `address`-Block (DIN 5008 Typ A) |
| `src/app/api/versand/vorbereiten/route.ts` | PDF bauen, Job anlegen und committen, Preis holen |
| `src/app/api/versand/status/route.ts` | eBrief-Job-Status auf drei UI-Zustände abbilden |
| `src/app/api/versand/checkout/route.ts` | Stripe Checkout Session erzeugen |
| `src/app/api/stripe/webhook/route.ts` | Signatur prüfen, Distribution auslösen |
| `src/app/api/cron/ebrief-cleanup/route.ts` | unbezahlte Jobs älter als 24 h löschen |
| `src/components/Maengelanzeige.tsx` | Versand-Karte in Schritt 4 |

### Produktkatalog

```ts
export const PRODUKTE = {
  brief: {
    id: "brief",
    enabled: true,
    preisCent: 249,
    ebrief: { IsDuplex: false, IsColor: false, IsTracking: false },
  },
  einschreiben: {
    id: "einschreiben",
    enabled: false,   // freischalten, sobald eBrief das Attribut bestätigt
    preisCent: 599,
    ebrief: { IsDuplex: false, IsColor: false, IsTracking: true },
  },
} as const;
```

Die Preise sind Startwerte und decken eBrief-Kosten plus Marge; sie werden hier
zentral gepflegt, nicht im UI verstreut. Das `IsTracking: true` beim
Einschreiben ist ein Platzhalter und wird durch das echte Attribut ersetzt,
sobald es bekannt ist — solange `enabled: false` gilt, kommt es nicht zum
Einsatz.

### DIN-5008-Layout

`generatePdf` bekommt ein optionales Feld:

```ts
interface LetterPdfOptions {
  text: string;
  signatureDataUrl?: string;
  address?: {
    absender: string;   // einzeilig, über dem Anschriftenfeld
    empfaenger: string[]; // Name, Straße, "PLZ Ort"
  };
}
```

Ist `address` gesetzt, rendert die Funktion nach **DIN 5008 Form B**: das
Anschriftenfeld beginnt 20 mm von links und 45 mm von oben, die oberen 45 mm
sowie der rechte Rand bleiben als Barcode- und Frankierzone frei, der Brieftext
startet bei 125 mm. Ohne `address` bleibt das Verhalten für den kostenlosen
Download exakt wie bisher.

Form B statt Form A, weil das größere obere Feld eBrief mehr Platz für
Barcode und Frankierung lässt. Die genauen Maße werden vor der Umsetzung gegen
das offizielle eBrief-Template abgeglichen — die Doku verweist ausdrücklich auf
eigene Templates und warnt, dass abweichende Positionierung die Verarbeitung
verzögert.

Der Brieftext enthält in diesem Fall keinen eigenen Adresskopf mehr, damit die
Anschrift nicht doppelt erscheint.

## Fehlerbehandlung

| Fall | Verhalten |
|---|---|
| eBrief bei „vorbereiten" nicht erreichbar | Fehlermeldung in der Versand-Karte, kostenloser Download bleibt sichtbar, kein Stripe-Aufruf |
| Adressprüfung meldet Warnung | UI zeigt die Warnung, Nutzer korrigiert (alter Job wird per `DELETE` verworfen, neuer angelegt) oder bestätigt bewusst via `POST /docs/confirmation` |
| Nutzer bricht die Zahlung ab | Job bleibt committet, aber undistribuiert liegen; Cron räumt nach 24 h auf |
| Webhook schlägt fehl | Stripe wiederholt bis zu 3 Tage. `console.error` mit `jobId` und Stripe-Session-ID landet in den Vercel Runtime Logs; fehlgeschlagene Zustellungen sind zusätzlich im Stripe-Dashboard sichtbar. (Im Projekt ist kein Sentry eingebunden.) |
| Webhook läuft doppelt | `GET /jobs/{jobId}`: ist der Status bereits `DISTRIBUTION_*` oder weiter, wird übersprungen und 200 zurückgegeben |

### `SilentConfirm` bleibt `false`

Mit `SilentConfirm: true` würde eBrief Adresswarnungen stillschweigend
bestätigen und der Brief ginge an eine Adresse, die die Prüfung beanstandet hat.
Wir zeigen die Warnung stattdessen im UI und lassen den Nutzer entscheiden.

### Missbrauchsschutz

`/api/versand/vorbereiten` legt bei jedem Aufruf einen Job bei eBrief an. Die
Route bekommt deshalb ein Rate Limit pro IP (10 Aufrufe pro Stunde). Da vor der
Distribution nichts gedruckt wird, ist der Schaden bei Missbrauch auf
API-Rauschen begrenzt, das der Cleanup-Cron abräumt.

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
kompletten Lebenszyklus einmal gegen `api.staging.ebrief.de` durch — Token,
Job anlegen, committen, Status pollen, Preis abfragen, Job löschen. Prüft
praktisch nach, ob ein committeter Job ohne Distribution kostenfrei liegen
bleibt, und dient danach als Referenz für die echten Feldnamen und
Statusübergänge.

**Playwright-E2E** mit gestubbten `/api/versand/*`-Routen: Happy Path bis zum
Stripe-Redirect, Adresswarnung, abgebrochene Zahlung, eBrief nicht erreichbar.
Die bestehende E2E-Suite unter `e2e/` wird erweitert, nicht ersetzt.

**Keine Unit-Tests**: Das Projekt hat aktuell keinen Unit-Test-Runner. Für
diese Integration führen wir keinen ein — die Logik in Client und Routen ist
dünn, und der Spike deckt die Vertragsannahmen gegenüber eBrief ab.

## Bewusst nicht im Umfang

- Eigene Datenbank und Sendungsverfolgung im Nutzerkonto
- Nutzerkonten überhaupt
- Mehrere Empfänger pro Sendung, Anlagen, Farbdruck, C4-Umschläge
- Einschreiben-Versand (vorbereitet, aber deaktiviert — siehe oben)
