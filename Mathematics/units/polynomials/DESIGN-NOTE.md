# Design note — polynomials

This note is the authoring/reasoning surface for the Polynomials source corpus established by #350. It follows the difficulty-first semantics of #352 **after** source custody and denominator truth. It is not a source ledger, learner metadata authority, search authority, or replacement for #329.

## 1. The idea

The unit has several distinct inferential jumps that should not be collapsed into “do algebra”:

- recognise the structure of a one-variable polynomial (terms, coefficients, degree and admissible form);
- evaluate a polynomial while preserving the distinction between expression, value, zero and remainder;
- use the remainder/factor/division relationship structurally rather than as a memorised substitution trick;
- choose and preserve an algebraic identity when expressions are transformed, especially through signs and symmetric forms;
- distinguish a mathematically valid consequence from an answer-key claim or an under-specified source question.

The #350 specimen is anchored by `INV-MAT-09-POLYNOMIALS-M1P33-50-M2P1-11` with 212 source items: 172 questions and 40 worked examples. Source order stays intact. Difficulty-first affects authoring/review priority only.

## 2. Basic syllabus mapping policy

Use the existing syllabus spine; do not create another topic taxonomy.

| Mapping class | Canonical node | Use in this corpus |
|---|---|---|
| `CORE_SYLLABUS` | `MAT-09-POLYNOMIALS-01` | algebraic expressions / one-variable polynomial recognition, terms, coefficients, degree |
| `CORE_SYLLABUS` | `MAT-09-POLYNOMIALS-02` | evaluation and linear-polynomial relationships where that is the decisive demand |
| `CORE_SYLLABUS` | `MAT-09-POLYNOMIALS-03` | remainder theorem, factor theorem, polynomial division, divisor–quotient–remainder reconstruction |
| `RELATED` | `MAT-09-ALGEBRAIC-IDENTITIES-01` | algebraic identities, factorisation using identities, identity-led simplification |
| `EXTENSION` | closest node above + explicit extension note | source demand materially exceeds the current Grade-9 spine (competition-style symmetric/rational constructions, unstated complex-domain reasoning, etc.) |
| `UNRESOLVED` | no forced microtopic | source text/domain or decisive demand is not trustworthy enough to map confidently |

A question can use several algebraic moves; mapping follows the **decisive learning demand**, not every incidental operation. The candidate package now contains item-level mapping for all 172 QUESTION records; the 40 WORKED_EXAMPLE items remain source inventory/evidence rather than being miscast as assessment questions. Independent review may still require corrections, so package mappings remain candidate records rather than immutable source truth.

## 3. Difficulty-first triage contract for this unit

Canonical concept difficulty and canonical question `D1–D4` are **not invented here**. Where #329-backed metadata is absent, the fields stay `UNSET`. Learning Priority Lots are scheduling labels only.

| Inventory ref | Basic mapping | Canonical difficulty | Teaching-difficulty explanation | Prerequisite / wrong route | Teaching crux | Interaction value | Purpose if interactive | Proposed lot |
|---|---|---|---|---|---|---|---|---|
| `INV-MAT-09-POLYNOMIALS-M1P33-50-M2P1-11#M2-P06-HIGHER-ORDER-THINKING-SKILLS-HOTS-16` | `CORE_SYLLABUS` → `MAT-09-POLYNOMIALS-03` | concept: `UNSET`; question: `UNSET` | Two separate remainder evaluations must be connected by the source condition `R1 + R2 = 0`; the hard step is modelling the relationship, not substitution itself. | Know remainder theorem; wrong route: evaluate only one polynomial or equate each remainder separately to zero. | Treat each remainder as a named quantity, then apply the stated relation once both are visible. | `HIGH` | Let the learner vary `a`, see both remainders update, then commit to the relation that must be satisfied before the algebraic solve is revealed. | `LP-H3` |
| `INV-MAT-09-POLYNOMIALS-M1P33-50-M2P1-11#M2-P09-ARCHIVE-CORNER-22` | `CORE_SYLLABUS` → `MAT-09-POLYNOMIALS-03` | concept: `UNSET`; question: `UNSET` | Learner must reverse the division algorithm: divisor × quotient + remainder → dividend. The printed key is also wrong, so source/key authority must stay separate. | Know division algorithm; wrong route: choose the printed key or add the remainder before multiplying. | Reconstruct the dividend structurally and only then compare with options. | `HIGH` | A compact “rebuild the dividend” representation can expose the invariant `dividend = divisor × quotient + remainder` without leaking the final option before commitment. | `LP-H3` |
| `INV-MAT-09-POLYNOMIALS-M1P33-50-M2P1-11#M2-P03-ASSESSMENT-CORNER-MULTIPLE-CORRECT-TYPE-QUESTIONS-21` | `RELATED` → `MAT-09-ALGEBRAIC-IDENTITIES-01` | concept: `UNSET`; question: `UNSET` | From `x-y=5, xy=24`, `(x+y)^2` is fixed but the sign of `x+y` is not. Collapsing `sqrt(121)` to `11` makes the source look single-valued; mathematically the target can be `±539`. | Difference/sum identities; wrong route: take only the positive square root. | Preserve both branches until the requested symmetric expression is evaluated. | `HIGH` | A two-branch view showing both admissible `(x,y)` pairs makes the underdetermination visible and teaches why squaring can lose sign information. | `LP-H4` |
| `INV-MAT-09-POLYNOMIALS-M1P33-50-M2P1-11#M2-P07-FREE-RESPONSE-TYPE-LONG-ANSWER-TYPE-QUESTIONS-7` | `RELATED` → `MAT-09-ALGEBRAIC-IDENTITIES-01` | concept: `UNSET`; question: `UNSET` | Difference of two cubes with mirrored signs is trap-sensitive; the source key drops the overall minus sign. | Cubic identities / expansion; wrong route: treat the subtraction as if both expansions had the same sign. | Factor or expand while preserving the outer subtraction; perform a sign sanity-check with a simple substitution. | `MEDIUM` | Side-by-side expansion could help, but a static worked decomposition may be sufficient. Do not build interaction unless it demonstrably beats the static explanation. | `LP-H4` |
| `INV-MAT-09-POLYNOMIALS-M1P33-50-M2P1-11#M2-P06-HIGHER-ORDER-THINKING-SKILLS-HOTS-15` | `EXTENSION` / domain-sensitive, closest related node `MAT-09-ALGEBRAIC-IDENTITIES-01` | concept: `UNSET`; question: `UNSET` | The algebraic implication from `x/y + y/x = -1` leads to `x²+xy+y²=0`. The algebraic consequence for `x³-y³` is 0, while over the usual real Grade-9 domain the stated relation has no nonzero real solutions; the source does not state a domain. | Rational manipulation; wrong route: silently treat the source as a standard real-domain item without noticing the existence issue. | Keep the algebraic consequence and the source-domain limitation visible as separate facts. | `MEDIUM` | A domain/boundary comparison could be useful later, but it is not required for this source-producer PR. | `LP-H4` |

### Source-defect items that are **not** promoted to Hard learning targets

- Multiple Correct 22 has duplicate source options `(A) 2` and `(B) 2`. This is a source-design defect; the underlying mathematics is simple. Do not confuse source-risk priority with learner difficulty or interaction value.
- Short Answer 6(i) has a printed-key arithmetic typo (`7760` versus independently derived `77760`). Preserve the source key separately; this alone does not justify an interactive page.

## 4. Wrong routes

Current high-value wrong routes / failure modes:

1. **Printed-key substitution for mathematical verification.** A source key is custody evidence, not proof of correctness.
2. **Remainder = zero by reflex.** Factor-theorem familiarity can cause learners to set a remainder to zero even when the task states another relation.
3. **Lost sign branch after squaring.** `s² = 121` does not justify `s = 11` only.
4. **Outer-sign loss in identity expansion.** Mirrored binomials can visually hide the subtraction acting on the entire second cube.
5. **Division algorithm run in the wrong direction.** When divisor, quotient and remainder are given, long division is unnecessary; reconstruction is direct.
6. **Domain assumptions left implicit.** Competition-style algebra can use relations with no real solution; a Grade-9 learner page must not silently import a complex-number domain.

## 5. Representations / interactive admission

Current provisional interactive targets are deliberately fewer than “every Hard item”:

1. **Dual-remainder constraint (HOTS 16)** — `HIGH`: two live remainder expressions and one explicit relation; learner predicts which equation to impose.
2. **Reverse division algorithm (Archive 22)** — `HIGH`: compose divisor × quotient + remainder and compare only after commitment.
3. **Lost-sign branch (MC 21)** — `HIGH`: show the two admissible branches created by `s²=121`; make underdetermination visible.

Long Answer 7 is `MEDIUM` interaction value; prefer a strong static decomposition unless an interaction proves additional learning value. HOTS 15 remains domain-sensitive and should carry that caveat into downstream authoring.

These are authoring judgements only. They are not learner-facing badges, search metadata, or publication requirements.

## 6. Task arc

| Core | Item | Decision practiced | New versus earlier | Canonical records / source basis | Actual or planned prior exposure | Current PR state / useful downstream note |
|---|---|---|---|---|---|---|
| Core2 | HOTS 16 | translate two evaluated remainders into the stated relation | multi-stage remainder modelling | committed inventory + question/key cards + candidate ORIGINAL package record | theorem/evaluation examples from m1 | source readback reconciled in this PR; independent Reader-B remains `NOT_RUN` |
| Core2 | Archive 22 | reverse `dividend = divisor × quotient + remainder` | reconstruction rather than forward division | committed inventory + candidate ORIGINAL package record | division/remainder examples | printed B is preserved separately from checked A |
| Core2 | MC 21 | preserve both sign branches before evaluating a symmetric expression | exception/underdetermination sensitivity | committed inventory + candidate ORIGINAL package record | identity/symmetric-expression work | source transcription reconciled; package records the source defect explicitly |
| Core2 | Long Answer 7 | preserve outer subtraction through cubic identity work | sign-sensitive identity transformation | committed inventory + candidate ORIGINAL package record | identity examples | checked sign conflict is retained; static-first explanation remains preferred |

First-stage route remains Core2 because a usable source-question corpus exists. This note does not authorize learner artifact publication.

## 7. Transfer plan

Invariant: preserve source demand and mathematical structure while changing representation/support, never source identity. Later Core2A/Core2B work may reuse the same invariants (remainder relation, division reconstruction, sign/branch preservation) only through the governed lineage model; this source responsibility does not implement those later Cores.

## 8. Research / evidence log

- Exact source corpus: `INV-MAT-09-POLYNOMIALS-M1P33-50-M2P1-11`, committed at 212/212 items.
- Candidate package: `Mathematics/library/polynomials.v1.json`, containing 172 `origin=ORIGINAL` question records with typed source custody.
- Syllabus basis: `MAT-09-POLYNOMIALS-01`, `-02`, `-03`, and related `MAT-09-ALGEBRAIC-IDENTITIES-01`, backed by the existing CBSE/NCERT evidence cards.
- Full candidate question mapping totals: 73 Algebraic Identities, 56 remainder/factor/division, 40 polynomial structure/degree, 3 evaluation/linear relations; scope totals 99 `CORE_SYLLABUS`, 70 `EXTENSION`, 3 `RELATED`.
- Direct mathematics/source checks captured in the package include HOTS 15/16, Long Answer 7, Archive 22, MC 21/22 and Short Answer 6(i).
- Direct source-risk corrections for MC 18–24 and HOTS 15/16 have been reconciled into committed evidence cards and regenerated package output.
- Difficulty-first semantics remain scheduling/interaction guidance only; they do not replace source custody or canonical difficulty metadata.

## 9. Known weaknesses / next work

- Blind Reader-B remains `NOT_RUN`; no same-agent check is relabelled as independent evidence.
- Three question records remain explicitly source-custody-held rather than guessed: m2 Single Correct Q9, HOTS Q6 and HOTS Q7.
- Most printed keys remain `NOT_RUN` for independent mathematical derivation; checked/conflicting items are explicit and source keys remain separate.
- Candidate per-question mapping is committed for all 172 QUESTION records. The 40 WORKED_EXAMPLE items remain inventory/evidence and therefore do not require fabricated assessment-question mappings.
- Canonical question difficulty (`D1–D4`) and concept difficulty remain unset where #329-backed metadata is absent.
- The `ORIGINAL` package projection and typed source-custody proofs are committed in this PR; downstream publication must still honor CANDIDATE/DISPUTED/held states rather than silently promoting them.
