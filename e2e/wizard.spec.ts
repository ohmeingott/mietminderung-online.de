import { test, expect } from "@playwright/test";
import {
  answerEligibility,
  chooseDeadline,
  completeCheck,
  fillLandlord,
  fillTenant,
  openLetterWizard,
  parkCardUnderHeader,
  reachPreview,
  selectDefect,
  startScrollProbe,
  stopScrollProbe,
  stubEnhanceApi,
  stubVersandApi,
  TENANT,
} from "./helpers";

/**
 * The behaviour the merge exists to produce.
 *
 * Everything else in the suite would still pass if the check and the letter
 * were two page sections again; these are the tests that would not.
 */
test.describe("One continuous wizard", () => {
  test.beforeEach(async ({ page }) => {
    await stubEnhanceApi(page);
    await page.goto("/#pruefung");
  });

  test("committing to the letter does not throw the page down a section", async ({
    page,
  }) => {
    await completeCheck(page, "1000");

    const karte = page.getByTestId("wizard-card");
    // Where the reader actually is when they commit: the card's top just under
    // the header, the sticky bar holding the button in view at the bottom.
    // Parked without animation and left to settle, so nothing the harness does
    // is still moving when the measurement starts.
    await parkCardUnderHeader(page);
    const obenVorher = await karte.evaluate((el) => el.getBoundingClientRect().top);

    await startScrollProbe(page);
    await page.getByTestId("check-create-letter").click();
    await expect(page.getByTestId("mieter-name")).toBeVisible();
    const probe = await stopScrollProbe(page);

    const obenNachher = await karte.evaluate((el) => el.getBoundingClientRect().top);
    const grenze = 32; // ~2rem: sub-pixel rounding and a one-line correction fit.

    // Endpoint and envelope both: a scroll that overshoots and springs back is
    // still a jump the reader watched happen.
    expect(Math.abs(probe.end - probe.start), "the page scrolled").toBeLessThanOrEqual(grenze);
    expect(probe.max - probe.start, "the page scrolled down mid-transition").toBeLessThanOrEqual(
      grenze
    );
    expect(probe.start - probe.min, "the page scrolled up mid-transition").toBeLessThanOrEqual(
      grenze
    );
    expect(
      Math.abs(obenNachher - obenVorher),
      "the card moved out from under the reader"
    ).toBeLessThanOrEqual(grenze);
  });

  test("it is one card with one progress bar the whole way", async ({ page }) => {
    const zaehlen = async () => ({
      karten: await page.getByTestId("wizard-card").count(),
      balken: await page.locator("#pruefung [role=progressbar]").count(),
    });

    expect(await zaehlen()).toEqual({ karten: 1, balken: 1 });
    await completeCheck(page);
    expect(await zaehlen()).toEqual({ karten: 1, balken: 1 });
    await openLetterWizard(page);
    // The failure mode of a half-finished merge is two of each.
    expect(await zaehlen()).toEqual({ karten: 1, balken: 1 });
  });

  test("the progress bar never resets at the check/letter seam", async ({ page }) => {
    const balken = page.locator("#pruefung [role=progressbar]");
    const wert = async () => Number(await balken.getAttribute("aria-valuenow"));

    await completeCheck(page);
    const beimErgebnis = await wert();

    await page.getByTestId("check-create-letter").click();
    await expect(page.getByTestId("mieter-name")).toBeVisible();

    // This is the concrete bug: the letter used to render its own card with
    // `completed={0}`, so the bar fell from full to empty at the exact moment
    // the reader committed.
    expect(await wert(), "progress went backwards at the seam").toBeGreaterThan(beimErgebnis);
  });

  test("progress climbs monotonically across every screen", async ({ page }) => {
    const balken = page.locator("#pruefung [role=progressbar]");
    const wert = async () => Number(await balken.getAttribute("aria-valuenow"));
    const werte: number[] = [];

    werte.push(await wert());
    await answerEligibility(page);
    werte.push(await wert());
    await selectDefect(page);
    await page.getByTestId("check-next").click();
    werte.push(await wert());
    await page.getByTestId("rent-input").fill("1000");
    await page.getByTestId("check-submit").click();
    werte.push(await wert());
    await page.getByTestId("check-create-letter").click();
    werte.push(await wert());
    await fillTenant(page);
    await page.getByTestId("letter-next").click();
    await fillLandlord(page);
    await page.getByTestId("letter-next").click();
    werte.push(await wert());
    await page.getByTestId("letter-preview").click();
    werte.push(await wert());
    await chooseDeadline(page);
    werte.push(await wert());
    await page.getByTestId("letter-delivery").click();
    werte.push(await wert());

    for (let i = 1; i < werte.length; i++) {
      expect(werte[i], `progress fell from ${werte[i - 1]} to ${werte[i]}`).toBeGreaterThan(
        werte[i - 1]
      );
    }
    expect(werte[0]).toBe(0);
    expect(werte[werte.length - 1]).toBe(100);
  });

  test("the progress bar is cut by the card's corner, not by its own", async ({ page }) => {
    const geometrie = await page.evaluate(() => {
      const karte = document.querySelector("#pruefung [data-testid=wizard-card] > div")!;
      const balken = document.querySelector("#pruefung [role=progressbar]")!;
      const clip = balken.parentElement!;
      return {
        karteOverflow: getComputedStyle(karte).overflowY,
        karteHoehe: karte.getBoundingClientRect().height,
        karteRahmen: parseFloat(getComputedStyle(karte).borderTopWidth),
        clipOverflow: getComputedStyle(clip).overflowY,
        clipHoehe: clip.getBoundingClientRect().height,
        clipRadius: parseFloat(getComputedStyle(clip).borderTopLeftRadius),
        balkenHoehe: balken.getBoundingClientRect().height,
      };
    });

    // The card may not clip: a non-visible overflow makes the sticky action
    // bar resolve against this box instead of the viewport, and the box never
    // scrolls, so the bar would sit below the fold on every long screen.
    expect(geometrie.karteOverflow).toBe("visible");

    // The bar is six pixels tall against a twenty-pixel corner. A radius is
    // scaled down to the box carrying it, so on itself the bar could only ever
    // manage a six-pixel corner and overhung the card's arc. It has to be cut
    // by a box with the card's own height for the real arc to apply.
    expect(geometrie.balkenHoehe).toBeLessThan(geometrie.clipRadius);
    expect(geometrie.clipOverflow).toBe("hidden");
    // `inset-0` spans the padding box, so it is the card less both borders.
    expect(geometrie.clipHoehe).toBeCloseTo(
      geometrie.karteHoehe - 2 * geometrie.karteRahmen,
      0
    );
  });

  test("advancing a screen announces the new heading without painting a ring", async ({
    page,
  }) => {
    // A pointer answer advances on its own, which is the exact path the ring
    // showed up on.
    await page.getByTestId("eq-mietvertrag-ja").click();
    await expect(page.getByTestId("screen-heading")).toHaveText(/Mangel schon/);

    const zustand = await page.evaluate(() => {
      const h = document.querySelector("[data-testid=screen-heading]")!;
      return {
        fokussiert: document.activeElement === h,
        outline: getComputedStyle(h).outlineStyle,
      };
    });

    // Focus has to land here - it is how a screen reader is told the card now
    // holds something else. It must not be drawn: the reader clicked an answer
    // and would see a blue box around the next question's title.
    expect(zustand.fokussiert, "the new heading did not take focus").toBe(true);
    expect(zustand.outline, "a focus ring was painted on the heading").toBe("none");
  });
});

test.describe("The deadline", () => {
  test.beforeEach(async ({ page }) => {
    await stubEnhanceApi(page);
    await page.goto("/#pruefung");
  });

  test("an urgent defect preselects a short deadline", async ({ page }) => {
    // heizung_total carries fristTage: 3, dringend: true.
    await completeCheck(page);
    await openLetterWizard(page);
    await fillTenant(page);
    await page.getByTestId("letter-next").click();
    await fillLandlord(page);
    await page.getByTestId("letter-next").click();
    await page.getByTestId("letter-preview").click();

    await expect(page.locator('input[name="frist"]:checked')).toHaveValue("3");
  });

  test("an ordinary defect gets the ordinary deadline", async ({ page }) => {
    await answerEligibility(page);
    await selectDefect(page, "aufzug", "aufzug_defekt"); // fristTage: 14
    await page.getByTestId("check-next").click();
    await page.getByTestId("rent-input").fill("1000");
    await page.getByTestId("check-submit").click();
    await openLetterWizard(page);
    await fillTenant(page);
    await page.getByTestId("letter-next").click();
    await fillLandlord(page);
    await page.getByTestId("letter-next").click();
    await page.getByTestId("letter-preview").click();

    // Two contrasting values, so the number is demonstrably read from the
    // catalogue rather than from a second hard-coded constant.
    await expect(page.locator('input[name="frist"]:checked')).toHaveValue("14");
  });

  test("the chosen deadline reaches the letter and the PDF", async ({ page }) => {
    await completeCheck(page);
    await openLetterWizard(page);
    await fillTenant(page);
    await page.getByTestId("letter-next").click();
    await fillLandlord(page);
    await page.getByTestId("letter-next").click();
    await page.getByTestId("letter-preview").click();

    const datum = await chooseDeadline(page, 21);
    const text = await page.getByTestId("brieftext").inputValue();
    expect(text).toContain(`bis spätestens zum ${datum}`);

    await page.getByTestId("letter-delivery").click();
    const download = page.waitForEvent("download");
    await page.getByTestId("download-pdf").click();
    const stream = await (await download).createReadStream();
    const teile: Buffer[] = [];
    for await (const teil of stream) teile.push(teil as Buffer);
    // jsPDF writes the text uncompressed, so the date is readable in the bytes.
    expect(Buffer.concat(teile).toString("latin1")).toContain(datum);
  });

  test("the timeline on the last screen names the same date", async ({ page }) => {
    await completeCheck(page);
    await openLetterWizard(page);
    await reachPreview(page);
    await page.getByTestId("letter-delivery").click();

    const frist = new Date();
    frist.setDate(frist.getDate() + 3); // heizung_total preselects three days
    const erwartet = frist.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    await expect(page.getByTestId("letter-timeline")).toContainText(erwartet);
  });

  test("the timeline icons stay on the rail instead of on the text", async ({ page }) => {
    await completeCheck(page);
    await openLetterWizard(page);
    await reachPreview(page);
    await page.getByTestId("letter-delivery").click();

    const stationen = page.getByTestId("letter-timeline").locator("li");
    await expect(stationen).toHaveCount(5);

    for (const [i, station] of (await stationen.all()).entries()) {
      const abzeichen = await station.locator("span").first().boundingBox();
      const datum = await station.locator("p").first().boundingBox();
      expect(abzeichen && datum, "the station renders a badge and a date").toBeTruthy();

      // Geometry, not classes: the badge straddles the rail and the text sits a
      // full indent further in, so the two boxes must not meet. They did while
      // the indent lived on the ol — the badge then started an indent's width
      // inside the list and printed itself over the date.
      expect(
        abzeichen!.x + abzeichen!.width,
        `badge ${i + 1} overlaps its date`
      ).toBeLessThanOrEqual(datum!.x);
    }
  });
});

test.describe("Descriptions stay with their defect", () => {
  test("changing the selection does not move a description to another defect", async ({
    page,
  }) => {
    await stubEnhanceApi(page);
    await page.goto("/#pruefung");
    await answerEligibility(page);
    await selectDefect(page, "heizung", "heizung_total");
    await page.getByTestId("check-all-categories").click();
    await selectDefect(page, "aufzug", "aufzug_defekt");
    await page.getByTestId("check-next").click();
    await page.getByTestId("rent-input").fill("1000");
    await page.getByTestId("check-submit").click();
    await openLetterWizard(page);
    await fillTenant(page);
    await page.getByTestId("letter-next").click();
    await fillLandlord(page);
    await page.getByTestId("letter-next").click();

    await page.getByTestId("detail-beschreibung-0").fill("HEIZUNG-MARKER");
    await page.getByTestId("detail-beschreibung-1").fill("AUFZUG-MARKER");

    // Back to the picker, drop the *first* defect, and return. By position the
    // lift text would now sit under whatever took slot zero.
    await page.getByTestId("letter-back").click(); // → landlord
    await page.getByTestId("letter-back").click(); // → tenant
    await page.getByTestId("letter-back").click(); // → result
    await page.getByTestId("check-back").click(); // → rent
    await page.getByTestId("check-back").click(); // → defects
    await page.getByTestId("remove-heizung_total").click();
    await page.getByTestId("check-next").click();
    await page.getByTestId("check-submit").click();
    await page.getByTestId("check-create-letter").click();
    await page.getByTestId("letter-next").click();
    await page.getByTestId("letter-next").click();

    await expect(page.getByTestId("detail-beschreibung-0")).toHaveValue("AUFZUG-MARKER");
    await expect(page.locator("body")).not.toContainText("HEIZUNG-MARKER");
  });
});

test.describe("The draft survives", () => {
  test("a reload keeps the screen and the entries", async ({ page }) => {
    await stubEnhanceApi(page);
    await page.goto("/#pruefung");
    await completeCheck(page);
    await openLetterWizard(page);
    await fillTenant(page);
    await page.getByTestId("letter-next").click();
    await fillLandlord(page);

    await page.reload();

    await expect(page.getByTestId("vermieter-name")).toHaveValue("Hausverwaltung Beispiel GmbH");
    await page.getByTestId("letter-back").click();
    await expect(page.getByTestId("mieter-name")).toHaveValue(TENANT.name);
  });

  test("nothing leaks into localStorage", async ({ page }) => {
    await page.goto("/#pruefung");
    await answerEligibility(page);
    await selectDefect(page);

    const schluessel = await page.evaluate(() => Object.keys(localStorage));
    expect(schluessel).not.toContain("mangelflow:v1");
  });

  test("a corrupt draft starts over instead of crashing", async ({ page }) => {
    const fehler: string[] = [];
    page.on("pageerror", (e) => fehler.push(e.message));

    await page.addInitScript(() => {
      sessionStorage.setItem("mangelflow:v1", "{kein wirkliches json");
    });
    await page.goto("/#pruefung");

    await expect(page.getByTestId("eq-mietvertrag-ja")).toBeVisible();
    expect(fehler, "a bad draft must not throw").toEqual([]);
  });

  test("a draft in the old array-keyed shape is discarded, not misapplied", async ({ page }) => {
    await page.addInitScript(() => {
      // Details used to be an array aligned by position. Restoring one would
      // put a description under whichever defect happened to be in that slot.
      sessionStorage.setItem(
        "mangelflow:v1",
        JSON.stringify({ screen: 10, mangelDetails: [{ beschreibung: "ALTER-MARKER" }] })
      );
    });
    await page.goto("/#pruefung");

    await expect(page.getByTestId("eq-mietvertrag-ja")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("ALTER-MARKER");
  });
});

test.describe("The e-mail is optional", () => {
  test("the letter can be finished without one, and dispatch then asks", async ({ page }) => {
    const stub = await stubVersandApi(page);
    await stubEnhanceApi(page);
    await page.goto("/#pruefung");
    await completeCheck(page);
    await openLetterWizard(page);

    await fillTenant(page, { ...TENANT, email: "" });
    await page.getByTestId("letter-next").click();
    await fillLandlord(page);
    await page.getByTestId("letter-next").click();
    await page.getByTestId("letter-preview").click();
    await chooseDeadline(page);
    await page.getByTestId("letter-delivery").click();

    // Free download: reached without ever giving an address.
    await expect(page.getByTestId("download-pdf")).toBeVisible();

    // Paid dispatch: the address is asked for here, where it is needed.
    await expect(page.getByTestId("dispatch-email")).toBeVisible();
    await page.getByTestId("dispatch-consent").check();
    await expect(page.getByTestId("dispatch-submit")).toBeDisabled();
    expect(stub.vorbereiten, "a job must never be prepared without an address").toHaveLength(0);

    await page.getByTestId("dispatch-email").fill(TENANT.email);
    await expect(page.getByTestId("dispatch-submit")).toBeEnabled();
  });
});
