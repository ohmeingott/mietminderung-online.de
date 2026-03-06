import jsPDF from "jspdf";

export interface BriefData {
  mieterName: string;
  mieterStrasse: string;
  mieterPlz: string;
  mieterOrt: string;
  mieterTelefon: string;
  mieterEmail: string;
  mieterWohnungNr: string;
  vermieterName: string;
  vermieterStrasse: string;
  vermieterPlz: string;
  vermieterOrt: string;
  maengel: {
    label: string;
    raum: string;
    seit: string;
    beschreibung: string;
  }[];
  signatureDataUrl?: string;
}

function fristDatum(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function heuteDatum(): string {
  return new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function aktuellerMonat(): string {
  return new Date().toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
}

export function generatePdf(data: BriefData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const marginLeft = 25;
  const marginRight = 25;
  const pageWidth = 210;
  const maxWidth = pageWidth - marginLeft - marginRight;
  let y = 30;

  const lineHeight = 5.5;

  const addText = (text: string, opts?: { bold?: boolean; size?: number }) => {
    const size = opts?.size ?? 10;
    doc.setFontSize(size);
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");

    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }
      doc.text(line, marginLeft, y);
      y += lineHeight;
    }
  };

  const addBlankLine = (n = 1) => {
    y += lineHeight * n;
  };

  // --- Absender ---
  addText(data.mieterName);
  addText(data.mieterStrasse);
  addText(`${data.mieterPlz} ${data.mieterOrt}`);
  addBlankLine(2);

  // --- Empfänger ---
  addText(data.vermieterName);
  addText(data.vermieterStrasse);
  addText(`${data.vermieterPlz} ${data.vermieterOrt}`);
  addBlankLine(2);

  // --- Datum ---
  addText(`${data.mieterOrt}, den ${heuteDatum()}`);
  addBlankLine(2);

  // --- Betreff ---
  const betreff = `Betreff: Mängelanzeige — Wohnung ${data.mieterStrasse}, ${data.mieterPlz} ${data.mieterOrt}${data.mieterWohnungNr ? `, Wohnung ${data.mieterWohnungNr}` : ""}`;
  addText(betreff, { bold: true });
  addBlankLine();

  // --- Anrede ---
  addText(`Sehr geehrte/r ${data.vermieterName},`);
  addBlankLine();

  // --- Einleitung ---
  addText(
    "hiermit zeige ich Ihnen an, dass sich in der von mir angemieteten Wohnung folgende Mängel befinden:"
  );
  addBlankLine();

  // --- Mängel ---
  data.maengel.forEach((m, i) => {
    let mangelText = `${i + 1}. ${m.label}`;
    if (m.raum) mangelText += ` (Raum: ${m.raum})`;
    if (m.seit) mangelText += ` — besteht seit ${m.seit}`;
    addText(mangelText, { bold: true });
    if (m.beschreibung) {
      addText(m.beschreibung);
    }
    addBlankLine(0.5);
  });

  addBlankLine();

  // --- Fristsetzung ---
  addText(
    `Ich fordere Sie auf, die oben genannten Mängel umgehend, jedoch bis spätestens zum ${fristDatum()} zu beseitigen.`
  );
  addBlankLine();

  // --- Minderungsvorbehalt ---
  addText(
    `Das mir zustehende Mietminderungsrecht gemäß § 536 Abs. 1 BGB behalte ich mir vor. Rein vorsorglich erkläre ich, dass die bereits gezahlte Miete für den Monat ${aktuellerMonat()} sowie künftige Mietzahlungen unter dem Vorbehalt der Rückforderung geleistet werden.`
  );
  addBlankLine();

  // --- Weitere Schritte ---
  addText(
    "Sollten die Mängel nicht fristgerecht beseitigt werden, behalte ich mir weitere rechtliche Schritte vor, insbesondere Schadensersatz gemäß § 536a BGB sowie die Durchführung einer Ersatzvornahme gemäß § 536a Abs. 2 BGB."
  );
  addBlankLine();

  // --- Terminvereinbarung ---
  addText(
    `Termine zur Mängelbeseitigung können Sie gerne mit mir telefonisch vereinbaren. Sie erreichen mich tagsüber unter der Rufnummer ${data.mieterTelefon || "[Telefonnummer]"}.`
  );
  addBlankLine(2);

  // --- Grußformel ---
  addText("Mit freundlichen Grüßen");
  addBlankLine(2);

  // --- Unterschrift ---
  if (data.signatureDataUrl) {
    if (y > 245) {
      doc.addPage();
      y = 25;
    }
    doc.addImage(data.signatureDataUrl, "PNG", marginLeft, y, 50, 20);
    y += 22;
  }

  addText(data.mieterName);

  return doc;
}

export function generatePdfBase64(data: BriefData): string {
  const doc = generatePdf(data);
  // Returns base64 string without the data URI prefix
  return doc.output("datauristring").split(",")[1];
}

export function generatePdfBlob(data: BriefData): Blob {
  const doc = generatePdf(data);
  return doc.output("blob");
}

export function generatePdfArrayBuffer(data: BriefData): ArrayBuffer {
  const doc = generatePdf(data);
  return doc.output("arraybuffer");
}
