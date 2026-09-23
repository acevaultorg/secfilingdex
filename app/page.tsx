import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  loadAllFilings,
  loadFilingsByCik,
  loadFilingsByFormType,
  loadFilingsBySic,
  uniqueCiks,
  uniqueFormTypes,
  uniqueSicCodes,
} from "@/lib/filings";
import { formTypeToSlug } from "@/lib/types";
import { sicCodeToName } from "@/lib/sic";
import { formatDateShort, formTypeInfo, pickEnrichments } from "@/lib/format";

const SITE_URL = "https://secfilingdex.com";

// Home was the one route in the app with no self-canonical (every other page sets
// `alternates.canonical`), so the trailing-slash + query-string variants of the root had
// no declared preferred URL. Title/description stay inherited from the root layout.
export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
};

export default function Home() {
  const allFilings = loadAllFilings();
  const formTypes = uniqueFormTypes();
  const ciks = uniqueCiks();
  const sicCodes = uniqueSicCodes();
  const recent = allFilings.slice(0, 10);

  // Top filers by count of indexed filings (newest-first ordering preserved)
  const filerCounts = ciks
    .map((cik) => {
      const filings = loadFilingsByCik(cik);
      const { filerName, ticker } = pickEnrichments(filings[0]);
      return { cik, filerName, ticker, count: filings.length };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // Top industries by filing count
  const industryCounts = sicCodes
    .map((sic) => ({
      sic,
      name: sicCodeToName(sic),
      count: loadFilingsBySic(sic).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 max-w-6xl mx-auto">
          <p className="text-eyebrow text-brand mb-5">SecFilingDex</p>
          <h1 className="text-4xl sm:text-display-1 font-bold tracking-tight leading-[1.1] sm:leading-none mb-6 max-w-3xl">
            Every SEC filing,{" "}
            <span className="text-brand">indexed.</span>
          </h1>
          <p className="text-body-lg text-muted max-w-2xl mb-8">
            A programmatic database surface over SEC EDGAR. Search, lookup, and
            cite filings across every form type — with structured-data JSON
            twins for AI agents and a freshness-tracked taxonomy across millions
            of historical filings.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href="/about/"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-btn bg-brand text-text font-medium hover:shadow-brand-glow-sm transition-all"
            >
              How it works
            </Link>
            <Link
              href="https://www.sec.gov/edgar"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-btn border border-border text-muted hover:text-text hover:border-border-bright transition-all"
            >
              View raw EDGAR ↗
            </Link>
          </div>

          {/* Search entry — GET to /search/ so the action is shareable
              + LLM-citable (Schema.org WebSite SearchAction is wired in
              layout.tsx). Form submit works with JS off too. */}
          <form
            role="search"
            action="/search/"
            method="get"
            className="max-w-2xl flex flex-col sm:flex-row gap-3"
          >
            <label htmlFor="q" className="sr-only">
              Search filings
            </label>
            <input
              id="q"
              name="q"
              type="search"
              placeholder="Search filer, ticker, accession, CIK…"
              spellCheck={false}
              autoComplete="off"
              className="flex-1 min-h-[48px] px-4 py-3 rounded-btn border border-border bg-panel/60 text-text text-body placeholder:text-dim focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 transition-colors"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center min-h-[48px] px-5 py-3 rounded-btn border border-border-bright text-text font-medium hover:bg-panel-hi transition-all"
            >
              Search →
            </button>
          </form>
        </section>

        {/* Live form-type pills with counts — clicks into /form/[type]/ */}
        <section className="px-6 py-10 max-w-6xl mx-auto">
          <p className="text-eyebrow text-brand mb-4">
            Browse by form type · {allFilings.length} filings indexed
          </p>
          <div className="flex flex-wrap gap-2">
            {formTypes.map((ft) => {
              const count = loadFilingsByFormType(ft).length;
              const info = formTypeInfo(ft);
              return (
                <Link
                  key={ft}
                  href={`/form/${formTypeToSlug(ft)}/`}
                  className="group inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-pill border border-border bg-panel/40 hover:border-border-bright hover:bg-panel-hi transition-colors"
                >
                  <span className="font-mono text-data-cell text-text">{ft}</span>
                  {info?.shortName && (
                    <span className="text-caption text-muted hidden sm:inline">
                      {info.shortName}
                    </span>
                  )}
                  <span className="text-caption text-dim font-mono tabular">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent filings — live discovery into /filing/[accession]/ */}
        <section className="px-6 py-10 max-w-6xl mx-auto">
          <p className="text-eyebrow text-brand mb-4">Recent filings</p>
          <div className="rounded-card-lg border border-border bg-panel/40 overflow-hidden">
            <ul className="divide-y divide-border">
              {recent.map((f) => {
                const { filerName, ticker } = pickEnrichments(f);
                return (
                  <li key={f.accessionNumber}>
                    <Link
                      href={`/filing/${f.accessionNumber}/`}
                      className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 px-5 py-3.5 hover:bg-surface-hover transition-colors"
                    >
                      <time
                        dateTime={f.filedAt}
                        className="font-mono text-data-cell text-dim sm:w-24 shrink-0 tabular"
                      >
                        {formatDateShort(f.filedAt)}
                      </time>
                      <span className="font-mono text-data-cell text-brand sm:w-24 shrink-0">
                        {f.formType}
                      </span>
                      <span className="text-text flex-1 break-words">
                        {filerName}
                        {ticker && (
                          <span className="ml-2 font-mono text-data-cell text-muted">
                            {ticker}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Top filers — live discovery into /filer/[cik]/ */}
        {filerCounts.length > 0 && (
          <section className="px-6 py-10 max-w-6xl mx-auto">
            <p className="text-eyebrow text-brand mb-4">
              Top filers · {ciks.length} indexed
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filerCounts.map((f) => (
                <Link
                  key={f.cik}
                  href={`/filer/${f.cik}/`}
                  className="rounded-card border border-border bg-panel/40 p-4 hover:border-border-bright hover:bg-panel-hi transition-colors flex items-baseline gap-3"
                >
                  <span className="font-mono text-data-cell text-dim shrink-0">
                    {f.count}
                  </span>
                  <span className="text-body-sm text-text flex-1 truncate">
                    {f.filerName}
                  </span>
                  {f.ticker && (
                    <span className="font-mono text-caption text-brand shrink-0">
                      {f.ticker}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top industries — live discovery into /industry/[sic]/ */}
        {industryCounts.length > 0 && (
          <section className="px-6 py-10 max-w-6xl mx-auto">
            <p className="text-eyebrow text-brand mb-4">
              Browse by industry · {sicCodes.length} indexed
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {industryCounts.map((ind) => (
                <Link
                  key={ind.sic}
                  href={`/industry/${ind.sic}/`}
                  className="rounded-card border border-border bg-panel/40 p-4 hover:border-border-bright hover:bg-panel-hi transition-colors flex items-baseline gap-3"
                >
                  <span className="font-mono text-data-cell text-dim shrink-0 tabular">
                    {ind.count}
                  </span>
                  <span className="text-body-sm text-text flex-1">
                    {ind.name}
                  </span>
                  <span className="font-mono text-caption text-muted shrink-0">
                    {ind.sic}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Learn — short explainers, hub for /learn/[topic] pages */}
        <section className="px-6 py-10 max-w-6xl mx-auto">
          <p className="text-eyebrow text-brand mb-4">
            Learn · plain-English explainers
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { slug: "10-k", title: "10-K", blurb: "Annual report" },
              { slug: "10-q", title: "10-Q", blurb: "Quarterly report" },
              { slug: "8-k", title: "8-K", blurb: "Material events" },
              { slug: "13f", title: "13F", blurb: "Institutional holdings" },
              { slug: "form-4", title: "Form 4", blurb: "Insider trading" },
              { slug: "s-1", title: "S-1", blurb: "IPO prospectus" },
              { slug: "s-3", title: "S-3", blurb: "Shelf registration" },
              { slug: "def-14a", title: "DEF 14A", blurb: "Proxy statement" },
              { slug: "20-f", title: "20-F", blurb: "Foreign issuer annual" },
              { slug: "13d-vs-13g", title: "13D vs. 13G", blurb: "Activist vs. passive" },
            ].map((t) => (
              <Link
                key={t.slug}
                href={`/learn/${t.slug}/`}
                className="rounded-card border border-border bg-panel/40 p-4 hover:border-border-bright hover:bg-panel-hi transition-colors"
              >
                <p className="text-heading-3 text-text mb-1">{t.title}</p>
                <p className="text-body-sm text-muted">{t.blurb}</p>
              </Link>
            ))}
            <Link
              href="/learn/"
              className="rounded-card border border-brand-soft bg-surface-brand p-4 hover:border-brand hover:bg-panel-hi transition-colors flex items-center justify-center"
            >
              <span className="text-body-sm text-brand font-medium">
                See all explainers →
              </span>
            </Link>
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
                Programmatic pages keyed by accession number — every filing has
                its own URL, schema, and JSON twin.
              </p>
            </article>

            <article className="rounded-card border border-border bg-panel/40 p-6 hover:border-border-bright transition-colors">
              <p className="text-eyebrow text-brand mb-3">02 · Pivot</p>
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
      </main>
      <SiteFooter />
    </>
  );
}
