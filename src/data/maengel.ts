export interface Mangel {
  id: string;
  label: string;
  minderung_min: number;
  minderung_max: number;
  minderung_typical: number;
  description: string;
  /**
   * Defects that cannot logically co-exist with this one. Selecting one clears
   * the others, so the total can no longer stack mutually exclusive states
   * (e.g. "heating fully out" plus "heating partly out").
   */
  excludes?: string[];
  /**
   * Quota is derived from user input rather than the static range above.
   * "wohnflaeche": the reduction equals the percentage by which the actual
   * floor area falls short of the agreed area (BGH VIII ZR 144/09), so the
   * static values only serve as a display fallback before both areas are known.
   */
  berechnet?: "wohnflaeche";
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
        minderung_min: 50,
        minderung_max: 100,
        minderung_typical: 70,
        description:
          "Die Heizung fällt vollständig aus und die Wohnung kühlt in der Heizperiode stark aus. Geschuldet sind tagsüber 20–22 °C; die Quote steigt mit sinkender Temperatur und ist in den Wintermonaten deutlich höher als im Oktober oder April.",
        excludes: ["heizung_teilweise", "heizung_unzureichend"],
      },
      {
        id: "heizung_teilweise",
        label: "Heizungsausfall (einzelne Räume)",
        minderung_min: 5,
        minderung_max: 30,
        minderung_typical: 15,
        description:
          "Heizung fällt in einem oder mehreren Räumen aus, andere Räume sind beheizt. Die Höhe richtet sich nach Anzahl und Größe der betroffenen Räume.",
        excludes: ["heizung_total", "heizung_unzureichend"],
      },
      {
        id: "heizung_unzureichend",
        label: "Heizung wärmt unzureichend",
        minderung_min: 5,
        minderung_max: 30,
        minderung_typical: 15,
        description:
          "Die Raumtemperatur bleibt tagsüber (ca. 6–23 Uhr) in Wohnräumen unter 20 °C, obwohl die Heizung läuft. Nachts ist eine Absenkung auf etwa 18 °C zulässig.",
        excludes: ["heizung_total", "heizung_teilweise"],
      },
      {
        id: "warmwasser_total",
        label: "Warmwasserausfall (komplett)",
        minderung_min: 10,
        minderung_max: 30,
        minderung_typical: 15,
        description:
          "Kein warmes Wasser in der gesamten Wohnung verfügbar. Im Winter fällt die Minderung höher aus als im Sommer.",
      },
      {
        id: "warmwasser_vorlauf",
        label: "Warmwasser erst nach langer Vorlaufzeit",
        minderung_min: 3,
        minderung_max: 10,
        minderung_typical: 5,
        description:
          "Warmes Wasser (ca. 40–45 °C) kommt erst nach mehr als etwa 10 Sekunden bzw. nach mehr als 5 Litern Vorlauf. Je länger der Vorlauf, desto höher die Quote.",
      },
      {
        id: "heizung_geraeusche",
        label: "Heizung macht Geräusche",
        minderung_min: 5,
        minderung_max: 25,
        minderung_typical: 10,
        description:
          "Klopfen, Gurgeln oder andere störende Geräusche in Heizungsrohren. Betrifft der Lärm das Schlafzimmer und die Nachtruhe, steigt die Quote deutlich.",
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
        minderung_max: 15,
        minderung_typical: 10,
        description:
          "Oberflächlicher Schimmelbefall an einer kleinen Fläche in einem Raum. Kein Mangel, wenn er auf Wärmebrücken beruht, die dem Baustandard des Errichtungsjahres entsprechen.",
        excludes: ["schimmel_stark"],
      },
      {
        id: "schimmel_stark",
        label: "Schimmel in mehreren Räumen (stark)",
        minderung_min: 20,
        minderung_max: 80,
        minderung_typical: 35,
        description:
          "Großflächiger Schimmelbefall in mehreren Räumen der Wohnung. Quoten über 50 % setzen eine nachgewiesene Gesundheitsgefährdung oder faktische Unbewohnbarkeit voraus.",
        excludes: ["schimmel_leicht"],
      },
      {
        id: "feuchtigkeit_wand",
        label: "Feuchte Wände / Durchfeuchtung",
        minderung_min: 5,
        minderung_max: 30,
        minderung_typical: 12,
        description:
          "Feuchte Wände, nasse Flecken oder Durchfeuchtung in Wohnräumen. Einzelne Stockflecken liegen am unteren Rand, durchfeuchtete Wände mit bröckelndem Putz am oberen.",
      },
      {
        id: "wasserschaden",
        label: "Wasserschaden / Wassereinbruch",
        minderung_min: 10,
        minderung_max: 50,
        minderung_typical: 25,
        description:
          "Wasser dringt in die Wohnung ein, z.B. durch undichtes Dach oder Rohrbruch. Die Quote hängt vom Umfang und davon ab, ob betroffene Räume noch nutzbar sind.",
      },
      {
        id: "trocknungsgeraete",
        label: "Trocknungsgeräte nach Wasserschaden",
        minderung_min: 15,
        minderung_max: 100,
        minderung_typical: 40,
        description:
          "Laute Trocknungsgeräte stehen in der Wohnung und schränken die Nutzung ein. Maßgeblich sind Anzahl, Dezibelwert, Dauer und der Platzbedarf durch abgerückte Möbel.",
      },
      {
        id: "feuchter_keller",
        label: "Feuchter Keller",
        minderung_min: 3,
        minderung_max: 10,
        minderung_typical: 5,
        description:
          "Keller ist feucht oder nass (wenn Keller Teil der Mietsache ist). War die Feuchtigkeit bei Vertragsschluss bekannt, ist die Minderung nach § 536b BGB ausgeschlossen.",
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
        label: "Baulärm im eigenen Haus",
        minderung_min: 5,
        minderung_max: 60,
        minderung_typical: 20,
        description:
          "Erheblicher Baulärm durch Bauarbeiten im oder am eigenen Haus, etwa Dachgeschossausbau oder Sanierung. Bei energetischer Modernisierung ist die Minderung für drei Monate ausgeschlossen (§ 536 Abs. 1a BGB).",
        excludes: ["baulaerm_nachbar"],
      },
      {
        id: "baulaerm_nachbar",
        label: "Baulärm vom Nachbargrundstück",
        minderung_min: 0,
        minderung_max: 20,
        minderung_typical: 5,
        description:
          "Baulärm von einer Baustelle auf einem fremden Grundstück ist nach dem BGH regelmäßig KEIN Mangel. Eine Minderung kommt nur in Betracht, wenn der Mietvertrag etwas anderes vereinbart oder der Vermieter Ausgleichsansprüche nach § 906 BGB hat.",
        excludes: ["baulaerm_haus"],
      },
      {
        id: "strassenlaerm",
        label: "Erhöhter Straßenlärm (z.B. Baustelle)",
        minderung_min: 0,
        minderung_max: 15,
        minderung_typical: 8,
        description:
          "Nachträglich gestiegener Verkehrslärm ist kein Mangel, solange er für die Lage ortsüblich bleibt. Aussicht auf Erfolg besteht vor allem bei zeitlich begrenzten Straßenbauarbeiten direkt vor dem Haus.",
      },
      {
        id: "nachbarlaerm",
        label: "Dauerhafter Nachbarlärm",
        minderung_min: 5,
        minderung_max: 30,
        minderung_typical: 10,
        description:
          "Regelmäßige, ruhestörende Geräusche von Nachbarn über das Normalmaß hinaus. Kinderlärm aus der Nachbarwohnung ist im Grundsatz sozialadäquat hinzunehmen.",
      },
      {
        id: "gastronomie",
        label: "Lärm durch Gastronomie im Haus",
        minderung_min: 5,
        minderung_max: 40,
        minderung_typical: 20,
        description:
          "Lärm durch Kneipe, Restaurant oder Diskothek im Gebäude. War der Betrieb beim Einzug bereits vorhanden, ist die Minderung nach § 536b BGB meist ausgeschlossen; minderungsfähig ist vor allem eine nachträgliche Verschlechterung.",
      },
      {
        id: "aufzug_laerm",
        label: "Lärm durch Aufzug",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 7,
        description:
          "Ständiges Rattern, Summen oder Vibrationen durch den Aufzug. Maßstab ist die Einhaltung der Schallschutzwerte; der Nachweis erfordert meist ein Sachverständigengutachten.",
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
        minderung_max: 70,
        minderung_typical: 20,
        description:
          "Befall mit Kakerlaken oder Schaben in der Wohnung. Vereinzelte Tiere liegen am unteren Rand, täglich zweistellige Zahlen mit Tagaktivität am oberen.",
      },
      {
        id: "ratten",
        label: "Ratten in der Wohnung",
        minderung_min: 20,
        minderung_max: 80,
        minderung_typical: 40,
        description:
          "Ratten dringen in die Wohnräume ein oder Räume sind wegen der Bekämpfungsmaßnahmen gesperrt.",
        excludes: ["ratten_umfeld"],
      },
      {
        id: "ratten_umfeld",
        label: "Ratten in Keller, Hof oder Garten",
        minderung_min: 2,
        minderung_max: 20,
        minderung_typical: 10,
        description:
          "Ratten im Umfeld des Hauses, etwa an den Mülltonnen, im Hinterhof, Garten oder Keller, ohne dass sie in die Wohnung gelangen.",
        excludes: ["ratten"],
      },
      {
        id: "maeuse",
        label: "Mäusebefall",
        minderung_min: 10,
        minderung_max: 30,
        minderung_typical: 15,
        description:
          "Mäusebefall in der Wohnung, der wiederholte Einsätze eines Kammerjägers erforderlich macht.",
      },
      {
        id: "bettwanzen",
        label: "Bettwanzen",
        minderung_min: 20,
        minderung_max: 70,
        minderung_typical: 40,
        description:
          "Befall mit Bettwanzen in der Wohnung. Das Einschleppen über Gepäck oder gebrauchte Gegenstände gehört zum vertragsgemäßen Gebrauch und trifft den Mieter nicht als Verschulden.",
      },
      {
        id: "silberfische",
        label: "Silberfische (starker Befall)",
        minderung_min: 5,
        minderung_max: 20,
        minderung_typical: 15,
        description:
          "Starker Silberfischbefall, oft Hinweis auf Feuchtigkeitsprobleme. Als Mangel gelten sie erst ab etwa 10–15 Tieren täglich; vereinzelte Tiere in Bad oder Küche begründen keine Minderung.",
      },
      {
        id: "wespen",
        label: "Wespen-/Bienennest",
        minderung_min: 5,
        minderung_max: 20,
        minderung_typical: 10,
        description:
          "Wespen- oder Bienennest am Gebäude, das die Nutzung einschränkt. Der Vermieter trägt die Beseitigungskosten; Hornissen und Wildbienen sind nach § 44 BNatSchG geschützt und dürfen nicht ohne Genehmigung entfernt werden.",
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
        minderung_typical: 8,
        description:
          "Fenster sind undicht, es zieht in die Wohnung. Bei Altbauten ist leichte Zugluft teilweise als vertragsgemäß hinzunehmen.",
        excludes: ["fenster_schliessen"],
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
          "Fenster können nicht geschlossen werden: Sicherheitsrisiko und Wärmeverlust.",
        excludes: ["fenster_undicht"],
      },
      {
        id: "tuer_abschliessbar",
        label: "Wohnungstür nicht abschließbar",
        minderung_min: 3,
        minderung_max: 10,
        minderung_typical: 5,
        description:
          "Wohnungstür kann nicht abgeschlossen werden: Sicherheitsmangel. Ein Anspruch auf zusätzlichen Einbruchschutz besteht nicht.",
      },
      {
        id: "klingel_defekt",
        label: "Türklingel / Gegensprechanlage defekt",
        minderung_min: 1,
        minderung_max: 5,
        minderung_typical: 3,
        description:
          "Klingel oder Gegensprechanlage funktioniert nicht. In oberen Geschossen ohne Aufzug wiegt der Ausfall schwerer.",
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
        label: "Einzige Toilette nicht benutzbar",
        minderung_min: 20,
        minderung_max: 80,
        minderung_typical: 50,
        description:
          "Die einzige Toilette der Wohnung ist defekt und über längere Zeit nicht benutzbar.",
        excludes: ["toilette_zweit_wc"],
      },
      {
        id: "toilette_zweit_wc",
        label: "Toilette defekt (zweite Toilette vorhanden)",
        minderung_min: 3,
        minderung_max: 10,
        minderung_typical: 5,
        description:
          "Eine Toilette ist defekt, in der Wohnung steht aber eine zweite, problemlos nutzbare Toilette zur Verfügung.",
        excludes: ["toilette_defekt"],
      },
      {
        id: "dusche_defekt",
        label: "Dusche defekt (Badewanne vorhanden)",
        minderung_min: 3,
        minderung_max: 10,
        minderung_typical: 5,
        description:
          "Die Dusche funktioniert nicht, eine andere Waschmöglichkeit wie eine Badewanne ist aber vorhanden.",
        excludes: ["dusche_einzige"],
      },
      {
        id: "dusche_einzige",
        label: "Einzige Dusch-/Bademöglichkeit ausgefallen",
        minderung_min: 15,
        minderung_max: 35,
        minderung_typical: 25,
        description:
          "Die einzige Wasch- und Bademöglichkeit der Wohnung ist nicht nutzbar.",
        excludes: ["dusche_defekt"],
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
        minderung_min: 3,
        minderung_max: 10,
        minderung_typical: 5,
        description:
          "Innenliegendes Bad ohne Fenster, dessen Entlüftung nicht funktioniert. Bei einem Bad mit öffenbarem Fenster ist ein defekter Lüfter meist unerheblich.",
      },
      {
        id: "spuelung_defekt",
        label: "Toilettenspülung defekt",
        minderung_min: 3,
        minderung_max: 15,
        minderung_typical: 7,
        description:
          "Toilettenspülung funktioniert nicht oder nur mit so geringem Druck, dass nachgegossen werden muss.",
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
          "Herd oder Backofen funktioniert nicht. Nur ein Mangel, wenn das Gerät laut Mietvertrag mitvermietet ist; selbst eingebrachte Geräte begründen keine Minderung.",
        excludes: ["kueche_komplett"],
      },
      {
        id: "kuehlschrank_defekt",
        label: "Kühlschrank defekt",
        minderung_min: 2,
        minderung_max: 5,
        minderung_typical: 3,
        description:
          "Kühlschrank funktioniert nicht. Nur ein Mangel, wenn das Gerät laut Mietvertrag mitvermietet ist; selbst eingebrachte Geräte begründen keine Minderung.",
        excludes: ["kueche_komplett"],
      },
      {
        id: "spuelmaschine_defekt",
        label: "Spülmaschine defekt",
        minderung_min: 1,
        minderung_max: 3,
        minderung_typical: 2,
        description:
          "Spülmaschine funktioniert nicht. Als Komfortgerät wiegt der Ausfall gering; häufig ist die Erheblichkeitsschwelle gar nicht überschritten. Voraussetzung ist zudem, dass das Gerät mitvermietet ist.",
        excludes: ["kueche_komplett"],
      },
      {
        id: "kueche_komplett",
        label: "Küche komplett nicht nutzbar",
        minderung_min: 15,
        minderung_max: 60,
        minderung_typical: 30,
        description:
          "Die gesamte Küche ist nicht benutzbar (z.B. nach Wasserschaden). Eine Minderung auf 100 % kommt nur bei Unbewohnbarkeit der gesamten Wohnung in Betracht.",
        excludes: [
          "herd_defekt",
          "kuehlschrank_defekt",
          "spuelmaschine_defekt",
        ],
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
        minderung_min: 3,
        minderung_max: 20,
        minderung_typical: 10,
        description:
          "Vertraglich vereinbarter Aufzug funktioniert nicht. Die Quote hängt wesentlich vom Stockwerk und von der Ausfalldauer ab.",
        excludes: ["aufzug_hoch"],
      },
      {
        id: "aufzug_hoch",
        label: "Aufzug defekt (hohes Stockwerk)",
        minderung_min: 10,
        minderung_max: 25,
        minderung_typical: 18,
        description:
          "Aufzug defekt bei Wohnung in hohem Stockwerk. Eine Gehbehinderung erhöht die Quote nur, wenn sie ausdrücklich Vertragsinhalt geworden ist.",
        excludes: ["aufzug_defekt"],
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
        description:
          "Kein Strom in der gesamten Wohnung. Die Minderung gilt nur zeitanteilig für die Dauer des Ausfalls; Ausfälle von wenigen Stunden sind regelmäßig unerheblich.",
      },
      {
        id: "treppenhaus_licht",
        label: "Treppenhausbeleuchtung defekt",
        minderung_min: 1,
        minderung_max: 10,
        minderung_typical: 3,
        description: "Beleuchtung im Treppenhaus funktioniert nicht.",
      },
      {
        id: "internet_ausfall",
        label: "Internetausfall (wenn zur Mietsache)",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 7,
        description:
          "Ein Anschluss, der als Teil der Mietsache vereinbart wurde, fällt aus. Eine bloß langsame Verbindung begründet keine Minderung.",
      },
      {
        id: "kabel_defekt",
        label: "Kabelanschluss / TV defekt",
        minderung_min: 1,
        minderung_max: 10,
        minderung_typical: 3,
        description:
          "Kabelanschluss funktioniert nicht. Seit dem Wegfall des Nebenkostenprivilegs ist die TV-Versorgung in vielen Verträgen nicht mehr Teil der Mietsache; dann besteht kein Minderungsrecht.",
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
        label: "Wohnfläche kleiner als vereinbart",
        minderung_min: 0,
        minderung_max: 40,
        minderung_typical: 12,
        description:
          "Die tatsächliche Wohnfläche unterschreitet die vereinbarte Fläche. Ab mehr als 10 % Abweichung mindert sich die Miete genau um den Prozentsatz der Abweichung; bis einschließlich 10 % liegt kein Mangel vor.",
        berechnet: "wohnflaeche",
      },
      {
        id: "hitze_dach",
        label: "Sommerliche Überhitzung (Wärmeschutz-Mangel)",
        minderung_min: 0,
        minderung_max: 20,
        minderung_typical: 10,
        description:
          "Die Wohnung heizt sich im Sommer stark auf. Ein Mangel liegt nur vor, wenn das Gebäude beim sommerlichen Wärmeschutz nicht dem zur Bauzeit geltenden Stand der Technik entsprach. In Dachgeschoss- und Altbauwohnungen sind höhere Temperaturen hinzunehmen.",
      },
      {
        id: "undichtes_dach",
        label: "Undichtes Dach / undichte Decke",
        minderung_min: 10,
        minderung_max: 30,
        minderung_typical: 20,
        description:
          "Wasser dringt durch Dach oder Decke ein. Schon das Risiko künftigen Wassereintritts bei Starkregen wird anerkannt; aktiv tropfendes Wasser liegt am oberen Rand.",
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
          "Balkon nicht nutzbar, z.B. wegen Baugerüst oder Bauarbeiten. In den Wintermonaten fällt die Minderung deutlich geringer aus.",
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
        minderung_min: 2,
        minderung_max: 10,
        minderung_typical: 5,
        description:
          "Vertraglich vereinbarter Keller ist nicht nutzbar. Bei nur vorübergehender Sperrung liegt die Quote am unteren Rand.",
      },
      {
        id: "stellplatz_nicht_nutzbar",
        label: "Stellplatz / Garage nicht nutzbar",
        minderung_min: 0,
        minderung_max: 10,
        minderung_typical: 4,
        description:
          "Stellplatz oder Garage kann nicht genutzt werden. Achtung: Bei einem getrennten Stellplatz-Mietvertrag mindert sich nur die Stellplatzmiete, nicht die Wohnungsmiete. Wird ein zumutbarer Ersatzstellplatz gestellt, entfällt die Minderung.",
      },
      {
        id: "baugeruest",
        label: "Baugerüst vor dem Fenster",
        minderung_min: 0,
        minderung_max: 10,
        minderung_typical: 5,
        description:
          "Baugerüst schränkt Lichteinfall ein und stellt Einbruchsgefahr dar. Diese Quote gilt für das Gerüst allein; Baulärm ist separat zu berücksichtigen. Werden nur Nebenräume verdunkelt, liegt kein Mangel vor.",
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
        label: "Asbest beschädigt / Faserfreisetzung",
        minderung_min: 10,
        minderung_max: 50,
        minderung_typical: 20,
        description:
          "Asbesthaltige Bauteile sind beschädigt oder es besteht die Gefahr der Faserfreisetzung, etwa bei gebrochenen Platten oder asbesthaltigen Nachtspeicheröfen. Ein Nachweis grenzwertüberschreitender Raumluftbelastung ist nicht erforderlich.",
        excludes: ["asbest_gebunden"],
      },
      {
        id: "asbest_gebunden",
        label: "Asbest fest gebunden und unbeschädigt",
        minderung_min: 0,
        minderung_max: 10,
        minderung_typical: 5,
        description:
          "Fest gebundener, unbeschädigter Asbest, z.B. intakte Vinyl-Asbest-Platten. Das bloße Vorhandensein begründet regelmäßig KEINEN Mangel; erforderlich ist eine begründete Gefahrenbesorgnis.",
        excludes: ["asbest"],
      },
      {
        id: "legionellen",
        label: "Legionellen im Trinkwasser",
        minderung_min: 10,
        minderung_max: 50,
        minderung_typical: 15,
        description:
          "Überschreitung des technischen Maßnahmenwerts von 100 KBE/100 ml. Bereits die Überschreitung begründet den Mangel; eine konkrete Erkrankung ist nicht erforderlich. Bei vollständigem Duschverbot liegt die Quote deutlich höher.",
      },
      {
        id: "bleirohre",
        label: "Bleirohre (Grenzwertüberschreitung)",
        minderung_min: 5,
        minderung_max: 10,
        minderung_typical: 8,
        description:
          "Bleirohre im Trinkwassersystem mit Überschreitung des Grenzwerts von 0,010 mg/l. Bleileitungen mussten nach der Trinkwasserverordnung bis Januar 2026 ersetzt sein.",
      },
      {
        id: "formaldehyd",
        label: "Formaldehyd-Belastung",
        minderung_min: 25,
        minderung_max: 56,
        minderung_typical: 30,
        description:
          "Erhöhte Formaldehydbelastung in der Wohnung. Maßstab ist der Innenraum-Richtwert von 0,1 mg/m³; die Quote steigt mit der gemessenen Konzentration.",
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
        minderung_min: 5,
        minderung_max: 25,
        minderung_typical: 10,
        description:
          "Abwassergeruch durch defekte Leitungen. Auch ein nur zeitweise auftretender Geruch rechtfertigt die Minderung für den gesamten Zeitraum.",
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
        minderung_max: 25,
        minderung_typical: 10,
        description:
          "Geruchsbelästigung durch Gastronomie oder Gewerbebetrieb. In Innenstadtlagen ist eine gastronomische Grundbelastung ortsüblich; minderungsfähig ist, was darüber hinausgeht. Nächtliche Belästigung erhöht die Quote.",
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
    question:
      "Kannten Sie den Mangel schon bei Vertragsschluss oder Wohnungsübernahme?",
    description:
      "Wer einen Mangel bei Vertragsschluss kennt, kann deswegen später nicht mindern (§ 536b Satz 1 BGB). Bei Übernahme trotz Kenntnis bleibt das Recht erhalten, wenn Sie sich Ihre Rechte vorbehalten haben (Satz 3). Hat der Vermieter den Mangel arglistig verschwiegen, bleiben Ihre Rechte in jedem Fall bestehen (Satz 2).",
    options: [
      {
        value: "nein",
        label: "Nein, ich habe den Mangel erst später entdeckt",
        eligible: true,
      },
      {
        value: "ja_vorbehalt",
        label: "Ja, aber ich habe mir meine Rechte vorbehalten",
        eligible: true,
      },
      {
        value: "ja_arglist",
        label: "Ja, aber der Vermieter hat den Mangel verschwiegen",
        eligible: true,
      },
      { value: "ja", label: "Ja, ohne Vorbehalt", eligible: null },
    ],
  },
  {
    id: "selbst_verursacht",
    question: "Haben Sie den Mangel selbst verursacht?",
    description:
      "Wenn der Mieter den Mangel selbst verursacht hat, entfällt das Minderungsrecht. Die Beweislast trägt allerdings der Vermieter: Er muss zunächst bauliche Ursachen ausschließen.",
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
      "Nur erhebliche Mängel berechtigen zur Mietminderung (§ 536 Abs. 1 Satz 3 BGB). Mehrere Bagatellmängel zusammen können die Schwelle allerdings überschreiten.",
    options: [
      {
        value: "stark",
        label: "Stark: Wohnqualität deutlich eingeschränkt",
        eligible: true,
      },
      {
        value: "mittel",
        label: "Mittel: spürbare Beeinträchtigung",
        eligible: true,
      },
      {
        value: "gering",
        label: "Gering: nur leichte Unannehmlichkeit",
        eligible: null,
      },
    ],
  },
  {
    id: "angezeigt",
    question: "Haben Sie den Mangel Ihrem Vermieter bereits gemeldet?",
    description:
      "Die Minderung tritt kraft Gesetzes ein, auch ohne Anzeige. Die Mängelanzeige ist aber entscheidend, um sie durchzusetzen (§ 536c BGB). Wir helfen Ihnen dabei, diese zu erstellen.",
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
      "Eine Mietminderung bedeutet, dass Sie als Mieter weniger Miete zahlen dürfen, wenn Ihre Wohnung Mängel hat, die die Wohnqualität beeinträchtigen. Dieses Recht ergibt sich automatisch aus § 536 BGB. Sie müssen keine Genehmigung beantragen. Die Miete ist von Gesetzes wegen gemindert, solange der Mangel besteht.",
  },
  {
    question: "Muss der Vermieter die Mietminderung genehmigen?",
    answer:
      "Nein! Die Mietminderung tritt kraft Gesetzes (automatisch) ein, sobald ein erheblicher Mangel vorliegt. Sie brauchen weder eine Zustimmung noch eine Erklärung. Die Mängelanzeige ist keine Voraussetzung dafür, dass die Minderung entsteht, wohl aber dafür, dass Sie sie durchsetzen und beweisen können.",
  },
  {
    question: "Wie berechne ich die Höhe der Mietminderung?",
    answer:
      "Die Mietminderung wird von der Bruttowarmmiete berechnet, also Kaltmiete plus alle Nebenkosten. Die Höhe richtet sich nach Art und Schwere des Mangels. Beispiel: Bei einer Bruttowarmmiete von 1.000 € und einer Minderungsquote von 20% zahlen Sie nur 800 €. Die Quote ergibt sich aus Gerichtsurteilen zu vergleichbaren Fällen.",
  },
  {
    question: "Was ist eine Mängelanzeige und warum brauche ich sie?",
    answer:
      "Die Mängelanzeige ist eine schriftliche Mitteilung an Ihren Vermieter, in der Sie den Mangel beschreiben und zur Beseitigung auffordern. § 536c Abs. 1 BGB verpflichtet Sie, Mängel unverzüglich anzuzeigen. Unterlassen Sie das, verlieren Sie das Minderungsrecht nur insoweit, als der Vermieter gerade wegen der fehlenden Anzeige nicht abhelfen konnte. Kannte er den Mangel ohnehin, entfällt die Anzeigepflicht. Wir helfen Ihnen, die Anzeige rechtssicher zu erstellen.",
  },
  {
    question: "Was passiert, wenn ich die Miete zu stark mindere?",
    answer:
      "Vorsicht, das Risiko beginnt früher als viele denken. Der Vermieter darf fristlos kündigen, wenn Sie an zwei aufeinanderfolgenden Terminen mit einem nicht unerheblichen Teil der Miete in Verzug sind (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a BGB). Nicht unerheblich bedeutet nach § 569 Abs. 3 Nr. 1 BGB bereits: mehr als eine Monatsmiete. Erst über einen längeren Zeitraum gilt die Schwelle von zwei Monatsmieten. Unsere Empfehlung: Zahlen Sie zunächst unter Vorbehalt die volle Miete und fordern Sie den Differenzbetrag später zurück.",
  },
  {
    question: "Kann der Vermieter die Mietminderung im Vertrag ausschließen?",
    answer:
      "Nein. Bei Wohnraummietverhältnissen ist das Recht auf Mietminderung nicht abdingbar (§ 536 Abs. 4 BGB). Klauseln im Mietvertrag, die das Minderungsrecht ausschließen, sind unwirksam.",
  },
  {
    question: "Ab wann kann ich die Miete mindern?",
    answer:
      "Die Minderung tritt bereits mit dem Auftreten des Mangels ein, nicht erst mit der Anzeige. Haben Sie in der Zwischenzeit die volle Miete gezahlt, können Sie den zu viel gezahlten Teil nach § 812 BGB zurückfordern. Das scheitert nur, wenn Sie positiv wussten, zur vollen Zahlung nicht verpflichtet zu sein (§ 814 BGB). Wer annahm, eine Minderung setze die Zustimmung des Vermieters voraus, hat diese Kenntnis gerade nicht.",
  },
  {
    question: "Muss ich bei Schimmel immer mindern dürfen?",
    answer:
      "Nicht unbedingt. Wenn der Schimmel durch Ihr eigenes Verhalten verursacht wurde (falsches Lüften/Heizen), entfällt das Minderungsrecht. Die Beweislast liegt zunächst beim Vermieter: Er muss bauliche Ursachen ausschließen. Kein Mangel liegt allerdings vor, wenn der Schimmel auf Wärmebrücken beruht und das Gebäude den zur Bauzeit geltenden Vorschriften entsprach.",
  },
  {
    question: "Wie lange gilt die Mietminderung?",
    answer:
      "Die Mietminderung gilt für den gesamten Zeitraum, in dem der Mangel besteht. Sobald der Mangel beseitigt ist, müssen Sie wieder die volle Miete zahlen. Es gibt keine zeitliche Obergrenze.",
  },
  {
    question: "Was bedeutet 'unter Vorbehalt zahlen'?",
    answer:
      "Wenn Sie die Miete 'unter Vorbehalt' zahlen, behalten Sie sich das Recht vor, zu viel gezahlte Miete zurückzufordern. Vermerken Sie im Überweisungszweck: 'Zahlung unter Vorbehalt wegen Mangel [Beschreibung]'. So schützen Sie sich vor einer fristlosen Kündigung und können die Differenz später zurückfordern. Der BGH weist Mieter selbst auf diesen Weg hin.",
  },
  {
    question: "Verliere ich mein Minderungsrecht, wenn ich lange nichts tue?",
    answer:
      "Der früher verbreitete Grundsatz, das Minderungsrecht sei nach etwa sechs Monaten vorbehaltloser Zahlung verwirkt, beruhte auf dem 2001 aufgehobenen § 539 BGB a.F. und gilt so nicht mehr. Eine Verwirkung nach § 242 BGB kommt nur in Ausnahmefällen in Betracht und setzt Zeit- und Umstandsmoment kumulativ voraus. Zeitnah handeln sollten Sie trotzdem, schon wegen der Beweislage und der dreijährigen Verjährung.",
  },
  {
    question: "Was ist bei energetischer Modernisierung?",
    answer:
      "Bei energetischen Modernisierungsmaßnahmen (z.B. Wärmedämmung) ist die Mietminderung für 3 Monate ausgeschlossen (§ 536 Abs. 1a BGB). Danach dürfen Sie mindern. Dies gilt nur für energetische Maßnahmen, nicht für allgemeine Modernisierungen.",
  },
  {
    question: "Rettet mich eine Nachzahlung, wenn ich zu viel gemindert habe?",
    answer:
      "Nur zur Hälfte. Zahlen Sie den Rückstand innerhalb von zwei Monaten nach Zustellung der Räumungsklage vollständig nach, wird die fristlose Kündigung unwirksam (Schonfristzahlung, § 569 Abs. 3 Nr. 2 BGB). Eine zugleich hilfsweise erklärte ordentliche Kündigung bleibt davon jedoch unberührt. In der Praxis kündigen Vermieter regelmäßig fristlos und hilfsweise ordentlich, sodass Sie die Wohnung trotz vollständiger Nachzahlung verlieren können.",
  },
];
