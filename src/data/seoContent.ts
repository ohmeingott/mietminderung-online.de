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
  /** Second paragraph — category-specific legal framing. */
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
      "Eine funktionierende Heizung und warmes Wasser gehören zum vertragsgemäßen Zustand jeder Mietwohnung. Fällt die Heizung in der Heizperiode aus oder bleibt die Wohnung dauerhaft zu kalt, zählt das zu den Mängeln mit den höchsten anerkannten Minderungsquoten überhaupt.",
    rechtliches:
      "Als Heizperiode gilt in der Rechtsprechung üblicherweise der Zeitraum vom 1. Oktober bis 30. April. In dieser Zeit schuldet der Vermieter Raumtemperaturen von etwa 20 bis 22 °C in Wohnräumen. Wird dieser Wert unterschritten, liegt ein Mangel im Sinne des § 536 Abs. 1 BGB vor — unabhängig davon, ob den Vermieter ein Verschulden trifft.",
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
      "Schimmel und Durchfeuchtung sind die am häufigsten gemeldeten Wohnungsmängel in Deutschland. Sie beeinträchtigen nicht nur den Wohnwert, sondern können die Gesundheit gefährden — entsprechend hoch fallen die von Gerichten zugesprochenen Minderungsquoten aus.",
    rechtliches:
      "Streit entsteht fast immer über die Ursache. Wichtig für Mieter: Beruft sich der Vermieter darauf, der Schimmel sei durch falsches Lüften oder Heizen entstanden, muss er das beweisen. Zunächst muss er ausschließen, dass bauliche Ursachen wie Wärmebrücken, mangelnde Dämmung oder aufsteigende Feuchtigkeit vorliegen.",
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
      "Lärm ist ein sogenannter Umweltmangel: Er betrifft nicht die Bausubstanz, mindert aber die Tauglichkeit der Wohnung zum vertragsgemäßen Gebrauch. Entscheidend ist, ob die Belastung das ortsübliche und sozialadäquate Maß überschreitet.",
    rechtliches:
      "Normaler Wohnlärm in einem Mehrfamilienhaus, spielende Kinder oder Straßenlärm in einer Innenstadtlage, die dem Mieter bei Vertragsschluss bekannt war, begründen keine Minderung. Erst eine deutliche Verschlechterung gegenüber dem Zustand bei Einzug — etwa eine neue Baustelle oder ein neu eröffneter Gastronomiebetrieb — ist ein Mangel. Ohne lückenloses Lärmprotokoll ist der Anspruch vor Gericht kaum durchsetzbar.",
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
      "Ein Schädlingsbefall in der Mietwohnung ist ein Mangel, sobald er über einzelne Tiere hinausgeht. Die Bekämpfung ist grundsätzlich Sache des Vermieters — er trägt die Kosten für den Kammerjäger, solange der Mieter den Befall nicht selbst verursacht hat.",
    rechtliches:
      "Maßgeblich ist die Befallsstärke, nicht die bloße Sichtung. Eine einzelne Maus im Keller oder eine vereinzelte Spinne reicht nicht aus. Bei nachgewiesenem Befall besteht neben dem Minderungsrecht auch ein Anspruch auf Beseitigung nach § 535 Abs. 1 Satz 2 BGB.",
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
      "Undichte oder klemmende Fenster und Türen kosten Wärme, Sicherheit und Wohnqualität. Sie sind zugleich häufig die Ursache weiterer Mängel — etwa Schimmel an den Fensterlaibungen oder dauerhaft zu niedriger Raumtemperatur.",
    rechtliches:
      "Der Vermieter schuldet Fenster und Türen in einem Zustand, der eine normale Nutzung erlaubt. Altersbedingter Verschleiß entlastet ihn nicht: Auch in einem Altbau muss ein Fenster schließen. Sicherheitsrelevante Defekte — etwa eine nicht abschließbare Wohnungstür — rechtfertigen deutlich höhere Quoten als reine Komfortmängel.",
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
      "Bad und WC gehören zum Kernbestand einer bewohnbaren Wohnung. Fällt die einzige Toilette oder die Dusche aus, sprechen Gerichte sehr hohe Minderungsquoten zu — kleinere Sanitärmängel bleiben dagegen oft im Bagatellbereich.",
    rechtliches:
      "Entscheidend ist, ob eine zumutbare Ausweichmöglichkeit besteht. Gibt es ein zweites WC oder eine Badewanne neben der defekten Dusche, fällt die Quote deutlich geringer aus. Ein tropfender Wasserhahn allein ist in der Regel ein unerheblicher Mangel nach § 536 Abs. 1 Satz 3 BGB.",
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
      "Für Küchengeräte gilt eine einfache Faustregel: Der Vermieter haftet nur für das, was er mitvermietet hat. Steht die Einbauküche im Mietvertrag oder in der Übergabeliste, muss er sie instand halten — hat der Mieter sie selbst eingebaut, besteht kein Minderungsrecht.",
    rechtliches:
      "Prüfen Sie zuerst Mietvertrag und Übergabeprotokoll. Ist ein Gerät als Teil der Mietsache aufgeführt, schuldet der Vermieter dessen Funktionsfähigkeit nach § 535 Abs. 1 Satz 2 BGB. Kleinreparaturklauseln können den Mieter an den Kosten beteiligen, sie beseitigen aber nicht das Minderungsrecht.",
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
      "Ein im Mietvertrag zugesagter oder bei Einzug vorhandener Aufzug gehört zur Mietsache. Fällt er länger aus, hängt die Minderungsquote vor allem von der Etage und der persönlichen Situation der Bewohner ab.",
    rechtliches:
      "Je höher die Wohnung liegt, desto größer die Beeinträchtigung — und desto höher die anerkannte Quote. Bei Gehbehinderung, hohem Alter oder kleinen Kindern kommen Gerichte zu deutlich höheren Werten. Kurze Wartungsausfälle von wenigen Stunden sind dagegen hinzunehmen.",
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
      "Eine funktionierende Stromversorgung ist Grundvoraussetzung für die Bewohnbarkeit. Bei einem kompletten Ausfall kann die Miete bis auf null sinken, während einzelne defekte Steckdosen im Bagatellbereich bleiben.",
    rechtliches:
      "Bei technischen Anschlüssen wie Internet, Kabel-TV oder Gegensprechanlage kommt es darauf an, ob sie vertraglich Teil der Mietsache sind. Sicherheitsrelevante Mängel wie eine dauerhaft dunkle Treppenhausbeleuchtung wiegen schwerer als reine Komforteinbußen.",
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
      "Weicht die tatsächliche Wohnfläche erheblich von der im Mietvertrag vereinbarten ab, zahlen Sie dauerhaft für Quadratmeter, die es nicht gibt. Das ist einer der wenigen Mängel, bei denen die Minderung rechnerisch exakt bestimmbar ist.",
    rechtliches:
      "Nach ständiger Rechtsprechung des BGH gilt eine Wohnflächenabweichung von mehr als zehn Prozent als erheblicher Mangel; die Miete ist dann im Verhältnis der Abweichung gemindert. Bei geringeren Abweichungen muss der Mieter eine konkrete Beeinträchtigung darlegen.",
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
      "Balkon, Terrasse, Keller und Stellplatz sind mitvermietete Nebenflächen, sobald sie im Mietvertrag genannt oder bei Einzug übergeben wurden. Ihre Unbenutzbarkeit rechtfertigt eine Minderung der Gesamtmiete.",
    rechtliches:
      "Die Quote hängt stark von der Jahreszeit ab: Ein unbenutzbarer Balkon wiegt im Sommer deutlich schwerer als im Winter, weshalb Gerichte hier saisonal differenzieren. Wird für einen Stellplatz eine gesonderte Miete gezahlt, bezieht sich die Minderung auf diesen Teilbetrag.",
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
      "Schadstoffe in Bausubstanz oder Trinkwasser sind besonders schwerwiegende Mängel. Neben dem Minderungsrecht kommen hier regelmäßig ein Anspruch auf Schadensersatz und im Extremfall die fristlose Kündigung nach § 569 Abs. 1 BGB in Betracht.",
    rechtliches:
      "Maßgeblich ist die Überschreitung geltender Grenzwerte — etwa nach Trinkwasserverordnung bei Legionellen und Blei. Eine bloß theoretische Gefährdung genügt nicht; ein Messprotokoll oder Gutachten ist praktisch unverzichtbar. Bei akuter Gesundheitsgefahr sollten Sie umgehend das Gesundheitsamt einschalten.",
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
      "Anhaltende Gerüche machen eine Wohnung unbenutzbar, ohne sichtbare Spuren zu hinterlassen — was die Beweisführung erschwert. Wie bei Lärm gilt: Nur eine Belastung über dem ortsüblichen Maß ist ein Mangel.",
    rechtliches:
      "Führen Sie ein Geruchsprotokoll mit Datum, Uhrzeit, Dauer und Intensität und benennen Sie Zeugen. Kurzzeitige Küchengerüche aus Nachbarwohnungen sind sozialadäquat und begründen keine Minderung; dauerhafter Abwasser- oder Müllgeruch dagegen schon.",
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
      "Der vollständige Heizungsausfall in der Heizperiode ist der schwerwiegendste Mangel im gesamten Mietrecht. Sinkt die Raumtemperatur unter 18 °C, ist die Wohnung praktisch unbewohnbar — Gerichte haben in solchen Fällen Minderungen bis zu 100 Prozent zugesprochen.",
    symptome: [
      "Alle Heizkörper bleiben kalt, auch nach vollständigem Aufdrehen",
      "Raumtemperatur unter 18 °C zwischen Oktober und April",
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
      "Ein Heizungsausfall im Winter ist ein Notfall. Setzen Sie eine sehr kurze Frist und weisen Sie ausdrücklich auf die Gesundheitsgefahr hin. Bleibt der Vermieter untätig, dürfen Sie nach § 536a Abs. 2 BGB die Mängelbeseitigung selbst veranlassen und die Kosten ersetzt verlangen — etwa durch die Anmietung von Heizlüftern.",
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
      "Bleibt nur ein Teil der Wohnung kalt, richtet sich die Minderung nach der Bedeutung des betroffenen Raums. Ein unbeheizbares Wohn- oder Schlafzimmer wiegt deutlich schwerer als ein kalter Abstellraum.",
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
      "Geben Sie in der Mängelanzeige genau an, welche Räume betroffen sind und wie viele Quadratmeter das sind. Diese Angabe ist die Grundlage, an der sich die Minderungsquote im Streitfall bemisst.",
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
      "Auch eine laufende Heizung kann mangelhaft sein: Der Vermieter schuldet in Wohnräumen tagsüber Temperaturen von etwa 20 bis 22 °C. Wird dieser Wert dauerhaft nicht erreicht, liegt ein Mangel vor — selbst wenn die Heizkörper lauwarm sind.",
    symptome: [
      "Raumtemperatur bleibt trotz voll aufgedrehter Thermostate unter 20 °C",
      "Heizkörper werden nur handwarm statt heiß",
      "Wohnung kühlt nachts stark aus und erwärmt sich tagsüber kaum",
      "Erhöhter Heizaufwand ohne spürbares Ergebnis",
    ],
    dokumentation: [
      "Über mindestens zwei Wochen morgens, mittags und abends messen und protokollieren",
      "Außentemperatur mitnotieren — sie ist für die Bewertung relevant",
      "Thermostatstellung fotografieren, um Bedienfehler auszuschließen",
      "Bei Nachtabsenkung: prüfen und dokumentieren, ab wann die Temperatur wieder steigt",
    ],
    hinweis:
      "Nachtabsenkungen auf etwa 18 °C zwischen 23 und 6 Uhr sind zulässig und begründen keine Minderung. Messen Sie deshalb bewusst auch tagsüber, sonst entkräftet der Vermieter Ihr Protokoll leicht.",
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
      "Warmes Wasser schuldet der Vermieter ganzjährig und rund um die Uhr — üblicherweise mit mindestens 40 bis 50 °C an der Zapfstelle. Ein vollständiger Ausfall ist immer ein erheblicher Mangel, unabhängig von der Jahreszeit.",
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
      "Ausfall sofort schriftlich melden — die Minderung wirkt erst ab Kenntnis des Vermieters",
    ],
    hinweis:
      "Die Höhe der Minderung hängt stark von der Dauer ab. Ein Ausfall über wenige Stunden ist hinzunehmen; bei Tagen oder Wochen bewegen sich anerkannte Quoten am oberen Ende der Spanne.",
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
      "Muss das Wasser minutenlang laufen, bis es warm wird, ist das kein Komfortproblem, sondern ein Mangel — Sie bezahlen das ungenutzt ablaufende Wasser über die Nebenkosten mit. Als zumutbar gilt eine Vorlaufzeit von wenigen Sekunden.",
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
      "Dieser Mangel liegt im unteren Prozentbereich, ist aber gut nachweisbar und dauerhaft. Er lässt sich sinnvoll mit anderen Mängeln in einer gemeinsamen Mängelanzeige kombinieren.",
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
      "Klopfende, gluckernde oder pfeifende Heizungsrohre stören besonders nachts empfindlich die Nachtruhe. Gerichte werten dauerhafte Heizungsgeräusche als eigenständigen Mangel mit spürbaren Minderungsquoten.",
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
      "Bitten Sie zunächst um eine fachgerechte Entlüftung und einen hydraulischen Abgleich der Anlage. Wenn das dokumentiert erfolglos bleibt, ist Ihre Position für eine Minderung deutlich stärker.",
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
      "Auch ein kleiner, oberflächlicher Schimmelfleck ist ein Mangel und kein hinzunehmender Schönheitsfehler. Sporen belasten die Raumluft, und unbehandelter Befall breitet sich fast immer weiter aus.",
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
      "Lüftungsverhalten dokumentieren — Stoßlüften morgens und abends notieren",
    ],
    hinweis:
      "Entfernen Sie den Schimmel nicht vollständig, bevor der Vermieter ihn gesehen oder Sie ihn fotografiert haben — sonst fehlt Ihnen der Nachweis. Für die Ursachenfrage gilt: Der Vermieter muss beweisen, dass Ihr Lüftungsverhalten die Ursache ist, nicht umgekehrt.",
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
      "Großflächiger Schimmel in mehreren Räumen ist ein schwerer Mangel mit Gesundheitsrelevanz. Die Rechtsprechung erkennt hier Minderungsquoten bis zur Hälfte der Bruttowarmmiete an, in Extremfällen deutlich darüber.",
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
      "Ein Sachverständigengutachten zur Ursache erwägen — es ist im Streitfall das stärkste Beweismittel",
    ],
    hinweis:
      "Bei massivem Befall kommt neben der Minderung eine fristlose Kündigung wegen Gesundheitsgefährdung nach § 569 Abs. 1 BGB in Betracht. Lassen Sie sich vor diesem Schritt unbedingt vom Mieterverein oder einem Anwalt beraten.",
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
      "Feuchte Wände sind die Vorstufe zum Schimmel und ein Mangel für sich. Ursache sind meist bauliche Defekte — aufsteigende Feuchtigkeit, undichte Leitungen oder fehlende Abdichtung — und damit klar der Verantwortungsbereich des Vermieters.",
    symptome: [
      "Dunkle Flecken oder Ränder an Wänden, oft am Sockel",
      "Abplatzender Putz, Salzausblühungen oder sich lösende Tapete",
      "Wand fühlt sich beim Anfassen kühl und klamm an",
      "Erhöhte Luftfeuchtigkeit trotz regelmäßigem Lüften",
    ],
    dokumentation: [
      "Feuchtigkeit mit einem Baufeuchtemessgerät messen — einfache Geräte sind günstig",
      "Betroffene Flächen fotografieren und die Ausdehnung über Wochen dokumentieren",
      "Raumluftfeuchtigkeit mit einem Hygrometer protokollieren",
      "Datum des ersten Auftretens und die Entwicklung schriftlich festhalten",
    ],
    hinweis:
      "Handeln Sie früh: Solange nur die Wand feucht ist, bleibt die Quote moderat. Kommt Schimmel hinzu, steigt sie erheblich — Ihre frühzeitige Mängelanzeige sichert Ihnen dann den Anspruch ab dem ersten Tag.",
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
      "Ein Wasserschaden macht Teile der Wohnung von einem Moment auf den anderen unbenutzbar. Für die Minderung ist unerheblich, wer ihn verursacht hat — auch bei einem Rohrbruch im Nachbarhaus oder höherer Gewalt bleibt Ihr Minderungsrecht bestehen.",
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
      "Die Mietminderung ist verschuldensunabhängig — Sie müssen dem Vermieter nichts nachweisen. Für Schäden an Ihrem eigenen Hausrat ist dagegen Ihre Hausratversicherung zuständig, nicht die Minderung.",
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
      "Die Trocknung nach einem Wasserschaden ist oft belastender als der Schaden selbst: Bautrockner laufen rund um die Uhr, sind extrem laut und treiben die Stromkosten in die Höhe. Gerichte erkennen dafür hohe Minderungsquoten an, in Einzelfällen bis 100 Prozent.",
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
      "Die Stromkosten der Trocknungsgeräte muss der Vermieter erstatten — verlangen Sie diese Erstattung ausdrücklich zusätzlich zur Mietminderung und dokumentieren Sie die Zählerstände.",
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
      "Ist ein Kellerabteil im Mietvertrag genannt oder wurde es bei Einzug übergeben, gehört es zur Mietsache. Ein feuchter Keller, in dem nichts gelagert werden kann, mindert daher die Gesamtmiete.",
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
      "Ein gewisses Maß an Kellerfeuchte ist in Altbauten üblich und hinzunehmen. Ein Mangel liegt erst vor, wenn eine Lagerung praktisch unmöglich wird — belegen Sie das konkret mit beschädigten Gegenständen.",
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
      "Baulärm im eigenen Haus oder auf dem Nachbargrundstück gehört zu den häufigsten Minderungsgründen. Entscheidend ist die Verschlechterung gegenüber dem Zustand bei Einzug: Eine neue Baustelle ist ein Mangel, eine schon bei Vertragsschluss sichtbare in der Regel nicht.",
    symptome: [
      "Bohren, Hämmern, Fräsen oder Baumaschinenlärm über Wochen",
      "Erschütterungen, Staub und Schmutz in der Wohnung",
      "Arbeiten während der üblichen Ruhezeiten oder am Wochenende",
      "Homeoffice, Schlaf oder Erholung sind erheblich beeinträchtigt",
    ],
    dokumentation: [
      "Lärmprotokoll führen: Datum, Uhrzeit von/bis, Art des Lärms, Intensität — täglich und lückenlos",
      "Lautstärke mit einer Schallpegel-App messen und die Werte im Protokoll festhalten",
      "Video- und Tonaufnahmen mit sichtbarem Datum anfertigen",
      "Bauschild, Aushänge und Ankündigungsschreiben des Vermieters fotografieren",
    ],
    hinweis:
      "Das Lärmprotokoll ist hier alles. Ohne tägliche, lückenlose Aufzeichnungen scheitern Minderungsansprüche wegen Lärm vor Gericht regelmäßig — eine pauschale Beschreibung genügt nicht.",
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
      "Straßenlärm begründet nur dann eine Minderung, wenn er sich nach Vertragsschluss deutlich verstärkt hat — etwa durch eine neue Baustelle, eine Umleitung oder eine geänderte Verkehrsführung. Die bei Einzug vorhandene Lärmkulisse ist Vertragsgrundlage.",
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
      "Beschreiben Sie in der Mängelanzeige ausdrücklich, wie die Situation bei Einzug war und was sich seitdem verändert hat. Genau diese Gegenüberstellung entscheidet über den Anspruch.",
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
      "Dauerhafter Lärm aus der Nachbarwohnung kann eine Minderung rechtfertigen — allerdings nur, wenn er das sozialadäquate Maß deutlich überschreitet. Normale Wohngeräusche, spielende Kinder und gelegentliche Feiern gehören zum Zusammenleben im Mehrfamilienhaus.",
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
      "Richten Sie die Mängelanzeige an den Vermieter, nicht an die Nachbarn: Er ist verpflichtet, gegen störende Mieter vorzugehen. Bleibt er untätig, obwohl Sie ihn nachweislich informiert haben, wird der Lärm zu einem Mangel, für den er einsteht.",
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
      "Eine Kneipe, ein Restaurant oder ein Club im selben Haus bringt Lärm bis tief in die Nacht, Gästegespräche vor dem Eingang und oft zusätzliche Geruchsbelästigung. Eröffnet der Betrieb erst nach Ihrem Einzug, ist das ein klarer Mangel.",
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
      "Prüfen Sie zusätzlich, ob der Betrieb die genehmigten Öffnungszeiten oder Immissionsrichtwerte überschreitet. Eine Beschwerde beim Ordnungsamt schafft Aktenlage, die Ihre Position gegenüber dem Vermieter erheblich stärkt.",
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
      "Wohnungen direkt am Aufzugsschacht leiden unter Rattern, Summen und Türgeräuschen — besonders nachts. Überschreiten die Geräusche die technischen Richtwerte für Schallschutz, liegt ein Mangel vor.",
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
      "Verlangen Sie eine Wartung und die Prüfung der Körperschallentkopplung. Bleibt der Vermieter untätig, obwohl eine technische Lösung möglich wäre, stärkt das Ihren Minderungsanspruch.",
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
      "Kakerlaken gelten als Hygieneschädlinge und sind meldepflichtig. Ein Befall ist immer ein erheblicher Mangel — bei starkem Befall haben Gerichte Minderungen weit über die üblichen Werte hinaus zugesprochen.",
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
      "Die Kosten der Schädlingsbekämpfung trägt der Vermieter. Sie sind verpflichtet, den Befall unverzüglich zu melden und die Bekämpfung zu dulden — verweigern Sie den Zutritt, riskieren Sie Ihr Minderungsrecht.",
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
      "Ratten übertragen Krankheiten und beschädigen Bausubstanz und Leitungen. Ein nachgewiesener Befall in Wohnung, Keller oder Hof ist ein schwerer Mangel und zugleich ein Fall für das Gesundheitsamt.",
    symptome: [
      "Sichtungen im Keller, Hof, Müllbereich oder in der Wohnung",
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
      "Rattenbefall ist in den meisten Bundesländern meldepflichtig. Die Meldung beim Gesundheitsamt kostet nichts, erzeugt aber eine amtliche Bestätigung des Befalls — das stärkste Beweismittel, das Sie bekommen können.",
    fristTage: 3,
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
      "Ein echter Mäusebefall — nicht eine einzelne verirrte Maus — beeinträchtigt Hygiene und Wohnqualität erheblich. Mäuse verunreinigen Lebensmittel und nagen Kabel an, was zusätzlich Brandgefahr bedeutet.",
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
      "Eine einzelne Maus im Keller reicht für eine Minderung nicht aus. Nachweisbar wiederkehrender Befall in Wohnräumen schon — dokumentieren Sie deshalb über mehrere Wochen, nicht nur ein einzelnes Ereignis.",
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
      "Bettwanzen machen erholsamen Schlaf unmöglich und sind ohne professionelle Bekämpfung kaum loszuwerden. Der Befall gilt als erheblicher Mangel; die Bekämpfungskosten trägt grundsätzlich der Vermieter.",
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
      "Bekämpfen Sie Bettwanzen nicht in Eigenregie mit Hausmitteln — das verschleppt den Befall und kann Ihnen als Mitverschulden ausgelegt werden. Melden Sie sofort und bestehen Sie auf professioneller Bekämpfung.",
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
      "Vereinzelte Silberfische sind normal und kein Mangel. Ein starker Befall dagegen schon — und er ist meist ein Symptom: Silberfische brauchen dauerhaft hohe Luftfeuchtigkeit, was auf ein Feuchtigkeitsproblem im Gebäude hindeutet.",
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
      "Weisen Sie in der Mängelanzeige auf die wahrscheinliche Ursache hin: Wird nur bekämpft und nicht die Feuchtigkeit beseitigt, kommen die Tiere zurück. Die Feuchtigkeitsursache ist zugleich ein eigenständiger, oft höher zu bewertender Mangel.",
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
      "Ein Wespen- oder Hornissennest am Balkon, unter dem Dach oder direkt am Fenster macht die Nutzung dieser Bereiche unmöglich — bei Allergikern besteht sogar akute Gesundheitsgefahr.",
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
      "Wespen, Hornissen und Wildbienen stehen unter Naturschutz — die Entfernung darf nur ein Fachbetrieb mit behördlicher Genehmigung vornehmen. Entfernen Sie ein Nest niemals selbst; das ist gefährlich und kann bußgeldpflichtig sein.",
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
      "Undichte Fenster kosten Wärme, treiben die Heizkosten und begünstigen Schimmel an den Laibungen. Der Vermieter schuldet Fenster, die schließen und dichten — auch im Altbau.",
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
      "Das Kerzentest-Video ist ein einfaches, sehr überzeugendes Beweismittel. Filmen Sie bei geschlossenem Fenster, damit der Vermieter den Einwand des offenen Fensters nicht erheben kann.",
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
      "Ein Fenster, das sich nicht öffnen lässt, verhindert das Stoßlüften — und damit genau das Verhalten, das der Vermieter im Schimmelfall vom Mieter verlangt. Der Mangel wird pro betroffenem Fenster bewertet.",
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
      "Weisen Sie ausdrücklich auf den Zusammenhang mit der Schimmelvorbeugung hin. Falls später Schimmel entsteht, ist bereits aktenkundig, dass ausreichendes Lüften durch einen vom Vermieter zu vertretenden Mangel unmöglich war.",
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
      "Ein Fenster, das nicht mehr schließt, ist gleich doppelt problematisch: Es bedeutet Wärmeverlust und Nässe und zugleich ein offenes Einbruchsrisiko. Diese Kombination rechtfertigt eine spürbare Minderung.",
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
      "Behandeln Sie das als dringenden Mangel und setzen Sie eine kurze Frist. Kommt es zu einem Einbruch, nachdem Sie den Defekt gemeldet haben, kann der Vermieter zusätzlich schadensersatzpflichtig sein.",
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
      "Eine nicht abschließbare Wohnungs- oder Haustür ist ein Sicherheitsmangel. Die Bandbreite der Gerichtsentscheidungen ist groß und hängt stark davon ab, wie zugänglich das Gebäude ist und wie leicht sich die Tür überwinden lässt.",
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
      "Melden Sie den Defekt sofort und schriftlich. Wird nach der Meldung eingebrochen, haftet der Vermieter unter Umständen für den Schaden — das setzt aber voraus, dass Sie den Zeitpunkt der Meldung beweisen können.",
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
      "Eine defekte Klingel oder Gegensprechanlage ist ein kleiner, aber anerkannter Mangel: Besuch, Post und Lieferungen erreichen Sie nicht mehr zuverlässig. Die Quoten liegen im niedrigen einstelligen Bereich.",
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
      "Dieser Mangel liegt für sich genommen an der Bagatellgrenze. Er entfaltet Wirkung vor allem als Teil einer Gesamtaufstellung — führen Sie ihn zusammen mit anderen Mängeln in einer Mängelanzeige auf.",
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
      "Ist die einzige Toilette der Wohnung unbenutzbar, fehlt eine elementare Grundfunktion. Gerichte haben in solchen Fällen Minderungen bis zu 80 Prozent zugesprochen — es zählt zu den schwerwiegendsten Sanitärmängeln überhaupt.",
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
      "Das ist ein Notfall: Der Vermieter muss unverzüglich handeln, notfalls über den Notdienst. Reagiert er nicht binnen Stunden, dürfen Sie nach § 536a Abs. 2 BGB selbst einen Installateur beauftragen und die Kosten erstattet verlangen.",
    fristTage: 1,
    dringend: true,
  },
  dusche_defekt: {
    slug: "dusche-defekt",
    keywords: [
      "Mietminderung Dusche defekt",
      "Duschkabine undicht Mietminderung",
      "Dusche kaputt Miete mindern",
    ],
    intro:
      "Eine defekte Dusche beeinträchtigt die tägliche Körperpflege. Wie hoch die Minderung ausfällt, hängt maßgeblich davon ab, ob eine zumutbare Alternative wie eine funktionierende Badewanne vorhanden ist.",
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
      "Eine undichte Dusche verursacht Folgeschäden an Estrich und Nachbarwohnungen. Melden Sie sofort und schriftlich — sonst kann Ihnen der Vermieter eine Verletzung der Anzeigepflicht nach § 536c BGB vorwerfen und Schadensersatz verlangen.",
    fristTage: 7,
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
      "Zu geringer Wasserdruck macht Duschen und Spülen mühsam und kann bei Durchlauferhitzern dazu führen, dass die Warmwasserbereitung gar nicht erst anspringt. Der Mangel liegt im unteren Prozentbereich, ist aber dauerhaft.",
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
      "Reinigen oder tauschen Sie zuerst den Perlator und halten Sie das fest. Bleibt der Druck danach zu niedrig, ist der Einwand entkräftet, es habe an einer verkalkten Armatur in Ihrem Verantwortungsbereich gelegen.",
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
      "Ein Bad ohne funktionierende Entlüftung führt zwangsläufig zu Feuchtigkeit und Schimmel. Bei innenliegenden Bädern ohne Fenster ist die Abluftanlage die einzige Möglichkeit, Feuchtigkeit abzuführen — ihr Ausfall ist ein klarer Mangel.",
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
      "Melden Sie diesen Mangel, bevor Schimmel entsteht. Dann können Sie später nicht dafür verantwortlich gemacht werden — die Ursache liegt dokumentiert im Verantwortungsbereich des Vermieters.",
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
      "Eine defekte Spülung macht das WC nicht unbenutzbar, aber unhygienisch und umständlich. Ein dauerhaft nachlaufender Spülkasten verursacht zusätzlich erhebliche Wasserkosten, die über die Nebenkosten bei Ihnen landen.",
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
      "Verlangen Sie neben der Reparatur ausdrücklich, dass der durch den Defekt verursachte Mehrverbrauch nicht Ihnen belastet wird. Ihre notierten Zählerstände sind dafür die Grundlage.",
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
      "Ein defekter Herd berechtigt zur Minderung, wenn er vom Vermieter gestellt wurde und Teil der Mietsache ist. Die Quoten liegen im niedrigen einstelligen Bereich, solange nur einzelne Kochstellen ausfallen.",
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
      "Prüfen Sie den Mietvertrag auf eine Kleinreparaturklausel. Sie kann Sie an den Reparaturkosten beteiligen, wenn die Grenzen wirksam vereinbart sind — Ihr Recht auf Mietminderung berührt sie aber nicht.",
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
      "Ein vom Vermieter gestellter Kühlschrank, der nicht mehr kühlt, macht die Lagerung von Lebensmitteln unmöglich. Neben der Minderung können Sie den Ersatz verdorbener Lebensmittel verlangen.",
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
      "Verdorbene Lebensmittel sind ein Schaden nach § 536a Abs. 1 BGB und werden zusätzlich zur Minderung ersetzt. Fotografieren Sie deshalb den Inhalt, bevor Sie ihn entsorgen, und heben Sie Belege auf.",
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
      "Eine mitvermietete Spülmaschine muss der Vermieter instand halten. Ist sie im Mietvertrag aufgeführt, rechtfertigt ihr Ausfall eine Minderung im niedrigen einstelligen Bereich.",
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
      "Haben Sie die Maschine selbst angeschafft, besteht kein Minderungsrecht — der Vermieter schuldet nur, was er mitvermietet hat. Klären Sie das zuerst anhand Ihrer Vertragsunterlagen.",
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
      "Ist die gesamte Küche unbenutzbar — etwa nach einem Wasserschaden, bei Umbauarbeiten oder wenn eine zugesagte Einbauküche fehlt —, entfällt eine Kernfunktion der Wohnung. Gerichte erkennen hier Quoten bis 100 Prozent an, wenn der Zustand länger andauert.",
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
      "Bei längerer Unbenutzbarkeit muss der Vermieter eine zumutbare Zwischenlösung anbieten, etwa eine provisorische Kochgelegenheit. Verlangen Sie das ausdrücklich — die Weigerung stärkt Ihre Position bei der Höhe der Minderung.",
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
      "Ein längerer Aufzugsausfall ist ein Mangel, sobald der Aufzug bei Einzug vorhanden oder vertraglich zugesagt war. Die anerkannte Quote steigt mit jeder Etage, die Sie ohne ihn überwinden müssen.",
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
      "Kurze Wartungsausfälle von wenigen Stunden sind hinzunehmen. Führen Sie deshalb die Ausfalltage einzeln auf — eine taggenaue Aufstellung ist die Basis der Berechnung, wenn der Ausfall nicht den ganzen Monat andauerte.",
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
      "Ab etwa der vierten Etage wiegt ein Aufzugsausfall deutlich schwerer. Kommen eine Gehbehinderung, hohes Alter oder kleine Kinder hinzu, haben Gerichte Minderungsquoten bis 50 Prozent zugesprochen.",
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
      "Legen Sie Ihre persönliche Situation in der Mängelanzeige ausdrücklich dar. Genau diese individuellen Umstände heben die Quote deutlich über den Standardwert — ohne den Hinweis bleibt es beim allgemeinen Ansatz.",
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
      "Ohne Strom ist eine Wohnung nicht bewohnbar: kein Licht, keine Heizungssteuerung, keine Kühlung, keine Warmwasserbereitung. Bei länger andauerndem Ausfall kann die Miete auf null sinken.",
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
      "Ein vollständiger Stromausfall ist ein Notfall: Der Vermieter muss sofort einen Elektro-Notdienst beauftragen. Reagiert er nicht, dürfen Sie das nach § 536a Abs. 2 BGB selbst tun und die Kosten erstattet verlangen.",
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
      "Ein dauerhaft unbeleuchtetes Treppenhaus ist ein Sicherheitsmangel mit konkreter Sturzgefahr. Der Vermieter ist im Rahmen seiner Verkehrssicherungspflicht zur Instandhaltung verpflichtet.",
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
      "Weisen Sie ausdrücklich auf die Verkehrssicherungspflicht und die Sturzgefahr hin. Kommt es nach Ihrer Meldung zu einem Unfall, haftet der Vermieter — allein dieser Hinweis führt oft zu schneller Abhilfe.",
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
      "Ein Internetausfall berechtigt nur dann zur Mietminderung, wenn der Anschluss Teil der Mietsache ist — etwa bei einem Mietvertrag mit inklusivem Anschluss oder bei einer Sammelversorgung im Haus. Ein eigener Vertrag mit einem Provider ist Sache des Mieters.",
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
      "Klären Sie zuerst die Zuordnung: Ist der Anschluss über Ihren eigenen Provider-Vertrag realisiert, richten sich Ansprüche gegen den Anbieter — dann gilt das Telekommunikationsgesetz mit eigenen Minderungsregeln, nicht das Mietrecht.",
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
      "Ist ein Kabel- oder Antennenanschluss im Mietvertrag zugesagt oder werden die Kosten über die Nebenkosten umgelegt, schuldet der Vermieter dessen Funktion. Ein Totalausfall rechtfertigt eine Minderung im niedrigen Prozentbereich.",
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
      "Wenn die Anschlusskosten weiter über die Nebenkosten abgerechnet werden, verlangen Sie zusätzlich deren Erstattung für den Ausfallzeitraum — das ist ein eigener Anspruch neben der Mietminderung.",
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
      "Weicht die tatsächliche Wohnfläche um mehr als zehn Prozent nach unten ab, liegt nach ständiger BGH-Rechtsprechung ein erheblicher Mangel vor. Die Miete ist dann im Verhältnis der Abweichung gemindert — und zwar rückwirkend ab Mietbeginn.",
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
      "Das ist einer der wenigen Fälle mit rückwirkendem Anspruch: Zu viel gezahlte Miete können Sie im Rahmen der dreijährigen Verjährungsfrist zurückfordern. Bei einer 15-prozentigen Abweichung sind das schnell mehrere tausend Euro.",
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
      "Heizt sich eine Wohnung im Sommer dauerhaft auf über 26 °C auf, kann darin ein Mangel liegen — vor allem in Dachgeschosswohnungen mit unzureichender Dämmung. Der Nachweis ist anspruchsvoll, da normale Sommerhitze hinzunehmen ist.",
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
      "Entscheidend ist der Vergleich innen zu außen: Bleibt es innen deutlich wärmer als draußen und kühlt die Wohnung nachts nicht ab, spricht das für einen Baumangel und nicht für allgemeine Hitze.",
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
      "Ein undichtes Dach oder eine durchfeuchtete Decke führt zu wiederkehrenden Wassereintritten und mittelfristig zu Schimmel. Der Mangel ist gravierend, weil er die Bausubstanz angreift.",
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
      "Melden Sie sofort und schriftlich. Verzögert sich die Reparatur und entsteht Schimmel, kommt zur bestehenden Minderung eine weitere hinzu — und der Vermieter kann Ihnen nicht vorhalten, den Mangel zu spät angezeigt zu haben.",
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
      "Ein mitvermieteter Balkon, der wegen Bauarbeiten, Gerüst oder Baufälligkeit gesperrt ist, mindert den Wohnwert. Die Quote fällt im Sommer deutlich höher aus als im Winter.",
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
      "Weisen Sie ausdrücklich auf die Jahreszeit hin. Eine Sperrung von Mai bis September ist wesentlich gravierender als dieselbe Sperrung im Januar — Gerichte differenzieren hier ausdrücklich.",
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
      "Eine mitvermietete Terrasse oder ein Gartenanteil ist Teil der Mietsache. Sind sie in der Hauptnutzungszeit gesperrt, etwa durch gelagertes Baumaterial oder eine Baustelle, rechtfertigt das eine Minderung im mittleren einstelligen bis niedrigen zweistelligen Bereich.",
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
      "Im Winter geht die anerkannte Quote gegen null. Konzentrieren Sie Ihre Minderung deshalb auf die Monate der tatsächlichen Nutzungssaison und rechnen Sie taggenau ab.",
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
      "Ein im Mietvertrag genanntes Kellerabteil gehört zur Mietsache. Ist es gesperrt, überflutet oder wurde es gar nicht erst übergeben, mindert das die Miete für die gesamte Wohnung.",
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
      "Wurde das Kellerabteil von Anfang an nicht übergeben, obwohl es im Vertrag steht, besteht der Anspruch ab Mietbeginn. Für die Vergangenheit gilt aber: Ohne vorbehaltlose Zahlung ist eine Rückforderung schwierig — melden Sie es deshalb sofort.",
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
      "Ein mitgemieteter Stellplatz oder eine Garage, die nicht nutzbar ist, berechtigt zur Minderung. Wird dafür ein gesonderter Mietzins gezahlt, bezieht sich die Minderung auf diesen Teilbetrag — bis hin zu dessen vollständigem Entfall.",
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
      "Prüfen Sie, ob ein einheitlicher Mietvertrag oder zwei getrennte Verträge vorliegen. Bei getrennten Verträgen mindern Sie ausschließlich die Stellplatzmiete — eine Kürzung der Wohnungsmiete wäre dann unberechtigt.",
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
      "Ein Gerüst vor dem Fenster nimmt Licht, hebt die Privatsphäre auf und erhöht das Einbruchsrisiko erheblich. Diese Kombination begründet auch dann eine Minderung, wenn die Bauarbeiten selbst angekündigt waren.",
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
      "Verlangen Sie ausdrücklich Sicherungsmaßnahmen wie Bauzäune, Alarmanlagen oder Nachtwachen. Wird nicht gesichert und es kommt zum Einbruch, kann der Vermieter zusätzlich haften.",
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
      "Asbest ist krebserregend und gehört zu den schwerwiegendsten Wohnungsmängeln. Entscheidend ist, ob Fasern freigesetzt werden können — bei beschädigten oder gebrochenen Bauteilen ist das der Fall.",
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
      "Bearbeiten, bohren oder entfernen Sie asbestverdächtige Materialien niemals selbst — das setzt Fasern frei. Bei bestätigter Faserfreisetzung kommt neben der Minderung eine fristlose Kündigung wegen Gesundheitsgefährdung nach § 569 Abs. 1 BGB in Betracht.",
    fristTage: 7,
    dringend: true,
  },
  legionellen: {
    slug: "legionellen",
    keywords: [
      "Mietminderung Legionellen",
      "Legionellen im Trinkwasser Mietminderung",
      "Duschverbot Legionellen Miete mindern",
    ],
    intro:
      "Legionellen im Warmwasser können eine schwere Lungenentzündung auslösen. Überschreiten die Messwerte die Grenzwerte der Trinkwasserverordnung, liegt ein erheblicher Mangel vor — insbesondere wenn das Gesundheitsamt ein Duschverbot ausspricht.",
    symptome: [
      "Positive Legionellenbefunde aus der turnusmäßigen Untersuchung",
      "Duschverbot oder Nutzungseinschränkung durch das Gesundheitsamt",
      "Anordnung, das Wasser vor Gebrauch abkochen zu lassen",
      "Wiederholte Befunde trotz angeblicher Sanierung",
    ],
    dokumentation: [
      "Untersuchungsergebnis beim Vermieter anfordern — Sie haben ein Auskunftsrecht",
      "Behördliche Anordnungen und Aushänge sichern",
      "Zeitraum der Nutzungseinschränkung protokollieren",
      "Ärztliche Befunde aufbewahren, falls gesundheitliche Beschwerden auftreten",
    ],
    hinweis:
      "Vermieter von Mehrfamilienhäusern mit Zentralwarmwasser sind zur regelmäßigen Legionellenprüfung verpflichtet und müssen die Ergebnisse offenlegen. Fordern Sie das Protokoll schriftlich an — die Weigerung ist selbst ein Indiz.",
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
      "Bleirohre in der Trinkwasserinstallation sind seit 2013 unzulässig, wenn der Grenzwert überschritten wird. Blei ist besonders für Säuglinge und Schwangere gefährlich — ein Grenzwertverstoß ist ein erheblicher Mangel.",
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
      "Der Vermieter ist verpflichtet, über bleihaltige Leitungen zu informieren. Bei Grenzwertüberschreitung schuldet er den Austausch — eine bloße Empfehlung, das Wasser ablaufen zu lassen, ist keine ausreichende Mängelbeseitigung.",
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
      "Formaldehyd aus Spanplatten, Klebstoffen oder Bodenbelägen reizt Augen und Atemwege und gilt als krebserzeugend. Überschreiten die Raumluftwerte die einschlägigen Richtwerte, liegt ein schwerer Mangel vor.",
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
      "Die Messung ist entscheidend und kostet je nach Umfang mehrere hundert Euro. Bestätigt sie die Überschreitung, muss der Vermieter diese Kosten als Schadensersatz nach § 536a Abs. 1 BGB erstatten.",
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
      "Anhaltender Abwasser- oder Kanalgeruch in der Wohnung weist auf einen Defekt der Entlüftung oder eine undichte Leitung hin. Der Geruch belastet dauerhaft und ist ein anerkannter Mangel im mittleren Prozentbereich.",
    symptome: [
      "Fäkalienartiger Geruch aus Abflüssen in Bad, Küche oder WC",
      "Geruch verstärkt sich bei Wetterwechsel oder Unterdruck",
      "Blubbernde Geräusche in den Abflussrohren",
      "Geruch bleibt trotz gefüllter Geruchsverschlüsse bestehen",
    ],
    dokumentation: [
      "Geruchsprotokoll mit Datum, Uhrzeit, Ort und Intensität führen",
      "Besucher als Zeugen benennen und schriftlich bestätigen lassen",
      "Dokumentieren, dass alle Siphons gefüllt sind — das schließt die naheliegendste eigene Ursache aus",
      "Handwerkerberichte und Kamerabefahrungen aufbewahren",
    ],
    hinweis:
      "Füllen Sie alle Geruchsverschlüsse, auch selten genutzte wie den Bodenablauf, und halten Sie das fest. Damit entkräften Sie den häufigsten Einwand des Vermieters, die Ursache liege in einem ausgetrockneten Siphon.",
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
      "Ein Müllraum oder Tonnenstandplatz direkt am Fenster kann die Wohnung im Sommer unbenutzbar machen. Sorgt der Vermieter nicht für ausreichende Leerung, Reinigung oder eine Verlegung, ist das ein Mangel.",
    symptome: [
      "Anhaltender Müllgeruch in der Wohnung",
      "Fenster können im Sommer nicht geöffnet werden",
      "Überfüllte Tonnen, unregelmäßige Abholung",
      "Müllraum wird nicht gereinigt, Ungezieferanzug",
    ],
    dokumentation: [
      "Überfüllte Tonnen und Standplatz mit Datum fotografieren",
      "Geruchsprotokoll führen, Wetterlage und Temperatur vermerken",
      "Abholrhythmus und ausgefallene Leerungen dokumentieren",
      "Entfernung des Standplatzes zum eigenen Fenster angeben",
    ],
    hinweis:
      "Fordern Sie konkret: häufigere Leerung, regelmäßige Reinigung oder Verlegung des Standplatzes. Eine konkret benannte Abhilfemaßnahme ist deutlich wirksamer als eine allgemeine Beschwerde über Geruch.",
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
      "Küchen-, Fett- oder Betriebsgerüche aus einem Gastronomie- oder Gewerbebetrieb im Haus ziehen häufig über Schächte und Fassade in die Wohnung. Zieht der Betrieb erst nach Ihrem Einzug ein, ist die Belastung ein Mangel.",
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
      "Prüfen Sie, ob die Abluftanlage baurechtlich zulässig ausgeführt ist — häufig muss sie über Dach geführt werden. Ein Verstoß dagegen ist ein starkes Argument gegenüber Vermieter und Behörde.",
    fristTage: 14,
  },
};
