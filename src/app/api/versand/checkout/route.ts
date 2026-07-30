import { NextResponse } from "next/server";
import { getJob } from "@/lib/ebrief/client";
import { DISTRIBUTED_STATUSES } from "@/lib/ebrief/types";
import { PRODUKTE, istProduktId } from "@/lib/ebrief/produkte";
import type { ProduktId } from "@/lib/ebrief/produkte";
import { pruefeZugang, versandTokenKonfiguriert } from "@/lib/versandToken";
import type { ZugangsPruefung } from "@/lib/versandToken";
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

/** The body is untrusted JSON, so every field arrives as `unknown`. */
interface CheckoutBody {
  jobId?: unknown;
  produktId?: unknown;
  token?: unknown;
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
  // No Stripe key, or no secret to check the job token with, means the site
  // simply keeps working as a free download.
  if (!stripeKonfiguriert() || !versandTokenKonfiguriert()) {
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

  const { jobId, produktId, token } = body ?? {};

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
    if (DISTRIBUTED_STATUSES.includes(job.Status)) {
      // The letter is already on its way. A second payment page for it could
      // only take money for something that cannot be sent twice.
      return NextResponse.json({ fehler: "bereits_versendet" }, { status: 409 });
    }

    const origin = new URL(request.url).origin;
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
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
            tax_behavior: stripeTaxBehavior(),
            product_data: { name: PRODUKTNAMEN[produkt.id] },
          },
        },
      ],
      // All the webhook gets. It has no database to look anything up in, so
      // the jobId travelling with the payment is what connects the money to
      // the letter; the produktId rides along for logs and support.
      metadata: { jobId: String(gepruefteJobId), produktId: produkt.id },
      success_url: `${origin}/mietminderung?versand=erfolg`,
      cancel_url: `${origin}/mietminderung?versand=abbruch`,
    });

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
