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
//   3. Run `npm run deploy` — postbuild auto-writes `out/<KEY>.txt` for verification
//      (so it ships in the deploy bundle), and the ping step POSTs the full
//      sitemap URL list to api.indexnow.org after wrangler completes.
//
// Modes:
//   `--write-key-only`  Only write out/<KEY>.txt verification file. Used in postbuild
//                       so the key is already on the live site when api.indexnow.org
//                       tries to verify domain ownership.
//   (default)           Write the key file (idempotent) AND POST the sitemap URLs.
//                       Used post-deploy.
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
  const writeKeyOnly = process.argv.includes("--write-key-only");
  const KEY = readKey();
  if (!KEY) {
    console.log(
      "[indexnow] INDEXNOW_KEY not set (no env var, no .env.local entry). Skipping. See scripts/ping-indexnow.ts header for setup."
    );
    return;
  }
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(KEY)) {
    console.log(
      `[indexnow] INDEXNOW_KEY format looks invalid (expect 8-128 alphanumeric/dash chars). Skipping.`
    );
    return;
  }

  // Write verification file at out/<KEY>.txt so IndexNow can verify domain ownership.
  // Required per https://www.indexnow.org/documentation
  // Done in postbuild (before wrangler deploy) so the file actually ships to the live site.
  const keyFilePath = join(process.cwd(), "out", `${KEY}.txt`);
  if (!existsSync(keyFilePath)) {
    writeFileSync(keyFilePath, KEY, "utf8");
    console.log(`[indexnow] wrote verification file: out/${KEY}.txt`);
  } else {
    console.log(`[indexnow] verification file already present: out/${KEY}.txt`);
  }

  if (writeKeyOnly) {
    return;
  }

  if (!existsSync(SITEMAP_PATH)) {
    console.log(
      "[indexnow] out/sitemap.xml not found — run `npm run build` first."
    );
    return;
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

  // Multi-endpoint POST. api.indexnow.org distributes to all participants on
  // success, but caches host-verification status — if it fetched <KEY>.txt
  // and got a 404 from an earlier deploy, it returns 403 for hours/days even
  // after the file is live. Yandex's endpoint runs an independent verifier
  // and accepts pings other endpoints reject during verification cooldown.
  // Per-endpoint failures are logged but never fail the script (deploy must
  // never block on IndexNow distribution).
  const endpoints = [
    { name: "api.indexnow.org", url: "https://api.indexnow.org/indexnow" },
    { name: "bing.com", url: "https://www.bing.com/indexnow" },
    { name: "yandex.com", url: "https://yandex.com/indexnow" },
  ];

  let acceptedCount = 0;
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 200 || res.status === 202) {
        console.log(
          `[indexnow] ${ep.name}: ${urls.length} URLs accepted (status ${res.status})`
        );
        acceptedCount++;
      } else {
        const text = await res.text().catch(() => "");
        const reason = text.slice(0, 120).replace(/\s+/g, " ");
        console.log(
          `[indexnow] ${ep.name}: non-success ${res.status} ${res.statusText}${reason ? ` — ${reason}` : ""}`
        );
      }
    } catch (err) {
      console.log(
        `[indexnow] ${ep.name}: request failed (non-fatal) — ${(err as Error).message}`
      );
    }
  }

  if (acceptedCount === 0) {
    console.log(
      `[indexnow] WARNING: all ${endpoints.length} endpoints rejected this ping. Verify ${`https://${HOST}/${KEY}.txt`} returns 200 with the key as content. Bing's verification cache typically clears 24-48h after the key file becomes accessible.`
    );
  } else {
    console.log(
      `[indexnow] ${acceptedCount}/${endpoints.length} endpoints accepted (sufficient for fleet-wide reindex; api.indexnow.org redistributes to all participants on accept)`
    );
  }
}

main();
