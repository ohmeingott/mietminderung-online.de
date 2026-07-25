import { test, expect } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

test.describe("FAQ", () => {
  test("the landing-page accordion opens and closes one answer at a time", async ({
    page,
  }) => {
    await page.goto("/#faq");
    const faq = page.locator("#faq");

    const first = faq.getByRole("button", { name: "Was ist eine Mietminderung?" });
    const second = faq.getByRole("button", {
      name: "Muss der Vermieter die Mietminderung genehmigen?",
    });

    await expect(first).toHaveAttribute("aria-expanded", "false");

    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(faq.getByText(/Dieses Recht ergibt sich automatisch aus § 536 BGB/)).toBeVisible();

    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");

    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "false");
  });

  test("the landing page links through to the full FAQ", async ({ page }) => {
    await page.goto("/#faq");
    await page
      .locator("#faq")
      .getByRole("link", { name: /Alle Fragen & Antworten anzeigen/ })
      .click();

    await expect(page).toHaveURL(/\/faq$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Alle Fragen & Antworten"
    );
  });

  test("the /faq page lists every question and stays in the viewport", async ({ page }) => {
    await page.goto("/faq");

    const questions = page.getByRole("button", { expanded: false });
    // 12 FAQ entries plus the language switcher.
    expect(await questions.count()).toBeGreaterThanOrEqual(12);

    await expect(
      page.getByRole("button", { name: "Was ist bei energetischer Modernisierung?" })
    ).toBeVisible();

    await expectNoHorizontalOverflow(page);
  });

  test("exposes FAQPage structured data for search engines", async ({ page }) => {
    await page.goto("/faq");
    const jsonLd = await page.locator('script[type="application/ld+json"]').innerText();
    const parsed = JSON.parse(jsonLd);
    expect(parsed["@type"]).toBe("FAQPage");
    expect(parsed.mainEntity.length).toBe(12);
    expect(parsed.mainEntity[0].name).toBe("Was ist eine Mietminderung?");
  });
});
