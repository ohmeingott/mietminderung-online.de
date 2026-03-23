import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="text-8xl font-extrabold text-blue-700">404</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Seite nicht gefunden
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Die angeforderte Seite existiert leider nicht. Möglicherweise wurde
          sie verschoben oder die URL ist fehlerhaft.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex justify-center px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors"
          >
            Zur Startseite
          </Link>
          <Link
            href="/#pruefung"
            className="inline-flex justify-center px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Mietminderung prüfen
          </Link>
        </div>
      </div>
    </div>
  );
}
