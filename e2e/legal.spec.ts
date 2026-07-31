import { test, expect } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";
import { PRODUKTE } from "../src/lib/ebrief/produkte";

/** Currency formatting uses a non-breaking space; innerText need not keep it. */
const normalisiert = (text: string) => text.replace(/[\u00a0\u202f]/g, " ");

const LEGAL_PAGES = [
  {
    path: "/impressum",
    footerLink: "Impressum",
    heading: "Impressum",
    // The provider named here has to be the party that signs the eBrief
    // contract — the business name for § 5 DDG, and the natural person behind
    // it, which a Geschäftsbezeichnung cannot stand in for.
    mustContain: [
      "Animals of Cologne",
      "Maximilian Marowsky",
      "Holzgasse 8",
      "50676",
      "§ 5 DDG",
      "§ 18 Abs. 2 MStV",
      "§ 36 Abs. 1 Nr. 1 VSBG",
      "keine Rechtsberatung",
    ],
  },
  {
    path: "/datenschutz",
    footerLink: "Datenschutz",
    heading: "Datenschutzerklärung",
    mustContain: [
      "Art. 13 DSGVO",
      "Vercel Web Analytics",
      "Google Gemini",
      "§ 25 Abs. 2 Nr. 2 TDDDG",
      "Landesbeauftragte für Datenschutz",
      "Art. 22 DSGVO",
    ],
  },
  {
    path: "/nutzungsbedingungen",
    footerLink: "AGB",
    heading: "Nutzungsbedingungen und AGB",
    mustContain: ["Geltungsbereich", "Haftung", "§ 2 RDG", "Gerichtsstand"],
  },
  {
    path: "/widerruf",
    footerLink: "Widerrufsrecht",
    heading: "Widerrufsrecht",
    // The paid dispatch makes this a real Widerrufsbelehrung: the statutory
    // period, the model form, and the early-expiry rule the order flow relies
    // on. A page that lost any of them would leave a sold service unbelehrt.
    mustContain: [
      "Widerrufsbelehrung",
      "vierzehn Tagen",
      "Muster-Widerrufsformular",
      "§ 356 Abs. 4 BGB",
    ],
  },
] as const;

test.describe("Legal pages", () => {
  for (const legal of LEGAL_PAGES) {
    test(`${legal.path} renders its required content`, async ({ page }) => {
      const res = await page.goto(legal.path);
      expect(res?.status()).toBe(200);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(legal.heading);
      for (const needle of legal.mustContain) {
        await expect(page.getByText(needle, { exact: false }).first()).toBeVisible();
      }

      await expectNoHorizontalOverflow(page);
    });

    test(`${legal.path} is reachable from the footer`, async ({ page }) => {
      await page.goto("/");
      await page
        .getByRole("contentinfo")
        .getByRole("link", { name: legal.footerLink, exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`${legal.path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(legal.heading);
    });
  }

  test("legal pages carry the site header and footer", async ({ page }) => {
    await page.goto("/impressum");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByRole("link", { name: "Zur Startseite" })).toBeVisible();
  });

  test("the privacy policy no longer claims there is no tracking", async ({ page }) => {
    await page.goto("/datenschutz");
    const body = await page.locator("article").innerText();
    expect(body).not.toContain("Keine Cookies, kein Tracking");
    // Vercel Analytics is loaded, so it must be disclosed.
    expect(body).toContain("Vercel Web Analytics");
  });

  test("the terms keep the free functions free and price the paid one", async ({
    page,
  }) => {
    await page.goto("/nutzungsbedingungen");
    const body = await page.locator("article").innerText();

    // The free path must survive the arrival of a paid one — it is the whole
    // premise of the site, and the terms are where a quiet removal would show.
    expect(body).toContain("kostenlos");
    expect(body).toContain("Kostenpflichtiger Postversand");

    // Both prices, taken from the catalogue the checkout charges from, so a
    // price change that misses this page fails here instead of in a dispute.
    for (const produkt of Object.values(PRODUKTE)) {
      const preis = (produkt.preisCent / 100).toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
      });
      expect(normalisiert(body)).toContain(normalisiert(preis));
    }

    // § 19 UStG: a small business may not state VAT. The § 19 note is required
    // and any "inkl. MwSt." next to it would be a tax statement owed under
    // § 14c UStG.
    expect(body).toContain("§ 19 UStG");
    expect(body.toLowerCase()).not.toContain("mwst");
  });

  test("the legal pages disclose the dispatch processor and its subprocessors", async ({
    page,
  }) => {
    // The inverse of the guard that stood here while dispatch was removed.
    // Selling the service without naming who prints and delivers the letter is
    // the Art. 13 gap that guard existed to prevent in the first place.
    await page.goto("/datenschutz");
    const datenschutz = await page.locator("article").innerText();
    for (const empfaenger of [
      "PIN AG",
      "BC Directgroup",
      "Möller Druck",
      "Office Data Service",
      "Stripe",
    ]) {
      expect(datenschutz, `datenschutz omits ${empfaenger}`).toContain(empfaenger);
    }

    await page.goto("/nutzungsbedingungen");
    expect(await page.locator("article").innerText()).toContain("PIN AG");
  });

  test("the sitemap lists every legal page", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    for (const legal of LEGAL_PAGES) {
      expect(xml, `${legal.path} missing from sitemap`).toContain(legal.path);
    }
  });
});
