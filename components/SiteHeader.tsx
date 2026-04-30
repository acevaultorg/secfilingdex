import Link from "next/link";

/**
 * SecFilingDex header — mobile-first.
 * Logo mark = stylized indexed filing (matches app/icon.svg + apple-icon).
 * Mark + wordmark on every viewport; tagline only on ≥sm.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link
          href="/"
          aria-label="SecFilingDex — home"
          className="flex items-center gap-2.5 group min-w-0"
        >
          <Logo />
          <span className="font-mono text-brand text-heading-3 tracking-tight whitespace-nowrap">
            SecFilingDex
          </span>
          <span className="text-eyebrow text-dim hidden md:inline whitespace-nowrap">
            EDGAR&apos;s database, modernized
          </span>
        </Link>
        <nav className="flex items-center gap-5 sm:gap-6 text-body-sm shrink-0">
          <Link
            href="/about"
            className="text-muted hover:text-text transition-colors py-2"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-muted hover:text-text transition-colors py-2"
          >
            Contact
          </Link>
          <Link
            href="https://www.sec.gov/edgar"
            className="text-dim hover:text-text transition-colors py-2 hidden sm:inline"
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

/** Inline-SVG logo mark — single source of truth shared with app/icon.svg + apple-icon. */
function Logo() {
  return (
    <svg
      viewBox="0 0 64 64"
      width="28"
      height="28"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="2" y="2" width="60" height="60" rx="10" fill="#0b1020" />
      <path
        d="M16 14 H44 L52 22 V50 A2 2 0 0 1 50 52 H16 A2 2 0 0 1 14 50 V16 A2 2 0 0 1 16 14 Z"
        fill="#121a30"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      <path
        d="M44 14 V20 A2 2 0 0 0 46 22 H52"
        stroke="#3b82f6"
        strokeWidth="2"
        fill="none"
      />
      <rect x="20" y="28" width="22" height="3" rx="1.5" fill="#3b82f6" />
      <rect
        x="20"
        y="36"
        width="26"
        height="2"
        rx="1"
        fill="#9aa6c2"
        opacity="0.7"
      />
      <rect
        x="20"
        y="42"
        width="18"
        height="2"
        rx="1"
        fill="#9aa6c2"
        opacity="0.5"
      />
    </svg>
  );
}
