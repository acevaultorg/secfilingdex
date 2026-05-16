import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is an N-CSR filing?",
  description:
    "N-CSR is the SEC certified annual or semi-annual shareholder report filed by registered investment companies (mutual funds, ETFs, closed-end funds). The fund-industry equivalent of a 10-K for retail-fund investors.",
  alternates: { canonical: `${SITE_URL}/learn/n-csr/` },
};

export default function LearnNCSRPage() {
  const liveCount = loadFilingsByFormType("N-CSR").length + loadFilingsByFormType("N-CSRS").length;

  return (
    <LearnArticle
      slug="n-csr"
      title="What is an N-CSR filing?"
      tldr="N-CSR is the certified annual or semi-annual shareholder report filed by registered investment companies — mutual funds, ETFs, and closed-end funds — under Rule 30b2-1 of the Investment Company Act of 1940. It is the fund-industry counterpart to the 10-K for retail-fund holders, containing audited financial statements + the principal executive officer's Sarbanes-Oxley certification."
      sections={[
        {
          heading: "Who files an N-CSR, and when",
          body: (
            <>
              <p>
                Every U.S. registered investment company (mutual fund,
                ETF, closed-end fund, BDC) files an N-CSR within 10 days
                after the report is sent to shareholders. The annual
                N-CSR (covering the fund&apos;s fiscal year) requires
                audited financials. The semi-annual N-CSRS covers the
                six-month interim period and contains unaudited
                financials.
              </p>
              <p>
                Funds whose fiscal year ends December 31 typically file
                N-CSR in late February through early March. ETF
                complexes with January or July fiscal years are spread
                across the calendar. The report itself must reach
                shareholders within 60 days of period-end; N-CSR
                follows in EDGAR within 10 days of mailing.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside an N-CSR",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Audited financial statements</strong>{" "}
                — schedule of investments, statement of assets and
                liabilities, statement of operations, statement of
                changes in net assets, financial highlights, notes.
              </li>
              <li>
                <strong className="text-text">Schedule of investments</strong>{" "}
                — every holding the fund owned as of the reporting
                date, with par value, market value, and percentage of
                net assets. The portfolio surface mutual-fund analysts
                read most carefully.
              </li>
              <li>
                <strong className="text-text">Expense ratios + turnover</strong>{" "}
                — total expense ratio breakdown (management, 12b-1,
                other) and portfolio turnover rate. The cost-side data
                that determines a fund&apos;s long-term net return.
              </li>
              <li>
                <strong className="text-text">Approval of advisory contract</strong>{" "}
                — board discussion of the advisory-contract renewal,
                with the substantive factors required by Section 15(c)
                of the 1940 Act. The single best window into board
                independence in fund governance.
              </li>
              <li>
                <strong className="text-text">SOX certifications</strong>{" "}
                — principal executive and financial officer
                certifications (302/906) attesting to the accuracy of
                the financials. Same legal standard as 10-K
                certifications.
              </li>
            </ul>
          ),
        },
        {
          heading: "N-CSR vs N-PORT — different scopes for different audiences",
          body: (
            <>
              <p>
                N-CSR is the periodic annual/semi-annual <em>narrative</em>{" "}
                report — financial statements, fund-strategy commentary,
                advisory-contract review. N-PORT is the SEC&apos;s
                monthly portfolio-snapshot filing (publicly available
                quarterly), which surfaces month-end holdings without
                the narrative wrapper.
              </p>
              <p>
                For fundamental fund research, both filings matter: N-CSR
                gives you the audited expense + governance picture
                (annual); N-PORT gives you the monthly position-level
                drift. Funds whose N-CSR shows aggressive trading need
                to show consistent N-PORT month-to-month patterns to
                back up the narrative.
              </p>
            </>
          ),
        },
      ]}
      ourView="N-CSR is one of the most underwatched filings in retail-fund research. Most retail mutual-fund holders never read it. But every fund — including the S&P 500 index fund in your 401(k) — files one annually with audited financials and a verbatim advisory-contract review that tells you exactly what the board negotiated on your behalf. The advisory-contract section is the single best read in the entire fund-disclosure universe; it&apos;s where governance breaks down or holds up in plain English."
      liveDataLink={liveCount > 0 ? {
        label: "Browse live N-CSR filings",
        href: "/form/n-csr",
        count: liveCount,
      } : undefined}
      related={[
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "def-14a", title: "What is a DEF 14A filing?" },
        { slug: "13f", title: "What is a 13F filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/",
          label: "HoldLens: Smart-money signals across 30 tracked superinvestors",
          description:
            "Several tracked managers run mutual funds or ETFs in addition to private hedge funds. Their N-CSR filings are the public-record alternative to 13F when the vehicle is a registered investment company.",
        },
      ]}
      definedTerms={[
        {
          term: "N-CSR",
          description:
            "Certified annual shareholder report filed by registered investment companies under Rule 30b2-1 of the Investment Company Act of 1940. Contains audited financial statements and the SOX 302/906 certifications by principal executive and financial officers.",
        },
        {
          term: "N-CSRS",
          description:
            "Certified semi-annual shareholder report. The interim companion to N-CSR. Contains unaudited financials covering the first six months of the fiscal year. Required under the same Rule 30b2-1.",
        },
        {
          term: "Investment Company Act of 1940",
          description:
            "The federal statute regulating registered investment companies — mutual funds, ETFs, closed-end funds, BDCs. Establishes the 1940-Act regulatory regime (board independence, fee disclosure, distribution channels) distinct from the 1933/34 Acts applicable to operating companies.",
        },
        {
          term: "Advisory Contract Review",
          description:
            "The board's annual evaluation of the fund's advisory contract under Section 15(c) of the 1940 Act. Required disclosure in N-CSR; must address nature/quality of services, fees, profitability, economies of scale, and benefits to the adviser. The substantive governance check in registered-fund oversight.",
        },
        {
          term: "N-PORT",
          description:
            "Monthly portfolio-holdings filing required of registered open-end funds. Quarterly N-PORT (covering the third month of each quarter) becomes public 60 days after period-end. Complements N-CSR's annual narrative with monthly position-level disclosure.",
        },
      ]}
    />
  );
}
