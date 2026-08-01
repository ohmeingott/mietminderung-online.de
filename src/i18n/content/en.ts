// English translations for the defect catalogue and FAQ content.
const en: Record<string, string> = {
  // --- Categories ------------------------------------------------------------
  "kat.heizung": "Heating & Hot Water",
  "kat.feuchtigkeit": "Damp & Mould",
  "kat.laerm": "Noise & Disturbance",
  "kat.ungeziefer": "Vermin & Pests",
  "kat.fenster_tueren": "Windows & Doors",
  "kat.bad_sanitaer": "Bathroom & Sanitary Facilities",
  "kat.kueche": "Kitchen & Appliances",
  "kat.aufzug": "Lift",
  "kat.elektrik": "Electrics & Technology",
  "kat.wohnflaeche": "Living Space & Room Quality",
  "kat.balkon_aussen": "Balcony, Terrace & Outdoor Areas",
  "kat.gesundheit": "Health Hazards",
  "kat.gerueche": "Odour Nuisance",

  // --- Heating & hot water ---------------------------------------------------
  "m.heizung_total.l": "Heating failure (complete)",
  "m.heizung_total.d":
    "The entire heating system fails, room temperature below 18 °C during the heating season (October–April).",
  "m.heizung_teilweise.l": "Heating failure (individual rooms)",
  "m.heizung_teilweise.d":
    "The heating fails in one or more rooms while the other rooms are heated.",
  "m.heizung_unzureichend.l": "Heating does not warm sufficiently",
  "m.heizung_unzureichend.d":
    "Room temperature stays below 20 °C although the heating is running.",
  "m.warmwasser_total.l": "Hot water failure (complete)",
  "m.warmwasser_total.d": "No hot water available anywhere in the apartment.",
  "m.warmwasser_vorlauf.l": "Hot water only after a long wait",
  "m.warmwasser_vorlauf.d":
    "Hot water only arrives after running the tap for 5+ minutes.",
  "m.heizung_geraeusche.l": "Heating makes noises",
  "m.heizung_geraeusche.d":
    "Knocking, gurgling or other disturbing noises in the heating pipes.",

  // --- Damp & mould ----------------------------------------------------------
  "m.schimmel_leicht.l": "Mould in one room (minor)",
  "m.schimmel_leicht.d":
    "Superficial mould growth on a small area in one room.",
  "m.schimmel_stark.l": "Mould in several rooms (severe)",
  "m.schimmel_stark.d":
    "Extensive mould growth in several rooms of the apartment.",
  "m.feuchtigkeit_wand.l": "Damp walls / moisture penetration",
  "m.feuchtigkeit_wand.d":
    "Damp walls, wet patches or moisture penetration in living areas.",
  "m.wasserschaden.l": "Water damage / water ingress",
  "m.wasserschaden.d":
    "Water enters the apartment, e.g. through a leaking roof or a burst pipe.",
  "m.trocknungsgeraete.l": "Drying equipment after water damage",
  "m.trocknungsgeraete.d":
    "Noisy drying machines are set up in the apartment and restrict its use.",
  "m.feuchter_keller.l": "Damp cellar",
  "m.feuchter_keller.d":
    "The cellar is damp or wet (if the cellar is part of the rented property).",

  // --- Noise & disturbance ---------------------------------------------------
  "m.baulaerm_haus.l": "Construction noise in your own building",
  "m.baulaerm_haus.d": "Substantial noise from building work in or on your own building, e.g. a loft conversion or refurbishment. During energy-efficiency modernisation the reduction is excluded for three months (Section 536 (1a) BGB).",
  "m.strassenlaerm.l": "Increased street noise (e.g. roadworks)",
  "m.strassenlaerm.d":
    "Street noise beyond the usual level, e.g. due to a construction site.",
  "m.nachbarlaerm.l": "Persistent noise from neighbours",
  "m.nachbarlaerm.d":
    "Regular disturbing noise from neighbours beyond the normal level.",
  "m.gastronomie.l": "Noise from restaurants or bars in the building",
  "m.gastronomie.d":
    "Noise from a pub, restaurant or club in the building.",
  "m.aufzug_laerm.l": "Noise from the lift",
  "m.aufzug_laerm.d":
    "Constant rattling, humming or vibrations from the lift.",

  // --- Vermin & pests --------------------------------------------------------
  "m.kakerlaken.l": "Cockroaches",
  "m.kakerlaken.d": "Cockroach infestation in the apartment.",
  "m.ratten.l": "Rats inside the apartment",
  "m.ratten.d": "Rats get into the living areas, or rooms are sealed off because of pest-control measures.",
  "m.maeuse.l": "Mouse infestation",
  "m.maeuse.d": "Mouse infestation in the apartment.",
  "m.bettwanzen.l": "Bed bugs",
  "m.bettwanzen.d": "Bed bug infestation in the apartment.",
  "m.silberfische.l": "Silverfish (severe infestation)",
  "m.silberfische.d":
    "Severe silverfish infestation, often a sign of moisture problems.",
  "m.wespen.l": "Wasp or bee nest",
  "m.wespen.d":
    "Wasp or bee nest on the building that restricts the use of the apartment.",

  // --- Windows & doors -------------------------------------------------------
  "m.fenster_undicht.l": "Leaky windows (draughts)",
  "m.fenster_undicht.d":
    "The windows are not airtight, causing draughts in the apartment.",
  "m.fenster_oeffnen.l": "Windows cannot be opened",
  "m.fenster_oeffnen.d":
    "The windows cannot be opened, so airing the rooms is impossible.",
  "m.fenster_schliessen.l": "Windows cannot be closed",
  "m.fenster_schliessen.d":
    "The windows cannot be closed — a safety risk and a source of heat loss.",
  "m.tuer_abschliessbar.l": "Apartment door cannot be locked",
  "m.tuer_abschliessbar.d":
    "The apartment door cannot be locked — a security defect.",
  "m.klingel_defekt.l": "Doorbell / intercom broken",
  "m.klingel_defekt.d":
    "The doorbell or intercom does not work.",

  // --- Bathroom & sanitary ---------------------------------------------------
  "m.toilette_defekt.l": "Only toilet unusable",
  "m.toilette_defekt.d": "The apartment's only toilet is broken and unusable for a longer period.",
  "m.dusche_defekt.l": "Shower broken (bathtub available)",
  "m.dusche_defekt.d": "The shower does not work, but another washing facility such as a bathtub is available.",
  "m.wasserdruck_niedrig.l": "Water pressure too low",
  "m.wasserdruck_niedrig.d": "Water pressure too low in the bathroom or kitchen.",
  "m.bad_belueftung.l": "Bathroom cannot be ventilated",
  "m.bad_belueftung.d":
    "The bathroom has no working window and no extractor.",
  "m.spuelung_defekt.l": "Toilet flush broken",
  "m.spuelung_defekt.d":
    "The toilet flush does not work; flushing with a bucket is necessary.",

  // --- Kitchen & appliances --------------------------------------------------
  "m.herd_defekt.l": "Stove / oven broken",
  "m.herd_defekt.d":
    "The stove or oven provided by the landlord does not work.",
  "m.kuehlschrank_defekt.l": "Fridge broken",
  "m.kuehlschrank_defekt.d":
    "The fridge provided by the landlord does not work.",
  "m.spuelmaschine_defekt.l": "Dishwasher broken",
  "m.spuelmaschine_defekt.d":
    "The contractually agreed dishwasher does not work.",
  "m.kueche_komplett.l": "Kitchen completely unusable",
  "m.kueche_komplett.d":
    "The entire kitchen cannot be used (e.g. after water damage).",

  // --- Lift ------------------------------------------------------------------
  "m.aufzug_defekt.l": "Lift out of order",
  "m.aufzug_defekt.d":
    "The contractually agreed lift does not work.",
  "m.aufzug_hoch.l": "Lift out of order — high floor",
  "m.aufzug_hoch.d":
    "Lift out of order for an apartment on a high floor or in case of impaired mobility.",

  // --- Electrics & technology ------------------------------------------------
  "m.strom_komplett.l": "Complete power failure",
  "m.strom_komplett.d": "No electricity in the entire apartment.",
  "m.treppenhaus_licht.l": "Stairwell lighting broken",
  "m.treppenhaus_licht.d": "The lighting in the stairwell does not work.",
  "m.internet_ausfall.l": "Internet outage (if part of the tenancy)",
  "m.internet_ausfall.d":
    "Internet that was agreed as part of the rented property fails.",
  "m.kabel_defekt.l": "Cable connection / TV broken",
  "m.kabel_defekt.d":
    "The contractually agreed cable connection does not work.",

  // --- Living space & room quality -------------------------------------------
  "m.wohnflaeche_10.l": "Living space smaller than agreed",
  "m.wohnflaeche_10.d": "The actual living space falls short of the agreed area. Above a 10% shortfall the rent is reduced by exactly that percentage; up to and including 10% there is no defect.",
  "m.hitze_dach.l": "Summer overheating (thermal protection defect)",
  "m.hitze_dach.d": "The apartment heats up considerably in summer. This is only a defect if the building failed to meet the summer thermal-protection standard applicable when it was built. Higher temperatures must be accepted in loft and older flats.",
  "m.undichtes_dach.l": "Leaking roof / leaking ceiling",
  "m.undichtes_dach.d": "Water enters through the roof or ceiling.",

  // --- Balcony, terrace & outdoor areas --------------------------------------
  "m.balkon_nicht_nutzbar.l": "Balcony unusable",
  "m.balkon_nicht_nutzbar.d":
    "The balcony cannot be used, e.g. because of scaffolding or building work.",
  "m.terrasse_nicht_nutzbar.l": "Terrace unusable (summer)",
  "m.terrasse_nicht_nutzbar.d": "The terrace cannot be used in summer.",
  "m.keller_nicht_nutzbar.l": "Cellar unusable",
  "m.keller_nicht_nutzbar.d":
    "The contractually agreed cellar cannot be used.",
  "m.stellplatz_nicht_nutzbar.l": "Parking space / garage unusable",
  "m.stellplatz_nicht_nutzbar.d": "The parking space or garage cannot be used.",
  "m.baugeruest.l": "Scaffolding in front of the windows",
  "m.baugeruest.d":
    "Scaffolding reduces daylight and poses a burglary risk.",

  // --- Health hazards --------------------------------------------------------
  "m.asbest.l": "Asbestos damaged / fibres released",
  "m.asbest.d": "Asbestos-containing components are damaged or there is a risk of fibres being released, e.g. broken panels or asbestos night-storage heaters. Proof that airborne limits are exceeded is not required.",
  "m.legionellen.l": "Legionella in the drinking water",
  "m.legionellen.d": "Legionella limit values exceeded.",
  "m.bleirohre.l": "Lead pipes (limit values exceeded)",
  "m.bleirohre.d": "Lead pipes in the drinking water system with limit values exceeded.",
  "m.formaldehyd.l": "Formaldehyde contamination",
  "m.formaldehyd.d":
    "Elevated formaldehyde levels in the apartment.",

  // --- Odour nuisance --------------------------------------------------------
  "m.abwasser_geruch.l": "Sewage smell in the apartment",
  "m.abwasser_geruch.d": "Sewage smell caused by defective pipes.",
  "m.muell_geruch.l": "Rubbish smell (constant)",
  "m.muell_geruch.d": "Constant smell of rubbish, e.g. from an adjacent refuse room.",
  "m.gewerbe_geruch.l": "Smells from restaurants / businesses",
  "m.gewerbe_geruch.d": "Odour nuisance from a restaurant or commercial business.",

  // --- FAQ -------------------------------------------------------------------
  "faq.q0": "What is a rent reduction?",
  "faq.a0":
    "A rent reduction (Mietminderung) means that as a tenant you are allowed to pay less rent if your apartment has defects that impair your quality of living. This right follows automatically from Section 536 of the German Civil Code (BGB) — you do not need to apply for approval. The rent is reduced by operation of law for as long as the defect exists.",
  "faq.q1": "Does the landlord have to approve the rent reduction?",
  "faq.a1": "No! The rent reduction takes effect by operation of law (automatically) as soon as a significant defect exists. You need neither consent nor a declaration. The defect notice is not a precondition for the reduction to arise — but it is what allows you to enforce and prove it.",
  "faq.q2": "How do I calculate the amount of the rent reduction?",
  "faq.a2":
    "The rent reduction is calculated from the gross warm rent — that is, the base rent plus all service charges. The amount depends on the type and severity of the defect. Example: with a gross warm rent of €1,000 and a reduction rate of 20%, you only pay €800. The rate is derived from court rulings in comparable cases.",
  "faq.q3": "What is a defect notice and why do I need it?",
  "faq.a3": "The defect notice (Mängelanzeige) is a written notification to your landlord describing the defect and requesting its removal. Section 536c (1) BGB obliges you to report defects without delay. If you fail to do so, you lose the right to reduce only in so far as the landlord could not remedy the defect precisely because of the missing notice. If they knew about it anyway, the duty to notify falls away. We help you draft the notice in a legally sound way.",
  "faq.q4": "What happens if I reduce the rent too much?",
  "faq.a4": "Careful — the risk starts earlier than most people think. The landlord may terminate without notice if you are in arrears with a not insignificant part of the rent on two consecutive dates (Section 543 (2) sentence 1 no. 3 (a) BGB). Under Section 569 (3) no. 1 BGB, 'not insignificant' already means more than one month's rent. Only over a longer period does the two-months threshold apply. Our recommendation: initially pay the full rent under reservation of rights and reclaim the difference later.",
  "faq.q5": "Can the landlord exclude the rent reduction in the contract?",
  "faq.a5":
    "No. For residential tenancies, the right to a rent reduction cannot be waived (Section 536 (4) BGB). Clauses in the tenancy agreement that exclude the right to reduce are invalid.",
  "faq.q6": "From when can I reduce the rent?",
  "faq.a6": "The reduction takes effect when the defect arises, not only when you report it. If you paid the full rent in the meantime, you can reclaim the excess under Section 812 BGB. That only fails if you positively knew you were not obliged to pay in full (Section 814 BGB). Anyone who assumed a reduction required the landlord's consent did not have that knowledge.",
  "faq.q7": "Am I always allowed to reduce the rent in case of mould?",
  "faq.a7": "Not necessarily. If the mould was caused by your own behaviour (incorrect airing or heating), the right to reduce does not apply. The burden of proof lies first with the landlord, who must rule out structural causes. There is, however, no defect where the mould stems from thermal bridges and the building complied with the rules in force when it was built.",
  "faq.q8": "How long does the rent reduction apply?",
  "faq.a8":
    "The rent reduction applies for the entire period during which the defect exists. As soon as the defect has been remedied, you must pay the full rent again. There is no upper time limit.",
  "faq.q9": "What does 'paying under reservation of rights' mean?",
  "faq.a9": "If you pay the rent 'under reservation of rights', you reserve the right to reclaim overpaid rent. Note in the payment reference: 'Payment under reservation due to defect [description]'. This protects you from termination without notice and lets you reclaim the difference later. The Federal Court of Justice itself points tenants to this route.",
  "faq.q10": "Do I lose my right to reduce if I do nothing for a long time?",
  "faq.a10": "The once-common rule that the right to reduce is forfeited after around six months of unreserved payment was based on Section 539 BGB in its pre-2001 wording and no longer applies in that form. Forfeiture under Section 242 BGB is an exception and requires both a time element and a conduct element. You should still act promptly — because of the evidence and the three-year limitation period.",
  "faq.q11": "What about energy-efficiency modernisation?",
  "faq.a11":
    "During energy-efficiency modernisation works (e.g. thermal insulation), the rent reduction is excluded for 3 months (Section 536 (1a) BGB). After that you may reduce the rent. This only applies to energy-related measures, not to general modernisation.",
  "m.baulaerm_nachbar.l": "Construction noise from the neighbouring property",
  "m.baulaerm_nachbar.d": "Noise from a building site on someone else's land is generally NOT a defect according to the Federal Court of Justice. A reduction only comes into play if the tenancy agreement says otherwise or the landlord has compensation claims under Section 906 BGB.",
  "m.ratten_umfeld.l": "Rats in the cellar, yard or garden",
  "m.ratten_umfeld.d": "Rats around the building — at the bins, in the back yard, garden or cellar — without entering the apartment.",
  "m.toilette_zweit_wc.l": "Toilet broken (second toilet available)",
  "m.toilette_zweit_wc.d": "One toilet is broken, but a second, perfectly usable toilet is available in the apartment.",
  "m.dusche_einzige.l": "Only washing/bathing facility out of order",
  "m.dusche_einzige.d": "The apartment's only washing and bathing facility cannot be used.",
  "m.asbest_gebunden.l": "Asbestos firmly bound and undamaged",
  "m.asbest_gebunden.d": "Firmly bound, undamaged asbestos, e.g. intact vinyl-asbestos tiles. Its mere presence generally does NOT constitute a defect; a justified concern about fibre release is required.",
  "faq.q12": "Does paying the arrears save me if I reduced too much?",
  "faq.a12": "Only halfway. If you pay the arrears in full within two months of being served with the eviction claim, the termination without notice becomes ineffective (Section 569 (3) no. 2 BGB). An ordinary termination declared in the alternative is, however, unaffected. In practice landlords regularly terminate both without notice and, in the alternative, ordinarily — so you can still lose the apartment despite paying in full.",
};

export default en;
