import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/CookieConsent";
import { ClarityTags } from "@/components/ClarityTags";
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
  // Sister property under the same operator (HoldLens). Complementary angle
  // (catalog vs analysis). Declares brand-family graph for Google + LLM
  // citation #3 Recognizable + #6 Corroborated.
  sameAs: [
    "https://holdlens.com/",
    "https://github.com/acevaultorg",
  ],
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
const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN || "";
// Shared Fleet GA4 property; the fleet worker splits it per-site by hostName. Defaulted
// (not just env-read) so GA4 always loads — it replaced Plausible, retired fleet-wide when
// the subscription was cancelled 2026-06. Consumed ONLY by the Consent Mode v2 block below;
// never hardcode a second gtag init, which would double-count and bypass the consent gate.
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-5BVWDL3M45";
// Microsoft Clarity — heatmaps + session recordings + UX friction detection.
// Loads only when project ID is present. Operator drops via NEXT_PUBLIC_CLARITY_ID
// after creating the project at https://clarity.microsoft.com/projects.
// Consent-gated: Clarity respects the cookie banner (cookie-set on Accept; cleared on Reject).
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";
// Google AdSense client ID. Env-var override available for per-site
// AdSense accounts; fleet-default is the operator's primary account
// (same ID used on holdlens.com + readinglist.school + readminute.com +
// fermentcalc.com). Hardcoded fallback because the AdSense client ID
// is fully public (exposed in served HTML) and CF Pages env var wiring
// requires dashboard access — fallback ships the snippet without that.
const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-7449214764048186";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
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
                  // Deny by default ONLY where consent is legally required, then
                  // grant elsewhere. The previous version denied analytics_storage
                  // globally with nothing to ever grant it, so GA4 counted almost
                  // nobody — 3 visitors/30d reported against ~770 from CF-RUM.
                  gtag('consent', 'default', {
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'analytics_storage': 'denied',
                    'functionality_storage': 'granted',
                    'security_storage': 'granted',
                    'wait_for_update': 500,
                    'region': ['BE','BG','CZ','DK','DE','EE','IE','EL','GR','ES','FR','HR','IT','CY','LV','LT','LU','HU','MT','NL','AT','PL','PT','RO','SI','SK','FI','SE','IS','LI','NO','GB','CH','US-CA']
                  });
                  gtag('consent', 'default', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'analytics_storage': 'granted',
                    'functionality_storage': 'granted',
                    'security_storage': 'granted'
                  });
                  gtag('js', new Date());
                  gtag('config', '${GA4_ID}', { 'anonymize_ip': true });
                `,
              }}
            />
          </>
        )}

        {/* Microsoft Clarity — heatmaps, session recordings, dead/rage click detection.
            Loads only when CLARITY_ID is present. Consent Mode integration:
            on first load Clarity calls itself with `consent` defaulted via setup;
            CookieConsent component upgrades cookies on Accept (window.clarity('consent', true)).
            Privacy: Clarity auto-masks form-input values + can be configured to mask additional
            selectors via dashboard. Operator setup: clarity.microsoft.com/projects → grab tag. */}
        {CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
              `,
            }}
          />
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

        {/* Google AdSense — verification snippet. AdSense application
            requires this loaded on every page in <head> before review.
            ADSENSE_CLIENT env-var-conditional; fleet-default fallback. */}
        {ADSENSE_CLIENT ? (
          <script
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        ) : null}

        {/* llms.txt advertise per `rules/bot-harvest.md` Day-1 manifest spec.
            HTML <link> + (in middleware/headers if present) HTTP Link header
            both signal LLM crawlers that the machine-readable site summary
            lives at /llms.txt — Anthropic, OpenAI, Perplexity all honor. */}
        <link rel="llms" type="text/plain" href="/llms.txt" />
      </head>
      <body className="font-sans antialiased">
        {children}
        {CLARITY_ID && <ClarityTags />}
        <CookieConsent />
      </body>
    </html>
  );
}
