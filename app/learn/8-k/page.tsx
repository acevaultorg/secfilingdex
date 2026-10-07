import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

type Item = { code: string; name: string; due?: string };

const DEFAULT_DUE = "4 business days";

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: "Section 1 — Registrant's business and operations",
    items: [
      { code: "1.01", name: "Entry into a material definitive agreement" },
      { code: "1.02", name: "Termination of a material definitive agreement" },
      { code: "1.03", name: "Bankruptcy or receivership" },
      { code: "1.04", name: "Mine safety: shutdowns and patterns of violations" },
      { code: "1.05", name: "Material cybersecurity incidents", due: "4 business days after the company determines the incident is material" },
    ],
  },
  {
    title: "Section 2 — Financial information",
    items: [
      { code: "2.01", name: "Completion of acquisition or disposition of assets" },
      { code: "2.02", name: "Results of operations and financial condition (earnings releases)", due: "4 business days; furnished, not filed" },
      { code: "2.03", name: "Creation of a direct financial obligation or off-balance-sheet arrangement" },
      { code: "2.04", name: "Triggering events that accelerate or increase a financial obligation" },
      { code: "2.05", name: "Costs associated with exit or disposal activities" },
      { code: "2.06", name: "Material impairments" },
    ],
  },
  {
    title: "Section 3 — Securities and trading markets",
    items: [
      { code: "3.01", name: "Notice of delisting or failure to meet a listing standard; transfer of listing" },
      { code: "3.02", name: "Unregistered sales of equity securities" },
      { code: "3.03", name: "Material modification to rights of security holders" },
    ],
  },
  {
    title: "Section 4 — Accountants and financial statements",
    items: [
      { code: "4.01", name: "Changes in the company's certifying accountant" },
      { code: "4.02", name: "Non-reliance on previously issued financial statements (restatements)" },
    ],
  },
  {
    title: "Section 5 — Corporate governance and management",
    items: [
      { code: "5.01", name: "Changes in control of the company" },
      { code: "5.02", name: "Departure or appointment of directors and certain officers; compensation" },
      { code: "5.03", name: "Amendments to articles or bylaws; change in fiscal year" },
      { code: "5.04", name: "Temporary suspension of trading under employee benefit plans" },
      { code: "5.05", name: "Amendments to or waivers of the code of ethics", due: "4 business days, or on the company website instead" },
      { code: "5.06", name: "Change in shell company status" },
      { code: "5.07", name: "Submission of matters to a vote of security holders", due: "4 business days after final voting results are known" },
      { code: "5.08", name: "Shareholder director nominations", due: "4 business days after the meeting date is set" },
    ],
  },
  {
    title: "Section 6 — Asset-backed securities (ABS issuers only)",
    items: [
      { code: "6.01", name: "ABS informational and computational material", due: "ABS issuers only" },
      { code: "6.02", name: "Change of servicer or trustee", due: "ABS issuers only" },
      { code: "6.03", name: "Change in credit enhancement or other external support", due: "ABS issuers only" },
      { code: "6.04", name: "Failure to make a required distribution", due: "ABS issuers only" },
      { code: "6.05", name: "Securities Act updating disclosure", due: "ABS issuers only" },
      { code: "6.06", name: "Static pool", due: "ABS issuers only" },
    ],
  },
  {
    title: "Section 7 — Regulation FD",
    items: [
      { code: "7.01", name: "Regulation FD disclosure", due: "Regulation FD timing; furnished, not filed" },
    ],
  },
  {
    title: "Section 8 — Other events",
    items: [
      { code: "8.01", name: "Other events the company deems important to holders", due: "Optional, no deadline" },
    ],
  },
  {
    title: "Section 9 — Financial statements and exhibits",
    items: [
      { code: "9.01", name: "Financial statements and exhibits", due: "With the report; acquired-business financials up to 71 calendar days later" },
    ],
  },
];

const ITEM_BY_CODE: Record<string, Item> = Object.fromEntries(
  SECTIONS.flatMap((s) => s.items).map((i) => [i.code, i]),
);

const TRACKED = ["1.01", "1.05", "2.01", "2.02", "3.01", "4.02", "5.02", "5.07", "7.01", "8.01"];

function ItemTable({ rows }: { rows: Item[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="w-full text-body-sm">
        <thead>
          <tr className="border-b border-border text-left text-dim">
            <th scope="col" className="px-3 py-2 font-medium">Item</th>
            <th scope="col" className="px-3 py-2 font-medium">What it reports · when due</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.code}>
              <td className="whitespace-nowrap px-3 py-2 align-top font-mono tabular text-text">{r.code}</td>
              <td className="px-3 py-2">
                <span className="text-text">{r.name}</span>
                <span className="block text-caption text-muted">{r.due ?? DEFAULT_DUE}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const metadata: Metadata = {
  title: "8-K filings — what they are and every 8-K filed this week",
  description:
    "An 8-K is the SEC current report for material events, due in four business days. All 33 Form 8-K items in one table, plus the latest 8-Ks filed.",
  alternates: { canonical: `${SITE_URL}/learn/8-k/` },
};

export default function Learn8KPage() {
  const all8K = loadFilingsByFormType("8-K");
  const liveCount = all8K.length;
  const amendCount = loadFilingsByFormType("8-K/A").length;

  return (
    <LearnArticle
      slug="8-k"
      dateModified="2026-10-07"
      title="What is an 8-K filing?"
      tldr="An 8-K is the SEC current report — used to disclose material events that arise between periodic filings. Generally due within four business days of the triggering event."
      livePreview={{
        formLabel: "8-K",
        filings: all8K.slice(0, 5),
        browseHref: "/form/8-k",
        totalCount: liveCount,
      }}
      sections={[
        {
          heading: "An 8-K announces material news, fast",
          body: (
            <>
              <p>
                Where 10-Ks and 10-Qs report on completed periods, the 8-K
                is for unscheduled events the market should know about
                immediately. Examples: earnings releases, mergers and
                acquisitions, bankruptcy, executive transitions, material
                contract changes, regulatory matters, and changes in
                auditor.
              </p>
              <p>
                Companies typically file an 8-K within four business days
                of the triggering event, though some items have shorter
                windows (or are conditional on prior public disclosure).
              </p>
            </>
          ),
        },
        {
          heading: "All 33 Form 8-K items, and when each is due",
          body: (
            <>
              <p>
                Form 8-K has 33 items in nine sections. Each item is one kind
                of event, and the cover page of every 8-K says which items it
                reports. Unless an item says otherwise, the report is due
                within four business days of the event. The ten items most
                readers look for:
              </p>
              <ItemTable rows={TRACKED.map((code) => ITEM_BY_CODE[code])} />
              <details className="rounded-card border border-border px-3 py-2">
                <summary className="cursor-pointer py-2 font-medium text-text">
                  Show all 33 items by section (the 10 above included)
                </summary>
                <div className="space-y-4 pb-2 pt-2">
                  {SECTIONS.map((sec) => (
                    <div key={sec.title} className="space-y-2">
                      <h3 className="text-body-sm font-medium text-text">{sec.title}</h3>
                      <ItemTable rows={sec.items} />
                    </div>
                  ))}
                </div>
              </details>
              <p className="text-body-sm text-dim">
                Source: SEC Form 8-K and its General Instructions B.1 and B.2
                (form edition expiring November 30, 2027, read 2026-10-07).
                Items 2.02 and 7.01 are &ldquo;furnished&rdquo;, not
                &ldquo;filed&rdquo;: they do not carry Section 18 liability
                unless the company says so.
              </p>
            </>
          ),
        },
        {
          heading: "How to read an 8-K quickly",
          body: (
            <ol className="list-decimal pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Skim the cover page</strong>{" "}
                for the list of Items checked. Each Item is a separate
                trigger.
              </li>
              <li>
                <strong className="text-text">Read the body</strong> for
                each Item — usually two to four paragraphs per Item.
              </li>
              <li>
                <strong className="text-text">Check Exhibit 99.x</strong>{" "}
                for any press release, presentation, or legal document
                attached.
              </li>
              <li>
                <strong className="text-text">Note the filing date vs.
                event date</strong> — gaps suggest internal review took
                time, which is itself signal.
              </li>
            </ol>
          ),
        },
        {
          heading: "8-K/A — amendments",
          body: (
            <p>
              An 8-K/A amends a prior 8-K. Common case: an Item 2.01
              acquisition closes, and the financial statements of the
              acquired business follow in an 8-K/A under Item 9.01, no later
              than 71 calendar days after the original 8-K was due. SecFilingDex tracks{" "}
              <a href="/form/8-k-a" className="text-brand hover:underline">
                {amendCount} 8-K/A amendments
              </a>
              .
            </p>
          ),
        },
      ]}
      ourView="8-Ks are where the alpha is, and most of it is in the items most observers ignore: 4.02 (restatements), 5.02 (executive turnover), and 1.02 (terminated material agreements). The market under-prices these because they aren't earnings — but they are the disclosures that change forward fundamentals."
      liveDataLink={{
        label: "Browse live 8-K filings",
        href: "/form/8-k",
        count: liveCount,
      }}
      related={[
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "10-q", title: "What is a 10-Q filing?" },
        { slug: "form-4", title: "What is a Form 4 filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/learn/event-score-explained",
          label: "HoldLens: Event Score — 8-K events scored",
          description:
            "Every 8-K Item is weighted by HoldLens's Event Score; the scoring framework + the live feed.",
        },
        {
          href: "https://holdlens.com/learn/buybacks-vs-dividends",
          label: "HoldLens: Buybacks vs Dividends",
          description:
            "Item 8.01 buyback events get the same scoring lens as 10-K authorizations — capital return as a single concept.",
        },
      ]}
      definedTerms={[
        {
          term: "8-K",
          description:
            "Current report on Form 8-K filed with the SEC to disclose material events between periodic filings. Generally due within four business days of the triggering event under Items specified in Form 8-K.",
        },
        {
          term: "8-K/A",
          description:
            "An amendment to a previously filed 8-K. Often used to provide financial statements of an acquired business after the closing 8-K announced the transaction.",
        },
        {
          term: "Item 4.02",
          description:
            "Item 4.02 of Form 8-K — Non-Reliance on Previously Issued Financial Statements. Filed when the company concludes prior financials should no longer be relied upon. A restatement signal.",
        },
        {
          term: "Material event",
          description:
            "An event that a reasonable investor would consider important in deciding whether to buy or sell securities. The threshold for SEC disclosure obligations.",
        },
      ]}
      faqs={[
        {
          q: "When must a company file an 8-K?",
          a: "Generally within four business days of the triggering event. The 8-K is the SEC current report, used to disclose material events that arise between periodic filings.",
        },
        {
          q: "What triggers an 8-K?",
          a: "A material event between periodic filings, categorized by the specific Items in Form 8-K — for example Item 4.02 (non-reliance on prior financials / restatements), Item 5.02 (executive turnover), and Item 1.02 (terminated material agreements).",
        },
        {
          q: "How many items are on Form 8-K?",
          a: "33 items in nine sections, from Item 1.01 (entry into a material definitive agreement) to Item 9.01 (financial statements and exhibits). Section 6 (items 6.01 to 6.06) applies only to asset-backed securities issuers.",
        },
        {
          q: "Which 8-K items are furnished rather than filed?",
          a: "Item 2.02 (results of operations, usually the earnings release) and Item 7.01 (Regulation FD disclosure). Under General Instruction B.2 they are not deemed filed for Section 18 liability unless the company states otherwise.",
        },
        {
          q: "What counts as a 'material' event?",
          a: "An event that a reasonable investor would consider important in deciding whether to buy or sell securities — that is the threshold for the SEC disclosure obligation.",
        },
        {
          q: "What is an 8-K/A?",
          a: "An amendment to a previously filed 8-K — commonly used to provide the financial statements of an acquired business, no later than 71 calendar days after the original 8-K was due.",
        },
      ]}
    />
  );
}
