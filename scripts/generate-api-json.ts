// scripts/generate-api-json.ts
//
// Day 1 stub. Day 2-3 (BUILD_SPEC.md) extends this to walk data/filings/*.json
// and emit per-filing /api/filing/[accession].json + /api/filer/[cik].json
// + /api/form/[formType].json bot-cacheable JSON twins per bot-harvest Pattern 3.
//
// Day 1 contract: must exit 0 so `next build` proceeds. No filings indexed yet.

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data", "filings");

function main(): void {
  if (!existsSync(DATA_DIR)) {
    console.log(
      "[generate-api-json] data/filings/ not present yet — Day 1 stub, skipping."
    );
    return;
  }
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.log(
      "[generate-api-json] data/filings/ empty — Day 1 stub, skipping."
    );
    return;
  }
  console.log(
    `[generate-api-json] found ${files.length} filings — Day 2 extension will emit JSON twins here.`
  );
}

main();
