/**
 * Long-form guide content. Kept as structured data (rather than MDX) so the
 * same source feeds the rendered page, the Article schema and the sitemap.
 */

export interface RatgeberSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: string[];
  table?: { caption?: string; head: string[]; rows: string[][] };
  /** Highlighted callout below the section body. */
  note?: string;
  code?: string;
}

export interface RatgeberArtikel {
  slug: string;
  /** Short label used in navigation and footers. */
  navLabel: string;
  /** H1 on the page. */
  title: string;
  /** <title> — may differ from the H1 to fit the SERP width. */
  metaTitle: string;
  description: string;
  keywords: string[];
  lead: string;
  readingMinutes: number;
  sections: RatgeberSection[];
  faqs: { question: string; answer: string }[];
  published: string;
  updated: string;
}

export const ratgeberArtikel: RatgeberArtikel[] = [
  {
    slug: "maengelanzeige-schreiben",
    navLabel: "Mängelanzeige schreiben",
    title: "Mängelanzeige schreiben: Muster, Pflichtangaben und Fristen",
    metaTitle:
      "Mängelanzeige schreiben — Muster & Anleitung nach § 536c BGB",
    description:
      "Mängelanzeige an den Vermieter: alle Pflichtangaben nach § 536c BGB, ein vollständiges Muster zum Abschreiben, Fristen und die richtige Zustellung.",
    keywords: [
      "Mängelanzeige schreiben",
      "Mängelanzeige Muster",
      "Mängelanzeige Vermieter",
      "§ 536c BGB",
      "Mangel Vermieter melden",
    ],
    lead:
      "Die Mängelanzeige ist der wichtigste Schritt auf dem Weg zur Mietminderung. Ohne sie können Sie in der Regel nicht mindern — und riskieren sogar Schadensersatzansprüche des Vermieters. Diese Anleitung zeigt Ihnen Schritt für Schritt, was hineingehört.",
    readingMinutes: 7,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "Warum die Mängelanzeige unverzichtbar ist",
        paragraphs: [
          "§ 536c BGB verpflichtet Mieter, einen während der Mietzeit auftretenden Mangel unverzüglich anzuzeigen. „Unverzüglich“ bedeutet: ohne schuldhaftes Zögern, in der Praxis also innerhalb weniger Tage nach Entdeckung.",
          "Unterlassen Sie die Anzeige, treffen Sie gleich zwei Nachteile: Sie verlieren das Recht, die Miete zu mindern, und Sie können dem Vermieter gegenüber schadensersatzpflichtig werden, wenn sich der Schaden dadurch vergrößert — etwa wenn aus einer feuchten Wand ein Sanierungsfall wird.",
          "Die Mietminderung selbst tritt zwar kraft Gesetzes ein, praktisch aber erst ab dem Zeitpunkt, zu dem der Vermieter vom Mangel weiß. Das Datum Ihrer Mängelanzeige ist daher zugleich der Stichtag Ihres Anspruchs.",
        ],
        note:
          "Ausnahme: Kennt der Vermieter den Mangel bereits — etwa weil der Hausmeister ihn gesehen hat oder das ganze Haus betroffen ist — entfällt die Anzeigepflicht. Verlassen Sie sich darauf aber nicht, sondern melden Sie schriftlich.",
      },
      {
        heading: "Diese neun Angaben muss die Mängelanzeige enthalten",
        ordered: [
          "Absender: Ihr vollständiger Name und die Anschrift der Mietwohnung",
          "Empfänger: Name und Anschrift des Vermieters oder der Hausverwaltung",
          "Datum des Schreibens",
          "Betreff mit dem Wort „Mängelanzeige“ und der Angabe der Wohnung (Adresse, Stockwerk, ggf. Wohnungsnummer)",
          "Konkrete Beschreibung des Mangels: Was genau, in welchem Raum, seit wann, wie äußert er sich?",
          "Verweis auf Beweismittel: beigefügte Fotos, Temperatur- oder Lärmprotokolle, Zeugen",
          "Aufforderung zur Mängelbeseitigung mit konkret datierter Frist",
          "Hinweis, dass Sie die Miete mindern oder bis zur Beseitigung unter Vorbehalt zahlen",
          "Ihre Unterschrift",
        ],
        paragraphs: [
          "Der häufigste Fehler ist eine zu vage Beschreibung. „Im Bad ist Schimmel“ genügt nicht. Besser: „An der Nordwand des Badezimmers, oberhalb der Dusche, besteht seit dem 3. März 2026 ein Schimmelbefall von etwa 40 × 30 cm. Der Belag ist schwarz-grünlich, es riecht modrig.“",
        ],
      },
      {
        heading: "Welche Frist Sie setzen sollten",
        table: {
          caption: "Übliche Fristen zur Mängelbeseitigung",
          head: ["Art des Mangels", "Angemessene Frist", "Beispiele"],
          rows: [
            [
              "Notfall / Gesundheitsgefahr",
              "sofort bis 24 Stunden",
              "Heizungsausfall im Winter, kompletter Stromausfall, einzige Toilette defekt",
            ],
            [
              "Dringender Mangel",
              "3 bis 7 Tage",
              "Wasserschaden, starker Schimmelbefall, nicht abschließbare Wohnungstür",
            ],
            [
              "Normaler Mangel",
              "14 Tage",
              "Undichte Fenster, defekter Aufzug, tropfende Armatur",
            ],
            [
              "Geringfügiger Mangel",
              "3 bis 4 Wochen",
              "Defekte Klingel, langer Warmwasser-Vorlauf, feuchter Keller",
            ],
          ],
        },
        paragraphs: [
          "Setzen Sie die Frist immer mit konkretem Datum („bis zum 20. August 2026“), nicht als Zeitraum. Nur so ist der Fristablauf eindeutig und Sie können darauf weitere Schritte stützen.",
        ],
      },
      {
        heading: "Muster: Mängelanzeige an den Vermieter",
        code: `[Ihr Name]
[Straße und Hausnummer]
[PLZ, Ort]

[Ort], [Datum]

An
[Name des Vermieters / der Hausverwaltung]
[Anschrift]

Betreff: Mängelanzeige — Wohnung [Adresse, Stockwerk, Wohnungsnummer]

Sehr geehrte/r [Name],

hiermit zeige ich Ihnen folgenden Mangel in der von mir gemieteten
Wohnung an:

[Präzise Beschreibung: Was ist der Mangel? In welchem Raum tritt er
auf? Seit wann besteht er? Wie äußert er sich?]

Als Nachweis füge ich diesem Schreiben [Fotos / ein Temperaturprotokoll /
ein Lärmprotokoll] bei.

Ich fordere Sie auf, den Mangel bis zum [konkretes Datum] zu beseitigen.

Bis zur vollständigen Beseitigung des Mangels werde ich die Miete
[um X % mindern / unter Vorbehalt in voller Höhe zahlen].

Sollte der Mangel nicht fristgerecht beseitigt werden, behalte ich mir
weitere rechtliche Schritte vor, insbesondere Schadensersatz gemäß
§ 536a Abs. 1 BGB und die Selbstvornahme gemäß § 536a Abs. 2 BGB.

Mit freundlichen Grüßen

[Unterschrift]
[Name]

Anlagen:
- [Fotos vom Mangel]
- [Protokoll]`,
      },
      {
        heading: "So stellen Sie die Mängelanzeige nachweisbar zu",
        paragraphs: [
          "Gesetzlich ist die Mängelanzeige formfrei — sie wäre sogar mündlich wirksam. Im Streitfall müssen aber Sie beweisen, dass und wann der Vermieter sie erhalten hat. Deshalb ist die Zustellungsart entscheidend.",
        ],
        bullets: [
          "Einwurf-Einschreiben: guter Kompromiss aus Nachweis und Kosten, der Auslieferungsbeleg ist online abrufbar",
          "Bote mit Zeuge: eine Person, die den Inhalt gelesen und den Einwurf beobachtet hat, kann beides bezeugen — kostenlos und sehr belastbar",
          "Persönliche Übergabe mit schriftlicher Empfangsbestätigung: der sicherste Weg, wenn der Vermieter kooperiert",
          "Übergabe-Einschreiben: riskant, weil der Empfänger die Annahme verweigern kann und der Brief dann als nicht zugegangen gilt",
          "Nur E-Mail: nicht ausreichend als alleiniger Nachweis — der Zugang lässt sich kaum belegen",
        ],
        note:
          "Praxistipp: Senden Sie die Anzeige zusätzlich per E-Mail, damit der Vermieter sie sofort sieht — aber verlassen Sie sich für den Nachweis auf den Postweg.",
      },
      {
        heading: "Was nach der Mängelanzeige passiert",
        ordered: [
          "Der Vermieter prüft den Mangel und beauftragt die Beseitigung — er hat ein Recht darauf, sich den Mangel anzusehen.",
          "Sie müssen den Zutritt zur Besichtigung und Reparatur nach Ankündigung ermöglichen. Eine Verweigerung kann Ihr Minderungsrecht kosten.",
          "Ab Zugang der Anzeige ist die Miete kraft Gesetzes gemindert. Zahlen Sie im Zweifel zunächst unter Vorbehalt weiter.",
          "Verstreicht die Frist fruchtlos, kommen Schadensersatz nach § 536a Abs. 1 BGB und die Selbstvornahme nach § 536a Abs. 2 BGB in Betracht.",
          "Ist der Mangel beseitigt, endet die Minderung — ab dann ist wieder die volle Miete geschuldet.",
        ],
      },
    ],
    faqs: [
      {
        question: "Muss die Mängelanzeige schriftlich erfolgen?",
        answer:
          "Gesetzlich nicht — sie ist formfrei und wäre auch mündlich wirksam. Im Streitfall müssen Sie den Zugang beim Vermieter aber beweisen. Deshalb ist die Schriftform mit nachweisbarer Zustellung, etwa per Einwurf-Einschreiben oder Bote mit Zeuge, dringend zu empfehlen.",
      },
      {
        question: "Wie schnell muss ich einen Mangel melden?",
        answer:
          "Unverzüglich, also ohne schuldhaftes Zögern (§ 536c BGB). In der Praxis heißt das innerhalb weniger Tage nach Entdeckung. Bei offensichtlichen und dringenden Mängeln wie einem Wasserschaden sollten Sie noch am selben Tag melden.",
      },
      {
        question: "Kann ich mehrere Mängel in einer Mängelanzeige melden?",
        answer:
          "Ja, und das ist sogar sinnvoll. Beschreiben Sie jeden Mangel in einem eigenen Absatz mit Raum, Beginn und Ausprägung. So bleibt die Anzeige übersichtlich und Sie können die Minderungsquoten der einzelnen Mängel zusammenrechnen.",
      },
      {
        question: "Was passiert, wenn ich den Mangel nicht anzeige?",
        answer:
          "Sie verlieren in der Regel das Recht auf Mietminderung für die Zeit vor der Anzeige. Vergrößert sich der Schaden, weil der Vermieter nichts von ihm wusste, können Sie ihm gegenüber sogar schadensersatzpflichtig werden (§ 536c Abs. 2 BGB).",
      },
    ],
  },

  {
    slug: "mietminderung-berechnen",
    navLabel: "Mietminderung berechnen",
    title: "Mietminderung berechnen: Formel, Beispiele und Berechnungsgrundlage",
    metaTitle: "Mietminderung berechnen — Formel, Beispiele & Bruttowarmmiete",
    description:
      "Mietminderung berechnen: warum die Bruttowarmmiete die Grundlage ist, wie die Formel lautet und was bei mehreren Mängeln gilt — mit Rechenbeispielen.",
    keywords: [
      "Mietminderung berechnen",
      "Mietminderung Bruttowarmmiete",
      "Mietminderung Formel",
      "Mietminderung Beispiel",
      "Minderungsquote berechnen",
    ],
    lead:
      "Die häufigste Fehlerquelle bei der Mietminderung ist nicht die Quote, sondern die Bezugsgröße. Wer von der Kaltmiete statt der Bruttowarmmiete rechnet, verschenkt bares Geld. So rechnen Sie korrekt.",
    readingMinutes: 6,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "Berechnungsgrundlage ist immer die Bruttowarmmiete",
        paragraphs: [
          "Nach der Rechtsprechung des Bundesgerichtshofs (Urteil vom 6. April 2005, Az. XII ZR 225/03) ist die Bruttowarmmiete die Bemessungsgrundlage der Mietminderung — nicht die Nettokaltmiete.",
          "Bruttowarmmiete bedeutet: Nettokaltmiete zuzüglich sämtlicher Betriebskostenvorauszahlungen oder -pauschalen. Der Grund ist einleuchtend: Sie zahlen für die Wohnung insgesamt, also mindert ein Mangel auch den Gesamtwert dieser Leistung.",
        ],
        table: {
          caption: "Zusammensetzung der Bruttowarmmiete",
          head: ["Position", "Beispielbetrag"],
          rows: [
            ["Nettokaltmiete", "800,00 €"],
            ["Betriebskostenvorauszahlung", "150,00 €"],
            ["Heizkostenvorauszahlung", "50,00 €"],
            ["Bruttowarmmiete (Berechnungsgrundlage)", "1.000,00 €"],
          ],
        },
        note:
          "Bei einer Minderungsquote von 20 % macht der Unterschied zwischen Kalt- und Warmmiete in diesem Beispiel 40 € pro Monat aus — 480 € im Jahr.",
      },
      {
        heading: "Die Formel",
        code: `Minderungsbetrag  = Bruttowarmmiete × Minderungsquote ÷ 100
Geminderte Miete  = Bruttowarmmiete − Minderungsbetrag`,
        paragraphs: [
          "Bei einer Bruttowarmmiete von 1.000 € und einer Minderungsquote von 30 % ergibt sich ein Minderungsbetrag von 300 €. Zu zahlen sind dann 700 €.",
        ],
      },
      {
        heading: "Tagegenaue Berechnung bei kürzeren Zeiträumen",
        paragraphs: [
          "Besteht der Mangel nicht den ganzen Monat, wird anteilig gerechnet. Üblich ist die Rechnung mit 30 Tagen pro Monat.",
        ],
        code: `Minderungsbetrag = (Bruttowarmmiete ÷ 30) × Tage mit Mangel × Quote ÷ 100

Beispiel: 1.000 € Warmmiete, 12 Tage Heizungsausfall, Quote 80 %
= (1.000 ÷ 30) × 12 × 0,80
= 33,33 € × 12 × 0,80
= 320,00 €`,
        note:
          "Führen Sie deshalb ein taggenaues Protokoll: Beginn und Ende des Mangels bestimmen unmittelbar die Höhe Ihres Anspruchs.",
      },
      {
        heading: "Mehrere Mängel gleichzeitig",
        paragraphs: [
          "Treten mehrere Mängel gleichzeitig auf, werden die Quoten grundsätzlich addiert. Die Gesamtminderung kann jedoch nie mehr als 100 % betragen.",
          "Beachten Sie dabei: Betreffen zwei Mängel dieselbe Beeinträchtigung — etwa ein defekter Heizkörper und eine deshalb zu kalte Wohnung —, ist eine schlichte Addition nicht sachgerecht. Gerichte nehmen dann eine Gesamtbetrachtung vor.",
        ],
        table: {
          caption: "Beispiel: Addition mehrerer Mängel",
          head: ["Mangel", "Quote"],
          rows: [
            ["Schimmel in einem Raum", "8 %"],
            ["Undichte Fenster im selben Raum", "10 %"],
            ["Defekter Aufzug (4. Etage)", "10 %"],
            ["Summe", "28 %"],
          ],
        },
      },
      {
        heading: "Auswirkung auf die Betriebskostenabrechnung",
        paragraphs: [
          "Die Mietminderung wirkt sich auch auf die jährliche Betriebskostenabrechnung aus. Da die Vorauszahlungen Teil der geminderten Bruttowarmmiete sind, muss eine Nachzahlung für den Minderungszeitraum entsprechend gekürzt werden.",
          "Prüfen Sie Ihre Abrechnung deshalb daraufhin, ob der Vermieter die Minderung berücksichtigt hat. Tut er das nicht, widersprechen Sie schriftlich innerhalb der zwölfmonatigen Einwendungsfrist nach § 556 Abs. 3 BGB.",
        ],
      },
      {
        heading: "Wie Sie die richtige Quote finden",
        bullets: [
          "Orientieren Sie sich an veröffentlichten Mietminderungstabellen, die Gerichtsentscheidungen zu vergleichbaren Fällen zusammenfassen",
          "Berücksichtigen Sie Dauer, Intensität und Ausmaß der Beeinträchtigung — die Tabellenwerte sind Spannen, keine festen Größen",
          "Schätzen Sie im Zweifel konservativ: Eine zu niedrige Minderung kostet Geld, eine zu hohe kann die Wohnung kosten",
          "Lassen Sie die Quote bei größeren Beträgen vom Mieterverein oder einem Fachanwalt prüfen",
        ],
        note:
          "Wichtig: Alle Prozentwerte in Tabellen sind Orientierungswerte aus Einzelfallentscheidungen. Kein Gericht ist daran gebunden — jeder Fall wird individuell bewertet.",
      },
    ],
    faqs: [
      {
        question: "Wird die Mietminderung von der Kalt- oder Warmmiete berechnet?",
        answer:
          "Von der Bruttowarmmiete, also der Nettokaltmiete plus aller Betriebs- und Heizkostenvorauszahlungen. Das hat der Bundesgerichtshof mit Urteil vom 6. April 2005 (Az. XII ZR 225/03) entschieden.",
      },
      {
        question: "Wie rechne ich, wenn der Mangel nur zwei Wochen bestand?",
        answer:
          "Tagegenau: Teilen Sie die Bruttowarmmiete durch 30, multiplizieren Sie mit der Anzahl der Tage mit Mangel und dann mit der Minderungsquote. Bei 1.000 € Warmmiete, 14 Tagen und 20 % ergibt das 93,33 €.",
      },
      {
        question: "Darf ich die Quoten mehrerer Mängel addieren?",
        answer:
          "Grundsätzlich ja, begrenzt auf maximal 100 %. Betreffen mehrere Mängel dieselbe Beeinträchtigung, nehmen Gerichte allerdings eine Gesamtbetrachtung vor statt einer schlichten Addition.",
      },
      {
        question: "Muss die Mietminderung in der Betriebskostenabrechnung berücksichtigt werden?",
        answer:
          "Ja. Weil die Vorauszahlungen Teil der geminderten Bruttowarmmiete sind, muss eine Nachforderung für den Minderungszeitraum anteilig gekürzt werden. Prüfen Sie die Abrechnung und widersprechen Sie innerhalb von zwölf Monaten nach Zugang.",
      },
    ],
  },

  {
    slug: "miete-unter-vorbehalt-zahlen",
    navLabel: "Miete unter Vorbehalt zahlen",
    title: "Miete unter Vorbehalt zahlen: Der sichere Weg zur Mietminderung",
    metaTitle: "Miete unter Vorbehalt zahlen — Formulierung & Rückforderung",
    description:
      "Warum Sie die Miete bei Mängeln unter Vorbehalt zahlen sollten, wie Sie den Vorbehalt formulieren und zu viel gezahlte Miete zurückfordern.",
    keywords: [
      "Miete unter Vorbehalt zahlen",
      "Vorbehalt Mietminderung",
      "Miete zurückfordern",
      "Verwendungszweck Vorbehalt",
    ],
    lead:
      "Wer die Miete sofort kürzt, riskiert im Streitfall die fristlose Kündigung. Die Zahlung unter Vorbehalt bietet denselben wirtschaftlichen Vorteil — ohne dieses Risiko.",
    readingMinutes: 5,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "Das Risiko der direkten Kürzung",
        paragraphs: [
          "Setzen Sie die Minderungsquote zu hoch an und entsteht dadurch ein Rückstand von zwei Monatsmieten, darf der Vermieter das Mietverhältnis fristlos kündigen (§ 543 Abs. 2 Nr. 3 BGB). Dass Sie die Quote in gutem Glauben geschätzt haben, hilft Ihnen dann nur begrenzt.",
          "Der Rückstand entsteht schneller als gedacht: Schon eine über mehrere Monate um 40 % gekürzte Miete summiert sich rasch auf zwei volle Monatsmieten.",
        ],
        note:
          "Genau hier setzt die Zahlung unter Vorbehalt an: Sie zahlen weiter in voller Höhe, verlieren aber Ihren Rückforderungsanspruch nicht.",
      },
      {
        heading: "So funktioniert die Zahlung unter Vorbehalt",
        ordered: [
          "Sie zeigen den Mangel schriftlich an und setzen eine Frist zur Beseitigung.",
          "Sie erklären in der Mängelanzeige ausdrücklich, dass Sie die Miete ab sofort nur noch unter Vorbehalt zahlen.",
          "Sie überweisen weiterhin die volle Miete und vermerken den Vorbehalt im Verwendungszweck.",
          "Sie dokumentieren den Mangel lückenlos, solange er besteht.",
          "Nach Beseitigung des Mangels fordern Sie den zu viel gezahlten Betrag zurück — notfalls gerichtlich.",
        ],
      },
      {
        heading: "Die richtige Formulierung",
        paragraphs: [
          "Der Vorbehalt muss erkennbar auf den konkreten Mangel bezogen sein. Ein pauschales „unter Vorbehalt“ ohne Bezug reicht nicht sicher aus.",
        ],
        code: `Im Verwendungszweck der Überweisung:

  Miete [Monat/Jahr], Zahlung unter Vorbehalt wegen Mangel
  (Schimmel Schlafzimmer, angezeigt am 12.03.2026)

Im Schreiben an den Vermieter:

  Bis zur vollständigen Beseitigung des angezeigten Mangels zahle
  ich die Miete ausdrücklich nur unter Vorbehalt der Rückforderung.
  Ein Verzicht auf mein Minderungsrecht nach § 536 BGB ist damit
  nicht verbunden.`,
        note:
          "Der Verwendungszweck ist begrenzt — nutzen Sie eine Kurzform und beziehen Sie sich auf das Datum Ihrer Mängelanzeige.",
      },
      {
        heading: "Rückforderung: Fristen und Vorgehen",
        paragraphs: [
          "Der Rückforderungsanspruch verjährt in drei Jahren. Die Frist beginnt mit dem Ende des Jahres, in dem der Anspruch entstanden ist und Sie von den anspruchsbegründenden Umständen Kenntnis erlangt haben. Unabhängig von der Kenntnis gilt eine absolute Verjährungsfrist von zehn Jahren.",
          "Fordern Sie den Betrag schriftlich und mit Fristsetzung zurück. Legen Sie die Berechnung offen: Zeitraum, Quote, Bruttowarmmiete, Summe. Bleibt der Vermieter untätig, ist der Mieterverein oder ein Fachanwalt der nächste Schritt.",
        ],
      },
      {
        heading: "Wann direkte Kürzung trotzdem sinnvoll sein kann",
        bullets: [
          "Der Mangel ist eindeutig und die Quote unstrittig, etwa bei einer gerichtlich bestätigten Wohnflächenabweichung",
          "Der Vermieter hat die Minderung dem Grunde und der Höhe nach schriftlich anerkannt",
          "Ein Mieterverein oder Anwalt hat die Quote geprüft und bestätigt",
          "Der Mangel besteht seit langem und der Vermieter bleibt trotz mehrfacher Fristsetzung untätig",
        ],
        note:
          "Auch dann gilt: Bleiben Sie bei der Quote eher konservativ. Der wirtschaftliche Vorteil einiger Prozentpunkte steht in keinem Verhältnis zum Risiko einer Kündigung.",
      },
    ],
    faqs: [
      {
        question: "Was bedeutet „Miete unter Vorbehalt zahlen“?",
        answer:
          "Sie zahlen die volle Miete weiter, behalten sich aber ausdrücklich vor, den wegen des Mangels zu viel gezahlten Teil später zurückzufordern. So vermeiden Sie einen Zahlungsrückstand und damit das Risiko einer fristlosen Kündigung.",
      },
      {
        question: "Wie formuliere ich den Vorbehalt bei der Überweisung?",
        answer:
          "Im Verwendungszweck etwa: „Miete 04/2026, Zahlung unter Vorbehalt wegen Mangel (Schimmel Schlafzimmer, angezeigt am 12.03.2026)“. Wichtig ist der erkennbare Bezug zum konkreten, bereits angezeigten Mangel.",
      },
      {
        question: "Wie lange kann ich zu viel gezahlte Miete zurückfordern?",
        answer:
          "Der Anspruch verjährt regelmäßig in drei Jahren, gerechnet ab dem Ende des Jahres, in dem er entstanden ist und Sie Kenntnis hatten. Unabhängig von der Kenntnis endet er spätestens nach zehn Jahren.",
      },
      {
        question: "Verliere ich mein Minderungsrecht, wenn ich voll zahle?",
        answer:
          "Nur wenn Sie über längere Zeit vorbehaltlos zahlen — nach etwa sechs Monaten kann das Minderungsrecht verwirkt sein. Genau das verhindert der ausdrückliche Vorbehalt bei jeder Zahlung.",
      },
    ],
  },

  {
    slug: "mietminderung-rueckwirkend",
    navLabel: "Rückwirkend mindern",
    title: "Rückwirkende Mietminderung: Wann Sie Geld zurückfordern können",
    metaTitle: "Rückwirkende Mietminderung — wann Rückforderung möglich ist",
    description:
      "Rückwirkend mindern geht nur in vier Fällen. Welche das sind — plus Verjährungsfristen, Verwirkung und das Vorgehen bei der Rückforderung.",
    keywords: [
      "rückwirkende Mietminderung",
      "Miete rückwirkend mindern",
      "Mietminderung Verjährung",
      "zu viel Miete gezahlt zurückfordern",
    ],
    lead:
      "Die Mietminderung tritt zwar kraft Gesetzes ein — praktisch aber erst, wenn der Vermieter vom Mangel weiß. Für die Zeit davor gibt es nur wenige, dafür klar umrissene Ausnahmen.",
    readingMinutes: 5,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "Der Grundsatz: ab Kenntnis des Vermieters",
        paragraphs: [
          "Nach § 536 BGB ist die Miete kraft Gesetzes gemindert, sobald ein erheblicher Mangel vorliegt. Praktisch durchsetzbar ist der Anspruch aber erst ab dem Zeitpunkt, zu dem der Vermieter von dem Mangel Kenntnis erlangt — in der Regel also ab Zugang Ihrer Mängelanzeige.",
          "Für die Zeit davor gilt: Wer den Mangel kannte und die Miete trotzdem vorbehaltlos in voller Höhe gezahlt hat, kann das Geld regelmäßig nicht zurückfordern.",
        ],
      },
      {
        heading: "Diese vier Fälle erlauben eine Rückforderung",
        bullets: [
          "Sie haben die Miete unter Vorbehalt gezahlt — dann bleibt der Rückforderungsanspruch in vollem Umfang erhalten",
          "Der Vermieter kannte den Mangel bereits, etwa weil er ihn selbst gesehen hat oder das gesamte Haus betroffen war",
          "Der Vermieter hat eine falsche Wohnflächenangabe gemacht — hier besteht der Anspruch ab Mietbeginn",
          "Der Mietvertrag enthält eine unwirksame Klausel, die Sie von der Minderung abgehalten hat",
        ],
        note:
          "Der letzte Punkt ist praktisch relevanter, als er klingt: Klauseln, die das Minderungsrecht bei Wohnraum ausschließen, sind nach § 536 Abs. 4 BGB unwirksam — und kommen in älteren Verträgen häufig vor.",
      },
      {
        heading: "Verwirkung: Wenn zu langes Warten den Anspruch kostet",
        paragraphs: [
          "Zahlen Sie über längere Zeit vorbehaltlos die volle Miete, obwohl Sie den Mangel kennen, kann das Minderungsrecht verwirken. Als Richtwert nennt die Rechtsprechung etwa sechs Monate.",
          "Die Verwirkung setzt zwei Elemente voraus: das Zeitmoment — es ist längere Zeit vergangen — und das Umstandsmoment — der Vermieter durfte aufgrund Ihres Verhaltens darauf vertrauen, dass Sie nicht mehr mindern werden. Beides muss zusammenkommen.",
        ],
      },
      {
        heading: "Verjährungsfristen im Überblick",
        table: {
          head: ["Frist", "Dauer", "Fristbeginn"],
          rows: [
            [
              "Regelverjährung des Rückforderungsanspruchs",
              "3 Jahre",
              "Ende des Jahres, in dem der Anspruch entstand und Sie Kenntnis erlangten",
            ],
            [
              "Absolute Verjährung",
              "10 Jahre",
              "Entstehung des Anspruchs, unabhängig von Kenntnis",
            ],
            [
              "Verwirkung des Minderungsrechts",
              "ca. 6 Monate (Richtwert)",
              "Kenntnis des Mangels bei vorbehaltloser Zahlung",
            ],
          ],
        },
      },
      {
        heading: "So gehen Sie bei einer Rückforderung vor",
        ordered: [
          "Zeitraum und Quote bestimmen und die Berechnung nachvollziehbar aufstellen.",
          "Nachweise zusammenstellen: Mängelanzeige, Fotos, Protokolle, Korrespondenz, Kontoauszüge.",
          "Den Vermieter schriftlich zur Rückzahlung auffordern, mit konkreter Frist von etwa 14 Tagen.",
          "Bei Ablehnung Mieterverein oder Fachanwalt einschalten — häufig genügt ein anwaltliches Schreiben.",
          "Vor Ablauf der Verjährung gerichtliche Schritte prüfen, notfalls über einen Mahnbescheid, der die Verjährung hemmt.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kann ich die Miete rückwirkend mindern?",
        answer:
          "Nur eingeschränkt. Möglich ist es, wenn Sie unter Vorbehalt gezahlt haben, der Vermieter den Mangel bereits kannte, die Wohnfläche falsch angegeben war oder eine unwirksame Vertragsklausel Sie von der Minderung abgehalten hat.",
      },
      {
        question: "Wie weit zurück kann ich Miete zurückfordern?",
        answer:
          "Im Rahmen der regelmäßigen Verjährung von drei Jahren, gerechnet ab dem Ende des Jahres, in dem der Anspruch entstand und Sie davon wussten. Unabhängig davon endet der Anspruch spätestens nach zehn Jahren.",
      },
      {
        question: "Verliere ich mein Minderungsrecht, wenn ich lange nichts unternehme?",
        answer:
          "Das ist möglich. Zahlen Sie den Mangel kennend über etwa sechs Monate vorbehaltlos die volle Miete, kann das Minderungsrecht verwirkt sein. Handeln Sie deshalb zeitnah nach Entdeckung eines Mangels.",
      },
      {
        question: "Gilt bei falscher Wohnflächenangabe etwas anderes?",
        answer:
          "Ja. Weicht die tatsächliche Wohnfläche um mehr als zehn Prozent nach unten ab, besteht der Anspruch nach der Rechtsprechung des BGH ab Mietbeginn — auch ohne vorherige Mängelanzeige, weil der Vermieter die Abweichung selbst zu vertreten hat.",
      },
    ],
  },

  {
    slug: "mietminderung-ausschluss",
    navLabel: "Wann keine Minderung gilt",
    title: "Wann die Mietminderung ausgeschlossen ist: 7 Ausschlussgründe",
    metaTitle: "Mietminderung ausgeschlossen — 7 Gründe, die den Anspruch kosten",
    description:
      "Nicht jeder Mangel berechtigt zur Minderung: sieben Ausschlussgründe von Kenntnis bei Vertragsschluss über Bagatellmängel bis zur energetischen Sanierung.",
    keywords: [
      "Mietminderung ausgeschlossen",
      "keine Mietminderung",
      "Bagatellmangel Mietrecht",
      "§ 536b BGB",
      "energetische Modernisierung Mietminderung",
    ],
    lead:
      "Bevor Sie die Miete kürzen, sollten Sie prüfen, ob einer der gesetzlichen Ausschlussgründe greift. Wer irrtümlich mindert, riskiert einen Zahlungsrückstand — und damit die Kündigung.",
    readingMinutes: 6,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "1. Kenntnis des Mangels bei Vertragsschluss (§ 536b BGB)",
        paragraphs: [
          "Wer einen Mangel bei Unterzeichnung des Mietvertrags kennt und trotzdem einzieht, kann deswegen später nicht mindern. Dasselbe gilt bei grob fahrlässiger Unkenntnis — also wenn der Mangel bei der Besichtigung offensichtlich war.",
          "Die Ausnahme: Haben Sie sich bei Annahme der Wohnung Ihre Rechte wegen des Mangels ausdrücklich vorbehalten, bleibt das Minderungsrecht bestehen. Lassen Sie einen solchen Vorbehalt immer ins Übergabeprotokoll aufnehmen.",
        ],
      },
      {
        heading: "2. Unterlassene Mängelanzeige (§ 536c BGB)",
        paragraphs: [
          "Zeigen Sie einen Mangel nicht unverzüglich an und kann der Vermieter ihn deshalb nicht beseitigen, verlieren Sie das Minderungsrecht. Zusätzlich können Sie ihm gegenüber schadensersatzpflichtig werden.",
          "Kennt der Vermieter den Mangel bereits aus anderer Quelle, entfällt die Anzeigepflicht — darauf sollten Sie sich aber nie verlassen.",
        ],
      },
      {
        heading: "3. Bagatellmängel und unerhebliche Beeinträchtigungen",
        paragraphs: [
          "Nach § 536 Abs. 1 Satz 3 BGB bleibt eine nur unerhebliche Minderung der Tauglichkeit außer Betracht. Gemeint sind Mängel, die leicht erkennbar und mit geringem Aufwand zu beheben sind.",
        ],
        bullets: [
          "Ein einzelner tropfender Wasserhahn",
          "Eine leicht klemmende Zimmertür",
          "Eine einzelne gesprungene Fliese",
          "Eine defekte Steckdose bei ausreichend vorhandenen weiteren",
        ],
        note:
          "Als grobe Faustregel gilt: Kostet die Beseitigung weniger als etwa ein Prozent der Jahresmiete, wird der Mangel häufig als unerheblich eingestuft. Mehrere Bagatellmängel zusammen können allerdings die Erheblichkeitsschwelle überschreiten.",
      },
      {
        heading: "4. Selbst verursachte Mängel",
        paragraphs: [
          "Haben Sie, Ihre Haushaltsangehörigen oder Ihre Gäste den Mangel verursacht, besteht kein Minderungsrecht. Der Klassiker ist Schimmel durch unzureichendes Lüften und Heizen.",
          "Wichtig für Ihre Position: Die Beweislast liegt beim Vermieter. Er muss zunächst ausschließen, dass bauliche Ursachen wie Wärmebrücken oder fehlende Dämmung vorliegen — erst dann kommt Ihr Nutzungsverhalten überhaupt in Betracht.",
        ],
      },
      {
        heading: "5. Verwirkung durch langes Zuwarten",
        paragraphs: [
          "Zahlen Sie über etwa sechs Monate vorbehaltlos die volle Miete, obwohl Sie den Mangel kennen, kann Ihr Minderungsrecht verwirkt sein. Erforderlich sind sowohl das Zeitmoment als auch ein schutzwürdiges Vertrauen des Vermieters.",
        ],
      },
      {
        heading: "6. Energetische Modernisierung (§ 536 Abs. 1a BGB)",
        paragraphs: [
          "Bei energetischen Modernisierungsmaßnahmen im Sinne des § 555b Nr. 1 BGB ist die Mietminderung für drei Monate ausgeschlossen. Voraussetzung ist, dass der Vermieter die Maßnahme ordnungsgemäß und rechtzeitig angekündigt hat.",
          "Nach Ablauf der drei Monate dürfen Sie mindern. Der Ausschluss gilt ausschließlich für energetische Maßnahmen — allgemeine Modernisierungen oder reine Instandsetzungen fallen nicht darunter.",
        ],
      },
      {
        heading: "7. Sozialadäquate und ortsübliche Beeinträchtigungen",
        bullets: [
          "Normaler Wohnlärm in einem Mehrfamilienhaus, einschließlich spielender Kinder",
          "Straßenlärm in einer Innenstadtlage, der bei Anmietung bereits bestand",
          "Übliche Küchengerüche aus Nachbarwohnungen",
          "Beeinträchtigungen durch eine vertragswidrige eigene Nutzung der Wohnung",
        ],
        paragraphs: [
          "Maßstab ist stets der Zustand bei Vertragsschluss. Eine Verschlechterung danach kann ein Mangel sein — der von Anfang an bestehende Zustand ist dagegen Vertragsgrundlage.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kann der Vermieter die Mietminderung im Mietvertrag ausschließen?",
        answer:
          "Bei Wohnraum nicht. Nach § 536 Abs. 4 BGB ist das Minderungsrecht nicht abdingbar; entsprechende Klauseln im Mietvertrag sind unwirksam. Bei Gewerberaum gelten andere Regeln.",
      },
      {
        question: "Was ist ein Bagatellmangel?",
        answer:
          "Ein Mangel, der die Tauglichkeit der Wohnung nur unerheblich mindert und mit geringem Aufwand zu beheben ist — etwa ein einzelner tropfender Wasserhahn. Nach § 536 Abs. 1 Satz 3 BGB berechtigt er nicht zur Minderung.",
      },
      {
        question: "Darf ich bei einer energetischen Sanierung die Miete mindern?",
        answer:
          "Erst nach drei Monaten. § 536 Abs. 1a BGB schließt die Minderung bei ordnungsgemäß angekündigten energetischen Modernisierungsmaßnahmen für diesen Zeitraum aus. Danach ist eine Minderung möglich.",
      },
      {
        question: "Wer muss beweisen, dass ich den Schimmel verursacht habe?",
        answer:
          "Der Vermieter. Er muss zunächst darlegen und beweisen, dass keine baulichen Ursachen wie Wärmebrücken oder Feuchtigkeitseintritt vorliegen. Erst wenn ihm das gelingt, kommt Ihr Lüftungs- und Heizverhalten in Betracht.",
      },
    ],
  },

  {
    slug: "mietminderung-fehler",
    navLabel: "Häufige Fehler vermeiden",
    title: "Die 10 häufigsten Fehler bei der Mietminderung",
    metaTitle: "Mietminderung: 10 häufige Fehler und wie Sie sie vermeiden",
    description:
      "Von der zu hohen Quote bis zur fehlenden Dokumentation: zehn Fehler, die Mieter regelmäßig ihren Anspruch kosten — und wie Sie sie vermeiden.",
    keywords: [
      "Fehler Mietminderung",
      "Mietminderung falsch gemacht",
      "Mietminderung Kündigung Risiko",
      "Mietminderung Tipps",
    ],
    lead:
      "Die meisten gescheiterten Minderungsansprüche scheitern nicht am Mangel, sondern am Vorgehen. Diese zehn Fehler sollten Sie kennen, bevor Sie die erste Überweisung kürzen.",
    readingMinutes: 6,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "Fehler 1: Die Miete kürzen, ohne den Mangel anzuzeigen",
        paragraphs: [
          "Der mit Abstand häufigste und teuerste Fehler. Ohne Mängelanzeige entsteht kein durchsetzbarer Minderungsanspruch — die gekürzte Miete ist schlicht ein Zahlungsrückstand. Zeigen Sie den Mangel immer zuerst schriftlich an.",
        ],
      },
      {
        heading: "Fehler 2: Zu hoch mindern",
        paragraphs: [
          "Erreicht der Rückstand zwei Monatsmieten, droht die fristlose Kündigung nach § 543 Abs. 2 Nr. 3 BGB. Tabellenwerte sind Spannen aus Einzelfällen, keine Garantien. Bleiben Sie am unteren Ende — oder zahlen Sie unter Vorbehalt.",
        ],
      },
      {
        heading: "Fehler 3: Von der Kaltmiete statt der Warmmiete rechnen",
        paragraphs: [
          "Berechnungsgrundlage ist die Bruttowarmmiete inklusive aller Vorauszahlungen. Wer von der Nettokaltmiete ausgeht, mindert deutlich weniger, als ihm zusteht.",
        ],
      },
      {
        heading: "Fehler 4: Den Mangel nicht dokumentieren",
        paragraphs: [
          "Ohne Fotos, Protokolle und Zeugen steht im Prozess Aussage gegen Aussage — und die Beweislast für den Mangel trägt der Mieter. Dokumentieren Sie ab dem ersten Tag, nicht erst, wenn der Streit da ist.",
        ],
        bullets: [
          "Fotos und Videos mit erkennbarem Datum",
          "Temperaturprotokoll bei Heizungsmängeln, mehrmals täglich",
          "Lärmprotokoll mit Datum, Uhrzeit von/bis, Art und Intensität",
          "Namen möglicher Zeugen notieren, solange die Erinnerung frisch ist",
        ],
      },
      {
        heading: "Fehler 5: Nur per E-Mail oder mündlich melden",
        paragraphs: [
          "Eine E-Mail beweist nicht, dass sie zugegangen ist. Nutzen Sie Einwurf-Einschreiben oder einen Boten mit Zeugen — und ergänzend gern die E-Mail für die schnelle Kenntnisnahme.",
        ],
      },
      {
        heading: "Fehler 6: Keine Frist zur Beseitigung setzen",
        paragraphs: [
          "Ohne konkret datierte Frist können Sie keine Folgerechte auslösen — weder Schadensersatz noch Selbstvornahme nach § 536a Abs. 2 BGB. Schreiben Sie ein Datum, keinen Zeitraum.",
        ],
      },
      {
        heading: "Fehler 7: Dem Vermieter den Zutritt verweigern",
        paragraphs: [
          "Der Vermieter darf den Mangel besichtigen und muss ihn beseitigen dürfen. Wer nach Ankündigung den Zutritt verweigert, riskiert den Verlust des Minderungsrechts — und trägt die Verzögerung dann selbst.",
        ],
      },
      {
        heading: "Fehler 8: Nach Beseitigung weiter mindern",
        paragraphs: [
          "Sobald der Mangel behoben ist, ist wieder die volle Miete geschuldet. Wer weiter kürzt, baut einen Rückstand auf. Halten Sie den Tag der Beseitigung schriftlich fest und stellen Sie die Minderung ab dann ein.",
        ],
      },
      {
        heading: "Fehler 9: Zu lange abwarten",
        paragraphs: [
          "Nach etwa sechs Monaten vorbehaltloser Zahlung kann das Minderungsrecht verwirkt sein. Handeln Sie zeitnah nach Entdeckung — spätestens innerhalb weniger Tage mit der Mängelanzeige.",
        ],
      },
      {
        heading: "Fehler 10: Den Mangel selbst beseitigen und dann kürzen",
        paragraphs: [
          "Eine Selbstvornahme ist nur unter engen Voraussetzungen zulässig: Der Vermieter muss in Verzug sein oder die Beseitigung muss zur Erhaltung der Mietsache dringend erforderlich sein (§ 536a Abs. 2 BGB). Wer vorschnell selbst repariert, bleibt auf den Kosten sitzen.",
        ],
        note:
          "Setzen Sie also immer erst eine Frist, dokumentieren Sie deren Ablauf — und beauftragen Sie erst danach einen Handwerker, wenn der Vermieter untätig bleibt.",
      },
    ],
    faqs: [
      {
        question: "Was ist der häufigste Fehler bei der Mietminderung?",
        answer:
          "Die Miete zu kürzen, ohne den Mangel vorher schriftlich anzuzeigen. Ohne Mängelanzeige besteht in der Regel kein durchsetzbarer Anspruch, und die Kürzung wird als Zahlungsrückstand gewertet.",
      },
      {
        question: "Kann mir wegen einer Mietminderung gekündigt werden?",
        answer:
          "Ja, wenn Sie zu hoch mindern und dadurch ein Rückstand von zwei Monatsmieten entsteht — dann ist eine fristlose Kündigung nach § 543 Abs. 2 Nr. 3 BGB möglich. Die Zahlung unter Vorbehalt schließt dieses Risiko aus.",
      },
      {
        question: "Darf ich einen Mangel selbst beseitigen lassen?",
        answer:
          "Nur wenn der Vermieter mit der Beseitigung in Verzug ist oder die sofortige Beseitigung zur Erhaltung der Mietsache notwendig ist (§ 536a Abs. 2 BGB). Setzen Sie vorher immer eine Frist und dokumentieren Sie deren fruchtlosen Ablauf.",
      },
      {
        question: "Muss ich den Vermieter in die Wohnung lassen?",
        answer:
          "Ja. Nach angemessener Ankündigung müssen Sie die Besichtigung und die Mängelbeseitigung ermöglichen. Eine Verweigerung kann Ihr Minderungsrecht kosten.",
      },
    ],
  },
];

export function getRatgeberBySlug(slug: string): RatgeberArtikel | undefined {
  return ratgeberArtikel.find((artikel) => artikel.slug === slug);
}
