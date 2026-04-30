import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { loadFilingsBySic, uniqueSicCodes } from "@/lib/filings";
import { formTypeToSlug } from "@/lib/types";
import { sicCodeToName } from "@/lib/sic";
import { formatDateShort, pickEnrichments } from "@/lib/format";

const SITE_URL = "https://secfilingdex.com";

export const dynamicParams = false;

export async function generateStaticParams() {
  return uniqueSicCodes().map((code) => ({ sicCode: code }));
}

interface Params {
  sicCode: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { sicCode } = await params;
  const industryName = sicCodeToName(sicCode);
  const filings = loadFilingsBySic(sicCode);
  const filerCount = new Set(filings.map((f) => f.cik)).size;
  const formCount = new Set(filings.map((f) => f.formType)).size;
  const title = `${industryName} — SIC ${sicCode} filings`;
  const description = `${filings.length} SEC filings indexed across ${filerCount} filers in ${industryName} (SIC ${sicCode}). ${formCount} form types represented.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/industry/${sicCode}/` },
    openGraph: { type: "website", title, description, siteName: "SecFilingDex" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { sicCode } = await params;
  const filings = loadFilingsBySic(sicCode);
  if (filings.length === 0) notFound();

  const industryName = sicCodeToName(sicCode);

  // Aggregate filers in this industry (deduped, with most-recent filing)
  const filerMap = new Map<string, { cik: string; filerName: string; ticker?: string; mostRecent: string; count: number }>();
  for (const f of filings) {
    const existing = filerMap.get(f.cik);
    const enriched = pickEnrichments(f);
    if (!existing) {
      filerMap.set(f.cik, {
        cik: f.cik,
        filerName: enriched.filerName,
        ticker: enriched.ticker,
        mostRecent: f.filedAt,
        count: 1,
      });
    } else {
      existing.count += 1;
      if (f.filedAt > existing.mostRecent) existing.mostRecent = f.filedAt;
    }
  }
  const filers = Array.from(filerMap.values()).sort((a, b) => b.mostRecent.localeCompare(a.mostRecent));

  // Aggregate form-type breakdown for this industry
  const formCounts = new Map<string, number>();
  for (const f of filings) {
    formCounts.set(f.formType, (formCounts.get(f.formType) ?? 0) + 1);
  }
  const forms = Array.from(formCounts.entries()).sort((a, b) => b[1] - a[1]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${industryName} — SIC ${sicCode} · SecFilingDex`,
    description: `${filings.length} SEC filings from filers classified under SIC ${sicCode} (${industryName}).`,
    url: `${SITE_URL}/industry/${sicCode}/`,
    isPartOf: { "@type": "WebSite", name: "SecFilingDex", url: SITE_URL },
    about: {
      "@type": "DefinedTerm",
      termCode: sicCode,
      name: industryName,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Standard Industrial Classification (SIC)",
        url: "https://www.sec.gov/info/edgar/siccodes",
      },
    },
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
          <span className="text-muted">Industry · SIC {sicCode}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <p className="text-eyebrow text-brand mb-3">Industry · SIC {sicCode}</p>
          <h1 className="text-display-2 mb-4">{industryName}</h1>
          <p className="text-body-lg text-muted max-w-3xl mb-6">
            {filings.length} filing{filings.length === 1 ? "" : "s"} from {filers.length}{" "}
            filer{filers.length === 1 ? "" : "s"} classified under Standard Industrial
            Classification (SIC) code {sicCode}, indexed from SEC EDGAR.
          </p>
          <dl className="grid sm:grid-cols-3 gap-3 max-w-2xl text-body-sm">
            <div className="rounded-card border border-border bg-panel/40 p-4">
              <dt className="text-eyebrow text-dim mb-1">SIC code</dt>
              <dd className="text-text font-mono tabular">{sicCode}</dd>
            </div>
            <div className="rounded-card border border-border bg-panel/40 p-4">
              <dt className="text-eyebrow text-dim mb-1">Filers</dt>
              <dd className="text-text tabular">{filers.length}</dd>
            </div>
            <div className="rounded-card border border-border bg-panel/40 p-4">
              <dt className="text-eyebrow text-dim mb-1">Form types</dt>
              <dd className="text-text tabular">{forms.length}</dd>
            </div>
          </dl>
        </header>

        {/* Filers in this industry */}
        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-4">
            Filers in this industry · {filers.length} indexed
          </p>
          <div className="rounded-card-lg border border-border bg-panel/40 overflow-hidden">
            <ul className="divide-y divide-border">
              {filers.map((filer) => (
                <li key={filer.cik}>
                  <Link
                    href={`/filer/${filer.cik}/`}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 px-5 py-4 hover:bg-surface-hover transition-colors"
                  >
                    <time
                      dateTime={filer.mostRecent}
                      className="font-mono text-data-cell text-dim sm:w-28 shrink-0 tabular"
                    >
                      {formatDateShort(filer.mostRecent)}
                    </time>
                    <span className="text-text flex-1 break-words">
                      {filer.filerName}
                      {filer.ticker && (
                        <span className="ml-2 font-mono text-data-cell text-muted">
                          {filer.ticker}
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-caption text-dim shrink-0 tabular">
                      {filer.count} filing{filer.count === 1 ? "" : "s"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Form-type breakdown */}
        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-4">Form types in this industry</p>
          <div className="flex flex-wrap gap-2">
            {forms.map(([formType, count]) => (
              <Link
                key={formType}
                href={`/form/${formTypeToSlug(formType)}/`}
                className="inline-flex items-center min-h-[40px] px-3.5 py-2 rounded-pill border border-border bg-panel/40 hover:border-border-bright transition-colors font-mono text-data-cell text-text gap-2"
              >
                <span>{formType}</span>
                <span className="text-dim">·</span>
                <span className="text-muted tabular">{count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Other industries */}
        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-4">Browse other industries</p>
          <div className="flex flex-wrap gap-2">
            {uniqueSicCodes()
              .filter((c) => c !== sicCode)
              .map((c) => (
                <Link
                  key={c}
                  href={`/industry/${c}/`}
                  className="inline-flex items-center min-h-[40px] px-3.5 py-2 rounded-pill border border-border bg-panel/40 hover:border-border-bright transition-colors text-data-cell text-text"
                >
                  <span className="font-mono text-dim mr-2">{c}</span>
                  <span>{sicCodeToName(c)}</span>
                </Link>
              ))}
          </div>
        </section>

        <section className="text-body-sm text-dim max-w-2xl">
          <p>
            Source: SEC EDGAR. SIC codes per the Standard Industrial Classification
            assigned by the SEC. SecFilingDex is independently operated and not
            affiliated with the U.S. Securities and Exchange Commission.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
