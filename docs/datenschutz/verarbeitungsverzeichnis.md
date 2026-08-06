# Verzeichnis von Verarbeitungstätigkeiten (Art. 30 Abs. 1 DSGVO)

Interne Dokumentation. Nicht zur Veröffentlichung bestimmt — die Außendarstellung
ist die Datenschutzerklärung unter `/datenschutz`. Auf Verlangen der
Aufsichtsbehörde ist dieses Verzeichnis vorzulegen (Art. 30 Abs. 4 DSGVO).

**Stand:** Juli 2026 · **Nächste Prüfung:** bei jeder Änderung an Empfängern,
Datenarten oder Löschfristen

---

## Verantwortlicher

| | |
|---|---|
| Name | Animals of Cologne |
| Inhaber | Maximilian Marowsky |
| Anschrift | Holzgasse 8, 50676 Köln, Deutschland |
| E-Mail | info@animals-of-cologne.de |
| eBrief-Kundennummer | D01039646 |
| Datenschutzbeauftragter | nicht bestellt — die Voraussetzungen des § 38 Abs. 1 BDSG (mind. 20 Personen mit ständiger automatisierter Verarbeitung) liegen nicht vor |

Die Stammdaten werden aus `src/lib/site.ts` gepflegt; dort geändert, folgen
Impressum und strukturierte Daten automatisch.

---

## 1. Bereitstellung der Webseite (Server-Logs)

| | |
|---|---|
| **Zweck** | Auslieferung der Seite, Betriebssicherheit, Abwehr von Missbrauch |
| **Betroffene** | Besucher der Webseite |
| **Datenarten** | IP-Adresse, Zeitpunkt, angeforderte URL, User-Agent, Referrer |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. f DSGVO (Betrieb und Sicherheit) |
| **Empfänger** | Vercel Inc. (Hosting, Auftragsverarbeiter) |
| **Drittland** | USA; Auslieferung über die Region Frankfurt, EU-US Data Privacy Framework |
| **Löschfrist** | nach Vorgabe des Hosters, kurzfristig |
| **TOM** | TLS-Transportverschlüsselung, keine eigene Logspeicherung |

## 2. Reichweitenmessung

| | |
|---|---|
| **Zweck** | aggregierte Statistik über Seitenaufrufe |
| **Betroffene** | Besucher der Webseite |
| **Datenarten** | Seitenpfad, Referrer, grobe Herkunft, Gerätetyp — ohne Cookies, ohne Kennung |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. f DSGVO; keine Einwilligung nach § 25 Abs. 2 TDDDG erforderlich, da kein Zugriff auf Endgeräteinformationen |
| **Empfänger** | Vercel Inc. (Vercel Web Analytics) |
| **Löschfrist** | aggregiert, kein Personenbezug |

## 3. Erstellung der Mängelanzeige

| | |
|---|---|
| **Zweck** | Prüfung des Minderungsanspruchs, Berechnung der Quote, Erzeugung des Schreibens |
| **Betroffene** | Mieter (Nutzer), Vermieter (Dritte) |
| **Datenarten** | Name, Anschrift, Mietdaten, Mängelbeschreibungen, Unterschrift, Name und Anschrift des Vermieters |
| **Verarbeitung** | **vollständig im Browser des Nutzers.** Diese Daten erreichen den Server nicht und werden von uns nicht gespeichert. |
| **Rechtsgrundlage** | entfällt, soweit keine Verarbeitung durch den Verantwortlichen stattfindet |
| **Löschfrist** | keine Speicherung; die Daten leben nur im Speicher des Browsers |

Nur die folgenden Tätigkeiten 4 bis 7 lösen eine Übermittlung aus, und jede
davon erst auf aktive Handlung des Nutzers.

## 4. KI-gestützte Textverbesserung

| | |
|---|---|
| **Zweck** | sprachliche Glättung und Übersetzung der Mangelbeschreibung ins Deutsche |
| **Betroffene** | Mieter (Nutzer) |
| **Datenarten** | ausschließlich die Mangelbeschreibungen (Bezeichnung, Raum, Zeitraum, Freitext). **Nicht übermittelt:** Namen, Anschriften, Kontaktdaten, Unterschrift |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (angeforderte Leistung) |
| **Empfänger** | Google Ireland Limited (Gemini API, Auftragsverarbeiter) |
| **Drittland** | Irland (EU) |
| **Löschfrist** | keine eigene Speicherung; Google löscht API-Inhalte kurzfristig und nutzt sie nicht zum Training |
| **TOM** | Eingabebegrenzung (30 Mängel, 2 000 Zeichen), Fallback auf den Originaltext bei Fehler |

## 5. E-Mail-Verteiler

| | |
|---|---|
| **Zweck** | Versand von Neuigkeiten rund um das Thema Mietminderung |
| **Betroffene** | Nutzer, die aktiv zugestimmt haben |
| **Datenarten** | Name, E-Mail-Adresse, Zeitpunkt der Anmeldung |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) |
| **Empfänger** | Google Ireland Limited (Google Sheets) |
| **Löschfrist** | bis zum Widerruf der Einwilligung |
| **TOM** | Opt-in nicht vorausgewählt, Widerruf formlos per E-Mail |

## 6. Postversand der Mängelanzeige

| | |
|---|---|
| **Zweck** | Druck, Kuvertierung, Frankierung und postalische Zustellung des Schreibens |
| **Betroffene** | Mieter (Nutzer), Vermieter (Empfänger des Briefes) |
| **Datenarten** | vollständiger Brieftext, Name und Anschrift des Mieters, Name und Anschrift des Vermieters, E-Mail-Adresse für die Versandbestätigung, Unterschrift (Bilddatei) |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des Versandvertrags) |
| **Empfänger** | PIN AG, Alt-Moabit 91, 10559 Berlin (Auftragsverarbeiter, AVV nach Art. 28 DSGVO) |
| **Unterauftragnehmer** | BC Directgroup GmbH (Rigistr. 9, 12277 Berlin), Möller Druck & Verlag GmbH (Zeppelinstr. 9, 16356 Ahrensfelde), ODS – Office Data Service GmbH (Ehrenbergstr. 16A, 10245 Berlin) — sämtlich Druckdienstleister |
| **Drittland** | keines; Verarbeitung ausschließlich in EU/EWR (AVV Ziffer 2) |
| **Löschfrist** | unbezahlte Aufträge werden nach spätestens 24 Stunden automatisch gelöscht (`/api/cron/ebrief-cleanup`); versendete Aufträge löscht die PIN AG spätestens 28 Tage nach Beendigung der Leistungserbringung (AVV Ziffer 10 Abs. 2) |
| **TOM** | keine eigene Datenbank; Zugriff auf Auftragsdaten nur mit HMAC-Capability-Token; TOM der PIN AG nach Anlage 1 zum AVV (Stand 10.02.2026) |

**Keine Pseudonymisierung.** Namen und Anschriften müssen im Klartext
vorliegen, weil ein Brief andernfalls nicht zustellbar ist. So ausdrücklich
auch die TOM der PIN AG, Ziffer 1.4.

## 7. E-Mails zum Versandauftrag

Drei E-Mails, alle über denselben Weg und alle zum selben Auftrag:

1. **Bestellbestätigung**, unmittelbar nach der Zahlung.
2. **Zustellmeldung**, sobald die Post die Zustellung meldet — nur beim
   Einwurf-Einschreiben, weil nur dieses Produkt eine Sendungsverfolgung hat.
3. **Erinnerung** vierzehn Tage nach der Bestellung, mit Hinweisen zum weiteren
   Vorgehen. Keine Werbung, kein Newsletter, danach folgt nichts mehr.

| | |
|---|---|
| **Zweck** | Bestätigungspflicht aus § 312f Abs. 2 und 3 BGB; Nachweis über den Sendungsweg, für den der Nutzer beim Einwurf-Einschreiben ausdrücklich bezahlt hat; Hinweis auf den weiteren Verlauf der Mängelanzeige |
| **Betroffene** | zahlende Nutzer |
| **Datenarten** | E-Mail-Adresse aus dem Bezahlvorgang, Versandart, gezahlter Betrag, Vorgangsnummer; bei der Zustellmeldung zusätzlich Sendungsnummer, Verfolgungslink und Zeitpunkt der gemeldeten Zustellung. **Nicht enthalten:** Brieftext, Mängel, Anschrift des Vermieters, Unterschrift |
| **Rechtsgrundlage** | Bestellbestätigung: Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung), daneben lit. b. Zustellmeldung: Art. 6 Abs. 1 lit. b DSGVO — die Sendungsverfolgung ist Teil der bezahlten Leistung. Erinnerung: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse, den Nutzer über den weiteren Verlauf seines Vorgangs zu informieren); Widerspruch nach Art. 21 DSGVO formlos per E-Mail |
| **Empfänger** | Resend (Plus Five Five, Inc.), Versand über die Region Irland (`eu-west-1`) |
| **Drittland** | US-Unternehmen; Übermittlung gestützt auf Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO |
| **Löschfrist** | Versandprotokoll beim Anbieter für einen begrenzten Zeitraum; keine eigene Speicherung |
| **TOM** | keine Öffnungs- oder Klickverfolgung, kein Werbeversand, Absenderdomäne mit SPF und DKIM |

## 8. Zahlungsabwicklung

| | |
|---|---|
| **Zweck** | Einzug des Entgelts für den Postversand, Zuordnung der Zahlung zum Briefauftrag |
| **Betroffene** | zahlende Nutzer |
| **Datenarten** | beim Verantwortlichen nur: Zahlungsstatus, Betrag, Vorgangs- und Auftragsnummer, Nachweis der beiden Erklärungen nach § 356 Abs. 5 Nr. 2 BGB sowie zwei Vermerke darüber, welche der E-Mails aus Nummer 7 bereits versandt wurde. Zahlungsmittel werden unmittelbar bei Stripe eingegeben und erreichen uns nicht. |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO; für die Aufbewahrung Art. 6 Abs. 1 lit. c DSGVO i. V. m. §§ 147 AO, 257 HGB |
| **Empfänger** | Stripe Payments Europe, Limited, Dublin, Irland |
| **Drittland** | Übermittlung an die US-Muttergesellschaft möglich |
| **Löschfrist** | handels- und steuerrechtliche Aufbewahrungsfristen (6 bzw. 10 Jahre) |
| **TOM** | keine Zahlungsdaten im eigenen System; Weiterleitung auf die von Stripe gehostete Bezahlseite |

## 9. Widerruf über die Schaltfläche (§ 356a BGB)

Auf `/widerruf` steht eine Schaltfläche „Vertrag widerrufen“ bereit, über die
Nutzer den kostenpflichtigen Postversand online widerrufen können. Dazu sind
wir seit dem 19. Juni 2026 gesetzlich verpflichtet. Alternativ kann der
Widerruf jederzeit formlos per E-Mail an die Adresse des Verantwortlichen
erklärt werden; in diesem Fall verarbeiten wir nur, was die betroffene Person
darin selbst mitteilt.

| | |
|---|---|
| **Zweck** | Entgegennahme der Widerrufserklärung, die gesetzlich vorgeschriebene Bestätigung des Eingangs auf einem dauerhaften Datenträger und die Abwicklung des Widerrufs |
| **Betroffene** | Personen, die über die Schaltfläche oder formlos per E-Mail eine Widerrufserklärung zum Postversand abgeben. Die Route prüft weder eine vorherige Zahlung noch eine Bestellung (siehe `src/app/api/widerruf/route.ts`), sodass grundsätzlich jede Person eine Erklärung abgeben kann, unabhängig davon, ob tatsächlich bestellt oder bezahlt wurde |
| **Datenarten** | E-Mail-Adresse (Pflichtangabe, weil der Eingang bestätigt werden muss), auf freiwilliger Basis Name, Auftragsnummer und eine Anmerkung, sowie Zeitpunkt des Eingangs nach Datum und Uhrzeit. Beim formlosen Widerruf per E-Mail: was die betroffene Person darin selbst mitteilt |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. c DSGVO — rechtliche Verpflichtung aus § 356a BGB; soweit es um die Rückabwicklung des Vertrags geht, zusätzlich Art. 6 Abs. 1 lit. b DSGVO |
| **Empfänger** | Resend (Plus Five Five, Inc.) als Auftragsverarbeiter für den Versand beider E-Mails — der Meldung an uns und der Bestätigung an die widerrufende Person, siehe Nummer 7. Außerdem der E-Mail-Provider, über den das Postfach des Verantwortlichen läuft, weil die Meldung dort eingeht und die vollständige Erklärung samt Freitext-Anmerkung enthält (Anbieter noch zu benennen, siehe Offene Punkte). Keine Weitergabe an den Druckdienstleister oder an die Post |
| **Drittland** | Resend: US-Unternehmen; Übermittlung gestützt auf Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO. Für den E-Mail-Provider des Verantwortlichen-Postfachs noch offen, siehe Offene Punkte |
| **Löschfrist** | Die Erklärung erreicht uns als E-Mail und verbleibt im E-Mail-Postfach des Verantwortlichen, solange sie zum Nachweis der ordnungsgemäßen Abwicklung benötigt wird — praktisch für die Dauer der handels- und steuerrechtlichen Aufbewahrungsfristen. Keine gesonderte Datenbank, kein Datensatz in der Anwendung selbst |
| **TOM** | keine Weitergabe an den Druckdienstleister oder die Post; Verarbeitung getrennt vom Druckauftrag |

---

## Allgemeine technisch-organisatorische Maßnahmen

- Keine eigene Datenbank; es besteht kein Datenbestand über einzelne Vorgänge.
- Übertragung ausschließlich über TLS.
- Zugriff auf Auftrags- und Dokumentendaten nur mit HMAC-signiertem
  Capability-Token, nicht über die fortlaufende Auftragsnummer.
- Ratenbegrenzung auf allen Schnittstellen, die Dritte ansprechen.
- Datenminimierung: an die KI-Schnittstelle gehen ausschließlich
  Mangelbeschreibungen, keine identifizierenden Daten.
- Mit allen Auftragsverarbeitern bestehen Verträge nach Art. 28 DSGVO.

## Offene Punkte

- [ ] AVV mit der PIN AG unterzeichnen — bis dahin kein Live-Versand
- [ ] **Absenderdomäne für Transaktionsmails festlegen** (betrifft die
      Bestellbestätigung nach § 312f BGB). Empfang und Versand sind zwei
      Probleme: Für den Versand braucht die gewählte Domain SPF, DKIM und
      DMARC beim Mailanbieter, sonst landen Bestätigungen im Spam — und eine
      Bestätigung, die nicht ankommt, erfüllt die Pflicht nicht.
- [ ] Prüfen, ob der Auftragsverarbeitungsvertrag mit Google (Gemini, Sheets)
      in unterzeichneter Fassung vorliegt
- [ ] Prüfen, ob mit Vercel ein DPA abgeschlossen ist
- [ ] Nach Aufnahme des Live-Betriebs die tatsächlichen Löschfristen der
      PIN AG gegen Ziffer 10 des AVV verifizieren
- [ ] **E-Mail-Provider des Verantwortlichen-Postfachs benennen** (betrifft
      Nummer 9, Widerruf über die Schaltfläche). `POST /api/widerruf` schickt
      die Meldung über jede eingehende Widerrufserklärung — samt vollständiger
      Erklärung und Freitext-Anmerkung — an die Adresse des Verantwortlichen.
      Der Anbieter dieses Postfachs ist damit Empfänger personenbezogener
      Daten, ist aber bisher nicht benannt. Anbieter ermitteln, in Nummer 9
      unter Empfänger und Drittland eintragen und, falls es sich um einen
      Auftragsverarbeiter handelt, einen AVV nach Art. 28 DSGVO abschließen
