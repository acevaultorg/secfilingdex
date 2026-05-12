import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How SecFilingDex collects, normalises, and republishes SEC EDGAR filings. Data sources, indexing cadence, taxonomy decisions, structured-data approach, source attribution, and the line between republishing public-domain government data and adding editorial value.",
  alternates: { canonical: `${SITE_URL}/methodology/` },
  openGraph: {
    type: "article",
    title: "SecFilingDex Methodology",
    description:
      "How SecFilingDex turns raw SEC EDGAR data into a programmatic, citation-grade database.",
    url: `${SITE_URL}/methodology/`,
    siteName: "SecFilingDex",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecFilingDex Methodology",
  },
};

export default function MethodologyPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "SecFilingDex Methodology — how SEC EDGAR filings become a structured database",
    description:
      "Data sources, indexing cadence, taxonomy, structured-data approach, source attribution, editorial principles.",
    author: {
      "@type": "Organization",
      name: "SecFilingDex",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "SecFilingDex",
      url: SITE_URL,
    },
    datePublished: "2026-05-12",
    dateModified: "2026-05-12",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/methodology/` },
    inLanguage: "en",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SecFilingDex", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Methodology", item: `${SITE_URL}/methodology/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-prose px-4 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-accent font-bold mb-3">
            Methodology
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
            How SecFilingDex works
          </h1>
          <p className="mt-5 text-lg text-text-secondary leading-relaxed">
            SecFilingDex turns the U.S. Securities and Exchange Commission&rsquo;s EDGAR
            system &mdash; a sprawling, hard-to-search trove of public-domain corporate
            filings &mdash; into a programmatic, citation-grade database. This page is
            the full version of how that pipeline works, where the data comes from, what
            we add on top of EDGAR, and where the editorial line sits.
          </p>
        </header>

        <section className="prose-content">
          <h2 className="text-2xl font-semibold mt-12 mb-3 text-text-primary">
            Data sources
          </h2>
          <p>
            Every filing on SecFilingDex is sourced from the SEC&rsquo;s EDGAR system
            via the public bulk-data APIs:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <strong>EDGAR submissions JSON</strong>{" "}
              (<code>data.sec.gov/submissions/CIK*.json</code>) for filer-level
              metadata: company name, CIK, SIC code, fiscal-year-end, recent filing
              history.
            </li>
            <li>
              <strong>EDGAR full-text search</strong>{" "}
              (<code>efts.sec.gov/LATEST/search-index</code>) for full filing
              discovery and incremental indexing.
            </li>
            <li>
              <strong>EDGAR form indexes</strong> for form-type taxonomy (10-K, 10-Q,
              8-K, 13F, 13D/G, S-1, Proxy DEF 14A, Form 4, 20-F, 6-K).
            </li>
            <li>
              <strong>SIC code dictionary</strong> from the SEC&rsquo;s Division of
              Corporation Finance for industry classification.
            </li>
          </ul>
          <p className="mt-4">
            SEC EDGAR is U.S. federal-government public-domain data; republishing it in
            a structured form is explicitly allowed under{" "}
            <a
              href="https://www.sec.gov/oit/announcement/new-rate-control-limits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              SEC&rsquo;s fair-access policy
            </a>{" "}
            provided requesters identify themselves and stay within rate limits. We
            comply with both.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-3 text-text-primary">
            Indexing cadence
          </h2>
          <p>
            SecFilingDex refreshes the underlying filing dataset on a rolling schedule:
            new filings are picked up within hours of appearing on EDGAR; filer
            metadata refreshes weekly; SIC taxonomy refreshes monthly. Each filing
            page&rsquo;s <code>schema.org/dateModified</code> + the corresponding
            sitemap <code>lastmod</code> reflect the last time SecFilingDex verified
            the underlying EDGAR record, not the filer&rsquo;s original filing date
            (which is preserved separately as <code>filedAt</code>).
          </p>
          <p>
            For applications that need real-time filing alerts, EDGAR itself is the
            canonical source &mdash; we don&rsquo;t claim sub-second freshness, and we
            don&rsquo;t want to be the source of record for trading decisions. Our
            value is in the structured surface, the cross-filer relationship graph,
            and the citation-grade markup &mdash; not real-time race-to-publish.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-3 text-text-primary">
            Taxonomy decisions
          </h2>
          <p>
            Every filing on SecFilingDex is categorised along four orthogonal axes,
            each of which gets its own indexable surface:
          </p>
          <ol className="list-decimal pl-6 space-y-2 mt-3">
            <li>
              <strong>Form type</strong> (10-K, 10-Q, 8-K, 13F-HR, etc.) &mdash; the
              kind of filing it is. Each form type has a plain-English explainer at{" "}
              <Link href="/learn/" className="text-accent hover:underline">
                /learn/[form-type]
              </Link>{" "}
              and a per-form aggregator at <code>/form/[formType]/</code>.
            </li>
            <li>
              <strong>Filer</strong> (CIK + company name + ticker if any). Per-filer
              indexes at <code>/filer/[cik]/</code> show every filing we have for that
              filer.
            </li>
            <li>
              <strong>Industry</strong> (SIC code). Per-industry indexes at{" "}
              <code>/industry/[sicCode]/</code> show every filer in that SIC sector
              and their cumulative filing history.
            </li>
            <li>
              <strong>Date</strong> (filed timestamp). Recency-weighted ranking surfaces
              recent filings on aggregator pages.
            </li>
          </ol>
          <p className="mt-4">
            The choice of four axes (form / filer / industry / date) is deliberate
            &mdash; it&rsquo;s the minimum that lets users find a filing without
            knowing the accession number, and the maximum that doesn&rsquo;t collapse
            into a confusing matrix of redundant pages.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-3 text-text-primary">
            Structured-data approach
          </h2>
          <p>
            Every page on SecFilingDex emits JSON-LD structured data:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <strong>Filing pages</strong> emit <code>Article</code> +{" "}
              <code>Dataset</code> schema with full filer identity, form type, filed
              date, accession number, and a link to the EDGAR source. The Article
              author is SecFilingDex (we wrote the page); the underlying filing
              authorship is the filer (the company that filed it) and we mark that
              explicitly via the <code>about</code> field.
            </li>
            <li>
              <strong>Filer pages</strong> emit <code>Organization</code> +{" "}
              <code>Dataset</code> schema describing the filer&rsquo;s identity and
              filing history.
            </li>
            <li>
              <strong>Industry pages</strong> emit <code>CollectionPage</code>{" "}
              + <code>Dataset</code> schema with the SIC code, sector name, and
              constituent filer count.
            </li>
            <li>
              <strong>Form-type explainer pages</strong> (<code>/learn/[form-type]</code>){" "}
              emit <code>Article</code> + <code>DefinedTerm</code> schema for citation
              by AI agents looking up form-type definitions.
            </li>
            <li>
              <strong>Twin JSON endpoints</strong> at{" "}
              <code>/api/filing/[accession].json</code> mirror every filing page in
              machine-readable form (Aleyda Solis &ldquo;Extractable&rdquo; LLM-citation
              characteristic).
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-12 mb-3 text-text-primary">
            Source attribution &mdash; we don&rsquo;t hide where this came from
          </h2>
          <p>
            Every filing page on SecFilingDex links back to the original EDGAR source
            in the page header, the body, the JSON-LD <code>citation</code> field,
            and the API endpoint. SecFilingDex does NOT claim to be the source of
            record for SEC filings &mdash; EDGAR is, and we treat that as the
            authoritative reference. Our value is in the surface (search, taxonomy,
            cross-references, structured-data twins), not in re-issuing the filings.
          </p>
          <p>
            When this matters: if a discrepancy appears between SecFilingDex and
            EDGAR (e.g., a filer&rsquo;s name updates on EDGAR before our nightly
            refresh catches it), EDGAR wins. Our pages may lag the source by up to a
            few hours; users who need millisecond-current SEC data should consume
            EDGAR&rsquo;s API directly.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-3 text-text-primary">
            Editorial vs. data-display boundary
          </h2>
          <p>
            SecFilingDex publishes raw filing data + plain-English form-type
            explainers + taxonomic indexes. We do NOT:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              Issue verdict labels on filers (no &ldquo;Buy AAPL on the basis of
              this 13F&rdquo;, no &ldquo;Sell&rdquo; recommendations &mdash; we
              don&rsquo;t hold licensed investment-advisor credentials).
            </li>
            <li>
              Predict price movements from filing patterns.
            </li>
            <li>
              Make investment recommendations of any kind.
            </li>
            <li>
              Aggregate filings into &ldquo;insider trading signals&rdquo; or similar
              actionable claims.
            </li>
          </ul>
          <p className="mt-4">
            Our editorial work is the form-type explainers at{" "}
            <Link href="/learn/" className="text-accent hover:underline">
              /learn/
            </Link>{" "}
            (what a 10-K is, what 13F deadlines mean, why 8-K matters in M&amp;A),
            the taxonomy decisions above, and the per-page structured-data wiring.
            Everything else is mechanical republishing of public-domain government
            data, marked as such in the schema.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-3 text-text-primary">
            Corrections + takedowns
          </h2>
          <p>
            Spot a factual error on any SecFilingDex page? Email{" "}
            <a href="mailto:hello@secfilingdex.com" className="text-accent hover:underline">
              hello@secfilingdex.com
            </a>{" "}
            with the URL of the page and a description of the issue. Corrections
            post within 5 business days; the page&rsquo;s <code>dateModified</code>{" "}
            updates accordingly so search engines and LLMs see the freshness signal.
          </p>
          <p>
            SEC EDGAR filings are public-domain. SecFilingDex republishes them under
            that classification with full attribution. If you are an EDGAR filer
            and want a page on SecFilingDex amended (e.g., your filer name updated
            after a corporate name change), email us; we update within 48 hours of
            verification. SecFilingDex does not field takedown requests for filings
            on the basis of substantive content &mdash; that is between the filer and
            the SEC.
          </p>
        </section>

        <footer className="mt-12 pt-6 border-t border-border text-xs text-text-tertiary">
          <p>
            Methodology last updated 2026-05-12. Operator identity, fleet context, and
            broader editorial perspective at{" "}
            <Link href="/about/" className="text-accent hover:underline">
              /about/
            </Link>
            . Plain-English form-type explainers at{" "}
            <Link href="/learn/" className="text-accent hover:underline">
              /learn/
            </Link>
            .
          </p>
        </footer>
      </main>
      <SiteFooter />
    </>
  );
}
