// scripts/generate-sitemap.mjs
//
// Generates out/sitemap.xml after `next build`. Enumerates:
//   - core hand-authored routes (homepage, about, contact, privacy, terms)
//   - every filing page from data/filings/*.json
// Each filing entry's lastmod = the filing's indexedAt (when SecFilingDex
// last verified against EDGAR), changefreq=weekly, priority weighted by
// freshness (recent filings filed within 30d get higher priority).

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
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
const TODAY = new Date().toISOString().slice(0, 10);
const NOW_MS = Date.now();

const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: 1.0, lastmod: TODAY },
  { path: "/about/", changefreq: "monthly", priority: 0.7, lastmod: TODAY },
  { path: "/methodology/", changefreq: "monthly", priority: 0.7, lastmod: TODAY },
  { path: "/faq/", changefreq: "monthly", priority: 0.6, lastmod: TODAY },
  { path: "/contact/", changefreq: "yearly", priority: 0.5, lastmod: TODAY },
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
];

function urlEntry({ path, changefreq, priority, lastmod }) {
  return [
    "  <url>",
    `    <loc>${SITE_URL}${path}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
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
  // /filing/[accession] pages (290 × ~210 words avg) + /filer/[cik] pages (283 × ~145
  // words avg) are below AdSense's ≥400-word indexable-page threshold. Both surfaces
  // are noindex'd at page-metadata level (see app/filing/[accession]/page.tsx +
  // app/filer/[cik]/page.tsx generateMetadata) AND excluded from sitemap below.
  // Pages remain LIVE for users via internal navigation. Substantive aggregator
  // surfaces (/form/[formType] + /industry/[sicCode]) STAY indexed — broader pages
  // with richer per-page value. Same fix pattern as HoldLens v19.44 /insiders/*.
  //
  // To re-enable filing / filer indexing: (a) expand per-page commentary to ≥400
  // unique words, (b) flip robots.index = true in the page.tsx, (c) uncomment the
  // arrays below.
  //
  // const filingEntries = filings.map((f) => ({
  //   path: `/filing/${f.accessionNumber}/`,
  //   changefreq: "weekly",
  //   priority: filingPriority(f.filedAt),
  //   lastmod: f.indexedAt.slice(0, 10),
  // }));
  //
  // const filerEntries = uniqueCiks(filings).map((cik) => {
  //   const count = filings.filter((f) => f.cik === cik).length;
  //   return {
  //     path: `/filer/${cik}/`,
  //     changefreq: "weekly",
  //     priority: count >= 5 ? 0.7 : count >= 2 ? 0.6 : 0.5,
  //     lastmod: TODAY,
  //   };
  // });

  // Per-form-type landing pages (KEPT — aggregator surface, substantive content)
  const formTypeEntries = uniqueFormTypes(filings).map((ft) => ({
    path: `/form/${formTypeToSlug(ft)}/`,
    changefreq: "weekly",
    priority: 0.7,
    lastmod: TODAY,
  }));

  // Per-industry (SIC code) landing pages — KEPT (substantive aggregator pages, 650+ words avg)
  const industryEntries = uniqueSicCodes(filings).map((sic) => {
    const count = filings.filter((f) => f.sicCode === sic).length;
    return {
      path: `/industry/${sic}/`,
      changefreq: "weekly",
      priority: count >= 5 ? 0.7 : count >= 2 ? 0.6 : 0.5,
      lastmod: TODAY,
    };
  });

  // Suppress unused-imports lint trace
  void filings;
  void uniqueCiks;
  void filingPriority;

  const all = [
    ...STATIC_ROUTES,
    ...formTypeEntries,
    ...industryEntries,
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
    `[sitemap] wrote out/sitemap.xml with ${all.length} URLs (${STATIC_ROUTES.length} core + ${formTypeEntries.length} form-types + ${industryEntries.length} industries; filing + filer pages excluded per AdSense thin-content prevention)`
  );
}

main();
