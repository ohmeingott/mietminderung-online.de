// Polish translations for the defect catalogue and FAQ content.
const pl: Record<string, string> = {
  // --- Categories ------------------------------------------------------------
  "kat.heizung": "Ogrzewanie i ciepła woda",
  "kat.feuchtigkeit": "Wilgoć i pleśń",
  "kat.laerm": "Hałas i zakłócanie ciszy",
  "kat.ungeziefer": "Robactwo i szkodniki",
  "kat.fenster_tueren": "Okna i drzwi",
  "kat.bad_sanitaer": "Łazienka i instalacja sanitarna",
  "kat.kueche": "Kuchnia i sprzęty",
  "kat.aufzug": "Winda",
  "kat.elektrik": "Elektryka i technika",
  "kat.wohnflaeche": "Powierzchnia mieszkania i jakość pomieszczeń",
  "kat.balkon_aussen": "Balkon, taras i tereny zewnętrzne",
  "kat.gesundheit": "Zagrożenia dla zdrowia",
  "kat.gerueche": "Uciążliwe zapachy",

  // --- Heating & hot water ---------------------------------------------------
  "m.heizung_total.l": "Awaria ogrzewania (całkowita)",
  "m.heizung_total.d":
    "Ogrzewanie nie działa w całym mieszkaniu, temperatura poniżej 18 °C w sezonie grzewczym (październik–kwiecień).",
  "m.heizung_teilweise.l": "Awaria ogrzewania (poszczególne pomieszczenia)",
  "m.heizung_teilweise.d":
    "Ogrzewanie nie działa w jednym lub kilku pomieszczeniach, pozostałe są ogrzewane.",
  "m.heizung_unzureichend.l": "Ogrzewanie grzeje niewystarczająco",
  "m.heizung_unzureichend.d":
    "Temperatura w pomieszczeniu pozostaje poniżej 20 °C mimo włączonego ogrzewania.",
  "m.warmwasser_total.l": "Brak ciepłej wody (całkowity)",
  "m.warmwasser_total.d": "W całym mieszkaniu nie ma ciepłej wody.",
  "m.warmwasser_vorlauf.l": "Ciepła woda dopiero po długim oczekiwaniu",
  "m.warmwasser_vorlauf.d":
    "Ciepła woda pojawia się dopiero po ponad 5 minutach oczekiwania.",
  "m.heizung_geraeusche.l": "Ogrzewanie hałasuje",
  "m.heizung_geraeusche.d":
    "Stukanie, bulgotanie lub inne uciążliwe odgłosy w rurach grzewczych.",

  // --- Damp & mould ----------------------------------------------------------
  "m.schimmel_leicht.l": "Pleśń w jednym pomieszczeniu (niewielka)",
  "m.schimmel_leicht.d":
    "Powierzchowna pleśń na niewielkiej powierzchni w jednym pomieszczeniu.",
  "m.schimmel_stark.l": "Pleśń w kilku pomieszczeniach (silna)",
  "m.schimmel_stark.d":
    "Rozległa pleśń w kilku pomieszczeniach mieszkania.",
  "m.feuchtigkeit_wand.l": "Wilgotne ściany / zawilgocenie",
  "m.feuchtigkeit_wand.d":
    "Wilgotne ściany, mokre plamy lub zawilgocenie w pomieszczeniach mieszkalnych.",
  "m.wasserschaden.l": "Szkoda wodna / zalanie",
  "m.wasserschaden.d":
    "Woda przedostaje się do mieszkania, np. przez nieszczelny dach lub pęknięcie rury.",
  "m.trocknungsgeraete.l": "Osuszacze po zalaniu",
  "m.trocknungsgeraete.d":
    "W mieszkaniu stoją głośne osuszacze, które ograniczają korzystanie z lokalu.",
  "m.feuchter_keller.l": "Wilgotna piwnica",
  "m.feuchter_keller.d":
    "Piwnica jest wilgotna lub mokra (jeśli piwnica należy do przedmiotu najmu).",

  // --- Noise -----------------------------------------------------------------
  "m.baulaerm_haus.l": "Hałas budowlany we własnym budynku",
  "m.baulaerm_haus.d": "Znaczny hałas z prac budowlanych we własnym budynku, np. adaptacja poddasza lub remont. Przy modernizacji energetycznej obniżka jest wyłączona przez trzy miesiące (§ 536 ust. 1a BGB).",
  "m.strassenlaerm.l": "Zwiększony hałas uliczny (np. budowa)",
  "m.strassenlaerm.d":
    "Hałas uliczny przekraczający zwykłą miarę, np. z powodu placu budowy.",
  "m.nachbarlaerm.l": "Stały hałas od sąsiadów",
  "m.nachbarlaerm.d":
    "Regularne, zakłócające ciszę odgłosy od sąsiadów przekraczające normalną miarę.",
  "m.gastronomie.l": "Hałas z lokalu gastronomicznego w budynku",
  "m.gastronomie.d": "Hałas z baru, restauracji lub dyskoteki w budynku.",
  "m.aufzug_laerm.l": "Hałas windy",
  "m.aufzug_laerm.d": "Ciągły stukot, buczenie lub wibracje powodowane przez windę.",

  // --- Pests -----------------------------------------------------------------
  "m.kakerlaken.l": "Karaluchy / prusaki",
  "m.kakerlaken.d": "Występowanie karaluchów lub prusaków w mieszkaniu.",
  "m.ratten.l": "Szczury w mieszkaniu",
  "m.ratten.d": "Szczury dostają się do pomieszczeń mieszkalnych albo pokoje są zamknięte z powodu deratyzacji.",
  "m.maeuse.l": "Myszy",
  "m.maeuse.d": "Obecność myszy w mieszkaniu.",
  "m.bettwanzen.l": "Pluskwy",
  "m.bettwanzen.d": "Występowanie pluskiew w mieszkaniu.",
  "m.silberfische.l": "Rybiki cukrowe (silne występowanie)",
  "m.silberfische.d":
    "Liczne rybiki cukrowe, często sygnał problemów z wilgocią.",
  "m.wespen.l": "Gniazdo os / pszczół",
  "m.wespen.d":
    "Gniazdo os lub pszczół na budynku, które ogranicza korzystanie z lokalu.",

  // --- Windows & doors -------------------------------------------------------
  "m.fenster_undicht.l": "Nieszczelne okna (przeciągi)",
  "m.fenster_undicht.d": "Okna są nieszczelne, w mieszkaniu wieje.",
  "m.fenster_oeffnen.l": "Okien nie da się otworzyć",
  "m.fenster_oeffnen.d": "Okien nie można otworzyć, wietrzenie jest niemożliwe.",
  "m.fenster_schliessen.l": "Okien nie da się zamknąć",
  "m.fenster_schliessen.d":
    "Okien nie można zamknąć: zagrożenie bezpieczeństwa i utrata ciepła.",
  "m.tuer_abschliessbar.l": "Drzwi mieszkania nie dają się zamknąć na klucz",
  "m.tuer_abschliessbar.d":
    "Drzwi wejściowych do mieszkania nie można zamknąć na klucz: wada bezpieczeństwa.",
  "m.klingel_defekt.l": "Dzwonek / domofon uszkodzony",
  "m.klingel_defekt.d": "Dzwonek do drzwi lub domofon nie działa.",

  // --- Bathroom --------------------------------------------------------------
  "m.toilette_defekt.l": "Jedyna toaleta nie do użytku",
  "m.toilette_defekt.d": "Jedyna toaleta w mieszkaniu jest zepsuta i przez dłuższy czas nie nadaje się do użytku.",
  "m.dusche_defekt.l": "Prysznic zepsuty (jest wanna)",
  "m.dusche_defekt.d": "Prysznic nie działa, ale dostępna jest inna możliwość mycia, np. wanna.",
  "m.wasserdruck_niedrig.l": "Zbyt niskie ciśnienie wody",
  "m.wasserdruck_niedrig.d":
    "Zbyt niskie ciśnienie wody w łazience lub kuchni.",
  "m.bad_belueftung.l": "Nie da się wywietrzyć łazienki",
  "m.bad_belueftung.d":
    "Łazienka nie ma sprawnego okna ani wentylacji wyciągowej.",
  "m.spuelung_defekt.l": "Spłuczka uszkodzona",
  "m.spuelung_defekt.d":
    "Spłuczka nie działa, konieczne jest spłukiwanie wiadrem.",

  // --- Kitchen ---------------------------------------------------------------
  "m.herd_defekt.l": "Kuchenka / piekarnik uszkodzony",
  "m.herd_defekt.d":
    "Udostępniona przez wynajmującego kuchenka lub piekarnik nie działa.",
  "m.kuehlschrank_defekt.l": "Lodówka uszkodzona",
  "m.kuehlschrank_defekt.d":
    "Udostępniona przez wynajmującego lodówka nie działa.",
  "m.spuelmaschine_defekt.l": "Zmywarka uszkodzona",
  "m.spuelmaschine_defekt.d": "Uzgodniona w umowie zmywarka nie działa.",
  "m.kueche_komplett.l": "Kuchnia całkowicie nie do użytku",
  "m.kueche_komplett.d":
    "Cała kuchnia nie nadaje się do użytku (np. po zalaniu).",

  // --- Lift ------------------------------------------------------------------
  "m.aufzug_defekt.l": "Winda uszkodzona",
  "m.aufzug_defekt.d": "Uzgodniona w umowie winda nie działa.",
  "m.aufzug_hoch.l": "Winda uszkodzona (wysokie piętro)",
  "m.aufzug_hoch.d":
    "Awaria windy przy mieszkaniu na wysokim piętrze lub przy ograniczonej sprawności ruchowej.",

  // --- Electrics -------------------------------------------------------------
  "m.strom_komplett.l": "Całkowity brak prądu",
  "m.strom_komplett.d": "W całym mieszkaniu nie ma prądu.",
  "m.treppenhaus_licht.l": "Oświetlenie klatki schodowej uszkodzone",
  "m.treppenhaus_licht.d": "Oświetlenie na klatce schodowej nie działa.",
  "m.internet_ausfall.l": "Brak internetu (jeśli należy do najmu)",
  "m.internet_ausfall.d":
    "Internet uzgodniony jako część przedmiotu najmu nie działa.",
  "m.kabel_defekt.l": "Przyłącze kablowe / TV uszkodzone",
  "m.kabel_defekt.d": "Uzgodnione w umowie przyłącze kablowe nie działa.",

  // --- Floor area ------------------------------------------------------------
  "m.wohnflaeche_10.l": "Powierzchnia mniejsza niż uzgodniona",
  "m.wohnflaeche_10.d": "Rzeczywista powierzchnia jest mniejsza od uzgodnionej. Powyżej 10 % odchylenia czynsz obniża się dokładnie o ten procent; do 10 % włącznie wada nie występuje.",
  "m.hitze_dach.l": "Letnie przegrzewanie (wada ochrony cieplnej)",
  "m.hitze_dach.d": "Mieszkanie mocno nagrzewa się latem. Wada występuje tylko wtedy, gdy budynek nie spełniał standardu letniej ochrony cieplnej obowiązującego w czasie budowy. Na poddaszu i w starym budownictwie wyższe temperatury trzeba znosić.",
  "m.undichtes_dach.l": "Nieszczelny dach / sufit",
  "m.undichtes_dach.d": "Woda przedostaje się przez dach lub sufit.",

  // --- Balcony & outdoor -----------------------------------------------------
  "m.balkon_nicht_nutzbar.l": "Balkon nie do użytku",
  "m.balkon_nicht_nutzbar.d":
    "Balkon nie nadaje się do użytku, np. z powodu rusztowania lub prac budowlanych.",
  "m.terrasse_nicht_nutzbar.l": "Taras nie do użytku (latem)",
  "m.terrasse_nicht_nutzbar.d": "Z tarasu nie można korzystać latem.",
  "m.keller_nicht_nutzbar.l": "Piwnica nie do użytku",
  "m.keller_nicht_nutzbar.d":
    "Uzgodniona w umowie piwnica nie nadaje się do użytku.",
  "m.stellplatz_nicht_nutzbar.l": "Miejsce postojowe / garaż nie do użytku",
  "m.stellplatz_nicht_nutzbar.d":
    "Z miejsca postojowego lub garażu nie można korzystać.",
  "m.baugeruest.l": "Rusztowanie przed oknem",
  "m.baugeruest.d":
    "Rusztowanie ogranicza dostęp światła i stwarza ryzyko włamania.",

  // --- Health hazards --------------------------------------------------------
  "m.asbest.l": "Azbest uszkodzony / uwalnianie włókien",
  "m.asbest.d": "Elementy zawierające azbest są uszkodzone lub istnieje ryzyko uwolnienia włókien, np. pęknięte płyty albo piece akumulacyjne z azbestem. Dowód przekroczenia norm w powietrzu nie jest wymagany.",
  "m.legionellen.l": "Legionella w wodzie pitnej",
  "m.legionellen.d": "Przekroczenie wartości granicznych legionelli.",
  "m.bleirohre.l": "Rury ołowiane (przekroczenie normy)",
  "m.bleirohre.d":
    "Rury ołowiane w instalacji wody pitnej z przekroczeniem wartości granicznych.",
  "m.formaldehyd.l": "Zanieczyszczenie formaldehydem",
  "m.formaldehyd.d": "Podwyższone stężenie formaldehydu w mieszkaniu.",

  // --- Odours ----------------------------------------------------------------
  "m.abwasser_geruch.l": "Zapach ścieków w mieszkaniu",
  "m.abwasser_geruch.d": "Zapach ścieków spowodowany uszkodzonymi rurami.",
  "m.muell_geruch.l": "Zapach śmieci (stały)",
  "m.muell_geruch.d":
    "Stały zapach śmieci, np. z sąsiedniego pomieszczenia na odpady.",
  "m.gewerbe_geruch.l": "Zapach z gastronomii / działalności gospodarczej",
  "m.gewerbe_geruch.d":
    "Uciążliwość zapachowa powodowana przez lokal gastronomiczny lub zakład.",

  // --- FAQ -------------------------------------------------------------------
  "faq.q0": "Czym jest obniżka czynszu (Mietminderung)?",
  "faq.a0":
    "Obniżka czynszu oznacza, że jako najemca możesz płacić mniej, jeśli twoje mieszkanie ma wady pogarszające jakość zamieszkiwania. Prawo to wynika automatycznie z § 536 niemieckiego kodeksu cywilnego (BGB). Nie musisz występować o żadną zgodę. Czynsz jest obniżony z mocy prawa tak długo, jak długo trwa wada.",
  "faq.q1": "Czy wynajmujący musi zatwierdzić obniżkę czynszu?",
  "faq.a1": "Nie! Obniżka czynszu następuje z mocy prawa (automatycznie), gdy tylko istnieje istotna wada. Nie potrzebujesz ani zgody, ani oświadczenia. Zgłoszenie wady nie jest warunkiem powstania obniżki, ale to ono pozwala ją wyegzekwować i udowodnić.",
  "faq.q2": "Jak obliczyć wysokość obniżki czynszu?",
  "faq.a2":
    "Obniżkę oblicza się od czynszu brutto z ogrzewaniem (Bruttowarmmiete), czyli czynszu podstawowego wraz ze wszystkimi kosztami dodatkowymi. Wysokość zależy od rodzaju i ciężkości wady. Przykład: przy czynszu brutto 1000 € i stawce obniżki 20 % płacisz tylko 800 €. Stawka wynika z orzeczeń sądowych w porównywalnych sprawach.",
  "faq.q3": "Czym jest zgłoszenie wady i dlaczego go potrzebuję?",
  "faq.a3": "Zgłoszenie wady to pisemne zawiadomienie wynajmującego, w którym opisujesz wadę i żądasz jej usunięcia. § 536c ust. 1 BGB zobowiązuje cię do niezwłocznego zgłaszania wad. Jeśli tego nie zrobisz, tracisz prawo do obniżki tylko w takim zakresie, w jakim wynajmujący nie mógł usunąć wady właśnie z powodu braku zgłoszenia. Jeśli i tak o niej wiedział, obowiązek zgłoszenia odpada. Pomożemy ci sporządzić zgłoszenie w sposób prawnie skuteczny.",
  "faq.q4": "Co się stanie, jeśli obniżę czynsz zbyt mocno?",
  "faq.a4": "Uwaga: ryzyko zaczyna się wcześniej, niż wielu sądzi. Wynajmujący może wypowiedzieć umowę bez zachowania terminu, jeśli w dwóch kolejnych terminach zalegasz z nieznikomą częścią czynszu (§ 543 ust. 2 zd. 1 nr 3 lit. a BGB). Zgodnie z § 569 ust. 3 nr 1 BGB „nieznikoma” to już kwota przekraczająca jeden miesięczny czynsz. Próg dwóch czynszów dotyczy dopiero dłuższego okresu. Nasza rekomendacja: najpierw płać pełny czynsz z zastrzeżeniem i żądaj różnicy później.",
  "faq.q5": "Czy wynajmujący może wyłączyć obniżkę czynszu w umowie?",
  "faq.a5":
    "Nie. W najmie lokali mieszkalnych prawo do obniżki czynszu jest niezbywalne (§ 536 ust. 4 BGB). Klauzule umowne wyłączające to prawo są nieważne.",
  "faq.q6": "Od kiedy mogę obniżyć czynsz?",
  "faq.a6": "Obniżka następuje już z chwilą powstania wady, a nie dopiero po zgłoszeniu. Jeśli w międzyczasie płaciłeś pełny czynsz, nadpłatę możesz odzyskać na podstawie § 812 BGB. Nie uda się to tylko wtedy, gdy wiedziałeś na pewno, że nie masz obowiązku płacić w całości (§ 814 BGB). Kto zakładał, że obniżka wymaga zgody wynajmującego, takiej wiedzy właśnie nie miał.",
  "faq.q7": "Czy przy pleśni zawsze mogę obniżyć czynsz?",
  "faq.a7": "Niekoniecznie. Jeśli pleśń powstała przez twoje zachowanie (nieprawidłowe wietrzenie lub ogrzewanie), prawo do obniżki odpada. Ciężar dowodu spoczywa najpierw na wynajmującym: musi wykluczyć przyczyny budowlane. Wady jednak nie ma, gdy pleśń wynika z mostków termicznych, a budynek odpowiadał przepisom obowiązującym w czasie budowy.",
  "faq.q8": "Jak długo obowiązuje obniżka czynszu?",
  "faq.a8":
    "Obniżka obowiązuje przez cały okres istnienia wady. Gdy tylko wada zostanie usunięta, musisz ponownie płacić pełny czynsz. Nie ma górnej granicy czasowej.",
  "faq.q9": "Co oznacza „płacenie z zastrzeżeniem”?",
  "faq.a9": "Płacąc czynsz „z zastrzeżeniem”, zachowujesz prawo do żądania zwrotu nadpłaty. W tytule przelewu wpisz: „Zapłata z zastrzeżeniem z powodu wady [opis]”. To chroni cię przed wypowiedzeniem bez terminu i pozwala później odzyskać różnicę. Sam BGH wskazuje najemcom tę drogę.",
  "faq.q10": "Czy stracę prawo do obniżki, jeśli długo nic nie zrobię?",
  "faq.a10": "Rozpowszechniona dawniej zasada, że prawo do obniżki wygasa po około sześciu miesiącach płacenia bez zastrzeżenia, opierała się na uchylonym w 2001 r. § 539 BGB i w tej postaci już nie obowiązuje. Utrata prawa na podstawie § 242 BGB wchodzi w grę tylko wyjątkowo i wymaga łącznie elementu czasu i elementu zachowania. Mimo to działaj szybko — ze względu na dowody i trzyletnie przedawnienie.",
  "faq.q11": "Jak to wygląda przy modernizacji energetycznej?",
  "faq.a11":
    "Przy działaniach modernizacyjnych poprawiających efektywność energetyczną (np. ocieplenie) obniżka czynszu jest wyłączona przez 3 miesiące (§ 536 ust. 1a BGB). Po tym okresie możesz obniżyć czynsz. Dotyczy to wyłącznie działań energetycznych, a nie ogólnej modernizacji.",
  "m.baulaerm_nachbar.l": "Hałas budowlany z sąsiedniej działki",
  "m.baulaerm_nachbar.d": "Hałas z budowy na cudzej działce zgodnie z orzecznictwem BGH z reguły NIE stanowi wady. Obniżka wchodzi w grę tylko wtedy, gdy umowa stanowi inaczej lub wynajmujący ma roszczenia wyrównawcze z § 906 BGB.",
  "m.ratten_umfeld.l": "Szczury w piwnicy, na podwórzu lub w ogrodzie",
  "m.ratten_umfeld.d": "Szczury w otoczeniu budynku — przy pojemnikach na śmieci, na podwórzu, w ogrodzie lub piwnicy — bez wchodzenia do mieszkania.",
  "m.toilette_zweit_wc.l": "Toaleta zepsuta (jest druga toaleta)",
  "m.toilette_zweit_wc.d": "Jedna toaleta jest zepsuta, ale w mieszkaniu jest druga, w pełni sprawna.",
  "m.dusche_einzige.l": "Jedyna możliwość mycia niedostępna",
  "m.dusche_einzige.d": "Jedyna w mieszkaniu możliwość mycia i kąpieli jest niedostępna.",
  "m.asbest_gebunden.l": "Azbest trwale związany i nieuszkodzony",
  "m.asbest_gebunden.d": "Trwale związany, nieuszkodzony azbest, np. całe płytki winylowo-azbestowe. Sama obecność z reguły NIE stanowi wady; potrzebna jest uzasadniona obawa uwolnienia włókien.",
  "faq.q12": "Czy dopłata mnie uratuje, jeśli obniżyłem czynsz za mocno?",
  "faq.a12": "Tylko w połowie. Jeśli w ciągu dwóch miesięcy od doręczenia pozwu o eksmisję spłacisz zaległość w całości, wypowiedzenie bez zachowania terminu staje się bezskuteczne (§ 569 ust. 3 nr 2 BGB). Zgłoszone równocześnie ewentualne wypowiedzenie zwykłe pozostaje jednak w mocy. W praktyce wynajmujący regularnie wypowiadają umowę zarówno bez terminu, jak i ewentualnie zwykle, więc mimo pełnej spłaty możesz stracić mieszkanie.",
};

export default pl;
