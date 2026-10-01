# PR #376 — Independent Chemistry Review Handoff

This is a **review handoff**, not an independent review and not an Owner acceptance record.

## Exact review basis

- PR: #376
- Audit / conversion basis head: `35bc0d0f78ccd971028b646c96bf38c97e160616`
- Standalone lineage basis: `ad3c58a50ccc76c65ad26d1fff963b1173027108`
- Authority main head: `00ca6dc70c727e25de7e85becc49cda2ea293f47`
- Engineering-delivery Common basis: `14d79b8f67bdf312f5ae9e4d05de8222c28fcb3e`
- Two-Pass revision: `TPG-2P-2026-09-28-R3`
- Governed review workflow: `36873849274`
- Exact review artifact: `chemistry-governed-core1a-review` / artifact `11168167961` / `sha256:54059c0a3637afff364668471294d7456f2a30c9d499865d79fc70ebd839b4c3`
- Integration preview artifact: `11168102792` / `sha256:1a7089cd50eea4e9efa999ebddc4bac8ae0cd9642b7355199b46ddbbeec23731`
- Browser evidence artifact: `11168398068` / `sha256:d5c4dcbd5638cadf9390a939a4c039e29b3e9dea715c36fa2e748267d65edea2`

The governed renderer produced all four Core1A review candidates in `SINGLE_FILE` mode with `draft=false` and `gaps=[]`.

## Products to review independently

| Promotion ID | Governed product | Package blob | Manifest blob | Render digest | Semantic digest | Exact HTML SHA-256 |
|---|---|---|---|---|---|---|
| PR376-C1A-CHEM-GASES | `behaviour-of-gases` | `fe498bcf11c6aa116bd18a5f50e7119fcf86eafb` | `ad28f378a6a8fe06fb7fbe48852cd16184d65aab` | `b1b5ca199632711f` | `9b742da7cfea576f` | `d3f8ca577e5def5a7f62c7a4f87766eab8bd4484c0d20af269770c1672750602` |
| PR376-C1A-CHEM-BONDING | `chemical-bonding` | `20e0fc6e14423092448ff4a4a777e32ac5d284ac` | `af73faa567fdb145b02268e593bdab23e06efa81` | `da7454dfd5439f6e` | `4276eda90909714e` | `20c740d83aced11a458a68100aedca21e3e049999da7ee52eb541589d4cb10d6` |
| PR376-C1A-CHEM-REDOX | `redox-reactions` | `265749d6fd15239d59d3173c37091e951ecbc32b` | `0d87890f60a768f1bb28c7fc2dd1554d800c9326` | `2d3bc4ba8c63f322` | `771f5f383daa8ca6` | `38927d078871bfc0f02ed5319188e770677bbd0d9c8a23c6aa90f028e7c5cf05` |
| PR376-C1A-CHEM-MOLE | `some-basic-concepts` | `5332a4ebe22dd0a43f377751f54b21c734de7c05` | `ca79a443081a61a94b37f42cac29b3471e00910f` | `9d808bfb3a17049e` | `312bfca9aa38f836` | `6ae51c7f77240d025a4d4c3662222ea17e0f8129648b3b0702517a273b24b509` |

All four packages are explicit `OWNER_EXTENSION` mappings. Every included question is `AUTHORED`; no NCERT, ExamSIDE, JEE or PYQ identity from the original standalone banks is imported into these governed products. Each microtopic has a Core1A-bound governed representation and matched Core1A/Core1B study routing.

## Reviewer instructions

Use a session that authored none of the candidate records. Follow `docs/method/roles/REVIEWER.md` and emit one schema-valid `product-review/v2` per exact render using `Shared/quality/product-review.schema.json`.

Review the exact artifact bytes above, not a reconstructed approximation. In particular, inspect the scientific/model claims, the picture↔word↔symbol representation bridges, worked anchors, misconceptions/repairs, Core1A construction quality, responsive/browser behaviour where relevant, and whether the declared Owner-extension scope is honest.

The reviewer recommendation is evidence only. It does not accept or reject the product.

## Not in this independent-review batch

The three Core2 standalone products are **not ready for governed exact-digest review**:

- PR376-C2-CHEM-BONDING — source custody/denominator unresolved; trusted solution reconstruction incomplete.
- PR376-C2-CHEM-REDOX — source custody/denominator unresolved; trusted solution reconstruction incomplete.
- PR376-C2-CHEM-MOLE — source custody/denominator unresolved; trusted solution reconstruction incomplete.

They retain their standalone audit evidence but have no governed render eligible for this reviewer batch.

## Next stage after independent review

After the four exact-digest reviews exist, the Owner may choose `ACCEPTED`, `DEFERRED`, or `REJECTED` for each reviewed Core1A product. Only explicitly accepted products proceed through `Shared/tools/accept_product.py`, using the exact reviewed digest. No Owner disposition is recorded by this handoff.
