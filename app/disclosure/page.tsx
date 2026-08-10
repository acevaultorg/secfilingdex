import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "SecFilingDex affiliate disclosure — which links earn us a commission, how they are marked, and why they never change the filing data we publish.",
  alternates: { canonical: `${SITE_URL}/disclosure/` },
  openGraph: {
    type: "website",
    title: "Affiliate Disclosure · SecFilingDex",
    description:
      "Which links earn us a commission, how they are marked, and why they never change the filing data we publish.",
    siteName: "SecFilingDex",
  },
};

export default function DisclosurePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
        <p className="text-eyebrow text-brand mb-4">Disclosure</p>
        <h1 className="text-display-2 mb-3">Affiliate Disclosure</h1>
        <p className="text-body-lg text-muted mb-10">
          The plain-English version: some links on SecFilingDex are affiliate
          links. If you buy something through one, we may earn a commission at
          no extra cost to you. It never changes what we publish.
        </p>

        <div className="space-y-8 text-body text-muted">
          <section>
            <h2 className="text-heading-2 text-text mb-3">What this means</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Some outbound links on this site are, or may become, affiliate
                links. SecFilingDex currently participates in the Amazon
                Associates program: as an Amazon Associate, we earn from
                qualifying purchases. Additional affiliate partnerships are
                launching; this page will stay current as they do.
              </li>
              <li>
                Commissions are paid by the merchant, never by you. The price
                you pay is the same either way.
              </li>
              <li>
                Every affiliate link is marked{" "}
                <code className="font-mono text-text">
                  rel=&quot;sponsored nofollow noopener&quot;
                </code>{" "}
                and carries a disclosure near the link itself.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">
              What it never changes
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-text">
                  The filing data is never for sale.
                </strong>{" "}
                Every filing page is sourced from SEC EDGAR with full
                provenance, per our{" "}
                <Link href="/methodology" className="text-brand hover:underline">
                  methodology
                </Link>
                . No commission alters, ranks, or removes filing data.
              </li>
              <li>
                We never accept payment to alter data, coverage, or how a
                filer, form type, or industry is presented.
              </li>
              <li>
                We never ask or incentivize you to click an affiliate link,
                and we do not run paid ads on partner brand terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-heading-2 text-text mb-3">Questions</h2>
            <p>
              This disclosure is made in line with the FTC&apos;s endorsement
              guides (16 CFR Part 255). If anything here is unclear, email{" "}
              <Link
                href="mailto:contact@secfilingdex.com"
                className="text-brand font-mono hover:underline"
              >
                contact@secfilingdex.com
              </Link>{" "}
              or see the{" "}
              <Link href="/partners" className="text-brand hover:underline">
                partners page
              </Link>{" "}
              for our full partnership policy.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
