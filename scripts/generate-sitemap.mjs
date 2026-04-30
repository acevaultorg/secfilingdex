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
  { path: "/contact/", changefreq: "yearly", priority: 0.5, lastmod: TODAY },
  { path: "/privacy/", changefreq: "yearly", priority: 0.4, lastmod: TODAY },
  { path: "/terms/", changefreq: "yearly", priority: 0.4, lastmod: TODAY },
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

  const filingEntries = filings.map((f) => ({
    path: `/filing/${f.accessionNumber}/`,
    changefreq: "weekly",
    priority: filingPriority(f.filedAt),
    lastmod: f.indexedAt.slice(0, 10),
  }));

  // Per-form-type landing pages
  const formTypeEntries = uniqueFormTypes(filings).map((ft) => ({
    path: `/form/${formTypeToSlug(ft)}/`,
    changefreq: "weekly",
    priority: 0.7,
    lastmod: TODAY,
  }));

  // Per-filer index pages — priority by filing count
  const filerEntries = uniqueCiks(filings).map((cik) => {
    const count = filings.filter((f) => f.cik === cik).length;
    return {
      path: `/filer/${cik}/`,
      changefreq: "weekly",
      priority: count >= 5 ? 0.7 : count >= 2 ? 0.6 : 0.5,
      lastmod: TODAY,
    };
  });

  // Per-industry (SIC code) landing pages — priority by filer count
  const industryEntries = uniqueSicCodes(filings).map((sic) => {
    const count = filings.filter((f) => f.sicCode === sic).length;
    return {
      path: `/industry/${sic}/`,
      changefreq: "weekly",
      priority: count >= 5 ? 0.7 : count >= 2 ? 0.6 : 0.5,
      lastmod: TODAY,
    };
  });

  const all = [
    ...STATIC_ROUTES,
    ...formTypeEntries,
    ...industryEntries,
    ...filerEntries,
    ...filingEntries,
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
    `[sitemap] wrote out/sitemap.xml with ${all.length} URLs (${STATIC_ROUTES.length} core + ${formTypeEntries.length} form-types + ${industryEntries.length} industries + ${filerEntries.length} filers + ${filingEntries.length} filings)`
  );
}

main();
