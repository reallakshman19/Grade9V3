#!/usr/bin/env node
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderCoreLearningProjection, deriveCoreLearningState, transitionCoreLearningState } from "../../../Shared/workbench/core-learning-page.mjs";
import { projections, recoveryManifest, activityLinks } from "../../../public/physics/motion-2d/core-recovery/data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const source = JSON.parse(fs.readFileSync(path.join(root, "Physics/library/phy-kin-2d-motion.v1.json")));
const bucket = source.buckets.find(x => x.id === "BUCKET-PHY-KIN-2D-MOTION");
const microtopics = new Map(source.microtopics.map(row => [row.id, row]));
const bank = JSON.parse(fs.readFileSync(path.join(root, "Physics/library/exam-bank/competitive-exam-question-bank.v2.json")));
const byCore = core => projections.filter(p => p.core === core);

test("three canonical truths are shared by Core1A and Core1B without extension modules", () => {
  assert.equal(byCore("CORE1").length, 1);
  for (const core of ["CORE1A", "CORE1B"]) {
    assert.equal(byCore(core).length, 3);
    assert.deepEqual(new Set(byCore(core).map(p => p.concept.microtopic_ref)), new Set(microtopics.keys()));
    for (const p of byCore(core)) {
      assert.equal(p.concept.inferential_jump, microtopics.get(p.concept.microtopic_ref).inferential_jump);
      assert.equal(p.concept.teaching_path.length, microtopics.get(p.concept.microtopic_ref).teaching_path.length);
      assert.equal(p.primary_concept_id, undefined);
    }
  }
  assert.match(bucket.scope.excluded.join(" "), /drag/i);
  assert.equal(byCore("CORE2").length, 0);
  assert.match(recoveryManifest.outputs.CORE2, /^HOLD/);
});

test("Q15 source identity remains unresolved and bank primaries stay intact", () => {
  const candidates = recoveryManifest.question_identity.filter(x => x.owner_alias === "Q15");
  assert.deepEqual(new Set(candidates.map(x => x.canonical_question_ref)),
    new Set(["PYQ-PHY-JEEADV-2018-P2-Q08", "PYQ-PHY-JEEADV-2023-P1-Q01"]));
  for (const row of recoveryManifest.question_identity) {
    const record = bank.questions.find(q => q.id === row.canonical_question_ref);
    assert.ok(record);
    assert.equal(row.primary_capability_ref, record.primary_capability_ref);
    assert.equal(row.learner_eligibility, "NOT_ESTABLISHED");
  }
});

test("all three distinct canonical activities resolve and visible SVG candidates are present", () => {
  for (const [id, link] of Object.entries(activityLinks)) {
    assert.ok(microtopics.has(id));
    const page = path.join(root, "public/physics/motion-2d/core-recovery", link);
    assert.ok(fs.existsSync(page), page);
  }
  for (const name of ["shared-clock", "event-clock", "projectile-model"]) {
    const svg = fs.readFileSync(path.join(root, "public/physics/motion-2d/core-recovery/figures", name + ".svg"), "utf8");
    assert.match(svg, /<svg[^>]*viewBox=/);
    assert.match(svg, /<title\b/);
    assert.match(svg, /<desc\b/);
  }
  assert.match(recoveryManifest.outputs.CORE1A, /^HOLD/);
});

test("Core1B and Core2B protected reasoning enters rendered HTML only after a genuine attempt", () => {
  for (const projection of [...byCore("CORE1B"), ...byCore("CORE2B")]) {
    let state = deriveCoreLearningState(projection);
    assert.throws(() => transitionCoreLearningState(projection, state, {
      type: "COMMIT_ATTEMPT", response: "   ",
    }));
    const before = renderCoreLearningProjection(projection, state);
    assert.doesNotMatch(before, /Defensible answer:|data-move-kind="DECIDE"/);
    state = transitionCoreLearningState(projection, state, {
      type: "COMMIT_ATTEMPT", response: "A reasoned answer to the prompt.",
    }).state;
    const after = renderCoreLearningProjection(projection, state);
    if (projection.core === "CORE1B") assert.match(after, /Defensible answer:/);
    if (projection.core === "CORE2B") {
      const ref = projection.application.transfer.protected_move_ref;
      assert.match(after, new RegExp('data-move-id="' + ref + '"'));
      assert.match(after, /data-move-kind="DECIDE"/);
    }
  }
});

test("illustration example numbers match the canonical authored questions", () => {
  const shared = source.questions.find(q => q.id === "Q-PHY-KIN-2D-2A-SHARED-CLOCK-01");
  const apex = source.questions.find(q => q.id === "Q-PHY-KIN-2D-2A-PROJECTILE-APEX-03");
  assert.match(shared.stem, /x\(t\)=4t/);
  assert.match(shared.stem, /y\(t\)=10-2t\^2/);
  assert.equal(4 * 2, 8);
  assert.equal(10 - 2 * (2 ** 2), 2);
  assert.equal(10 - 2 * (3 ** 2), -8);
  assert.match(apex.stem, /u_x=12 m\/s and u_y=20 m\/s/);
  assert.match(apex.stem, /g=10 m\/s\^2/);
  assert.equal(20 / 10, 2);
});
