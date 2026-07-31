# eBrief REST API — tatsächliche Schemata

Quelle: `https://api.staging.ebrief.de/swagger/v1/swagger.json` (OpenAPI 3.0.1),
abgerufen am 2026-07-31. Die HTML-Dokumentation unter
`https://www.ebrief.de/api-dokumentation` zeigt **kein einziges Beispiel eines
Job- oder Dokumentobjekts**; alle Feldnamen hier stammen aus der Spezifikation,
nicht aus Prosa. Der erste Spike-Lauf ist an genau dieser Lücke gescheitert.

## Antwortumschlag

Jede Antwort ist gewickelt:

```jsonc
{
  "ResultCode": "Ok",        // None | Ok | NotFound | Conflict | Unauthorized
                             // | UnknownError | BadRequest | Forbidden
  "ErrorMessage": null,
  "Result": { /* endpunktabhängig */ }
}
```

**`Result` ist bei den Job-Endpunkten nicht der Job**, sondern ein Objekt mit
einer Liste:

| Endpunkt | Weg zum Nutzinhalt |
|---|---|
| `POST /Jobs` | `Result.Jobs[0]` → `JobDetailsInfo` |
| `GET /Jobs/{id}` | `Result.Jobs[0]` → `JobDetailsInfo` |
| `PUT /Jobs/{id}` | `Result.Jobs[0]` → `JobDetailsInfo` |
| `POST /Jobs/{id}/singleFiles` | `Result.Jobs[0]` → `JobDetailsInfo` |
| `POST /Jobs/distribution` | `Result.Jobs[0]` → `SimpleJobInfo` |
| `DELETE /Jobs/{id}` | `Result.Jobs[0]` → `SimpleJobInfo` |
| `POST /Prices` | `Result` → `ResponsePriceInfo` (keine Liste) |
| `POST /Jobs/searchJobDetails` | `Result.ResponseDetails[]` → `JobInfo`, dazu `Result.ResultMetadata.TotalCount` |

## Pfade sind großgeschrieben

`/Jobs`, `/Docs`, `/Prices`, und insbesondere `/Docs/{docId}/FileWithMark`
(großes F und W). Kleinschreibung wurde im Test toleriert, ist aber nicht die
dokumentierte Form.

## JobDetailsInfo

| Feld | Typ | Anmerkung |
|---|---|---|
| `Id` | int64 | |
| `JobStatus` | string | **nicht** `Status` |
| `DateCreated` | date-time | **nicht** `CreatedAt` |
| `Documents` | `DocumentDetailsInfo[]` | |
| `JobFiles` | `JobFileInfo[]` | |
| `PriceBrutto` / `PriceNetto` / `Vat` | double | Preis **dieses** Jobs |
| `StatusCodeMessage`, `StatusCodeMessageInfo` | string | |
| `Attributes` | object | |
| `CustomerNumber`, `CustomerName` | string | |

Die Statuswerte sind in der Spezifikation **nicht** als Enum hinterlegt —
`JobStatus` ist ein freier String. Die sechzehn Werte, die unser Code
unterscheidet, stammen aus der Prosa-Dokumentation und sind entsprechend
defensiv zu behandeln.

### `COMITTED` mit einem M

Der erste erfolgreiche Lauf gegen Staging antwortete mit
`JobStatus=COMITTED` — **ein M**, während die Dokumentation durchgängig
`COMMITTED` schreibt. Die tatsächlichen Statusstrings entsprechen also nicht
verlässlich den dokumentierten.

Konsequenzen im Code:

- Beide Schreibweisen stehen als eigene Literale in `src/lib/ebrief/types.ts`
  und in jeder Statusliste. **Nicht** normalisieren: ein Normalisierer, der
  `COMITTED` und `COMMITTED` zusammenfasst, fasst auch Werte zusammen, die sich
  echt unterscheiden.
- Keine Liste bekannter Status darf als Verbotsliste benutzt werden. Ob
  verteilt werden darf, wird positiv gefragt (`VOR_VERTEILUNG_STATUSES`), damit
  ein unbekannter oder falsch geschriebener „bereits verteilt“-Status keinen
  zweiten Brief auslöst.

## DocumentDetailsInfo

| Feld | Typ | Anmerkung |
|---|---|---|
| `Id` | int | |
| `DocumentStatus` | string | **nicht** `Status` |
| `AddressInformation` | `AddressDocumentInfo` | siehe unten |
| `NumberPagesLogical` / `NumberPagesPhysical` | int | echte Seitenzahl |
| `PriceBrutto` / `PriceNetto` / `Vat` | double | |
| `DocumentFileName`, `LastEvent`, `TimestampLastEvent` | string | |
| `ShipmentNumber`, `TrackingUrl`, `DocumentErrorCode` | string | |

## AddressDocumentInfo — was eBrief aus dem PDF gelesen hat

| Feld | Typ |
|---|---|
| `ExtractedTextFromDocument` | string |
| `Street`, `HouseNumber`, `Zip`, `City`, `Country` | string |

Das ist der direkte Nachweis, ob unser Anschriftenfeld gefunden wird —
belastbarer als das markierte PDF, weil man die erkannten Felder mit den
gesendeten vergleichen kann.

## ResponsePriceInfo

| Feld | Typ |
|---|---|
| `TotalSumBrutto` / `TotalSumNetto` / `TotalSumVat` | double |
| `TotalSumShipmentBrutto` / `-Netto` / `-Vat` | double |
| `Prices` | `ArticleInfo[]` |

**Es gibt kein `TotalPrice`.** Der ursprüngliche Code las genau dieses Feld und
wäre über `?? 0` still durchgelaufen. Die Einheit ist ein `double` mit
Brutto/Netto-Trennung, also Euro — die Cent-Befürchtung von der Checkliste
entfällt.

## JobInfo (nur aus searchJobDetails)

| Feld | Typ | Anmerkung |
|---|---|---|
| `Id` | int | |
| `JobStatus` | string | |
| `DateCreatedUnix` | int | **Unix-Zeit**, nicht ISO — und ein anderes Feld als `DateCreated` bei `JobDetailsInfo` |
| `Documents` | `DocumentInfo[]` | |
| `TotalDocumentsCount` | int | |
| `PriceBrutto` / `PriceNetto` / `Vat` | double | |
| `Reference`, `AdditionalReference` | string | |

`SimpleJobInfo` (aus `distribution` und `DELETE`) nutzt wiederum `JobId` statt
`Id` und `CreatedAt` statt `DateCreated`. Die drei Job-Darstellungen der API
sind untereinander nicht feldgleich.

## Nicht genutzte Endpunkte, die relevant werden könnten

**`POST /Jobs/payment`** — „Sent job(s) for further processing and sends it for
payment. **Only jobs that are in status `USER_WAIT_FOR_SHOPPING` are possible
to process.**" Body wie bei der Distribution: `{ Ids: [int] }`.

eBrief hat also ein eigenes Bezahl-/Warenkorb-Konzept. Unser Webhook ruft nach
der Stripe-Zahlung direkt `POST /Jobs/distribution`. Landet ein Job stattdessen
in `USER_WAIT_FOR_SHOPPING`, könnte davor `POST /Jobs/payment` nötig sein.
**Das ist am Statusverlauf des Staging-Laufs abzulesen** — erreicht ein
committeter Job diesen Status, muss der Webhook den Schritt ergänzen.

**`GET /Docs/{docId}/ProcessedFile`** — „Document generated PDF file". Das ist
das PDF, das tatsächlich gedruckt wird. Als Vorschau vor der Zahlung
aussagekräftiger als das markierte PNG, wenn es darum geht, dem Nutzer zu
zeigen, was ankommt; `FileWithMark` bleibt die bessere Wahl, wenn es um die
erkannte Adresszone geht.

**`GET /Docs/{docId}/events`** und **`GET /Docs/shipments/{shipmentNumber}`** —
Sendungsverfolgung nach dem Versand. Interessant, falls später ein
Sendungsstatus im Nutzerkonto gezeigt werden soll; aktuell nicht im Umfang.

**`PUT /Jobs/status`**, **`GET|POST /Jobs/{jobId}/attributes`**,
**`POST /Jobs/small`** — Statusänderung von außen, nachträgliches Ändern der
Job-Attribute, vereinfachte Suche. Alle ungenutzt.

Im Suchergebnis heißt das Adressfeld **`AdressInformation`** (ein d), während
`DocumentDetailsInfo` **`AddressInformation`** schreibt. Kein Tippfehler
unsererseits — die API ist an dieser Stelle inkonsistent.

## Anfrageschemata

- `PUT /Jobs/{id}`: `{ "IsRollback": false }`
- `POST /Jobs/{id}/singleFiles`: `{ Attributes, Document: {FileName, FileContent}, Attachments[], AddressInformation }`
- `POST /Jobs/distribution`: `{ "Ids": [int] }`
- `POST /Docs/confirmation`: `{ "Ids": [int] }`
- `POST /Prices`: `{ Amount, Attributes: { Pages, IsDuplex, IsColor, IsTracking, PaperType, EnvelopeType, EnvelopeFormat, RecycledPaper, Region } }` — `Region` ist ein Enum: `National` | `International`
- `POST /Jobs/searchJobDetails`: `{ CustomerNumber, DateFrom, DateTo, Paging: {PageNumber, PageSize}, JobStatus: string[], Reference, AdditionalReference }`
- `GET /oauth2/token/generateBearerToken` → `{ GenerateBearerTokenResult: string }`
