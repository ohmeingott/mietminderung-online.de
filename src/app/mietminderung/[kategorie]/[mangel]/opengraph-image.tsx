import { ImageResponse } from "next/og";
import { BRAND_MARK_ON_DARK, brandMarkDataUri } from "@/lib/brandMark";
import { getMangelBySlug } from "@/lib/mangelIndex";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Mietminderung: anerkannte Minderungsquote für diesen Wohnungsmangel";

// Route params are inherited from the page segment's generateStaticParams(),
// so one image is prerendered per defect page.

type Params = { kategorie: string; mangel: string };

/** Per-defect social card - the quota is the hook that earns the click. */
export default async function MangelOgImage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { kategorie, mangel } = await params;
  const entry = getMangelBySlug(kategorie, mangel);

  const label = entry?.mangel.label ?? "Wohnungsmängeln";
  const min = entry?.mangel.minderung_min ?? 0;
  const max = entry?.mangel.minderung_max ?? 0;
  const kategorieLabel = entry?.kategorie.label ?? "Wohnungsmängel";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #1e3a8a 100%)",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Inlined as a data URI: satori cannot resolve a relative URL. */}
          <img
            src={brandMarkDataUri(BRAND_MARK_ON_DARK)}
            width={52}
            height={52}
            alt=""
          />
          <span style={{ fontSize: "27px", fontWeight: 700, color: "white" }}>
            Mietminderung-online
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "14px",
            }}
          >
            {kategorieLabel}
          </span>
          <span
            style={{
              fontSize: label.length > 34 ? "54px" : "66px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.15,
              maxWidth: "1020px",
            }}
          >
            Mietminderung bei {label}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              background: "white",
              borderRadius: "16px",
              padding: "16px 28px",
            }}
          >
            <span style={{ fontSize: "46px", fontWeight: 800, color: "#1e40af" }}>
              {min}–{max}&nbsp;%
            </span>
            <span style={{ fontSize: "21px", color: "#475569" }}>
              der Bruttowarmmiete
            </span>
          </div>
          <span style={{ fontSize: "21px", color: "rgba(255,255,255,0.8)" }}>
            Kostenlos prüfen · Mängelanzeige erstellen
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
