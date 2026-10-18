import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

// 2026-10-18 (card mvdxfqcfqe2fen): Next's default 404 has no <main>, so any lastmod / re-date check that hashes <main>
// fell back to the whole document and counted Kit script changes in <head> as a content change. A real <main> keeps the
// 404 measured like every other page. Same header and footer as the rest of the site.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
        <p className="text-eyebrow text-brand mb-4">404</p>
        <h1 className="text-display-2 mb-3">Page not found</h1>
        <p className="text-body-lg text-muted mb-8">
          This page does not exist or has moved. Search the filings from the home page.
        </p>
        <Link href="/" className="text-brand underline underline-offset-4">
          Go to SecFilingDex
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
