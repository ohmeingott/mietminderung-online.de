import { test, expect, type Page } from "@playwright/test";
import {
  answerEligibility,
  expectNoHorizontalOverflow,
  selectDefect,
  stubEnhanceApi,
} from "./helpers";

/** The switcher's aria-label is itself translated, so target it by test id. */
async function switchLanguage(page: Page, code: string) {
  await page.getByTestId("language-switcher").click();
  await page.getByTestId(`locale-${code}`).click();
}

test.describe("Language switching", () => {
  test("switches the UI and the defect catalogue to Turkish", async ({ page }) => {
    await page.goto("/");
    await switchLanguage(page, "tr");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "kira indirimi"
    );

    // The defect catalogue lives in the data file and is translated separately -
    // this guards against it staying German while the rest of the UI switches.
    await expect(page.getByTestId("eq-mietvertrag-ja")).toContainText("Evet");
    await answerEligibility(page);

    await expect(page.getByTestId("kategorie-heizung")).toContainText("Isıtma ve Sıcak Su");
    await page.getByTestId("kategorie-heizung").click();
    await expect(page.getByTestId("mangel-heizung_total")).toContainText(
      "Isıtma tamamen çalışmıyor"
    );
  });

  test("translates the defect catalogue in every language", async ({ page }) => {
    const expected = [
      ["en", "Heating & Hot Water"],
      ["uk", "Опалення та гаряча вода"],
      ["ru", "Отопление и горячая вода"],
      ["ar", "التدفئة والماء الساخن"],
      ["pl", "Ogrzewanie i ciepła woda"],
      ["de", "Heizung & Warmwasser"],
    ] as const;

    await page.goto("/");
    await answerEligibility(page);

    for (const [code, category] of expected) {
      await switchLanguage(page, code);
      await expect(page.getByTestId("kategorie-heizung")).toContainText(category);
    }
  });

  test("translates the FAQ answers", async ({ page }) => {
    await page.goto("/faq");
    await switchLanguage(page, "pl");

    const first = page.getByRole("button", { name: /Czym jest obniżka czynszu/ });
    await expect(first).toBeVisible();
    await first.click();
    await expect(page.getByText(/§ 536 niemieckiego kodeksu cywilnego/)).toBeVisible();
  });

  test("persists the choice across a reload and across pages", async ({ page }) => {
    await page.goto("/");
    await switchLanguage(page, "ru");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "снижение арендной платы"
    );

    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "снижение арендной платы"
    );

    await page.goto("/faq");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Все вопросы и ответы"
    );
  });

  test("Arabic switches the document to RTL", async ({ page }) => {
    await page.goto("/");
    await switchLanguage(page, "ar");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expectNoHorizontalOverflow(page);
  });

  test("sets the html lang attribute for each language", async ({ page }) => {
    await page.goto("/");

    for (const code of ["en", "uk", "pl", "de"] as const) {
      await switchLanguage(page, code);
      await expect(page.locator("html")).toHaveAttribute("lang", code);
    }
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("the generated letter stays German in a non-German UI", async ({ page }) => {
    await stubEnhanceApi(page);
    await page.goto("/");
    await switchLanguage(page, "tr");

    await answerEligibility(page);
    await selectDefect(page);
    await page.getByTestId("check-next").click();
    await page.getByTestId("rent-input").fill("1000");
    await page.getByTestId("check-submit").click();
    await page.getByTestId("check-create-letter").click();

    await page.getByTestId("mieter-name").fill("Ayşe Yılmaz");
    await page.getByTestId("mieter-strasse").fill("Musterstraße 10");
    await page.getByTestId("mieter-plz").fill("50676");
    await page.getByTestId("mieter-ort").fill("Köln");
    await page.getByTestId("mieter-email").fill("ayse@beispiel.de");
    await page.getByTestId("letter-next").click();

    await page.getByTestId("vermieter-name").fill("Hausverwaltung GmbH");
    await page.getByTestId("vermieter-strasse").fill("Vermieterstraße 5");
    await page.getByTestId("vermieter-plz").fill("50667");
    await page.getByTestId("vermieter-ort").fill("Köln");
    await page.getByTestId("letter-next").click();
    await page.getByTestId("letter-preview").click();

    // The textarea is filled on the step transition - wait for it before reading,
    // otherwise a slow mobile render hands back an empty string.
    const preview = page.getByTestId("brieftext");
    await expect(preview).not.toHaveValue("");

    const text = await preview.inputValue();
    // The recipient is a German landlord - the letter must not be translated.
    expect(text).toContain("Sehr geehrte/r");
    expect(text).toContain("Betreff: Mängelanzeige");
    expect(text).toContain("§ 536 Abs. 1 BGB");
    expect(text).toContain("Heizungsausfall (komplett)");
    expect(text).toContain("Mit freundlichen Grüßen");
  });

  test("shows a note that the legal pages are German only", async ({ page }) => {
    await page.goto("/impressum");
    await switchLanguage(page, "tr");
    await expect(
      page.getByText(/nur die deutsche Fassung rechtsverbindlich/)
    ).toBeVisible();
  });
});
