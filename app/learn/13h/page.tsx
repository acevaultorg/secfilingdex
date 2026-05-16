import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a Form 13H filing?",
  description:
    "Form 13H is the SEC large-trader registration filing. Any person whose securities transactions equal or exceed the identifying-activity-level threshold ($20M intraday or $200M monthly) must register and report. Plain-English explainer.",
  alternates: { canonical: `${SITE_URL}/learn/13h/` },
};

export default function Learn13HPage() {
  const liveCount = loadFilingsByFormType("SCHEDULE 13H").length + loadFilingsByFormType("13H").length;

  return (
    <LearnArticle
      slug="13h"
      title="What is a Form 13H filing?"
      tldr="Form 13H is the SEC large-trader identification filing. Any person — individual or entity — whose transactions in NMS securities equal or exceed the identifying-activity-level threshold ($20 million in a calendar day or $200 million in a month) must register with the SEC under Rule 13h-1."
      sections={[
        {
          heading: "Who files a 13H, and when",
          body: (
            <>
              <p>
                Rule 13h-1 under the Securities Exchange Act of 1934
                requires &quot;large traders&quot; to identify themselves
                to the SEC by filing Form 13H within ten days of first
                crossing the threshold. The rule was adopted in 2011 in
                response to the May 2010 Flash Crash, when regulators
                struggled to identify high-volume market participants
                during the post-event audit.
              </p>
              <p>
                The threshold is breached by either: (a) transactions
                aggregating $20 million in fair market value (or 2 million
                shares) during any single calendar day, or (b) transactions
                aggregating $200 million in fair market value (or 20
                million shares) during any calendar month.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside a 13H",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Large Trader ID (LTID)</strong>{" "}
                — assigned by the SEC. Once issued, the large trader
                provides the LTID to every broker-dealer that effects
                transactions on its behalf.
              </li>
              <li>
                <strong className="text-text">Affiliate disclosure</strong>{" "}
                — entities under common control with the filer that
                also engage in NMS-security transactions. Hedge fund
                family complexes typically file consolidated 13H
                covering all advised funds.
              </li>
              <li>
                <strong className="text-text">Business description</strong>{" "}
                — type of entity, primary business, regulatory
                registrations (RIA, broker-dealer, commodity pool, etc.).
              </li>
              <li>
                <strong className="text-text">Trading strategy classification</strong>{" "}
                — broad categories (e.g., market making, statistical
                arbitrage, fundamental investing, hedging) selected from
                the SEC&apos;s pre-defined list.
              </li>
            </ul>
          ),
        },
        {
          heading: "13H amendments and continuing obligations",
          body: (
            <>
              <p>
                A 13H filer must file an annual amendment within 45 days
                of the calendar year-end (the Form 13H Annual Filing).
                Material changes to previously-reported information —
                affiliate additions, business reorganizations,
                regulatory-status changes — require a quarterly
                amendment within ten days of quarter-end during the
                quarter in which the change occurred.
              </p>
              <p>
                Form 13H is NOT public in the same way 13F is. Filings
                are submitted via EDGAR but the content is treated as
                confidential by the SEC. Public availability is limited
                to the existence of the filing and aggregate statistics
                — not the trading-strategy classifications or affiliate
                lists. This is by design: large-trader identification
                is for SEC surveillance, not retail-investor due
                diligence.
              </p>
            </>
          ),
        },
      ]}
      ourView="13H is the only mandatory SEC filing whose content the public never sees in full — a quiet exception to the disclosure ethos that governs every other Exchange Act filing. The existence of a 13H filer ID tells you the entity crossed the large-trader threshold; the rest is between the SEC and the trader. For market-structure researchers, the aggregate 13H statistics in the SEC&apos;s annual report are more useful than any individual filing."
      liveDataLink={liveCount > 0 ? {
        label: "Browse 13H filings (existence only)",
        href: "/form/13h",
        count: liveCount,
      } : undefined}
      related={[
        { slug: "13f", title: "What is a 13F filing?" },
        { slug: "form-4", title: "What is a Form 4 filing?" },
        { slug: "13d-vs-13g", title: "13D vs 13G — activist vs passive" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/",
          label: "HoldLens: Smart-money signals across 30 tracked superinvestors",
          description:
            "Every superinvestor in HoldLens&apos;s tracked universe is a 13H filer. The 13F filings HoldLens publishes are the only public window into what these large traders are actually doing.",
        },
      ]}
      definedTerms={[
        {
          term: "Form 13H",
          description:
            "SEC large-trader identification filing required under Rule 13h-1. Filed within 10 days of first crossing the identifying-activity-level threshold ($20M/day or $200M/month in NMS securities). Annual amendment required.",
        },
        {
          term: "Identifying Activity Level",
          description:
            "The transaction-volume threshold triggering 13H registration: (a) $20 million in fair market value or 2 million shares during any single calendar day, or (b) $200 million or 20 million shares during any calendar month.",
        },
        {
          term: "Large Trader ID (LTID)",
          description:
            "The unique identifier the SEC issues to each 13H filer. The large trader supplies the LTID to every executing broker-dealer; broker-dealers report LTID-tagged transactions via the SEC's Electronic Blue Sheets system.",
        },
        {
          term: "NMS Security",
          description:
            "National Market System security. Defined by Regulation NMS as any security registered under Section 12 of the Exchange Act and traded on a national securities exchange — essentially all U.S. listed stocks and options.",
        },
        {
          term: "Rule 13h-1",
          description:
            "The SEC rule under Section 13(h) of the Exchange Act that establishes the large-trader reporting regime. Adopted July 2011 (Release No. 34-64976), effective October 2011, in response to the May 2010 Flash Crash.",
        },
      ]}
    />
  );
}
