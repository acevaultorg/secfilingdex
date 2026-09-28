#!/usr/bin/env bash
# Ship an already completed static export with BOTH Pages Functions and assets.
# Caller must hold the machine heavy lock. A build and artifact QA precede this.
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/predeploy-git-guard.mjs
# Amazon click-tracking guard (2026-09-28 · card muksgphls3y3tw): refuse an out/ with an untracked Amazon link.
node scripts/amazon-tracking-guard.mjs
[ -z "$(git status --porcelain)" ] || { echo "Commit reviewed source changes before deployment." >&2; exit 1; }
npx tsx scripts/ping-indexnow.ts --write-key-only
node scripts/rg-freeze-check.mjs
node scripts/verify-research-book.mjs
worker_dir="$(mktemp -d /tmp/secfiling-functions.XXXXXX)"
trap 'rm -rf "$worker_dir"' EXIT
WRANGLER_SEND_METRICS=false node node_modules/wrangler/bin/wrangler.js pages functions build functions --outdir "$worker_dir" --output-routes-path out/_routes.json
# --outfile emits multipart bytes, not JavaScript. --outdir produces the raw
# module. Fail closed if Wrangler ever needs more than this one bundled file.
[ "$(find "$worker_dir" -type f | wc -l | tr -d ' ')" = "1" ]
[ -s "$worker_dir/index.js" ]
cp "$worker_dir/index.js" out/_worker.js
node --check out/_worker.js
CF_BATCH_MB=6 python3 scripts/cf-pages-chunked-deploy.py
