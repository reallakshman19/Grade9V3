#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const root = path.join(repo, 'standalone/stress-test/polynomials');
const explorer = path.join(root, 'concept-explorer.html');
const clinics = path.join(root, 'question-clinics.html');
const chromium = process.env.CHROMIUM_BIN || ['/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome'].find(fs.existsSync);
if (!chromium) throw new Error('No Chromium binary found; set CHROMIUM_BIN.');

class CDP {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.id = 0; this.pending = new Map(); this.events = []; }
  async open() {
    await new Promise((res, rej) => { this.ws.onopen=res; this.ws.onerror=rej; });
    this.ws.onmessage=e=>{
      const m=JSON.parse(e.data);
      if(m.id&&this.pending.has(m.id)){
        const pr=this.pending.get(m.id);
        this.pending.delete(m.id);
        m.error?pr.rej(new Error(JSON.stringify(m.error))):pr.res(m.result);
      } else this.events.push(m);
    };
  }
  send(method, params={}) {
    const id=++this.id;
    return new Promise((res,rej)=>{
      this.pending.set(id,{res,rej});
      this.ws.send(JSON.stringify({id,method,params}));
    });
  }
  close(){this.ws.close();}
}

async function launchBrowser(){
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'issue304-chrome-'));
  const proc=spawn(chromium,[
    '--headless=new','--disable-gpu','--no-sandbox',
    '--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'
  ],{stdio:['ignore','ignore','ignore']});
  const active=path.join(profile,'DevToolsActivePort');
  for(let i=0;i<200&&!fs.existsSync(active);i++) await new Promise(r=>setTimeout(r,25));
  if(!fs.existsSync(active)){
    proc.kill('SIGKILL');
    throw new Error('Chromium did not expose DevToolsActivePort');
  }
  const port=Number(fs.readFileSync(active,'utf8').trim().split(/\r?\n/)[0]);
  return {proc,profile,port};
}

async function newPage(port,file,width,height){
  const url='http://127.0.0.1:'+port+'/json/new?'+encodeURIComponent('about:blank');
  const target=await fetch(url,{method:'PUT'}).then(r=>r.json());
  const c=new CDP(target.webSocketDebuggerUrl);
  await c.open();
  await c.send('Page.enable');
  await c.send('Runtime.enable');
  await c.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await c.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  const tree=await c.send('Page.getFrameTree');
  const frameId=tree.frameTree.frame.id;
  await c.send('Page.setDocumentContent',{frameId,html:fs.readFileSync(file,'utf8')});
  for(let i=0;i<100;i++){
    const ready=await c.send('Runtime.evaluate',{expression:'document.readyState',returnByValue:true});
    if(ready.result.value==='complete')break;
    await new Promise(r=>setTimeout(r,20));
  }
  return c;
}

async function evalJs(c, expression){
  const r=await c.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails) throw new Error((r.exceptionDetails.exception?.description||r.exceptionDetails.text||'Runtime exception')+' :: '+expression.slice(0,160));
  return r.result.value;
}

const viewports=[
  {name:'tablet-12.7-landscape-1366',width:1366,height:854},
  {name:'tablet-12.7-landscape-1440',width:1440,height:900},
  {name:'tablet-12.7-portrait',width:900,height:1440}
];

const browser=await launchBrowser();
const report={viewports:{},behavior:{}};
const failures=[];

try{
  for(const vp of viewports){
    report.viewports[vp.name]={};
    for(const pair of [['explorer',explorer],['clinics',clinics]]){
      const name=pair[0], file=pair[1];
      const c=await newPage(browser.port,file,vp.width,vp.height);
      const expr="(()=>{const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};const els=[...document.querySelectorAll('button,.action-link,input,textarea')].filter(vis);const small=els.filter(e=>{const r=e.getBoundingClientRect();return Math.min(r.width,r.height)<48&&e.tagName!=='TEXTAREA'}).map(e=>({tag:e.tagName,text:(e.textContent||e.value||'').trim().slice(0,50),w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}));return{overflowPx:document.documentElement.scrollWidth-document.documentElement.clientWidth,smallTargets:small,focusRule:[...document.styleSheets].flatMap(s=>{try{return[...s.cssRules].map(r=>r.cssText)}catch{return[]}}).join('\\\\n').includes(':focus-visible'),nav:[...document.querySelectorAll('nav a')].map(a=>({text:a.textContent.trim(),href:a.getAttribute('href')}))};})()";
      const m=await evalJs(c,expr);
      report.viewports[vp.name][name]=m;
      if(m.overflowPx>1)failures.push(vp.name+'/'+name+': overflow '+m.overflowPx);
      if(m.smallTargets.length)failures.push(vp.name+'/'+name+': small targets '+JSON.stringify(m.smallTargets));
      if(!m.focusRule)failures.push(vp.name+'/'+name+': missing focus-visible');
      if(!m.nav.some(x=>x.text.includes('Back to Core2'))||!m.nav.some(x=>/home/i.test(x.text)))failures.push(vp.name+'/'+name+': navigation missing');
      c.close();
    }
  }

  {
    const c=await newPage(browser.port,explorer,1366,854);
    report.behavior.explorerPreAttemptWithheld=await evalJs(c,"!document.body.innerText.includes('exact quotient Q(x)')&&!document.body.innerText.includes('5/8')&&!document.querySelector('[data-test=\"observation\"]')");
    await evalJs(c,"[...document.querySelectorAll('button')].find(b=>b.textContent==='Non-monic divisor').click();[...document.querySelectorAll('[data-prediction]')].find(b=>b.dataset.prediction==='no').click();document.querySelector('#commit').click();true");
    report.behavior.explorerExactRegression=await evalJs(c,"document.querySelector('[data-test=\"observation\"]').innerText.includes('5/8')&&document.querySelector('[data-test=\"observation\"]').innerText.includes('3/2·x^2')&&document.querySelector('[data-test=\"identity\"]').innerText.includes('P(1/2) = 5/8 = R')");
    await evalJs(c,"document.querySelector('#root-plus').click();true");
    report.behavior.explorerLiveManipulation=await evalJs(c,"document.querySelector('[data-test=\"observation\"]')&&document.querySelector('[data-test=\"identity\"]').innerText.includes('P(1)')");
    c.close();
  }

  {
    const c=await newPage(browser.port,clinics,900,1440);
    report.behavior.clinicCount=await evalJs(c,"document.querySelectorAll('.clinic').length===3");
    report.behavior.clinicProtectedPreCommit=await evalJs(c,"!document.body.innerText.includes('f(x)=(x−1)(x²−7x+13)')&&!document.body.innerText.includes('Exactly 3 positive integers work')&&!document.querySelector('[data-test=\"decision\"]')");
    await evalJs(c,"(()=>{const a=document.querySelector('#Q-MAT-09-POL-P05-NUM-04');a.querySelector('[data-test=\"commit\"]').click();return true})()");
    report.behavior.clinicBlankRejected=await evalJs(c,"document.querySelector('#Q-MAT-09-POL-P05-NUM-04 [role=\"status\"]').innerText.includes('genuine first decision')");
    await evalJs(c,"(()=>{const a=document.querySelector('#Q-MAT-09-POL-P05-NUM-04'),t=a.querySelector('textarea');t.value='I should factor the polynomial before testing many values.';t.dispatchEvent(new Event('input',{bubbles:true}));a.querySelector('[data-test=\"commit\"]').click();return true})()");
    report.behavior.clinicDecisionAfterCommit=await evalJs(c,"!!document.querySelector('#Q-MAT-09-POL-P05-NUM-04 [data-test=\"decision\"]')&&!document.querySelector('#Q-MAT-09-POL-P05-NUM-04 [data-test=\"solution-text\"]')");
    await evalJs(c,"(()=>{const a=document.querySelector('#Q-MAT-09-POL-P05-NUM-04');const b=a.querySelector('[data-test=\"next-hint\"]');b.click();b.click();b.click();a.querySelector('[data-test=\"wrong\"]').click();a.querySelector('[data-test=\"solution\"]').click();return true})()");
    report.behavior.clinicProgressiveSolution=await evalJs(c,"document.querySelectorAll('#Q-MAT-09-POL-P05-NUM-04 [data-test=\"hint\"]').length===3&&!!document.querySelector('#Q-MAT-09-POL-P05-NUM-04 [data-test=\"wrong-route\"]')&&document.querySelector('#Q-MAT-09-POL-P05-NUM-04 [data-test=\"solution-text\"]').innerText.includes('Exactly 3 positive integers work')");
    c.close();
  }

  for(const entry of Object.entries(report.behavior)) if(!entry[1]) failures.push('behavior:'+entry[0]);
} finally {
  browser.proc.kill('SIGKILL');
  await new Promise(r=>setTimeout(r,120));
  try{fs.rmSync(browser.profile,{recursive:true,force:true})}catch{}
}

console.log(JSON.stringify(report,null,2));
if(failures.length){
  console.error('\nFAIL\n'+failures.join('\n'));
  process.exit(1);
}
console.log('\nPASS issue304 final rendered-browser validation');
