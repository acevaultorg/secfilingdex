// scripts/generate-sitemap.mjs
//
// Generates out/sitemap.xml after `next build`. Enumerates:
//   - core hand-authored routes (homepage, about, contact, privacy, terms)
//   - every filing page from data/filings/*.json
// Each filing entry's lastmod = the filing's indexedAt (when SecFilingDex
// last verified against EDGAR), changefreq=weekly, priority weighted by
// freshness (recent filings filed within 30d get higher priority).

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  loadAllFilingsSync,
  uniqueCiks,
  uniqueFormTypes,
  uniqueSicCodes,
  formTypeToSlug,
} from "./lib/data-loader.mjs";

const SITE_URL = "https://secfilingdex.com";
const OUT_DIR = join(process.cwd(), "out");
// lastmod is never the build clock (2026-09-28: every URL carried the deploy date on every
// build). Hand-authored pages use the last commit that changed the site's source; hub pages use
// the newest indexedAt among the filings they list. Unknown → the tag is omitted, never faked.
import { execSync } from "node:child_process";
let CONTENT_DATE;
try {
  CONTENT_DATE = execSync("git log -1 --format=%cs -- app components lib content ':(exclude)*.md'", { encoding: "utf8" }).trim();
} catch {}
if (!/^\d{4}-\d{2}-\d{2}$/.test(CONTENT_DATE || "")) CONTENT_DATE = undefined;
const TODAY = CONTENT_DATE;
const day = (s) => (typeof s === "string" && /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : undefined);
const newest = (list) => list.map((f) => day(f.indexedAt)).filter(Boolean).sort().pop();
const later = (a, b) => (a && b ? (a > b ? a : b) : a || b);
const NOW_MS = Date.now();

const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: 1.0, lastmod: TODAY },
  { path: "/about/", changefreq: "monthly", priority: 0.7, lastmod: TODAY },
  { path: "/methodology/", changefreq: "monthly", priority: 0.7, lastmod: TODAY },
  { path: "/faq/", changefreq: "monthly", priority: 0.6, lastmod: TODAY },
  { path: "/contact/", changefreq: "yearly", priority: 0.5, lastmod: TODAY },
  { path: "/partners/", changefreq: "monthly", priority: 0.5, lastmod: TODAY },
  { path: "/disclosure/", changefreq: "yearly", priority: 0.4, lastmod: TODAY },
  { path: "/privacy/", changefreq: "yearly", priority: 0.4, lastmod: TODAY },
  { path: "/terms/", changefreq: "yearly", priority: 0.4, lastmod: TODAY },
  // Hub-index pages — taxonomy entry points (filer/form/industry/learn indexes)
  { path: "/filer/", changefreq: "weekly", priority: 0.8, lastmod: TODAY },
  { path: "/form/", changefreq: "weekly", priority: 0.8, lastmod: TODAY },
  { path: "/industry/", changefreq: "weekly", priority: 0.8, lastmod: TODAY },
  { path: "/learn/", changefreq: "weekly", priority: 0.8, lastmod: TODAY },
  // /learn/[topic] — plain-English explainers (LLM-citation-optimized)
  { path: "/learn/10-k/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/10-q/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/8-k/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/13f/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/form-4/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/s-1/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/s-3/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/def-14a/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/20-f/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/13d-vs-13g/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/6-k/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/10-k-a/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/11-k/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/13h/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/nt-10-k/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/f-1/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/form-144/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/n-csr/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/n-px/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/form-d/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/sc-13e3/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
  { path: "/learn/10-q-a/", changefreq: "monthly", priority: 0.9, lastmod: TODAY },
];

function urlEntry({ path, changefreq, priority, lastmod }) {
  return [
    "  <url>",
    `    <loc>${SITE_URL}${path}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority.toFixed(1)}</priority>`,
    "  </url>",
  ].join("\n");
}

function filingPriority(filedAtIso) {
  // Filings <30d old → priority 0.8; <90d → 0.6; older → 0.5
  const ageDays = (NOW_MS - Date.parse(filedAtIso)) / 86_400_000;
  if (ageDays < 30) return 0.8;
  if (ageDays < 90) return 0.6;
  return 0.5;
}

function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const filings = loadAllFilingsSync();

  // 2026-05-12 AdSense thin-content prevention (per rules/adsense-thin-content-prevention.md).
  // /filing/[accession] pages (11,227 × ~210 words avg) stay noindex'd + excluded from
  // sitemap — each is a thin single-document metadata wrapper regardless of corpus
  // depth (app/filing/[accession]/page.tsx). Pages remain LIVE for users via internal
  // navigation. Aggregator surfaces (/form/[formType] + /industry/[sicCode]) STAY
  // indexed. Same fix pattern as HoldLens v19.44 /insiders/*.
  //
  // 2026-08-26 — /filer/[cik] RE-ENABLED for the subset that crossed the substantive
  // bar. filerProfileIsSubstantive() (components/FilerProfile.tsx) already flips
  // robots.index=true page-by-page as EDGAR depth-ingestion (scripts/deepen-filers.ts)
  // fills a filer's history; the sitemap generator hadn't been wired to match. Same
  // ≥3-filings/≥2-form-types gate, kept in sync here so a filer never appears in the
  // sitemap while its own page still says noindex.
  const FILER_MIN_FILINGS = 3;
  const FILER_MIN_FORM_TYPES = 2;
  const filerEntries = uniqueCiks(filings)
    .map((cik) => {
      const filerFilings = filings.filter((f) => f.cik === cik);
      const distinctForms = new Set(filerFilings.map((f) => f.formType)).size;
      return { cik, count: filerFilings.length, distinctForms };
    })
    .filter(({ count, distinctForms }) => count >= FILER_MIN_FILINGS && distinctForms >= FILER_MIN_FORM_TYPES)
    .map(({ cik, count }) => ({
      path: `/filer/${cik}/`,
      changefreq: "weekly",
      priority: count >= 20 ? 0.7 : count >= 10 ? 0.65 : 0.6,
      lastmod: later(newest(filings.filter((f) => f.cik === cik)), CONTENT_DATE),
    }));

  // Per-form-type landing pages (KEPT — aggregator surface, substantive content)
  //
  // GUARD: /form/[formType] resolves its slug back to a raw form type via
  // slugToFormType() in lib/types.ts, which matches ONLY against
  // FORM_TYPE_CATALOG plus a hand-kept literal list. A form type present in the
  // data but absent from both never resolves, so the page calls notFound() and
  // serves a soft 404 — HTTP 200, `noindex`, no <h1> — while this generator
  // happily lists it in the sitemap. That is exactly what happened to
  // "Form 3", "Form 3/A" and "Form 5" (2026-08-11): 30 real filings unreachable,
  // 3 dead URLs advertised to Google on a site with ~25k impressions.
  //
  // The list is hand-maintained and EDGAR keeps adding form types, so drift is a
  // matter of when. Rather than trust it, re-derive what the app can resolve and
  // refuse to advertise anything it can't. Fail loudly — a silent skip would just
  // hide the next drift instead of the last one.
  const typesSrc = readFileSync(join(process.cwd(), "lib", "types.ts"), "utf8");
  const resolvable = new Set([
    ...[...typesSrc.matchAll(/code:\s*"([^"]+)"/g)].map((m) => m[1]),
    ...[...typesSrc
      .split("export function slugToFormType")[1]
      .split("];")[0]
      .matchAll(/"([^"]+)"/g)].map((m) => m[1]),
  ]);
  const unresolvable = uniqueFormTypes(filings).filter((ft) => !resolvable.has(ft));
  if (unresolvable.length) {
    throw new Error(
      `generate-sitemap: ${unresolvable.length} form type(s) in the data cannot be resolved by ` +
        `slugToFormType() and would ship as soft 404s in the sitemap: ` +
        `${unresolvable.map((t) => `${JSON.stringify(t)} -> /form/${formTypeToSlug(t)}/`).join(", ")}. ` +
        `Add each to FORM_TYPE_CATALOG (preferred — the page then renders a real definition) ` +
        `or to the literal list in slugToFormType().`,
    );
  }

  const formTypeEntries = uniqueFormTypes(filings).map((ft) => ({
    path: `/form/${formTypeToSlug(ft)}/`,
    changefreq: "weekly",
    priority: 0.7,
    lastmod: later(newest(filings.filter((f) => f.formType === ft)), CONTENT_DATE),
  }));

  // Per-industry (SIC code) landing pages — KEPT (substantive aggregator pages, 650+ words avg)
  // 2026-08-01: exclude thin SICs (<3 filings) — noindex'd at page level in
  // app/industry/[sicCode]/page.tsx (MIN_FILINGS_FOR_INDEX). Keep values in sync.
  const MIN_FILINGS_FOR_INDEX = 3;
  const industryEntries = uniqueSicCodes(filings)
    .map((sic) => ({ sic, count: filings.filter((f) => f.sicCode === sic).length }))
    .filter(({ count }) => count >= MIN_FILINGS_FOR_INDEX)
    .map(({ sic, count }) => ({
      path: `/industry/${sic}/`,
      changefreq: "weekly",
      priority: count >= 5 ? 0.7 : 0.6,
      lastmod: later(newest(filings.filter((f) => f.sicCode === sic)), CONTENT_DATE),
    }));

  // Suppress unused-imports lint trace
  void filingPriority;

  // Home and the three index hubs list the newest filings, so they change when a filing lands.
  const newestAll = newest(filings);
  const hubs = new Set(["/", "/filer/", "/form/", "/industry/"]);
  const staticRoutes = STATIC_ROUTES.map((r) => (hubs.has(r.path) ? { ...r, lastmod: later(newestAll, CONTENT_DATE) } : r));
  const all = [
    ...staticRoutes,
    ...formTypeEntries,
    ...industryEntries,
    ...filerEntries,
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...all.map(urlEntry),
    "</urlset>",
    "",
  ].join("\n");
  writeFileSync(join(OUT_DIR, "sitemap.xml"), xml);
  console.log(
    `[sitemap] wrote out/sitemap.xml with ${all.length} URLs (${STATIC_ROUTES.length} core + ${formTypeEntries.length} form-types + ${industryEntries.length} industries + ${filerEntries.length} substantive filers; filing pages + thin filers excluded per AdSense thin-content prevention)`
  );
}

main();
