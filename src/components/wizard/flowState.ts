import type { MangelDetail, MieterDaten, VermieterDaten } from "@/lib/brief/generateBriefText";

export interface FlowState {
  /** Index into `SCREENS`. */
  screen: number;
  /** The furthest screen reached, so going back is not punishing. */
  maxScreen: number;
  /** Eligibility answers, keyed by question id. They now reach the letter. */
  antworten: Record<string, string>;
  eligibilityStep: number;
  notEligibleQuestionId: string | null;
  /** Ids, not objects: the state has to survive a JSON round trip. */
  selectedMangelIds: string[];
  bruttowarmmiete: string;
  /** Agreed and actual floor area in m², for the computed area shortfall. */
  flaecheVereinbart: string;
  flaecheTatsaechlich: string;
  mieter: MieterDaten;
  vermieter: VermieterDaten;
  /** Keyed by `mangel.id`, never by position. */
  mangelDetails: Record<string, MangelDetail>;
  /** null until the user has seen the deadline screen; then their choice. */
  fristTage: number | null;
  /** "" until the preview has been generated once. */
  briefText: string;
  /**
   * The last text we generated. Kept so re-entering the preview can tell an
   * untouched letter (safe to regenerate with a changed deadline) from one the
   * user has rewritten (never overwrite).
   */
  generierterText: string;
  signatureData: string;
}

export const LEERER_MIETER: MieterDaten = {
  name: "",
  strasse: "",
  plz: "",
  ort: "",
  telefon: "",
  email: "",
  wohnungNr: "",
};

export const LEERER_VERMIETER: VermieterDaten = {
  name: "",
  strasse: "",
  plz: "",
  ort: "",
};

export const LEERER_FLOW: FlowState = {
  screen: 0,
  maxScreen: 0,
  antworten: {},
  eligibilityStep: 0,
  notEligibleQuestionId: null,
  selectedMangelIds: [],
  bruttowarmmiete: "",
  flaecheVereinbart: "",
  flaecheTatsaechlich: "",
  mieter: LEERER_MIETER,
  vermieter: LEERER_VERMIETER,
  mangelDetails: {},
  fristTage: null,
  briefText: "",
  generierterText: "",
  signatureData: "",
};

const STORAGE_KEY = "mangelflow:v1";

/* --------------------------------------------------------------------------
   The draft lives in sessionStorage, which React treats as an external store.
   Reading it through useSyncExternalStore keeps the server render
   deterministic (an empty flow, screen 0) while the client picks up the saved
   draft during hydration - without a setState-in-effect cascade and without
   the visible flash of screen 0 that restoring inside an effect would cause.

   This mirrors src/i18n/LanguageContext.tsx, which solves the same problem for
   the selected language and explains the reasoning at length.

   sessionStorage rather than localStorage on purpose: the draft holds the
   tenant's name, address, phone number and signature. It should not outlive
   the tab, and a second tab on a shared computer must start blank.
-------------------------------------------------------------------------- */

let cachedState: FlowState | null = null;
const listeners = new Set<() => void>();

/** Narrows unknown JSON onto the shape without trusting any of it. */
function istFlowState(wert: unknown): wert is FlowState {
  if (typeof wert !== "object" || wert === null) return false;
  const k = wert as Record<string, unknown>;
  return (
    typeof k.screen === "number" &&
    Number.isInteger(k.screen) &&
    // The old shape kept details in an array, aligned by position. Anything
    // still carrying that is from before the re-keying and is not migrated:
    // a draft restored under the wrong defect is worse than no draft.
    typeof k.mangelDetails === "object" &&
    k.mangelDetails !== null &&
    !Array.isArray(k.mangelDetails) &&
    Array.isArray(k.selectedMangelIds) &&
    typeof k.mieter === "object" &&
    k.mieter !== null &&
    typeof k.vermieter === "object" &&
    k.vermieter !== null
  );
}

function leseGespeichert(): FlowState {
  try {
    const roh = sessionStorage.getItem(STORAGE_KEY);
    if (!roh) return LEERER_FLOW;
    const geparst: unknown = JSON.parse(roh);
    if (!istFlowState(geparst)) {
      sessionStorage.removeItem(STORAGE_KEY);
      return LEERER_FLOW;
    }
    // Defaults fill anything a newer field added since the draft was written.
    return { ...LEERER_FLOW, ...geparst };
  } catch {
    // Unparseable, or storage refused us (private mode, blocked cookies).
    // Either way the flow simply starts empty, as it did before it persisted.
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing left to do */
    }
    return LEERER_FLOW;
  }
}

function getSnapshot(): FlowState {
  cachedState ??= leseGespeichert();
  return cachedState;
}

function getServerSnapshot(): FlowState {
  return LEERER_FLOW;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Replaces the draft and tells every listener. */
export function schreibeFlow(next: FlowState) {
  cachedState = next;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A full quota or a blocked store must not break the wizard: the draft
    // then simply lives in memory for this visit, as it always did.
  }
  listeners.forEach((l) => l());
}

/** Drops the draft entirely - used by "Erneut prüfen" and after payment. */
export function loescheFlow() {
  cachedState = LEERER_FLOW;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clean up */
  }
  listeners.forEach((l) => l());
}

export const flowStore = { subscribe, getSnapshot, getServerSnapshot };
export { STORAGE_KEY, istFlowState, leseGespeichert };
