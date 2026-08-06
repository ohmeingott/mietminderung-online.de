/**
 * A point in time that carries legal weight.
 *
 * Every other date in this codebase is built from year, month and day and
 * reads back the same in any time zone. A point in time from `new Date()` does
 * not: on a server running in UTC — and Vercel does — it would be two hours
 * behind German local time in summer.
 */

/** The zone this business happens in. */
const ZEITZONE = "Europe/Berlin";

/**
 * Date and time of an event, in German local time.
 *
 * Needed where the moment itself is what counts: § 356a Abs. 4 BGB requires
 * the withdrawal confirmation to carry "das Datum und die Uhrzeit ihres
 * Eingangs". Two hours out is not a cosmetic problem at a deadline.
 *
 * The zone is printed alongside — a time without one is half an answer, and
 * the consumer has to be able to check the figure against their own clock.
 */
export function formatiereZeitpunkt(datum: Date): string {
  return datum.toLocaleString("de-DE", {
    timeZone: ZEITZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
