import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SITE_URL = "https://secfilingdex.com";

export type LearnSection = {
  heading: string;
  body: React.ReactNode;
};

export type DefinedTermEntry = {
  term: string;
  description: string;
};

export type LearnArticleProps = {
  slug: string;
  title: string;
  /** ≤160 chars; quote-ready single sentence; appears as TL;DR + meta description. */
  tldr: string;
  /** Section narrative — quote-ready H2 + body. Order matters for sitemap-ai priority. */
  sections: LearnSection[];
  /** "Our view:" sentence — explicit POV for Aleyda 10-characteristic checklist (Differentiated). */
  ourView: string;
  /** Cross-link to the corresponding /form/[formType] hub. Optional for comparison-style pages. */
  liveDataLink?: { label: string; href: string; count?: number };
  /** Sibling /learn topics for hub-spoke compounding. */
  related: { slug: string; title: string }[];
  /** Sister-property cross-links (e.g., HoldLens applied-analysis pages for the same SEC corpus).
   * Used for LLM-citation 10-char #6 (Corroborated) + brand-family signal. */
  externalRelated?: { href: string; label: string; description: string }[];
  /** DefinedTerm entries for schema saturation. */
  definedTerms: DefinedTermEntry[];
  /** ISO date for `dateModified`. Defaults to today. */
  dateModified?: string;
};

export function LearnArticle({
  slug,
  title,
  tldr,
  sections,
  ourView,
  liveDataLink,
  related,
  externalRelated,
  definedTerms,
  dateModified,
}: LearnArticleProps) {
  const today = (dateModified ?? new Date().toISOString().slice(0, 10));
  const url = `${SITE_URL}/learn/${slug}/`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: tldr,
    url,
    datePublished: "2026-05-01",
    dateModified: today,
    author: {
      "@type": "Person",
      name: "Paulo de Vries",
      url: `${SITE_URL}/about/`,
    },
    publisher: {
      "@type": "Organization",
      name: "SecFilingDex",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: {
      "@type": "CollectionPage",
      name: "SEC Filings Explained",
      url: `${SITE_URL}/learn/`,
    },
    inLanguage: "en-US",
  };

  const definedTermSchema = definedTerms.map((dt) => ({
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: dt.term,
    description: dt.description,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "SEC Filings Glossary",
      url: `${SITE_URL}/learn/`,
    },
  }));

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
        <p className="text-eyebrow text-brand mb-4">
          <Link href="/learn/" className="hover:text-text transition-colors">
            Learn
          </Link>{" "}
          / {slug}
        </p>
        <h1 className="text-display-2 mb-3">{title}</h1>
        <p className="text-body text-muted mb-2">{tldr}</p>
        <p className="text-body-sm text-dim mb-10">
          Last updated: {today}. Source:{" "}
          <Link
            href="https://www.sec.gov/edgar"
            target="_blank"
            rel="noopener"
            className="underline decoration-border hover:decoration-text hover:text-text transition-colors"
          >
            SEC EDGAR
          </Link>
          .
        </p>

        <div className="prose-content space-y-8 text-body text-muted">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-heading-2 text-text mb-3">{s.heading}</h2>
              <div className="space-y-3">{s.body}</div>
            </section>
          ))}

          <section className="rounded-card border border-brand-soft bg-surface-brand px-5 py-4">
            <h2 className="text-heading-3 text-brand mb-2">Our view</h2>
            <p className="text-body text-text">{ourView}</p>
          </section>

          {liveDataLink && (
            <section>
              <h2 className="text-heading-2 text-text mb-3">See live data</h2>
              <p>
                <Link
                  href={liveDataLink.href}
                  className="text-brand hover:underline"
                >
                  {liveDataLink.label}
                </Link>
                {liveDataLink.count != null && (
                  <span className="text-dim font-mono">
                    {" "}
                    — {liveDataLink.count} filings indexed
                  </span>
                )}
                . Updated as new EDGAR submissions are ingested.
              </p>
            </section>
          )}

          {related.length > 0 && (
            <section>
              <h2 className="text-heading-2 text-text mb-3">Related</h2>
              <ul className="list-disc pl-6 space-y-1.5">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/learn/${r.slug}/`}
                      className="text-brand hover:underline"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {externalRelated && externalRelated.length > 0 && (
            <section>
              <h2 className="text-heading-2 text-text mb-3">
                Sister-property applied analysis
              </h2>
              <p className="text-muted mb-3 text-sm">
                SecFilingDex catalogs the filings. For applied analysis on the
                same SEC corpus — narrowed to tracked superinvestors with
                framework + POV — see the sister site:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                {externalRelated.map((ext) => (
                  <li key={ext.href}>
                    <a
                      href={ext.href}
                      className="text-brand hover:underline"
                      rel="noopener"
                    >
                      {ext.label}
                    </a>
                    <span className="text-muted"> — {ext.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {definedTerms.length > 0 && (
            <section>
              <h2 className="text-heading-2 text-text mb-3">Glossary</h2>
              <dl className="space-y-3">
                {definedTerms.map((dt) => (
                  <div key={dt.term}>
                    <dt className="text-text font-medium">{dt.term}</dt>
                    <dd className="text-muted">{dt.description}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        {definedTermSchema.map((s, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
          />
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
