"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Etwas ist schiefgelaufen
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut
          oder kehren Sie zur Startseite zurück.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex justify-center px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors"
          >
            Erneut versuchen
          </button>
          <Link
            href="/"
            className="inline-flex justify-center px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
