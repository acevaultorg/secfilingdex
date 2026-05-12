# MONETIZATION_STACK.md — secfilingdex.com

**Schema:** v19.5 (2026-04-21 canonical 9-layer revenue stack)
**Canonical reference:** `~/.claude/rules/revenue-maximizer.md`
**Archetype:** static-reference (SEC EDGAR filings programmatic database)
**Append-on-change only** (except Current Stack status cell updates).
**Initialized:** 2026-05-06 (cluster-root brain canonicalization Session 24).

## Current Stack

| Layer | Name | Status | Activated | Projected $/mo | Actual $/mo | Notes |
|---|---|---|---|---:|---:|---|
| 1 | AdSense | not_started | — | $10-30 (cold-start; finance vertical RPM) | - | Snippet code presumed scaffolded in `app/layout.tsx` (operator-shipped Apr 28). No env var set yet in CF Pages. AdSense readiness gate: site has /privacy + /about + /terms + /contact (all 200) → passes per `rules/adsense-compliance.md`. Operator submits site-application at adsense.google.com. |
| 2 | Cloudflare Pay-Per-Crawl | waitlisted | 2026-05-06 (operator beta application submitted) | $0-5 (low bot volume currently) | - | Per fleet/LEARNED.md ## 2026-05-06 AI-Crawler Audit: secfilingdex 14 unique IPs, 86% bot ratio (mostly ClaudeBot 12) — under-indexed compared to txtfeed (51k crawls). 420 AI crawls/30d. PPC application submitted; covers secfilingdex implicitly via account-level approval. |
| 3 | llms.txt + schema + AI allowlist | active | 2026-04-29 (~) | — (indirect) | — | v19.4 autowired bot-harvest. Schema.org Article + Person + Organization + DefinedTerm markup per page (verified per recent commits "8fe1330 feat(about): live-stats + DefinedTerm schemas + Organization schema for LLM-citation"). Comprehensive /learn corpus (10+ explainers) is LLM-citation-optimized. |
| 4 | Perplexity Publishers Program | not_started | — | $5-30 | - | High citation-fit content (SEC filing explainers — DEF 14A, 20-F, S-3, 10-K, 13F, etc.). Defer until ≥500 UV/30d. Currently <14 UV. |
| 5 | Ezoic Access Now | not_started | — | $30-80 | - | Wraps AdSense. Surfaces post-AdSense approval. |
| 6 | Affiliate (Bookshop.org per I-38) | not_eligible_archetype | — | n/a | - | secfilingdex is SEC filings reference, not book content. No natural Bookshop fit. Defer to other affiliate (broker affiliate? same as HoldLens — `NEXT_PUBLIC_AFF_*` pattern? — Y1 evaluation). |
| 7 | Mediavine Journey | not_eligible | — | $12-19 RPM × traffic | - | Sessions <1k/mo. `mediavine-promotion-detector` auto-fires Clarity Card at 1k threshold. I-37 atomic swap enforced. |
| 8 | TollBit | not_started | — | $0-5 | - | Defer to Month 6+. Bot volume needs to grow for TollBit minimums. Per current 420 crawls/30d, not viable. |
| 9 | ProRata.ai Gist Answers | not_started | — | $5-15 | - | Defer to Month 6+. |

### Site-specific extensions (outside canonical 9)

| Tier | Name | Status | Activated | Projected $/mo | Actual $/mo | Notes |
|---|---|---|---|---:|---:|---|
| API | secfilingdex API access (citation-grade structured-data) | listed_not_priced | — | TBD | $0 | Per homepage description: "Comprehensive indexing... cross-filer relationship graph and citation-grade structured-data API." Premium paid API tier candidate. Defer until ≥10 inbound API inquiries. |
| Broker | Broker affiliate (HoldLens-style) | candidate | — | TBD | $0 | Filing-pages have natural broker-CTA placement opportunity (when filing → trader sees → wants to act). Reuse HoldLens `BrokerCta` + `AffiliateCTA` components per same `NEXT_PUBLIC_AFF_*` env vars. Y1 evaluation post-traffic-ramp. |

## Layer Activations (append-only)

| timestamp | layer | event | details |
|---|---|---|---|
| 2026-04-29 (~) | 3 | activated | llms.txt + schema + robots.txt AI allowlist live (v19.4 autowired) |
| 2026-04-30 | API | listed | API tier listed in homepage meta-description; no pricing yet |
| 2026-05-06 | 2 | application_submitted | CF Pay-Per-Crawl beta application submitted via Chrome MCP; secfilingdex covered alongside holdlens + txtfeed via account-level approval |
| 2026-05-06 | meta | gitlab_migration | Repo migrated from `acevaultorg/secfilingdex` (GitHub) to `acevault-lab/secfilingdex` (GitLab project id 81960305). CF Pages deploy still via `wrangler pages deploy out --project-name secfilingdex` CLI direct-upload (not auto-deploy yet). |
| 2026-05-06 | meta | mon_stack_initialized | cluster-root brain initialized this file |

## Swap History (atomic, I-37 enforced)

| timestamp | removed_layers | added_layer | reason |
|---|---|---|---|
| — | — | — | No swaps yet. |

## Pending Operator Clarity Cards

1. 🟢 **AdSense site application** (~5 min) — submit secfilingdex.com at adsense.google.com. 2-14 day review.
2. 🟢 **Wire NEXT_PUBLIC_ADSENSE_CLIENT** env var in CF Pages dashboard (post-approval) — value `ca-pub-7449214764048186`.
3. 🟢 **Perplexity Publishers email** — defer until ≥500 UV/30d.
4. 🟢 **Mediavine Journey threshold** — automated; brain fires Clarity Card at 1k UV/30d.
5. 🟢 **API monetization decision** — Y1+: design pricing tiers + Stripe integration if ≥10 inbound inquiries land.
6. 🟢 **Broker affiliate evaluation** — Y1+: reuse HoldLens BrokerCta + same env vars; insert on filing pages with strong trade-intent context.

## Calibration linkage

- `.claude/state/ARCHETYPE` = static-reference (confidence 0.95)
- `.claude/state/CONTEXT.md` (if exists)
- `REVENUE_CALIBRATION.md` — pending (no real revenue yet)

## Corrections

(timestamp-anchored per I-39 append-only pattern. None yet.)
