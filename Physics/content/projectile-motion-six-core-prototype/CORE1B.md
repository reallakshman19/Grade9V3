# Core1B — Self-tutor conceptual reconstruction

**Coverage:** identical to Core1A: `MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS`, `MIC-PHY-KIN-2D-CONSTANT-ACCELERATION`, `MIC-PHY-KIN-PROJECTILE-MODEL`.  
**Reveal contract:** PREDICT and ATTEMPT appear before any reconstruction/model response.  
**Status:** structurally assembled from canonical elicitation truth; visual availability is governed by the same representation audit as Core1A.

## Split one plane-motion event into independent x/y components with one clock

**Canonical microtopic:** `MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS`  
**Same inferential truth as Core1A:** Perpendicular components may be solved separately because each axis equation contains only that axis's quantities, but they still describe one object at one physical time.

### PREDICT — attempt first

If x and y components are independent, does that mean the object has two different clocks?

Write a committed answer before opening reconstruction.

### ATTEMPT — produce

A two-column x/y setup with one shared t.

**Closure standard (kept after attempt):** RUBRIC

<details>
<summary>RECONSTRUCT / DIAGNOSE / REPAIR / BOUNDARY TEST — reveal only after attempting</summary>

### RECONSTRUCT

1. What must be declared before any component can have a sign?  
   Why this ask: Recovers the common frame and axis convention.  
   Canonical step: `K2D1-1`
2. What separates between axes, and what must stay common because both descriptions belong to one event?  
   Why this ask: Distinguishes component independence from the shared-clock invariant.  
   Canonical step: `K2D1-3`
3. Which x and y values may be recombined into one state?  
   Why this ask: Makes simultaneity observable rather than implicit.  
   Canonical step: `K2D1-4`

**A/B difference:** Teaching states the independence/common-time rule; reconstruction makes the learner distinguish what separates from what stays shared.

### DIAGNOSE

- **Plausible wrong answer:** Independent x and y motions may use different elapsed times.  
  **Separating diagnostic:** At one instant 2 s after launch, may the x equation use t=2 s while the y equation uses another time?
- **Plausible wrong answer:** The x-motion and y-motion are two different objects that can be paired arbitrarily later.  
  **Separating diagnostic:** May x(2 s) be combined with y(3 s) to describe the particle's position?

### REPAIR

- No. Independence separates the axis equations; it does not give the same object two clocks.
- No. A plane state is a simultaneous pair. Recombine x(t) and y(t) only at the same t in the same frame.

### BOUNDARY TEST

**Prompt:** If a_x=0 but a_y is nonzero, may v_x stay constant while v_y changes?

**Answer:** Yes. That is exactly what independent component evolution permits.

**Confirms:** One component can change while the other does not.

### MODEL RESPONSE / RUBRIC


**Rubric**
- Axes are kept separate while time/frame remain shared. — evidence of: Correct component independence model.
**Representative accepted responses**
- Separate x and y equations; same t for both.
**Representative rejected responses**
- Use x acceleration in the y equation or assign unrelated times.

**Prediction defensible answer:** No. The component equations are separate, but the event uses one common elapsed time.

</details>


---

## Apply constant-acceleration kinematics component by component

**Canonical microtopic:** `MIC-PHY-KIN-2D-CONSTANT-ACCELERATION`  
**Same inferential truth as Core1A:** The one-dimensional constant-acceleration equations can be applied to each perpendicular component independently when a_x and a_y are each constant over the same interval.

### PREDICT — attempt first

If a_x is nonzero and a_y is zero, which velocity component changes with time?

Write a committed answer before opening reconstruction.

### ATTEMPT — produce

Two correct component constant-acceleration equations using one t.

**Closure standard (kept after attempt):** RUBRIC

<details>
<summary>RECONSTRUCT / DIAGNOSE / REPAIR / BOUNDARY TEST — reveal only after attempting</summary>

### RECONSTRUCT

1. Before using a constant-acceleration formula, what must be true about that axis's acceleration component?  
   Why this ask: Makes model validity explicit rather than formula-driven.  
   Canonical step: `K2D2-1`
2. What does the 1D relation become when written only along x, and what changes for y?  
   Why this ask: Transfers an existing model one axis at a time.  
   Canonical step: `K2D2-2`
3. If one component equation finds the event time, what time must the other component use?  
   Why this ask: Recovers the shared-clock coupling at an event.  
   Canonical step: `K2D2-3`

**A/B difference:** Teaching supplies component forms; reconstruction derives them by applying the existing 1D model separately to each axis.

### DIAGNOSE

- **Plausible wrong answer:** The magnitude of acceleration should be inserted unchanged into both x and y equations.  
  **Separating diagnostic:** If a=(10 i + 4 j) m/s², should both component equations use a=√116?
- **Plausible wrong answer:** If one acceleration component is constant, the constant-acceleration equations are automatically valid on both axes.  
  **Separating diagnostic:** If a_x is constant but a_y changes with time, may the same constant-acceleration displacement formula be used exactly on y over the whole interval?
- **Plausible wrong answer:** A time found from the x equation may be replaced by a different convenient time in the y equation.  
  **Separating diagnostic:** If x-motion says an event occurs at t=3 s, what time belongs in the y equation for that same event?

### REPAIR

- No. Use a_x=10 only in the x equation and a_y=4 only in the y equation; the magnitude is not either component.
- No. Model validity is checked per axis. A constant a_x does not make a_y constant.
- Use t=3 s. Both components describe the same event and therefore share one clock.

### BOUNDARY TEST

**Prompt:** If a_y changes with time while a_x stays constant, may the constant-acceleration equations still be exact on both axes for the whole interval?

**Answer:** No. The x relation may remain exact, but the y constant-acceleration relation is not exact over that interval.

**Confirms:** Model validity is checked per component.

### MODEL RESPONSE / RUBRIC


**Rubric**
- Each axis uses only its own signed initial values and acceleration while sharing the same time. — evidence of: 2D component model use rather than a scalar-magnitude shortcut.
**Representative accepted responses**
- v_x=u_x+a_x t and v_y=u_y+a_y t with one t.
**Representative rejected responses**
- Use |a| in both equations or use separate unrelated times.

**Prediction defensible answer:** Only v_x changes; v_y remains constant.

</details>


---

## Select the gravity-only projectile model before using projectile consequences

**Canonical microtopic:** `MIC-PHY-KIN-PROJECTILE-MODEL`  
**Same inferential truth as Core1A:** After release in the ideal near-Earth model, projectile motion is not a new set of laws: it is the same component kinematics with a_x=0 and a_y=-g (for +y upward).

### PREDICT — attempt first

Immediately after a horizontal launch, which acceleration component is zero in the ideal model?

Write a committed answer before opening reconstruction.

### ATTEMPT — produce

A model declaration and component-equation setup for a horizontal or oblique projectile.

**Closure standard (kept after attempt):** RUBRIC

<details>
<summary>RECONSTRUCT / DIAGNOSE / REPAIR / BOUNDARY TEST — reveal only after attempting</summary>

### RECONSTRUCT

1. What forces remain after release in the idealized problem?  
   Why this ask: Elicits the gravity-only model.  
   Canonical step: `K2D3-1`
2. What are the horizontal and vertical component equations, and what clock do they share?  
   Why this ask: Rebuilds the projectile specialization from 2D constant acceleration.  
   Canonical step: `K2D3-2`
3. What exact component condition identifies the event the question asks about?  
   Why this ask: Separates model selection from event selection.  
   Canonical step: `K2D3-3`
4. If the event is the apex, what becomes zero and what definitely does not?  
   Why this ask: Protects against the common full-velocity/full-acceleration zero shortcut.  
   Canonical step: `K2D3-4`
5. Does launch height equal landing height? If not, which shortcut becomes invalid?  
   Why this ask: Makes the same-height boundary explicit.  
   Canonical step: `K2D3-5`

**A/B difference:** Teaching states the projectile specialization; reconstruction derives it from the post-release interaction model and coordinate choice.

### DIAGNOSE

- **Plausible wrong answer:** A projectile needs a horizontal force to keep moving horizontally.  
  **Separating diagnostic:** If a_x=0 after release, can v_x still be nonzero?
- **Plausible wrong answer:** A horizontal launch has no vertical velocity throughout the flight.  
  **Separating diagnostic:** One second after a horizontal launch, is v_y still zero under gravity?
- **Plausible wrong answer:** At the highest point the whole velocity and the acceleration are both zero.  
  **Separating diagnostic:** At the apex of an oblique projectile, which of v_x, v_y and a_y is zero?
- **Plausible wrong answer:** Same-height flight formulas may be used whenever the question is about a projectile range or flight time.  
  **Separating diagnostic:** A ball launched from a roof lands on the ground below. May the same-height time-of-flight shortcut be used without checking the vertical displacement?
- **Plausible wrong answer:** At two points of the same height on an ideal trajectory, the velocity vectors are identical.  
  **Separating diagnostic:** On ascent and descent at the same height, how do the horizontal and vertical velocity components compare?
- **Plausible wrong answer:** Horizontal speed determines how long a horizontally launched object takes to fall.  
  **Separating diagnostic:** If the horizontal launch speed doubles from the same height, does the ideal fall time change?

### REPAIR

- Yes. Zero horizontal acceleration means horizontal velocity stays constant, not that it becomes zero.
- No. u_y=0 only at release; a_y=-g makes v_y=-gt afterward.
- Only v_y is zero at that instant. v_x remains u_x and a_y remains -g.
- No. Same-height shortcuts require Delta y=0 between launch and landing. For unequal heights, solve the vertical position condition.
- v_x is the same, while v_y has equal magnitude and opposite sign; the speed matches but the velocity vector does not.
- No. The vertical position equation determines the fall time; horizontal speed changes the range, not the fall time.

### BOUNDARY TEST

**Prompt:** A launched object continues under significant horizontal thrust after release. May the standard a_x=0 projectile specialization be used?

**Answer:** No. The object is not in gravity-only free flight; its horizontal acceleration is not zero under that model.

**Confirms:** Projectile equations are conditional consequences of a declared force/model state.

### MODEL RESPONSE / RUBRIC


**Rubric**
- The learner selects gravity-only free flight, uses a_x=0/a_y=-g and one common time before calculating any named projectile quantity. — evidence of: Projectile model selection rather than formula recall.
**Representative accepted responses**
- State assumptions, set component accelerations, then solve x/y with one t.
**Representative rejected responses**
- Start from a memorized range/height formula without establishing the free-flight component model.

**Prediction defensible answer:** a_x is zero; a_y is -g if +y is upward.

</details>

