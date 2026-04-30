// lib/filings.ts — read + index data/filings/*.json at build time
//
// `output: 'export'` means all data access happens during the build, never at
// runtime. This module is the single source of truth for loading the filing
// dataset. Used by:
//   - app/filing/[accession]/page.tsx generateStaticParams + render
//   - app/filer/[cik]/page.tsx (Day 3+ extension)
//   - app/form/[formType]/page.tsx (Day 3+ extension)
//   - scripts/generate-api-json.ts (JSON twin emission)
//   - scripts/generate-sitemap*.mjs (sitemap enumeration)

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { FilingRecord, FormType } from "./types";

const DATA_DIR = join(process.cwd(), "data", "filings");

let _cache: FilingRecord[] | null = null;

export function loadAllFilings(): FilingRecord[] {
  if (_cache) return _cache;
  if (!existsSync(DATA_DIR)) {
    _cache = [];
    return _cache;
  }
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const records: FilingRecord[] = [];
  for (const file of files) {
    try {
      const raw = readFileSync(join(DATA_DIR, file), "utf8");
      const record = JSON.parse(raw) as FilingRecord;
      // Minimal shape validation — anything that survives loadAllFilings()
      // is guaranteed to have the fields static pages depend on.
      if (
        typeof record.accessionNumber === "string" &&
        typeof record.cik === "string" &&
        typeof record.filerName === "string" &&
        typeof record.formType === "string" &&
        typeof record.filedAt === "string" &&
        typeof record.edgarFilingUrl === "string"
      ) {
        records.push(record);
      } else {
        console.warn(`[filings] skipping malformed record: ${file}`);
      }
    } catch (err) {
      console.warn(`[filings] failed to parse ${file}: ${(err as Error).message}`);
    }
  }
  // Sort newest-first (most-recent filedAt) for hub views + sitemap priority
  records.sort((a, b) => b.filedAt.localeCompare(a.filedAt));
  _cache = records;
  return _cache;
}

export function loadFilingByAccession(accession: string): FilingRecord | null {
  const normalized = accession; // assume already-normalized canonical form
  const all = loadAllFilings();
  return all.find((f) => f.accessionNumber === normalized) ?? null;
}

export function loadFilingsByCik(cik: string): FilingRecord[] {
  return loadAllFilings().filter((f) => f.cik === cik);
}

export function loadFilingsByFormType(formType: FormType | string): FilingRecord[] {
  return loadAllFilings().filter((f) => f.formType === formType);
}

export function uniqueFormTypes(): FormType[] {
  const set = new Set<FormType>();
  for (const f of loadAllFilings()) set.add(f.formType);
  return Array.from(set).sort();
}

export function uniqueCiks(): string[] {
  const set = new Set<string>();
  for (const f of loadAllFilings()) set.add(f.cik);
  return Array.from(set).sort();
}

export function loadFilingsBySic(sicCode: string): FilingRecord[] {
  return loadAllFilings().filter((f) => f.sicCode === sicCode);
}

export function uniqueSicCodes(): string[] {
  const set = new Set<string>();
  for (const f of loadAllFilings()) {
    if (f.sicCode) set.add(f.sicCode);
  }
  return Array.from(set).sort();
}
