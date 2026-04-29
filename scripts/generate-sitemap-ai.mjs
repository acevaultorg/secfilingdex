// scripts/generate-sitemap-ai.mjs
//
// Generates out/sitemap-ai.xml — secondary sitemap for AI-crawler priority
// pages per ~/.claude/rules/bot-harvest.md Lever 5. Includes xhtml:link
// alternate JSON-API references when JSON twins exist (Day 3+ extension).
//
// Day 1: surfaces homepage + canonical content pages. Day 3 extension adds
// per-filing pages with their /api/[slug].json alternates.

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = "https://secfilingdex.com";
const OUT_DIR = join(process.cwd(), "out");
const TODAY = new Date().toISOString().slice(0, 10);

// AI-priority routes — pages we most want LLM crawlers to consume
const AI_ROUTES = [
  { path: "/", priority: 1.0 },
  { path: "/about/", priority: 0.9 },
];

function urlEntry({ path, priority }) {
  return [
    "  <url>",
    `    <loc>${SITE_URL}${path}</loc>`,
    `    <lastmod>${TODAY}</lastmod>`,
    "    <changefreq>weekly</changefreq>",
    `    <priority>${priority.toFixed(1)}</priority>`,
    "  </url>",
  ].join("\n");
}

function main() {
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...AI_ROUTES.map(urlEntry),
    "</urlset>",
    "",
  ].join("\n");
  writeFileSync(join(OUT_DIR, "sitemap-ai.xml"), xml);
  console.log(
    `[sitemap-ai] wrote out/sitemap-ai.xml with ${AI_ROUTES.length} priority URLs`
  );
}

main();
