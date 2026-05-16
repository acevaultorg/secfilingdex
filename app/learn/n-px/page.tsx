import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is an N-PX filing?",
  description:
    "N-PX is the annual proxy voting record filed by mutual funds and other registered investment companies. It discloses how the fund voted every proxy ballot for the prior 12 months — the public record of fund-manager governance positions.",
  alternates: { canonical: `${SITE_URL}/learn/n-px/` },
};

export default function LearnNPXPage() {
  const liveCount = loadFilingsByFormType("N-PX").length;

  return (
    <LearnArticle
      slug="n-px"
      title="What is an N-PX filing?"
      tldr="N-PX is the annual proxy voting record filed by registered investment companies under Rule 30b1-4 of the Investment Company Act of 1940. It discloses every proxy ballot the fund voted on between July 1 and June 30 — providing the public record of which way the fund-manager voted on board elections, say-on-pay, M&A, shareholder proposals, and every other DEF 14A matter."
      sections={[
        {
          heading: "Who files an N-PX, and when",
          body: (
            <>
              <p>
                Every registered investment company that holds voting
                securities — mutual funds, ETFs, closed-end funds, BDCs
                — must file N-PX by August 31 each year, covering the
                12-month period ending June 30. The structure is
                designed so that fund-manager proxy votes from any
                given annual-meeting season become public no later
                than two months after the season closes.
              </p>
              <p>
                The 2022 SEC rule amendments expanded N-PX considerably.
                Beyond the original baseline (vote-by-vote disclosure
                with proposal text), filers now disclose how they voted
                on shareholder proposals separately from management
                proposals, with structured XML data that enables
                cross-filer comparison at scale.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside an N-PX",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Every voted ballot</strong>{" "}
                — the issuer&apos;s name, the meeting date, the
                proposal text, who made the proposal (management,
                shareholder), the fund&apos;s vote (For, Against,
                Withhold, Abstain), and whether the vote followed or
                opposed management.
              </li>
              <li>
                <strong className="text-text">Categorical tagging (2022+)</strong>{" "}
                — each proposal tagged by category (director election,
                executive compensation, audit, capital structure,
                environment, social, governance, etc.) for structured
                data analysis.
              </li>
              <li>
                <strong className="text-text">Securities-lending disclosure</strong>{" "}
                — discloses positions that were on loan as of the
                record date and therefore could not be voted (because
                voting rights transfer with the loaned security).
              </li>
              <li>
                <strong className="text-text">Per-fund vs per-series breakdown</strong>{" "}
                — for trust filers with multiple fund series, votes
                are broken out per series so investors can see how
                their specific fund voted (not just the parent complex).
              </li>
            </ul>
          ),
        },
        {
          heading: "How smart-money researchers read N-PX",
          body: (
            <>
              <p>
                N-PX is the cleanest public-record window into
                institutional-investor governance views. The patterns
                are durable: BlackRock&apos;s post-2020 climate-vote
                shifts, Vanguard&apos;s evolving position on board
                independence, State Street&apos;s diversity-disclosure
                campaigns — all traceable filing-by-filing in N-PX.
              </p>
              <p>
                Cross-fund analysis is where N-PX compounds. Comparing
                how two large fund complexes voted the same ballot on
                the same issuer shows the governance fault lines that
                aren&apos;t visible in press releases or proxy advisor
                summaries. The 2022 amendments specifically made this
                cross-filer comparison feasible by mandating structured
                XML.
              </p>
            </>
          ),
        },
      ]}
      ourView="N-PX is the single best free dataset for understanding institutional governance preferences. Most retail-fund holders never read it; very few financial journalists cite it; index-fund disclosure mostly happens through annual ESG reports that paraphrase the underlying N-PX. The raw filings tell a much cleaner story. If you hold an index fund and you wonder whether your fund manager actually votes the way you'd want them to vote, N-PX is the unambiguous public-record answer."
      liveDataLink={liveCount > 0 ? {
        label: "Browse live N-PX filings",
        href: "/form/n-px",
        count: liveCount,
      } : undefined}
      related={[
        { slug: "def-14a", title: "What is a DEF 14A filing?" },
        { slug: "n-csr", title: "What is an N-CSR filing?" },
        { slug: "13f", title: "What is a 13F filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/",
          label: "HoldLens: Smart-money signals across 30 tracked superinvestors",
          description:
            "Proxy-voting patterns from N-PX overlay the 13F position data HoldLens tracks — manager governance views revealed by votes complement the positioning views revealed by holdings.",
        },
      ]}
      definedTerms={[
        {
          term: "N-PX",
          description:
            "Annual proxy-voting record filing by registered investment companies under Rule 30b1-4 of the Investment Company Act of 1940. Covers July 1 through June 30; due August 31. Discloses every proxy vote cast by the fund during the period.",
        },
        {
          term: "Rule 30b1-4",
          description:
            "The 1940-Act rule requiring N-PX. Adopted January 2003 to bring transparency to fund proxy voting. 2022 amendments substantially expanded categorical tagging, structured XML, and shareholder-proposal disclosure.",
        },
        {
          term: "Securities Lending",
          description:
            "The practice of lending portfolio securities to short-sellers and other counterparties for a fee. Material to N-PX because loaned securities cannot be voted by the fund — voting rights transfer with the security. Funds must disclose loaned-and-unvoted positions.",
        },
        {
          term: "Proxy Advisor",
          description:
            "Firm issuing voting recommendations to institutional investors. ISS and Glass Lewis collectively influence ~90% of U.S. institutional proxy votes. Their recommendations are visible upstream of N-PX as the unstated default for many fund managers' votes.",
        },
        {
          term: "Categorical Tagging",
          description:
            "The structured-data classification of each proxy proposal by category (director election, executive compensation, environment, social, governance, etc.) introduced by the 2022 N-PX amendments. Enables cross-fund comparison and aggregate ESG-vote analysis.",
        },
      ]}
    />
  );
}
