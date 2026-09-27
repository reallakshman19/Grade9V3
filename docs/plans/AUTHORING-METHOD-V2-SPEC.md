# SPEC-AM2 — Authoring Method v2: guide the work, don't gate it

| Field | Value |
|---|---|
| Status | DRAFT for owner review |
| Date | 2026-09-27 |
| Baseline | `main@1d044c18` (after PR #300) |
| Replaces | the publish-gate semantics of `build_products.py`; `definition_of_complete` in `Shared/workflows/research-first.v1.json`; the agent templates in `template/library-agents/` and `docs/library-agents/`; the product ratchet |
| Amends | #320 (reconciliation in §10), #319 |
| Keeps | `render_core.py` (the one renderer), the blueprint registry, the research tooling (`evidence_check`, `library_board`, `promote_verified`), the quality contract and calibration corpus (demoted to a linter), and exact-render digests |

Requirement IDs used below:
- `A*`: platform (code, true by construction);
- `B*`: method (protocol, exemplars, notes);
- `C*`: judgement (review, owner);
- `T*`: tooling;
- `W*`: work packages.

"MUST" applies only to code behaviour and data formats. Nothing in this spec stops an agent from delivering or asks it to refuse work.

---

## 1. Problem statement (evidence)

**E1. Gates passed what reviewers failed.**
- Both Physics pilots reached quality-gate `PASS` with 0 gaps (`products/status.v1.json`).
- Four consecutive independent reviews still found S1 defects:

| Round | Reviewer | Evidence | Laws of Motion S1 | Motion in a Plane S1 |
|---|---|---|---|---|
| 1 | agent-verifier-2 | `c2dd7dc4` | yes (figures reused, Core1B task = `produces`) | yes |
| 2 | agent-verifier-3 | `1a047ec0` | 2 | 2 |
| 3 | agent-verifier-5 | `9bf92e03`, `d1f64d03` | 2 | 1 |
| 4 | agent-verifier-6 | `cb84133a` | 2 | 2 |

**E2. Agents optimised for the fields the gate counted, not for quality.**
- `transfer.novelty` was present on every Core2B item. It was false for Q-PHY-NLM-2B-FRICTION-STATE-01 (round 2) and Q-PHY-NLM-2B-STRING-MODEL-03 (round 4), and for MAT-09-LINEAR-EQUATIONS-03 (verifier).
- `family_exposure.closure` was present everywhere, yet stale on 5 items in round 4.

**E3. Most S1s were structural and belonged in the renderer.**
- 10 of the 11 S1s in rounds 2–4 came from how pages were built:
  - later figure stages hidden with CSS;
  - asset `<title>`/`<desc>`;
  - the design `purpose` printed as a caption;
  - `produces` shown before the attempt.
- Each became impossible once the renderer changed. None needed a gate.

**E4. Handoffs broke coherence.**
- Author, illustrator, verifier and reviewer worked on the same unit in separate sessions.
- The round-4 S2s were almost all "text describes the previous version of a task someone else rewrote".

**E5. Cost.**
- $100.87 on the two pilot products.
- $182.21 recorded in total, of which about $14 was lost to usage-limit interruptions before a push.
- Four fix rounds, and still not owner-accepted.

**E6. Every contract rule added during Phase 6 came after a reviewer found the defect.**
- ALL-FIGURE-SPECIFIC, ALL-PRE-ATTEMPT-MARKUP-WITHHELD and the Core1B task duty were each written after the fact.
- The gate encoded past reviews. It never found a new defect.

**Conclusion:**
- Quality came from craft and judgement: a clear idea of the teaching move, good examples, and an independent reader.
- Safety came from the renderer's construction.
- Validation layers added cost and gave agents a target to satisfy instead of a learner to serve.

## 2. Goals and non-goals

**Goals**
- G1. Agents produce their best unit by following a method and studying annotated exemplars. They do not chase validators.
- G2. No content blocker anywhere. An agent always delivers, and declares its known weaknesses.
- G3. Learner-safety properties (no answer before the attempt, one shell) hold because the renderer is built that way.
- G4. One owner per unit, end to end (content and figures). One independent reviewer. The owner accepts.
- G5. Owner taste enters at the first prototype, not after review rounds.
- G6. Reuse everything already built. Nothing is rewritten for its own sake.

**Non-goals**
- No new gates, ratchets or content CI.
- Code keeps its unit tests: they protect code, not content.
- No server-side secrecy: standalone HTML stays standalone.
- No change to the research evidence tooling beyond the promotion rule (§7.3).

## 3. Architecture

```
┌──────────────────────── C. JUDGEMENT ─────────────────────────┐
│ independent review (coach) ──► owner acceptance ──► publish    │
└───────────────▲──────────────────────────────────────────────┘
                │ design note, worklog, self-check notes
┌──────────────── B. METHOD ───────────────────────────────────┐
│ house rules · protocol P0–P7 · design note · golden exemplars │
│ anti-pattern cards · roles (source reader / unit author /     │
│ reviewer) · worklog                                           │
└───────────────▲──────────────────────────────────────────────┘
                │ records (package JSON) + SVG assets
┌──────────────── A. PLATFORM (by construction) ───────────────┐
│ render_core: deferred payloads · typed attempts ·             │
│ printed-key/verified display · per-mode protection ·          │
│ exact-render digest                                           │
└──────────────────────────────────────────────────────────────┘
        T. advisory tools: self_check.py (linter report), device audit
```

## 4. Layer A — platform, true by construction

These are renderer features with code unit tests. They do not judge content. They make certain defects impossible to produce.

### A1. One renderer, one shell (exists; unchanged)
- `Shared/tools/render_core.py` is the only producer of learner pages.
- `renderer_inventory.py` stays as a code unit test.
- A new learner surface (Clinic, Explorer) is added by extending `render_core` and registering a blueprint in `Shared/web/interactive-page-blueprints.v1.json` (W8).

### A2. Deferred materialisation of post-attempt content (new)

**Today:** `reveal()` (line 199) emits `<details data-requires-attempt>…body…</details>`. The body is live DOM: it is in the accessibility tree and in `textContent`, and search finds it. Hint rungs 2..n are `<li hidden>`, also live. This is RCA-UX-005.

**Requirement A2.1.** Gated bodies are emitted inside a `<template>`. A template's contents are not rendered, not focusable, not in the accessibility tree and not in `textContent`.

```html
<details data-g9-reveal data-requires-attempt data-g9-payload-ref="{unit}-{k}">
  <summary>{summary}</summary>
  <div data-g9-payload-slot></div>
</details>
<template data-g9-payload="{unit}-{k}">{body}</template>
```

- `{unit}` is the article's `data-g9-unit`.
- `{k}` is a per-article counter.
- Ungated `reveal(..., gated=False)` is unchanged.

**Requirement A2.2.** Hint rungs: rung 1 is emitted live. Rungs 2..n are each emitted as `<template data-g9-rung-payload="{unit}-{n}">`. The "Next hint" button materialises exactly one rung.

**Requirement A2.3.** The JS commit handler materialises the article's payloads:

```js
function materialise(article){
  q('details[data-g9-payload-ref]', article).forEach(d => {
    const slot = q('[data-g9-payload-slot]', d)[0];
    if (slot.childElementCount) return;                       // idempotent
    const t = q('template[data-g9-payload="'+d.dataset.g9PayloadRef+'"]', article)[0];
    slot.replaceChildren(t.content.cloneNode(true));
    q('figure[data-g9-figure]', slot).forEach(initFigure);   // stage stepper for new figures
  });
}
```

- The figure stage-stepper setup (currently inline in `JS`) is refactored into `initFigure(f)`. It is called at load and after each materialisation.

**Requirement A2.4.** `window.g9MaterialiseAll()` materialises every payload on the page. The only caller is the print tool, when it produces the key PDF (A5).

**Requirement A2.5.** The observer is updated:
- `quality_observe.py` (`render-core-html` extractor) reads `<template data-g9-payload>` content as the body of the `details` that references it, with `gated: true`;
- blocks inside payloads count as blocks of the unit.

The linter keeps working. The observation schema is unchanged apart from reveal parsing.

**Requirement A2.6.** Without JS, gated content is not visible. The page shows `<noscript>` text: "Answers open after you attempt; this page needs JavaScript." That is acceptable because the product is an interactive tablet page, and the PDF covers print.

**Tests (code), in `tests/test_render_core.py`:**
- **A2-T1:** no text from a gated block appears outside a `<template>` in the raw HTML. Parse with `html.parser`; answer summaries of the fixture product are the probe strings.
- **A2-T2 (Chromium, skip without node):**
  - before commit, `page.accessibility.snapshot()` and `document.body.innerText` contain none of the probes;
  - after clicking commit with a valid attempt, they contain all the probes;
  - figures inside payloads step through their stages.
- **A2-T3:** search input with a probe string hides the article before the attempt. The text is not searchable.
- **A2-T4:** rung n+1 is absent from the DOM until "Next hint" is clicked n times.

### A3. Typed attempt controls (new; replaces `trim().length<3`)

**Requirement A3.1. Schema.** In `Shared/library/package.schema.json`, `$defs.question.properties.response` and `$defs.microtopic.properties.elicitation.attempt.task.response` get the same shape:

```json
"response": {
  "type": "object", "additionalProperties": false, "required": ["type"],
  "properties": {
    "type": {"enum": ["single_choice", "multiple_choice", "true_false", "numeric",
                      "short_text", "free_response", "multipart", "match"]},
    "parts": {"type": "array", "items": {"type": "object", "required": ["id", "type"],
              "properties": {"id": {"type": "string"}, "label": {"type": "string"},
                             "type": {"enum": ["numeric", "short_text", "free_response", "single_choice"]}}}},
    "match_left": {"type": "array", "items": {"type": "string"}},
    "match_right": {"type": "array", "items": {"type": "string"}},
    "paper_ok": {"type": "boolean", "default": true}
  }
}
```

**Requirement A3.2. Derivation when `response` is absent.** Existing packages keep working. The first rule that applies wins:
1. `options` non-empty and `answer.kind == "EXACT"` → `single_choice`;
2. `subparts` non-empty → `multipart`, each part `free_response`;
3. `answer.numeric` present → `numeric`;
4. otherwise → `free_response`.

Multiple-correct, true/false, match and numeric source questions set `response.type` explicitly; the derivation is only a default.

**Requirement A3.3. Controls.** `attempt_box(label)` becomes `attempt_box(label, response, qid)`.

| type | control | commitment rule (JS) |
|---|---|---|
| single_choice | `<fieldset>` of radios, `name="{qid}"`, labels = source options verbatim | exactly one checked |
| multiple_choice | checkboxes | ≥ 1 checked |
| true_false | two radios "True" / "False" | one checked |
| numeric | `<input inputmode="decimal">` plus a unit label | value matches `^[-+]?(\d+(\.\d*)?\|\.\d+)([eE][-+]?\d+)?(\s*/\s*\d+)?$` after trim |
| short_text | `<input type="text">` | non-empty after trim |
| free_response | `<textarea>` plus a checkbox "I worked this on paper" (if `paper_ok`) | non-empty after trim, OR paper box checked |
| multipart | one `<fieldset>` per part, each part's own control | every part committed, OR the paper box checked |
| match | one `<select>` per left item (options = right items) | every select has a value |

- A commit that fails its rule focuses the first empty control and shows one line: "Make your choice first" or "Write your attempt, or tick 'worked on paper'".

**Requirement A3.4. Threat model**, stated in the house rules (B1) and the renderer docstring:
- The commitment check assumes an honest self-learner. It is not marking and not anti-cheating.
- Reviewers do not raise "can be bypassed" findings against it.

**Requirement A3.5.** Controls are at least 48 CSS px tall on touch profiles, via `.g9-attempt :is(input,select,label){min-height:48px}`.

**Tests:**
- **A3-T1:** schema accepts every type.
- **A3-T2:** the derivation table is followed.
- **A3-T3 (Chromium):** for each type, an uncommitted click does not unlock, and a valid commit does. Paper acknowledgement unlocks `free_response`.

### A4. Printed source key vs verified result (new)

**Requirement A4.1. Schema.** Additions to `$defs.answer`:

```json
"source_key": {"type": "object", "additionalProperties": false, "required": ["state"],
  "properties": {"state": {"enum": ["PRESENT", "ABSENT", "AMBIGUOUS"]},
                 "value": {"type": "string"},
                 "location": {"type": "string", "description": "acquisition id + page, e.g. ACQ-…#p10"}}},
"key_relation": {"enum": ["MATCHES_KEY", "CONFLICTS_WITH_KEY", "NO_KEY"]},
"key_conflict_explanation": {"type": "string"}
```

- `answer.summary` / `answer.numeric` remain the verified result.
- `source_key` is the printed book key, copied verbatim and never edited.

**Requirement A4.2. Render.** When `key_relation == "CONFLICTS_WITH_KEY"`, the Core2 solution payload shows a block `key_conflict`:

| Printed book key | Mathematically verified result | Why they differ |
|---|---|---|
| `source_key.value` | `answer.summary` | `key_conflict_explanation` |

- When `NO_KEY`, it shows "The source prints no key for this question; the result below was derived and independently checked."

**Test A4-T1:** the three rows render inside the payload (A2), never before the attempt.

### A5. Protection model per output mode (new; declared in code and in the house rules)

| Mode | Where | Protection | How |
|---|---|---|---|
| `PAGES`, `SINGLE_FILE`, `EMBED` | web, standalone HTML | pedagogical withholding | A2 templates. The bytes are present but inert. |
| PDF (learner) | `tools/print/print-product.mjs` default | byte withholding | printed without materialising, so payloads are never rendered |
| PDF (key) | `print-product.mjs --key` | none (teacher/answer copy) | calls `window.g9MaterialiseAll()` and opens every stage |

- `print-product.mjs` changes as follows.
  - **Today** it opens every reveal and prints the complete page.
  - **Default:** writes `<page>.pdf` without opening anything. Payloads stay unmaterialised, and the print CSS already hides `.g9-attempt`.
  - **`--key`:** writes `<page>.key.pdf`.
  - The receipt records the mode.
- Constant `PROTECTION = {"PAGES": "pedagogical", "SINGLE_FILE": "pedagogical", "EMBED": "pedagogical"}` in `render_core.py`, cited by the house rules.

### A6. Exact-render digest (exists; unchanged)
- `build()` hashes the rendered pages (commit `98d2695f`).
- The digest identifies what was reviewed and what the owner accepted (C2).

### A7. 12.7-inch device profile (advisory measurement)
- `tools/site-audit/core-page-audit.mjs` gains `--profile tablet-12.7` with viewports 1366×854, 1440×900, 854×1366 and 900×1440. The existing 10-inch set becomes `--profile tablet-10` (the default).
- Measured facts (horizontal overflow px, controls < 48 px, hover-only handlers, external requests) are written to JSON and shown in the self-check report (T1). They are not a verdict.

## 5. Layer B — method

All method files live under `docs/method/`. They replace `template/library-agents/*.md` and `docs/library-agents/*.md`, which move to `docs/method/archive/` with a header line "superseded by SPEC-AM2".

### B1. House rules — `docs/method/HOUSE-RULES.md` (one page, exactly these rules)

1. **One renderer.** Learner pages come only from `render_core.py`. To add a surface, extend it and register a blueprint. Never build a page by hand; the next build overwrites it.
2. **Facts carry a source.** Definitions, values, exam questions and printed keys cite a registered source (`<Subject>/research/…`). Never invent a source, and never silently change a printed key. When the key is wrong, record `source_key`, the verified result and why they differ (A4).
3. **Answers live in answer fields.** Put result-bearing text only in `answer.*`, `hint_ladder` rungs 2..n, `boundary_test.answer`, `attempt.produces`, `model_response`, `failure_signal` and `repair`. The renderer withholds exactly those (A2). Stems, conditions, captions, representation titles and stage labels are shown before the attempt: they describe the situation, never the result.
4. **One owner per unit.** Work only in your unit's files. To change another unit, write in its `WORKLOG.md`.
5. **Push after every phase.** Sessions end without warning, and unpushed work is lost.
6. **Declare weakness.** Every hand-off lists what you know is weak (design note §8, worklog). Declared weakness is expected. Hidden weakness is the only failure.
7. **Research widely for teaching; cite narrowly for facts.** Use the web and any source for pedagogy, misconceptions and representations, and log it (design note §7). Facts follow rule 2.

The file also states the attempt threat model (A3.4) and the protection table (A5).

### B2. Protocol — `docs/method/PROTOCOL.md`

**Unit.** One syllabus unit (≈ one library package, or one microtopic family), with its own folder:

```
units/<subject>/<unit-slug>/
  UNIT.md            scope, owner, sources, target package path, status line
  DESIGN-NOTE.md     B3 (the unit's design record)
  WORKLOG.md         B6 (append-only session log)
  SELF-CRITIQUE.md   B4.5 (prototype vs goldens)
  source/            corpus.json + readback logs (P1, only when the unit ingests a source corpus)
  owner-notes.md     owner calibration comments (P4)
```

The package itself stays in `<Subject>/library/<slug>.v1.json` (staging: `<Subject>/research/packages/`).

**Phases.** Each phase has a purpose, the actor, what it produces, and a "ready to move on when" judgement. None of these is a checkpoint that blocks anything.

| Phase | Actor | Does | Produces | Ready to move on when |
|---|---|---|---|---|
| P0 Intake | unit author | reads the syllabus node, the house rules and the goldens INDEX; creates the unit folder | `UNIT.md`, first `WORKLOG.md` entry | the scope is stated in 3 lines and the target learners are named |
| P1 Source | source reader (plus a second reader) | registers sources; inventories every source item; two independent readings; resolves differences | `source/corpus.json` (B7), `source/readback-*.md` | every inventoried item has a readback state; open ambiguities are listed |
| P2 Research & design | unit author | researches how the idea is best taught (web, texts, misconception literature); picks representations; plans the task arc | `DESIGN-NOTE.md` §1–§8 | the author can state the one decision each Core practises and why each transfer is new |
| P3 Prototype | unit author | builds one microtopic through all six Cores, including figures; renders with `build_products.py build --only <pkg>`; compares against the goldens | rendered prototype; `SELF-CRITIQUE.md` | the self-critique names at least 3 improvements made and any remaining gaps |
| P4 Owner calibration | owner | looks at the prototype and design note; comments | `owner-notes.md` | owner says "continue" (first unit per subject only, or when the author asks) |
| P5 Full build | unit author | all microtopics; runs `self_check.py` (T1) and triages its notes in the worklog | full package + SVGs; `SELF-CHECK.md` triage | the author would put their name on it |
| P6 Review | independent reviewer | reviews the exact render (C1); the author responds and revises (suggested ≤ 2 rounds) | `products/verification/<name>.review.json` v2 | the reviewer's `overall.recommendation` is `accept` or `accept_with_notes`, or 2 rounds are done |
| P7 Acceptance | owner | reads the review; accepts a render digest | `products/acceptance/<name>.json`; published copy | — |

**Budget guidance** (not a stop): about $15 per unit across P1–P6. Log spend in the worklog. If it reaches $25, write a note and continue.

### B3. Design note — `docs/method/templates/DESIGN-NOTE.md`

YAML front matter, parsed by `self_check.py` for display only:

```yaml
unit: phy-nlm-first-law
subject: Physics
owner_agent: agent-author-3
grade_profile:
  base_grade: 11
  assumed_prerequisites: [CAP-PHY-VEC-COMPONENTS]
  enrichment: [{method: "pseudo-force in non-inertial frame", bridge: "MIC-PHY-NLM-FRAME-CHOICE Core1A unit 2"}]
source_scope: {corpus_id: null, packages: [Physics/library/phy-nlm-first-law.v1.json]}
coverage_mode: CURATED_SELECTION        # or FULL_CORPUS
clinic_admission: []                    # 0..6 item ids, each justified in §6
```

Body sections, with one paragraph or table each:
1. **The idea.** The inferential jump in one sentence, and what a learner can do afterwards that they could not before.
2. **Wrong routes.** The 3–6 most likely wrong routes, each with evidence (a research log ref or a source question that exposes it).
3. **Representations.** For each: what it shows, why it beats the alternatives, and which stages are safe before the attempt.
4. **Task arc.** One row per item across Cores.

   | Core | Item | Decision practised | New compared with earlier items | Earlier items it builds on |
   |---|---|---|---|---|

   This table replaces per-item `transfer.novelty` field-filling (E2). Novelty is reasoned once, across the whole arc. Each Core2B record then gets a one-line `transfer.novelty.why_new` copied from its row.
5. **Transfer plan.** What stays invariant, what changes, and the family closure text for each Core2A family. Closures are written after the Core2B tasks are final.
6. **Clinic/Explorer admission** (when those surfaces exist, W8). Admission is by threshold; 0 is a valid answer.
7. **Research log.** One row per source: link or reference, what was taken, and whether it is fact (must be a registered source) or pedagogy (any source).
8. **Known weaknesses.** An honest list.

### B4. Golden exemplars — `golden/`

```
golden/
  INDEX.md                         Core role × technique → exemplar paths
  TECHNIQUES.md                    technique vocabulary (B4.2)
  units/<G-ID>/
    GOLDEN.md                      status, provenance, what it exemplifies
    manifest.json                  product manifest selecting the exemplar records
    records.json                   package excerpt (only the exemplar records)
    assets/*.svg
    ANNOTATIONS.md                 per block: technique, why it works, pitfall
    DESIGN-NOTE.md                 the design note behind it (B3)
  anti/AP-NNN.md                   anti-pattern cards (B4.3)
```

- **Rendering.** `python3 Shared/tools/build_golden.py` renders each `units/*/manifest.json` through `render_core` into `golden/units/<G-ID>/rendered/` (git-ignored), so exemplars always show in the current shell.
- **Code test G-T1:** every golden renders without an exception. It does not judge content.

#### B4.1 Golden units v1

Every unit starts `CANDIDATE`. Only the owner sets `OWNER_BLESSED` in `GOLDEN.md`.

| ID | Source | Exemplifies |
|---|---|---|
| G-MATH-LINEAR-CONSTRAINT | `tests/test_quality_gate.py::complete_fixture` (MIC-MATH-CONSTRAINT, Q-MATH-LINEAR-01, the 2B fixture, `number-line-7-3.svg`) | staged number line with pre-attempt-safe stages; failure signal naming a real wrong route (2.33 ≠ 7/3); independent check by substitution; transfer with bracket-reversed undo order |
| G-PHY-NLM-FBD | `phy-nlm-first-law` MIC-PHY-NLM-FBD-BODY-OWNERSHIP, Core1 → Core2B, as fixed through round 4 | one body per diagram; construction units one decision each; Core1B task with new givens; agent → target naming |
| G-PHY-KIN-SHARED-CLOCK | `phy-kin-2d-motion` MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS | compact anchor with its own figure (`REP-KIN-2D-ANCHOR-POSITION-2-3`); same-instant pairing; mixed-instant wrong route |
| G-CORE2-R2 | question-bank reference R2, pinned `08446b53` (benchmarks/quality-calibration) | Core2 grammar: attempt-first stem, trap, aligned figure, progressive hints, derivation, independent check |

- The two Physics goldens are taken after the remaining round-4 findings are fixed, and are blessed by the owner at P7.

#### B4.2 Technique vocabulary — `golden/TECHNIQUES.md`

Each entry gives a name, a one-line definition, where it lives in the records, the golden example, and the anti-pattern it prevents.

`T01` attempt-first stem · `T02` single-decision construction unit · `T03` staged representation (safe stages before the attempt) · `T04` item-specific figure · `T05` diagnostic hint rung (orient → represent → first relation) · `T06` failure signal naming the tempting route · `T07` independent check by a different route · `T08` family closure written from the final transfer · `T09` transfer invariant plus a changed demand · `T10` boundary test · `T11` compact anchor with its own figure · `T12` reconstruction task with new givens · `T13` printed-key vs verified display · `T14` prerequisite bridge · `T15` source-faithful options and labels.

#### B4.3 Anti-pattern cards — `golden/anti/AP-NNN.md`

Each card has:
- the title;
- where it was seen (review file @ commit, and record id);
- what the learner experiences;
- the mechanism (why agents produce it);
- how to avoid it (technique id);
- a before/after excerpt;
- whether A2–A5 now make it impossible (`structural: yes/no`).

| ID | Anti-pattern | Seen (commit, record) | Structural now? |
|---|---|---|---|
| AP-001 | Design `purpose` printed as the caption names the result | `d1f64d03` Q-PHY-NLM-INCLINE-2A-FBD-COMPONENTS-05; `66a5c5dc` Q-PHY-KIN-2D-2A-PROJECTILE-APEX-03 | yes (PR #300 captions) |
| AP-002 | Figure `<title>`/`<desc>`/tooltip states the answer | `1a047ec0` Q-PHY-NLM-2B-FRICTION-ZERO-03, Q-PHY-KIN-2D-2B-PROJECTILE-VALIDITY-04 | yes |
| AP-003 | Later figure stages only CSS-hidden | `1a047ec0` Q-PHY-NLM-2A-COV-05 | yes |
| AP-004 | Success criteria (`produces`) describe the answer before the attempt | `cb84133a` MIC-PHY-NLM-FBD-BODY-OWNERSHIP, MIC-PHY-NLM-THIRD-LAW; `1d012787` MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS | yes |
| AP-005 | One scene reused for different situations | `c2dd7dc4` (cliff scene for level-ground items; one horse-and-cart FBD for 11 units) | no: T04 |
| AP-006 | Figure still depicts the previous version of a rewritten task | `9bf92e03` Q-PHY-NLM-2B-FRICTION-STATE-01 | no: T04, B3 §4 |
| AP-007 | Family closure describes an older transfer task | `cb84133a` Q-PHY-NLM-2A-IDEAL-STRING-03; `1d012787` Q-PHY-KIN-2D-2A-CONSTANT-ACCEL-02 | no: T08 |
| AP-008 | False novelty: the transfer decision was already shown answered | `1a047ec0` FRICTION-STATE-01; `cb84133a` STRING-MODEL-03; Math LE-03 verification | no: B3 §4 |
| AP-009 | A hint rung repeats the previous one | `9bf92e03` Q-PHY-NLM-2A-COV-04; `1d012787` Q-PHY-KIN-2D-2A-SAME-HEIGHT-05 | no: T05 |
| AP-010 | A hint or scaffold hands over the protected move before the last rung | `1a047ec0` Q-PHY-NLM-INCLINE-2A-STATIC-02; Math LE-01..04 verification | no: T05 |
| AP-011 | Physically impossible setup (block "rests" on a smooth incline) | `9bf92e03` Q-PHY-NLM-INCLINE-2A-FBD-COMPONENTS-05 | no |
| AP-012 | Independent check false in its own terms or in an edge case | `9bf92e03` Q-PHY-NLM-2A-COV-03; Math LE-04 (x = y) | no: T07 |
| AP-013 | Internal code reaches the learner (NLM3-3, product id in footer) | `9bf92e03`; `cb84133a` | partly (the footer is structural) |
| AP-014 | Core1B task restates the Core1A anchor, or prompts belong to another task | `c2dd7dc4`; `66a5c5dc` MIC-PHY-KIN-2D-CONSTANT-ACCELERATION | no: T12 |

#### B4.4 How exemplars are used (in the protocol, not enforced)
- **P2:** the author reads `INDEX.md` for the Cores and techniques relevant to the unit.
- **P3:** the author writes `SELF-CRITIQUE.md`:

  | Technique | Golden example | My version (record id) | Gap and what I changed |
  |---|---|---|---|

- The reviewer reads the design note and self-critique first (C1).
- Instruction to authors: "adapt the technique, not the surface". Goldens are not templates to copy.

#### B4.5 Evolution
- An owner-accepted unit can be nominated as golden by the reviewer (in `strengths[]`, C1) or by the owner.
- A new anti-pattern card is added when a review finds a defect class not yet catalogued. The reviewer drafts the card in its review (`anti_pattern_proposal`).

### B5. Roles — `docs/method/roles/`

The five agent roles become three.
- **SOURCE-READER.md**
  - **Replaces:** researcher (for facts) and scanner.
  - **Owns:** source registration, corpus inventory and readback.
  - **Pairs with:** a second source reader, for independent readback.
- **UNIT-AUTHOR.md**
  - **Replaces:** author, illustrator, and researcher for pedagogy.
  - **Owns:** the unit end to end: design note, records, figures, prototype, full build, and responses to review.
  - **May delegate** figure drawing to a helper session, but the author stays accountable for coherence (E4).
- **REVIEWER.md**
  - **Replaces:** verifier (for products) and product verifier.
  - **Reviews** independently (C1).
  - **Also** does node-level fact verification in the research pipeline, which is kept as is (§7.3).

Each role file covers purpose; what you own; what you produce (paths); the method (links to protocol phases); how to use the goldens; what excellent looks like (golden links); and how to declare uncertainty. It contains no "never/must" lists beyond the house rules.

- **Launch prompts:** `docs/method/prompts/<role>.prompt.md`, each ≤ 40 lines with `{{UNIT}}`, `{{SUBJECT}}`, `{{BRANCH}}` and `{{AGENT_ID}}` placeholders. The prompt says: read the house rules, the protocol and your role file; run phases X–Y; push after each phase.

### B6. Worklog — `units/<subject>/<unit>/WORKLOG.md`

Append-only by convention. Git history makes it immutable, which answers #320 §18 without any GitHub tooling. One entry per session:

```markdown
## 2026-09-28 · agent-author-3 · session_… · P3 Prototype
- Did: …
- Decisions: … (why)
- Open / weak: …
- Next: …
- Spend: $4.10 (session total)
```

### B7. Source corpus format — `units/<…>/source/corpus.json` (P1)

A data format taken from #320 §3/§24. It records coverage; it is not a promotion gate.

```json
{
  "schema": "source-corpus/v1",
  "corpus_id": "CORPUS-MAT-09-POLY-M2A",
  "members": [{"acquisition_id": "ACQ-1DD05CE5AA04B532EC68", "sha256": "1dd05ce5…", "pages": "1-11"}],
  "declared_scope": "SPECIMEN",
  "completeness_unit": "numbered source question",
  "items": [
    {"item_id": "M2A-Q017", "location": "ACQ-1DD05…#p3", "format": "MULTIPLE_CORRECT",
     "readback": {"reader_a": "agent-src-1", "reader_b": "agent-src-2", "state": "AGREED"},
     "printed_key": {"state": "PRESENT", "value": "(a),(c)", "location": "ACQ-1DD05…#p10"}}
  ],
  "counts": {"items": 162, "readback_agreed": 162, "key_present": 159, "key_absent": 3, "key_ambiguous": 0},
  "corpus_digest": "sha256 of items[] canonical JSON",
  "supersedes_digest": null
}
```

- **Readback method** (SOURCE-READER.md):
  - two readers transcribe independently, in shards of ≤ 25 items, pushing after each shard;
  - `diff_readback.py` lists disagreements;
  - a third look resolves each one, logged in `readback-resolution.md`.
- **Downstream links:** package questions cite `extensions["grade9v3:corpus_item"] = "<corpus_id>#<item_id>"`. `self_check.py` notes, without failing, when a cited corpus digest has been superseded.

## 6. Layer C — judgement

### C1. Review v2 — `products/verification/<name>.review.json`

- The schema is `Shared/quality/product-review.schema.json` (new). It is used to parse and display, never to block.
- The v2 record:

```json
{
  "schema": "product-review/v2",
  "product": "phy-nlm-first-law",
  "reviewer": "agent-reviewer-7", "reviewer_session": "session_…",
  "reviewed_at": "2026-09-28",
  "render_digest": "9e0c919bdf6a382d",
  "read_first": ["units/physics/phy-nlm-first-law/DESIGN-NOTE.md", "…/SELF-CRITIQUE.md"],
  "strengths": [{"record": "…", "technique": "T05", "note": "…", "golden_candidate": false}],
  "findings": [{
    "id": "F-01", "severity": "S1", "kind": "content|figure|renderer|source",
    "record": "…", "page": "core2a.html",
    "learner_impact": "what the learner experiences",
    "detail": "…", "suggested_fix": "concrete wording or value",
    "anti_pattern": "AP-007", "anti_pattern_proposal": null
  }],
  "previous_findings": [{"id": "…", "status": "FIXED|OPEN|WONT_FIX", "note": "…"}],
  "overall": {"teaches_at_reference_depth": "yes|partly|no",
              "recommendation": "accept|accept_with_notes|revise", "summary": "…"}
}
```

- **Severity (Audit-1 scale) orders the work:**
  - S0: wrong or unsafe fact;
  - S1: misleads, or gives the answer away before the attempt;
  - S2: weakens the teaching;
  - S3: polish.

  It does not block. The owner decides at P7.
- **Reviewer guide** — `docs/method/REVIEW-GUIDE.md`:
  1. Attempt every audited item as a learner before opening its answer.
  2. Derive every numeric claim independently.
  3. Compare against the goldens and the design note's task arc.
  4. Give every finding a `suggested_fix`.
  5. Record at least 3 strengths.
  6. Don't raise findings about A3 bypassability (A3.4).
  7. Prefer one finding per defect class, with the list of affected records, over many duplicates.
- **Independence:** the review runs in a session that authored none of the unit's records (`reviewer` ∉ the `authored_by` values in the package). This is declared by the launcher and visible in the file. It is not machine-enforced.

### C2. Owner acceptance and publication

- New tool `Shared/tools/accept_product.py <name> [--note "…"] [--accept-open F-03,F-07]`:
  1. reads `publication/products/<subject>/<name>/render-receipt.json` (the current build);
  2. writes `products/acceptance/<name>.json`:
     ```json
     {"schema": "product-acceptance/v1", "product": "phy-nlm-first-law", "render_digest": "9e0c919bdf6a382d",
      "accepted_by": "owner", "accepted_at": "2026-09-29", "review_ref": "products/verification/phy-nlm-first-law.review.json",
      "review_digest": "9e0c919bdf6a382d", "accepted_open_findings": ["F-03"], "note": "…"}
     ```
  3. copies that build to `public/products/<subject>/<name>/` (not the PDFs);
  4. runs `build_pages_site.py` so `docs/` mirrors it.
- Owner acceptance is the only way a product is published. This is a decision, not a validator: it accepts any digest, with any open findings, when the owner chooses.
- `build_products.py build` renders to `publication/` and writes STATUS. It never writes to or deletes from `public/products`.
- STATUS shows, per product:
  - gaps (advisory);
  - the review's recommendation and whether its digest is current;
  - acceptance: current, superseded (the current build differs from the accepted digest), or none.

## 7. Tooling changes (T)

### T1. `Shared/tools/self_check.py` (new; advisory)

```
self_check.py --product <name>      # render, contract linter, depth prompts, device audit (if node)
self_check.py --unit <subject>/<unit>   # plus design-note front matter, corpus counts, staleness notes
```

- Writes `publication/products/<subject>/<name>/SELF-CHECK.md` with these sections: *Linter notes* (contract rules that fired, grouped by rule, with record ids), *Fields not supplied* (depth prompts), *Device measurements* (A7), and *Staleness notes* (superseded corpus digests; the review digest ≠ current).
- The wording is "notes", never "failures".
- Always exits 0 unless the tool itself crashes.

### T2. Quality contract and gate → linter
- `learner-quality.v1.json`, `quality_contract.py`, `quality_observe.py` and `quality_gate.py` keep their code and calibration.
- `quality_gate.gate()` keeps its report format. The `verdict` field is documented as advisory, and no caller uses it to publish.
- The `quality_gate.py` CLI exits 0 by default. Pass `--strict` for the old exit code, used only by its own tests.

### T3. Depth duties → prompts
- `package_depth.DUTIES` is kept (same data), and it feeds the "Fields not supplied" section of T1.
- `library_board.py --depth` changes its heading from "duties" to "prompts".
- `promote_verified.plan()` no longer refuses for depth duties. It refuses only nodes that are not `VERIFIED`: the library holds independently checked facts, and that is house rule 2, not a quality gate. Depth prompts are listed in the promotion receipt for the unit author.

### T4. Remove
- The product ratchet: `build_products.py ratchet`, `products/ratchet.v1.json` and `tests/test_products_ratchet.py::Ratchet`.
- `review_clearance()` in `build_products.py`: replaced by acceptance (C2). The review is still read for display.
- `definition_of_complete` in `Shared/workflows/research-first.v1.json`: replaced by `"method": "docs/method/PROTOCOL.md"`.
- CI:
  - `.github/workflows/learner-quality.yml` becomes `code-tests.yml`. It runs the code unit tests only (render_core, quality_contract self-tests, package_migrate, renderer_inventory, research tooling), with no `calibrate`, gate or ratchet steps.
  - It is informational while the Actions budget is exhausted.

## 8. File-level change list

| Path | Change |
|---|---|
| `Shared/tools/render_core.py` | A2 (`reveal`, rungs, JS `materialise`/`initFigure`/`g9MaterialiseAll`, `<noscript>`); A3 (`attempt_box`, derivation, JS commit rules, CSS); A4 (`key_conflict` block); A5 `PROTECTION` |
| `Shared/library/package.schema.json` | `question.response`; `elicitation.attempt.task.response`; `answer.source_key`, `answer.key_relation`, `answer.key_conflict_explanation` |
| `Shared/tools/quality_observe.py` | read `<template data-g9-payload>` as gated reveal bodies (A2.5) |
| `tools/print/print-product.mjs` | learner PDF by default, `--key` PDF (A5) |
| `tools/site-audit/core-page-audit.mjs` | `--profile tablet-10\|tablet-12.7` (A7) |
| `Shared/tools/build_products.py` | stop publishing; remove `review_clearance` and ratchet; STATUS shows review and acceptance |
| `Shared/tools/accept_product.py` | new (C2) |
| `Shared/tools/self_check.py` | new (T1) |
| `Shared/tools/build_golden.py` | new (B4) |
| `Shared/tools/diff_readback.py` | new (B7) |
| `Shared/tools/quality_gate.py` | exit 0 by default, `--strict` (T2) |
| `Shared/tools/promote_verified.py` | drop the depth-duty refusal (T3) |
| `Shared/tools/library_board.py` | "prompts" wording (T3) |
| `Shared/quality/product-review.schema.json` | new (C1) |
| `Shared/workflows/research-first.v1.json` | `definition_of_complete` → `method` (T4) |
| `products/ratchet.v1.json` | delete (T4) |
| `products/acceptance/` | new directory (C2) |
| `.github/workflows/learner-quality.yml` | → `code-tests.yml` (T4) |
| `docs/method/**` | new (B1–B7) |
| `golden/**` | new (B4) |
| `units/**` | new; created per unit at P0 |
| `template/library-agents/`, `docs/library-agents/` | → `docs/method/archive/` |
| `tests/test_render_core.py` | A2-T1..T4, A3-T1..T3, A4-T1 |
| `tests/test_quality_gate.py` | keep the rule tests; drop publish-verdict assumptions |
| `tests/test_products_ratchet.py` | → `tests/test_publication.py` (acceptance copies the exact build; a build never touches `public/`) |
| `tests/test_golden.py` | G-T1 |

## 9. Work packages

Effort: S ≤ ½ day, M ≈ 1 day, L ≈ 2–3 days of session work. Every code package keeps the full code suite green, with only the known browser-runtime failures.

| WP | Scope | Depends on | Effort | Done when |
|---|---|---|---|---|
| W1 | **Unblock:** T2–T4 and C2 (`accept_product.py`, `build_products` stops publishing, ratchet removed, promotion refuses only unverified, CI → code tests) | — | M | `test_publication.py` passes; `build_products.py build` leaves `public/` untouched; `accept_product.py` publishes exactly the accepted digest |
| W2 | **Method docs:** B1, B2, B3 template, B5 roles and prompts, B6, the REVIEW-GUIDE, and archiving the old templates | — | M | owner reads and approves the house rules and protocol |
| W3 | **Deferred materialisation:** A2 + A5 + observer A2.5 + print modes | — | M | A2-T1..T4 pass; learner PDF has no answer text; key PDF has all |
| W4 | **Typed attempts:** A3 (schema, derivation, controls, JS, CSS) | W3 (same JS module) | M | A3-T1..T3 pass; both pilots render with derived types, and no package edits are needed |
| W5 | **Key vs verified:** A4 | W3 | S | A4-T1 passes |
| W6 | **Goldens v1:** B4 (INDEX, TECHNIQUES, AP-001..014 with real excerpts, G-MATH-LINEAR-CONSTRAINT and G-CORE2-R2 as CANDIDATE; `build_golden.py`, G-T1) | W3, W4 (so goldens show the new shell) | L | the owner can open `golden/INDEX.md` and every exemplar renders |
| W7 | **Self-check + device profile:** T1, A7, `product-review.schema.json`, `diff_readback.py` | W1 | M | `self_check.py --product phy-nlm-first-law` writes SELF-CHECK.md and exits 0 |
| W8 | **Clinic/Explorer surfaces** in `render_core` + blueprints (#320 §12) | W3, W4 | L | scheduled after the method is trialled; owner prioritises |
| W9 | **Trial run of the method:** take `phy-nlm-first-law` through P5–P7 on the round-4 findings, then nominate G-PHY-NLM-FBD and G-PHY-KIN-SHARED-CLOCK | W1–W7 | content work (the offloaded team, or one unit-author session) | owner accepts, or rejects with notes; retrospective written |

**Order:** W1 ∥ W2 → W3 → W4 ∥ W5 → W7 → W6 → W9. W8 comes later.

## 10. Reconciliation with #320

Dispositions:
- **A:** code, by construction.
- **B:** method (protocol, format, exemplar).
- **C:** judgement (review, owner).
- **D:** deferred.

| #320 § | Topic | Disposition | Where |
|---|---|---|---|
| 1 | 100% independent readback | B | P1 two readers + `diff_readback.py`; coverage counts recorded in `corpus.json` |
| 2 | Source ownership / independent verification | B | roles: source reader + second reader; reviewer independence (C1) |
| 3 | Machine-typed scope | B | `corpus.json` fields (B7) |
| 4 | Immutable corpus versioning | B | `corpus_digest` / `supersedes_digest` in git; T1 staleness notes |
| 5 | Source vs math truth | A | A4 schema + render |
| 6 | Pedagogy candidate → prototype → promote | B, C | P2 → P3 → P4 owner calibration |
| 7 | Coverage mode | B | design-note front matter `coverage_mode` + §4 task arc |
| 8 | Behaviour-class prototype | B | P3 guidance: the prototype exercises each `response.type` present in the unit |
| 9 | Typed Core2 controls, figure/hint projection | A | A3; blueprint slots exist |
| 10 | Pedagogical vs byte withholding | A | A2, A5 table |
| 11 | Type-aware commitment | A | A3, threat model A3.4 |
| 12 | Clinic / Explorer | D | W8 |
| 13 | Grade / enrichment profile | B | design-note `grade_profile` |
| 14 | Key-conflict learner component | A | A4.2 |
| 15 | Shared audit, 12.7″ profile | A (advisory measurement) | A7 |
| 16 | Global protected-content audit | A | A2 by construction + A2-T1..T4 code tests |
| 17 | Producer readiness / maturity states | C | DRAFT → REVIEWED → ACCEPTED → PUBLISHED (C2); CI is not in the chain |
| 18 | Append-only evidence | B | WORKLOG in git (B6); review and acceptance files in git |
| 19 | Path ownership, one integration head | B | house rule 4; unit folders |
| 20 | Execution flow | B | PROTOCOL P0–P7 |
| 21 | Implementation sequence | — | §9 here |
| 22 | Quantitative metrics | C | §11 here (measured, not gates) |
| 23 | Non-goals | kept | §2 |
| 24 | Corpus-member registration | B | `members[]` cite acquisition id + sha256 + pages (B7) |
| 25 | Clinic threshold 0..6 | B | design note §6 |
| 26 | Platform-invariant declaration | B | the house rules are the declaration; plans cite them |

## 11. Success measures (tracked in a retrospective after the first 3 units; never gates)

| Measure | Pilot baseline | Target |
|---|---|---|
| Review rounds to owner acceptance | ≥ 4 (not yet accepted) | ≤ 2 |
| Renderer-caused S1s at first review | 10 of 11 (rounds 2–4) | 0 |
| Content S1s at first review | ≥ 2 per product | ≤ 1 |
| Findings with a suggested fix | not required | 100% |
| Spend per accepted unit | ≈ $50 per pilot product (so far) | ≤ $15–25 |
| Work lost to interruptions | ≈ $14 | $0 (push per phase) |
| Owner touch-points per unit | 0 before review 4 | P4 + P7 |

## 12. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Quality drops without blockers | Publication still needs owner acceptance of an exact digest (C2); the review is richer (strengths, suggested fixes); P4 puts owner taste in early |
| Goldens become copy templates and every unit looks the same | Annotations teach techniques; ≥ 2 exemplars per technique over time; "adapt the technique, not the surface" (B4.4) |
| Goldens rot as the renderer changes | `build_golden.py` re-renders from records; G-T1 catches exceptions |
| Agents skip the method | The reviewer reads the design note and self-critique first and names missing ones; the owner sees them at P4 and P7 |
| Web research brings in wrong facts | House rule 2 separates facts (registered sources, verified) from pedagogy (any source, logged) |
| Advisory notes get ignored | The author triages SELF-CHECK in the worklog (P5); the reviewer sees the triage |
| Deferred payloads break in some embedding context | EMBED mode keeps the same template mechanism; A2-T2 runs in Chromium; `<noscript>` notice |

## 13. Decisions for the owner

- **D1.** Publication is by owner acceptance of an exact digest, open findings allowed at the owner's discretion (C2). *Recommended: yes.*
- **D2.** Suggested review rounds before the owner decides: 2. *Recommended: yes.*
- **D3.** Two PDFs per product: learner (no answers) and key (all answers). *Recommended: yes.*
- **D4.** Unit working folders in `units/<subject>/<unit>/`, with packages kept where they are. *Recommended: yes.*
- **D5.** CI becomes code-tests only and informational. *Recommended: yes.*
- **D6.** Five roles merge into three (source reader, unit author, reviewer). *Recommended: yes.*
- **D7.** The first golden units after W9: G-PHY-NLM-FBD and G-PHY-KIN-SHARED-CLOCK. *Owner to bless.*
- **D8.** Start with W1 + W2, which unblock the work and set the method, before any renderer change. *Recommended: yes.*
