import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mietminderung Online — Prüfen Sie Ihr Recht auf Mietminderung";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #1e3a8a 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
            }}
          >
            🛡️
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "white",
            }}
          >
            Mietminderung.online
          </span>
        </div>
        <h1
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            margin: 0,
            maxWidth: "900px",
          }}
        >
          Wohnung hat Mängel? Weniger Miete zahlen ist Ihr Recht.
        </h1>
        <p
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            marginTop: "24px",
            maxWidth: "700px",
          }}
        >
          Kostenlos prüfen · Mängelanzeige erstellen · Brief versenden
        </p>
      </div>
    ),
    { ...size }
  );
}
