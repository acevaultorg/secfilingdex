# secfilingdex

> EDGAR's database, modernized.

Programmatic database surface over SEC EDGAR filings. Comprehensive indexing across 10-K / 10-Q / 8-K / 13F / 13D/G / S-1 / Proxy / Form 4 / 20-F / 6-K and friends, with cross-filer relationship graph, filing-diff visualization, and citation-grade structured-data API for LLM agents.

## Stack

- Next.js 15.0.3 (static export)
- React 19 RC
- Tailwind 3.4
- TypeScript 5.6
- Cloudflare Pages (deploy via wrangler)
- Satori (OG images)
- IndexNow (search-engine direct ping)

## Status

Day 0 — folder prepared 2026-04-28. Domain registered Cloudflare. First public ship targeting Day 7 per `.claude/state/BUILD_SPEC.md`.

## Local dev

```bash
npm install
npm run dev          # localhost:3000
npm run build        # static export to out/
npm run deploy       # build + wrangler deploy + indexnow ping
npm run fetch-edgar  # pull latest SEC EDGAR filings index (no API key needed)
```

## Architecture

- **Static export** (`output: 'export'`) — every page prebuilt at deploy time
- **Build-time data fetching** — `scripts/fetch-edgar.ts` pulls SEC EDGAR data into `data/filings/*.json` before `next build`
- **Per-page JSON twin** — every programmatic page has `/api/[slug].json` for bot/LLM consumption
- **No backend, no DB, no auth** — finite public dataset, all client-side filter for search

## Data source

[SEC EDGAR](https://www.sec.gov/edgar) — public, no API key required for filings index. Identify with `User-Agent: secfilingdex.com paulomdevries@gmail.com` per SEC guidance. Rate limit: 10 req/sec/IP.

## Fleet context

Sibling site: [holdlens.com](https://holdlens.com) — same data source, different lens. HoldLens is signal-spectrum on superinvestor 13Fs (ranking lens). SecFilingDex is comprehensive filing database (search + lookup lens). Both citation-link each other.

## License

All site code: proprietary. Indexed SEC filings: public domain (US government works are not subject to copyright in the US per 17 U.S.C. § 105).

## Related

- `.claude/state/IDENTITY.md` — operator + brand + positioning
- `.claude/state/BUILD_SPEC.md` — Day 1-7 ship plan
- `.claude/state/KNOWLEDGE.md` — verified SEC/EDGAR facts
- `CLAUDE.md` — AcePilot project spec
