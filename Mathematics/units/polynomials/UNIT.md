---
unit: polynomials
package: Mathematics/library/polynomials.v1.json
owner_agent: chatgpt-gpt5.6-sol
spine_nodes:
  - MAT-09-POLYNOMIALS
  - MAT-09-POLYNOMIALS-01
  - MAT-09-POLYNOMIALS-02
  - MAT-09-POLYNOMIALS-03
  - MAT-09-ALGEBRAIC-IDENTITIES
  - MAT-09-ALGEBRAIC-IDENTITIES-01
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

- `m1.pdf` is now directly fetched from the Owner-connected Google Drive file `1WMARSwWpgIj4cxztZork9PA2tZjxvAk5` and registered as `ACQ-0B3450C353FF29985152`, SHA-256 `0b3450c353ff299851528edd4469bc01413920135b0fd041fe89286a00086afa`, 50 pages, 14,261,223 bytes. Requested scope here is PDF pages 33–50.
- `m2.pdf` is directly re-fetched from the Owner-connected Google Drive file `130kNsU70ulu2xvIUkV_OkYg9uipWadwB` and matches registered acquisition `ACQ-1DD05CE5AA04B532EC68`, SHA-256 `1dd05ce5aa04b532ec68c4054f55af1677ecb210be00b8f3085d6f29215a230c`, 49 pages, 18,424,888 bytes. Requested scope here is PDF pages 1–11.
- Both PDFs are scan-only in the fetched bytes (no extractable text layer). Source readback therefore uses rendered page images; OCR may assist transcription but never outranks the rendered source.
- The chapter boundary begins on m1 PDF page 32; page 32 is intentionally outside this Owner-selected specimen and is recorded as an omitted boundary page, not silently included.
- Direct page readback establishes a 212-item numbered denominator for the requested specimen: 50 items in m1:33–50 and 162 items in m2:1–11. This is a denominator, not a claim that every item is already a canonical Core2 question.
- The historical 27-row m2 stress-test ledger is discrepancy evidence only and is not accepted as a complete question inventory.
- Printed answers and independently verified mathematical results remain separate facts. OCR/transcription ambiguity remains explicit.

Existing records and status notes (do not invent a design note for inherited material):

- Parent programme: GitHub #301; governing continuation architecture: #319.
- Current bounded source responsibility: #350.
- Existing m2 acquisition/scan custody is reused; m1 acquisition custody is now registered under the same local source identity. A hashed m1 OCR scan manifest is still to be produced; raw OCR text remains private and out of Git.
- `Mathematics/library/polynomials.v1.json` does not yet exist on the approved base. The path above records the expected one-package-per-unit destination; package authoring follows source/schema reconciliation rather than being fabricated in intake.
- Official-syllabus grounding exists in `Mathematics/research/evidence/MAT-09-POLYNOMIALS.cards.json` and `Mathematics/research/syllabus-spine.json`. The unit is bound to Polynomials basics, linear-polynomial/application scope, remainder/factor/division competency, and related Algebraic Identities nodes. Per-question mapping waits for the complete source inventory rather than being guessed from legacy question rows.

First prototype and Owner calibration point:

After the source inventory/readback and basic syllabus mapping are usable, build Core2 first from the supplied bank and show the actual first-stage learner packet for Owner calibration. That is a separate downstream responsibility from this source phase.

First-stage route (Core2 with a supplied bank, otherwise Core1), source scope and reason:

Core2 first. The Owner supplied a question-bank source specimen, but the bank must first be inventoried faithfully across `m1:33–50` + `m2:1–11`. The source denominator, printed-key custody and unresolved items must be visible before Core2 selection is treated as source-backed.

Links to first-stage HTML, learner PDF, Core2 key PDF where applicable, mappings and known gaps:

- First-stage learner artifacts: not yet authored in #350.
- Source inventory: exact source bytes and the 212-item denominator are established; complete item transcription/readback is in progress.
- Basic syllabus basis: established from current CBSE Class IX 2026–27 curriculum and NCERT Grade 9 Polynomials chapter; per-question mapping is pending the complete source inventory.
- Known gap: m1's hashed OCR scan manifest and Reader-B cross-read are not yet complete. This does not permit guessed source text.

Remaining Cores and their learning dependencies (see FIRST-STAGE-REVIEW.md; research and drafting can continue):

Core2 demand/coverage will later inform Core1 orientation, Core1A/Core1B teaching and reconstruction, Core2A familiar application and Core2B changed-demand transfer. Those products are outside #350; this issue hands them one explicit source denominator and mapping rather than six pre-filled shells.
