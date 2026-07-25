"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Info,
  Pen,
  Send,
  Trash2,
} from "lucide-react";
import SignaturePad from "signature_pad";
import type { Mangel } from "@/data/maengel";
import { generatePdf, generatePdfBase64 } from "@/lib/generatePdf";
import { useTranslation } from "@/i18n/LanguageContext";
import { mangelDescKey, mangelLabelKey } from "@/i18n/content";

/**
 * Paid postal dispatch is opt-in. It stays hidden until a checkout flow and the
 * Widerrufsbelehrung for paid services exist — see LAUNCH_CHECKLIST.md.
 */
const POST_VERSAND_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_POST_VERSAND === "true";

interface MaengelanzeigeProps {
  selectedMaengel: Mangel[];
  bruttowarmmiete: number;
  minderungsquote: number;
}

interface MieterDaten {
  name: string;
  strasse: string;
  plz: string;
  ort: string;
  telefon: string;
  email: string;
  wohnungNr: string;
}

interface VermieterDaten {
  name: string;
  strasse: string;
  plz: string;
  ort: string;
}

interface MangelDetails {
  mangelId: string;
  beschreibung: string;
  seit: string;
  raum: string;
}

const TOTAL_STEPS = 5;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const inputClasses =
  "w-full min-h-[3rem] rounded-[var(--radius-field)] border border-ink-300 bg-paper-raised px-4 py-3 text-ink-900 transition-colors placeholder:text-ink-300 focus:border-brand-500 focus:outline-none";

export default function Maengelanzeige({
  selectedMaengel,
  bruttowarmmiete,
  minderungsquote,
}: MaengelanzeigeProps) {
  const [step, setStep] = useState(0); // 0=mieter 1=vermieter 2=details 3=preview 4=delivery
  const [mieter, setMieter] = useState<MieterDaten>({
    name: "",
    strasse: "",
    plz: "",
    ort: "",
    telefon: "",
    email: "",
    wohnungNr: "",
  });
  const [vermieter, setVermieter] = useState<VermieterDaten>({
    name: "",
    strasse: "",
    plz: "",
    ort: "",
  });
  const [mangelDetails, setMangelDetails] = useState<MangelDetails[]>(
    selectedMaengel.map((m) => ({
      mangelId: m.id,
      beschreibung: "",
      seit: "",
      raum: "",
    }))
  );
  const [signatureData, setSignatureData] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"download" | "post" | null>(
    POST_VERSAND_ENABLED ? null : "download"
  );
  const [copied, setCopied] = useState(false);
  const [postSending, setPostSending] = useState(false);
  const [postSent, setPostSent] = useState(false);
  const [postError, setPostError] = useState("");
  const [enhancing, setEnhancing] = useState(false);
  const [editedBriefText, setEditedBriefText] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const { t, tc, locale } = useTranslation();

  const mangelLabel = (m: Mangel) => tc(mangelLabelKey(m.id), m.label);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const heuteDatum = () => formatDate(new Date());

  const fristDatum = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return formatDate(d);
  };

  const aktuellerMonat = () =>
    new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  /**
   * The letter itself is always German — it is addressed to a German landlord
   * and quotes the BGB. Only the surrounding UI is translated.
   */
  const generateBriefText = useCallback(() => {
    const mangelTexte = selectedMaengel
      .map((m, i) => {
        const details = mangelDetails[i];
        let text = `${i + 1}. ${m.label}`;
        if (details?.raum) text += ` (Raum: ${details.raum})`;
        if (details?.seit) text += ` — besteht seit ${details.seit}`;
        if (details?.beschreibung) text += `\n   ${details.beschreibung}`;
        return text;
      })
      .join("\n\n");

    return `${mieter.name}
${mieter.strasse}
${mieter.plz} ${mieter.ort}

${vermieter.name}
${vermieter.strasse}
${vermieter.plz} ${vermieter.ort}

${mieter.ort}, den ${heuteDatum()}

Betreff: Mängelanzeige — Wohnung ${mieter.strasse}, ${mieter.plz} ${mieter.ort}${
      mieter.wohnungNr ? `, Wohnung ${mieter.wohnungNr}` : ""
    }

Sehr geehrte/r ${vermieter.name},

hiermit zeige ich Ihnen an, dass sich in der von mir angemieteten Wohnung folgende Mängel befinden:

${mangelTexte}

Ich fordere Sie auf, die oben genannten Mängel umgehend, jedoch bis spätestens zum ${fristDatum()} zu beseitigen.

Das mir zustehende Mietminderungsrecht gemäß § 536 Abs. 1 BGB behalte ich mir vor. Rein vorsorglich erkläre ich, dass die bereits gezahlte Miete für den Monat ${aktuellerMonat()} sowie künftige Mietzahlungen unter dem Vorbehalt der Rückforderung geleistet werden.

Sollten die Mängel nicht fristgerecht beseitigt werden, behalte ich mir weitere rechtliche Schritte vor, insbesondere Schadensersatz gemäß § 536a BGB sowie die Durchführung einer Ersatzvornahme gemäß § 536a Abs. 2 BGB.

Termine zur Mängelbeseitigung können Sie gerne mit mir telefonisch vereinbaren. Sie erreichen mich tagsüber unter der Rufnummer ${mieter.telefon || "[Telefonnummer]"}.

Mit freundlichen Grüßen

${mieter.name}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMaengel, mangelDetails, mieter, vermieter]);

  useEffect(() => {
    if (step === 3) setEditedBriefText(generateBriefText());
    // Regenerating on every keystroke would discard the user's manual edits,
    // so this intentionally only runs when the preview step is entered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Signature pad: size the backing store to the device pixel ratio, otherwise
  // strokes are blurry and land in the wrong place on phones.
  useEffect(() => {
    if (step !== 3) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
      penColor: "rgb(17, 17, 17)",
      minWidth: 0.8,
      maxWidth: 2.2,
    });
    signaturePadRef.current = pad;

    // Resizing the canvas wipes it, so only do it when the size really changed.
    // Mobile browsers fire resize events when the URL bar collapses — without
    // this guard a finished signature would vanish mid-scroll.
    let lastWidth = 0;
    let lastHeight = 0;

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      if (
        Math.abs(width - lastWidth) < 1 &&
        Math.abs(height - lastHeight) < 1
      ) {
        return;
      }
      lastWidth = width;
      lastHeight = height;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      pad.clear();
      setSignatureData("");
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      pad.off();
      signaturePadRef.current = null;
    };
  }, [step]);

  const clearSignature = () => {
    signaturePadRef.current?.clear();
    setSignatureData("");
  };

  const saveSignature = () => {
    const pad = signaturePadRef.current;
    if (pad && !pad.isEmpty()) setSignatureData(pad.toDataURL());
  };

  const enhanceBeschreibungen = async () => {
    setEnhancing(true);
    try {
      const res = await fetch("/api/enhance-beschreibung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maengel: selectedMaengel.map((m, i) => ({
            label: m.label,
            raum: mangelDetails[i]?.raum || "",
            seit: mangelDetails[i]?.seit || "",
            beschreibung: mangelDetails[i]?.beschreibung || "",
          })),
        }),
      });
      const data = await res.json();
      if (
        Array.isArray(data.beschreibungen) &&
        data.beschreibungen.length === mangelDetails.length
      ) {
        setMangelDetails(
          mangelDetails.map((d, i) => ({
            ...d,
            beschreibung: data.beschreibungen[i] || d.beschreibung,
          }))
        );
      }
    } catch {
      // Never block the letter on an AI failure — keep the user's own wording.
    } finally {
      setEnhancing(false);
      setStep(3);
    }
  };

  /** What the user reviewed, plus their signature — nothing rebuilt. */
  const letterPdfOptions = () => ({
    text: editedBriefText,
    signatureDataUrl: signatureData || undefined,
  });

  const fileBase = `Maengelanzeige_${mieter.name.replace(/\s+/g, "_") || "Mieter"}_${heuteDatum().replace(/\./g, "-")}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedBriefText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context / permission) — the textarea above
      // is still selectable, so there is nothing to recover from.
    }
  };

  const handleDownloadPdf = () => {
    generatePdf(letterPdfOptions()).save(`${fileBase}.pdf`);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([editedBriefText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePostSend = async () => {
    setPostSending(true);
    setPostError("");
    try {
      const res = await fetch("/api/send-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfBase64: generatePdfBase64(letterPdfOptions()),
          notificationEmail: mieter.email || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) setPostError(data.error || t("letter.postFailed"));
      else setPostSent(true);
    } catch {
      setPostError(t("letter.networkError"));
    } finally {
      setPostSending(false);
    }
  };

  const stepLabels = [
    t("letter.step.data"),
    t("letter.step.landlord"),
    t("letter.step.defects"),
    t("letter.step.preview"),
    t("letter.step.send"),
  ];

  const mieterValid =
    Boolean(mieter.name && mieter.strasse && mieter.plz && mieter.ort) &&
    EMAIL_PATTERN.test(mieter.email);
  const vermieterValid = Boolean(
    vermieter.name && vermieter.strasse && vermieter.plz && vermieter.ort
  );

  const backButton = (target: number, label = t("check.back")) => (
    <button
      type="button"
      data-testid="letter-back"
      onClick={() => setStep(target)}
      className="inline-flex min-h-[3rem] items-center gap-2 text-sm text-ink-500 transition-colors hover:text-ink-800"
    >
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
      {label}
    </button>
  );

  /**
   * `name` is a stable, language-independent identifier used for the DOM id and
   * the test id, so selectors keep working when the labels are translated.
   */
  const field = (
    name: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts: {
      required?: boolean;
      placeholder?: string;
      type?: string;
      inputMode?: "text" | "numeric" | "tel" | "email";
      maxLength?: number;
      autoComplete?: string;
    } = {}
  ) => {
    return (
      <div>
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-700">
          {label}
          {opts.required && <span className="text-alert-600"> *</span>}
        </label>
        <input
          id={name}
          data-testid={name}
          type={opts.type || "text"}
          inputMode={opts.inputMode}
          maxLength={opts.maxLength}
          autoComplete={opts.autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={opts.placeholder}
          required={opts.required}
          className={inputClasses}
        />
      </div>
    );
  };

  return (
    <section id="maengelanzeige" className="border-y border-ink-200 bg-paper-sunken py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {t("letter.title")}
          </h2>
          <p className="mt-3 text-base text-ink-600 sm:text-lg">{t("letter.subtitle")}</p>
        </div>

        {/* Step indicator — dots + current label on mobile, full rail from sm up */}
        <div className="mt-8 sm:mt-10">
          <div className="flex items-center justify-center gap-1.5 sm:hidden">
            {stepLabels.map((label, i) => (
              <span
                key={label}
                className={`h-1.5 rounded-full transition-all ${
                  i === step
                    ? "w-6 bg-brand-600"
                    : i < step
                      ? "w-1.5 bg-brand-400"
                      : "w-1.5 bg-ink-200"
                }`}
              />
            ))}
          </div>
          <p className="mt-2.5 text-center text-sm font-medium text-ink-600 sm:hidden">
            {t("check.step")} {step + 1} {t("check.of")} {TOTAL_STEPS} — {stepLabels[step]}
          </p>

          <ol className="hidden items-center justify-center sm:flex">
            {stepLabels.map((label, i) => (
              <li key={label} className="flex items-center">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    i <= step ? "bg-brand-700 text-white" : "bg-ink-200 text-ink-500"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                </span>
                <span
                  className={`ms-2 text-xs font-medium ${
                    i <= step ? "text-brand-700" : "text-ink-400"
                  }`}
                >
                  {label}
                </span>
                {i < TOTAL_STEPS - 1 && (
                  <span
                    className={`mx-3 h-px w-6 ${i < step ? "bg-brand-500" : "bg-ink-200"}`}
                    aria-hidden
                  />
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 rounded-[var(--radius-card)] border border-ink-200 bg-paper-raised p-5 shadow-[var(--shadow-raise)] sm:p-10">
          {/* ------------------------------------------------ step 0: tenant */}
          {step === 0 && (
            <div className="animate-fade-in-up mx-auto max-w-md">
              <h3 className="mb-6 text-lg font-bold text-ink-900 sm:text-xl">
                {t("letter.yourData")}
              </h3>
              <div className="space-y-4">
                {field("mieter-name", t("letter.name"), mieter.name, (v) => setMieter({ ...mieter, name: v }), {
                  required: true,
                  placeholder: "Max Mustermann",
                  autoComplete: "name",
                })}
                {field(
                  "mieter-strasse",
                  t("letter.street"),
                  mieter.strasse,
                  (v) => setMieter({ ...mieter, strasse: v }),
                  { required: true, placeholder: "Musterstraße 10", autoComplete: "street-address" }
                )}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    {field("mieter-plz", t("letter.zip"), mieter.plz, (v) => setMieter({ ...mieter, plz: v }), {
                      required: true,
                      placeholder: "12345",
                      inputMode: "numeric",
                      maxLength: 5,
                      autoComplete: "postal-code",
                    })}
                  </div>
                  <div className="col-span-2">
                    {field("mieter-ort", t("letter.city"), mieter.ort, (v) => setMieter({ ...mieter, ort: v }), {
                      required: true,
                      placeholder: "Berlin",
                      autoComplete: "address-level2",
                    })}
                  </div>
                </div>
                {field(
                  "mieter-wohnung",
                  t("letter.aptNr"),
                  mieter.wohnungNr,
                  (v) => setMieter({ ...mieter, wohnungNr: v }),
                  { placeholder: "z.B. 3. OG links" }
                )}
                {field(
                  "mieter-telefon",
                  t("letter.phone"),
                  mieter.telefon,
                  (v) => setMieter({ ...mieter, telefon: v }),
                  { type: "tel", inputMode: "tel", placeholder: "0176 12345678", autoComplete: "tel" }
                )}
                {field("mieter-email", t("letter.email"), mieter.email, (v) => setMieter({ ...mieter, email: v }), {
                  required: true,
                  type: "email",
                  inputMode: "email",
                  placeholder: "max@beispiel.de",
                  autoComplete: "email",
                })}
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={emailOptIn}
                  onChange={(e) => setEmailOptIn(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-ink-600">{t("letter.emailOptIn")}</span>
              </label>

              <div className="mt-7 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (emailOptIn) {
                      fetch("/api/save-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: mieter.email, name: mieter.name }),
                      }).catch(() => {});
                    }
                    setStep(1);
                  }}
                  data-testid="letter-next"
                  disabled={!mieterValid}
                  className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  {t("check.next")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </button>
              </div>
            </div>
          )}

          {/* ---------------------------------------------- step 1: landlord */}
          {step === 1 && (
            <div className="animate-fade-in-up mx-auto max-w-md">
              <h3 className="mb-6 text-lg font-bold text-ink-900 sm:text-xl">
                {t("letter.landlordData")}
              </h3>
              <div className="space-y-4">
                {field(
                  "vermieter-name",
                  t("letter.landlordName"),
                  vermieter.name,
                  (v) => setVermieter({ ...vermieter, name: v }),
                  { required: true, placeholder: "Hausverwaltung GmbH" }
                )}
                {field(
                  "vermieter-strasse",
                  t("letter.street"),
                  vermieter.strasse,
                  (v) => setVermieter({ ...vermieter, strasse: v }),
                  { required: true, placeholder: "Vermieterstraße 5" }
                )}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    {field(
                      "vermieter-plz",
                      t("letter.zip"),
                      vermieter.plz,
                      (v) => setVermieter({ ...vermieter, plz: v }),
                      { required: true, placeholder: "12345", inputMode: "numeric", maxLength: 5 }
                    )}
                  </div>
                  <div className="col-span-2">
                    {field(
                      "vermieter-ort",
                      t("letter.city"),
                      vermieter.ort,
                      (v) => setVermieter({ ...vermieter, ort: v }),
                      { required: true, placeholder: "Berlin" }
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                {backButton(0)}
                <button
                  type="button"
                  data-testid="letter-next"
                  onClick={() => setStep(2)}
                  disabled={!vermieterValid}
                  className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("check.next")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------- step 2: details */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <h3 className="text-lg font-bold text-ink-900 sm:text-xl">
                {t("letter.describeDefects")}
              </h3>
              <p className="mt-1.5 text-sm text-ink-500">{t("letter.describeHint")}</p>

              {locale !== "de" && (
                <div className="mt-4 flex items-start gap-2.5 rounded-[var(--radius-field)] border border-brand-200 bg-brand-50 p-3.5">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                  <p className="text-sm text-brand-800">{t("letter.nativeHint")}</p>
                </div>
              )}

              <div className="mt-6 space-y-4">
                {selectedMaengel.map((mangel, i) => (
                  <div
                    key={mangel.id}
                    className="rounded-[var(--radius-field)] border border-ink-200 p-4 sm:p-5"
                  >
                    <h4 className="font-semibold text-ink-900">
                      {i + 1}. {mangelLabel(mangel)}
                    </h4>
                    {locale !== "de" && (
                      <p className="mt-0.5 text-xs text-ink-400">{mangel.label}</p>
                    )}
                    <div className="mt-4 space-y-3">
                      {field(
                        `detail-raum-${i}`,
                        t("letter.whichRoom"),
                        mangelDetails[i]?.raum || "",
                        (v) => {
                          const updated = [...mangelDetails];
                          updated[i] = { ...updated[i], raum: v };
                          setMangelDetails(updated);
                        },
                        { placeholder: "z.B. Schlafzimmer, Küche, Badezimmer" }
                      )}
                      {field(
                        `detail-seit-${i}`,
                        t("letter.sincewhen"),
                        mangelDetails[i]?.seit || "",
                        (v) => {
                          const updated = [...mangelDetails];
                          updated[i] = { ...updated[i], seit: v };
                          setMangelDetails(updated);
                        },
                        { placeholder: "z.B. seit dem 15.01.2026" }
                      )}
                      <div>
                        <label
                          htmlFor={`desc-${mangel.id}`}
                          className="mb-1.5 block text-sm font-medium text-ink-700"
                        >
                          {t("letter.detailDesc")}
                        </label>
                        <textarea
                          id={`desc-${mangel.id}`}
                          data-testid={`detail-beschreibung-${i}`}
                          value={mangelDetails[i]?.beschreibung || ""}
                          onChange={(e) => {
                            const updated = [...mangelDetails];
                            updated[i] = { ...updated[i], beschreibung: e.target.value };
                            setMangelDetails(updated);
                          }}
                          placeholder={tc(mangelDescKey(mangel.id), mangel.description)}
                          rows={4}
                          className={`${inputClasses} resize-y`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                {backButton(1)}
                <button
                  type="button"
                  data-testid="letter-preview"
                  onClick={enhanceBeschreibungen}
                  disabled={enhancing}
                  className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
                >
                  {enhancing ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                        aria-hidden
                      />
                      {t("letter.creating")}
                    </>
                  ) : (
                    <>
                      {t("letter.showPreview")}
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* --------------------------------------- step 3: preview + signature */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <h3 className="text-lg font-bold text-ink-900 sm:text-xl">
                {t("letter.previewTitle")}
              </h3>
              <p className="mt-1.5 text-sm text-ink-500">{t("letter.editHint")}</p>

              <label htmlFor="brieftext" className="sr-only">
                {t("letter.previewTitle")}
              </label>
              <textarea
                id="brieftext"
                data-testid="brieftext"
                dir="ltr"
                value={editedBriefText}
                onChange={(e) => setEditedBriefText(e.target.value)}
                className="mt-5 min-h-[24rem] w-full resize-y rounded-[var(--radius-field)] border border-ink-200 bg-paper-raised p-4 text-start font-mono text-[0.8125rem] leading-relaxed text-ink-800 transition-colors focus:border-brand-500 focus:outline-none sm:p-6 sm:text-sm"
                rows={22}
              />

              <div className="mt-6">
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-ink-800">
                  <Pen className="h-4 w-4" aria-hidden />
                  {t("letter.signature")}
                </h4>
                <div className="overflow-hidden rounded-[var(--radius-field)] border border-ink-300 bg-white">
                  <canvas
                    ref={canvasRef}
                    className="signature-canvas h-[150px] w-full touch-none"
                    aria-label={t("letter.signature")}
                  />
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <button
                    type="button"
                    data-testid="signature-clear"
                    onClick={clearSignature}
                    className="inline-flex min-h-[2.75rem] items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-alert-600"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    {t("letter.clearSig")}
                  </button>
                  <button
                    type="button"
                    data-testid="signature-save"
                    onClick={saveSignature}
                    className="inline-flex min-h-[2.75rem] items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-800"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    {t("letter.saveSig")}
                  </button>
                  {signatureData && (
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

              <div className="mt-7 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                {backButton(2)}
                <button
                  type="button"
                  data-testid="letter-delivery"
                  onClick={() => setStep(4)}
                  className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800"
                >
                  {t("letter.deliveryOptions")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </button>
              </div>
            </div>
          )}

          {/* ---------------------------------------------- step 4: delivery */}
          {step === 4 && (
            <div className="animate-fade-in-up">
              <h3 className="text-lg font-bold text-ink-900 sm:text-xl">
                {t("letter.howReceive")}
              </h3>
              <p className="mt-1.5 text-sm text-ink-500">
                {POST_VERSAND_ENABLED ? t("letter.chooseOption") : t("letter.downloadDesc")}
              </p>

              {POST_VERSAND_ENABLED && (
                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    data-testid="delivery-download"
                    onClick={() => setDeliveryMethod("download")}
                    aria-pressed={deliveryMethod === "download"}
                    className={`card-hover rounded-[var(--radius-field)] border p-5 text-start transition-colors ${
                      deliveryMethod === "download"
                        ? "border-brand-500 bg-brand-50"
                        : "border-ink-200 hover:border-brand-300"
                    }`}
                  >
                    <Download className="mb-3 h-7 w-7 text-brand-600" aria-hidden />
                    <h4 className="font-bold text-ink-900">{t("letter.download")}</h4>
                    <p className="mt-1 text-sm text-ink-500">{t("letter.downloadDesc")}</p>
                    <p className="mt-3 text-sm font-bold text-signal-600">{t("letter.free")}</p>
                  </button>

                  <button
                    type="button"
                    data-testid="delivery-post"
                    onClick={() => setDeliveryMethod("post")}
                    aria-pressed={deliveryMethod === "post"}
                    className={`card-hover relative rounded-[var(--radius-field)] border p-5 text-start transition-colors ${
                      deliveryMethod === "post"
                        ? "border-signal-600 bg-signal-50"
                        : "border-ink-200 hover:border-signal-600/40"
                    }`}
                  >
                    <span className="absolute end-4 top-4 rounded-full bg-signal-600 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                      {t("letter.recommended")}
                    </span>
                    <Send className="mb-3 h-7 w-7 text-signal-600" aria-hidden />
                    <h4 className="font-bold text-ink-900">{t("letter.postOption")}</h4>
                    <p className="mt-1 text-sm text-ink-500">{t("letter.postDesc")}</p>
                    <p className="mt-3 text-sm font-bold text-caution-600">
                      {t("letter.from")} 4,99 € {t("letter.inclVat")}
                    </p>
                  </button>
                </div>
              )}

              {deliveryMethod === "download" && (
                <div className="mt-6 rounded-[var(--radius-field)] border border-brand-200 bg-brand-50 p-5">
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
                    <button
                      type="button"
                      data-testid="download-pdf"
                      onClick={handleDownloadPdf}
                      className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800"
                    >
                      <Download className="h-4.5 w-4.5" aria-hidden />
                      {t("letter.downloadPdf")}
                    </button>
                    <button
                      type="button"
                      data-testid="download-txt"
                      onClick={handleDownloadTxt}
                      className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full border border-brand-300 bg-paper-raised px-6 font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                    >
                      <FileText className="h-4.5 w-4.5" aria-hidden />
                      {t("letter.downloadTxt")}
                    </button>
                    <button
                      type="button"
                      data-testid="copy-text"
                      onClick={handleCopy}
                      className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full border border-brand-300 bg-paper-raised px-6 font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                    >
                      <Copy className="h-4.5 w-4.5" aria-hidden />
                      {copied ? t("letter.copied") : t("letter.copyText")}
                    </button>
                  </div>
                </div>
              )}

              {POST_VERSAND_ENABLED && deliveryMethod === "post" && (
                <div className="mt-6 rounded-[var(--radius-field)] border border-signal-600/25 bg-signal-50 p-5">
                  {!postSent ? (
                    <>
                      <div className="mb-4 flex items-start gap-3">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-signal-600" aria-hidden />
                        <div className="text-sm text-signal-700">
                          <strong>{t("letter.postVia")}</strong> {t("letter.postInfo")} (
                          {vermieter.name}, {vermieter.strasse}, {vermieter.plz} {vermieter.ort}).
                          {!signatureData && (
                            <span className="mt-2 flex items-start gap-1.5 text-caution-600">
                              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                              {t("letter.addSignature")}
                            </span>
                          )}
                        </div>
                      </div>
                      {postError && (
                        <p
                          role="alert"
                          className="mb-4 rounded-[var(--radius-field)] border border-alert-600/25 bg-alert-50 p-3 text-sm text-alert-600"
                        >
                          {postError}
                        </p>
                      )}
                      <div className="text-center">
                        <p className="text-2xl font-bold text-ink-900">4,99 €</p>
                        <p className="mt-1 text-sm text-ink-500">
                          {t("letter.inclVat")} · {t("letter.inclShipping")}
                        </p>
                        <button
                          type="button"
                          data-testid="order-post"
                          onClick={handlePostSend}
                          disabled={postSending}
                          className="mt-4 inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full bg-signal-600 px-6 font-semibold text-white transition-colors hover:bg-signal-700 disabled:opacity-60 sm:w-auto"
                        >
                          {postSending ? (
                            <>
                              <span
                                className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent"
                                aria-hidden
                              />
                              {t("letter.postSending")}
                            </>
                          ) : (
                            <>
                              <Send className="h-4.5 w-4.5" aria-hidden />
                              {t("letter.orderWithPayment")}
                            </>
                          )}
                        </button>
                        <p className="mt-3 text-xs text-ink-400">{t("letter.postSecure")}</p>
                        <p className="mt-2 text-xs text-ink-500">
                          {t("letter.orderTermsHint")}{" "}
                          <a href="/nutzungsbedingungen" className="underline hover:text-brand-700">
                            {t("footer.terms")}
                          </a>{" "}
                          ·{" "}
                          <a href="/widerruf" className="underline hover:text-brand-700">
                            {t("footer.withdrawal")}
                          </a>
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-signal-600" aria-hidden />
                      <p className="text-lg font-semibold text-ink-900">{t("letter.postSent")}</p>
                      <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
                        {t("letter.postSentDesc").replace("{name}", vermieter.name)}{" "}
                        {t("letter.postConfirm").replace("{email}", mieter.email || "")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-field)] border border-caution-600/20 bg-caution-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caution-600" aria-hidden />
                <p className="text-sm text-caution-600">
                  <strong>{t("common.note")}:</strong> {t("letter.warning")}
                </p>
              </div>

              <div className="mt-6">{backButton(3, t("letter.backPreview"))}</div>
            </div>
          )}
        </div>

        {/* Calculation reminder — keeps the numbers from the check visible */}
        <p className="mt-5 text-center text-sm text-ink-500">
          {t("letter.basedOn")
            .replace("{quote}", String(minderungsquote))
            .replace("{rent}", bruttowarmmiete.toFixed(0))}
        </p>
      </div>
    </section>
  );
}
