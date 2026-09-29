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
inventories:
  - INV-MAT-09-POLYNOMIALS-M1P33-50-M2P1-11
grade_profile:
  base_grade: 9
  assumed_prerequisites: []
  enrichment: []
coverage:
  mode: SOURCE_CORPUS_CANDIDATE
  inventory: INV-MAT-09-POLYNOMIALS-M1P33-50-M2P1-11
budget_usd: 15
---

# Unit scope

Grade 9 Mathematics — Polynomials. The source producer phase owns a source-faithful corpus and basic syllabus mapping for the Owner-selected specimen `m1.pdf` PDF pages 33–50 plus `m2.pdf` PDF pages 1–11. Learner-facing Core2 HTML/PDF is downstream and is not authored in #350.

## Exact source basis

- `m1.pdf`: acquisition `ACQ-0B3450C353FF29985152`; 50 pages; 14,261,223 bytes; SHA-256 `0b3450c353ff299851528edd4469bc01413920135b0fd041fe89286a00086afa`; requested specimen pages 33–50.
- `m2.pdf`: acquisition `ACQ-1DD05CE5AA04B532EC68`; 49 pages; 18,424,888 bytes; SHA-256 `1dd05ce5aa04b532ec68c4054f55af1677ecb210be00b8f3085d6f29215a230c`; requested specimen pages 1–11.
- Both exact files were re-fetched from the Owner-connected Google Drive and digest/page-count verified on 2026-09-29.
- Both are scan-only PDFs in the fetched bytes. Rendered page images are the readback authority; OCR never outranks the source image.
- m1 PDF page 32 is a known chapter-opening boundary deliberately outside the Owner-selected specimen.
- The historical 27-row m2 stress ledger remains discrepancy evidence only, never the denominator.

## Canonical source denominator

Committed inventory: `Mathematics/research/inventories/INV-MAT-09-POLYNOMIALS-M1P33-50-M2P1-11.json`

- m1 pages 33–50: **50 / 50** top-level source items transcribed.
- m2 pages 1–11: **162 / 162** top-level source items transcribed.
- combined denominator: **212 / 212**.
- source roles: **172 QUESTION + 40 WORKED_EXAMPLE**.
- printed-key state: **167 PRESENT / 45 ABSENT / 0 key-ambiguous**.
- committed inventory digest: `sha256:7f6592b14a11f4cf83d3e8a92a25c559fa86c21f44e5ef6b230798e0ba64c9d9`.

The 40 worked examples remain source-inventory/evidence items; they are intentionally not miscast as assessment questions.

## Canonical package projection

`Mathematics/library/polynomials.v1.json` is the CANDIDATE downstream package projection.

- **172 ORIGINAL source questions**, each linked to one inventory item and evidence card.
- typed `extensions.source_custody` binds acquisition, exact scan digest, source item locator and demand-bearing component state.
- basic item mapping totals:
  - `MAT-09-ALGEBRAIC-IDENTITIES-01`: 73
  - `MAT-09-POLYNOMIALS-03`: 56
  - `MAT-09-POLYNOMIALS-01`: 40
  - `MAT-09-POLYNOMIALS-02`: 3
- scope classification totals: **99 CORE_SYLLABUS / 70 EXTENSION / 3 RELATED**.
- after direct MC15 reconciliation: **169 questions have resolved source-custody comparison; 3 remain explicitly held**.

The three remaining source-readback holds are:

1. m2 Single Correct Q9 — source right edge is not recoverable with confidence from the scan.
2. m2 HOTS Q6 — mathematical result has been independently checked, but the source stem remains partially clipped.
3. m2 HOTS Q7 — source relation/readback remains obscured.

These are not guessed. Downstream Core2 must exclude or visibly hold them until independently resolved from a better source image/copy.

## Printed key versus verified mathematics

Printed source keys are preserved separately from mathematical verification. `answer.verification_status` and `answer.key_relation` govern what is actually checked.

Confirmed source/key findings include:

- HOTS 15: verified result `0`, printed C matches.
- HOTS 16: direct readback `R1 + R2 = 0`; verified `a = -153/65`, printed B matches.
- Long Answer 7: verified `-10y(12x² + 25y²)`; printed key omits the minus sign.
- Archive Corner 22: verified dividend reconstruction gives option A; printed key says B.
- Short Answer 6(i): independent result `77760`; printed key gives `7760`.
- Multiple Correct 21: source conditions do not determine a unique sign; printed positive-only result is not sufficient.
- Multiple Correct 22: options A and B are both printed as `2`, so the option design is defective.

Most other printed keys are preserved but remain `NOT_RUN` for independent mathematical verification. They must not be presented downstream as independently verified truth merely because the source printed them.

## Independent review state

A genuinely independent Reader-B/verifier is **NOT_RUN** in this execution context. The repository's verification contract requires the verifier to be someone other than the researcher/author. Same-agent second readback corrected multiple source defects, but it is not relabeled as independent review.

Prepared blind source-order batches remain available for an independent verifier: 25 + 25 m1 items, then m2 in <=25-item batches, ending with 12 items. This limitation is also carried as a canonical package `known_issue`.

## Syllabus / difficulty-first handoff

Official CBSE/NCERT evidence is in `Mathematics/research/evidence/MAT-09-POLYNOMIALS.cards.json` and `Mathematics/research/syllabus-spine.json`. `DESIGN-NOTE.md` applies #352 only as downstream authoring guidance:

`source denominator/custody → canonical mapping → difficulty/mechanism + interaction-value triage → Hard-first Core2 authoring priority`

Invariant: **authoring priority ≠ source order ≠ learner navigation order**.

## Validation and known limitations

- exact m1/m2 byte identity: PASS.
- Reader-A denominator: PASS — 212/212.
- inventory role regression: PASS.
- committed source inventory schema/card linkage: PASS.
- canonical 172-question package schema + non-strict source-custody validation: PASS.
- source-custody resolved: 169; held: 3.
- independent Reader-B: NOT_RUN.
- independent mathematics across all keyed questions: NOT_RUN; selected hard/conflicting items checked as recorded above.
- browser/Chromium: NOT_APPLICABLE to this source-only responsibility.
- m2 hashed OCR scan manifest exists. A matching m1 hashed OCR manifest was not completed in this execution; m1 is nevertheless pinned by exact acquisition bytes/digest and direct page-image evidence. This remains a tooling/evidence-hardening follow-up, not permission to guess source text.
- unrelated repository guardrails may remain red; they are not relabeled as source-package validation.

## Consumer / next product

The downstream supplied-bank route is **Core2 first**. Core2 may consume the CANDIDATE package while honoring its known issues: source-held items stay held, printed-key-only answers remain unverified, and independent Reader-B remains outstanding. Core1/Core1A/Core1B/Core2A/Core2B are separate downstream authoring responsibilities.
