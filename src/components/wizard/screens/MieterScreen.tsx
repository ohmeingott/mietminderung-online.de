"use client";

import { Feld, ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { useTranslation } from "@/i18n/LanguageContext";

export default function MieterScreen() {
  const { state, setMieter } = useWizard();
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
        {/*
          The last field of the step, and the only optional one that buys the
          tenant something: a number turns into a real sentence in the letter.
          No e-mail here - the free download does not need one, and the
          dispatch card asks at the point where a posted letter genuinely has
          to have somewhere to confirm to.
        */}
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
      </div>
    </>
  );
}
