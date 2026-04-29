import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About",
  description:
    "About SecFilingDex — operator identity, methodology, data sources, and editorial principles for republishing SEC EDGAR filings as a programmatic database surface.",
  alternates: { canonical: "https://secfilingdex.com/about/" },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Paulo de Vries",
  url: "https://secfilingdex.com/about/",
  jobTitle: "Founder, SecFilingDex",
  worksFor: {
    "@type": "Organization",
    name: "SecFilingDex",
    url: "https://secfilingdex.com",
  },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <p className="text-eyebrow text-brand mb-4">About</p>
        <h1 className="text-display-2 mb-3">About SecFilingDex</h1>
        <p className="text-body-lg text-muted mb-10">
          A programmatic database surface over SEC EDGAR filings, built for
          finance prosumers, developers, and AI agents who need a faster, more
          searchable, more citation-friendly source than EDGAR&apos;s native UI.
        </p>

        <div className="space-y-10 text-body text-muted">
          <section>
            <h2 className="text-heading-1 text-text mb-3">What this site is</h2>
            <p className="mb-3">
              SecFilingDex is the <strong className="text-text">dex</strong> of
              SEC filings. Every filing on EDGAR &mdash; 10-K, 10-Q, 8-K, 13F,
              13D/G, S-1, Form 4, DEF 14A, 20-F, 6-K, and more &mdash; gets its
              own programmatic page, its own structured-data schema, and its
              own machine-readable JSON twin at{" "}
              <code className="font-mono text-text">/api/[slug].json</code>.
            </p>
            <p>
              We don&apos;t replace EDGAR. We index it, normalize it, and make
              it scannable. EDGAR remains the authoritative source. SecFilingDex
              is the lens.
            </p>
          </section>

          <section>
            <h2 className="text-heading-1 text-text mb-3">Operator</h2>
            <p className="mb-3">
              SecFilingDex is built and operated by{" "}
              <strong className="text-text">Paulo de Vries</strong>, a solo
              founder running a small fleet of static-reference data sites in
              the AceVault portfolio. Sister site:{" "}
              <Link
                href="https://holdlens.com"
                target="_blank"
                rel="noopener"
                className="text-brand hover:underline"
              >
                HoldLens
              </Link>{" "}
              &mdash; a signal-spectrum lens on superinvestor 13F filings,
              complementary to but distinct from this database lens.
            </p>
            <p>
              Contact: <Link href="/contact" className="text-brand hover:underline">contact page</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-heading-1 text-text mb-3">Methodology</h2>
            <p className="mb-3">
              Every filing page on SecFilingDex is sourced directly from SEC
              EDGAR. We fetch filings via the public EDGAR system (no API key
              required for filings index), normalize metadata, and publish each
              filing with full provenance:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mb-3">
              <li>Original SEC EDGAR URL</li>
              <li>Accession number (the SEC&apos;s permanent unique identifier)</li>
              <li>Central Index Key (CIK) of the filer</li>
              <li>
                Filing date (<code className="font-mono text-text">datePublished</code>) and
                form type
              </li>
              <li>
                Last-verified timestamp (
                <code className="font-mono text-text">dateModified</code>)
                visible on each page
              </li>
            </ul>
            <p>
              <strong className="text-text">No filing data is fabricated.</strong>{" "}
              If we don&apos;t have the data, we 404. Editorial annotations
              (taxonomy, diff highlights, related-filer linking) are
              clearly marked and licensed CC-BY-4.0 with attribution.
            </p>
          </section>

          <section>
            <h2 className="text-heading-1 text-text mb-3">Data freshness</h2>
            <p>
              SecFilingDex pulls from EDGAR daily, with intra-day pulls during
              high-activity windows (earnings season, quarterly 13F deadlines).
              Each filing page shows a visible &ldquo;last verified&rdquo;
              signal so you can see at a glance how recent the data is.
            </p>
          </section>

          <section>
            <h2 className="text-heading-1 text-text mb-3">Who this is for</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Finance prosumers</strong> &mdash;
                analysts, fund managers, and serious retail investors who want
                EDGAR data without EDGAR&apos;s 1990s UX.
              </li>
              <li>
                <strong className="text-text">Developers and data
                engineers</strong> &mdash; anyone building tools that need
                structured SEC filing access via a stable JSON API.
              </li>
              <li>
                <strong className="text-text">AI agents and LLM
                workflows</strong> &mdash; citation-grade, structured filing
                data is the kind of source LLMs cite well. Every page on
                SecFilingDex is designed to be quote-ready.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-heading-1 text-text mb-3">License + attribution</h2>
            <p className="mb-3">
              SEC filings are public domain works of the U.S. government (17
              U.S.C. § 105). Our editorial annotations and composite indexing
              are released under{" "}
              <Link
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener"
                className="text-brand hover:underline"
              >
                CC-BY-4.0
              </Link>
              . If you cite SecFilingDex, please include a link back to the
              original filing page.
            </p>
            <p>
              For licensing inquiries beyond CC-BY-4.0, contact us via the
              contact page.
            </p>
          </section>

          <section>
            <h2 className="text-heading-1 text-text mb-3">Disclaimer</h2>
            <p>
              SecFilingDex is for informational purposes only. Nothing on this
              Site constitutes investment, legal, tax, or other professional
              advice. We are not a registered investment advisor.{" "}
              <strong className="text-text">
                Always verify against the original SEC EDGAR source
              </strong>{" "}
              before acting on filing data. SecFilingDex is independent and not
              affiliated with the U.S. Securities and Exchange Commission.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
