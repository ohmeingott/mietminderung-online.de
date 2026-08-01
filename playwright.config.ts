import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";

/**
 * A port belonging to this checkout rather than a fixed one.
 *
 * With a single hard-coded port, every git worktree of this repository wants
 * the same one. When a sibling worktree already holds it, `next start` cannot
 * bind — but the port answers anyway, because the sibling's server is there.
 * Playwright polls the URL, sees a healthy response and runs the whole suite
 * against somebody else's build. That surfaces as a handful of unrelated tests
 * failing at random, which reads as flakiness and sends you looking in exactly
 * the wrong place.
 *
 * Deriving the port from the checkout path gives each worktree its own and
 * keeps it stable across runs, so a failure is reproducible and the port in an
 * error message still means something. `E2E_PORT` overrides it.
 */
function portFuerCheckout(): number {
  const streuwert = createHash("sha256").update(process.cwd()).digest();
  return 3100 + (streuwert.readUInt16BE(0) % 700);
}

const PORT = Number(process.env.E2E_PORT || portFuerCheckout());
const baseURL = process.env.E2E_BASE_URL || `http://127.0.0.1:${PORT}`;

/**
 * CI images sometimes ship a Chromium build that does not match the revision
 * this Playwright version would download. When that pre-installed binary is
 * present, point at it instead of failing on a missing download.
 */
const PREINSTALLED_CHROMIUM = "/opt/pw-browsers/chromium";
const executablePath = existsSync(PREINSTALLED_CHROMIUM)
  ? PREINSTALLED_CHROMIUM
  : undefined;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One local retry. Not to paper over a broken test — a genuinely broken one
  // fails both attempts — but because this suite shares a developer machine
  // with builds and other sessions, and a single contention blip should not
  // make the whole run read as a failure. Playwright reports a passed retry as
  // "flaky", so it stays visible instead of quietly disappearing.
  retries: process.env.CI ? 2 : 1,
  // Each worker drives a browser and competes with the Next server for cores.
  // Four on an eight-core machine is fine in isolation and not fine when a
  // build or a second checkout is running, which measurably pushed
  // twelve-second tests past a forty-five-second timeout.
  workers: process.env.CI ? 2 : 3,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  // Headroom for a busy machine, not permission to be slow: the longest specs
  // walk the whole wizard and settle around fifteen seconds unloaded, so this
  // still catches a genuine hang quickly.
  timeout: 75_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    launchOptions: { executablePath },
  },

  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    {
      // Pixel 5 metrics — the mobile layout is the one most users will see.
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] },
    },
  ],

  webServer: {
    // Always start our own server. Reusing a leftover one silently tests a
    // stale build, which is worse than the few seconds saved. CI builds in its
    // own step so failures are attributed correctly; locally we build here.
    command: process.env.CI
      ? `npm run start -- --port ${PORT}`
      : `npm run build && npm run start -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
