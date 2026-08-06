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
};

export default tr;
