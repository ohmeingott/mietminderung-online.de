export type Locale = "de" | "en" | "tr" | "ru" | "uk" | "ar" | "pl";

export interface LocaleInfo {
  code: Locale;
  label: string;
  flag: string;
  dir?: "rtl" | "ltr";
}

export const locales: LocaleInfo[] = [
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
];

// Translation keys organized by section
export const translations: Record<Locale, Record<string, string>> = {
  de: {
    // Header
    "nav.check": "Anspruch prüfen",
    "nav.letter": "Mängelanzeige",
    "nav.how": "So funktioniert's",
    "nav.faq": "FAQ",
    "nav.table": "Tabelle",
    "nav.guide": "Ratgeber",
    "nav.send": "Brief versenden",
    "versand.teaser.eyebrow": "Nicht nur prüfen — erledigen",
    "versand.teaser.more": "So funktioniert der Versand",

    // SEO metadata for the pages that exist in every language
    "seo.home.title":
      "Mietminderung berechnen & Mängelanzeige senden (kostenlos prüfen)",
    "seo.home.description":
      "Kostenlos prüfen, ob Sie die Miete mindern dürfen: Minderungsquote berechnen, Mängelanzeige nach § 536c BGB erstellen und direkt an den Vermieter senden lassen.",
    "seo.faq.title":
      "Mietminderung FAQ: Die wichtigsten Fragen & Antworten",
    "seo.faq.description":
      "Antworten auf die wichtigsten Fragen zur Mietminderung: Wie hoch darf sie sein, ab wann gilt sie und muss der Vermieter zustimmen? Erklärt auf Basis des BGB.",
    "nav.cta": "Jetzt prüfen",

    // Hero
    "hero.badge": "Basierend auf § 536 BGB: Ihr gesetzliches Recht",
    // "So viel" is bound with a non-breaking space so the headline never breaks
    // between them; the question then gets a line of its own on narrow screens.
    "hero.title1": "Schimmel, Lärm, kaputte Heizung? So viel",
    "hero.title2": "Mietminderung",
    "hero.title3": "steht Ihnen zu.",
    "hero.subtitle":
      "Mängelanzeige in 2 Minuten erstellen und kostenlos herunterladen. Auf Wunsch direkt per Brief oder Einschreiben verschicken.",
    "hero.cta1": "Anspruch kostenlos prüfen",
    "hero.cta2": "Mängelanzeige erstellen",
    "hero.selectLang": "Sprache wählen",
    "hero.stat1label": "BGB: Ihr Rechtsanspruch",
    "hero.stat2": "bis 100%",
    "hero.stat2label": "Mietminderung möglich",
    "hero.stat3": "2 Min.",
    "hero.stat3label": "Anspruch online prüfen",

    // How it works
    "how.title": "So funktioniert's",
    "how.subtitle": "In 4 einfachen Schritten zu Ihrem Recht auf Mietminderung",
    "how.step": "SCHRITT",
    "how.s1.title": "Mangel auswählen",
    "how.s1.desc":
      "Wählen Sie aus über 60 typischen Wohnungsmängeln den passenden aus, von Heizungsausfall bis Schimmel.",
    "how.s2.title": "Minderung berechnen",
    "how.s2.desc":
      "Wir berechnen anhand aktueller Gerichtsurteile, wie viel Mietminderung Ihnen zusteht.",
    "how.s3.title": "Mängelanzeige erstellen",
    "how.s3.desc":
      "Aus Ihren Angaben generieren wir eine rechtssichere Mängelanzeige nach § 536c BGB.",
    "how.s4.title": "Brief herunterladen",
    "how.s4.desc":
      "Laden Sie die fertige Mängelanzeige als PDF oder Textdatei herunter, kostenlos und ohne Registrierung. Oder lassen Sie sie von uns per Brief oder Einwurf-Einschreiben an Ihren Vermieter senden.",

    // Check
    "check.phase.eligibility": "Prüfung",
    "check.phase.defects": "Mängel",
    "check.phase.rent": "Miete",
    "check.result": "Ergebnis",
    "check.back": "Zurück",
    "check.next": "Weiter",
    "check.allCategories": "Alle Kategorien",
    "check.whichDefects": "Welche Mängel liegen vor?",
    "check.whichDefectsDesc":
      "Wählen Sie eine Kategorie und dann die zutreffenden Mängel aus. Sie können mehrere Mängel auswählen.",
    "check.selected": "Mangel/Mängel ausgewählt",
    "check.approxReduction": "Minderung",
    "check.rentTitle": "Wie hoch ist Ihre monatliche Miete?",
    "check.rentDesc":
      "Geben Sie Ihre Bruttowarmmiete ein (Kaltmiete + alle Nebenkosten). Die Mietminderung wird von der Bruttowarmmiete berechnet (BGH-Urteil).",
    "check.rentPlaceholder": "z.B. 1000",
    "check.rentInfo":
      "Bruttowarmmiete = Nettokaltmiete + Betriebskostenvorauszahlung (Nebenkosten). Diese finden Sie in Ihrem Mietvertrag oder auf der letzten Nebenkostenabrechnung.",
    "check.showResult": "Ergebnis anzeigen",
    "check.resultTitle": "Sie haben wahrscheinlich Anspruch auf Mietminderung!",
    "check.reductionRate": "Minderungsquote",
    "check.range": "Spanne",
    "check.gesamtbetrachtungHint":
      "Gerichte addieren mehrere Mängel nicht einfach, sondern bewerten die Gesamtbeeinträchtigung der Wohnung. Die Gesamtquote liegt deshalb unter der Summe der Einzelwerte.",
    "check.flaecheTitle": "Wohnfläche angeben",
    "check.flaecheDesc":
      "Bei der Wohnfläche gibt es keine Spanne: Ab mehr als 10 % Abweichung mindert sich die Miete genau um den Prozentsatz der fehlenden Fläche. Bis einschließlich 10 % liegt kein Mangel vor.",
    "check.flaecheVereinbart": "Vereinbarte Fläche (m²)",
    "check.flaecheTatsaechlich": "Tatsächliche Fläche (m²)",
    "check.flaecheMangel":
      "Abweichung {abweichung} % - das ist ein Mangel. Die Minderung beträgt {quote} %.",
    "check.flaecheKeinMangel":
      "Abweichung {abweichung} % - bis einschließlich 10 % liegt nach dem BGH kein Mangel vor. Die Minderung beträgt 0 %.",
    "check.monthlySavings": "Monatliche Ersparnis",
    "check.yearlySavings": "Jährliche Ersparnis",
    "check.withPermanent": "bei dauerhaftem Mangel",
    "check.disclaimer":
      "Die Berechnung basiert auf typischen Gerichtsurteilen und dient als Orientierung. Die tatsächliche Minderungsquote kann im Einzelfall abweichen. Wir empfehlen, im Zweifelsfall konservativ zu mindern oder zunächst unter Vorbehalt zu zahlen.",
    "check.yourDefects": "Ihre ausgewählten Mängel:",
    "check.nextStep": "Der nächste Schritt: Erstellen Sie eine rechtssichere Mängelanzeige an Ihren Vermieter.",
    "check.createLetter": "Mängelanzeige erstellen",
    "check.editDefects": "Mängel bearbeiten",
    "check.notEligibleTitle": "Wahrscheinlich kein Anspruch",
    "check.notEligibleHint":
      "Dies ist eine erste Einschätzung und keine Rechtsberatung. Im Zweifelsfall empfehlen wir, einen Mieterverein oder Rechtsanwalt zu konsultieren.",
    "check.tryAgain": "Erneut prüfen",

    // Eligibility questions
    "eq.mietvertrag.q": "Haben Sie einen gültigen Mietvertrag?",
    "eq.mietvertrag.desc": "Eine Mietminderung setzt ein bestehendes Mietverhältnis voraus.",
    "eq.mietvertrag.ja": "Ja",
    "eq.mietvertrag.nein": "Nein",
    "eq.mangel_bekannt.q": "Kannten Sie den Mangel schon bei Vertragsschluss oder Wohnungsübernahme?",
    "eq.mangel_bekannt.desc": "Wer einen Mangel bei Vertragsschluss kennt, kann deswegen später nicht mindern (§ 536b Satz 1 BGB). Bei Übernahme trotz Kenntnis bleibt das Recht erhalten, wenn Sie sich Ihre Rechte vorbehalten haben (Satz 3). Hat der Vermieter den Mangel arglistig verschwiegen, bleiben Ihre Rechte in jedem Fall bestehen (Satz 2).",
    "eq.mangel_bekannt.nein": "Nein, ich habe den Mangel erst später entdeckt",
    "eq.mangel_bekannt.ja_vorbehalt": "Ja, aber ich habe mir meine Rechte vorbehalten",
    "eq.mangel_bekannt.ja_arglist": "Ja, aber der Vermieter hat den Mangel verschwiegen",
    "eq.mangel_bekannt.ja": "Ja, ohne Vorbehalt",
    "eq.selbst_verursacht.q": "Haben Sie den Mangel selbst verursacht?",
    "eq.selbst_verursacht.desc": "Wenn der Mieter den Mangel selbst verursacht hat, entfällt das Minderungsrecht.",
    "eq.selbst_verursacht.nein": "Nein",
    "eq.selbst_verursacht.ja": "Ja",
    "eq.selbst_verursacht.unsicher": "Bin mir nicht sicher",
    "eq.erheblich.q": "Wie stark beeinträchtigt der Mangel Ihre Wohnung?",
    "eq.erheblich.desc": "Nur erhebliche Mängel berechtigen zur Mietminderung (§ 536 Abs. 1 Satz 3 BGB). Mehrere Bagatellmängel zusammen können die Schwelle allerdings überschreiten.",
    "eq.erheblich.stark": "Stark: Wohnqualität deutlich eingeschränkt",
    "eq.erheblich.mittel": "Mittel: spürbare Beeinträchtigung",
    "eq.erheblich.gering": "Gering: nur leichte Unannehmlichkeit",
    "eq.angezeigt.q": "Haben Sie den Mangel Ihrem Vermieter bereits gemeldet?",
    "eq.angezeigt.desc": "Die Minderung tritt kraft Gesetzes ein, auch ohne Anzeige. Die Mängelanzeige ist aber entscheidend, um sie durchzusetzen (§ 536c BGB). Wir helfen Ihnen dabei, diese zu erstellen.",
    "eq.angezeigt.ja": "Ja, schriftlich",
    "eq.angezeigt.muendlich": "Nur mündlich",
    "eq.angezeigt.nein": "Nein, noch nicht",
    "eq.reason.mietvertrag": "Ohne gültigen Mietvertrag besteht leider kein Anspruch auf Mietminderung.",
    "eq.reason.mangel_bekannt": "Wenn Sie den Mangel bei Einzug kannten und nichts dagegen gesagt haben, entfällt das Minderungsrecht (§ 536b BGB).",
    "eq.reason.selbst_verursacht": "Wenn Sie den Mangel selbst verursacht haben, besteht kein Anspruch auf Mietminderung.",
    "eq.reason.erheblich": "Nur erhebliche Mängel berechtigen zur Mietminderung. Bagatellmängel (§ 536 Abs. 1 S. 3 BGB) reichen leider nicht aus.",
    "eq.reason.default": "In diesem Fall besteht leider kein Anspruch.",

    // Letter
    "letter.title": "Mängelanzeige erstellen",
    "letter.subtitle": "Erstellen Sie eine rechtssichere Mängelanzeige nach § 536c BGB.",
    "letter.step.data": "Ihre Daten",
    "letter.step.landlord": "Vermieter",
    "letter.step.defects": "Beschreibung",
    "letter.step.preview": "Vorschau",
    "letter.step.send": "Download",
    "letter.yourData": "Ihre Angaben (Mieter)",
    "letter.name": "Vollständiger Name",
    "letter.street": "Straße & Hausnummer",
    "letter.zip": "PLZ",
    "letter.city": "Ort",
    "letter.aptNr": "Wohnungsnummer (optional)",
    "letter.phone": "Telefonnummer (optional)",
    "letter.landlordData": "Angaben zum Vermieter",
    "letter.landlordName": "Name des Vermieters / der Hausverwaltung",
    "letter.salutation": "Anrede im Brief",
    "letter.salutationCompany": "Firma",
    "letter.salutationMs": "Frau",
    "letter.salutationMr": "Herr",
    "letter.describeDefects": "Mängel beschreiben",
    "letter.describeHint":
      "Beschreiben Sie jeden Mangel so genau wie möglich. Je detaillierter, desto besser.",
    "letter.whichRoom": "In welchem Raum tritt der Mangel auf?",
    "letter.sincewhen": "Seit wann besteht der Mangel?",
    "letter.detailDesc": "Detaillierte Beschreibung",
    "letter.nativeHint": "Sie können in Ihrer Muttersprache schreiben. Die KI übersetzt es ins Deutsche.",
    "letter.showPreview": "Vorschau anzeigen",
    "letter.creating": "Brief wird erstellt...",
    "letter.previewTitle": "Vorschau Ihrer Mängelanzeige",
    "letter.editHint": "Sie können den Text direkt bearbeiten, bevor Sie ihn versenden.",
    "letter.signature": "Digitale Unterschrift (optional)",
    "letter.clearSig": "Löschen",
    "letter.sigSaved": "Gespeichert",
    "letter.deliveryOptions": "Download oder Versand",
    "letter.backPreview": "Zurück zur Vorschau",
    "letter.howReceive": "Ihre Mängelanzeige ist fertig",
    "letter.downloadDesc": "Laden Sie den Brief als PDF herunter und drucken Sie ihn selbst aus.",
    "letter.free": "Kostenlos",
    "letter.downloadPdf": "Als PDF herunterladen",
    "letter.downloadTxt": "Als Textdatei",
    "letter.copyText": "Text kopieren",
    "letter.copied": "Kopiert!",
    "letter.warning":
      "Versenden Sie die Mängelanzeige so, dass Sie sie später belegen können: Einwurf-Einschreiben, Bote mit Zeugen oder persönliche Übergabe mit Empfangsbestätigung. Eine einfache E-Mail reicht als Zugangsnachweis nicht aus.",

    // Teaser
    "teaser.title": "Mängelanzeige erstellen",
    "teaser.desc":
      "Erstellen Sie eine rechtssichere Mängelanzeige für Ihren Vermieter. Nutzen Sie zunächst unsere Prüfung, um Ihren Anspruch und die Höhe der Mietminderung zu ermitteln. Diese Daten fließen automatisch in Ihren Brief ein.",
    "teaser.feat1": "Rechtssichere Vorlage nach § 536c BGB",
    "teaser.feat2": "Automatisch befüllt mit Ihren Angaben",
    "teaser.feat3": "Als PDF oder Textdatei herunterladen",
    "teaser.feat4": "Digitale Unterschrift möglich",
    "teaser.feat5": "Eingabe in Ihrer Muttersprache möglich",
    "teaser.cta": "Anspruch prüfen: Brief wird automatisch erstellt",

    // Info
    "info.title": "Ihr Recht auf Mietminderung: die wichtigsten Fakten",
    "info.subtitle": "Alles was Sie über Mietminderung in Deutschland wissen müssen",
    "info.c1.title": "Gesetzliches Recht",
    "info.c1.desc":
      "Die Mietminderung ist in § 536 BGB gesetzlich verankert und tritt automatisch ein, sobald ein erheblicher Mangel vorliegt. Sie müssen keine Genehmigung beantragen. Die Miete ist kraft Gesetzes gemindert.",
    "info.c2.title": "Nicht abdingbar",
    "info.c2.desc":
      "Bei Wohnraummiete kann das Minderungsrecht nicht durch den Mietvertrag ausgeschlossen werden (§ 536 Abs. 4 BGB). Klauseln, die das versuchen, sind unwirksam.",
    "info.c3.title": "Mängelanzeige sichert Ihr Recht",
    "info.c3.desc": "Die Minderung entsteht kraft Gesetzes, auch ohne Anzeige. Durchsetzen und beweisen lässt sie sich aber nur mit ihr: Ohne unverzügliche Anzeige verlieren Sie das Recht insoweit, als der Vermieter gerade deshalb nicht abhelfen konnte (§ 536c Abs. 2 Satz 2 Nr. 1 BGB).",
    "info.c4.title": "Bruttowarmmiete als Basis",
    "info.c4.desc": "Die Mietminderung wird von der Bruttowarmmiete berechnet (Kaltmiete + Nebenkosten). Für die Wohnraummiete hat das der Bundesgerichtshof mit Urteil vom 20.07.2005 entschieden (Az. VIII ZR 347/04).",
    "info.c5.title": "Vorsicht bei der Höhe",
    "info.c5.desc": "Schon ein Rückstand von mehr als einer Monatsmiete an zwei aufeinanderfolgenden Terminen kann die fristlose Kündigung auslösen (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a BGB). Im Zweifel: Miete unter Vorbehalt voll zahlen und später zurückfordern.",
    "info.c6.title": "Zeitnah handeln",
    "info.c6.desc":
      "Die Mängelanzeige muss unverzüglich nach Entdeckung erfolgen. Wer über ca. 6 Monate ohne Vorbehalt die volle Miete zahlt, riskiert die Verwirkung des Minderungsrechts.",

    // FAQ
    "faq.badge": "Häufig gestellte Fragen",
    "faq.title": "Alles über Mietminderung",
    "faq.subtitle": "Antworten auf die wichtigsten Fragen zum Thema Mietminderung in Deutschland.",
    "faq.legal.title": "Rechtlicher Hinweis",
    "faq.legal.text":
      "Die auf dieser Webseite bereitgestellten Informationen dienen ausschließlich der allgemeinen Information und stellen keine Rechtsberatung dar. Trotz sorgfältiger Recherche können wir keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen. Die Minderungsquoten basieren auf Gerichtsurteilen und dienen lediglich als Orientierungswerte; jeder Einzelfall wird individuell beurteilt. Bei konkreten rechtlichen Fragen empfehlen wir die Beratung durch einen Mieterverein oder Rechtsanwalt.",

    // Footer
    "footer.desc":
      "Wir helfen Mietern in Deutschland, ihr Recht auf Mietminderung durchzusetzen. Kostenlose Prüfung, Berechnung und Erstellung der Mängelanzeige, alles in wenigen Minuten.",
    "footer.service": "Service",
    "footer.legal": "Rechtliches",
    "footer.imprint": "Impressum",
    "footer.privacy": "Datenschutz",
    "footer.terms": "AGB",
    "footer.rights": "Alle Rechte vorbehalten.",
    "footer.noLegal":
      "Keine Rechtsberatung. Angaben ohne Gewähr. Bei Fragen wenden Sie sich an einen Mieterverein oder Rechtsanwalt.",
    "footer.withdrawal": "Widerrufsrecht",

    // Shared
    "common.note": "Hinweis",
    "common.backHome": "Zur Startseite",

    // Wizard, Frist und "Wie geht es weiter?"
    "letter.step.frist": "Frist",
    "check.pickCategoryHint": "Wählen Sie eine Kategorie, um die passenden Mängel zu sehen.",
    "check.removeLabel": "{label} entfernen",
    "check.nextStepTitle": "Der nächste Schritt: die Mängelanzeige",
    "letter.phoneWhy": "Mit einer Nummer bieten wir Ihrem Vermieter im Brief einen Termin zur Mängelbeseitigung an.",
    "letter.landlordDesc": "Die Mängelanzeige muss den Vermieter oder die Hausverwaltung erreichen. Den Namen finden Sie im Mietvertrag oder auf der Betriebskostenabrechnung.",
    "letter.landlordAddressHint": "Schreiben Sie den Namen so, wie er im Mietvertrag steht. Zusätze wie „c/o“ oder eine sehr lange Rechtsform passen sonst nicht in das Adressfeld des Briefs.",
    "letter.toDeadline": "Weiter zur Frist",
    "letter.signatureDesc": "Sie können den Brief auch ohne Unterschrift herunterladen und ihn nach dem Ausdrucken von Hand unterschreiben.",
    "frist.title": "Bis wann soll Ihr Vermieter den Mangel beseitigen?",
    "frist.desc": "Der Vermieter braucht eine angemessene Frist. Zu kurz ist angreifbar, zu lang kostet Sie Wochen.",
    "frist.days": "{n} Tage",
    "frist.until": "bis {datum}",
    "frist.recommended": "Empfohlen",
    "frist.suggestion": "Wir schlagen {n} Tage vor — das ist die Frist, die bei „{mangel}“ üblich ist. Bei mehreren Mängeln zählt immer der dringendste.",
    "frist.suggestionUrgent": "Wir schlagen {n} Tage vor. „{mangel}“ duldet keinen Aufschub. Bei mehreren Mängeln zählt immer der dringendste.",
    "frist.deliveryTitle": "Die Frist läuft ab Zugang, nicht ab Absendung.",
    "frist.deliveryText": "Maßgeblich ist der Tag, an dem der Brief bei Ihrem Vermieter im Briefkasten liegt. Rechnen Sie beim Postversand ein bis zwei Werktage dazu. Fällt das Fristende auf einen Samstag, Sonntag oder Feiertag, endet die Frist erst am nächsten Werktag (§ 193 BGB).",
    "frist.urgentTitle": "Hier ist Eile geboten.",
    "frist.urgentText": "Melden Sie „{mangel}“ zusätzlich telefonisch und notieren Sie, wann Sie mit wem gesprochen haben. Passiert bis zum Fristende nichts, dürfen Sie den Mangel auf Kosten des Vermieters beseitigen lassen (§ 536a Abs. 2 BGB).",
    "next.title": "Wie geht es weiter?",
    "next.subtitle": "Was Sie jetzt tun sollten — und womit Sie rechnen können.",
    "next.s1.when": "Heute, {datum}",
    "next.s1.text": "Drucken Sie die Mängelanzeige aus, unterschreiben Sie sie und geben Sie sie nachweisbar zur Post: Einwurf-Einschreiben, Bote mit Zeugen oder persönliche Übergabe mit Empfangsbestätigung. Eine einfache E-Mail reicht als Zugangsnachweis nicht aus.",
    "next.s2.when": "In ein bis drei Werktagen",
    "next.s2.text": "Der Brief liegt im Briefkasten Ihres Vermieters. Ab diesem Tag kennt er den Mangel — und ab diesem Tag läuft Ihre Frist.",
    "next.s3.when": "Ab Zugang",
    "next.s3.text": "Eine gesetzliche Antwortfrist gibt es nicht. Viele Vermieter melden sich innerhalb weniger Werktage für einen Besichtigungstermin, verpflichtet sind sie dazu nicht. Zahlen Sie die Miete zunächst voll weiter und schreiben Sie in den Verwendungszweck: „Zahlung unter Vorbehalt wegen Mangel“.",
    "next.s4.when": "Bis zum {datum}",
    "next.s4.text": "Ende Ihrer Frist. Bis zu diesem Tag muss der Mangel beseitigt sein. Dokumentieren Sie weiter: Fotos mit Datum, Temperatur- oder Lärmprotokoll.",
    "next.s5.when": "Ab dem {datum}",
    "next.s5.text": "Ist nichts passiert, ist Ihr Vermieter in Verzug. Sie können ein zweites Schreiben mit einer letzten Frist senden, die zu viel gezahlte Miete zurückfordern und nach § 536a BGB Schadensersatz oder die Ersatzvornahme verlangen. Ein Mieterverein oder eine Fachanwältin prüft Ihren Fall.",
    "next.caution": "Mindern Sie im Zweifel konservativ. Wer zu viel kürzt und zwei Monatsmieten Rückstand aufbaut, riskiert die fristlose Kündigung (§ 543 Abs. 2 Nr. 3 BGB).",
    "next.guideLink": "Ratgeber: Mängelanzeige richtig schreiben",
    "dispatch.emailLabel": "E-Mail-Adresse für die Bestätigung",
    "dispatch.emailWhy": "Wir schicken Ihnen die Auftragsbestätigung und den Versandstatus an diese Adresse.",
    "info.c7.title": "Nach dem Absenden",
    "info.c7.desc": "Ihr Vermieter muss nicht sofort antworten — eine gesetzliche Antwortfrist gibt es nicht. Was zählt, ist die Frist zur Beseitigung: in der Regel 14 Tage, bei dringenden Mängeln kürzer. Sie beginnt mit dem Zugang des Briefs. Passiert bis dahin nichts, ist Ihr Vermieter in Verzug.",

    // FAQ page
    "faq.showAll": "Alle Fragen & Antworten anzeigen",
    "faqpage.allTitle": "Alle Fragen & Antworten",
    "faqpage.cta.title": "Ihre Frage war nicht dabei?",
    "faqpage.cta.desc":
      "Nutzen Sie unseren kostenlosen Mietminderungs-Check. In wenigen Schritten erfahren Sie, ob und wie viel Sie mindern können.",

    // Letter - delivery
    "letter.basedOn":
      "Basiert auf Ihrer Prüfung: ca. {quote} % Minderung bei {rent} € Bruttowarmmiete.",

    // Letter — dispatch by post (eBrief). Which of the two tax notes is shown
    // follows STEUERMODUS; the components never choose between them, see
    // src/i18n/steuerhinweis.ts. As a small business the exemption has to be
    // named expressly and an unwarranted tax statement would be owed under
    // § 14c UStG, so `taxNote` must stay a "no VAT is charged" sentence and
    // `taxNoteRegel` must stay one that names the rate.
    "dispatch.title": "Direkt an den Vermieter senden",
    "dispatch.subtitle":
      "Wir drucken Ihre Mängelanzeige und geben sie zur Post — Sie brauchen weder Drucker noch Briefmarke.",
    "dispatch.chooseProduct": "Versandart wählen",
    "dispatch.brief": "Als Brief",
    "dispatch.einschreiben": "Als Einwurf-Einschreiben",
    "dispatch.einschreibenHint":
      "Die Post erfasst den Einwurf in den Briefkasten. Sobald die Zustellung gemeldet ist, schicken wir Ihnen Sendungsnummer und Verfolgungslink per E-Mail. Es ist kein Übergabe-Einschreiben mit Unterschrift des Empfängers — einen sicheren Zugangsnachweis kann kein Postprodukt erbringen.",
    "dispatch.taxNote": "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.",
    "dispatch.taxNoteRegel":
      "Die Preise sind Endpreise einschließlich 19 % Umsatzsteuer.",
    "dispatch.send": "Kostenpflichtig versenden",
    // § 356 Abs. 5 Nr. 2 BGB. The letter is printed and posted long before the
    // 14-day withdrawal period ends, so the order needs both declarations —
    // and they are two, not one: the express request to start early (lit. a)
    // and, separately, the acknowledgement that the right expires once we are
    // done (lit. c). Folding them into a single tick does not satisfy the
    // provision. The German wording is the one in src/lib/widerrufstext.ts;
    // these six translations are a reading aid, not the binding version.
    "dispatch.consentHeading": "Bevor wir mit dem Druck beginnen dürfen",
    "dispatch.consentStart":
      "Ich verlange ausdrücklich, dass Sie mit dem Druck und dem Versand meiner Mängelanzeige vor Ablauf der Widerrufsfrist beginnen.",
    "dispatch.consentExpiry":
      "Mir ist bekannt, dass mein Widerrufsrecht erlischt, sobald Sie die Leistung vollständig erbracht haben — sobald der Brief also gedruckt und in die Zustellung gegeben ist. Diese Kenntnis bestätige ich hiermit.",
    "dispatch.consentLink": "Widerrufsbelehrung",
    "dispatch.error.zustimmung_fehlt":
      "Bitte bestätigen Sie beide Erklärungen — ohne sie dürfen wir den Brief vor Ablauf der Widerrufsfrist nicht drucken und versenden.",
    "dispatch.preparing": "Sendung wird vorbereitet...",
    "dispatch.checkingAddress": "Adresse wird geprüft...",
    "dispatch.redirecting": "Weiter zur Bezahlung...",
    "dispatch.confirmSend": "Adresse ist richtig — kostenpflichtig versenden",
    "dispatch.addressWarning":
      "Die Anschrift des Vermieters konnte nicht eindeutig geprüft werden. Bitte kontrollieren Sie sie, bevor Sie kostenpflichtig versenden.",
    "dispatch.showMarked": "Erkannte Adresse ansehen",
    "dispatch.fixAddress": "Anschrift des Vermieters korrigieren",
    "dispatch.freeStays":
      "Der kostenlose Download bleibt Ihnen in jedem Fall erhalten.",
    // The two pages Stripe returns the payer to (/versand/erfolg and
    // /versand/abbruch). "erfolg" means Stripe accepted the payment; printing
    // and posting happen afterwards in the webhook, so the wording must stay
    // in the future tense — "wurde versendet" would promise more than is known
    // at this moment. Both pages also say plainly that the draft is gone: the
    // letter never leaves the browser tab, and the round trip to Stripe ends
    // that tab's state.
    "dispatch.result.erfolg.title": "Zahlung erfolgreich",
    "dispatch.result.erfolg.text":
      "Vielen Dank — Ihre Zahlung ist eingegangen. Ihre Mängelanzeige wird jetzt gedruckt und per Post an Ihren Vermieter versendet.",
    "dispatch.result.erfolg.note":
      "Die Bestätigung erhalten Sie per E-Mail an die Adresse, die Sie beim Versand angegeben haben. Sie müssen dafür nichts weiter tun. Ihre Mängelanzeige wird aus Datenschutzgründen nicht in Ihrem Browser gespeichert und lässt sich hier deshalb nicht noch einmal anzeigen.",
    "dispatch.result.abbruch.title": "Zahlung abgebrochen",
    "dispatch.result.abbruch.text":
      "Es wurde nichts versendet und nichts berechnet.",
    "dispatch.result.abbruch.note":
      "Ihre Mängelanzeige wird aus Datenschutzgründen nicht in Ihrem Browser gespeichert und steht deshalb nicht mehr zur Verfügung. Wenn Sie sie versenden oder kostenlos herunterladen möchten, füllen Sie das Formular bitte noch einmal aus — das dauert nur wenige Minuten.",
    "dispatch.result.restartCta": "Mängelanzeige neu erstellen",
    "dispatch.hint.kopf":
      "Der Briefkopf wurde nicht erkannt. Die Anschriften erscheinen deshalb möglicherweise zusätzlich im Brieftext.",
    "dispatch.hint.datum":
      "Im Brief wurde keine Datumszeile gefunden. Bitte prüfen Sie, ob das Datum im Text steht.",
    "dispatch.hint.absender":
      "Ihre Absenderzeile wurde gekürzt, damit sie in das Adressfeld passt.",
    "dispatch.error.allgemein":
      "Der Versand ist gerade nicht möglich. Bitte versuchen Sie es später noch einmal.",
    "dispatch.error.versand_nicht_konfiguriert":
      "Der Postversand ist derzeit nicht verfügbar. Bitte laden Sie die Mängelanzeige oben herunter und versenden Sie sie selbst.",
    "dispatch.error.zu_viele_anfragen":
      "Es wurden zu viele Versandversuche gestartet. Bitte versuchen Sie es in einer Stunde noch einmal.",
    "dispatch.error.unvollstaendig":
      "Es fehlen Angaben. Bitte gehen Sie zurück und ergänzen Sie Ihre Adresse, Ihre E-Mail-Adresse und die Anschrift des Vermieters.",
    "dispatch.error.anschrift_zu_lang":
      "Die Anschrift des Vermieters ist zu lang für das Adressfeld. Bitte kürzen Sie Name, Straße oder Ort — etwa Zusätze wie „c/o“ oder die Rechtsform.",
    "dispatch.error.pdf_fehler":
      "Der Brief konnte nicht erzeugt werden. Bitte zeichnen Sie Ihre Unterschrift neu oder lassen Sie sie weg und versuchen Sie es noch einmal.",
    "dispatch.error.ebrief_fehler":
      "Unser Versanddienstleister antwortet gerade nicht. Bitte versuchen Sie es in einigen Minuten noch einmal — es wurde nichts berechnet.",
    "dispatch.error.preis_unplausibel":
      "Dieser Brief lässt sich zum angegebenen Preis nicht versenden, vermutlich weil er zu lang ist. Bitte kürzen Sie den Text und versuchen Sie es noch einmal.",
    "dispatch.error.token_ungueltig":
      "Der Versandvorgang ist abgelaufen. Bitte starten Sie den Versand noch einmal.",
    "dispatch.error.jobId_ungueltig":
      "Der Versandvorgang konnte nicht zugeordnet werden. Bitte starten Sie den Versand noch einmal.",
    "dispatch.error.kein_dokument":
      "Der Brief wird noch verarbeitet. Bitte warten Sie einen Moment und versuchen Sie es dann noch einmal.",
    "dispatch.error.bereits_versendet":
      "Diese Mängelanzeige wurde bereits versendet. Es wird nichts erneut berechnet.",
    "dispatch.error.versand_nicht_moeglich":
      "Dieser Versandvorgang lässt sich nicht bezahlen. Bitte starten Sie den Versand noch einmal — es wurde nichts berechnet.",
    "dispatch.error.checkout_fehler":
      "Die Bezahlseite konnte nicht geöffnet werden. Bitte versuchen Sie es noch einmal — es wurde nichts berechnet.",
    "dispatch.error.zeitueberschreitung":
      "Der Vorgang dauert länger als erwartet. Bitte versuchen Sie es in einigen Minuten noch einmal — es wurde nichts berechnet.",
  },

  en: {
    // Header
    "nav.check": "Check your claim",
    "nav.letter": "Defect notice",
    "nav.how": "How it works",
    "nav.faq": "FAQ",
    "nav.table": "Table",
    "nav.guide": "Guides",
    "nav.send": "Send letter",
    "versand.teaser.eyebrow": "Not just check — get it done",
    "versand.teaser.more": "How the dispatch works",

    // SEO metadata for the pages that exist in every language
    "seo.home.title":
      "Rent Reduction in Germany: Check Your Claim & Send the Letter",
    "seo.home.description":
      "Free check of whether you can reduce your rent in Germany: calculate the reduction, create a defect notice under § 536c BGB and have us post it to your landlord.",
    "seo.faq.title":
      "Rent Reduction in Germany: Frequently Asked Questions",
    "seo.faq.description":
      "The key questions about reducing rent in Germany: how much you may withhold, when the reduction starts and whether the landlord has to agree. Based on the German Civil Code.",
    "nav.cta": "Check now",

    // Hero
    "hero.badge": "Based on Section 536 of the German Civil Code (BGB) — your statutory right",
    "hero.title1": "Mould, noise, broken heating? This is how much",
    "hero.title2": "rent reduction",
    "hero.title3": "you are entitled to.",
    "hero.subtitle":
      "Create your defect notice in 2 minutes and download it free of charge. Have it sent directly by letter or Einwurf-Einschreiben if you like.",
    "hero.cta1": "Check your claim for free",
    "hero.cta2": "Create defect notice",
    "hero.selectLang": "Select language",
    "hero.stat1label": "BGB — your statutory right",
    "hero.stat2": "up to 100%",
    "hero.stat2label": "rent reduction possible",
    "hero.stat3": "2 min",
    "hero.stat3label": "check your claim online",

    // How it works
    "how.title": "How it works",
    "how.subtitle": "4 simple steps to your right to a rent reduction",
    "how.step": "STEP",
    "how.s1.title": "Select the defect",
    "how.s1.desc":
      "Choose the right one from over 60 typical housing defects — from heating failure to mould.",
    "how.s2.title": "Calculate the reduction",
    "how.s2.desc":
      "Based on current court rulings, we calculate how much rent reduction you are entitled to.",
    "how.s3.title": "Create the defect notice",
    "how.s3.desc":
      "From your details we generate a legally sound defect notice under Section 536c BGB.",
    "how.s4.title": "Download the letter",
    "how.s4.desc":
      "Download the finished defect notice as a PDF or text file — free and without registration. Or have us send it to your landlord by letter or Einwurf-Einschreiben.",

    // Check
    "check.phase.eligibility": "Eligibility",
    "check.phase.defects": "Defects",
    "check.phase.rent": "Rent",
    "check.result": "Result",
    "check.back": "Back",
    "check.next": "Next",
    "check.allCategories": "All categories",
    "check.whichDefects": "Which defects are present?",
    "check.whichDefectsDesc":
      "Select a category and then the defects that apply. You can select several defects.",
    "check.selected": "defect(s) selected",
    "check.approxReduction": "Reduction",
    "check.rentTitle": "How much is your monthly rent?",
    "check.rentDesc":
      "Enter your gross warm rent (base rent + all service charges). The rent reduction is calculated from the gross warm rent (Federal Court of Justice ruling).",
    "check.rentPlaceholder": "e.g. 1000",
    "check.rentInfo":
      "Gross warm rent = net base rent + advance payments for service charges (utilities). You can find it in your tenancy agreement or on your latest service charge statement.",
    "check.showResult": "Show result",
    "check.resultTitle": "You are likely entitled to a rent reduction!",
    "check.reductionRate": "Reduction rate",
    "check.range": "Range",
    "check.gesamtbetrachtungHint":
      "Courts do not simply add several defects together; they assess the overall impairment of the flat. The combined rate is therefore lower than the sum of the individual figures.",
    "check.flaecheTitle": "Enter the floor area",
    "check.flaecheDesc":
      "For floor area there is no range: above a 10 % shortfall the rent drops by exactly the percentage of missing area. Up to and including 10 % there is no defect at all.",
    "check.flaecheVereinbart": "Agreed area (m²)",
    "check.flaecheTatsaechlich": "Actual area (m²)",
    "check.flaecheMangel":
      "Shortfall of {abweichung} % - that is a defect. The reduction is {quote} %.",
    "check.flaecheKeinMangel":
      "Shortfall of {abweichung} % - up to and including 10 % the Federal Court of Justice sees no defect. The reduction is 0 %.",
    "check.monthlySavings": "Monthly savings",
    "check.yearlySavings": "Yearly savings",
    "check.withPermanent": "for a permanent defect",
    "check.disclaimer":
      "The calculation is based on typical court rulings and serves as a guide. The actual reduction rate may differ in individual cases. If in doubt, we recommend reducing conservatively or initially paying under reservation of rights.",
    "check.yourDefects": "Your selected defects:",
    "check.nextStep": "The next step: create a legally sound defect notice to your landlord.",
    "check.createLetter": "Create defect notice now",
    "check.editDefects": "Edit defects",
    "check.notEligibleTitle": "Probably no claim",
    "check.notEligibleHint":
      "This is an initial assessment and not legal advice. If in doubt, we recommend consulting a tenants' association or a lawyer.",
    "check.tryAgain": "Check again",

    // Eligibility questions
    "eq.mietvertrag.q": "Do you have a valid tenancy agreement?",
    "eq.mietvertrag.desc": "A rent reduction requires an existing tenancy.",
    "eq.mietvertrag.ja": "Yes",
    "eq.mietvertrag.nein": "No",
    "eq.mangel_bekannt.q": "Did you already know about the defect when you signed or took over the flat?",
    "eq.mangel_bekannt.desc": "Anyone who knows about a defect when signing cannot later reduce the rent because of it (Section 536b sentence 1 BGB). If you took the flat despite knowing, the right survives only if you reserved it (sentence 3). If the landlord fraudulently concealed the defect, your rights remain in any case (sentence 2).",
    "eq.mangel_bekannt.nein": "No, I only discovered the defect later",
    "eq.mangel_bekannt.ja_vorbehalt": "Yes, but I reserved my rights",
    "eq.mangel_bekannt.ja_arglist": "Yes, but the landlord concealed the defect",
    "eq.mangel_bekannt.ja": "Yes, without reservation",
    "eq.selbst_verursacht.q": "Did you cause the defect yourself?",
    "eq.selbst_verursacht.desc": "If the tenant caused the defect themselves, there is no right to a rent reduction.",
    "eq.selbst_verursacht.nein": "No",
    "eq.selbst_verursacht.ja": "Yes",
    "eq.selbst_verursacht.unsicher": "I'm not sure",
    "eq.erheblich.q": "How severely does the defect affect your apartment?",
    "eq.erheblich.desc": "Only significant defects justify a rent reduction (Section 536 (1) sentence 3 BGB). Several minor defects together can, however, cross that threshold.",
    "eq.erheblich.stark": "Severely — quality of living clearly restricted",
    "eq.erheblich.mittel": "Moderately — noticeable impairment",
    "eq.erheblich.gering": "Slightly — only a minor inconvenience",
    "eq.angezeigt.q": "Have you already reported the defect to your landlord?",
    "eq.angezeigt.desc": "The reduction takes effect by operation of law, even without notice. But the defect notice is what lets you enforce it (Section 536c BGB). We help you draft it.",
    "eq.angezeigt.ja": "Yes, in writing",
    "eq.angezeigt.muendlich": "Only verbally",
    "eq.angezeigt.nein": "No, not yet",
    "eq.reason.mietvertrag": "Without a valid tenancy agreement there is unfortunately no right to a rent reduction.",
    "eq.reason.mangel_bekannt": "If you knew about the defect when moving in and said nothing, the right to reduce the rent does not apply (Section 536b BGB).",
    "eq.reason.selbst_verursacht": "If you caused the defect yourself, there is no right to a rent reduction.",
    "eq.reason.erheblich": "Only significant defects justify a rent reduction. Trivial defects (Section 536 (1) sentence 3 BGB) are unfortunately not sufficient.",
    "eq.reason.default": "In this case there is unfortunately no claim.",

    // Letter
    "letter.title": "Create a defect notice",
    "letter.subtitle": "Create a legally sound defect notice under Section 536c BGB.",
    "letter.step.data": "Your details",
    "letter.step.landlord": "Landlord",
    "letter.step.defects": "Description",
    "letter.step.preview": "Preview",
    "letter.step.send": "Download",
    "letter.yourData": "Your details (tenant)",
    "letter.name": "Full name",
    "letter.street": "Street & house number",
    "letter.zip": "Postcode",
    "letter.city": "City",
    "letter.aptNr": "Apartment number (optional)",
    "letter.phone": "Phone number (optional)",
    "letter.landlordData": "Landlord details",
    "letter.landlordName": "Name of the landlord / property management",
    "letter.salutation": "Salutation in the letter",
    "letter.salutationCompany": "Company",
    "letter.salutationMs": "Ms",
    "letter.salutationMr": "Mr",
    "letter.describeDefects": "Describe the defects",
    "letter.describeHint":
      "Describe each defect as precisely as possible. The more detail, the better.",
    "letter.whichRoom": "In which room does the defect occur?",
    "letter.sincewhen": "Since when has the defect existed?",
    "letter.detailDesc": "Detailed description",
    "letter.nativeHint": "You can write in your native language — the AI translates it into German.",
    "letter.showPreview": "Show preview",
    "letter.creating": "Creating your letter...",
    "letter.previewTitle": "Preview of your defect notice",
    "letter.editHint": "You can edit the text directly before sending it.",
    "letter.signature": "Digital signature (optional)",
    "letter.clearSig": "Clear",
    "letter.sigSaved": "Saved",
    "letter.deliveryOptions": "Download or dispatch",
    "letter.backPreview": "Back to preview",
    "letter.howReceive": "Your defect notice is ready",
    "letter.downloadDesc": "Download the letter as a PDF and print it yourself.",
    "letter.free": "Free",
    "letter.downloadPdf": "Download as PDF",
    "letter.downloadTxt": "As text file",
    "letter.copyText": "Copy text",
    "letter.copied": "Copied!",
    "letter.warning":
      "Send the defect notice in a way you can document later: Einwurf-Einschreiben, a messenger with a witness, or handing it over in person against a receipt. A simple email is not sufficient proof of receipt.",

    // Teaser
    "teaser.title": "Create a defect notice",
    "teaser.desc":
      "Create a legally sound defect notice for your landlord. Start with our check to determine your claim and the amount of the rent reduction — this data flows automatically into your letter.",
    "teaser.feat1": "Legally sound template under Section 536c BGB",
    "teaser.feat2": "Automatically filled with your details",
    "teaser.feat3": "Download as PDF or text file",
    "teaser.feat4": "Digital signature possible",
    "teaser.feat5": "Input in your native language possible",
    "teaser.cta": "Check your claim — the letter is created automatically",

    // Info
    "info.title": "Your right to a rent reduction — the key facts",
    "info.subtitle": "Everything you need to know about rent reduction in Germany",
    "info.c1.title": "A statutory right",
    "info.c1.desc":
      "The rent reduction is enshrined in Section 536 BGB and takes effect automatically as soon as a significant defect exists. You do not need to apply for approval — the rent is reduced by operation of law.",
    "info.c2.title": "Cannot be waived",
    "info.c2.desc":
      "For residential tenancies, the right to reduce the rent cannot be excluded by the tenancy agreement (Section 536 (4) BGB). Clauses attempting to do so are invalid.",
    "info.c3.title": "The defect notice secures your right",
    "info.c3.desc": "The reduction arises by operation of law, even without notice. Enforcing and proving it, however, requires one: without prompt notice you lose the right in so far as the landlord could not remedy the defect for precisely that reason (Section 536c (2) sentence 2 no. 1 BGB).",
    "info.c4.title": "Gross warm rent as the basis",
    "info.c4.desc": "The rent reduction is calculated from the gross warm rent (base rent + service charges). For residential tenancies the Federal Court of Justice decided this on 20 July 2005 (case no. VIII ZR 347/04).",
    "info.c5.title": "Be careful with the amount",
    "info.c5.desc": "Arrears of more than one month's rent on two consecutive dates can already trigger termination without notice (Section 543 (2) sentence 1 no. 3 (a) BGB). When in doubt: pay the full rent under reservation and reclaim it later.",
    "info.c6.title": "Act promptly",
    "info.c6.desc":
      "The defect notice must be given without delay after discovery. If you pay the full rent for around 6 months without reservation, you risk forfeiting the right to reduce.",

    // FAQ
    "faq.badge": "Frequently asked questions",
    "faq.title": "Everything about rent reduction",
    "faq.subtitle": "Answers to the most important questions about rent reduction in Germany.",
    "faq.legal.title": "Legal notice",
    "faq.legal.text":
      "The information provided on this website is for general information purposes only and does not constitute legal advice. Despite careful research, we cannot guarantee that the content is accurate, complete or up to date. The reduction rates are based on court rulings and serve only as guide values — every individual case is assessed on its own merits. For specific legal questions, we recommend consulting a tenants' association or a lawyer.",

    // Footer
    "footer.desc":
      "We help tenants in Germany enforce their right to a rent reduction. Free check, calculation and creation of the defect notice — all in just a few minutes.",
    "footer.service": "Service",
    "footer.legal": "Legal",
    "footer.imprint": "Imprint",
    "footer.privacy": "Privacy policy",
    "footer.terms": "Terms of use",
    "footer.rights": "All rights reserved.",
    "footer.noLegal":
      "No legal advice. Information provided without guarantee. If you have questions, contact a tenants' association or a lawyer.",
    "footer.withdrawal": "Right of withdrawal",

    // Shared
    "common.note": "Note",
    "common.backHome": "Back to homepage",

    // Wizard, Frist und "Wie geht es weiter?"
    "letter.step.frist": "Deadline",
    "check.pickCategoryHint": "Pick a category to see the defects it covers.",
    "check.removeLabel": "Remove {label}",
    "check.nextStepTitle": "Next: the defect notice",
    "letter.phoneWhy": "With a number, the letter offers your landlord an appointment to fix the defect.",
    "letter.landlordDesc": "The notice has to reach the landlord or the managing agent. You will find the name in your tenancy agreement or on the service-charge statement.",
    "letter.landlordAddressHint": "Write the name exactly as it appears in the tenancy agreement. Additions like “c/o” or a very long legal form will not fit the letter's address field.",
    "letter.toDeadline": "Continue to the deadline",
    "letter.signatureDesc": "You can also download the letter unsigned and sign it by hand after printing.",
    "frist.title": "By when should your landlord fix the defect?",
    "frist.desc": "The landlord needs a reasonable deadline. Too short is contestable, too long costs you weeks.",
    "frist.days": "{n} days",
    "frist.until": "until {datum}",
    "frist.recommended": "Recommended",
    "frist.suggestion": "We suggest {n} days — that is the usual deadline for “{mangel}”. With several defects the most urgent one always decides.",
    "frist.suggestionUrgent": "We suggest {n} days. “{mangel}” cannot wait. With several defects the most urgent one always decides.",
    "frist.deliveryTitle": "The deadline runs from delivery, not from posting.",
    "frist.deliveryText": "What counts is the day the letter lands in your landlord's postbox. Add one or two working days for the post. If the deadline falls on a Saturday, Sunday or public holiday, it ends on the next working day (§ 193 BGB).",
    "frist.urgentTitle": "This one cannot wait.",
    "frist.urgentText": "Report “{mangel}” by phone as well and note when you spoke to whom. If nothing happens by the deadline, you may have the defect fixed at the landlord's expense (§ 536a Abs. 2 BGB).",
    "next.title": "What happens next?",
    "next.subtitle": "What to do now — and what to expect.",
    "next.s1.when": "Today, {datum}",
    "next.s1.text": "Print the notice, sign it and send it so that delivery can be proved: registered post with proof of delivery, a messenger with a witness, or handing it over against a receipt. A plain e-mail is not proof of delivery.",
    "next.s2.when": "Within one to three working days",
    "next.s2.text": "The letter is in your landlord's postbox. From that day they know about the defect — and from that day your deadline runs.",
    "next.s3.when": "From delivery onwards",
    "next.s3.text": "There is no statutory deadline for a reply. Many landlords get in touch within a few working days to arrange a viewing, but they are not obliged to. Keep paying the rent in full for now and write “Zahlung unter Vorbehalt wegen Mangel” in the payment reference.",
    "next.s4.when": "By {datum}",
    "next.s4.text": "Your deadline ends. The defect has to be fixed by this day. Keep documenting: dated photos, a temperature or noise log.",
    "next.s5.when": "From {datum}",
    "next.s5.text": "If nothing has happened, your landlord is in default. You can send a second letter with a final deadline, reclaim the rent you overpaid, and demand damages or self-remedy under § 536a BGB. A tenants' association or a specialist solicitor will review your case.",
    "next.caution": "When in doubt, reduce conservatively. Cutting too much and running up two months' arrears risks termination without notice (§ 543 Abs. 2 Nr. 3 BGB).",
    "next.guideLink": "Guide: writing a defect notice properly",
    "dispatch.emailLabel": "E-mail address for the confirmation",
    "dispatch.emailWhy": "We send the order confirmation and the dispatch status to this address.",
    "info.c7.title": "After you send it",
    "info.c7.desc": "Your landlord does not have to reply at once — there is no statutory deadline for a reply. What counts is the deadline for the repair: usually 14 days, shorter for urgent defects. It starts when the letter is delivered. If nothing happens by then, your landlord is in default.",

    // FAQ page
    "faq.showAll": "Show all questions & answers",
    "faqpage.allTitle": "All questions & answers",
    "faqpage.cta.title": "Didn't find your question?",
    "faqpage.cta.desc":
      "Use our free rent reduction check. In just a few steps you'll find out whether and by how much you can reduce your rent.",

    // Letter — delivery
    "letter.basedOn":
      "Based on your check: approx. {quote}% reduction at {rent} € gross warm rent.",
    // Letter — dispatch by post (eBrief). Which of the two tax notes is shown
    // follows STEUERMODUS; see the note in the German block. The German legal
    // and postal terms are kept untranslated because the tenant meets those
    // exact words on the German postal receipt and in German law — including
    // the § 19 sentence itself, which cites a statute verbatim. `taxNoteRegel`
    // cites nothing and is therefore written in English.
    "dispatch.title": "Send it straight to your landlord",
    "dispatch.subtitle":
      "We print your defect notice and post it — you need neither a printer nor a stamp.",
    "dispatch.chooseProduct": "Choose how to send it",
    "dispatch.brief": "As a letter",
    "dispatch.einschreiben": "As an Einwurf-Einschreiben",
    "dispatch.einschreibenHint":
      "The postal service records the delivery into the letterbox. As soon as it is reported, we email you the shipment number and the tracking link. It is not an Übergabe-Einschreiben signed for by the recipient — and no postal product can provide conclusive proof of receipt.",
    "dispatch.taxNote": "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.",
    "dispatch.taxNoteRegel":
      "All prices are final prices including 19 % German VAT (Umsatzsteuer).",
    "dispatch.send": "Send (chargeable)",
    "dispatch.consentHeading": "Before we may start printing",
    "dispatch.consentStart":
      "I expressly request that you begin printing and sending my defect notice before the withdrawal period expires.",
    "dispatch.consentExpiry":
      "I understand that my right of withdrawal expires as soon as you have fully performed the service — that is, as soon as the letter has been printed and handed over for delivery. I hereby confirm that I am aware of this.",
    "dispatch.consentLink": "Right of withdrawal",
    "dispatch.error.zustimmung_fehlt":
      "Please confirm both declarations — without them we may not print and send the letter before the withdrawal period ends.",
    "dispatch.preparing": "Preparing your letter...",
    "dispatch.checkingAddress": "Checking the address...",
    "dispatch.redirecting": "Taking you to payment...",
    "dispatch.confirmSend": "Address is correct — send (chargeable)",
    "dispatch.addressWarning":
      "Your landlord's address could not be verified with certainty. Please check it before you pay.",
    "dispatch.showMarked": "View the detected address",
    "dispatch.fixAddress": "Correct your landlord's address",
    "dispatch.freeStays":
      "The free download stays available to you either way.",
    "dispatch.result.erfolg.title": "Payment successful",
    "dispatch.result.erfolg.text":
      "Thank you — your payment has arrived. Your defect notice will now be printed and posted to your landlord.",
    "dispatch.result.erfolg.note":
      "You will receive confirmation by email at the address you gave when sending. There is nothing further you need to do. For data protection reasons your defect notice is not stored in your browser, so it cannot be shown here again.",
    "dispatch.result.abbruch.title": "Payment cancelled",
    "dispatch.result.abbruch.text":
      "Nothing was sent and nothing was charged.",
    "dispatch.result.abbruch.note":
      "For data protection reasons your defect notice is not stored in your browser, so it is no longer available. If you would like to send it or download it free of charge, please fill in the form once more — it only takes a few minutes.",
    "dispatch.result.restartCta": "Create a new defect notice",
    "dispatch.hint.kopf":
      "The letterhead was not recognised, so the addresses may also appear inside the body of the letter.",
    "dispatch.hint.datum":
      "No date line was found in the letter. Please check that the date appears in the text.",
    "dispatch.hint.absender":
      "Your return address line was shortened so that it fits the address field.",
    "dispatch.error.allgemein":
      "Sending is not possible at the moment. Please try again later.",
    "dispatch.error.versand_nicht_konfiguriert":
      "Postal dispatch is currently unavailable. Please download the defect notice above and send it yourself.",
    "dispatch.error.zu_viele_anfragen":
      "Too many send attempts have been started. Please try again in an hour.",
    "dispatch.error.unvollstaendig":
      "Some details are missing. Please go back and complete your address, your email address and your landlord's address.",
    "dispatch.error.anschrift_zu_lang":
      "Your landlord's address is too long for the address field. Please shorten the name, street or town — for example additions such as \u201Cc/o\u201D or the legal form.",
    "dispatch.error.pdf_fehler":
      "The letter could not be generated. Please draw your signature again or leave it out, then try once more.",
    "dispatch.error.ebrief_fehler":
      "Our dispatch provider is not responding right now. Please try again in a few minutes — nothing was charged.",
    "dispatch.error.preis_unplausibel":
      "This letter cannot be sent at the stated price, most likely because it is too long. Please shorten the text and try again.",
    "dispatch.error.token_ungueltig":
      "The dispatch session has expired. Please start sending again.",
    "dispatch.error.jobId_ungueltig":
      "The dispatch session could not be matched. Please start sending again.",
    "dispatch.error.kein_dokument":
      "The letter is still being processed. Please wait a moment and try again.",
    "dispatch.error.bereits_versendet":
      "This defect notice has already been sent. You will not be charged again.",
    "dispatch.error.versand_nicht_moeglich":
      "This dispatch cannot be paid for. Please start the dispatch again — nothing has been charged.",
    "dispatch.error.checkout_fehler":
      "The payment page could not be opened. Please try again — nothing was charged.",
    "dispatch.error.zeitueberschreitung":
      "This is taking longer than expected. Please try again in a few minutes — nothing was charged.",
  },

  tr: {
    "nav.check": "Hak kontrolü",
    "nav.letter": "Kusur bildirimi",
    "nav.how": "Nasıl çalışır",
    "nav.faq": "SSS",
    "nav.table": "Tablo",
    "nav.guide": "Rehber",
    "nav.send": "Mektup gönder",
    "versand.teaser.eyebrow": "Sadece kontrol değil — hallet",
    "versand.teaser.more": "Gönderim nasıl işliyor",

    // SEO metadata for the pages that exist in every language
    "seo.home.title":
      "Almanya'da Kira İndirimi: Hakkınızı Kontrol Edin ve Mektubu Gönderin",
    "seo.home.description":
      "Almanya'da kiranızı düşürüp düşüremeyeceğinizi ücretsiz kontrol edin: indirim oranını hesaplayın, § 536c BGB'ye uygun kusur bildirimi hazırlayın ve ev sahibinize postalatın.",
    "seo.faq.title": "Almanya'da Kira İndirimi: Sık Sorulan Sorular",
    "seo.faq.description":
      "Kira indirimi hakkındaki temel sorular: ne kadar indirim yapabilirsiniz, indirim ne zaman başlar ve ev sahibinin onayı gerekir mi? Alman Medeni Kanunu'na dayalı açıklamalar.",
    "nav.cta": "Şimdi kontrol et",
    "hero.badge": "§ 536 BGB'ye dayalı: yasal hakkınız",
    "hero.title1": "Küf, gürültü, bozuk kalorifer? Ne kadar",
    "hero.title2": "kira indirimi",
    "hero.title3": "hakkınız var?",
    "hero.subtitle":
      "Kusur bildirimini 2 dakikada oluşturun ve ücretsiz indirin. İsterseniz doğrudan mektup veya Einwurf-Einschreiben olarak gönderin.",
    "hero.cta1": "Hakkınızı ücretsiz kontrol edin",
    "hero.cta2": "Kusur bildirimi oluştur",
    "hero.selectLang": "Dil seçin",
    "hero.stat1label": "BGB: Yasal hakkınız",
    "hero.stat2": "%100'e kadar",
    "hero.stat2label": "Kira indirimi mümkün",
    "hero.stat3": "2 dk.",
    "hero.stat3label": "Online hak kontrolü",
    "how.title": "Nasıl çalışır",
    "how.subtitle": "4 basit adımda kira indirimi hakkınıza ulaşın",
    "how.step": "ADIM",
    "how.s1.title": "Kusur seçin",
    "how.s1.desc": "60'tan fazla tipik konut kusurundan uygun olanı seçin, ısıtma arızasından küfe kadar.",
    "how.s2.title": "İndirimi hesaplayın",
    "how.s2.desc": "Güncel mahkeme kararlarına göre ne kadar kira indirimi hakkınız olduğunu hesaplıyoruz.",
    "how.s3.title": "Kusur bildirimi oluştur",
    "how.s3.desc": "Bilgilerinizden § 536c BGB'ye uygun yasal bir kusur bildirimi oluşturuyoruz.",
    "how.s4.title": "Mektubu indir",
    "how.s4.desc":
      "Hazır kusur bildirimini PDF veya metin dosyası olarak indirin, ücretsiz ve kayıt gerektirmez. Ya da ev sahibinize mektup veya Einwurf-Einschreiben olarak bizim göndermemizi sağlayın.",
    "check.phase.eligibility": "Kontrol",
    "check.phase.defects": "Kusurlar",
    "check.phase.rent": "Kira",
    "check.result": "Sonuç",
    "check.back": "Geri",
    "check.next": "İleri",
    "check.allCategories": "Tüm kategoriler",
    "check.whichDefects": "Hangi kusurlar mevcut?",
    "check.whichDefectsDesc": "Bir kategori seçin ve ardından ilgili kusurları işaretleyin. Birden fazla kusur seçebilirsiniz.",
    "check.selected": "kusur seçildi",
    "check.approxReduction": "İndirim",
    "check.rentTitle": "Aylık kiranız ne kadar?",
    "check.rentDesc":
      "Brüt sıcak kiranızı girin (soğuk kira + tüm yan giderler). Kira indirimi brüt sıcak kiradan hesaplanır.",
    "check.rentPlaceholder": "örn. 1000",
    "check.rentInfo": "Brüt sıcak kira = Net soğuk kira + İşletme giderleri ön ödemesi.",
    "check.showResult": "Sonucu göster",
    "check.resultTitle": "Muhtemelen kira indirimi hakkınız var!",
    "check.reductionRate": "İndirim oranı",
    "check.range": "Aralık",
    "check.gesamtbetrachtungHint":
      "Mahkemeler birden fazla kusuru toplamaz, konutun genel kullanım kaybını değerlendirir. Bu nedenle toplam oran, tek tek değerlerin toplamından düşüktür.",
    "check.flaecheTitle": "Konut alanını girin",
    "check.flaecheDesc":
      "Konut alanında aralık yoktur: Sapma %10'u aştığında kira, eksik alanın yüzdesi kadar azalır. %10 ve altındaki sapmalarda kusur yoktur.",
    "check.flaecheVereinbart": "Sözleşmedeki alan (m²)",
    "check.flaecheTatsaechlich": "Gerçek alan (m²)",
    "check.flaecheMangel":
      "Sapma %{abweichung} - bu bir kusurdur. İndirim oranı %{quote}.",
    "check.flaecheKeinMangel":
      "Sapma %{abweichung} - %10 ve altında Federal Adalet Divanı'na göre kusur yoktur. İndirim %0.",
    "check.monthlySavings": "Aylık tasarruf",
    "check.yearlySavings": "Yıllık tasarruf",
    "check.withPermanent": "kalıcı kusurda",
    "check.disclaimer":
      "Hesaplama tipik mahkeme kararlarına dayanmaktadır ve yol göstericidir. Gerçek indirim oranı bireysel duruma göre farklılık gösterebilir.",
    "check.yourDefects": "Seçtiğiniz kusurlar:",
    "check.nextStep": "Sonraki adım: Ev sahibinize yasal olarak geçerli bir kusur bildirimi oluşturun.",
    "check.createLetter": "Şimdi kusur bildirimi oluştur",
    "check.editDefects": "Kusurları düzenle",
    "check.notEligibleTitle": "Muhtemelen hak yok",
    "check.notEligibleHint": "Bu ilk bir değerlendirmedir. Şüphe durumunda bir kiracı derneğine veya avukata danışmanızı öneririz.",
    "check.tryAgain": "Tekrar kontrol et",
    "eq.mietvertrag.q": "Geçerli bir kira sözleşmeniz var mı?",
    "eq.mietvertrag.desc": "Kira indirimi, mevcut bir kira ilişkisini gerektirir.",
    "eq.mietvertrag.ja": "Evet",
    "eq.mietvertrag.nein": "Hayır",
    "eq.mangel_bekannt.q": "Sözleşmeyi imzalarken veya daireyi teslim alırken kusuru biliyor muydunuz?",
    "eq.mangel_bekannt.desc": "Sözleşme kurulurken kusuru bilen kişi bu nedenle sonradan indirim yapamaz (BGB § 536b c. 1). Bilerek teslim alındığında hak, ancak haklarınızı saklı tuttuysanız korunur (c. 3). Ev sahibi kusuru hileyle gizlediyse haklarınız her hâlükârda devam eder (c. 2).",
    "eq.mangel_bekannt.nein": "Hayır, kusuru sonradan fark ettim",
    "eq.mangel_bekannt.ja_vorbehalt": "Evet, ancak haklarımı saklı tuttum",
    "eq.mangel_bekannt.ja_arglist": "Evet, ancak ev sahibi kusuru gizledi",
    "eq.mangel_bekannt.ja": "Evet, çekince koymadan",
    "eq.selbst_verursacht.q": "Kusura kendiniz mi neden oldunuz?",
    "eq.selbst_verursacht.desc": "Kiracı kusura kendisi neden olduysa, indirim hakkı düşer.",
    "eq.selbst_verursacht.nein": "Hayır",
    "eq.selbst_verursacht.ja": "Evet",
    "eq.selbst_verursacht.unsicher": "Emin değilim",
    "eq.erheblich.q": "Kusur dairenizi ne kadar etkiliyor?",
    "eq.erheblich.desc": "Yalnızca önemli kusurlar kira indirimine hak verir (BGB § 536 f. 1 c. 3). Ancak birden fazla küçük kusur birlikte bu eşiği aşabilir.",
    "eq.erheblich.stark": "Güçlü: yaşam kalitesi belirgin şekilde kısıtlı",
    "eq.erheblich.mittel": "Orta: hissedilir etki",
    "eq.erheblich.gering": "Hafif: sadece küçük rahatsızlık",
    "eq.angezeigt.q": "Kusuru ev sahibinize bildirdiniz mi?",
    "eq.angezeigt.desc": "İndirim, bildirim olmasa da kanun gereği devreye girer. Ancak kusur bildirimi, onu uygulamak için belirleyicidir (BGB § 536c). Hazırlamanıza yardımcı oluyoruz.",
    "eq.angezeigt.ja": "Evet, yazılı olarak",
    "eq.angezeigt.muendlich": "Sadece sözlü",
    "eq.angezeigt.nein": "Hayır, henüz değil",
    "eq.reason.mietvertrag": "Geçerli bir kira sözleşmesi olmadan maalesef kira indirimi hakkı yoktur.",
    "eq.reason.mangel_bekannt": "Taşınırken kusuru biliyorsanız ve itiraz etmediyseniz, indirim hakkı düşer (§ 536b BGB).",
    "eq.reason.selbst_verursacht": "Kusura kendiniz neden olduysa, kira indirimi hakkı yoktur.",
    "eq.reason.erheblich": "Yalnızca önemli kusurlar kira indirimine hak kazandırır. Önemsiz kusurlar (§ 536 Abs. 1 S. 3 BGB) maalesef yeterli değildir.",
    "eq.reason.default": "Bu durumda maalesef hak yoktur.",
    "letter.title": "Kusur bildirimi oluştur",
    "letter.subtitle": "§ 536c BGB'ye uygun yasal bir kusur bildirimi oluşturun.",
    "letter.step.data": "Bilgileriniz",
    "letter.step.landlord": "Ev sahibi",
    "letter.step.defects": "Açıklama",
    "letter.step.preview": "Önizleme",
    "letter.step.send": "İndirme",
    "letter.yourData": "Bilgileriniz (Kiracı)",
    "letter.name": "Tam ad",
    "letter.street": "Cadde ve bina no",
    "letter.zip": "Posta kodu",
    "letter.city": "Şehir",
    "letter.aptNr": "Daire numarası (opsiyonel)",
    "letter.phone": "Telefon numarası (isteğe bağlı)",
    "letter.landlordData": "Ev sahibi bilgileri",
    "letter.landlordName": "Ev sahibi / Yönetim şirketi adı",
    "letter.salutation": "Mektuptaki hitap",
    "letter.salutationCompany": "Şirket",
    "letter.salutationMs": "Sayın (kadın)",
    "letter.salutationMr": "Sayın (erkek)",
    "letter.describeDefects": "Kusurları açıklayın",
    "letter.describeHint": "Her kusuru mümkün olduğunca ayrıntılı açıklayın. Ne kadar detaylı olursa o kadar iyi.",
    "letter.whichRoom": "Kusur hangi odada ortaya çıkıyor?",
    "letter.sincewhen": "Kusur ne zamandan beri mevcut?",
    "letter.detailDesc": "Ayrıntılı açıklama",
    "letter.nativeHint": "Kendi ana dilinizde yazabilirsiniz, yapay zeka Almancaya çevirecek.",
    "letter.showPreview": "Önizleme göster",
    "letter.creating": "Mektup oluşturuluyor...",
    "letter.previewTitle": "Kusur bildirimi önizlemesi",
    "letter.editHint": "Metni göndermeden önce doğrudan düzenleyebilirsiniz.",
    "letter.signature": "Dijital imza (opsiyonel)",
    "letter.clearSig": "Temizle",
    "letter.sigSaved": "Kaydedildi",
    "letter.deliveryOptions": "İndirme veya gönderim",
    "letter.backPreview": "Önizlemeye geri dön",
    "letter.howReceive": "Kusur bildiriminiz hazır",
    "letter.downloadDesc": "Mektubu PDF olarak indirin ve kendiniz yazdırın.",
    "letter.free": "Ücretsiz",
    "letter.downloadPdf": "PDF olarak indir",
    "letter.downloadTxt": "Metin dosyası olarak",
    "letter.copyText": "Metni kopyala",
    "letter.copied": "Kopyalandı!",
    "letter.warning":
      "Kusur bildirimini sonradan belgeleyebileceğiniz bir yolla gönderin: Einwurf-Einschreiben, tanıklı kurye ya da teslim belgesi karşılığında elden teslim. Basit bir e-posta tebliğ kanıtı olarak yeterli değildir.",
    "teaser.title": "Kusur bildirimi oluştur",
    "teaser.desc":
      "Ev sahibinize yasal olarak geçerli bir kusur bildirimi oluşturun. Önce hakkınızı ve kira indirimi miktarını belirlemek için kontrolümüzü kullanın.",
    "teaser.feat1": "§ 536c BGB'ye uygun yasal şablon",
    "teaser.feat2": "Bilgilerinizle otomatik doldurulur",
    "teaser.feat3": "PDF veya metin dosyası olarak indirin",
    "teaser.feat4": "Dijital imza mümkün",
    "teaser.feat5": "Kendi ana dilinizde doldurabilirsiniz",
    "teaser.cta": "Hakkı kontrol et: mektup otomatik oluşturulur",
    "info.title": "Kira indirimi hakkınız: en önemli bilgiler",
    "info.subtitle": "Almanya'da kira indirimi hakkında bilmeniz gereken her şey",
    "info.c1.title": "Yasal hak",
    "info.c1.desc": "Kira indirimi § 536 BGB'de yasal olarak düzenlenmiştir ve önemli bir kusur olduğunda otomatik olarak devreye girer.",
    "info.c2.title": "Vazgeçilemez",
    "info.c2.desc": "Konut kirasında indirim hakkı kira sözleşmesiyle hariç tutulamaz (§ 536 Abs. 4 BGB).",
    "info.c3.title": "Kusur bildirimi hakkınızı güvence altına alır",
    "info.c3.desc": "İndirim bildirim olmadan da kanun gereği doğar. Ancak uygulamak ve ispatlamak için bildirim şarttır: Gecikmeksizin bildirmezseniz, ev sahibinin tam da bu yüzden gideremediği ölçüde hakkınızı kaybedersiniz (BGB § 536c f. 2 c. 2 No. 1).",
    "info.c4.title": "Brüt sıcak kira temel alınır",
    "info.c4.desc": "Kira indirimi brüt sıcak kira üzerinden hesaplanır (soğuk kira + işletme giderleri). Konut kirası için Federal Adalet Divanı bunu 20.07.2005 tarihli kararıyla belirlemiştir (Az. VIII ZR 347/04).",
    "info.c5.title": "Miktara dikkat",
    "info.c5.desc": "Üst üste iki ödeme tarihinde bir aylık kiradan fazla borç, derhal feshi tetikleyebilir (BGB § 543 f. 2 c. 1 No. 3 bent a). Şüphe hâlinde: Kirayı çekince koyarak tam ödeyin ve sonra geri isteyin.",
    "info.c6.title": "Zamanında harekete geçin",
    "info.c6.desc": "Kusur bildirimi keşfedildikten hemen sonra yapılmalıdır. 6 aydan fazla tam kira ödemek hakkın kaybına yol açabilir.",
    "faq.badge": "Sık Sorulan Sorular",
    "faq.title": "Kira indirimi hakkında her şey",
    "faq.subtitle": "Almanya'da kira indirimi konusundaki en önemli soruların yanıtları.",
    "faq.legal.title": "Yasal uyarı",
    "faq.legal.text":
      "Bu web sitesinde sunulan bilgiler yalnızca genel bilgilendirme amaçlıdır ve hukuki danışmanlık teşkil etmez.",
    "footer.desc": "Almanya'daki kiracılara kira indirimi haklarını kullanmalarında yardımcı oluyoruz.",
    "footer.service": "Hizmet",
    "footer.legal": "Yasal",
    "footer.imprint": "Künye",
    "footer.privacy": "Gizlilik",
    "footer.terms": "Koşullar",
    "footer.rights": "Tüm hakları saklıdır.",
    "footer.noLegal": "Hukuki danışmanlık değildir. Bilgiler garanti edilmez.",
    "footer.withdrawal": "Cayma hakkı",

    // Shared
    "common.note": "Not",
    "common.backHome": "Ana sayfaya",

    // Wizard, Frist und "Wie geht es weiter?"
    "letter.step.frist": "Süre",
    "check.pickCategoryHint": "İlgili kusurları görmek için bir kategori seçin.",
    "check.removeLabel": "{label} kaldır",
    "check.nextStepTitle": "Sıradaki adım: kusur bildirimi",
    "letter.phoneWhy": "Numara verirseniz mektupta ev sahibinize onarım için randevu önerilir.",
    "letter.landlordDesc": "Bildirimin ev sahibine veya yöneticiye ulaşması gerekir. Adı kira sözleşmenizde veya işletme gideri hesabınızda bulabilirsiniz.",
    "letter.landlordAddressHint": "Adı kira sözleşmesindeki gibi yazın. “c/o” gibi ekler veya çok uzun şirket unvanları mektubun adres alanına sığmaz.",
    "letter.toDeadline": "Süreye geç",
    "letter.signatureDesc": "Mektubu imzasız da indirip yazdırdıktan sonra elle imzalayabilirsiniz.",
    "frist.title": "Ev sahibiniz kusuru ne zamana kadar gidermeli?",
    "frist.desc": "Ev sahibinin makul bir süreye ihtiyacı var. Çok kısası itiraz edilebilir, çok uzunu haftalarınıza mal olur.",
    "frist.days": "{n} gün",
    "frist.until": "{datum} tarihine kadar",
    "frist.recommended": "Önerilen",
    "frist.suggestion": "{n} gün öneriyoruz — “{mangel}” için olağan süre budur. Birden fazla kusurda her zaman en acili belirleyicidir.",
    "frist.suggestionUrgent": "{n} gün öneriyoruz. “{mangel}” beklemeye gelmez. Birden fazla kusurda her zaman en acili belirleyicidir.",
    "frist.deliveryTitle": "Süre gönderimden değil, ulaşmadan itibaren işler.",
    "frist.deliveryText": "Belirleyici olan, mektubun ev sahibinizin posta kutusuna ulaştığı gündür. Posta için bir ila iki iş günü ekleyin. Süre sonu cumartesi, pazar veya resmî tatile denk gelirse, süre bir sonraki iş günü biter (§ 193 BGB).",
    "frist.urgentTitle": "Burada acele gerekir.",
    "frist.urgentText": "“{mangel}” durumunu ayrıca telefonla bildirin ve kiminle ne zaman konuştuğunuzu not edin. Süre sonuna kadar bir şey olmazsa kusuru ev sahibinin masrafıyla giderttirebilirsiniz (§ 536a Abs. 2 BGB).",
    "next.title": "Bundan sonra ne olacak?",
    "next.subtitle": "Şimdi ne yapmalısınız — ve neyi bekleyebilirsiniz.",
    "next.s1.when": "Bugün, {datum}",
    "next.s1.text": "Bildirimi yazdırın, imzalayın ve ulaştığı kanıtlanabilir şekilde gönderin: teslim belgeli iadeli taahhütlü, tanıklı kurye ya da imza karşılığı elden teslim. Sıradan bir e-posta ulaşma kanıtı sayılmaz.",
    "next.s2.when": "Bir ila üç iş günü içinde",
    "next.s2.text": "Mektup ev sahibinizin posta kutusundadır. O günden itibaren kusuru bilir — ve o günden itibaren süreniz işler.",
    "next.s3.when": "Ulaşmasından itibaren",
    "next.s3.text": "Yanıt için yasal bir süre yoktur. Birçok ev sahibi birkaç iş günü içinde randevu için iletişime geçer, ancak buna mecbur değildir. Kirayı şimdilik tam ödemeye devam edin ve açıklama alanına şunu yazın: “Zahlung unter Vorbehalt wegen Mangel”.",
    "next.s4.when": "{datum} tarihine kadar",
    "next.s4.text": "Sürenizin sonu. Kusurun bu güne kadar giderilmiş olması gerekir. Belgelemeye devam edin: tarihli fotoğraflar, sıcaklık veya gürültü kaydı.",
    "next.s5.when": "{datum} tarihinden itibaren",
    "next.s5.text": "Hiçbir şey olmadıysa ev sahibiniz temerrüde düşmüştür. Son bir süre tanıyan ikinci bir yazı gönderebilir, fazla ödediğiniz kirayı geri isteyebilir ve § 536a BGB uyarınca tazminat ya da ikame ifa talep edebilirsiniz. Bir kiracı derneği veya uzman avukat durumunuzu inceler.",
    "next.caution": "Şüpheye düşerseniz temkinli indirin. Fazla kesip iki aylık kira borcu biriktiren, ihbarsız fesih riskine girer (§ 543 Abs. 2 Nr. 3 BGB).",
    "next.guideLink": "Rehber: kusur bildirimi nasıl doğru yazılır",
    "dispatch.emailLabel": "Onay için e-posta adresi",
    "dispatch.emailWhy": "Sipariş onayını ve gönderim durumunu bu adrese göndeririz.",
    "info.c7.title": "Gönderdikten sonra",
    "info.c7.desc": "Ev sahibinizin hemen yanıt verme zorunluluğu yoktur — yanıt için yasal bir süre yoktur. Önemli olan giderme süresidir: kural olarak 14 gün, acil kusurlarda daha kısa. Süre, mektubun ulaşmasıyla başlar. O zamana kadar bir şey olmazsa ev sahibiniz temerrüde düşer.",

    // FAQ page
    "faq.showAll": "Tüm soru ve cevapları göster",
    "faqpage.allTitle": "Tüm sorular ve cevaplar",
    "faqpage.cta.title": "Sorunuz burada yok muydu?",
    "faqpage.cta.desc":
      "Ücretsiz kira indirimi kontrolümüzü kullanın. Birkaç adımda indirim yapıp yapamayacağınızı ve ne kadar indirebileceğinizi öğrenin.",

    // Letter - delivery
    "letter.basedOn":
      "Kontrolünüze dayanmaktadır: {rent} € brüt sıcak kirada yaklaşık %{quote} indirim.",

    // Letter — dispatch by post (eBrief)
    "dispatch.title": "Doğrudan ev sahibine gönderin",
    "dispatch.subtitle":
      "Kusur bildiriminizi biz yazdırıp postaya veriyoruz — ne yazıcıya ne de pula ihtiyacınız var.",
    "dispatch.chooseProduct": "Gönderim türünü seçin",
    "dispatch.brief": "Normal mektup olarak",
    "dispatch.einschreiben": "Einwurf-Einschreiben olarak",
    "dispatch.einschreibenHint":
      "Posta, mektubun posta kutusuna atılmasını kaydeder. Teslimat bildirilir bildirilmez gönderi numarasını ve takip bağlantısını size e-posta ile iletiriz. Bu, alıcının imzasını gerektiren bir Übergabe-Einschreiben değildir — ve hiçbir posta ürünü kesin bir tebliğ kanıtı sağlayamaz.",
    "dispatch.taxNote":
      "§ 19 UStG uyarınca katma değer vergisi hesaplanmaz.",
    "dispatch.taxNoteRegel":
      "Tüm fiyatlar, %19 katma değer vergisi dahil nihai fiyatlardır.",
    "dispatch.send": "Ücretli olarak gönder",
    "dispatch.consentHeading": "Baskıya başlayabilmemiz için",
    "dispatch.consentStart":
      "Kusur bildirimimin basımına ve gönderimine cayma süresi dolmadan başlamanızı açıkça talep ediyorum.",
    "dispatch.consentExpiry":
      "Hizmeti tamamen ifa ettiğinizde — yani mektup basılıp teslimata verildiğinde — cayma hakkımın sona ereceğini biliyorum. Bunu bildiğimi burada teyit ediyorum.",
    "dispatch.consentLink": "Cayma hakkı",
    "dispatch.error.zustimmung_fehlt":
      "Lütfen her iki beyanı da onaylayın; aksi hâlde mektubu cayma süresi dolmadan basıp gönderemeyiz.",
    "dispatch.preparing": "Gönderi hazırlanıyor...",
    "dispatch.checkingAddress": "Adres kontrol ediliyor...",
    "dispatch.redirecting": "Ödemeye yönlendiriliyorsunuz...",
    "dispatch.confirmSend": "Adres doğru — ücretli olarak gönder",
    "dispatch.addressWarning":
      "Ev sahibinin adresi kesin olarak doğrulanamadı. Ücretli gönderimden önce lütfen adresi kontrol edin.",
    "dispatch.showMarked": "Algılanan adresi görüntüle",
    "dispatch.fixAddress": "Ev sahibinin adresini düzelt",
    "dispatch.freeStays": "Ücretsiz indirme her durumda kullanılabilir kalır.",
    "dispatch.result.erfolg.title": "Ödeme başarılı",
    "dispatch.result.erfolg.text":
      "Teşekkür ederiz — ödemeniz alındı. Kusur bildiriminiz şimdi yazdırılıp posta ile ev sahibinize gönderilecek.",
    "dispatch.result.erfolg.note":
      "Onayı, gönderim sırasında verdiğiniz e-posta adresine alacaksınız. Bunun için başka bir şey yapmanız gerekmiyor. Kusur bildiriminiz veri koruma nedeniyle tarayıcınızda saklanmaz, bu yüzden burada tekrar gösterilemez.",
    "dispatch.result.abbruch.title": "Ödeme iptal edildi",
    "dispatch.result.abbruch.text":
      "Hiçbir şey gönderilmedi ve hiçbir ücret tahsil edilmedi.",
    "dispatch.result.abbruch.note":
      "Kusur bildiriminiz veri koruma nedeniyle tarayıcınızda saklanmaz ve bu nedenle artık kullanılamıyor. Göndermek veya ücretsiz indirmek isterseniz lütfen formu yeniden doldurun — bu yalnızca birkaç dakika sürer.",
    "dispatch.result.restartCta": "Kusur bildirimini yeniden oluştur",
    "dispatch.hint.kopf":
      "Mektup başlığı tanınamadı. Bu nedenle adresler mektup metninde ikinci kez görünebilir.",
    "dispatch.hint.datum":
      "Mektupta tarih satırı bulunamadı. Lütfen tarihin metinde yer aldığını kontrol edin.",
    "dispatch.hint.absender":
      "Gönderen satırınız adres alanına sığması için kısaltıldı.",
    "dispatch.error.allgemein":
      "Gönderim şu anda mümkün değil. Lütfen daha sonra tekrar deneyin.",
    "dispatch.error.versand_nicht_konfiguriert":
      "Posta gönderimi şu anda kullanılamıyor. Lütfen kusur bildirimini yukarıdan indirip kendiniz gönderin.",
    "dispatch.error.zu_viele_anfragen":
      "Çok fazla gönderim denemesi yapıldı. Lütfen bir saat sonra tekrar deneyin.",
    "dispatch.error.unvollstaendig":
      "Bilgiler eksik. Lütfen geri dönüp adresinizi, e-posta adresinizi ve ev sahibinin adresini tamamlayın.",
    "dispatch.error.anschrift_zu_lang":
      "Ev sahibinin adresi adres alanı için çok uzun. Lütfen adı, sokağı veya şehri kısaltın — örneğin „c/o“ gibi ekleri veya şirket türünü çıkarın.",
    "dispatch.error.pdf_fehler":
      "Mektup oluşturulamadı. Lütfen imzanızı yeniden çizin ya da imzasız devam edip tekrar deneyin.",
    "dispatch.error.ebrief_fehler":
      "Gönderim hizmet sağlayıcımız şu anda yanıt vermiyor. Lütfen birkaç dakika sonra tekrar deneyin — hiçbir ücret alınmadı.",
    "dispatch.error.preis_unplausibel":
      "Bu mektup belirtilen fiyata gönderilemiyor, muhtemelen çok uzun olduğu için. Lütfen metni kısaltıp tekrar deneyin.",
    "dispatch.error.token_ungueltig":
      "Gönderim işleminin süresi doldu. Lütfen gönderimi yeniden başlatın.",
    "dispatch.error.jobId_ungueltig":
      "Gönderim işlemi bulunamadı. Lütfen gönderimi yeniden başlatın.",
    "dispatch.error.kein_dokument":
      "Mektup hâlâ işleniyor. Lütfen biraz bekleyip tekrar deneyin.",
    "dispatch.error.bereits_versendet":
      "Bu kusur bildirimi zaten gönderildi. Yeniden ücret alınmayacaktır.",
    "dispatch.error.versand_nicht_moeglich":
      "Bu gönderim işlemi için ödeme yapılamıyor. Lütfen gönderimi yeniden başlatın — herhangi bir ücret alınmadı.",
    "dispatch.error.checkout_fehler":
      "Ödeme sayfası açılamadı. Lütfen tekrar deneyin — hiçbir ücret alınmadı.",
    "dispatch.error.zeitueberschreitung":
      "İşlem beklenenden uzun sürüyor. Lütfen birkaç dakika sonra tekrar deneyin — hiçbir ücret alınmadı.",
  },

  uk: {
    "nav.check": "Перевірка",
    "nav.letter": "Повідомлення",
    "nav.how": "Як це працює",
    "nav.faq": "FAQ",
    "nav.table": "Таблиця",
    "nav.guide": "Порадник",
    "nav.send": "Надіслати лист",
    "versand.teaser.eyebrow": "Не лише перевірити — зробити",
    "versand.teaser.more": "Як працює надсилання",

    // SEO metadata for the pages that exist in every language
    "seo.home.title":
      "Зниження орендної плати в Німеччині: перевірте право та надішліть лист",
    "seo.home.description":
      "Безкоштовно перевірте, чи можете ви зменшити орендну плату в Німеччині: розрахуйте розмір зниження, складіть повідомлення про дефекти за § 536c BGB і замовте його надсилання орендодавцю.",
    "seo.faq.title":
      "Зниження орендної плати в Німеччині: часті запитання",
    "seo.faq.description":
      "Головні запитання про зниження орендної плати: на скільки можна зменшити, з якого моменту діє зниження і чи потрібна згода орендодавця. На основі німецького цивільного кодексу.",
    "nav.cta": "Перевірити зараз",
    "hero.badge": "На основі § 536 BGB: ваше законне право",
    "hero.title1": "Пліснява, шум, зламане опалення? Ось яке",
    "hero.title2": "зниження орендної плати",
    "hero.title3": "вам належить.",
    "hero.subtitle":
      "Створіть повідомлення про дефект за 2 хвилини та завантажте безкоштовно. За бажанням надішліть його одразу листом або як Einwurf-Einschreiben.",
    "hero.cta1": "Безкоштовно перевірити право",
    "hero.cta2": "Створити повідомлення про дефект",
    "hero.selectLang": "Обрати мову",
    "hero.stat1label": "BGB: ваше законне право",
    "hero.stat2": "до 100%",
    "hero.stat2label": "Зниження оренди можливе",
    "hero.stat3": "2 хв.",
    "hero.stat3label": "Онлайн перевірка права",
    "how.title": "Як це працює",
    "how.subtitle": "У 4 простих кроки до вашого права на зниження оренди",
    "how.step": "КРОК",
    "how.s1.title": "Оберіть дефект",
    "how.s1.desc": "Оберіть з понад 60 типових дефектів житла, від поломки опалення до цвілі.",
    "how.s2.title": "Розрахуйте зниження",
    "how.s2.desc": "Ми розрахуємо на основі актуальних судових рішень, яке зниження оренди вам належить.",
    "how.s3.title": "Створіть повідомлення",
    "how.s3.desc": "З ваших даних ми генеруємо юридично обґрунтоване повідомлення згідно § 536c BGB.",
    "how.s4.title": "Завантажте лист",
    "how.s4.desc":
      "Завантажте готове повідомлення про недоліки у форматі PDF або текстового файлу, безкоштовно й без реєстрації. Або доручіть нам надіслати його орендодавцю листом чи як Einwurf-Einschreiben.",
    "check.phase.eligibility": "Перевірка",
    "check.phase.defects": "Дефекти",
    "check.phase.rent": "Оренда",
    "check.result": "Результат",
    "check.back": "Назад",
    "check.next": "Далі",
    "check.allCategories": "Усі категорії",
    "check.whichDefects": "Які дефекти наявні?",
    "check.whichDefectsDesc": "Оберіть категорію, а потім відповідні дефекти. Можна обрати кілька.",
    "check.selected": "дефектів обрано",
    "check.approxReduction": "Зниження",
    "check.rentTitle": "Яка ваша щомісячна оренда?",
    "check.rentDesc": "Введіть вашу брутто теплу оренду (холодна оренда + усі додаткові витрати).",
    "check.rentPlaceholder": "напр. 1000",
    "check.rentInfo": "Брутто тепла оренда = Нетто холодна оренда + Авансові платежі за комунальні послуги.",
    "check.showResult": "Показати результат",
    "check.resultTitle": "Ви ймовірно маєте право на зниження оренди!",
    "check.reductionRate": "Рівень зниження",
    "check.range": "Діапазон",
    "check.gesamtbetrachtungHint":
      "Суди не просто додають кілька недоліків, а оцінюють загальне погіршення житла. Тому підсумкова ставка нижча за суму окремих значень.",
    "check.flaecheTitle": "Вкажіть житлову площу",
    "check.flaecheDesc":
      "Для площі немає діапазону: якщо відхилення перевищує 10 %, оренда зменшується рівно на відсоток нестачі площі. До 10 % включно недоліку немає.",
    "check.flaecheVereinbart": "Погоджена площа (м²)",
    "check.flaecheTatsaechlich": "Фактична площа (м²)",
    "check.flaecheMangel":
      "Відхилення {abweichung} % - це недолік. Зменшення становить {quote} %.",
    "check.flaecheKeinMangel":
      "Відхилення {abweichung} % - до 10 % включно Федеральний суд не вбачає недоліку. Зменшення становить 0 %.",
    "check.monthlySavings": "Щомісячна економія",
    "check.yearlySavings": "Річна економія",
    "check.withPermanent": "при постійному дефекті",
    "check.disclaimer":
      "Розрахунок базується на типових судових рішеннях і є орієнтиром. Фактичний рівень зниження може відрізнятися.",
    "check.yourDefects": "Ваші обрані дефекти:",
    "check.nextStep": "Наступний крок: Створіть юридично обґрунтоване повідомлення про дефект для вашого орендодавця.",
    "check.createLetter": "Створити повідомлення зараз",
    "check.editDefects": "Редагувати дефекти",
    "check.notEligibleTitle": "Ймовірно немає права",
    "check.notEligibleHint": "Це попередня оцінка. У разі сумнівів зверніться до спілки орендарів або адвоката.",
    "check.tryAgain": "Перевірити знову",
    "eq.mietvertrag.q": "Чи є у вас чинний договір оренди?",
    "eq.mietvertrag.desc": "Зниження оренди передбачає наявність орендних відносин.",
    "eq.mietvertrag.ja": "Так",
    "eq.mietvertrag.nein": "Ні",
    "eq.mangel_bekannt.q": "Чи знали ви про недолік уже при укладенні договору або прийманні квартири?",
    "eq.mangel_bekannt.desc": "Хто знає про недолік при укладенні договору, той не може через нього зменшувати оренду пізніше (§ 536b реч. 1 BGB). При прийманні попри обізнаність право зберігається лише за умови застереження (реч. 3). Якщо орендодавець умисно приховав недолік, ваші права зберігаються у будь-якому разі (реч. 2).",
    "eq.mangel_bekannt.nein": "Ні, я виявив недолік пізніше",
    "eq.mangel_bekannt.ja_vorbehalt": "Так, але я застеріг свої права",
    "eq.mangel_bekannt.ja_arglist": "Так, але орендодавець приховав недолік",
    "eq.mangel_bekannt.ja": "Так, без застереження",
    "eq.selbst_verursacht.q": "Чи спричинили ви дефект самі?",
    "eq.selbst_verursacht.desc": "Якщо орендар сам спричинив дефект, право на зниження втрачається.",
    "eq.selbst_verursacht.nein": "Ні",
    "eq.selbst_verursacht.ja": "Так",
    "eq.selbst_verursacht.unsicher": "Не впевнений",
    "eq.erheblich.q": "Наскільки сильно дефект впливає на ваше житло?",
    "eq.erheblich.desc": "Лише суттєві недоліки дають право на зменшення оренди (§ 536 абз. 1 реч. 3 BGB). Проте кілька дрібних недоліків разом можуть перевищити цей поріг.",
    "eq.erheblich.stark": "Сильно: якість проживання значно обмежена",
    "eq.erheblich.mittel": "Середньо: відчутний вплив",
    "eq.erheblich.gering": "Незначно: лише легка незручність",
    "eq.angezeigt.q": "Чи повідомили ви орендодавця про дефект?",
    "eq.angezeigt.desc": "Зменшення настає в силу закону навіть без повідомлення. Але саме повідомлення дозволяє його реалізувати (§ 536c BGB). Ми допоможемо його скласти.",
    "eq.angezeigt.ja": "Так, письмово",
    "eq.angezeigt.muendlich": "Тільки усно",
    "eq.angezeigt.nein": "Ні, ще ні",
    "eq.reason.mietvertrag": "Без чинного договору оренди, на жаль, немає права на зниження.",
    "eq.reason.mangel_bekannt": "Якщо ви знали про дефект при заселенні і не заперечили, право на зниження втрачається (§ 536b BGB).",
    "eq.reason.selbst_verursacht": "Якщо ви самі спричинили дефект, права на зниження оренди немає.",
    "eq.reason.erheblich": "Лише суттєві дефекти дають право на зниження. Незначні дефекти (§ 536 Abs. 1 S. 3 BGB) недостатні.",
    "eq.reason.default": "У цьому випадку, на жаль, немає права.",
    "letter.title": "Створити повідомлення про дефект",
    "letter.subtitle": "Створіть юридично обґрунтоване повідомлення згідно § 536c BGB.",
    "letter.step.data": "Ваші дані",
    "letter.step.landlord": "Орендодавець",
    "letter.step.defects": "Опис",
    "letter.step.preview": "Попередній перегляд",
    "letter.step.send": "Завантаження",
    "letter.yourData": "Ваші дані (Орендар)",
    "letter.name": "Повне ім'я",
    "letter.street": "Вулиця та номер будинку",
    "letter.zip": "Поштовий індекс",
    "letter.city": "Місто",
    "letter.aptNr": "Номер квартири (необов'язково)",
    "letter.phone": "Номер телефону (необов’язково)",
    "letter.landlordData": "Дані орендодавця",
    "letter.landlordName": "Ім'я орендодавця / Управляючої компанії",
    "letter.salutation": "Звертання в листі",
    "letter.salutationCompany": "Компанія",
    "letter.salutationMs": "Пані",
    "letter.salutationMr": "Пан",
    "letter.describeDefects": "Опишіть дефекти",
    "letter.describeHint": "Опишіть кожен дефект якомога детальніше. Чим детальніше, тим краще.",
    "letter.whichRoom": "В якій кімнаті виникає дефект?",
    "letter.sincewhen": "З якого часу існує дефект?",
    "letter.detailDesc": "Детальний опис",
    "letter.nativeHint": "Ви можете писати рідною мовою, і ШІ перекладе на німецьку.",
    "letter.showPreview": "Показати попередній перегляд",
    "letter.creating": "Лист створюється...",
    "letter.previewTitle": "Попередній перегляд вашого повідомлення",
    "letter.editHint": "Ви можете редагувати текст безпосередньо перед відправкою.",
    "letter.signature": "Цифровий підпис (необов'язково)",
    "letter.clearSig": "Очистити",
    "letter.sigSaved": "Збережено",
    "letter.deliveryOptions": "Завантаження або надсилання",
    "letter.backPreview": "Назад до перегляду",
    "letter.howReceive": "Ваше повідомлення про недоліки готове",
    "letter.downloadDesc": "Завантажте лист як PDF і роздрукуйте самостійно.",
    "letter.free": "Безкоштовно",
    "letter.downloadPdf": "Завантажити як PDF",
    "letter.downloadTxt": "Як текстовий файл",
    "letter.copyText": "Копіювати текст",
    "letter.copied": "Скопійовано!",
    "letter.warning":
      "Надсилайте повідомлення так, щоб згодом могли це підтвердити: Einwurf-Einschreiben, кур'єр зі свідком або особисте вручення під розписку. Звичайного електронного листа для підтвердження отримання недостатньо.",
    "teaser.title": "Створити повідомлення про дефект",
    "teaser.desc":
      "Створіть юридично обґрунтоване повідомлення для орендодавця. Спочатку скористайтеся перевіркою для визначення права та розміру зниження.",
    "teaser.feat1": "Юридичний шаблон згідно § 536c BGB",
    "teaser.feat2": "Автоматично заповнюється вашими даними",
    "teaser.feat3": "Завантаження у форматі PDF або текстового файлу",
    "teaser.feat4": "Цифровий підпис можливий",
    "teaser.feat5": "Можна заповнити рідною мовою",
    "teaser.cta": "Перевірити право: лист створюється автоматично",
    "info.title": "Ваше право на зниження оренди: найважливіші факти",
    "info.subtitle": "Все, що потрібно знати про зниження оренди в Німеччині",
    "info.c1.title": "Законне право",
    "info.c1.desc": "Зниження оренди закріплено в § 536 BGB і настає автоматично при наявності суттєвого дефекту.",
    "info.c2.title": "Не може бути виключене",
    "info.c2.desc": "Право на зниження не може бути виключене договором оренди (§ 536 Abs. 4 BGB).",
    "info.c3.title": "Повідомлення про недолік забезпечує ваше право",
    "info.c3.desc": "Зменшення виникає в силу закону навіть без повідомлення. Але реалізувати й довести його можна лише з ним: без невідкладного повідомлення ви втрачаєте право в тій мірі, в якій орендодавець саме через це не міг усунути недолік (§ 536c абз. 2 реч. 2 № 1 BGB).",
    "info.c4.title": "Базується на брутто теплій оренді",
    "info.c4.desc": "Зменшення розраховується від повної орендної плати (холодна оренда + комунальні). Для житлової оренди Федеральний суд вирішив це 20.07.2005 (Az. VIII ZR 347/04).",
    "info.c5.title": "Обережно з розміром",
    "info.c5.desc": "Уже заборгованість понад одну місячну оренду у два послідовні терміни може спричинити розірвання без попередження (§ 543 абз. 2 реч. 1 № 3 літ. a BGB). У разі сумнівів: платіть повну оренду із застереженням і вимагайте повернення пізніше.",
    "info.c6.title": "Дійте вчасно",
    "info.c6.desc": "Повідомлення повинно бути подане негайно після виявлення. Оплата повної оренди більше 6 місяців може призвести до втрати права.",
    "faq.badge": "Поширені запитання",
    "faq.title": "Все про зниження оренди",
    "faq.subtitle": "Відповіді на найважливіші питання щодо зниження оренди в Німеччині.",
    "faq.legal.title": "Правове застереження",
    "faq.legal.text": "Інформація на цьому сайті є загальноінформаційною і не є юридичною консультацією.",
    "footer.desc": "Ми допомагаємо орендарям у Німеччині реалізувати своє право на зниження оренди.",
    "footer.service": "Сервіс",
    "footer.legal": "Правова інформація",
    "footer.imprint": "Імпресум",
    "footer.privacy": "Конфіденційність",
    "footer.terms": "Умови",
    "footer.rights": "Усі права захищені.",
    "footer.noLegal": "Не є юридичною консультацією. Інформація без гарантії.",
    "footer.withdrawal": "Право на відмову",

    // Shared
    "common.note": "Примітка",
    "common.backHome": "На головну",

    // Wizard, Frist und "Wie geht es weiter?"
    "letter.step.frist": "Строк",
    "check.pickCategoryHint": "Оберіть категорію, щоб побачити відповідні недоліки.",
    "check.removeLabel": "Видалити {label}",
    "check.nextStepTitle": "Наступний крок: повідомлення про недоліки",
    "letter.phoneWhy": "За наявності номера лист пропонує орендодавцю час для усунення недоліку.",
    "letter.landlordDesc": "Повідомлення має дійти до орендодавця або керуючої компанії. Назву знайдете в договорі оренди чи в рахунку за комунальні послуги.",
    "letter.landlordAddressHint": "Пишіть назву так, як у договорі оренди. Додатки на кшталт «c/o» або дуже довга правова форма не вміщуються в адресне поле листа.",
    "letter.toDeadline": "Далі до строку",
    "letter.signatureDesc": "Ви також можете завантажити лист без підпису та підписати його від руки після друку.",
    "frist.title": "До якого часу орендодавець має усунути недолік?",
    "frist.desc": "Орендодавцю потрібен розумний строк. Надто короткий можна оскаржити, надто довгий коштує вам тижнів.",
    "frist.days": "{n} днів",
    "frist.until": "до {datum}",
    "frist.recommended": "Рекомендовано",
    "frist.suggestion": "Ми пропонуємо {n} днів — це звичайний строк для «{mangel}». За кількох недоліків вирішує найтерміновіший.",
    "frist.suggestionUrgent": "Ми пропонуємо {n} днів. «{mangel}» не терпить зволікання. За кількох недоліків вирішує найтерміновіший.",
    "frist.deliveryTitle": "Строк спливає від отримання, а не від відправлення.",
    "frist.deliveryText": "Вирішальним є день, коли лист опиниться в поштовій скриньці орендодавця. Додайте один-два робочі дні на пошту. Якщо кінець строку припадає на суботу, неділю чи свято, строк спливає наступного робочого дня (§ 193 BGB).",
    "frist.urgentTitle": "Тут потрібна поспішність.",
    "frist.urgentText": "Повідомте про «{mangel}» також телефоном і запишіть, коли й з ким говорили. Якщо до кінця строку нічого не станеться, ви можете усунути недолік коштом орендодавця (§ 536a Abs. 2 BGB).",
    "next.title": "Що далі?",
    "next.subtitle": "Що робити зараз — і на що очікувати.",
    "next.s1.when": "Сьогодні, {datum}",
    "next.s1.text": "Роздрукуйте повідомлення, підпишіть його та надішліть так, щоб доставку можна було довести: рекомендований лист із підтвердженням, кур’єр зі свідком або особисте вручення під розписку. Звичайний лист електронною поштою не є доказом отримання.",
    "next.s2.when": "Через один–три робочі дні",
    "next.s2.text": "Лист у поштовій скриньці орендодавця. Із цього дня він знає про недолік — і з цього дня спливає ваш строк.",
    "next.s3.when": "Від моменту отримання",
    "next.s3.text": "Законного строку для відповіді не існує. Багато орендодавців озиваються протягом кількох робочих днів, щоб домовитися про огляд, але вони не зобов’язані. Поки що платіть оренду повністю і вкажіть у призначенні платежу: «Zahlung unter Vorbehalt wegen Mangel».",
    "next.s4.when": "До {datum}",
    "next.s4.text": "Кінець вашого строку. До цього дня недолік має бути усунено. Продовжуйте документувати: фото з датою, протокол температури або шуму.",
    "next.s5.when": "Від {datum}",
    "next.s5.text": "Якщо нічого не сталося, орендодавець у прострочці. Ви можете надіслати другий лист з останнім строком, повернути переплачену оренду та вимагати відшкодування або самостійного усунення за § 536a BGB. Спілка орендарів або адвокат перевірить вашу справу.",
    "next.caution": "У разі сумніву знижуйте обережно. Хто зменшить забагато й накопичить борг у дві місячні оренди, ризикує розірванням без попередження (§ 543 Abs. 2 Nr. 3 BGB).",
    "next.guideLink": "Порадник: як правильно написати повідомлення про недоліки",
    "dispatch.emailLabel": "Електронна адреса для підтвердження",
    "dispatch.emailWhy": "Ми надішлемо на цю адресу підтвердження замовлення та статус надсилання.",
    "info.c7.title": "Після надсилання",
    "info.c7.desc": "Орендодавець не зобов’язаний відповісти одразу — законного строку для відповіді немає. Важливий строк на усунення: як правило, 14 днів, за термінових недоліків коротший. Він починається з отримання листа. Якщо до того нічого не станеться, орендодавець у прострочці.",

    // FAQ page
    "faq.showAll": "Показати всі запитання та відповіді",
    "faqpage.allTitle": "Усі запитання та відповіді",
    "faqpage.cta.title": "Не знайшли своє запитання?",
    "faqpage.cta.desc":
      "Скористайтеся нашою безкоштовною перевіркою. За кілька кроків ви дізнаєтесь, чи можете зменшити оренду і на скільки.",

    // Letter - delivery
    "letter.basedOn":
      "На основі вашої перевірки: близько {quote} % зменшення при оренді {rent} €.",

    // Letter — dispatch by post (eBrief)
    "dispatch.title": "Надіслати безпосередньо орендодавцю",
    "dispatch.subtitle":
      "Ми надрукуємо ваше повідомлення про дефекти та відправимо його поштою — вам не потрібні ні принтер, ні марка.",
    "dispatch.chooseProduct": "Оберіть спосіб надсилання",
    "dispatch.brief": "Звичайним листом",
    "dispatch.einschreiben": "Як Einwurf-Einschreiben",
    "dispatch.einschreibenHint":
      "Пошта фіксує вкидання листа до поштової скриньки. Щойно надійде повідомлення про доставку, ми надішлемо вам номер відправлення та посилання для відстеження електронною поштою. Це не Übergabe-Einschreiben із підписом отримувача — і жоден поштовий продукт не може дати беззаперечного підтвердження отримання.",
    "dispatch.taxNote":
      "Згідно з § 19 UStG податок на додану вартість не нараховується.",
    "dispatch.taxNoteRegel":
      "Усі ціни є кінцевими та включають 19 % податку на додану вартість.",
    "dispatch.send": "Надіслати платно",
    "dispatch.consentHeading": "Перш ніж ми зможемо розпочати друк",
    "dispatch.consentStart":
      "Я прямо вимагаю, щоб ви розпочали друк і надсилання мого повідомлення про недоліки до закінчення строку відмови.",
    "dispatch.consentExpiry":
      "Мені відомо, що моє право на відмову припиняється, щойно ви повністю виконаєте послугу — тобто щойно лист буде надруковано та передано для доставки. Цим підтверджую, що мені це відомо.",
    "dispatch.consentLink": "Право на відмову",
    "dispatch.error.zustimmung_fehlt":
      "Будь ласка, підтвердьте обидві заяви — без них ми не можемо надрукувати й надіслати лист до закінчення строку відмови.",
    "dispatch.preparing": "Відправлення готується...",
    "dispatch.checkingAddress": "Перевіряємо адресу...",
    "dispatch.redirecting": "Переходимо до оплати...",
    "dispatch.confirmSend": "Адреса правильна — надіслати платно",
    "dispatch.addressWarning":
      "Адресу орендодавця не вдалося однозначно перевірити. Будь ласка, перевірте її перед платним надсиланням.",
    "dispatch.showMarked": "Переглянути розпізнану адресу",
    "dispatch.fixAddress": "Виправити адресу орендодавця",
    "dispatch.freeStays":
      "Безкоштовне завантаження залишається доступним у будь-якому разі.",
    "dispatch.result.erfolg.title": "Оплата успішна",
    "dispatch.result.erfolg.text":
      "Дякуємо — ваш платіж надійшов. Ваше повідомлення про дефекти буде надруковано та надіслано поштою вашому орендодавцю.",
    "dispatch.result.erfolg.note":
      "Підтвердження ви отримаєте електронною поштою на адресу, яку вказали під час надсилання. Більше нічого робити не потрібно. З міркувань захисту даних ваше повідомлення про дефекти не зберігається у браузері, тому показати його тут ще раз неможливо.",
    "dispatch.result.abbruch.title": "Оплату скасовано",
    "dispatch.result.abbruch.text":
      "Нічого не було надіслано і нічого не було нараховано.",
    "dispatch.result.abbruch.note":
      "З міркувань захисту даних ваше повідомлення про дефекти не зберігається у браузері й тому більше недоступне. Якщо ви хочете його надіслати або безкоштовно завантажити, будь ласка, заповніть форму ще раз — це займе лише кілька хвилин.",
    "dispatch.result.restartCta": "Створити повідомлення про дефекти заново",
    "dispatch.hint.kopf":
      "Шапку листа не розпізнано. Тому адреси можуть з’явитися ще раз у тексті листа.",
    "dispatch.hint.datum":
      "У листі не знайдено рядка з датою. Будь ласка, перевірте, чи вказана дата в тексті.",
    "dispatch.hint.absender":
      "Рядок відправника скорочено, щоб він помістився в адресне поле.",
    "dispatch.error.allgemein":
      "Надсилання зараз неможливе. Спробуйте, будь ласка, пізніше.",
    "dispatch.error.versand_nicht_konfiguriert":
      "Поштове надсилання наразі недоступне. Завантажте, будь ласка, повідомлення вище та надішліть його самостійно.",
    "dispatch.error.zu_viele_anfragen":
      "Забагато спроб надсилання. Спробуйте, будь ласка, за годину.",
    "dispatch.error.unvollstaendig":
      "Бракує даних. Поверніться, будь ласка, назад і доповніть свою адресу, електронну пошту та адресу орендодавця.",
    "dispatch.error.anschrift_zu_lang":
      "Адреса орендодавця задовга для адресного поля. Скоротіть, будь ласка, ім’я, вулицю або місто — наприклад, приберіть додатки на кшталт «c/o» чи правову форму.",
    "dispatch.error.pdf_fehler":
      "Лист не вдалося створити. Намалюйте, будь ласка, підпис ще раз або продовжте без нього та спробуйте знову.",
    "dispatch.error.ebrief_fehler":
      "Наш поштовий партнер зараз не відповідає. Спробуйте, будь ласка, за кілька хвилин — нічого не списано.",
    "dispatch.error.preis_unplausibel":
      "Цей лист неможливо надіслати за вказаною ціною, імовірно, він задовгий. Скоротіть, будь ласка, текст і спробуйте ще раз.",
    "dispatch.error.token_ungueltig":
      "Термін дії цього відправлення минув. Розпочніть, будь ласка, надсилання ще раз.",
    "dispatch.error.jobId_ungueltig":
      "Не вдалося знайти це відправлення. Розпочніть, будь ласка, надсилання ще раз.",
    "dispatch.error.kein_dokument":
      "Лист ще обробляється. Зачекайте, будь ласка, хвилинку та спробуйте ще раз.",
    "dispatch.error.bereits_versendet":
      "Це повідомлення вже надіслано. Повторна оплата не стягується.",
    "dispatch.error.versand_nicht_moeglich":
      "Оплатити це відправлення неможливо. Будь ласка, розпочніть відправлення ще раз — кошти не стягнуто.",
    "dispatch.error.checkout_fehler":
      "Не вдалося відкрити сторінку оплати. Спробуйте, будь ласка, ще раз — нічого не списано.",
    "dispatch.error.zeitueberschreitung":
      "Операція триває довше, ніж очікувалося. Спробуйте, будь ласка, за кілька хвилин — нічого не списано.",
  },

  ru: {
    "nav.check": "Проверка",
    "nav.letter": "Уведомление",
    "nav.how": "Как это работает",
    "nav.faq": "FAQ",
    "nav.table": "Таблица",
    "nav.guide": "Справочник",
    "nav.send": "Отправить письмо",
    "versand.teaser.eyebrow": "Не только проверить — сделать",
    "versand.teaser.more": "Как работает отправка",

    // SEO metadata for the pages that exist in every language
    "seo.home.title":
      "Снижение арендной платы в Германии: проверьте право и отправьте письмо",
    "seo.home.description":
      "Бесплатно проверьте, можете ли вы снизить арендную плату в Германии: рассчитайте размер снижения, составьте уведомление о недостатках по § 536c BGB и закажите его отправку арендодателю.",
    "seo.faq.title":
      "Снижение арендной платы в Германии: частые вопросы",
    "seo.faq.description":
      "Главные вопросы о снижении арендной платы: насколько можно снизить, с какого момента оно действует и нужно ли согласие арендодателя. На основе Гражданского кодекса Германии.",
    "nav.cta": "Проверить сейчас",
    "hero.badge": "На основании § 536 BGB: ваше законное право",
    "hero.title1": "Плесень, шум, сломанное отопление? Вот какое",
    "hero.title2": "снижение арендной платы",
    "hero.title3": "вам полагается.",
    "hero.subtitle":
      "Создайте уведомление о дефекте за 2 минуты и скачайте бесплатно. По желанию отправьте его сразу письмом или как Einwurf-Einschreiben.",
    "hero.cta1": "Бесплатно проверить право",
    "hero.cta2": "Создать уведомление о дефекте",
    "hero.selectLang": "Выбрать язык",
    "hero.stat1label": "BGB: ваше законное право",
    "hero.stat2": "до 100%",
    "hero.stat2label": "Снижение аренды возможно",
    "hero.stat3": "2 мин.",
    "hero.stat3label": "Онлайн проверка права",
    "how.title": "Как это работает",
    "how.subtitle": "В 4 простых шага к вашему праву на снижение аренды",
    "how.step": "ШАГ",
    "how.s1.title": "Выберите дефект",
    "how.s1.desc": "Выберите из более 60 типичных дефектов жилья, от поломки отопления до плесени.",
    "how.s2.title": "Рассчитайте снижение",
    "how.s2.desc": "Мы рассчитаем на основе актуальных судебных решений, какое снижение аренды вам положено.",
    "how.s3.title": "Создайте уведомление",
    "how.s3.desc": "Из ваших данных мы генерируем юридически обоснованное уведомление согласно § 536c BGB.",
    "how.s4.title": "Скачайте письмо",
    "how.s4.desc":
      "Скачайте готовое уведомление о недостатках в формате PDF или текстового файла, бесплатно и без регистрации. Или поручите нам отправить его арендодателю письмом или как Einwurf-Einschreiben.",
    "check.phase.eligibility": "Проверка",
    "check.phase.defects": "Дефекты",
    "check.phase.rent": "Аренда",
    "check.result": "Результат",
    "check.back": "Назад",
    "check.next": "Далее",
    "check.allCategories": "Все категории",
    "check.whichDefects": "Какие дефекты имеются?",
    "check.whichDefectsDesc": "Выберите категорию, затем отметьте дефекты. Можно выбрать несколько.",
    "check.selected": "дефектов выбрано",
    "check.approxReduction": "Снижение",
    "check.rentTitle": "Какова ваша ежемесячная аренда?",
    "check.rentDesc": "Введите вашу брутто тёплую аренду (холодная аренда + все доп. расходы).",
    "check.rentPlaceholder": "напр. 1000",
    "check.rentInfo": "Брутто тёплая аренда = Нетто холодная аренда + Коммунальные платежи.",
    "check.showResult": "Показать результат",
    "check.resultTitle": "Вы вероятно имеете право на снижение аренды!",
    "check.reductionRate": "Уровень снижения",
    "check.range": "Диапазон",
    "check.gesamtbetrachtungHint":
      "Суды не складывают несколько недостатков, а оценивают общее ухудшение жилья. Поэтому итоговая ставка ниже суммы отдельных значений.",
    "check.flaecheTitle": "Укажите жилую площадь",
    "check.flaecheDesc":
      "Для площади нет диапазона: если отклонение превышает 10 %, аренда снижается ровно на процент недостающей площади. До 10 % включительно недостатка нет.",
    "check.flaecheVereinbart": "Согласованная площадь (м²)",
    "check.flaecheTatsaechlich": "Фактическая площадь (м²)",
    "check.flaecheMangel":
      "Отклонение {abweichung} % - это недостаток. Снижение составляет {quote} %.",
    "check.flaecheKeinMangel":
      "Отклонение {abweichung} % - до 10 % включительно Федеральный суд не усматривает недостатка. Снижение составляет 0 %.",
    "check.monthlySavings": "Ежемесячная экономия",
    "check.yearlySavings": "Годовая экономия",
    "check.withPermanent": "при постоянном дефекте",
    "check.disclaimer": "Расчёт основан на типичных судебных решениях и является ориентиром.",
    "check.yourDefects": "Ваши выбранные дефекты:",
    "check.nextStep": "Следующий шаг: Создайте юридически обоснованное уведомление для арендодателя.",
    "check.createLetter": "Создать уведомление сейчас",
    "check.editDefects": "Редактировать дефекты",
    "check.notEligibleTitle": "Вероятно нет права",
    "check.notEligibleHint": "Это предварительная оценка. При сомнениях обратитесь к союзу арендаторов или адвокату.",
    "check.tryAgain": "Проверить снова",
    "eq.mietvertrag.q": "Есть ли у вас действующий договор аренды?",
    "eq.mietvertrag.desc": "Снижение аренды предполагает наличие арендных отношений.",
    "eq.mietvertrag.ja": "Да",
    "eq.mietvertrag.nein": "Нет",
    "eq.mangel_bekannt.q": "Знали ли вы о недостатке уже при заключении договора или приёмке квартиры?",
    "eq.mangel_bekannt.desc": "Тот, кто знает о недостатке при заключении договора, не может из-за него снижать аренду позже (§ 536b предл. 1 BGB). При приёмке несмотря на осведомлённость право сохраняется лишь при оговорке (предл. 3). Если арендодатель умышленно скрыл недостаток, ваши права сохраняются в любом случае (предл. 2).",
    "eq.mangel_bekannt.nein": "Нет, я обнаружил недостаток позже",
    "eq.mangel_bekannt.ja_vorbehalt": "Да, но я сделал оговорку о своих правах",
    "eq.mangel_bekannt.ja_arglist": "Да, но арендодатель скрыл недостаток",
    "eq.mangel_bekannt.ja": "Да, без оговорки",
    "eq.selbst_verursacht.q": "Вы сами вызвали дефект?",
    "eq.selbst_verursacht.desc": "Если арендатор сам вызвал дефект, право на снижение теряется.",
    "eq.selbst_verursacht.nein": "Нет",
    "eq.selbst_verursacht.ja": "Да",
    "eq.selbst_verursacht.unsicher": "Не уверен",
    "eq.erheblich.q": "Насколько сильно дефект влияет на ваше жильё?",
    "eq.erheblich.desc": "Только существенные недостатки дают право на снижение аренды (§ 536 абз. 1 предл. 3 BGB). Однако несколько мелких недостатков вместе могут превысить этот порог.",
    "eq.erheblich.stark": "Сильно: качество жизни значительно ограничено",
    "eq.erheblich.mittel": "Средне: ощутимое влияние",
    "eq.erheblich.gering": "Незначительно: лишь лёгкое неудобство",
    "eq.angezeigt.q": "Сообщили ли вы арендодателю о дефекте?",
    "eq.angezeigt.desc": "Снижение наступает в силу закона даже без уведомления. Но именно уведомление позволяет его реализовать (§ 536c BGB). Мы поможем его составить.",
    "eq.angezeigt.ja": "Да, письменно",
    "eq.angezeigt.muendlich": "Только устно",
    "eq.angezeigt.nein": "Нет, ещё нет",
    "eq.reason.mietvertrag": "Без действующего договора аренды, к сожалению, нет права на снижение.",
    "eq.reason.mangel_bekannt": "Если вы знали о дефекте при заселении и не возразили, право на снижение теряется (§ 536b BGB).",
    "eq.reason.selbst_verursacht": "Если вы сами вызвали дефект, права на снижение аренды нет.",
    "eq.reason.erheblich": "Только существенные дефекты дают право на снижение. Незначительные дефекты (§ 536 Abs. 1 S. 3 BGB) недостаточны.",
    "eq.reason.default": "В данном случае, к сожалению, нет права.",
    "letter.title": "Создать уведомление о дефекте",
    "letter.subtitle": "Создайте юридически обоснованное уведомление согласно § 536c BGB.",
    "letter.step.data": "Ваши данные",
    "letter.step.landlord": "Арендодатель",
    "letter.step.defects": "Описание",
    "letter.step.preview": "Предпросмотр",
    "letter.step.send": "Скачивание",
    "letter.yourData": "Ваши данные (Арендатор)",
    "letter.name": "Полное имя",
    "letter.street": "Улица и номер дома",
    "letter.zip": "Почтовый индекс",
    "letter.city": "Город",
    "letter.aptNr": "Номер квартиры (необязательно)",
    "letter.phone": "Номер телефона (необязательно)",
    "letter.landlordData": "Данные арендодателя",
    "letter.landlordName": "Имя арендодателя / Управляющей компании",
    "letter.salutation": "Обращение в письме",
    "letter.salutationCompany": "Компания",
    "letter.salutationMs": "Госпожа",
    "letter.salutationMr": "Господин",
    "letter.describeDefects": "Опишите дефекты",
    "letter.describeHint": "Опишите каждый дефект как можно подробнее.",
    "letter.whichRoom": "В какой комнате проявляется дефект?",
    "letter.sincewhen": "С какого времени существует дефект?",
    "letter.detailDesc": "Подробное описание",
    "letter.nativeHint": "Вы можете писать на родном языке, и ИИ переведёт на немецкий.",
    "letter.showPreview": "Показать предпросмотр",
    "letter.creating": "Письмо создаётся...",
    "letter.previewTitle": "Предпросмотр вашего уведомления",
    "letter.editHint": "Вы можете отредактировать текст перед отправкой.",
    "letter.signature": "Цифровая подпись (необязательно)",
    "letter.clearSig": "Очистить",
    "letter.sigSaved": "Сохранено",
    "letter.deliveryOptions": "Скачивание или отправка",
    "letter.backPreview": "Назад к просмотру",
    "letter.howReceive": "Ваше уведомление о недостатках готово",
    "letter.downloadDesc": "Скачайте письмо как PDF и распечатайте сами.",
    "letter.free": "Бесплатно",
    "letter.downloadPdf": "Скачать как PDF",
    "letter.downloadTxt": "Как текстовый файл",
    "letter.copyText": "Копировать текст",
    "letter.copied": "Скопировано!",
    "letter.warning":
      "Отправляйте уведомление так, чтобы позже это можно было подтвердить: Einwurf-Einschreiben, курьер со свидетелем или личное вручение под расписку. Обычного электронного письма для подтверждения получения недостаточно.",
    "teaser.title": "Создать уведомление о дефекте",
    "teaser.desc": "Создайте юридически обоснованное уведомление для арендодателя.",
    "teaser.feat1": "Юридический шаблон согласно § 536c BGB",
    "teaser.feat2": "Автоматически заполняется вашими данными",
    "teaser.feat3": "Скачивание в формате PDF или текстового файла",
    "teaser.feat4": "Цифровая подпись возможна",
    "teaser.feat5": "Можно заполнить на родном языке",
    "teaser.cta": "Проверить право: письмо создаётся автоматически",
    "info.title": "Ваше право на снижение аренды: важнейшие факты",
    "info.subtitle": "Всё, что нужно знать о снижении аренды в Германии",
    "info.c1.title": "Законное право",
    "info.c1.desc": "Снижение аренды закреплено в § 536 BGB и наступает автоматически при существенном дефекте.",
    "info.c2.title": "Не может быть исключено",
    "info.c2.desc": "Право на снижение не может быть исключено договором аренды (§ 536 Abs. 4 BGB).",
    "info.c3.title": "Уведомление о недостатке обеспечивает ваше право",
    "info.c3.desc": "Снижение возникает в силу закона даже без уведомления. Но реализовать и доказать его можно только с ним: без незамедлительного уведомления вы теряете право в той мере, в какой арендодатель именно поэтому не мог устранить недостаток (§ 536c абз. 2 предл. 2 № 1 BGB).",
    "info.c4.title": "Базируется на брутто тёплой аренде",
    "info.c4.desc": "Снижение рассчитывается от полной аренды (холодная аренда + коммунальные). Для жилой аренды Федеральный суд решил это 20.07.2005 (Az. VIII ZR 347/04).",
    "info.c5.title": "Осторожно с размером",
    "info.c5.desc": "Уже задолженность свыше одной месячной аренды в два последовательных срока может повлечь расторжение без предупреждения (§ 543 абз. 2 предл. 1 № 3 лит. a BGB). В случае сомнений: платите полную аренду с оговоркой и требуйте возврата позже.",
    "info.c6.title": "Действуйте своевременно",
    "info.c6.desc": "Уведомление должно быть подано немедленно. Оплата полной аренды более 6 месяцев может привести к утрате права.",
    "faq.badge": "Часто задаваемые вопросы",
    "faq.title": "Всё о снижении аренды",
    "faq.subtitle": "Ответы на важнейшие вопросы о снижении аренды в Германии.",
    "faq.legal.title": "Правовое предупреждение",
    "faq.legal.text": "Информация на этом сайте носит общий информационный характер и не является юридической консультацией.",
    "footer.desc": "Мы помогаем арендаторам в Германии реализовать право на снижение аренды.",
    "footer.service": "Сервис",
    "footer.legal": "Правовая информация",
    "footer.imprint": "Импрессум",
    "footer.privacy": "Конфиденциальность",
    "footer.terms": "Условия",
    "footer.rights": "Все права защищены.",
    "footer.noLegal": "Не является юридической консультацией. Информация без гарантии.",
    "footer.withdrawal": "Право на отказ",

    // Shared
    "common.note": "Примечание",
    "common.backHome": "На главную",

    // Wizard, Frist und "Wie geht es weiter?"
    "letter.step.frist": "Срок",
    "check.pickCategoryHint": "Выберите категорию, чтобы увидеть подходящие недостатки.",
    "check.removeLabel": "Удалить {label}",
    "check.nextStepTitle": "Следующий шаг: уведомление о недостатках",
    "letter.phoneWhy": "С номером письмо предлагает арендодателю время для устранения недостатка.",
    "letter.landlordDesc": "Уведомление должно дойти до арендодателя или управляющей компании. Название найдёте в договоре аренды или в счёте за коммунальные услуги.",
    "letter.landlordAddressHint": "Пишите название так, как в договоре аренды. Добавления вроде «c/o» или очень длинная правовая форма не поместятся в адресное поле письма.",
    "letter.toDeadline": "Далее к сроку",
    "letter.signatureDesc": "Вы можете скачать письмо без подписи и подписать его от руки после печати.",
    "frist.title": "К какому сроку арендодатель должен устранить недостаток?",
    "frist.desc": "Арендодателю нужен разумный срок. Слишком короткий можно оспорить, слишком длинный стоит вам недель.",
    "frist.days": "{n} дней",
    "frist.until": "до {datum}",
    "frist.recommended": "Рекомендуется",
    "frist.suggestion": "Мы предлагаем {n} дней — это обычный срок для «{mangel}». При нескольких недостатках решает самый срочный.",
    "frist.suggestionUrgent": "Мы предлагаем {n} дней. «{mangel}» не терпит отлагательства. При нескольких недостатках решает самый срочный.",
    "frist.deliveryTitle": "Срок течёт с момента получения, а не с момента отправки.",
    "frist.deliveryText": "Решающим является день, когда письмо окажется в почтовом ящике арендодателя. Добавьте один-два рабочих дня на почту. Если конец срока приходится на субботу, воскресенье или праздник, срок истекает в следующий рабочий день (§ 193 BGB).",
    "frist.urgentTitle": "Здесь нужна срочность.",
    "frist.urgentText": "Сообщите о «{mangel}» также по телефону и запишите, когда и с кем говорили. Если к концу срока ничего не произойдёт, вы вправе устранить недостаток за счёт арендодателя (§ 536a Abs. 2 BGB).",
    "next.title": "Что дальше?",
    "next.subtitle": "Что делать сейчас — и чего ожидать.",
    "next.s1.when": "Сегодня, {datum}",
    "next.s1.text": "Распечатайте уведомление, подпишите его и отправьте так, чтобы доставку можно было доказать: заказное письмо с подтверждением, курьер со свидетелем или личная передача под расписку. Обычное электронное письмо доказательством получения не является.",
    "next.s2.when": "Через один–три рабочих дня",
    "next.s2.text": "Письмо в почтовом ящике арендодателя. С этого дня он знает о недостатке — и с этого дня течёт ваш срок.",
    "next.s3.when": "С момента получения",
    "next.s3.text": "Законного срока для ответа не существует. Многие арендодатели связываются в течение нескольких рабочих дней, чтобы договориться об осмотре, но они не обязаны. Пока платите аренду полностью и укажите в назначении платежа: «Zahlung unter Vorbehalt wegen Mangel».",
    "next.s4.when": "До {datum}",
    "next.s4.text": "Конец вашего срока. К этому дню недостаток должен быть устранён. Продолжайте документировать: фото с датой, протокол температуры или шума.",
    "next.s5.when": "С {datum}",
    "next.s5.text": "Если ничего не произошло, арендодатель в просрочке. Вы можете отправить второе письмо с последним сроком, вернуть переплаченную аренду и потребовать возмещения или самостоятельного устранения по § 536a BGB. Союз арендаторов или адвокат проверит ваше дело.",
    "next.caution": "В случае сомнений снижайте осторожно. Кто урежет слишком много и накопит долг в две месячные аренды, рискует расторжением без предупреждения (§ 543 Abs. 2 Nr. 3 BGB).",
    "next.guideLink": "Руководство: как правильно написать уведомление о недостатках",
    "dispatch.emailLabel": "Адрес электронной почты для подтверждения",
    "dispatch.emailWhy": "Мы отправим на этот адрес подтверждение заказа и статус отправки.",
    "info.c7.title": "После отправки",
    "info.c7.desc": "Арендодатель не обязан отвечать сразу — законного срока для ответа нет. Важен срок на устранение: как правило, 14 дней, при срочных недостатках короче. Он начинается с получения письма. Если до этого ничего не произойдёт, арендодатель в просрочке.",

    // FAQ page
    "faq.showAll": "Показать все вопросы и ответы",
    "faqpage.allTitle": "Все вопросы и ответы",
    "faqpage.cta.title": "Не нашли свой вопрос?",
    "faqpage.cta.desc":
      "Воспользуйтесь нашей бесплатной проверкой. За несколько шагов вы узнаете, можете ли вы снизить аренду и насколько.",

    // Letter - delivery
    "letter.basedOn":
      "На основе вашей проверки: около {quote} % снижения при аренде {rent} €.",

    // Letter — dispatch by post (eBrief)
    "dispatch.title": "Отправить напрямую арендодателю",
    "dispatch.subtitle":
      "Мы распечатаем ваше уведомление о дефектах и отправим его почтой — вам не нужны ни принтер, ни марка.",
    "dispatch.chooseProduct": "Выберите способ отправки",
    "dispatch.brief": "Обычным письмом",
    "dispatch.einschreiben": "Как Einwurf-Einschreiben",
    "dispatch.einschreibenHint":
      "Почта фиксирует опускание письма в почтовый ящик. Как только поступит сообщение о доставке, мы пришлём вам номер отправления и ссылку для отслеживания по электронной почте. Это не Übergabe-Einschreiben с подписью получателя — и ни один почтовый продукт не может дать бесспорного подтверждения получения.",
    "dispatch.taxNote":
      "Согласно § 19 UStG налог на добавленную стоимость не начисляется.",
    "dispatch.taxNoteRegel":
      "Все цены являются окончательными и включают 19 % налога на добавленную стоимость.",
    "dispatch.send": "Отправить платно",
    "dispatch.consentHeading": "Прежде чем мы сможем начать печать",
    "dispatch.consentStart":
      "Я прямо требую, чтобы вы приступили к печати и отправке моего уведомления о недостатках до истечения срока отказа.",
    "dispatch.consentExpiry":
      "Мне известно, что моё право на отказ прекращается, как только вы полностью окажете услугу — то есть как только письмо будет напечатано и передано для доставки. Настоящим подтверждаю, что мне это известно.",
    "dispatch.consentLink": "Право на отказ",
    "dispatch.error.zustimmung_fehlt":
      "Пожалуйста, подтвердите оба заявления — без них мы не можем напечатать и отправить письмо до истечения срока отказа.",
    "dispatch.preparing": "Отправление готовится...",
    "dispatch.checkingAddress": "Проверяем адрес...",
    "dispatch.redirecting": "Переходим к оплате...",
    "dispatch.confirmSend": "Адрес верный — отправить платно",
    "dispatch.addressWarning":
      "Адрес арендодателя не удалось однозначно проверить. Пожалуйста, проверьте его перед платной отправкой.",
    "dispatch.showMarked": "Посмотреть распознанный адрес",
    "dispatch.fixAddress": "Исправить адрес арендодателя",
    "dispatch.freeStays":
      "Бесплатная загрузка остаётся доступной в любом случае.",
    "dispatch.result.erfolg.title": "Оплата прошла успешно",
    "dispatch.result.erfolg.text":
      "Спасибо — ваш платёж получен. Ваше уведомление о дефектах будет напечатано и отправлено почтой вашему арендодателю.",
    "dispatch.result.erfolg.note":
      "Подтверждение вы получите по электронной почте на адрес, который указали при отправке. Больше ничего делать не нужно. В целях защиты данных ваше уведомление о дефектах не сохраняется в браузере, поэтому показать его здесь ещё раз невозможно.",
    "dispatch.result.abbruch.title": "Оплата отменена",
    "dispatch.result.abbruch.text":
      "Ничего не было отправлено и ничего не было списано.",
    "dispatch.result.abbruch.note":
      "В целях защиты данных ваше уведомление о дефектах не сохраняется в браузере и поэтому больше недоступно. Если вы хотите его отправить или бесплатно скачать, пожалуйста, заполните форму ещё раз — это займёт всего несколько минут.",
    "dispatch.result.restartCta": "Создать уведомление о дефектах заново",
    "dispatch.hint.kopf":
      "Шапка письма не распознана. Поэтому адреса могут появиться ещё раз в тексте письма.",
    "dispatch.hint.datum":
      "В письме не найдена строка с датой. Пожалуйста, проверьте, указана ли дата в тексте.",
    "dispatch.hint.absender":
      "Строка отправителя сокращена, чтобы поместиться в адресное поле.",
    "dispatch.error.allgemein":
      "Отправка сейчас невозможна. Пожалуйста, попробуйте позже.",
    "dispatch.error.versand_nicht_konfiguriert":
      "Почтовая отправка сейчас недоступна. Пожалуйста, скачайте уведомление выше и отправьте его самостоятельно.",
    "dispatch.error.zu_viele_anfragen":
      "Слишком много попыток отправки. Пожалуйста, попробуйте через час.",
    "dispatch.error.unvollstaendig":
      "Не хватает данных. Пожалуйста, вернитесь назад и дополните свой адрес, адрес электронной почты и адрес арендодателя.",
    "dispatch.error.anschrift_zu_lang":
      "Адрес арендодателя слишком длинный для адресного поля. Пожалуйста, сократите имя, улицу или город — например, уберите добавления вроде «c/o» или организационно-правовую форму.",
    "dispatch.error.pdf_fehler":
      "Письмо не удалось создать. Пожалуйста, нарисуйте подпись заново или продолжите без неё и попробуйте ещё раз.",
    "dispatch.error.ebrief_fehler":
      "Наш почтовый партнёр сейчас не отвечает. Пожалуйста, попробуйте через несколько минут — ничего не списано.",
    "dispatch.error.preis_unplausibel":
      "Это письмо нельзя отправить по указанной цене, вероятно, оно слишком длинное. Пожалуйста, сократите текст и попробуйте ещё раз.",
    "dispatch.error.token_ungueltig":
      "Срок действия этой отправки истёк. Пожалуйста, начните отправку заново.",
    "dispatch.error.jobId_ungueltig":
      "Не удалось найти эту отправку. Пожалуйста, начните отправку заново.",
    "dispatch.error.kein_dokument":
      "Письмо ещё обрабатывается. Пожалуйста, подождите немного и попробуйте ещё раз.",
    "dispatch.error.bereits_versendet":
      "Это уведомление уже отправлено. Повторная оплата не взимается.",
    "dispatch.error.versand_nicht_moeglich":
      "Оплатить эту отправку невозможно. Пожалуйста, начните отправку заново — деньги не списаны.",
    "dispatch.error.checkout_fehler":
      "Не удалось открыть страницу оплаты. Пожалуйста, попробуйте ещё раз — ничего не списано.",
    "dispatch.error.zeitueberschreitung":
      "Операция занимает больше времени, чем ожидалось. Пожалуйста, попробуйте через несколько минут — ничего не списано.",
  },

  ar: {
    "nav.check": "تحقق من حقك",
    "nav.letter": "إشعار بالعيب",
    "nav.how": "كيف يعمل",
    "nav.faq": "الأسئلة الشائعة",
    "nav.table": "الجدول",
    "nav.guide": "الدليل",
    "nav.send": "إرسال الخطاب",
    "versand.teaser.eyebrow": "لا تكتفِ بالتحقق — أنجز الأمر",
    "versand.teaser.more": "كيف يتم الإرسال",

    // SEO metadata for the pages that exist in every language
    "seo.home.title":
      "تخفيض الإيجار في ألمانيا: تحقق من حقك وأرسل الخطاب",
    "seo.home.description":
      "تحقق مجانًا مما إذا كان بإمكانك تخفيض إيجارك في ألمانيا: احسب نسبة التخفيض، وأنشئ إخطارًا بالعيوب وفق المادة 536c من القانون المدني الألماني، ودعنا نرسله إلى المؤجر بالبريد.",
    "seo.faq.title":
      "تخفيض الإيجار في ألمانيا: الأسئلة الشائعة",
    "seo.faq.description":
      "أهم الأسئلة حول تخفيض الإيجار: كم يمكنك أن تخفض، ومتى يبدأ التخفيض، وهل يلزم موافقة المؤجر؟ استنادًا إلى القانون المدني الألماني.",
    "nav.cta": "تحقق الآن",
    "hero.badge": "بموجب § 536 BGB: حقك القانوني",
    "hero.title1": "عفن، ضجيج، تدفئة معطلة؟ إليك مقدار",
    "hero.title2": "تخفيض الإيجار",
    "hero.title3": "الذي تستحقه.",
    "hero.subtitle":
      "أنشئ إشعار العيب خلال دقيقتين وحمّله مجاناً. وإن رغبت، أرسله مباشرة كخطاب عادي أو كـ Einwurf-Einschreiben.",
    "hero.cta1": "تحقق من حقك مجاناً",
    "hero.cta2": "إنشاء إشعار بالعيب",
    "hero.selectLang": "اختر اللغة",
    "hero.stat1label": "BGB: حقك القانوني",
    "hero.stat2": "حتى 100%",
    "hero.stat2label": "تخفيض الإيجار ممكن",
    "hero.stat3": "دقيقتان",
    "hero.stat3label": "تحقق من الحق أونلاين",
    "how.title": "كيف يعمل",
    "how.subtitle": "في 4 خطوات بسيطة إلى حقك في تخفيض الإيجار",
    "how.step": "الخطوة",
    "how.s1.title": "اختر العيب",
    "how.s1.desc": "اختر من أكثر من 60 عيباً شائعاً في المساكن.",
    "how.s2.title": "احسب التخفيض",
    "how.s2.desc": "نحسب بناءً على أحكام المحاكم مقدار تخفيض الإيجار المستحق لك.",
    "how.s3.title": "أنشئ الإشعار",
    "how.s3.desc": "من بياناتك ننشئ إشعاراً قانونياً وفقاً لـ § 536c BGB.",
    "how.s4.title": "حمّل الرسالة",
    "how.s4.desc":
      "حمّل إشعار العيوب الجاهز بصيغة PDF أو ملف نصي، مجاناً ودون تسجيل. أو دعنا نرسله إلى المؤجر كخطاب عادي أو كـ Einwurf-Einschreiben.",
    "check.phase.eligibility": "التحقق",
    "check.phase.defects": "العيوب",
    "check.phase.rent": "الإيجار",
    "check.result": "النتيجة",
    "check.back": "رجوع",
    "check.next": "التالي",
    "check.allCategories": "جميع الفئات",
    "check.whichDefects": "ما هي العيوب الموجودة؟",
    "check.whichDefectsDesc": "اختر فئة ثم حدد العيوب المناسبة. يمكنك اختيار عدة عيوب.",
    "check.selected": "عيوب مختارة",
    "check.approxReduction": "تخفيض",
    "check.rentTitle": "كم إيجارك الشهري؟",
    "check.rentDesc": "أدخل إيجارك الإجمالي الدافئ (الإيجار البارد + جميع التكاليف الإضافية).",
    "check.rentPlaceholder": "مثال 1000",
    "check.rentInfo": "الإيجار الإجمالي = الإيجار الصافي + الدفعات المقدمة للمرافق.",
    "check.showResult": "عرض النتيجة",
    "check.resultTitle": "من المحتمل أن يكون لديك الحق في تخفيض الإيجار!",
    "check.reductionRate": "نسبة التخفيض",
    "check.range": "النطاق",
    "check.gesamtbetrachtungHint":
      "لا تجمع المحاكم العيوب المتعددة ببساطة، بل تقيّم مدى تضرر السكن ككل. لذلك تكون النسبة الإجمالية أقل من مجموع القيم الفردية.",
    "check.flaecheTitle": "أدخل مساحة السكن",
    "check.flaecheDesc":
      "لا يوجد نطاق لمساحة السكن: إذا تجاوز الفارق 10 % ينخفض الإيجار بنسبة المساحة الناقصة بالضبط. وحتى 10 % لا يوجد عيب.",
    "check.flaecheVereinbart": "المساحة المتفق عليها (م²)",
    "check.flaecheTatsaechlich": "المساحة الفعلية (م²)",
    "check.flaecheMangel":
      "فارق {abweichung} % - هذا عيب. نسبة التخفيض {quote} %.",
    "check.flaecheKeinMangel":
      "فارق {abweichung} % - حتى 10 % لا ترى المحكمة الاتحادية وجود عيب. التخفيض 0 %.",
    "check.monthlySavings": "التوفير الشهري",
    "check.yearlySavings": "التوفير السنوي",
    "check.withPermanent": "في حالة عيب دائم",
    "check.disclaimer": "الحساب مبني على أحكام قضائية نموذجية ويعتبر دليلاً إرشادياً.",
    "check.yourDefects": "العيوب المختارة:",
    "check.nextStep": "الخطوة التالية: أنشئ إشعاراً قانونياً للمؤجر.",
    "check.createLetter": "أنشئ الإشعار الآن",
    "check.editDefects": "تعديل العيوب",
    "check.notEligibleTitle": "من المحتمل عدم وجود حق",
    "check.notEligibleHint": "هذا تقييم أولي. في حالة الشك استشر جمعية المستأجرين أو محامياً.",
    "check.tryAgain": "تحقق مرة أخرى",
    "eq.mietvertrag.q": "هل لديك عقد إيجار صالح؟",
    "eq.mietvertrag.desc": "يشترط تخفيض الإيجار وجود علاقة إيجارية قائمة.",
    "eq.mietvertrag.ja": "نعم",
    "eq.mietvertrag.nein": "لا",
    "eq.mangel_bekannt.q": "هل كنت تعلم بالعيب عند إبرام العقد أو استلام الشقة؟",
    "eq.mangel_bekannt.desc": "من يعلم بالعيب عند إبرام العقد لا يمكنه التخفيض بسببه لاحقاً (المادة 536b جملة 1). وعند الاستلام رغم العلم يبقى الحق فقط إذا تحفظت على حقوقك (جملة 3). وإذا أخفى المؤجر العيب بغش تبقى حقوقك في كل الأحوال (جملة 2).",
    "eq.mangel_bekannt.nein": "لا، اكتشفت العيب لاحقاً",
    "eq.mangel_bekannt.ja_vorbehalt": "نعم، لكنني تحفظت على حقوقي",
    "eq.mangel_bekannt.ja_arglist": "نعم، لكن المؤجر أخفى العيب",
    "eq.mangel_bekannt.ja": "نعم، دون تحفظ",
    "eq.selbst_verursacht.q": "هل تسببت في العيب بنفسك؟",
    "eq.selbst_verursacht.desc": "إذا تسبب المستأجر في العيب بنفسه، يسقط حق التخفيض.",
    "eq.selbst_verursacht.nein": "لا",
    "eq.selbst_verursacht.ja": "نعم",
    "eq.selbst_verursacht.unsicher": "لست متأكداً",
    "eq.erheblich.q": "ما مدى تأثير العيب على سكنك؟",
    "eq.erheblich.desc": "العيوب الجوهرية وحدها تمنح الحق في التخفيض (المادة 536 فقرة 1 جملة 3). غير أن عدة عيوب بسيطة مجتمعة قد تتجاوز هذا الحد.",
    "eq.erheblich.stark": "قوي: جودة السكن محدودة بشكل واضح",
    "eq.erheblich.mittel": "متوسط: تأثير ملموس",
    "eq.erheblich.gering": "خفيف: إزعاج بسيط فقط",
    "eq.angezeigt.q": "هل أبلغت المؤجر بالعيب؟",
    "eq.angezeigt.desc": "يسري التخفيض بقوة القانون حتى دون إخطار. لكن الإخطار بالعيب هو ما يمكّنك من تنفيذه (المادة 536c). نساعدك في إعداده.",
    "eq.angezeigt.ja": "نعم، كتابياً",
    "eq.angezeigt.muendlich": "شفهياً فقط",
    "eq.angezeigt.nein": "لا، ليس بعد",
    "eq.reason.mietvertrag": "بدون عقد إيجار صالح لا يوجد للأسف حق في تخفيض الإيجار.",
    "eq.reason.mangel_bekannt": "إذا كنت تعلم بالعيب عند الانتقال ولم تعترض، يسقط حق التخفيض (§ 536b BGB).",
    "eq.reason.selbst_verursacht": "إذا تسببت في العيب بنفسك، لا يوجد حق في تخفيض الإيجار.",
    "eq.reason.erheblich": "فقط العيوب الجوهرية تمنح حق التخفيض. العيوب البسيطة (§ 536 Abs. 1 S. 3 BGB) لا تكفي للأسف.",
    "eq.reason.default": "في هذه الحالة لا يوجد حق للأسف.",
    "letter.title": "إنشاء إشعار بالعيب",
    "letter.subtitle": "أنشئ إشعاراً قانونياً وفقاً لـ § 536c BGB.",
    "letter.step.data": "بياناتك",
    "letter.step.landlord": "المؤجر",
    "letter.step.defects": "الوصف",
    "letter.step.preview": "معاينة",
    "letter.step.send": "التحميل",
    "letter.yourData": "بياناتك (المستأجر)",
    "letter.name": "الاسم الكامل",
    "letter.street": "الشارع ورقم المبنى",
    "letter.zip": "الرمز البريدي",
    "letter.city": "المدينة",
    "letter.aptNr": "رقم الشقة (اختياري)",
    "letter.phone": "رقم الهاتف (اختياري)",
    "letter.landlordData": "بيانات المؤجر",
    "letter.landlordName": "اسم المؤجر / شركة الإدارة",
    "letter.salutation": "صيغة المخاطبة في الخطاب",
    "letter.salutationCompany": "شركة",
    "letter.salutationMs": "السيدة",
    "letter.salutationMr": "السيد",
    "letter.describeDefects": "صف العيوب",
    "letter.describeHint": "صف كل عيب بأكبر قدر ممكن من التفصيل.",
    "letter.whichRoom": "في أي غرفة يظهر العيب؟",
    "letter.sincewhen": "منذ متى يوجد العيب؟",
    "letter.detailDesc": "وصف مفصل",
    "letter.nativeHint": "يمكنك الكتابة بلغتك الأم، وسيترجم الذكاء الاصطناعي إلى الألمانية.",
    "letter.showPreview": "عرض المعاينة",
    "letter.creating": "جارٍ إنشاء الرسالة...",
    "letter.previewTitle": "معاينة إشعارك",
    "letter.editHint": "يمكنك تعديل النص مباشرة قبل إرساله.",
    "letter.signature": "توقيع رقمي (اختياري)",
    "letter.clearSig": "مسح",
    "letter.sigSaved": "تم الحفظ",
    "letter.deliveryOptions": "التنزيل أو الإرسال",
    "letter.backPreview": "العودة للمعاينة",
    "letter.howReceive": "إشعار العيوب الخاص بك جاهز",
    "letter.downloadDesc": "حمّل الرسالة كـ PDF واطبعها بنفسك.",
    "letter.free": "مجاني",
    "letter.downloadPdf": "تحميل كـ PDF",
    "letter.downloadTxt": "كملف نصي",
    "letter.copyText": "نسخ النص",
    "letter.copied": "تم النسخ!",
    "letter.warning":
      "أرسل الإشعار بطريقة يمكنك توثيقها لاحقاً: Einwurf-Einschreiben، أو مُرسِل بصحبة شاهد، أو التسليم شخصياً مقابل إيصال استلام. لا يكفي بريد إلكتروني عادي كإثبات للاستلام.",
    "teaser.title": "إنشاء إشعار بالعيب",
    "teaser.desc": "أنشئ إشعاراً قانونياً للمؤجر.",
    "teaser.feat1": "قالب قانوني وفقاً لـ § 536c BGB",
    "teaser.feat2": "يُملأ تلقائياً ببياناتك",
    "teaser.feat3": "تحميل بصيغة PDF أو ملف نصي",
    "teaser.feat4": "توقيع رقمي ممكن",
    "teaser.feat5": "يمكنك الكتابة بلغتك الأم",
    "teaser.cta": "تحقق من الحق: يُنشأ الخطاب تلقائياً",
    "info.title": "حقك في تخفيض الإيجار: أهم الحقائق",
    "info.subtitle": "كل ما تحتاج معرفته عن تخفيض الإيجار في ألمانيا",
    "info.c1.title": "حق قانوني",
    "info.c1.desc": "تخفيض الإيجار منصوص عليه في § 536 BGB ويسري تلقائياً عند وجود عيب جوهري.",
    "info.c2.title": "لا يمكن استبعاده",
    "info.c2.desc": "لا يمكن استبعاد حق التخفيض بموجب عقد الإيجار (§ 536 Abs. 4 BGB).",
    "info.c3.title": "الإخطار بالعيب يؤمّن حقك",
    "info.c3.desc": "ينشأ التخفيض بقوة القانون حتى دون إخطار. لكن تنفيذه وإثباته لا يتم إلا به: فبدون إخطار فوري تفقد الحق بقدر ما تعذّر على المؤجر الإصلاح لهذا السبب تحديداً (المادة 536c فقرة 2 جملة 2 رقم 1).",
    "info.c4.title": "يستند إلى الإيجار الإجمالي الدافئ",
    "info.c4.desc": "يُحتسب التخفيض من الإيجار الإجمالي (الإيجار الصافي + المرافق). وبالنسبة لإيجار السكن قضت المحكمة الاتحادية بذلك في 20.07.2005 (رقم VIII ZR 347/04).",
    "info.c5.title": "احذر من المبلغ",
    "info.c5.desc": "قد يؤدي تأخر يزيد على إيجار شهر واحد في موعدين متتاليين إلى الفسخ دون إنذار (المادة 543 فقرة 2 جملة 1 رقم 3 بند أ). عند الشك: ادفع الإيجار كاملاً مع التحفظ وطالب باسترداده لاحقاً.",
    "info.c6.title": "تصرف في الوقت المناسب",
    "info.c6.desc": "يجب تقديم الإشعار فوراً بعد الاكتشاف. دفع الإيجار الكامل لأكثر من 6 أشهر قد يؤدي لفقدان الحق.",
    "faq.badge": "الأسئلة الشائعة",
    "faq.title": "كل شيء عن تخفيض الإيجار",
    "faq.subtitle": "إجابات على أهم الأسئلة حول تخفيض الإيجار في ألمانيا.",
    "faq.legal.title": "تنبيه قانوني",
    "faq.legal.text": "المعلومات المقدمة على هذا الموقع هي للمعلومات العامة فقط ولا تشكل استشارة قانونية.",
    "footer.desc": "نساعد المستأجرين في ألمانيا على تحقيق حقهم في تخفيض الإيجار.",
    "footer.service": "الخدمة",
    "footer.legal": "قانوني",
    "footer.imprint": "البيانات القانونية",
    "footer.privacy": "الخصوصية",
    "footer.terms": "الشروط",
    "footer.rights": "جميع الحقوق محفوظة.",
    "footer.noLegal": "ليست استشارة قانونية. المعلومات بدون ضمان.",
    "footer.withdrawal": "حق الانسحاب",

    // Shared
    "common.note": "ملاحظة",
    "common.backHome": "إلى الصفحة الرئيسية",

    // Wizard, Frist und "Wie geht es weiter?"
    "letter.step.frist": "المهلة",
    "check.pickCategoryHint": "اختر فئة لعرض العيوب المندرجة تحتها.",
    "check.removeLabel": "إزالة {label}",
    "check.nextStepTitle": "الخطوة التالية: إشعار العيوب",
    "letter.phoneWhy": "عند إدخال رقم، يعرض الخطاب على المؤجّر موعدًا لإصلاح العيب.",
    "letter.landlordDesc": "يجب أن يصل الإشعار إلى المؤجّر أو شركة الإدارة. تجد الاسم في عقد الإيجار أو في كشف تكاليف التشغيل.",
    "letter.landlordAddressHint": "اكتب الاسم كما ورد في عقد الإيجار. الإضافات مثل «c/o» أو الصيغ القانونية الطويلة جدًا لا تتّسع في حقل العنوان بالخطاب.",
    "letter.toDeadline": "المتابعة إلى المهلة",
    "letter.signatureDesc": "يمكنك أيضًا تنزيل الخطاب دون توقيع وتوقيعه يدويًا بعد الطباعة.",
    "frist.title": "بحلول أي موعد يجب على المؤجّر إصلاح العيب؟",
    "frist.desc": "يحتاج المؤجّر إلى مهلة معقولة. القصيرة جدًا قابلة للطعن، والطويلة جدًا تكلّفك أسابيع.",
    "frist.days": "{n} أيام",
    "frist.until": "حتى {datum}",
    "frist.recommended": "موصى به",
    "frist.suggestion": "نقترح {n} أيام — وهي المهلة المعتادة لـ «{mangel}». وعند تعدّد العيوب يحسم الأمرَ أشدُّها إلحاحًا.",
    "frist.suggestionUrgent": "نقترح {n} أيام. «{mangel}» لا يحتمل التأجيل. وعند تعدّد العيوب يحسم الأمرَ أشدُّها إلحاحًا.",
    "frist.deliveryTitle": "تبدأ المهلة من تاريخ الوصول، لا من تاريخ الإرسال.",
    "frist.deliveryText": "المعوَّل عليه هو اليوم الذي يصل فيه الخطاب إلى صندوق بريد المؤجّر. أضِف يومًا أو يومَي عمل للبريد. وإذا صادف انتهاء المهلة سبتًا أو أحدًا أو عطلة رسمية، فإنها تنتهي في يوم العمل التالي (§ 193 BGB).",
    "frist.urgentTitle": "هنا يلزم الاستعجال.",
    "frist.urgentText": "أبلِغ عن «{mangel}» هاتفيًا أيضًا ودوِّن متى تحدثت ومع مَن. وإن لم يحدث شيء حتى نهاية المهلة، جاز لك إصلاح العيب على نفقة المؤجّر (§ 536a Abs. 2 BGB).",
    "next.title": "وماذا بعد؟",
    "next.subtitle": "ما ينبغي فعله الآن — وما يمكن توقّعه.",
    "next.s1.when": "اليوم، {datum}",
    "next.s1.text": "اطبع الإشعار ووقّعه وأرسله بطريقة يمكن إثبات وصولها: بريد مسجَّل بإفادة تسليم، أو مُرسَل بحضور شاهد، أو تسليم شخصي مقابل إيصال. ولا يكفي البريد الإلكتروني العادي كإثبات للوصول.",
    "next.s2.when": "خلال يوم إلى ثلاثة أيام عمل",
    "next.s2.text": "الخطاب في صندوق بريد المؤجّر. من ذلك اليوم يعلم بالعيب — ومن ذلك اليوم تبدأ مهلتك.",
    "next.s3.when": "اعتبارًا من الوصول",
    "next.s3.text": "لا توجد مهلة قانونية للرد. كثير من المؤجّرين يتواصلون خلال أيام عمل قليلة لتحديد موعد معاينة، لكنهم غير ملزَمين بذلك. استمر في دفع الإيجار كاملًا في الوقت الحالي، واكتب في بيان الغرض: «Zahlung unter Vorbehalt wegen Mangel».",
    "next.s4.when": "بحلول {datum}",
    "next.s4.text": "نهاية مهلتك. يجب أن يكون العيب قد أُصلح بحلول هذا اليوم. واصِل التوثيق: صور مؤرّخة، وسجل حرارة أو ضوضاء.",
    "next.s5.when": "اعتبارًا من {datum}",
    "next.s5.text": "إن لم يحدث شيء، فالمؤجّر في حالة تأخّر. يمكنك إرسال خطاب ثانٍ بمهلة أخيرة، واسترداد ما دفعته زائدًا من الإيجار، والمطالبة بالتعويض أو بالإصلاح البديل وفق § 536a BGB. وستراجع حالتك جمعيةُ مستأجرين أو محامٍ مختص.",
    "next.caution": "عند الشك، خفِّض بتحفّظ. فمن يقتطع أكثر من اللازم ويتراكم عليه إيجار شهرين يخاطر بالفسخ الفوري (§ 543 Abs. 2 Nr. 3 BGB).",
    "next.guideLink": "دليل: كيف تكتب إشعار العيوب بشكل صحيح",
    "dispatch.emailLabel": "البريد الإلكتروني لتأكيد الطلب",
    "dispatch.emailWhy": "سنرسل تأكيد الطلب وحالة الإرسال إلى هذا العنوان.",
    "info.c7.title": "بعد الإرسال",
    "info.c7.desc": "ليس على المؤجّر أن يردّ فورًا — فلا توجد مهلة قانونية للرد. المهم هو مهلة الإصلاح: 14 يومًا كقاعدة، وأقصر في العيوب العاجلة. وتبدأ من وصول الخطاب. فإن لم يحدث شيء حتى ذلك الحين، صار المؤجّر في حالة تأخّر.",

    // FAQ page
    "faq.showAll": "عرض جميع الأسئلة والأجوبة",
    "faqpage.allTitle": "جميع الأسئلة والأجوبة",
    "faqpage.cta.title": "لم تجد سؤالك؟",
    "faqpage.cta.desc":
      "استخدم فحصنا المجاني لتخفيض الإيجار. في خطوات قليلة ستعرف ما إذا كان يحق لك التخفيض وبأي نسبة.",

    // Letter - delivery
    "letter.basedOn":
      "بناءً على فحصك: نحو {quote} ٪ تخفيض عند إيجار إجمالي قدره {rent} €.",

    // Letter — dispatch by post (eBrief)
    "dispatch.title": "أرسل الخطاب مباشرة إلى المؤجر",
    "dispatch.subtitle":
      "نطبع إشعار العيب ونرسله بالبريد — لا تحتاج إلى طابعة ولا إلى طابع بريد.",
    "dispatch.chooseProduct": "اختر طريقة الإرسال",
    "dispatch.brief": "كخطاب عادي",
    "dispatch.einschreiben": "كـ Einwurf-Einschreiben",
    "dispatch.einschreibenHint":
      "تُسجِّل شركة البريد إيداع الخطاب في صندوق البريد. وبمجرد الإبلاغ عن التسليم نرسل إليك رقم الإرسالية ورابط التتبّع عبر البريد الإلكتروني. وهو ليس Übergabe-Einschreiben الذي يوقّع عليه المستلم — ولا يمكن لأي منتج بريدي أن يقدّم إثباتاً قاطعاً للاستلام.",
    "dispatch.taxNote": "وفقاً لـ § 19 UStG لا تُحتسب ضريبة القيمة المضافة.",
    "dispatch.taxNoteRegel":
      "جميع الأسعار نهائية وتشمل ضريبة القيمة المضافة بنسبة 19 %.",
    "dispatch.send": "إرسال مقابل رسوم",
    "dispatch.consentHeading": "قبل أن نتمكن من بدء الطباعة",
    "dispatch.consentStart":
      "أطلب صراحةً أن تبدؤوا طباعة إشعار العيوب الخاص بي وإرساله قبل انقضاء مهلة الانسحاب.",
    "dispatch.consentExpiry":
      "أعلم أن حقي في الانسحاب يسقط بمجرد تنفيذكم الخدمة بالكامل، أي بمجرد طباعة الخطاب وتسليمه للتوزيع. وأؤكد بهذا علمي بذلك.",
    "dispatch.consentLink": "الحق في الانسحاب",
    "dispatch.error.zustimmung_fehlt":
      "يرجى تأكيد الإقرارين معاً؛ فبدونهما لا يمكننا طباعة الخطاب وإرساله قبل انتهاء مهلة الانسحاب.",
    "dispatch.preparing": "جارٍ تجهيز الإرسال...",
    "dispatch.checkingAddress": "جارٍ التحقق من العنوان...",
    "dispatch.redirecting": "جارٍ الانتقال إلى الدفع...",
    "dispatch.confirmSend": "العنوان صحيح — إرسال مقابل رسوم",
    "dispatch.addressWarning":
      "تعذّر التحقق من عنوان المؤجر بشكل مؤكد. يرجى مراجعته قبل الإرسال المدفوع.",
    "dispatch.showMarked": "عرض العنوان الذي تم التعرف عليه",
    "dispatch.fixAddress": "تصحيح عنوان المؤجر",
    "dispatch.freeStays": "يبقى التنزيل المجاني متاحاً في كل الأحوال.",
    "dispatch.result.erfolg.title": "تم الدفع بنجاح",
    "dispatch.result.erfolg.text":
      "شكراً لك — تم استلام دفعتك. سيتم الآن طباعة إشعار العيب وإرساله بالبريد إلى مالك العقار.",
    "dispatch.result.erfolg.note":
      "ستصلك رسالة التأكيد عبر البريد الإلكتروني على العنوان الذي أدخلته عند الإرسال. لا يلزمك فعل أي شيء آخر. لأسباب تتعلق بحماية البيانات لا يُحفظ إشعار العيب في متصفحك، ولذلك لا يمكن عرضه هنا مرة أخرى.",
    "dispatch.result.abbruch.title": "تم إلغاء الدفع",
    "dispatch.result.abbruch.text": "لم يتم إرسال أي شيء ولم يتم خصم أي مبلغ.",
    "dispatch.result.abbruch.note":
      "لأسباب تتعلق بحماية البيانات لا يُحفظ إشعار العيب في متصفحك، ولذلك لم يعد متاحاً. إذا كنت تريد إرساله أو تنزيله مجاناً، يرجى تعبئة النموذج من جديد — لن يستغرق ذلك سوى بضع دقائق.",
    "dispatch.result.restartCta": "إنشاء إشعار العيب من جديد",
    "dispatch.hint.kopf":
      "تعذّر التعرف على ترويسة الخطاب، لذلك قد تظهر العناوين مرة أخرى داخل نص الخطاب.",
    "dispatch.hint.datum":
      "لم يُعثر على سطر التاريخ في الخطاب. يرجى التأكد من وجود التاريخ في النص.",
    "dispatch.hint.absender":
      "تم اختصار سطر المرسِل ليتّسع في حقل العنوان.",
    "dispatch.error.allgemein":
      "الإرسال غير ممكن حالياً. يرجى المحاولة لاحقاً.",
    "dispatch.error.versand_nicht_konfiguriert":
      "الإرسال البريدي غير متاح حالياً. يرجى تنزيل إشعار العيب أعلاه وإرساله بنفسك.",
    "dispatch.error.zu_viele_anfragen":
      "تم إجراء محاولات إرسال كثيرة. يرجى المحاولة بعد ساعة.",
    "dispatch.error.unvollstaendig":
      "هناك بيانات ناقصة. يرجى العودة واستكمال عنوانك وبريدك الإلكتروني وعنوان المؤجر.",
    "dispatch.error.anschrift_zu_lang":
      "عنوان المؤجر أطول من حقل العنوان. يرجى اختصار الاسم أو الشارع أو المدينة — مثلاً بحذف إضافات مثل «c/o» أو الشكل القانوني للشركة.",
    "dispatch.error.pdf_fehler":
      "تعذّر إنشاء الخطاب. يرجى رسم التوقيع من جديد أو المتابعة بدونه ثم المحاولة مرة أخرى.",
    "dispatch.error.ebrief_fehler":
      "مزود خدمة الإرسال لا يستجيب حالياً. يرجى المحاولة بعد بضع دقائق — لم يتم تحصيل أي مبلغ.",
    "dispatch.error.preis_unplausibel":
      "لا يمكن إرسال هذا الخطاب بالسعر المذكور، غالباً لأنه طويل جداً. يرجى اختصار النص والمحاولة مرة أخرى.",
    "dispatch.error.token_ungueltig":
      "انتهت صلاحية عملية الإرسال. يرجى بدء الإرسال من جديد.",
    "dispatch.error.jobId_ungueltig":
      "تعذّر العثور على عملية الإرسال. يرجى بدء الإرسال من جديد.",
    "dispatch.error.kein_dokument":
      "لا يزال الخطاب قيد المعالجة. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.",
    "dispatch.error.bereits_versendet":
      "تم إرسال إشعار العيب هذا بالفعل. ولن يتم تحصيل أي مبلغ إضافي.",
    "dispatch.error.versand_nicht_moeglich":
      "لا يمكن دفع رسوم هذا الإرسال. يرجى بدء الإرسال من جديد — لم يتم تحصيل أي مبلغ.",
    "dispatch.error.checkout_fehler":
      "تعذّر فتح صفحة الدفع. يرجى المحاولة مرة أخرى — لم يتم تحصيل أي مبلغ.",
    "dispatch.error.zeitueberschreitung":
      "تستغرق العملية وقتاً أطول من المتوقع. يرجى المحاولة بعد بضع دقائق — لم يتم تحصيل أي مبلغ.",
  },

  pl: {
    "nav.check": "Sprawdź prawo",
    "nav.letter": "Zgłoszenie usterki",
    "nav.how": "Jak to działa",
    "nav.faq": "FAQ",
    "nav.table": "Tabela",
    "nav.guide": "Poradnik",
    "nav.send": "Wyślij pismo",
    "versand.teaser.eyebrow": "Nie tylko sprawdź — załatw",
    "versand.teaser.more": "Jak działa wysyłka",

    // SEO metadata for the pages that exist in every language
    "seo.home.title":
      "Obniżka czynszu w Niemczech: sprawdź swoje prawo i wyślij pismo",
    "seo.home.description":
      "Sprawdź bezpłatnie, czy możesz obniżyć czynsz w Niemczech: oblicz wysokość obniżki, przygotuj zgłoszenie wad zgodnie z § 536c BGB i zleć nam wysyłkę do wynajmującego.",
    "seo.faq.title":
      "Obniżka czynszu w Niemczech: najczęstsze pytania",
    "seo.faq.description":
      "Najważniejsze pytania o obniżkę czynszu: o ile można obniżyć, od kiedy obowiązuje i czy potrzebna jest zgoda wynajmującego. Na podstawie niemieckiego kodeksu cywilnego.",
    "nav.cta": "Sprawdź teraz",
    "hero.badge": "Na podstawie § 536 BGB: Twoje ustawowe prawo",
    "hero.title1": "Pleśń, hałas, zepsute ogrzewanie? Oto, jaka",
    "hero.title2": "obniżka czynszu",
    "hero.title3": "Ci przysługuje.",
    "hero.subtitle":
      "Utwórz zgłoszenie usterki w 2 minuty i pobierz bezpłatnie. Na życzenie wyślij je od razu listem lub jako Einwurf-Einschreiben.",
    "hero.cta1": "Bezpłatnie sprawdź prawo",
    "hero.cta2": "Utwórz zgłoszenie usterki",
    "hero.selectLang": "Wybierz język",
    "hero.stat1label": "BGB: Twoje prawo",
    "hero.stat2": "do 100%",
    "hero.stat2label": "Obniżka czynszu możliwa",
    "hero.stat3": "2 min.",
    "hero.stat3label": "Sprawdzenie prawa online",
    "how.title": "Jak to działa",
    "how.subtitle": "W 4 prostych krokach do Twojego prawa do obniżki czynszu",
    "how.step": "KROK",
    "how.s1.title": "Wybierz usterkę",
    "how.s1.desc": "Wybierz spośród ponad 60 typowych usterek mieszkaniowych.",
    "how.s2.title": "Oblicz obniżkę",
    "how.s2.desc": "Obliczymy na podstawie aktualnych orzeczeń sądowych, jaka obniżka Ci przysługuje.",
    "how.s3.title": "Utwórz zgłoszenie",
    "how.s3.desc": "Z Twoich danych wygenerujemy prawnie wiążące zgłoszenie zgodnie z § 536c BGB.",
    "how.s4.title": "Pobierz list",
    "how.s4.desc":
      "Pobierz gotowe zgłoszenie wad w formacie PDF lub pliku tekstowego, bezpłatnie i bez rejestracji. Albo zleć nam wysyłkę do wynajmującego listem lub jako Einwurf-Einschreiben.",
    "check.phase.eligibility": "Sprawdzenie",
    "check.phase.defects": "Usterki",
    "check.phase.rent": "Czynsz",
    "check.result": "Wynik",
    "check.back": "Wstecz",
    "check.next": "Dalej",
    "check.allCategories": "Wszystkie kategorie",
    "check.whichDefects": "Jakie usterki występują?",
    "check.whichDefectsDesc": "Wybierz kategorię, a następnie zaznacz odpowiednie usterki. Możesz wybrać kilka.",
    "check.selected": "usterek wybranych",
    "check.approxReduction": "Obniżka",
    "check.rentTitle": "Jaki jest Twój miesięczny czynsz?",
    "check.rentDesc": "Wpisz czynsz brutto ciepły (czynsz zimny + wszystkie koszty dodatkowe).",
    "check.rentPlaceholder": "np. 1000",
    "check.rentInfo": "Czynsz brutto = Czynsz netto + Zaliczki na media.",
    "check.showResult": "Pokaż wynik",
    "check.resultTitle": "Prawdopodobnie masz prawo do obniżki czynszu!",
    "check.reductionRate": "Stawka obniżki",
    "check.range": "Zakres",
    "check.gesamtbetrachtungHint":
      "Sądy nie sumują po prostu kilku wad, lecz oceniają całkowite pogorszenie mieszkania. Dlatego łączna stawka jest niższa niż suma pojedynczych wartości.",
    "check.flaecheTitle": "Podaj powierzchnię mieszkania",
    "check.flaecheDesc":
      "Przy powierzchni nie ma widełek: powyżej 10 % odchylenia czynsz obniża się dokładnie o procent brakującej powierzchni. Do 10 % włącznie wada nie występuje.",
    "check.flaecheVereinbart": "Powierzchnia z umowy (m²)",
    "check.flaecheTatsaechlich": "Powierzchnia rzeczywista (m²)",
    "check.flaecheMangel":
      "Odchylenie {abweichung} % - to wada. Obniżka wynosi {quote} %.",
    "check.flaecheKeinMangel":
      "Odchylenie {abweichung} % - do 10 % włącznie BGH nie widzi wady. Obniżka wynosi 0 %.",
    "check.monthlySavings": "Miesięczna oszczędność",
    "check.yearlySavings": "Roczna oszczędność",
    "check.withPermanent": "przy trwałej usterce",
    "check.disclaimer": "Obliczenie opiera się na typowych orzeczeniach sądowych i stanowi punkt orientacyjny.",
    "check.yourDefects": "Twoje wybrane usterki:",
    "check.nextStep": "Następny krok: Utwórz prawnie wiążące zgłoszenie dla wynajmującego.",
    "check.createLetter": "Utwórz zgłoszenie teraz",
    "check.editDefects": "Edytuj usterki",
    "check.notEligibleTitle": "Prawdopodobnie brak prawa",
    "check.notEligibleHint": "To wstępna ocena. W razie wątpliwości skonsultuj się ze związkiem najemców lub prawnikiem.",
    "check.tryAgain": "Sprawdź ponownie",
    "eq.mietvertrag.q": "Czy masz ważną umowę najmu?",
    "eq.mietvertrag.desc": "Obniżka czynszu wymaga istniejącego stosunku najmu.",
    "eq.mietvertrag.ja": "Tak",
    "eq.mietvertrag.nein": "Nie",
    "eq.mangel_bekannt.q": "Czy wiedziałeś o wadzie już przy zawarciu umowy lub odbiorze mieszkania?",
    "eq.mangel_bekannt.desc": "Kto zna wadę przy zawarciu umowy, nie może z jej powodu później obniżyć czynszu (§ 536b zd. 1 BGB). Przy odbiorze mimo wiedzy prawo zostaje tylko wtedy, gdy zastrzegłeś swoje prawa (zd. 3). Jeśli wynajmujący podstępnie zataił wadę, twoje prawa pozostają w każdym wypadku (zd. 2).",
    "eq.mangel_bekannt.nein": "Nie, wadę odkryłem dopiero później",
    "eq.mangel_bekannt.ja_vorbehalt": "Tak, ale zastrzegłem swoje prawa",
    "eq.mangel_bekannt.ja_arglist": "Tak, ale wynajmujący zataił wadę",
    "eq.mangel_bekannt.ja": "Tak, bez zastrzeżenia",
    "eq.selbst_verursacht.q": "Czy sam spowodowałeś usterkę?",
    "eq.selbst_verursacht.desc": "Jeśli najemca sam spowodował usterkę, prawo do obniżki wygasa.",
    "eq.selbst_verursacht.nein": "Nie",
    "eq.selbst_verursacht.ja": "Tak",
    "eq.selbst_verursacht.unsicher": "Nie jestem pewien",
    "eq.erheblich.q": "Jak mocno usterka wpływa na Twoje mieszkanie?",
    "eq.erheblich.desc": "Tylko istotne wady uprawniają do obniżki czynszu (§ 536 ust. 1 zd. 3 BGB). Kilka drobnych wad razem może jednak przekroczyć ten próg.",
    "eq.erheblich.stark": "Mocno: jakość mieszkania wyraźnie ograniczona",
    "eq.erheblich.mittel": "Średnio: odczuwalny wpływ",
    "eq.erheblich.gering": "Lekko: tylko niewielka niedogodność",
    "eq.angezeigt.q": "Czy zgłosiłeś usterkę wynajmującemu?",
    "eq.angezeigt.desc": "Obniżka następuje z mocy prawa, także bez zgłoszenia. Ale to zgłoszenie pozwala ją wyegzekwować (§ 536c BGB). Pomożemy ci je sporządzić.",
    "eq.angezeigt.ja": "Tak, pisemnie",
    "eq.angezeigt.muendlich": "Tylko ustnie",
    "eq.angezeigt.nein": "Nie, jeszcze nie",
    "eq.reason.mietvertrag": "Bez ważnej umowy najmu niestety nie przysługuje prawo do obniżki.",
    "eq.reason.mangel_bekannt": "Jeśli wiedziałeś o usterce przy wprowadzeniu i nie zaprotestowałeś, prawo do obniżki wygasa (§ 536b BGB).",
    "eq.reason.selbst_verursacht": "Jeśli sam spowodowałeś usterkę, nie przysługuje prawo do obniżki czynszu.",
    "eq.reason.erheblich": "Tylko istotne usterki uprawniają do obniżki. Bagatelne usterki (§ 536 Abs. 1 S. 3 BGB) niestety nie wystarczają.",
    "eq.reason.default": "W tym przypadku niestety nie przysługuje prawo.",
    "letter.title": "Utwórz zgłoszenie usterki",
    "letter.subtitle": "Utwórz prawnie wiążące zgłoszenie zgodnie z § 536c BGB.",
    "letter.step.data": "Twoje dane",
    "letter.step.landlord": "Wynajmujący",
    "letter.step.defects": "Opis",
    "letter.step.preview": "Podgląd",
    "letter.step.send": "Pobieranie",
    "letter.yourData": "Twoje dane (Najemca)",
    "letter.name": "Pełne imię i nazwisko",
    "letter.street": "Ulica i numer domu",
    "letter.zip": "Kod pocztowy",
    "letter.city": "Miasto",
    "letter.aptNr": "Numer mieszkania (opcjonalnie)",
    "letter.phone": "Numer telefonu (opcjonalnie)",
    "letter.landlordData": "Dane wynajmującego",
    "letter.landlordName": "Nazwa wynajmującego / Zarządzającego",
    "letter.salutation": "Zwrot grzecznościowy w piśmie",
    "letter.salutationCompany": "Firma",
    "letter.salutationMs": "Pani",
    "letter.salutationMr": "Pan",
    "letter.describeDefects": "Opisz usterki",
    "letter.describeHint": "Opisz każdą usterkę jak najdokładniej.",
    "letter.whichRoom": "W którym pokoju występuje usterka?",
    "letter.sincewhen": "Od kiedy istnieje usterka?",
    "letter.detailDesc": "Szczegółowy opis",
    "letter.nativeHint": "Możesz pisać w swoim języku ojczystym, a AI przetłumaczy na niemiecki.",
    "letter.showPreview": "Pokaż podgląd",
    "letter.creating": "List jest tworzony...",
    "letter.previewTitle": "Podgląd Twojego zgłoszenia",
    "letter.editHint": "Możesz edytować tekst bezpośrednio przed wysłaniem.",
    "letter.signature": "Podpis cyfrowy (opcjonalnie)",
    "letter.clearSig": "Wyczyść",
    "letter.sigSaved": "Zapisano",
    "letter.deliveryOptions": "Pobranie lub wysyłka",
    "letter.backPreview": "Powrót do podglądu",
    "letter.howReceive": "Twoje zgłoszenie wad jest gotowe",
    "letter.downloadDesc": "Pobierz list jako PDF i wydrukuj samodzielnie.",
    "letter.free": "Bezpłatnie",
    "letter.downloadPdf": "Pobierz jako PDF",
    "letter.downloadTxt": "Jako plik tekstowy",
    "letter.copyText": "Kopiuj tekst",
    "letter.copied": "Skopiowano!",
    "letter.warning":
      "Wyślij zgłoszenie w sposób, który później udokumentujesz: Einwurf-Einschreiben, posłaniec ze świadkiem albo osobiste doręczenie za potwierdzeniem odbioru. Zwykły e-mail nie wystarczy jako dowód doręczenia.",
    "teaser.title": "Utwórz zgłoszenie usterki",
    "teaser.desc": "Utwórz prawnie wiążące zgłoszenie dla wynajmującego.",
    "teaser.feat1": "Szablon prawny zgodny z § 536c BGB",
    "teaser.feat2": "Automatycznie wypełniany Twoimi danymi",
    "teaser.feat3": "Pobieranie w formacie PDF lub pliku tekstowego",
    "teaser.feat4": "Podpis cyfrowy możliwy",
    "teaser.feat5": "Możliwość wypełnienia w języku ojczystym",
    "teaser.cta": "Sprawdź prawo: list tworzony automatycznie",
    "info.title": "Twoje prawo do obniżki czynszu: najważniejsze fakty",
    "info.subtitle": "Wszystko, co musisz wiedzieć o obniżce czynszu w Niemczech",
    "info.c1.title": "Prawo ustawowe",
    "info.c1.desc": "Obniżka czynszu jest zapisana w § 536 BGB i następuje automatycznie przy istotnej usterce.",
    "info.c2.title": "Nie można wykluczyć",
    "info.c2.desc": "Prawa do obniżki nie można wykluczyć umową najmu (§ 536 Abs. 4 BGB).",
    "info.c3.title": "Zgłoszenie wady zabezpiecza twoje prawo",
    "info.c3.desc": "Obniżka powstaje z mocy prawa, także bez zgłoszenia. Wyegzekwować ją i udowodnić można jednak tylko z nim: bez niezwłocznego zgłoszenia tracisz prawo w takim zakresie, w jakim wynajmujący właśnie dlatego nie mógł usunąć wady (§ 536c ust. 2 zd. 2 nr 1 BGB).",
    "info.c4.title": "Na podstawie czynszu brutto",
    "info.c4.desc": "Obniżkę liczy się od czynszu brutto (czynsz netto + media). Dla najmu mieszkaniowego BGH rozstrzygnął to 20.07.2005 (Az. VIII ZR 347/04).",
    "info.c5.title": "Ostrożnie z kwotą",
    "info.c5.desc": "Już zaległość przekraczająca jeden miesięczny czynsz w dwóch kolejnych terminach może wywołać wypowiedzenie bez terminu (§ 543 ust. 2 zd. 1 nr 3 lit. a BGB). W razie wątpliwości: płać pełny czynsz z zastrzeżeniem i żądaj zwrotu później.",
    "info.c6.title": "Działaj na czas",
    "info.c6.desc": "Zgłoszenie musi nastąpić niezwłocznie po odkryciu. Płacenie pełnego czynszu przez ponad 6 miesięcy może prowadzić do utraty prawa.",
    "faq.badge": "Najczęściej zadawane pytania",
    "faq.title": "Wszystko o obniżce czynszu",
    "faq.subtitle": "Odpowiedzi na najważniejsze pytania dotyczące obniżki czynszu w Niemczech.",
    "faq.legal.title": "Zastrzeżenie prawne",
    "faq.legal.text": "Informacje na tej stronie służą wyłącznie celom informacyjnym i nie stanowią porady prawnej.",
    "footer.desc": "Pomagamy najemcom w Niemczech korzystać z prawa do obniżki czynszu.",
    "footer.service": "Usługi",
    "footer.legal": "Informacje prawne",
    "footer.imprint": "Impressum",
    "footer.privacy": "Prywatność",
    "footer.terms": "Regulamin",
    "footer.rights": "Wszelkie prawa zastrzeżone.",
    "footer.noLegal": "Nie stanowi porady prawnej. Informacje bez gwarancji.",
    "footer.withdrawal": "Prawo odstąpienia",

    // Shared
    "common.note": "Wskazówka",
    "common.backHome": "Na stronę główną",

    // Wizard, Frist und "Wie geht es weiter?"
    "letter.step.frist": "Termin",
    "check.pickCategoryHint": "Wybierz kategorię, aby zobaczyć pasujące usterki.",
    "check.removeLabel": "Usuń {label}",
    "check.nextStepTitle": "Następny krok: zgłoszenie usterek",
    "letter.phoneWhy": "Z numerem list proponuje właścicielowi termin usunięcia usterki.",
    "letter.landlordDesc": "Zgłoszenie musi dotrzeć do właściciela lub zarządcy. Nazwę znajdziesz w umowie najmu lub na rozliczeniu kosztów.",
    "letter.landlordAddressHint": "Wpisz nazwę dokładnie tak, jak w umowie najmu. Dopiski typu „c/o” lub bardzo długa forma prawna nie zmieszczą się w polu adresowym listu.",
    "letter.toDeadline": "Dalej do terminu",
    "letter.signatureDesc": "Możesz też pobrać list bez podpisu i podpisać go odręcznie po wydrukowaniu.",
    "frist.title": "Do kiedy właściciel ma usunąć usterkę?",
    "frist.desc": "Właściciel potrzebuje rozsądnego terminu. Zbyt krótki da się podważyć, zbyt długi kosztuje Cię tygodnie.",
    "frist.days": "{n} dni",
    "frist.until": "do {datum}",
    "frist.recommended": "Zalecane",
    "frist.suggestion": "Proponujemy {n} dni — to zwykły termin dla „{mangel}”. Przy kilku usterkach decyduje zawsze najpilniejsza.",
    "frist.suggestionUrgent": "Proponujemy {n} dni. „{mangel}” nie znosi zwłoki. Przy kilku usterkach decyduje zawsze najpilniejsza.",
    "frist.deliveryTitle": "Termin biegnie od doręczenia, nie od nadania.",
    "frist.deliveryText": "Decyduje dzień, w którym list trafi do skrzynki właściciela. Doliczyć należy jeden do dwóch dni roboczych na pocztę. Jeśli koniec terminu wypada w sobotę, niedzielę lub święto, termin upływa w następny dzień roboczy (§ 193 BGB).",
    "frist.urgentTitle": "Tu liczy się czas.",
    "frist.urgentText": "Zgłoś „{mangel}” dodatkowo telefonicznie i zanotuj, kiedy i z kim rozmawiałeś. Jeśli do końca terminu nic się nie wydarzy, możesz usunąć usterkę na koszt właściciela (§ 536a Abs. 2 BGB).",
    "next.title": "Co dalej?",
    "next.subtitle": "Co teraz zrobić — i czego się spodziewać.",
    "next.s1.when": "Dziś, {datum}",
    "next.s1.text": "Wydrukuj zgłoszenie, podpisz je i wyślij tak, aby dało się udowodnić doręczenie: list polecony z potwierdzeniem, posłaniec ze świadkiem albo osobiste doręczenie za pokwitowaniem. Zwykły e-mail nie jest dowodem doręczenia.",
    "next.s2.when": "W ciągu jednego do trzech dni roboczych",
    "next.s2.text": "List jest w skrzynce właściciela. Od tego dnia wie o usterce — i od tego dnia biegnie Twój termin.",
    "next.s3.when": "Od doręczenia",
    "next.s3.text": "Nie ma ustawowego terminu na odpowiedź. Wielu właścicieli odzywa się w ciągu kilku dni roboczych, aby umówić oględziny, ale nie mają takiego obowiązku. Na razie płać czynsz w pełnej wysokości i wpisz w tytule przelewu: „Zahlung unter Vorbehalt wegen Mangel”.",
    "next.s4.when": "Do {datum}",
    "next.s4.text": "Koniec Twojego terminu. Do tego dnia usterka musi być usunięta. Dokumentuj dalej: zdjęcia z datą, protokół temperatury lub hałasu.",
    "next.s5.when": "Od {datum}",
    "next.s5.text": "Jeśli nic się nie wydarzyło, właściciel jest w zwłoce. Możesz wysłać drugie pismo z ostatnim terminem, odzyskać nadpłacony czynsz i żądać odszkodowania lub wykonania zastępczego na podstawie § 536a BGB. Zrzeszenie lokatorów lub adwokat sprawdzi Twoją sprawę.",
    "next.caution": "W razie wątpliwości obniżaj ostrożnie. Kto obetnie za dużo i uzbiera zaległość dwóch czynszów, ryzykuje wypowiedzenie bez zachowania terminu (§ 543 Abs. 2 Nr. 3 BGB).",
    "next.guideLink": "Poradnik: jak poprawnie napisać zgłoszenie usterek",
    "dispatch.emailLabel": "Adres e-mail do potwierdzenia",
    "dispatch.emailWhy": "Na ten adres wyślemy potwierdzenie zamówienia i status wysyłki.",
    "info.c7.title": "Po wysłaniu",
    "info.c7.desc": "Właściciel nie musi odpowiedzieć od razu — nie ma ustawowego terminu na odpowiedź. Liczy się termin usunięcia: z reguły 14 dni, przy pilnych usterkach krócej. Biegnie on od doręczenia listu. Jeśli do tego czasu nic się nie wydarzy, właściciel jest w zwłoce.",

    // FAQ page
    "faq.showAll": "Pokaż wszystkie pytania i odpowiedzi",
    "faqpage.allTitle": "Wszystkie pytania i odpowiedzi",
    "faqpage.cta.title": "Nie znalazłeś swojego pytania?",
    "faqpage.cta.desc":
      "Skorzystaj z naszego bezpłatnego sprawdzenia. W kilku krokach dowiesz się, czy i o ile możesz obniżyć czynsz.",

    // Letter - delivery
    "letter.basedOn":
      "Na podstawie twojego sprawdzenia: ok. {quote} % obniżki przy czynszu {rent} €.",

    // Letter — dispatch by post (eBrief)
    "dispatch.title": "Wyślij bezpośrednio do wynajmującego",
    "dispatch.subtitle":
      "Drukujemy Twoje zgłoszenie usterki i nadajemy je na poczcie — nie potrzebujesz ani drukarki, ani znaczka.",
    "dispatch.chooseProduct": "Wybierz sposób wysyłki",
    "dispatch.brief": "Jako zwykły list",
    "dispatch.einschreiben": "Jako Einwurf-Einschreiben",
    "dispatch.einschreibenHint":
      "Poczta rejestruje wrzucenie listu do skrzynki pocztowej. Gdy tylko doręczenie zostanie zgłoszone, prześlemy Ci e-mailem numer przesyłki i link do śledzenia. Nie jest to Übergabe-Einschreiben z podpisem odbiorcy — i żaden produkt pocztowy nie zapewni pewnego dowodu doręczenia.",
    "dispatch.taxNote": "Zgodnie z § 19 UStG podatek VAT nie jest naliczany.",
    "dispatch.taxNoteRegel":
      "Wszystkie ceny są cenami końcowymi i zawierają 19 % podatku VAT.",
    "dispatch.send": "Wyślij odpłatnie",
    "dispatch.consentHeading": "Zanim będziemy mogli rozpocząć druk",
    "dispatch.consentStart":
      "Wyraźnie żądam, aby rozpoczęli Państwo druk i wysyłkę mojego zgłoszenia wad przed upływem terminu odstąpienia od umowy.",
    "dispatch.consentExpiry":
      "Wiem, że moje prawo odstąpienia wygasa z chwilą pełnego wykonania usługi — to znaczy z chwilą wydrukowania listu i przekazania go do doręczenia. Niniejszym potwierdzam, że jest mi to wiadome.",
    "dispatch.consentLink": "Prawo odstąpienia",
    "dispatch.error.zustimmung_fehlt":
      "Proszę potwierdzić obie deklaracje — bez nich nie możemy wydrukować i nadać listu przed upływem terminu odstąpienia.",
    "dispatch.preparing": "Przesyłka jest przygotowywana...",
    "dispatch.checkingAddress": "Sprawdzamy adres...",
    "dispatch.redirecting": "Przechodzimy do płatności...",
    "dispatch.confirmSend": "Adres jest poprawny — wyślij odpłatnie",
    "dispatch.addressWarning":
      "Nie udało się jednoznacznie zweryfikować adresu wynajmującego. Sprawdź go, zanim wyślesz list odpłatnie.",
    "dispatch.showMarked": "Zobacz rozpoznany adres",
    "dispatch.fixAddress": "Popraw adres wynajmującego",
    "dispatch.freeStays":
      "Bezpłatne pobranie pozostaje dostępne w każdym przypadku.",
    "dispatch.result.erfolg.title": "Płatność zakończona pomyślnie",
    "dispatch.result.erfolg.text":
      "Dziękujemy — Twoja płatność wpłynęła. Twoje zgłoszenie usterki zostanie teraz wydrukowane i wysłane pocztą do wynajmującego.",
    "dispatch.result.erfolg.note":
      "Potwierdzenie otrzymasz e-mailem na adres podany przy wysyłce. Nie musisz robić nic więcej. Ze względu na ochronę danych Twoje zgłoszenie usterki nie jest zapisywane w przeglądarce i dlatego nie można go tu ponownie wyświetlić.",
    "dispatch.result.abbruch.title": "Płatność anulowana",
    "dispatch.result.abbruch.text":
      "Nic nie zostało wysłane i nic nie zostało naliczone.",
    "dispatch.result.abbruch.note":
      "Ze względu na ochronę danych Twoje zgłoszenie usterki nie jest zapisywane w przeglądarce i dlatego nie jest już dostępne. Jeśli chcesz je wysłać lub bezpłatnie pobrać, wypełnij formularz jeszcze raz — zajmie to tylko kilka minut.",
    "dispatch.result.restartCta": "Utwórz zgłoszenie usterki od nowa",
    "dispatch.hint.kopf":
      "Nie rozpoznano nagłówka listu. Adresy mogą przez to pojawić się ponownie w treści listu.",
    "dispatch.hint.datum":
      "W liście nie znaleziono wiersza z datą. Sprawdź, czy data znajduje się w tekście.",
    "dispatch.hint.absender":
      "Wiersz nadawcy został skrócony, aby zmieścił się w polu adresowym.",
    "dispatch.error.allgemein":
      "Wysyłka nie jest teraz możliwa. Spróbuj ponownie później.",
    "dispatch.error.versand_nicht_konfiguriert":
      "Wysyłka pocztowa jest obecnie niedostępna. Pobierz zgłoszenie powyżej i wyślij je samodzielnie.",
    "dispatch.error.zu_viele_anfragen":
      "Podjęto zbyt wiele prób wysyłki. Spróbuj ponownie za godzinę.",
    "dispatch.error.unvollstaendig":
      "Brakuje danych. Wróć i uzupełnij swój adres, adres e-mail oraz adres wynajmującego.",
    "dispatch.error.anschrift_zu_lang":
      "Adres wynajmującego jest za długi na pole adresowe. Skróć nazwę, ulicę lub miejscowość — na przykład usuń dodatki typu „c/o” albo formę prawną.",
    "dispatch.error.pdf_fehler":
      "Nie udało się utworzyć listu. Narysuj podpis ponownie lub pomiń go i spróbuj jeszcze raz.",
    "dispatch.error.ebrief_fehler":
      "Nasz operator wysyłki chwilowo nie odpowiada. Spróbuj ponownie za kilka minut — nic nie zostało pobrane.",
    "dispatch.error.preis_unplausibel":
      "Tego listu nie można wysłać w podanej cenie, prawdopodobnie jest za długi. Skróć tekst i spróbuj ponownie.",
    "dispatch.error.token_ungueltig":
      "Ta wysyłka wygasła. Rozpocznij wysyłkę jeszcze raz.",
    "dispatch.error.jobId_ungueltig":
      "Nie znaleziono tej wysyłki. Rozpocznij wysyłkę jeszcze raz.",
    "dispatch.error.kein_dokument":
      "List jest jeszcze przetwarzany. Odczekaj chwilę i spróbuj ponownie.",
    "dispatch.error.bereits_versendet":
      "To zgłoszenie zostało już wysłane. Nie zostanie naliczona kolejna opłata.",
    "dispatch.error.versand_nicht_moeglich":
      "Tej wysyłki nie można opłacić. Prosimy rozpocząć wysyłkę jeszcze raz — nie naliczono żadnej opłaty.",
    "dispatch.error.checkout_fehler":
      "Nie udało się otworzyć strony płatności. Spróbuj ponownie — nic nie zostało pobrane.",
    "dispatch.error.zeitueberschreitung":
      "Operacja trwa dłużej niż zwykle. Spróbuj ponownie za kilka minut — nic nie zostało pobrane.",
  },
};
