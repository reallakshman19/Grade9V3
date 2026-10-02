// Focused rendered acceptance audit for #411.
// Exercises the real learner hubs, canonical-QB handoffs, Motion Session context,
// and the single global search at desktop and 12.7-inch-tablet dimensions.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(path.join(execFileSync('npm', ['root', '-g']).toString().trim(), 'playwright')); }

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'public');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(root, pathname);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); res.end(); return;
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await playwright.chromium.launch();
const failures = [];
let checks = 0;

async function open(rel, viewport, hasTouch = false) {
  const context = await browser.newContext({ viewport, hasTouch });
  const page = await context.newPage();
  const problems = [];
  page.on('pageerror', (error) => problems.push(`page error: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error') problems.push(`console error: ${message.text()}`); });
  page.on('request', (request) => {
    if (!request.url().startsWith(base) && !request.url().startsWith('data:') && !request.url().startsWith('blob:')) {
      problems.push(`left local site: ${request.url()}`);
    }
  });
  page.on('response', (response) => { if (response.status() >= 400) problems.push(`${response.status()} ${response.url().replace(base, '')}`); });
  await page.goto(`${base}/${rel}`, { waitUntil: 'networkidle' });
  return { context, page, problems };
}

async function commonLearnerAssertions(page, problems, where) {
  checks += 1;
  const facts = await page.evaluate(() => ({
    testLinks: document.querySelectorAll('a[data-site-test]').length,
    ownerLinks: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') || '').filter((href) => /(?:^|\/)(?:raw-intake|core-prompt-composer|portable-workbench)(?:\/|$)/.test(href)),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  if (facts.testLinks) failures.push(`${where}: learner navigation exposes ${facts.testLinks} TEST link(s)`);
  if (facts.ownerLinks.length) failures.push(`${where}: learner navigation exposes owner/internal links: ${facts.ownerLinks.join(', ')}`);
  if (facts.overflow > 1) failures.push(`${where}: ${facts.overflow}px horizontal overflow`);
  for (const problem of problems) failures.push(`${where}: ${problem}`);
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 1366, height: 854 }]) {
  const touch = viewport.width === 1366;
  for (const rel of ['index.html', 'physics/index.html', 'chemistry/index.html', 'mathematics/index.html']) {
    const { context, page, problems } = await open(rel, viewport, touch);
    await commonLearnerAssertions(page, problems, `${rel}@${viewport.width}x${viewport.height}`);
    await context.close();
  }
}

// Mathematics: learner handoff is the admitted canonical Linear Equations bank, never the technical Atlas.
{
  const { context, page, problems } = await open('mathematics/index.html', { width: 1366, height: 854 }, true);
  const qb = page.locator('a[href*="question-bank/index.html?subject=Mathematics"][href*="topic=Linear%20Equations"]').first();
  checks += 1;
  if (!(await qb.count()) || !(await qb.isVisible())) failures.push('mathematics: canonical Linear Equations QB handoff is not visible');
  if (await page.locator('a[href="linear-equations/index.html"]').count()) failures.push('mathematics: technical Linear Equations Atlas remains learner-linked');
  if (await qb.count()) {
    const box = await qb.boundingBox();
    if (!box || box.height < 44) failures.push(`mathematics: QB handoff touch target is ${box ? Math.round(box.height) : 0}px high`);
  }
  for (const problem of problems) failures.push(`mathematics: ${problem}`);
  await context.close();
}

// Physics: NLM goes to the canonical bank; the valid guided shared-clock session is contextualized.
{
  const { context, page, problems } = await open('physics/index.html', { width: 1366, height: 854 }, true);
  const nlm = page.locator('a[href*="question-bank/index.html?subject=Physics"][href*="topic=Newton%27s%20Laws%20of%20Motion%20%2F%20NLM"]').first();
  const session = page.locator('a[href="../motion-session/index.html"]').first();
  checks += 1;
  if (!(await nlm.count()) || !(await nlm.isVisible())) failures.push('physics: canonical NLM QB handoff is not visible');
  if (await page.locator('a[href="nlm/index.html"]').count()) failures.push('physics: technical NLM Atlas remains learner-linked');
  if (!(await session.count()) || !(await session.isVisible())) failures.push('physics: guided shared-clock session is not linked from Motion in 2D context');
  for (const locator of [nlm, session]) {
    if (await locator.count()) {
      const box = await locator.boundingBox();
      if (!box || box.height < 44) failures.push(`physics: learner CTA touch target is ${box ? Math.round(box.height) : 0}px high`);
    }
  }
  for (const problem of problems) failures.push(`physics: ${problem}`);
  await context.close();
}

// Motion Session is a learner experience, loads its canonical shared-clock concept,
// and has an explicit route back to Physics. The runtime intentionally replaces the
// static topic heading with the resolved canonical concept title.
{
  const { context, page, problems } = await open('motion-session/index.html', { width: 1366, height: 854 }, true);
  checks += 1;
  const back = page.locator('a[href="../physics/index.html"]').first();
  if (!(await back.count()) || !(await back.isVisible())) failures.push('motion-session: Back to Physics link is missing or hidden');
  const title = ((await page.locator('#session-topic').textContent()) || '').trim();
  if (!/independent x\/y components with one clock/i.test(title)) failures.push(`motion-session: canonical shared-clock concept did not resolve ("${title}")`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) failures.push(`motion-session: ${overflow}px horizontal overflow`);
  for (const problem of problems) failures.push(`motion-session: ${problem}`);
  await context.close();
}

// One global search must retrieve the guided session from a normal learner hub.
{
  const { context, page, problems } = await open('physics/index.html', { width: 1440, height: 900 });
  checks += 1;
  await page.getByRole('button', { name: 'Search Grade9V3' }).click();
  const input = page.getByRole('searchbox', { name: 'Search Grade9V3' });
  await input.fill('shared clock');
  const hit = page.locator('a.g9-search-result[href$="motion-session/index.html"]').first();
  await hit.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  if (!(await hit.count()) || !(await hit.isVisible())) failures.push('global search: "shared clock" does not retrieve Motion Session');
  for (const problem of problems) failures.push(`global search: ${problem}`);
  await context.close();
}

await browser.close();
server.close();

if (failures.length) {
  console.log(failures.join('\n'));
  console.log(`\nFAIL: ${failures.length} problem(s) across ${checks} focused learner checks`);
  process.exit(1);
}
console.log(`PASS: ${checks} focused learner checks; audience, QB handoffs, Motion Session, global search and tablet rendering are coherent.`);
