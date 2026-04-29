import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with SecFilingDex — for data corrections, partnership inquiries, takedown requests, licensing, or general questions.",
  alternates: { canonical: "https://secfilingdex.com/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
        <p className="text-eyebrow text-brand mb-4">Contact</p>
        <h1 className="text-display-2 mb-3">Contact</h1>
        <p className="text-body-lg text-muted mb-10">
          The fastest path to reach SecFilingDex is by email. We read every
          message and respond within 5 business days.
        </p>

        <div className="space-y-8 text-body text-muted">
          <section className="rounded-card-lg border border-border bg-panel/40 p-8">
            <p className="text-eyebrow text-brand mb-3">Email</p>
            <p className="mb-4">
              <Link
                href="mailto:contact@secfilingdex.com"
                className="text-heading-2 text-text font-mono hover:text-brand transition-colors"
              >
                contact@secfilingdex.com
              </Link>
            </p>
            <p className="text-body-sm">
              Operated by Paulo de Vries. SecFilingDex is independently
              operated and is not affiliated with the U.S. Securities and
              Exchange Commission.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">What to write about</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-text">Data corrections.</strong> Spot
                an indexing error or stale data? Email with the accession
                number and what looks wrong &mdash; we&apos;ll re-pull from
                EDGAR and verify.
              </li>
              <li>
                <strong className="text-text">Takedown requests.</strong> If
                you&apos;re a filer and need a public correction reflected
                here, email us with the SEC EDGAR URL of the corrected filing.
              </li>
              <li>
                <strong className="text-text">Partnership / API licensing.</strong>{" "}
                Need bulk JSON API access, custom integrations, or data
                partnerships? Reach out with your use case.
              </li>
              <li>
                <strong className="text-text">Privacy / data rights.</strong>{" "}
                For GDPR, CCPA, or other data-rights requests, see our{" "}
                <Link href="/privacy" className="text-brand hover:underline">
                  Privacy Policy
                </Link>{" "}
                and email us.
              </li>
              <li>
                <strong className="text-text">General questions.</strong>{" "}
                Anything else &mdash; methodology, attribution, citations,
                features &mdash; we welcome it.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Response time</h2>
            <p>
              We aim to respond within 5 business days. Time-sensitive
              takedowns and data corrections are prioritized. SecFilingDex is
              operated by a solo founder; please be patient if a complex
              question takes a little longer.
            </p>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Source verification</h2>
            <p className="mb-3">
              Before you write to report an indexing error, please verify
              against the original SEC EDGAR filing:
            </p>
            <p className="mb-3">
              <Link
                href="https://www.sec.gov/edgar/search/"
                target="_blank"
                rel="noopener"
                className="text-brand hover:underline"
              >
                sec.gov/edgar/search/ ↗
              </Link>
            </p>
            <p>
              If EDGAR and SecFilingDex disagree, EDGAR is authoritative.
              We&apos;ll fix our index.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
