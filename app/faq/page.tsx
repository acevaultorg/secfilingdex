import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about SecFilingDex — what it is, where the data comes from, who built it, indexing cadence, structured-data approach, how to cite filings, API access, why we don't issue investment recommendations, and how to contact us about corrections.",
  alternates: { canonical: `${SITE_URL}/faq/` },
  openGraph: {
    type: "article",
    title: "SecFilingDex FAQ",
    description:
      "Common questions about the SEC EDGAR filing database and how SecFilingDex works.",
    url: `${SITE_URL}/faq/`,
    siteName: "SecFilingDex",
  },
  twitter: { card: "summary_large_image", title: "SecFilingDex FAQ" },
};

interface QA {
  q: string;
  a: React.ReactNode;
}

const FAQS: QA[] = [
  {
    q: "What is SecFilingDex?",
    a: (
      <>
        SecFilingDex is an index of SEC filings. We copy a growing set of filings
        from the U.S. Securities and Exchange Commission&rsquo;s public EDGAR
        system (mostly recent years, new ones daily), organise them by form type / filer / industry / date,
        and republish each filing as a structured, citation-grade page with a
        machine-readable JSON twin. Free for humans to browse, free for AI agents
        to cite, no paywall.
      </>
    ),
  },
  {
    q: "Where does the data come from?",
    a: (
      <>
        Every record on SecFilingDex is sourced from SEC EDGAR via the SEC&rsquo;s
        public bulk-data APIs (<code>data.sec.gov</code> and{" "}
        <code>efts.sec.gov</code>). EDGAR is U.S. federal public-domain data;
        republishing it in a structured form is explicitly permitted under
        the SEC&rsquo;s fair-access policy. Every filing page links back to the
        EDGAR source. Full pipeline details on the{" "}
        <Link href="/methodology/" className="text-accent hover:underline">
          methodology page
        </Link>
        .
      </>
    ),
  },
  {
    q: "How fresh is the data?",
    a: (
      <>
        New filings are picked up within hours of appearing on EDGAR. Filer metadata
        refreshes weekly. SIC industry taxonomy refreshes monthly. Each page&rsquo;s{" "}
        <code>dateModified</code> reflects the last time we verified the underlying
        EDGAR record. For real-time, sub-second-current filing alerts, EDGAR itself
        is the canonical source &mdash; SecFilingDex is the structured surface,
        not the race-to-publish service.
      </>
    ),
  },
  {
    q: "Who built SecFilingDex? Are you a registered investment advisor?",
    a: (
      <>
        SecFilingDex is operated by Paulo de Vries (Amsterdam). We are not a
        registered investment advisor (no SEC RIA registration, no FINRA Series 65,
        no MiFID II authorisation). SecFilingDex does NOT issue verdict labels (no
        &ldquo;buy&rdquo; / &ldquo;sell&rdquo; / &ldquo;target price&rdquo;), does
        NOT predict price movements, and does NOT make investment recommendations.
        We republish public-domain SEC filings with editorial taxonomy and
        plain-English explainers. What you do with the data is your decision; if
        that decision is investment-grade, consult a licensed advisor in your
        jurisdiction.
      </>
    ),
  },
  {
    q: "Can I cite SecFilingDex in a research paper / blog post / AI answer?",
    a: (
      <>
        Yes. Every page on SecFilingDex emits JSON-LD structured data with full
        author attribution. The Article schema author is SecFilingDex (we wrote
        the page); the underlying filing&rsquo;s authorship is the filer (the
        company that filed it), captured in the <code>about</code> field. If you
        need a stable URL for citation, every filing has a permanent URL of the
        form <code>/filing/[accession]/</code> &mdash; accession numbers are
        SEC-assigned and never change.
      </>
    ),
  },
  {
    q: "Do you have an API?",
    a: (
      <>
        Yes &mdash; every filing page has a machine-readable JSON twin at{" "}
        <code>/api/filing/[accession].json</code>. Filer pages have JSON twins at{" "}
        <code>/api/filer/[cik].json</code>. Industry pages at{" "}
        <code>/api/industry/[sicCode].json</code>. No authentication required;
        no rate limits beyond reasonable courtesy (please don&rsquo;t crawl us
        faster than you&rsquo;d crawl EDGAR itself, which sets the upstream
        cadence). Polite scrapers welcome; abusive scrapers blocked.
      </>
    ),
  },
  {
    q: "Why are some filings indexable and others not?",
    a: (
      <>
        Aggregator pages (homepage, filer index, form-type index, industry index,
        plain-English form-type explainers) are indexed and crawled by search
        engines and LLM crawlers. Individual filing pages and per-filer indexes
        are marked <code>noindex, follow</code> in their robots metadata. The
        reason: individual filing pages are thin metadata wrappers around a
        single EDGAR record, and AdSense / Google&rsquo;s &ldquo;Helpful Content&rdquo;
        signals penalise sites with large surfaces of thin pages. The pages
        themselves stay LIVE for users via internal navigation; we&rsquo;ve just
        opted them out of the indexable surface to keep the aggregator pages
        ranking well.
      </>
    ),
  },
  {
    q: "How do I report an error?",
    a: (
      <>
        Email{" "}
        <a
          href="mailto:hello@caslonmedia.com"
          className="text-accent hover:underline"
        >
          hello@caslonmedia.com
        </a>{" "}
        with the URL of the page and a description of the issue. Corrections post
        within 5 business days. EDGAR is the upstream source of record; if a
        discrepancy appears between SecFilingDex and EDGAR, EDGAR wins and we
        update.
      </>
    ),
  },
  {
    q: "Is SecFilingDex affiliated with the SEC?",
    a: (
      <>
        No. SecFilingDex is independent and not affiliated with, endorsed by, or
        operated for the U.S. Securities and Exchange Commission. We are a
        third-party republishing public-domain SEC data under fair-use access
        policy. For official filings, contact the SEC directly via{" "}
        <a
          href="https://www.sec.gov/edgar.shtml"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          sec.gov/edgar
        </a>
        .
      </>
    ),
  },
  {
    q: "How do I get in touch?",
    a: (
      <>
        Email{" "}
        <a
          href="mailto:hello@caslonmedia.com"
          className="text-accent hover:underline"
        >
          hello@caslonmedia.com
        </a>{" "}
        &mdash; that covers bug reports, partnership inquiries, citation
        questions, takedown requests on the SecFilingDex layer, and general
        feedback. Full contact details at{" "}
        <Link href="/contact/" className="text-accent hover:underline">
          /contact/
        </Link>
        .
      </>
    ),
  },
];

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: {
        "@type": "Answer",
        // Plain-text version for schema (no JSX, no markup). Approximate.
        text:
          typeof qa.a === "string"
            ? qa.a
            : qa.q.includes("What is") || qa.q.includes("Where does") || qa.q.includes("How")
              ? "See the detailed answer on the FAQ page at " + SITE_URL + "/faq/"
              : "",
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SecFilingDex", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-prose px-4 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-accent font-bold mb-3">
            FAQ
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
            Frequently asked questions
          </h1>
          <p className="mt-5 text-lg text-text-secondary leading-relaxed">
            Common questions about SecFilingDex, where the data comes from, who built
            it, and what we do (and don&rsquo;t do) with the filings we republish.
          </p>
        </header>

        <section className="space-y-10">
          {FAQS.map((qa, i) => (
            <div key={i}>
              <h2 className="text-xl font-semibold text-text-primary mb-3">
                {qa.q}
              </h2>
              <div className="text-[15px] text-text-secondary leading-relaxed">
                {qa.a}
              </div>
            </div>
          ))}
        </section>

        <footer className="mt-12 pt-6 border-t border-border text-xs text-text-tertiary">
          <p>
            Question not answered here? Email{" "}
            <a
              href="mailto:hello@caslonmedia.com"
              className="text-accent hover:underline"
            >
              hello@caslonmedia.com
            </a>{" "}
            &mdash; we&rsquo;ll reply within two business days and add common
            questions to this page over time.
          </p>
        </footer>
      </main>
      <SiteFooter />
    </>
  );
}
