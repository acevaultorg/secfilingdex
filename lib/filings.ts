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

// JSON twins exist only for the TWIN_CAP most recent filings. scripts/prune-out.mjs deletes every
// /api/filing/<id>.json that sitemap-ai.xml does not advertise (Cloudflare Pages' 20,000-file cap), and
// scripts/generate-sitemap-ai.mjs advertises filings.slice(0, 1000) of this same newest-first order.
// Linking a pruned twin sent Bingbot to a 404 on every older filing page (card mv032y8ycjh0if), so pages
// link a twin only when this says it is published; prune-out asserts no page links a missing twin.
export const TWIN_CAP = 1000;
let _twins: Set<string> | null = null;
export function hasPublishedTwin(accession: string): boolean {
  if (!_twins) _twins = new Set(loadAllFilings().slice(0, TWIN_CAP).map((f) => f.accessionNumber));
  return _twins.has(accession);
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
