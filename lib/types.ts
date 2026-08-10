// lib/types.ts — canonical Filing schema for SecFilingDex
//
// Every filing on the site corresponds to a single JSON file at
// data/filings/[accession].json that conforms to FilingRecord. The
// accession number (zero-padded, hyphenated form like 0000320193-24-000123)
// is the SEC's permanent unique identifier and the URL slug.
//
// This shape is the source of truth for:
//   - data/filings/*.json validation (lib/filings.ts loadFilings)
//   - app/filing/[accession]/page.tsx generateStaticParams + render
//   - app/api/v1/filing/[accession].json bot-cacheable JSON twin
//   - sitemap-ai.xml AI-priority enumeration
//   - JSON-LD Article + Dataset schema generation

export type FormType =
  | "10-K"
  | "10-K/A"
  | "10-Q"
  | "10-Q/A"
  | "8-K"
  | "8-K/A"
  | "13F-HR"
  | "13F-HR/A"
  | "13F-NT"
  | "SC 13D"
  | "SC 13D/A"
  | "SC 13G"
  | "SC 13G/A"
  | "S-1"
  | "S-1/A"
  | "DEF 14A"
  | "PRE 14A"
  | "DEFA14A"
  | "Form 4"
  | "Form 4/A"
  | "20-F"
  | "20-F/A"
  | "6-K"
  | "11-K"
  | "424B1"
  | "424B2"
  | "424B3"
  | "424B4"
  | "424B5";

export interface FilingRecord {
  /** SEC accession number, zero-padded with hyphens. Permanent unique ID + URL slug. */
  accessionNumber: string;
  /** SEC Central Index Key — 10-digit zero-padded filer identifier. */
  cik: string;
  /** Filer's legal name as registered with SEC. */
  filerName: string;
  /** Ticker symbol (when listed) — uppercase. May be empty for non-public filers. */
  ticker?: string;
  /** SIC industry code (4 digits, when assigned). */
  sicCode?: string;
  /** Form type (10-K, 10-Q, 8-K, etc.) — see FormType union. */
  formType: FormType;
  /** ISO 8601 datetime SEC accepted the filing (filing acceptance time). */
  filedAt: string;
  /** ISO 8601 date of period the filing reports on (e.g., quarter-end for 10-Q). */
  periodOfReport?: string;
  /** Primary document filename within the filing's EDGAR archive. */
  primaryDocument?: string;
  /** Human-readable description of the primary document (e.g., "10-Q"). */
  primaryDocDescription?: string;
  /** Direct EDGAR URL to the filing's index page (provenance). */
  edgarFilingUrl: string;
  /** Total filing size in bytes (when available from EDGAR index). */
  size?: number;
  /** ISO 8601 datetime SecFilingDex last verified this record against EDGAR. */
  indexedAt: string;
  /** True iff this filing is an amendment (form type ends in /A). */
  isAmendment: boolean;
}

/** Form-type catalog with display name + one-line definition. */
export interface FormTypeInfo {
  code: FormType | string;
  /** Plain-English short name. */
  shortName: string;
  /** One-sentence definition (quote-ready per LLM-citation pattern). */
  definition: string;
  /** Filing cadence in plain English. */
  cadence: string;
  /** Key audience: investor / regulator / both. */
  audience: "investor" | "regulator" | "both";
}

export const FORM_TYPE_CATALOG: FormTypeInfo[] = [
  {
    code: "10-K",
    shortName: "Annual report",
    definition:
      "Comprehensive annual report filed by U.S. public companies, including audited financial statements, MD&A, and risk factors.",
    cadence: "Annual",
    audience: "both",
  },
  {
    code: "10-Q",
    shortName: "Quarterly report",
    definition:
      "Unaudited quarterly financial report filed by U.S. public companies for the first three fiscal quarters.",
    cadence: "Quarterly",
    audience: "both",
  },
  {
    code: "8-K",
    shortName: "Material event",
    definition:
      "Current report announcing a material event, such as an acquisition, executive change, or earnings release.",
    cadence: "Event-driven",
    audience: "both",
  },
  {
    code: "13F-HR",
    shortName: "Institutional holdings",
    definition:
      "Quarterly disclosure of equity holdings by institutional investment managers with $100M+ AUM.",
    cadence: "Quarterly",
    audience: "investor",
  },
  {
    code: "SC 13D",
    shortName: "5%+ activist stake",
    definition:
      "Disclosure of beneficial ownership above 5% with intent to influence company control.",
    cadence: "Event-driven (within 10 days)",
    audience: "investor",
  },
  {
    code: "SC 13G",
    shortName: "5%+ passive stake",
    definition:
      "Short-form disclosure of beneficial ownership above 5% by passive investors with no control intent.",
    cadence: "Event-driven",
    audience: "investor",
  },
  {
    code: "S-1",
    shortName: "IPO registration",
    definition:
      "Registration statement filed by a company planning to issue securities to the public for the first time.",
    cadence: "Event-driven (pre-IPO)",
    audience: "both",
  },
  {
    code: "DEF 14A",
    shortName: "Proxy statement",
    definition:
      "Definitive proxy statement disclosing matters to be voted on by shareholders, including executive compensation.",
    cadence: "Annual (pre-meeting)",
    audience: "investor",
  },
  // Section 16 insider-ownership set. Form 4 was catalogued; Forms 3 and 5 were
  // not, and because slugToFormType() resolves a slug only against this catalog
  // plus a hand-kept literal list, /form/form-3/, /form/form-3-a/ and
  // /form/form-5/ never resolved — they fell through to notFound() and served a
  // soft 404 (HTTP 200 + noindex + no h1) while still sitting in the sitemap,
  // hiding 19, 1 and 10 real filings respectively. Definitions below are the
  // SEC's own descriptions of each form's purpose and deadline.
  {
    code: "Form 3",
    shortName: "Initial insider ownership",
    definition:
      "Initial statement of beneficial ownership filed by a company's officers, directors, and 10%+ owners when they first become an insider.",
    cadence: "Within 10 days of becoming an insider",
    audience: "investor",
  },
  {
    code: "Form 4",
    shortName: "Insider transaction",
    definition:
      "Statement of changes in beneficial ownership filed by company officers, directors, and 10%+ owners.",
    cadence: "Within 2 business days of transaction",
    audience: "investor",
  },
  {
    code: "Form 5",
    shortName: "Annual insider summary",
    definition:
      "Annual statement of changes in beneficial ownership, covering insider transactions that were exempt from Form 4 reporting during the fiscal year.",
    cadence: "Within 45 days of fiscal year end",
    audience: "investor",
  },
  {
    code: "20-F",
    shortName: "Foreign annual",
    definition:
      "Annual report filed by foreign private issuers listed on U.S. exchanges.",
    cadence: "Annual",
    audience: "both",
  },
  {
    code: "6-K",
    shortName: "Foreign event",
    definition:
      "Material disclosure filed by foreign private issuers as required by their home country.",
    cadence: "Event-driven",
    audience: "both",
  },
  {
    code: "11-K",
    shortName: "Employee stock plan",
    definition:
      "Annual report on an employee stock-purchase, savings, or similar plan.",
    cadence: "Annual",
    audience: "regulator",
  },
  {
    code: "424B1",
    shortName: "Prospectus (post-effective)",
    definition:
      "Prospectus filed under Rule 424(b)(1), providing information that was omitted from the registration statement at the time it became effective.",
    cadence: "Event-driven",
    audience: "both",
  },
  {
    code: "424B2",
    shortName: "Shelf prospectus",
    definition:
      "Prospectus filed under Rule 424(b)(2) for a delayed or continuous (shelf) offering, supplying pricing or other information omitted from an effective registration statement.",
    cadence: "Event-driven",
    audience: "both",
  },
  {
    code: "424B3",
    shortName: "Updated prospectus",
    definition:
      "Prospectus filed under Rule 424(b)(3) that reflects substantive changes to, or a material update of, a previously filed prospectus.",
    cadence: "Event-driven",
    audience: "both",
  },
  {
    code: "424B4",
    shortName: "Final prospectus",
    definition:
      "Final prospectus filed under Rule 424(b)(4) that includes the pricing and related information omitted from the registration statement at effectiveness — the common final prospectus for IPOs and public offerings.",
    cadence: "Event-driven",
    audience: "both",
  },
  {
    code: "424B5",
    shortName: "Prospectus supplement",
    definition:
      "Prospectus supplement filed under Rule 424(b)(5) for a takedown from an existing shelf registration statement.",
    cadence: "Event-driven",
    audience: "both",
  },
];

export function isAmendmentForm(formType: string): boolean {
  return formType.endsWith("/A");
}

/** Normalize an accession number to canonical hyphenated form. */
export function normalizeAccession(raw: string): string {
  // Accept both compact (0000320193240000123) and hyphenated (0000320193-24-000123).
  const compact = raw.replace(/-/g, "");
  if (compact.length !== 18) return raw; // pass through if non-standard
  return `${compact.slice(0, 10)}-${compact.slice(10, 12)}-${compact.slice(12)}`;
}

/** Convert canonical accession to URL-safe slug (lowercase, no hyphens). */
export function accessionToSlug(accession: string): string {
  return accession.replace(/-/g, "").toLowerCase();
}

/** Reverse: URL slug back to canonical accession number. */
export function slugToAccession(slug: string): string {
  return normalizeAccession(slug);
}

/** Convert form type to URL-safe slug. "SC 13D" → "sc-13d", "10-K/A" → "10-k-a". */
export function formTypeToSlug(formType: string): string {
  return formType
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Reverse: URL slug back to canonical form type (best-effort). */
export function slugToFormType(slug: string): FormType | string {
  // Look up exact form-type match by re-slugging each known type.
  const known: (FormType | string)[] = [
    ...new Set([
      ...FORM_TYPE_CATALOG.map((f) => f.code),
      "10-K",
      "10-K/A",
      "10-Q",
      "10-Q/A",
      "8-K",
      "8-K/A",
      "13F-HR",
      "13F-HR/A",
      "13F-NT",
      "SC 13D",
      "SC 13D/A",
      "SC 13G",
      "SC 13G/A",
      "S-1",
      "S-1/A",
      "DEF 14A",
      "PRE 14A",
      "DEFA14A",
      "Form 3",
      "Form 3/A",
      "Form 4",
      "Form 4/A",
      "Form 5",
      "Form 5/A",
      "20-F",
      "20-F/A",
      "6-K",
      "11-K",
      "424B1",
      "424B2",
      "424B3",
      "424B4",
      "424B5",
    ]),
  ];
  for (const ft of known) {
    if (formTypeToSlug(ft) === slug.toLowerCase()) return ft;
  }
  return slug;
}
