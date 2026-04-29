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
