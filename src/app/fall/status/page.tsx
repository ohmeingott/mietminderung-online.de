import type { Metadata } from "next";
import { Suspense } from "react";
import StatusClient from "./StatusClient";

// Token-carrying utility page: never indexed, not in the sitemap.
export const metadata: Metadata = {
  title: "Ihr Fall — Mietminderung Online",
  robots: { index: false, follow: false },
};

export default function StatusPage() {
  return (
    <Suspense>
      <StatusClient />
    </Suspense>
  );
}
