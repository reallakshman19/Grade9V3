# PR #376 - LPAP Owner Promotion Packet

- Initial audit_basis_head: `896bf786c9615d45b3b6639d44e52dc252b96a08`
- Final candidate/integration basis head: `ad3c58a50ccc76c65ad26d1fff963b1173027108`
- Authority main head: `00ca6dc70c727e25de7e85becc49cda2ea293f47`
- Authority basis digest: `sha256:8ac72c0fafbd7576efacec20138b1fed4f7c1cfb933bec4fee776ef6b49cef1e`
- Search/build basis: `sha256:ae5e7da1d354cd9c4befe27a791290c5e6f584e170a29f648c9f76736fd1cb40`
- Browser evidence: workflow `36844760999`, artifact `sha256:85b031aa12313227a9d9560b4ef5a0132569e07c97a9e54a6e1e6a9bc188d890`
- Publication state: **AUDIT_COMPLETE; no candidate is described as PUBLISHABLE_UNDER_LPAP.**
- Independent review status: **NOT_RUN_IN_THIS_SESSION.** This session authored candidate repairs, so it cannot truthfully claim the independent `product-review/v2` role defined by `docs/method/roles/REVIEWER.md`. The same-session draft review records were removed; the matrices below remain LPAP audit evidence.

## Promotion-set inventory

- **PR376-C1A-CHEM-GASES** - `standalone/core1a-chemistry-behaviour-of-gases-tablet.html` - CORE1A
- **PR376-C1A-CHEM-BONDING** - `standalone/core1a-chemistry-chemical-bonding-tablet.html` - CORE1A
- **PR376-C1A-CHEM-REDOX** - `standalone/core1a-chemistry-redox-reactions-tablet.html` - CORE1A
- **PR376-C1A-CHEM-MOLE** - `standalone/core1a-chemistry-some-basic-concepts-tablet.html` - CORE1A
- **PR376-C2-CHEM-BONDING** - `standalone/core2-chemistry-chemical-bonding-tablet.html` - CORE2
- **PR376-C2-CHEM-REDOX** - `standalone/core2-chemistry-redox-reactions-tablet.html` - CORE2
- **PR376-C2-CHEM-MOLE** - `standalone/core2-chemistry-some-basic-concepts-tablet.html` - CORE2

## Findings and corrections

The audit corrected scientific/model overclaims, invalid calculator states, shifted/merged Core2 answer extraction, source-custody presentation, mobile overflow, zoom/reduced-motion behavior, and audit coverage. Unsafe source-linked Core2 solutions are withheld rather than presented as trusted answers.

The remaining unresolved facts are authority/source/lineage facts: Chemistry requires exact registry binding for governed curriculum products; the same-topic master suites are currently UNBOUND_EXTENSION/JEE_EXTENSION; exact NCERT/ExamSIDE/JEE custody is not established for these candidate sets; and generic standalone bundles do not have a governed acceptance adapter.

No new `public/`, navigation, Question Bank, resource, or search identity was created merely because the standalone files render. The existing generated Question Bank legacy projection, Question Bank platform projection, Pages mirror, and architecture manifest all pass on the final candidate/integration basis.

## Review independence

The current session performed both candidate repairs and LPAP auditing. Because `docs/method/roles/REVIEWER.md` requires an independent reviewer session that authored none of the unit records, this packet does **not** claim an authoritative independent `product-review/v2`. Any independent review used for Owner evidence should be produced by a separate reviewer session against the exact candidate digests recorded here. No Owner disposition is implied by the absence of that review.

## Core1A <-> Core2 join

| Topic | Core2 demand | Core1A preparation | Classification |
|---|---|---|---|
| Chemical Bonding | valency/octet/electronic configuration | Lewis/octet/formal-charge construction | PARTIALLY_PREPARED |
| Chemical Bonding | ions/formula units/formula writing | advanced page does not build the full foundational formula route first | MISSING_PREPARATION |
| Chemical Bonding | geometry/bonding evidence | VSEPR/dipole/MOT construction | PREPARED |
| Redox | oxidation/reduction tracking and agents | oxidation-number/electron-transfer construction | PREPARED |
| Redox | corrosion/displacement foundation | mainly transfer/application | PARTIALLY_PREPARED |
| Redox | balancing/electron accounting | half-reaction and n-factor/equivalence | PREPARED |
| Mole / Stoichiometry | measurement/matter/formula foundations | not fully constructed before quantitative work | MISSING_PREPARATION |
| Mole / Stoichiometry | mole/particle reasoning | mole bridge and formula derivation | PREPARED |
| Mole / Stoichiometry | concentration/stoichiometry | concentration, limiting reagent and stoichiometry | PREPARED |

These are pedagogical audit observations, not canonical capability mappings; canonical mappings remain unresolved until authority bindings exist.

## Runtime / UX / accessibility

All seven products pass isolated browser evidence at 1280x800, 800x1280 and 390x844. The harness checks normal/invalid/repeated interactive states, tab switching, persistence, focus visibility, reduced motion, zoom overflow, touch targets, text floor, textarea height, external requests, console/page errors and NaN/Infinity. The candidates have no external runtime dependency.

## Per-product matrices

### PR376-C1A-CHEM-GASES

**Audit profile:** Common Audit Kernel; LPAP.CORE1A@1; Equation; Interactive; Source-Custody

**Owner disposition:** _[ ACCEPTED / DEFERRED / REJECTED ]_

| Dimension | Result |
|---|---|
| Identity / dedup | RELATED to GCDR-SUITE-GASEOUS-STATE; HOLD_UNRESOLVED |
| Source / authority | No exact Grade-9/Core1A binding; source custody unresolved |
| Academic correctness | Major instructional claims audited/repaired; source-linked question truth is not promoted beyond available custody |
| Mathematical / chemical correctness | Major equations/models checked with assumptions and limitations made explicit |
| Completeness | Canonical expected denominator UNRESOLVED; candidate card counts are not authority |
| Core-role fidelity | OPEN FINDING - claimed role is not fully authority-bound |
| Hint/scaffold quality | PARTIAL; source-linked scaffolds not custody-verified |
| Solution quality | Local concept anchors reviewed; source-linked answer claims remain separate from provenance |
| SVG/diagram integrity | NOT_APPLICABLE - no semantic SVG/canvas in candidate |
| Interaction/model integrity | PASS in isolated browser harness |
| UX/responsive | PASS at all three required viewport classes |
| Accessibility | PASS current measured harness for target/text/textarea/zoom/focus/reduced-motion checks |
| Cross-Core preparation | N/A: no Core2 gases candidate |
| Navigation | NOT_INTEGRATED - authority unresolved |
| Search/discoverability | NOT_INDEXED by design; generated public/docs search projections current |
| Deployability | Offline single-file runtime passes; governed publication acceptance unresolved |
| Open findings | LPAP.C1A.AUTHORITY.BINDING@1; LPAP.C1A.SOURCE.CUSTODY@1 |
| Exact artifact/render/bundle digest | `sha256:5c1013e66ffa1964e0b58c1452034304f3e06bf40bc3eb252255271a95419454` / `5c1013e66ffa1964` / `sha256:5951fa3c1364fb723fdeb399b6b23bcb2e7815e72a0e44592630d5d8f819fa61` |

Search acceptance evidence: `searchable_intent=false` while held; `generated_search_id=NOT_APPLICABLE`; `actual_destination=NOT_INDEXED`; `duplicate_result_count=0`; Question Bank/global-header visibility `NOT_APPLICABLE`; public/docs projections current `true`.

### PR376-C1A-CHEM-BONDING

**Audit profile:** Common Audit Kernel; LPAP.CORE1A@1; Equation; Interactive; Source-Custody; Cross-Core

**Owner disposition:** _[ ACCEPTED / DEFERRED / REJECTED ]_

| Dimension | Result |
|---|---|
| Identity / dedup | RELATED to GCDR-SUITE-CHEMICAL-BONDING; BOND-Q01 DUPLICATE/REUSE_CANONICAL; BOND-Q02..04 SOURCE_COLLISION; HOLD_UNRESOLVED |
| Source / authority | No exact Core1A binding; JEE/ExamSIDE custody unresolved |
| Academic correctness | Major instructional claims audited/repaired; source-linked question truth is not promoted beyond available custody |
| Mathematical / chemical correctness | Major equations/models checked with assumptions and limitations made explicit |
| Completeness | Canonical expected denominator UNRESOLVED; candidate card counts are not authority |
| Core-role fidelity | OPEN FINDING - claimed role is not fully authority-bound |
| Hint/scaffold quality | PARTIAL; source-linked scaffolds not custody-verified |
| Solution quality | Local concept anchors reviewed; source-linked answer claims remain separate from provenance |
| SVG/diagram integrity | NOT_APPLICABLE - no semantic SVG/canvas in candidate |
| Interaction/model integrity | PASS in isolated browser harness |
| UX/responsive | PASS at all three required viewport classes |
| Accessibility | PASS current measured harness for target/text/textarea/zoom/focus/reduced-motion checks |
| Cross-Core preparation | PARTIAL/MAPPING_UNCERTAIN; formula/ion foundations incomplete |
| Navigation | NOT_INTEGRATED - authority unresolved |
| Search/discoverability | NOT_INDEXED by design; generated public/docs search projections current |
| Deployability | Offline single-file runtime passes; governed publication acceptance unresolved |
| Open findings | LPAP.C1A.AUTHORITY.BINDING@1; LPAP.C2.IDENTITY.SOURCE_COLLISION@1; LPAP.C1A.ROLE.MIXED_BANK@1 |
| Exact artifact/render/bundle digest | `sha256:e48261dcdac2d1f696f2acdb2270ce5bab8370e2273e95d8c057e3ad57a63ade` / `e48261dcdac2d1f6` / `sha256:195e788b201f8edeebe1c4865ba5c8d11e41bd695019984ed5ed7e4785e5a3c8` |

Search acceptance evidence: `searchable_intent=false` while held; `generated_search_id=NOT_APPLICABLE`; `actual_destination=NOT_INDEXED`; `duplicate_result_count=0`; Question Bank/global-header visibility `NOT_APPLICABLE`; public/docs projections current `true`.

### PR376-C1A-CHEM-REDOX

**Audit profile:** Common Audit Kernel; LPAP.CORE1A@1; Equation; Interactive; Source-Custody; Cross-Core

**Owner disposition:** _[ ACCEPTED / DEFERRED / REJECTED ]_

| Dimension | Result |
|---|---|
| Identity / dedup | RELATED to GCDR-SUITE-REDOX; HOLD_UNRESOLVED |
| Source / authority | No exact Core1A binding; 74-position snapshot is benchmark only |
| Academic correctness | Major instructional claims audited/repaired; source-linked question truth is not promoted beyond available custody |
| Mathematical / chemical correctness | Major equations/models checked with assumptions and limitations made explicit |
| Completeness | Canonical expected denominator UNRESOLVED; candidate card counts are not authority |
| Core-role fidelity | OPEN FINDING - claimed role is not fully authority-bound |
| Hint/scaffold quality | PARTIAL; source-linked scaffolds not custody-verified |
| Solution quality | Local concept anchors reviewed; source-linked answer claims remain separate from provenance |
| SVG/diagram integrity | NOT_APPLICABLE - no semantic SVG/canvas in candidate |
| Interaction/model integrity | PASS in isolated browser harness |
| UX/responsive | PASS at all three required viewport classes |
| Accessibility | PASS current measured harness for target/text/textarea/zoom/focus/reduced-motion checks |
| Cross-Core preparation | PREPARED/PARTIALLY_PREPARED provisionally; canonical mapping unresolved |
| Navigation | NOT_INTEGRATED - authority unresolved |
| Search/discoverability | NOT_INDEXED by design; generated public/docs search projections current |
| Deployability | Offline single-file runtime passes; governed publication acceptance unresolved |
| Open findings | LPAP.C1A.AUTHORITY.BINDING@1; LPAP.C1A.SOURCE.CUSTODY@1 |
| Exact artifact/render/bundle digest | `sha256:95fc2a7e49b1ac629b0571e3085018d28f8c40ce5e0ae43c94274e47340f720c` / `95fc2a7e49b1ac62` / `sha256:f49851888c32e0a0a6d81e136f979b44512d14334c59338d8c1a990f3714b1aa` |

Search acceptance evidence: `searchable_intent=false` while held; `generated_search_id=NOT_APPLICABLE`; `actual_destination=NOT_INDEXED`; `duplicate_result_count=0`; Question Bank/global-header visibility `NOT_APPLICABLE`; public/docs projections current `true`.

### PR376-C1A-CHEM-MOLE

**Audit profile:** Common Audit Kernel; LPAP.CORE1A@1; Equation; Interactive; Source-Custody; Cross-Core

**Owner disposition:** _[ ACCEPTED / DEFERRED / REJECTED ]_

| Dimension | Result |
|---|---|
| Identity / dedup | RELATED to GCDR-SUITE-MOLE-CONCEPT; HOLD_UNRESOLVED |
| Source / authority | Class-11 spine exists, but no Grade-9/Core1A acceptance binding; source custody unresolved |
| Academic correctness | Major instructional claims audited/repaired; source-linked question truth is not promoted beyond available custody |
| Mathematical / chemical correctness | Major equations/models checked with assumptions and limitations made explicit |
| Completeness | Canonical expected denominator UNRESOLVED; candidate card counts are not authority |
| Core-role fidelity | OPEN FINDING - claimed role is not fully authority-bound |
| Hint/scaffold quality | PARTIAL; source-linked scaffolds not custody-verified |
| Solution quality | Local concept anchors reviewed; source-linked answer claims remain separate from provenance |
| SVG/diagram integrity | NOT_APPLICABLE - no semantic SVG/canvas in candidate |
| Interaction/model integrity | PASS in isolated browser harness |
| UX/responsive | PASS at all three required viewport classes |
| Accessibility | PASS current measured harness for target/text/textarea/zoom/focus/reduced-motion checks |
| Cross-Core preparation | PARTIAL: mole/concentration/stoich prepared; early foundations incomplete |
| Navigation | NOT_INTEGRATED - authority unresolved |
| Search/discoverability | NOT_INDEXED by design; generated public/docs search projections current |
| Deployability | Offline single-file runtime passes; governed publication acceptance unresolved |
| Open findings | LPAP.C1A.AUTHORITY.BINDING@1; LPAP.C1A.SOURCE.CUSTODY@1 |
| Exact artifact/render/bundle digest | `sha256:cc0bc2d8463ca55c1ce5eb47ddccab77f9ce651ada9e9c8fa2864d6c1629fb34` / `cc0bc2d8463ca55c` / `sha256:593ccef78f1d31fccc7325dfbe7463dc1a7942f980d21196151433c24b642a05` |

Search acceptance evidence: `searchable_intent=false` while held; `generated_search_id=NOT_APPLICABLE`; `actual_destination=NOT_INDEXED`; `duplicate_result_count=0`; Question Bank/global-header visibility `NOT_APPLICABLE`; public/docs projections current `true`.

### PR376-C2-CHEM-BONDING

**Audit profile:** Common Audit Kernel; LPAP.CORE2@1; Question; Equation; Source-Custody; Interactive; Cross-Core

**Owner disposition:** _[ ACCEPTED / DEFERRED / REJECTED ]_

| Dimension | Result |
|---|---|
| Identity / dedup | DISTINCT candidate set; HOLD_UNRESOLVED |
| Source / authority | 38 logical cards; exact NCERT custody/denominator unresolved |
| Academic correctness | Major instructional claims audited/repaired; source-linked question truth is not promoted beyond available custody |
| Mathematical / chemical correctness | Major equations/models checked with assumptions and limitations made explicit |
| Completeness | Canonical expected denominator UNRESOLVED; candidate card counts are not authority |
| Core-role fidelity | OPEN FINDING - claimed role is not fully authority-bound |
| Hint/scaffold quality | UNRESOLVED while trusted source-aligned solutions are held |
| Solution quality | FINDING - unsafe solution stream withheld pending reconstruction |
| SVG/diagram integrity | NOT_APPLICABLE - no semantic SVG/canvas in candidate |
| Interaction/model integrity | PASS in isolated browser harness |
| UX/responsive | PASS at all three required viewport classes |
| Accessibility | PASS current measured harness for target/text/textarea/zoom/focus/reduced-motion checks |
| Cross-Core preparation | PARTIAL/MAPPING_UNCERTAIN |
| Navigation | NOT_INTEGRATED - authority unresolved |
| Search/discoverability | NOT_INDEXED by design; generated public/docs search projections current |
| Deployability | Offline single-file runtime passes; governed publication acceptance unresolved |
| Open findings | LPAP.C2.SOURCE.CUSTODY@1; LPAP.C2.SOLUTION.WITHHELD@1 |
| Exact artifact/render/bundle digest | `sha256:99bb2b78f3e49631c413c44369ac64b82449da8a59e76183d23fc40d375c6951` / `99bb2b78f3e49631` / `sha256:9ebc85bac479e02e1d9f5f5dab7485842b80041a062a19884d681006ac3a1cab` |

Search acceptance evidence: `searchable_intent=false` while held; `generated_search_id=NOT_APPLICABLE`; `actual_destination=NOT_INDEXED`; `duplicate_result_count=0`; Question Bank/global-header visibility `NOT_APPLICABLE`; public/docs projections current `true`.

### PR376-C2-CHEM-REDOX

**Audit profile:** Common Audit Kernel; LPAP.CORE2@1; Question; Equation; Source-Custody; Interactive; Cross-Core

**Owner disposition:** _[ ACCEPTED / DEFERRED / REJECTED ]_

| Dimension | Result |
|---|---|
| Identity / dedup | DISTINCT candidate set; HOLD_UNRESOLVED |
| Source / authority | 11 logical cards; exact NCERT custody/denominator unresolved |
| Academic correctness | Major instructional claims audited/repaired; source-linked question truth is not promoted beyond available custody |
| Mathematical / chemical correctness | Major equations/models checked with assumptions and limitations made explicit |
| Completeness | Canonical expected denominator UNRESOLVED; candidate card counts are not authority |
| Core-role fidelity | OPEN FINDING - claimed role is not fully authority-bound |
| Hint/scaffold quality | UNRESOLVED while trusted source-aligned solutions are held |
| Solution quality | FINDING - unsafe solution stream withheld pending reconstruction |
| SVG/diagram integrity | NOT_APPLICABLE - no semantic SVG/canvas in candidate |
| Interaction/model integrity | PASS in isolated browser harness |
| UX/responsive | PASS at all three required viewport classes |
| Accessibility | PASS current measured harness for target/text/textarea/zoom/focus/reduced-motion checks |
| Cross-Core preparation | PREPARED/PARTIALLY_PREPARED provisionally |
| Navigation | NOT_INTEGRATED - authority unresolved |
| Search/discoverability | NOT_INDEXED by design; generated public/docs search projections current |
| Deployability | Offline single-file runtime passes; governed publication acceptance unresolved |
| Open findings | LPAP.C2.SOURCE.CUSTODY@1; LPAP.C2.SOLUTION.WITHHELD@1 |
| Exact artifact/render/bundle digest | `sha256:15c26937e8877fcbbf3d41627d0a51bbf41aa65d94023ea2aff0a3922c7d7b1e` / `15c26937e8877fcb` / `sha256:27faed1ac5deb8ab83f1f8639c946d6e065539bba797f62630bc23444886f265` |

Search acceptance evidence: `searchable_intent=false` while held; `generated_search_id=NOT_APPLICABLE`; `actual_destination=NOT_INDEXED`; `duplicate_result_count=0`; Question Bank/global-header visibility `NOT_APPLICABLE`; public/docs projections current `true`.

### PR376-C2-CHEM-MOLE

**Audit profile:** Common Audit Kernel; LPAP.CORE2@1; Question; Equation; Source-Custody; Interactive; Cross-Core

**Owner disposition:** _[ ACCEPTED / DEFERRED / REJECTED ]_

| Dimension | Result |
|---|---|
| Identity / dedup | DISTINCT candidate set; HOLD_UNRESOLVED |
| Source / authority | 94 logical cards; exact NCERT custody/denominator unresolved |
| Academic correctness | Major instructional claims audited/repaired; source-linked question truth is not promoted beyond available custody |
| Mathematical / chemical correctness | Major equations/models checked with assumptions and limitations made explicit |
| Completeness | Canonical expected denominator UNRESOLVED; candidate card counts are not authority |
| Core-role fidelity | OPEN FINDING - claimed role is not fully authority-bound |
| Hint/scaffold quality | UNRESOLVED while trusted source-aligned solutions are held |
| Solution quality | FINDING - unsafe solution stream withheld pending reconstruction |
| SVG/diagram integrity | NOT_APPLICABLE - no semantic SVG/canvas in candidate |
| Interaction/model integrity | PASS in isolated browser harness |
| UX/responsive | PASS at all three required viewport classes |
| Accessibility | PASS current measured harness for target/text/textarea/zoom/focus/reduced-motion checks |
| Cross-Core preparation | PARTIAL: quantitative route prepared; early measurement/formula foundations incomplete |
| Navigation | NOT_INTEGRATED - authority unresolved |
| Search/discoverability | NOT_INDEXED by design; generated public/docs search projections current |
| Deployability | Offline single-file runtime passes; governed publication acceptance unresolved |
| Open findings | LPAP.C2.SOURCE.CUSTODY@1; LPAP.C2.SOLUTION.WITHHELD@1 |
| Exact artifact/render/bundle digest | `sha256:805e7512405f538b69a27f8cf781fbaf312a4258dca505b639157e24a9370ab8` / `805e7512405f538b` / `sha256:3dd2ef23b24edb01f8dc62b3c8c30546e618a96ea0217a1f94158ee0c8c3a565` |

Search acceptance evidence: `searchable_intent=false` while held; `generated_search_id=NOT_APPLICABLE`; `actual_destination=NOT_INDEXED`; `duplicate_result_count=0`; Question Bank/global-header visibility `NOT_APPLICABLE`; public/docs projections current `true`.

## Owner decisions still required

- Choose ACCEPTED, DEFERRED, or REJECTED for each of the seven products.
- Decide whether each Core1A candidate is a governed Core product, an extension/resource variant, or out of scope.
- Resolve exact source custody and denominators before any Core2/search admission.
- Resolve Bonding BOND-Q02..Q04 source collisions; BOND-Q01 should reuse the canonical identity.
- If generic standalone resources are to be publishable, approve a governed acceptance adapter in a separate reviewed change or adapt accepted content into an existing governed representation.

No Owner disposition, merge, publication, or acceptance decision is made by this packet.
