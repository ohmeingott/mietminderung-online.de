"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
          <Button type="button" onClick={reset}>
            Erneut versuchen
          </Button>
          <Button href="/" variant="secondary">
            Zur Startseite
          </Button>
        </div>
      </div>
    </div>
  );
}
