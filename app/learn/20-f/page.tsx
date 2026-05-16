import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a 20-F filing?",
  description:
    "20-F is the SEC annual report foreign private issuers (non-U.S. companies listed on U.S. exchanges) file each year. It mirrors the 10-K with adaptations for non-U.S. accounting and governance. Plain-English explainer with live filings.",
  alternates: { canonical: `${SITE_URL}/learn/20-f/` },
};

export default function Learn20FPage() {
  const liveCount = loadFilingsByFormType("20-F").length;
  const amendCount = loadFilingsByFormType("20-F/A").length;
  const k6Count = loadFilingsByFormType("6-K").length;

  return (
    <LearnArticle
      slug="20-f"
      title="What is a 20-F filing?"
      tldr="20-F is the SEC annual report a foreign private issuer (FPI) — a non-U.S. company with shares listed in the U.S. — files under the Securities Exchange Act. It is the foreign-issuer equivalent of the 10-K, with adaptations for non-U.S. accounting standards and governance practices."
      sections={[
        {
          heading: "Who files a 20-F",
          body: (
            <>
              <p>
                A foreign private issuer is a non-U.S. company that does
                not meet the SEC&apos;s definition of a U.S. domestic
                issuer — typically because its principal offices,
                directors, and shareholders are predominantly outside the
                U.S. FPIs include companies like Toyota, Novartis,
                Alibaba, ASML, and SAP that list ADRs or ordinary shares
                on U.S. exchanges.
              </p>
              <p>
                The 20-F is filed annually within 4 months of fiscal
                year-end (compared to 60-90 days for U.S. domestic
                filers).
              </p>
            </>
          ),
        },
        {
          heading: "What's inside a 20-F",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Item 3 — Key Information:</strong>{" "}
                selected financial data, capitalization, risk factors.
              </li>
              <li>
                <strong className="text-text">Item 4 — Information on the Company:</strong>{" "}
                business overview, organizational structure, property,
                plant, and equipment.
              </li>
              <li>
                <strong className="text-text">Item 5 — Operating &amp; Financial Review:</strong>{" "}
                FPI equivalent of the 10-K MD&amp;A.
              </li>
              <li>
                <strong className="text-text">Item 6 — Directors, Senior Management, Employees:</strong>{" "}
                governance disclosures, compensation summaries.
              </li>
              <li>
                <strong className="text-text">Item 7 — Major Shareholders &amp; Related Party Transactions:</strong>{" "}
                substantial holders, transactions with affiliates.
              </li>
              <li>
                <strong className="text-text">Item 8 — Financial Information:</strong>{" "}
                consolidated statements + auditor report. Often
                IFRS-prepared (per IASB) without U.S. GAAP reconciliation
                — the SEC accepts IFRS-as-issued-by-the-IASB for FPIs.
              </li>
              <li>
                <strong className="text-text">Item 16 series — Audit committee, ethics code, principal
                accountant fees, off-balance-sheet arrangements,
                contractual obligations:</strong>{" "}
                additional disclosures requested by Sarbanes-Oxley as
                adapted for FPIs.
              </li>
            </ul>
          ),
        },
        {
          heading: "20-F vs. 10-K — the practical differences",
          body: (
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong className="text-text">Filer eligibility:</strong>{" "}
                10-K = U.S. domestic; 20-F = foreign private issuer.
              </li>
              <li>
                <strong className="text-text">Accounting standard:</strong>{" "}
                10-K requires U.S. GAAP; 20-F accepts IFRS, U.S. GAAP,
                or home-country GAAP with a reconciliation.
              </li>
              <li>
                <strong className="text-text">Filing deadline:</strong>{" "}
                10-K within 60-90 days; 20-F within 4 months.
              </li>
              <li>
                <strong className="text-text">Frequency of interim
                reports:</strong> U.S. domestic files 10-Q quarterly;
                FPIs are not required to file quarterly — they instead
                file 6-K event-driven reports (and may also publish
                semi-annual or annual results per home-country rules).
              </li>
              <li>
                <strong className="text-text">Executive comp disclosure:</strong>{" "}
                FPIs disclose to the extent already disclosed in their
                home country — typically less granular than U.S. 10-K
                Summary Compensation Tables.
              </li>
            </ul>
          ),
        },
        {
          heading: "20-F/A and 6-K — the FPI ecosystem",
          body: (
            <>
              <p>
                Two related filings round out the FPI disclosure pattern:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">20-F/A:</strong> amendment
                  to a previously filed 20-F. SecFilingDex tracks{" "}
                  <a href="/form/20-f-a" className="text-brand hover:underline">
                    {amendCount} 20-F/A filings
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-text">6-K:</strong> the FPI
                  equivalent of the 8-K — used to furnish material
                  information made public in the home country between
                  20-F filings (interim earnings, M&amp;A,
                  leadership changes). SecFilingDex tracks{" "}
                  <a href="/form/6-k" className="text-brand hover:underline">
                    {k6Count} 6-K filings
                  </a>
                  .
                </li>
              </ul>
            </>
          ),
        },
      ]}
      ourView="20-Fs are underused by U.S. analysts who default to 10-Ks. The most interesting FPI signal is comparing the 20-F's Operating &amp; Financial Review against the same company's home-country annual report — sometimes management writes more candidly for home-country regulators. The 6-K stream is the better real-time signal for FPI material events; treat it like an 8-K queue."
      liveDataLink={{
        label: "Browse live 20-F filings",
        href: "/form/20-f",
        count: liveCount,
      }}
      related={[
        { slug: "10-k", title: "What is a 10-K filing?" },
        { slug: "10-q", title: "What is a 10-Q filing?" },
        { slug: "8-k", title: "What is an 8-K filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/",
          label: "HoldLens: Smart-money signals across 30 tracked superinvestors",
          description:
            "Applied analysis surface — including the foreign issuers held by tracked managers.",
        },
      ]}
      definedTerms={[
        {
          term: "20-F",
          description:
            "Annual report under the Securities Exchange Act of 1934 filed by foreign private issuers (FPIs). The foreign-issuer equivalent of the 10-K, accepting IFRS or home-country GAAP financial statements.",
        },
        {
          term: "20-F/A",
          description:
            "Amendment to a previously filed 20-F. Used to restate financials, correct errors, or add disclosure.",
        },
        {
          term: "Foreign Private Issuer (FPI)",
          description:
            "A non-U.S. company with shares listed on a U.S. exchange that does not meet the SEC's definition of a U.S. domestic issuer. Eligible to use 20-F and 6-K instead of 10-K and 10-Q.",
        },
        {
          term: "6-K",
          description:
            "Event-driven report filed by foreign private issuers to furnish material information made public in their home country between annual 20-F filings. The FPI equivalent of an 8-K.",
        },
        {
          term: "IFRS",
          description:
            "International Financial Reporting Standards, issued by the International Accounting Standards Board (IASB). Accepted by the SEC for FPI 20-F filings without U.S. GAAP reconciliation.",
        },
      ]}
    />
  );
}
