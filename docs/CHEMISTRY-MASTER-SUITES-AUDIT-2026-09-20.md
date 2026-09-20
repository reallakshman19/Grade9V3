# Chemistry master-suite audit — PR #144 extraction

Date: 2026-09-20  
Source reviewed: PR #144 (`feat/topic-atlas-skill-matrix-progress`)  
Repair branch: `audit/chemistry-master-suites-standalone`

## Decision on PR #144

PR #144 is not suitable for whole-branch merge. It is far behind current `main` and combines
Topic Atlas changes plus stale Motion-1D, Motion-2D and Vector Algebra implementations with four
Chemistry suites. The Chemistry work is therefore extracted onto current `main` and audited
independently.

The four extracted suites are:

- Chemical Bonding & Molecular Structure
- Some Basic Concepts of Chemistry / Mole Concept
- Redox Reactions
- Behaviour of Gases

Each suite retains 20 local diagnostic records, for 80 records total. Current local answer status is 79 PASS / 1 FAIL; source provenance remains a separate axis.

## Diagnostic answer audit

Local mathematical/chemical review status after extraction:

| Suite | PASS | PENDING | FAIL |
| --- | ---: | ---: | ---: |
| Chemical Bonding | 20 | 0 | 0 |
| Mole Concept | 19 | 0 | 1 |
| Redox | 20 | 0 | 0 |
| Behaviour of Gases | 20 | 0 | 0 |
| **Total** | **79** | **0** | **1** |

A local answer audit is not source-item verification. After live-source checks, 76 records remain
`SOURCE_PROVENANCE_PENDING` and 4 are explicitly `SOURCE_UNVERIFIED`: BOND-Q19,
CHEM02-Q04, GAS-Q01 and GAS-Q06.

### BOND-Q19 — local answer corrected; source attribution rejected

The PR #144 record supplied “Bond Order = 3.5 and Paramagnetic”. The local audit corrected the
standard classroom-MO answer to **Bond Order = 2.5 and Paramagnetic (Option B)**. The current
ExamSIDE listing for the claimed JEE Main 2019 Online 10 April Morning paper does not contain
this CO⁺ question, so `sourceAudit=SOURCE_UNVERIFIED` even though the local answer audit now
passes.

### CHEM02-Q04 — failed answer/data consistency and source mismatch

The stated eudiometry data are internally inconsistent with every listed option:

- KOH contraction = 40 mL ⇒ CO₂ = 40 mL ⇒ x = 4.
- Residual before KOH = 65 mL ⇒ excess O₂ = 25 mL.
- O₂ consumed = 80 - 25 = 55 mL.
- 10(4 + y/4) = 55 ⇒ y = 6.

Therefore the stated data imply **C₄H₆**, not C₄H₁₀. The record now has `answerAudit=FAIL`,
`correct=null`, and is withheld from scoring rather than silently selecting a wrong option.
The current ExamSIDE listing for the claimed 2026 Online 8 April Evening paper does not contain
this eudiometry item, so its source attribution is also `SOURCE_UNVERIFIED`.

## External-corpus snapshot

The live ExamSIDE topic pages were checked on 2026-09-20. They report:

| Topic | Live corpus count | Embedded local diagnostics |
| --- | ---: | ---: |
| Chemical Bonding & Molecular Structure | 266 | 20 |
| Some Basic Concepts of Chemistry | 245 | 20 |
| Redox Reactions | 74 | 20 |
| Gaseous State | 66 | 20 |

These numbers are corpus snapshot metadata, not claims that the local 20-item slices cover or
verify the full corpus. The Gaseous State page currently reports **0 questions in 2026** and marks
the chapter out of syllabus; therefore the PR #144 attributions GAS-Q01 and GAS-Q06 to 2026 JEE
Main papers are explicitly rejected as `SOURCE_UNVERIFIED`.

## Simulator-fidelity audit

The PR #144 pages displayed “Load in Simulator” for every record even when most `simParams`
were ignored by the loader. Several records also targeted tab IDs that did not exist.

The repair makes source→state bindings explicit through `simBindingRefs`. No Chemistry item
currently claims `EXACT`.

| Suite | CONSTRAINT_FAITHFUL | CONCEPT_ONLY |
| --- | ---: | ---: |
| Chemical Bonding | 17 | 3 |
| Mole Concept | 5 | 15 |
| Redox | 8 | 12 |
| Behaviour of Gases | 2 | 18 |

For constraint-faithful records, only parameters actually consumed by the governed loader remain
in `simParams`. Concept-only records inject no question-specific state.

Invalid target IDs repaired:

- Mole: `tab-mole-scale → tab-mole`
- Redox: `tab-structural → tab-structural-ox`
- Redox: `tab-balance → tab-ion-electron`
- Gases: `tab-andrews → tab-isotherms`
- Gases: `tab-halos → tab-real-particle`

## UI / Canvas RCA

All four PR #144 Chemistry pages inherited the same high-DPI canvas feedback defect later found
in Motion-1D and Vector Algebra: `setupCanvas()` read the mutable HTML `height` attribute and
then assigned a DPR-scaled `canvas.height`. On DPR > 1, repeated redraws could recursively grow
the logical height.

Repairs:

- cache original logical canvas height once in `dataset.logicalHeight`;
- measure logical width from the parent minus padding;
- cap DPR at 2;
- update backing-store dimensions only when necessary;
- use `ctx.setTransform(...)` instead of cumulative scaling;
- keep CSS width at 100%;
- redraw current state on resize.

Chemical Bonding also used multiple global mouse/touch orbit listeners. These are replaced with
per-canvas Pointer Events, pointer capture and one binding per canvas.

## Question-bank UI truthfulness

The blanket label **“ExamSIDE Verified Bank”** was removed. Question cards now expose:

- local answer-audit state;
- source provenance pending;
- simulator fidelity;
- a visible integrity failure banner if required fields, answer keys, target tabs or binding
  contracts are invalid.

Items with `answerAudit != PASS` are not scored.

## Duplicate-family curation debt

The current 20-item slices contain several near-duplicate diagnostic families. This is not a
runtime blocker, but future curation should prefer broader coverage before increasing counts.
Examples include BOND-Q04/BOND-Q12, CHEM02-Q05/MOLE-Q15, GAS-Q03/GAS-Q09,
GAS-Q07/GAS-Q16 and GAS-Q08/GAS-Q10.

## GCDR v1.3 suite contracts

The four Chemistry suites now participate in the companion-contract architecture introduced by
GCDR v1.3:

- `docs/gcdr-suites/chemistry-chemical-bonding.json`
- `docs/gcdr-suites/chemistry-mole-concept.json`
- `docs/gcdr-suites/chemistry-redox.json`
- `docs/gcdr-suites/chemistry-gaseous-state.json`

All four are explicitly `UNBOUND_EXTENSION` at `JEE_EXTENSION` depth; no Grade-9 canonical
certification is claimed. The contracts govern the 20-item local slice, helper activation,
representation invariants, geometry-truth declaration, and both repo/standalone delivery profiles.

Question records now expose `teacherCheck`, `takeaway`, `helperTags`,
`simBindingRefs`, answer audit, source audit and simulator fidelity. The five item-driven helpers
used by these pages are governed as `AUDITED` against
`tests/test_chemistry_master_suites_audit.py`.

The suite-level invariants are:

- Chemical Bonding — MO bond-order / magnetic-state consistency;
- Mole Concept — stoichiometric extent and limiting-reagent conservation;
- Redox — oxidation/reduction electron balance and n-factor consistency;
- Gaseous State — Maxwell characteristic-speed ordering and analytic ratios.

Rendered geometry remains `DECLARED`, not browser/visual certified.

## Standalone delivery

Four standalone artifacts are committed:

- `standalone/chemistry-chemical-bonding-master-suite.html`
- `standalone/chemistry-mole-concept-master-suite.html`
- `standalone/chemistry-redox-reactions-master-suite.html`
- `standalone/chemistry-behaviour-of-gases-master-suite.html`

Each embeds its 20-record bank and has no repository-local runtime/data dependency. They are
**SINGLE_FILE_ONLINE**, not offline artifacts: Tailwind and KaTeX remain CDN dependencies.

## Release limitations

This audit provides static/data/math review and CI falsifiers. It does not claim:

- source-item verification for the 80 attributed ExamSIDE labels;
- full external-corpus coverage;
- offline delivery;
- browser visual proof until a real browser smoke test is completed.

## Redox follow-up: scientific-content + Grade-9 pedagogy audit (2026-09-20)

A second, content-first audit was performed after the initial packaging audit. This review used
GCDR v1.3's mandatory sequence (predict → manipulate/observe → reconstruct → transfer) and checked
the redox explanations against the formal oxidation-state model rather than treating the task as
a canvas-only repair.

### Root runtime defect

The Redox page read `currentCompound` and `currentStructMode` during the load sequence but never
initialized either variable. The first `updateStructuralLedger()` call could therefore throw a
`ReferenceError`, aborting subsequent canvas initialization. Both variables are now explicitly
initialized, and the first learner route is the new Foundations tab.

### Canvas-content defect

Five canvas tabs were syntactically valid but only painted a single line of text. They were
placeholders, not graphical cognitive deconstructions. The follow-up replaces them with:

- a prediction-first Zn/Cu electron-transfer scene;
- a donor/acceptor electron-flow diagram;
- a four-stage ion-electron balancing ledger;
- a redox-titration electron-equivalence diagram;
- a Daniell-cell electron/salt-bridge diagram;
- an oxidation-number ladder practice view.

Every canvas also has an accessible label and a visible text invariant, so the concept does not
depend solely on pixel rendering.

### Scientific-model corrections

The previous copy repeatedly described oxidation states as "physical reality", "real localized
charges", or asserted that fractional oxidation states are physically impossible. Those claims
were removed. The suite now treats oxidation state as formal electron bookkeeping based on an
ionic approximation of bonds. Mixed-valence examples distinguish a formula-average value from a
structure-supported formal assignment without equating either with measured atomic charge.

Specific repairs include:

- CrO5 / peroxo acids: the error is now identified as ignoring O-O peroxide connectivity, not as
  violating a simplistic valence-electron ceiling.
- S4O6(2-): +2.5 is presented as the formula average; +5,0,0,+5 is the requested structural formal
  assignment, with a whole-ion charge check.
- Fe3O4 and Pb3O4: mixed-valence formal descriptions are separated from literal charge language.
- Brown-ring complex: the JEE Fe(I)/NO+ convention is retained for the attributed item, but the
  Chalkboard now discloses nitrosyl non-innocence and the more robust {FeNO}7 description.
- Na2S2O3 titration: electron transfer is checked from the balanced thiosulfate/tetrathionate
  half-reaction instead of a misleading average-sulfur shortcut.
- Bleaching powder: the Ca(OCl)Cl representation is explicitly identified as the textbook/JEE
  idealization.

### Pedagogy/order corrections

The page previously opened on structural exceptions (CrO5, tetrathionate, magnetite) before a
young learner had a causal model of redox. A new **Grade 9 Bridge** now precedes the JEE material:

1. predict the electron donor;
2. reveal Zn → Cu2+ electron transfer;
3. label oxidation/reduction from electron loss/gain;
4. connect donor/acceptor to reducing/oxidizing agent;
5. only then introduce oxidation-number bookkeeping.

The overall suite contract remains `UNBOUND_EXTENSION / JEE_EXTENSION`; the foundation tab is a
bridge, not a new Grade-9 certification claim.

### Feedback and disclosure corrections

A wrong MCQ click previously highlighted the correct option immediately, collapsing diagnosis,
hinting and repair into one reveal. Wrong attempts now keep the answer hidden, give
distractor-specific process feedback when available, and leave the Teacher Chalkboard as an
explicit repair action. Generic independent-check and transfer boilerplate was replaced across all
20 redox records with task-specific checks and reusable decision rules.

Source provenance status is unchanged: local answer/content review does not convert the attributed
ExamSIDE labels into verified source records.

