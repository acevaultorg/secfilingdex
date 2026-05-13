/**
 * lib/holdlens-tracked.ts — sister-property cross-reference map.
 *
 * When SecFilingDex's /filer/[CIK] page renders for a CIK that HoldLens
 * tracks as a curated superinvestor, this map drives a "Live position
 * analysis on HoldLens" cross-link section.
 *
 * Source-of-truth: HoldLens scripts/fetch-edgar-13f.ts CIK_MAP (as of
 * holdlens commit 064780eb0+). Re-verify quarterly when HoldLens adds or
 * recategorizes tracked managers.
 *
 * Format keys: 10-digit zero-padded CIK string (matches SEC EDGAR canonical).
 * Lookup callers should normalize: cik.padStart(10, "0").
 *
 * Each entry: { slug: HoldLens /investor/[slug] URL slug, name: display name,
 * fund: primary investment vehicle name shown alongside the manager. }
 */

export type HoldLensManager = {
  slug: string;
  name: string;
  fund: string;
};

export const HOLDLENS_TRACKED_BY_CIK: Record<string, HoldLensManager> = {
  "0001067983": { slug: "warren-buffett",        name: "Warren Buffett",        fund: "Berkshire Hathaway" },
  "0001336528": { slug: "bill-ackman",           name: "Bill Ackman",            fund: "Pershing Square" },
  "0000921669": { slug: "carl-icahn",            name: "Carl Icahn",             fund: "Icahn Capital" },
  "0001079114": { slug: "david-einhorn",         name: "David Einhorn",          fund: "Greenlight Capital" },
  "0001061768": { slug: "seth-klarman",          name: "Seth Klarman",           fund: "Baupost Group" },
  "0001167557": { slug: "joel-greenblatt",       name: "Joel Greenblatt",        fund: "Gotham Asset Management" },
  "0001649339": { slug: "michael-burry",         name: "Michael Burry",          fund: "Scion Asset Management" },
  "0001536411": { slug: "stanley-druckenmiller", name: "Stanley Druckenmiller",  fund: "Duquesne Family Office" },
  "0001709323": { slug: "li-lu",                 name: "Li Lu",                  fund: "Himalaya Capital" },
  "0001549575": { slug: "monish-pabrai",         name: "Mohnish Pabrai",         fund: "Dalal Street LLC" },
  "0000949509": { slug: "howard-marks",          name: "Howard Marks",           fund: "Oaktree Capital" },
  "0000915191": { slug: "prem-watsa",            name: "Prem Watsa",             fund: "Fairfax Financial" },
  "0000813917": { slug: "bill-nygren",           name: "Bill Nygren",            fund: "Harris Associates LP" },
  "0001553733": { slug: "glenn-greenberg",       name: "Glenn Greenberg",        fund: "Brave Warrior Advisors" },
  "0001656456": { slug: "david-tepper",          name: "David Tepper",           fund: "Appaloosa LP" },
  "0001167483": { slug: "chase-coleman",         name: "Chase Coleman",          fund: "Tiger Global" },
  "0001647251": { slug: "chris-hohn",            name: "Chris Hohn",             fund: "TCI Fund Management" },
  "0001112520": { slug: "chuck-akre",            name: "Chuck Akre",             fund: "Akre Capital Management" },
  "0001103804": { slug: "andreas-halvorsen",     name: "Andreas Halvorsen",      fund: "Viking Global" },
  "0001040273": { slug: "lee-ainslie",           name: "Lee Ainslie",            fund: "Maverick Capital" },
  "0001061165": { slug: "stephen-mandel",        name: "Stephen Mandel",         fund: "Lone Pine Capital" },
  "0001569205": { slug: "terry-smith",           name: "Terry Smith",            fund: "Fundsmith" },
  "0001105838": { slug: "john-armitage",         name: "John Armitage",          fund: "Egerton Capital" },
  "0000859804": { slug: "david-rolfe",           name: "David Rolfe",            fund: "Wedgewood Partners" },
  "0001641864": { slug: "francois-rochon",       name: "François Rochon",        fund: "Giverny Capital" },
  "0001697868": { slug: "dev-kantesaria",        name: "Dev Kantesaria",         fund: "Valley Forge Capital" },
  "0001817187": { slug: "jeffrey-ubben",         name: "Jeffrey Ubben",          fund: "Inclusive Capital Partners" },
  "0001088875": { slug: "tom-slater",            name: "Tom Slater",             fund: "Baillie Gifford" },
  "0001279936": { slug: "william-von-mueffling", name: "William von Mueffling",  fund: "Cantillon Capital" },
  "0001034524": { slug: "polen-capital",         name: "Polen Capital",          fund: "Polen Capital Management" },
};

/**
 * Lookup helper. Normalizes input to 10-digit zero-padded format before lookup.
 * Returns undefined if the CIK is not a tracked HoldLens manager.
 */
export function getHoldLensManagerByCik(cik: string): HoldLensManager | undefined {
  const normalized = cik.padStart(10, "0");
  return HOLDLENS_TRACKED_BY_CIK[normalized];
}
