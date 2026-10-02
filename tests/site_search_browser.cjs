// Drives the header search in a real browser, from pages opened as files, and reports what it measured.
//   node tests/site_search_browser.cjs REPO_ROOT   -> one JSON report on stdout
const { execSync } = require('child_process');
let playwright;
try { playwright = require('playwright'); } catch (e) { playwright = require(execSync('npm root -g').toString().trim() + '/playwright'); }
const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
const site = (rel) => 'file://' + path.join(repo, 'public', rel);
const index = JSON.parse(fs.readFileSync(path.join(repo, 'public/data/search-index.v2.json'), 'utf8'));
const hintTexts = index.documents.filter((d) => d.kind === 'HINT').map((d) => d.text).filter((t) => t.length >= 20);
const VIEWPORTS = { tablet_landscape: [1366, 854], tablet_portrait: [854, 1366], phone: [390, 844] };

async function floors(page) {
  return page.evaluate(() => {
    const dialog = document.querySelector('dialog[data-g9-site-search]');
    const small = [], tight = [];
    const walker = document.createTreeWalker(dialog, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement, cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (parseFloat(cs.fontSize) < 14) small.push(`${el.className || el.tagName}: ${cs.fontSize} "${n.textContent.trim().slice(0, 30)}"`);
    }
    dialog.querySelectorAll('button, select, input, summary, a.g9-search-result').forEach((el) => {
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      if (cs.display === 'none' || r.width === 0) return;
      if (r.height < 47.5) tight.push(`${el.className || el.tagName}: ${Math.round(r.height)}px`);
    });
    return { small: [...new Set(small)].slice(0, 8), tight: [...new Set(tight)].slice(0, 8), overflowX: dialog.scrollWidth > dialog.clientWidth + 1 };
  });
}

async function resultsOf(page) {
  return page.$$eval('.g9-search-result', (els) => els.map((e) => ({ kind: e.getAttribute('data-kind'), title: e.querySelector('.g9-search-result-main').textContent, href: e.getAttribute('href'), text: e.innerText })));
}

(async () => {
  const browser = await playwright.chromium.launch();
  const report = { viewports: {}, errors: [], external: [] };
  for (const [name, [width, height]] of Object.entries(VIEWPORTS)) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    page.on('console', (m) => { if (m.type() === 'error') report.errors.push(`${name}: ${m.text()}`); });
    page.on('pageerror', (e) => report.errors.push(`${name}: PAGEERROR ${e.message}`));
    page.on('request', (r) => { if (!r.url().startsWith('file://') && !r.url().startsWith('data:')) report.external.push(r.url()); });
    const v = (report.viewports[name] = {});

    await page.goto(site('physics/index.html'));
    await page.keyboard.press('Control+k');
    await page.waitForSelector('dialog[open] [data-g9-site-search-input]');
    await page.waitForSelector('.g9-search-empty');
    v.empty = await page.textContent('.g9-search-empty');
    v.focusOnInput = await page.evaluate(() => document.activeElement && document.activeElement.hasAttribute('data-g9-site-search-input'));
    v.floorsEmpty = await floors(page);

    await page.fill('[data-g9-site-search-input]', 'projectile');
    await page.waitForFunction(() => document.querySelector('.g9-search-summary').textContent.includes('results'));
    v.chips = await page.$$eval('.g9-search-chip', (els) => els.map((e) => e.textContent));
    v.all = await resultsOf(page);
    v.floorsResults = await floors(page);
    const dialogText = await page.$eval('dialog[data-g9-site-search]', (d) => d.innerText);
    v.hintTextShown = hintTexts.filter((t) => dialogText.includes(t)).length;

    await page.click('[data-g9-site-search-kind="HINT"]');
    v.hints = await resultsOf(page);
    const hintDialogText = await page.$eval('dialog[data-g9-site-search]', (d) => d.innerText);
    v.hintTextShownOnHintTab = hintTexts.filter((t) => hintDialogText.includes(t)).length;
    v.hintNote = v.hints.length ? v.hints[0].text : '';

    await page.click('[data-g9-site-search-kind="ALL"]');
    await page.fill('[data-g9-site-search-input]', 'redox');
    await page.waitForFunction(() => document.querySelector('.g9-search-summary').textContent.includes('redox'));
    await page.locator('details.g9-search-filters-box > summary').click();
    await page.selectOption('[data-g9-site-search-filter="subject"]', 'Chemistry');
    v.redoxChemistry = (await resultsOf(page)).length;
    await page.selectOption('[data-g9-site-search-filter="subject"]', 'Mathematics');
    v.redoxMathematics = (await resultsOf(page)).length;
    v.noMatchMessage = await page.textContent('.g9-search-empty');
    v.summaryAfterFilter = await page.textContent('.g9-search-filters-box > summary');
    v.floorsFilters = await floors(page);
    await page.click('.g9-search-clear');
    await page.fill('[data-g9-site-search-input]', 'PYQ-PHY-IITJEE-2011-P2-Q33');
    await page.waitForFunction(() => document.querySelector('.g9-search-summary').textContent.includes('PYQ'));
    v.idResults = await resultsOf(page);

    // keyboard: down into the results, up back to the input, Enter opens the first
    await page.focus('[data-g9-site-search-input]');
    await page.keyboard.press('ArrowDown');
    v.focusOnFirstResult = await page.evaluate(() => document.activeElement.classList.contains('g9-search-result'));
    await page.keyboard.press('ArrowUp');
    v.focusBackOnInput = await page.evaluate(() => document.activeElement.hasAttribute('data-g9-site-search-input'));
    await Promise.all([page.waitForURL(/question-bank\/index\.html\?q=/), page.keyboard.press('Enter')]);
    v.openedUrl = page.url();
    v.openedPageHasHeader = await page.$('header.site-nav') !== null;

    // from a page at another depth, and Escape closes
    await page.goto(site('index.html'));
    await page.keyboard.press('Control+k');
    await page.waitForSelector('dialog[open]');
    await page.fill('[data-g9-site-search-input]', 'linear equations');
    await page.waitForFunction(() => document.querySelector('.g9-search-summary').textContent.includes('results'));
    v.rootResults = (await resultsOf(page)).map((r) => r.href);
    const first = page.locator('a.g9-search-result').first();
    await Promise.all([page.waitForLoadState('load'), first.click()]);
    v.rootOpened = page.url();
    v.rootOpenedStatus = await page.evaluate(() => document.title);
    await page.goto(site('index.html'));
    await page.keyboard.press('Control+k');
    await page.waitForSelector('dialog[open]');
    await page.keyboard.press('Escape');
    v.closedByEscape = await page.evaluate(() => !document.querySelector('dialog[data-g9-site-search]').open);
    await context.close();
  }
  await browser.close();
  console.log(JSON.stringify(report));
})().catch((e) => { console.error(e); process.exit(1); });
