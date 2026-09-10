/**
 * Prospective in-article book experiment for the 10-K explainer.
 *
 * This is deliberately an exact allowlist rather than a prefix or caller flag:
 * a future /learn page must not inherit monetization accidentally. The product
 * identity was verified against Amazon Creators API searchItems on 2026-09-10;
 * see docs/CONTEXTUAL-BOOK-EXPERIMENT.md for the reproducible evidence.
 */
export const CONTEXTUAL_BOOK_EXPERIMENT = "secfiling-fsa-20260910";
export const CONTEXTUAL_BOOK_GATE_PATH = "/go/contextual-book";

export const CONTEXTUAL_BOOK = Object.freeze({
  asin: "1119457149",
  isbn13: "9781119457145",
  title:
    "Financial Statement Analysis, 5th Edition: A Practitioner's Guide (Wiley Finance)",
  authors: "Martin S. Fridson and Fernando Alvarez",
});

export const CONTEXTUAL_BOOK_PLACEMENT = Object.freeze({
  slug: "10-k",
  afterSectionIndex: 1,
  excludedShelfTitle: "Financial Statement Analysis",
});

export function contextualBookHref(slug: string): string | null {
  if (slug !== CONTEXTUAL_BOOK_PLACEMENT.slug) return null;

  const params = new URLSearchParams({
    a: CONTEXTUAL_BOOK.asin,
    c: CONTEXTUAL_BOOK_EXPERIMENT,
  });
  return `${CONTEXTUAL_BOOK_GATE_PATH}?${params.toString()}`;
}
