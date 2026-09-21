export const CORE_LEARNING_PAGE_TAG = "core-learning-page";
export const CORE_PROJECTION_CONTRACT_VERSION = "1.0";

const CORE_MODES = new Set(["CORE1A", "CORE1B", "CORE2A", "CORE2B"]);
const clone = (value) => JSON.parse(JSON.stringify(value));

export class CoreLearningPageError extends Error {
  constructor(code, detail = "") {
    super(detail ? `${code}: ${detail}` : code);
    this.name = "CoreLearningPageError";
    this.code = code;
    this.detail = detail;
  }
}

function requireCondition(condition, code, detail = "") {
  if (!condition) throw new CoreLearningPageError(code, detail);
}

function requireObject(value, code, detail = "") {
  requireCondition(value && typeof value === "object" && !Array.isArray(value), code, detail);
  return value;
}

function requireString(value, code, detail = "") {
  requireCondition(typeof value === "string" && value.trim().length > 0, code, detail);
  return value;
}

function optionalArray(value, code, detail = "") {
  if (value == null) return [];
  requireCondition(Array.isArray(value), code, detail);
  return value;
}

export function validateCoreProjection(input) {
  const projection = clone(input);
  requireObject(projection, "CORE_PROJECTION_REQUIRED");
  requireCondition(
    projection.contract_version === CORE_PROJECTION_CONTRACT_VERSION,
    "CORE_PROJECTION_VERSION_UNSUPPORTED",
    String(projection.contract_version),
  );
  requireCondition(CORE_MODES.has(projection.core), "CORE_PROJECTION_CORE_UNSUPPORTED", String(projection.core));

  projection.concept = requireObject(projection.concept, "CORE_PROJECTION_CONCEPT_REQUIRED");
  projection.application = requireObject(projection.application, "CORE_PROJECTION_APPLICATION_REQUIRED");
  projection.presentation = requireObject(projection.presentation, "CORE_PROJECTION_PRESENTATION_REQUIRED");

  requireString(projection.concept.microtopic_ref, "CORE_PROJECTION_MICROTOPIC_REF_REQUIRED");
  requireString(projection.concept.inferential_jump, "CORE_PROJECTION_INFERENTIAL_JUMP_REQUIRED");
  projection.concept.teaching_path = optionalArray(
    projection.concept.teaching_path,
    "CORE_PROJECTION_TEACHING_PATH_INVALID",
    projection.concept.microtopic_ref,
  );
  projection.concept.misconceptions = optionalArray(
    projection.concept.misconceptions,
    "CORE_PROJECTION_MISCONCEPTIONS_INVALID",
    projection.concept.microtopic_ref,
  );
  projection.concept.representation_refs = optionalArray(
    projection.concept.representation_refs,
    "CORE_PROJECTION_REPRESENTATION_REFS_INVALID",
    projection.concept.microtopic_ref,
  );

  if (projection.application.question_ref != null) {
    requireString(projection.application.question_ref, "CORE_PROJECTION_QUESTION_REF_INVALID");
  }
  if (projection.application.family_ref != null) {
    requireString(projection.application.family_ref, "CORE_PROJECTION_FAMILY_REF_INVALID");
  }
  projection.application.reasoning_route = optionalArray(
    projection.application.reasoning_route,
    "CORE_PROJECTION_REASONING_ROUTE_INVALID",
  );
  projection.application.hints = optionalArray(
    projection.application.hints,
    "CORE_PROJECTION_HINTS_INVALID",
  );
  projection.application.scaffolds = optionalArray(
    projection.application.scaffolds,
    "CORE_PROJECTION_SCAFFOLDS_INVALID",
  );

  requireCondition(
    typeof projection.presentation.attempt_before_reveal === "boolean",
    "CORE_PROJECTION_ATTEMPT_POLICY_REQUIRED",
  );
  requireCondition(
    typeof projection.presentation.show_full_construction === "boolean",
    "CORE_PROJECTION_CONSTRUCTION_POLICY_REQUIRED",
  );
  projection.presentation.protected_move_refs = optionalArray(
    projection.presentation.protected_move_refs,
    "CORE_PROJECTION_PROTECTED_MOVES_INVALID",
  );

  return projection;
}

export function deriveCoreLearningState(input) {
  const projection = validateCoreProjection(input);
  let stage = "ORIENTATION";
  if (projection.presentation.attempt_before_reveal) stage = "AWAITING_ATTEMPT";
  else if (projection.presentation.show_full_construction) stage = "CONSTRUCTION_VISIBLE";
  else if (projection.application.question_ref) stage = "QUESTION_VISIBLE";

  return {
    contractVersion: projection.contract_version,
    core: projection.core,
    stage,
    attempted: false,
    reconstructionVisible: stage === "CONSTRUCTION_VISIBLE",
    questionVisible: Boolean(projection.application.question_ref),
    protectedMoveRefs: clone(projection.presentation.protected_move_refs),
    initialVisualRef: projection.presentation.initial_visual_ref ?? null,
    initialVisualStageRef: projection.presentation.initial_visual_stage_ref ?? null,
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderTeachingPath(path) {
  if (!path.length) return '<p class="empty">No construction steps supplied.</p>';
  return `<ol class="construction">${path.map((step) => {
    const action = escapeHtml(step?.action ?? "");
    const why = step?.why_valid ? `<small>${escapeHtml(step.why_valid)}</small>` : "";
    return `<li><span>${action}</span>${why}</li>`;
  }).join("")}</ol>`;
}

export function renderCoreLearningProjection(input) {
  const projection = validateCoreProjection(input);
  const state = deriveCoreLearningState(projection);
  const construction = state.reconstructionVisible
    ? renderTeachingPath(projection.concept.teaching_path)
    : '<p class="locked">Construction is not revealed in the initial state.</p>';
  const question = state.questionVisible
    ? `<section class="question" aria-labelledby="core-question-title">
        <h3 id="core-question-title">Try</h3>
        <p>${escapeHtml(projection.application.stem ?? "")}</p>
      </section>`
    : "";

  return `<style>
    :host { display:block; font:inherit; color:inherit; }
    .shell { display:grid; gap:1rem; max-width:72rem; margin:0 auto; }
    .orientation,.concept,.question,.construction-panel { border:1px solid currentColor; border-radius:.75rem; padding:1rem; }
    .eyebrow { font-size:.8rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; }
    h2,h3,p { margin:.25rem 0 .75rem; }
    ol { margin:.5rem 0 0; padding-left:1.25rem; }
    li + li { margin-top:.65rem; }
    small { display:block; margin-top:.2rem; opacity:.8; }
    .status { font-weight:600; }
    @media (max-width: 36rem) { .orientation,.concept,.question,.construction-panel { padding:.75rem; } }
  </style>
  <article class="shell" data-core="${escapeHtml(projection.core)}" data-stage="${escapeHtml(state.stage)}">
    <header class="orientation">
      <div class="eyebrow">${escapeHtml(projection.core)}</div>
      <h2>Current learning target</h2>
      <p class="status">${escapeHtml(state.stage.replaceAll("_", " ").toLowerCase())}</p>
    </header>
    <section class="concept" aria-labelledby="core-concept-title">
      <h3 id="core-concept-title">Concept target</h3>
      <p>${escapeHtml(projection.concept.inferential_jump)}</p>
    </section>
    ${question}
    <section class="construction-panel" aria-labelledby="core-construction-title">
      <h3 id="core-construction-title">Construction</h3>
      ${construction}
    </section>
  </article>`;
}

const HTMLElementBase = globalThis.HTMLElement || class {};

export class CoreLearningPage extends HTMLElementBase {
  constructor() {
    super();
    this._projection = null;
    this._state = null;
    if (typeof this.attachShadow === "function") this.attachShadow({ mode: "open" });
  }

  set projection(value) {
    const projection = validateCoreProjection(value);
    this._projection = projection;
    this._state = deriveCoreLearningState(projection);
    this._render();
  }

  get projection() {
    return this._projection ? clone(this._projection) : null;
  }

  get state() {
    return this._state ? clone(this._state) : null;
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (!this.shadowRoot) return;
    if (!this._projection) {
      this.shadowRoot.innerHTML = '<p role="status">Core learning page requires a projection.</p>';
      return;
    }
    this.shadowRoot.innerHTML = renderCoreLearningProjection(this._projection);
  }
}

if (globalThis.customElements && !globalThis.customElements.get(CORE_LEARNING_PAGE_TAG)) {
  globalThis.customElements.define(CORE_LEARNING_PAGE_TAG, CoreLearningPage);
}
