"use client";

import { Info } from "lucide-react";
import { Feld, ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { useTranslation } from "@/i18n/LanguageContext";
import type { Anrede } from "@/lib/brief/generateBriefText";

/**
 * "firma" first and preselected: it is the safe answer for a company and for a
 * private landlord whose form of address the tenant does not know, and it is
 * what the letter did for everyone before this field existed.
 */
const ANREDEN: readonly { id: Anrede; key: string }[] = [
  { id: "firma", key: "letter.salutationCompany" },
  { id: "frau", key: "letter.salutationMs" },
  { id: "herr", key: "letter.salutationMr" },
] as const;

export default function VermieterScreen() {
  const { state, setVermieter } = useWizard();
  const { t } = useTranslation();
  const { vermieter } = state;
  const anrede: Anrede = vermieter.anrede ?? "firma";

  return (
    <>
      <ScreenHeading title={t("letter.landlordData")} description={t("letter.landlordDesc")} />

      <div className="mt-6 space-y-4">
        {/*
          Decides the first line the landlord reads. Left alone it produces
          "Sehr geehrte Damen und Herren", which is correct for a company and
          for a private landlord whose form of address is unknown — so this
          costs nobody a decision they cannot skip.
        */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink-700">
            {t("letter.salutation")}
          </legend>
          <div className="grid grid-cols-3 gap-2.5">
            {ANREDEN.map(({ id, key }) => {
              const aktiv = id === anrede;
              return (
                <label
                  key={id}
                  data-testid={`vermieter-anrede-${id}`}
                  className={`flex min-h-[2.75rem] cursor-pointer items-center justify-center rounded-field border px-2 py-2 text-center text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500 ${
                    aktiv
                      ? "border-brand-500 bg-brand-50 text-ink-900"
                      : "border-ink-200 bg-paper-raised text-ink-600 hover:border-brand-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="vermieter-anrede"
                    value={id}
                    checked={aktiv}
                    onChange={() => setVermieter({ anrede: id })}
                    className="sr-only"
                  />
                  {t(key)}
                </label>
              );
            })}
          </div>
        </fieldset>

        <Feld
          name="vermieter-name"
          label={t("letter.landlordName")}
          value={vermieter.name}
          onChange={(v) => setVermieter({ name: v })}
          required
          placeholder={
            anrede === "firma" ? "Hausverwaltung GmbH" : "Ursula Fehrenbach"
          }
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
      <div className="mt-5 flex items-start gap-3 rounded-field bg-paper-sunken p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden />
        <p className="text-sm text-ink-600">{t("letter.landlordAddressHint")}</p>
      </div>
    </>
  );
}
