import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { loadFilingsByCik, uniqueCiks } from "@/lib/filings";
import { sicCodeToName } from "@/lib/sic";
import { formatDateShort, pickEnrichments } from "@/lib/format";
import { getHoldLensManagerByCik } from "@/lib/holdlens-tracked";
import { FilerProfile, filerProfileIsSubstantive } from "@/components/FilerProfile";

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
  const substantive = filerProfileIsSubstantive(filings);
  const tickerSuffix = ticker ? ` (${ticker})` : "";
  // Title matches the exact demand query form (GSC: "[company] sec EDGAR filings",
  // "[company] cik sec edgar") — adds the "EDGAR" + "CIK" tokens the SERP query carries.
  const title = `${filerName}${tickerSuffix} — SEC EDGAR Filings (CIK ${cik})`;
  const description = `${filings.length} SEC EDGAR filings indexed for ${filerName} (CIK ${cik}). Recent forms: ${[...new Set(filings.slice(0, 5).map((f) => f.formType))].join(", ")}.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/filer/${cik}/` },
    openGraph: { type: "website", title, description, siteName: "SecFilingDex" },
    twitter: { card: "summary_large_image", title, description },
    // 2026-07-03 thin-content REMEDIATED (per rules/adsense-thin-content-prevention.md +
    // information-gain-standard). Pages now carry a genuine, zero-fabrication per-filer
    // Filing Profile (disclosure mix + date span + recency + amendment share + most-
    // frequent form), derived entirely from the indexed filing records. Only filers with
    // real filing-behaviour to describe (filerProfileIsSubstantive) become indexable —
    // thin 1-2-filing filers stay noindex so no low-value page enters the index
    // (GSC-standing thin-index anti-pattern). follow:true throughout → every page passes
    // link equity to the /form/* hubs (the pos-11 ranking targets).
    robots: {
      index: substantive,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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

  // Sister-property cross-reference. If this CIK matches a HoldLens tracked
  // superinvestor, render a "Live position analysis on HoldLens" section.
  // Map: lib/holdlens-tracked.ts. Layer 2 of C1 Finance sister-property
  // synergy. Captures intent like "berkshire 13f" + "buffett positions" with
  // both sites' complementary angles.
  const holdLensManager = getHoldLensManagerByCik(cik);

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

  // Dataset schema — every filer's filing-history IS unique structured data.
  // Per Aleyda Solis 10-char LLM-citation checklist (#4 Extractable + #2 Useful).
  // Mirrors holdlens.com/investor/[slug] Dataset pattern shipped 2026-05-08.
  const sortedFilings = [...filings].sort((a, b) => (a.filedAt < b.filedAt ? 1 : -1));
  const latestFiledAt = sortedFilings[0]?.filedAt;
  const earliestFiledAt = sortedFilings[sortedFilings.length - 1]?.filedAt;
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${SITE_URL}/filer/${cik}/#dataset`,
    name: `${filerName} — SEC EDGAR Filings (CIK ${cik})`,
    description: `Indexed list of every SEC filing disclosed by ${filerName} (CIK ${cik})${ticker ? ` (ticker: ${ticker})` : ""}, including form type, accession number, filing date, and link back to the original EDGAR document. ${filings.length} filing${filings.length === 1 ? "" : "s"} covered across form types: ${formTypesByCik.join(", ")}.`,
    url: `${SITE_URL}/filer/${cik}/`,
    sameAs: [edgarFilerUrl],
    creator: { "@type": "Organization", name: filerName, identifier: `CIK:${cik}` },
    publisher: {
      "@type": "Organization",
      name: "SecFilingDex",
      url: SITE_URL,
    },
    license: "https://www.sec.gov/foia/about-foia",
    isAccessibleForFree: true,
    ...(latestFiledAt ? { dateModified: latestFiledAt } : {}),
    ...(earliestFiledAt && latestFiledAt && earliestFiledAt !== latestFiledAt
      ? { temporalCoverage: `${earliestFiledAt}/${latestFiledAt}` }
      : {}),
    keywords: [
      "SEC filing",
      "EDGAR",
      "public disclosure",
      filerName,
      `CIK ${cik}`,
      ...(ticker ? [ticker] : []),
      ...formTypesByCik,
    ],
    variableMeasured: [
      { "@type": "PropertyValue", name: "Form type" },
      { "@type": "PropertyValue", name: "Accession number" },
      { "@type": "PropertyValue", name: "Filing date" },
      { "@type": "PropertyValue", name: "Period of report" },
      { "@type": "PropertyValue", name: "EDGAR source URL" },
    ],
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
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
            {filings.length} SEC EDGAR filings indexed (CIK{" "}
            <span className="font-mono">{cik}</span>) across {formTypesByCik.length}{" "}
            {formTypesByCik.length === 1 ? "form type" : "form types"}.
          </p>
        </header>

        {/* Filing profile — genuine per-filer synthesis (supersedes the bare pill row) */}
        <FilerProfile
          filings={filings}
          filerName={filerName}
          ticker={ticker}
          sicCode={sicCode ?? undefined}
        />

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

        {/* Sister-property cross-link — only renders for tracked HoldLens managers */}
        {holdLensManager && (
          <section className="mb-10">
            <p className="text-eyebrow text-brand mb-3">Live position analysis (sister property)</p>
            <div className="rounded-card-lg border border-border bg-panel/40 p-6">
              <p className="text-body-sm text-muted leading-relaxed">
                {holdLensManager.name} ({holdLensManager.fund}) is one of 30
                superinvestors tracked on{" "}
                <strong className="text-text">HoldLens</strong>, our sister
                property under the same operator. SecFilingDex catalogs every
                SEC filing; HoldLens applies a scored signal layer on the same
                13F corpus.
              </p>
              <div className="mt-4">
                <Link
                  href={`https://holdlens.com/investor/${holdLensManager.slug}/`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center text-brand hover:underline font-medium"
                >
                  Live ConvictionScore + position dossier on HoldLens ↗
                </Link>
              </div>
              <p className="text-caption text-dim mt-3">
                Quarterly 13F-based signal across the tracked manager universe.
                Two sites do not duplicate content — they complement.
              </p>
            </div>
          </section>
        )}

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
