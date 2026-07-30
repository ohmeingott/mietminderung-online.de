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
  "m.baulaerm_haus.l": "Construction noise in the building / next door",
  "m.baulaerm_haus.d":
    "Considerable construction noise from building work in or on the building.",
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
  "m.ratten.l": "Rats in the apartment / building",
  "m.ratten.d": "Actual rat infestation in the apartment or building.",
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
  "m.toilette_defekt.l": "Toilet unusable",
  "m.toilette_defekt.d":
    "The only toilet is broken and cannot be used.",
  "m.dusche_defekt.l": "Shower broken",
  "m.dusche_defekt.d": "The shower does not work or cannot be used.",
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
  "m.wohnflaeche_10.l": "Living space more than 10% smaller than agreed",
  "m.wohnflaeche_10.d":
    "The actual living space is more than 10% smaller than stated in the contract.",
  "m.hitze_dach.l": "Extreme heat in summer (above 26 °C)",
  "m.hitze_dach.d":
    "The apartment (e.g. top floor) heats up to over 26 °C.",
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
  "m.asbest.l": "Asbestos in the apartment",
  "m.asbest.d":
    "Asbestos was found in the apartment (e.g. broken panels).",
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
  "faq.a1":
    "No! The rent reduction takes effect by operation of law (automatically) as soon as a significant defect exists and you have reported it to the landlord. You do not need any consent. However, you must report the defect to the landlord first (defect notice).",
  "faq.q2": "How do I calculate the amount of the rent reduction?",
  "faq.a2":
    "The rent reduction is calculated from the gross warm rent — that is, the base rent plus all service charges. The amount depends on the type and severity of the defect. Example: with a gross warm rent of €1,000 and a reduction rate of 20%, you only pay €800. The rate is derived from court rulings in comparable cases.",
  "faq.q3": "What is a defect notice and why do I need it?",
  "faq.a3":
    "The defect notice (Mängelanzeige) is a written notification to your landlord in which you describe the defect and request its removal. It is required by law (Section 536c BGB). Without a defect notice you cannot reduce the rent and even risk claims for damages. We help you create it in a legally sound way.",
  "faq.q4": "What happens if I reduce the rent too much?",
  "faq.a4":
    "Careful: if you reduce the rent too much and arrears of two monthly rents build up, the landlord can terminate the tenancy without notice (Section 543 (2) no. 3 BGB). Our recommendation: initially pay the full rent under reservation of rights and reclaim the difference later. That way you are on the safe side.",
  "faq.q5": "Can the landlord exclude the rent reduction in the contract?",
  "faq.a5":
    "No. For residential tenancies, the right to a rent reduction cannot be waived (Section 536 (4) BGB). Clauses in the tenancy agreement that exclude the right to reduce are invalid.",
  "faq.q6": "From when can I reduce the rent?",
  "faq.a6":
    "The rent reduction applies from the moment the landlord knows about the defect — usually from receipt of the defect notice. As a rule you cannot reduce the rent for the time before that, unless you paid under reservation of rights.",
  "faq.q7": "Am I always allowed to reduce the rent in case of mould?",
  "faq.a7":
    "Not necessarily. If the mould was caused by your own behaviour (incorrect airing/heating), the right to reduce does not apply. However, the burden of proof lies with the landlord — they must prove that you caused the mould. Often, though, the cause is structural defects.",
  "faq.q8": "How long does the rent reduction apply?",
  "faq.a8":
    "The rent reduction applies for the entire period during which the defect exists. As soon as the defect has been remedied, you must pay the full rent again. There is no upper time limit.",
  "faq.q9": "What does 'paying under reservation of rights' mean?",
  "faq.a9":
    "If you pay the rent 'under reservation of rights', you reserve the right to reclaim overpaid rent. Note in the payment reference: 'Payment under reservation due to defect [description]'. This protects you from termination without notice and lets you reclaim the difference later.",
  "faq.q10": "Do I lose my right to reduce if I do nothing for a long time?",
  "faq.a10":
    "Yes, that is possible. If you know about the defect and pay the full rent without reservation for around 6 months, the right to reduce may be forfeited. So act promptly after discovering a defect.",
  "faq.q11": "What about energy-efficiency modernisation?",
  "faq.a11":
    "During energy-efficiency modernisation works (e.g. thermal insulation), the rent reduction is excluded for 3 months (Section 536 (1a) BGB). After that you may reduce the rent. This only applies to energy-related measures, not to general modernisation.",
};

export default en;
