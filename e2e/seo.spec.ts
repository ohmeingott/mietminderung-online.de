import { test, expect } from "@playwright/test";

/**
 * Guards the canonical host.
 *
 * The site once defaulted to `https://mietminderung.online` while it was served
 * from `mietminderung-online.de`. Nothing broke visibly - the pages rendered
 * fine - but every canonical tag pointed at a domain that was not the one being
 * crawled, which tells Google to index that other host instead. The result is a
 * site that is live and completely absent from the index.
 *
 * These checks fail loudly if canonicals, the sitemap or robots.txt ever drift
 * apart from each other or from the production domain again.
 */

/** The production origin. Mirrors the default in `src/lib/site.ts`. */
const PRODUCTION_ORIGIN = "https://mietminderung-online.de";

const EXPECTED_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_ORIGIN
).replace(/\/+$/, "");

/** The domain the site used to advertise by mistake. */
const WRONG_ORIGIN = "mietminderung.online";

/** Pulls every `<loc>` out of the sitemap XML. */
function sitemapLocations(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

test.describe("canonical host", () => {
  test("robots.txt points crawlers at the canonical host only", async ({
    page,
  }) => {
    const res = await page.request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();

    expect(body).toContain(`${EXPECTED_ORIGIN}/sitemap.xml`);
    expect(
      body,
      "robots.txt still references the old domain",
    ).not.toContain(WRONG_ORIGIN);

    // The catch-all group must stay open. A blanket `Disallow: /` is expected
    // further down - that is the deliberate block on the SEO scraper bots - so
    // only the `User-Agent: *` group is checked here.
    const catchAll = body
      .split(/\n\s*\n/)
      .find((group) => /^User-Agent:\s*\*$/im.test(group));
    expect(catchAll, "robots.txt has no User-Agent: * group").toBeTruthy();
    expect(catchAll).toMatch(/^Allow:\s*\/$/im);
    expect(
      catchAll,
      "robots.txt blocks every crawler from the whole site",
    ).not.toMatch(/^Disallow:\s*\/\s*$/im);
  });

  test("every sitemap URL is on the canonical host", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();

    const locations = sitemapLocations(xml);
    // The calculator, 58 defect pages, 13 category hubs, guides and legal texts.
    expect(locations.length).toBeGreaterThanOrEqual(80);

    const foreign = locations.filter(
      (loc) => !loc.startsWith(`${EXPECTED_ORIGIN}/`),
    );
    expect(
      foreign,
      `sitemap entries on the wrong host: ${foreign.slice(0, 5).join(", ")}`,
    ).toHaveLength(0);
  });

  test("canonical and og:url match the served page on every page type", async ({
    page,
  }) => {
    const res = await page.request.get("/sitemap.xml");
    const locations = sitemapLocations(await res.text());

    // One real URL per page type, taken from the sitemap itself so the sample
    // follows the generated routes rather than a hardcoded guess.
    const paths = [
      "/",
      "/mietminderungstabelle",
      "/faq",
      "/impressum",
      // First category hub and first defect page the sitemap happens to list.
      ...[
        locations.find((l) => /\/mietminderung\/[^/]+$/.test(l)),
        locations.find((l) => /\/mietminderung\/[^/]+\/[^/]+$/.test(l)),
        locations.find((l) => /\/ratgeber\/[^/]+$/.test(l)),
      ]
        .filter((l): l is string => Boolean(l))
        .map((l) => new URL(l).pathname),
    ];

    for (const path of paths) {
      await page.goto(path);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(canonical, `${path} has no canonical tag`).toBeTruthy();

      // Next resolves the root canonical against `metadataBase` and drops the
      // trailing slash, so compare without it on both sides.
      const expected = `${EXPECTED_ORIGIN}${path}`.replace(/\/$/, "");
      expect(canonical?.replace(/\/$/, ""), `${path} canonical points elsewhere`)
        .toBe(expected);

      const ogUrl = await page
        .locator('meta[property="og:url"]')
        .getAttribute("content");
      expect(
        ogUrl?.replace(/\/$/, ""),
        `${path} og:url disagrees with the canonical`,
      ).toBe(expected);

      const robots = await page
        .locator('meta[name="robots"]')
        .getAttribute("content");
      expect(robots ?? "", `${path} is noindex`).not.toContain("noindex");
    }
  });
});
