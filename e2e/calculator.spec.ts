import { test, expect } from "@playwright/test";
import {
  answerEligibility,
  completeCheck,
  expectNoHorizontalOverflow,
  selectDefect,
} from "./helpers";

test.describe("Mietminderung calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#pruefung");
  });

  test("walks the full funnel to a result", async ({ page }) => {
    await completeCheck(page, "1000");

    const check = page.locator("#pruefung");
    // Heizungsausfall (komplett) is typically 70 % → 700 € of a 1000 € rent.
    await expect(check.getByText("70%", { exact: true })).toBeVisible();
    await expect(check.getByText("700 €", { exact: true })).toBeVisible();
    await expect(page.getByTestId("check-create-letter")).toBeVisible();
  });

  test("recomputes when a second defect is added", async ({ page }) => {
    await answerEligibility(page);

    await selectDefect(page, "heizung", "heizung_unzureichend"); // 15 %
    await page.getByTestId("check-all-categories").click();
    await selectDefect(page, "aufzug", "aufzug_defekt"); // 10 %

    await page.getByTestId("check-next").click();
    await page.getByTestId("rent-input").fill("2000");
    await page.getByTestId("check-submit").click();

    // Courts weigh the overall impairment instead of adding quotas up, so the
    // largest counts in full and the second only at half: 15 + 10/2 = 20 %.
    const check = page.locator("#pruefung");
    await expect(check.getByText("20%", { exact: true })).toBeVisible();
    await expect(check.getByText("400 €", { exact: true })).toBeVisible();
  });

  test("shows a selection count and lets a defect be removed again", async ({ page }) => {
    await answerEligibility(page);
    await selectDefect(page);

    const check = page.locator("#pruefung");
    await expect(check.getByText(/1 Mangel\/Mängel ausgewählt/)).toBeVisible();

    await page.getByTestId("remove-heizung_total").click();
    await expect(check.getByText(/Mangel\/Mängel ausgewählt/)).toBeHidden();
    await expect(page.getByTestId("check-next")).toBeDisabled();
  });

  test("marks the category with the number of selected defects", async ({ page }) => {
    await answerEligibility(page);
    await selectDefect(page);
    await page.getByTestId("check-all-categories").click();

    await expect(page.getByTestId("kategorie-heizung")).toContainText("1");
  });

  test("blocks progress until a defect and a rent are entered", async ({ page }) => {
    await answerEligibility(page);
    await expect(page.getByTestId("check-next")).toBeDisabled();

    await selectDefect(page);
    await page.getByTestId("check-next").click();

    const submit = page.getByTestId("check-submit");
    await expect(submit).toBeDisabled();

    await page.getByTestId("rent-input").fill("0");
    await expect(submit).toBeDisabled();

    await page.getByTestId("rent-input").fill("850");
    await expect(submit).toBeEnabled();
  });

  test("the back buttons return to the previous step", async ({ page }) => {
    await answerEligibility(page);
    await selectDefect(page);
    await page.getByTestId("check-next").click();
    await expect(page.getByTestId("rent-input")).toBeVisible();

    // Going back keeps the open category and the previous selection.
    await page.getByTestId("check-back").click();
    await expect(page.getByTestId("mangel-heizung_total")).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await page.getByTestId("check-all-categories").click();
    await expect(page.getByTestId("kategorie-heizung")).toBeVisible();

    await page.getByTestId("check-back").click();
    await expect(page.getByTestId("eq-angezeigt-nein")).toBeVisible();
  });

  test("the eligibility back link steps through earlier questions", async ({ page }) => {
    await page.getByTestId("eq-mietvertrag-ja").click();
    await expect(page.getByTestId("eq-mangel_bekannt-nein")).toBeVisible();

    await page.getByTestId("check-eq-back").click();
    await expect(page.getByTestId("eq-mietvertrag-ja")).toBeVisible();
  });

  test("a missing lease disqualifies with a reason and can be retried", async ({ page }) => {
    await page.getByTestId("eq-mietvertrag-nein").click();

    const check = page.locator("#pruefung");
    await expect(
      check.getByRole("heading", { name: "Wahrscheinlich kein Anspruch" })
    ).toBeVisible();
    await expect(
      check.getByText("Ohne gültigen Mietvertrag besteht leider kein Anspruch")
    ).toBeVisible();

    await check.getByRole("button", { name: "Erneut prüfen" }).click();
    await expect(page.getByTestId("eq-mietvertrag-ja")).toBeVisible();
  });

  test("a minor defect no longer ends the funnel", async ({ page }) => {
    // Several minor defects together can cross the threshold of
    // Section 536 (1) sentence 3 BGB, and at this point no defect has been
    // picked yet - so "gering" must not disqualify outright.
    await page.getByTestId("eq-mietvertrag-ja").click();
    await page.getByTestId("eq-mangel_bekannt-nein").click();
    await page.getByTestId("eq-selbst_verursacht-nein").click();
    await page.getByTestId("eq-erheblich-gering").click();

    await expect(page.getByTestId("eq-angezeigt-nein")).toBeVisible();
    await page.getByTestId("eq-angezeigt-nein").click();
    await expect(page.getByTestId("kategorie-heizung")).toBeVisible();
  });

  test("knowing the defect at signing without reservation does not end the funnel", async ({
    page,
  }) => {
    // Section 536b BGB bars the claim only for that one defect, and the
    // repair claim under Section 535 (1) sentence 2 BGB survives regardless.
    await page.getByTestId("eq-mietvertrag-ja").click();
    await page.getByTestId("eq-mangel_bekannt-ja").click();

    await expect(page.getByTestId("eq-selbst_verursacht-nein")).toBeVisible();
  });

  test("mutually exclusive defects replace one another", async ({ page }) => {
    await answerEligibility(page);
    await selectDefect(page, "heizung", "heizung_total");
    await page.getByTestId("mangel-heizung_teilweise").click();

    // Picking the partial outage clears the total one: a heating system
    // cannot be fully and partly out at the same time.
    await expect(page.getByTestId("mangel-heizung_total")).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    await expect(page.getByTestId("mangel-heizung_teilweise")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(
      page.locator("#pruefung").getByText(/1 Mangel\/Mängel ausgewählt/)
    ).toBeVisible();
  });

  test("the floor-area shortfall is computed, not estimated", async ({ page }) => {
    await answerEligibility(page);
    await selectDefect(page, "wohnflaeche", "wohnflaeche_10");

    const panel = page.getByTestId("wohnflaeche-panel");
    await expect(panel).toBeVisible();

    // Exactly 10 % is still no defect - the threshold must be exceeded.
    await page.getByTestId("flaeche-vereinbart").fill("100");
    await page.getByTestId("flaeche-tatsaechlich").fill("90");
    await expect(page.getByTestId("flaeche-ergebnis")).toContainText("0 %");

    // Above it the rent drops by the full deviation, not by the excess.
    await page.getByTestId("flaeche-tatsaechlich").fill("88");
    await expect(page.getByTestId("flaeche-ergebnis")).toContainText("12 %");

    await page.getByTestId("check-next").click();
    await page.getByTestId("rent-input").fill("1000");
    await page.getByTestId("check-submit").click();

    const check = page.locator("#pruefung");
    await expect(check.getByText("12%", { exact: true })).toBeVisible();
    await expect(check.getByText("120 €", { exact: true })).toBeVisible();
  });

  test("a self-inflicted defect disqualifies", async ({ page }) => {
    await page.getByTestId("eq-mietvertrag-ja").click();
    await page.getByTestId("eq-mangel_bekannt-nein").click();
    await page.getByTestId("eq-selbst_verursacht-ja").click();

    await expect(
      page.locator("#pruefung").getByRole("heading", { name: "Wahrscheinlich kein Anspruch" })
    ).toBeVisible();
  });

  test("caps the total reduction at 100 %", async ({ page }) => {
    await answerEligibility(page);

    // Two severe defects whose maxima add up beyond 100 %.
    await selectDefect(page, "heizung", "heizung_total"); // 70–100 %
    await page.getByTestId("check-all-categories").click();
    await selectDefect(page, "feuchtigkeit", "schimmel_stark"); // 20–50 %

    await page.getByTestId("check-next").click();
    await page.getByTestId("rent-input").fill("1000");
    await page.getByTestId("check-submit").click();

    const percentages = await page
      .locator("#pruefung")
      .getByText(/^\d+%$/)
      .allInnerTexts();
    for (const value of percentages) {
      expect(parseInt(value, 10)).toBeLessThanOrEqual(100);
    }
  });

  test("stays within the viewport on every step", async ({ page }) => {
    await expectNoHorizontalOverflow(page);

    await answerEligibility(page);
    await expectNoHorizontalOverflow(page);

    await selectDefect(page);
    await expectNoHorizontalOverflow(page);

    await page.getByTestId("check-next").click();
    await page.getByTestId("rent-input").fill("1234");
    await page.getByTestId("check-submit").click();
    await expectNoHorizontalOverflow(page);
  });
});
