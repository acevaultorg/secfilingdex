import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a 10-K filing?",
  description:
    "A 10-K is the audited annual report U.S. public companies file with the SEC — business overview, risk factors, MD&A, and certified financial statements. Plain-English explainer with live filings.",
  alternates: { canonical: `${SITE_URL}/learn/10-k/` },
};

export default function Learn10KPage() {
  const liveCount = loadFilingsByFormType("10-K").length;
  const amendCount = loadFilingsByFormType("10-K/A").length;

  return (
    <LearnArticle
      slug="10-k"
      title="What is a 10-K filing?"
      tldr="A 10-K is the audited annual report U.S. public companies file with the SEC. It is the single most comprehensive disclosure a domestic registrant produces in any given year."
      dateModified="2026-09-10"
      sections={[
        {
          heading: "A 10-K is the annual report — comprehensive, audited, and required",
          body: (
            <>
              <p>
                The 10-K is filed once per fiscal year by every U.S.
                domestic public company under Section 13 or 15(d) of the
                Securities Exchange Act of 1934. Form 10-K is the filing
                submitted to the SEC. Companies may reproduce it inside, or
                combine it with, the annual report sent to shareholders,
                which is designed for a broader audience.
              </p>
              <p>
                Filing deadlines depend on the company&apos;s public float:
                large accelerated filers (≥$700M public float) file within
                60 days of fiscal year-end, accelerated filers within 75
                days, and non-accelerated filers within 90 days.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside a 10-K",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Item 1 — Business:</strong>{" "}
                what the company does, its segments, customers, competition,
                regulation, and seasonality.
              </li>
              <li>
                <strong className="text-text">Item 1A — Risk Factors:</strong>{" "}
                forward-looking risks the company is required to disclose.
                Often the densest, most-read section.
              </li>
              <li>
                <strong className="text-text">Item 7 — MD&A:</strong>{" "}
                Management&apos;s Discussion and Analysis. The narrative
                that connects the financial statements to operating reality.
              </li>
              <li>
                <strong className="text-text">Item 8 — Financial Statements:</strong>{" "}
                income statement, balance sheet, cash-flow statement, and
                statement of stockholders&apos; equity — all audited.
              </li>
              <li>
                <strong className="text-text">Item 9A — Controls:</strong>{" "}
                management&apos;s report on internal controls over financial
                reporting, plus the auditor&apos;s attestation (for
                accelerated filers).
              </li>
              <li>
                Plus: properties, legal proceedings, market for equity,
                directors and executive officers, executive compensation,
                principal accountant fees, and exhibits.
              </li>
            </ul>
          ),
        },
        {
          heading: "10-K vs. annual report vs. proxy",
          body: (
            <>
              <p>
                These three disclosures get conflated regularly. The
                distinctions matter:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">10-K:</strong> SEC-filed,
                  audited, comprehensive. The legal disclosure.
                </li>
                <li>
                  <strong className="text-text">Annual Report to Shareholders:</strong>{" "}
                  provided to shareholders and designed for a broader audience.
                  Many companies include or wrap Form 10-K inside it.
                </li>
                <li>
                  <strong className="text-text">Proxy (DEF 14A):</strong>{" "}
                  filed before the annual shareholders&apos; meeting.
                  Covers director elections, executive compensation,
                  shareholder proposals.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "10-K/A — amendments",
          body: (
            <p>
              When a company restates prior financials or corrects a 10-K
              already filed, it files a 10-K/A. SecFilingDex tracks{" "}
              <a href="/form/10-k-a" className="text-brand hover:underline">
                {amendCount} 10-K/A amendments
              </a>{" "}
              alongside originals so the historical disclosure record is
              complete. An amendment doesn&apos;t replace the original —
              both filings remain on the public record.
            </p>
          ),
        },
      ]}
      ourView="The 10-K is the most underused document on EDGAR. Most market commentary cites the press release; the actual disclosure language — particularly Item 1A risk factors and Item 7 MD&A — is where companies are required to be precise. Comparing the two most recent filings makes changes in risk and management language easier to see."
      liveDataLink={{
        label: "Browse live 10-K filings",
        href: "/form/10-k",
        count: liveCount,
      }}
      related={[
        { slug: "10-q", title: "What is a 10-Q filing?" },
        { slug: "8-k", title: "What is an 8-K filing?" },
        { slug: "s-1", title: "What is an S-1 filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/learn/buybacks-vs-dividends",
          label: "HoldLens: Buybacks vs Dividends — applied analysis",
          description:
            "10-K annual reports authorize buybacks. HoldLens reads them across 30 tracked superinvestors to map capital-return policy shifts.",
        },
        {
          href: "https://holdlens.com/learn/how-to-read-buyback-disclosures",
          label: "HoldLens: How to read buyback disclosures",
          description:
            "Walkthrough of Item 8.01 + Part II buyback authorizations as they appear in real filings.",
        },
      ]}
      definedTerms={[
        {
          term: "10-K",
          description:
            "Annual report on Form 10-K filed with the SEC by U.S. public companies under Section 13 or 15(d) of the Securities Exchange Act of 1934. Includes audited financial statements, business overview, risk factors, and Management's Discussion and Analysis.",
        },
        {
          term: "10-K/A",
          description:
            "An amendment to a previously filed 10-K. Used to restate prior financials, correct errors, or add information that was deficient in the original filing.",
        },
        {
          term: "MD&A",
          description:
            "Management's Discussion and Analysis of Financial Condition and Results of Operations. Item 7 of the 10-K. The narrative explanation management is required to provide for the financial results.",
        },
        {
          term: "Risk Factors",
          description:
            "Item 1A of the 10-K. Forward-looking risks the company is required to disclose, written in plain English under SEC plain-English rules.",
        },
      ]}
      faqs={[
        {
          q: "Is a 10-K audited?",
          a: "Yes. A 10-K is the audited annual report — the single most comprehensive disclosure a U.S. public company produces in a given year, and it includes audited financial statements.",
        },
        {
          q: "How often is a 10-K filed?",
          a: "Once per fiscal year. It is the annual filing; the quarters in between are covered by three 10-Q reports.",
        },
        {
          q: "What's the difference between a 10-K and a company's annual report?",
          a: "The 10-K is the SEC-mandated, audited, comprehensive filing. The annual report sent to shareholders is designed for a broader audience and may include or reproduce Form 10-K; the proxy statement (DEF 14A) separately covers governance and executive pay.",
        },
        {
          q: "Where are a company's risk factors in a 10-K?",
          a: "In Item 1A. It sets out the forward-looking risks the company is required to disclose, written in plain English under SEC plain-English rules. Management's narrative on results sits separately in Item 7 (MD&A).",
        },
        {
          q: "What is a 10-K/A?",
          a: "An amendment to a previously filed 10-K, used to restate prior financials, correct errors, or add deficient information. The amendment does not replace the original — both filings remain on the public record.",
        },
      ]}
    />
  );
}
