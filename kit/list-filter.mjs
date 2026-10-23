// VENDORED Amili Kit v1.17.3 (list-filter.mjs sha256 6b3f032e857f) from VAULT-Fleet/tooling/fleet-kit/list-filter/list-filter.mjs — do not edit here; re-run sync.sh.
// Amili Kit: list-filter — a long list becomes a filter bar (text search + a few facet chips) over a list folded to one
// phone screen with "Show all N". Every item stays in the HTML (SEO, no-JS, print). Paulo 2026-10-12 (card mv4zvbdfnnb44i,
// "one massive compare list without filters"; espressospecdb /compare/ finder is the reference, rule #66 ONE SCREEN PER SECTION).
// CANONICAL: VAULT-Fleet/tooling/fleet-kit/list-filter/list-filter.mjs. Sites vendor it with sync.sh (kit/list-filter.mjs).
//
//   import { renderFilterFold, LIST_FILTER_CSS, LIST_FILTER_JS } from './kit/list-filter.mjs';
//   renderFilterFold({ id: 'parks', label: 'parks', tag: 'div', className: 'monthgrid',
//     items: [{ html: '<a href="/park/x/">X</a>', q: 'x yosemite california', f: { region: 'West' } }, ...],
//     facets: [{ key: 'region', label: 'Region' }], phone: 8, wide: 16, placeholder: 'Filter parks' })
//
// items: a string (query text is taken from its visible text) or { html, q?, f?: {facetKey: value} }.
// tag 'ul' | 'ol' | 'div' (any element name) wraps each item in <li>/<div class="ak-lf-it"> unless raw. With raw: true the item html IS the element
// (an <a> in a grid, a <div class="card">): the kit only adds data attributes to its first tag, so the site's grid CSS
// keeps working. tag 'table' (wrapped in div.ak-lf-twrap, plus o.tableWrap as an extra class) needs head ('<tr><th>..</th></tr>') and items that are '<tr>…</tr>' strings (always raw).
// FOLD_CSS is NOT needed: list-filter carries its own fold (ak-lf-* classes only).
// filter: false = fold only (no text box / chips), for lists of ~12-40 items where a filter would be noise.
// The fold itself is CSS at first paint (checkbox + label, no layout shift, no JS needed to see everything);
// the filter is the only part that needs JS: the bar's space is reserved at first paint (no layout shift) and it is
// invisible and inert (visibility:hidden) until the script marks the block .ak-lf-js.
// While a filter is active the list shows every match (the fold opens), and "Show all N" returns when it is cleared.

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (h) => String(h == null ? '' : h).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
const normQ = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const fkey = (k, v) => `${k}:${normQ(v).replace(/ /g, '-')}`;

// Adds attributes to the first opening tag of an html string (no wrapper element).
function tagFirst(html, attrs) {
  return String(html).replace(/^(\s*<[a-zA-Z][a-zA-Z0-9]*)/, `$1 ${attrs}`);
}

function buildFacets(items, defs) {
  return (defs || []).map((fc) => {
    const counts = new Map();
    for (const it of items) { const v = it.f && it.f[fc.key]; if (v != null && v !== '') counts.set(String(v), (counts.get(String(v)) || 0) + 1); }
    let vals = fc.values ? fc.values.filter((v) => counts.has(String(v))).map(String) : [...counts.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([v]) => v);
    vals = vals.slice(0, Math.max(2, +fc.max || 6));
    return { key: fc.key, label: fc.label || fc.key, vals, counts };
  }).filter((fc) => fc.vals.length >= 2);
}
function barMarkup(id, ph, listId, facets) {
  const chips = facets.map((fc) => `<div class="ak-lf-facet" role="group" aria-label="${esc(fc.label)}" data-k="${esc(fc.key)}"><span class="ak-lf-fl">${esc(fc.label)}</span>`
    + fc.vals.map((v) => `<button type="button" class="ak-lf-chip" data-v="${esc(fkey(fc.key, v))}" aria-pressed="false">${esc(v)}</button>`).join('') + '</div>').join('');
  return `<div class="ak-lf-bar"><input type="search" class="ak-lf-q" id="ak-lf-${id}-q" autocomplete="off" enterkeyhint="search" placeholder="${ph}" aria-label="${ph}" aria-controls="${listId}">${chips}</div>`;
}
function itemAttrs(it, facets) {
  const q = normQ(it.q != null ? it.q : plain(it.html));
  const f = Object.entries(it.f || {}).filter(([k]) => facets.some((fc) => fc.key === k)).map(([k, v]) => fkey(k, v)).join(' ');
  return f ? { 'data-q': q, 'data-f': f } : { 'data-q': q };
}

export function renderFilterFold(o = {}) {
  if (!/^[a-z][a-z0-9-]*$/.test(o.id || '')) throw new Error('Amili Kit list-filter: id (lowercase, a-z0-9-) is required');
  const tag = /^[a-z][a-z0-9]*$/.test(o.tag || '') ? o.tag : 'ul';
  const isTable = tag === 'table';
  const raw = isTable || !!o.raw;
  const li = /^(ul|ol)$/.test(tag) ? 'li' : 'div';
  const listAttrs = o.listAttrs ? ' ' + o.listAttrs : '';
  const items = (o.items || []).map((x) => (typeof x === 'string' ? { html: x } : x));
  const n = items.length;
  const phone = Math.max(1, +o.phone || 6), wide = Math.max(phone, +o.wide || 12);
  const what = o.label ? ' ' + esc(o.label) : '';
  const facets = buildFacets(items, o.facets);
  const body = items.map((it) => {
    const attrs = Object.entries(itemAttrs(it, facets)).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
    if (raw) return tagFirst(it.html, attrs);
    return `<${li} class="ak-lf-it" ${attrs}>${it.html}</${li}>`;
  });
  const cls = o.className ? ' ' + esc(o.className) : '';
  const foldOn = n > phone;
  const listId = `ak-lf-${o.id}-list`;
  const list = isTable
    ? `<div class="ak-lf-twrap${o.tableWrap ? ' ' + esc(o.tableWrap) : ''}"><table class="ak-lf-tbl${cls}" id="${listId}"${listAttrs}><thead>${o.head || ''}</thead><tbody>${body.join('')}</tbody></table></div>`
    : `<${tag} class="ak-lf-flist${cls}" id="${listId}"${listAttrs}>${body.join('')}</${tag}>`;
  const bar = n > 1 && o.filter !== false ? barMarkup(o.id, esc(o.placeholder || 'Filter' + (o.label ? ' ' + o.label : '')), listId, facets)
    + `<p class="ak-lf-status" role="status" aria-live="polite" hidden></p>` : '';
  const cb = foldOn ? `<input type="checkbox" class="ak-lf-cb" id="ak-lf-${o.id}-cb" aria-controls="${listId}">` : '';
  const btn = foldOn ? `<label class="ak-lf-btn${n <= wide ? ' ak-lf-ponly' : ''}" for="ak-lf-${o.id}-cb"><span class="ak-lf-more">Show all ${n}${what}</span><span class="ak-lf-less">Show less</span></label>` : '';
  const none = `<p class="ak-lf-none" hidden>No${what || ' items'} match. <button type="button" class="ak-lf-reset">Clear the filter</button></p>`;
  const foldAttrs = foldOn ? ` style="--ak-lf-p:${phone};--ak-lf-w:${wide}" data-p="${phone}" data-w="${wide}"` : '';
  return `<div class="ak-lf${foldOn ? '' : ' ak-lf-nofold'}" id="ak-lf-${o.id}" data-total="${n}" data-label="${esc(o.label || 'items')}"${foldAttrs}>${bar}${none}${cb}${list}${btn}</div>`;
}

// ---- React / Next sites: the template renders the parts itself (no HTML rewriting after the build) -------------------
// A hydrated page must not be rewritten by a build step (React discards what it did not render, #418). So the template
// calls prepareFilter() and renders: <div {...wrap}> <div dangerouslySetInnerHTML={{__html: barHtml}}/> <input {...cb}/>
// <ul {...list}>{items.map((x, i) => <li {...item[i]}>…</li>)}</ul> <label {...btn}><span className="ak-lf-more">{more}</span>
// <span className="ak-lf-less">Show less</span></label> </div>. barHtml is the same string on server and client, so it
// hydrates cleanly; the script only adds listeners / [hidden] after hydration. Put list.className after your own classes.
export function prepareFilter(o = {}) {
  if (!/^[a-z][a-z0-9-]*$/.test(o.id || '')) throw new Error('Amili Kit list-filter: id (lowercase, a-z0-9-) is required');
  const items = o.items || [];
  const n = items.length;
  const phone = Math.max(1, +o.phone || 6), wide = Math.max(phone, +o.wide || 12);
  const what = o.label ? ' ' + esc(o.label) : '';
  const facets = buildFacets(items, o.facets);
  const foldOn = n > phone;
  const ph = esc(o.placeholder || 'Filter' + (o.label ? ' ' + o.label : ''));
  const barHtml = (n > 1 && o.filter !== false ? barMarkup(o.id, ph, `ak-lf-${o.id}-list`, facets) + '<p class="ak-lf-status" role="status" aria-live="polite" hidden></p>' : '')
    + `<p class="ak-lf-none" hidden>No${what || ' items'} match. <button type="button" class="ak-lf-reset">Clear the filter</button></p>`;
  return {
    foldOn, total: n,
    wrap: { className: 'ak-lf' + (foldOn ? '' : ' ak-lf-nofold'), id: `ak-lf-${o.id}`, 'data-total': String(n), 'data-label': o.label || 'items', ...(foldOn ? { 'data-p': String(phone), 'data-w': String(wide) } : {}) },
    barHtml,
    cb: { type: 'checkbox', className: 'ak-lf-cb', id: `ak-lf-${o.id}-cb`, 'aria-controls': `ak-lf-${o.id}-list` },
    list: { className: 'ak-lf-flist', id: `ak-lf-${o.id}-list` },
    btn: { className: 'ak-lf-btn' + (n <= wide ? ' ak-lf-ponly' : ''), htmlFor: `ak-lf-${o.id}-cb` },
    more: `Show all ${n}${o.label ? ' ' + o.label : ''}`,
    item: items.map((it) => itemAttrs(it, facets)),
  };
}

const N = Array.from({ length: 30 }, (_, i) => i + 1);
// listFilterCss([phone, wide, ...]) emits the fold rules only for the counts a page uses (the full set is ~17 KB);
// LIST_FILTER_CSS is every count 1..30 for kit demos and tests.
export const listFilterCss = (ns = N) => `.ak-lf{position:relative;margin:12px 0}
.ak-lf [hidden]{display:none!important}
.ak-lf-bar{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;margin:0 0 10px}
.ak-lf:not(.ak-lf-js) .ak-lf-bar{visibility:hidden}
.ak-lf-q{flex:1 1 220px;min-width:0;max-width:100%;box-sizing:border-box;min-height:44px;padding:0 14px;border:1px solid color-mix(in srgb,currentColor 30%,transparent);border-radius:10px;background:transparent;color:inherit;font:inherit;font-size:16px}
.ak-lf-q:focus-visible,.ak-lf-chip:focus-visible,.ak-lf-reset:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.ak-lf-facet{display:flex;flex-wrap:wrap;gap:6px;align-items:center;flex:1 1 100%;min-width:0}
.ak-lf-fl{font-size:13px;opacity:.7;margin-right:2px}
.ak-lf-chip{min-height:44px;padding:0 14px;border:1px solid color-mix(in srgb,currentColor 25%,transparent);border-radius:999px;background:transparent;color:inherit;font:600 14px/1 inherit;cursor:pointer}
.ak-lf-chip:hover{background:color-mix(in srgb,currentColor 7%,transparent)}
.ak-lf-chip[aria-pressed="true"]{background:color-mix(in srgb,currentColor 16%,transparent);border-color:currentColor;box-shadow:inset 0 0 0 1px currentColor}
.ak-lf-status{margin:0 0 8px;font-size:14px;opacity:.75}
.ak-lf-none{margin:8px 0}
.ak-lf-reset{min-height:44px;padding:0 14px;border:1px solid color-mix(in srgb,currentColor 25%,transparent);border-radius:999px;background:transparent;color:inherit;font:600 14px/1 inherit;cursor:pointer}
.ak-lf-cb{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.ak-lf-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;margin-top:8px;padding:0 16px;border:1px solid color-mix(in srgb,currentColor 25%,transparent);border-radius:999px;font:600 14px/1 inherit;cursor:pointer;color:inherit;background:transparent}
.ak-lf-btn:hover{background:color-mix(in srgb,currentColor 7%,transparent)}
.ak-lf-cb:focus-visible~.ak-lf-btn{outline:2px solid currentColor;outline-offset:2px}
.ak-lf-less,.ak-lf-cb:checked~.ak-lf-btn .ak-lf-more{display:none}
.ak-lf-cb:checked~.ak-lf-btn .ak-lf-less{display:inline}
@media (min-width:641px){.ak-lf-ponly{display:none}}
.ak-lf.ak-lf-on .ak-lf-btn{display:none}
.ak-lf-twrap{overflow-x:auto;max-width:100%}
.ak-lf-tbl{width:100%}
${ns.map((k) => `@media (max-width:640px){.ak-lf[data-p="${k}"] .ak-lf-cb:not(:checked)~.ak-lf-twrap>.ak-lf-tbl>tbody>:nth-child(n+${k + 1}){display:none}}`).join('\n')}
${ns.map((k) => `@media (min-width:641px){.ak-lf[data-w="${k}"] .ak-lf-cb:not(:checked)~.ak-lf-twrap>.ak-lf-tbl>tbody>:nth-child(n+${k + 1}){display:none}}`).join('\n')}
${ns.map((k) => `@media (max-width:640px){.ak-lf[data-p="${k}"] .ak-lf-cb:not(:checked)~.ak-lf-flist>:nth-child(n+${k + 1}){display:none}}`).join('\n')}
${ns.map((k) => `@media (min-width:641px){.ak-lf[data-w="${k}"] .ak-lf-cb:not(:checked)~.ak-lf-flist>:nth-child(n+${k + 1}){display:none}}`).join('\n')}
.ak-lf .ak-lf-flist>[hidden],.ak-lf .ak-lf-tbl>tbody>[hidden]{display:none!important}
@media print{.ak-lf-bar,.ak-lf-status,.ak-lf-none{display:none!important}.ak-lf .ak-lf-flist>*,.ak-lf .ak-lf-tbl>tbody>*{display:revert!important}}`;

export const LIST_FILTER_CSS = listFilterCss(N);

// Plain ES5: runs in the page. One pass per .ak-lf; the fold stays CSS, the filter only toggles [hidden].
// On a Next/React page it waits until React has hydrated (a write earlier is a #418 mismatch that discards it) and keeps
// watching, so a list that arrives by soft navigation is wired too.
export const LIST_FILTER_JS = `(function(){function norm(s){s=String(s||"").toLowerCase();try{s=s.normalize("NFD").replace(/[\\u0300-\\u036f]/g,"")}catch(e){}return s.replace(/[^a-z0-9]+/g," ").trim()}
function init(w){var q=w.querySelector(".ak-lf-q");if(!q||w.getAttribute("data-lf"))return;w.setAttribute("data-lf","1");var list=w.querySelector(".ak-lf-flist")||w.querySelector(".ak-lf-tbl>tbody");if(!list)return;
var rows=[].slice.call(list.children),cb=w.querySelector(".ak-lf-cb"),st=w.querySelector(".ak-lf-status"),none=w.querySelector(".ak-lf-none"),chips=[].slice.call(w.querySelectorAll(".ak-lf-chip")),total=rows.length,label=w.getAttribute("data-label")||"items",was=null;
w.classList.add("ak-lf-js");
function run(){var tk=norm(q.value).split(" ").filter(Boolean),act={};chips.forEach(function(c){if(c.getAttribute("aria-pressed")==="true"){var k=c.parentNode.getAttribute("data-k");(act[k]=act[k]||[]).push(c.getAttribute("data-v"))}});
var on=tk.length>0||Object.keys(act).length>0,shown=0;
rows.forEach(function(r){var t=r.getAttribute("data-q")||"",f=" "+(r.getAttribute("data-f")||"")+" ",ok=true,i,k;for(i=0;i<tk.length;i++){if(t.indexOf(tk[i])<0){ok=false;break}}
if(ok){for(k in act){var any=false;for(i=0;i<act[k].length;i++){if(f.indexOf(" "+act[k][i]+" ")>=0){any=true;break}}if(!any){ok=false;break}}}
r.hidden=!ok;if(ok)shown++});
w.classList.toggle("ak-lf-on",on);
if(cb){if(on&&was===null){was=cb.checked;cb.checked=true}else if(!on&&was!==null){cb.checked=was;was=null}}
if(st){if(on){st.hidden=false;st.textContent="Showing "+shown+" of "+total+" "+label}else{st.hidden=true;st.textContent=""}}
if(none)none.hidden=!(on&&shown===0)}
q.addEventListener("input",run);q.addEventListener("search",run);
chips.forEach(function(c){c.addEventListener("click",function(){var p=c.getAttribute("aria-pressed")==="true";if(!p){[].slice.call(c.parentNode.querySelectorAll(".ak-lf-chip")).forEach(function(o){o.setAttribute("aria-pressed","false")})}c.setAttribute("aria-pressed",p?"false":"true");run()})});
var rs=w.querySelector(".ak-lf-reset");if(rs)rs.addEventListener("click",function(){q.value="";chips.forEach(function(c){c.setAttribute("aria-pressed","false")});run();q.focus()})}
function all(){[].slice.call(document.querySelectorAll(".ak-lf")).forEach(init)}
function nx(){return !!document.querySelector('script[src*="/_next/"]')}
function hy(){var m=document.querySelector("main");if(!m)return !nx();for(var k in m){if(k.indexOf("__reactFiber")===0)return true}return !nx()}
function when(cb,n){n=n||0;if(!nx()){cb();return}if(hy()||n>50){(typeof requestIdleCallback==="function"?requestIdleCallback:setTimeout)(cb)}else setTimeout(function(){when(cb,n+1)},100)}
var pend=false;function again(){if(pend)return;pend=true;when(function(){pend=false;all()})}
function start(){when(all);if(typeof MutationObserver==="function"&&document.body&&!document.__akLfObs){document.__akLfObs=1;new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){if(ms[i].addedNodes&&ms[i].addedNodes.length){again();return}}}).observe(document.body,{childList:true,subtree:true})}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start()})();`;

export default { name: 'list-filter', title: 'List filter (text search + facet chips over a list folded to one phone screen)', render: renderFilterFold, css: LIST_FILTER_CSS, js: LIST_FILTER_JS };
