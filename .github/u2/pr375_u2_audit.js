const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');
function assert(cond, message) { if (!cond) throw new Error(message); }

(async () => {
  const browser = await chromium.launch({headless:true});
  const base = 'http://127.0.0.1:8766/standalone/practice/';
  const criticalErrors = [];
  async function configure(page, external) {
    page.on('pageerror', err => { const msg=String(err); if (/tailwind is not defined/i.test(msg)) criticalErrors.push(msg); });
    page.on('request', req => { try { const u=new URL(req.url()); if ((u.protocol==='http:'||u.protocol==='https:') && !['127.0.0.1','localhost'].includes(u.hostname)) external.push(req.url()); } catch {} });
  }

  const ctx = await browser.newContext({viewport:{width:1366,height:854}});
  const page = await ctx.newPage();
  let external=[]; await configure(page, external);
  await page.goto(base+'motion-in-2d-master-suite.html',{waitUntil:'load'}); await page.waitForTimeout(500);
  assert(external.length===0,'2D master external requests: '+external.join(', '));
  let box=await page.locator('a[href="index.html"]').first().boundingBox();
  assert(box&&box.height>=47.5&&box.width>=47.5,'2D master Practice Hub target too small');

  external=[];
  await page.goto(base+'motion-in-1d-master-suite.html',{waitUntil:'load'}); await page.waitForTimeout(500);
  assert(external.length===0,'1D master external requests: '+external.join(', '));
  assert(criticalErrors.length===0,'critical page error: '+criticalErrors.join(' | '));
  const hubText=(await page.locator('a[href="index.html"]').first().innerText()).trim();
  assert(hubText.includes('Practice Hub'),'1D master return link is still icon-only');

  await page.goto(base+'index.html',{waitUntil:'load'});
  const hrefs=await page.locator('a.card').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
  assert(hrefs.length===13,`hub cards ${hrefs.length} != 13`);
  for (const href of hrefs) {
    await page.goto(base+href,{waitUntil:'load'});
    const link=page.locator('a[href="index.html"]').first();
    assert(await link.count(),`missing Practice Hub link on ${href}`);
    const target=await link.boundingBox();
    assert(target&&target.height>=47.5&&target.width>=47.5,`small return target on ${href}`);
    await link.click(); await page.waitForLoadState('load');
    assert(page.url().endsWith('/standalone/practice/index.html'),`return link wrong for ${href}`);
    await page.goBack(); await page.waitForLoadState('load'); assert(page.url().includes(href),`Back failed for ${href}`);
    await page.goForward(); await page.waitForLoadState('load'); assert(page.url().endsWith('/standalone/practice/index.html'),`Forward failed for ${href}`);
    await page.reload();
  }

  await page.goto(base+'core2-motion-in-a-plane-tablet.html',{waitUntil:'load'});
  const matrixTab=page.locator('.tab-btn[data-topic="matrix"]');
  const jumpCount=await page.locator('#answer-matrix-view a[href^="#q"]').count();
  assert(jumpCount===59,`matrix jumps ${jumpCount} != 59`);
  for (let i=0;i<jumpCount;i++) {
    await matrixTab.click();
    const link=page.locator('#answer-matrix-view a[href^="#q"]').nth(i);
    const qid=(await link.getAttribute('href')).slice(1);
    await link.click();
    const visible=await page.locator('#'+qid).evaluate(el=>getComputedStyle(el).display!=='none'&&el.getBoundingClientRect().height>0);
    assert(visible,`matrix jump did not reveal ${qid}`);
    assert(await page.locator('.tab-btn[data-topic="all"]').evaluate(el=>el.classList.contains('active')),`All tab not active after ${qid}`);
  }
  const topicButtons=page.locator('.tab-btn[data-topic]');
  for (let i=0;i<await topicButtons.count();i++) {
    const topic=await topicButtons.nth(i).getAttribute('data-topic');
    if (topic&&topic!=='all'&&topic!=='matrix') { await topicButtons.nth(i).click(); break; }
  }
  await page.locator('#jump-select').selectOption('q01');
  assert(await page.locator('#q01').evaluate(el=>getComputedStyle(el).display!=='none'),'Fast Jump did not reveal q01');
  assert(await page.locator('.tab-btn[data-topic="all"]').evaluate(el=>el.classList.contains('active')),'Fast Jump left stale topic active');
  await ctx.close();

  const offline=await browser.newContext({viewport:{width:1366,height:854},offline:true});
  const op=await offline.newPage(); const offlineExternal=[]; await configure(op,offlineExternal); const repo=process.cwd();
  for (const rel of ['standalone/practice/motion-in-2d-master-suite.html','standalone/practice/motion-in-1d-master-suite.html','standalone/practice/core2a-projectile-study.html','standalone/practice/physics-motion-in-a-plane-interactive-suite.html']) {
    await op.goto(pathToFileURL(path.join(repo,rel)).href,{waitUntil:'load'}); await op.waitForTimeout(300);
  }
  assert(offlineExternal.length===0,'offline pages requested network: '+offlineExternal.join(', '));
  assert(criticalErrors.length===0,'critical offline page error: '+criticalErrors.join(' | '));
  await offline.close(); await browser.close();
  console.log('browser U2 audit: PASS (13/13 round trips; 59/59 matrix jumps; HTTP + file:// offline)');
})().catch(err=>{console.error(err);process.exit(1);});
