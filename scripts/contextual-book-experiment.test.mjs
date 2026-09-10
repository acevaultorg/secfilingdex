#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const EXPERIMENT = "secfiling-fsa-20260910";
const ASIN = "1119457149";
const TAG = "secfilingdex-20";

assert(existsSync(path.join(OUT, "index.html")), "run `npm run build` before this test");

const html = (route) =>
  readFileSync(path.join(OUT, ...route.split("/").filter(Boolean), "index.html"), "utf8");
const count = (text, needle) => text.split(needle).length - 1;

function htmlFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...htmlFiles(absolute));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

const treatment = html("/learn/10-k/");
assert.match(treatment, /Last updated: (?:<!-- -->)?2026-09-10/);
assert.equal(count(treatment, `data-experiment="${EXPERIMENT}"`), 1);
assert.equal(count(treatment, 'data-affiliate="amazon-contextual-book"'), 1);
assert.equal(count(treatment, 'data-server-tracked="true"'), 1);
assert.equal(count(treatment, 'data-affiliate="amazon-book"'), 4);
assert.equal(count(treatment, 'data-affiliate="amazon-audible"'), 1);
assert.equal(count(treatment, 'data-book="Financial Statement Analysis"'), 0);
assert.match(
  treatment,
  /href="\/go\/contextual-book\?a=1119457149(?:&|&amp;)c=secfiling-fsa-20260910"/,
);
assert.match(
  treatment,
  /rel="sponsored nofollow noopener"[^>]*data-event="amazon_click"[^>]*data-affiliate="amazon-contextual-book"/,
);
assert(treatment.includes("Paid link. As an Amazon Associate I earn"));
assert(treatment.includes("General educational reference; not investment advice."));
assert(treatment.includes("text-[13px]"));
assert(treatment.includes("Next step: interpreting the statements"));
assert(treatment.includes("See the fifth edition on Amazon"));
assert(!treatment.includes("is a marketing document"));
assert(treatment.includes("is designed for a broader audience"));
assert(!treatment.includes("than the designed annual report"));

for (const retained of [
  "Security Analysis",
  "Financial Shenanigans",
  "The Intelligent Investor",
  "The Essays of Warren Buffett",
  "Audible trial",
]) {
  assert(treatment.includes(retained), `10-K lost retained control: ${retained}`);
}

const insideHeading = treatment.indexOf("inside a 10-K");
const callout = treatment.indexOf(`data-experiment="${EXPERIMENT}"`);
const nextHeading = treatment.indexOf("10-K vs. annual report vs. proxy");
assert(insideHeading >= 0 && insideHeading < callout && callout < nextHeading);

const calloutEnd = treatment.indexOf("</aside>", callout);
const calloutHtml = treatment.slice(callout, calloutEnd);
assert(!/[\$€£]|\bprice\b|\bdiscount\b|\bbuy now\b/i.test(calloutHtml));

const excludedRoutes = [
  "/learn/20-f/",
  "/learn/s-1/",
  "/learn/13f/",
  "/learn/13d-vs-13g/",
  "/learn/8-k/",
  "/learn/11-k/",
];
for (const route of excludedRoutes) {
  const page = html(route);
  assert.equal(count(page, `data-experiment="${EXPERIMENT}"`), 0, `${route} received treatment`);
  assert.equal(count(page, 'data-affiliate="amazon-book"'), 5, `${route} shelf changed`);
  assert.equal(count(page, 'data-affiliate="amazon-audible"'), 1, `${route} Audible changed`);
}

const allTreatmentHtml = htmlFiles(path.join(OUT, "learn")).filter((file) =>
  readFileSync(file, "utf8").includes(`data-experiment="${EXPERIMENT}"`),
);
assert.deepEqual(allTreatmentHtml, [path.join(OUT, "learn", "10-k", "index.html")]);

if (existsSync(path.join(OUT, "industry"))) {
  for (const file of htmlFiles(path.join(OUT, "industry"))) {
    assert(!readFileSync(file, "utf8").includes(EXPERIMENT), `industry route changed: ${file}`);
  }
}

const elevenK = html("/learn/11-k/");
assert.match(elevenK, /Last updated: (?:<!-- -->)?2026-09-10/);
assert(elevenK.includes("within 90 days"));
assert(elevenK.includes("within 180 days"));
assert(elevenK.includes("https://www.sec.gov/files/form11-k.pdf"));

const untouchedDateControl = html("/learn/20-f/");
assert.match(untouchedDateControl, /Last updated: (?:<!-- -->)?2026-05-01/);
const learnArticleSource = readFileSync(
  path.join(ROOT, "components", "LearnArticle.tsx"),
  "utf8",
);
assert(learnArticleSource.includes('const DEFAULT_ARTICLE_DATE = "2026-05-01"'));
assert(!learnArticleSource.includes("dateModified ?? new Date()"));

const workerPath = path.join(ROOT, "functions", "go", "contextual-book.js");
const workerSource = readFileSync(workerPath, "utf8");
const workerModule = await import(
  `data:text/javascript;base64,${Buffer.from(workerSource).toString("base64")}`
);
assert.equal(typeof workerModule.onRequest, "function");

const originalFetch = globalThis.fetch;
const collectorCalls = [];
globalThis.fetch = async (url, init) => {
  collectorCalls.push({ url: String(url), init });
  return new Response(null, { status: 204 });
};

const freshToken = `${Date.now().toString(36)}.0123456789abcdef`;
const goodQuery = `a=${ASIN}&c=${EXPERIMENT}&t=${freshToken}`;
const goodHeaders = {
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  referer: "https://preview.example/learn/10-k/",
  cookie: `sfd_fsa_g=${freshToken}`,
};

async function invoke({
  pathname = "/go/contextual-book",
  query = goodQuery,
  headers = goodHeaders,
  method = "GET",
} = {}) {
  const tasks = [];
  const response = await workerModule.onRequest({
    request: new Request(`https://preview.example${pathname}?${query}`, {
      method,
      headers,
    }),
    waitUntil(promise) {
      tasks.push(promise);
    },
  });
  await Promise.all(tasks);
  return response;
}

const negativeCases = [
  { headers: {} },
  { headers: { ...goodHeaders, "sec-fetch-mode": "cors" } },
  { headers: { ...goodHeaders, "sec-fetch-site": "cross-site" } },
  { headers: { ...goodHeaders, referer: "https://preview.example/learn/20-f/" } },
  { headers: { ...goodHeaders, referer: "https://attacker.example/learn/10-k/" } },
  { headers: { ...goodHeaders, cookie: "sfd_fsa_g=wrong" } },
  { query: `a=${ASIN}&c=${EXPERIMENT}&t=forged` },
  {
    query: `a=${ASIN}&c=${EXPERIMENT}&t=${(Date.now() - 600_000).toString(36)}.0123456789abcdef`,
  },
  { query: `${goodQuery}&extra=1` },
  { query: `${goodQuery}&a=${ASIN}` },
  { query: goodQuery.replace(ASIN, "0000000000") },
  { query: goodQuery.replace(EXPERIMENT, "wrong-cohort") },
  { pathname: "/go/not-contextual-book" },
  { method: "POST" },
];

for (const testCase of negativeCases) {
  const before = collectorCalls.length;
  const response = await invoke(testCase);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get("location"), "https://preview.example/");
  assert.equal(collectorCalls.length, before, "rejected request emitted telemetry");
}

const accepted = await invoke();
assert.equal(accepted.status, 302);
assert.equal(accepted.headers.get("location"), `https://www.amazon.com/dp/${ASIN}?tag=${TAG}`);
assert.equal(accepted.headers.get("referrer-policy"), null);
assert.equal(collectorCalls.length, 1);
assert.deepEqual(collectorCalls[0], {
  url: "https://fleet.promptprio.com/c?s=secfilingdex.com&f=amazon-contextual-book&p=learn-10k",
  init: { method: "POST" },
});

globalThis.fetch = originalFetch;
console.log("contextual-book experiment: PASS (render isolation, controls, gate, telemetry)");
