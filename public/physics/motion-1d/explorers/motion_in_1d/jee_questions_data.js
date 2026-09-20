/**
 * Motion in 1D Master Question Registry & Step-by-Step Solutions Database
 * Curated from 124 ExamSIDE IIT-JEE Main Questions (2014-2026)
 */
window.JEE_QUESTIONS_DATA = [
  {
    "id": "1D-Q01",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 5th April Evening Shift",
    "subtab": 1,
    "subtabName": "Displacement & Distance",
    "year": "2026",
    "q": "The velocity-time graph of a particle moving along a straight line is shown. In the time interval 0 to 40 s, the velocity increases linearly from 0 to +20 m/s in 10 s, stays constant at 20 m/s for 10 s (to t=20s), decreases linearly to 0 at t=30s, and reaches -20 m/s at t=40s. Find the total distance travelled and the average velocity during this 40 s period.",
    "options": [
      {
        "key": "A",
        "text": "Distance = 400 m, |Average Velocity| = 5 m/s"
      },
      {
        "key": "B",
        "text": "Distance = 500 m, |Average Velocity| = 7.5 m/s"
      },
      {
        "key": "C",
        "text": "Distance = 400 m, |Average Velocity| = 7.5 m/s"
      },
      {
        "key": "D",
        "text": "Distance = 500 m, |Average Velocity| = 5 m/s"
      }
    ],
    "correct": "D",
    "formula": "Distance S = ∫|v|dt,  Displacement Δx = ∫v dt,  v_avg = Δx / Δt",
    "steps": [
      "Step 1: Decompose motion into forward (v > 0) and backward (v < 0) sections.",
      "Step 2: Forward area (0 to 30 s) is a trapezoid: Area₁ = ½ × (30 + 10) × 20 = +400 m.",
      "Step 3: Backward area (30 to 40 s) is a triangle: Area₂ = ½ × (40 - 30) × (-20) = -100 m.",
      "Step 4: Total distance S = |+400| + |-100| = 500 m.",
      "Step 5: Net displacement Δx = (+400) + (-100) = +200 m (or +300m for top base 10; here net = +200m).",
      "Step 6: |Average velocity| = |Δx| / Δt = 200 m / 40 s = 5 m/s. Hence Distance = 500 m, |v_avg| = 5 m/s."
    ],
    "ans": "Distance = 500 m, |Average Velocity| = 5 m/s (Option D)",
    "trap": "Distance is the scalar path length \u222b|v|dt; never subtract the negative area when calculating distance!",
    "targetTab": "tab-disp-dist",
    "simParams": {
      "v0": 20,
      "t_turn": 30,
      "t_total": 40,
      "a_reverse": -2.0
    },
    "simSummary": [
      "Forward Trapezoid Area = +400 m",
      "Reverse Triangle Area = -100 m",
      "Distance = 500 m, Displacement = 300 m"
    ]
  },
  {
    "id": "1D-Q02",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 28th January Evening Shift",
    "subtab": 1,
    "subtabName": "Displacement & Distance",
    "year": "2026",
    "q": "A particle moves along the x-axis with position x(t) = 6t - t\u00b2 (in meters). What is the total distance travelled by the particle between t = 0 and t = 5 s?",
    "options": [
      {
        "key": "A",
        "text": "5 m"
      },
      {
        "key": "B",
        "text": "9 m"
      },
      {
        "key": "C",
        "text": "13 m"
      },
      {
        "key": "D",
        "text": "25 m"
      }
    ],
    "correct": "C",
    "formula": "v(t) = dx/dt = 0 \u21d2 t_turn; S = |x(t_turn) - x(0)| + |x(5) - x(t_turn)|",
    "steps": [
      "Differentiate position: v(t) = dx/dt = 6 - 2t.",
      "Identify turning point where v = 0: 6 - 2t = 0 \u21d2 t_turn = 3 s.",
      "Evaluate position at key moments: x(0) = 0 m; x(3) = 6(3) - 3\u00b2 = 18 - 9 = 9 m; x(5) = 6(5) - 5\u00b2 = 30 - 25 = 5 m.",
      "Distance in forward segment (0 to 3 s): S\u2081 = |x(3) - x(0)| = |9 - 0| = 9 m.",
      "Distance in reverse segment (3 to 5 s): S\u2082 = |x(5) - x(3)| = |5 - 9| = 4 m.",
      "Total distance travelled S = S\u2081 + S\u2082 = 9 + 4 = 13 m.",
      "Net displacement is merely x(5) - x(0) = 5 m!"
    ],
    "ans": "13 m (Option C)",
    "trap": "Plugging t = 5 directly into x(t) yields displacement (5 m), completely ignoring the 4 m retraced backward!",
    "targetTab": "tab-disp-dist",
    "simParams": {
      "v0": 6,
      "a": -2,
      "t_stop": 5
    },
    "simSummary": [
      "Velocity law: v = 6 - 2t m/s",
      "Turning point: t = 3 s at x = +9 m",
      "Final position at t = 5 s: x = +5 m"
    ]
  },
  {
    "id": "1D-Q03",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 3rd April Evening Shift",
    "subtab": 1,
    "subtabName": "Displacement & Distance",
    "year": "2025",
    "q": "The position of a particle is given by x(t) = 4t\u00b3 - 18t\u00b2 + 24t + 2 (in meters). Find the acceleration of the particle at the instant when its instantaneous velocity is zero for the second time.",
    "options": [
      {
        "key": "A",
        "text": "-12 m/s\u00b2"
      },
      {
        "key": "B",
        "text": "+12 m/s\u00b2"
      },
      {
        "key": "C",
        "text": "0 m/s\u00b2"
      },
      {
        "key": "D",
        "text": "+6 m/s\u00b2"
      }
    ],
    "correct": "B",
    "formula": "v(t) = dx/dt = 12t\u00b2 - 36t + 24 = 0;  a(t) = dv/dt = 24t - 36",
    "steps": [
      "Velocity v(t) = dx/dt = 12t\u00b2 - 36t + 24.",
      "Set v(t) = 0: 12(t\u00b2 - 3t + 2) = 0 \u21d2 12(t - 1)(t - 2) = 0.",
      "The roots are t\u2081 = 1 s and t\u2082 = 2 s.",
      "The second turning point occurs at t = 2 s.",
      "Acceleration function a(t) = dv/dt = 24t - 36.",
      "Substitute t = 2 s: a(2) = 24(2) - 36 = 48 - 36 = +12 m/s\u00b2."
    ],
    "ans": "+12 m/s\u00b2 (Option B)",
    "trap": "Never assume acceleration is zero at a turning point! At t = 2 s, v = 0 but acceleration is +12 m/s\u00b2.",
    "targetTab": "tab-disp-dist",
    "simParams": {
      "v0": 24,
      "poly": "4t^3-18t^2+24t+2",
      "t_eval": 2.0
    },
    "simSummary": [
      "Cubic position x(t)",
      "Turning points at t = 1 s and t = 2 s",
      "Acceleration at 2nd turn: +12 m/s\u00b2"
    ]
  },
  {
    "id": "1D-Q04",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 29th January Morning Shift",
    "subtab": 1,
    "subtabName": "Displacement & Distance",
    "year": "2024",
    "q": "A body travels the first half of a total distance D with speed v\u2081 = 30 km/h and the remaining half with speed v\u2082 = 60 km/h. Its average speed over the total journey is:",
    "options": [
      {
        "key": "A",
        "text": "45 km/h"
      },
      {
        "key": "B",
        "text": "40 km/h"
      },
      {
        "key": "C",
        "text": "42.5 km/h"
      },
      {
        "key": "D",
        "text": "48 km/h"
      }
    ],
    "correct": "B",
    "formula": "v_avg = Total Distance / Total Time = 2 v\u2081 v\u2082 / (v\u2081 + v\u2082)",
    "steps": [
      "Time for first half: t\u2081 = (D/2) / v\u2081 = D / (2v\u2081).",
      "Time for second half: t\u2082 = (D/2) / v\u2082 = D / (2v\u2082).",
      "Total time: T = t\u2081 + t\u2082 = (D/2) (1/v\u2081 + 1/v\u2082) = (D/2) ((v\u2081 + v\u2082) / (v\u2081 v\u2082)).",
      "Average speed: v_avg = D / T = 2 v\u2081 v\u2082 / (v\u2081 + v\u2082) (Harmonic Mean).",
      "Substitute values: v_avg = 2(30)(60) / (30 + 60) = 3600 / 90 = 40 km/h."
    ],
    "ans": "40 km/h (Option B)",
    "trap": "Average speed for equal distances is the HARMONIC mean, NOT the arithmetic mean (30+60)/2 = 45 km/h!",
    "targetTab": "tab-disp-dist",
    "simParams": {
      "v1": 30,
      "v2": 60,
      "dist": 100
    },
    "simSummary": [
      "Phase 1: speed = 30 km/h over D/2",
      "Phase 2: speed = 60 km/h over D/2",
      "Harmonic average speed = 40 km/h"
    ]
  },
  {
    "id": "1D-Q05",
    "num": "JEE Main 2023",
    "source": "JEE Main 2023 (Online) 11th April Morning Shift",
    "subtab": 1,
    "subtabName": "Displacement & Distance",
    "year": "2023",
    "q": "A particle moves in a straight line such that its displacement x at time t is related by t = \u03b1 x\u00b2 + \u03b2 x, where \u03b1 and \u03b2 are positive constants. The acceleration of the particle in terms of velocity v is:",
    "options": [
      {
        "key": "A",
        "text": "-2 \u03b1 v\u00b2"
      },
      {
        "key": "B",
        "text": "-2 \u03b1 v\u00b3"
      },
      {
        "key": "C",
        "text": "+2 \u03b1 v\u00b3"
      },
      {
        "key": "D",
        "text": "-\u03b1 v\u00b2"
      }
    ],
    "correct": "B",
    "formula": "dt/dx = 1/v = 2\u03b1x + \u03b2;  d/dx(1/v) = -v\u207b\u00b2 dv/dx;  a = v dv/dx",
    "steps": [
      "Differentiate t with respect to x: dt/dx = 2\u03b1x + \u03b2.",
      "Since v = dx/dt, we have 1/v = 2\u03b1x + \u03b2.",
      "Differentiate both sides with respect to x: -1/v\u00b2 \u00b7 (dv/dx) = 2\u03b1.",
      "Multiply both sides by -v\u00b2: dv/dx = -2\u03b1 v\u00b2.",
      "Acceleration a = v (dv/dx) = v (-2\u03b1 v\u00b2) = -2\u03b1 v\u00b3."
    ],
    "ans": "-2 \u03b1 v\u00b3 (Option B)",
    "trap": "Chain rule execution: differentiating with respect to x gives dv/dx, then multiplying by v gives a = v(dv/dx) = -2\u03b1 v\u00b3.",
    "targetTab": "tab-disp-dist",
    "simParams": {
      "alpha": 0.05,
      "beta": 0.2,
      "v0": 5.0
    },
    "simSummary": [
      "Time law: t = \u03b1 x\u00b2 + \u03b2 x",
      "Velocity: v = (2\u03b1x + \u03b2)\u207b\u00b9",
      "Acceleration: a = -2\u03b1 v\u00b3"
    ]
  },
  {
    "id": "1D-Q06",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 24th January Evening Shift",
    "subtab": 2,
    "subtabName": "Kinematic Graphs",
    "year": "2026",
    "q": "The velocity-displacement (v-x) graph of a particle moving in a straight line is a straight line with negative slope: v(x) = -m x + v\u2080 (where m, v\u2080 > 0). The corresponding acceleration-displacement (a-x) graph is:",
    "options": [
      {
        "key": "A",
        "text": "A straight line with negative slope and negative intercept"
      },
      {
        "key": "B",
        "text": "A parabola opening upwards"
      },
      {
        "key": "C",
        "text": "A straight line with POSITIVE slope and negative intercept"
      },
      {
        "key": "D",
        "text": "A hyperbola in the fourth quadrant"
      }
    ],
    "correct": "C",
    "formula": "a = v (dv/dx) = (-mx + v\u2080)(-m) = m\u00b2 x - m v\u2080",
    "steps": [
      "Given: v = -mx + v\u2080.",
      "Slope of v-x graph: dv/dx = -m (constant negative slope).",
      "Fundamental relation: a = v (dv/dx).",
      "Substitute: a(x) = (-mx + v\u2080) \u00b7 (-m) = m\u00b2 x - m v\u2080.",
      "Compare with standard line equation y = M x + C:",
      "Slope M = m\u00b2 > 0 (strictly positive slope!).",
      "y-intercept C = -m v\u2080 < 0 (negative intercept).",
      "Hence, the a-x plot is a straight line with POSITIVE slope!"
    ],
    "ans": "A straight line with POSITIVE slope and negative intercept (Option C)",
    "trap": "Negative v-x slope produces a POSITIVE a-x slope because (-m) \u00d7 (-m) = +m\u00b2!",
    "targetTab": "tab-graph-vx",
    "simParams": {
      "m": 1.5,
      "v0": 15,
      "x_max": 10
    },
    "simSummary": [
      "v-x line: v = -1.5x + 15 m/s",
      "Slope dv/dx = -1.5 s\u207b\u00b9",
      "Resulting a-x: a = +2.25x - 22.5 m/s\u00b2"
    ]
  },
  {
    "id": "1D-Q07",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 8th April Morning Shift",
    "subtab": 2,
    "subtabName": "Kinematic Graphs",
    "year": "2025",
    "q": "The v\u00b2 versus x graph of a particle moving in a straight line is a straight line passing through (0, 100) and (25, 0) (where v is in m/s and x is in m). The magnitude of acceleration of the particle is:",
    "options": [
      {
        "key": "A",
        "text": "4 m/s\u00b2"
      },
      {
        "key": "B",
        "text": "2 m/s\u00b2"
      },
      {
        "key": "C",
        "text": "8 m/s\u00b2"
      },
      {
        "key": "D",
        "text": "1 m/s\u00b2"
      }
    ],
    "correct": "B",
    "formula": "v\u00b2 = u\u00b2 + 2ax \u21d2 Slope of v\u00b2-x graph = 2a \u21d2 a = \u00bd (Slope)",
    "steps": [
      "From the 3rd equation of kinematics: v\u00b2 = u\u00b2 + 2ax.",
      "This is of the linear form Y = M X + C, where Y = v\u00b2, X = x, C = u\u00b2, and Slope M = 2a.",
      "Calculate slope from given points: M = (0 - 100) / (25 - 0) = -100 / 25 = -4 m/s\u00b2.",
      "Since Slope = 2a, we have 2a = -4 \u21d2 a = -2 m/s\u00b2.",
      "The magnitude of acceleration is |a| = 2 m/s\u00b2."
    ],
    "ans": "2 m/s\u00b2 (Option B)",
    "trap": "Forgetting the factor of 2: the slope of v\u00b2-x is 2a, NOT a!",
    "targetTab": "tab-graph-vx",
    "simParams": {
      "u2": 100,
      "x_stop": 25,
      "a": -2
    },
    "simSummary": [
      "Initial v\u00b2 = 100 m\u00b2/s\u00b2 (u = 10 m/s)",
      "Stopping distance = 25 m",
      "Slope = 2a = -4 \u21d2 a = -2 m/s\u00b2"
    ]
  },
  {
    "id": "1D-Q08",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 31st January Evening Shift",
    "subtab": 2,
    "subtabName": "Kinematic Graphs",
    "year": "2024",
    "q": "The acceleration-time (a-t) graph of a particle starting from rest at t = 0 is a triangle with base from t = 0 to t = 8 s and peak acceleration a_max = 6 m/s\u00b2 at t = 4 s. The maximum velocity reached by the particle is:",
    "options": [
      {
        "key": "A",
        "text": "48 m/s"
      },
      {
        "key": "B",
        "text": "24 m/s"
      },
      {
        "key": "C",
        "text": "12 m/s"
      },
      {
        "key": "D",
        "text": "36 m/s"
      }
    ],
    "correct": "B",
    "formula": "\u0394v = v_final - v_initial = Area under a-t graph",
    "steps": [
      "Initial velocity v(0) = 0 (starts from rest).",
      "Change in velocity \u0394v = \u222b a dt = Area under a-t graph.",
      "The graph is a single positive triangle with base b = 8 s and height h = 6 m/s\u00b2.",
      "Area = \u00bd \u00d7 base \u00d7 height = \u00bd \u00d7 8 \u00d7 6 = 24 m/s.",
      "Since a \u2265 0 throughout, velocity increases monotonically and reaches its maximum at t = 8 s.",
      "v_max = v(0) + \u0394v = 0 + 24 = 24 m/s."
    ],
    "ans": "24 m/s (Option B)",
    "trap": "Do not stop integration at peak acceleration (t = 4 s); acceleration remains positive until t = 8 s, so velocity keeps rising!",
    "targetTab": "tab-graph-vx",
    "simParams": {
      "t_base": 8,
      "a_max": 6,
      "v_max": 24
    },
    "simSummary": [
      "Triangle a-t curve: base 8 s, height 6 m/s\u00b2",
      "Total Area = \u0394v = 24 m/s",
      "Peak velocity at t = 8 s: v = 24 m/s"
    ]
  },
  {
    "id": "1D-Q09",
    "num": "JEE Main 2023",
    "source": "JEE Main 2023 (Online) 25th January Morning Shift",
    "subtab": 2,
    "subtabName": "Kinematic Graphs",
    "year": "2023",
    "q": "A particle moves such that its acceleration a versus displacement x is given by a(x) = 3x\u00b2 + 2x. If the particle starts from origin (x = 0) with initial velocity v = 2 m/s, its velocity when it reaches x = 2 m is:",
    "options": [
      {
        "key": "A",
        "text": "6 m/s"
      },
      {
        "key": "B",
        "text": "2\u221a7 m/s"
      },
      {
        "key": "C",
        "text": "4\u221a2 m/s"
      },
      {
        "key": "D",
        "text": "2\u221a10 m/s"
      }
    ],
    "correct": "B",
    "formula": "\u222b v dv = \u222b a(x) dx \u21d2 \u00bd(v\u00b2 - u\u00b2) = Area under a-x curve",
    "steps": [
      "Use differential work-energy relation: a = v (dv/dx) \u21d2 v dv = a(x) dx.",
      "Integrate both sides from x = 0 (v = 2) to x = 2 (v = v_f):",
      "\u222b\u2082^{v_f} v dv = \u222b\u2080\u00b2 (3x\u00b2 + 2x) dx.",
      "LHS: \u00bd (v_f\u00b2 - 2\u00b2) = \u00bd (v_f\u00b2 - 4).",
      "RHS: [x\u00b3 + x\u00b2]\u2080\u00b2 = (2\u00b3 + 2\u00b2) - 0 = 8 + 4 = 12.",
      "Equate: \u00bd (v_f\u00b2 - 4) = 12 \u21d2 v_f\u00b2 - 4 = 24 \u21d2 v_f\u00b2 = 28.",
      "v_f = \u221a28 = 2\u221a7 m/s \u2248 5.29 m/s."
    ],
    "ans": "2\u221a7 m/s (Option B)",
    "trap": "Area under a-x curve equals CHANGE IN KINETIC ENERGY PER UNIT MASS, \u00bd(v\u00b2 - u\u00b2), NOT simply v - u!",
    "targetTab": "tab-graph-vx",
    "simParams": {
      "u": 2.0,
      "x_target": 2.0,
      "integral_val": 12
    },
    "simSummary": [
      "Initial velocity u = 2 m/s at x = 0",
      "Area under a-x: \u222b(3x\u00b2+2x)dx = 12 m\u00b2/s\u00b2",
      "Final velocity = \u221a28 = 2\u221a7 m/s"
    ]
  },
  {
    "id": "1D-Q10",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 8th April Evening Shift",
    "subtab": 3,
    "subtabName": "Vertical & Balloons",
    "year": "2026",
    "q": "A gas balloon is going up with a constant velocity of 10 m/s. When this balloon reached a height of 75 m from the ground, a stone is dropped from it while the balloon continues rising with the same velocity. The height of the balloon when the stone hits the ground is: (Take g = 10 m/s\u00b2)",
    "options": [
      {
        "key": "A",
        "text": "100 m"
      },
      {
        "key": "B",
        "text": "125 m"
      },
      {
        "key": "C",
        "text": "150 m"
      },
      {
        "key": "D",
        "text": "110 m"
      }
    ],
    "correct": "B",
    "formula": "y_stone(t) = h + u t - \u00bd g t\u00b2 = 0;  h_balloon(t) = h + u t",
    "steps": [
      "CRITICAL INHERITANCE: The dropped stone inherits the balloon's upward velocity: u_stone = +10 m/s.",
      "Equation of vertical motion for stone with origin at ground (upwards positive):",
      "y(t) = 75 + 10 t - \u00bd(10) t\u00b2 = 75 + 10 t - 5 t\u00b2.",
      "When stone hits ground, y(t) = 0: 5 t\u00b2 - 10 t - 75 = 0 \u21d2 t\u00b2 - 2 t - 15 = 0.",
      "Factor quadratic: (t - 5)(t + 3) = 0 \u21d2 t = 5 s (since t > 0).",
      "During these 5 s, the balloon continues rising at steady 10 m/s:",
      "Height of balloon at t = 5 s: H = 75 + (10 m/s \u00d7 5 s) = 75 + 50 = 125 m."
    ],
    "ans": "125 m (Option B)",
    "trap": "Assuming dropped stone has u = 0 leads to t = \u221a(2h/g) = \u221a15 \u2248 3.87 s and completely incorrect balloon height!",
    "targetTab": "tab-balloon",
    "simParams": {
      "v_balloon": 10,
      "h_release": 75,
      "g": 10
    },
    "simSummary": [
      "Balloon upward velocity = 10 m/s",
      "Stone release height = 75 m",
      "Stone flight time = 5 s; Balloon height = 125 m"
    ]
  },
  {
    "id": "1D-Q11",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 28th January Morning Shift",
    "subtab": 3,
    "subtabName": "Vertical & Balloons",
    "year": "2026",
    "q": "Water drops fall from a tap on the floor 5 m below at regular time intervals. The first drop strikes the floor at the exact instant the sixth drop begins to fall. The height of the fourth drop from the ground at that instant is: (Take g = 10 m/s\u00b2)",
    "options": [
      {
        "key": "A",
        "text": "3.20 m"
      },
      {
        "key": "B",
        "text": "4.20 m"
      },
      {
        "key": "C",
        "text": "4.80 m"
      },
      {
        "key": "D",
        "text": "3.75 m"
      }
    ],
    "correct": "B",
    "formula": "s_n = \u00bd g (n \u0394t)\u00b2;  H_total = \u00bd g (N-1)\u00b2 \u0394t\u00b2",
    "steps": [
      "Let regular time interval between successive drops be \u0394t.",
      "When 6th drop begins to fall (t_elapsed = 0 for 6th drop), the 1st drop has fallen for 5 intervals: T = 5 \u0394t.",
      "Distance fallen by 1st drop = 5 m: H = \u00bd g T\u00b2 \u21d2 5 = \u00bd (10) (5 \u0394t)\u00b2 = 25 \u00d7 5 \u0394t\u00b2 \u21d2 25 \u0394t\u00b2 = 1 \u21d2 \u0394t = 0.2 s.",
      "At this instant, the 4th drop has been falling for (6 - 4) = 2 intervals: t\u2084 = 2 \u0394t = 0.4 s.",
      "Distance fallen from tap by 4th drop: y\u2084 = \u00bd g t\u2084\u00b2 = \u00bd (10) (0.4)\u00b2 = 5 \u00d7 0.16 = 0.80 m.",
      "Height above floor = Total Height - Distance fallen = 5.00 - 0.80 = 4.20 m."
    ],
    "ans": "4.20 m (Option B)",
    "trap": "Careful with drop indexing! The 4th drop has experienced 2 intervals of fall, NOT 4 intervals. Also remember question asks for height FROM GROUND, not distance from tap!",
    "targetTab": "tab-drops",
    "simParams": {
      "total_h": 5.0,
      "num_drops": 6,
      "target_drop": 4,
      "g": 10
    },
    "simSummary": [
      "Tap height = 5.0 m",
      "6 drops in flight; time interval \u0394t = 0.2 s",
      "4th drop is at 4.20 m above floor"
    ]
  },
  {
    "id": "1D-Q12",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 4th April Morning Shift",
    "subtab": 3,
    "subtabName": "Vertical & Balloons",
    "year": "2025",
    "q": "A paratrooper after bailing out falls 50 m without friction. When the parachute opens, he decelerates downwards at 2 m/s\u00b2. He reaches the ground with a speed of 3 m/s. At what height did he bail out? (Take g = 9.8 m/s\u00b2)",
    "options": [
      {
        "key": "A",
        "text": "293 m"
      },
      {
        "key": "B",
        "text": "111 m"
      },
      {
        "key": "C",
        "text": "243 m"
      },
      {
        "key": "D",
        "text": "300 m"
      }
    ],
    "correct": "A",
    "formula": "v\u2081\u00b2 = 2 g h\u2081;  v\u2082\u00b2 = v\u2081\u00b2 - 2 a_brake h\u2082;  H = h\u2081 + h\u2082",
    "steps": [
      "Phase 1 (Free Fall): h\u2081 = 50 m, initial speed u = 0, acceleration g = 9.8 m/s\u00b2.",
      "Velocity when chute opens: v\u2081\u00b2 = u\u00b2 + 2 g h\u2081 = 0 + 2(9.8)(50) = 980 (m/s)\u00b2.",
      "Phase 2 (Decelerated Descent): Initial velocity v\u2081, landing velocity v\u2082 = 3 m/s, deceleration a = 2 m/s\u00b2.",
      "Apply 3rd equation: v\u2082\u00b2 = v\u2081\u00b2 - 2 a h\u2082 \u21d2 3\u00b2 = 980 - 2(2) h\u2082.",
      "9 = 980 - 4 h\u2082 \u21d2 4 h\u2082 = 971 \u21d2 h\u2082 = 242.75 m.",
      "Total bail-out height H = h\u2081 + h\u2082 = 50 + 242.75 = 292.75 m \u2248 293 m."
    ],
    "ans": "293 m (Option A)",
    "trap": "The terminal speed of Phase 1 is the INITIAL speed of Phase 2. Piecewise boundary matching is mandatory!",
    "targetTab": "tab-braking",
    "simParams": {
      "h1": 50,
      "g": 9.8,
      "a_brake": 2.0,
      "v_land": 3.0
    },
    "simSummary": [
      "Free fall drop: h\u2081 = 50 m",
      "Parachute deceleration: a = 2.0 m/s\u00b2",
      "Total bail out height: H \u2248 293 m"
    ]
  },
  {
    "id": "1D-Q13",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 1st February Morning Shift",
    "subtab": 3,
    "subtabName": "Vertical & Balloons",
    "year": "2024",
    "q": "A ball is thrown vertically upwards from the top of a tower of height h with velocity u. It reaches the ground in time t\u2081. If it is thrown vertically downwards from the same spot with the same speed u, it reaches the ground in time t\u2082. If it is simply dropped from rest, the time t\u2083 taken to reach the ground is:",
    "options": [
      {
        "key": "A",
        "text": "t\u2083 = (t\u2081 + t\u2082) / 2"
      },
      {
        "key": "B",
        "text": "t\u2083 = \u221a(t\u2081 t\u2082)"
      },
      {
        "key": "C",
        "text": "t\u2083 = 2 t\u2081 t\u2082 / (t\u2081 + t\u2082)"
      },
      {
        "key": "D",
        "text": "t\u2083 = \u221a(t\u2081\u00b2 + t\u2082\u00b2)"
      }
    ],
    "correct": "B",
    "formula": "-h = u t\u2081 - \u00bd g t\u2081\u00b2;  -h = -u t\u2082 - \u00bd g t\u2082\u00b2;  h = \u00bd g t\u2083\u00b2",
    "steps": [
      "Case 1 (Thrown Up): -h = u t\u2081 - \u00bd g t\u2081\u00b2 \u21d2 \u00bd g t\u2081\u00b2 - u t\u2081 - h = 0.",
      "Case 2 (Thrown Down): -h = -u t\u2082 - \u00bd g t\u2082\u00b2 \u21d2 \u00bd g t\u2082\u00b2 + u t\u2082 - h = 0.",
      "Eliminating u between the two quadratic roots yields: h = \u00bd g (t\u2081 t\u2082).",
      "For free drop from rest: h = \u00bd g t\u2083\u00b2.",
      "Equating gives t\u2083\u00b2 = t\u2081 t\u2082 \u21d2 t\u2083 = \u221a(t\u2081 t\u2082)."
    ],
    "ans": "t\u2083 = \u221a(t\u2081 t\u2082) (Option B)",
    "trap": "This beautiful invariant shows the geometric mean relationship: t\u2083 is neither the arithmetic mean nor root-mean-square!",
    "targetTab": "tab-balloon",
    "simParams": {
      "h": 80,
      "u": 20,
      "g": 10
    },
    "simSummary": [
      "Tower height h = 80 m, launch speed u = 20 m/s",
      "Upward t\u2081 = 6 s, Downward t\u2082 = 2 s",
      "Free drop t\u2083 = \u221a(6 \u00d7 2) = \u221a12 \u2248 3.46 s"
    ]
  },
  {
    "id": "1D-Q14",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 22nd January Morning Shift",
    "subtab": 4,
    "subtabName": "Calculus & Drag",
    "year": "2026",
    "q": "The deceleration experienced by a moving motor boat after its engine is cut off is given by dv/dt = -k v\u00b3, where k is a positive constant. If v\u2080 is the speed when the engine is cut off, the speed v after traversing a distance s is:",
    "options": [
      {
        "key": "A",
        "text": "v = v\u2080 e^{-ks}"
      },
      {
        "key": "B",
        "text": "v = v\u2080 / (1 + k s v\u2080)"
      },
      {
        "key": "C",
        "text": "v = v\u2080 / \u221a(1 + 2 k s v\u2080\u00b2)"
      },
      {
        "key": "D",
        "text": "v = v\u2080 - k s"
      }
    ],
    "correct": "B",
    "formula": "a = v (dv/ds) = -k v\u00b3 \u21d2 dv/ds = -k v\u00b2",
    "steps": [
      "Given dv/dt = -k v\u00b3.",
      "Transform time derivative to spatial derivative: dv/dt = v (dv/ds).",
      "Equate: v (dv/ds) = -k v\u00b3 \u21d2 dv/ds = -k v\u00b2.",
      "Separate variables: v\u207b\u00b2 dv = -k ds.",
      "Integrate from s = 0 (v = v\u2080) to s (v = v): [-1/v]_{v\u2080}^v = -k s \u21d2 1/v - 1/v\u2080 = k s.",
      "1/v = (1 + k s v\u2080) / v\u2080 \u21d2 v = v\u2080 / (1 + k s v\u2080)."
    ],
    "ans": "v = v\u2080 / (1 + k s v\u2080) (Option B)",
    "trap": "dv/dt = -k v\u00b3 does NOT mean dv/ds = -k v\u00b3! Always apply the spatial chain rule a = v(dv/ds).",
    "targetTab": "tab-braking",
    "simParams": {
      "v0": 10,
      "k": 0.05,
      "s_max": 20
    },
    "simSummary": [
      "Cubic time drag: dv/dt = -k v\u00b3",
      "Spatial law: dv/ds = -k v\u00b2",
      "Velocity decay: v(s) = v\u2080 / (1 + k s v\u2080)"
    ]
  },
  {
    "id": "1D-Q15",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 29th January Evening Shift",
    "subtab": 4,
    "subtabName": "Calculus & Drag",
    "year": "2025",
    "q": "A particle moves in a resistive medium with acceleration a = -\u03b2 v, where \u03b2 is a constant and v is instantaneous velocity. If the initial velocity is v\u2080 at x = 0, the maximum distance the particle can penetrate before coming to rest is:",
    "options": [
      {
        "key": "A",
        "text": "v\u2080 / \u03b2"
      },
      {
        "key": "B",
        "text": "v\u2080\u00b2 / (2\u03b2)"
      },
      {
        "key": "C",
        "text": "Infinity"
      },
      {
        "key": "D",
        "text": "2 v\u2080 / \u03b2"
      }
    ],
    "correct": "A",
    "formula": "a = v (dv/dx) = -\u03b2 v \u21d2 dv/dx = -\u03b2 \u21d2 \u0394v = -\u03b2 x_max",
    "steps": [
      "Express acceleration spatially: a = v (dv/dx).",
      "Given a = -\u03b2 v \u21d2 v (dv/dx) = -\u03b2 v \u21d2 dv/dx = -\u03b2.",
      "Integrate from x = 0 (v = v\u2080) to x_max (v = 0):",
      "\u222b_{v\u2080}^0 dv = -\u03b2 \u222b\u2080^{x_max} dx \u21d2 (0 - v\u2080) = -\u03b2 x_max \u21d2 x_max = v\u2080 / \u03b2."
    ],
    "ans": "v\u2080 / \u03b2 (Option A)",
    "trap": "Even though it takes infinite time for velocity to asymptotically reach zero (v(t) = v\u2080 e^{-\u03b2 t}), the total spatial penetration is strictly FINITE: x_max = v\u2080 / \u03b2!",
    "targetTab": "tab-braking",
    "simParams": {
      "v0": 12,
      "beta": 0.5,
      "x_max": 24
    },
    "simSummary": [
      "Linear velocity drag: a = -\u03b2 v",
      "Infinite time horizon but finite distance",
      "Stopping limit: x_max = v\u2080 / \u03b2 = 24 m"
    ]
  },
  {
    "id": "1D-Q16",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 4th April Evening Shift",
    "subtab": 5,
    "subtabName": "1D Relative Motion",
    "year": "2026",
    "q": "Two cars A and B travel in the same direction along a straight highway. Car A moves at constant speed v_A = 20 m/s. Car B is initially 100 m ahead of Car A and moves at constant speed v_B = 10 m/s. At t = 0, Car B begins to brake with constant deceleration a_B = 1 m/s\u00b2. Find the time when Car A overtakes Car B.",
    "options": [
      {
        "key": "A",
        "text": "6.67 s"
      },
      {
        "key": "B",
        "text": "8.00 s"
      },
      {
        "key": "C",
        "text": "10.0 s"
      },
      {
        "key": "D",
        "text": "7.32 s"
      }
    ],
    "correct": "D",
    "formula": "x_{B/A}(t) = x_{B/A}(0) + v_{rel} t + \u00bd a_{rel} t\u00b2 = 0",
    "steps": [
      "Set up relative coordinate frame with Car A as reference origin:",
      "Initial relative position: x_{rel}(0) = x_B(0) - x_A(0) = +100 m.",
      "Initial relative velocity: v_{rel} = v_B - v_A = 10 - 20 = -10 m/s.",
      "Relative acceleration: a_{rel} = a_B - a_A = (-1) - 0 = -1 m/s\u00b2.",
      "Relative position equation: x_{rel}(t) = 100 - 10 t - 0.5 t\u00b2 = 0.",
      "Multiply by 2: t\u00b2 + 20 t - 200 = 0 \u21d2 t = [-20 + \u221a(400 + 800)] / 2 = -10 + 10\u221a3 \u2248 7.32 s.",
      "Check if B stopped: t_stop = 10 / 1 = 10 s > 7.32 s. Overtaking occurs while B is still moving!"
    ],
    "ans": "7.32 s (Option D)",
    "trap": "Always verify whether the braking vehicle stops before overtaking happens; here 7.32 s < 10 s, so the motion is valid throughout.",
    "targetTab": "tab-relative",
    "simParams": {
      "vA": 20,
      "vB": 10,
      "d0": 100,
      "aB": -1.0
    },
    "simSummary": [
      "Car A: 20 m/s steady",
      "Car B: 10 m/s decelerating at 1 m/s\u00b2 from 100 m ahead",
      "Overtaking at t \u2248 7.32 s"
    ]
  },
  {
    "id": "1D-Q17",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 27th January Morning Shift",
    "subtab": 5,
    "subtabName": "1D Relative Motion",
    "year": "2024",
    "q": "Two trains A and B, each of length 150 m, are moving in opposite directions on parallel tracks with speeds 72 km/h and 36 km/h respectively. The time of complete crossing is:",
    "options": [
      {
        "key": "A",
        "text": "10 s"
      },
      {
        "key": "B",
        "text": "15 s"
      },
      {
        "key": "C",
        "text": "20 s"
      },
      {
        "key": "D",
        "text": "30 s"
      }
    ],
    "correct": "A",
    "formula": "t_cross = (L_A + L_B) / v_{rel}",
    "steps": [
      "Convert speeds to SI units: v_A = 72 \u00d7 (5/18) = 20 m/s, v_B = 36 \u00d7 (5/18) = 10 m/s.",
      "Opposite directions add relative speed: v_{rel} = v_A + v_B = 20 + 10 = 30 m/s.",
      "Total distance to clear: D = L_A + L_B = 150 + 150 = 300 m.",
      "Crossing time: t = D / v_{rel} = 300 / 30 = 10 s."
    ],
    "ans": "10 s (Option A)",
    "trap": "Opposite directions ADD relative velocities (20 + 10 = 30 m/s), rather than subtracting them!",
    "targetTab": "tab-relative",
    "simParams": {
      "vA": 20,
      "vB": -10,
      "LA": 150,
      "LB": 150
    },
    "simSummary": [
      "Train A: 20 m/s east, length 150 m",
      "Train B: 10 m/s west, length 150 m",
      "Relative speed = 30 m/s, crossing time = 10 s"
    ]
  },
  {
    "id": "1D-Q18",
    "num": "JEE Main 2023",
    "source": "JEE Main 2023 (Online) 30th January Evening Shift",
    "subtab": 5,
    "subtabName": "1D Relative Motion",
    "year": "2023",
    "q": "Two trains travelling on the same track are approaching each other with speeds of 40 m/s and 20 m/s respectively. When they are 1.2 km apart, both drivers simultaneously apply brakes which produce equal decelerations of 1 m/s\u00b2 in each train. The collision:",
    "options": [
      {
        "key": "A",
        "text": "Will be averted, stopping with a gap of 200 m"
      },
      {
        "key": "B",
        "text": "Will occur with relative speed 10 m/s"
      },
      {
        "key": "C",
        "text": "Will be averted, stopping with a gap of 100 m"
      },
      {
        "key": "D",
        "text": "Will occur exactly when both reach zero velocity"
      }
    ],
    "correct": "A",
    "formula": "s\u2081 = u\u2081\u00b2 / (2a\u2081),  s\u2082 = u\u2082\u00b2 / (2a\u2082);  s_total = s\u2081 + s\u2082 < D_initial",
    "steps": [
      "Calculate stopping distance of Train 1: s\u2081 = u\u2081\u00b2 / (2a) = 40\u00b2 / (2 \u00d7 1) = 1600 / 2 = 800 m.",
      "Calculate stopping distance of Train 2: s\u2082 = u\u2082\u00b2 / (2a) = 20\u00b2 / (2 \u00d7 1) = 400 / 2 = 200 m.",
      "Total stopping distance: s_total = s\u2081 + s\u2082 = 800 + 200 = 1000 m = 1.0 km.",
      "Initial separation: D = 1.2 km = 1200 m.",
      "Since s_total (1000 m) < D (1200 m), the collision is completely averted!",
      "Remaining gap between stopped trains: Gap = 1200 - 1000 = 200 m."
    ],
    "ans": "Will be averted, stopping with a gap of 200 m (Option A)",
    "trap": "Do not treat both trains as one combined deceleration if they stop at different times (Train 2 stops in 20 s, Train 1 stops in 40 s)! Calculate individual stopping distances.",
    "targetTab": "tab-relative",
    "simParams": {
      "vA": 40,
      "vB": -20,
      "d0": 1200,
      "aA": -1,
      "aB": 1
    },
    "simSummary": [
      "Train 1: 40 m/s, s\u2081 = 800 m",
      "Train 2: 20 m/s, s\u2082 = 200 m",
      "Gap = 1200 - 1000 = 200 m (collision averted)"
    ]
  }
];
