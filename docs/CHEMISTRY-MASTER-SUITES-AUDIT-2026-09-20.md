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

Each suite retains 20 local diagnostic records, for 80 records total.

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
