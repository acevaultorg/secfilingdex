import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is an 11-K filing?",
  description:
    "11-K is the SEC annual report that issuers file for employee stock purchase, savings, and similar plans (ESPPs, 401(k)s holding employer stock). Plain-English explainer with live filings.",
  alternates: { canonical: `${SITE_URL}/learn/11-k/` },
};

export default function Learn11KPage() {
  const liveCount = loadFilingsByFormType("11-K").length;
  const amendCount = loadFilingsByFormType("11-K/A").length;

  return (
    <LearnArticle
      slug="11-k"
      title="What is an 11-K filing?"
      tldr="11-K is the annual report that issuers file with the SEC for employee stock-purchase, savings, and similar plans — typically 401(k)s holding employer stock and ESPPs. Required under Section 15(d) of the Exchange Act when the plan's interests are registered."
      dateModified="2026-09-10"
      sections={[
        {
          heading: "Who files an 11-K, and when",
          body: (
            <>
              <p>
                Section 15(d) of the Securities Exchange Act of 1934 and
                Rule 15d-21 require an annual report on Form 11-K for any
                employee stock-purchase, savings, or similar plan
                interest in respect of which a registration statement
                (typically a Form S-8) is in effect. The plan itself —
                not the issuer — is the registrant.
              </p>
              <p>
                Under the SEC&apos;s{" "}
                <a
                  href="https://www.sec.gov/files/form11-k.pdf"
                  target="_blank"
                  rel="noopener"
                  className="text-brand hover:underline"
                >
                  General Instructions to Form 11-K
                </a>, the report is generally due within 90 days after the
                plan&apos;s fiscal year-end. Plans subject to ERISA may file
                the plan financial statements within 180 days after the
                plan&apos;s fiscal year-end.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside an 11-K",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Audited financial statements</strong>{" "}
                for the plan — typically statements of net assets
                available for benefits and statements of changes in net
                assets available for benefits.
              </li>
              <li>
                <strong className="text-text">Schedule of assets held</strong>{" "}
                — itemizes investments by issuer and asset class,
                including the employer stock position.
              </li>
              <li>
                <strong className="text-text">ERISA-required schedules</strong>{" "}
                where applicable — reportable transactions, party-in-interest
                disclosures, delinquent participant contributions.
              </li>
              <li>
                <strong className="text-text">Plan administrator&apos;s certification</strong>{" "}
                — signed by a fiduciary, not the issuer&apos;s CFO.
              </li>
            </ul>
          ),
        },
        {
          heading: "Why 11-Ks exist alongside 10-Ks",
          body: (
            <>
              <p>
                A 10-K describes the issuer&apos;s consolidated finances.
                An 11-K describes the plan&apos;s separately-managed
                assets — even when the plan is a 401(k) of the same
                issuer. The two documents have different audited
                periods, different signers, and different scope. They
                are not interchangeable.
              </p>
              <p>
                For investors, 11-Ks are valuable for two narrow
                reasons. First, they expose the employer-stock
                concentration in plan assets — a material risk factor
                Enron made famous. Second, they sometimes disclose
                fiduciary lawsuits and ERISA settlements that don&apos;t
                rise to 10-K materiality thresholds.
              </p>
            </>
          ),
        },
      ]}
      ourView="11-Ks are the most-skipped 1934-Act annual report in the SEC catalog — they sit between corporate disclosure and ERISA pension disclosure, and most retail investors never know they exist. But the schedule of plan assets is the single best lookup for how heavily employees themselves are betting on the stock — which is its own market signal."
      liveDataLink={liveCount > 0 ? {
        label: "Browse live 11-K filings",
        href: "/form/11-k",
        count: liveCount,
      } : undefined}
      related={[
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "def-14a", title: "What is a DEF 14A filing?" },
        { slug: "s-1", title: "What is an S-1 filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/",
          label: "HoldLens: Smart-money signals across 30 tracked superinvestors",
          description:
            "Plan-asset concentration as an indirect signal — when employer-stock weighting drops materially YoY, it often precedes guidance shifts visible in tracked-manager 13Fs the following quarter.",
        },
      ]}
      definedTerms={[
        {
          term: "11-K",
          description:
            "Annual report on Form 11-K filed under Section 15(d) of the Securities Exchange Act of 1934 for employee stock-purchase, savings, and similar plans whose interests are registered (typically via Form S-8).",
        },
        {
          term: "11-K/A",
          description:
            "An amendment to a previously filed 11-K. Used to restate plan-asset valuations, correct schedule errors, or add ERISA-required disclosures.",
        },
        {
          term: "ESPP",
          description:
            "Employee Stock Purchase Plan. A program permitting employees to buy issuer stock at a discount (typically 5-15% off market) via payroll deduction. ESPP interests must be registered on Form S-8; the plan reports annually on 11-K.",
        },
        {
          term: "ERISA",
          description:
            "Employee Retirement Income Security Act of 1974. The federal statute governing private-sector employee benefit plans. For Form 11-K timing, ERISA-covered plans may file the plan financial statements within 180 days after the plan's fiscal year-end instead of the general 90-day deadline.",
        },
        {
          term: "Form S-8",
          description:
            "Short-form registration statement for offering securities to employees under a stock-purchase, savings, or compensation plan. The companion filing whose existence triggers the 11-K annual-report obligation.",
        },
      ]}
    />
  );
}
