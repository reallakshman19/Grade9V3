import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const pagePath = "/public/physics/motion-2d/samples/core2a-projectile-study/index.html";

function chromeDriverPath() {
  const candidates = [];
  if (process.env.CHROMEWEBDRIVER) {
    candidates.push(process.env.CHROMEWEBDRIVER);
    candidates.push(resolve(process.env.CHROMEWEBDRIVER, "chromedriver"));
  }
  candidates.push("/usr/local/share/chromedriver-linux64/chromedriver");
  for (const candidate of candidates) {
    try { if (existsSync(candidate) && statSync(candidate).isFile()) return candidate; } catch (_) {}
  }
  const which = spawnSync("which", ["chromedriver"], { encoding: "utf8" });
  return which.status === 0 ? which.stdout.trim() : null;
}

async function freePort() {
  const server = createServer();
  await new Promise((ok, bad) => { server.once("error", bad); server.listen(0, "127.0.0.1", ok); });
  const port = server.address().port;
  await new Promise((ok) => server.close(ok));
  return port;
}

async function startDriver(path) {
  const port = await freePort();
  const child = spawn(path, [`--port=${port}`, "--allowed-origins=*"], { stdio: ["ignore", "pipe", "pipe"] });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i += 1) {
    try { const response = await fetch(`${base}/status`); if (response.ok) return { child, base }; } catch (_) {}
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 50));
  }
  child.kill("SIGTERM");
  throw new Error("ChromeDriver did not become ready.");
}

async function staticServer() {
  const mime = new Map([
    [".html", "text/html; charset=utf-8"], [".js", "text/javascript; charset=utf-8"],
    [".mjs", "text/javascript; charset=utf-8"], [".css", "text/css; charset=utf-8"],
    [".json", "application/json; charset=utf-8"],
  ]);
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://127.0.0.1");
      const path = resolve(repo, "." + decodeURIComponent(url.pathname));
      if (!(path === repo || path.startsWith(repo + sep))) return response.writeHead(403).end("forbidden");
      const info = await stat(path);
      if (!info.isFile()) throw new Error("not file");
      response.setHeader("content-type", mime.get(extname(path)) || "application/octet-stream");
      response.setHeader("cache-control", "no-store");
      response.end(await readFile(path));
    } catch (_) { response.writeHead(404).end("not found"); }
  });
  await new Promise((ok, bad) => { server.once("error", bad); server.listen(0, "127.0.0.1", ok); });
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

class Driver {
  constructor(base) { this.base = base; this.sessionId = null; }
  async request(method, path, body) {
    const response = await fetch(this.base + path, {
      method,
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || payload.value?.error) throw new Error(JSON.stringify(payload.value ?? payload));
    return payload.value;
  }
  async open() {
    const value = await this.request("POST", "/session", { capabilities: { alwaysMatch: {
      browserName: "chrome",
      "goog:chromeOptions": { args: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--window-size=1280,1000"] },
    } } });
    this.sessionId = value.sessionId;
  }
  async close() { if (this.sessionId) { try { await this.request("DELETE", `/session/${this.sessionId}`); } catch (_) {} } }
  async navigate(url) { await this.request("POST", `/session/${this.sessionId}/url`, { url }); }
  async execute(script) { return this.request("POST", `/session/${this.sessionId}/execute/sync`, { script, args: [] }); }
  async waitFor(script, timeout = 8000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await this.execute(script)) return;
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 60));
    }
    throw new Error("Timed out: " + script);
  }
  async size(width, height) {
    await this.request("POST", `/session/${this.sessionId}/window/rect`, { width, height, x: 0, y: 0 });
  }
}

const driverPath = chromeDriverPath();

test("Core2A projectile study browser contract", { skip: !driverPath, timeout: 45000 }, async () => {
  const host = await staticServer();
  const process = await startDriver(driverPath);
  const driver = new Driver(process.base);
  try {
    await driver.open();
    await driver.navigate(host.origin + pagePath + "?q=Q21");
    await driver.waitFor("return window.__core2aProjectileStudyReady === true");

    const initial = await driver.execute(`
      return {
        owner: window.__core2aProjectileStudy.owner,
        phase: window.__core2aProjectileStudy.state.phase,
        solution: document.getElementById('solutionContent').textContent,
        reasoning: document.getElementById('reasoningContent').textContent,
        errors: window.__core2aProjectileErrors.slice(),
      };
    `);
    assert.equal(initial.owner, "Q21");
    assert.equal(initial.phase, "INITIAL");
    assert.doesNotMatch(initial.solution, /0\.95/);
    assert.doesNotMatch(initial.reasoning, /Preserve the apex state/);
    assert.deepEqual(initial.errors, []);

    await driver.execute(`
      const input=document.querySelector('[data-response]');
      input.value='0.9'; input.dispatchEvent(new Event('input',{bubbles:true}));
      document.querySelector('[data-attempt-form]').requestSubmit();
    `);
    await driver.waitFor("return window.__core2aProjectileStudy.state.attempted === true");
    const committed = await driver.execute(`
      document.getElementById('reasoningButton').click();
      for(let i=0;i<3;i++) document.getElementById('solutionButton').click();
      return {
        reasoning:document.getElementById('reasoningContent').textContent,
        solution:document.getElementById('solutionContent').textContent,
        stage:document.getElementById('stage').textContent,
      };
    `);
    assert.match(committed.reasoning, /Preserve the apex state and change only the second-stage fall time/);
    assert.match(committed.solution, /0\.95/);
    assert.match(committed.stage, /g\/0\.81/);

    await driver.execute("document.querySelector('[data-question-tab=Q26]').click()");
    await driver.waitFor("return window.__core2aProjectileStudy.owner === 'Q26'");
    const q26Reset = await driver.execute("return window.__core2aProjectileStudy.state");
    assert.equal(q26Reset.phase, "INITIAL");
    assert.equal(q26Reset.attempted, false);
    await driver.execute(`
      const boxes=[...document.querySelectorAll('#attemptArea input[type=checkbox]')];
      boxes[0].click(); boxes[1].click();
      document.querySelector('[data-attempt-form]').requestSubmit();
    `);
    await driver.waitFor("return window.__core2aProjectileStudy.state.attempted === true");
    const q26 = await driver.execute("return document.getElementById('stage').textContent");
    assert.match(q26, /5√g \/ 2/);
    assert.match(q26, /descending · apex before P/);

    await driver.execute("document.querySelector('[data-question-tab=Q23]').click()");
    await driver.waitFor("return window.__core2aProjectileStudy.owner === 'Q23'");
    await driver.execute(`
      const input=document.querySelector('[data-response]');
      input.value='170'; input.dispatchEvent(new Event('input',{bubbles:true}));
      document.querySelector('[data-attempt-form]').requestSubmit();
      const range=document.querySelector('[data-time]'); range.value='2'; range.dispatchEvent(new Event('input',{bubbles:true}));
      for(let i=0;i<6;i++) document.getElementById('solutionButton').click();
      document.getElementById('checkButton').click();
    `);
    const q23 = await driver.execute(`
      return {
        stage:document.getElementById('stage').textContent,
        solution:document.getElementById('solutionContent').textContent,
        check:document.getElementById('checkContent').textContent,
        errors:window.__core2aProjectileErrors.slice(),
      };
    `);
    assert.match(q23.stage, /270 m/);
    assert.match(q23.solution, /170 m/);
    assert.match(q23.check, /Matches the canonical answer/);
    assert.deepEqual(q23.errors, []);

    await driver.size(1280, 900);
    const expanded = await driver.execute("return getComputedStyle(document.querySelector('.study-grid')).gridTemplateColumns.split(' ').length");
    assert.ok(expanded >= 2);
    await driver.size(680, 1000);
    const compact = await driver.execute("return getComputedStyle(document.querySelector('.study-grid')).gridTemplateColumns.split(' ').length");
    assert.equal(compact, 1);
    const targets = await driver.execute(`
      return [...document.querySelectorAll('.question-tabs button,.primary-action,.secondary-action,.control-row button,.angle-button')]
        .filter(x=>!x.disabled).map(x=>x.getBoundingClientRect().height);
    `);
    assert.ok(targets.length > 0);
    assert.ok(targets.every((height) => height >= 48));

    const finalErrors = await driver.execute("return window.__core2aProjectileErrors.slice()");
    assert.deepEqual(finalErrors, []);
  } finally {
    await driver.close();
    process.child.kill("SIGTERM");
    await new Promise((ok) => host.server.close(ok));
  }
});
