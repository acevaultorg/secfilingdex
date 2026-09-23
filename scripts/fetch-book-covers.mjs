#!/usr/bin/env node
// Product images for the /learn/ reading shelf, via the Amazon Creators API
// (successor to PA-API v5) — the Associates-allowed route. Same pattern as
// cabinpets-com/scripts/fetch-images.mjs and zipradar-org/scripts/fetch-kit-images.mjs.
//
// Compliance: image URL + detail-page URL come ONLY from the API response (never
// scraped or hotlinked from a product page), are refreshed at build time
// (Amazon's licence disallows long-term caching), and the image is always
// rendered as a link to that same tagged detail page.
//
// Never breaks the build: without credentials or on any API failure it keeps the
// previous lib/book-covers.json untouched and exits 0. The shelf renders
// the title link alone when a book has no cover.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../lib/book-covers.json", import.meta.url));
const TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "secfilingdex-20";
const MARKETPLACE = "www.amazon.com";

// Keep in sync with the `coverAsin` fields in lib/books.ts.
const src = readFileSync(fileURLToPath(new URL("../lib/books.ts", import.meta.url)), "utf8");
const asins = [...new Set([...src.matchAll(/coverAsin:\s*"([A-Z0-9]{10})"/g)].map((m) => m[1]))];

function bail(msg) {
  console.log(`book-covers: SKIPPED — ${msg}`);
  if (!existsSync(OUT)) writeFileSync(OUT, JSON.stringify({ fetched: null, note: msg, items: {} }, null, 1) + "\n");
  process.exit(0);
}

const id = process.env.CREATORS_API_CREDENTIAL_ID;
const secret = process.env.CREATORS_API_SECRET;
if (!id || !secret) bail("CREATORS_API_CREDENTIAL_ID / CREATORS_API_SECRET not set (kept existing file)");
if (!asins.length) bail("no coverAsin fields in books.ts");

const token = await fetch("https://api.amazon.com/auth/o2/token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ grant_type: "client_credentials", client_id: id, client_secret: secret, scope: "creatorsapi::default" }),
}).then((r) => r.json()).catch(() => ({}));
if (!token.access_token) bail(`token exchange failed (${token.error || "unknown"})`);

const res = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
  method: "POST",
  headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json", "x-marketplace": MARKETPLACE },
  body: JSON.stringify({
    itemIds: asins, itemIdType: "ASIN", marketplace: MARKETPLACE, partnerTag: TAG,
    resources: ["images.primary.medium", "itemInfo.title"],
  }),
}).catch(() => null);
if (!res) bail("network error");
const json = await res.json().catch(() => ({}));
if (!res.ok) bail(`API ${res.status}: ${(json.message || json.reason || "").slice(0, 120)}`);

const items = {};
for (const it of json.itemsResult?.items || json.itemResults?.items || []) {
  const img = it.images?.primary?.medium;
  if (!img?.url || !it.detailPageURL) continue;
  items[it.asin] = { url: img.url, w: img.width, h: img.height, title: it.itemInfo?.title?.displayValue || "", detail: it.detailPageURL };
}
const missing = asins.filter((a) => !items[a]);
if (!Object.keys(items).length) bail("API returned no items");
writeFileSync(OUT, JSON.stringify({ fetched: new Date().toISOString(), source: "Amazon Creators API getItems", items }, null, 1) + "\n");
console.log(`book-covers: ${Object.keys(items).length}/${asins.length} ASINs → lib/book-covers.json${missing.length ? ` (no image: ${missing.join(", ")})` : ""}`);
