import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import {
  WORKBENCH_API_VERSION,
  WorkbenchRuntime,
  WorkbenchError,
  resolvePlacement,
  validateScene,
} from "../Shared/workbench/runtime.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(here, "fixtures/workbench/arithmetic-division.json");
const fixture = JSON.parse(await readFile(fixturePath, "utf8"));

function divisionAdapter() {
  return {
    evaluateTransfer(request, snapshot) {
      if (request.sourceEntityRef !== "dividend-156" || request.targetRef !== "quotient-first-digit") {
        return { accepted: false, reason: "Choose the partial dividend before deriving this result.", allowedTargets: ["quotient-first-digit"] };
      }
      assert.equal(snapshot.sceneId, fixture.id);
      return {
        accepted: true,
        summary: "The first quotient digit is 1 because 12 fits into 15 once.",
        patch: {
          addEntities: [{
            id: "quotient-digit-1",
            label: "1",
            provenance: { kind: "DERIVED", sourceEntityRefs: ["dividend-156", "divisor-12"] }
          }],
          addProjections: [{
            id: "quotient-digit-1-result",
            entityRef: "quotient-digit-1",
            label: "1",
            representation: "quotient digit",
            placement: { grid: "division-work", row: "result", column: "main" }
          }]
        }
      };
    }
  };
}

function finalStateFor(channel) {
  const runtime = new WorkbenchRuntime(fixture, divisionAdapter());
  runtime.dispatch({ type: "PICK", entityRef: "dividend-156", channel });
  runtime.dispatch({ type: "PREVIEW_TARGET", targetRef: "quotient-first-digit", channel });
  runtime.dispatch({ type: "DROP", targetRef: "quotient-first-digit", channel });
  return runtime.snapshot;
}

test("one semantic entity may have multiple projections and derivation preserves provenance", () => {
  const runtime = new WorkbenchRuntime(fixture, divisionAdapter());
  const sourceProjections = runtime.snapshot.projections.filter((row) => row.entityRef === "dividend-156");
  assert.equal(sourceProjections.length, 2);

  runtime.dispatch({ type: "PICK", entityRef: "dividend-156", channel: "click" });
  const event = runtime.dispatch({ type: "DROP", targetRef: "quotient-first-digit", channel: "click" });
  assert.equal(event.type, "TRANSFER_ACCEPTED");
  const derived = runtime.snapshot.entities.find((row) => row.id === "quotient-digit-1");
  assert.deepEqual(derived.provenance.sourceEntityRefs, ["dividend-156", "divisor-12"]);
  assert.notEqual(derived.id, "dividend-156");
});

test("pointer, click, and keyboard intents commit through the same semantic path", () => {
  const pointer = finalStateFor("pointer");
  const click = finalStateFor("click");
  const keyboard = finalStateFor("keyboard");
  assert.deepEqual(pointer, click);
  assert.deepEqual(click, keyboard);
});

test("invalid domain action is rejected without mutation", () => {
  const runtime = new WorkbenchRuntime(fixture, divisionAdapter());
  runtime.dispatch({ type: "PICK", entityRef: "dividend-156", channel: "keyboard" });
  const before = runtime.snapshot;
  const event = runtime.dispatch({ type: "DROP", targetRef: "remainder-final", channel: "keyboard" });
  assert.equal(event.type, "TRANSFER_REJECTED");
  const after = runtime.snapshot;
  assert.deepEqual(after.entities, before.entities);
  assert.deepEqual(after.projections, before.projections);
  assert.equal(after.revision, before.revision);
});

test("undo restores the exact prior semantic state", () => {
  const runtime = new WorkbenchRuntime(fixture, divisionAdapter());
  const initial = runtime.snapshot;
  runtime.dispatch({ type: "PICK", entityRef: "dividend-156", channel: "click" });
  runtime.dispatch({ type: "DROP", targetRef: "quotient-first-digit", channel: "click" });
  const undo = runtime.dispatch({ type: "UNDO", channel: "keyboard" });
  assert.equal(undo.type, "UNDO_APPLIED");
  const restored = runtime.snapshot;
  assert.deepEqual(restored.entities, initial.entities);
  assert.deepEqual(restored.projections, initial.projections);
  assert.deepEqual(restored.canonicalTransformations, initial.canonicalTransformations);
  assert.equal(restored.interaction.pickedEntityRef, null);
});

test("named logical placement resolves without authored pixel coordinates", () => {
  const placement = fixture.projections[0].placement;
  assert.deepEqual(resolvePlacement(fixture, placement), { grid: "division-work", row: 1, column: 2 });
  const bad = structuredClone(fixture);
  bad.projections[0].placement.x = 120;
  assert.throws(() => validateScene(bad), (error) => error instanceof WorkbenchError && error.code === "WORKBENCH_PIXEL_COORDINATE_FORBIDDEN");
});

test("checkpoint injections remain outside canonical transformations", () => {
  const injections = [{
    id: "estimate-checkpoint",
    kind: "checkpoint",
    afterTransformationRef: "choose-first-quotient-digit",
    prompt: "How many 12s fit into 15 without passing it?"
  }];
  const runtime = new WorkbenchRuntime(fixture, divisionAdapter(), { injections });
  assert.deepEqual(runtime.canonicalTransformations, fixture.canonicalTransformations);
  assert.equal(runtime.injections[0].prompt, injections[0].prompt);
  assert.equal("placement" in runtime.injections[0], false);
});

test("runtime instances are isolated", () => {
  const first = new WorkbenchRuntime(fixture, divisionAdapter());
  const second = new WorkbenchRuntime(fixture, divisionAdapter());
  first.dispatch({ type: "PICK", entityRef: "dividend-156", channel: "click" });
  first.dispatch({ type: "DROP", targetRef: "quotient-first-digit", channel: "click" });
  assert.equal(first.snapshot.entities.length, second.snapshot.entities.length + 1);
  assert.equal(second.snapshot.revision, 0);
});

test("incompatible scenes and malformed adapter patches fail closed", () => {
  const incompatible = structuredClone(fixture);
  incompatible.apiVersion = "9.9.9";
  assert.throws(() => new WorkbenchRuntime(incompatible, divisionAdapter()), (error) => error.code === "WORKBENCH_API_VERSION_MISMATCH");

  const brokenAdapter = {
    evaluateTransfer() {
      return {
        accepted: true,
        patch: {
          addEntities: [{ id: "derived-bad", label: "bad", provenance: { sourceEntityRefs: ["missing-source"] } }],
          addProjections: []
        }
      };
    }
  };
  const runtime = new WorkbenchRuntime(fixture, brokenAdapter);
  runtime.dispatch({ type: "PICK", entityRef: "dividend-156", channel: "click" });
  const before = runtime.snapshot;
  const event = runtime.dispatch({ type: "DROP", targetRef: "quotient-first-digit", channel: "click" });
  assert.equal(event.type, "TRANSFER_REJECTED");
  assert.deepEqual(runtime.snapshot.entities, before.entities);
  assert.equal(runtime.snapshot.revision, before.revision);
});

test("public component uses Shadow DOM and keeps instance state separate", async () => {
  const registry = new Map();
  globalThis.HTMLElement = class {
    attachShadow() {
      const root = {
        innerHTML: "",
        listeners: [],
        addEventListener(type, handler) { this.listeners.push([type, handler]); }
      };
      this.shadowRoot = root;
      return root;
    }
    dispatchEvent() { return true; }
  };
  globalThis.CustomEvent = class { constructor(type, options) { this.type = type; this.detail = options?.detail; } };
  globalThis.customElements = {
    get(name) { return registry.get(name); },
    define(name, ctor) { registry.set(name, ctor); }
  };

  const module = await import(`../Shared/workbench/semantic-workbench.mjs?test=${Date.now()}`);
  assert.equal(registry.get("semantic-workbench"), module.SemanticWorkbench);
  const a = new module.SemanticWorkbench();
  const b = new module.SemanticWorkbench();
  assert.notEqual(a.shadowRoot, b.shadowRoot);
  assert.deepEqual(a.shadowRoot.listeners.map(([type]) => type).sort(), ["click", "focusin", "keydown", "pointerdown", "pointerover", "pointerup"]);
});

assert.equal(WORKBENCH_API_VERSION, "0.1.0");
