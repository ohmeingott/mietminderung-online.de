"use client";

import { Info } from "lucide-react";
import { Feld, INPUT_CLASSES, ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { mangelDescKey } from "@/i18n/content";
import { useTranslation } from "@/i18n/LanguageContext";

export default function BeschreibungScreen() {
  const { state, selectedMaengel, setMangelDetail, mangelLabel } = useWizard();
  const { t, tc, locale } = useTranslation();

  return (
    <>
      <ScreenHeading
        title={t("letter.describeDefects")}
        description={t("letter.describeHint")}
      />

      {locale !== "de" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-field border border-brand-200 bg-brand-50 p-3.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
          <p className="text-sm text-brand-800">{t("letter.nativeHint")}</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {selectedMaengel.map((mangel, i) => {
          // Read by id, written by id. Reading by position is what used to put
          // the mould paragraph under the broken-lift heading as soon as a
          // defect further up the list was removed.
          const detail = state.mangelDetails[mangel.id];
          return (
            <div
              key={mangel.id}
              className="rounded-field border border-ink-200 p-4 sm:p-5 lg:p-6"
            >
              <h3 className="font-semibold text-ink-900">
                {i + 1}. {mangelLabel(mangel)}
              </h3>
              {locale !== "de" && (
                <p className="mt-0.5 text-xs text-ink-400">{mangel.label}</p>
              )}

              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Feld
                    name={`detail-raum-${i}`}
                    label={t("letter.whichRoom")}
                    value={detail?.raum ?? ""}
                    onChange={(v) => setMangelDetail(mangel.id, { raum: v })}
                    maxLength={60}
                    placeholder="z.B. Schlafzimmer"
                  />
                  <Feld
                    name={`detail-seit-${i}`}
                    label={t("letter.sincewhen")}
                    value={detail?.seit ?? ""}
                    onChange={(v) => setMangelDetail(mangel.id, { seit: v })}
                    maxLength={60}
                    placeholder="z.B. seit dem 15.01.2026"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`desc-${mangel.id}`}
                    className="mb-1.5 block text-sm font-medium text-ink-700"
                  >
                    {t("letter.detailDesc")}
                  </label>
                  <textarea
                    id={`desc-${mangel.id}`}
                    data-testid={`detail-beschreibung-${i}`}
                    value={detail?.beschreibung ?? ""}
                    onChange={(e) =>
                      setMangelDetail(mangel.id, { beschreibung: e.target.value })
                    }
                    placeholder={tc(mangelDescKey(mangel.id), mangel.description)}
                    rows={3}
                    maxLength={600}
                    className={`${INPUT_CLASSES} resize-y lg:min-h-[6.5rem]`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
