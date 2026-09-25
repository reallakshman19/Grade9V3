#!/usr/bin/env node
// Issue #274: derive a reader prototype from existing canonical records.
// This file produces a presentation projection; it does not create academic authority.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { validateCoreProjection } from "../../../Shared/workbench/core-learning-page.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const packagePath = path.join(root, "Physics/library/phy-kin-2d-motion.v1.json");
const bankPath = path.join(root, "Physics/library/exam-bank/competitive-exam-question-bank.v2.json");
const rendererPath = path.join(root, "Shared/workbench/core-learning-page.mjs");
const destination = path.join(root, "public/physics/motion-2d/core-recovery");
const source = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const bucket = source.buckets.find(row => row.id === "BUCKET-PHY-KIN-2D-MOTION");
if (!bucket || source.microtopics.length !== 3) throw new Error("Unexpected canonical Motion-in-2D scope");
const byId = rows => new Map(rows.map(row => [row.id, row]));
const representations = byId(source.representations);
const relations = byId(source.relations);
const resources = byId(source.resources);
const questions = source.questions;
const ids = [
  "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
  "MIC-PHY-KIN-2D-CONSTANT-ACCELERATION",
  "MIC-PHY-KIN-PROJECTILE-MODEL",
];
const microtopics = ids.map(id => {
  const row = source.microtopics.find(item => item.id === id);
  if (!row) throw new Error("Canonical microtopic missing: " + id);
  return row;
});
const checks = row => row.relation_refs.flatMap(ref => relations.get(ref)?.checks ?? []);
const repData = row => row.representation_refs.map(ref => {
  const rep = representations.get(ref);
  if (!rep) throw new Error("Unknown representation " + ref);
  return { ...rep, representation_ref: rep.id };
});
const concept = row => ({
  microtopic_ref: row.id,
  title: row.title,
  inferential_jump: row.inferential_jump,
  entry_assumptions: row.entry_assumptions,
  teaching_path: row.teaching_path,
  elicitation: row.elicitation,
  misconceptions: row.misconceptions,
  representation_refs: row.representation_refs,
  representations: repData(row),
  relation_checks: checks(row),
  exit_task: row.exit_task,
  // No CORE1A worked-question exposure is in the current package. Do not forge one.
  worked_anchors: [],
});
const presentation = (core, extra = {}) => ({
  attempt_before_reveal: core === "CORE1B" || core === "CORE2B",
  show_full_construction: core === "CORE1A",
  show_solution_initially: false,
  protected_move_refs: [],
  ...extra,
});
const records = [];
records.push(validateCoreProjection({
  id: "CORE1-KIN-2D-ORIENTATION",
  core: "CORE1",
  contract_version: "1.0",
  orientation: {
    bucket_ref: bucket.id,
    title: bucket.title,
    blocks: [
      { id: "scope", kind: "TEXT", text: bucket.scope.covers },
      ...bucket.conventions.map(c => ({ id: c.id, kind: "TEXT", text: c.statement })),
      ...source.relations.filter(rel => rel.id === "REL-PROJECTILE-COMPONENT-MODEL").map(rel => ({
        id: rel.id, kind: "TEXT",
        text: rel.meaning + " Conditions: " + rel.conditions.join(" "),
      })),
      { id: "limits", kind: "TEXT", text: "Outside this packet: " + bucket.scope.excluded.join(" ") },
    ],
  },
  presentation: presentation("CORE1"),
}));
for (const row of microtopics) {
  for (const core of ["CORE1A", "CORE1B"]) {
    records.push(validateCoreProjection({
      id: core + "-" + row.id,
      core,
      contract_version: "1.0",
      concept: concept(row),
      presentation: presentation(core, {
        initial_visual_ref: row.representation_refs[0],
        initial_visual_stage_ref: representations.get(row.representation_refs[0])?.reveal_stages?.[0]?.id,
      }),
    }));
  }
}
const chosen = [
  ["CORE2A", "Q-PHY-KIN-2D-2A-SHARED-CLOCK-01"],
  ["CORE2A", "Q-PHY-KIN-2D-2A-CONSTANT-ACCEL-02"],
  ["CORE2A", "Q-PHY-KIN-2D-2A-PROJECTILE-APEX-03"],
  ["CORE2B", "Q-PHY-KIN-2D-2B-REPRESENTATION-01"],
  ["CORE2B", "Q-PHY-KIN-2D-2B-MODEL-VALIDITY-02"],
  ["CORE2B", "Q-PHY-KIN-2D-2B-PROJECTILE-VALIDITY-04"],
];
for (const [core, id] of chosen) {
  const question = questions.find(row => row.id === id);
  if (!question) throw new Error("Canonical question missing: " + id);
  const row = microtopics.find(m => m.primary_capability_ref === question.primary_capability_ref);
  if (!row) throw new Error("Question primary capability has no selected microtopic: " + id);
  const a = question.answer;
  const protectedMove = question.transfer?.protected_move_ref;
  const projection = {
    id: core + "-" + id, core, contract_version: "1.0",
    concept: concept(row),
    application: {
      question_ref: id,
      family_ref: question.family_ref,
      stem: question.stem,
      source_refs: question.source_refs,
      origin: question.origin,
      original_number: question.original_identifier,
      subparts: question.subparts,
      options: question.options,
      conditions: question.conditions,
      figure_refs: question.figure_refs,
      hints: question.hints,
      scaffolds: question.scaffolds,
      reasoning_route: a.reasoning_route,
      crux_move_ref: a.crux_move_ref,
      transfer: question.transfer,
      check: a.check,
      solution: { summary: a.summary, steps: a.reasoning, rubric: a.rubric ?? [] },
      repair: question.repair_ref ? { step_ref: question.repair_ref } : null,
    },
    presentation: presentation(core, {
      protected_move_refs: protectedMove ? [protectedMove] : [],
      pre_attempt_scaffold_limit: core === "CORE2B" ? (question.scaffolds?.length ?? 0) : 0,
    }),
  };
  records.push(validateCoreProjection(projection));
}
const bankIds = [
  ["Q28", "PYQ-PHY-JEEMAIN-2026-04APR-S2-Q29"],
  ["Q15", "PYQ-PHY-JEEADV-2018-P2-Q08"],
  ["Q15", "PYQ-PHY-JEEADV-2023-P1-Q01"],
  ["Q21", "PYQ-PHY-JEEADV-2022-P1-Q08"],
  ["Q26", "PYQ-PHY-JEEADV-2026-P1-Q06"],
  ["Q23", "PYQ-PHY-JEEADV-2025-P2-Q15"],
];
const demandEvidence = bankIds.map(([alias, id]) => {
  const row = bank.questions.find(q => q.id === id);
  if (!row) throw new Error("Missing bank question " + id);
  return {
    owner_alias: alias,
    canonical_question_ref: id,
    original_identifier: row.original_identifier,
    primary_capability_ref: row.primary_capability_ref,
    wording_custody: row.extensions?.source_custody?.wording_custody ?? "BANK_RECORD_ONLY",
    bank_status: row.status,
    disposition: alias === "Q15" ? "IDENTITY_HOLD" : "DIAGNOSTIC_ONLY",
    learner_eligibility: "NOT_ESTABLISHED",
  };
});
const activityLinks = Object.fromEntries(microtopics.map(row => {
  const refs = row.representation_refs.flatMap(ref => representations.get(ref)?.interactive_resource_refs ?? []);
  const resource = resources.get(refs.at(-1));
  if (!resource?.locator?.startsWith("public/physics/motion-2d/explorers/")) {
    throw new Error("Canonical activity locator unavailable: " + row.id);
  }
  return [row.id, "../" + resource.locator.split("/explorers/")[1].replace(/^/, "explorers/")];
}));
const sha256 = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const manifest = {
  issue: 274,
  source_main_sha: "7982850a5d5d5ed133e3098522a889b89f1fc54a",
  renderer_draft_head: "97005291accdfd85ea07f6b8e40693714334bd9d",
  generated_by: "Physics/content/projectile-core-recovery/build.mjs",
  source_package: path.relative(root, packagePath),
  source_sha256: sha256(packagePath),
  bank_sha256: sha256(bankPath),
  renderer_sha256: sha256(rendererPath),
  outputs: {
    CORE1: "CANDIDATE_LEARNER_PREVIEW",
    CORE1A: "HOLD_WORKED_ANCHOR_AND_SCENE_BINDING",
    CORE1B: "CANDIDATE_INTERACTIVE_RECONSTRUCTION",
    CORE2: "HOLD_ORDINARY_SOURCE_CUSTODY",
    CORE2A: "CANDIDATE_INHERITED_HOLD",
    CORE2B: "CANDIDATE_INHERITED_HOLD",
  },
  question_identity: demandEvidence,
  holds: [
    "Core2 has no authorized ordinary source corpus for this bucket.",
    "Core1A has no canonical questions exposed as worked conceptual anchors.",
    "Event-clock and projectile-model representations lack canonical scene instances.",
    "Q15 source identity is ambiguous: 2018 P2 Q08 and 2023 P1 Q01 are different items.",
    "Five competitive-bank anchors are diagnostic evidence, not an accepted learner question set.",
    "PDF publication belongs to issue #273 and has not been validated.",
  ],
};
fs.mkdirSync(destination, { recursive: true });
const data = "export const projections = " + JSON.stringify(records, null, 2) +
  ";\nexport const recoveryManifest = " + JSON.stringify(manifest, null, 2) +
  ";\nexport const activityLinks = " + JSON.stringify(activityLinks, null, 2) + ";\n";
fs.writeFileSync(path.join(destination, "data.mjs"), data);
manifest.data_sha256 = sha256(path.join(destination, "data.mjs"));
fs.writeFileSync(path.join(destination, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log("Wrote " + path.relative(root, destination) + ": " + records.length +
  " role projections; CORE2 stays HOLD.");
