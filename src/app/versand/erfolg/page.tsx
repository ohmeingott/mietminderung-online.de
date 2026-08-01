import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import VersandErgebnis from "../VersandErgebnis";

/**
 * Stripe's `success_url`. A transactional dead end: it means nothing to anyone
 * who did not just pay, so it stays out of the index (`index: false`) and out
 * of src/app/sitemap.ts, which lists its URLs explicitly.
 *
 * Deliberately *not* also disallowed in src/app/robots.ts: a crawler that is
 * forbidden to fetch the page never sees the noindex, which is the one
 * directive that keeps it out of results.
 */
export const metadata: Metadata = buildMetadata({
  title: "Zahlung erfolgreich — Mietminderung-online",
  description:
    "Ihre Zahlung ist eingegangen. Die Mängelanzeige wird gedruckt und per Post an Ihren Vermieter versendet.",
  path: "/versand/erfolg",
  index: false,
});

export default function VersandErfolg() {
  return <VersandErgebnis variante="erfolg" />;
}
