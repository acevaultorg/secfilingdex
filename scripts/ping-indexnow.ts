// scripts/ping-indexnow.ts
//
// Pings IndexNow API after every deploy so search engines reindex updated
// URLs immediately (cuts new-page indexing from 3-14 days to hours).
//
// Day 1 contract: must exit 0 if INDEXNOW_KEY env not set (per fleet pattern;
// real key gets dropped at FLEET_METRICS_DATA/indexnow-keys.txt + per-deploy
// env). Day 5 ship wires the real key. See `~/.claude/acepilot-19.8/templates/
// indexnow-key-setup.md` for the operator-side per-domain setup.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const HOST = "secfilingdex.com";
const KEY = process.env.INDEXNOW_KEY || "";
const SITEMAP_PATH = join(process.cwd(), "out", "sitemap.xml");

async function main(): Promise<void> {
  if (!KEY) {
    console.log(
      "[indexnow] INDEXNOW_KEY env not set — Day 1 stub, skipping ping. Day 5 ship wires real key."
    );
    return;
  }
  if (!existsSync(SITEMAP_PATH)) {
    console.log(
      "[indexnow] out/sitemap.xml not found — run `npm run build` first."
    );
    return;
  }

  // Extract <loc> entries from sitemap (rough but sufficient for Day 1)
  const xml = readFileSync(SITEMAP_PATH, "utf8");
  const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
    (m) => m[1]
  );

  if (urls.length === 0) {
    console.log("[indexnow] no URLs found in sitemap — skipping ping.");
    return;
  }

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(
      `[indexnow] pinged ${urls.length} URLs — status ${res.status} ${res.statusText}`
    );
  } catch (err) {
    console.log(
      `[indexnow] ping failed (non-fatal): ${(err as Error).message}`
    );
  }
}

main();
