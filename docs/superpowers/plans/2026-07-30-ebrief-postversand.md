# eBrief-Postversand der Mängelanzeige — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nutzer können ihre fertige Mängelanzeige gegen Bezahlung als Brief oder Einwurf-Einschreiben über eBrief an den Vermieter versenden.

**Architecture:** Das Versand-PDF entsteht serverseitig im eBrief-Layout. Der eBrief-Job wird vor der Zahlung angelegt und committet, damit die Adressprüfung läuft, solange der Nutzer noch korrigieren kann; ausgelöst wird der Druck erst durch `POST /jobs/distribution` im Stripe-Webhook. Es gibt keine eigene Datenbank — Stripe ist das Auftragsregister, eBrief hält das Dokument.

**Tech Stack:** Next.js 16 App Router, TypeScript, jsPDF (serverseitig, mit eingebetteter DejaVu Sans), Stripe Node SDK, Playwright.

**Spec:** `docs/superpowers/specs/2026-07-30-ebrief-versand-design.md`

---

## Dateistruktur

| Datei | Verantwortung |
|---|---|
| `src/lib/ebrief/produkte.ts` | Produktkatalog: Verkaufspreis + eBrief-Attribute |
| `src/lib/ebrief/token.ts` | Bearer-Token holen und cachen |
| `src/lib/ebrief/client.ts` | HTTP-Aufrufe gegen die eBrief-API |
| `src/lib/ebrief/types.ts` | Antworttypen der eBrief-API |
| `src/lib/steuer.ts` | Steuermodus, Steuerhinweis, Stripe-`tax_behavior` |
| `src/lib/fonts/dejaVuSans.ts` | Base64-TTF für die Einbettung (generiert) |
| `src/lib/briefPdf.ts` | Versand-Layout nach eBrief-Abstandsvorlage |
| `src/lib/rateLimit.ts` | Best-effort-Ratenbegrenzung pro IP |
| `src/app/api/versand/vorbereiten/route.ts` | PDF bauen, Job anlegen, Datei hochladen, committen |
| `src/app/api/versand/status/route.ts` | Job-Status auf UI-Zustände abbilden |
| `src/app/api/versand/adressvorschau/route.ts` | `fileWithMark` als PNG/PDF durchreichen |
| `src/app/api/versand/checkout/route.ts` | Stripe Checkout Session |
| `src/app/api/stripe/webhook/route.ts` | Zahlung verifizieren, Distribution auslösen |
| `src/app/api/cron/ebrief-cleanup/route.ts` | unbezahlte Jobs aufräumen |
| `src/components/VersandKarte.tsx` | Versand-UI, eingebunden in Schritt 4 |
| `scripts/ebrief-spike.ts` | einmaliger Lebenszyklus-Test gegen Staging |
| `scripts/build-font.ts` | TTF nach Base64-Modul wandeln |

`src/lib/generatePdf.ts` bleibt unangetastet — der kostenlose Download darf von Änderungen am Versandlayout nicht betroffen sein.

**Sprache im Code:** `CLAUDE.md` verlangt englische Kommentare, und der Bestandscode hält sich daran, auch wo die Domänenbezeichner deutsch bleiben (`MieterDaten`, `heuteDatum()`). Die Codeblöcke in diesem Plan tragen aus Lesbarkeitsgründen deutsche Kommentare — **beim Umsetzen sind sie ins Englische zu übersetzen**. Bezeichner bleiben wie geschrieben.

**Testansatz:** Das Projekt hat keinen Unit-Test-Runner und bekommt für diese Integration keinen (so in der Spec entschieden). Verifikation läuft über drei Wege: der Spike prüft die Annahmen gegen die echte Staging-API, `npm run verify` deckt Lint/i18n/Build/E2E ab, und Playwright testet die Routen mit gestubbten eBrief-Antworten.

---

### Task 1: Produktkatalog und Steuerlogik

**Files:**
- Create: `src/lib/ebrief/produkte.ts`
- Create: `src/lib/steuer.ts`
- Modify: `.env.example`

- [ ] **Step 1: Produktkatalog anlegen**

`src/lib/ebrief/produkte.ts`:

```ts
/**
 * Verkaufspreise sind Endpreise. Der Betreiber ist Kleinunternehmer nach
 * § 19 UStG und darf keine Umsatzsteuer ausweisen — siehe src/lib/steuer.ts.
 *
 * Die Einkaufspreise dienen nur der Kalkulation und werden nicht angezeigt.
 * Ohne Vorsteuerabzug ist der Bruttopreis der real gezahlte Preis.
 */
export interface Produkt {
  id: ProduktId;
  /** Endpreis in Cent, den der Nutzer zahlt. */
  preisCent: number;
  /** Einkaufspreis brutto in Cent laut eBrief-Preisliste, Standardbrief bis 3 Blatt. */
  einkaufBruttoCent: number;
  /** Job-Attribute. eBrief erwartet hier Strings, keine Booleans. */
  ebrief: {
    IsDuplex: "true" | "false";
    IsColor: "true" | "false";
    IsTracking: "true" | "false";
  };
}

export type ProduktId = "brief" | "einwurfEinschreiben";

export const PRODUKTE: Record<ProduktId, Produkt> = {
  brief: {
    id: "brief",
    preisCent: 249,
    einkaufBruttoCent: 88,
    ebrief: { IsDuplex: "false", IsColor: "false", IsTracking: "false" },
  },
  einwurfEinschreiben: {
    id: "einwurfEinschreiben",
    preisCent: 699,
    einkaufBruttoCent: 415,
    ebrief: { IsDuplex: "false", IsColor: "false", IsTracking: "true" },
  },
};

export function istProduktId(value: unknown): value is ProduktId {
  return value === "brief" || value === "einwurfEinschreiben";
}
```

- [ ] **Step 2: Steuerlogik anlegen**

`src/lib/steuer.ts`:

```ts
/**
 * Der Betreiber ist eine GbR unter der Kleinunternehmerregelung. Ein
 * Steuerausweis wäre nach § 14c UStG schädlich: die ausgewiesene Steuer
 * müsste abgeführt werden, obwohl sie nicht erhoben werden darf.
 *
 * Beim Wechsel zur Regelbesteuerung genügt STEUERMODUS=regel.
 */
export type Steuermodus = "kleinunternehmer" | "regel";

export function steuermodus(): Steuermodus {
  return process.env.STEUERMODUS === "regel" ? "regel" : "kleinunternehmer";
}

/**
 * Stripe darf im Kleinunternehmerfall keinerlei Steuerverhalten annehmen —
 * undefined lässt den Betrag unverändert als Endpreis stehen.
 */
export function stripeTaxBehavior(): "inclusive" | undefined {
  return steuermodus() === "regel" ? "inclusive" : undefined;
}
```

- [ ] **Step 3: `.env.example` ergänzen**

Ersetze in `.env.example` den Block

```
# The site is download-only and completely free — there is no paid service and
# therefore no payment or postal-dispatch configuration.
```

durch

```
# --- Postal dispatch (eBrief) -------------------------------------------------
# Sends the finished Mängelanzeige as a physical letter. Credentials come from
# eBrief support after account setup. Without these the dispatch option is
# hidden and the site stays download-only.
EBRIEF_BASE_URL=          # [OPTIONAL] default: https://api.staging.ebrief.de
EBRIEF_USER=              # [REQUIRED for dispatch] Basic-auth user
EBRIEF_PASSWORD=          # [REQUIRED for dispatch] Basic-auth password

# --- Payment (Stripe) ---------------------------------------------------------
# Charges the dispatch fee. The webhook secret is what makes the dispatch
# trigger trustworthy — without it no letter is ever sent.
STRIPE_SECRET_KEY=        # [REQUIRED for dispatch]
STRIPE_WEBHOOK_SECRET=    # [REQUIRED for dispatch]

# Tax mode. The operator is a small business under § 19 UStG, so no VAT may be
# stated anywhere. Switch to "regel" only after leaving that status.
STEUERMODUS=              # [OPTIONAL] kleinunternehmer (default) | regel

# --- Cron ---------------------------------------------------------------------
# Protects /api/cron/ebrief-cleanup, which deletes unpaid jobs after 24h.
CRON_SECRET=              # [REQUIRED for dispatch]
```

- [ ] **Step 4: Build prüfen**

Run: `npm run lint && npx tsc --noEmit`
Expected: keine Fehler.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ebrief/produkte.ts src/lib/steuer.ts .env.example
git commit -m "Add product catalogue and small-business tax handling"
```

---

### Task 2: Token-Beschaffung

**Files:**
- Create: `src/lib/ebrief/token.ts`

- [ ] **Step 1: Token-Modul schreiben**

`src/lib/ebrief/token.ts`:

```ts
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** Eine Stunde Sicherheitsabstand, damit kein Aufruf auf ein ablaufendes Token trifft. */
const REFRESH_MARGIN_MS = 60 * 60 * 1000;

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cached: CachedToken | null = null;
/** Verhindert, dass parallele Requests gleichzeitig Tokens anfordern. */
let inFlight: Promise<string> | null = null;

export function ebriefBaseUrl(): string {
  return process.env.EBRIEF_BASE_URL || "https://api.staging.ebrief.de";
}

export function ebriefKonfiguriert(): boolean {
  return Boolean(process.env.EBRIEF_USER && process.env.EBRIEF_PASSWORD);
}

/**
 * Die Doku beschreibt den Endpunkt als POST, das offizielle Codebeispiel
 * verwendet aber GET. Wir versuchen GET und fallen bei 405 auf POST zurück.
 */
async function fetchToken(): Promise<string> {
  const user = process.env.EBRIEF_USER;
  const password = process.env.EBRIEF_PASSWORD;
  if (!user || !password) throw new Error("eBrief credentials missing");

  const url = `${ebriefBaseUrl()}/oauth2/token/generateBearerToken`;
  const headers = {
    Authorization: `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`,
    "Content-Type": "application/json",
  };

  let res = await fetch(url, { method: "GET", headers });
  if (res.status === 405) res = await fetch(url, { method: "POST", headers });

  if (!res.ok) {
    throw new Error(`eBrief token request failed: ${res.status}`);
  }

  const body = (await res.json()) as {
    GenerateBearerTokenResult?: string;
    Result?: string;
  };
  const token = body.GenerateBearerTokenResult ?? body.Result;
  if (!token) throw new Error("eBrief token response contained no token");
  return token;
}

export async function getToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt - REFRESH_MARGIN_MS) {
    return cached.token;
  }
  if (inFlight) return inFlight;

  inFlight = fetchToken()
    .then((token) => {
      cached = { token, expiresAt: Date.now() + TOKEN_TTL_MS };
      return token;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/** Nach einem 401 einmal neu holen — das Token kann serverseitig invalidiert worden sein. */
export function invalidateToken(): void {
  cached = null;
}
```

- [ ] **Step 2: Typprüfung**

Run: `npx tsc --noEmit`
Expected: keine Fehler.

- [ ] **Step 3: Commit**

```bash
git add src/lib/ebrief/token.ts
git commit -m "Add eBrief bearer token cache"
```

---

### Task 3: eBrief-API-Client

**Files:**
- Create: `src/lib/ebrief/types.ts`
- Create: `src/lib/ebrief/client.ts`

- [ ] **Step 1: Typen definieren**

`src/lib/ebrief/types.ts`:

```ts
/** Statuswerte laut eBrief-Doku, Abschnitt "Possible Job Statuses". */
export type JobStatus =
  | "UNPROCESSED"
  | "COMMITTED"
  | "PROCESSING_DOCUMENTS_PREPARE"
  | "COMPLETED_DOCUMENTS_PREPARE"
  | "PROCESSING_DOCUMENTS_PROCESS"
  | "COMPLETED_DOCUMENTS_PROCESS"
  | "USER_CONFIRMATION_REQUESTED"
  | "USER_WAIT_FOR_SHOPPING"
  | "DISTRIBUTION_READY_FOR"
  | "DISTRIBUTION_COMPLETED"
  | "BILLING_COMPLETED"
  | "JOB_COMPLETED"
  | "ERROR_DOCUMENT"
  | "ERROR_GENERAL"
  | "USER_DELETED"
  | "ROLLEDBACK";

/** Ab diesen Status ist der Druck angestoßen und darf nicht erneut ausgelöst werden. */
export const DISTRIBUTED_STATUSES: JobStatus[] = [
  "DISTRIBUTION_READY_FOR",
  "DISTRIBUTION_COMPLETED",
  "BILLING_COMPLETED",
  "JOB_COMPLETED",
];

export interface EbriefDoc {
  Id: number;
  Status?: string;
}

export interface EbriefJob {
  Id: number;
  Status: JobStatus;
  Documents?: EbriefDoc[];
  CreatedAt?: string;
}

/** Alle Antworten der API sind in diesen Umschlag gewickelt. */
export interface EbriefEnvelope<T> {
  Result: T;
  ResultCode?: string;
  ErrorMessage?: string | null;
}

export interface PriceResult {
  TotalPrice?: number;
  TotalNetPrice?: number;
  [key: string]: unknown;
}
```

- [ ] **Step 2: Client schreiben**

`src/lib/ebrief/client.ts`:

```ts
import { ebriefBaseUrl, getToken, invalidateToken } from "./token";
import type {
  EbriefEnvelope,
  EbriefJob,
  JobStatus,
  PriceResult,
} from "./types";

export class EbriefError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: string
  ) {
    super(message);
    this.name = "EbriefError";
  }
}

/**
 * Einziger Ort, an dem gegen eBrief gesprochen wird. Ein 401 kann bedeuten,
 * dass das gecachte Token serverseitig invalidiert wurde — dann einmal mit
 * frischem Token wiederholen, bevor wir aufgeben.
 */
async function call<T>(
  path: string,
  init: { method: string; body?: unknown },
  retryOn401 = true
): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${ebriefBaseUrl()}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  if (res.status === 401 && retryOn401) {
    invalidateToken();
    return call<T>(path, init, false);
  }

  const text = await res.text();
  if (!res.ok) {
    throw new EbriefError(`eBrief ${init.method} ${path} failed`, res.status, text);
  }

  if (!text) return undefined as T;

  const parsed = JSON.parse(text) as EbriefEnvelope<T>;
  if (parsed.ErrorMessage) {
    throw new EbriefError(parsed.ErrorMessage, res.status, text);
  }
  return parsed.Result;
}

export interface JobAttributes {
  IsDuplex: string;
  IsColor: string;
  IsTracking: string;
  NotificationMail?: string;
  SilentConfirm: string;
}

export function createJob(attributes: JobAttributes): Promise<EbriefJob> {
  return call<EbriefJob>("/jobs", { method: "POST", body: { Attributes: attributes } });
}

export function addFile(
  jobId: number,
  fileName: string,
  base64Content: string
): Promise<unknown> {
  return call("/jobs/" + jobId + "/singleFiles", {
    method: "POST",
    body: { Document: { FileName: fileName, FileContent: base64Content } },
  });
}

export function commitJob(jobId: number): Promise<unknown> {
  return call(`/jobs/${jobId}`, { method: "PUT", body: { IsRollback: false } });
}

export function getJob(jobId: number): Promise<EbriefJob> {
  return call<EbriefJob>(`/jobs/${jobId}`, { method: "GET" });
}

export function distribute(jobId: number): Promise<unknown> {
  return call("/jobs/distribution", { method: "POST", body: { Ids: [jobId] } });
}

export function confirmDocs(docIds: number[]): Promise<unknown> {
  return call("/docs/confirmation", { method: "POST", body: { Ids: docIds } });
}

export function deleteJob(jobId: number): Promise<unknown> {
  return call(`/jobs/${jobId}`, { method: "DELETE" });
}

/**
 * Preisabfrage. Anders als bei den Job-Attributes erwartet dieser Endpunkt
 * echte Booleans — die Doku ist an dieser Stelle inkonsistent, deshalb wird
 * die Umwandlung hier gekapselt.
 */
export function getPrice(opts: {
  pages: number;
  isColor: boolean;
  isDuplex: boolean;
  isTracking: boolean;
}): Promise<PriceResult> {
  return call<PriceResult>("/prices", {
    method: "POST",
    body: {
      Amount: 1,
      Attributes: {
        Pages: opts.pages,
        IsDuplex: opts.isDuplex,
        IsColor: opts.isColor,
        IsTracking: opts.isTracking,
        PaperType: "",
        EnvelopeType: "",
        EnvelopeFormat: "",
        RecycledPaper: false,
        Region: "National",
      },
    },
  });
}

/** Rohe PDF-Bytes mit der von eBrief markierten Adresszone. */
export async function getFileWithMark(docId: number): Promise<ArrayBuffer> {
  const token = await getToken();
  const res = await fetch(`${ebriefBaseUrl()}/docs/${docId}/fileWithMark`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new EbriefError("fileWithMark failed", res.status);
  }
  return res.arrayBuffer();
}

export type { EbriefJob, JobStatus };
```

- [ ] **Step 3: Typprüfung**

Run: `npx tsc --noEmit`
Expected: keine Fehler.

- [ ] **Step 4: Commit**

```bash
git add src/lib/ebrief/types.ts src/lib/ebrief/client.ts
git commit -m "Add eBrief API client"
```

---

### Task 4: Staging-Spike

Dieser Task validiert die zwei Annahmen, auf denen der ganze Ablauf steht: dass der Token-Endpunkt GET ist, und dass ein committeter Job ohne Distribution nichts kostet.

**Files:**
- Create: `scripts/ebrief-spike.ts`

- [ ] **Step 1: Spike schreiben**

`scripts/ebrief-spike.ts`:

```ts
/**
 * Einmaliger Lebenszyklus-Test gegen api.staging.ebrief.de.
 * Distribuiert bewusst nichts — es wird nichts gedruckt und nichts berechnet.
 *
 * Aufruf: npx tsx scripts/ebrief-spike.ts
 */
import { readFileSync } from "node:fs";
import {
  addFile,
  commitJob,
  createJob,
  deleteJob,
  getJob,
  getPrice,
} from "../src/lib/ebrief/client";

const PDF_PFAD = process.argv[2];

async function main() {
  if (!PDF_PFAD) {
    console.error("Aufruf: npx tsx scripts/ebrief-spike.ts <pfad-zur-test.pdf>");
    process.exit(1);
  }

  console.log("Base URL:", process.env.EBRIEF_BASE_URL);

  const job = await createJob({
    IsDuplex: "false",
    IsColor: "false",
    IsTracking: "false",
    SilentConfirm: "false",
  });
  console.log("Job angelegt:", job.Id, job.Status);

  const base64 = readFileSync(PDF_PFAD).toString("base64");
  await addFile(job.Id, "spike.pdf", base64);
  console.log("Datei hochgeladen");

  await commitJob(job.Id);
  console.log("Committet");

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const aktuell = await getJob(job.Id);
    console.log(`  [${i}] Status: ${aktuell.Status}, Docs: ${aktuell.Documents?.length ?? 0}`);
    if (
      aktuell.Status === "COMPLETED_DOCUMENTS_PROCESS" ||
      aktuell.Status === "USER_CONFIRMATION_REQUESTED" ||
      aktuell.Status === "USER_WAIT_FOR_SHOPPING" ||
      aktuell.Status.startsWith("ERROR")
    ) {
      console.log("Endzustand vor Distribution:", aktuell.Status);
      console.log("Dokumente:", JSON.stringify(aktuell.Documents, null, 2));
      break;
    }
  }

  const preis = await getPrice({
    pages: 2,
    isColor: false,
    isDuplex: false,
    isTracking: false,
  });
  console.log("Preis (Brief):", JSON.stringify(preis, null, 2));

  const preisTracked = await getPrice({
    pages: 2,
    isColor: false,
    isDuplex: false,
    isTracking: true,
  });
  console.log("Preis (Einschreiben):", JSON.stringify(preisTracked, null, 2));

  await deleteJob(job.Id);
  console.log("Job gelöscht — laut Doku wird er damit nicht berechnet.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Spike ausführen**

Voraussetzung: `EBRIEF_BASE_URL=https://api.staging.ebrief.de`, `EBRIEF_USER`, `EBRIEF_PASSWORD` in `.env.local`.

Run:

```bash
npx tsx --env-file=.env.local scripts/ebrief-spike.ts docs/ebrief/PIN_eBrief_Abstandsvorlage_A4_2026_EN.pdf
```

Expected: Job wird angelegt, Datei hochgeladen, Status läuft bis `COMPLETED_DOCUMENTS_PROCESS` oder `USER_CONFIRMATION_REQUESTED`, zwei Preise werden ausgegeben, Job wird gelöscht.

**Wenn der Token-Aufruf mit 405 scheitert und erst der POST-Fallback greift:** notieren, aber nichts ändern — der Client kann beides.

**Wenn der Job direkt nach dem Commit auf `DISTRIBUTION_*` oder `BILLING_COMPLETED` springt:** Abbruch. Dann druckt eBrief sofort, und der Zahlungsablauf aus der Spec trägt nicht. In dem Fall zurück in die Spec und auf Ansatz A (PDF in Vercel Blob zwischenlagern) wechseln.

- [ ] **Step 3: Beobachtete Feldnamen in `types.ts` nachziehen**

Die tatsächlichen Feldnamen aus der Spike-Ausgabe (insbesondere `Documents[].Id` und die Preisfelder) mit `src/lib/ebrief/types.ts` abgleichen und Abweichungen korrigieren.

- [ ] **Step 4: Commit**

```bash
git add scripts/ebrief-spike.ts src/lib/ebrief/types.ts
git commit -m "Add eBrief staging spike and align response types"
```

---

### Task 5: Schrifteinbettung

**Files:**
- Create: `scripts/build-font.ts`
- Create: `src/lib/fonts/dejaVuSans.ts` (generiert)
- Modify: `package.json` (devDependency `dejavu-fonts-ttf`)

> **Korrektur gegenüber der ursprünglichen Planung:** Liberation Sans war vorgesehen, ist aber über keinen stabilen Kanal mehr zu beziehen — die GitHub-Releases des Projekts tragen seit 2.00.3 keine Assets mehr, und fontsource liefert ausschließlich woff/woff2, womit jsPDF nichts anfangen kann. Stattdessen **DejaVu Sans** aus dem npm-Paket `dejavu-fonts-ttf`. Die Bitstream-Vera-Lizenz erlaubt Einbettung und Weitergabe ausdrücklich. Praktisch verifiziert: jsPDF bettet die Datei als `FontFile2` ein und subsettet dabei automatisch — aus 757 KB TTF wird ein 144 KB PDF; Umlaute, ß und Geviertstrich rendern korrekt.

- [ ] **Step 1: Schrift beschaffen**

Regular genügt — der Brieftext braucht keinen Fettschnitt.

```bash
npm install --save-dev dejavu-fonts-ttf@2.37.3
```

Expected: `node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf` existiert (757076 Bytes).

- [ ] **Step 2: Konvertierungsskript schreiben**

`scripts/build-font.ts`:

```ts
/**
 * Turns a TTF into a TS module holding a base64 string so jsPDF can embed the
 * font. Reading the file from disk at runtime would depend on Vercel's file
 * tracing picking up a node_modules asset nothing imports; as a module the
 * font is bundled reliably.
 *
 * Usage: npx tsx scripts/build-font.ts node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const quelle = process.argv[2];
if (!quelle) {
  console.error("Usage: npx tsx scripts/build-font.ts <path.ttf>");
  process.exit(1);
}

const base64 = readFileSync(quelle).toString("base64");
mkdirSync("src/lib/fonts", { recursive: true });
writeFileSync(
  "src/lib/fonts/dejaVuSans.ts",
  `// Generated by scripts/build-font.ts — do not edit by hand.\n` +
    `// DejaVu Sans Regular, Bitstream Vera license (embedding permitted).\n` +
    `// eBrief's spacing template requires fonts to be embedded completely;\n` +
    `// jsPDF's built-in Helvetica is not embedded, hence this module.\n` +
    `export const DEJAVU_SANS_REGULAR_BASE64 = "${base64}";\n`
);
console.log(`Written: src/lib/fonts/dejaVuSans.ts (${base64.length} characters)`);
```

- [ ] **Step 3: Schriftmodul erzeugen**

```bash
npx tsx scripts/build-font.ts node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf
```

Expected: `src/lib/fonts/dejaVuSans.ts` existiert (rund 1 MB — reines Server-Modul, es landet nicht im Client-Bundle).

- [ ] **Step 4: Typprüfung**

Run: `npx tsc --noEmit`
Expected: keine Fehler.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json scripts/build-font.ts src/lib/fonts/dejaVuSans.ts
git commit -m "Embed DejaVu Sans for the dispatch PDF"
```

---

### Task 6: Versand-PDF im eBrief-Layout

**Files:**
- Create: `src/lib/briefPdf.ts`

Maße aus `docs/ebrief/PIN_eBrief_Abstandsvorlage_A4_2026_EN.pdf`.

- [ ] **Step 1: Layout schreiben**

`src/lib/briefPdf.ts`:

```ts
import jsPDF from "jspdf";
import { DEJAVU_SANS_REGULAR_BASE64 } from "./fonts/dejaVuSans";

/**
 * Layout nach der offiziellen eBrief-Abstandsvorlage (A4, 210 × 297 mm).
 * eBrief liest die Empfängeradresse aus dem PDF — sitzt sie nicht im
 * Anschriftenfeld, schlägt die Zustellung fehl.
 *
 * Der kostenlose Download nutzt weiterhin src/lib/generatePdf.ts. Beide
 * Layouts absichtlich getrennt: nur dieses hier braucht eingebettete
 * Schriften und freigehaltene Maschinenzonen.
 */
const LINKER_RAND_MM = 25;
const RECHTER_RAND_MM = 20;
const SEITENBREITE_MM = 210;
const TEXTBREITE_MM = SEITENBREITE_MM - LINKER_RAND_MM - RECHTER_RAND_MM;

const ABSENDERZEILE_Y_MM = 45;
const ANSCHRIFT_Y_MM = 55;
const ANSCHRIFT_BREITE_MM = 85;
const TEXTSTART_Y_MM = 111;

const ZEILENHOEHE_MM = 5.5;
const SEITENUMBRUCH_Y_MM = 272;
const FOLGESEITE_START_Y_MM = 25;

const UNTERSCHRIFT_BREITE_MM = 50;
const UNTERSCHRIFT_HOEHE_MM = 20;

const SCHRIFT = "DejaVuSans";

export interface VersandPdfOptions {
  /** Brieftext, wie der Nutzer ihn in der Vorschau bestätigt hat. */
  text: string;
  absenderZeile: string;
  empfaenger: string[];
  signatureDataUrl?: string;
  /**
   * Beim Einwurf-Einschreiben liegt über dem Anschriftenfeld eine
   * PIN-AG-Codierzone, die textfrei bleiben muss. Dann entfällt die
   * Absenderzeile über der Anschrift.
   */
  istEinschreiben: boolean;
}

/**
 * Der erzeugte Brieftext trägt bereits einen Adresskopf (Mieter, Vermieter,
 * Datum). Im Versandlayout kommt die Anschrift ins Anschriftenfeld, der Kopf
 * im Fließtext würde sie verdoppeln. Die Betreffzeile ist der verlässliche
 * Anker, weil sie in DIN 5008 ohnehin auf die Anschrift folgt.
 */
export function entferneAdresskopf(text: string): string {
  const zeilen = text.split("\n");
  const index = zeilen.findIndex((zeile) => /^\s*Betreff:/i.test(zeile));
  return index === -1 ? text : zeilen.slice(index).join("\n");
}

function registriereSchrift(doc: jsPDF): void {
  doc.addFileToVFS("DejaVuSans.ttf", DEJAVU_SANS_REGULAR_BASE64);
  doc.addFont("DejaVuSans.ttf", SCHRIFT, "normal");
  doc.setFont(SCHRIFT, "normal");
}

export function generateVersandPdf(opts: VersandPdfOptions): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registriereSchrift(doc);

  // Absenderzeile in 6 pt über dem Anschriftenfeld. Beim Einschreiben liegt
  // dort die Codierzone der PIN AG — dann bleibt die Zeile weg.
  if (!opts.istEinschreiben) {
    doc.setFontSize(6);
    doc.text(opts.absenderZeile, LINKER_RAND_MM, ABSENDERZEILE_Y_MM, {
      maxWidth: ANSCHRIFT_BREITE_MM,
    });
  }

  // Anschriftenfeld: 10 pt, klar innerhalb von 85 × 27 mm.
  doc.setFontSize(10);
  let anschriftY = ANSCHRIFT_Y_MM;
  for (const zeile of opts.empfaenger) {
    doc.text(zeile, LINKER_RAND_MM, anschriftY, { maxWidth: ANSCHRIFT_BREITE_MM });
    anschriftY += ZEILENHOEHE_MM;
  }

  doc.setFontSize(10);
  let y = TEXTSTART_Y_MM;

  const neueSeite = () => {
    doc.addPage();
    y = FOLGESEITE_START_Y_MM;
  };

  // Leerzeilen sind bedeutungstragende Absatzwechsel, deshalb Zeile für Zeile
  // laufen statt jsPDF den Text umbrechen zu lassen.
  for (const absatz of entferneAdresskopf(opts.text).split("\n")) {
    if (absatz.trim() === "") {
      y += ZEILENHOEHE_MM;
      if (y > SEITENUMBRUCH_Y_MM) neueSeite();
      continue;
    }
    for (const zeile of doc.splitTextToSize(absatz, TEXTBREITE_MM)) {
      if (y > SEITENUMBRUCH_Y_MM) neueSeite();
      doc.text(zeile, LINKER_RAND_MM, y);
      y += ZEILENHOEHE_MM;
    }
  }

  if (opts.signatureDataUrl) {
    // Die Vorlage verbietet große Grafiken näher als 3 cm am Seitenrand.
    if (y + UNTERSCHRIFT_HOEHE_MM > SEITENUMBRUCH_Y_MM - 30) neueSeite();
    y += ZEILENHOEHE_MM;
    doc.addImage(
      opts.signatureDataUrl,
      "PNG",
      LINKER_RAND_MM,
      y,
      UNTERSCHRIFT_BREITE_MM,
      UNTERSCHRIFT_HOEHE_MM
    );
  }

  return doc;
}

/** Base64 ohne Data-URL-Präfix — genau das erwartet eBrief in FileContent. */
export function versandPdfBase64(opts: VersandPdfOptions): string {
  return generateVersandPdf(opts).output("datauristring").split(",")[1];
}
```

- [ ] **Step 2: Layout gegen die Vorlage prüfen**

Erzeuge ein Probe-PDF und lege es über die Abstandsvorlage:

```bash
npx tsx -e "import{writeFileSync}from'node:fs';import{generateVersandPdf}from'./src/lib/briefPdf';writeFileSync('/tmp/probe.pdf',Buffer.from(generateVersandPdf({text:'Betreff: Mängelanzeige\n\nSehr geehrte Damen und Herren,\n\nTestinhalt.\n\nMit freundlichen Grüßen\n\nMax Mustermann',absenderZeile:'Max Mustermann, Teststraße 1, 10115 Berlin',empfaenger:['Hausverwaltung Muster GmbH','Beispielweg 5','10117 Berlin'],istEinschreiben:false}).output('arraybuffer')))"
```

Expected: `/tmp/probe.pdf` entsteht. Öffne es zusammen mit `docs/ebrief/PIN_eBrief_Abstandsvorlage_A4_2026_EN.pdf` und prüfe: Anschrift innerhalb des Fensterbereichs, Textbeginn auf Höhe der 111-mm-Markierung, nichts im linken DataMatrix-Bereich.

- [ ] **Step 3: Commit**

```bash
git add src/lib/briefPdf.ts
git commit -m "Add dispatch PDF layout matching the eBrief spacing template"
```

---

### Task 7: Route „vorbereiten"

**Files:**
- Create: `src/lib/rateLimit.ts`
- Create: `src/app/api/versand/vorbereiten/route.ts`

- [ ] **Step 1: Ratenbegrenzung schreiben**

`src/lib/rateLimit.ts`:

```ts
/**
 * Best-effort-Begrenzung im Prozessspeicher. Auf Fluid Compute teilen sich
 * mehrere Requests eine Instanz, aber es gibt mehrere Instanzen — das ist
 * also kein harter Schutz, sondern bremst nur das offensichtliche Hämmern.
 * Ein harter Schutz wäre erst mit externem Zähler möglich und lohnt hier
 * nicht, weil vor der Distribution nichts gedruckt und nichts berechnet wird.
 */
const treffer = new Map<string, number[]>();

export function rateLimit(schluessel: string, limit: number, fensterMs: number): boolean {
  const jetzt = Date.now();
  const bisher = (treffer.get(schluessel) ?? []).filter((t) => jetzt - t < fensterMs);
  if (bisher.length >= limit) {
    treffer.set(schluessel, bisher);
    return false;
  }
  bisher.push(jetzt);
  treffer.set(schluessel, bisher);
  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unbekannt";
}
```

- [ ] **Step 2: Route schreiben**

`src/app/api/versand/vorbereiten/route.ts`:

```ts
import { NextResponse } from "next/server";
import {
  addFile,
  commitJob,
  createJob,
  deleteJob,
  getPrice,
} from "@/lib/ebrief/client";
import { ebriefKonfiguriert } from "@/lib/ebrief/token";
import { PRODUKTE, istProduktId } from "@/lib/ebrief/produkte";
import { versandPdfBase64 } from "@/lib/briefPdf";
import { clientIp, rateLimit } from "@/lib/rateLimit";

const LIMIT_PRO_STUNDE = 10;
const STUNDE_MS = 60 * 60 * 1000;

interface VorbereitenBody {
  produktId?: string;
  text?: string;
  signatureDataUrl?: string;
  mieter?: { name: string; strasse: string; plz: string; ort: string; email: string };
  vermieter?: { name: string; strasse: string; plz: string; ort: string };
}

export async function POST(request: Request) {
  if (!ebriefKonfiguriert()) {
    return NextResponse.json(
      { fehler: "versand_nicht_konfiguriert" },
      { status: 503 }
    );
  }

  if (!rateLimit(clientIp(request), LIMIT_PRO_STUNDE, STUNDE_MS)) {
    return NextResponse.json({ fehler: "zu_viele_anfragen" }, { status: 429 });
  }

  const body = (await request.json()) as VorbereitenBody;
  const { produktId, text, mieter, vermieter } = body;

  if (
    !istProduktId(produktId) ||
    !text ||
    !mieter?.name || !mieter.strasse || !mieter.plz || !mieter.ort || !mieter.email ||
    !vermieter?.name || !vermieter.strasse || !vermieter.plz || !vermieter.ort
  ) {
    return NextResponse.json({ fehler: "unvollstaendig" }, { status: 400 });
  }

  const produkt = PRODUKTE[produktId];
  const istEinschreiben = produkt.ebrief.IsTracking === "true";

  const base64 = versandPdfBase64({
    text,
    signatureDataUrl: body.signatureDataUrl,
    absenderZeile: `${mieter.name}, ${mieter.strasse}, ${mieter.plz} ${mieter.ort}`,
    empfaenger: [vermieter.name, vermieter.strasse, `${vermieter.plz} ${vermieter.ort}`],
    istEinschreiben,
  });

  let jobId: number | undefined;
  try {
    const job = await createJob({
      ...produkt.ebrief,
      // Adresswarnungen sollen sichtbar werden, nicht stillschweigend
      // durchgewinkt — sonst geht der Brief an eine beanstandete Adresse.
      SilentConfirm: "false",
      NotificationMail: mieter.email,
    });
    jobId = job.Id;

    await addFile(jobId, "maengelanzeige.pdf", base64);
    await commitJob(jobId);

    // Plausibilitätskontrolle: liegt der Einkauf deutlich über der Annahme,
    // versenden wir lieber nicht, statt mit Verlust zu drucken.
    const preis = await getPrice({
      pages: 2,
      isColor: false,
      isDuplex: false,
      isTracking: istEinschreiben,
    });
    const einkaufCent = Math.round((preis.TotalPrice ?? 0) * 100);
    if (einkaufCent > produkt.preisCent) {
      await deleteJob(jobId);
      console.error("eBrief purchase price above sale price", {
        jobId,
        einkaufCent,
        verkaufCent: produkt.preisCent,
      });
      return NextResponse.json({ fehler: "preis_unplausibel" }, { status: 409 });
    }

    return NextResponse.json({
      jobId,
      produktId,
      preisCent: produkt.preisCent,
    });
  } catch (err) {
    console.error("eBrief prepare failed", { jobId, err });
    if (jobId !== undefined) {
      // Halbfertige Jobs nicht liegen lassen — sie würden den Cron beschäftigen.
      await deleteJob(jobId).catch(() => {});
    }
    return NextResponse.json({ fehler: "ebrief_fehler" }, { status: 502 });
  }
}
```

- [ ] **Step 3: Typprüfung und Lint**

Run: `npm run lint && npx tsc --noEmit`
Expected: keine Fehler.

- [ ] **Step 4: Commit**

```bash
git add src/lib/rateLimit.ts src/app/api/versand/vorbereiten/route.ts
git commit -m "Add dispatch preparation route"
```

---

### Task 8: Status- und Adressvorschau-Routen

**Files:**
- Create: `src/app/api/versand/status/route.ts`
- Create: `src/app/api/versand/adressvorschau/route.ts`

- [ ] **Step 1: Statusroute schreiben**

`src/app/api/versand/status/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getJob } from "@/lib/ebrief/client";
import { DISTRIBUTED_STATUSES } from "@/lib/ebrief/types";

/** Die 16 eBrief-Status auf die vier Zustände, die das UI unterscheiden muss. */
export type UiStatus = "laeuft" | "bereit" | "adresse_warnung" | "fehler";

export async function GET(request: Request) {
  const jobId = Number(new URL(request.url).searchParams.get("jobId"));
  if (!Number.isInteger(jobId) || jobId <= 0) {
    return NextResponse.json({ fehler: "jobId_ungueltig" }, { status: 400 });
  }

  try {
    const job = await getJob(jobId);

    let status: UiStatus = "laeuft";
    if (job.Status === "USER_CONFIRMATION_REQUESTED") status = "adresse_warnung";
    else if (job.Status.startsWith("ERROR") || job.Status === "ROLLEDBACK") status = "fehler";
    else if (
      job.Status === "COMPLETED_DOCUMENTS_PROCESS" ||
      job.Status === "USER_WAIT_FOR_SHOPPING" ||
      DISTRIBUTED_STATUSES.includes(job.Status)
    ) {
      status = "bereit";
    }

    return NextResponse.json({
      status,
      ebriefStatus: job.Status,
      docId: job.Documents?.[0]?.Id ?? null,
    });
  } catch (err) {
    console.error("eBrief status failed", { jobId, err });
    return NextResponse.json({ fehler: "ebrief_fehler" }, { status: 502 });
  }
}
```

- [ ] **Step 2: Adressvorschau schreiben**

`src/app/api/versand/adressvorschau/route.ts`:

```ts
import { getFileWithMark } from "@/lib/ebrief/client";
import { NextResponse } from "next/server";

/**
 * Reicht das von eBrief markierte Dokument durch. Der Nutzer sieht damit
 * genau, welchen Adressbereich eBrief erkannt hat — das ist die ehrlichste
 * Bestätigung, die wir vor der Zahlung anbieten können.
 */
export async function GET(request: Request) {
  const docId = Number(new URL(request.url).searchParams.get("docId"));
  if (!Number.isInteger(docId) || docId <= 0) {
    return NextResponse.json({ fehler: "docId_ungueltig" }, { status: 400 });
  }

  try {
    const bytes = await getFileWithMark(docId);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("eBrief fileWithMark failed", { docId, err });
    return NextResponse.json({ fehler: "ebrief_fehler" }, { status: 502 });
  }
}
```

- [ ] **Step 3: Typprüfung und Lint**

Run: `npm run lint && npx tsc --noEmit`
Expected: keine Fehler.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/versand/status/route.ts src/app/api/versand/adressvorschau/route.ts
git commit -m "Add dispatch status and address preview routes"
```

---

### Task 9: Stripe-Checkout

**Files:**
- Modify: `package.json`
- Create: `src/lib/stripe.ts`
- Create: `src/app/api/versand/checkout/route.ts`

- [ ] **Step 1: Stripe installieren**

```bash
npm install stripe
```

- [ ] **Step 2: Stripe-Client anlegen**

`src/lib/stripe.ts`:

```ts
import Stripe from "stripe";

let client: Stripe | null = null;

export function stripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY missing");
    client = new Stripe(key);
  }
  return client;
}

export function stripeKonfiguriert(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
```

- [ ] **Step 3: Checkout-Route schreiben**

`src/app/api/versand/checkout/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getJob } from "@/lib/ebrief/client";
import { DISTRIBUTED_STATUSES } from "@/lib/ebrief/types";
import { PRODUKTE, istProduktId } from "@/lib/ebrief/produkte";
import { stripe, stripeKonfiguriert } from "@/lib/stripe";
import { stripeTaxBehavior } from "@/lib/steuer";

const PRODUKTNAMEN: Record<string, string> = {
  brief: "Mängelanzeige als Brief",
  einwurfEinschreiben: "Mängelanzeige als Einwurf-Einschreiben",
};

export async function POST(request: Request) {
  if (!stripeKonfiguriert()) {
    return NextResponse.json({ fehler: "zahlung_nicht_konfiguriert" }, { status: 503 });
  }

  const { jobId, produktId } = (await request.json()) as {
    jobId?: number;
    produktId?: string;
  };

  if (!Number.isInteger(jobId) || !istProduktId(produktId)) {
    return NextResponse.json({ fehler: "unvollstaendig" }, { status: 400 });
  }

  // Der Preis kommt ausschließlich aus dem Katalog, nie aus dem Request —
  // sonst könnte der Client seinen eigenen Preis bestimmen.
  const produkt = PRODUKTE[produktId];

  try {
    // Existiert der Job überhaupt und ist er noch nicht unterwegs?
    const job = await getJob(jobId as number);
    if (DISTRIBUTED_STATUSES.includes(job.Status)) {
      return NextResponse.json({ fehler: "bereits_versendet" }, { status: 409 });
    }

    const origin = new URL(request.url).origin;
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: produkt.preisCent,
            tax_behavior: stripeTaxBehavior(),
            product_data: { name: PRODUKTNAMEN[produkt.id] },
          },
        },
      ],
      metadata: { jobId: String(jobId), produktId: produkt.id },
      success_url: `${origin}/mietminderung?versand=erfolg`,
      cancel_url: `${origin}/mietminderung?versand=abbruch`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout failed", { jobId, err });
    return NextResponse.json({ fehler: "checkout_fehler" }, { status: 502 });
  }
}
```

- [ ] **Step 4: Typprüfung und Lint**

Run: `npm run lint && npx tsc --noEmit`
Expected: keine Fehler.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/lib/stripe.ts src/app/api/versand/checkout/route.ts
git commit -m "Add Stripe checkout for postal dispatch"
```

---

### Task 10: Stripe-Webhook löst den Versand aus

Das ist die Stelle, an der Geld und Brief zusammenkommen. Sie muss idempotent sein.

**Files:**
- Create: `src/app/api/stripe/webhook/route.ts`

- [ ] **Step 1: Webhook schreiben**

`src/app/api/stripe/webhook/route.ts`:

```ts
import { NextResponse } from "next/server";
import { confirmDocs, distribute, getJob } from "@/lib/ebrief/client";
import { DISTRIBUTED_STATUSES } from "@/lib/ebrief/types";
import { stripe } from "@/lib/stripe";

/**
 * Der Rohtext des Bodys wird für die Signaturprüfung gebraucht — deshalb
 * request.text() und nicht request.json().
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET missing — refusing to dispatch");
    return NextResponse.json({ fehler: "nicht_konfiguriert" }, { status: 503 });
  }

  const signatur = request.headers.get("stripe-signature");
  if (!signatur) {
    return NextResponse.json({ fehler: "signatur_fehlt" }, { status: 400 });
  }

  const rohtext = await request.text();

  let event;
  try {
    event = stripe().webhooks.constructEvent(rohtext, signatur, secret);
  } catch (err) {
    console.error("Stripe signature verification failed", err);
    return NextResponse.json({ fehler: "signatur_ungueltig" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ empfangen: true });
  }

  const session = event.data.object as { metadata?: Record<string, string> | null };
  const jobId = Number(session.metadata?.jobId);
  if (!Number.isInteger(jobId) || jobId <= 0) {
    console.error("checkout.session.completed without usable jobId", {
      eventId: event.id,
    });
    // 200, damit Stripe nicht ewig wiederholt — hier hilft kein Retry.
    return NextResponse.json({ empfangen: true });
  }

  try {
    // Idempotenz ohne Datenbank: der Job-Status selbst ist die Sperre.
    const job = await getJob(jobId);
    if (DISTRIBUTED_STATUSES.includes(job.Status)) {
      console.log("Job already distributed, skipping", { jobId, status: job.Status });
      return NextResponse.json({ empfangen: true, uebersprungen: true });
    }

    // Hat eBrief eine Adresswarnung gemeldet, hängt der Job in
    // USER_CONFIRMATION_REQUESTED und lässt sich nicht distribuieren. Der
    // Nutzer hat die Adresse im UI bereits bewusst bestätigt, bevor er
    // bezahlt hat — hier wird das gegenüber eBrief nachgezogen.
    if (job.Status === "USER_CONFIRMATION_REQUESTED") {
      const docIds = (job.Documents ?? []).map((d) => d.Id);
      if (docIds.length === 0) {
        throw new Error("confirmation required but job has no documents");
      }
      await confirmDocs(docIds);
      console.log("Confirmed documents before distribution", { jobId, docIds });
    }

    await distribute(jobId);
    console.log("Job distributed", { jobId, eventId: event.id });
    return NextResponse.json({ empfangen: true });
  } catch (err) {
    // 500 sorgt dafür, dass Stripe bis zu drei Tage lang wiederholt. Das ist
    // die einzige Absicherung gegen "bezahlt, aber nicht versendet".
    console.error("PAID BUT NOT DISPATCHED — eBrief distribution failed", {
      jobId,
      eventId: event.id,
      sessionId: (event.data.object as { id?: string }).id,
      err,
    });
    return NextResponse.json({ fehler: "distribution_fehler" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Webhook lokal testen**

Mit der Stripe CLI (falls vorhanden), sonst überspringen und in Task 13 per Playwright abdecken:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Expected: Beim Auslösen von `checkout.session.completed` mit `metadata.jobId` wird der Job distribuiert; ein zweites Auslösen desselben Events meldet `uebersprungen: true`.

- [ ] **Step 3: Typprüfung und Lint**

Run: `npm run lint && npx tsc --noEmit`
Expected: keine Fehler.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/stripe/webhook/route.ts
git commit -m "Dispatch the letter from the Stripe webhook, idempotently"
```

---

### Task 11: Cleanup unbezahlter Jobs

**Files:**
- Create: `src/app/api/cron/ebrief-cleanup/route.ts`
- Modify: `vercel.json`

- [ ] **Step 1: Cleanup-Route schreiben**

`src/app/api/cron/ebrief-cleanup/route.ts`:

```ts
import { NextResponse } from "next/server";
import { deleteJob } from "@/lib/ebrief/client";
import { ebriefBaseUrl, ebriefKonfiguriert, getToken } from "@/lib/ebrief/token";
import { DISTRIBUTED_STATUSES, type EbriefJob } from "@/lib/ebrief/types";

const MAX_ALTER_MS = 24 * 60 * 60 * 1000;

/**
 * Jobs, die vorbereitet aber nie bezahlt wurden, bleiben bei eBrief liegen.
 * Sie kosten nichts (Abrechnung folgt erst auf die Distribution), aber sie
 * sollen sich nicht ansammeln.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ fehler: "nicht_autorisiert" }, { status: 401 });
  }
  if (!ebriefKonfiguriert()) {
    return NextResponse.json({ uebersprungen: true });
  }

  try {
    const token = await getToken();
    const res = await fetch(`${ebriefBaseUrl()}/Jobs/searchJobDetails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error(`searchJobDetails failed: ${res.status}`);

    const { Result } = (await res.json()) as { Result: EbriefJob[] };
    const grenze = Date.now() - MAX_ALTER_MS;

    let geloescht = 0;
    for (const job of Result ?? []) {
      if (DISTRIBUTED_STATUSES.includes(job.Status)) continue;
      if (job.Status === "USER_DELETED") continue;
      const erstellt = job.CreatedAt ? Date.parse(job.CreatedAt) : NaN;
      if (!Number.isFinite(erstellt) || erstellt > grenze) continue;

      await deleteJob(job.Id).catch((err) =>
        console.error("cleanup: delete failed", { jobId: job.Id, err })
      );
      geloescht++;
    }

    console.log("eBrief cleanup done", { geloescht });
    return NextResponse.json({ geloescht });
  } catch (err) {
    console.error("eBrief cleanup failed", err);
    return NextResponse.json({ fehler: "cleanup_fehler" }, { status: 502 });
  }
}
```

- [ ] **Step 2: Cron in `vercel.json` eintragen**

Ergänze in `vercel.json` auf oberster Ebene, direkt nach `"regions": ["fra1"],`:

```json
  "crons": [
    {
      "path": "/api/cron/ebrief-cleanup",
      "schedule": "0 3 * * *"
    }
  ],
```

- [ ] **Step 3: Typprüfung und Lint**

Run: `npm run lint && npx tsc --noEmit`
Expected: keine Fehler.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/cron/ebrief-cleanup/route.ts vercel.json
git commit -m "Clean up unpaid eBrief jobs daily"
```

---

### Task 12: Versand-UI

**Files:**
- Create: `src/components/VersandKarte.tsx`
- Modify: `src/components/Maengelanzeige.tsx` (Schritt 4)
- Modify: `src/i18n/translations.ts` (alle sechs Sprachen)

- [ ] **Step 1: Übersetzungsschlüssel ergänzen**

`npm run check:i18n` erzwingt, dass jeder Schlüssel in allen sechs Sprachen existiert. Trage diese Schlüssel in **jedem** Locale-Block in `src/i18n/translations.ts` ein (deutsche Texte als Vorlage, übrige Sprachen sinngemäß übersetzen):

```ts
    "dispatch.title": "Direkt an den Vermieter senden",
    "dispatch.subtitle": "Wir drucken und versenden für Sie — Sie müssen nichts ausdrucken.",
    "dispatch.brief": "Als Brief",
    "dispatch.einschreiben": "Als Einwurf-Einschreiben",
    "dispatch.einschreibenHint":
      "Beim Einwurf-Einschreiben wird der Einwurf in den Briefkasten dokumentiert. Es ist kein Übergabe-Einschreiben mit Unterschrift des Empfängers.",
    // Kein Steuerausweis — der Betreiber ist Kleinunternehmer nach § 19 UStG.
    "dispatch.taxNote": "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.",
    "dispatch.send": "Kostenpflichtig versenden",
    "dispatch.preparing": "Sendung wird vorbereitet...",
    "dispatch.checkAddress": "Adresse prüfen",
    "dispatch.addressWarning":
      "Die Adresse des Vermieters konnte nicht eindeutig geprüft werden. Bitte kontrollieren Sie sie, bevor Sie kostenpflichtig versenden.",
    "dispatch.showMarked": "Erkannte Adresse ansehen",
    "dispatch.error": "Der Versand ist gerade nicht möglich. Sie können die Mängelanzeige weiterhin kostenlos herunterladen.",
    "dispatch.success": "Vielen Dank — Ihre Mängelanzeige wird gedruckt und versendet. Die Bestätigung kommt per E-Mail.",
    "dispatch.cancelled": "Der Bezahlvorgang wurde abgebrochen. Es wurde nichts versendet und nichts berechnet.",
```

- [ ] **Step 2: Versand-Karte schreiben**

`src/components/VersandKarte.tsx`:

```tsx
"use client";

import { useState } from "react";
import { AlertTriangle, Send } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";
import { PRODUKTE, type ProduktId } from "@/lib/ebrief/produkte";

/**
 * produkte.ts enthält nur Konstanten und lässt sich deshalb direkt im Client
 * importieren — die Preise stehen so an genau einer Stelle im Code.
 */
interface VersandKarteProps {
  text: string;
  signatureDataUrl?: string;
  mieter: { name: string; strasse: string; plz: string; ort: string; email: string };
  vermieter: { name: string; strasse: string; plz: string; ort: string };
}

type Phase = "auswahl" | "vorbereiten" | "warnung" | "fehler";

const euro = (cent: number) =>
  (cent / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export default function VersandKarte({
  text,
  signatureDataUrl,
  mieter,
  vermieter,
}: VersandKarteProps) {
  const { t } = useTranslation();
  const [produktId, setProduktId] = useState<ProduktId>("brief");
  const [phase, setPhase] = useState<Phase>("auswahl");
  const [docId, setDocId] = useState<number | null>(null);

  /** Wartet, bis eBrief die Adressprüfung abgeschlossen hat. */
  const warteAufStatus = async (jobId: number) => {
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const res = await fetch(`/api/versand/status?jobId=${jobId}`);
      if (!res.ok) return { status: "fehler" as const, docId: null };
      const daten = (await res.json()) as {
        status: "laeuft" | "bereit" | "adresse_warnung" | "fehler";
        docId: number | null;
      };
      if (daten.status !== "laeuft") return daten;
    }
    return { status: "fehler" as const, docId: null };
  };

  const starteVersand = async (bestaetigt = false) => {
    setPhase("vorbereiten");
    try {
      const vor = await fetch("/api/versand/vorbereiten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produktId, text, signatureDataUrl, mieter, vermieter }),
      });
      if (!vor.ok) return setPhase("fehler");
      const { jobId } = (await vor.json()) as { jobId: number };

      const ergebnis = await warteAufStatus(jobId);
      if (ergebnis.status === "fehler") return setPhase("fehler");
      if (ergebnis.status === "adresse_warnung" && !bestaetigt) {
        setDocId(ergebnis.docId);
        return setPhase("warnung");
      }

      const checkout = await fetch("/api/versand/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, produktId }),
      });
      if (!checkout.ok) return setPhase("fehler");
      const { url } = (await checkout.json()) as { url: string };
      window.location.href = url;
    } catch {
      setPhase("fehler");
    }
  };

  if (phase === "fehler") {
    return (
      <div
        data-testid="dispatch-error"
        className="mt-6 flex items-start gap-3 rounded-[var(--radius-field)] border border-caution-600/20 bg-caution-50 p-4"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caution-600" aria-hidden />
        <p className="text-sm text-caution-600">{t("dispatch.error")}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-[var(--radius-field)] border border-ink-300 bg-paper-raised p-5">
      <h4 className="text-base font-bold text-ink-900">{t("dispatch.title")}</h4>
      <p className="mt-1 text-sm text-ink-500">{t("dispatch.subtitle")}</p>

      <div className="mt-4 flex flex-col gap-2">
        {(["brief", "einwurfEinschreiben"] as const).map((id) => (
          <label
            key={id}
            data-testid={`dispatch-option-${id}`}
            className="flex min-h-[3rem] cursor-pointer items-center gap-3 rounded-[var(--radius-field)] border border-ink-300 px-4 py-3"
          >
            <input
              type="radio"
              name="versandprodukt"
              checked={produktId === id}
              onChange={() => setProduktId(id)}
            />
            <span className="flex-1 text-sm text-ink-900">
              {t(id === "brief" ? "dispatch.brief" : "dispatch.einschreiben")}
            </span>
            <span className="font-semibold text-ink-900">
              {euro(PRODUKTE[id].preisCent)}
            </span>
          </label>
        ))}
      </div>

      <p className="mt-2 text-xs text-ink-500">{t("dispatch.einschreibenHint")}</p>
      <p className="mt-1 text-xs text-ink-500">{t("dispatch.taxNote")}</p>

      {phase === "warnung" && (
        <div
          data-testid="dispatch-address-warning"
          className="mt-4 rounded-[var(--radius-field)] border border-caution-600/20 bg-caution-50 p-4"
        >
          <p className="text-sm text-caution-600">{t("dispatch.addressWarning")}</p>
          {docId !== null && (
            <a
              href={`/api/versand/adressvorschau?docId=${docId}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-brand-700 underline"
            >
              {t("dispatch.showMarked")}
            </a>
          )}
        </div>
      )}

      <button
        type="button"
        data-testid="dispatch-submit"
        disabled={phase === "vorbereiten"}
        onClick={() => starteVersand(phase === "warnung")}
        className="mt-5 inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
      >
        <Send className="h-4.5 w-4.5" aria-hidden />
        {phase === "vorbereiten" ? t("dispatch.preparing") : t("dispatch.send")}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Karte in Schritt 4 einhängen**

In `src/components/Maengelanzeige.tsx`: Import ergänzen

```tsx
import VersandKarte from "./VersandKarte";
```

und im Block `{step === 4 && (` direkt **nach** dem schließenden `</div>` des Download-Kastens (dem `div` mit `border-brand-200 bg-brand-50`) einfügen:

```tsx
              <VersandKarte
                text={editedBriefText}
                signatureDataUrl={signatureData || undefined}
                mieter={{
                  name: mieter.name,
                  strasse: mieter.strasse,
                  plz: mieter.plz,
                  ort: mieter.ort,
                  email: mieter.email,
                }}
                vermieter={vermieter}
              />
```

Preise und Steuerhinweis kommen aus `produkte.ts` beziehungsweise den Übersetzungen — die Karte braucht dafür keine Props.

- [ ] **Step 4: i18n-Prüfung und Build**

Run: `npm run check:i18n && npm run lint && npm run build`
Expected: alle drei ohne Fehler.

- [ ] **Step 5: Commit**

```bash
git add src/components/VersandKarte.tsx src/components/Maengelanzeige.tsx src/i18n/translations.ts
git commit -m "Add dispatch card to the letter wizard"
```

---

### Task 13: E2E-Tests

**Files:**
- Modify: `e2e/helpers.ts`
- Create: `e2e/versand.spec.ts`

- [ ] **Step 1: Stub-Helfer ergänzen**

An `e2e/helpers.ts` anhängen:

```ts
/** Stubbt die Versand-Routen, damit kein echter eBrief-Job entsteht. */
export async function stubVersandApi(
  page: Page,
  opts: { status?: "bereit" | "adresse_warnung" | "fehler"; vorbereitenOk?: boolean } = {}
) {
  const status = opts.status ?? "bereit";
  const vorbereitenOk = opts.vorbereitenOk ?? true;

  await page.route("**/api/versand/vorbereiten", (route) =>
    vorbereitenOk
      ? route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ jobId: 4711, produktId: "brief", preisCent: 249 }),
        })
      : route.fulfill({
          status: 502,
          contentType: "application/json",
          body: JSON.stringify({ fehler: "ebrief_fehler" }),
        })
  );

  await page.route("**/api/versand/status**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status, ebriefStatus: "COMPLETED_DOCUMENTS_PROCESS", docId: 99 }),
    })
  );

  await page.route("**/api/versand/checkout", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ url: "/mietminderung?versand=stub" }),
    })
  );
}
```

- [ ] **Step 2: Tests schreiben**

`e2e/versand.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import {
  completeCheck,
  openLetterWizard,
  reachPreview,
  stubEnhanceApi,
  stubVersandApi,
} from "./helpers";

/** Führt den Assistenten bis zum Versandschritt. */
async function reachDelivery(page: import("@playwright/test").Page) {
  await reachPreview(page);
  await page.getByTestId("letter-delivery").click();
  await expect(page.getByTestId("dispatch-submit")).toBeVisible();
}

test.describe("Postversand", () => {
  test.beforeEach(async ({ page }) => {
    await stubEnhanceApi(page);
    await page.goto("/#pruefung");
    await completeCheck(page);
    await openLetterWizard(page);
  });

  test("offers both products with their prices", async ({ page }) => {
    await stubVersandApi(page);
    await reachDelivery(page);

    await expect(page.getByTestId("dispatch-option-brief")).toContainText("2,49");
    await expect(page.getByTestId("dispatch-option-einwurfEinschreiben")).toContainText("6,99");
  });

  test("does not state VAT anywhere in the dispatch card", async ({ page }) => {
    await stubVersandApi(page);
    await reachDelivery(page);

    // Ein Steuerausweis wäre nach § 14c UStG schädlich.
    const karte = page.getByTestId("dispatch-submit").locator("xpath=ancestor::div[1]");
    await expect(karte).not.toContainText("MwSt");
    await expect(karte).not.toContainText("19 %");
  });

  test("redirects to checkout when the address is accepted", async ({ page }) => {
    await stubVersandApi(page, { status: "bereit" });
    await reachDelivery(page);

    await page.getByTestId("dispatch-submit").click();
    await page.waitForURL("**/mietminderung?versand=stub", { timeout: 15000 });
  });

  test("shows a warning instead of charging when the address is doubtful", async ({ page }) => {
    await stubVersandApi(page, { status: "adresse_warnung" });
    await reachDelivery(page);

    await page.getByTestId("dispatch-submit").click();
    await expect(page.getByTestId("dispatch-address-warning")).toBeVisible({ timeout: 15000 });
    expect(page.url()).not.toContain("versand=stub");
  });

  test("keeps the free download available when eBrief is down", async ({ page }) => {
    await stubVersandApi(page, { vorbereitenOk: false });
    await reachDelivery(page);

    await page.getByTestId("dispatch-submit").click();
    await expect(page.getByTestId("dispatch-error")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("download-pdf")).toBeVisible();
  });
});
```

- [ ] **Step 3: Tests ausführen**

Run: `npx playwright test e2e/versand.spec.ts`
Expected: fünf Tests grün.

- [ ] **Step 4: Gesamtprüfung**

Run: `npm run verify`
Expected: Lint, i18n-Check, Build und die komplette E2E-Suite laufen durch.

- [ ] **Step 5: Commit**

```bash
git add e2e/helpers.ts e2e/versand.spec.ts
git commit -m "Cover the dispatch flow with end-to-end tests"
```

---

### Task 14: Rückmeldung nach der Zahlung

**Files:**
- Modify: `src/components/Maengelanzeige.tsx`
- Modify: `src/i18n/translations.ts` (falls Schlüssel aus Task 12 fehlen)

- [ ] **Step 1: Rückkehr von Stripe auswerten**

In `src/components/Maengelanzeige.tsx` nach den bestehenden `useState`-Aufrufen ergänzen:

```tsx
  const [versandErgebnis, setVersandErgebnis] = useState<"erfolg" | "abbruch" | null>(null);

  // Stripe leitet mit ?versand=erfolg|abbruch zurück. Der Parameter wird nach
  // dem Auswerten entfernt, damit ein Reload die Meldung nicht wiederholt.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wert = params.get("versand");
    if (wert !== "erfolg" && wert !== "abbruch") return;

    setVersandErgebnis(wert);
    setStep(4);
    params.delete("versand");
    const rest = params.toString();
    window.history.replaceState(
      {},
      "",
      window.location.pathname + (rest ? `?${rest}` : "") + window.location.hash
    );
  }, []);
```

- [ ] **Step 2: Meldung anzeigen**

Im Block `{step === 4 && (`, direkt nach der Überschrift `<h3 ...>{t("letter.howReceive")}</h3>` und dem folgenden `<p>`, einfügen:

```tsx
              {versandErgebnis && (
                <div
                  data-testid={`dispatch-result-${versandErgebnis}`}
                  className={`mt-4 rounded-[var(--radius-field)] p-4 text-sm ${
                    versandErgebnis === "erfolg"
                      ? "border border-signal-600/20 bg-signal-50 text-signal-600"
                      : "border border-caution-600/20 bg-caution-50 text-caution-600"
                  }`}
                >
                  {t(versandErgebnis === "erfolg" ? "dispatch.success" : "dispatch.cancelled")}
                </div>
              )}
```

- [ ] **Step 3: Prüfen**

Run: `npm run check:i18n && npm run lint && npm run build`
Expected: keine Fehler.

Manuell: `/mietminderung?versand=erfolg` aufrufen, Assistent bis Schritt 4 durchklicken — die Erfolgsmeldung erscheint und der Parameter verschwindet aus der URL.

- [ ] **Step 4: Commit**

```bash
git add src/components/Maengelanzeige.tsx src/i18n/translations.ts
git commit -m "Show the dispatch result after returning from Stripe"
```

---

## Vor dem Livegang

Diese Punkte sind bewusst nicht Teil der Tasks, weil sie Zugangsdaten oder Entscheidungen außerhalb des Codes brauchen:

- [ ] **Übersetzungen muttersprachlich prüfen lassen — mindestens Arabisch und Türkisch.** Die Versandtexte erklären einen rechtlich relevanten Schritt Menschen, die sich auf ihre eigene Sprache verlassen. Sie sind nicht maschinell übersetzt, aber auch von keinem Muttersprachler gegengelesen. Vorrang haben der Steuerhinweis und die Anweisung bei zu langer Vermieteradresse. Fachbegriffe bleiben bewusst deutsch (*Einwurf-Einschreiben*, *Übergabe-Einschreiben*, *§ 19 UStG*), weil der Mieter genau sie auf dem Postbeleg und im Gesetz wiederfindet.
- [ ] **Einheit von `DateCreatedUnix` bestätigen.** Das Feld ist seit der OpenAPI-Spezifikation bekannt (`docs/ebrief/API-SCHEMA.md`), die Spezifikation sagt aber nicht, ob es Sekunden oder Millisekunden zählt. Der Cleanup-Cron probiert beide Lesarten und verwirft jede, die außerhalb der Plausibilitätsgrenzen liegt; er löscht also nichts, was er nicht datieren kann. Die tatsächlich verwendete Einheit steht als `zeitEinheit` in jeder Löschzeile im Log.
- [ ] **Getrennte Stripe-Keys und Webhook-Secrets pro Umgebung.** eBrief-Job-Ids sind kleine fortlaufende Ganzzahlen. Teilen sich Preview- und Produktionsdeployments ein Stripe-Konto und einen Webhook-Endpunkt, ist ein Event mit `jobId: 42` aus der Preview nicht von Job 42 aus der Produktion zu unterscheiden — und der Webhook würde den falschen Brief verschicken. Getrennte Keys lösen das sauberer als jede Kennzeichnung im Code.
- [ ] **`VERSAND_TOKEN_SECRET` setzen.** Ohne die Variable verweigern alle Versandrouten den Dienst (bewusst: eine Sicherheitsmaßnahme, die sich bei fehlender Konfiguration stillschweigend abschaltet, ist schlechter als keine).
- [ ] **Format der Adressvorschau bestätigen.** Die Spezifikation beschreibt `GET /Docs/{docId}/FileWithMark` als JSON-Umschlag mit base64-Inhalt und im Summary als **PNG** der ersten Seite, nicht als PDF. `/api/versand/adressvorschau` liefert deshalb den Typ aus, den eBrief meldet. Der Spike schreibt die Datei mit der Endung, die eBrief nennt — daran ist zu sehen, was wirklich kommt.
- [ ] Nach dem Spike prüfen, ob die Annahme „committeter Job ohne Distribution kostet nichts" hält (Abbruchkriterium steht im Skriptkopf)

- [ ] Verkaufspreise festlegen und in `src/lib/ebrief/produkte.ts` setzen (einzige Stelle; die E2E-Erwartungen in `e2e/versand.spec.ts` auf „2,49" und „6,99" dann mitziehen)
- [ ] `EBRIEF_BASE_URL` in der Produktion auf `https://api.ebrief.de` stellen
- [ ] Stripe-Webhook-Endpunkt in Stripe anlegen und `STRIPE_WEBHOOK_SECRET` setzen
- [ ] `CRON_SECRET` setzen
- [ ] AGB und Widerrufsbelehrung um den kostenpflichtigen Versand ergänzen — der Download war bisher kostenlos, die bestehenden Rechtstexte unter `src/app/nutzungsbedingungen` und `src/app/widerruf` gehen von einem unentgeltlichen Angebot aus. **Das ist ein rechtlicher Punkt, kein technischer: hier ist anwaltliche Prüfung angeraten, nicht meine Einschätzung.**
- [ ] Einen echten Testbrief über die Produktionsumgebung an die eigene Adresse senden und das Druckergebnis prüfen
