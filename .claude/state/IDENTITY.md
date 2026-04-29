# IDENTITY — secfilingdex.com

**Created:** 2026-04-28
**Operator:** Paulo de Vries (paulomdevries@gmail.com)
**Domain:** secfilingdex.com (Cloudflare-registered 2026-04-28, ~€9.59/yr)
**Archetype:** static-reference (finite-public-dataset programmatic)
**Fleet:** AceVault 260426 (sibling to holdlens, fermentcalc, sourcescore, readinglist)
**Build tier:** Easy (2-3 days holdlens-playbook replay)

## What this site is

The **dex** of SEC filings — a programmatic database surface over EDGAR data, designed for finance prosumers + developer-data audiences who need a faster, more searchable, more LLM-citable source than EDGAR's own UI.

**One-line positioning:** "EDGAR's database, modernized."

## Who it serves

- **Finance prosumer** — analyst, fund manager, retail investor wanting filing data without EDGAR's 1990s UX
- **Developer / data-engineer** — building tools that need structured SEC filing access
- **LLM/AI agent** — citation-grade structured data for retrieval-augmented answers

Audience overlap with holdlens.com (sibling) but DIFFERENT lens:
- **holdlens** = signal-spectrum on superinvestor 13Fs (composite ConvictionScore, ranking lens)
- **secfilingdex** = comprehensive filing-database lens (search, lookup, programmatic SEO across filing types)

Not competing with holdlens — complementary. Both can citation-link each other.

## Brand identity

- **Name:** SecFilingDex (one word, brandable)
- **Tagline (draft):** "Every SEC filing, indexed."
- **Voice:** factual, quote-ready, finance-native (NOT chatty AI-tool voice)
- **Color identity (draft):** dark-mode-first, navy + white + EDGAR-blue accent (distinct from holdlens amber)
- **Visual identity:** decided during Day 1-2 ship; @craftsman gates first public ship

## Differentiator (Moat Test per concept-finder-methodology v2.1)

1. **Original-synthesis vs raw republish?** YES — composite indexing across filing types (10-K + 10-Q + 8-K + 13F + S-1 + proxies) with cross-filer relationship graph. EDGAR is raw.
2. **Maintenance requires editorial judgment?** YES — taxonomy of filing types, "what changed" diffs between filings, anomaly flagging.
3. **Compounds on accumulated history?** YES — filing-history depth grows with every quarter; longitudinal data is the moat.
4. **Brand/identity signal clone-can't-replicate?** Medium — operator's existing AcePilot fleet brand + Person schema + corroboration across holdlens + LinkedIn = moat in 6 months.

**Moat score: 0.75** (passes I-26 floor easily).

## Revenue model

- **Layer 1: AdSense** — finance-vertical RPM $15-30
- **Layer 2: Cloudflare Pay-Per-Crawl** — bot-traffic monetization (LLM crawlers love SEC data)
- **Layer 3: llms.txt + schema** — autonomous LLM-citation amplifier
- **Layer 5: Ezoic Access Now** — post-AdSense parallel
- **Layer 7: Mediavine Journey** — atomic swap when crossing 1,000 sessions/mo (per I-37)
- **Defer:** Layer 6 affiliate (limited fit; finance is regulated), Layer 8 TollBit (Month 6+)

**Y1 projection (cold-start):** $40-150/wk peak by Month 6, scaling toward $300-800/wk peak by Month 12 if SERP capture goes per pattern.

## Build approach

Follow holdlens-playbook (Easy-tier, 2-3 days to first public ship) BUT with secfilingdex's own design identity. Do NOT clone holdlens design tokens, ConvictionScore feature, or 13F-superinvestor angle. SecFilingDex is broader and more database-shaped.

## Stack

- **Framework:** Next.js 15.0.3 + React 19 RC (matches fleet)
- **Styling:** Tailwind 3.4
- **Type:** TypeScript 5.6
- **Output:** Static export (`output: 'export'`)
- **Deploy:** Cloudflare Pages via wrangler
- **Data source:** SEC EDGAR (https://www.sec.gov/edgar — public, no API key required for filings index)
- **Analytics:** Plausible + Cloudflare Web Analytics + Google Search Console + GA4 (Day 1 mandate per `rules/concept-finder-methodology.md` Layer 7)
- **OG images:** Satori (matches fleet pattern)
- **AdSense:** Day 7 application after compliance gate

## Domain notes

- secfilingdex.com registered Cloudflare 2026-04-28
- Companion considered: thesecfilings.com (defensive `.com` for SEO phrase preservation) — operator can decide later
- Current operator owns secfilings.io as adjacent property; secfilingdex.com is the upgrade pick per session ranking

## Next session pickup

When operator runs `/acepilot auto` from this folder, brain reads ARCHETYPE = static-reference + MODE = sovereign auto + this IDENTITY + BUILD_SPEC + TASKS, executes Day 1 P0 immediately. No bootstrap prompts needed.
