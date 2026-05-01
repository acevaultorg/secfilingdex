import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a 10-Q filing?",
  description:
    "A 10-Q is the unaudited quarterly report U.S. public companies file three times per year. Plain-English explainer of structure, deadlines, and how it differs from the 10-K, with live filings.",
  alternates: { canonical: `${SITE_URL}/learn/10-q/` },
};

export default function Learn10QPage() {
  const liveCount = loadFilingsByFormType("10-Q").length;
  const amendCount = loadFilingsByFormType("10-Q/A").length;

  return (
    <LearnArticle
      slug="10-q"
      title="What is a 10-Q filing?"
      tldr="A 10-Q is the unaudited quarterly report U.S. public companies file three times a year — covering the three quarters that don't end the fiscal year — under Section 13 of the Exchange Act."
      sections={[
        {
          heading: "A 10-Q is the quarterly disclosure between annual reports",
          body: (
            <>
              <p>
                Public companies file three 10-Qs per fiscal year, one for
                each of the first three fiscal quarters. The fourth quarter
                is folded into the 10-K — there is no separate Q4 10-Q.
              </p>
              <p>
                Filing deadlines: 40 days after quarter-end for large
                accelerated and accelerated filers; 45 days for
                non-accelerated filers. Compared to the 10-K, the
                financials are unaudited but reviewed by the auditor.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside a 10-Q",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Part I — Financial Information:</strong>{" "}
                condensed financial statements (balance sheet, income
                statement, cash flow), MD&A, market risk disclosures, and
                disclosure controls.
              </li>
              <li>
                <strong className="text-text">Part II — Other Information:</strong>{" "}
                legal proceedings, risk-factor updates (only material
                changes from the 10-K), unregistered share sales, and
                exhibits.
              </li>
            </ul>
          ),
        },
        {
          heading: "10-Q vs. 10-K — the practical differences",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Frequency:</strong> 10-Q is
                quarterly (3× per year); 10-K is annual.
              </li>
              <li>
                <strong className="text-text">Audit status:</strong> 10-Q
                financials are unaudited (auditor-reviewed); 10-K
                financials are audited.
              </li>
              <li>
                <strong className="text-text">Scope:</strong> 10-Q is
                condensed and update-focused; 10-K is full-scope and
                comprehensive.
              </li>
              <li>
                <strong className="text-text">Deadline:</strong> 40-45
                days after quarter-end for 10-Q; 60-90 days after
                year-end for 10-K.
              </li>
              <li>
                <strong className="text-text">Risk factors:</strong> 10-K
                lists all material risks; 10-Q only updates material
                changes from the 10-K.
              </li>
            </ul>
          ),
        },
        {
          heading: "10-Q/A — amendments",
          body: (
            <p>
              SecFilingDex tracks{" "}
              <a href="/form/10-q-a" className="text-brand hover:underline">
                {amendCount} 10-Q/A amendments
              </a>{" "}
              alongside originals. Common reasons for amendment: restated
              financials, corrected exhibits, or new disclosures that
              were material at filing date but not included.
            </p>
          ),
        },
      ]}
      ourView="The 10-Q is where management language drift first becomes visible — the section that changes most quarter-over-quarter is usually the section the market should be paying attention to. Diff the MD&A across consecutive 10-Qs and the story tells itself."
      liveDataLink={{
        label: "Browse live 10-Q filings",
        href: "/form/10-q",
        count: liveCount,
      }}
      related={[
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "8-k", title: "What is an 8-K filing?" },
      ]}
      definedTerms={[
        {
          term: "10-Q",
          description:
            "Quarterly report on Form 10-Q filed with the SEC under Section 13 of the Securities Exchange Act of 1934. Filed three times per year (Q1, Q2, Q3); the fourth quarter is folded into the annual 10-K. Financials are unaudited but auditor-reviewed.",
        },
        {
          term: "10-Q/A",
          description:
            "An amendment to a previously filed 10-Q. Used to restate, correct, or add disclosure to a quarterly report.",
        },
        {
          term: "Auditor review",
          description:
            "A limited engagement, less rigorous than a full audit. Required for 10-Q financials. Provides negative assurance: the auditor states they are not aware of material modifications needed.",
        },
      ]}
    />
  );
}
