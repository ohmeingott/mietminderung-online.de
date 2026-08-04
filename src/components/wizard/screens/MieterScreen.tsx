"use client";

import { Feld, ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { useTranslation } from "@/i18n/LanguageContext";

export default function MieterScreen() {
  const { state, setMieter, setEmailOptIn } = useWizard();
  const { t } = useTranslation();
  const { mieter } = state;

  return (
    <>
      <ScreenHeading title={t("letter.yourData")} />

      <div className="mt-6 space-y-4">
        <Feld
          name="mieter-name"
          label={t("letter.name")}
          value={mieter.name}
          onChange={(v) => setMieter({ name: v })}
          required
          placeholder="Max Mustermann"
          autoComplete="name"
        />
        <Feld
          name="mieter-strasse"
          label={t("letter.street")}
          value={mieter.strasse}
          onChange={(v) => setMieter({ strasse: v })}
          required
          placeholder="Musterstraße 10"
          autoComplete="street-address"
        />
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <Feld
              name="mieter-plz"
              label={t("letter.zip")}
              value={mieter.plz}
              onChange={(v) => setMieter({ plz: v })}
              required
              placeholder="12345"
              inputMode="numeric"
              maxLength={5}
              autoComplete="postal-code"
            />
          </div>
          <div className="col-span-2">
            <Feld
              name="mieter-ort"
              label={t("letter.city")}
              value={mieter.ort}
              onChange={(v) => setMieter({ ort: v })}
              required
              placeholder="Berlin"
              autoComplete="address-level2"
            />
          </div>
        </div>
        <Feld
          name="mieter-wohnung"
          label={t("letter.aptNr")}
          value={mieter.wohnungNr}
          onChange={(v) => setMieter({ wohnungNr: v })}
          placeholder="z.B. 3. OG links"
        />
        <Feld
          name="mieter-telefon"
          label={t("letter.phone")}
          value={mieter.telefon}
          onChange={(v) => setMieter({ telefon: v })}
          type="tel"
          inputMode="tel"
          placeholder="0176 12345678"
          autoComplete="tel"
          hint={t("letter.phoneWhy")}
        />
        {/*
          No longer a required field. The free download needs no address, and
          gating a free tool behind one was a wall in the middle of the flow.
          The dispatch card asks for it at the point where it is genuinely
          needed - a posted letter has to have somewhere to confirm to.
        */}
        <Feld
          name="mieter-email"
          label={t("letter.email")}
          value={mieter.email}
          onChange={(v) => setMieter({ email: v })}
          type="email"
          inputMode="email"
          placeholder="max@beispiel.de"
          autoComplete="email"
          hint={t("letter.emailOptional")}
        />

        <label className="flex cursor-pointer items-start gap-3 rounded-field bg-paper-sunken p-4">
          <input
            type="checkbox"
            data-testid="mieter-optin"
            checked={state.emailOptIn}
            onChange={(e) => setEmailOptIn(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
          />
          <span className="text-sm text-ink-600">{t("letter.emailOptIn")}</span>
        </label>
      </div>
    </>
  );
}
