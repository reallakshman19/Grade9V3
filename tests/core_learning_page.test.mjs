import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import {
  CORE_PROJECTION_CONTRACT_VERSION,
  CoreLearningPageError,
  deriveCoreLearningState,
  renderCoreLearningProjection,
  validateCoreProjection,
} from "../Shared/workbench/core-learning-page.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(here, "fixtures/workbench/core-learning-projections.json");
const fixtures = JSON.parse(await readFile(fixturePath, "utf8")).projections;
const byId = Object.fromEntries(fixtures.map((row) => [row.id, row]));

test("frozen CoreProjection fixtures derive the contract-defined initial states", () => {
  const expected = {
    core1a: ["CORE1A", "CONSTRUCTION_VISIBLE", true, false],
    core1b: ["CORE1B", "AWAITING_ATTEMPT", false, false],
    core2a: ["CORE2A", "QUESTION_VISIBLE", false, true],
    core2b: ["CORE2B", "AWAITING_ATTEMPT", false, true],
  };

  for (const [id, [core, stage, reconstructionVisible, questionVisible]] of Object.entries(expected)) {
    const state = deriveCoreLearningState(byId[id]);
    assert.equal(state.contractVersion, CORE_PROJECTION_CONTRACT_VERSION);
    assert.equal(state.core, core);
    assert.equal(state.stage, stage);
    assert.equal(state.reconstructionVisible, reconstructionVisible);
    assert.equal(state.questionVisible, questionVisible);
    assert.equal(state.attempted, false);
  }
});

test("initial state follows supplied presentation policy rather than subject or identifier text", () => {
  const left = structuredClone(byId.core1a);
  const right = structuredClone(byId.core1a);

  left.core = "CORE1A";
  left.concept.microtopic_ref = "MIC-ALPHA";
  left.concept.inferential_jump = "Alpha supplied relation.";

  right.core = "CORE2A";
  right.concept.microtopic_ref = "MIC-BETA";
  right.concept.inferential_jump = "Beta supplied relation.";

  const leftState = deriveCoreLearningState(left);
  const rightState = deriveCoreLearningState(right);
  assert.equal(leftState.stage, "CONSTRUCTION_VISIBLE");
  assert.equal(rightState.stage, "CONSTRUCTION_VISIBLE");
  assert.equal(leftState.reconstructionVisible, rightState.reconstructionVisible);
});

test("projection validation fails closed on unsupported or incomplete envelopes", () => {
  const badVersion = structuredClone(byId.core1a);
  badVersion.contract_version = "2.0";
  assert.throws(
    () => validateCoreProjection(badVersion),
    (error) => error instanceof CoreLearningPageError
      && error.code === "CORE_PROJECTION_VERSION_UNSUPPORTED",
  );

  const badCore = structuredClone(byId.core1a);
  badCore.core = "CORE3";
  assert.throws(
    () => validateCoreProjection(badCore),
    (error) => error instanceof CoreLearningPageError
      && error.code === "CORE_PROJECTION_CORE_UNSUPPORTED",
  );

  const missingPolicy = structuredClone(byId.core1a);
  delete missingPolicy.presentation.attempt_before_reveal;
  assert.throws(
    () => validateCoreProjection(missingPolicy),
    (error) => error instanceof CoreLearningPageError
      && error.code === "CORE_PROJECTION_ATTEMPT_POLICY_REQUIRED",
  );
});

test("rendering uses supplied projection text and keeps unrevealed construction locked", () => {
  const core1a = renderCoreLearningProjection(byId.core1a);
  assert.match(core1a, /data-core="CORE1A"/);
  assert.match(core1a, /Read the supplied representation/);
  assert.doesNotMatch(core1a, /Construction is not revealed/);

  const core1b = renderCoreLearningProjection(byId.core1b);
  assert.match(core1b, /data-stage="AWAITING_ATTEMPT"/);
  assert.match(core1b, /Construction is not revealed in the initial state/);
  assert.doesNotMatch(core1b, /Read the supplied representation/);

  const core2a = renderCoreLearningProjection(byId.core2a);
  assert.match(core2a, /Use the supplied representation to decide the next valid move/);
  assert.match(core2a, /data-stage="QUESTION_VISIBLE"/);
});

test("generic learner-shell source contains no subject-specific or mastery routing vocabulary", async () => {
  const source = await readFile(resolve(here, "../Shared/workbench/core-learning-page.mjs"), "utf8");
  for (const forbidden of [
    /Physics\//i,
    /projectile/i,
    /friction/i,
    /motion[- ]?2d/i,
    /mastery/i,
    /proficien/i,
    /knowledge percentage/i,
  ]) {
    assert.doesNotMatch(source, forbidden);
  }
});

test("public custom element registers and keeps projection state instance-local", async () => {
  const oldHTMLElement = globalThis.HTMLElement;
  const oldCustomElements = globalThis.customElements;
  const registry = new Map();

  globalThis.HTMLElement = class {
    attachShadow() {
      const root = { innerHTML: "" };
      this.shadowRoot = root;
      return root;
    }
  };
  globalThis.customElements = {
    get(name) { return registry.get(name); },
    define(name, ctor) { registry.set(name, ctor); },
  };

  try {
    const module = await import(`../Shared/workbench/core-learning-page.mjs?custom-element=${Date.now()}`);
    assert.equal(registry.get("core-learning-page"), module.CoreLearningPage);

    const first = new module.CoreLearningPage();
    const second = new module.CoreLearningPage();
    first.projection = byId.core1a;
    second.projection = byId.core2a;

    assert.equal(first.state.stage, "CONSTRUCTION_VISIBLE");
    assert.equal(second.state.stage, "QUESTION_VISIBLE");
    assert.notEqual(first.shadowRoot, second.shadowRoot);
    assert.match(first.shadowRoot.innerHTML, /CORE1A/);
    assert.match(second.shadowRoot.innerHTML, /CORE2A/);

    const returned = first.projection;
    returned.core = "CORE2B";
    assert.equal(first.projection.core, "CORE1A");
  } finally {
    if (oldHTMLElement === undefined) delete globalThis.HTMLElement;
    else globalThis.HTMLElement = oldHTMLElement;
    if (oldCustomElements === undefined) delete globalThis.customElements;
    else globalThis.customElements = oldCustomElements;
  }
});
