# Core-agent authoring prompt

Prompt brief: PB-6A7A02596F98A23D
Repository basis: main@ca0de27e307e4f532412ac52713a6faf14b216a4

## [GOAL_OUTCOME] Goal and outcome

Produce the requested six-Core authoring outputs from this fixed planning bundle without changing canonical curriculum, question identity, role semantics, or planner authority.

## [FIXED_SOURCE_QUESTIONS] Fixed source questions

- Q28: Velocity direction from x(t), y(t). [canonical: PYQ-PHY-JEEMAIN-2026-04APR-S2-Q29] [mapping: CANONICAL_MATCH] [learner eligibility: NOT_ESTABLISHED]
- Q15: Projectile height after an energy-losing bounce. [candidates: PYQ-PHY-JEEADV-2018-P2-Q08, PYQ-PHY-JEEADV-2023-P1-Q01] [mapping: IDENTITY_HOLD] [learner eligibility: EXCLUDED]
- Q21: Gravity changes after apex. [canonical: PYQ-PHY-JEEADV-2022-P1-Q08] [mapping: CANONICAL_MATCH] [learner eligibility: EXCLUDED]
- Q26: Projectile passing through a specified point. [canonical: PYQ-PHY-JEEADV-2026-P1-Q06] [mapping: CANONICAL_MATCH] [learner eligibility: EXCLUDED]
- Q23: Projectile with linear drag. [canonical: PYQ-PHY-JEEADV-2025-P2-Q15] [mapping: CANONICAL_MATCH] [learner eligibility: EXCLUDED]

## [LEARNER_PROFILE] Learner profile

{"owner_estimate":{"by":"owner","instruction":"Starting coordinate only; not evidence of prerequisite mastery. Learner understands basic velocity components and standard projectile equations but selects equations inconsistently. Learner confuses position direction, velocity direction and trajectory direction, and struggles with apex/impact event conditions. Learner struggles when acceleration changes or the standard projectile model no longer applies. Support should emphasize visual reasoning, worked examples, staged authored scaffolds, misconception diagnosis and immediate independent verification where the Core role permits them.","knowledge_percentage":50}}
A percentage is a starting coordinate only; it is not evidence of prerequisite mastery.

## [EXECUTION_ORDER] Required production order

CORE2 → CORE1 → CORE1A → CORE1B → CORE2A → CORE2B
Treat this as production control only. It does not override readiness, HOLD decisions, or the authority graph.

## [AUTHORITY_GRAPH] Core authority and dependency graph

- CORE2: required authority = AUTHORIZED_SOURCE_CUSTODY
- CORE1: required authority = CANONICAL_ACADEMIC_TRUTH
- CORE1A: required authority = CANONICAL_ACADEMIC_TRUTH
- CORE1B: required authority = CANONICAL_ACADEMIC_TRUTH
- CORE2A: required authority = CANONICAL_ACADEMIC_TRUTH; one of = ELIGIBLE_REVIEWED_DEMAND, AUTHORED_PRACTICE; optional support = LEARNER_SUPPORT_INPUT
- CORE2B: required authority = CANONICAL_ACADEMIC_TRUTH, PRIOR_EXPOSURE; one of = ELIGIBLE_REVIEWED_DEMAND, AUTHORED_PRACTICE; optional support = LEARNER_SUPPORT_INPUT
Execution order is production control only; it is not derivation or authority order.
A Core2 HOLD does not become academic authority and does not automatically block valid Core1-family study products.
Preserve question.primary_capability_ref; set-level topic/rung scope is composition context only.
Demand evidence and learner eligibility are independent states.
Source question.hints[] and authored question.scaffolds[] remain separate custody classes.
Extension demands do not become Core1/Core1A/Core1B microtopics unless canonical academic authority admits them.

## [DEMAND_BRIDGE] Demand bridge and prerequisite admission

Demand Bridge / Admission is a planning control, not a seventh Core. Before authoring application products, produce one final bridge record for every fixed demand using exactly one allowed disposition.
- WITHIN_CANONICAL_SCOPE: capability_closure=ESTABLISHED
- CANONICAL_PREREQUISITE_ROUTE: capability_closure=ROUTED
- EXTENSION_ADMISSION_CANDIDATE: capability_closure=NOT_YET_ADMITTED; downstream_application_state=HOLD
- UNRESOLVED_CAPABILITY_GAP: capability_closure=UNRESOLVED; downstream_application_state=HOLD
- IDENTITY_HOLD: capability_closure=UNRESOLVED; downstream_application_state=HOLD
Required bridge output fields: demand_ref, canonical_primary_capability_ref, canonical_capability_refs, canonical_prerequisite_refs, unresolved_prerequisite_demands, disposition, prerequisite_route, extension_admission_candidate, source_custody_state, learner_eligibility_state, core2a_eligibility, core2b_eligibility, hold_close_when
Seed rows from canonical mapping/identity state:
- Q28: classification_state=READY_FOR_CAPABILITY_ANALYSIS; canonical_primary=CAP-KIN-2D-INDEPENDENT-COMPONENTS; identity=EXACT_CONFIRMED; learner_eligibility=NOT_ESTABLISHED; demand_evidence=PYQ-PHY-JEEMAIN-2026-04APR-S2-Q29
- Q15: classification_state=IDENTITY_HOLD; canonical_primary=UNRESOLVED; identity=IDENTITY_HOLD; learner_eligibility=EXCLUDED; demand_evidence=PYQ-PHY-JEEADV-2018-P2-Q08, PYQ-PHY-JEEADV-2023-P1-Q01
- Q21: classification_state=READY_FOR_CAPABILITY_ANALYSIS; canonical_primary=CAP-KIN-PROJECTILE-MODEL; identity=EXACT_CONFIRMED; learner_eligibility=EXCLUDED; demand_evidence=PYQ-PHY-JEEADV-2022-P1-Q08
- Q26: classification_state=READY_FOR_CAPABILITY_ANALYSIS; canonical_primary=CAP-KIN-PROJECTILE-MODEL; identity=EXACT_CONFIRMED; learner_eligibility=EXCLUDED; demand_evidence=PYQ-PHY-JEEADV-2026-P1-Q06
- Q23: classification_state=READY_FOR_CAPABILITY_ANALYSIS; canonical_primary=CAP-KIN-2D-CONSTANT-ACCELERATION; identity=EXACT_CONFIRMED; learner_eligibility=EXCLUDED; demand_evidence=PYQ-PHY-JEEADV-2025-P2-Q15
Do not drop a fixed demand because it is outside the current packet. Do not silently expand Core1/Core1A/Core1B. If canonical prerequisite truth exists elsewhere, route to it explicitly. If not, create an EXTENSION_ADMISSION_CANDIDATE or keep UNRESOLVED_CAPABILITY_GAP with a concrete close condition. Unrelated easier practice may support prerequisites but does not close the fixed target demand. Core2A/Core2B may consume a target demand only after capability closure is ESTABLISHED or ROUTED; Core2B additionally requires prior exposure.

## [LEARNER_PRODUCT_CONTRACT] Learner-product delivery contract

Contract: Shared/roles/LEARNER-PRODUCT-TEMPLATES.md (version 1.1).
- required_role_blocks_must_exist_in_learner_artifact=true
- summary_pointer_to_external_file_does_not_satisfy_required_block=true
- static_delivery_must_be_semantically_complete=true
- interactive_reveal_requires_static_closure_equivalent=true
- canonical_representation_binding_required=true
- required_visual_must_render_in_learner_artifact=true
- reviewer_engineering_metadata_must_not_dominate_learner_surface=true
- math_must_render_as_readable_math_not_broken_control_sequences=true
- shared_learner_projection_runtime_is_default_delivery_path=true
- topic_local_parallel_renderer_requires_proven_shared_stack_gap=true
Required role anatomy:
- CORE2: source_identity_provenance[IMMEDIATE] → source_question[IMMEDIATE] → source_figure[IMMEDIATE] → source_hint_ladder[ON_REVEAL] → source_answer_rubric[ON_REVEAL] → custody_status[IMMEDIATE]
- CORE1: identity_scope[IMMEDIATE] → objects_conventions[IMMEDIATE] → canonical_representation[IMMEDIATE] → governing_relations[IMMEDIATE] → compact_anchor[IMMEDIATE] → hard_transition_map[IMMEDIATE] → exclusions_extensions[IMMEDIATE] → orientation_closure[IMMEDIATE]
- CORE1A: identity_entry_assumptions[IMMEDIATE] → convention_declaration[IMMEDIATE] → inferential_jump[IMMEDIATE] → completed_construction[IMMEDIATE] → representation_bridge[IMMEDIATE] → worked_conceptual_anchor[IMMEDIATE] → plausible_wrong_path[IMMEDIATE] → diagnose[IMMEDIATE] → repair[IMMEDIATE] → independent_checks[IMMEDIATE] → exit_task_closure[IMMEDIATE]
- CORE1B: identity_concept[IMMEDIATE] → predict[ATTEMPT_FIRST] → attempt[ATTEMPT_FIRST] → reconstruct[POST_ATTEMPT] → diagnose[POST_ATTEMPT] → repair[POST_ATTEMPT] → boundary_test[POST_ATTEMPT] → model_response_or_rubric[ON_REVEAL] → rejoin_inferential_jump[ON_REVEAL]
- CORE2A: family_identity_provenance[IMMEDIATE] → question[IMMEDIATE] → initial_representation[IMMEDIATE] → pedagogical_scaffolds[ON_REVEAL] → reasoning_route[ON_REVEAL] → application_crux[ON_REVEAL] → bound_representation[ON_REVEAL] → complete_solution[ON_REVEAL] → independent_check[ON_REVEAL] → failure_signal_repair[ON_REVEAL] → exposure_family_closure[IMMEDIATE]
- CORE2B: question_prior_exposure[IMMEDIATE] → safe_initial_representation[IMMEDIATE] → safe_pre_attempt_support[IMMEDIATE] → attempt_commitment[ATTEMPT_FIRST] → post_attempt_support[POST_ATTEMPT] → full_answer_rubric[ON_REVEAL] → changed_demand_review[ON_REVEAL] → repair_route[ON_REVEAL] → lineage_continuity_check[ON_REVEAL]
The actual learner artifact must contain the required blocks; a summary page that points elsewhere for the full teaching/solution does not satisfy the role. Interactive reveal must have a semantically complete static/print closure route. Required canonical visuals must actually render in the learner artifact. Math must render as readable mathematics. Use the shared learner projection/runtime by default; a topic-local parallel renderer requires a proven shared-stack gap.

## [TOPIC_BOUNDARY] Topic and rung boundary

Subject: Physics. Matrix: MATRIX-PHY-KIN-2D-MOTION. Bucket: BUCKET-PHY-KIN-2D-MOTION. Canonical primary rungs represented: R1, R2, R3. Composition scope status: OWNER_CONFIRMED_CANONICAL_RUNG.

## [CORE_OBLIGATIONS] Per-Core obligations

- CORE2: Preserve source custody and exact source identity; do not present authored material as supplied source. Contract: Shared/roles/CORE2.md
- CORE1: Follow the current CORE1 contract for compact semantic orientation. Contract: Shared/roles/CORE1.md
- CORE1A: Preserve full intrinsic subtopic depth; learner percentage must not shrink what is taught. Contract: Shared/roles/CORE1A.md
- CORE1B: Preserve the same intrinsic concept depth as CORE1A while following its attempt/reconstruction contract. Contract: Shared/roles/CORE1B.md
- CORE2A: Use learner estimate only as permitted for routing/support; never treat it as prerequisite or mastery evidence. Contract: Shared/roles/CORE2A.md
- CORE2B: Preserve changed-demand transfer and prerequisite checks; aggregate percentage never establishes readiness. Contract: Shared/roles/CORE2B.md

## [DIFFICULTY_PROGRESSION] Difficulty progression

D2 → D3 → D4
Preserve intrinsic Core1A/Core1B depth regardless of the learner estimate.

## [KEYWORD_FINGERPRINT] Concept fingerprint

- Differentiate x(t) and y(t); the requested angle is set by v_y/v_x, not y/x. (QUESTION_CRUX; evidence: PYQ-PHY-JEEMAIN-2026-04APR-S2-Q29)
- Preserve the apex state and change only the second-stage fall time. (QUESTION_CRUX; evidence: PYQ-PHY-JEEADV-2022-P1-Q08)
- Use both the trajectory equation and the sign of vertical velocity/slope at P. (QUESTION_CRUX; evidence: PYQ-PHY-JEEADV-2026-P1-Q06)
- Separate the horizontal drag equation and integrate its exponential velocity law. (QUESTION_CRUX; evidence: PYQ-PHY-JEEADV-2025-P2-Q15)
- Declare one frame and clock, represent the motion with simultaneous signed components, validate the component kinematic model, and for projectile questions choose both the gravity-only specialization and the event condition before reconstructing the requested result. (MATRIX_INVARIANT; evidence: MATRIX-PHY-KIN-2D-MOTION)
- Keeping model choice and event choice separate: first decide which component equations are valid, then decide what condition identifies the requested instant, while preserving one common clock. (MATRIX_DIFFICULT_MOVE; evidence: MATRIX-PHY-KIN-2D-MOTION)

## [PROVENANCE_TRACE] Provenance and trace

- trace-q-01: Q28 → CAP-KIN-2D-INDEPENDENT-COMPONENTS → MATRIX-PHY-KIN-2D-MOTION/R1; status=CANONICAL_MATCH
- trace-q-02: Q15 → UNMAPPED → UNMAPPED/UNMAPPED; status=IDENTITY_HOLD
- trace-q-03: Q21 → CAP-KIN-PROJECTILE-MODEL → MATRIX-PHY-KIN-2D-MOTION/R3; status=CANONICAL_MATCH
- trace-q-04: Q26 → CAP-KIN-PROJECTILE-MODEL → MATRIX-PHY-KIN-2D-MOTION/R3; status=CANONICAL_MATCH
- trace-q-05: Q23 → CAP-KIN-2D-CONSTANT-ACCELERATION → MATRIX-PHY-KIN-2D-MOTION/R2; status=CANONICAL_MATCH
Use only the cited repository/owner inputs. Do not expose or invent private reasoning traces. Every fixed demand must retain a bridge/admission footprint until its target capability closure is established.

## [ACCEPTANCE] Acceptance

Keep every fixed question traceable to its mapping finding and Demand Bridge disposition; preserve per-question primary_capability_ref independently from set-level scope; keep demand evidence separate from learner eligibility; preserve the requested Core set/order without treating order as authority; distinguish source hints from authored scaffolds and source/adapted/authored material; do not promote extension demand into Core1-family teaching without canonical admission; do not substitute easier generic practice as closure of a fixed target demand; require ESTABLISHED or ROUTED capability closure before Core2A/Core2B target-demand use and prior exposure before Core2B; and hand the unchanged authoring request to the existing planner.

## [NON_GOALS] Non-goals

Do not select a new canonical question set, create a seventh Core, infer mastery, fabricate source receipts, duplicate plan_request.py, or author/publish PDFs in this task.

## [HOLD_FAIL] HOLD / FAIL behavior

- IDENTITY_HOLD / QUESTION_IDENTITY_AMBIGUOUS: Q15: multiple candidate question identities require explicit exact-ref confirmation: PYQ-PHY-JEEADV-2018-P2-Q08, PYQ-PHY-JEEADV-2023-P1-Q01
If a composer HOLD is present, do not silently resolve it. A capability HOLD must still leave a concrete prerequisite/admission path where repository truth supports one. If the planner requests source basis, prerequisites or owner input, preserve that HOLD.

## [DOWNSTREAM_DELIVERABLE] Downstream deliverable intent

The intended downstream publication is one role-specific PDF for each valid/publishable requested Core. Do not render PDFs here; #273 owns PDF publication after validated learner products exist.
