/**
 * Partner registry — dormant-by-default affiliate slots.
 *
 * PURPOSE: the day a program approves, going live is a one-env-var change.
 * No code edit, no PR, no review cycle — set the variable in the Cloudflare
 * Pages dashboard, redeploy, done.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * CRITICAL — why every URL below is a LITERAL `process.env.NEXT_PUBLIC_AFF_*`
 *
 * This site is `output: 'export'` (static). Next.js inlines NEXT_PUBLIC_* vars
 * at BUILD time by *textual substitution* of the exact source expression. A
 * computed lookup —
 *     process.env[`NEXT_PUBLIC_AFF_${slug}`]      ← DOES NOT WORK
 * — is never substituted and is `undefined` in the browser forever. Every slot
 * therefore has to name its variable literally. Adding a partner means adding a
 * row here, not just setting an env var.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * YMYL GUARDRAIL (non-negotiable — see rules/google-policy-compliance.md):
 * SecFilingDex is a finance reference site with no licensed-advisor credentials.
 * Slots are restricted to TOOLS, DATA and EDUCATION — things a filings reader
 * buys to do their own research. Explicitly NOT permitted here:
 *   · brokerage / "open an account" / funded-account bounties
 *   · anything implying a security is worth buying or selling
 *   · verdict language (BUY / SELL / STRONG / target price / outperform)
 * A brokerage affiliate stack on YMYL filing pages is precisely what produced
 * the HoldLens AdSense "Low value content" rejection. Do not re-create it.
 *
 * COMPLIANCE CONTRACT (mirrors lib/books.ts, which carries the Amazon shelf):
 *   · rel="sponsored nofollow noopener" on every anchor  → enforced in PartnerTools
 *   · FTC disclosure rendered adjacent to the links, not buried in the footer
 *   · NEVER display a price — prices change and cached prices violate programs
 *   · no fake scarcity, no "click to support us", no incentivised clicks
 */

export type PartnerSlot = {
  /** Stable analytics key. Sent as the `partner` property on affiliate_click. */
  slug: string;
  /** Link text. Factual description of the tool — never a recommendation. */
  label: string;
  /** One neutral line on what it is. No outcome claims, no superlatives. */
  note: string;
  /** Literal env read — see the CRITICAL block above. */
  url: string | undefined;
};

const REGISTRY: PartnerSlot[] = [
  {
    slug: "data",
    label: "Filing and market-data tools",
    note: "Bulk EDGAR data, APIs and export tooling for filings research.",
    url: process.env.NEXT_PUBLIC_AFF_DATA,
  },
  {
    slug: "research",
    label: "Research and screening software",
    note: "Screeners and analysis software that read from SEC filings.",
    url: process.env.NEXT_PUBLIC_AFF_RESEARCH,
  },
  {
    slug: "education",
    label: "Financial-statement analysis courses",
    note: "Structured courses on reading 10-Ks, 10-Qs and proxy statements.",
    url: process.env.NEXT_PUBLIC_AFF_EDUCATION,
  },
];

/**
 * The slots that are actually live. Empty until an env var is set, which is why
 * PartnerTools renders nothing at all today.
 *
 * Defensive: an env var present but blank/whitespace (easy to do in a dashboard
 * form) must count as unset, otherwise the box renders with a dead href.
 */
export function activePartners(): PartnerSlot[] {
  return REGISTRY.filter(
    (p) => typeof p.url === "string" && p.url.trim().length > 0
  );
}

/** Disclosure shown adjacent to partner links. Kept generic: it must stay true
 *  no matter which of the slots above is the one that went live. */
export const PARTNER_DISCLOSURE =
  "Some links in this box are affiliate links. If you buy through one, SecFilingDex may earn a commission at no extra cost to you. Filing data on this site is free and never changes based on these links.";
