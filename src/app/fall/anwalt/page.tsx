import type { Metadata } from "next";
import { Suspense } from "react";
import AnwaltClient from "./AnwaltClient";

// Token-carrying utility page: never indexed, not in the sitemap.
export const metadata: Metadata = {
  title: "Kostenlose anwaltliche Ersteinschätzung — Mietminderung Online",
  robots: { index: false, follow: false },
};

export default function AnwaltPage() {
  return (
    <Suspense>
      <AnwaltClient />
    </Suspense>
  );
}
