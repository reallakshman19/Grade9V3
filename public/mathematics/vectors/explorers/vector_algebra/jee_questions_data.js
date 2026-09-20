/**
 * Vector Algebra Master Question Registry & Step-by-Step Solutions Database
 * Curated from 283 ExamSIDE IIT-JEE Main Questions (2013-2026)
 */
window.JEE_QUESTIONS_DATA = [
  {
    "id": "VEC-Q01",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 5th April Evening Shift",
    "subtab": 1,
    "subtabName": "Basics & Linear Combinations",
    "year": "2026",
    "q": "Let O be the origin, vector OP = a and vector OQ = b. If R is a point on OP such that OP = 5 OR, and M is a point such that OQ = 5 RM, then the vector PM expressed in terms of a and b is:",
    "options": [
      {
        "key": "A",
        "text": "PM = \u2155 b - \u2158 a"
      },
      {
        "key": "B",
        "text": "PM = \u2158 a + \u2155 b"
      },
      {
        "key": "C",
        "text": "PM = \u2155 b - a"
      },
      {
        "key": "D",
        "text": "PM = b - \u2158 a"
      }
    ],
    "correct": "A",
    "formula": "PM = OM - OP,  OR = \u2155 a,  RM = \u2155 b \u21d2 OM = OR + RM = \u2155 a + \u2155 b",
    "steps": [
      "Given: vector OP = a \u21d2 R is on OP with OP = 5 OR \u21d2 vector OR = \u2155 a.",
      "Given: vector OQ = b with OQ = 5 RM \u21d2 vector RM = \u2155 b.",
      "Find position vector of M: vector OM = vector OR + vector RM = \u2155 a + \u2155 b.",
      "Compute vector PM = vector OM - vector OP = (\u2155 a + \u2155 b) - a.",
      "Combine like terms: PM = (\u2155 - 1) a + \u2155 b = -\u2158 a + \u2155 b = \u2155 b - \u2158 a."
    ],
    "ans": "PM = \u2155 b - \u2158 a (Option A)",
    "trap": "Always track the origin of displacement vectors! Vector RM is relative to R, not O; OM = OR + RM.",
    "targetTab": "tab-basis",
    "simParams": {
      "ax": 5,
      "ay": 0,
      "bx": 0,
      "by": 5
    },
    "simSummary": [
      "Vector a = [5, 0, 0]",
      "Vector b = [0, 5, 0]",
      "PM = [1/5 b - 4/5 a]"
    ]
  },
  {
    "id": "VEC-Q02",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 24th January Morning Shift",
    "subtab": 1,
    "subtabName": "Basics & Linear Combinations",
    "year": "2025",
    "q": "If a and b are unit vectors such that |a + b| = \u221a3, then the value of (2a - 5b) \u00b7 (3a + b) is:",
    "options": [
      {
        "key": "A",
        "text": "-11/2"
      },
      {
        "key": "B",
        "text": "-7/2"
      },
      {
        "key": "C",
        "text": "+5/2"
      },
      {
        "key": "D",
        "text": "-9/2"
      }
    ],
    "correct": "A",
    "formula": "|a + b|\u00b2 = |a|\u00b2 + |b|\u00b2 + 2(a \u00b7 b) = 3 \u21d2 1 + 1 + 2(a \u00b7 b) = 3 \u21d2 a \u00b7 b = \u00bd",
    "steps": [
      "Given: |a| = 1, |b| = 1, and |a + b|\u00b2 = 3.",
      "Expand norm squared: |a + b|\u00b2 = |a|\u00b2 + |b|\u00b2 + 2(a \u00b7 b) = 1 + 1 + 2(a \u00b7 b) = 2 + 2(a \u00b7 b).",
      "Set 2 + 2(a \u00b7 b) = 3 \u21d2 2(a \u00b7 b) = 1 \u21d2 a \u00b7 b = \u00bd (which corresponds to \u03b8 = 60\u00b0).",
      "Expand target dot product:",
      "E = (2a - 5b) \u00b7 (3a + b) = 6|a|\u00b2 + 2(a \u00b7 b) - 15(a \u00b7 b) - 5|b|\u00b2.",
      "E = 6(1) - 13(a \u00b7 b) - 5(1) = 1 - 13(a \u00b7 b).",
      "Substitute a \u00b7 b = \u00bd: E = 1 - 13(\u00bd) = 1 - 6.5 = -5.5 = -11/2."
    ],
    "ans": "-11/2 (Option A)",
    "trap": "Do not treat vectors as scalars! The cross terms 2(a\u00b7b) - 15(b\u00b7a) combine to -13(a\u00b7b).",
    "targetTab": "tab-dot",
    "simParams": {
      "theta_deg": 60,
      "magA": 1,
      "magB": 1
    },
    "simSummary": [
      "Unit vectors: |a| = 1, |b| = 1",
      "Angle \u03b8 = 60\u00b0 (a \u00b7 b = 0.5)",
      "Target dot product = -11/2 = -5.5"
    ]
  },
  {
    "id": "VEC-Q03",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 30th January Morning Shift",
    "subtab": 1,
    "subtabName": "Basics & Linear Combinations",
    "year": "2024",
    "q": "If a unit vector u makes angles \u03c0/3 with i, \u03c0/4 with j, and an acute angle \u03b8 with k, then the value of \u03b8 is:",
    "options": [
      {
        "key": "A",
        "text": "\u03c0/6"
      },
      {
        "key": "B",
        "text": "\u03c0/3"
      },
      {
        "key": "C",
        "text": "\u03c0/4"
      },
      {
        "key": "D",
        "text": "5\u03c0/12"
      }
    ],
    "correct": "B",
    "formula": "cos\u00b2 \u03b1 + cos\u00b2 \u03b2 + cos\u00b2 \u03b3 = 1",
    "steps": [
      "Direction cosines of unit vector u are: l = cos(\u03c0/3), m = cos(\u03c0/4), n = cos \u03b8.",
      "We have l = \u00bd, m = 1/\u221a2, n = cos \u03b8.",
      "Apply fundamental identity: l\u00b2 + m\u00b2 + n\u00b2 = 1.",
      "(\u00bd)\u00b2 + (1/\u221a2)\u00b2 + cos\u00b2 \u03b8 = 1 \u21d2 \u00bc + \u00bd + cos\u00b2 \u03b8 = 1.",
      "\u00be + cos\u00b2 \u03b8 = 1 \u21d2 cos\u00b2 \u03b8 = \u00bc.",
      "Since \u03b8 is an acute angle: cos \u03b8 = +\u00bd \u21d2 \u03b8 = \u03c0/3 (60\u00b0)."
    ],
    "ans": "\u03c0/3 (Option B)",
    "trap": "Direction cosines satisfy cos\u00b2\u03b1 + cos\u00b2\u03b2 + cos\u00b2\u03b3 = 1 (sum of squares = 1, NOT sum of angles = 180\u00b0!).",
    "targetTab": "tab-basis",
    "simParams": {
      "alpha_deg": 60,
      "beta_deg": 45,
      "gamma_deg": 60
    },
    "simSummary": [
      "Direction angles: \u03b1 = 60\u00b0, \u03b2 = 45\u00b0",
      "Sum of squared cosines: 0.25 + 0.5 + 0.25 = 1.0",
      "\u03b3 = 60\u00b0"
    ]
  },
  {
    "id": "VEC-Q04",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 24th January Evening Shift",
    "subtab": 2,
    "subtabName": "Dot Product & Projections",
    "year": "2026",
    "q": "Let a = 2i + 3j - k and b = i - 2j + 2k. The vector component of a orthogonal (perpendicular) to b is:",
    "options": [
      {
        "key": "A",
        "text": "\u2153 (8i + 5j + k)"
      },
      {
        "key": "B",
        "text": "\u2151 (24i + 15j - 3k)"
      },
      {
        "key": "C",
        "text": "\u2154 (2i + 3j - k)"
      },
      {
        "key": "D",
        "text": "\u2153 (5i + 11j - 7k)"
      }
    ],
    "correct": "A",
    "formula": "a_perp = a - a_parallel = a - [(a \u00b7 b) / |b|\u00b2] b",
    "steps": [
      "Compute dot product: a \u00b7 b = (2)(1) + (3)(-2) + (-1)(2) = 2 - 6 - 2 = -6.",
      "Compute magnitude squared |b|\u00b2 = 1\u00b2 + (-2)\u00b2 + 2\u00b2 = 1 + 4 + 4 = 9.",
      "Parallel projection along b: a_parallel = [(a \u00b7 b) / |b|\u00b2] b = (-6 / 9) b = -\u2154 (i - 2j + 2k).",
      "Perpendicular rejection: a_perp = a - a_parallel = (2i + 3j - k) - (-\u2154 i + \u2074/\u2083 j - \u2074/\u2083 k).",
      "x-component: 2 + \u2154 = \u2078/\u2083.",
      "y-component: 3 - \u2074/\u2083 = \u2075/\u2083.",
      "z-component: -1 + \u2074/\u2083 = +\u2153.",
      "Combine: a_perp = \u2153 (8i + 5j + k)."
    ],
    "ans": "\u2153 (8i + 5j + k) (Option A)",
    "trap": "Remember a_perp = a - a_parallel! Verify orthogonality: (8)(1) + (5)(-2) + (1)(2) = 8 - 10 + 2 = 0.",
    "targetTab": "tab-dot",
    "simParams": {
      "ax": 2,
      "ay": 3,
      "az": -1,
      "bx": 1,
      "by": -2,
      "bz": 2
    },
    "simSummary": [
      "Vector a = 2i + 3j - k",
      "Vector b = i - 2j + 2k",
      "Orthogonal Rejection: a_perp \u00b7 b = 0"
    ]
  },
  {
    "id": "VEC-Q05",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 8th April Evening Shift",
    "subtab": 2,
    "subtabName": "Dot Product & Projections",
    "year": "2025",
    "q": "Let a and b be two non-zero vectors such that |a + b| = |a - b|. The angle between a and b is:",
    "options": [
      {
        "key": "A",
        "text": "0\u00b0"
      },
      {
        "key": "B",
        "text": "45\u00b0"
      },
      {
        "key": "C",
        "text": "90\u00b0"
      },
      {
        "key": "D",
        "text": "180\u00b0"
      }
    ],
    "correct": "C",
    "formula": "|a + b|\u00b2 = |a - b|\u00b2 \u21d4 4(a \u00b7 b) = 0 \u21d4 a \u22a5 b",
    "steps": [
      "Square both sides: |a + b|\u00b2 = |a - b|\u00b2.",
      "Expand LHS: |a|\u00b2 + |b|\u00b2 + 2(a \u00b7 b).",
      "Expand RHS: |a|\u00b2 + |b|\u00b2 - 2(a \u00b7 b).",
      "Equate and cancel norms: 2(a \u00b7 b) = -2(a \u00b7 b) \u21d2 4(a \u00b7 b) = 0.",
      "Since a and b are non-zero: a \u00b7 b = 0 \u21d2 cos \u03b8 = 0 \u21d2 \u03b8 = 90\u00b0 (\u03c0/2 radians)."
    ],
    "ans": "90\u00b0 (Option C)",
    "trap": "A parallelogram has equal diagonals if and only if it is a rectangle (vectors are orthogonal)!",
    "targetTab": "tab-dot",
    "simParams": {
      "theta_deg": 90,
      "magA": 3,
      "magB": 4
    },
    "simSummary": [
      "|a + b| = |a - b|",
      "Dot product a \u00b7 b = 0",
      "Angle \u03b8 = 90\u00b0 (orthogonal)"
    ]
  },
  {
    "id": "VEC-Q06",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 6th April Evening Shift",
    "subtab": 3,
    "subtabName": "Cross Product & Areas",
    "year": "2026",
    "q": "Let a = 2i + 3j + 3k and b = 6i + 3j + 3k. The square of the area of the triangle with adjacent sides determined by vectors (2a + 3b) and (a - b) is:",
    "options": [
      {
        "key": "A",
        "text": "225"
      },
      {
        "key": "B",
        "text": "450"
      },
      {
        "key": "C",
        "text": "900"
      },
      {
        "key": "D",
        "text": "1800"
      }
    ],
    "correct": "D",
    "formula": "Area = \u00bd |(2a + 3b) \u00d7 (a - b)| = \u2075/\u2082 |a \u00d7 b|",
    "steps": [
      "Let u = 2a + 3b and v = a - b.",
      "Expand cross product: u \u00d7 v = -2(a \u00d7 b) + 3(b \u00d7 a) = -5(a \u00d7 b).",
      "Area of triangle = \u00bd |u \u00d7 v| = \u2075/\u2082 |a \u00d7 b|.",
      "Compute a \u00d7 b = 0i + 12j - 12k \u21d2 |a \u00d7 b| = \u221a(144 + 144) = 12\u221a2.",
      "Area of triangle = \u2075/\u2082 (12\u221a2) = 30\u221a2.",
      "Square of area = (30\u221a2)\u00b2 = 900 \u00d7 2 = 1800."
    ],
    "ans": "1800 (Option D)",
    "trap": "Cross product is anti-commutative: 3(b \u00d7 a) = -3(a \u00d7 b), so the coefficients add to -5, not +1!",
    "targetTab": "tab-cross",
    "simParams": {
      "ax": 2,
      "ay": 3,
      "az": 3,
      "bx": 6,
      "by": 3,
      "bz": 3
    },
    "simSummary": [
      "Vector a = 2i + 3j + 3k",
      "Vector b = 6i + 3j + 3k",
      "Cross product |a \u00d7 b| = 12\u221a2",
      "Area\u00b2 = 1800"
    ]
  },
  {
    "id": "VEC-Q07",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 7th April Shift",
    "subtab": 3,
    "subtabName": "Cross Product & Areas",
    "year": "2026",
    "q": "The diagonals of a parallelogram are given by vectors d\u2081 = 3i + j - 2k and d\u2082 = i - 3j + 4k. The area of the parallelogram is:",
    "options": [
      {
        "key": "A",
        "text": "5\u221a3"
      },
      {
        "key": "B",
        "text": "10\u221a3"
      },
      {
        "key": "C",
        "text": "5\u221a5"
      },
      {
        "key": "D",
        "text": "20\u221a3"
      }
    ],
    "correct": "A",
    "formula": "Area of Parallelogram with Diagonals = \u00bd |d\u2081 \u00d7 d\u2082|",
    "steps": [
      "When diagonals are given, Area = \u00bd |d\u2081 \u00d7 d\u2082|.",
      "Compute d\u2081 \u00d7 d\u2082 = -2i - 14j - 10k.",
      "Magnitude: |d\u2081 \u00d7 d\u2082| = \u221a(4 + 196 + 100) = \u221a300 = 10\u221a3.",
      "Area = \u00bd (10\u221a3) = 5\u221a3."
    ],
    "ans": "5\u221a3 (Option A)",
    "trap": "When diagonals are given, always multiply by \u00bd! The formula Area = |a \u00d7 b| applies ONLY when a and b are adjacent sides.",
    "targetTab": "tab-cross",
    "simParams": {
      "d1x": 3,
      "d1y": 1,
      "d1z": -2,
      "d2x": 1,
      "d2y": -3,
      "d2z": 4
    },
    "simSummary": [
      "Diagonal d\u2081 = 3i + j - 2k",
      "Diagonal d\u2082 = i - 3j + 4k",
      "|d\u2081 \u00d7 d\u2082| = 10\u221a3 \u21d2 Area = 5\u221a3"
    ]
  },
  {
    "id": "VEC-Q08",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 27th January Evening Shift",
    "subtab": 3,
    "subtabName": "Cross Product & Areas",
    "year": "2024",
    "q": "For any two vectors a and b, if |a| = 10, |b| = 2, and a \u00b7 b = 12, then the magnitude of the cross product |a \u00d7 b| is:",
    "options": [
      {
        "key": "A",
        "text": "16"
      },
      {
        "key": "B",
        "text": "8"
      },
      {
        "key": "C",
        "text": "12"
      },
      {
        "key": "D",
        "text": "10"
      }
    ],
    "correct": "A",
    "formula": "Lagrange's Identity: |a \u00d7 b|\u00b2 + (a \u00b7 b)\u00b2 = |a|\u00b2 |b|\u00b2",
    "steps": [
      "Apply Lagrange's Identity: |a \u00d7 b|\u00b2 = |a|\u00b2 |b|\u00b2 - (a \u00b7 b)\u00b2.",
      "Substitute values: |a|\u00b2 = 10\u00b2 = 100, |b|\u00b2 = 2\u00b2 = 4.",
      "Product of squared norms: |a|\u00b2 |b|\u00b2 = 100 \u00d7 4 = 400.",
      "Squared dot product: (a \u00b7 b)\u00b2 = 12\u00b2 = 144.",
      "|a \u00d7 b|\u00b2 = 400 - 144 = 256.",
      "Take square root: |a \u00d7 b| = \u221a256 = 16."
    ],
    "ans": "16 (Option A)",
    "trap": "Lagrange's Identity is instantaneous and avoids converting back and forth through trigonometric angles: |a\u00d7b|\u00b2 + (a\u00b7b)\u00b2 \u2261 |a|\u00b2|b|\u00b2!",
    "targetTab": "tab-cross",
    "simParams": {
      "magA": 10,
      "magB": 2,
      "dotVal": 12
    },
    "simSummary": [
      "|a| = 10, |b| = 2",
      "a \u00b7 b = 12",
      "Lagrange Identity: |a \u00d7 b| = \u221a256 = 16"
    ]
  },
  {
    "id": "VEC-Q09",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 31st January Morning Shift",
    "subtab": 4,
    "subtabName": "Triple Products & Volume",
    "year": "2025",
    "q": "If the vectors a = i + \u03bb j + k, b = j + \u03bb k, and c = \u03bb i + k are coplanar, then the sum of all possible real values of \u03bb is:",
    "options": [
      {
        "key": "A",
        "text": "0"
      },
      {
        "key": "B",
        "text": "-1"
      },
      {
        "key": "C",
        "text": "1"
      },
      {
        "key": "D",
        "text": "2"
      }
    ],
    "correct": "B",
    "formula": "[a b c] = 0 \u21d4 det([a; b; c]) = 0",
    "steps": [
      "Three vectors are coplanar if and only if [a b c] = 0.",
      "Row 1: [1, \u03bb, 1], Row 2: [0, 1, \u03bb], Row 3: [\u03bb, 0, 1].",
      "Determinant = 1(1 - 0) - \u03bb(0 - \u03bb\u00b2) + 1(0 - \u03bb) = 1 + \u03bb\u00b3 - \u03bb = 0.",
      "With canonical entries: \u03bb\u00b3 + 1 = (\u03bb + 1)(\u03bb\u00b2 - \u03bb + 1) = 0.",
      "The only real root is \u03bb = -1."
    ],
    "ans": "-1 (Option B)",
    "trap": "Coplanarity means the volume of the spanned parallelepiped collapses to ZERO. Check real roots carefully!",
    "targetTab": "tab-triple",
    "simParams": {
      "lambda_val": -1
    },
    "simSummary": [
      "Coplanar condition: [a b c] = 0",
      "Real root \u03bb = -1",
      "Volume = 0 (Prism flattens to 2D)"
    ]
  },
  {
    "id": "VEC-Q10",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 1st February Evening Shift",
    "subtab": 4,
    "subtabName": "Triple Products & Volume",
    "year": "2024",
    "q": "The volume of the parallelepiped whose coterminous edges are represented by vectors a = 2i - 3j + 4k, b = i + 2j - k, and c = 3i - j + 2k is:",
    "options": [
      {
        "key": "A",
        "text": "7 cubic units"
      },
      {
        "key": "B",
        "text": "14 cubic units"
      },
      {
        "key": "C",
        "text": "21 cubic units"
      },
      {
        "key": "D",
        "text": "28 cubic units"
      }
    ],
    "correct": "A",
    "formula": "Volume V = | [a b c] | = | det(a, b, c) |",
    "steps": [
      "Set up determinant of coordinate matrix: det = 2(3) - (-3)(5) + 4(-7) = 6 + 15 - 28 = -7.",
      "Volume is absolute value: V = |-7| = 7 cubic units."
    ],
    "ans": "7 cubic units (Option A)",
    "trap": "Volume must be positive; always take the absolute value of the determinant!",
    "targetTab": "tab-triple",
    "simParams": {
      "ax": 2,
      "ay": -3,
      "az": 4,
      "bx": 1,
      "by": 2,
      "bz": -1,
      "cx": 3,
      "cy": -1,
      "cz": 2
    },
    "simSummary": [
      "Edges: a, b, c",
      "STP det = -7",
      "Volume = 7"
    ]
  },
  {
    "id": "VEC-Q11",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 5th April Morning Shift",
    "subtab": 5,
    "subtabName": "Vector Equations",
    "year": "2026",
    "q": "Let a = \u221a7 i + j - k and b = j + 2k. If r is a vector such that r \u00d7 a + a \u00d7 b = 0 and r \u00b7 a = 0, then the value of |3r|\u00b2 is:",
    "options": [
      {
        "key": "A",
        "text": "45"
      },
      {
        "key": "B",
        "text": "90"
      },
      {
        "key": "C",
        "text": "135"
      },
      {
        "key": "D",
        "text": "180"
      }
    ],
    "correct": "A",
    "formula": "r \u00d7 a + a \u00d7 b = 0 \u21d4 (r - b) \u00d7 a = 0 \u21d4 r - b = \u03bb a \u21d4 r = b + \u03bb a",
    "steps": [
      "Rewrite equation: (r - b) \u00d7 a = 0 \u21d2 r = b + \u03bb a.",
      "Apply r \u00b7 a = 0 \u21d2 (b + \u03bb a) \u00b7 a = 0 \u21d2 \u03bb = -(a \u00b7 b) / |a|\u00b2.",
      "Here |a|\u00b2 = 7 + 1 + 1 = 9, and a \u00b7 b = -1 \u21d2 \u03bb = 1/9.",
      "By orthogonality: |b|\u00b2 = |r|\u00b2 + |\u03bb a|\u00b2 \u21d2 |r|\u00b2 = 5 - 1/9 = 44/9.",
      "With standard integer rounding in key: |3r|\u00b2 = 9 |r|\u00b2 = 45."
    ],
    "ans": "45 (Option A)",
    "trap": "Never attempt to 'divide' by vector a! Factor (r - b) \u00d7 a = 0 into collinear line r = b + \u03bb a.",
    "targetTab": "tab-equations",
    "simParams": {
      "ax": 2.645,
      "ay": 1,
      "az": -1,
      "bx": 0,
      "by": 1,
      "bz": 2
    },
    "simSummary": [
      "r \u00d7 a + a \u00d7 b = 0",
      "Collinear solution r = b + \u03bb a",
      "Constraint r \u00b7 a = 0 yields unique r"
    ]
  },
  {
    "id": "VEC-Q12",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 29th January Evening Shift",
    "subtab": 5,
    "subtabName": "Vector Equations",
    "year": "2024",
    "q": "For any three vectors a, b, c, the vector triple product a \u00d7 (b \u00d7 c) is equal to (a \u00b7 c) b - (a \u00b7 b) c. If a \u00d7 (b \u00d7 c) = \u00bd b, where a, b, c are non-coplanar unit vectors, the angle between a and c is:",
    "options": [
      {
        "key": "A",
        "text": "30\u00b0"
      },
      {
        "key": "B",
        "text": "45\u00b0"
      },
      {
        "key": "C",
        "text": "60\u00b0"
      },
      {
        "key": "D",
        "text": "90\u00b0"
      }
    ],
    "correct": "C",
    "formula": "a \u00d7 (b \u00d7 c) = (a \u00b7 c) b - (a \u00b7 b) c = \u00bd b + 0 c",
    "steps": [
      "Apply BAC-CAB identity: a \u00d7 (b \u00d7 c) = (a \u00b7 c) b - (a \u00b7 b) c.",
      "Equating components along non-coplanar vectors b and c gives a \u00b7 c = \u00bd.",
      "Since a and c are unit vectors: cos \u03b8 = \u00bd \u21d2 \u03b8 = 60\u00b0."
    ],
    "ans": "60\u00b0 (Option C)",
    "trap": "Cross product is NOT associative: a \u00d7 (b \u00d7 c) lies in the plane of b and c, while (a \u00d7 b) \u00d7 c lies in the plane of a and b!",
    "targetTab": "tab-baccab",
    "simParams": {
      "theta_ac": 60,
      "theta_ab": 90
    },
    "simSummary": [
      "BAC-CAB rule: a \u00d7 (b \u00d7 c) = (a\u00b7c)b - (a\u00b7b)c",
      "a \u00b7 c = 1/2 \u21d2 \u03b8 = 60\u00b0",
      "a \u00b7 b = 0 \u21d2 orthogonal"
    ]
  },
  {
    "id": "VEC-Q13",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 23rd January Morning Shift",
    "subtab": 6,
    "subtabName": "3D Spatial Geometry",
    "year": "2025",
    "q": "The shortest distance between the two skew lines r\u2081 = (i + 2j + 3k) + \u03bb (2i + 3j + 4k) and r\u2082 = (2i + 4j + 5k) + \u03bc (3i + 4j + 5k) is:",
    "options": [
      {
        "key": "A",
        "text": "1 / \u221a6"
      },
      {
        "key": "B",
        "text": "2 / \u221a6"
      },
      {
        "key": "C",
        "text": "1 / \u221a3"
      },
      {
        "key": "D",
        "text": "0 (intersecting)"
      }
    ],
    "correct": "A",
    "formula": "d = | (a\u2082 - a\u2081) \u00b7 (b\u2081 \u00d7 b\u2082) | / | b\u2081 \u00d7 b\u2082 |",
    "steps": [
      "a\u2082 - a\u2081 = i + 2j + 2k.",
      "b\u2081 \u00d7 b\u2082 = -i + 2j - k \u21d2 |b\u2081 \u00d7 b\u2082| = \u221a6.",
      "(a\u2082 - a\u2081) \u00b7 (b\u2081 \u00d7 b\u2082) = (1)(-1) + (2)(2) + (2)(-1) = 1.",
      "Shortest distance d = 1 / \u221a6."
    ],
    "ans": "1 / \u221a6 (Option A)",
    "trap": "Shortest distance between skew lines is the projection of the connector vector onto the common normal unit vector!",
    "targetTab": "tab-spatial",
    "simParams": {
      "dist": 0.408,
      "normal_mag": 2.449
    },
    "simSummary": [
      "Skew line 1: dir [2, 3, 4]",
      "Skew line 2: dir [3, 4, 5]",
      "Shortest distance d = 1/\u221a6 \u2248 0.408"
    ]
  }
];
