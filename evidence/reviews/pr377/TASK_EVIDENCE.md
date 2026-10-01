# TASK_EVIDENCE — PR #377 Canonical Question Bank tablet standalone

Evidence revision: 6  
Governing implementation issue: #381  
Candidate PR: #377  
Status: implementation evidence; **not** Owner acceptance, publication authority, or merge authority.

## Exact blueprint and candidate identity

- Blueprint/reference PR: **#372**, kept strictly read-only.
- Exact #372 head used and re-verified: `edba5daf43371b4f5142ccc3ae16a1a1af6ba7a6`.
- Blueprint: `BP-CORE2-SOURCE-QUESTION@1.5.0`.
- Blueprint shell: `G9-TABLET-SHELL-V1`.
- Candidate synchronized commit: `d8dfeebea877fe3de030c45c4aa16f710e2a0586`.
- Candidate path: `standalone/core2-canonical-question-bank-tablet.html`.
- Candidate blob SHA: `2d892aba1221b123e4c9b97c69b156eb706d148e`.
- Candidate byte length: **1,167,241**.
- Candidate SHA-256: `71de9f0014b5bd7a5d9907d36cbae0439f6927e53186613bbf22efdab11e1ae9`.
- Exact browser artifact: `qb-tablet-standalone-browser-audit`, artifact **11181354336**.
- Artifact ZIP digest: `sha256:af526cf86a6a8ad81ea811dcde79a5b545de85ac66de868ba364060126c3f9da`.
- Owning workflow: `qb-tablet-standalone` push run **#94** / run id `36901451785`.

No branch, file, PR metadata, comment, or workflow on #372 was modified by this reconciliation.

## Canonical denominator and academic authority

The standalone remains a deterministic learner-facing projection of existing repository authority.

- Canonical denominator: **77** unique verified-parent questions.
- Physics: **31**.
- Chemistry: **46**.
- Governed Selected D3/D4 view: **7** exact canonical IDs.
- Every projected question retains `PYQ_VERIFIED_PARENT` custody, parent identity, and source-paper URL.
- The seven selected SVGs remain explicitly labelled as authored study representations, not original exam-source figures.
- No canonical Physics/Chemistry question was rewritten to make the standalone conform to #372.

## #372 CORE2 contract now projected

The candidate now implements the full overlapping CORE2 tablet contract rather than only the prior column geometry:

- fixed tablet shell and compact shell behavior from `G9-TABLET-SHELL-V1`;
- **light** default theme;
- **17 px** base learner type and **14 px** minimum selected-figure text;
- **48 px** minimum touch targets;
- identity band with source identity, learner metadata, optional official source-PDF affordance, and difficulty disclosure;
- `STEM`, `CONDITIONS`, `TRAP`, and `ATTEMPT` owned by the primary attempt flow;
- `REPRESENTATION` and progressive `HINT_LADDER` owned by the support flow;
- expanded breakpoint **980 px** with **42/58 primary/support geometry**;
- support column remains **non-sticky** / normal-flow;
- solution is full-width below both expanded columns;
- compact component order follows the blueprint ordering;
- hint rungs are provenance-explicit `AUTHORED_CORE2_PROMPT_REVEAL`;
- solution disclosure is **attempt-gated and learner-openable**;
- committing an attempt unlocks the solution but does **not** auto-open or pre-materialize it;
- opening `Answer and working` materializes the inert canonical answer/step payload;
- answer commitment is not correctness auto-grading for single-, multi-, or free-response items;
- attempt state, progressive-hint depth, scratchpad, theme and answer inputs persist locally;
- `SINGLE_FILE` packaging omits the page-PDF shell control per #372 policy while retaining each verified source-paper PDF link.

## Static/deterministic projection contracts

The focused static suite passes and verifies:

- committed generated HTML equals deterministic builder output;
- exact 77 / 31 / 46 denominator and exact seven-question selected set;
- full canonical learner payload projection;
- 77 identity/source-PDF/difficulty/attempt/solution component structures;
- 195 inert guided-support payloads and 77 inert solution payloads;
- #372 blueprint identity is embedded in the output;
- 29 single-correct, 6 multi-correct and 42 free-response answer-control families;
- no correctness-auto-grading language;
- source PDF links remain the only remote hrefs; no remote runtime dependency is embedded;
- zoom is not disabled;
- 17 px base type, 48 px touch floor, 980 px breakpoint, 42/58 geometry, non-sticky support, figure text floor, focus visibility and reduced-motion behavior.

## Exact Chromium audit

Run #94 completed with **zero findings**.

### Layout witnesses

| Viewport | Overflow | Theme/type | CORE2 geometry / flow | Touch findings |
|---|---:|---|---|---:|
| 1366×854 | 0 px | light / 17 px | 42/58, support static, full-width solution | 0 |
| 1440×900 | 0 px | light / 17 px | 42/58, support static, full-width solution | 0 |
| 1280×800 | 0 px | light / 17 px | 42/58, support static, full-width solution | 0 |
| 854×1366 | 0 px | light / 17 px | compact ordered flow | 0 |
| 900×1440 | 0 px | light / 17 px | compact ordered flow | 0 |
| 800×1280 | 0 px | light / 17 px | compact ordered flow | 0 |
| 390×844 | 0 px | light / 17 px | compact ordered flow | 0 |

At the #372 12.7-inch reference viewport **1366×854**:

- primary fraction: **0.419995944**;
- primary width: **517.75 px**;
- support width: **715 px**;
- support position: `static`;
- identity height: **124.64 px** (blueprint cap: 190 px);
- minimum selected-figure text: **14 px**;
- horizontal overflow: **0 px**;
- undersized controls: **0**.

### Runtime witnesses

- questions: **77**;
- selected questions: **7**;
- selected SVG representations: **7**;
- source-paper PDF links: **77**;
- difficulty disclosures: **77**;
- hint ladders: **77**;
- inert hint payloads: **195**;
- solution disclosures: **77**;
- native MathML nodes: **180** total (**48 live + 132 inert-template**);
- exact HTML MathML markup count: **180**;
- `visualViewport`: present;
- viewport meta: `width=device-width, initial-scale=1, viewport-fit=cover`;
- blueprint identity in runtime: `BP-CORE2-SOURCE-QUESTION@1.5.0`;
- packaging mode in runtime: `SINGLE_FILE`;
- selected-view rendered height: **10,300 px**;
- keyboard focus outline: **solid 3 px**;
- reduced-motion focus recovery: `behavior: auto`, `block: center`;
- browser findings: **[]**.

The audit also proves that committed-attempt state restores as an **unlocked but still inert** disclosure; the canonical solution only materializes after the learner explicitly opens it.

## Retained browser evidence

Artifact 11181354336 retains:

- `tablet-1366-landscape.png`
- `tablet-1440-landscape.png`
- `tablet-1280-landscape.png`
- `tablet-854-portrait.png`
- `tablet-900-portrait.png`
- `tablet-800-portrait.png`
- `compact.png`
- `selected-d3d4.png`
- `attempt-hint-solution.png`
- `browser-audit.json`

## Repository integration / guardrail boundary

Candidate-specific renderer inventory / architecture-manifest drift introduced earlier in implementation has been repaired. The generated-artifact drift check passes on the reconciled branch.

The repository-wide guardrail workflow has a known failing step set already present on `main`; this evidence does not convert those repository debts into candidate PASS claims. The final human evidence head is used to compare the exact failure set against `main`.

## Result boundaries

| Area | Evidence result |
|---|---|
| #372 CORE2 blueprint binding | PASS |
| deterministic canonical projection | PASS |
| exact denominator / selected view | PASS |
| shell / typography / touch / responsive contract | PASS |
| attempt → unlock → learner-open solution semantics | PASS |
| progressive hint provenance / persistence | PASS |
| no correctness auto-grading | PASS |
| keyboard / focus / reduced motion / visualViewport | PASS |
| offline runtime dependency | PASS |
| source-paper PDF availability | PASS |
| selected representation provenance | PASS |
| exact Chromium audit | PASS |
| independent academic re-solving of all 77 | NOT_RUN / not claimed |
| Owner acceptance / publication | NOT_RUN / out of scope |
| merge decision | out of scope |

#372 remains read-only. Publication, merge, and Owner acceptance remain explicitly outside #381's implementation authority.
