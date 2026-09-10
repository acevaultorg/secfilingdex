// Exact, server-accepted Amazon navigation for the early Financial Statement
// Analysis cohort. The tagged destination never appears in rendered HTML.

const ASIN = "1119457149";
const TAG = "secfilingdex-20";
const COHORT = "secfiling-fsa-20260910";
const COOKIE = "sfd_fsa_g";
const TOKEN_WINDOW_MS = 2 * 60 * 1000;
const ELIGIBLE_REFERRERS = new Set(["/learn/10-k/"]);
const COLLECTOR =
  "https://fleet.promptprio.com/c?s=secfilingdex.com&f=amazon-contextual-book&p=learn-10k";

function reject(url) {
  return new Response(null, {
    status: 302,
    headers: {
      location: `${url.origin}/`,
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

function tokenFresh(token, now = Date.now()) {
  const match = /^([0-9a-z]{8,10})\.([0-9a-f]{16})$/.exec(token || "");
  if (!match) return false;
  const issuedAt = Number.parseInt(match[1], 36);
  return Number.isFinite(issuedAt) && Math.abs(now - issuedAt) <= TOKEN_WINDOW_MS;
}

function cookieValue(request, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(?:^|;\\s*)${escaped}=([^;]+)`).exec(
    request.headers.get("cookie") || "",
  );
  return match ? match[1] : "";
}

function accepted(request, url) {
  if (url.pathname !== "/go/contextual-book") return false;
  if (request.method !== "GET") return false;
  if (request.headers.get("sec-fetch-mode") !== "navigate") return false;
  if (!["same-origin", "same-site"].includes(request.headers.get("sec-fetch-site"))) {
    return false;
  }
  if (/prefetch/i.test(request.headers.get("purpose") || "")) return false;
  if (/prefetch/i.test(request.headers.get("sec-purpose") || "")) return false;

  const keys = [...url.searchParams.keys()];
  if (keys.length !== 3 || !["a", "c", "t"].every((key) => keys.includes(key))) {
    return false;
  }
  if (["a", "c", "t"].some((key) => url.searchParams.getAll(key).length !== 1)) {
    return false;
  }
  if (url.searchParams.get("a") !== ASIN || url.searchParams.get("c") !== COHORT) {
    return false;
  }

  const token = url.searchParams.get("t") || "";
  if (!tokenFresh(token) || cookieValue(request, COOKIE) !== token) return false;

  try {
    const referrer = new URL(request.headers.get("referer") || "");
    return referrer.origin === url.origin && ELIGIBLE_REFERRERS.has(referrer.pathname);
  } catch {
    return false;
  }
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  if (!accepted(request, url)) return reject(url);

  // This first-party beacon is the fleet's canonical, consent-independent
  // Amazon-click metric. It runs only in this accepted branch; the page-side
  // delegated tracker explicitly skips this server-tracked link.
  context.waitUntil(
    fetch(COLLECTOR, { method: "POST" }).catch(() => undefined),
  );

  return new Response(null, {
    status: 302,
    headers: {
      location: `https://www.amazon.com/dp/${ASIN}?tag=${TAG}`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
