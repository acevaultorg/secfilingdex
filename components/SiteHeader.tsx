import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-mono text-brand text-heading-3 tracking-tight">
            SecFilingDex
          </span>
          <span className="text-eyebrow text-dim hidden sm:inline">
            EDGAR&apos;s database, modernized
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-body-sm">
          <Link href="/about" className="text-muted hover:text-text transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-muted hover:text-text transition-colors">
            Contact
          </Link>
          <Link
            href="https://www.sec.gov/edgar"
            className="text-dim hover:text-text transition-colors hidden sm:inline"
            target="_blank"
            rel="noopener"
          >
            EDGAR ↗
          </Link>
        </nav>
      </div>
    </header>
  );
}
