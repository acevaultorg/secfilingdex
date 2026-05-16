import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { loadAllFilings, loadFilingsByCik, uniqueCiks } from "@/lib/filings";
import { pickEnrichments } from "@/lib/format";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "Browse SEC filings by filer — public-company filer index (CIK)",
  description:
    "Browse SEC EDGAR filings by filer (CIK). Comprehensive index of every public-company filer in SecFilingDex with filing counts and direct links to per-filer hub pages.",
  alternates: { canonical: `${SITE_URL}/filer/` },
  openGraph: {
    type: "website",
    title: "Browse SEC filings by filer · SecFilingDex",
    description:
      "CIK-anchored filer index over SEC EDGAR. Every filer has its own indexed page with form mix and recent filings.",
    siteName: "SecFilingDex",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse SEC filings by filer · SecFilingDex",
    description: "Public-company filer index over SEC EDGAR.",
  },
};

export default function FilerIndex() {
  const ciks = uniqueCiks();
  const allFilings = loadAllFilings();

  const filers = ciks
    .map((cik) => {
      const filings = loadFilingsByCik(cik);
      const { filerName, ticker } = pickEnrichments(filings[0]);
      const mostRecent = filings.reduce(
        (latest, f) => (f.filedAt > latest ? f.filedAt : latest),
        filings[0].filedAt,
      );
      return {
        cik,
        filerName,
        ticker,
        filingCount: filings.length,
        mostRecent,
      };
    })
    .sort((a, b) => b.filingCount - a.filingCount || b.mostRecent.localeCompare(a.mostRecent));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Browse SEC filings by filer · SecFilingDex",
    description: "Index of every public-company filer indexed by SecFilingDex.",
    url: `${SITE_URL}/filer/`,
    isPartOf: { "@type": "WebSite", name: "SecFilingDex", url: SITE_URL },
    hasPart: filers.slice(0, 100).map((f) => ({
      "@type": "Organization",
      name: f.filerName,
      identifier: f.cik,
      url: `${SITE_URL}/filer/${f.cik}/`,
      ...(f.ticker ? { tickerSymbol: f.ticker } : {}),
    })),
  };

  const dataCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: "SecFilingDex filer (CIK) index",
    description: `Catalog of ${filers.length} public-company SEC filers indexed across ${allFilings.length} EDGAR filings. Each filer entry is a Dataset of that filer's filings keyed by accession number.`,
    url: `${SITE_URL}/filer/`,
    creator: { "@type": "Organization", name: "SecFilingDex", url: SITE_URL },
    license: "https://www.sec.gov/about/sec-website-policies/copyright",
    isAccessibleForFree: true,
    dataset: filers.slice(0, 100).map((f) => ({
      "@type": "Dataset",
      name: f.filerName,
      url: `${SITE_URL}/filer/${f.cik}/`,
      identifier: `filer-${f.cik}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SecFilingDex", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Filer index", item: `${SITE_URL}/filer/` },
    ],
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataCatalogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
        <nav className="text-caption text-dim mb-6 flex flex-wrap gap-1.5 items-center">
          <Link href="/" className="hover:text-text">SecFilingDex</Link>
          <span>›</span>
          <span className="text-muted">Filer index</span>
        </nav>

        <header className="mb-10">
          <p className="text-eyebrow text-brand mb-3">Filer index</p>
          <h1 className="text-display-2 mb-4">Browse SEC filings by filer</h1>
          <p className="text-body-lg text-muted max-w-3xl mb-6">
            {filers.length} unique public-company filers represented across{" "}
            {allFilings.length} indexed filings. Each filer has its own hub
            page with form-type breakdown, ticker, SIC industry classification,
            and recent filings from EDGAR.
          </p>
        </header>

        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-4">
            All filers · sorted by filing count, then most-recent
          </p>
          <div className="rounded-card-lg border border-border bg-panel/40 overflow-hidden">
            <ul className="divide-y divide-border">
              {filers.map((f) => (
                <li key={f.cik}>
                  <Link
                    href={`/filer/${f.cik}/`}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 px-5 py-4 hover:bg-surface-hover transition-colors"
                  >
                    <span className="font-mono text-data-cell text-dim sm:w-32 shrink-0 tabular">
                      CIK {f.cik}
                    </span>
                    <span className="text-text flex-1 break-words">
                      {f.filerName}
                      {f.ticker && (
                        <span className="ml-2 font-mono text-data-cell text-brand">
                          {f.ticker}
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-caption text-dim shrink-0 tabular">
                      {f.filingCount} filing{f.filingCount === 1 ? "" : "s"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="text-body-sm text-dim max-w-2xl">
          <p>
            Source: SEC EDGAR. CIK = Central Index Key, the SEC's unique
            10-digit identifier for every filer. Tickers extracted from filer
            names where available. SecFilingDex is independently operated.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
