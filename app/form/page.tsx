import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { loadAllFilings, loadFilingsByFormType, uniqueFormTypes } from "@/lib/filings";
import { formTypeToSlug } from "@/lib/types";
import { formTypeInfo } from "@/lib/format";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "Browse SEC filings by form type — 10-K, 10-Q, 8-K, 13F, Form 4 index",
  description:
    "Browse SEC EDGAR filings by form type. Comprehensive index of every form type indexed by SecFilingDex with filing counts, cadence, and direct links to per-form-type hub pages.",
  alternates: { canonical: `${SITE_URL}/form/` },
  openGraph: {
    type: "website",
    title: "Browse SEC filings by form type · SecFilingDex",
    description:
      "Form-type index of SEC EDGAR filings. 10-K, 10-Q, 8-K, 13F, Form 3/4/5, S-1, DEF 14A, 20-F, 6-K and more.",
    siteName: "SecFilingDex",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse SEC filings by form type · SecFilingDex",
    description: "Every SEC form type, indexed.",
  },
};

export default function FormIndex() {
  const types = uniqueFormTypes();
  const allFilings = loadAllFilings();

  const forms = types
    .map((ft) => {
      const info = formTypeInfo(ft);
      const filings = loadFilingsByFormType(ft);
      return {
        formType: ft,
        slug: formTypeToSlug(ft),
        shortName: info?.shortName,
        cadence: info?.cadence,
        audience: info?.audience,
        filingCount: filings.length,
      };
    })
    .sort((a, b) => b.filingCount - a.filingCount);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Browse SEC filings by form type · SecFilingDex",
    description: "Index of every SEC form type indexed by SecFilingDex.",
    url: `${SITE_URL}/form/`,
    isPartOf: { "@type": "WebSite", name: "SecFilingDex", url: SITE_URL },
    hasPart: forms.map((f) => ({
      "@type": "WebPage",
      name: `${f.formType}${f.shortName ? ` — ${f.shortName}` : ""}`,
      url: `${SITE_URL}/form/${f.slug}/`,
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
        <nav className="text-caption text-dim mb-6 flex flex-wrap gap-1.5 items-center">
          <Link href="/" className="hover:text-text">SecFilingDex</Link>
          <span>›</span>
          <span className="text-muted">Form-type index</span>
        </nav>

        <header className="mb-10">
          <p className="text-eyebrow text-brand mb-3">Form-type index</p>
          <h1 className="text-display-2 mb-4">Browse SEC filings by form type</h1>
          <p className="text-body-lg text-muted max-w-3xl mb-6">
            {forms.length} SEC form types represented across {allFilings.length}{" "}
            indexed filings. Each form type has its own hub page with cadence,
            audience, and recent filings from EDGAR.
          </p>
        </header>

        <section className="mb-10">
          <p className="text-eyebrow text-brand mb-4">
            All form types · sorted by filing count
          </p>
          <div className="rounded-card-lg border border-border bg-panel/40 overflow-hidden">
            <ul className="divide-y divide-border">
              {forms.map((f) => (
                <li key={f.formType}>
                  <Link
                    href={`/form/${f.slug}/`}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 px-5 py-4 hover:bg-surface-hover transition-colors"
                  >
                    <span className="font-mono text-data-cell text-text sm:w-20 shrink-0 tabular">
                      {f.formType}
                    </span>
                    <span className="text-text flex-1 break-words">
                      {f.shortName ?? "SEC filing"}
                      {f.cadence && (
                        <span className="ml-2 text-caption text-dim">
                          · {f.cadence}
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
