# Core1A — Detailed declarative teaching

**Authority:** canonical Motion-in-2D package only.  
**Coverage invariant:** exactly the same three canonical microtopics used by Core1B.  
**Status:** structurally complete with explicit `HOLD_WORKED_ANCHOR` and role/microtopic-specific visual holds where canonical bindings are absent; not publication-ready.

## Split one plane-motion event into independent x/y components with one clock

**Canonical microtopic:** `MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS`  
**Primary capability:** `CAP-KIN-2D-INDEPENDENT-COMPONENTS`  
**Intrinsic depth:** `MEDIUM`

### 1. Entry assumptions

- Can read signed vector components in a declared x-y frame.

### 2. Convention/frame declaration

- Use one declared non-rotating x-y frame for the whole event; both component equations use the same elapsed time.
- When +y is chosen upward, the ideal projectile model uses a_x=0 and a_y=-g after release.

### 3. Canonical inferential jump

Perpendicular components may be solved separately because each axis equation contains only that axis's quantities, but they still describe one object at one physical time.

### 4–5. Stepwise construction and why each step is valid

1. **K2D1-1 · DECLARE: Choose one fixed x-y frame, one origin and one time origin for the whole plane-motion event.**  
   Why valid: A component value is meaningful only after its frame and sign convention are fixed.
2. **K2D1-2 · TRANSFORM: Represent position, velocity and acceleration as signed x and y components in that same frame.**  
   Why valid: A plane vector is completely represented by its perpendicular Cartesian components once the frame is declared.
3. **K2D1-3 · TRANSFORM: Keep x-quantities in the x description and y-quantities in the y description while using one shared elapsed time.**  
   Why valid: The perpendicular component equations are independent in Cartesian kinematics, but both describe the same object during the same physical interval.
4. **K2D1-4 · VERIFY: Recombine only component values that refer to the same frame and the same instant.**  
   Why valid: Mixing x at one time with y at another does not describe any single physical state of the object.

### 6. Representation bridge

**REP-KIN-2D-SHARED-CLOCK:** Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.

- x-component history ↔ `v_x` ↔ The horizontal velocity component at the shared physical time.
- y-component history ↔ `v_y` ↔ The vertical velocity component at the same shared physical time.
- shared time marker ↔ `t` ↔ The one elapsed time used by both component descriptions.

**Role-specific visual binding**
- `REP-KIN-2D-SHARED-CLOCK`: BOUND_CANONICAL_SCENE_AVAILABLE — `SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01`

A representation can be canonical while its learner-facing scene remains held; this prototype never borrows a scene bound to a different microtopic or Core.

### 7. Worked conceptual anchor

**HOLD_WORKED_ANCHOR.** The canonical package supplies an exit task and authored application practice, but no Core1A-exposed worked conceptual anchor bound to this microtopic. This prototype does not relabel Core2A practice as a Core1A source-supported worked anchor.

### 8–10. Plausible wrong path → diagnostic → repair

- **Wrong path:** Independent x and y motions may use different elapsed times.  
  **Diagnostic:** At one instant 2 s after launch, may the x equation use t=2 s while the y equation uses another time?  
  **Repair:** No. Independence separates the axis equations; it does not give the same object two clocks.
- **Wrong path:** The x-motion and y-motion are two different objects that can be paired arbitrarily later.  
  **Diagnostic:** May x(2 s) be combined with y(3 s) to describe the particle's position?  
  **Repair:** No. A plane state is a simultaneous pair. Recombine x(t) and y(t) only at the same t in the same frame.

### 11. Independent checks / limits

- Use the exit-task check below and the model conditions stated in the construction.

### 12–13. Exit task and model answer/check

**Task:** A particle has x-velocity 6 m/s and y-velocity -8 m/s at t=3 s. Explain what 'independent components' means and what must remain shared between the x and y descriptions.

**Model answer:** The x and y component equations are solved separately in the same frame, but both describe the same particle at the same t=3 s.

**Reasoning**
- Keep x quantities in the x equation and y quantities in the y equation.
- Use one common elapsed time for the same physical instant.
- Recombine components only after each axis is handled consistently.

**Independent check:** Both component values must refer to the same frame and same instant.


---

## Apply constant-acceleration kinematics component by component

**Canonical microtopic:** `MIC-PHY-KIN-2D-CONSTANT-ACCELERATION`  
**Primary capability:** `CAP-KIN-2D-CONSTANT-ACCELERATION`  
**Intrinsic depth:** `MEDIUM`

### 1. Entry assumptions

- Can use the existing one-dimensional constant-acceleration model.
- Can keep x/y components separate with one common time.

### 2. Convention/frame declaration

- Use one declared non-rotating x-y frame for the whole event; both component equations use the same elapsed time.
- When +y is chosen upward, the ideal projectile model uses a_x=0 and a_y=-g after release.

### 3. Canonical inferential jump

The one-dimensional constant-acceleration equations can be applied to each perpendicular component independently when a_x and a_y are each constant over the same interval.

### 4–5. Stepwise construction and why each step is valid

1. **K2D2-1 · DECLARE: Check separately whether a_x and a_y are constant over the interval before choosing constant-acceleration equations on either axis.**  
   Why valid: The familiar one-dimensional kinematic relations are exact only on an axis whose acceleration component is constant over the interval.
2. **K2D2-2 · TRANSFORM: Apply the one-dimensional constant-acceleration relations independently to x and y using only that axis's signed values and the same t.**  
   Why valid: Each Cartesian component obeys the same one-dimensional relation when its acceleration component is constant.
3. **K2D2-3 · VERIFY: If one axis determines an event time, reuse that same time on the other axis before recombining and checking the plane state.**  
   Why valid: The event occurs once for the object; a time obtained from one component is the clock value for every component at that same event.

### 6. Representation bridge

**REP-KIN-2D-SHARED-CLOCK:** Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.

- x-component history ↔ `v_x` ↔ The horizontal velocity component at the shared physical time.
- y-component history ↔ `v_y` ↔ The vertical velocity component at the same shared physical time.
- shared time marker ↔ `t` ↔ The one elapsed time used by both component descriptions.

**REP-KIN-2D-EVENT-CLOCK:** Make event selection explicit: one component condition identifies the requested event time, and that same time is then reused on every component before reconstructing the requested state.

- solved event-time marker ↔ `t` ↔ The single elapsed time at which both component descriptions are evaluated for the selected event.
- x-component evaluation ↔ `Delta x` ↔ The horizontal displacement evaluated at the shared event time.
- y-component evaluation ↔ `Delta y` ↔ The vertical displacement evaluated at the same shared event time.

**Role-specific visual binding**
- `REP-KIN-2D-SHARED-CLOCK`: VISUAL_HOLD — no canonical scene is bound to this Core + microtopic usage.
- `REP-KIN-2D-EVENT-CLOCK`: VISUAL_HOLD — no canonical scene is bound to this Core + microtopic usage.

A representation can be canonical while its learner-facing scene remains held; this prototype never borrows a scene bound to a different microtopic or Core.

### 7. Worked conceptual anchor

**HOLD_WORKED_ANCHOR.** The canonical package supplies an exit task and authored application practice, but no Core1A-exposed worked conceptual anchor bound to this microtopic. This prototype does not relabel Core2A practice as a Core1A source-supported worked anchor.

### 8–10. Plausible wrong path → diagnostic → repair

- **Wrong path:** The magnitude of acceleration should be inserted unchanged into both x and y equations.  
  **Diagnostic:** If a=(10 i + 4 j) m/s², should both component equations use a=√116?  
  **Repair:** No. Use a_x=10 only in the x equation and a_y=4 only in the y equation; the magnitude is not either component.
- **Wrong path:** If one acceleration component is constant, the constant-acceleration equations are automatically valid on both axes.  
  **Diagnostic:** If a_x is constant but a_y changes with time, may the same constant-acceleration displacement formula be used exactly on y over the whole interval?  
  **Repair:** No. Model validity is checked per axis. A constant a_x does not make a_y constant.
- **Wrong path:** A time found from the x equation may be replaced by a different convenient time in the y equation.  
  **Diagnostic:** If x-motion says an event occurs at t=3 s, what time belongs in the y equation for that same event?  
  **Repair:** Use t=3 s. Both components describe the same event and therefore share one clock.

### 11. Independent checks / limits

- Units match velocity on both equations.
- If a_x=0 then v_x stays constant; likewise for y.
- Every term has length units.
- Setting one acceleration component to zero reduces that axis to uniform motion.

### 12–13. Exit task and model answer/check

**Task:** A particle starts with u=(0,5) m/s and constant a=(10,4) m/s². Set up the x and y position equations at common time t without solving a particular numerical t.

**Model answer:** Use Delta x=0*t+0.5(10)t² and Delta y=5t+0.5(4)t² with the same t.

**Reasoning**
- Read signed component initial velocities and accelerations.
- Apply the 1D constant-acceleration displacement relation separately.
- Keep one common elapsed time.

**Independent check:** Units are metres on both displacements and no x quantity appears in the y equation or vice versa.


---

## Select the gravity-only projectile model before using projectile consequences

**Canonical microtopic:** `MIC-PHY-KIN-PROJECTILE-MODEL`  
**Primary capability:** `CAP-KIN-PROJECTILE-MODEL`  
**Intrinsic depth:** `MEDIUM`

### 1. Entry assumptions

- Can solve 2D constant-acceleration component equations.
- If an oblique launch angle is given, angle-based vector decomposition is available as a separate prerequisite for that question.

### 2. Convention/frame declaration

- Use one declared non-rotating x-y frame for the whole event; both component equations use the same elapsed time.
- When +y is chosen upward, the ideal projectile model uses a_x=0 and a_y=-g after release.

### 3. Canonical inferential jump

After release in the ideal near-Earth model, projectile motion is not a new set of laws: it is the same component kinematics with a_x=0 and a_y=-g (for +y upward).

### 4–5. Stepwise construction and why each step is valid

1. **K2D3-1 · DECLARE: Decide whether the object is in ideal near-Earth free flight after release; neglect air resistance, declare +y, then set a_x=0 and a_y=-g.**  
   Why valid: The standard projectile equations are a conditional specialization of 2D constant acceleration, not an automatic label for every launched object.
2. **K2D3-2 · TRANSFORM: Use supplied or separately resolved u_x and u_y with one common t in the horizontal and vertical component equations.**  
   Why valid: Horizontal, oblique and downward/upward initial components change the initial state, not the gravity-only model.
3. **K2D3-3 · DECLARE: Translate the requested event into the component condition that defines it before solving for time.**  
   Why valid: Apex, same-height return, ground impact and a specified later instant are different events; each is identified by a different component condition.
4. **K2D3-4 · TRANSFORM: For an apex event, set v_y=0 while keeping v_x=u_x and a_y=-g.**  
   Why valid: At the highest point only the vertical velocity component is momentarily zero; gravity still accelerates downward and horizontal motion continues.
5. **K2D3-5 · TRANSFORM: For a return to the launch height, set Delta y=0 and treat any same-height flight-time/range shortcut as conditional on that equality.**  
   Why valid: The shortcut follows from the vertical displacement returning to its initial value; it is not valid when the landing height differs.
6. **K2D3-6 · TRANSFORM: For any unequal-height landing, use the actual Delta y=y_f-y_i in the vertical position equation and retain the actual u_y; for a horizontal launch specifically, set u_y=0, then obtain the event time vertically and share it with x.**  
   Why valid: Initial vertical velocity and landing displacement describe different facts. The landing event is fixed by the actual vertical geometry, while u_y=0 is only the horizontal-launch initial condition.
7. **K2D3-7 · VERIFY: At the selected event time, reconstruct the requested velocity, speed, direction, displacement or range from simultaneous components and check qualitative limits.**  
   Why valid: The reported projectile result is a consequence of one component model and one event, so its components must refer to the same instant and satisfy a_x=0, a_y=-g.

### 6. Representation bridge

**REP-KIN-2D-SHARED-CLOCK:** Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.

- x-component history ↔ `v_x` ↔ The horizontal velocity component at the shared physical time.
- y-component history ↔ `v_y` ↔ The vertical velocity component at the same shared physical time.
- shared time marker ↔ `t` ↔ The one elapsed time used by both component descriptions.

**REP-KIN-2D-EVENT-CLOCK:** Make event selection explicit: one component condition identifies the requested event time, and that same time is then reused on every component before reconstructing the requested state.

- solved event-time marker ↔ `t` ↔ The single elapsed time at which both component descriptions are evaluated for the selected event.
- x-component evaluation ↔ `Delta x` ↔ The horizontal displacement evaluated at the shared event time.
- y-component evaluation ↔ `Delta y` ↔ The vertical displacement evaluated at the same shared event time.

**REP-KIN-2D-PROJECTILE-MODEL:** Make the ideal projectile specialization conditional on the interactions that remain after release: gravity-only free flight licenses a_x=0 and a_y=-g; retained thrust, significant drag or contact requires a more general model.

- gravity-only status ↔ `g` ↔ The retained gravitational acceleration magnitude in the ideal projectile specialization.
- horizontal acceleration readout ↔ `v_x` ↔ The horizontal component whose constancy is a consequence of zero horizontal acceleration in the ideal specialization.
- vertical acceleration readout ↔ `v_y` ↔ The vertical velocity component that changes under the retained gravitational acceleration.

**Role-specific visual binding**
- `REP-KIN-2D-SHARED-CLOCK`: VISUAL_HOLD — no canonical scene is bound to this Core + microtopic usage.
- `REP-KIN-2D-EVENT-CLOCK`: VISUAL_HOLD — no canonical scene is bound to this Core + microtopic usage.
- `REP-KIN-2D-PROJECTILE-MODEL`: VISUAL_HOLD — no canonical scene is bound to this Core + microtopic usage.

A representation can be canonical while its learner-facing scene remains held; this prototype never borrows a scene bound to a different microtopic or Core.

### 7. Worked conceptual anchor

**HOLD_WORKED_ANCHOR.** The canonical package supplies an exit task and authored application practice, but no Core1A-exposed worked conceptual anchor bound to this microtopic. This prototype does not relabel Core2A practice as a Core1A source-supported worked anchor.

### 8–10. Plausible wrong path → diagnostic → repair

- **Wrong path:** A projectile needs a horizontal force to keep moving horizontally.  
  **Diagnostic:** If a_x=0 after release, can v_x still be nonzero?  
  **Repair:** Yes. Zero horizontal acceleration means horizontal velocity stays constant, not that it becomes zero.
- **Wrong path:** A horizontal launch has no vertical velocity throughout the flight.  
  **Diagnostic:** One second after a horizontal launch, is v_y still zero under gravity?  
  **Repair:** No. u_y=0 only at release; a_y=-g makes v_y=-gt afterward.
- **Wrong path:** At the highest point the whole velocity and the acceleration are both zero.  
  **Diagnostic:** At the apex of an oblique projectile, which of v_x, v_y and a_y is zero?  
  **Repair:** Only v_y is zero at that instant. v_x remains u_x and a_y remains -g.
- **Wrong path:** Same-height flight formulas may be used whenever the question is about a projectile range or flight time.  
  **Diagnostic:** A ball launched from a roof lands on the ground below. May the same-height time-of-flight shortcut be used without checking the vertical displacement?  
  **Repair:** No. Same-height shortcuts require Delta y=0 between launch and landing. For unequal heights, solve the vertical position condition.
- **Wrong path:** At two points of the same height on an ideal trajectory, the velocity vectors are identical.  
  **Diagnostic:** On ascent and descent at the same height, how do the horizontal and vertical velocity components compare?  
  **Repair:** v_x is the same, while v_y has equal magnitude and opposite sign; the speed matches but the velocity vector does not.
- **Wrong path:** Horizontal speed determines how long a horizontally launched object takes to fall.  
  **Diagnostic:** If the horizontal launch speed doubles from the same height, does the ideal fall time change?  
  **Repair:** No. The vertical position equation determines the fall time; horizontal speed changes the range, not the fall time.

### 11. Independent checks / limits

- v_x is constant.
- At the highest point of an oblique trajectory, v_y=0 but a_y remains -g.
- Both component equations use the same t.

### 12–13. Exit task and model answer/check

**Task:** A stone is launched horizontally from a cliff with speed u. With +y upward and air resistance neglected, write its component acceleration, velocity and displacement relations after release and explain why one common t is used.

**Model answer:** a_x=0, a_y=-g; v_x=u, v_y=-gt; Delta x=ut, Delta y=-0.5gt², all at the same elapsed time t.

**Reasoning**
- After release only gravity acts in the ideal model.
- Gravity has no horizontal component in the chosen frame.
- Both component coordinates describe the same stone at the same instant.

**Independent check:** Horizontal velocity remains constant while downward speed magnitude grows with time.


## Extension boundary from the five fixed demands

The following do **not** become additional Core1A chapters: differentiation of x(t),y(t); energy/restitution bounce mechanics; changed-gravity staging; trajectory-equation/advanced point geometry; linear drag. See `demand-map.json` for their exact classifications.
