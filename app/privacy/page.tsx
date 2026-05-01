import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SecFilingDex handles cookies, third-party advertising (Google AdSense), analytics, data collection, and your privacy rights under GDPR and CCPA.",
  alternates: { canonical: "https://secfilingdex.com/privacy/" },
};

const LAST_UPDATED = "April 29, 2026";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
        <p className="text-eyebrow text-brand mb-4">Privacy</p>
        <h1 className="text-display-2 mb-3">Privacy Policy</h1>
        <p className="text-body-sm text-dim mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose-content space-y-8 text-body text-muted">
          <section>
            <h2 className="text-heading-2 text-text mb-3">Overview</h2>
            <p>
              SecFilingDex (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;)
              operates secfilingdex.com (the &ldquo;Site&rdquo;). This policy
              explains what we collect, why we collect it, who we share it with,
              and how you can exercise your rights. SecFilingDex is independently
              operated and is not affiliated with the U.S. Securities and
              Exchange Commission.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Information we collect</h2>
            <p className="mb-3">
              We collect a minimal set of information automatically when you
              visit:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Server logs:</strong> IP address,
                user-agent, referrer, request timestamp, requested URL.
              </li>
              <li>
                <strong className="text-text">Cookies and identifiers:</strong>{" "}
                limited first-party cookies for session continuity and consent
                state, plus third-party cookies set by services described below.
              </li>
              <li>
                <strong className="text-text">Web beacons / pixel tags:</strong>{" "}
                used by analytics and advertising partners to measure traffic
                and ad performance.
              </li>
              <li>
                <strong className="text-text">Aggregated usage data:</strong>{" "}
                page views, sessions, broad geographic region, and device class.
              </li>
            </ul>
            <p className="mt-3">
              We do not require account registration. We do not collect names,
              email addresses, or contact details unless you voluntarily send
              them to us via our contact email.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">
              Third-party advertising (Google AdSense)
            </h2>
            <p className="mb-3">
              SecFilingDex is supported by advertising. We use{" "}
              <strong className="text-text">Google AdSense</strong>, a
              third-party advertising service operated by Google LLC.
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                Google and its partners use cookies, web beacons, and similar
                technologies to serve and personalize ads based on your prior
                visits to this Site or other sites on the Internet.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its
                partners to serve ads to you based on your visits to our and/or
                other websites.
              </li>
              <li>
                You may opt out of personalized advertising by visiting{" "}
                <Link
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener"
                  className="text-brand hover:underline"
                >
                  Google Ads Settings
                </Link>
                .
              </li>
              <li>
                For information on how Google uses data from our Site, see{" "}
                <Link
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener"
                  className="text-brand hover:underline"
                >
                  How Google uses information from sites or apps that use our
                  services
                </Link>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Analytics</h2>
            <p className="mb-3">
              We use the following analytics services to understand how the
              Site is used:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Plausible Analytics</strong> —
                privacy-friendly, cookieless, no personal data; does not track
                users across sites.
              </li>
              <li>
                <strong className="text-text">Cloudflare Web Analytics</strong>{" "}
                — privacy-first; no cookies; aggregated only.
              </li>
              <li>
                <strong className="text-text">Google Analytics 4 (GA4)</strong>{" "}
                — used with Consent Mode v2: analytics cookies are denied by
                default until you accept via the cookie banner. IP addresses
                are anonymized.
              </li>
              <li>
                <strong className="text-text">Microsoft Clarity</strong> —
                heatmaps, session recordings, and rage/dead-click detection
                to identify UX friction. Privacy posture: form-input
                values are auto-masked at the &ldquo;Balanced&rdquo; mask
                level, IP addresses are not stored, and Clarity respects
                the cookie banner via{" "}
                <code>window.clarity(&apos;consent&apos;, boolean)</code>{" "}
                — Reject suppresses all cookie storage and disables
                session-recording capture entirely; the script self-loads
                but stays inert until consent is granted. We tag sessions
                with a non-identifying page-type label (home / filing /
                filer / form / industry / learn / search / meta) for
                segmentation, plus a build-version tag for deploy
                tracking. We log anonymous custom events for outbound
                clicks to SEC EDGAR and for users who scroll past 75%
                of an explainer page. We do not link Clarity sessions
                to any user identity (the site has no accounts).
              </li>
              <li>
                <strong className="text-text">Google Search Console</strong> —
                aggregated query and click data; no personal data is exchanged.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Cookies</h2>
            <p>
              Cookies are small text files stored on your device. We use:
              strictly necessary cookies (consent state); analytics cookies (only
              if you opt in via the consent banner); and advertising cookies set
              by Google AdSense and its partners (only if you opt in for
              personalized ads). You can clear cookies at any time via your
              browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Your rights</h2>
            <p className="mb-3">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Access the data we hold about you</li>
              <li>Request correction or deletion of that data</li>
              <li>Opt out of personalized advertising</li>
              <li>Withdraw consent at any time</li>
              <li>
                Lodge a complaint with a supervisory authority (EU/UK residents)
              </li>
              <li>
                Opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of
                personal information (California residents under CCPA/CPRA)
              </li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at the address below. We do
              not knowingly collect personal information from children under 13
              and do not direct content at children.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Data sharing</h2>
            <p>
              We share aggregated, non-personal usage data with the third-party
              services described above (Google AdSense, Google Analytics,
              Plausible, Cloudflare). We do not sell personal information. We
              may disclose information when required by law or to protect our
              rights.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Data retention</h2>
            <p>
              Server logs are retained for up to 90 days. Analytics data is
              retained per the providers&apos; defaults (typically 14&ndash;26
              months). Aggregated, anonymized data may be retained longer for
              historical analysis.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The
              &ldquo;Last updated&rdquo; date at the top reflects the most
              recent revision. Material changes will be flagged on the Site.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Contact</h2>
            <p>
              For privacy questions, data-rights requests, or to opt out, email:{" "}
              <Link
                href="mailto:contact@secfilingdex.com"
                className="text-brand hover:underline"
              >
                contact@secfilingdex.com
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
