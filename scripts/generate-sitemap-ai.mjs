// scripts/generate-sitemap-ai.mjs
//
// AI-priority secondary sitemap per `~/.claude/rules/bot-harvest.md` Lever 5.
// Adds xhtml:link alternates pointing to each filing's JSON twin so LLM
// crawlers can fetch the structured-data version directly.

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadAllFilingsSync } from "./lib/data-loader.mjs";

const SITE_URL = "https://secfilingdex.com";
const OUT_DIR = join(process.cwd(), "out");
const TODAY = new Date().toISOString().slice(0, 10);

// Hand-authored AI-priority routes (always included)
const AI_ROUTES = [
  { path: "/", priority: 1.0, lastmod: TODAY },
  { path: "/about/", priority: 0.9, lastmod: TODAY },
];

function urlEntry({ path, priority, lastmod, jsonAlt }) {
  const lines = [
    "  <url>",
    `    <loc>${SITE_URL}${path}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    "    <changefreq>weekly</changefreq>",
    `    <priority>${priority.toFixed(1)}</priority>`,
  ];
  if (jsonAlt) {
    lines.push(
      `    <xhtml:link rel="alternate" type="application/json" href="${SITE_URL}${jsonAlt}"/>`
    );
  }
  lines.push("  </url>");
  return lines.join("\n");
}

function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const filings = loadAllFilingsSync();

  // Cap the AI sitemap at the most recent 1000 filings so it stays under the
  // 50k URL hard cap with headroom. Day 2 has 56; Day 3+ will scale.
  const filingEntries = filings.slice(0, 1000).map((f) => ({
    path: `/filing/${f.accessionNumber}/`,
    priority: 0.9,
    lastmod: f.indexedAt.slice(0, 10),
    jsonAlt: `/api/filing/${f.accessionNumber}.json`,
  }));

  const all = [...AI_ROUTES, ...filingEntries];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...all.map(urlEntry),
    "</urlset>",
    "",
  ].join("\n");
  writeFileSync(join(OUT_DIR, "sitemap-ai.xml"), xml);
  console.log(
    `[sitemap-ai] wrote out/sitemap-ai.xml with ${all.length} URLs (${AI_ROUTES.length} core + ${filingEntries.length} filings, JSON twins linked)`
  );
}

main();
