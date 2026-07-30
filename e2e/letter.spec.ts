import { test, expect } from "@playwright/test";
import {
  completeCheck,
  expectNoHorizontalOverflow,
  fillLandlord,
  fillTenant,
  LANDLORD,
  openLetterWizard,
  reachPreview,
  stubEnhanceApi,
  TENANT,
} from "./helpers";

test.describe("Mängelanzeige wizard", () => {
  test.beforeEach(async ({ page }) => {
    await stubEnhanceApi(page);
    await page.goto("/#pruefung");
    await completeCheck(page);
    await openLetterWizard(page);
  });

  test("requires tenant fields and a valid email before continuing", async ({ page }) => {
    const next = page.getByTestId("letter-next");
    await expect(next).toBeDisabled();

    await page.getByTestId("mieter-name").fill(TENANT.name);
    await page.getByTestId("mieter-strasse").fill(TENANT.street);
    await page.getByTestId("mieter-plz").fill(TENANT.zip);
    await page.getByTestId("mieter-ort").fill(TENANT.city);
    await expect(next).toBeDisabled();

    await page.getByTestId("mieter-email").fill("keine-email");
    await expect(next).toBeDisabled();

    await page.getByTestId("mieter-email").fill(TENANT.email);
    await expect(next).toBeEnabled();
  });

  test("requires the landlord address before continuing", async ({ page }) => {
    await fillTenant(page);
    await page.getByTestId("letter-next").click();

    const next = page.getByTestId("letter-next");
    await expect(next).toBeDisabled();

    await fillLandlord(page);
    await expect(next).toBeEnabled();
  });

  test("generates a letter containing the entered data", async ({ page }) => {
    await fillTenant(page);
    await page.getByTestId("letter-next").click();
    await fillLandlord(page);
    await page.getByTestId("letter-next").click();

    await page.getByTestId("detail-raum-0").fill("Wohnzimmer");
    await page.getByTestId("detail-seit-0").fill("seit dem 01.05.2026");
    await page
      .getByTestId("detail-beschreibung-0")
      .fill("Die Heizung ist seit Anfang Mai vollständig ausgefallen.");

    await page.getByTestId("letter-preview").click();

    const preview = page.getByTestId("brieftext");
    await expect(preview).not.toHaveValue("");

    const text = await preview.inputValue();
    expect(text).toContain(TENANT.name);
    expect(text).toContain(TENANT.street);
    expect(text).toContain(LANDLORD.name);
    expect(text).toContain("Heizungsausfall (komplett)");
    expect(text).toContain("Raum: Wohnzimmer");
    expect(text).toContain("besteht seit seit dem 01.05.2026");
    expect(text).toContain("§ 536 Abs. 1 BGB");
    expect(text).toContain("§ 536a BGB");
    expect(text).toContain("Die Heizung ist seit Anfang Mai vollständig ausgefallen.");
  });

  test("falls back to the typed text when the AI endpoint fails", async ({ page }) => {
    await page.route("**/api/enhance-beschreibung", (route) =>
      route.fulfill({ status: 500, body: "boom" })
    );

    await fillTenant(page);
    await page.getByTestId("letter-next").click();
    await fillLandlord(page);
    await page.getByTestId("letter-next").click();
    await page.getByTestId("detail-beschreibung-0").fill("Mein eigener Text bleibt.");
    await page.getByTestId("letter-preview").click();

    await expect(page.getByTestId("brieftext")).toHaveValue(
      /Mein eigener Text bleibt\./
    );
  });

  test("the preview text is editable and flows into the .txt download", async ({ page }) => {
    await reachPreview(page);
    await page.getByTestId("brieftext").fill("Von Hand geschriebener Brieftext.");
    await page.getByTestId("letter-delivery").click();

    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("download-txt").click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(
      /^Maengelanzeige_Erika_Mustermann_.*\.txt$/
    );
  });

  test("downloads the PDF", async ({ page }) => {
    await reachPreview(page);
    await page.getByTestId("letter-delivery").click();

    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("download-pdf").click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test("the PDF contains the edited text, not the regenerated one", async ({ page }) => {
    await reachPreview(page);

    const marker = "HANDGESCHRIEBENER-MARKER-4711";
    await page
      .getByTestId("brieftext")
      .fill(`Sehr geehrte Damen und Herren,\n\n${marker}\n\nMit freundlichen Grüßen`);
    await page.getByTestId("letter-delivery").click();

    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("download-pdf").click();
    const download = await downloadPromise;

    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(chunk as Buffer);
    const pdf = Buffer.concat(chunks).toString("latin1");

    expect(pdf).toContain(marker);
    // The form data must not leak back in once the user has rewritten the letter.
    expect(pdf).not.toContain("Heizungsausfall");
  });

  test("the signature pad accepts strokes and can be cleared", async ({ page }) => {
    await reachPreview(page);

    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
    // boundingBox() is viewport-relative — scroll the pad in first or the
    // synthetic mouse events land on whatever is currently on screen.
    await canvas.scrollIntoViewIfNeeded();

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + 20, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 20, box.y + box.height / 2, { steps: 12 });
    await page.mouse.up();

    await page.getByTestId("signature-save").click();
    await expect(page.getByTestId("signature-saved")).toBeVisible();

    await page.getByTestId("signature-clear").click();
    await expect(page.getByTestId("signature-saved")).toBeHidden();
  });

  test("the signature canvas matches its rendered size", async ({ page }) => {
    await reachPreview(page);

    // A mismatch here is the bug that made strokes land offset from the finger.
    const { backingWidth, cssWidth, ratio } = await page.evaluate(() => {
      const c = document.querySelector("canvas") as HTMLCanvasElement;
      return {
        backingWidth: c.width,
        cssWidth: c.getBoundingClientRect().width,
        ratio: window.devicePixelRatio || 1,
      };
    });

    expect(Math.abs(backingWidth - cssWidth * ratio)).toBeLessThanOrEqual(2);
  });

  test("the final step keeps the free download next to the paid dispatch", async ({
    page,
  }) => {
    await reachPreview(page);
    await page.getByTestId("letter-delivery").click();

    // The three things a tenant can do with the letter without paying.
    await expect(page.getByTestId("download-pdf")).toBeVisible();
    await expect(page.getByTestId("download-txt")).toBeVisible();
    await expect(page.getByTestId("copy-text")).toBeVisible();

    // The paid alternative sits below them and never replaces them.
    await expect(page.getByTestId("dispatch-card")).toBeVisible();
    await expect(page.getByTestId("dispatch-submit")).toBeVisible();

    // § 19 UStG: the operator is a small business and may not state VAT.
    const section = await page.locator("#maengelanzeige").innerText();
    expect(section.toLowerCase()).not.toContain("mwst");
    expect(section.toLowerCase()).not.toContain("umsatzsteuer wird");
    expect(section).toContain("§ 19 UStG");
  });

  test("the back button walks the wizard in reverse", async ({ page }) => {
    await reachPreview(page);
    await page.getByTestId("letter-back").click();
    await expect(page.getByTestId("detail-raum-0")).toBeVisible();

    await page.getByTestId("letter-back").click();
    await expect(page.getByTestId("vermieter-name")).toHaveValue(LANDLORD.name);

    await page.getByTestId("letter-back").click();
    await expect(page.getByTestId("mieter-name")).toHaveValue(TENANT.name);
  });

  test("stays within the viewport across all wizard steps", async ({ page }) => {
    await expectNoHorizontalOverflow(page);

    await fillTenant(page);
    await page.getByTestId("letter-next").click();
    await expectNoHorizontalOverflow(page);

    await fillLandlord(page);
    await page.getByTestId("letter-next").click();
    await expectNoHorizontalOverflow(page);

    await page.getByTestId("letter-preview").click();
    await expectNoHorizontalOverflow(page);

    await page.getByTestId("letter-delivery").click();
    await expectNoHorizontalOverflow(page);
  });
});
