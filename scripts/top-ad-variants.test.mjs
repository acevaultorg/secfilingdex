#!/usr/bin/env node
// Top-ad A/B/C test: assignment, ranking and markup checks (no browser, no network).
// Run: npm run test:top-ad
import assert from 'node:assert/strict';
import vm from 'node:vm';
import cfg from '../amazon-ad.config.mjs';
import { bbHeadJs, BB_JS, rankByTopic } from '../kit/amazon-ad.mjs';
import { injectHtml } from '../kit/amazon-ad-inject.mjs';

let failed = 0;
const test = (name, fn) => { try { fn(); console.log(`ok   ${name}`); } catch (e) { failed++; console.log(`FAIL ${name}\n     ${e.message}`); } };

// Runs the <head> assignment script in a fake browser and returns the chosen variant + what it stored.
function assign({ search = '', stored = null, storageThrows = false, random } = {}) {
  const attrs = {};
  const store = new Map(stored ? [['akbb', stored]] : []);
  const ctx = {
    location: { search },
    localStorage: {
      getItem: (k) => { if (storageThrows) throw new Error('blocked'); return store.has(k) ? store.get(k) : null; },
      setItem: (k, v) => { if (storageThrows) throw new Error('blocked'); store.set(k, v); },
    },
    document: { documentElement: { setAttribute: (k, v) => { attrs[k] = v; } } },
    Math: random ? { ...Math, random, floor: Math.floor } : Math,
  };
  ctx.window = ctx;
  vm.runInNewContext(bbHeadJs(cfg.billboard.variant), ctx);
  return { v: attrs['data-akbb'], stored: store.get('akbb'), win: ctx.__akbb };
}

test('head script has no control characters (a "\\b" in a template literal is a backspace)', () => {
  assert.ok(!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(bbHeadJs('auto')), 'bbHeadJs');
  assert.ok(!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(BB_JS), 'BB_JS');
});
test('?ak_variant= forces each variant, even over a stored one, and is not stored', () => {
  for (const v of ['a', 'b', 'c']) {
    for (const search of [`?ak_variant=${v}`, `?x=1&ak_variant=${v}`, `?ak_variant=${v}&y=2`]) {
      const r = assign({ search, stored: v === 'a' ? 'c' : 'a' });
      assert.equal(r.v, v, search);
      assert.equal(r.win, v);
      assert.notEqual(r.stored, v, 'the forced view must not overwrite the visitor\'s assignment');
    }
  }
});
test('a stored assignment is kept (stable per visitor)', () => {
  for (const v of ['a', 'b', 'c']) assert.equal(assign({ stored: v }).v, v);
});
test('a new visitor gets a random variant, stored for next time', () => {
  const r = assign({ random: () => 0.5 });
  assert.equal(r.v, 'b');
  assert.equal(r.stored, 'b');
  assert.equal(assign({ stored: 'zz', random: () => 0.9 }).v, 'c', 'a junk stored value is replaced');
});
test('assignment is uniform: each variant within 2% of 1/3 over 30,000 draws', () => {
  const n = { a: 0, b: 0, c: 0 };
  for (let i = 0; i < 30000; i++) n[assign().v]++;
  for (const k of 'abc') assert.ok(Math.abs(n[k] / 30000 - 1 / 3) < 0.02, JSON.stringify(n));
});
test('storage blocked: still assigns a variant, never throws', () => {
  assert.match(assign({ storageThrows: true }).v, /^[abc]$/);
});

const page = (title, body) => `<!DOCTYPE html><html lang="en"><head><title>${title}</title></head><body><header>h</header><main><h1>${title}</h1>${body}</main><footer>f</footer></body></html>`;
const proxyPage = page('What is a DEF 14A proxy statement?', '<h2>Executive compensation in the proxy</h2><p>The proxy statement tells shareholders about the board and directors.</p><section><h2>Reading list</h2><a href="https://www.amazon.com/dp/0071592539" data-affiliate="amazon-book">balance sheet valuation prospectus</a></section>');

test('ranking follows the page topic, best first, and ignores the site\'s own book shelf', () => {
  const order = rankByTopic(cfg.catalog, proxyPage).map((x) => x.p.asin);
  assert.equal(order[0], '0966446143', 'proxy page leads with Buffett\'s shareholder letters');
  const s10q = rankByTopic(cfg.catalog, page('What is a 10-Q filing?', '<p>Quarterly balance sheet and income statement.</p>'));
  assert.equal(s10q[0].p.asin, '0887309135');
  const late = rankByTopic(cfg.catalog, page('What is an NT 10-K?', '<p>A late filing notice under Rule 12b-25; often an accounting restatement.</p>'));
  assert.equal(late[0].p.asin, '126011726X');
});

const r = injectHtml(proxyPage, '/learn/def-14a/', cfg);
const top = (r.html.match(/<!--ak-ad:bbtop-->([\s\S]*?)<!--\/ak-ad:bbtop-->/) || [])[1] || '';
const mid = (r.html.match(/<!--ak-ad:bbmid-->([\s\S]*?)<!--\/ak-ad:bbmid-->/) || [])[1] || '';
const asins = (h) => [...h.matchAll(/<li class="ak-ad-card" data-asin="([A-Z0-9]{10})"/g)].map((m) => m[1]);

test('top box carries 5 DIFFERENT products, best first (so B and C can never repeat one product)', () => {
  const a = asins(top);
  assert.equal(a.length, 5);
  assert.equal(new Set(a).size, 5);
  assert.equal(a[0], '0966446143');
  assert.match(top, /class="ak-ad ak-on ak-bill ak-bill-top ak-bb-var"/);
});
test('mid box stays one product (the test compares the top box alone)', () => {
  assert.equal(asins(mid).length, 1);
  assert.doesNotMatch(mid, /ak-bb-var/);
});
test('click keys, gate, rel and disclosure unchanged; no auto-rotation', () => {
  for (const m of top.matchAll(/<a class="ak-ad-link"[^>]*>/g)) {
    assert.match(m[0], /href="\/go\/amzad\?a=[A-Z0-9]{10}"/);
    assert.match(m[0], /rel="sponsored nofollow noopener"/);
    for (const k of ['data-event-from', 'data-from', 'data-affiliate']) assert.ok(m[0].includes(` ${k}="ad-bb-top"`), k);
  }
  assert.ok(top.includes(cfg.disclosure));
  assert.doesNotMatch(top, /data-carousel/);
  assert.doesNotMatch(BB_JS, /setInterval|setTimeout/);
});
test('buttons: "See price on Amazon" without a live price, "View on Amazon" with one; no price in the HTML', () => {
  assert.match(top, /data-none="See price on Amazon" data-live="View on Amazon">See price on Amazon</);
  assert.doesNotMatch(top, /\$\s?\d/);
});
test('no internal labels in visitor text', () => {
  const text = top.replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(text, /amili|kit\b|variant|ak-|asin/i);
});
test('head and body scripts injected once', () => {
  assert.equal((r.html.match(/data-akbb/g) || []).length >= 1, true);
  assert.equal(r.html.split('window.__akbb=v').length - 1, 1);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
