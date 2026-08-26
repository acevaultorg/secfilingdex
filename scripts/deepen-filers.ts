// scripts/deepen-filers.ts
//
// Task mta8fmh609k7dn: fetch-edgar.ts indexes BROADLY (N most-recent filings
// per FORM TYPE, across all filers) via the full-text search API. That left
// 352 filers with a median of 1 filing each — each filer page is thin
// (~185 words) and correctly stays noindex per filerProfileIsSubstantive()
// (components/FilerProfile.tsx: needs >=3 filings across >=2 distinct form
// types). Meanwhile the site sits on 24,215 GSC impressions/30d at 0.02%
// CTR — the demand exists, the pages just don't have enough of each filer's
// real history to earn the click or the index slot.
//
// This script goes DEEP instead of BROAD: for every CIK already present in
// data/filings/ (the 352 filers), it fetches that filer's FULL recent filing
// history in ONE call via the official per-filer submissions endpoint
// (https://data.sec.gov/submissions/CIK##########.json — up to ~1000 most-
// recent filings per filer) and writes any NEW filing as a FilingRecord.
// filerProfileIsSubstantive() + the noindex gate in app/filer/[cik]/page.tsx
// need no changes — deepening the data automatically un-noindexes any filer
// that crosses the bar, and nothing else does. Per the task's own explicit
// discipline: this does NOT widen the filer set (still exactly the 352
// existing CIKs) and does NOT paginate into filings.files (the pre-2015
// archive shards) — the `recent` array alone is far more than enough to
// cross a 3-filing bar for every filer in scope, and pagination would add
// real complexity for a goal (>=3 filings) it isn't needed to hit. If a
// future pass needs deeper history than `recent` covers, add pagination
// then, gated on evidence a filer's `recent` array doesn't already clear
// the bar.
//
// Only forms already in the FormType union (lib/types.ts) are ingested —
// this is a depth pass on EXISTING filers, not a form-type-coverage
// expansion (that's separate, larger scope: every new form type needs a
// FORM_TYPE_CATALOG entry + a /learn/ page for FORM_TYPE_CATALOG lookups
// and /form/[formType]/ pages to render correctly). Filings in forms outside
// the union are skipped and counted, never silently dropped nor fabricated
// into an unsupported type.
//
// Same SEC fair-access discipline as fetch-edgar.ts: identifying User-Agent,
// 5 req/s throttle (SEC allows up to 10), idempotent writes.
//
// Usage:
//   npx tsx scripts/deepen-filers.ts
//   npx tsx scripts/deepen-filers.ts --limit 20   (smoke-test a subset first)

import { writeFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { FilingRecord, FormType } from "../lib/types.js";
import { normalizeAccession, isAmendmentForm } from "../lib/types.js";
import { uniqueCiks } from "../lib/filings.js";

const DATA_DIR = join(process.cwd(), "data", "filings");
const USER_AGENT = "SecFilingDex contact@secfilingdex.com";
const MIN_REQUEST_GAP_MS = 200; // 5 req/s upper bound (SEC allows 10)

let _lastRequestAt = 0;

async function throttledFetch(url: string): Promise<Response> {
  const now = Date.now();
  const wait = Math.max(0, MIN_REQUEST_GAP_MS - (now - _lastRequestAt));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  _lastRequestAt = Date.now();
  return fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
}

// The FormType union members (lib/types.ts) PLUS "Form 3"/"Form 3/A"/
// "Form 5"/"Form 5/A" — real, common insider-ownership forms that a sibling
// commit (db225a7, landed on origin/main while this script was mid-flight)
// added to FORM_TYPE_CATALOG + slugToFormType's known-list, but did NOT add
// to the strict `FormType` string-literal union (FormTypeInfo.code is typed
// `FormType | string`, so the catalog didn't need the union widened). Cast
// with `as FormType` below rather than leaving them out — /form/form-3/ and
// /form/form-5/ now resolve correctly per that commit, so skipping them here
// would keep real, common Section-16 filings invisible for no reason.
const KNOWN_FORM_TYPES = new Set<FormType>([
  "10-K", "10-K/A", "10-Q", "10-Q/A", "8-K", "8-K/A",
  "13F-HR", "13F-HR/A", "13F-NT",
  "SC 13D", "SC 13D/A", "SC 13G", "SC 13G/A",
  "S-1", "S-1/A", "DEF 14A", "PRE 14A", "DEFA14A",
  "Form 4", "Form 4/A",
  "Form 3" as FormType, "Form 3/A" as FormType,
  "Form 5" as FormType, "Form 5/A" as FormType,
  "20-F", "20-F/A", "6-K", "11-K",
  "424B1", "424B2", "424B3", "424B4", "424B5",
]);

// Raw `form` values as returned by data.sec.gov/submissions — same mapping
// direction as fetch-edgar.ts's searchCodeToFormType, applied to the
// submissions API's slightly different raw codes (e.g. "4" not "Form 4",
// bare "SC 13D" already matches here unlike the full-text-search API which
// needed "SCHEDULE 13D").
function rawFormToFormType(raw: string): FormType | null {
  const map: Record<string, FormType> = {
    "3": "Form 3" as FormType,
    "3/A": "Form 3/A" as FormType,
    "4": "Form 4",
    "4/A": "Form 4/A",
    "5": "Form 5" as FormType,
    "5/A": "Form 5/A" as FormType,
  };
  const mapped = map[raw] ?? (raw as FormType);
  return KNOWN_FORM_TYPES.has(mapped) ? mapped : null;
}

function pad10(cik: string): string {
  return cik.replace(/^0+/, "").padStart(10, "0");
}

interface SubmissionsResponse {
  cik: string;
  name: string;
  sic?: string;
  tickers?: string[];
  filings: {
    recent: {
      accessionNumber: string[];
      filingDate: string[];
      reportDate: string[];
      form: string[];
      size: number[];
      primaryDocument: string[];
      primaryDocDescription: string[];
    };
  };
}

function writeRecord(record: FilingRecord): "wrote" | "skipped" {
  const path = join(DATA_DIR, `${record.accessionNumber}.json`);
  if (existsSync(path)) {
    const existing = JSON.parse(readFileSync(path, "utf8")) as FilingRecord;
    const merged = { ...existing, indexedAt: record.indexedAt };
    if (JSON.stringify(existing) === JSON.stringify(merged)) return "skipped";
    writeFileSync(path, JSON.stringify(merged, null, 2) + "\n");
    return "wrote";
  }
  writeFileSync(path, JSON.stringify(record, null, 2) + "\n");
  return "wrote";
}

// Caps prevent the exact failure mode this task warns against — a handful
// of high-volume filers (banks issuing hundreds of 424B shelf takedowns a
// year, insiders with frequent Form 4s) would otherwise write tens of
// thousands of filing records each. Every FilingRecord becomes its own
// static /filing/[accession]/ page (lib/filings.ts generateStaticParams),
// so uncapped ingestion doesn't just bloat one filer's page — it explodes
// the SITE-WIDE page count with a wall of near-identical shelf-registration
// pages, which is the scaled-thin-content pattern applied one level down
// from "filer" to "filing". Diversity-first: cap PER FORM TYPE so a filer
// reaches the substantive bar (>=3 filings, >=2 forms) with a genuinely
// representative disclosure mix, not 40 consecutive identical filings.
// MAX_TOTAL mirrors the task's own reference point ("40 filings across 6
// form types... is substantive and earns its index slot").
const MAX_PER_FORM_TYPE = 8;
const MAX_TOTAL_PER_FILER = 40;

async function deepenOne(cik: string): Promise<{ fetched: number; wrote: number; skippedForm: number; skippedCap: number; error?: string }> {
  const url = `https://data.sec.gov/submissions/CIK${pad10(cik)}.json`;
  const res = await throttledFetch(url);
  if (!res.ok) {
    return { fetched: 0, wrote: 0, skippedForm: 0, skippedCap: 0, error: `HTTP ${res.status}` };
  }
  const data = (await res.json()) as SubmissionsResponse;
  const recent = data.filings?.recent;
  if (!recent || !Array.isArray(recent.accessionNumber)) {
    return { fetched: 0, wrote: 0, skippedForm: 0, skippedCap: 0, error: "no filings.recent array" };
  }

  const filerName = data.name || "Unknown filer";
  const ticker = data.tickers?.[0]?.toUpperCase() || undefined;
  const sicCode = data.sic || undefined;
  const cik10 = pad10(cik);

  let wrote = 0;
  let skippedForm = 0;
  let skippedCap = 0;
  let totalTaken = 0;
  const perFormCount = new Map<FormType, number>();
  const now = new Date().toISOString();

  // `recent` arrives newest-first (SEC convention) — taking in order means
  // caps are hit by the MOST RECENT filings of each type, not an arbitrary
  // slice.
  for (let i = 0; i < recent.accessionNumber.length; i++) {
    if (totalTaken >= MAX_TOTAL_PER_FILER) break;
    const formType = rawFormToFormType(recent.form[i]);
    if (!formType) {
      skippedForm++;
      continue;
    }
    const soFar = perFormCount.get(formType) ?? 0;
    if (soFar >= MAX_PER_FORM_TYPE) {
      skippedCap++;
      continue;
    }
    perFormCount.set(formType, soFar + 1);
    totalTaken++;
    const accession = normalizeAccession(recent.accessionNumber[i]);
    const filedAt = new Date(`${recent.filingDate[i]}T00:00:00Z`).toISOString();
    const periodOfReport = recent.reportDate[i] ? recent.reportDate[i] : undefined;
    const primaryDocument = recent.primaryDocument[i] || undefined;
    const primaryDocDescription = recent.primaryDocDescription[i] || undefined;
    const size = typeof recent.size[i] === "number" ? recent.size[i] : undefined;
    const accessionStripped = accession.replace(/-/g, "");
    const edgarFilingUrl = `https://www.sec.gov/Archives/edgar/data/${parseInt(cik10, 10)}/${accessionStripped}/${accession}-index.htm`;

    const record: FilingRecord = {
      accessionNumber: accession,
      cik: cik10,
      filerName,
      ticker,
      sicCode,
      formType,
      filedAt,
      periodOfReport,
      primaryDocument,
      primaryDocDescription,
      edgarFilingUrl,
      size,
      indexedAt: now,
      isAmendment: isAmendmentForm(formType),
    };
    if (writeRecord(record) === "wrote") wrote++;
  }

  return { fetched: recent.accessionNumber.length, wrote, skippedForm, skippedCap };
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  let limit = Infinity;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--limit" && argv[i + 1]) {
      limit = parseInt(argv[i + 1], 10);
      i++;
    }
  }

  const ciks = uniqueCiks().slice(0, limit);
  console.log(`[deepen-filers] ${ciks.length} filers to deepen, ua="${USER_AGENT}", cap=${MAX_TOTAL_PER_FILER}/filer (${MAX_PER_FORM_TYPE}/form-type)`);

  // Snapshot before-state ONCE (not per-filer) — a single directory scan,
  // not O(filers) scans. With tens of thousands of records already on disk,
  // re-scanning the whole directory twice per filer would make this script
  // itself slower than the thing it's fixing.
  const beforeSubstantiveCiks = substantiveCikSet();

  let totalFetched = 0;
  let totalWrote = 0;
  let totalSkippedForm = 0;
  let totalSkippedCap = 0;
  let errors = 0;

  for (let i = 0; i < ciks.length; i++) {
    const cik = ciks[i];
    try {
      const result = await deepenOne(cik);
      totalFetched += result.fetched;
      totalWrote += result.wrote;
      totalSkippedForm += result.skippedForm;
      totalSkippedCap += result.skippedCap;
      if (result.error) {
        errors++;
        console.warn(`[deepen-filers] cik=${cik} (${i + 1}/${ciks.length}) ERROR ${result.error}`);
      } else if ((i + 1) % 25 === 0 || i === ciks.length - 1) {
        console.log(
          `[deepen-filers] ${i + 1}/${ciks.length} cik=${cik} fetched=${result.fetched} wrote=${result.wrote} skippedForm=${result.skippedForm} skippedCap=${result.skippedCap}`
        );
      }
    } catch (err) {
      errors++;
      console.warn(`[deepen-filers] cik=${cik} threw: ${(err as Error).message}`);
    }
  }

  const afterSubstantiveCiks = substantiveCikSet();
  let crossedBar = 0;
  for (const cik of afterSubstantiveCiks) {
    if (!beforeSubstantiveCiks.has(cik)) crossedBar++;
  }

  console.log(
    `[deepen-filers] DONE filers=${ciks.length} totalFetched=${totalFetched} totalWrote=${totalWrote} totalSkippedForm=${totalSkippedForm} totalSkippedCap=${totalSkippedCap} errors=${errors} crossedSubstantiveBar=${crossedBar} (${beforeSubstantiveCiks.size} -> ${afterSubstantiveCiks.size} substantive filers)`
  );
}

// Single full-directory scan, grouping by CIK and applying the same bar as
// filerProfileIsSubstantive() (components/FilerProfile.tsx) — kept as a
// parallel literal here rather than imported, since that module also pulls
// in React/JSX which this plain-Node script has no build step for.
function substantiveCikSet(): Set<string> {
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const byCik = new Map<string, FilingRecord[]>();
  for (const f of files) {
    try {
      const r = JSON.parse(readFileSync(join(DATA_DIR, f), "utf8")) as FilingRecord;
      const arr = byCik.get(r.cik) ?? [];
      arr.push(r);
      byCik.set(r.cik, arr);
    } catch {
      /* skip unparsable */
    }
  }
  const out = new Set<string>();
  for (const [cik, filings] of byCik) {
    if (isSubstantive(filings)) out.add(cik);
  }
  return out;
}

function isSubstantive(filings: FilingRecord[]): boolean {
  const distinctForms = new Set(filings.map((f) => f.formType)).size;
  return filings.length >= 3 && distinctForms >= 2;
}

main().catch((err) => {
  console.error(`[deepen-filers] fatal: ${err.message}`);
  process.exit(1);
});
