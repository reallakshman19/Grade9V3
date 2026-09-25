# Validation / audit report

**Repository basis:** `main@dd1fb0ca8374a398ea48aa3253a5d37ed0d62739`  
**Prototype branch:** `prototype/projectile-motion-six-core`

## Validation-state distinctions

- **STRUCTURALLY_VALIDATED:** this prototype's required files, trace fields, attempt/reveal ordering, and explicit HOLD markers are present.
- **SOURCE_VERIFIED:** the five bank anchors are verified demand evidence at the competitive-bank layer; this does **not** establish ordinary Core2 custody.
- **ACADEMICALLY_REVIEWED:** **not claimed**. The canonical Motion-in-2D package itself is `CANDIDATE`.
- **PUBLICATION_READY:** **NO**. Core2 custody, Q15 identity, Core1A worked anchors, two visual bindings, and learner-release prerequisites remain held.

## Required checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Core1/Core1A/Core1B academic authority comes from canonical subject data. | **PASS** | All three are generated solely from phy-kin-2d-motion.v1.json. |
| 2 | Execution order was not used as derivation order. | **PASS** | Core2 demand inspection does not feed Core1-family truth. |
| 3 | Core2 contains no fabricated source custody. | **PASS** | Core2 is explicit HOLD; no bank restatement is presented as ordinary source custody. |
| 4 | Q15 ambiguity is not silently resolved. | **PASS** | IDENTITY_HOLD with both candidate refs retained. |
| 5 | Every canonical question primary_capability_ref is preserved. | **PASS** | Demand map copies bank primary refs; authored practice copies canonical question fields. |
| 6 | No primary_concept_id replacement exists. | **PASS** | Prototype uses primary_capability_ref only. |
| 7 | Demand evidence is separate from learner eligibility. | **PASS** | Separate fields exist in demand-map and trace. |
| 8 | Source hints remain distinct from authored scaffolds. | **PASS** | Products label question.hints and question.scaffolds separately; no scaffold is relabelled as a source hint. |
| 9 | Core1A and Core1B have identical canonical conceptual coverage. | **PASS** | MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS, MIC-PHY-KIN-2D-CONSTANT-ACCELERATION, MIC-PHY-KIN-PROJECTILE-MODEL |
| 10 | Core1B attempt occurs before reconstruction/answer reveal. | **PASS** | Markdown and HTML preview put attempt before details/reveal. |
| 11 | No question extension silently becomes a canonical Core1A microtopic. | **PASS** | Canonical coverage remains exactly three microtopics. |
| 12 | Core2A reasoning routes explain model/representation/event choice, not only algebra. | **PASS** | Existing reasoning_route kinds include REPRESENT/DECIDE/CONNECT/TRANSFORM/VERIFY with crux refs. |
| 13 | Core2B introduces no untaught scientific capability. | **PASS** | Uses only canonical authored transfer items; five advanced demand anchors are excluded from transfer. |
| 14 | Every Core2B protected decision remains undisclosed pre-attempt. | **PASS** | Preview shows only CONCEPT scaffolds whose supports_move_ref differs from protected_move_ref. |
| 15 | Actual learner-facing visuals resolve to semantic representations or explicitly HOLD. | **PASS** | Scene eligibility is checked by Core plus microtopic/question binding. Only the shared-clock scene for the independent-components Core1A/Core1B usage renders; every other required usage is explicit VISUAL_HOLD. |
| 16 | Terminology/equations/conditions agree across all six products. | **PASS** | Derived from the same package/bank snapshot at starting SHA. |
| 17 | Every prompt/task closes without requiring a live tutor. | **PASS** | Canonical exit tasks/elicitation closures and authored practice answers/checks are retained. |
| 18 | Unresolved authority dependencies remain HOLD/FAIL. | **PASS** | Core2 custody, Q15 identity, advanced gaps, worked anchors, visual bindings, learner-fit and prior-exposure gaps are all registered. |

## Falsifiers applied

- No new Motion-in-2D microtopic was created.
- The canonical mapping field remains `question.primary_capability_ref`; no substitute concept-id field is introduced.
- Q15 has no resolved exact ref or owner-level primary capability.
- No fixed anchor is put in Core2 learner custody.
- No JEE Advanced anchor is treated as learner-eligible.
- No linear-drag, changed-gravity, bounce/restitution, trajectory-equation or calculus content is taught inside Core1A.
- Core2B safe pre-attempt support is filtered so it cannot target the protected move.
- Missing representation scene bindings are surfaced as `VISUAL_HOLD`.
- `visual-audit.json` records, for every canonical representation and every required learner-product usage, purpose, required semantic elements, actual bound elements, correspondence, reveal stage, accessibility, provenance and semantic-review status; scene eligibility is checked by exact Core plus microtopic/question binding.

## Outcome

The six-role prototype is a truthful **structural/design candidate with explicit HOLDs**, not a claim of academic review or publication readiness.


## Executed branch-level falsifiers

These checks were run against branch `prototype/projectile-motion-six-core` after the learner products were written:

- **Diff isolation:** compare from `dd1fb0ca8374a398ea48aa3253a5d37ed0d62739` shows 13 added files, all under `Physics/content/projectile-motion-six-core-prototype/`; no canonical package, question-bank, role-contract or schema file is modified.
- **Demand identity/mapping:** all exact/candidate demand refs exist in the current competitive bank and the demand map preserves their `primary_capability_ref` and secondary refs. Q15 has `exact_repository_ref: null` and retains both candidates.
- **Coverage parity:** Core1A and Core1B each cover exactly the three canonical microtopic IDs: independent components, componentwise constant acceleration, and gravity-only projectile model.
- **Attempt/reveal ordering:** all three Core1B cycles place PREDICT and ATTEMPT before reconstruction/model material. All five Core2B items place changed-demand metadata, protected move and full answer after ATTEMPT.
- **Protected transfer:** every Core2B `protected_move_ref` resolves to a canonical `DECIDE` reasoning move; every `builds_on[]` parent is an existing Core2A item; every Core2B primary capability is already canonical in this bucket.
- **Hint/scaffold separation:** authored Core2A/Core2B trace rows carry empty `source_hint_refs[]`, separate `question_hint_refs[]`, and separate `authored_scaffold_refs[]`.
- **Visual semantics:** 16 required representation usages were audited. Exactly two have eligible canonical scene bindings (shared-clock / independent-components in Core1A and Core1B); the other 14 are explicit usage-level `VISUAL_HOLD`.
- **Rendered reveal gate:** the HTML preview does not render a Core1 scene borrowed from another role, renders the eligible shared-clock scene in Core1A, reveals its Core1B use only after a non-blank committed response, and applies the same non-blank gate to Core2B answer reveals.
- **Forbidden field check:** no generated machine-readable artifact contains a `primary_concept_id` field.

No repository-wide test-suite success is claimed here; this prototype is an isolated content addition and the audit above is the structural/content-contract validation actually executed in this run.
