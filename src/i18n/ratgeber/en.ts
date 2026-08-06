import type { RatgeberUebersetzung } from "./typen";

/**
 * English guides. Keys are the German slugs from `src/data/ratgeber.ts`; the
 * URL slugs live in `src/i18n/pfade.ts`.
 *
 * German legal terms are carried along in brackets on first use — a reader who
 * takes this to a landlord or a court needs the German word, not only its
 * English rendering. Statute references (§ 536c BGB) stay as they are.
 *
 * The sample letter keeps its German body on purpose. It is the text that gets
 * sent to a German landlord, so translating it would produce a letter nobody
 * can use. Only the bracketed instructions — which the reader replaces anyway —
 * carry an English gloss.
 */
const en: RatgeberUebersetzung = {
  "maengelanzeige-schreiben": {
    navLabel: "Writing a defect notice",
    title:
      "Writing a defect notice (Mängelanzeige): template, required details and deadlines",
    metaTitle:
      "Writing a defect notice: template and guide under § 536c BGB",
    description:
      "Defect notice to your landlord: every detail § 536c BGB requires, a complete template to copy, deadlines and how to serve it properly.",
    keywords: [
      "writing a defect notice",
      "Mängelanzeige template",
      "defect notice landlord Germany",
      "§ 536c BGB",
      "report defect to landlord",
    ],
    lead:
      "Without a defect notice (Mängelanzeige), rent reduction goes nowhere. Skip it and you generally cannot reduce the rent at all — and in the worst case you end up owing your landlord damages. Here you will read what belongs in the letter, what deadline to set, and how to serve it so you can prove it arrived.",
    sections: [
      {
        heading: "Why the defect notice is indispensable",
        paragraphs: [
          "§ 536c BGB requires tenants to report a defect without delay as soon as it appears during the tenancy. “Without delay” (unverzüglich) means without culpable hesitation. No more than a few days should pass between discovery and notice.",
          "Skipping the notice costs you twice. First the right to reduce the rent. Second, you can become liable for damages if the harm grows because nobody was told — for instance when a damp wall turns into a renovation case over time.",
          "The reduction arises by operation of law. But you can only enforce it from the day the landlord knows about the defect. The date of your notice is therefore also the start date of your claim.",
        ],
        note:
          "There is an exception: if the landlord already knows about the defect, because the caretaker saw it or the whole building is affected, the duty to report falls away. You still should not rely on it. A short letter costs little and settles every later question of proof.",
      },
      {
        heading: "These nine details belong in the defect notice",
        ordered: [
          "Sender: your full name and the address of the rented flat",
          "Recipient: name and address of the landlord or the property manager (Hausverwaltung)",
          "Date of the letter",
          "A subject line containing the word “Mängelanzeige” and identifying the flat (address, floor, flat number if any)",
          "A specific description of the defect: what exactly, in which room, since when, how does it show?",
          "A reference to your evidence: attached photos, temperature or noise logs, witnesses",
          "A demand to remedy the defect, with a deadline given as a specific date",
          "A statement that you are reducing the rent or paying under protest (unter Vorbehalt) until it is fixed",
          "Your signature",
        ],
        paragraphs: [
          "The most common mistake is a vague description. “There is mould in the bathroom” is not enough. Better: “On the north wall of the bathroom, above the shower, there has been mould growth of roughly 40 × 30 cm since 3 March 2026. The growth is black-green and there is a musty smell.”",
        ],
      },
      {
        heading: "What deadline to set",
        table: {
          caption: "Usual deadlines for remedying a defect",
          head: ["Type of defect", "Reasonable deadline", "Examples"],
          rows: [
            [
              "Emergency / health hazard",
              "immediately to 24 hours",
              "Heating failure in winter, complete power cut, the only toilet broken",
            ],
            [
              "Urgent defect",
              "3 to 7 days",
              "Water damage, severe mould growth, a flat door that will not lock",
            ],
            [
              "Ordinary defect",
              "14 days",
              "Draughty windows, a broken lift, a dripping tap",
            ],
            [
              "Minor defect",
              "3 to 4 weeks",
              "A broken doorbell, a long wait for hot water, a damp cellar",
            ],
          ],
        },
        paragraphs: [
          "Write a specific date into the deadline (“by 20 August 2026”), not a period such as “within two weeks”. Only a date makes the moment of expiry beyond dispute, and every further step is built on that date.",
        ],
      },
      {
        heading: "Template: defect notice to the landlord",
        code:
          "[Your name / Ihr Name]\n[Street and number / Straße und Hausnummer]\n[Postcode, city / PLZ, Ort]\n\n[City / Ort], [Date / Datum]\n\nAn\n[Name of the landlord / property manager]\n[Address / Anschrift]\n\nBetreff: Mängelanzeige für die Wohnung [address, floor, flat number]\n\nSehr geehrte Damen und Herren,\n(if you know the name: Sehr geehrte Frau [surname], /\nSehr geehrter Herr [surname],)\n\nhiermit zeige ich Ihnen folgenden Mangel in der von mir gemieteten\nWohnung an:\n\n[Describe the defect in German and precisely: what, in which room,\nsince when, how does it show?]\n\nAls Nachweis füge ich diesem Schreiben [Fotos / ein Temperaturprotokoll /\nein Lärmprotokoll] bei.\n\nIch fordere Sie auf, den Mangel bis zum [specific date] zu beseitigen.\n\nBis zur vollständigen Beseitigung des Mangels werde ich die Miete\n[um X % mindern  → I will reduce by X % /\n unter Vorbehalt in voller Höhe zahlen  → I will pay in full under protest].\n\nSollte der Mangel nicht fristgerecht beseitigt werden, behalte ich mir\nweitere rechtliche Schritte vor, insbesondere Schadensersatz gemäß\n§ 536a Abs. 1 BGB und die Selbstvornahme gemäß § 536a Abs. 2 BGB.\n\nMit freundlichen Grüßen\n\n[Signature / Unterschrift]\n[Name]\n\nAnlagen:\n- [Photos of the defect / Fotos vom Mangel]\n- [Log / Protokoll]",
      },
      {
        heading: "How to serve the notice so you can prove it",
        paragraphs: [
          "The law prescribes no form for the defect notice; in theory speaking would do. That helps you little when a dispute turns on proving that and when the landlord received it. Which is why the method of delivery matters.",
        ],
        bullets: [
          "Einwurf-Einschreiben (registered post with documented delivery into the letterbox): a good balance of proof and cost, and the delivery record is available online",
          "A messenger with a witness: someone reads the letter, posts it and can later testify to both. Costs nothing and holds up in court.",
          "Handing it over in person against a written receipt: the safest route if the landlord cooperates",
          "Übergabe-Einschreiben (registered post against signature): risky, because the recipient can refuse it and the letter then counts as never delivered",
          "Email only: too little on its own, because delivery is almost impossible to establish",
        ],
        note:
          "From practice: send the notice by email as well, so it lands on the desk at once. For proof, though, what counts is the postal route.",
      },
      {
        heading: "What happens after the notice",
        ordered: [
          "The landlord inspects the defect and arranges the repair. Looking at it first is his right.",
          "You must allow access for inspection and repair once it has been announced. Refusing can cost you your right to reduce the rent.",
          "From the moment the notice arrives the rent is reduced by operation of law. If in doubt, keep paying under protest for now.",
          "If the deadline passes without result, damages under § 536a Abs. 1 BGB and self-remedy under § 536a Abs. 2 BGB come into play.",
          "Once the defect is fixed, the reduction ends. From that day the full rent is due again.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does the defect notice have to be in writing?",
        answer:
          "Written form is not required; the notice would be valid even spoken. But in a dispute you have to prove it reached the landlord. In practice there is therefore no way around a letter, served by Einwurf-Einschreiben or by a messenger with a witness.",
      },
      {
        question: "How quickly do I have to report a defect?",
        answer:
          "Without delay, says § 536c BGB, meaning without culpable hesitation. In practice: within a few days of noticing it. Water damage and similarly urgent cases are best reported the same day.",
      },
      {
        question: "Can I report several defects in one notice?",
        answer:
          "Yes, and it is sensible to do so. Describe each defect in its own paragraph with the room, when it started and how bad it is. That keeps the notice readable and lets you add up the reduction rates of the individual defects.",
      },
      {
        question: "What happens if I do not report the defect?",
        answer:
          "As a rule you lose the right to reduce the rent for the period before the notice. It can get worse: if the damage grows because the landlord did not know, you may be liable for it (§ 536c Abs. 2 BGB).",
      },
    ],
  },

  "mietminderung-berechnen": {
    navLabel: "Calculating the reduction",
    title:
      "Calculating a rent reduction: formula, examples and the basis of calculation",
    metaTitle:
      "Calculating a rent reduction: formula, examples and gross warm rent",
    description:
      "Calculating a rent reduction: why the gross warm rent (Bruttowarmmiete) is the basis, how the formula works and what applies with several defects. With worked examples.",
    keywords: [
      "calculate rent reduction",
      "rent reduction Bruttowarmmiete",
      "rent reduction formula",
      "rent reduction example",
      "calculate reduction rate",
    ],
    lead:
      "When people get a rent reduction wrong, it is usually not the percentage but the number it is applied to. Start from the cold rent instead of the gross warm rent and you give away money every single month. Here is how to calculate it properly.",
    sections: [
      {
        heading: "The basis is always the gross warm rent",
        paragraphs: [
          "The Federal Court of Justice (Bundesgerichtshof) settled this in 2005: the basis for a reduction is the gross warm rent, not the net cold rent. For residential tenancies the ruling of 20 July 2005 applies (case VIII ZR 347/04); for commercial tenancies the court had already decided the same on 6 April 2005 (case XII ZR 225/03).",
          "That means the net cold rent plus all advance payments or flat rates for operating costs. The reasoning: you pay for the flat as one package, so a defect diminishes the value of the whole package.",
        ],
        table: {
          caption: "What the gross warm rent is made of",
          head: ["Item", "Example amount"],
          rows: [
            ["Net cold rent (Nettokaltmiete)", "800,00 €"],
            ["Operating costs advance (Betriebskosten)", "150,00 €"],
            ["Heating costs advance (Heizkosten)", "50,00 €"],
            ["Gross warm rent (basis of calculation)", "1.000,00 €"],
          ],
        },
        note:
          "In the example the difference between cold and warm rent comes to 40 € a month at a 20 % reduction. Over a year that is 480 €.",
      },
      {
        heading: "The formula",
        code:
          "Reduction amount = gross warm rent × reduction rate ÷ 100\nRent payable     = gross warm rent − reduction amount",
        paragraphs: [
          "With a gross warm rent of 1,000 € and a reduction rate of 30 %, the reduction amounts to 300 €. You then owe 700 €.",
        ],
      },
      {
        heading: "Calculating by the day for shorter periods",
        paragraphs: [
          "If the defect does not last the whole month, the amount is prorated. The convention is to treat a month as 30 days.",
        ],
        code:
          "Reduction amount = (gross warm rent ÷ 30) × days with the defect × rate ÷ 100\n\nExample: 1,000 € warm rent, 12 days without heating, rate 80 %\n= (1,000 ÷ 30) × 12 × 0.80\n= 33.33 € × 12 × 0.80\n= 320.00 €",
        note:
          "Note the start and end of the defect to the day. Those two dates are exactly what the size of your claim is built from later.",
      },
      {
        heading: "Several defects at once",
        paragraphs: [
          "A stubborn misconception lives here: that you may simply add up the rates of several defects. Courts do not. They ask, under § 536 Abs. 1 BGB, how badly the flat as a whole is impaired in its fitness for use, and they assess it as a whole. The rate awarded is therefore almost always below the sum of the individual values.",
          "The sum of the table values is only a rough ceiling, not a result. That shows most clearly with defects that describe the same impairment at heart: a broken radiator and the flat being too cold because of it are counted once, not twice.",
        ],
        table: {
          caption: "Example: several defects assessed as a whole",
          head: ["Defect", "Individual rate"],
          rows: [
            ["Mould in one room", "10 %"],
            ["Draughty windows in the same room", "8 %"],
            ["Broken lift (4th floor)", "10 %"],
            ["Sum of the individual values (guidance only)", "28 %"],
            ["Realistic overall rate", "below 28 %"],
          ],
        },
        note:
          "Our calculator reflects this: the highest single value counts in full, every further one only by half. That is still an estimate, but it no longer produces the 100 % results that plain addition reaches at four or five defects.",
      },
      {
        heading: "Effect on the annual operating cost statement",
        paragraphs: [
          "A rent reduction also affects the annual operating cost statement (Betriebskostenabrechnung). Because the advance payments are part of the reduced gross warm rent, any balance demanded for the period of the reduction must be cut accordingly.",
          "So check your statement for whether the landlord took the reduction into account. If not, object in writing within the twelve-month objection period under § 556 Abs. 3 BGB.",
        ],
      },
      {
        heading: "How to find the right rate",
        bullets: [
          "Use published rent reduction tables, which summarise court decisions in comparable cases",
          "Take duration, intensity and extent of the impairment into account — table values are ranges, not fixed figures",
          "When in doubt, estimate conservatively: too small a reduction costs money, too large a one can cost you the flat",
          "For larger amounts, have the rate checked by a tenants' association (Mieterverein) or a specialist lawyer",
        ],
        note:
          "Every percentage in such tables comes from a decision on an individual case and is guidance only. No court is bound by them; what is assessed is always the case at hand.",
      },
    ],
    faqs: [
      {
        question: "Is the reduction calculated from the cold or the warm rent?",
        answer:
          "From the gross warm rent, that is the net cold rent plus all advance payments for operating and heating costs. For residential tenancies the Federal Court of Justice decided this in its ruling of 20 July 2005 (case VIII ZR 347/04).",
      },
      {
        question: "How do I calculate if the defect lasted only two weeks?",
        answer:
          "By the day: divide the gross warm rent by 30, multiply by the number of days with the defect and then by the reduction rate. At 1,000 € warm rent, 14 days and 20 %, that comes to 93.33 €.",
      },
      {
        question: "May I add up the rates of several defects?",
        answer:
          "No, at least not as a result. Courts do not add; they assess as a whole how badly the flat is impaired overall. The sum of the individual values is only a rough ceiling; the rate awarded is regularly lower and can never exceed 100 %.",
      },
      {
        question:
          "Does the reduction have to be reflected in the operating cost statement?",
        answer:
          "Yes. Because the advance payments are part of the reduced gross warm rent, any balance demanded for the period of the reduction must be reduced proportionally. Check the statement and object within twelve months of receiving it.",
      },
    ],
  },
  "miete-unter-vorbehalt-zahlen": {
    navLabel: "Paying under protest",
    title: "Paying rent under protest: the safe route to a rent reduction",
    metaTitle: "Paying rent under protest: wording and reclaiming overpayment",
    description:
      "Why you should pay under protest (unter Vorbehalt) when there are defects, how to word the reservation and how to reclaim rent you overpaid.",
    keywords: [
      "paying rent under protest",
      "reservation rent reduction",
      "reclaim rent Germany",
      "payment reference under protest",
    ],
    lead:
      "Cut the rent on your own judgement and misjudge it, and in the worst case you risk termination without notice. There is another way: keep paying in full, declare the reservation, get the money back later. Economically the outcome is the same — without the risk.",
    sections: [
      {
        heading: "The risk of cutting the payment directly",
        paragraphs: [
          "Set the rate too high and you build up arrears, and those become dangerous faster than most people think. The landlord may terminate without notice if you are in default on a not-insignificant part of the rent on two consecutive dates (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a BGB). Under § 569 Abs. 3 Nr. 1 BGB “not insignificant” already means more than one month's rent. The threshold of two months' rent only applies over a longer period (letter b).",
          "Withhold 40 % and you exceed one month's rent after just three months. Good faith will not help you much here: the Federal Court of Justice applies strict standards to a tenant's non-culpable mistake of law and has expressly abandoned earlier leniency. Anyone operating in the grey zone of rates is acting negligently.",
        ],
        note:
          "This is exactly where paying under protest comes in: you keep paying in full but you do not lose your claim to get the money back.",
      },
      {
        heading: "How paying under protest works",
        ordered: [
          "You report the defect in writing and set a deadline for it to be remedied.",
          "In the notice you state expressly that from now on you are paying the rent only under protest.",
          "You keep transferring the full rent and note the reservation in the payment reference.",
          "You document the defect without gaps for as long as it lasts.",
          "Once the defect is fixed you reclaim the amount you overpaid, in court if necessary.",
        ],
      },
      {
        heading: "The right wording",
        paragraphs: [
          "The reservation must be recognisably tied to the specific defect. A blanket “under protest” with nothing attached is not reliably enough.",
        ],
        code:
          "In the payment reference:\n\n  Miete [month/year], Zahlung unter Vorbehalt wegen Mangel\n  (Schimmel Schlafzimmer, angezeigt am 12.03.2026)\n  [Rent for (month/year), paid under protest because of a defect —\n   mould in the bedroom, reported on 12.03.2026]\n\nIn the letter to the landlord:\n\n  Bis zur vollständigen Beseitigung des angezeigten Mangels zahle\n  ich die Miete ausdrücklich nur unter Vorbehalt der Rückforderung.\n  Ein Verzicht auf mein Minderungsrecht nach § 536 BGB ist damit\n  nicht verbunden.",
        note:
          "Space in a payment reference is tight. A short form will do, as long as it names the date of your defect notice.",
      },
      {
        heading: "Reclaiming: deadlines and how to proceed",
        paragraphs: [
          "The claim for repayment is time-barred after three years. The period starts at the end of the year in which the claim arose and you learned of the circumstances behind it. Independently of your knowledge, an absolute limitation period of ten years applies.",
          "Demand the money back in writing and with a deadline. Set out the calculation openly: period, rate, gross warm rent, total. If the landlord does nothing, a tenants' association or a specialist lawyer is the next step.",
        ],
      },
      {
        heading: "When cutting the rent directly can still make sense",
        bullets: [
          "The defect is unambiguous and the rate undisputed, for example where a court has confirmed a discrepancy in floor area",
          "The landlord has acknowledged the reduction in writing, both in principle and in amount",
          "A tenants' association or a lawyer has checked and confirmed the rate",
          "The defect has existed for a long time and the landlord stays inactive despite repeated deadlines",
        ],
        note:
          "Even then: stay on the conservative side with the rate. The economic gain from a few percentage points bears no relation to the risk of losing the flat.",
      },
    ],
    faqs: [
      {
        question: "What does “paying rent under protest” mean?",
        answer:
          "You keep paying the full rent but expressly reserve the right to reclaim later the part you overpaid because of the defect. That way you avoid arrears and with them the risk of termination without notice.",
      },
      {
        question: "How do I word the reservation on a bank transfer?",
        answer:
          "In the payment reference, for instance: “Miete 04/2026, Zahlung unter Vorbehalt wegen Mangel (Schimmel Schlafzimmer, angezeigt am 12.03.2026)”. What matters is the recognisable link to the specific defect you already reported.",
      },
      {
        question: "How far back can I reclaim overpaid rent?",
        answer:
          "The claim is normally time-barred after three years, counted from the end of the year in which it arose and you knew about it. Independently of your knowledge it ends after ten years at the latest.",
      },
      {
        question: "Do I lose my right to reduce the rent if I pay in full?",
        answer:
          "Only in exceptional cases, namely through forfeiture under § 242 BGB. Contrary to a widespread account there is no fixed six-month benchmark. An express reservation with every payment takes the sting out of the question from the start.",
      },
    ],
  },

  "mietminderung-rueckwirkend": {
    navLabel: "Reducing retroactively",
    title: "Retroactive rent reduction: when you can get money back",
    metaTitle: "Retroactive rent reduction: when reclaiming is possible",
    description:
      "Reducing retroactively works in four cases only. Which ones, which limitation periods apply and how to proceed when reclaiming.",
    keywords: [
      "retroactive rent reduction",
      "reduce rent for the past",
      "rent reduction limitation period",
      "reclaim overpaid rent",
    ],
    lead:
      "“Can I claim money back for the past months?” is one of the most common questions about rent reduction. The honest answer is: usually not. But there are four clearly defined exceptions, and they are worth knowing.",
    sections: [
      {
        heading: "The principle: from the landlord's knowledge onwards",
        paragraphs: [
          "Under § 536 BGB the rent is reduced automatically as soon as a significant defect exists. But you can only enforce the claim once the landlord knows about the defect — normally from the moment your notice arrives.",
          "For the time before that the rule is: anyone who knew about the defect and still paid the full rent without reservation generally cannot get the money back.",
        ],
      },
      {
        heading: "These four cases allow you to reclaim",
        bullets: [
          "You paid under protest; the claim for repayment then survives in full",
          "The landlord already knew about the defect, for instance because he saw it himself or the whole building was affected",
          "The landlord stated the floor area incorrectly; in that case the claim exists from the start of the tenancy",
          "The tenancy agreement contains an invalid clause that kept you from reducing the rent",
        ],
        note:
          "Do not underestimate the last point. Older agreements in particular often contain clauses meant to exclude the right to reduce. For residential lettings such clauses are void under § 536 Abs. 4 BGB, and yet tenants have overpaid for years because of them.",
      },
      {
        heading: "Forfeiture: when waiting too long costs the claim",
        paragraphs: [
          "If you pay the full rent without reservation over a long period although you know about the defect, the right to reduce can be forfeited in exceptional cases. The formerly common benchmark of six months, however, comes from case law on § 539 BGB in its old version, repealed in 2001, and no longer applies in that form: in 2003 the Federal Court of Justice held that paying without reservation while aware of the defect does not cause a loss of rights by analogy with § 536b BGB.",
          "In law, forfeiture needs two ingredients. The time element: a considerable period has passed. And the circumstances element: the landlord was entitled to conclude from your conduct that you would no longer reduce. Only both together cost you the claim.",
        ],
      },
      {
        heading: "Limitation periods at a glance",
        table: {
          head: ["Period", "Length", "When it starts"],
          rows: [
            [
              "Standard limitation of the repayment claim",
              "3 years",
              "End of the year in which the claim arose and you learned of it",
            ],
            [
              "Absolute limitation",
              "10 years",
              "When the claim arose, regardless of knowledge",
            ],
            [
              "Forfeiture of the right to reduce (§ 242 BGB)",
              "no fixed benchmark, exceptional case",
              "Knowledge of the defect while paying without reservation",
            ],
          ],
        },
      },
      {
        heading: "How to proceed when reclaiming",
        ordered: [
          "Determine the period and the rate and set out a calculation that can be followed.",
          "Gather your evidence: the defect notice, photos, logs, correspondence, bank statements.",
          "Demand repayment from the landlord in writing, with a specific deadline of around 14 days.",
          "If refused, involve a tenants' association or a specialist lawyer; often a solicitor's letter is enough on its own.",
          "Before the limitation period expires, consider court steps, if need be via an order for payment (Mahnbescheid), which suspends limitation.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I reduce the rent retroactively?",
        answer:
          "Only to a limited extent. It is possible if you paid under protest, the landlord already knew about the defect, the floor area was stated incorrectly, or an invalid contract clause kept you from reducing.",
      },
      {
        question: "How far back can I reclaim rent?",
        answer:
          "Within the standard limitation period of three years, counted from the end of the year in which the claim arose and you knew about it. Independently of that, the claim ends after ten years at the latest.",
      },
      {
        question: "Do I lose my right to reduce if I do nothing for a long time?",
        answer:
          "Only exceptionally. The six-month limit once quoted rested on repealed law; today forfeiture only comes into play via § 242 BGB and requires the time and circumstances elements together. You should still act promptly — if only because of the evidence and the three-year limitation period.",
      },
      {
        question: "Does anything different apply if the floor area was wrong?",
        answer:
          "Yes. If the actual floor area falls short by more than ten percent, the claim exists from the start of the tenancy under the case law of the Federal Court of Justice, and without a prior defect notice at that, because the landlord is responsible for the incorrect statement himself.",
      },
    ],
  },
  "mietminderung-ausschluss": {
    navLabel: "When no reduction applies",
    title: "When a rent reduction is excluded: 7 grounds",
    metaTitle: "Rent reduction excluded: 7 grounds that cost you the claim",
    description:
      "Not every defect entitles you to reduce: seven grounds of exclusion, from knowing at signing through minor defects to energy-efficiency modernisation.",
    keywords: [
      "rent reduction excluded",
      "no rent reduction",
      "minor defect German tenancy law",
      "§ 536b BGB",
      "energy modernisation rent reduction",
    ],
    lead:
      "Not every defect entitles you to reduce the rent. The law knows a series of grounds of exclusion, and anyone who overlooks them and cuts the rent anyway builds up arrears that can end in termination. Work through these seven points before you touch the rent.",
    sections: [
      {
        heading: "1. Knowing about the defect at signing (§ 536b BGB)",
        paragraphs: [
          "If you know about a defect when you sign the tenancy agreement and move in anyway, you cannot later reduce the rent because of it. The same applies if you failed to notice the defect only through gross negligence — that is, it was hard to miss during the viewing.",
          "The exception: if you expressly reserved your rights because of the defect when taking over the flat, the right to reduce survives. Always have such a reservation recorded in the handover protocol (Übergabeprotokoll).",
        ],
      },
      {
        heading: "2. Failing to give notice of the defect (§ 536c BGB)",
        paragraphs: [
          "If you do not report a defect without delay and the landlord therefore cannot remedy it, you lose the right to reduce. On top of that you can become liable to him for damages.",
          "If the landlord already knows about the defect from another source, the duty to report falls away. You should still never rely on that.",
        ],
      },
      {
        heading: "3. Minor defects and insignificant impairments",
        paragraphs: [
          "Under § 536 Abs. 1 Satz 3 BGB an only insignificant reduction in fitness for use is disregarded. What is meant are defects that are easy to spot and cheap to fix.",
        ],
        bullets: [
          "A single dripping tap",
          "A room door that sticks slightly",
          "A single cracked tile",
          "One broken socket where enough others are available",
        ],
        note:
          "What counts is the impairment of use, not the price of the repair: a defect that is cheap to fix can be significant, an expensive one insignificant. Several minor defects together can cross the threshold of significance.",
      },
      {
        heading: "4. Defects you caused yourself",
        paragraphs: [
          "If you, members of your household or your guests caused the defect, there is no right to reduce. The classic case is mould from insufficient ventilation and heating.",
          "For your position the burden of proof is decisive, and it lies with the landlord. He must first rule out structural causes such as thermal bridges or missing insulation. Only if he succeeds does your own conduct come into play at all.",
        ],
      },
      {
        heading: "5. Forfeiture through waiting too long",
        paragraphs: [
          "If you pay the full rent without reservation over a long period although you know about the defect, your right to reduce may exceptionally be forfeited. The time element and a legitimate expectation on the landlord's part are required together; there is no fixed benchmark such as “six months”.",
        ],
      },
      {
        heading: "6. Energy-efficiency modernisation (§ 536 Abs. 1a BGB)",
        paragraphs: [
          "For energy-efficiency modernisation works within the meaning of § 555b Nr. 1 BGB, rent reduction is excluded for three months. The condition is that the landlord announced the works properly and in good time.",
          "After those three months you may reduce. And the exclusion applies only to energy-related works; general modernisation or plain maintenance does not fall under it.",
        ],
      },
      {
        heading: "7. Socially normal and locally customary impairments",
        bullets: [
          "Ordinary living noise in a block of flats, children at play included",
          "Street noise in a city-centre location that already existed when you moved in",
          "The usual cooking smells from neighbouring flats",
          "Impairments caused by your own use of the flat in breach of the agreement",
        ],
        paragraphs: [
          "The yardstick is always the condition at the time the agreement was made. What deteriorated afterwards can be a defect. What was like that from the start, you rented along with the flat.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "Can the landlord exclude rent reduction in the tenancy agreement?",
        answer:
          "Not for residential lettings. Under § 536 Abs. 4 BGB the right to reduce cannot be contracted away; corresponding clauses in the agreement are void. Different rules apply to commercial premises.",
      },
      {
        question: "What is a minor defect?",
        answer:
          "A defect that reduces the flat's fitness for use only insignificantly and can be fixed with little effort, such as a single dripping tap. Under § 536 Abs. 1 Satz 3 BGB it does not entitle you to reduce.",
      },
      {
        question: "May I reduce the rent during an energy-efficiency retrofit?",
        answer:
          "Only after three months. § 536 Abs. 1a BGB excludes reduction for that period where energy-efficiency modernisation works were properly announced. After that, reduction is possible.",
      },
      {
        question: "Who has to prove that I caused the mould?",
        answer:
          "The landlord. He must first show and prove that there are no structural causes such as thermal bridges or ingress of moisture. Only if he succeeds does your ventilating and heating behaviour come into consideration.",
      },
    ],
  },

  "mietminderung-fehler": {
    navLabel: "Avoiding common mistakes",
    title: "The 10 most common mistakes in reducing rent",
    metaTitle: "Rent reduction: 10 common mistakes and how to avoid them",
    description:
      "From an inflated rate to missing documentation: ten mistakes that regularly cost tenants their claim, and how to avoid them.",
    keywords: [
      "rent reduction mistakes",
      "rent reduction done wrong",
      "rent reduction termination risk",
      "rent reduction tips",
    ],
    lead:
      "When a rent reduction fails, the defect itself is rarely to blame. Almost always it is the approach: no notice, the wrong basis of calculation, cutting too boldly. These ten mistakes are worth knowing before you touch the first transfer.",
    sections: [
      {
        heading: "Mistake 1: cutting the rent without reporting the defect",
        paragraphs: [
          "By far the most common and most expensive mistake. Without a defect notice there is no enforceable claim, and the rent you withheld is nothing but arrears. First report in writing, then talk about reducing.",
        ],
      },
      {
        heading: "Mistake 2: reducing too much",
        paragraphs: [
          "Arrears of more than one month's rent on two consecutive dates can already trigger termination without notice (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a in conjunction with § 569 Abs. 3 Nr. 1 BGB). And table values are ranges from individual cases, not guarantees. Stay at the lower end or simply pay under protest.",
        ],
      },
      {
        heading: "Mistake 3: calculating from the cold instead of the warm rent",
        paragraphs: [
          "The basis of calculation is the gross warm rent including all advance payments. Start from the net cold rent and you reduce noticeably less than you are entitled to.",
        ],
      },
      {
        heading: "Mistake 4: not documenting the defect",
        paragraphs: [
          "Without photos, logs and witnesses it is one word against another in court, and the burden of proving the defect lies with the tenant. Start documenting on day one, not once the dispute has arrived.",
        ],
        bullets: [
          "Photos and videos with a legible date",
          "A temperature log for heating defects, several times a day",
          "A noise log with date, time from and to, type and intensity",
          "Note the names of possible witnesses while memories are fresh",
        ],
      },
      {
        heading: "Mistake 5: reporting only by email or in person",
        paragraphs: [
          "An email does not prove it arrived. Rely on Einwurf-Einschreiben or a messenger with a witness. Send the email as well, so the landlord finds out quickly.",
        ],
      },
      {
        heading: "Mistake 6: not setting a deadline for the remedy",
        paragraphs: [
          "Without a deadline given as a specific date you trigger no follow-on rights, neither damages nor self-remedy under § 536a Abs. 2 BGB. So: a date in the letter, not a vague period.",
        ],
      },
      {
        heading: "Mistake 7: refusing the landlord access",
        paragraphs: [
          "The landlord may inspect the defect and must be allowed to remedy it. Anyone who does not open the door after a proper announcement risks their right to reduce and ends up responsible for the delay themselves.",
        ],
      },
      {
        heading: "Mistake 8: continuing to reduce after the repair",
        paragraphs: [
          "As soon as the defect is fixed, the full rent is owed again. Keep cutting and you build up arrears. Record the day of the repair in writing and stop the reduction from then on.",
        ],
      },
      {
        heading: "Mistake 9: waiting too long",
        paragraphs: [
          "The longer you wait, the harder the proof, and in exceptional cases forfeiture under § 242 BGB looms. So do not sit on it: the defect notice should go out within a few days of discovery.",
        ],
      },
      {
        heading: "Mistake 10: fixing the defect yourself and then cutting the rent",
        paragraphs: [
          "Self-remedy is permitted only under narrow conditions: the landlord must be in default with the repair, or the repair must be urgently necessary to preserve the rented property (§ 536a Abs. 2 BGB). Repair too hastily on your own and you are left with the bill.",
        ],
        note:
          "The order matters: first set a deadline, document that it passed without result, and only then instruct a tradesperson if the landlord still does nothing.",
      },
    ],
    faqs: [
      {
        question: "What is the most common mistake in reducing rent?",
        answer:
          "Cutting the rent without reporting the defect in writing first. Without a notice there is generally no enforceable claim, and the cut counts as arrears.",
      },
      {
        question: "Can I be evicted over a rent reduction?",
        answer:
          "Yes, and sooner than often assumed: arrears of more than one month's rent on two consecutive dates suffice for termination without notice (§ 543 Abs. 2 Satz 1 Nr. 3 Buchst. a in conjunction with § 569 Abs. 3 Nr. 1 BGB). Paying up in full afterwards cures only the termination without notice, not an ordinary termination declared in the alternative (§ 569 Abs. 3 Nr. 2 BGB). Paying under protest rules this risk out from the start.",
      },
      {
        question: "May I have a defect repaired myself?",
        answer:
          "Only if the landlord is in default with the repair or immediate repair is necessary to preserve the rented property (§ 536a Abs. 2 BGB). Always set a deadline first and document that it passed without result.",
      },
      {
        question: "Do I have to let the landlord into the flat?",
        answer:
          "Yes. After a reasonable announcement you must allow inspection and repair of the defect. Refusing can cost you your right to reduce.",
      },
    ],
  },
  "maengelanzeige-zustellen": {
    navLabel: "Serving the defect notice",
    title: "Serving a defect notice: email, letter or registered post?",
    metaTitle: "Serving a defect notice: what really counts as proof of delivery",
    description:
      "How to serve a defect notice so you can prove it: why delivery decides the reduction, what email, Einwurf-Einschreiben and a messenger are worth, and which route holds up in court.",
    keywords: [
      "serving a defect notice",
      "defect notice registered post",
      "proof of delivery defect notice",
      "Einwurf-Einschreiben proof",
      "defect notice by email",
    ],
    lead:
      "A rent reduction only bites, in practice, from the day your landlord knows about the defect. What decides it is therefore not when you wrote the notice but when it reached him — and whether you can prove it. That is exactly where most cases come apart.",
    sections: [
      {
        heading: "Why delivery decides what you get back",
        paragraphs: [
          "The reduction arises under § 536 BGB by operation of law as soon as a significant defect exists. But you can generally only enforce it from the landlord's knowledge, and you create that knowledge with the notice. The moment it is delivered is therefore the day the count begins.",
          "A defect notice is a declaration that requires receipt. Under § 130 Abs. 1 BGB it takes effect only when it reaches the recipient — that is, enters his sphere of control such that under ordinary circumstances he can take note of it. For a letter that is the drop into the letterbox at the usual collection time.",
          "And the burden of proof is yours. If the landlord denies ever receiving anything, you have to establish delivery. If you cannot, the reduction for the entire preceding period is up for grabs — even where the defect was undisputed.",
        ],
        note:
          "A common misunderstanding: it is not sending that counts but arriving. A letter you can prove was dropped in gives you everything; one you can prove you sent gives you almost nothing.",
      },
      {
        heading: "The delivery routes compared",
        paragraphs: [
          "All of the following routes are legally permissible — § 536c BGB prescribes no form. They differ solely in what you hold in your hand if it comes to a dispute.",
        ],
        table: {
          caption: "Delivery routes for a defect notice and their evidential value",
          head: ["Route", "Evidential value", "When it makes sense"],
          rows: [
            [
              "Email",
              "Low. The send report proves sending, not receipt. A read receipt can be suppressed by the recipient.",
              "As a quick supplement, never as the only route",
            ],
            [
              "Ordinary letter",
              "No proof. Neither the delivery nor the contents are established.",
              "Where the relationship is good and nobody is arguing",
            ],
            [
              "Einwurf-Einschreiben",
              "Good. The drop into the letterbox is documented and traceable.",
              "The practical standard route",
            ],
            [
              "Übergabe-Einschreiben (against signature)",
              "Risky. If the landlord does not collect it, it counts as precisely not delivered.",
              "Better not — see below",
            ],
            [
              "Messenger with a witness",
              "Very good. The messenger can testify to the contents and to the delivery.",
              "Where there is someone you trust",
            ],
            [
              "Handing it over against a receipt",
              "Very good, if the landlord signs.",
              "Where there is direct contact",
            ],
          ],
        },
      },
      {
        heading: "Why registered post against signature is the worse choice",
        paragraphs: [
          "It sounds contradictory at first: of all things, the most elaborate form of postage is the least reliable one for a defect notice. The reason lies in how it is delivered.",
          "If the postal worker does not find the recipient, all they leave is a collection slip. That slip does not effect delivery — it is not the declaration, only a notice that one is waiting. If the landlord does not collect the item, it goes back to you after the storage period, and in law nothing has happened.",
          "Einwurf-Einschreiben has no such gap. The item is dropped into the letterbox like an ordinary letter, and that drop is exactly what gets documented. Delivery therefore takes effect regardless of whether the landlord empties the box.",
        ],
        note:
          "If you want to be entirely safe, combine the two: Einwurf-Einschreiben as solid proof, plus an email with the same text so the information also reaches the landlord quickly.",
      },
      {
        heading: "What to document besides delivery",
        bullets: [
          "A copy of the letter in exactly the version you sent.",
          "The date of posting and, with an Einwurf-Einschreiben, the item number with the delivery record.",
          "Photos or videos of the defect with a legible date, ideally continuously across the whole period.",
          "A simple defect log: date, time, observation. With noise or a heating failure this is the single most important piece of evidence.",
          "The names of possible witnesses, for instance flatmates or neighbours who can confirm the condition.",
        ],
      },
      {
        heading: "Who the notice has to go to",
        paragraphs: [
          "The addressee is the landlord, that is your counterparty under the tenancy agreement — not automatically the owner, and not the caretaker. If a property manager is involved and named in the agreement as representative, you can serve them; when in doubt send the letter to both.",
          "Where there are several landlords on the landlord's side — a community of heirs, say — the declaration must reach all of them. If the agreement names someone authorised to accept service, that one address is enough.",
          "If you yourselves are several tenants under the agreement, all of you should sign the notice or at least visibly agree to it. That avoids the argument over whether one was entitled to act for all.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a defect notice by email enough?",
        answer:
          "Legally yes, since § 536c BGB prescribes no form. In practice email is weak: the send report only proves that you sent it, not that it arrived. If the landlord denies receipt you are left without proof. Use email as a quick supplement, not as your only route.",
      },
      {
        question: "Is an Einwurf-Einschreiben a registered letter with signature?",
        answer:
          "No. With an Einwurf-Einschreiben what gets documented is that the item was dropped into the letterbox. The recipient does not sign. For a defect notice that is the advantage: delivery takes effect on the drop and does not depend on the landlord collecting anything.",
      },
      {
        question: "When does a letter count as delivered?",
        answer:
          "When it has entered the recipient's sphere of control such that, under ordinary circumstances, one can expect it to be noticed. For a drop into the letterbox that is the time of the usual collection — so for a drop in the late afternoon, regularly the following day.",
      },
      {
        question: "What do I do if the landlord denies receiving it?",
        answer:
          "Then you need your proof: the delivery record of the Einwurf-Einschreiben, the messenger's testimony, or the signed receipt. If you have neither, the only option left is to repeat the notice immediately and provably. That secures the reduction going forward; for the past, usually not.",
      },
      {
        question: "Do I have to sign the defect notice?",
        answer:
          "A handwritten signature is not required, because the law does not call for written form. It never hurts, though, and makes the letter unambiguously attributable to you.",
      },
      {
        question: "Can I have the defect notice sent for me?",
        answer:
          "Yes. You can create the defect notice here free of charge and then have us print it and send it by post to your landlord — either as a letter or as an Einwurf-Einschreiben with documented delivery. The free download stays yours in any case.",
      },
    ],
  },

  "vermieter-reagiert-nicht": {
    navLabel: "Landlord not responding",
    title:
      "The landlord is not responding to the defect notice: what you can do now",
    metaTitle: "Landlord not responding to a defect notice: 6 steps",
    description:
      "The deadline has passed and nothing is happening? What tenants can do when the landlord ignores the notice: reduction, withholding, self-remedy and court action.",
    keywords: [
      "landlord not responding",
      "landlord ignores defect notice",
      "landlord does not fix defect",
      "deadline passed defect notice",
      "enforce repair of a defect",
    ],
    lead:
      "You reported the defect, set a deadline — and nothing happens. That is the most common course of events, and it is no reason to give up. The law hands you several tools for exactly this case. They differ in sharpness, and the order matters.",
    sections: [
      {
        heading: "Check first: did the notice actually arrive?",
        paragraphs: [
          "Before escalating, settle the least dramatic possibility: the landlord never saw the letter. Without delivery no deadline runs, and every further step stands on sand.",
          "If you cannot establish delivery, repeat the notice now in a provable way — by Einwurf-Einschreiben or through a messenger who can testify to the drop. Set a new deadline in it with a specific date. That costs a few days and is markedly cheaper than a lost case.",
        ],
        note:
          "Always word the deadline as a date (“by 15 September 2026”), not as a span (“within two weeks”). With a date there is no later argument about when it started to run.",
      },
      {
        heading: "The six options at a glance",
        ordered: [
          "Rent reduction: it arises by operation of law and is the first and most important lever. You need no consent from the landlord for it.",
          "A second deadline with a warning: a second letter naming the consequences concretely moves more, in experience, than the first.",
          "Right of retention: beyond the reduction you can provisionally withhold a further part of the rent to build pressure.",
          "Self-remedy under § 536a Abs. 2 BGB: you have the defect fixed yourself and recover the costs.",
          "Court action to compel repair: the route when the substance is at stake and the landlord blocks permanently.",
          "Termination without notice under § 543 BGB: only for serious defects and as a last resort.",
        ],
      },
      {
        heading: "Rent reduction: the lever you have immediately",
        paragraphs: [
          "The reduction is the only response for which you need nobody. It arises automatically as soon as a significant defect exists and the landlord knows about it. No approval is required, and a clause in a residential tenancy agreement excluding the right to reduce is void under § 536 Abs. 4 BGB.",
          "The safe route is nevertheless to pay under protest at first and reclaim the overpayment later. Reduce too far and build arrears of two months' rent and you risk termination without notice under § 543 Abs. 2 Nr. 3 BGB — a risk that bears no relation to the few percent someone misjudged.",
        ],
        note:
          "When in doubt, reduce too little rather than too much. You can claim the difference later; a justified termination you will not get back.",
      },
      {
        heading: "Right of retention: pressure beyond the reduction",
        paragraphs: [
          "Alongside the reduction you can retain a further part of the rent for as long as the defect lasts. Unlike the reduction this is not a final deduction: the retained amount is paid over as soon as the defect is fixed. Its sole purpose is to build pressure.",
          "There is no statutory rule on the amount; in practice three to five times the monthly reduction is often quoted. Courts assess it differently and the boundaries are blurred.",
          "Announce the retention expressly and call it what it is. Anyone who silently transfers less paints the picture of a defaulting tenant for the landlord — and a termination risk for themselves.",
        ],
        note:
          "Retention and reduction add up. Count together everything you hold back and stay clearly below the threshold of two months' rent in arrears.",
      },
      {
        heading: "Self-remedy: having the defect fixed yourself",
        paragraphs: [
          "Under § 536a Abs. 2 BGB you may have the defect fixed yourself and claim the necessary expenses — but only in two cases: where the landlord is in default with the repair, or where immediate repair is necessary to preserve or restore the rented property.",
          "Default presupposes that you set a deadline and that it passed without result. Document both without gaps: the letter, the proof of delivery, the end of the deadline.",
          "Before instructing anyone, obtain at least two quotes and do not pick the most expensive contractor. You are reimbursed only for what was necessary — anything beyond that stays with you.",
        ],
        note:
          "Self-remedy is the step with the greatest financial risk of your own. For anything beyond a manageable sum you should take advice first.",
      },
      {
        heading: "Court action to compel repair",
        paragraphs: [
          "If the landlord stays inactive permanently and this is more than a trifle, you can enforce the repair through the courts. The claim follows from § 535 Abs. 1 Satz 2 BGB: the landlord owes the flat in a condition fit for the agreed use, and for the entire duration of the tenancy.",
          "Where there is danger in delay — winter without heating, say — an interim injunction comes into consideration, which is markedly faster than ordinary proceedings.",
          "Check your legal expenses insurance beforehand and, if you have one, your membership of a tenants' association. Both as a rule cover exactly these cases, and the advice there is the most sensible next step before going to court.",
        ],
      },
      {
        heading: "Termination without notice: only in earnest",
        paragraphs: [
          "If the agreed use of the flat is withheld from you entirely or to a significant extent, you can terminate without notice under § 543 Abs. 2 Nr. 1 BGB. In principle the condition is a deadline for a remedy that passed without result, or a formal warning.",
          "This is the sharpest step and comes into consideration only for serious defects — massive mould growth, say, or a heating failure lasting months. If a termination later turns out to be unjustified, you are liable for the damage.",
        ],
        note:
          "Before terminating without notice, take legal advice in any case. The consequences of getting it wrong are greater here than for any other step on this page.",
      },
      {
        heading: "Where to get support",
        bullets: [
          "Tenants' associations (Mieterverein): membership usually costs a low two-figure sum a year and includes legal advice. For disputes already running there is often a waiting period — which is why joining pays off before things catch fire.",
          "Legal expenses insurance with a tenancy law module: check the cover and report the case early.",
          "A lawyer specialising in tenancy law: fees for an initial consultation are capped by statute.",
          "Consumer advice centres (Verbraucherzentrale): they advise on tenancy questions for manageable fees.",
          "The public health office (Gesundheitsamt): with mould or vermin, an inspection on site can supply strong evidence.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much time do I have to give the landlord?",
        answer:
          "The deadline must be reasonable, and what is reasonable depends on the defect. For a heating failure in winter a few days are reasonable, for an extensive refurbishment several weeks. As a rule of thumb for the ordinary case, 14 days. Always set the deadline with a specific date.",
      },
      {
        question: "May I withhold the rent entirely?",
        answer:
          "Only where the flat is completely unusable, and that is a rare exception. In every other case the termination risk is considerable: from arrears of two months' rent the landlord may terminate without notice under § 543 Abs. 2 Nr. 3 BGB.",
      },
      {
        question: "What is the difference between reduction and retention?",
        answer:
          "A reduction lowers the rent owed for good — the landlord never sees that money. Retention is only provisional: you pay the amount over as soon as the defect is fixed. Its purpose is pressure, not saving. Both can be asserted side by side.",
      },
      {
        question: "Can I be evicted for filing a defect notice?",
        answer:
          "A termination purely because you assert your rights would be an impermissible reprisal. It only gets risky once you withhold too much and arrears build up — then the termination can be based on those. Hence: reduce conservatively and pay under protest.",
      },
      {
        question:
          "The landlord keeps sending tradespeople who change nothing. What then?",
        answer:
          "What counts is the condition of the flat, not the number of attempts. As long as the defect persists, so does the right to reduce. Document every appointment with date and outcome — that chronology is very telling in court.",
      },
      {
        question: "Do I have to make tradespeople's appointments possible?",
        answer:
          "Yes. After a reasonable announcement you must grant access for the defect to be remedied. Refusing can cost you your right to reduce, because the repair then fails because of you.",
      },
    ],
  },
};

export default en;
