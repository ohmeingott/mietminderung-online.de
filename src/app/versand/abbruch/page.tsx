import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import VersandErgebnis from "../VersandErgebnis";

/** Stripe's `cancel_url`. Kept out of the index for the same reasons as the
 * success page — see src/app/versand/erfolg/page.tsx. */
export const metadata: Metadata = buildMetadata({
  title: "Zahlung abgebrochen — Mietminderung Online",
  description:
    "Der Versand wurde abgebrochen. Es wurde nichts versendet und nichts berechnet.",
  path: "/versand/abbruch",
  index: false,
});

export default function VersandAbbruch() {
  return <VersandErgebnis variante="abbruch" />;
}
