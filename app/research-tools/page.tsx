import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "Research Tools",
  description:
    "Data and research tools the SecFilingDex team actually uses, disclosed on one page — never placed on a filing or filer page.",
  alternates: { canonical: `${SITE_URL}/research-tools/` },
  openGraph: {
    type: "website",
    title: "Research Tools · SecFilingDex",
    description:
      "Data and research tools the SecFilingDex team actually uses, disclosed on one page.",
    siteName: "SecFilingDex",
  },
  robots: { index: true, follow: true },
};

const RESEARCH_TOOLS_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/research-tools/`,
  url: `${SITE_URL}/research-tools/`,
  name: "Research Tools — SecFilingDex Affiliate Disclosure",
  description:
    "Data and research products the SecFilingDex team uses, disclosed with affiliate terms.",
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", url: `${SITE_URL}/`, name: "SecFilingDex" },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "SecFilingDex", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Research Tools", item: `${SITE_URL}/research-tools/` },
  ],
};

type Tool = {
  key: string;
  name: string;
  href: string;
  whatItIs: string;
  whoItsFor: string;
};

// Approved 2026-09-05 (source card mt7awcb23xkabb). Deliberately confined to
// this one neutral page — never placed on a /filing or /filer page — per
// rules/google-policy-compliance.md: a data-display-only reference site keeps
// any commercial link off pages that could read as a recommendation tied to
// a specific filer or filing.
const TOOLS: Tool[] = [
  {
    key: "eodhd",
    name: "EODHD",
    href: "https://eodhd.com?via=caslonmedia",
    whatItIs:
      "An end-of-day and fundamentals market-data API covering global exchanges — historical prices, fundamentals, and corporate actions delivered programmatically rather than through a point-and-click terminal.",
    whoItsFor:
      "Developers and researchers who want raw, queryable market data to pair with the filing data indexed here, rather than a hosted dashboard.",
  },
  {
    key: "wisesheets",
    name: "Wisesheets",
    href: "https://www.wisesheets.io?via=paulo",
    whatItIs:
      "A Google Sheets / Excel add-on that pulls financial statement data, ratios, and estimates directly into a spreadsheet with formula functions.",
    whoItsFor:
      "Anyone who models company financials in a spreadsheet and wants sourced data without manually copying numbers out of a filing.",
  },
];

export default function ResearchToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(RESEARCH_TOOLS_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }} />
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
        <p className="text-eyebrow text-brand mb-4">Research tools</p>
        <h1 className="text-display-2 mb-3">Data &amp; research tools we use</h1>
        <p className="text-body-lg text-muted mb-10">
          SecFilingDex is a programmatic reference over SEC EDGAR filings — data display only, no
          investment advice. Separately from the filing index itself, the team behind this site
          uses a small number of external data and research products. This page discloses them.
          None of them appear on a filing, filer, or form-type page, and none of them are used to
          generate a rating, price target, or buy/sell verdict on anything published here.
        </p>

        <div className="space-y-8 text-body text-muted">
          {TOOLS.map((t) => (
            <article key={t.key} className="rounded-card-lg border border-border bg-panel p-6">
              <h2 className="text-heading-2 text-text mb-3">{t.name}</h2>
              <p className="mb-2">
                <strong className="text-text">What it is.</strong> {t.whatItIs}
              </p>
              <p className="mb-4">
                <strong className="text-text">Who it tends to fit.</strong> {t.whoItsFor}
              </p>
              <a
                href={t.href}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="inline-flex items-center gap-1 text-brand hover:underline font-semibold text-body-sm"
              >
                Visit {t.name} &rarr;
              </a>
              <p className="mt-2 text-caption text-dim leading-relaxed">
                Affiliate link — SecFilingDex may earn a commission at no extra cost to you. This
                is not a recommendation; read {t.name}&apos;s own terms before signing up.
              </p>
            </article>
          ))}
        </div>

        <section className="mt-10 text-body text-muted">
          <h2 className="text-heading-2 text-text mb-3">Full disclosure policy</h2>
          <p>
            Commissions are paid by the merchant, never by you, and never change what filing data
            we publish or how it is presented — see our{" "}
            <Link href="/disclosure" className="text-brand hover:underline">
              affiliate disclosure
            </Link>{" "}
            and{" "}
            <Link href="/methodology" className="text-brand hover:underline">
              methodology
            </Link>
            . Questions:{" "}
            <Link
              href="mailto:hello@caslonmedia.com"
              className="text-brand font-mono hover:underline"
            >
              hello@caslonmedia.com
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
