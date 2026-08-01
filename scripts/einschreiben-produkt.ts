/**
 * Asks eBrief what `IsTracking: true` actually costs and, more importantly,
 * what it is called.
 *
 * The public sources do not settle it: the API documentation describes the
 * attribute only as "Enables tracking for the shipment after printing and
 * enveloping", the price catalogue calls the surcharge "eEinschreiben", the
 * English pages say "eTracked Letter", and the PIN AG terms list four distinct
 * Einschreiben variants (Einwurf, Übergabe, Persönlich, Rückschein) without
 * saying which one the hybrid product is.
 *
 * The UI and the AGB promise an Einwurf-Einschreiben with documented delivery
 * into the mailbox and explicitly not a handover against signature. That
 * promise is currently unbacked, and the price response is the one place the
 * API names its own articles — `ArticleName` and `ArticleNumber` per position.
 *
 * Read-only: POST /Prices creates nothing and bills nothing.
 *
 *   EBRIEF_USER=… EBRIEF_PASSWORD=… npx tsx scripts/einschreiben-produkt.ts
 *
 * EBRIEF_BASE_URL defaults to the staging host, which is the right place for
 * this — the answer is the same and nothing can be triggered by accident.
 */
import { getPrice } from "../src/lib/ebrief/client";

if (!process.env.EBRIEF_USER || !process.env.EBRIEF_PASSWORD) {
  console.error(
    "EBRIEF_USER und EBRIEF_PASSWORD müssen gesetzt sein.\n" +
      "Im Hauptverzeichnis z. B.:  vercel env pull .env.local  " +
      "und dann  npx tsx --env-file=.env.local scripts/einschreiben-produkt.ts"
  );
  process.exit(1);
}

async function main(): Promise<void> {
  console.log("Basis-URL:", process.env.EBRIEF_BASE_URL ?? "(Default: Staging)");
  console.log();

  for (const isTracking of [false, true]) {
    const antwort = await getPrice({
      pages: 1,
      isColor: false,
      isDuplex: false,
      isTracking,
    });

    console.log(`IsTracking: ${isTracking}`);
    console.log(
      `  Summe brutto: ${antwort.TotalSumBrutto ?? "—"}  ` +
        `netto: ${antwort.TotalSumNetto ?? "—"}`
    );

    const posten = antwort.Prices ?? [];
    if (posten.length === 0) {
      console.log("  (keine Einzelposten in der Antwort)");
    }
    for (const p of posten) {
      console.log(
        `  • ${p.ArticleName ?? "(ohne Namen)"}` +
          `  [Nr. ${p.ArticleNumber ?? "—"}, Typ ${p.Type ?? "—"}]` +
          `  ${p.PriceNetto ?? "—"} netto / ${p.PriceBrutto ?? "—"} brutto`
      );
    }
    console.log();
  }

  console.log(
    [
      "Entscheidend ist der Artikelname der getrackten Variante.",
      "Enthält er „Einwurf“, ist die Zusage in Oberfläche und AGB gedeckt.",
      "Nennt er nur „Einschreiben“ oder „Tracking“, muss sie umformuliert",
      "oder von PIN AG schriftlich bestätigt werden.",
    ].join("\n")
  );
}

main().catch((err) => {
  console.error("Preisabfrage fehlgeschlagen:", err);
  process.exit(1);
});
