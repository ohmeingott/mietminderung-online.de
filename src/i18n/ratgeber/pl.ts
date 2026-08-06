import type { RatgeberUebersetzung } from "./typen";

/**
 * Polish guides. Keys are the German slugs from `src/data/ratgeber.ts`; the
 * URL slugs live in `src/i18n/pfade.ts`.
 *
 * German legal terms are carried along in brackets on first use — a reader who
 * takes this to a landlord or a court needs the German word, not only its
 * Polish rendering. Statute references (§ 536c BGB) stay as they are.
 *
 * The sample letter keeps its German body on purpose. It is the text that gets
 * sent to a German landlord, so translating it would produce a letter nobody
 * can use. Only the bracketed instructions — which the reader replaces anyway —
 * carry a Polish gloss.
 */
const pl: RatgeberUebersetzung = {
  "maengelanzeige-schreiben": {
    navLabel: "Zgłoszenie wad",
    title:
      "Zgłoszenie wad (Mängelanzeige): wzór, dane obowiązkowe i terminy",
    metaTitle: "Zgłoszenie wad: wzór i instrukcja według § 536c BGB",
    description:
      "Zgłoszenie wad do wynajmującego: wszystkie dane obowiązkowe według § 536c BGB, pełny wzór do przepisania, terminy i prawidłowe doręczenie.",
    keywords: [
      "zgłoszenie wad",
      "Mängelanzeige wzór",
      "zgłoszenie wad wynajmującemu",
      "§ 536c BGB",
      "zgłosić wadę wynajmującemu",
    ],
    lead:
      "Bez zgłoszenia wad (Mängelanzeige) obniżka czynszu nie zadziała. Kto go nie wyśle, z reguły nie może obniżyć czynszu, a w najgorszym razie sam staje się dłużnikiem wynajmującego z tytułu odszkodowania. Tutaj przeczytasz, co ma zawierać pismo, jaki termin wyznaczyć i jak doręczyć je w sposób dowodowy.",
    sections: [
      {
        heading: "Dlaczego zgłoszenie wad jest niezbędne",
        paragraphs: [
          "§ 536c BGB wymaga od najemcy zgłoszenia wady niezwłocznie, gdy tylko pojawi się w czasie trwania najmu. „Niezwłocznie” (unverzüglich) oznacza bez zawinionej zwłoki. Między wykryciem a zgłoszeniem nie powinno więc upłynąć więcej niż kilka dni.",
          "Kto zgłoszenia zaniecha, traci podwójnie. Po pierwsze prawo do obniżenia czynszu. Po drugie może stać się zobowiązany do naprawienia szkody wynajmującemu, jeśli szkoda rośnie z powodu braku zgłoszenia — na przykład gdy wilgotna ściana z czasem staje się przypadkiem gruntownego remontu.",
          "Obniżka powstaje z mocy prawa. Wyegzekwować ją można jednak dopiero od dnia, w którym wynajmujący dowiedział się o wadzie. Dlatego data Twojego zgłoszenia jest zarazem dniem początkowym Twojego roszczenia.",
        ],
        note:
          "Jest wyjątek: jeśli wynajmujący i tak wie o wadzie, bo widział ją dozorca albo dotknięty jest cały budynek, obowiązek zgłoszenia odpada. Mimo to nie należy na tym polegać. Krótkie pismo kosztuje niewiele i oszczędza później każdego sporu o dowody.",
      },
      {
        heading: "Te dziewięć danych musi zawierać zgłoszenie",
        ordered: [
          "Nadawca: Twoje pełne imię i nazwisko oraz adres wynajmowanego mieszkania",
          "Odbiorca: nazwa i adres wynajmującego lub zarządcy nieruchomości (Hausverwaltung)",
          "Data pisma",
          "Temat ze słowem „Mängelanzeige” i wskazaniem mieszkania (adres, piętro, ewentualnie numer mieszkania)",
          "Konkretny opis wady: co dokładnie, w którym pomieszczeniu, od kiedy, jak się objawia?",
          "Odwołanie do dowodów: załączone zdjęcia, protokoły temperatury lub hałasu, świadkowie",
          "Wezwanie do usunięcia wady z terminem opatrzonym konkretną datą",
          "Wskazanie, że obniżasz czynsz albo do czasu usunięcia płacisz z zastrzeżeniem (unter Vorbehalt)",
          "Twój podpis",
        ],
        paragraphs: [
          "Najczęstszym błędem jest zbyt ogólnikowy opis. „W łazience jest pleśń” nie wystarczy. Lepiej: „Na północnej ścianie łazienki, nad prysznicem, od 3 marca 2026 roku występuje zagrzybienie o powierzchni około 40 × 30 cm. Nalot jest czarno-zielonkawy, czuć stęchliznę.”",
        ],
      },
      {
        heading: "Jaki termin należy wyznaczyć",
        table: {
          caption: "Zwykłe terminy usunięcia wady",
          head: ["Rodzaj wady", "Odpowiedni termin", "Przykłady"],
          rows: [
            [
              "Sytuacja awaryjna / zagrożenie zdrowia",
              "natychmiast do 24 godzin",
              "Awaria ogrzewania zimą, całkowity brak prądu, niesprawna jedyna toaleta",
            ],
            [
              "Wada pilna",
              "od 3 do 7 dni",
              "Zalanie, silne zagrzybienie, niedające się zamknąć drzwi mieszkania",
            ],
            [
              "Wada zwykła",
              "14 dni",
              "Nieszczelne okna, niesprawna winda, cieknąca bateria",
            ],
            [
              "Wada drobna",
              "od 3 do 4 tygodni",
              "Niesprawny dzwonek, długie oczekiwanie na ciepłą wodę, wilgotna piwnica",
            ],
          ],
        },
        paragraphs: [
          "Wpisz w terminie konkretną datę („do 20 sierpnia 2026 roku”), a nie okres w rodzaju „w ciągu dwóch tygodni”. Tylko przy dacie moment upływu terminu jest bezsporny, a na tej dacie opierają się wszystkie dalsze kroki.",
        ],
      },
      {
        heading: "Wzór: zgłoszenie wad do wynajmującego",
        code:
          "[Twoje imię i nazwisko / Ihr Name]\n[Ulica i numer domu / Straße und Hausnummer]\n[Kod pocztowy, miasto / PLZ, Ort]\n\n[Miasto / Ort], [Data / Datum]\n\nAn\n[Nazwa wynajmującego / zarządcy]\n[Adres / Anschrift]\n\nBetreff: Mängelanzeige für die Wohnung [adres, piętro, nr mieszkania]\n\nSehr geehrte Damen und Herren,\n(jeśli nazwisko jest znane: Sehr geehrte Frau [nazwisko], /\nSehr geehrter Herr [nazwisko],)\n\nhiermit zeige ich Ihnen folgenden Mangel in der von mir gemieteten\nWohnung an:\n\n[Dokładny opis wady po niemiecku: co, w którym pomieszczeniu,\nod kiedy, jak się objawia?]\n\nAls Nachweis füge ich diesem Schreiben [Fotos / ein Temperaturprotokoll /\nein Lärmprotokoll] bei.\n\nIch fordere Sie auf, den Mangel bis zum [konkretna data] zu beseitigen.\n\nBis zur vollständigen Beseitigung des Mangels werde ich die Miete\n[um X % mindern  → obniżę o X % /\n unter Vorbehalt in voller Höhe zahlen  → zapłacę w całości z zastrzeżeniem].\n\nSollte der Mangel nicht fristgerecht beseitigt werden, behalte ich mir\nweitere rechtliche Schritte vor, insbesondere Schadensersatz gemäß\n§ 536a Abs. 1 BGB und die Selbstvornahme gemäß § 536a Abs. 2 BGB.\n\nMit freundlichen Grüßen\n\n[Podpis / Unterschrift]\n[Imię i nazwisko / Name]\n\nAnlagen:\n- [Zdjęcia wady / Fotos vom Mangel]\n- [Protokół / Protokoll]",
      },
      {
        heading: "Jak doręczyć zgłoszenie w sposób dowodowy",
        paragraphs: [
          "Ustawa nie przewiduje dla zgłoszenia żadnej formy, teoretycznie wystarczyłaby ustna. Tyle że niewiele Ci to pomoże, gdy w sporze trzeba udowodnić, że i kiedy wynajmujący je otrzymał. Dlatego liczy się droga doręczenia.",
        ],
        bullets: [
          "Einwurf-Einschreiben (polecony z wrzuceniem do skrzynki): dobry kompromis między dowodem a kosztem, potwierdzenie doręczenia dostępne online",
          "Posłaniec ze świadkiem: osoba czyta pismo, wrzuca je do skrzynki i może później zaświadczyć o obu tych rzeczach. Nic nie kosztuje i broni się przed sądem.",
          "Osobiste doręczenie z pisemnym potwierdzeniem odbioru: najpewniejsza droga, jeśli wynajmujący współpracuje",
          "Übergabe-Einschreiben (polecony za podpisem): ryzykowny, bo odbiorca może odmówić przyjęcia i wtedy pismo uchodzi za niedoręczone",
          "Sam e-mail: jako jedyny dowód za mało, bo doręczenia niemal nie da się wykazać",
        ],
        note:
          "Z praktyki: wyślij zgłoszenie dodatkowo e-mailem, wtedy trafi od razu na biurko. Ale dla dowodu liczy się droga pocztowa.",
      },
      {
        heading: "Co dzieje się po zgłoszeniu",
        ordered: [
          "Wynajmujący sprawdza wadę i zleca jej usunięcie. Obejrzenie wady wcześniej jest jego prawem.",
          "Musisz umożliwić dostęp do oględzin i naprawy po uprzednim powiadomieniu. Odmowa może kosztować Cię prawo do obniżki.",
          "Od chwili doręczenia zgłoszenia czynsz jest obniżony z mocy prawa. W razie wątpliwości płać najpierw dalej z zastrzeżeniem.",
          "Jeśli termin upłynie bezskutecznie, wchodzą w grę odszkodowanie według § 536a Abs. 1 BGB i samodzielne usunięcie według § 536a Abs. 2 BGB.",
          "Po usunięciu wady obniżka się kończy. Od tego dnia znów należny jest pełny czynsz.",
        ],
      },
    ],
    faqs: [
      {
        question: "Czy zgłoszenie musi mieć formę pisemną?",
        answer:
          "Forma pisemna nie jest wymagana, zgłoszenie byłoby skuteczne nawet ustnie. Ale w sporze musisz udowodnić, że dotarło do wynajmującego. Praktycznie nie ma więc drogi obok pisma, doręczonego przez Einwurf-Einschreiben albo przez posłańca ze świadkiem.",
      },
      {
        question: "Jak szybko muszę zgłosić wadę?",
        answer:
          "Niezwłocznie, mówi § 536c BGB, czyli bez zawinionej zwłoki. Praktycznie oznacza to: w ciągu kilku dni od wykrycia. Zalanie i podobnie pilne przypadki najlepiej zgłosić tego samego dnia.",
      },
      {
        question: "Czy mogę zgłosić kilka wad w jednym piśmie?",
        answer:
          "Tak, i jest to nawet rozsądne. Opisz każdą wadę w osobnym akapicie, z pomieszczeniem, początkiem i nasileniem. Zgłoszenie pozostaje wtedy przejrzyste, a Ty możesz zsumować stawki poszczególnych wad.",
      },
      {
        question: "Co się stanie, jeśli nie zgłoszę wady?",
        answer:
          "Z reguły tracisz prawo do obniżki za okres przed zgłoszeniem. Może być nawet gorzej: jeśli szkoda rośnie, bo wynajmujący o niczym nie wiedział, w pewnych okolicznościach odpowiadasz za to Ty (§ 536c Abs. 2 BGB).",
      },
    ],
  },

  "mietminderung-berechnen": {
    navLabel: "Obliczanie obniżki",
    title:
      "Obliczanie obniżki czynszu: wzór, przykłady i podstawa obliczenia",
    metaTitle:
      "Obliczanie obniżki czynszu: wzór i czynsz brutto z ogrzewaniem",
    description:
      "Obliczanie obniżki czynszu: dlaczego podstawą jest czynsz brutto z ogrzewaniem (Bruttowarmmiete), jak wygląda wzór i co obowiązuje przy kilku wadach. Z przykładami.",
    keywords: [
      "obliczanie obniżki czynszu",
      "obniżka czynszu Bruttowarmmiete",
      "wzór obniżki czynszu",
      "przykład obniżki czynszu",
      "obliczanie stawki obniżki",
    ],
    lead:
      "Przy obliczaniu obniżki najczęściej myli się nie stawka, lecz liczba, do której się ją stosuje. Kto wychodzi od czynszu zimnego zamiast brutto z ogrzewaniem, miesiąc w miesiąc oddaje pieniądze. Oto jak liczyć prawidłowo.",
    sections: [
      {
        heading: "Podstawą jest zawsze czynsz brutto z ogrzewaniem",
        paragraphs: [
          "Federalny Trybunał Sprawiedliwości (Bundesgerichtshof) rozstrzygnął tę kwestię w 2005 roku: podstawą obniżki jest czynsz brutto z ogrzewaniem, a nie czynsz netto zimny. Dla najmu lokali mieszkalnych właściwy jest wyrok z 20 lipca 2005 roku (sygn. VIII ZR 347/04); dla najmu komercyjnego BGH orzekł tak samo już 6 kwietnia 2005 roku (sygn. XII ZR 225/03).",
          "Chodzi o czynsz netto zimny plus wszystkie zaliczki lub ryczałty na koszty eksploatacyjne. Logika jest taka: płacisz za mieszkanie jako całość, więc wada obniża też wartość całego pakietu.",
        ],
        table: {
          caption: "Składniki czynszu brutto z ogrzewaniem",
          head: ["Pozycja", "Kwota przykładowa"],
          rows: [
            ["Czynsz netto zimny (Nettokaltmiete)", "800,00 €"],
            ["Zaliczka na koszty eksploatacyjne (Betriebskosten)", "150,00 €"],
            ["Zaliczka na ogrzewanie (Heizkosten)", "50,00 €"],
            ["Czynsz brutto z ogrzewaniem (podstawa)", "1.000,00 €"],
          ],
        },
        note:
          "W przykładzie różnica między czynszem zimnym a z ogrzewaniem przy obniżce 20 % wynosi 40 € miesięcznie. W skali roku to 480 €.",
      },
      {
        heading: "Wzór",
        code:
          "Kwota obniżki  = czynsz brutto z ogrzewaniem × stawka ÷ 100\nCzynsz do zapłaty = czynsz brutto z ogrzewaniem − kwota obniżki",
        paragraphs: [
          "Przy czynszu brutto z ogrzewaniem 1.000 € i stawce obniżki 30 % kwota obniżki wynosi 300 €. Do zapłaty pozostaje wtedy 700 €.",
        ],
      },
      {
        heading: "Obliczenie dzienne dla krótszych okresów",
        paragraphs: [
          "Jeśli wada nie trwa przez cały miesiąc, liczy się proporcjonalnie. Przyjęło się liczyć miesiąc jako 30 dni.",
        ],
        code:
          "Kwota obniżki = (czynsz brutto z ogrzewaniem ÷ 30) × dni z wadą × stawka ÷ 100\n\nPrzykład: 1.000 € czynszu, 12 dni bez ogrzewania, stawka 80 %\n= (1.000 ÷ 30) × 12 × 0,80\n= 33,33 € × 12 × 0,80\n= 320,00 €",
        note:
          "Zapisuj początek i koniec wady co do dnia. To właśnie z tych dwóch dat wynika później wysokość Twojego roszczenia.",
      },
      {
        heading: "Kilka wad jednocześnie",
        paragraphs: [
          "Utrzymuje się tu uparte nieporozumienie: że stawki kilku wad można po prostu dodać. Sądy tego nie robią. Pytają według § 536 Abs. 1 BGB, jak silnie naruszona jest przydatność mieszkania jako całości, i dokonują oceny łącznej. Zasądzona stawka łączna jest więc z reguły niższa od sumy wartości jednostkowych.",
          "Suma wartości z tabel nadaje się zatem tylko jako zgrubna górna granica, nie jako wynik. Szczególnie widać to przy wadach, które w istocie opisują to samo naruszenie: uszkodzony grzejnik i wychłodzone przez to mieszkanie ocenia się raz, a nie dwa razy.",
        ],
        table: {
          caption: "Przykład: kilka wad w ocenie łącznej",
          head: ["Wada", "Stawka jednostkowa"],
          rows: [
            ["Pleśń w jednym pomieszczeniu", "10 %"],
            ["Nieszczelne okna w tym samym pomieszczeniu", "8 %"],
            ["Niesprawna winda (4. piętro)", "10 %"],
            ["Suma wartości jednostkowych (tylko orientacyjnie)", "28 %"],
            ["Realistyczna stawka łączna", "poniżej 28 %"],
          ],
        },
        note:
          "Nasz kalkulator to odwzorowuje: najwyższa wartość jednostkowa liczy się w całości, każda kolejna tylko w połowie. To również szacunek, ale nie daje już wyników 100 %, do jakich zwykłe dodawanie prowadzi już przy czterech czy pięciu wadach.",
      },
      {
        heading: "Wpływ na rozliczenie kosztów eksploatacyjnych",
        paragraphs: [
          "Obniżka czynszu wpływa też na roczne rozliczenie kosztów eksploatacyjnych (Betriebskostenabrechnung). Ponieważ zaliczki są częścią obniżonego czynszu brutto z ogrzewaniem, dopłatę za okres obniżki należy odpowiednio zmniejszyć.",
          "Sprawdź więc rozliczenie pod kątem tego, czy wynajmujący uwzględnił obniżkę. Jeśli nie, zgłoś sprzeciw pisemnie w dwunastomiesięcznym terminie na zarzuty według § 556 Abs. 3 BGB.",
        ],
      },
      {
        heading: "Jak znaleźć właściwą stawkę",
        bullets: [
          "Kieruj się opublikowanymi tabelami obniżek czynszu, które podsumowują orzeczenia sądów w porównywalnych sprawach",
          "Uwzględnij czas trwania, intensywność i zakres naruszenia, bo wartości w tabelach to przedziały, a nie wielkości stałe",
          "W razie wątpliwości szacuj ostrożnie: zbyt niska obniżka kosztuje pieniądze, zbyt wysoka może kosztować mieszkanie",
          "Przy większych kwotach daj sprawdzić stawkę zrzeszeniu najemców (Mieterverein) albo adwokatowi specjaliście",
        ],
        note:
          "Wszystkie wartości procentowe w takich tabelach pochodzą z rozstrzygnięć w sprawach jednostkowych i są wyłącznie orientacyjne. Żaden sąd nie jest nimi związany; oceniana jest zawsze konkretna sprawa.",
      },
    ],
    faqs: [
      {
        question: "Czy obniżkę liczy się od czynszu zimnego czy z ogrzewaniem?",
        answer:
          "Od czynszu brutto z ogrzewaniem, czyli netto zimnego plus wszystkich zaliczek na koszty eksploatacyjne i ogrzewanie. Dla najmu mieszkań rozstrzygnął to Federalny Trybunał Sprawiedliwości wyrokiem z 20 lipca 2005 roku (sygn. VIII ZR 347/04).",
      },
      {
        question: "Jak liczyć, jeśli wada trwała tylko dwa tygodnie?",
        answer:
          "Dziennie: podziel czynsz brutto z ogrzewaniem przez 30, pomnóż przez liczbę dni z wadą, a potem przez stawkę obniżki. Przy 1.000 € czynszu, 14 dniach i 20 % daje to 93,33 €.",
      },
      {
        question: "Czy mogę zsumować stawki kilku wad?",
        answer:
          "Nie, przynajmniej nie jako wynik. Sądy nie dodają, lecz oceniają w ocenie łącznej, jak silnie naruszone jest mieszkanie w całości. Suma wartości jednostkowych to tylko zgrubna górna granica; zasądzona stawka jest regularnie niższa i nigdy nie może przekroczyć 100 %.",
      },
      {
        question:
          "Czy obniżkę trzeba uwzględnić w rozliczeniu kosztów eksploatacyjnych?",
        answer:
          "Tak. Ponieważ zaliczki są częścią obniżonego czynszu brutto z ogrzewaniem, żądanie dopłaty za okres obniżki należy proporcjonalnie zmniejszyć. Sprawdź rozliczenie i zgłoś sprzeciw w ciągu dwunastu miesięcy od jego doręczenia.",
      },
    ],
  },
  "miete-unter-vorbehalt-zahlen": {
    navLabel: "Płacenie z zastrzeżeniem",
    title:
      "Płacenie czynszu z zastrzeżeniem: bezpieczna droga do obniżki",
    metaTitle:
      "Płacenie czynszu z zastrzeżeniem: sformułowanie i zwrot nadpłaty",
    description:
      "Dlaczego przy wadach warto płacić czynsz z zastrzeżeniem (unter Vorbehalt), jak sformułować zastrzeżenie i jak odzyskać nadpłacony czynsz.",
    keywords: [
      "płacenie czynszu z zastrzeżeniem",
      "zastrzeżenie przy obniżce czynszu",
      "odzyskać czynsz",
      "tytuł przelewu zastrzeżenie",
    ],
    lead:
      "Kto obniża czynsz na własną rękę i pomyli się w ocenie, ryzykuje w najgorszym razie wypowiedzenie bez zachowania terminu. Da się inaczej: płacić dalej w pełnej wysokości, zgłosić zastrzeżenie, odzyskać pieniądze później. Ekonomicznie wychodzi to samo, tylko bez ryzyka.",
    sections: [
      {
        heading: "Ryzyko bezpośredniego obniżenia wpłaty",
        paragraphs: [
          "Kto przyjmie zbyt wysoką stawkę, buduje zaległość, a ta staje się groźna szybciej, niż wielu sądzi. Wynajmujący może wypowiedzieć umowę bez zachowania terminu, jeśli w dwóch następujących po sobie terminach zalegasz z niemałą częścią czynszu (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a BGB). „Niemała część” oznacza według § 569 Abs. 3 Nr. 1 BGB już więcej niż jeden czynsz miesięczny. Próg dwóch czynszów miesięcznych obowiązuje dopiero przy dłuższym okresie (litera b).",
          "Kto zatrzymuje 40 %, przekracza jeden czynsz miesięczny już po trzech miesiącach. Na dobrą wiarę trudno się przy tym powołać: BGH stosuje surowe kryteria do niezawinionego błędu prawnego najemcy i wyraźnie odszedł od dawniejszych ułatwień. Kto porusza się w szarej strefie stawek, działa nieostrożnie.",
        ],
        note:
          "Właśnie tu wkracza płatność z zastrzeżeniem: płacisz dalej w pełnej wysokości, ale nie tracisz roszczenia o zwrot.",
      },
      {
        heading: "Jak działa płatność z zastrzeżeniem",
        ordered: [
          "Zgłaszasz wadę pisemnie i wyznaczasz termin na jej usunięcie.",
          "W zgłoszeniu wyraźnie oświadczasz, że od tej chwili płacisz czynsz wyłącznie z zastrzeżeniem.",
          "Nadal przelewasz pełny czynsz i wpisujesz zastrzeżenie w tytule przelewu.",
          "Dokumentujesz wadę bez przerwy, dopóki istnieje.",
          "Po usunięciu wady żądasz zwrotu nadpłaconej kwoty, w razie potrzeby przed sądem.",
        ],
      },
      {
        heading: "Właściwe sformułowanie",
        paragraphs: [
          "Zastrzeżenie musi być rozpoznawalnie powiązane z konkretną wadą. Ogólne „z zastrzeżeniem” bez powiązania nie wystarcza w sposób pewny.",
        ],
        code:
          "W tytule przelewu:\n\n  Miete [miesiąc/rok], Zahlung unter Vorbehalt wegen Mangel\n  (Schimmel Schlafzimmer, angezeigt am 12.03.2026)\n  [Czynsz za (miesiąc/rok), płatność z zastrzeżeniem z powodu wady —\n   pleśń w sypialni, zgłoszona 12.03.2026]\n\nW piśmie do wynajmującego:\n\n  Bis zur vollständigen Beseitigung des angezeigten Mangels zahle\n  ich die Miete ausdrücklich nur unter Vorbehalt der Rückforderung.\n  Ein Verzicht auf mein Minderungsrecht nach § 536 BGB ist damit\n  nicht verbunden.",
        note:
          "W tytule przelewu miejsca jest mało. Krótka forma wystarczy, o ile podaje datę Twojego zgłoszenia wady.",
      },
      {
        heading: "Zwrot: terminy i sposób postępowania",
        paragraphs: [
          "Roszczenie o zwrot przedawnia się po trzech latach. Termin biegnie od końca roku, w którym roszczenie powstało i w którym dowiedziałeś się o okolicznościach je uzasadniających. Niezależnie od wiedzy obowiązuje bezwzględny termin przedawnienia dziesięciu lat.",
          "Zażądaj zwrotu kwoty pisemnie i z wyznaczeniem terminu. Przedstaw wyliczenie: okres, stawka, czynsz brutto z ogrzewaniem, suma. Jeśli wynajmujący pozostaje bierny, kolejnym krokiem jest zrzeszenie najemców lub adwokat specjalista.",
        ],
      },
      {
        heading: "Kiedy bezpośrednie obniżenie mimo wszystko ma sens",
        bullets: [
          "Wada jest jednoznaczna, a stawka bezsporna, na przykład przy potwierdzonym sądownie odstępstwie powierzchni mieszkalnej",
          "Wynajmujący uznał obniżkę pisemnie co do zasady i co do wysokości",
          "Zrzeszenie najemców albo adwokat sprawdził i potwierdził stawkę",
          "Wada istnieje od dawna, a wynajmujący pozostaje bierny mimo wielokrotnych terminów",
        ],
        note:
          "Także wtedy obowiązuje: przy stawce zachowaj raczej ostrożność. Korzyść ekonomiczna z kilku punktów procentowych nie pozostaje w żadnej proporcji do ryzyka wypowiedzenia.",
      },
    ],
    faqs: [
      {
        question: "Co oznacza „płacenie czynszu z zastrzeżeniem”?",
        answer:
          "Płacisz dalej pełny czynsz, ale wyraźnie zastrzegasz sobie prawo do późniejszego żądania zwrotu części nadpłaconej z powodu wady. Tak unikasz zaległości, a tym samym ryzyka wypowiedzenia bez zachowania terminu.",
      },
      {
        question: "Jak sformułować zastrzeżenie przy przelewie?",
        answer:
          "W tytule przelewu na przykład: „Miete 04/2026, Zahlung unter Vorbehalt wegen Mangel (Schimmel Schlafzimmer, angezeigt am 12.03.2026)”. Ważne jest rozpoznawalne powiązanie z konkretną, wcześniej zgłoszoną wadą.",
      },
      {
        question: "Jak długo mogę żądać zwrotu nadpłaconego czynszu?",
        answer:
          "Roszczenie przedawnia się z reguły po trzech latach, licząc od końca roku, w którym powstało i o którym wiedziałeś. Niezależnie od wiedzy wygasa najpóźniej po dziesięciu latach.",
      },
      {
        question: "Czy tracę prawo do obniżki, jeśli płacę w pełnej wysokości?",
        answer:
          "Tylko w wyjątkowych przypadkach, a mianowicie przez utratę prawa według § 242 BGB. Wbrew rozpowszechnionemu poglądowi nie istnieje sztywny wskaźnik sześciu miesięcy. Wyraźne zastrzeżenie przy każdej płatności odbiera tej kwestii ostrość z góry.",
      },
    ],
  },

  "mietminderung-rueckwirkend": {
    navLabel: "Obniżka wstecz",
    title:
      "Obniżka czynszu wstecz: kiedy można odzyskać pieniądze",
    metaTitle: "Obniżka czynszu wstecz: kiedy zwrot jest możliwy",
    description:
      "Obniżka wstecz jest możliwa tylko w czterech przypadkach. W jakich, jakie obowiązują terminy przedawnienia i jak postępować przy żądaniu zwrotu.",
    keywords: [
      "obniżka czynszu wstecz",
      "obniżyć czynsz z mocą wsteczną",
      "przedawnienie obniżki czynszu",
      "odzyskać nadpłacony czynsz",
    ],
    lead:
      "„Czy mogę żądać pieniędzy za minione miesiące?” to jedno z najczęstszych pytań o obniżkę czynszu. Uczciwa odpowiedź brzmi: przeważnie nie. Są jednak cztery wyraźnie zarysowane wyjątki i warto je znać.",
    sections: [
      {
        heading: "Zasada: od chwili wiedzy wynajmującego",
        paragraphs: [
          "Według § 536 BGB czynsz obniża się automatycznie, gdy tylko występuje istotna wada. Wyegzekwować roszczenie można jednak dopiero wtedy, gdy wynajmujący o wadzie wie, czyli w normalnym przypadku od doręczenia Twojego zgłoszenia.",
          "Za okres wcześniejszy obowiązuje zasada: kto znał wadę i mimo to płacił pełny czynsz bez zastrzeżenia, z reguły nie może odzyskać pieniędzy.",
        ],
      },
      {
        heading: "Te cztery przypadki pozwalają na zwrot",
        bullets: [
          "Płaciłeś czynsz z zastrzeżeniem; roszczenie o zwrot pozostaje wtedy w pełnym zakresie",
          "Wynajmujący już wiedział o wadzie, na przykład dlatego, że sam ją widział albo dotknięty był cały budynek",
          "Wynajmujący podał błędną powierzchnię mieszkalną; wtedy roszczenie istnieje od początku najmu",
          "Umowa najmu zawiera nieważną klauzulę, która powstrzymała Cię od obniżki",
        ],
        note:
          "Nie lekceważ ostatniego punktu. Zwłaszcza starsze umowy najmu często zawierają klauzule mające wyłączyć prawo do obniżki. Przy lokalach mieszkalnych takie klauzule są nieważne według § 536 Abs. 4 BGB, a mimo to przez nie latami płacono za dużo.",
      },
      {
        heading: "Utrata prawa: gdy zbyt długie zwlekanie kosztuje roszczenie",
        paragraphs: [
          "Jeśli przez dłuższy czas płacisz pełny czynsz bez zastrzeżenia, choć znasz wadę, prawo do obniżki może w wyjątkowych przypadkach wygasnąć. Dawniej rozpowszechniony wskaźnik sześciu miesięcy pochodzi jednak z orzecznictwa do uchylonego w 2001 roku § 539 BGB w dawnym brzmieniu i w tej postaci już nie obowiązuje: BGH orzekł w 2003 roku, że płatność bez zastrzeżenia przy wiedzy o wadzie nie prowadzi do utraty prawa w drodze analogii do § 536b BGB.",
          "Prawnie utrata prawa wymaga dwóch składników. Elementu czasu: upłynął dłuższy okres. I elementu okoliczności: wynajmujący mógł wywnioskować z Twojego zachowania, że nie będziesz już obniżać. Dopiero oba razem kosztują roszczenie.",
        ],
      },
      {
        heading: "Terminy przedawnienia w skrócie",
        table: {
          head: ["Termin", "Długość", "Początek biegu"],
          rows: [
            [
              "Zwykłe przedawnienie roszczenia o zwrot",
              "3 lata",
              "Koniec roku, w którym roszczenie powstało i o którym wiedziałeś",
            ],
            [
              "Przedawnienie bezwzględne",
              "10 lat",
              "Powstanie roszczenia, niezależnie od wiedzy",
            ],
            [
              "Utrata prawa do obniżki (§ 242 BGB)",
              "brak sztywnego wskaźnika, przypadek wyjątkowy",
              "Wiedza o wadzie przy płatności bez zastrzeżenia",
            ],
          ],
        },
      },
      {
        heading: "Jak postępować przy żądaniu zwrotu",
        ordered: [
          "Ustal okres i stawkę oraz sporządź czytelne wyliczenie.",
          "Zbierz dowody: zgłoszenie wad, zdjęcia, protokoły, korespondencję, wyciągi z konta.",
          "Wezwij wynajmującego pisemnie do zwrotu, z konkretnym terminem około 14 dni.",
          "Przy odmowie włącz zrzeszenie najemców albo adwokata specjalistę; często wystarcza już pismo adwokackie.",
          "Przed upływem przedawnienia rozważ kroki sądowe, w razie potrzeby przez nakaz zapłaty (Mahnbescheid), który przerywa bieg przedawnienia.",
        ],
      },
    ],
    faqs: [
      {
        question: "Czy mogę obniżyć czynsz wstecz?",
        answer:
          "Tylko w ograniczonym zakresie. Jest to możliwe, jeśli płaciłeś z zastrzeżeniem, wynajmujący już znał wadę, powierzchnia mieszkalna była podana błędnie albo nieważna klauzula umowna powstrzymała Cię od obniżki.",
      },
      {
        question: "Jak daleko wstecz mogę żądać zwrotu czynszu?",
        answer:
          "W ramach zwykłego przedawnienia trzech lat, licząc od końca roku, w którym roszczenie powstało i o którym wiedziałeś. Niezależnie od tego roszczenie wygasa najpóźniej po dziesięciu latach.",
      },
      {
        question: "Czy tracę prawo do obniżki, jeśli długo nic nie robię?",
        answer:
          "Tylko wyjątkowo. Podawana dawniej granica sześciu miesięcy opierała się na uchylonym prawie; dziś utrata prawa wchodzi w grę wyłącznie przez § 242 BGB i wymaga łącznie elementu czasu i okoliczności. Działać w miarę szybko warto mimo to — choćby ze względu na dowody i trzyletnie przedawnienie.",
      },
      {
        question: "Czy przy błędnej powierzchni mieszkalnej obowiązuje co innego?",
        answer:
          "Tak. Jeśli rzeczywista powierzchnia jest mniejsza o więcej niż dziesięć procent, roszczenie według orzecznictwa BGH istnieje od początku najmu, i to nawet bez wcześniejszego zgłoszenia wady, ponieważ za błędne dane odpowiada sam wynajmujący.",
      },
    ],
  },
  "mietminderung-ausschluss": {
    navLabel: "Kiedy obniżka nie działa",
    title: "Kiedy obniżka czynszu jest wyłączona: 7 podstaw",
    metaTitle: "Obniżka czynszu wyłączona: 7 podstaw pozbawiających roszczenia",
    description:
      "Nie każda wada uprawnia do obniżki: siedem podstaw wyłączenia — od wiedzy przy zawarciu umowy przez wady drobne po modernizację energetyczną.",
    keywords: [
      "obniżka czynszu wyłączona",
      "brak obniżki czynszu",
      "wada drobna prawo najmu",
      "§ 536b BGB",
      "modernizacja energetyczna obniżka czynszu",
    ],
    lead:
      "Nie każda wada uprawnia do obniżki. Ustawa zna szereg podstaw wyłączenia, a kto je przeoczy i mimo to obniży czynsz, buduje zaległość, na końcu której może stać wypowiedzenie. Przejdź te siedem punktów, zanim ruszysz czynsz.",
    sections: [
      {
        heading: "1. Wiedza o wadzie przy zawarciu umowy (§ 536b BGB)",
        paragraphs: [
          "Kto zna wadę przy podpisywaniu umowy najmu i mimo to się wprowadza, nie może później z jej powodu obniżać czynszu. To samo obowiązuje, jeśli nie znałeś wady tylko wskutek rażącego niedbalstwa, czyli przy oględzinach trudno ją było przeoczyć.",
          "Wyjątek: jeśli przy odbiorze mieszkania wyraźnie zastrzegłeś sobie prawa z powodu wady, prawo do obniżki pozostaje. Zawsze każ wpisać takie zastrzeżenie do protokołu zdawczo-odbiorczego (Übergabeprotokoll).",
        ],
      },
      {
        heading: "2. Zaniechanie zgłoszenia wady (§ 536c BGB)",
        paragraphs: [
          "Jeśli nie zgłosisz wady niezwłocznie i wynajmujący nie może jej przez to usunąć, tracisz prawo do obniżki. Dodatkowo możesz stać się wobec niego zobowiązany do naprawienia szkody.",
          "Jeśli wynajmujący zna wadę już z innego źródła, obowiązek zgłoszenia odpada. Mimo to nigdy nie należy na tym polegać.",
        ],
      },
      {
        heading: "3. Wady drobne i nieistotne naruszenia",
        paragraphs: [
          "Według § 536 Abs. 1 Satz 3 BGB nieistotne zmniejszenie przydatności pozostaje bez znaczenia. Chodzi o wady łatwo rozpoznawalne i możliwe do usunięcia niewielkim nakładem.",
        ],
        bullets: [
          "Pojedynczy cieknący kran",
          "Lekko zacinające się drzwi pokojowe",
          "Pojedyncza pęknięta płytka",
          "Niesprawne gniazdko przy wystarczającej liczbie pozostałych",
        ],
        note:
          "Miarodajne jest naruszenie korzystania, a nie cena naprawy: tania w usunięciu wada może być istotna, droga — nieistotna. Kilka drobnych wad razem może przekroczyć próg istotności.",
      },
      {
        heading: "4. Wady spowodowane przez Ciebie",
        paragraphs: [
          "Jeśli wadę spowodowałeś Ty, domownicy albo Twoi goście, prawo do obniżki nie przysługuje. Klasykiem jest pleśń z powodu niedostatecznego wietrzenia i ogrzewania.",
          "Dla Twojej pozycji decydujący jest ciężar dowodu, a ten spoczywa na wynajmującym. Musi on najpierw wykluczyć przyczyny budowlane, takie jak mostki termiczne czy brak izolacji. Dopiero gdy mu się to uda, Twoje zachowanie w ogóle wchodzi w grę.",
        ],
      },
      {
        heading: "5. Utrata prawa przez długie zwlekanie",
        paragraphs: [
          "Jeśli przez dłuższy czas płacisz pełny czynsz bez zastrzeżenia, choć znasz wadę, Twoje prawo do obniżki może wyjątkowo wygasnąć. Wymagane są łącznie element czasu i zasługujące na ochronę zaufanie wynajmującego; sztywnego wskaźnika w rodzaju „sześciu miesięcy” nie ma.",
        ],
      },
      {
        heading: "6. Modernizacja energetyczna (§ 536 Abs. 1a BGB)",
        paragraphs: [
          "Przy energetycznych pracach modernizacyjnych w rozumieniu § 555b Nr. 1 BGB obniżka czynszu jest wyłączona na trzy miesiące. Warunkiem jest prawidłowe i terminowe zapowiedzenie prac przez wynajmującego.",
          "Po upływie trzech miesięcy możesz obniżać. Wyłączenie dotyczy przy tym wyłącznie prac energetycznych; ogólne modernizacje albo sama konserwacja nie są nim objęte.",
        ],
      },
      {
        heading: "7. Naruszenia społecznie akceptowane i typowe dla miejsca",
        bullets: [
          "Zwykły hałas mieszkalny w budynku wielorodzinnym, w tym bawiące się dzieci",
          "Hałas uliczny w lokalizacji śródmiejskiej, istniejący już przy zawarciu umowy",
          "Typowe zapachy kuchenne z sąsiednich mieszkań",
          "Naruszenia wynikające z Twojego własnego, sprzecznego z umową korzystania z mieszkania",
        ],
        paragraphs: [
          "Miarą jest zawsze stan z chwili zawarcia umowy. Co pogorszyło się później, może być wadą. Co było takie od początku, wynająłeś razem z mieszkaniem.",
        ],
      },
    ],
    faqs: [
      {
        question: "Czy wynajmujący może wyłączyć obniżkę czynszu w umowie?",
        answer:
          "Przy lokalach mieszkalnych nie. Według § 536 Abs. 4 BGB prawa do obniżki nie można wyłączyć umownie; odpowiednie klauzule w umowie najmu są nieważne. Przy lokalach użytkowych obowiązują inne zasady.",
      },
      {
        question: "Czym jest wada drobna?",
        answer:
          "Wadą, która zmniejsza przydatność mieszkania tylko nieistotnie i daje się usunąć niewielkim nakładem, na przykład pojedynczy cieknący kran. Według § 536 Abs. 1 Satz 3 BGB nie uprawnia do obniżki.",
      },
      {
        question: "Czy przy termomodernizacji mogę obniżyć czynsz?",
        answer:
          "Dopiero po trzech miesiącach. § 536 Abs. 1a BGB wyłącza obniżkę na ten okres przy prawidłowo zapowiedzianych energetycznych pracach modernizacyjnych. Potem obniżka jest możliwa.",
      },
      {
        question: "Kto musi udowodnić, że pleśń spowodowałem ja?",
        answer:
          "Wynajmujący. Musi najpierw wykazać i udowodnić, że nie ma przyczyn budowlanych, takich jak mostki termiczne czy przenikanie wilgoci. Dopiero gdy mu się to uda, brane jest pod uwagę Twoje wietrzenie i ogrzewanie.",
      },
    ],
  },

  "mietminderung-fehler": {
    navLabel: "Unikanie częstych błędów",
    title: "10 najczęstszych błędów przy obniżce czynszu",
    metaTitle: "Obniżka czynszu: 10 częstych błędów i jak ich uniknąć",
    description:
      "Od zawyżonej stawki po brak dokumentacji: dziesięć błędów, które regularnie kosztują najemców ich roszczenie, i jak ich uniknąć.",
    keywords: [
      "błędy przy obniżce czynszu",
      "obniżka czynszu źle zrobiona",
      "ryzyko wypowiedzenia obniżka czynszu",
      "porady obniżka czynszu",
    ],
    lead:
      "Gdy obniżka czynszu się nie udaje, rzadko winna jest sama wada. Prawie zawsze chodzi o sposób postępowania: brak zgłoszenia, błędna podstawa obliczenia, zbyt śmiałe obniżenie. Te dziesięć błędów warto znać przed pierwszym przelewem.",
    sections: [
      {
        heading: "Błąd 1: obniżyć czynsz bez zgłoszenia wady",
        paragraphs: [
          "Zdecydowanie najczęstszy i najdroższy błąd. Bez zgłoszenia wad nie ma wykonalnego roszczenia, a zatrzymany czynsz to wtedy nic innego jak zaległość. Najpierw zgłoszenie pisemne, potem rozmowa o obniżce.",
        ],
      },
      {
        heading: "Błąd 2: obniżyć zbyt mocno",
        paragraphs: [
          "Już zaległość przekraczająca jeden czynsz miesięczny w dwóch następujących po sobie terminach może wywołać wypowiedzenie bez zachowania terminu (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a w związku z § 569 Abs. 3 Nr. 1 BGB). A wartości z tabel to przedziały z jednostkowych spraw, nie gwarancje. Trzymaj się dolnej granicy albo od razu płać z zastrzeżeniem.",
        ],
      },
      {
        heading: "Błąd 3: liczyć od czynszu zimnego zamiast z ogrzewaniem",
        paragraphs: [
          "Podstawą obliczenia jest czynsz brutto z ogrzewaniem wraz ze wszystkimi zaliczkami. Kto wychodzi od czynszu netto zimnego, obniża wyraźnie mniej, niż mu przysługuje.",
        ],
      },
      {
        heading: "Błąd 4: nie dokumentować wady",
        paragraphs: [
          "Bez zdjęć, protokołów i świadków w procesie słowo stoi przeciw słowu, a ciężar dowodu wady spoczywa na najemcy. Zacznij dokumentować pierwszego dnia, a nie dopiero gdy zacznie się spór.",
        ],
        bullets: [
          "Zdjęcia i filmy z rozpoznawalną datą",
          "Protokół temperatury przy wadach ogrzewania, kilka razy dziennie",
          "Protokół hałasu z datą, godziną od–do, rodzajem i natężeniem",
          "Zanotować nazwiska możliwych świadków, póki pamięć jest świeża",
        ],
      },
      {
        heading: "Błąd 5: zgłaszać tylko mailem albo ustnie",
        paragraphs: [
          "E-mail nie dowodzi, że dotarł. Postaw na Einwurf-Einschreiben albo posłańca ze świadkiem. E-mail możesz wysłać dodatkowo, żeby wynajmujący dowiedział się szybko.",
        ],
      },
      {
        heading: "Błąd 6: nie wyznaczyć terminu na usunięcie",
        paragraphs: [
          "Bez terminu z konkretną datą nie uruchamiasz żadnych dalszych uprawnień, ani odszkodowania, ani samodzielnego usunięcia według § 536a Abs. 2 BGB. Czyli: data do pisma, a nie mglisty okres.",
        ],
      },
      {
        heading: "Błąd 7: odmawiać wynajmującemu wstępu",
        paragraphs: [
          "Wynajmujący może obejrzeć wadę i musi mieć możliwość jej usunięcia. Kto po prawidłowej zapowiedzi nie otwiera drzwi, ryzykuje prawem do obniżki i sam odpowiada za opóźnienie.",
        ],
      },
      {
        heading: "Błąd 8: obniżać dalej po usunięciu wady",
        paragraphs: [
          "Gdy tylko wada zostanie usunięta, znów należny jest pełny czynsz. Kto obniża dalej, buduje zaległość. Ustal dzień usunięcia na piśmie i zakończ obniżkę od tego dnia.",
        ],
      },
      {
        heading: "Błąd 9: zbyt długo zwlekać",
        paragraphs: [
          "Im dłużej czekasz, tym trudniejszy dowód, a w wyjątkowych przypadkach grozi utrata prawa według § 242 BGB. Dlatego nie zwlekaj: zgłoszenie wad powinno wyjść w ciągu kilku dni od wykrycia.",
        ],
      },
      {
        heading: "Błąd 10: usunąć wadę samemu i potem obniżyć czynsz",
        paragraphs: [
          "Samodzielne usunięcie jest dopuszczalne tylko przy wąskich przesłankach: wynajmujący musi zwlekać z usunięciem albo usunięcie musi być pilnie konieczne dla zachowania przedmiotu najmu (§ 536a Abs. 2 BGB). Kto pochopnie naprawia sam, zostaje z kosztami.",
        ],
        note:
          "Liczy się kolejność: najpierw wyznaczyć termin, udokumentować jego bezskuteczny upływ, i dopiero potem zlecić fachowcowi, jeśli wynajmujący nadal pozostaje bierny.",
      },
    ],
    faqs: [
      {
        question: "Jaki jest najczęstszy błąd przy obniżce czynszu?",
        answer:
          "Obniżenie czynszu bez wcześniejszego pisemnego zgłoszenia wady. Bez zgłoszenia z reguły nie ma wykonalnego roszczenia, a obniżenie jest traktowane jako zaległość.",
      },
      {
        question: "Czy mogę dostać wypowiedzenie z powodu obniżki czynszu?",
        answer:
          "Tak, i wcześniej, niż się często sądzi: zaległość przekraczająca jeden czynsz miesięczny w dwóch następujących po sobie terminach wystarcza do wypowiedzenia bez zachowania terminu (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a w związku z § 569 Abs. 3 Nr. 1 BGB). Późniejsza pełna dopłata sanuje tylko wypowiedzenie bez zachowania terminu, ale nie zgłoszone posiłkowo wypowiedzenie zwykłe (§ 569 Abs. 3 Nr. 2 BGB). Kto płaci z zastrzeżeniem, wyklucza to ryzyko z góry.",
      },
      {
        question: "Czy mogę zlecić usunięcie wady samodzielnie?",
        answer:
          "Tylko jeśli wynajmujący zwleka z usunięciem albo natychmiastowe usunięcie jest konieczne dla zachowania przedmiotu najmu (§ 536a Abs. 2 BGB). Zawsze wyznacz wcześniej termin i udokumentuj jego bezskuteczny upływ.",
      },
      {
        question: "Czy muszę wpuścić wynajmującego do mieszkania?",
        answer:
          "Tak. Po odpowiedniej zapowiedzi musisz umożliwić oględziny i usunięcie wady. Odmowa może kosztować Cię prawo do obniżki.",
      },
    ],
  },
  "maengelanzeige-zustellen": {
    navLabel: "Doręczenie zgłoszenia",
    title:
      "Doręczenie zgłoszenia wad: e-mail, list czy polecony?",
    metaTitle:
      "Doręczenie zgłoszenia wad: co naprawdę liczy się jako dowód doręczenia",
    description:
      "Jak doręczyć zgłoszenie wad w sposób dowodowy: dlaczego doręczenie rozstrzyga o obniżce, ile warte są e-mail, Einwurf-Einschreiben i posłaniec oraz która droga broni się przed sądem.",
    keywords: [
      "doręczenie zgłoszenia wad",
      "zgłoszenie wad listem poleconym",
      "dowód doręczenia zgłoszenia wad",
      "Einwurf-Einschreiben dowód",
      "zgłoszenie wad e-mailem",
    ],
    lead:
      "Obniżka czynszu działa praktycznie dopiero od dnia, w którym Twój wynajmujący dowie się o wadzie. Rozstrzyga więc nie to, kiedy napisałeś zgłoszenie, lecz kiedy do niego dotarło — i czy potrafisz to udowodnić. Właśnie na tym rozbija się większość spraw.",
    sections: [
      {
        heading: "Dlaczego doręczenie rozstrzyga o Twoich pieniądzach",
        paragraphs: [
          "Obniżka powstaje według § 536 BGB z mocy prawa, gdy tylko istnieje istotna wada. Wyegzekwować ją możesz jednak z reguły dopiero od chwili wiedzy wynajmującego, a tę zapewniasz mu zgłoszeniem. Moment jego doręczenia jest więc dniem, od którego się liczy.",
          "Zgłoszenie wad to oświadczenie woli wymagające dojścia do adresata. Według § 130 Abs. 1 BGB staje się skuteczne dopiero wtedy, gdy dojdzie do odbiorcy — czyli trafi do jego sfery władztwa tak, że w zwykłych okolicznościach może się z nim zapoznać. Przy liście jest to wrzucenie do skrzynki w zwykłej porze opróżniania.",
          "A ciężar dowodu spoczywa na Tobie. Jeśli wynajmujący zaprzecza, że cokolwiek otrzymał, musisz wykazać doręczenie. Jeśli nie możesz, obniżka za cały wcześniejszy okres staje pod znakiem zapytania — nawet jeśli wada bezspornie istniała.",
        ],
        note:
          "Częste nieporozumienie: liczy się nie wysłanie, lecz doręczenie. List, którego wrzucenie udowodniono, daje Ci wszystko; list, którego wysłanie udowodniono — prawie nic.",
      },
      {
        heading: "Porównanie dróg doręczenia",
        paragraphs: [
          "Wszystkie poniższe drogi są prawnie dopuszczalne — § 536c BGB nie przewiduje formy. Różnią się wyłącznie tym, co masz w ręku w razie sporu.",
        ],
        table: {
          caption: "Drogi doręczenia zgłoszenia i ich wartość dowodowa",
          head: ["Droga", "Wartość dowodowa", "Kiedy ma sens"],
          rows: [
            [
              "E-mail",
              "Niska. Raport wysyłki dowodzi wysłania, nie odbioru. Potwierdzenie przeczytania odbiorca może zablokować.",
              "Jako szybkie uzupełnienie, nigdy jako jedyna droga",
            ],
            [
              "Zwykły list",
              "Brak dowodu. Ani wrzucenie, ani treść nie są wykazane.",
              "Gdy relacje są dobre i nikt się nie spiera",
            ],
            [
              "Einwurf-Einschreiben",
              "Dobra. Wrzucenie do skrzynki jest dokumentowane i możliwe do prześledzenia.",
              "Praktyczna droga standardowa",
            ],
            [
              "Übergabe-Einschreiben (za podpisem)",
              "Ryzykowna. Jeśli wynajmujący nie odbierze przesyłki, właśnie nie uchodzi ona za doręczoną.",
              "Raczej nie — patrz niżej",
            ],
            [
              "Posłaniec ze świadkiem",
              "Bardzo dobra. Posłaniec może zaświadczyć o treści i o wrzuceniu.",
              "Gdy jest ktoś, komu ufasz",
            ],
            [
              "Doręczenie osobiste za pokwitowaniem",
              "Bardzo dobra, jeśli wynajmujący podpisze.",
              "Przy bezpośrednim kontakcie",
            ],
          ],
        },
      },
      {
        heading: "Dlaczego polecony za podpisem to gorszy wybór",
        paragraphs: [
          "Brzmi to początkowo przewrotnie: akurat najbardziej pracochłonny rodzaj przesyłki jest dla zgłoszenia wad najmniej pewny. Przyczyna leży w sposobie doręczania poleconego za podpisem.",
          "Jeśli doręczyciel nie zastanie odbiorcy, zostawia tylko awizo. Ta karteczka nie powoduje doręczenia — nie jest oświadczeniem, lecz jedynie wskazówką, że oświadczenie czeka. Jeśli wynajmujący przesyłki nie odbierze, po terminie przechowywania wróci ona do Ciebie, a prawnie nie stało się nic.",
          "Przy Einwurf-Einschreiben tej luki nie ma. Przesyłka jest wrzucana do skrzynki jak zwykły list i właśnie to wrzucenie jest dokumentowane. Doręczenie następuje więc niezależnie od tego, czy wynajmujący opróżnia skrzynkę.",
        ],
        note:
          "Kto chce mieć całkowitą pewność, łączy: Einwurf-Einschreiben jako solidny dowód, dodatkowo e-mail o tej samej treści, żeby informacja dotarła do wynajmującego także szybko.",
      },
      {
        heading: "Co dokumentować poza doręczeniem",
        bullets: [
          "Kopię pisma dokładnie w wersji, którą wysłałeś.",
          "Datę wysyłki oraz, przy Einwurf-Einschreiben, numer przesyłki z potwierdzeniem doręczenia.",
          "Zdjęcia lub filmy wady z rozpoznawalną datą, najlepiej na bieżąco przez cały okres.",
          "Prosty protokół wady: data, godzina, obserwacja. Przy hałasie albo awarii ogrzewania to w ogóle najważniejszy dowód.",
          "Nazwiska możliwych świadków, na przykład sąsiadów albo współlokatorów, którzy mogą potwierdzić stan.",
        ],
      },
      {
        heading: "Do kogo musi trafić zgłoszenie",
        paragraphs: [
          "Adresatem jest wynajmujący, czyli Twoja strona umowy najmu — nie automatycznie właściciel i nie dozorca. Jeśli zaangażowany jest zarządca i wskazano go w umowie jako przedstawiciela, możesz doręczyć jemu; w razie wątpliwości wyślij pismo do obu.",
          "Przy kilku wynajmujących po stronie wynajmującego — na przykład wspólnocie spadkobierców — oświadczenie musi dojść do wszystkich. Jeśli w umowie wskazano pełnomocnika do doręczeń, wystarczy ten jeden adres.",
          "Jeśli sami jesteście w umowie kilkoma najemcami, zgłoszenie powinni podpisać wszyscy albo przynajmniej rozpoznawalnie się na nie zgodzić. Unika się w ten sposób sporu, czy jeden mógł działać za wszystkich.",
        ],
      },
    ],
    faqs: [
      {
        question: "Czy zgłoszenie wad e-mailem wystarczy?",
        answer:
          "Prawnie tak, bo § 536c BGB nie przewiduje formy. Praktycznie e-mail jest jednak słaby: raport wysyłki dowodzi tylko, że wysłałeś, a nie że dotarło. Jeśli wynajmujący zaprzeczy odbiorowi, zostajesz bez dowodu. Używaj e-maila jako szybkiego uzupełnienia, nie jako jedynej drogi.",
      },
      {
        question: "Czy Einwurf-Einschreiben to polecony z podpisem?",
        answer:
          "Nie. Przy Einwurf-Einschreiben dokumentuje się, że przesyłka została wrzucona do skrzynki. Odbiorca nie podpisuje. Dla zgłoszenia wad to zaleta: doręczenie następuje z chwilą wrzucenia i nie zależy od tego, czy wynajmujący cokolwiek odbierze.",
      },
      {
        question: "Kiedy list uchodzi za doręczony?",
        answer:
          "Gdy trafił do sfery władztwa odbiorcy tak, że w zwykłych okolicznościach należy liczyć się z zapoznaniem. Przy wrzuceniu do skrzynki jest to moment zwykłego opróżniania — przy wrzuceniu późnym popołudniem z reguły dopiero dzień następny.",
      },
      {
        question: "Co robić, gdy wynajmujący zaprzecza odbiorowi?",
        answer:
          "Wtedy potrzebujesz swojego dowodu: potwierdzenia doręczenia Einwurf-Einschreiben, zeznania posłańca albo pokwitowania odbioru. Jeśli nie ma żadnego, pozostaje tylko niezwłocznie powtórzyć zgłoszenie w sposób dowodowy. Na przyszłość obniżka jest tym samym zabezpieczona, za przeszłość przeważnie nie.",
      },
      {
        question: "Czy muszę podpisać zgłoszenie?",
        answer:
          "Własnoręczny podpis nie jest wymagany, bo ustawa nie żąda formy pisemnej. Nigdy jednak nie szkodzi i czyni pismo jednoznacznie przypisywalnym Tobie.",
      },
      {
        question: "Czy mogę zlecić wysyłkę zgłoszenia?",
        answer:
          "Tak. Możesz sporządzić zgłoszenie wad tutaj bezpłatnie, a następnie zlecić nam jego wydrukowanie i wysłanie pocztą do wynajmującego — do wyboru jako list albo jako Einwurf-Einschreiben z udokumentowanym wrzuceniem. Bezpłatne pobranie w każdym razie Ci pozostaje.",
      },
    ],
  },

  "vermieter-reagiert-nicht": {
    navLabel: "Wynajmujący nie odpowiada",
    title:
      "Wynajmujący nie odpowiada na zgłoszenie wad: co możesz teraz zrobić",
    metaTitle: "Wynajmujący nie odpowiada na zgłoszenie wad: 6 kroków",
    description:
      "Termin upłynął i nic się nie dzieje? Co może zrobić najemca, gdy wynajmujący ignoruje zgłoszenie: obniżka, zatrzymanie czynszu, samodzielne usunięcie i pozew.",
    keywords: [
      "wynajmujący nie odpowiada",
      "wynajmujący ignoruje zgłoszenie wad",
      "wynajmujący nie usuwa wady",
      "termin upłynął zgłoszenie wad",
      "wyegzekwować usunięcie wady",
    ],
    lead:
      "Zgłosiłeś wadę, wyznaczyłeś termin — i nic się nie dzieje. To najczęstszy przebieg i nie powód do rezygnacji. Ustawa daje Ci na dokładnie taki przypadek kilka narzędzi. Mają różną ostrość, a kolejność jest ważna.",
    sections: [
      {
        heading: "Najpierw sprawdź: czy zgłoszenie w ogóle dotarło?",
        paragraphs: [
          "Zanim zaczniesz eskalować, wyjaśnij najmniej spektakularną możliwość: wynajmujący nigdy nie widział pisma. Bez doręczenia nie biegnie żaden termin, a wszystkie dalsze kroki stoją na piasku.",
          "Jeśli nie możesz wykazać doręczenia, powtórz zgłoszenie teraz w sposób dowodowy — przez Einwurf-Einschreiben albo przez posłańca, który może zaświadczyć o wrzuceniu. Wyznacz w nim nowy termin z konkretną datą. To kosztuje kilka dni i jest wyraźnie tańsze niż przegrany proces.",
        ],
        note:
          "Formułuj termin zawsze datą („do 15 września 2026 roku”), a nie okresem („w ciągu dwóch tygodni”). Przy dacie nie ma później sporu o to, kiedy zaczął biec.",
      },
      {
        heading: "Sześć możliwości w skrócie",
        ordered: [
          "Obniżka czynszu: powstaje z mocy prawa i jest pierwszą oraz najważniejszą dźwignią. Nie potrzebujesz do niej zgody wynajmującego.",
          "Drugie wyznaczenie terminu z zapowiedzią: drugie pismo, konkretnie nazywające konsekwencje, z doświadczenia porusza więcej niż pierwsze.",
          "Prawo zatrzymania: ponad obniżkę możesz tymczasowo zatrzymać kolejną część czynszu, żeby zbudować presję.",
          "Samodzielne usunięcie według § 536a Abs. 2 BGB: zlecasz usunięcie wady sam i odzyskujesz koszty.",
          "Pozew o usunięcie wady: droga, gdy chodzi o istotę i wynajmujący trwale blokuje.",
          "Wypowiedzenie bez zachowania terminu według § 543 BGB: tylko przy poważnych wadach i jako ostateczność.",
        ],
      },
      {
        heading: "Obniżka czynszu: dźwignia, którą masz od razu",
        paragraphs: [
          "Obniżka to jedyna reakcja, do której nie potrzebujesz nikogo. Powstaje automatycznie, gdy tylko istnieje istotna wada i wynajmujący o niej wie. Zgoda nie jest potrzebna, a klauzula w umowie najmu lokalu mieszkalnego wyłączająca prawo do obniżki jest nieważna według § 536 Abs. 4 BGB.",
          "Bezpieczną drogą pozostaje mimo to płacenie najpierw z zastrzeżeniem i żądanie zwrotu nadpłaty później. Kto obniża zbyt mocno i buduje przez to zaległość dwóch czynszów miesięcznych, ryzykuje wypowiedzeniem bez zachowania terminu według § 543 Abs. 2 Nr. 3 BGB — a to ryzyko nie pozostaje w żadnej proporcji do kilku procent, o które ktoś się pomylił.",
        ],
        note:
          "W razie wątpliwości lepiej obniżyć za mało niż za dużo. Różnicę możesz dochodzić później; uzasadnionego wypowiedzenia nie cofniesz.",
      },
      {
        heading: "Prawo zatrzymania: presja ponad obniżkę",
        paragraphs: [
          "Obok obniżki możesz zatrzymać kolejną część czynszu, dopóki wada istnieje. Inaczej niż obniżka nie jest to potrącenie ostateczne: zatrzymaną kwotę dopłacasz, gdy tylko wada zostanie usunięta. Jej celem jest wyłącznie zbudowanie presji.",
          "Co do wysokości nie ma reguły ustawowej; w praktyce często wymienia się trzy- do pięciokrotności miesięcznej kwoty obniżki. Sądy oceniają to różnie, a granice są nieostre.",
          "Zapowiedz zatrzymanie wyraźnie i nazwij je po imieniu. Kto bez słowa przelewa mniej, tworzy u wynajmującego obraz zalegającego najemcy — a dla siebie ryzyko wypowiedzenia.",
        ],
        note:
          "Zatrzymanie i obniżka sumują się. Policz razem wszystko, co zatrzymujesz, i pozostań wyraźnie poniżej progu zaległości dwóch czynszów miesięcznych.",
      },
      {
        heading: "Samodzielne usunięcie wady",
        paragraphs: [
          "Według § 536a Abs. 2 BGB możesz zlecić usunięcie wady sam i żądać zwrotu koniecznych nakładów — jednak tylko w dwóch przypadkach: gdy wynajmujący zwleka z usunięciem albo gdy niezwłoczne usunięcie jest konieczne dla zachowania lub przywrócenia przedmiotu najmu.",
          "Zwłoka zakłada, że wyznaczyłeś termin i upłynął on bezskutecznie. Udokumentuj oba fakty bez luk: pismo, dowód doręczenia, koniec terminu.",
          "Przed zleceniem uzyskaj co najmniej dwa kosztorysy i nie wybieraj najdroższego wykonawcy. Zwrot otrzymasz tylko za to, co było konieczne — a co ponad to, zostaje na Tobie.",
        ],
        note:
          "Samodzielne usunięcie to krok o największym własnym ryzyku finansowym. Przy wszystkim, co wykracza poza przejrzystą kwotę, warto wcześniej się poradzić.",
      },
      {
        heading: "Pozew o usunięcie wady",
        paragraphs: [
          "Jeśli wynajmujący pozostaje trwale bierny i nie chodzi o drobiazg, usunięcia możesz dochodzić sądownie. Roszczenie wynika z § 535 Abs. 1 Satz 2 BGB: wynajmujący jest zobowiązany do udostępniania mieszkania w stanie przydatnym do umówionego użytku, i to przez cały czas trwania najmu.",
          "Przy niebezpieczeństwie zwłoki — na przykład zimą bez ogrzewania — wchodzi w grę zabezpieczenie tymczasowe, wyraźnie szybsze niż zwykłe postępowanie.",
          "Sprawdź wcześniej swoje ubezpieczenie ochrony prawnej i, jeśli je masz, członkostwo w zrzeszeniu najemców. Oba z reguły obejmują dokładnie takie sprawy, a porada tam jest najsensowniejszym kolejnym krokiem przed pozwem.",
        ],
      },
      {
        heading: "Wypowiedzenie bez zachowania terminu: tylko w poważnych sprawach",
        paragraphs: [
          "Jeśli umówione korzystanie z mieszkania jest Ci odmawiane w całości albo w istotnej części, możesz wypowiedzieć umowę bez zachowania terminu według § 543 Abs. 2 Nr. 1 BGB. Warunkiem jest co do zasady bezskuteczny termin na usunięcie albo upomnienie.",
          "To najostrzejszy krok i wchodzi w grę tylko przy poważnych wadach — na przykład masywnym zagrzybieniu albo wielomiesięcznej awarii ogrzewania. Przy wypowiedzeniu, które później okaże się nieuzasadnione, odpowiadasz za szkodę.",
        ],
        note:
          "Przed wypowiedzeniem bez zachowania terminu w każdym razie zasięgnij porady prawnej. Skutki błędu są tu większe niż przy każdym innym kroku na tej stronie.",
      },
      {
        heading: "Gdzie otrzymasz wsparcie",
        bullets: [
          "Zrzeszenia najemców (Mieterverein): członkostwo kosztuje zwykle niską dwucyfrową kwotę rocznie i obejmuje poradę prawną. Dla spraw już toczących się często obowiązuje okres karencji — dlatego warto wstąpić, zanim się zapali.",
          "Ubezpieczenie ochrony prawnej z modułem prawa najmu: sprawdź zakres i zgłoś sprawę wcześnie.",
          "Adwokat specjalista z prawa najmu: za pierwszą poradę honoraria są ustawowo ograniczone.",
          "Centra ochrony konsumentów (Verbraucherzentrale): doradzają w sprawach najmu za przejrzyste opłaty.",
          "Inspekcja sanitarna (Gesundheitsamt): przy pleśni albo robactwie oględziny na miejscu mogą dostarczyć mocnego dowodu.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ile czasu muszę dać wynajmującemu?",
        answer:
          "Termin musi być odpowiedni, a co jest odpowiednie, zależy od wady. Przy awarii ogrzewania zimą odpowiednie są dni, przy kosztownym remoncie kilka tygodni. Orientacyjnie dla zwykłego przypadku przyjmuje się 14 dni. Wyznaczaj termin zawsze z konkretną datą.",
      },
      {
        question: "Czy mogę zatrzymać cały czynsz?",
        answer:
          "Tylko przy całkowitej nieprzydatności mieszkania, a to rzadki przypadek wyjątkowy. We wszystkich innych ryzyko wypowiedzenia jest znaczne: od zaległości dwóch czynszów miesięcznych wynajmujący może wypowiedzieć umowę bez zachowania terminu według § 543 Abs. 2 Nr. 3 BGB.",
      },
      {
        question: "Jaka jest różnica między obniżką a zatrzymaniem?",
        answer:
          "Obniżka zmniejsza należny czynsz ostatecznie — tych pieniędzy wynajmujący nigdy nie dostanie. Zatrzymanie jest tylko tymczasowe: kwotę dopłacasz, gdy tylko wada zostanie usunięta. Jego celem jest presja, nie oszczędność. Obie można podnosić obok siebie.",
      },
      {
        question: "Czy mogę dostać wypowiedzenie z powodu zgłoszenia wad?",
        answer:
          "Wypowiedzenie tylko dlatego, że dochodzisz swoich praw, byłoby niedopuszczalną szykaną. Ryzykownie robi się dopiero wtedy, gdy zatrzymasz za dużo i powstanie przez to zaległość — wówczas wypowiedzenie może się na niej oprzeć. Dlatego: obniżać ostrożnie i płacić z zastrzeżeniem.",
      },
      {
        question:
          "Wynajmujący wciąż przysyła fachowców, którzy nic nie zmieniają. Co wtedy?",
        answer:
          "Decyduje stan mieszkania, a nie liczba prób. Dopóki wada trwa, trwa też prawo do obniżki. Dokumentuj każdą wizytę z datą i wynikiem — ta chronologia jest przed sądem bardzo wymowna.",
      },
      {
        question: "Czy muszę umożliwiać wizyty fachowców?",
        answer:
          "Tak. Po odpowiedniej zapowiedzi musisz udzielić dostępu w celu usunięcia wady. Kto odmawia, może stracić prawo do obniżki, bo usunięcie nie dochodzi wtedy do skutku z jego winy.",
      },
    ],
  },
};

export default pl;
