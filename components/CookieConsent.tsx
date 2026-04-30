"use client";

import { useEffect, useState } from "react";

/**
 * Cookie consent banner — AdSense readiness prerequisite.
 *
 * Per `~/.claude/rules/adsense-compliance.md` Day 6 gate:
 *   - First visitors see clear Accept / Reject options
 *   - GA4 + AdSense cookies do NOT fire until accept
 *   - Plausible (cookieless) runs unconditionally — no consent needed
 *   - Choice persisted to localStorage; banner doesn't re-show
 *   - Privacy-default: rejecting is one click, equally weighted with accept
 *
 * GA4 Consent Mode v2 defaults are DENIED (set in layout.tsx). On Accept,
 * `gtag('consent', 'update', ...)` flips ad/analytics storage to granted.
 *
 * For Day 7+ EU/UK personalized-ads, this can be swapped for a
 * Google-certified CMP (Cookiebot, OneTrust). For Day 6 application this
 * satisfies the "first-time visitor consent" + "clear accept/reject"
 * AdSense readiness criteria.
 */

const STORAGE_KEY = "secfdx-consent";
type Consent = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (...args: unknown[]) => void;
  }
}

function applyConsent(state: Consent): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  }
  if (typeof window.plausible === "function") {
    window.plausible("consent", { props: { state } });
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  // Render only on first visit. Read localStorage on mount.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "granted" || stored === "denied") {
        applyConsent(stored as Consent);
      } else {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (private mode / SSR mismatch) — show banner.
      setVisible(true);
    }
  }, []);

  function decide(state: Consent) {
    try {
      window.localStorage.setItem(STORAGE_KEY, state);
    } catch {
      // ignore — operator chose, we proceed even if storage failed
    }
    applyConsent(state);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p id="consent-title" className="text-eyebrow text-brand mb-1.5">
            Cookies
          </p>
          <p id="consent-body" className="text-body-sm text-muted">
            We use a cookieless analytics signal (Plausible) by default. With
            your permission we also enable Google Analytics for product
            improvement.{" "}
            <a
              href="/privacy/"
              className="underline decoration-border hover:decoration-text hover:text-text transition-colors"
            >
              Privacy policy
            </a>
            .
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-btn border border-border text-muted hover:text-text hover:border-border-bright transition-colors"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-btn bg-brand text-text font-medium hover:shadow-brand-glow-sm transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
