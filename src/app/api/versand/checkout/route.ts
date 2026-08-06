import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getJob } from "@/lib/ebrief/client";
import { ebriefKonfiguriert } from "@/lib/ebrief/token";
import {
  DISTRIBUTED_STATUSES,
  VOR_VERTEILUNG_STATUSES,
  hatStatus,
} from "@/lib/ebrief/types";
import { PRODUKTE, istProduktId } from "@/lib/ebrief/produkte";
import type { ProduktId } from "@/lib/ebrief/produkte";
import { pruefeZugang, versandTokenKonfiguriert } from "@/lib/versandToken";
import type { ZugangsPruefung } from "@/lib/versandToken";
import { HERKUNFT } from "@/lib/herkunft";
import { stripe, stripeKonfiguriert } from "@/lib/stripe";
import { stripeTaxBehavior } from "@/lib/steuer";
import { clientIp, rateLimit } from "@/lib/rateLimit";

/**
 * Tight, like the address preview: this is a button the user presses, not
 * something the browser polls. It is also the one dispatch route that reaches
 * for Stripe, so an abusive caller must not be able to fill their dashboard
 * with sessions.
 */
const LIMIT_PRO_STUNDE = 20;
const STUNDE_MS = 60 * 60 * 1000;

/**
 * What the payment page shows. Keyed by ProduktId rather than by string, so a
 * product added to the catalogue cannot silently reach checkout nameless.
 */
const PRODUKTNAMEN: Record<ProduktId, string> = {
  brief: "Mängelanzeige als Brief",
  einwurfEinschreiben: "Mängelanzeige als Einwurf-Einschreiben",
};

/**
 * What the payer sees on their bank statement, appended to the account's
 * shortened descriptor as "<PREFIX>* MIETMINDERUNG".
 *
 * The Stripe account belongs to Animals of Cologne and carries other services,
 * so its default descriptor is the company — which is precisely the name a
 * tenant who bought on mietminderung-online.de would not recognise weeks later
 * on a statement. An unrecognised line is what a chargeback is made of, and at
 * this price a single one costs the margin of roughly a dozen letters.
 *
 * Stripe allows 22 characters for prefix + "* " + suffix together. With a
 * three-character prefix this leaves seventeen; the constant below uses
 * thirteen, so the prefix may grow to seven without truncation.
 */
const STATEMENT_SUFFIX = "MIETMINDERUNG";

/**
 * Only payment methods that confirm immediately.
 *
 * Left unset, Checkout offers whatever the Dashboard has enabled — which today
 * includes Klarna. Klarna, SEPA Direct Debit and Pay by Bank are *delayed
 * notification* methods: `checkout.session.completed` arrives with a
 * `payment_status` other than `paid`, the webhook correctly declines to
 * dispatch, and the confirmation follows as
 * `checkout.session.async_payment_succeeded` up to three days later.
 *
 * The webhook does handle that event, so the letter is not lost. It is late,
 * and late is the thing a Mängelanzeige cannot afford: the deadline in the
 * letter runs from the day the landlord learns of the defect, the catalogue
 * carries defects whose deadline is three days, and until the letter arrives
 * there is no date for the rent reduction to run from. A tenant with no heating
 * who pays on Friday and has the letter posted on Monday has bought a worse
 * product than the one on the card. So this is a product decision as much as a
 * technical one — see the PR that introduced the dispatch follow-up.
 *
 * Pinned here rather than left to the Dashboard, for the same reason as
 * `adaptive_pricing` below: a Dashboard toggle is one click from being flipped,
 * and this one would fail quietly. `card` carries Apple Pay and Google Pay with
 * it — they ride on the card rails.
 *
 * PayPal is on the list because Stripe classifies it as immediate rather than
 * delayed notification, so it does not reopen the hole this list exists to
 * close, and because it is the method German consumers reach for first. It is
 * live on this same Stripe account for widerspruch-krankengeld.de.
 *
 * Anything added here has to clear the same bar: confirmation at the till, not
 * days later. Klarna does not.
 */
const ZAHLARTEN = ["card", "paypal"] as const;

/**
 * Where the payment page sends the payer back to, and the origin that goes
 * into the idempotency key below.
 *
 * Deliberately not `new URL(request.url).origin`: that reflects the inbound
 * Host header, and Vercel only sanitises the host for Server Actions, not for
 * a plain route handler. A chosen Host would send the payer off-domain after
 * they have paid, and would mint a fresh idempotency key for the same job —
 * defeating the very duplicate-session protection the key provides.
 *
 * Read from the environment rather than through `site.url` in src/lib/site.ts:
 * that helper falls back to the production domain, which would make "unset"
 * indistinguishable from "set to production" — local development would send
 * test payers to the live site, and production could never fail closed.
 *
 * Note this is a NEXT_PUBLIC_ variable: a value present at build time is
 * inlined and then cannot be changed at runtime without a rebuild, while with
 * no value at build the lookup survives and is read from the runtime
 * environment. Either way the value is server-controlled, which is the point.
 */
function konfigurierteBasisUrl(): string | undefined {
  const wert = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!wert) return undefined;
  // A trailing slash is cosmetic, but an unnormalised one would give the same
  // deployment two idempotency keys for one job.
  return wert.replace(/\/+$/, "");
}

/**
 * Outside production the request origin is a fine fallback and keeps local
 * development and preview deployments working. In production it is not: an
 * attacker-influenceable value is the one outcome to rule out, so dispatch
 * refuses to start instead.
 */
function basisUrlKonfiguriert(): boolean {
  return (
    konfigurierteBasisUrl() !== undefined ||
    process.env.NODE_ENV !== "production"
  );
}

/** Only reachable once basisUrlKonfiguriert() has been checked. */
function basisUrl(request: Request): string {
  return konfigurierteBasisUrl() ?? new URL(request.url).origin;
}

/**
 * Two clicks on the payment button must not become two payment pages. The
 * webhook's only guard is the eBrief job status, so a second session that also
 * gets paid takes money for a letter that cannot be posted twice, and nothing
 * in the system would notice. Handing Stripe the same idempotency key returns
 * the first session instead of creating another; the key lives 24 hours, which
 * is also about how long a Checkout session is good for.
 *
 * Everything that shapes the session goes into the key, because Stripe refuses
 * a reused key whose parameters differ — the refusal would reach the user as
 * "checkout_fehler". The base URL is in there for exactly that reason: a
 * preview deployment builds different success and cancel URLs and must get its
 * own key rather than collide with production's. The price and the tax
 * behaviour are in there because both can change under a deployment while a
 * key is still live; a change simply mints a new key.
 *
 * Hashed so the key stays well inside Stripe's 255 characters and cannot carry
 * anything awkward out of a URL.
 */
function idempotenzSchluessel(merkmale: {
  jobId: number;
  produktId: ProduktId;
  preisCent: number;
  taxBehavior: string | undefined;
  basisUrl: string;
  statementSuffix: string;
  zahlarten: readonly string[];
}): string {
  const roh = [
    merkmale.jobId,
    merkmale.produktId,
    merkmale.preisCent,
    merkmale.taxBehavior ?? "ohne",
    merkmale.basisUrl,
    merkmale.statementSuffix,
    merkmale.zahlarten.join(","),
  ].join("|");
  return `versand-${createHash("sha256").update(roh).digest("hex")}`;
}

/** The body is untrusted JSON, so every field arrives as `unknown`. */
interface CheckoutBody {
  jobId?: unknown;
  produktId?: unknown;
  token?: unknown;
  verlangtSofortigenBeginn?: unknown;
  kenntErloeschen?: unknown;
}

/**
 * The shared access check reads the jobId and token from the query string,
 * because that is where the two GET routes carry them. This route takes them
 * in the body, so they are moved into a throwaway URL and handed to the same
 * function. Re-implementing the HMAC check here would be the obvious
 * alternative and the worse one: a second copy is free to drift away from the
 * one the GET routes use, and the letters are only out of reach as long as
 * every route agrees on what a valid token is.
 */
function pruefeZugangAusBody(
  request: Request,
  jobId: unknown,
  token: unknown
): ZugangsPruefung {
  const url = new URL(request.url);
  url.search = "";
  // Anything that is not a number or a string becomes the empty value rather
  // than being stringified — `String({})` must not get a chance to look like
  // an id, and a non-string token is simply no token.
  url.searchParams.set(
    "jobId",
    typeof jobId === "number" || typeof jobId === "string" ? String(jobId) : ""
  );
  url.searchParams.set("token", typeof token === "string" ? token : "");
  return pruefeZugang(new Request(url));
}

/**
 * Opens the Stripe Checkout session for a job that POST /api/versand/vorbereiten
 * has already prepared and committed. Nothing is printed here and nothing is
 * charged here — the session is only the payment page; the letter goes out in
 * the Stripe webhook, which is the single place where money and dispatch meet.
 *
 * Requires the capability token issued by the prepare route. Without it this
 * route would answer differently for a job that exists and one that does not
 * (409 versus 200), which is exactly the existence oracle the token was
 * introduced to close, and anyone could attach a payment session to a
 * stranger's job.
 *
 * Everything returned to the client is an error slug, never prose — the site
 * ships in six languages and the UI translates the slugs via src/i18n.
 */
export async function POST(request: Request) {
  // No Stripe key, no eBrief credentials, or no secret to check the job token
  // with, means the site simply keeps working as a free download. eBrief is
  // part of the gate even though only Stripe is called on the happy path: the
  // job lookup below needs those credentials, and without them the user would
  // get a transient-looking "checkout_fehler" for what is a static
  // misconfiguration the other dispatch routes report as 503. The base URL is
  // in the gate for a different reason — in production there is no safe
  // fallback for it, so refusing is the only correct answer.
  if (
    !stripeKonfiguriert() ||
    !ebriefKonfiguriert() ||
    !versandTokenKonfiguriert() ||
    !basisUrlKonfiguriert()
  ) {
    return NextResponse.json(
      { fehler: "versand_nicht_konfiguriert" },
      { status: 503 }
    );
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ fehler: "unvollstaendig" }, { status: 400 });
  }

  const { jobId, produktId, token, verlangtSofortigenBeginn, kenntErloeschen } =
    body ?? {};

  // Before anything else, and in particular before the job is looked up: the
  // answer below reveals whether the job exists and how far along it is.
  const zugang = pruefeZugangAusBody(request, jobId, token);
  if (!zugang.ok) {
    return NextResponse.json(
      { fehler: zugang.fehler },
      { status: zugang.status }
    );
  }

  // The jobId has been validated by the access check; the product has not.
  if (!istProduktId(produktId)) {
    return NextResponse.json({ fehler: "unvollstaendig" }, { status: 400 });
  }

  // § 356 Abs. 5 Nr. 2 BGB. The letter is posted within hours, so the
  // withdrawal right has to be dealt with before the order, not after. Two
  // declarations, checked separately: lit. a is the express request to start
  // early, lit. c the acknowledgement that the right expires on completion.
  // One flag standing for both would be exactly the defect this replaces.
  //
  // Strict `!== true` rather than a truthiness check: a "false" string or a 1
  // must not pass for a declaration the customer has to make deliberately.
  //
  // This cannot stop a crafted request — the flags come from the client either
  // way — and it is not meant to. It stops the UI from ever reaching checkout
  // without asking, and it makes the declarations a documented precondition of
  // the order rather than an afterthought.
  if (verlangtSofortigenBeginn !== true || kenntErloeschen !== true) {
    return NextResponse.json({ fehler: "zustimmung_fehlt" }, { status: 400 });
  }

  // Namespaced by route: the limiter keys on a plain string, so a bare IP
  // would put this into the same bucket as the status polling and be exhausted
  // before the user ever gets to pay.
  if (!rateLimit(`checkout:${clientIp(request)}`, LIMIT_PRO_STUNDE, STUNDE_MS)) {
    return NextResponse.json({ fehler: "zu_viele_anfragen" }, { status: 429 });
  }

  // The price comes from the catalogue alone, never from the request — a price
  // arriving in the body would let the client name its own.
  const produkt = PRODUKTE[produktId];
  const { jobId: gepruefteJobId } = zugang;

  try {
    const job = await getJob(gepruefteJobId);

    /**
     * A payment page is only opened for a job that can still be posted, asked
     * the positive way round for the same reason as in the Stripe webhook: the
     * two outcomes are not symmetrical.
     *
     * Refusing a job that would in fact have been fine costs the user a failed
     * click. Nothing is charged, the free download is still there, and starting
     * the dispatch again builds a new job.
     *
     * Opening the page for a job that is already on its way, or that eBrief has
     * failed on, takes real money for a letter that will not be posted — the
     * webhook then has nothing left to do but log it and wait for a human to
     * refund by hand. Since `COMITTED` proved that eBrief's spellings are not
     * the documented ones, "it is not in DISTRIBUTED_STATUSES" is no longer
     * evidence that a job has not been distributed, and asking that way round
     * would be exactly the mistake being removed from the webhook.
     */
    if (!hatStatus(job.JobStatus, VOR_VERTEILUNG_STATUSES)) {
      // Recognised as already on its way: say so plainly, it is the one case
      // where the user is better off knowing nothing further is needed.
      if (hatStatus(job.JobStatus, DISTRIBUTED_STATUSES)) {
        return NextResponse.json({ fehler: "bereits_versendet" }, { status: 409 });
      }

      // Everything else: a failed or deleted job, or a status this code cannot
      // place. Both are worth a log line — the second one is how anyone finds
      // out that eBrief has introduced a status, before it starts blocking
      // payments at scale.
      console.warn("Checkout refused: eBrief job is not in a payable state", {
        jobId: gepruefteJobId,
        ebriefStatus: job.JobStatus ?? null,
      });
      return NextResponse.json(
        { fehler: "versand_nicht_moeglich" },
        { status: 409 }
      );
    }

    const basis = basisUrl(request);
    // Under § 19 UStG this is undefined and must stay undefined — see below.
    const taxBehavior = stripeTaxBehavior();

    const session = await stripe().checkout.sessions.create(
      {
        mode: "payment",
        // See ZAHLARTEN above: only methods that confirm at the till.
        payment_method_types: [...ZAHLARTEN],
        // The dispatch card quotes a euro price straight from the catalogue,
        // in every one of the seven locales. Stripe's adaptive pricing would
        // convert that into the payer's own currency on the payment page, so
        // someone paying with a foreign card would be quoted one figure and
        // charged another — which German price-quoting rules do not allow, and
        // which would also settle a converted amount against a margin
        // calculated in euros. Off explicitly rather than by account setting,
        // because an account setting is one click away from being flipped back.
        adaptive_pricing: { enabled: false },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "eur",
              unit_amount: produkt.preisCent,
              // Under § 19 UStG no tax may be stated, and stripeTaxBehavior()
              // returns undefined for exactly that case. Passed through as-is:
              // naming any behaviour here would put a tax statement on the
              // payment page that § 14c UStG would then oblige us to remit.
              tax_behavior: taxBehavior,
              product_data: { name: PRODUKTNAMEN[produkt.id] },
            },
          },
        ],
        // All the webhook gets. It has no database to look anything up in, so
        // the jobId travelling with the payment is what connects the money to
        // the letter; the produktId rides along for logs and support.
        //
        // `widerrufVerlangen` and `widerrufErloeschen` are the record that both
        // § 356 Abs. 5 Nr. 2 declarations were made: there is no database, so
        // Stripe is the order record, and a consent that lives only in a React
        // checkbox is a consent nobody can produce in a dispute. Two entries
        // and not one, because they are two declarations and each has to be
        // provable on its own. Deliberately constants and not timestamps —
        // Stripe refuses a reused idempotency key whose parameters differ, so a
        // per-request timestamp would turn every legitimate retry into a
        // "checkout_fehler". The session's own creation time answers "when"
        // closely enough; the declarations are made moments before it.
        metadata: {
          // Which service this session belongs to. The Stripe account is shared
          // with widerspruch-krankengeld.de and Stripe cannot filter events by
          // metadata, so each webhook has to recognise its own. See HERKUNFT in
          // src/lib/herkunft.ts.
          herkunft: HERKUNFT,
          jobId: String(gepruefteJobId),
          produktId: produkt.id,
          widerrufVerlangen: "356-5-2-a-BGB",
          widerrufErloeschen: "356-5-2-c-BGB",
        },
        // Two pages of their own, not a query parameter on a wizard step: the
        // letter wizard lives in React state that the full-page trip to Stripe
        // destroys, so a returning payer cannot be shown their draft again.
        // See src/app/versand/VersandErgebnis.tsx. Nothing identifying the job
        // travels in these URLs — Stripe stores them, and the capability token
        // has no business in a third party's dashboard.
        success_url: `${basis}/versand/erfolg`,
        cancel_url: `${basis}/versand/abbruch`,
        // Set on the PaymentIntent rather than the session: the descriptor
        // belongs to the charge, and Checkout passes this through.
        payment_intent_data: { statement_descriptor_suffix: STATEMENT_SUFFIX },
      },
      {
        idempotencyKey: idempotenzSchluessel({
          jobId: gepruefteJobId,
          produktId: produkt.id,
          preisCent: produkt.preisCent,
          taxBehavior,
          basisUrl: basis,
          // In the key for the same reason as the price: changing the suffix
          // under a live key would make Stripe reject the reuse, and the user
          // would see "checkout_fehler" for a deployment detail.
          statementSuffix: STATEMENT_SUFFIX,
          // Same reason, and the reason this deploy needs it: a session created
          // minutes before the change still holds its key for 24 hours, and
          // reusing it with a different payment method list is exactly the
          // mismatch Stripe refuses.
          zahlarten: ZAHLARTEN,
        }),
      }
    );

    if (!session.url) {
      // Only happens for session types we do not create (embedded checkout),
      // but returning null here would leave the UI with a button that does
      // nothing and no trace of why.
      throw new Error("Stripe checkout session carried no URL");
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Dispatch checkout failed", { jobId: gepruefteJobId, err });
    return NextResponse.json({ fehler: "checkout_fehler" }, { status: 502 });
  }
}
