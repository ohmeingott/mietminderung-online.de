"use client";

import { Info } from "lucide-react";
import { Feld, ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { useTranslation } from "@/i18n/LanguageContext";

export default function VermieterScreen() {
  const { state, setVermieter } = useWizard();
  const { t } = useTranslation();
  const { vermieter } = state;

  return (
    <>
      <ScreenHeading title={t("letter.landlordData")} description={t("letter.landlordDesc")} />

      <div className="mt-6 space-y-4">
        <Feld
          name="vermieter-name"
          label={t("letter.landlordName")}
          value={vermieter.name}
          onChange={(v) => setVermieter({ name: v })}
          required
          placeholder="Hausverwaltung GmbH"
          autoComplete="off"
        />
        <Feld
          name="vermieter-strasse"
          label={t("letter.street")}
          value={vermieter.strasse}
          onChange={(v) => setVermieter({ strasse: v })}
          required
          placeholder="Vermieterstraße 5"
          autoComplete="off"
        />
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <Feld
              name="vermieter-plz"
              label={t("letter.zip")}
              value={vermieter.plz}
              onChange={(v) => setVermieter({ plz: v })}
              required
              placeholder="12345"
              inputMode="numeric"
              maxLength={5}
              autoComplete="off"
            />
          </div>
          <div className="col-span-2">
            <Feld
              name="vermieter-ort"
              label={t("letter.city")}
              value={vermieter.ort}
              onChange={(v) => setVermieter({ ort: v })}
              required
              placeholder="Berlin"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Said here rather than after payment: eBrief's address field is short,
          and a rejected job is a refund and a wasted afternoon. */}
      <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-field)] bg-paper-sunken p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden />
        <p className="text-sm text-ink-600">{t("letter.landlordAddressHint")}</p>
      </div>
    </>
  );
}
