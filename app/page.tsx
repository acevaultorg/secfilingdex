import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const FILING_TYPES = [
  { code: "10-K", desc: "Annual report" },
  { code: "10-Q", desc: "Quarterly report" },
  { code: "8-K", desc: "Material event" },
  { code: "13F", desc: "Institutional holdings" },
  { code: "13D/G", desc: "5%+ ownership" },
  { code: "S-1", desc: "IPO registration" },
  { code: "Form 4", desc: "Insider transaction" },
  { code: "DEF 14A", desc: "Proxy statement" },
  { code: "20-F", desc: "Foreign annual" },
  { code: "6-K", desc: "Foreign event" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Hero — above-fold positioning + value prop + clear CTA */}
        <section className="px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-6xl mx-auto">
          <p className="text-eyebrow text-brand mb-5">SecFilingDex</p>
          <h1 className="text-display-1 mb-6 max-w-3xl">
            Every SEC filing,{" "}
            <span className="text-brand">indexed.</span>
          </h1>
          <p className="text-body-lg text-muted max-w-2xl mb-8">
            A programmatic database surface over SEC EDGAR. Search, lookup, and
            cite filings across every form type — with structured-data JSON
            twins for AI agents and a freshness-tracked taxonomy across millions
            of historical filings.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/about"
              className="px-5 py-2.5 rounded-btn bg-brand text-text font-medium hover:shadow-brand-glow-sm transition-all"
            >
              How it works
            </Link>
            <Link
              href="https://www.sec.gov/edgar"
              target="_blank"
              rel="noopener"
              className="px-5 py-2.5 rounded-btn border border-border text-muted hover:text-text hover:border-border-bright transition-all"
            >
              View raw EDGAR ↗
            </Link>
          </div>

          {/* Filing-type pills — quote-ready, scannable, taxonomy-disclosed */}
          <div className="flex flex-wrap gap-2 max-w-3xl">
            {FILING_TYPES.map((t) => (
              <span
                key={t.code}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill border border-border bg-panel/40 text-caption tabular"
              >
                <span className="font-mono text-text">{t.code}</span>
                <span className="text-dim">·</span>
                <span className="text-muted">{t.desc}</span>
              </span>
            ))}
          </div>
        </section>

        {/* 3-tile feature preview */}
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <p className="text-eyebrow text-dim mb-6">What it does</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-card border border-border bg-panel/40 p-6 hover:border-border-bright transition-colors">
              <p className="text-eyebrow text-brand mb-3">01 · Index</p>
              <h2 className="text-heading-2 mb-3">
                Every filing, every form type
              </h2>
              <p className="text-body-sm text-muted">
                10-K, 10-Q, 8-K, 13F, 13D/G, Form 4, S-1, DEF 14A, 20-F, 6-K.
                Programmatic pages keyed by accession number — every filing
                has its own URL, schema, and JSON twin.
              </p>
            </article>

            <article className="rounded-card border border-border bg-panel/40 p-6 hover:border-border-bright transition-colors">
              <p className="text-eyebrow text-brand mb-3">02 · Search</p>
              <h2 className="text-heading-2 mb-3">
                Filer × form × date, instant
              </h2>
              <p className="text-body-sm text-muted">
                Pivot by CIK, ticker, form type, period, or material-event
                category. Faster lookup than EDGAR&apos;s native UI. Bookmarkable
                URLs for every query path.
              </p>
            </article>

            <article className="rounded-card border border-border bg-panel/40 p-6 hover:border-border-bright transition-colors">
              <p className="text-eyebrow text-brand mb-3">03 · Cite</p>
              <h2 className="text-heading-2 mb-3">
                Citation-grade JSON API
              </h2>
              <p className="text-body-sm text-muted">
                Per-page <code className="font-mono text-text">/api/[slug].json</code>{" "}
                endpoint. Structured-data JSON-LD schema. Built for AI agents,
                LLM retrieval, and downstream data tooling.
              </p>
            </article>
          </div>
        </section>

        {/* Trust + transparency strip */}
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="rounded-card-lg border border-border bg-panel/40 p-8 sm:p-10">
            <p className="text-eyebrow text-brand mb-4">Provenance</p>
            <h2 className="text-heading-1 mb-4">
              Sourced from EDGAR. Every fact cites accession.
            </h2>
            <p className="text-body text-muted max-w-2xl mb-3">
              SecFilingDex republishes SEC EDGAR data with full provenance: every
              page links back to the original SEC URL, includes the accession
              number, filing date, and a visible &ldquo;last verified&rdquo;
              freshness signal.
            </p>
            <p className="text-body-sm text-dim max-w-2xl">
              Indexed SEC filings are public domain (17 U.S.C. § 105).
              SecFilingDex is independent — not affiliated with, endorsed by,
              or sponsored by the U.S. Securities and Exchange Commission.
            </p>
          </div>
        </section>

        {/* Status banner — honest about Day 1 */}
        <section className="px-6 py-8 max-w-6xl mx-auto">
          <div className="rounded-card border border-border bg-surface-info/30 p-5 flex flex-col sm:flex-row gap-3 sm:items-center">
            <span className="text-eyebrow text-info shrink-0">Status</span>
            <p className="text-body-sm text-muted">
              Day 1 — site scaffold shipping. First 100+ filings indexing this
              week. Public ship targeting Day 7. Watch this space.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
