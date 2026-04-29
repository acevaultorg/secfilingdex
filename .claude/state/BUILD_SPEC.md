# BUILD_SPEC — secfilingdex.com Day 1-7 ship plan

**Archetype:** static-reference (Easy-tier per concept-finder-methodology v2.1)
**Created:** 2026-04-28
**Domain:** secfilingdex.com (Cloudflare-registered)
**Stack:** Next.js 15 static-export + Tailwind + TypeScript + Cloudflare Pages

## Day 1 P0 (the operator's first /acepilot auto session ships these)

1. **`npm install`** — Next.js 15.0.3 + React 19 RC + Tailwind 3.4 + TypeScript 5.6 + Wrangler dependencies
2. **First build** — verify Next.js static export works (`npm run build` produces `out/`)
3. **Landing page** (`app/page.tsx`) — hero with positioning + 3-tile feature preview + above-fold CTA
4. **Privacy policy** (`app/privacy/page.tsx`) — AdSense-compliance baseline (per `rules/adsense-compliance.md`)
5. **About page** (`app/about/page.tsx`) — operator identity + methodology
6. **Contact page** (`app/contact/page.tsx`) — real email
7. **Robots.txt** (`public/robots.txt`) — AI-allowlist per `rules/bot-harvest.md` (GPTBot, ClaudeBot, PerplexityBot, etc. all allowed)
8. **llms.txt** (`public/llms.txt`) — manifest for LLM crawlers
9. **Schema.org** in layout — Organization + WebSite types
10. **Day-1 Analytics** — Plausible script + Cloudflare Web Analytics beacon + GSC verification meta tag in layout (per Layer 7 mandate)
11. **First commit** — `git init`, initial commit, push to acevaultorg/secfilingdex (operator-pending repo creation)

## Day 2 — EDGAR data ingestion

1. **EDGAR fetcher** (`scripts/fetch-edgar.ts`) — pull SEC EDGAR filing index (free, no API key for public data)
2. **Filing taxonomy** — categorize 10-K / 10-Q / 8-K / 13F / 13D/G / S-1 / Proxy / Form 4 / etc.
3. **Data schema** (`data/filings/`) — normalize filings into JSON files keyed by accession number
4. **First 100 filings** indexed (recent quarter, mixed types) for Day 1-3 SEO seed

## Day 3 — Programmatic pages

1. **Per-filing pages** (`app/filing/[accession]/page.tsx`) — generated from data
2. **Per-filer pages** (`app/filer/[cik]/page.tsx`) — index of all filings by CIK
3. **Per-form-type pages** (`app/form/[formType]/page.tsx`) — 10-K / 13F / etc. landing
4. **Sitemap.xml** auto-generated from filings + AI-sitemap secondary (`/sitemap-ai.xml`)
5. **JSON API endpoints** per page (`/api/filing/[accession].json`) — bot-friendly per bot-harvest Pattern 3

## Day 4 — Polish + first real value

1. **Search UI** — client-side filter (no backend) over indexed filings
2. **Filing diff visualization** — what changed between sequential filings (operator's editorial judgment in taxonomy)
3. **Per-result share card** (1200×630 PNG via Satori) — every filing page is shareable
4. **Internal-linking hub-spoke** — filing → filer → similar-filers → similar-filings

## Day 5 — Distribution prep

1. **Schema.org per page** — Article + DefinedTerm for filing types (LLM-citation per Aleyda Solis 10-characteristic checklist)
2. **OG images** for every page (Satori-generated)
3. **IndexNow integration** in deploy script (per fleet pattern)
4. **AI robots.txt directory submission** (operator-time `[👤]` task)

## Day 6 — AdSense readiness gate

Per `rules/adsense-compliance.md`:
- ✅ /privacy live with cookies + AdSense + GDPR/CCPA disclosure
- ✅ /about + /contact + /terms live
- ✅ ≥10 substantive pages (filing pages count)
- ✅ AdSense verification snippet in `<head>` of every page
- ✅ Cookie consent banner (EU/UK/CA detection)
- ✅ ads.txt placeholder
- ✅ HTTPS valid cert (Cloudflare Pages auto)

## Day 7 — Public ship

1. **Deploy to Cloudflare Pages** (project name: `secfilingdex`, branch: `main`)
2. **Custom domain** — secfilingdex.com pointed to CF Pages (operator-action: DNS at registrar already CF, just wire pages-domain)
3. **AdSense application** submitted
4. **Perplexity Publishers** email submitted (per v19.7 template)
5. **First Wikipedia citation candidate** identified for Week 2-3 operator action
6. **Champion-tier scheduled task** registered (6h cadence) for `/acepilot auto` on this site

## Week 2-4 priorities

- 1,000+ filings indexed
- Filing-diff UX shipped
- LinkedIn framework post by operator (per v19.8 template)
- HARO daily scan (operator)
- Reddit r/SecurityAnalysis + r/investing organic comments (operator)
- AdSense approval → Ezoic Access Now + Impact.com affiliate apply
- Mediavine threshold watch (1,000 sessions/mo)

## Out-of-scope (NOT Day 1-7)

- Custom email digest (defer to Month 2 if D7 retention warrants)
- Stripe / paid tier (no sub-model — this is ad-revenue static-reference)
- Multi-tenant features (archetype mismatch)
- Authentication (no signup; bookmarkable URLs are the retention vector)

## Anti-patterns enforced

Per fleet rules:
- ❌ AI-fabricated filing data (only verified EDGAR sources, every fact cited)
- ❌ Cloaking / doorway / keyword-stuffing (I-26 hard-rejects)
- ❌ Ad density >35% (AdSense policy)
- ❌ Pop-up modals on first interaction (I-23 anti-pattern)
- ❌ Newsletter capture before first value delivered

## State files seeded

- `.claude/state/ARCHETYPE` ✅
- `.claude/state/MODE` ✅
- `.claude/state/IDENTITY.md` ✅
- `.claude/state/BUILD_SPEC.md` ✅ (this file)
- `.claude/state/TASKS.md` ✅ (Day 1 P0 queue)
- `.claude/state/KNOWLEDGE.md` ✅ (verified SEC/EDGAR facts)
- `.claude/state/CONTEXT.md` ✅
- `.claude/state/HEARTBEAT.log` ✅ (empty; populated on first session)
