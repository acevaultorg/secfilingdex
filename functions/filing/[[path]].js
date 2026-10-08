// /filing/<accession>/ that is not in this build.
//
// Bingbot spent 26% of its secfilingdex requests on 404s (Cloudflare edge, 24h to 2026-10-09; card
// mv032y8ycjh0if). Most were filing pages it learned from a once-deployed branch that never merged.
// Every one of those filers still has a live /filer/<cik>/ page, so the old URL 301s there. Any other
// well-formed accession that is not built answers 410 Gone with the normal not-found page.
// The static page is always served first: this only acts when the asset lookup returns 404.
import GONE from "../../lib/gone-filings.mjs";

const ID = /^\/filing\/([0-9]{10}-[0-9]{2}-[0-9]{6})\/?$/;

export async function onRequest(context) {
  const res = await context.next();
  if (res.status !== 404) return res;
  const url = new URL(context.request.url);
  const m = ID.exec(url.pathname);
  if (!m) return res;
  const cik = GONE[m[1]];
  if (cik) {
    return new Response(null, {
      status: 301,
      headers: { location: `${url.origin}/filer/${cik}/`, "cache-control": "public, max-age=86400" },
    });
  }
  const headers = new Headers(res.headers);
  headers.set("cache-control", "public, max-age=3600");
  return new Response(res.body, { status: 410, statusText: "Gone", headers });
}
