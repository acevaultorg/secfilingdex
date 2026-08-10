import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Partner with SecFilingDex — media kit for affiliate networks and brand partners: audience, publisher identity (Caslon Media), editorial standards, and disclosure policy.",
  alternates: { canonical: `${SITE_URL}/partners/` },
  openGraph: {
    type: "website",
    title: "Partner with SecFilingDex",
    description:
      "Media kit: audience, publisher identity, editorial standards, and disclosure policy.",
    siteName: "SecFilingDex",
  },
};

export default function PartnersPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
        <p className="text-eyebrow text-brand mb-4">Partners</p>
        <h1 className="text-display-2 mb-3">Partner with SecFilingDex</h1>
        <p className="text-body-lg text-muted mb-10">
          SecFilingDex is a programmatic reference database over SEC EDGAR
          filings &mdash; every indexed filing gets a stable page, structured
          data, and a machine-readable JSON twin. Our readers are investors and
          finance professionals looking up specific SEC filings, form types,
          and filers, plus the developers and AI workflows that build on the
          same data.
        </p>

        <div className="space-y-10 text-body text-muted">
          <section>
            <h2 className="text-heading-1 text-text mb-3">Audience</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-body-sm mb-3">
              <div className="rounded-card border border-border bg-panel/40 p-4">
                <dt className="text-eyebrow text-dim mb-1">
                  Human visitors / 30 days
                </dt>
                <dd className="text-text text-heading-2 tabular">285</dd>
              </div>
              <div className="rounded-card border border-border bg-panel/40 p-4">
                <dt className="text-eyebrow text-dim mb-1">Geography</dt>
                <dd className="text-text text-heading-2">Predominantly US</dd>
              </div>
              <div className="rounded-card border border-border bg-panel/40 p-4">
                <dt className="text-eyebrow text-dim mb-1">Reader persona</dt>
                <dd className="text-text text-heading-2">Finance</dd>
              </div>
            </dl>
            <p className="text-caption text-dim">
              Visitor count is human traffic measured in Google Analytics 4
              over the trailing 30 days (August 2026). SecFilingDex also serves
              a substantial AI-crawler and API audience via its JSON endpoints;
              the number above counts humans only.
            </p>
            <p className="mt-3">
              The typical reader arrives on a specific filing, form-type
              explainer, or filer page from search or an AI citation &mdash;
              high-intent reference traffic, predominantly US, in an
              investing and financial-research context.
            </p>
          </section>

          <section>
            <h2 className="text-heading-1 text-text mb-3">About the publisher</h2>
            <p className="mb-3">
              SecFilingDex is published by{" "}
              <strong className="text-text">Caslon Media</strong>, a registered
              Dutch media company operating a network of independent data and
              reference websites. The operator is Paulo de Vries; more on the
              site&apos;s identity and provenance is on the{" "}
              <Link href="/about" className="text-brand hover:underline">
                About page
              </Link>
              .
            </p>
            <p>
              Contact:{" "}
              <Link
                href="mailto:contact@secfilingdex.com"
                className="text-brand font-mono hover:underline"
              >
                contact@secfilingdex.com
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-heading-1 text-text mb-3">Editorial standards</h2>
            <ul className="list-disc pl-6 space-y-1.5 mb-3">
              <li>
                Every filing page is sourced directly from SEC EDGAR with full
                provenance (accession number, CIK, original EDGAR URL) &mdash;
                see our{" "}
                <Link href="/methodology" className="text-brand hover:underline">
                  methodology
                </Link>
                .
              </li>
              <li>
                Pages carry a visible &ldquo;last verified&rdquo; date; data
                freshness is checked against EDGAR on every deploy.
              </li>
              <li>
                No filing data is fabricated. If we don&apos;t have the data,
                the page 404s. EDGAR remains authoritative.
              </li>
              <li>
                Data display only: SecFilingDex publishes filing data and
                plain-English explanations of SEC form mechanics. It does not
                publish investment advice or recommendations of any security.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-heading-1 text-text mb-3">How we partner</h2>
            <ul className="list-disc pl-6 space-y-1.5 mb-3">
              <li>
                <strong className="text-text">Contextual placement.</strong>{" "}
                Partner recommendations appear inside relevant data and
                explainer pages where they genuinely fit the reader&apos;s
                task &mdash; never as interstitials or pop-ups.
              </li>
              <li>
                <strong className="text-text">Always disclosed.</strong> Every
                affiliate placement carries an FTC disclosure adjacent to the
                link, per our{" "}
                <Link href="/disclosure" className="text-brand hover:underline">
                  affiliate disclosure
                </Link>
                .
              </li>
              <li>
                <strong className="text-text">
                  <code className="font-mono">rel=&quot;sponsored nofollow noopener&quot;</code>
                </strong>{" "}
                on every affiliate link, without exception.
              </li>
              <li>
                <strong className="text-text">No incentivized clicks.</strong>{" "}
                We never ask, pressure, or reward readers to click partner
                links.
              </li>
              <li>
                <strong className="text-text">No brand bidding.</strong> We do
                not run paid-search ads on partner brand terms.
              </li>
              <li>
                <strong className="text-text">Editorial independence.</strong>{" "}
                Partner relationships never change what filing data we publish
                or how we present it.
              </li>
            </ul>
          </section>

          <section className="rounded-card-lg border border-border bg-panel/40 p-8">
            <h2 className="text-heading-1 text-text mb-3">Partnership status</h2>
            <p className="mb-3">
              SecFilingDex currently participates in the Amazon Associates
              program. Additional partnerships are launching now &mdash; if
              your program fits an SEC-filings reference audience, we&apos;d
              like to hear from you.
            </p>
            <p>
              <Link
                href="mailto:contact@secfilingdex.com"
                className="text-brand font-mono hover:underline"
              >
                contact@secfilingdex.com
              </Link>{" "}
              &middot;{" "}
              <Link href="/contact" className="text-brand hover:underline">
                contact page
              </Link>
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
