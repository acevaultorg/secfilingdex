// Amili Kit: list-filter inject — turns a list a template only MARKS into the filter + fold block, on the built HTML.
// For sites whose templates are React/Next (no string renderer at build time) and for any list a build script would rather mark than render.
// CANONICAL: VAULT-Fleet/tooling/fleet-kit/list-filter/inject.mjs. sync.sh vendors it as kit/list-filter-inject.mjs.
//
//   node kit/list-filter-inject.mjs out            (run after the build, before the upload; idempotent)
//
// The template marks the list element and, optionally, each item:
//   <ul data-ak-lf="games" data-ak-lf-label="games" data-ak-lf-phone="8" data-ak-lf-wide="16"
//       data-ak-lf-placeholder="Find a game" data-ak-lf-facets="Players,Weight">         <- the list (ul, ol, div, section, table)
//     <li data-ak-f-Players="2" data-ak-f-Weight="Light" data-ak-q="extra search words">…</li>
//   data-ak-lf-filter="0" = fold only, no filter bar. For a <table> the rows of its first <tbody> are the items.
// Every item stays in the HTML. The page gets the (small) CSS and the script once.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderFilterFold, listFilterCss, LIST_FILTER_JS } from './list-filter.mjs';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style', 'textarea', 'title']);
const unesc = (s) => String(s).replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// Minimal HTML tokenizer: enough for well-formed (React / template) output. Returns tags with their source offsets.
export function tokenize(html) {
  const out = [];
  const re = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!doctype[^>]*>|<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    if (m[0][1] === '!') continue;
    const name = m[2].toLowerCase(), close = m[1] === '/';
    const self = !close && (VOID.has(name) || /\/\s*$/.test(m[3]));
    out.push({ name, close, self, start: m.index, end: m.index + m[0].length, attrs: m[3] });
    if (!close && !self && RAW.has(name)) {
      const e = html.toLowerCase().indexOf('</' + name, re.lastIndex);
      if (e > 0) re.lastIndex = e;
    }
  }
  return out;
}
const attr = (attrs, name) => { const m = new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i').exec(attrs); return m ? unesc(m[1] != null ? m[1] : m[2]) : null; };
const allAttrs = (attrs) => { const o = {}; const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g; let m; while ((m = re.exec(attrs))) o[m[1]] = unesc(m[2] != null ? m[2] : m[3]); return o; };

// Direct child elements of the element opened by tokens[i]: [{start, end, tokIdx}] and the index of its closing token.
function children(tokens, i) {
  const kids = []; let depth = 0, cur = null;
  for (let j = i + 1; j < tokens.length; j++) {
    const t = tokens[j];
    if (depth === 0 && t.close) return t.name === tokens[i].name ? { kids, closeIdx: j } : null;
    if (t.close) { depth--; if (depth === 0 && cur) { cur.end = t.end; kids.push(cur); cur = null; } continue; }
    if (depth === 0) {
      if (t.self) { kids.push({ start: t.start, end: t.end, tokIdx: j }); continue; }
      cur = { start: t.start, end: t.end, tokIdx: j }; depth = 1; continue;
    }
    if (!t.self) depth++;
  }
  return null;
}

function openTagWithout(html, t, drop) {
  let raw = html.slice(t.start, t.end);
  for (const d of drop) raw = raw.replace(new RegExp(`\\s${d}\\s*=\\s*(?:"[^"]*"|'[^']*')`, 'i'), '');
  return raw;
}

// Decorates ONE marked list (the first not yet processed). Returns the new html or null when there is none.
function skipMark(html, t) { return html.slice(0, t.start) + html.slice(t.start, t.end).replace(/(\s)data-ak-lf(\s*=)/, '$1data-ak-lf-skipped$2') + html.slice(t.end); }
function decorateFirst(html, used) {
  const tokens = tokenize(html);
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.close || t.self || !/(?:^|\s)data-ak-lf\s*=/.test(t.attrs)) continue;
    const id = attr(t.attrs, 'data-ak-lf');
    if (!id || used.has(id)) return { html: skipMark(html, t), phone: null, wide: null, skipped: true };
    const ch = children(tokens, i);
    if (!ch) return { html: skipMark(html, t), phone: null, wide: null, skipped: true };
    const containerEnd = tokens[ch.closeIdx].end;
    const opt = (k) => attr(t.attrs, 'data-ak-lf-' + k);
    const isTable = t.name === 'table';
    let kids = ch.kids, head = '';
    if (isTable) {
      const tb = kids.find((k) => tokens[k.tokIdx].name === 'tbody');
      const th = kids.find((k) => tokens[k.tokIdx].name === 'thead');
      if (!tb) return { html: skipMark(html, t), phone: null, wide: null, skipped: true };
      head = th ? html.slice(th.start, th.end).replace(/^<thead[^>]*>|<\/thead>$/gi, '') : '';
      const inner = children(tokens, tb.tokIdx);
      kids = inner.kids;
    }
    const facetKeys = (opt('facets') || '').split(',').map((x) => x.trim()).filter(Boolean);
    const items = kids.map((k) => {
      const kt = tokens[k.tokIdx], h = html.slice(k.start, k.end);
      const aa = Object.fromEntries(Object.entries(allAttrs(kt.attrs)).map(([k2, v2]) => [k2.toLowerCase(), v2])), f = {};
      for (const key of facetKeys) if (aa['data-ak-f-' + key.toLowerCase()] != null) f[key] = aa['data-ak-f-' + key.toLowerCase()];
      return { html: h, q: (aa['data-ak-q'] ? aa['data-ak-q'] + ' ' : '') + h.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ') + ' ' + Object.values(f).join(' '), f };
    });
    const phone = +opt('phone') || 8, wide = +opt('wide') || 16;
    const cls = (attr(t.attrs, 'class') || '').trim();
    const rest = openTagWithout(html, t, ['data-ak-lf', 'data-ak-lf-label', 'data-ak-lf-phone', 'data-ak-lf-wide', 'data-ak-lf-placeholder', 'data-ak-lf-facets', 'data-ak-lf-filter', 'class', 'id'])
      .replace(/^<[a-zA-Z0-9:-]+/, '').replace(/\/?>$/, '').trim();
    const block = renderFilterFold({
      id, label: opt('label') || 'items', tag: isTable ? 'table' : t.name, raw: true, head, items,
      facets: facetKeys.map((k) => ({ key: k, label: k })), phone, wide, filter: opt('filter') !== '0',
      placeholder: opt('placeholder') || undefined, className: cls, listAttrs: rest,
    });
    used.add(id);
    return { html: html.slice(0, t.start) + block + html.slice(containerEnd), phone, wide };
  }
  return null;
}

// html -> { html, lists } ; the page gets CSS (only the fold counts it uses) and the script once.
export function injectHtml(html) {
  if (!/data-ak-lf\s*=/.test(html)) return { html, lists: 0 };
  const used = new Set(), counts = new Set(); let lists = 0, guard = 0;
  for (;;) {
    if (++guard > 200) break;
    const r = decorateFirst(html, used);
    if (!r) break;
    html = r.html;
    if (r.skipped) continue;
    counts.add(r.phone); counts.add(r.wide); lists++;
  }
  if (!lists) return { html, lists: 0 };
  if (!/data-ak-lf-css/.test(html)) {
    html = html.replace(/<\/head>/i, `<style data-ak-lf-css>${listFilterCss([...counts].sort((a, b) => a - b))}</style></head>`);
    html = html.replace(/<\/body>/i, `<script data-ak-lf-js>${LIST_FILTER_JS}</script></body>`);
  }
  return { html, lists };
}

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '_next') walk(p, files); } else if (e.name.endsWith('.html')) files.push(p);
  }
  return files;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const dir = process.argv[2];
  if (!dir || !fs.existsSync(dir)) { console.error('usage: node list-filter-inject.mjs <outDir>'); process.exit(2); }
  let pages = 0, lists = 0;
  for (const f of walk(dir)) {
    const h = fs.readFileSync(f, 'utf8');
    if (!h.includes('data-ak-lf=')) continue;
    const r = injectHtml(h);
    if (r.lists) { fs.writeFileSync(f, r.html); pages++; lists += r.lists; }
  }
  console.log(`list-filter-inject: ${lists} list(s) on ${pages} page(s)`);
}
