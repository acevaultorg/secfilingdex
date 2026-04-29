// scripts/generate-sitemap.mjs
//
// Generates out/sitemap.xml after `next build` runs. Day 1: enumerates the
// hand-authored core pages. Day 3+ extension walks data/filings/*.json and
// adds per-filing/per-filer/per-form-type URLs.
//
// Runs in postbuild (after next build emits out/) so out/sitemap.xml is part
// of the static export shipped to Cloudflare Pages.

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = "https://secfilingdex.com";
const OUT_DIR = join(process.cwd(), "out");
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: 1.0 },
  { path: "/about/", changefreq: "monthly", priority: 0.7 },
  { path: "/contact/", changefreq: "yearly", priority: 0.5 },
  { path: "/privacy/", changefreq: "yearly", priority: 0.4 },
  { path: "/terms/", changefreq: "yearly", priority: 0.4 },
];

function urlEntry({ path, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${SITE_URL}${path}</loc>`,
    `    <lastmod>${TODAY}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
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
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...STATIC_ROUTES.map(urlEntry),
    "</urlset>",
    "",
  ].join("\n");
  writeFileSync(join(OUT_DIR, "sitemap.xml"), xml);
  console.log(
    `[sitemap] wrote out/sitemap.xml with ${STATIC_ROUTES.length} URLs`
  );
}

main();
