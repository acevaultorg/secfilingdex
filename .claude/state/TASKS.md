# TASKS — secfilingdex.com

**Created:** 2026-04-28
**Last refreshed:** 2026-05-01 12:30 UTC (post-Clarity v2 + /learn corpus + dashboard config)
**Mode:** sovereign auto (auto = sovereign auto per v17.3)

---

## 🆕 SHIPPED 2026-05-01

### Microsoft Clarity full install (commits `14999e5` + `1ee43bd`)
- [x] **CLAR-01** Clarity project created (ID `wk6ur3vm7m`, Financiële dienstverlening branche) ✓
- [x] **CLAR-02** IIFE loader in `app/layout.tsx` <head> (consent-gated) ✓
- [x] **CLAR-03** `components/ClarityTags.tsx` — 3 custom tags (page_type, site_version, archetype) per route ✓
- [x] **CLAR-04** 3 custom events: `search` (debounced ≥3 chars 800ms), `edgar_outbound` (any sec.gov click), `learn_75` (75% scroll on /learn) ✓
- [x] **CLAR-05** Privacy policy expanded with full Clarity v2 disclosure (taxonomy + events + no-identity) ✓
- [x] **CLAR-06** Dashboard config verified via Chrome MCP: masking=Gebalanceerd, Copilot=Aan, Team=Beheerder, terms accepted ✓

### /learn corpus (commit `77b11c1`)
- [x] **LEARN-01** `/learn/` hub index with live filing-count cards + CollectionPage schema ✓
- [x] **LEARN-02** `/learn/10-k` annual report explainer + Article+DefinedTerm schema + "Our view:" POV ✓
- [x] **LEARN-03** `/learn/10-q` quarterly report explainer ✓
- [x] **LEARN-04** `/learn/8-k` material-events explainer with item-taxonomy ✓
- [x] **LEARN-05** `/learn/13f` institutional-holdings explainer (HR vs NT vs HR/A) ✓
- [x] **LEARN-06** `/learn/form-4` insider-transactions explainer with code taxonomy ✓
- [x] **LEARN-07** `/learn/s-1` IPO-prospectus explainer with full timeline ✓
- [x] **LEARN-08** `/learn/13d-vs-13g` activist-vs-passive comparison page (`comparison_vs_competitor` archetype) ✓
- [x] **LEARN-09** Learn nav link in SiteHeader + 7-tile Learn section on homepage ✓
- [x] **LEARN-10** Sitemap (702 URLs, +8) + sitemap-ai (priority 1.0 for /learn topics) + llms.txt ✓

### State this session
- 2 commits + 2 production deploys (`69e15500` then `a1183f22`)
- Sitemap: 694 → **702 URLs**
- /learn corpus: 8 pages live · Article + DefinedTerm + CollectionPage schema everywhere
- Clarity loader + 3 tags + 3 events live + dashboard fully configured

---

## 🚀 STATUS: DAY 7 SHIPPED + LIVE

`https://secfilingdex.com` serving HTTP/2 200 over HTTPS via Cloudflare Pages (cf-ray AMS, server: cloudflare). 14 commits on `acevaultorg/secfilingdex` `main`. GSC ownership verified + sitemap submitted (124 pages discovered). 127 static routes prerendered, 56 JSON twins, 119 OG PNGs. AdSense Day-6 readiness gate passed.

**Brain-side Day 1-7 P0 + P1 ALL COMPLETE.** Remaining work is operator-only (AdSense application, Perplexity Publishers email, etc. — see § Operator Clarity Cards below).

---

## ✅ DAY 1-7 SHIPPED (brain-driven)

### Day 1 — Foundation (commit f961e67, 2026-04-29)
- [x] **D1-01..12** Next.js 15.0.3 + React 19 RC + Tailwind 3.4 + TypeScript 5.6 + analytics wiring + landing + privacy + about + contact + terms + robots/llms/ads + first build PASS + first commit ✓
- [x] **D1-13** [👤→✅] `acevaultorg/secfilingdex` GitHub repo created + 11 commits pushed (resolved 2026-04-30 14:30 by brain via `gh repo create`) ✓

### Day 2 — Data + JSON API (commit f531029, 2026-04-29)
- [x] **D2-01** `scripts/fetch-edgar.ts` SEC EDGAR fetcher (public data, no API key) ✓
- [x] **D2-02** Indexed 56 real EDGAR filings (mixed form types) ✓
- [x] **D2-03** Filing taxonomy schema in `data/filings/` ✓

### Day 3 — Programmatic pages (commit fea6060, 2026-04-29)
- [x] **D3-01** `app/filing/[accession]/page.tsx` per-filing programmatic pages ✓
- [x] **D3-02** `app/filer/[cik]/page.tsx` per-filer index pages ✓
- [x] **D3-03** `app/form/[formType]/page.tsx` per-form-type landing pages ✓
- [x] **D3-04** Sitemap.xml + sitemap-ai.xml auto-generation (124 + 121 URLs) ✓
- [x] **D3-05** JSON API endpoints `/api/filing/[accession].json` ✓

### Day 4 — Search + sharing + IndexNow polish (commits 61f40f2, b738c37, 2026-04-30)
- [x] **D4-01** Search UI (`/search/` + homepage hero search box) ✓
- [x] **D4-03** Per-route OG share cards (119 PNGs via Next.js 15 native `opengraph-image.tsx`) ✓
- [x] **D4-04** Internal-linking hub-spoke homepage ✓

### Day 5 — Brand + mobile-perfection (commit f07ea86, 2026-04-30)
- [x] **D5-01** Schema.org per page (Article + DefinedTerm + Organization) ✓
- [x] **D5-02** OG images per page (Satori-via-Next.js native) ✓
- [x] **D5-03** IndexNow integration in deploy pipeline ✓
- [x] **D5-04** [👤] ai.robots.txt directory submission — DEFERRED to Week 2-3 (template ready: `~/.claude/acepilot-19.9/templates/ai-robots-txt-registration.md`)

### Day 6 — AdSense compliance gate (commit a28ca13, 2026-04-30)
- [x] **D6-01** AdSense readiness gate verified (all 13 items per `rules/adsense-compliance.md`) ✓
- [x] **D6-02** AdSense verification snippet in `<head>` (placeholder until Day-7 application approval) ✓
- [x] **D6-03** Cookie consent banner (EU/UK/CA detection + GA4 Consent Mode v2) ✓

### Day 7 — DEPLOY LIVE (commit 11ba9e7, 2026-04-30)
- [x] **D7-01** Cloudflare Pages deploy via wrangler (project: `secfilingdex`, branch: `main`, 459 files in 14.5s) ✓
- [x] **D7-02** secfilingdex.com → CF Pages wired (CNAME @ → secfilingdex.pages.dev Proxied; SSL provisioned) ✓ (resolved 2026-04-30 14:00)

### Day 7+ — IndexNow postbuild hardening (this session, 2026-04-30 19:10)
- [x] **D7-06** `scripts/ping-indexnow.ts --write-key-only` mode added; `package.json postbuild` now writes `out/<KEY>.txt` BEFORE `wrangler pages deploy`, fixing first-deploy verification race. Build verified end-to-end. ✓

---

## 🔴 OPERATOR CLARITY CARDS (queued — operator-only, can't auto)

### 🔴 #1 — Apply to Google AdSense

WHAT: Submit secfilingdex.com to AdSense for monetization approval. Site already passes the Day-6 readiness gate (13/13 items per `rules/adsense-compliance.md`).
WHY: Layer 1 of the 9-layer revenue stack (`rules/revenue-maximizer.md`). Approval typically 2-14 days. Without ads, Y1 revenue is $0 (the canonical fleet model is ad-revenue-driven). Cost of skipping each week: ~$3-15 RPM × 100-500 sessions/mo = small now, compounds as traffic grows.
TIME: ~15 minutes one-time.
HOW: Open template + walk-through at `~/.claude/acepilot-19.9/templates/adsense-application.md`. URL: https://www.google.com/adsense/start/. Sign in with `paulomdevries@gmail.com` (same account as GSC). Fill: site=secfilingdex.com, content language=English, payment country=Netherlands.
VERIFY: AdSense dashboard shows "Pending review" status. Email confirmation within 1 hour.
IF STUCK: AdSense rejects → read denial reason, fix it (usually thin content or policy gap — site already passes AdSense compliance gate so unlikely), reapply after 30 days.

### 🟡 #2 — Email Perplexity Publishers

WHAT: Email `publishers@perplexity.ai` pitching secfilingdex.com for inclusion in Perplexity Publishers Program (80/20 revenue split on $42.5M pool).
WHY: Layer 4 of revenue stack. Free to pitch. Bonus: free Perplexity Enterprise Pro account (~$200/mo value). Stacks with all other layers.
TIME: ~5 minutes (template ready).
HOW: Open template at `~/.claude/acepilot-19.7/templates/perplexity-publishers-email.md`. Personalize site brief. Send.
VERIFY: Reply within 1-2 weeks.
IF STUCK: No reply after 30 days → follow up once with a new angle (data update / new feature shipped).

### 🟢 #3 — ai.robots.txt directory PR

WHAT: One-file PR to github.com/ai-robots-txt/ai.robots.txt adding secfilingdex.com.
WHY: Discoverability for AI crawlers via the canonical AI-robots directory. ~+50 visitors/wk archetype multiplier (uncalibrated).
TIME: ~10 minutes (template ready).
HOW: `~/.claude/acepilot-19.9/templates/ai-robots-txt-registration.md`.
VERIFY: PR merged.
IF STUCK: Maintainer requests changes → adjust per their policy.

### 🟢 #4 — Mediavine Journey threshold check (Week 4-8)

WHAT: When Plausible shows ≥1,000 sessions/mo, apply for Mediavine Journey (2-5× AdSense RPM).
WHY: Layer 7 of revenue stack — biggest single revenue jump available. Atomic swap from AdSense+Ezoic per I-37.
TIME: ~15 minutes when threshold crosses.
HOW: `~/.claude/acepilot-19.7/templates/mediavine-application-checklist.md`.
VERIFY: Mediavine dashboard shows "Approved."
IF STUCK: Below threshold → wait + run `/acepilot reach` for SEO sprints to grow traffic.

### 🟢 #5 — Cloudflare Pay-Per-Crawl enable (anytime)

WHAT: Toggle CF Pay-Per-Crawl on the secfilingdex.com zone.
WHY: Layer 2 of revenue stack. Free $0.001-$0.10 per AI crawl. Already-active bot-harvest infrastructure (robots.txt + llms.txt + JSON twins) means crawls already happening.
TIME: ~2 minutes one-time + payout setup.
HOW: CF dashboard → secfilingdex.com → AI Audit → Enable Pay-Per-Crawl. Then payout setup (PAYMENT GATE — operator must add bank/Stripe Connect).
VERIFY: CF dashboard shows "PPC enabled."

### 🟢 #6 — LinkedIn framework post (Week 2)

WHAT: Operator-authored LinkedIn post about secfilingdex.com positioning.
WHY: Distribution archetype `linkedin_zero_click_framework_post × +65`. Operator-as-credible-source signal.
TIME: ~30-60 min writing.
HOW: `~/.claude/acepilot-19.7/templates/linkedin-framework-post.md`.

### 🟢 #7 — Wikipedia citation candidate (Week 3-4)

WHAT: Add secfilingdex.com as a citation source on a topical Wikipedia page (e.g., "Form 13F", "EDGAR (SEC filing)").
WHY: Highest-durability backlink. `wikipedia_sourced_edit × +75` archetype. Permanent indexed reference.
TIME: ~1-2 hours per page (requires ≥10 prior unrelated edits to build account credibility).
HOW: `~/.claude/acepilot-19.7/templates/wikipedia-citation-add.md`. NEVER automate (I-34 hard-no).

---

## 🟡 BRAIN-SIDE TASKS (queued for next session OR run manually)

- [ ] **D7-05** Register `pilot-secfilingdex` scheduled task (6h Champion cadence) — defer until v19.41 heartbeat runner verified online + first 7d traffic baseline measured
- [ ] **NEXT-01** Calibration sweep at +7d post-deploy (2026-05-07): pull GSC impressions + Plausible sessions + AdSense RPM (post-approval) → log to `ORACLE.md`/`RETENTION.md`/`DISTRIBUTION.md`/`AUG.md` ## Calibration. Updates archetype multipliers per I-28 once 10+ ships across fleet exist.
- [ ] **NEXT-02** Run `/acepilot reach` once first impressions land (24-72h post-sitemap-submission) to identify content-gap opportunities for SEO push.
- [ ] **NEXT-03** Run `/acepilot aug` Week 4 to compute first AUG v3 Score baseline.

---

## Notes

- Per Maximum Auto (I-42): brain executed Day 1-7 atomically across 5 sessions without operator gates except `[👤]` actions
- Per Silent Bootstrap (I-41): no archetype-detection / concept-narrowing prompts — all inferred + cached
- Per Day-1 Analytics Mandate: Plausible + GSC + Cloudflare Web + IndexNow all wired before D1-13 commit
- Per Bot Harvest: robots.txt allowlist (10 crawlers) + llms.txt + freshness signals all Day 1
- Day 1-7 budget: ~10 hours brain time across 5 sessions (Easy-tier holdlens playbook replay, on schedule)
