# Anwaltliche Prüfung: Widerrufsrecht seit dem 19.6.2026

| | |
|---|---|
| **Auftraggeber** | Animals of Cologne GbR, Holzgasse 8, 50676 Köln — vertreten durch die Gesellschafter Maximilian Marowsky, Paul Ohm und Philipp Weiß |
| **Dienst** | mietminderung-online.de |
| **Vorhaben** | Umstellung des Widerrufsrechts auf § 356 Abs. 5 Nr. 2 BGB (zwei getrennte Erklärungen) und § 356a BGB (Widerrufsbutton) |
| **Stand** | 6. August 2026 |
| **Status** | umgesetzt, noch nicht ausgeliefert — die Prüfung soll vor dem Livegang erfolgen |

**Dieses Dokument steht für sich.** Sämtliche Texte, um die es geht, sind im
Anhang vollständig abgedruckt, einschließlich der Bestätigungs-E-Mail nach
§ 356a Abs. 4 BGB in der Fassung, die der Verbraucher erhält. Ein Blick in das
Repository ist zur Beantwortung der Fragen nicht erforderlich; die Fundstellen
in Abschnitt A.10 dienen nur der Nachvollziehbarkeit.

**Was gefragt ist.** Zu jeder Frage eine Ja/Nein-Bewertung mit kurzer
Begründung — kein Gutachten. Wo etwas nicht trägt, ist ein Formulierungsvorschlag
für die tragfähige Fassung nützlicher als eine Warnung.

**Warum der Aufwand.** Nach **EuGH C-97/22** kostet eine fehlerhafte
Widerrufsbelehrung die *gesamte* Vergütung: Die Leistung ist erbracht, das Geld
muss zurück, Wertersatz ist nicht geschuldet. Anders als bei einer Abmahnung
steht hier jeder einzelne Umsatz auf dem Spiel. Das ist der Grund, warum diese
Prüfung Teil der Änderung ist und nicht ihr Nachtrag.

**Wo wir schon recherchiert haben,** sagen wir es und nennen die Quelle, damit
keine Arbeit doppelt gemacht wird. Diese Vorarbeit ersetzt die eigene Prüfung
ausdrücklich nicht — sie soll sie nur abkürzen. Insbesondere ist der
Gesetzeswortlaut in der seit dem 19.6.2026 geltenden Fassung von uns **nicht**
gegen eine autoritative Quelle verifiziert worden (siehe Abschnitt 7).

---

## 1. Was der Dienst tut

Mietminderung-online.de hilft Mietern, eine Mängelanzeige an den Vermieter zu
erstellen und zu versenden.

**Kostenlos, ohne Registrierung, ohne Vertragsschluss gegen Entgelt:**

- die Prüfung, ob ein Minderungsanspruch besteht,
- die Berechnung der Minderungsquote,
- die Erstellung des Anschreibens einschließlich Unterschrift,
- der Download des fertigen Schreibens als PDF.

Diese Funktionen laufen vollständig im Browser des Nutzers ab. Wer das Schreiben
herunterlädt und selbst zur Post bringt, zahlt nichts, und es gibt nichts zu
widerrufen.

**Kostenpflichtig ist genau eine Leistung: der Postversand der Mängelanzeige.**
Der Nutzer wählt zwischen zwei Produkten:

| Produkt | Preis (Endpreis) |
|---|---|
| Mängelanzeige als Brief | 2,49 € |
| Mängelanzeige als Einwurf-Einschreiben | 6,99 € |

Der Betreiber ist Kleinunternehmer nach § 19 UStG; die Preise werden ohne
Umsatzsteuerausweis angegeben.

**Wofür das Geld gezahlt wird.** Der Brieftext wird an einen Druckdienstleister
übergeben, dort gedruckt, kuvertiert und frankiert; die Zustellung übernimmt
anschließend die PIN AG (eBrief). Der Nutzer zahlt für Druck, Kuvertierung,
Frankierung und Zustellung — nicht für die Erstellung des Schreibens, die frei
ist. Der Auftrag geht **unmittelbar nach der Zahlung** in den Druck; in aller
Regel ist die Leistung binnen Stunden vollständig erbracht.

**Absender bleibt der Mieter.** Der Brief geht im Namen des Mieters an den
Vermieter, mit dessen Anschrift und dessen Unterschrift. Der Betreiber tritt
nicht als Absender auf, gibt keine Erklärung im Namen des Mieters ab und leistet
keine Rechtsdienstleistung — er befördert ein Schriftstück, das der Nutzer selbst
verfasst hat.

**Keine Datenbank.** Der Dienst speichert keine Vorgangsdaten. Die Bestellakte
ist die Stripe-Zahlung mit ihren Metadaten; alles andere lebt nur im Browser des
Nutzers oder beim Druckdienstleister. Das ist für Abschnitt 3 erheblich.

---

## 2. Die beiden Erklärungen (§ 356 Abs. 5 Nr. 2 BGB)

Bis zum 18.6.2026 stand im Code eine einzige kombinierte Zustimmung, und alle
Texte zitierten § 356 Abs. 4 BGB. Das ist ersetzt worden.

### Wie es jetzt aussieht

Unmittelbar über dem Bestellbutton stehen **zwei getrennte Kästchen**, jedes mit
einer eigenen Erklärung:

> **lit. a — ausdrückliches Verlangen**
>
> Ich verlange ausdrücklich, dass Sie mit dem Druck und dem Versand meiner
> Mängelanzeige vor Ablauf der Widerrufsfrist beginnen.

> **lit. c — Kenntnis vom Erlöschen**
>
> Mir ist bekannt, dass mein Widerrufsrecht erlischt, sobald Sie die Leistung
> vollständig erbracht haben — sobald der Brief also gedruckt und in die
> Zustellung gegeben ist. Diese Kenntnis bestätige ich hiermit.

Dazu:

- **Keines der Kästchen ist vorbelegt.** Beide starten leer, und es gibt keinen
  Codepfad, der sie automatisch setzt. Eine vorangekreuzte Erklärung wäre keine
  Erklärung.
- **Der Bestellbutton ist gesperrt, solange nicht beide gesetzt sind.** Ohne
  beide Häkchen lässt sich der Bezahlvorgang nicht starten.
- **Die Serverseite prüft beide noch einmal.** Die Checkout-Route verlangt für
  jedes Feld strikt den Wert `true` und weist die Anfrage sonst zurück. Sie kann
  eine manipulierte Anfrage nicht verhindern — die Angaben kommen in beiden
  Fällen vom Client —, aber sie macht die Erklärungen zur dokumentierten
  Voraussetzung der Bestellung.
- **Beide werden in der Bestellakte vermerkt.** Weil es keine Datenbank gibt,
  ist die Stripe-Zahlung die Bestellakte. In ihren Metadaten stehen zwei
  getrennte Einträge, `widerrufVerlangen: "356-5-2-a-BGB"` und
  `widerrufErloeschen: "356-5-2-c-BGB"`. Zwei Einträge und nicht einer, weil es
  zwei Erklärungen sind und jede für sich beweisbar sein muss.
- **Der Vermerk ist ein Fixwert, kein Zeitstempel.** Die Zahlungssitzung wird
  nur angelegt, nachdem die Prüfung beider Erklärungen bestanden ist — das
  Vorhandensein der beiden Einträge ist also der Nachweis. Auf einen eigenen
  Zeitstempel wurde verzichtet, weil Stripe einen wiederverwendeten
  Idempotency-Key mit abweichenden Parametern zurückweist und jeder legitime
  Wiederholungsversuch dann fehlschlüge. Das „wann“ beantwortet die
  Erstellungszeit der Zahlungssitzung; die Erklärungen liegen Sekunden davor.
- **Die Bestellbestätigung nimmt beide Erklärungen auf.** Sie enthält den Satz
  aus Anhang A.5 („Sie haben vor der Bestellung ausdrücklich verlangt … und davon
  getrennt bestätigt …“) und ist damit die Bestätigung auf dauerhaftem
  Datenträger nach § 312f Abs. 2 BGB.
- **Die Kästchen tragen dieselbe Gestaltung.** Sie sind aus einer Komponente
  gebaut, damit nicht eines optisch zur eigentlichen Erklärung und das andere
  zum Kleingedruckten wird.

### Frage 2.1

**Genügen die beiden Erklärungen in dieser Fassung den Anforderungen des § 356
Abs. 5 Nr. 2 lit. a und lit. c BGB?** Insbesondere: Ist das Verlangen nach lit. a
hinreichend „ausdrücklich“, und ist die Kenntnisbestätigung nach lit. c so
gefasst, dass das Erlöschen tatsächlich eintritt?

### Frage 2.2

**Genügt der Nachweis in den Stripe-Metadaten?** Zwei Fixwerte in der
Zahlungsakte, gesetzt erst nachdem beide Erklärungen geprüft wurden — reicht das
als Dokumentation, oder verlangt die Beweislage einen Vermerk mit eigenem
Zeitstempel oder dem Wortlaut der Erklärung? Falls Letzteres: Wir können den
Wortlaut in die Metadaten aufnehmen, sind aber auf 500 Zeichen je Eintrag und
50 Einträge beschränkt; ein Verweis auf eine versionierte Textfassung wäre die
Alternative.

---

## 3. Die Belehrung

Die Widerrufsbelehrung steht wörtlich in Anhang A.4. Sie wird an genau zwei
Stellen ausgegeben und beide lesen dieselbe Quelle, damit sie nicht
auseinanderlaufen können:

1. auf der Seite `/widerruf`, die der Nutzer vor der Bestellung erreicht (aus
   dem Fußbereich und aus einem Link direkt über dem Bestellbutton), und
2. in der Bestellbestätigungs-E-Mail, zusammen mit dem
   Muster-Widerrufsformular (Anhang A.7) und dem Erlöschenshinweis (Anhang A.5).

Gegenüber der bisherigen Fassung neu ist ein Absatz, der auf die Schaltfläche
nach § 356a BGB hinweist:

> Sie können Ihr Widerrufsrecht auch online ausüben: über die Schaltfläche
> „Vertrag widerrufen“ unter mietminderung-online.de/widerruf. Wir bestätigen
> Ihnen den Eingang unverzüglich per E-Mail; die Bestätigung enthält den Inhalt
> Ihrer Widerrufserklärung sowie Datum und Uhrzeit ihres Eingangs.

Die Adresse steht als fester Text und wird nicht aus der Umgebungskonfiguration
gebildet — eine Belehrung, die in einer E-Mail eine Vorschau-Domain nennt, führt
den Verbraucher an eine Adresse, die es später nicht mehr gibt.

Was die Belehrung **nicht** tut: Sie beruft sich nicht auf den Ausschluss nach
§ 312g Abs. 2 Nr. 1 BGB (Anfertigung nach Kundenspezifikation). Diese Ausnahme
gilt für Waren, nicht für Dienstleistungen; sie hier zu nennen wäre nach unserem
Verständnis selbst eine fehlerhafte Belehrung. Ein automatischer Test hält das
fest.

### Der Wertersatz-Absatz — eine bewusste Entscheidung, die wir offenlegen

Der letzte Absatz der Belehrung ist der amtliche Mustertext zum anteiligen
Wertersatz:

> Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen
> soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der
> bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts
> hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen
> im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen
> entspricht.

**Warum er drin steht.** Er ist Bestandteil des amtlichen Musters, und er hat
einen Anwendungsbereich: die Zeitspanne zwischen dem Vertragsschluss und der
vollständigen Erbringung. In dieser Spanne — praktisch Minuten bis Stunden — ist
ein Widerruf möglich, und dann stellt sich die Wertersatzfrage tatsächlich.

**Warum die Frage sich stellt.** Das Schwesterprojekt
`widerspruch-krankengeld.de`, das von Anfang an auf der neuen Rechtslage gebaut
ist, **lässt diesen Absatz weg**. Wir haben die Abweichung nicht stillschweigend
angeglichen, sondern sie ausdrücklich zur Frage gemacht — in beide Richtungen
gibt es ein Argument, und wir haben keines davon prüfen können.

### Frage 3.1

**Trägt die Belehrung als Ganzes?** Frist, Fristbeginn, Adressat, Form der
Erklärung, Folgen des Widerrufs, Hinweis auf den Button — ist etwas fehlerhaft
oder fehlt etwas?

### Frage 3.2

**Gehört der Wertersatz-Absatz in diese Belehrung?** Drei Antworten sind
denkbar, und wir bitten um eine davon:

1. **Ja, er muss drin bleiben** — dann bleibt alles wie es ist.
2. **Nein, er muss weg** — dann streichen wir ihn; bitte begründen, ob das
   Weglassen eines amtlichen Musterabsatzes seinerseits ein Belehrungsmangel
   sein kann.
3. **Er darf bleiben, ist aber missverständlich** — dann bitten wir um eine
   Formulierung, die den Absatz mit dem Erlöschen nach § 356 Abs. 5 Nr. 2 BGB in
   Einklang bringt, etwa als Klarstellung, dass Wertersatz nur für den Zeitraum
   vor der vollständigen Erbringung in Betracht kommt.

---

## 4. Der Widerrufsbutton (§ 356a BGB)

Der Button hat bisher vollständig gefehlt. Er ist neu.

### Platzierung

Die Schaltfläche „Vertrag widerrufen“ steht **ganz oben auf `/widerruf`** — im
ersten Abschnitt der Seite, vor der Erläuterung, wofür die Belehrung gilt, und
vor der Belehrung selbst.

**`/widerruf` ist aus dem Fußbereich jeder Seite des Dienstes verlinkt.** Was die
Schaltfläche im Sinne des Abs. 1 ständig verfügbar macht, ist genau das: Sie
steht oben auf `/widerruf`, und von überall führt ein Fußbereichslink dorthin.

**Wie es dazu kam — offengelegt, weil die Lücke bis in diese Änderung hinein
bestand.** Der Dienst hat zwei Fußbereiche. Der eine erscheint auf der
Startseite mit dem gesamten Bestell- und Bezahlablauf, auf der FAQ-Seite, auf
der Ergebnisseite nach der Zahlung und auf allen Rechtstextseiten; er führte den
Widerrufslink von Anfang an. Der zweite, statische Fußbereich der sieben
redaktionellen Seiten (`/mietminderung`, `/mietminderung/…`,
`/mietminderungstabelle`, `/ratgeber`, `/ratgeber/…`,
`/maengelanzeige-versenden`) führte dagegen nur drei der vier Rechtstexte —
Impressum, Datenschutz und Nutzungsbedingungen — und ließ den Widerruf aus. Von
diesen Seiten aus war `/widerruf` also nicht über den Fußbereich erreichbar; nur
`/maengelanzeige-versenden` hatte einen Link im Seitentext.

Das ist beim Schreiben dieses Dokuments aufgefallen und **als Teil dieser
Änderung behoben worden**: Der zweite Fußbereich trägt jetzt denselben Link
(„Widerrufsrecht“ → `/widerruf`). Vier automatische Tests laden je eine der
betroffenen Seiten, klicken den Link in deren Fußbereich und prüfen, dass man auf
`/widerruf` landet und dort die Schaltfläche „Vertrag widerrufen“ vorfindet.

Neben der Schaltfläche steht ein Satz, dass das Widerrufsrecht erloschen ist,
wenn die Mängelanzeige bereits zur Post gegeben wurde, sowie ein Hinweis, dass
ein formloser Widerruf per E-Mail ebenso wirksam ist. Die E-Mail-Adresse steht im
serverseitig gerenderten Text, damit auch bei abgeschaltetem JavaScript ein
funktionierender Widerrufsweg auf der Seite steht — die Schaltfläche selbst
funktioniert dann nicht.

### Beschriftungen

Beide gesetzlich vorgegebenen Beschriftungen werden **wörtlich und unverändert**
verwendet:

- die Schaltfläche, die das Formular öffnet: **„Vertrag widerrufen“**
- die Schaltfläche, die das Formular abschließt: **„Widerruf bestätigen“**

Sie werden nicht umformuliert, weder aus stilistischen Gründen noch für andere
Sprachfassungen — die Seite ist durchgängig deutsch.

### Das Formular

| Angabe | Pflicht | Warum |
|---|---|---|
| E-Mail-Adresse | ja | Kontaktweg nach Abs. 2 und die Adresse, an die die Bestätigung geht |
| Name | nein | in Abs. 2 genannt, aber ein Widerruf darf nicht daran scheitern |
| Auftragsnummer | nein | dient nur der Zuordnung; steht in der Bestellbestätigung |
| Anmerkung (Freitext) | nein | freiwillig, auf 500 Zeichen begrenzt |

Geprüft wird nur, ob die E-Mail-Adresse ein „@“ enthält. Das ist Absicht: Ein
Widerruf ist eine einseitige empfangsbedürftige Erklärung, und ihn an einer
fehlenden Auftragsnummer scheitern zu lassen wäre falsch. Die Kehrseite ist, dass
die Route weder eine Bestellung noch eine Zahlung prüft — grundsätzlich kann
jede Person eine Erklärung abgeben.

**Die Vertragsbezeichnung nach Abs. 2 wird angezeigt, nicht abgefragt.** Im
Formular steht sichtbar „Vertrag: Postversand der Mängelanzeige“. Es gibt genau
eine kostenpflichtige Leistung; den Verbraucher nach ihrer Bezeichnung zu fragen
wäre eine Frage mit genau einer richtigen Antwort und einer Gelegenheit, sie
falsch zu geben. Derselbe Wortlaut steht in der Bestätigung.

### Die Bestätigung nach Abs. 4

Nach Absenden geschieht Folgendes:

1. Der Eingangszeitpunkt wird in **deutscher Ortszeit** festgehalten, mit
   Zeitzonenangabe (z. B. `06.08.2026, 11:12 MESZ`). Der Server läuft in UTC;
   ohne ausdrückliche Zeitzone wäre die Uhrzeit im Sommer zwei Stunden daneben,
   was an einer Fristgrenze keine Kleinigkeit ist.
2. **Zuerst** geht eine Meldung an das Postfach des Betreibers. Diese E-Mail ist
   der Eingangsnachweis. Scheitert sie, bricht der Vorgang mit einem Fehler ab
   und der Nutzer wird angewiesen, stattdessen eine E-Mail zu schreiben — die als
   Erklärung genauso wirksam ist.
3. **Danach** geht die Bestätigung an die widerrufende Person. Ihr Wortlaut steht
   vollständig in Anhang A.8.

Die Bestätigung enthält:

- den **Inhalt der Widerrufserklärung im Wortlaut** („Hiermit widerrufe ich den
  von mir abgeschlossenen Vertrag über den Postversand der Mängelanzeige.“) —
  vollständig zurückgegeben und nicht nur bestätigt, weil der Verbraucher auf
  dieser E-Mail später belegen können muss, was er erklärt hat,
- **Datum und Uhrzeit des Eingangs**,
- die Vertragsbezeichnung und die vom Nutzer gemachten Angaben,
- einen Absatz dazu, was nun geschieht, ohne eine Erstattung zu versprechen, die
  möglicherweise nicht geschuldet ist,
- die Aufforderung, die E-Mail aufzubewahren, mit Nennung von § 356a Abs. 4 BGB.

Sie wird als HTML **und** als Textteil verschickt; eine Bestätigung, die in einem
strengen Mailclient als leeres Rechteck ankommt, ist nicht zur Verfügung gestellt
worden.

**Offengelegte Schwäche.** Scheitert der Versand der Bestätigung an die
widerrufende Person, gilt der Widerruf gleichwohl als wirksam eingegangen; die
Anwendung meldet dem Nutzer keinen Fehler, sondern protokolliert nur intern. Der
Betreiber hat die Erklärung dann aus Schritt 2 und kann von Hand nachfassen. In
der Oberfläche steht in diesem Fall dennoch, dass eine Bestätigung per E-Mail
folgt.

### Frage 4.1

**Genügt die Platzierung dem „ständig verfügbar“ und „hervorgehoben und gut
lesbar“ des § 356a Abs. 1 BGB?** Konkret: Reicht es, dass jede Seite im
Fußbereich auf `/widerruf` verlinkt und die Schaltfläche dort das erste Element
ist — oder verlangt die Vorschrift die Schaltfläche selbst auf jeder Seite statt
eines Links zu ihr? Falls Letzteres, bitten wir um einen Hinweis, ob eine
dauerhaft eingeblendete Schaltfläche im Fußbereich gemeint ist oder etwas
anderes.

### Frage 4.2

**Genügt die Bestätigung dem § 356a Abs. 4 BGB** nach Inhalt und Form (Anhang
A.8)? Ist die E-Mail ein dauerhafter Datenträger im Sinne der Norm, oder ist
mehr verlangt?

### Frage 4.3

**Ist es zulässig, die Vertragsbezeichnung anzuzeigen statt abzufragen?**

### Frage 4.4

**Muss der Ausfall der Bestätigungs-E-Mail behandelt werden?** Wenn die
Bestätigung nicht zugestellt werden kann, ist die Pflicht aus Abs. 4 nicht
erfüllt, der Widerruf aber wirksam. Genügt eine manuelle Nachbearbeitung durch
den Betreiber, oder muss die Anwendung dem Nutzer den Fehlschlag anzeigen?

---

## 5. Offene Fragen

Diese sechs Punkte sind uns bei der Umsetzung aufgefallen und im Code nicht
entschieden worden. Sie wiegen so schwer wie die Abschnitte davor.

### 5.1 Preisaufspaltung nach EuGH C-641/19

Das Schwesterprojekt `widerspruch-krankengeld.de` **spaltet das Entgelt
vertraglich auf** in einen Anteil für die Erstellung und einen Anteil für das
Porto. Dieses Projekt tut das nicht: Der Nutzer zahlt einen Endpreis (2,49 € bzw.
6,99 €) für „Postversand der Mängelanzeige“, ohne dass Vorbereitung und
Beförderung getrennt ausgewiesen werden.

Der Hintergrund ist der Wertersatz nach Widerruf. Nach **EuGH C-641/19** ist der
Wertersatz grundsätzlich zeitanteilig nach dem vereinbarten Gesamtpreis zu
berechnen, wenn der Vertrag keine andere, transparent vereinbarte Aufteilung
vorsieht — eine Aufspaltung im Vertrag kann also darüber entscheiden, was bei
einem Widerruf mitten in der Ausführung verlangt werden kann.

**Frage:** Sollte der Preis auch hier vertraglich in Vorbereitung und Porto
aufgespalten werden? Falls ja, bitten wir um eine Formulierung für die
Nutzungsbedingungen und die Produktbeschreibung und um einen Hinweis, ob die
Aufteilung auf der Bezahlseite sichtbar sein muss. Falls nein, genügt uns die
Feststellung, dass der Einheitspreis unschädlich ist — angesichts der Beträge und
der Tatsache, dass das Erlöschen praktisch binnen Stunden eintritt.

### 5.2 Rückwirkung für Verkäufe seit dem 19.6.2026

Der Dienst ist live und hat seit dem 19.6.2026 Bestellungen angenommen. Für
diese Verkäufe gilt die **alte** Belehrung: eine kombinierte Zustimmung statt
zweier Erklärungen, durchgehend § 356 Abs. 4 BGB zitiert, kein Widerrufsbutton.
Diese Änderung wirkt nicht zurück — die Bestellbestätigungen sind verschickt, die
Stripe-Metadaten tragen den alten Vermerk `widerrufZustimmung: "356-4-BGB"`.

**Frage:** Was folgt daraus?

- Ist bei diesen Verträgen das Widerrufsrecht nicht erloschen, sodass die
  Widerrufsfrist noch läuft oder nach § 356 Abs. 3 BGB verlängert ist?
- Droht der vollständige Vergütungsverlust nach EuGH C-97/22 für jeden dieser
  Umsätze?
- Sollten die betroffenen Kunden nachbelehrt werden, und wenn ja: mit welchem
  Text und mit welcher Rechtsfolge? Die Kunden sind über die Stripe-Zahlungen
  mit E-Mail-Adresse erreichbar; der Umsatz in diesem Zeitraum ist gering.
- Ist eine kommentarlose Erstattung der betroffenen Beträge die sauberere
  Lösung als eine Nachbelehrung?

### 5.3 Beschriftung des Bestätigungsknopfes während der Übermittlung

Während die Anfrage läuft, behält der Knopf die Beschriftung **„Widerruf
bestätigen“**; der Wartezustand wird durch einen Ladekreis und `aria-busy`
angezeigt. Eine frühere Fassung tauschte die Beschriftung gegen „Einen Moment …“
aus.

Gewählt wurde die konservative Lesart: Wenn Abs. 3 diese Beschriftung vorschreibt,
soll der Knopf sie tragen — auch auf einem Bildschirmfoto, das mitten in der
Übermittlung entsteht. Ein automatischer Test hält das fest.

**Frage:** Ist das erforderlich, oder darf die Beschriftung während der
Übermittlung durch einen Wartetext ersetzt werden? Die Antwort hat keine
praktische Folge außer der, dass wir wissen, wie streng die Vorgabe zu lesen ist
— sie beeinflusst aber, wie wir künftig mit den vorgeschriebenen Beschriftungen
umgehen.

### 5.4 IP-Adresse zur Ratenbegrenzung, nicht in der Datenschutzerklärung

`POST /api/widerruf` sowie die vier Versandrouten (`vorbereiten`, `status`,
`adressvorschau`, `checkout`) begrenzen die Zahl der Anfragen je IP-Adresse. Die
Adresse wird dazu aus dem `X-Forwarded-For`-Header gelesen und im Arbeitsspeicher
der Instanz als Schlüssel gehalten, zusammen mit den Zeitstempeln der
akzeptierten Anfragen; sie wird nicht dauerhaft gespeichert und nicht
weitergegeben.

**In der Datenschutzerklärung ist das nirgends offengelegt.** Dort wird die
Verarbeitung von IP-Adressen ausschließlich dem Hoster zugeschrieben
(Server-Logs, Art. 6 Abs. 1 lit. f DSGVO) sowie der Reichweitenmessung, die
daraus einen täglich wechselnden Hashwert bildet. Dass der Verantwortliche selbst
IP-Adressen zur Missbrauchsabwehr verarbeitet, steht nicht da. Auch im
Verzeichnis der Verarbeitungstätigkeiten taucht die Ratenbegrenzung nur unter den
allgemeinen technisch-organisatorischen Maßnahmen auf, nicht als eigene
Verarbeitung.

Das ist **kein neuer Befund dieser Änderung** — die vier Versandrouten begrenzen
schon länger so. Die Widerrufsroute macht es nur zu einem Punkt, der mitgeprüft
werden sollte, weil sie eine gesetzlich vorgeschriebene Funktion ist.

**Frage:** Muss die Datenschutzerklärung um einen Absatz zur Ratenbegrenzung
ergänzt werden, und wenn ja: mit welcher Rechtsgrundlage und welcher
Speicherdauerangabe? Ein Formulierungsvorschlag wäre uns lieber als eine
Feststellung.

### 5.5 E-Mail-Provider des Betreiberpostfachs

Die Meldung über jeden eingehenden Widerruf geht — samt vollständiger Erklärung
und Freitext-Anmerkung — an `info@animals-of-cologne.de`. Der Anbieter, der
dieses Postfach betreibt, ist damit **Empfänger personenbezogener Daten**. Er ist
im Verzeichnis der Verarbeitungstätigkeiten nicht benannt, und ob mit ihm ein
Auftragsverarbeitungsvertrag nach Art. 28 DSGVO besteht oder bestehen muss, ist
ungeklärt. Der Punkt ist in
`docs/datenschutz/verarbeitungsverzeichnis.md` als offener Punkt vermerkt; die
Datenschutzerklärung sagt an der Stelle, dass der Anbieter benannt wird, sobald
die Frage geklärt ist.

**Frage:** Ist ein AVV erforderlich, oder ist der Provider eines gewöhnlichen
Geschäftspostfachs unter den üblichen Bedingungen kein Auftragsverarbeiter?
Genügt die vorläufige Formulierung in der Datenschutzerklärung bis zur Klärung,
oder muss der Anbieter vor dem Livegang benannt sein?

### 5.6 Die sechs nichtdeutschen Übersetzungen der beiden Erklärungen

Die Oberfläche gibt es in sieben Sprachen (de, en, tr, uk, ru, ar, pl). Die
beiden Erklärungen aus Abschnitt 2 sind in alle sieben übersetzt — die
Übersetzungen stehen vollständig in Anhang A.9.

**Sie sind ohne muttersprachliche Prüfung entstanden.** Das sind rechtlich
wirkende Erklärungen, keine Oberflächenbeschriftungen.

Der gewählte Rahmen: Die deutsche Fassung ist die verbindliche, und die Seite
sagt das. Alle Rechtstexte — Widerrufsbelehrung, Muster-Widerrufsformular,
Impressum, Datenschutzerklärung, Nutzungsbedingungen — bleiben in jeder
Sprachfassung deutsch, und wer sie in einer anderen Sprache aufruft, bekommt
darüber den Hinweis: „Diese rechtlichen Informationen sind ausschließlich auf
Deutsch verfügbar, da nur die deutsche Fassung rechtsverbindlich ist.“ Die
Übersetzungen der beiden Kästchen sind eine Lesehilfe.

**Frage:** Trägt dieser Rahmen? Kann sich ein Verbraucher, der die Bestellung in
türkischer Sprache abgeschlossen hat, wirksam auf die deutsche Fassung der
Erklärung verpflichten lassen — oder muss die Erklärung, die er ankreuzt, in
seiner Sprache verbindlich sein? Falls Letzteres, brauchen wir eine
muttersprachliche Prüfung aller sechs Fassungen vor dem Livegang, und die
Übersetzungen im Anhang wären der Ausgangspunkt.

---

## 6. Was wir bereits recherchiert haben

Damit keine Arbeit doppelt gemacht wird — mit dem ausdrücklichen Vorbehalt, dass
nichts davon Ihre eigene Prüfung ersetzt:

| Punkt | Was wir angenommen haben | Quelle unserer Annahme |
|---|---|---|
| Seit dem 19.6.2026 ist die einschlägige Norm § 356 Abs. 5 Nr. 2 BGB, vorher § 356 Abs. 4 BGB | übernommen | Vorgabe des Auftraggebers; Schwesterprojekt `widerspruch-krankengeld.de` |
| Die Norm verlangt zwei getrennte Erklärungen (lit. a und lit. c), eine kombinierte genügt nicht | übernommen | wie vor |
| § 356a BGB verlangt seit dem 19.6.2026 eine Schaltfläche „Vertrag widerrufen“ und eine abschließende Schaltfläche „Widerruf bestätigen“ | übernommen, Beschriftungen wörtlich | wie vor |
| § 356a Abs. 4 BGB verlangt in der Bestätigung den Inhalt der Erklärung sowie Datum und Uhrzeit des Eingangs | umgesetzt | wie vor |
| Fehlerhafte Belehrung → vollständiger Vergütungsverlust | Grund für dieses Dokument | EuGH C-97/22 |
| Wertersatz zeitanteilig nach Gesamtpreis, sofern nichts anderes transparent vereinbart | als offene Frage 5.1 vermerkt, nicht umgesetzt | EuGH C-641/19 |
| § 312g Abs. 2 Nr. 1 BGB (Kundenspezifikation) trägt hier nicht, weil er Waren betrifft | Ausnahme wird nicht in Anspruch genommen | eigene Einschätzung |
| Die Pflicht zur Schaltfläche gilt auch, wenn das Widerrufsrecht binnen Minuten erlischt | umgesetzt | eigene Einschätzung: die Pflicht knüpft an die Möglichkeit des Widerrufs, nicht an seine Wahrscheinlichkeit |

---

## 7. Was wir nicht geprüft haben

**Der Gesetzesstand ist von uns nicht verifiziert worden.** Der Wortlaut des
§ 356 Abs. 5 Nr. 2 BGB und des § 356a BGB in der seit dem 19.6.2026 geltenden
Fassung wurde während der Umsetzung **nicht gegen eine autoritative Quelle
abgeglichen**. Die Umsetzung folgt der Angabe des Auftraggebers und dem
Schwesterprojekt `widerspruch-krankengeld.de`. Wenn eine der Annahmen aus
Abschnitt 6 falsch ist, ist die Umsetzung an dieser Stelle falsch — auch dann,
wenn sie in sich schlüssig aussieht. Das ist der erste Punkt, um den wir bitten.

**Kein automatisierter Test deckt `POST /api/widerruf` selbst ab.** Das
Repository hat überhaupt keine Tests für API-Routen — das ist kein Versäumnis
dieser Änderung, sondern der Stand des Projekts. Abgedeckt sind:

- die Texte selbst, durch Modultests (`src/lib/widerrufstext.test.ts`): dass
  § 356 Abs. 5 Nr. 2 zitiert wird und § 356 Abs. 4 **nirgends**, dass die beiden
  Erklärungen nicht identisch sind, dass die Belehrung Frist, Fristbeginn,
  Adressat, die Schaltfläche und die Zusage „Datum und Uhrzeit“ nennt, und dass
  die Kundenspezifikations-Ausnahme nicht in Anspruch genommen wird;
- der Zeitstempel in deutscher Ortszeit, an festen UTC-Zeitpunkten
  (`src/lib/datum.test.ts`);
- die Bestätigungs-E-Mail, durch Modultests
  (`src/lib/email/templates.test.ts`);
- das Verhalten im Browser, durch Playwright (`e2e/widerruf.spec.ts`): dass die
  Schaltfläche mit der vorgeschriebenen Beschriftung existiert, dass das
  Formular sich öffnet und ohne E-Mail-Adresse nicht abgesendet werden kann, dass
  „Widerruf bestätigen“ die Erklärung überträgt und die Beschriftung auch während
  der Übermittlung stehen bleibt;
- seit dieser Änderung auch die Erreichbarkeit von den redaktionellen Seiten aus
  (`e2e/legal.spec.ts`).

Nicht getestet ist damit das Serververhalten: die Reihenfolge der beiden
E-Mails, das Verhalten bei Zustellfehlern und die Ratenbegrenzung.

**Die Lücke im Fußbereich der redaktionellen Seiten (Abschnitt 4) ist beim
Schreiben dieses Dokuments aufgefallen, nicht durch einen Test.** Bis dahin gab
es überhaupt keine Prüfung, ob `/widerruf` von jeder Seite aus erreichbar ist —
der vorhandene Erreichbarkeitstest lädt nur die Startseite, und die verwendet den
anderen Fußbereich. Der Mangel bestand also seit der Einführung des Buttons
unbemerkt. Das ist ein fairer Hinweis darauf, wo das verbleibende Risiko dieser
Änderung liegt: nicht in den Texten, die durchgängig durch Tests abgesichert
sind, sondern in den Stellen, an denen eine Anforderung des § 356a BGB von etwas
abhängt, das außerhalb der Widerrufsdateien liegt.

**Nicht Gegenstand dieser Prüfung** sind das übrige Produkt, die
Minderungsquoten, das RDG, die Nutzungsbedingungen im Übrigen und die
Datenschutzerklärung insgesamt — mit Ausnahme der Punkte 5.4 und 5.5, die aus
dieser Änderung heraus aufgefallen sind.

---

# Anhang

Alle Texte im Wortlaut, unmittelbar aus dem Code ausgelesen.

## A.1 Vertragsbezeichnung

```
Postversand der Mängelanzeige
```

## A.2 Anschrift für den Widerruf

```
Animals of Cologne GbR, Holzgasse 8, 50676 Köln, info@animals-of-cologne.de
```

Bewusst ohne Telefonnummer: Anlage 1 zu Art. 246a § 1 Abs. 2 EGBGB verlangt eine
solche „soweit verfügbar“, und der Betreiber unterhält keinen Geschäftsanschluss
— es wird also nichts weggelassen. Sollte je einer eingerichtet werden, gehört er
hierher.

## A.3 Die beiden Erklärungen (§ 356 Abs. 5 Nr. 2 BGB)

**lit. a — ausdrückliches Verlangen:**

```
Ich verlange ausdrücklich, dass Sie mit dem Druck und dem Versand meiner Mängelanzeige vor Ablauf der Widerrufsfrist beginnen.
```

**lit. c — Kenntnis vom Erlöschen:**

```
Mir ist bekannt, dass mein Widerrufsrecht erlischt, sobald Sie die Leistung vollständig erbracht haben — sobald der Brief also gedruckt und in die Zustellung gegeben ist. Diese Kenntnis bestätige ich hiermit.
```

## A.4 Widerrufsbelehrung

```
Widerrufsrecht. Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.

Um Ihr Widerrufsrecht auszuüben, müssen Sie uns — Animals of Cologne GbR, Holzgasse 8, 50676 Köln, info@animals-of-cologne.de — mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.

Sie können Ihr Widerrufsrecht auch online ausüben: über die Schaltfläche „Vertrag widerrufen“ unter mietminderung-online.de/widerruf. Wir bestätigen Ihnen den Eingang unverzüglich per E-Mail; die Bestätigung enthält den Inhalt Ihrer Widerrufserklärung sowie Datum und Uhrzeit ihres Eingangs.

Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.

Folgen des Widerrufs. Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.

Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.
```

Der letzte Absatz ist der Wertersatz-Absatz aus Frage 3.2.

## A.5 Hinweis auf das vorzeitige Erlöschen

Steht auf `/widerruf` und in der Bestellbestätigung.

```
Sie haben vor der Bestellung ausdrücklich verlangt, dass wir mit dem Druck und dem Versand vor Ablauf der Widerrufsfrist beginnen, und davon getrennt bestätigt, dass Ihnen bekannt ist, dass Ihr Widerrufsrecht mit der vollständigen Erbringung erlischt — also sobald der Brief gedruckt und in die Zustellung gegeben ist. Bis zu diesem Zeitpunkt können Sie widerrufen, danach erlischt es nach § 356 Absatz 5 Nummer 2 BGB.
```

Ergänzend steht auf `/widerruf`, wann die Leistung vollständig erbracht ist
(gedruckt, kuvertiert, frankiert und in die Zustellung gegeben), wer diese
Schritte ausführt (Druckdienstleister, anschließend die PIN AG) und dass das
Schreiben jederzeit kostenlos heruntergeladen und selbst versendet werden kann,
wenn der Nutzer die Erklärungen nicht abgeben möchte.

## A.6 Die Widerrufserklärung, wie die Bestätigung sie zurückgibt

```
Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Postversand der Mängelanzeige.
```

## A.7 Muster-Widerrufsformular

Nach Anlage 2 zu Art. 246a § 1 Abs. 2 EGBGB.

```
An Animals of Cologne GbR, Holzgasse 8, 50676 Köln
E-Mail: info@animals-of-cologne.de
Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung: Postversand der Mängelanzeige
Bestellt am (*)/erhalten am (*): ______________
Name des/der Verbraucher(s): ______________
Anschrift des/der Verbraucher(s): ______________
Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): ______________
Datum: ______________
(*) Unzutreffendes streichen.
```

In der Bestellbestätigung steht darüber ein Satz, dass das Formular verwendet
werden kann, aber nicht vorgeschrieben ist, und dass das Bestelldatum in das Feld
„Bestellt am“ gehört.

## A.8 Die Bestätigung nach § 356a Abs. 4 BGB

Das ist die E-Mail, die die widerrufende Person erhält — hier der Textteil, mit
Beispieldaten gerendert. Der HTML-Teil trägt denselben Inhalt in derselben
Reihenfolge.

**Betreff:**

```
Ihr Widerruf ist bei uns eingegangen
```

**Text:**

```
Ihr Widerruf ist bei uns eingegangen

wir bestätigen Ihnen den Eingang Ihrer Widerrufserklärung. Ihre Frist ist mit dem Absenden gewahrt.

Ihre Erklärung im Wortlaut:
Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Postversand der Mängelanzeige.

Eingegangen am: 06.08.2026, 11:12 MESZ
Vertrag: Postversand der Mängelanzeige
E-Mail-Adresse: anna.beispiel@example.de
Name: Anna Beispiel
Auftragsnummer: 1042

Ihre Anmerkung:
Der Brief ist hoffentlich noch nicht in der Post.

Wir prüfen den Vorgang und melden uns. Hatten wir Ihre Mängelanzeige zum Zeitpunkt Ihres Widerrufs noch nicht zur Post gegeben, erstatten wir Ihnen den vollen Betrag. War sie bereits unterwegs, ist Ihr Widerrufsrecht nach § 356 Absatz 5 Nummer 2 BGB erloschen — wir melden uns auch dann und erklären Ihnen den Stand.

Bewahren Sie diese E-Mail auf. Sie enthält den Inhalt Ihrer Erklärung sowie Datum und Uhrzeit ihres Eingangs (§ 356a Absatz 4 BGB).

Animals of Cologne GbR — vertreten durch die Gesellschafter Maximilian Marowsky, Paul Ohm und Philipp Weiß, Holzgasse 8, 50676 Köln, Deutschland
E-Mail: info@animals-of-cologne.de
Impressum: https://mietminderung-online.de/impressum · Datenschutz: https://mietminderung-online.de/datenschutz
Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 Abs. 1 Nr. 1 VSBG).
Hinweis: Unsere E-Mails sind keine Rechtsberatung.
```

Nicht angegebene freiwillige Felder erscheinen als „— nicht angegeben —“.

Zur Vollständigkeit: Der Betreiber erhält parallel eine Meldung mit
Eingangszeitpunkt, E-Mail-Adresse, Auftragsnummer, Name, Vertragsbezeichnung und
der Anmerkung. Sie ist der interne Eingangsnachweis und geht **vor** der
Bestätigung an den Verbraucher hinaus.

## A.9 Die beiden Erklärungen in den sechs weiteren Sprachfassungen

Lesehilfe; verbindlich ist allein die deutsche Fassung aus A.3. Gegenstand von
Frage 5.6.

**Englisch**

```
I expressly request that you begin printing and sending my defect notice before the withdrawal period expires.

I understand that my right of withdrawal expires as soon as you have fully performed the service — that is, as soon as the letter has been printed and handed over for delivery. I hereby confirm that I am aware of this.
```

**Türkisch**

```
Kusur bildirimimin basımına ve gönderimine cayma süresi dolmadan başlamanızı açıkça talep ediyorum.

Hizmeti tamamen ifa ettiğinizde — yani mektup basılıp teslimata verildiğinde — cayma hakkımın sona ereceğini biliyorum. Bunu bildiğimi burada teyit ediyorum.
```

**Ukrainisch**

```
Я прямо вимагаю, щоб ви розпочали друк і надсилання мого повідомлення про недоліки до закінчення строку відмови.

Мені відомо, що моє право на відмову припиняється, щойно ви повністю виконаєте послугу — тобто щойно лист буде надруковано та передано для доставки. Цим підтверджую, що мені це відомо.
```

**Russisch**

```
Я прямо требую, чтобы вы приступили к печати и отправке моего уведомления о недостатках до истечения срока отказа.

Мне известно, что моё право на отказ прекращается, как только вы полностью окажете услугу — то есть как только письмо будет напечатано и передано для доставки. Настоящим подтверждаю, что мне это известно.
```

**Arabisch**

```
أطلب صراحةً أن تبدؤوا طباعة إشعار العيوب الخاص بي وإرساله قبل انقضاء مهلة الانسحاب.

أعلم أن حقي في الانسحاب يسقط بمجرد تنفيذكم الخدمة بالكامل، أي بمجرد طباعة الخطاب وتسليمه للتوزيع. وأؤكد بهذا علمي بذلك.
```

**Polnisch**

```
Wyraźnie żądam, aby rozpoczęli Państwo druk i wysyłkę mojego zgłoszenia wad przed upływem terminu odstąpienia od umowy.

Wiem, że moje prawo odstąpienia wygasa z chwilą pełnego wykonania usługi — to znaczy z chwilą wydrukowania listu i przekazania go do doręczenia. Niniejszym potwierdzam, że jest mi to wiadome.
```

## A.10 Wo die Texte im Repository leben

Nur zur Nachvollziehbarkeit — zur Beantwortung der Fragen wird das Repository
nicht benötigt.

| Datei | Was darin steht |
|---|---|
| `src/lib/widerrufstext.ts` | sämtliche Widerrufstexte als einzige Quelle: die beiden Erklärungen, die Belehrung, der Erlöschenshinweis, das Muster-Widerrufsformular, die Widerrufserklärung und die Vertragsbezeichnung (Anhänge A.1 bis A.7) |
| `src/lib/widerrufstext.test.ts` | die Anforderungen als ausführbare Prüfung; verhindert, dass eine Anforderung stillschweigend entfernt wird |
| `src/components/VersandKarte.tsx` | die beiden Kästchen über dem Bestellbutton und die Sperre des Buttons |
| `src/i18n/translations.ts` | beide Erklärungen in sieben Sprachen (Anhang A.9) |
| `src/app/api/versand/checkout/route.ts` | serverseitige Prüfung beider Erklärungen und ihr Vermerk in den Stripe-Metadaten |
| `src/app/widerruf/page.tsx` | die Seite `/widerruf`: Schaltfläche oben, Geltungsbereich, Belehrung, Erlöschen, Musterformular |
| `src/components/Footer.tsx`, `src/components/content/ContentFooter.tsx` | die beiden Fußbereiche; beide verlinken `/widerruf` (Abschnitt 4) |
| `src/app/widerruf/WiderrufButton.tsx` | die Schaltfläche nach § 356a BGB, das Formular und die Bestätigung in der Oberfläche |
| `src/app/api/widerruf/route.ts` | Entgegennahme der Erklärung, Meldung an den Betreiber, Bestätigung an den Verbraucher |
| `src/lib/email/templates.ts` | die beiden E-Mails (`widerrufMeldungEmail`, `widerrufBestaetigungEmail`) sowie die Bestellbestätigung mit Belehrung und Musterformular |
| `src/lib/datum.ts` | der Eingangszeitpunkt in deutscher Ortszeit |
| `src/app/datenschutz/page.tsx` | der Abschnitt zur Schaltfläche nach § 356a BGB |
| `docs/datenschutz/verarbeitungsverzeichnis.md` | Nummer 9 des Verzeichnisses und der offene Punkt zum E-Mail-Provider (Frage 5.5) |
| `e2e/widerruf.spec.ts` | Prüfung des Browserverhaltens rund um die Schaltfläche |
| `e2e/legal.spec.ts` | Prüfung, dass `/widerruf` aus dem Fußbereich der redaktionellen Seiten erreichbar ist |
| `docs/plans/2026-08-06-widerruf-356a-design.md` | das Entwurfsdokument zu dieser Änderung, mit den Begründungen im Einzelnen |
