"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
} from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { vertragsbezeichnung } from "@/lib/widerrufstext";

/**
 * The withdrawal button under § 356a BGB.
 *
 * Mandatory since 19.6.2026: a button "Vertrag widerrufen" leading to a form
 * that is completed with "Widerruf bestätigen". Both labels are prescribed by
 * statute and must not be reworded — not for style, not for tone, not to match
 * the rest of the page.
 *
 * The duty applies here too, where the right expires within minutes because we
 * print immediately: it attaches to the possibility of withdrawal, not to its
 * likelihood.
 *
 * German, like the rest of this page. The legal texts are not translated —
 * only the German version is the binding one, and LegalPage says so to
 * visitors reading in another language.
 */

const FELD_KLASSEN =
  "w-full min-h-[3rem] rounded-field border border-ink-300 bg-paper-raised px-4 py-3 text-ink-900 transition-colors placeholder:text-ink-300 focus:border-brand-500 focus:outline-none";

/**
 * The route truncates every field at 500 characters. Enforcing the same limit
 * here means a long note is refused at the keyboard instead of being silently
 * clipped out of the Abs. 4 confirmation — that text is part of the user's
 * declaration, and losing a piece of it without saying so is not acceptable.
 */
const ANMERKUNG_MAX = 500;

const AUSWEICHTEXT =
  "Der Widerruf konnte nicht übermittelt werden. Bitte schreiben Sie uns stattdessen eine E-Mail an " +
  `${site.operator.email} — auch das ist eine wirksame Widerrufserklärung.`;

/**
 * 429 needs its own wording. The generic text sends the user to the mailbox,
 * which is the wrong instruction here: nothing is broken, the request was
 * merely too frequent, and the answer is to wait rather than to switch channel.
 */
const ZU_HAEUFIG =
  "Zu viele Versuche in kurzer Zeit. Bitte warten Sie einen Moment und senden Sie den Widerruf dann noch einmal.";

/**
 * The lifecycle, as one value.
 *
 * Three independent booleans could express states that mean nothing — sent and
 * in-flight at once, in-flight while closed — and the reader has to work out
 * which combinations are real. A single phase makes the impossible ones
 * unrepresentable.
 */
type Phase = "zu" | "offen" | "sendet" | "gesendet";

export default function WiderrufButton() {
  const [phase, setPhase] = useState<Phase>("zu");
  const [fehler, setFehler] = useState("");
  const [formular, setFormular] = useState({
    email: "",
    name: "",
    auftragsnummer: "",
    anmerkung: "",
  });
  const bestaetigungRef = useRef<HTMLDivElement>(null);

  /**
   * Move focus onto the confirmation once it appears.
   *
   * Not stray: submitting unmounts the whole form, so focus would otherwise
   * fall back to <body> and a screen-reader user would hear nothing at the one
   * moment that matters — the receipt of a legally significant declaration.
   * The `role="status"` on the box announces it; the focus move also puts the
   * caret somewhere sensible for anyone navigating by keyboard.
   */
  useEffect(() => {
    if (phase === "gesendet") bestaetigungRef.current?.focus();
  }, [phase]);

  const aendern =
    (feld: keyof typeof formular) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormular((alt) => ({ ...alt, [feld]: event.target.value }));

  /**
   * Leaving the form drops the error with it. An error belongs to the one
   * attempt that produced it; carrying it across a close and a reopen would
   * show — and, through `role="alert"`, re-announce — a failure the user has
   * not repeated.
   */
  function schliessen() {
    setPhase("zu");
    setFehler("");
  }

  async function bestaetigen() {
    setPhase("sendet");
    setFehler("");
    try {
      const antwort = await fetch("/api/widerruf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formular),
      });
      if (!antwort.ok) {
        setFehler(antwort.status === 429 ? ZU_HAEUFIG : AUSWEICHTEXT);
        setPhase("offen");
        return;
      }
      setPhase("gesendet");
    } catch {
      setFehler(AUSWEICHTEXT);
      setPhase("offen");
    }
  }

  if (phase === "gesendet") {
    return (
      <div
        ref={bestaetigungRef}
        data-testid="widerruf-eingegangen"
        role="status"
        tabIndex={-1}
        className="rounded-field border border-brand-200 bg-brand-50 p-5 text-sm leading-relaxed text-brand-900"
      >
        <p className="font-semibold">Ihr Widerruf ist bei uns eingegangen.</p>
        <p className="mt-2">
          Ihre Frist ist mit dem Absenden gewahrt. Sie erhalten unverzüglich
          eine Bestätigung per E-Mail; sie enthält den Inhalt Ihrer Erklärung
          sowie Datum und Uhrzeit ihres Eingangs. Bewahren Sie sie auf.
        </p>
      </div>
    );
  }

  if (phase === "zu") {
    return (
      <div className="flex flex-col gap-2">
        {/*
          § 356a Abs. 1 BGB: the function must be labelled „gut lesbar mit
          ‚Vertrag widerrufen' oder einer anderen gleichbedeutenden eindeutigen
          Formulierung". An equivalent unambiguous wording is therefore allowed
          — but the statutory one needs no argument, and anything else invites
          one. Do not reword it.
        */}
        <Button
          type="button"
          data-testid="widerruf-oeffnen"
          onClick={() => setPhase("offen")}
          className="w-full sm:w-auto"
        >
          Vertrag widerrufen
        </Button>
        <p className="text-xs text-ink-500">
          Beachten Sie: Haben wir Ihre Mängelanzeige bereits zur Post gegeben,
          ist Ihr Widerrufsrecht erloschen.
        </p>
      </div>
    );
  }

  const laeuft = phase === "sendet";

  return (
    <div className="rounded-field border border-ink-200 bg-paper-sunken p-5 sm:p-6">
      {/*
        The contract designation § 356a Abs. 2 BGB asks for. Shown rather than
        asked for: there is only one paid service, so making the consumer name
        it would be a question with one right answer and a chance to get it
        wrong. It has to stay visible either way.
      */}
      <p className="text-sm text-ink-600">Vertrag: {vertragsbezeichnung}</p>

      {/*
        A real form, so Enter submits. This is a control the statute exists to
        make easy to use; requiring a mouse to finish it would work against
        that.
      */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void bestaetigen();
        }}
      >
        <div className="mt-5 flex flex-col gap-4">
          <Feld
            data-testid="widerruf-email"
            label="Ihre E-Mail-Adresse"
            hinweis="Die Adresse, mit der Sie bestellt haben. Dorthin geht die Bestätigung."
            type="email"
            autoComplete="email"
            inputMode="email"
            value={formular.email}
            onChange={aendern("email")}
          />
          <Feld
            data-testid="widerruf-name"
            label="Ihr Name"
            autoComplete="name"
            value={formular.name}
            onChange={aendern("name")}
          />
          <Feld
            data-testid="widerruf-auftragsnummer"
            label="Auftragsnummer (falls zur Hand)"
            hinweis="Sie steht in unserer Bestellbestätigung. Ohne sie geht es auch."
            value={formular.auftragsnummer}
            onChange={aendern("auftragsnummer")}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink-800">
              Anmerkung (freiwillig)
            </span>
            <textarea
              data-testid="widerruf-anmerkung"
              rows={3}
              maxLength={ANMERKUNG_MAX}
              value={formular.anmerkung}
              onChange={aendern("anmerkung")}
              className={FELD_KLASSEN}
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {/*
            § 356a Abs. 3 BGB: the confirmation function must be labelled „gut
            lesbar und mit ‚Widerruf bestätigen' oder einer anderen
            gleichbedeutenden eindeutigen Formulierung". So an equivalent
            wording is permitted — „Einen Moment …", which an earlier version
            swapped in while the request was in flight, is not one. It means
            something else entirely, and a screenshot taken mid-request would
            show a statutory control that does not say what it confirms.

            The spinner carries the pending state instead, and
            e2e/widerruf.spec.ts holds the label in place through the request.
          */}
          <Button
            type="submit"
            data-testid="widerruf-bestaetigen"
            disabled={laeuft || !formular.email.trim()}
            aria-busy={laeuft}
          >
            {laeuft && (
              <span
                className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden
              />
            )}
            <span>Widerruf bestätigen</span>
          </Button>
          {/* Explicitly not a submit button, or cancelling would send. */}
          <Button type="button" variant="secondary" onClick={schliessen}>
            Abbrechen
          </Button>
        </div>

        {fehler && (
          <p
            data-testid="widerruf-fehler"
            role="alert"
            className="mt-4 text-sm text-alert-600"
          >
            {fehler}
          </p>
        )}
      </form>
    </div>
  );
}

/**
 * A labelled text input. Everything except the label and the hint is a plain
 * input attribute, so it is spread through rather than relayed one prop at a
 * time — relaying is how a field ends up unable to accept the one attribute it
 * needs.
 */
function Feld({
  label,
  hinweis,
  ...rest
}: { label: string; hinweis?: string } & ComponentPropsWithoutRef<"input">) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      <input {...rest} className={FELD_KLASSEN} />
      {hinweis && <span className="text-xs text-ink-500">{hinweis}</span>}
    </label>
  );
}
