# Affiliate activation — one env var, no code change

The partner box on filing pages ships **dormant**. It renders nothing at all —
no heading, no empty card, no whitespace — until one of the variables below is
set. When a program approves, activation is a dashboard edit plus a redeploy.

## Activate a slot

1. Cloudflare dashboard → **Workers & Pages** → `secfilingdex` → **Settings** →
   **Variables and Secrets** → *Production*.
2. Add the variable for the slot that approved (table below). Value = your
   affiliate URL, already tagged, pasted **verbatim** from the network's own
   link builder.
3. Redeploy: `npm run deploy`.
4. Verify it went live:
   ```sh
   curl -s https://secfilingdex.com/filing/<any-accession>/ | grep -c 'data-affiliate'
   ```
   `0` before activation, `≥1` after.

Values are inlined at **build time**, so a variable set without a redeploy
changes nothing.

## Slots

| Env var | Slug (analytics) | Link text |
|---|---|---|
| `NEXT_PUBLIC_AFF_DATA` | `data` | Filing and market-data tools |
| `NEXT_PUBLIC_AFF_RESEARCH` | `research` | Research and screening software |
| `NEXT_PUBLIC_AFF_EDUCATION` | `education` | Financial-statement analysis courses |

Any number may be live at once. Unset slots stay invisible.

Already live and unrelated to the above — the Amazon shelf on `/learn/[form]`,
configured in `lib/books.ts` (tag `secfilingdex-20`, overridable with
`NEXT_PUBLIC_AMAZON_AFFILIATE_TAG`).

## Adding a NEW slot

Setting an env var alone is **not** enough for a partner that has no row yet.
Static export inlines `process.env.NEXT_PUBLIC_*` by literal text substitution,
so a computed lookup (`process.env[\`NEXT_PUBLIC_AFF_${slug}\`]`) is never
replaced and is always `undefined` in the browser. Add a row to `REGISTRY` in
`lib/partners.ts` naming the variable literally, then set the variable.

## Measurement

Every affiliate anchor carries `data-affiliate="<slug>"`. One delegated
listener in `components/ClarityTags.tsx` fires on click, into the analytics the
site already loads — no new vendor:

- **Microsoft Clarity** — `clarity('set','affiliate_partner',<slug>)` then
  `clarity('event','affiliate_click')`. Filter recordings by the tag; the event
  shows on the session timeline.
- **GA4** — `gtag('event','affiliate_click',{ partner:<slug>, link_url })`.
  Appears under *Reports → Engagement → Events* within ~24h. Mark it as a key
  event to get it into conversion reporting.

Slugs currently in use: `data`, `research`, `education`, `amazon-book`,
`amazon-audible`. The two Amazon slugs are split deliberately — the flat Audible
trial bounty is worth far more per conversion than a book commission.

## Compliance (do not ship a slot that breaks these)

- `rel="sponsored nofollow noopener"` on every anchor — enforced in
  `components/PartnerTools.tsx`, not left to the caller.
- FTC disclosure renders **adjacent** to the links and points at `/disclosure/`.
- **Never display a price.** Prices change; cached prices violate most programs.
- No fake scarcity, no countdowns, no "click to support us".
- **YMYL:** tools, data and education only. No brokerage or funded-account
  offers, no language implying a security is worth buying or selling. A
  brokerage affiliate stack on finance pages is what caused the HoldLens
  AdSense rejection.
