import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "Learn — SEC filings explained",
  description:
    "Plain-English explainers for the most-cited SEC filings: 10-K, 10-Q, 8-K, 13F, Form 4, S-1, and the 13D vs. 13G distinction. Each piece links to live data on SecFilingDex.",
  alternates: { canonical: `${SITE_URL}/learn/` },
  openGraph: {
    type: "website",
    title: "Learn SEC filings — SecFilingDex",
    description:
      "Plain-English explainers for the most-cited SEC filings, linked to live data.",
    siteName: "SecFilingDex",
  },
};

const TOPICS = [
  {
    slug: "10-k",
    title: "What is a 10-K filing?",
    blurb:
      "The annual report. The single most comprehensive disclosure a U.S. public company files with the SEC. Audited financials, business overview, risk factors, MD&A.",
    formType: "10-K",
    formHref: "/form/10-k",
  },
  {
    slug: "10-k-a",
    title: "What is a 10-K/A filing?",
    blurb:
      "Amendment to a previously-filed 10-K. Used to correct material errors, restate financials, add omitted Part III disclosures, or respond to SEC staff comments. The explanatory note tells you which class.",
    formType: "10-K/A",
    formHref: "/form/10-k-a",
  },
  {
    slug: "10-q",
    title: "What is a 10-Q filing?",
    blurb:
      "The quarterly report. Unaudited financials covering the prior three months, filed within 40 or 45 days of quarter-end depending on filer size.",
    formType: "10-Q",
    formHref: "/form/10-q",
  },
  {
    slug: "8-k",
    title: "What is an 8-K filing?",
    blurb:
      "The current report. Material events the market should know about within four business days — earnings releases, leadership changes, mergers, bankruptcies, asset sales.",
    formType: "8-K",
    formHref: "/form/8-k",
  },
  {
    slug: "13f",
    title: "What is a 13F filing?",
    blurb:
      "Quarterly long-equity holdings disclosure required from institutional investment managers with ≥$100M in qualifying U.S. equity assets. Filed within 45 days of quarter-end.",
    formType: "13F-HR",
    formHref: "/form/13f-hr",
  },
  {
    slug: "form-4",
    title: "What is a Form 4 filing?",
    blurb:
      "Insider transactions. Officers, directors, and ≥10% beneficial owners must file within two business days of any change in their ownership of company securities.",
    formType: "Form 4",
    formHref: "/form/form-4",
  },
  {
    slug: "s-1",
    title: "What is an S-1 filing?",
    blurb:
      "The IPO prospectus. The registration statement a company files when going public — business description, risk factors, financials, use of proceeds, underwriter list.",
    formType: "S-1",
    formHref: "/form/s-1",
  },
  {
    slug: "13d-vs-13g",
    title: "13D vs. 13G: what's the difference?",
    blurb:
      "Both disclose ≥5% beneficial ownership. 13D is for activists and anyone with intent to influence control; 13G is the short-form for passive holders. The choice signals intent.",
    formType: null,
    formHref: null,
  },
  {
    slug: "def-14a",
    title: "What is a DEF 14A filing?",
    blurb:
      "The definitive proxy statement. Mailed before annual meetings — covers director elections, Say-on-Pay, executive compensation (CD&A), shareholder proposals, and the most candid governance disclosures the company files all year.",
    formType: "DEF 14A",
    formHref: "/form/def-14a",
  },
  {
    slug: "20-f",
    title: "What is a 20-F filing?",
    blurb:
      "The annual report for Foreign Private Issuers — non-U.S. companies (Toyota, Novartis, Alibaba, ASML, SAP) listed on U.S. exchanges. The 10-K equivalent, with IFRS accepted and a 4-month deadline.",
    formType: "20-F",
    formHref: "/form/20-f",
  },
  {
    slug: "6-k",
    title: "What is a 6-K filing?",
    blurb:
      "The interim event report for Foreign Private Issuers — the foreign-issuer cousin of an 8-K. Filed whenever an FPI makes any material disclosure to its home-country regulator. The primary channel for ADR earnings releases, M&A announcements, and management changes.",
    formType: "6-K",
    formHref: "/form/6-k",
  },
  {
    slug: "s-3",
    title: "What is an S-3 filing?",
    blurb:
      "The shelf registration. Seasoned issuers pre-register securities for future issuance, then 'take down' from the shelf via 424B prospectus supplements when market conditions allow. Apple, Microsoft, JPMorgan use the WKSI variant (S-3ASR).",
    formType: null,
    formHref: null,
  },
  {
    slug: "11-k",
    title: "What is an 11-K filing?",
    blurb:
      "Annual report for employee stock-purchase, savings, and similar plans (ESPPs, 401(k)s holding employer stock). Filed under Rule 15d-21. The plan is the registrant, not the issuer. Audited plan-asset statements + ERISA-required schedules.",
    formType: "11-K",
    formHref: "/form/11-k",
  },
  {
    slug: "13h",
    title: "What is a Form 13H filing?",
    blurb:
      "Large-trader identification under Rule 13h-1. Any person whose securities transactions cross $20M intraday or $200M monthly must register. Adopted after the 2010 Flash Crash. Content is non-public — only the existence of registration is disclosed.",
    formType: null,
    formHref: null,
  },
  {
    slug: "nt-10-k",
    title: "What is an NT 10-K filing?",
    blurb:
      "Notification of inability to file a 10-K on time under Rule 12b-25. Grants 15-day extension. Part III narrative usually tells you whether the delay is benign or a material signal — restatement risk, going-concern review, auditor consultation.",
    formType: "NT 10-K",
    formHref: "/form/nt-10-k",
  },
  {
    slug: "f-1",
    title: "What is an F-1 filing?",
    blurb:
      "Initial registration statement for foreign private issuers — non-U.S. companies first registering an offering of securities in the U.S. The foreign-issuer equivalent of the S-1. IFRS or home-country GAAP accepted without reconciliation to U.S. GAAP.",
    formType: "F-1",
    formHref: "/form/f-1",
  },
  {
    slug: "form-144",
    title: "What is a Form 144 filing?",
    blurb:
      "Notice of proposed sale of restricted or control securities by an issuer affiliate. Filed under Rule 144 when sales exceed 5,000 shares or $50,000 in 3 months. Announces intent; Form 4 confirms execution. Read both filings together.",
    formType: "144",
    formHref: "/form/144",
  },
];

export default function LearnHubPage() {
  // Live-injected counts so each card carries a "see N filings" anchor —
  // makes the hub a real query into the database surface, not a static menu.
  const counts = TOPICS.map((t) =>
    t.formType ? loadFilingsByFormType(t.formType).length : null,
  );

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "SEC Filings Explained",
    description:
      "Plain-English explainers for the most-cited SEC filings on EDGAR, linked to live data on SecFilingDex.",
    url: `${SITE_URL}/learn/`,
    isPartOf: { "@type": "WebSite", name: "SecFilingDex", url: SITE_URL },
    hasPart: TOPICS.map((t) => ({
      "@type": "Article",
      headline: t.title,
      url: `${SITE_URL}/learn/${t.slug}/`,
      description: t.blurb,
    })),
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
        <p className="text-eyebrow text-brand mb-4">Learn</p>
        <h1 className="text-display-2 mb-3">SEC filings, explained</h1>
        <p className="text-body text-muted mb-10">
          Plain-English primers for the disclosures that move markets. Each
          piece is short, source-grounded, and links to live data on
          SecFilingDex so the explainer and the corpus stay in lockstep.
        </p>

        <div className="space-y-4">
          {TOPICS.map((t, i) => (
            <Link
              key={t.slug}
              href={`/learn/${t.slug}/`}
              className="block group rounded-card border border-border hover:border-border-bright bg-panel hover:bg-panel-hi px-5 py-4 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <h2 className="text-heading-3 text-text group-hover:text-brand transition-colors">
                  {t.title}
                </h2>
                {counts[i] != null && (
                  <span className="text-body-sm text-dim shrink-0 font-mono">
                    {counts[i]} filings
                  </span>
                )}
              </div>
              <p className="text-body-sm text-muted">{t.blurb}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border text-body-sm text-dim">
          <p>
            Looking for a specific filing? Browse the full corpus by{" "}
            <Link href="/form/" className="text-brand hover:underline">
              form type
            </Link>
            ,{" "}
            <Link href="/filer/" className="text-brand hover:underline">
              filer
            </Link>
            , or{" "}
            <Link href="/industry/" className="text-brand hover:underline">
              industry
            </Link>
            . Every page is sourced from{" "}
            <Link
              href="https://www.sec.gov/edgar"
              target="_blank"
              rel="noopener"
              className="underline decoration-border hover:decoration-text hover:text-text transition-colors"
            >
              SEC EDGAR
            </Link>
            .
          </p>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
