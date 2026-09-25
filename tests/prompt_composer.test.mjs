import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { TextEncoder } from 'node:util';

const rootUrl = new URL('../', import.meta.url);
const rootPath = fileURLToPath(rootUrl);
const siteSource = fs.readFileSync(new URL('../public/data/data.js', import.meta.url), 'utf8');
const dataSource = fs.readFileSync(new URL('../public/data/prompt-composer-data.js', import.meta.url), 'utf8');
const appSource = fs.readFileSync(new URL('../public/js/core-prompt-composer.js', import.meta.url), 'utf8');
const fixturePath = 'tests/fixtures/prompt-composer/projectile-stress-set.json';
const fixture = JSON.parse(fs.readFileSync(new URL('./fixtures/prompt-composer/projectile-stress-set.json', import.meta.url), 'utf8'));
const identityFixture = JSON.parse(fs.readFileSync(new URL('./fixtures/prompt-composer/identity-review.json', import.meta.url), 'utf8'));

function runtime() {
  const window = {};
  const context = vm.createContext({ window, globalThis: window, TextEncoder, console });
  vm.runInContext(siteSource, context);
  vm.runInContext(dataSource, context);
  vm.runInContext(appSource, context);
  return window;
}

test('browser digest uses standard SHA-256 vectors', () => {
  const w = runtime();
  assert.equal(
    w.PROMPT_COMPOSER.sha256('abc'),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
  );
  assert.equal(
    w.PROMPT_COMPOSER.sha256(''),
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  );
});

test('browser composition preserves fixed target authority with resolved Q15', () => {
  const w = runtime();
  const result = w.PROMPT_COMPOSER.composeDocument(fixture, w.GRADE9V3_PROMPT_COMPOSER, w.GRADE9V3);
  assert.equal(result.passed, true);
  assert.equal(result.prompt_brief.scope.status, 'OWNER_CONFIRMED_CANONICAL_RUNG');
  const q15 = result.prompt_brief.question_rows.find(row => row.owner_question_id === 'Q15');
  assert.equal(q15.identity_status, 'EXACT_CONFIRMED');
  assert.equal(q15.canonical_question_ref, 'PYQ-PHY-JEEADV-2018-P2-Q08');
  assert.equal(q15.mapping_status, 'CANONICAL_MATCH');
  assert.match(q15.candidate_set_provenance, /uniquely matches/);
  result.prompt_brief.question_rows.forEach(row => {
    assert.equal(row.target_authority, 'OWNER_FIXED');
    assert.equal(row.direct_source_use, 'HOLD');
    assert.equal(row.instructional_demand_use, 'ALLOWED');
    assert.equal(row.assessment_claim, 'HOLD');
  });
  assert.equal(result.prompt_brief.learner_entry.owner_routing_waiver, true);
  assert.equal(result.prompt_brief.learner_entry.readiness_claim_allowed, false);
  assert.equal(result.prompt_brief.target_route_output.seed_rows.length, 5);
  assert.equal(result.prompt_brief.planner_handoff.state, 'READY_FOR_PLANNER');
});

test('browser semantic identity review remains a review state, not a permanent hold', () => {
  const w = runtime();
  const result = w.PROMPT_COMPOSER.composeDocument(identityFixture, w.GRADE9V3_PROMPT_COMPOSER, w.GRADE9V3);
  assert.equal(result.passed, true);
  const row = result.prompt_brief.question_rows[0];
  assert.equal(row.identity_status, 'IDENTITY_REVIEW_REQUIRED');
  assert.equal(row.mapping_status, 'IDENTITY_REVIEW_REQUIRED');
  assert.match(row.candidate_set_provenance, /Owner supplied candidate set/);
  assert.equal(result.prompt_brief.holds.some(h => h.point === 'QUESTION_IDENTITY_AMBIGUOUS'), false);
});

test('browser and Python agree on mapping semantics and deterministic prompt digests', () => {
  const w = runtime();
  const browser = w.PROMPT_COMPOSER.composeDocument(fixture, w.GRADE9V3_PROMPT_COMPOSER, w.GRADE9V3);
  const run = spawnSync('python3', ['Shared/tools/prompt_composer.py', '--input', fixturePath], {cwd: rootPath, encoding:'utf8'});
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const python = JSON.parse(run.stdout);
  assert.equal(browser.prompt_brief.input_digest, python.prompt_brief.input_digest);
  assert.equal(browser.prompt_brief.prompt_digest, python.prompt_brief.prompt_digest);
  assert.equal(browser.prompt_brief.scope.status, python.prompt_brief.scope.status);
  assert.deepEqual(JSON.parse(JSON.stringify(browser.prompt_brief.scope.canonical_primary_rungs)), python.prompt_brief.scope.canonical_primary_rungs);
  assert.deepEqual(
    JSON.parse(JSON.stringify(browser.prompt_brief.question_rows.map(r => [r.canonical_question_ref,r.primary_capability_ref,r.primary_location?.rung||null,r.mapping_status,r.target_authority,r.direct_source_use,r.instructional_demand_use,r.assessment_claim]))),
    python.prompt_brief.question_rows.map(r => [r.canonical_question_ref,r.primary_capability_ref,r.primary_location?.rung||null,r.mapping_status,r.target_authority,r.direct_source_use,r.instructional_demand_use,r.assessment_claim])
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(browser.prompt_brief.trace_rows.map(r => [r.question_ids,r.primary_capability_ref,r.matrix_ref,r.rung,r.status]))),
    python.prompt_brief.trace_rows.map(r => [r.question_ids,r.primary_capability_ref,r.matrix_ref,r.rung,r.status])
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(browser.prompt_brief.target_route_output)),
    python.prompt_brief.target_route_output
  );
});

test('browser prompt emits the blueprint authority graph explicitly', () => {
  const w = runtime();
  const result = w.PROMPT_COMPOSER.composeDocument(fixture, w.GRADE9V3_PROMPT_COMPOSER, w.GRADE9V3);
  assert.match(result.agent_prompt, /\[AUTHORITY_GRAPH\]/);
  assert.match(result.agent_prompt, /Execution order is production control only/);
  assert.match(result.agent_prompt, /A Core2 HOLD does not become academic authority/);
  assert.match(result.agent_prompt, /Demand evidence and learner eligibility are independent states/);
  assert.match(result.agent_prompt, /question\.primary_capability_ref/);
  assert.doesNotMatch(result.agent_prompt, /primary_concept_id/);
  assert.match(result.agent_prompt, /\[TARGET_DEMAND_ROUTING\]/);
  assert.match(result.agent_prompt, /target-demand-route\.schema\.json/);
  assert.match(result.agent_prompt, /Generic easier practice cannot close a fixed target/);
  assert.match(result.agent_prompt, /AUTHORABLE_EXTENSION/);
  assert.match(result.agent_prompt, /Every move needs a coverage ledger/);
  assert.match(result.agent_prompt, /PREPARED requires independent evidence/);
  assert.match(result.agent_prompt, /candidate-set provenance/);
  assert.match(result.agent_prompt, /observable teaching change/);
  assert.match(result.agent_prompt, /\[LEARNER_PRODUCT_QUALITY\]/);
  assert.match(result.agent_prompt, /Route validity and learner-product quality are separate claims/);
  assert.match(result.agent_prompt, /TARGET_MOVE_CONNECTION/);
  assert.match(result.agent_prompt, /Owner routing waiver is ON/);
});

test('pasted hostile markup stays plain parsed data and exact 0 is not blank', () => {
  const w = runtime();
  const rows = w.PROMPT_COMPOSER.parseRows('X | Q-MATH-LINEAR-01 | <script>globalThis.pwned=true</script>');
  assert.equal(rows[0].summary, '<script>globalThis.pwned=true</script>');
  const math = {
    repository_basis: fixture.repository_basis,
    subject: 'Mathematics',
    questions: rows,
    owner_confirmed_rung: {matrix_id:'MATRIX-MATH-LINEAR-EQUATIONS',rung:'R2',by:'owner'},
    learner: {owner_estimate:{knowledge_percentage:0,by:'owner',instruction:'Starting coordinate only; not evidence of prerequisite mastery.'}},
    requested_cores:['CORE1A'],
    execution_order:['CORE1A']
  };
  const result=w.PROMPT_COMPOSER.composeDocument(math,w.GRADE9V3_PROMPT_COMPOSER,w.GRADE9V3);
  assert.equal(result.prompt_brief.learner_entry.owner_estimate.knowledge_percentage,0);
  assert.equal(result.prompt_brief.question_rows[0].summary,'<script>globalThis.pwned=true</script>');
});
