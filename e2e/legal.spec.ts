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
      "Doppel-Opt-in",
      "Neon",
      "Resend",
      "Art. 7 Abs. 3",
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
    mustContain: [
      "Keine kostenpflichtigen Leistungen",
      "kein entgeltlicher Vertrag",
      "§§ 312g, 355 BGB",
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

  test("the privacy policy discloses opt-in case saving with retention limits", async ({
    page,
  }) => {
    await page.goto("/datenschutz");
    const body = await page.locator("article").innerText();
    // The old unconditional no-storage promise must be gone...
    expect(body).not.toContain("von uns nicht gespeichert");
    // ...replaced by the conditional browser-first principle + the opt-in section.
    expect(body).toContain("Ohne Ihr aktives Zutun");
    expect(body).toContain("Fallspeicherung");
    expect(body).toContain("nach 7 Tagen");
    expect(body).toContain("6 Monate");
    // The legacy Google-Sheets newsletter flow is retired.
    expect(body).not.toContain("Google-Sheets");
  });

  test("lawyer referral is disclosed as a separate consent and stays free", async ({
    page,
  }) => {
    await page.goto("/datenschutz");
    const privacy = await page.locator("article").innerText();
    expect(privacy).toMatch(/gesonderten? Einwilligung/);
    expect(privacy).toContain("Partner");

    await page.goto("/nutzungsbedingungen");
    const terms = await page.locator("article").innerText();
    expect(terms).toContain("Ersteinschätzung");
    expect(terms).toContain("kostenlos");
  });

  test("the terms describe a free, download-only service and name no price", async ({
    page,
  }) => {
    await page.goto("/nutzungsbedingungen");
    const body = await page.locator("article").innerText();

    expect(body).toContain("kostenlos");
    expect(body).toContain("nicht angeboten");
    // Nothing is sold, so no price, no VAT clause, no order button may appear.
    expect(body).not.toMatch(/\d[.,]\d{2}\s*€/);
    expect(body).not.toContain("Zahlungspflichtig bestellen");
    expect(body).not.toContain("§ 19 UStG");
  });

  test("no legal page advertises postal dispatch or the eBrief processor", async ({
    page,
  }) => {
    for (const legal of LEGAL_PAGES) {
      await page.goto(legal.path);
      const body = await page.locator("article").innerText();
      expect(body, `${legal.path} still mentions Postversand`).not.toContain("Postversand");
      expect(body, `${legal.path} still mentions eBrief`).not.toContain("eBrief");
    }
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
