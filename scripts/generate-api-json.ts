// scripts/generate-api-json.ts
//
// Emits machine-readable JSON twins per fleet bot-harvest Pattern 3 (one
// JSON endpoint per programmatic page, bot-cacheable, citation-grade).
//
// Output goes to `public/api/filing/[accession].json` so Next's static
// export pipeline copies it into `out/api/filing/...`. Per-filing pages
// reference these at `/api/filing/[accession].json` in their schema.org
// Dataset markup + LLM-citation alternate links.
//
// Aggregate index at `public/api/filings.json` lists every record (newest
// first) so bots can paginate the full dataset.
//
// Runs in `prebuild` (before next build) so the generated files land in
// `public/` and are picked up by the static-export copy step.

import { mkdirSync, writeFileSync, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

interface FilingShape {
  accessionNumber: string;
  cik: string;
  filerName: string;
  formType: string;
  filedAt: string;
  edgarFilingUrl: string;
  indexedAt: string;
  isAmendment: boolean;
  ticker?: string;
  sicCode?: string;
  periodOfReport?: string;
  primaryDocument?: string;
  primaryDocDescription?: string;
  size?: number;
}

const DATA_DIR = join(process.cwd(), "data", "filings");
const PUBLIC_API_DIR = join(process.cwd(), "public", "api");
const FILING_API_DIR = join(PUBLIC_API_DIR, "filing");
const SITE_URL = "https://secfilingdex.com";

function loadFilings(): FilingShape[] {
  if (!existsSync(DATA_DIR)) return [];
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const records: FilingShape[] = [];
  for (const f of files) {
    try {
      const r = JSON.parse(readFileSync(join(DATA_DIR, f), "utf8")) as FilingShape;
      if (r.accessionNumber && r.cik && r.formType && r.filedAt) records.push(r);
    } catch {
      /* skip malformed */
    }
  }
  records.sort((a, b) => b.filedAt.localeCompare(a.filedAt));
  return records;
}

function enrichForApi(r: FilingShape) {
  return {
    schema_version: "1",
    accession_number: r.accessionNumber,
    cik: r.cik,
    filer_name: r.filerName,
    ticker: r.ticker,
    sic_code: r.sicCode,
    form_type: r.formType,
    is_amendment: r.isAmendment,
    filed_at: r.filedAt,
    period_of_report: r.periodOfReport,
    primary_document: r.primaryDocument,
    primary_document_description: r.primaryDocDescription,
    size_bytes: r.size,
    indexed_at: r.indexedAt,
    edgar_url: r.edgarFilingUrl,
    secfilingdex_url: `${SITE_URL}/filing/${r.accessionNumber}/`,
    license: "U.S. government works are public domain (17 U.S.C. § 105). Editorial annotations CC-BY-4.0.",
    source: "SEC EDGAR",
  };
}

function main(): void {
  const filings = loadFilings();
  if (filings.length === 0) {
    console.log("[generate-api-json] data/filings/ empty — skipping (Day 1 stub).");
    return;
  }

  // Wipe + recreate the output dir so removed source records don't linger.
  if (existsSync(FILING_API_DIR)) rmSync(FILING_API_DIR, { recursive: true, force: true });
  mkdirSync(FILING_API_DIR, { recursive: true });

  // Per-filing JSON twin
  for (const r of filings) {
    const enriched = enrichForApi(r);
    writeFileSync(
      join(FILING_API_DIR, `${r.accessionNumber}.json`),
      JSON.stringify(enriched, null, 2) + "\n"
    );
  }

  // Aggregate index — `/api/filings.json` (full list, newest first)
  const indexBody = {
    schema_version: "1",
    generated_at: new Date().toISOString(),
    count: filings.length,
    license: "U.S. government works are public domain (17 U.S.C. § 105). Editorial annotations CC-BY-4.0.",
    source: "SEC EDGAR",
    // json_url only for the 1,000 most recent filings: older twins are pruned for the Pages file cap
    // (scripts/prune-out.mjs, lib/filings.ts TWIN_CAP). A listed-but-pruned URL is a crawler 404.
    filings: filings.map((r, i) => ({
      accession_number: r.accessionNumber,
      cik: r.cik,
      filer_name: r.filerName,
      form_type: r.formType,
      filed_at: r.filedAt,
      url: `${SITE_URL}/filing/${r.accessionNumber}/`,
      json_url: i < 1000 ? `${SITE_URL}/api/filing/${r.accessionNumber}.json` : null,
    })),
  };
  writeFileSync(
    join(PUBLIC_API_DIR, "filings.json"),
    JSON.stringify(indexBody, null, 2) + "\n"
  );

  console.log(
    `[generate-api-json] wrote ${filings.length} per-filing JSON twins + filings.json index`
  );
}

main();
