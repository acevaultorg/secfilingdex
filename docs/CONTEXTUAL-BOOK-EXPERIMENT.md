# SecFilingDex 10-K contextual-book launch

Status: pre-registered before preview or production deployment on 2026-09-10.

## Decision and scope

This is a narrow attempt to make SecFilingDex an eighth Amazon-earning fleet site,
not a causal placement-lift test. The existing, registered `secfilingdex-20`
tracking ID is shared by the whole site, so Amazon orders, ordered revenue, and
commission can identify the site but cannot identify this placement.

The only treatment route is `/learn/10-k/`. It inserts one exact-edition book
callout, “Next step: interpreting the statements,” after the second article
section, “What's inside a 10-K.” That is roughly 22% through the article and
directly follows the financial-statements item. The publisher-grounded copy
names balance sheets, income statements, cash-flow statements, and GAAP and
non-GAAP reporting; it makes no price or performance claim.
The matching generic `Financial Statement Analysis` shelf search is suppressed
on this route to avoid showing the same book twice. The other four shelf books
and the byte-exact Audible control remain unchanged.

Explicit exclusions: `/learn/20-f/`, `/learn/s-1/`, `/learn/13f/`,
`/learn/13d-vs-13g/`, `/learn/8-k/`, `/learn/11-k/`, every other `/learn/`
route, and all `/industry/` routes. 20-F was rejected because the book is framed
primarily around U.S.-company reporting; the other candidate pages do not have
enough page-wide financial-statement intent. 11-K is outside monetization and its
deadline correction is a separate correction-only commit.

## Product and ownership evidence

At 2026-09-10T03:02Z, an authorized Amazon Creators API `searchItems` request for
ISBN-13 `9781119457145`, with partner tag `secfilingdex-20`, returned exactly one
item:

- ASIN / ISBN-10: `1119457149`
- EAN / ISBN-13: `9781119457145`
- Title: *Financial Statement Analysis, 5th Edition: A Practitioner's Guide
  (Wiley Finance)*
- Contributors: Martin S. Fridson and Fernando Alvarez
- One New Buy Box winner

The check requested identity, condition, and Buy Box resources only—never price.
No Amazon affiliate destination was opened or followed. Re-run the fail-closed
check with `npm run verify:contextual-book-product` before a future product
change or reactivation.

The tracking ID was independently present in Amazon Associates' live “Manage
Your Tracking IDs” view at 2026-09-10T02:48:53Z and in the authoritative local
33-ID inventory. An unregistered fallback is forbidden.

## Baseline and known limitations

Fresh exact-host GA4, trailing 30 days at pre-registration:

| Route | Sessions | Engaged sessions | Page views | Engagement rate | Avg session duration |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/learn/10-k/` | 22 | 11 | 22 | 50.0% | 40.44 s |

The full site had 680 sessions, only 73 Organic sessions. Clarity had only three
human sessions across the six initially reviewed pages in the latest three-day
read, so it is supporting qualitative evidence, not a powered baseline.

GA4 returned no `amazon_click` or `affiliate_click` rows for this host in the
same 30-day read. Fleet first-party data contained one whole-site click labelled
`reviewprobe`; it is automation, not evidence of human demand. Do not interpret
these sparse or contaminated values as zero revenue.

At pre-registration, the central Fleet Amazon tag-to-domain map omitted
`secfilingdex-20`, even though the ID is registered. That separate defect was
repaired before this release in source commit
`976069f20639131324e91f799219ed8f9c3b07a3` and live Fleet Worker version
`b4af8ea9-4c8b-4e74-9b21-182577fa7420` (rollback version
`0eec2859-176d-4973-b6c4-b9ce306801ae`). Historical reads made before the repair
can still be incomplete. Estimated Fleet revenue is never a substitute for
actual Associates ordered revenue or commission.

## Treatment and measurement contract

The rendered link is a same-origin, tokenless `/go/contextual-book` URL; the
tagged Amazon URL never appears in this callout's HTML. A trusted native pointer,
click, or middle-click gesture synchronously adds a short-lived random token and
matching `Secure; SameSite=Lax` cookie. The Pages Function accepts only an exact
ASIN/cohort/query shape, a fresh matching token and cookie, a top-level
`navigate` request from `same-origin` or `same-site`, and an exact same-origin
`/learn/10-k/` referrer. It fails closed to the site root on uncertainty.

Only an accepted server request emits the canonical first-party click:
`f=amazon-contextual-book&p=learn-10k`. Rejected and programmatic attempts emit
nothing. Its adjacent 13 px disclosure identifies the paid Amazon link and the
educational, non-advisory context. Client-side affiliate tracking skips this one link to prevent rejected
attempts and accepted clicks from being double-counted. The four retained shelf
books and Audible keep their existing GA4, Clarity, and first-party controls.

Primary read: accepted `amazon-contextual-book` clicks divided by exact 10-K
sessions. Secondary, site-level-only reads: `secfilingdex-20` Amazon clicks,
ordered items, ordered revenue, and commission. Amazon outcomes must never be
described as placement-causal while this shared tracking ID is used.

## Read gates and rollback

- Before deployment: current-origin reconciliation, TypeScript, full static
  build, render-isolation test, Pages Function build, local positive/negative
  gate tests, and a preview-only visual check at desktop and 375 px. The local
  positive gate test mocks the collector and never makes an Amazon request.
- Live verification: only tokenless, malformed, stale, wrong-referrer, and
  cross-site probes. They must strip the path and return to the site's root. Do
  not mint a valid live token, follow a redirect, or click the CTA for testing.
- 72-hour health read: 10-K stays 200; no treatment appears elsewhere; all four
  retained books and Audible work as before; no layout/accessibility regression;
  no tagged destination leaks from the contextual CTA.
- Directional read: after 28 complete days. Because baseline traffic is only 22
  sessions/month, do not claim a win or loss from a few visits.
- Expansion gate: at least 100 eligible 10-K sessions and five accepted
  contextual clicks, plus a non-zero, authoritative `secfilingdex-20` Amazon
  outcome from a post-repair pull. Even then, require a fresh
  relevance/product review before adding a second route.
- Roll back immediately for route bleed, a tagged contextual URL in HTML, an
  untrusted/invalid request reaching Amazon, missing disclosure or sponsored
  rel, altered retained controls, wrong product/tag, gate 404, material UX
  breakage, or a sustained engagement deterioration that is not explained by
  traffic mix.

Rollback is one revert of the contextual-book implementation commit. Keep the
separate 11-K factual correction; it is not part of this treatment.
