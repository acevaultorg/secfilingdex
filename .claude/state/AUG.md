# AUG.md — secfilingdex.com (AUG v3 Score log)
# Schema: v1 per rules/aceusergrowth.md v3 Part 25
# Append-only · Archive @100 lines · I-35 enforced
# Read at ABSORB step 13g (every Pro-mode session)

## Status

live (since 2026-04-28; ~14 days post-launch as of 2026-05-12)

## Weekly Score v3

| date | acq | act | eng | ret | adv | mon | perf | AUG_v3 | WoW delta | top weakness |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 2026-05-12 | 1 | 4 | 5 | 2 | 1 | 1 | 8 | 1.7 | initial | acquisition (early-stage; SEO compound month 1) |

## Score derivation (2026-05-12)

| stage | score | basis |
|---|---:|---|
| Acquisition | 1 | <500 UV/30d (early-stage; per `~/.claude/fleet/FLEET_METRICS_DATA/` snapshots — refresh weekly) |
| Activation | 4 | Search → filing-detail flow exists; first-session value delivery via /learn entry-page is strong, but no measured activation funnel yet |
| Engagement | 5 | 4 Clarity custom events firing (search, edgar_outbound, learn_75, pageviews); sitemap 705 URLs with deep internal linking |
| Retention | 2 | Pre-baseline; Clarity returning_session not yet calibrated; reference-site retention naturally low (one-shot lookups) |
| Advocacy | 1 | No share-card feature yet (vs holdlens's SignalShareCard); k-factor ~0 |
| Monetization | 1 | $0/wk (AdSense not_started per MONETIZATION_STACK.md; CF Pay-Per-Crawl available but no payout setup yet) |
| Performance | 8 | Static export + CF Pages edge + Tailwind 3 + system fonts → LCP <1.5s estimated; CLS <0.05; INP <100ms (system-font stack, no heavy JS) |

AUG_v3 = (1 × 4 × 5 × 2 × 1 × 1 × 8)^(1/7) ÷ 10 × 10 = ~1.7

## Notes

- AUG 1.7 is LOW but consistent with month-1 silent-SEO compound trajectory. Per `rules/funnel-order-discipline.md`: this site is in ACQUISITION stage; monetization-layer work is mathematically gated (revenue ceiling at current UV is <€20/mo). Brain SHOULD continue acquisition-compound work (more programmatic substantive content + /learn corpus expansion + LLM-citation 10-characteristic gap-closure).
- I-35 floor: AUG 1.7 < 5 → counts toward "2 consecutive weeks below 5" trigger. NEXT_AUDIT_DATE: 2026-05-19 (~1 week from now). If still <5, I-35 floor breach triggers diagnostic dispatch (@reviewer + @craftsman + @distributor + @strategist).
- BUT: per CSIL #29 funnel-order math floor + per acquisition-stage silent-SEO trajectory, sub-5 AUG at month 1-2 is NORMAL for finite-public-dataset static-reference sites. Honor the 6-12 month compound window per rules/concept-finder-methodology.md v2.0.
- Top brain-doable improvements (queued for next iterations):
  1. Add SignalShareCard-equivalent (per-result share image) → +advocacy (V1 k-factor)
  2. Expand /learn corpus from 8 → 20 articles → +acquisition long-tail
  3. Add CF Pay-Per-Crawl toggle when operator sets payout → +monetization Layer 2

## I-35 Floor Tracker

| consecutive_weeks_below_5 | last_check | status |
|---:|---|---|
| 1 | 2026-05-12 | first week below — within-tolerance for month-1 acquisition stage |

## Corrections

(None yet.)

## 2026-08-26 — EDGAR depth pass + sitemap fix (Acquisition/Discover lever)

Cross-session effort (multiple parallel autopilot sessions, reconciled via git):
- Deepened all 352 pre-existing filers via SEC `data.sec.gov/submissions/CIK*.json`
  (1 call/filer, 200ms throttle, identifying UA). Filing corpus 434 -> 11,227 records
  (capped 40/filer, 8/form-type, diversity-prioritized — bounded, not scaled-thin).
- 325/352 filers (92.3%) now cross `filerProfileIsSubstantive()` (>=3 filings, >=2
  form types) -> auto-flipped `noindex` -> `index, follow` with zero code changes to
  the gate itself (Appalachian Power: 186w/1 filing -> 2,352w/41 filings; General
  Mills: 184w -> 2,789w).
- Fixed a real build-bloat risk found along the way: per-filing OpenGraph-image
  render (11,227 renders for pages that are `noindex`) disabled — cut `out/` from
  2.2GB/48,422 files to 936MB/35,197.
- Fixed a real discoverability gap: `generate-sitemap.mjs` still hard-excluded ALL
  `/filer/[cik]` pages (stale pre-depth-pass comment) even after 325 of them flipped
  to index-eligible at the page level. Wired the same substantive gate into the
  sitemap generator (matches the existing `/industry/` MIN_FILINGS_FOR_INDEX
  pattern). sitemap.xml: 173 -> 498 URLs.
- Pruned RSC `.txt` prefetch payloads + per-filing JSON API twins from the deploy
  bundle to fit Cloudflare Pages' 20,000-file/deployment cap (12,211 files shipped).
  KNOWN LIMITATION: the "Machine-readable JSON twin" link on `/filing/[accession]/`
  pages (themselves noindex, internal-nav-only) now 404s — narrow UX defect,
  documented, not yet fixed (would need R2/KV-hosted JSON or a further filing cap).
- Deployed via chunked uploader (bare wrangler EPIPEs past ~56MB/connection).
  Live: https://secfilingdex.com — verified 200, sitemap 498 URLs, 2 sampled
  filers confirmed flipped live.
- IndexNow ping: 498 URLs, 200/200/202 across api.indexnow.org / bing.com /
  yandex.com. Bing is the live click channel here (71 clicks/0.82% CTR vs 5
  Google per the task's fleet-data snapshot) — this ping IS the practical
  equivalent of a WMT sitemap resubmit; no Bing WMT API key or Chrome MCP
  available in-session to also do the dashboard action.
- Expect: GSC/Bing click lift lags indexing by days-weeks — not measurable
  this session. Re-check `gsc_clicks_30d` against the 24,215 impression pool
  in a future session.
