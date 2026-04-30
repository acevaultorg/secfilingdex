import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchClient } from "@/components/SearchClient";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "Search SEC filings",
  description:
    "Search every indexed SEC filing by filer name, ticker, accession number, CIK, or form type. Direct lookup across the SecFilingDex EDGAR index.",
  alternates: { canonical: `${SITE_URL}/search/` },
  openGraph: {
    type: "website",
    title: "Search SEC filings · SecFilingDex",
    description:
      "Direct lookup across every indexed SEC filing. Filer name, ticker, accession, CIK, or form type.",
    siteName: "SecFilingDex",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search SEC filings · SecFilingDex",
    description:
      "Direct lookup across every indexed SEC filing. Filer name, ticker, accession, CIK, or form type.",
  },
};

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-caption text-dim mb-6 flex flex-wrap gap-1.5 items-center">
          <Link href="/" className="hover:text-text transition-colors">
            SecFilingDex
          </Link>
          <span>›</span>
          <span className="text-muted">Search</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <p className="text-eyebrow text-brand mb-3">Search</p>
          <h1 className="text-4xl sm:text-display-2 font-bold tracking-tight leading-[1.15] mb-3">
            Find any filing
          </h1>
          <p className="text-body-lg text-muted max-w-2xl">
            Direct lookup across every indexed filing. Filer name, ticker,
            accession number, CIK, or form type — pick the field you remember
            and the rest will narrow.
          </p>
        </header>

        {/* Client-side search (suspense-wrapped per Next 15 useSearchParams contract) */}
        <Suspense
          fallback={
            <div className="rounded-card-lg border border-border bg-panel/40 px-5 py-10 text-center text-muted text-body-sm">
              Loading search…
            </div>
          }
        >
          <SearchClient />
        </Suspense>

        {/* Help block — visible always */}
        <section className="mt-12 rounded-card-lg border border-border bg-panel/40 p-6">
          <p className="text-eyebrow text-brand mb-3">Tips</p>
          <ul className="text-body-sm text-muted space-y-2">
            <li>
              <strong className="text-text">Tickers</strong> work as expected:
              try <span className="font-mono text-text">SYY</span> or{" "}
              <span className="font-mono text-text">AAPL</span>.
            </li>
            <li>
              <strong className="text-text">Form types</strong> include{" "}
              <span className="font-mono text-text">10-K</span>,{" "}
              <span className="font-mono text-text">10-Q</span>,{" "}
              <span className="font-mono text-text">8-K</span>,{" "}
              <span className="font-mono text-text">13F-HR</span>,{" "}
              <span className="font-mono text-text">DEF 14A</span>,{" "}
              <span className="font-mono text-text">S-1</span>,{" "}
              <span className="font-mono text-text">20-F</span>.
            </li>
            <li>
              <strong className="text-text">Accession numbers</strong> follow
              the EDGAR pattern{" "}
              <span className="font-mono text-text">0000000000-YY-NNNNNN</span>{" "}
              — partial works.
            </li>
            <li>
              <strong className="text-text">Multi-word queries</strong> are
              AND-matched: <span className="font-mono text-text">sysco 10-q</span>{" "}
              narrows to filings matching both terms.
            </li>
          </ul>
        </section>

        {/* Provenance / disclaimer */}
        <p className="mt-10 text-body-sm text-dim max-w-2xl">
          Results are indexed from SEC EDGAR. SecFilingDex is independent and
          not affiliated with the U.S. Securities and Exchange Commission.
          Nothing on this page is investment, legal, or tax advice.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
