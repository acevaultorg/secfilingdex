import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a SC 13E3 filing?",
  description:
    "SC 13E3 is the SEC going-private transaction disclosure. Filed by the issuer (or an affiliate) when a Rule 13e-3 transaction will result in the issuer's deregistration as a public company. Plain-English explainer.",
  alternates: { canonical: `${SITE_URL}/learn/sc-13e3/` },
};

export default function LearnSC13E3Page() {
  const liveCount = loadFilingsByFormType("SC 13E3").length + loadFilingsByFormType("SC 13E3/A").length;

  return (
    <LearnArticle
      slug="sc-13e3"
      title="What is a SC 13E3 filing?"
      tldr="SC 13E3 is the SEC going-private transaction disclosure required under Rule 13e-3 of the Securities Exchange Act. Filed by the issuer or an affiliate undertaking a transaction that will have the reasonable likelihood of deregistering the issuer's securities or otherwise causing the issuer to cease being a reporting company. The document discloses the substantive fairness analysis behind the going-private price."
      sections={[
        {
          heading: "Who files a SC 13E3, and when",
          body: (
            <>
              <p>
                Rule 13e-3 under the Securities Exchange Act of 1934
                applies to going-private transactions: leveraged
                buyouts, management buyouts, freezeout mergers,
                affiliate tender offers, and any other transaction
                whose reasonably likely effect is to cause the issuer
                to deregister or have a class of equity securities held
                of record by fewer than 300 persons.
              </p>
              <p>
                The SC 13E3 is filed concurrently with the substantive
                transaction documents (proxy statement on Schedule 14A,
                tender offer on Schedule TO, etc.) and provides the
                Rule 13e-3-specific disclosures over and above the
                substantive document&apos;s ordinary requirements.
              </p>
            </>
          ),
        },
        {
          heading: "What's inside a SC 13E3 — the fairness disclosure",
          body: (
            <>
              <p>
                The disclosure heart of every SC 13E3 is Item 8 — &quot;Fairness
                of the Transaction.&quot; The filer must describe whether
                each named filing person believes the going-private
                transaction is fair to unaffiliated security holders,
                AND must describe the material factors considered in
                reaching that determination. Required factors include:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Going-concern value of the issuer</li>
                <li>Liquidation value of the issuer</li>
                <li>Net book value</li>
                <li>Historical market prices</li>
                <li>Current market prices</li>
                <li>Recent transactions in the issuer&apos;s securities (including
                  any purchase by the filing person or affiliate during the prior 2 years)</li>
                <li>Whether the transaction price was negotiated by an unaffiliated representative of the unaffiliated security holders</li>
                <li>Whether the transaction was approved by a majority of directors who are not employees of the issuer</li>
              </ul>
              <p className="mt-3">
                Each named filing person must take a position on each
                factor — including a position of &quot;not applicable&quot;
                — and the disclosure cannot incorporate by reference
                another person&apos;s analysis. The result is a
                multi-perspective fairness analysis where parent,
                affiliate, and management each opine separately on the
                same set of factors.
              </p>
            </>
          ),
        },
        {
          heading: "SC 13E3 amendments and the deal timeline",
          body: (
            <>
              <p>
                A typical going-private deal generates 3-5 SC 13E3
                amendments as the SEC comment letter cycle iterates:
                initial SC 13E3 + Schedule 14A → SEC staff comments →
                amended response → final approval → effective document.
                Each amendment is a public revision of the fairness
                disclosures, and the comment-letter exchanges become
                publicly available 20 days after the transaction closes.
              </p>
              <p>
                For arbitrageurs, the SC 13E3 cycle defines the deal
                process timeline. Initial SC 13E3 + record date sets the
                shareholder-meeting timeline. The fairness opinion(s)
                attached to SC 13E3 are the analytical anchor for the
                proxy-fight that any merger-arb fund will run if the
                deal price is below the arbitrage threshold.
              </p>
            </>
          ),
        },
      ]}
      ourView="SC 13E3 is the most carefully-lawyered disclosure in the entire SEC catalog. Every word in Item 8 is fought over because shareholder appraisal litigation will mine it for inconsistencies. Reading a SC 13E3 — especially the amendments and the eventual SEC comment-letter responses — is the single best way to understand the substantive fairness analysis behind a going-private price. The going-public transaction (S-1) and the going-private transaction (SC 13E3) bracket the entire arc of being a public company, and SC 13E3 documents what private buyers actually thought the company was worth at exit."
      liveDataLink={liveCount > 0 ? {
        label: "Browse live SC 13E3 filings",
        href: "/form/sc-13e3",
        count: liveCount,
      } : undefined}
      related={[
        { slug: "13d-vs-13g", title: "13D vs 13G — activist vs passive" },
        { slug: "def-14a", title: "What is a DEF 14A filing?" },
        { slug: "s-1", title: "What is an S-1 filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/learn/event-score-explained",
          label: "HoldLens: Event Score — quantifying material events",
          description:
            "Going-private announcements score highly on HoldLens's Event Score. Tracked-superinvestor positions in deal targets surface immediately when SC 13E3 hits EDGAR.",
        },
        {
          href: "https://holdlens.com/activist/",
          label: "HoldLens: Activist campaign tracker",
          description:
            "Many going-private transactions are preceded by 13D activist campaigns. The Schedule 13D filing trail often anticipates the eventual SC 13E3 by months or years.",
        },
      ]}
      definedTerms={[
        {
          term: "SC 13E3",
          description:
            "Schedule 13E-3 — the SEC going-private transaction disclosure required under Rule 13e-3 of the Securities Exchange Act of 1934. Filed alongside the substantive transaction document (proxy, tender, merger) for any transaction reasonably likely to cause the issuer to deregister.",
        },
        {
          term: "Rule 13e-3",
          description:
            "The Exchange Act rule defining 'going-private transaction' and the disclosure requirements applicable to such transactions. Adopted in 1979 to provide unaffiliated shareholders with the substantive information needed to evaluate fairness when affiliated parties are acquiring the company.",
        },
        {
          term: "Going-Private Transaction",
          description:
            "Per Rule 13e-3(a)(3), any transaction or series of transactions by an issuer or affiliate that has a reasonable likelihood (or purpose) of producing one of the deregistration effects: 300-record-holder Section 12(g) deregistration, Section 12(b) listing termination, or Section 15(d) suspension.",
        },
        {
          term: "Fairness Opinion",
          description:
            "An investment-banking opinion stating that the transaction price is fair to a specified group of security holders from a financial point of view. Almost always attached to a SC 13E3 to support the filer's Item 8 fairness determination. Underlying analysis methodologies (DCF, comparable companies, transactions) are disclosed.",
        },
        {
          term: "Special Committee",
          description:
            "A subset of independent directors formed to negotiate a going-private transaction on behalf of unaffiliated shareholders. Mentioned in Item 8 fairness factors because special-committee approval of a transaction is a key procedural protection — and the absence of one is itself a disclosure-worthy fact.",
        },
      ]}
    />
  );
}
