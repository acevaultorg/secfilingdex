import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is an 8-K filing?",
  description:
    "An 8-K is the SEC current report — used to disclose material events between periodic filings. Filed within four business days. Plain-English explainer of triggers, items, and live filings.",
  alternates: { canonical: `${SITE_URL}/learn/8-k/` },
};

export default function Learn8KPage() {
  const liveCount = loadFilingsByFormType("8-K").length;
  const amendCount = loadFilingsByFormType("8-K/A").length;

  return (
    <LearnArticle
      slug="8-k"
      title="What is an 8-K filing?"
      tldr="An 8-K is the SEC current report — used to disclose material events that arise between periodic filings. Generally due within four business days of the triggering event."
      sections={[
        {
          heading: "An 8-K announces material news, fast",
          body: (
            <>
              <p>
                Where 10-Ks and 10-Qs report on completed periods, the 8-K
                is for unscheduled events the market should know about
                immediately. Examples: earnings releases, mergers and
                acquisitions, bankruptcy, executive transitions, material
                contract changes, regulatory matters, and changes in
                auditor.
              </p>
              <p>
                Companies typically file an 8-K within four business days
                of the triggering event, though some items have shorter
                windows (or are conditional on prior public disclosure).
              </p>
            </>
          ),
        },
        {
          heading: "What triggers an 8-K — the item taxonomy",
          body: (
            <>
              <p>
                The 8-K is organized by &ldquo;Items&rdquo; (item numbers).
                Each Item corresponds to a specific kind of triggering
                event. Selected items most market participants track:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">Item 1.01:</strong> Entry
                  into a Material Definitive Agreement.
                </li>
                <li>
                  <strong className="text-text">Item 1.02:</strong>{" "}
                  Termination of a Material Definitive Agreement.
                </li>
                <li>
                  <strong className="text-text">Item 2.01:</strong>{" "}
                  Completion of Acquisition or Disposition of Assets.
                </li>
                <li>
                  <strong className="text-text">Item 2.02:</strong> Results
                  of Operations and Financial Condition (earnings releases).
                </li>
                <li>
                  <strong className="text-text">Item 4.02:</strong>{" "}
                  Non-Reliance on Previously Issued Financial Statements
                  (restatements).
                </li>
                <li>
                  <strong className="text-text">Item 5.02:</strong> Changes
                  in Directors or Officers; Compensatory Arrangements.
                </li>
                <li>
                  <strong className="text-text">Item 7.01:</strong>{" "}
                  Regulation FD Disclosure (voluntary disclosure to put
                  information on equal footing).
                </li>
                <li>
                  <strong className="text-text">Item 8.01:</strong> Other
                  Events the company deems material.
                </li>
                <li>
                  <strong className="text-text">Item 9.01:</strong>{" "}
                  Financial Statements and Exhibits.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "How to read an 8-K quickly",
          body: (
            <ol className="list-decimal pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Skim the cover page</strong>{" "}
                for the list of Items checked. Each Item is a separate
                trigger.
              </li>
              <li>
                <strong className="text-text">Read the body</strong> for
                each Item — usually two to four paragraphs per Item.
              </li>
              <li>
                <strong className="text-text">Check Exhibit 99.x</strong>{" "}
                for any press release, presentation, or legal document
                attached.
              </li>
              <li>
                <strong className="text-text">Note the filing date vs.
                event date</strong> — gaps suggest internal review took
                time, which is itself signal.
              </li>
            </ol>
          ),
        },
        {
          heading: "8-K/A — amendments",
          body: (
            <p>
              An 8-K/A amends a prior 8-K. Common case: an Item 2.01
              acquisition closure followed within 71 days by an 8-K/A
              providing the financial statements of the acquired business
              (Item 9.01 amendment). SecFilingDex tracks{" "}
              <a href="/form/8-k-a" className="text-brand hover:underline">
                {amendCount} 8-K/A amendments
              </a>
              .
            </p>
          ),
        },
      ]}
      ourView="8-Ks are where the alpha is, and most of it is in the items most observers ignore: 4.02 (restatements), 5.02 (executive turnover), and 1.02 (terminated material agreements). The market under-prices these because they aren't earnings — but they are the disclosures that change forward fundamentals."
      liveDataLink={{
        label: "Browse live 8-K filings",
        href: "/form/8-k",
        count: liveCount,
      }}
      related={[
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "10-q", title: "What is a 10-Q filing?" },
        { slug: "form-4", title: "What is a Form 4 filing?" },
      ]}
      definedTerms={[
        {
          term: "8-K",
          description:
            "Current report on Form 8-K filed with the SEC to disclose material events between periodic filings. Generally due within four business days of the triggering event under Items specified in Form 8-K.",
        },
        {
          term: "8-K/A",
          description:
            "An amendment to a previously filed 8-K. Often used to provide financial statements of an acquired business after the closing 8-K announced the transaction.",
        },
        {
          term: "Item 4.02",
          description:
            "Item 4.02 of Form 8-K — Non-Reliance on Previously Issued Financial Statements. Filed when the company concludes prior financials should no longer be relied upon. A restatement signal.",
        },
        {
          term: "Material event",
          description:
            "An event that a reasonable investor would consider important in deciding whether to buy or sell securities. The threshold for SEC disclosure obligations.",
        },
      ]}
    />
  );
}
