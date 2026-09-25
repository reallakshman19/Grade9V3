# Core1 — Projectile motion: standard model and modified-dynamics demand

**Role:** compact semantic orientation  
**Authority:** `Physics/library/phy-kin-2d-motion.v1.json` only  
**Repository basis:** `main@dd1fb0ca8374a398ea48aa3253a5d37ed0d62739`  
**Status:** structurally assembled from canonical truth; academic package status is `CANDIDATE`; not publication-ready.

## Scope

Independent perpendicular component motion in one frame, constant-acceleration component equations with common time, and the ideal near-Earth projectile specialization for horizontal and oblique launch questions.

### Deliberately excluded or held outside this Core

- Calculus-based differentiation of a time-dependent position vector.
- Derivation or memorization of a large catalogue of range/height/time-of-flight formulas as separate capabilities.
- Trajectory-equation derivation as a first-slice requirement.
- Air drag, Coriolis effects, variable gravity, target-on-incline projectile geometry and other advanced variants.

The five owner assessment anchors are **demand evidence**, not curriculum authority. Calculus differentiation, impact-energy/restitution machinery, changed-gravity staging, trajectory-equation geometry and linear drag therefore do not become Core1 concepts.

## Objects, quantities and conventions

- **CONV-KIN-2D-AXES:** Use one declared non-rotating x-y frame for the whole event; both component equations use the same elapsed time.
- **CONV-PROJ-UP-POSITIVE:** When +y is chosen upward, the ideal projectile model uses a_x=0 and a_y=-g after release.

The canonical capabilities are:

- `CAP-KIN-2D-INDEPENDENT-COMPONENTS` — prerequisite refs: `CAP-VECTOR-SIGNED-COMPONENT`
- `CAP-KIN-2D-CONSTANT-ACCELERATION` — prerequisite refs: `CAP-KIN-2D-INDEPENDENT-COMPONENTS`, `CAP-KIN-CONSTANT-ACCELERATION`
- `CAP-KIN-PROJECTILE-MODEL` — prerequisite refs: `CAP-KIN-2D-CONSTANT-ACCELERATION`

## Canonical representation

Primary representation: `REP-KIN-2D-SHARED-CLOCK`.

Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.

**Picture ↔ symbol ↔ words**

- **x-component history** ↔ `v_x` ↔ The horizontal velocity component at the shared physical time.
- **y-component history** ↔ `v_y` ↔ The vertical velocity component at the same shared physical time.
- **shared time marker** ↔ `t` ↔ The one elapsed time used by both component descriptions.

A bound canonical scene exists for this shared-clock representation. Event-clock and projectile-model representations are academically named but currently have no bound scene instance, so learner rendering for those is `VISUAL_HOLD` rather than invented geometry.

## Governing relations

### REL-KIN-2D-VELOCITY

`v_x = u_x + a_x t; v_y = u_y + a_y t`

**Meaning:** Each perpendicular velocity component follows the 1D constant-acceleration relation over one common interval.

**Conditions**
- a_x and a_y are constant over the interval.
- Both component equations use the same elapsed time and frame.

**Independent checks**
- Units match velocity on both equations.
- If a_x=0 then v_x stays constant; likewise for y.

### REL-KIN-2D-DISPLACEMENT

`Delta x = u_x t + 0.5 a_x t^2; Delta y = u_y t + 0.5 a_y t^2`

**Meaning:** Each perpendicular displacement component follows the 1D constant-acceleration displacement relation over one common interval.

**Conditions**
- a_x and a_y are constant over the interval.
- Both component equations use the same elapsed time and frame.

**Independent checks**
- Every term has length units.
- Setting one acceleration component to zero reduces that axis to uniform motion.

### REL-PROJECTILE-COMPONENT-MODEL

`a_x = 0; a_y = -g; v_x = u_x; v_y = u_y - g t; Delta x = u_x t; Delta y = u_y t - 0.5 g t^2`

**Meaning:** With +y upward, air resistance neglected and near-Earth constant g, projectile motion is 2D constant acceleration specialized to zero horizontal and downward vertical acceleration.

**Conditions**
- Near-Earth region with approximately constant g.
- Air resistance neglected.
- +y is declared upward for the displayed signs.
- The object is in free flight after release.

**Independent checks**
- v_x is constant.
- At the highest point of an oblique trajectory, v_y=0 but a_y remains -g.
- Both component equations use the same t.


## Compact canonical anchor

The shared-clock representation carries two governed author-created datums: `t_same=2 s` and `t_mixed=3 s`. Their purpose is not a new physics example; they witness the rule that x and y samples may be recombined only when they refer to the same instant.

## Hard transitions

- **Split one plane-motion event into independent x/y components with one clock** (`MEDIUM`): Perpendicular components may be solved separately because each axis equation contains only that axis's quantities, but they still describe one object at one physical time.  
  Why it is difficult: Learners often interpret independent components as unrelated motions and accidentally use different times or mix x and y quantities.  
  Deeper construction: Core1A. Learner reconstruction: Core1B.
- **Apply constant-acceleration kinematics component by component** (`MEDIUM`): The one-dimensional constant-acceleration equations can be applied to each perpendicular component independently when a_x and a_y are each constant over the same interval.  
  Why it is difficult: The formulas are familiar from 1D, but the challenge is selecting the right component equation on each axis and enforcing one common time.  
  Deeper construction: Core1A. Learner reconstruction: Core1B.
- **Select the gravity-only projectile model before using projectile consequences** (`MEDIUM`): After release in the ideal near-Earth model, projectile motion is not a new set of laws: it is the same component kinematics with a_x=0 and a_y=-g (for +y upward).  
  Why it is difficult: Projectile formulas become brittle when the learner skips the model decision, mixes times, or treats horizontal velocity as requiring a continuing horizontal force.  
  Deeper construction: Core1A. Learner reconstruction: Core1B.

## Orientation closure

Before choosing any projectile equation, be able to answer all three:

1. What frame/sign convention am I using?
2. Does each acceleration component satisfy the model I am about to use over the interval?
3. What physical event determines the one shared time at which I will reconstruct the requested state?

**Check:** if a proposed method uses different times for x and y at one event, sets all velocity/acceleration to zero at an apex, or keeps using the standard projectile specialization after a model condition is broken, it has crossed a canonical boundary.
