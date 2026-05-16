import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a Form D filing?",
  description:
    "Form D is the SEC notice of exempt offering, filed by issuers selling securities under Regulation D — typically private placements to accredited investors. Plain-English explainer with live filings.",
  alternates: { canonical: `${SITE_URL}/learn/form-d/` },
};

export default function LearnFormDPage() {
  const liveCount = loadFilingsByFormType("D").length + loadFilingsByFormType("D/A").length;

  return (
    <LearnArticle
      slug="form-d"
      title="What is a Form D filing?"
      tldr="Form D is the SEC notice of exempt offering filed under Rule 503 of Regulation D. Issuers selling securities to accredited investors without registering with the SEC must still file Form D within 15 days of the first sale. It is the public-record trail for the private-placement market — every venture round, every private REIT raise, every private-fund interests offering."
      sections={[
        {
          heading: "Who files a Form D, and when",
          body: (
            <>
              <p>
                Rule 503 of Regulation D under the Securities Act of
                1933 requires issuers selling securities under Rule 504,
                Rule 506(b), or Rule 506(c) — the &quot;Reg D safe
                harbors&quot; — to file Form D notice of the offering
                within 15 days of the first sale. Form D does NOT
                register the offering; it documents the issuer&apos;s
                claim that the offering is exempt from registration.
              </p>
              <p>
                Form D filers span the private capital universe: venture
                rounds (Stripe, OpenAI, Anthropic before IPO),
                private-equity fund interests, private REITs, hedge-fund
                limited-partnership interests, regulatory-A+
                mini-IPOs, real-estate syndications. Every one of these
                offerings shows up in EDGAR as a Form D.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside a Form D",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Issuer identification</strong>{" "}
                — name, year of formation, state, SIC code, type of
                entity (corporation, LLC, limited partnership, etc.).
              </li>
              <li>
                <strong className="text-text">Related persons</strong>{" "}
                — directors, executive officers, and beneficial owners
                holding 10%+ of any class. Each named individual&apos;s
                position and any prior &quot;bad actor&quot;
                disqualification facts under Rule 506(d).
              </li>
              <li>
                <strong className="text-text">Industry group</strong>{" "}
                — pre-defined SEC category (Technology, Real Estate,
                Other Banking and Financial Services, etc.) used for
                Reg D market-data statistics.
              </li>
              <li>
                <strong className="text-text">Offering amount</strong>{" "}
                — total amount offered + total amount sold + minimum
                investment. Reveals fundraising progress at the moment
                of filing.
              </li>
              <li>
                <strong className="text-text">Investor base</strong>{" "}
                — count of investors who have purchased; whether sales
                were to accredited investors only (Rule 506(b)) or
                included up to 35 non-accredited (Rule 506(b)
                pre-2013) or were generally solicited (Rule 506(c)).
              </li>
              <li>
                <strong className="text-text">Use of proceeds</strong>{" "}
                — broad categories: gross proceeds to issuer, sales
                commissions, finders&apos; fees, clear-and-final
                disposition. NOT a detailed budget — high-level only.
              </li>
            </ul>
          ),
        },
        {
          heading: "Form D as the public-record private-market dataset",
          body: (
            <>
              <p>
                Form D is the closest thing the U.S. financial system
                has to a public registry of private capital
                fundraising. Every venture round at every company
                going through the U.S. private markets surfaces in
                EDGAR within 15 days. The data points are coarse — no
                valuation disclosure, no investor names beyond
                officers/directors, no detailed use of proceeds — but
                the count of raises, the offering amounts, and the
                industry tagging are dense enough to support meaningful
                private-market activity analysis.
              </p>
              <p>
                Practitioners use Form D for: tracking competitor
                fundraising activity, monitoring exit and IPO pipelines
                (a final Form D amendment often precedes the S-1),
                identifying which industries are seeing private-capital
                flows, and surfacing newly-formed private funds for
                LP/GP relationship development.
              </p>
            </>
          ),
        },
      ]}
      ourView="Form D is the unsung public-record dataset of the U.S. private capital market. Most retail investors don't know it exists; most fund-tracking commercial databases (PitchBook, CB Insights, Crunchbase) reconstruct large portions of their data from it as the SEC primary source. Reading Form Ds directly costs nothing and gives you cleaner timestamps than the secondary databases. The companies that file the largest Form Ds today are the IPO candidates of 2-5 years from now."
      liveDataLink={liveCount > 0 ? {
        label: "Browse live Form D filings",
        href: "/form/d",
        count: liveCount,
      } : undefined}
      related={[
        { slug: "s-1", title: "What is an S-1 filing?" },
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "13f", title: "What is a 13F filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/",
          label: "HoldLens: Smart-money signals across 30 tracked superinvestors",
          description:
            "Pre-IPO Form D filings precede the public-company surface HoldLens tracks. The same private-funded companies eventually file S-1s and become 13F-tracked positions.",
        },
      ]}
      definedTerms={[
        {
          term: "Form D",
          description:
            "SEC notice of exempt offering filed under Rule 503 of Regulation D of the Securities Act of 1933. Required within 15 days of the first sale in an offering claiming exemption under Rule 504, 506(b), or 506(c). Does not register the offering — documents the exemption claim.",
        },
        {
          term: "Regulation D",
          description:
            "The set of rules (Rules 501-508) under Section 4(a)(2) of the Securities Act creating safe harbors from registration for private offerings. Rule 506(b) is the most-used safe harbor for venture and private-equity raises; Rule 506(c) permits general solicitation to verified accredited investors.",
        },
        {
          term: "Accredited Investor",
          description:
            "Investor meeting the SEC's accreditation thresholds under Rule 501(a): individual with $1M+ net worth (ex-primary-residence) or $200K+ individual income / $300K joint for two prior years; entity with $5M+ assets; certain regulated entities. Most Reg D offerings limit purchasers to accredited investors.",
        },
        {
          term: "Rule 506(b) vs 506(c)",
          description:
            "Two flavors of the most-used Reg D exemption. 506(b): no general solicitation permitted, up to 35 non-accredited investors allowed (rare in practice). 506(c): general solicitation permitted (issuer can publicly market the offering), but ALL purchasers must be verified accredited investors via specified verification procedures.",
        },
        {
          term: "Form D/A",
          description:
            "Amendment to a previously filed Form D. Filed annually during a multi-year continuous offering, or upon material changes (amount sold increases past threshold, named officers change, etc.). Long-running fund offerings produce a continuous trail of Form D + Form D/A amendments.",
        },
      ]}
    />
  );
}
