# Core readiness contract map — Issue 211 / Gate 1

## Scope

This report audits the current subject-neutral Core path required by roadmap issue #210 Gate 1. It does not create new subject content, a seventh Core, a mastery store, a parallel curriculum map, or a new visual runtime.

Evidence baseline: current Gate-1 branch derived from `main@c768c53270b559297d316ead70f50ef6e7a99ba9` under `EP-ISS211-CORE-READINESS-V31-001`.

## Contract ownership and seams

| Layer | Owner | Contract / role | Current status |
|---|---|---|---|
| Six Core roles | `README.md`, `Shared/roles/`, compiler inputs | Core1 orientation; Core2 source-question custody; Core1A declarative construction; Core1B reconstruction; Core2A familiar application; Core2B changed-demand transfer | PASS |
| Canonical subject truth | Subject `library/`, `matrices/`, adapters | Concepts, questions, reasoning routes, representations, provenance and validity remain subject-owned | PASS |
| Compiler | `Shared/library/compile_inputs.py` | Compiles all six role products where canonical records support them; unsupported roles become explicit requirements | PASS |
| Learner activity projection | `Shared/tools/core_learning_projection_adapter.py` | Emits the four interactive A/B roles from compiler output; does not redefine Core1/Core2 custody/orientation | PASS |
| Generated learner data | `Shared/tools/build_core_learning_data.py` | Emits projections plus one availability row per canonical bucket and explicit unsupported findings | PASS |
| Core learner state machine | `Shared/workbench/core-learning-page.mjs` | Validates projection version/refs, enforces attempt/reveal/support transitions, and emits semantic events | PASS |
| Host seam | `Shared/workbench/core-learning-host.mjs` | Resolves supplied projection inputs; does not compile subject truth or infer mastery | PASS |
| Visual binding slots | CoreProjection row | `scene_ref`, `adapter_ref`, `injection_refs` remain explicit optional slots; current Motion-2D production rows leave them unbound while retaining canonical representation/activity locators | PARTIAL by design; Gate 3 owns portable binding |
| Portable package binding | #214 / Gate 3 | Canonical resource → validated portable package → offline host | NOT IN GATE 1 |

## PASS / PARTIAL / MISSING evidence table

| Requirement | Status | Evidence |
|---|---|---|
| Core1 semantic orientation remains distinct from Core2 source-question custody | PASS | `README.md` six-product definitions; `Shared/library/compile_inputs.py` separately creates orientation and custody obligations/products. |
| Core1A full construction differs from Core1B attempt-before-reveal reconstruction | PASS | `core_learning_projection_adapter.py` sets `show_full_construction` only for Core1A and `attempt_before_reveal` for Core1B; `tests/core_learning_page.test.mjs` proves reconstruction is absent until commit. |
| Core2A preserves familiar reasoning crux and independent check | PASS | Motion-2D production projection `physics:q-phy-kin-2d-2a-horizontal-launch-04:core2a` carries `reasoning_route`, `crux_move_ref`, source identity and `check`. |
| Core2B protects the changed decision before learner commitment | PASS | Production projection `physics:q-phy-kin-2d-2b-projectile-validity-04:core2b` carries protected move `R-KIN-TRANSFER-MODEL`; page tests return `SUPPORT_PROTECTED_PREATTEMPT` until commit. |
| Source identity, options and subparts survive projection | PASS | Adapter copies `question_ref`, family, source refs, origin, original number, subparts, options, conditions and figure refs; page tests validate/display those supplied fields without leaking reasoning. |
| Missing / incompatible projection refs fail closed | PASS | `validateCoreProjection` emits named codes for unsupported versions, cores, dangling crux/protected/scaffold refs and incomplete visual bindings. |
| Unsupported canonical buckets are visible rather than silently dropped | PASS | Current generated data contains 21 bucket-availability rows and 20 explicit unsupported findings; Issue-211 falsifier checks that every canonical bucket has exactly an availability state and every unsupported row has a named finding. Counts are evidence, not quotas. |
| Subject-neutral Shared code | PASS | `Shared/tools/topic_independence_guard.py`; existing page test forbids topic/mastery vocabulary; Issue-211 falsifier checks for subject-specific equality switches in the Core lane. |
| Learner evidence / mastery meaning remains outside visual runtime | PASS | Core page events report attempts/support/reveal/manipulation/activity only; existing tests assert event payloads do not contain mastery/proficiency/score classification. |
| CoreProjection scene/adapter/injection binding for canonical portable visual | PARTIAL | Slots are explicit and validated, but Motion-2D production projections currently use `scene_ref: null`, `adapter_ref: null`, `injection_refs: []`. This is not silently inferred. #214 owns the canonical portable binding. |
| Cross-surface Atlas → Core → standalone visual join | MISSING in Gate 1 by scope | Owned by #212–#215; Gate 1 must freeze the Core consumer shape, not implement downstream surfaces. |

## Frozen Gate-1 consumer shape

The downstream Atlas/visual lanes may rely on these existing fields without a Gate-1 version change:

- row: `id`, `subject`, `source_ref`, `projection`, `scene_ref`, `adapter_ref`, `injection_refs`, `explorer_locator`;
- projection contract version: `1.0`;
- projection Core: `CORE1A | CORE1B | CORE2A | CORE2B`;
- concept: canonical `microtopic_ref`, inferential jump, teaching path, elicitation, misconceptions, representation refs;
- application: canonical `question_ref`, family, stem, source refs, origin, original number, subparts/options/conditions/figure refs, reasoning route, crux, hints/scaffolds, transfer and independent `check`;
- presentation: attempt-before-reveal, full-construction flag, initial visual ref/stage and protected move refs;
- provider-level availability: every canonical bucket receives `AVAILABLE` or `UNSUPPORTED` with stable named finding fields.

No new envelope version is required by the current evidence.

## Production witness

Current generated Core learner data has one complete Motion-in-2D A/B quartet:

- `physics:mic-phy-kin-2d-independent-components:core1a`
- `physics:mic-phy-kin-2d-independent-components:core1b`
- `physics:q-phy-kin-2d-2a-horizontal-launch-04:core2a`
- `physics:q-phy-kin-2d-2b-projectile-validity-04:core2b`

The quartet shares canonical subject records rather than page-local academic text. Core1B is eliciting; Core2B protects `R-KIN-TRANSFER-MODEL` before commitment. The canonical visual identity remains explicit through representation/resource refs even though the portable scene/adapter binding is not yet supplied.

## Demonstrated gaps and chosen action

No production Core-code defect was demonstrated by the Gate-1 audit. The highest-risk requirements are already enforced by the existing compiler/adapter/page tests. The bounded change for #211 is therefore:

1. add an independent Issue-211 falsifier suite that locks availability completeness, the Motion-2D A/B witness, source/crux/protected-transfer preservation, explicit visual-binding slots and subject-neutrality;
2. publish this contract map;
3. run focused Python/Node suites, topic-independence guard, generated-data/manifest freshness and full exact-head guardrails.

Production code should change only if those falsifiers fail.

## Handoff to #212 / #213 / #214

- #212 may consume stable projection IDs and availability/findings but must not invent a projection ID for an unsupported bucket.
- #213 may navigate only to resolved projection IDs; browser code must not compile or repair Core records.
- #214 may bind canonical representation/resource refs into `scene_ref` / `adapter_ref` / `injection_refs` or a versioned portable binding, but absence remains an explicit unavailable state.
- Any downstream request to change the `1.0` projection envelope must return to #211 with a failing fixture and migration proposal before consumer code compensates locally.
