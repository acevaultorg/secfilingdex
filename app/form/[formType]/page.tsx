import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { loadFilingsByFormType, uniqueFormTypes } from "@/lib/filings";
import { formTypeToSlug, slugToFormType } from "@/lib/types";
import { formatDateShort, formTypeInfo, pickEnrichments } from "@/lib/format";
import { learnSlugForForm } from "@/lib/learn";

const SITE_URL = "https://secfilingdex.com";

// Cross-link a /form/[type] DB hub to its plain-English /learn/[slug] explainer
// when one exists (mapping lives in lib/learn.ts, shared with /filing/ pages).

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
    twitter: { card: "summary_large_image", title, description },
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

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${formType} filings dataset`,
    description: info
      ? `${info.definition} ${filings.length} recent ${formType} filings indexed from SEC EDGAR with filer name, ticker, accession number, and filed-date. Cadence: ${info.cadence}.`
      : `${filings.length} recent ${formType} filings indexed from SEC EDGAR.`,
    url: `${SITE_URL}/form/${slug}/`,
    identifier: `form-${slug}`,
    keywords: [formType, info?.shortName, "SEC EDGAR", "SEC filings", "SecFilingDex"].filter(Boolean),
    creator: { "@type": "Organization", name: "SecFilingDex", url: SITE_URL },
    license: "https://www.sec.gov/about/sec-website-policies/copyright",
    isAccessibleForFree: true,
    isPartOf: { "@type": "DataCatalog", name: "SecFilingDex filings", url: `${SITE_URL}/form/` },
    dateModified: filings[0]?.filedAt ?? new Date().toISOString().slice(0, 10),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SecFilingDex", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Form types", item: `${SITE_URL}/form/` },
      { "@type": "ListItem", position: 3, name: formType, item: `${SITE_URL}/form/${slug}/` },
    ],
  };

  const learnSlug = learnSlugForForm(slug);

  const audienceText =
    info?.audience === "both"
      ? "both individual investors and regulators"
      : info?.audience === "investor"
        ? "investors and analysts"
        : info?.audience === "regulator"
          ? "regulators and compliance teams"
          : "investors and researchers";

  // FAQ answers derive ONLY from the verified FORM_TYPE_CATALOG fields
  // (definition · cadence · audience) + the real indexed filing count.
  // Zero fabrication — every fact traces to SEC form definitions or EDGAR.
  const faqItems = info
    ? [
        { q: `What is a ${formType} filing?`, a: info.definition },
        {
          q: `How often is a ${formType} filed?`,
          a: `${formType} filings are filed on ${
            /^[aeiou]/.test(info.cadence.toLowerCase()) ? "an" : "a"
          } ${info.cadence.toLowerCase()} cadence.`,
        },
        {
          q: `Who reads ${formType} filings?`,
          a: `${formType} filings are primarily relevant to ${audienceText}.`,
        },
        {
          q: `Where can I read ${formType} filings?`,
          a: `Every ${formType} filing is public and filed with the U.S. SEC through EDGAR. SecFilingDex indexes ${filings.length} recent ${formType} filing${
            filings.length === 1 ? "" : "s"
          }, each linking back to its original EDGAR source.`,
        },
      ]
    : [];

  const faqSchema =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
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

        {/* Hub-cluster cross-link → plain-English explainer (equity concentration + reader path) */}
        {learnSlug && (
          <div className="mb-10 rounded-card border border-brand-soft bg-surface-brand p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-body-sm text-muted">
              New to {formType}? Read the plain-English explainer — what it is, who
              files it, and how to read one.
            </p>
            <Link
              href={`/learn/${learnSlug}/`}
              className="shrink-0 inline-flex items-center min-h-[40px] text-body-sm text-brand font-medium hover:underline"
            >
              {formType} explained →
            </Link>
          </div>
        )}

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

        {/* FAQ — verified SEC facts, FAQPage-schema'd for AEO / AI-citation capture */}
        {faqItems.length > 0 && (
          <section className="mb-10">
            <p className="text-eyebrow text-brand mb-4">Frequently asked</p>
            <dl className="rounded-card-lg border border-border bg-panel/40 divide-y divide-border overflow-hidden">
              {faqItems.map((item) => (
                <div key={item.q} className="px-5 py-4">
                  <dt className="text-body text-text font-medium mb-1.5">
                    {item.q}
                  </dt>
                  <dd className="text-body-sm text-muted">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

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
                  className="inline-flex items-center min-h-[40px] px-3.5 py-2 rounded-pill border border-border bg-panel/40 hover:border-border-bright transition-colors font-mono text-data-cell text-text"
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
          <p className="mt-3">
            Sister property:{" "}
            <a
              href="https://holdlens.com/"
              className="underline"
              rel="noopener"
            >
              HoldLens
            </a>
            {" "}— applied-analysis surface for tracked superinvestors. Where SecFilingDex catalogs
            every filing, HoldLens reads the {formType} filings of 30 tracked managers on a
            −100..+100 ConvictionScore.
          </p>
        </section>
      </main>
      <SiteFooter books />
    </>
  );
}
