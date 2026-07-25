"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-alert-50">
          <AlertTriangle className="h-8 w-8 text-alert-600" aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          Etwas ist schiefgelaufen
        </h1>
        <p className="mt-3 leading-relaxed text-ink-600">
          Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut
          oder kehren Sie zur Startseite zurück.
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[3rem] items-center justify-center rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Erneut versuchen
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[3rem] items-center justify-center rounded-full border border-ink-200 bg-paper-raised px-6 font-semibold text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
