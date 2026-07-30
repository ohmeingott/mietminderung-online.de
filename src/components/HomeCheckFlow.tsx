"use client";

import { useRef, useState } from "react";
import MietminderungCheck from "@/components/MietminderungCheck";
import Maengelanzeige from "@/components/Maengelanzeige";
import MaengelanzeigeTeaser from "@/components/MaengelanzeigeTeaser";
import type { CheckResult } from "@/types/case";

/**
 * The interactive part of the landing page. Isolated in its own client
 * component so the page itself can stay a server component and emit
 * structured data and static internal links.
 */
export default function HomeCheckFlow() {
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const maengelanzeigeRef = useRef<HTMLDivElement>(null);

  const handleCheckComplete = (result: CheckResult) => {
    setCheckResult(result);
    setTimeout(() => {
      maengelanzeigeRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <MietminderungCheck onComplete={handleCheckComplete} />

      <div ref={maengelanzeigeRef} style={{ scrollMarginTop: "6rem" }}>
        {checkResult && checkResult.eligible ? (
          <Maengelanzeige
            selectedMaengel={checkResult.selectedMaengel}
            bruttowarmmiete={checkResult.bruttowarmmiete}
            minderungsquote={checkResult.totalMinderungTypical}
            eligibilityAnswers={checkResult.eligibilityAnswers}
          />
        ) : (
          <MaengelanzeigeTeaser />
        )}
      </div>
    </>
  );
}
