import { test, expect, type Locator, type Page } from "@playwright/test";
import {
  completeCheck,
  erwarteterSteuerhinweis,
  istKleinunternehmer,
  LANDLORD,
  openLetterWizard,
  reachPreview,
  stubEnhanceApi,
  stubVersandApi,
  STRIPE_STUB_URL,
  TENANT,
  VERSAND_JOB_ID,
  VERSAND_TOKEN,
} from "./helpers";
import { PRODUKTE } from "../src/lib/ebrief/produkte";

/**
 * The paid postal dispatch in step 4. Nothing here talks to eBrief or Stripe —
 * see stubVersandApi in ./helpers — so every case is driven by what the stub
 * answers and checked against what the browser sent back.
 */

/** The card formats prices in German regardless of the UI language. */
const preis = (cent: number) =>
  (cent / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

/**
 * The currency formatter separates the amount from the symbol with a
 * non-breaking space, which innerText is under no obligation to reproduce.
 */
const normalisiert = (text: string) => text.replace(/[\u00a0\u202f]/g, " ");

/** The clickable row a product radio sits in, label and price included. */
const produktZeile = (page: Page, id: keyof typeof PRODUKTE): Locator =>
  page.getByTestId(`dispatch-option-${id}`).locator("xpath=ancestor::label[1]");

/** Calculator → letter wizard → preview → step 4, where the card lives. */
async function reachDispatchCard(page: Page) {
  await stubEnhanceApi(page);
  await page.goto("/#pruefung");
  await completeCheck(page);
  await openLetterWizard(page);
  await reachPreview(page);
  await page.getByTestId("letter-delivery").click();
  await expect(page.getByTestId("dispatch-card")).toBeVisible();
  // The card is where the e-mail is asked for now, so every test that wants a
  // dispatchable card has to supply one here. That the field appears at all,
  // and that dispatch stays locked without it, is covered in wizard.spec.ts.
  await page.getByTestId("dispatch-email").fill(TENANT.email);
}

/**
 * The paid option is an addition, never a replacement. Asserted in every state
 * the card can be in: a tenant who cannot or will not pay must always still be
 * able to take the letter away.
 */
async function expectFreeDownloadIntact(page: Page) {
  await expect(page.getByTestId("download-pdf")).toBeVisible();
  await expect(page.getByTestId("download-txt")).toBeVisible();
  await expect(page.getByTestId("copy-text")).toBeVisible();
  await expect(page.getByTestId("dispatch-card")).toBeVisible();
}

/**
 * The § 356 Abs. 4 BGB declaration gates the order button, so every path that
 * reaches checkout has to make it — exactly as a real user would.
 */
async function zustimmen(page: Page) {
  await page.getByTestId("dispatch-consent").check();
}

/** The switcher's aria-label is itself translated, so target it by test id. */
async function switchLanguage(page: Page, code: string) {
  await page.getByTestId("language-switcher").click();
  await page.getByTestId(`locale-${code}`).click();
}

test.describe("Postversand (eBrief)", () => {
  test("offers both products at the catalogue prices and states no VAT", async ({
    page,
  }) => {
    await stubVersandApi(page);
    await reachDispatchCard(page);

    const brief = produktZeile(page, "brief");
    const einschreiben = produktZeile(page, "einwurfEinschreiben");
    await expect(brief).toBeVisible();
    await expect(einschreiben).toBeVisible();

    // The prices on the card and the prices the server charges come from the
    // same catalogue — a divergence would be a price nobody agreed to.
    expect(normalisiert(await brief.innerText())).toContain(
      normalisiert(preis(PRODUKTE.brief.preisCent))
    );
    expect(normalisiert(await einschreiben.innerText())).toContain(
      normalisiert(preis(PRODUKTE.einwurfEinschreiben.preisCent))
    );

    // The tax note, in whichever mode the server runs. Under § 19 UStG an
    // "inkl. 19 % MwSt." slipped in here would be a tax statement owed under
    // § 14c UStG, so its absence is asserted rather than assumed.
    const karte = normalisiert(await page.getByTestId("dispatch-card").innerText());
    expect(karte).toContain(normalisiert(erwarteterSteuerhinweis()));
    if (istKleinunternehmer()) {
      expect(karte.toLowerCase()).not.toContain("mwst");
      expect(karte).not.toMatch(/19\s*%/);
    }
  });

  test("sells the tracked option as an Einwurf-Einschreiben, not as an Einschreiben", async ({
    page,
  }) => {
    await stubVersandApi(page);
    await reachDispatchCard(page);

    const zeile = await produktZeile(page, "einwurfEinschreiben").innerText();
    expect(zeile).toContain("Einwurf-Einschreiben");
    // A bare "Einschreiben" would promise a signature on handover that this
    // product does not include.
    expect(zeile.replace(/Einwurf-Einschreiben/g, "")).not.toContain("Einschreiben");

    const karte = await page.getByTestId("dispatch-card").innerText();
    expect(karte).toContain(
      "kein Übergabe-Einschreiben mit Unterschrift des Empfängers"
    );
    // And the card does not sell the tracking as proof of receipt either. What
    // the customer gets is a shipment number, a tracking link and an email once
    // delivery is reported — the card now says all three, and says what they
    // are not. See src/lib/versandNachlauf.ts.
    expect(karte).toContain("Sendungsnummer und Verfolgungslink");
    expect(karte).toContain("kann kein Postprodukt erbringen");
  });

  test("keeps the order button locked until the withdrawal declaration is made", async ({
    page,
  }) => {
    const stub = await stubVersandApi(page, { status: "bereit" });
    await reachDispatchCard(page);

    // Unticked on arrival. A pre-selected box is not the "ausdrückliche
    // Zustimmung" § 356 Abs. 4 BGB asks for, and the whole declaration would
    // be worthless if the user never had to make it.
    const kasten = page.getByTestId("dispatch-consent");
    await expect(kasten).not.toBeChecked();
    await expect(page.getByTestId("dispatch-submit")).toBeDisabled();

    // Both halves of the declaration have to be on the page, not just a link
    // to them: the request to start early, and the loss of the right.
    const karte = await page.getByTestId("dispatch-card").innerText();
    expect(karte).toContain("Ich verlange ausdrücklich");
    expect(karte).toContain("Widerrufsrecht erlischt");

    await kasten.check();
    await expect(page.getByTestId("dispatch-submit")).toBeEnabled();

    // And it is revocable right up to the order — unticking locks it again.
    await kasten.uncheck();
    await expect(page.getByTestId("dispatch-submit")).toBeDisabled();

    expect(stub.checkout).toHaveLength(0);
    await expectFreeDownloadIntact(page);
  });

  test("links the withdrawal terms from the dispatch card", async ({ page }) => {
    await stubVersandApi(page);
    await reachDispatchCard(page);

    const link = page
      .getByTestId("dispatch-card")
      .getByRole("link", { name: "Widerrufsbelehrung" });
    // A new tab: the letter lives in React state and does not survive a
    // navigation, so reading the terms must not cost the tenant their draft.
    await expect(link).toHaveAttribute("href", "/widerruf");
    await expect(link).toHaveAttribute("target", "_blank");
  });

  test("prepares the job, waits for the ready status and opens the payment page", async ({
    page,
  }) => {
    const stub = await stubVersandApi(page, { status: "bereit" });
    await reachDispatchCard(page);
    await expectFreeDownloadIntact(page);

    await zustimmen(page);
    await page.getByTestId("dispatch-submit").click();
    await page.waitForURL(/checkout\.stripe\.test/);
    expect(page.url()).toBe(STRIPE_STUB_URL);

    // The letter that was reviewed is the letter that was sent to the server.
    expect(stub.vorbereiten).toHaveLength(1);
    const vorbereitet = stub.vorbereiten[0];
    expect(vorbereitet.produktId).toBe("brief");
    expect(String(vorbereitet.text)).toContain(TENANT.name);
    expect(String(vorbereitet.text)).toContain(LANDLORD.name);
    expect(vorbereitet.mieter).toMatchObject({
      name: TENANT.name,
      email: TENANT.email,
    });
    expect(vorbereitet.vermieter).toMatchObject({ name: LANDLORD.name });

    // The status poll carries the capability token, not the bare job id.
    expect(stub.status.length).toBeGreaterThanOrEqual(1);
    expect(stub.status[0]).toEqual({
      jobId: String(VERSAND_JOB_ID),
      token: VERSAND_TOKEN,
    });

    expect(stub.checkout).toHaveLength(1);
    expect(stub.checkout[0]).toEqual({
      jobId: VERSAND_JOB_ID,
      produktId: "brief",
      token: VERSAND_TOKEN,
      // Without this the server refuses the session — the letter would go out
      // while the tenant still had fourteen days to withdraw.
      zustimmung: true,
    });
  });

  test("holds the address warning until it is confirmed, then pays for the same job", async ({
    page,
  }) => {
    const stub = await stubVersandApi(page, { status: "adresse_warnung" });
    await reachDispatchCard(page);

    await page.getByTestId("dispatch-option-einwurfEinschreiben").check();
    await zustimmen(page);
    await page.getByTestId("dispatch-submit").click();

    const warnung = page.getByTestId("dispatch-address-warning");
    await expect(warnung).toBeVisible();
    await expect(page.getByTestId("dispatch-fix-address")).toBeVisible();
    await expectFreeDownloadIntact(page);

    // Nothing may head for the payment page while the address is in doubt.
    expect(stub.checkout).toHaveLength(0);
    expect(page.url()).not.toContain("checkout.stripe.test");

    // The preview is what lets the user check the address before paying, and
    // it is only reachable with the capability token.
    const href = await page.getByTestId("dispatch-address-preview").getAttribute("href");
    expect(href).toContain("/api/versand/adressvorschau");
    expect(href).toContain(`jobId=${VERSAND_JOB_ID}`);
    expect(href).toContain(`token=${encodeURIComponent(VERSAND_TOKEN)}`);

    await page.getByTestId("dispatch-submit").click();
    await page.waitForURL(/checkout\.stripe\.test/);

    // Paying for a different job than the one that was inspected would post a
    // letter nobody looked at, so the identity is asserted, not the count only.
    expect(stub.vorbereiten).toHaveLength(1);
    expect(stub.checkout).toHaveLength(1);
    expect(stub.checkout[0]).toEqual({
      jobId: VERSAND_JOB_ID,
      produktId: "einwurfEinschreiben",
      token: VERSAND_TOKEN,
      zustimmung: true,
    });
  });

  test("shows anschrift_zu_lang as a sentence the tenant can act on", async ({
    page,
  }) => {
    await stubVersandApi(page, {
      vorbereitenFehler: { status: 422, slug: "anschrift_zu_lang" },
    });
    await reachDispatchCard(page);
    await zustimmen(page);
    await page.getByTestId("dispatch-submit").click();

    const fehler = page.getByTestId("dispatch-error");
    await expect(fehler).toBeVisible();
    await expect(fehler).toContainText(
      "Die Anschrift des Vermieters ist zu lang für das Adressfeld."
    );
    expect((await fehler.innerText()).trim().length).toBeGreaterThan(20);

    await expectFreeDownloadIntact(page);
    await expect(page.getByTestId("dispatch-submit")).toBeEnabled();
  });

  test("falls back to the generic message for a slug it does not know", async ({
    page,
  }) => {
    await stubVersandApi(page, {
      vorbereitenFehler: { status: 500, slug: "voellig_unbekannter_slug" },
    });
    await reachDispatchCard(page);
    await zustimmen(page);
    await page.getByTestId("dispatch-submit").click();

    const fehler = page.getByTestId("dispatch-error");
    await expect(fehler).toBeVisible();
    const text = (await fehler.innerText()).trim();
    expect(text.length).toBeGreaterThan(20);
    expect(text).toContain("Der Versand ist gerade nicht möglich.");
    // The untranslated key or the raw slug must never reach the user.
    expect(text).not.toContain("dispatch.error");
    expect(text).not.toContain("voellig_unbekannter_slug");

    await expectFreeDownloadIntact(page);
  });

  test("still writes a sentence into the error box when the connection drops", async ({
    page,
  }) => {
    // The regression this guards: a dropped request leaves no slug behind, and
    // the box used to render as an alert icon with no text next to it.
    await stubVersandApi(page, { vorbereitenFehler: { abbruch: true } });
    await reachDispatchCard(page);
    await zustimmen(page);
    await page.getByTestId("dispatch-submit").click();

    const fehler = page.getByTestId("dispatch-error");
    await expect(fehler).toBeVisible();
    const text = (await fehler.innerText()).trim();
    expect(text.length).toBeGreaterThan(20);
    expect(text).toContain("Der Versand ist gerade nicht möglich.");

    await expectFreeDownloadIntact(page);
    await expect(page.getByTestId("dispatch-submit")).toBeEnabled();
  });

  test("reports a checkout that never opened without claiming a charge", async ({
    page,
  }) => {
    const stub = await stubVersandApi(page, {
      status: "bereit",
      checkoutFehler: { status: 502, slug: "checkout_fehler" },
    });
    await reachDispatchCard(page);
    await zustimmen(page);
    await page.getByTestId("dispatch-submit").click();

    const fehler = page.getByTestId("dispatch-error");
    await expect(fehler).toBeVisible();
    await expect(fehler).toContainText("Die Bezahlseite konnte nicht geöffnet werden.");
    await expect(fehler).toContainText("es wurde nichts berechnet");

    expect(stub.checkout).toHaveLength(1);
    expect(page.url()).not.toContain("checkout.stripe.test");
    await expectFreeDownloadIntact(page);
  });

  test("the Stripe success page says the letter is on its way", async ({ page }) => {
    await page.goto("/versand/erfolg");

    const box = page.getByTestId("versand-ergebnis-erfolg");
    await expect(box).toBeVisible();
    await expect(box).toContainText("Zahlung erfolgreich");
    // Future tense: printing and posting happen in the webhook, afterwards.
    await expect(box).toContainText(
      "wird jetzt gedruckt und per Post an Ihren Vermieter versendet"
    );
    await expect(page.getByTestId("versand-ergebnis-abbruch")).toHaveCount(0);
  });

  test("the Stripe cancel page says nothing was sent and nothing was charged", async ({
    page,
  }) => {
    await page.goto("/versand/abbruch");

    const box = page.getByTestId("versand-ergebnis-abbruch");
    await expect(box).toBeVisible();
    await expect(box).toContainText("Zahlung abgebrochen");
    await expect(box).toContainText("Es wurde nichts versendet und nichts berechnet.");
    await expect(page.getByTestId("versand-ergebnis-erfolg")).toHaveCount(0);
  });

  test("translates the whole dispatch path in a non-German UI", async ({ page }) => {
    const stub = await stubVersandApi(page, { status: "adresse_warnung" });
    await stubEnhanceApi(page);
    await page.goto("/#pruefung");
    await switchLanguage(page, "tr");

    await completeCheck(page);
    await openLetterWizard(page);
    await reachPreview(page);
    await page.getByTestId("letter-delivery").click();

    const karte = page.getByTestId("dispatch-card");
    await expect(karte).toBeVisible();
    await expect(karte).toContainText("Doğrudan ev sahibine gönderin");
    await expect(karte).toContainText("Gönderim türünü seçin");
    // The tax note must survive translation — it is the price statement.
    await expect(karte).toContainText(erwarteterSteuerhinweis("tr"));
    // The German product name is kept on purpose; the explanation is not.
    await expect(karte).toContainText("Übergabe-Einschreiben değildir");
    await expect(page.getByTestId("dispatch-submit")).toContainText(
      "Ücretli olarak gönder"
    );

    await page.getByTestId("dispatch-email").fill(TENANT.email);
    await zustimmen(page);
    await page.getByTestId("dispatch-submit").click();
    await expect(page.getByTestId("dispatch-address-warning")).toContainText(
      "Ev sahibinin adresi kesin olarak doğrulanamadı"
    );
    await expect(page.getByTestId("dispatch-address-preview")).toContainText(
      "Algılanan adresi görüntüle"
    );
    await expect(page.getByTestId("dispatch-submit")).toContainText("Adres doğru");
    // No German fallback leaked through in the translated path.
    expect(await karte.innerText()).not.toContain("Kostenpflichtig versenden");

    await expectFreeDownloadIntact(page);
    expect(stub.checkout).toHaveLength(0);
  });
});
