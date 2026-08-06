import { test, expect } from "@playwright/test";

/**
 * Guards the localized guide routes.
 *
 * These pages exist under a URL that is translated segment by segment, which
 * means three things have to agree that nothing else in the codebase forces to
 * agree: the route has to resolve, the canonical has to name the translated
 * URL, and the `hreflang` cluster has to be reciprocal with the German
 * original. A cluster that only points one way is ignored by Google, so a
 * silent break here costs exactly the reach the translation was built for.
 *
 * The German slug under a locale prefix must stay a 404. If both
 * `/tr/rehber/...` and `/tr/ratgeber/...` answered, the translated page would
 * compete with a duplicate of itself.
 */

const PRODUCTION_ORIGIN = "https://mietminderung-online.de";
const ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_ORIGIN
).replace(/\/+$/, "");

/** The Turkish guide that is translated, and its German original. */
const DEUTSCH = "/ratgeber/maengelanzeige-schreiben";
const TUERKISCH = "/tr/rehber/ayip-bildirimi-yazma";

function alternates(html: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of html.matchAll(
    /<link[^>]+rel="alternate"[^>]*>/gi,
  )) {
    const tag = m[0];
    const lang = /hreflang="([^"]+)"/i.exec(tag)?.[1];
    const href = /href="([^"]+)"/i.exec(tag)?.[1];
    if (lang && href) out[lang] = href;
  }
  return out;
}

test.describe("Localized guides", () => {
  test("the translated URL resolves and names itself as canonical", async ({
    page,
  }) => {
    const response = await page.goto(TUERKISCH);
    expect(response?.status()).toBe(200);

    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toBe(`${ORIGIN}${TUERKISCH}`);

    // The page is actually Turkish, not the German fallback under a Turkish URL.
    await expect(page.locator("h1")).toContainText("Ayıp bildirimi");
  });

  test("the machine-translation notice links to the German original", async ({
    page,
  }) => {
    await page.goto(TUERKISCH);
    const link = page.locator(`a[href="${DEUTSCH}"]`).first();
    await expect(link).toBeVisible();
  });

  test("the hreflang cluster is reciprocal", async ({ page }) => {
    await page.goto(TUERKISCH);
    const tr = alternates(await page.content());

    await page.goto(DEUTSCH);
    const de = alternates(await page.content());

    // Each side names both languages, with the same URLs.
    expect(tr.de).toBe(`${ORIGIN}${DEUTSCH}`);
    expect(tr.tr).toBe(`${ORIGIN}${TUERKISCH}`);
    expect(de.de).toBe(`${ORIGIN}${DEUTSCH}`);
    expect(de.tr).toBe(`${ORIGIN}${TUERKISCH}`);
    expect(de["x-default"]).toBe(`${ORIGIN}${DEUTSCH}`);
  });

  test("an untranslated guide claims no translations", async ({ page }) => {
    await page.goto("/ratgeber/mietminderung-berechnen");
    const langs = alternates(await page.content());

    // Only German and x-default. Naming /tr/... here would point the cluster
    // at a URL that 404s.
    expect(Object.keys(langs).sort()).toEqual(["de", "x-default"]);
  });

  test("the German slug under a locale prefix stays a 404", async ({
    page,
  }) => {
    const duplikat = await page.goto("/tr/ratgeber/maengelanzeige-schreiben");
    expect(duplikat?.status()).toBe(404);

    const unuebersetzt = await page.goto("/tr/rehber/mietminderung-berechnen");
    expect(unuebersetzt?.status()).toBe(404);
  });

  test("the localized hub lists only the guides that language has", async ({
    page,
  }) => {
    const response = await page.goto("/tr/rehber");
    expect(response?.status()).toBe(200);

    // Scoped to the article grid: the footer lists the same guides, so an
    // unscoped locator counts every entry twice.
    const links = page.locator('main article a[href^="/tr/rehber/"]');
    await expect(links).toHaveCount(1);
    await expect(links.first()).toHaveAttribute("href", TUERKISCH);

    // The footer offers the translated guide too, and nothing it does not have.
    const imFooter = page.locator('footer a[href^="/tr/rehber/"]');
    await expect(imFooter).toHaveCount(1);
  });
});
