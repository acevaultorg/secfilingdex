import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is an S-1 filing?",
  description:
    "An S-1 is the SEC registration statement a company files when going public. Plain-English explainer of structure, the IPO timeline, S-1/A amendments, and what each section reveals — with live filings.",
  alternates: { canonical: `${SITE_URL}/learn/s-1/` },
};

export default function LearnS1Page() {
  const liveCount = loadFilingsByFormType("S-1").length;
  const amendCount = loadFilingsByFormType("S-1/A").length;

  return (
    <LearnArticle
      slug="s-1"
      title="What is an S-1 filing?"
      tldr="An S-1 is the registration statement under the Securities Act of 1933 that a company files with the SEC to register securities for public sale — most commonly the IPO prospectus."
      sections={[
        {
          heading: "An S-1 is the IPO registration statement",
          body: (
            <>
              <p>
                Before a U.S. company can sell securities to the public,
                Section 5 of the Securities Act of 1933 requires the
                company to register those securities with the SEC. Form
                S-1 is the standard registration form for first-time
                public offerings (foreign private issuers use F-1
                instead).
              </p>
              <p>
                The S-1 is filed before the IPO prices. It is amended one
                or more times (each as an S-1/A) as the SEC reviews the
                filing, until the company and underwriters are ready to
                price and the SEC declares the registration effective.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside an S-1",
          body: (
            <>
              <p>
                S-1s are unusually thorough — often 200-400 pages. The
                most-read sections in order:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">Prospectus Summary:</strong>{" "}
                  the company&apos;s elevator pitch in SEC-disclosure
                  language.
                </li>
                <li>
                  <strong className="text-text">Risk Factors:</strong>{" "}
                  often the densest section. The company discloses every
                  material risk to its business — competitive,
                  regulatory, operational, financial.
                </li>
                <li>
                  <strong className="text-text">Use of Proceeds:</strong>{" "}
                  what the company plans to do with the IPO money.
                </li>
                <li>
                  <strong className="text-text">Capitalization:</strong>{" "}
                  pre-IPO and pro-forma post-IPO capital structure.
                </li>
                <li>
                  <strong className="text-text">Dilution:</strong> the
                  difference between IPO price and net tangible book
                  value per share.
                </li>
                <li>
                  <strong className="text-text">MD&A + Business +
                  Financial Statements:</strong> same content categories
                  as the 10-K, often more granular for smaller pre-IPO
                  companies.
                </li>
                <li>
                  <strong className="text-text">Principal Stockholders:</strong>{" "}
                  pre-IPO ownership table — founders, VC firms,
                  pre-IPO investors. Shows who is selling and who is
                  holding through the IPO.
                </li>
                <li>
                  <strong className="text-text">Underwriting:</strong>{" "}
                  fees, lock-up provisions, greenshoe option mechanics.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "S-1 vs. S-1/A — the IPO timeline",
          body: (
            <ol className="list-decimal pl-6 space-y-1.5">
              <li>
                <strong className="text-text">First S-1 filing:</strong>{" "}
                often heavily redacted. Estimated price range, share
                count, and certain agreements may still be blank.
              </li>
              <li>
                <strong className="text-text">SEC comment letters:</strong>{" "}
                the SEC asks questions, requests revisions, and pushes
                back on disclosure. Eventually published in EDGAR after
                effectiveness.
              </li>
              <li>
                <strong className="text-text">S-1/A amendments:</strong>{" "}
                each round of revisions creates an S-1/A.
              </li>
              <li>
                <strong className="text-text">Pricing amendment:</strong>{" "}
                shortly before IPO, the company files an S-1/A with the
                price range.
              </li>
              <li>
                <strong className="text-text">Final prospectus (424B):</strong>{" "}
                after pricing, a 424B prospectus locks the actual price
                and share count.
              </li>
              <li>
                <strong className="text-text">Effectiveness + trading:</strong>{" "}
                SEC declares the registration effective; shares begin
                trading.
              </li>
            </ol>
          ),
        },
        {
          heading: "S-1 vs. S-3 vs. F-1",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">S-1:</strong> first-time
                U.S. domestic registration. Heaviest disclosure.
              </li>
              <li>
                <strong className="text-text">S-3:</strong> shelf
                registration for already-public seasoned issuers. Much
                shorter — incorporates the 10-K and 10-Q by reference.
              </li>
              <li>
                <strong className="text-text">F-1:</strong> equivalent of
                S-1 for foreign private issuers (e.g., a Chinese or
                European company listing in the U.S.).
              </li>
            </ul>
          ),
        },
        {
          heading: "S-1/A — amendments",
          body: (
            <p>
              SecFilingDex tracks{" "}
              <a href="/form/s-1-a" className="text-brand hover:underline">
                {amendCount} S-1/A amendments
              </a>{" "}
              alongside the originals. Reading consecutive S-1/A versions
              against each other is the cleanest way to see what the SEC
              pushed back on — language that disappears or grows between
              amendments is signal.
            </p>
          ),
        },
      ]}
      ourView="The S-1 is the most honest document a company will ever file. Risk factors are written when the company most needs to be candid, before public pressure shapes management language. Read the S-1 — and especially the early S-1 vs. final S-1/A diff — for any IPO you're seriously evaluating. The disclosure quality compresses sharply once the company is public."
      liveDataLink={{
        label: "Browse live S-1 filings",
        href: "/form/s-1",
        count: liveCount,
      }}
      related={[
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "8-k", title: "What is an 8-K filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/",
          label: "HoldLens: Smart-money signals across 30 tracked superinvestors",
          description:
            "Track which tracked managers buy IPO secondaries in the 13F quarter following the S-1 effective date.",
        },
      ]}
      definedTerms={[
        {
          term: "S-1",
          description:
            "Registration statement under the Securities Act of 1933, Form S-1. The form U.S. domestic issuers file to register securities for public sale, most commonly used for IPOs.",
        },
        {
          term: "S-1/A",
          description:
            "An amendment to a previously filed S-1. Filed during the SEC review and pricing process; a typical IPO sees several S-1/A filings before effectiveness.",
        },
        {
          term: "Effectiveness",
          description:
            "The SEC's declaration that a registration statement is effective. After effectiveness, the issuer may sell the registered securities.",
        },
        {
          term: "Lock-up period",
          description:
            "Contractual restriction prohibiting pre-IPO holders (founders, employees, early investors) from selling shares for a defined period (typically 90-180 days) after the IPO. Disclosed in the S-1 underwriting section.",
        },
        {
          term: "424B prospectus",
          description:
            "Final prospectus filed under Rule 424(b) after the registration statement becomes effective and pricing is complete. Contains the locked-in offering price and share count.",
        },
      ]}
    />
  );
}
