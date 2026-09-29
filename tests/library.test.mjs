import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { build, transform } from 'esbuild';
import { Window } from 'happy-dom';
import { matchesSnippet, compareSnippets, filterKeys } from '../src/lib/filters.ts';
import { freshnessOf } from '../src/lib/freshness.ts';
import { readSaved } from '../src/lib/saved.ts';

const root = new URL('../', import.meta.url).pathname;
const dist = join(root, 'dist');
const base = 'https://example.test/ai-snippets';
const snippets = readdirSync(join(root, 'snippets'), { recursive: true }).filter(path => path.includes('/') && path.endsWith('.md'));
const bundles = Object.fromEntries(await Promise.all(['site', 'explorer'].map(async name => {
  const result = await build({ entryPoints: [join(root, `src/scripts/${name}.ts`)], bundle: true, format: 'iife', write: false });
  return [name, result.outputFiles[0].text];
})));
const defaultState = Object.fromEntries(filterKeys.map(key => [key, '']));
const themeScript = readFileSync(join(root, 'src/components/ThemeToggle.astro'), 'utf8').match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
const providerScript = (await transform(readFileSync(join(root, 'src/pages/providers.astro'), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1], { loader: 'ts' })).code;
const record = { id: 'one', title: 'Stream an answer', search: 'OpenAI Responses Python tool-use streaming', category: 'model-apis', provider: 'OpenAI', languages: 'Python|cURL', modelTypes: 'llm', freshness: 'current', verified: '2026-09-21' };

function page(path = 'browse', query = '') {
  const window = new Window({ url: `${base}/${path}${query}`, settings: { disableCSSFileLoading: true, disableJavaScriptFileLoading: true } });
  const html = readFileSync(join(dist, path, 'index.html'), 'utf8').replace(/<script\b[\s\S]*?<\/script>/g, '');
  window.document.write(html);
  for (const link of window.document.querySelectorAll('link[rel="stylesheet"]')) {
    const file = new URL(link.href).pathname.replace('/ai-snippets/', '');
    const style = window.document.createElement('style');
    style.textContent = readFileSync(join(dist, file), 'utf8');
    window.document.head.append(style);
  }
  return window;
}
function load(window) { window.eval(bundles.site); window.eval(bundles.explorer); }
function visible(window) { return [...window.document.querySelectorAll('[data-rows] .row')].filter(row => !row.hidden); }
function change(window, key, value) {
  const el = window.document.querySelector(`[data-filter="${key}"]`);
  if (el.type === 'checkbox') el.checked = value === '1'; else el.value = value;
  el.dispatchEvent(new window.Event(key === 'q' ? 'input' : 'change', { bubbles: true }));
}

// These tests exercise user-facing matching, date boundaries and damaged storage.
test('search combines tokens, ignores case, and normalizes tag punctuation', () => {
  assert.equal(matchesSnippet(record, { ...defaultState, q: 'python OPENAI tool use' }, new Set()), true);
  assert.equal(matchesSnippet(record, { ...defaultState, q: 'python cohere' }, new Set()), false);
});
test('facets intersect and language matching is exact', () => {
  assert.equal(matchesSnippet(record, { ...defaultState, provider: 'OpenAI', language: 'Python', category: 'model-apis' }, new Set()), true);
  assert.equal(matchesSnippet(record, { ...defaultState, language: 'Java' }, new Set()), false);
  assert.equal(matchesSnippet(record, { ...defaultState, freshness: 'due' }, new Set()), false);
  assert.equal(matchesSnippet({ ...record, freshness: 'stale' }, { ...defaultState, freshness: 'due' }, new Set()), true);
});
test('saved-only results exclude unsaved entries and sort remains deterministic', () => {
  assert.equal(matchesSnippet(record, { ...defaultState, saved: '1' }, new Set()), false);
  assert.equal(matchesSnippet(record, { ...defaultState, saved: '1' }, new Set(['one'])), true);
  assert.ok(compareSnippets(record, { ...record, verified: '2026-09-20' }, '') < 0);
});
test('freshness changes on UTC dates and at review thresholds', () => {
  const checked = new Date('2026-01-01T00:00:00Z');
  const day = n => new Date(checked.getTime() + n * 86400000);
  assert.equal(freshnessOf(checked, new Date('2026-01-01T23:59:00Z')).phrase, 'checked today');
  assert.equal(freshnessOf(checked, day(1)).phrase, 'checked yesterday');
  assert.equal(freshnessOf(checked, day(120)).state, 'current');
  assert.equal(freshnessOf(checked, day(121)).state, 'aging');
  assert.equal(freshnessOf(checked, day(240)).state, 'aging');
  assert.equal(freshnessOf(checked, day(241)).state, 'stale');
});
test('corrupt, blocked, or unexpected storage does not break the library', () => {
  for (const text of ['not json', '{}', 'null', '42']) assert.equal(readSaved({ getItem: () => text }).size, 0);
  assert.deepEqual([...readSaved({ getItem: () => '["valid",42,null,"valid"]' })], ['valid']);
  assert.equal(readSaved({ getItem: () => { throw Error('blocked'); } }).size, 0);
});

test('shared URLs restore combined search and language filters', async () => {
  const w = page('browse', '?q=streaming&provider=OpenAI&language=Python');
  try {
    load(w);
    assert.equal(visible(w).length, 1);
    assert.equal(visible(w)[0].dataset.id, 'model-apis/openai-streaming');
    assert.equal(w.document.querySelectorAll('[data-active-filters] button').length, 3);
    assert.match(w.document.querySelector('[data-count]').textContent, /^1 snippet of /);
    change(w, 'q', 'no-such-example');
    assert.equal(visible(w).length, 0);
    assert.equal(w.document.querySelector('[data-empty]').hidden, false);
    w.document.querySelector('[data-clear-all]').click();
    assert.equal(visible(w).length, snippets.length);
    assert.equal(w.location.search, '');
  } finally { await w.happyDOM.close(); }
});
test('provider changes update the URL, and history restores selections', async () => {
  const w = page();
  try {
    load(w);
    change(w, 'provider', 'Cohere');
    assert.equal(visible(w).length, 2);
    assert.equal(new URL(w.location.href).searchParams.get('provider'), 'Cohere');
    change(w, 'sort', 'title');
    assert.equal(visible(w)[0].dataset.title, 'Send a message with Cohere');
    // Simulate the URL/popstate pair produced by a browser history traversal.
    w.history.replaceState(null, '', `${base}/browse?provider=Google`);
    w.dispatchEvent(new w.PopStateEvent('popstate'));
    assert.ok(visible(w).length > 0);
    assert.ok(visible(w).every(row => row.dataset.provider === 'Google'));
  } finally { await w.happyDOM.close(); }
});
test('category pages default to their category and can clear it explicitly', async () => {
  const w = page('speech');
  try {
    load(w);
    assert.equal(visible(w).length, 3);
    assert.ok(visible(w).every(row => row.dataset.category === 'speech'));
    w.document.querySelector('[data-filters]').reset();
    assert.equal(visible(w).length, snippets.length);
    assert.equal(new URL(w.location.href).searchParams.get('category'), '');
    w.dispatchEvent(new w.PopStateEvent('popstate'));
    assert.equal(visible(w).length, snippets.length);
  } finally { await w.happyDOM.close(); }
});
test('bookmark changes persist, update counts, and update saved-only results', async () => {
  const w = page();
  try {
    load(w);
    const button = w.document.querySelector('[data-save]');
    const id = button.dataset.save;
    button.click();
    assert.deepEqual(JSON.parse(w.localStorage.getItem('ai-snippets-saved')), [id]);
    assert.equal(button.getAttribute('aria-pressed'), 'true');
    assert.equal(w.document.querySelector('[data-saved-count]').textContent, '1');
    change(w, 'saved', '1');
    assert.equal(visible(w).length, 1);
    assert.equal(w.document.querySelector('[data-browse-heading]').textContent, 'Your saved snippets');
    button.click();
    assert.equal(visible(w).length, 0);
    assert.match(w.document.querySelector('[data-empty-title]').textContent, /belongs here/);
    assert.equal(w.document.querySelector('[data-saved-count]').textContent, '0');
  } finally { await w.happyDOM.close(); }
});
test('saving fails honestly when storage is blocked', async () => {
  const w = page();
  try {
    load(w);
    Object.defineProperty(w, 'localStorage', { get: () => { throw Error('blocked'); } });
    const button = w.document.querySelector('[data-save]');
    button.click();
    assert.equal(button.getAttribute('aria-pressed'), 'false');
    assert.match(w.document.querySelector('[data-toast]').textContent, /storage is blocked/);
  } finally { await w.happyDOM.close(); }
});
test('cross-tab bookmark changes refresh the saved library', async () => {
  const w = page('browse', '?saved=1');
  try {
    load(w);
    assert.equal(visible(w).length, 0);
    w.localStorage.setItem('ai-snippets-saved', '["local-models/ollama-chat"]');
    w.dispatchEvent(new w.StorageEvent('storage', { key: 'ai-snippets-saved' }));
    assert.equal(visible(w).length, 1);
    assert.equal(visible(w)[0].dataset.id, 'local-models/ollama-chat');
  } finally { await w.happyDOM.close(); }
});
test('keyboard search does not steal typing, mobile navigation closes with Escape', async () => {
  const w = page();
  try {
    load(w);
    w.document.body.dispatchEvent(new w.KeyboardEvent('keydown', { key: '/', bubbles: true }));
    assert.equal(w.document.activeElement, w.document.querySelector('[data-search-input]'));
    const button = w.document.querySelector('[data-menu]');
    button.click();
    assert.equal(button.getAttribute('aria-expanded'), 'true');
    w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape' }));
    assert.equal(button.getAttribute('aria-expanded'), 'false');
    assert.equal(w.document.querySelector('.sidebar').classList.contains('is-open'), false);
  } finally { await w.happyDOM.close(); }
});
test('code controls copy the chosen language and recover from clipboard failure', async () => {
  const w = page('model-apis/openai-generate-text');
  try {
    w.eval(bundles.site);
    const group = w.document.querySelector('.codegroup');
    let copied;
    w.navigator.clipboard.writeText = async value => { copied = value; };
    group.querySelector('[data-copy]').click();
    await new Promise(resolve => setImmediate(resolve));
    assert.match(copied, /from openai import OpenAI/);
    group.querySelectorAll('input')[1].click();
    group.querySelector('[data-copy]').click();
    await new Promise(resolve => setImmediate(resolve));
    assert.match(copied, /import OpenAI from/);
    assert.doesNotMatch(copied, /from openai import/);
    w.navigator.clipboard.writeText = async () => { throw Error('denied'); };
    group.querySelector('[data-copy]').click();
    await new Promise(resolve => setImmediate(resolve));
    assert.match(w.document.querySelector('[data-toast]').textContent, /Code selected/);
    assert.match(w.getSelection().toString(), /import OpenAI from/);
  } finally { await w.happyDOM.close(); }
});
test('download uses the selected language extension and content', async () => {
  const w = page('model-apis/openai-generate-text');
  try {
    w.eval(bundles.site);
    const group = w.document.querySelector('.codegroup');
    group.querySelectorAll('input')[1].click();
    let downloaded, blob;
    w.URL.createObjectURL = value => { blob = value; return 'blob:test'; };
    w.URL.revokeObjectURL = () => {};
    const click = w.HTMLAnchorElement.prototype.click;
    w.HTMLAnchorElement.prototype.click = function () { downloaded = this.download; };
    group.querySelector('[data-download]').click();
    assert.equal(downloaded, 'openai-generate-text.js');
    assert.match(await blob.text(), /import OpenAI from/);
    w.HTMLAnchorElement.prototype.click = click;
  } finally { await w.happyDOM.close(); }
});

test('theme cycles and remains usable when persistent storage is blocked', async () => {
  const w = page();
  try {
    w.localStorage.setItem('ai-snippets-theme', 'invalid-mode');
    w.eval(themeScript);
    const button = w.document.querySelector('[data-theme-toggle]');
    assert.match(button.getAttribute('aria-label'), /system/);
    button.click();
    assert.equal(w.document.documentElement.dataset.theme, 'light');
    assert.equal(w.localStorage.getItem('ai-snippets-theme'), 'light');
    Object.defineProperty(w, 'localStorage', { get: () => { throw Error('blocked'); } });
    button.click();
    assert.equal(w.document.documentElement.dataset.theme, 'dark');
    button.click();
    assert.match(button.getAttribute('aria-label'), /system/);
  } finally { await w.happyDOM.close(); }
});

test('provider finder handles case, missing results, and reset', async () => {
  const w = page('providers');
  try {
    w.eval(providerScript);
    const input = w.document.querySelector('[data-provider-search]');
    input.value = 'coHERE';
    input.dispatchEvent(new w.Event('input'));
    assert.equal([...w.document.querySelectorAll('[data-provider-card]')].filter(card => !card.hidden).length, 1);
    input.value = 'nonexistent-provider';
    input.dispatchEvent(new w.Event('input'));
    assert.equal(w.document.querySelector('[data-provider-empty]').hidden, false);
    w.document.querySelector('[data-provider-reset]').click();
    assert.equal(input.value, '');
    assert.ok([...w.document.querySelectorAll('[data-provider-card]')].every(card => !card.hidden));
  } finally { await w.happyDOM.close(); }
});

test('built pages have unique IDs, working internal links, and source context', async () => {
  const files = readdirSync(dist, { recursive: true }).filter(file => file.endsWith('.html'));
  const pages = new Map();
  for (const file of files) {
    const w = new Window({ settings: { disableCSSFileLoading: true, disableJavaScriptFileLoading: true } });
    w.document.write(readFileSync(join(dist, file), 'utf8').replace(/<script\b[\s\S]*?<\/script>/g, ''));
    const ids = [...w.document.querySelectorAll('[id]')].map(el => el.id);
    assert.equal(ids.length, new Set(ids).size, `Duplicate ID in ${file}`);
    assert.equal(w.document.querySelectorAll('h1').length, 1, `One page heading in ${file}`);
    pages.set(file, { ids: new Set(ids), links: [...w.document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')) });
    if (w.document.querySelector('.context-box')) {
      assert.ok(w.document.querySelector('.expected-output'), `Expected output missing in ${file}`);
      assert.ok(w.document.querySelector('.verification-note'), `Verification context missing in ${file}`);
    }
    await w.happyDOM.close();
  }
  for (const [file, { links }] of pages) for (const link of links) {
    if (!link.startsWith('/ai-snippets') && !link.startsWith('#')) continue;
    const url = new URL(link, `${base}/${file.replace(/index\.html$/, '')}`);
    const relative = decodeURIComponent(url.pathname.replace(/^\/ai-snippets\/?/, ''));
    const target = relative.endsWith('.html') ? relative : `${relative.replace(/\/$/, '')}${relative.replace(/\/$/, '') ? '/' : ''}index.html`;
    assert.ok(existsSync(join(dist, target)), `Broken link from ${file}: ${link}`);
    if (url.hash) assert.ok(pages.get(target)?.ids.has(decodeURIComponent(url.hash.slice(1))), `Broken anchor from ${file}: ${link}`);
  }
});
