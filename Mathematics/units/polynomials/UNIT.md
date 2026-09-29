---
unit: polynomials
package: Mathematics/library/polynomials.v1.json
owner_agent: chatgpt-gpt5.6-sol
spine_nodes: []
inventories: []
grade_profile:
  base_grade: 9
  assumed_prerequisites: []
  enrichment: []
coverage:
  mode: CURATED_SELECTION
  inventory: null
budget_usd: 15
---

# Unit scope

Learner and three-line scope:

Grade 9 Mathematics — Polynomials. Build a source-faithful question bank and basic syllabus mapping before the first Core2 learner prototype. The requested specimen is `m1.pdf` pages 33–50 plus `m2.pdf` pages 1–11; this source phase does not author learner-facing Core2 HTML.

Sources and open source uncertainties:

- `m2.pdf` is registered as `ACQ-1DD05CE5AA04B532EC68`, SHA-256 `1dd05ce5aa04b532ec68c4054f55af1677ecb210be00b8f3085d6f29215a230c`, 49 pages. Requested scope here is PDF pages 1–11.
- Independent RCA previously read the owner-provided `m1.pdf` as 50 pages, SHA-256 `0b3450c353ff299851528edd4469bc01413920135b0fd041fe89286a00086afa`. Requested scope here is PDF pages 33–50. Current source bytes still need direct re-verification and repository registration.
- The chapter boundary is known to begin on m1 PDF page 32; page 32 is intentionally outside this Owner-selected specimen and is recorded as an omitted boundary page, not silently included.
- The historical 27-row m2 stress-test ledger is discrepancy evidence only. Later reconciliation found a larger keyed denominator, so it is not accepted as a complete question inventory.
- Printed answers and independently verified mathematical results remain separate facts. OCR/transcription ambiguity remains explicit.

Existing records and status notes (do not invent a design note for inherited material):

- Parent programme: GitHub #301; governing continuation architecture: #319.
- Current bounded source responsibility: #350.
- Existing m2 acquisition/scan custody is reused; no competing Polynomials source ledger or renderer is introduced.
- `Mathematics/library/polynomials.v1.json` does not yet exist on the approved base. The path above records the expected one-package-per-unit destination; package authoring follows source/schema reconciliation rather than being fabricated in intake.
- `Mathematics/research/syllabus-spine.json` currently lacks canonical Polynomials nodes; basic mapping work will add only source-supported nodes.

First prototype and Owner calibration point:

After the source inventory/readback and basic syllabus mapping are usable, build Core2 first from the supplied bank and show the actual first-stage learner packet for Owner calibration. That is a separate downstream responsibility from this source phase.

First-stage route (Core2 with a supplied bank, otherwise Core1), source scope and reason:

Core2 first. The Owner supplied a question-bank source specimen, but the bank must first be inventoried faithfully across `m1:33–50` + `m2:1–11`. The source denominator, printed-key custody and unresolved items must be visible before Core2 selection is treated as source-backed.

Links to first-stage HTML, learner PDF, Core2 key PDF where applicable, mappings and known gaps:

- First-stage learner artifacts: not yet authored in #350.
- Source inventory: pending direct m1 registration and complete source readback.
- Basic syllabus mapping: pending official-syllabus/textbook research.
- Known gap: current execution context does not yet expose the exact m1 source bytes for direct verification/readback.

Remaining Cores and their learning dependencies (see FIRST-STAGE-REVIEW.md; research and drafting can continue):

Core2 demand/coverage will later inform Core1 orientation, Core1A/Core1B teaching and reconstruction, Core2A familiar application and Core2B changed-demand transfer. Those products are outside #350; this issue hands them one explicit source denominator and mapping rather than six pre-filled shells.
