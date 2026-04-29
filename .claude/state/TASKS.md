# TASKS — secfilingdex.com

**Created:** 2026-04-28
**Mode:** sovereign auto (auto = sovereign auto per v17.3)

## Day 1 P0 (auto-execute on next /acepilot auto)

- [ ] **D1-01** `npm install` Next.js 15.0.3 + React 19 RC + Tailwind 3.4 + TypeScript 5.6 + wrangler `[oracle:$60/wk peak] [reach:+50 vis/wk] [archetype:infrastructure]`
- [ ] **D1-02** `app/layout.tsx` with Plausible + Cloudflare Web Analytics + GSC meta + Organization schema + Day-1 analytics mandate `[archetype:analytics_wiring]`
- [ ] **D1-03** `app/page.tsx` landing — hero + 3-tile feature preview + above-fold positioning (per @craftsman Useful + Clear) `[oracle:$25/wk] [archetype:new_landing_page]`
- [ ] **D1-04** `app/privacy/page.tsx` AdSense-compliant privacy policy (cookies + AdSense disclosure + GDPR/CCPA + contact email) `[archetype:adsense_compliance_gate]`
- [ ] **D1-05** `app/about/page.tsx` operator identity + methodology + LLM-citation E-E-A-T signals `[archetype:llm_citation_design]`
- [ ] **D1-06** `app/contact/page.tsx` real contact email (paulomdevries@gmail.com per fleet convention OR contact@secfilingdex.com if alias set up) `[archetype:adsense_compliance_gate]`
- [ ] **D1-07** `app/terms/page.tsx` Terms of Service stub (recommended for AdSense, not required) `[archetype:adsense_compliance_gate]`
- [ ] **D1-08** `public/robots.txt` AI-allowlist per `rules/bot-harvest.md` Lever 1 (10 crawlers explicit) `[reach:+40 vis/wk] [archetype:robots_txt_ai_allowlist]`
- [ ] **D1-09** `public/llms.txt` manifest per bot-harvest Lever 2 `[reach:+30 vis/wk] [archetype:llms_txt_discoverability]`
- [ ] **D1-10** `public/ads.txt` AdSense placeholder (replace with real publisher ID after Day 7 approval) `[archetype:adsense_compliance_gate]`
- [ ] **D1-11** First `next build` — verify static export to `out/` works `[archetype:infrastructure]`
- [ ] **D1-12** `git init` + `.gitignore` per holdlens pattern + first commit `[archetype:infrastructure]`
- [ ] **D1-13** [👤] **OPERATOR**: create `acevaultorg/secfilingdex` GitHub repo + push first commit (auth-gated, can't auto-create)

## Day 2-7 P1 (queued; auto-execute as Day 1 completes)

- [ ] **D2-01** `scripts/fetch-edgar.ts` SEC EDGAR fetcher (public data, no API key) `[oracle:$80/wk peak] [archetype:original_research_with_dataset]`
- [ ] **D2-02** Index first 100 SEC filings (recent quarter, mixed form types) `[archetype:finite_public_dataset_programmatic]`
- [ ] **D2-03** Filing taxonomy schema in `data/filings/` (10-K / 10-Q / 8-K / 13F / 13D/G / S-1 / Proxy / Form 4) `[archetype:original_research_with_dataset]`
- [ ] **D3-01** `app/filing/[accession]/page.tsx` per-filing programmatic pages `[oracle:$120/wk peak] [reach:+200 vis/wk] [archetype:programmatic_unique_data_page]`
- [ ] **D3-02** `app/filer/[cik]/page.tsx` per-filer index pages `[archetype:programmatic_unique_data_page]`
- [ ] **D3-03** `app/form/[formType]/page.tsx` per-form-type landing pages `[archetype:programmatic_unique_data_page]`
- [ ] **D3-04** Sitemap.xml + sitemap-ai.xml auto-generation `[archetype:sitemap_addition]`
- [ ] **D3-05** JSON API endpoints `/api/filing/[accession].json` per bot-harvest Pattern 3 `[archetype:dataset_json_api]`
- [ ] **D4-01** Search UI (client-side filter) — Useful per @craftsman Day 1 `[archetype:core_loop_improvement]`
- [ ] **D4-02** Filing-diff viz (what changed between filings) — Unique per @craftsman `[archetype:core_loop_improvement]`
- [ ] **D4-03** Per-result share card (1200×630 PNG via Satori) `[reach:+65 vis/wk] [archetype:sharecard_per_result_canvas]`
- [ ] **D4-04** Internal-linking hub-spoke `[archetype:internal_linking_hub_spoke]`
- [ ] **D5-01** Schema.org per page (Article + DefinedTerm + Dataset) `[archetype:schema_markup_article_person_org]`
- [ ] **D5-02** OG images per page (Satori) `[archetype:llm_citation_design]`
- [ ] **D5-03** IndexNow integration in `npm run deploy` `[archetype:indexnow_autoping_every_deploy]`
- [ ] **D5-04** [👤] **OPERATOR**: ai.robots.txt directory submission (one-time PR per v19.9 template `~/.claude/acepilot-19.9/templates/ai-robots-txt-registration.md`)
- [ ] **D6-01** AdSense readiness gate verification (all 13 items per `rules/adsense-compliance.md`)
- [ ] **D6-02** AdSense verification snippet in `<head>` of all pages `[archetype:adsense_compliance_gate]`
- [ ] **D6-03** Cookie consent banner (EU/UK/CA detection) `[archetype:adsense_compliance_gate]`
- [ ] **D7-01** Cloudflare Pages deploy via wrangler (project: `secfilingdex`, branch: `main`)
- [ ] **D7-02** [👤] **OPERATOR**: point secfilingdex.com → CF Pages project (DNS already at CF; just custom-domain wiring in dashboard)
- [ ] **D7-03** [👤] **OPERATOR**: AdSense application submission (per v19.9 template `adsense-application.md`)
- [ ] **D7-04** [👤] **OPERATOR**: Perplexity Publishers email (per v19.7 template `perplexity-publishers-email.md`)
- [ ] **D7-05** Register `pilot-secfilingdex` scheduled task (6h Champion cadence per v19.3 data-driven tiering)

## Operator-only tasks (queue silently in `auto c` mode; surface in `auto operator tasks`)

- [👤] OP-01 Create acevaultorg/secfilingdex GitHub repo (https://github.com/organizations/acevaultorg/repositories/new) — ~2 min
- [👤] OP-02 Wire secfilingdex.com → Cloudflare Pages project after Day 7 deploy — ~5 min
- [👤] OP-03 AdSense application Day 7 (~15 min one-time)
- [👤] OP-04 Perplexity Publishers email (~5 min, template ready)
- [👤] OP-05 ai.robots.txt directory PR (~10 min, template ready)
- [👤] OP-06 LinkedIn framework post Week 2 (per `linkedin-framework-post.md` template)
- [👤] OP-07 Wikipedia citation Week 3-4 candidate (per `wikipedia-citation-add.md` template, requires ≥10 prior edits warm-up account)

## Notes

- All Day 1 P0 tasks auto-execute in `sovereign auto` mode (no operator gates except payment + repo creation)
- Per Maximum Auto (I-42): no per-task confirmation; brain executes through full Day 1 in one session
- Per Silent Bootstrap (I-41): no archetype-detection / concept-narrowing prompts (already inferred + cached)
- Per Day-1 Analytics Mandate: Plausible + GSC + Cloudflare Web + IndexNow wired before D1-13 commit
- Per Bot Harvest: robots.txt allowlist + llms.txt + freshness signals all Day 1
- Day 1 budget: ~3-4 hours of brain time (Easy-tier replay of holdlens playbook structure)
