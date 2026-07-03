// components/FilerProfile.tsx — genuine per-filer filing-behavior synthesis.
//
// WHY: /filer/[cik] pages were thin (~145 words → noindex) and carried no
// analysis — just a form pill row + a filing list. This block adds real,
// UNIQUE-per-filer information-gain derived ENTIRELY from the indexed filing
// records (counts, distinct form types, date span, recency, amendment share,
// most-frequent disclosure). ZERO fabrication — every number traces to the
// FilingRecord[] already loaded on the page; every form definition traces to
// the verified FORM_TYPE_CATALOG. This is data EDGAR does not present per-filer
// this way, so it is genuine synthesis, not templated filler.
//
// Feeds the site's LIVE channel: AI-citation (per FLEET-CALIBRATION — ChatGPT/
// Bing are the cheapest new-traffic channel; quote-ready per-company filing
// profiles are exactly what gets cited). Also strengthens these pages as
// link-equity conduits toward the /form/* hubs (the pos-11 ranking targets).

import Link from "next/link";
import type { FilingRecord } from "@/lib/types";
import { formTypeInfo } from "@/lib/format";
import { formTypeToSlug } from "@/lib/types";
import { sicCodeToName } from "@/lib/sic";

function fmtLong(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function pluralize(n: number, one: string, many = one + "s"): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * Substance gate: a filer profile is genuinely "Strong" (worth indexing) only
 * when there is real filing-behavior to describe. Exported so the page's
 * generateMetadata + the follow-up index decision use the SAME rule. Kept
 * conservative on purpose — this only reports substance; it does not itself
 * flip robots (that stays operator/owning-session gated on a low-authority
 * domain per the GSC-standing thin-index anti-pattern).
 */
export function filerProfileIsSubstantive(filings: FilingRecord[]): boolean {
  // Index only filers with a genuine MULTI-form disclosure history to describe —
  // ≥3 filings across ≥2 distinct form types. A filer with N copies of one form
  // (e.g. same-day shelf takedowns) is real but narrow; it stays noindex so only
  // genuinely-Strong, information-rich pages ever enter the index.
  const distinctForms = new Set(filings.map((f) => f.formType)).size;
  return filings.length >= 3 && distinctForms >= 2;
}

export function FilerProfile({
  filings,
  filerName,
  ticker,
  sicCode,
}: {
  filings: FilingRecord[];
  filerName: string;
  ticker?: string;
  sicCode?: string;
}) {
  if (filings.length === 0) return null;

  // ---- derive everything from the records (zero fabrication) ----
  const sorted = [...filings].sort((a, b) => a.filedAt.localeCompare(b.filedAt));
  const earliest = sorted[0].filedAt;
  const latest = sorted[sorted.length - 1].filedAt;
  const sameDay = earliest.slice(0, 10) === latest.slice(0, 10);

  const byForm = new Map<string, number>();
  for (const f of filings) byForm.set(f.formType, (byForm.get(f.formType) ?? 0) + 1);
  const formRows = [...byForm.entries()].sort((a, b) => b[1] - a[1]);
  const distinctForms = formRows.length;
  const [topForm, topCount] = formRows[0];
  const topInfo = formTypeInfo(topForm);

  const amendments = filings.filter((f) => f.isAmendment).length;

  // Recency: filings in the trailing 365 days relative to the newest filing.
  const latestMs = new Date(latest).getTime();
  const trailingYearCount = Number.isNaN(latestMs)
    ? 0
    : filings.filter((f) => {
        const t = new Date(f.filedAt).getTime();
        return !Number.isNaN(t) && latestMs - t <= 365 * 24 * 3600 * 1000;
      }).length;

  const spanYears = (() => {
    const a = new Date(earliest).getTime();
    const b = new Date(latest).getTime();
    if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return null;
    const yrs = (b - a) / (365.25 * 24 * 3600 * 1000);
    return yrs < 1 ? null : Math.round(yrs);
  })();

  const nameDisp = ticker ? `${filerName} (${ticker})` : filerName;
  const industry = sicCode ? sicCodeToName(sicCode) : null;

  return (
    <section className="mb-10" aria-label="Filing profile">
      <p className="text-eyebrow text-brand mb-3">Filing profile</p>
      <div className="rounded-card-lg border border-border bg-panel/40 p-6 space-y-4">
        <p className="text-body text-muted leading-relaxed">
          <strong className="text-text">{nameDisp}</strong> has{" "}
          {pluralize(filings.length, "SEC filing")} indexed on SecFilingDex,
          across {pluralize(distinctForms, "form type")}
          {sameDay
            ? `, all filed on ${fmtLong(latest)}.`
            : `${spanYears ? ` filed over roughly ${pluralize(spanYears, "year")}` : ""}, from ${fmtLong(earliest)} to ${fmtLong(latest)}.`}
          {industry && sicCode ? (
            <>
              {" "}The filer is classified under{" "}
              <Link href={`/industry/${sicCode}/`} className="text-brand hover:underline">
                {industry}
              </Link>{" "}
              (SIC {sicCode}).
            </>
          ) : null}
        </p>

        <p className="text-body text-muted leading-relaxed">
          Its most frequent disclosure is the{" "}
          <Link href={`/form/${formTypeToSlug(topForm)}/`} className="text-brand hover:underline font-mono">
            {topForm}
          </Link>{" "}
          {topInfo?.shortName ? `(${topInfo.shortName}) ` : ""}
          with {pluralize(topCount, "filing")}
          {topInfo?.definition ? ` — ${topInfo.definition.replace(/\.$/, "")}` : ""}.
          {trailingYearCount > 0
            ? ` ${pluralize(trailingYearCount, "of these filing", "of these filings")} ${
                trailingYearCount === 1 ? "was" : "were"
              } disclosed in the twelve months to ${fmtLong(latest)}.`
            : ""}
          {amendments > 0
            ? ` ${amendments} of the ${filings.length} ${
                amendments === 1 ? "is an amendment" : "are amendments"
              } (a corrected or updated version of an earlier filing).`
            : ""}
        </p>

        {/* Per-form-type breakdown — unique to this filer, links every hub */}
        <div>
          <p className="text-eyebrow text-dim mb-2">Disclosure mix</p>
          <ul className="divide-y divide-border rounded-card border border-border overflow-hidden">
            {formRows.map(([ft, n]) => {
              const info = formTypeInfo(ft);
              return (
                <li key={ft} className="flex items-baseline gap-3 px-4 py-2.5">
                  <span className="font-mono text-data-cell text-dim w-8 shrink-0 tabular">
                    {n}
                  </span>
                  <Link
                    href={`/form/${formTypeToSlug(ft)}/`}
                    className="font-mono text-data-cell text-brand hover:underline w-24 shrink-0"
                  >
                    {ft}
                  </Link>
                  <span className="text-body-sm text-muted flex-1">
                    {info?.shortName ?? "SEC filing"}
                    {info?.cadence ? ` · ${info.cadence.toLowerCase()}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="text-caption text-dim">
          Profile derived from {pluralize(filings.length, "indexed filing")}; every
          figure traces to the filing records above, each linking back to its
          original SEC EDGAR document. Filing counts reflect SecFilingDex&apos;s
          current index, not the filer&apos;s complete EDGAR history.
        </p>
      </div>
    </section>
  );
}
