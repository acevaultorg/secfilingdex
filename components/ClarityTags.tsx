"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Microsoft Clarity custom-tag + custom-event wiring.
 *
 * Clarity supports 4 first-class augmentations beyond the default IIFE loader:
 *   1. `clarity('set', key, value)`   — segment recordings by tag (page_type, site_version)
 *   2. `clarity('event', eventName)`  — flag specific user actions in the recording
 *   3. `clarity('identify', ...)`     — link recordings to a user (we have no auth; skipped)
 *   4. `clarity('upgrade', reason)`   — force-record a session even past quota cutoff
 *
 * This component handles (1) + (2). It runs only after consent has been granted via
 * CookieConsent — Clarity's loader respects the `clarity('consent', false)` default
 * until the user accepts, so calling 'set'/'event' before consent is queued safely
 * by Clarity's own request-buffering (`c[a].q`).
 *
 * Page-type taxonomy (matters for filter views in Clarity dashboard):
 *   - home          → /
 *   - filing        → /filing/[accession]
 *   - filer         → /filer or /filer/[cik]
 *   - form          → /form or /form/[formType]
 *   - industry      → /industry or /industry/[sicCode]
 *   - learn         → /learn or /learn/[topic]
 *   - search        → /search
 *   - meta          → /about, /contact, /privacy, /terms
 *
 * Custom events fired:
 *   - edgar_outbound — every click on an external EDGAR link (signals research depth)
 *   - learn_75       — scroll past 75% on a /learn page (engagement on explainers)
 *
 * Search + filing-view events are fired from their respective page components
 * directly via `window.clarity('event', ...)` for tighter control.
 */

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Fire an affiliate outbound click into the analytics the site ALREADY loads.
 * No new vendor: Microsoft Clarity + GA4, both already in app/layout.tsx.
 *
 * Clarity's `event` API takes a name only — it carries no properties — so the
 * partner slug goes on as a session tag immediately before the event, which is
 * the documented pattern and matches how page_type is tagged above.
 *
 * GA4 gets the slug as a real event parameter. `gtag` is declared inside an
 * inline <script> in layout.tsx, so it lands on window; the dataLayer.push
 * fallback covers the case where the gtag shim has not evaluated yet (the
 * consent block queues on dataLayer anyway, so nothing is lost).
 *
 * Every call site is guarded: a missing vendor must never throw inside a click
 * handler, because that would break navigation on the link the user clicked.
 */
function trackAffiliateClick(partner: string, href: string) {
  try {
    // Is this an Amazon-family slug? FilingsReading emits `amazon-book` and
    // `amazon-audible`; PartnerTools emits data/research/education slugs.
    const isAmazon = /^amazon/.test(partner);
    // The flat Audible free-trial bounty converts without a purchase and is the
    // top-$ action here, so it must be separable from book commission downstream.
    const isBounty = /audible|MTRIAL/i.test(href) || partner === "amazon-audible";
    // Our own automation must be subtractable, not silently dropped.
    const isAgent =
      typeof window !== "undefined" &&
      ((window as unknown as { __FLEET_AGENT__?: unknown }).__FLEET_AGENT__ === 1 ||
        (typeof navigator !== "undefined" && navigator.webdriver === true));

    if (typeof window.clarity === "function") {
      window.clarity("set", "affiliate_partner", partner);
      window.clarity("event", "affiliate_click");
      // Clarity's fleet-standard event name, so this site is nameable alongside
      // the rest of the fleet rather than showing as untracked.
      if (isAmazon) window.clarity("event", "amazon_click");
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "affiliate_click", {
        partner,
        link_url: href,
        // GA4 marks outbound clicks non-interaction-free by default; this keeps
        // the event in engagement reporting where conversion analysis reads it.
        transport_type: "beacon",
      });
      // ⚠️ LOAD-BEARING EVENT NAME. The fleet metrics layer pulls GA4 with
      // inListFilter ['amazon_click','click'] (tooling/55-fleet-dashboard/worker
      // /index.mjs). Emitting ONLY `affiliate_click` meant every click here was
      // dropped at the filter, so amazon_clicks_30d read null and this site
      // ranked as unmonetized despite a live, compliant Amazon shelf.
      if (isAmazon) {
        window.gtag("event", "amazon_click", {
          partner,
          link_url: href,
          cta_position: partner,
          transport_type: "beacon",
        });
      }
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(["event", "affiliate_click", { partner, link_url: href }]);
      if (isAmazon) {
        window.dataLayer.push(["event", "amazon_click", { partner, link_url: href }]);
      }
    }

    // First-party beacon. Without this the fleet dashboard has no click column
    // for this site at all, which is what makes the gate/no-gate decision in
    // affiliate-link-gate.md uncomputable (that rule triggers on a DROP in the
    // click-capture ratio, and a null ratio can never drop).
    if (isAmazon && typeof navigator !== "undefined" && navigator.sendBeacon) {
      const q =
        "https://fleet.promptprio.com/c?s=secfilingdex.com&f=" +
        encodeURIComponent(partner) +
        (partner === "amazon-research-book" ? "&p=" + encodeURIComponent(pathnameToPageType(window.location.pathname)) : "") +
        (isBounty ? "&t=b" : "") +
        (isAgent ? "&a=1" : "");
      navigator.sendBeacon(q);
    }
  } catch {
    // Analytics must never interfere with the outbound navigation.
  }
}

const SITE_VERSION = process.env.NEXT_PUBLIC_BUILD_SHA || "dev";

function pathnameToPageType(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/filing")) return "filing";
  if (pathname.startsWith("/filer")) return "filer";
  if (pathname.startsWith("/form")) return "form";
  if (pathname.startsWith("/industry")) return "industry";
  if (pathname.startsWith("/learn")) return "learn";
  if (pathname.startsWith("/search")) return "search";
  if (
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms")
  )
    return "meta";
  return "other";
}

export function ClarityTags() {
  const pathname = usePathname();

  // Set page_type + site_version tags on every route change so Clarity recordings
  // are filterable in the dashboard by section. Tags are cumulative per-session.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.clarity !== "function") return;
    const pageType = pathnameToPageType(pathname);
    window.clarity("set", "page_type", pageType);
    window.clarity("set", "site_version", SITE_VERSION);
    window.clarity("set", "archetype", "static-reference");
  }, [pathname]);

  // Outbound-click instrumentation — track every click on an external EDGAR link
  // and 75%-scroll on /learn pages. Single mount-time listener; no per-component
  // wiring required.
  useEffect(() => {
    if (typeof window === "undefined") return;

    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement | null)?.closest?.("a");
      if (!target) return;
      const href = target.getAttribute("href") || "";

      // Affiliate outbound — every monetised anchor on the site is marked with
      // `data-affiliate="<slug>"`, so this one delegated listener covers the
      // Amazon shelf on /learn/[form] AND the PartnerTools box on filing pages.
      //
      // This closes a real measurement gap: FilingsReading has always emitted
      // `data-event="amazon_click"`, but nothing ever read that attribute, so
      // affiliate clicks were reaching Amazon completely untracked on both
      // Clarity and GA4.
      const partner = target.getAttribute("data-affiliate");
      if (partner) {
        if (partner === "amazon-research-book" && !e.isTrusted) return;
        // The isolated in-article book treatment is counted by its Pages Function only
        // AFTER the server accepts the gesture/navigation gate. Counting here
        // would turn rejected bot/programmatic attempts into false clicks and
        // double-count accepted ones. Existing shelf + Audible controls keep
        // using this client path unchanged.
        if (target.getAttribute("data-server-tracked") === "true") return;
        trackAffiliateClick(partner, href);
        return;
      }

      if (
        href.startsWith("https://www.sec.gov") ||
        href.startsWith("https://efts.sec.gov")
      ) {
        window.clarity?.("event", "edgar_outbound");
      }
    }

    function onAuxClick(e: MouseEvent) {
      if (e.button === 1) onClick(e);
    }

    let learnScrollFired = false;
    function onScroll() {
      if (learnScrollFired) return;
      if (!window.location.pathname.startsWith("/learn/")) return;
      const scrolled =
        (window.scrollY + window.innerHeight) /
        document.documentElement.scrollHeight;
      if (scrolled >= 0.75) {
        window.clarity?.("event", "learn_75");
        learnScrollFired = true;
      }
    }

    // Capture phase + auxclick is the fleet standard. Bubble-phase alone loses a
    // click whose handler stops propagation, and without auxclick every
    // middle-click — the natural gesture for "open this book in a new tab" on a
    // reference site — went uncounted.
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onAuxClick, true);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onAuxClick, true);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
