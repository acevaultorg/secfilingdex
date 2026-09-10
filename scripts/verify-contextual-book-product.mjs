#!/usr/bin/env node
/**
 * Re-verify the one product used by the 10-K contextual-book treatment.
 *
 * This talks only to Amazon's authorized Creators API. It never requests or
 * follows the affiliate destination, never asks for price, and fails closed on
 * any identity or current-buyability ambiguity.
 */
import assert from "node:assert/strict";

const TOKEN_URL = "https://api.amazon.com/auth/o2/token";
const API_URL = "https://creatorsapi.amazon/catalog/v1/searchItems";
const MARKETPLACE = "www.amazon.com";
const PARTNER_TAG = "secfilingdex-20";

const EXPECTED = Object.freeze({
  asin: "1119457149",
  ean: "9781119457145",
  isbn: "1119457149",
  title:
    "Financial Statement Analysis, 5th Edition: A Practitioner's Guide (Wiley Finance)",
  contributors: ["Fridson, Martin S.", "Alvarez, Fernando"],
});

const credentialId = process.env.CREATORS_API_CREDENTIAL_ID;
const credentialSecret = process.env.CREATORS_API_SECRET;
assert(credentialId && credentialSecret, "CREATORS_API credentials are required");

const tokenResponse = await fetch(TOKEN_URL, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    grant_type: "client_credentials",
    client_id: credentialId,
    client_secret: credentialSecret,
    scope: "creatorsapi::default",
  }),
});
assert.equal(tokenResponse.status, 200, `token exchange returned ${tokenResponse.status}`);
const tokenBody = await tokenResponse.json();
assert.equal(typeof tokenBody.access_token, "string", "token exchange returned no token");

const productResponse = await fetch(API_URL, {
  method: "POST",
  headers: {
    authorization: `Bearer ${tokenBody.access_token}`,
    "content-type": "application/json",
    "x-marketplace": MARKETPLACE,
  },
  body: JSON.stringify({
    keywords: `${EXPECTED.ean} Financial Statement Analysis Fridson Alvarez`,
    searchIndex: "Books",
    marketplace: MARKETPLACE,
    partnerTag: PARTNER_TAG,
    itemCount: 10,
    resources: [
      "itemInfo.title",
      "itemInfo.byLineInfo",
      "itemInfo.externalIds",
      "offersV2.listings.condition",
      "offersV2.listings.isBuyBoxWinner",
    ],
  }),
});
const productBody = await productResponse.json();
assert.equal(
  productResponse.status,
  200,
  `Creators API returned ${productResponse.status}: ${productBody?.reason || "unknown"}`,
);

const items = productBody?.searchResult?.items;
assert(Array.isArray(items), "Creators API response had no search-result items");
assert.equal(items.length, 1, `expected one exact result, received ${items.length}`);

const item = items[0];
assert.equal(item?.asin, EXPECTED.asin, "ASIN changed or the result is not exact");
assert.equal(
  item?.itemInfo?.title?.displayValue,
  EXPECTED.title,
  "product title changed or the result is not the intended edition",
);

// External-ID and contributor containers have changed casing between Amazon
// API generations. These exact strings must all still be present in this one
// API item, regardless of that response-container casing.
const identityEvidence = JSON.stringify(item);
for (const id of [EXPECTED.ean, EXPECTED.isbn, ...EXPECTED.contributors]) {
  assert(identityEvidence.includes(id), `missing exact identity evidence: ${id}`);
}

const listings = item?.offersV2?.listings;
assert(Array.isArray(listings) && listings.length > 0, "no current offer evidence");
const buyBox = listings.find((listing) => listing?.isBuyBoxWinner === true);
assert(buyBox, "no current Buy Box winner");
const condition = buyBox?.condition?.value || buyBox?.condition?.displayValue || "";
assert.match(condition, /^new$/i, `Buy Box is not New (${condition || "unknown"})`);

console.log(
  `contextual-book product VERIFIED: ${EXPECTED.asin} | ${EXPECTED.title} | New Buy Box`,
);
