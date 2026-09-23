import bookCovers from "./book-covers.json";
/**
 * Reading list for filings researchers — Amazon Associates (tag secfilingdex-20).
 *
 * WHY THIS EXISTS (measured, 2026-07-28): Bing WMT "AI Performance" shows
 * secfilingdex carries ~2,800 Copilot/ChatGPT grounding citations in 3 months,
 * and ~2,500 of them land on ONE template — /learn/[form]/:
 *     /learn/11-k/ 524 · /learn/s-1/ 378 · /learn/20-f/ 358 · /learn/13d-vs-13g/ 313
 *     /learn/10-k/ 227 · /learn/n-px/ 199 · /learn/s-3/ 135 · /learn/13h/ 110 …
 * The site holds 56.52% citation share on "what is an 11-k" and 47.59% on
 * "SEC Form 13H large trader rule" — i.e. it is the majority source AI engines
 * cite for SEC-form explainers — and carried ZERO monetization. This module is
 * the same ship that ran on holdlens.com/leaderboard on 2026-07-27.
 *
 * COMPLIANCE (Amazon Associates + Google policy — all non-negotiable):
 *  · per-site tag secfilingdex-20 (never the global074-20 account catch-all,
 *    which pools attribution across the fleet and hides which site earned)
 *  · rel="sponsored nofollow noopener" on every anchor
 *  · FTC disclosure rendered adjacent to the links, not buried in a footer
 *  · NEVER display a price — Amazon prices change and cached prices are a
 *    program violation
 *  · YMYL: secfilingdex is a finance reference. These are BOOKS, described
 *    factually. No verdict labels, no buy/sell language, no broker CTAs, no
 *    implication of investment advice — that framing is exactly what triggered
 *    the HoldLens AdSense rejection (see rules/google-policy-compliance.md).
 *
 * AUDIBLE BOUNTY: the flat trial bounty is worth far more per conversion than
 * a book commission, so it belongs on the most-cited template. The URL below is
 * operator SiteStripe output, copied VERBATIM — including the `_r=1` that
 * Amazon itself echoed into it. Do not tidy that parameter away: the linkId is
 * issued against this exact string, and hand-editing a SiteStripe link is what
 * silently zeroed readminute's bounty attribution (found 2026-07-27). If the
 * link ever needs changing, regenerate it in SiteStripe under secfilingdex-20
 * rather than editing this line.
 */

/** Audible free-trial bounty — SiteStripe output under secfilingdex-20, verbatim. */
export const AUDIBLE_TRIAL_URL =
  "https://www.amazon.com/hz/audible/arya/mlp?purchaseType=MTRIAL&_r=1&linkCode=ll2&tag=secfilingdex-20&linkId=429c6ed87c263b92e2729cea179bc999&language=en_US&ref_=as_li_ss_tl";

const TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "secfilingdex-20";

export type Book = {
  /** ISBN-13 when verified → converts to ISBN-10, which IS the ASIN for most
   *  print books, giving a direct product link. null → tagged title+author
   *  search, which always resolves (no dead-ASIN risk) and is still attributed. */
  isbn13: string | null;
  title: string;
  author: string;
  /** One line on why THIS reader — someone reading an SEC form explainer —
   *  would want it. Written to be useful, not to sell. */
  why: string;
  /**
   * ASIN whose cover is shown beside the title (design pass 2026-09-23). Image
   * and detail URL come from the Amazon Creators API at build time
   * (scripts/fetch-book-covers.mjs → lib/book-covers.json). The title link and
   * amazonUrl() are unchanged; the cover links to the API's own detail URL.
   */
  coverAsin?: string;
};

/** ISBN-13 (978 prefix) → ISBN-10. ISBN-10 === ASIN for most print books. */
function isbn13to10(isbn13: string): string | null {
  if (isbn13.length !== 13 || !isbn13.startsWith("978")) return null;
  const core = isbn13.slice(3, 12);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (10 - i) * parseInt(core[i]!, 10);
  const check = (11 - (sum % 11)) % 11;
  return core + (check === 10 ? "X" : String(check));
}

/** Resolve a book to its best affiliate-tagged Amazon URL. */
export function amazonUrl(book: Book): string {
  const asin = book.isbn13 ? isbn13to10(book.isbn13) : null;
  if (asin) return `https://www.amazon.com/dp/${asin}?tag=${TAG}`;
  const q = encodeURIComponent(`${book.title} ${book.author}`);
  return `https://www.amazon.com/s?k=${q}&i=stripbooks&tag=${TAG}`;
}

/** The filings-research shelf. Chosen for one test: does it help someone who
 *  just looked up what a form IS actually read one? Nothing here is a market
 *  call or a strategy pitch. */
export const FILINGS_READING: Book[] = [
  {
    isbn13: "9780071592536",
    title: "Security Analysis",
    coverAsin: "0071592539",
    author: "Benjamin Graham & David Dodd",
    why: "The reference on reading a filing and valuing what is inside it. Dense, and still the book the rest cite.",
  },
  {
    isbn13: null,
    title: "Financial Shenanigans",
    coverAsin: "126011726X",
    author: "Howard M. Schilit",
    why: "How accounting manipulation actually shows up in disclosures — written around real filings and what gave them away.",
  },
  {
    isbn13: null,
    title: "Financial Statement Analysis",
    coverAsin: "1119457149",
    author: "Martin S. Fridson & Fernando Alvarez",
    why: "A working guide to the statements inside a 10-K or 20-F, including where the notes matter more than the headline numbers.",
  },
  {
    isbn13: "9780060555665",
    title: "The Intelligent Investor",
    coverAsin: "0060555661",
    author: "Benjamin Graham",
    why: "The plain-language starting point if the filings are new to you and the vocabulary is the obstacle.",
  },
  {
    isbn13: null,
    title: "The Essays of Warren Buffett",
    coverAsin: "0966446143",
    author: "Lawrence A. Cunningham (ed.)",
    why: "Shareholder letters organised by theme — a filer's own account of what disclosure is for, from the reporting side.",
  },
];

/** FTC-compliant disclosure. MUST render adjacent to the links. */
export const FTC_DISCLOSURE =
  "Book links go to Amazon. As an Amazon Associate, SecFilingDex earns from qualifying purchases, at no extra cost to you. The filings data on this site is free and never changes based on these links.";


export type BookCover = { url: string; w: number; h: number; title: string; detail: string };
const COVERS = (bookCovers as { items: Record<string, BookCover> }).items || {};

/** API-issued cover for a book, or null. Only a detail URL carrying this site's tag is used. */
export function coverFor(book: Book): BookCover | null {
  const c = book.coverAsin ? COVERS[book.coverAsin] : undefined;
  return c && c.detail.includes(`tag=${TAG}`) ? c : null;
}
