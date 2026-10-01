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
    { name: 'tablet-1366-landscape', width: 1366, height: 854 },
    { name: 'tablet-1440-landscape', width: 1440, height: 900 },
    { name: 'tablet-1280-landscape', width: 1280, height: 800 },
    { name: 'tablet-854-portrait', width: 854, height: 1366 },
    { name: 'tablet-900-portrait', width: 900, height: 1440 },
    { name: 'tablet-800-portrait', width: 800, height: 1280 },
    { name: 'compact', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await load(page);

    const metrics = await page.evaluate(() => {
      const de = document.documentElement;
      const card = document.querySelector('.question-card:not([hidden])');
      const stage = card?.querySelector('.stage-column')?.getBoundingClientRect();
      const supportEl = card?.querySelector('.support-column');
      const support = supportEl?.getBoundingClientRect();
      const solution = card?.querySelector('.solution-column')?.getBoundingClientRect();
      const header = card?.querySelector('.q-header')?.getBoundingClientRect();
      const hintInSupport = !!card?.querySelector('.support-column .hint-ladder');
      const hintInStage = !!card?.querySelector('.stage-column .hint-ladder');
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
        solution: solution ? { x: solution.x, y: solution.y, w: solution.width, h: solution.height, right: solution.right } : null,
        header: header ? { x: header.x, y: header.y, w: header.width, h: header.height, right: header.right } : null,
        primaryFraction: stage && support ? stage.width / (stage.width + support.width) : null,
        supportPosition: supportEl ? getComputedStyle(supportEl).position : null,
        hintInSupport,
        hintInStage,
        undersized,
      };
    });
    observations.viewports[vp.name] = metrics;
    await page.screenshot({ path: `artifacts/qb-tablet/${vp.name}.png`, fullPage: true });
    if (metrics.overflow > 1) fail('QB_HORIZONTAL_OVERFLOW', `${vp.name}: +${metrics.overflow}px`);
    if (metrics.undersized.length) fail('QB_TOUCH_TARGET_UNDERSIZED', `${vp.name}: ${JSON.stringify(metrics.undersized.slice(0, 8))}`);
    if (vp.width >= 980) {
      if (!(metrics.support && metrics.stage && metrics.support.x > metrics.stage.x)) {
        fail('QB_TABLET_SUPPORT_RAIL_LAYOUT', `${vp.name}: ${JSON.stringify(metrics)}`);
      }
      if (metrics.primaryFraction === null || Math.abs(metrics.primaryFraction - 0.42) > 0.03) {
        fail('QB_CORE2_REFERENCE_FRACTION', `${vp.name}: expected 0.42/0.58, got ${metrics.primaryFraction}`);
      }
      if (metrics.supportPosition !== 'static') {
        fail('QB_SUPPORT_RAIL_SCROLL_MODEL', `${vp.name}: expected normal-flow support rail, got ${metrics.supportPosition}`);
      }
      if (!metrics.hintInSupport || metrics.hintInStage) {
        fail('QB_CORE2_SUPPORT_LANE', `${vp.name}: hints must live in the support lane`);
      }
      if (!(metrics.solution && metrics.stage && metrics.support &&
            Math.abs(metrics.solution.x - metrics.stage.x) <= 2 &&
            Math.abs(metrics.solution.right - (metrics.support.x + metrics.support.w)) <= 2)) {
        fail('QB_CORE2_FULL_WIDTH_SOLUTION', `${vp.name}: ${JSON.stringify(metrics)}`);
      }
    } else {
      if (!(metrics.support && metrics.stage && metrics.support.y > metrics.stage.y &&
            metrics.solution && metrics.solution.y >= metrics.support.y + metrics.support.h - 2)) {
        fail('QB_PORTRAIT_STACK_LAYOUT', `${vp.name}: ${JSON.stringify(metrics)}`);
      }
    }
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 1366, height: 854 } });
  await load(page);

  const counts = await page.evaluate(() => {
    const mathLive = document.querySelectorAll('math').length;
    const mathTemplate = [...document.querySelectorAll('template')]
      .reduce((sum, tpl) => sum + tpl.content.querySelectorAll('math').length, 0);
    return {
      questions: document.querySelectorAll('.question-card').length,
      selected: document.querySelectorAll('.question-card[data-selected="true"]').length,
      svg: document.querySelectorAll('.question-card[data-selected="true"] .representation-box svg').length,
      hints: document.querySelectorAll('.hint-pill').length,
      solutions: document.querySelectorAll('.solution-slot').length,
      mathLive,
      mathTemplate,
      mathTotal: mathLive + mathTemplate,
    };
  });
  observations.runtime.counts = counts;
  const expectedCounts = { questions: 77, selected: 7, svg: 7, hints: 195, solutions: 77 };
  for (const [key, expected] of Object.entries(expectedCounts)) {
    if (counts[key] !== expected) fail('QB_RUNTIME_DENOMINATOR', `${key}: expected ${expected}, got ${counts[key]}`);
  }
  const markupMath = candidateBytes.toString('utf8').split('<math').length - 1;
  observations.runtime.math_markup_count = markupMath;
  if (markupMath < 100) fail('QB_DECLARED_MATH_MARKUP_TOO_THIN', `expected >100 MathML nodes in exact HTML, got ${markupMath}`);
  if (counts.mathTotal !== markupMath) {
    fail('QB_DECLARED_MATH_DOM_MISMATCH', `HTML has ${markupMath}; live+template DOM has ${counts.mathTotal}`);
  }

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

  // Keyboard/focus and virtual-keyboard behavior are part of the tablet contract.
  // Reduced-motion emulation also proves focus recovery does not force animated scrolling.
  const keyboardPage = await browser.newPage({
    viewport: { width: 800, height: 1280 },
    reducedMotion: 'reduce',
  });
  await keyboardPage.addInitScript(() => {
    window.__qbScrollCalls = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function(options) {
      window.__qbScrollCalls.push({
        id: this.id || '',
        behavior: options?.behavior || null,
        block: options?.block || null,
      });
      if (original) return original.call(this, options);
    };
  });
  await load(keyboardPage);
  const keyboardQuestion = keyboardPage.locator('#PYQ-PHY-IITJEE-2007-P1-Q03');
  const keyboardChoice = keyboardQuestion.locator('input.answer-choice[value="B"]');
  await keyboardChoice.focus();
  await keyboardPage.keyboard.press('Space');
  if (!(await keyboardChoice.isChecked())) {
    fail('QB_KEYBOARD_OPERABILITY', 'Space did not select the focused answer choice');
  }
  const keyboardReveal = keyboardQuestion.locator('.check-solution-btn');
  if (await keyboardReveal.isDisabled()) {
    fail('QB_KEYBOARD_OPERABILITY', 'keyboard answer commitment did not enable reveal');
  }
  await keyboardReveal.focus();
  const focusState = await keyboardReveal.evaluate(el => {
    const cs = getComputedStyle(el);
    return {
      focusVisible: el.matches(':focus-visible'),
      outlineStyle: cs.outlineStyle,
      outlineWidth: cs.outlineWidth,
    };
  });
  observations.runtime.keyboard_focus = focusState;
  if (!focusState.focusVisible || focusState.outlineStyle === 'none' || parseFloat(focusState.outlineWidth) < 2) {
    fail('QB_FOCUS_VISIBILITY', JSON.stringify(focusState));
  }
  await keyboardPage.keyboard.press('Enter');
  if (!(await keyboardQuestion.locator('.solution-slot').innerText()).includes('Verified answer:')) {
    fail('QB_KEYBOARD_OPERABILITY', 'Enter did not activate the focused solution reveal');
  }

  const keyboardFree = keyboardPage.locator('#PYQ-PHY-IITJEE-2011-P1-Q41 .answer-input');
  await keyboardFree.focus();
  await keyboardPage.waitForTimeout(100);
  const beforeViewportResize = await keyboardPage.evaluate(() => window.__qbScrollCalls.length);
  const viewportResizeDispatched = await keyboardPage.evaluate(() => {
    if (!window.visualViewport) return false;
    window.visualViewport.dispatchEvent(new Event('resize'));
    return true;
  });
  await keyboardPage.waitForTimeout(100);
  const scrollCalls = await keyboardPage.evaluate(() => window.__qbScrollCalls);
  observations.runtime.keyboard_focus.scrollCalls = scrollCalls.slice(-8);
  observations.runtime.keyboard_focus.visualViewportResizeDispatched = viewportResizeDispatched;
  if (!scrollCalls.some(call =>
    call.id === 'PYQ-PHY-IITJEE-2011-P1-Q41-answer' &&
    call.behavior === 'auto' &&
    call.block === 'center'
  )) {
    fail('QB_REDUCED_MOTION_FOCUS_SCROLL', JSON.stringify(scrollCalls.slice(-8)));
  }
  if (viewportResizeDispatched && scrollCalls.length <= beforeViewportResize) {
    fail('QB_VISUAL_VIEWPORT_FOCUS_RESCROLL', 'focused input was not re-centered after visualViewport resize');
  }
  await keyboardPage.close();

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
