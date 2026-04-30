import { ImageResponse } from "next/og";
import {
  loadFilingsByFormType,
  uniqueFormTypes,
} from "@/lib/filings";
import { formTypeInfo } from "@/lib/format";
import { formTypeToSlug, slugToFormType } from "@/lib/types";

// Per-form-type share card — 1200×630 branded PNG generated at build time.

export const dynamicParams = false;
export const alt = "SEC form-type share card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return uniqueFormTypes().map((ft) => ({
    formType: formTypeToSlug(ft),
  }));
}

interface Params {
  formType: string;
}

export default async function FormOG({ params }: { params: Promise<Params> }) {
  const { formType: slug } = await params;
  const formType = slugToFormType(slug);
  const filings = loadFilingsByFormType(formType);
  const info = formTypeInfo(formType);

  const cadence = info?.cadence ?? "—";
  const shortName = info?.shortName ?? formType;
  const audience = info?.audience ?? "—";

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
            Form-type hub · every recent {formType} filing
          </span>
        </div>

        {/* Center — form-type chip + shortName */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: 24,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 120,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1.0,
              color: "#3b82f6",
            }}
          >
            {formType}
          </span>
          <span
            style={{
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: -0.8,
              color: "#e6ebf5",
            }}
          >
            {shortName}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
            <span
              style={{
                fontSize: 20,
                color: "#9aa6c2",
                background: "#1a2444",
                border: "1px solid #2f3d6e",
                padding: "6px 14px",
                borderRadius: 8,
              }}
            >
              Cadence: {cadence}
            </span>
            <span
              style={{
                fontSize: 20,
                color: "#9aa6c2",
                background: "#1a2444",
                border: "1px solid #2f3d6e",
                padding: "6px 14px",
                borderRadius: 8,
              }}
            >
              Audience: {audience}
            </span>
            <span
              style={{
                fontSize: 20,
                color: "#9aa6c2",
                background: "#1a2444",
                border: "1px solid #2f3d6e",
                padding: "6px 14px",
                borderRadius: 8,
              }}
            >
              {filings.length}{" "}
              {filings.length === 1 ? "filing indexed" : "filings indexed"}
            </span>
          </div>
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
          <span style={{ fontSize: 18, color: "#7b88a8" }}>
            Sourced from SEC EDGAR · public domain (17 U.S.C. § 105)
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
