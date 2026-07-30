import { test, expect } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

test.describe("Landing page and navigation", () => {
  test("renders every section", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Weniger Miete zahlen"
    );
    await expect(page.locator("#so-funktionierts")).toBeVisible();
    await expect(page.locator("#pruefung")).toBeVisible();
    await expect(page.locator("#maengelanzeige")).toBeVisible();
    await expect(page.locator("#faq")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("has no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await expectNoHorizontalOverflow(page);
  });

  test("interactive check sits directly beneath the hero", async ({ page }) => {
    await page.goto("/");

    // The check replaced the hero CTAs: it must come before "So
    // funktioniert's" and be usable without any prior click.
    const checkBeforeHow = await page.evaluate(() => {
      const check = document.querySelector("#pruefung");
      const how = document.querySelector("#so-funktionierts");
      return !!check && !!how &&
        !!(check.compareDocumentPosition(how) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(checkBeforeHow).toBe(true);

    await page.getByTestId("eq-mietvertrag-ja").click();
    await expect(page.getByTestId("eq-mangel_bekannt-nein")).toBeVisible();
  });

  test("every in-page anchor target exists", async ({ page }) => {
    await page.goto("/");

    const hashes = await page
      .locator('a[href*="#"]')
      .evaluateAll((links) =>
        links
          .map((l) => (l as HTMLAnchorElement).getAttribute("href") || "")
          .filter((h) => h.includes("#"))
          .map((h) => h.slice(h.indexOf("#") + 1))
          .filter(Boolean)
      );

    expect(hashes.length).toBeGreaterThan(0);
    for (const id of new Set(hashes)) {
      await expect(page.locator(`#${id}`), `missing anchor target #${id}`).toHaveCount(1);
    }
  });

  test("no link points at a dead route", async ({ page }) => {
    await page.goto("/");

    const hrefs = await page
      .locator("a[href^='/']")
      .evaluateAll((links) =>
        links.map((l) => (l as HTMLAnchorElement).getAttribute("href") || "")
      );

    const routes = new Set(
      hrefs.map((h) => h.split("#")[0]).filter((h) => h && h !== "/")
    );
    expect(routes.size).toBeGreaterThan(0);

    for (const route of routes) {
      const res = await page.request.get(route);
      expect(res.status(), `${route} returned ${res.status()}`).toBe(200);
    }
  });

  test("desktop navigation links scroll to their sections", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "desktop-only nav");
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Hauptnavigation" });
    await nav.getByRole("link", { name: "Anspruch prüfen" }).click();
    await expect(page).toHaveURL(/#pruefung$/);

    await nav.getByRole("link", { name: "So funktioniert's" }).click();
    await expect(page).toHaveURL(/#so-funktionierts$/);
  });

  test("mobile menu opens, navigates and closes", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "mobile-only menu");
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Menü öffnen" });
    await expect(toggle).toBeVisible();
    await toggle.click();

    const mobileNav = page.getByRole("navigation", { name: "Hauptnavigation mobil" });
    await expect(mobileNav).toBeVisible();

    await mobileNav.getByRole("link", { name: "Mängelanzeige" }).click();
    await expect(page).toHaveURL(/#maengelanzeige$/);
    await expect(mobileNav).toBeHidden();
  });

  test("404 page renders and links home", async ({ page }) => {
    const res = await page.goto("/diese-seite-gibt-es-nicht");
    expect(res?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Seite nicht gefunden" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Zur Startseite" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
