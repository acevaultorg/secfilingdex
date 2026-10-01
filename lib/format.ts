// lib/format.ts — display helpers for filing records
//
// EDGAR's search-index API embeds ticker + CIK suffix into display_names like
// "SYSCO CORP  (SYY)  (CIK 0000096021)". This module extracts the clean filer
// name + ticker for citation-grade rendering.

import type { FilingRecord, FormType } from "./types";
import { FORM_TYPE_CATALOG } from "./types";

const TICKER_RE = /\(([A-Z][A-Z0-9.\-]{0,8})\)/;
const CIK_SUFFIX_RE = /\s*\(CIK\s+\d+\)\s*$/i;

export function cleanFilerName(raw: string): string {
  return raw
    .replace(CIK_SUFFIX_RE, "")
    .replace(TICKER_RE, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function extractTicker(raw: string, fallback?: string): string | undefined {
  if (fallback) return fallback;
  const match = raw.match(TICKER_RE);
  return match?.[1];
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}

/**
 * A date-only value such as periodOfReport ("2026-06-30") as "June 30, 2026".
 * Read in UTC so the day never shifts with the build machine's time zone.
 */
export function formatDay(isoDate: string): string {
  const d = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Compact form of formatDay for list rows: "Jun 30, 2026". */
export function formatDayCompact(isoDate: string): string {
  const d = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Direct EDGAR URL of the filing's main document. EDGAR keeps every file of a
 * filing in the same archive folder as its index page, so the URL is that
 * folder plus the primaryDocument name EDGAR reported. Null when unknown.
 */
export function edgarPrimaryDocUrl(record: FilingRecord): string | null {
  if (!record.primaryDocument) return null;
  if (!/\/[^/]+-index\.html?$/.test(record.edgarFilingUrl)) return null;
  return record.edgarFilingUrl.replace(/[^/]+$/, "") + record.primaryDocument;
}

export function formTypeInfo(formType: FormType | string) {
  // Try exact match first; fall back to base form (strip /A amendment suffix).
  let info = FORM_TYPE_CATALOG.find((f) => f.code === formType);
  if (!info && formType.endsWith("/A")) {
    const base = formType.slice(0, -2);
    info = FORM_TYPE_CATALOG.find((f) => f.code === base);
  }
  return info;
}

export function pickEnrichments(record: FilingRecord) {
  const filerName = cleanFilerName(record.filerName);
  const ticker = extractTicker(record.filerName, record.ticker);
  const info = formTypeInfo(record.formType);
  const cikInt = parseInt(record.cik, 10);
  return { filerName, ticker, info, cikInt };
}

export function bytes(n?: number): string {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
