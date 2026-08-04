/**
 * Which service this is — for everything it shares with its sibling.
 *
 * Animals of Cologne GbR runs a second service on the **same Stripe account**
 * and under the **same eBrief customer number (D01039646)**:
 * widerspruch-krankengeld.de. Both namespaces are therefore shared, and none
 * of the obvious discriminators works: Stripe delivers every event to every
 * endpoint on an account and cannot filter by metadata, every eBrief `jobId`
 * is valid in both systems, and to top it off both product catalogues carry
 * the `produktId` `einwurfEinschreiben`.
 *
 * Unmarked, this service would post a stranger's letter — and posting is the
 * one irreversible step in the whole flow.
 *
 * So every transaction carries this marker in two places:
 *
 * 1. **In the Stripe metadata** of the Checkout session, as `herkunft`.
 * 2. **In the eBrief attributes** of the job, as `Reference`. The webhook
 *    checks it on the job itself, before distributing — on the thing it acts
 *    upon, rather than on the label attached to the payment.
 *
 * The second check is the more valuable one: a label can be set wrongly or
 * forgotten, the job is the thing itself. Stripe's own recommendation for two
 * services on one account is, incidentally, **separate accounts**; the
 * metadata filter is their documented alternative. When a third service comes
 * along, that is the point at which separate accounts start to pay off.
 *
 * Both checks are written as a **rejection** of a foreign marker rather than a
 * requirement of our own, and here that is not optional: this service is live.
 * Sessions and jobs created before this shipped carry no marker at all, and a
 * requirement would strand every one of them — paid letters that would never
 * be posted. Once no unmarked work can still be in flight, they can be
 * tightened.
 */
export const HERKUNFT = "mietminderung-online";

/**
 * Checks a marker that came from outside.
 *
 * `true` means "demonstrably belongs to someone else". Absent and empty count
 * as ours, because absence is what every pre-existing session and job looks
 * like — and because eBrief may not return the reference at all: `GET
 * /Jobs/{id}` has no `Reference` field of its own in the schema, only the
 * search does.
 */
export function istFremd(kennung: string | null | undefined): boolean {
  return typeof kennung === "string" && kennung !== "" && kennung !== HERKUNFT;
}
