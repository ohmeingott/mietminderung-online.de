/**
 * Consent text registry (Art. 7 Abs. 1 DSGVO accountability).
 *
 * Every case row stores the version string of the consent text the user
 * actually saw. RULE: any change to a wording — even a typo fix that could
 * alter meaning — requires a NEW version string and a NEW entry. Entries
 * are an immutable archive; never edit or delete an existing one, so each
 * historical version stays recoverable from this file and git history.
 *
 * The German text is the canonical (legally binding) version; the UI shows
 * a translation in the user's locale, and the locale is stored with the
 * case so the shown wording can be reconstructed.
 */

export const CASE_SAVE_CONSENT_VERSION = "case-save-v1";
export const LAWYER_REFERRAL_CONSENT_VERSION = "lawyer-referral-v1";

export const CONSENT_TEXTS_DE: Record<string, string> = {
  "case-save-v1":
    "Ich willige ein, dass mietminderung.online meinen Namen, meine E-Mail-Adresse, PLZ und Ort sowie meine Falldaten (gewählte Mängel mit meinen Beschreibungen, Miete, berechnete Minderungsquote, Fristdatum, Antworten der Anspruchsprüfung) speichert, um mir eine Bestätigungs-E-Mail und Erinnerungen zu meiner Mängelanzeige zu senden. Straße, Telefonnummer, Unterschrift und Vermieterdaten werden nicht gespeichert. Ich kann diese Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen — über den Link in jeder E-Mail oder die Seite „Fall löschen“. Details: Datenschutzerklärung, Abschnitt 7.",
  "lawyer-referral-v1":
    "Ich willige ein, dass mietminderung.online meinen Namen, meine E-Mail-Adresse, PLZ und Ort sowie meine Falldaten (gemeldete Mängel einschließlich meiner Beschreibungen, Miete, berechnete Minderungsquote, Fristverlauf und Reaktionsstatus meines Vermieters) an eine in Deutschland zugelassene Partner-Rechtsanwältin / einen Partner-Rechtsanwalt übermittelt, damit diese/dieser mich für eine kostenlose und unverbindliche Ersteinschätzung kontaktieren kann. Diese Einwilligung ist freiwillig; ohne sie wird mein Fall nicht weitergegeben und ich kann alle Funktionen von mietminderung.online weiter nutzen. Ich kann sie jederzeit mit Wirkung für die Zukunft widerrufen (Link in jeder E-Mail). Details: Datenschutzerklärung, Abschnitt 8.",
};
