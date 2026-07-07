import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a 13F filing?",
  description:
    "A 13F is the quarterly long-equity holdings report institutional managers with ≥$100M file with the SEC. Covers what's in (long U.S. equities) and what's out (shorts, options, foreign equities). Live filings.",
  alternates: { canonical: `${SITE_URL}/learn/13f/` },
};

export default function Learn13FPage() {
  const liveCount =
    loadFilingsByFormType("13F-HR").length +
    loadFilingsByFormType("13F-NT").length +
    loadFilingsByFormType("13F-HR/A").length;
  const hrCount = loadFilingsByFormType("13F-HR").length;
  const ntCount = loadFilingsByFormType("13F-NT").length;

  return (
    <LearnArticle
      slug="13f"
      title="What is a 13F filing?"
      tldr="A 13F is the quarterly long-equity holdings disclosure institutional investment managers with ≥$100M in qualifying U.S. equity assets must file with the SEC, due within 45 days of quarter-end."
      sections={[
        {
          heading: "Who files a 13F, and when",
          body: (
            <>
              <p>
                Section 13(f) of the Securities Exchange Act of 1934
                requires institutional investment managers exercising
                investment discretion over ≥$100M of Section 13(f)
                securities to report their holdings quarterly. The list of
                qualifying securities is published by the SEC each
                quarter.
              </p>
              <p>
                The 45-day filing deadline is generous on purpose — the
                disclosure is intended to inform regulators and the
                public, not to give competitors a real-time window into
                trading. By the time a 13F is public, the underlying
                positions are already 45+ days stale.
              </p>
            </>
          ),
        },
        {
          heading: "What's in a 13F (and what isn't)",
          body: (
            <>
              <p>
                <strong className="text-text">In:</strong> Long positions
                in qualifying U.S.-listed equities (common stock, ADRs,
                ETFs), some convertible debt, and certain options on
                qualifying securities.
              </p>
              <p>
                <strong className="text-text">Out:</strong> Short
                positions, foreign-listed equities, cash, fixed income,
                most derivatives, private investments, and any non-13(f)
                securities. The 13F is not a complete portfolio — it is a
                long-equity slice.
              </p>
              <p>
                This asymmetry matters. A manager whose 13F shows zero
                position in a name may still hold the name short or via
                derivatives. Reading 13Fs as a complete view of a
                manager&apos;s book is the most common misuse of the
                disclosure.
              </p>
            </>
          ),
        },
        {
          heading: "13F-HR vs. 13F-NT — the variant taxonomy",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">13F-HR:</strong> Holdings
                Report. The standard variant containing the actual
                position list. SecFilingDex tracks{" "}
                <a href="/form/13f-hr" className="text-brand hover:underline">
                  {hrCount} 13F-HR filings
                </a>
                .
              </li>
              <li>
                <strong className="text-text">13F-NT:</strong> Notice
                filing. A manager whose holdings are already reported on
                another manager&apos;s 13F-HR (e.g., a sub-adviser
                relationship) files a 13F-NT pointing to the primary
                report. SecFilingDex tracks{" "}
                <a href="/form/13f-nt" className="text-brand hover:underline">
                  {ntCount} 13F-NT filings
                </a>
                .
              </li>
              <li>
                <strong className="text-text">13F-HR/A:</strong> Amendment
                to a prior 13F-HR — restated holdings, corrected counts,
                or post-filing additions.
              </li>
            </ul>
          ),
        },
        {
          heading: "Confidential treatment requests",
          body: (
            <p>
              A manager can request confidential treatment for specific
              positions — typically when public disclosure would reveal an
              ongoing accumulation. SEC review can take months; granted
              positions appear on the 13F when the confidentiality period
              expires. This explains why some 13Fs disclose new positions
              in the quarter <em>after</em> the position was actually
              built — a useful signal in itself.
            </p>
          ),
        },
      ]}
      ourView="The 13F is a great information source and a terrible alpha source. By the time the disclosure is public the position is 45+ days stale. The compounding lens is qualitative — what does this manager own at the level of theme, sector, and concentration — not quantitative replication. Following 13Fs to copy trades is a losing game; following 13Fs to understand mandates and risk tolerance is durable."
      liveDataLink={{
        label: "Browse live 13F filings",
        href: "/form/13f-hr",
        count: liveCount,
      }}
      related={[
        { slug: "13d-vs-13g", title: "13D vs. 13G: what's the difference?" },
        { slug: "form-4", title: "What is a Form 4 filing?" },
        { slug: "10-k", title: "What is a 10-K filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/learn/what-is-a-13f",
          label: "HoldLens: What is a 13F filing? (retail-investor angle)",
          description:
            "Same form, plain-English framing focused on what 13Fs mean for tracked superinvestors and retail readers.",
        },
        {
          href: "https://holdlens.com/learn/how-to-read-a-13f",
          label: "HoldLens: How to read a 13F",
          description:
            "Walkthrough of an actual filing — what to look for, what to ignore, how to spot meaningful position changes vs noise.",
        },
        {
          href: "https://holdlens.com/best-now",
          label: "HoldLens: Live ConvictionScore leaderboard",
          description:
            "Aggregate 13F-based score across 30 tracked managers, updated quarterly — not the raw catalog, the applied signal.",
        },
      ]}
      definedTerms={[
        {
          term: "13F",
          description:
            "Quarterly report under Section 13(f) of the Securities Exchange Act of 1934. Filed by institutional investment managers exercising investment discretion over ≥$100M of Section 13(f) securities.",
        },
        {
          term: "13F-HR",
          description:
            "Holdings Report variant of 13F. Contains the actual list of positions. Filed quarterly within 45 days of quarter-end.",
        },
        {
          term: "13F-NT",
          description:
            "Notice variant of 13F. Filed by managers whose holdings are reported on another manager's 13F-HR; the 13F-NT points to the primary filer rather than re-listing positions.",
        },
        {
          term: "Section 13(f) securities",
          description:
            "The SEC-published list of securities subject to 13F reporting. Includes most U.S.-listed common stock, ADRs, qualifying ETFs, and certain convertible debt and options.",
        },
        {
          term: "Confidential treatment",
          description:
            "An exemption a 13F filer can request from the SEC to delay public disclosure of specific positions. Granted positions appear on the 13F only when the confidentiality period ends.",
        },
      ]}
      faqs={[
        {
          q: "Who has to file a 13F?",
          a: "Institutional investment managers that exercise investment discretion over at least $100 million of Section 13(f) securities. The list of qualifying securities is published by the SEC each quarter.",
        },
        {
          q: "When is a 13F due?",
          a: "Within 45 days of the end of each calendar quarter. Because of that window, a 13F's positions are already at least 45 days stale by the time they become public.",
        },
        {
          q: "Does a 13F show a manager's short positions?",
          a: "No. A 13F reports only long positions in qualifying U.S.-listed equities (plus some convertible debt and options). Short positions, foreign-listed equities, cash, fixed income, and most derivatives are excluded, so a 13F is a long-equity slice, not a complete portfolio.",
        },
        {
          q: "What's the difference between a 13F-HR and a 13F-NT?",
          a: "A 13F-HR (Holdings Report) contains the actual list of positions. A 13F-NT (Notice) is filed by a manager whose holdings are already reported on another manager's 13F-HR — it points to that primary filer instead of re-listing positions. A 13F-HR/A is an amendment to a prior holdings report.",
        },
        {
          q: "Why does a 13F sometimes disclose a position a quarter late?",
          a: "A manager can request confidential treatment for specific positions, typically during an ongoing accumulation. SEC review can take months; the position appears on the 13F only when the confidentiality period expires — which is why some new positions surface a quarter after they were actually built.",
        },
      ]}
    />
  );
}
