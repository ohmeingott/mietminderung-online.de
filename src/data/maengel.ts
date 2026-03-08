export interface Mangel {
  id: string;
  label: string;
  minderung_min: number;
  minderung_max: number;
  minderung_typical: number;
  description: string;
}

export interface MangelKategorie {
  id: string;
  label: string;
  icon: string;
  maengel: Mangel[];
}

export const mangelKategorien: MangelKategorie[] = [
  {
    id: "heizung",
    label: "Heizung & Warmwasser",
    icon: "Thermometer",
    maengel: [
      {
        id: "heizung_total",
        label: "Heizungsausfall (komplett)",
        minderung_min: 70,
        minderung_max: 100,
        minderung_typical: 80,
        description:
          "Die gesamte Heizung fällt aus, Raumtemperatur unter 18°C in der Heizperiode (Oktober–April).",
      },
      {
        id: "heizung_teilweise",
        label: "Heizungsausfall (einzelne Räume)",
        minderung_min: 20,
        minderung_max: 50,
        minderung_typical: 30,
        description:
          "Heizung fällt in einem oder mehreren Räumen aus, andere Räume sind beheizt.",
      },
      {
        id: "heizung_unzureichend",
        label: "Heizung wärmt unzureichend",
        minderung_min: 10,
        minderung_max: 20,
        minderung_typical: 15,
        description:
          "Raumtemperatur bleibt unter 20°C trotz laufender Heizung.",
      },
      {
        id: "warmwasser_total",
        label: "Warmwasserausfall (komplett)",
        minderung_min: 10,
        minderung_max: 30,
        minderung_typical: 15,
        description: "Kein warmes Wasser in der gesamten Wohnung verfügbar.",
      },
      {
        id: "warmwasser_vorlauf",
        label: "Warmwasser erst nach langer Vorlaufzeit",
        minderung_min: 3,
        minderung_max: 10,
        minderung_typical: 5,
        description:
          "Warmes Wasser kommt erst nach 5+ Minuten Vorlaufzeit.",
      },
      {
        id: "heizung_geraeusche",
        label: "Heizung macht Geräusche",
        minderung_min: 10,
        minderung_max: 17,
        minderung_typical: 12,
        description:
          "Klopfen, Gurgeln oder andere störende Geräusche in Heizungsrohren.",
      },
    ],
  },
  {
    id: "feuchtigkeit",
    label: "Feuchtigkeit & Schimmel",
    icon: "Droplets",
    maengel: [
      {
        id: "schimmel_leicht",
        label: "Schimmel in einem Raum (leicht)",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 8,
        description:
          "Oberflächlicher Schimmelbefall an einer kleinen Fläche in einem Raum.",
      },
      {
        id: "schimmel_stark",
        label: "Schimmel in mehreren Räumen (stark)",
        minderung_min: 20,
        minderung_max: 50,
        minderung_typical: 30,
        description:
          "Großflächiger Schimmelbefall in mehreren Räumen der Wohnung.",
      },
      {
        id: "feuchtigkeit_wand",
        label: "Feuchte Wände / Durchfeuchtung",
        minderung_min: 5,
        minderung_max: 15,
        minderung_typical: 10,
        description:
          "Feuchte Wände, nasse Flecken oder Durchfeuchtung in Wohnräumen.",
      },
      {
        id: "wasserschaden",
        label: "Wasserschaden / Wassereinbruch",
        minderung_min: 20,
        minderung_max: 50,
        minderung_typical: 30,
        description:
          "Wasser dringt in die Wohnung ein, z.B. durch undichtes Dach oder Rohrbruch.",
      },
      {
        id: "trocknungsgeraete",
        label: "Trocknungsgeräte nach Wasserschaden",
        minderung_min: 30,
        minderung_max: 100,
        minderung_typical: 50,
        description:
          "Laute Trocknungsgeräte stehen in der Wohnung und schränken die Nutzung ein.",
      },
      {
        id: "feuchter_keller",
        label: "Feuchter Keller",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 7,
        description:
          "Keller ist feucht oder nass (wenn Keller Teil der Mietsache ist).",
      },
    ],
  },
  {
    id: "laerm",
    label: "Lärm & Ruhestörung",
    icon: "Volume2",
    maengel: [
      {
        id: "baulaerm_haus",
        label: "Baulärm im Haus / Nachbarhaus",
        minderung_min: 10,
        minderung_max: 40,
        minderung_typical: 25,
        description:
          "Erheblicher Baulärm durch Bauarbeiten im oder am Haus.",
      },
      {
        id: "strassenlaerm",
        label: "Erhöhter Straßenlärm (z.B. Baustelle)",
        minderung_min: 5,
        minderung_max: 15,
        minderung_typical: 10,
        description:
          "Straßenlärm über das übliche Maß hinaus, z.B. durch Baustelle.",
      },
      {
        id: "nachbarlaerm",
        label: "Dauerhafter Nachbarlärm",
        minderung_min: 10,
        minderung_max: 20,
        minderung_typical: 15,
        description:
          "Regelmäßige, ruhestörende Geräusche von Nachbarn über das Normalmaß hinaus.",
      },
      {
        id: "gastronomie",
        label: "Lärm durch Gastronomie im Haus",
        minderung_min: 10,
        minderung_max: 30,
        minderung_typical: 20,
        description:
          "Lärm durch Kneipe, Restaurant oder Diskothek im Gebäude.",
      },
      {
        id: "aufzug_laerm",
        label: "Lärm durch Aufzug",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 7,
        description:
          "Ständiges Rattern, Summen oder Vibrationen durch den Aufzug.",
      },
    ],
  },
  {
    id: "ungeziefer",
    label: "Ungeziefer & Schädlinge",
    icon: "Bug",
    maengel: [
      {
        id: "kakerlaken",
        label: "Kakerlaken / Schaben",
        minderung_min: 10,
        minderung_max: 25,
        minderung_typical: 15,
        description:
          "Befall mit Kakerlaken oder Schaben in der Wohnung.",
      },
      {
        id: "ratten",
        label: "Ratten in der Wohnung / im Haus",
        minderung_min: 10,
        minderung_max: 25,
        minderung_typical: 15,
        description: "Tatsächlicher Rattenbefall in Wohnung oder Haus.",
      },
      {
        id: "maeuse",
        label: "Mäusebefall",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 8,
        description: "Mäusebefall in der Wohnung.",
      },
      {
        id: "bettwanzen",
        label: "Bettwanzen",
        minderung_min: 10,
        minderung_max: 25,
        minderung_typical: 20,
        description: "Befall mit Bettwanzen in der Wohnung.",
      },
      {
        id: "silberfische",
        label: "Silberfische (starker Befall)",
        minderung_min: 5,
        minderung_max: 20,
        minderung_typical: 10,
        description:
          "Starker Silberfischbefall, oft Hinweis auf Feuchtigkeitsprobleme.",
      },
      {
        id: "wespen",
        label: "Wespen-/Bienennest",
        minderung_min: 5,
        minderung_max: 15,
        minderung_typical: 10,
        description:
          "Wespen- oder Bienennest am Gebäude, das die Nutzung einschränkt.",
      },
    ],
  },
  {
    id: "fenster_tueren",
    label: "Fenster & Türen",
    icon: "DoorOpen",
    maengel: [
      {
        id: "fenster_undicht",
        label: "Undichte Fenster (Zugluft)",
        minderung_min: 5,
        minderung_max: 20,
        minderung_typical: 10,
        description:
          "Fenster sind undicht, es zieht in die Wohnung.",
      },
      {
        id: "fenster_oeffnen",
        label: "Fenster lassen sich nicht öffnen",
        minderung_min: 5,
        minderung_max: 15,
        minderung_typical: 10,
        description:
          "Fenster können nicht geöffnet werden, Lüftung ist nicht möglich.",
      },
      {
        id: "fenster_schliessen",
        label: "Fenster lassen sich nicht schließen",
        minderung_min: 5,
        minderung_max: 15,
        minderung_typical: 10,
        description:
          "Fenster können nicht geschlossen werden — Sicherheitsrisiko und Wärmeverlust.",
      },
      {
        id: "tuer_abschliessbar",
        label: "Wohnungstür nicht abschließbar",
        minderung_min: 5,
        minderung_max: 25,
        minderung_typical: 10,
        description:
          "Wohnungstür kann nicht abgeschlossen werden — Sicherheitsmangel.",
      },
      {
        id: "klingel_defekt",
        label: "Türklingel / Gegensprechanlage defekt",
        minderung_min: 1,
        minderung_max: 3,
        minderung_typical: 2,
        description:
          "Klingel oder Gegensprechanlage funktioniert nicht.",
      },
    ],
  },
  {
    id: "bad_sanitaer",
    label: "Bad & Sanitär",
    icon: "ShowerHead",
    maengel: [
      {
        id: "toilette_defekt",
        label: "Toilette nicht benutzbar",
        minderung_min: 15,
        minderung_max: 80,
        minderung_typical: 50,
        description:
          "Die einzige Toilette ist defekt und nicht benutzbar.",
      },
      {
        id: "dusche_defekt",
        label: "Dusche defekt",
        minderung_min: 5,
        minderung_max: 15,
        minderung_typical: 10,
        description: "Dusche funktioniert nicht oder ist nicht benutzbar.",
      },
      {
        id: "wasserdruck_niedrig",
        label: "Wasserdruck zu niedrig",
        minderung_min: 3,
        minderung_max: 5,
        minderung_typical: 4,
        description: "Zu niedriger Wasserdruck in Bad oder Küche.",
      },
      {
        id: "bad_belueftung",
        label: "Bad nicht belüftbar",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 7,
        description:
          "Bad hat kein funktionierendes Fenster und keinen Abzug.",
      },
      {
        id: "spuelung_defekt",
        label: "Toilettenspülung defekt",
        minderung_min: 5,
        minderung_max: 15,
        minderung_typical: 10,
        description:
          "Toilettenspülung funktioniert nicht, Eimerspülung nötig.",
      },
    ],
  },
  {
    id: "kueche",
    label: "Küche & Geräte",
    icon: "CookingPot",
    maengel: [
      {
        id: "herd_defekt",
        label: "Herd / Backofen defekt",
        minderung_min: 2,
        minderung_max: 5,
        minderung_typical: 3,
        description:
          "Vom Vermieter gestellter Herd oder Backofen funktioniert nicht.",
      },
      {
        id: "kuehlschrank_defekt",
        label: "Kühlschrank defekt",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 7,
        description:
          "Vom Vermieter gestellter Kühlschrank funktioniert nicht.",
      },
      {
        id: "spuelmaschine_defekt",
        label: "Spülmaschine defekt",
        minderung_min: 3,
        minderung_max: 5,
        minderung_typical: 5,
        description:
          "Vertraglich vereinbarte Spülmaschine funktioniert nicht.",
      },
      {
        id: "kueche_komplett",
        label: "Küche komplett nicht nutzbar",
        minderung_min: 20,
        minderung_max: 100,
        minderung_typical: 50,
        description:
          "Die gesamte Küche ist nicht benutzbar (z.B. nach Wasserschaden).",
      },
    ],
  },
  {
    id: "aufzug",
    label: "Aufzug",
    icon: "ArrowUpDown",
    maengel: [
      {
        id: "aufzug_defekt",
        label: "Aufzug defekt",
        minderung_min: 5,
        minderung_max: 20,
        minderung_typical: 10,
        description:
          "Vertraglich vereinbarter Aufzug funktioniert nicht.",
      },
      {
        id: "aufzug_hoch",
        label: "Aufzug defekt — hohes Stockwerk",
        minderung_min: 15,
        minderung_max: 50,
        minderung_typical: 20,
        description:
          "Aufzug defekt bei Wohnung in hohem Stockwerk oder bei Gehbehinderung.",
      },
    ],
  },
  {
    id: "elektrik",
    label: "Elektrik & Technik",
    icon: "Zap",
    maengel: [
      {
        id: "strom_komplett",
        label: "Kompletter Stromausfall",
        minderung_min: 50,
        minderung_max: 100,
        minderung_typical: 80,
        description: "Kein Strom in der gesamten Wohnung.",
      },
      {
        id: "treppenhaus_licht",
        label: "Treppenhausbeleuchtung defekt",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 5,
        description: "Beleuchtung im Treppenhaus funktioniert nicht.",
      },
      {
        id: "internet_ausfall",
        label: "Internetausfall (wenn zur Mietsache)",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 7,
        description:
          "Internet, das als Teil der Mietsache vereinbart wurde, fällt aus.",
      },
      {
        id: "kabel_defekt",
        label: "Kabelanschluss / TV defekt",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 7,
        description:
          "Vertraglich vereinbarter Kabelanschluss funktioniert nicht.",
      },
    ],
  },
  {
    id: "wohnflaeche",
    label: "Wohnfläche & Raumqualität",
    icon: "Maximize",
    maengel: [
      {
        id: "wohnflaeche_10",
        label: "Wohnfläche über 10% kleiner als vereinbart",
        minderung_min: 10,
        minderung_max: 30,
        minderung_typical: 15,
        description:
          "Die tatsächliche Wohnfläche ist mehr als 10% kleiner als im Vertrag angegeben.",
      },
      {
        id: "hitze_dach",
        label: "Extreme Hitze im Sommer (über 26°C)",
        minderung_min: 10,
        minderung_max: 25,
        minderung_typical: 15,
        description:
          "Wohnung (z.B. Dachgeschoss) heizt sich über 26°C auf.",
      },
      {
        id: "undichtes_dach",
        label: "Undichtes Dach / undichte Decke",
        minderung_min: 15,
        minderung_max: 30,
        minderung_typical: 20,
        description: "Wasser dringt durch Dach oder Decke ein.",
      },
    ],
  },
  {
    id: "balkon_aussen",
    label: "Balkon, Terrasse & Außenbereiche",
    icon: "TreePine",
    maengel: [
      {
        id: "balkon_nicht_nutzbar",
        label: "Balkon nicht nutzbar",
        minderung_min: 3,
        minderung_max: 10,
        minderung_typical: 5,
        description:
          "Balkon nicht nutzbar, z.B. wegen Baugerüst oder Bauarbeiten.",
      },
      {
        id: "terrasse_nicht_nutzbar",
        label: "Terrasse nicht nutzbar (Sommer)",
        minderung_min: 5,
        minderung_max: 15,
        minderung_typical: 10,
        description: "Terrasse kann im Sommer nicht genutzt werden.",
      },
      {
        id: "keller_nicht_nutzbar",
        label: "Keller nicht nutzbar",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 7,
        description:
          "Vertraglich vereinbarter Keller ist nicht nutzbar.",
      },
      {
        id: "stellplatz_nicht_nutzbar",
        label: "Stellplatz / Garage nicht nutzbar",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 7,
        description: "Stellplatz oder Garage kann nicht genutzt werden.",
      },
      {
        id: "baugeruest",
        label: "Baugerüst vor dem Fenster",
        minderung_min: 5,
        minderung_max: 15,
        minderung_typical: 10,
        description:
          "Baugerüst schränkt Lichteinfall ein und stellt Einbruchsgefahr dar.",
      },
    ],
  },
  {
    id: "gesundheit",
    label: "Gesundheitsgefahren",
    icon: "HeartPulse",
    maengel: [
      {
        id: "asbest",
        label: "Asbest in der Wohnung",
        minderung_min: 10,
        minderung_max: 50,
        minderung_typical: 20,
        description:
          "Asbest wurde in der Wohnung gefunden (z.B. gebrochene Platten).",
      },
      {
        id: "legionellen",
        label: "Legionellen im Trinkwasser",
        minderung_min: 10,
        minderung_max: 25,
        minderung_typical: 15,
        description: "Überschreitung der Legionellen-Grenzwerte.",
      },
      {
        id: "bleirohre",
        label: "Bleirohre (Grenzwertüberschreitung)",
        minderung_min: 10,
        minderung_max: 15,
        minderung_typical: 12,
        description: "Bleirohre im Trinkwassersystem mit Grenzwertüberschreitung.",
      },
      {
        id: "formaldehyd",
        label: "Formaldehyd-Belastung",
        minderung_min: 20,
        minderung_max: 50,
        minderung_typical: 30,
        description:
          "Erhöhte Formaldehydbelastung in der Wohnung.",
      },
    ],
  },
  {
    id: "gerueche",
    label: "Geruchsbelästigung",
    icon: "Wind",
    maengel: [
      {
        id: "abwasser_geruch",
        label: "Abwassergeruch in der Wohnung",
        minderung_min: 10,
        minderung_max: 20,
        minderung_typical: 15,
        description: "Abwassergeruch durch defekte Leitungen.",
      },
      {
        id: "muell_geruch",
        label: "Müllgeruch (ständig)",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 7,
        description: "Ständiger Müllgeruch, z.B. durch Müllraum nebenan.",
      },
      {
        id: "gewerbe_geruch",
        label: "Geruch durch Gastronomie / Gewerbe",
        minderung_min: 5,
        minderung_max: 20,
        minderung_typical: 10,
        description: "Geruchsbelästigung durch Gastronomie oder Gewerbebetrieb.",
      },
    ],
  },
];

export interface EligibilityQuestion {
  id: string;
  question: string;
  description: string;
  options: { value: string; label: string; eligible: boolean | null }[];
}

export const eligibilityQuestions: EligibilityQuestion[] = [
  {
    id: "mietvertrag",
    question: "Haben Sie einen gültigen Mietvertrag?",
    description:
      "Eine Mietminderung setzt ein bestehendes Mietverhältnis voraus.",
    options: [
      { value: "ja", label: "Ja", eligible: true },
      { value: "nein", label: "Nein", eligible: false },
    ],
  },
  {
    id: "mangel_bekannt",
    question: "Wussten Sie bei Einzug bereits von dem Mangel?",
    description:
      "Wenn Sie den Mangel bei Einzug bereits kannten und trotzdem einzogen, entfällt das Minderungsrecht (§ 536b BGB).",
    options: [
      { value: "nein", label: "Nein, der Mangel war mir nicht bekannt", eligible: true },
      {
        value: "ja_vorbehalt",
        label: "Ja, aber ich habe mir Rechte vorbehalten",
        eligible: true,
      },
      { value: "ja", label: "Ja, und ich habe nichts gesagt", eligible: false },
    ],
  },
  {
    id: "selbst_verursacht",
    question: "Haben Sie den Mangel selbst verursacht?",
    description:
      "Wenn der Mieter den Mangel selbst verursacht hat, entfällt das Minderungsrecht.",
    options: [
      { value: "nein", label: "Nein", eligible: true },
      { value: "ja", label: "Ja", eligible: false },
      { value: "unsicher", label: "Bin mir nicht sicher", eligible: null },
    ],
  },
  {
    id: "erheblich",
    question: "Wie stark beeinträchtigt der Mangel Ihre Wohnung?",
    description:
      "Nur erhebliche Mängel berechtigen zur Mietminderung. Rein kosmetische oder Bagatellmängel reichen nicht aus.",
    options: [
      {
        value: "stark",
        label: "Stark — Wohnqualität deutlich eingeschränkt",
        eligible: true,
      },
      {
        value: "mittel",
        label: "Mittel — spürbare Beeinträchtigung",
        eligible: true,
      },
      {
        value: "gering",
        label: "Gering — nur leichte Unannehmlichkeit",
        eligible: false,
      },
    ],
  },
  {
    id: "angezeigt",
    question: "Haben Sie den Mangel Ihrem Vermieter bereits gemeldet?",
    description:
      "Die Mängelanzeige ist Voraussetzung für die Mietminderung (§ 536c BGB). Wir helfen Ihnen dabei, diese zu erstellen.",
    options: [
      { value: "nein", label: "Nein, noch nicht gemeldet", eligible: true },
      { value: "muendlich", label: "Ja, aber nur mündlich", eligible: true },
      { value: "ja", label: "Ja, bereits schriftlich gemeldet", eligible: true },
    ],
  },
];

export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "Was ist eine Mietminderung?",
    answer:
      "Eine Mietminderung bedeutet, dass Sie als Mieter weniger Miete zahlen dürfen, wenn Ihre Wohnung Mängel hat, die die Wohnqualität beeinträchtigen. Dieses Recht ergibt sich automatisch aus § 536 BGB — Sie müssen keine Genehmigung beantragen. Die Miete ist von Gesetzes wegen gemindert, solange der Mangel besteht.",
  },
  {
    question: "Muss der Vermieter die Mietminderung genehmigen?",
    answer:
      "Nein! Die Mietminderung tritt kraft Gesetzes (automatisch) ein, sobald ein erheblicher Mangel vorliegt und Sie diesen dem Vermieter angezeigt haben. Sie brauchen keine Zustimmung. Allerdings müssen Sie den Mangel vorher dem Vermieter melden (Mängelanzeige).",
  },
  {
    question: "Wie berechne ich die Höhe der Mietminderung?",
    answer:
      "Die Mietminderung wird von der Bruttowarmmiete berechnet — also Kaltmiete plus alle Nebenkosten. Die Höhe richtet sich nach Art und Schwere des Mangels. Beispiel: Bei einer Bruttowarmmiete von 1.000 € und einer Minderungsquote von 20% zahlen Sie nur 800 €. Die Quote ergibt sich aus Gerichtsurteilen zu vergleichbaren Fällen.",
  },
  {
    question: "Was ist eine Mängelanzeige und warum brauche ich sie?",
    answer:
      "Die Mängelanzeige ist eine schriftliche Mitteilung an Ihren Vermieter, in der Sie den Mangel beschreiben und zur Beseitigung auffordern. Sie ist gesetzlich vorgeschrieben (§ 536c BGB). Ohne Mängelanzeige können Sie nicht mindern und riskieren sogar Schadensersatzansprüche. Wir helfen Ihnen, diese rechtssicher zu erstellen.",
  },
  {
    question: "Was passiert, wenn ich die Miete zu stark mindere?",
    answer:
      "Vorsicht: Wenn Sie die Miete zu stark mindern und ein Rückstand von zwei Monatsmieten entsteht, kann der Vermieter fristlos kündigen (§ 543 Abs. 2 Nr. 3 BGB). Unsere Empfehlung: Zahlen Sie zunächst unter Vorbehalt die volle Miete und fordern Sie den Differenzbetrag später zurück. So sind Sie auf der sicheren Seite.",
  },
  {
    question: "Kann der Vermieter die Mietminderung im Vertrag ausschließen?",
    answer:
      "Nein. Bei Wohnraummietverhältnissen ist das Recht auf Mietminderung nicht abdingbar (§ 536 Abs. 4 BGB). Klauseln im Mietvertrag, die das Minderungsrecht ausschließen, sind unwirksam.",
  },
  {
    question: "Ab wann kann ich die Miete mindern?",
    answer:
      "Die Mietminderung gilt ab dem Zeitpunkt, zu dem der Vermieter den Mangel kennt — in der Regel also ab Zugang der Mängelanzeige. Für die Zeit davor können Sie in der Regel nicht mindern, es sei denn, Sie haben unter Vorbehalt gezahlt.",
  },
  {
    question: "Muss ich bei Schimmel immer mindern dürfen?",
    answer:
      "Nicht unbedingt. Wenn der Schimmel durch Ihr eigenes Verhalten verursacht wurde (falsches Lüften/Heizen), entfällt das Minderungsrecht. Allerdings liegt die Beweislast beim Vermieter — er muss nachweisen, dass Sie den Schimmel verursacht haben. Oft liegt die Ursache aber an baulichen Mängeln.",
  },
  {
    question: "Wie lange gilt die Mietminderung?",
    answer:
      "Die Mietminderung gilt für den gesamten Zeitraum, in dem der Mangel besteht. Sobald der Mangel beseitigt ist, müssen Sie wieder die volle Miete zahlen. Es gibt keine zeitliche Obergrenze.",
  },
  {
    question: "Was bedeutet 'unter Vorbehalt zahlen'?",
    answer:
      "Wenn Sie die Miete 'unter Vorbehalt' zahlen, behalten Sie sich das Recht vor, zu viel gezahlte Miete zurückzufordern. Vermerken Sie im Überweisungszweck: 'Zahlung unter Vorbehalt wegen Mangel [Beschreibung]'. So schützen Sie sich vor einer fristlosen Kündigung und können die Differenz später zurückfordern.",
  },
  {
    question: "Verliere ich mein Minderungsrecht, wenn ich lange nichts tue?",
    answer:
      "Ja, das ist möglich. Wenn Sie den Mangel kennen und über ca. 6 Monate die volle Miete ohne Vorbehalt zahlen, kann das Minderungsrecht verwirkt sein. Handeln Sie daher zeitnah nach Entdeckung eines Mangels.",
  },
  {
    question: "Was ist bei energetischer Modernisierung?",
    answer:
      "Bei energetischen Modernisierungsmaßnahmen (z.B. Wärmedämmung) ist die Mietminderung für 3 Monate ausgeschlossen (§ 536 Abs. 1a BGB). Danach dürfen Sie mindern. Dies gilt nur für energetische Maßnahmen, nicht für allgemeine Modernisierungen.",
  },
];
