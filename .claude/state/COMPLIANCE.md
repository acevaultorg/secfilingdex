# COMPLIANCE.md — secfilingdex.com
# Schema: v1 (2026-05-08)
# Canonical rule: ~/.claude/rules/google-policy-compliance.md

## YMYL Classification

YMYL Tier:    YMYL_LIGHT (finance data-display only — SEC filings indexed + reformatted; no recommendation/advisory framing)
Operator credentials present: not required for current scope (data-display only — no investment advice / no licensed-financial-advisor framing)
Verdict labels in surface:    NO (verified live 2026-05-12 — grep on production HTML returns 0 matches for STRONG BUY/SELL/recommend/target price patterns)
Lag disclosure on result pages: per /learn corpus + per-filing pages (filings have datePublished + dateModified; statutory filing types annotated with filing-window context)

Last classified: 2026-04-28 initial · re-confirmed 2026-05-12 audit

## @compliance Audit Log (append-only per ship)

| timestamp | ship_id | content_orig | verdict_risk | ymyl_match | schema_hon | disclosure | mean | verdict | notes |
|---|---|---:|---:|---:|---:|---:|---:|---|---|
| 2026-05-12 07:35 UTC | live-audit | 0.85 | 1.00 | 0.85 | 0.95 | 0.70 | 0.87 | **PASS** | Live audit of https://secfilingdex.com via `/acepilot auto` from cluster-root. Content originality 0.85 (programmatic per-filing pages + synthesized /learn editorial with comparison + DefinedTerm schema). Verdict-Label Risk 1.00 (ZERO matches on BUY/SELL/recommend/target/outperform/underperform patterns). YMYL-Credential Match 0.85 (data-display scope; no advisory framing requires credentials). Schema Honesty 0.95 (Organization + Person + WebSite + SearchAction — descriptive types only; no Article schema with recommendation-encoded headlines). Disclosure Coverage 0.70 (privacy + terms + about live; affiliate disclosure not applicable since no affiliate yet per MONETIZATION_STACK.md). |

## Auto-Fixes Applied

| timestamp | ship_id | fix | dimension_lifted |
|---|---|---|---|
| - | - | - | - |

## HARD-BLOCKS (escalated to operator)

| timestamp | ship_id | dimension | reason | resolution |
|---|---|---|---|---|
| - | - | - | - | - |

## Notes

- secfilingdex.com is the CANONICAL good-pattern reference for finance-vertical YMYL_LIGHT data-display sites in the fleet. The site demonstrates what HoldLens Pivot A should look like (per v19.45 operator-action queue): factual headlines, descriptive schema, /learn corpus with comparison + DefinedTerm, no verdict labels anywhere.
- AdSense application status: track per MONETIZATION_STACK.md. Mean 0.87 PASS supports clean approval (no thin-content + no verdict-label compliance debt to remediate).
- Sister-site cross-link compounding: secfilingdex + holdlens citation graph (per IDENTITY.md "Both can citation-link each other") = LLM citation #6 Corroborated boost per rules/aceusergrowth.md v3 Part 23.

## Corrections

(None yet.)

## Cross-references

- ARCHETYPE — confirmed static-reference + LLM-citation publisher hybrid
- IDENTITY.md — operator + brand + 0.75 moat score
- MONETIZATION_STACK.md — current revenue stack
- ../README.md (outer workspace) — workspace layout
- rules/google-policy-compliance.md — canonical 3-tier compliance gate
