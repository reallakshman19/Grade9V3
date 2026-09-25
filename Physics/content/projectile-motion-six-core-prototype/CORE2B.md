# Core2B — Changed-demand transfer

**Task-design status:** canonical authored transfer records contain explicit parent lineage and protected `DECIDE` moves.  
**Learner-release status:** **HOLD** because actual prior exposure and prerequisite closure for this learner are not established. The owner estimate of ~50% is not mastery evidence.  
**Untaught-model rule:** none of the five fixed advanced anchors is promoted into Core2B; drag, changed gravity, bounce/restitution and advanced trajectory machinery remain upstream gaps/extensions.

The learner-facing ordering below deliberately withholds changed-demand metadata and the protected move identifier until after a nontrivial attempt prompt. The machine-readable trace still records those fields for audit.

## Q-PHY-KIN-2D-2B-REPRESENTATION-01

**Provenance:** `AUTHORED_PRACTICE`  
**Primary capability:** `CAP-KIN-2D-INDEPENDENT-COMPONENTS`  
**Prior-exposure lineage:** `Q-PHY-KIN-2D-2A-SHARED-CLOCK-01`  
**Learner-release status:** `LEARNER_ELIGIBILITY_HOLD` — lineage is defined in the artifact, but this learner's actual prior exposure/prerequisite closure is not established by a 50% estimate.

### Question / conditions

A particle is described verbally: at t=0 it is at the origin, moving east at 6 m/s and north at 2 m/s; during the next interval its acceleration is 3 m/s^2 south and zero east-west. Without being given component equations, choose a coordinate convention and write the signed component state that should be used for later calculation.

- Use one fixed Cartesian frame.
- The verbal directions must be translated into signed components before calculation.

### Safe pre-attempt support

- First list the raw direction words and magnitudes without plus or minus signs. (supports `R-KIN-2D-BREP-FACTS`)

### ATTEMPT / learner commitment

Commit to the model/representation/event decision and justify it before revealing post-attempt support.

<details>
<summary>Post-attempt support, full answer and transfer review</summary>

### Changed-demand statement

**Changed dimension:** `representation_translation`  
**Changed demand:** The learner must convert a verbal direction description into signed x/y state without being handed the component representation.  
**Protected DECIDE move:** `R-KIN-2D-BREP-FRAME`

### Post-attempt support

**Question hints (authored question custody)**
- [CONCEPT] Before writing numbers, which two perpendicular positive directions will you declare?
- [METHOD] Translate each directional word into a sign only after that frame is fixed.

**Pedagogical scaffolds**
- [REPRESENT; reveals CONCEPT; supports `R-KIN-2D-BREP-FACTS`] First list the raw direction words and magnitudes without plus or minus signs.

### Full answer

One valid choice is +x east and +y north, giving u_x=+6 m/s, u_y=+2 m/s, a_x=0 and a_y=-3 m/s^2, all with one common t.

- Declare +x east and +y north.
- Translate each direction into a sign in that frame.
- Keep the same frame and clock for both component histories.

### Justification rubric

- Declares a single Cartesian frame before assigning signs. — evidence of: Representation is chosen rather than assumed.
- Translates east/north/south statements into consistent signed components. — evidence of: Verbal motion is converted into canonical x/y state.
- Keeps one common time for the two component histories. — evidence of: Independent components are still one event.

### Independent check

Any consistently declared perpendicular axis convention is acceptable if all signs are transformed consistently.

### Changed-demand review

The protected move is `R-KIN-2D-BREP-FRAME`; it is a `DECIDE` move in the canonical reasoning route. The transfer changes `representation_translation`, not merely numbers or story nouns.

### Repair route

`K2D1-2`

</details>

---

## Q-PHY-KIN-2D-2B-MODEL-VALIDITY-02

**Provenance:** `AUTHORED_PRACTICE`  
**Primary capability:** `CAP-KIN-2D-CONSTANT-ACCELERATION`  
**Prior-exposure lineage:** `Q-PHY-KIN-2D-2A-CONSTANT-ACCEL-02`  
**Learner-release status:** `LEARNER_ELIGIBILITY_HOLD` — lineage is defined in the artifact, but this learner's actual prior exposure/prerequisite closure is not established by a 50% estimate.

### Question / conditions

Over 0<=t<=4 s, a particle has a_x=2 m/s^2 but a_y=3t m/s^2. Decide whether the ordinary constant-acceleration equations may be used exactly on x, on y, on both, or on neither over the whole interval. Explain the model choice before doing any further calculation.

- The acceleration components are given as functions of time.
- No numerical integration is required; the task is model selection.

### Safe pre-attempt support

- Make one row for a_x(t) and one for a_y(t), and write the validity condition each row must satisfy. (supports `R-KIN-2D-BMODEL-REPRESENT`)

### ATTEMPT / learner commitment

Commit to the model/representation/event decision and justify it before revealing post-attempt support.

<details>
<summary>Post-attempt support, full answer and transfer review</summary>

### Changed-demand statement

**Changed dimension:** `model_choice`  
**Changed demand:** The learner must decide component-by-component whether the constant-acceleration model is valid instead of being told that it applies.  
**Protected DECIDE move:** `R-KIN-2D-BMODEL-DECIDE`

### Post-attempt support

**Question hints (authored question custody)**
- [CONCEPT] Is 'constant acceleration' one global label here, or must each component be checked over the interval?

**Pedagogical scaffolds**
- [REPRESENT; reveals CONCEPT; supports `R-KIN-2D-BMODEL-REPRESENT`] Make one row for a_x(t) and one for a_y(t), and write the validity condition each row must satisfy.

### Full answer

The constant-acceleration equations are exact on x because a_x is constant, but not on y because a_y changes with time over the interval.

- Check each acceleration component separately.
- a_x=2 is constant, so the 1D constant-acceleration x relations are valid.
- a_y=3t varies with time, so the constant-a y relations are not exact over the whole interval.

### Justification rubric

- Checks x and y acceleration components separately. — evidence of: Model validity is treated per component.
- Accepts constant-acceleration equations only on x. — evidence of: Does not let one valid axis license the other.

### Independent check

A constant total direction or a constant x component does not make the y component constant.

### Changed-demand review

The protected move is `R-KIN-2D-BMODEL-DECIDE`; it is a `DECIDE` move in the canonical reasoning route. The transfer changes `model_choice`, not merely numbers or story nouns.

### Repair route

`K2D2-1`

</details>

---

## Q-PHY-KIN-2D-2B-UNEQUAL-HEIGHT-03

**Provenance:** `AUTHORED_PRACTICE`  
**Primary capability:** `CAP-KIN-PROJECTILE-MODEL`  
**Prior-exposure lineage:** `Q-PHY-KIN-2D-2A-SAME-HEIGHT-05`  
**Learner-release status:** `LEARNER_ELIGIBILITY_HOLD` — lineage is defined in the artifact, but this learner's actual prior exposure/prerequisite closure is not established by a 50% estimate.

### Question / conditions

An ideal projectile begins 15 m above level ground with u_x=10 m/s and u_y=10 m/s. Take +y upward and g=10 m/s^2. Find the ground-impact time and horizontal range. Do not assume launch and landing are at the same height.

- Air resistance is neglected.
- Ground is 15 m below the launch point.
- The initial velocity components are already resolved.

### Safe pre-attempt support

- Sketch only the launch level and ground relative to one vertical origin before writing an event equation. (supports `R-KIN-2D-BHEIGHT-REPRESENT`)

### ATTEMPT / learner commitment

Commit to the model/representation/event decision and justify it before revealing post-attempt support.

<details>
<summary>Post-attempt support, full answer and transfer review</summary>

### Changed-demand statement

**Changed dimension:** `reasoning_steps`  
**Changed demand:** The learner must replace the familiar same-height condition with an unequal-height event condition and carry the resulting time across axes.  
**Protected DECIDE move:** `R-KIN-2D-BHEIGHT-EVENT`

### Post-attempt support

**Question hints (authored question custody)**
- [CONCEPT] What vertical displacement identifies ground impact relative to the launch point?
- [METHOD] Find the physical root from the y equation, then use that same time in x.

**Pedagogical scaffolds**
- [REPRESENT; reveals CONCEPT; supports `R-KIN-2D-BHEIGHT-REPRESENT`] Sketch only the launch level and ground relative to one vertical origin before writing an event equation.

### Full answer

Ground impact occurs at t=3 s and the horizontal range is 30 m.

- Use the vertical impact condition Delta y=-15=10t-5t^2.
- Solve 5t^2-10t-15=0, giving the physical root t=3 s.
- Reuse t=3 s horizontally: Delta x=10(3)=30 m.
- The same-height shortcut would use the wrong event condition here.

### Justification rubric

- Uses the actual vertical displacement -15 m rather than a same-height shortcut. — evidence of: Selects the event condition from geometry.
- Reuses the physical impact time in the horizontal equation. — evidence of: Preserves the one-clock invariant.

### Independent check

Substitution into the vertical displacement gives -15 m; the nonzero same-height time 2u_y/g=2 s is not the ground-impact time.

### Changed-demand review

The protected move is `R-KIN-2D-BHEIGHT-EVENT`; it is a `DECIDE` move in the canonical reasoning route. The transfer changes `reasoning_steps`, not merely numbers or story nouns.

### Repair route

`K2D3-6`

</details>

---

## Q-PHY-KIN-2D-2B-PROJECTILE-VALIDITY-04

**Provenance:** `AUTHORED_PRACTICE`  
**Primary capability:** `CAP-KIN-PROJECTILE-MODEL`  
**Prior-exposure lineage:** `Q-PHY-KIN-2D-2A-HORIZONTAL-LAUNCH-04`  
**Learner-release status:** `LEARNER_ELIGIBILITY_HOLD` — lineage is defined in the artifact, but this learner's actual prior exposure/prerequisite closure is not established by a 50% estimate.

### Question / conditions

An object is launched and, after release, a small rocket motor continues to provide a horizontal thrust that gives a_x=2 m/s^2 while gravity gives a_y=-g. Decide whether the standard ideal projectile specialization a_x=0, a_y=-g is valid and state the correct bounded model to use.

- Air resistance is neglected.
- The horizontal rocket thrust remains active after release.
- The question asks for model selection, not a full trajectory calculation.

### Safe pre-attempt support

- List the post-release interactions and the acceleration components they imply before you name any motion model. (supports `R-KIN-TRANSFER-INTERACTIONS`)

### ATTEMPT / learner commitment

Commit to the model/representation/event decision and justify it before revealing post-attempt support.

<details>
<summary>Post-attempt support, full answer and transfer review</summary>

### Changed-demand statement

**Changed dimension:** `model_choice`  
**Changed demand:** The learner must reject the familiar projectile specialization because one of its defining force/model conditions is explicitly broken.  
**Protected DECIDE move:** `R-KIN-TRANSFER-MODEL`

### Post-attempt support

**Question hints (authored question custody)**
- [CONCEPT] Which post-release assumption makes a_x=0 in the standard projectile model, and is it true here?

**Pedagogical scaffolds**
- [REPRESENT; reveals CONCEPT; supports `R-KIN-TRANSFER-INTERACTIONS`] List the post-release interactions and the acceleration components they imply before you name any motion model.

### Full answer

The standard ideal projectile specialization is not valid because a_x is not zero. Use the more general 2D constant-acceleration model with a_x=2 m/s^2 and a_y=-g for as long as those components remain constant.

- The standard projectile specialization requires gravity-only free flight.
- The active rocket motor adds a retained horizontal acceleration.
- Therefore use the parent 2D constant-acceleration capability rather than the gravity-only projectile specialization.

### Justification rubric

- Rejects the gravity-only projectile specialization. — evidence of: Checks model conditions before formula use.
- Falls back to the general component constant-acceleration model. — evidence of: Chooses the smallest valid parent model rather than inventing a new law.

### Independent check

If the motor is switched off after release and drag remains negligible, the standard a_x=0 projectile model becomes valid from that later instant.

### Changed-demand review

The protected move is `R-KIN-TRANSFER-MODEL`; it is a `DECIDE` move in the canonical reasoning route. The transfer changes `model_choice`, not merely numbers or story nouns.

### Repair route

`K2D3-1`

</details>

---

## Q-PHY-KIN-2D-2B-SAME-HEIGHT-VELOCITY-05

**Provenance:** `AUTHORED_PRACTICE`  
**Primary capability:** `CAP-KIN-PROJECTILE-MODEL`  
**Prior-exposure lineage:** `Q-PHY-KIN-2D-2A-PROJECTILE-APEX-03`  
**Learner-release status:** `LEARNER_ELIGIBILITY_HOLD` — lineage is defined in the artifact, but this learner's actual prior exposure/prerequisite closure is not established by a 50% estimate.

### Question / conditions

An ideal projectile passes the same height once on the way up and once on the way down. Without calculating the times, compare v_x, v_y, speed and acceleration at those two events.

- Air resistance is neglected.
- Both events occur on the same trajectory at the same vertical position.
- Take +y upward.

### Safe pre-attempt support

- Make a comparison table for v_x, v_y, speed and acceleration; enter only ‘same height’, ‘upward’ and ‘downward’ before choosing a method. (supports `R-KIN-2D-BSTATE-REPRESENT`)

### ATTEMPT / learner commitment

Commit to the model/representation/event decision and justify it before revealing post-attempt support.

<details>
<summary>Post-attempt support, full answer and transfer review</summary>

### Changed-demand statement

**Changed dimension:** `reasoning_steps`  
**Changed demand:** The learner must compare two equal-height events by component invariants rather than solve a routine time/range calculation.  
**Protected DECIDE move:** `R-KIN-2D-BSTATE-DECIDE`

### Post-attempt support

**Question hints (authored question custody)**
- [CONCEPT] At the same height, which horizontal quantity is unchanged throughout ideal flight, and what must differ between ascent and descent?
- [METHOD] Compare component signs first; only then compare speed magnitudes.

**Pedagogical scaffolds**
- [REPRESENT; reveals CONCEPT; supports `R-KIN-2D-BSTATE-REPRESENT`] Make a comparison table for v_x, v_y, speed and acceleration; enter only ‘same height’, ‘upward’ and ‘downward’ before choosing a method.

### Full answer

v_x is the same at both events; v_y has equal magnitude and opposite sign; therefore the speed is the same but the velocity vectors differ. Acceleration is the same (0,-g) at both events.

- Horizontal velocity remains constant because a_x=0.
- At equal height in the same gravity-only trajectory, the vertical speed magnitude matches on ascent and descent, with opposite signs.
- Combining the components gives equal speed magnitudes but different velocity directions.
- Gravity gives the same downward acceleration at both events.

### Justification rubric

- Keeps v_x unchanged across the two events. — evidence of: Uses the horizontal component invariant.
- Gives v_y equal magnitude and opposite sign. — evidence of: Understands same-height vertical-state symmetry without confusing vector equality.
- Distinguishes equal speed from equal velocity. — evidence of: Recombines components conceptually rather than comparing only magnitudes.

### Independent check

The two velocity vectors cannot be identical because one has upward v_y and the other downward v_y.

### Changed-demand review

The protected move is `R-KIN-2D-BSTATE-DECIDE`; it is a `DECIDE` move in the canonical reasoning route. The transfer changes `reasoning_steps`, not merely numbers or story nouns.

### Repair route

`K2D3-7`

</details>
