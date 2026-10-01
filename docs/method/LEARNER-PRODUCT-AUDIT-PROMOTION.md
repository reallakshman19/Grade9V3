# Learner Product Audit & Promotion Protocol (LPAP-v1)

Status: **PROPOSED**  
Date: 2026-10-01  
Scope: learner-facing Core products and interactive learning webpages entering Grade9V3 from an existing draft PR, an uploaded artifact, or a TEST-page intake.

## 1. Purpose

LPAP-v1 defines how a candidate learner product is independently audited, reconciled with repository authority, corrected, integrated into learner navigation, and presented for Owner acceptance.

It is intentionally not a second authoring method, curriculum store, renderer, Question Bank, publication store, or approval system.

Existing authority remains:

- Relay V3.1 records and reconstructs engineering work.
- `docs/method/PROTOCOL.md` governs one unit's authoring/review method.
- canonical subject/library records remain academic data authority;
- `Shared/tools/render_core.py` remains the governed Core renderer where applicable;
- `Shared/tools/accept_product.py` remains the publication entry point for governed rendered products;
- the Owner alone accepts or rejects one exact rendered digest.

LPAP adds one missing layer: a common path for independently auditing externally produced or draft learner artifacts before they are promoted into the main learner experience.

## 2. Normative language

The words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are normative.

A machine PASS proves only the property that the machine actually checked. It MUST NOT be described as independent academic review.

A reviewer recommendation, severity label, or automated result MUST NOT grant publication authority. The Owner decides publication on an exact version.

## 3. Governing model

Every candidate is audited through:

```text
COMMON AUDIT KERNEL
+ PRODUCT ROLE PROFILE
+ CONTENT/RUNTIME MODULES
+ ESCALATION RULES
```

The product role answers:

> What learner job is this product supposed to perform?

The content/runtime modules answer:

> What claims and mechanisms inside the artifact require independent verification?

This separation is mandatory. A mathematically correct page can still violate its Core role; a pedagogically coherent page can still contain a wrong equation.

## 4. Canonical intake invariant

Regardless of origin, every promotion candidate MUST normalize to:

```text
one candidate
→ one draft PR
→ one exact head SHA
→ one declared candidate scope
→ one deduplication/lineage reconciliation
→ one audit plan
→ one audit packet
→ one corrected candidate
→ one Owner decision on an exact rendered/output digest
```

Uploads and TEST-page submissions are intake adapters only. They MUST NOT create separate downstream audit protocols.

### 4.1 Existing draft PR

A draft or open PR targeting `main` may become an LPAP candidate when:

- it contains an explicit LPAP intake manifest; or
- it is explicitly labelled/requested for learner-product promotion; or
- candidate discovery finds learner-facing artifacts and reports that promotion review is appropriate.

Discovery MUST be cheap and informational for unrelated engineering PRs.

### 4.2 Uploaded artifact

An uploaded HTML, PDF, ZIP, SVG, or supporting source bundle MUST first be recorded with:

- original filename;
- SHA-256;
- media type;
- supplied source/reference files;
- claimed subject;
- claimed Core/product role;
- claimed topic/subtopic if supplied;
- upload provenance;
- requested publication intent.

The upload path SHOULD create a temporary branch and draft PR. From that point the standard PR route applies.

### 4.3 TEST page

A TEST page is a preview/intake surface, not a publisher.

It MAY:

- accept candidate files;
- render sandboxed previews;
- calculate digests;
- perform local structural checks;
- collect subject/product/source metadata;
- show responsive previews;
- construct an LPAP intake manifest.

A static public page MUST NOT contain a repository write token or deployment credential.

If one-click draft-PR creation is required, it MUST use an authenticated least-privilege GitHub App or trusted backend. That service SHOULD be restricted to candidate branch/file/PR creation and MUST NOT merge to `main` or deploy production Pages.

## 5. Exact-version rule

Every audit packet MUST bind to:

- candidate PR number or intake identity;
- exact candidate head SHA;
- exact artifact digest(s);
- audit-profile version;
- canonical-basis digest or equivalent source-state identity where applicable.

When the PR head changes, evidence tied to the old head remains historical evidence and MUST NOT silently apply to the new bytes.

Expensive evidence MAY be reused only when its complete reuse key still matches.

## 6. Deduplication and lineage reconciliation

Deduplication happens before substantive promotion review.

The protocol MUST distinguish:

- **DUPLICATE** — the same learner/source object; reuse one identity;
- **VARIANT / ADAPTATION** — a different object derived from another; preserve separate identity and lineage;
- **RELATED** — shares capability, family, concept, or source context but is not the same object;
- **NEW** — no existing canonical identity applies;
- **UNRESOLVED** — evidence is insufficient to classify safely.

String similarity alone MUST NOT collapse records.

### 6.1 Identity-first resolution

Incoming content MUST first be reconciled against existing canonical IDs, source locators, product identities, and lineage records.

Existing canonical identity outranks filename similarity.

### 6.2 Exact byte deduplication

Every incoming file and significant embedded asset SHOULD have a SHA-256.

Exact digest matches can establish byte identity, but byte difference alone does not establish semantic novelty.

### 6.3 Normalized-content comparison

HTML, SVG, or text MAY also receive a normalized digest after removal of irrelevant variance such as:

- generated timestamps;
- formatting-only whitespace;
- known volatile generated identifiers.

Both raw provenance digest and normalized digest MUST be retained. The normalized digest MUST NOT replace source custody.

### 6.4 Academic identity comparison

Questions and concepts MUST be compared using structured meaning where available.

For questions, relevant evidence may include:

- source locator;
- canonical question ID;
- stem/subpart structure;
- givens;
- requested quantity;
- answer/options;
- figure identity;
- adaptation parent;
- capability/family refs.

A numerical variant can belong to the same question family without being the same question record.

### 6.5 Product identity

A learner product SHOULD have one logical product identity such as:

`subject + topic/subtopic + Core role + product slug`

Revisions SHOULD update the product instead of creating filename-level pseudo-versions such as `final-v2-new.html`.

Exact renders remain separately identifiable by digest.

### 6.6 Audit finding deduplication

A repeated defect mechanism SHOULD be grouped into one finding listing affected records.

A stable finding key SHOULD be based on:

```text
audit rule
+ canonical item/ref
+ affected field/surface
+ defect mechanism
```

Across renders, the same finding becomes `OPEN`, `FIXED`, `WONT_FIX`, or `REGRESSED`; it SHOULD NOT be recreated as an unrelated finding.

### 6.7 Audit-run reuse

An audit run may be reused only when all applicable evidence keys match, for example:

```text
candidate artifact digest
+ exact head SHA or immutable content basis
+ audit-profile version
+ canonical/source basis digest
```

### 6.8 Intrinsic versus contextual evidence

Intrinsic evidence MAY be reused by content digest.

Example: an SVG has no clipping at a given viewport.

Context-sensitive conclusions MUST include role/location context.

Example: the same SVG may be appropriate in Core1A but reveal the deciding construction too early in Core2.

### 6.9 Deduplication output

Before deep audit, produce a reconciliation table:

| Incoming item | Existing match | Classification | Basis | Action |
|---|---|---|---|---|
| item/ref | canonical ref or NONE | DUPLICATE / VARIANT / RELATED / NEW / UNRESOLVED | evidence | reuse / link lineage / create candidate / investigate |

LPAP MUST NOT create a second curriculum database, question catalog, source ledger, or product registry merely to track promotion.

## 7. Audit-plan selector

Each candidate MUST receive a deterministic audit plan.

The selector uses:

1. declared product role;
2. detected content/features;
3. source-custody claims;
4. cross-Core claims;
5. runtime/interactive behavior.

Example:

```text
CORE2 + equations + instructional SVG + source custody
→ Common Kernel
→ Core2 Deep Profile
→ Equation Module
→ SVG/Diagram Module
→ Source-Custody Module
→ Cross-Core Module if mappings are present
```

Example:

```text
CORE1B + reconstruction prompts only
→ Common Kernel
→ Core1B Role Profile
```

Example:

```text
CORE2B + executable graph
→ Common Kernel
→ Core2B Role Profile
→ Interactive Deep Profile
→ Equation Module where applicable
→ SVG/Diagram Module
→ Cross-Core Module
```

The selected plan MUST be written into the audit packet.

## 8. Common Audit Kernel

Every learner-facing candidate receives the Common Audit Kernel.

### K1. Identity and scope

Confirm:

- subject;
- grade;
- topic;
- subtopic;
- Core/product role;
- logical product identity;
- source or authoring basis;
- intended learner;
- claimed scope;
- declared denominator where applicable.

The visible product MUST NOT imply broader coverage than the evidence supports.

### K2. Academic correctness

Verify applicable:

- definitions;
- scientific statements;
- mathematical relationships;
- notation;
- units;
- conventions;
- assumptions;
- boundary conditions;
- terminology.

Substantive equations MUST be independently checked.

### K3. Completeness

Compare against an external/canonical denominator rather than the candidate's own navigation count.

Classify content as:

- `PRESENT_CORRECT`
- `PRESENT_INCOMPLETE`
- `PRESENT_WRONG`
- `MISSING`
- `EXTRA_SUPPORTED`
- `EXTRA_UNSUPPORTED`

### K4. Internal consistency

Check consistency among:

- prose;
- equations;
- diagrams;
- examples;
- answers;
- hints;
- labels;
- source identifiers;
- navigation.

### K5. Learner-role fidelity

Verify that the product actually requires the kind of learner thinking assigned to its role.

Useful content is not automatically role-conformant content.

### K6. Pedagogical coherence

Inspect:

- sequencing;
- prerequisite use;
- cognitive jumps;
- examples;
- checks;
- feedback;
- scaffolding;
- transfer.

Presence of cards/headings is not evidence of pedagogy.

### K7. Representation integrity

Audit meaning-bearing:

- SVGs;
- diagrams;
- graphs;
- tables;
- equation layouts;
- animations;
- coordinate plots;
- vector figures;
- geometric constructions.

Academic/semantic correctness matters independently of rendering quality.

### K8. Typography and hierarchy

Inspect:

- readable type;
- heading hierarchy;
- mathematical legibility;
- line length;
- information density;
- contrast;
- spacing;
- grouping;
- alignment;
- emphasis.

### K9. Responsive layout

Inspect representative:

- tablet landscape;
- tablet portrait;
- compact/mobile widths.

Verify:

- no accidental page-level horizontal overflow;
- readable equations/diagrams;
- stable navigation;
- meaningful stacking;
- no hidden instructional content.

### K10. Accessibility and input

Inspect:

- semantic structure;
- keyboard navigation;
- visible focus;
- touch targets;
- text alternatives;
- SVG accessibility;
- colour dependence;
- contrast;
- reduced motion;
- form/control labels;
- textarea/input usability.

Grade9V3's existing 48px tablet touch-target convention remains the local target where applicable.

### K11. Navigation and escape routes

Every promoted learner product SHOULD provide appropriate routes to:

- Home;
- subject;
- topic/subtopic;
- related Core where justified;
- Question Bank where relevant.

Learner-facing pages MUST NOT become accidental dead ends.

### K12. Deployability and runtime integrity

Verify:

- intended production path;
- Pages reachability;
- asset existence;
- relative URL correctness;
- offline/runtime claims;
- local state/version behavior;
- no accidental repository-only links.

## 9. Deep Audit Profile: Core2

### 9.1 Role

Core2 preserves authentic assessment/question demand:

```text
question
→ learner attempt
→ optional staged support
→ continued work
→ full solution/check
```

Core2 MUST NOT become a tutorial that exposes the deciding method before the learner has a chance to attempt the task.

### 9.2 Source fidelity

Where source custody is claimed, verify every applicable:

- source identity;
- stem;
- subpart;
- option;
- numerical value;
- unit;
- figure;
- source hint;
- printed key/answer.

Distinguish original, adapted, authored, and independently verified material.

### 9.3 Independent solving

Do not validate a question by comparing its solution with its own displayed answer.

Independently solve mechanically feasible questions and manually inspect coverage across every substantive question family.

Check:

- model;
- variable definitions;
- signs;
- algebra;
- units;
- boundary conditions;
- final result;
- option selection;
- interpretation.

A correct final option reached through invalid reasoning is a defect.

### 9.4 Hint ladder

Audit cognitive progression, not hint count.

A useful ladder commonly progresses through:

1. **Notice / Key idea** — identify relevant structure without solving.
2. **Model / Representation** — construct the needed physical/mathematical representation.
3. **Start / First executable move** — provide a valid start while leaving meaningful learner work.

Flag:

- `TOO_REVEALING`
- `DUPLICATIVE`
- `GENERIC_FILLER`
- `WRONG_MODEL`
- `WRONG_FIRST_MOVE`
- `PROVENANCE_ERROR`
- `CONTRADICTS_SOLUTION`

Do not invent missing rungs merely to satisfy a visual pattern.

### 9.5 Solution integrity

A complete solution SHOULD make visible, where meaningful:

- setup;
- governing principle;
- representation;
- calculation;
- answer;
- check/interpretation.

### 9.6 Coverage

For large banks, combine:

- mechanical verification of all feasible calculations; and
- stratified deep review across topic, difficulty, equation family, diagram family, special case, and reasoning-route family.

The audit packet MUST state what was exhaustively checked and what was sampled.

### 9.7 Core1A join

Where canonical concept/capability mappings exist, verify:

`Core2 question → required concept(s) → Core1A construction`

Do not infer exact joins from keyword similarity.

## 10. Deep Audit Profile: Core1A

### 10.1 Role

Core1A is the Concept Book.

Its learner job is to construct the model deeply enough that equations, assumptions, representations, and boundaries make sense.

It MUST NOT collapse into a formula sheet or a bank of worked answers.

### 10.2 Conceptual construction

For each substantive concept, inspect whether the experience provides a coherent route such as:

```text
orientation
→ physical/conceptual model
→ representation
→ formal mathematical bridge
→ conditions/boundaries
→ misconception diagnosis/repair
→ worked anchor
→ reduced-support check
→ transfer
```

The page does not need one fixed card shape. The conceptual progression matters.

### 10.3 Prerequisite integrity

Check:

- prerequisite concepts;
- notation;
- assumed mathematics;
- earlier physical models;
- frame/sign conventions.

Major prerequisites MUST NOT be silently assumed without support or navigation.

### 10.4 Equation audit

For every important relation verify applicable:

- derivation or meaningful bridge;
- variable meaning;
- units;
- assumptions;
- validity;
- special/limiting cases.

A relation valid only under constrained conditions MUST NOT be presented as universal.

### 10.5 Representation audit

Figures MUST correspond to the chosen model and conventions.

Examples include:

- vector decomposition against declared axes;
- trajectory and velocity geometry;
- acceleration direction;
- graph slope/area semantics;
- geometric construction.

### 10.6 Misconception quality

Useful misconception treatment SHOULD include:

```text
diagnosis
→ why the idea fails
→ repair
→ check
```

Generic warnings without a concrete failure mechanism do not satisfy this role.

### 10.7 Worked anchor

A worked anchor MUST be mathematically/academically correct and SHOULD illuminate the concept just constructed.

It SHOULD NOT silently introduce a major new conceptual dependency.

### 10.8 Transfer readiness

Where Core2 exists, map important Core2 demand families to Core1A preparation:

- `PREPARED`
- `PARTIALLY_PREPARED`
- `MISSING_PREPARATION`
- `MAPPING_UNCERTAIN`

## 11. Deep Audit Profile: Interactive Webpage

### 11.1 Role

An interactive webpage must make interaction cognitively meaningful.

Controls moving graphics is not sufficient.

For every major interaction establish:

`learner action → model change → visible consequence → intended inference`

### 11.2 Model correctness

Test the executable model against:

- initial conditions;
- zeros;
- negative values where valid;
- extremes;
- limits;
- symmetric cases;
- known special cases.

Use property/numerical falsifiers where practical.

### 11.3 Visual-semantic correctness

Across the operating range inspect:

- vector direction;
- path geometry;
- graph axes/scales;
- labels;
- intersections;
- event order;
- constraints;
- physical/geometric meaning.

### 11.4 Causal integrity

When one parameter changes, every dependent representation MUST update consistently.

A stale representation that contradicts the new state is an academic defect, not only a UI defect.

### 11.5 State integrity

Check:

- reset;
- defaults;
- mode/example switching;
- localStorage/session state;
- refresh;
- orientation changes.

State MUST NOT leak across incompatible scenarios.

### 11.6 Interaction accessibility

Check:

- keyboard operation;
- touch operation;
- focus;
- labels;
- reduced motion;
- status/feedback exposure where needed.

### 11.7 Responsive interaction

Test the interaction itself at representative viewports:

- SVG/canvas scaling;
- control reachability;
- label collisions;
- graph legibility;
- portrait behavior;
- compact behavior;
- virtual keyboard interactions.

### 11.8 Runtime robustness

Check:

- console/runtime errors;
- missing dependencies;
- event listeners;
- NaN/Infinity propagation;
- invalid input;
- repeated control use;
- reset/re-entry;
- meaningful offline behavior when claimed.

## 12. Lightweight role profiles

Core1, Core1B, Core2A, and Core2B use the Common Audit Kernel plus these role-specific checks.

They automatically escalate to deeper modules based on actual content.

### 12.1 Core1 — semantic orientation

Check:

- correct definitions;
- notation;
- prerequisites;
- governing relations;
- meaning of quantities;
- scope/boundaries;
- useful representative diagram;
- common confusion;
- navigation to deeper teaching.

Core1 SHOULD remain compact.

If it contains substantial derivations, interactive graphics, or detailed conceptual construction, add the applicable Core1A/Equation/Interactive modules.

### 12.2 Core1B — reconstruction/self-tutor

Check:

- learner must generate/reconstruct rather than reread;
- protected answer is not exposed too early;
- graduated support;
- cycle can close without a tutor;
- feedback repairs conceptual errors;
- claimed coverage matches relevant conceptual construction;
- learner action requires reasoning, not click-through.

Core1B MUST NOT be Core1A prose split into accordions.

Add Question, Equation, SVG, or Interactive modules when those features occur.

### 12.3 Core2A — familiar application

Check:

- claimed concept has prior exposure;
- task remains learner work;
- reasoning route is correct;
- stable crux/first meaningful move is valid;
- scaffolding does not become transcription;
- solution is independently correct;
- lineage to prior learning is honest.

When questions contain substantial quantitative reasoning or source adaptation, apply the Core2 independent-solution/source checks.

### 12.4 Core2B — transfer

For each item establish:

`prior exposure → changed demand → new learner decision → required adaptation → repair path`

Check:

- changed demand is real;
- difference is not cosmetic;
- prior exposure exists;
- lineage/adaptation is honest;
- learner must adapt rather than repeat;
- solution/rubric explains the transfer;
- repair targets the failed decision.

Use Core2 source/fidelity checks for source-derived tasks and the Interactive profile for executable transfer experiences.

## 13. Content-triggered audit modules

### 13.1 Equation Module

Trigger when substantive equations or calculations occur.

Verify:

- independent derivation/recomputation;
- dimensions/units;
- assumptions;
- conditions;
- sign/frame conventions;
- special cases;
- numerical consistency.

### 13.2 Question Module

Trigger when the artifact contains answerable quantitative/conceptual tasks.

Verify:

- independent answer;
- reasoning;
- answer/options;
- support/hints;
- checks.

### 13.3 SVG/Diagram Module

Trigger for instructional diagrams/SVGs.

Verify:

- axes/origin;
- vector/force/velocity/acceleration directions;
- component decomposition;
- angle location;
- labels;
- trajectory/geometry;
- event order;
- staged-state semantics;
- accessible meaning;
- clipping/legibility.

A polished but physically misleading diagram is a content defect.

### 13.4 Interactive Module

Trigger whenever learner controls mutate model state or representations.

Apply the Interactive Deep Profile.

### 13.5 Source-Custody Module

Trigger whenever the product claims reproduction/adaptation of a source, benchmark, PYQ, or other governed question set.

Perform component-level source comparison and preserve provenance distinctions.

### 13.6 Cross-Core Module

Trigger whenever prerequisite, repair, transfer, or exact-return links across Core roles are claimed.

Validate mappings using canonical references where available.

## 14. Audit depth

### Level 1 — Role conformance

Typical for simple Core1/Core1B resources.

Includes:

- Common Kernel;
- role profile;
- applicable low-cost content modules.

### Level 2 — Independent content review

Typical for Core2A/Core2B or equation/question-heavy resources.

Adds:

- independent solving;
- detailed lineage/source review;
- deeper representation checks.

### Level 3 — Deep product audit

Default for:

- Core2;
- Core1A;
- Interactive Webpages.

Also applies to any artifact whose detected content justifies the same depth.

Includes:

- full Common Kernel;
- deep role profile;
- all applicable content modules;
- browser/runtime evidence;
- explicit denominator reconciliation.

## 15. Audit ledger

Every audit packet SHOULD contain findings with:

| Field | Meaning |
|---|---|
| product | logical learner product |
| area | audit dimension/module |
| item/ref | exact record, section, question, SVG, control, or route |
| authority | canonical/source basis |
| observation | evidence-based finding |
| learner impact | consequence for learner |
| severity | S0/S1/S2/S3 or PASS |
| correction | recommended/implemented repair |
| status | OPEN/FIXED/WONT_FIX/REGRESSED/PASS |
| reviewed digest | exact artifact/render basis |

Use existing product-review conventions where possible rather than creating a competing review schema.

## 16. Promotion audit sequence

The normal sequence is:

```text
INTAKE
→ EXACT-VERSION CAPTURE
→ DEDUPLICATION / LINEAGE RECONCILIATION
→ SOURCE / DENOMINATOR RECONSTRUCTION
→ AUDIT-PLAN SELECTION
→ MECHANICAL AUDIT
→ INDEPENDENT ACADEMIC / PRODUCT AUDIT
→ CORRECTION ON SAME PR
→ RE-AUDIT CHANGED DIGEST
→ INTEGRATION / NAVIGATION RESOLUTION
→ PRODUCTION DRY-RUN
→ OWNER REVIEW
→ EXACT-DIGEST ACCEPTANCE
→ MAIN MERGE / EXISTING PUBLICATION PATH
→ POST-PUBLICATION VERIFICATION
```

The sequence is evidence flow, not a new numerical quality gate.

## 17. Integration resolver

Only after academic/product review should the candidate be mapped into learner navigation.

Resolve:

`Subject → Topic → Subtopic → Product role/resource type`

Typical Core1A route:

`Home → Subject → Topic/Subtopic → Core1A → bucket/section`

Typical Core2 route:

`Question Bank → Subject → Topic → Subtopic → question/study`

A topic-specific Core2 study product may also be surfaced from the relevant subject/topic resource area without forking global Question Bank taxonomy.

Generic browser/runtime code MUST NOT gain topic-specific branches solely to expose one candidate.

## 18. Root landing-page policy

Being published and being featured on the root Home page are separate decisions.

Every accepted learner product SHOULD be reachable from Home through the appropriate hierarchy.

A direct root-home feature SHOULD be added only when:

- explicitly requested by the Owner; or
- current homepage policy classifies the product as featured.

The audit/integration packet SHOULD record:

- `reachable_from_home: true|false`
- `root_home_featured: true|false`

This prevents Home from becoming a flat catalog.

## 19. Search indexing and discoverability

Promotion MUST update search through canonical producers, never by hand-editing generated search artifacts.

Grade9V3 currently has two learner search projections that must remain coherent:

1. the Question Bank platform search, generated as `public/data/question-bank-search.js`; and
2. the site-header/global search projection, generated as `public/data/question-bank-data.js`.

The global site header currently reads the older monolithic projection, while the Question Bank page reads the newer generated platform contracts. Until those consumers converge, LPAP promotion MUST verify both.

### 19.1 Core2 questions

A promoted Core2 question becomes searchable only by entering the existing canonical Question Bank projection path:

- canonical exam-bank question; or
- package-shaped canonical question explicitly opted into Question Bank publication.

LPAP MUST NOT copy question text into a separate search registry.

After canonical integration, the Question Bank generators produce the search documents from the same records.

### 19.2 Core1A, interactive pages, and other learner resources

A learner resource that should be searchable SHOULD be represented through the existing subject resource/discovery authority rather than inserted directly into generated JavaScript.

For ordinary resources, use the applicable `<Subject>/question-bank/resources.v1.json` record with:

- stable resource id;
- kind;
- title;
- deployable path relative to `public/`;
- useful search keywords;
- subject/topic metadata as supported.

Governed explorer suites already discovered from existing suite records SHOULD continue to use that discovery path rather than being duplicated in the resource registry unless an explicit topic link or additional governed resource relationship is required.

When a resource belongs to an existing Question Bank topic, use the existing explicit `topic_ref` / `topic_links` mechanism where appropriate. The generator MUST NOT infer a canonical topic association from similar names.

### 19.3 Search deduplication

Search documents are projections, not identities.

LPAP MUST resolve duplicate/variant/new product identity before indexing.

The search layer MUST NOT create a second result merely because the same logical product is reachable through several navigation surfaces.

Where one canonical resource has multiple contextual links, prefer one searchable resource identity whose destination is canonical.

Questions that are variants remain separate search documents only when they remain separate canonical question records.

### 19.4 Regeneration

After promotion integration, regenerate through the existing producers rather than editing outputs:

```text
python3 Shared/tools/build_question_bank_web.py
python3 Shared/tools/build_question_bank_platform.py --write
python3 Shared/tools/build_pages_site.py
python3 Shared/tools/build_manifest.py
```

Then run the corresponding `--check` modes supported by those generators.

Generated artifacts such as these MUST NOT be manually authored:

- `public/data/question-bank-data.js`
- `public/data/question-bank-search.js`
- `public/data/question-bank-catalog.js`
- `public/data/question-bank-resources.js`
- `docs/data/question-bank-*.js`

### 19.5 Search acceptance evidence

The promotion dry-run MUST verify, for each promoted learner product:

- whether it is intended to be searchable;
- its canonical search identity;
- the generated search document/resource id;
- expected search terms;
- expected destination URL;
- absence of unintended duplicate results;
- Question Bank search visibility where applicable;
- global site-header search visibility where applicable;
- generated `public/` and `docs/` search projections are current.

At least one deterministic search witness SHOULD be recorded for each newly searchable resource or question family.

Example evidence:

```text
query: "projectile motion concept book"
expected canonical result: RESOURCE-PHY-MOTION2D-CORE1A
expected destination: physics/.../core1a.html
duplicate result count: 0
```

Searchability does not imply root-home featuring. A product may be searchable and hierarchically reachable without receiving a root-home card.

## 20. Publication dry-run

Before acceptance, construct the intended production tree without production deployment.

Verify:

- proposed `public/...` destination;
- generated `docs/...` destination;
- Home/subject/topic routes;
- Question Bank/resource linkage where applicable;
- no broken or escaping links;
- no orphan learner page;
- asset completeness;
- runtime/offline behavior;
- exact generated/output digest.

Generated `docs/` MUST NOT be hand-edited.

## 21. Automatic triggering

The implementation SHOULD use one inexpensive PR discovery workflow and one reusable audit workflow.

### 20.1 PR events

Candidate discovery SHOULD run on relevant `pull_request` events including:

- opened;
- synchronize;
- reopened;
- labeled/requested;
- ready_for_review;
- converted_to_draft where useful.

A changed head automatically invalidates exact-version evidence for promotion and causes the current candidate to be re-evaluated.

### 20.2 Candidate activation

The expensive LPAP audit SHOULD run when at least one explicit candidate signal is present, such as:

- LPAP intake manifest;
- learner-promotion label/request;
- recognized learner-product path plus confirmed promotion intent.

Detection alone MUST NOT publish.

### 20.3 Workflow reuse

The heavy audit SHOULD be implemented as a reusable workflow or equivalent shared runner rather than copied into Core-specific workflows.

Product-specific existing workflows MAY feed evidence into the LPAP packet.

### 20.4 Security separation

Candidate PR code is untrusted.

PR audit jobs SHOULD:

- use read-only repository permission;
- receive no publication secrets;
- avoid production deploy credentials;
- avoid mutation of `main`;
- avoid privileged execution of untrusted PR code.

A privileged workflow MUST NOT check out and execute untrusted candidate code merely to gain write permissions.

Repair automation, when authorized, SHOULD write only to the candidate branch.

Production publication/deployment remains a separate trusted path after Owner acceptance and merge.

## 22. Mechanical versus independent evidence

Automation is appropriate for:

- candidate discovery;
- digesting;
- deduplication hints;
- schema/structure checks;
- source inventory comparison;
- link/asset checking;
- mathematical recomputation where deterministic;
- browser geometry;
- viewport testing;
- runtime/property checks;
- Pages dry-run;
- report generation.

Independent semantic review remains necessary for:

- conceptual correctness;
- pedagogical sequencing;
- validity of derivations;
- misleading diagrams;
- hint quality;
- source interpretation;
- transfer validity;
- whether an interaction teaches the intended inference.

No automated label such as `PASS` may imply human/independent academic review unless that review actually occurred and is recorded.

## 23. Owner review packet

Before publication, present the Owner with:

- exact PR/head SHA;
- exact artifact/render digest;
- declared product role;
- source/denominator summary;
- deduplication/lineage reconciliation;
- selected audit plan;
- independent review and unresolved findings;
- representative browser/render evidence;
- Core1A↔Core2 coverage when applicable;
- proposed navigation;
- proposed public/deployed paths;
- validation/test results.

The Owner accepts or rejects the exact version.

## 24. Publication

For governed Core products, use the existing acceptance/publication path.

LPAP MUST NOT introduce a second publisher.

If an imported candidate cannot be represented by the existing governed product/resource architecture, integration work SHOULD first adapt it into the appropriate existing representation rather than bypassing authority.

After acceptance:

- merge the approved PR;
- regenerate Pages through the existing builder;
- deploy from trusted/default-branch state;
- verify resulting learner routes.

## 25. Post-publication verification

After `main` changes, verify:

- Pages mirror freshness;
- intended Home/subject/topic route;
- production URL reachability;
- Question Bank/resource links;
- asset availability;
- no broken internal links;
- accepted render/output identity where applicable.

## 26. Non-goals

LPAP-v1 does not:

- replace V3.1;
- replace `docs/method/PROTOCOL.md`;
- grant curriculum authority;
- create a second Question Bank taxonomy;
- require all six Cores to exist;
- define learner mastery from page visits;
- make automated checks publication authority;
- force one visual layout across Core roles;
- collapse duplicate, variant, and related records into one;
- require root-home featuring for every accepted product.

## 27. Acceptance principle

A candidate is not ready merely because it:

- renders;
- looks polished;
- passes CSS/layout tests;
- contains the expected number of cards/questions;
- has answers;
- has hints;
- is linked from Home.

The promotion packet should establish, to the depth appropriate for the selected profile, that:

- academic claims are correct;
- equations and solutions are independently supported;
- source fidelity is honest;
- completeness is reconciled against a real denominator;
- hints/scaffolding preserve the intended learner work;
- SVGs/diagrams represent the academic model correctly;
- interactions are causally and academically correct;
- the product fulfils its Core role;
- duplicate/variant/new identity is reconciled;
- layout/accessibility/runtime behavior is usable;
- navigation and deployment are coherent;
- the exact version presented to the Owner is the version proposed for publication.
