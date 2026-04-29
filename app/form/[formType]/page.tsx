import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { loadFilingsByFormType, uniqueFormTypes } from "@/lib/filings";
import { formTypeToSlug, slugToFormType } from "@/lib/types";
import { formatDateShort, formTypeInfo, pickEnrichments } from "@/lib/format";

const SITE_URL = "https://secfilingdex.com";

export const dynamicParams = false;

export async function generateStaticParams() {
  return uniqueFormTypes().map((ft) => ({ formType: formTypeToSlug(ft) }));
}

interface Params {
  formType: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { formType: slug } = await params;
  const formType = slugToFormType(slug);
  const info = formTypeInfo(formType);
  const filings = loadFilingsByFormType(formType);
  const shortName = info?.shortName ?? "SEC filing";
  const title = `${formType} filings — ${shortName}`;
  const description = info
    ? `${info.definition} ${filings.length} recent ${formType} filings indexed from SEC EDGAR. Cadence: ${info.cadence}.`
    : `${filings.length} recent ${formType} filings indexed from SEC EDGAR.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/form/${slug}/` },
    openGraph: { type: "website", title, description, siteName: "SecFilingDex" },
  };
}

export default async function FormTypePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { formType: slug } = await params;
  const formType = slugToFormType(slug);
  const info = formTypeInfo(formType);
  const filings = loadFilingsByFormType(formType);
  if (filings.length === 0) notFound();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${formType} filings · SecFilingDex`,
    description: info?.definition ?? `Recent ${formType} filings from SEC EDGAR.`,
    url: `${SITE_URL}/form/${slug}/`,
    isPartOf: { "@type": "WebSite", name: "SecFilingDex", url: SITE_URL },
    hasPart: filings.slice(0, 50).map((f) => ({
      "@type": "Article",
      url: `${SITE_URL}/filing/${f.accessionNumber}/`,
      datePublished: f.filedAt,
      headline: `${pickEnrichments(f).filerName} ${f.formType}`,
    })),
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <main className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-caption text-dim mb-6 flex flex-wrap gap-1.5 items-center">
          <Link href="/" className="hover:text-text">SecFilingDex</Link>
          <span>›</span>
          <span className="text-muted">{formType}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <p className="text-eyebrow text-brand mb-3">SEC form type</p>
          <h1 className="text-display-2 mb-4 flex flex-wrap items-baseline gap-3">
            <span className="font-mono">{formType}</span>
            {info?.shortName && (
              <span className="text-muted text-heading-1 font-normal">
                · {info.shortName}
              </span>
            )}
          </h1>
          {info?.definition && (
            <p className="text-body-lg text-muted max-w-3xl mb-6">
              {info.definition}
            </p>
          )}
          {info && (
            <dl className="grid sm:grid-cols-2 gap-3 max-w-2xl text-body-sm">
              <div className="rounded-card border border-border bg-panel/40 p-4">
                <dt className="text-eyebrow text-dim mb-1">Cadence</dt>
                <dd className="text-text">{info.cadence}</dd>
              </div>
              <div className="rounded-card border border-border bg-panel/40 p-4">
                <dt className="text-eyebrow text-dim mb-1">Audience</dt>
                <dd className="text-text capitalize">{info.audience}</dd>
              </div>
            </dl>
          )}
        </header>

        {/* Filing list */}
        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-4">
            Recent filings · {filings.length} indexed
          </p>
          <div className="rounded-card-lg border border-border bg-panel/40 overflow-hidden">
            <ul className="divide-y divide-border">
              {filings.map((f) => {
                const { filerName, ticker } = pickEnrichments(f);
                return (
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
                      <span className="text-text flex-1 break-words">
                        {filerName}
                        {ticker && (
                          <span className="ml-2 font-mono text-data-cell text-muted">
                            {ticker}
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-caption text-dim shrink-0 tabular">
                        {f.accessionNumber}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Other form types */}
        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-4">Other form types</p>
          <div className="flex flex-wrap gap-2">
            {uniqueFormTypes()
              .filter((ft) => ft !== formType)
              .map((ft) => (
                <Link
                  key={ft}
                  href={`/form/${formTypeToSlug(ft)}/`}
                  className="px-3 py-1.5 rounded-pill border border-border bg-panel/40 hover:border-border-bright transition-colors font-mono text-data-cell text-text"
                >
                  {ft}
                </Link>
              ))}
          </div>
        </section>

        <section className="text-body-sm text-dim max-w-2xl">
          <p>
            Source: SEC EDGAR. SecFilingDex is independently operated and not
            affiliated with the U.S. Securities and Exchange Commission. EDGAR
            is the authoritative source for all filings.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
