# Question Authoring Standard & Quality Checklist

> Authority: Grade9V3 Academic Publication Engine  
> Target Schemas: `Shared/library/package.schema.json` · `Shared/web/interactive-page-blueprints.v1.json`  
> Status: Canonical Production Reference

---

## 1. Lifecycle & Progression Gates

Every question authored for Grade9V3 moves through explicit evidence-backed lifecycle stages:

```text
DRAFT (Local authoring / extraction)
  ↓ [Passes Schema & Minimum Viable Record Gate]
CANDIDATE (Committed to Physics/library/*.v1.json)
  ↓ [Independent academic review + receipt in docs/AUTHORING-RUN-RECEIPTS.md]
REVIEWED (Digest-bound academic release)
  ↓ [Empirical learner validation + cross-core custody check]
CURATED (Canonical Core benchmark reference)
```

> [!IMPORTANT]
> A record committed to `Physics/library/*.v1.json` must be at least **`CANDIDATE`** status and must strictly validate against `Shared/library/package.schema.json`. `DRAFT` is not an allowed status in the package schema and will fail the publication compiler.

---

## 2. Minimum Viable Record Checklist

Before adding a record to any `*.v1.json` file, verify every item:

### Core Identity & Provenance
- [ ] **`id`**: Unique kebab-case ID conforming to pattern: `Q-PHY-{TOPIC}-{KIND}-{N:02d}` (e.g., `Q-PHY-KIN-2D-SRC-01`).
- [ ] **`version`**: Semantic version string (e.g., `"0.1.0"`).
- [ ] **`status`**: `"CANDIDATE"` (never `"DRAFT"` in production library files).
- [ ] **`origin`**: One of `"AUTHORED"`, `"ADAPTED"`, or `"ORIGINAL"` (never vendor/source labels like `"NCERT"` at top level).
- [ ] **`source_refs`**: Array of valid source ref strings (e.g., `["SRC-AUTHORED-KIN-2D-CHALLENGE-BANK"]`).
- [ ] **`original_identifier`**: Non-empty identifier from original textbook/exam source.
- [ ] **`extensions`**: Object containing authoring metadata:
  ```json
  "extensions": {
    "grade9v3:authored_by": "agent-author-pilot",
    "grade9v3:source_html": "core2-motion-in-a-plane-tablet.html#q01",
    "grade9v3:microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS"
  }
  ```
  *(Note: `microtopic_ref` must reside inside `extensions`, not at root).*

### Question Stem & Conditions
- [ ] **`stem`**: Clear, self-contained physical statement (no trailing truncated text or placeholder tokens).
- [ ] **`conditions`**: Array of physical constraints/assumptions (e.g., `["Neglect air drag", "Take g = 9.8 m/s²"]`).
- [ ] **`options`**: If MCQ, array of **strings** (e.g., `["(A) 12 m/s", "(B) 24 m/s", ...]`). Never objects.

### Pedagogical Scaffolds & Hint Ladder
- [ ] **`hints`**: Array of objects with `text` and `reveals`:
  ```json
  "hints": [
    { "text": "Which axis undergoes constant acceleration?", "reveals": "CONCEPT" },
    { "text": "Set up Δy = u_y*t + 0.5*a_y*t² for the vertical motion.", "reveals": "METHOD" }
  ]
  ```
- [ ] **`hint_ladder`**: Progressive rungs from `ORIENT` to `FIRST_RELATION` and `CONNECT`:
  ```json
  "hint_ladder": [
    { "order": 1, "purpose": "ORIENT", "provenance": "AUTHORED_HINT", "text": "Declare axes and frame first." },
    { "order": 2, "purpose": "FIRST_RELATION", "provenance": "AUTHORED_HINT", "text": "Solve vertical flight time before horizontal range." }
  ]
  ```

### Answer & Verification Rubric
- [ ] **`answer.kind`**: One of `"MODEL_RESPONSE"`, `"EXACT"`, or `"RUBRIC"`.
- [ ] **`answer.summary`**: Non-empty concise statement of the final result with units.
- [ ] **`answer.reasoning`**: Non-empty array of step-by-step physical reasoning strings (minimum 1 item).
- [ ] **`answer.check`**: Explicit physical boundary check or dimensional validation string (cannot be empty).
- [ ] **`answer.verification_status`**: `"NOT_RUN"`, `"CHECKED_BY_AUTHOR"`, or `"INDEPENDENTLY_CHECKED"`.

---

## 3. Canonical Copy-Paste Templates

### Template A: Standard Multiple Choice Question (MCQ)
```json
{
  "id": "Q-PHY-KIN-2D-SRC-99",
  "version": "0.1.0",
  "status": "CANDIDATE",
  "source_refs": [
    "SRC-AUTHORED-KIN-2D-CHALLENGE-BANK"
  ],
  "evidence_refs": [],
  "extensions": {
    "grade9v3:authored_by": "author-name",
    "grade9v3:source_html": "core2-motion-in-a-plane-tablet.html#q99",
    "grade9v3:microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS"
  },
  "origin": "AUTHORED",
  "origin_ref": "SRC-AUTHORED-KIN-2D-CHALLENGE-BANK",
  "original_identifier": "CHALLENGE-KIN-2D-Q99",
  "stem": "A stone is thrown horizontally from a cliff of height 45 m with speed 15 m/s. Taking g = 10 m/s², what is the horizontal distance travelled by the stone before impact?",
  "subparts": [],
  "options": [
    "(A) 15 m",
    "(B) 30 m",
    "(C) 45 m",
    "(D) 60 m"
  ],
  "conditions": [
    "Neglect air resistance.",
    "Take g = 10 m/s² downward."
  ],
  "figure_refs": [],
  "answer": {
    "kind": "MODEL_RESPONSE",
    "summary": "The horizontal distance is 45 m (Option C).",
    "reasoning": [
      "Vertical motion: h = 0.5 * g * t² => 45 = 0.5 * 10 * t² => t² = 9 => t = 3 s.",
      "Horizontal motion: x = u_x * t = 15 m/s * 3 s = 45 m."
    ],
    "check": "At t = 3 s, vertical speed is 30 m/s and horizontal is 15 m/s, matching energy conservation: 0.5*m*(15²+30²) - 0.5*m*15² = m*g*45.",
    "acceptable_alternatives": [],
    "subpart_answers": [],
    "verification_status": "NOT_RUN"
  },
  "primary_capability_ref": "CAP-KIN-PROJECTILE-MODEL",
  "secondary_capability_refs": [],
  "family_ref": "FAM-PHY-KIN-2D-PRACTICE",
  "adaptation": null,
  "exposure": [
    {
      "core": "CORE2A",
      "role": "PRACTICE",
      "artifact_ref": null
    }
  ],
  "hints": [
    {
      "text": "The vertical fall time determines how long the projectile travels horizontally.",
      "reveals": "CONCEPT"
    },
    {
      "text": "Solve 45 = 0.5 * 10 * t² for t, then multiply by horizontal velocity.",
      "reveals": "METHOD"
    }
  ],
  "hint_ladder": [
    {
      "order": 1,
      "purpose": "ORIENT",
      "provenance": "AUTHORED_HINT",
      "text": "Decompose the motion into independent horizontal and vertical axes."
    },
    {
      "order": 2,
      "purpose": "FIRST_RELATION",
      "provenance": "AUTHORED_HINT",
      "text": "Write the vertical displacement equation first."
    }
  ],
  "representation_roles": {
    "initial_ref": null,
    "safe_ref": null,
    "bound_ref": null,
    "stage_refs": []
  },
  "failure_signal": null,
  "family_exposure": {
    "family_ref": "FAM-PHY-KIN-2D-PRACTICE",
    "closure": null
  }
}
```

---

## 4. Manifest Registration Disciplines

When adding registered questions to a product manifest (`products/<subject>/*.manifest.json`):

1. **Protect Canonical Cores:**
   - `selection.core2`: Reserved strictly for canonical, authentic examination questions (e.g., JEE Advanced / Main PYQs).
   - `selection.core2a`: Reserved for the 5–15 canonical fully-bound worked application questions with bound diagram representations.
   - `selection.core2b`: Reserved for transfer and boundary variation questions.
2. **Catalog Practice Question Banks under Dedicated Keys:**
   - Challenges: `challenges_2d`, `challenges_1d`, `challenges_vec`, `nlm_challenges`
   - Curriculum/Board collections: `ncert`, `sba`, `consolidated`
3. **Run Pre-Commit Verification:**
   ```powershell
   # 1. Validate JSON schema
   python3 -m unittest tests/test_render_core.py
   # 2. Check standalone practice integrity
   python3 -m unittest tests/test_physics_practice_standalone.py
   ```
