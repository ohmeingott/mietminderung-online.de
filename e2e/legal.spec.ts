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
    // contract — the registered name including the legal form for § 5 DDG, and
    // every vertretungsberechtigter Gesellschafter, because a GbR has no
    // Inhaber and no single partner stands in for the other two.
    mustContain: [
      "Animals of Cologne GbR",
      "Vertretungsberechtigte Gesellschafter",
      "Maximilian Marowsky",
      "Paul Ohm",
      "Philipp Weiß",
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
    // period, the model form, the early-expiry rule the order flow relies on,
    // and the button § 356a Abs. 1 BGB requires. A page that lost any of them
    // would leave a sold service unbelehrt.
    mustContain: [
      "Widerrufsbelehrung",
      "vierzehn Tagen",
      "Muster-Widerrufsformular",
      "§ 356 Abs. 5 Nr. 2 BGB",
      "Vertrag widerrufen",
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

  /*
   * § 356a Abs. 1 BGB wants the withdrawal button permanently available. It
   * lives at the top of /widerruf, so what makes it permanently available is
   * that every page links there.
   *
   * The site has two footers, and only one of them used to: the content pages
   * render src/components/content/ContentFooter.tsx, which carried three of
   * the four legal links and left out the withdrawal page. Nothing failed —
   * the reachability test above only ever loads the homepage, which uses the
   * other footer. This is the test that would have caught it.
   */
  const INHALTSSEITEN = [
    "/ratgeber",
    "/mietminderungstabelle",
    "/mietminderung",
    "/maengelanzeige-versenden",
  ] as const;

  for (const pfad of INHALTSSEITEN) {
    test(`${pfad} reaches the withdrawal page from its footer`, async ({
      page,
    }) => {
      await page.goto(pfad);
      await page
        .getByRole("contentinfo")
        .getByRole("link", { name: "Widerrufsrecht", exact: true })
        .click();
      await expect(page).toHaveURL(/\/widerruf$/);
      await expect(page.getByTestId("widerruf-oeffnen")).toHaveText(
        "Vertrag widerrufen"
      );
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

  test("no legal page promises a print cut-off time", async ({ page }) => {
    // Both pages stated that payment received Mo–Fr before 14:30 was printed
    // and franked the same day. Nothing sourced it and the first live order
    // refuted it: paid 21:58, handed to print 22:00 the same evening. It is a
    // binding performance promise to consumers, so no clock time may return.
    // The order confirmation carries the same guard in check-bestellbestaetigung.
    for (const path of ["/nutzungsbedingungen", "/widerruf"]) {
      await page.goto(path);
      const body = await page.locator("article").innerText();
      expect(body, `${path} states a clock time as a promise`).not.toMatch(
        /\b\d{1,2}[:.]\d{2}\s*Uhr/i,
      );
    }

    // Dropping the timing must not drop the legal statement it was quoted for:
    // /widerruf has to keep saying when the right lapses.
    await page.goto("/widerruf");
    const widerruf = await page.locator("article").innerText();
    expect(widerruf).toContain("§ 356 Abs. 5 Nr. 2 BGB");
    expect(widerruf).toContain("Vollständig erbracht");
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
      // Added with the order confirmation and initially forgotten here: a
      // processor that sees buyer email addresses has to be named.
      "Resend",
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
