"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, ExternalLink, Info, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n/LanguageContext";
import { PRODUKTE, type ProduktId } from "@/lib/ebrief/produkte";

/**
 * The paid alternative to the free download in step 4: eBrief prints the
 * Mängelanzeige and posts it to the landlord.
 *
 * `produkte.ts` is pure constants and safe to import into a client component,
 * so the prices shown here and the prices the server charges come from the
 * same place — a divergence between the two would be a price the user never
 * agreed to.
 */
/** Same shape the tenant screen validates against, so the two never disagree. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Anschrift {
  name: string;
  strasse: string;
  plz: string;
  ort: string;
}

interface VersandKarteProps {
  /** The letter as the user reviewed it — never rebuilt here. */
  text: string;
  signatureDataUrl?: string;
  mieter: Anschrift & { email: string };
  vermieter: Anschrift;
  /**
   * Writes the address back into the wizard. The tenant screen no longer
   * demands one - the free download does not need it - so dispatch has to be
   * able to ask for it here, where it is genuinely required.
   */
  onEmailChange?: (email: string) => void;
  /**
   * Takes the user back to the landlord step. eBrief's address check can only
   * be answered by correcting the address, which lives in the wizard, not here.
   */
  onAdresseKorrigieren: () => void;
}

/**
 * "vorbereiten" and "pruefen" are two waits with different causes and are kept
 * apart so the button can say which one the user is looking at.
 */
type Phase =
  | "auswahl"
  | "vorbereiten"
  | "pruefen"
  | "warnung"
  | "weiterleiten";

/** What POST /api/versand/vorbereiten hands back and the later calls need. */
interface Vorgang {
  jobId: number;
  token: string;
  /**
   * The product the job was actually created with. eBrief's tracking attribute
   * is fixed at job creation, so checking out with a different product than the
   * one prepared would charge for a registered letter and post a plain one.
   */
  produktId: ProduktId;
}

interface Hinweise {
  kopfErkannt: boolean;
  datumErkannt: boolean;
  absenderGekuerzt: boolean;
}

/** The four UI states of GET /api/versand/status, collapsed to what is done next. */
type StatusErgebnis =
  | { status: "bereit" | "adresse_warnung" }
  | { status: "fehler"; slug: string };

/** Untrusted until checked — the body is whatever came back over the wire. */
interface VorbereitenAntwort {
  jobId?: unknown;
  token?: unknown;
  hinweise?: Partial<Hinweise>;
}

const PRODUKT_IDS: ProduktId[] = ["brief", "einwurfEinschreiben"];

const POLL_INTERVALL_MS = 2000;
/**
 * eBrief's commit is asynchronous and usually settles in seconds. A minute is
 * generous; past it something is wrong and the user gets an answer instead of a
 * spinner that never stops. Nothing has been charged at this point.
 */
const POLL_FRIST_MS = 60_000;

/**
 * Per-request deadline. A request that stalls without ever erroring — a flaky
 * connection that never resets, a cold start that hangs before the headers —
 * would otherwise leave the button disabled and the spinner turning with no way
 * back short of reloading the page.
 */
const ANFRAGE_FRIST_MS = 20_000;

/**
 * Every slug the four dispatch routes can return, plus the local timeout. The
 * whitelist matters: `t()` falls back to the key itself, so an unrecognised
 * slug would otherwise put "dispatch.error.foo" in front of the user.
 */
const FEHLER_SLUGS = new Set([
  "versand_nicht_konfiguriert",
  "zu_viele_anfragen",
  "unvollstaendig",
  "anschrift_zu_lang",
  "pdf_fehler",
  "ebrief_fehler",
  "preis_unplausibel",
  "token_ungueltig",
  "jobId_ungueltig",
  "kein_dokument",
  "bereits_versendet",
  "versand_nicht_moeglich",
  "checkout_fehler",
  "zeitueberschreitung",
  "zustimmung_fehlt",
]);

/** Both declarations, as they travel to the checkout route. */
interface Erklaerungen {
  verlangtSofortigenBeginn: boolean;
  kenntErloeschen: boolean;
}

/**
 * Prices are always shown in German formatting. The amount is charged in euros
 * by a German operator, and a locale-specific rendering — Arabic-Indic digits,
 * say — would make the figure on the card and the figure on the Stripe page
 * look like different numbers.
 */
const euro = (cent: number) =>
  (cent / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

const warte = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Thrown when a request ran into its deadline, so callers can say so. */
class FristAbgelaufen extends Error {}

/**
 * Runs one request under a deadline. The whole exchange is inside it, headers
 * and body both: clearing the timer once the response object exists would leave
 * a stalled body read uncovered, which hangs just as badly as a stalled request.
 */
async function mitFrist<T>(
  ms: number,
  ausfuehren: (signal: AbortSignal) => Promise<T>
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await ausfuehren(controller.signal);
  } catch (err) {
    // An abort surfaces as a DOMException that says nothing useful. Translated
    // here so every call site can map it onto a slug the user can act on.
    if (controller.signal.aborted) throw new FristAbgelaufen();
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/** An error body is JSON with a slug, but a proxy may answer with anything. */
async function leseFehlerSlug(res: Response): Promise<string | undefined> {
  try {
    const daten = (await res.json()) as { fehler?: unknown };
    return typeof daten?.fehler === "string" ? daten.fehler : undefined;
  } catch {
    return undefined;
  }
}

export default function VersandKarte({
  text,
  signatureDataUrl,
  mieter,
  vermieter,
  onEmailChange,
  onAdresseKorrigieren,
}: VersandKarteProps) {
  const { t } = useTranslation();
  const [produktId, setProduktId] = useState<ProduktId>("brief");
  const [phase, setPhase] = useState<Phase>("auswahl");
  const [fehlerSlug, setFehlerSlug] = useState<string | null>(null);
  const [hinweise, setHinweise] = useState<Hinweise | null>(null);
  const [vorgang, setVorgang] = useState<Vorgang | null>(null);
  /**
   * The two declarations under § 356 Abs. 5 Nr. 2 BGB. Two states and not one
   * flag with two labels: lit. a and lit. c are separate declarations, and the
   * order record has to show that each was made on its own.
   *
   * Both unchecked by default and never pre-selected — a pre-ticked box is not
   * the express declaration the provision asks for, and would make the whole
   * thing worthless.
   */
  const [verlangtSofortigenBeginn, setVerlangtSofortigenBeginn] = useState(false);
  const [kenntErloeschen, setKenntErloeschen] = useState(false);

  /**
   * The polling loop outlives a step change. Without this the loop would keep
   * fetching — and keep writing state — after the card is gone.
   */
  const aktiv = useRef(true);
  useEffect(() => {
    aktiv.current = true;
    return () => {
      aktiv.current = false;
    };
  }, []);

  /**
   * Ticking a box clears a complaint about the boxes.
   *
   * Unreachable through the UI as it stands — the order button requires both
   * declarations, so the route cannot answer `zustimmung_fehlt` to anyone who
   * got here honestly. It stays because the alternative is an error message
   * that outlives the thing it complains about, and because the gate and this
   * handler are free to drift apart later.
   */
  const erklaere = (setzen: (an: boolean) => void) => (an: boolean) => {
    setzen(an);
    if (an && fehlerSlug === "zustimmung_fehlt") setFehlerSlug(null);
  };

  const fehlerText = () => {
    // Only null means "no error". An empty slug is what a dropped connection or
    // an unreadable body leaves behind, and it must still produce a sentence —
    // an alert box with a warning icon and no text says nothing at all.
    if (fehlerSlug === null) return "";
    return FEHLER_SLUGS.has(fehlerSlug)
      ? t(`dispatch.error.${fehlerSlug}`)
      : t("dispatch.error.allgemein");
  };

  /** Polls until eBrief reports something other than "laeuft", or time is up. */
  const warteAufStatus = useCallback(
    async (job: Vorgang): Promise<StatusErgebnis> => {
      const frist = Date.now() + POLL_FRIST_MS;
      while (Date.now() < frist) {
        await warte(POLL_INTERVALL_MS);
        if (!aktiv.current) return { status: "fehler", slug: "abgebrochen" };

        // Never longer than what is left of the overall deadline: a single
        // stalled poll must not be able to outlive it.
        const rest = frist - Date.now();
        if (rest <= 0) break;

        try {
          const ergebnis = await mitFrist<StatusErgebnis | null>(
            Math.min(ANFRAGE_FRIST_MS, rest),
            async (signal) => {
              const res = await fetch(
                `/api/versand/status?jobId=${encodeURIComponent(
                  String(job.jobId)
                )}&token=${encodeURIComponent(job.token)}`,
                { signal }
              );
              if (!res.ok) {
                return {
                  status: "fehler" as const,
                  slug: (await leseFehlerSlug(res)) ?? "",
                };
              }
              const daten = (await res.json()) as { status?: unknown };
              if (
                daten.status === "bereit" ||
                daten.status === "adresse_warnung"
              ) {
                return { status: daten.status };
              }
              if (daten.status === "fehler") {
                return { status: "fehler" as const, slug: "ebrief_fehler" };
              }
              // Anything else means eBrief is still working — keep polling.
              return null;
            }
          );
          if (ergebnis) return ergebnis;
        } catch {
          // One failed or stalled poll is not the end of the wait: the job is
          // committed either way, and the next iteration asks again. Only the
          // overall deadline below gives up.
        }
      }
      return { status: "fehler", slug: "zeitueberschreitung" };
    },
    []
  );

  /**
   * Opens the Stripe payment page for an already prepared job.
   *
   * The § 356 declarations travel as an argument rather than being read from
   * state: what is sent has to be what the user had declared at the moment
   * they ordered, not whatever the component holds by the time the request
   * goes out. As the callback is also memoised with an empty dependency list,
   * reading state here would in fact capture the initial `false` and refuse
   * every payment — but the argument would be right even without that.
   */
  const bezahlen = useCallback(
    async (job: Vorgang, zurueck: Phase, erklaerungen: Erklaerungen) => {
      setPhase("weiterleiten");
      try {
        const ergebnis = await mitFrist<{ url: string } | { fehler: string }>(
          ANFRAGE_FRIST_MS,
          async (signal) => {
            const res = await fetch("/api/versand/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jobId: job.jobId,
                produktId: job.produktId,
                token: job.token,
                verlangtSofortigenBeginn: erklaerungen.verlangtSofortigenBeginn,
                kenntErloeschen: erklaerungen.kenntErloeschen,
              }),
              signal,
            });
            if (!res.ok) {
              return { fehler: (await leseFehlerSlug(res)) ?? "" };
            }
            const daten = (await res.json()) as { url?: unknown };
            return typeof daten.url === "string"
              ? { url: daten.url }
              : { fehler: "checkout_fehler" };
          }
        );
        if (!aktiv.current) return;
        if (!("url" in ergebnis)) {
          setFehlerSlug(ergebnis.fehler);
          setPhase(zurueck);
          return;
        }
        // Leaving the site: the phase stays "weiterleiten" so nothing looks
        // clickable while the browser navigates away.
        window.location.href = ergebnis.url;
      } catch {
        // A deadline lands here too, and "checkout_fehler" already says the
        // right thing: the payment page did not open and nothing was charged.
        if (!aktiv.current) return;
        setFehlerSlug("checkout_fehler");
        setPhase(zurueck);
      }
    },
    []
  );

  const starteVersand = async () => {
    setFehlerSlug(null);
    setHinweise(null);
    setPhase("vorbereiten");
    try {
      const antwort = await mitFrist<
        { daten: VorbereitenAntwort } | { fehler: string }
      >(ANFRAGE_FRIST_MS, async (signal) => {
        const res = await fetch("/api/versand/vorbereiten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            produktId,
            text,
            signatureDataUrl,
            mieter,
            vermieter,
          }),
          signal,
        });
        if (!res.ok) return { fehler: (await leseFehlerSlug(res)) ?? "" };
        return { daten: (await res.json()) as VorbereitenAntwort };
      });
      if (!aktiv.current) return;
      if (!("daten" in antwort)) {
        setFehlerSlug(antwort.fehler);
        setPhase("auswahl");
        return;
      }

      const { daten } = antwort;
      if (typeof daten.jobId !== "number" || typeof daten.token !== "string") {
        if (!aktiv.current) return;
        setFehlerSlug("");
        setPhase("auswahl");
        return;
      }
      const job: Vorgang = {
        jobId: daten.jobId,
        token: daten.token,
        produktId,
      };
      if (!aktiv.current) return;
      setVorgang(job);
      setHinweise({
        kopfErkannt: daten.hinweise?.kopfErkannt !== false,
        datumErkannt: daten.hinweise?.datumErkannt !== false,
        absenderGekuerzt: daten.hinweise?.absenderGekuerzt === true,
      });
      setPhase("pruefen");

      const ergebnis = await warteAufStatus(job);
      if (!aktiv.current) return;
      if (ergebnis.status === "fehler") {
        setFehlerSlug(ergebnis.slug);
        setPhase("auswahl");
        return;
      }
      if (ergebnis.status === "adresse_warnung") {
        setPhase("warnung");
        return;
      }
      await bezahlen(job, "auswahl", { verlangtSofortigenBeginn, kenntErloeschen });
    } catch (err) {
      if (!aktiv.current) return;
      // A deadline gets its own message; anything else — a dropped connection,
      // an unreadable body — falls through to the generic one.
      setFehlerSlug(err instanceof FristAbgelaufen ? "zeitueberschreitung" : "");
      setPhase("auswahl");
    }
  };

  /**
   * Switching the product invalidates a prepared job — its tracking attribute
   * cannot be changed after the fact — so the flow starts over.
   */
  const waehleProdukt = (id: ProduktId) => {
    setProduktId(id);
    setVorgang(null);
    setHinweise(null);
    setFehlerSlug(null);
    setPhase("auswahl");
  };

  const beschaeftigt =
    phase === "vorbereiten" || phase === "pruefen" || phase === "weiterleiten";

  const buttonLabel = () => {
    if (phase === "vorbereiten") return t("dispatch.preparing");
    if (phase === "pruefen") return t("dispatch.checkingAddress");
    if (phase === "weiterleiten") return t("dispatch.redirecting");
    if (phase === "warnung") return t("dispatch.confirmSend");
    return t("dispatch.send");
  };

  const offeneHinweise = hinweise
    ? [
        !hinweise.kopfErkannt ? "kopf" : null,
        !hinweise.datumErkannt ? "datum" : null,
        hinweise.absenderGekuerzt ? "absender" : null,
      ].filter((k): k is string => k !== null)
    : [];

  return (
    <div
      data-testid="dispatch-card"
      className="mt-6 rounded-field border border-ink-200 bg-paper-raised p-4 sm:p-5"
    >
      <h4 className="text-base font-bold text-ink-900">{t("dispatch.title")}</h4>
      <p className="mt-1 text-sm text-ink-500">{t("dispatch.subtitle")}</p>

      <fieldset className="mt-4" disabled={beschaeftigt}>
        <legend className="mb-2 text-sm font-medium text-ink-700">
          {t("dispatch.chooseProduct")}
        </legend>
        <div className="flex flex-col gap-2">
          {PRODUKT_IDS.map((id) => (
            <label
              key={id}
              className={`flex min-h-[3rem] cursor-pointer items-center gap-3 rounded-field border px-3 py-3 transition-colors sm:px-4 ${
                produktId === id
                  ? "border-brand-500 bg-brand-50"
                  : "border-ink-200 hover:bg-paper-sunken"
              }`}
            >
              <input
                type="radio"
                name="versandprodukt"
                data-testid={`dispatch-option-${id}`}
                value={id}
                checked={produktId === id}
                onChange={() => waehleProdukt(id)}
                className="h-5 w-5 shrink-0 border-ink-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="flex-1 text-sm font-medium text-ink-900">
                {t(id === "brief" ? "dispatch.brief" : "dispatch.einschreiben")}
              </span>
              <span className="shrink-0 text-sm font-semibold text-ink-900">
                {euro(PRODUKTE[id].preisCent)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="mt-2.5 text-xs leading-relaxed text-ink-500">
        {t("dispatch.einschreibenHint")}
      </p>
      {/*
        § 19 UStG: the operator is a small business and may not state VAT. This
        line is the statement that replaces it and must never become an "inkl.
        MwSt." — an unwarranted tax statement is owed under § 14c UStG.
      */}
      <p className="mt-1 text-xs leading-relaxed text-ink-500">
        {t("dispatch.taxNote")}
      </p>

      {offeneHinweise.length > 0 && (
        <div
          data-testid="dispatch-hints"
          className="mt-4 flex items-start gap-2.5 rounded-field border border-caution-600/20 bg-caution-50 p-3.5"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-caution-600" aria-hidden />
          <ul className="space-y-1 text-sm text-caution-600">
            {offeneHinweise.map((k) => (
              <li key={k}>{t(`dispatch.hint.${k}`)}</li>
            ))}
          </ul>
        </div>
      )}

      {phase === "warnung" && vorgang && (
        <div
          data-testid="dispatch-address-warning"
          className="mt-4 rounded-field border border-caution-600/20 bg-caution-50 p-3.5"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-caution-600"
              aria-hidden
            />
            <p className="text-sm text-caution-600">
              {t("dispatch.addressWarning")}
            </p>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <a
              data-testid="dispatch-address-preview"
              href={`/api/versand/adressvorschau?jobId=${encodeURIComponent(
                String(vorgang.jobId)
              )}&token=${encodeURIComponent(vorgang.token)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[2.75rem] items-center gap-1.5 text-sm font-semibold text-brand-700 underline"
            >
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
              {t("dispatch.showMarked")}
            </a>
            <button
              type="button"
              data-testid="dispatch-fix-address"
              onClick={onAdresseKorrigieren}
              className="inline-flex min-h-[2.75rem] items-center text-sm font-semibold text-brand-700 underline"
            >
              {t("dispatch.fixAddress")}
            </button>
          </div>
        </div>
      )}

      {fehlerSlug !== null && (
        <div
          data-testid="dispatch-error"
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-field border border-alert-600/20 bg-alert-50 p-3.5"
        >
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0 text-alert-600"
            aria-hidden
          />
          <p className="text-sm text-alert-600">{fehlerText()}</p>
        </div>
      )}

      {/*
        Asked at the point of need rather than four screens earlier: the
        confirmation and the tracking mail have to go somewhere, and
        /api/versand/vorbereiten refuses a job without an address.
      */}
      {onEmailChange && !EMAIL_PATTERN.test(mieter.email) && (
        <div className="mt-5">
          <label
            htmlFor="dispatch-email"
            className="mb-1.5 block text-sm font-medium text-ink-700"
          >
            {t("dispatch.emailLabel")}
            <span className="text-alert-600"> *</span>
          </label>
          <input
            id="dispatch-email"
            data-testid="dispatch-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={mieter.email}
            disabled={beschaeftigt}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="max@beispiel.de"
            className="w-full min-h-[3rem] rounded-field border border-ink-300 bg-paper-raised px-4 py-3 text-ink-900 transition-colors placeholder:text-ink-300 focus:border-brand-500 focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-ink-500">{t("dispatch.emailWhy")}</p>
        </div>
      )}

      {/*
        § 356 Abs. 5 Nr. 2 BGB. Two separate boxes, both unticked, sitting
        directly above the order button and gating it: lit. a is the express
        request to start early, lit. c the separate acknowledgement that the
        right expires on completion. One tick for both does not satisfy the
        provision, and the declarations have to be made before the order, not
        after. The link opens in a new tab so reading the Widerrufsbelehrung
        does not destroy the letter draft, which lives in React state and does
        not survive navigation.
      */}
      {/*
        Disabled on the fieldset, as with the product fieldset above: a disabled
        fieldset disables the controls inside it natively, and it deliberately
        leaves the Widerrufsbelehrung link alone — an anchor is not a form
        control, so it stays clickable while the payment page is opening.
      */}
      <fieldset className="mt-5 flex flex-col gap-2.5" disabled={beschaeftigt}>
        {/*
          Named for screen readers but not shown: the two boxes are one
          precondition block, and an unnamed fieldset announces as a group
          with no purpose. Visually the sentences speak for themselves and the
          card has no room for another heading.
        */}
        <legend className="sr-only">{t("dispatch.consentHeading")}</legend>
        <Erklaerungskasten
          testId="dispatch-consent-start"
          gewaehlt={verlangtSofortigenBeginn}
          onToggle={erklaere(setVerlangtSofortigenBeginn)}
          text={t("dispatch.consentStart")}
        />
        <Erklaerungskasten
          testId="dispatch-consent-expiry"
          gewaehlt={kenntErloeschen}
          onToggle={erklaere(setKenntErloeschen)}
          text={t("dispatch.consentExpiry")}
        />
        <p className="text-xs text-ink-500">
          <a
            href="/widerruf"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brand-700 underline"
          >
            {t("dispatch.consentLink")}
          </a>
        </p>
      </fieldset>

      <Button
        type="button"
        data-testid="dispatch-submit"
        // Never let the browser ask for a job the route will refuse.
        disabled={
          beschaeftigt ||
          !verlangtSofortigenBeginn ||
          !kenntErloeschen ||
          !EMAIL_PATTERN.test(mieter.email)
        }
        onClick={() => {
          if (phase === "warnung" && vorgang) {
            void bezahlen(vorgang, "warnung", {
              verlangtSofortigenBeginn,
              kenntErloeschen,
            });
            return;
          }
          void starteVersand();
        }}
        className="mt-3 w-full max-sm:px-4 text-center"
      >
        {beschaeftigt ? (
          <span
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white border-t-transparent"
            aria-hidden
          />
        ) : (
          <Send className="h-4.5 w-4.5 shrink-0 rtl:-scale-x-100" aria-hidden />
        )}
        <span>{buttonLabel()}</span>
      </Button>

      {/* Announced separately, so a screen reader hears the wait, not just sees it. */}
      <p className="sr-only" aria-live="polite">
        {beschaeftigt ? buttonLabel() : ""}
      </p>

      <p className="mt-2.5 text-center text-xs text-ink-500">
        {t("dispatch.freeStays")}
      </p>
    </div>
  );
}

/**
 * One declaration, one box.
 *
 * Extracted so the two are structurally identical: if they ever drifted apart
 * visually, the more prominent one would read as the real declaration and the
 * other as fine print — which is exactly what § 356 Abs. 5 Nr. 2 BGB does not
 * allow. Design tokens only; raw Tailwind palettes are an ESLint error here.
 */
function Erklaerungskasten({
  testId,
  gewaehlt,
  onToggle,
  text,
}: {
  testId: string;
  gewaehlt: boolean;
  onToggle: (an: boolean) => void;
  text: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-field border border-ink-200 p-3.5">
      <input
        type="checkbox"
        data-testid={testId}
        checked={gewaehlt}
        onChange={(e) => onToggle(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
      />
      <span className="text-xs leading-relaxed text-ink-600">{text}</span>
    </label>
  );
}
