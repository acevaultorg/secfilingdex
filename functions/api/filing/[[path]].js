// /api/filing/<accession>.json that is not deployed.
//
// Only the 1,000 most recent filings keep a JSON twin (scripts/prune-out.mjs, Cloudflare Pages' 20,000-file
// cap). Pages linked every twin until 2026-10-09, so Bingbot kept requesting pruned ones and got 404s
// (card mv032y8ycjh0if). A missing twin now answers 410 Gone with a pointer to the HTML page and the index.
const ID = /^\/api\/filing\/([0-9]{10}-[0-9]{2}-[0-9]{6})\.json$/;

export async function onRequest(context) {
  const res = await context.next();
  if (res.status !== 404) return res;
  const url = new URL(context.request.url);
  const m = ID.exec(url.pathname);
  if (!m) return res;
  const body = {
    error: "gone",
    detail: "JSON twins are published for the 1,000 most recent filings only.",
    filing_page: `${url.origin}/filing/${m[1]}/`,
    index: `${url.origin}/api/filings.json`,
  };
  return new Response(JSON.stringify(body) + "\n", {
    status: 410,
    statusText: "Gone",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "x-robots-tag": "noindex",
    },
  });
}
