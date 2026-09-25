# Core2A — Supported familiar application

**Authority path:** canonical Motion-in-2D truth + existing truthfully authored practice.  
**Assessment-surface claim:** **HOLD** — these items do not impersonate the five PYQs and do not close ordinary Core2 custody.  
**Learner-fit claim:** **HOLD** — the owner-supplied ~50% familiarity is a support input, not scoped prerequisite evidence or measured mastery.  
**Product use:** design-preview / supported study only until learner routing is established.

## Q-PHY-KIN-2D-2A-SHARED-CLOCK-01

**Provenance:** `AUTHORED_PRACTICE` (canonical record origin: `AUTHORED`)  
**Family:** `FAM-PHY-KIN-2D-PRACTICE`  
**Primary capability:** `CAP-KIN-2D-INDEPENDENT-COMPONENTS`  
**Secondary capabilities:** none  
**Exposure role:** CORE2A:PRACTICE

### Stem / conditions

A tracker reports x(t)=4t metres and y(t)=10-2t^2 metres for one particle in one fixed frame. Find the particle's position at t=2 s, and explain why x(2 s) may not be paired with y(3 s) to describe one position.

- The two functions refer to the same particle and the same time coordinate.
- Use the declared fixed x-y frame.

### Representation

No figure is required by the canonical question record.

### Authored question hints — question custody, not source hints

- [CONCEPT] What must be the same when x(t) and y(t) describe one particle at one instant?
- [METHOD] Evaluate both component functions at the requested t before pairing them.

### Authored pedagogical scaffold ladder

- [REPRESENT; reveals CONCEPT; supports `R-KIN-2D-CLOCK-REPRESENT`] Write x(t) and y(t) in two columns connected to one clock t before substituting any number.
- [CONNECT; reveals METHOD; supports `R-KIN-2D-CLOCK-PAIR`] Label the time beside each evaluated component before you pair the coordinates.

### Complete reasoning route

1. **REPRESENT · R-KIN-2D-CLOCK-REPRESENT:** Treat x(t) and y(t) as two coordinate projections of the same particle in one fixed frame, tied to one common event time t.  
   Why valid: A single plane position is defined by simultaneous coordinates of one particle; independent component functions do not create independent clocks.
2. **TRANSFORM · R-KIN-2D-CLOCK-EVALUATE:** Substitute t=2 s into both component functions to obtain x(2)=8 m and y(2)=2 m.  
   Why valid: The requested state is the event labelled t=2 s, so both component functions must be sampled at that event.
3. **CONNECT · R-KIN-2D-CLOCK-PAIR:** Pair the two simultaneous values as the position (8,2) m and reject x(2) paired with y(3) as a single physical state.  
   Why valid: Coordinates form one state only when they refer to the same object, frame and instant; changing one timestamp changes the event.
4. **VERIFY · R-KIN-2D-CLOCK-CHECK:** Attach the timestamp to each component value and confirm the two timestamps match before calling the pair a position.  
   Why valid: Timestamp agreement is an independent event-identity check that does not depend on the arithmetic values themselves.

**Application crux:** `R-KIN-2D-CLOCK-PAIR`

### Full solution

At t=2 s, x=8 m and y=2 m, so the position is (8,2) m in the declared frame. x(2 s) and y(3 s) cannot form one position because they refer to different instants.

- Evaluate both component descriptions at the same requested time.
- x(2)=4(2)=8.
- y(2)=10-2(2^2)=2.
- A physical plane state is a simultaneous component pair.

### Independent check

The answer must use one t for both components; mixing timestamps produces no real single-time state.

### Failure signal

A response that skips or contradicts the crux move, mixes event times/components, or uses a relation outside its stated validity conditions has not completed the canonical application route.

### Repair pointer

`K2D1-4`


---

## Q-PHY-KIN-2D-2A-CONSTANT-ACCEL-02

**Provenance:** `AUTHORED_PRACTICE` (canonical record origin: `AUTHORED`)  
**Family:** `FAM-PHY-KIN-2D-PRACTICE`  
**Primary capability:** `CAP-KIN-2D-CONSTANT-ACCELERATION`  
**Secondary capabilities:** `CAP-KIN-2D-INDEPENDENT-COMPONENTS`  
**Exposure role:** CORE2A:PRACTICE

### Stem / conditions

A particle starts with velocity (3 i + 4 j) m/s and has constant acceleration (2 i - 1 j) m/s^2 for 3 s. Find its velocity and displacement after 3 s.

- Both acceleration components are constant over the 3 s interval.
- The initial position is irrelevant because the question asks for displacement.

### Representation

No figure is required by the canonical question record.

### Authored question hints — question custody, not source hints

- [CONCEPT] Write the x and y initial velocity and acceleration values separately before calculating.
- [METHOD] Apply the same 1D constant-acceleration relation independently on each axis using the common 3 s.

### Authored pedagogical scaffold ladder

- [REPRESENT; reveals CONCEPT; supports `R-KIN-2D-CA-REPRESENT`] Make a signed table for u_x, u_y, a_x and a_y before choosing equations.
- [CONNECT; reveals METHOD; supports `R-KIN-2D-CA-MODEL`] Run the constant-acceleration relation once on x and once on y while keeping one shared 3 s interval.

### Complete reasoning route

1. **REPRESENT · R-KIN-2D-CA-REPRESENT:** Resolve the vectors into u_x=3, u_y=4, a_x=2 and a_y=-1, with the same elapsed time 3 s on both axes.  
   Why valid: Component kinematics is valid only after the signed components and common physical interval are explicit.
2. **CONNECT · R-KIN-2D-CA-MODEL:** Apply v=u+at and displacement=ut+(1/2)at^2 separately to x and y while preserving signs and the common time.  
   Why valid: The given acceleration vector is constant, so each Cartesian acceleration component is constant over the same interval and the 1D relations apply component-wise.
3. **TRANSFORM · R-KIN-2D-CA-CALCULATE:** Compute v_x=9, v_y=1, Delta x=18 and Delta y=7.5 from the two component equations.  
   Why valid: Substitution into the component equations preserves the negative y acceleration instead of replacing signed components by magnitudes.
4. **VERIFY · R-KIN-2D-CA-CHECK:** Check units and signs axis by axis, then confirm both vector components refer to the same 3 s endpoint.  
   Why valid: Unit consistency detects relation misuse and the common-endpoint check prevents combining component states from different times.

**Application crux:** `R-KIN-2D-CA-MODEL`

### Full solution

v=(9 i + 1 j) m/s and Delta r=(18 i + 7.5 j) m.

- Use v_x=3+2(3)=9 and v_y=4-1(3)=1.
- Use Delta x=3(3)+0.5(2)(3^2)=18.
- Use Delta y=4(3)+0.5(-1)(3^2)=7.5.
- Both axes use the same 3 s interval.

### Independent check

Each axis uses only its own signed component values; units are m/s for velocity and m for displacement.

### Failure signal

A response that skips or contradicts the crux move, mixes event times/components, or uses a relation outside its stated validity conditions has not completed the canonical application route.

### Repair pointer

`K2D2-2`


---

## Q-PHY-KIN-2D-2A-PROJECTILE-APEX-03

**Provenance:** `AUTHORED_PRACTICE` (canonical record origin: `AUTHORED`)  
**Family:** `FAM-PHY-KIN-2D-PRACTICE`  
**Primary capability:** `CAP-KIN-PROJECTILE-MODEL`  
**Secondary capabilities:** `CAP-KIN-2D-CONSTANT-ACCELERATION`  
**Exposure role:** CORE2A:PRACTICE

### Stem / conditions

An ideal projectile is launched with already-resolved components u_x=12 m/s and u_y=20 m/s. Take +y upward and g=10 m/s^2. Find the time to the apex, the velocity at the apex, the acceleration at the apex, and the height gained above launch.

- Air resistance is neglected.
- After release, gravity is the only retained force.
- The given initial components are already resolved.

### Representation

No figure is required by the canonical question record.

### Authored question hints — question custody, not source hints

- [CONCEPT] Which component condition defines the apex?
- [METHOD] Set only v_y to zero, solve for the shared time, then evaluate the other requested quantities at that time.

### Authored pedagogical scaffold ladder

- [REPRESENT; reveals CONCEPT; supports `R-KIN-2D-APEX-REPRESENT`] Write separate horizontal and vertical rules before deciding what condition defines the top of the path.
- [CONNECT; reveals METHOD; supports `R-KIN-2D-APEX-EVENT`] At the apex, decide which velocity component changes sign and set only that component to zero.

### Complete reasoning route

1. **REPRESENT · R-KIN-2D-APEX-REPRESENT:** Represent ideal flight with a_x=0, a_y=-g, constant v_x=u_x and v_y=u_y-gt in the upward-positive frame.  
   Why valid: Gravity-only free flight leaves horizontal velocity constant while vertical velocity changes under a constant downward acceleration.
2. **DECIDE · R-KIN-2D-APEX-EVENT:** Identify the apex by v_y=0, not by setting the full velocity or acceleration to zero.  
   Why valid: At a vertical turning point v_y changes sign, while horizontal motion continues and gravity remains present.
3. **TRANSFORM · R-KIN-2D-APEX-CALCULATE:** Solve t=2 s, then evaluate velocity, acceleration and height gain at that same event time.  
   Why valid: Every requested quantity describes the same apex event, so the time obtained from v_y=0 must be reused across both components.
4. **VERIFY · R-KIN-2D-APEX-CHECK:** Confirm that only v_y vanishes at the apex while v_x and downward acceleration remain nonzero.  
   Why valid: This component check distinguishes a vertical turning point from the false claim that the projectile stops or gravity vanishes.

**Application crux:** `R-KIN-2D-APEX-EVENT`

### Full solution

The apex occurs at t=2 s. There v=(12 i + 0 j) m/s, a=(0 i - 10 j) m/s^2, and the height gained is 20 m.

- At the apex set v_y=u_y-gt=0, so t=20/10=2 s.
- Horizontal acceleration is zero, so v_x remains 12 m/s.
- Gravity still acts at the apex, so a_y=-10 m/s^2.
- Delta y=20(2)-0.5(10)(2^2)=20 m.

### Independent check

Only v_y is zero at the apex; neither the full velocity nor the acceleration is zero.

### Failure signal

A response that skips or contradicts the crux move, mixes event times/components, or uses a relation outside its stated validity conditions has not completed the canonical application route.

### Repair pointer

`K2D3-4`


---

## Q-PHY-KIN-2D-2A-HORIZONTAL-LAUNCH-04

**Provenance:** `AUTHORED_PRACTICE` (canonical record origin: `AUTHORED`)  
**Family:** `FAM-PHY-KIN-2D-PRACTICE`  
**Primary capability:** `CAP-KIN-PROJECTILE-MODEL`  
**Secondary capabilities:** `CAP-KIN-2D-INDEPENDENT-COMPONENTS`  
**Exposure role:** CORE2A:PRACTICE

### Stem / conditions

A stone is launched horizontally at 15 m/s from a cliff 20 m above level ground. Take +y upward and g=10 m/s^2. Find the flight time, horizontal range and impact velocity.

- Air resistance is neglected.
- The launch has u_y=0.
- Ground is 20 m below the launch point.

### Representation

No figure is required by the canonical question record.

### Authored question hints — question custody, not source hints

- [CONCEPT] Which component equation contains the known 20 m drop?
- [METHOD] Find the common impact time from y first, then use that same time in x and in the velocity components.

### Authored pedagogical scaffold ladder

- [REPRESENT; reveals CONCEPT; supports `R-KIN-LAUNCH-REPRESENT`] Draw x and y as separate columns tied to one shared t, and place the 20 m drop only in the y column.
- [CONNECT; reveals METHOD; supports `R-KIN-LAUNCH-EVENT`] Name the physical condition that says the stone has reached the ground before solving for the event time.

### Complete reasoning route

1. **REPRESENT · R-KIN-LAUNCH-REPRESENT:** Represent the horizontal and vertical histories in one declared frame with one shared elapsed time, placing the 20 m drop in the vertical component.  
   Why valid: The component equations evolve independently but still describe one stone at one physical instant, so the known landing geometry belongs to y while time remains common.
2. **DECIDE · R-KIN-LAUNCH-EVENT:** Use the vertical ground-contact condition Delta y=-20 m to determine the flight time before calculating horizontal range or impact velocity.  
   Why valid: Ground impact is defined by the vertical displacement, so the y equation identifies the event time; that one time then belongs to every component at impact.
3. **CONNECT · R-KIN-LAUNCH-REUSE:** Reuse t_event=2 s in the horizontal displacement and both velocity components.  
   Why valid: Range and impact velocity must be reconstructed at the same physical event that the vertical equation identified.
4. **VERIFY · R-KIN-LAUNCH-CHECK:** Check that the ideal fall time is set by vertical motion while horizontal speed changes the range but not the vertical landing event.  
   Why valid: With a_x=0 and no drag, the vertical event equation contains no horizontal speed.

**Application crux:** `R-KIN-LAUNCH-EVENT`

### Full solution

The flight time is 2 s, the horizontal range is 30 m, and the impact velocity is (15 i - 20 j) m/s.

- Use the vertical condition Delta y=-20=0*t-0.5(10)t^2, giving t=2 s.
- Then Delta x=15(2)=30 m.
- v_x=15 m/s and v_y=-10(2)=-20 m/s at impact.

### Independent check

The fall time comes from vertical motion; changing only horizontal speed would change range but not the ideal fall time.

### Failure signal

A response that skips or contradicts the crux move, mixes event times/components, or uses a relation outside its stated validity conditions has not completed the canonical application route.

### Repair pointer

`K2D3-6`


---

## Q-PHY-KIN-2D-2A-SAME-HEIGHT-05

**Provenance:** `AUTHORED_PRACTICE` (canonical record origin: `AUTHORED`)  
**Family:** `FAM-PHY-KIN-2D-PRACTICE`  
**Primary capability:** `CAP-KIN-PROJECTILE-MODEL`  
**Secondary capabilities:** `CAP-KIN-2D-CONSTANT-ACCELERATION`  
**Exposure role:** CORE2A:PRACTICE

### Stem / conditions

An ideal projectile is launched and later lands at the same height with u_x=12 m/s, u_y=16 m/s and g=8 m/s^2. Find the total flight time, range and landing velocity.

- Air resistance is neglected.
- Launch and landing heights are equal.
- Take +y upward.

### Representation

No figure is required by the canonical question record.

### Authored question hints — question custody, not source hints

- [CONCEPT] What vertical displacement condition is true at a same-height landing?
- [METHOD] Use Delta y=0 to obtain the nonzero landing time, then reuse that time in x and v_y.

### Authored pedagogical scaffold ladder

- [REPRESENT; reveals CONCEPT; supports `R-KIN-2D-SAME-REPRESENT`] Write the landing geometry first: identify Delta y when the projectile returns to its launch height.
- [CONNECT; reveals METHOD; supports `R-KIN-2D-SAME-EVENT`] The vertical equation has a launch root and a later root; identify which event is requested before reusing the time.

### Complete reasoning route

1. **REPRESENT · R-KIN-2D-SAME-REPRESENT:** Represent landing at the launch height with Delta y=0 while keeping a_x=0, a_y=-g and one common flight time.  
   Why valid: Same launch and landing height fixes the vertical event displacement without changing the gravity-only component model.
2. **DECIDE · R-KIN-2D-SAME-EVENT:** Choose the nonzero root of the vertical event equation as the landing time and reject t=0 as the launch event.  
   Why valid: The equation describes two visits to the launch height; event identity selects the later root because the question asks for landing.
3. **CONNECT · R-KIN-2D-SAME-REUSE:** Reuse t=4 s in horizontal displacement and vertical velocity to obtain range and landing velocity.  
   Why valid: Range and landing velocity belong to the same landing event identified by the vertical equation.
4. **VERIFY · R-KIN-2D-SAME-CHECK:** Compare launch and landing components: v_x must match while v_y has equal magnitude and opposite sign.  
   Why valid: With zero horizontal acceleration and constant downward gravity, return to the same height restores vertical speed magnitude while reversing its direction.

**Application crux:** `R-KIN-2D-SAME-EVENT`

### Full solution

The flight time is 4 s, the range is 48 m, and the landing velocity is (12 i - 16 j) m/s.

- At landing Delta y=0=16t-0.5(8)t^2; the nonzero root is t=4 s.
- Horizontal velocity stays 12 m/s, so range=12(4)=48 m.
- v_y=16-8(4)=-16 m/s at landing.

### Independent check

At the same height, the horizontal component matches launch and the vertical component has equal magnitude with opposite sign.

### Failure signal

A response that skips or contradicts the crux move, mixes event times/components, or uses a relation outside its stated validity conditions has not completed the canonical application route.

### Repair pointer

`K2D3-5`

