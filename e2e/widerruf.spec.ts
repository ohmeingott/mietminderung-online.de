import { test, expect } from "@playwright/test";

/**
 * The withdrawal button under § 356a BGB, mandatory since 19.6.2026.
 *
 * The API route needs a mail provider, which the test run does not have, so
 * the request is stubbed. What is asserted here is the part the statute is
 * about: the button exists with the prescribed label, it leads to a form for
 * the details under Abs. 2, and the form is completed with a button labelled
 * "Widerruf bestätigen".
 */
test.describe("Widerrufsbutton (§ 356a BGB)", () => {
  test("offers the button with the statutory label", async ({ page }) => {
    await page.goto("/widerruf");
    await expect(page.getByTestId("widerruf-oeffnen")).toHaveText(
      "Vertrag widerrufen"
    );
  });

  test("takes a declaration and confirms it", async ({ page }) => {
    const gesendet: unknown[] = [];
    await page.route("**/api/widerruf", async (route) => {
      gesendet.push(route.request().postDataJSON());
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ empfangen: true }),
      });
    });

    await page.goto("/widerruf");
    await page.getByTestId("widerruf-oeffnen").click();

    // Nothing can be sent without a contact channel.
    await expect(page.getByTestId("widerruf-bestaetigen")).toBeDisabled();

    await page.getByTestId("widerruf-email").fill("mieterin@beispiel.de");
    await page.getByTestId("widerruf-name").fill("Maria Musterfrau");
    await page.getByTestId("widerruf-auftragsnummer").fill("40123");

    const knopf = page.getByTestId("widerruf-bestaetigen");
    await expect(knopf).toHaveText("Widerruf bestätigen");
    await knopf.click();

    await expect(page.getByTestId("widerruf-eingegangen")).toBeVisible();
    expect(gesendet).toHaveLength(1);
    expect(gesendet[0]).toMatchObject({
      email: "mieterin@beispiel.de",
      name: "Maria Musterfrau",
      auftragsnummer: "40123",
    });
  });

  test("keeps the statutory label while the request is in flight", async ({
    page,
  }) => {
    // § 356a Abs. 3 BGB prescribes this label. The safe reading is that the
    // button has to bear it — including mid-request, where a screenshot would
    // otherwise show a statutory control saying something else. An earlier
    // version swapped in "Einen Moment …" here; this is what stops it coming
    // back.
    let freigeben: () => void = () => {};
    const gehalten = new Promise<void>((res) => {
      freigeben = res;
    });
    await page.route("**/api/widerruf", async (route) => {
      await gehalten;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ empfangen: true }),
      });
    });

    await page.goto("/widerruf");
    await page.getByTestId("widerruf-oeffnen").click();
    await page.getByTestId("widerruf-email").fill("mieterin@beispiel.de");
    await page.getByTestId("widerruf-bestaetigen").click();

    const knopf = page.getByTestId("widerruf-bestaetigen");
    await expect(knopf).toHaveAttribute("aria-busy", "true");
    await expect(knopf).toHaveText("Widerruf bestätigen");
    await expect(
      page.getByRole("button", { name: "Widerruf bestätigen", exact: true })
    ).toBeVisible();

    freigeben();
    await expect(page.getByTestId("widerruf-eingegangen")).toBeVisible();
  });

  test("points at the email channel when the route fails", async ({ page }) => {
    // A withdrawal that cannot be submitted must not leave the consumer with
    // nothing: an email is an equally effective declaration and has to be
    // named on the spot.
    await page.route("**/api/widerruf", (route) =>
      route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ fehler: "zustellung" }),
      })
    );

    await page.goto("/widerruf");
    await page.getByTestId("widerruf-oeffnen").click();
    await page.getByTestId("widerruf-email").fill("mieterin@beispiel.de");
    await page.getByTestId("widerruf-bestaetigen").click();

    const fehler = page.getByTestId("widerruf-fehler");
    await expect(fehler).toBeVisible();
    await expect(fehler).toContainText("E-Mail");
  });
});
