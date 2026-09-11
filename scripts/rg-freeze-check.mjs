#!/usr/bin/env node
// rg-freeze-guard hook v1 (2026-09-11, operator-approved). secfilingdex has no predeploy-git-guard,
// so `npm run deploy` calls this between the build and the wrangler upload. It refuses a deploy over
// an RG-frozen experiment (RG-SECFILING-10K-FSA-20260910 freezes /learn/10-k/) or a local deploy hold.
// Overrides are the guard's own: RG_FREEZE_ACK / RG_FREEZE_OVERRIDE / DEPLOY_HOLD_OVERRIDE.
// Canonical guard: VAULT-Fleet scripts/rg-freeze-guard.mjs (installed at ~/.claude/bin).
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const home = process.env.HOME || '';
const guard = [`${home}/.claude/bin/rg-freeze-guard.mjs`, `${home}/Local/VAULT-Fleet/scripts/rg-freeze-guard.mjs`]
  .find((p) => existsSync(p));
if (!guard) {
  console.warn('⚠️  rg-freeze-guard not found (~/.claude/bin or ~/Local/VAULT-Fleet/scripts) — RG freeze check SKIPPED on this Mac');
  process.exit(0);
}
const r = spawnSync(process.execPath, [guard, '--site', 'secfilingdex.com', '--out', path.join(root, 'out')], { stdio: 'inherit' });
if (r.status !== 0) {
  console.error('❌ deploy BLOCKED by rg-freeze-guard (see above)');
  process.exit(r.status || 1);
}
