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
      "/maengelanzeige-versenden",
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

/**
 * The paid dispatch is the only thing on this site that earns money, and for a
 * long time it existed only as a step inside a client-side wizard with no URL
 * of its own - unrankable, and invisible to anyone searching for it. These
 * checks fail if it ever loses its own indexable page again, or if the prices
 * shown there drift away from the ones the checkout charges.
 */
test.describe("dispatch service is discoverable", () => {
  const VERSAND_PATH = "/maengelanzeige-versenden";

  /** Reads every JSON-LD block on the page, flattened out of its @graph. */
  async function jsonLdNodes(page: import("@playwright/test").Page) {
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    return blocks.flatMap((raw) => {
      const parsed = JSON.parse(raw);
      return (parsed["@graph"] ?? [parsed]) as Record<string, unknown>[];
    });
  }

  test("the landing page is in the sitemap and indexable", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    const locations = sitemapLocations(await res.text());
    expect(
      locations,
      "the dispatch landing page is missing from the sitemap",
    ).toContain(`${EXPECTED_ORIGIN}${VERSAND_PATH}`);

    await page.goto(VERSAND_PATH);
    await expect(page.locator("h1")).toContainText("versenden");
  });

  test("Service JSON-LD carries both products with real prices", async ({
    page,
  }) => {
    await page.goto(VERSAND_PATH);
    const nodes = await jsonLdNodes(page);

    const service = nodes.find((n) => n["@type"] === "Service");
    expect(service, "no Service node on the dispatch page").toBeTruthy();

    const offers = service?.offers as { price?: string }[] | undefined;
    expect(offers?.length, "Service has no offers").toBe(2);

    // Mirrors src/lib/ebrief/produkte.ts. A price that changes there without
    // changing here means the page and the checkout disagree.
    const prices = offers?.map((o) => o.price).sort();
    expect(prices).toEqual(["2.49", "6.99"]);
  });

  test("the homepage links to the dispatch page and says it costs money", async ({
    page,
  }) => {
    await page.goto("/");

    // Server-rendered, so the link is in the HTML rather than behind a wizard.
    await expect(
      page.locator(`a[href="${VERSAND_PATH}"]`).first(),
    ).toBeAttached();

    const teaser = page.locator("#versenden");
    await expect(teaser).toContainText("2,49");
    await expect(teaser).toContainText("6,99");
  });

  test("the free check is not advertised as covering the paid dispatch", async ({
    page,
  }) => {
    await page.goto("/");
    const nodes = await jsonLdNodes(page);

    const webapp = nodes.find((n) => n["@type"] === "WebApplication");
    const features = (webapp?.featureList ?? []) as string[];
    // The zero-price offer on this node must not list posting a letter, which
    // is chargeable. That combination reads as "we post it for free".
    expect(
      features.filter((f) => /versand|versenden|brief/i.test(f)),
      "the price-0 WebApplication node advertises the paid dispatch",
    ).toHaveLength(0);
  });
});
