import Link from "next/link";
import type { FilingRecord } from "@/lib/types";
import { formatDateShort, pickEnrichments } from "@/lib/format";

/**
 * Above-the-fold live filing list for /learn/[slug] pages.
 *
 * Fixes the definitional zero-click trap (ai-citation-channel.md): every
 * /learn/[form] title promises the definition of the form, an AI engine
 * answers that from the page's own text, and the reader never clicks. This
 * component promises something a generated answer cannot contain — the
 * actual, current filings — placed above the definition so the click
 * happens before the definitional payoff.
 */
export function LiveFilingsPreview({
  formLabel,
  filings,
  browseHref,
  totalCount,
}: {
  formLabel: string;
  filings: FilingRecord[];
  browseHref: string;
  totalCount: number;
}) {
  if (filings.length === 0) return null;
  return (
    <section className="mb-10 rounded-card-lg border border-border bg-panel/40 overflow-hidden">
      <p className="text-eyebrow text-brand px-5 pt-4">
        Live — the {filings.length} most recent {formLabel} filings
      </p>
      <ul className="divide-y divide-border">
        {filings.map((f) => {
          const { filerName, ticker } = pickEnrichments(f);
          return (
            <li key={f.accessionNumber}>
              <Link
                href={`/filing/${f.accessionNumber}/`}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 px-5 py-3 hover:bg-surface-hover transition-colors"
              >
                <time
                  dateTime={f.filedAt}
                  className="font-mono text-data-cell text-dim sm:w-28 shrink-0 tabular"
                >
                  {formatDateShort(f.filedAt)}
                </time>
                <span className="text-text flex-1 break-words">
                  {filerName}
                  {ticker && (
                    <span className="ml-2 font-mono text-data-cell text-muted">
                      {ticker}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="px-5 py-3 text-body-sm text-muted border-t border-border">
        <Link href={browseHref} className="text-brand hover:underline">
          Browse all {totalCount} indexed {formLabel} filings
        </Link>{" "}
        — updated as new EDGAR submissions are ingested.
      </p>
    </section>
  );
}
