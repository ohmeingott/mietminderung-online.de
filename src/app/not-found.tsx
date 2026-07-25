import Link from "next/link";

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
          <Link
            href="/"
            className="inline-flex min-h-[3rem] items-center justify-center rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Zur Startseite
          </Link>
          <Link
            href="/#pruefung"
            className="inline-flex min-h-[3rem] items-center justify-center rounded-full border border-ink-200 bg-paper-raised px-6 font-semibold text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            Mietminderung prüfen
          </Link>
        </div>
      </div>
    </div>
  );
}
