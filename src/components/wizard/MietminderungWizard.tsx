"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import FormCard from "@/components/FormCard";
import TrustChips from "@/components/TrustChips";
import FooterActions from "@/components/wizard/FooterActions";
import WizardStepper from "@/components/wizard/WizardStepper";
import { WizardProvider, type WizardContextValue } from "@/components/wizard/WizardContext";
import {
  flowStore,
  loescheFlow,
  schreibeFlow,
  type FlowState,
} from "@/components/wizard/flowState";
import {
  ANZAHL_ANSPRUCHSFRAGEN,
  LETZTER_SCHRITT,
  SCREEN,
  screenLabelKey,
} from "@/components/wizard/screens";
import NichtBerechtigt from "@/components/wizard/screens/NichtBerechtigt";
import AnspruchsfrageScreen from "@/components/wizard/screens/AnspruchsfrageScreen";
import MaengelScreen from "@/components/wizard/screens/MaengelScreen";
import MieteScreen from "@/components/wizard/screens/MieteScreen";
import ErgebnisScreen from "@/components/wizard/screens/ErgebnisScreen";
import MieterScreen from "@/components/wizard/screens/MieterScreen";
import VermieterScreen from "@/components/wizard/screens/VermieterScreen";
import BeschreibungScreen from "@/components/wizard/screens/BeschreibungScreen";
import FristScreen from "@/components/wizard/screens/FristScreen";
import VorschauScreen from "@/components/wizard/screens/VorschauScreen";
import FertigScreen from "@/components/wizard/screens/FertigScreen";
import { eligibilityQuestions } from "@/data/maengel";
import type { Mangel } from "@/data/maengel";
import { alleMaengel } from "@/lib/mangelIndex";
import { mangelDescKey, mangelLabelKey } from "@/i18n/content";
import { useTranslation } from "@/i18n/LanguageContext";
import { generateBriefText } from "@/lib/brief/generateBriefText";
import { fristDatum as berechneFrist, fristVorschlag } from "@/lib/brief/frist";
import type { MangelDetail, MieterDaten, VermieterDaten } from "@/lib/brief/generateBriefText";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LEERES_DETAIL: MangelDetail = { raum: "", seit: "", beschreibung: "" };

/** Matches `[id] { scroll-margin-top: 5.5rem }` in globals.css. */
const HEADER_ABSTAND = 88;

/**
 * The whole journey, from "do I have a claim" to a finished defect notice.
 *
 * One card, one progress bar, one anchor. It used to be two page sections:
 * finishing the check scrolled the reader a screen height down into a second
 * card whose bar started again at nought, which read as a different tool
 * rather than as step nine of the same task.
 */
export default function MietminderungWizard() {
  const state = useSyncExternalStore(
    flowStore.subscribe,
    flowStore.getSnapshot,
    flowStore.getServerSnapshot
  );
  const { t, tc } = useTranslation();

  const [selectedKategorie, setSelectedKategorie] = useState<string | null>(null);
  const [anreicherungLaeuft, setAnreicherungLaeuft] = useState(false);
  const anreicherung = useRef<Promise<void> | null>(null);

  const kartenRef = useRef<HTMLDivElement>(null);
  const ueberschrift = useRef<HTMLElement | null>(null);
  const ersterRender = useRef(true);

  const setState = useCallback(
    (patch: Partial<FlowState>) => schreibeFlow({ ...state, ...patch }),
    [state]
  );

  /* ------------------------------------------------------------- navigation */

  const gehZu = useCallback(
    (screen: number) => {
      const ziel = Math.max(0, Math.min(screen, LETZTER_SCHRITT));
      setState({ screen: ziel, maxScreen: Math.max(state.maxScreen, ziel) });
    },
    [setState, state.maxScreen]
  );

  const weiter = useCallback(() => gehZu(state.screen + 1), [gehZu, state.screen]);
  const zurueck = useCallback(() => gehZu(state.screen - 1), [gehZu, state.screen]);

  /**
   * Move the reader as little as possible.
   *
   * The old flow waited 100 ms and then smooth-scrolled a whole section. Here
   * nothing moves unless the card has genuinely left the comfortable band -
   * which, after answering a question, it has not. Focus goes to the new
   * heading either way so a screen reader is told what changed.
   */
  useEffect(() => {
    if (ersterRender.current) {
      ersterRender.current = false;
      return;
    }
    ueberschrift.current?.focus({ preventScroll: true });

    const karte = kartenRef.current;
    if (!karte) return;
    const oben = karte.getBoundingClientRect().top;
    const zuHoch = oben < HEADER_ABSTAND - 8;
    const zuTief = oben > window.innerHeight * 0.5;
    if (!zuHoch && !zuTief) return;

    const reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: window.scrollY + oben - HEADER_ABSTAND,
      behavior: reduziert ? "auto" : "smooth",
    });
  }, [state.screen]);

  const ueberschriftRef = useCallback((el: HTMLElement | null) => {
    ueberschrift.current = el;
  }, []);

  /* ---------------------------------------------------------------- answers */

  const waehleAntwort = useCallback(
    (frageId: string, wert: string) =>
      setState({ antworten: { ...state.antworten, [frageId]: wert } }),
    [setState, state.antworten]
  );

  const bestaetigeAntwort = useCallback(
    (frageId: string, wert: string, eligible: boolean | null) => {
      const antworten = { ...state.antworten, [frageId]: wert };
      if (eligible === false) {
        schreibeFlow({ ...state, antworten, notEligibleQuestionId: frageId });
        return;
      }
      const naechste = state.eligibilityStep + 1;
      schreibeFlow({
        ...state,
        antworten,
        notEligibleQuestionId: null,
        eligibilityStep: Math.min(naechste, ANZAHL_ANSPRUCHSFRAGEN - 1),
        screen: naechste >= ANZAHL_ANSPRUCHSFRAGEN ? SCREEN.MAENGEL : naechste,
        maxScreen: Math.max(state.maxScreen, naechste),
      });
    },
    [state]
  );

  const zurueckZurFrage = useCallback(() => {
    const vorige = Math.max(0, state.eligibilityStep - 1);
    setState({ eligibilityStep: vorige, screen: vorige });
  }, [setState, state.eligibilityStep]);

  const neuStarten = useCallback(() => {
    loescheFlow();
    setSelectedKategorie(null);
  }, []);

  /* ---------------------------------------------------------------- defects */

  const selectedMaengel = useMemo(
    () =>
      state.selectedMangelIds
        .map((id) => alleMaengel.find((e) => e.mangel.id === id)?.mangel)
        .filter((m): m is Mangel => Boolean(m)),
    [state.selectedMangelIds]
  );

  const toggleMangel = useCallback(
    (mangel: Mangel) => {
      const drin = state.selectedMangelIds.includes(mangel.id);
      setState({
        selectedMangelIds: drin
          ? state.selectedMangelIds.filter((id) => id !== mangel.id)
          : [...state.selectedMangelIds, mangel.id],
      });
    },
    [setState, state.selectedMangelIds]
  );

  /* ------------------------------------------------------------------ money */

  const quoteMin = Math.min(
    selectedMaengel.reduce((s, m) => s + m.minderung_min, 0),
    100
  );
  const quoteMax = Math.min(
    selectedMaengel.reduce((s, m) => s + m.minderung_max, 0),
    100
  );
  const quoteTypisch = Math.min(
    selectedMaengel.reduce((s, m) => s + m.minderung_typical, 0),
    100
  );
  const miete = parseFloat(state.bruttowarmmiete) || 0;

  /* ------------------------------------------------------------------ forms */

  const setMieter = useCallback(
    (patch: Partial<MieterDaten>) => setState({ mieter: { ...state.mieter, ...patch } }),
    [setState, state.mieter]
  );
  const setVermieter = useCallback(
    (patch: Partial<VermieterDaten>) =>
      setState({ vermieter: { ...state.vermieter, ...patch } }),
    [setState, state.vermieter]
  );
  const setMangelDetail = useCallback(
    (mangelId: string, patch: Partial<MangelDetail>) =>
      setState({
        mangelDetails: {
          ...state.mangelDetails,
          [mangelId]: { ...LEERES_DETAIL, ...state.mangelDetails[mangelId], ...patch },
        },
      }),
    [setState, state.mangelDetails]
  );

  const { mieter, vermieter } = state;
  // The e-mail is optional for the free download - it is only needed when the
  // letter is posted for money, and the dispatch card asks for it there. A
  // present but malformed address still blocks.
  const mieterValid =
    Boolean(mieter.name && mieter.strasse && mieter.plz && mieter.ort) &&
    (mieter.email === "" || EMAIL_PATTERN.test(mieter.email));
  const vermieterValid = Boolean(
    vermieter.name && vermieter.strasse && vermieter.plz && vermieter.ort
  );

  /* --------------------------------------------------------------- deadline */

  const vorschlag = useMemo(() => fristVorschlag(selectedMaengel), [selectedMaengel]);
  const fristTage = state.fristTage ?? vorschlag.tage;
  const fristDatum = useMemo(() => berechneFrist(new Date(), fristTage), [fristTage]);

  /* ----------------------------------------------------------------- letter */

  const mangelLabel = useCallback(
    (m: Mangel) => tc(mangelLabelKey(m.id), m.label),
    [tc]
  );
  const mangelDesc = useCallback((m: Mangel) => tc(mangelDescKey(m.id), m.description), [tc]);

  /**
   * Rewrites the free-text descriptions into formal German.
   *
   * Fired without awaiting when the description screen is left, so the
   * round trip overlaps with the reader choosing a deadline instead of
   * holding them at a spinner. A failure is never allowed to block: their own
   * wording simply stands, which is what happened before this existed.
   */
  const starteAnreicherung = useCallback(() => {
    if (selectedMaengel.length === 0) return;
    const reihenfolge = selectedMaengel.map((m) => m.id);
    const nutzlast = selectedMaengel.map((m) => ({
      label: m.label,
      raum: state.mangelDetails[m.id]?.raum ?? "",
      seit: state.mangelDetails[m.id]?.seit ?? "",
      beschreibung: state.mangelDetails[m.id]?.beschreibung ?? "",
    }));

    setAnreicherungLaeuft(true);
    anreicherung.current = fetch("/api/enhance-beschreibung", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maengel: nutzlast }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((daten: { beschreibungen?: string[] } | null) => {
        const texte = daten?.beschreibungen;
        if (!Array.isArray(texte)) return;
        // Applied back by the id at each position, not by a bare index into
        // whatever the details happen to be now.
        const naechste = { ...flowStore.getSnapshot().mangelDetails };
        reihenfolge.forEach((id, i) => {
          const text = texte[i];
          if (typeof text !== "string" || !text.trim()) return;
          naechste[id] = { ...LEERES_DETAIL, ...naechste[id], beschreibung: text };
        });
        schreibeFlow({ ...flowStore.getSnapshot(), mangelDetails: naechste });
      })
      .catch(() => {
        /* the user's own wording stands */
      })
      .finally(() => setAnreicherungLaeuft(false));
  }, [selectedMaengel, state.mangelDetails]);

  /**
   * Builds the letter when the preview is entered, but never over the top of
   * a letter the reader has rewritten by hand.
   */
  useEffect(() => {
    if (state.screen !== SCREEN.VORSCHAU) return;
    let abgebrochen = false;

    const bauen = () => {
      if (abgebrochen) return;
      const jetzt = flowStore.getSnapshot();
      const bearbeitet = jetzt.briefText !== "" && jetzt.briefText !== jetzt.generierterText;
      if (bearbeitet) return;
      const text = generateBriefText({
        mieter: jetzt.mieter,
        vermieter: jetzt.vermieter,
        maengel: jetzt.selectedMangelIds
          .map((id) => alleMaengel.find((e) => e.mangel.id === id)?.mangel)
          .filter((m): m is Mangel => Boolean(m)),
        details: jetzt.mangelDetails,
        antworten: jetzt.antworten,
        frist: berechneFrist(new Date(), jetzt.fristTage ?? vorschlag.tage),
      });
      schreibeFlow({ ...jetzt, briefText: text, generierterText: text });
    };

    if (anreicherung.current) {
      anreicherung.current.then(bauen, bauen);
    } else {
      bauen();
    }
    return () => {
      abgebrochen = true;
    };
    // Deliberately keyed on the screen alone: regenerating on every keystroke
    // would fight the reader's own edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.screen]);

  /* ----------------------------------------------------------------- render */

  const wert: WizardContextValue = {
    state,
    gehZu,
    weiter,
    zurueck,
    ueberschriftRef,
    waehleAntwort,
    bestaetigeAntwort,
    zurueckZurFrage,
    neuStarten,
    selectedMaengel,
    toggleMangel,
    selectedKategorie,
    setSelectedKategorie,
    setBruttowarmmiete: (wert) => setState({ bruttowarmmiete: wert }),
    miete,
    quoteMin,
    quoteMax,
    quoteTypisch,
    ersparnisMin: (miete * quoteMin) / 100,
    ersparnisMax: (miete * quoteMax) / 100,
    ersparnisTypisch: (miete * quoteTypisch) / 100,
    setMieter,
    setVermieter,
    setMangelDetail,
    setEmailOptIn: (an) => setState({ emailOptIn: an }),
    mieterValid,
    vermieterValid,
    fristVorschlag: vorschlag,
    fristTage,
    setFristTage: (tage) => setState({ fristTage: tage }),
    fristDatum,
    setBriefText: (text) => setState({ briefText: text }),
    setSignatureData: (daten) => setState({ signatureData: daten }),
    starteAnreicherung,
    anreicherungLaeuft,
    mangelLabel,
    mangelDesc,
  };

  const { screen } = state;

  const inhalt = () => {
    if (screen < ANZAHL_ANSPRUCHSFRAGEN) return <AnspruchsfrageScreen />;
    switch (screen) {
      case SCREEN.MAENGEL:
        return <MaengelScreen />;
      case SCREEN.MIETE:
        return <MieteScreen />;
      case SCREEN.ERGEBNIS:
        return <ErgebnisScreen />;
      case SCREEN.MIETER:
        return <MieterScreen />;
      case SCREEN.VERMIETER:
        return <VermieterScreen />;
      case SCREEN.BESCHREIBUNG:
        return <BeschreibungScreen />;
      case SCREEN.FRIST:
        return <FristScreen />;
      case SCREEN.VORSCHAU:
        return <VorschauScreen />;
      default:
        return <FertigScreen />;
    }
  };

  return (
    <WizardProvider value={wert}>
      {/*
        Two ids on one section. `#pruefung` is the header's first nav target
        and the scope of the calculator suite; `#maengelanzeige` is the second
        nav target and the scope of the § 19 UStG assertion on the last screen.
        The letter is no longer a place of its own, but the links to it are,
        so the inner container carries the second anchor.
      */}
      <section id="pruefung" className="scroll-mt-24 pt-6 pb-16 sm:pt-8 sm:pb-24">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          {state.notEligibleQuestionId ? (
            <div id="maengelanzeige">
              <NichtBerechtigt />
            </div>
          ) : (
            <div id="maengelanzeige" ref={kartenRef} data-testid="wizard-card" data-screen={screen}>
              <WizardStepper />
              <FormCard
                completed={screen}
                total={LETZTER_SCHRITT}
                label={t(screenLabelKey(screen))}
                padded={screen !== SCREEN.MAENGEL}
                contentClassName={inhaltsBreite(screen)}
                /* The very first question has nothing to go back to, and a
                   pointer answer advances on its own - so until something is
                   recorded there is no bar to show. */
                footer={
                  screen === 0 && !state.antworten[eligibilityQuestions[0].id] ? undefined : (
                    <FooterActions />
                  )
                }
              >
                <div key={screen} className="animate-fade-in-up">
                  {inhalt()}
                </div>
              </FormCard>
            </div>
          )}
        </div>

        {/*
          The benefits go below the card, never above it: they reassure, they
          do not lead into the form, and the first question has to stay on the
          first screen. They stop at the last one, where the dispatch card puts
          a price on the table - a chip promising no hidden costs directly
          above a price list would be reading against the page. Their row gets
          a wider container than the card so the three chips keep to one line
          in every language; the content is narrower than the card, so the row
          still lines up with its edges.
        */}
        {!state.notEligibleQuestionId && screen !== SCREEN.FERTIG && (
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <TrustChips />
          </div>
        )}
      </section>
    </WizardProvider>
  );
}

/** Form screens keep a readable measure; the wide ones use the whole column. */
function inhaltsBreite(screen: number): string {
  if (screen < ANZAHL_ANSPRUCHSFRAGEN || screen === SCREEN.MIETE) {
    return "mx-auto max-w-xl";
  }
  if (screen === SCREEN.MIETER || screen === SCREEN.VERMIETER) {
    return "mx-auto max-w-md lg:max-w-xl";
  }
  return "";
}

