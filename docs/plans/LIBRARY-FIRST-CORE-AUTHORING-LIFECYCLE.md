# Library-first Core authoring lifecycle

Status: **DRAFT PROPOSAL**

Purpose: define a default authoring lifecycle for new learner-product work so agents create durable academic truth first, detect overlap before proliferation, reuse one six-Core renderer, add static visual support where it improves understanding, and surface high-value interactive opportunities without turning the method into another delivery gate.

This document is a proposal for the authoring-method programme tracked in issue #322. Until merged/approved, it is not current implementation authority.

---

## 1. Problem this lifecycle is intended to prevent

Repeated authoring creates avoidable drift when an agent starts from the delivery surface instead of the academic source of truth.

Common failure modes:

- new content is written directly into HTML instead of first entering the canonical library;
- a new concept/question is created without checking whether an owner concept, source item, family or variant already exists;
- similar Core1/Core1A/Core1B/Core2/Core2A/Core2B material is duplicated instead of being linked through one canonical content graph;
- diagrams are added ad hoc, inline, or only after review discovers that a concept is hard to understand text-only;
- interactive pages are created because a topic is “hard” rather than because interaction has a specific cognitive benefit;
- generated webpages become de facto authority because agents append directly to them;
- later agents cannot tell whether a new record is a duplicate, a variant, a transfer item, a source conflict or a genuinely new concept;
- publication exposes missing visual/metadata coverage only after expensive review.

The lifecycle below changes the default sequence so these problems are handled at authoring time.

---

## 2. Governing principle

> **Academic truth enters the canonical library first. Learner-facing pages are validated projections of that truth.**

An agent may create or extend academic content only through canonical records and references. HTML is generated output.

The normal path is:

```text
STEP -1  locate canonical owner
    ↓
STEP 0   save candidate in library
    ↓
STEP 0.5 identity / dedup / lineage classification
    ↓
STEP 1   assign six-Core role(s) and subtopic membership
    ↓
STEP 2   assess representation need and author/reuse SVG
    ↓
STEP 3   score interactive opportunity
    ↓
STEP 4   regenerate subtopic/product HTML
    ↓
STEP 5   inspect coverage and learner-facing quality
    ↓
STEP 6   exact-render review / owner publication decision
    ↓
STEP 7   publish residual gaps and interactive opportunities
```

This is a **method and recording convention**, not a content blocker. If evidence is incomplete, record the incompleteness explicitly rather than inventing values or refusing useful authoring work.

---

# 3. STEP -1 — locate the canonical owner before authoring

## Goal

Prevent two agents from creating separate authorities for the same academic concept.

Before adding a new record, identify:

- subject;
- unit/package;
- bucket or subtopic;
- primary capability;
- question family, when relevant;
- source/provenance class;
- existing representation owner, when relevant.

The agent should search current canonical packages and source inventories before creating a new owner.

### Required reasoning outcome

The agent should be able to state one of:

```text
OWNER_FOUND
OWNER_EXTENDED
NEW_OWNER_REQUIRED
OWNER_CONFLICT
```

### Example

A new static-friction problem should normally resolve to an existing friction capability/microtopic instead of creating a second “friction threshold” concept merely because the wording differs.

### Anti-drift rule

Do not derive ownership from:

- HTML headings;
- filenames alone;
- prettified IDs;
- an unmerged PR;
- a legacy page that is not current canonical authority.

Current `main` canonical records are the starting authority; merged history may explain provenance.

---

# 4. STEP 0 — library-first intake

## Goal

Persist useful academic work in the canonical data model before presentation work begins.

New material should be saved as a candidate record under the owning subject library/package, using the repository's current package/schema model.

Typical candidate types:

- microtopic/concept;
- capability;
- question family;
- authored question;
- source-derived/adapted question;
- teaching route;
- representation;
- relation/prerequisite.

### Default status

New author-created material should default to the repository's candidate/non-final state unless stronger authority is already established.

### Minimum question identity

A new question should carry enough information to locate and compare it later:

```text
id
status
primary_capability_ref
family_ref
provenance/source identity
role/exposure intent
answer/reasoning authority
```

### Minimum concept identity

A new concept/microtopic should carry:

```text
id
title / learner label authority
primary capability ownership
difficulty metadata where supported
prerequisite/relationship information
```

### Minimum representation identity

A new representation should carry:

```text
id
purpose
owner/used_by relationship
reveal-stage intent where applicable
rendered_asset_refs
```

### Anti-drift rule

Do not begin academic authoring in:

```text
public/**
docs/** generated learner pages
standalone/** generated learner pages
```

Those surfaces may be inspected as evidence but are not where new academic truth is authored.

---

# 5. STEP 0.5 — identity, deduplication and lineage

## Goal

Decide the relationship between the candidate and existing canonical records before selecting it into a product.

Deduplication must happen on structured academic identity, not merely stem similarity.

## Comparison order

### 5.1 Source identity first

Compare, where available:

```text
original_identifier
adaptation.parent_ref
source_refs
exam / year / paper / question number
source acquisition / evidence record
```

### 5.2 Academic identity second

Compare:

```text
primary capability
question family
stable crux / decision
conditions
representation
response type
transfer dimension
```

### 5.3 Text similarity last

Normalized text similarity is supporting evidence only. It must not override source identity or pedagogical role.

## Required classification

Each candidate should be classified as one of:

```text
REUSE_EXISTING
EXTEND_EXISTING
KEEP_AS_VARIANT
CREATE_NEW
SOURCE_CONFLICT
```

Recommended interpretation:

- **REUSE_EXISTING** — same canonical record; no new academic record needed.
- **EXTEND_EXISTING** — same owner record needs additional metadata, representation, route or evidence.
- **KEEP_AS_VARIANT** — same concept/source family but materially different representation, conditions, transfer dimension or learner task.
- **CREATE_NEW** — genuinely distinct canonical identity.
- **SOURCE_CONFLICT** — same claimed source identity but incompatible stem/options/answer/conditions/provenance.

## Preserve complementary roles

Conceptual overlap is not automatically duplication.

For example:

```text
Core1A  construction of friction-state reasoning
Core2A  supported application of that reasoning
Core2B  transfer under changed conditions
```

may legitimately coexist.

By contrast, two Core2A items with the same source, model, crux and representation where only numbers changed may warrant reuse or consolidation.

## Suggested audit record

The dedup tool/report may emit a non-authoritative record such as:

```yaml
candidate: Q-...
matched_record: Q-...
classification: KEEP_AS_VARIANT
basis:
  - same primary capability
  - same family
  - different representation
  - different transfer dimension
decision_owner: canonical package
```

The audit report is evidence; it must not become a second academic datastore.

---

# 6. STEP 1 — assign six-Core role(s) and subtopic membership

## Goal

Place each accepted canonical record into the learner progression without hand-authoring webpage content.

The six roles remain:

```text
Core1   orientation
Core1A  construction
Core1B  reconstruction
Core2   source custody / source question
Core2A  supported practice
Core2B  transfer
```

The authoring operation is:

> append to the subtopic's **canonical content graph**, then regenerate its learner page(s).

It is not:

> open the HTML and paste a new card.

## Role examples

```text
verified source question            → Core2 candidate
worked/scaffolded authored problem  → Core2A
changed model/representation task   → Core2B
canonical explanation/construction  → Core1A
predict-attempt-reconstruct route   → Core1B
orientation map / concept framing   → Core1
```

## Subtopic ownership

Every selected learner unit/question should resolve to one canonical subtopic/microtopic owner where the product model supports it.

A subtopic can then project:

```text
SUBTOPIC
├── Core1
├── Core1A
├── Core1B
├── Core2
├── Core2A
└── Core2B
```

Not every subtopic must have every role immediately. Missing coverage should be recorded honestly.

## Anti-drift rule

Do not duplicate prose merely because multiple roles use the same concept.

Use canonical references and role-specific projections.

---

# 7. STEP 2 — representation-needs assessment and SVG authoring

## Goal

Make visual reasoning a planned part of authoring rather than a late review repair.

Every new concept/question should receive a representation-needs classification:

```text
NONE
OPTIONAL
RECOMMENDED
REQUIRED
```

## REQUIRED / RECOMMENDED indicators

A visual representation is usually valuable when the learner must reason about:

- geometry;
- direction;
- force ownership;
- vector components;
- graph shape;
- spatial relationship;
- apparatus;
- molecular/structural arrangement;
- coordinate systems;
- before/after state;
- multiple bodies or constraints;
- a sequence of model states.

Examples:

```text
inclined-plane FBD              REQUIRED
vector decomposition            REQUIRED
coordinate geometry             RECOMMENDED / REQUIRED
simple oxidation-state recall   NONE / OPTIONAL
routine scalar arithmetic       NONE / OPTIONAL
```

## Default visual strategy

Prefer **static or staged SVG first**.

Do not jump from “hard concept” directly to a JavaScript interactive.

A well-designed SVG is:

- reusable;
- printable;
- accessible;
- testable;
- usable in multiple Core roles;
- cheaper to maintain;
- suitable for later interaction if needed.

## Existing SVG contract

Reuse the repository's current representation contract:

```html
<svg ...>
  <title>...</title>
  <desc>...</desc>
  <g data-g9-stage-id="S1">...</g>
  <g data-g9-stage-id="S2">...</g>
</svg>
```

and canonical:

```text
representation.rendered_asset_refs
```

The normal flow is:

```text
question/concept
    ↓
representation reference
    ↓
canonical representation record
    ↓
SVG asset
    ↓
render_core
```

## Anti-drift rule

Do not create one-off inline diagrams in generated pages if the same representation should be reusable through canonical representation records.

---

# 8. STEP 3 — interaction-opportunity triage

## Goal

Identify where an interactive webpage would materially improve learning, without creating interactives merely because a topic is difficult.

Every subtopic may be assessed on structured dimensions:

```text
concept difficulty
representation burden
misconception sensitivity
state-change value
parameter-exploration value
multi-representation synchronization value
boundary/exception exploration value
```

## Example assessment

```yaml
concept: Static and kinetic friction
concept_difficulty: HARD
representation_need: REQUIRED
misconception_sensitivity: HIGH
state_change_value: HIGH
parameter_exploration_value: HIGH
interactive_candidate: HIGH
reason: >
  Varying pull angle changes normal force, friction limit and state;
  simultaneous visualization exposes the model more effectively than
  several static near-duplicate diagrams.
```

Contrast:

```yaml
concept: Zero net force allows steady motion
concept_difficulty: MEDIUM
representation_need: OPTIONAL
state_change_value: LOW
parameter_exploration_value: LOW
interactive_candidate: LOW
```

## Strong reasons to recommend interaction

Recommend an interactive when one or more of these are true:

1. learner manipulation of a variable reveals a meaningful consequence;
2. a state transition is central to understanding;
3. multiple representations need to stay synchronized;
4. prediction → manipulation → observation exposes a misconception;
5. static teaching would require many nearly identical diagram variants;
6. model boundaries/exceptions are best explored by changing conditions.

## Weak reasons

Do not recommend interaction solely because:

- the difficulty badge is HARD;
- the topic is long;
- the agent can build an interactive;
- an existing product has one;
- animation would look attractive.

## Output

The publishing/build report should surface **interactive opportunities**, not automatically create them.

Suggested statuses:

```text
LOW
MEDIUM
HIGH
EXISTING
NOT_APPLICABLE
```

---

# 9. STEP 4 — deterministic subtopic/product rendering

## Goal

Regenerate learner pages from canonical content rather than appending to generated HTML.

The product pipeline remains conceptually:

```text
library/package
    +
source/question bank
    ↓
product manifest / selection
    ↓
render_core
    ↓
six-Core HTML
```

A future subtopic landing page may aggregate role links/content, but it must still be derived from the same canonical graph and renderer path.

## Rule

There is one canonical subtopic identity.

Core pages, question cards, representations and any later explorer link should resolve back to it.

## Anti-drift rule

No separate “webpage data file” should be hand-maintained if it merely duplicates package authority.

---

# 10. STEP 5 — coverage and learner-facing inspection

## Goal

Make incomplete coverage visible before publication without turning the coverage report into an excuse not to author.

For every subtopic/product, generate a coverage view similar to:

| Dimension | Example state |
|---|---|
| Core1 | present |
| Core1A | present |
| Core1B | present |
| Core2 | 4 verified |
| Core2A | 5 |
| Core2B | 5 |
| concept difficulty | HARD |
| question difficulty | complete / partial |
| representation need | REQUIRED |
| SVG coverage | complete |
| interactive opportunity | HIGH |
| source custody | verified / partial |
| exact-render review | pending |

The report should distinguish:

```text
PRESENT
MISSING
PARTIAL
NOT_APPLICABLE
UNKNOWN
```

Do not convert UNKNOWN into PASS.

## Coverage is guidance, not a new content gate

The report should help the agent decide what to improve next.

It must not become another broad “content complete” refusal mechanism unless an explicit publication contract requires a specific safety condition.

---

# 11. STEP 6 — exact-render review and publication

## Goal

Preserve existing publication integrity while keeping authoring flexible.

Normal sequence:

```text
canonical records
↓
render
↓
learner-state / quality inspection
↓
exact render identity
↓
independent review / owner judgement
↓
accepted publication
```

The agent should never “fix” publication by manually changing generated `docs/` output.

Generated Pages must remain rebuildable from source authority.

---

# 12. STEP 7 — residual-gap and interactive-opportunity report

## Goal

Turn publication into useful feedback for the next author rather than a terminal state.

After build/review, report:

```text
ACADEMIC_GAPS
REPRESENTATION_GAPS
METADATA_GAPS
INTERACTIVE_OPPORTUNITIES
SOURCE_CUSTODY_GAPS
```

Example:

```text
Static friction
  concept difficulty: HARD
  Core coverage: strong
  SVG coverage: strong
  interaction opportunity: HIGH
  existing explorer: yes/no
  reason: state transition + parameter dependence

Third law
  concept difficulty: MEDIUM
  Core coverage: strong
  SVG coverage: strong
  interaction opportunity: MEDIUM

Zero net force
  concept difficulty: MEDIUM
  SVG coverage: sufficient
  interaction opportunity: LOW
```

This report should be generated/read-only wherever possible.

---

# 13. Agent authoring contract

A novice authoring agent should be able to follow this sequence:

1. Find the canonical owner.
2. Save the candidate to the library/package.
3. Run structured dedup/lineage analysis.
4. Reuse/extend/variant/new/conflict classification.
5. Assign the relevant six-Core role(s).
6. Attach the record to its subtopic owner.
7. Classify representation need.
8. Reuse or author canonical SVG when warranted.
9. Classify interactive opportunity.
10. Regenerate the product/subtopic view.
11. Inspect coverage and learner-facing behavior.
12. Record residual opportunities.
13. Publish only through the repository's accepted publication process.

## Explicit prohibitions

Do not:

- author canonical academic truth directly in generated HTML;
- create a new concept before searching for an existing owner;
- infer source identity from text similarity alone;
- infer question difficulty from Core role;
- treat conceptual overlap as automatic duplication;
- duplicate concept labels independently across questions;
- create an interactive solely because a topic is hard;
- use raw internal IDs as learner labels;
- silently invent missing metadata;
- treat an unmerged PR as repository truth;
- weaken renderer/review/publication semantics just to obtain a clean report.

---

# 14. Suggested tool support

The method becomes much easier for novice agents if the repository exposes a small number of reusable commands rather than many ad hoc checks.

Potential interfaces:

```bash
# Find candidate owner / overlaps before authoring
python3 Shared/tools/content_intake.py inspect <candidate-or-record>

# Read-only overlap report
python3 Shared/tools/overlap_audit.py --product <slug>

# Coverage / representation / interaction report
python3 Shared/tools/unit_status.py <unit-or-product>

# Existing deterministic product build
python3 Shared/tools/build_products.py build --only <slug>
```

Exact filenames/APIs should follow the live architecture when implementation begins.

The important architectural rule is **one shared intake/projection path**, not one helper per subject.

---

# 15. Data-model additions to consider

Do not add fields merely for UI convenience. Prefer existing canonical relationships where possible.

Potential normalized concepts:

## 15.1 Dedup/lineage

Prefer existing:

```text
source_refs
original_identifier
adaptation.parent_ref
primary_capability_ref
family_ref
transfer
```

Add new lineage fields only when the current schema cannot express a required relationship.

## 15.2 Representation need

Possible controlled authoring metadata:

```text
NONE
OPTIONAL
RECOMMENDED
REQUIRED
```

This belongs on the concept/question-to-representation authoring relationship, not in CSS/HTML.

## 15.3 Interactive opportunity

Prefer a derived/read-only assessment over a canonical “must build interactive” flag.

If persisted, store structured reasons/dimensions, not only a scalar score.

---

# 16. Anti-drift protections

## A. One source of academic truth

Canonical package/library records own academic meaning.

Generated HTML, reports and search indexes are projections.

## B. One learner renderer

Do not introduce:

```text
render_nlm.py
render_subtopic.py
build_question_html.py
```

as alternate production paths when `render_core.py` can own the projection.

## C. One canonical subtopic owner

Questions and representations should resolve to an existing concept/capability owner or explicitly create one.

## D. Dedup before proliferation

Source identity and canonical relationships precede text similarity.

## E. Visuals are reusable records

Representation records and SVG assets are canonical/reusable; page-local diagrams are the exception.

## F. Interaction is evidence-driven

A hard badge alone does not create an interactive requirement.

## G. Reports do not become academic authority

Overlap, coverage and opportunity reports are derived evidence.

## H. Generated Pages remain disposable

Deleting generated Pages output must not erase academic truth.

## I. Honest unknowns

Missing difficulty, lineage, source custody or visual support remains UNKNOWN/PARTIAL until authored or verified.

## J. Merged-current authority

Current `main` is the implementation baseline. Merged history may explain provenance. Unmerged PR content is never silently imported as truth.

---

# 17. Proposed rollout

This lifecycle should be introduced incrementally.

## Phase A — method only

- document the lifecycle;
- update novice author prompts/templates;
- teach library-first + dedup + visual/interaction triage;
- no new content gate.

## Phase B — read-only audit support

- owner lookup;
- overlap report;
- coverage report;
- representation-needs report;
- interaction-opportunity report.

Outputs are advisory/read-only.

## Phase C — renderer/projection integration

- ensure selected canonical records project consistently into subtopic/six-Core views;
- ensure SVG references render through the existing representation path;
- expose safe metadata consistently.

## Phase D — pilot

Use one mature product, e.g. NLM, as a witness:

- ingest one genuinely new item;
- ingest one near-duplicate;
- ingest one legitimate transfer variant;
- add/reuse one staged SVG;
- produce one HIGH interactive-opportunity recommendation;
- regenerate pages;
- verify no direct HTML authoring occurred.

## Phase E — cross-subject falsifier

Exercise at least:

- one product with strong six-Core coverage;
- one product with empty/weak Core2;
- one Mathematics product;
- one Chemistry product.

The method should work without NLM/Physics-specific assumptions.

---

# 18. Success criteria

The lifecycle is working when a novice agent can add useful content and another agent can reconstruct why it exists without reading generated HTML.

Evidence should show:

- new content first appears in canonical library/package authority;
- every new record has an owner concept/capability;
- duplicate/variant/conflict reasoning is explicit;
- six-Core role assignment is structured;
- representation need is assessed consistently;
- conceptual diagrams use reusable SVG representation records;
- high-value interactives are highlighted with reasons rather than created by reflex;
- learner pages are regenerated from canonical data;
- residual gaps/opportunities are visible after build;
- no second renderer or duplicate metadata authority appears.

---

# 19. Non-goals

This proposal does not itself:

- rewrite existing academic content;
- normalize every historical package;
- require an SVG for every question;
- require an interactive for every HARD topic;
- replace `render_core.py`;
- define a second publication gate;
- implement global search;
- decide the final schema shape before live implementation inspection;
- import unmerged work.

---

# 20. Relationship to issue #322

This proposal is intended as a refinement of the “one model for authoring learner products” direction:

- **Source/Unit first** becomes explicit as canonical-owner discovery + library-first intake.
- **One package / one renderer** is preserved.
- **Quality by craft** gains a concrete representation-needs and interaction-opportunity practice.
- **No content blocker** is preserved: overlap/coverage/opportunity tools guide and record rather than broadly refusing delivery.
- **Step-back thinking** is moved earlier: agents must decide ownership, duplication class, representation need and interaction value before generating more surface area.

If adopted, the implementation issue should fold these concepts into the current method/protocol and tooling rather than creating a parallel workflow.
