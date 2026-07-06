// IndustrySummary — derived, zero-fabrication "filing landscape" analysis for
// /industry/[sicCode]. The template already lists filers + a form breakdown; this
// synthesises them into the industry-level read EDGAR does NOT offer (most-active
// filer, form-mix concentration + what it means, date span, a characterisation of
// what the code mostly indexes). Every value is COMPUTED from the real filing
// data — no fabricated facts (per project CLAUDE.md: cite EDGAR, never fabricate).
// Unique per industry because the filers / form mix / dates differ, so it is not
// scaled boilerplate.

import { formatDateShort } from "@/lib/format";

type Filer = {
  cik: string;
  filerName: string;
  ticker?: string;
  mostRecent: string;
  count: number;
};

type Props = {
  industryName: string;
  sicCode: string;
  filingsTotal: number;
  filers: Filer[];
  forms: [string, number][]; // sorted desc by count
  filedDates: string[];
};

const FORM_MEANING: Record<string, string> = {
  "10-K": "annual reports",
  "10-Q": "quarterly reports",
  "8-K": "material-event disclosures",
  "13F-HR": "institutional-holdings disclosures",
  "13F": "institutional-holdings disclosures",
  "4": "insider-transaction reports",
  "3": "initial insider-ownership reports",
  "5": "annual insider-ownership reports",
  "DEF 14A": "proxy statements",
  "DEFA14A": "proxy statements",
  "S-1": "IPO registration statements",
  "S-3": "shelf registration statements",
  "424B": "prospectuses",
  "SC 13G": "passive-ownership disclosures",
  "SC 13D": "activist-ownership disclosures",
  "6-K": "foreign-issuer interim reports",
  "20-F": "foreign-issuer annual reports",
  "11-K": "employee benefit-plan reports",
};
function meaning(f: string): string {
  return (
    FORM_MEANING[f] ??
    FORM_MEANING[f.replace(/\/A$/, "")] ??
    FORM_MEANING[f.replace(/[0-9]+$/, "")] ??
    "regulatory filings"
  );
}

export function IndustrySummary({
  industryName,
  sicCode,
  filingsTotal,
  filers,
  forms,
  filedDates,
}: Props) {
  const byCount = [...filers].sort((a, b) => b.count - a.count);
  const top = byCount[0];
  const topForm = forms[0];
  const share = topForm ? Math.round((topForm[1] / filingsTotal) * 100) : 0;
  const dates = filedDates.filter(Boolean).sort();
  const earliest = dates[0];
  const latest = dates[dates.length - 1];
  const nextForms = forms.slice(1, 3).map(([f]) => f);

  const frac = (re: RegExp) =>
    forms.filter(([f]) => re.test(f)).reduce((a, [, c]) => a + c, 0) / filingsTotal;
  const instFrac = frac(/13F/);
  const insiderFrac = frac(/^(3|4|5)(\/A)?$/);
  const periodicFrac = frac(/10-[KQ]/);

  const character =
    instFrac > 0.3
      ? `The mix here skews toward institutional-holdings disclosures, so this code mostly surfaces the funds and advisers reporting positions in ${industryName.toLowerCase()} names rather than the operating companies themselves.`
      : insiderFrac > 0.3
        ? `Insider-transaction forms lead the mix, so much of what is indexed is officers and directors reporting their own buying and selling rather than corporate periodic reports.`
        : periodicFrac > 0.3
          ? `Periodic corporate reports — 10-K annual and 10-Q quarterly — lead the mix, so this code chiefly indexes the operating companies themselves and their scheduled disclosures.`
          : `The filing mix is broad here, spanning periodic reports, event disclosures and ownership forms rather than being dominated by any single type.`;

  return (
    <section className="mb-10">
      <p className="text-eyebrow text-brand mb-4">Filing landscape</p>
      <div className="rounded-card-lg border border-border bg-panel/40 p-5 sm:p-6 space-y-4 text-body text-muted max-w-3xl">
        <p>
          {industryName} (SIC {sicCode}) is represented in the SecFilingDex index by{" "}
          <span className="text-text">{filers.length}</span> filer
          {filers.length === 1 ? "" : "s"} and{" "}
          <span className="text-text">{filingsTotal}</span> filing
          {filingsTotal === 1 ? "" : "s"} drawn from SEC EDGAR
          {earliest && latest
            ? `, dated between ${formatDateShort(earliest)} and ${formatDateShort(latest)}`
            : ""}
          .
          {top
            ? ` The most active filer is ${top.filerName}${
                top.ticker ? ` (${top.ticker})` : ""
              } with ${top.count} indexed filing${top.count === 1 ? "" : "s"}.`
            : ""}
        </p>
        {topForm ? (
          <p>
            Filing activity is led by{" "}
            <span className="text-text font-mono">{topForm[0]}</span> —{" "}
            {meaning(topForm[0])} — at {share}% of all {filingsTotal} filing
            {filingsTotal === 1 ? "" : "s"}
            {nextForms.length > 0
              ? `, followed by ${nextForms.join(" and ")}`
              : ""}
            .
          </p>
        ) : null}
        <p>{character}</p>
        <p className="text-body-sm text-dim">
          All figures are indexed directly from SEC EDGAR and update as new filings
          are disclosed. Use the filer and form lists below to open any original
          document.
        </p>
      </div>
    </section>
  );
}
