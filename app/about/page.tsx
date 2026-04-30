import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  loadAllFilings,
  uniqueCiks,
  uniqueFormTypes,
  uniqueSicCodes,
} from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "About",
  description:
    "About SecFilingDex — operator identity, methodology, data sources, editorial principles, and definitions for republishing SEC EDGAR filings as a programmatic database surface.",
  alternates: { canonical: `${SITE_URL}/about/` },
  openGraph: {
    type: "website",
    title: "About SecFilingDex",
    description:
      "Operator identity, methodology, data sources, editorial principles, and definitions.",
    siteName: "SecFilingDex",
  },
};

export default function AboutPage() {
  // Live stats — published in schema + visible on the page so the data
  // self-describes its scale at point of publication.
  const allFilings = loadAllFilings();
  const filingCount = allFilings.length;
  const formTypeCount = uniqueFormTypes().length;
  const filerCount = uniqueCiks().length;
  const industryCount = uniqueSicCodes().length;
  const todayIso = new Date().toISOString().slice(0, 10);

  // Person schema (Aleyda Solis "Credible" + "Recognizable" characteristic).
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Paulo de Vries",
    url: `${SITE_URL}/about/`,
    jobTitle: "Founder, SecFilingDex",
    knowsAbout: [
      "SEC EDGAR",
      "Securities filings",
      "Programmatic web data",
      "Structured-data publishing",
      "AI-citation optimization",
    ],
    worksFor: {
      "@type": "Organization",
      name: "SecFilingDex",
      url: SITE_URL,
    },
  };

  // Organization schema with full live-stats Dataset reference (so LLMs +
  // structured-data crawlers can cite scale at point of indexing).
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SecFilingDex",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "Programmatic database surface over SEC EDGAR filings — every filing indexed, normalized, schema-tagged, and machine-readable.",
    foundingDate: "2026-04-28",
    founder: {
      "@type": "Person",
      name: "Paulo de Vries",
    },
    sameAs: ["https://github.com/acevaultorg/secfilingdex"],
    knowsAbout: [
      "SEC EDGAR",
      "10-K",
      "10-Q",
      "8-K",
      "13F",
      "Schedule 13D/G",
      "Form 4",
      "S-1",
      "DEF 14A",
      "20-F",
      "6-K",
      "SIC industry classification",
    ],
    subjectOf: {
      "@type": "Dataset",
      name: "SecFilingDex EDGAR filing index",
      description: `${filingCount} SEC filings across ${formTypeCount} form types, ${filerCount} unique filers, and ${industryCount} SIC industry classifications, indexed from SEC EDGAR.`,
      datePublished: "2026-04-30",
      dateModified: todayIso,
      keywords: "SEC, EDGAR, filings, 10-K, 10-Q, 8-K, 13F, Form 4, SIC",
      license: "https://creativecommons.org/licenses/by/4.0/",
      isAccessibleForFree: true,
      sourceOrganization: {
        "@type": "GovernmentOrganization",
        name: "U.S. Securities and Exchange Commission",
        url: "https://www.sec.gov",
      },
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/filings.json`,
        },
      ],
    },
  };

  // DefinedTerm schemas for citation-key concepts. LLMs cite these as
  // structured definitions when answering questions about EDGAR mechanics.
  const definedTerms = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: "Accession Number",
      termCode: "accession-number",
      description:
        "The SEC's permanent unique identifier for every filing on EDGAR, in the format NNNNNNNNNN-YY-NNNNNN. SecFilingDex uses the canonical hyphenated form everywhere; this is the single key that resolves a filing across all SecFilingDex pages, JSON twins, and EDGAR's own archive.",
      url: `${SITE_URL}/about/#accession-number`,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "SEC EDGAR Identifiers",
        url: "https://www.sec.gov/edgar",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: "CIK (Central Index Key)",
      termCode: "cik",
      description:
        "The SEC's 10-digit unique identifier for every filer (public company, fund, insider, beneficial owner). Stable across the filer's entire EDGAR history. SecFilingDex uses zero-padded 10-digit form.",
      url: `${SITE_URL}/about/#cik`,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "SEC EDGAR Identifiers",
        url: "https://www.sec.gov/edgar",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: "SIC (Standard Industrial Classification)",
      termCode: "sic",
      description:
        "The 4-digit industry-classification code assigned by the SEC to every filer. SecFilingDex's industry hub uses the canonical SEC SIC catalog.",
      url: `${SITE_URL}/about/#sic`,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Standard Industrial Classification (SIC)",
        url: "https://www.sec.gov/info/edgar/siccodes",
      },
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {definedTerms.map((dt) => (
          <script
            key={dt.termCode}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(dt) }}
          />
        ))}

        <p className="text-eyebrow text-brand mb-4">About</p>
        <h1 className="text-display-2 mb-3">About SecFilingDex</h1>

        {/* TL;DR — Aleyda Solis "Extractable" — quote-ready summary at top */}
        <p className="text-body-lg text-muted mb-4">
          SecFilingDex is a programmatic database surface over SEC EDGAR
          filings, built for finance prosumers, developers, and AI agents who
          need a faster, more searchable, more citation-friendly source than
          EDGAR&apos;s native UI.
        </p>
        <p className="text-body-lg text-text mb-10">
          <strong>Our view:</strong> SEC EDGAR is the authoritative public
          source for U.S. securities filings, but its 1990s UI obscures a
          fundamentally machine-readable corpus. SecFilingDex republishes
          every indexed filing with structured-data schema, JSON twins, and
          stable canonical URLs &mdash; the same dataset, made citable.
        </p>

        {/* Live stats — Aleyda "Recognizable" + "Useful" */}
        <section className="mb-12">
          <p className="text-eyebrow text-brand mb-3">Coverage at a glance</p>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-body-sm">
            <div className="rounded-card border border-border bg-panel/40 p-4">
              <dt className="text-eyebrow text-dim mb-1">Filings</dt>
              <dd className="text-text text-heading-2 tabular">{filingCount}</dd>
            </div>
            <div className="rounded-card border border-border bg-panel/40 p-4">
              <dt className="text-eyebrow text-dim mb-1">Form types</dt>
              <dd className="text-text text-heading-2 tabular">{formTypeCount}</dd>
            </div>
            <div className="rounded-card border border-border bg-panel/40 p-4">
              <dt className="text-eyebrow text-dim mb-1">Filers</dt>
              <dd className="text-text text-heading-2 tabular">{filerCount}</dd>
            </div>
            <div className="rounded-card border border-border bg-panel/40 p-4">
              <dt className="text-eyebrow text-dim mb-1">Industries</dt>
              <dd className="text-text text-heading-2 tabular">{industryCount}</dd>
            </div>
          </dl>
          <p className="text-caption text-dim mt-3">
            Last verified <time dateTime={todayIso}>{todayIso}</time>. Data
            sourced directly from SEC EDGAR; freshness checked on every deploy.
          </p>
        </section>

        <div className="space-y-10 text-body text-muted">
          <section>
            <h2 className="text-heading-1 text-text mb-3">What this site is</h2>
            <p className="mb-3">
              SecFilingDex is the <strong className="text-text">dex</strong> of
              SEC filings. Every filing on EDGAR &mdash; 10-K, 10-Q, 8-K, 13F,
              Schedule 13D/G, S-1, Form 4, DEF 14A, 20-F, 6-K, and more &mdash;
              gets its own programmatic page, its own structured-data schema,
              and its own machine-readable JSON twin at{" "}
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

          {/* Definitions — Aleyda "Extractable" — quote-ready key terms */}
          <section>
            <h2 className="text-heading-1 text-text mb-3">Key definitions</h2>
            <dl className="space-y-4">
              <div id="accession-number">
                <dt className="text-text font-mono mb-1">Accession Number</dt>
                <dd>
                  The SEC&apos;s permanent unique identifier for every filing
                  on EDGAR, in the format NNNNNNNNNN-YY-NNNNNN. SecFilingDex
                  uses the canonical hyphenated form everywhere; this is the
                  single key that resolves a filing across all SecFilingDex
                  pages, JSON twins, and EDGAR&apos;s own archive.
                </dd>
              </div>
              <div id="cik">
                <dt className="text-text font-mono mb-1">CIK (Central Index Key)</dt>
                <dd>
                  The SEC&apos;s 10-digit unique identifier for every filer
                  (public company, fund, insider, beneficial owner). Stable
                  across the filer&apos;s entire EDGAR history. SecFilingDex
                  uses the zero-padded 10-digit form.
                </dd>
              </div>
              <div id="sic">
                <dt className="text-text font-mono mb-1">
                  SIC (Standard Industrial Classification)
                </dt>
                <dd>
                  The 4-digit industry code the SEC assigns to every filer.
                  SecFilingDex&apos;s{" "}
                  <Link href="/industry/" className="text-brand hover:underline">
                    industry hub
                  </Link>{" "}
                  uses the canonical{" "}
                  <a
                    href="https://www.sec.gov/info/edgar/siccodes"
                    target="_blank"
                    rel="noopener"
                    className="text-brand hover:underline"
                  >
                    SEC SIC catalog
                  </a>
                  .
                </dd>
              </div>
            </dl>
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
