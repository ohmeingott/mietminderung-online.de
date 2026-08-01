"use client";

import { createContext, useContext } from "react";
import type { Mangel } from "@/data/maengel";
import type { MangelDetail, MieterDaten, VermieterDaten } from "@/lib/brief/generateBriefText";
import type { FlowState } from "@/components/wizard/flowState";
import type { FristVorschlag } from "@/lib/brief/frist";

export interface WizardContextValue {
  state: FlowState;

  /* ------------------------------------------------------------ navigation */
  /** Moves to a screen and remembers how far the user has come. */
  gehZu: (screen: number) => void;
  weiter: () => void;
  zurueck: () => void;
  /** Registers the heading of the current screen so focus can move to it. */
  ueberschriftRef: (el: HTMLElement | null) => void;

  /* --------------------------------------------------------------- answers */
  /** Records a choice without acting on it, so arrowing may explore. */
  waehleAntwort: (frageId: string, wert: string) => void;
  /** Acts on the recorded choice: advance, or show the dead end. */
  bestaetigeAntwort: (frageId: string, wert: string, eligible: boolean | null) => void;
  zurueckZurFrage: () => void;
  neuStarten: () => void;

  /* ---------------------------------------------------------------- defects */
  selectedMaengel: Mangel[];
  toggleMangel: (mangel: Mangel) => void;
  selectedKategorie: string | null;
  setSelectedKategorie: (id: string | null) => void;

  /* ------------------------------------------------------------------ money */
  setBruttowarmmiete: (wert: string) => void;
  miete: number;
  quoteMin: number;
  quoteMax: number;
  quoteTypisch: number;
  ersparnisMin: number;
  ersparnisMax: number;
  ersparnisTypisch: number;

  /* ------------------------------------------------------------------ forms */
  setMieter: (patch: Partial<MieterDaten>) => void;
  setVermieter: (patch: Partial<VermieterDaten>) => void;
  setMangelDetail: (mangelId: string, patch: Partial<MangelDetail>) => void;
  setEmailOptIn: (an: boolean) => void;
  mieterValid: boolean;
  vermieterValid: boolean;

  /* --------------------------------------------------------------- deadline */
  fristVorschlag: FristVorschlag;
  /** The chosen number of days, falling back to the suggestion. */
  fristTage: number;
  setFristTage: (tage: number) => void;
  fristDatum: Date;

  /* ----------------------------------------------------------------- letter */
  setBriefText: (text: string) => void;
  setSignatureData: (daten: string) => void;
  /** Fired without awaiting when leaving the description screen. */
  starteAnreicherung: () => void;
  anreicherungLaeuft: boolean;

  /* -------------------------------------------------------------- labelling */
  mangelLabel: (m: Mangel) => string;
  mangelDesc: (m: Mangel) => string;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export const WizardProvider = WizardContext.Provider;

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within the wizard");
  return ctx;
}
