import { ImageResponse } from "next/og";
import {
  loadFilingByAccession,
  loadAllFilings,
} from "@/lib/filings";
import { formatDateShort, pickEnrichments } from "@/lib/format";

// Per-filing share card — 1200×630 branded PNG generated at build time.
// Implements the `sharecard_per_result_canvas` archetype (×+95) per
// `~/.claude/rules/aceusergrowth.md` v3 Part 12 (Advocacy V-F1) +
// `~/.claude/rules/bot-harvest.md` Pattern 3 (LLM-citation extractability).

export const dynamicParams = false;
export const alt = "SEC filing share card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return loadAllFilings().map((f) => ({ accession: f.accessionNumber }));
}

interface Params {
  accession: string;
}

export default async function FilingOG({ params }: { params: Promise<Params> }) {
  const { accession } = await params;
  const record = loadFilingByAccession(accession);

  // Fallback (defensive — generateStaticParams should preclude this branch)
  if (!record) {
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

  const { filerName, info, ticker } = pickEnrichments(record);
  const formLabel = info?.shortName ?? record.formType;
  const filedShort = formatDateShort(record.filedAt);
  const truncatedFiler = filerName.length > 56 ? filerName.slice(0, 53) + "…" : filerName;

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
          position: "relative",
        }}
      >
        {/* Top header — wordmark + tagline */}
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
            Every SEC filing, indexed.
          </span>
        </div>

        {/* Center — form-type chip + filer + filed */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 44,
                fontWeight: 700,
                color: "#3b82f6",
                background: "rgba(59, 130, 246, 0.10)",
                border: "2px solid #3b82f6",
                padding: "10px 22px",
                borderRadius: 12,
              }}
            >
              {record.formType}
            </span>
            {ticker && (
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 28,
                  color: "#e6ebf5",
                  background: "#1a2444",
                  border: "1px solid #2f3d6e",
                  padding: "8px 18px",
                  borderRadius: 10,
                }}
              >
                {ticker}
              </span>
            )}
            <span style={{ fontSize: 22, color: "#9aa6c2" }}>{formLabel}</span>
          </div>
          <span
            style={{
              fontSize: 60,
              fontWeight: 700,
              letterSpacing: -1.2,
              lineHeight: 1.05,
              color: "#e6ebf5",
            }}
          >
            {truncatedFiler}
          </span>
          <span style={{ fontSize: 26, color: "#9aa6c2" }}>
            Filed{" "}
            <span style={{ color: "#e6ebf5", fontWeight: 600 }}>{filedShort}</span>
          </span>
        </div>

        {/* Bottom — accession + EDGAR badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid #243056",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 18,
              color: "#7b88a8",
            }}
          >
            Accession {record.accessionNumber}
          </span>
          <span
            style={{
              fontSize: 18,
              color: "#3b82f6",
              fontWeight: 600,
            }}
          >
            Sourced from SEC EDGAR ↗
          </span>
        </div>
      </div>
    ),
    size
  );
}
