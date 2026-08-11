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
    if (typeof window.clarity === "function") {
      window.clarity("set", "affiliate_partner", partner);
      window.clarity("event", "affiliate_click");
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "affiliate_click", {
        partner,
        link_url: href,
        // GA4 marks outbound clicks non-interaction-free by default; this keeps
        // the event in engagement reporting where conversion analysis reads it.
        transport_type: "beacon",
      });
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(["event", "affiliate_click", { partner, link_url: href }]);
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

    document.addEventListener("click", onClick, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
