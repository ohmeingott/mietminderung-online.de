/**
 * SEO/landing-page content layered on top of the calculator data in
 * `maengel.ts`. Keyed by the existing category and defect IDs so the
 * calculator itself stays untouched.
 *
 * Content policy: statutory references (§§ BGB) are cited precisely; individual
 * court decisions are only referenced where the underlying research provides
 * them. Percentage ranges are described as orientation values from case law,
 * never as guaranteed outcomes.
 */

export interface KategorieSeo {
  slug: string;
  /** Short, keyword-led H1/title fragment. */
  titel: string;
  keywords: string[];
  intro: string;
  /** Second paragraph - category-specific legal framing. */
  rechtliches: string;
}

export interface MangelSeo {
  slug: string;
  /** Search-term variants used for meta keywords and the "auch bekannt als" line. */
  keywords: string[];
  /** 2–3 sentence unique opener. */
  intro: string;
  /** Typical signs that the defect is present. */
  symptome: string[];
  /** How to secure evidence for exactly this defect. */
  dokumentation: string[];
  /** A defect-specific legal or practical caveat. */
  hinweis: string;
  /** Recommended deadline (days) for the landlord to fix it. */
  fristTage: number;
  /** Urgent defects justify a short deadline and immediate action. */
  dringend?: boolean;
}

export const kategorieSeo: Record<string, KategorieSeo> = {
  heizung: {
    slug: "heizung-warmwasser",
    titel: "Heizung & Warmwasser",
    keywords: [
      "Mietminderung Heizung",
      "Heizungsausfall Mietminderung",
      "Mietminderung Warmwasser",
      "Heizung kalt Miete mindern",
    ],
    intro:
      "Ohne funktionierende Heizung und warmes Wasser ist eine Wohnung nicht das, wofür Sie Miete zahlen. Gerichte sehen das genauso: Kaum ein anderer Mangel wird so konsequent und mit so hohen Quoten anerkannt wie eine kalte Wohnung mitten in der Heizperiode.",
    rechtliches:
      "Die Heizperiode dauert nach gängiger Rechtsprechung vom 1. Oktober bis zum 30. April. In dieser Zeit müssen Wohnräume tagsüber auf etwa 20 bis 22 °C kommen. Schafft die Heizung das nicht, liegt ein Mangel nach § 536 Abs. 1 BGB vor. Ob den Vermieter daran eine Schuld trifft, spielt für die Minderung keine Rolle.",
  },
  feuchtigkeit: {
    slug: "feuchtigkeit-schimmel",
    titel: "Feuchtigkeit & Schimmel",
    keywords: [
      "Mietminderung Schimmel",
      "Schimmel Wohnung Miete mindern",
      "Mietminderung Feuchtigkeit",
      "Wasserschaden Mietminderung",
    ],
    intro:
      "Kein Wohnungsmangel wird in Deutschland häufiger gemeldet als Schimmel und Feuchtigkeit. Und es bleibt selten beim Ärger über fleckige Wände, denn Schimmelsporen können krank machen. Die Gerichte tragen dem mit vergleichsweise hohen Minderungsquoten Rechnung.",
    rechtliches:
      "Gestritten wird fast nie über den Schimmel selbst, sondern über seine Ursache. Für Sie als Mieter zählt dabei eine Regel: Behauptet der Vermieter, Sie hätten falsch gelüftet oder geheizt, muss er das beweisen. Vorher muss er ausschließen, dass Wärmebrücken, schlechte Dämmung oder aufsteigende Feuchtigkeit dahinterstecken.",
  },
  laerm: {
    slug: "laerm-ruhestoerung",
    titel: "Lärm & Ruhestörung",
    keywords: [
      "Mietminderung Lärm",
      "Baulärm Mietminderung",
      "Mietminderung Nachbarlärm",
      "Lärmprotokoll Mietminderung",
    ],
    intro:
      "Lärm beschädigt keine Wand und hinterlässt keine Flecken, trotzdem kann er eine Wohnung unbrauchbar machen. Juristen sprechen von einem Umweltmangel. Ob Sie mindern dürfen, hängt davon ab, ob die Belastung über das hinausgeht, was an Ihrem Wohnort üblich und sozial hinzunehmen ist.",
    rechtliches:
      "Wer in die Innenstadt zieht, kann den Straßenlärm, den es beim Einzug schon gab, später nicht als Mangel geltend machen. Auch spielende Kinder und normale Wohngeräusche gehören im Mehrfamilienhaus zum Alltag. Anders liegt der Fall, wenn sich die Lage nach dem Einzug deutlich verschlechtert, etwa weil vor dem Haus eine Baustelle aufmacht oder unter Ihnen ein Lokal einzieht. Dann brauchen Sie vor allem eines: ein lückenloses Lärmprotokoll. Ohne das gehen Lärmklagen vor Gericht regelmäßig verloren.",
  },
  ungeziefer: {
    slug: "ungeziefer-schaedlinge",
    titel: "Ungeziefer & Schädlinge",
    keywords: [
      "Mietminderung Ungeziefer",
      "Mietminderung Kakerlaken",
      "Mietminderung Ratten",
      "Bettwanzen Mietminderung",
    ],
    intro:
      "Eine einzelne Spinne ist Natur, ein Kakerlakenbefall ist ein Mangel. Sobald sich Schädlinge in der Wohnung festgesetzt haben, muss der Vermieter handeln und auch den Kammerjäger bezahlen. Anders sieht es nur aus, wenn Sie den Befall selbst verursacht haben.",
    rechtliches:
      "Es kommt auf das Ausmaß an. Eine Maus, die sich einmal in den Keller verirrt, reicht für eine Minderung nicht aus. Bei einem nachgewiesenen Befall haben Sie dafür gleich zwei Ansprüche nebeneinander: die Minderung und die Beseitigung nach § 535 Abs. 1 Satz 2 BGB.",
  },
  fenster_tueren: {
    slug: "fenster-tueren",
    titel: "Fenster & Türen",
    keywords: [
      "Mietminderung undichte Fenster",
      "Mietminderung Fenster defekt",
      "Wohnungstür defekt Mietminderung",
      "Zugluft Mietminderung",
    ],
    intro:
      "Durch undichte Fenster entweicht Heizwärme, durch eine defekte Wohnungstür im Zweifel noch mehr. Dazu kommt: Kaputte Fenster ziehen oft weitere Mängel nach sich, vom Schimmel in der Laibung bis zur Wohnung, die einfach nicht mehr warm wird.",
    rechtliches:
      "Fenster und Türen müssen sich normal benutzen lassen, das schuldet der Vermieter. Auf das Alter des Hauses kann er sich dabei nicht zurückziehen; auch ein Altbaufenster muss schließen. Geht es um die Sicherheit, etwa bei einer Wohnungstür ohne funktionierendes Schloss, fallen die Quoten deutlich höher aus als bei reinen Komfortproblemen.",
  },
  bad_sanitaer: {
    slug: "bad-sanitaer",
    titel: "Bad & Sanitär",
    keywords: [
      "Mietminderung Bad",
      "Mietminderung Toilette defekt",
      "Mietminderung Dusche",
      "Wasserdruck zu niedrig Mietminderung",
    ],
    intro:
      "Ohne Bad und WC ist eine Wohnung nicht bewohnbar. Entsprechend streng urteilen Gerichte, wenn die einzige Toilette oder die Dusche ausfällt. Am anderen Ende der Skala stehen Kleinigkeiten wie ein tropfender Hahn, die oft gar keine Minderung rechtfertigen.",
    rechtliches:
      "Die wichtigste Frage lautet meist: Gibt es einen zumutbaren Ersatz? Wer neben der defekten Dusche eine funktionierende Badewanne hat, kann deutlich weniger mindern als jemand, der gar nicht mehr duschen kann. Ein einzelner tropfender Wasserhahn gilt in aller Regel als unerheblicher Mangel im Sinne von § 536 Abs. 1 Satz 3 BGB.",
  },
  kueche: {
    slug: "kueche-geraete",
    titel: "Küche & Geräte",
    keywords: [
      "Mietminderung Küche",
      "Mietminderung Herd defekt",
      "Einbauküche defekt Mietminderung",
      "Kühlschrank defekt Miete mindern",
    ],
    intro:
      "Bei Küchengeräten entscheidet der Mietvertrag. Der Vermieter muss instand halten, was er mitvermietet hat, und nur das. Steht die Einbauküche im Vertrag oder im Übergabeprotokoll, ist ihr Defekt sein Problem. Haben Sie die Küche selbst eingebaut, gibt es keine Minderung.",
    rechtliches:
      "Werfen Sie also zuerst einen Blick in Mietvertrag und Übergabeprotokoll. Für alles, was dort als Teil der Mietsache auftaucht, schuldet der Vermieter die Funktionsfähigkeit (§ 535 Abs. 1 Satz 2 BGB). Eine Kleinreparaturklausel kann Sie zwar an Reparaturkosten beteiligen, Ihr Minderungsrecht nimmt sie Ihnen nicht.",
  },
  aufzug: {
    slug: "aufzug",
    titel: "Aufzug",
    keywords: [
      "Mietminderung Aufzug defekt",
      "Fahrstuhl kaputt Mietminderung",
      "Aufzug Ausfall Miete mindern",
    ],
    intro:
      "Wer eine Wohnung im fünften Stock mit Aufzug mietet, mietet den Aufzug mit. Steht er länger still, kommt es für die Höhe der Minderung vor allem darauf an, in welcher Etage Sie wohnen und wie gut Sie zu Fuß sind.",
    rechtliches:
      "Die Faustregel der Gerichte: je höher die Wohnung, desto höher die Quote. Wer gehbehindert ist, hochbetagt oder mit kleinen Kindern unterwegs, kann noch einmal deutlich mehr ansetzen. Umgekehrt gilt aber auch: Einen Wartungsstopp von ein paar Stunden müssen Sie hinnehmen.",
  },
  elektrik: {
    slug: "elektrik-technik",
    titel: "Elektrik & Technik",
    keywords: [
      "Mietminderung Stromausfall",
      "Mietminderung Elektrik",
      "Internetausfall Mietminderung",
      "Treppenhausbeleuchtung defekt",
    ],
    intro:
      "Am Strom hängt in der Wohnung fast alles, vom Licht über den Kühlschrank bis zur Heizungssteuerung. Fällt er komplett aus, kann die Miete bis auf null sinken. Eine einzelne tote Steckdose bleibt dagegen meist unter der Bagatellgrenze.",
    rechtliches:
      "Bei Internet, Kabelfernsehen oder Gegensprechanlage hängt alles davon ab, ob der Anschluss vertraglich zur Mietsache gehört. Und wie so oft im Mietrecht zählt Sicherheit mehr als Komfort: Ein wochenlang dunkles Treppenhaus wiegt schwerer als ein gestörter Fernsehempfang.",
  },
  wohnflaeche: {
    slug: "wohnflaeche-raumqualitaet",
    titel: "Wohnfläche & Raumqualität",
    keywords: [
      "Mietminderung Wohnfläche zu klein",
      "Wohnflächenabweichung Mietminderung",
      "Mietminderung Hitze Dachgeschoss",
      "undichtes Dach Mietminderung",
    ],
    intro:
      "Steht im Mietvertrag mehr Fläche, als die Wohnung tatsächlich hat, zahlen Sie Monat für Monat für Quadratmeter, die es gar nicht gibt. Immerhin: Kaum ein anderer Mangel lässt sich so exakt beziffern. Hier wird schlicht nachgemessen und umgerechnet.",
    rechtliches:
      "Bei der Wohnfläche zieht der BGH die Grenze in ständiger Rechtsprechung bei zehn Prozent. Weicht die tatsächliche Fläche um mehr als zehn Prozent nach unten ab, liegt ein erheblicher Mangel vor, und die Miete mindert sich genau im Verhältnis der Abweichung; auf eine konkrete Nutzungseinschränkung kommt es dann nicht mehr an. Bleibt die Abweichung bei zehn Prozent oder darunter, gilt sie als unerhebliche Beeinträchtigung nach § 536 Abs. 1 Satz 3 BGB, und eine Minderung scheidet aus. Nicht verwechseln: Für Mieterhöhungen hat der BGH die Zehn-Prozent-Regel 2015 aufgegeben, für die Minderung gilt sie unverändert fort.",
  },
  balkon_aussen: {
    slug: "balkon-terrasse-garten",
    titel: "Balkon, Terrasse & Außenbereiche",
    keywords: [
      "Mietminderung Balkon",
      "Mietminderung Terrasse nicht nutzbar",
      "Keller nicht nutzbar Mietminderung",
      "Stellplatz Mietminderung",
    ],
    intro:
      "Balkon, Terrasse, Kellerabteil, Stellplatz: Was im Mietvertrag steht oder bei Einzug übergeben wurde, gehört zur Mietsache dazu. Können Sie diese Flächen nicht nutzen, dürfen Sie die Gesamtmiete mindern.",
    rechtliches:
      "Bei Außenflächen rechnen Gerichte mit dem Kalender. Ein gesperrter Balkon im Juli wiegt erheblich schwerer als derselbe Balkon im Januar. Beim Stellplatz kommt es auf den Vertrag an: Zahlen Sie dafür eine eigene Miete, mindern Sie diesen Betrag und nicht die Wohnungsmiete.",
  },
  gesundheit: {
    slug: "gesundheitsgefahren",
    titel: "Gesundheitsgefahren",
    keywords: [
      "Mietminderung Asbest",
      "Mietminderung Legionellen",
      "Schadstoffe Wohnung Mietminderung",
      "Bleirohre Trinkwasser Mietminderung",
    ],
    intro:
      "Asbest, Legionellen, Blei im Trinkwasser: Wenn die Wohnung krank machen kann, geht es um mehr als Wohnkomfort. Neben der Minderung stehen dann regelmäßig Schadensersatz und im Ernstfall die fristlose Kündigung nach § 569 Abs. 1 BGB im Raum.",
    rechtliches:
      "Ausschlaggebend ist, ob Grenzwerte überschritten werden, bei Legionellen und Blei etwa die der Trinkwasserverordnung. Eine bloß gefühlte Gefahr genügt nicht, deshalb führt an einem Messprotokoll oder Gutachten praktisch kein Weg vorbei. Bei akuter Gesundheitsgefahr gehört außerdem sofort das Gesundheitsamt ins Boot.",
  },
  gerueche: {
    slug: "geruchsbelaestigung",
    titel: "Geruchsbelästigung",
    keywords: [
      "Mietminderung Geruch",
      "Mietminderung Abwassergeruch",
      "Müllgeruch Mietminderung",
      "Gestank Wohnung Miete mindern",
    ],
    intro:
      "Gestank sieht man nicht, und genau das macht ihn juristisch unbequem: Der Nachweis fällt schwerer als bei einem Schimmelfleck. In der Sache gilt dasselbe wie beim Lärm. Erst wenn die Belastung das ortsübliche Maß übersteigt, liegt ein Mangel vor.",
    rechtliches:
      "Ihr wichtigstes Werkzeug ist ein Geruchsprotokoll mit Datum, Uhrzeit, Dauer und Intensität, dazu Zeugen. Dass es mittags kurz nach dem Essen der Nachbarn riecht, müssen Sie hinnehmen. Dauerhafter Abwasser- oder Müllgeruch dagegen ist ein Mangel.",
  },
};

export const mangelSeo: Record<string, MangelSeo> = {
  /* ---------------------------- Heizung ---------------------------- */
  heizung_total: {
    slug: "heizungsausfall",
    keywords: [
      "Mietminderung Heizungsausfall",
      "Heizung kaputt Mietminderung",
      "Wohnung kalt Miete mindern",
      "Heizung fällt aus wie viel Prozent",
    ],
    intro:
      "Es gibt kaum einen schwereren Mangel als eine Heizung, die mitten im Winter komplett ausfällt. Geschuldet sind tagsüber 20 bis 22 °C in Wohnräumen; sackt die Wohnung deutlich darunter, lässt sich dort nicht mehr vernünftig leben. Gerichte haben in Extremfällen die volle Minderung zugesprochen, also 100 Prozent. Der Regelfall liegt allerdings darunter, und die Quote hängt stark vom Monat ab: Im Dezember wiegt derselbe Ausfall deutlich schwerer als im April.",
    symptome: [
      "Alle Heizkörper bleiben kalt, auch nach vollständigem Aufdrehen",
      "Raumtemperatur sackt tagsüber deutlich unter 18 °C, teils unter 15 °C",
      "Kein Warmwasser, wenn Heizung und Warmwasser über dieselbe Anlage laufen",
      "Feuchte, beschlagene Fenster und beginnende Schimmelbildung an Außenwänden",
    ],
    dokumentation: [
      "Temperaturprotokoll führen: mindestens dreimal täglich messen, in Raummitte und etwa einen Meter über dem Boden",
      "Thermometer zusammen mit einer Tageszeitung oder dem Handy-Datum fotografieren",
      "Alle Anrufe und Nachrichten an Vermieter oder Hausverwaltung mit Datum notieren",
      "Nachbarn als Zeugen benennen, wenn das ganze Haus betroffen ist",
    ],
    hinweis:
      "Ein Heizungsausfall im Winter ist ein Notfall, behandeln Sie ihn auch so. Setzen Sie eine sehr kurze Frist und schreiben Sie den Hinweis auf die Gesundheitsgefahr ausdrücklich dazu. Tut sich dann immer noch nichts, dürfen Sie nach § 536a Abs. 2 BGB selbst handeln, zum Beispiel Heizlüfter anschaffen, und die Kosten vom Vermieter zurückverlangen.",
    fristTage: 3,
    dringend: true,
  },
  heizung_teilweise: {
    slug: "heizungsausfall-einzelne-raeume",
    keywords: [
      "Mietminderung Heizkörper defekt",
      "Heizung einzelner Raum kalt",
      "Schlafzimmer wird nicht warm Mietminderung",
    ],
    intro:
      "Wenn nur einzelne Räume kalt bleiben, fragt das Gericht zuerst: Welcher Raum ist es? Ein Schlafzimmer, in dem niemand mehr schlafen mag, zählt erheblich mehr als ein kalter Abstellraum. Danach richtet sich die Höhe der Minderung.",
    symptome: [
      "Einzelne Heizkörper bleiben kalt, während andere warm werden",
      "Gluckernde Geräusche als Hinweis auf Luft im System",
      "Deutliches Temperaturgefälle zwischen den Zimmern",
      "Betroffener Raum ist dauerhaft nicht nutzbar",
    ],
    dokumentation: [
      "Für jeden betroffenen Raum ein eigenes Temperaturprotokoll führen",
      "Grundriss oder Skizze mit Angabe der betroffenen Räume und deren Größe beilegen",
      "Notieren, welcher Anteil der Wohnfläche nicht nutzbar ist",
      "Fotos der Thermostate in geöffneter Stellung machen",
    ],
    hinweis:
      "Schreiben Sie in die Mängelanzeige konkret hinein, welche Räume betroffen sind und wie groß sie sind. Kommt es zum Streit über die Quote, wird genau mit diesen Quadratmetern gerechnet.",
    fristTage: 7,
    dringend: true,
  },
  heizung_unzureichend: {
    slug: "heizung-waermt-nicht",
    keywords: [
      "Heizung wird nicht richtig warm",
      "Mietminderung zu kalte Wohnung",
      "Mindesttemperatur Mietwohnung",
    ],
    intro:
      "Die Heizung läuft, aber richtig warm wird es trotzdem nie? Auch das ist ein Mangel. Der Vermieter schuldet in Wohnräumen tagsüber etwa 20 bis 22 °C. Werden die dauerhaft verfehlt, hilft es ihm nicht, dass die Heizkörper immerhin lauwarm sind.",
    symptome: [
      "Raumtemperatur bleibt trotz voll aufgedrehter Thermostate unter 20 °C",
      "Heizkörper werden nur handwarm statt heiß",
      "Wohnung kühlt nachts stark aus und erwärmt sich tagsüber kaum",
      "Erhöhter Heizaufwand ohne spürbares Ergebnis",
    ],
    dokumentation: [
      "Über mindestens zwei Wochen morgens, mittags und abends messen und protokollieren",
      "Außentemperatur mitnotieren, denn sie ist für die Bewertung relevant",
      "Thermostatstellung fotografieren, um Bedienfehler auszuschließen",
      "Bei Nachtabsenkung: prüfen und dokumentieren, ab wann die Temperatur wieder steigt",
    ],
    hinweis:
      "Ein Hinweis zum Messen: Nachts darf die Anlage auf etwa 18 °C absenken, das ist zwischen 23 und 6 Uhr zulässig und kein Mangel. Wer nur nachts misst, liefert dem Vermieter also selbst das Gegenargument. Messen Sie deshalb vor allem tagsüber.",
    fristTage: 10,
  },
  warmwasser_total: {
    slug: "warmwasserausfall",
    keywords: [
      "Mietminderung kein warmes Wasser",
      "Warmwasser Ausfall Mietminderung",
      "kalt duschen Miete mindern",
    ],
    intro:
      "Für warmes Wasser gibt es keine Saison. Der Vermieter schuldet es das ganze Jahr über, rund um die Uhr, und zwar mit mindestens 40 bis 50 °C an der Zapfstelle. Fällt es komplett aus, ist das immer ein erheblicher Mangel, im August genauso wie im Januar.",
    symptome: [
      "An keiner Zapfstelle kommt warmes Wasser an",
      "Wassertemperatur bleibt dauerhaft unter 40 °C",
      "Warmwasser fällt in unregelmäßigen Abständen aus",
      "Duschen und Baden ist nicht oder nur unzumutbar möglich",
    ],
    dokumentation: [
      "Wassertemperatur mit einem Küchenthermometer am Hahn messen und protokollieren",
      "Ausfallzeiten mit Datum und Uhrzeit notieren",
      "Foto vom Thermometer im laufenden Wasserstrahl machen",
      "Ausfall sofort schriftlich melden, denn die Minderung wirkt erst ab Kenntnis des Vermieters",
    ],
    hinweis:
      "Bei der Höhe kommt es vor allem auf die Dauer an. Ein paar Stunden ohne warmes Wasser müssen Sie aushalten. Zieht sich der Ausfall über Tage oder gar Wochen, landen die anerkannten Quoten am oberen Ende der Spanne.",
    fristTage: 5,
    dringend: true,
  },
  warmwasser_vorlauf: {
    slug: "warmwasser-lange-vorlaufzeit",
    keywords: [
      "Warmwasser dauert zu lange",
      "Mietminderung Vorlaufzeit Warmwasser",
      "Wasser wird erst nach Minuten warm",
    ],
    intro:
      "Minutenlang den Hahn laufen lassen, bis endlich warmes Wasser kommt? Das klingt nach Kleinigkeit, ist aber ein Mangel. Zumutbar sind nur wenige Sekunden Vorlauf. Und das ungenutzt weglaufende Wasser bezahlen Sie über die Nebenkosten auch noch selbst.",
    symptome: [
      "Warmes Wasser kommt erst nach mehreren Minuten Laufzeit",
      "Deutlich erhöhter Wasserverbrauch in der Nebenkostenabrechnung",
      "Temperatur schwankt während des Duschens stark",
      "Problem tritt an mehreren Zapfstellen auf",
    ],
    dokumentation: [
      "Vorlaufzeit mit einer Stoppuhr an jeder Zapfstelle messen und notieren",
      "Video aufnehmen, das Stoppuhr und Thermometer gleichzeitig zeigt",
      "Verbrauchswerte aus alten und aktuellen Nebenkostenabrechnungen vergleichen",
      "Mehrfach zu verschiedenen Tageszeiten messen",
    ],
    hinweis:
      "Viel Prozent bringt dieser Mangel für sich allein nicht. Dafür ist er leicht nachzuweisen und besteht dauerhaft. Am meisten lohnt er sich als Posten in einer Mängelanzeige, die noch weitere Mängel auflistet.",
    fristTage: 21,
  },
  heizung_geraeusche: {
    slug: "heizung-macht-geraeusche",
    keywords: [
      "Heizung gluckert Mietminderung",
      "Heizung klopft nachts",
      "Mietminderung Heizungsgeräusche",
    ],
    intro:
      "Eine Heizung, die nachts klopft, gluckert oder pfeift, raubt einem zuverlässig den Schlaf. Solche Dauergeräusche sind kein bloßes Ärgernis: Gerichte behandeln sie als eigenen Mangel und sprechen dafür durchaus spürbare Quoten zu.",
    symptome: [
      "Regelmäßiges Klopfen oder Knacken beim Aufheizen",
      "Gluckern durch Luft im Heizsystem",
      "Pfeifen oder Rauschen an den Thermostatventilen",
      "Geräusche treten vor allem nachts oder in den frühen Morgenstunden auf",
    ],
    dokumentation: [
      "Geräuschprotokoll mit Datum, Uhrzeit, Dauer und Art des Geräuschs führen",
      "Tonaufnahmen mit dem Smartphone anfertigen, Uhrzeit im Video sichtbar machen",
      "Vermerken, ob das Entlüften der Heizkörper bereits erfolglos versucht wurde",
      "Nachbarn fragen und als Zeugen benennen, wenn diese ebenfalls betroffen sind",
    ],
    hinweis:
      "Verlangen Sie als Erstes eine fachgerechte Entlüftung und einen hydraulischen Abgleich. Bringt beides nachweislich nichts, steht Ihre Minderung auf deutlich festerem Boden, weil der einfache Ausweg dann bereits abgehakt ist.",
    fristTage: 14,
  },

  /* ------------------------- Feuchtigkeit -------------------------- */
  schimmel_leicht: {
    slug: "schimmel-ein-raum",
    keywords: [
      "Mietminderung Schimmel wie viel Prozent",
      "Schimmel Schlafzimmer Mietminderung",
      "leichter Schimmelbefall Miete mindern",
    ],
    intro:
      "„Das bisschen Schimmel“ gibt es nicht. Auch ein kleiner Fleck an der Wand ist ein Mangel und kein Schönheitsfehler, den Sie hinnehmen müssten. Die Sporen belasten die Raumluft, und wer einen Befall nicht behandeln lässt, sieht ihn fast immer wachsen.",
    symptome: [
      "Dunkle oder grünliche Flecken an Wand, Decke oder Fensterlaibung",
      "Muffiger, erdiger Geruch besonders in Ecken und hinter Möbeln",
      "Feuchte Stellen an Außenwänden oder in Raumecken",
      "Tapete oder Silikonfugen lösen sich oder verfärben sich",
    ],
    dokumentation: [
      "Befall vor der Entfernung fotografieren, mit Zollstock oder Lineal als Größenreferenz",
      "Betroffene Fläche in Quadratzentimetern angeben",
      "Luftfeuchtigkeit mit einem Hygrometer messen und über mehrere Tage protokollieren",
      "Lüftungsverhalten dokumentieren: Stoßlüften morgens und abends notieren",
    ],
    hinweis:
      "So verständlich der Impuls ist: Wischen Sie den Schimmel nicht restlos weg, bevor der Vermieter ihn gesehen hat oder Fotos existieren. Sonst steht am Ende Ihr Wort gegen seins. Und zur Ursache gilt: Der Vermieter muss beweisen, dass Ihr Lüften schuld war, nicht Sie das Gegenteil.",
    fristTage: 14,
  },
  schimmel_stark: {
    slug: "schimmel-mehrere-raeume",
    keywords: [
      "starker Schimmelbefall Mietminderung",
      "Schimmel ganze Wohnung Miete mindern",
      "Mietminderung Schimmel 50 Prozent",
    ],
    intro:
      "Wenn der Schimmel sich über mehrere Räume ausgebreitet hat, geht es längst um die Gesundheit. Gerichte haben in solchen Fällen die halbe Bruttowarmmiete als Minderung anerkannt, in Extremfällen auch deutlich mehr.",
    symptome: [
      "Befall an mehreren Wänden oder in mehreren Zimmern",
      "Schimmel hinter Möbeln, in Schränken oder auf Textilien",
      "Anhaltender modriger Geruch in der ganzen Wohnung",
      "Gesundheitliche Beschwerden wie Husten, Atemwegsreizungen oder Allergien",
    ],
    dokumentation: [
      "Alle betroffenen Stellen einzeln und mit Raumzuordnung fotografieren",
      "Gesamte befallene Fläche je Raum abschätzen und auflisten",
      "Ärztliche Atteste sammeln, wenn gesundheitliche Beschwerden aufgetreten sind",
      "Ein Sachverständigengutachten zur Ursache erwägen, denn im Streitfall ist es das stärkste Beweismittel",
    ],
    hinweis:
      "Bei massivem Befall kommt über die Minderung hinaus eine fristlose Kündigung wegen Gesundheitsgefährdung in Betracht (§ 569 Abs. 1 BGB). Dieser Schritt hat allerdings Folgen, die gut überlegt sein wollen. Sprechen Sie vorher mit dem Mieterverein oder einem Anwalt.",
    fristTage: 7,
    dringend: true,
  },
  feuchtigkeit_wand: {
    slug: "feuchte-waende",
    keywords: [
      "Mietminderung feuchte Wände",
      "Durchfeuchtung Wohnung Mietminderung",
      "nasse Wand Miete mindern",
    ],
    intro:
      "Eine feuchte Wand ist schon für sich genommen ein Mangel, nicht erst der Schimmel, der daraus wird. Die Ursache liegt meist im Gebäude selbst: aufsteigende Feuchtigkeit, eine undichte Leitung, eine fehlende Abdichtung. Dafür ist der Vermieter zuständig, nicht Sie.",
    symptome: [
      "Dunkle Flecken oder Ränder an Wänden, oft am Sockel",
      "Abplatzender Putz, Salzausblühungen oder sich lösende Tapete",
      "Wand fühlt sich beim Anfassen kühl und klamm an",
      "Erhöhte Luftfeuchtigkeit trotz regelmäßigem Lüften",
    ],
    dokumentation: [
      "Feuchtigkeit mit einem Baufeuchtemessgerät messen, einfache Geräte sind günstig",
      "Betroffene Flächen fotografieren und die Ausdehnung über Wochen dokumentieren",
      "Raumluftfeuchtigkeit mit einem Hygrometer protokollieren",
      "Datum des ersten Auftretens und die Entwicklung schriftlich festhalten",
    ],
    hinweis:
      "Warten Sie nicht ab. Solange nur die Wand feucht ist, bleibt die Quote überschaubar, mit dem ersten Schimmel steigt sie deutlich. Wer früh gemeldet hat, hat seinen Anspruch dann vom ersten Tag an gesichert und muss sich keine verspätete Anzeige vorhalten lassen.",
    fristTage: 14,
  },
  wasserschaden: {
    slug: "wasserschaden",
    keywords: [
      "Mietminderung Wasserschaden",
      "Rohrbruch Mietminderung",
      "Wassereinbruch Wohnung Miete mindern",
    ],
    intro:
      "Ein Rohrbruch fragt nicht nach einem passenden Zeitpunkt: Eben war die Wohnung noch in Ordnung, jetzt steht das Wasser im Flur. Für Ihr Minderungsrecht ist es übrigens egal, wer den Schaden verursacht hat. Es gilt auch, wenn das Rohr im Nachbarhaus geplatzt ist oder schlicht niemand etwas dafür kann.",
    symptome: [
      "Stehendes Wasser, durchnässte Böden oder Wände",
      "Wasserflecken an Decke oder Wand, tropfendes Wasser",
      "Aufgequollener Boden, sich wellendes Parkett oder Laminat",
      "Betroffene Räume sind nicht oder nur eingeschränkt nutzbar",
    ],
    dokumentation: [
      "Sofort umfassend fotografieren und filmen, bevor Trocknungsmaßnahmen beginnen",
      "Beschädigte Gegenstände einzeln auflisten und fotografieren",
      "Vermieter oder Hausverwaltung telefonisch UND schriftlich informieren",
      "Alle Handwerker- und Trocknungsberichte aufbewahren",
    ],
    hinweis:
      "Sie müssen dem Vermieter kein Verschulden nachweisen, die Minderung greift unabhängig davon. Nur eine Abgrenzung ist wichtig: Für Ihre eigenen Möbel und Ihren Hausrat kommt nicht die Minderung auf, sondern Ihre Hausratversicherung.",
    fristTage: 3,
    dringend: true,
  },
  trocknungsgeraete: {
    slug: "trocknungsgeraete",
    keywords: [
      "Mietminderung Trocknungsgeräte",
      "Bautrockner Lärm Mietminderung",
      "Trocknung nach Wasserschaden Miete mindern",
    ],
    intro:
      "Wer schon einmal wochenlang neben einem Bautrockner gelebt hat, weiß: Die Trocknung ist oft schlimmer als der Wasserschaden selbst. Die Geräte dröhnen Tag und Nacht, heizen die Räume auf und laufen über Ihren Stromzähler. Gerichte erkennen dafür hohe Quoten an, im Einzelfall bis zu 100 Prozent.",
    symptome: [
      "Dauerbetrieb lauter Trocknungsgeräte über Tage oder Wochen",
      "Erhebliche Lärm- und Wärmebelastung in den betroffenen Räumen",
      "Räume wegen Geräten und Kabeln nicht nutzbar, Möbel müssen weichen",
      "Deutlich erhöhter Stromverbrauch auf Kosten des Mieters",
    ],
    dokumentation: [
      "Aufstellungsdatum, Anzahl und Standort der Geräte notieren",
      "Lautstärke mit einer Schallpegel-App messen und die Werte protokollieren",
      "Zählerstand vor und nach der Trocknung fotografieren",
      "Fotos machen, die zeigen, welche Räume und Möbel unbenutzbar sind",
    ],
    hinweis:
      "Den Strom für die Trockner muss der Vermieter bezahlen, nicht Sie. Verlangen Sie die Erstattung ausdrücklich und zusätzlich zur Minderung. Ohne notierte Zählerstände lässt sich der Mehrverbrauch später allerdings kaum beziffern, also: vorher und nachher ablesen.",
    fristTage: 7,
    dringend: true,
  },
  feuchter_keller: {
    slug: "feuchter-keller",
    keywords: [
      "Mietminderung feuchter Keller",
      "Keller nass Mietminderung",
      "Kellerraum Feuchtigkeit Miete mindern",
    ],
    intro:
      "Das Kellerabteil gehört zur Mietsache, sobald es im Vertrag steht oder bei Einzug mit übergeben wurde. Wird es so feucht, dass Sie dort nichts mehr lagern können, dürfen Sie die Gesamtmiete mindern, nicht nur einen fiktiven Kelleranteil.",
    symptome: [
      "Feuchte oder nasse Kellerwände, Pfützen auf dem Boden",
      "Modriger Geruch im Kellerabteil",
      "Gelagerte Gegenstände werden feucht, schimmeln oder rosten",
      "Salzausblühungen oder abplatzender Putz an den Wänden",
    ],
    dokumentation: [
      "Feuchtigkeit im Keller mit einem Hygrometer über mehrere Wochen messen",
      "Wände und Boden fotografieren, beschädigte Lagergegenstände dokumentieren",
      "Im Mietvertrag nachweisen, dass der Keller mitvermietet ist",
      "Notieren, seit wann und bei welcher Witterung das Problem auftritt",
    ],
    hinweis:
      "Ganz trocken ist kaum ein Altbaukeller, ein gewisses Maß an Feuchte müssen Sie hinnehmen. Zum Mangel wird es erst, wenn Lagern praktisch nicht mehr geht. Am besten belegen Sie das mit dem, was bereits Schaden genommen hat: verschimmelte Kartons, rostige Werkzeuge, feuchte Möbel.",
    fristTage: 21,
  },

  /* ----------------------------- Lärm ------------------------------ */
  baulaerm_haus: {
    slug: "baulaerm",
    keywords: [
      "Mietminderung Baulärm",
      "Baustelle Mietminderung",
      "Sanierung im Haus Miete mindern",
    ],
    intro:
      "Kernsanierung über Ihrer Wohnung, Abrissbagger auf dem Nachbargrundstück: Baulärm zählt zu den häufigsten Gründen für eine Mietminderung. Die Frage ist immer, was sich seit Ihrem Einzug verändert hat. Eine Baustelle, die neu dazugekommen ist, ist ein Mangel. Eine, die bei Vertragsschluss schon sichtbar war, in aller Regel nicht.",
    symptome: [
      "Bohren, Hämmern, Fräsen oder Baumaschinenlärm über Wochen",
      "Erschütterungen, Staub und Schmutz in der Wohnung",
      "Arbeiten während der üblichen Ruhezeiten oder am Wochenende",
      "Homeoffice, Schlaf oder Erholung sind erheblich beeinträchtigt",
    ],
    dokumentation: [
      "Lärmprotokoll führen: Datum, Uhrzeit von/bis, Art des Lärms, Intensität, und das täglich und lückenlos",
      "Lautstärke mit einer Schallpegel-App messen und die Werte im Protokoll festhalten",
      "Video- und Tonaufnahmen mit sichtbarem Datum anfertigen",
      "Bauschild, Aushänge und Ankündigungsschreiben des Vermieters fotografieren",
    ],
    hinweis:
      "Beim Lärm steht und fällt alles mit dem Protokoll. „Es war ständig laut“ überzeugt kein Gericht; tägliche Einträge mit Uhrzeiten über Wochen hinweg schon. Machen Sie das Protokoll deshalb zur festen Routine, auch wenn es lästig ist.",
    fristTage: 14,
  },
  baulaerm_nachbar: {
    slug: "baulaerm-nachbargrundstueck",
    keywords: [
      "Mietminderung Baulärm Nachbargrundstück",
      "Baustelle nebenan Miete mindern",
      "Nachbarbaustelle Mietminderung",
      "Baulärm von nebenan kein Mangel",
    ],
    intro:
      "Hier lohnt sich ein nüchterner Blick, bevor Sie mindern. Lärm von einer Baustelle auf einem fremden Grundstück ist nach der Rechtsprechung des Bundesgerichtshofs im Regelfall kein Mangel Ihrer Wohnung. Der Grund ist einfach: Ihr Vermieter kann gegen die Baustelle nebenan nichts ausrichten und muss sie meist selbst entschädigungslos hinnehmen.",
    symptome: [
      "Bagger, Presslufthammer oder Kreissäge auf einem Grundstück, das nicht zum Mietobjekt gehört",
      "Staub und Erschütterungen, die von außen in die Wohnung dringen",
      "Arbeiten überwiegend werktags innerhalb der zulässigen Zeiten",
      "Der Vermieter hat mit der Baustelle nichts zu tun und keinen Einfluss darauf",
    ],
    dokumentation: [
      "Prüfen Sie zuerst den Mietvertrag: Wurde eine ruhige Lage oder Ähnliches ausdrücklich zugesagt?",
      "Bauschild fotografieren, um Bauherr und Bauzeitraum festzuhalten",
      "Lärmprotokoll mit Art, ungefährer Zeit, Dauer und Häufigkeit führen",
      "Klären, ob die Arbeiten die zulässigen Immissionsrichtwerte oder Bauzeiten überschreiten",
    ],
    hinweis:
      "Mindern Sie hier nicht vorschnell. Ohne eine Beschaffenheitsvereinbarung im Mietvertrag oder eine wesentliche Überschreitung im Sinne des § 906 BGB steht Ihnen in aller Regel nichts zu, und eine zu Unrecht einbehaltene Miete führt geradewegs in den Zahlungsverzug. Zahlen Sie im Zweifel unter Vorbehalt und lassen Sie die Frage klären.",
    fristTage: 14,
  },
  strassenlaerm: {
    slug: "strassenlaerm",
    keywords: [
      "Mietminderung Straßenlärm",
      "Baustelle vor dem Haus Mietminderung",
      "Verkehrslärm Miete mindern",
    ],
    intro:
      "Den Verkehrslärm, den es bei Ihrem Einzug schon gab, haben Sie rechtlich gesehen mitgemietet. Mindern können Sie erst, wenn es danach deutlich lauter geworden ist, etwa weil eine Baustelle eingerichtet wurde, eine Umleitung vor Ihrer Tür endet oder die Verkehrsführung geändert wurde.",
    symptome: [
      "Deutlich lauterer Verkehr als bei Einzug, etwa durch Umleitung",
      "Straßenbauarbeiten unmittelbar vor dem Haus",
      "Fenster können wegen des Lärms nicht mehr geöffnet werden",
      "Schlafstörungen durch nächtlichen Verkehrs- oder Baulärm",
    ],
    dokumentation: [
      "Lärmprotokoll mit Uhrzeit und Dauer der Belastung führen",
      "Dezibelwerte bei geöffnetem und geschlossenem Fenster messen",
      "Amtliche Ankündigungen zu Bauarbeiten oder Umleitungen sichern",
      "Falls möglich: Vergleichswerte aus der Zeit vor der Veränderung dokumentieren",
    ],
    hinweis:
      "Bauen Sie Ihre Mängelanzeige als Vorher-Nachher-Vergleich auf: So war es bei Einzug, das hat sich seitdem geändert. An genau dieser Gegenüberstellung wird Ihr Anspruch gemessen, also verwenden Sie darauf die meiste Sorgfalt.",
    fristTage: 14,
  },
  nachbarlaerm: {
    slug: "nachbarlaerm",
    keywords: [
      "Mietminderung Nachbarlärm",
      "laute Nachbarn Miete mindern",
      "Ruhestörung Mietminderung",
    ],
    intro:
      "Nicht jeder laute Nachbar ist ein Mangel. Schritte, spielende Kinder, ab und zu eine Feier: Das gehört zum Leben im Mehrfamilienhaus und muss ertragen werden. Anders sieht es aus, wenn der Lärm zum Dauerzustand wird und deutlich über das hinausgeht, was unter Nachbarn üblich ist.",
    symptome: [
      "Regelmäßiger Lärm während der Ruhezeiten (22–6 Uhr, oft auch mittags)",
      "Laute Musik, Streit oder Partys mehrmals pro Woche",
      "Dauerhaftes Poltern, Trampeln oder Hundegebell",
      "Schlafmangel und dauerhafte Belastung über Wochen",
    ],
    dokumentation: [
      "Detailliertes Lärmprotokoll über mindestens zwei bis vier Wochen führen",
      "Jeden Vorfall mit Datum, Uhrzeit von/bis und Art des Lärms erfassen",
      "Tonaufnahmen mit sichtbarem Zeitstempel anfertigen",
      "Andere betroffene Nachbarn als Zeugen benennen",
    ],
    hinweis:
      "Ihr Ansprechpartner ist der Vermieter, nicht der Nachbar. Er muss gegen störende Mieter vorgehen, notfalls mit Abmahnung und Kündigung. Wissen muss er davon allerdings nachweislich: Erst wenn er trotz Ihrer Meldung untätig bleibt, wird der Lärm zu einem Mangel, für den er geradesteht.",
    fristTage: 14,
  },
  gastronomie: {
    slug: "laerm-gastronomie",
    keywords: [
      "Mietminderung Gaststätte im Haus",
      "Kneipe unter der Wohnung Mietminderung",
      "Restaurant Lärm Miete mindern",
    ],
    intro:
      "Musik bis zwei Uhr nachts, Raucher vor der Tür, morgens die Flaschencontainer: Ein Lokal im Haus verändert das Wohnen gründlich. Hat der Betrieb erst nach Ihrem Einzug eröffnet, müssen Sie das nicht hinnehmen. Es ist ein klarer Mangel.",
    symptome: [
      "Musik- und Gästelärm bis in die Nachtstunden",
      "Lärm von rauchenden Gästen vor dem Haus",
      "Lüftungsanlage oder Kühlaggregate brummen dauerhaft",
      "Zusätzliche Geruchsbelästigung durch Küche oder Müll",
    ],
    dokumentation: [
      "Lärmprotokoll mit Schwerpunkt auf den Nachtstunden führen",
      "Schallpegel im Schlafzimmer bei geschlossenem Fenster messen",
      "Öffnungszeiten des Betriebs und etwaige Sondergenehmigungen dokumentieren",
      "Ton- und Videoaufnahmen mit Zeitstempel sichern",
    ],
    hinweis:
      "Es lohnt sich, zweigleisig zu fahren. Prüfen Sie, ob der Betrieb seine genehmigten Öffnungszeiten oder die Lärmrichtwerte überschreitet, und beschweren Sie sich gegebenenfalls beim Ordnungsamt. Was dort aktenkundig wird, können Sie später dem Vermieter vorlegen.",
    fristTage: 14,
  },
  aufzug_laerm: {
    slug: "aufzuglaerm",
    keywords: [
      "Mietminderung Aufzug Lärm",
      "Fahrstuhl laut Mietminderung",
      "Aufzugsgeräusche Wohnung",
    ],
    intro:
      "Wer direkt am Aufzugsschacht wohnt, hört jede einzelne Fahrt: das Anfahren, das Rumpeln, die Türen. Tagsüber lässt sich das ausblenden, nachts nicht. Überschreiten die Geräusche die Schallschutzrichtwerte, liegt ein Mangel vor.",
    symptome: [
      "Deutlich hörbares Rattern oder Quietschen bei jeder Fahrt",
      "Brummen des Antriebs oder Vibrationen in der Wand",
      "Laute Türgeräusche, die nachts wecken",
      "Geräusche haben nach einer Modernisierung zugenommen",
    ],
    dokumentation: [
      "Geräuschprotokoll mit Uhrzeiten führen, besonders nachts",
      "Tonaufnahmen anfertigen, die eine komplette Fahrt abbilden",
      "Vermerken, ob die Anlage kürzlich gewartet oder umgebaut wurde",
      "Schallpegel im angrenzenden Raum messen",
    ],
    hinweis:
      "Fordern Sie eine Wartung und die Überprüfung der Körperschallentkopplung, denn technisch lässt sich hier fast immer etwas machen. Genau das stärkt Ihre Position: Ein Vermieter, der eine machbare Lösung liegen lässt, kann sich schlecht auf Unvermeidbarkeit berufen.",
    fristTage: 21,
  },

  /* --------------------------- Ungeziefer -------------------------- */
  kakerlaken: {
    slug: "kakerlaken",
    keywords: [
      "Mietminderung Kakerlaken",
      "Schaben Wohnung Mietminderung",
      "Kakerlakenbefall Miete mindern",
    ],
    intro:
      "Bei Kakerlaken gibt es keine Diskussion um Bagatellen: Sie gelten als Hygieneschädlinge, der Befall ist meldepflichtig und immer ein erheblicher Mangel. Bei starkem Befall sind Gerichte weit über die üblichen Quoten hinausgegangen.",
    symptome: [
      "Sichtungen vor allem nachts in Küche und Bad",
      "Kotspuren, die wie feiner schwarzer Pfeffer aussehen",
      "Süßlich-muffiger Geruch bei starkem Befall",
      "Häutungsreste oder Eipakete hinter Geräten und in Ritzen",
    ],
    dokumentation: [
      "Tiere und Spuren fotografieren, mit Datum und Fundort",
      "Ein Fundprotokoll führen: Datum, Uhrzeit, Ort, Anzahl",
      "Klebefallen aufstellen und die Fänge dokumentieren",
      "Kammerjägerberichte und Behandlungsprotokolle aufbewahren",
    ],
    hinweis:
      "Den Kammerjäger bezahlt der Vermieter. Von Ihnen verlangt das Gesetz zweierlei: den Befall sofort melden und die Bekämpfung in der Wohnung zulassen. Wer dem Kammerjäger die Tür nicht öffnet, setzt sein Minderungsrecht aufs Spiel.",
    fristTage: 5,
    dringend: true,
  },
  ratten: {
    slug: "ratten",
    keywords: [
      "Mietminderung Ratten",
      "Ratten im Haus Mietminderung",
      "Rattenbefall Miete mindern",
    ],
    intro:
      "Ratten in der Wohnung sind mehr als ein Ekelthema. Die Tiere übertragen Krankheiten und nagen sich durch Leitungen und Bausubstanz. Dringen sie bis in die Wohnräume vor, ist das einer der schwersten Mängel überhaupt, und das Gesundheitsamt gehört von Anfang an mit an den Tisch.",
    symptome: [
      "Sichtungen in Wohnräumen, Küche oder Bad",
      "Kotspuren von etwa ein bis zwei Zentimetern Länge",
      "Nagespuren an Verpackungen, Kabeln oder Holz",
      "Nachts hörbares Rascheln und Trippeln in Wänden oder Decken",
    ],
    dokumentation: [
      "Kotspuren und Nagespuren fotografieren, Fundorte protokollieren",
      "Datum und Ort jeder Sichtung festhalten",
      "Meldung beim Gesundheitsamt vornehmen und die Bestätigung aufbewahren",
      "Beschädigte Lebensmittel oder Gegenstände dokumentieren",
    ],
    hinweis:
      "In den meisten Bundesländern müssen Ratten ohnehin gemeldet werden. Nutzen Sie das: Die Meldung beim Gesundheitsamt kostet nichts und verschafft Ihnen eine amtliche Bestätigung des Befalls. Ein besseres Beweismittel werden Sie nicht bekommen.",
    fristTage: 3,
    dringend: true,
  },
  ratten_umfeld: {
    slug: "ratten-keller-hof-garten",
    keywords: [
      "Mietminderung Ratten Hof",
      "Ratten Mülltonnen Mietminderung",
      "Ratten im Keller Miete mindern",
      "Ratten Garten Mietminderung",
    ],
    intro:
      "Ratten an den Mülltonnen oder im Hinterhof sind ein echter Mangel, werden von Gerichten aber deutlich niedriger bewertet als Tiere in der Wohnung selbst. Die Spanne ist groß: Sie reicht von wenigen Prozent für Sichtungen am Müllplatz bis zu rund 20 Prozent, wenn Keller und Garten dauerhaft betroffen sind.",
    symptome: [
      "Sichtungen an Mülltonnen, im Hinterhof, Garten oder Keller",
      "Kotspuren und Laufwege entlang von Mauern und Fundamenten",
      "Aufgerissene Müllsäcke und Nagespuren an Tonnen",
      "Erdlöcher und Baue im Garten oder unter Gehwegplatten",
    ],
    dokumentation: [
      "Fundorte fotografieren und auf einer Skizze des Grundstücks markieren",
      "Datum und Uhrzeit jeder Sichtung notieren",
      "Meldung beim Gesundheitsamt vornehmen und die Bestätigung aufbewahren",
      "Festhalten, ob und wie lange der Keller dadurch nicht nutzbar ist",
    ],
    hinweis:
      "Halten Sie sauber auseinander, wo die Tiere auftreten. Solange sie draußen bleiben, bewegt sich die Minderung im niedrigen einstelligen bis mittleren Bereich. Sobald Ratten in die Wohnung gelangen, gilt ein völlig anderer Maßstab, und Sie sollten den Mangel entsprechend anders anzeigen.",
    fristTage: 7,
    dringend: true,
  },
  maeuse: {
    slug: "maeuse",
    keywords: [
      "Mietminderung Mäuse",
      "Mäusebefall Wohnung Mietminderung",
      "Mäuse in der Wohnung Miete mindern",
    ],
    intro:
      "Zwischen einer verirrten Maus und einem Mäusebefall liegt rechtlich ein großer Unterschied. Haben sich die Tiere erst eingenistet, leidet die Hygiene erheblich: Sie gehen an Lebensmittel und nagen Kabel an, was im schlimmsten Fall einen Brand auslösen kann.",
    symptome: [
      "Wiederholte Sichtungen in Küche, Vorratsschrank oder Keller",
      "Kleine, reiskorngroße Kotkrümel in Schränken und Schubladen",
      "Angenagte Lebensmittelverpackungen",
      "Nächtliches Rascheln in Wänden oder hinter Einbauten",
    ],
    dokumentation: [
      "Kotspuren und Fraßschäden fotografieren, Fundorte notieren",
      "Fundprotokoll mit Datum und Ort jeder Sichtung führen",
      "Beschädigte Lebensmittel und deren Wert dokumentieren",
      "Mögliche Zugangswege wie offene Rohrdurchführungen fotografieren",
    ],
    hinweis:
      "Eine einzelne Maus im Keller trägt keine Minderung. Wiederkehrender Befall in den Wohnräumen schon, und genau diesen Unterschied müssen Ihre Aufzeichnungen zeigen. Ein einzelnes Foto genügt dafür nicht, ein über Wochen geführtes Fundprotokoll sehr wohl.",
    fristTage: 10,
  },
  bettwanzen: {
    slug: "bettwanzen",
    keywords: [
      "Mietminderung Bettwanzen",
      "Bettwanzen Wohnung Mietminderung",
      "Wanzenbefall Miete mindern",
    ],
    intro:
      "Wer morgens mit juckenden Bissreihen aufwacht, hat womöglich Bettwanzen im Haus, und die verschwinden nicht von selbst. Ohne professionelle Bekämpfung wird man sie praktisch nicht los. Der Befall ist ein erheblicher Mangel, die Kosten der Bekämpfung trägt grundsätzlich der Vermieter.",
    symptome: [
      "Juckende Bissreihen auf der Haut, typischerweise morgens",
      "Kleine dunkle Kotpünktchen auf Matratze und Bettwäsche",
      "Blutflecken auf dem Laken",
      "Süßlicher Geruch bei starkem Befall",
    ],
    dokumentation: [
      "Bisse und Blutflecken fotografieren, ärztliche Bestätigung einholen",
      "Matratzennähte, Lattenrost und Sockelleisten absuchen und fotografieren",
      "Kammerjägerbericht als offizielle Bestätigung des Befalls sichern",
      "Datum der ersten Bisse und den Verlauf protokollieren",
    ],
    hinweis:
      "Lassen Sie die Finger von Hausmitteln und Sprays aus dem Baumarkt. Sie treiben die Tiere nur in Nachbarräume und Nachbarwohnungen, und am Ende heißt es womöglich noch, Sie hätten den Befall verschleppt. Sofort melden, auf den Profi bestehen.",
    fristTage: 5,
    dringend: true,
  },
  silberfische: {
    slug: "silberfische",
    keywords: [
      "Mietminderung Silberfische",
      "Silberfische Bad Mietminderung",
      "starker Silberfischbefall Miete mindern",
    ],
    intro:
      "Ein paar Silberfische hat fast jedes Bad, das ist normal und kein Mangel. Interessant wird es bei massenhaftem Auftreten, denn dann sind die Tiere meist nur der Bote: Silberfische brauchen dauerhaft feuchte Luft. Wo sie sich stark vermehren, stimmt oft etwas mit dem Gebäude nicht.",
    symptome: [
      "Regelmäßig viele Tiere, vor allem nachts in Bad und Küche",
      "Befall trotz gründlicher Reinigung dauerhaft",
      "Fraßspuren an Tapeten, Büchern oder Textilien",
      "Dauerhaft hohe Luftfeuchtigkeit im betroffenen Raum",
    ],
    dokumentation: [
      "Tiere fotografieren und die Anzahl je Sichtung protokollieren",
      "Luftfeuchtigkeit mit einem Hygrometer über mehrere Wochen messen",
      "Klebefallen aufstellen und die Fangzahlen dokumentieren",
      "Auf Feuchtigkeitsquellen wie undichte Leitungen oder fehlende Lüftung hinweisen",
    ],
    hinweis:
      "Sprechen Sie in der Mängelanzeige die vermutliche Ursache an, also die Feuchtigkeit. Wird nur gesprüht und nichts abgedichtet, sind die Tiere in ein paar Wochen wieder da. Und das dahinterliegende Feuchtigkeitsproblem ist ein eigener Mangel, der oft höher bewertet wird als die Silberfische selbst.",
    fristTage: 21,
  },
  wespen: {
    slug: "wespennest",
    keywords: [
      "Mietminderung Wespennest",
      "Wespennest Balkon Mietminderung",
      "Bienennest Wohnung Miete mindern",
    ],
    intro:
      "Mit einem Wespennest direkt am Balkon oder Fenster ist an Frühstück im Freien oder gekippte Fenster nicht mehr zu denken. Die betroffenen Bereiche fallen schlicht aus. Für Allergiker steckt dahinter mehr als Unannehmlichkeit, nämlich eine echte Gesundheitsgefahr.",
    symptome: [
      "Sichtbares Nest an Balkon, Fassade, Rollladenkasten oder Dachüberstand",
      "Ständiger Wespenflug am Fenster oder auf dem Balkon",
      "Balkon oder Terrasse kann nicht mehr genutzt werden",
      "Fenster können nicht mehr geöffnet werden",
    ],
    dokumentation: [
      "Nest und Flugbetrieb fotografieren, Größe und genaue Lage angeben",
      "Allergiepass oder ärztliches Attest beilegen, falls vorhanden",
      "Datum der Meldung an den Vermieter festhalten",
      "Dokumentieren, welche Bereiche dadurch unbenutzbar sind",
    ],
    hinweis:
      "So verlockend es sein mag: Rühren Sie das Nest nicht selbst an. Wespen, Hornissen und Wildbienen stehen unter Naturschutz, die Umsiedlung ist Sache eines Fachbetriebs mit behördlicher Genehmigung. Eigenmächtiges Entfernen ist gefährlich und kann obendrein ein Bußgeld kosten.",
    fristTage: 7,
    dringend: true,
  },

  /* ------------------------ Fenster & Türen ------------------------ */
  fenster_undicht: {
    slug: "undichte-fenster",
    keywords: [
      "Mietminderung undichte Fenster",
      "Zugluft Fenster Mietminderung",
      "zieht durchs Fenster Miete mindern",
    ],
    intro:
      "Wenn es bei geschlossenem Fenster durch die Ritzen zieht, heizen Sie buchstäblich zum Fenster hinaus. Obendrein setzt sich an kalten Laibungen gern Schimmel fest. Der Vermieter schuldet Fenster, die schließen und dicht sind. Das gilt im Altbau genauso wie im Neubau.",
    symptome: [
      "Spürbarer Luftzug bei geschlossenem Fenster",
      "Dichtungen sind spröde, rissig oder fehlen ganz",
      "Kondenswasser oder Eisbildung an der Innenseite",
      "Deutlich erhöhte Heizkosten und dauerhaft kühle Räume",
    ],
    dokumentation: [
      "Zugluft mit einer Kerzenflamme oder einem Räucherstäbchen sichtbar machen und filmen",
      "Dichtungen aus der Nähe fotografieren, Risse und Lücken zeigen",
      "Raumtemperatur in Fensternähe und in Raummitte vergleichend messen",
      "Heizkostenabrechnungen mehrerer Jahre gegenüberstellen",
    ],
    hinweis:
      "Der alte Kerzentrick funktioniert vor Gericht erstaunlich gut: eine flackernde Flamme vor der geschlossenen Fensterfuge, aufs Video gebannt. Achten Sie darauf, dass im Bild erkennbar ist, dass das Fenster wirklich zu ist. Dann bleibt dem Vermieter kaum ein Einwand.",
    fristTage: 21,
  },
  fenster_oeffnen: {
    slug: "fenster-laesst-sich-nicht-oeffnen",
    keywords: [
      "Fenster klemmt Mietminderung",
      "Fenster lässt sich nicht öffnen",
      "Mietminderung Fenster defekt",
    ],
    intro:
      "Ein Fenster, das sich nicht öffnen lässt, hat eine besondere Pointe: Es verhindert genau das Stoßlüften, das Vermieter ihren Mietern bei jedem Schimmelverdacht predigen. Bewertet wird der Mangel für jedes betroffene Fenster einzeln.",
    symptome: [
      "Fenstergriff lässt sich nicht drehen oder dreht durch",
      "Flügel klemmt im Rahmen oder ist verzogen",
      "Beschlag ist ausgehängt oder gebrochen",
      "Lüften ist im betroffenen Raum nur eingeschränkt möglich",
    ],
    dokumentation: [
      "Defekten Griff und Beschlag im Detail fotografieren",
      "Video aufnehmen, das den erfolglosen Öffnungsversuch zeigt",
      "Notieren, welche Räume betroffen sind und ob dort noch andere Lüftungsmöglichkeiten bestehen",
      "Luftfeuchtigkeit im betroffenen Raum messen und protokollieren",
    ],
    hinweis:
      "Schreiben Sie den Zusammenhang mit der Schimmelvorbeugung ausdrücklich in die Mängelanzeige. Sollte später tatsächlich Schimmel auftreten, steht dann schwarz auf weiß fest: Richtig lüften war nicht möglich, und zwar wegen eines Mangels, den der Vermieter zu vertreten hat.",
    fristTage: 14,
  },
  fenster_schliessen: {
    slug: "fenster-laesst-sich-nicht-schliessen",
    keywords: [
      "Fenster schließt nicht Mietminderung",
      "Fenster geht nicht zu",
      "offenes Fenster Sicherheitsrisiko Miete mindern",
    ],
    intro:
      "Ein Fenster, das nicht mehr zugeht, trifft Sie doppelt. Wärme entweicht, Regen kommt herein, und nebenbei steht die Wohnung Einbrechern halb offen. Zusammen ergibt das einen Mangel, der eine spürbare Minderung trägt.",
    symptome: [
      "Fenster lässt sich nicht vollständig schließen oder verriegeln",
      "Regen dringt in die Wohnung ein",
      "Wohnung kühlt aus, Heizkosten steigen",
      "Wohnung ist nicht mehr einbruchsicher, besonders im Erdgeschoss",
    ],
    dokumentation: [
      "Spalt am geschlossenen Fenster fotografieren, Zollstock als Maßstab anlegen",
      "Eindringende Nässe und Folgeschäden dokumentieren",
      "Raumtemperatur messen und protokollieren",
      "Bei Erdgeschoss oder Souterrain ausdrücklich auf das Einbruchsrisiko hinweisen",
    ],
    hinweis:
      "Setzen Sie hier eine kurze Frist, das Thema duldet keinen Aufschub. Ihre Meldung hat noch einen zweiten Effekt: Wird nach der Anzeige eingebrochen, kann der Vermieter für den Schaden mit einstehen müssen, weil er den Defekt kannte.",
    fristTage: 7,
    dringend: true,
  },
  tuer_abschliessbar: {
    slug: "wohnungstuer-nicht-abschliessbar",
    keywords: [
      "Wohnungstür lässt sich nicht abschließen",
      "Mietminderung Schloss defekt",
      "Haustür defekt Mietminderung",
    ],
    intro:
      "Wenn sich die Wohnungstür nicht mehr abschließen lässt, wohnt es sich ungut, und das zu Recht: Es ist ein Sicherheitsmangel. Wie hoch Gerichte ihn bewerten, schwankt stark. Es kommt darauf an, wie leicht Fremde ins Haus kommen und wie schnell die Tür zu überwinden wäre.",
    symptome: [
      "Schloss lässt sich nicht oder nur schwer schließen",
      "Schlüssel dreht durch oder klemmt im Zylinder",
      "Tür fällt nicht mehr richtig ins Schloss",
      "Haustür steht dauerhaft offen oder der Türschließer ist defekt",
    ],
    dokumentation: [
      "Defektes Schloss und die Tür fotografieren",
      "Video vom vergeblichen Abschließversuch aufnehmen",
      "Datum der ersten Meldung an Vermieter oder Hausverwaltung dokumentieren",
      "Vorfälle im Haus wie Einbrüche oder unbefugte Personen im Treppenhaus notieren",
    ],
    hinweis:
      "Melden Sie den Defekt noch am selben Tag, und zwar schriftlich. Sollte danach eingebrochen werden, kann der Vermieter für den Schaden haften. Das funktioniert aber nur, wenn Sie beweisen können, wann Ihre Meldung bei ihm angekommen ist.",
    fristTage: 3,
    dringend: true,
  },
  klingel_defekt: {
    slug: "klingel-gegensprechanlage-defekt",
    keywords: [
      "Mietminderung Klingel defekt",
      "Gegensprechanlage kaputt Mietminderung",
      "Türöffner defekt Miete mindern",
    ],
    intro:
      "Der Paketbote klingelt vergeblich, der Besuch steht ratlos vor der Tür: Eine kaputte Klingel oder Gegensprechanlage nervt im Alltag mehr, als man denkt. Rechtlich ist sie ein kleiner, aber anerkannter Mangel mit Quoten im niedrigen einstelligen Bereich.",
    symptome: [
      "Klingel ist in der Wohnung nicht hörbar",
      "Gegensprechanlage überträgt keinen Ton oder ist unverständlich",
      "Elektrischer Türöffner funktioniert nicht",
      "Pakete und Besuch erreichen Sie regelmäßig nicht",
    ],
    dokumentation: [
      "Video aufnehmen, das den erfolglosen Klingelvorgang zeigt",
      "Verpasste Zustellungen und Benachrichtigungskarten sammeln",
      "Datum der Meldung festhalten",
      "Prüfen und dokumentieren, ob mehrere Parteien im Haus betroffen sind",
    ],
    hinweis:
      "Für sich allein bewegt sich dieser Mangel an der Bagatellgrenze. Seine Stärke spielt er im Verbund aus: Zusammen mit anderen Mängeln in einer gemeinsamen Aufstellung hebt er die Gesamtquote. Führen Sie ihn also mit auf, statt ihn einzeln geltend zu machen.",
    fristTage: 21,
  },

  /* -------------------------- Bad & Sanitär ------------------------ */
  toilette_defekt: {
    slug: "toilette-defekt",
    keywords: [
      "Mietminderung Toilette defekt",
      "WC nicht benutzbar Mietminderung",
      "einzige Toilette kaputt Miete mindern",
    ],
    intro:
      "Fällt die einzige Toilette der Wohnung aus, fehlt etwas, das keinen Tag warten kann. Gerichte behandeln das entsprechend ernst und haben Minderungen bis zu 80 Prozent zugesprochen. Unter den Sanitärmängeln ist kaum einer gravierender.",
    symptome: [
      "WC ist verstopft, undicht oder gebrochen",
      "Abfluss läuft nicht ab, Wasser tritt aus",
      "WC-Becken ist gerissen oder wackelt gefährlich",
      "Toilette kann nicht ohne Gesundheitsrisiko benutzt werden",
    ],
    dokumentation: [
      "Defekt und austretendes Wasser fotografieren",
      "Datum und Uhrzeit der Meldung an den Notdienst dokumentieren",
      "Notieren, ob ein zweites WC in der Wohnung vorhanden ist",
      "Kosten für Ausweichlösungen belegen und aufbewahren",
    ],
    hinweis:
      "Hier zählt jede Stunde, und das Gesetz sieht das genauso. Der Vermieter muss sofort reagieren, notfalls über den Notdienst. Rührt er sich nicht, dürfen Sie nach § 536a Abs. 2 BGB selbst einen Installateur rufen und ihm die Rechnung weiterreichen.",
    fristTage: 1,
    dringend: true,
  },
  toilette_zweit_wc: {
    slug: "toilette-defekt-zweites-wc",
    keywords: [
      "Mietminderung Toilette defekt zweites WC",
      "Gäste-WC defekt Mietminderung",
      "eine von zwei Toiletten kaputt",
    ],
    intro:
      "Ist eine Toilette defekt, steht aber eine zweite, problemlos nutzbare zur Verfügung, fällt die Minderung deutlich niedriger aus. Gerichte haben hier Größenordnungen um die fünf Prozent zugesprochen. Der Grund liegt auf der Hand: Die Grundversorgung der Wohnung ist weiter sichergestellt.",
    symptome: [
      "Eines von zwei WCs ist verstopft, undicht oder gebrochen",
      "Gäste-WC oder zweites Bad ist nicht benutzbar",
      "Die verbleibende Toilette funktioniert einwandfrei",
      "Längere Wege oder Wartezeiten im Alltag, aber keine Notlage",
    ],
    dokumentation: [
      "Defekt fotografieren und den Fundort im Grundriss festhalten",
      "Ausdrücklich dokumentieren, dass ein zweites WC vorhanden und nutzbar ist",
      "Datum der Meldung an den Vermieter festhalten",
      "Notieren, seit wann der Defekt besteht",
    ],
    hinweis:
      "Setzen Sie die Quote hier bewusst niedrig an. Wer den Wert für die einzige Toilette ansetzt, obwohl ein zweites WC vorhanden ist, mindert um ein Vielfaches zu viel und riskiert den Zahlungsverzug. Die Frist darf trotzdem kurz sein, ein defektes WC bleibt ein Sanitärmangel.",
    fristTage: 7,
  },
  dusche_defekt: {
    slug: "dusche-defekt",
    keywords: [
      "Mietminderung Dusche defekt",
      "Duschkabine undicht Mietminderung",
      "Dusche kaputt Miete mindern",
    ],
    intro:
      "Ohne funktionierende Dusche wird schon der Start in den Tag zum Problem. Für die Höhe der Minderung stellt sich vor allem eine Frage: Gibt es eine zumutbare Alternative, etwa eine intakte Badewanne? Davon hängt ab, wie schwer der Mangel wiegt.",
    symptome: [
      "Duscharmatur oder Brausekopf defekt, kein regulierbarer Wasserstrahl",
      "Duschkabine undicht, Wasser läuft ins Bad",
      "Abfluss verstopft, Wasser steht in der Duschtasse",
      "Duschtasse gerissen oder Fliesen und Fugen defekt",
    ],
    dokumentation: [
      "Defekt und austretendes Wasser fotografieren und filmen",
      "Wasserschäden am Boden oder an angrenzenden Wänden dokumentieren",
      "Angeben, ob eine funktionsfähige Badewanne als Alternative existiert",
      "Datum der Meldung festhalten",
    ],
    hinweis:
      "Bei einer undichten Dusche läuft die Zeit gegen Sie: Das Wasser arbeitet sich in den Estrich und im Zweifel bis zum Nachbarn durch. Melden Sie den Schaden deshalb sofort und schriftlich. Wer zu lange wartet, verletzt seine Anzeigepflicht aus § 536c BGB und kann am Ende selbst auf Schadensersatz haften.",
    fristTage: 7,
    dringend: true,
  },
  dusche_einzige: {
    slug: "einzige-duschmoeglichkeit-ausgefallen",
    keywords: [
      "Mietminderung keine Duschmöglichkeit",
      "Bad nicht nutzbar Mietminderung",
      "einzige Dusche kaputt Miete mindern",
      "nicht waschen können Mietminderung",
    ],
    intro:
      "Wenn die Wohnung überhaupt keine Wasch- oder Bademöglichkeit mehr hat, ist das ein anderer Fall als eine defekte Dusche neben einer intakten Badewanne. Gerichte haben dafür Minderungen bis in den Bereich eines Drittels der Miete zugesprochen, weil eine Grundfunktion der Wohnung schlicht fehlt.",
    symptome: [
      "Weder Dusche noch Badewanne sind nutzbar",
      "Kein warmes Wasser an der einzigen Waschstelle",
      "Bad wegen Sanierung oder Wasserschaden komplett gesperrt",
      "Ausweichen auf Fitnessstudio, Nachbarn oder Verwandte nötig",
    ],
    dokumentation: [
      "Fotos des gesamten Bades, die zeigen, dass keine Alternative existiert",
      "Grundriss beilegen, aus dem hervorgeht, dass es nur ein Bad gibt",
      "Belege für Ausweichlösungen sammeln, etwa Tageskarten oder Fahrtkosten",
      "Beginn der Sperrung und jede Zusage des Vermieters mit Datum festhalten",
    ],
    hinweis:
      "Schreiben Sie ausdrücklich in die Mängelanzeige, dass es in der Wohnung keine zweite Waschmöglichkeit gibt. Genau dieser Satz entscheidet über die Größenordnung der Quote. Kosten für zumutbare Ausweichlösungen können Sie zusätzlich nach § 536a BGB als Schaden geltend machen.",
    fristTage: 3,
    dringend: true,
  },
  wasserdruck_niedrig: {
    slug: "wasserdruck-zu-niedrig",
    keywords: [
      "Mietminderung Wasserdruck",
      "zu wenig Wasserdruck Wohnung",
      "Dusche tröpfelt nur Mietminderung",
    ],
    intro:
      "Wenn aus der Dusche nur ein Rinnsal kommt, ist das mehr als lästig. Bei Durchlauferhitzern kann zu wenig Druck sogar dazu führen, dass gar kein warmes Wasser mehr bereitet wird, weil das Gerät nicht anspringt. Die Quoten sind überschaubar, aber der Mangel besteht eben jeden Tag.",
    symptome: [
      "Wasser kommt nur schwach aus Hahn oder Duschkopf",
      "Druck fällt ab, sobald an anderer Stelle Wasser läuft",
      "Durchlauferhitzer schaltet mangels Durchfluss nicht ein",
      "Waschmaschine oder Spülmaschine brauchen deutlich länger",
    ],
    dokumentation: [
      "Durchflussmenge messen: einen Ein-Liter-Behälter füllen und die Zeit stoppen",
      "Video mit sichtbarer Stoppuhr aufnehmen",
      "An mehreren Zapfstellen und zu verschiedenen Tageszeiten messen",
      "Perlator reinigen und das dokumentieren, um eigene Ursachen auszuschließen",
    ],
    hinweis:
      "Ein praktischer Tipp vorab: Schrauben Sie den Perlator ab, entkalken oder ersetzen Sie ihn, und notieren Sie das. Bleibt der Druck trotzdem schwach, kann der Vermieter nicht mehr einwenden, das Problem liege an einer verkalkten Armatur, um die Sie sich selbst hätten kümmern müssen.",
    fristTage: 21,
  },
  bad_belueftung: {
    slug: "bad-nicht-belueftbar",
    keywords: [
      "Bad ohne Fenster Mietminderung",
      "Badlüftung defekt Mietminderung",
      "Abluft Bad kaputt Miete mindern",
    ],
    intro:
      "In einem Bad ohne Fenster führt an der Abluftanlage kein Weg vorbei: Sie ist die einzige Möglichkeit, die Feuchtigkeit nach dem Duschen loszuwerden. Fällt sie aus, sammelt sich das Wasser an Decke und Fugen, und der Schimmel ist nur eine Frage der Zeit. Ein klarer Mangel.",
    symptome: [
      "Abluftventilator läuft nicht oder saugt nicht spürbar",
      "Spiegel und Fliesen bleiben nach dem Duschen lange beschlagen",
      "Dauerhaft hohe Luftfeuchtigkeit im Bad",
      "Beginnende Schimmelbildung an Decke oder Fugen",
    ],
    dokumentation: [
      "Saugleistung mit einem Blatt Papier am Lüftungsgitter testen und filmen",
      "Luftfeuchtigkeit nach dem Duschen mit einem Hygrometer messen und protokollieren",
      "Beschlagene Flächen und beginnenden Schimmel fotografieren",
      "Angeben, ob das Bad ein Fenster hat",
    ],
    hinweis:
      "Melden Sie den Defekt, solange das Bad noch schimmelfrei ist. Kommt der Schimmel später doch, liegt die Ursache dann bereits dokumentiert beim Vermieter, und niemand kann Ihnen falsches Lüften vorhalten.",
    fristTage: 14,
  },
  spuelung_defekt: {
    slug: "toilettenspuelung-defekt",
    keywords: [
      "Mietminderung Spülkasten defekt",
      "Toilettenspülung kaputt Mietminderung",
      "WC Spülung läuft Miete mindern",
    ],
    intro:
      "Mit einer kaputten Spülung bleibt das WC zwar benutzbar, aber eben nur mit Eimer und Improvisation. Richtig teuer wird ein Spülkasten, der ständig nachläuft: Das Wasser rauscht rund um die Uhr durch, und bezahlt wird es über Ihre Nebenkosten.",
    symptome: [
      "Spülung löst nicht oder nur unzureichend aus",
      "Wasser läuft dauerhaft in die Schüssel nach",
      "Spülkasten füllt sich nicht oder läuft über",
      "Spülung nur noch mit Eimer möglich",
    ],
    dokumentation: [
      "Defekt filmen, beim Nachlaufen mit Tonspur aufnehmen",
      "Wasserzählerstände über mehrere Tage notieren, um den Mehrverbrauch zu belegen",
      "Datum der Meldung festhalten",
      "Fotos vom geöffneten Spülkasten machen, sofern gefahrlos möglich",
    ],
    hinweis:
      "Fordern Sie zweierlei: die Reparatur und die Zusage, dass der Mehrverbrauch nicht auf Ihrer Nebenkostenabrechnung landet. Beziffern lässt sich der Mehrverbrauch nur über Ihre notierten Zählerstände, also fangen Sie mit dem Ablesen gleich an.",
    fristTage: 14,
  },

  /* ---------------------------- Küche ------------------------------ */
  herd_defekt: {
    slug: "herd-backofen-defekt",
    keywords: [
      "Mietminderung Herd defekt",
      "Backofen kaputt Mietminderung",
      "Kochfeld defekt Miete mindern",
    ],
    intro:
      "Beim defekten Herd lautet die erste Frage nicht „Was ist kaputt?“, sondern „Wem gehört er?“. Nur wenn der Vermieter ihn gestellt hat, können Sie mindern. Fallen einzelne Kochstellen aus, bleiben die Quoten im niedrigen einstelligen Bereich.",
    symptome: [
      "Einzelne oder alle Kochstellen heizen nicht",
      "Backofen erreicht die eingestellte Temperatur nicht",
      "Sicherung fliegt beim Einschalten heraus",
      "Warmes Essen kann nicht zubereitet werden",
    ],
    dokumentation: [
      "Im Mietvertrag oder Übergabeprotokoll nachweisen, dass der Herd mitvermietet ist",
      "Defekt fotografieren oder filmen, etwa das kalte Kochfeld bei eingeschalteter Anzeige",
      "Backofentemperatur mit einem Ofenthermometer messen und dokumentieren",
      "Datum der Meldung festhalten",
    ],
    hinweis:
      "Ein Blick in den Mietvertrag lohnt sich wegen der Kleinreparaturklausel. Ist sie wirksam vereinbart, müssen Sie sich womöglich an den Reparaturkosten beteiligen. Ihr Minderungsrecht bleibt davon aber unberührt, das sind zwei getrennte Dinge.",
    fristTage: 14,
  },
  kuehlschrank_defekt: {
    slug: "kuehlschrank-defekt",
    keywords: [
      "Mietminderung Kühlschrank defekt",
      "Kühlschrank kühlt nicht Mietminderung",
      "Gefrierfach kaputt Miete mindern",
    ],
    intro:
      "Wenn der mitvermietete Kühlschrank aufgibt, geht es schnell: Nach ein, zwei Tagen ist der Inhalt hinüber. Neben der Minderung können Sie deshalb auch Ersatz für die verdorbenen Lebensmittel verlangen.",
    symptome: [
      "Innentemperatur bleibt deutlich über 7 °C",
      "Gefrierfach taut auf, Gefriergut verdirbt",
      "Kompressor läuft dauerhaft oder gar nicht",
      "Lebensmittel verderben innerhalb von ein bis zwei Tagen",
    ],
    dokumentation: [
      "Innentemperatur mit einem Thermometer messen und fotografieren",
      "Verdorbene Lebensmittel fotografieren und die Kassenbons aufbewahren",
      "Mietvertragliche Zugehörigkeit des Geräts nachweisen",
      "Datum und Uhrzeit der Meldung dokumentieren",
    ],
    hinweis:
      "Die verdorbenen Lebensmittel sind ein Schaden im Sinne von § 536a Abs. 1 BGB und kommen zur Minderung noch obendrauf. Bevor Sie den Kühlschrankinhalt wegwerfen: einmal fotografieren, Kassenbons heraussuchen. Ohne Belege wird aus dem Anspruch nichts.",
    fristTage: 7,
    dringend: true,
  },
  spuelmaschine_defekt: {
    slug: "spuelmaschine-defekt",
    keywords: [
      "Mietminderung Spülmaschine defekt",
      "Geschirrspüler kaputt Mietminderung",
    ],
    intro:
      "Steht die Spülmaschine im Mietvertrag, muss der Vermieter sie auch am Laufen halten. Fällt sie aus, rechtfertigt das eine Minderung im niedrigen einstelligen Bereich. Klein, aber berechtigt.",
    symptome: [
      "Maschine startet nicht oder bricht das Programm ab",
      "Wasser läuft nicht ab oder tritt aus",
      "Geschirr wird nicht sauber oder nicht getrocknet",
      "Fehlercode in der Anzeige",
    ],
    dokumentation: [
      "Fehlercode und Displayanzeige fotografieren",
      "Austretendes Wasser und Folgeschäden dokumentieren",
      "Nachweis aus Mietvertrag oder Übergabeprotokoll sichern",
      "Datum der Meldung festhalten",
    ],
    hinweis:
      "Vorsicht bei selbst gekauften Geräten: Für die haftet der Vermieter nicht, er schuldet nur, was er mitvermietet hat. Klären Sie also zuerst anhand von Mietvertrag und Übergabeprotokoll, wessen Maschine da eigentlich streikt.",
    fristTage: 21,
  },
  kueche_komplett: {
    slug: "kueche-nicht-nutzbar",
    keywords: [
      "Mietminderung Küche nicht nutzbar",
      "Küche unbenutzbar Mietminderung",
      "Einbauküche komplett defekt Miete mindern",
    ],
    intro:
      "Eine Wohnung, in der man weder kochen noch abwaschen kann, verdient den Namen kaum noch. Ob nach einem Wasserschaden, während eines Umbaus oder weil die zugesagte Einbauküche nie geliefert wurde: Dauert der Zustand länger an, erkennen Gerichte Quoten bis zu 100 Prozent an.",
    symptome: [
      "Weder Kochen noch Spülen ist möglich",
      "Küche ist wegen Bauarbeiten oder Schäden gesperrt",
      "Wasser- oder Stromanschluss in der Küche fehlt",
      "Zugesagte Einbauküche wurde nicht gestellt oder wurde entfernt",
    ],
    dokumentation: [
      "Gesamten Zustand der Küche fotografisch dokumentieren",
      "Zeitraum der Unbenutzbarkeit taggenau festhalten",
      "Mehrkosten für auswärtige Verpflegung mit Belegen sammeln",
      "Bauzeitenpläne und Ankündigungen des Vermieters sichern",
    ],
    hinweis:
      "Zieht sich die Sache hin, muss der Vermieter für eine Zwischenlösung sorgen, zum Beispiel eine provisorische Kochgelegenheit. Fordern Sie das schriftlich ein. Lehnt er ab, haben Sie ein zusätzliches Argument, wenn es um die Höhe der Minderung geht.",
    fristTage: 7,
    dringend: true,
  },

  /* ---------------------------- Aufzug ----------------------------- */
  aufzug_defekt: {
    slug: "aufzug-defekt",
    keywords: [
      "Mietminderung Aufzug defekt",
      "Fahrstuhl kaputt Mietminderung",
      "Aufzug außer Betrieb Miete mindern",
    ],
    intro:
      "War der Aufzug bei Einzug da oder steht er im Vertrag, gehört er zur Mietsache, und ein längerer Ausfall ist ein Mangel. Wie viel er wert ist, entscheidet vor allem das Treppenhaus: Mit jeder Etage, die Sie zu Fuß bewältigen müssen, steigt die anerkannte Quote.",
    symptome: [
      "Aufzug ist über Tage oder Wochen außer Betrieb",
      "Häufige, wiederkehrende Störungen",
      "Transport von Einkäufen, Kinderwagen oder Möbeln ist nicht möglich",
      "Kein Ersatz oder Übergangslösung durch den Vermieter",
    ],
    dokumentation: [
      "Aushang oder Störungsanzeige mit Datum fotografieren",
      "Ausfalltage taggenau protokollieren",
      "Eigene Etage und die Zahl der zu bewältigenden Stockwerke angeben",
      "Bei eingeschränkter Mobilität ein ärztliches Attest beilegen",
    ],
    hinweis:
      "Ein paar Stunden Wartung muss jeder hinnehmen, darauf lässt sich keine Minderung stützen. Bei längeren oder wiederkehrenden Ausfällen zählt dann jeder einzelne Tag. Führen Sie deshalb Buch, denn gerechnet wird taggenau, wenn der Aufzug nicht den ganzen Monat stillstand.",
    fristTage: 14,
  },
  aufzug_hoch: {
    slug: "aufzug-defekt-hohes-stockwerk",
    keywords: [
      "Aufzug defekt 5. Stock Mietminderung",
      "Mietminderung Aufzug Hochhaus",
      "Aufzug kaputt Gehbehinderung",
    ],
    intro:
      "Vier Treppen mit Einkäufen, fünf mit dem Kinderwagen: Ab etwa der vierten Etage ist ein toter Aufzug kein Ärgernis mehr, sondern ein ernstes Problem. Kommen Gehbehinderung, hohes Alter oder kleine Kinder dazu, haben Gerichte bis zu 50 Prozent Minderung zugesprochen.",
    symptome: [
      "Wohnung liegt in der vierten Etage oder höher",
      "Treppensteigen ist gesundheitlich nicht oder kaum zumutbar",
      "Einkäufe, Kinderwagen oder Gehhilfen können nicht transportiert werden",
      "Wohnung wird faktisch zur Falle, Verlassen nur unter großer Anstrengung möglich",
    ],
    dokumentation: [
      "Ärztliches Attest zur Mobilitätseinschränkung einholen",
      "Schwerbehindertenausweis oder Pflegegrad-Bescheid beilegen, falls vorhanden",
      "Etage und Anzahl der Stufen konkret angeben",
      "Ausfalltage lückenlos protokollieren",
    ],
    hinweis:
      "Verschweigen Sie Ihre persönliche Situation nicht aus Bescheidenheit. Gehbehinderung, Alter, kleine Kinder: Genau diese Umstände heben die Quote über den Standardwert, aber nur, wenn sie in der Mängelanzeige stehen. Was der Vermieter nicht weiß, kann er nicht berücksichtigen, und ein Gericht später auch nicht.",
    fristTage: 7,
    dringend: true,
  },

  /* ---------------------------- Elektrik --------------------------- */
  strom_komplett: {
    slug: "stromausfall",
    keywords: [
      "Mietminderung Stromausfall",
      "kein Strom in der Wohnung Mietminderung",
      "Stromausfall Wohnung unbewohnbar",
    ],
    intro:
      "Ohne Strom geht in einer Wohnung gar nichts mehr. Kein Licht, kein Kühlschrank, oft auch keine Heizung und kein warmes Wasser, weil deren Steuerung mit am Netz hängt. Dauert der Ausfall länger, kann die Miete auf null sinken.",
    symptome: [
      "Kein Strom in der gesamten Wohnung",
      "Sicherungen fliegen sofort wieder heraus",
      "Ursache liegt in der Hausinstallation, nicht bei Ihrem Versorger",
      "Lebensmittel verderben, Heizung und Warmwasser fallen mit aus",
    ],
    dokumentation: [
      "Sicherungskasten fotografieren, Zeitpunkt des Ausfalls festhalten",
      "Bestätigen lassen, dass kein Zahlungsrückstand beim Stromversorger besteht",
      "Verdorbene Lebensmittel fotografieren und Belege sammeln",
      "Kosten für Ausweichunterkunft dokumentieren",
    ],
    hinweis:
      "Behandeln Sie das als das, was es ist: ein Notfall. Der Vermieter muss sofort einen Elektro-Notdienst schicken. Erreichen Sie niemanden oder passiert nichts, dürfen Sie den Notdienst nach § 536a Abs. 2 BGB selbst rufen und die Rechnung dem Vermieter vorlegen.",
    fristTage: 1,
    dringend: true,
  },
  treppenhaus_licht: {
    slug: "treppenhausbeleuchtung-defekt",
    keywords: [
      "Mietminderung Treppenhausbeleuchtung",
      "Licht im Treppenhaus defekt",
      "dunkles Treppenhaus Mietminderung",
    ],
    intro:
      "Ein dunkles Treppenhaus ist kein Schönheitsproblem, hier stürzen Menschen. Die Beleuchtung gehört zur Verkehrssicherungspflicht des Vermieters, er muss sie instand halten. Bleibt sie über längere Zeit defekt, ist das ein Mangel.",
    symptome: [
      "Beleuchtung im Treppenhaus fällt ganz oder teilweise aus",
      "Zeitschalter schaltet zu früh ab, um sicher hinaufzukommen",
      "Bewegungsmelder reagiert nicht",
      "Kellerabgang oder Hauseingang liegen im Dunkeln",
    ],
    dokumentation: [
      "Dunkles Treppenhaus fotografieren, Uhrzeit und Datum festhalten",
      "Zeitspanne bis zum Abschalten des Zeitschalters messen",
      "Stürze oder Beinaheunfälle protokollieren, andere Bewohner als Zeugen benennen",
      "Datum der Meldung an Vermieter oder Hausverwaltung dokumentieren",
    ],
    hinweis:
      "Nennen Sie in der Meldung die Stichworte Verkehrssicherungspflicht und Sturzgefahr ruhig beim Namen. Stürzt nach Ihrer Meldung jemand, haftet der Vermieter, und das weiß er. Erfahrungsgemäß wird genau deshalb oft erstaunlich schnell repariert.",
    fristTage: 7,
    dringend: true,
  },
  internet_ausfall: {
    slug: "internetausfall",
    keywords: [
      "Mietminderung Internet",
      "Internetausfall Mietminderung",
      "Glasfaseranschluss defekt Miete mindern",
    ],
    intro:
      "Beim Internetausfall müssen Sie zuerst sortieren, wer überhaupt zuständig ist. Gehört der Anschluss zur Mietsache, etwa weil er im Mietvertrag enthalten ist oder das Haus zentral versorgt wird, können Sie die Miete mindern. Haben Sie dagegen selbst einen Vertrag mit einem Provider geschlossen, ist der Ausfall dessen Baustelle, nicht die des Vermieters.",
    symptome: [
      "Anschluss in der Wohnung liefert kein Signal",
      "Störung liegt in der Hausverkabelung, nicht beim Endgerät",
      "Ausfall dauert über Tage oder tritt wiederholt auf",
      "Homeoffice ist dadurch nicht möglich",
    ],
    dokumentation: [
      "Mietvertrag auf die Zugehörigkeit des Anschlusses prüfen und die Stelle markieren",
      "Störungsmeldungen und Antworten des Providers aufbewahren",
      "Ausfallzeiten mit Datum und Uhrzeit protokollieren",
      "Speedtests mit sichtbarem Datum als Screenshots sichern",
    ],
    hinweis:
      "Läuft der Anschluss über Ihren eigenen Provider-Vertrag, sind Sie hier trotzdem nicht rechtlos. Dann greift das Telekommunikationsgesetz, das bei Störungen eigene Entschädigungs- und Minderungsregeln kennt. Nur richtet sich der Anspruch eben gegen den Anbieter und nicht gegen den Vermieter.",
    fristTage: 14,
  },
  kabel_defekt: {
    slug: "kabelanschluss-defekt",
    keywords: [
      "Mietminderung Kabelanschluss",
      "kein TV Empfang Mietminderung",
      "Antennenanschluss defekt Miete mindern",
    ],
    intro:
      "Wer über die Nebenkosten für den Kabelanschluss zahlt oder ihn im Mietvertrag zugesagt bekommen hat, darf erwarten, dass er funktioniert. Fällt der Empfang komplett aus, ist das ein Mangel, wenn auch ein kleiner im niedrigen Prozentbereich.",
    symptome: [
      "Kein oder stark gestörter Empfang an der Anschlussdose",
      "Ausfall betrifft mehrere Wohnungen im Haus",
      "Anschluss wurde ohne Ersatz abgeschaltet",
      "Nebenkosten für den Anschluss laufen trotz Ausfall weiter",
    ],
    dokumentation: [
      "Fehlerbild am Fernseher fotografieren",
      "Nebenkostenabrechnung als Nachweis der Umlage vorlegen",
      "Ausfallzeitraum protokollieren",
      "Störungsmeldungen an den Netzbetreiber aufbewahren",
    ],
    hinweis:
      "Achten Sie auf die Nebenkosten: Laufen die Anschlussgebühren während des Ausfalls einfach weiter, können Sie deren Erstattung für diesen Zeitraum verlangen. Das ist ein eigener Anspruch, der neben die Mietminderung tritt.",
    fristTage: 21,
  },

  /* -------------------------- Wohnfläche --------------------------- */
  wohnflaeche_10: {
    slug: "wohnflaechenabweichung",
    keywords: [
      "Mietminderung Wohnfläche zu klein",
      "Wohnflächenabweichung 10 Prozent",
      "Wohnung kleiner als im Mietvertrag",
    ],
    intro:
      "Steht im Vertrag 80 Quadratmeter und das Aufmaß ergibt 70, fehlen 12,5 Prozent. Damit ist die Zehn-Prozent-Grenze des BGH überschritten und die Sache klar: ein erheblicher Mangel. Die Minderung entspricht dann exakt dem Prozentsatz der Abweichung, hier also 12,5 Prozent, und nicht etwa nur den 2,5 Prozent oberhalb der Schwelle. Sie gilt rückwirkend ab dem ersten Mietmonat.",
    symptome: [
      "Nachmessen ergibt deutlich weniger Fläche als im Mietvertrag angegeben",
      "Dachschrägen wurden voll statt anteilig gerechnet",
      "Balkon oder Terrasse wurden zu hoch angesetzt",
      "Keller- oder Abstellräume wurden mitgerechnet, obwohl sie keine Wohnfläche sind",
    ],
    dokumentation: [
      "Alle Räume exakt ausmessen und eine Aufstellung je Raum erstellen",
      "Wohnflächenverordnung beachten: Flächen unter 1 m Höhe zählen nicht, zwischen 1 und 2 m zur Hälfte",
      "Balkone und Terrassen in der Regel nur zu einem Viertel ansetzen",
      "Bei größeren Abweichungen ein Aufmaß durch einen Sachverständigen erstellen lassen",
    ],
    hinweis:
      "Die Wohnflächenabweichung ist einer der ganz wenigen Fälle, in denen Sie rückwirkend Geld zurückholen können, im Rahmen der dreijährigen Verjährung. Rechnen Sie ruhig einmal nach: Bei 15 Prozent Abweichung kommen über drei Jahre schnell mehrere tausend Euro zusammen. Zwei Einschränkungen sollten Sie kennen: Ist die Flächenangabe im Vertrag ausdrücklich als unverbindlich gekennzeichnet, scheidet die Minderung aus. Ein bloßer Zusatz „ca.“ genügt dafür allerdings nicht.",
    fristTage: 30,
  },
  hitze_dach: {
    slug: "hitze-dachgeschoss",
    keywords: [
      "Mietminderung Hitze Dachgeschoss",
      "Wohnung zu heiß im Sommer Mietminderung",
      "über 26 Grad Wohnung Miete mindern",
    ],
    intro:
      "Dass es im Dachgeschoss im Sommer warm wird, weiß jeder, der dort wohnt. Und genau das ist der Punkt: Der Maßstab der Gerichte ist nicht die Temperatur, sondern die Frage, ob das Gebäude beim sommerlichen Wärmeschutz dem zur Bauzeit geltenden Stand der Technik entsprach. War das der Fall, fällt die Hitze ins allgemeine Lebensrisiko, auch bei 30 °C. Der erfolgreichste dokumentierte Fall betraf deshalb keine Dachwohnung, sondern einen Neubau, bei dem die Wärmeschutzbestimmungen verletzt waren.",
    symptome: [
      "Raumtemperatur bleibt auch nachts über 26 °C",
      "Wohnung kühlt trotz nächtlichem Lüften nicht ab",
      "Fehlender oder unzureichender sommerlicher Wärmeschutz, etwa keine Rollläden",
      "Schlafen ist über Wochen kaum möglich",
    ],
    dokumentation: [
      "Temperaturprotokoll über mehrere Wochen führen, mehrfach täglich einschließlich nachts",
      "Außentemperatur zum Vergleich mitnotieren",
      "Fotos der Fenster ohne Verschattungsmöglichkeit machen",
      "Baujahr und Dämmzustand angeben, soweit bekannt",
    ],
    hinweis:
      "Messen Sie immer innen und außen. Wenn es draußen längst abgekühlt hat und Ihre Wohnung trotzdem bei 30 °C verharrt, liegt das nicht am Sommer, sondern am Gebäude. Genau dieser Vergleich macht aus „war halt heiß“ einen belegbaren Baumangel. Rechnen Sie im Dachgeschoss und im Altbau trotzdem mit Gegenwind: Wer in Kenntnis der Lage anmietet, verliert das Minderungsrecht nach § 536b BGB, und viele Klagen scheitern genau daran.",
    fristTage: 30,
  },
  undichtes_dach: {
    slug: "undichtes-dach",
    keywords: [
      "Mietminderung undichtes Dach",
      "Wasser von der Decke Mietminderung",
      "Dach undicht Miete mindern",
    ],
    intro:
      "Wenn es bei jedem Regen von der Decke tropft, hilft kein Eimer auf Dauer. Ein undichtes Dach ist ein gravierender Mangel, denn das Wasser greift die Bausubstanz an, und der Schimmel folgt meist mit ein paar Wochen Abstand.",
    symptome: [
      "Wasserflecken an der Decke, die nach Regen größer werden",
      "Tropfendes Wasser bei Niederschlag",
      "Feuchte Stellen im obersten Geschoss",
      "Putz oder Farbe lösen sich von der Decke",
    ],
    dokumentation: [
      "Wasserflecken bei jedem Regenereignis erneut fotografieren, um das Wachstum zu belegen",
      "Wetterdaten der betroffenen Tage sichern",
      "Auffanggefäße aufstellen und die Wassermenge dokumentieren",
      "Beschädigte Einrichtungsgegenstände auflisten",
    ],
    hinweis:
      "Melden Sie den Wassereintritt sofort und schriftlich. Das schützt Sie doppelt: Verschleppt der Vermieter die Reparatur und kommt Schimmel dazu, mindert der als eigener Mangel zusätzlich. Und den Vorwurf, Sie hätten zu spät Bescheid gegeben, kann Ihnen dann niemand mehr machen.",
    fristTage: 7,
    dringend: true,
  },

  /* ------------------------ Balkon & Außen ------------------------- */
  balkon_nicht_nutzbar: {
    slug: "balkon-nicht-nutzbar",
    keywords: [
      "Mietminderung Balkon nicht nutzbar",
      "Balkon gesperrt Mietminderung",
      "Gerüst vor Balkon Miete mindern",
    ],
    intro:
      "Der Balkon ist mitvermietet, also dürfen Sie ihn auch nutzen. Ist er wegen Bauarbeiten, eines Gerüsts oder maroder Substanz gesperrt, fehlt Ihnen ein Stück Wohnung. Wie viel das wert ist, hängt stark von der Jahreszeit ab: Im Sommer deutlich mehr als im Winter.",
    symptome: [
      "Balkon ist wegen Bauarbeiten oder Gerüst gesperrt",
      "Betonschäden oder marodes Geländer machen die Nutzung unsicher",
      "Balkontür lässt sich nicht öffnen",
      "Balkon ist durch Taubenkot oder Bauschutt unbenutzbar",
    ],
    dokumentation: [
      "Zustand und Absperrung fotografieren",
      "Sperrzeitraum taggenau protokollieren, Jahreszeit vermerken",
      "Ankündigungsschreiben und Aushänge des Vermieters sichern",
      "Balkonfläche im Verhältnis zur Wohnfläche angeben",
    ],
    hinweis:
      "Erwähnen Sie in der Mängelanzeige ausdrücklich die Jahreszeit. Gerichte unterscheiden hier sehr genau: Eine Balkonsperre von Mai bis September wiegt um ein Vielfaches schwerer als dieselbe Sperre im Januar. Dieses Argument sollten Sie sich nicht entgehen lassen.",
    fristTage: 14,
  },
  terrasse_nicht_nutzbar: {
    slug: "terrasse-nicht-nutzbar",
    keywords: [
      "Mietminderung Terrasse",
      "Terrasse nicht nutzbar Mietminderung",
      "Garten gesperrt Miete mindern",
    ],
    intro:
      "Terrasse und Gartenanteil gehören zur Mietsache, wenn sie mitvermietet sind. Stapelt dort den ganzen Sommer über Baumaterial oder ist die Fläche wegen einer Baustelle gesperrt, rechtfertigt das eine Minderung, je nach Ausmaß im mittleren einstelligen bis niedrigen zweistelligen Bereich.",
    symptome: [
      "Terrasse oder Garten sind durch Baumaterial oder Container blockiert",
      "Bodenbelag ist beschädigt oder zur Stolperfalle geworden",
      "Zugang ist versperrt",
      "Nutzung ist über die gesamte Sommersaison unmöglich",
    ],
    dokumentation: [
      "Blockierte Flächen fotografieren, Zeitraum protokollieren",
      "Mietvertragliche Zugehörigkeit von Terrasse oder Garten nachweisen",
      "Größe der betroffenen Fläche angeben",
      "Ankündigungen und Bauzeitenpläne sichern",
    ],
    hinweis:
      "Für die Wintermonate brauchen Sie hier nicht viel zu erwarten, die anerkannte Quote geht dann gegen null. Konzentrieren Sie die Minderung auf die eigentliche Nutzungssaison und rechnen Sie innerhalb dieser Monate taggenau ab.",
    fristTage: 14,
  },
  keller_nicht_nutzbar: {
    slug: "keller-nicht-nutzbar",
    keywords: [
      "Mietminderung Keller",
      "Kellerabteil nicht nutzbar Mietminderung",
      "Keller gesperrt Miete mindern",
    ],
    intro:
      "Steht das Kellerabteil im Mietvertrag, haben Sie Anspruch darauf, und zwar nutzbar. Ist es gesperrt, überflutet, von Fremden belegt oder wurde es Ihnen nie übergeben, mindert das die Miete der gesamten Wohnung, nicht nur einen gedachten Kelleranteil.",
    symptome: [
      "Kellerabteil wurde nie übergeben oder ist verschlossen",
      "Keller ist überflutet oder wegen Bauarbeiten gesperrt",
      "Abteil ist von Dritten belegt",
      "Lagerung ist wegen Feuchtigkeit oder Schimmel unmöglich",
    ],
    dokumentation: [
      "Zustand fotografieren und den Zeitraum der Unbenutzbarkeit protokollieren",
      "Mietvertragliche Zusage des Kellerabteils belegen",
      "Kosten für ein externes Lager dokumentieren, falls angefallen",
      "Datum der Meldung festhalten",
    ],
    hinweis:
      "Fehlt das Abteil schon seit dem Einzug, besteht der Anspruch im Grundsatz ab Mietbeginn. Nur: Wer jahrelang kommentarlos die volle Miete gezahlt hat, holt für die Vergangenheit kaum noch etwas zurück. Melden Sie das Fehlen deshalb, sobald es Ihnen auffällt.",
    fristTage: 14,
  },
  stellplatz_nicht_nutzbar: {
    slug: "stellplatz-garage-nicht-nutzbar",
    keywords: [
      "Mietminderung Stellplatz",
      "Garage nicht nutzbar Mietminderung",
      "Tiefgarage gesperrt Miete mindern",
    ],
    intro:
      "Für einen Stellplatz, auf dem Sie nicht parken können, müssen Sie nicht voll bezahlen. Ob Tiefgarage gesperrt, Tor defekt oder Platz dauerhaft fremdbelegt: Die Minderung ist berechtigt. Läuft der Stellplatz über eine eigene Miete, wird genau dieser Betrag gekürzt, notfalls komplett.",
    symptome: [
      "Stellplatz ist dauerhaft von Dritten belegt",
      "Tiefgarage ist wegen Bauarbeiten gesperrt",
      "Garagentor ist defekt und lässt sich nicht öffnen",
      "Zufahrt ist blockiert oder unbefahrbar",
    ],
    dokumentation: [
      "Blockierten Stellplatz mit Kennzeichen des Fremdfahrzeugs fotografieren",
      "Sperrzeiträume protokollieren",
      "Mietvertrag oder gesonderten Stellplatzmietvertrag beilegen",
      "Kosten für einen Ersatzparkplatz belegen",
    ],
    hinweis:
      "Schauen Sie genau hin, wie die Verträge geschnitten sind. Bei einem einheitlichen Mietvertrag mindern Sie die Gesamtmiete, bei zwei getrennten Verträgen ausschließlich die Stellplatzmiete. Wer im zweiten Fall die Wohnungsmiete kürzt, kürzt an der falschen Stelle und baut einen Rückstand auf.",
    fristTage: 14,
  },
  baugeruest: {
    slug: "baugeruest-vor-fenster",
    keywords: [
      "Mietminderung Baugerüst",
      "Gerüst vor dem Fenster Mietminderung",
      "Fassadensanierung Mietminderung",
    ],
    intro:
      "Mit einem Gerüst vor dem Fenster wohnt man plötzlich im Halbdunkel, fremde Menschen laufen am Schlafzimmer vorbei, und für Einbrecher ist der Weg nach oben frei. Dafür dürfen Sie mindern, und zwar auch dann, wenn die Bauarbeiten ordnungsgemäß angekündigt waren.",
    symptome: [
      "Deutlich weniger Tageslicht in den betroffenen Räumen",
      "Einblick von außen in Wohn- oder Schlafräume",
      "Fenster können aus Sicherheitsgründen nicht geöffnet bleiben",
      "Erhöhte Einbruchsgefahr durch den Zugang über das Gerüst",
    ],
    dokumentation: [
      "Blick aus dem Fenster mit und ohne Gerüst fotografieren",
      "Standzeit des Gerüsts taggenau protokollieren",
      "Betroffene Räume und deren Anteil an der Wohnfläche benennen",
      "Sicherungsmaßnahmen des Vermieters oder deren Fehlen dokumentieren",
    ],
    hinweis:
      "Fordern Sie schriftlich Sicherungsmaßnahmen ein, etwa Bauzäune, eine Alarmanlage oder nächtliche Kontrollen. Passiert nichts und wird über das Gerüst eingebrochen, steht der Vermieter mit in der Haftung. Ihre dokumentierte Aufforderung ist dann bares Geld wert.",
    fristTage: 14,
  },

  /* ------------------------ Gesundheitsgefahren -------------------- */
  asbest: {
    slug: "asbest",
    keywords: [
      "Mietminderung Asbest",
      "Asbest in der Wohnung Mietminderung",
      "Asbestplatten Miete mindern",
    ],
    intro:
      "Asbest ist krebserregend, daran gibt es nichts zu deuteln. Solange das Material fest verbaut und unbeschädigt ist, geht von ihm allerdings meist keine akute Gefahr aus. Kritisch wird es bei gebrochenen oder beschädigten Bauteilen, denn dann können Fasern in die Luft gelangen. Genau daran hängt die rechtliche Bewertung.",
    symptome: [
      "Beschädigte oder gebrochene Asbestzementplatten, etwa an Balkonbrüstungen",
      "Alte Nachtspeicheröfen mit Asbestbauteilen",
      "Floor-Flex-Platten oder Cushion-Vinyl-Böden aus der Zeit vor 1993",
      "Sanierungsarbeiten ohne Schutzmaßnahmen am Gebäude",
    ],
    dokumentation: [
      "Verdächtige Bauteile fotografieren, ohne sie zu berühren oder zu bearbeiten",
      "Baujahr des Gebäudes und der Einbauten ermitteln",
      "Eine Materialanalyse durch ein zugelassenes Labor beauftragen",
      "Sämtliche Korrespondenz mit dem Vermieter dokumentieren",
    ],
    hinweis:
      "Die wichtigste Regel: nicht bohren, nicht schleifen, nicht selbst entfernen. Jede Bearbeitung setzt Fasern frei und macht alles schlimmer. Bestätigt ein Labor die Faserfreisetzung, kommt neben der Minderung auch eine fristlose Kündigung wegen Gesundheitsgefährdung in Betracht (§ 569 Abs. 1 BGB).",
    fristTage: 7,
    dringend: true,
  },
  asbest_gebunden: {
    slug: "asbest-fest-gebunden",
    keywords: [
      "Asbest unbeschädigt Mietminderung",
      "fest gebundener Asbest Mietmangel",
      "Asbestplatten intakt Miete mindern",
      "Vinyl-Asbest-Platten Mietminderung",
    ],
    intro:
      "Fest gebundener Asbest, der unbeschädigt im Bauteil sitzt, ist für sich allein noch kein Mietmangel. Gerichte verlangen eine begründete Besorgnis, dass Fasern freigesetzt werden. Solange die Platten intakt sind und niemand daran arbeitet, bleibt es meist bei null Prozent oder einem symbolischen Wert.",
    symptome: [
      "Unbeschädigte Vinyl-Asbest- oder Floor-Flex-Platten aus der Zeit vor 1993",
      "Intakte Asbestzementplatten an Fassade oder Balkonbrüstung",
      "Kenntnis vom Asbest, aber keine sichtbaren Risse oder Brüche",
      "Kein Nachweis erhöhter Faserkonzentration in der Raumluft",
    ],
    dokumentation: [
      "Zustand der Bauteile fotografieren, insbesondere Kanten und Fugen",
      "Baujahr und Art der Einbauten festhalten",
      "Jede neu auftretende Beschädigung sofort und datiert dokumentieren",
      "Schriftlich festhalten, dass der Vermieter über den Asbest informiert ist",
    ],
    hinweis:
      "Der praktisch wichtigste Punkt ist nicht die Minderung, sondern das Bearbeitungsverbot: nicht bohren, nicht schleifen, nichts abschrauben. Sobald ein Bauteil bricht oder beschädigt wird, kippt die Bewertung, und Sie liegen im Bereich der beschädigten Asbestbauteile mit deutlich höheren Quoten.",
    fristTage: 14,
  },
  legionellen: {
    slug: "legionellen",
    keywords: [
      "Mietminderung Legionellen",
      "Legionellen im Trinkwasser Mietminderung",
      "Duschverbot Legionellen Miete mindern",
    ],
    intro:
      "Legionellen sind Bakterien im Warmwasser, die eine schwere Lungenentzündung auslösen können, gefährlich vor allem beim Duschen, wenn der Wassernebel eingeatmet wird. Liegen die Messwerte über den Grenzwerten der Trinkwasserverordnung, ist das ein erheblicher Mangel. Spricht das Gesundheitsamt ein Duschverbot aus, erst recht.",
    symptome: [
      "Positive Legionellenbefunde aus der turnusmäßigen Untersuchung",
      "Duschverbot oder Nutzungseinschränkung durch das Gesundheitsamt",
      "Anordnung, das Wasser vor Gebrauch abkochen zu lassen",
      "Wiederholte Befunde trotz angeblicher Sanierung",
    ],
    dokumentation: [
      "Untersuchungsergebnis beim Vermieter anfordern (Sie haben ein Auskunftsrecht)",
      "Behördliche Anordnungen und Aushänge sichern",
      "Zeitraum der Nutzungseinschränkung protokollieren",
      "Ärztliche Befunde aufbewahren, falls gesundheitliche Beschwerden auftreten",
    ],
    hinweis:
      "Bei zentraler Warmwasserversorgung muss der Vermieter regelmäßig auf Legionellen prüfen lassen, und Sie haben ein Recht auf die Ergebnisse. Fordern Sie das Prüfprotokoll schriftlich an. Rückt er es nicht heraus, sagt das für sich genommen schon einiges und lässt sich später auch so verwenden.",
    fristTage: 5,
    dringend: true,
  },
  bleirohre: {
    slug: "bleirohre",
    keywords: [
      "Mietminderung Bleirohre",
      "Blei im Trinkwasser Mietminderung",
      "alte Wasserleitungen Blei Miete mindern",
    ],
    intro:
      "In vielen Altbauten liegen noch Wasserleitungen aus Blei, und das ist ein Problem: Blei reichert sich im Körper an und gefährdet besonders Säuglinge und Schwangere. Seit 2013 gilt ein strenger Grenzwert der Trinkwasserverordnung. Wird er überschritten, liegt ein erheblicher Mangel vor.",
    symptome: [
      "Graue, weiche Wasserleitungen, die sich mit dem Fingernagel ritzen lassen",
      "Gebäude aus der Zeit vor 1973 ohne dokumentierte Leitungssanierung",
      "Laboranalyse überschreitet den Bleigrenzwert der Trinkwasserverordnung",
      "Empfehlung, Wasser vor Gebrauch ablaufen zu lassen",
    ],
    dokumentation: [
      "Sichtbare Leitungen fotografieren",
      "Wasserprobe durch ein akkreditiertes Labor analysieren lassen",
      "Analyseergebnis mit Grenzwertangabe aufbewahren",
      "Vermieter schriftlich zur Auskunft über das Leitungsmaterial auffordern",
    ],
    hinweis:
      "Über bleihaltige Leitungen muss der Vermieter Sie von sich aus informieren. Und geben Sie sich nicht mit dem Ratschlag zufrieden, das Wasser morgens erst einmal laufen zu lassen. Das ist keine Mängelbeseitigung. Bei Grenzwertüberschreitung schuldet er den Austausch der Leitungen.",
    fristTage: 14,
    dringend: true,
  },
  formaldehyd: {
    slug: "formaldehyd",
    keywords: [
      "Mietminderung Formaldehyd",
      "Schadstoffe Wohnung Mietminderung",
      "Ausdünstungen Wohnung Miete mindern",
    ],
    intro:
      "Brennende Augen und Reizhusten, die draußen sofort besser werden: So macht sich Formaldehyd oft bemerkbar. Es dünstet aus Spanplatten, Klebern und Bodenbelägen aus und gilt als krebserzeugend. Überschreitet die Raumluft die einschlägigen Richtwerte, ist das ein schwerer Mangel.",
    symptome: [
      "Stechender, chemischer Geruch, besonders in geschlossenen Räumen",
      "Augenbrennen, Kopfschmerzen und Reizhusten, die beim Verlassen der Wohnung nachlassen",
      "Beschwerden traten nach einer Renovierung oder einem Bodeneinbau auf",
      "Raumluftmessung überschreitet den Richtwert",
    ],
    dokumentation: [
      "Raumluftmessung durch ein zugelassenes Labor durchführen lassen",
      "Beschwerden ärztlich dokumentieren lassen, mit Bezug zum Aufenthalt in der Wohnung",
      "Renovierungs- und Einbaudaten sowie verwendete Materialien festhalten",
      "Symptomtagebuch führen",
    ],
    hinweis:
      "Ohne Raumluftmessung geht hier nichts, und die kostet je nach Umfang mehrere hundert Euro. Lassen Sie sich davon nicht abschrecken: Bestätigt die Messung die Überschreitung, muss der Vermieter Ihnen die Kosten als Schadensersatz nach § 536a Abs. 1 BGB zurückzahlen.",
    fristTage: 10,
    dringend: true,
  },

  /* ---------------------------- Gerüche ---------------------------- */
  abwasser_geruch: {
    slug: "abwassergeruch",
    keywords: [
      "Mietminderung Abwassergeruch",
      "Kanalgeruch Wohnung Mietminderung",
      "es stinkt aus dem Abfluss Miete mindern",
    ],
    intro:
      "Wenn es dauerhaft nach Kanal riecht, stimmt etwas mit der Installation nicht. Meist ist die Rohrentlüftung defekt oder eine Leitung undicht. Der Geruch zermürbt auf Dauer, und die Rechtsprechung erkennt ihn als Mangel im mittleren Prozentbereich an.",
    symptome: [
      "Fäkalienartiger Geruch aus Abflüssen in Bad, Küche oder WC",
      "Geruch verstärkt sich bei Wetterwechsel oder Unterdruck",
      "Blubbernde Geräusche in den Abflussrohren",
      "Geruch bleibt trotz gefüllter Geruchsverschlüsse bestehen",
    ],
    dokumentation: [
      "Geruchsprotokoll mit Datum, Uhrzeit, Ort und Intensität führen",
      "Besucher als Zeugen benennen und schriftlich bestätigen lassen",
      "Dokumentieren, dass alle Siphons gefüllt sind. Das schließt die naheliegendste eigene Ursache aus",
      "Handwerkerberichte und Kamerabefahrungen aufbewahren",
    ],
    hinweis:
      "Der Standardeinwand des Vermieters lautet: ausgetrockneter Siphon. Nehmen Sie ihm den vorweg, indem Sie alle Geruchsverschlüsse mit Wasser füllen, auch die vergessenen wie den Bodenablauf hinter der Waschmaschine, und das schriftlich festhalten. Riecht es danach immer noch, liegt die Ursache tiefer im System.",
    fristTage: 10,
  },
  muell_geruch: {
    slug: "muellgeruch",
    keywords: [
      "Mietminderung Müllgeruch",
      "Mülltonnen stinken Mietminderung",
      "Müllraum Geruch Miete mindern",
    ],
    intro:
      "Mülltonnen direkt unterm Fenster können einem im Sommer die ganze Wohnung verleiden: Fenster auf heißt dann Gestank herein. Kümmert sich der Vermieter nicht um häufigere Leerung, Reinigung oder einen anderen Standplatz, ist das ein Mangel.",
    symptome: [
      "Anhaltender Müllgeruch in der Wohnung",
      "Fenster können im Sommer nicht geöffnet werden",
      "Überfüllte Tonnen, unregelmäßige Abholung",
      "Müllraum wird nicht gereinigt und zieht Ungeziefer an",
    ],
    dokumentation: [
      "Überfüllte Tonnen und Standplatz mit Datum fotografieren",
      "Geruchsprotokoll führen, Wetterlage und Temperatur vermerken",
      "Abholrhythmus und ausgefallene Leerungen dokumentieren",
      "Entfernung des Standplatzes zum eigenen Fenster angeben",
    ],
    hinweis:
      "Beschweren Sie sich nicht allgemein über „den Gestank“, sondern benennen Sie die Abhilfe, die Sie erwarten: öfter leeren, regelmäßig reinigen oder den Standplatz verlegen. Eine konkrete Forderung lässt sich schwer aussitzen, eine allgemeine Klage schon.",
    fristTage: 14,
  },
  gewerbe_geruch: {
    slug: "geruch-gastronomie-gewerbe",
    keywords: [
      "Mietminderung Geruch Restaurant",
      "Imbiss im Haus Geruch Mietminderung",
      "Gewerbegeruch Wohnung Miete mindern",
    ],
    intro:
      "Wenn das Sofa nach Frittenfett riecht, obwohl Sie nie frittieren, sitzt darunter vermutlich ein Imbiss oder Restaurant. Betriebsgerüche ziehen über Schächte und die Fassade in die Wohnung, und sie setzen sich fest. Hat der Betrieb erst nach Ihrem Einzug eröffnet, ist die Belastung ein Mangel.",
    symptome: [
      "Frittier-, Grill- oder Fettgeruch in der Wohnung",
      "Geruch tritt zu den Betriebszeiten des Gewerbes auf",
      "Abluftanlage mündet in unmittelbarer Fensternähe",
      "Textilien und Möbel nehmen den Geruch an",
    ],
    dokumentation: [
      "Geruchsprotokoll führen und mit den Öffnungszeiten des Betriebs abgleichen",
      "Lage und Mündung der Abluftanlage fotografieren",
      "Zeugen benennen, etwa andere betroffene Mieter",
      "Beschwerden beim Ordnungsamt oder der Bauaufsicht dokumentieren",
    ],
    hinweis:
      "Werfen Sie einen Blick auf die Abluftanlage des Betriebs. Baurechtlich muss sie häufig über das Dach geführt werden; endet sie stattdessen neben Ihrem Fenster, ist das womöglich gar nicht zulässig. Mit diesem Argument haben Sie sowohl beim Vermieter als auch bei der Bauaufsicht einen Hebel.",
    fristTage: 14,
  },
};
