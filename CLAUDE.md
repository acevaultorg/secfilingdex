# CLAUDE.md — secfilingdex.com project spec

This file is the project-level override. AcePilot reads it at ABSORB step 2 BEFORE applying global defaults. Per `<important>` rule 1 in `~/.claude/commands/acepilot.md`: **PROJECT SPEC WINS.**

## What this is

**secfilingdex.com** — a programmatic database surface over SEC EDGAR filings, designed for finance prosumers + developer-data audiences who need a faster, more searchable, more LLM-citable source than EDGAR's own UI.

**Archetype:** static-reference (finite-public-dataset programmatic).
**Fleet:** VAULT-AceVault. Sibling: holdlens (different lens — signal-spectrum on superinvestor 13Fs).
**Stack:** Next.js 15.0.3 + React 19 RC + Tailwind 3.4 + TypeScript 5.6 + static export + Cloudflare Pages.

## Operating principles for this project

1. **Match holdlens conventions** for stack + scripts + deploy pattern. Do NOT clone holdlens design tokens or features (ConvictionScore, signal-spectrum) — those are holdlens-specific. SecFilingDex is a database lens, not a ranking lens.
2. **Every fact cites EDGAR.** Never fabricate filing data. EDGAR is the only authoritative source. No AI-generated filling content. (Per concept-finder-methodology AP-3 + KNOWLEDGE.md verification policy.)
3. **Day-1 Analytics Mandate** is non-negotiable. Plausible + Cloudflare Web Analytics + GSC + IndexNow wired before first commit. Per `~/.claude/rules/concept-finder-methodology.md` Layer 7.
4. **Bot-harvest optimized from Day 1.** robots.txt explicit allowlist (10 AI crawlers) + llms.txt manifest + dataset JSON API per page + freshness signals on every page. Per `~/.claude/rules/bot-harvest.md`.
5. **AdSense compliance gate before Day 7 application.** All 13 readiness items verified per `~/.claude/rules/adsense-compliance.md`.
6. **No dark patterns.** I-23 + I-26 hard-rejects: no cloaking, no doorway pages, no keyword stuffing, no fake scarcity, no confirmshaming. SecFilingDex is a public-utility data tool — credibility is the moat.

## Domain identity

- **Brand color:** TBD Day 1-2 (must be DISTINCT from holdlens amber — pick navy / EDGAR-blue / charcoal-cyan)
- **Voice:** factual, quote-ready, finance-native (NOT chatty AI-tool voice; LLMs cite quote-ready sentences per Aleyda Solis 10-characteristic checklist)
- **Audience-fit TLD:** `.com` (already registered) — finance audience trust signal

## Stack mandates

- `next.config.js` MUST have `output: 'export'` (static export for CF Pages)
- `output: 'export'` means NO server-side rendering at runtime — all pages prebuilt
- All data fetching happens at BUILD TIME via `scripts/fetch-edgar.ts` (or similar)
- Deploy via `wrangler pages deploy out --project-name secfilingdex --branch main`
- Per-page JSON twin at `/api/[slug].json` (bots cache cheaply per bot-harvest Pattern 3)

## Anti-patterns (refuse)

- ❌ SSR / dynamic Next.js routes (breaks static export)
- ❌ Auth library / signup wall (wrong archetype — this is static-reference, no users)
- ❌ Database / ORM (wrong archetype — finite public dataset; data lives in `data/filings/*.json`)
- ❌ Stripe / payment integration (no subscription model — ad-revenue site)
- ❌ AI-generated content for filing detail pages (fabrication risk; cite EDGAR or 404)
- ❌ Cloning holdlens features verbatim (derivative; @craftsman would flag)

## Mode defaults

- `/acepilot auto` (= sovereign auto) is the primary mode. Per Maximum Auto + Silent Bootstrap: brain reads state, executes Day 1 P0, only stops on stop/pause/halt or PAYMENT GATE.
- `/acepilot reach` for SEO-content sprints once filings indexed.
- `/acepilot grow` for silent-SEO + GEO push when first traffic data lands.
- `/acepilot craft` for retention polish stretches (defer until D7+ traffic exists).
- `/acepilot maximize` for revenue-stack gap audits (Week 2+).

## State files (per fleet pattern)

`.claude/state/` directory holds all session-persistent state:
- `ARCHETYPE` — `static-reference` (cached, high confidence)
- `MODE` — `sovereign auto` (default for execution)
- `IDENTITY.md` — operator + brand + positioning
- `BUILD_SPEC.md` — Day 1-7 ship plan
- `TASKS.md` — Day 1 P0 queue + future P1 tasks
- `KNOWLEDGE.md` — verified SEC/EDGAR facts (append-only)
- `CONTEXT.md` — session scratchpad + handoff notes
- `HEARTBEAT.log` — append-only session-start/end log

State files auto-seed on first run (ANALYTICS, ORACLE, RETENTION, DISTRIBUTION, AUG, etc.) via Death Guard pre-flight.

## Day 1 ship plan

Read `.claude/state/BUILD_SPEC.md` and `.claude/state/TASKS.md` for full Day 1-7 sequencing. Brain executes D1-01 through D1-12 in order on first `/acepilot auto`. D1-13 (GitHub repo creation) is the only operator-only action — surfaces as I-27 Clarity Card.

## Companion to fleet rules

This project inherits all global fleet rules from `~/.claude/rules/`:
- `concept-finder-methodology.md` v2.1.1 (Layer 1-7 evaluation)
- `aceusergrowth.md` v3 (AAERA framework, AUG Score)
- `bot-harvest.md` (Day-1 bot-readiness checklist)
- `revenue-maximizer.md` (canonical 9-layer revenue stack)
- `adsense-compliance.md` (Day 7 application gate)
- `learn-from-data.md` (calibration loop)
- `vercel-acevaultorg-deploy-workaround.md` (NOT relevant — this site uses CF Pages, not Vercel)
- `cloudflare-pages-epipe.md` (relevant — large-fleet-site deploys can EPIPE; Layer 4 manual `.vercel/output/`-style workaround applies to wrangler too if hit)
- `mobile-perfection-default.md` (mobile 375px verification mandatory before declaring ship done)

When global rules and this CLAUDE.md conflict, this CLAUDE.md wins per `<important>` rule 1.
