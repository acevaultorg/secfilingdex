import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PartnerTools } from "@/components/PartnerTools";
import { loadAllFilings, loadFilingByAccession } from "@/lib/filings";
import { formTypeToSlug } from "@/lib/types";
import { sicCodeToName } from "@/lib/sic";
import {
  bytes,
  formatDate,
  formatDateShort,
  pickEnrichments,
} from "@/lib/format";

const SITE_URL = "https://secfilingdex.com";

// Static export: generate every filing page at build time. dynamicParams=false
// ensures unknown accessions 404 cleanly rather than running runtime fallback.
export const dynamicParams = false;

export async function generateStaticParams() {
  return loadAllFilings().map((f) => ({ accession: f.accessionNumber }));
}

interface Params {
  accession: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { accession } = await params;
  const record = loadFilingByAccession(accession);
  if (!record) {
    return {
      title: "Filing not found",
      robots: { index: false, follow: false },
    };
  }
  const { filerName, info } = pickEnrichments(record);
  const formLabel = info?.shortName ?? record.formType;
  const filedShort = formatDateShort(record.filedAt);
  const title = `${filerName} ${record.formType} filed ${filedShort}`;
  const description = `${formLabel} (${record.formType}) filed by ${filerName} on ${formatDate(
    record.filedAt
  )}. Accession ${record.accessionNumber}. Sourced from SEC EDGAR with full provenance.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/filing/${record.accessionNumber}/`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}/filing/${record.accessionNumber}/`,
      siteName: "SecFilingDex",
    },
    twitter: { card: "summary_large_image", title, description },
    // 2026-05-12 AdSense thin-content prevention (per rules/adsense-thin-content-prevention.md).
    // /filing/[accession] pages avg ~210 words/page across 290 pages — below AdSense's
    // ≥400-word indexable-page threshold (Low value content rejection class). Each page
    // is a thin metadata wrapper around a single SEC EDGAR filing (filer + form type +
    // filed date + accession + link to source). Pages remain LIVE for users via internal
    // navigation (filer index + form index + industry index + search); only crawler-
    // indexable surface is suppressed. Same fix as HoldLens /insiders/* + readstacks pulse.
    // Aggregator pages (/filer/[cik]/, /industry/[sicCode]/, /form/[formType]/) STAY
    // indexed — broader surfaces with richer per-page value.
    robots: {
      index: false,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

export default async function FilingPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { accession } = await params;
  const record = loadFilingByAccession(accession);
  if (!record) notFound();

  const { filerName, ticker, info, cikInt } = pickEnrichments(record);
  const formLabel = info?.shortName ?? record.formType;
  const cikUrl = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cikInt}&type=&dateb=&owner=include&count=40`;

  // Schema.org Article — citation-grade per Aleyda Solis 10-characteristic checklist
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${filerName} ${record.formType} (filed ${formatDateShort(record.filedAt)})`,
    datePublished: record.filedAt,
    dateModified: record.indexedAt,
    author: {
      "@type": "Organization",
      name: filerName,
      url: cikUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "SecFilingDex",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/filing/${record.accessionNumber}/`,
    },
    isBasedOn: {
      "@type": "CreativeWork",
      name: `SEC EDGAR filing ${record.accessionNumber}`,
      url: record.edgarFilingUrl,
    },
  };

  // Schema.org Dataset — for bot/LLM citation of the structured filing data
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `SEC EDGAR filing ${record.accessionNumber}`,
    description: `${formLabel} (${record.formType}) filed by ${filerName} on ${formatDate(record.filedAt)}.`,
    url: `${SITE_URL}/filing/${record.accessionNumber}/`,
    sameAs: record.edgarFilingUrl,
    creator: {
      "@type": "Organization",
      name: filerName,
      identifier: `CIK:${record.cik}`,
    },
    publisher: { "@type": "Organization", name: "SecFilingDex" },
    license: "https://www.usa.gov/government-works",
    isAccessibleForFree: true,
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: `${SITE_URL}/api/filing/${record.accessionNumber}.json`,
    },
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <main className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-caption text-dim mb-6 flex flex-wrap gap-1.5 items-center">
          <Link href="/" className="hover:text-text">SecFilingDex</Link>
          <span>›</span>
          <Link
            href={`/form/${formTypeToSlug(record.formType)}/`}
            className="hover:text-text"
          >
            {record.formType}
          </Link>
          <span>›</span>
          <Link
            href={`/filer/${record.cik}/`}
            className="hover:text-text truncate"
          >
            {filerName}
          </Link>
        </nav>

        {/* Filing header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-chip border border-border bg-surface-brand font-mono text-data-cell text-brand">
              {record.formType}
            </span>
            {record.isAmendment && (
              <span className="px-2.5 py-1 rounded-chip border border-border bg-surface-amend font-mono text-data-cell text-signal-amend">
                AMENDMENT
              </span>
            )}
            {ticker && (
              <span className="px-2.5 py-1 rounded-chip border border-border bg-panel font-mono text-data-cell text-text">
                {ticker}
              </span>
            )}
            <span className="text-caption text-dim">
              CIK <span className="font-mono">{record.cik}</span>
            </span>
          </div>

          <h1 className="text-display-2 mb-3">{filerName}</h1>
          <p className="text-body-lg text-muted">
            {formLabel} ({record.formType}) filed{" "}
            <time dateTime={record.filedAt} className="text-text">
              {formatDate(record.filedAt)}
            </time>
            .
          </p>

          {info?.definition && (
            <p className="text-body text-dim mt-4 max-w-2xl">
              {info.definition}
            </p>
          )}
        </header>

        {/* Zero-lag activation layer. Renders NOTHING until a NEXT_PUBLIC_AFF_*
            env var is set — see lib/partners.ts. Sits directly below the filing
            header because that is the highest-intent moment on the site: the
            reader has just landed on one specific document for one specific
            company. Above the facts table so it never reads as a footer ad. */}
        <PartnerTools subject={ticker} />

        {/* Data table — facts at a glance */}
        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-4">Filing facts</p>
          <dl className="rounded-card-lg border border-border bg-panel/40 overflow-hidden">
            <FactRow
              label="Accession number"
              value={record.accessionNumber}
              mono
            />
            <FactRow label="Filer" value={filerName} />
            {ticker && <FactRow label="Ticker" value={ticker} mono />}
            <FactRow label="CIK" value={record.cik} mono />
            <FactRow label="Form type" value={record.formType} mono />
            {info && <FactRow label="Form description" value={info.shortName} />}
            <FactRow label="Filed at" value={formatDate(record.filedAt)} />
            {record.periodOfReport && (
              <FactRow
                label="Period of report"
                value={record.periodOfReport}
                mono
              />
            )}
            {record.sicCode && (
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 px-5 py-3 border-t border-border first:border-t-0">
                <dt className="text-body-sm text-muted sm:w-44 sm:shrink-0">Industry</dt>
                <dd className="text-body text-text break-all">
                  <Link
                    href={`/industry/${record.sicCode}/`}
                    className="hover:underline"
                  >
                    <span className="font-mono text-data-cell mr-2 text-dim">
                      SIC {record.sicCode}
                    </span>
                    <span>{sicCodeToName(record.sicCode)}</span>
                  </Link>
                </dd>
              </div>
            )}
            {record.size && (
              <FactRow label="Filing size" value={bytes(record.size)} />
            )}
            <FactRow
              label="Last verified"
              value={formatDate(record.indexedAt)}
              note="SecFilingDex pulls from EDGAR with daily cadence"
            />
          </dl>
        </section>

        {/* Provenance + links */}
        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-4">Provenance</p>
          <div className="rounded-card-lg border border-border bg-panel/40 p-6 space-y-4">
            <div>
              <p className="text-body-sm text-muted mb-2">
                Authoritative source — SEC EDGAR
              </p>
              <Link
                href={record.edgarFilingUrl}
                target="_blank"
                rel="noopener"
                className="font-mono text-data-cell text-brand hover:underline break-all"
              >
                {record.edgarFilingUrl} ↗
              </Link>
            </div>
            <div>
              <p className="text-body-sm text-muted mb-2">
                Filer&apos;s full EDGAR submission history
              </p>
              <Link
                href={cikUrl}
                target="_blank"
                rel="noopener"
                className="font-mono text-data-cell text-brand hover:underline break-all"
              >
                EDGAR · {filerName} ({record.cik}) ↗
              </Link>
            </div>
            <div>
              <p className="text-body-sm text-muted mb-2">
                Machine-readable JSON twin (LLM-citation friendly)
              </p>
              <Link
                href={`/api/filing/${record.accessionNumber}.json`}
                className="font-mono text-data-cell text-brand hover:underline break-all"
              >
                /api/filing/{record.accessionNumber}.json
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-10">
          <p className="text-body-sm text-dim max-w-2xl">
            SecFilingDex republishes SEC EDGAR data with provenance. EDGAR is
            the authoritative source. SecFilingDex is independent and not
            affiliated with the U.S. Securities and Exchange Commission.
            Nothing on this page constitutes investment, legal, tax, or other
            professional advice.
          </p>
        </section>
      </main>
      <SiteFooter books />
    </>
  );
}

function FactRow({
  label,
  value,
  note,
  mono,
}: {
  label: string;
  value: string;
  note?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 px-5 py-3 border-t border-border first:border-t-0">
      <dt className="text-body-sm text-muted sm:w-44 sm:shrink-0">{label}</dt>
      <dd
        className={`text-body text-text break-all ${
          mono ? "font-mono text-data-cell" : ""
        }`}
      >
        {value}
        {note && (
          <span className="block text-caption text-dim mt-0.5">{note}</span>
        )}
      </dd>
    </div>
  );
}
