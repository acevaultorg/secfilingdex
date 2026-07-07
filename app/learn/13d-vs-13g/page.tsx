import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "13D vs. 13G: what's the difference?",
  description:
    "Schedule 13D and Schedule 13G both disclose ≥5% beneficial ownership in a public company. The choice between them signals intent: 13D is for activists; 13G is the short-form for passive holders. Live filings.",
  alternates: { canonical: `${SITE_URL}/learn/13d-vs-13g/` },
};

export default function Learn13DVs13GPage() {
  const sc13d = loadFilingsByFormType("SC 13D").length;
  const sc13g = loadFilingsByFormType("SC 13G").length;
  const sc13dA = loadFilingsByFormType("SC 13D/A").length;
  const sc13gA = loadFilingsByFormType("SC 13G/A").length;

  return (
    <LearnArticle
      slug="13d-vs-13g"
      title="13D vs. 13G: what's the difference?"
      tldr="Schedule 13D and Schedule 13G are two SEC filings disclosing ≥5% beneficial ownership of a public company's voting equity. The choice between them signals intent: 13D is for activists and any holder with intent to influence control; 13G is the short-form for passive holders."
      sections={[
        {
          heading: "Both disclose ≥5% beneficial ownership — the threshold is the same",
          body: (
            <p>
              Section 13(d) of the Securities Exchange Act of 1934
              requires any person or group acquiring beneficial ownership
              of more than 5% of a class of registered voting equity to
              disclose the position. The disclosure can be made on either
              Schedule 13D or Schedule 13G, depending on who is filing
              and why.
            </p>
          ),
        },
        {
          heading: "When to use 13D — the long-form",
          body: (
            <>
              <p>
                Schedule 13D is the default — filed by anyone who
                doesn&apos;t qualify for short-form 13G treatment. In
                practice this means activists, control-seeking investors,
                and any holder whose intent is anything other than
                passive investment.
              </p>
              <p>
                <strong className="text-text">Filing window:</strong>{" "}
                within 5 business days of crossing 5%. (Tightened from 10
                calendar days by SEC amendments effective February 2024.)
              </p>
              <p>
                <strong className="text-text">Items disclosed:</strong>{" "}
                identity, source of funds, purpose of transaction, plans
                or proposals (Item 4 — the most-read section), beneficial
                ownership detail, contracts/arrangements, exhibits.
              </p>
              <p>
                <strong className="text-text">Amendment trigger:</strong>{" "}
                any &ldquo;material change&rdquo; to the disclosure —
                including changes in ownership of 1% or more.
              </p>
              <p>
                SecFilingDex tracks{" "}
                <a href="/form/sc-13d" className="text-brand hover:underline">
                  {sc13d} SC 13D filings
                </a>{" "}
                and{" "}
                <a href="/form/sc-13d-a" className="text-brand hover:underline">
                  {sc13dA} SC 13D/A amendments
                </a>
                .
              </p>
            </>
          ),
        },
        {
          heading: "When to use 13G — the short-form",
          body: (
            <>
              <p>
                Schedule 13G is available to three categories of filer
                under SEC Rule 13d-1:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">Qualified Institutional
                  Investors (Rule 13d-1(b)):</strong> registered
                  broker-dealers, banks, investment advisers, registered
                  investment companies. Must hold passively, in the
                  ordinary course of business, and not with the purpose
                  of influencing control.
                </li>
                <li>
                  <strong className="text-text">Passive Investors (Rule
                  13d-1(c)):</strong> any holder under 20% who certifies
                  passive intent.
                </li>
                <li>
                  <strong className="text-text">Exempt Investors (Rule
                  13d-1(d)):</strong> holders who would qualify for
                  passive status but for limited grandfathered ownership.
                </li>
              </ul>
              <p>
                <strong className="text-text">Filing window (post-Feb 2024):</strong>{" "}
                45 days after the calendar quarter-end for institutional
                filers; 5 business days for non-institutional passive
                investors.
              </p>
              <p>
                <strong className="text-text">Amendment cadence:</strong>{" "}
                quarterly (institutional) or 5-business-day (passive),
                with materiality thresholds for early amendment.
              </p>
              <p>
                SecFilingDex tracks{" "}
                <a href="/form/sc-13g" className="text-brand hover:underline">
                  {sc13g} SC 13G filings
                </a>{" "}
                and{" "}
                <a href="/form/sc-13g-a" className="text-brand hover:underline">
                  {sc13gA} SC 13G/A amendments
                </a>
                .
              </p>
            </>
          ),
        },
        {
          heading: "The intent signal — why the choice matters",
          body: (
            <>
              <p>
                A holder transitioning from 13G to 13D is making a
                public, legally meaningful statement: &ldquo;I am no
                longer passive.&rdquo; Such transitions almost always
                precede activist campaigns, board pushes, M&A proposals,
                or other control-seeking activity.
              </p>
              <p>
                The reverse — 13D filer transitioning to 13G after exit
                or de-escalation — also happens, but matters less to
                the market because the activist period is already in
                the price.
              </p>
            </>
          ),
        },
        {
          heading: "Comparison table",
          body: (
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm border border-border rounded-card">
                <thead>
                  <tr className="border-b border-border bg-panel">
                    <th className="text-left px-3 py-2 text-text">Dimension</th>
                    <th className="text-left px-3 py-2 text-text">Schedule 13D</th>
                    <th className="text-left px-3 py-2 text-text">Schedule 13G</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 text-muted">Threshold</td>
                    <td className="px-3 py-2">≥5%</td>
                    <td className="px-3 py-2">≥5%</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 text-muted">Filer intent</td>
                    <td className="px-3 py-2">Active / control-seeking</td>
                    <td className="px-3 py-2">Passive</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 text-muted">Initial deadline</td>
                    <td className="px-3 py-2">5 business days</td>
                    <td className="px-3 py-2">45 days from quarter-end (inst.) / 5 BD (passive)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 text-muted">Amendment trigger</td>
                    <td className="px-3 py-2">Any material change</td>
                    <td className="px-3 py-2">Quarterly + threshold</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-muted">Item 4 plans?</td>
                    <td className="px-3 py-2">Required, detailed</td>
                    <td className="px-3 py-2">Not applicable</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ),
        },
      ]}
      faqs={[
        {
          q: "What ownership level triggers a 13D or a 13G?",
          a: "Both are triggered at the same threshold: beneficial ownership of more than 5% of a class of registered voting equity, under Section 13(d) of the Securities Exchange Act of 1934. The choice between the two schedules is about who is filing and why, not about the ownership level.",
        },
        {
          q: "Is a 13D or a 13G filed faster?",
          a: "A 13D is due within 5 business days of crossing 5% (tightened from 10 calendar days by SEC amendments effective February 2024). A 13G's deadline depends on the filer: institutional filers have until 45 days after the calendar quarter-end, while non-institutional passive investors also file within 5 business days.",
        },
        {
          q: "Who is allowed to use the short-form 13G?",
          a: "Three categories under SEC Rule 13d-1: qualified institutional investors such as broker-dealers, banks, and investment advisers holding passively (13d-1(b)); passive investors under 20% who certify passive intent (13d-1(c)); and exempt investors with limited grandfathered ownership (13d-1(d)).",
        },
        {
          q: "Why would an investor switch from a 13G to a 13D?",
          a: "Because 13G is available only to passive holders, switching to a 13D is a public, legally meaningful statement that the holder is no longer passive. Such transitions almost always precede activist campaigns, board pushes, M&A proposals, or other control-seeking activity.",
        },
        {
          q: "What is Item 4 on a Schedule 13D?",
          a: "Item 4 is the Purpose of Transaction section — where the filer must disclose plans or proposals relating to changes in management, the board, capital structure, or other extraordinary transactions. It is the most-read section of a 13D and has no equivalent on the passive 13G.",
        },
      ]}
      ourView="The 13D-to-13G (or vice-versa) transition is one of the most reliable qualitative signals on EDGAR. Long-only managers who hold for years on a 13G and then switch to a 13D are telling you, on the record, that something changed in their thesis. Reading the Item 4 of the new 13D against the prior holdings rarely takes more than 20 minutes and almost always rewards the time."
      related={[
        { slug: "13f", title: "What is a 13F filing?" },
        { slug: "form-4", title: "What is a Form 4 filing?" },
        { slug: "8-k", title: "What is an 8-K filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/learn/13d-vs-13g-activist-filings",
          label: "HoldLens: 13D vs 13G — the activist angle",
          description:
            "Same forms, narrower lens — when the 13D-to-13G transition (or vice versa) is actually a meaningful smart-money signal, and when it's just admin.",
        },
        {
          href: "https://holdlens.com/learn/13f-vs-13d-vs-13g",
          label: "HoldLens: 13F vs 13D vs 13G",
          description:
            "How the three filings differ in timing, threshold, and what they actually tell you — read side-by-side, not in isolation.",
        },
        {
          href: "https://holdlens.com/activist/",
          label: "HoldLens: Live activist tracker",
          description:
            "Real-time 13D filings from tracked managers — the closest thing to live smart-money disclosure in U.S. markets.",
        },
      ]}
      definedTerms={[
        {
          term: "Schedule 13D",
          description:
            "SEC long-form ownership disclosure under Section 13(d) of the Exchange Act, filed by any person beneficially owning more than 5% of a class of registered voting equity who is not eligible for short-form 13G treatment.",
        },
        {
          term: "Schedule 13G",
          description:
            "SEC short-form ownership disclosure for passive 5%+ beneficial owners — qualified institutional investors, passive investors, and exempt investors as defined under Rule 13d-1.",
        },
        {
          term: "Beneficial ownership",
          description:
            "The right to vote or direct the vote, or to dispose or direct the disposition, of a security. SEC Rule 13d-3 defines beneficial ownership broadly to include certain options and rights to acquire.",
        },
        {
          term: "Item 4",
          description:
            "Schedule 13D Item 4 — Purpose of Transaction. Where the filer must disclose plans or proposals relating to changes in management, board, capital structure, or other extraordinary transactions.",
        },
      ]}
    />
  );
}
