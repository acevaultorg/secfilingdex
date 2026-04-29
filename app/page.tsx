// Day 1 P0 placeholder — D1-03 will replace with real hero + 3-tile feature
// preview + above-fold positioning. @craftsman gates first public-ship.
//
// Per @craftsman 5-dimension rubric (Useful · Delightful · Reliable · Clear ·
// Unique), Day 1 ship targets ≥0.5 mean. v0 here is intentionally minimal so
// the brain has something to extend on first /acepilot auto run.

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl">
        <p className="text-eyebrow text-brand mb-4">SecFilingDex</p>
        <h1 className="text-display-1 mb-6">EDGAR&apos;s database, modernized.</h1>
        <p className="text-body-lg text-muted mb-8">
          Comprehensive programmatic surface over SEC filings — 10-K, 10-Q, 8-K, 13F,
          13D/G, S-1, Proxy, Form 4, 20-F, 6-K. Every filing, indexed. Citation-grade
          structured-data API for AI agents.
        </p>
        <p className="text-body-sm text-dim">
          Day 0 — domain registered 2026-04-28. First public ship targeting Day 7
          per BUILD_SPEC.md.
        </p>
      </div>
    </main>
  );
}
