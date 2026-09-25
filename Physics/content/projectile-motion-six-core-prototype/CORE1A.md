# Core1A — Detailed teaching: Motion in 2D and the ideal projectile model

**Role:** declarative detailed teaching  
**Academic authority:** `Physics/library/phy-kin-2d-motion.v1.json`  
**Coverage:** exactly the three canonical microtopics; no demand-driven expansion  
**Intrinsic depth:** MEDIUM  
**Provenance:** CANONICAL_DERIVED  
**Learner estimate:** deliberately not used to alter coverage.

---

## 1. Independent components, one shared clock

**Canonical microtopic:** `MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS`  
**Primary capability:** `CAP-KIN-2D-INDEPENDENT-COMPONENTS`  
**Entry assumption:** you can read signed vector components in a declared x-y frame.

### Convention and inferential jump

Declare one fixed x-y frame, origin and time origin before reading signs. The canonical inferential jump is:

> Perpendicular components may be solved separately because each axis equation contains only that axis's quantities, but they still describe one object at one physical time.

### Construction

**K2D1-1 — Declare the frame.** Choose the origin, +x, +y and `t=0`. This is valid because a component sign has no meaning until a frame is fixed.

**K2D1-2 — Represent vectors by signed components.** Write position, velocity and acceleration as x/y components in that same frame. This is valid because perpendicular Cartesian components completely specify a plane vector once the frame is declared.

**K2D1-3 — Separate axis equations, not clocks.** Keep x quantities in the x description and y quantities in the y description, while using one elapsed time. This is valid because Cartesian component equations can evolve independently while still describing the same object over the same physical interval.

**K2D1-4 — Recombine simultaneous values only.** Form a plane state from x and y values that refer to the same frame and same instant. This is valid because x(t₁), y(t₂) with t₁≠t₂ never occurred as one simultaneous state.

### Representation bridge

**Canonical representation:** `REP-KIN-2D-SHARED-CLOCK`.

- Picture element: one physical object in one x-y frame.
- Symbol side: x(t), y(t), v_x(t), v_y(t), and a single `t`.
- Words: the histories are separate component descriptions, but the shared time marker says which samples may be recombined.
- Reverse bridge: if a drawn state is labelled at one time, both coordinate/component values must carry that time.

**Visual review state:** `VISUAL_HOLD`; see the semantic review rendering in `preview.html`.

### Canonical worked anchor

A tracker gives `x(t)=4t` m and `y(t)=10-2t²` m. At `t=2 s`:

[
x(2)=8	ext{ m},qquad y(2)=2	ext{ m}.
]

So the simultaneous position is `(8,2) m`. Pairing x(2) with y(3) is invalid as one position because the timestamps differ.

**Why this anchor matters:** the arithmetic is easy; the conceptual work is preserving event identity.

### Wrong path → diagnostic → repair

**Wrong path:** “Independent x and y motions may use different elapsed times.”

**Diagnostic:** At one instant 2 s after launch, may the x equation use t=2 s while the y equation uses another time?

**Repair:** No. Independence separates equations; it does not give the object two clocks. Attach the timestamp to every component before recombining.

### Independent checks

- Do both component values refer to the same frame?
- Do they carry the same time?
- If one component changes while the other remains constant, is that physically allowed? Yes; independence permits different component evolution.

### Exit task

A particle has `v_x=6 m/s` and `v_y=-8 m/s` at `t=3 s`. Explain what “independent components” means and what must remain shared.

**Model answer:** Solve the x and y component descriptions separately in the same declared frame, but both values describe the same particle at the same `t=3 s`. Recombine only simultaneous component values.

**Check:** same frame, same object, same instant.

**Demand boundary:** Q28 maps here, but its required differentiation of x(t), y(t) is an `UNTaught_CAPABILITY_GAP`; it does not add a calculus microtopic.

---

## 2. Constant acceleration component by component

**Canonical microtopic:** `MIC-PHY-KIN-2D-CONSTANT-ACCELERATION`  
**Primary capability:** `CAP-KIN-2D-CONSTANT-ACCELERATION`  
**Entry assumptions:** one-dimensional constant-acceleration reasoning is available; independent x/y components with one clock are available.

### Convention and inferential jump

Keep the same frame and common elapsed time. Check model validity **per axis**.

> The one-dimensional constant-acceleration equations can be applied to each perpendicular component independently when `a_x` and `a_y` are each constant over the same interval.

### Construction

**K2D2-1 — Check constancy separately.** Ask whether `a_x` is constant and whether `a_y` is constant on the interval. The one-dimensional kinematic equations are exact on an axis only when that axis's acceleration component is constant.

**K2D2-2 — Transfer the 1D model to each axis.**

[
v_x=u_x+a_xt,qquad v_y=u_y+a_yt
]

[
Delta x=u_xt+	frac12a_xt^2,qquad
Delta y=u_yt+	frac12a_yt^2.
]

Each equation contains only quantities from its own axis, but both use the same `t`.

**K2D2-3 — Let the event own the time.** If one axis gives `t_event`, reuse exactly that time on the other axis. This is valid because the physical event happens once.

### Representation bridge

**Canonical representations:** `REP-KIN-2D-SHARED-CLOCK` and `REP-KIN-2D-EVENT-CLOCK`.

The event-clock bridge is: physical event → component condition → one event-time marker → evaluate both component histories at that same time → reconstruct one event state.

**Visual review state:** `VISUAL_HOLD`.

### Canonical worked anchor

Given `u=(3i+4j) m/s`, `a=(2i-j) m/s²`, and `t=3 s`, both acceleration components are constant.

[
v_x=3+2(3)=9,qquad v_y=4-1(3)=1
]

[
Delta x=3(3)+	frac12(2)(3^2)=18,
]

[
Delta y=4(3)+	frac12(-1)(3^2)=7.5.
]

Thus `v=(9i+1j) m/s` and `Delta r=(18i+7.5j) m`.

### Wrong paths → diagnostics → repairs

**Wrong path:** put `|a|` into both component equations.  
**Diagnostic:** if `a=(10i+4j) m/s²`, should both axes use `sqrt{116}`?  
**Repair:** no; x uses `a_x=10`, y uses `a_y=4`.

**Wrong path:** one constant component makes the whole problem constant-acceleration.  
**Diagnostic:** if `a_x` is constant but `a_y` changes with time, are the constant-a displacement equations exact on y?  
**Repair:** no; validity is per component.

**Wrong path:** change time between axes for convenience.  
**Diagnostic:** if x identifies an event at 3 s, what time belongs in y for that event?  
**Repair:** 3 s.

### Independent checks

- Units: every term in a velocity equation has m/s; every term in a displacement equation has m.
- Set `a_x=0`: x reduces to uniform motion.
- Compare the event timestamps on x and y.
- If an acceleration component varies over the interval, do not use the constant-a equation on that axis as exact.

### Exit task

For `u=(0,5) m/s` and constant `a=(10,4) m/s²`, set up the position equations at common time t.

**Model answer:**

[
Delta x=0t+	frac12(10)t^2,qquad
Delta y=5t+	frac12(4)t^2.
]

**Check:** both expressions have length units; no x quantity appears in y or vice versa; the time symbol is the same.

**Demand boundary:** Q23 preserves this capability as its canonical primary because the real demand is noticing that the constant-acceleration model breaks under linear drag. The drag differential equation itself is an `UNTaught_CAPABILITY_GAP`, not Core1A teaching.

---

## 3. Select the gravity-only projectile model, then the event

**Canonical microtopic:** `MIC-PHY-KIN-PROJECTILE-MODEL`  
**Primary capability:** `CAP-KIN-PROJECTILE-MODEL`  
**Entry assumptions:** component constant-acceleration reasoning is available; if a launch angle must be resolved, vector decomposition is a separate prerequisite.

### Convention and inferential jump

Take +y upward for the displayed signs. Establish ideal free flight before using projectile equations.

> After release in the ideal near-Earth model, projectile motion is not a new set of laws: it is the same component kinematics with `a_x=0` and `a_y=-g`.

### Construction

**K2D3-1 — Select the model.** Ask what interactions remain after release. With gravity only, negligible air resistance and approximately constant g, set `a_x=0`, `a_y=-g`.

**K2D3-2 — Specialize the component equations.**

[
v_x=u_x,quad v_y=u_y-gt,quad
Delta x=u_xt,quad
Delta y=u_yt-	frac12gt^2.
]

Horizontal versus oblique launch changes initial components, not the governing gravity-only model.

**K2D3-3 — Select the event before solving.** “Apex”, “return to launch height”, and “lower-ground impact” are different conditions.

**K2D3-4 — Apex.** Set only `v_y=0`. Horizontal velocity may remain `u_x`; acceleration remains downward.

**K2D3-5 — Same-height return.** Set `Delta y=0` for the later event. A same-height shortcut is valid only because launch and landing heights are equal.

**K2D3-6 — Unequal-height landing.** Use the actual signed `Delta y=y_f-y_i` and actual `u_y`. A horizontal launch is merely the special initial condition `u_y=0`. Solve the vertical event time, then reuse it horizontally.

**K2D3-7 — Reconstruct the requested result.** At the selected event time, combine simultaneous components to obtain velocity, speed, direction, displacement, range or height, then run qualitative checks.

### Representation bridge

**Canonical representation:** `REP-KIN-2D-PROJECTILE-MODEL`.

Read the model gate as: launched object → post-release interaction inventory → gravity-only status → `a_x`/`a_y` readout → valid/invalid projectile specialization. A curved path by itself does not prove the projectile assumptions.

Use `REP-KIN-2D-EVENT-CLOCK` after the model is accepted to bind an apex/impact/return condition to one event time.

**Visual review state:** `VISUAL_HOLD`.

### Canonical worked anchor

For `u_x=12 m/s`, `u_y=20 m/s`, `g=10 m/s²` in ideal flight:

At the apex, `v_y=20-10t=0`, so `t=2 s`. Then

[
v=(12i+0j)	ext{ m/s},qquad a=(0i-10j)	ext{ m/s}^2,
]

and

[
Delta y=20(2)-	frac12(10)(2^2)=20	ext{ m}.
]

The projectile does not stop at the apex: only its vertical velocity component is zero.

### Wrong paths → diagnostics → repairs

**Horizontal force fallacy.** If `a_x=0`, can `v_x` be nonzero? Yes. Zero acceleration preserves velocity; it does not erase it.

**Horizontal-launch fallacy.** One second after a horizontal launch, is `v_y=0`? No. `u_y=0` only at release; gravity immediately changes `v_y`.

**Apex fallacy.** At the highest point, which of `v_x`, `v_y`, `a_y` is zero? Only `v_y` (for a nonvertical oblique projectile with nonzero `u_x`).

**Same-height shortcut fallacy.** From a roof to lower ground, may you use a same-height flight-time shortcut? No; use the actual signed vertical displacement.

**Equal-height vector fallacy.** At equal height on ascent/descent, `v_x` is the same and `v_y` has equal magnitude/opposite sign; speed can match while velocity vectors differ.

**Fall-time fallacy.** Doubling horizontal launch speed from the same height does not change the ideal fall time; the vertical event equation sets it.

### Independent checks

- Projectile specialization only after gravity-only free-flight assumptions are true.
- `v_x` remains constant in the standard ideal model.
- At the apex, `v_y=0` but `a_y=-g`.
- Same-height shortcuts require `Delta y=0`.
- Unequal-height impact uses the actual signed `Delta y`.
- Every reported event state uses one time across both axes.

### Exit task

A stone is launched horizontally with speed u. With +y upward and air resistance neglected, write its component acceleration, velocity and displacement relations after release and explain why one t is used.

**Model answer:**

[
a_x=0, a_y=-g;quad
v_x=u, v_y=-gt;quad
Delta x=ut, Delta y=-	frac12gt^2.
]

The same t appears because x and y describe the same stone at the same instant.

**Check:** horizontal velocity stays constant while downward speed magnitude grows.

### Fixed-demand boundary

- Q15: `IDENTITY_HOLD`; the energy-loss/restitution event is extension/upstream teaching.
- Q21: changed gravity after apex is `EXTENSION`.
- Q26: specified-point trajectory/slope method is `EXTENSION`.
- Q28's calculus step and Q23's drag model remain upstream gaps.

None of these demands creates a fourth Core1A microtopic.
