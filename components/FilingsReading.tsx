import {
  AUDIBLE_TRIAL_URL,
  FILINGS_READING,
  FTC_DISCLOSURE,
  amazonUrl,
} from "@/lib/books";

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
              // Read by the delegated listener in ClarityTags → fires
              // affiliate_click on Clarity + GA4. `data-event` above was never
              // wired to anything; this attribute is what actually reports.
              data-affiliate="amazon-book"
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

      {/* Audible trial. Placed after the list because it is an alternative
          format for the same references, not a separate pitch — a filings
          reader commutes too. Factual framing only: no advice, no verdicts,
          no claim about outcomes (this is a finance site; see the YMYL note
          in lib/books.ts). */}
      <p className="mt-4">
        <a
          href={AUDIBLE_TRIAL_URL}
          target="_blank"
          rel="sponsored nofollow noopener"
          data-event="amazon_click"
          // Separate slug from the book links: the flat Audible trial bounty is
          // worth far more per conversion than a book commission, so it has to
          // be attributable on its own in Clarity/GA4.
          data-affiliate="amazon-audible"
          data-book="Audible trial"
          className="text-brand hover:underline font-medium"
        >
          Several of these are on Audible — free trial
        </a>
        <span className="text-muted text-sm">
          {" "}
          — Graham and Fridson both read well as audio if you are commuting.
        </span>
      </p>

      <p className="text-muted text-xs mt-4">{FTC_DISCLOSURE}</p>
    </section>
  );
}
