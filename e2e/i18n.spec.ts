import { test, expect, type Page } from "@playwright/test";
import {
  answerEligibility,
  expectNoHorizontalOverflow,
  selectDefect,
  stubEnhanceApi,
} from "./helpers";

/**
 * The switcher's aria-label is itself translated, so target it by test id.
 *
 * Switching is a navigation now, not a state change: the language lives in the
 * URL so that each translation can be linked, shared and indexed. The wait for
 * the URL is what makes these tests deterministic - without it the assertions
 * race the page transition.
 */
async function switchLanguage(page: Page, code: string) {
  await page.getByTestId("language-switcher").click();
  await page.getByTestId(`locale-${code}`).click();
  await page.waitForURL(code === "de" ? /\/(?!(en|tr|uk|ru|ar|pl)\b)/ : new RegExp(`/${code}(/|$)`));
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
      ["/en", "Heating & Hot Water"],
      ["/uk", "Опалення та гаряча вода"],
      ["/ru", "Отопление и горячая вода"],
      ["/ar", "التدفئة والماء الساخن"],
      ["/pl", "Ogrzewanie i ciepła woda"],
      ["/", "Heizung & Warmwasser"],
    ] as const;

    // Each language is its own URL, so this walks the URLs rather than
    // toggling in place. Switching mid-wizard is a navigation and would reset
    // the answers - that is the accepted cost of having linkable translations.
    for (const [path, category] of expected) {
      await page.goto(path);
      await answerEligibility(page);
      await expect(page.getByTestId("kategorie-heizung")).toContainText(category);
    }
  });

  test("every language is served under its own URL", async ({ page }) => {
    // The whole point of the routing: a crawler fetching /tr must get Turkish
    // out of the initial HTML, without running any JavaScript.
    const res = await page.request.get("/tr");
    expect(res.ok()).toBeTruthy();
    const html = await res.text();

    expect(html).toContain("kira indirimi");
    expect(html, "the Turkish URL still serves German").not.toContain(
      "Schimmel, Lärm, kaputte Heizung",
    );
  });

  test("translated pages declare a reciprocal hreflang cluster", async ({
    page,
  }) => {
    for (const path of ["/", "/tr", "/faq", "/tr/faq"]) {
      await page.goto(path);

      const alternates = page.locator('link[rel="alternate"][hreflang]');
      // Seven languages plus x-default.
      await expect(alternates).toHaveCount(8);

      const xDefault = await page
        .locator('link[rel="alternate"][hreflang="x-default"]')
        .getAttribute("href");
      expect(
        xDefault,
        `${path} does not point x-default at the German version`,
      ).not.toMatch(/\/(en|tr|uk|ru|ar|pl)(\/|$)/);
    }
  });

  test("German-only content is not linked from a translated page", async ({
    page,
  }) => {
    await page.goto("/tr");

    // The guides, the table and the dispatch page exist only in German. Linking
    // them from the Turkish page would send both reader and crawler out of the
    // language the page claims to be in.
    for (const href of [
      "/ratgeber",
      "/mietminderungstabelle",
      "/maengelanzeige-versenden",
    ]) {
      await expect(
        page.locator(`a[href="${href}"]`),
        `${href} is linked from the Turkish homepage`,
      ).toHaveCount(0);
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

  test("the choice survives a reload and following in-language links", async ({
    page,
  }) => {
    await page.goto("/");
    await switchLanguage(page, "ru");
    await expect(page).toHaveURL(/\/ru$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "снижение арендной платы"
    );

    // Nothing is stored anywhere: it survives because the URL is the state.
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "снижение арендной платы"
    );

    // The navigation inside a translated page keeps the visitor in Russian
    // rather than dropping them onto the German /faq.
    await page.getByRole("link", { name: /Вопросы|FAQ/i }).first().click();
    await expect(page).toHaveURL(/\/ru\/faq$/);
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

    // The legal text keeps its German body, but the visitor keeps their
    // language: they land on the prefixed URL, not back on the German site.
    await expect(page).toHaveURL(/\/tr\/impressum$/);
    await expect(
      page.getByText(/nur die deutsche Fassung rechtsverbindlich/)
    ).toBeVisible();
  });

  test("the localised legal texts stay out of the index", async ({ page }) => {
    // Byte-identical German under seven URLs. The German original is the one
    // that belongs in the index.
    await page.goto("/tr/impressum");
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    expect(robots ?? "").toContain("noindex");

    await page.goto("/impressum");
    const german = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    expect(german ?? "", "the German Impressum must stay indexable").not.toContain(
      "noindex",
    );
  });
});
