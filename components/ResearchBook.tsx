"use client";

import type { MouseEvent, PointerEvent } from "react";
import {
  CONTEXTUAL_BOOK,
  
  
} from "@/lib/contextual-book";

const TOKEN_COOKIE = "sfd_research_g";
const CONTEXTUAL_BOOK_GATE_PATH = "/go/research-book";
const CONTEXTUAL_BOOK_EXPERIMENT = "research-coverage-20260927";

function armTrustedNavigation(
  event: MouseEvent<HTMLAnchorElement> | PointerEvent<HTMLAnchorElement>,
) {
  const nativeEvent = event.nativeEvent;
  const anchor = event.currentTarget;

  // Programmatic clicks are not purchase intent. Failing closed here also keeps
  // crawlers that execute element.click() from receiving a navigation token.
  if (!nativeEvent.isTrusted || typeof window === "undefined") {
    event.preventDefault();
    return;
  }

  try {
    const url = new URL(anchor.href, window.location.origin);
    const exactShape =
      url.origin === window.location.origin &&
      url.pathname === CONTEXTUAL_BOOK_GATE_PATH &&
      url.searchParams.getAll("a").length === 1 &&
      url.searchParams.get("a") === CONTEXTUAL_BOOK.asin &&
      url.searchParams.getAll("c").length === 1 &&
      url.searchParams.get("c") === CONTEXTUAL_BOOK_EXPERIMENT &&
      [...url.searchParams.keys()].every((key) => ["a", "c", "t"].includes(key));

    if (!exactShape || typeof window.crypto?.getRandomValues !== "function") {
      event.preventDefault();
      return;
    }

    const random = new Uint8Array(8);
    window.crypto.getRandomValues(random);
    const nonce = [...random].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    const token = `${Date.now().toString(36)}.${nonce}`;

    document.cookie = `${TOKEN_COOKIE}=${token}; Path=/go; Max-Age=120; SameSite=Lax; Secure`;
    url.searchParams.set("t", token);
    anchor.href = `${url.pathname}${url.search}`;
  } catch {
    event.preventDefault();
  }
}

export function ResearchBook() {
  return (
    <aside
      aria-labelledby="research-book-heading"
      data-experiment={CONTEXTUAL_BOOK_EXPERIMENT}
      className="my-10 rounded-lg border border-brand-soft bg-surface-brand px-5 py-4"
    >
      <p className="text-eyebrow text-brand mb-1">Related reference</p>
      <h2 id="research-book-heading" className="text-heading-3 text-text mb-2">
        A reference for reading financial statements
      </h2>
      <p className="text-body-sm text-muted mb-3">
        <cite>{CONTEXTUAL_BOOK.title}</cite> by {CONTEXTUAL_BOOK.authors} covers
        balance sheets, income statements, cash-flow statements, and GAAP and
        non-GAAP reporting.
      </p>
      <p className="text-muted text-[13px] leading-5 mb-3">Paid link. As an Amazon Associate I earn from qualifying purchases. General educational reference; not investment advice.</p>
      <a
        href="/go/research-book?a=1119457149&c=research-coverage-20260927"
        target="_blank"
        rel="sponsored nofollow noopener"
        data-event="amazon_click"
        data-affiliate="amazon-research-book"
        
        data-book={CONTEXTUAL_BOOK.title}
        onPointerDown={armTrustedNavigation}
        onClick={armTrustedNavigation}
        onAuxClick={armTrustedNavigation}
        className="inline-flex min-h-11 items-center rounded-md border border-brand-soft px-3.5 py-2 text-sm font-medium text-brand transition-colors hover:border-brand hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-brand"
      >
        See the fifth edition on Amazon <span aria-hidden="true">→</span>
      </a>

    </aside>
  );
}
