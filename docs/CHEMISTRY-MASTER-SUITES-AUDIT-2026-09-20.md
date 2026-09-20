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
| Chemical Bonding | 19 | 1 | 0 |
| Mole Concept | 19 | 0 | 1 |
| Redox | 20 | 0 | 0 |
| Behaviour of Gases | 20 | 0 | 0 |
| **Total** | **78** | **1** | **1** |

All 80 records remain `SOURCE_PROVENANCE_PENDING`. A local answer audit is not source-item
verification.

### BOND-Q19 — pending

The supplied record asserts CO⁺ has bond order 3.5 and is paramagnetic. Public teaching sources
use conflicting simplified/heteronuclear MO conventions for this species, so this record is
withheld from audited scoring until the cited source item and official key are independently
verified. The supplied option is preserved but `answerAudit=PENDING`.

### CHEM02-Q04 — failed source/data consistency

The stated eudiometry data are internally inconsistent with every listed option:

- KOH contraction = 40 mL ⇒ CO₂ = 40 mL ⇒ x = 4.
- Residual before KOH = 65 mL ⇒ excess O₂ = 25 mL.
- O₂ consumed = 80 - 25 = 55 mL.
- 10(4 + y/4) = 55 ⇒ y = 6.

Therefore the stated data imply **C₄H₆**, not C₄H₁₀. The record now has `answerAudit=FAIL`,
`correct=null`, and is withheld from scoring rather than silently selecting a wrong option.

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
