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
/** The same guide in Russian — a URL that is Cyrillic end to end. */
const RUSSISCH = "/ru/рекомендации/уведомление-о-недостатках";

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

  test("every URL the cluster names actually resolves", async ({ page }) => {
    // The property that has to hold no matter how far the translation has
    // come: a cluster may only name languages that really have the guide. A
    // single 404 in here and Google discards the whole cluster, which is the
    // silent way this feature stops working.
    await page.goto(DEUTSCH);
    const langs = alternates(await page.content());

    expect(Object.keys(langs)).toContain("de");
    expect(Object.keys(langs)).toContain("x-default");

    for (const [lang, href] of Object.entries(langs)) {
      // The cluster carries absolute production URLs; the test server is
      // local, so only the path is fetched.
      expect(href.startsWith(ORIGIN), `${lang} → ${href}`).toBe(true);
      const seite = await page.request.get(href.slice(ORIGIN.length) || "/");
      expect(seite.status(), `${lang} → ${href}`).toBe(200);
    }
  });

  test("a non-Latin URL resolves and renders its own language", async ({
    page,
  }) => {
    /*
     * This exact page was built, written to disk and still answered 404. With
     * `dynamicParams = false` Next's param matching does not survive a Cyrillic
     * segment, so all eight Russian guides existed and none could be opened.
     * The failure is invisible in a build log — only a request shows it.
     */
    const response = await page.goto(RUSSISCH);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText("Уведомление о недостатках");

    // The anchors have to survive the script too: an ASCII-only slugify turned
    // every Cyrillic heading into the same empty id.
    const ids = await page
      .locator("main section[id]")
      .evaluateAll((els) => els.map((e) => e.id));
    expect(ids.length).toBeGreaterThan(1);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("the German slug under a locale prefix stays a 404", async ({
    page,
  }) => {
    const duplikat = await page.goto("/tr/ratgeber/maengelanzeige-schreiben");
    expect(duplikat?.status()).toBe(404);

    // Same rule for a non-Latin locale: only the canonical localized URL
    // answers, never the German slug behind the prefix.
    const kyrillisch = await page.goto("/ru/ratgeber/maengelanzeige-schreiben");
    expect(kyrillisch?.status()).toBe(404);

    const unuebersetzt = await page.goto("/tr/rehber/mietminderung-berechnen");
    expect(unuebersetzt?.status()).toBe(404);
  });

  test("the localized hub lists exactly the guides that language has", async ({
    page,
  }) => {
    // Turkish is fully translated, so its hub carries the same eight guides as
    // the German one. The assertion is deliberately relative rather than a
    // hard-coded eight: it stays true as the other languages fill in, and it
    // still fails if the hub ever lists a guide the language does not have.
    await page.goto("/ratgeber");
    const deutsch = await page
      .locator('main article a[href^="/ratgeber/"]')
      .count();

    const response = await page.goto("/tr/rehber");
    expect(response?.status()).toBe(200);

    // Scoped to the article grid: the footer lists the same guides, so an
    // unscoped locator counts every entry twice.
    const links = page.locator('main article a[href^="/tr/rehber/"]');
    await expect(links).toHaveCount(deutsch);
    await expect(links.filter({ hasText: /.+/ }).first()).toBeVisible();

    // Every card links to a page that exists, not to a German slug.
    for (const href of await links.evaluateAll((as) =>
      as.map((a) => a.getAttribute("href") ?? ""),
    )) {
      expect(href.startsWith("/tr/rehber/")).toBe(true);
      const seite = await page.request.get(href);
      expect(seite.status()).toBe(200);
    }
  });
});
