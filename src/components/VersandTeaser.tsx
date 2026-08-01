import Link from "next/link";
import { PRODUKTE } from "@/lib/ebrief/produkte";
import { VERSAND_PATH } from "@/lib/seo";

/**
 * The homepage section that says the quiet part out loud: this site does not
 * only tell you whether you have a claim, it puts the letter in the post.
 *
 * German-only and server-rendered, like `PopularLinks` — its job is to carry
 * the "Mängelanzeige versenden" vocabulary and the internal link on the page
 * with the most authority. The translated wizard further up still offers the
 * dispatch in every language; this block is the crawlable statement of it.
 *
 * Prices come from `PRODUKTE`, the record the checkout charges from.
 */

const euro = (cent: number) =>
  (cent / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

const optionen = [
  {
    titel: "Als Brief",
    preis: euro(PRODUKTE.brief.preisCent),
    text: "Wir drucken die Mängelanzeige und geben sie zur Post. Sie brauchen weder Drucker noch Briefmarke.",
  },
  {
    titel: "Als Einwurf-Einschreiben",
    preis: euro(PRODUKTE.einwurfEinschreiben.preisCent),
    text: "Zusätzlich wird der Einwurf in den Briefkasten dokumentiert — der Nachweis, auf den es im Streitfall ankommt.",
  },
];

export default function VersandTeaser() {
  return (
    <section
      id="versenden"
      className="scroll-mt-24 border-y border-ink-200 bg-paper-sunken py-16 sm:py-24"
      aria-labelledby="versenden-titel"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Nicht nur prüfen — erledigen
            </p>
            <h2
              id="versenden-titel"
              className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-4xl"
            >
              Wir verschicken Ihre Mängelanzeige an den Vermieter
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
              Die meisten Mietminderungen scheitern nicht am Recht, sondern
              daran, dass der Brief nie geschrieben oder nie abgeschickt wird.
              Deshalb hört es hier nicht mit dem Ergebnis auf: Sie erstellen die
              Mängelanzeige kostenlos, und auf Wunsch drucken wir sie und geben
              sie an Ihren Vermieter zur Post — nachweisbar, wenn Sie das
              Einwurf-Einschreiben wählen.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              Der Download als PDF bleibt in jedem Fall kostenlos. Bezahlt wird
              nur der Versand, und nur wenn Sie ihn wollen.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#pruefung"
                className="inline-flex min-h-[3rem] items-center justify-center rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800"
              >
                Anspruch kostenlos prüfen
              </Link>
              <Link
                href={VERSAND_PATH}
                className="inline-flex min-h-[3rem] items-center justify-center rounded-full border border-ink-200 bg-paper-raised px-6 font-semibold text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                So funktioniert der Versand
              </Link>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {optionen.map((option) => (
              <li
                key={option.titel}
                className="rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised p-5 sm:p-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-bold text-ink-900 sm:text-lg">
                    {option.titel}
                  </h3>
                  <p className="shrink-0 text-lg font-extrabold text-brand-700">
                    {option.preis}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {option.text}
                </p>
              </li>
            ))}
            <li className="text-xs leading-relaxed text-ink-400">
              Endpreise. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.
              Details und häufige Fragen auf der{" "}
              <Link
                href={VERSAND_PATH}
                className="font-medium text-brand-700 hover:underline"
              >
                Seite zum Versand
              </Link>
              .
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
