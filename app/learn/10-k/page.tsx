import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

type Item = { code: string; name: string; note?: string };

const PARTS: { title: string; items: Item[] }[] = [
  {
    title: "Part I — The business",
    items: [
      { code: "1", name: "Business", note: "What the company does, its segments, customers, competition and regulation" },
      { code: "1A", name: "Risk Factors", note: "In plain English; smaller reporting companies may omit it" },
      { code: "1B", name: "Unresolved Staff Comments", note: "Only accelerated and large accelerated filers and well-known seasoned issuers" },
      { code: "1C", name: "Cybersecurity", note: "Risk management, strategy and governance for cyber risk" },
      { code: "2", name: "Properties" },
      { code: "3", name: "Legal Proceedings" },
      { code: "4", name: "Mine Safety Disclosures", note: "If applicable, points to exhibit 95" },
    ],
  },
  {
    title: "Part II — Results and financial statements",
    items: [
      { code: "5", name: "Market for Common Equity, Stockholder Matters and Issuer Purchases of Equity Securities", note: "Includes the monthly buyback table for the fourth quarter" },
      { code: "6", name: "[Reserved]", note: "Left empty on the current form" },
      { code: "7", name: "Management's Discussion and Analysis (MD&A)", note: "Management's own account of the results" },
      { code: "7A", name: "Quantitative and Qualitative Disclosures About Market Risk" },
      { code: "8", name: "Financial Statements and Supplementary Data", note: "The audited statements" },
      { code: "9", name: "Changes in and Disagreements With Accountants" },
      { code: "9A", name: "Controls and Procedures", note: "Internal control over financial reporting" },
      { code: "9B", name: "Other Information", note: "Any fourth-quarter 8-K event not yet reported" },
      { code: "9C", name: "Foreign Jurisdictions that Prevent Inspections", note: "Only companies whose auditor the PCAOB cannot inspect" },
    ],
  },
  {
    title: "Part III — People and pay (often in the proxy instead)",
    items: [
      { code: "10", name: "Directors, Executive Officers and Corporate Governance" },
      { code: "11", name: "Executive Compensation" },
      { code: "12", name: "Security Ownership of Beneficial Owners and Management" },
      { code: "13", name: "Related Transactions and Director Independence" },
      { code: "14", name: "Principal Accountant Fees and Services", note: "Audit, audit-related, tax and other fees for two years" },
    ],
  },
  {
    title: "Part IV — Exhibits",
    items: [
      { code: "15", name: "Exhibits and Financial Statement Schedules" },
      { code: "16", name: "Form 10-K Summary", note: "Optional" },
    ],
  },
];

const KEY_ITEMS = ["1A", "7", "8", "9A"];
const ITEM_BY_CODE: Record<string, Item> = Object.fromEntries(
  PARTS.flatMap((p) => p.items).map((i) => [i.code, i]),
);

const DEADLINES: { filer: string; days: string; who: string }[] = [
  { filer: "Large accelerated filer", days: "60 days", who: "Public float of $700 million or more" },
  { filer: "Accelerated filer", days: "75 days", who: "Public float of $75 million to under $700 million, unless annual revenue is under $100 million" },
  { filer: "All other registrants", days: "90 days", who: "Non-accelerated filers, including most smaller companies" },
];

function ItemTable({ rows }: { rows: Item[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="w-full text-body-sm">
        <thead>
          <tr className="border-b border-border text-left text-dim">
            <th scope="col" className="px-3 py-2 font-medium">Item</th>
            <th scope="col" className="px-3 py-2 font-medium">What it covers</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.code}>
              <td className="whitespace-nowrap px-3 py-2 align-top font-mono tabular text-text">{r.code}</td>
              <td className="px-3 py-2">
                <span className="text-text">{r.name}</span>
                {r.note ? <span className="block text-caption text-muted">{r.note}</span> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const metadata: Metadata = {
  title: "What is a 10-K filing? All 23 items and the 60/75/90-day deadlines",
  description:
    "A 10-K is the audited annual report a U.S. public company files with the SEC. All 23 Form 10-K items in four parts, the 60, 75 and 90-day deadlines, and the latest 10-Ks filed.",
  alternates: { canonical: `${SITE_URL}/learn/10-k/` },
};

export default function Learn10KPage() {
  const all10K = loadFilingsByFormType("10-K");
  const liveCount = all10K.length;
  const amendCount = loadFilingsByFormType("10-K/A").length;

  return (
    <LearnArticle
      slug="10-k"
      title="What is a 10-K filing?"
      tldr="A 10-K is the audited annual report U.S. public companies file with the SEC. It is the single most comprehensive disclosure a domestic registrant produces in any given year."
      dateModified="2026-10-07"
      livePreview={{
        formLabel: "10-K",
        filings: all10K.slice(0, 5),
        browseHref: "/form/10-k",
        totalCount: liveCount,
      }}
      sections={[
        {
          heading: "A 10-K is the annual report — comprehensive, audited, and required",
          body: (
            <>
              <p>
                The 10-K is filed once per fiscal year by every U.S.
                domestic public company under Section 13 or 15(d) of the
                Securities Exchange Act of 1934. Form 10-K is the filing
                submitted to the SEC. Companies may reproduce it inside, or
                combine it with, the annual report sent to shareholders,
                which is designed for a broader audience.
              </p>
              <p>
                The deadline depends on the company&apos;s filer status,
                counted from the end of its fiscal year:
              </p>
              <div className="overflow-x-auto rounded-card border border-border">
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-dim">
                      <th scope="col" className="px-3 py-2 font-medium">Filer status</th>
                      <th scope="col" className="px-3 py-2 font-medium">Due after year-end</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {DEADLINES.map((d) => (
                      <tr key={d.filer}>
                        <td className="px-3 py-2 align-top">
                          <span className="text-text">{d.filer}</span>
                          <span className="block text-caption text-muted">{d.who}</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 align-top font-mono tabular text-text">{d.days}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                For a company with a December 31 year-end, 60 days lands
                around March 1. The people-and-pay items in Part III may
                come later: they can be taken from the proxy statement if
                that is filed within 120 days of year-end.
              </p>
            </>
          ),
        },
        {
          heading: "All 23 Form 10-K items, in four parts",
          body: (
            <>
              <p>
                Form 10-K has 23 numbered items in four parts. Most readers
                go straight to four of them:
              </p>
              <ItemTable rows={KEY_ITEMS.map((code) => ITEM_BY_CODE[code])} />
              <details className="rounded-card border border-border px-3 py-2">
                <summary className="cursor-pointer py-2 font-medium text-text">
                  Show all 23 items by part (the 4 above included)
                </summary>
                <div className="space-y-4 pb-2 pt-2">
                  {PARTS.map((part) => (
                    <div key={part.title} className="space-y-2">
                      <h3 className="text-body-sm font-medium text-text">{part.title}</h3>
                      <ItemTable rows={part.items} />
                    </div>
                  ))}
                </div>
              </details>
              <p className="text-body-sm text-dim">
                Source: SEC Form 10-K and its General Instructions A and G
                (form edition SEC 1673 (02-25), OMB approval expiring
                September 30, 2029, read 2026-10-07). Filer-status
                thresholds are from Exchange Act Rule 12b-2.
              </p>
            </>
          ),
        },
        {
          heading: "10-K vs. annual report vs. proxy",
          body: (
            <>
              <p>
                These three disclosures get conflated regularly. The
                distinctions matter:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">10-K:</strong> SEC-filed,
                  audited, comprehensive. The legal disclosure.
                </li>
                <li>
                  <strong className="text-text">Annual Report to Shareholders:</strong>{" "}
                  provided to shareholders and designed for a broader audience.
                  Many companies include or wrap Form 10-K inside it.
                </li>
                <li>
                  <strong className="text-text">Proxy (DEF 14A):</strong>{" "}
                  filed before the annual shareholders&apos; meeting.
                  Covers director elections, executive compensation,
                  shareholder proposals.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "10-K/A — amendments",
          body: (
            <p>
              When a company restates prior financials or corrects a 10-K
              already filed, it files a 10-K/A. SecFilingDex tracks{" "}
              <a href="/form/10-k-a" className="text-brand hover:underline">
                {amendCount} 10-K/A amendments
              </a>{" "}
              alongside originals so the historical disclosure record is
              complete. An amendment doesn&apos;t replace the original —
              both filings remain on the public record.
            </p>
          ),
        },
      ]}
      ourView="The 10-K is the most underused document on EDGAR. Most market commentary cites the press release; the actual disclosure language — particularly Item 1A risk factors and Item 7 MD&A — is where companies are required to be precise. Comparing the two most recent filings makes changes in risk and management language easier to see."
      liveDataLink={{
        label: "Browse live 10-K filings",
        href: "/form/10-k",
        count: liveCount,
      }}
      related={[
        { slug: "10-q", title: "What is a 10-Q filing?" },
        { slug: "8-k", title: "What is an 8-K filing?" },
        { slug: "s-1", title: "What is an S-1 filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/learn/buybacks-vs-dividends",
          label: "HoldLens: Buybacks vs Dividends — applied analysis",
          description:
            "10-K annual reports authorize buybacks. HoldLens reads them across 30 tracked superinvestors to map capital-return policy shifts.",
        },
        {
          href: "https://holdlens.com/learn/how-to-read-buyback-disclosures",
          label: "HoldLens: How to read buyback disclosures",
          description:
            "Walkthrough of Item 8.01 + Part II buyback authorizations as they appear in real filings.",
        },
      ]}
      definedTerms={[
        {
          term: "10-K",
          description:
            "Annual report on Form 10-K filed with the SEC by U.S. public companies under Section 13 or 15(d) of the Securities Exchange Act of 1934. Includes audited financial statements, business overview, risk factors, and Management's Discussion and Analysis.",
        },
        {
          term: "10-K/A",
          description:
            "An amendment to a previously filed 10-K. Used to restate prior financials, correct errors, or add information that was deficient in the original filing.",
        },
        {
          term: "MD&A",
          description:
            "Management's Discussion and Analysis of Financial Condition and Results of Operations. Item 7 of the 10-K. The narrative explanation management is required to provide for the financial results.",
        },
        {
          term: "Risk Factors",
          description:
            "Item 1A of the 10-K. Forward-looking risks the company is required to disclose, written in plain English under SEC plain-English rules.",
        },
      ]}
      faqs={[
        {
          q: "Is a 10-K audited?",
          a: "Yes. A 10-K is the audited annual report — the single most comprehensive disclosure a U.S. public company produces in a given year, and it includes audited financial statements.",
        },
        {
          q: "When is a 10-K due?",
          a: "60 days after fiscal year-end for large accelerated filers, 75 days for accelerated filers and 90 days for all other registrants (SEC Form 10-K, General Instruction A). Part III may instead come from the proxy statement if that is filed within 120 days of year-end.",
        },
        {
          q: "How many items are in a 10-K?",
          a: "23 items in four parts: Part I (Items 1 to 4, the business), Part II (Items 5 to 9C, results and financial statements), Part III (Items 10 to 14, directors and pay) and Part IV (Items 15 and 16, exhibits). Item 6 is reserved and left empty.",
        },
        {
          q: "How often is a 10-K filed?",
          a: "Once per fiscal year. It is the annual filing; the quarters in between are covered by three 10-Q reports.",
        },
        {
          q: "What's the difference between a 10-K and a company's annual report?",
          a: "The 10-K is the SEC-mandated, audited, comprehensive filing. The annual report sent to shareholders is designed for a broader audience and may include or reproduce Form 10-K; the proxy statement (DEF 14A) separately covers governance and executive pay.",
        },
        {
          q: "Where are a company's risk factors in a 10-K?",
          a: "In Item 1A. It sets out the forward-looking risks the company is required to disclose, written in plain English under SEC plain-English rules. Management's narrative on results sits separately in Item 7 (MD&A).",
        },
        {
          q: "What is a 10-K/A?",
          a: "An amendment to a previously filed 10-K, used to restate prior financials, correct errors, or add deficient information. The amendment does not replace the original — both filings remain on the public record.",
        },
      ]}
    />
  );
}
