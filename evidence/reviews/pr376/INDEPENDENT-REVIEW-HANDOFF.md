# PR #376 — Independent Chemistry Review Handoff

This file now records the completed independent-review handoff. It is **not** an Owner acceptance record.

## Exact publication-review basis

- PR: #376
- Governed academic/conversion basis: `35bc0d0f78ccd971028b646c96bf38c97e160616`
- Standalone lineage basis: `ad3c58a50ccc76c65ad26d1fff963b1173027108`
- Package/manifest blobs from that basis remained byte-identical when the independent review began.
- Review-infrastructure head that emitted the publication-mode artifact: `ae521a57f4cc859eb4df9586abfdbcfe088d14ef`
- Governed review workflow: `36882101979`
- **Publication-mode review artifact:** `chemistry-governed-core1a-pages-review` / artifact `11170849606` / `sha256:e5419ff9a4ef3800d44b8273c2e578f834b1940fdb356f494056a0b33cf3ff26`
- Semantic cross-mode companion: `chemistry-governed-core1a-review` / artifact `11171004553` / `sha256:ec46bd7ebbe5db6092a8dbf9d0bfe06ac1e3e5d01ebc22d83cb6fd5b06f2f17b`
- Integration preview artifact: `11170649845` / `sha256:d16050b7a496bc320f70c9294c1c620574aa9d1ab5f9a089f1c21d02111b41ea`
- Independent PAGES browser replay: `evidence/reviews/pr376/INDEPENDENT-PAGES-BROWSER-EVIDENCE.json`

The earlier handoff used a `SINGLE_FILE` artifact. That is useful for semantic/cross-mode comparison, but `render_core.py` intentionally gives each packaging mode a different artifact digest and `accept_product.py` accepts a staged `PAGES` render. Therefore the authoritative `product-review/v2` files below bind to the exact **PAGES** render digests.

## Completed independent reviews

| Promotion ID | Product | PAGES render digest | Semantic digest | Review | Recommendation |
|---|---|---:|---:|---|---|
| PR376-C1A-CHEM-GASES | `behaviour-of-gases` | `295758088e987780` | `9b742da7cfea576f` | `products/verification/behaviour-of-gases.review.json` | revise |
| PR376-C1A-CHEM-BONDING | `chemical-bonding` | `cf79dd5d6ce99054` | `4276eda90909714e` | `products/verification/chemical-bonding.review.json` | revise |
| PR376-C1A-CHEM-REDOX | `redox-reactions` | `8bd4a9a9de08d933` | `771f5f383daa8ca6` | `products/verification/redox-reactions.review.json` | revise |
| PR376-C1A-CHEM-MOLE | `some-basic-concepts` | `0f7837c2399fb8f7` | `312bfca9aa38f836` | `products/verification/some-basic-concepts.review.json` | revise |

Reviewer session: `pr376-independent-pages-review-2026-10-01`.

The reviewer session authored none of the Chemistry package/product records. It added review evidence and one workflow-only change needed to expose the exact publication-mode bytes.

## Independent review summary

### Shared learner-surface issue

All four pages render repository workflow/custody language to learners, for example the PR number and unresolved source/dedup/authority state under **Learning promise** / **Outside this book**. Keep those facts in LPAP/review evidence and render plain educational scope instead.

### Behaviour of Gases

The law/model boundaries are strong, particularly constraints-before-law selection and the distinction between real-gas state models and microscopic mechanisms.

Open review issue: the particle/phase microtopic promises a molecular-speed distribution and surface-vs-bulk phase distinction, but its governed representation is only a symbolic `T ↑ ⇒ mean Eₖ ↑` card. Core1A needs a real picture↔word↔symbol bridge for that inference.

### Chemical Bonding

The product correctly separates formal charge from physical charge, electron-domain geometry from molecular shape, and bond order from magnetic pairing. It also appropriately cautions against treating `sp3d` shorthand as literal orbital evidence.

Open review issues:

- trigonal-bipyramidal `PCl5` is presented without an explicit gas-phase/isolated-molecule boundary; solid PCl5 is outside that molecular model;
- Lewis/VSEPR and MO procedural claims need concrete species-level worked constructions;
- the PCl5 figure's model-limit sentence measures 12.5px in the publication replay, below the repository's 13px tablet learner-text floor.

### Redox Reactions

The oxidation-number and agent-role bookkeeping is conceptually strong.

Open review issues: the hard half-reaction/n-factor unit never executes the balancing algorithm on a concrete reaction, and its representation is only the conservation slogan rather than a half-reaction/charge/electron ledger.

### Some Basic Concepts / Mole / Stoichiometry

Entity naming and denominator-first concentration reasoning are strong.

Open review issues: the hard empirical-formula/limiting-reagent unit never performs the numerical mass→moles→ratio / inventory→reaction-extent construction, and its representation repeats the ratio formula rather than showing the inventory/stoichiometric bridge.

## Publication-mode browser replay

The exact PAGES `core1a.html` bytes were replayed in isolated Chromium with the exact generated tablet CSS from the same workflow preview.

For all four products at 1280×800, 800×1280 and 390×844:

- page-level horizontal overflow: 0;
- controls below 48px: 0;
- console/page errors: 0;
- blank attempt does not unlock the model answer;
- valid attempt does unlock and materialize the protected answer;
- keyboard Tab navigation shows the 3px focus-visible outline.

See `evidence/reviews/pr376/INDEPENDENT-PAGES-BROWSER-EVIDENCE.json` for the digest-bound measurements.

## Still outside this review batch

The three Core2 standalone candidates remain held:

- PR376-C2-CHEM-BONDING — exact source custody/denominator and trustworthy solution reconstruction unresolved;
- PR376-C2-CHEM-REDOX — same;
- PR376-C2-CHEM-MOLE — same.

They have no governed render eligible for independent exact-digest review.

## Owner stage

Independent review now exists for all four governed Core1A **PAGES** renders.

The reviews currently recommend **revision** and contain open S2/S3 findings. The recommendation is evidence, not publication authority: the Owner may still choose `ACCEPTED`, `DEFERRED` or `REJECTED` for each exact reviewed digest under the repository method.

No Owner disposition, `accept_product.py` acceptance, merge or publication is recorded here.
