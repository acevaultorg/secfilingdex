import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is an F-1 filing?",
  description:
    "F-1 is the SEC initial registration statement for foreign private issuers. The foreign-issuer equivalent of the S-1, filed when a non-U.S. company first registers shares for public sale in the U.S. Plain-English explainer with live filings.",
  alternates: { canonical: `${SITE_URL}/learn/f-1/` },
};

export default function LearnF1Page() {
  const liveCount = loadFilingsByFormType("F-1").length;
  const amendCount = loadFilingsByFormType("F-1/A").length;

  return (
    <LearnArticle
      slug="f-1"
      title="What is an F-1 filing?"
      tldr="F-1 is the SEC initial registration statement filed by foreign private issuers — non-U.S. companies registering shares for public sale in the U.S. for the first time. It is the foreign-issuer equivalent of the S-1, adapted to accommodate IFRS or home-country GAAP financial statements and home-country governance practices."
      sections={[
        {
          heading: "Who files an F-1, and when",
          body: (
            <>
              <p>
                An F-1 is filed under the Securities Act of 1933 by a
                foreign private issuer (FPI) registering an offering of
                securities for the first time in the United States.
                &quot;First time&quot; is the key word: subsequent
                primary offerings by the same FPI typically use F-3
                (analogous to S-3), which permits incorporation by
                reference to the issuer&apos;s ongoing 20-F annual
                reports.
              </p>
              <p>
                F-1 filings cluster around IPOs of large non-U.S.
                companies seeking U.S. exchange listings — companies
                like Alibaba (2014), Tencent Music (2018), and Arm
                Holdings (2023). The filing is the public document
                investors read to evaluate the offering during the
                roadshow period.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside an F-1",
          body: (
            <>
              <p>
                The F-1 prospectus is structured similarly to an S-1
                but with foreign-issuer adaptations:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">Risk Factors</strong>{" "}
                  — including foreign-issuer-specific risks (currency,
                  political, regulatory regime, controlled-company
                  structure, dual-class share governance).
                </li>
                <li>
                  <strong className="text-text">MD&amp;A in IFRS or home GAAP</strong>{" "}
                  — financials may be in International Financial
                  Reporting Standards or home-country GAAP. U.S.-GAAP
                  reconciliation has not been required since 2007 for
                  IFRS filers.
                </li>
                <li>
                  <strong className="text-text">Description of share capital</strong>{" "}
                  — class structure, voting rights, transfer
                  restrictions, depository receipt mechanics (ADR
                  ratio if applicable).
                </li>
                <li>
                  <strong className="text-text">Material agreements</strong>{" "}
                  — concession agreements, government contracts, key
                  customer contracts, controlled-company arrangements.
                </li>
                <li>
                  <strong className="text-text">Underwriting</strong>{" "}
                  — same content as S-1: book-running managers,
                  lock-up periods, greenshoe option, allocation method.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "F-1 amendments and the registration process",
          body: (
            <>
              <p>
                The initial F-1 is followed by one or more amendments
                (F-1/A) as the SEC staff issues comments and the issuer
                responds. Pricing-period amendments contain the final
                share-count, price-range, and selling-shareholder
                disclosures. The final F-1/A immediately before
                effectiveness is typically the document underwriters
                use for the final marketing push.
              </p>
              <p>
                Once the SEC declares the F-1 effective, the issuer
                files the final prospectus (424B form), the shares
                price, and trading commences. The F-1 itself is the
                durable public record — every fact in the final
                prospectus traces back to an F-1 or F-1/A.
              </p>
            </>
          ),
        },
      ]}
      ourView="F-1s are read most carefully by professionals who already know what they're looking for: governance carve-outs, controlled-company arrangements, dual-class share structures, and the specific home-country regulatory regime the issuer is filing from. Retail readers should skim the risk-factor section twice and ignore the 200-page MD&A unless they have the time to compare it line-by-line against home-country audited filings. The single most-mispriced foreign-IPO risk in the historical record has been governance, not accounting."
      liveDataLink={liveCount > 0 ? {
        label: "Browse live F-1 filings",
        href: "/form/f-1",
        count: liveCount,
      } : undefined}
      related={[
        { slug: "s-1", title: "What is an S-1 filing?" },
        { slug: "20-f", title: "What is a 20-F filing?" },
        { slug: "6-k", title: "What is a 6-K filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/",
          label: "HoldLens: Smart-money signals across 30 tracked superinvestors",
          description:
            "Some tracked superinvestors (e.g., Burry, Klarman, Ackman variants) maintain non-trivial foreign-issuer positions. The post-IPO 13F quarter following an F-1 effective date is where institutional buyers first appear on the public record.",
        },
      ]}
      definedTerms={[
        {
          term: "F-1",
          description:
            "Initial registration statement under the Securities Act of 1933 filed by a foreign private issuer registering an offering of securities in the U.S. for the first time. The foreign-issuer equivalent of the S-1.",
        },
        {
          term: "F-1/A",
          description:
            "Amendment to a previously filed F-1. Multiple amendments are typical during the SEC review process, addressing staff comments and updating offering terms as the IPO process progresses.",
        },
        {
          term: "Foreign Private Issuer (FPI)",
          description:
            "A non-U.S. company that does not meet the SEC's definition of a U.S. domestic issuer. Eligibility allows use of foreign-issuer-specific forms (F-1, F-3, F-4, 20-F, 6-K) rather than U.S.-domestic forms (S-1, S-3, S-4, 10-K, 10-Q).",
        },
        {
          term: "F-3",
          description:
            "Short-form registration statement available to FPIs that have been reporting under the Exchange Act for at least 12 months. Permits incorporation by reference to ongoing 20-F filings. The foreign-issuer counterpart to S-3.",
        },
        {
          term: "ADR",
          description:
            "American Depositary Receipt. A U.S.-issued security representing shares of a foreign company held on deposit at a U.S. bank. Many F-1 offerings are of ADRs rather than ordinary shares; the F-6 form registers the depository facility itself.",
        },
      ]}
    />
  );
}
