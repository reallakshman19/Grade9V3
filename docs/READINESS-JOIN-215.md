# Issue #215 — Core → Atlas → standalone visual readiness join

This report is the reviewer-facing evidence index for the final #210 readiness join. It is not a second academic source of truth.

## Material basis

- Programme parent: #210
- Integration issue: #215
- Delivery PR: #237
- Current-main basis used by the implementation: `11cdfdc95f265393829fd2ef3fe359b2961dd6c3`
- #232 resolution already present on that main: merged PR #235
- Joined-test validation material head: `9f88ae7e65495ecada2ae582d0f553642cfa1974`
- Guardrails run on that head: `35956051835`
- V3.1 run on that head: `35956051769`
- V3.1 recorder basis used for execution planning: `reallaksh19/Common@29c3c123029c56307a92818a6fd3b9176240f7d7`

The exact final PR head is recorded in #215's provider evidence after the report-only update and readback. Embedding a commit's own final SHA inside this tracked file would itself create a different commit; the durable issue/PR evidence binds the final head without that self-reference problem.

An unmerged PR does not establish #210 completion.

## Canonical positive chain

| Hop | Canonical identity | Authority / observation |
| --- | --- | --- |
| Atlas selection | `MATRIX-PHY-KIN-2D-MOTION / R1` | canonical matrix/rung record + real-browser selection |
| Microtopic | `MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS` | R1 `microtopic_ref` |
| Capability | `CAP-KIN-2D-INDEPENDENT-COMPONENTS` | AtlasIndex source-derived capability ref |
| Core1B | `physics:mic-phy-kin-2d-independent-components:core1b` | generated Core projection reached from Atlas action |
| Representation | `REP-KIN-2D-SHARED-CLOCK` | R1 representation ref |
| Resource | `ACT-KIN-2D-SHARED-CLOCK` | R1 activity ref / visual target |
| Portable package | `portable-motion-shared-clock` | AtlasIndex 2.0 visual target carried into all hosts |

Separate protected-decision witness:

`physics:q-phy-kin-2d-2b-projectile-validity-04:core2b`
→ source question `Q-PHY-KIN-2D-2B-PROJECTILE-VALIDITY-04`
→ protected decision `R-KIN-TRANSFER-MODEL`.

The Core2B witness is deliberately not treated as the rung's academic identity.

## Joined executable oracle

`tests/readiness_join_215.test.mjs` executes one coherent browser journey.  
`tests/test_readiness_join_215.py` is only the thin unittest/CI adapter that makes the browser oracle part of the repository's full guardrail discovery.

Observed on `9f88ae7e65495ecada2ae582d0f553642cfa1974`:

1. Motion R1 is selected by keyboard with exact `(matrix_id, rung)`.
2. AtlasIndex 2.0 row, visual target and rendered Core/portable actions agree on the same canonical IDs.
3. Core1B starts in `AWAITING_ATTEMPT`; reconstruction is absent before learner commitment and visible after one committed attempt.
4. Core2B keeps the protected changed decision absent before commitment and reveals it afterward.
5. The portable package ID captured at the Atlas boundary is reused rather than rediscovered from a title.
6. Same-time reconstruction emits ACCEPT, advances revision and exposes simultaneous-state text.
7. Mixed-time reconstruction emits REJECT, does not advance revision and retains the authored “single physical state” reason.
8. ACCEPT and REJECT event payloads are equal across repository, external-host fixture and standalone host.
9. Keyboard-only completion succeeds; the focused/active semantic entity has a visible outline treatment; essential simultaneity meaning is present in text.
10. Direct `file://` standalone loading uses the same package and reports zero runtime resource fetches.
11. Motion R999 yields `ATLAS_TARGET_NOT_FOUND` with zero enabled Core/visual/portable actions.
12. Mathematics R1 preserves its real representation availability while Core/activity/portable/standalone remain explicitly unavailable.

### Exact remote execution

Full guardrails at `9f88ae7...`:

- generated-artifact freshness: **PASS**
- joined #215 browser wrapper: **PASS**
- full discovery: **1127 tests**
- failures: **2**
- both remaining failures are the already-tracked #233 and #234 debts
- no #215 test failure was observed

The relevant log line is:

`test_joined_atlas_core_portable_browser_contract (...) ... ok`

## P1–P5 evidence matrix

| Item | Status | Observation | Oracle | Failure origin | Evidence |
| --- | --- | --- | --- | --- | --- |
| P1 — AtlasIndex 2.0 | PASS | remote execution + source inspection | independent source reproduction | N/A | merged #220/#230; source-derived R1 assertions; joined browser oracle |
| P2 — Atlas browser | PASS | remote real-browser execution | executable browser oracle | N/A | merged #231 + joined keyboard/fail-closed/contrast path |
| P3 — Core | PASS | remote real-browser execution + source inspection | executable reveal/protection oracle | N/A | Core1B attempt ordering + separate Core2B protected-decision check in joined oracle |
| P4 — portable visual | PASS | remote real-browser execution | cross-host semantic parity + direct-file offline check | N/A | same-time ACCEPT / mixed-time REJECT; repository/external/standalone event equality |
| #215 joined oracle | PASS | remote real-browser execution | cross-surface executable oracle | N/A | `test_readiness_join_215.ReadinessJoin215BrowserRuntimeTest...` PASS |
| P5 — repository | FAIL | exact-head remote execution | generated freshness + full discovery | PREEXISTING | #233 and #234 remain; 1127 tests / 2 failures |

## P5 producer classification

### #232 — RESOLVED_BY_PR / present on main

PR #235 is merged into current `main@11cdfdc95f265393829fd2ef3fe359b2961dd6c3`.

The missing `FAL-CIRC-SYMBOL-NO-UNIT` mutation is now registered, generated freshness is current, and the declared falsifier passes. It is no longer a current P5 failure.

### #233 — PREEXISTING

The remaining owner-extension expectation test still fails:

`test_owner_extensions_do_not_claim_curriculum_authority`

The failure belongs to #233; #215 does not repair curriculum-authority expectations inside the integration lane.

### #234 — PREEXISTING

The remaining depiction backlog test still fails:

`test_unbuilt_kind_backlog_is_reported_without_claiming_a_renderer`

Observed canonical report: 4 waiting FREE_BODY_DIAGRAM representations across 2 buckets.  
Stale expected oracle: 3 representations across 2 buckets.

The failure belongs to #234; #215 does not alter depiction backlog truth or renderer availability.

## Current overlap / near-future state

At the latest refresh:

- PR #237 — this #215 join
- PR #217 — unrelated competitive-exam bank work; touches `docs/architecture-manifest.json`
- PR #238 — separate Core2 source-custody fidelity work; does not touch #215 browser/runtime files but also touches `docs/architecture-manifest.json`

These are material-drift/rebase inputs. They do not authorize title-based conflict resolution or make Relay a permission gate.

## Generated-artifact policy

`docs/architecture-manifest.json` is builder-owned output.

The #215 sequence used in this PR is:

1. apply meaningful test/report changes;
2. use the guardrail workflow's generated-artifact preview;
3. regenerate/reconcile the manifest mechanically from the current branch tree;
4. rerun freshness;
5. never hand-merge component hashes from another PR.

The final #215 rebase after producer/dependency movement must repeat that process.

## Validation contract

Exact-head validation for the final consumer decision includes:

```text
python -m unittest discover -s tests -p "test_issue212_atlas_index.py" -v
python -m unittest discover -s tests -p "test_core_learning_adapter.py" -v
python -m unittest discover -s tests -p "test_core_projection_pipeline.py" -v
python -m unittest discover -s tests -p "test_portable_workbench.py" -v
node --test tests/readiness_join_215.test.mjs tests/topic_atlas_browser.test.mjs tests/workbench_browser.test.mjs tests/portable_workbench.test.mjs
python Shared/tools/topic_independence_guard.py
python -m Shared.tools.build_portable_workbench --check
python Shared/tools/build_manifest.py --check
python -m unittest discover -s tests -p "test_*.py" -v
```

The committed Python wrapper ensures the joined Node/Chrome proof is also executed by normal full unittest discovery.

## Observation limits

- Exact-head CI execution: **observed**
- ChromeDriver joined learner journey: **observed remotely**
- Generated artifact freshness: **observed remotely**
- Public Pages URL independently loaded in the originating ChatGPT runtime: **not observed**
- Separate local clone execution in the originating ChatGPT runtime: **NOT_RUN** because that runtime could not clone GitHub directly

No missing local observation is being relabelled as local PASS.

## Negative assurance

Issue #215 did **not**:

- change canonical Physics records;
- invent or infer IDs from titles, URLs, source order or nearby content;
- change Core reveal/protected-decision semantics;
- promote a non-canonical fixture to canonical coverage;
- change Atlas production behavior;
- change portable runtime academic meaning;
- interpret interaction events as mastery;
- hide unavailable content;
- alter workflows or Relay files;
- hand-edit subject truth to make the join green;
- claim #210 completion from an unmerged PR.

## Consumer disposition

### What may be consumed now

The #215 joined proof itself is usable now as PR evidence:

- P1 PASS
- P2 PASS
- P3 PASS
- P4 PASS
- joined #215 oracle PASS

### What may not be claimed now

P5 is still FAIL because #233 and #234 remain failing on the same tested head.

Therefore:

- #215 may consume the joined-oracle result as integration evidence;
- #215 may not claim final P5;
- #215 may not close;
- #210 may not be declared complete under its current all-five-PASS Definition of Done.

After #233/#234 are accepted into current main, #215 must rebase/re-ground, mechanically regenerate governed artifacts, and rerun the complete P1–P5 matrix on that one new current-main SHA before making the closure recommendation.
