#!/usr/bin/env node
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(execSync('npm root -g').toString().trim() + '/playwright'); }

const input = process.argv[2];
if (!input) throw new Error('usage: core2-source-spine-audit.mjs <html> [--json out.json] [--screens dir]');
const htmlPath = path.resolve(input);
const jsonArg = process.argv.indexOf('--json');
const screensArg = process.argv.indexOf('--screens');
const jsonOut = jsonArg >= 0 ? path.resolve(process.argv[jsonArg + 1]) : null;
const screens = screensArg >= 0 ? path.resolve(process.argv[screensArg + 1]) : null;
if (screens) fs.mkdirSync(screens, { recursive: true });

const VIEWPORTS = [
  { name: 'tablet-1366x854-landscape', width: 1366, height: 854 },
  { name: 'tablet-1440x900-landscape', width: 1440, height: 900 },
  { name: 'tablet-854x1366-portrait', width: 854, height: 1366 },
  { name: 'tablet-900x1440-portrait', width: 900, height: 1440 },
];

const browser = await playwright.chromium.launch();
const report = { file: htmlPath, viewports: {}, errors: [] };
for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const pageErrors = [];
  const remote = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('request', req => {
    const u = req.url();
    if (/^https?:/i.test(u)) remote.push(u);
  });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });

  const pre = await page.evaluate(() => {
    const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const controls = [...document.querySelectorAll('button,a.enrich,.nav a,select,.home')].filter(visible);
    const small = controls.filter(el => { const r = el.getBoundingClientRect(); return Math.min(r.width, r.height) < 48; });
    const figs = [...document.querySelectorAll('[data-g9-figure]')];
    const overflowingFigs = figs.filter(f => {
      const r = f.getBoundingClientRect(), p = f.closest('.question').getBoundingClientRect();
      return r.right > p.right + 1 || r.left < p.left - 1;
    });
    const questions = [...document.querySelectorAll('[data-question-id]')];
    return {
      core: document.documentElement.getAttribute('data-core'),
      sourceAcquisition: document.querySelector('meta[name="g9-source-acquisition"]')?.content || null,
      sourceDigest: document.querySelector('meta[name="g9-source-digest"]')?.content || null,
      questionCount: questions.length,
      horizontalOverflowPx: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      primaryTargets: controls.length,
      targetsUnder48: small.length,
      targetSample: small.slice(0, 4).map(el => ({ text: el.textContent.trim().slice(0, 30), rect: [Math.round(el.getBoundingClientRect().width), Math.round(el.getBoundingClientRect().height)] })),
      figureCount: figs.length,
      figuresOverflowingCards: overflowingFigs.length,
      inaccessibleFigures: figs.filter(f => !f.querySelector('img[alt]') && !f.querySelector('[role="img"][aria-label]')).length,
      answerButtonsLocked: [...document.querySelectorAll('[data-g9-reveal-answer]')].every(b => b.disabled),
      answerSlotsEmpty: [...document.querySelectorAll('[data-g9-answer-slot]')].every(x => !x.textContent.trim()),
      absentFigureQuestionHasFigure: !!document.querySelector('#FIX-Q-01 [data-g9-figure]'),
      sourceHintQuestions: document.querySelectorAll('[data-source-hints]').length,
      landmarks: { header: document.querySelectorAll('header').length, nav: document.querySelectorAll('nav').length, main: document.querySelectorAll('main').length, footer: document.querySelectorAll('footer').length },
      searchLeaksAnswerText: [...document.querySelectorAll('[data-question-id]')].some(q => (q.dataset.searchText || '').includes('source-answer fixture')),
    };
  });

  const q1 = page.locator('#FIX-Q-01');
  await q1.locator('input[type=radio]').first().check();
  await q1.locator('[data-g9-commit]').click();
  const postCommit = await page.evaluate(() => ({
    q1Unlocked: !document.querySelector('#FIX-Q-01 [data-g9-reveal-answer]').disabled,
    q2StillLocked: document.querySelector('#FIX-Q-02 [data-g9-reveal-answer]').disabled,
    q3StillLocked: document.querySelector('#FIX-Q-03 [data-g9-reveal-answer]').disabled,
  }));
  await q1.locator('[data-g9-reveal-answer]').click();
  const postReveal = await page.evaluate(() => ({
    q1SourceAnswerVisible: !!document.querySelector('#FIX-Q-01 .answer-card .prov') && !document.querySelector('#FIX-Q-01 [data-g9-answer-slot]').hidden,
    q2AnswerStillEmpty: !document.querySelector('#FIX-Q-02 [data-g9-answer-slot]').textContent.trim(),
  }));

  const q2 = page.locator('#FIX-Q-02');
  await q2.locator('[data-attempt-control]').fill('attempt');
  await q2.locator('[data-g9-commit]').click();
  await q2.locator('[data-g9-next-source-hint]').click();
  const hintState = await page.evaluate(() => ({
    q2HintCount: document.querySelectorAll('#FIX-Q-02 [data-g9-source-hint-list] li').length,
    q1HasHintControl: !!document.querySelector('#FIX-Q-01 [data-g9-next-source-hint]'),
  }));

  const q3 = page.locator('#FIX-Q-03');
  await q3.locator('[data-paper-attempt]').check();
  await q3.locator('[data-g9-commit]').click();
  const freeResponse = await page.evaluate(() => !document.querySelector('#FIX-Q-03 [data-g9-reveal-answer]').disabled);

  await page.locator('[data-g9-family]').selectOption('FAM-GRAPH');
  const familyFilter = await page.evaluate(() => ({
    visible: [...document.querySelectorAll('[data-question-id]')].filter(q => !q.hidden).map(q => q.id),
  }));

  const focusablePrimary = await page.evaluate(() => [...document.querySelectorAll('button:not(:disabled),a[href],select,input:not(:disabled),textarea:not(:disabled)')].every(el => el.tabIndex >= 0));
  report.viewports[vp.name] = { ...pre, ...postCommit, ...postReveal, ...hintState, freeResponseUnlocked: freeResponse, familyFilter, focusablePrimary, remoteRequests: [...new Set(remote)], pageErrors };
  if (screens) await page.screenshot({ path: path.join(screens, vp.name + '.png'), fullPage: true });
  await page.close();
}
await browser.close();

const failures = [];
for (const [name, r] of Object.entries(report.viewports)) {
  const checks = {
    core2: r.core === 'CORE2', noHorizontalOverflow: r.horizontalOverflowPx <= 1, touch48: r.targetsUnder48 === 0,
    figuresFit: r.figuresOverflowingCards === 0, figuresAccessible: r.inaccessibleFigures === 0,
    answersLockedInitially: r.answerButtonsLocked && r.answerSlotsEmpty, noAnswerSearchLeak: !r.searchLeaksAnswerText,
    isolatedAttempt: r.q1Unlocked && r.q2StillLocked && r.q3StillLocked, isolatedReveal: r.q1SourceAnswerVisible && r.q2AnswerStillEmpty,
    sourceHintsOnly: r.q2HintCount === 1 && !r.q1HasHintControl, freeResponseAttempt: r.freeResponseUnlocked,
    absentFigureMeansAbsent: !r.absentFigureQuestionHasFigure, familyFilter: JSON.stringify(r.familyFilter.visible) === JSON.stringify(['FIX-Q-03']),
    keyboardReachable: r.focusablePrimary, landmarks: Object.values(r.landmarks).every(n => n === 1),
    offline: r.remoteRequests.length === 0, noPageErrors: r.pageErrors.length === 0,
  };
  r.checks = checks;
  for (const [check, ok] of Object.entries(checks)) if (!ok) failures.push(name + ':' + check);
}
report.failures = failures;
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exitCode = failures.length ? 1 : 0;
