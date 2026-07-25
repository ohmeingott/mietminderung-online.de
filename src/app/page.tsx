"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import MietminderungCheck from "@/components/MietminderungCheck";
import Maengelanzeige from "@/components/Maengelanzeige";
import MaengelanzeigeTeaser from "@/components/MaengelanzeigeTeaser";
import InfoSection from "@/components/InfoSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import type { Mangel } from "@/data/maengel";

interface CheckResult {
  eligible: boolean | null;
  selectedMaengel: Mangel[];
  totalMinderungMin: number;
  totalMinderungMax: number;
  totalMinderungTypical: number;
  bruttowarmmiete: number;
}

export default function Home() {
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const maengelanzeigeRef = useRef<HTMLDivElement>(null);

  const handleCheckComplete = (result: CheckResult) => {
    setCheckResult(result);
    // Wait a tick so the letter wizard is mounted before scrolling to it.
    setTimeout(() => {
      maengelanzeigeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <Hero />
        <HowItWorks />
        <MietminderungCheck onComplete={handleCheckComplete} />

        <div ref={maengelanzeigeRef} className="scroll-mt-20">
          {checkResult?.eligible ? (
            <Maengelanzeige
              selectedMaengel={checkResult.selectedMaengel}
              bruttowarmmiete={checkResult.bruttowarmmiete}
              minderungsquote={checkResult.totalMinderungTypical}
            />
          ) : (
            <MaengelanzeigeTeaser />
          )}
        </div>

        <InfoSection />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
