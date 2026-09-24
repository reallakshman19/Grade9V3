# Optional learner-product appendices and publication audit

The six Core role files and [learner-product templates](LEARNER-PRODUCT-TEMPLATES.md)
remain authoritative for the six learner products. This document defines two **optional,
subject-neutral consumers** of canonical truth:

1. a ready-reference / exam-speed appendix; and
2. a publication-quality audit report.

Neither is a seventh Core. Neither may introduce academic truth that is absent from the
canonical subject records, source custody, or reviewed authored material.

## Ready-reference / exam-speed appendix

A speed card compresses a relationship the learner is expected to have already learned.
It is allowed to accelerate recognition and execution; it is not allowed to hide the
conditions that make the shortcut valid.

Every card therefore carries:

**canonical references → recognition trigger → invariant → derivation anchor → shortcut →
validity domain → failure domain → trap → independent check → lightning drill**

A card without a validity domain or failure domain is incomplete. A card without explicit
provenance is not publishable. A mnemonic may aid recall, but it may not replace the
derivation anchor that explains why the relation is valid.

The appendix is normally consumed beside or after Core1/Core1A. Its presence does not
change the semantic obligations of either role.

```ready-reference-toolkit
{
  "version": "1.0",
  "card_contract": {
    "required_fields": [
      "hack_id",
      "title",
      "canonical_refs",
      "recognition_trigger",
      "invariant",
      "derivation_anchor",
      "shortcut",
      "valid_when",
      "fails_when",
      "trap",
      "verification_check",
      "lightning_drill",
      "scope_status",
      "provenance"
    ],
    "nonempty_array_fields": [
      "canonical_refs",
      "valid_when",
      "fails_when"
    ],
    "lightning_drill_required_fields": [
      "prompt",
      "answer"
    ],
    "scope_status_values": [
      "CANONICAL_CONSEQUENCE",
      "CORE_EXTENSION",
      "AUTHORED_REFERENCE_ONLY"
    ],
    "provenance_values": [
      "SOURCE_VERBATIM",
      "SOURCE_DERIVED",
      "CANONICAL_DERIVED",
      "AUTHORED_PEDAGOGICAL"
    ]
  },
  "forbidden_claims": [
    "shortcut valid without a declared domain",
    "mnemonic presented as derivation",
    "authored rule presented as source text",
    "appendix content silently promoted into Core semantic truth"
  ]
}
```

### Rendering guidance

A ready-reference card should make the **domain and failure condition as visually prominent
as the shortcut**. A compact print edition may be dense; a study/tablet edition should use
the reader-first typography and responsive rules from the shared learner renderer.

A recommended visual order is:

1. Recognition trigger
2. Invariant / formula
3. Why it works (derivation anchor)
4. Fast move
5. Valid when
6. Do not use when
7. Trap
8. Check
9. Lightning drill

## Publication-quality audit

A machine audit can establish structural facts. It cannot, by itself, establish source
fidelity or academic correctness.

The audit contract therefore separates four independent publication claims:

- **STRUCTURALLY_VALIDATED** — required fields, ordering, arithmetic and generated-artifact
  rules pass.
- **SOURCE_VERIFIED** — source-locked material has been compared against authoritative
  source evidence, or is explicitly not applicable.
- **ACADEMICALLY_REVIEWED** — the academic reasoning, answers, diagrams and checks have
  received explicit review evidence.
- **PUBLICATION_READY** — all applicable upstream claims are explicitly satisfied and
  publication-surface gates pass.

A report may never infer the latter three from a structural pass.

```publication-audit
{
  "version": "1.0",
  "gate_states": [
    "PASS",
    "FAIL",
    "HOLD",
    "NOT_APPLICABLE"
  ],
  "claims": [
    "STRUCTURALLY_VALIDATED",
    "SOURCE_VERIFIED",
    "ACADEMICALLY_REVIEWED",
    "PUBLICATION_READY"
  ],
  "required_gates": [
    "SOURCE_FIDELITY",
    "FIELD_LEVEL_PROVENANCE",
    "DIFFICULTY_POLICY",
    "HINT_REVEAL_INTEGRITY",
    "VISUAL_SEMANTIC_BINDING",
    "SOLUTION_REASONING_COMPLETENESS",
    "INDEPENDENT_VERIFICATION",
    "MATH_RENDERING",
    "MEDIA_GEOMETRY",
    "GENERATED_ARTIFACT_FRESHNESS"
  ],
  "publication_ready_requires": [
    "STRUCTURALLY_VALIDATED",
    "ACADEMICALLY_REVIEWED"
  ],
  "publication_ready_source_states": [
    "PASS",
    "NOT_APPLICABLE"
  ],
  "visual_semantic_binding": {
    "required_evidence_fields": [
      "canonical_representation_ref",
      "required_elements",
      "present_elements",
      "provenance",
      "semantic_review"
    ],
    "semantic_review_must_equal": true,
    "required_elements_must_be_present": true
  },
  "forbidden_overclaims": [
    "ZERO_ERROR",
    "ZERO_DEFECT",
    "PERFECTLY_VERIFIED",
    "VERIFIED_CANONICAL"
  ]
}
```

## Gate meanings

### SOURCE_FIDELITY

Compare source-locked fields against authoritative source evidence. Sampling a handful of
records does not establish full-bank source fidelity.

### FIELD_LEVEL_PROVENANCE

Every field that can be mistaken for source material must say whether it is source verbatim,
source derived, canonical derived, or authored pedagogy. A polished hint or solution does not
become a source hint or official solution merely because it is stored beside the source stem.

### DIFFICULTY_POLICY

Check component arithmetic and the repository's current tier policy. A publication audit
must consume the governed tier policy; it must not silently introduce a new score-to-tier map.

### HINT_REVEAL_INTEGRITY

Confirm source hints remain source custody, authored scaffolds remain authored support, and
attempt-first products do not reveal protected decisions before learner commitment.

### VISUAL_SEMANTIC_BINDING

A diagram label is not enough. A passing visual gate needs a canonical representation
identity, explicit required elements, evidence that those elements are actually present,
provenance, and a positive semantic review.

### SOLUTION_REASONING_COMPLETENESS

Check that the reasoning route reaches the claimed answer and that prose descriptions do not
mislabel intermediate quantities or final requested quantities.

### INDEPENDENT_VERIFICATION

A verification label is not evidence by itself. The report must point to executable or
reviewable working: substitution, conservation, limit, dimensional, independent derivation,
or another subject-qualified check.

### MATH_RENDERING

Check the actual rendered surface for broken expressions and inaccessible math, not merely a
small blacklist of source strings.

### MEDIA_GEOMETRY

When a PDF or fixed-layout publication is in scope, inspect the actual media box/page geometry
and overflow. Otherwise record this gate as `NOT_APPLICABLE` with a rationale.

### GENERATED_ARTIFACT_FRESHNESS

Generated outputs and architecture manifests must match their declared inputs exactly.

## Visual-candidate adoption rule

An externally authored or draft SVG is a **candidate**, not canonical truth.

It may be adopted only when all of the following are explicit:

- canonical representation identity;
- required semantic elements/interactions;
- actual present elements/interactions;
- provenance;
- semantic review outcome.

If any required element is absent, the visual gate is `FAIL` or `HOLD`; renaming the
diagram type cannot make it pass.
