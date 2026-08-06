import { site } from "@/lib/site";

/**
 * The Widerrufsbelehrung, in one place.
 *
 * It has to appear twice: on /widerruf, where the customer reads it before
 * ordering, and inside the order confirmation, where § 312f Abs. 2 BGB wants it
 * on a durable medium. Two hand-maintained copies of a statutory notice drift,
 * and the drift is invisible until someone withdraws and the two versions
 * disagree about the deadline. Hence plain strings here, rendered by both.
 *
 * Plain text rather than JSX so the email can use it as-is; the page wraps each
 * paragraph itself.
 */

const anbieter = `${site.operator.name}, ${site.operator.street}, ${site.operator.zip} ${site.operator.city}`;

/**
 * Postal address plus mailbox, as the model instruction requires it.
 *
 * No telephone number, deliberately. Anlage 1 zu Art. 246a § 1 Abs. 2 EGBGB
 * asks for one "soweit verfügbar", and the operator has no business line —
 * so there is nothing to omit. Should one ever be set up, it belongs here:
 * "verfügbar" means it exists, not that we chose to publish it. An email
 * address satisfies § 5 DDG's requirement for a fast channel on its own.
 */
export const widerrufsadresse = `${anbieter}, ${site.operator.email}`;

/**
 * What the contract is called, wherever it has to be named: in the model form,
 * in the withdrawal form under § 356a Abs. 2 BGB, and in the declaration the
 * confirmation gives back. One constant, because three spellings of the same
 * service in three documents is what a dispute is made of.
 */
export const vertragsbezeichnung = "Postversand der Mängelanzeige";

/**
 * Declaration under § 356 Abs. 5 Nr. 2 lit. a BGB — the express request.
 *
 * Its own checkbox, not pre-ticked.
 */
export const erklaerungSofortigerBeginn =
  "Ich verlange ausdrücklich, dass Sie mit dem Druck und dem Versand meiner Mängelanzeige vor Ablauf der Widerrufsfrist beginnen.";

/**
 * Declaration under § 356 Abs. 5 Nr. 2 lit. c BGB — knowledge of the expiry.
 *
 * Necessarily a second, separate box. Folding both declarations into one tick
 * does not satisfy the provision, and pre-ticking either is worse still — a
 * pre-ticked declaration is not a declaration.
 */
export const erklaerungErloeschen =
  "Mir ist bekannt, dass mein Widerrufsrecht erlischt, sobald Sie die Leistung vollständig erbracht haben — sobald der Brief also gedruckt und in die Zustellung gegeben ist. Diese Kenntnis bestätige ich hiermit.";

/**
 * The withdrawal declaration itself, in the words the confirmation returns.
 *
 * § 356a Abs. 4 BGB obliges the confirmation to carry "den Inhalt der
 * Widerrufserklärung". This is that content — the consumer has to be able to
 * prove from the confirmation alone what they declared.
 */
export const widerrufserklaerungSatz = `Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den ${vertragsbezeichnung}.`;

/** The notice itself, one string per paragraph, in the statutory order. */
export const widerrufsbelehrung: readonly string[] = [
  "Widerrufsrecht. Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.",
  `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns — ${widerrufsadresse} — mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.`,
  "Sie können Ihr Widerrufsrecht auch online ausüben: über die Schaltfläche „Vertrag widerrufen“ unter mietminderung-online.de/widerruf. Wir bestätigen Ihnen den Eingang unverzüglich per E-Mail; die Bestätigung enthält den Inhalt Ihrer Widerrufserklärung sowie Datum und Uhrzeit ihres Eingangs.",
  "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.",
  "Folgen des Widerrufs. Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.",
  "Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.",
] as const;

/**
 * What § 356 Abs. 5 Nr. 2 BGB requires us to confirm afterwards: that the
 * customer asked for an early start (lit. a) and, separately, acknowledged
 * losing the right on completion (lit. c). The declarations themselves are
 * made at the order — see the two checkboxes in src/components/VersandKarte.tsx.
 */
export const erloeschenHinweis =
  "Sie haben vor der Bestellung ausdrücklich verlangt, dass wir mit dem Druck und dem Versand vor Ablauf der Widerrufsfrist beginnen, und davon getrennt bestätigt, dass Ihnen bekannt ist, dass Ihr Widerrufsrecht mit der vollständigen Erbringung erlischt — also sobald der Brief gedruckt und in die Zustellung gegeben ist. Bis zu diesem Zeitpunkt können Sie widerrufen, danach erlischt es nach § 356 Absatz 5 Nummer 2 BGB.";

/** The model withdrawal form from Anlage 2 zu Art. 246a § 1 Abs. 2 EGBGB. */
export const musterWiderrufsformular: readonly string[] = [
  `An ${anbieter}`,
  `E-Mail: ${site.operator.email}`,
  `Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung: ${vertragsbezeichnung}`,
  "Bestellt am (*)/erhalten am (*): ______________",
  "Name des/der Verbraucher(s): ______________",
  "Anschrift des/der Verbraucher(s): ______________",
  "Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): ______________",
  "Datum: ______________",
  "(*) Unzutreffendes streichen.",
] as const;
