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
  /** <title> - may differ from the H1 to fit the SERP width. */
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
      "Mängelanzeige schreiben: Muster & Anleitung nach § 536c BGB",
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
      "Ohne Mängelanzeige läuft bei der Mietminderung nichts. Wer sie weglässt, kann in aller Regel nicht mindern und schuldet dem Vermieter im schlimmsten Fall am Ende selbst Schadensersatz. Hier lesen Sie, was in das Schreiben gehört, welche Frist Sie setzen und wie Sie es nachweisbar zustellen.",
    readingMinutes: 7,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "Warum die Mängelanzeige unverzichtbar ist",
        paragraphs: [
          "§ 536c BGB verlangt von Mietern, einen Mangel unverzüglich anzuzeigen, sobald er während der Mietzeit auftritt. „Unverzüglich“ heißt ohne schuldhaftes Zögern. Zwischen Entdeckung und Anzeige sollten also nicht mehr als ein paar Tage liegen.",
          "Wer die Anzeige unterlässt, verliert gleich doppelt. Erstens das Recht, die Miete zu mindern. Zweitens kann er dem Vermieter schadensersatzpflichtig werden, wenn der Schaden mangels Meldung wächst, etwa weil aus einer feuchten Wand mit der Zeit ein Sanierungsfall wird.",
          "Zwar tritt die Minderung von Gesetzes wegen ein. Durchsetzen lässt sie sich aber erst ab dem Tag, an dem der Vermieter vom Mangel weiß. Das Datum Ihrer Mängelanzeige ist deshalb zugleich der Stichtag für Ihren Anspruch.",
        ],
        note:
          "Eine Ausnahme gibt es: Kennt der Vermieter den Mangel ohnehin schon, weil der Hausmeister ihn gesehen hat oder das ganze Haus betroffen ist, entfällt die Anzeigepflicht. Verlassen sollten Sie sich darauf trotzdem nicht. Ein kurzes Schreiben kostet wenig und erspart später jede Beweisfrage.",
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
          "Schreiben Sie ein konkretes Datum in die Frist („bis zum 20. August 2026“), keinen Zeitraum wie „binnen zwei Wochen“. Nur mit Datum steht der Fristablauf zweifelsfrei fest, und auf diesem Datum bauen alle weiteren Schritte auf.",
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

Betreff: Mängelanzeige für die Wohnung [Adresse, Stockwerk, Wohnungsnummer]

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
          "Das Gesetz schreibt für die Mängelanzeige keine Form vor, mündlich würde theoretisch genügen. Nur hilft Ihnen das wenig, wenn Sie im Streitfall beweisen müssen, dass und wann der Vermieter sie bekommen hat. Deshalb kommt es auf den Zustellweg an.",
        ],
        bullets: [
          "Einwurf-Einschreiben: guter Kompromiss aus Nachweis und Kosten, der Auslieferungsbeleg ist online abrufbar",
          "Bote mit Zeuge: Eine Person liest das Schreiben, wirft es ein und kann später beides bezeugen. Kostet nichts und hält vor Gericht.",
          "Persönliche Übergabe mit schriftlicher Empfangsbestätigung: der sicherste Weg, wenn der Vermieter kooperiert",
          "Übergabe-Einschreiben: riskant, weil der Empfänger die Annahme verweigern kann und der Brief dann als nicht zugegangen gilt",
          "Nur E-Mail: als alleiniger Nachweis zu wenig, weil sich der Zugang kaum belegen lässt",
        ],
        note:
          "Aus der Praxis: Schicken Sie die Anzeige ruhig zusätzlich per E-Mail, dann liegt sie sofort auf dem Tisch. Für den Nachweis zählt aber der Postweg.",
      },
      {
        heading: "Was nach der Mängelanzeige passiert",
        ordered: [
          "Der Vermieter prüft den Mangel und beauftragt die Beseitigung. Sich den Mangel vorher anzusehen, ist dabei sein gutes Recht.",
          "Sie müssen den Zutritt zur Besichtigung und Reparatur nach Ankündigung ermöglichen. Eine Verweigerung kann Ihr Minderungsrecht kosten.",
          "Ab Zugang der Anzeige ist die Miete kraft Gesetzes gemindert. Zahlen Sie im Zweifel zunächst unter Vorbehalt weiter.",
          "Verstreicht die Frist fruchtlos, kommen Schadensersatz nach § 536a Abs. 1 BGB und die Selbstvornahme nach § 536a Abs. 2 BGB in Betracht.",
          "Ist der Mangel beseitigt, endet die Minderung. Ab diesem Tag ist wieder die volle Miete fällig.",
        ],
      },
    ],
    faqs: [
      {
        question: "Muss die Mängelanzeige schriftlich erfolgen?",
        answer:
          "Vorgeschrieben ist die Schriftform nicht, die Anzeige wäre sogar mündlich wirksam. Im Streitfall müssen Sie aber beweisen, dass sie beim Vermieter angekommen ist. Praktisch führt deshalb kein Weg an einem Schreiben vorbei, zugestellt per Einwurf-Einschreiben oder durch einen Boten mit Zeugen.",
      },
      {
        question: "Wie schnell muss ich einen Mangel melden?",
        answer:
          "Unverzüglich, sagt § 536c BGB, also ohne schuldhaftes Zögern. Praktisch heißt das: innerhalb weniger Tage nach der Entdeckung. Einen Wasserschaden und ähnlich dringende Fälle melden Sie am besten noch am selben Tag.",
      },
      {
        question: "Kann ich mehrere Mängel in einer Mängelanzeige melden?",
        answer:
          "Ja, und das ist sogar sinnvoll. Beschreiben Sie jeden Mangel in einem eigenen Absatz mit Raum, Beginn und Ausprägung. So bleibt die Anzeige übersichtlich und Sie können die Minderungsquoten der einzelnen Mängel zusammenrechnen.",
      },
      {
        question: "Was passiert, wenn ich den Mangel nicht anzeige?",
        answer:
          "In der Regel verlieren Sie das Minderungsrecht für die Zeit vor der Anzeige. Es kann sogar noch schlimmer kommen: Wächst der Schaden, weil der Vermieter nichts wusste, haften unter Umständen Sie dafür (§ 536c Abs. 2 BGB).",
      },
    ],
  },

  {
    slug: "mietminderung-berechnen",
    navLabel: "Mietminderung berechnen",
    title: "Mietminderung berechnen: Formel, Beispiele und Berechnungsgrundlage",
    metaTitle: "Mietminderung berechnen: Formel, Beispiele & Bruttowarmmiete",
    description:
      "Mietminderung berechnen: warum die Bruttowarmmiete die Grundlage ist, wie die Formel lautet und was bei mehreren Mängeln gilt. Mit Rechenbeispielen.",
    keywords: [
      "Mietminderung berechnen",
      "Mietminderung Bruttowarmmiete",
      "Mietminderung Formel",
      "Mietminderung Beispiel",
      "Minderungsquote berechnen",
    ],
    lead:
      "Beim Berechnen der Mietminderung geht am häufigsten nicht die Quote schief, sondern die Zahl, auf die sie angewendet wird. Wer von der Kaltmiete statt von der Bruttowarmmiete ausgeht, verschenkt Monat für Monat Geld. So rechnen Sie richtig.",
    readingMinutes: 6,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "Berechnungsgrundlage ist immer die Bruttowarmmiete",
        paragraphs: [
          "Der Bundesgerichtshof hat diese Frage 2005 geklärt (Urteil vom 6. April 2005, Az. XII ZR 225/03): Bemessungsgrundlage der Minderung ist die Bruttowarmmiete, nicht die Nettokaltmiete.",
          "Gemeint ist die Nettokaltmiete plus sämtliche Betriebskostenvorauszahlungen oder -pauschalen. Die Logik dahinter: Sie bezahlen die Wohnung als Gesamtpaket, also schmälert ein Mangel auch den Wert des Gesamtpakets.",
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
          "Im Beispiel macht der Unterschied zwischen Kalt- und Warmmiete bei 20 % Minderung 40 € im Monat aus. Aufs Jahr gerechnet sind das 480 €.",
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
          "Notieren Sie Beginn und Ende des Mangels taggenau. Aus genau diesen beiden Daten ergibt sich später die Höhe Ihres Anspruchs.",
      },
      {
        heading: "Mehrere Mängel gleichzeitig",
        paragraphs: [
          "Treten mehrere Mängel gleichzeitig auf, werden die Quoten grundsätzlich addiert. Die Gesamtminderung kann jedoch nie mehr als 100 % betragen.",
          "Eine Einschränkung gibt es. Beschreiben zwei Mängel im Kern dieselbe Beeinträchtigung, etwa der defekte Heizkörper und die deshalb zu kalte Wohnung, lassen sich die Quoten nicht einfach aufaddieren. Gerichte bewerten solche Fälle in einer Gesamtschau.",
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
          "Berücksichtigen Sie Dauer, Intensität und Ausmaß der Beeinträchtigung, denn die Tabellenwerte sind Spannen und keine festen Größen",
          "Schätzen Sie im Zweifel konservativ: Eine zu niedrige Minderung kostet Geld, eine zu hohe kann die Wohnung kosten",
          "Lassen Sie die Quote bei größeren Beträgen vom Mieterverein oder einem Fachanwalt prüfen",
        ],
        note:
          "Alle Prozentwerte in solchen Tabellen stammen aus Einzelfallentscheidungen und sind reine Orientierung. Kein Gericht ist daran gebunden; bewertet wird immer der konkrete Fall.",
      },
    ],
    faqs: [
      {
        question: "Wird die Mietminderung von der Kalt- oder Warmmiete berechnet?",
        answer:
          "Von der Bruttowarmmiete, also der Nettokaltmiete plus aller Betriebs- und Heizkostenvorauszahlungen. So hat es der Bundesgerichtshof mit Urteil vom 6. April 2005 entschieden (Az. XII ZR 225/03).",
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
    metaTitle: "Miete unter Vorbehalt zahlen: Formulierung & Rückforderung",
    description:
      "Warum Sie die Miete bei Mängeln unter Vorbehalt zahlen sollten, wie Sie den Vorbehalt formulieren und zu viel gezahlte Miete zurückfordern.",
    keywords: [
      "Miete unter Vorbehalt zahlen",
      "Vorbehalt Mietminderung",
      "Miete zurückfordern",
      "Verwendungszweck Vorbehalt",
    ],
    lead:
      "Wer die Miete auf eigene Faust kürzt und sich dabei verschätzt, riskiert im schlimmsten Fall die fristlose Kündigung. Es geht auch anders: voll weiterzahlen, den Vorbehalt erklären, das Geld später zurückholen. Wirtschaftlich kommt dasselbe heraus, nur ohne das Risiko.",
    readingMinutes: 5,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "Das Risiko der direkten Kürzung",
        paragraphs: [
          "Wer die Quote zu hoch ansetzt, baut einen Rückstand auf. Erreicht der zwei Monatsmieten, darf der Vermieter fristlos kündigen (§ 543 Abs. 2 Nr. 3 BGB). Dass Sie in gutem Glauben geschätzt haben, hilft Ihnen dann nur noch begrenzt.",
          "Und so ein Rückstand entsteht schneller als gedacht. Wer fünf Monate lang 40 % einbehält, hat rechnerisch bereits zwei volle Monatsmieten offen.",
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
          "Nach Beseitigung des Mangels fordern Sie den zu viel gezahlten Betrag zurück, notfalls vor Gericht.",
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
          "Im Verwendungszweck ist der Platz knapp. Eine Kurzform genügt, solange sie das Datum Ihrer Mängelanzeige nennt.",
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
          "Nur wenn Sie über längere Zeit vorbehaltlos zahlen. Nach etwa sechs Monaten kann das Minderungsrecht verwirkt sein. Genau davor schützt der ausdrückliche Vorbehalt bei jeder Zahlung.",
      },
    ],
  },

  {
    slug: "mietminderung-rueckwirkend",
    navLabel: "Rückwirkend mindern",
    title: "Rückwirkende Mietminderung: Wann Sie Geld zurückfordern können",
    metaTitle: "Rückwirkende Mietminderung: wann Rückforderung möglich ist",
    description:
      "Rückwirkend mindern geht nur in vier Fällen. Welche das sind, welche Verjährungsfristen gelten und wie Sie bei der Rückforderung vorgehen.",
    keywords: [
      "rückwirkende Mietminderung",
      "Miete rückwirkend mindern",
      "Mietminderung Verjährung",
      "zu viel Miete gezahlt zurückfordern",
    ],
    lead:
      "„Kann ich für die vergangenen Monate Geld zurückverlangen?“ gehört zu den häufigsten Fragen rund um die Mietminderung. Die ehrliche Antwort lautet: meistens nicht. Es gibt aber vier klar umrissene Ausnahmen, und die sollten Sie kennen.",
    readingMinutes: 5,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "Der Grundsatz: ab Kenntnis des Vermieters",
        paragraphs: [
          "Nach § 536 BGB mindert sich die Miete automatisch, sobald ein erheblicher Mangel vorliegt. Durchsetzen lässt sich der Anspruch aber erst, wenn der Vermieter von dem Mangel weiß, im Normalfall also ab dem Zugang Ihrer Mängelanzeige.",
          "Für die Zeit davor gilt: Wer den Mangel kannte und die Miete trotzdem vorbehaltlos in voller Höhe gezahlt hat, kann das Geld regelmäßig nicht zurückfordern.",
        ],
      },
      {
        heading: "Diese vier Fälle erlauben eine Rückforderung",
        bullets: [
          "Sie haben die Miete unter Vorbehalt gezahlt; der Rückforderungsanspruch bleibt dann in vollem Umfang erhalten",
          "Der Vermieter kannte den Mangel bereits, etwa weil er ihn selbst gesehen hat oder das gesamte Haus betroffen war",
          "Der Vermieter hat eine falsche Wohnflächenangabe gemacht; in diesem Fall besteht der Anspruch ab Mietbeginn",
          "Der Mietvertrag enthält eine unwirksame Klausel, die Sie von der Minderung abgehalten hat",
        ],
        note:
          "Unterschätzen Sie den letzten Punkt nicht. Gerade ältere Mietverträge enthalten oft Klauseln, die das Minderungsrecht ausschließen sollen. Bei Wohnraum sind solche Klauseln nach § 536 Abs. 4 BGB unwirksam, gezahlt wurde ihretwegen trotzdem oft jahrelang zu viel.",
      },
      {
        heading: "Verwirkung: Wenn zu langes Warten den Anspruch kostet",
        paragraphs: [
          "Zahlen Sie über längere Zeit vorbehaltlos die volle Miete, obwohl Sie den Mangel kennen, kann das Minderungsrecht verwirken. Als Richtwert nennt die Rechtsprechung etwa sechs Monate.",
          "Juristisch braucht die Verwirkung zwei Zutaten. Das Zeitmoment: Es ist längere Zeit vergangen. Und das Umstandsmoment: Der Vermieter durfte aus Ihrem Verhalten schließen, dass Sie nicht mehr mindern werden. Erst beides zusammen kostet den Anspruch.",
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
          "Bei Ablehnung Mieterverein oder Fachanwalt einschalten; häufig genügt schon ein anwaltliches Schreiben.",
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
          "Ja. Weicht die tatsächliche Wohnfläche um mehr als zehn Prozent nach unten ab, besteht der Anspruch nach der Rechtsprechung des BGH ab Mietbeginn, und zwar auch ohne vorherige Mängelanzeige, weil der Vermieter die falsche Angabe selbst zu vertreten hat.",
      },
    ],
  },

  {
    slug: "mietminderung-ausschluss",
    navLabel: "Wann keine Minderung gilt",
    title: "Wann die Mietminderung ausgeschlossen ist: 7 Ausschlussgründe",
    metaTitle: "Mietminderung ausgeschlossen: 7 Gründe, die den Anspruch kosten",
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
      "Nicht jeder Mangel berechtigt zur Minderung. Das Gesetz kennt eine Reihe von Ausschlussgründen, und wer sie übersieht und trotzdem kürzt, baut einen Zahlungsrückstand auf, an dessen Ende die Kündigung stehen kann. Gehen Sie diese sieben Punkte durch, bevor Sie die Miete anfassen.",
    readingMinutes: 6,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "1. Kenntnis des Mangels bei Vertragsschluss (§ 536b BGB)",
        paragraphs: [
          "Wer einen Mangel bei Unterzeichnung des Mietvertrags kennt und trotzdem einzieht, kann deswegen später nicht mindern. Dasselbe gilt, wenn Sie den Mangel nur aus grober Fahrlässigkeit nicht kannten, er also bei der Besichtigung kaum zu übersehen war.",
          "Die Ausnahme: Haben Sie sich bei Annahme der Wohnung Ihre Rechte wegen des Mangels ausdrücklich vorbehalten, bleibt das Minderungsrecht bestehen. Lassen Sie einen solchen Vorbehalt immer ins Übergabeprotokoll aufnehmen.",
        ],
      },
      {
        heading: "2. Unterlassene Mängelanzeige (§ 536c BGB)",
        paragraphs: [
          "Zeigen Sie einen Mangel nicht unverzüglich an und kann der Vermieter ihn deshalb nicht beseitigen, verlieren Sie das Minderungsrecht. Zusätzlich können Sie ihm gegenüber schadensersatzpflichtig werden.",
          "Kennt der Vermieter den Mangel bereits aus anderer Quelle, entfällt die Anzeigepflicht. Verlassen sollten Sie sich darauf trotzdem nie.",
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
          "Für Ihre Position ist die Beweislast entscheidend, und die liegt beim Vermieter. Er muss zuerst ausschließen, dass bauliche Ursachen wie Wärmebrücken oder fehlende Dämmung dahinterstecken. Erst wenn ihm das gelingt, kommt Ihr Nutzungsverhalten überhaupt ins Spiel.",
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
          "Nach Ablauf der drei Monate dürfen Sie mindern. Und der Ausschluss gilt nur für energetische Maßnahmen; allgemeine Modernisierungen oder reine Instandsetzungen fallen nicht darunter.",
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
          "Gemessen wird immer am Zustand bei Vertragsschluss. Was sich danach verschlechtert, kann ein Mangel sein. Was von Anfang an so war, haben Sie dagegen mitgemietet.",
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
          "Ein Mangel, der die Tauglichkeit der Wohnung nur unerheblich mindert und sich mit geringem Aufwand beheben lässt, etwa ein einzelner tropfender Wasserhahn. Nach § 536 Abs. 1 Satz 3 BGB berechtigt er nicht zur Minderung.",
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
      "Von der zu hohen Quote bis zur fehlenden Dokumentation: zehn Fehler, die Mieter regelmäßig ihren Anspruch kosten, und wie Sie sie vermeiden.",
    keywords: [
      "Fehler Mietminderung",
      "Mietminderung falsch gemacht",
      "Mietminderung Kündigung Risiko",
      "Mietminderung Tipps",
    ],
    lead:
      "Wenn eine Mietminderung scheitert, liegt es selten am Mangel selbst. Fast immer ist es das Vorgehen: keine Anzeige, falsche Rechengrundlage, zu forsch gekürzt. Diese zehn Fehler sollten Sie kennen, bevor Sie die erste Überweisung anfassen.",
    readingMinutes: 6,
    published: "2026-03-06",
    updated: "2026-07-26",
    sections: [
      {
        heading: "Fehler 1: Die Miete kürzen, ohne den Mangel anzuzeigen",
        paragraphs: [
          "Der mit Abstand häufigste und teuerste Fehler. Ohne Mängelanzeige gibt es keinen durchsetzbaren Anspruch, die einbehaltene Miete ist dann nichts weiter als ein Zahlungsrückstand. Erst schriftlich anzeigen, dann über die Minderung reden.",
        ],
      },
      {
        heading: "Fehler 2: Zu hoch mindern",
        paragraphs: [
          "Erreicht der Rückstand zwei Monatsmieten, droht die fristlose Kündigung (§ 543 Abs. 2 Nr. 3 BGB). Und Tabellenwerte sind Spannen aus Einzelfällen, keine Garantien. Bleiben Sie am unteren Ende oder zahlen Sie gleich unter Vorbehalt.",
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
          "Ohne Fotos, Protokolle und Zeugen steht im Prozess Aussage gegen Aussage, und die Beweislast für den Mangel trägt der Mieter. Fangen Sie mit der Dokumentation am ersten Tag an, nicht erst, wenn der Streit da ist.",
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
          "Eine E-Mail beweist nicht, dass sie angekommen ist. Setzen Sie auf Einwurf-Einschreiben oder einen Boten mit Zeugen. Die E-Mail können Sie zusätzlich schicken, damit der Vermieter schnell Bescheid weiß.",
        ],
      },
      {
        heading: "Fehler 6: Keine Frist zur Beseitigung setzen",
        paragraphs: [
          "Ohne konkret datierte Frist lösen Sie keine Folgerechte aus, weder Schadensersatz noch Selbstvornahme nach § 536a Abs. 2 BGB. Also: ein Datum ins Schreiben, keinen vagen Zeitraum.",
        ],
      },
      {
        heading: "Fehler 7: Dem Vermieter den Zutritt verweigern",
        paragraphs: [
          "Der Vermieter darf sich den Mangel ansehen und muss ihn beseitigen dürfen. Wer nach ordentlicher Ankündigung die Tür nicht aufmacht, riskiert sein Minderungsrecht und hat die Verzögerung am Ende selbst zu verantworten.",
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
          "Nach etwa sechs Monaten vorbehaltloser Zahlung kann das Minderungsrecht verwirkt sein. Warten Sie deshalb nicht ab: Die Mängelanzeige sollte innerhalb weniger Tage nach der Entdeckung raus sein.",
        ],
      },
      {
        heading: "Fehler 10: Den Mangel selbst beseitigen und dann kürzen",
        paragraphs: [
          "Eine Selbstvornahme ist nur unter engen Voraussetzungen zulässig: Der Vermieter muss in Verzug sein oder die Beseitigung muss zur Erhaltung der Mietsache dringend erforderlich sein (§ 536a Abs. 2 BGB). Wer vorschnell selbst repariert, bleibt auf den Kosten sitzen.",
        ],
        note:
          "Auf die Reihenfolge kommt es an: erst Frist setzen, deren fruchtlosen Ablauf dokumentieren, und erst dann einen Handwerker beauftragen, falls der Vermieter weiter untätig bleibt.",
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
          "Ja, wenn Sie zu hoch mindern und ein Rückstand von zwei Monatsmieten aufläuft. Dann ist eine fristlose Kündigung nach § 543 Abs. 2 Nr. 3 BGB möglich. Wer stattdessen unter Vorbehalt zahlt, schließt dieses Risiko aus.",
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
