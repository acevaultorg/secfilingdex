import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a 10-Q/A filing?",
  description:
    "10-Q/A is the amendment to a previously filed Form 10-Q quarterly report. Used to restate quarterly financials, correct errors, or add disclosure under Items 5 or 6. Plain-English explainer.",
  alternates: { canonical: `${SITE_URL}/learn/10-q-a/` },
};

export default function Learn10QAPage() {
  const liveCount = loadFilingsByFormType("10-Q/A").length;

  return (
    <LearnArticle
      slug="10-q-a"
      title="What is a 10-Q/A filing?"
      tldr="10-Q/A is an amendment to a previously-filed Form 10-Q quarterly report. Used to restate quarterly financials, correct errors, add omitted disclosure, or respond to SEC staff comments. The Explanatory Note at the front of every 10-Q/A tells you which category and why the amendment was necessary."
      sections={[
        {
          heading: "Who files a 10-Q/A, and when",
          body: (
            <>
              <p>
                Any registrant that has previously filed a Form 10-Q can
                file a 10-Q/A to amend that prior filing. There is no
                statutory deadline — amendments may be filed at any
                time. In practice, 10-Q/A filings cluster in three
                windows: (a) days-to-weeks after the original 10-Q if
                a material error is caught immediately; (b) months
                later as part of an annual-audit reconciliation that
                surfaces quarterly mis-statements; (c) years later as
                part of a full restatement (often coordinated across
                multiple quarters and the related 10-K).
              </p>
              <p>
                Note that 10-Q/A is distinct from a Non-Reliance 8-K
                (Item 4.02) — the 8-K announces that prior financials
                cannot be relied on; the 10-Q/A is the substantive
                restatement document. The two filings often appear
                within days of each other; the 8-K precedes the 10-Q/A
                as the formal investor-facing notice.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside a 10-Q/A — the Explanatory Note",
          body: (
            <>
              <p>
                The Explanatory Note at the front of a 10-Q/A is the
                most important section. It states:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">What the amendment changes</strong>{" "}
                  — specific line items being restated, specific Items
                  being amended (Part I Item 1 Financial Statements,
                  Part I Item 2 MD&amp;A, Part II Item 4 Controls,
                  etc.).
                </li>
                <li>
                  <strong className="text-text">Why the amendment was necessary</strong>{" "}
                  — restatement of revenue recognition, correction of
                  cut-off error, deferred-tax mis-application,
                  classification change, etc.
                </li>
                <li>
                  <strong className="text-text">Whether prior financials should not be relied on</strong>{" "}
                  — explicit cross-reference to any Item 4.02 8-K filed
                  in connection with the amendment.
                </li>
                <li>
                  <strong className="text-text">Internal-control conclusions</strong>{" "}
                  — whether the restatement reflects a material
                  weakness in internal control over financial
                  reporting (ICFR). If yes, the Item 4 conclusion in
                  the original 10-Q is necessarily revised.
                </li>
              </ul>
              <p className="mt-3">
                The body of the 10-Q/A then carries the restated
                financial statements + revised MD&amp;A discussion +
                whatever other Items required amendment. Unchanged
                Items are typically incorporated by reference rather
                than re-disclosed.
              </p>
            </>
          ),
        },
        {
          heading: "Why 10-Q/A filings are high-signal events",
          body: (
            <>
              <p>
                A 10-Q/A is almost never benign for the share price. The
                Explanatory Note tells you exactly what management is
                conceding was wrong; the restated financials show the
                magnitude. Restatement events typically see negative
                abnormal returns in the 5-10 day window post-filing,
                with magnitude correlated to: (a) percentage change in
                reported income, (b) whether a material weakness in
                ICFR is disclosed, (c) auditor turnover within 12
                months, and (d) whether the SEC has commenced a formal
                inquiry.
              </p>
              <p>
                The Sarbanes-Oxley Section 906 certification on the
                10-Q/A is signed afresh by the CEO and CFO; the
                certification language is the same as on a clean 10-Q,
                but signing it on a restatement document carries
                personal legal exposure that operating executives are
                aware of.
              </p>
            </>
          ),
        },
      ]}
      ourView="A 10-Q/A is one of the highest-signal disclosure events a public company files. Every 10-Q/A has a story; the Explanatory Note usually tells it in plain language. Restatements correlate strongly with subsequent CEO/CFO departures (12-month risk roughly 3x baseline), with going-concern qualifications, and with SEC enforcement. Reading the 10-Q/A Explanatory Note when one shows up in a tracked-superinvestor position is a 5-minute pre-mortem on a stock that has just told the market it had something wrong on its books."
      liveDataLink={liveCount > 0 ? {
        label: "Browse live 10-Q/A filings",
        href: "/form/10-q-a",
        count: liveCount,
      } : undefined}
      related={[
        { slug: "10-q", title: "What is a 10-Q filing?" },
        { slug: "10-k-a", title: "What is a 10-K/A filing?" },
        { slug: "nt-10-k", title: "What is an NT 10-K filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/learn/event-score-explained",
          label: "HoldLens: Event Score — quantifying material events",
          description:
            "10-Q/A restatements register high on HoldLens's Event Score; combined with the Item 4.02 8-K that typically precedes them, the signal is doubly weighted.",
        },
      ]}
      definedTerms={[
        {
          term: "10-Q/A",
          description:
            "Amendment to a previously filed Form 10-Q under the Securities Exchange Act of 1934. Used to restate financial statements, correct errors, or add disclosure. The Explanatory Note at the front identifies what changed and why.",
        },
        {
          term: "Restatement",
          description:
            "A revision of previously-issued financial statements to correct material errors. Distinct from a routine revision: restatements are public concessions that prior financials cannot be relied on, typically triggering a Non-Reliance 8-K (Item 4.02) followed by the substantive 10-Q/A or 10-K/A.",
        },
        {
          term: "Item 4.02 8-K",
          description:
            "8-K Item 4.02 — 'Non-Reliance on Previously Issued Financial Statements or a Related Audit Report or Completed Interim Review.' The formal investor-facing notice that prior financials cannot be relied on. Triggers the requirement to file a substantive amendment (10-Q/A or 10-K/A) restating the affected period.",
        },
        {
          term: "Material Weakness",
          description:
            "A deficiency in internal control over financial reporting (ICFR) such that there is a reasonable possibility that a material misstatement will not be prevented or detected on a timely basis. Disclosed under Item 4 of 10-Q (or Item 9A of 10-K). Material weaknesses frequently accompany 10-Q/A restatements.",
        },
        {
          term: "SOX 302/906 Certifications",
          description:
            "Sarbanes-Oxley Act of 2002 sections requiring the CEO and CFO to personally certify periodic reports. Section 302 covers accuracy and ICFR effectiveness; Section 906 carries criminal-penalty exposure for knowingly false certification. Re-signed afresh on every 10-Q/A.",
        },
      ]}
    />
  );
}
