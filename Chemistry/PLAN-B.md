# PLAN-B: Chemistry Learner Product Pipeline

## Status: In Progress

This branch delivers the first Chemistry learner products through the six-Core renderer
(`render_core.py`) without any changes to the renderer, metadata engine, or contracts.

## Prerequisite State

| Asset | Status |
|---|---|
| `Chemistry/library/exam-bank/competitive-exam-question-bank.v2.json` | ✅ EXISTS — 46 PYQs (26 Redox, 20 Mole Concept) |
| `Chemistry/research/evidence/*.cards.json` | ✅ EXISTS — 11 files, ~148 research cards |
| `Chemistry/library/*.v1.json` | 🔴 **Does not exist** — to be authored |
| `products/chemistry/*.manifest.json` | 🔴 **Does not exist** — to be authored |

## Planned Products (Step B2)

| Product ID | Topic | Bank Questions |
|---|---|---|
| `che-some-basic-concepts` | Some Basic Concepts of Chemistry / Mole Concept / Stoichiometry | 20 PYQs |
| `che-redox-reactions` | Redox Reactions | 26 PYQs |

## Implementation Steps

### Step B1 — Domain Analysis ✅ (from PLAN-B spec)
- 46 bank questions across 2 topics
- 148 research cards across 11 card files
- 2 concept buckets: `BUCKET-CHEM-SOME-BASIC-CONCEPTS`, `BUCKET-CHEM-REDOX-REACTIONS`

### Step B2 — Author `Chemistry/library/che-some-basic-concepts.v1.json`
- Microtopics from research cards
- Questions promoted from `extensions.grade9v3:analysis` to schema 0.2.0 top-level fields
- Governing relations with valid restricted MathML

### Step B3 — Author `Chemistry/library/che-redox-reactions.v1.json`
- Same pattern as B2

### Step B4 — Create manifests + verify six-Core render

### Step B5 — Ratchet baseline + Gate B

## Gate B (acceptance criteria)
```bash
python Shared/tools/learner_metadata.py --manifest products/chemistry/che-some-basic-concepts.manifest.json
# Required: findings: []

python Shared/tools/render_core.py build \
  --manifest products/chemistry/che-some-basic-concepts.manifest.json \
  --out /tmp/che-basic --mode PAGES --draft
# Required: all six Core roles output HTML without errors

python -m unittest tests.test_learner_metadata.LearnerMetadataAuditTests -v
# Required: 0 failures (subject-neutral projection)

python -m unittest tests.test_products_ratchet.Ratchet -v
# Required: 0 failures
```

## Scope Constraints
- `render_core.py` — NOT modified
- `learner_metadata.py` — NOT modified
- No Chemistry-specific branching in any shared tool
- Bank file `Chemistry/library/exam-bank/competitive-exam-question-bank.v2.json` — read-only
