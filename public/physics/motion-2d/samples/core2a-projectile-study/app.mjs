import {
  QUESTION_REFS,
  createStudyState,
  markAttempting,
  commitAttempt,
  revealSupport,
  openReasoning,
  openSolution,
  markChecked,
  answerMatches,
  q21RangeRatio,
  q21Snapshot,
  q21OrdinarySnapshot,
  q26Case,
  q26TrajectoryY,
  q23Constants,
  q23Horizontal,
  q23FullState,
  q23SourceDistance,
} from "./model.mjs";

const OWNER_ORDER = ["Q21", "Q26", "Q23"];
const OWNER_TITLES = {
  Q21: "Gravity changes after the apex",
  Q26: "Trajectory through a specified point",
  Q23: "Projectile motion with linear drag",
};
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
const bank = window.GRADE9_QUESTION_BANK;
const byRef = new Map((bank?.questions || []).map((question) => [question.id, question]));
const questions = Object.fromEntries(
  OWNER_ORDER.map((owner) => [owner, byRef.get(QUESTION_REFS[owner])])
);

for (const owner of OWNER_ORDER) {
  if (!questions[owner]) throw new Error(`CORE2A_SAMPLE_CANONICAL_QUESTION_MISSING: ${QUESTION_REFS[owner]}`);
  if (questions[owner].status !== "CANDIDATE") {
    throw new Error(`CORE2A_SAMPLE_STATUS_DRIFT: ${QUESTION_REFS[owner]}=${questions[owner].status}`);
  }
}

const ui = {
  app: document.getElementById("studyApp"),
  tabs: [...document.querySelectorAll("[data-question-tab]")],
  ownerLabel: document.getElementById("ownerLabel"),
  examBadge: document.getElementById("examBadge"),
  canonicalRef: document.getElementById("canonicalRef"),
  recordStatus: document.getElementById("recordStatus"),
  questionHeading: document.getElementById("questionHeading"),
  questionStem: document.getElementById("questionStem"),
  conditions: document.getElementById("questionConditions"),
  attempt: document.getElementById("attemptArea"),
  stateChip: document.getElementById("stateChip"),
  stage: document.getElementById("stage"),
  controls: document.getElementById("visualControls"),
  supportButton: document.getElementById("supportButton"),
  supportContent: document.getElementById("supportContent"),
  reasoningButton: document.getElementById("reasoningButton"),
  reasoningContent: document.getElementById("reasoningContent"),
  solutionButton: document.getElementById("solutionButton"),
  solutionContent: document.getElementById("solutionContent"),
  checkButton: document.getElementById("checkButton"),
  checkContent: document.getElementById("checkContent"),
  flow: [...document.querySelectorAll("[data-flow]")],
  runtimeStatus: document.getElementById("runtimeStatus"),
};

let owner = ownerFromUrl();
let state = createStudyState(owner);
let solutionStep = 0;
let rafId = null;
let lastFrame = 0;
let sim = freshSimulation(owner);

function ownerFromUrl() {
  const requested = new URL(location.href).searchParams.get("q");
  if (OWNER_ORDER.includes(requested)) return requested;
  const exact = OWNER_ORDER.find((label) => QUESTION_REFS[label] === requested);
  return exact || "Q21";
}

function freshSimulation(which) {
  if (which === "Q21") return { time: 0, playing: false, vectors: true, compare: true };
  if (which === "Q26") return { angle: "45", vectors: true };
  return { time: 0, playing: false, compare: true, vector: true };
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function fmt(value, digits = 2) {
  return Number(value).toFixed(digits).replace(/\.00$/, "");
}

function hasStartedAttempt() {
  return state.phase !== "INITIAL";
}

function stopAnimation() {
  if (rafId != null) cancelAnimationFrame(rafId);
  rafId = null;
  sim.playing = false;
  lastFrame = 0;
}

function setOwner(nextOwner, { updateUrl = true } = {}) {
  if (!questions[nextOwner]) return;
  stopAnimation();
  owner = nextOwner;
  state = createStudyState(owner);
  solutionStep = 0;
  sim = freshSimulation(owner);
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set("q", owner);
    history.replaceState(null, "", url);
  }
  render();
  ui.questionHeading.focus?.({ preventScroll: true });
}

function resetQuestion() {
  stopAnimation();
  state = createStudyState(owner);
  solutionStep = 0;
  sim = freshSimulation(owner);
  render();
  announce(`${owner} reset to its initial state.`);
}

function markAttemptFromInput() {
  if (!state.attempted && state.phase === "INITIAL") {
    state = markAttempting(state);
    renderStateChrome();
    renderStage();
    renderControls();
  }
}

function currentResponse() {
  if (owner === "Q26") {
    return [...ui.attempt.querySelectorAll('input[type="checkbox"]:checked')]
      .map((box) => box.value);
  }
  return ui.attempt.querySelector("[data-response]")?.value ?? "";
}

function commitCurrentAttempt(event) {
  event?.preventDefault();
  try {
    state = commitAttempt(state, currentResponse());
    solutionStep = 0;
    render();
    announce("Attempt committed. Support and reasoning are now available.");
  } catch (error) {
    announce("Enter or select a genuine response before committing.");
    ui.attempt.querySelector("input,button")?.focus();
  }
}

function announce(message) {
  ui.runtimeStatus.textContent = message;
}

function render() {
  const q = questions[owner];
  ui.tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.questionTab === owner)));
  ui.ownerLabel.textContent = owner;
  ui.examBadge.textContent = `${q.exam} ${q.year} · ${q.paper} · Q${q.question_number}`;
  ui.canonicalRef.textContent = q.id;
  ui.recordStatus.textContent = q.status;
  ui.questionHeading.textContent = `${owner} · ${OWNER_TITLES[owner]}`;
  ui.questionStem.textContent = q.stem;
  ui.conditions.replaceChildren(...q.conditions.map((condition) => {
    const li = document.createElement("li");
    li.textContent = condition;
    return li;
  }));
  renderAttempt(q);
  renderStateChrome();
  renderStage();
  renderControls();
  renderSupport(q);
  renderReasoning(q);
  renderSolution(q);
  renderCheck(q);
  announce(`${owner} loaded from the generated canonical Question Bank projection.`);
}

function renderAttempt(q) {
  if (state.attempted) {
    const response = Array.isArray(state.response) ? state.response.join(", ") : state.response;
    ui.attempt.innerHTML = `<div class="attempt-panel">
      <div class="attempt-title">Committed answer</div>
      <div class="equation-chip">${esc(response)}</div>
      <button type="button" class="secondary-action" data-reset-question>Reset question</button>
    </div>`;
    ui.attempt.querySelector("[data-reset-question]").addEventListener("click", resetQuestion);
    return;
  }

  if (owner === "Q26") {
    const choices = q.options.map((option, index) => {
      const letter = String.fromCharCode(65 + index);
      return `<label class="choice"><input type="checkbox" value="${letter}" aria-label="Option ${letter}">
        <span>${esc(option)}</span></label>`;
    }).join("");
    ui.attempt.innerHTML = `<form class="attempt-panel" data-attempt-form>
      <div class="attempt-title">Try · select every option you think is correct</div>
      <div class="choice-grid">${choices}</div>
      <button type="submit" class="primary-action">Commit answer</button>
    </form>`;
    ui.attempt.querySelectorAll('input[type="checkbox"]').forEach((box) => box.addEventListener("change", () => {
      if ([...ui.attempt.querySelectorAll('input[type="checkbox"]:checked')].length) markAttemptFromInput();
    }));
  } else {
    const label = owner === "Q21" ? "Predict n = d′/d" : "Predict wall distance (m)";
    const placeholder = owner === "Q21" ? "e.g. 0.9" : "distance in metres";
    ui.attempt.innerHTML = `<form class="attempt-panel" data-attempt-form>
      <label for="learnerResponse">${label}</label>
      <input id="learnerResponse" data-response type="number" inputmode="decimal" step="any" placeholder="${placeholder}" required>
      <button type="submit" class="primary-action">Commit answer</button>
    </form>`;
    ui.attempt.querySelector("[data-response]").addEventListener("input", (event) => {
      if (String(event.target.value).trim()) markAttemptFromInput();
    });
  }
  ui.attempt.querySelector("[data-attempt-form]").addEventListener("submit", commitCurrentAttempt);
}

function renderStateChrome() {
  ui.stateChip.textContent = state.phase;
  const flowState = {
    TRY: hasStartedAttempt(),
    VISUALIZE: hasStartedAttempt(),
    SUPPORT: state.supportIndex > 0,
    REASONING: state.reasoningOpen,
    SOLUTION: state.solutionOpen,
    CHECK: state.checked,
  };
  ui.flow.forEach((item) => {
    item.classList.toggle("done", Boolean(flowState[item.dataset.flow]));
    item.classList.toggle("active",
      (item.dataset.flow === "TRY" && state.phase === "INITIAL")
      || (item.dataset.flow === "VISUALIZE" && state.phase === "ATTEMPTING")
      || (item.dataset.flow === "SUPPORT" && state.phase === "COMMITTED")
      || (item.dataset.flow === "REASONING" && state.reasoningOpen && !state.solutionOpen)
      || (item.dataset.flow === "SOLUTION" && state.solutionOpen && !state.checked)
      || (item.dataset.flow === "CHECK" && state.checked));
  });
}

function renderSupport(q) {
  ui.supportButton.disabled = !state.attempted || state.supportIndex >= q.scaffolds.length;
  ui.supportButton.textContent = state.supportIndex ? "Next hint" : "Need a hint?";
  if (!state.attempted) {
    ui.supportContent.innerHTML = '<p class="locked-copy">Commit an attempt before authored support is available.</p>';
    return;
  }
  if (!state.supportIndex) {
    ui.supportContent.innerHTML = '<p class="locked-copy">Support is learner-controlled. Reveal one authored scaffold at a time.</p>';
    return;
  }
  const rows = q.scaffolds.slice(0, state.supportIndex).map((item) =>
    `<li><span class="move-kind">${esc(item.support_kind)}</span>${esc(item.text)}</li>`
  ).join("");
  ui.supportContent.innerHTML = `<p class="viz-note">Authored support — not a source hint.</p><ol>${rows}</ol>`;
}

function renderReasoning(q) {
  ui.reasoningButton.disabled = !state.attempted;
  ui.reasoningButton.textContent = state.reasoningOpen ? "Reasoning open" : "Why?";
  if (!state.reasoningOpen) {
    ui.reasoningContent.innerHTML = state.attempted
      ? '<p class="locked-copy">Your attempt is safe. Open the structured route when you want it.</p>'
      : '<p class="locked-copy">The reasoning route and crux remain closed until you commit.</p>';
    return;
  }
  const rows = q.answer.reasoning_route.map((move) => {
    const crux = move.id === q.answer.crux_move_ref;
    return `<li data-crux="${crux}">
      ${crux ? '<span class="crux-label">Crux</span>' : ""}
      <span class="move-kind">${esc(move.kind)}</span>
      <div>${esc(move.action)}</div>
    </li>`;
  }).join("");
  ui.reasoningContent.innerHTML = `<ol class="reasoning-route">${rows}</ol>
    <div class="repair-box"><strong>Distinguished crux</strong><br>${esc(q.stable_crux_move)}</div>`;
}

function solutionSteps(q) {
  if (owner !== "Q23") return q.answer.reasoning.map((text) => text);
  const constants = q23Constants();
  return [
    `vₓ₀ = ${constants.launchSpeed} cos60° = ${constants.vx0} m/s`,
    `m/c = ${constants.mass}/${constants.c} = ${constants.tau} s`,
    q.answer.reasoning[0],
    `Integrate vₓ(t): x(t) = vₓ₀(m/c)[1 − exp(−ct/m)].`,
    `At t = 2 s, use the source convention e = ${constants.sourceE}.`,
    q.answer.reasoning[2],
  ];
}

function renderSolution(q) {
  const steps = solutionSteps(q);
  ui.solutionButton.disabled = !state.attempted || (state.solutionOpen && solutionStep >= steps.length);
  if (!state.attempted) {
    ui.solutionButton.textContent = "Open solution";
    ui.solutionContent.innerHTML = '<p class="locked-copy">Your answer comes first.</p>';
    return;
  }
  if (!state.solutionOpen) {
    ui.solutionButton.textContent = "Open solution";
    ui.solutionContent.innerHTML = '<p class="locked-copy">Open only when you want the worked closure.</p>';
    return;
  }
  ui.solutionButton.textContent = solutionStep < steps.length ? "Next step" : "Solution complete";
  const shown = steps.slice(0, solutionStep).map((text) => `<li>${esc(text)}</li>`).join("");
  const final = solutionStep >= steps.length
    ? `<div class="solution-answer"><strong>Canonical answer</strong><br>${esc(q.answer.summary)}</div>`
    : "";
  ui.solutionContent.innerHTML = `<ol class="solution-steps">${shown}</ol>${final}`;
}

function renderCheck(q) {
  const totalSteps = solutionSteps(q).length;
  ui.checkButton.disabled = !state.solutionOpen || solutionStep < totalSteps;
  if (!state.checked) {
    ui.checkContent.innerHTML = state.solutionOpen && solutionStep >= totalSteps
      ? '<p class="locked-copy">Use Check to compare your committed response with the canonical closure.</p>'
      : '<p class="locked-copy">Complete the solution, then run an independent check / repair.</p>';
    return;
  }
  const correct = answerMatches(owner, state.response);
  ui.checkContent.innerHTML = `<div class="check-result"><strong>${correct ? "Matches the canonical answer." : "Revisit the reasoning route."}</strong>
      <p>${esc(q.answer.check)}</p></div>
    <div class="repair-box"><strong>Common wrong route to repair</strong><br>${esc(q.common_wrong_route)}</div>`;
}

function unlockVisual() {
  return hasStartedAttempt();
}

function renderControls() {
  const enabled = unlockVisual();
  if (owner === "Q21") {
    ui.controls.innerHTML = `
      <button type="button" data-action="play" ${enabled ? "" : "disabled"}>${sim.playing ? "Pause" : "Play"}</button>
      <button type="button" data-action="apex" ${enabled ? "" : "disabled"}>At apex</button>
      <button type="button" data-action="continue" ${enabled ? "" : "disabled"}>Continue after apex</button>
      <button type="button" data-action="reset-sim">Reset</button>
      <label><input type="checkbox" data-toggle="vectors" ${sim.vectors ? "checked" : ""}> Vectors</label>
      <label><input type="checkbox" data-toggle="compare" ${sim.compare ? "checked" : ""}> Compare ordinary</label>`;
  } else if (owner === "Q26") {
    ui.controls.innerHTML = `<div class="angle-row" role="group" aria-label="Launch angle">
      <button class="angle-button" type="button" data-angle="45" aria-pressed="${sim.angle === "45"}" ${enabled ? "" : "disabled"}>45°</button>
      <button class="angle-button" type="button" data-angle="30" aria-pressed="${sim.angle === "30"}" ${enabled ? "" : "disabled"}>30°</button>
      <button class="angle-button" type="button" data-angle="atan1over5" aria-pressed="${sim.angle === "atan1over5"}" ${enabled ? "" : "disabled"}>tan⁻¹(1/5)</button>
      <button type="button" data-action="at-p" ${state.attempted ? "" : "disabled"}>At P</button>
      <button type="button" data-action="reset-sim">Reset</button>
      <label><input type="checkbox" data-toggle="vectors" ${sim.vectors ? "checked" : ""}> Vectors at P</label>
    </div>`;
  } else {
    ui.controls.innerHTML = `
      <button type="button" data-action="play" ${enabled ? "" : "disabled"}>${sim.playing ? "Pause" : "Play"}</button>
      <label>time <input type="range" data-time min="0" max="2" step="0.05" value="${sim.time}" ${enabled ? "" : "disabled"}></label>
      <label><input type="checkbox" data-toggle="compare" ${sim.compare ? "checked" : ""}> No-drag comparison</label>
      <label><input type="checkbox" data-toggle="vector" ${sim.vector ? "checked" : ""}> Velocity vector</label>
      <button type="button" data-action="reset-sim">Reset</button>`;
  }

  ui.controls.querySelector('[data-action="play"]')?.addEventListener("click", togglePlay);
  ui.controls.querySelector('[data-action="apex"]')?.addEventListener("click", () => {
    stopAnimation(); sim.time = 1; renderStage(); renderControls();
  });
  ui.controls.querySelector('[data-action="continue"]')?.addEventListener("click", () => {
    sim.time = Math.max(1.001, sim.time);
    startPlay();
  });
  ui.controls.querySelector('[data-action="at-p"]')?.addEventListener("click", () => {
    renderStage(true);
    announce("At P overlay shown. Read the direction of motion as well as the point constraint.");
  });
  ui.controls.querySelector('[data-action="reset-sim"]')?.addEventListener("click", () => {
    stopAnimation();
    sim = freshSimulation(owner);
    renderStage();
    renderControls();
    announce("Visualization reset.");
  });
  ui.controls.querySelectorAll("[data-toggle]").forEach((input) => input.addEventListener("change", (event) => {
    sim[event.target.dataset.toggle] = event.target.checked;
    renderStage();
  }));
  ui.controls.querySelector("[data-time]")?.addEventListener("input", (event) => {
    stopAnimation();
    sim.time = Number(event.target.value);
    renderStage();
    renderControls();
  });
  ui.controls.querySelectorAll("[data-angle]").forEach((button) => button.addEventListener("click", () => {
    sim.angle = button.dataset.angle;
    renderStage();
    renderControls();
  }));
}

function togglePlay() {
  if (!unlockVisual()) return;
  if (sim.playing) {
    stopAnimation();
    renderControls();
    return;
  }
  if (reducedMotion) {
    const end = owner === "Q21" ? 1.9 : 2;
    sim.time = sim.time >= end ? 0 : Math.min(end, sim.time + (owner === "Q21" ? 0.12 : 0.1));
    renderStage();
    renderControls();
    announce("Reduced-motion mode: Play advances one deterministic step.");
    return;
  }
  startPlay();
}

function startPlay() {
  if (!unlockVisual()) return;
  const end = owner === "Q21" ? 1.9 : 2;
  if (sim.time >= end) sim.time = 0;
  sim.playing = true;
  lastFrame = 0;
  renderControls();
  rafId = requestAnimationFrame(tick);
}

function tick(timestamp) {
  if (!sim.playing) return;
  if (!lastFrame) lastFrame = timestamp;
  const dt = Math.min(0.05, (timestamp - lastFrame) / 1000);
  lastFrame = timestamp;
  sim.time += dt * (owner === "Q21" ? 0.48 : 0.55);
  const end = owner === "Q21" ? 1.9 : 2;
  if (sim.time >= end) {
    sim.time = end;
    stopAnimation();
    renderStage();
    renderControls();
    return;
  }
  renderStage();
  rafId = requestAnimationFrame(tick);
}

function renderStage(forceAtP = false) {
  if (!unlockVisual()) {
    ui.stage.innerHTML = `<div style="min-height:430px;display:grid;place-items:center;padding:28px;text-align:center">
      <div><strong>Try first</strong><p class="locked-copy">Enter a prediction or select an option to unlock the interactive model.</p></div></div>`;
    return;
  }
  if (owner === "Q21") renderQ21();
  else if (owner === "Q26") renderQ26(forceAtP);
  else renderQ23();
}

function svgPath(points) {
  return points.map((point, index) => `${index ? "L" : "M"} ${fmt(point[0], 1)} ${fmt(point[1], 1)}`).join(" ");
}

function renderQ21() {
  const left = 56, right = 710, ground = 350, height = 215;
  const sx = (ratio) => left + ratio * (right - left) / 1.05;
  const sy = (ratio) => ground - ratio * height;
  const activePoints = [];
  for (let t = 0; t <= 1.90001; t += 0.025) {
    const p = q21Snapshot(t);
    activePoints.push([sx(p.xRatio), sy(p.yRatio)]);
  }
  const ordinaryPoints = [];
  for (let t = 0; t <= 2.00001; t += 0.025) {
    const p = q21OrdinarySnapshot(t);
    ordinaryPoints.push([sx(p.xRatio), sy(p.yRatio)]);
  }
  const now = q21Snapshot(sim.time);
  const px = sx(now.xRatio), py = sy(now.yRatio);
  const apexX = sx(0.5), apexY = sy(1);
  const compare = sim.compare ? `<path class="ghost-path" d="${svgPath(ordinaryPoints)}"/><text x="${sx(.78)}" y="${sy(.53)}" class="muted" font-size="12">ordinary g ghost path</text>` : "";
  const vectors = sim.vectors ? `
    <line class="vector" x1="${px}" y1="${py}" x2="${px + 58}" y2="${py}" marker-end="url(#arrowWarm)"/>
    <text x="${px + 20}" y="${py - 9}" class="warm" font-size="12">vₓ unchanged</text>
    <line class="accel" x1="${px}" y1="${py + 8}" x2="${px}" y2="${py + 60}" marker-end="url(#arrowPink)"/>
    <text x="${px + 9}" y="${py + 48}" fill="#fb7185" font-size="12">${now.changedGravityActive ? "g/0.81" : "g"}</text>` : "";
  const exactReadout = state.attempted ? `<div class="readout"><strong>x / d</strong><span>${fmt(now.xRatio, 3)}</span></div>` : "";
  ui.stage.innerHTML = `<svg viewBox="0 0 760 430" role="img" aria-label="Two-stage projectile model with gravity changing only after the apex">
    <defs><marker id="arrowWarm" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#f0b72f"/></marker>
    <marker id="arrowPink" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#fb7185"/></marker></defs>
    <line x1="42" y1="${ground}" x2="724" y2="${ground}" class="axis"/>
    <line x1="${apexX}" y1="72" x2="${apexX}" y2="${ground}" stroke="#56d364" stroke-dasharray="7 7"/>
    <text x="${apexX + 8}" y="88" class="ok" font-size="12">boundary: gravity changes here</text>
    ${compare}
    <path class="active-path" d="${svgPath(activePoints)}"/>
    <circle cx="${apexX}" cy="${apexY}" r="7" class="apex"/><text x="${apexX + 10}" y="${apexY - 8}" class="ok" font-size="13">apex</text>
    <circle cx="${px}" cy="${py}" r="8" class="marker"/>${vectors}
    <line x1="${sx(0)}" y1="385" x2="${sx(1)}" y2="385" stroke="#94a3b8"/><text x="${sx(.47)}" y="407" class="muted" font-size="13">ordinary range d</text>
    <line x1="${sx(0)}" y1="370" x2="${sx(q21RangeRatio())}" y2="370" stroke="#7dd3fc"/><text x="${sx(.43)}" y="366" class="accent" font-size="13">modified range d′</text>
    <text x="54" y="35" class="muted" font-size="13">Before apex: ordinary gravity g · after apex: effective downward acceleration g/0.81</text>
  </svg>
  <div class="readout-strip">
    <div class="readout"><strong>Phase</strong><span>${now.phase === "CHANGED_DESCENT" ? "after apex" : now.phase.toLowerCase()}</span></div>
    <div class="readout"><strong>Horizontal velocity</strong><span>unchanged</span></div>
    <div class="readout"><strong>Downward acceleration</strong><span>${now.changedGravityActive ? "g/0.81" : "g"}</span></div>
    ${exactReadout}
  </div>`;
}

function renderQ26(forceAtP = false) {
  const model = q26Case(sim.angle, 9.8);
  const left = 58, right = 718, ground = 358, top = 42;
  const maxX = model.finiteSpeed ? Math.max(7.5, model.apexX * 2 + 0.8) : 7.5;
  const maxY = model.finiteSpeed ? Math.max(3.4, model.apexY * 1.25) : 3.4;
  const sx = (x) => left + (x / maxX) * (right - left);
  const sy = (y) => ground - (y / maxY) * (ground - top);
  const grid = [];
  for (let x = 0; x <= maxX + 0.01; x += 1) grid.push(`<line x1="${sx(x)}" y1="${top}" x2="${sx(x)}" y2="${ground}" class="gridline"/>`);
  for (let y = 0; y <= maxY + 0.01; y += 1) grid.push(`<line x1="${left}" y1="${sy(y)}" x2="${right}" y2="${sy(y)}" class="gridline"/>`);
  let curve = "";
  if (model.finiteSpeed) {
    const range = (model.v2 * Math.sin(2 * model.theta)) / model.g;
    const points = [];
    for (let x = 0; x <= range + 0.001; x += Math.max(0.04, range / 140)) {
      points.push([sx(x), sy(Math.max(0, q26TrajectoryY(x, model)))]);
    }
    curve = `<path class="active-path" d="${svgPath(points)}"/>`;
  }
  const overlaysVisible = state.attempted || forceAtP;
  const pX = sx(5), pY = sy(1);
  let overlay = "";
  if (model.finiteSpeed && overlaysVisible) {
    const aX = sx(model.apexX), aY = sy(model.apexY);
    const direction = model.slopeAtP < 0 ? -1 : 1;
    overlay = `<circle cx="${aX}" cy="${aY}" r="7" class="apex"/><text x="${aX + 10}" y="${aY - 8}" class="ok" font-size="12">apex</text>
      <line x1="${pX - 42}" y1="${pY - direction * 42 * Math.abs(model.slopeAtP)}" x2="${pX + 48}" y2="${pY + direction * 48 * Math.abs(model.slopeAtP)}" stroke="#f0b72f" stroke-width="3"/>
      <text x="${pX + 14}" y="${pY + 26}" class="warm" font-size="12">slope at P: ${model.slopeAtP < 0 ? "negative" : "positive"}</text>
      ${sim.vectors ? `<line class="vector" x1="${pX}" y1="${pY}" x2="${pX + 60}" y2="${pY}" marker-end="url(#arrow26)"/>
      <line class="vector" x1="${pX}" y1="${pY}" x2="${pX}" y2="${pY - model.vyAtP * 2.1}" marker-end="url(#arrow26)"/>
      <text x="${pX + 25}" y="${pY - 9}" class="warm" font-size="11">vₓ</text><text x="${pX + 8}" y="${pY - model.vyAtP * 1.05}" class="warm" font-size="11">vᵧ</text>` : ""}`;
  }
  const invalid = !model.finiteSpeed
    ? '<text x="128" y="120" class="warm" font-size="17">No finite launch speed can make this angle pass through P.</text><text x="128" y="148" class="muted" font-size="13">The straight-line term already equals y = 1 before gravity lowers the path.</text>'
    : "";
  const details = !state.attempted ? '<div class="readout"><strong>At P</strong><span>commit to reveal slope</span></div>'
    : model.finiteSpeed
      ? `<div class="readout"><strong>Required speed</strong><span>${model.symbolicSpeed ? model.symbolicSpeed : fmt(model.v, 2) + " m/s (g = 9.8 viz)"}</span></div>
         <div class="readout"><strong>At P</strong><span>${model.apexRelation === "BEFORE_P" ? "descending · apex before P" : "rising · apex after P"}</span></div>`
      : '<div class="readout"><strong>Required speed</strong><span>no finite v</span></div>';
  ui.stage.innerHTML = `<svg viewBox="0 0 760 430" role="img" aria-label="Coordinate grid showing a projectile trajectory through P equals 5 metres comma 1 metre">
    <defs><marker id="arrow26" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#f0b72f"/></marker></defs>
    ${grid.join("")}
    <line x1="${left}" y1="${ground}" x2="${right}" y2="${ground}" class="axis"/><line x1="${left}" y1="${ground}" x2="${left}" y2="${top}" class="axis"/>
    <text x="${left + 8}" y="${ground - 10}" class="muted" font-size="12">O</text>
    ${curve}
    <circle cx="${pX}" cy="${pY}" r="8" class="point-p"/><text x="${pX + 10}" y="${pY - 10}" class="warm" font-size="13">P = (5 m, 1 m)</text>
    ${overlay}${invalid}
    <text x="54" y="26" class="muted" font-size="12">Visualization value only: g = 9.8 m/s² · symbolic trajectory equation remains authoritative</text>
  </svg>
  <div class="readout-strip">
    <div class="readout"><strong>Angle</strong><span>${sim.angle === "atan1over5" ? "tan⁻¹(1/5)" : sim.angle + "°"}</span></div>
    <div class="readout"><strong>Point condition</strong><span>P = (5, 1)</span></div>
    ${details}
  </div>
  ${state.attempted ? '<div class="equation-chip">y = x tanθ − gx²/(2v² cos²θ)</div>' : ""}`;
}

function renderQ23() {
  const constants = q23Constants();
  const model = q23FullState(sim.time, 9.8);
  const sourceEnd = q23Horizontal(2, { sourceApproxAtEvent: true });
  const left = 54, right = 710, top = 34, ground = 288;
  const maxX = 285, maxY = 330;
  const sx = (x) => left + (x / maxX) * (right - left);
  const sy = (y) => ground - (y / maxY) * (ground - top);
  const trajectory = [];
  for (let t = 0; t <= 2.0001; t += 0.025) {
    const p = q23FullState(t, 9.8);
    trajectory.push([sx(p.x), sy(Math.max(0, p.y))]);
  }
  const vxGraph = [];
  const graphTop = 328, graphBottom = 408, graphLeft = 74, graphRight = 704;
  for (let t = 0; t <= 2.0001; t += 0.025) {
    const p = q23Horizontal(t);
    vxGraph.push([graphLeft + (t / 2) * (graphRight - graphLeft), graphBottom - (p.vx / 135) * (graphBottom - graphTop)]);
  }
  const px = sx(model.x), py = sy(Math.max(0, model.y));
  const compare = sim.compare ? `<line x1="${sx(0)}" y1="310" x2="${sx(constants.vx0 * sim.time)}" y2="310" stroke="#94a3b8" stroke-width="4" stroke-dasharray="8 7"/>
      <text x="${sx(0)}" y="326" class="muted" font-size="11">hypothetical no-drag horizontal motion: x = 135t</text>` : "";
  const vector = sim.vector ? `<line class="vector" x1="${px}" y1="${py}" x2="${px + Math.max(22, model.vx * .24)}" y2="${py - model.vy * .11}" marker-end="url(#arrow23)"/>` : "";
  const distanceReadout = state.attempted
    ? `<div class="readout"><strong>x(t), continuous exp</strong><span>${fmt(model.x, 1)} m</span></div>`
    : '<div class="readout"><strong>x(t)</strong><span>commit to show value</span></div>';
  ui.stage.innerHTML = `<svg viewBox="0 0 760 450" role="img" aria-label="Projectile with linear drag and a velocity decay graph">
    <defs><marker id="arrow23" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#f0b72f"/></marker></defs>
    <line x1="${left}" y1="${ground}" x2="${right}" y2="${ground}" class="axis"/>
    <line x1="${sx(sourceEnd.x)}" y1="48" x2="${sx(sourceEnd.x)}" y2="${ground}" class="wall"/>
    <text x="${sx(sourceEnd.x) + 9}" y="68" class="muted" font-size="12">wall · t = 2 s event</text>
    <path class="active-path" d="${svgPath(trajectory)}"/>
    <circle cx="${px}" cy="${py}" r="8" class="marker"/>${vector}${compare}
    <text x="54" y="24" class="muted" font-size="12">2D visualization uses g = 9.8 m/s² and linear drag consistently on both velocity components</text>
    <line x1="${graphLeft}" y1="${graphBottom}" x2="${graphRight}" y2="${graphBottom}" class="axis"/>
    <line x1="${graphLeft}" y1="${graphBottom}" x2="${graphLeft}" y2="${graphTop}" class="axis"/>
    <path class="active-path" d="${svgPath(vxGraph)}"/>
    <text x="${graphLeft}" y="${graphTop - 7}" class="accent" font-size="12">vₓ(t) = vₓ₀ exp(−ct/m)</text>
    <text x="${graphRight - 20}" y="${graphBottom + 18}" class="muted" font-size="11">2 s</text>
    <circle cx="${graphLeft + (sim.time / 2) * (graphRight - graphLeft)}" cy="${graphBottom - (model.vx / 135) * (graphBottom - graphTop)}" r="6" class="point-p"/>
  </svg>
  <div class="readout-strip">
    <div class="readout"><strong>Elapsed</strong><span>${fmt(sim.time, 2)} s</span></div>
    <div class="readout"><strong>vₓ(t)</strong><span>${fmt(model.vx, 1)} m/s</span></div>
    ${distanceReadout}
    <div class="readout"><strong>No drag x</strong><span>${fmt(model.noDragX, 1)} m</span></div>
  </div>`;
}

ui.tabs.forEach((tab) => tab.addEventListener("click", () => setOwner(tab.dataset.questionTab)));
ui.supportButton.addEventListener("click", () => {
  state = revealSupport(state, questions[owner].scaffolds.length);
  renderStateChrome(); renderSupport(questions[owner]);
  announce(`Support ${state.supportIndex} of ${questions[owner].scaffolds.length} revealed.`);
});
ui.reasoningButton.addEventListener("click", () => {
  state = openReasoning(state);
  renderStateChrome(); renderReasoning(questions[owner]);
  announce("Structured reasoning route opened.");
});
ui.solutionButton.addEventListener("click", () => {
  const steps = solutionSteps(questions[owner]);
  if (!state.solutionOpen) {
    state = openSolution(state);
    solutionStep = 1;
  } else {
    solutionStep = Math.min(steps.length, solutionStep + 1);
  }
  renderStateChrome(); renderReasoning(questions[owner]); renderSolution(questions[owner]); renderCheck(questions[owner]);
  announce(`Solution step ${solutionStep} of ${steps.length} visible.`);
});
ui.checkButton.addEventListener("click", () => {
  state = markChecked(state);
  renderStateChrome(); renderCheck(questions[owner]);
  announce("Independent check complete.");
});
ui.stage.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    if (owner !== "Q26") togglePlay();
  } else if (event.key === "Home") {
    event.preventDefault();
    stopAnimation();
    sim = freshSimulation(owner);
    renderStage(); renderControls();
  } else if (event.key === "ArrowRight" && owner !== "Q26" && unlockVisual()) {
    event.preventDefault();
    const end = owner === "Q21" ? 1.9 : 2;
    sim.time = Math.min(end, sim.time + (owner === "Q21" ? .08 : .1));
    renderStage(); renderControls();
  }
});

window.addEventListener("popstate", () => setOwner(ownerFromUrl(), { updateUrl: false }));
window.__core2aProjectileStudy = {
  get owner() { return owner; },
  get state() { return structuredClone(state); },
  reset: resetQuestion,
  select: setOwner,
  q21RangeRatio,
  q26Case,
  q23SourceDistance,
};
window.addEventListener("error", (event) => {
  ui.runtimeStatus.textContent = `Runtime error: ${event.message}`;
});
render();
window.__core2aProjectileStudyReady = true;
