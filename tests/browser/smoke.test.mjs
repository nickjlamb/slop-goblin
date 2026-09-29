// End-to-end: the real bookmarklet, in real browser engines.
//
//   npx playwright install chromium firefox webkit   (once)
//   npm run test:browser
//
// Set BROWSERS=chromium (or a comma-separated list) to test fewer engines. An engine that isn't installed
// is skipped locally but fails in CI, so a green CI run means every engine was really exercised.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import * as playwright from 'playwright';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const BOOKMARKLET = readFileSync(join(ROOT, 'dist', 'bookmarklet.txt'), 'utf8').trim();
const CODE = decodeURIComponent(BOOKMARKLET.slice('javascript:'.length));
const fixture = name => pathToFileURL(join(HERE, 'fixtures', name)).href;
const ENGINES = (process.env.BROWSERS || 'chromium,firefox,webkit').split(',').map(s => s.trim()).filter(Boolean);

const eatenCount = page => page.evaluate(() => document.querySelectorAll('[data-slop-eaten]').length);

for (const name of ENGINES) {
  test(`${name}: the bookmarklet runs and the goblin eats`, async t => {
    let browser;
    try { browser = await playwright[name].launch(); }
    catch (err) {
      if (process.env.CI) throw err;
      t.skip(`${name} is not installed (npx playwright install ${name})`);
      return;
    }
    try {
      const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));

      await t.test('clicking the bookmark starts him, and he translates phrases', async () => {
        await page.goto(fixture('feed.html'));
        await page.evaluate(href => document.getElementById('bookmarklet').setAttribute('href', href), BOOKMARKLET);
        await page.click('#bookmarklet');
        await page.waitForFunction(() => document.querySelectorAll('[data-slop-eaten]').length >= 3, null, { timeout: 30000 });
        const first = await page.evaluate(() => document.querySelector('[data-slop-eaten]').textContent);
        assert.equal(first, 'News:');
      });

      await t.test('he opens a “… more” when slop is hiding behind it', async () => {
        await page.waitForFunction(() => !document.getElementById('more'), null, { timeout: 30000 });
      });

      await t.test('Esc sends him home with the bill', async () => {
        await page.keyboard.press('Escape');
        await page.waitForSelector('[role=dialog][aria-label="Slop Goblin receipt"] canvas', { timeout: 5000 });
        assert.equal(await page.evaluate(() => !!(window.__slopGoblin && window.__slopGoblin.alive)), false);
      });

      await t.test('he works on a page with a strict Content Security Policy', async () => {
        const strict = await browser.newPage({ viewport: { width: 1000, height: 700 } });
        strict.on('pageerror', e => errors.push(String(e)));
        await strict.goto(fixture('strict.html'));
        await strict.evaluate(() => {
          window.__violations = [];
          document.addEventListener('securitypolicyviolation', e => window.__violations.push(e.violatedDirective));
        });
        // Browsers exempt bookmarklets from the page's CSP; evaluating the code is the closest automation gets.
        await strict.evaluate(CODE);
        await strict.waitForFunction(() => document.querySelectorAll('[data-slop-eaten]').length >= 2, null, { timeout: 30000 });
        assert.deepEqual(await strict.evaluate(() => window.__violations), []);
        assert.ok(await eatenCount(strict) >= 2);
      });

      assert.deepEqual(errors, [], 'no page errors');
    } finally {
      await browser.close();
    }
  });
}
