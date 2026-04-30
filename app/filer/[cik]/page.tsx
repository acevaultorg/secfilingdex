import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { loadFilingsByCik, uniqueCiks } from "@/lib/filings";
import { formTypeToSlug } from "@/lib/types";
import { sicCodeToName } from "@/lib/sic";
import { formatDateShort, pickEnrichments } from "@/lib/format";

const SITE_URL = "https://secfilingdex.com";

export const dynamicParams = false;

export async function generateStaticParams() {
  return uniqueCiks().map((cik) => ({ cik }));
}

interface Params {
  cik: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { cik } = await params;
  const filings = loadFilingsByCik(cik);
  if (filings.length === 0) {
    return { title: "Filer not found", robots: { index: false, follow: false } };
  }
  const { filerName, ticker } = pickEnrichments(filings[0]);
  const tickerSuffix = ticker ? ` (${ticker})` : "";
  const title = `${filerName}${tickerSuffix} — SEC filings`;
  const description = `${filings.length} SEC EDGAR filings indexed for ${filerName} (CIK ${cik}). Recent forms: ${[...new Set(filings.slice(0, 5).map((f) => f.formType))].join(", ")}.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/filer/${cik}/` },
    openGraph: { type: "website", title, description, siteName: "SecFilingDex" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function FilerPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { cik } = await params;
  const filings = loadFilingsByCik(cik);
  if (filings.length === 0) notFound();

  const { filerName, ticker } = pickEnrichments(filings[0]);
  const sicCode = filings[0].sicCode;
  const cikInt = parseInt(cik, 10);
  const edgarFilerUrl = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cikInt}&type=&dateb=&owner=include&count=40`;
  const formTypesByCik = [...new Set(filings.map((f) => f.formType))].sort();

  // Schema.org Organization for the filer
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: filerName,
    identifier: `CIK:${cik}`,
    url: edgarFilerUrl,
    sameAs: [`${SITE_URL}/filer/${cik}/`],
    ...(ticker && { tickerSymbol: ticker }),
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <main className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-caption text-dim mb-6 flex flex-wrap gap-1.5 items-center">
          <Link href="/" className="hover:text-text">SecFilingDex</Link>
          <span>›</span>
          <span className="text-muted">Filer · CIK {cik}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {ticker && (
              <span className="px-2.5 py-1 rounded-chip border border-border bg-panel font-mono text-data-cell text-text">
                {ticker}
              </span>
            )}
            <span className="text-caption text-dim">
              CIK <span className="font-mono">{cik}</span>
            </span>
            {sicCode && (
              <Link
                href={`/industry/${sicCode}/`}
                className="text-caption text-dim hover:text-text transition-colors"
              >
                <span className="font-mono mr-1">SIC {sicCode}</span>
                <span>· {sicCodeToName(sicCode)}</span>
              </Link>
            )}
          </div>
          <h1 className="text-display-2 mb-3">{filerName}</h1>
          <p className="text-body-lg text-muted">
            {filings.length} SEC filings indexed across {formTypesByCik.length}{" "}
            {formTypesByCik.length === 1 ? "form type" : "form types"}.
          </p>
        </header>

        {/* Form-type pills */}
        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-3">Form types filed</p>
          <div className="flex flex-wrap gap-2">
            {formTypesByCik.map((ft) => (
              <Link
                key={ft}
                href={`/form/${formTypeToSlug(ft)}/`}
                className="inline-flex items-center min-h-[40px] px-3.5 py-2 rounded-pill border border-border bg-panel/40 hover:border-border-bright transition-colors font-mono text-data-cell text-text"
              >
                {ft}
              </Link>
            ))}
          </div>
        </section>

        {/* Filings list */}
        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-4">All filings</p>
          <div className="rounded-card-lg border border-border bg-panel/40 overflow-hidden">
            <ul className="divide-y divide-border">
              {filings.map((f) => (
                <li key={f.accessionNumber}>
                  <Link
                    href={`/filing/${f.accessionNumber}/`}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 px-5 py-4 hover:bg-surface-hover transition-colors"
                  >
                    <time
                      dateTime={f.filedAt}
                      className="font-mono text-data-cell text-dim sm:w-28 shrink-0 tabular"
                    >
                      {formatDateShort(f.filedAt)}
                    </time>
                    <span className="font-mono text-data-cell text-brand sm:w-28 shrink-0">
                      {f.formType}
                    </span>
                    <span className="text-body-sm text-muted flex-1 break-all font-mono">
                      {f.accessionNumber}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Provenance */}
        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-3">Authoritative source</p>
          <div className="rounded-card-lg border border-border bg-panel/40 p-6">
            <Link
              href={edgarFilerUrl}
              target="_blank"
              rel="noopener"
              className="font-mono text-data-cell text-brand hover:underline break-all"
            >
              {edgarFilerUrl} ↗
            </Link>
            <p className="text-body-sm text-dim mt-3">
              SecFilingDex republishes EDGAR data with provenance. EDGAR is
              authoritative; this page reflects the most recent index pull.
            </p>
          </div>
        </section>

        <section className="text-body-sm text-dim max-w-2xl">
          <p>
            Disclaimer: SecFilingDex is independent and not affiliated with the
            U.S. Securities and Exchange Commission. Nothing on this page is
            investment, legal, or tax advice.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
