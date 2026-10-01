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
      const viewportWidth = document.documentElement.clientWidth;
      const overflowOffenders = [...document.querySelectorAll('body *')].filter(visible).map(el => {
        const r = el.getBoundingClientRect();
        return { el, r };
      }).filter(({ r }) => r.right > viewportWidth + 1 || r.left < -1)
        .sort((a, b) => (b.r.right - viewportWidth) - (a.r.right - viewportWidth))
        .slice(0, 12)
        .map(({ el, r }) => ({
          tag: el.tagName,
          id: el.id || '',
          cls: typeof el.className === 'string' ? el.className.slice(0, 100) : '',
          text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100),
          left: Math.round(r.left * 10) / 10,
          right: Math.round(r.right * 10) / 10,
          width: Math.round(r.width * 10) / 10,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          whiteSpace: getComputedStyle(el).whiteSpace,
        }));
      return {
        overflowPx: Math.max(0, document.documentElement.scrollWidth - viewportWidth),
        overflowOffenders,
        smallTargets: targets.filter(x => x.width < 48 || x.height < 48),
        shortTextareas: textareas.filter(h => h < 120),
        tinyText,
      };
    });

    const interactionErrors = await page.evaluate(() => {
      const errors = [];
      const bad = text => /\b(?:NaN|Infinity)\b/.test(text || '');
      const exerciseSelect = (selectId, buttonId, outputId) => {
        const select = document.getElementById(selectId);
        const button = document.getElementById(buttonId);
        const output = document.getElementById(outputId);
        if (!select || !button || !output) return;
        for (const opt of [...select.options]) {
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          button.click();
          if (!output.textContent.trim() || bad(output.textContent)) errors.push(`${selectId}:${opt.value}`);
        }
        button.click();
        if (bad(output.textContent)) errors.push(`${buttonId}:repeat`);
      };
      exerciseSelect('select-mot-species', 'btn-calc-mot', 'res-mot-calc');
      exerciseSelect('select-vsepr-mol', 'btn-calc-vsepr', 'res-vsepr-calc');
      exerciseSelect('select-ox-formula', 'btn-calc-ox', 'res-ox-calc');
      exerciseSelect('select-nf-reagent', 'btn-calc-nf', 'res-nf-calc');

      const gasTarget = document.getElementById('calcTarget');
      if (gasTarget && typeof window.runGasCalc === 'function') {
        const valid = { inputP: '1', inputV: '22.414', inputN: '1', inputT: '273.15' };
        for (const [id, value] of Object.entries(valid)) document.getElementById(id).value = value;
        for (const target of ['P','V','n','T']) {
          gasTarget.value = target;
          window.runGasCalc();
          const out = document.getElementById('calcOutput').textContent;
          if (!out.trim() || bad(out)) errors.push(`gas:${target}`);
        }
        gasTarget.value = 'V';
        document.getElementById('inputP').value = '0';
        window.runGasCalc();
        if (!/finite positive/i.test(document.getElementById('calcOutput').textContent)) errors.push('gas:zero-guard');
        document.getElementById('inputP').value = '-1';
        window.runGasCalc();
        if (!/finite positive/i.test(document.getElementById('calcOutput').textContent)) errors.push('gas:negative-guard');
      }

      const moleBtn = document.getElementById('btn-calc-mole');
      if (moleBtn) {
        const mass = document.getElementById('input-mole-mass');
        const mm = document.getElementById('input-mole-mm');
        const out = document.getElementById('res-mole-calc');
        mass.value = '0'; mm.value = '18'; moleBtn.click();
        if (bad(out.textContent) || !/0\.0000 mol/.test(out.textContent)) errors.push('mole:zero');
        mass.value = '-1'; moleBtn.click();
        if (!/valid positive/i.test(out.textContent)) errors.push('mole:negative-guard');
      }
      const concBtn = document.getElementById('btn-calc-conc');
      if (concBtn) {
        const n = document.getElementById('input-conc-moles');
        const v = document.getElementById('input-conc-vol');
        const out = document.getElementById('res-conc-calc');
        n.value = '0.1'; v.value = '0'; concBtn.click();
        if (!/valid positive/i.test(out.textContent)) errors.push('molarity:zero-volume-guard');
      }

      for (const tab of document.querySelectorAll('.tab-btn')) tab.click();
      return errors;
    });

    const persistSetup = await page.evaluate(() => {
      const ta = document.querySelector('textarea[data-key], textarea#scratchpadNotes, textarea');
      if (!ta) return null;
      ta.value = 'lpap-persistence-probe';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      return { id: ta.id || null, key: ta.getAttribute('data-key') || null };
    });
    const theme = page.locator('#themeToggle, #theme-toggle-btn').first();
    let themeAfter = null;
    if (await theme.count() && await theme.isVisible()) {
      await theme.click();
      themeAfter = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    }
    await page.reload({ waitUntil: 'load' });
    const persisted = await page.evaluate(probe => {
      const ta = probe ? (probe.id ? document.getElementById(probe.id) : document.querySelector(`textarea[data-key="${probe.key}"]`)) : null;
      return {
        theme: document.documentElement.getAttribute('data-theme'),
        text: ta ? ta.value : null,
        activeAnimations: document.getAnimations().filter(a => a.playState === 'running').length,
      };
    }, persistSetup);
    if (themeAfter && persisted.theme !== themeAfter) interactionErrors.push('theme:persistence');
    if (persistSetup && persisted.text !== 'lpap-persistence-probe') interactionErrors.push('textarea:persistence');
    if (persisted.activeAnimations) interactionErrors.push(`reduced-motion:animations=${persisted.activeAnimations}`);

    await page.keyboard.press('Tab');
    const focusProbe = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return { tag: 'BODY', visible: false };
      const s = getComputedStyle(el);
      const visible = s.outlineStyle !== 'none' || s.boxShadow !== 'none';
      return { tag: el.tagName, id: el.id || '', visible };
    });
    if (!focusProbe.visible) interactionErrors.push('keyboard:focus-not-visible');

    const badNumeric = await page.locator('body').evaluate(el => /\b(?:NaN|Infinity)\b/.test(el.innerText));

    await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    const zoomOverflowPx = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));

    const row = { ...geometry, zoomOverflowPx, external, consoleErrors, pageErrors, badNumeric, interactionErrors, focusProbe };
    report[file][name] = row;
    if (geometry.overflowPx > 1 || geometry.smallTargets.length || geometry.shortTextareas.length || geometry.tinyText.length ||
        zoomOverflowPx > 1 || external.length || consoleErrors.length || pageErrors.length || badNumeric || interactionErrors.length) failed = true;
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (failed) process.exit(1);
