const { chromium } = require('playwright');
function assert(cond,msg){if(!cond)throw new Error(msg)}
const root='http://127.0.0.1:8766/';
const practice=root+'standalone/practice/';
const storagePages=['core1a-physics-motion-2d-ncert-tablet.html','core1a-physics-nlm-tablet.html','core1a-physics-vectors-tablet.html','core1a-sba-06-07-trajectory-and-height-tablet.html','core1a-sba-motion-in-a-plane-master-tablet.html','core2-motion-1d-straight-line-tablet.html','core2-motion-consolidated-practice-tablet.html','core2-motion-in-a-plane-tablet.html'];
const reps=['REP-PHY-THRUST-INTERFACE','REP-PHY-THRUST-NORMAL-BALANCE','REP-PHY-PRESSURE-CONTACT-AREA','REP-PHY-PRESSURE-SCALING','REP-PHY-PRESSURE-SURFACE-ORIENTATION','REP-PHY-PRESSURE-HYDROSTATIC-BRIDGE'];
async function goto(page,url){await page.goto(url,{waitUntil:'load',timeout:30000});await page.waitForTimeout(250)}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const ctx=await browser.newContext({viewport:{width:1366,height:854}}); const page=await ctx.newPage();
 let errors=[]; page.on('pageerror',e=>errors.push(String(e)));

 // U3-1: no orphan Tailwind config runtime error.
 await goto(page,practice+'motion-in-1d-master-suite.html');
 assert(!errors.some(x=>/tailwind is not defined/i.test(x)),'U3-1 tailwind pageerror: '+errors.join(' | '));

 // U3-2/U3-3: corrupted/raw TeX is rendered by vendored KaTeX.
 for(const f of ['core1a-physics-nlm-tablet.html','core1a-physics-vectors-tablet.html','core1a-sba-motion-in-a-plane-master-tablet.html']){
   errors=[]; await goto(page,practice+f);
   const r=await page.evaluate(()=>({k:document.querySelectorAll('.katex').length,ctl:/[\u000b\u000c]/.test(document.documentElement.innerHTML)}));
   assert(!r.ctl,f+' still contains VT/FF'); assert(r.k>0,f+' has no rendered KaTeX'); assert(errors.length===0,f+' pageerror '+errors.join('|'));
 }
 errors=[]; await goto(page,practice+'motion-in-2d-master-suite.html');
 const math2d=await page.evaluate(()=>({k:document.querySelectorAll('.katex').length,raw:(document.body.innerText||'').includes('\\(')}));
 assert(math2d.k>20,'U3-3 expected rendered math, got '+math2d.k); assert(!math2d.raw,'U3-3 raw \\( delimiter still visible'); assert(errors.length===0,'U3-3 pageerror '+errors.join('|'));

 // U3-4/U3-11: all 59 questions have stems + four labeled options; option choice survives reload.
 await goto(page,practice+'core2-motion-in-a-plane-tablet.html');
 const qs=await page.locator('article.challenge-card').evaluateAll(cards=>cards.map(c=>({stem:(c.querySelector('.question-stem-text')?.textContent||'').trim(),opts:[...c.querySelectorAll('.opt-text')].map(x=>(x.textContent||'').trim())})));
 assert(qs.length===59,'U3-4 cards '+qs.length); assert(qs.every(x=>x.stem&&x.opts.length===4&&x.opts.every(Boolean)),'U3-4 missing stem/option text');
 await page.locator('#q01 .opt-btn[data-opt="B"]').click(); await page.reload({waitUntil:'load'}); await page.waitForTimeout(150);
 assert(await page.locator('#q01 .opt-btn[data-opt="B"]').evaluate(el=>el.classList.contains('selected-correct')||el.classList.contains('selected-incorrect')),'U3-11 option did not restore');

 // U3-5: blocked storage must not throw or disable the workspace flow.
 const blocked=await browser.newContext({viewport:{width:1366,height:854}});
 await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}}));
 for(const f of storagePages){
   const p=await blocked.newPage(); const es=[]; p.on('pageerror',e=>es.push(String(e))); await goto(p,practice+f); assert(es.length===0,`U3-5 ${f}: ${es.join(' | ')}`); await p.close();
 }
 const bp=await blocked.newPage(); const bes=[]; bp.on('pageerror',e=>bes.push(String(e))); await goto(bp,practice+'core2-motion-in-a-plane-tablet.html');
 await bp.locator('#q05 .workspace-textarea').fill('component work'); await bp.locator('#q05 .btn-submit-work').click();
 assert(await bp.locator('#q05 details.solution-reveal').evaluate(el=>el.open),'U3-5 blocked storage killed reveal flow'); assert(bes.length===0,'U3-5 core2 pageerror '+bes.join('|')); await bp.close(); await blocked.close();

 // U3-6: final-stage concept SVG labels stay inside the SVG and markers do not scale with stroke width.
 for(const url of [root+'standalone/core2-physics-thrust-pressure-tablet.html',practice+'core2-physics-thrust-pressure-tablet.html']){
   await goto(page,url);
   const result=await page.evaluate((ids)=>ids.map(id=>{
     const fig=document.querySelector(`figure[data-g9-representation="${id}"]`); if(!fig)return {id,missing:true};
     const chips=[...fig.querySelectorAll('[data-g9-stage-goto]')]; chips.at(-1)?.click(); const svg=fig.querySelector('svg'),sb=svg.getBoundingClientRect();
     const texts=[...svg.querySelectorAll('text')].filter(el=>{const s=getComputedStyle(el),b=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&b.width>0&&b.height>0}).map(el=>{const b=el.getBoundingClientRect();return {t:(el.textContent||'').trim(),l:b.left,r:b.right,t0:b.top,b:b.bottom}});
     const out=texts.filter(x=>x.l<sb.left-1||x.r>sb.right+1||x.t0<sb.top-1||x.b>sb.bottom+1); const badMarker=[...svg.querySelectorAll('marker')].some(m=>m.getAttribute('markerUnits')!=='userSpaceOnUse'); return{id,out,badMarker};
   }),reps);
   assert(result.every(x=>!x.missing&&!x.badMarker&&x.out.length===0),'U3-6 SVG bounds '+JSON.stringify(result));
 }

 // U3-7: print hides navigation / interaction chrome.
 const printCases=[
   [practice+'core2-motion-in-a-plane-tablet.html','.top-nav,.search-bar-row,.tabs-scroll-row,.jump-select-row,#theme-toggle-btn,#clear-search-btn,#jump-select'],
   [practice+'core2-motion-1d-straight-line-tablet.html','.top-nav,.search-bar-row,.tabs-scroll-row,.jump-select-row,#theme-toggle-btn,#clear-search-btn,#jump-select'],
   [practice+'motion-in-2d-master-suite.html','.top-nav,.search-bar-row,.tabs-scroll-row,.jump-select-row,#theme-toggle-btn,#clear-search-btn,#jump-select'],
   [root+'standalone/core2-physics-thrust-pressure-tablet.html','[data-g9-shell-header],[data-g9-breadcrumb],.g9-cu-nav,.g9-stage-controls'],
   [practice+'core2-physics-thrust-pressure-tablet.html','[data-g9-shell-header],[data-g9-breadcrumb],.g9-cu-nav,.g9-stage-controls']
 ];
 for(const [url,sel] of printCases){await goto(page,url);await page.emulateMedia({media:'print'});const visible=await page.locator(sel).evaluateAll(nodes=>nodes.filter(el=>{const s=getComputedStyle(el),b=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&b.width>0&&b.height>0}).length);assert(visible===0,'U3-7 print chrome '+url+' count='+visible);await page.emulateMedia({media:'screen'});}

 // U3-8: empty attempts cannot reveal model answers; genuine text can.
 await goto(page,practice+'core1a-sba-06-07-trajectory-and-height-tablet.html'); const box=page.locator('.workspace-box').first();
 await box.locator('.btn-check-faded').click(); assert(!(await box.locator('details.solution-reveal').evaluate(el=>el.open)),'U3-8 empty SBA revealed'); await box.locator('.faded-textarea').fill('derive with ux and uy'); await box.locator('.btn-check-faded').click(); assert(await box.locator('details.solution-reveal').evaluate(el=>el.open),'U3-8 genuine SBA attempt did not reveal');
 await goto(page,practice+'physics-motion-in-a-plane-interactive-suite.html'); await page.getByRole('button',{name:'Check Understanding'}).click(); assert(await page.locator('#reconAnswer').evaluate(el=>getComputedStyle(el).display==='none'),'U3-8 empty reconstruction revealed'); await page.locator('#reconInput').fill('same vertical initial state'); await page.getByRole('button',{name:'Check Understanding'}).click(); assert(await page.locator('#reconAnswer').evaluate(el=>getComputedStyle(el).display!=='none'),'U3-8 valid reconstruction did not reveal');

 // U3-9: Q21/Q23 numeric prediction boxes reject text/units and accept a number.
 await goto(page,practice+'core2a-projectile-study.html'); const inp=page.locator('core2a-projectile-study [data-attempt-text]'); const commit=page.locator('core2a-projectile-study [data-action="commit"]');
 await inp.fill('abc'); await commit.click(); assert(!(await inp.isDisabled()),'U3-9 abc committed'); await inp.fill('9.8 m'); await commit.click(); assert(!(await inp.isDisabled()),'U3-9 unit-bearing text committed'); await inp.fill('9.80'); await commit.click(); assert(await inp.isDisabled(),'U3-9 numeric attempt did not commit');

 // U3-12: a CORE1A concept attempt on Thrust survives reload just like Core2 state.
 await goto(page,root+'standalone/core2-physics-thrust-pressure-tablet.html'); const article=page.locator('article[data-g9-role="CORE1A"][data-g9-unit]').first(); const ta=article.locator('[data-g9-attempt-box] textarea').first(); await ta.fill('interface reasoning'); await article.locator('[data-g9-commit]').first().click(); await page.reload({waitUntil:'load'}); await page.waitForTimeout(150); const a2=page.locator('article[data-g9-role="CORE1A"][data-g9-unit]').first(); assert(await a2.evaluate(el=>el.dataset.attempted==='1'),'U3-12 concept attempted flag not restored'); assert((await a2.locator('[data-g9-attempt-box] textarea').first().inputValue())==='interface reasoning','U3-12 concept text not restored');

 await ctx.close(); await browser.close(); console.log('browser U3 audit: PASS (U3-1..U3-12 remediated)');
})().catch(e=>{console.error(e);process.exit(1)});
