import { ImageResponse } from "next/og";
import { loadFilingsByCik, uniqueCiks } from "@/lib/filings";
import { pickEnrichments } from "@/lib/format";

// Per-filer share card — 1200×630 branded PNG generated at build time.
// Implements `sharecard_per_result_canvas` for filer hub pages.

export const dynamicParams = false;
export const alt = "SEC filer share card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return uniqueCiks().map((cik) => ({ cik }));
}

interface Params {
  cik: string;
}

export default async function FilerOG({ params }: { params: Promise<Params> }) {
  const { cik } = await params;
  const filings = loadFilingsByCik(cik);

  if (filings.length === 0) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0b1020",
            color: "#e6ebf5",
            fontSize: 64,
            fontFamily: "sans-serif",
          }}
        >
          SecFilingDex
        </div>
      ),
      size
    );
  }

  const { filerName, ticker } = pickEnrichments(filings[0]);
  const formTypes = [...new Set(filings.map((f) => f.formType))].sort();
  const truncatedFiler = filerName.length > 40 ? filerName.slice(0, 37) + "…" : filerName;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0b1020 0%, #1a2444 100%)",
          color: "#e6ebf5",
          fontFamily: "sans-serif",
          padding: "60px 72px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: "#3b82f6",
              }}
            />
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.4 }}>
              SecFilingDex
            </span>
          </div>
          <span style={{ fontSize: 18, color: "#9aa6c2", marginLeft: 26 }}>
            Filer hub · indexed across every form
          </span>
        </div>

        {/* Center — filer name + ticker + counts */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: 22,
          }}
        >
          {ticker && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 36,
                fontWeight: 700,
                color: "#3b82f6",
                background: "rgba(59, 130, 246, 0.10)",
                border: "2px solid #3b82f6",
                padding: "8px 20px",
                borderRadius: 12,
                alignSelf: "flex-start",
              }}
            >
              {ticker}
            </span>
          )}
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.0,
              color: "#e6ebf5",
            }}
          >
            {truncatedFiler}
          </span>
          <span style={{ fontSize: 26, color: "#9aa6c2" }}>
            <span style={{ color: "#e6ebf5", fontWeight: 600 }}>{filings.length}</span>{" "}
            filings indexed across{" "}
            <span style={{ color: "#e6ebf5", fontWeight: 600 }}>{formTypes.length}</span>{" "}
            {formTypes.length === 1 ? "form type" : "form types"}
          </span>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid #243056",
          }}
        >
          <span style={{ fontFamily: "monospace", fontSize: 18, color: "#7b88a8" }}>
            CIK {cik}
          </span>
          <span style={{ fontSize: 18, color: "#3b82f6", fontWeight: 600 }}>
            secfilingdex.com
          </span>
        </div>
      </div>
    ),
    size
  );
}
