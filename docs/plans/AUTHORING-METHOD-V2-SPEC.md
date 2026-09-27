# SPEC-AM2 — One model for authoring learner products

| Field | Value |
|---|---|
| Revision | r2.1 (r2 plus the step-back check, §0.1 and §5.6; supersedes r1) |
| Status | DRAFT for owner review |
| Date | 2026-09-27 |
| Baseline | `main@1d044c18` (after PR #300) |
| Amends | #319, #320 (every section dispositioned in §9) |
| Why r2 | r1 bolted a method onto the old research-first pipeline without unifying them. That left two of several things: staging and library packages, board stages and protocol phases, verification records and review records, evidence cards and a separate corpus file. r2 defines one model and derives every change from it. Every point raised so far has a disposition, and each one not implemented has a justification (§9). |

Conventions:
- **MUST** applies only to code behaviour and data formats.
- Nothing in this spec makes an agent refuse, stop or wait. The single decision point is the owner accepting a rendered product (§4.5).

---

## 0. The model on one page

```
   SOURCE ────────────► UNIT ─────────────► PRODUCT ─────────► REVIEW ─────────► DECISION
   what the books say   what we teach        what the learner   an independent    the owner accepts
   (acquisitions,       (one package +       sees (render_core  reader's          an exact render;
    evidence cards,      one unit folder:     pages, identified  judgement of      that publishes it
    item inventories,    design note,         by a digest)       that digest
    cross-reads)         worklog)
   writer: source       writer: unit         writer: code       writer:           writer: owner
   readers (2)          author               (render_core)      reviewer
```

- **One of everything:**
  - one source of truth per fact (its evidence card);
  - one package per unit;
  - one renderer;
  - one lifecycle per unit;
  - one decision-maker for publication.
- **Three kinds of guarantee:**
  - **Construction:** the renderer makes a class of defect impossible (answers before the attempt, a second shell).
  - **Craft:** the method, the golden exemplars and the anti-pattern cards show how to do excellent work.
  - **Judgement:** an independent reviewer coaches; the owner decides.
- **Descriptive state, never permission.** Tools report what exists and what they notice. Only the owner's acceptance changes what is published.
- **Extend, don't duplicate.** Every new element in this spec extends an existing file or tool, or it retires one (§7).

## 0.1 The broader problem this spec addresses

The recurring defects are symptoms. The problem is how to reliably get **reference-grade learner products from AI agents at scale** (correct, pedagogically deep, learner-safe), and the obstacle is an operating model that answered each failure by adding another gate.

**What keeps happening**
- Agents produce work that *looks* finished: it passes checks, fills fields, and is labelled COMPLETE or PASS.
- Independent review then shows it isn't: unverified or mistranscribed source truth, answers visible before the attempt, false novelty, stale closures, private renderers, stale reviews. It happened in the scanned-Maths stress test (#301–#305) and in both Physics pilots.
- The response each time was another rule, gate, validator, role or handoff. The quality contract reached 44 rules, alongside duties, a ratchet and content CI, and #320 proposed 26 more controls.

**Why that makes it worse**
- **Goodhart:** agents optimise for passing the check, not for the learner. A gate at "PASS, 0 gaps" still met four failing reviews.
- **Blockers become excuses:** "blocked", "duty open" and "waiting on gate" replace delivering the best possible work.
- **Repo files crowd out thinking:** evidence files and templates were treated as a substitute for the agent's own research and judgement.
- **Fragmentation:** one unit split across several agents loses coherence (text describing tasks another agent rewrote).
- **Cost without convergence:** four fix/review rounds, ≈ $100 on two units, still not accepted.

**What is wanted instead**
- **Capable agents working like skilled authors:** they research widely, design before building, own a unit end to end, and are honest about what is weak.
- **Guidance, not restraint:** a clear protocol for execution, and golden examples of excellence beside annotated failures.
- **Only a few non-negotiables, built into the platform:** one renderer and one source of truth, answers that cannot leak before the attempt, facts that always carry a source.
- **Judgement at the end:** an independent reviewer who coaches rather than blocks; the owner calibrates early and makes the final call on an exact build.
- **Scalable and reusable:** library content is offloaded, so the method, examples and platform must let other agents or teams produce good units across subjects and grades. The repo is the reference and evidence base, not the answer key.

**Success:** a unit goes from source to an owner-accepted product in one or two review rounds, with no structural leaks, at predictable cost. No layer of the process exists mainly to police the agent.

Every phase of work, content and code alike, ends by stepping back and checking against this section (§5.6).

## 1. Evidence

| # | Observation (pilot, PR #295 → #300) | Consequence for the model |
|---|---|---|
| E1 | Both Physics pilots reached quality-gate PASS with 0 gaps; 4 consecutive independent reviews still found S1s (commits `c2dd7dc4`, `1a047ec0`, `9bf92e03`/`d1f64d03`/`66a5c5dc`, `cb84133a`/`1d012787`) | A field-presence gate does not measure quality → judgement decides (§4.4–4.5) |
| E2 | Fields the gate counted were present but wrong: `transfer.novelty` false (FRICTION-STATE-01, STRING-MODEL-03, Math LE-03); `family_exposure.closure` stale on 5 items (round 4) | Novelty and closures are reasoned once per unit in the design note's task arc (§5.3), not filled per record |
| E3 | 10 of the 11 S1s in rounds 2–4 came from how pages were built (CSS-hidden stages, asset title/desc, purpose-as-caption, `produces` before the attempt); each disappeared when the renderer changed | Learner-state safety lives in the renderer (§4.3) |
| E4 | Author, illustrator, verifier and reviewer worked on one unit in separate sessions; round-4 S2s were mostly text describing a task another session had rewritten | One owner per unit, end to end (§3.3) |
| E5 | $100.87 spent on the two pilot products, not yet accepted; ≈ $14 lost to usage limits before a push; 4 fix rounds | Owner calibration at the prototype (P4); push after every phase |
| E6 | Every contract rule added in Phase 6 encoded a finding a reviewer had already made | Rules are a linter that describes; they don't predict or decide (§5.5) |
| E7 | Math staging package (7,046 lines, verified) and the library `linear-equations` package (3 microtopics) describe the same unit and drifted apart; promotion refused the verified content for depth duties | One package per unit, no staging copy (§4.2) |
| E8 | `core2()` renders neither the source's `hints` nor its `figure_refs`; the CORE2 blueprint's `support` slot is unused (RCA-ARCH-007) | Core2 projection is completed in the renderer (§4.3.5) |

## 2. Principles and the rule each one produces

| Principle | Rule it produces |
|---|---|
| P1 One of everything | Retire staging packages, `promote_verified` gating, board work orders, the separate product-verifier role and parallel templates (§7) |
| P2 Safety by construction | Withheld content is absent from the live page; attempts are typed; keys vs verified results are displayed; each output mode has a declared protection (§4.3) |
| P3 Quality by craft | House rules, protocol, design note, goldens, techniques, anti-patterns (§5) |
| P4 Acceptance by judgement | Review v2 coaches; the owner accepts an exact digest (§4.4, §4.5) |
| P5 Descriptive state | `unit_status.py` derives each unit's state from its artifacts; nothing refuses (§3.2, §5.5) |
| P6 Extend, don't duplicate | Inventories link existing evidence cards; cross-reads extend existing verification records; staleness reuses `inputs_digest` (§4.1) |

## 3. Objects, lifecycle, roles

### 3.1 Objects

| Object | Files (existing unless marked new) | Identity | Writer | Read by |
|---|---|---|---|---|
| Source | `<Subject>/research/acquisitions/*.json`, `scans/*.scan.json`, `evidence/<NODE>.cards.json`, `source-allowlist.json`, **new** `inventories/<INV>.json`, `verification/*.verification.json` (extended) | acquisition sha256; card id; inventory digest | source readers (A writes, B cross-reads) | unit author, reviewer |
| Unit | `<Subject>/library/<slug>.v1.json` (the only package) + **new** `<Subject>/units/<slug>/` | package path; unit slug | unit author | render_core, reviewer, owner |
| Product | `products/<subject>/<slug>.manifest.json` → `publication/products/<subject>/<slug>/` | render digest (hash of the rendered pages) | render_core (code) | reviewer, owner |
| Review | `products/verification/<slug>.review.json` (v2) | review file @ commit; `render_digest` inside | reviewer | unit author, owner |
| Decision | **new** `products/acceptance/<slug>.json`; `<Subject>/units/<slug>/OWNER-NOTES.md` | acceptance file @ commit | owner | publication tool |

### 3.2 Unit lifecycle (descriptive)

`Shared/tools/unit_status.py` (a new report, derived from `library_board.py`) computes each unit's state from artifacts. Every state is a fact about files, not a permission. Work may happen in any order; the table shows the usual order.

| State | True when |
|---|---|
| PLANNED | `units/<slug>/UNIT.md` exists |
| SOURCED | every source the unit cites is registered, and every card it cites is cross-read, or listed as open in UNIT.md |
| DESIGNED | `DESIGN-NOTE.md` has sections 1–8 non-empty |
| PROTOTYPED | `SELF-CRITIQUE.md` exists and the package renders |
| BUILT | every microtopic listed in UNIT.md renders with no renderer gap |
| REVIEWED | a review exists whose `render_digest` equals the current build |
| ACCEPTED | `products/acceptance/<slug>.json` names the current digest |
| PUBLISHED | `public/products/<subject>/<slug>/` holds that digest |

- A changed build makes REVIEWED and ACCEPTED read "for an earlier render (<digest>)". That is information, not a block.

### 3.3 Roles

The five agent roles (researcher, author, illustrator, verifier, product verifier) become three.

| Role | Writes | Replaces | Why merged |
|---|---|---|---|
| Source reader | acquisitions, cards, inventories, cross-reads | researcher (facts), scanner, node verifier | Source truth is one discipline; a second reader of the same kind gives independence |
| Unit author | the unit's package records, SVG assets, unit folder | author, illustrator, researcher (pedagogy) | E4: coherence needs one owner. The author may use a helper session for figures and stays accountable. |
| Reviewer | review files | product verifier | One independent judgement of the thing the learner sees |
| Owner (human) | OWNER-NOTES.md, acceptance | — | Taste and the publication decision |

## 4. Object specifications

### 4.1 Source

#### 4.1.1 Unchanged
- Acquisitions, scan manifests, allowlists, `evidence_check.py` (quote-on-page proof), `scan_ingest.py`, and the card kinds in `evidence-cards.schema.json`.

#### 4.1.2 Item inventory (new) — `<Subject>/research/inventories/<INV>.json`

This is for sources made of items (question banks, exam papers, exercise sets). It gives the denominator; cards remain the evidence.

- **Schema:** `Shared/library/source-inventory.schema.json`.

```json
{
  "schema": "source-inventory/v1",
  "inventory_id": "INV-MAT-09-M2-POLY",
  "subject": "Mathematics",
  "members": [{"acquisition_ref": "ACQ-1DD05CE5AA04B532EC68", "sha256": "1dd05ce5…", "pages": "1-11"}],
  "declared_scope": "SPECIMEN",
  "completeness_unit": "numbered source question",
  "items": [{
    "item_id": "M2-Q017",
    "locator": {"acquisition_ref": "ACQ-1DD05…", "page": 3, "label": "Q17"},
    "format": "MULTIPLE_CORRECT",
    "question_card": "EV-MAT-09-POLY-Q017",
    "key": {"state": "PRESENT", "card": "EV-MAT-09-POLY-K017"}
  }],
  "counts": {"items": 162, "key_present": 159, "key_absent": 3, "key_ambiguous": 0},
  "digest": "sha256 of canonical items[]",
  "supersedes": null
}
```

- `declared_scope` is one of `FULL_SOURCE`, `CHAPTER`, `SPECIMEN` or `PAGE_RANGE`.
- `format` is one of `SINGLE_CORRECT`, `MULTIPLE_CORRECT`, `TRUE_FALSE`, `MATCH`, `ASSERTION_REASON`, `COMPREHENSION`, `NUMERIC`, `SHORT`, `LONG`, `HOTS`, `FILL_BLANK`, `OTHER`.
- The key `state` is one of `PRESENT`, `ABSENT` or `AMBIGUOUS`.

**Rules:**
- **(format)** `members[].acquisition_ref` MUST name a registered acquisition, and `sha256` MUST equal that acquisition's. This is #320 §24. `evidence_check.py` reports a mismatch as a finding; it does not refuse.
- **(format)** `counts` MUST equal the tallies computed from `items[]`. The tool recomputes them and reports any difference.
- **(method)** An inventory is complete when the source reader believes every item in `declared_scope` is listed. The cross-read (§4.1.3) is what makes that belief checkable.
- **(link)** A package question derived from an item cites it as `extensions["grade9v3:inventory_item"] = "INV-…#M2-Q017"`, and cites its cards in `extensions["grade9v3:citations"]` (existing key).

#### 4.1.3 Cross-read — extends `research-verification.schema.json`

- The existing `questions[]` (`card_ref`, `independent_solution`, `independent_answer`, `official_answer`, `agrees`, `numeric_check`) already separate the printed key from verified mathematics.
- Add `readback[]` for inventory items and cards:

```json
"readback": [{"ref": "INV-MAT-09-M2-POLY#M2-Q017", "reader": "agent-src-2",
              "state": "AGREED", "correction": null, "note": ""}]
```

- `state` is one of `AGREED`, `CORRECTED` or `AMBIGUOUS`.
- **Method** (`docs/method/roles/SOURCE-READER.md`):
  - Reader A inventories and transcribes.
  - Reader B, a different session id, re-reads every item against the scan page. For stems, options, expressions and keys, reader B transcribes blind first, then compares.
  - Disagreements go to `CORRECTED`, with the corrected text in the cards and the correction recorded.
  - Work in batches of ≤ 25 items, pushing after each batch.
- **Staleness:** reuse `library_board.inputs_digest()`. It already stales a verification when its cards change; extend its inputs to the inventory items the verification references. No new staleness mechanism.
- **Derived key relation:** used by the renderer (§4.3.4). An item with a PRESENT key and `agrees: true` → `MATCHES_KEY`; `agrees: false` → `CONFLICTS_WITH_KEY`; no key → `NO_KEY`.
- **Cost:** in the pilot, verifying 65 cards across 4 nodes cost $2.30, about $0.035 per card. Item readback is heavier: transcription plus comparison, estimated at 3–5× a card check, so ≈ $0.10–0.20 per item per reader. For a 162-item specimen with two readers that is ≈ $35–65. The first 25-item batch is measured, and the estimate in `UNIT.md` is updated from it.

### 4.2 Unit

#### 4.2.1 One package per unit
- The unit's records live only in `<Subject>/library/<slug>.v1.json`.
- `<Subject>/research/packages/` (staging) is retired. Records carry their own provenance:
  - `status` (CANDIDATE, VERIFIED) — existing field;
  - `extensions["grade9v3:citations"]` — existing;
  - `grade9v3:inventory_item` — new.
- **Fact status is derived, not stored.** A record's facts are *verified* when every cited card has a cross-read or verification by a session other than the record's author, and it is not stale. `unit_status.py` reports counts per unit; `accept_product.py` shows them to the owner (§4.5).
- **Migration:** fold `Mathematics/research/packages/MAT-09-LINEAR-EQUATIONS.package.json` into `Mathematics/library/linear-equations.v1.json` once, using `promote_verified.merge()` in a migration script (§8, M3).

#### 4.2.2 Package title (new field)
- `package.schema.json` gains top-level `"title": {"type": "string", "minLength": 3}`.
- The product title comes from `package.title`, then from the first bucket title. The manifest override is removed.
- The migration sets `title` for all 21 packages, taken from their current manifest titles.

#### 4.2.3 Unit folder (new) — `<Subject>/units/<slug>/`

```
UNIT.md            front matter + scope: owner_agent, spine_nodes[], sources[], inventories[], budget, status notes
DESIGN-NOTE.md     §5.3
WORKLOG.md         §5.4 (append-only by convention; git makes it immutable)
SELF-CRITIQUE.md   prototype vs goldens (§5.2 P3)
OWNER-NOTES.md     owner calibration (P4) and acceptance notes
```

- `UNIT.md` front matter:

```yaml
unit: phy-nlm-first-law
package: Physics/library/phy-nlm-first-law.v1.json
owner_agent: agent-author-3
spine_nodes: [PHY-11-LAWS-OF-MOTION-01, PHY-11-LAWS-OF-MOTION-02]
inventories: []
grade_profile: {base_grade: 11, assumed_prerequisites: [CAP-PHY-VEC-COMPONENTS],
                enrichment: [{method: "pseudo-force", bridge: "MIC-PHY-NLM-FRAME-CHOICE"}]}
coverage: {mode: CURATED_SELECTION, inventory: null}
budget_usd: 15
```

- **Syllabus link:** a unit declares the spine nodes it covers. `unit_status.py` reports spine coverage per subject, replacing the board's per-node stage machine.

### 4.3 Product — learner-state semantics in `render_core.py`

Each item below is a code change with code tests.

#### 4.3.1 Withheld content is absent from the live page
- **Current:** `reveal()` emits `<details data-requires-attempt>body</details>`; hint rungs 2..n are `<li hidden>`. Both are live DOM, in the accessibility tree and in `textContent` (RCA-UX-005).
- **Change:**
  1. A gated body is emitted as `<details data-g9-reveal data-requires-attempt data-g9-payload-ref="{unit}-{k}"><summary>…</summary><div data-g9-payload-slot></div></details><template data-g9-payload="{unit}-{k}">{body}</template>`.
  2. Hint rung 1 is live; rungs 2..n are each `<template data-g9-rung-payload="{unit}-{n}">`.
  3. JS `materialise(article)` clones each payload into its slot when the attempt commits. It is idempotent. It then calls `initFigure()` on new figures; the stage stepper is refactored out of the load handler into `initFigure(f)`.
  4. `window.g9MaterialiseAll()` exists for the key PDF only.
  5. `<noscript>` note: "Answers open after you attempt; this page needs JavaScript."
  6. `quality_observe.py` (render-core-html) reads each template's content as the body of the `details` that references it, with `gated: true`.
- **Tests** (`tests/test_render_core.py`):
  - R-1: no gated text outside `<template>` in the raw HTML.
  - R-2 (Chromium): before the commit, neither the accessibility snapshot nor `innerText` contains the gated text; after it, both do; figures inside payloads step through their stages.
  - R-3: search does not surface gated text.
  - R-4: rung n+1 is absent until "Next hint" is clicked n times.

#### 4.3.2 Typed attempts (replaces `trim().length<3`)
- **Schema:** `question.response` and `elicitation.attempt.task.response` take the form `{type, parts[], match_left[], match_right[], paper_ok}`.
  - `type` is one of `single_choice`, `multiple_choice`, `true_false`, `numeric`, `short_text`, `free_response`, `multipart` or `match`.
  - `format` from the inventory maps to `type`: MULTIPLE_CORRECT → multiple_choice, TRUE_FALSE → true_false, and so on (the table lives in `render_core.RESPONSE_FROM_FORMAT`).
- **Derivation when absent:**
  1. `options` and `answer.kind == EXACT` → single_choice;
  2. `subparts` → multipart;
  3. `answer.numeric` → numeric;
  4. otherwise → free_response.
- **Controls and commitment rules:**

| type | control | commits when |
|---|---|---|
| single_choice | radios with the source options verbatim | one is checked |
| multiple_choice | checkboxes | at least one is checked |
| true_false | two radios | one is checked |
| numeric | `inputmode=decimal` input + unit | it parses as a number, decimal, fraction or scientific |
| short_text | text input | non-empty |
| free_response | textarea + "I worked this on paper" | non-empty, or the box is ticked |
| multipart | one fieldset per part | every part commits, or the paper box is ticked |
| match | one select per left item | every select has a value |

- **Threat model** (in the docstring and the house rules): this is a commitment check for an honest self-learner. It is not marking, and not anti-cheating.
- **Touch size:** controls are ≥ 48 CSS px tall.
- **Tests:** schema; derivation; R-5 (Chromium, per type) an uncommitted click does not unlock and a valid commit does.

#### 4.3.3 Output modes and their protection

| Mode | Protection | Mechanism |
|---|---|---|
| PAGES, SINGLE_FILE, EMBED | pedagogical withholding: the bytes are present but inert | §4.3.1 |
| Learner PDF (`print-product.mjs` default) | byte withholding | printed without materialising |
| Key PDF (`print-product.mjs --key`) | none | `g9MaterialiseAll()` + every figure stage |

- The print tool currently opens every reveal. It changes to the table above, and its receipt records the mode.
- `render_core.PROTECTION` declares the table.
- **Test R-6:** the learner PDF text contains no gated text; the key PDF contains all of it.

#### 4.3.4 Printed key vs verified result
- **Schema:** `answer.source_key = {state, value, card}` (verbatim printed key) and `answer.key_relation` (derived at render time from §4.1.3 when citations allow; otherwise authored). Also `answer.key_conflict_explanation`.
- **Render:** for CONFLICTS_WITH_KEY, the solution payload shows three rows: *Printed book key* / *Mathematically verified result* / *Why they differ*. For NO_KEY, one line.
- **Test R-7:** the three rows appear only inside the payload.

#### 4.3.5 Complete Core2 projection
- `core2()` renders `figure_refs` as a pre-attempt source figure, using the first stage when staged.
- Source `hints` go into the CORE2 blueprint's `support` slot as a progressive ladder: rung 1 live, the rest deferred.
- `options` go into the typed control (§4.3.2) instead of being concatenated into the stem.
- A missing figure asset is a renderer gap, as it is for every other Core.
- **Test R-8:** a fixture with `hints` and `figure_refs` renders both, in their slots.

#### 4.3.6 Shell for the 12.7″ tablet and the audit profile
- Shell CSS tokens (`--g9-content-max`, type scale, spacing, 48 px targets) are set for 1366×854, 1440×900, 854×1366 and 900×1440.
- The owner's `tablet-12-7.css` work (branch `research/physics-library`) is the design input. It is absorbed into `render_core.CSS`, not hand-edited into pages (M5).
- `tools/site-audit/core-page-audit.mjs --profile tablet-12.7` measures overflow, undersized controls, hover-only handlers and external requests. The result is shown in the self-check report (§5.5).

#### 4.3.7 Unchanged
- One renderer (`renderer_inventory` stays as a code test).
- The render digest is a hash of the rendered pages.
- Withheld figure stages, caption and title handling (#300).
- Lineage links and the learner-facing footer.

### 4.4 Review — `products/verification/<slug>.review.json`, v2

- **Schema:** `Shared/quality/product-review.schema.json`, used to parse and display.

```json
{"schema": "product-review/v2", "product": "phy-nlm-first-law",
 "reviewer": "agent-reviewer-7", "reviewer_session": "session_…", "reviewed_at": "2026-09-28",
 "render_digest": "9e0c919bdf6a382d",
 "read_first": ["Physics/units/phy-nlm-first-law/DESIGN-NOTE.md", "…/SELF-CRITIQUE.md"],
 "strengths": [{"record": "…", "technique": "T05", "note": "…", "golden_candidate": true}],
 "findings": [{"id": "F-01", "severity": "S1", "kind": "content", "record": "…", "page": "core2a.html",
               "learner_impact": "…", "detail": "…", "suggested_fix": "…", "anti_pattern": "AP-007"}],
 "previous_findings": [{"id": "…", "status": "FIXED"}],
 "overall": {"teaches_at_reference_depth": "partly", "recommendation": "accept_with_notes", "summary": "…"}}
```

- `kind` is one of `content`, `figure`, `renderer` or `source`.
- `previous_findings[].status` is one of `FIXED`, `OPEN` or `WONT_FIX`.
- `overall.teaches_at_reference_depth` is `yes`, `partly` or `no`.
- `overall.recommendation` is `accept`, `accept_with_notes` or `revise`.

**Rules:**
- Severity (Audit-1 scale) orders the work: S0 wrong or unsafe fact, S1 misleads or gives the answer away, S2 weakens the teaching, S3 polish. It never blocks.
- Independence: the reviewer is a session that authored none of the unit's records. The acceptance tool prints the reviewer beside the package's `authored_by` values, so the owner sees it (§4.5).
- The review guide (`docs/method/REVIEW-GUIDE.md`):
  1. Read the design note, the self-critique and the latest step-back records (§5.6) first.
  2. Attempt each audited item as a learner before opening its answer.
  3. Derive every numeric claim independently.
  4. Compare with the goldens.
  5. Every finding carries a `suggested_fix`.
  6. Record at least 3 strengths.
  7. Group one defect class into one finding that lists its records.
  8. Don't report attempt-check bypass (§4.3.2).
- A reviewer may draft a new anti-pattern card in `anti_pattern_proposal` (§5.2.3).

### 4.5 Decision

- **Owner calibration (P4):** comments go in `units/<slug>/OWNER-NOTES.md`. This is the first unit per subject, or whenever an author asks.
- **Acceptance:** `Shared/tools/accept_product.py <slug> [--note …] [--accept-open F-03,…]`.
  1. Reads the current build's `render-receipt.json`.
  2. Prints, for the owner:
     - the review's digest (current or earlier) and its recommendation;
     - open S0/S1 findings;
     - fact status (records with unverified citations);
     - the reviewer vs the authors.
  3. Writes `products/acceptance/<slug>.json`: `{schema: "product-acceptance/v1", product, render_digest, accepted_by: "owner", accepted_at, review_ref, review_digest, accepted_open_findings[], unverified_fact_records, note}`.
  4. Copies that exact build to `public/products/<subject>/<slug>/`, without PDFs.
  5. Runs `build_pages_site.py` so `docs/` mirrors it.
- **Acceptance is the owner's decision.** The tool accepts any digest. When open S0/S1 findings or unverified facts exist, it asks for one confirmation ("accept anyway? y/N"). That is an acknowledgement, not a validator.
- `build_products.py build` renders to `publication/` and writes STATUS. It never writes to or deletes from `public/products`.

## 5. Knowledge assets (the method)

Everything lives under `docs/method/` and `golden/`. It replaces `template/library-agents/` and `docs/library-agents/`, which move to `docs/method/archive/`.

### 5.1 House rules — `docs/method/HOUSE-RULES.md` (one page)

1. Learner pages come only from `render_core.py`. Extend it and register a blueprint for a new surface. A hand-edited page is overwritten by the next build.
2. Facts carry a source: a card for definitions, values, relations and conditions; an inventory item for source questions and keys. Never invent a source or edit a printed key. When a key is wrong, record the key, the verified result and why they differ.
3. Answers live in answer fields: `answer.*`, hint rungs 2..n, `attempt.produces`, `model_response`, `boundary_test.answer`, `failure_signal`, `repair`. The renderer withholds exactly those. Stems, conditions, captions, figure titles and stage labels describe the situation, never the result.
4. One owner per unit. Work in your unit's package and folder; to change another unit, write in its WORKLOG.
5. Push after every phase. Sessions end without warning.
6. Declare weakness in the design note §8 and the worklog. Declared weakness is expected; hidden weakness is the failure.
7. Research widely for teaching (any source, logged in the design note §7). Cite narrowly for facts (rule 2).
8. If you change code, run the code tests before pushing (`python3 -m unittest discover -s tests`). Content changes don't need them.
9. At the end of every phase, step back and run the step-back check (§5.6). Record it; act on any answer that points the wrong way before moving on, or record why not.

The file also states the attempt threat model (§4.3.2) and the protection table (§4.3.3).

### 5.2 Protocol, exemplars, anti-patterns

#### 5.2.1 Protocol — `docs/method/PROTOCOL.md`

| Phase | Actor | Does | Produces | Move on when (judgement) | Guide spend |
|---|---|---|---|---|---|
| P0 Intake | unit author | reads the house rules and `golden/INDEX.md`; scopes the unit | `UNIT.md`, first WORKLOG entry | scope fits in 3 lines; learners named | — |
| P1 Source | source reader A → B | registers; inventories; cards; blind cross-read in batches of ≤ 25 | inventory, cards, verification with `readback[]` | every item cross-read or listed open in UNIT.md | per §4.1.3 |
| P2 Research & design | unit author | researches how the idea is best taught; chooses representations; plans the task arc | `DESIGN-NOTE.md` | each Core's decision and each transfer's novelty can be stated | $2–4 |
| P3 Prototype | unit author | builds one microtopic through all six Cores, figures included, and one item of each response type present; renders; compares with the goldens | rendered prototype, `SELF-CRITIQUE.md` | ≥ 3 improvements made after comparison; gaps named | $3–5 |
| P4 Calibration | owner | looks and comments | `OWNER-NOTES.md` | owner says continue (first unit per subject) | — |
| P5 Build | unit author | all microtopics; `self_check.py`; triage in WORKLOG | package + SVGs | the author would sign it | $5–8 |
| P6 Review | reviewer | reviews the exact render; the author revises; up to 2 rounds suggested | review v2 | recommendation is accept or accept_with_notes, or 2 rounds done | $3–6 per round |
| P7 Acceptance | owner | `accept_product.py` | acceptance + publication | — | — |

- Every phase ends with the step-back check (§5.6), recorded in WORKLOG.
- Guide total: about $15 per unit excluding P1. Past $25, note it in WORKLOG and continue.
- Launch prompts are `docs/method/prompts/{source-reader,unit-author,reviewer}.prompt.md`, each ≤ 40 lines with `{{UNIT}}`, `{{SUBJECT}}`, `{{BRANCH}}` and `{{AGENT_ID}}`.
- One branch per unit: `unit/<subject>/<slug>`, one PR per unit. The owner accepts from the merged build.

#### 5.2.2 Golden exemplars — `golden/`

```
golden/INDEX.md                Core role × technique → exemplar
golden/TECHNIQUES.md           T01–T15: definition, where in the records, exemplar, anti-pattern it prevents
golden/units/<G-ID>/           GOLDEN.md (status CANDIDATE | OWNER_BLESSED, provenance), manifest.json,
                               records.json (the excerpt), assets/*.svg, ANNOTATIONS.md, DESIGN-NOTE.md
golden/anti/AP-NNN.md          anti-pattern cards
```

- **Rendering:** `Shared/tools/build_golden.py` renders each golden through `render_core` into `golden/units/<G-ID>/rendered/` (git-ignored). Code test: every golden renders.
- **Techniques:**
  - T01 attempt-first stem;
  - T02 single-decision construction unit;
  - T03 staged representation;
  - T04 item-specific figure;
  - T05 climbing hint rung (orient → represent → first relation);
  - T06 failure signal naming the route;
  - T07 independent check by another route;
  - T08 closure written from the final transfer;
  - T09 invariant plus a changed demand;
  - T10 boundary test;
  - T11 compact anchor with its own figure;
  - T12 reconstruction with new givens;
  - T13 key vs verified;
  - T14 prerequisite bridge;
  - T15 source-faithful options.
- **Exemplars v1** (all CANDIDATE until the owner blesses them):
  - G-MATH-LINEAR-CONSTRAINT: the test fixture in `tests/test_quality_gate.py::complete_fixture`;
  - G-CORE2-R2: the question-bank reference pinned at `08446b53`;
  - G-PHY-NLM-FBD and G-PHY-KIN-SHARED-CLOCK: after the trial unit (§10 WP7) is accepted.
- **Use:** P2 reads INDEX; P3 writes SELF-CRITIQUE (technique → golden → mine → gap → change); the reviewer reads both. "Adapt the technique, not the surface."

#### 5.2.3 Anti-pattern cards — `golden/anti/`

Each card has:
- where it was seen (commit and record);
- what the learner experiences;
- the mechanism;
- how to avoid it (technique);
- a before/after excerpt;
- whether it is now structurally impossible.

| AP | Pattern | Seen | Structurally impossible now? |
|---|---|---|---|
| 001 | design purpose as caption names the result | `d1f64d03` INCLINE-2A-FBD-COMPONENTS-05; `66a5c5dc` PROJECTILE-APEX-03 | yes (#300) |
| 002 | figure title/desc states the answer | `1a047ec0` FRICTION-ZERO-03, PROJECTILE-VALIDITY-04 | yes (#300) |
| 003 | later stages CSS-hidden | `1a047ec0` COV-05 | yes (#300) |
| 004 | `produces` describes the answer before the attempt | `cb84133a` FBD-BODY-OWNERSHIP, THIRD-LAW; `1d012787` INDEPENDENT-COMPONENTS | yes (#300) |
| 005 | answers live in hidden DOM | RCA-UX-005 | yes (§4.3.1) |
| 006 | one scene reused for different situations | `c2dd7dc4` | no → T04 |
| 007 | figure depicts the previous version of the task | `9bf92e03` FRICTION-STATE-01 | no → T04, task arc |
| 008 | closure describes an older transfer | `cb84133a` IDEAL-STRING-03; `1d012787` CONSTANT-ACCEL-02 | no → T08 |
| 009 | false novelty | `1a047ec0` FRICTION-STATE-01; `cb84133a` STRING-MODEL-03; Math LE-03 | no → task arc |
| 010 | repeated hint rung | `9bf92e03` COV-04; `1d012787` SAME-HEIGHT-05 | no → T05 |
| 011 | hint or scaffold hands over the protected move | `1a047ec0` INCLINE-2A-STATIC-02; Math LE-01..04 | no → T05 |
| 012 | physically impossible setup | `9bf92e03` FBD-COMPONENTS-05 | no |
| 013 | independent check false in its own terms or at an edge case | `9bf92e03` COV-03; Math LE-04 | no → T07 |
| 014 | internal code in learner text | `9bf92e03` NLM3-3; `cb84133a` footer | partly (footer fixed) |
| 015 | Core1B task restates Core1A, or prompts from another task | `c2dd7dc4`; `66a5c5dc` CONSTANT-ACCELERATION | no → T12 |

### 5.3 Design note — `docs/method/templates/DESIGN-NOTE.md`

Sections:
1. **The idea:** the inferential jump, and what the learner can do afterwards.
2. **Wrong routes:** 3–6, each with evidence.
3. **Representations:** what each shows, why, and its safe pre-attempt stages.
4. **Task arc.** Replaces per-record novelty and closure filling (E2). Columns: Core | item | decision practised | new vs earlier | builds on. Each Core2B record's `transfer.novelty.why_new` and each family `closure` is written from this table *after* the Core2B tasks are final.
5. **Transfer plan:** invariant and changed demand.
6. **Clinic/Explorer admission:** threshold-based, 0–6 (when those surfaces exist, §9).
7. **Research log:** source, what was taken, fact or pedagogy.
8. **Known weaknesses.**

### 5.4 Worklog — `units/<slug>/WORKLOG.md`

One entry per session: date · agent · session · phase · did · decisions (with why) · open/weak · next · spend. Git history makes the log immutable (#320 §18).

### 5.5 Advisory tools

| Tool | Status | Output |
|---|---|---|
| `self_check.py --unit <subject>/<slug>` (new) | runs render, `quality_gate` (linter), `package_depth` (fields not supplied), `evidence_check` on the unit's citations, device profile, inventory counts, staleness | `publication/products/<subject>/<slug>/SELF-CHECK.md`, sections "Linter notes", "Fields not supplied", "Sources", "Device", "Staleness". Always exits 0. |
| `unit_status.py` (new, from `library_board.py`) | lifecycle state per unit (§3.2), spine coverage per subject, cost per unit | `units/STATUS.md` |
| `quality_gate.py` | CLI exits 0 by default; `--strict` only for its own tests | report unchanged |
| `package_depth.py` | same data, now "fields not supplied" | used by self_check |
| `learner-quality.v1.json` + calibration corpus | kept as the linter's rule set and its code tests | — |

### 5.6 Step-back check — at the end of every phase

At the end of **every** phase, pause and check the phase's output against the broader problem (§0.1):
- every protocol phase P0–P7 (content);
- every coding slice: each work package, PR or STEP-* (§10).

It takes minutes. It is a reflection, not a gate: no tool reads it, and nothing is refused because of it. Answer each question in one line with evidence. For any answer that points the wrong way, fix it in the same phase, or record a PLAN_UPDATE / WORKLOG entry saying why not.

| # | Step back and check | Wrong-way signal → what to do |
|---|---|---|
| SBC-1 | **Learner.** What does the learner now see, do or understand differently because of this phase? | "Nothing": say why the phase is still worth it, or drop it |
| SBC-2 | **No new gate.** Did I add anything that refuses, blocks, fails on content, or gives an agent a field or count to satisfy? | Remove it, or turn it into guidance or an advisory note |
| SBC-3 | **Thinking, not filling.** Did I research and reason, or did I fill a template, copy a file or satisfy a rule? | Do the missing research; log it (design note §7 or the PR) |
| SBC-4 | **One of everything.** Did I create a second renderer, package copy, ledger, status system, role or path? | Fold it into the existing one |
| SBC-5 | **Construction over policing.** Am I checking after the fact for a defect class the platform could make impossible? | Move it into the renderer or data format; delete the check |
| SBC-6 | **Coherence.** Does anything now describe an older version of something else (text vs task, figure vs item, doc vs code, spec vs implementation)? | Update it in this phase |
| SBC-7 | **Honest state.** Are PASS/FAIL/NOT_RUN truthful, weaknesses declared, and nothing called done that isn't? | Correct the claim |
| SBC-8 | **Convergence and cost.** Is this moving toward acceptance in ≤ 2 review rounds at predictable cost? Is the work pushed and the spend logged? | Push now; note the cost; re-plan if it is drifting |
| SBC-9 | **Reusable by others.** Could the offloaded library team, or another subject, use this without me explaining it? | Add the missing example or explanation |

Record it in WORKLOG (content phases) or in the PR description and `TASK_EVIDENCE` (coding slices):

```text
STEP-BACK CHECK — <phase or STEP-id> @ <commit>
SBC-1 Learner:            …
SBC-2 No new gate:        …
SBC-3 Thinking:           …
SBC-4 One of everything:  …
SBC-5 Construction:       …
SBC-6 Coherence:          …
SBC-7 Honest state:       …
SBC-8 Convergence/cost:   …
SBC-9 Reusable:           …
Acted on: <what changed because of this check> | none
```

The reviewer reads the latest step-back records with the design note (§4.4). The owner sees them at P4 and P7.

## 6. What changes for each participant

| Participant | Before (PR #300) | After (SPEC-AM2) |
|---|---|---|
| Unit author | fills fields to clear duties; waits on the gate; others draw figures | owns the unit; designs first; prototypes; compares with goldens; declares weaknesses |
| Source reader | harvests cards node by node; a verifier stage | inventories item sources with denominators; blind cross-read by a second reader |
| Reviewer | findings with severity that block publication | coaching review: strengths, suggested fixes, recommendation |
| Owner | sees products after review rounds; answers questions about gates | comments at the prototype; accepts an exact render; publication follows |
| Code | a gate decides publication | builds pages that can't leak; reports what it notices |

## 7. Disposition of existing machinery

| Item | Disposition | Justification |
|---|---|---|
| `render_core.py`, blueprint registry, `renderer_inventory.py` | KEEP + CHANGE (§4.3) | the asset the RCA calls "real"; safety belongs here (E3) |
| render digest | KEEP | identifies what was reviewed and accepted |
| `evidence_check.py`, `scan_ingest.py`, acquisitions, cards, allowlists | KEEP + extend (inventory checks) | quote-on-page proof is sound; nothing duplicates it |
| verification records | KEEP + extend (`readback[]`) | `agrees`/`numeric_check` already separate key from maths |
| `library_board.py` | ABSORB into `unit_status.py` | node stages and work orders duplicate the unit lifecycle; `inputs_digest` is reused |
| `promote_verified.py` | RETIRE (keep `merge()` for migration M3) | staging is retired (E7); fact status is derived per record |
| `<Subject>/research/packages/` | RETIRE after M3 | a second copy of the same unit drifts (E7) |
| `build_products.py` publish logic, `review_clearance()` | CHANGE → render + STATUS only; publication via `accept_product.py` | one decision-maker (P1, P4) |
| ratchet (`ratchet.v1.json`, `ratchet` command, its tests) | RETIRE | counted fields, not quality (E1, E2) |
| `quality_gate.py`, `quality_contract.py`, `quality_observe.py`, contract, calibration | KEEP as linter (advisory) | a useful map of the audited grammar; harmful only as a decider |
| `package_depth.py` duties | KEEP as "fields not supplied" | the same data, stripped of its gating role |
| `Shared/workflows/research-first.v1.json` | CHANGE: remove `depth_duties` and `definition_of_complete`, add `"method": "docs/method/PROTOCOL.md"`; keep the keys that `research_first_policy`, `raw_intake` and `escape_state_guard` read | the other keys are used by live code |
| `template/library-agents/`, `docs/library-agents/` | ARCHIVE | replaced by §5 |
| `.github/workflows/learner-quality.yml` | CHANGE → `code-tests.yml`: code unit tests only, informational | content CI removed (§9 R3) |
| cost ledgers | KEEP, keyed by unit | spend awareness |
| products/verification v1 reviews | KEEP as history; new reviews use v2 | evidence for the anti-pattern cards |

## 8. Migration from `main`

| Step | Action | Justification |
|---|---|---|
| M1 | Add `title` to all 21 packages from the current manifest titles; the manifest `title` override is removed | §4.2.2 |
| M2 | Create `<Subject>/units/<slug>/UNIT.md` for the 21 existing packages with status notes (no design notes invented) | every package gets a home; history is not rewritten |
| M3 | Fold `Mathematics/research/packages/MAT-09-LINEAR-EQUATIONS.package.json` into `Mathematics/library/linear-equations.v1.json` with `promote_verified.merge()`; keep ids; stamp provenance | E7 |
| M4 | Move `docs/stress-tests/` (from #317) to `evidence/stress-tests/`, which is not published | internal audit ledgers are not learner pages; fixes the `main` nav-audit failure (§9 X1) |
| M5 | Reconcile `research/physics-library` (§9 X2) | the owner's work is kept; generated pages are regenerated |
| M6 | Move the old agent templates to `docs/method/archive/` | §7 |
| M7 | Existing reviews stay v1; the next review is v2 | no rewriting of evidence |

## 9. Point register — every point raised, and its disposition

Legend:
- **IMPL:** implemented, with the section.
- **DIFF:** implemented differently; the justification says why.
- **NOT:** not implemented; the justification says why.
- **DEFER:** deferred; the justification gives the trigger.

### 9.1 What already worked on main (my #320 review)

| # | Point | Disp. | Where / justification |
|---|---|---|---|
| K1 | exact-render review binding | IMPL | §4.3.7 kept; acceptance binds the digest (§4.5) |
| K2 | pre-attempt figure-markup rule | IMPL | kept (#300); generalised by §4.3.1 |
| K3 | 3-character attempt rule | IMPL | replaced by typed attempts (§4.3.2) |

### 9.2 My ten points on #320

| # | Point | Disp. | Where / justification |
|---|---|---|---|
| R1 | answers live in hidden DOM (RCA-UX-005) | IMPL | §4.3.1 |
| R2 | protection model per output mode | IMPL | §4.3.3 |
| R3 | controls depend on CI that does not run | DIFF | Nothing in the model depends on CI: publication is the owner's acceptance, and content is judged by review. Code tests run locally before code pushes (house rule 8). CI becomes informational code tests. Branch protection is not implemented, because it would make a code gate the publication path, which this model removes. |
| R4 | say how each control is enforced; §18 and §19 in the repo | IMPL | §9.4 labels every #320 control as construction, method or judgement. §18 → worklog and review/acceptance files in git (§5.4). §19 → unit ownership (§3.3); see §9.4 for why there's no CI check. |
| R5 | review schema; reviewer independence; one agent doing readback and review | IMPL + DIFF | Schema v2 (§4.4). Source readback belongs to source readers and product review to the reviewer (§3.3). Independence is displayed at acceptance (§4.5), not machine-refused: sessions are launched by one orchestrator that records ids, and the owner sees reviewer vs authors when deciding. Refusing would need an identity system to catch a risk the owner already sees. |
| R6 | extend existing mechanisms | IMPL | readback extends verification (§4.1.3); key relation from `agrees`/`numeric_check` (§4.3.4); staleness via `inputs_digest` (§4.1.3); `renderer_inventory` kept (§4.3.7) |
| R7 | where the corpus sits vs cards and questions | IMPL | inventory = denominator, cards = evidence, questions cite both (§4.1.2) |
| R8 | cost and throughput of 100% readback | IMPL | estimate + batch rule (§4.1.3); measured on the first batch |
| R9 | state the attempt threat model | IMPL | §4.3.2, house rules |
| R10 | 12.7″ profile | IMPL | §4.3.6 |

### 9.3 Items in #299 section B

| # | Item | Disp. | Where / justification |
|---|---|---|---|
| B1 | answer-leak gate rule | NOT | Placement leaks are impossible by construction (§4.3.1, house rule 3). A text-matching rule over stems and captions misfires: givens routinely share numbers with answers, so it would teach agents to paraphrase around it (E2). Content leaks are judged by the reviewer, with AP-011 as the teaching card. |
| B2 | required Core1/Core1B figures | DIFF | The fields exist (#300) and are taught (T04, T11, AP-006/007). Making them required recreates field-filling (E2). |
| B3 | review schema + independence | IMPL | §4.4, §4.5 |
| B4 | package title field | IMPL | §4.2.2, M1 |
| B5 | tablet restyle into the renderer | IMPL | §4.3.6, M5 |
| B6 | attempt rule | IMPL | §4.3.2 |
| B7 | content intake for the offloaded team | IMPL | unit folders, one branch and one PR per unit, prompts (§5.2.1). No separate content branch: a branch per unit isolates better, and a shared content branch is what mixed content with UI commits last time. |

### 9.4 Issue #320, §1–§26

"How" says how the control holds: **C** construction, **M** method, **J** judgement.

| § | Control | Disp. | How | Where / justification |
|---|---|---|---|---|
| 1 | 100% independent readback | DIFF | M | Every item is cross-read (§4.1.3), and coverage shows in `unit_status`. It is not a promotion blocker: the owner sees fact status at acceptance (§4.5). A blocker would reintroduce the refuse-to-deliver loop. |
| 2 | independent source verification ownership | IMPL | M | reader A / reader B (§3.3, §4.1.3) |
| 3 | machine-typed scope | IMPL | C (format) | inventory fields (§4.1.2) |
| 4 | immutable corpus versions + stale dependants | IMPL | C | inventory `digest`/`supersedes`; `inputs_digest` staleness (§4.1.3) |
| 5 | source truth vs mathematical truth | IMPL | C | `source_key`, `key_relation` (§4.3.4) |
| 6 | pedagogy candidate → prototype → promote | IMPL | M + J | P2 → P3 → P4 (§5.2.1) |
| 7 | coverage mode + matrix | IMPL | M | `UNIT.md` coverage; `unit_status` shows inventory formats vs selected items |
| 8 | behaviour-class prototype | DIFF | M | P3 prototypes one item of each response type present. Not a scale-out blocker, for the reason in §1. |
| 9 | typed Core2 controls; figure/hint projection | IMPL | C | §4.3.2, §4.3.5 |
| 10 | pedagogical vs byte withholding | IMPL | C | §4.3.1, §4.3.3 |
| 11 | type-aware commitment | IMPL | C | §4.3.2 |
| 12 | Clinic / Explorer surfaces | DEFER | — | No such surface exists in `render_core`. Building one is new renderer surfaces plus blueprints plus a pedagogy design, and it should follow proof that the method works on the six existing Cores. Trigger: after the WP7 trial, when the owner prioritises it. Extension point: a new blueprint + a `render_core` role, same withholding and attempts. |
| 13 | grade / enrichment profile | IMPL | M | `UNIT.md` `grade_profile` |
| 14 | key-conflict learner component | IMPL | C | §4.3.4 |
| 15 | shared audit, 12.7″ profile | DIFF | C (measure) | Measured and shown (§4.3.6, §5.5). Not an acceptance gate, because the owner decides with the numbers in view. |
| 16 | protected-content audit across all surfaces | DIFF | C | By construction, with code tests R-1..R-4 and R-6. No content-text audit, for the reason in B1. |
| 17 | producer readiness / maturity states | DIFF | J | Descriptive lifecycle (§3.2). CI is not in the chain (R3). |
| 18 | append-only evidence | DIFF | C (git) | Worklog, reviews and acceptances in git. NOT GitHub-comment tooling: GitHub comments are not the evidence store in this model, so nothing needs protecting there. |
| 19 | path ownership; one integration head | DIFF | M | One owner per unit and one branch per unit. NOT a CI path check: it would block legitimate cross-unit fixes, which are coordinated through WORKLOG, and git history already shows who changed what. |
| 20 | revised execution flow | IMPL | M | §5.2.1 |
| 21 | implementation sequence | IMPL | — | replaced by §10 |
| 22 | quantitative metrics | DIFF | J | §11, measured in a retrospective, not gated |
| 23 | non-goals | IMPL | — | kept |
| 24 | corpus-member registration | IMPL | C (format) | §4.1.2 member rule |
| 25 | Clinic threshold 0–6 | DEFER | M | the field is in the design note §6; applies when §12 lands |
| 26 | platform-invariant declaration | IMPL | M | the house rules are the declaration; plans cite them |

### 9.5 Items currently red

| # | Item | Disp. | Where / justification |
|---|---|---|---|
| X1 | `main` nav audit: #317's `docs/stress-tests/*` pages (20 findings) | IMPL | M4 |
| X2 | 5 failing tests on `research/physics-library` | IMPL | M5, class by class: **keep** scans, acquisitions, cards, allowlist entries and m2 evidence (the owner's source work); **absorb** `tablet-12-7.css` into the shell (§4.3.6); **discard** hand-edited `public/products` and `docs/products` pages (regenerated from records); **vendor** the `cdn.jsdelivr.net` script like KaTeX; **normalise** CRLF; **classify** `public/js/raw-intake.js` in the renderer inventory (it is an intake tool, not a learner renderer); **regenerate** composer data |

### 9.6 Earlier open owner decisions

| # | Decision | Disp. | Justification |
|---|---|---|---|
| O1 | scope of the prerequisite rule | DIFF | becomes `grade_profile` in `UNIT.md` and a self-check note; no rule to scope |
| O2 | severities / thresholds | DIFF | severities stay as the review priority scale; thresholds are moot without gates |
| O3 | Core1A textbook reference (R1) | DIFF | the goldens replace the need; if the owner has a textbook unit worth emulating, it becomes a golden |
| O4 | cost ceiling | IMPL | $15 per unit guide, note at $25 (§5.2.1) |

### 9.7 Content findings from review round 4 (#299 section A)

| Item | Disp. | Justification |
|---|---|---|
| the remaining S2/S3 content findings on both pilots | IMPL via WP7 | content work under the new protocol; it is the trial unit |

### 9.8 Owner requests after r2

| # | Request | Disp. | Where |
|---|---|---|---|
| S1 | Add the broader-problem points as a step-back check at every phase of coding (2026-09-27) | IMPL | §0.1 (the points), §5.6 (the check), house rule 9, the protocol (§5.2.1), §10 (coding slices), the review guide (§4.4) |

## 10. Work packages

Effort: S ≤ ½ day, M ≈ 1 day, L ≈ 2–3 days of session work. Each code WP keeps the code test suite green, apart from the known browser-runtime failures.

| WP | Objective | Changes | Tests / done when | Depends | Effort |
|---|---|---|---|---|---|
| WP1 Decision & publication | one decision-maker | `accept_product.py`; `build_products.py` stops publishing and loses `review_clearance`/ratchet; `quality_gate` exits 0 by default; `product-review.schema.json` v2; `research-first.v1.json` change; CI → code tests; M4 | `tests/test_publication.py`: a build never touches `public/`; acceptance publishes exactly the accepted digest; its prompt appears with open S0/S1 | — | M |
| WP2 Method | agents know how to do excellent work | `docs/method/` (house rules, protocol, 3 role guides, 3 prompts, 3 templates, review guide); M6 | owner approves the house rules and protocol | — | M |
| WP3 Learner-state semantics | safety by construction | §4.3.1–4.3.5 in `render_core`, `quality_observe`, `print-product.mjs`, schema (`response`, `source_key`, `key_relation`) | R-1..R-8 pass; both pilots and linear-equations render without package edits | — | L |
| WP4 Source & unit model | one package per unit, denominators, cross-read | `source-inventory.schema.json`; `readback[]`; inventory checks in `evidence_check`; `unit_status.py`; package `title`; M1, M2, M3; retire `promote_verified` gating and staging | tests: inventory count/member reports; readback staleness via `inputs_digest`; `unit_status` states on fixture units; M3 result renders | WP1 | L |
| WP5 Shell & branch reconciliation | 12.7″ tablet shell; clean research branch | §4.3.6 tokens + audit profile; M5 class-by-class | device profile report on both pilots; research branch merges with the code suite green | WP3 | M |
| WP6 Goldens | a picture of excellence | `golden/` (INDEX, TECHNIQUES, AP-001..015, G-MATH-LINEAR-CONSTRAINT, G-CORE2-R2); `build_golden.py`; `self_check.py` | every golden renders; owner opens INDEX | WP3, WP5 | L |
| WP7 Trial unit | prove the method | `phy-nlm-first-law` through P5–P7 on the round-4 findings, under the protocol; retrospective → amend §5 | owner accepts or rejects with notes; retrospective written; G-PHY-* nominated | WP1–WP6 | content session(s) |
| WP8 Clinic/Explorer | new surfaces | §9.4 row 12 | — | WP7 + owner | L (deferred) |

- **Every coding slice** (each WP, PR or STEP-*) ends with the step-back check (§5.6), recorded in the PR description and `TASK_EVIDENCE`.
- **Order:** WP1 ∥ WP2 → WP3 → WP4 → WP5 → WP6 → WP7. WP8 comes later.
- **Why:** WP1 and WP2 first because they remove blockers and give the method without touching the renderer. WP3 before the goldens because the goldens must show the final learner behaviour. WP4 after WP1 because acceptance reads fact status.

## 11. Measures (a retrospective after the first 3 units; never gates)

| Measure | Pilot | Target |
|---|---|---|
| review rounds to acceptance | ≥ 4, not accepted | ≤ 2 |
| renderer-caused S1s at first review | 10 of 11 | 0 |
| content S1s at first review | ≥ 2 per product | ≤ 1 |
| findings with a suggested fix | not required | 100% |
| spend per accepted unit (excluding P1) | ≈ $50 per product so far | ≤ $15–25 |
| work lost to interruptions | ≈ $14 | $0 |
| owner touch-points per unit | 0 before round 4 | P4 + P7 |

## 12. Risks

| Risk | Mitigation |
|---|---|
| Quality slips without blockers | Publication needs the owner's acceptance of an exact digest; reviews coach; the owner sees the prototype early |
| Goldens make every unit look the same | Annotations teach techniques; "adapt the technique, not the surface"; several exemplars per technique over time |
| Goldens rot | re-rendered from records by `build_golden.py`; a code test renders them |
| Agents skip the method | the reviewer reads the design note and self-critique first; the owner sees them at P4 and P7; `unit_status` shows missing artifacts |
| Web research brings wrong facts | house rule 2 separates facts (cards, cross-read) from pedagogy (any source, logged) |
| Folding the Math staging loses content | M3 uses the tested `merge()`, keeps ids, and is reviewed as its own commit |
| Readback costs more than estimated | measured on the first batch; the owner sees the estimate in `UNIT.md` |

## 13. Owner decisions

| # | Decision | Recommendation |
|---|---|---|
| D1 | publication by owner acceptance of an exact digest, open findings allowed with confirmation | yes |
| D2 | two review rounds suggested before the owner decides | yes |
| D3 | two PDFs: learner and key | yes |
| D4 | one package per unit; staging retired; unit folders at `<Subject>/units/<slug>/` | yes |
| D5 | three roles (source reader, unit author, reviewer) | yes |
| D6 | CI = code tests, informational | yes |
| D7 | `docs/stress-tests/` moves to unpublished `evidence/stress-tests/` (M4) | yes |
| D8 | research-branch reconciliation classes in §9.5 X2 | yes |
| D9 | Clinic/Explorer deferred until after the trial unit | yes |
| D10 | blind cross-read of math-bearing fields (vs compare-only) for source readback | yes (≈ $35–65 per 162 items) |
