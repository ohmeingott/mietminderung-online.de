"use client";

import { Info } from "lucide-react";
import { Feld, INPUT_CLASSES, ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * Shortcuts for "seit wann", written into the same field the tenant can still
 * type in freely.
 *
 * The values are German regardless of the interface language, because they end
 * up in the letter — which is German, addressed to a German landlord. Only the
 * button labels are translated.
 *
 * They carry no preposition: the letter renders "(besteht seit …)" around
 * them. And they are deliberately vague. The field asked for a date, people
 * who cannot name one leave it empty, and an empty field is what makes a
 * Mängelanzeige hard to act on. "seit dieser Woche" is worth more than nothing.
 */
const SEIT_VORSCHLAEGE: readonly { wert: string; key: string }[] = [
  { wert: "heute", key: "letter.sinceToday" },
  { wert: "dieser Woche", key: "letter.sinceThisWeek" },
  { wert: "diesem Monat", key: "letter.sinceThisMonth" },
  { wert: "über einem Monat", key: "letter.sinceLonger" },
] as const;

export default function BeschreibungScreen() {
  const { state, selectedMaengel, setMangelDetail, mangelLabel } = useWizard();
  const { t, locale } = useTranslation();

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
                  <div>
                    <Feld
                      name={`detail-seit-${i}`}
                      label={t("letter.sincewhen")}
                      value={detail?.seit ?? ""}
                      onChange={(v) => setMangelDetail(mangel.id, { seit: v })}
                      maxLength={60}
                      // No "seit" in the example: the letter puts the
                      // preposition in front of whatever stands here.
                      placeholder="z.B. Anfang Mai 2026"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {SEIT_VORSCHLAEGE.map(({ wert, key }) => {
                        const aktiv = detail?.seit === wert;
                        return (
                          <button
                            key={wert}
                            type="button"
                            data-testid={`detail-seit-${i}-${wert.split(" ")[0]}`}
                            // Clicking the active one clears it again, so a
                            // mistap is undone with the same finger.
                            onClick={() =>
                              setMangelDetail(mangel.id, {
                                seit: aktiv ? "" : wert,
                              })
                            }
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                              aktiv
                                ? "border-brand-500 bg-brand-50 text-brand-800"
                                : "border-ink-200 text-ink-500 hover:border-brand-300 hover:text-ink-700"
                            }`}
                          >
                            {t(key)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
                    /*
                      Used to show the catalogue's own description of the
                      defect — a finished-sounding sentence that read as a
                      value already filled in rather than as a question. The
                      field was then left empty, and the letter said nothing
                      the defect label had not already said.
                    */
                    placeholder={t("letter.detailDescPlaceholder")}
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
