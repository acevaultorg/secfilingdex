import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for SecFilingDex — usage rules, disclaimers, intellectual property, and liability limits for the SEC EDGAR database surface.",
  alternates: { canonical: "https://secfilingdex.com/terms/" },
};

const LAST_UPDATED = "April 29, 2026";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
        <p className="text-eyebrow text-brand mb-4">Terms</p>
        <h1 className="text-display-2 mb-3">Terms of Service</h1>
        <p className="text-body-sm text-dim mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-body text-muted">
          <section>
            <h2 className="text-heading-2 text-text mb-3">Acceptance</h2>
            <p>
              By accessing or using secfilingdex.com (the &ldquo;Site&rdquo;),
              you agree to be bound by these Terms of Service. If you do not
              agree, please do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">What we provide</h2>
            <p>
              SecFilingDex is a programmatic database surface over publicly
              available SEC EDGAR filings. We index, normalize, and republish
              filings sourced from SEC EDGAR with provenance. We do not provide
              investment, legal, tax, or other professional advice.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Source data</h2>
            <p>
              Underlying SEC filings are works of the U.S. government and are
              public domain (17 U.S.C. § 105). The U.S. Securities and Exchange
              Commission is the authoritative source. SecFilingDex is
              independent and not affiliated with the SEC. If our index and
              EDGAR disagree, EDGAR is correct.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Editorial content</h2>
            <p>
              Editorial annotations, taxonomy, composite indexing, and visual
              design produced by SecFilingDex are licensed under{" "}
              <Link
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener"
                className="text-brand hover:underline"
              >
                CC-BY-4.0
              </Link>
              . When citing or republishing, include attribution and a link
              back to the SecFilingDex page.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">No advice; no warranty</h2>
            <p className="mb-3">
              The Site and its content are provided &ldquo;as is&rdquo; and
              &ldquo;as available&rdquo; without warranty of any kind, express
              or implied. SecFilingDex disclaims all warranties including
              merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
            <p>
              Nothing on this Site is investment, legal, tax, or other
              professional advice. Always verify against original SEC EDGAR
              sources before acting on any filing data.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Acceptable use</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Don&apos;t scrape the Site at a rate that disrupts service.</li>
              <li>Don&apos;t misrepresent SecFilingDex content as your original work.</li>
              <li>
                Don&apos;t use the Site in a way that violates applicable law,
                including securities, anti-fraud, or sanctions laws.
              </li>
              <li>
                Don&apos;t attempt to gain unauthorized access to systems,
                accounts, or data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, SecFilingDex and its
              operator are not liable for indirect, incidental, special,
              consequential, or punitive damages arising from your use of the
              Site or reliance on its content.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless SecFilingDex and its
              operator from any claim arising out of your misuse of the Site or
              breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Changes</h2>
            <p>
              We may update these Terms at any time. Material changes will be
              flagged on the Site. Continued use after a change constitutes
              acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Governing law</h2>
            <p>
              These Terms are governed by the laws of the Netherlands, without
              regard to conflict-of-laws principles. Disputes shall be
              submitted to the competent courts of the Netherlands, unless a
              mandatory consumer-protection rule in your jurisdiction provides
              otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Contact</h2>
            <p>
              Questions about these Terms? Email{" "}
              <Link
                href="mailto:hello@caslonmedia.com"
                className="text-brand hover:underline"
              >
                hello@caslonmedia.com
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
