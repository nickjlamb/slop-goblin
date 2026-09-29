// What the build produces: the site, the bookmarklet and the embeddable script.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { build, BOOKMARKLET_BUDGET } from '../src/build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(ROOT, p), 'utf8');
const { files, counts } = await build();
const version = JSON.parse(read('package.json')).version;

test('the committed site, bookmarklet and docs match a fresh build (npm run build)', () => {
  const stale = Object.keys(files).filter(name => !existsSync(join(ROOT, name)) || read(name) !== files[name]);
  assert.deepEqual(stale, []);
});

test('the bookmarklet is one javascript: URL, under budget, and valid JavaScript', () => {
  const bm = files['dist/bookmarklet.txt'].trim();
  assert.ok(bm.startsWith('javascript:'));
  assert.doesNotMatch(bm, /[\s#]/, 'no raw whitespace or # to break the URL');
  assert.ok(bm.length <= BOOKMARKLET_BUDGET, `${bm.length} characters is over the ${BOOKMARKLET_BUDGET} budget`);
  assert.doesNotThrow(() => new Function(decodeURIComponent(bm.slice('javascript:'.length))));
});

test('the site embeds the same bookmarklet and engine', () => {
  const html = files['index.html'];
  assert.ok(html.includes(JSON.stringify(files['dist/bookmarklet.txt'].trim())), 'bookmarklet link');
  assert.ok(html.includes(files['dist/goblin.min.js'].split('\n')[1]), 'engine');
});

test('the site loads nothing from third parties', () => {
  const html = files['index.html'];
  assert.doesNotMatch(html, /<script[^>]+src=["']https?:/i, 'external scripts');
  assert.doesNotMatch(html, /<link[^>]+rel=["']stylesheet["'][^>]+href=["']https?:/i, 'external stylesheets');
  assert.doesNotMatch(html, /@import|fonts\.googleapis|fonts\.gstatic/i, 'external fonts');
  assert.ok(existsSync(join(ROOT, 'fonts', 'fonts.css')), 'self-hosted fonts');
});

test('the site has its social preview and version', () => {
  const html = files['index.html'];
  for (const tag of ['og:title', 'og:description', 'og:image', 'twitter:card']) assert.ok(html.includes(tag), tag);
  assert.ok(existsSync(join(ROOT, 'og-image.png')));
  assert.ok(html.includes(`>v${version}</a>`), 'footer version');
});

test('dist/goblin.min.js carries a licence banner with the version', () => {
  assert.match(files['dist/goblin.min.js'], new RegExp(`^/\\*! The Slop Goblin v${version.replace(/\./g, '\\.')} \\| MIT`));
});

test('the counts quoted in the README come from the engine', () => {
  const readme = files['README.md'];
  assert.ok(readme.includes(`<!--phrases-->${counts.phrases}<!--/phrases-->`));
  assert.ok(readme.includes(`<!--words-->${counts.words}<!--/words-->`));
  assert.ok(readme.includes(`menu-${counts.phrases}%20phrases`));
});
