import Stripe from "stripe";

/**
 * The Stripe client, built on first use rather than at module load: the module
 * is imported by routes that run even when dispatch is switched off, and a
 * client constructed at import time would throw there and take the whole route
 * down instead of letting it answer "not configured".
 *
 * No apiVersion is pinned — the SDK sends the version it was built against,
 * which is the one its own types describe. Pinning a different one here would
 * let the types and the wire format drift apart.
 */
let client: Stripe | null = null;

/**
 * Without a secret key nothing can be charged. Callers must treat this as
 * "dispatch is not configured" and refuse, the same way the eBrief and token
 * gates do — the site keeps working as a free download.
 */
export function stripeKonfiguriert(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function stripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    // Unreachable behind stripeKonfiguriert(), but throwing beats handing the
    // SDK an empty key if a future caller forgets the gate.
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    client = new Stripe(key);
  }
  return client;
}
