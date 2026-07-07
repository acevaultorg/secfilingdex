import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a Form 4 filing?",
  description:
    "Form 4 is the SEC insider-transaction report — officers, directors, and ≥10% owners must file within two business days of any change in ownership of company securities. Plain-English explainer with live filings.",
  alternates: { canonical: `${SITE_URL}/learn/form-4/` },
};

export default function LearnForm4Page() {
  const liveCount = loadFilingsByFormType("Form 4").length;

  return (
    <LearnArticle
      slug="form-4"
      title="What is a Form 4 filing?"
      tldr="Form 4 is the SEC insider-transaction report. Officers, directors, and ≥10% beneficial owners (Section 16 reporting persons) must file within two business days of any change in their ownership of the company's securities."
      sections={[
        {
          heading: "Who files a Form 4 — Section 16 reporting persons",
          body: (
            <>
              <p>
                Section 16 of the Securities Exchange Act of 1934
                identifies three categories of insider:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">Officers</strong> of the
                  issuer (executive officers per the company&apos;s
                  Section 16 designation).
                </li>
                <li>
                  <strong className="text-text">Directors</strong> of the
                  issuer.
                </li>
                <li>
                  <strong className="text-text">≥10% beneficial owners</strong>{" "}
                  of any registered class of equity securities.
                </li>
              </ul>
              <p>
                These three categories are required to disclose their
                holdings via Form 3 (initial), Form 4 (changes), and Form
                5 (annual catch-up).
              </p>
            </>
          ),
        },
        {
          heading: "The two-business-day rule",
          body: (
            <>
              <p>
                Form 4 must be filed within{" "}
                <strong className="text-text">two business days</strong>{" "}
                of the transaction date. This was tightened from 10 days
                by Sarbanes-Oxley (2002). The short window means insider
                transactions are nearly contemporaneous public information.
              </p>
              <p>
                A few exceptions exist (e.g., certain pre-arranged Rule
                10b5-1 trading plans, transactions with the issuer that
                may delay reporting), but for most market-relevant
                transactions, the disclosure is fast.
              </p>
            </>
          ),
        },
        {
          heading: "How to read a Form 4 — Tables I and II",
          body: (
            <>
              <p>
                Form 4 has two transaction tables:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">Table I — Non-Derivative:</strong>{" "}
                  ordinary common-stock transactions. The columns most
                  observers track: Transaction Date, Transaction Code (P
                  = open-market purchase, S = open-market sale, A =
                  grant, M = exercise, D = disposition), Amount, Price,
                  Acquired/Disposed code (A/D).
                </li>
                <li>
                  <strong className="text-text">Table II — Derivative:</strong>{" "}
                  options, warrants, RSUs, and other derivative
                  securities. Often where compensation grants and
                  exercises live.
                </li>
              </ul>
              <p>
                The transaction code matters more than the column header.
                Code P (open-market purchase using personal funds) is the
                strongest insider signal. Code S (open-market sale) is
                noisier — many insider sales are routine 10b5-1 plan
                executions or tax-related, not bearish bets.
              </p>
            </>
          ),
        },
        {
          heading: "10b5-1 trading plans",
          body: (
            <p>
              Rule 10b5-1 lets insiders pre-schedule trades during open
              windows so the actual execution can occur during a closed
              window without violating insider-trading rules. Form 4
              disclosures include a checkbox indicating whether the
              transaction was pursuant to a 10b5-1 plan (since 2023). A
              checked box reduces the signal value of the trade — the
              decision was made months ago, not in response to current
              information.
            </p>
          ),
        },
      ]}
      ourView="Insider buying is a stronger signal than insider selling. Officers and directors sell for a hundred reasons (taxes, diversification, scheduled plans, life events). They buy for one: they think the stock is mispriced. Cluster Form 4 buys — multiple unrelated insiders buying within a short window — are among the highest-conviction qualitative signals on EDGAR."
      liveDataLink={{
        label: "Browse live Form 4 filings",
        href: "/form/form-4",
        count: liveCount,
      }}
      related={[
        { slug: "13f", title: "What is a 13F filing?" },
        { slug: "13d-vs-13g", title: "13D vs. 13G: what's the difference?" },
        { slug: "8-k", title: "What is an 8-K filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/learn/form-4-vs-13f",
          label: "HoldLens: Form 4 vs 13F (the comparison)",
          description:
            "When does each filing actually matter? The two-day Form 4 disclosure vs the 45-day-stale 13F snapshot — read together they answer different questions.",
        },
        {
          href: "https://holdlens.com/insiders/",
          label: "HoldLens: Live insider tracker (InsiderScore)",
          description:
            "Scored Form 4 activity across major tickers — clustered insider buying/selling signals, not just the raw filings.",
        },
        {
          href: "https://holdlens.com/learn/insider-score-explained",
          label: "HoldLens: How InsiderScore is computed",
          description:
            "Methodology for turning Form 4 transactions into a scored signal — what gets weighted, what gets ignored, why.",
        },
      ]}
      definedTerms={[
        {
          term: "Form 4",
          description:
            "SEC report under Section 16 disclosing changes in beneficial ownership of issuer securities by officers, directors, and ≥10% beneficial owners. Must be filed within two business days of the transaction.",
        },
        {
          term: "Section 16",
          description:
            "Section 16 of the Securities Exchange Act of 1934. Establishes the reporting and trading restrictions for officers, directors, and ≥10% beneficial owners of public companies.",
        },
        {
          term: "Rule 10b5-1",
          description:
            "SEC rule allowing insiders to pre-establish written trading plans during open windows; trades executed under the plan are protected from insider-trading liability even if executed during closed windows.",
        },
        {
          term: "Transaction Code P",
          description:
            "Form 4 transaction code indicating an open-market or private purchase of securities. Generally interpreted as the strongest insider signal.",
        },
        {
          term: "Transaction Code S",
          description:
            "Form 4 transaction code indicating an open-market or private sale of securities. Often routine; check whether 10b5-1 box is checked before drawing conclusions.",
        },
      ]}
      faqs={[
        {
          q: "Who has to file a Form 4?",
          a: "Section 16 reporting persons — a company's officers, directors, and beneficial owners of more than 10% of its stock — must file a Form 4 for any change in their ownership of the company's securities.",
        },
        {
          q: "How quickly must a Form 4 be filed?",
          a: "Within two business days of the transaction that changed the insider's ownership.",
        },
        {
          q: "Does an insider sale on a Form 4 signal that the stock will fall?",
          a: "Not necessarily. A sale (transaction code S) is often routine — for diversification, taxes, or under a pre-arranged 10b5-1 plan. Check whether the 10b5-1 box is checked before drawing conclusions. An open-market purchase (code P) is generally read as the stronger insider signal.",
        },
        {
          q: "What is a Rule 10b5-1 trading plan?",
          a: "A written trading plan an insider pre-establishes during an open window. Trades executed under the plan are protected from insider-trading liability even if they occur during an otherwise-closed window — which is why a sale under a 10b5-1 plan carries less signal than a discretionary one.",
        },
      ]}
    />
  );
}
