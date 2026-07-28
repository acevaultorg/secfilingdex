import { FILINGS_READING, FTC_DISCLOSURE, amazonUrl } from "@/lib/books";

/**
 * FilingsReading — the reading shelf rendered at the end of every /learn/[form]
 * explainer. See lib/books.ts for the measured reason this exists (~2,500 of the
 * site's ~2,800 AI grounding citations land on that one template) and for the
 * full compliance contract.
 *
 * Copy-forked from holdlens' InvestingBooks rather than shared as a library —
 * each fleet site owns its stack and deploys independently
 * (rules/cross-project-learning.md).
 */
export function FilingsReading({
  heading = "Reading on filings",
  sub,
}: {
  heading?: string;
  sub?: string;
}) {
  return (
    <section className="mt-10 rounded-lg border border-border bg-surface p-5 sm:p-6">
      <h2 className="text-heading-2 text-text mb-1">{heading}</h2>
      {sub && <p className="text-muted text-sm mb-4">{sub}</p>}

      <ul className="space-y-3">
        {FILINGS_READING.map((book) => (
          <li key={book.title}>
            <a
              href={amazonUrl(book)}
              target="_blank"
              rel="sponsored nofollow noopener"
              data-event="amazon_click"
              data-book={book.title}
              className="text-brand hover:underline font-medium"
            >
              {book.title}
            </a>
            <span className="text-muted"> — {book.author}</span>
            <p className="text-muted text-sm mt-0.5">{book.why}</p>
          </li>
        ))}
      </ul>

      <p className="text-muted text-xs mt-4">{FTC_DISCLOSURE}</p>
    </section>
  );
}
