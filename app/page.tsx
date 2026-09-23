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
import { formTypeToSlug, type FormType } from "@/lib/types";
import { sicCodeToName } from "@/lib/sic";
import { formatDateShort, formTypeInfo, pickEnrichments } from "@/lib/format";

const SITE_URL = "https://secfilingdex.com";

// Home was the one route in the app with no self-canonical (every other page sets
// `alternates.canonical`), so the trailing-slash + query-string variants of the root had
// no declared preferred URL. Title/description stay inherited from the root layout.
export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
};

// The forms people actually search for (design pass 2026-09-23, card
// mue840n8q4dh5j). The full list lives on /form/.
const POPULAR_FORMS: FormType[] = ["10-K", "10-Q", "8-K", "20-F", "S-1", "13F-HR"];

export default function Home() {
  const allFilings = loadAllFilings();
  const formTypes = uniqueFormTypes();
  const ciks = uniqueCiks();
  const sicCodes = uniqueSicCodes();
  const recent = allFilings.slice(0, 10);
  // Year from which the corpus is dense: the earliest year that holds at least
  // 10% of all filings. Computed, so the hero sentence cannot overstate history.
  const byYear = new Map<string, number>();
  for (const f of allFilings) byYear.set(f.filedAt.slice(0, 4), (byYear.get(f.filedAt.slice(0, 4)) ?? 0) + 1);
  const sinceYear =
    [...byYear.entries()].sort().find(([, n]) => n >= allFilings.length * 0.1)?.[0] ??
    allFilings[allFilings.length - 1]?.filedAt.slice(0, 4);

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
          <h1 className="text-4xl sm:text-display-1 font-bold tracking-tight leading-[1.1] sm:leading-none mb-6 max-w-3xl">
            Look up a company&apos;s SEC filings in plain English
          </h1>
          <p className="text-body-lg text-muted max-w-2xl mb-8">
            {allFilings.length.toLocaleString("en-US")} filings copied from SEC EDGAR so far,
            most of them filed since {sinceYear}, with new ones added every day. Each page
            says what the form is, who filed it and when, and links to the original on
            sec.gov.
          </p>
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
              className="inline-flex items-center justify-center min-h-[48px] px-5 py-3 rounded-btn bg-brand text-text font-medium hover:shadow-brand-glow-sm transition-all"
            >
              Search →
            </button>
          </form>
          <p className="mt-5 text-body-sm text-muted">
            <Link href="/about/" className="text-brand hover:underline">
              How it works
            </Link>
            {" · "}
            <Link
              href="https://www.sec.gov/edgar"
              target="_blank"
              rel="noopener"
              className="hover:text-text hover:underline"
            >
              Search EDGAR itself ↗
            </Link>
          </p>
        </section>

        {/* Live form-type pills with counts — clicks into /form/[type]/ */}
        <section className="px-6 py-10 max-w-6xl mx-auto">
          <h2 className="text-heading-2 text-text mb-4">Browse by form</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_FORMS.filter((ft) => formTypes.includes(ft)).map((ft) => {
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
                    <span className="text-caption text-muted">
                      {info.shortName}
                    </span>
                  )}
                  <span className="text-caption text-dim font-mono tabular">
                    {count}
                  </span>
                </Link>
              );
            })}
            <Link
              href="/form/"
              className="inline-flex items-center min-h-[40px] px-3.5 py-2 rounded-pill border border-border text-body-sm text-brand hover:border-border-bright hover:bg-panel-hi transition-colors"
            >
              All {formTypes.length} form types →
            </Link>
          </div>
        </section>

        {/* Learn — short explainers, hub for /learn/[topic] pages */}
        <section className="px-6 py-10 max-w-6xl mx-auto">
          <h2 className="text-heading-2 text-text mb-4">
            What each form means
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
                className="rounded-card border border-border bg-panel/40 px-4 py-3 hover:border-border-bright hover:bg-panel-hi transition-colors"
              >
                <p className="text-heading-3 text-text mb-0.5">{t.title}</p>
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

        {/* Recent filings — live discovery into /filing/[accession]/ */}
        <section className="px-6 py-10 max-w-6xl mx-auto">
          <h2 className="text-heading-2 text-text mb-4">Filed most recently</h2>
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
            <h2 className="text-heading-2 text-text mb-4">
              Companies with the most filings here
            </h2>
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
            <h2 className="text-heading-2 text-text mb-4">
              Browse by industry
            </h2>
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

        {/* Trust + transparency strip */}
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="rounded-card-lg border border-border bg-panel/40 p-8 sm:p-10">
            <h2 className="text-heading-1 mb-4">
              Where the data comes from
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
