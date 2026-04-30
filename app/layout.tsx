import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/CookieConsent";
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
  verification: {
    // GSC ownership verified 2026-04-30 via TXT record at root (DNS-level).
    // Meta-tag verification not required for Domain properties.
  },
};

// Viewport — themed for mobile-perfection per `rules/mobile-perfection-default.md`.
// `themeColor` tints mobile browser chrome to match site bg (cohesive visual identity);
// `width=device-width, initialScale=1` is the mobile-first default Next emits anyway —
// declared here for explicitness + auditability.
export const viewport: Viewport = {
  themeColor: "#0b1020",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

// Schema.org Organization + WebSite — quote-ready, citation-grade, LLM-friendly
// (per Aleyda Solis 10-characteristic checklist + bot-harvest Day-1 mandate)
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
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

// Day-1 Analytics Mandate (concept-finder-methodology v2.1 Layer 7 + bot-harvest):
//   Plausible — primary traffic + custom events
//   Cloudflare Web Analytics — privacy-first beacon (token via CF dashboard)
//   GSC — verification via metadata.verification field (operator drops token)
//   GA4 — Consent Mode v2 defaults DENIED until cookie banner accepts
const PLAUSIBLE_DOMAIN = "secfilingdex.com";
const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN || "";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Plausible Analytics — outbound-links + tagged-events variant */}
        <script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.outbound-links.tagged-events.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }",
          }}
        />

        {/* Cloudflare Web Analytics (privacy-first; only when CF token present) */}
        {CF_BEACON_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${CF_BEACON_TOKEN}"}`}
          />
        )}

        {/* GA4 — Consent Mode v2 with denied defaults; banner upgrades on accept */}
        {GA4_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('consent', 'default', {
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'analytics_storage': 'denied',
                    'wait_for_update': 500
                  });
                  gtag('js', new Date());
                  gtag('config', '${GA4_ID}', { 'anonymize_ip': true });
                `,
              }}
            />
          </>
        )}

        {/* Schema.org JSON-LD (Organization + WebSite) — citation-grade per Aleyda Solis 10-char checklist */}
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
        <CookieConsent />
      </body>
    </html>
  );
}
