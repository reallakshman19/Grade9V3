import {createRequire} from 'node:module';
import {execSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let pw; try{pw=require('playwright')}catch{pw=require(path.join(execSync('npm root -g').toString().trim(),'playwright'))}
const browser=await pw.chromium.launch();
try {
  for(const filename of process.argv.slice(2)) {
    for(const viewport of [{width:1440,height:900},{width:900,height:1440}]) {
      const context=await browser.newContext({viewport,offline:true,hasTouch:true});
      const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
      await page.goto(pathToFileURL(path.resolve(filename)).href);
      assert.equal(await page.evaluate(()=>window.__portableWorkbenchReady),true,JSON.stringify({errors,diagnostic:await page.locator('#diagnostic').textContent()}));
      const host=page.locator('semantic-workbench');
      const x=host.locator('[data-x]'),y=host.locator('[data-y]');
      await host.locator('[data-test]').click();
      assert.match(await host.locator('[data-feedback]').innerText(),/finite/);
      const question=(await page.locator('main').innerText()).includes('x + 2y = 4');
      assert.match(await host.locator('[data-equation]').innerText(),question?/1x \+ 2y \+ \(-4\)/:/3x \+ 4y \+ \(-12\)/);
      for(const pair of question?[[0,2],[4,0],[2,1],[1,1.5]]:[[0,3],[4,0],[2,1.5],[1,2.25]]) {
        await x.fill(String(pair[0])); await x.dispatchEvent('input'); await y.fill(String(pair[1]));
        await host.locator('[data-test]').click();
      }
      assert.equal(await host.locator('tbody tr').count(),4,'arbitrary between-point accepted, not predefined cards');
      await x.fill('1'); await x.dispatchEvent('input'); await y.fill('1'); await host.locator('[data-test]').click();
      assert.match(await host.locator('[data-feedback]').innerText(),question?/residual -1/:/residual -5/);
      assert.equal(await host.locator('tbody tr').count(),4);
      const before=await host.locator('[data-residual]').innerText();
      await host.locator('svg').focus(); await page.keyboard.press('ArrowRight');
      assert.notEqual(await host.locator('[data-residual]').innerText(),before);
      const box=await host.locator('svg').boundingBox();
      await page.mouse.move(box.x+box.width*.25,box.y+box.height*.3); await page.mouse.down();
      await page.mouse.move(box.x+box.width*.6,box.y+box.height*.7); await page.mouse.up();
      assert.notEqual(await host.locator('[data-residual]').innerText(),before);
      assert.deepEqual(errors,[]);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      assert.ok(await page.locator('.site-nav button,.site-nav a,.site-nav input,.site-nav summary').evaluateAll(nodes=>nodes.every(n=>{const b=n.getBoundingClientRect();return b.width>=48&&b.height>=48})), '48px shell targets');
      if(process.env.RECORD_INTERACTION_EVIDENCE==='1') {
        await page.screenshot({path:filename+`.${viewport.width}.png`,fullPage:true});
        fs.writeFileSync(filename+`.${viewport.width}.aria.txt`,await host.ariaSnapshot());
      }
      await context.close();
    }
  }
} finally {await browser.close()}
console.log('PASS: two real target pages, offline portrait/landscape, arbitrary pairs, residual rejection, keyboard and pointer movement');
