import Link from "next/link";
import { activePartners, PARTNER_DISCLOSURE } from "@/lib/partners";

/**
 * PartnerTools — the dormant activation layer.
 *
 * Renders ABSOLUTELY NOTHING until a NEXT_PUBLIC_AFF_* env var is set: no
 * heading, no empty card, no wrapper element, no whitespace, no layout shift.
 * That is the whole point — it ships today on the highest-intent slot (below
 * the filing header) and costs the page nothing until a program approves.
 *
 * Placement rationale: a reader on /filing/[accession] has just identified a
 * specific document for a specific company. That is the deepest-intent moment
 * on the site — deeper than a form-type explainer, which is generic. The Amazon
 * book shelf (components/FilingsReading) stays where it is on /learn/[form];
 * this is a different surface, not a duplicate of it.
 *
 * Click tracking is NOT wired here. It is a single delegated document listener
 * in components/ClarityTags.tsx keyed on `data-affiliate`, so every affiliate
 * anchor on the site — this box and the Amazon shelf — reports through one
 * code path. See that file for the analytics contract.
 *
 * Server component on purpose: the anchors are plain HTML and the tracking is
 * delegated, so this adds zero client JS.
 */
export function PartnerTools({
  /**
   * Ticker only — deliberately NOT the filer name. On ~48% of filing pages the
   * filer is an individual insider (Form 4/144), so a name-based heading reads
   * as "Go deeper on Johnson KLynne", which is nonsense for a research-tools
   * box and exposes the source data's name mangling. No ticker → generic
   * heading, which is always correct.
   */
  subject,
}: {
  subject?: string;
}) {
  const partners = activePartners();

  // Dormant: render nothing. Not an empty fragment wrapping whitespace — null.
  if (partners.length === 0) return null;

  const heading = subject ? `Go deeper on ${subject}` : "Go deeper on this filing";

  return (
    <section
      aria-labelledby="partner-tools-heading"
      className="mb-10 rounded-card-lg border border-border bg-panel/40 p-5 sm:p-6"
    >
      <h2
        id="partner-tools-heading"
        className="text-heading-3 text-text mb-1"
      >
        {heading}
      </h2>
      <p className="text-body-sm text-dim mb-4">
        Independent tools for working through filings like this one.
      </p>

      <ul className="space-y-3">
        {partners.map((p) => (
          <li key={p.slug}>
            <a
              href={p.url}
              target="_blank"
              rel="sponsored nofollow noopener"
              data-affiliate={p.slug}
              className="text-brand hover:underline font-medium break-words"
            >
              {p.label}
            </a>
            <p className="text-body-sm text-muted mt-0.5">{p.note}</p>
          </li>
        ))}
      </ul>

      {/* FTC 16 CFR Part 255 — adjacent to the links, never footer-buried. */}
      <p className="text-caption text-dim mt-4">
        {PARTNER_DISCLOSURE}{" "}
        <Link href="/disclosure/" className="text-brand hover:underline">
          Full affiliate disclosure
        </Link>
        .
      </p>
    </section>
  );
}
