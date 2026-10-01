// Exact-browser audit for standalone/core2-canonical-question-bank-tablet.html
// Requires Playwright 1.56.1 + Chromium.
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const out = process.argv[2] || 'artifacts/qb-tablet-standalone-browser.json';
const port = 8769;
const base = `http://127.0.0.1:${port}/standalone/core2-canonical-question-bank-tablet.html`;

const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
await new Promise((resolve, reject) => {
  const timer = setTimeout(resolve, 800);
  server.on('error', err => { clearTimeout(timer); reject(err); });
});

const browser = await chromium.launch({ headless: true });
const findings = [];
const candidatePath = 'standalone/core2-canonical-question-bank-tablet.html';
const candidateBytes = readFileSync(candidatePath);
const observations = {
  schema: 'grade9v3-qb-tablet-browser-audit-v1',
  candidate: {
    path: candidatePath,
    bytes: candidateBytes.length,
    sha256: createHash('sha256').update(candidateBytes).digest('hex'),
  },
  viewports: {},
  runtime: {},
};
const fail = (point, detail) => findings.push({ point, detail });

async function load(page) {
  const requests = [];
  page.on('request', req => requests.push(req.url()));
  await page.goto(base, { waitUntil: 'load' });
  await page.waitForTimeout(80);
  const remote = requests.filter(url => !url.startsWith(`http://127.0.0.1:${port}/`));
  if (remote.length) fail('QB_EXTERNAL_RUNTIME_DEPENDENCY', remote.join(', '));
  return requests;
}

try {
  for (const vp of [
    { name: 'tablet-landscape', width: 1280, height: 800 },
    { name: 'tablet-portrait', width: 800, height: 1280 },
    { name: 'compact', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await load(page);

    const metrics = await page.evaluate(() => {
      const de = document.documentElement;
      const card = document.querySelector('.question-card:not([hidden])');
      const stage = card?.querySelector('.stage-column')?.getBoundingClientRect();
      const support = card?.querySelector('.support-column')?.getBoundingClientRect();
      const controls = [...document.querySelectorAll('button:not([hidden]),input:not([hidden]),textarea:not([hidden])')]
        .filter(el => {
          const cs = getComputedStyle(el);
          return cs.display !== 'none' && cs.visibility !== 'hidden';
        });
      const undersized = [];
      for (const el of controls) {
        const r = el.getBoundingClientRect();
        if (el.matches('input[type=radio],input[type=checkbox]')) {
          const lr = el.closest('label')?.getBoundingClientRect();
          if (!lr || lr.height < 48) undersized.push({ tag: el.tagName, cls: el.className, w: lr?.width || 0, h: lr?.height || 0 });
        } else if (r.height < 48 || (el.tagName === 'BUTTON' && r.width < 48)) {
          undersized.push({ tag: el.tagName, cls: el.className, w: r.width, h: r.height });
        }
      }
      return {
        scrollWidth: de.scrollWidth,
        clientWidth: de.clientWidth,
        overflow: de.scrollWidth - de.clientWidth,
        stage: stage ? { x: stage.x, y: stage.y, w: stage.width, h: stage.height } : null,
        support: support ? { x: support.x, y: support.y, w: support.width, h: support.height } : null,
        undersized,
      };
    });
    observations.viewports[vp.name] = metrics;
    await page.screenshot({ path: `artifacts/qb-tablet/${vp.name}.png`, fullPage: true });
    if (metrics.overflow > 1) fail('QB_HORIZONTAL_OVERFLOW', `${vp.name}: +${metrics.overflow}px`);
    if (metrics.undersized.length) fail('QB_TOUCH_TARGET_UNDERSIZED', `${vp.name}: ${JSON.stringify(metrics.undersized.slice(0, 8))}`);
    if (vp.width >= 1100) {
      if (!(metrics.support && metrics.stage && metrics.support.x > metrics.stage.x && metrics.support.w >= 359)) {
        fail('QB_TABLET_SUPPORT_RAIL_LAYOUT', `${vp.name}: ${JSON.stringify(metrics)}`);
      }
    } else {
      if (!(metrics.support && metrics.stage && metrics.support.y > metrics.stage.y)) {
        fail('QB_PORTRAIT_STACK_LAYOUT', `${vp.name}: ${JSON.stringify(metrics)}`);
      }
    }
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await load(page);

  const counts = await page.evaluate(() => ({
    questions: document.querySelectorAll('.question-card').length,
    selected: document.querySelectorAll('.question-card[data-selected="true"]').length,
    svg: document.querySelectorAll('.question-card[data-selected="true"] .representation-box svg').length,
    hints: document.querySelectorAll('.hint-pill').length,
    solutions: document.querySelectorAll('.solution-slot').length,
    math: document.querySelectorAll('math').length,
  }));
  observations.runtime.counts = counts;
  const expectedCounts = { questions: 77, selected: 7, svg: 7, hints: 195, solutions: 77 };
  for (const [key, expected] of Object.entries(expectedCounts)) {
    if (counts[key] !== expected) fail('QB_RUNTIME_DENOMINATOR', `${key}: expected ${expected}, got ${counts[key]}`);
  }
  if (counts.math < 100) fail('QB_DECLARED_MATH_NOT_TYPESET', `expected >100 MathML nodes, got ${counts.math}`);

  const visibleCount = async () => page.locator('.question-card:visible').count();
  for (const [filterName, expected] of [['physics', 31], ['chemistry', 46], ['selected', 7], ['d3d4', 30]]) {
    await page.locator(`.tab-btn[data-filter="${filterName}"]`).click();
    const actual = await visibleCount();
    if (actual !== expected) fail('QB_FILTER_COUNT_MISMATCH', `${filterName}: expected ${expected}, got ${actual}`);
  }

  await page.locator('.tab-btn[data-filter="all"]').click();
  const search = page.locator('#search-input');
  await search.fill('redox');
  const redoxCount = await visibleCount();
  observations.runtime.redox_search_count = redoxCount;
  if (redoxCount < 1) fail('QB_SEARCH_RUNTIME', 'redox returned no results');
  await page.locator('#clear-search').click();
  await page.waitForTimeout(20);
  const resetCount = await visibleCount();
  const resetText = await page.locator('#result-count').innerText();
  observations.runtime.search_reset = { resetCount, resetText };
  if (resetCount !== 77) fail('QB_SEARCH_RESET', `expected 77, got ${resetCount}; result text=${resetText}`);

  const q = page.locator('#PYQ-PHY-IITJEE-2007-P1-Q03');
  const bodyBefore = await q.innerText();
  if (bodyBefore.includes('Verified answer:') || bodyBefore.includes('Let the midpoint rise by y.')) {
    fail('QB_SOLUTION_LIVE_DOM_LEAK', 'solution visible in learner text before commitment');
  }
  if (bodyBefore.includes('Sketch one half-string as a right triangle')) {
    fail('QB_HINT_LIVE_DOM_LEAK', 'hint visible in learner text before request');
  }

  const hints = q.locator('.hint-pill');
  if (!(await hints.nth(1).isDisabled())) fail('QB_HINT_PROGRESSION', 'hint 2 should begin disabled');
  await hints.nth(0).click();
  if (await hints.nth(1).isDisabled()) fail('QB_HINT_PROGRESSION', 'hint 2 did not unlock after hint 1');
  if (!(await q.locator('.hint-slot').nth(0).innerText()).includes('right triangle')) fail('QB_HINT_MATERIALIZATION', 'hint 1 payload missing');

  const reveal = q.locator('.check-solution-btn');
  if (!(await reveal.isDisabled())) fail('QB_ATTEMPT_GATE', 'solution reveal should begin disabled');
  await q.locator('input.answer-choice[value="B"]').check();
  if (await reveal.isDisabled()) fail('QB_ATTEMPT_GATE', 'solution reveal did not enable after answer commit');
  await reveal.click();
  const feedback = await q.locator('.answer-feedback').innerText();
  if (!feedback.includes('matches the verified answer')) fail('QB_OPTION_CHECK', feedback);
  const solutionText = await q.locator('.solution-slot').innerText();
  if (!solutionText.includes('Verified answer:') || !solutionText.includes('massless midpoint')) fail('QB_SOLUTION_MATERIALIZATION', solutionText.slice(0, 200));
  await q.screenshot({ path: 'artifacts/qb-tablet/attempt-hint-solution.png' });

  // Multi-correct commitment must compare the complete selected option set.
  const multi = page.locator('#PYQ-PHY-JEEADV-2014-P1-Q08');
  const multiReveal = multi.locator('.check-solution-btn');
  if (!(await multiReveal.isDisabled())) fail('QB_MULTI_ATTEMPT_GATE', 'multi-correct reveal should begin disabled');
  await multi.locator('input.answer-choice[value="C"]').check();
  await multi.locator('input.answer-choice[value="D"]').check();
  if (await multiReveal.isDisabled()) fail('QB_MULTI_ATTEMPT_GATE', 'multi-correct reveal did not enable');
  await multiReveal.click();
  const multiFeedback = await multi.locator('.answer-feedback').innerText();
  if (!multiFeedback.includes('matches the verified answer')) fail('QB_MULTI_OPTION_CHECK', multiFeedback);

  // Numeric/free-response commitment is intentionally commitment-only, not fake auto-grading.
  const free = page.locator('#PYQ-PHY-IITJEE-2011-P1-Q41');
  const freeReveal = free.locator('.check-solution-btn');
  if (!(await freeReveal.isDisabled())) fail('QB_FREE_ATTEMPT_GATE', 'free-response reveal should begin disabled');
  await free.locator('.answer-input').fill('5');
  if (await freeReveal.isDisabled()) fail('QB_FREE_ATTEMPT_GATE', 'free-response reveal did not enable');
  await freeReveal.click();
  const freeFeedback = await free.locator('.answer-feedback').innerText();
  if (!freeFeedback.includes('Attempt committed')) fail('QB_FREE_RESPONSE_SEMANTICS', freeFeedback);
  if (!(await free.locator('.solution-slot').innerText()).includes('Verified answer:')) {
    fail('QB_FREE_SOLUTION_MATERIALIZATION', 'free-response solution did not materialize after commitment');
  }

  const scratch = q.locator('.practice-textarea');
  await scratch.fill('persisted scratchpad witness');
  await page.reload({ waitUntil: 'load' });
  const persisted = await page.locator('#PYQ-PHY-IITJEE-2007-P1-Q03 .practice-textarea').inputValue();
  if (persisted !== 'persisted scratchpad witness') fail('QB_LOCALSTORAGE_PERSISTENCE', persisted);

  const initialTheme = await page.locator('html').getAttribute('data-theme');
  await page.locator('#theme-toggle').click();
  const toggledTheme = await page.locator('html').getAttribute('data-theme');
  if (toggledTheme === initialTheme) fail('QB_THEME_TOGGLE', 'theme did not change');
  await page.reload({ waitUntil: 'load' });
  if ((await page.locator('html').getAttribute('data-theme')) !== toggledTheme) fail('QB_THEME_PERSISTENCE', 'theme did not persist');

  const viewportApi = await page.evaluate(() => ({
    hasVisualViewport: !!window.visualViewport,
    viewportMeta: document.querySelector('meta[name=viewport]')?.content || '',
  }));
  observations.runtime.viewport = viewportApi;
  if (/user-scalable\s*=\s*no|max(?:imum)?-scale\s*=\s*1/i.test(viewportApi.viewportMeta)) {
    fail('QB_ZOOM_DISABLED', viewportApi.viewportMeta);
  }

  await page.locator('.tab-btn[data-filter="selected"]').click();
  const selectedWithSvg = await page.locator('.question-card:visible .representation-box svg').count();
  if (selectedWithSvg !== 7) fail('QB_SELECTED_BENCHMARK_REPRESENTATION', `expected 7 SVGs, got ${selectedWithSvg}`);
  const selectedPageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  observations.runtime.selected_page_height = selectedPageHeight;
  if (selectedPageHeight >= 20000) fail('QB_SELECTED_FILTER_RENDER_HEIGHT', `selected view remained unexpectedly tall: ${selectedPageHeight}px`);
  await page.screenshot({ path: 'artifacts/qb-tablet/selected-d3d4.png', fullPage: true });

  observations.runtime.findings = findings;
  writeFileSync(out, JSON.stringify(observations, null, 2) + '\n');
  if (findings.length) {
    console.error(JSON.stringify(findings, null, 2));
    process.exitCode = 1;
  } else {
    console.log('QB tablet standalone browser audit: PASS');
  }
  await page.close();
} finally {
  await browser.close();
  server.kill('SIGTERM');
}
