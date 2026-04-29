import type { Config } from "tailwindcss";

// SecFilingDex design tokens — v0 starter.
//
// Identity: a database/index lens over SEC filings. Distinct from holdlens
// (which uses amber for Pro/CTA + emerald/rose for buy/sell signals).
// SecFilingDex's brand color is EDGAR-blue — a nod to the SEC's own data
// system + the "every SEC filing, indexed" positioning. Dark-mode-first,
// data-dense layouts, monospace-leaning typography for filing IDs and CIKs.
//
// These tokens are starting points. Day 1-2 of the build will calibrate
// against @craftsman Love Score (Useful + Delightful + Clear + Unique).
// Operator can layer in semantic tokens (filing-type colors, freshness
// signals, etc.) once the data layer is in place.

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base surface tokens
        bg: "#0b1020",          // dark navy — primary background
        panel: "#121a30",       // elevated panel
        "panel-hi": "#1a2444",  // hover-surface elevation
        border: "#243056",
        "border-bright": "#2f3d6e",
        text: "#e6ebf5",
        muted: "#9aa6c2",
        dim: "#7b88a8",

        // Brand identity — EDGAR-blue
        // RESERVED USE: primary CTAs, active-nav indicator, Pro markers,
        // trust signals (SEC-sourced badge), brand mark. Distinct from
        // holdlens amber so fleet sites are visually differentiated.
        brand: "#3b82f6",       // blue-500
        "brand-soft": "rgba(59, 130, 246, 0.5)",
        "surface-brand": "rgba(59, 130, 246, 0.08)",

        // Semantic signal tokens
        "signal-fresh": "#22c55e",    // green-500 — recent filing (< 7d)
        "signal-stale": "#9aa6c2",    // muted-gray — older filing
        "signal-amend": "#f59e0b",    // amber-500 — amended filing (10-K/A)
        "signal-restate": "#ef4444",  // red-500 — restatement / withdrawn

        // Accent for non-CTA highlights
        accent: "#a78bfa",       // violet-400 — for non-primary highlights
        info: "#38bdf8",         // sky-400 — neutral-notable / informational

        // Tinted surfaces
        "surface-fresh": "rgba(34, 197, 94, 0.08)",
        "surface-amend": "rgba(245, 158, 11, 0.08)",
        "surface-restate": "rgba(239, 68, 68, 0.08)",
        "surface-info": "rgba(56, 189, 248, 0.08)",
        "surface-hover": "rgba(255, 255, 255, 0.05)",
        "surface-hover-strong": "rgba(255, 255, 255, 0.08)",
      },

      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },

      // Typographic scale — vertical rhythm matched to dense data layouts
      fontSize: {
        "display-1": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-2": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "700" }],
        "heading-1": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-2": ["1.375rem", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-3": ["1.125rem", { lineHeight: "1.35", fontWeight: "600" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.6" }],
        "body": ["0.9375rem", { lineHeight: "1.55" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.4" }],
        "eyebrow": ["0.625rem", { lineHeight: "1.4", letterSpacing: "0.12em", fontWeight: "700" }],
        // SecFilingDex-specific: filing identifiers + CIKs benefit from a
        // tabular monospace cell style. `data-cell` is the table-row base
        // size for accession numbers, CIKs, dates, dollar amounts.
        "data-cell": ["0.8125rem", { lineHeight: "1.45", fontWeight: "500" }],
      },

      borderRadius: {
        "chip": "0.375rem",
        "btn": "0.5rem",
        "card": "0.75rem",
        "card-lg": "1rem",
        "pill": "9999px",
      },

      transitionDuration: {
        "fast": "120ms",
        "base": "180ms",
        "slow": "280ms",
      },
      transitionTimingFunction: {
        "swift": "cubic-bezier(0.16, 1, 0.3, 1)",
        "soft": "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      boxShadow: {
        "rim": "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
        "rim-strong": "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
        "brand-glow": "0 0 32px -4px rgba(59, 130, 246, 0.35), 0 0 12px -2px rgba(59, 130, 246, 0.2)",
        "brand-glow-sm": "0 0 16px -4px rgba(59, 130, 246, 0.25)",
        "lift": "0 8px 24px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
        "float": "0 16px 48px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
        "hover-lift": "0 12px 32px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
        "focus-ring": "0 0 0 2px rgba(11, 16, 32, 1), 0 0 0 4px rgba(59, 130, 246, 0.6)",
      },
      ringColor: {
        DEFAULT: "rgba(59, 130, 246, 0.6)",
      },
      ringOffsetColor: {
        DEFAULT: "#0b1020",
      },
    },
  },
  plugins: [],
};
export default config;
