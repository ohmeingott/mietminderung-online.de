import type { Metadata } from "next";
import { Suspense } from "react";
import ConfirmClient from "./ConfirmClient";

// Token-carrying utility page: never indexed, not in the sitemap.
export const metadata: Metadata = {
  title: "E-Mail-Adresse bestätigen — Mietminderung Online",
  robots: { index: false, follow: false },
};

export default function BestaetigenPage() {
  return (
    <Suspense>
      <ConfirmClient />
    </Suspense>
  );
}
