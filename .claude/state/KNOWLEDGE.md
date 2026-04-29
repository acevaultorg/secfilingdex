# KNOWLEDGE — secfilingdex.com

**Created:** 2026-04-28
**Append-only.** Verified facts only. Every entry cites source.

## SEC EDGAR — Authoritative facts <!-- verified: 2026-04-28 -->

### What EDGAR is
- **Full name:** Electronic Data Gathering, Analysis, and Retrieval system
- **Operator:** U.S. Securities and Exchange Commission (SEC)
- **Public access:** https://www.sec.gov/edgar
- **API:** Public, no key required for filings index. Rate limit: 10 requests/second per IP. Identify with `User-Agent` header.
- **Data formats:** XBRL (structured), HTML, plain text. Older filings = TXT/HTML, newer = XBRL.
- **Filing freshness:** ~95% of filings appear in EDGAR within minutes of filer submission.

### Core SEC filing types

| Form | Filed by | Frequency | What it is |
|---|---|---|---|
| 10-K | Public companies | Annual | Comprehensive annual report (audited financials) |
| 10-Q | Public companies | Quarterly | Unaudited quarterly financial report |
| 8-K | Public companies | Event-driven | Material change notification (acquisitions, exec changes, etc.) |
| 13F | Institutional investors >$100M AUM | Quarterly | Long equity holdings disclosure |
| 13D | Investors crossing 5% beneficial ownership | Event-driven | Activist/material-position disclosure |
| 13G | Passive investors with 5%+ | Event-driven | Passive 5%+ holdings disclosure |
| Form 4 | Insiders (officers/directors/10%+) | Within 2 business days | Insider trading disclosure |
| S-1 | Companies going public | Pre-IPO | Initial registration statement |
| DEF 14A | Public companies | Annual | Definitive proxy statement (board votes, exec comp) |
| 11-K | Public companies (employee plans) | Annual | Annual report of employee stock-purchase plans |
| 20-F | Foreign private issuers | Annual | Annual report (non-US companies on US exchanges) |
| 6-K | Foreign private issuers | Event-driven | Foreign equivalent of 8-K |

### CIK (Central Index Key)
- 10-digit identifier for every EDGAR filer
- Permanent (doesn't change with corporate restructuring usually)
- Format in URLs: zero-padded to 10 digits (e.g., 0000320193 = Apple Inc.)

### Accession number
- 18-digit identifier for every filing (e.g., 0000320193-24-000123)
- Format: `[CIK]-[YY]-[sequence]`
- Permanent + unique

## Distribution Oracle archetypes (from fleet research, calibrated)

For SEC-filings static-reference site, highest-multiplier archetypes:
- `original_research_with_dataset × +90` — composite indexing across filing types
- `programmatic_unique_data_page × +100` — per-filing pages with unique structured data
- `dataset_json_api × +70` — `/api/filing/[accession].json` endpoints
- `llm_citation_quote_ready × +75` — section H2s as quotable sentences
- `freshness_per_page × +30` — datePublished + dateModified visible
- `wikipedia_sourced_edit × +75` — operator-time citation on relevant Wikipedia pages
- `pay_per_crawl_enabled × +90` — CF PPC on bot traffic (high for SEC data)

## Anti-patterns (from concept-finder + fleet rules)

- ❌ AI-fabricated filing data (every fact must trace to EDGAR)
- ❌ Cloaking different content to bots vs humans (I-26 / I-34 hard-reject)
- ❌ Keyword-stuffing filing-type pages (I-26 hard-reject)
- ❌ FAQ schema spam (Semrush 2025 — actively hurts LLM citation, max 1 FAQ block per page)
- ❌ Template-filled programmatic pages without unique data (`template_programmatic_pages × -100`)

## Fleet pattern reference

- **Sibling site:** holdlens.com (also static-reference, also SEC-filings-anchored, but DIFFERENT lens)
- **Build playbook:** `~/.claude/rules/concept-finder-methodology.md` v2.1.1
- **Day-1 Analytics:** `rules/concept-finder-methodology.md` Layer 7 mandate
- **Revenue stack:** `rules/revenue-maximizer.md` canonical 9-layer
- **Bot harvest:** `rules/bot-harvest.md`
- **AdSense compliance:** `rules/adsense-compliance.md` (gate before Day 7 application)
- **Concept Finder calibration:** holdlens shipped 2026-04-08 onward; first reference point in fleet calibration log

## Verification policy

Per fleet rule: every data point cites a source with credibility score ≥7. EDGAR primary source = SEC official, credibility 10/10. No fabricated filings ever.
