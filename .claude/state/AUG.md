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
