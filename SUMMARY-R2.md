# Round 2 (2026-10-01): summary

Branch: `claude/r2-secfilingdex-2026-10-01-bsu602`, cut from `main` at `df677d4`. This is the branch this
session is allowed to push to. The task asked for `cloud/r2-secfilingdex-2026-10-01`, but this session can only
push to its own assigned branch. Nothing is merged or deployed.

**Why the branch starts from `main` and not from the round-1 branch:** round 1
(`cloud/secfilingdex-variants-2026-09-30`) is an unmerged A/B test of the top ad. It still has three open
"human must check" items, and its base is older than today's data ingest. These round-2 changes don't touch the
ad kit at all. Building them on `main` keeps them separate, so either branch can ship without the other. Round 1
reported no build failure, no drop in page count and no broken 375 px layout, so there was nothing from it to fix
first.

## What changed and why

**1. Filing pages (`/filing/…`, about 12,000 pages): the document is now one tap away**
- Before, a visitor had to scroll past the whole facts table to find a raw EDGAR URL. Now a 48 px button
  **"Read the filing on SEC.gov"** sits just under the title. It opens the filing's main document directly. That
  URL is the filing's EDGAR archive folder plus the `primaryDocument` name EDGAR reported at ingest; nothing is
  invented. For Form 4 and 13F filings, this is EDGAR's own readable view (`xslF345X05/…`, `xslForm13F_X02/…`).
  A second button, **"All documents in this filing"**, opens the EDGAR index page. If a record has no
  `primaryDocument` (about 1,400 of 12,165), only one button appears, labelled "Open the filing on SEC.gov", and
  it goes to the index page.
- A link **"New to the 10-Q? What it is and how to read one"** goes to the matching `/learn/` guide. It appears
  only when a guide exists for that form. It uses the same form-to-guide mapping as the `/form/` pages, which
  now lives in `lib/learn.ts`.
- **"More filings from {company}"**: the 5 newest other filings from the same company, each with its plain
  form name, plus "See all N filings from {company}". Before, the filing page had no way to see the company's
  other filings.
- "Period of report" now reads "June 30, 2026" instead of "2026-06-30". The date is read in UTC, so it can't
  shift by a day depending on the build machine's time zone.
- Filing pages stay `noindex` exactly as before. These changes are for people who reach the page from the site.

**2. Filer pages (`/filer/…`): each row says what the filing is**
- Before, each row showed date · form code · a 20-digit accession number, and on a phone the accession number
  took the most space. Now each row shows the form code, then the plain name ("Quarterly report",
  "Material event", …) and EDGAR's period of report, then a small second line with "Filed Jul 30, 2026" and
  the accession number.

**3. Search (`/search/`): companies first, and broad queries no longer freeze phones**
- When the words match a company's name, ticker or CIK, a **Companies** list (up to 6) appears above the
  filings. Each row links to that company's filer page and shows how many filings matched. Someone typing a
  company name usually wants the company, not one filing.
- The filing list now stops at the 100 newest matches, with a note telling the visitor to narrow the search.
  Before, a bare "8-K" drew about 1,700 rows. That was too tall for Chromium to even screenshot, and it is slow
  to render on a phone.

## Files touched
- `lib/learn.ts` (new): the form → `/learn/` guide mapping, moved out of the form page.
- `lib/format.ts`: `formatDay`, `formatDayCompact`, `edgarPrimaryDocUrl`.
- `app/filing/[accession]/page.tsx`: the buttons, the guide link, "More filings from…", the period date, and
  two inline SVG icons (currentColor).
- `app/filer/[cik]/page.tsx`: the filing rows.
- `app/form/[formType]/page.tsx`: now imports the mapping from `lib/learn.ts`. The output is unchanged.
- `components/SearchClient.tsx`: the companies list and the result cap.
- `review/`: screenshots. `SUMMARY-R2.md`: this file.

Not touched: affiliate tags, `/go/` routes, disclosures, analytics snippets, `robots.txt`, sitemap scripts,
canonicals, metadata, robots meta tags and the ad kit.

## Build and page counts
- `npm run build` on `main` before the changes: **exit 0, 13,471 .html pages** in `out/`.
- `npm run build` after the changes: **exit 0, 13,471 .html pages**. No new pages.
- `tsc --noEmit`: clean.
- The data-freshness check in `prebuild` passed. Today's ingest is in `main`.

## Screenshots (`review/`)
Chromium through Playwright, which was installed in a scratch folder and is not a repo dependency. Every request
not going to localhost was blocked, so nothing was fetched from Amazon or sec.gov. All screenshots are full page
at 375 and 390 wide:
- `filing_10-q_*`: `/filing/0000004904-26-000059/` (Appalachian Power 10-Q)
- `filing_form-4_*`: `/filing/0000017313-25-000093/` (a Form 4)
- `filer_*`: `/filer/0000006879/`. `filer_wpp_*`: `/filer/0000806968/`
- `search_wpp_*`: `/search/?q=wpp`. `search_8-k_*`: `/search/?q=8-k` (after only, cut off at 9,000 px)
- `*_before_*` comes from the `main` build and `*_after_*` from this branch. There is no `search_8-k` before
  shot, because that page was too tall for Chromium to capture.
- Automated checks on all 12 shots: no horizontal scroll at 375 or 390, every button and min-height link at
  least 44 px tall, and no page errors.
- The cookie banner is a fixed overlay, so in a full-page screenshot it appears partway down the page. That is
  only an artifact of the screenshot.

## Skipped, and why
- **Pushing to `cloud/r2-secfilingdex-2026-10-01`:** this session can only push to its assigned branch (see
  the top of this file).
- **Building on the round-1 ad-test branch:** see the top of this file.
- **Ticker search:** the search index holds tickers only where EDGAR put them inside the filer name. Adding a
  separate ticker field would change `/api/filings.json`, a public API file, so it is left for a separate change.

## What a human must check before this goes live
1. On a real phone, open two or three filing pages, including a Form 4 and a 13F, and tap "Read the filing on
   SEC.gov". Confirm sec.gov opens the document. These links were not opened from this session, because
   outbound requests were blocked on purpose. The URL pattern is EDGAR's standard archive layout.
2. Search for a company name and a ticker, then tap a row under "Companies" to confirm it opens the filer page.
3. Analytics: the new buttons are plain outbound links, and no new event names were added. If outbound clicks
   to sec.gov should be tracked, that is a separate decision.
4. Round 1's open items (fleet re-sync of the ad kit, the `/learn/10-k/` freeze, a live-data check of variants
   B and C) still apply to that branch. They are unchanged by this one.
