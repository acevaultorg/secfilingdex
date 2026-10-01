// lib/learn.ts — map a form type to its plain-English /learn/[slug] explainer.
//
// Shared by the /form/[type] hubs and the /filing/[accession] pages so both
// point readers at the same "what is this?" guide. Only the slugs below have a
// /learn page; unmapped form types return null and render no link.

import { formTypeToSlug } from "./types";

const LEARN_SLUGS = new Set([
  "10-k-a", "10-k", "10-q-a", "10-q", "11-k", "13d-vs-13g", "13f", "13h",
  "20-f", "6-k", "8-k", "def-14a", "f-1", "form-144", "form-4", "form-d",
  "n-csr", "n-px", "nt-10-k", "s-1", "s-3", "sc-13e3",
]);
const LEARN_ALIAS: Record<string, string> = {
  "13f-hr": "13f", "13f-hr-a": "13f", "13f-nt": "13f",
  "pre-14a": "def-14a", "defa14a": "def-14a",
  "sc-13d": "13d-vs-13g", "sc-13d-a": "13d-vs-13g",
  "sc-13g": "13d-vs-13g", "sc-13g-a": "13d-vs-13g",
};

/** Learn slug for a /form/ URL slug (e.g. "13f-hr-a" → "13f"), or null. */
export function learnSlugForForm(slug: string): string | null {
  if (LEARN_SLUGS.has(slug)) return slug;
  if (LEARN_ALIAS[slug]) return LEARN_ALIAS[slug];
  if (slug.endsWith("-a")) {
    const base = slug.slice(0, -2);
    if (LEARN_SLUGS.has(base)) return base;
    if (LEARN_ALIAS[base]) return LEARN_ALIAS[base];
  }
  return null;
}

/** Learn slug for a raw form type (e.g. "Form 4/A"), or null. */
export function learnSlugForFormType(formType: string): string | null {
  return learnSlugForForm(formTypeToSlug(formType));
}
