import { test, expect } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

const LEGAL_PAGES = [
  {
    path: "/impressum",
    footerLink: "Impressum",
    heading: "Impressum",
    mustContain: [
      "Paul Ohm",
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
    heading: "Widerrufsbelehrung",
    mustContain: ["vierzehn Tagen", "Muster-Widerrufsformular", "§ 356 Abs. 4 BGB"],
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

  test("the terms no longer claim every service is free while a paid one exists", async ({
    page,
  }) => {
    await page.goto("/nutzungsbedingungen");
    const body = await page.locator("article").innerText();
    const claimsAllFree = body.includes("Sämtliche Dienste der Webseite sind kostenlos");
    const mentionsPrice = body.includes("4,99 €");
    expect(claimsAllFree && mentionsPrice).toBe(false);
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
