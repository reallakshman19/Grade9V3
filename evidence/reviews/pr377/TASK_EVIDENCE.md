# TASK_EVIDENCE — PR #377 Canonical Question Bank tablet standalone

Evidence revision: 4  
Governing implementation issue: #381  
Candidate PR: #377  
Status: implementation evidence; **not** Owner acceptance, publication authority, or merge authority.

## Exact-version identity

- Audit basis head: `33998980277ff834d6d51ba377b42c87c224a510`
- Deterministic generated projection commit: `33998980277ff834d6d51ba377b42c87c224a510`
- Candidate path: `standalone/core2-canonical-question-bank-tablet.html`
- Candidate byte length: **509542**
- Candidate SHA-256: `af4010d5e58cd455812fef49892c0450f70b8f50194242c627d544ab4daef464`
- Candidate blob SHA at audited head: `9acb7ca309e9646d476c4f5e9f539d95ccef4ad9`
- Authority/build basis id embedded by the deterministic builder: `sha256:81f41c82aada2eac1e04ed9ae49a71a896fd5cf1fa85cc48d4c8f5f25a88c8b2`
- LPAP-v1 specification SHA-256 used for this evidence: `f19eaf301538ecf7a6beec12ad0a5b8ba25bb1722f1f4633bc64386d0b22abcb`
- Selected profiles: `LPAP.COMMON@1`, `LPAP.CORE2@1`, `LPAP.INTERACTIVE@1`
- Browser harness: Playwright `1.56.1` + Chromium, installed by the owning workflow.
- Browser artifact id: `11173579337`
- Browser artifact ZIP digest: `sha256:e7ac6c89a581d68e2cf65489be6414b8e15c1af54fc33bfa11d80a6ea35ab48d`
- Source workflow run: `qb-tablet-standalone` PR run `36886149371` / run #73.

At `3399898...`, the committed generated standalone already matched the deterministic builder. The PR workflow therefore passed the byte-for-byte projection check and static suite, then audited those exact committed bytes in Chromium; the synchronization commit step was correctly skipped. The browser audit records the 1280×800 support rail as `position: static`, so the right representation/support column scrolls in normal document flow like Core1A instead of sticking to the viewport.

This evidence-file revision changes no candidate bytes, canonical records, selected-view data, benchmark source, renderer logic, or authority inputs. Under LPAP-v1's exact-version model it changes audit provenance only, not the candidate content basis.

## Canonical denominator and lineage

The standalone is a projection of existing repository authority; it does not admit new question records.

- Canonical denominator: **77** unique verified-parent questions.
- Physics: **31**.
- Chemistry: **46**.
- Mathematics: **0** in this candidate; the earlier PR prose claiming Mathematics was corrected.
- Governed Selected D3/D4 view: **7** canonical IDs exactly.
- Canonical source custody requirement: every projected question retains `PYQ_VERIFIED_PARENT` custody with a parent reference and paper URL.
- Benchmark study representations: **7 SVGs**, identity-bound to the seven governed selected questions and explicitly labelled as authored study aids rather than original exam-source figures.

Deduplication/promotion action for the 77 questions is therefore `REUSE_CANONICAL`; this work does not create a second question catalog or academic authority.

## Deterministic/static projection contracts

The focused static suite validates:

- committed HTML equals the deterministic builder output byte-for-byte;
- exact 77 / 31 / 46 denominator and exact seven-question selected set;
- verified-parent custody on every question;
- all canonical learner-facing stem/conditions/options/scaffolds/answer/reasoning/crux/trap payloads are projected;
- 195 progressive hints and 77 solution templates remain inert until requested/committed;
- 29 single-correct, 6 multi-correct, and 42 free-response questions receive real answer controls;
- free-response commitment is not falsely described as automatic correctness grading;
- option labels are not duplicated;
- native offline MathML is projected from declared canonical math;
- seven selected benchmark representations are explicitly authored study aids, not source figures;
- no external runtime dependency is embedded;
- browser zoom is not disabled;
- 48 px touch convention, responsive support rail, Core1A-style normal-flow (non-sticky) support behavior, `visualViewport` focus recovery, visible `:focus-visible`, and reduced-motion handling are present.

## Exact-browser audit

The exact-browser audit completed with **zero findings**.

### Viewports

| Viewport | Page overflow | Support behavior | Undersized controls |
|---|---:|---|---:|
| 1280×800 tablet landscape | 0 px | two-column; support rail 380.64 px; `position: static` normal flow | 0 |
| 800×1280 tablet portrait | 0 px | stacked below stage | 0 |
| 390×844 compact | 0 px | stacked below stage | 0 |

### Runtime witnesses

- Questions: **77**
- Selected D3/D4: **7**
- Selected SVGs: **7**
- Hint templates: **195**
- Solution templates: **77**
- Native MathML nodes: **181** total (**48 live + 133 inert-template**)
- Search witness ("redox"): **26**
- Search reset: **77**, visible text `Showing 77 questions`
- Selected-view rendered page height: **6182 px**
- `visualViewport`: present
- viewport meta: `width=device-width, initial-scale=1, viewport-fit=cover`
- external runtime request finding: none
- horizontal-overflow finding: none
- sticky/support-rail scroll-model finding: none (`supportPosition: static` at 1280×800)
- touch-target finding: none
- hint/solution live-DOM leak finding: none
- single/multi/free-response commitment finding: none
- localStorage/theme/filter/search finding: none

### Keyboard, focus, virtual-keyboard and reduced-motion witness

The browser audit now exercises the behavior rather than only checking source text:

- Space selects the focused MCQ answer.
- Enter activates the focused solution-reveal button.
- focused reveal control matches `:focus-visible`;
- computed focus outline is **solid 3 px**;
- reduced-motion emulation converts focus/reveal scrolling to `behavior: auto`;
- a focused free-response input is re-centered after an explicit `visualViewport.resize` event;
- captured scroll witnesses include the free-response input twice at `block: center, behavior: auto`.

## Retained browser evidence

The workflow artifact retains:

- `tablet-landscape.png`
- `tablet-portrait.png`
- `compact.png`
- `selected-d3d4.png`
- `attempt-hint-solution.png`
- `browser-audit.json`

The retained screenshots were inspected as learner-facing evidence in addition to computed geometry/runtime measurements.

## Repository integration / guardrail reconciliation

The branch originally introduced two candidate-specific repository guardrail deltas beyond the known main-branch debt:

1. the new deterministic standalone builder was unclassified in the renderer inventory;
2. `docs/architecture-manifest.json` did not include the new builder and two new test files.

Revision `c08daab7...` resolves both:

- `Shared/tools/build_qb_tablet_standalone.py` is explicitly inventoried as `MIGRATE`, not hidden from the single-renderer freeze and not labelled as the canonical academic authority;
- the architecture manifest is regenerated for the builder plus static/browser tests;
- `public/data/prompt-composer-data.js` is regenerated to bind the updated architecture-manifest digest rather than retaining the stale prior repository basis;
- the committed GitHub Pages mirror `docs/data/prompt-composer-data.js` is synchronized to those exact generated bytes;
- the guardrail step **Generated artifacts have not drifted** passes on the revised head.

The repository's full `guardrails` workflow is already failing on exact `main` (`00ca6dc70c727e25de7e85becc49cda2ea293f47`, run `36851048158`) for pre-existing cross-repository contract/library/GCDR debt. Those baseline failures are not converted into candidate PASS claims here. Exact-head workflow results after this evidence-only commit are recorded on #381 / #377.

## Workflow evidence before the evidence-only head

At human implementation head `c08daab7...`:

- `v31-relay` pull-request run: **PASS**
- `learner-platform-code-tests` pull-request run: **PASS**
- `v31-relay` push run: **PASS**
- `learner-platform-code-tests` push run: **PASS**
- owning-branch `qb-tablet-standalone` push run `36877604546`: **PASS**
  - deterministic `--write`: PASS
  - focused static projection contracts: PASS
  - exact Chromium audit: PASS
  - generated synchronization commit: PASS
  - browser evidence upload: PASS

The contemporaneous pull-request QB run at `c08daab7...` failed only its deterministic `--check` because the regenerated accessibility bytes had not yet been committed at that PR event. The owning push run immediately produced and tested those bytes, then committed them as `9461ea71...`. The evidence-only head is used to obtain a human-authored exact head whose PR `--check` can execute normally.

## LPAP result boundaries

| Area | Evidence result |
|---|---|
| exact candidate identity | PASS |
| canonical denominator / selected-view parity | PASS |
| deterministic projection | PASS |
| Core2 attempt → optional support → committed reveal mechanics | PASS |
| offline/runtime dependency check | PASS |
| responsive tablet/compact geometry | PASS |
| touch-target computation | PASS |
| keyboard/focus/virtual-keyboard behavior | PASS |
| reduced-motion focus behavior | PASS |
| local state/theme/filter/search behavior | PASS |
| native MathML projection | PASS |
| selected representation identity/provenance labelling | PASS |
| independent academic re-solving of all 77 questions | NOT_RUN by this implementation slice; not claimed |
| independent human product review | NOT_RUN; not claimed |
| Owner acceptance/publication | NOT_RUN / out of scope |
| merge decision | out of scope |

## Remaining findings / decisions

- No candidate-specific browser finding remains in the exact Chromium audit.
- Full repository guardrails retain known main-branch failures; those remain separate repository debt unless the exact-head comparison shows a new delta.
- The standalone builder is intentionally recorded as a migration path, not a permanent second renderer.
- Owner acceptance, publication, and merge remain outside #381's implementation responsibility.
