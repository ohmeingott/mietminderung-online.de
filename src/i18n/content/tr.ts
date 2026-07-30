// Turkish translations for the defect catalogue and FAQ content.
// Keys mirror the ids in src/data/maengel.ts:
//   kat.<kategorieId>   m.<mangelId>.l (label)   m.<mangelId>.d (description)
const tr: Record<string, string> = {
  // --- Categories ------------------------------------------------------------
  "kat.heizung": "Isıtma ve Sıcak Su",
  "kat.feuchtigkeit": "Nem ve Küf",
  "kat.laerm": "Gürültü ve Huzur Bozukluğu",
  "kat.ungeziefer": "Haşere ve Zararlılar",
  "kat.fenster_tueren": "Pencere ve Kapılar",
  "kat.bad_sanitaer": "Banyo ve Tesisat",
  "kat.kueche": "Mutfak ve Cihazlar",
  "kat.aufzug": "Asansör",
  "kat.elektrik": "Elektrik ve Teknik",
  "kat.wohnflaeche": "Konut Alanı ve Oda Kalitesi",
  "kat.balkon_aussen": "Balkon, Teras ve Dış Alanlar",
  "kat.gesundheit": "Sağlık Tehlikeleri",
  "kat.gerueche": "Koku Rahatsızlığı",

  // --- Heating & hot water ---------------------------------------------------
  "m.heizung_total.l": "Isıtma tamamen çalışmıyor",
  "m.heizung_total.d":
    "Isıtma sistemi tamamen devre dışı, ısıtma döneminde (Ekim–Nisan) oda sıcaklığı 18 °C'nin altında.",
  "m.heizung_teilweise.l": "Isıtma bazı odalarda çalışmıyor",
  "m.heizung_teilweise.d":
    "Bir veya birden fazla odada ısıtma çalışmıyor, diğer odalar ısınıyor.",
  "m.heizung_unzureichend.l": "Isıtma yeterince ısıtmıyor",
  "m.heizung_unzureichend.d":
    "Isıtma çalışmasına rağmen oda sıcaklığı 20 °C'nin altında kalıyor.",
  "m.warmwasser_total.l": "Sıcak su tamamen yok",
  "m.warmwasser_total.d": "Dairenin tamamında sıcak su bulunmuyor.",
  "m.warmwasser_vorlauf.l": "Sıcak su ancak uzun beklemeden sonra geliyor",
  "m.warmwasser_vorlauf.d": "Sıcak su ancak 5 dakikadan uzun bir beklemeden sonra geliyor.",
  "m.heizung_geraeusche.l": "Isıtma sistemi ses yapıyor",
  "m.heizung_geraeusche.d":
    "Isıtma borularında vurma, gurultu veya başka rahatsız edici sesler.",

  // --- Damp & mould ----------------------------------------------------------
  "m.schimmel_leicht.l": "Bir odada küf (hafif)",
  "m.schimmel_leicht.d": "Bir odada küçük bir yüzeyde yüzeysel küflenme.",
  "m.schimmel_stark.l": "Birden fazla odada küf (yoğun)",
  "m.schimmel_stark.d": "Dairenin birden fazla odasında geniş alanlı küflenme.",
  "m.feuchtigkeit_wand.l": "Nemli duvarlar / rutubet",
  "m.feuchtigkeit_wand.d":
    "Yaşam alanlarında nemli duvarlar, ıslak lekeler veya rutubet.",
  "m.wasserschaden.l": "Su hasarı / su sızıntısı",
  "m.wasserschaden.d":
    "Örneğin akan çatı veya boru patlaması nedeniyle daireye su giriyor.",
  "m.trocknungsgeraete.l": "Su hasarı sonrası kurutma cihazları",
  "m.trocknungsgeraete.d":
    "Dairede gürültülü kurutma cihazları duruyor ve kullanımı kısıtlıyor.",
  "m.feuchter_keller.l": "Nemli bodrum",
  "m.feuchter_keller.d":
    "Bodrum nemli veya ıslak (bodrum kira sözleşmesine dâhilse).",

  // --- Noise -----------------------------------------------------------------
  "m.baulaerm_haus.l": "Binada / komşu binada inşaat gürültüsü",
  "m.baulaerm_haus.d":
    "Binada veya bina çevresindeki inşaat çalışmalarından kaynaklanan ciddi gürültü.",
  "m.strassenlaerm.l": "Artan sokak gürültüsü (ör. şantiye)",
  "m.strassenlaerm.d":
    "Örneğin bir şantiye nedeniyle olağan seviyenin üzerinde sokak gürültüsü.",
  "m.nachbarlaerm.l": "Sürekli komşu gürültüsü",
  "m.nachbarlaerm.d":
    "Komşulardan gelen, normal ölçüyü aşan düzenli ve huzur bozucu sesler.",
  "m.gastronomie.l": "Binadaki restoran/bar kaynaklı gürültü",
  "m.gastronomie.d":
    "Binadaki bar, restoran veya diskotekten kaynaklanan gürültü.",
  "m.aufzug_laerm.l": "Asansör gürültüsü",
  "m.aufzug_laerm.d":
    "Asansörden kaynaklanan sürekli takırtı, uğultu veya titreşim.",

  // --- Pests -----------------------------------------------------------------
  "m.kakerlaken.l": "Hamam böceği",
  "m.kakerlaken.d": "Dairede hamam böceği istilası.",
  "m.ratten.l": "Dairede / binada fare (sıçan)",
  "m.ratten.d": "Dairede veya binada gerçek sıçan istilası.",
  "m.maeuse.l": "Fare istilası",
  "m.maeuse.d": "Dairede fare istilası.",
  "m.bettwanzen.l": "Tahta kurusu",
  "m.bettwanzen.d": "Dairede tahta kurusu istilası.",
  "m.silberfische.l": "Gümüşçün böceği (yoğun istila)",
  "m.silberfische.d":
    "Yoğun gümüşçün istilası, çoğu zaman nem sorununun işaretidir.",
  "m.wespen.l": "Eşek arısı / arı yuvası",
  "m.wespen.d": "Binada kullanımı kısıtlayan eşek arısı veya arı yuvası.",

  // --- Windows & doors -------------------------------------------------------
  "m.fenster_undicht.l": "Sızdıran pencereler (cereyan)",
  "m.fenster_undicht.d": "Pencereler sızdırıyor, daireye cereyan giriyor.",
  "m.fenster_oeffnen.l": "Pencereler açılmıyor",
  "m.fenster_oeffnen.d": "Pencereler açılamıyor, havalandırma mümkün değil.",
  "m.fenster_schliessen.l": "Pencereler kapanmıyor",
  "m.fenster_schliessen.d":
    "Pencereler kapatılamıyor: güvenlik riski ve ısı kaybı.",
  "m.tuer_abschliessbar.l": "Daire kapısı kilitlenmiyor",
  "m.tuer_abschliessbar.d": "Daire kapısı kilitlenemiyor: güvenlik eksikliği.",
  "m.klingel_defekt.l": "Kapı zili / diyafon arızalı",
  "m.klingel_defekt.d": "Kapı zili veya diyafon çalışmıyor.",

  // --- Bathroom --------------------------------------------------------------
  "m.toilette_defekt.l": "Tuvalet kullanılamıyor",
  "m.toilette_defekt.d": "Tek tuvalet arızalı ve kullanılamıyor.",
  "m.dusche_defekt.l": "Duş arızalı",
  "m.dusche_defekt.d": "Duş çalışmıyor veya kullanılamıyor.",
  "m.wasserdruck_niedrig.l": "Su basıncı çok düşük",
  "m.wasserdruck_niedrig.d": "Banyoda veya mutfakta su basıncı çok düşük.",
  "m.bad_belueftung.l": "Banyo havalandırılamıyor",
  "m.bad_belueftung.d": "Banyoda çalışan pencere ve aspiratör yok.",
  "m.spuelung_defekt.l": "Rezervuar arızalı",
  "m.spuelung_defekt.d": "Sifon çalışmıyor, kova ile temizlemek gerekiyor.",

  // --- Kitchen ---------------------------------------------------------------
  "m.herd_defekt.l": "Ocak / fırın arızalı",
  "m.herd_defekt.d": "Ev sahibinin sağladığı ocak veya fırın çalışmıyor.",
  "m.kuehlschrank_defekt.l": "Buzdolabı arızalı",
  "m.kuehlschrank_defekt.d": "Ev sahibinin sağladığı buzdolabı çalışmıyor.",
  "m.spuelmaschine_defekt.l": "Bulaşık makinesi arızalı",
  "m.spuelmaschine_defekt.d": "Sözleşmede yer alan bulaşık makinesi çalışmıyor.",
  "m.kueche_komplett.l": "Mutfak tamamen kullanılamıyor",
  "m.kueche_komplett.d":
    "Mutfağın tamamı kullanılamıyor (ör. su hasarından sonra).",

  // --- Lift ------------------------------------------------------------------
  "m.aufzug_defekt.l": "Asansör arızalı",
  "m.aufzug_defekt.d": "Sözleşmede yer alan asansör çalışmıyor.",
  "m.aufzug_hoch.l": "Asansör arızalı (yüksek kat)",
  "m.aufzug_hoch.d":
    "Yüksek katta oturuluyorsa veya yürüme engeli varsa asansörün arızalı olması.",

  // --- Electrics -------------------------------------------------------------
  "m.strom_komplett.l": "Tamamen elektrik kesintisi",
  "m.strom_komplett.d": "Dairenin tamamında elektrik yok.",
  "m.treppenhaus_licht.l": "Merdiven aydınlatması arızalı",
  "m.treppenhaus_licht.d": "Merdiven boşluğundaki aydınlatma çalışmıyor.",
  "m.internet_ausfall.l": "İnternet kesintisi (kiraya dâhilse)",
  "m.internet_ausfall.d":
    "Kira sözleşmesinin parçası olarak kararlaştırılan internet çalışmıyor.",
  "m.kabel_defekt.l": "Kablo bağlantısı / TV arızalı",
  "m.kabel_defekt.d": "Sözleşmede yer alan kablo bağlantısı çalışmıyor.",

  // --- Floor area ------------------------------------------------------------
  "m.wohnflaeche_10.l": "Konut alanı sözleşmedekinden %10'dan fazla küçük",
  "m.wohnflaeche_10.d":
    "Gerçek konut alanı, sözleşmede belirtilenden %10'dan fazla küçük.",
  "m.hitze_dach.l": "Yazın aşırı sıcak (26 °C üzeri)",
  "m.hitze_dach.d": "Daire (ör. çatı katı) 26 °C'nin üzerine ısınıyor.",
  "m.undichtes_dach.l": "Akan çatı / akan tavan",
  "m.undichtes_dach.d": "Çatıdan veya tavandan su sızıyor.",

  // --- Balcony & outdoor -----------------------------------------------------
  "m.balkon_nicht_nutzbar.l": "Balkon kullanılamıyor",
  "m.balkon_nicht_nutzbar.d":
    "Örneğin iskele veya inşaat çalışmaları nedeniyle balkon kullanılamıyor.",
  "m.terrasse_nicht_nutzbar.l": "Teras kullanılamıyor (yaz)",
  "m.terrasse_nicht_nutzbar.d": "Teras yaz aylarında kullanılamıyor.",
  "m.keller_nicht_nutzbar.l": "Bodrum kullanılamıyor",
  "m.keller_nicht_nutzbar.d": "Sözleşmede yer alan bodrum kullanılamıyor.",
  "m.stellplatz_nicht_nutzbar.l": "Otopark yeri / garaj kullanılamıyor",
  "m.stellplatz_nicht_nutzbar.d": "Otopark yeri veya garaj kullanılamıyor.",
  "m.baugeruest.l": "Pencerenin önünde inşaat iskelesi",
  "m.baugeruest.d":
    "İskele ışık girişini kısıtlıyor ve hırsızlık riski oluşturuyor.",

  // --- Health hazards --------------------------------------------------------
  "m.asbest.l": "Dairede asbest",
  "m.asbest.d": "Dairede asbest tespit edildi (ör. kırık levhalar).",
  "m.legionellen.l": "İçme suyunda lejyonella",
  "m.legionellen.d": "Lejyonella sınır değerlerinin aşılması.",
  "m.bleirohre.l": "Kurşun borular (sınır değer aşımı)",
  "m.bleirohre.d":
    "İçme suyu tesisatında sınır değeri aşan kurşun borular.",
  "m.formaldehyd.l": "Formaldehit kirliliği",
  "m.formaldehyd.d": "Dairede yükselmiş formaldehit değerleri.",

  // --- Odours ----------------------------------------------------------------
  "m.abwasser_geruch.l": "Dairede kanalizasyon kokusu",
  "m.abwasser_geruch.d": "Arızalı borulardan kaynaklanan kanalizasyon kokusu.",
  "m.muell_geruch.l": "Çöp kokusu (sürekli)",
  "m.muell_geruch.d":
    "Örneğin yan taraftaki çöp odasından kaynaklanan sürekli çöp kokusu.",
  "m.gewerbe_geruch.l": "Restoran / işletme kaynaklı koku",
  "m.gewerbe_geruch.d":
    "Restoran veya ticari işletmeden kaynaklanan koku rahatsızlığı.",

  // --- FAQ -------------------------------------------------------------------
  "faq.q0": "Kira indirimi (Mietminderung) nedir?",
  "faq.a0":
    "Kira indirimi, dairenizde yaşam kalitesini olumsuz etkileyen kusurlar varsa kiracı olarak daha az kira ödeyebilmeniz anlamına gelir. Bu hak doğrudan Alman Medeni Kanunu'nun § 536 maddesinden doğar; ayrıca bir izin almanız gerekmez. Kusur devam ettiği sürece kira, kanun gereği kendiliğinden azalmış sayılır.",
  "faq.q1": "Ev sahibinin kira indirimini onaylaması gerekir mi?",
  "faq.a1":
    "Hayır! Önemli bir kusur mevcutsa ve bunu ev sahibine bildirdiyseniz kira indirimi kanun gereği kendiliğinden devreye girer. Onaya ihtiyacınız yoktur. Ancak kusuru önceden ev sahibine bildirmeniz gerekir (kusur bildirimi).",
  "faq.q2": "Kira indiriminin tutarını nasıl hesaplarım?",
  "faq.a2":
    "Kira indirimi brüt sıcak kira üzerinden hesaplanır, yani soğuk kira artı tüm yan giderler. Tutar, kusurun türüne ve ağırlığına göre belirlenir. Örnek: 1.000 € brüt sıcak kira ve %20 indirim oranında yalnızca 800 € ödersiniz. Oran, benzer davalardaki mahkeme kararlarından çıkar.",
  "faq.q3": "Kusur bildirimi nedir ve neden gereklidir?",
  "faq.a3":
    "Kusur bildirimi, kusuru tarif ettiğiniz ve giderilmesini talep ettiğiniz, ev sahibinize yazılı olarak yaptığınız bildirimdir. Kanunen zorunludur (§ 536c BGB). Kusur bildirimi olmadan kira indirimi yapamazsınız ve hatta tazminat riski altına girersiniz. Bu bildirimi hukuka uygun şekilde hazırlamanıza yardımcı oluyoruz.",
  "faq.q4": "Kirayı fazla indirirsem ne olur?",
  "faq.a4":
    "Dikkat: Kirayı çok fazla indirir ve iki aylık kira tutarında birikmiş borç oluşursa, ev sahibi sözleşmeyi derhal feshedebilir (§ 543 Abs. 2 Nr. 3 BGB). Tavsiyemiz: Önce kiranın tamamını çekince koyarak ödeyin ve farkı sonradan geri talep edin. Böylece güvende olursunuz.",
  "faq.q5": "Ev sahibi kira indirimini sözleşmede hariç tutabilir mi?",
  "faq.a5":
    "Hayır. Konut kiralarında kira indirimi hakkından sözleşmeyle vazgeçilemez (§ 536 Abs. 4 BGB). Kira sözleşmesinde indirim hakkını ortadan kaldıran maddeler geçersizdir.",
  "faq.q6": "Kirayı ne zamandan itibaren indirebilirim?",
  "faq.a6":
    "Kira indirimi, ev sahibinin kusuru öğrendiği andan itibaren geçerlidir, yani kural olarak kusur bildiriminin ulaştığı tarihten itibaren. Öncesindeki dönem için genellikle indirim yapılamaz; çekince koyarak ödeme yapmış olmanız hâli istisnadır.",
  "faq.q7": "Küf durumunda her zaman indirim yapabilir miyim?",
  "faq.a7":
    "Her zaman değil. Küf sizin davranışınızdan kaynaklanıyorsa (yanlış havalandırma/ısıtma), indirim hakkı ortadan kalkar. Ancak ispat yükü ev sahibindedir: küfe sizin sebep olduğunuzu kanıtlaması gerekir. Çoğu durumda nedeni yapısal kusurlardır.",
  "faq.q8": "Kira indirimi ne kadar süre geçerlidir?",
  "faq.a8":
    "Kira indirimi, kusurun devam ettiği tüm süre boyunca geçerlidir. Kusur giderildiğinde yeniden kiranın tamamını ödemeniz gerekir. Süre bakımından bir üst sınır yoktur.",
  "faq.q9": "„Çekince koyarak ödemek\" ne demektir?",
  "faq.a9":
    "Kirayı „çekince koyarak\" öderseniz, fazla ödediğiniz kirayı geri talep etme hakkınızı saklı tutmuş olursunuz. Havale açıklamasına şunu yazın: „Kusur nedeniyle çekince ile ödeme [açıklama]\". Böylece derhal fesihten korunur ve farkı sonradan geri isteyebilirsiniz.",
  "faq.q10": "Uzun süre hiçbir şey yapmazsam indirim hakkımı kaybeder miyim?",
  "faq.a10":
    "Evet, bu mümkündür. Kusuru bilmenize rağmen yaklaşık 6 ay boyunca çekince koymadan kiranın tamamını öderseniz, indirim hakkı düşmüş sayılabilir. Bu nedenle bir kusuru fark ettiğinizde vakit kaybetmeden harekete geçin.",
  "faq.q11": "Enerji verimliliği modernizasyonunda durum nedir?",
  "faq.a11":
    "Enerji verimliliğine yönelik modernizasyon çalışmalarında (ör. ısı yalıtımı) kira indirimi 3 ay boyunca uygulanamaz (§ 536 Abs. 1a BGB). Bu süreden sonra indirim yapabilirsiniz. Bu kural yalnızca enerji verimliliği çalışmaları için geçerlidir, genel modernizasyonlar için değil.",
};

export default tr;
