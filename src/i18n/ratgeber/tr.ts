import type { RatgeberUebersetzung } from "./typen";

/**
 * Turkish guides. Keys are the German slugs from `src/data/ratgeber.ts`; the
 * URL slugs live in `src/i18n/pfade.ts`.
 *
 * German legal terms are carried along in brackets on first use — a reader who
 * takes this to a landlord or a court needs the German word, not only its
 * Turkish rendering. Statute references (§ 536c BGB) stay as they are.
 *
 * The sample letter keeps its German body on purpose. It is the text that gets
 * sent to a German landlord, so translating it would produce a letter nobody
 * can use. Only the bracketed instructions — which the reader replaces anyway —
 * carry a Turkish gloss.
 */
const tr: RatgeberUebersetzung = {
  "maengelanzeige-schreiben": {
    navLabel: "Ayıp bildirimi yazma",
    title:
      "Ayıp bildirimi (Mängelanzeige) yazma: örnek metin, zorunlu bilgiler ve süreler",
    metaTitle:
      "Ayıp bildirimi yazma: § 536c BGB'ye göre örnek ve rehber",
    description:
      "Ev sahibine ayıp bildirimi (Mängelanzeige): § 536c BGB'ye göre tüm zorunlu bilgiler, kopyalanabilir eksiksiz bir örnek metin, süreler ve doğru tebligat yolu.",
    keywords: [
      "ayıp bildirimi yazma",
      "Mängelanzeige örnek",
      "ev sahibine ayıp bildirimi",
      "§ 536c BGB",
      "kusuru ev sahibine bildirme",
    ],
    lead:
      "Ayıp bildirimi (Mängelanzeige) olmadan kira indiriminde hiçbir şey yürümez. Bildirimi yapmayan kiracı kural olarak indirim yapamaz ve en kötü ihtimalle ev sahibine tazminat borçlu hale gelir. Burada yazıda nelerin bulunması gerektiğini, hangi süreyi vermeniz gerektiğini ve bildirimi nasıl ispatlanabilir şekilde tebliğ edeceğinizi okuyacaksınız.",
    sections: [
      {
        heading: "Ayıp bildirimi neden vazgeçilmezdir",
        paragraphs: [
          "§ 536c BGB, kira süresi içinde ortaya çıkan bir kusurun kiracı tarafından gecikmeksizin bildirilmesini ister. „Gecikmeksizin“ (unverzüglich) kusurlu bir gecikme olmadan demektir. Yani kusurun fark edilmesi ile bildirim arasında birkaç günden fazla zaman geçmemelidir.",
          "Bildirimi yapmayan iki kez kaybeder. Birincisi, kirayı indirme hakkını. İkincisi, bildirim yapılmadığı için zarar büyürse ev sahibine karşı tazminat sorumluluğu doğabilir; örneğin nemli bir duvar zamanla kapsamlı bir tadilat vakasına dönüşürse.",
          "İndirim her ne kadar kanun gereği kendiliğinden doğsa da, ancak ev sahibinin kusurdan haberdar olduğu günden itibaren uygulanabilir. Bu nedenle ayıp bildiriminizin tarihi aynı zamanda talebinizin başlangıç tarihidir.",
        ],
        note:
          "Bir istisna vardır: Ev sahibi kusuru zaten biliyorsa — kapıcı gördüğü için veya bütün bina etkilendiği için — bildirim yükümlülüğü ortadan kalkar. Yine de buna güvenmemelisiniz. Kısa bir yazı çok az şeye mal olur ve sonradan çıkacak her ispat sorununu ortadan kaldırır.",
      },
      {
        heading: "Ayıp bildiriminde bulunması gereken dokuz bilgi",
        ordered: [
          "Gönderen: Tam adınız ve kiralık dairenin adresi",
          "Alıcı: Ev sahibinin veya bina yönetiminin (Hausverwaltung) adı ve adresi",
          "Yazının tarihi",
          "„Mängelanzeige“ kelimesini ve daireyi içeren konu satırı (adres, kat, varsa daire numarası)",
          "Kusurun somut tarifi: Tam olarak nedir, hangi odada, ne zamandan beri, kendini nasıl gösteriyor?",
          "Delillere atıf: ekteki fotoğraflar, sıcaklık veya gürültü tutanakları, tanıklar",
          "Somut tarihli bir süre ile kusurun giderilmesi talebi",
          "Kirayı indireceğinizi veya giderilene kadar ihtirazi kayıtla (unter Vorbehalt) ödeyeceğinizi belirten ifade",
          "İmzanız",
        ],
        paragraphs: [
          "En sık yapılan hata, tarifin fazla belirsiz olmasıdır. „Banyoda küf var“ yeterli değildir. Daha iyisi: „Banyonun kuzey duvarında, duşun üzerinde, 3 Mart 2026 tarihinden beri yaklaşık 40 × 30 cm büyüklüğünde küf bulunmaktadır. Tabaka siyah-yeşilimsidir, küf kokusu vardır.“",
        ],
      },
      {
        heading: "Hangi süreyi vermelisiniz",
        table: {
          caption: "Kusurun giderilmesi için alışılmış süreler",
          head: ["Kusurun türü", "Uygun süre", "Örnekler"],
          rows: [
            [
              "Acil durum / sağlık tehlikesi",
              "derhal ila 24 saat",
              "Kışın ısıtmanın çalışmaması, tam elektrik kesintisi, tek tuvaletin bozulması",
            ],
            [
              "Acele kusur",
              "3 ila 7 gün",
              "Su hasarı, yoğun küflenme, kilitlenmeyen daire kapısı",
            ],
            [
              "Normal kusur",
              "14 gün",
              "Sızdıran pencereler, bozuk asansör, damlayan batarya",
            ],
            [
              "Önemsiz kusur",
              "3 ila 4 hafta",
              "Bozuk zil, sıcak suyun uzun beklemesi, nemli bodrum",
            ],
          ],
        },
        paragraphs: [
          "Süreye somut bir tarih yazın („20 Ağustos 2026 tarihine kadar“), „iki hafta içinde“ gibi bir zaman aralığı değil. Sürenin ne zaman dolduğu ancak tarihle tartışmasız belli olur ve sonraki bütün adımlar bu tarihe dayanır.",
        ],
      },
      {
        heading: "Örnek: Ev sahibine ayıp bildirimi",
        code:
          "[Adınız / Ihr Name]\n[Sokak ve kapı numarası / Straße und Hausnummer]\n[Posta kodu, şehir / PLZ, Ort]\n\n[Şehir / Ort], [Tarih / Datum]\n\nAn\n[Ev sahibinin / bina yönetiminin adı]\n[Adres / Anschrift]\n\nBetreff: Mängelanzeige für die Wohnung [adres, kat, daire no]\n\nSehr geehrte Damen und Herren,\n(adı bilinen bir kişide: Sehr geehrte Frau [soyadı], /\nSehr geehrter Herr [soyadı],)\n\nhiermit zeige ich Ihnen folgenden Mangel in der von mir gemieteten\nWohnung an:\n\n[Kusurun Almanca ve somut tarifi: nedir, hangi odada, ne zamandan\nberi, kendini nasıl gösteriyor?]\n\nAls Nachweis füge ich diesem Schreiben [Fotos / ein Temperaturprotokoll /\nein Lärmprotokoll] bei.\n\nIch fordere Sie auf, den Mangel bis zum [somut tarih] zu beseitigen.\n\nBis zur vollständigen Beseitigung des Mangels werde ich die Miete\n[um X % mindern  → %X oranında indireceğim /\n unter Vorbehalt in voller Höhe zahlen  → ihtirazi kayıtla tam ödeyeceğim].\n\nSollte der Mangel nicht fristgerecht beseitigt werden, behalte ich mir\nweitere rechtliche Schritte vor, insbesondere Schadensersatz gemäß\n§ 536a Abs. 1 BGB und die Selbstvornahme gemäß § 536a Abs. 2 BGB.\n\nMit freundlichen Grüßen\n\n[İmza / Unterschrift]\n[Ad soyad / Name]\n\nAnlagen:\n- [Kusurun fotoğrafları / Fotos vom Mangel]\n- [Tutanak / Protokoll]",
      },
      {
        heading: "Ayıp bildirimini ispatlanabilir şekilde nasıl tebliğ edersiniz",
        paragraphs: [
          "Kanun ayıp bildirimi için bir şekil şartı öngörmez, teorik olarak sözlü bildirim de yeterli olurdu. Ancak uyuşmazlık halinde ev sahibinin bildirimi aldığını ve ne zaman aldığını ispatlamanız gerektiğinde bu size pek yardımcı olmaz. Bu yüzden tebligat yolu önemlidir.",
        ],
        bullets: [
          "Einwurf-Einschreiben (postaya atmalı taahhütlü): ispat ile maliyet arasında iyi bir denge, teslim belgesi çevrimiçi görüntülenebilir",
          "Tanıklı kurye: Bir kişi yazıyı okur, posta kutusuna atar ve sonradan her ikisine de tanıklık edebilir. Hiçbir maliyeti yoktur ve mahkemede geçerlidir.",
          "Yazılı teslim alma belgesiyle elden teslim: ev sahibi işbirliği yapıyorsa en güvenli yol",
          "Übergabe-Einschreiben (imza karşılığı taahhütlü): riskli, çünkü alıcı teslim almayı reddedebilir ve mektup o zaman ulaşmamış sayılır",
          "Yalnızca e-posta: tek başına ispat için yetersiz, çünkü ulaştığı neredeyse hiç belgelenemez",
        ],
        note:
          "Uygulamadan bir not: Bildirimi ek olarak e-postayla da gönderin, böylece hemen masaya gelir. Ancak ispat için posta yolu geçerlidir.",
      },
      {
        heading: "Ayıp bildiriminden sonra ne olur",
        ordered: [
          "Ev sahibi kusuru inceler ve giderilmesi için iş verir. Kusuru önceden görmek onun hakkıdır.",
          "Önceden haber verilmesi koşuluyla inceleme ve onarım için girişe izin vermeniz gerekir. Reddetmeniz indirim hakkınıza mal olabilir.",
          "Bildirimin ulaşmasından itibaren kira kanun gereği indirilmiştir. Tereddüt halinde önce ihtirazi kayıtla ödemeye devam edin.",
          "Süre sonuçsuz geçerse § 536a Abs. 1 BGB uyarınca tazminat ve § 536a Abs. 2 BGB uyarınca kusurun kendiniz giderilmesi (Selbstvornahme) gündeme gelir.",
          "Kusur giderildiğinde indirim sona erer. O günden itibaren yeniden tam kira ödenir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ayıp bildiriminin yazılı olması zorunlu mu?",
        answer:
          "Yazılı şekil zorunlu değildir, bildirim sözlü olarak da geçerli olurdu. Ancak uyuşmazlık halinde bildirimin ev sahibine ulaştığını ispatlamanız gerekir. Bu nedenle pratikte yazılı bir metinden — Einwurf-Einschreiben ile veya tanıklı bir kurye aracılığıyla tebliğ edilmiş — kaçış yoktur.",
      },
      {
        question: "Bir kusuru ne kadar hızlı bildirmem gerekir?",
        answer:
          "§ 536c BGB gecikmeksizin diyor, yani kusurlu bir gecikme olmadan. Pratikte bu, fark edildikten sonra birkaç gün içinde demektir. Su hasarı ve benzeri acil durumları en iyisi aynı gün bildirin.",
      },
      {
        question: "Birden fazla kusuru tek bir ayıp bildiriminde bildirebilir miyim?",
        answer:
          "Evet, üstelik bu mantıklıdır. Her kusuru oda, başlangıç tarihi ve görünümüyle ayrı bir paragrafta tarif edin. Böylece bildirim anlaşılır kalır ve tek tek kusurların indirim oranlarını toplayabilirsiniz.",
      },
      {
        question: "Kusuru bildirmezsem ne olur?",
        answer:
          "Kural olarak bildirimden önceki dönem için indirim hakkınızı kaybedersiniz. Daha da kötüsü olabilir: Ev sahibi bilmediği için zarar büyürse, duruma göre bundan siz sorumlu olursunuz (§ 536c Abs. 2 BGB).",
      },
    ],
  },
  "mietminderung-berechnen": {
    navLabel: "Kira indirimi hesaplama",
    title:
      "Kira indirimi hesaplama: formül, örnekler ve hesaplama temeli",
    metaTitle:
      "Kira indirimi hesaplama: formül, örnekler ve brüt sıcak kira",
    description:
      "Kira indirimi hesaplama: hesaplama temelinin neden brüt sıcak kira (Bruttowarmmiete) olduğu, formülün nasıl işlediği ve birden fazla kusurda ne geçerli olduğu. Hesap örnekleriyle.",
    keywords: [
      "kira indirimi hesaplama",
      "kira indirimi Bruttowarmmiete",
      "kira indirimi formülü",
      "kira indirimi örneği",
      "indirim oranı hesaplama",
    ],
    lead:
      "Kira indirimi hesaplanırken en sık yanlış giden şey oran değil, oranın uygulandığı sayıdır. Brüt sıcak kira (Bruttowarmmiete) yerine soğuk kiradan (Kaltmiete) yola çıkan, her ay para kaybeder. Doğru hesap şöyle yapılır.",
    sections: [
      {
        heading: "Hesaplama temeli her zaman brüt sıcak kiradır",
        paragraphs: [
          "Alman Federal Yüksek Mahkemesi (Bundesgerichtshof) bu soruyu 2005'te açıklığa kavuşturdu: İndirimin hesaplama temeli net soğuk kira değil, brüt sıcak kiradır. Konut kirası için 20 Temmuz 2005 tarihli karar geçerlidir (dosya no. VIII ZR 347/04); ticari kira için BGH 6 Nisan 2005'te aynı yönde karar vermişti (dosya no. XII ZR 225/03).",
          "Kastedilen, net soğuk kira artı bütün işletme gideri avansları veya götürü bedelleridir. Arkasındaki mantık şudur: Daireyi bir bütün paket olarak ödersiniz, dolayısıyla bir kusur da bütün paketin değerini düşürür.",
        ],
        table: {
          caption: "Brüt sıcak kiranın bileşimi",
          head: ["Kalem", "Örnek tutar"],
          rows: [
            ["Net soğuk kira (Nettokaltmiete)", "800,00 €"],
            ["İşletme gideri avansı (Betriebskosten)", "150,00 €"],
            ["Isıtma gideri avansı (Heizkosten)", "50,00 €"],
            ["Brüt sıcak kira (hesaplama temeli)", "1.000,00 €"],
          ],
        },
        note:
          "Örnekte soğuk ve sıcak kira arasındaki fark, %20 indirimde ayda 40 € eder. Yıllık hesapla bu 480 € demektir.",
      },
      {
        heading: "Formül",
        code:
          "İndirim tutarı  = Brüt sıcak kira × indirim oranı ÷ 100\nÖdenecek kira   = Brüt sıcak kira − indirim tutarı",
        paragraphs: [
          "1.000 € brüt sıcak kira ve %30 indirim oranında indirim tutarı 300 € olur. O zaman ödenecek tutar 700 €'dur.",
        ],
      },
      {
        heading: "Daha kısa süreler için gün hesabı",
        paragraphs: [
          "Kusur ayın tamamında yoksa oransal hesaplanır. Alışılmış olan, ayı 30 gün üzerinden hesaplamaktır.",
        ],
        code:
          "İndirim tutarı = (Brüt sıcak kira ÷ 30) × kusurlu gün sayısı × oran ÷ 100\n\nÖrnek: 1.000 € sıcak kira, 12 gün ısıtma arızası, oran %80\n= (1.000 ÷ 30) × 12 × 0,80\n= 33,33 € × 12 × 0,80\n= 320,00 €",
        note:
          "Kusurun başlangıcını ve bitişini güne kadar not edin. Talebinizin tutarı sonradan tam olarak bu iki tarihten çıkar.",
      },
      {
        heading: "Aynı anda birden fazla kusur",
        paragraphs: [
          "Burada inatçı bir yanlış inanış var: Birden fazla kusurun oranlarının basitçe toplanabileceği. Mahkemeler böyle yapmaz. § 536 Abs. 1 BGB uyarınca dairenin bir bütün olarak kullanılabilirliğinin ne kadar zedelendiğini sorar ve bütüncül bir değerlendirme yaparlar. Bu nedenle kabul edilen toplam oran kural olarak tek tek değerlerin toplamının altında kalır.",
          "Tablo değerlerinin toplamı bu yüzden ancak kaba bir üst sınır olarak işe yarar, sonuç olarak değil. Bu, özünde aynı zedelenmeyi anlatan kusurlarda özellikle belirginleşir: Bozuk radyatör ile bu yüzden fazla soğuk olan daire bir kez değerlendirilir, iki kez değil.",
        ],
        table: {
          caption: "Örnek: bütüncül değerlendirmede birden fazla kusur",
          head: ["Kusur", "Tekil oran"],
          rows: [
            ["Bir odada küf", "%10"],
            ["Aynı odada sızdıran pencereler", "%8"],
            ["Bozuk asansör (4. kat)", "%10"],
            ["Tekil değerlerin toplamı (yalnızca fikir vermek için)", "%28"],
            ["Gerçekçi toplam oran", "%28'in altında"],
          ],
        },
        note:
          "Hesaplayıcımız bunu yansıtır: En yüksek tekil değer tam sayılır, sonraki her biri yalnızca yarısı kadar. Bu da bir tahmindir, ama basit bir toplamanın daha dört beş kusurda ürettiği %100'lük sonuçları artık üretmez.",
      },
      {
        heading: "İşletme gideri hesabına etkisi",
        paragraphs: [
          "Kira indirimi yıllık işletme gideri hesabını (Betriebskostenabrechnung) da etkiler. Avanslar indirilmiş brüt sıcak kiranın parçası olduğundan, indirim dönemine ilişkin bir ek ödeme talebi buna göre azaltılmalıdır.",
          "Bu yüzden hesabınızı, ev sahibinin indirimi dikkate alıp almadığı bakımından inceleyin. Almadıysa § 556 Abs. 3 BGB'deki on iki aylık itiraz süresi içinde yazılı olarak itiraz edin.",
        ],
      },
      {
        heading: "Doğru oranı nasıl bulursunuz",
        bullets: [
          "Benzer olaylara ilişkin mahkeme kararlarını derleyen yayımlanmış kira indirimi tablolarından yararlanın",
          "Zedelenmenin süresini, yoğunluğunu ve kapsamını hesaba katın; tablo değerleri aralıklardır, sabit büyüklükler değil",
          "Tereddütte temkinli tahmin edin: Fazla düşük bir indirim paraya, fazla yüksek bir indirim daireye mal olabilir",
          "Büyük tutarlarda oranı bir kiracı derneğine (Mieterverein) veya kira hukuku avukatına inceletin",
        ],
        note:
          "Bu tür tablolardaki bütün yüzde değerleri tekil olay kararlarından gelir ve yalnızca fikir vericidir. Hiçbir mahkeme bunlarla bağlı değildir; her zaman somut olay değerlendirilir.",
      },
    ],
    faqs: [
      {
        question: "Kira indirimi soğuk kiradan mı sıcak kiradan mı hesaplanır?",
        answer:
          "Brüt sıcak kiradan, yani net soğuk kira artı bütün işletme ve ısıtma gideri avanslarından. Konut kirası için bunu Federal Yüksek Mahkeme 20 Temmuz 2005 tarihli kararıyla belirlemiştir (dosya no. VIII ZR 347/04).",
      },
      {
        question: "Kusur yalnızca iki hafta sürdüyse nasıl hesaplarım?",
        answer:
          "Gün hesabıyla: Brüt sıcak kirayı 30'a bölün, kusurlu gün sayısıyla ve ardından indirim oranıyla çarpın. 1.000 € sıcak kira, 14 gün ve %20'de bu 93,33 € eder.",
      },
      {
        question: "Birden fazla kusurun oranlarını toplayabilir miyim?",
        answer:
          "Hayır, en azından sonuç olarak değil. Mahkemeler toplamaz, dairenin bütün olarak ne kadar zedelendiğini bütüncül bir değerlendirmeyle belirler. Tekil değerlerin toplamı yalnızca kaba bir üst sınırdır; kabul edilen oran düzenli olarak bunun altında kalır ve hiçbir zaman %100'ü aşamaz.",
      },
      {
        question:
          "Kira indirimi işletme gideri hesabında dikkate alınmak zorunda mı?",
        answer:
          "Evet. Avanslar indirilmiş brüt sıcak kiranın parçası olduğundan, indirim dönemine ilişkin bir ek talep oransal olarak azaltılmalıdır. Hesabı inceleyin ve size ulaşmasından itibaren on iki ay içinde itiraz edin.",
      },
    ],
  },
  "miete-unter-vorbehalt-zahlen": {
    navLabel: "Kirayı ihtirazi kayıtla ödeme",
    title:
      "Kirayı ihtirazi kayıtla ödeme: kira indirimine giden güvenli yol",
    metaTitle:
      "Kirayı ihtirazi kayıtla ödeme: ifade biçimi ve geri talep",
    description:
      "Kusur halinde kirayı neden ihtirazi kayıtla (unter Vorbehalt) ödemeniz gerektiği, kaydı nasıl ifade edeceğiniz ve fazla ödenen kirayı nasıl geri isteyeceğiniz.",
    keywords: [
      "kirayı ihtirazi kayıtla ödeme",
      "kira indiriminde ihtirazi kayıt",
      "kirayı geri isteme",
      "havale açıklamasında ihtirazi kayıt",
    ],
    lead:
      "Kirayı kendi başına kesen ve oranı yanlış tahmin eden, en kötü ihtimalle derhal fesihle karşılaşır. Başka bir yol da var: tam ödemeye devam etmek, ihtirazi kaydı bildirmek, parayı sonradan geri almak. Ekonomik sonuç aynıdır, ama risksiz.",
    sections: [
      {
        heading: "Doğrudan kesmenin riski",
        paragraphs: [
          "Oranı fazla yüksek belirleyen bir borç birikimi yaratır ve bu, çoğu kişinin sandığından hızlı tehlikeli hale gelir. Kiranın önemsiz sayılmayacak bir bölümünde arka arkaya iki ödeme tarihinde temerrüde düşerseniz ev sahibi derhal fesih hakkını kullanabilir (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a BGB). „Önemsiz sayılmayacak“ ölçüsü § 569 Abs. 3 Nr. 1 BGB uyarınca zaten bir aylık kiradan fazlası demektir. İki aylık kira eşiği ancak daha uzun bir dönem için geçerlidir (b bendi).",
          "%40 alıkoyan biri, daha üç ayda bir aylık kiranın üzerine çıkar. Bu konuda iyi niyete pek dayanamazsınız: BGH, kiracının kusursuz hukuki yanılgısı için katı ölçütler uygular ve önceki kolaylıkları açıkça terk etmiştir. Oranda gri alanda dolaşan kimse ihmalkâr davranmış olur.",
        ],
        note:
          "İhtirazi kayıtla ödeme tam burada devreye girer: Tam tutarı ödemeye devam edersiniz, ama geri talep hakkınızı kaybetmezsiniz.",
      },
      {
        heading: "İhtirazi kayıtla ödeme nasıl işler",
        ordered: [
          "Kusuru yazılı olarak bildirir ve giderilmesi için bir süre verirsiniz.",
          "Ayıp bildiriminde, kirayı bundan böyle yalnızca ihtirazi kayıtla ödeyeceğinizi açıkça belirtirsiniz.",
          "Kiranın tamamını göndermeye devam eder ve ihtirazi kaydı havale açıklamasına yazarsınız.",
          "Kusur sürdüğü sürece onu eksiksiz belgelersiniz.",
          "Kusur giderildikten sonra fazla ödenen tutarı, gerekirse mahkeme yoluyla geri istersiniz.",
        ],
      },
      {
        heading: "Doğru ifade biçimi",
        paragraphs: [
          "İhtirazi kaydın somut kusurla ilişkisi anlaşılır olmalıdır. İlişkisi kurulmamış genel bir „ihtirazi kayıtla“ ifadesi güvenli biçimde yeterli değildir.",
        ],
        code:
          "Havalenin açıklama alanında:\n\n  Miete [ay/yıl], Zahlung unter Vorbehalt wegen Mangel\n  (Schimmel Schlafzimmer, angezeigt am 12.03.2026)\n  [Kira (ay/yıl), kusur nedeniyle ihtirazi kayıtla ödeme —\n   yatak odasında küf, 12.03.2026 tarihinde bildirildi]\n\nEv sahibine yazılan metinde:\n\n  Bis zur vollständigen Beseitigung des angezeigten Mangels zahle\n  ich die Miete ausdrücklich nur unter Vorbehalt der Rückforderung.\n  Ein Verzicht auf mein Minderungsrecht nach § 536 BGB ist damit\n  nicht verbunden.",
        note:
          "Havale açıklamasında yer dardır. Ayıp bildiriminizin tarihini içerdiği sürece kısa bir biçim yeterlidir.",
      },
      {
        heading: "Geri talep: süreler ve izlenecek yol",
        paragraphs: [
          "Geri talep hakkı üç yılda zamanaşımına uğrar. Süre, hakkın doğduğu ve hakkı doğuran koşulları öğrendiğiniz yılın sonunda başlar. Öğrenmeden bağımsız olarak on yıllık mutlak bir zamanaşımı süresi geçerlidir.",
          "Tutarı yazılı olarak ve süre vererek geri isteyin. Hesabı açıkça gösterin: dönem, oran, brüt sıcak kira, toplam. Ev sahibi hareketsiz kalırsa sıradaki adım kiracı derneği (Mieterverein) veya bir uzman avukattır.",
        ],
      },
      {
        heading: "Doğrudan kesmenin yine de mantıklı olabileceği durumlar",
        bullets: [
          "Kusur açıktır ve oran tartışmasızdır, örneğin mahkemece doğrulanmış bir konut alanı sapmasında",
          "Ev sahibi indirimi hem esas hem tutar bakımından yazılı olarak kabul etmiştir",
          "Bir kiracı derneği veya avukat oranı incelemiş ve onaylamıştır",
          "Kusur uzun süredir vardır ve ev sahibi tekrarlanan süre vermelere rağmen hareketsiz kalmaktadır",
        ],
        note:
          "O durumda da şu geçerlidir: Oranda temkinli kalın. Birkaç yüzde puanının ekonomik faydası, bir fesih riskiyle hiçbir şekilde orantılı değildir.",
      },
    ],
    faqs: [
      {
        question: "„Kirayı ihtirazi kayıtla ödemek“ ne demektir?",
        answer:
          "Kiranın tamamını ödemeye devam edersiniz, ancak kusur nedeniyle fazla ödediğiniz kısmı sonradan geri isteme hakkınızı açıkça saklı tutarsınız. Böylece bir ödeme borcu birikmesini ve dolayısıyla derhal fesih riskini önlersiniz.",
      },
      {
        question: "Havalede ihtirazi kaydı nasıl yazarım?",
        answer:
          "Açıklama alanına örneğin: „Miete 04/2026, Zahlung unter Vorbehalt wegen Mangel (Schimmel Schlafzimmer, angezeigt am 12.03.2026)“. Önemli olan, daha önce bildirilmiş somut kusurla ilişkinin anlaşılır olmasıdır.",
      },
      {
        question: "Fazla ödenen kirayı ne kadar süreyle geri isteyebilirim?",
        answer:
          "Hak düzenli olarak üç yılda zamanaşımına uğrar; süre, hakkın doğduğu ve bilgi sahibi olduğunuz yılın sonundan itibaren işler. Bilgiden bağımsız olarak hak en geç on yıl sonra sona erer.",
      },
      {
        question: "Tam ödersem indirim hakkımı kaybeder miyim?",
        answer:
          "Yalnızca istisnai durumlarda, o da § 242 BGB uyarınca hakkın kötüye kullanılması (Verwirkung) yoluyla. Yaygın bir anlatının aksine altı aylık sabit bir ölçüt yoktur. Her ödemede açıkça konan ihtirazi kayıt, bu soruyu baştan etkisiz kılar.",
      },
    ],
  },
  "mietminderung-rueckwirkend": {
    navLabel: "Geriye dönük indirim",
    title:
      "Geriye dönük kira indirimi: parayı ne zaman geri isteyebilirsiniz",
    metaTitle:
      "Geriye dönük kira indirimi: geri talep ne zaman mümkün",
    description:
      "Geriye dönük indirim yalnızca dört durumda mümkündür. Bunların hangileri olduğu, hangi zamanaşımı sürelerinin geçerli olduğu ve geri talepte nasıl ilerleyeceğiniz.",
    keywords: [
      "geriye dönük kira indirimi",
      "kirayı geriye dönük indirme",
      "kira indiriminde zamanaşımı",
      "fazla ödenen kirayı geri isteme",
    ],
    lead:
      "„Geçmiş aylar için para geri isteyebilir miyim?“ sorusu, kira indirimiyle ilgili en sık sorulanlardan biridir. Dürüst yanıt şudur: çoğunlukla hayır. Ancak açıkça sınırlanmış dört istisna vardır ve bunları bilmelisiniz.",
    sections: [
      {
        heading: "İlke: ev sahibinin bilgi sahibi olmasından itibaren",
        paragraphs: [
          "§ 536 BGB uyarınca önemli bir kusur bulunduğu anda kira kendiliğinden indirilmiş olur. Ancak hak, ancak ev sahibi kusurdan haberdar olduğunda, yani normal durumda ayıp bildiriminizin ona ulaşmasından itibaren uygulanabilir.",
          "Öncesi için şu geçerlidir: Kusuru bilen ve buna rağmen kirayı ihtirazi kayıt koymadan tam ödeyen, parayı kural olarak geri isteyemez.",
        ],
      },
      {
        heading: "Geri talebe izin veren dört durum",
        bullets: [
          "Kirayı ihtirazi kayıtla ödediniz; geri talep hakkı o zaman tam olarak korunur",
          "Ev sahibi kusuru zaten biliyordu, örneğin kendisi gördüğü veya bütün bina etkilendiği için",
          "Ev sahibi konut alanını yanlış bildirdi; bu durumda hak kira başlangıcından itibaren doğar",
          "Kira sözleşmesi, sizi indirimden alıkoyan geçersiz bir hüküm içeriyor",
        ],
        note:
          "Son maddeyi küçümsemeyin. Özellikle eski kira sözleşmeleri çoğu kez indirim hakkını dışlamayı amaçlayan hükümler içerir. Konut kirasında bu tür hükümler § 536 Abs. 4 BGB uyarınca geçersizdir, buna rağmen yüzünden yıllarca fazla ödeme yapılmıştır.",
      },
      {
        heading: "Hakkın kötüye kullanılması: uzun beklemek hakka mal olduğunda",
        paragraphs: [
          "Kusuru bildiğiniz halde uzun süre ihtirazi kayıt koymadan tam kira öderseniz, indirim hakkı istisnai durumlarda düşebilir (Verwirkung). Ancak eskiden yaygın olan altı aylık ölçüt, 2001'de yürürlükten kaldırılan eski § 539 BGB'ye ilişkin içtihattan gelir ve bu haliyle artık geçerli değildir: BGH 2003'te, kusur bilinerek ihtirazi kayıtsız ödeme yapılmasının § 536b BGB kıyasen uygulanarak hak kaybına yol açmadığına karar vermiştir.",
          "Hukuken bu düşme için iki bileşen gerekir. Zaman unsuru: Uzunca bir süre geçmiştir. Ve durum unsuru: Ev sahibi davranışınızdan artık indirim yapmayacağınız sonucunu çıkarabilirdi. Hakka ancak ikisi birlikte mal olur.",
        ],
      },
      {
        heading: "Zamanaşımı sürelerine genel bakış",
        table: {
          head: ["Süre", "Uzunluk", "Başlangıç"],
          rows: [
            [
              "Geri talep hakkının olağan zamanaşımı",
              "3 yıl",
              "Hakkın doğduğu ve bilgi sahibi olduğunuz yılın sonu",
            ],
            [
              "Mutlak zamanaşımı",
              "10 yıl",
              "Hakkın doğması, bilgiden bağımsız olarak",
            ],
            [
              "İndirim hakkının düşmesi (§ 242 BGB)",
              "sabit ölçüt yok, istisnai durum",
              "İhtirazi kayıtsız ödemede kusurun bilinmesi",
            ],
          ],
        },
      },
      {
        heading: "Geri talepte nasıl ilerlersiniz",
        ordered: [
          "Dönemi ve oranı belirleyin, hesabı izlenebilir biçimde kurun.",
          "Belgeleri toplayın: ayıp bildirimi, fotoğraflar, tutanaklar, yazışmalar, hesap dökümleri.",
          "Ev sahibini yazılı olarak, yaklaşık 14 günlük somut bir süreyle geri ödemeye davet edin.",
          "Reddedilirse kiracı derneğini veya uzman avukatı devreye sokun; çoğu kez bir avukat yazısı zaten yeterli olur.",
          "Zamanaşımı dolmadan mahkeme yolunu değerlendirin, gerekirse zamanaşımını durduran bir ödeme emri (Mahnbescheid) ile.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kirayı geriye dönük indirebilir miyim?",
        answer:
          "Yalnızca sınırlı olarak. İhtirazi kayıtla ödediyseniz, ev sahibi kusuru zaten biliyorsa, konut alanı yanlış bildirilmişse veya geçersiz bir sözleşme hükmü sizi indirimden alıkoyduysa mümkündür.",
      },
      {
        question: "Ne kadar geriye dönük kira geri isteyebilirim?",
        answer:
          "Hakkın doğduğu ve bundan haberdar olduğunuz yılın sonundan itibaren işleyen üç yıllık olağan zamanaşımı çerçevesinde. Bundan bağımsız olarak hak en geç on yıl sonra sona erer.",
      },
      {
        question: "Uzun süre bir şey yapmazsam indirim hakkımı kaybeder miyim?",
        answer:
          "Yalnızca istisnaen. Eskiden anılan altı aylık sınır, yürürlükten kalkmış hukuka dayanıyordu; bugün hakkın düşmesi ancak § 242 BGB üzerinden söz konusu olur ve zaman ile durum unsurunu birlikte gerektirir. Yine de kısa sürede harekete geçmelisiniz, hem ispat durumu hem de üç yıllık zamanaşımı nedeniyle.",
      },
      {
        question: "Konut alanı yanlış bildirilmişse farklı bir kural mı geçerli?",
        answer:
          "Evet. Gerçek konut alanı yüzde ondan fazla aşağıya sapıyorsa, BGH içtihadına göre hak kira başlangıcından itibaren doğar; üstelik önceden ayıp bildirimi olmaksızın, çünkü yanlış bildirimden ev sahibinin kendisi sorumludur.",
      },
    ],
  },
  "mietminderung-ausschluss": {
    navLabel: "İndirimin geçerli olmadığı haller",
    title:
      "Kira indiriminin dışlandığı haller: 7 dışlama nedeni",
    metaTitle:
      "Kira indirimi dışlandı: hakka mal olan 7 neden",
    description:
      "Her kusur indirim hakkı vermez: sözleşme kurulurken bilgi sahibi olmaktan önemsiz kusurlara ve enerji tadilatına kadar yedi dışlama nedeni.",
    keywords: [
      "kira indirimi dışlandı",
      "kira indirimi yok",
      "önemsiz kusur kira hukuku",
      "§ 536b BGB",
      "enerji tadilatı kira indirimi",
    ],
    lead:
      "Her kusur indirim hakkı vermez. Kanun bir dizi dışlama nedeni tanır; bunları gözden kaçırıp yine de kesinti yapan, sonunda fesih bulunabilecek bir ödeme borcu biriktirir. Kiraya dokunmadan önce bu yedi noktayı gözden geçirin.",
    sections: [
      {
        heading: "1. Sözleşme kurulurken kusurun bilinmesi (§ 536b BGB)",
        paragraphs: [
          "Kira sözleşmesini imzalarken bir kusuru bilen ve buna rağmen taşınan, sonradan bu nedenle indirim yapamaz. Kusuru yalnızca ağır ihmal sonucu bilmediyseniz, yani kusur görme sırasında neredeyse gözden kaçırılamayacak durumdaysa da aynısı geçerlidir.",
          "İstisnası şudur: Daireyi teslim alırken kusur nedeniyle haklarınızı açıkça saklı tuttuysanız indirim hakkı devam eder. Böyle bir kaydı her zaman teslim tutanağına (Übergabeprotokoll) yazdırın.",
        ],
      },
      {
        heading: "2. Ayıp bildiriminin yapılmaması (§ 536c BGB)",
        paragraphs: [
          "Bir kusuru gecikmeksizin bildirmez ve ev sahibi bu yüzden onu gideremezse indirim hakkını kaybedersiniz. Ayrıca ona karşı tazminat sorumluluğunuz doğabilir.",
          "Ev sahibi kusuru başka bir kaynaktan zaten biliyorsa bildirim yükümlülüğü ortadan kalkar. Yine de buna asla güvenmemelisiniz.",
        ],
      },
      {
        heading: "3. Önemsiz kusurlar ve önemsiz zedelenmeler",
        paragraphs: [
          "§ 536 Abs. 1 Satz 3 BGB uyarınca kullanılabilirlikteki yalnızca önemsiz bir azalma dikkate alınmaz. Kastedilen, kolayca fark edilen ve az bir çabayla giderilebilen kusurlardır.",
        ],
        bullets: [
          "Tek bir damlayan musluk",
          "Hafifçe sıkışan bir oda kapısı",
          "Tek bir çatlamış fayans",
          "Yeterince başkası varken bozuk olan bir priz",
        ],
        note:
          "Belirleyici olan kullanımın zedelenmesidir, onarımın fiyatı değil: Ucuza giderilebilen bir kusur önemli, pahalı bir kusur önemsiz olabilir. Birden fazla önemsiz kusur birlikte önemlilik eşiğini aşabilir.",
      },
      {
        heading: "4. Kendi sebep olduğunuz kusurlar",
        paragraphs: [
          "Kusura siz, hane halkınız veya misafirleriniz sebep olduysa indirim hakkı doğmaz. Klasik örnek, yetersiz havalandırma ve ısıtma nedeniyle oluşan küftür.",
          "Sizin konumunuz için ispat yükü belirleyicidir ve o ev sahibindedir. Önce ısı köprüleri veya eksik yalıtım gibi yapısal nedenlerin bulunmadığını dışlaması gerekir. Ancak bunu başarırsa kullanım davranışınız gündeme gelir.",
        ],
      },
      {
        heading: "5. Uzun süre beklemekle hakkın düşmesi",
        paragraphs: [
          "Kusuru bildiğiniz halde uzun süre ihtirazi kayıt koymadan tam kira öderseniz, indirim hakkınız istisnaen düşmüş olabilir. Zaman unsuru ile ev sahibinin korunmaya değer güveni birlikte aranır; „altı ay“ gibi sabit bir ölçüt yoktur.",
        ],
      },
      {
        heading: "6. Enerji verimliliği tadilatı (§ 536 Abs. 1a BGB)",
        paragraphs: [
          "§ 555b Nr. 1 BGB anlamındaki enerji verimliliği tadilatlarında kira indirimi üç ay boyunca dışlanır. Koşul, ev sahibinin çalışmayı usulüne uygun ve zamanında duyurmuş olmasıdır.",
          "Üç ay dolduktan sonra indirim yapabilirsiniz. Ayrıca dışlama yalnızca enerjiye ilişkin çalışmalar için geçerlidir; genel modernizasyonlar veya salt onarımlar bunun kapsamına girmez.",
        ],
      },
      {
        heading: "7. Toplumsal olarak olağan ve yöreye özgü zedelenmeler",
        bullets: [
          "Çok daireli bir binada olağan konut gürültüsü, oynayan çocuklar dahil",
          "Kiralama sırasında zaten var olan şehir merkezi konumundaki sokak gürültüsü",
          "Komşu dairelerden gelen alışılmış mutfak kokuları",
          "Dairenin sözleşmeye aykırı kendi kullanımınızdan doğan zedelenmeler",
        ],
        paragraphs: [
          "Ölçü her zaman sözleşmenin kurulduğu andaki durumdur. Sonradan kötüleşen bir kusur olabilir. Başından beri böyle olan ise sizin de birlikte kiraladığınız şeydir.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "Ev sahibi kira sözleşmesinde kira indirimini dışlayabilir mi?",
        answer:
          "Konut kirasında hayır. § 536 Abs. 4 BGB uyarınca indirim hakkı sözleşmeyle kaldırılamaz; kira sözleşmesindeki bu yöndeki hükümler geçersizdir. Ticari kirada başka kurallar geçerlidir.",
      },
      {
        question: "Önemsiz kusur nedir?",
        answer:
          "Dairenin kullanılabilirliğini yalnızca önemsiz ölçüde azaltan ve az bir çabayla giderilebilen kusur, örneğin tek bir damlayan musluk. § 536 Abs. 1 Satz 3 BGB uyarınca indirim hakkı vermez.",
      },
      {
        question: "Enerji tadilatında kirayı indirebilir miyim?",
        answer:
          "Ancak üç aydan sonra. § 536 Abs. 1a BGB, usulüne uygun duyurulmuş enerji verimliliği tadilatlarında indirimi bu süre boyunca dışlar. Sonrasında indirim mümkündür.",
      },
      {
        question: "Küfe benim sebep olduğumu kim ispatlamak zorunda?",
        answer:
          "Ev sahibi. Önce ısı köprüleri veya su girişi gibi yapısal nedenlerin bulunmadığını ileri sürüp ispatlaması gerekir. Ancak bunu başarırsa havalandırma ve ısıtma davranışınız değerlendirmeye girer.",
      },
    ],
  },
  "mietminderung-fehler": {
    navLabel: "Sık yapılan hatalardan kaçınma",
    title: "Kira indiriminde en sık yapılan 10 hata",
    metaTitle:
      "Kira indirimi: 10 sık hata ve bunlardan nasıl kaçınılır",
    description:
      "Fazla yüksek orandan eksik belgelemeye: kiracılara düzenli olarak haklarına mal olan on hata ve bunlardan nasıl kaçınacağınız.",
    keywords: [
      "kira indiriminde hata",
      "kira indirimini yanlış yapmak",
      "kira indirimi fesih riski",
      "kira indirimi ipuçları",
    ],
    lead:
      "Bir kira indirimi başarısız olduğunda bunun nedeni nadiren kusurun kendisidir. Neredeyse her zaman izlenen yoldur: bildirim yapılmaması, yanlış hesap temeli, fazla atak kesinti. İlk havaleye dokunmadan önce bu on hatayı bilmelisiniz.",
    sections: [
      {
        heading: "Hata 1: Kusuru bildirmeden kirayı kesmek",
        paragraphs: [
          "Açık ara en sık yapılan ve en pahalı hata. Ayıp bildirimi olmadan uygulanabilir bir hak doğmaz, alıkonan kira o zaman bir ödeme borcundan başka bir şey değildir. Önce yazılı bildirim, sonra indirim konuşulur.",
        ],
      },
      {
        heading: "Hata 2: Fazla yüksek indirim yapmak",
        paragraphs: [
          "Arka arkaya iki ödeme tarihinde bir aylık kiradan fazla borç birikmesi bile derhal feshi tetikleyebilir (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a ile § 569 Abs. 3 Nr. 1 BGB birlikte). Ayrıca tablo değerleri tekil olaylardan çıkan aralıklardır, garanti değil. Alt sınırda kalın veya doğrudan ihtirazi kayıtla ödeyin.",
        ],
      },
      {
        heading: "Hata 3: Sıcak kira yerine soğuk kiradan hesaplamak",
        paragraphs: [
          "Hesaplama temeli, bütün avansları içeren brüt sıcak kiradır. Net soğuk kiradan yola çıkan, hak ettiğinden belirgin biçimde az indirim yapar.",
        ],
      },
      {
        heading: "Hata 4: Kusuru belgelememek",
        paragraphs: [
          "Fotoğraf, tutanak ve tanık olmadan davada beyan beyana karşı kalır ve kusurun ispat yükü kiracıdadır. Belgelemeye ilk günden başlayın, uyuşmazlık çıkınca değil.",
        ],
        bullets: [
          "Tarihi görünen fotoğraf ve videolar",
          "Isıtma kusurlarında günde birkaç kez tutulan sıcaklık tutanağı",
          "Tarih, başlangıç ve bitiş saati, tür ve yoğunluk içeren gürültü tutanağı",
          "Hatıra tazeyken olası tanıkların adlarını not etmek",
        ],
      },
      {
        heading: "Hata 5: Yalnızca e-postayla veya sözlü bildirmek",
        paragraphs: [
          "Bir e-posta, ulaştığını ispatlamaz. Einwurf-Einschreiben veya tanıklı bir kuryeye güvenin. E-postayı ek olarak gönderebilirsiniz, böylece ev sahibi durumu hızla öğrenir.",
        ],
      },
      {
        heading: "Hata 6: Giderme için süre vermemek",
        paragraphs: [
          "Somut tarihli bir süre olmadan hiçbir bağlı hakkı harekete geçirmezsiniz; ne tazminatı ne de § 536a Abs. 2 BGB uyarınca kusurun kendiniz giderilmesini. Yani: yazıya bir tarih, belirsiz bir zaman aralığı değil.",
        ],
      },
      {
        heading: "Hata 7: Ev sahibine girişi engellemek",
        paragraphs: [
          "Ev sahibi kusura bakabilmeli ve onu giderebilmelidir. Usulüne uygun duyuruya rağmen kapıyı açmayan, indirim hakkını riske atar ve gecikmeden sonunda kendisi sorumlu olur.",
        ],
      },
      {
        heading: "Hata 8: Kusur giderildikten sonra indirime devam etmek",
        paragraphs: [
          "Kusur giderildiği anda yeniden tam kira borçlanılır. Kesmeye devam eden borç biriktirir. Giderme gününü yazılı olarak saptayın ve indirimi o günden itibaren durdurun.",
        ],
      },
      {
        heading: "Hata 9: Fazla uzun beklemek",
        paragraphs: [
          "Ne kadar beklerseniz ispat o kadar zorlaşır ve istisnai durumlarda § 242 BGB uyarınca hakkın düşmesi tehlikesi doğar. Bu yüzden beklemeyin: Ayıp bildirimi, kusurun fark edilmesinden sonraki birkaç gün içinde gitmelidir.",
        ],
      },
      {
        heading: "Hata 10: Kusuru kendiniz giderip sonra kesinti yapmak",
        paragraphs: [
          "Kusurun kendiniz giderilmesi (Selbstvornahme) yalnızca dar koşullarda mümkündür: Ev sahibi temerrütte olmalı veya giderme, kiralananın korunması için ivedi biçimde gerekli olmalıdır (§ 536a Abs. 2 BGB). Aceleyle kendi onaran, masrafı üstlenmek zorunda kalır.",
        ],
        note:
          "Sıralama önemlidir: önce süre vermek, sürenin sonuçsuz geçtiğini belgelemek ve ev sahibi hâlâ hareketsiz kalıyorsa ancak o zaman bir ustaya iş vermek.",
      },
    ],
    faqs: [
      {
        question: "Kira indiriminde en sık yapılan hata nedir?",
        answer:
          "Kusuru önceden yazılı olarak bildirmeden kirayı kesmek. Ayıp bildirimi olmadan kural olarak uygulanabilir bir hak doğmaz ve kesinti bir ödeme borcu sayılır.",
      },
      {
        question: "Kira indirimi yüzünden bana fesih gelebilir mi?",
        answer:
          "Evet, üstelik çoğu kez sanılandan daha erken: Arka arkaya iki ödeme tarihinde bir aylık kiradan fazla borç, derhal fesih için yeterlidir (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a ile § 569 Abs. 3 Nr. 1 BGB birlikte). Sonradan yapılan tam ödeme yalnızca derhal feshi giderir, yedek olarak bildirilen olağan feshi değil (§ 569 Abs. 3 Nr. 2 BGB). İhtirazi kayıtla ödeyen bu riski baştan ortadan kaldırır.",
      },
      {
        question: "Bir kusuru kendim gidertebilir miyim?",
        answer:
          "Yalnızca ev sahibi gidermede temerrütteyse veya derhal giderme kiralananın korunması için gerekliyse (§ 536a Abs. 2 BGB). Öncesinde her zaman bir süre verin ve sürenin sonuçsuz geçtiğini belgeleyin.",
      },
      {
        question: "Ev sahibini daireye almak zorunda mıyım?",
        answer:
          "Evet. Uygun bir duyurudan sonra incelemeye ve kusurun giderilmesine olanak tanımanız gerekir. Reddetmeniz indirim hakkınıza mal olabilir.",
      },
    ],
  },
  "maengelanzeige-zustellen": {
    navLabel: "Ayıp bildirimini tebliğ etme",
    title:
      "Ayıp bildirimini tebliğ etme: e-posta, mektup mu taahhütlü mü?",
    metaTitle:
      "Ayıp bildirimini tebliğ etme: ulaşma ispatı olarak gerçekte ne sayılır",
    description:
      "Ayıp bildirimini ispatlanabilir biçimde nasıl tebliğ edersiniz: Ulaşmanın indirim üzerinde neden belirleyici olduğu, e-posta, Einwurf-Einschreiben ve kuryenin ne işe yaradığı ve mahkemede hangi yolun geçerli olduğu.",
    keywords: [
      "ayıp bildirimini tebliğ etme",
      "ayıp bildirimi taahhütlü",
      "ayıp bildiriminde ulaşma ispatı",
      "Einwurf-Einschreiben ispat",
      "e-posta ile ayıp bildirimi",
    ],
    lead:
      "Kira indirimi pratikte ancak ev sahibinizin kusurdan haberdar olduğu günden itibaren işler. Bu yüzden belirleyici olan ayıp bildirimini ne zaman yazdığınız değil, ona ne zaman ulaştığı — ve bunu ispatlayıp ispatlayamadığınızdır. Olayların çoğu tam burada başarısız olur.",
    sections: [
      {
        heading: "Ulaşma neden paranız hakkında karar verir",
        paragraphs: [
          "İndirim, § 536 BGB uyarınca önemli bir kusur bulunduğu anda kanun gereği doğar. Ancak kural olarak onu ev sahibinin bilgi sahibi olmasından itibaren uygulayabilirsiniz ve bu bilgiyi ona ayıp bildirimiyle sağlarsınız. Bildirimin ulaştığı an, böylece hesabın başladığı gündür.",
          "Ayıp bildirimi, varması gereken bir irade beyanıdır. § 130 Abs. 1 BGB uyarınca ancak muhataba ulaştığında — yani olağan koşullarda bilgi edinebileceği şekilde hâkimiyet alanına girdiğinde — hüküm doğurur. Mektupta bu, olağan boşaltma saatinde posta kutusuna atılmasıdır.",
          "Ve ispat yükü sizdedir. Ev sahibi bir şey aldığını inkâr ederse ulaşmayı belgelemeniz gerekir. Bunu yapamazsanız, öncesindeki bütün dönem için indirim tartışmalı hale gelir — kusur tartışmasız var olmuş olsa bile.",
        ],
        note:
          "Sık rastlanan bir yanlış anlama: Gönderme değil, ulaşma sayılır. Atıldığı ispatlanan bir mektup size her şeyi kazandırır, gönderildiği ispatlanan bir mektup neredeyse hiçbir şey.",
      },
      {
        heading: "Tebligat yollarının karşılaştırması",
        paragraphs: [
          "Aşağıdaki yolların hepsi hukuken caizdir — § 536c BGB bir şekil şartı öngörmez. Aralarındaki tek fark, uyuşmazlık halinde elinizde ne olduğudur.",
        ],
        table: {
          caption:
            "Ayıp bildiriminin tebligat yolları ve ulaşma ispatı olarak değerleri",
          head: ["Yol", "İspat değeri", "Ne zaman mantıklı"],
          rows: [
            [
              "E-posta",
              "Düşük. Gönderim raporu göndermeyi belgeler, alınmayı değil. Okundu bilgisini muhatap engelleyebilir.",
              "Hızlı bir tamamlayıcı olarak, asla tek yol olarak değil",
            ],
            [
              "Adi mektup",
              "İspat yok. Ne atılma ne içerik belgelenmiştir.",
              "İlişki iyiyse ve kimse tartışmıyorsa",
            ],
            [
              "Einwurf-Einschreiben (postaya atmalı taahhütlü)",
              "İyi. Posta kutusuna atılma belgelenir ve izlenebilir.",
              "Pratikteki standart yol",
            ],
            [
              "Übergabe-Einschreiben (imza karşılığı taahhütlü)",
              "Riskli. Ev sahibi gönderiyi almazsa tam da ulaşmamış sayılır.",
              "Daha çok hayır — aşağıya bakın",
            ],
            [
              "Tanıklı kurye",
              "Çok iyi. Kurye hem içeriğe hem atılmaya tanıklık edebilir.",
              "Güvendiğiniz ulaşılabilir biri varsa",
            ],
            [
              "Makbuz karşılığı elden teslim",
              "Ev sahibi imzalarsa çok iyi.",
              "Doğrudan temasta",
            ],
          ],
        },
      },
      {
        heading: "İmza karşılığı taahhütlü neden daha kötü bir seçim",
        paragraphs: [
          "İlk bakışta çelişkili görünür: Tam da en zahmetli gönderim türü, ayıp bildirimi için en güvensiz olanıdır. Nedeni, imza karşılığı taahhütlünün nasıl teslim edildiğinde yatar.",
          "Dağıtıcı muhatabı bulamazsa yalnızca bir bildirim kâğıdı bırakır. Bu kâğıt ulaşmayı sağlamaz — beyanın kendisi değil, yalnızca bir beyanın beklediğine dair bir uyarıdır. Ev sahibi gönderiyi almazsa saklama süresinin sonunda size geri döner ve hukuken hiçbir şey olmamıştır.",
          "Einwurf-Einschreiben'de bu boşluk yoktur. Gönderi normal bir mektup gibi posta kutusuna atılır ve tam da bu atılma belgelenir. Ulaşma böylece gerçekleşir, ev sahibi kutuyu boşaltsa da boşaltmasa da.",
        ],
        note:
          "Tamamen güvende olmak isteyen ikisini birleştirir: Sağlam bir ispat olarak Einwurf-Einschreiben, ayrıca aynı metni içeren bir e-posta, böylece bilgi ev sahibine hızla da ulaşır.",
      },
      {
        heading: "Ulaşmanın dışında neleri belgelemelisiniz",
        bullets: [
          "Yazının bir kopyası, tam olarak gönderdiğiniz haliyle.",
          "Gönderim tarihi ve Einwurf-Einschreiben'de gönderi numarası ile teslim belgesi.",
          "Kusurun tarihi görünen fotoğraf veya videoları, en iyisi bütün dönem boyunca aralıksız.",
          "Basit bir kusur tutanağı: tarih, saat, gözlem. Gürültü veya ısıtma arızasında bu, en önemli belgedir.",
          "Durumu doğrulayabilecek olası tanıkların adları, örneğin ev arkadaşları veya komşular.",
        ],
      },
      {
        heading: "Ayıp bildirimi kime gitmelidir",
        paragraphs: [
          "Muhatap ev sahibidir, yani kira sözleşmesindeki sözleşme tarafınız — kendiliğinden malik değil ve kapıcı hiç değil. Bir bina yönetimi (Hausverwaltung) devredeyse ve kira sözleşmesinde temsilci olarak anılıyorsa ona tebliğ edebilirsiniz; tereddütte yazıyı ikisine birden gönderin.",
          "Kiraya veren tarafta birden fazla kişi varsa — örneğin bir miras ortaklığı — beyanın hepsine ulaşması gerekir. Kira sözleşmesinde tebligata yetkili bir kişi yazılıysa bu tek adres yeterlidir.",
          "Sözleşmede kendiniz birden fazla kiracıysanız, ayıp bildirimini hepsinin imzalaması veya en azından ona anlaşılır biçimde onay vermesi gerekir. Bu, birinin tek başına hepsi adına hareket edip edemeyeceği tartışmasını önler.",
        ],
      },
    ],
    faqs: [
      {
        question: "E-posta ile ayıp bildirimi yeterli mi?",
        answer:
          "Hukuken evet, çünkü § 536c BGB bir şekil şartı öngörmez. Ancak pratikte e-posta zayıftır: Gönderim raporu yalnızca gönderdiğinizi ispatlar, ulaştığını değil. Ev sahibi almayı inkâr ederse elinizde bir belge kalmaz. E-postayı hızlı bir tamamlayıcı olarak kullanın, tek yol olarak değil.",
      },
      {
        question: "Einwurf-Einschreiben imzalı taahhütlü mü?",
        answer:
          "Hayır. Einwurf-Einschreiben'de gönderinin posta kutusuna atıldığı belgelenir. Muhatap imzalamaz. Ayıp bildirimi için avantajı budur: Ulaşma atılmayla gerçekleşir ve ev sahibinin bir şey alıp almamasına bağlı değildir.",
      },
      {
        question: "Bir mektup ne zaman ulaşmış sayılır?",
        answer:
          "Muhatabın hâkimiyet alanına, olağan koşullarda bilgi edinilmesi beklenecek şekilde girdiğinde. Posta kutusuna atılmada bu, olağan boşaltma anıdır — öğleden sonra geç saatte atılan bir mektupta yani düzenli olarak ancak ertesi gün.",
      },
      {
        question: "Ev sahibi almadığını söylerse ne yapmalı?",
        answer:
          "O zaman ispatınıza ihtiyacınız olur: Einwurf-Einschreiben'in teslim belgesi, kuryenin beyanı veya teslim makbuzu. İkisi de yoksa, geriye ayıp bildirimini derhal ispatlanabilir biçimde tekrarlamak kalır. Gelecek için indirim böylece güvenceye alınır, geçmiş için çoğunlukla alınmaz.",
      },
      {
        question: "Ayıp bildirimini imzalamak zorunda mıyım?",
        answer:
          "Kanun yazılı şekil aramadığı için el yazısı imza zorunlu değildir. Ancak asla zarar vermez ve yazıyı açıkça size bağlar.",
      },
      {
        question: "Ayıp bildirimini gönderttirebilir miyim?",
        answer:
          "Evet. Ayıp bildirimini burada ücretsiz oluşturabilir, ardından bizim yazdırıp posta ile ev sahibinize göndermemizi sağlayabilirsiniz — dilerseniz mektup olarak, dilerseniz atılması belgelenen Einwurf-Einschreiben olarak. Ücretsiz indirme her durumda sizde kalır.",
      },
    ],
  },
  "vermieter-reagiert-nicht": {
    navLabel: "Ev sahibi cevap vermiyor",
    title:
      "Ev sahibi ayıp bildirimine cevap vermiyor: şimdi ne yapabilirsiniz",
    metaTitle:
      "Ev sahibi ayıp bildirimine cevap vermiyor: 6 adım",
    description:
      "Süre doldu ve hiçbir şey olmadı mı? Ev sahibi ayıp bildirimini görmezden geldiğinde kiracıların yapabilecekleri: indirim, alıkoyma, kusuru kendi giderme ve dava.",
    keywords: [
      "ev sahibi cevap vermiyor",
      "ev sahibi ayıp bildirimini görmezden geliyor",
      "ev sahibi kusuru gidermiyor",
      "ayıp bildiriminde süre doldu",
      "kusurun giderilmesini sağlamak",
    ],
    lead:
      "Kusuru bildirdiniz, süre verdiniz — ve hiçbir şey olmuyor. Bu en sık görülen seyirdir ve vazgeçmek için bir sebep değildir. Kanun tam bu durum için elinize birkaç araç verir. Bunların keskinliği farklıdır ve sıralama önemlidir.",
    sections: [
      {
        heading: "Önce kontrol edin: Ayıp bildirimi gerçekten ulaştı mı?",
        paragraphs: [
          "Tırmandırmadan önce en sıradan olasılığı açıklığa kavuşturun: Ev sahibi yazıyı hiç görmemiş olabilir. Ulaşma olmadan hiçbir süre işlemez ve sonraki bütün adımlar kum üzerine kurulur.",
          "Ulaşmayı belgeleyemiyorsanız ayıp bildirimini şimdi ispatlanabilir biçimde tekrarlayın — Einwurf-Einschreiben ile veya atılmaya tanıklık edebilecek bir kurye aracılığıyla. İçine yeni ve somut tarihli bir süre koyun. Bu birkaç güne mal olur ve kaybedilmiş bir davadan belirgin biçimde ucuzdur.",
        ],
        note:
          "Süreyi her zaman tarihle yazın („15 Eylül 2026 tarihine kadar“), zaman aralığıyla değil („iki hafta içinde“). Tarih varsa sürenin ne zaman işlemeye başladığı sonradan tartışma konusu olmaz.",
      },
      {
        heading: "Altı olanağa genel bakış",
        ordered: [
          "Kira indirimi: Kanun gereği doğar ve ilk ile en önemli kaldıraçtır. Bunun için ev sahibinin onayına ihtiyacınız yoktur.",
          "Duyurulu ikinci süre verme: Sonuçları somut biçimde adlandıran ikinci bir yazı, deneyimlere göre birinciden daha çok şey harekete geçirir.",
          "Alıkoyma hakkı: İndirimin ötesinde, baskı kurmak için kiranın bir bölümünü daha geçici olarak alıkoyabilirsiniz.",
          "§ 536a Abs. 2 BGB uyarınca kusuru kendiniz gidertme: Kusuru kendiniz gidertir ve masrafı geri alırsınız.",
          "Kusurun giderilmesi davası: Konu esaslıysa ve ev sahibi kalıcı olarak engelliyorsa izlenecek yol.",
          "§ 543 BGB uyarınca derhal fesih: Yalnızca ağır kusurlarda ve son çare olarak.",
        ],
      },
      {
        heading: "Kira indirimi: hemen elinizde olan kaldıraç",
        paragraphs: [
          "İndirim, kimseye ihtiyaç duymadığınız tek tepkidir. Önemli bir kusur bulunduğu ve ev sahibi bundan haberdar olduğu anda kendiliğinden doğar. Bir izin gerekmez ve konut kira sözleşmesinde indirim hakkını dışlayan bir hüküm § 536 Abs. 4 BGB uyarınca geçersizdir.",
          "Güvenli yol yine de önce ihtirazi kayıtla ödemek ve fazla ödenen kirayı sonradan geri istemektir. Fazla yüksek indirim yapıp iki aylık kira borcu biriktiren, § 543 Abs. 2 Nr. 3 BGB uyarınca derhal fesih riskine girer — ve bu risk, yanlış tahmin edilen birkaç yüzdeyle hiçbir şekilde orantılı değildir.",
        ],
        note:
          "Tereddütte fazla yerine az indirim yapın. Farkı sonradan talep edebilirsiniz; haklı bir feshi ise geri alamazsınız.",
      },
      {
        heading: "Alıkoyma hakkı: indirimin ötesinde baskı",
        paragraphs: [
          "İndirimin yanında, kusur sürdüğü sürece kiranın bir bölümünü daha alıkoyabilirsiniz. İndirimden farklı olarak bu kesin bir kesinti değildir: Alıkonan tutar, kusur giderilir giderilmez sonradan ödenir. Amacı yalnızca baskı kurmaktır.",
          "Tutar için kanuni bir kural yoktur; uygulamada sıklıkla aylık indirim tutarının üç ila beş katı anılır. Mahkemeler bunu farklı değerlendirir ve sınırlar belirsizdir.",
          "Alıkoymayı açıkça duyurun ve onu bu adla anın. Sessizce daha az gönderen, ev sahibi için borçlu bir kiracı görüntüsü — kendisi için de bir fesih riski üretir.",
        ],
        note:
          "Alıkoyma ile indirim birbirine eklenir. Alıkoyduğunuz tutarı toplu hesaplayın ve iki aylık kira borcu eşiğinin belirgin biçimde altında kalın.",
      },
      {
        heading: "Kusuru kendiniz gidertme",
        paragraphs: [
          "§ 536a Abs. 2 BGB uyarınca kusuru kendiniz gidertip gerekli masrafların karşılanmasını isteyebilirsiniz — ancak yalnızca iki durumda: Ev sahibi gidermede temerrütteyse veya derhal giderme kiralananın korunması ya da yeniden sağlanması için gerekliyse.",
          "Temerrüt, bir süre vermiş olmanızı ve bu sürenin sonuçsuz dolmasını gerektirir. İkisini de eksiksiz belgeleyin: yazıyı, ulaşma belgesini, sürenin bitişini.",
          "İş vermeden önce en az iki fiyat teklifi alın ve en pahalı sağlayıcıyı seçmeyin. Yalnızca gerekli olanı geri alırsınız — bunun ötesi sizin üzerinizde kalır.",
        ],
        note:
          "Kusuru kendiniz gidertme, en büyük mali öz riski taşıyan adımdır. Görülebilir bir tutarı aşan her şeyde önceden danışmanlık almalısınız.",
      },
      {
        heading: "Kusurun giderilmesi davası",
        paragraphs: [
          "Ev sahibi kalıcı olarak hareketsiz kalıyorsa ve konu küçük bir şeyden fazlaysa gidermeyi mahkeme yoluyla sağlayabilirsiniz. Hak § 535 Abs. 1 Satz 2 BGB'den doğar: Ev sahibi daireyi sözleşmeye uygun kullanıma elverişli durumda borçlanır, üstelik kira süresinin tamamı boyunca.",
          "Gecikmede tehlike varsa — örneğin kışın ısıtmasız kalındığında — normal bir yargılamadan belirgin biçimde hızlı olan ihtiyati tedbir gündeme gelir.",
          "Öncesinde hukuki koruma sigortanızı ve varsa bir kiracı derneğine üyeliğinizi kontrol edin. İkisi de kural olarak tam bu olayları üstlenir ve oradaki danışmanlık, dava açmadan önceki en mantıklı adımdır.",
        ],
      },
      {
        heading: "Derhal fesih: yalnızca ciddi durumda",
        paragraphs: [
          "Dairenin sözleşmeye uygun kullanımı size tamamen veya önemli bir bölümüyle sağlanmıyorsa § 543 Abs. 2 Nr. 1 BGB uyarınca derhal fesih yapabilirsiniz. Kural olarak sonuçsuz kalmış bir giderme süresi veya ihtar koşuldur.",
          "Bu en keskin adımdır ve yalnızca ağır kusurlarda gündeme gelir — örneğin yoğun küflenme veya aylarca süren bir ısıtma arızası. Sonradan haksız çıkan bir fesihte zarardan siz sorumlu olursunuz.",
        ],
        note:
          "Derhal fesihten önce her durumda hukuki görüş alın. Buradaki bir hatanın sonuçları, bu sayfadaki başka her adımdan büyüktür.",
      },
      {
        heading: "Nereden destek alırsınız",
        bullets: [
          "Kiracı dernekleri (Mieterverein): Üyelik çoğunlukla yılda düşük iki haneli bir tutara mal olur ve hukuki danışmanlık içerir. Süregelen uyuşmazlıklar için çoğu kez bir bekleme süresi geçerlidir — bu yüzden üye olmak, iş kızışmadan önce değerlidir.",
          "Kira hukuku modülü olan hukuki koruma sigortası: Teminatı kontrol edin ve olayı erken bildirin.",
          "Kira hukuku uzmanı avukat: İlk danışmanlık için ücretler kanunla sınırlandırılmıştır.",
          "Tüketici merkezleri (Verbraucherzentrale): Kira sorularında görülebilir ücretlerle danışmanlık verirler.",
          "Sağlık müdürlüğü (Gesundheitsamt): Küf veya haşerede yerinde inceleme güçlü bir delil sağlayabilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ev sahibine ne kadar süre tanımalıyım?",
        answer:
          "Süre uygun olmalıdır ve neyin uygun olduğu kusura bağlıdır. Kışın ısıtma arızasında birkaç gün uygundur, kapsamlı bir tadilatta birkaç hafta. Olağan durum için ölçü 14 gündür. Süreyi her zaman somut tarihle koyun.",
      },
      {
        question: "Kirayı tamamen alıkoyabilir miyim?",
        answer:
          "Yalnızca dairenin tamamen kullanılamaz olması halinde ve bu nadir bir istisnadır. Diğer bütün durumlarda fesih riski önemlidir: İki aylık kira borcundan itibaren ev sahibi § 543 Abs. 2 Nr. 3 BGB uyarınca derhal fesih yapabilir.",
      },
      {
        question: "İndirim ile alıkoyma arasındaki fark nedir?",
        answer:
          "İndirim, borçlanılan kirayı kesin olarak azaltır — bu parayı ev sahibi hiçbir zaman almaz. Alıkoyma yalnızca geçicidir: Kusur giderilir giderilmez tutarı sonradan ödersiniz. Amacı baskıdır, tasarruf değil. İkisi yan yana ileri sürülebilir.",
      },
      {
        question: "Ayıp bildirimi yüzünden bana fesih gelebilir mi?",
        answer:
          "Yalnızca haklarınızı kullandığınız için yapılan bir fesih, caiz olmayan bir misilleme olurdu. Riskli hale gelmesi, ancak fazla alıkoyup bir ödeme borcu doğurmanızla başlar — o zaman fesih bu borca dayandırılabilir. Bu yüzden: temkinli indirim yapın ve ihtirazi kayıtla ödeyin.",
      },
      {
        question:
          "Ev sahibi sürekli usta gönderiyor ama hiçbir şey değişmiyor. O zaman ne geçerli?",
        answer:
          "Belirleyici olan dairenin durumudur, deneme sayısı değil. Kusur sürdüğü sürece indirim hakkı da sürer. Her randevuyu tarih ve sonuçla belgeleyin — bu kronoloji mahkemede çok güçlü bir anlatım sağlar.",
      },
      {
        question: "Usta randevularına olanak tanımak zorunda mıyım?",
        answer:
          "Evet. Uygun bir duyurudan sonra kusurun giderilmesi için girişe izin vermeniz gerekir. Reddeden, indirim hakkını kaybedebilir, çünkü giderme o zaman kendisi yüzünden gerçekleşmemiş olur.",
      },
    ],
  },
};

export default tr;
