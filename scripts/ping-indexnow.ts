// scripts/ping-indexnow.ts
//
// D5-03 — IndexNow integration. Pings IndexNow API after every deploy so
// search engines reindex updated URLs immediately (cuts new-page indexing
// from 3-14 days to hours). Implements `indexnow_autoping_every_deploy`
// archetype (×+40) per `~/.claude/rules/aceusergrowth.md` v3 Part 14
// Instrumentation Catalog.
//
// Setup (operator, one-time):
//   1. Generate a 32-char hex key at https://www.bing.com/indexnow OR `openssl rand -hex 16`
//   2. Drop into `.env.local` as: INDEXNOW_KEY=<the-32-char-key>
//   3. Run `npm run deploy` — script auto-writes `out/<KEY>.txt` for verification
//      and POSTs the full sitemap URL list to api.indexnow.org
//
// Graceful degradation: if INDEXNOW_KEY is missing, exits 0 with a notice.
// Build/deploy never fail due to IndexNow.
//
// Per `~/.claude/acepilot-19.8/templates/indexnow-key-setup.md`.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const HOST = "secfilingdex.com";
const SITEMAP_PATH = join(process.cwd(), "out", "sitemap.xml");
const ENV_LOCAL_PATH = join(process.cwd(), ".env.local");

function readKey(): string {
  // 1) explicit env var wins (CI, fleet runner)
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY;
  // 2) .env.local fallback (operator workflow)
  if (existsSync(ENV_LOCAL_PATH)) {
    const raw = readFileSync(ENV_LOCAL_PATH, "utf8");
    const m = raw.match(/^INDEXNOW_KEY=(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return "";
}

async function main(): Promise<void> {
  const KEY = readKey();
  if (!KEY) {
    console.log(
      "[indexnow] INDEXNOW_KEY not set (no env var, no .env.local entry). Skipping ping. See scripts/ping-indexnow.ts header for setup."
    );
    return;
  }
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(KEY)) {
    console.log(
      `[indexnow] INDEXNOW_KEY format looks invalid (expect 8-128 alphanumeric/dash chars). Skipping ping.`
    );
    return;
  }
  if (!existsSync(SITEMAP_PATH)) {
    console.log(
      "[indexnow] out/sitemap.xml not found — run `npm run build` first."
    );
    return;
  }

  // Write verification file at out/<KEY>.txt so IndexNow can verify domain ownership.
  // Required per https://www.indexnow.org/documentation
  const keyFilePath = join(process.cwd(), "out", `${KEY}.txt`);
  if (!existsSync(keyFilePath)) {
    writeFileSync(keyFilePath, KEY, "utf8");
    console.log(`[indexnow] wrote verification file: out/${KEY}.txt`);
  }

  // Extract <loc> entries from sitemap.xml
  const xml = readFileSync(SITEMAP_PATH, "utf8");
  const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);

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
    if (res.status === 200 || res.status === 202) {
      console.log(
        `[indexnow] pinged ${urls.length} URLs — status ${res.status} (accepted; reindex queued)`
      );
    } else {
      const text = await res.text().catch(() => "");
      console.log(
        `[indexnow] non-success status ${res.status} ${res.statusText}: ${text.slice(0, 200)}`
      );
    }
  } catch (err) {
    console.log(
      `[indexnow] ping failed (non-fatal): ${(err as Error).message}`
    );
  }
}

main();
