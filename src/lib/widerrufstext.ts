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

/** Postal address plus mailbox, as the model instruction requires it. */
export const widerrufsadresse = `${anbieter}, ${site.operator.email}`;

/** The notice itself, one string per paragraph, in the statutory order. */
export const widerrufsbelehrung: readonly string[] = [
  "Widerrufsrecht. Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.",
  `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns — ${widerrufsadresse} — mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.`,
  "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.",
  "Folgen des Widerrufs. Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.",
  "Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.",
] as const;

/**
 * What § 356 Abs. 4 BGB requires us to confirm afterwards: that the customer
 * asked for an early start and acknowledged losing the right on completion.
 * The declaration itself is made at the order — see the checkbox in
 * src/components/VersandKarte.tsx.
 */
export const erloeschenHinweis =
  "Sie haben vor der Bestellung ausdrücklich verlangt, dass wir mit dem Versand sofort beginnen, und bestätigt, dass Sie Ihr Widerrufsrecht verlieren, sobald der Brief gedruckt und in die Zustellung gegeben ist. Bis zu diesem Zeitpunkt können Sie widerrufen, danach erlischt das Widerrufsrecht nach § 356 Abs. 4 BGB.";

/** The model withdrawal form from Anlage 2 zu Art. 246a § 1 Abs. 2 EGBGB. */
export const musterWiderrufsformular: readonly string[] = [
  `An ${anbieter}`,
  `E-Mail: ${site.operator.email}`,
  "Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung: Postversand einer Mängelanzeige",
  "Bestellt am (*)/erhalten am (*): ______________",
  "Name des/der Verbraucher(s): ______________",
  "Anschrift des/der Verbraucher(s): ______________",
  "Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): ______________",
  "Datum: ______________",
  "(*) Unzutreffendes streichen.",
] as const;
