import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is an NT 10-K filing?",
  description:
    "NT 10-K is the SEC notification of inability to file a 10-K annual report on time. Filed under Rule 12b-25 of the Exchange Act, it grants a 15-day extension. Plain-English explainer with material risk signals.",
  alternates: { canonical: `${SITE_URL}/learn/nt-10-k/` },
};

export default function LearnNT10KPage() {
  const liveCount = loadFilingsByFormType("NT 10-K").length + loadFilingsByFormType("NT 10-K/A").length;

  return (
    <LearnArticle
      slug="nt-10-k"
      title="What is an NT 10-K filing?"
      tldr="NT 10-K is the SEC notification of inability to timely file an annual report on Form 10-K. Filed under Rule 12b-25, it grants the registrant a 15-calendar-day extension. The filing requires the registrant to disclose why the 10-K is late — and that disclosure is often more material than the eventual 10-K itself."
      sections={[
        {
          heading: "Who files an NT 10-K, and when",
          body: (
            <>
              <p>
                Rule 12b-25 of the Securities Exchange Act of 1934
                requires any registrant unable to file a periodic report
                (10-K, 10-Q, 20-F, 11-K, N-CSR, etc.) by its due date
                to file a Notification of Late Filing on Form 12b-25.
                The form has a different name in EDGAR depending on
                which periodic report is being delayed — &quot;NT 10-K&quot;
                for 10-K delays, &quot;NT 10-Q&quot; for 10-Q delays.
              </p>
              <p>
                NT 10-K must be filed no later than one business day
                after the original 10-K due date. Filing a timely NT 10-K
                automatically grants a 15-calendar-day extension —
                pushing the filer&apos;s actual deadline by 15 days
                without further SEC action.
              </p>
            </>
          ),
        },
        {
          heading: "What an NT 10-K must disclose",
          body: (
            <>
              <p>
                Part III of Form 12b-25 requires a narrative explanation
                of why the filing could not be made on time. The SEC
                does not accept boilerplate. Common acceptable categories:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">Accounting review delays</strong>{" "}
                  — restatement-adjacent issues, revenue-recognition
                  reconsiderations, going-concern evaluations.
                </li>
                <li>
                  <strong className="text-text">Auditor changes</strong>{" "}
                  — new auditor engaged late; predecessor cooperating with
                  data turnover.
                </li>
                <li>
                  <strong className="text-text">Material acquisition or divestiture</strong>{" "}
                  — pro-forma financials for acquired/divested operations
                  unavailable by the original deadline.
                </li>
                <li>
                  <strong className="text-text">Cybersecurity incident</strong>{" "}
                  — disclosed under Item 1.05 of Form 8-K; recovery
                  delays carry into year-end close.
                </li>
                <li>
                  <strong className="text-text">Litigation, investigation, or subpoena</strong>{" "}
                  — outside counsel review of disclosure language
                  pending; cannot finalize until resolved.
                </li>
              </ul>
              <p className="mt-3">
                Part IV requires the registrant to estimate, where
                possible, the significant changes in results of operations
                from the corresponding prior period — a forward-look
                disclosure that the eventual 10-K will confirm or revise.
              </p>
            </>
          ),
        },
        {
          heading: "Why NT 10-Ks are material market signals",
          body: (
            <>
              <p>
                An NT 10-K filing is often the first public signal of a
                problem the issuer has been working through privately.
                Academic research and practitioner audits consistently
                find that NT 10-K filers experience: negative abnormal
                returns in the 5-10 day window following the NT filing,
                elevated short interest, and a meaningfully higher
                probability of subsequent restatement or going-concern
                qualification on the eventually-filed 10-K.
              </p>
              <p>
                Not every NT 10-K signals trouble — some reflect benign
                logistical delays. But the Part III narrative usually
                tells you which kind you&apos;re reading. &quot;Internal
                control review&quot;, &quot;auditor consultation on
                accounting treatment&quot;, and &quot;ongoing SEC
                inquiry&quot; are the high-alert phrases.
              </p>
            </>
          ),
        },
      ]}
      ourView="The NT 10-K is one of the most underwatched filings in the SEC catalog. Most retail investors never see them; they don't fire any common screener. But when an issuer files an NT 10-K — especially with a Part III narrative citing accounting review or auditor consultation — the eventual 10-K is materially more likely to contain bad news than a comparable on-time filing. Reading the Part III narrative is a 5-minute pre-mortem on a stock that's about to surprise the market."
      liveDataLink={liveCount > 0 ? {
        label: "Browse live NT 10-K filings",
        href: "/form/nt-10-k",
        count: liveCount,
      } : undefined}
      related={[
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "10-k-a", title: "What is a 10-K/A filing?" },
        { slug: "8-k", title: "What is an 8-K filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/learn/event-score-explained",
          label: "HoldLens: Event Score — quantifying material events",
          description:
            "NT 10-K filings register on HoldLens's Event Score with elevated weighting — late annual reports are among the highest-signal events in the SEC corpus for tracked-superinvestor portfolios.",
        },
      ]}
      definedTerms={[
        {
          term: "NT 10-K",
          description:
            "Notification of inability to timely file an annual report on Form 10-K, filed under Rule 12b-25 of the Securities Exchange Act of 1934. Grants a 15-calendar-day extension when filed within one business day of the original due date.",
        },
        {
          term: "Rule 12b-25",
          description:
            "The SEC rule under Section 12 of the Exchange Act governing late-filing notifications for periodic reports. Implemented via Form 12b-25, which EDGAR indexes under the prefix 'NT' followed by the delayed report's form type.",
        },
        {
          term: "Form 12b-25",
          description:
            "The actual SEC form filed when an issuer cannot meet a periodic-report deadline. Appears in EDGAR as NT 10-K, NT 10-Q, NT 20-F, NT 11-K, or NT N-CSR depending on which periodic report is delayed.",
        },
        {
          term: "Restatement",
          description:
            "A revision of previously-issued financial statements to correct errors discovered after issuance. Restatements often follow NT 10-Ks where Part III cited 'review of accounting matters' as the cause of the delay.",
        },
        {
          term: "Going Concern",
          description:
            "An auditor's qualification expressing substantial doubt about the issuer's ability to continue operating for the next 12 months. NT 10-K filings citing 'going-concern evaluation' as the delay reason precede formal going-concern opinions ~40% of the time per public-market academic studies.",
        },
      ]}
    />
  );
}
