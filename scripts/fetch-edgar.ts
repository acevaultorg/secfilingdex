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

// Reverse of formToSearchCode — normalizes EDGAR's raw form code back to the
// canonical FormType union value used everywhere else in the codebase
// (display strings, slug generation, schema, page routing). EDGAR returns
// "4" for Form 4 in its search response; we store "Form 4" so existing
// formTypeToSlug + FORM_TYPE_CATALOG lookups keep working.
function searchCodeToFormType(code: string): FormType {
  if (code === "4") return "Form 4" as FormType;
  if (code === "4/A") return "Form 4/A" as FormType;
  if (code === "3") return "Form 3" as FormType;
  if (code === "3/A") return "Form 3/A" as FormType;
  if (code === "5") return "Form 5" as FormType;
  if (code === "5/A") return "Form 5/A" as FormType;
  return code as FormType;
}

function transformHit(hit: EdgarSearchHit): FilingRecord {
  const accession = normalizeAccession(hit._source.adsh);
  const cik = pad10(hit._source.ciks[0]);
  const filerName = hit._source.display_names?.[0] ?? "Unknown filer";
  const ticker = hit._source.tickers?.[0]?.toUpperCase();
  const sicCode = hit._source.sics?.[0];
  const formType = searchCodeToFormType(hit._source.form);
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

// EDGAR full-text search expects the underlying form code, not the human-readable
// label. Form 3/4/5 (insider trading) are searched as "3"/"4"/"5", not "Form 4".
// Confirmed 2026-04-30: forms=Form 4 → 0 hits; forms=4 → 1758 hits in 5 days.
function formToSearchCode(form: FormType): string {
  if (form === "Form 4") return "4";
  if (form === "Form 4/A") return "4/A";
  if (form === "Form 3") return "3";
  if (form === "Form 3/A") return "3/A";
  if (form === "Form 5") return "5";
  if (form === "Form 5/A") return "5/A";
  return form;
}

async function searchByForm(
  form: FormType,
  max: number,
  attempt = 1
): Promise<FilingRecord[]> {
  const url = new URL("https://efts.sec.gov/LATEST/search-index");
  url.searchParams.set("forms", formToSearchCode(form));
  url.searchParams.set("dateRange", "custom");
  // Last 60 days window — recent filings prioritized for Day 2 seed
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  url.searchParams.set("startdt", sixtyDaysAgo.toISOString().slice(0, 10));
  url.searchParams.set("enddt", new Date().toISOString().slice(0, 10));

  const res = await throttledFetch(url.toString());
  if (!res.ok) {
    // Retry once on 5xx (transient EDGAR/AWS upstream issues)
    if (res.status >= 500 && res.status < 600 && attempt === 1) {
      console.warn(
        `[fetch-edgar] form=${form} HTTP ${res.status} — retrying once after 1s`
      );
      await new Promise((r) => setTimeout(r, 1000));
      return searchByForm(form, max, 2);
    }
    console.warn(
      `[fetch-edgar] form=${form} HTTP ${res.status} ${res.statusText}${attempt > 1 ? " (retry exhausted)" : ""}`
    );
    return [];
  }
  const json = (await res.json()) as EdgarSearchResponse;
  const hits = json.hits?.hits ?? [];
  // Make silent-zero-hits visible — distinguishes legitimately-empty
  // search windows from form-code mismatches like the Form 4 bug.
  if (hits.length === 0) {
    const total = json.hits?.total?.value ?? 0;
    console.warn(
      `[fetch-edgar] form=${form} returned 0 hits (total=${total}, search-code="${formToSearchCode(form)}") — verify form code if total=0`
    );
  }
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
