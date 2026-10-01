// Browser audit for PR #376 renderer-generated Chemistry Core1A blueprint-v2 snapshots.
import fs from 'node:fs';
const { chromium } = await import('playwright');

const base = (process.argv[2] || 'http://127.0.0.1:8765').replace(/\/$/, '');
const outPath = process.argv[3] || '/tmp/chemistry-tablet-browser.json';
const files = [
  "standalone/core1a-chemistry-behaviour-of-gases-tablet.html",
  "standalone/core1a-chemistry-chemical-bonding-tablet.html",
  "standalone/core1a-chemistry-redox-reactions-tablet.html",
  "standalone/core1a-chemistry-some-basic-concepts-tablet.html",
];
const viewports = {
  referenceTablet: { width: 1366, height: 854 },
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
      if (new URL(req.url()).origin !== new URL(base).origin) external.push(req.url());
    });
    const response = await page.goto(`${base}/${file}`, { waitUntil: 'load' });
    if (!response || !response.ok()) throw new Error(`${file}: HTTP load failed`);

    const anatomy = await page.evaluate(() => {
      const visible = el => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
      };
      const targets = [...document.querySelectorAll('button, summary, input:not([type="hidden"]), textarea, select, a')]
        .filter(visible)
        .map(el => {
          const r = el.getBoundingClientRect();
          return { tag: el.tagName, width: r.width, height: r.height, text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 50) };
        });
      return {
        role: document.documentElement.dataset.g9Role,
        mode: document.documentElement.dataset.g9Mode,
        blueprint: document.body.dataset.blueprintRef,
        overflowPx: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        smallTargets: targets.filter(x => x.width < 48 || x.height < 48),
        equationMatrices: document.querySelectorAll('[data-g9-equation-matrix]').length,
        stagedVisuals: document.querySelectorAll('[data-g9-component="STAGED_VISUAL"][data-g9-component-items="3"]').length,
        triadRoles: [...document.querySelectorAll('[data-g9-triad-role]')].map(x => x.dataset.g9TriadRole),
        stageFigures: [...document.querySelectorAll('figure[data-g9-stage-sequence="true"]')].map(f => ({
          stages: f.dataset.g9Stages.split(' ').filter(Boolean).length,
          chips: f.querySelectorAll('[data-g9-stage-goto]').length,
        })),
      };
    });

    const interactionErrors = [];
    if (anatomy.role !== 'CORE1A' || anatomy.mode !== 'SINGLE_FILE' || anatomy.blueprint !== 'BP-CORE1A-CONSTRUCTION@1.4.0') interactionErrors.push('blueprint:identity');
    if (anatomy.equationMatrices !== 3) interactionErrors.push(`equations:${anatomy.equationMatrices}`);
    if (anatomy.stagedVisuals !== 3) interactionErrors.push(`staged-visuals:${anatomy.stagedVisuals}`);
    if (anatomy.stageFigures.some(x => x.stages !== 3 || x.chips !== 3)) interactionErrors.push('stages:not-three');
    for (const role of ['CHECK','APPLY','CONNECT']) {
      if (anatomy.triadRoles.filter(x => x === role).length !== 3) interactionErrors.push(`triad:${role}`);
    }

    const firstStage = page.locator('figure[data-g9-stage-sequence="true"]').first();
    if (await firstStage.count()) {
      const chips = firstStage.locator('[data-g9-stage-goto]');
      await chips.nth(2).click();
      const pressed = await chips.nth(2).getAttribute('aria-pressed');
      if (pressed !== 'true') interactionErrors.push('stage:chip-navigation');
    } else interactionErrors.push('stage:none');

    const display = page.locator('[data-g9-action="display"]').first();
    await display.click();
    await page.locator('[data-g9-theme="light"]').first().click();
    if ((await page.getAttribute('html', 'data-theme')) !== 'light') interactionErrors.push('theme:light');
    await page.locator('[data-g9-theme="dark"]').first().click();
    if ((await page.getAttribute('html', 'data-theme')) !== 'dark') interactionErrors.push('theme:dark');

    await page.keyboard.press('Tab');
    const focusVisible = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return false;
      const s = getComputedStyle(el);
      return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
    });
    if (!focusVisible) interactionErrors.push('keyboard:focus-not-visible');

    const row = { ...anatomy, external, consoleErrors, pageErrors, interactionErrors };
    report[file][name] = row;
    if (anatomy.overflowPx > 1 || anatomy.smallTargets.length || external.length || consoleErrors.length || pageErrors.length || interactionErrors.length) failed = true;
    await context.close();
  }
}

await browser.close();
fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (failed) process.exit(1);
