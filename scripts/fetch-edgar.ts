// scripts/fetch-edgar.ts
//
// Fetches recent SEC EDGAR filings via the official SEC search API and
// caches them as canonical JSON records under data/filings/.
//
// Compliance with SEC fair-access policy (https://www.sec.gov/os/accessing-edgar-data):
//   - Sets User-Agent identifying SecFilingDex + contact email
//   - Throttles to ≤10 requests/second (we use 5 req/s for safety)
//   - Caches results locally so re-runs don't re-hammer
//   - Idempotent: existing data/filings/[accession].json files are skipped
//
// Usage:
//   npx tsx scripts/fetch-edgar.ts
//   npx tsx scripts/fetch-edgar.ts --forms 10-K,10-Q --max 200
//
// Day 2 contract: when run successfully, populates data/filings/ with
// recent filings across the form types in DEFAULT_FORMS. Build-time
// loadAllFilings() will then surface those for /filing/[accession]/ pages.

import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { FilingRecord, FormType } from "../lib/types.js";
import { normalizeAccession, isAmendmentForm } from "../lib/types.js";

const DATA_DIR = join(process.cwd(), "data", "filings");
const USER_AGENT = "SecFilingDex contact@secfilingdex.com";
const MIN_REQUEST_GAP_MS = 200; // 5 req/s upper bound (SEC allows 10)

const DEFAULT_FORMS: FormType[] = [
  "10-K",
  "10-Q",
  "8-K",
  "13F-HR",
  "SC 13D",
  "SC 13G",
  "S-1",
  "DEF 14A",
  "Form 4",
  "20-F",
  "6-K",
];
const DEFAULT_MAX_PER_FORM = 5;

interface EdgarSearchHit {
  _id: string;
  _source: {
    ciks: string[];
    display_names?: string[];
    file_date: string;
    period_of_report?: string;
    adsh: string;
    form: string;
    items?: string[];
    file_size?: number;
    file_type?: string;
    primary_doc?: string;
    primary_doc_description?: string;
    sics?: string[];
    tickers?: string[];
  };
}

interface EdgarSearchResponse {
  hits: { hits: EdgarSearchHit[]; total: { value: number } };
}

let _lastRequestAt = 0;

async function throttledFetch(url: string): Promise<Response> {
  const now = Date.now();
  const wait = Math.max(0, MIN_REQUEST_GAP_MS - (now - _lastRequestAt));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  _lastRequestAt = Date.now();
  return fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });
}

function parseArgs(): { forms: FormType[]; maxPerForm: number } {
  const argv = process.argv.slice(2);
  let forms = DEFAULT_FORMS;
  let maxPerForm = DEFAULT_MAX_PER_FORM;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--forms" && argv[i + 1]) {
      forms = argv[i + 1].split(",") as FormType[];
      i++;
    } else if (argv[i] === "--max" && argv[i + 1]) {
      maxPerForm = parseInt(argv[i + 1], 10);
      i++;
    }
  }
  return { forms, maxPerForm };
}

function pad10(cik: string): string {
  return cik.replace(/^0+/, "").padStart(10, "0");
}

function transformHit(hit: EdgarSearchHit): FilingRecord {
  const accession = normalizeAccession(hit._source.adsh);
  const cik = pad10(hit._source.ciks[0]);
  const filerName = hit._source.display_names?.[0] ?? "Unknown filer";
  const ticker = hit._source.tickers?.[0]?.toUpperCase();
  const sicCode = hit._source.sics?.[0];
  const formType = hit._source.form as FormType;
  const filedAtRaw = hit._source.file_date;
  const filedAt = new Date(`${filedAtRaw}T00:00:00Z`).toISOString();
  const periodOfReport = hit._source.period_of_report;
  const primaryDoc = hit._source.primary_doc;
  const primaryDocDescription = hit._source.primary_doc_description;
  const size = hit._source.file_size;

  // EDGAR archive URL format: archive id is accession with dashes stripped
  const accessionStripped = accession.replace(/-/g, "");
  const edgarFilingUrl = `https://www.sec.gov/Archives/edgar/data/${parseInt(
    cik,
    10
  )}/${accessionStripped}/${accession}-index.htm`;

  return {
    accessionNumber: accession,
    cik,
    filerName,
    ticker,
    sicCode,
    formType,
    filedAt,
    periodOfReport,
    primaryDocument: primaryDoc,
    primaryDocDescription,
    edgarFilingUrl,
    size,
    indexedAt: new Date().toISOString(),
    isAmendment: isAmendmentForm(formType),
  };
}

async function searchByForm(
  form: FormType,
  max: number
): Promise<FilingRecord[]> {
  const url = new URL("https://efts.sec.gov/LATEST/search-index");
  url.searchParams.set("forms", form);
  url.searchParams.set("dateRange", "custom");
  // Last 60 days window — recent filings prioritized for Day 2 seed
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  url.searchParams.set("startdt", sixtyDaysAgo.toISOString().slice(0, 10));
  url.searchParams.set("enddt", new Date().toISOString().slice(0, 10));

  const res = await throttledFetch(url.toString());
  if (!res.ok) {
    console.warn(
      `[fetch-edgar] form=${form} HTTP ${res.status} ${res.statusText}`
    );
    return [];
  }
  const json = (await res.json()) as EdgarSearchResponse;
  const hits = json.hits?.hits ?? [];
  return hits.slice(0, max).map(transformHit);
}

function writeRecord(record: FilingRecord): "wrote" | "skipped" {
  const path = join(DATA_DIR, `${record.accessionNumber}.json`);
  if (existsSync(path)) {
    // Idempotent: only update if content changed (e.g., re-indexed timestamp)
    const existing = JSON.parse(readFileSync(path, "utf8")) as FilingRecord;
    const merged = { ...existing, indexedAt: record.indexedAt };
    if (JSON.stringify(existing) === JSON.stringify(merged)) return "skipped";
    writeFileSync(path, JSON.stringify(merged, null, 2) + "\n");
    return "wrote";
  }
  writeFileSync(path, JSON.stringify(record, null, 2) + "\n");
  return "wrote";
}

async function main(): Promise<void> {
  mkdirSync(DATA_DIR, { recursive: true });
  const { forms, maxPerForm } = parseArgs();
  console.log(
    `[fetch-edgar] forms=${forms.join(",")} max=${maxPerForm} ua="${USER_AGENT}"`
  );
  let total = 0;
  let wrote = 0;
  let skipped = 0;
  for (const form of forms) {
    try {
      const records = await searchByForm(form, maxPerForm);
      for (const r of records) {
        const result = writeRecord(r);
        total++;
        if (result === "wrote") wrote++;
        else skipped++;
      }
      console.log(
        `[fetch-edgar] form=${form} fetched=${records.length} cumulative=${total}`
      );
    } catch (err) {
      console.warn(
        `[fetch-edgar] form=${form} failed: ${(err as Error).message}`
      );
    }
  }
  console.log(
    `[fetch-edgar] DONE total=${total} wrote=${wrote} skipped=${skipped}`
  );
}

main().catch((err) => {
  console.error(`[fetch-edgar] fatal: ${err.message}`);
  process.exit(1);
});
