"use client";

import { useId, useState } from "react";

interface Props {
  min: number;
  max: number;
  typical: number;
  label: string;
}

const euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/**
 * Inline calculator on the defect landing pages. Keeps visitors on the page
 * and gives the content a concrete, personalised answer.
 */
export default function MinderungRechner({ min, max, typical, label }: Props) {
  const [miete, setMiete] = useState(1000);
  const [quote, setQuote] = useState(typical);
  const mieteId = useId();
  const quoteId = useId();

  const ersparnisMonat = Math.round((miete * quote) / 100);
  const zuZahlen = miete - ersparnisMonat;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Mietminderung berechnen
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Für den Mangel „{label}“ — Grundlage ist Ihre Bruttowarmmiete.
      </p>

      <div className="space-y-6">
        <div>
          <label
            htmlFor={mieteId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ihre Bruttowarmmiete (Kaltmiete + Nebenkosten)
          </label>
          <div className="relative">
            <input
              id={mieteId}
              type="number"
              min={0}
              step={10}
              value={miete}
              onChange={(e) => setMiete(Math.max(0, Number(e.target.value) || 0))}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              €
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor={quoteId}
            className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2"
          >
            <span>Minderungsquote</span>
            <span className="text-blue-700 font-bold text-base">{quote} %</span>
          </label>
          <input
            id={quoteId}
            type="range"
            min={min}
            max={max}
            step={1}
            value={quote}
            onChange={(e) => setQuote(Number(e.target.value))}
            className="w-full accent-blue-700"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{min} % (Untergrenze)</span>
            <span>{max} % (Obergrenze)</span>
          </div>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
          <dt className="text-xs font-medium text-emerald-800 uppercase tracking-wide">
            Minderung pro Monat
          </dt>
          <dd className="mt-1 text-2xl font-extrabold text-emerald-700">
            {euro.format(ersparnisMonat)}
          </dd>
        </div>
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
          <dt className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Zu zahlende Miete
          </dt>
          <dd className="mt-1 text-2xl font-extrabold text-gray-900">
            {euro.format(zuZahlen)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-gray-500 leading-relaxed">
        Bei durchgehendem Mangel über zwölf Monate entspricht das{" "}
        <strong className="text-gray-700">
          {euro.format(ersparnisMonat * 12)}
        </strong>
        . Orientierungswert auf Basis von Gerichtsentscheidungen zu
        vergleichbaren Fällen — keine Rechtsberatung.
      </p>
    </div>
  );
}
