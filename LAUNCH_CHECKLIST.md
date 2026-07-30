# Launch checklist — mietminderung-online.de

Status of the go-live preparation, plus the decisions that still need a human.

---

## 1. Before you flip the DNS

### Required

- [ ] **Set `GEMINI_API_KEY`** in the Vercel project (Production + Preview).
      Get one at <https://aistudio.google.com/apikey>. Without it the AI step
      silently returns the tenant's own text — the site still works, it just
      does not improve or translate the description.
- [ ] **Confirm the Impressum data.** `src/lib/site.ts` currently holds
      `Paul Ohm, Holzgasse 8, 50676 Köln, pjhohm@gmail.com`. A private Gmail
      address is legally sufficient but looks less trustworthy than
      `kontakt@mietminderung-online.de` — consider a domain mailbox.
- [x] **Verify the domain.** Settled: the live host is
      `https://mietminderung-online.de`, and that is now the built-in default in
      `src/lib/site.ts`. It drives canonicals, the sitemap, `robots.txt`, every
      JSON-LD block and the brand name in the footer and the legal pages.
      `NEXT_PUBLIC_SITE_URL` only needs setting to override it; leave it unset
      on preview deployments so they inherit the production canonical. The
      build now rejects a value that is not a bare https origin, and
      `e2e/seo.spec.ts` fails if a canonical, the sitemap or `robots.txt` ever
      points at a different host than the one serving the page.

### Recommended

- [ ] Submit `https://mietminderung-online.de/sitemap.xml` in Google Search
      Console, after verifying the property. Until this is done the site is
      effectively invisible: nothing links to it yet, so Google has no reason to
      discover it on its own. It lists 86 URLs — the calculator, 58 defect
      pages, 13 category hubs, the guides and the legal texts.
- [ ] Run `npm run verify` (lint → i18n check → build → E2E) one last time.
      The same steps run automatically on every pull request via
      `.github/workflows/ci.yml`.

---

## 2. The site is free and download-only

There is no paid service, no checkout and no payment data. A tenant answers the
eligibility questions, gets a reduction estimate, writes the Mängelanzeige and
downloads it as PDF or `.txt` — or copies the text. Sending the letter is up to
them.

**Postal dispatch was removed.** The earlier build showed a 4,99 € "send by
post" option that called the eBrief API directly: no checkout, no payment
provider, no order confirmation and no Widerrufsbelehrung — and the money was
never actually collected. That is a `§ 312j Abs. 3 BGB` violation (the
"Button-Lösung" requires a *Zahlungspflichtig bestellen* button backed by a real
order flow) and an open invitation for an Abmahnung. The feature, its API route,
its feature flag, its eBrief credentials and all of its copy are gone; the legal
texts now simply state that no paid service is offered.

The implementation is preserved in git history and in the pull request, so it can
be recovered when it is rebuilt. To bring it back you will need, at minimum:

- [ ] A payment provider (Stripe, Mollie, PayPal).
- [ ] An order confirmation email (`§ 312i Abs. 1 Nr. 3 BGB`).
- [ ] The explicit consent checkbox for starting the service before the
      withdrawal period ends (`§ 356 Abs. 4 BGB`).
- [ ] A full Widerrufsbelehrung with Muster-Widerrufsformular back on `/widerruf`,
      which currently states that there is nothing to withdraw.
- [ ] `EBRIEF_USERNAME` / `EBRIEF_PASSWORD` in the environment.
- [ ] Your VAT position: as a Kleinunternehmer you add the `§ 19 UStG` note, as a
      VAT-liable business a `USt-IdNr.` in the Impressum and a 19 % MwSt. line on
      the price. Both live in `src/lib/site.ts` and the legal page files. While
      everything is free this question has no subject.

---

## 3. What was fixed

### Legal

| Problem                                                                                             | Fix                                                                                  |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Privacy policy claimed "keine Cookies, kein Tracking" while `@vercel/analytics` was loaded on every page | Vercel Web Analytics is now disclosed with purpose, legal basis (Art. 6 (1)(f)) and why no consent banner is required (§ 25 Abs. 2 TDDDG) |
| Terms said "Sämtliche Dienste sind kostenlos" while a 4,99 € option was live                       | Postal dispatch removed entirely; the terms now describe a free, download-only service |
| Privacy policy named Anthropic as the AI processor                                                   | Replaced with Google Ireland Ltd. (Gemini), incl. what is and is not transmitted      |
| Privacy policy named Resend for email delivery that no longer existed                                | Removed, along with the dead `/api/send-email` route and the `resend` dependency      |
| No Widerrufsbelehrung despite a paid service                                                         | New `/widerruf` page with the statutory text and Muster-Widerrufsformular             |
| No § 18 Abs. 2 MStV content responsibility, no VSBG statement                                        | Both added to the Impressum                                                           |
| Missing RDG disclaimer (automated legal-document generation)                                         | Added to Impressum and AGB                                                            |
| Legal pages had no header, footer or navigation                                                      | Shared `LegalPage` shell with full site chrome                                        |
| No retention periods, no Art. 22 statement, no recipient overview                                    | All added to the privacy policy                                                       |

> The ODR platform link was deliberately **not** added: the EU ODR platform was
> shut down on 20 July 2025 and the linking obligation was repealed with it.

### Translations

- The defect catalogue (13 categories, 58 defects with descriptions) and all
  12 FAQ entries were German-only in every language. All 153 strings are now
  translated into Turkish, Ukrainian, Russian, Arabic and Polish.
- Arabic never actually rendered right-to-left — `dir` was computed but never
  applied. `<html dir>` and `<html lang>` now follow the selected language.
- Hardcoded German strings in the FAQ page and footer are now translated.
- `npm run check:i18n` fails the build if any locale drifts.

### AI

- `/api/enhance-beschreibung` now uses Google Gemini (`gemini-2.5-flash`,
  override with `GEMINI_MODEL`) via `@google/genai`, with a JSON response schema
  instead of regex-parsing the model output.
- Falls back to the user's own text on a missing key, a bad response or an error
  — the letter is never blocked by the AI.
- Input is bounded (30 defects, 2 000 characters each).

### UI / mobile

- New design system: warm paper neutrals, deep steel blue matched to the logo,
  layered shadows, tighter type. Replaces the generic blue/gradient look.
- Three competing language switchers (header bar, header dropdown, hero) merged
  into one accessible control.
- **Signature pad was broken on phones** — the canvas had a fixed 600 × 200
  backing store stretched by CSS, so strokes landed offset from the finger. It
  now scales to `devicePixelRatio` and re-fits on resize/rotate.
- Tap targets raised to ≥ 44 px throughout; rent field uses a numeric keypad;
  postcode/phone/email get the right `inputMode` and `autocomplete`.
- Five-step wizard rail replaced by dots + label on mobile (it used to overflow
  at 360 px).
- Focus-visible rings, `aria-expanded`/`aria-controls` on disclosures, progress
  bar exposed as a `progressbar`, `prefers-reduced-motion` respected.
- Body scroll locks behind the mobile menu; iOS safe-area insets honoured.

### Correctness

- The minimum reduction rate was not capped at 100 % while max and typical were.
- Email is now validated before the letter wizard advances.
- Clipboard and localStorage failures no longer throw in private mode.
- `useSyncExternalStore` replaces a `setState`-in-effect that caused a
  German-first flash on every load.

---

## 4. Test coverage

`npm run test:e2e` runs the suite on desktop Chrome and Pixel 5 viewports:

- full calculator funnel, both disqualifying paths, back navigation, validation gates
- letter wizard end to end, PDF and .txt download, signature drawing/clearing
- every language: UI, defect catalogue, FAQ, persistence, RTL, and a check that
  the generated letter stays German
- all four legal pages: required clauses, footer links, sitemap entries
- regression guards for the two legal contradictions that were fixed
- a horizontal-overflow assertion on every step of every flow
- link checks: no dead internal route, no anchor without a target

---

## 5. Known limitations

- **The Minderungsquoten are additive and uncapped per defect.** Selecting many
  defects can produce implausibly high totals (capped only at 100 %). German
  courts do not simply add quotas. Worth revisiting with a degressive model.
- **Legal texts are German only.** That is deliberate — only the German version
  is binding — and non-German visitors see a note saying so. If you want
  translated courtesy versions, they must be marked non-binding.
- **`/api/save-email` was replaced** by the opt-in case storage
  (`/api/case`, Neon Postgres, double opt-in, DB-backed rate limiting).
  Residual rows in the old Google Sheet must be deleted or re-consented —
  silently migrating them into the new system is not permissible (different
  consent scope).
- **No cookie banner** — correct as built, since nothing is stored on the device
  beyond the language preference, which is exempt under § 25 Abs. 2 Nr. 2 TDDDG.
  If you later add marketing pixels, you will need one.
