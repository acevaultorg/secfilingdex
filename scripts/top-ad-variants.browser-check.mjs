#!/usr/bin/env node
// Browser check for the top-ad A/B/C test on the BUILT + injected site (npm run build, then
// node kit/amazon-ad-inject.mjs out). Needs the `playwright` package and a Chromium; not a repo dependency.
//   node scripts/top-ad-variants.browser-check.mjs [outDir=out] [shotsDir=review]
// Serves outDir on localhost, blocks every non-local request (nothing reaches Amazon), and for every billboard page,
// every variant and widths 375 / 390 / 1280 asserts: the forced variant is the one shown, A shows one product, B one at
// a time with a different product after "next", C at least two different products at once, the box keeps A's size,
// no horizontal page scroll, 44 px targets, no page error (a React hydration error re-renders <body> and deletes the box).
// Saves 375 and 390 screenshots of each page and variant into shotsDir.
// With MOCK_API=1 it also answers /amz/items with placeholder data (grey cover, "$X.XX") to check the live layout.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright')); } catch { console.error('playwright not installed (set PLAYWRIGHT_PATH to its folder; CHROMIUM_PATH to a Chromium binary if Playwright has none)'); process.exit(2); }
const out = path.resolve(process.argv[2] || 'out');
const shots = path.resolve(process.argv[3] || 'review');
fs.mkdirSync(shots, { recursive: true });
const PORT = 8765;
const COVER = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="300" height="450" fill="#d9dde3"/><text x="150" y="235" font-family="sans-serif" font-size="28" text-anchor="middle" fill="#6b7280">cover</text></svg>';
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname);
  if (p === '/__mock/cover.svg') { r.setHeader('content-type', 'image/svg+xml'); return r.end(COVER); }
  let f = path.join(out, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  if (!f.startsWith(out) || !fs.existsSync(f)) { r.statusCode = 404; return r.end('not found'); }
  const ext = path.extname(f);
  r.setHeader('content-type', { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' }[ext] || 'application/octet-stream');
  fs.createReadStream(f).pipe(r);
}).listen(PORT);

const pages = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name === 'index.html' && /<!--ak-ad:bbtop-->/.test(fs.readFileSync(p, 'utf8'))) pages.push('/' + path.relative(out, p).replace(/index\.html$/, '')); } })(out);
pages.sort();
const mock = process.env.MOCK_API === '1';
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const fails = [];
const slug = (u) => (u === '/' ? 'home' : u.replace(/^\/|\/$/g, '').replace(/\//g, '_'));

async function check(url, v, width, { shot } = {}) {
  const phone = width < 768;
  const ctx = await browser.newContext({ viewport: { width, height: phone ? 760 : 900 }, isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 2 : 1 });
  const pg = await ctx.newPage();
  const pageErrors = [];
  pg.on('pageerror', (e) => pageErrors.push(String(e.message || e).slice(0, 120)));
  await pg.route(/^https?:\/\/(?!localhost:8765\/)/, (r) => r.abort());
  if (mock) await pg.route(/\/amz\/items\?/, (r) => { const a = new URL(r.request().url()).searchParams.get('a').split(','); r.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true, asOf: new Date().toISOString(), items: Object.fromEntries(a.map((x) => [x, { title: `Placeholder title for ${x}: a long subtitle, as real listings often have`, brand: '', img: { url: `http://localhost:${PORT}/__mock/cover.svg`, w: 300, h: 450 }, price: '$X.XX' }])) }) }); });
  await pg.goto(`http://localhost:${PORT}${url}?ak_variant=${v}`, { waitUntil: 'load' });
  await pg.waitForTimeout(1200); // past hydration and the mid box's move, which used to make React drop both boxes
  const bad = (m) => fails.push(`${url} ${v} @${width}: ${m}`);
  const st = await pg.evaluate(() => {
    const s = document.querySelector('.ak-bill-top'); const tr = s && s.querySelector('.ak-ad-track');
    if (!s || !tr) return null;
    const tb = tr.getBoundingClientRect();
    const cards = [...tr.children].map((li) => { const b = li.getBoundingClientRect(); return { asin: li.dataset.asin, w: b.width, h: li.querySelector('a').getBoundingClientRect().height, full: b.width > 0 && b.left >= tb.left - 1 && b.right <= tb.right + 1 }; });
    const nav = [...s.querySelectorAll('.ak-bb-nav')].filter((b) => getComputedStyle(b).display !== 'none' && !b.disabled).map((b) => { const r = b.getBoundingClientRect(); return [r.width, r.height]; });
    // Text an arrow sits on: any visible headline/title/price/button inside the track's visible area.
    const arrows = [...s.querySelectorAll('.ak-bb-nav')].filter((b) => getComputedStyle(b).display !== 'none' && getComputedStyle(b).opacity !== '0').map((b) => b.getBoundingClientRect());
    // Measured on the text itself (a Range), clipped to the element, so padding and ellipsis-hidden text do not count.
    const textRect = (el) => { const g = document.createRange(); g.selectNodeContents(el); const t = g.getBoundingClientRect(), e = el.getBoundingClientRect(); return { left: Math.max(t.left, e.left), right: Math.min(t.right, e.right), top: Math.max(t.top, e.top), bottom: Math.min(t.bottom, e.bottom), width: Math.min(t.right, e.right) - Math.max(t.left, e.left) }; };
    const covered = [...s.querySelectorAll('.ak-bill-h,.ak-ad-brand,.ak-ad-title,.ak-ad-price,.ak-ad-cta,.ak-bb-rowh')].filter((el) => el.textContent.trim() && getComputedStyle(el).display !== 'none').filter((el) => { const r = textRect(el); return r.width > 0 && r.left < tb.right - 1 && r.right > tb.left + 1 && r.right <= tb.right + 1 && arrows.some((a) => r.left < a.right && r.right > a.left && r.top < a.bottom && r.bottom > a.top); }).map((el) => el.className);
    return { covered, akbb: document.documentElement.getAttribute('data-akbb'), boxH: s.getBoundingClientRect().height, cards, nav, count: (s.querySelector('.ak-bb-count') || {}).textContent || '', hscroll: document.documentElement.scrollWidth > innerWidth + 1, variantAttr: [...s.querySelectorAll('a.ak-ad-link')].every((a) => a.getAttribute('data-ad-variant') === document.documentElement.getAttribute('data-akbb')) };
  });
  if (pageErrors.length) bad(`page error: ${pageErrors.join(' | ')}`);
  if (!st) { bad('no top box'); await ctx.close(); return null; }
  if (st.akbb !== v) bad(`shows variant ${st.akbb}`);
  if (st.hscroll) bad('horizontal page scroll');
  if (st.covered.length) bad(`an arrow covers ${st.covered.join(', ')}`);
  if (!st.variantAttr) bad('links do not carry data-ad-variant');
  const full = st.cards.filter((c) => c.full);
  const distinct = new Set(st.cards.map((c) => c.asin)).size;
  if (distinct !== st.cards.length) bad('a product repeats in the box');
  if (st.cards.some((c) => c.w > 0 && c.h < 44)) bad('a link is under 44px tall');
  if (st.nav.some(([w, h]) => w < 44 || h < 44)) bad('arrow under 44px');
  if (v === 'a' && (full.length !== 1 || st.cards.filter((c) => c.w > 0).length !== 1)) bad(`A shows ${full.length} products`);
  if (v === 'b') {
    if (full.length !== 1) bad(`B shows ${full.length} at once`);
    if (st.cards.length < 2) bad('B has one product only');
    if (!/^1 of \d$/.test(st.count)) bad(`B counter "${st.count}"`);
    const first = full[0] && full[0].asin;
    if (!(await pg.click('.ak-bill-top .ak-bb-next', { timeout: 3000 }).then(() => true, () => false))) { bad('B next arrow is not tappable'); await ctx.close(); return st; }
    await pg.waitForTimeout(700);
    const now = await pg.evaluate(() => { const tr = document.querySelector('.ak-bill-top .ak-ad-track'), tb = tr.getBoundingClientRect(); return [...tr.children].filter((li) => { const b = li.getBoundingClientRect(); return b.width > 0 && b.left >= tb.left - 1 && b.right <= tb.right + 1; }).map((li) => li.dataset.asin); });
    if (now.length !== 1 || now[0] === first) bad(`B next did not move to a different product (${first} -> ${now})`);
    const c2 = await pg.evaluate(() => document.querySelector('.ak-bill-top .ak-bb-count').textContent);
    if (!/^2 of \d$/.test(c2)) bad(`B counter after next "${c2}"`);
    await pg.evaluate(() => { const t = document.querySelector('.ak-bill-top .ak-ad-track'); t.scrollLeft = 0; });
    await pg.waitForTimeout(300);
  }
  if (v === 'c' && (full.length < (phone ? 2 : 5) || new Set(full.map((c) => c.asin)).size !== full.length)) bad(`C shows ${full.length} products at once`);
  if (shot) {
    await pg.evaluate(() => { const c = document.querySelector('[class*="cookie" i], [aria-label*="cookie" i]'); window.scrollTo(0, 0); });
    await pg.screenshot({ path: path.join(shots, shot), type: 'jpeg', quality: 72 });
  }
  await ctx.close();
  return st;
}

const H = {};
for (const url of pages) {
  for (const v of ['a', 'b', 'c']) {
    for (const w of [375, 390, 1280]) {
      const shot = w < 1280 ? `${mock ? 'mock-api_' : ''}${slug(url)}_${v}_${w}.jpg` : (['/', '/learn/10-k/', '/learn/def-14a/'].includes(url) ? `${mock ? 'mock-api_' : ''}${slug(url)}_${v}_desktop.jpg` : null);
      const st = await check(url, v, w, { shot: mock && !['/', '/learn/def-14a/'].includes(url) ? null : shot });
      if (st) { const k = `${url}@${w}`; (H[k] ||= {})[v] = st.boxH; }
    }
  }
}
for (const [k, h] of Object.entries(H)) if (new Set(Object.values(h)).size !== 1) fails.push(`${k}: box height differs across variants ${JSON.stringify(h)}`);

// The stored assignment (no ?ak_variant) is honoured, and a variant is assigned when nothing is stored.
for (const v of ['a', 'b', 'c']) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 760 }, isMobile: true });
  await ctx.addInitScript((x) => { try { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('akbb', x); sessionStorage.setItem('seeded', '1'); } } catch (e) {} }, v);
  const pg = await ctx.newPage();
  await pg.route(/^https?:\/\/(?!localhost:8765\/)/, (r) => r.abort());
  await pg.goto(`http://localhost:${PORT}/learn/10-k/`);
  const got = await pg.evaluate(() => document.documentElement.getAttribute('data-akbb'));
  if (got !== v) fails.push(`stored ${v} but showed ${got}`);
  await pg.goto(`http://localhost:${PORT}/learn/10-q/`);
  const again = await pg.evaluate(() => document.documentElement.getAttribute('data-akbb'));
  if (again !== v) fails.push(`stored ${v}, second page showed ${again}`);
  await ctx.close();
}
await browser.close();
srv.close();
console.log(`${pages.length} pages x 3 variants x 3 widths checked${mock ? ' (mock API)' : ''}`);
if (fails.length) { console.log(fails.join('\n')); process.exit(1); }
console.log('all passed');
