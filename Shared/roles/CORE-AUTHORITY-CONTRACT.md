# Core authority and dependency contract

This document defines **where each Core is allowed to get authority from**.

The six role files define learner-product meaning. The learner-product template contract defines
presentation anatomy and reveal order. This contract defines a different concern: the
authority graph that must remain stable when planners, prompt generators, authoring agents,
renderers and publication tools compose those products.

A requested production sequence is never an authority graph.

For example, an owner may request:

```text
CORE2 → CORE1 / CORE1A / CORE1B → CORE2A / CORE2B
```

That sequence may be useful operationally, but it does **not** mean Core1-family academic
truth is derived from Core2. Academic truth remains owned by canonical subject records.

## Human-readable authority graph

```text
CANONICAL ACADEMIC TRUTH
  ├── CORE1
  ├── CORE1A
  └── CORE1B

AUTHORIZED SOURCE CUSTODY
  └── CORE2

CANONICAL ACADEMIC TRUTH
+ ELIGIBLE REVIEWED DEMAND or EXPLICITLY AUTHORED PRACTICE
+ OPTIONAL LEARNER SUPPORT INPUT
  └── CORE2A

CORE2A / OTHER ESTABLISHED PRIOR EXPOSURE
+ ALREADY-TAUGHT CAPABILITY CLOSURE
+ GENUINELY CHANGED DEMAND
  └── CORE2B
```

Core2 source custody may independently be `HOLD`. That does not turn held source material
into academic authority, and it does not force valid Core1-family study products to stop when
their canonical academic inputs are complete.

## Cross-cutting authority rules

**Execution order is not derivation order.** A workflow may inspect or attempt Core2 first.
That does not make Core2 the source of Core1/Core1A/Core1B concepts.

**Canonical per-question mapping survives set planning.** A set-level topic, matrix or rung
may describe composition scope. It must not rewrite a question's canonical
`question.primary_capability_ref`.

**Demand evidence and learner eligibility are separate.** A question may be useful evidence
about assessment demand while remaining excluded, held or not yet reviewed for learner use.

**Source hints and authored scaffolds are different custody classes.**
`question.hints[]` preserves supplied/source question help. `question.scaffolds[]` is
authored pedagogical support. A downstream tool may render both, but may not relabel one as
the other.

**Extensions do not create curriculum by pressure.** A source question may require an
advanced model, bridge concept or extension. That demand does not automatically create a new
Core1A/Core1B microtopic. Canonical academic authority must admit the concept first.

**Learner estimates are not mastery evidence.** A percentage or owner estimate may influence
Core2A/Core2B routing/support where their contracts permit. It cannot reduce, expand or
replace Core1A/Core1B intrinsic conceptual scope.

**HOLD is a valid result.** Missing source custody, learner eligibility, prior exposure,
canonical teaching or visual review must remain explicit. Requested product count or
requested generation order never authorizes fabricated closure.

**Planning tools are not academic authorities.** Prompt composers, worksheet maps, run
builders and publication manifests may carry and validate references. They may not create
curriculum truth, source custody, learner mastery or canonical question identity.

## Demand Bridge / Admission

A fixed assessment demand can require capability that is not yet taught in the current canonical topic packet. That creates a planning obligation, not permission to expand Core1A/Core1B and not permission to drop the demand.

Before any fixed demand is used to shape learner application, create a **Demand Bridge / Admission** record. This is not a seventh Core and is not learner-facing academic authority.

Each fixed demand must receive exactly one capability-closure disposition:

- `WITHIN_CANONICAL_SCOPE` — required academic capability is already taught in the current canonical scope.
- `CANONICAL_PREREQUISITE_ROUTE` — required capability exists canonically elsewhere and must be linked as an explicit prerequisite route.
- `EXTENSION_ADMISSION_CANDIDATE` — required academic content is not currently canonical in the relevant teaching route; create an authoring/admission candidate for review rather than silently teaching it inside Core1A/Core1B.
- `UNRESOLVED_CAPABILITY_GAP` — required capability cannot yet be mapped to canonical truth or an admissible extension candidate; downstream learner use remains HOLD.
- `IDENTITY_HOLD` — exact assessment demand identity is unresolved, so capability closure cannot be claimed for that source item.

Source custody and learner eligibility remain independent of this disposition. A demand may be valid evidence, source-custody-held, learner-excluded and still require a bridge record.

A bridge HOLD must not be a dead end. When repository truth supports it, record the canonical prerequisite route or the exact extension-admission work that would close the gap.

Unrelated easier practice may support prerequisites, but it does not count as closure of the fixed demand. The learner progression to every fixed target must remain visible in the bridge record until the target is genuinely reachable.

## Machine-readable authority contract

The fenced block below is the machine-readable authority for the invariants above. It is not
a new academic schema and it does not replace subject package schemas.

```core-authority
{
  "version": "1.1",
  "authority_classes": {
    "CANONICAL_ACADEMIC_TRUTH": {
      "description": "Canonical subject package records: bucket/microtopic/capability/relation/representation truth.",
      "may_authorize": [
        "CORE1",
        "CORE1A",
        "CORE1B",
        "CORE2A",
        "CORE2B"
      ]
    },
    "AUTHORIZED_SOURCE_CUSTODY": {
      "description": "Reviewed source/question custody sufficient for ordinary source-backed Core2.",
      "may_authorize": [
        "CORE2"
      ]
    },
    "ELIGIBLE_REVIEWED_DEMAND": {
      "description": "Demand evidence explicitly eligible for learner application.",
      "may_authorize": [
        "CORE2A",
        "CORE2B"
      ]
    },
    "AUTHORED_PRACTICE": {
      "description": "Truthfully labelled authored application content grounded in canonical capability truth.",
      "may_authorize": [
        "CORE2A",
        "CORE2B"
      ]
    },
    "LEARNER_SUPPORT_INPUT": {
      "description": "Scoped learner evidence, owner estimate or waiver used only where role contracts permit routing/support.",
      "may_authorize": [
        "CORE2A",
        "CORE2B"
      ]
    },
    "PRIOR_EXPOSURE": {
      "description": "Recorded prior exposure/established route needed before transfer claims.",
      "may_authorize": [
        "CORE2B"
      ]
    }
  },
  "roles": {
    "CORE1": {
      "required_authority": [
        "CANONICAL_ACADEMIC_TRUTH"
      ],
      "forbidden_authority_substitution": [
        "AUTHORIZED_SOURCE_CUSTODY",
        "LEARNER_SUPPORT_INPUT"
      ]
    },
    "CORE1A": {
      "required_authority": [
        "CANONICAL_ACADEMIC_TRUTH"
      ],
      "forbidden_authority_substitution": [
        "AUTHORIZED_SOURCE_CUSTODY",
        "LEARNER_SUPPORT_INPUT"
      ]
    },
    "CORE1B": {
      "required_authority": [
        "CANONICAL_ACADEMIC_TRUTH"
      ],
      "forbidden_authority_substitution": [
        "AUTHORIZED_SOURCE_CUSTODY",
        "LEARNER_SUPPORT_INPUT"
      ]
    },
    "CORE2": {
      "required_authority": [
        "AUTHORIZED_SOURCE_CUSTODY"
      ],
      "forbidden_authority_substitution": [
        "AUTHORED_PRACTICE",
        "CANONICAL_ACADEMIC_TRUTH"
      ]
    },
    "CORE2A": {
      "required_authority": [
        "CANONICAL_ACADEMIC_TRUTH"
      ],
      "one_of_authority": [
        "ELIGIBLE_REVIEWED_DEMAND",
        "AUTHORED_PRACTICE"
      ],
      "optional_authority": [
        "LEARNER_SUPPORT_INPUT"
      ],
      "forbidden_authority_substitution": [
        "LEARNER_SUPPORT_INPUT"
      ]
    },
    "CORE2B": {
      "required_authority": [
        "CANONICAL_ACADEMIC_TRUTH",
        "PRIOR_EXPOSURE"
      ],
      "one_of_authority": [
        "ELIGIBLE_REVIEWED_DEMAND",
        "AUTHORED_PRACTICE"
      ],
      "optional_authority": [
        "LEARNER_SUPPORT_INPUT"
      ],
      "forbidden_authority_substitution": [
        "LEARNER_SUPPORT_INPUT"
      ]
    }
  },
  "invariants": {
    "execution_order_is_not_authority_order": true,
    "core2_hold_does_not_rewrite_academic_authority": true,
    "core2_hold_does_not_automatically_block_valid_study_roles": true,
    "preserve_question_primary_capability_ref": true,
    "set_scope_must_not_overwrite_question_primary": true,
    "demand_evidence_and_learner_eligibility_are_distinct": true,
    "source_hints_and_authored_scaffolds_are_distinct": true,
    "extensions_require_canonical_admission_before_core1_family": true,
    "learner_estimate_is_not_mastery_evidence": true,
    "learner_estimate_cannot_change_core1_family_intrinsic_scope": true,
    "prompt_and_planning_outputs_are_not_academic_authority": true,
    "unresolved_authority_dependency_must_hold": true,
    "every_fixed_demand_requires_bridge_disposition": true,
    "fixed_demand_cannot_disappear_on_scope_mismatch": true,
    "bridge_does_not_create_core_role": true,
    "bridge_does_not_admit_extension_to_core1_family": true,
    "core2a_requires_established_capability_closure": true,
    "core2b_requires_established_capability_closure_and_prior_exposure": true,
    "fixed_demand_progression_must_remain_visible": true,
    "generic_practice_does_not_close_fixed_demand": true
  },
  "canonical_field_rules": {
    "question_primary": "question.primary_capability_ref",
    "source_hints": "question.hints[]",
    "authored_scaffolds": "question.scaffolds[]",
    "core1_family_crux": "microtopic.inferential_jump"
  },
  "planning_distinctions": {
    "execution_order": "PRODUCTION_CONTROL_ONLY",
    "set_level_scope": "COMPOSITION_CONTEXT_ONLY",
    "demand_evidence": "MAY_EXIST_WITHOUT_LEARNER_ELIGIBILITY",
    "learner_eligibility": "INDEPENDENT_REVIEW_STATE",
    "demand_bridge": "CAPABILITY_CLOSURE_CONTROL_ONLY"
  },
  "allowed_dependency_states": [
    "PASS",
    "HOLD",
    "FAIL"
  ],
  "demand_bridge": {
    "is_core_role": false,
    "required_for_every_fixed_demand": true,
    "dispositions": {
      "WITHIN_CANONICAL_SCOPE": {
        "capability_closure": "ESTABLISHED",
        "requires": [
          "canonical_capability_refs"
        ]
      },
      "CANONICAL_PREREQUISITE_ROUTE": {
        "capability_closure": "ROUTED",
        "requires": [
          "canonical_prerequisite_refs",
          "prerequisite_route"
        ]
      },
      "EXTENSION_ADMISSION_CANDIDATE": {
        "capability_closure": "NOT_YET_ADMITTED",
        "requires": [
          "unresolved_prerequisite_demands",
          "extension_admission_candidate"
        ],
        "downstream_application_state": "HOLD"
      },
      "UNRESOLVED_CAPABILITY_GAP": {
        "capability_closure": "UNRESOLVED",
        "requires": [
          "unresolved_prerequisite_demands",
          "hold_close_when"
        ],
        "downstream_application_state": "HOLD"
      },
      "IDENTITY_HOLD": {
        "capability_closure": "UNRESOLVED",
        "requires": [
          "candidate_question_refs",
          "hold_close_when"
        ],
        "downstream_application_state": "HOLD"
      }
    },
    "required_record_fields": [
      "demand_ref",
      "canonical_primary_capability_ref",
      "canonical_capability_refs",
      "canonical_prerequisite_refs",
      "unresolved_prerequisite_demands",
      "disposition",
      "prerequisite_route",
      "extension_admission_candidate",
      "source_custody_state",
      "learner_eligibility_state",
      "core2a_eligibility",
      "core2b_eligibility",
      "hold_close_when"
    ],
    "core2a_allowed_capability_closure": [
      "ESTABLISHED",
      "ROUTED"
    ],
    "core2b_allowed_capability_closure": [
      "ESTABLISHED",
      "ROUTED"
    ],
    "core2b_requires_prior_exposure": true
  }
}
```

## Consumer requirements

Any planner, prompt generator, authoring agent, learner renderer or publisher that emits
instructions about more than one Core must preserve this contract.

At minimum, a generated multi-Core prompt must make these facts recoverable:

1. the requested execution order;
2. the authority source for each requested role;
3. any unresolved authority dependency as `HOLD`;
4. the distinction between set-level scope and per-question canonical primaries;
5. the distinction between demand evidence and learner eligibility;
6. extension demands that remain outside canonical Core1-family teaching;
7. learner estimates as support inputs rather than mastery/curriculum authority.
8. one Demand Bridge / Admission disposition for every fixed demand;
9. any canonical prerequisite route or extension-admission candidate needed to close capability gaps;
10. Core2A/Core2B eligibility only after capability closure, with Core2B additionally requiring prior exposure.

A consumer may use different wording or a machine-readable projection, but it may not collapse
those distinctions.
