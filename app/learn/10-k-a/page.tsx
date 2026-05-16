import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a 10-K/A filing?",
  description:
    "A 10-K/A is an amendment to a previously-filed 10-K annual report. Companies file it to correct material errors, add omitted disclosures, or respond to SEC staff comments. Plain-English explainer with live filings.",
  alternates: { canonical: `${SITE_URL}/learn/10-k-a/` },
};

export default function Learn10KAPage() {
  const liveCount = loadFilingsByFormType("10-K/A").length;
  const baseCount = loadFilingsByFormType("10-K").length;

  return (
    <LearnArticle
      slug="10-k-a"
      title="What is a 10-K/A filing?"
      tldr="A 10-K/A is an amendment to a previously-filed 10-K. Companies file it to correct material errors, add omitted information, or restate prior financial statements. Frequency and severity of 10-K/A activity is a quiet quality signal — most healthy issuers file zero in a decade."
      sections={[
        {
          heading: "A 10-K/A amends a 10-K already on file",
          body: (
            <>
              <p>
                The {`"/A"`} suffix on any SEC form means amendment.
                A 10-K/A is filed AFTER the original 10-K when something in
                that filing turns out to be wrong, incomplete, or in need of
                revision. The amendment carries the same filer, the same
                fiscal-year period, and the same EDGAR accession structure
                — but a new accession number and a new filing date.
              </p>
              <p>
                Amendments are not optional once the issuer or its auditor
                identifies a material error. Item 4.02 of Form 8-K is the
                disclosure event that flags non-reliance on previously-issued
                financials; the 10-K/A is the follow-on filing that
                substantively corrects the record.
              </p>
            </>
          ),
        },
        {
          heading: "Why a 10-K/A gets filed",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Financial restatement.</strong>{" "}
                Revenue recognition error, expense misclassification, or
                accounting policy change requires restated historical
                financials in the original 10-K period.
              </li>
              <li>
                <strong className="text-text">Part III incorporation by reference.</strong>{" "}
                Smaller filers commonly file Part III (executive compensation,
                governance, certain ownership tables) as a 10-K/A within
                120 days of fiscal year-end when the proxy statement is not
                ready in time for the original 10-K deadline. This is a
                routine, non-substantive amendment.
              </li>
              <li>
                <strong className="text-text">SEC staff comment letter.</strong>{" "}
                The Division of Corporation Finance reviews filings and
                issues comment letters. Responses that require disclosure
                changes get filed as a 10-K/A.
              </li>
              <li>
                <strong className="text-text">Auditor change with prior-period restatement.</strong>{" "}
                A new auditor identifies issues in legacy periods; restated
                statements land in a 10-K/A.
              </li>
              <li>
                <strong className="text-text">Material exhibit or signature omission.</strong>{" "}
                A required certification, agreement, or other exhibit was
                missing from the original; the 10-K/A re-files the document
                with the missing piece.
              </li>
            </ul>
          ),
        },
        {
          heading: "Restatement 10-K/A vs. routine Part III 10-K/A",
          body: (
            <>
              <p>
                The two largest classes of 10-K/A are extremely different in
                signal value:
              </p>
              <div className="overflow-x-auto -mx-2 px-2 my-3">
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-3 font-medium">Type</th>
                      <th className="text-left py-2 pr-3 font-medium">Trigger</th>
                      <th className="text-left py-2 font-medium">Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-3 align-top">Restatement</td>
                      <td className="py-2 pr-3 align-top">8-K Item 4.02 non-reliance event</td>
                      <td className="py-2 align-top">
                        Significant — accounting, control, or auditor failure
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-3 align-top">Part III</td>
                      <td className="py-2 pr-3 align-top">Proxy timing — within 120 days of FYE</td>
                      <td className="py-2 align-top">
                        Routine — no error implied
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-3 align-top">Staff comment response</td>
                      <td className="py-2 pr-3 align-top">SEC review of original 10-K</td>
                      <td className="py-2 align-top">
                        Mixed — disclosure-quality issue, rarely accounting
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 align-top">Exhibit re-file</td>
                      <td className="py-2 pr-3 align-top">Missing certification or agreement</td>
                      <td className="py-2 align-top">
                        Process error, not accounting
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                When researching a 10-K/A always open the cover page first.
                The explanatory note in Item 9B or the Explanatory Note
                section at the top tells you which class of amendment it is.
              </p>
            </>
          ),
        },
        {
          heading: "How a 10-K/A is filed",
          body: (
            <>
              <p>
                The 10-K/A is a complete-filing amendment — it re-files the
                full document with the amended sections marked. EDGAR
                preserves the original 10-K alongside the amendment; both
                are publicly accessible. The amendment&apos;s cover page
                explicitly identifies which items are being amended and
                which sections of the original 10-K remain unchanged.
              </p>
              <p>
                Filers are required to include an explanatory note describing
                what is being amended and why. The CEO and CFO certifications
                (Sarbanes-Oxley §302 and §906) are re-executed and re-filed
                with the amendment. The auditor consents to the use of any
                restated financial statements via a new exhibit.
              </p>
            </>
          ),
        },
        {
          heading: "What 10-K/A frequency tells you about an issuer",
          body: (
            <>
              <p>
                The base rate matters: among ~3,500 U.S. domestic SEC
                registrants, roughly 4-7% file at least one 10-K/A in any
                given year, and the great majority of those are routine
                Part III amendments. Restatement-class amendments are far
                rarer — typically 50-150 substantive restatements per year
                across the entire U.S. filer universe, per Audit Analytics
                long-run data.
              </p>
              <p>
                A single restatement 10-K/A is not automatically a red flag —
                some are immaterial in dollar terms even when the
                non-reliance trigger fires. But repeated restatement
                amendments across multiple fiscal years signal recurring
                internal-controls weakness and almost always precede broader
                governance issues, auditor resignations, or restatement-driven
                stock-price re-pricing.
              </p>
              <p>
                Conversely, healthy issuers with strong internal control
                often file Part III 10-K/A annually for years without ever
                filing a restatement amendment. The form is the same; the
                signal is the explanatory note.
              </p>
            </>
          ),
        },
        {
          heading: "Reading a 10-K/A in three minutes",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                Open the cover page. Note which items are listed as amended.
              </li>
              <li>
                Read the Explanatory Note. This single section explains
                everything — class of amendment, financial impact, period
                affected.
              </li>
              <li>
                If accounting: pull the restated income statement and balance
                sheet. Compare to the originally-filed numbers from the
                superseded 10-K (still on EDGAR). The delta tells the story.
              </li>
              <li>
                Cross-reference the 8-K Item 4.02 filing that preceded the
                10-K/A. The non-reliance disclosure often contains earlier
                management commentary on root cause.
              </li>
              <li>
                Check whether the auditor changed. A new audit firm consent
                exhibit on the 10-K/A signals an auditor transition during
                the restatement process — itself a meaningful event.
              </li>
            </ul>
          ),
        },
        {
          heading: "10-K/A vs. 10-Q/A vs. 8-K/A",
          body: (
            <p>
              The /A suffix works the same way across all SEC forms. A 10-Q/A
              amends a previously-filed quarterly report — same mechanics,
              quarterly scope. An 8-K/A amends a previously-filed current
              report, most commonly used to add the audited financial
              statements of a recently-acquired business that were not yet
              available when the original 8-K was filed (Item 9.01(a)(4)
              has a 71-day grace period for those financials). Understanding
              the /A convention applies broadly across the EDGAR corpus.
            </p>
          ),
        },
        {
          heading: "How to find 10-K/A filings on SecFilingDex",
          body: (
            <p>
              SecFilingDex&apos;s 10-K/A index is at{" "}
              <a href="/form/10-k-a" className="text-brand hover:underline">
                /form/10-k-a
              </a>{" "}
              — sorted by recency. Compare against the {baseCount} live 10-K
              filings at <a href="/form/10-k" className="text-brand hover:underline">/form/10-k</a>{" "}
              to see which issuers have amended recent annual reports.
            </p>
          ),
        },
      ]}
      ourView="The 10-K/A is one of the most useful forms in EDGAR for the same reason most people ignore it — the routine Part III amendments crowd out the small number of substantive restatements. Filtering for issuers with multiple restatement-class 10-K/As across recent fiscal years surfaces accounting-quality outliers years before they reach the broader market. The form itself is boring; the metadata is the alpha."
      liveDataLink={{
        label: "Browse live 10-K/A filings",
        href: "/form/10-k-a",
        count: liveCount,
      }}
      related={[
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "10-q", title: "What is a 10-Q filing?" },
        { slug: "8-k", title: "What is an 8-K filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/learn/superinvestor-handbook",
          label: "HoldLens: Superinvestor handbook",
          description:
            "Annual report amendments tell you when something was wrong the first time — useful pattern when tracking long-horizon investors.",
        },
      ]}
      definedTerms={[
        {
          term: "10-K/A",
          description:
            "Amendment to a previously-filed Form 10-K. The /A suffix indicates amendment. Filed to correct material errors, add omitted disclosures, or substantively revise the original annual report.",
        },
        {
          term: "Restatement",
          description:
            "Revision of previously-issued financial statements after the issuer determines (or its auditor identifies) a material error. A restatement 10-K/A is the corrected filing; the 8-K Item 4.02 non-reliance disclosure is the precursor.",
        },
        {
          term: "Explanatory Note",
          description:
            "Section at the front of a 10-K/A describing what is being amended and why. The single most important page of any amendment for assessing signal value.",
        },
        {
          term: "Part III incorporation by reference",
          description:
            "Practice of filing the 10-K's executive compensation, governance, and ownership sections via reference to the upcoming proxy statement. If the proxy is not ready within 120 days of fiscal year-end, the issuer files Part III as a 10-K/A. Routine and not error-driven.",
        },
        {
          term: "Item 4.02 (8-K)",
          description:
            "8-K disclosure item triggered when the issuer's board or audit committee concludes that previously-issued financial statements should no longer be relied upon. Almost always precedes a restatement 10-K/A.",
        },
      ]}
    />
  );
}
