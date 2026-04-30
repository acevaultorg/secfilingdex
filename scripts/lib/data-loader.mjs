// scripts/lib/data-loader.mjs
//
// Plain-Node helpers for build-time scripts (sitemap, sitemap-ai, indexnow).
// We avoid pulling tsx for these so postbuild stays fast. The TypeScript app
// code uses lib/filings.ts for the same data; this is the .mjs mirror.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data", "filings");

export function loadAllFilingsSync() {
  if (!existsSync(DATA_DIR)) return [];
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const records = [];
  for (const file of files) {
    try {
      const raw = readFileSync(join(DATA_DIR, file), "utf8");
      const r = JSON.parse(raw);
      if (
        typeof r.accessionNumber === "string" &&
        typeof r.cik === "string" &&
        typeof r.formType === "string" &&
        typeof r.filedAt === "string"
      ) {
        records.push(r);
      }
    } catch {
      // ignore malformed
    }
  }
  records.sort((a, b) => b.filedAt.localeCompare(a.filedAt));
  return records;
}

export function uniqueCiks(records) {
  return Array.from(new Set(records.map((r) => r.cik))).sort();
}

export function uniqueFormTypes(records) {
  return Array.from(new Set(records.map((r) => r.formType))).sort();
}

export function uniqueSicCodes(records) {
  const set = new Set();
  for (const r of records) {
    if (r.sicCode) set.add(r.sicCode);
  }
  return Array.from(set).sort();
}

/** Mirror of lib/types.ts formTypeToSlug — kept in sync for build scripts. */
export function formTypeToSlug(formType) {
  return formType
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
