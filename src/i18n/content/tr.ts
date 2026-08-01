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
  "m.baulaerm_haus.l": "Kendi binanızdaki inşaat gürültüsü",
  "m.baulaerm_haus.d": "Kendi binanızdaki veya binanızda yapılan çalışmalardan kaynaklanan ciddi gürültü, örneğin çatı katı yapımı veya tadilat. Enerji verimliliği tadilatlarında indirim üç ay boyunca hariç tutulur (BGB § 536 f. 1a).",
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
  "m.ratten.l": "Dairenin içinde fare (sıçan)",
  "m.ratten.d": "Sıçanlar yaşam alanlarına giriyor veya odalar ilaçlama nedeniyle kapatılmış durumda.",
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
  "m.toilette_defekt.l": "Tek tuvalet kullanılamıyor",
  "m.toilette_defekt.d": "Dairenin tek tuvaleti bozuk ve uzun süredir kullanılamıyor.",
  "m.dusche_defekt.l": "Duş bozuk (küvet mevcut)",
  "m.dusche_defekt.d": "Duş çalışmıyor, ancak küvet gibi başka bir yıkanma imkânı var.",
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
  "m.wohnflaeche_10.l": "Konut alanı sözleşmedekinden küçük",
  "m.wohnflaeche_10.d": "Gerçek konut alanı, kararlaştırılan alanın altında. Sapma %10'u aştığında kira tam olarak bu oranda azalır; %10 ve altında kusur yoktur.",
  "m.hitze_dach.l": "Yaz aşırı ısınması (ısı yalıtımı kusuru)",
  "m.hitze_dach.d": "Daire yazın aşırı ısınıyor. Bu ancak binanın yapıldığı dönemde geçerli yaz ısı koruması standardına uymaması hâlinde kusurdur. Çatı katı ve eski binalarda daha yüksek sıcaklıklara katlanmak gerekir.",
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
  "m.asbest.l": "Asbest hasarlı / lif salınımı",
  "m.asbest.d": "Asbest içeren yapı elemanları hasarlı veya lif salınımı riski var, örneğin kırık levhalar ya da asbestli gece depolamalı sobalar. Havadaki sınır değerlerin aşıldığının kanıtlanması gerekmez.",
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
  "faq.a1": "Hayır! Kira indirimi, önemli bir kusur ortaya çıktığı anda kendiliğinden (kanun gereği) devreye girer. Ne onaya ne de beyana ihtiyacınız var. Kusur bildirimi indirimin doğması için şart değildir; ancak onu uygulamanız ve ispatlamanız için gereklidir.",
  "faq.q2": "Kira indiriminin tutarını nasıl hesaplarım?",
  "faq.a2":
    "Kira indirimi brüt sıcak kira üzerinden hesaplanır, yani soğuk kira artı tüm yan giderler. Tutar, kusurun türüne ve ağırlığına göre belirlenir. Örnek: 1.000 € brüt sıcak kira ve %20 indirim oranında yalnızca 800 € ödersiniz. Oran, benzer davalardaki mahkeme kararlarından çıkar.",
  "faq.q3": "Kusur bildirimi nedir ve neden gereklidir?",
  "faq.a3": "Kusur bildirimi, ev sahibinize kusuru anlattığınız ve giderilmesini talep ettiğiniz yazılı bildirimdir. BGB § 536c f. 1 sizi kusurları gecikmeksizin bildirmeye zorunlu kılar. Bildirmezseniz, indirim hakkınızı yalnızca ev sahibinin tam da bu eksik bildirim yüzünden gideremediği ölçüde kaybedersiniz. Kusuru zaten biliyorsa bildirim yükümlülüğü ortadan kalkar. Bildirimi hukuken sağlam biçimde hazırlamanıza yardımcı oluyoruz.",
  "faq.q4": "Kirayı fazla indirirsem ne olur?",
  "faq.a4": "Dikkat: Risk çoğu kişinin sandığından daha erken başlar. Ev sahibi, üst üste iki ödeme tarihinde kiranın önemsiz sayılmayacak bir kısmını ödemediğinizde derhal fesih yapabilir (BGB § 543 f. 2 c. 1 No. 3 bent a). BGB § 569 f. 3 No. 1'e göre 'önemsiz sayılmayacak' zaten bir aylık kiradan fazlası demektir. İki aylık kira eşiği ancak daha uzun bir dönem için geçerlidir. Tavsiyemiz: Önce kirayı çekince koyarak tam ödeyin ve farkı sonra geri isteyin.",
  "faq.q5": "Ev sahibi kira indirimini sözleşmede hariç tutabilir mi?",
  "faq.a5":
    "Hayır. Konut kiralarında kira indirimi hakkından sözleşmeyle vazgeçilemez (§ 536 Abs. 4 BGB). Kira sözleşmesinde indirim hakkını ortadan kaldıran maddeler geçersizdir.",
  "faq.q6": "Kirayı ne zamandan itibaren indirebilirim?",
  "faq.a6": "İndirim, kusurun ortaya çıkmasıyla başlar, bildirimle değil. Bu arada kirayı tam ödediyseniz, fazla ödediğiniz kısmı BGB § 812 uyarınca geri isteyebilirsiniz. Bu yalnızca tam ödemekle yükümlü olmadığınızı kesin olarak biliyorsanız engellenir (BGB § 814). İndirimin ev sahibinin onayına bağlı olduğunu sanan kişide bu bilgi yoktur.",
  "faq.q7": "Küf durumunda her zaman indirim yapabilir miyim?",
  "faq.a7": "Mutlaka değil. Küf sizin davranışınızdan (yanlış havalandırma/ısıtma) kaynaklanıyorsa indirim hakkı düşer. İspat yükü önce ev sahibindedir: Yapısal nedenleri dışlaması gerekir. Ancak küf ısı köprülerinden kaynaklanıyor ve bina yapıldığı dönemin kurallarına uygunsa kusur yoktur.",
  "faq.q8": "Kira indirimi ne kadar süre geçerlidir?",
  "faq.a8":
    "Kira indirimi, kusurun devam ettiği tüm süre boyunca geçerlidir. Kusur giderildiğinde yeniden kiranın tamamını ödemeniz gerekir. Süre bakımından bir üst sınır yoktur.",
  "faq.q9": "„Çekince koyarak ödemek\" ne demektir?",
  "faq.a9": "Kirayı 'çekince ile' öderseniz, fazla ödenen kirayı geri isteme hakkınızı saklı tutarsınız. Açıklama kısmına şunu yazın: 'Kusur nedeniyle çekinceli ödeme [açıklama]'. Bu sizi derhal fesihten korur ve farkı sonra geri almanızı sağlar. Federal Adalet Divanı da kiracılara bu yolu göstermektedir.",
  "faq.q10": "Uzun süre hiçbir şey yapmazsam indirim hakkımı kaybeder miyim?",
  "faq.a10": "Yaklaşık altı ay çekincesiz ödeme sonrası indirim hakkının düştüğüne dair yaygın görüş, 2001'de yürürlükten kalkan eski BGB § 539'a dayanıyordu ve bu biçimiyle artık geçerli değil. BGB § 242 uyarınca hak düşümü ancak istisnai hâllerde söz konusudur ve hem zaman hem de davranış unsurunu birlikte gerektirir. Yine de delil durumu ve üç yıllık zamanaşımı nedeniyle hızlı hareket etmelisiniz.",
  "faq.q11": "Enerji verimliliği modernizasyonunda durum nedir?",
  "faq.a11":
    "Enerji verimliliğine yönelik modernizasyon çalışmalarında (ör. ısı yalıtımı) kira indirimi 3 ay boyunca uygulanamaz (§ 536 Abs. 1a BGB). Bu süreden sonra indirim yapabilirsiniz. Bu kural yalnızca enerji verimliliği çalışmaları için geçerlidir, genel modernizasyonlar için değil.",
  "m.baulaerm_nachbar.l": "Komşu parselden gelen inşaat gürültüsü",
  "m.baulaerm_nachbar.d": "Başkasına ait bir arsadaki şantiyeden gelen gürültü, Federal Adalet Divanı'na göre kural olarak kusur DEĞİLDİR. İndirim ancak kira sözleşmesinde aksi kararlaştırılmışsa veya ev sahibinin BGB § 906 uyarınca tazminat talebi varsa söz konusu olur.",
  "m.ratten_umfeld.l": "Bodrumda, avluda veya bahçede sıçan",
  "m.ratten_umfeld.d": "Binanın çevresinde, çöp konteynerlerinde, arka avluda, bahçede veya bodrumda sıçanlar var; daireye girmiyorlar.",
  "m.toilette_zweit_wc.l": "Tuvalet bozuk (ikinci tuvalet var)",
  "m.toilette_zweit_wc.d": "Bir tuvalet bozuk, ancak dairede sorunsuz kullanılabilen ikinci bir tuvalet mevcut.",
  "m.dusche_einzige.l": "Tek yıkanma/banyo imkânı devre dışı",
  "m.dusche_einzige.d": "Dairenin tek yıkanma ve banyo imkânı kullanılamıyor.",
  "m.asbest_gebunden.l": "Asbest sıkı bağlı ve hasarsız",
  "m.asbest_gebunden.d": "Sıkı bağlı, hasarsız asbest, örneğin sağlam vinil-asbest karolar. Yalnızca bulunması kural olarak kusur OLUŞTURMAZ; lif salınımına dair haklı bir endişe gerekir.",
  "faq.q12": "Fazla indirim yaptıysam sonradan ödeme beni kurtarır mı?",
  "faq.a12": "Yalnızca yarı yarıya. Tahliye davasının tebliğinden itibaren iki ay içinde borcu tamamen öderseniz derhal fesih geçersiz hâle gelir (BGB § 569 f. 3 No. 2). Ancak yedek olarak yapılan olağan fesih bundan etkilenmez. Uygulamada ev sahipleri düzenli olarak hem derhal hem de yedek olarak olağan fesih bildirir; bu nedenle tamamını ödeseniz bile daireyi kaybedebilirsiniz.",
};

export default tr;
