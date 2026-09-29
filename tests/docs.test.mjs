// The docs make promises about the code. These tests keep them true.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import '../src/goblin.js';
import { render as renderGallery } from '../examples/gen-before-after.mjs';

const G = globalThis.SlopGoblin;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(ROOT, p), 'utf8');
const DOCS = ['README.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'ROADMAP.md', 'SECURITY.md', 'CODE_OF_CONDUCT.md',
  'examples/README.md', 'examples/before-and-after.md'];

test('every row of the README examples table is what the translator really says', () => {
  const block = read('README.md').split('<!--examples:start-->')[1].split('<!--examples:end-->')[0];
  const rows = block.split('\n').filter(l => l.startsWith('| ') && !l.startsWith('| ---')).slice(1);
  assert.ok(rows.length >= 5, 'the table has rows');
  for (const row of rows) {
    const [slop, plain] = row.split('|').slice(1, 3).map(s => s.trim());
    assert.equal(G.translate(slop), plain, `README example: ${slop}`);
  }
});

test('the before-and-after gallery is up to date (npm run examples)', () => {
  assert.equal(read('examples/before-and-after.md'), renderGallery());
});

test('the version is the same everywhere', () => {
  const v = JSON.parse(read('package.json')).version;
  assert.equal(G.version, v, 'VERSION in src/goblin.js');
  assert.match(read('CITATION.cff'), new RegExp(`^version: ${v}$`, 'm'), 'CITATION.cff');
  assert.match(read('CHANGELOG.md'), new RegExp(`^## \\[${v.replace(/\./g, '\\.')}\\] - \\d{4}-\\d{2}-\\d{2}$`, 'm'), 'CHANGELOG.md');
  assert.ok(existsSync(join(ROOT, `.github/releases/v${v}.md`)), 'release notes');
  assert.ok(read('README.md').includes(`slop-goblin@v${v}/dist/goblin.min.js`), 'README CDN snippet');
});

test('relative links in the docs point at files that exist', () => {
  const broken = [];
  for (const doc of DOCS) {
    const links = [...read(doc).matchAll(/\]\(([^)\s]+)\)|(?:src|href|srcset)="([^"]+)"/g)].map(m => m[1] || m[2]);
    for (const link of links) {
      if (/^(https?:|mailto:|#)/.test(link)) continue;
      if (!existsSync(resolve(ROOT, dirname(doc), link.split('#')[0]))) broken.push(`${doc} → ${link}`);
    }
  }
  assert.deepEqual(broken, []);
});

test('in-page README links land on a heading', () => {
  const readme = read('README.md');
  const slug = h => h.toLowerCase().trim().replace(/[^\p{L}\p{N} -]/gu, '').replace(/ /g, '-');
  const anchors = new Set([...readme.matchAll(/^#{1,4} (.+)$/gm)].map(m => slug(m[1])));
  const missing = [...readme.matchAll(/\]\(#([^)]+)\)/g)].map(m => m[1]).filter(a => !anchors.has(a));
  assert.deepEqual(missing, []);
});

test('the docs never mention the hidden recording mode', () => {
  for (const doc of DOCS) assert.doesNotMatch(read(doc), /video mode/i, doc);
});
