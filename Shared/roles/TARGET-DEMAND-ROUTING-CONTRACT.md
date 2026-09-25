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
- nor substitute generic easier practice and claim the target is covered.

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

**Question identity is not source custody.** A unique semantic match may resolve the target
identity while source wording/custody remains HOLD.

**Target authority is not direct source-item use.** An owner may fix a demand as a target while
direct learner display of the source item is excluded or held.

**Direct source-item use is not instructional demand use.** The system may prepare a learner for
the demand using canonical/authored teaching without claiming the exact source item is served.

**Instructional demand use is not an assessment-surface claim.** Authored preparation may be
allowed while claims about authentic exam exposure remain held.

**Learner evidence is not owner routing waiver.** A waiver permits supported work with UNKNOWN
readiness; it never becomes mastery evidence.

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
- its capability-closure state.

Capability closure states:

- `ESTABLISHED_CURRENT_SCOPE`
- `ESTABLISHED_CANONICAL_PREREQUISITE`
- `AUTHORABLE_EXTENSION`
- `UNRESOLVED_GAP`
- `IDENTITY_BLOCKED`

A target aggregate route state is derived from the move states:

- `REACHABLE`
- `REACHABLE_WITH_PREREQUISITES`
- `REQUIRES_EXTENSION_ADMISSION`
- `BLOCKED`

## Content-bearing Bridge Candidates

`AUTHORABLE_EXTENSION` is not a status-only escape hatch. It requires a concrete
`BridgeCandidate` containing:

- teaching goal;
- prerequisite references;
- required new capability;
- conceptual construction;
- representation requirements;
- worked anchor;
- misconception/diagnosis/repair;
- independent check;
- exit task;
- target linkage;
- academic authority/review state.

A bridge candidate is not canonical until separately admitted by the repository's academic
review process.

## Target routes

Every fixed target must have one explicit route or one justified terminal block.

A valid route names ordered nodes such as:

- canonical Core1/Core1A/Core1B foundation;
- canonical prerequisite teaching;
- reviewed/admissible bridge candidate;
- target-specific Core2A familiar preparation;
- target-specific Core2B changed-demand preparation;
- target attempt.

Generic practice may appear as support only when a route node explains which target move it
prepares. Unrelated easier practice can never close a fixed target.

## Demand-shaped Core composition

Core1/Core1A/Core1B academic scope remains canonical. However, target demands may influence
learner-facing composition through `demand_influence_refs[]`, for example:

- emphasize a particular misconception;
- choose a canonical representation;
- choose a worked anchor;
- emphasize an event boundary;
- select a diagnostic or exit check.

That influence must not add untaught canonical truth.

Core2A and Core2B target preparation must identify the target move(s) they prepare.

## Owner routing waiver

When learner capability evidence is UNKNOWN, an explicit owner waiver may authorise supported
Core2A/Core2B work toward owner-fixed targets.

A waiver means:

- proceed with declared support;
- preserve UNKNOWN prerequisite/mastery state;
- do not claim personalised readiness, calibration or mastery;
- do not bypass a true capability gap;
- do not bypass Core2B prior-exposure requirements.

## Identity resolution

Multiple candidate refs do not automatically imply permanent `IDENTITY_HOLD`.

The resolver must compare the owner demand fingerprint against candidate records using
observable demand features such as:

- physical/mathematical setup;
- requested output;
- special condition/event;
- answer type;
- distinctive transformation.

If exactly one candidate matches the owner demand, identity may become
`SEMANTIC_MATCH_RESOLVED`. Source custody remains independently evaluated.

## Machine-readable contract

```target-demand-routing
{
  "version": "1.0",
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
  "capability_closure_states": [
    "ESTABLISHED_CURRENT_SCOPE",
    "ESTABLISHED_CANONICAL_PREREQUISITE",
    "AUTHORABLE_EXTENSION",
    "UNRESOLVED_GAP",
    "IDENTITY_BLOCKED"
  ],
  "aggregate_route_states": [
    "REACHABLE",
    "REACHABLE_WITH_PREREQUISITES",
    "REQUIRES_EXTENSION_ADMISSION",
    "BLOCKED"
  ],
  "bridge_candidate_required_fields": [
    "bridge_id",
    "target_refs",
    "teaching_goal",
    "prerequisite_refs",
    "required_new_capabilities",
    "construction",
    "representation_requirements",
    "worked_anchor",
    "misconceptions",
    "independent_check",
    "exit_task",
    "authority_state",
    "review_state"
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
    "generic_practice_does_not_close_target": true,
    "target_authority_is_independent_of_direct_source_use": true,
    "direct_source_use_is_independent_of_instructional_demand_use": true,
    "instructional_demand_use_is_independent_of_assessment_claim": true,
    "identity_is_independent_of_source_custody": true,
    "owner_waiver_is_not_mastery_evidence": true,
    "owner_waiver_cannot_bypass_capability_gap": true,
    "core1_family_scope_remains_canonical": true,
    "demand_influence_must_be_traceable": true,
    "core2a_target_use_requires_capability_closure": true,
    "core2b_target_use_requires_capability_closure_and_prior_exposure": true,
    "extension_candidate_is_not_canonical_until_admitted": true
  }
}
```

## Consumer requirements

Any prompt generator or authoring workflow for fixed targets must require a completed artifact
conforming to `Shared/library/target-demand-route.schema.json`.

The completed artifact, not a prose HOLD table, is the auditable evidence that the requested
targets remain connected to learner preparation.
