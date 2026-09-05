#!/usr/bin/env node
/**
 * prune-out.mjs — keep out/ under Cloudflare Pages' 20,000-file-per-deployment cap.
 *
 * WHY THIS EXISTS (measured 2026-08-27, re-measured 2026-09-05):
 * a clean `next build` of this site emits ~35,200 files. Cloudflare Pages accepts at most
 * 20,000 per deployment and rejects the whole deploy — SILENTLY, from the caller's point of
 * view: the build job succeeds, the deploy job fails, and no new deployment appears. Every
 * pipeline since 2026-08-26 failed this way while production went stale for 10 days.
 *
 * Two prunes, both safe, in this order:
 *
 *  1. RSC soft-navigation .txt payloads. Next emits one per route; dropping them only costs
 *     client-side soft navigation, which falls back to a normal page load.
 *     PRUNED BY CONTENT SIGNATURE, NEVER BY FILENAME — robots.txt, ads.txt, llms.txt and the
 *     IndexNow key files are also .txt, and deleting an IndexNow key permanently 403s the host
 *     at Bing.
 *
 *  2. .json twins under api/filing/ that no sitemap advertises. Twins listed in sitemap.xml or
 *     sitemap-ai.xml are KEPT — deleting an advertised twin would put 404s in a sitemap.
 *
 * Verification (asserted below, non-zero exit on failure): file count under the cap, zero
 * advertised-JSON 404s, HTML count unchanged.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = 'out';
const CAP = 20000;
const RSC = /^[0-9]+:(I\[|\[|"\$S|HL\[|\{)/;

if (!existsSync(OUT)) { console.error('prune-out: no out/ — run after next build'); process.exit(1); }

const walk = (d, acc = []) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p, acc); else acc.push(p);
  }
  return acc;
};

const all = walk(OUT);
const htmlBefore = all.filter(f => f.endsWith('.html')).length;

// --- advertised JSON, read from the sitemaps themselves ---
const advertised = new Set();
for (const sm of all.filter(f => /sitemap[^/]*\.xml$/.test(f))) {
  const xml = readFileSync(sm, 'utf8');
  for (const m of xml.matchAll(/https?:\/\/[^"'<\s]*?(\/[^"'<\s]*?\.json)/g)) advertised.add(m[1]);
}

let rscPruned = 0, jsonPruned = 0, keptTxt = [];
for (const f of all) {
  const rel = '/' + relative(OUT, f);
  if (f.endsWith('.txt')) {
    let head = '';
    try { head = readFileSync(f, 'utf8').slice(0, 64); } catch { continue; }
    if (RSC.test(head)) { unlinkSync(f); rscPruned++; } else keptTxt.push(rel);
    continue;
  }
  if (f.endsWith('.json') && rel.startsWith('/api/filing/') && !advertised.has(rel)) {
    unlinkSync(f); jsonPruned++;
  }
}

const after = walk(OUT);
const htmlAfter = after.filter(f => f.endsWith('.html')).length;
const total = after.length;

console.log(`[prune-out] rsc-payloads removed : ${rscPruned}`);
console.log(`[prune-out] unadvertised twins   : ${jsonPruned}`);
console.log(`[prune-out] .txt kept            : ${keptTxt.length} -> ${keptTxt.join(' ')}`);
console.log(`[prune-out] files ${all.length} -> ${total} (cap ${CAP})`);

// --- assertions: fail loudly rather than ship a rejected deploy ---
let bad = 0;
if (total >= CAP) { console.error(`[prune-out] FAIL: ${total} files still >= cap ${CAP}`); bad++; }
if (htmlAfter !== htmlBefore) { console.error(`[prune-out] FAIL: html ${htmlBefore} -> ${htmlAfter}`); bad++; }
const missing = [...advertised].filter(p => !existsSync(join(OUT, p.slice(1))));
if (missing.length) { console.error(`[prune-out] FAIL: ${missing.length} advertised JSON now 404 (e.g. ${missing[0]})`); bad++; }
for (const k of ['/robots.txt', '/ads.txt']) {
  if (all.some(f => '/' + relative(OUT, f) === k) && !existsSync(join(OUT, k.slice(1)))) {
    console.error(`[prune-out] FAIL: ${k} was deleted`); bad++;
  }
}
if (bad) process.exit(1);
console.log('[prune-out] OK — under cap, html unchanged, 0 advertised-JSON 404s');
