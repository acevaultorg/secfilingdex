import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { loadFilingsBySic, uniqueSicCodes, loadAllFilings } from "@/lib/filings";
import { sicCodeToName } from "@/lib/sic";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "Browse SEC filings by industry — SIC code index",
  description:
    "Browse SEC EDGAR filings by Standard Industrial Classification (SIC) industry code. Programmatic database surface organized by industry, with filer counts and direct links to per-industry pages.",
  alternates: { canonical: `${SITE_URL}/industry/` },
  openGraph: {
    type: "website",
    title: "Browse SEC filings by industry · SecFilingDex",
    description:
      "SIC code index of SEC EDGAR filings. Every industry has its own indexed page with filers + form types + recent filings.",
    siteName: "SecFilingDex",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse SEC filings by industry · SecFilingDex",
    description: "Standard Industrial Classification index over SEC EDGAR.",
  },
};

export default function IndustryIndex() {
  const codes = uniqueSicCodes();
  const allFilings = loadAllFilings();
  const totalFilings = allFilings.length;

  // Compute per-industry filing + filer counts (sorted by filing count desc)
  const industries = codes
    .map((sic) => {
      const filings = loadFilingsBySic(sic);
      const filerCount = new Set(filings.map((f) => f.cik)).size;
      return {
        sic,
        name: sicCodeToName(sic),
        filingCount: filings.length,
        filerCount,
      };
    })
    .sort((a, b) => b.filingCount - a.filingCount);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Browse SEC filings by industry · SecFilingDex",
    description:
      "Index of every SIC industry code represented in SecFilingDex's EDGAR cache.",
    url: `${SITE_URL}/industry/`,
    isPartOf: { "@type": "WebSite", name: "SecFilingDex", url: SITE_URL },
    hasPart: industries.map((ind) => ({
      "@type": "DefinedTerm",
      termCode: ind.sic,
      name: ind.name,
      url: `${SITE_URL}/industry/${ind.sic}/`,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Standard Industrial Classification (SIC)",
        url: "https://www.sec.gov/info/edgar/siccodes",
      },
    })),
  };

  const dataCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: "SecFilingDex industry (SIC) index",
    description: `Catalog of ${industries.length} Standard Industrial Classification (SIC) industries indexed across ${totalFilings} SEC EDGAR filings. Each industry entry is a Dataset listing the filers + filings classified under that SIC code.`,
    url: `${SITE_URL}/industry/`,
    creator: { "@type": "Organization", name: "SecFilingDex", url: SITE_URL },
    license: "https://www.sec.gov/about/sec-website-policies/copyright",
    isAccessibleForFree: true,
    dataset: industries.map((ind) => ({
      "@type": "Dataset",
      name: `${ind.name} (SIC ${ind.sic})`,
      url: `${SITE_URL}/industry/${ind.sic}/`,
      identifier: `industry-sic-${ind.sic}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SecFilingDex", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Industry index", item: `${SITE_URL}/industry/` },
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
          <span className="text-muted">Industry index</span>
        </nav>

        <header className="mb-10">
          <p className="text-eyebrow text-brand mb-3">Industry index</p>
          <h1 className="text-display-2 mb-4">Browse SEC filings by industry</h1>
          <p className="text-body-lg text-muted max-w-3xl mb-6">
            {industries.length} Standard Industrial Classification (SIC) codes
            represented across {totalFilings} indexed filings. Each industry
            has its own hub page with filer roster, form-type breakdown, and
            recent filings from EDGAR.
          </p>
          <dl className="grid sm:grid-cols-3 gap-3 max-w-2xl text-body-sm">
            <div className="rounded-card border border-border bg-panel/40 p-4">
              <dt className="text-eyebrow text-dim mb-1">Industries</dt>
              <dd className="text-text tabular">{industries.length}</dd>
            </div>
            <div className="rounded-card border border-border bg-panel/40 p-4">
              <dt className="text-eyebrow text-dim mb-1">Total filings</dt>
              <dd className="text-text tabular">{totalFilings}</dd>
            </div>
            <div className="rounded-card border border-border bg-panel/40 p-4">
              <dt className="text-eyebrow text-dim mb-1">Schema</dt>
              <dd className="text-text">SEC SIC catalog</dd>
            </div>
          </dl>
        </header>

        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-4">
            All industries · sorted by filing count
          </p>
          <div className="rounded-card-lg border border-border bg-panel/40 overflow-hidden">
            <ul className="divide-y divide-border">
              {industries.map((ind) => (
                <li key={ind.sic}>
                  <Link
                    href={`/industry/${ind.sic}/`}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 px-5 py-4 hover:bg-surface-hover transition-colors"
                  >
                    <span className="font-mono text-data-cell text-dim sm:w-20 shrink-0 tabular">
                      {ind.sic}
                    </span>
                    <span className="text-text flex-1 break-words">
                      {ind.name}
                    </span>
                    <span className="font-mono text-caption text-dim shrink-0 tabular">
                      {ind.filingCount} filing{ind.filingCount === 1 ? "" : "s"}
                      {" · "}
                      {ind.filerCount} filer{ind.filerCount === 1 ? "" : "s"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="text-body-sm text-dim max-w-2xl">
          <p>
            SIC codes per the Standard Industrial Classification assigned by
            the SEC. Source: SEC EDGAR + the canonical{" "}
            <a
              href="https://www.sec.gov/info/edgar/siccodes"
              className="underline hover:text-text"
              target="_blank"
              rel="noopener"
            >
              SEC SIC catalog
            </a>
            . SecFilingDex is independently operated.
          </p>
        </section>
      </main>
      <SiteFooter books />
    </>
  );
}
