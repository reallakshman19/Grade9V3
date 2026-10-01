import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const out = process.argv[2] || 'artifacts/qb-tablet-standalone-browser.json';
const port = 8769;
const base = 'http://127.0.0.1:' + port + '/standalone/core2-canonical-question-bank-tablet.html';

const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { stdio: ['ignore', 'pipe', 'pipe'] });
await new Promise((resolve, reject) => {
  const timer = setTimeout(resolve, 800);
  server.on('error', err => { clearTimeout(timer); reject(err); });
});

const browser = await chromium.launch({ headless: true });
const findings = [];
const candidatePath = 'standalone/core2-canonical-question-bank-tablet.html';
const candidateBytes = readFileSync(candidatePath);
const observations = {
  schema: 'grade9v3-qb-tablet-browser-audit-v2',
  blueprint: { ref: 'BP-CORE2-SOURCE-QUESTION@1.5.0', source_pr: 372, source_head: 'edba5daf43371b4f5142ccc3ae16a1a1af6ba7a6' },
  candidate: { path: candidatePath, bytes: candidateBytes.length, sha256: createHash('sha256').update(candidateBytes).digest('hex') },
  viewports: {}, runtime: {},
};
const fail = (point, detail) => findings.push({ point, detail });

async function load(page) {
  const requests = [];
  page.on('request', req => requests.push(req.url()));
  await page.goto(base, { waitUntil: 'load' });
  await page.waitForTimeout(80);
  const remote = requests.filter(url => !url.startsWith('http://127.0.0.1:' + port + '/'));
  if (remote.length) fail('QB_EXTERNAL_RUNTIME_DEPENDENCY', remote.join(', '));
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
      const primaryEl = card?.querySelector('.g9-col-primary');
      const supportEl = card?.querySelector('.g9-col-support');
      const identityEl = card?.querySelector('.slot-identity');
      const solutionEl = card?.querySelector('.slot-solution');
      const primary = primaryEl?.getBoundingClientRect();
      const support = supportEl?.getBoundingClientRect();
      const identity = identityEl?.getBoundingClientRect();
      const solution = solutionEl?.getBoundingClientRect();
      const stem = card?.querySelector('[data-g9-component="STEM"]')?.getBoundingClientRect();
      const representation = card?.querySelector('[data-g9-component="REPRESENTATION"]')?.getBoundingClientRect();
      const conditions = card?.querySelector('[data-g9-component="CONDITIONS"]')?.getBoundingClientRect();
      const trap = card?.querySelector('[data-g9-component="TRAP"]')?.getBoundingClientRect();
      const attempt = card?.querySelector('[data-g9-component="ATTEMPT"]')?.getBoundingClientRect();
      const hints = card?.querySelector('[data-g9-component="HINT_LADDER"]')?.getBoundingClientRect();
      const controls = [...document.querySelectorAll('button:not([hidden]),input:not([hidden]),textarea:not([hidden]),summary:not([hidden]),a:not([hidden])')]
        .filter(el => {
          const cs=getComputedStyle(el);
          return el.getClientRects().length>0 && cs.display!=='none' && cs.visibility!=='hidden';
        });
      const undersized=[];
      for (const el of controls) {
        const r=el.getBoundingClientRect();
        if (el.matches('input[type=radio],input[type=checkbox]')) {
          const lr=el.closest('label')?.getBoundingClientRect();
          if (!lr || lr.height < 48) undersized.push({tag:el.tagName,cls:el.className,w:lr?.width||0,h:lr?.height||0});
        } else if (r.height < 48 || ((el.tagName==='BUTTON'||el.tagName==='A'||el.tagName==='SUMMARY') && r.width < 48)) {
          undersized.push({tag:el.tagName,cls:el.className,w:r.width,h:r.height});
        }
      }
      const figureText = [...document.querySelectorAll('.representation-box svg text')].map(el=>parseFloat(getComputedStyle(el).fontSize)).filter(Number.isFinite);
      return {
        overflow: de.scrollWidth-de.clientWidth,
        theme: document.documentElement.dataset.theme,
        bodyFont: parseFloat(getComputedStyle(document.body).fontSize),
        shellPosition: getComputedStyle(document.querySelector('header[data-g9-shell-header]')).position,
        primary: primary?{x:primary.x,y:primary.y,w:primary.width,h:primary.height}:null,
        support: support?{x:support.x,y:support.y,w:support.width,h:support.height}:null,
        identity: identity?{x:identity.x,y:identity.y,w:identity.width,h:identity.height,right:identity.right}:null,
        solution: solution?{x:solution.x,y:solution.y,w:solution.width,h:solution.height,right:solution.right}:null,
        primaryFraction: primary&&support?primary.width/(primary.width+support.width):null,
        supportPosition: supportEl?getComputedStyle(supportEl).position:null,
        hintInSupport: !!card?.querySelector('.g9-col-support [data-g9-component="HINT_LADDER"]'),
        hintInPrimary: !!card?.querySelector('.g9-col-primary [data-g9-component="HINT_LADDER"]'),
        order: {
          stem: stem?.y??null, representation: representation?.y??null, conditions: conditions?.y??null,
          trap: trap?.y??null, attempt: attempt?.y??null, hints: hints?.y??null, solution: solution?.y??null,
        },
        figureTextMin: figureText.length?Math.min(...figureText):null,
        undersized,
      };
    });
    observations.viewports[vp.name]=metrics;
    await page.screenshot({ path: 'artifacts/qb-tablet/' + vp.name + '.png', fullPage: true });
    if (metrics.overflow > 1) fail('QB_HORIZONTAL_OVERFLOW', vp.name + ': +' + metrics.overflow + 'px');
    if (metrics.undersized.length) fail('QB_TOUCH_TARGET_UNDERSIZED', vp.name + ': ' + JSON.stringify(metrics.undersized.slice(0,8)));
    if (metrics.theme !== 'light') fail('QB_BLUEPRINT_DEFAULT_THEME', vp.name + ': ' + metrics.theme);
    if (Math.abs(metrics.bodyFont-17)>0.5) fail('QB_BLUEPRINT_BASE_TYPE', vp.name + ': ' + metrics.bodyFont);
    if (vp.width >= 980) {
      if (!(metrics.primary&&metrics.support&&metrics.support.x>metrics.primary.x)) fail('QB_CORE2_STAGE_SUPPORT', vp.name + ': ' + JSON.stringify(metrics));
      if (metrics.primaryFraction===null||Math.abs(metrics.primaryFraction-.42)>.03) fail('QB_CORE2_REFERENCE_FRACTION', vp.name + ': ' + metrics.primaryFraction);
      if (metrics.supportPosition!=='static') fail('QB_SUPPORT_RAIL_SCROLL_MODEL', vp.name + ': ' + metrics.supportPosition);
      if (!metrics.hintInSupport||metrics.hintInPrimary) fail('QB_CORE2_SUPPORT_LANE', vp.name);
      if (!(metrics.solution&&metrics.identity&&Math.abs(metrics.solution.x-metrics.identity.x)<=2&&Math.abs(metrics.solution.right-metrics.identity.right)<=2)) fail('QB_CORE2_FULL_WIDTH_SOLUTION', vp.name + ': ' + JSON.stringify(metrics));
      if (vp.width===1366&&metrics.identity&&metrics.identity.h>190) fail('QB_CORE2_IDENTITY_HEIGHT', '1366x854 identity=' + metrics.identity.h);
      if (metrics.figureTextMin!==null&&metrics.figureTextMin<13.9) fail('QB_FIGURE_TEXT_MIN', vp.name + ': ' + metrics.figureTextMin);
    } else {
      const o=metrics.order;
      if (!(o.stem!==null&&o.attempt!==null&&o.hints!==null&&o.solution!==null&&o.stem<o.attempt&&o.attempt<o.hints&&o.hints<o.solution)) fail('QB_COMPACT_CORE2_ORDER', vp.name + ': ' + JSON.stringify(o));
      if (o.representation!==null&&o.conditions!==null&&!(o.stem<o.representation&&o.representation<o.conditions)) fail('QB_COMPACT_REPRESENTATION_ORDER', vp.name + ': ' + JSON.stringify(o));
    }
    if (vp.width<=899&&metrics.shellPosition!=='relative') fail('QB_COMPACT_SHELL_POSITION', vp.name + ': ' + metrics.shellPosition);
    if (vp.width>=900&&metrics.shellPosition!=='sticky') fail('QB_EXPANDED_SHELL_POSITION', vp.name + ': ' + metrics.shellPosition);
    await page.close();
  }

  const page=await browser.newPage({viewport:{width:1366,height:854}});
  await load(page);
  const counts=await page.evaluate(()=>{
    const mathLive=document.querySelectorAll('math').length;
    const mathTemplate=[...document.querySelectorAll('template')].reduce((sum,t)=>sum+t.content.querySelectorAll('math').length,0);
    return {
      questions:document.querySelectorAll('.question-card').length,
      selected:document.querySelectorAll('.question-card[data-selected="true"]').length,
      svg:document.querySelectorAll('.question-card[data-selected="true"] .representation-box svg').length,
      sourcePdf:document.querySelectorAll('[data-g9-source-pdf]').length,
      difficulty:document.querySelectorAll('[data-g9-component="DIFFICULTY_WHY"]').length,
      ladders:document.querySelectorAll('[data-g9-component="HINT_LADDER"]').length,
      hintPayloads:document.querySelectorAll('template[data-g9-rung-payload]').length,
      solutions:document.querySelectorAll('[data-g9-component="SOLUTION"]').length,
      mathLive,mathTemplate,mathTotal:mathLive+mathTemplate,
    };
  });
  observations.runtime.counts=counts;
  for(const [key,expected] of Object.entries({questions:77,selected:7,svg:7,sourcePdf:77,difficulty:77,ladders:77,hintPayloads:195,solutions:77})) {
    if(counts[key]!==expected) fail('QB_RUNTIME_DENOMINATOR', key+': expected '+expected+', got '+counts[key]);
  }
  const markupMath=candidateBytes.toString('utf8').split('<math').length-1;
  observations.runtime.math_markup_count=markupMath;
  if(markupMath<100) fail('QB_DECLARED_MATH_MARKUP_TOO_THIN','got '+markupMath);
  if(counts.mathTotal!==markupMath) fail('QB_DECLARED_MATH_DOM_MISMATCH','HTML '+markupMath+' DOM '+counts.mathTotal);

  const visibleCount=async()=>page.locator('.question-card:visible').count();
  for(const [name,expected] of [['physics',31],['chemistry',46],['selected',7],['d3d4',30]]) {
    await page.locator('.tab-btn[data-filter="'+name+'"]').click();
    const actual=await visibleCount(); if(actual!==expected) fail('QB_FILTER_COUNT_MISMATCH',name+': '+actual);
  }
  await page.locator('.tab-btn[data-filter="all"]').click();
  await page.locator('[data-g9-action="search"]').click();
  const search=page.locator('#search-input'); await search.fill('redox');
  const redox=await visibleCount(); if(redox<1) fail('QB_SEARCH_RUNTIME','redox returned 0');
  await page.locator('#clear-search').click(); if(await visibleCount()!==77) fail('QB_SEARCH_RESET','not 77');

  const q=page.locator('#PYQ-PHY-IITJEE-2007-P1-Q03');
  const before=await q.innerText();
  if(before.includes('Option (B):')||before.includes('Let the midpoint rise by y.')) fail('QB_SOLUTION_LIVE_DOM_LEAK','solution live before attempt');
  if(before.includes('Sketch one half-string as a right triangle')) fail('QB_HINT_LIVE_DOM_LEAK','hint live before request');

  const why=q.locator('[data-g9-component="DIFFICULTY_WHY"] [data-g9-toggle]');
  await why.click();
  if(!(await q.locator('.g9-why').innerText()).includes('Changing string geometry')) fail('QB_DIFFICULTY_DISCLOSURE','basis missing');

  const hintButton=q.locator('[data-g9-next-rung]');
  await hintButton.click();
  if(!(await q.locator('[data-g9-ladder]').innerText()).includes('right triangle')) fail('QB_HINT_MATERIALIZATION','hint 1 missing');
  await hintButton.click(); await hintButton.click();
  if(await q.locator('[data-g9-ladder]>li').count()!==3) fail('QB_HINT_PROGRESSION','expected 3 live rungs');

  const details=q.locator('details[data-requires-attempt]');
  if(!(await details.evaluate(el=>el.hasAttribute('data-locked')))) fail('QB_ATTEMPT_GATE','solution should start locked');
  await q.locator('input.answer-choice[value="B"]').check();
  const commit=q.locator('.commit-attempt-btn');
  if(await commit.isDisabled()) fail('QB_ATTEMPT_GATE','commit did not enable');
  await commit.click();
  if(await details.evaluate(el=>el.hasAttribute('data-locked'))) fail('QB_ATTEMPT_GATE','solution did not unlock');
  if(await details.getAttribute('open')!==null) fail('QB_SOLUTION_POLICY','commit auto-opened solution');
  const feedback=await q.locator('.answer-feedback').innerText();
  if(!feedback.includes('Attempt recorded')||/correct|matches|incorrect/i.test(feedback)) fail('QB_NO_AUTOGRADING',feedback);
  const beforeOpen=await q.innerText();
  if(beforeOpen.includes('Option (B):')) fail('QB_SOLUTION_POLICY','solution materialized before learner opened disclosure');
  await details.locator('summary').click();
  const solutionText=await details.innerText();
  if(!solutionText.includes('Option (B):')||!solutionText.includes('massless midpoint')) fail('QB_SOLUTION_MATERIALIZATION',solutionText.slice(0,240));
  await q.screenshot({path:'artifacts/qb-tablet/attempt-hint-solution.png'});

  const multi=page.locator('#PYQ-PHY-JEEADV-2014-P1-Q08');
  await multi.locator('input.answer-choice[value="C"]').check();
  await multi.locator('input.answer-choice[value="D"]').check();
  await multi.locator('.commit-attempt-btn').click();
  const multiFeedback=await multi.locator('.answer-feedback').innerText();
  if(/correct|matches|incorrect/i.test(multiFeedback)) fail('QB_MULTI_NO_AUTOGRADING',multiFeedback);

  const free=page.locator('#PYQ-PHY-IITJEE-2011-P1-Q41');
  await free.locator('.answer-input').fill('5');
  await free.locator('.commit-attempt-btn').click();
  const freeDetails=free.locator('details[data-requires-attempt]');
  if(await freeDetails.evaluate(el=>el.hasAttribute('data-locked'))) fail('QB_FREE_ATTEMPT_GATE','free response not unlocked');
  if(await freeDetails.getAttribute('open')!==null) fail('QB_FREE_SOLUTION_POLICY','free response auto-opened');

  const scratch=q.locator('.practice-textarea'); await scratch.fill('persisted scratchpad witness');
  await page.reload({waitUntil:'load'});
  const restored=page.locator('#PYQ-PHY-IITJEE-2007-P1-Q03');
  if(await restored.locator('.practice-textarea').inputValue()!=='persisted scratchpad witness') fail('QB_LOCALSTORAGE_PERSISTENCE','scratch lost');
  const restoredDetails=restored.locator('details[data-requires-attempt]');
  if(await restoredDetails.evaluate(el=>el.hasAttribute('data-locked'))) fail('QB_ATTEMPT_STATE_PERSISTENCE','committed solution relocked after refresh');
  if(await restored.locator('[data-g9-ladder]>li').count()!==3) fail('QB_HINT_STATE_PERSISTENCE','revealed hint depth was not restored');
  if((await restored.locator('[data-g9-payload-slot]').innerText()).trim()!=='') fail('QB_SOLUTION_POLICY','refresh pre-materialized the unlocked solution');
  if(await restoredDetails.getAttribute('open')!==null) fail('QB_SOLUTION_POLICY','refresh auto-opened the unlocked solution');
  await restoredDetails.locator('summary').click();
  if(!(await restored.locator('[data-g9-payload-slot]').innerText()).includes('Option (B):')) fail('QB_ATTEMPT_STATE_PERSISTENCE','restored unlocked solution did not materialize when learner opened it');

  const initialTheme=await page.locator('html').getAttribute('data-theme');
  await page.locator('[data-g9-action="display"]').click();
  await page.locator('[data-g9-theme="dark"]').click();
  if(await page.locator('html').getAttribute('data-theme')===initialTheme) fail('QB_THEME_TOGGLE','theme unchanged');
  await page.reload({waitUntil:'load'});
  if(await page.locator('html').getAttribute('data-theme')!=='dark') fail('QB_THEME_PERSISTENCE','dark not persisted');
  await page.locator('[data-g9-action="display"]').click();
  await page.locator('[data-g9-theme="light"]').click();

  const keyboardPage=await browser.newPage({viewport:{width:800,height:1280},reducedMotion:'reduce'});
  await keyboardPage.addInitScript(()=>{
    window.__qbScrollCalls=[];
    const original=Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView=function(options){window.__qbScrollCalls.push({id:this.id||'',behavior:options?.behavior||null,block:options?.block||null});if(original)return original.call(this,options);};
  });
  await load(keyboardPage);
  const kq=keyboardPage.locator('#PYQ-PHY-IITJEE-2007-P1-Q03');
  const choice=kq.locator('input.answer-choice[value="B"]'); await choice.focus(); await keyboardPage.keyboard.press('Space');
  if(!(await choice.isChecked())) fail('QB_KEYBOARD_OPERABILITY','Space did not select');
  const kcommit=kq.locator('.commit-attempt-btn'); await kcommit.focus();
  const focus=await kcommit.evaluate(el=>{const cs=getComputedStyle(el);return{focusVisible:el.matches(':focus-visible'),outlineStyle:cs.outlineStyle,outlineWidth:cs.outlineWidth}});
  observations.runtime.keyboard_focus=focus;
  if(!focus.focusVisible||focus.outlineStyle==='none'||parseFloat(focus.outlineWidth)<2) fail('QB_FOCUS_VISIBILITY',JSON.stringify(focus));
  await keyboardPage.keyboard.press('Enter');
  const kdetails=kq.locator('details[data-requires-attempt]');
  if(await kdetails.evaluate(el=>el.hasAttribute('data-locked'))) fail('QB_KEYBOARD_OPERABILITY','Enter did not commit');
  await kdetails.locator('summary').focus(); await keyboardPage.keyboard.press('Enter');
  await keyboardPage.waitForTimeout(50);
  if(!(await kdetails.evaluate(el=>el.open))) fail('QB_KEYBOARD_OPERABILITY','Enter did not open solution disclosure');
  if(!(await kdetails.innerText()).includes('Option (B):')) fail('QB_KEYBOARD_OPERABILITY','opened solution did not contain the materialized answer');

  const keyboardFree=keyboardPage.locator('#PYQ-PHY-IITJEE-2011-P1-Q41 .answer-input'); await keyboardFree.focus(); await keyboardPage.waitForTimeout(100);
  const beforeResize=await keyboardPage.evaluate(()=>window.__qbScrollCalls.length);
  const dispatched=await keyboardPage.evaluate(()=>{if(!window.visualViewport)return false;window.visualViewport.dispatchEvent(new Event('resize'));return true;});
  await keyboardPage.waitForTimeout(100);
  const calls=await keyboardPage.evaluate(()=>window.__qbScrollCalls);
  observations.runtime.keyboard_focus.scrollCalls=calls.slice(-8);
  if(!calls.some(c=>c.id==='PYQ-PHY-IITJEE-2011-P1-Q41-answer'&&c.behavior==='auto'&&c.block==='center')) fail('QB_REDUCED_MOTION_FOCUS_SCROLL',JSON.stringify(calls.slice(-8)));
  if(dispatched&&calls.length<=beforeResize) fail('QB_VISUAL_VIEWPORT_FOCUS_RESCROLL','no recenter');
  await keyboardPage.close();

  const viewport=await page.evaluate(()=>({hasVisualViewport:!!window.visualViewport,viewportMeta:document.querySelector('meta[name=viewport]')?.content||'',blueprint:document.body.dataset.blueprintRef||'',mode:document.documentElement.dataset.g9Mode||''}));
  observations.runtime.viewport=viewport;
  if(/user-scalable\s*=\s*no|max(?:imum)?-scale\s*=\s*1/i.test(viewport.viewportMeta)) fail('QB_ZOOM_DISABLED',viewport.viewportMeta);
  if(viewport.blueprint!=='BP-CORE2-SOURCE-QUESTION@1.5.0'||viewport.mode!=='SINGLE_FILE') fail('QB_BLUEPRINT_IDENTITY',JSON.stringify(viewport));

  await page.locator('.tab-btn[data-filter="selected"]').click();
  const selectedSvg=await page.locator('.question-card:visible .representation-box svg').count();
  if(selectedSvg!==7) fail('QB_SELECTED_BENCHMARK_REPRESENTATION','got '+selectedSvg);
  const selectedPageHeight=await page.evaluate(()=>document.documentElement.scrollHeight);
  observations.runtime.selected_page_height=selectedPageHeight;
  if(selectedPageHeight>=22000) fail('QB_SELECTED_FILTER_RENDER_HEIGHT','selected height '+selectedPageHeight);
  await page.screenshot({path:'artifacts/qb-tablet/selected-d3d4.png',fullPage:true});

  observations.runtime.findings=findings;
  writeFileSync(out,JSON.stringify(observations,null,2)+'\n');
  if(findings.length){console.error(JSON.stringify(findings,null,2));process.exitCode=1}else console.log('QB tablet standalone browser audit: PASS');
  await page.close();
} finally {
  await browser.close();
  server.kill('SIGTERM');
}
