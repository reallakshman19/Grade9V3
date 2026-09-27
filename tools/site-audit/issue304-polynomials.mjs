#!/usr/bin/env node
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(execSync('npm root -g').toString().trim() + '/playwright'); }

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const root = path.join(repo, 'standalone/stress-test/polynomials');
const explorer = 'remainder-factor-structure-lab.html';
const clinics = 'question-clinic-prototype.html';
const viewports = [
  { name: 'tablet-12.7-landscape-1366', width: 1366, height: 854 },
  { name: 'tablet-12.7-landscape-1440', width: 1440, height: 900 },
  { name: 'tablet-12.7-portrait', width: 900, height: 1440 },
];

const browser = await playwright.chromium.launch();
const report = { viewports: {}, behavior: {} };

async function commonMeasurements(file, vp) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: true });
  const page = await context.newPage();
  const pageErrors = [];
  const externalRequests = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('request', req => {
    const u = req.url();
    if (!u.startsWith('file:') && !u.startsWith('data:')) externalRequests.push(u);
  });
  await page.goto('file://' + path.join(root, file));
  const measured = await page.evaluate(() => {
    const visible = el => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
    };
    const primary = [...document.querySelectorAll('button,.action-link,input,select,textarea')].filter(visible);
    const small = primary.filter(el => {
      const r = el.getBoundingClientRect();
      return Math.min(r.width, r.height) < 48 && el.tagName !== 'TEXTAREA';
    });
    return {
      overflowPx: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      smallTargets: small.map(el => ({ tag: el.tagName, text: (el.textContent || el.value || '').trim().slice(0,40), width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height })),
      focusRule: [...document.styleSheets].flatMap(s => { try { return [...s.cssRules].map(r=>r.cssText); } catch { return []; } }).join('\n').includes(':focus-visible'),
      nav: [...document.querySelectorAll('nav a[href]')].map(a => ({text:a.textContent.trim(), href:a.getAttribute('href')})),
    };
  });
  await context.close();
  return {...measured, pageErrors, externalRequests};
}

for (const vp of viewports) {
  report.viewports[vp.name] = {
    explorer: await commonMeasurements(explorer, vp),
    clinics: await commonMeasurements(clinics, vp),
  };
}

{
  const context = await browser.newContext({ viewport: { width: 1366, height: 854 }, hasTouch: true });
  const page = await context.newPage();
  await page.goto('file://' + path.join(root, explorer));
  report.behavior.explorerPreAttemptEmpty = await page.locator('#observation-host').evaluate(el => el.childElementCount === 0 && !el.innerText.trim());
  await page.getByRole('button', {name:'Non-monic regression'}).click();
  const before = await page.locator('body').innerText();
  report.behavior.explorerProtectedPreCommit = !before.includes('5/8') && !before.includes('3/2·x^2');
  await page.getByRole('button', {name:'No'}).click();
  await page.getByRole('button', {name:'Commit prediction & observe'}).click();
  const after = await page.locator('#observation-host').innerText();
  report.behavior.explorerExactRegression = after.includes('5/8') && after.includes('3/2·x^2') && after.includes('P(1/2)');
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 900, height: 1440 }, hasTouch: true });
  const page = await context.newPage();
  await page.goto('file://' + path.join(root, clinics));
  const pre = await page.locator('body').innerText();
  report.behavior.clinicProtectedPreCommit = !pre.includes('Q(x) = 3/2 x²') && !pre.includes('R(x) = 3x + 2') && !pre.includes('= −1260.');
  const first = page.locator('#fixture-nonmonic');
  await first.getByRole('button', {name:'Commit first decision'}).click();
  report.behavior.clinicBlankAttemptRejected = (await first.getByRole('status').innerText()).includes('genuine first decision');
  await first.locator('textarea').fill('I need to account for the leading coefficient of the divisor.');
  await first.getByRole('button', {name:'Commit first decision'}).click();
  const afterCommit = await first.innerText();
  report.behavior.clinicDecisionBeforeSolution = afterCommit.includes('Decision checkpoint') && !afterCommit.includes('Complete derivation and independent check');
  const next = first.getByRole('button', {name:'Show next support step'});
  await next.click(); await next.click(); await next.click();
  await first.getByRole('button', {name:'Reveal complete derivation & check'}).click();
  const solved = await first.innerText();
  report.behavior.clinicProgressiveSolution = solved.includes('Support 1') && solved.includes('Support 2') && solved.includes('Support 3') && solved.includes('Q(x) = 3/2 x² − 7/4 x + 21/8');
  await context.close();
}

await browser.close();

const failures = [];
for (const [vp, pages] of Object.entries(report.viewports)) {
  for (const [name, result] of Object.entries(pages)) {
    if (result.overflowPx > 1) failures.push(`${vp}/${name}: horizontal overflow ${result.overflowPx}px`);
    if (result.smallTargets.length) failures.push(`${vp}/${name}: ${result.smallTargets.length} targets below 48px`);
    if (!result.focusRule) failures.push(`${vp}/${name}: no :focus-visible rule`);
    if (result.pageErrors.length) failures.push(`${vp}/${name}: page errors ${result.pageErrors.join('; ')}`);
    if (result.externalRequests.length) failures.push(`${vp}/${name}: external requests ${result.externalRequests.join(', ')}`);
    if (!result.nav.some(x=>/Back to Core2/.test(x.text)) || !result.nav.some(x=>/home/i.test(x.text))) failures.push(`${vp}/${name}: missing navigation`);
  }
}
for (const [name, ok] of Object.entries(report.behavior)) if (!ok) failures.push(`behavior:${name}`);
console.log(JSON.stringify(report, null, 2));
if (failures.length) {
  console.error('\nFAIL\n' + failures.join('\n'));
  process.exit(1);
}
console.log('\nPASS issue304 exact rendered-browser validation');
