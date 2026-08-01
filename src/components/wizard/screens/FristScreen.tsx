"use client";

import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { FRIST_OPTIONEN, fristDatum, formatiereDatum } from "@/lib/brief/frist";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * How long the landlord gets.
 *
 * The letter used to demand repair within a flat fourteen days, for a burst
 * pipe and a sticking balcony door alike - while the catalogue had carried a
 * per-defect figure between one and thirty days all along, read only by the
 * SEO pages. This screen puts that figure in front of the person whose letter
 * it is, with the date it produces, and lets them overrule it.
 */
export default function FristScreen() {
  const { fristTage, setFristTage, fristVorschlag, mangelLabel } = useWizard();
  const { t } = useTranslation();

  const heute = new Date();
  const treiberName = fristVorschlag.treiber ? mangelLabel(fristVorschlag.treiber) : "";

  return (
    <>
      <ScreenHeading title={t("frist.title")} description={t("frist.desc")} />

      <fieldset className="mt-8">
        <legend className="sr-only">{t("frist.title")}</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {FRIST_OPTIONEN.map((tage) => {
            const aktiv = tage === fristTage;
            return (
              <label
                key={tage}
                data-testid={`frist-${tage}`}
                className={`relative flex min-h-[5.5rem] cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--radius-field)] border px-2 py-3 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500 ${
                  aktiv
                    ? "border-brand-500 bg-brand-50"
                    : "border-ink-200 bg-paper-raised hover:border-brand-300"
                }`}
              >
                <input
                  type="radio"
                  name="frist"
                  value={tage}
                  checked={aktiv}
                  onChange={() => setFristTage(tage)}
                  className="sr-only"
                />
                <span className="text-lg font-bold tabular-nums text-ink-900">
                  {t("frist.days").replace("{n}", String(tage))}
                </span>
                {/* The date is the point of the screen: "14 Tage" is a
                    number, "bis 01.12.2026" is a thing you can plan around. */}
                <span className="text-xs tabular-nums text-ink-500">
                  {t("frist.until").replace("{datum}", formatiereDatum(fristDatum(heute, tage)))}
                </span>
                {tage === fristVorschlag.tage && (
                  <span className="absolute -top-2 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-600 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white rtl:translate-x-1/2">
                    {t("frist.recommended")}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {treiberName && (
        <p className="mt-4 flex items-start gap-2 text-sm text-ink-600">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
          <span>
            {(fristVorschlag.dringend ? t("frist.suggestionUrgent") : t("frist.suggestion"))
              .replace("{n}", String(fristVorschlag.tage))
              .replace("{mangel}", treiberName)}
          </span>
        </p>
      )}

      <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-field)] bg-paper-sunken p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden />
        <p className="text-sm text-ink-600">
          <strong className="text-ink-800">{t("frist.deliveryTitle")}</strong>{" "}
          {t("frist.deliveryText")}
        </p>
      </div>

      {fristVorschlag.dringend && (
        <div className="mt-4 flex items-start gap-3 rounded-[var(--radius-field)] border border-caution-600/20 bg-caution-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caution-600" aria-hidden />
          <p className="text-sm text-caution-600">
            <strong>{t("frist.urgentTitle")}</strong>{" "}
            {t("frist.urgentText").replace("{mangel}", treiberName)}
          </p>
        </div>
      )}
    </>
  );
}
