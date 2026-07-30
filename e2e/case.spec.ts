import { test, expect, type Page } from "@playwright/test";
import {
  completeCheck,
  expectNoHorizontalOverflow,
  openLetterWizard,
  reachPreview,
  stubEnhanceApi,
  TENANT,
} from "./helpers";

/** Walks the whole flow onto the delivery step where the opt-in card lives. */
async function reachDeliveryStep(page: Page) {
  await stubEnhanceApi(page);
  await page.goto("/#pruefung");
  await completeCheck(page);
  await openLetterWizard(page);
  await reachPreview(page);
  await page.getByTestId("letter-delivery").click();
  await expect(page.getByTestId("case-optin-checkbox")).toBeVisible();
}

test.describe("Case opt-in card (delivery step)", () => {
  test("is strictly optional: downloads work without ticking anything", async ({
    page,
  }) => {
    await reachDeliveryStep(page);

    // Koppelungsverbot: the download must never depend on the opt-in.
    await expect(page.getByTestId("case-optin-checkbox")).not.toBeChecked();
    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("download-txt").click();
    await downloadPromise;
  });

  test("submit stays disabled until the consent checkbox is ticked", async ({
    page,
  }) => {
    await reachDeliveryStep(page);

    const submit = page.getByTestId("case-optin-submit");
    await expect(submit).toBeDisabled();

    // Email is prefilled from the tenant step.
    await expect(page.getByTestId("case-optin-email")).toHaveValue(TENANT.email);

    await page.getByTestId("case-optin-checkbox").check();
    await expect(submit).toBeEnabled();

    // An invalid email disables it again.
    await page.getByTestId("case-optin-email").fill("keine-email");
    await expect(submit).toBeDisabled();
    await page.getByTestId("case-optin-email").fill(TENANT.email);
    await expect(submit).toBeEnabled();
  });

  test("shows the double-opt-in success state after saving", async ({ page }) => {
    await reachDeliveryStep(page);

    let payload: Record<string, unknown> | null = null;
    await page.route("**/api/case", async (route) => {
      payload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.getByTestId("case-optin-checkbox").check();
    await page.getByTestId("case-optin-submit").click();

    await expect(page.getByTestId("case-optin-success")).toBeVisible();

    // The payload is minimized: no street, no phone, no signature, no landlord.
    expect(payload).not.toBeNull();
    const body = payload! as {
      tenant: Record<string, unknown>;
      consentVersion: string;
      case: Record<string, unknown>;
    };
    expect(body.tenant.email).toBe(TENANT.email);
    expect(body.tenant.name).toBe(TENANT.name);
    expect(body.tenant).not.toHaveProperty("strasse");
    expect(body.tenant).not.toHaveProperty("telefon");
    expect(body.consentVersion).toBeTruthy();
    expect(body.case).not.toHaveProperty("vermieter");
    expect(body.case).not.toHaveProperty("signature");
    expect(String(body.case.deadlineDate)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("surfaces failures with a retry instead of failing silently", async ({
    page,
  }) => {
    await reachDeliveryStep(page);

    await page.route("**/api/case", (route) =>
      route.fulfill({ status: 502, body: "{}" }),
    );

    await page.getByTestId("case-optin-checkbox").check();
    await page.getByTestId("case-optin-submit").click();

    await expect(page.getByTestId("case-optin-error")).toBeVisible();
    await expect(page.getByTestId("case-optin-submit")).toBeEnabled();
    await expect(page.getByTestId("case-optin-success")).toHaveCount(0);
  });

  test("keeps the delivery step free of price patterns", async ({ page }) => {
    await reachDeliveryStep(page);
    const section = await page.locator("#maengelanzeige").innerText();
    expect(section).not.toMatch(/\d[.,]\d{2}\s*€/);
    expect(section.toLowerCase()).not.toContain("zahlungspflichtig");
    await expectNoHorizontalOverflow(page);
  });
});

test.describe("Double-opt-in confirmation page", () => {
  test("confirms only on the explicit button click", async ({ page }) => {
    let confirmCalls = 0;
    await page.route("**/api/case/confirm", async (route) => {
      confirmCalls += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/fall/bestaetigen?t=" + "a".repeat(43));
    await expect(page.getByTestId("confirm-button")).toBeVisible();
    // Loading the page (like a mail scanner would) must not confirm anything.
    expect(confirmCalls).toBe(0);

    await page.getByTestId("confirm-button").click();
    await expect(page.getByTestId("confirm-success")).toBeVisible();
    expect(confirmCalls).toBe(1);
  });

  test("shows the invalid state for a dead token", async ({ page }) => {
    await page.route("**/api/case/confirm", (route) =>
      route.fulfill({ status: 410, body: "{}" }),
    );
    await page.goto("/fall/bestaetigen?t=" + "a".repeat(43));
    await page.getByTestId("confirm-button").click();
    await expect(page.getByTestId("confirm-error")).toBeVisible();
  });
});

test.describe("Case status page", () => {
  const summary = {
    status: "reminder_sent",
    deadlineDate: "2026-08-13",
    createdAt: "2026-07-30",
    minderungTypical: 80,
    monthlySaving: 800,
    lawyerConsent: false,
  };

  async function openStatusPage(page: Page) {
    await page.route("**/api/case/summary**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(summary),
      }),
    );
    await page.goto("/fall/status?t=test-token");
    await expect(page.getByTestId("case-status-result")).toBeVisible();
  }

  test("records a one-click answer and shows guidance + lawyer teaser", async ({
    page,
  }) => {
    await openStatusPage(page);
    await page.route("**/api/case/status", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, status: "no_response" }),
      }),
    );

    await page.getByTestId("status-no-response").click();
    await expect(page.getByTestId("case-status-lawyer-link")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("withdrawal needs a second click and ends in the deleted state", async ({
    page,
  }) => {
    await openStatusPage(page);

    let withdrawCalls = 0;
    await page.route("**/api/case/withdraw", async (route) => {
      withdrawCalls += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.getByTestId("case-withdraw").click();
    // First click only arms the confirmation — nothing is deleted yet.
    expect(withdrawCalls).toBe(0);

    await page.getByTestId("case-withdraw-confirm").click();
    await expect(page.getByTestId("withdraw-success")).toBeVisible();
    expect(withdrawCalls).toBe(1);
  });

  test("shows the invalid state for a dead link", async ({ page }) => {
    await page.route("**/api/case/summary**", (route) =>
      route.fulfill({ status: 410, body: "{}" }),
    );
    await page.goto("/fall/status?t=test-token");
    await expect(page.getByTestId("case-status-invalid")).toBeVisible();
  });
});

test.describe("Lawyer consent page", () => {
  test("requires the separate consent checkbox before submitting", async ({
    page,
  }) => {
    await page.route("**/api/case/lawyer-consent", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      }),
    );

    await page.goto("/fall/anwalt?t=test-token");
    const submit = page.getByTestId("case-lawyer-consent-submit");
    await expect(submit).toBeDisabled();

    await page.getByTestId("case-lawyer-consent-checkbox").check();
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(page.getByTestId("lawyer-consent-success")).toBeVisible();
  });
});
