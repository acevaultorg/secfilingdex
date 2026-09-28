#!/usr/bin/env node
// amazon-tracking-guard.mjs — build-time guard: every Amazon affiliate link on every built page is TRACKED.
// Canonical copy: VAULT-Fleet/tooling/61-site-guard/amazon-tracking-guard.mjs (card muksgphls3y3tw, 2026-09-28).
// Each site repo carries a copy in scripts/ plus a config file (amazon-tracking-guard.config.json) at the repo root.
//
// "Tracked" = the click reaches the fleet click beacon with a page class (p=) and a placement (f=):
//   1. every page that contains an Amazon affiliate link also carries the site's tracker, and the tracker code
//      sends p= (config.tracker: regexes that must ALL match the page HTML + its local <script src> files);
//   2. every affiliate link carries a non-empty placement attribute (config.placementAttrs, e.g. data-event-from),
//      whose value is not "untagged";
//   3. when config.gate is "required", no raw tagged amazon.* / amzn.to href may bypass the site's /go/ or /out/ gate
//      (config.ungatedAllow: regexes for hrefs that are deliberately ungated).
// config.trackerFiles: optional list of tracker files (relative to outDir) always searched with the page (a next/script tracker
// is referenced only from the RSC payload). Prefer the page reference when the scan can see it: trackerFiles proves the
// file ships, not that every page loads it.
// An affiliate link = an <a href> to amazon.*/audible.* carrying tag=, an amzn.to / a.co short link, or the site's
// own gate path (config.gatePrefixes, default ["/go/", "/out/"]).
//
// Usage:  node scripts/amazon-tracking-guard.mjs [outDir]      exit 0 = all tracked, exit 1 = refuse to deploy
// Self-test (sabotage): AMAZON_GUARD_SABOTAGE=1 plants one untracked link in memory and must exit 1.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cfgPath = [process.env.AMAZON_GUARD_CONFIG, 'amazon-tracking-guard.config.json', 'scripts/amazon-tracking-guard.config.json']
  .filter(Boolean).map((p) => path.resolve(root, p)).find((p) => fs.existsSync(p));
if (!cfgPath) { console.error('AMAZON-TRACKING-GUARD: no amazon-tracking-guard.config.json — refusing (a guard with no config checks nothing).'); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const outDir = path.resolve(root, process.argv[2] || cfg.outDir || 'out');
if (!fs.existsSync(outDir)) { console.error(`AMAZON-TRACKING-GUARD: build output ${outDir} does not exist — refusing.`); process.exit(1); }

const placementAttrs = cfg.placementAttrs || ['data-event-from', 'data-from'];
const trackerRes = (cfg.tracker || []).map((s) => new RegExp(s));
if (!trackerRes.length) { console.error('AMAZON-TRACKING-GUARD: config.tracker is empty — refusing.'); process.exit(1); }
const gatePrefixes = cfg.gatePrefixes || ['/go/', '/out/'];
const ungatedAllow = (cfg.ungatedAllow || []).map((s) => new RegExp(s));
const skipFiles = (cfg.skipFiles || []).map((s) => new RegExp(s));
const minLinks = cfg.minLinks ?? 1;
// config.trackerFiles: tracker files (relative to outDir) that are loaded in a way the HTML scan cannot follow; each must exist.
const trackerFilesCode = (cfg.trackerFiles || []).map((t) => { const p = path.join(outDir, t); if (!fs.existsSync(p)) { console.error(`AMAZON-TRACKING-GUARD: trackerFiles entry ${t} missing from ${outDir} — refusing.`); process.exit(1); } return fs.readFileSync(p, 'utf8'); }).join('\n');

const AMZ = /^(https?:)?\/\/([a-z0-9-]+\.)*(amazon\.[a-z.]+|audible\.[a-z.]+)(\/|$|\?)/i;
const SHORT = /^(https?:)?\/\/(amzn\.(to|eu)|a\.co)\//i;
const isGate = (h) => gatePrefixes.some((g) => h.startsWith(g) || new RegExp('^https?://[^/]+' + g.replace(/\//g, '\\/')).test(h));
const isAffiliate = (h) => isGate(h) || SHORT.test(h) || (AMZ.test(h) && /[?&](amp;)?tag=/.test(h));

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p, acc); }
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}
const scriptCache = new Map();
function localScript(src, fileDir) {
  if (/^(https?:)?\/\//.test(src)) return '';
  const clean = src.split(/[?#]/)[0];
  const p = clean.startsWith('/') ? path.join(outDir, clean) : path.join(fileDir, clean);
  if (!scriptCache.has(p)) scriptCache.set(p, fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
  return scriptCache.get(p);
}
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
function anchors(html) {
  // real <a ...> start tags only (anchors serialised inside JSON/RSC payloads are not <a tags)
  const out = [];
  const re = /<a\s([^>]*?)>/gis;
  let m;
  while ((m = re.exec(html))) {
    const attrs = {};
    const ar = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    let a;
    while ((a = ar.exec(m[1]))) attrs[a[1].toLowerCase()] = decode(a[2] ?? a[3] ?? a[4] ?? '');
    if (attrs.href !== undefined) out.push(attrs);
  }
  return out;
}

const files = walk(outDir).filter((f) => !skipFiles.some((r) => r.test(path.relative(outDir, f))));
let pages = 0, links = 0;
const bad = [];
let badCount = 0;
// keep at most 200 messages, flattened (a V8 slice would pin the whole page HTML in memory: OOM on a 22k-page build)
const fail = (m) => { badCount++; if (bad.length < 200) bad.push(Buffer.from(m).toString()); };
for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');
  if (process.env.AMAZON_GUARD_SABOTAGE === '1' && pages === 0 && /<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, '<a href="https://www.amazon.com/dp/B000SABOTG?tag=sabotage-20">planted</a></body>');
  }
  const aff = anchors(html).filter((a) => isAffiliate(a.href.trim()));
  if (!aff.length) continue;
  pages++; links += aff.length;
  const rel = path.relative(outDir, f);
  // <script src> plus next/script-style preloads (<link rel=preload as=script href>), whose code never appears as a <script src>
  const srcs = [...html.matchAll(/<script[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi), ...html.matchAll(/<link[^>]*\bas\s*=\s*["']script["'][^>]*\bhref\s*=\s*["']([^"']+)["']/gi), ...html.matchAll(/<link[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*\bas\s*=\s*["']script["']/gi)].map((m) => m[1]);
  const scripts = [...new Set(srcs)].map((s) => localScript(s, path.dirname(f))).join('\n') + '\n' + trackerFilesCode;
  const hay = html + '\n' + scripts;
  const missing = trackerRes.filter((r) => !r.test(hay));
  if (missing.length) fail(`${rel}: ${aff.length} affiliate link(s) but the tracker is missing (${missing.map(String).join(', ')})`);
  for (const a of aff) {
    const h = a.href.trim();
    const place = placementAttrs.map((k) => a[k]).find((v) => v && v.trim() && v.trim() !== 'untagged');
    if (!place) fail(`${rel}: no placement (${placementAttrs.join('|')}) on ${h.slice(0, 120)}`);
    if (cfg.gate === 'required' && !isGate(h) && !ungatedAllow.some((r) => r.test(h))) fail(`${rel}: raw Amazon link bypasses the gate: ${h.slice(0, 120)}`);
  }
}
if (links < minLinks) { console.error(`AMAZON-TRACKING-GUARD: found ${links} affiliate links in ${outDir} (expected >= ${minLinks}) — the scan is blind or the build is incomplete. Refusing.`); process.exit(1); }
if (badCount) {
  console.error(`AMAZON-TRACKING-GUARD FAILED: ${badCount} problem(s) across ${pages} pages / ${links} affiliate links. First 25:`);
  for (const b of bad.slice(0, 25)) console.error('  - ' + b);
  process.exit(1);
}
console.log(`AMAZON-TRACKING-GUARD OK: ${links} affiliate links on ${pages} pages all tracked (tracker with p= on every page, placement on every link${cfg.gate === 'required' ? ', all gated' : ''}).`);
