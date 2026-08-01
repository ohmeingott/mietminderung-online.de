"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, Pen, Trash2 } from "lucide-react";
import SignaturePad from "signature_pad";
import { ScreenHeading } from "@/components/wizard/Feld";
import { useWizard } from "@/components/wizard/WizardContext";
import { useTranslation } from "@/i18n/LanguageContext";

export default function VorschauScreen() {
  const { state, setBriefText, setSignatureData, anreicherungLaeuft } = useWizard();
  const { t } = useTranslation();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  // Read inside the effect without making it a dependency: re-running it would
  // rebuild the pad and lose the drawing.
  const gespeichert = useRef(state.signatureData);
  gespeichert.current = state.signatureData;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
      penColor: "rgb(17, 17, 17)",
      minWidth: 0.8,
      maxWidth: 2.2,
    });
    padRef.current = pad;

    /*
     * Committing on every finished stroke, rather than behind a "save"
     * button. The button was a trap: draw, tap on, and the PDF came out
     * unsigned with nothing to say so.
     */
    const onEndStroke = () => setSignatureData(pad.toDataURL());
    pad.addEventListener("endStroke", onEndStroke);

    // Resizing the canvas wipes it, so only do it when the size really
    // changed - mobile browsers fire resize events when the URL bar
    // collapses, and without this guard a finished signature would vanish
    // mid-scroll.
    let lastWidth = 0;
    let lastHeight = 0;

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      if (Math.abs(width - lastWidth) < 1 && Math.abs(height - lastHeight) < 1) return;
      lastWidth = width;
      lastHeight = height;

      // A genuine resize - an orientation change, or a restored draft being
      // drawn for the first time - must not destroy the signature either.
      const striche = pad.toData();
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      pad.clear();

      if (striche.length) {
        pad.fromData(striche);
      } else if (gespeichert.current) {
        void pad.fromDataURL(gespeichert.current, { width, height });
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      pad.removeEventListener("endStroke", onEndStroke);
      pad.off();
      padRef.current = null;
    };
    // Mounted once per visit to this screen; see the refs above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loeschen = () => {
    padRef.current?.clear();
    setSignatureData("");
  };

  return (
    <>
      <ScreenHeading title={t("letter.previewTitle")} description={t("letter.editHint")} />

      <label htmlFor="brieftext" className="sr-only">
        {t("letter.previewTitle")}
      </label>
      <textarea
        id="brieftext"
        data-testid="brieftext"
        /* The letter is German even when the interface is Arabic. */
        dir="ltr"
        value={state.briefText}
        onChange={(e) => setBriefText(e.target.value)}
        className="mt-5 min-h-[18rem] w-full resize-y rounded-[var(--radius-field)] border border-ink-200 bg-paper-raised p-4 text-start font-mono text-[0.8125rem] leading-relaxed text-ink-800 transition-colors focus:border-brand-500 focus:outline-none sm:min-h-[24rem] sm:p-6 sm:text-sm lg:min-h-[32rem] lg:p-8"
        rows={22}
      />
      {anreicherungLaeuft && (
        <p className="mt-2 text-sm text-ink-500">{t("letter.creating")}</p>
      )}

      <div className="mt-6">
        <h3 className="mb-1 flex items-center gap-2 font-semibold text-ink-800">
          <Pen className="h-4 w-4" aria-hidden />
          {t("letter.signature")}
        </h3>
        <p className="mb-3 text-sm text-ink-500">{t("letter.signatureDesc")}</p>
        <div className="relative overflow-hidden rounded-[var(--radius-field)] border border-ink-300 bg-white">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 bottom-9 border-b border-dashed border-ink-200"
          />
          <canvas
            ref={canvasRef}
            data-testid="signature-canvas"
            className="signature-canvas h-[180px] w-full touch-none sm:h-[150px]"
            aria-label={t("letter.signature")}
          />
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="button"
            data-testid="signature-clear"
            onClick={loeschen}
            className="inline-flex min-h-[2.75rem] items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-alert-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            {t("letter.clearSig")}
          </button>
          {state.signatureData && (
            <span
              data-testid="signature-saved"
              className="inline-flex items-center gap-1.5 text-sm text-signal-600"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              {t("letter.sigSaved")}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
