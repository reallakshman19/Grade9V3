import {
  CORE2A_PROJECTILE_REFS, ORDER, parseQ21, q21State, parseQ26, solvePointPassage, parseQ23, q23Horizontal,
  createStudyState, transitionStudyState, clamp, round, requirePublicCondition,
} from "./study-model.mjs";
import { STUDY_STYLES } from "./study-styles.mjs";
import { renderQ21Stage, renderQ26Stage, renderQ23Stage } from "./study-visuals.mjs";
export { CORE2A_PROJECTILE_REFS, CORE2A_PROJECTILE_BLUEPRINT } from "./study-model.mjs";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function answerLabel(record) {
  return record?.answer?.summary || "";
}

const HTMLElementBase = globalThis.HTMLElement || class {};

export class Core2AProjectileStudy extends HTMLElementBase {
  constructor() {
    super();
    this.attachShadow?.({ mode: "open" });
    this._records = null;
    this._byOwner = new Map();
    this.state = createStudyState("Q21");
    this._raf = null;
    this._lastFrame = 0;
    this._reduceMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;
  }

  set records(value) {
    const rows = Array.isArray(value) ? value : [];
    const byId = new Map(rows.map((row) => [row?.id, row]));
    this._byOwner = new Map();
    for (const owner of ORDER) {
      const record = byId.get(CORE2A_PROJECTILE_REFS[owner]);
      requirePublicCondition(record, "STUDY_CANONICAL_RECORD_MISSING", CORE2A_PROJECTILE_REFS[owner]);
      requirePublicCondition(record.status === "CANDIDATE", "STUDY_STATUS_DRIFT", `${owner}:${record.status}`);
      requirePublicCondition(record.subject === "Physics", "STUDY_SUBJECT_DRIFT", owner);
      requirePublicCondition(record.family_ref === "FAM-PHY-KIN-2D-PRACTICE", "STUDY_FAMILY_DRIFT", owner);
      requirePublicCondition(Array.isArray(record.scaffolds), "STUDY_SCAFFOLDS_MISSING", owner);
      requirePublicCondition(Array.isArray(record.answer?.reasoning_route), "STUDY_REASONING_MISSING", owner);
      this._byOwner.set(owner, record);
    }
    this._records = rows;
    if (this.isConnected) this._mountFromLocation();
  }

  get activeRecord() { return this._byOwner.get(this.state.owner); }

  connectedCallback() {
    if (!this.shadowRoot) return;
    this.shadowRoot.addEventListener("click", (event) => this._onClick(event));
    this.shadowRoot.addEventListener("input", (event) => this._onInput(event));
    this.shadowRoot.addEventListener("change", (event) => this._onChange(event));
    this.shadowRoot.addEventListener("keydown", (event) => this._onKeydown(event));
    if (this._byOwner.size) this._mountFromLocation();
    else this.render();
  }

  disconnectedCallback() { this._stopAnimation(); }

  _mountFromLocation() {
    const requested = new URL(globalThis.location?.href || "http://local/").searchParams.get("q")?.toUpperCase();
    const owner = ORDER.includes(requested) ? requested : "Q21";
    this.state = createStudyState(owner);
    this._stopAnimation();
    this.render();
  }

  select(owner, updateUrl = true) {
    if (!ORDER.includes(owner)) return;
    this._stopAnimation();
    this.state = createStudyState(owner);
    if (updateUrl && globalThis.history && globalThis.location) {
      const url = new URL(globalThis.location.href);
      url.searchParams.set("q", owner);
      history.replaceState(null, "", url);
    }
    this.render();
    this.shadowRoot?.querySelector(`[role="tab"][data-owner="${owner}"]`)?.focus();
  }

  _blockedSupportIndex() {
    const record = this.activeRecord;
    if (!record) return -1;
    return record.scaffolds.findIndex((item) => item.supports_move_ref === record.answer?.crux_move_ref);
  }

  _reasoningRows() {
    const record = this.activeRecord;
    if (!record) return [];
    if (this.state.owner !== "Q23") return record.answer.reasoning_route || [];
    const p = parseQ23(record);
    const vx0 = p.speed * Math.cos(p.angleDegrees * Math.PI / 180);
    const tau = p.mass / p.c;
    return [
      { id: "Q23-UI-1", kind: "REPRESENT", action: `vₓ₀ = ${p.speed} cos ${p.angleDegrees}° = ${round(vx0, 0)} m/s`, sourceMove: record.answer.reasoning_route[1]?.id },
      { id: "Q23-UI-2", kind: "CONNECT", action: `m/c = ${p.mass}/${p.c} = ${round(tau, 0)} s`, sourceMove: record.answer.reasoning_route[1]?.id },
      { id: "Q23-UI-3", kind: "REPRESENT", action: "m dvₓ/dt = −c vₓ, so vₓ(t) = vₓ₀ exp[−(c/m)t]", sourceMove: record.answer.reasoning_route[0]?.id },
      { id: "Q23-UI-4", kind: "CONNECT", action: "Integrate vₓ(t): x(t) = vₓ₀(m/c)[1 − exp(−ct/m)]", sourceMove: record.answer.reasoning_route[1]?.id, crux: true },
      { id: "Q23-UI-5", kind: "EXECUTE", action: `At t = ${p.wallTime} s, use the source approximation e = ${p.eBase}.`, sourceMove: record.answer.reasoning_route[2]?.id },
      { id: "Q23-UI-6", kind: "TRANSFORM", action: record.answer.reasoning_route[2]?.action || record.answer.reasoning?.[2] || answerLabel(record), sourceMove: record.answer.reasoning_route[2]?.id },
    ];
  }

  _dispatchStudy(event) {
    this.state = transitionStudyState(this.state, event);
    this.render();
  }

  _onClick(event) {
    const button = event.target.closest("button");
    if (!button) return;
    const owner = button.dataset.owner;
    if (owner) { this.select(owner); return; }
    const action = button.dataset.action;
    if (!action) return;
    if (action === "commit") {
      try { this._dispatchStudy({ type: "COMMIT_ATTEMPT" }); }
      catch (error) { this._announce(error.code === "GENUINE_ATTEMPT_REQUIRED" ? "Make a prediction before you commit." : error.message); }
      return;
    }
    if (action === "support") {
      this._dispatchStudy({ type: "REQUEST_SUPPORT", total: this.activeRecord.scaffolds.length, blockedIndex: this._blockedSupportIndex() });
      return;
    }
    if (action === "reasoning") {
      this._dispatchStudy({ type: "SHOW_REASONING", total: this._reasoningRows().length });
      return;
    }
    if (action === "solution") {
      this._dispatchStudy({ type: "OPEN_SOLUTION", requiredReasoning: this._reasoningRows().length });
      return;
    }
    if (action === "check") { this._dispatchStudy({ type: "CHECK" }); return; }
    if (action === "reset") { this._stopAnimation(); this._dispatchStudy({ type: "RESET" }); return; }
    if (this.state.owner === "Q21") this._q21Action(action);
    if (this.state.owner === "Q26") this._q26Action(action, button.dataset.angle);
    if (this.state.owner === "Q23") this._q23Action(action);
  }

  _onInput(event) {
    if (event.target.matches("[data-attempt-text]")) {
      this.state = transitionStudyState(this.state, { type: "SET_ATTEMPT", value: event.target.value });
      this._syncPhase();
      return;
    }
    if (event.target.matches("[data-time-scrubber]")) {
      this.state.q23.playing = false;
      this.state.q23.time = Number(event.target.value);
      this.render();
    }
  }

  _onChange(event) {
    if (event.target.matches("[data-option]")) {
      const selected = [...this.shadowRoot.querySelectorAll("[data-option]:checked")].map((input) => input.value);
      this.state = transitionStudyState(this.state, { type: "SET_ATTEMPT", value: selected });
      this.render();
    }
  }

  _onKeydown(event) {
    const tab = event.target.closest('[role="tab"]');
    if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = ORDER.indexOf(tab.dataset.owner);
    const next = event.key === "Home" ? 0 : event.key === "End" ? ORDER.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + ORDER.length) % ORDER.length;
    this.select(ORDER[next]);
  }

  _syncPhase() {
    const phase = this.shadowRoot?.querySelector("[data-phase]");
    if (phase) phase.textContent = this.state.phase.replaceAll("_", " ");
  }

  _announce(message) {
    const live = this.shadowRoot?.querySelector("[data-live]");
    if (live) live.textContent = message;
  }

  _q21Action(action) {
    const params = parseQ21(this.activeRecord);
    if (action === "play") {
      if (this._reduceMotion) {
        this.state.q21.time = this.state.q21.time < 1 ? 1 : q21State(99, params.divisor).endTime;
        this.render();
      } else {
        this.state.q21.playing = !this.state.q21.playing;
        this.render();
        if (this.state.q21.playing) this._animate("Q21"); else this._stopAnimation();
      }
    } else if (action === "apex") {
      this._stopAnimation(); this.state.q21.time = 1; this.state.q21.playing = false; this.render();
    } else if (action === "continue") {
      this.state.q21.time = Math.max(1, this.state.q21.time);
      if (this._reduceMotion) {
        this.state.q21.time = q21State(99, params.divisor).endTime; this.render();
      } else {
        this.state.q21.playing = true; this.render(); this._animate("Q21");
      }
    } else if (action === "vectors") { this.state.q21.vectors = !this.state.q21.vectors; this.render(); }
    else if (action === "compare") { this.state.q21.compare = !this.state.q21.compare; this.render(); }
  }

  _q26Action(action, angle) {
    if (action === "angle" && ["degree0", "degree1", "atan"].includes(angle)) {
      this.state.q26.angle = angle;
      if (!this.state.attempted && this.state.phase === "INITIAL") this.state.phase = "ATTEMPTING";
      this.render();
    }
  }

  _q23Action(action) {
    const p = parseQ23(this.activeRecord);
    if (action === "play") {
      if (this._reduceMotion) { this.state.q23.time = p.wallTime; this.render(); }
      else {
        this.state.q23.playing = !this.state.q23.playing;
        this.render();
        if (this.state.q23.playing) this._animate("Q23"); else this._stopAnimation();
      }
    } else if (action === "compare") { this.state.q23.compare = !this.state.q23.compare; this.render(); }
    else if (action === "vector") { this.state.q23.vector = !this.state.q23.vector; this.render(); }
  }

  _animate(kind) {
    this._stopAnimation();
    this._lastFrame = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - this._lastFrame) / 1000);
      this._lastFrame = now;
      if (kind === "Q21" && this.state.owner === "Q21" && this.state.q21.playing) {
        const end = q21State(99, parseQ21(this.activeRecord).divisor).endTime;
        this.state.q21.time = Math.min(end, this.state.q21.time + dt * 0.65);
        if (this.state.q21.time >= end) this.state.q21.playing = false;
      } else if (kind === "Q23" && this.state.owner === "Q23" && this.state.q23.playing) {
        const end = parseQ23(this.activeRecord).wallTime;
        this.state.q23.time = Math.min(end, this.state.q23.time + dt * 0.85);
        if (this.state.q23.time >= end) this.state.q23.playing = false;
      } else return;
      this.render();
      if ((kind === "Q21" && this.state.q21.playing) || (kind === "Q23" && this.state.q23.playing)) this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  _stopAnimation(cancel = true) {
    if (cancel && this._raf != null) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  _renderTabs() {
    return `<div class="tabs" role="tablist" aria-label="Projectile-motion sample questions">
      ${ORDER.map((owner) => `<button type="button" role="tab" data-owner="${owner}" aria-selected="${this.state.owner === owner}" tabindex="${this.state.owner === owner ? 0 : -1}"><span>${owner}</span><small>${owner === "Q21" ? "Apex change" : owner === "Q26" ? "Through P" : "Linear drag"}</small></button>`).join("")}
    </div>`;
  }

  _renderIdentity(record) {
    return `<section class="identity" aria-label="Identity and provenance">
      <div class="eyebrow"><span class="candidate">Candidate demo</span><span>${esc(record.exam)} ${esc(record.year)} · ${esc(record.paper)} · Q${esc(record.question_number)}</span></div>
      <p><strong>${this.state.owner}</strong> · <code>${esc(record.id)}</code></p>
      <p class="muted">Repository-owned adapted wording · Core2A sample interface · not an approved Grade 9 learner assignment</p>
    </section>`;
  }

  _renderQuestion(record) {
    const options = this.state.owner === "Q26"
      ? `<fieldset class="options"><legend>Try the choices — select all that apply</legend>${record.options.map((option, index) => {
          const value = String.fromCharCode(65 + index);
          const checked = Array.isArray(this.state.attempt) && this.state.attempt.includes(value);
          const reveal = this.state.solutionOpen;
          const correctSet = new Set((record.answer?.summary?.match(/\b[A-D]\b/g) || []));
          const correct = correctSet.has(value);
          return `<label class="option${reveal ? correct ? " correct" : " incorrect" : ""}"><input type="checkbox" data-option value="${value}" ${checked ? "checked" : ""} ${this.state.attempted ? "disabled" : ""}><span>${esc(option)}</span>${reveal ? `<b>${correct ? "Correct" : "Not selected in the canonical answer"}</b>` : ""}</label>`;
        }).join("")}</fieldset>`
      : `<label class="answer-entry"><span>${this.state.owner === "Q21" ? "Predict n = d′/d" : "Predict wall distance (m)"}</span><input data-attempt-text inputmode="decimal" autocomplete="off" value="${esc(this.state.attempt)}" ${this.state.attempted ? "disabled" : ""} placeholder="Your prediction"></label>`;
    return `<section class="question" aria-labelledby="study-question-title"><div class="section-kicker">Question</div><h2 id="study-question-title">${esc(record.stem)}</h2>${options}<div class="attempt-actions"><button type="button" class="primary" data-action="commit" ${this.state.attempted ? "disabled" : ""}>${this.state.attempted ? "Attempt committed" : "Commit answer"}</button><span class="phase" data-phase>${this.state.phase.replaceAll("_", " ")}</span></div><p class="live" data-live aria-live="polite"></p></section>`;
  }

  _renderSupport(record) {
    const visible = record.scaffolds.slice(0, this.state.supportIndex);
    const blocked = !this.state.attempted && this.state.supportIndex === this._blockedSupportIndex();
    const canReveal = this.state.supportIndex < record.scaffolds.length && !blocked;
    const supportRows = visible.length ? `<ol class="support-list">${visible.map((item,index)=>`<li><span class="step-num">${index+1}</span><div><b>${esc(item.support_kind)}</b><p>${esc(item.text)}</p></div></li>`).join("")}</ol>` : `<p class="muted">Ask only when you need a nudge. These are repository-authored scaffolds, not source hints.</p>`;
    return `<section class="support-card"><div class="section-kicker">Optional support</div><h3>Need a hint?</h3>${supportRows}${canReveal ? `<button type="button" data-action="support">Show next support</button>` : blocked ? `<p class="lock-note">Commit your attempt before the next support step. It touches the protected decision.</p>` : `<p class="muted">All available scaffolds are open.</p>`}</section>`;
  }

  _renderReasoning(record) {
    if (!this.state.attempted) return `<section class="reasoning-card locked"><div class="section-kicker">Reasoning</div><h3>Protected until you try</h3><p>Commit a genuine prediction first. The decisive move and complete answer are not in the page yet.</p></section>`;
    const rows = this._reasoningRows();
    const visible = rows.slice(0, this.state.reasoningIndex);
    const cruxRef = record.answer.crux_move_ref;
    return `<section class="reasoning-card"><div class="section-kicker">Reasoning</div><h3>Build the route</h3>${visible.length ? `<ol class="reasoning-list">${visible.map((move,index)=>{const isCrux=this.state.owner==="Q23"?Boolean(move.crux):move.id===cruxRef;return `<li class="${isCrux?"crux":""}"><span class="step-num">${index+1}</span><div>${isCrux?'<strong class="crux-label">Crux</strong>':`<b>${esc(move.kind)}</b>`}<p>${esc(move.action)}</p></div></li>`;}).join("")}</ol>` : `<p class="muted">Your attempt is committed. Reveal one reasoning move at a time.</p>`}${this.state.reasoningIndex < rows.length ? `<button type="button" data-action="reasoning">Why?</button>` : `<button type="button" data-action="solution" ${this.state.solutionOpen ? "disabled" : ""}>${this.state.solutionOpen ? "Solution open" : "Complete solution"}</button>`}</section>`;
  }

  _renderSolution(record) {
    if (!this.state.solutionOpen) return "";
    return `<section class="solution-card"><div class="section-kicker">Complete solution</div><h3>${esc(answerLabel(record))}</h3><ol>${(record.answer.reasoning || []).map((step)=>`<li>${esc(step)}</li>`).join("")}</ol><button type="button" data-action="check" ${this.state.checked ? "disabled" : ""}>${this.state.checked ? "Checked" : "Independent check"}</button>${this.state.checked ? `<div class="check"><h4>Check / repair</h4><p>${esc(record.answer.check)}</p><p><strong>Common wrong route:</strong> ${esc(record.common_wrong_route)}</p><p class="muted">Repair: return to the last revealed representation or scaffold, then rebuild the route from that physical state.</p></div>` : ""}</section>`;
  }

  render() {
    if (!this.shadowRoot) return;
    if (!this._byOwner.size) {
      this.shadowRoot.innerHTML = `<style>:host{display:block}</style><p role="status">Loading canonical question projection…</p>`;
      return;
    }
    const record = this.activeRecord;
    let stage = "";
    if (this.state.owner === "Q21") stage = renderQ21Stage(this, record);
    if (this.state.owner === "Q26") stage = renderQ26Stage(this, record);
    if (this.state.owner === "Q23") stage = renderQ23Stage(this, record);
    this.shadowRoot.innerHTML = `<style>${STUDY_STYLES}</style><div class="study-shell" data-owner="${this.state.owner}" data-phase-root="${this.state.phase}">${this._renderTabs()}${this._renderIdentity(record)}<div class="study-layout"><main class="primary-pane">${this._renderQuestion(record)}${stage}</main><aside class="support-pane" aria-label="Support and reasoning">${this._renderSupport(record)}${this._renderReasoning(record)}${this._renderSolution(record)}</aside></div></div>`;
  }
}


if (globalThis.customElements && !customElements.get("core2a-projectile-study")) {
  customElements.define("core2a-projectile-study", Core2AProjectileStudy);
}
