# TASK_EVIDENCE — recovery of issue #354 after reverted PR #356

Code basis: `fe768a370f00067f144eb9598f48ca82000e8bd4`. Base: `e1bfe7a0e45c9a59cde33459d1d6f6bc8febe390`. The original merge and Owner revert are preserved. No CI workflow is restored. This is a new recovery slice, not a claim that the reverted PR was complete.

## What changed

The existing resolver and EXPLORE builder now discover and deliver governed LOCAL interactions. Academic and consumer digests are checked separately. Subject-owned modules register with the existing portable host, with exact code digests; Shared contains no linear-equation implementation. Stable activity identity survives model/code revisions while immutable package revisions change. Invalid/stale discovery sources do not hide valid ones. The author prompt links the reusable workflow.

The recovered witness uses arbitrary coordinate input, dragging, keyboard movement, residual feedback, collected points/table, and a line after three distinct accepted pairs. It replaces the original predefined-card approximation. The concept and question reuse one module with different equation parameters: concept `3x + 4y = 12`; question `x + 2y = 4`. The question's canonical digest is explicitly pinned. Actual browser review caught the earlier incorrect equation reuse; it was fixed and a regression assertion added before this evidence was recorded.

## Actual artifacts and lineage

- [Concept HTML](artifacts/concept.html), [question HTML](artifacts/question.html).
- [Upgraded concept](artifacts/upgrade-concept.html), [upgraded question](artifacts/upgrade-question.html).
- [Exact HTML hashes, module digest, models, consumer receipts and old/new package IDs](artifacts/upgrade-evidence.json).
- [Reconstructable discovery index](artifacts/discovery.json).
- Screenshots and accessibility snapshots sit beside each HTML for 1440×900 landscape and 900×1440 portrait.

Upgrade experiment: change the source model's maximum from 6 to 8 in memory, without changing canonical content. Both consumers obtain new package revisions and retain stable activity identity and shared module bytes; the question retains its own coefficients. These are experimental previews, not accepted products or newly authored library records.

## Validation

- Full local discovery: **FAIL — 1,553 tests, 27 failures, 17 errors, 4 skips, 415.213 seconds**. [Full tracebacks](full-suite.log).
- [Failure-ID comparison](failure-comparison.json): no new failures against the recorded original #353 baseline; one existing portable generated-output failure resolved. Remaining failures concern corpus custody, registry/depiction and nested-ID inconsistencies, publication/runtime drift, subject coverage and manifest drift. They are not all dependency failures.
- Focused discovery/delivery/reuse/Pages tests: **PASS — 22 tests**, including actual Chromium execution. [Log](focused.log).
- Four generated HTMLs at both viewport profiles, offline Chromium: **PASS** for actual mounting, equation-specific arbitrary accepted/rejected pairs, live residual, keyboard/pointer movement, no page errors, no horizontal overflow, and measured 48px shell controls. Reproduce with `RECORD_INTERACTION_EVIDENCE=1 node tests/interaction_delivery_browser.mjs` followed by the four HTML paths.
- Screenshots inspected for current concept portrait and question landscape. This is functional tablet evidence, not a claim of fidelity to an unavailable Owner attachment. The inherited sticky navigation and standalone relative navigation destinations need a separate shell follow-up.
- Physical touch-device and screen-reader testing: **NOT_RUN**. Directory-mode browser evidence: **NOT_RUN**. PDF: **NOT_APPLICABLE** to this EXPLORE recovery; Core2 learner/key evidence is in #353.
- Cross-subject actual reuse: **NOT_RUN**. Same-subject sequential reuse: **PASS**. Shared extraction: **NOT_APPLICABLE / NO_EXTRACTION_NEEDED**; no SHARED maturity claim.
- GitHub Actions, merge and Owner acceptance: **NOT_RUN**.

## Issue #322 SBC-1 through SBC-9

- SBC-1 — Learner: investigate arbitrary pairs and see why a pair fails, rather than select from fixed cards.
- SBC-2 — No new gate: research and prototypes remain available; stale bindings cannot claim current canonical delivery. Owner-authorized local packet checks belong to #353; no CI or publication authority is added here.
- SBC-3 — Thinking, not filling: actual browser and academic readback exposed a plausible but wrong equation. Separate model bindings correct it while retaining reuse.
- SBC-4 — One of everything: extend existing resolver, EXPLORE builder and portable host; discovery is derived. No second Core renderer or canonical package.
- SBC-5 — Construction over policing: digest-bound modules and consumer coefficients deliver the right model by construction; stable activity identity and immutable revisions preserve upgrades.
- SBC-6 — Coherence: schemas, subject sources, resolver, builder, documentation and tests agree. Generated portable/Pages mirrors were refreshed after the host change.
- SBC-7 — Honest state: full suite FAIL; scoped real Chromium PASS; other test modes and Owner acceptance explicitly NOT_RUN. No golden claim.
- SBC-8 — Convergence and cost: reviewable recovery from reverted main, with final full run 415.213 seconds. Monetary/token cost unavailable. General shell issues remain separate.
- SBC-9 — Reusable by others: INTERACTION-DELIVERY guide, author prompt, queryable discovery and exact receipts let another agent reuse or revise this without chat history.

## Issue #354 specific step-back

SBC-1 learner value is arbitrary-pair reasoning. SBC-2 adds no research/CI permission gate. SBC-3 subject modules permit investigation beyond known shared capabilities. SBC-4 reuse follows two actual consumers, without forced cross-subject extraction. SBC-5 lesson behavior remains in Mathematics. SBC-6 existing delivery owners are extended. SBC-7 canonical academic records are unchanged and consumer digests are pinned. SBC-8 discovery, guide and receipts support sequential recovery. SBC-9 the recovered abstraction demonstrably delivers and upgrades two real pages; no speculative shared capability is claimed.

## Task Snapshot

#354: targeted recovery implemented and verified as scoped above; draft review pending. #356 remains reverted. #353 separately supplies Core2 support and local numeric/structural packet checks. Programme #283 receives a linked Handover update. No product publication or merge is claimed.
