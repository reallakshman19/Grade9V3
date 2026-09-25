# Target Demand Routing Contract

This contract governs how a fixed assessment target becomes a learner route without changing
canonical academic truth or source custody.

It is **not a seventh Core**. The six Core roles remain defined by `Shared/roles/*.md`.
Canonical subject packages remain the authority for academic truth. Core2 remains the authority
for source custody.

The routing layer exists because a requested target can legitimately require capabilities that
are not all taught in the current topic packet. In that case the system must neither:

- silently expand Core1/Core1A/Core1B;
- drop the target behind a HOLD;
- nor substitute generic easier practice and claim the target is prepared.

## Three independent graphs

A robust target route reconciles three graphs without collapsing their authorities:

1. **Canonical academic graph** — what is academically taught/reviewed.
2. **Target-demand graph** — what decisions/capabilities the requested target actually needs.
3. **Learner-route graph** — what sequence takes the learner from authorised teaching to
   independent target use.

The six Core products are projections over these graphs. They do not create missing curriculum
truth.

## Routing model

```text
TargetDemand
   ↓
DemandMove[]
   ↓
CapabilityClosure[] per move
   ├── established in current canonical scope
   ├── canonical prerequisite route
   ├── authorable extension candidate
   ├── unresolved gap
   └── identity blocked
   ↓
MoveCoverage[] per move
   ├── entry evidence
   ├── teaching / introduction
   ├── supported attempt evidence
   ├── independent evidence
   └── target-use evidence
   ↓
BridgeCandidate[] where needed
   ↓
TargetRoute
   ↓
demand-shaped Core composition
   ↓
target-specific Core2A / Core2B preparation
   ↓
fixed target
```

## Required separations

**Question identity is not source custody.** A documented semantic review may resolve target
identity while source wording/custody remains HOLD.

**Target authority is not direct source-item use.** An owner may fix a demand as a target while
direct learner display of the source item is excluded or held.

**Direct source-item use is not instructional demand use.** The system may prepare a learner for
the demand using canonical/authored teaching without claiming the exact source item is served.

**Instructional demand use is not an assessment-surface claim.** Authored preparation may be
allowed while claims about authentic exam exposure remain held.

**Learner evidence is not owner routing waiver.** A waiver permits supported work with UNKNOWN
readiness; it never becomes mastery evidence and never waives academic review.

**Demand influence is not curriculum authority.** A target may change emphasis, ordering,
examples, diagnostics and practice selection without adding a canonical Core1-family microtopic.

## Target authority states

- `OWNER_FIXED` — the owner explicitly requires preparation for this demand.
- `SELECTED` — a planner selected the demand under an authorised selection policy.
- `OPTIONAL` — useful enrichment but not required for route completion.

## Source/demand-use dimensions

`direct_source_use`:
- `ALLOWED`
- `EXCLUDED`
- `HOLD`

`instructional_demand_use`:
- `ALLOWED`
- `HOLD`

`assessment_claim`:
- `ALLOWED`
- `HOLD`

These states are independent.

## Demand decomposition

A target must be decomposed into the actual decisions or transformations needed to solve it.
A whole-question HOLD is insufficient when some required moves are already established.

Each move records:

- the decision/transformation;
- required capability references or an explicit unresolved capability description;
- whether the move is source-derived, canonical-derived or authored analysis;
- its capability-closure state;
- its move-coverage evidence.

Capability closure states:

- `ESTABLISHED_CURRENT_SCOPE`
- `ESTABLISHED_CANONICAL_PREREQUISITE`
- `AUTHORABLE_EXTENSION`
- `UNRESOLVED_GAP`
- `IDENTITY_BLOCKED`

## Move coverage

A target is not prepared merely because every required move has been named or routed.

Each move must have an evidence ledger:

- `entry_task_ref` — where initial use/diagnosis is observed, when applicable;
- `teaching_refs[]` — where the move is introduced or reconstructed;
- `supported_attempt_refs[]` — guided/faded evidence;
- `independent_evidence_refs[]` — independent use before target claim;
- `target_use_ref` — the fixed target that ultimately consumes the move;
- `coverage_state`.

Move coverage states:

- `UNTAUGHT`
- `TAUGHT_NO_EVIDENCE`
- `SUPPORTED_EVIDENCE`
- `INDEPENDENT_EVIDENCE`

Several moves may share one instructional artifact, but every move must point to observable
evidence. A named Core in a route is not evidence by itself.

## Content-bearing Bridge Candidates

`AUTHORABLE_EXTENSION` is not a status-only escape hatch. It requires a concrete
`BridgeCandidate` containing:

- teaching goal;
- prerequisite references;
- mathematical prerequisite references;
- required new capability;
- grade/scope decision;
- conceptual construction;
- representation requirements;
- worked anchor and checked solution;
- misconception/diagnosis/repair;
- independent check;
- exit task;
- independent transfer evidence;
- target linkage;
- academic authority/review state;
- named review decision/evidence/limitations.

A bridge candidate is not canonical until separately admitted by the repository's academic
review process. An owner routing waiver cannot waive this review.

## Identity resolution

Multiple candidate refs do not automatically imply permanent `IDENTITY_HOLD`, but semantic
similarity alone is not proof of source identity.

A completed identity resolution records:

- provenance of the candidate set;
- candidate refs;
- an observable demand fingerprint;
- discriminating features;
- rejected candidates and reasons;
- reviewer decision;
- confidence.

The fingerprint may include:

- physical/mathematical setup;
- requested output;
- special condition/event;
- answer type;
- distinctive transformation.

If exactly one candidate survives documented review, identity may become
`SEMANTIC_MATCH_RESOLVED`. Source custody remains independently evaluated.

## Target routes

Every fixed target must have one explicit route or one justified terminal block.

A valid route names ordered nodes such as:

- canonical Core1/Core1A/Core1B foundation;
- canonical prerequisite teaching;
- reviewed/admissible bridge candidate;
- target-specific Core2A familiar preparation;
- target-specific Core2B changed-demand preparation;
- target attempt.

Every route node must state which DemandMove IDs it prepares. Generic practice may appear as
support only when it demonstrably prepares a named move. Unrelated easier practice can never
close a fixed target.

## Target completion = coverage × authorization

Route completion and permission are orthogonal.

Target coverage states:

- `INCOMPLETE`
- `SUPPORTED_ONLY`
- `INDEPENDENT_EVIDENCE_COMPLETE`

Target authorization states:

- `READY` — academic content and instructional use are authorised for this route;
- `ACADEMIC_REVIEW_HOLD` — a required bridge/extension is not yet academically approved;
- `INSTRUCTIONAL_USE_HOLD` — the demand is not authorised for learner instruction;
- `IDENTITY_HOLD` — source-dependent target identity is unresolved.

Direct source-item custody/use and authentic assessment-surface claims remain separate. A route may become `PREPARED` through clearly labelled authored analogues while `direct_source_use` or `assessment_claim` remains `HOLD`; it must not then claim authentic PYQ exposure.

Target preparation states:

- `PREPARED`
- `PARTIALLY_PREPARED`
- `BLOCKED`

`PREPARED` requires both:

- coverage = `INDEPENDENT_EVIDENCE_COMPLETE`; and
- authorization = `READY`.

A `BLOCKED` target is a valid diagnostic outcome, but it does not satisfy fixed-target
preparation acceptance.

## Demand-shaped Core composition

Core1/Core1A/Core1B academic scope remains canonical. Target demands may influence
learner-facing composition through `demand_influence_refs[]`, but each influence must be
observable and falsifiable.

Each influence records:

- target ref;
- DemandMove ref;
- observable teaching change;
- affected learner-product blocks.

Examples of observable influence:

- require the learner to mark an event boundary before selecting equations;
- change a worked anchor to expose a canonical misconception;
- select a canonical representation that makes a required decision visible;
- add a diagnostic or exit task that directly exercises the target move.

A bare target ID attached to an otherwise generic page is not sufficient.

Core2A and Core2B target preparation must identify the target move(s) they prepare.

## Owner routing waiver

When learner capability evidence is UNKNOWN, an explicit owner waiver may authorise supported
Core2A/Core2B work toward owner-fixed targets.

A waiver means:

- proceed with declared support;
- preserve UNKNOWN prerequisite/mastery state;
- do not claim personalised readiness, calibration or mastery;
- do not bypass a true capability gap;
- do not bypass Core2B prior-exposure requirements;
- do not waive academic review of bridge/extension content.

## Learner-product quality remains independent

A correct academic route does not imply a good learner artifact. Publication/delivery quality
must be validated separately for:

- physical/semantic accuracy;
- legible diagrams;
- readable mathematics;
- worked → faded → independent progression;
- misconception diagnosis/repair;
- visible lesson-to-target-move connection;
- static/print closure where applicable.

## Machine-readable contract

```target-demand-routing
{
  "version": "1.1",
  "is_core_role": false,
  "target_authority_states": ["OWNER_FIXED", "SELECTED", "OPTIONAL"],
  "direct_source_use_states": ["ALLOWED", "EXCLUDED", "HOLD"],
  "instructional_demand_use_states": ["ALLOWED", "HOLD"],
  "assessment_claim_states": ["ALLOWED", "HOLD"],
  "identity_states": [
    "EXACT_CONFIRMED",
    "SEMANTIC_MATCH_RESOLVED",
    "IDENTITY_REVIEW_REQUIRED",
    "IDENTITY_HOLD",
    "UNMAPPED"
  ],
  "identity_confidence_states": ["HIGH", "MEDIUM", "LOW", "NOT_ESTABLISHED"],
  "capability_closure_states": [
    "ESTABLISHED_CURRENT_SCOPE",
    "ESTABLISHED_CANONICAL_PREREQUISITE",
    "AUTHORABLE_EXTENSION",
    "UNRESOLVED_GAP",
    "IDENTITY_BLOCKED"
  ],
  "move_coverage_states": [
    "UNTAUGHT",
    "TAUGHT_NO_EVIDENCE",
    "SUPPORTED_EVIDENCE",
    "INDEPENDENT_EVIDENCE"
  ],
  "target_coverage_states": [
    "INCOMPLETE",
    "SUPPORTED_ONLY",
    "INDEPENDENT_EVIDENCE_COMPLETE"
  ],
  "target_authorization_states": [
    "READY",
    "ACADEMIC_REVIEW_HOLD",
    "INSTRUCTIONAL_USE_HOLD",
    "IDENTITY_HOLD"
  ],
  "target_preparation_states": [
    "PREPARED",
    "PARTIALLY_PREPARED",
    "BLOCKED"
  ],
  "bridge_candidate_required_fields": [
    "bridge_id",
    "target_refs",
    "teaching_goal",
    "prerequisite_refs",
    "mathematical_prerequisite_refs",
    "required_new_capabilities",
    "grade_scope_decision",
    "construction",
    "representation_requirements",
    "worked_anchor",
    "worked_solution_check",
    "misconceptions",
    "independent_check",
    "exit_task",
    "independent_transfer_ref",
    "authority_state",
    "academic_review"
  ],
  "route_node_kinds": [
    "CORE1",
    "CORE1A",
    "CORE1B",
    "CANONICAL_PREREQUISITE",
    "BRIDGE_CANDIDATE",
    "CORE2A",
    "CORE2B",
    "TARGET"
  ],
  "invariants": {
    "every_fixed_target_requires_route_or_terminal_block": true,
    "whole_question_hold_cannot_hide_partial_capability_closure": true,
    "every_move_requires_coverage_ledger": true,
    "generic_practice_does_not_close_target": true,
    "target_authority_is_independent_of_direct_source_use": true,
    "direct_source_use_is_independent_of_instructional_demand_use": true,
    "instructional_demand_use_is_independent_of_assessment_claim": true,
    "identity_is_independent_of_source_custody": true,
    "semantic_identity_requires_documented_candidate_review": true,
    "owner_waiver_is_not_mastery_evidence": true,
    "owner_waiver_cannot_bypass_capability_gap": true,
    "owner_waiver_cannot_bypass_academic_review": true,
    "core1_family_scope_remains_canonical": true,
    "demand_influence_must_name_move_and_observable_change": true,
    "core2a_target_use_requires_capability_closure": true,
    "core2b_target_use_requires_capability_closure_and_prior_exposure": true,
    "extension_candidate_is_not_canonical_until_admitted": true,
    "blocked_target_cannot_pass_preparation_acceptance": true,
    "prepared_requires_independent_evidence_and_authorization": true,
    "learner_product_quality_is_separate_from_route_validity": true
  }
}
```

## Consumer requirements

Any prompt generator or authoring workflow for fixed targets must require a completed artifact
conforming to `Shared/library/target-demand-route.schema.json`.

The completed artifact, not a prose HOLD table, is the auditable evidence that the requested
targets remain connected to learner preparation.
