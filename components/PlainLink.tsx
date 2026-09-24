// `next/link` is aliased to this file (next.config.js, webpack). scripts/prune-out.mjs deletes Next's
// RSC soft-nav payloads (out/**/index.txt) to stay under CF Pages' 20k-file cap, so every next/link
// prefetch and client navigation 404'd and then fell back to a full page load anyway (site guard,
// 2026-09-24). A plain anchor does that full load directly with no failed requests.
import type { AnchorHTMLAttributes } from 'react';

type Href = string | { pathname?: string | null; hash?: string | null };
type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: Href;
  prefetch?: boolean | null;
  scroll?: boolean;
  replace?: boolean;
  shallow?: boolean;
  locale?: string | false;
  legacyBehavior?: boolean;
  passHref?: boolean;
};

// next.config.js has trailingSlash: true and next/link appended the slash to internal paths itself;
// keep the served hrefs byte-identical (/about -> /about/), never on files (/llms.txt) or other hosts.
function withSlash(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const m = href.match(/^([^?#]*)(.*)$/);
  const path = m ? m[1] : href;
  const rest = m ? m[2] : '';
  if (path.endsWith('/') || /\.[a-z0-9]+$/i.test(path)) return href;
  return `${path}/${rest}`;
}

export default function PlainLink({ href, prefetch, scroll, replace, shallow, locale, legacyBehavior, passHref, ...rest }: Props) {
  const raw = typeof href === 'string' ? href : `${href.pathname ?? '/'}${href.hash ? `#${href.hash}` : ''}`;
  const h = withSlash(raw);
  return <a href={h} {...rest} />;
}
