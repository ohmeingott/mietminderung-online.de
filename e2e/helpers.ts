import { expect, type Page } from "@playwright/test";

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
  await page.getByTestId("mieter-email").fill(tenant.email);
}

export async function fillLandlord(page: Page, landlord = LANDLORD) {
  await page.getByTestId("vermieter-name").fill(landlord.name);
  await page.getByTestId("vermieter-strasse").fill(landlord.street);
  await page.getByTestId("vermieter-plz").fill(landlord.zip);
  await page.getByTestId("vermieter-ort").fill(landlord.city);
}

/** Tenant step → landlord step → defect details step → letter preview. */
export async function reachPreview(page: Page) {
  await fillTenant(page);
  await page.getByTestId("letter-next").click();
  await fillLandlord(page);
  await page.getByTestId("letter-next").click();
  await page.getByTestId("letter-preview").click();
  // The textarea mounts empty and is filled by an effect — wait for content,
  // not just for the element.
  await expect(page.getByTestId("brieftext")).not.toHaveValue("");
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

/** Fails if the document scrolls sideways — the classic mobile layout bug. */
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
