# Semantic workbench core

This directory holds the first falsifiable browser-runtime slice for issue #162.
It is deliberately smaller than the original issue proposal.

## Boundary

Core owns only generic browser mechanics:

- persistent semantic entity identity with multiple projections;
- named logical grid placement with no authored pixel coordinates;
- one input-neutral inspect / pick / preview / drop / cancel / undo state machine;
- atomic adapter-approved patches and provenance for derived entities;
- pedagogy injections stored separately from canonical transformations;
- a standards-based `<semantic-workbench>` custom element with Shadow DOM isolation;
- serializable semantic events that do not interpret learner evidence.

Core does **not** own academic validity, learner routing, question selection, canonical
package authoring, or the compiler/portable-package/external-host proof. A subject or
host adapter supplies `evaluateTransfer(request, snapshot)` and returns either a
rejection or an atomic data patch. The scene consumed here is a runtime projection,
not a second canonical authoring database.

## Why no Lit/TypeScript/Vite in this slice

The repository has no JavaScript package/build system today. Adding one would test a
toolchain decision at the same time as the semantic boundary. The first slice therefore
uses browser-standard ES modules and Custom Elements. Lit, TypeScript, bundling,
standalone generation, and external-host certification remain deferred until this
runtime contract survives its falsifiers; integration and packaging belong to #163.

## Current public surface

`runtime.mjs` exports `WorkbenchRuntime`, `validateScene`, and `resolvePlacement`.
`semantic-workbench.mjs` registers `<semantic-workbench>` and accepts three properties:

- `scene`: validated runtime scene data;
- `adapter`: object implementing `evaluateTransfer(request, snapshot)`;
- `injections`: optional checkpoint/hint records kept outside canonical transformations.

The element emits one composed `semantic-workbench-event`. Its `detail.type` names the
semantic event (`ENTITY_PICKED`, `TRANSFER_PREVIEW`, `TRANSFER_ACCEPTED`,
`TRANSFER_REJECTED`, `INTERACTION_CANCELLED`, `UNDO_APPLIED`, or `WORKBENCH_READY`).
No event claims mastery or learner state.

## Deliberate first-slice limits

The slice proves named row/column placement, not the full proposed AUTO/REGION/RELATIVE
layout language. It proves one generic operation string passed to an adapter, not a
Core-owned MOVE/COPY/DERIVE/REFERENCE taxonomy. It implements undo but not redo. It
uses escaped text projections and target controls; richer SVG/MathML renderers are
future renderer plugins after the semantic contract is stable.

The test fixture exercises one real long-division step only. It is a test witness, not
canonical curriculum content and not a cross-subject portability claim.
