# Core Projection Contract v1.0

Status: **interface freeze for parallel work**

Owner issue: #173  
Consumer issues: #174 (canonical Atlas/data), #175 (interactive webpage builder)

This contract freezes the minimum cross-lane interface needed for the three workstreams to proceed in parallel. It does **not** replace the six role specifications in `Shared/roles/`; those remain authoritative for learner-product meaning. This document is authoritative for the **shared object boundaries, field names, and ownership rules** between Core code, canonical subject data, and the webpage builder.

---

## 1. One academic truth, multiple Core projections

The repository has two canonical academic graphs.

```text
CONCEPT GRAPH
capability
  -> microtopic
  -> inferential_jump
  -> teaching_path
  -> misconceptions / repair
  -> representations

DEMAND GRAPH
source question
  -> capability refs
  -> question family
  -> invariant demand
  -> reasoning route
  -> crux move
  -> transfer change
```

The six Cores are projections over those graphs, not six independent content databases.

| Core | Preserved object | Learner work |
|---|---|---|
| Core1 | concept map / relations / conditions | orient |
| Core1A | microtopic inferential truth | see the completed construction |
| Core1B | same microtopic inferential truth | reconstruct before reveal/repair |
| Core2 | source assessment object | see the actual demand/source answer |
| Core2A | familiar question-family demand | learn/scaffold the application reasoning move |
| Core2B | same underlying capability with changed demand | select/adapt the move without the changed decision being handed over |

Two boundary rules are frozen:

```text
Core1A / Core1B crux = microtopic inferential jump
Core2A / Core2B crux = application reasoning move / changed decision
```

and:

```text
less support != transfer
more algebra != transfer
worked example != independent evidence
```

---

## 2. Ownership boundaries for parallel agents

### #173 Core code owns

- Shared role semantics and validation;
- schema fields defined below;
- compiler/projection behavior;
- learner-facing Core rendering semantics;
- cross-reference validation;
- backward compatibility.

It must not author bulk Physics/Math/Chemistry truth.

### #174 Atlas/data owns

- capabilities, microtopics and inferential jumps;
- teaching paths and misconceptions;
- question families and invariant demand;
- canonical reasoning-route instances;
- canonical representations and reveal stages;
- Core2A scaffold content;
- Core2B transfer/change declarations.

It must not invent Shared fields or browser-only academic truth.

### #175 webpage builder owns

- rendering and interaction;
- page composition;
- workbench mounting;
- accessibility/offline behavior;
- browser tests;
- a thin adapter from compiled projection to UI state.

It must not infer academic semantics from DOM text, duplicate the capability graph, or create a page-local hint/transfer ontology.

If a lane needs a field owned by another lane, it opens/updates the owner issue instead of introducing a local substitute.

---

## 3. Canonical concept-side contract

No new concept ontology is introduced.

The existing canonical fields remain authoritative:

```text
microtopic.inferential_jump
microtopic.teaching_path[].id
microtopic.teaching_path[].role
microtopic.teaching_path[].action
microtopic.teaching_path[].why_valid
microtopic.teaching_path[].inputs
microtopic.teaching_path[].output
microtopic.elicitation
microtopic.misconceptions[]
microtopic.representation_refs[]
representation.reveal_stages[]
representation.support_stage_map[]
```

### Core1A projection

Core1A exposes the completed construction. The teaching path may be shortened only by navigation, not by changing the canonical inference.

### Core1B projection

Core1B uses the same inferential truth but preserves:

```text
predict -> attempt -> reconstruct -> diagnose -> repair -> boundary test
```

The learner attempt must occur before the reconstruction is revealed.

A second copy of the scientific explanation under `elicitation` is prohibited. Reconstruction may ask the learner through a different route, but the canonical scientific claims remain in the microtopic/teaching/representation records.

---

## 4. Canonical application-side contract

### 4.1 Structured reasoning route

A question answer may now carry:

```json
{
  "reasoning_route": [
    {
      "id": "R1",
      "kind": "REPRESENT",
      "action": "Separate horizontal and vertical motion.",
      "why_valid": "The ideal projectile model gives independent component equations.",
      "inputs": ["launch state", "gravity-only model"],
      "output": "x/y component representation"
    },
    {
      "id": "R2",
      "kind": "DECIDE",
      "action": "Use the vertical event condition to determine impact time.",
      "why_valid": "Ground impact is defined by the vertical position condition.",
      "inputs": ["delta_y = -20 m"],
      "output": "equation for the common impact time"
    }
  ],
  "crux_move_ref": "R2"
}
```

Frozen move kinds:

```text
REPRESENT
DECIDE
CONNECT
TRANSFORM
VERIFY
```

Semantics:

- **REPRESENT** — create/read a useful problem state.
- **DECIDE** — select a model, condition, target, branch, or operation.
- **CONNECT** — bridge two states/quantities/representations.
- **TRANSFORM** — execute a valid mathematical/scientific transformation.
- **VERIFY** — independently check the resulting state/claim.

A route is about **why/which move**, not merely arithmetic working.

### 4.2 Crux

`answer.crux_move_ref` is the stable identifier for the question-specific difficult reasoning move.

Rules:

- it must resolve to an id in `answer.reasoning_route[]`;
- it should identify a learner decision/bridge when one exists;
- it must not merely point at the longest calculation because that line is long;
- Core2A must expose it distinctly in the full reasoning route;
- Core2B may reuse related moves, but the changed/protected decision is declared in `transfer.protected_move_ref`.

### 4.3 Backward compatibility

The existing fields remain valid during migration:

```text
answer.reasoning[]
answer.difficult_move
```

Migration rule:

1. if `reasoning_route` + `crux_move_ref` exist, they are authoritative for Core2A/Core2B semantics;
2. otherwise the legacy prose/index fields remain the fallback;
3. compilers/renderers must not manufacture a structured route from prose and then claim it is authored truth.

---

## 5. Hints versus pedagogical scaffolds

The distinction is frozen.

### `question.hints[]`

This remains the question/source hint ladder.

Core2 preserves source-provided wording and order. It must not be silently rewritten for pedagogy.

### `question.scaffolds[]`

This is the optional pedagogical scaffold ladder for Core2A/Core2B. Core2B may use it only while preserving its changed/protected decision.

Each scaffold has:

```json
{
  "text": "Which component contains the condition that defines impact?",
  "support_kind": "CONNECT",
  "reveals": "CONCEPT",
  "supports_move_ref": "R2",
  "visual_ref": "REP-KIN-2D-EVENT",
  "visual_stage_ref": "V2"
}
```

Frozen support kinds:

```text
REPRESENT
CONNECT
EXECUTE
```

These answer a different question from `reveals`:

```text
support_kind = what cognitive help is being provided
reveals      = how much answer/method information is disclosed
```

No fixed scaffold count is required.

When both are present, staged support should normally escalate:

```text
REPRESENT -> CONNECT -> EXECUTE
```

but omitted stages are legitimate when the problem does not need them.

---

## 6. Core2B transfer protection

Existing transfer dimensions remain authoritative:

```text
model_choice
novelty
reasoning_steps
representation_translation
```

A transfer task may additionally declare:

```json
{
  "transfer": {
    "dimension": "model_choice",
    "statement": "Decide whether ideal projectile motion still applies when thrust continues after launch.",
    "builds_on": ["MIC-PHY-KIN-PROJECTILE"],
    "protected_move_ref": "R-MODEL-CHOICE"
  }
}
```

`protected_move_ref` identifies the learner decision that help must not hand over.

Core2B validation/rendering must therefore treat the protected move as a disclosure boundary.

Removing hints from a Core2A task does not create Core2B.

---

## 7. Representation binding

Visual truth remains canonical under `representation`.

Reasoning moves and scaffolds may reference a canonical representation and reveal stage:

```text
reasoning_move.representation_ref
reasoning_move.visual_stage_ref

scaffold.visual_ref
scaffold.visual_stage_ref
```

Rules:

- a visual stage may reveal only canonical elements listed for that stage;
- the webpage builder must not decide which stage corresponds to which hint;
- the same representation may be reused by Core1A, Core1B, Core2A and Core2B with different reveal policy;
- Core2B must not advance to a stage that discloses `transfer.protected_move_ref`.

---

## 8. Builder projection envelope

#175 may develop against fixtures using this stable adapter envelope. The envelope is a **compiled projection**, not a new source of truth. Its machine-readable shape is frozen in `Shared/library/core-projection.schema.json`.

```json
{
  "contract_version": "1.0",
  "core": "CORE2A",
  "concept": {
    "microtopic_ref": "MIC-...",
    "inferential_jump": "...",
    "teaching_path": [],
    "elicitation": null,
    "misconceptions": [],
    "representation_refs": []
  },
  "application": {
    "question_ref": "Q-...",
    "family_ref": "FAM-...",
    "stem": "...",
    "reasoning_route": [],
    "crux_move_ref": "R2",
    "hints": [],
    "scaffolds": [],
    "transfer": null,
    "check": "..."
  },
  "presentation": {
    "attempt_before_reveal": false,
    "show_full_construction": false,
    "initial_visual_ref": null,
    "initial_visual_stage_ref": null,
    "protected_move_refs": []
  }
}
```

The builder may add UI-only state such as expanded/collapsed panels, focus, animation frame, or local attempt text. It may not persist those as canonical academic truth.

Projection policy by Core:

| Core | attempt_before_reveal | full construction | crux behavior |
|---|---:|---:|---|
| Core1 | false | false | none |
| Core1A | false | true | inferential jump exposed |
| Core1B | true | after attempt/repair | inferential jump elicited |
| Core2 | source-defined | source answer | source demand |
| Core2A | question-first | after learner requests/reveal policy | crux highlighted |
| Core2B | true | after independent attempt/reveal policy | protected move not disclosed beforehand |

---

## 9. Validation obligations

#173 should eventually enforce these mechanically; #174/#175 may use them immediately as authoring/build rules.

- `crux_move_ref` resolves inside `reasoning_route`.
- `scaffold.supports_move_ref` resolves inside `reasoning_route`.
- representation/stage refs resolve.
- an ANSWER hint/scaffold cannot precede later lower-disclosure support.
- Core1B preserves attempt-before-reconstruction.
- Core2B has a declared transfer block.
- if `transfer.protected_move_ref` exists, it resolves to the relevant route/decision identity and no pre-attempt scaffold/visual stage hands it over.
- source hints and Core2A scaffolds remain separate.
- a representation is not attached merely as decoration; it supports a microtopic/route move.
- no browser component creates missing academic content at runtime.

---

## 10. Parallel execution rule

All three lanes may proceed now.

```text
#173 Core
  implements/validates this contract

#174 Atlas/Data
  audits and authors canonical instances against this contract

#175 Web Builder
  builds against the projection envelope using fixtures,
  then swaps fixtures for the compiled projection
```

Development is parallel. Truth integration is ordered:

```text
Core contract/schema
        ->
gold canonical dataset
        ->
production builder adapter
```

A lane must not block on unrelated completion in another lane. It blocks only on a field or semantic dependency explicitly named in this contract.

---

## 11. Gold-slice recommendation

Use one family only until the contract is proven end to end.

Preferred: **Motion in 2D — shared clock / event clock / projectile model**.

It already supplies:

- a clear inferential jump;
- canonical representations/explorers;
- familiar Core2A applications;
- Core2B model/representation changes;
- a visible reasoning crux.

NLM FBD/friction is an acceptable alternative if #174 selects it first.

---

## 12. Change control

This is interface version **1.0**.

Parallel agents may rely on the field names and ownership boundaries above.

Any incompatible rename/removal must:

1. update this contract version;
2. state the migration;
3. update #173, #174 and #175 together;
4. not silently land in only one lane.
