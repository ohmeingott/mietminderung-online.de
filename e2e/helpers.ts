import { expect, type Page, type Route } from "@playwright/test";
import { PRODUKTE, istProduktId } from "../src/lib/ebrief/produkte";
import { STORAGE_KEY as FLOW_STORAGE_KEY } from "../src/components/wizard/flowState";

/**
 * Makes every navigation in this test start the wizard from its first question.
 *
 * The draft lives in sessionStorage and deliberately survives a navigation, so
 * a tenant who switches language mid-flow keeps their answers. A test that
 * walks several URLs in one tab inherits that draft too and would find the
 * wizard already past the eligibility questions. This clears the draft before
 * the page's own scripts run, so the state is gone by the time the wizard
 * reads it - unlike clearing after `goto`, which is one hydration too late.
 */
export async function startWizardFresh(page: Page) {
  await page.addInitScript((key) => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* storage blocked - the flow starts empty anyway */
    }
  }, FLOW_STORAGE_KEY);
}

/**
 * Ids of the answers that keep a claim alive, one per eligibility question.
 * Using ids rather than labels keeps the flows working in every language.
 */
export const ELIGIBLE_ANSWERS = [
  "eq-mietvertrag-ja",
  "eq-mangel_bekannt-nein",
  "eq-selbst_verursacht-nein",
  "eq-erheblich-stark",
  "eq-angezeigt-nein",
] as const;

/** Clicks through the eligibility questions until the defect picker appears. */
export async function answerEligibility(page: Page) {
  for (const testId of ELIGIBLE_ANSWERS) {
    await page.getByTestId(testId).click();
  }
  await expect(page.getByTestId("kategorie-heizung")).toBeVisible();
}

/** Picks one defect out of the given category. */
export async function selectDefect(
  page: Page,
  kategorieId = "heizung",
  mangelId = "heizung_total"
) {
  await page.getByTestId(`kategorie-${kategorieId}`).click();
  await page.getByTestId(`mangel-${mangelId}`).click();
}

/** Runs the whole calculator and stops on the result screen. */
export async function completeCheck(page: Page, rent = "1000") {
  await answerEligibility(page);
  await selectDefect(page);
  await page.getByTestId("check-next").click();
  await page.getByTestId("rent-input").fill(rent);
  await page.getByTestId("check-submit").click();
  await expect(page.getByTestId("check-create-letter")).toBeVisible();
}

/** Continues from the result screen into the letter wizard. */
export async function openLetterWizard(page: Page) {
  await page.getByTestId("check-create-letter").click();
  await expect(page.getByTestId("mieter-name")).toBeVisible();
}

export const TENANT = {
  name: "Erika Mustermann",
  street: "Musterstraße 10",
  zip: "50676",
  city: "Köln",
  email: "erika@beispiel.de",
  phone: "0176 12345678",
};

export const LANDLORD = {
  name: "Hausverwaltung Beispiel GmbH",
  street: "Vermieterstraße 5",
  zip: "50667",
  city: "Köln",
};

export async function fillTenant(page: Page, tenant = TENANT) {
  await page.getByTestId("mieter-name").fill(tenant.name);
  await page.getByTestId("mieter-strasse").fill(tenant.street);
  await page.getByTestId("mieter-plz").fill(tenant.zip);
  await page.getByTestId("mieter-ort").fill(tenant.city);
  await page.getByTestId("mieter-telefon").fill(tenant.phone);
  // No e-mail here: the wizard step does not ask for one. `tenant.email` is
  // for the dispatch card, which is the only place it is needed.
}

export async function fillLandlord(page: Page, landlord = LANDLORD) {
  await page.getByTestId("vermieter-name").fill(landlord.name);
  await page.getByTestId("vermieter-strasse").fill(landlord.street);
  await page.getByTestId("vermieter-plz").fill(landlord.zip);
  await page.getByTestId("vermieter-ort").fill(landlord.city);
}

/**
 * Tenant → landlord → defect details → deadline → letter preview.
 *
 * The deadline screen sits between the descriptions and the preview: the
 * letter no longer demands repair within a flat fourteen days, and the choice
 * has to be made before the text that quotes it is built.
 */
export async function reachPreview(page: Page) {
  await fillTenant(page);
  await page.getByTestId("letter-next").click();
  await fillLandlord(page);
  await page.getByTestId("letter-next").click();
  await page.getByTestId("letter-preview").click();
  await chooseDeadline(page);
  // The textarea mounts empty and is filled by an effect - wait for content,
  // not just for the element.
  await expect(page.getByTestId("brieftext")).not.toHaveValue("");
}

/**
 * The deadline screen. Accepts the preselection unless `tage` is given, and
 * returns the dd.mm.yyyy date that ends up in the letter.
 */
export async function chooseDeadline(page: Page, tage?: 3 | 7 | 14 | 21) {
  if (tage) await page.getByTestId(`frist-${tage}`).click();
  const gewaehlt = page.locator('input[name="frist"]:checked');
  const days = Number(await gewaehlt.inputValue());
  await page.getByTestId("letter-frist-next").click();
  const datum = new Date();
  datum.setDate(datum.getDate() + days);
  return datum.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Stubs the Gemini endpoint so the suite never depends on a live API key,
 * echoing back whatever the user typed.
 */
export async function stubEnhanceApi(page: Page) {
  await page.route("**/api/enhance-beschreibung", async (route) => {
    const body = route.request().postDataJSON() as {
      maengel: { beschreibung: string }[];
    };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        beschreibungen: body.maengel.map(
          (m) => m.beschreibung || "Automatisch ergänzte Beschreibung."
        ),
      }),
    });
  });
}

/* -------------------------------------------------- paid dispatch (eBrief) */

/**
 * Where the checkout stub sends the browser instead of Stripe. The host does
 * not exist and is intercepted below in any case, so a stub that stopped
 * working would fail loudly rather than quietly reach the internet.
 */
export const STRIPE_STUB_URL = "https://checkout.stripe.test/c/pay/cs_test_e2e";

/**
 * Deliberately odd values: an assertion that the checkout was opened for the
 * job that was prepared must not be able to pass on a coincidence.
 */
export const VERSAND_JOB_ID = 40921;
export const VERSAND_TOKEN = "40921.e2etokensignatur";

/** The four states GET /api/versand/status can report to the browser. */
export type VersandUiStatus = "laeuft" | "bereit" | "adresse_warnung" | "fehler";

/** One failure answer, in the shape the real routes produce it. */
export interface VersandFehlerAntwort {
  status?: number;
  /** The `fehler` slug; omit for a body that carries none. */
  slug?: string;
  /** Drop the connection instead of answering at all. */
  abbruch?: boolean;
}

export interface VersandStubOptionen {
  /** What the first status poll reports. Defaults to "bereit". */
  status?: VersandUiStatus;
  /** The parse hints the prepare route returns. Defaults to all clean. */
  hinweise?: {
    kopfErkannt?: boolean;
    datumErkannt?: boolean;
    absenderGekuerzt?: boolean;
  };
  /** Where checkout points the browser. Defaults to STRIPE_STUB_URL. */
  checkoutUrl?: string;
  vorbereitenFehler?: VersandFehlerAntwort;
  statusFehler?: VersandFehlerAntwort;
  checkoutFehler?: VersandFehlerAntwort;
}

/**
 * What the stub saw. Asserting on these payloads is the only way to tell that
 * the browser paid for the job it prepared rather than for some other one.
 */
export interface VersandStub {
  vorbereiten: Record<string, unknown>[];
  status: { jobId: string | null; token: string | null }[];
  checkout: Record<string, unknown>[];
  adressvorschau: { jobId: string | null; token: string | null }[];
}

async function antworteFehler(route: Route, fehler: VersandFehlerAntwort) {
  if (fehler.abbruch) {
    await route.abort("failed");
    return;
  }
  await route.fulfill({
    status: fehler.status ?? 500,
    contentType: "application/json",
    body: JSON.stringify(fehler.slug === undefined ? {} : { fehler: fehler.slug }),
  });
}

/** Pulls the two capability parameters out of a GET the card sent. */
function zugangsParameter(url: string) {
  const { searchParams } = new URL(url);
  return {
    jobId: searchParams.get("jobId"),
    token: searchParams.get("token"),
  };
}

/**
 * Stubs the four dispatch routes plus the payment page they lead to, so the
 * suite never touches eBrief or Stripe — there are no credentials for either,
 * and a real call would either be refused or cost money.
 *
 * The returned object collects what the browser actually sent, which is what
 * the assertions are for: the prose on the card cannot show that checkout was
 * opened for the job the user just inspected.
 */
export async function stubVersandApi(
  page: Page,
  optionen: VersandStubOptionen = {}
): Promise<VersandStub> {
  const stub: VersandStub = {
    vorbereiten: [],
    status: [],
    checkout: [],
    adressvorschau: [],
  };

  await page.route(
    (url) => url.pathname === "/api/versand/vorbereiten",
    async (route) => {
      const body = (route.request().postDataJSON() ?? {}) as Record<string, unknown>;
      stub.vorbereiten.push(body);
      if (optionen.vorbereitenFehler) {
        await antworteFehler(route, optionen.vorbereitenFehler);
        return;
      }
      // Mirrors the real route, price included: the card does not read it, but
      // a stub that answers with less than production does hides regressions.
      const produktId = istProduktId(body.produktId) ? body.produktId : "brief";
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          jobId: VERSAND_JOB_ID,
          token: VERSAND_TOKEN,
          produktId,
          preisCent: PRODUKTE[produktId].preisCent,
          hinweise: {
            kopfErkannt: optionen.hinweise?.kopfErkannt ?? true,
            datumErkannt: optionen.hinweise?.datumErkannt ?? true,
            absenderGekuerzt: optionen.hinweise?.absenderGekuerzt ?? false,
          },
        }),
      });
    }
  );

  await page.route(
    (url) => url.pathname === "/api/versand/status",
    async (route) => {
      stub.status.push(zugangsParameter(route.request().url()));
      if (optionen.statusFehler) {
        await antworteFehler(route, optionen.statusFehler);
        return;
      }
      // Answers on the very first poll, so a flow costs one poll interval and
      // never approaches the card's 60 s deadline.
      const status = optionen.status ?? "bereit";
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "Cache-Control": "no-store" },
        body: JSON.stringify({
          status,
          ebriefStatus:
            status === "adresse_warnung"
              ? "USER_CONFIRMATION_REQUESTED"
              : "COMPLETED_DOCUMENTS_PROCESS",
          docId: 8801,
        }),
      });
    }
  );

  await page.route(
    (url) => url.pathname === "/api/versand/adressvorschau",
    async (route) => {
      stub.adressvorschau.push(zugangsParameter(route.request().url()));
      await route.fulfill({
        status: 200,
        contentType: "application/pdf",
        body: "%PDF-1.4\n%stub\n",
      });
    }
  );

  await page.route(
    (url) => url.pathname === "/api/versand/checkout",
    async (route) => {
      stub.checkout.push(
        (route.request().postDataJSON() ?? {}) as Record<string, unknown>
      );
      if (optionen.checkoutFehler) {
        await antworteFehler(route, optionen.checkoutFehler);
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: optionen.checkoutUrl ?? STRIPE_STUB_URL }),
      });
    }
  );

  // The payment page itself. Stubbed unconditionally so that even a mistake in
  // the checkout stub cannot send the browser to a real Stripe host.
  await page.route(
    (url) => url.host === "checkout.stripe.test",
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: '<!doctype html><meta charset="utf-8"><title>Stripe (Stub)</title><body><h1 data-testid="stripe-stub">Stripe Checkout (Stub)</h1></body>',
      })
  );

  return stub;
}

/* ------------------------------------------------------------ scroll probe */

export interface ScrollProbe {
  start: number;
  end: number;
  min: number;
  max: number;
}

/**
 * Waits until the page has stopped scrolling.
 *
 * `html { scroll-behavior: smooth }` means any programmatic scroll - including
 * the one Playwright performs to make an element actionable - is still
 * animating a frame later. Measuring across it attributes the harness's
 * movement to the page.
 */
export async function waitForScrollIdle(page: Page, quietMs = 150) {
  await page.evaluate(async (quiet) => {
    let letzter = window.scrollY;
    let seit = performance.now();
    await new Promise<void>((fertig) => {
      const pruefen = () => {
        if (Math.abs(window.scrollY - letzter) > 0.5) {
          letzter = window.scrollY;
          seit = performance.now();
        }
        if (performance.now() - seit >= quiet) {
          fertig();
          return;
        }
        requestAnimationFrame(pruefen);
      };
      requestAnimationFrame(pruefen);
    });
  }, quietMs);
}

/** Puts the wizard card's top just under the fixed header, without animation. */
export async function parkCardUnderHeader(page: Page) {
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="wizard-card"]');
    if (!el) return;
    window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().top - 88,
      behavior: "auto",
    });
  });
  await waitForScrollIdle(page);
}

/** Starts sampling `window.scrollY` on every animation frame. */
export async function startScrollProbe(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __probe?: number[] };
    w.__probe = [window.scrollY];
    const tick = () => {
      w.__probe?.push(window.scrollY);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/**
 * Waits, then reports how far the page moved while it waited.
 *
 * `minMs` is a floor on the observation, not a convenience. The behaviour this
 * guards against scheduled its jump inside a `setTimeout(..., 100)` and then
 * animated it, so a probe that returned as soon as the page went quiet would
 * resolve before the jump had even started - and would pass on the very bug it
 * exists to catch.
 */
export async function stopScrollProbe(
  page: Page,
  { minMs = 600, quietMs = 150 } = {}
): Promise<ScrollProbe> {
  const werte = await page.evaluate(
    async ([min, quiet]) => {
      const w = window as unknown as { __probe?: number[] };
      const start = performance.now();
      let letzteBewegung = start;
      let letzterWert = window.scrollY;

      await new Promise<void>((fertig) => {
        const pruefen = () => {
          const jetzt = performance.now();
          if (Math.abs(window.scrollY - letzterWert) > 0.5) {
            letzterWert = window.scrollY;
            letzteBewegung = jetzt;
          }
          if (jetzt - start >= min && jetzt - letzteBewegung >= quiet) {
            fertig();
            return;
          }
          requestAnimationFrame(pruefen);
        };
        requestAnimationFrame(pruefen);
      });

      const proben = w.__probe ?? [window.scrollY];
      delete w.__probe;
      return proben;
    },
    [minMs, quietMs] as const
  );

  return {
    start: werte[0],
    end: werte[werte.length - 1],
    min: Math.min(...werte),
    max: Math.max(...werte),
  };
}

/** Fails if the document scrolls sideways - the classic mobile layout bug. */
export async function expectNoHorizontalOverflow(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    scrollWidth,
    `page scrolls horizontally: ${scrollWidth}px content in ${clientWidth}px viewport`
  ).toBeLessThanOrEqual(clientWidth + 1);
}
