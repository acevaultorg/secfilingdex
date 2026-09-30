# Top ad: A/B/C test — summary

Branch: `cloud/secfilingdex-variants-2026-09-30` (from `main` at `2fcfb02`). Not merged, not deployed.

## What changed and why

**1. Why phones showed the same single product in all three variants (fixed)**
The query override `?ak_variant=a|b|c` never worked. The regex ended in `\b`, but it sits inside a JavaScript
template literal, where `\b` is a *backspace character*, not a word boundary. So the override never matched, and
every review link showed whatever variant that browser had already stored. When the stored variant was A (one
product), all three links showed one product. The regex now ends in `(?:&|$)`, and a test checks that the
scripts contain no control characters.

**2. A second bug that removed the top ad on about 1 in 6 page loads (fixed)**
The mid-page ad is built at the end of `<body>` and later moved to just after `<main>`. That move could happen
before React finished hydrating. React then failed hydration (error #418), rebuilt `<body>` from scratch and
deleted **both** ads, including the top one. Measured on `/learn/`: 7 of 40 loads had no ads with the old code.
Without any ad injected there were 0 of 40. With the fix there were 0 of 120. The move now waits until React has
hydrated the element after `<main>` (it gives up after 10 s and leaves the ad where it was built, which is safe).

**3. The three variants, all in the existing top-ad box, at its current size and shape**
- **A**: one product (unchanged look).
- **B**: up to 5 products, one at a time, best first. The visitor can swipe, or tap the arrow (44 px). A small
  "1 of 5" counter is shown. Nothing moves on its own.
- **C**: a row of products with photo, title and price, like Amazon's related-items row. The heading is "Picked
  for readers of this page". Desktop shows all 5. Phones show two tiles and part of a third, so the row reads as
  swipeable, plus a next arrow. Without a live price a tile says "See price on Amazon", and with one it shows the
  price and "View on Amazon". Before the product data loads, a tile shows a small book icon (inline SVG,
  currentColor), not the title twice.
- The box height is identical for A, B and C at every width (checked in the browser: 242 px on phones, 300 px on
  desktop), so nothing on the page shifts.
- The mid-page ad is back to a single product, the same for every visitor. The test then compares the top box alone.

**4. Assignment**
Each visitor gets a, b or c at random with equal odds (checked with 30,000 draws, all within 2% of 1/3). The
pick is stored in `localStorage` (`akbb`) and kept on later visits. It is set in `<head>` before first paint, so
the right layout paints first. If `localStorage` is blocked (some private windows), the visitor still gets a
variant, but it may change between page views. `?ak_variant=` shows a variant for review without changing the
stored one.

**5. Relevance: the product most likely to be clicked comes first**
`billboard.rank: "topic"` orders the 5 books by how well they fit the page's own words. The words come from the
built page: title, H1 and meta description count 3×, H2/H3 count 2×, and body text 1× (capped). Each book has a
list of plain topic phrases in `amazon-ad.config.mjs`. Asides and the site's own book shelf are ignored, because
the shelf is the same on every guide. Ties keep the catalog order, and the same page always ranks the same way.
Examples: DEF 14A → Buffett's essays; 10-Q → Interpretation of Financial Statements; NT 10-K and 10-K/A →
Financial Shenanigans; S-1, S-3, F-1, Form D and SC 13E-3 → Security Analysis; 13F, Form 4 and N-CSR → The
Intelligent Investor.

**6. Click tracking: a variant field only**
The top-ad script adds `data-ad-variant="a|b|c"` to every billboard link (top and mid). The site's existing
click handler (`components/ClarityTags.tsx`) passes it on as `variant` on the GA4 `affiliate_click` and
`amazon_click` events, and as a Clarity `ad_variant` tag. The kit's own GA4 `amazon_click` does the same. The
click keys (`data-event-from` / `data-from` / `data-affiliate` = `ad-bb-top` / `ad-bb-mid`), the `/go/amzad`
hrefs, `rel`, the fleet beacon URL, the disclosure and the analytics snippets are unchanged. The earlier attempt
rewrote the slug to `ad-bb-top-b`; that is reverted.

## Files touched
- `kit/amazon-ad.mjs`: the variant assignment fix, the click field, `rankByTopic`, the B/C layout CSS, the book
  icon, the mid-move hydration wait, and the variant field on the kit's GA4 click.
- `kit/amazon-ad-inject.mjs`: topic ranking; the top box gets up to 5 products; the mid box is a single product.
- `amazon-ad.config.mjs`: `rank: "topic"`, `max: 5`, and `topics` for each of the 5 books.
- `components/ClarityTags.tsx`: passes the `variant` field.
- `scripts/top-ad-variants.test.mjs` (new, `npm run test:top-ad`): assignment, uniformity, override, ranking and
  markup tests. No browser.
- `scripts/top-ad-variants.browser-check.mjs` (new): a Playwright check of every billboard page × A/B/C ×
  375/390/1280, which also writes the screenshots.
- `package.json`: adds the `test:top-ad` script only.
- `review/`: screenshots. `SUMMARY.md`: this file.

## Build and page counts
- Build (`npm run build`): exit 0 before and after.
- `.html` pages in `out/`: **13,296 before, 13,296 after** (no new pages). The injector touches the same 26 pages
  as before (`/`, `/learn/`, the 23 `/learn/*` guides, `/faq/`, `/research-tools/`).
- `scripts/amazon-tracking-guard.mjs` (the deploy-time click-tracking guard) passes on the injected output: 13,667 affiliate links, all tracked. `npm run test:top-ad` and `npm run test:contextual-book` pass. `tsc --noEmit` is clean.
- robots.txt, sitemap scripts, canonicals, the disclosure text, affiliate routes and analytics snippets are not
  touched (see `git diff --stat main`).

## Screenshots (`review/`)
- `review/<page>_<a|b|c>_<375|390>.jpg`: every changed page (26) × 3 variants × 375 and 390 wide = 156 images.
  `…_desktop.jpg`: home, `/learn/10-k/` and `/learn/def-14a/` at 1280 wide (9 images, 165 in all).
  These show the ad **without** Amazon data (as a visitor sees it if the API is down, and as crawlers see it).
- `review/mock-api/`: the same layouts filled with **placeholder** data (a grey "cover" image and the text
  "$X.XX"), only to show where the photo and price sit once live data arrives. None of it is real product data.
- The browser was Chromium via Playwright, installed in a scratch folder (not a repo dependency). Every request
  that was not to localhost was blocked, so nothing was fetched from Amazon.
- Checks passed on all 26 pages × 3 variants × 3 widths: the forced variant is the one shown. A shows exactly 1
  product. B shows 1 at a time, and "next" moves to a different product ("1 of 5" → "2 of 5"). C shows at least 2
  different products at once on phones and 5 on desktop. No product repeats inside the box. The box height is the
  same across variants. There is no horizontal page scroll, tap targets are 44 px or more, and there are no page
  errors. A stored variant is kept across pages. The same check against the old `main` build fails: the forced
  variant was ignored, so B's arrow was never there to tap.

## Skipped, and why
- **Fleet copy of the kit.** `kit/amazon-ad.mjs`, `kit/amazon-ad-inject.mjs` and `amazon-ad.config.mjs` say they
  are synced from VAULT-Fleet. Only this repo was in scope, so the changes are made here. **The next fleet re-sync
  will overwrite them unless the same changes land in `VAULT-Fleet/tooling/fleet-kit/amazon-ad/` first.**
- **The variant in the server-side count.** The shared Worker counts `/go/amzad` hits server-side. Adding `&v=`
  to those links would change the `/go/` route, which was off limits, so the variant is recorded client-side only
  (GA4 and Clarity).
- **The fleet `/c` beacon.** It only fires for `amazon-*` slugs, and billboard clicks never sent it. That is left
  unchanged.
- **Mid box repeats.** With 5 books in the catalog, B and C in the top box already show all 5, so the single
  mid-page product also appears in the top box for B and C visitors. This is the same for every visitor, so the
  test stays fair.

## What a human must check before this goes live
1. Port the kit changes to the fleet canonical copy (or pause re-syncs), or they will be lost.
2. `/learn/10-k/` is frozen by the RG freeze guard (`scripts/rg-freeze-check.mjs`). The ad was already on that
   page, but its HTML changes here. Decide whether to ack or override the freeze, or exclude that page from
   `billboard.match`.
3. With live Creators API data, look at B and C on a real phone. Check that real photos and prices fit the tiles
   (the placeholder check says they do) and that a book the API reports as unavailable drops out cleanly.
4. In GA4, register `variant` as a custom dimension (event scope) so the A/B/C split shows in reports. Compare
   clicks per visitor (or per page view) for each variant. The groups are equal-sized by design.
5. On desktop, open `/learn/def-14a/?ak_variant=a`, `…=b` and `…=c`, and then a page without the parameter,
   to confirm the stored variant sticks.
6. Run `npm run test:top-ad`. Optionally run the browser check:
   `PLAYWRIGHT_PATH=<playwright folder> node scripts/top-ad-variants.browser-check.mjs out review`
   (after `npm run build` and `node kit/amazon-ad-inject.mjs out`).

## Review pass (2026-09-30, second session)
A review of this branch is in `REVIEW.md`. In short:
- Build exit 0 on this branch and on `main`, **13,296 .html pages** on both, no new pages. Outside the ad
  boxes, scripts, styles and asset hashes, every built page is identical to `main`.
- Fixed: in variant B on phones, the title line ran right up to the next arrow (cramped at 375/390 with long
  real titles and at 320 with none). It now keeps a 30 px gap (`kit/amazon-ad.mjs`).
- The browser check now fails if an arrow ever covers visible ad text, and its placeholder data uses a long
  title (`scripts/top-ad-variants.browser-check.mjs`). It passes on all 26 pages × A/B/C × 375/390/1280, with
  and without placeholder data.
- Screenshots in `review/` and `review/mock-api/` were regenerated after the fix.
- Verdict: the code is ready, but the branch is **not ready to go live** until the three items under
  "What a human must check" (items 1–3 above) are done.
