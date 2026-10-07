import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is an S-3 filing?",
  description:
    "S-3 is the SEC shelf registration statement seasoned U.S. public companies use to pre-register securities for future issuance. Plain-English explainer of WKSI status, the takedown mechanism, and how S-3 differs from S-1 — with live filings.",
  alternates: { canonical: `${SITE_URL}/learn/s-3/` },
};

export default function LearnS3Page() {
  const liveCount = loadFilingsByFormType("S-1").length;

  return (
    <LearnArticle
      slug="s-3"
      title="What is an S-3 filing?"
      tldr="S-3 is the SEC short-form registration statement that already-public seasoned issuers use to register securities for future sale — the &ldquo;shelf registration&rdquo; that lets a company raise capital quickly when market conditions are favorable."
      sections={[
        {
          heading: "S-3 is the seasoned-issuer shelf",
          body: (
            <>
              <p>
                Where the S-1 is the long-form registration used for
                IPOs and by less-seasoned issuers, the S-3 is a much
                shorter form available only to companies that have been
                public for a year and meet additional eligibility
                requirements. The savings come from being able to
                <strong className="text-text"> incorporate by reference
                </strong>: instead of repeating the business overview,
                risk factors, and financials, the S-3 cross-references
                the company&apos;s already-on-file 10-K, 10-Qs, and
                8-Ks.
              </p>
              <p>
                When the SEC declares an S-3 effective, the company has
                a &ldquo;shelf&rdquo; — registered securities sitting
                ready for issuance. The actual sale happens through a
                &ldquo;takedown&rdquo; — a 424B prospectus supplement
                filed at the moment of pricing.
              </p>
            </>
          ),
        },
        {
          heading: "Who can use an S-3 — eligibility",
          body: (
            <>
              <p>
                Form S-3 General Instruction I sets registrant
                eligibility:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  Has been subject to Section 13 or 15(d) reporting for
                  ≥12 calendar months.
                </li>
                <li>
                  Has filed all required reports timely during those 12
                  months.
                </li>
                <li>
                  Has not defaulted on debt or rental obligations,
                  failed to pay preferred dividends, or had material
                  bankruptcy proceedings.
                </li>
                <li>
                  Meets one of: (a) ≥$75M public float for primary
                  offerings (the &ldquo;float test&rdquo;), or (b)
                  certain limited offerings + investment-grade debt
                  exceptions.
                </li>
              </ul>
              <p>
                A subset of S-3-eligible filers further qualify as{" "}
                <strong className="text-text">Well-Known Seasoned
                Issuers (WKSIs)</strong> — generally ≥$700M public float
                or $1B aggregate non-convertible debt issued in the past
                three years. WKSIs use Form S-3ASR (the
                &ldquo;automatic shelf registration&rdquo;) which
                becomes effective immediately upon filing — no SEC
                review delay. This is the registration form Apple,
                Microsoft, JPMorgan, and similar large issuers use for
                routine debt issuance.
              </p>
            </>
          ),
        },
        {
          heading: "S-3 vs. S-1 vs. S-3ASR",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">S-1:</strong> first-time
                or non-seasoned issuers. Heaviest disclosure. Used for
                IPOs and follow-ons by smaller filers.
              </li>
              <li>
                <strong className="text-text">S-3:</strong> seasoned
                issuers meeting eligibility. Short-form; incorporates by
                reference. Pre-registers a shelf; takedowns happen via
                424B.
              </li>
              <li>
                <strong className="text-text">S-3ASR:</strong> Well-Known
                Seasoned Issuer automatic shelf — effective on filing.
                Used by the largest, most-frequent issuers.
              </li>
            </ul>
          ),
        },
        {
          heading: "How to read S-3 activity for signal",
          body: (
            <>
              <p>
                S-3s themselves are usually not market-moving — they
                reserve capacity, they don&apos;t use it. The signal is
                in the takedowns:
              </p>
              <ol className="list-decimal pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">424B5 (prospectus
                  supplement):</strong> a takedown happens. The
                  supplement names the offering type, size, price, and
                  use of proceeds.
                </li>
                <li>
                  <strong className="text-text">8-K Item 7.01 or 8.01:</strong>{" "}
                  often paired with the 424B5 to provide additional
                  disclosure or press release.
                </li>
                <li>
                  <strong className="text-text">Quarterly takedown rate:</strong>{" "}
                  for large issuers, takedown frequency reveals real
                  capital cadence vs. announced funding plans.
                </li>
              </ol>
              <p>
                For large investment-grade issuers, a steady drip of
                shelf takedowns is normal financing. For mid-cap
                issuers, an unexpected takedown often follows a thesis
                shift — M&amp;A, dilution event, balance-sheet
                repair.
              </p>
            </>
          ),
        },
        {
          heading: "S-3 amendments + extensions",
          body: (
            <p>
              Shelves expire. Most S-3 shelves have a 3-year life under
              Rule 415. Companies file new S-3s as the prior shelf
              approaches expiry. A &ldquo;new S-3 a few months before
              old shelf expires&rdquo; is routine; an &ldquo;urgent S-3
              right after a 10-Q&rdquo; with no clear capital plan can
              signal management is preparing optionality for an upcoming
              decision.
            </p>
          ),
        },
      ]}
      ourView="The S-3 itself is not where the signal lives — it's the takedown rhythm. Watch the 424B5 stream for any issuer whose shelf you care about. Surprise takedowns, especially at unfavorable pricing, frequently precede leverage shifts that show up in the next 10-Q. WKSI takedowns are routine financing; non-WKSI takedowns are more interesting because the issuer has fewer alternatives."
      related={[
        { slug: "s-1", title: "What is an S-1 filing?" },
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "10-q", title: "What is a 10-Q filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/",
          label: "HoldLens: Smart-money signals across 30 tracked superinvestors",
          description:
            "Secondary offerings as a buying-opportunity signal — HoldLens shows which superinvestors stepped in.",
        },
      ]}
      definedTerms={[
        {
          term: "S-3",
          description:
            "Short-form registration statement under the Securities Act of 1933. Available to seasoned issuers with ≥12 months of timely reporting and meeting public-float eligibility tests. Used to register a shelf for future securities issuance.",
        },
        {
          term: "S-3ASR",
          description:
            "Automatic shelf registration on Form S-3 available to Well-Known Seasoned Issuers (WKSIs). Becomes effective immediately on filing — no SEC review delay.",
        },
        {
          term: "Well-Known Seasoned Issuer (WKSI)",
          description:
            "An issuer meeting elevated eligibility criteria, generally ≥$700M public float or ≥$1B in non-convertible debt issued in the past three years. WKSIs may use S-3ASR + free-writing prospectuses with fewer restrictions.",
        },
        {
          term: "Shelf registration",
          description:
            "Pre-registration of securities for future issuance, governed by Rule 415. The registered amount sits on the ‘shelf’ until the issuer pulls some down via a takedown (424B prospectus supplement). Most shelves have a 3-year life.",
        },
        {
          term: "424B prospectus supplement",
          description:
            "Final prospectus filed under Rule 424(b) at the moment of an actual securities sale from a registered shelf. Locks in price, size, and underwriter list.",
        },
        {
          term: "Incorporation by reference",
          description:
            "SEC mechanism allowing a registration statement to cite previously-filed documents (10-K, 10-Q, 8-K) instead of repeating the disclosures. Available for S-3 (and certain other forms) but not S-1.",
        },
      ]}
    />
  );
}
