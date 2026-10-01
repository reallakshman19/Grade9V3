// Credential-free rendered audit for PR #376 standalone Chemistry candidates.
// Run: node tests/chemistry_tablet_standalone_browser.mjs [base-url] [report.json]
import fs from 'node:fs';

const { chromium } = await import('playwright');
const base = (process.argv[2] || 'http://127.0.0.1:8765').replace(/\/$/, '');
const outPath = process.argv[3] || '/tmp/chemistry-tablet-browser.json';
const files = ["standalone/core1a-chemistry-behaviour-of-gases-tablet.html","standalone/core1a-chemistry-chemical-bonding-tablet.html","standalone/core1a-chemistry-redox-reactions-tablet.html","standalone/core1a-chemistry-some-basic-concepts-tablet.html","standalone/core2-chemistry-chemical-bonding-tablet.html","standalone/core2-chemistry-redox-reactions-tablet.html","standalone/core2-chemistry-some-basic-concepts-tablet.html"];
const viewports = {
  tabletLandscape: { width: 1280, height: 800 },
  tabletPortrait: { width: 800, height: 1280 },
  compactMobile: { width: 390, height: 844 },
};
const browser = await chromium.launch({ headless: true });
const report = {};
let failed = false;

for (const file of files) {
  report[file] = {};
  for (const [name, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const consoleErrors = [];
    const pageErrors = [];
    const external = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => pageErrors.push(String(err)));
    page.on('request', req => {
      const u = new URL(req.url());
      if (u.origin !== new URL(base).origin) external.push(req.url());
    });
    const response = await page.goto(`${base}/${file}`, { waitUntil: 'load' });
    if (!response || !response.ok()) throw new Error(`${file}: HTTP load failed`);

    const geometry = await page.evaluate(() => {
      const visible = el => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
      };
      const targets = [...document.querySelectorAll('button, summary, input:not([type="hidden"]), select')]
        .filter(visible).map(el => {
          const r = el.getBoundingClientRect();
          return { tag: el.tagName, text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 60), width: r.width, height: r.height };
        });
      const textareas = [...document.querySelectorAll('textarea')].filter(visible).map(el => el.getBoundingClientRect().height);
      const tinyText = [...document.querySelectorAll('body *')].filter(el => {
        if (!visible(el) || !(el.textContent || '').trim()) return false;
        return parseFloat(getComputedStyle(el).fontSize) < 13.5;
      }).slice(0, 10).map(el => ({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 50), px: getComputedStyle(el).fontSize }));
      return {
        overflowPx: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        smallTargets: targets.filter(x => x.width < 48 || x.height < 48),
        shortTextareas: textareas.filter(h => h < 120),
        tinyText,
      };
    });

    const theme = page.locator('#themeToggle, #theme-toggle-btn').first();
    if (await theme.count() && await theme.isVisible()) await theme.click();

    const tabs = page.locator('.tab-btn');
    if (await tabs.count() > 1 && await tabs.nth(1).isVisible()) await tabs.nth(1).click();

    if (file.includes('behaviour-of-gases')) {
      for (const id of ['#inputP','#inputV','#inputN','#inputT']) {
        if (await page.locator(id).count()) await page.locator(id).fill('0');
      }
      if (await page.locator('#calcTarget').count()) await page.locator('#calcTarget').selectOption('P');
      const calc = page.locator('button').filter({ hasText: /^Calculate$/ }).first();
      if (await calc.count() && await calc.isVisible()) await calc.click();
    }
    if (file.includes('core1a-chemistry-some-basic-concepts')) {
      if (await page.locator('#input-mole-mass').count()) await page.locator('#input-mole-mass').fill('-1');
      if (await page.locator('#btn-calc-mole').count()) await page.locator('#btn-calc-mole').click();
    }
    const badNumeric = await page.locator('body').evaluate(el => /\b(?:NaN|Infinity)\b/.test(el.innerText));

    await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    const zoomOverflowPx = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));

    const row = { ...geometry, zoomOverflowPx, external, consoleErrors, pageErrors, badNumeric };
    report[file][name] = row;
    if (geometry.overflowPx > 1 || geometry.smallTargets.length || geometry.shortTextareas.length || geometry.tinyText.length ||
        zoomOverflowPx > 1 || external.length || consoleErrors.length || pageErrors.length || badNumeric) failed = true;
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (failed) process.exit(1);
