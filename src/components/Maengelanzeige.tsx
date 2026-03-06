"use client";

import { useState, useRef, useEffect } from "react";
import {
  FileText,
  ArrowRight,
  ArrowLeft,
  Download,
  Mail,
  Send,
  CheckCircle,
  Pen,
  Trash2,
  AlertTriangle,
  Copy,
  Info,
} from "lucide-react";
import SignaturePad from "signature_pad";
import type { Mangel } from "@/data/maengel";
import {
  generatePdf,
  generatePdfBase64,
  type BriefData,
} from "@/lib/generatePdf";
import { useTranslation } from "@/i18n/LanguageContext";

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

export default function Maengelanzeige({
  selectedMaengel,
  bruttowarmmiete,
  minderungsquote,
}: MaengelanzeigeProps) {
  const [step, setStep] = useState(0); // 0=mieter, 1=vermieter, 2=details, 3=preview, 4=delivery
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
  const [signatureData, setSignatureData] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<"download" | "email" | "post" | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [postSending, setPostSending] = useState(false);
  const [postSent, setPostSent] = useState(false);
  const [postError, setPostError] = useState("");
  const [enhancing, setEnhancing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const { t, locale } = useTranslation();

  useEffect(() => {
    if (step === 3 && canvasRef.current && !signaturePadRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(0, 0, 0)",
      });
    }
  }, [step]);

  const clearSignature = () => {
    signaturePadRef.current?.clear();
    setSignatureData("");
  };

  const saveSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      setSignatureData(signaturePadRef.current.toDataURL());
    }
  };

  const fristDatum = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const heuteDatum = () => {
    return new Date().toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const aktuellerMonat = () => {
    return new Date().toLocaleDateString("de-DE", {
      month: "long",
      year: "numeric",
    });
  };

  const generateBriefText = () => {
    const mangelTexte = selectedMaengel
      .map((m, i) => {
        const details = mangelDetails[i];
        let text = `${i + 1}. ${m.label}`;
        if (details?.raum) text += ` (Raum: ${details.raum})`;
        if (details?.seit) text += ` — besteht seit ${details.seit}`;
        if (details?.beschreibung)
          text += `\n   ${details.beschreibung}`;
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

Betreff: Mängelanzeige — Wohnung ${mieter.strasse}, ${mieter.plz} ${mieter.ort}${mieter.wohnungNr ? `, Wohnung ${mieter.wohnungNr}` : ""}

Sehr geehrte/r ${vermieter.name},

hiermit zeige ich Ihnen an, dass sich in der von mir angemieteten Wohnung folgende Mängel befinden:

${mangelTexte}

Ich fordere Sie auf, die oben genannten Mängel umgehend, jedoch bis spätestens zum ${fristDatum()} zu beseitigen.

Das mir zustehende Mietminderungsrecht gemäß § 536 Abs. 1 BGB behalte ich mir vor. Rein vorsorglich erkläre ich, dass die bereits gezahlte Miete für den Monat ${aktuellerMonat()} sowie künftige Mietzahlungen unter dem Vorbehalt der Rückforderung geleistet werden.

Sollten die Mängel nicht fristgerecht beseitigt werden, behalte ich mir weitere rechtliche Schritte vor, insbesondere Schadensersatz gemäß § 536a BGB sowie die Durchführung einer Ersatzvornahme gemäß § 536a Abs. 2 BGB.

Termine zur Mängelbeseitigung können Sie gerne mit mir telefonisch vereinbaren. Sie erreichen mich tagsüber unter der Rufnummer ${mieter.telefon || "[Telefonnummer]"}.

Mit freundlichen Grüßen

${mieter.name}`;
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
      if (data.beschreibungen && Array.isArray(data.beschreibungen) && data.beschreibungen.length === mangelDetails.length) {
        const updated = mangelDetails.map((d, i) => ({
          ...d,
          beschreibung: data.beschreibungen[i] || d.beschreibung,
        }));
        setMangelDetails(updated);
      }
    } catch {
      // Silently fall back to original descriptions
    } finally {
      setEnhancing(false);
      setStep(3);
    }
  };

  const getBriefData = (): BriefData => ({
    mieterName: mieter.name,
    mieterStrasse: mieter.strasse,
    mieterPlz: mieter.plz,
    mieterOrt: mieter.ort,
    mieterTelefon: mieter.telefon,
    mieterEmail: mieter.email,
    mieterWohnungNr: mieter.wohnungNr,
    vermieterName: vermieter.name,
    vermieterStrasse: vermieter.strasse,
    vermieterPlz: vermieter.plz,
    vermieterOrt: vermieter.ort,
    maengel: selectedMaengel.map((m, i) => ({
      label: m.label,
      raum: mangelDetails[i]?.raum || "",
      seit: mangelDetails[i]?.seit || "",
      beschreibung: mangelDetails[i]?.beschreibung || "",
    })),
    signatureDataUrl: signatureData || undefined,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(generateBriefText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    const doc = generatePdf(getBriefData());
    doc.save(
      `Maengelanzeige_${mieter.name.replace(/\s+/g, "_")}_${heuteDatum().replace(/\./g, "-")}.pdf`
    );
  };

  const handleDownloadTxt = () => {
    const text = generateBriefText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Maengelanzeige_${mieter.name.replace(/\s+/g, "_")}_${heuteDatum().replace(/\./g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmailSend = async () => {
    if (!mieter.email) return;
    setEmailSending(true);
    setEmailError("");
    try {
      const pdfBase64 = generatePdfBase64(getBriefData());
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: mieter.email,
          mieterName: mieter.name,
          briefText: generateBriefText(),
          pdfBase64,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailError(data.error || "E-Mail konnte nicht gesendet werden.");
      } else {
        setEmailSent(true);
      }
    } catch {
      setEmailError("Netzwerkfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setEmailSending(false);
    }
  };

  const handlePostSend = async () => {
    setPostSending(true);
    setPostError("");
    try {
      const pdfBase64 = generatePdfBase64(getBriefData());
      const res = await fetch("/api/send-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfBase64,
          notificationEmail: mieter.email || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPostError(data.error || "Brief konnte nicht versendet werden.");
      } else {
        setPostSent(true);
      }
    } catch {
      setPostError("Netzwerkfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setPostSending(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400";

  const stepLabels = [
    t("letter.step.data"),
    t("letter.step.landlord"),
    t("letter.step.defects"),
    t("letter.step.preview"),
    t("letter.step.send"),
  ];

  return (
    <section id="maengelanzeige" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t("letter.title")}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t("letter.subtitle")}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {stepLabels.map(
            (label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= step
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < step ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`hidden sm:inline text-xs font-medium ${
                    i <= step ? "text-blue-700" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                {i < 4 && (
                  <div
                    className={`w-6 sm:w-10 h-0.5 ${
                      i < step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            )
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12">
          {/* Step 0: Mieter data */}
          {step === 0 && (
            <div className="animate-fade-in-up max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t("letter.yourData")}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("letter.name")} *
                  </label>
                  <input
                    type="text"
                    value={mieter.name}
                    onChange={(e) =>
                      setMieter({ ...mieter, name: e.target.value })
                    }
                    placeholder="Max Mustermann"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("letter.street")} *
                  </label>
                  <input
                    type="text"
                    value={mieter.strasse}
                    onChange={(e) =>
                      setMieter({ ...mieter, strasse: e.target.value })
                    }
                    placeholder="Musterstraße 10"
                    className={inputClasses}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("letter.zip")} *
                    </label>
                    <input
                      type="text"
                      value={mieter.plz}
                      onChange={(e) =>
                        setMieter({ ...mieter, plz: e.target.value })
                      }
                      placeholder="12345"
                      maxLength={5}
                      className={inputClasses}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("letter.city")} *
                    </label>
                    <input
                      type="text"
                      value={mieter.ort}
                      onChange={(e) =>
                        setMieter({ ...mieter, ort: e.target.value })
                      }
                      placeholder="Berlin"
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("letter.aptNr")}
                  </label>
                  <input
                    type="text"
                    value={mieter.wohnungNr}
                    onChange={(e) =>
                      setMieter({ ...mieter, wohnungNr: e.target.value })
                    }
                    placeholder="z.B. 3. OG links"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("letter.phone")}
                  </label>
                  <input
                    type="tel"
                    value={mieter.telefon}
                    onChange={(e) =>
                      setMieter({ ...mieter, telefon: e.target.value })
                    }
                    placeholder="0176 12345678"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("letter.email")}
                  </label>
                  <input
                    type="email"
                    value={mieter.email}
                    onChange={(e) =>
                      setMieter({ ...mieter, email: e.target.value })
                    }
                    placeholder="max@beispiel.de"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  disabled={!mieter.name || !mieter.strasse || !mieter.plz || !mieter.ort}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("check.next")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Vermieter data */}
          {step === 1 && (
            <div className="animate-fade-in-up max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t("letter.landlordData")}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("letter.landlordName")} *
                  </label>
                  <input
                    type="text"
                    value={vermieter.name}
                    onChange={(e) =>
                      setVermieter({ ...vermieter, name: e.target.value })
                    }
                    placeholder="Frau/Herr Vermieter oder Hausverwaltung GmbH"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("letter.street")} *
                  </label>
                  <input
                    type="text"
                    value={vermieter.strasse}
                    onChange={(e) =>
                      setVermieter({ ...vermieter, strasse: e.target.value })
                    }
                    placeholder="Vermieterstraße 5"
                    className={inputClasses}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("letter.zip")} *
                    </label>
                    <input
                      type="text"
                      value={vermieter.plz}
                      onChange={(e) =>
                        setVermieter({ ...vermieter, plz: e.target.value })
                      }
                      placeholder="12345"
                      maxLength={5}
                      className={inputClasses}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("letter.city")} *
                    </label>
                    <input
                      type="text"
                      value={vermieter.ort}
                      onChange={(e) =>
                        setVermieter({ ...vermieter, ort: e.target.value })
                      }
                      placeholder="Berlin"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(0)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("check.back")}
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={
                    !vermieter.name ||
                    !vermieter.strasse ||
                    !vermieter.plz ||
                    !vermieter.ort
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("check.next")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Mangel details */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t("letter.describeDefects")}
              </h3>
              <p className="text-gray-500 mb-2">
                {t("letter.describeHint")}
              </p>
              {locale !== "de" && (
                <div className="mb-6 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-blue-800">
                    {t("letter.nativeHint")}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {selectedMaengel.map((mangel, i) => (
                  <div
                    key={mangel.id}
                    className="p-6 border-2 border-gray-200 rounded-xl"
                  >
                    <h4 className="font-semibold text-gray-800 mb-4">
                      {i + 1}. {mangel.label}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("letter.whichRoom")}
                        </label>
                        <input
                          type="text"
                          value={mangelDetails[i]?.raum || ""}
                          onChange={(e) => {
                            const updated = [...mangelDetails];
                            updated[i] = {
                              ...updated[i],
                              raum: e.target.value,
                            };
                            setMangelDetails(updated);
                          }}
                          placeholder="z.B. Schlafzimmer, Küche, Badezimmer"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("letter.sincewhen")}
                        </label>
                        <input
                          type="text"
                          value={mangelDetails[i]?.seit || ""}
                          onChange={(e) => {
                            const updated = [...mangelDetails];
                            updated[i] = {
                              ...updated[i],
                              seit: e.target.value,
                            };
                            setMangelDetails(updated);
                          }}
                          placeholder="z.B. seit dem 15.01.2026"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("letter.detailDesc")}
                        </label>
                        <textarea
                          value={mangelDetails[i]?.beschreibung || ""}
                          onChange={(e) => {
                            const updated = [...mangelDetails];
                            updated[i] = {
                              ...updated[i],
                              beschreibung: e.target.value,
                            };
                            setMangelDetails(updated);
                          }}
                          placeholder={`${mangel.description}`}
                          rows={4}
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("check.back")}
                </button>
                <button
                  onClick={enhanceBeschreibungen}
                  disabled={enhancing}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-60"
                >
                  {enhancing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t("letter.creating")}
                    </>
                  ) : (
                    <>
                      {t("letter.showPreview")}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preview & Signature */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t("letter.previewTitle")}
              </h3>

              {/* Letter preview */}
              <div className="bg-gray-50 rounded-xl p-6 sm:p-8 mb-6 border border-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                {generateBriefText()}
              </div>

              {/* Signature */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Pen className="w-4 h-4" />
                  {t("letter.signature")}
                </h4>
                <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="signature-canvas w-full h-[150px]"
                  />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={clearSignature}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t("letter.clearSig")}
                  </button>
                  <button
                    onClick={saveSignature}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {t("letter.saveSig")}
                  </button>
                  {signatureData && (
                    <span className="text-sm text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {t("letter.sigSaved")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("check.back")}
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors"
                >
                  {t("letter.deliveryOptions")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Delivery options */}
          {step === 4 && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t("letter.howReceive")}
              </h3>
              <p className="text-gray-500 mb-8">
                {t("letter.chooseOption")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Download */}
                <button
                  onClick={() => setDeliveryMethod("download")}
                  className={`card-hover p-6 rounded-xl border-2 text-left transition-all ${
                    deliveryMethod === "download"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <Download className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-1">
                    {t("letter.download")}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t("letter.downloadDesc")}
                  </p>
                  <div className="mt-3 text-sm font-bold text-emerald-600">
                    {t("letter.free")}
                  </div>
                </button>

                {/* Email */}
                <button
                  onClick={() => setDeliveryMethod("email")}
                  className={`card-hover p-6 rounded-xl border-2 text-left transition-all ${
                    deliveryMethod === "email"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <Mail className="w-8 h-8 text-violet-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-1">
                    {t("letter.emailOption")}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t("letter.emailDesc")}
                  </p>
                  <div className="mt-3 text-sm font-bold text-emerald-600">
                    {t("letter.free")}
                  </div>
                </button>

                {/* Post */}
                <button
                  onClick={() => setDeliveryMethod("post")}
                  className={`card-hover p-6 rounded-xl border-2 text-left transition-all relative ${
                    deliveryMethod === "post"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full">
                    {t("letter.recommended")}
                  </div>
                  <Send className="w-8 h-8 text-emerald-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-1">
                    {t("letter.postOption")}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t("letter.postDesc")}
                  </p>
                  <div className="mt-3 text-sm font-bold text-amber-600">
                    {t("letter.from")} 4,99 €
                  </div>
                </button>
              </div>

              {/* Delivery action area */}
              {deliveryMethod === "download" && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={handleDownloadPdf}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      {t("letter.downloadPdf")}
                    </button>
                    <button
                      onClick={handleDownloadTxt}
                      className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-300 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      {t("letter.downloadTxt")}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-300 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                      {copied ? t("letter.copied") : t("letter.copyText")}
                    </button>
                  </div>
                </div>
              )}

              {deliveryMethod === "email" && (
                <div className="bg-violet-50 rounded-xl p-6 border border-violet-200">
                  {!emailSent ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        {t("letter.emailSendTo")} <strong>{mieter.email || t("letter.email")}</strong> {t("letter.emailSent")}
                      </p>
                      {!mieter.email && (
                        <div className="max-w-sm mx-auto mb-4">
                          <input
                            type="email"
                            value={mieter.email}
                            onChange={(e) =>
                              setMieter({ ...mieter, email: e.target.value })
                            }
                            placeholder="ihre@email.de"
                            className={inputClasses}
                          />
                        </div>
                      )}
                      {emailError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                          {emailError}
                        </div>
                      )}
                      <button
                        onClick={handleEmailSend}
                        disabled={!mieter.email || emailSending}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-40"
                      >
                        {emailSending ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {t("letter.sending")}
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5" />
                            {t("letter.sendEmail")}
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                      <p className="font-semibold text-gray-900">
                        {t("letter.emailSentSuccess").replace("{email}", mieter.email)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {t("letter.checkSpam")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {deliveryMethod === "post" && (
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  {!postSent ? (
                    <>
                      <div className="flex items-start gap-3 mb-4">
                        <Info className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                        <div className="text-sm text-emerald-800">
                          <strong>{t("letter.postVia")}</strong> {t("letter.postInfo")} ({vermieter.name}, {vermieter.strasse}, {vermieter.plz} {vermieter.ort}).
                          {!signatureData && (
                            <span className="block mt-2 text-amber-700">
                              <AlertTriangle className="w-4 h-4 inline mr-1" />
                              {t("letter.addSignature")}
                            </span>
                          )}
                        </div>
                      </div>
                      {postError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                          {postError}
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          4,99 €
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          {t("letter.inclShipping")}
                        </div>
                        <button
                          onClick={handlePostSend}
                          disabled={postSending}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
                        >
                          {postSending ? (
                            <>
                              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              {t("letter.postSending")}
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              {t("letter.sendPost")}
                            </>
                          )}
                        </button>
                        <p className="text-xs text-gray-400 mt-3">
                          {t("letter.postSecure")}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                      <p className="font-semibold text-gray-900 text-lg">
                        {t("letter.postSent")}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                        {t("letter.postSentDesc").replace("{name}", vermieter.name)}{" "}
                        {t("letter.postConfirm").replace("{email}", mieter.email || "")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Warning */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-amber-800">
                    <strong>Hinweis:</strong> {t("letter.warning")}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("letter.backPreview")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
