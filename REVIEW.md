# Review: `cloud/secfilingdex-variants-2026-09-30`

Reviewed 2026-09-30, against `main` at `2fcfb02`. The branch runs the top-ad A/B/C test inside the existing
top ad box. It adds topic-based ordering of the five books and a `variant` field on click events. Not merged,
not deployed.

## What I checked

**Build and page count**
- `npm ci` then `npm run build` on the branch: **exit 0, 13,296 .html pages**.
- The same build on `main` in a separate worktree: **exit 0, 13,296 .html pages**. No new pages.
- `node kit/amazon-ad-inject.mjs out amazon-ad.config.mjs`: injects the same 26 pages as before (`/`,
  `/learn/`, the 23 `/learn/*` guides, `/faq/`, `/research-tools/`).
- I compared every built page with `main` after removing the ad boxes, scripts, styles and hashed
  `/_next/static` asset paths. All 13,296 pages were identical, so the page text, canonicals, JSON-LD, the
  disclosure outside the ad and the nav are unchanged.
- `git diff main` touches nothing under `app/`, `public/` (robots.txt, llms.txt, ads.txt), `functions/`
  (including the `/go/` routes) or the sitemap scripts.

**Checks and tests**
- `scripts/amazon-tracking-guard.mjs`: OK, 13,667 affiliate links, all tracked.
- `npm run test:top-ad` and `npm run test:contextual-book`: pass. `tsc --noEmit`: clean.
- `scripts/rg-freeze-check.mjs` skips itself in this container (the fleet guard binary is not present), so the
  freeze on `/learn/10-k/` was **not** checked here. See "Before it goes live".
- Browser check (`scripts/top-ad-variants.browser-check.mjs`, Playwright + the pre-installed Chromium, every
  non-localhost request blocked, so nothing was fetched from Amazon). It covers all 26 pages × A/B/C ×
  375/390/1280, with no Amazon data and again with placeholder data. Everything passes.

**Diff read line by line**
- Prices: none hardcoded. The price is only filled from `/amz/items` (the existing Creators API route). The
  button says "See price on Amazon" without a live price and "View on Amazon" with one. "Price as of …"
  stays hidden until a price arrives.
- Affiliate links: every ad link still goes to `/go/amzad?a=<ASIN>` with `rel="sponsored nofollow noopener"`.
  The click keys (`data-event-from` / `data-from` / `data-affiliate` = `ad-bb-top` / `ad-bb-mid`) are
  unchanged. The only addition is `data-ad-variant`. No tag or ASIN changed. The five books are the same five.
- Disclosure: "Sponsored · Amazon affiliate link" and the Associates paid-link text are unchanged.
- Visitor text: the new strings are "Picked for readers of this page", "1 of 5", "Previous product" and "Next
  product" (screen-reader labels). They are plain and calm. There are no internal labels, card ids or kit names
  on the page. The internal notes ("Paulo …", "Amili Kit") are in code comments and one build-time error
  message only.
- Icons: the new book icon and the arrows are inline SVG in `currentColor`. No emoji.
- Tap targets: the arrows are 44 × 44 px, and every product link is taller than 44 px.
- HTML: the injected markup is well formed (every `<li>`, `<a>` and `<span>` closes). Screen readers still get
  the book title when the image placeholder shows the icon instead of the name.
- Layout: the box has the same height for A, B and C at each width: 242 px on phones and 300 px on desktop, so
  nothing below it shifts. There is no horizontal page scroll at 375 or 390.

## What I fixed (on this branch)

1. **Variant B on phones: the title line ran right up to the next arrow.** The round arrow sits over the right
   edge of the card. The title line (brand + title) used the full width, so its "…" ended against the arrow's
   edge. That happened with long real Amazon titles at 375 and 390, and at 320 even with no data. No text was
   hidden, but it looked cramped and one font change away from overlapping. The title line in B now stops
   30 px short of the edge, which leaves a clear gap. (`kit/amazon-ad.mjs`, one CSS rule.)
2. **The browser check now guards against real overlap.** It fails if an arrow covers any visible headline,
   title, price or button text, measured on the text itself. The placeholder data now uses a long title, as
   real listings have. To be clear: the old CSS only touched the arrow and did not overlap it, so it passes
   this check too. The check is a guard for later changes, not proof of fix 1. Fix 1 is shown in the
   screenshots. (`scripts/top-ad-variants.browser-check.mjs`)
3. **Screenshots regenerated** after the fix: `review/<page>_<a|b|c>_<375|390>.jpg` for all 26 changed pages,
   desktop shots for `/`, `/learn/10-k/` and `/learn/def-14a/`, and `review/mock-api/` with placeholder data
   (a grey cover and "$X.XX"). That placeholder data is not real product data and never appears on the site.

## Things I looked at and left as they are

- The top ad sits above the site header on every page. This is how `main` already works, not part of this
  change.
- "Picked for readers of this page" also shows on `/`, `/faq/` and `/research-tools/`, where the order is weaker
  because the pages are not about one form. The wording is still true, since the order comes from that page's
  own words.
- On phones in B, the "1 of 5" counter wraps to its own line under "Sponsored · Amazon affiliate link" when no
  price date is shown. It reads fine and stays inside the fixed box height.
- The mid-page box is a single product for everyone. For B and C visitors, that book is also in the top row.
  This is the same for every visitor, so the test stays fair.

## Ready to go live?

**Not yet. The code is ready, but there are three open items outside the code.**

The build is clean, the page count is unchanged, the tracking guard passes, and every affiliate route,
disclosure, canonical and robots/sitemap file is untouched. The layouts hold at 375 and 390 in all three
variants after the fix above. Nothing on the page would embarrass the site. Before deploying, someone has to:

1. **Land the same kit changes in the fleet copy** (`VAULT-Fleet/tooling/fleet-kit/amazon-ad/`) or pause
   re-syncs. `kit/amazon-ad.mjs`, `kit/amazon-ad-inject.mjs` and `amazon-ad.config.mjs` are synced from
   there, and the next sync would silently undo this branch, including today's arrow fix.
2. **Run the RG freeze check on a machine that has the guard.** `npm run deploy` runs
   `scripts/rg-freeze-check.mjs`, and the ad HTML on `/learn/10-k/` (a frozen page) changes here. Ack it,
   override it, or leave that page out of `billboard.match`.
3. **Look at B and C once with live Creators API data on a real phone.** Check real cover sizes, long real
   titles and a book the API reports as unavailable. This session could only use placeholder data.

Also register `variant` as an event-scoped custom dimension in GA4 before reading the results.
