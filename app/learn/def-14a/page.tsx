import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a DEF 14A filing?",
  description:
    "DEF 14A is the definitive proxy statement U.S. public companies file before annual or special shareholder meetings. Plain-English explainer of director elections, say-on-pay, executive compensation, and shareholder proposals — with live filings.",
  alternates: { canonical: `${SITE_URL}/learn/def-14a/` },
};

export default function LearnDef14APage() {
  const liveCount = loadFilingsByFormType("DEF 14A").length;
  const preCount = loadFilingsByFormType("PRE 14A").length;
  const additionalCount = loadFilingsByFormType("DEFA14A").length;

  return (
    <LearnArticle
      slug="def-14a"
      title="What is a DEF 14A filing?"
      tldr="DEF 14A is the definitive proxy statement a U.S. public company files with the SEC before any meeting at which shareholders vote — typically the annual meeting. It tells shareholders what they are voting on and gives them the data to vote informed."
      sections={[
        {
          heading: "DEF 14A is the official proxy package",
          body: (
            <>
              <p>
                Section 14(a) of the Securities Exchange Act of 1934 and
                SEC Regulation 14A require companies soliciting
                shareholder proxies to file a proxy statement disclosing
                what is being voted on, how the company recommends each
                vote, and the information shareholders need to evaluate
                management.
              </p>
              <p>
                The DEF 14A is the &ldquo;definitive&rdquo; version filed
                shortly before the meeting. Many companies first file a
                preliminary version (PRE 14A) for SEC review, then refile
                as DEF 14A once any SEC comments are addressed.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside a typical DEF 14A",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Notice of Annual Meeting:</strong>{" "}
                date, time, location (or webcast URL), record date.
              </li>
              <li>
                <strong className="text-text">Voting items:</strong>{" "}
                director election, ratification of auditor, advisory
                vote on executive compensation (&ldquo;Say-on-Pay&rdquo;),
                advisory vote on Say-on-Pay frequency, equity-plan
                approvals, shareholder proposals.
              </li>
              <li>
                <strong className="text-text">Director nominees:</strong>{" "}
                biographies, qualifications, independence status, board
                committee memberships, prior public-company directorships.
              </li>
              <li>
                <strong className="text-text">Executive compensation:</strong>{" "}
                Compensation Discussion and Analysis (CD&amp;A), Summary
                Compensation Table, pay-vs-performance disclosures, CEO
                pay-ratio disclosure.
              </li>
              <li>
                <strong className="text-text">Stock ownership:</strong>{" "}
                principal stockholders (≥5%), directors and named
                executive officers, related-person transactions.
              </li>
              <li>
                <strong className="text-text">Shareholder proposals:</strong>{" "}
                Rule 14a-8 proposals submitted by shareholders, with the
                board&apos;s position.
              </li>
              <li>
                <strong className="text-text">Auditor matters:</strong>{" "}
                fees paid by category, audit-committee report.
              </li>
            </ul>
          ),
        },
        {
          heading: "DEF 14A vs. PRE 14A vs. DEFA14A",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">PRE 14A:</strong>{" "}
                preliminary proxy. Filed for SEC review when the matters
                being voted on are &ldquo;non-routine&rdquo; (e.g.,
                M&amp;A, board contests). SecFilingDex tracks{" "}
                <a href="/form/pre-14a" className="text-brand hover:underline">
                  {preCount} PRE 14A filings
                </a>
                .
              </li>
              <li>
                <strong className="text-text">DEF 14A:</strong> definitive
                proxy. The version mailed (or e-delivered) to
                shareholders. SecFilingDex tracks{" "}
                <a href="/form/def-14a" className="text-brand hover:underline">
                  {liveCount} DEF 14A filings
                </a>
                .
              </li>
              <li>
                <strong className="text-text">DEFA14A:</strong> additional
                proxy materials. Used to provide updates, corrections, or
                supplemental information after the initial DEF 14A —
                particularly common during contested votes when the
                company responds to activist mailings. SecFilingDex
                tracks{" "}
                <a href="/form/defa14a" className="text-brand hover:underline">
                  {additionalCount} DEFA14A filings
                </a>
                .
              </li>
            </ul>
          ),
        },
        {
          heading: "Why proxies matter — beyond the vote itself",
          body: (
            <p>
              Even passive shareholders should read the proxy. The
              CD&amp;A is the most candid disclosure on executive
              incentives the company will produce — it explains what
              metrics the board chose to reward, why, and how
              compensation lined up with performance. Pay-ratio and
              pay-vs-performance disclosures (mandatory since 2018 +
              2023 respectively) make pay structures cross-comparable
              with peers in a way the 10-K cannot.
            </p>
          ),
        },
      ]}
      faqs={[
        {
          q: "What is the difference between a DEF 14A and a PRE 14A?",
          a: "A PRE 14A is the preliminary proxy, filed for SEC review when non-routine matters such as M&A or board contests are on the ballot. The DEF 14A is the definitive version mailed or e-delivered to shareholders once any SEC comments are addressed.",
        },
        {
          q: "What do shareholders vote on in a DEF 14A?",
          a: "Typically director elections, ratification of the auditor, the advisory Say-on-Pay vote on executive compensation, the Say-on-Pay frequency vote, equity-plan approvals, and any Rule 14a-8 shareholder proposals — each with the board's recommended vote.",
        },
        {
          q: "What is Say-on-Pay?",
          a: "An advisory shareholder vote on executive compensation packages required by Section 14A of the Exchange Act, added by Dodd-Frank in 2010. It is non-binding but politically meaningful.",
        },
        {
          q: "What is a DEFA14A?",
          a: "Additional definitive proxy soliciting materials — updates, corrections, or supplemental information filed after the initial DEF 14A. They are particularly common during contested votes, when a company responds to activist mailings.",
        },
        {
          q: "Where is executive pay explained in a proxy statement?",
          a: "In the Compensation Discussion and Analysis (CD&A), the narrative section explaining the rationale for pay decisions, alongside the Summary Compensation Table, the CEO pay-ratio disclosure (mandatory since 2018), and the pay-vs-performance disclosure (mandatory since 2023).",
        },
      ]}
      ourView="The proxy is the most underused governance disclosure on EDGAR. Activist campaigns are won and lost on it; shareholder proposals foreshadow regulation; CD&amp;A drift quarter-over-quarter telegraphs board priority shifts. Two practical hacks: (1) compare consecutive years' CD&amp;A diff to see what board emphasis changed; (2) read the Audit Committee Report — its tone tells you how seriously the board takes the auditor relationship."
      liveDataLink={{
        label: "Browse live DEF 14A filings",
        href: "/form/def-14a",
        count: liveCount,
      }}
      related={[
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "8-k", title: "What is an 8-K filing?" },
        { slug: "13d-vs-13g", title: "13D vs. 13G: what's the difference?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/",
          label: "HoldLens: Smart-money signals across 30 tracked superinvestors",
          description:
            "Proxy voting outcomes shape governance — HoldLens overlays them against fund-manager positioning.",
        },
      ]}
      definedTerms={[
        {
          term: "DEF 14A",
          description:
            "Definitive proxy statement filed under Section 14(a) of the Securities Exchange Act of 1934 and Regulation 14A. The official proxy package mailed or e-delivered to shareholders before a vote.",
        },
        {
          term: "PRE 14A",
          description:
            "Preliminary proxy statement filed for SEC review when non-routine matters are on the ballot. Typically becomes a DEF 14A after SEC comments are addressed.",
        },
        {
          term: "DEFA14A",
          description:
            "Additional definitive proxy soliciting materials. Updates, corrections, or supplements after the initial DEF 14A — common during contested votes.",
        },
        {
          term: "Say-on-Pay",
          description:
            "Advisory shareholder vote on executive compensation packages required by Section 14A of the Exchange Act (added by Dodd-Frank, 2010). Non-binding but politically meaningful.",
        },
        {
          term: "CD&A",
          description:
            "Compensation Discussion and Analysis. The narrative section of the proxy explaining the rationale for executive pay decisions. The most candid disclosure on board priorities the company produces.",
        },
        {
          term: "Rule 14a-8",
          description:
            "SEC rule allowing eligible shareholders to submit proposals for inclusion in the company's proxy. Subject to substantive and procedural requirements; the board may exclude proposals on certain grounds with SEC concurrence.",
        },
      ]}
    />
  );
}
