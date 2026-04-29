import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://secfilingdex.com";
const SITE_NAME = "SecFilingDex";
const SITE_TAGLINE = "EDGAR's database, modernized.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Programmatic database surface over SEC EDGAR filings. Comprehensive indexing across 10-K, 10-Q, 8-K, 13F, 13D/G, S-1, Proxy, Form 4, 20-F, 6-K with cross-filer relationship graph and citation-grade structured-data API.",
  applicationName: SITE_NAME,
  authors: [{ name: "Paulo de Vries" }],
  keywords: [
    "SEC filings",
    "EDGAR",
    "10-K",
    "10-Q",
    "8-K",
    "13F",
    "13D",
    "Form 4",
    "S-1",
    "proxy statement",
    "SEC database",
    "financial filings",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Comprehensive database surface over SEC EDGAR. Every filing, indexed.",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Comprehensive database surface over SEC EDGAR. Every filing, indexed.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // Day 1 P0 placeholder — operator wires real GSC verification meta tag at D7-02
  // verification: { google: "REPLACE_WITH_GSC_TOKEN" },
};

// Schema.org Organization + WebSite — quote-ready, citation-grade, LLM-friendly
// (per Aleyda Solis 10-characteristic checklist + bot-harvest Day-1 mandate)
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Programmatic database surface over SEC EDGAR filings, designed for finance prosumers, developers, and AI agents requiring citation-grade structured filing data.",
  founder: { "@type": "Person", name: "Paulo de Vries" },
  sameAs: ["https://github.com/acevaultorg"],
};

const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_TAGLINE,
  publisher: { "@type": "Organization", name: SITE_NAME },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Day-1 Analytics Mandate (per concept-finder-methodology Layer 7).
            Operator wires real domain/IDs at D1-02 + D7-02 ship steps.
            Plausible: data-domain="secfilingdex.com" + outbound-links + tagged-events
            Cloudflare Web Analytics: data-cf-beacon when CF_ANALYTICS_TOKEN env set
            GSC verification meta: see metadata.verification above
            GA4: gtag injection (Consent Mode v2 defaults DENIED) */}
        {/* Placeholder comments — replace with real analytics during D1-02 ship */}

        {/* Schema.org JSON-LD (Organization + WebSite) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
