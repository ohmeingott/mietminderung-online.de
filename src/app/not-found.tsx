import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

/**
 * The 404 body is served with a 404 status, which is what actually keeps it
 * out of the index. The noindex is belt and braces for the case where a proxy
 * or a preview host rewrites the status to 200 — a soft 404 that ranks is
 * worse than no page at all.
 */
export const metadata: Metadata = {
  title: "Seite nicht gefunden (404)",
  description:
    "Die angeforderte Seite existiert nicht. Zurück zur Startseite oder direkt zur Mietminderungsprüfung.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <p className="text-7xl font-bold tracking-tight text-brand-600 sm:text-8xl">404</p>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          Seite nicht gefunden
        </h1>
        <p className="mt-3 leading-relaxed text-ink-600">
          Die angeforderte Seite existiert leider nicht. Möglicherweise wurde sie
          verschoben oder die URL ist fehlerhaft.
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Button href="/">Zur Startseite</Button>
          <Button href="/#pruefung" variant="secondary">
            Mietminderung prüfen
          </Button>
        </div>
      </div>
    </div>
  );
}
