"use client";

import { useState } from "react";
import { AlertTriangle, Copy, Download, FileText } from "lucide-react";
import NextStepsTimeline from "@/components/wizard/screens/NextStepsTimeline";
import VersandKarte from "@/components/VersandKarte";
import { Button } from "@/components/ui/Button";
import { ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { SCREEN } from "@/components/wizard/screens";
import { formatiereDatum } from "@/lib/brief/frist";
import { generatePdf } from "@/lib/generatePdf";
import { useTranslation } from "@/i18n/LanguageContext";

export default function FertigScreen() {
  const { state, setMieter, gehZu } = useWizard();
  const { t } = useTranslation();
  const [kopiert, setKopiert] = useState(false);

  const { briefText, signatureData, mieter, vermieter } = state;
  const dateiBasis = `Maengelanzeige_${
    mieter.name.replace(/\s+/g, "_") || "Mieter"
  }_${formatiereDatum(new Date()).replace(/\./g, "-")}`;

  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(briefText);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2000);
    } catch {
      // Clipboard blocked (insecure context / permission). The preview screen
      // is one tap away and its textarea is selectable, so nothing is lost.
    }
  };

  const pdfLaden = () => {
    generatePdf({ text: briefText, signatureDataUrl: signatureData || undefined }).save(
      `${dateiBasis}.pdf`
    );
  };

  const txtLaden = () => {
    const blob = new Blob([briefText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dateiBasis}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ScreenHeading title={t("letter.howReceive")} description={t("letter.downloadDesc")} />

      <div className="mt-6 rounded-[var(--radius-field)] border border-brand-200 bg-brand-50 p-5">
        <p className="mb-4 text-center text-sm font-bold text-signal-600">{t("letter.free")}</p>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
          <Button type="button" data-testid="download-pdf" onClick={pdfLaden}>
            <Download className="h-4.5 w-4.5" aria-hidden />
            {t("letter.downloadPdf")}
          </Button>
          <button
            type="button"
            data-testid="download-txt"
            onClick={txtLaden}
            className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full border border-brand-300 bg-paper-raised px-6 font-semibold text-brand-700 transition-colors hover:bg-brand-100"
          >
            <FileText className="h-4.5 w-4.5" aria-hidden />
            {t("letter.downloadTxt")}
          </button>
          <button
            type="button"
            data-testid="copy-text"
            onClick={kopieren}
            className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full border border-brand-300 bg-paper-raised px-6 font-semibold text-brand-700 transition-colors hover:bg-brand-100"
          >
            <Copy className="h-4.5 w-4.5" aria-hidden />
            {kopiert ? t("letter.copied") : t("letter.copyText")}
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-field)] border border-caution-600/20 bg-caution-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caution-600" aria-hidden />
        <p className="text-sm text-caution-600">
          <strong>{t("common.note")}:</strong> {t("letter.warning")}
        </p>
      </div>

      {/*
        The paid alternative, below the free download and never instead of it:
        if dispatch is unavailable the user still has the letter.
      */}
      <VersandKarte
        text={briefText}
        signatureDataUrl={signatureData || undefined}
        mieter={{
          name: mieter.name,
          strasse: mieter.strasse,
          plz: mieter.plz,
          ort: mieter.ort,
          email: mieter.email,
        }}
        vermieter={vermieter}
        onEmailChange={(email) => setMieter({ email })}
        onAdresseKorrigieren={() => gehZu(SCREEN.VERMIETER)}
      />

      <NextStepsTimeline />
    </>
  );
}
