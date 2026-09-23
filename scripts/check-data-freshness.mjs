// scripts/check-data-freshness.mjs
//
// WARNS (never fails) when the newest ingested filing is older than
// DATA_STALE_AFTER_BUSINESS_DAYS business days.
//
// Why this exists (2026-09-23):
//   `npm run fetch-edgar` is a MANUAL script. It is not in prebuild, build,
//   postbuild, deploy, or .gitlab-ci.yml — despite README.md and CLAUDE.md both
//   claiming "all data fetching happens at BUILD TIME". So the corpus is only as
//   fresh as the last time a human typed the command. On 2026-09-11 that stopped
//   happening, and for eleven days the site rebuilt and deployed cleanly on a
//   frozen snapshot while /learn/8-k/ promised "Live — the 5 most recent 8-K
//   filings". Every gate in the chain passed, because no gate read the DATA.
//
//   Hundreds of 8-Ks are filed every business day. Two business days of none is
//   not a quiet week, it is a broken pipeline. That cadence is what makes this
//   measurable here and NOT on, say, holdlens (13F is quarterly — 39 days stale
//   there is mandatory, not a fault). Do not port this threshold to a site
//   without a known daily cadence.
//
// WARN, not fail, on purpose: a stale corpus is still a working site, and a
// hard failure here would block an unrelated copy fix from ever shipping.
// Set SECFILINGDEX_STALE_DATA_FATAL=1 to turn the warning into a build failure.
//
// Usage:  node scripts/check-data-freshness.mjs

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data", "filings");
const STALE_AFTER_BUSINESS_DAYS = 2;
const FATAL = process.env.SECFILINGDEX_STALE_DATA_FATAL === "1";

/** Business days strictly after `from`, up to and including `to`. Weekends only —
 *  SEC holidays are not modelled, so this can under-report staleness by a day
 *  around a holiday. That is the safe direction for a warning. */
function businessDaysBetween(from, to) {
  let n = 0;
  const d = new Date(from);
  d.setUTCHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setUTCHours(0, 0, 0, 0);
  while (d < end) {
    d.setUTCDate(d.getUTCDate() + 1);
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) n++;
  }
  return n;
}

function newestFiledAt() {
  let files;
  try {
    files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return { error: `data dir unreadable: ${DATA_DIR}` };
  }
  if (files.length === 0) return { error: "no filing records found" };

  let newest = null;
  let parsed = 0;
  for (const f of files) {
    let rec;
    try {
      rec = JSON.parse(readFileSync(join(DATA_DIR, f), "utf8"));
    } catch {
      continue;
    }
    parsed++;
    const filedAt = rec?.filedAt;
    if (typeof filedAt !== "string") continue;
    const day = filedAt.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
    if (newest === null || day > newest) newest = day;
  }

  // An instrument that read nothing must say so, not report "fresh".
  if (parsed === 0) return { error: `0 of ${files.length} records parsed` };
  if (newest === null) return { error: `no filedAt field in ${parsed} records` };
  return { newest, parsed, files: files.length };
}

const result = newestFiledAt();

if (result.error) {
  // Cannot measure => cannot certify. Say it loudly; still do not block.
  console.warn(
    `\n[data-freshness] ⚠️  CANNOT MEASURE FRESHNESS — ${result.error}.` +
      `\n[data-freshness]     This is NOT a pass. Run: npm run fetch-edgar\n`
  );
  if (FATAL) process.exit(1);
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);
const age = businessDaysBetween(`${result.newest}T00:00:00Z`, `${today}T00:00:00Z`);

if (age > STALE_AFTER_BUSINESS_DAYS) {
  const msg =
    `\n[data-freshness] ⚠️  STALE DATA — newest filing is ${result.newest}, ` +
    `${age} business days old (threshold ${STALE_AFTER_BUSINESS_DAYS}).` +
    `\n[data-freshness]     ${result.parsed} records scanned. The site advertises "Live" filings.` +
    `\n[data-freshness]     Hundreds of 8-Ks are filed every business day — this is a pipeline fault,` +
    `\n[data-freshness]     not a quiet week. Fix with:  npm run fetch-edgar\n`;
  if (FATAL) {
    console.error(msg);
    console.error("[data-freshness] SECFILINGDEX_STALE_DATA_FATAL=1 — failing the build.\n");
    process.exit(1);
  }
  console.warn(msg);
  process.exit(0);
}

console.log(
  `[data-freshness] OK — newest filing ${result.newest} (${age} business day(s) old, ` +
    `${result.parsed} records).`
);
