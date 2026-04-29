# CONTEXT — secfilingdex.com

**Last updated:** 2026-04-29 (Day 1 P0 ship session, AcePilot 19.38)

## Session Handoff

**Mode:** sovereign auto
**Status:** **Day 1 P0 SHIPPED.** D1-01 → D1-12 complete in commit `f961e67`. Local-only (D1-13 GitHub repo creation pending operator). Build PASS, 6 static routes, 109 KB First Load JS.

**Next session pickup:** operator runs `/acepilot auto` again. Brain reads ARCHETYPE → static-reference → loads concept-finder + Profile-7 playbook → executes Day 2 P1 (D2-01 EDGAR fetcher → D2-02 first 100 filings → D2-03 filing taxonomy schema). Day 1 P0 already complete; brain advances queue.

If operator has created the acevaultorg/secfilingdex repo (Clarity Card 1) and wired the remote, brain will push the Day 0 + Day 1 commits as part of Day 2 setup.

## Day 1 ship summary

- **6 static routes** generated: `/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/_not-found`
- **109 KB First Load JS** (under 150 KB Day-1 budget; can tighten Day 4)
- **Static export to `out/`** — 1.2 MB total, ready for Cloudflare Pages
- **Sitemaps**: `out/sitemap.xml` (5 routes) + `out/sitemap-ai.xml` (2 priority routes)
- **Schema.org JSON-LD**: Organization + WebSite on every page; Person on /about
- **AdSense compliance** baseline: privacy + about + contact + terms all live with required disclosures (cookies, third-party advertising, Google partner-sites link, GDPR/CCPA opt-out, contact email)
- **Bot harvest** wired: robots.txt allowlist (10 AI crawlers + Google Mediapartners + AdsBot) · llms.txt manifest with EDGAR-source provenance · ads.txt placeholder · Sitemaps both standard + AI variants
- **Analytics wired**: Plausible (cookieless) + Cloudflare Web Analytics (privacy-first, env-gated) + GA4 (Consent Mode v2 denied default, env-gated) + GSC verification ready (token via metadata.verification when registered)

## Open items entering Day 2

- D2-01 SEC EDGAR fetcher (`scripts/fetch-edgar.ts`) — public data, no API key
- D2-02 First 100 filings indexed (recent quarter, mixed form types)
- D2-03 Filing taxonomy schema in `data/filings/`
- (then Day 3-7 per BUILD_SPEC.md)

## Operator Clarity Cards queued (handoff format)

See operator-action handoff at session end. 4 cards:

1. 🔴 **D1-13** — Create acevaultorg/secfilingdex GitHub repo (~2 min, blocks D2 push)
2. 🟢 **D7-02** — Wire secfilingdex.com → Cloudflare Pages (deferred to Day 7 deploy)
3. 🟢 **D7-03** — AdSense application (Day 7 after first 10+ pages live)
4. 🟢 **D7-04** — Perplexity Publishers email (Day 7, post-deploy)

D1-13 is the only RIGHT-NOW operator action. The other 3 stay queued until Day 7 anyway.

## Project state (unchanged)

- **Domain:** secfilingdex.com (Cloudflare-registered 2026-04-28)
- **Folder:** `/Users/paulodevries/Local/AceVault 260426/secfilingdex-com/secfilingdex/`
- **Sibling fleet:** holdlens-com (different lens), Concept Finder, Fermentcalc, sourcescore-org
- **Stack:** Next.js 15.0.3 + React 19 RC + Tailwind 3.4 + TypeScript 5.6 + Wrangler/CF Pages
- **Repo:** local main branch, 2 commits, no remote yet

## Concept positioning (unchanged)

"EDGAR's database, modernized." Comprehensive SEC filing surface with composite indexing, taxonomy, diff-viz, JSON API. Distinct from holdlens (signal-spectrum on superinvestor 13Fs).

## Brain inferences cached this session

- Archetype: static-reference (confidence 0.95, source: cached state + folder structure + CLAUDE.md spec)
- Build tier: Easy (Day 1 P0 shipped on schedule per holdlens playbook replay)
- Oracle weights cached: 0.6 / 0.7 / 1.0 (revenue / retention / distribution-dominant)
- Primary mode: sovereign auto (= /acepilot auto in v17.3)
- Revenue model: AdSense (Day 7) + Ezoic (Week 2) + CF PPC (zone-toggle anytime) + Mediavine when 1k sessions/mo crossed

## Open decisions for Day 2

- First 100 filings selection criteria — resolved as "recent quarter all major form types, large-cap tilt for recognizable filers" (deferring exact list to D2-02 when EDGAR fetcher runs)
- Email contact alias — currently `contact@secfilingdex.com` referenced in privacy/contact/terms (operator may need to set up alias OR overwrite to paulomdevries@gmail.com — flagged as P2 polish task)
- Champion-tier scheduled-task cadence — defer to Day 7 ship per plan

## State files current

- ARCHETYPE ✅ (static-reference, cached)
- MODE ✅ (sovereign auto)
- IDENTITY.md ✅
- BUILD_SPEC.md ✅
- TASKS.md ✅ (D1-01..12 complete; D2 onward queued)
- KNOWLEDGE.md ✅
- CONTEXT.md ✅ (this file, updated post-Day-1)
- HEARTBEAT.log ✅ (2 session rows now)

## Build verified facts (commit f961e67)

- `npm run build` succeeds with exit 0
- Output: 6 static routes prerendered into `out/`
- 109 KB First Load JS (target <150 KB Day 1, <100 KB Day 4)
- Sitemap covers 5 user-facing routes
- AI-sitemap covers 2 priority routes (/, /about/)
- Page weight per route ~109 KB (acceptable; refine in Day 4 polish)
- Static export configuration verified (output: 'export', trailingSlash: true)
