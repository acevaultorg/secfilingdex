import type { Metadata } from "next";
import { LearnArticle } from "@/components/LearnArticle";
import { loadFilingsByFormType } from "@/lib/filings";

const SITE_URL = "https://secfilingdex.com";

export const metadata: Metadata = {
  title: "What is a 6-K filing?",
  description:
    "A 6-K is the interim event report foreign private issuers file with the SEC. It is the foreign-issuer equivalent of an 8-K, used to forward home-country disclosures to U.S. investors. Live filings.",
  alternates: { canonical: `${SITE_URL}/learn/6-k/` },
};

export default function Learn6KPage() {
  const liveCount = loadFilingsByFormType("6-K").length;

  return (
    <LearnArticle
      slug="6-k"
      title="What is a 6-K filing?"
      tldr="A 6-K is the interim event report foreign private issuers file with the SEC to forward material disclosures already made under their home-country rules — the foreign-issuer cousin of an 8-K. It is mandatory whenever the issuer makes a material disclosure abroad, but unlike 8-K it has no fixed deadline beyond 'promptly.'"
      sections={[
        {
          heading: "Who files a 6-K, and when",
          body: (
            <>
              <p>
                A 6-K is filed by a <strong className="text-text">foreign
                private issuer</strong> (FPI) — a non-U.S. company that lists
                securities in the United States, typically via American
                Depositary Receipts (ADRs) on the NYSE or Nasdaq, or as a
                direct listing of common shares. The 6-K obligation is set
                by Rule 13a-16 under the Securities Exchange Act.
              </p>
              <p>
                The filing trigger is straightforward: any time a foreign
                private issuer makes a material disclosure to its home-country
                regulator, its home stock exchange, or its own shareholders,
                it must forward that information to the SEC on Form 6-K.
                There is no enumerated list of trigger events the way 8-K has
                — the test is &ldquo;did the issuer disclose this elsewhere?&rdquo;
                If yes, it goes on a 6-K.
              </p>
              <p>
                The SEC tracks{" "}
                <a href="/form/6-k" className="text-brand hover:underline">
                  {liveCount} 6-K filings
                </a>{" "}
                in our current sample. Volume scales with the number of
                ADR-listed foreign companies — most weeks dozens of 6-Ks land,
                heavier around overseas earnings season (which differs from
                the U.S. calendar).
              </p>
            </>
          ),
        },
        {
          heading: "Who counts as a foreign private issuer",
          body: (
            <>
              <p>
                A company is a foreign private issuer if it is incorporated
                outside the United States and at least one of the following
                holds:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  ≤50% of its outstanding voting securities are held by U.S.
                  residents, OR
                </li>
                <li>
                  more than 50% are held by U.S. residents but{" "}
                  <em>none</em> of: a majority of executive officers /
                  directors are U.S. citizens or residents, more than 50% of
                  assets are located in the U.S., or its business is
                  administered principally from the U.S.
                </li>
              </ul>
              <p>
                Most non-U.S. multinationals — Toyota, ASML, BP, Sony, SAP,
                Novartis — qualify. The classification is re-tested at the
                end of the issuer&rsquo;s second fiscal quarter; if a former
                FPI no longer qualifies, it must move to the U.S. domestic
                filing regime (10-K, 10-Q, 8-K) the following fiscal year.
                The reverse move is also possible but rare.
              </p>
            </>
          ),
        },
        {
          heading: "6-K vs. 8-K — the key differences",
          body: (
            <>
              <p>
                Both serve as interim event reports. The differences are
                significant for anyone reading filings:
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 pr-4 font-medium">Aspect</th>
                      <th className="py-2 pr-4 font-medium">6-K (FPI)</th>
                      <th className="py-2 font-medium">8-K (U.S. issuer)</th>
                    </tr>
                  </thead>
                  <tbody className="text-text-muted">
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4">Deadline</td>
                      <td className="py-2 pr-4">&ldquo;Promptly&rdquo; after home-country disclosure</td>
                      <td className="py-2">4 business days (most items)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4">Trigger list</td>
                      <td className="py-2 pr-4">Anything disclosed abroad</td>
                      <td className="py-2">~30 enumerated items (1.01, 2.01, 5.02, etc.)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4">Format</td>
                      <td className="py-2 pr-4">Cover page + native-language attachment usually permitted</td>
                      <td className="py-2">English, structured SEC items</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4">Earnings reports</td>
                      <td className="py-2 pr-4">Often filed via 6-K (semi-annual or quarterly per home jurisdiction)</td>
                      <td className="py-2">8-K item 2.02; full 10-Q separately</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Filer regime</td>
                      <td className="py-2 pr-4">Form 20-F annual baseline</td>
                      <td className="py-2">10-K annual baseline</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                The most practical implication for U.S. investors: a foreign
                private issuer&rsquo;s earnings release usually arrives on a
                6-K, not on a separate earnings 8-K. If you&rsquo;re tracking
                an ADR&rsquo;s quarterly results, 6-K is the form to watch.
              </p>
            </>
          ),
        },
        {
          heading: "What's typically inside a 6-K",
          body: (
            <>
              <p>
                The content varies because the underlying triggers vary.
                Common categories:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">Interim financials</strong> —
                  half-year reports for European issuers (most common), or
                  quarterly reports for Asian / dual-listed issuers
                </li>
                <li>
                  <strong className="text-text">Press releases</strong> —
                  material announcements like M&amp;A activity, leadership
                  changes, dividend declarations, share repurchases
                </li>
                <li>
                  <strong className="text-text">Home-country regulatory filings</strong>{" "}
                  — translated or English-language versions of disclosures
                  to home-country regulators (e.g., AFM in Netherlands, FCA in UK,
                  CONSOB in Italy)
                </li>
                <li>
                  <strong className="text-text">Shareholder meeting materials</strong>{" "}
                  — AGM notices, proxy statements (the FPI equivalent of a
                  DEF 14A), and voting results
                </li>
                <li>
                  <strong className="text-text">Annual report attachment</strong> —
                  some FPIs file their home-country annual report on a 6-K
                  shortly before or alongside the formal 20-F filing
                </li>
              </ul>
              <p>
                Attachments often arrive as PDFs because the home-country
                regulator&rsquo;s submission was a PDF; SecFilingDex preserves
                the original attachment so you can cross-check against the
                home-country disclosure.
              </p>
            </>
          ),
        },
        {
          heading: "Reading 6-Ks well",
          body: (
            <>
              <p>
                Three practical rules:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong className="text-text">Cross-reference with the home market.</strong>{" "}
                  A 6-K is a wrapper around a home-country disclosure.
                  Whatever moves the stock often moves it first on the home
                  exchange (Frankfurt, Amsterdam, Tokyo, Hong Kong, London).
                  The U.S. session may already be reacting by the time the
                  6-K hits EDGAR. The 6-K timestamp is a useful audit trail,
                  but it is not the news arriving.
                </li>
                <li>
                  <strong className="text-text">Watch the cadence.</strong> A
                  foreign private issuer that suddenly files 4-5 6-Ks in a
                  month is usually mid-event — earnings + commentary + M&amp;A
                  + governance + index change. Single-6-K weeks are routine;
                  bursts are signal.
                </li>
                <li>
                  <strong className="text-text">Read the 20-F first.</strong> The
                  annual 20-F is the issuer&rsquo;s comprehensive disclosure;
                  6-Ks are interim updates that assume context from the 20-F.
                  Without the 20-F as baseline, a 6-K is hard to anchor.
                  Companies with comprehensive 20-Fs (ASML, Toyota, Novartis,
                  Roche) are the easiest FPIs to follow via 6-Ks.
                </li>
              </ol>
            </>
          ),
        },
        {
          heading: "Companies to watch",
          body: (
            <>
              <p>
                The 6-K is the workhorse filing for any foreign private
                issuer listing in the U.S. Most-followed examples by sector:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">Semiconductors:</strong> ASML
                  (Netherlands), TSMC (Taiwan), Tokyo Electron (Japan via ADR)
                </li>
                <li>
                  <strong className="text-text">Pharma:</strong> Novartis (Switzerland),
                  Roche (Switzerland), Novo Nordisk (Denmark), AstraZeneca (UK)
                </li>
                <li>
                  <strong className="text-text">Energy:</strong> Shell (UK),
                  BP (UK), TotalEnergies (France), Equinor (Norway)
                </li>
                <li>
                  <strong className="text-text">Tech &amp; consumer:</strong> SAP
                  (Germany), Sony (Japan), Toyota (Japan), Spotify (Sweden),
                  Alibaba (Cayman / China-listed)
                </li>
                <li>
                  <strong className="text-text">Banks:</strong> HSBC (UK),
                  UBS (Switzerland), Barclays (UK), ING (Netherlands)
                </li>
              </ul>
              <p>
                Each of these files dozens of 6-Ks per year, plus an annual
                20-F. The cadence is a useful proxy for the company&rsquo;s
                investor-disclosure tempo.
              </p>
            </>
          ),
        },
        {
          heading: "Related forms",
          body: (
            <>
              <p>
                The foreign-private-issuer disclosure regime sits parallel
                to the U.S. domestic regime:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong className="text-text">20-F</strong> — annual report
                  (FPI equivalent of 10-K). See{" "}
                  <a href="/learn/20-f/" className="text-brand hover:underline">
                    What is a 20-F filing?
                  </a>
                </li>
                <li>
                  <strong className="text-text">F-1</strong> — registration
                  statement for FPI securities offerings (cousin of S-1)
                </li>
                <li>
                  <strong className="text-text">F-3</strong> — short-form FPI
                  registration (cousin of S-3)
                </li>
                <li>
                  <strong className="text-text">SC 13G / 13D</strong> — passive
                  / activist beneficial-ownership disclosures still apply to
                  FPI-issued securities. See{" "}
                  <a href="/learn/13d-vs-13g/" className="text-brand hover:underline">
                    13D vs. 13G — what the distinction means
                  </a>
                </li>
              </ul>
              <p>
                Some FPIs voluntarily file additional U.S. domestic forms
                (8-K, 10-K) to signal greater alignment with U.S. disclosure
                norms. This is uncommon but happens when a foreign company
                wants its U.S. investors to receive the more granular U.S.
                cadence.
              </p>
            </>
          ),
        },
        {
          heading: "Our view",
          body: (
            <>
              <p>
                6-K is the most under-read filing in EDGAR. ADR investors
                often watch only the annual 20-F and miss the interim
                cadence; the 6-K is where M&amp;A intent, dividend signals,
                and management changes land first. A foreign private issuer
                that hasn&rsquo;t filed a 6-K in 90 days is unusual and
                worth investigating; a flurry of them is usually a real
                event.
              </p>
              <p>
                For non-U.S. institutional investors familiar with home-country
                disclosure regimes, 6-Ks are mostly review. For U.S.
                investors holding ADRs, they&rsquo;re the primary current-events
                channel. SecFilingDex&rsquo;s 6-K coverage is{" "}
                <a href="/form/6-k" className="text-brand hover:underline">
                  here
                </a>{" "}
                — sorted by recency, filer, and home jurisdiction.
              </p>
            </>
          ),
        },
      ]}
      ourView="6-K is the foreign-issuer cousin of 8-K but with looser timing and a different center of gravity. The trigger is home-country disclosure parity, not a U.S. enumerated event list — which means a 6-K stream often reads like a translated press-release feed from Tokyo, Frankfurt, or Shanghai. For ADR investors it is the primary current-events channel; for everyone else it is the cleanest window into how non-U.S. issuers actually communicate with their primary markets."
      liveDataLink={{
        label: "Browse live 6-K filings",
        href: "/form/6-k",
        count: liveCount,
      }}
      related={[
        { slug: "20-f", title: "What is a 20-F filing?" },
        { slug: "8-k", title: "What is an 8-K filing?" },
        { slug: "10-k", title: "What is a 10-K filing?" },
      ]}
      externalRelated={[
        {
          href: "https://holdlens.com/",
          label: "HoldLens: Smart-money signals across 30 tracked superinvestors",
          description:
            "6-K events on foreign issuers — HoldLens tracks superinvestor exposure to these names.",
        },
      ]}
      definedTerms={[
        {
          term: "6-K",
          description:
            "Interim event report filed by foreign private issuers under Exchange Act Rule 13a-16. Forwards material disclosures the issuer made under home-country rules to U.S. investors.",
        },
        {
          term: "Foreign Private Issuer (FPI)",
          description:
            "Non-U.S. company listing securities in the United States. Eligible for the FPI reporting regime (20-F annual + 6-K interim) instead of the domestic 10-K / 10-Q / 8-K regime.",
        },
        {
          term: "American Depositary Receipt (ADR)",
          description:
            "U.S.-traded certificate representing shares of a foreign company. ADR sponsors are typically the foreign issuer themselves and file 20-F + 6-K on the underlying shares.",
        },
        {
          term: "Rule 13a-16",
          description:
            "SEC rule under the Exchange Act establishing the 6-K reporting obligation: FPIs must furnish to the SEC, on Form 6-K, any material information they make public under home-country rules.",
        },
      ]}
    />
  );
}
