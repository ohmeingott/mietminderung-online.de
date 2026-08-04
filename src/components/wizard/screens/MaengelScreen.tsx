"use client";

import {
  ArrowLeft,
  ArrowUpDown,
  Bug,
  Check,
  CookingPot,
  DoorOpen,
  Droplets,
  HeartPulse,
  Info,
  Maximize,
  ShowerHead,
  Thermometer,
  TreePine,
  Volume2,
  Wind,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { mangelKategorien } from "@/data/maengel";
import { katKey } from "@/i18n/content";
import { useTranslation } from "@/i18n/LanguageContext";

const iconMap: Record<string, LucideIcon> = {
  Thermometer,
  Droplets,
  Volume2,
  Bug,
  DoorOpen,
  ShowerHead,
  CookingPot,
  ArrowUpDown,
  Zap,
  Maximize,
  TreePine,
  HeartPulse,
  Wind,
};

/**
 * Picking the defects.
 *
 * On a phone this stays a drill-down: thirteen categories, then that
 * category's defects. On a wide screen both panes sit side by side, because
 * there the drill-down was pure cost - a click to open, a click to go back,
 * and a category list that vanished the moment you needed to compare.
 */
export default function MaengelScreen() {
  const {
    state,
    selectedMaengel,
    toggleMangel,
    selectedKategorie,
    setSelectedKategorie,
    quoteMin,
    quoteMax,
    quoteFuer,
    flaecheMangel,
    flaecheAbweichung,
    setFlaecheVereinbart,
    setFlaecheTatsaechlich,
    mangelLabel,
    mangelDesc,
  } = useWizard();
  const { t, tc } = useTranslation();

  const aktiv = mangelKategorien.find((k) => k.id === selectedKategorie) ?? null;
  const istGewaehlt = (id: string) => state.selectedMangelIds.includes(id);

  const kategorieListe = (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-1">
      {mangelKategorien.map((kat) => {
        const Icon = iconMap[kat.icon] || Info;
        const anzahl = kat.maengel.filter((m) => istGewaehlt(m.id)).length;
        const offen = aktiv?.id === kat.id;
        return (
          <button
            key={kat.id}
            type="button"
            data-testid={`kategorie-${kat.id}`}
            aria-pressed={offen}
            onClick={() => setSelectedKategorie(kat.id)}
            className={`card-hover relative flex min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-field border p-3 text-center transition-colors sm:min-h-[6.5rem] lg:min-h-0 lg:flex-row lg:items-center lg:justify-start lg:gap-3 lg:border-0 lg:px-3 lg:py-2.5 lg:text-start ${
              anzahl > 0 || offen
                ? "border-brand-500 bg-brand-50"
                : "border-ink-200 bg-paper-raised hover:border-brand-300 lg:hover:bg-paper-sunken"
            }`}
          >
            {anzahl > 0 && (
              <span className="absolute end-2 top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[0.625rem] font-bold text-white lg:static lg:order-3 lg:ms-auto">
                {anzahl}
              </span>
            )}
            <Icon
              className={`h-6 w-6 shrink-0 lg:h-5 lg:w-5 ${
                anzahl > 0 || offen ? "text-brand-600" : "text-ink-400"
              }`}
              aria-hidden
            />
            <span className="text-xs font-medium leading-tight text-ink-700 sm:text-sm">
              {tc(katKey(kat.id), kat.label)}
            </span>
          </button>
        );
      })}
    </div>
  );

  const mangelListe = aktiv && (
    <div className="space-y-2">
      {aktiv.maengel.map((mangel) => {
        const gewaehlt = istGewaehlt(mangel.id);
        return (
          <button
            key={mangel.id}
            type="button"
            data-testid={`mangel-${mangel.id}`}
            onClick={() => toggleMangel(mangel)}
            aria-pressed={gewaehlt}
            className={`w-full rounded-field border px-4 py-3.5 text-start transition-colors ${
              gewaehlt
                ? "border-brand-500 bg-brand-50"
                : "border-ink-200 bg-paper-raised hover:border-brand-300"
            }`}
          >
            <span className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                  gewaehlt ? "border-brand-600 bg-brand-600" : "border-ink-300"
                }`}
                aria-hidden
              >
                {gewaehlt && <Check className="h-3.5 w-3.5 text-white" />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                {/* The label wraps, the percentage never does: a long defect
                    name used to shove "70–100 %" onto its own ragged line. */}
                <span className="font-medium text-ink-900 [overflow-wrap:anywhere]">
                  {mangelLabel(mangel)}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-500">
                  {mangelDesc(mangel)}
                </span>
              </span>
              <span className="ms-3 shrink-0 whitespace-nowrap text-sm font-bold tabular-nums text-brand-700">
                {mangel.minderung_min}–{mangel.minderung_max}%
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="p-5 sm:p-10">
      <ScreenHeading title={t("check.whichDefects")} description={t("check.whichDefectsDesc")} />

      <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-0">
        {/* Categories: always visible from lg, hidden behind the drill-down
            below it. `lg:block` beats the mobile conditional. */}
        <div
          className={`${aktiv ? "hidden" : ""} lg:block lg:max-h-[26rem] lg:overflow-y-auto lg:overscroll-contain lg:pe-4`}
        >
          {kategorieListe}
        </div>

        <div
          className={`${aktiv ? "" : "hidden"} lg:block lg:max-h-[26rem] lg:overflow-y-auto lg:overscroll-contain lg:border-s lg:border-ink-200 lg:ps-6`}
        >
          {aktiv ? (
            <>
              <button
                type="button"
                data-testid="check-all-categories"
                onClick={() => setSelectedKategorie(null)}
                className="mb-4 inline-flex min-h-[2.75rem] items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-800"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180 lg:hidden" aria-hidden />
                {t("check.allCategories")}
              </button>
              <h3 className="mb-3 font-semibold text-ink-800">
                {tc(katKey(aktiv.id), aktiv.label)}
              </h3>
              {mangelListe}
            </>
          ) : (
            <div className="hidden lg:flex lg:min-h-[16rem] lg:flex-col lg:items-center lg:justify-center lg:gap-3 lg:text-center">
              <Info className="h-6 w-6 text-ink-300" aria-hidden />
              <p className="max-w-[18rem] text-sm text-ink-400">{t("check.pickCategoryHint")}</p>
            </div>
          )}
        </div>
      </div>

      {selectedMaengel.length > 0 && (
        <div className="mt-6 rounded-field border border-brand-200 bg-brand-50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-brand-800">
              {selectedMaengel.length} {t("check.selected")}
            </span>
            <span className="text-sm font-bold tabular-nums text-brand-700">
              ca. {quoteMin}–{quoteMax}% {t("check.approxReduction")}
            </span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {selectedMaengel.map((m) => (
              <li key={m.id}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-paper-raised py-1 ps-3 pe-1 text-xs font-medium text-ink-700">
                  {mangelLabel(m)}
                  <button
                    type="button"
                    data-testid={`remove-${m.id}`}
                    onClick={() => toggleMangel(m)}
                    aria-label={t("check.removeLabel").replace("{label}", mangelLabel(m))}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-alert-50 hover:text-alert-600"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </span>
              </li>
            ))}
          </ul>
          {selectedMaengel.length > 1 && (
            <p className="mt-3 text-xs leading-relaxed text-brand-800">
              {t("check.gesamtbetrachtungHint")}
            </p>
          )}
        </div>
      )}

      {/* The floor-area shortfall is not an estimated range: above the 10 %
          threshold the rent drops by exactly the deviation, so we ask for the
          two areas instead of guessing. */}
      {flaecheMangel && (
        <div
          data-testid="wohnflaeche-panel"
          className="mt-4 rounded-field border border-ink-200 bg-paper-sunken p-4"
        >
          <h4 className="font-semibold text-ink-800">{t("check.flaecheTitle")}</h4>
          <p className="mt-1 text-sm text-ink-600">{t("check.flaecheDesc")}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="flaeche-vereinbart"
                className="block text-sm font-medium text-ink-700"
              >
                {t("check.flaecheVereinbart")}
              </label>
              <input
                id="flaeche-vereinbart"
                data-testid="flaeche-vereinbart"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={state.flaecheVereinbart}
                onChange={(e) => setFlaecheVereinbart(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-field border border-ink-300 bg-paper-raised px-4 font-semibold text-ink-900 tabular-nums focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="flaeche-tatsaechlich"
                className="block text-sm font-medium text-ink-700"
              >
                {t("check.flaecheTatsaechlich")}
              </label>
              <input
                id="flaeche-tatsaechlich"
                data-testid="flaeche-tatsaechlich"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={state.flaecheTatsaechlich}
                onChange={(e) => setFlaecheTatsaechlich(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-field border border-ink-300 bg-paper-raised px-4 font-semibold text-ink-900 tabular-nums focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          {flaecheAbweichung !== null && (
            <p
              data-testid="flaeche-ergebnis"
              className={`mt-3 text-sm font-medium ${
                quoteFuer(flaecheMangel).typical > 0 ? "text-brand-800" : "text-ink-600"
              }`}
            >
              {quoteFuer(flaecheMangel).typical > 0
                ? t("check.flaecheMangel")
                    .replace("{abweichung}", flaecheAbweichung.toFixed(1).replace(".", ","))
                    .replace(
                      "{quote}",
                      quoteFuer(flaecheMangel).typical.toString().replace(".", ",")
                    )
                : t("check.flaecheKeinMangel").replace(
                    "{abweichung}",
                    Math.max(flaecheAbweichung, 0).toFixed(1).replace(".", ",")
                  )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
