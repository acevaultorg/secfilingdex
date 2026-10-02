import Link from "next/link";

export function SiteFooter({}: { books?: boolean }) {
  return (
    <>
    {/* The research-book text block is replaced by the Amili Kit billboard (kit/amazon-ad-inject.mjs: live Amazon image + price). Paulo mur0hlgg8hx3u6 */}
    <footer className="border-t border-border mt-24 py-10 text-body-sm text-dim">
      <div className="max-w-6xl mx-auto px-6 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="font-mono text-muted mb-2">SecFilingDex</p>
          <p className="text-body-sm">
            Recent SEC filings, explained in plain English, linked to the
            original on EDGAR.
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-muted mb-2">Site</p>
          <Link href="/about" className="block hover:text-text transition-colors">
            About
          </Link>
          <Link href="/contact" className="block hover:text-text transition-colors">
            Contact
          </Link>
          <Link href="/partners" className="block hover:text-text transition-colors">
            Partners
          </Link>
          <Link href="/about/#api" className="block hover:text-text transition-colors">
            API (JSON)
          </Link>
          <Link href="/disclosure" className="block hover:text-text transition-colors">
            Affiliate Disclosure
          </Link>
          <Link href="/privacy" className="block hover:text-text transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="block hover:text-text transition-colors">
            Terms
          </Link>
        </div>
        <div className="space-y-1">
          <p className="text-muted mb-2">Source</p>
          <Link
            href="https://www.sec.gov/edgar"
            className="block hover:text-text transition-colors"
            target="_blank"
            rel="noopener"
          >
            SEC EDGAR ↗
          </Link>
          <p className="text-caption text-dim mt-2">
            U.S. government works are public domain (17 U.S.C. § 105). SEC
            filings republished with provenance + accession-level citation.
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between gap-2 text-caption">
        <p>
          © {new Date().getFullYear()} SecFilingDex. Not affiliated with the U.S. SEC. Published
          by{" "}
          <a href="https://caslonmedia.com/" className="underline hover:text-text">
            Caslon Media
          </a>
          , Amsterdam.
        </p>
        <p className="font-mono">
          Data source:{" "}
          <Link
            href="https://www.sec.gov/edgar"
            className="hover:text-text"
            target="_blank"
            rel="noopener"
          >
            sec.gov/edgar
          </Link>
        </p>
      </div>
      <p className="max-w-6xl mx-auto px-6 mt-4 text-caption">
        Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.
      </p>
    </footer>
    </>
  );
}
