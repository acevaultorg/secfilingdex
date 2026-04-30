import { ImageResponse } from "next/og";

// Apple touch icon — 180×180. Next.js convention: auto-rendered at build time.
// Same visual language as app/icon.svg (favicon) for consistent identity across
// home-screen / browser-tab / OG / share contexts.

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 32,
        }}
      >
        {/* Stylized filing — same as icon.svg, scaled */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#121a30",
            border: "5px solid #3b82f6",
            borderRadius: 14,
            padding: "24px 22px",
            width: 100,
            height: 110,
            position: "relative",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          {/* Corner fold accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 26,
              height: 26,
              borderLeft: "5px solid #3b82f6",
              borderBottom: "5px solid #3b82f6",
              borderTopRightRadius: 9,
              background: "#0b1020",
            }}
          />
          {/* Index rows */}
          <div style={{ width: 60, height: 9, background: "#3b82f6", borderRadius: 3 }} />
          <div style={{ width: 70, height: 6, background: "#9aa6c2", borderRadius: 2, opacity: 0.7 }} />
          <div style={{ width: 50, height: 6, background: "#9aa6c2", borderRadius: 2, opacity: 0.5 }} />
        </div>
      </div>
    ),
    size
  );
}
