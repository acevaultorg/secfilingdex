import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a Form 144 filing?",
  description:
    "Form 144 is the SEC notice of proposed sale of restricted or control securities by affiliates. Filed under Rule 144 of the Securities Act, it declares intent to sell — not actual sale. Plain-English explainer with Form 4 contrast.",
  alternates: { canonical: `${SITE_URL}/learn/form-144/` },
};

export default function LearnForm144Page() {
  const liveCount = loadFilingsByFormType("144").length + loadFilingsByFormType("144/A").length;

  return (
    <LearnArticle
      slug="form-144"
      title="What is a Form 144 filing?"
      tldr="Form 144 is the SEC notice of proposed sale of restricted or control securities filed by an affiliate of the issuer. Required under Rule 144 of the Securities Act when the affiliate intends to sell more than 5,000 shares or $50,000 in aggregate value during any three-month period. Form 144 announces intent; Form 4 reports actual execution."
      sections={[
        {
          heading: "Who files a Form 144, and when",
          body: (
            <>
              <p>
                Rule 144 under the Securities Act of 1933 governs the
                public resale of &quot;restricted securities&quot; (shares
                acquired in unregistered transactions like private
                placements) and &quot;control securities&quot; (shares
                held by issuer affiliates — typically officers,
                directors, and 10%+ holders).
              </p>
              <p>
                An affiliate must file Form 144 with the SEC concurrently
                with placing a sell order if the sale would exceed the
                Rule 144 reporting threshold: more than 5,000 shares or
                aggregate sales of more than $50,000 during any preceding
                three-month period.
              </p>
              <p>
                The filing is a notice of <em>intent</em>. The actual
                sale, when executed, is reported separately on Form 4
                (the insider transactions filing). The two filings work
                in tandem — 144 announces, 4 confirms.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside a Form 144",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Affiliate identification</strong>{" "}
                — name, relationship to issuer (officer, director, 10%+
                holder, etc.).
              </li>
              <li>
                <strong className="text-text">Securities to be sold</strong>{" "}
                — class, number of shares, aggregate market value,
                approximate date of proposed sale.
              </li>
              <li>
                <strong className="text-text">Acquisition history</strong>{" "}
                — date of original acquisition, nature of acquisition
                (stock-based compensation, private placement, public
                market, etc.), payment information (cash, services,
                etc.).
              </li>
              <li>
                <strong className="text-text">Broker information</strong>{" "}
                — the broker through whom the sale will be effected,
                broker&apos;s representation regarding compliance with
                Rule 144&apos;s manner-of-sale conditions.
              </li>
              <li>
                <strong className="text-text">Prior sales</strong>{" "}
                — sales of the same class by the same affiliate during
                the preceding three months, supporting the volume-
                limitation analysis.
              </li>
            </ul>
          ),
        },
        {
          heading: "Form 144 vs Form 4 — read them together",
          body: (
            <>
              <p>
                A Form 144 typically appears 1-5 trading days BEFORE the
                corresponding Form 4. The 144 telegraphs the sell
                decision; the 4 confirms execution and reports the
                volume-weighted average price. The two-filing structure
                exists because Rule 144&apos;s volume limitation requires
                the affiliate to commit to a maximum, which the SEC must
                see before the trades are placed.
              </p>
              <p>
                Practical pattern-reading: a Form 144 followed by a
                Form 4 at materially LOWER share count than the 144
                announced means the affiliate sold less than they
                originally intended — often a signal of seller
                hesitation or favorable trading conditions allowing the
                lower volume to clear at acceptable price. The opposite
                (Form 4 at the maximum 144 volume across a tight
                trading window) signals aggressive selling.
              </p>
            </>
          ),
        },
      ]}
      ourView="Form 144 is one of the most underwatched filings in the SEC catalog because the actual transaction reporting happens elsewhere (Form 4). But the 144 contains forward-looking information — the affiliate&apos;s intent — that Form 4 does not. Reading 144s for tracked-superinvestor portfolio companies gives a 1-5 day head start on the same-day Form 4 selling pressure. The signal is structurally undervalued in retail-investor screeners."
      liveDataLink={liveCount > 0 ? {
        label: "Browse live Form 144 filings",
        href: "/form/144",
        count: liveCount,
      } : undefined}
      related={[
        { slug: "form-4", title: "What is a Form 4 filing?" },
        { slug: "s-1", title: "What is an S-1 filing?" },
        { slug: "13d-vs-13g", title: "13D vs 13G — activist vs passive" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/learn/insider-score-explained",
          label: "HoldLens: Insider Score — quantifying Form 4 signals",
          description:
            "HoldLens's Insider Score reads Form 4 executions. The companion Form 144 announcements that precede Form 4 sells are an upstream signal — useful for sequencing insider-selling trades against earnings windows.",
        },
        {
          href: "https://holdlens.com/learn/congressional-stock-trading-stock-act",
          label: "HoldLens: Congressional stock trading and the STOCK Act",
          description:
            "Congressional disclosures parallel the 144/4 structure — periodic transaction reports announce, then settle the position in the public record.",
        },
      ]}
      definedTerms={[
        {
          term: "Form 144",
          description:
            "SEC notice of proposed sale of restricted or control securities by an affiliate of the issuer, filed under Rule 144 of the Securities Act of 1933. Required when proposed sales exceed 5,000 shares or $50,000 aggregate value in any 3-month period.",
        },
        {
          term: "Rule 144",
          description:
            "The safe-harbor rule under the Securities Act permitting the public resale of restricted and control securities under specified conditions: holding-period requirement, current public information, volume limitation, manner of sale, and Form 144 filing.",
        },
        {
          term: "Affiliate",
          description:
            "A person that controls, is controlled by, or is under common control with the issuer — typically officers, directors, and 10%+ shareholders. Defined in Rule 144(a)(1). The 'affiliate' classification triggers Form 144 filing obligations.",
        },
        {
          term: "Restricted Securities",
          description:
            "Securities acquired in unregistered transactions (private placements, employment-grant vesting, gifts, etc.). Subject to Rule 144 holding periods (6 months for reporting issuers, 12 months for non-reporting) and resale conditions.",
        },
        {
          term: "Volume Limitation",
          description:
            "Rule 144's restriction that affiliates may not sell more than the greater of (a) 1% of the outstanding class or (b) the average weekly trading volume of the prior 4 weeks during any 3-month period. Form 144 declares the proposed sale's compliance with this limit.",
        },
      ]}
    />
  );
}
